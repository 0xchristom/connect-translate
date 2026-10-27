/// <reference lib="webworker" />
/**
 * Pamięć modeli w prywatnym systemie plików przeglądarki (OPFS). Cache Storage w Chrome
 * nie przyjmuje plików po 400+ MB („Unexpected internal error”), a NLLB ma dwa takie.
 * Plik jest ważny dopiero ze znacznikiem „.done” — przerwane pobieranie nie udaje gotowego.
 */
type Progress = (data: { progress: number; loaded: number; total: number }) => void;

const DONE = ".done";

function fileName(key: string) {
  return key.replace(/[^\w.-]+/g, "_");
}

async function directory() {
  const root = await navigator.storage.getDirectory();
  return root.getDirectoryHandle("models", { create: true });
}

/** Kasuje wszystkie pliki jednego modelu z Hugging Face (np. żeby zwolnić 3 GB). */
export async function removeModel(id: string) {
  const dir = await directory();
  const marker = "_" + fileName(id) + "_resolve_";
  const names: string[] = [];
  // keys() jest w każdej przeglądarce z OPFS, tylko typy TypeScriptu jeszcze go nie znają.
  const keys = (dir as unknown as { keys(): AsyncIterable<string> }).keys();
  for await (const name of keys) if (name.includes(marker)) names.push(name);
  await Promise.all(names.map((name) => dir.removeEntry(name)));
}

export const opfsCache = {
  async match(key: string) {
    try {
      const dir = await directory();
      const name = fileName(key);
      await dir.getFileHandle(name + DONE);
      const file = await (await dir.getFileHandle(name)).getFile();
      return new Response(file, { headers: { "content-length": String(file.size) } });
    } catch {
      return undefined;
    }
  },

  async put(key: string, response: Response, progress?: Progress) {
    const dir = await directory();
    const name = fileName(key);
    await dir.removeEntry(name + DONE).catch(() => {});
    const writable = await (await dir.getFileHandle(name, { create: true })).createWritable();
    const total = Number(response.headers.get("content-length")) || 0;
    let loaded = 0;
    const counter = new TransformStream<Uint8Array, Uint8Array>({
      transform(chunk, controller) {
        loaded += chunk.byteLength;
        progress?.({ progress: total ? (loaded / total) * 100 : 0, loaded, total });
        controller.enqueue(chunk);
      },
    });
    if (response.body) await response.body.pipeThrough(counter).pipeTo(writable);
    else await writable.close();
    await dir.getFileHandle(name + DONE, { create: true });
  },
};

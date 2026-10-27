import { createHash } from "node:crypto";
import { mkdir, writeFile, access } from "node:fs/promises";
import { categories, renderPhrase } from "../src/data/phrases.ts";
import { coachWords, joins } from "../src/data/words.ts";

const outDir = new URL("../public/audio/", import.meta.url);
const mapFile = new URL("../src/data/audio-map.ts", import.meta.url);

function audioId(text) {
  return createHash("sha1").update(text).digest("hex").slice(0, 12);
}

const texts = new Set();
for (const category of categories) {
  for (const phrase of category.phrases) {
    for (const speaker of ["m", "f"]) {
      texts.add(renderPhrase(phrase, speaker).thai);
      for (const word of coachWords(phrase, speaker)) texts.add(word.th);
    }
    for (const answer of phrase.answers ?? []) texts.add(answer.th);
  }
}

for (const item of joins) texts.add(item.th);

await mkdir(outDir, { recursive: true });

async function fetchClip(text) {
  const url =
    "https://translate.googleapis.com/translate_tts?ie=UTF-8&client=gtx&tl=th&q=" + encodeURIComponent(text);
  const response = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
  if (!response.ok) throw new Error(String(response.status));
  const bytes = Buffer.from(await response.arrayBuffer());
  if (bytes.length < 400) throw new Error("short " + bytes.length);
  return bytes;
}

const entries = [...texts].sort();
let done = 0;
for (const text of entries) {
  const id = audioId(text);
  const file = new URL(id + ".mp3", outDir);
  try {
    await access(file);
    done += 1;
    continue;
  } catch {
    /* download */
  }
  let lastError = "";
  for (let attempt = 0; attempt < 4; attempt += 1) {
    try {
      const bytes = await fetchClip(text);
      await writeFile(file, bytes);
      lastError = "";
      break;
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error);
      await new Promise((resolve) => setTimeout(resolve, 400 * (attempt + 1)));
    }
  }
  if (lastError) {
    console.error("FAIL", text, lastError);
    process.exitCode = 1;
  } else {
    done += 1;
    if (done % 20 === 0) console.log(done + "/" + entries.length);
  }
}

const lines = entries.map((text) => `  ${JSON.stringify(text)}: ${JSON.stringify(audioId(text) + ".mp3")},`);
await writeFile(
  mapFile,
  "export const audioMap: Record<string, string> = {\n" + lines.join("\n") + "\n};\n",
);
console.log("clips", done, "of", entries.length);

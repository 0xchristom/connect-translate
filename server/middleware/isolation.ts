/**
 * Lets ONNX Runtime run speech recognition on several threads: SharedArrayBuffer needs a
 * cross-origin-isolated document. Document-Isolation-Policy isolates just this document,
 * but Chrome for Android long lacked it, so recognition there ran on one core — several
 * times slower. COOP + COEP `credentialless` isolate it too (static files get the same pair
 * from public/_headers). The cost — no `window.opener` across origins — doesn't matter here:
 * the app has no sign-in popup. Browsers that know neither stay single-threaded.
 */
interface IsolationEvent {
  url: URL;
}

export default async function isolationMiddleware(
  _event: IsolationEvent,
  next: () => unknown | Promise<unknown>,
): Promise<unknown> {
  const result = await next();
  if (
    !(result instanceof Response) ||
    !String(result.headers.get("content-type") ?? "").includes("text/html")
  ) {
    return result;
  }
  const headers = new Headers(result.headers);
  headers.set("document-isolation-policy", "isolate-and-credentialless");
  headers.set("cross-origin-opener-policy", "same-origin");
  headers.set("cross-origin-embedder-policy", "credentialless");
  return new Response(result.body, {
    status: result.status,
    statusText: result.statusText,
    headers,
  });
}

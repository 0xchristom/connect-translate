/**
 * Lets ONNX Runtime run speech recognition on several threads: SharedArrayBuffer needs a
 * cross-origin-isolated document. Document-Isolation-Policy isolates just this document,
 * so unlike COOP/COEP it keeps `window.opener` working for the auth popup. Browsers that
 * don't know the header ignore it and recognition stays single-threaded.
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
  return new Response(result.body, {
    status: result.status,
    statusText: result.statusText,
    headers,
  });
}

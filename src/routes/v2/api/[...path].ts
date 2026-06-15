import type { APIEvent } from "@solidjs/start/server";

async function proxy(event: APIEvent) {
  const url = new URL(event.request.url);
  const target = `https://api-prod.bdsmlr.com${url.pathname}${url.search}`;

  const upstream = await fetch(target, {
    method: event.request.method,
    headers: event.request.headers,
    body: event.request.method !== "GET" && event.request.method !== "HEAD"
      ? await event.request.text()
      : undefined,
  });

  const clean = new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
  });

  for (const [key, value] of upstream.headers) {
    const lower = key.toLowerCase();
    if (lower !== "content-encoding" && lower !== "content-length" && lower !== "transfer-encoding") {
      clean.headers.set(key, value);
    }
  }

  clean.headers.set('Cache-Control', 'public, max-age=60');

  return clean;
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
export const HEAD = proxy;

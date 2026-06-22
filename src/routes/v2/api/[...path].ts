import type { APIEvent } from "@solidjs/start/server";

const CACHE_CONFIG: Record<string, string> = {
  // Auth endpoints — never cache
  "/v2/api/auth/login": "no-store",
  "/v2/api/sign-url": "no-store",

  // Stable lookups — long cache
  "/v2/api/resolve-identifier": "public, max-age=86400",
  "/v2/api/get-blog": "public, max-age=3600",

  // Semi-stable — moderate cache
  "/v2/api/blog-follow-graph": "public, max-age=300",
  "/v2/api/list-blog-top-tags": "public, max-age=300",

  // Post detail — short cache
  "/v2/api/get-post-detail": "public, max-age=60",

  // Feed/search — minimum 60s
  "/v2/api/list-blog-activity": "public, max-age=60",
  "/v2/api/search-posts-by-tag": "public, max-age=60",
  "/v2/api/list-blogs-recent-activity": "public, max-age=60",
};

function getCacheControl(pathname: string): string {
  return CACHE_CONFIG[pathname] ?? "public, max-age=60";
}

async function proxy(event: APIEvent) {
  const url = new URL(event.request.url);
  const target = `https://api-prod.bdsmlr.com${url.pathname}${url.search}`;

  const upstream = await fetch(target, {
    method: event.request.method,
    headers: event.request.headers,
    body:
      event.request.method !== "GET" && event.request.method !== "HEAD"
        ? await event.request.text()
        : undefined,
  });

  const clean = new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
  });

  for (const [key, value] of upstream.headers) {
    const lower = key.toLowerCase();
    if (
      lower !== "content-encoding" &&
      lower !== "content-length" &&
      lower !== "transfer-encoding"
    ) {
      clean.headers.set(key, value);
    }
  }

  clean.headers.set("Cache-Control", getCacheControl(url.pathname));

  return clean;
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
export const HEAD = proxy;

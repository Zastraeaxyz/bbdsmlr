export type MediaType = "image" | "video";

export function getMediaType(url: string): MediaType {
  const ext = url.split("?")[0].split(".").pop()?.toLowerCase();
  if (!ext) return "image";
  if (["mp4", "webm", "ogg", "mov", "avi"].includes(ext)) return "video";
  return "image";
}

export function transformMediaUrl(url: string): string {
  const qidx = url.indexOf("?");
  const baseUrl = qidx !== -1 ? url.slice(0, qidx) : url;
  const query = qidx !== -1 ? url.slice(qidx) : "";
  const m = baseUrl.match(
    /^https:\/\/media\.bdsmlr\.com\/([^/]+)\/s3:\/\/ocdn(\d+)\.bdsmlr\.com\/(.+)/,
  );
  if (m) return `https://cdn${m[2]}.bdsmlr.com/${m[3]}${query}`;
  return url;
}

export function sanitizeHtml(html: string): string {
  const cleaned = html.replace(/<[a-z][a-z0-9]*\b[^>]*>/gi, (tag) => {
    if (/^<p\b/i.test(tag)) return "<p>";
    return tag.replace(/\sstyle\s*=\s*["'][^"']*["']/gi, "");
  });
  // Skip empty paragraph content (e.g. <p><br></p>)
  if (/^\s*<p>\s*<br\b[^>]*>\s*<\/p>\s*$/i.test(cleaned)) return "";
  return cleaned;
}

export function processContentHtml(html: string, files?: string[]): string {
  if (!files || files.length === 0) return html;

  const fileMap = new Map<string, string>();
  for (const url of files) {
    const transformed = transformMediaUrl(url);
    const filename = transformed.split("/").pop()?.split("?")[0];
    if (filename) fileMap.set(filename, transformed);
  }

  return html.replace(
    /<img\b[^>]*src\s*=\s*["']([^"']*)["'][^>]*>/gi,
    (_, src) => {
      const cdnFilename = src.split("/").pop()?.split("?")[0];
      const url = (cdnFilename && fileMap.get(cdnFilename)) || src;

      const type = getMediaType(url);
      if (type === "video") {
        return `<video src="${url}" muted controls preload="metadata"></video>`;
      }
      return `<img src="${url}" alt="" loading="lazy" />`;
    },
  );
}

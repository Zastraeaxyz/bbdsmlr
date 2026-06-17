export type MediaType = "image" | "video";

export function getMediaType(url: string): MediaType {
  const ext = url.split("?")[0].split(".").pop()?.toLowerCase();
  if (!ext) return "image";
  if (["mp4", "webm", "ogg", "mov", "avi"].includes(ext)) return "video";
  return "image";
}

export function transformMediaUrl(url: string, size: string = "feed"): string {
  const m = url.match(/^https:\/\/(ocdn|cdn)(\d+)\.bdsmlr\.com\/(.+)/);
  if (m) {
    const ext = m[3].split("?")[0].split(".").pop()?.toLowerCase();
    const actualSize = ext && ["gif", "mp4", "webm", "ogg", "mov", "avi"].includes(ext) ? "raw" : size;
    return `https://media.bdsmlr.com/${actualSize}/s3://ocdn${m[2]}.bdsmlr.com/${m[3]}`;
  }
  return url;
}

export function upgradeToLightbox(url: string): string {
  return url.replace(/https:\/\/media\.bdsmlr\.com\/(feed|masonry)\//, "https://media.bdsmlr.com/lightbox/");
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

export function processContentHtml(html: string, files?: string[], size: string = "feed"): string {
  if (!files || files.length === 0) return html;

  const fileMap = new Map<string, string>();
  for (const url of files) {
    const transformed = transformMediaUrl(url, size);
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

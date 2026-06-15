import type { APIEvent } from "@solidjs/start/server";
import { zip } from "fflate";
import { transformMediaUrl } from "~/lib/sanitize";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const DOWNLOAD_DIR = path.resolve("./downloads");

function filenameFromUrl(url: string): string {
  const path = url.split("/").pop() || "image";
  return path.split("?")[0];
}

const FETCH_HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
  "Accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
  "Referer": "https://bdsmlr.com/",
};

export async function GET(event: APIEvent) {
  const rawUrl = new URL(event.request.url).searchParams.get("url");
  if (!rawUrl) {
    return new Response(JSON.stringify({ error: "Missing url parameter" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const url = transformMediaUrl(rawUrl);

  try {
    const response = await fetch(url, { headers: FETCH_HEADERS });
    if (!response.ok) {
      return new Response(JSON.stringify({ error: `Failed to fetch image: ${response.status}` }), {
        status: 502,
        headers: { "Content-Type": "application/json" },
      });
    }

    const contentType = response.headers.get("content-type") || "application/octet-stream";
    const filename = filenameFromUrl(url);
    const buffer = await response.arrayBuffer();
    const bytes = new Uint8Array(buffer);

    await mkdir(DOWNLOAD_DIR, { recursive: true });
    await writeFile(path.join(DOWNLOAD_DIR, filename), bytes);
    console.log(`[download] saved ${filename} (${bytes.length} bytes) to ${DOWNLOAD_DIR}`);

    return new Response(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Length": String(buffer.byteLength),
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (e) {
    console.error(`Error fetching ${url}:`, e);
    return new Response(JSON.stringify({ error: "Failed to fetch image" }), {
      status: 502,
      headers: { "Content-Type": "application/json" },
    });
  }
}

async function downloadAndSave(url: string): Promise<{ data: Uint8Array; name: string; contentType: string } | null> {
  try {
    const response = await fetch(url, { headers: FETCH_HEADERS });
    if (!response.ok) {
      console.error(`Failed to fetch ${url}: ${response.status}`);
      return null;
    }
    const arrayBuffer = await response.arrayBuffer();
    const data = new Uint8Array(arrayBuffer);
    const name = filenameFromUrl(url);
    const contentType = response.headers.get("content-type") || "application/octet-stream";

    await mkdir(DOWNLOAD_DIR, { recursive: true });
    await writeFile(path.join(DOWNLOAD_DIR, name), data);
    console.log(`[download] saved ${name} (${data.length} bytes) to ${DOWNLOAD_DIR}`);

    return { data, name, contentType };
  } catch (e) {
    console.error(`Error fetching ${url}:`, e);
    return null;
  }
}

function createZip(files: Record<string, Uint8Array>): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    zip(files, { level: 6 }, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
}

function errorResponse(message: string, status = 500): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(event: APIEvent) {
  let body: {
    urls?: string[];
    blogName?: string;
    postId?: number;
    preserveOrder?: boolean;
  };
  try {
    body = await event.request.json();
  } catch {
    return errorResponse("Invalid JSON", 400);
  }

  const rawUrls = body.urls?.filter((u) => typeof u === "string" && u.length > 0) ?? [];
  const urls = rawUrls.map(transformMediaUrl);
  if (urls.length === 0) {
    return errorResponse("No URLs provided", 400);
  }

  const blogName = body.blogName || "unknown";
  const postId = body.postId ?? 0;
  const preserveOrder = body.preserveOrder ?? true;

  // Single file — return directly with template name
  if (urls.length === 1) {
    const result = await downloadAndSave(urls[0]);
    if (!result) {
      return errorResponse("Failed to download image", 502);
    }

    const { data, name, contentType } = result;
    const ext = name.split(".").pop() || "jpg";
    const filename = `bbdsmlr_${blogName}_${postId}.${ext}`;

    return new Response(data, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Length": String(data.length),
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  }

  // Multiple files — create ZIP
  const files: Record<string, Uint8Array> = {};
  for (let i = 0; i < urls.length; i++) {
    const result = await downloadAndSave(urls[i]);
    if (result) {
      const { data, name } = result;
      const ext = name.split(".").pop() || "jpg";
      const baseName = preserveOrder
        ? `bbdsmlr_${blogName}_${postId}_${i}.${ext}`
        : name;

      // Ensure unique filenames
      let uniqueName = baseName;
      let counter = 1;
      while (files[uniqueName]) {
        const parts = baseName.split(".");
        if (parts.length > 1) {
          const ext = parts.pop();
          uniqueName = `${parts.join(".")}_${counter}.${ext}`;
        } else {
          uniqueName = `${baseName}_${counter}`;
        }
        counter++;
      }
      files[uniqueName] = data;
    }
  }

  if (Object.keys(files).length === 0) {
    return errorResponse("Failed to download any images", 502);
  }

  try {
    const zipData = await createZip(files);
    const zipFilename = `bbdsmlr_${blogName}_${postId}.zip`;
    return new Response(zipData, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Length": String(zipData.byteLength),
        "Content-Disposition": `attachment; filename="${zipFilename}"`,
      },
    });
  } catch (e) {
    console.error("ZIP creation failed:", e);
    return errorResponse("Failed to create ZIP", 500);
  }
}

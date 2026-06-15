export async function downloadImages(options: {
  urls: string[];
  blogName: string;
  postId: number;
  preserveOrder?: boolean;
}) {
  const { urls, blogName, postId, preserveOrder = true } = options;
  if (urls.length === 0) return;

  const response = await fetch("/api/download", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ urls, blogName, postId, preserveOrder }),
  });

  if (!response.ok) {
    const text = await response.text();
    console.error("Download failed:", response.status, text);
    alert("Failed to download images. See console for details.");
    return;
  }

  const blob = await response.blob();

  const ext =
    urls[0]
      .split("/")
      .pop()
      ?.split("?")[0]
      .split(".")
      .pop() || "jpg";
  const suggestedName =
    urls.length === 1
      ? `bbdsmlr_${blogName}_${postId}.${ext}`
      : `bbdsmlr_${blogName}_${postId}.zip`;

  // Try File System Access API for a Save As prompt
  if ("showSaveFilePicker" in window) {
    try {
      const extMatch = suggestedName.match(/\.([a-zA-Z0-9]+)$/);
      const ext = extMatch ? `.${extMatch[1]}` : undefined;
      const handle = await window.showSaveFilePicker!({
        suggestedName,
        types: [
          {
            description: suggestedName.endsWith(".zip")
              ? "ZIP Archive"
              : "Image",
            accept: ext
              ? { [blob.type || "application/octet-stream"]: [ext] }
              : { "*/*": [".*"] },
          },
        ],
      });
      const writable = await handle.createWritable();
      await writable.write(blob);
      await writable.close();
      return;
    } catch (e) {
      if ((e as Error).name === "AbortError") return;
      console.error("showSaveFilePicker failed", e);
    }
  }

  // Fallback to <a download>
  const blobUrl = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = blobUrl;
  a.download = suggestedName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(blobUrl);
}

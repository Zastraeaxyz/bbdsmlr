export function transformMediaUrl(url: string): string {
  const qidx = url.indexOf('?')
  const baseUrl = qidx !== -1 ? url.slice(0, qidx) : url
  const query = qidx !== -1 ? url.slice(qidx) : ''
  const m = baseUrl.match(/^https:\/\/media\.bdsmlr\.com\/feed\/s3:\/\/ocdn(\d+)\.bdsmlr\.com\/(.+)/)
  if (m) return `https://cdn${m[1]}.bdsmlr.com/${m[2]}${query}`
  return url
}

export function sanitizeHtml(html: string): string {
  return html.replace(/<[a-z][a-z0-9]*\b[^>]*>/gi, (tag) => {
    if (/^<p\b/i.test(tag)) return '<p>'
    return tag.replace(/\sstyle\s*=\s*["'][^"']*["']/gi, '')
  })
}

export function processContentHtml(html: string, files?: string[]): string {
  if (!files || files.length === 0) return html

  const fileMap = new Map<string, string>()
  for (const url of files) {
    const transformed = transformMediaUrl(url)
    const filename = transformed.split('/').pop()?.split('?')[0]
    if (filename) fileMap.set(filename, transformed)
  }

  return html.replace(/<img\b[^>]*src\s*=\s*["']([^"']*)["'][^>]*>/gi, (_, src) => {
    const cdnFilename = src.split('/').pop()?.split('?')[0]
    const url = (cdnFilename && fileMap.get(cdnFilename)) || src

    const isGif = /\.gif(?:\?|$)/i.test(url)
    const videoAttrs = isGif
      ? 'muted autoplay loop playsinline controls'
      : 'muted controls'

    return `<div class="media-shell">`
      + `<img src="${url}" alt="" loading="lazy" onerror="this.style.display='none'" />`
      + `<video src="${url}" ${videoAttrs} preload="metadata" onerror="this.style.display='none'"></video>`
      + `</div>`
  })
}

export function sanitizeHtml(html: string): string {
  return html.replace(/<[a-z][a-z0-9]*\b[^>]*>/gi, (tag) => {
    if (/^<p\b/i.test(tag)) return '<p>'
    return tag.replace(/\sstyle\s*=\s*["'][^"']*["']/gi, '')
  })
}

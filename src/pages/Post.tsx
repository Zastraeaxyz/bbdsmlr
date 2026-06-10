import { createSignal, createEffect, For, Show } from 'solid-js'
import { useParams, A } from '@solidjs/router'
import { getCurrentUser, getPostDetail, PostType, PostVariant, type Post } from '../lib/api'
import { sanitizeHtml, processContentHtml, transformMediaUrl } from '../lib/sanitize'
import Header from '../components/Header'
import { ReblogAttribution } from '../components/ReblogAttribution'
import { LightBox } from '../components/LightBox'

export default function PostPage() {
  const params = useParams()
  const user = getCurrentUser()

  const [post, setPost] = createSignal<Post | null>(null)
  const [loading, setLoading] = createSignal(true)
  const [error, setError] = createSignal('')
  const [lightboxUrl, setLightboxUrl] = createSignal<string | null>(null)

  createEffect(() => {
    const postId = Number(params.id)
    if (!postId) {
      setError('Invalid post ID')
      setLoading(false)
      return
    }
    setLoading(true)
    setError('')
    getPostDetail(postId)
      .then((data) => {
        if (data.error) {
          setError(data.error)
          return
        }
        setPost(data.post ?? null)
      })
      .catch((err: unknown) => setError((err as Error)?.message || 'Failed to load post'))
      .finally(() => setLoading(false))
  })

  return (
    <div class="home-page">
      <Header info={user?.blog_name || user?.username || undefined}>
        <A href="/" class="btn-ghost">Home</A>
        {user && <A href={`/${user.blog_name}`} class="btn-ghost">My feed</A>}
      </Header>
      <main>
        {error() && <p class="error">{error()}</p>}
        {loading() && <p class="loading">Loading post…</p>}
        <Show when={!loading() && post()}>
          <PostDetail post={post()!} onImageClick={setLightboxUrl} />
        </Show>
      </main>
      <LightBox url={lightboxUrl()} onClose={() => setLightboxUrl(null)} />
    </div>
  )
}

function PostDetail(props: { post: Post; onImageClick?: (url: string) => void }) {
  const p = props.post

  const postTypeLabel = (type?: number) => {
    switch (type) {
      case 0: return 'General'
      case 1: return 'Text'
      case 2: return 'Image'
      case 3: return 'Video'
      case 4: return 'Audio'
      case 5: return 'Link'
      case 6: return 'Poll'
      case 7: return 'Quote'
      default: return 'Post'
    }
  }

  const imageUrls = () => {
    const c = p.content
    if (!c) return []
    if (c.files && c.files.length > 0) return c.files.map(transformMediaUrl)
    if (c.thumbnail) return [transformMediaUrl(c.thumbnail)]
    return []
  }

  const contentHtml = () => {
    const c = p.content
    if (!c?.html) return null
    const processed = p.type === PostType.Text ? processContentHtml(c.html, c.files) : c.html
    return sanitizeHtml(processed)
  }

  return (
    <article class="post-detail">
      <div class="post-detail-header">
        <A href={`/${p.blogName}`} class="post-detail-blog">{p.blogName}</A>
        <span class="feed-card-type">{postTypeLabel(p.type)}</span>
        {p.createdAtUnix && (
          <span class="post-detail-time">
            {new Date(p.createdAtUnix * 1000).toLocaleString()}
          </span>
        )}
      </div>

      <ReblogAttribution originBlogName={p.originBlogName} originPostId={p.originPostId} variant={p.variant} />

      {p.title && <h2 class="post-detail-title">{p.title}</h2>}
      {contentHtml() && <div class="post-detail-body" innerHTML={contentHtml()!} onClick={(e) => {
        const target = e.target as HTMLElement
        if ((target.tagName === 'IMG' || target.tagName === 'VIDEO') && target.getAttribute('src')) {
          props.onImageClick?.(target.getAttribute('src')!)
        }
      }} />}

      {p.type !== PostType.Text && imageUrls().length > 0 && (
        <div class="post-detail-images">
          <For each={imageUrls()}>
            {(url) => (
              <div class="media-shell">
                <img
                  src={url}
                  alt=""
                  loading="lazy"
                  onClick={() => props.onImageClick?.(url)}
                  onError={(e) => { e.currentTarget.style.display = 'none' }}
                />
                <video
                  src={url}
                  muted
                  playsinline
                  controls
                  loop
                  preload="metadata"
                  onClick={() => props.onImageClick?.(url)}
                  onError={(e) => { e.currentTarget.style.display = 'none' }}
                />
              </div>
            )}
          </For>
        </div>
      )}

      {p.tags && p.tags.length > 0 && (
        <div class="post-detail-tags">
          <For each={p.tags}>{(t) => (
            <span class="tag">#{t}</span>
          )}</For>
        </div>
      )}

      <div class="post-detail-meta">
        <span>❤ {p.likesCount ?? 0}</span>
        <span>💬 {p.commentsCount ?? 0}</span>
        <span>🔁 {p.reblogsCount ?? 0}</span>
      </div>
    </article>
  )
}

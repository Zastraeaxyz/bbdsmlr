import { createSignal, createEffect } from 'solid-js'
import { useNavigate, useParams, A } from '@solidjs/router'
import { getCurrentUser, setCurrentUser, getPostDetail, type Post } from '../lib/api'

export default function PostPage() {
  const navigate = useNavigate()
  const params = useParams()
  const user = getCurrentUser()

  const [post, setPost] = createSignal<Post | null>(null)
  const [loading, setLoading] = createSignal(true)
  const [error, setError] = createSignal('')

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

  const handleSignOut = () => {
    setCurrentUser(null)
    setPost(null)
    setError('')
    localStorage.removeItem('user')
    navigate('/login', { replace: true })
  }

  return (
    <div class="home-page">
      <header>
        <h1>BDSMLR</h1>
        <span class="user-info">{user?.blog_name || user?.username}</span>
        <A href="/" class="btn-ghost">Home</A>
        {user && (
          <>
            <A href={`/${user.blog_name}`} class="btn-ghost">My feed</A>
            <button class="btn-ghost" onClick={handleSignOut}>Sign out</button>
          </>
        )}
        {!user && <A href="/login" class="btn-ghost">Sign in</A>}
      </header>
      <main>
        {error() && <p class="error">{error()}</p>}
        {loading() && <p class="loading">Loading post…</p>}
        {(() => {
          const p = post()
          if (!p || loading()) return null
          return <PostDetail post={p} />
        })()}
      </main>
    </div>
  )
}

function PostDetail(props: { post: Post }) {
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
    if (c.files && c.files.length > 0) return c.files
    if (c.thumbnail) return [c.thumbnail]
    return []
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

      {p.title && <h2 class="post-detail-title">{p.title}</h2>}
      {p.body && <div class="post-detail-body">{p.body}</div>}

      {imageUrls().length > 0 && (
        <div class="post-detail-images">
          {imageUrls().map((url) => (
            <div class="media-shell">
              <img
                src={url}
                alt=""
                loading="lazy"
                onError={(e) => { e.currentTarget.style.display = 'none' }}
              />
              <video
                src={url}
                muted
                playsinline
                controls
                loop
                preload="metadata"
                onError={(e) => { e.currentTarget.style.display = 'none' }}
              />
            </div>
          ))}
        </div>
      )}

      {p.tags && p.tags.length > 0 && (
        <div class="post-detail-tags">
          {p.tags.map((t) => (
            <span class="tag">{t}</span>
          ))}
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

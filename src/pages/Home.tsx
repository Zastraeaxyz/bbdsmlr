import { createSignal, createEffect } from 'solid-js'
import { useNavigate } from '@solidjs/router'
import { requireUser, setCurrentUser, listBlogActivity, type Post } from '../lib/api'

export default function Home() {
  const navigate = useNavigate()

  let user: ReturnType<typeof requireUser>
  try {
    user = requireUser()
  } catch {
    navigate('/login', { replace: true })
    return null
  }

  const blogId = user.blog_id ?? user.primary_blog_id
  if (!blogId) {
    navigate('/login', { replace: true })
    return null
  }

  const [posts, setPosts] = createSignal<Post[]>()
  const [loading, setLoading] = createSignal(true)
  const [error, setError] = createSignal('')

  const fetchFeed = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await listBlogActivity({
        blog_id: blogId,
        sort_field: 1,
        order: 2,
        post_types: [1, 2, 3, 4, 5, 6, 7],
        activity_kinds: ['like', 'comment'],
        page: { page_size: 12 },
        page_size: 12,
      })
      setPosts(data.posts ?? [])
    } catch (err: unknown) {
      setError((err as Error)?.message || 'Failed to load feed')
    } finally {
      setLoading(false)
    }
  }

  createEffect(() => {
    fetchFeed()
  })

  const handleSignOut = () => {
    setCurrentUser(null)
    sessionStorage.removeItem('user')
    navigate('/login', { replace: true })
  }

  return (
    <div class="home-page">
      <header>
        <h1>BDSMLR</h1>
        <span class="user-info">{user.blog_name || user.username}</span>
        <button class="btn-ghost" onClick={handleSignOut}>
          Sign out
        </button>
      </header>
      <main>
        {error() && <p class="error">{error()}</p>}

        {loading() && <p class="loading">Loading feed…</p>}

        {(() => {
          const items = posts()
          if (!items || loading()) return null
          if (items.length === 0) return <p class="empty">No posts in feed.</p>
          return (
            <div class="feed">
              {items.map((post) => (
                <PostCard post={post} />
              ))}
            </div>
          )
        })()}
      </main>
    </div>
  )
}

function PostCard(props: { post: Post }) {
  const post = props.post

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
    const c = post.content
    if (!c) return []
    if (c.files && c.files.length > 0) return c.files
    if (c.thumbnail) return [c.thumbnail]
    return []
  }

  return (
    <div class="feed-card">
      <div class="feed-card-header">
        <span class="feed-card-blog">{post.blogName}</span>
        <span class="feed-card-type">{postTypeLabel(post.type)}</span>
        {post.createdAtUnix && (
          <span class="feed-card-time">
            {new Date(post.createdAtUnix * 1000).toLocaleString()}
          </span>
        )}
      </div>
      {post.title && <div class="feed-card-title">{post.title}</div>}
      {post.body && <div class="feed-card-body">{post.body}</div>}
      {imageUrls().length > 0 && (
        <div class="feed-card-images">
          {imageUrls().map((url) => (
            <img
              src={url}
              alt=""
              loading="lazy"
              onError={(e) => {
                const el = e.currentTarget
                el.style.display = 'none'
              }}
            />
          ))}
        </div>
      )}
      {post.tags && post.tags.length > 0 && (
        <div class="feed-card-tags">
          {post.tags.map((t) => (
            <span class="tag">{t}</span>
          ))}
        </div>
      )}
      <div class="feed-card-meta">
        <span>❤ {post.likesCount ?? 0}</span>
        <span>💬 {post.commentsCount ?? 0}</span>
        <span>🔁 {post.reblogsCount ?? 0}</span>
      </div>
    </div>
  )
}

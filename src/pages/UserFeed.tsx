import { createSignal, createEffect } from 'solid-js'
import { useNavigate, useParams, A } from '@solidjs/router'
import { getCurrentUser, setCurrentUser, resolveIdentifier, listBlogActivity, type Post } from '../lib/api'

export default function UserFeed() {
  const navigate = useNavigate()
  const params = useParams()
  const slug = () => params.user

  const user = getCurrentUser()

  const [posts, setPosts] = createSignal<Post[]>()
  const [loading, setLoading] = createSignal(true)
  const [error, setError] = createSignal('')

  const fetchFeed = async () => {
    const name = slug()
    if (!name) {
      setError('No user specified')
      return
    }
    setLoading(true)
    setError('')
    try {
      const resolved = await resolveIdentifier(name)
      if (!resolved.blogId) {
        setError(resolved.error || 'User not found')
        return
      }
      const data = await listBlogActivity({
        blog_id: resolved.blogId,
        blog_name: resolved.blogName || name,
        sort_field: 1,
        order: 2,
        post_types: [1, 2, 3, 4, 5, 6, 7],
        activity_kinds: ['post', 'reblog'],
        page: 1,
        page_size: 20,
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
        <span class="user-info">{slug()}</span>
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
        <A href={`/${post.blogName}`} class="feed-card-blog">{post.blogName}</A>
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
        <A href={`/post/${post.id}`} class="feed-card-permalink">Permalink</A>
      </div>
    </div>
  )
}

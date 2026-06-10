import { createSignal, createEffect } from 'solid-js'
import { A } from '@solidjs/router'
import { getCurrentUser, blogFollowGraph, listBlogsRecentActivity, type Post } from '../lib/api'
import { sanitizeHtml } from '../lib/sanitize'
import Header from '../components/Header'

export default function FollowingFeed() {
  const user = getCurrentUser()

  const [posts, setPosts] = createSignal<Post[]>([])
  const [loading, setLoading] = createSignal(true)
  const [error, setError] = createSignal('')

  const fetchFollowingFeed = async () => {
    if (!user?.blog_id) {
      setError('Not authenticated')
      setLoading(false)
      return
    }
    setLoading(true)
    setError('')
    try {
      const graph = await blogFollowGraph(user.blog_id)
      const following = graph.following || []
      if (following.length === 0) {
        setPosts([])
        return
      }
      const blogIds = following.map((f) => Number(f.blogId))
      const data = await listBlogsRecentActivity(blogIds, 20)
      setPosts(data.posts ?? [])
    } catch (err: unknown) {
      setError((err as Error)?.message || 'Failed to load feed')
    } finally {
      setLoading(false)
    }
  }

  createEffect(() => {
    fetchFollowingFeed()
  })

  return (
    <div class="home-page">
      <Header info="Following feed">
        {user && <A href={`/${user.blog_name}`} class="btn-ghost">My blog</A>}
      </Header>
      <main>
        {error() && <p class="error">{error()}</p>}

        {loading() && <p class="loading">Loading feed…</p>}

        {(() => {
          const items = posts()
          if (loading()) return null
          if (!items || items.length === 0) return <p class="empty">No posts from followed blogs.</p>
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
      {post.content?.html && <div class="feed-card-body" innerHTML={sanitizeHtml(post.content!.html!)} />}
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
            <span class="tag">#{t}</span>
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

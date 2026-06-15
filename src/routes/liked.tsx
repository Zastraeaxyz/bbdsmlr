import { createSignal, createEffect, For, Show } from 'solid-js'
import { A } from '@solidjs/router'
import { Title } from '@solidjs/meta'
import { getCurrentUser, listBlogActivity, PostType, PostVariant, type Post } from '~/lib/api'
import { sanitizeHtml, processContentHtml, transformMediaUrl, getMediaType, type MediaType } from '~/lib/sanitize'
import Header from '~/components/Header'
import { ReblogAttribution } from '~/components/ReblogAttribution'
import { LightBox } from '~/components/LightBox'

export default function LikedPosts() {
  const user = getCurrentUser()

  const [posts, setPosts] = createSignal<Post[]>([])
  const [loading, setLoading] = createSignal(true)
  const [loadingMore, setLoadingMore] = createSignal(false)
  const [hasMore, setHasMore] = createSignal(true)
  const [error, setError] = createSignal('')
  const [lightboxUrl, setLightboxUrl] = createSignal<string | null>(null)
  let nextPageToken: string | null = null

  const fetchLiked = async () => {
    if (!user?.blog_id) {
      setError('Not authenticated')
      setLoading(false)
      return
    }
    setLoading(true)
    setLoadingMore(false)
    setError('')
    setPosts([])
    setHasMore(true)
    nextPageToken = null
    try {
      const data = await listBlogActivity({
        blog_id: user.blog_id,
        sort_field: 1,
        order: 2,
        post_types: [1, 2, 3, 4, 5, 6, 7],
        activity_kinds: ['like'],
        page: { page_size: 20 },
      })
      const incoming = data.posts ?? []
      setPosts(incoming)
      nextPageToken = data.page?.nextPageToken ?? null
      if (!nextPageToken) setHasMore(false)
    } catch (err: unknown) {
      setError((err as Error)?.message || 'Failed to load liked posts')
    } finally {
      setLoading(false)
    }
  }

  createEffect(() => {
    fetchLiked()
  })

  const loadMore = async () => {
    if (!user?.blog_id || !hasMore() || loadingMore() || !nextPageToken) return
    setLoadingMore(true)
    const token = nextPageToken
    nextPageToken = null
    try {
      const data = await listBlogActivity({
        blog_id: user.blog_id,
        sort_field: 1,
        order: 2,
        post_types: [1, 2, 3, 4, 5, 6, 7],
        activity_kinds: ['like'],
        page: { page_size: 20, page_token: token },
      })
      const incoming = data.posts ?? []
      setPosts((prev) => [...prev, ...incoming])
      nextPageToken = data.page?.nextPageToken ?? null
      if (!nextPageToken) setHasMore(false)
    } catch {
      nextPageToken = token
    } finally {
      setLoadingMore(false)
    }
  }

  return (
    <div class="home-page">
      <Title>Liked posts — bbdsmlr</Title>
      <Header info="Liked posts" />
      <main>
        {error() && <p class="error">{error()}</p>}

        {loading() && <p class="loading">Loading liked posts…</p>}

        <Show when={!loading()}>
          <Show when={posts().length > 0} fallback={<p class="empty">No liked posts yet.</p>}>
            <div class="feed">
              <For each={posts()}>{(post) => <PostCard post={post} onImageClick={setLightboxUrl} />}</For>
            </div>
          </Show>
        </Show>

        {hasMore() && !loading() && (
          <button
            onClick={loadMore}
            disabled={loadingMore()}
            class="btn-ghost"
            style="display:block;margin:24px auto"
          >
            {loadingMore() ? 'Loading…' : 'Load more'}
          </button>
        )}
      </main>
      <LightBox url={lightboxUrl()} onClose={() => setLightboxUrl(null)} />
    </div>
  )
}

function PostCard(props: { post: Post; onImageClick?: (url: string) => void }) {
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

  const mediaItems = (): { url: string; type: MediaType }[] => {
    const c = post.content
    if (!c) return []
    const urls = c.files && c.files.length > 0
      ? c.files.map(transformMediaUrl)
      : c.thumbnail
        ? [transformMediaUrl(c.thumbnail)]
        : []
    return urls.map((url) => ({ url, type: getMediaType(url) }))
  }

  const contentHtml = () => {
    const c = post.content
    if (!c?.html) return null
    const processed = post.type === PostType.Text ? processContentHtml(c.html, c.files) : c.html
    return sanitizeHtml(processed)
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
      <ReblogAttribution originBlogName={post.originBlogName} originPostId={post.originPostId} variant={post.variant} />
      {post.title && <div class="feed-card-title">{post.title}</div>}
      {contentHtml() && <div class="feed-card-body" innerHTML={contentHtml()!} onClick={(e) => {
        const target = e.target as HTMLElement
        if ((target.tagName === 'IMG' || target.tagName === 'VIDEO') && target.getAttribute('src')) {
          props.onImageClick?.(target.getAttribute('src')!)
        }
      }} />}
      {post.type !== PostType.Text && mediaItems().length > 0 && (
        <div class="feed-card-images">
          <For each={mediaItems()}>
            {(item) => (
              <Show when={item.type === 'image'} fallback={
                <video
                  src={item.url}
                  muted
                  controls
                  preload="metadata"
                  onClick={() => props.onImageClick?.(item.url)}
                />
              }>
                <img
                  src={item.url}
                  alt=""
                  loading="lazy"
                  onClick={() => props.onImageClick?.(item.url)}
                />
              </Show>
            )}
          </For>
        </div>
      )}
      {post.tags && post.tags.length > 0 && (
        <div class="feed-card-tags">
          <For each={post.tags}>{(t) => (
            <span class="tag">#{t}</span>
          )}</For>
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

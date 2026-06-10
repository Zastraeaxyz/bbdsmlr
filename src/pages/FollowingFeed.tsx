import { createSignal, createEffect, For, Show } from 'solid-js'
import { A } from '@solidjs/router'
import { getCurrentUser, blogFollowGraph, listBlogsRecentActivity, searchPostsByTag, PostType, PostVariant, type Post } from '../lib/api'
import { sanitizeHtml, processContentHtml, transformMediaUrl } from '../lib/sanitize'
import Header from '../components/Header'
import SearchHelp from '../components/SearchHelp'
import { ReblogAttribution } from '../components/ReblogAttribution'

export default function FollowingFeed() {
  const user = getCurrentUser()

  const [posts, setPosts] = createSignal<Post[]>([])
  const [loading, setLoading] = createSignal(true)
  const [loadingMore, setLoadingMore] = createSignal(false)
  const [hasMore, setHasMore] = createSignal(true)
  const [error, setError] = createSignal('')
  const [query, setQuery] = createSignal('')
  const [activeQuery, setActiveQuery] = createSignal('')
  const [sortField, setSortField] = createSignal(1)
  const [sortOrder, setSortOrder] = createSignal(1)
  let page = 1

  const loadPage = async () => {
    const q = activeQuery()
    if (q) {
      const data = await searchPostsByTag({ tag_name: q, sort_field: sortField(), order: sortOrder(), page, page_size: 20 })
      const incoming = data.posts ?? []
      setPosts((prev) => [...prev, ...incoming])
      if (incoming.length < 20) setHasMore(false)
    } else {
      if (!user?.blog_id) return
      const graph = await blogFollowGraph(user.blog_id)
      const following = graph.following || []
      if (following.length === 0) {
        setPosts([])
        return
      }
      const blogIds = following.map((f) => Number(f.blogId))
      const data = await listBlogsRecentActivity(blogIds, 20)
      setPosts(data.posts ?? [])
    }
  }

  const fetchFeed = async () => {
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
    page = 1
    try {
      await loadPage()
    } catch (err: unknown) {
      setError((err as Error)?.message || 'Failed to load feed')
    } finally {
      setLoading(false)
    }
  }

  createEffect(() => {
    fetchFeed()
  })

  const loadMore = async () => {
    if (!hasMore() || loadingMore()) return
    setLoadingMore(true)
    page++
    try {
      await loadPage()
    } catch {
      page--
    } finally {
      setLoadingMore(false)
    }
  }

  const doSearch = (e: Event) => {
    e.preventDefault()
    setActiveQuery(query())
    setSortField(1)
    setSortOrder(1)
    page = 1
    setPosts([])
    setHasMore(true)
    loadPage()
  }

  const clearSearch = () => {
    setQuery('')
    setActiveQuery('')
    setSortField(1)
    setSortOrder(1)
    page = 1
    setPosts([])
    setHasMore(true)
    fetchFeed()
  }

  const handleTagClick = (tag: string) => {
    const q = (query() ? query() + ' ' : '') + `tag:${tag}`
    setQuery(q)
    setActiveQuery(q)
    setSortField(1)
    setSortOrder(1)
    page = 1
    setPosts([])
    setHasMore(true)
    loadPage()
  }

  return (
    <div class="home-page">
      <Header info="Following feed">
        {user && <A href={`/${user.blog_name}`} class="btn-ghost">My blog</A>}
      </Header>
      <main>
        <form class="search-bar" onSubmit={doSearch}>
          <select
            class="sort-select"
            value={sortField() + '-' + sortOrder()}
            onChange={(e) => {
              const [sf, so] = e.currentTarget.value.split('-').map(Number)
              setSortField(sf)
              setSortOrder(so)
              page = 1
              setPosts([])
              setHasMore(true)
              loadPage()
            }}
          >
            <option value="1-1">Newest</option>
            <option value="1-2">Oldest</option>
            <option value="6-1">Most popular</option>
            <option value="6-2">Least popular</option>
            <option value="2-1">Most liked</option>
            <option value="3-1">Most commented</option>
            <option value="4-1">Most reblogged</option>
          </select>
          <div class="search-input-wrap">
            <input
              type="text"
              placeholder="Search posts…"
              value={query()}
              onInput={(e) => setQuery(e.currentTarget.value)}
            />
            {activeQuery() && (
              <button type="button" class="search-input-clear" onClick={clearSearch}>
                ×
              </button>
            )}
          </div>
          <button type="submit">Search</button>
          <SearchHelp onFill={(q) => { setQuery(q); setActiveQuery(q); page = 1; setPosts([]); setHasMore(true); loadPage() }} />
        </form>

        {error() && <p class="error">{error()}</p>}

        {loading() && <p class="loading">Loading feed…</p>}

        <Show when={!loading()}>
          <Show when={posts().length > 0} fallback={<p class="empty">{activeQuery() ? 'No results found.' : 'No posts from followed blogs.'}</p>}>
            <div class="feed">
              <For each={posts()}>{(post) => <PostCard post={post} onTagClick={handleTagClick} />}</For>
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
    </div>
  )
}

function PostCard(props: { post: Post; onTagClick?: (tag: string) => void }) {
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
    if (c.files && c.files.length > 0) return c.files.map(transformMediaUrl)
    if (c.thumbnail) return [transformMediaUrl(c.thumbnail)]
    return []
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
      <ReblogAttribution originBlogName={post.originBlogName} variant={post.variant} />
      {post.title && <div class="feed-card-title">{post.title}</div>}
      {contentHtml() && <div class="feed-card-body" innerHTML={contentHtml()!} />}
      {post.type !== PostType.Text && imageUrls().length > 0 && (
        <div class="feed-card-images">
          <For each={imageUrls()}>
            {(url) => (
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
            )}
          </For>
        </div>
      )}
      {post.tags && post.tags.length > 0 && (
        <div class="feed-card-tags">
          <For each={post.tags}>{(t) => (
            <button type="button" class="tag" onClick={() => props.onTagClick?.(t)}>
              #{t}
            </button>
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

import { createSignal, createEffect, For, Show } from "solid-js";
import { useParams, A } from "@solidjs/router";
import {
  getCurrentUser,
  resolveIdentifier,
  listBlogActivity,
  listBlogTopTags,
  getBlog,
  PostType,
  type Post,
  type TopTag,
  type Blog,
} from "../lib/api";
import {
  sanitizeHtml,
  processContentHtml,
  transformMediaUrl,
} from "../lib/sanitize";
import Header from "../components/Header";

const PAGE_SIZE = 20;

export default function UserFeed() {
  const params = useParams();
  const slug = () => params.user;

  const user = getCurrentUser();

  const [posts, setPosts] = createSignal<Post[]>([]);
  const [topTags, setTopTags] = createSignal<TopTag[]>([]);
  const [blog, setBlog] = createSignal<Blog | null>(null);
  const [loading, setLoading] = createSignal(true);
  const [loadingMore, setLoadingMore] = createSignal(false);
  const [hasMore, setHasMore] = createSignal(true);
  const [error, setError] = createSignal("");

  let resolvedId: number | null = null;
  let page = 1;

  const loadPage = async (name: string) => {
    if (!resolvedId) return;
    const data = await listBlogActivity({
      blog_id: resolvedId,
      blog_name: name,
      sort_field: 1,
      order: 2,
      post_types: [1, 2, 3, 4, 5, 6, 7],
      activity_kinds: ["post", "reblog"],
      page,
      page_size: PAGE_SIZE,
    });
    const incoming = data.posts ?? [];
    setPosts((prev) => [...prev, ...incoming]);
    if (incoming.length < PAGE_SIZE) setHasMore(false);
  };

  const fetchFeed = async () => {
    const name = slug();
    if (!name) {
      setError("No user specified");
      return;
    }
    setLoading(true);
    setLoadingMore(false);
    setError("");
    setPosts([]);
    setHasMore(true);
    resolvedId = null;
    page = 1;
    try {
      const resolved = await resolveIdentifier(name);
      if (!resolved.blogId) {
        setError(resolved.error || "User not found");
        return;
      }
      resolvedId = resolved.blogId;
      await loadPage(name);

      const [blogRes, tagsRes] = await Promise.all([
        getBlog(resolved.blogId),
        listBlogTopTags(name),
      ]);
      setBlog(blogRes.blog ?? null);
      setTopTags(tagsRes.tags ?? []);
    } catch (err: unknown) {
      setError((err as Error)?.message || "Failed to load feed");
    } finally {
      setLoading(false);
    }
  };

  createEffect(() => {
    fetchFeed();
  });

  const loadMore = async () => {
    const name = slug();
    if (!name || !resolvedId || !hasMore() || loadingMore()) return;
    setLoadingMore(true);
    page++;
    try {
      await loadPage(name);
    } catch {
      page--;
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <div class="home-page">
      <Header info={slug()}>
        {user && (
          <A href="/following" class="btn-ghost">
            Following
          </A>
        )}
      </Header>
      {(() => {
        const b = blog();
        if (!b) return null;
        return (
          <section class="blog-header">
            <div class="blog-header-inner">
              {b.avatarUrl && (
                <img class="blog-avatar" src={b.avatarUrl} alt="" />
              )}
              <div class="blog-header-info">
                {b.title && <h2 class="blog-title">{b.title}</h2>}
                {b.description && (
                  <p class="blog-description">{b.description}</p>
                )}
              </div>
            </div>
          </section>
        );
      })()}

      {topTags().length > 0 && (
        <section class="top-tags">
          <div class="top-tags-inner">
            <span class="top-tags-label">Top tags</span>
            <div class="top-tags-list">
              <For each={topTags().slice(0, 5)}>
                {(t) => (
                  <span class="tag">
                    <span class="tag-name">{t.name}</span>
                    <span class="tag-count">{t.postsCount}</span>
                  </span>
                )}
              </For>
            </div>
          </div>
        </section>
      )}
      <main>
        {error() && <p class="error">{error()}</p>}

        {loading() && <p class="loading">Loading feed…</p>}

        <Show when={!loading()}>
          <Show when={posts().length > 0} fallback={<p class="empty">No posts in feed.</p>}>
            <div class="feed">
              <For each={posts()}>{(post) => <PostCard post={post} />}</For>
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
            {loadingMore() ? "Loading…" : "Load more"}
          </button>
        )}
      </main>
    </div>
  );
}

function PostCard(props: { post: Post }) {
  const post = props.post;

  const postTypeLabel = (type?: number) => {
    switch (type) {
      case 0:
        return "General";
      case 1:
        return "Text";
      case 2:
        return "Image";
      case 3:
        return "Video";
      case 4:
        return "Audio";
      case 5:
        return "Link";
      case 6:
        return "Poll";
      case 7:
        return "Quote";
      default:
        return "Post";
    }
  };

  const imageUrls = () => {
    const c = post.content;
    if (!c) return [];
    if (c.files && c.files.length > 0) return c.files.map(transformMediaUrl);
    if (c.thumbnail) return [transformMediaUrl(c.thumbnail)];
    return [];
  };

  const contentHtml = () => {
    const c = post.content;
    if (!c?.html) return null;
    const processed =
      post.type === PostType.Text
        ? processContentHtml(c.html, c.files)
        : c.html;
    return sanitizeHtml(processed);
  };

  return (
    <div class="feed-card">
      <div class="feed-card-header">
        <A href={`/${post.blogName}`} class="feed-card-blog">
          {post.blogName}
        </A>
        <span class="feed-card-type">{postTypeLabel(post.type)}</span>
        {post.createdAtUnix && (
          <span class="feed-card-time">
            {new Date(post.createdAtUnix * 1000).toLocaleString()}
          </span>
        )}
      </div>
      {post.title && <div class="feed-card-title">{post.title}</div>}
      {contentHtml() && (
        <div class="feed-card-body" innerHTML={contentHtml()!} />
      )}
      {post.type !== PostType.Text && imageUrls().length > 0 && (
        <div class="feed-card-images">
          <For each={imageUrls()}>
            {(url) => (
              <div class="media-shell">
                <img
                  src={url}
                  alt=""
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
                <video
                  src={url}
                  muted
                  playsinline
                  controls
                  loop
                  preload="metadata"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
            )}
          </For>
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
        <A href={`/post/${post.id}`} class="feed-card-permalink">
          Permalink
        </A>
      </div>
    </div>
  );
}

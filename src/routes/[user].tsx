import { createSignal, createEffect, For, Show } from "solid-js";
import { useParams, A } from "@solidjs/router";
import { Title } from "@solidjs/meta";
import {
  resolveIdentifier,
  listBlogActivity,
  listBlogTopTags,
  getBlog,
  PostType,
  PostVariant,
  SortField,
  SortOrder,
  type Post,
  type TopTag,
  type Blog,
} from "~/lib/api";
import SortDropdown from "~/components/SortDropdown";
import {
  sanitizeHtml,
  processContentHtml,
  transformMediaUrl,
  getMediaType,
  type MediaType,
} from "~/lib/sanitize";
import Header from "~/components/Header";
import SearchHelp from "~/components/SearchHelp";
import { ReblogAttribution } from "~/components/ReblogAttribution";
import { LightBox } from "~/components/LightBox";
import { HeartIcon, ChatIcon, ReblogIcon, DownloadIcon, BdsmlrIcon } from "~/components/Icons";
import { DownloadModal } from "~/components/DownloadModal";
import { downloadImages } from "~/lib/download";
import { formatRelativeDate } from "~/lib/date";

const PAGE_SIZE = 20;

export default function UserFeed() {
  const params = useParams();
  const slug = () => params.user;

  const [posts, setPosts] = createSignal<Post[]>([]);
  const [topTags, setTopTags] = createSignal<TopTag[]>([]);
  const [blog, setBlog] = createSignal<Blog | null>(null);
  const [loading, setLoading] = createSignal(true);
  const [loadingMore, setLoadingMore] = createSignal(false);
  const [hasMore, setHasMore] = createSignal(true);
  const [error, setError] = createSignal("");
  const [query, setQuery] = createSignal("");
  const [activeQuery, setActiveQuery] = createSignal("");
  const [lightboxUrl, setLightboxUrl] = createSignal<string | null>(null);
  const [showAllTags, setShowAllTags] = createSignal(false);
  const [sortField, setSortField] = createSignal(SortField.Date);
  const [sortOrder, setSortOrder] = createSignal(SortOrder.Descending);

  let resolvedId: number | null = null;
  let page = 1;

  const loadPage = async (name: string) => {
    if (!resolvedId) return;
    const q = activeQuery();
    const data = await listBlogActivity({
      blog_id: resolvedId,
      blog_name: name,
      ...(q ? { q } : {}),
      sort_field: sortField(),
      order: sortOrder(),
      post_types: [1, 2, 3, 4, 5, 6, 7],
      activity_kinds: ["post", "reblog"],
      page,
      page_size: PAGE_SIZE,
    });
    if (data.error) {
      const msg =
        data.error === "blog not found" ? "Blog was banned" : data.error;
      throw new Error(msg);
    }
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
    } catch (err: unknown) {
      page--;
      setError((err as Error)?.message || "Failed to load more");
    } finally {
      setLoadingMore(false);
    }
  };

  const doSearch = (e: Event) => {
    e.preventDefault();
    const name = slug();
    if (!name) return;
    setActiveQuery(query());
    page = 1;
    setPosts([]);
    setHasMore(true);
    loadPage(name);
  };

  const clearSearch = () => {
    const name = slug();
    if (!name) return;
    setQuery("");
    setActiveQuery("");
    page = 1;
    setPosts([]);
    setHasMore(true);
    loadPage(name);
  };

  const handleTagClick = (tag: string) => {
    const name = slug();
    if (!name) return;
    const q = (query() ? query() + " " : "") + `tag:${tag.includes(" ") ? `"${tag}"` : tag}`;
    setQuery(q);
    setActiveQuery(q);
    page = 1;
    setPosts([]);
    setHasMore(true);
    loadPage(name);
  };

  return (
    <div class="home-page">
      <Title>{slug()} — bbdsmlr</Title>
      <Header info={slug()} />
      <Show when={blog()}>
        {(b) => (
          <section class="blog-header">
            <div class="blog-header-inner">
              {b().avatarUrl && (
                <img class="blog-avatar" src={b().avatarUrl} alt="" />
              )}
              <div class="blog-header-info">
                {b().title && <h2 class="blog-title">{b().title}</h2>}
                {b().description && (
                  <p class="blog-description">{b().description}</p>
                )}
                <a
                  href={`https://bdsmlr.com/blog/${slug()}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="download-btn"
                  title="Open on BDSMLR"
                  style="margin-top:8px"
                >
                  <BdsmlrIcon />
                </a>
              </div>
            </div>
          </section>
        )}
      </Show>

      {topTags().length > 0 && (
        <section class="top-tags">
          <div class="top-tags-inner">
            <span class="top-tags-label">Top tags</span>
            <div class="top-tags-list">
              <For each={topTags().slice(0, 5)}>
                {(t) => (
                  <button
                    type="button"
                    class="tag"
                    onClick={() => handleTagClick(t.name)}
                  >
                    <span class="tag-name">{t.name}</span>
                    <span class="tag-count">{t.postsCount}</span>
                  </button>
                )}
              </For>
              {topTags().length > 5 && (
                <button
                  type="button"
                  class="tag"
                  onClick={() => setShowAllTags(true)}
                >
                  Show all ({topTags().length - 5})
                </button>
              )}
            </div>
          </div>
        </section>
      )}
      <Show when={showAllTags()}>
        <div
          class="tag-modal-backdrop"
          onClick={(e) => { if (e.target === e.currentTarget) setShowAllTags(false); }}
        >
          <div class="tag-modal" tabIndex={0}>
            <button
              type="button"
              class="tag-modal-close"
              onClick={() => setShowAllTags(false)}
              aria-label="Close"
            >
              ×
            </button>
            <h3>All tags</h3>
            <div class="tag-modal-list">
              <For each={topTags().slice(5)}>
                {(t) => (
                  <button
                    type="button"
                    class="tag"
                    onClick={() => { handleTagClick(t.name); setShowAllTags(false); }}
                  >
                    <span class="tag-name">{t.name}</span>
                    <span class="tag-count">{t.postsCount}</span>
                  </button>
                )}
              </For>
            </div>
          </div>
        </div>
      </Show>
      <main>
        <form class="search-bar" onSubmit={doSearch}>
          <SortDropdown
            value={`${sortField()}-${sortOrder()}`}
            onChange={(sf, so) => {
              setSortField(sf);
              setSortOrder(so);
              page = 1;
              setPosts([]);
              setHasMore(true);
              const name = slug();
              if (name) loadPage(name);
            }}
            options={{
              newest: true,
              oldest: true,
              mostPopular: true,
              leastPopular: true,
              mostLiked: true,
              mostCommented: true,
              mostReblogged: true,
            }}
          />
          <div class="search-input-wrap">
            <input
              type="text"
              placeholder="Search posts…"
              value={query()}
              onInput={(e) => setQuery(e.currentTarget.value)}
            />
            {activeQuery() && (
              <button
                type="button"
                class="search-input-clear"
                onClick={clearSearch}
              >
                ×
              </button>
            )}
          </div>
          <button type="submit">Search</button>
          <SearchHelp
            onFill={(q) => {
              const name = slug();
              if (!name) return;
              setQuery(q);
              setActiveQuery(q);
              page = 1;
              setPosts([]);
              setHasMore(true);
              loadPage(name);
            }}
          />
        </form>

        {error() && <p class="error">{error()}</p>}

        {loading() && <p class="loading">Loading feed…</p>}

        <Show when={!loading()}>
          <Show
            when={posts().length > 0}
            fallback={<p class="empty">No posts in feed.</p>}
          >
            <div class="feed">
              <For each={posts()}>
                {(post) => (
                  <PostCard
                    post={post}
                    onTagClick={handleTagClick}
                    onImageClick={setLightboxUrl}
                  />
                )}
              </For>
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
      <LightBox url={lightboxUrl()} onClose={() => setLightboxUrl(null)} />
    </div>
  );
}

function PostCard(props: {
  post: Post;
  onTagClick?: (tag: string) => void;
  onImageClick?: (url: string) => void;
}) {
  const post = props.post;
  const [showDownloadModal, setShowDownloadModal] = createSignal(false);

  const handleDownloadClick = () => {
    const urls = imageUrls();
    if (urls.length === 1) {
      downloadImages({ urls, blogName: post.blogName, postId: post.id });
    } else {
      setShowDownloadModal(true);
    }
  };

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

  const mediaItems = (): { url: string; type: MediaType }[] => {
    const c = post.content;
    if (!c) return [];
    const urls =
      c.files && c.files.length > 0
        ? c.files.map(transformMediaUrl)
        : c.thumbnail
          ? [transformMediaUrl(c.thumbnail)]
          : [];
    return urls.map((url) => ({ url, type: getMediaType(url) }));
  };

  const imageUrls = () => mediaItems().filter((i) => i.type === "image").map((i) => i.url);

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
        <Show when={!post.id}>
          <span class="feed-card-type">DELETED</span>
        </Show>
        {post.createdAtUnix && (
          <span class="feed-card-time">
            {formatRelativeDate(post.createdAtUnix)}
          </span>
        )}
      </div>
      <ReblogAttribution
        originBlogName={post.originBlogName}
        originPostId={post.originPostId}
        variant={post.variant}
      />
      {post.title && <div class="feed-card-title">{post.title}</div>}
      {contentHtml() && (
        <div
          class="feed-card-body"
          innerHTML={contentHtml()!}
          onClick={(e) => {
            const target = e.target as HTMLElement;
            if (
              (target.tagName === "IMG" || target.tagName === "VIDEO") &&
              target.getAttribute("src")
            ) {
              props.onImageClick?.(target.getAttribute("src")!);
            }
          }}
        />
      )}
      {post.type !== PostType.Text && mediaItems().length > 0 && (
        <div class="feed-card-images">
          <For each={mediaItems()}>
            {(item) => (
              <Show
                when={item.type === "image"}
                fallback={
                  <video
                    src={item.url}
                    muted
                    controls
                    preload="metadata"
                    onClick={() => props.onImageClick?.(item.url)}
                  />
                }
              >
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
          <For each={post.tags}>
            {(t) => (
              <button
                type="button"
                class="tag"
                onClick={() => props.onTagClick?.(t)}
              >
                #{t}
              </button>
            )}
          </For>
        </div>
      )}
      <div class="feed-card-meta">
        <span><HeartIcon /> {post.likesCount ?? 0}</span>
        <span><ChatIcon /> {post.commentsCount ?? 0}</span>
        <span><ReblogIcon /> {post.reblogsCount ?? 0}</span>
        <Show when={imageUrls().length > 0}>
          <button
            type="button"
            class="download-btn"
            title="Download images"
            onClick={handleDownloadClick}
          >
            <DownloadIcon />
          </button>
        </Show>
        <Show when={post.id}>
          <a
            href={`https://bdsmlr.com/post/${post.id}`}
            target="_blank"
            rel="noopener noreferrer"
            class="download-btn"
            title="Open on BDSMLR"
          >
            <BdsmlrIcon />
          </a>
        </Show>
        <Show when={post.id}>
          <A href={`/post/${post.id}`} class="feed-card-permalink">
            Permalink
          </A>
        </Show>
      </div>
      <Show when={showDownloadModal()}>
        <DownloadModal
          urls={imageUrls()}
          blogName={post.blogName}
          postId={post.id}
          onClose={() => setShowDownloadModal(false)}
        />
      </Show>
    </div>
  );
}

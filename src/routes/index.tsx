import { createSignal, createEffect, For, Show, onMount, onCleanup } from "solid-js";
import { A, useNavigate, useSearchParams } from "@solidjs/router";
import { Title } from "@solidjs/meta";
import {
  listBlogsRecentActivity,
  searchPostsByTag,
  PostType,
  PostVariant,
  SortField,
  SortOrder,
  type Post,
} from "~/lib/api";
import { getCachedFollowingIds } from "~/lib/following";
import { useAuth } from "~/lib/useAuth";
import SortDropdown from "~/components/SortDropdown";
import {
  sanitizeHtml,
  processContentHtml,
  getMediaType,
  getPostMediaUrls,
  upgradeToLightbox,
  type MediaType,
} from "~/lib/sanitize";
import Header from "~/components/Header";
import SearchHelp from "~/components/SearchHelp";
import { ReblogAttribution } from "~/components/ReblogAttribution";
import { LightBox } from "~/components/LightBox";
import {
  HeartIcon,
  ChatIcon,
  ReblogIcon,
  DownloadIcon,
  BdsmlrIcon,
} from "~/components/Icons";
import { DownloadModal } from "~/components/DownloadModal";
import { downloadImages } from "~/lib/download";
import { formatRelativeDate } from "~/lib/date";

export default function Home() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  createEffect(() => {
    if (!authLoading() && !user()) {
      navigate("/login", { replace: true });
    }
  });

  const [posts, setPosts] = createSignal<Post[]>([]);
  const [loading, setLoading] = createSignal(true);
  const [loadingMore, setLoadingMore] = createSignal(false);
  const [hasMore, setHasMore] = createSignal(true);
  const [error, setError] = createSignal("");
  const [query, setQuery] = createSignal("");
  const [activeQuery, setActiveQuery] = createSignal("");
  const [lightboxUrl, setLightboxUrl] = createSignal<string | null>(null);
  const [sortField, setSortField] = createSignal(SortField.Date);
  const [sortOrder, setSortOrder] = createSignal(SortOrder.Descending);
  let nextPageToken: string | null = searchParams.page_token || null;
  let followedBlogIds: number[] = [];
  let loadMoreRef: HTMLButtonElement | undefined;

  const syncUrl = () => {
    setSearchParams(
      { page_token: nextPageToken || undefined },
      { replace: true },
    );
  };

  const fetchFeed = async () => {
    if (!user()?.blog_id) {
      setError("Not authenticated");
      setLoading(false);
      return;
    }
    setLoading(true);
    setLoadingMore(false);
    setError("");
    setPosts([]);
    setHasMore(true);

    try {
      const q = activeQuery();
      if (q) {
        const data = await searchPostsByTag({
          tag_name: q,
          sort_field: sortField(),
          order: sortOrder(),
          post_types: [
            PostType.Text,
            PostType.Image,
            PostType.Video,
            PostType.Audio,
            PostType.Link,
            PostType.Chat,
            PostType.Quote,
          ],
          variants: [1],
          page: nextPageToken
            ? { page_size: 20, page_token: nextPageToken }
            : { page_size: 20 },
        });
        const incoming = data.posts ?? [];
        setPosts(incoming);
        nextPageToken = data.page?.nextPageToken ?? null;
        if (!nextPageToken) setHasMore(false);
      } else {
        followedBlogIds = getCachedFollowingIds();
        if (followedBlogIds.length === 0) {
          setPosts([]);
          return;
        }
        const data = await listBlogsRecentActivity(followedBlogIds, 20);
        const incoming = data.posts ?? [];
        setPosts(incoming);
        nextPageToken = data.page?.nextPageToken ?? null;
        if (!nextPageToken) setHasMore(false);
      }
    } catch (err: unknown) {
      setError((err as Error)?.message || "Failed to load feed");
    } finally {
      setLoading(false);
    }
  };

  createEffect(() => {
    if (authLoading() || !user()) return;
    fetchFeed();
  });

  const loadMore = async () => {
    if (!hasMore() || loadingMore() || !nextPageToken) return;
    setLoadingMore(true);
    const token = nextPageToken;
    nextPageToken = null;
    try {
      const q = activeQuery();
      if (q) {
        const data = await searchPostsByTag({
          tag_name: q,
          sort_field: sortField(),
          order: sortOrder(),
          post_types: [
            PostType.Text,
            PostType.Image,
            PostType.Video,
            PostType.Audio,
            PostType.Link,
            PostType.Chat,
            PostType.Quote,
          ],
          variants: [1],
          page: { page_size: 20, page_token: token },
        });
        const incoming = data.posts ?? [];
        setPosts((prev) => [...prev, ...incoming]);
        nextPageToken = data.page?.nextPageToken ?? null;
        if (!nextPageToken) setHasMore(false);
        syncUrl();
      } else {
        if (followedBlogIds.length === 0) return;
        const data = await listBlogsRecentActivity(followedBlogIds, 20, token);
        const incoming = data.posts ?? [];
        setPosts((prev) => [...prev, ...incoming]);
        nextPageToken = data.page?.nextPageToken ?? null;
        if (!nextPageToken) setHasMore(false);
        syncUrl();
      }
    } catch {
      nextPageToken = token;
      syncUrl();
    } finally {
      setLoadingMore(false);
    }
  };

  onMount(() => {
    if (!loadMoreRef) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        loadMore();
      }
    });
    observer.observe(loadMoreRef);
    onCleanup(() => observer.disconnect());
  });

  const doSearch = (e: Event) => {
    e.preventDefault();
    setActiveQuery(query());
    nextPageToken = null;
    fetchFeed();
  };

  const clearSearch = () => {
    setQuery("");
    setActiveQuery("");
    nextPageToken = null;
    fetchFeed();
  };

  const handleTagClick = (tag: string) => {
    const q = (query() ? query() + " " : "") + `tag:${tag}`;
    setQuery(q);
    setActiveQuery(q);
    nextPageToken = null;
    fetchFeed();
  };

  return (
    <Show when={!authLoading() && user()} fallback={null}>
      <Title>Following feed — bbdsmlr</Title>
      <div class="home-page">
        <Header info="Following feed" />
        <main>
          <form class="search-bar" onSubmit={doSearch}>
            <SortDropdown
              value={`${sortField()}-${sortOrder()}`}
              onChange={(sf, so) => {
                setSortField(sf);
                setSortOrder(so);
                nextPageToken = null;
                fetchFeed();
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
                setQuery(q);
                setActiveQuery(q);
                nextPageToken = null;
                fetchFeed();
              }}
            />
          </form>

          {error() && <p class="error">{error()}</p>}

          {loading() && <p class="loading">Loading feed…</p>}

          <Show when={!loading()}>
            <Show
              when={posts().length > 0}
              fallback={
                <p class="empty">
                  {activeQuery()
                    ? "No results found."
                    : "No posts from followed blogs."}
                </p>
              }
            >
              <div class="feed">
                <For each={posts()}>
                  {(post) => (
                    <PostCard
                      post={post}
                      onTagClick={handleTagClick}
                      onImageClick={(url) =>
                        setLightboxUrl(upgradeToLightbox(url))
                      }
                    />
                  )}
                </For>
              </div>
            </Show>
          </Show>

          <button
            ref={loadMoreRef}
            onClick={loadMore}
            disabled={loadingMore()}
            class="btn-ghost"
            style="display:block;margin:24px auto"
          >
            {loadingMore() ? "Loading more" : "Load more"}
          </button>
        </main>
        <LightBox url={lightboxUrl()} onClose={() => setLightboxUrl(null)} />
      </div>
    </Show>
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
    return getPostMediaUrls(post).map((url) => ({ url, type: getMediaType(url) }));
  };

  const imageUrls = () =>
    mediaItems()
      .filter((i) => i.type === "image")
      .map((i) => i.url);

  const contentHtml = () => {
    const c = post.content;
    if (!c?.html) return null;
    const processed =
      post.type === PostType.Text
        ? processContentHtml(c.html, getPostMediaUrls(post))
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
        <span>
          <HeartIcon /> {post.likesCount ?? 0}
        </span>
        <span>
          <ChatIcon /> {post.commentsCount ?? 0}
        </span>
        <span>
          <ReblogIcon /> {post.reblogsCount ?? 0}
        </span>
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

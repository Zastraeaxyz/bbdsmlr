import { createSignal, createEffect, For, Show, onMount, onCleanup } from "solid-js";
import { A, useSearchParams } from "@solidjs/router";
import { Title } from "@solidjs/meta";
import {
  listBlogActivity,
  PostType,
  PostVariant,
  SortField,
  SortOrder,
  type Post,
} from "~/lib/api";
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

export default function LikedPosts() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [posts, setPosts] = createSignal<Post[]>([]);
  const [loading, setLoading] = createSignal(true);
  const [loadingMore, setLoadingMore] = createSignal(false);
  const [hasMore, setHasMore] = createSignal(true);
  const [error, setError] = createSignal("");
  const [lightboxUrl, setLightboxUrl] = createSignal<string | null>(null);
  const [sortField, setSortField] = createSignal(SortField.Date);
  const [sortOrder, setSortOrder] = createSignal(SortOrder.Descending);
  let nextPageToken: string | null = searchParams.page_token || null;
  let loadMoreRef: HTMLButtonElement | undefined;

  const syncUrl = () => {
    setSearchParams(
      { page_token: nextPageToken || undefined },
      { replace: true },
    );
  };

  const fetchLiked = async () => {
    const u = user();
    if (!u?.blog_id) {
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
      const data = await listBlogActivity({
        blog_id: u.blog_id,
        sort_field: sortField(),
        order: sortOrder(),
        post_types: [1, 2, 3, 4, 5, 6, 7],
        activity_kinds: ["like"],
        page: nextPageToken
          ? { page_size: 20, page_token: nextPageToken }
          : { page_size: 20 },
      });
      const incoming = data.posts ?? [];
      setPosts(incoming);
      nextPageToken = data.page?.nextPageToken ?? null;
      if (!nextPageToken) setHasMore(false);
    } catch (err: unknown) {
      setError((err as Error)?.message || "Failed to load liked posts");
    } finally {
      setLoading(false);
    }
  };

  createEffect(() => {
    fetchLiked();
  });

  const loadMore = async () => {
    const u = user();
    if (!u?.blog_id || !hasMore() || loadingMore() || !nextPageToken) return;
    setLoadingMore(true);
    const token = nextPageToken;
    nextPageToken = null;
    try {
      const data = await listBlogActivity({
        blog_id: u.blog_id,
        sort_field: sortField(),
        order: sortOrder(),
        post_types: [1, 2, 3, 4, 5, 6, 7],
        activity_kinds: ["like"],
        page: { page_size: 20, page_token: token },
      });
      const incoming = data.posts ?? [];
      setPosts((prev) => [...prev, ...incoming]);
      nextPageToken = data.page?.nextPageToken ?? null;
      if (!nextPageToken) setHasMore(false);
      syncUrl();
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

  return (
    <div class="home-page">
      <Title>Liked posts — bbdsmlr</Title>
      <Header info="Liked posts" />
      <main>
        <div class="search-bar">
          <SortDropdown
            value={`${sortField()}-${sortOrder()}`}
            onChange={(sf, so) => {
              setSortField(sf);
              setSortOrder(so);
              nextPageToken = null;
              setPosts([]);
              setHasMore(true);
              fetchLiked();
            }}
          />
        </div>

        {error() && <p class="error">{error()}</p>}

        {loading() && <p class="loading">Loading liked posts…</p>}

        <Show when={!loading()}>
          <Show
            when={posts().length > 0}
            fallback={<p class="empty">No liked posts yet.</p>}
          >
            <div class="feed">
              <For each={posts()}>
                {(post) => (
                  <PostCard
                    post={post}
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
  );
}

function PostCard(props: { post: Post; onImageClick?: (url: string) => void }) {
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
          <For each={post.tags}>{(t) => <span class="tag">#{t}</span>}</For>
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

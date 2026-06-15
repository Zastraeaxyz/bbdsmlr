import { createSignal, createEffect, For, Show } from "solid-js";
import { useParams, A } from "@solidjs/router";
import { Title } from "@solidjs/meta";
import {
  getCurrentUser,
  getPostDetail,
  PostType,
  PostVariant,
  type Post,
} from "~/lib/api";
import {
  sanitizeHtml,
  processContentHtml,
  transformMediaUrl,
  getMediaType,
  type MediaType,
} from "~/lib/sanitize";
import Header from "~/components/Header";
import { ReblogAttribution } from "~/components/ReblogAttribution";
import { LightBox } from "~/components/LightBox";
import { HeartIcon, ChatIcon, ReblogIcon, DownloadIcon, BdsmlrIcon } from "~/components/Icons";
import { DownloadModal } from "~/components/DownloadModal";
import { downloadImages } from "~/lib/download";
import { formatRelativeDate } from "~/lib/date";

export default function PostPage() {
  const params = useParams();
  const user = getCurrentUser();

  const [post, setPost] = createSignal<Post | null>(null);
  const [loading, setLoading] = createSignal(true);
  const [error, setError] = createSignal("");
  const [lightboxUrl, setLightboxUrl] = createSignal<string | null>(null);

  createEffect(() => {
    const postId = Number(params.id);
    if (!postId) {
      setError("Invalid post ID");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError("");
    getPostDetail(postId)
      .then((data) => {
        if (data.error) {
          setError(data.error);
          return;
        }
        setPost(data.post ?? null);
      })
      .catch((err: unknown) =>
        setError((err as Error)?.message || "Failed to load post"),
      )
      .finally(() => setLoading(false));
  });

  return (
    <div class="home-page">
      <Title>
        {post()?.blogName
          ? `${post()!.blogName}'s Post — bbdsmlr`
          : "Post — bbdsmlr"}
      </Title>
      <Header info={user?.blog_name || user?.username || undefined}>
        <A href="/" class="btn-ghost">
          Home
        </A>
        {user && (
          <A href={`/${user.blog_name}`} class="btn-ghost">
            My feed
          </A>
        )}
      </Header>
      <main>
        {error() && <p class="error">{error()}</p>}
        {loading() && <p class="loading">Loading post…</p>}
        <Show when={!loading() && post()}>
          <PostDetail post={post()!} onImageClick={setLightboxUrl} />
        </Show>
      </main>
      <LightBox url={lightboxUrl()} onClose={() => setLightboxUrl(null)} />
    </div>
  );
}

function PostDetail(props: {
  post: Post;
  onImageClick?: (url: string) => void;
}) {
  const [showDownloadModal, setShowDownloadModal] = createSignal(false);

  const handleDownloadClick = () => {
    const urls = imageUrls();
    if (urls.length === 1) {
      downloadImages({ urls, blogName: props.post.blogName, postId: props.post.id });
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
    const c = props.post.content;
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
    const c = props.post.content;
    if (!c?.html) return null;
    const processed =
      props.post.type === PostType.Text
        ? processContentHtml(c.html, c.files)
        : c.html;
    return sanitizeHtml(processed);
  };

  return (
    <article class="post-detail">
      <div class="post-detail-header">
        <A href={`/${props.post.blogName}`} class="post-detail-blog">
          {props.post.blogName}
        </A>
        <span class="feed-card-type">{postTypeLabel(props.post.type)}</span>
        <Show when={!props.post.id}>
          <span class="feed-card-type">DELETED</span>
        </Show>
        {props.post.createdAtUnix && (
          <span class="post-detail-time">
            {formatRelativeDate(props.post.createdAtUnix)}
          </span>
        )}
      </div>

      <ReblogAttribution
        originBlogName={props.post.originBlogName}
        originPostId={props.post.originPostId}
        variant={props.post.variant}
      />

      {props.post.title && (
        <h2 class="post-detail-title">{props.post.title}</h2>
      )}
      {contentHtml() && (
        <div
          class="post-detail-body"
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

      {props.post.type !== PostType.Text && mediaItems().length > 0 && (
        <div class="post-detail-images">
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

      {props.post.tags && props.post.tags.length > 0 && (
        <div class="post-detail-tags">
          <For each={props.post.tags}>
            {(t) => <span class="tag">#{t}</span>}
          </For>
        </div>
      )}

      <div class="post-detail-meta">
        <span>
          <HeartIcon /> {props.post.likesCount ?? 0}
        </span>
        <span>
          <ChatIcon /> {props.post.commentsCount ?? 0}
        </span>
        <span>
          <ReblogIcon /> {props.post.reblogsCount ?? 0}
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
        <Show when={props.post.id}>
          <a
            href={`https://bdsmlr.com/post/${props.post.id}`}
            target="_blank"
            rel="noopener noreferrer"
            class="download-btn"
            title="Open on BDSMLR"
          >
            <BdsmlrIcon />
          </a>
        </Show>
      </div>
      <Show when={showDownloadModal()}>
        <DownloadModal
          urls={imageUrls()}
          blogName={props.post.blogName}
          postId={props.post.id}
          onClose={() => setShowDownloadModal(false)}
        />
      </Show>
    </article>
  );
}

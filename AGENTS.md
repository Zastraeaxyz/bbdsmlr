# Rules

1. Never commit or push unless explicitly requested by the user.
2. Always use conventional commits style (e.g. `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, etc.).

# API quirks

If a new API quirk has been discovered, please document it here in #API Quirks section.

- Login response is **snake_case** (`blog_id`, `blog_name`, `user_id`).
- `resolveIdentifier` returns **camelCase** (`blogId`, `blogName`).
- `listBlogActivity` request fields are **snake_case**; `page` is an integer, not `{ page_size }`; `activity_kinds` uses `['post', 'reblog']`.
- `.gif` files may be served as `video/mp4`. Render each URL in a `.media-shell` (CSS grid overlapping) with both `<img>` and `<video muted controls>`. Each hides on `onError`. For `.gif`-as-video, the `<video>` gets `autoplay loop playsinline`; for other videos, `autoplay`/`loop`/`playsinline` are omitted so the video starts muted but does not autoplay.

# Rules

1. Never commit or push unless explicitly requested by the user.
2. Always use conventional commits style (e.g. `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, etc.).

# Auth
- Auth persistence uses `localStorage` (key `user`)

# Routing

- `/:user` — any blog's feed (no auth; `resolveIdentifier` + `listBlogActivity`).
- `/post/:id` — post detail (no auth).
- `/login` — redirects to `/${user.blog_name}` on success.
- `/` — redirects to `/login`.
- Blog names are `<A>` links to `/:user`.

# API quirks

- Login response is **snake_case** (`blog_id`, `blog_name`, `user_id`).
- `resolveIdentifier` returns **camelCase** (`blogId`, `blogName`).
- `listBlogActivity` request fields are **snake_case**; `page` is an integer, not `{ page_size }`; `activity_kinds` uses `['post', 'reblog']`.

# Image/Video rendering

- `.gif` files may be served as `video/mp4`. Render each URL in a `.media-shell` (CSS grid overlapping) with both `<img>` and `<video muted loop playsinline controls>`. Each hides on `onError`.

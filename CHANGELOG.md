# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- **Login disclaimer** — The login page now shows a legal disclaimer explaining that this is an alternative front-end to BDSMLR, that all content is user-provided and hosted by BDSMLR, and that you must be of legal age to view adult content. You must check an acknowledgement box before signing in, confirming that the developers own no displayed content and that you comply with BDSMLR's Terms of Service.
- **Profile search fix** — Searching on user profiles now uses the blog-specific search API again instead of the global tag search.
- **Sort readability** — Sort field and order values are now expressed as human-readable named constants (`SortField.Date`, `SortOrder.Descending`, etc.) throughout the codebase.
- **Sort label fix** — Sort dropdowns now correctly label `Date + Descending` as "Newest" and `Date + Ascending` as "Oldest", matching the actual API semantics.
- **Custom sort dropdown** — The sort selector is now a custom dropdown instead of a native browser `<select>`. It stays open when you click elsewhere on the page, and its selection persists when you submit a search or press Enter. Each page can configure which sort options are available.
- **Open on BDSMLR** — Every post card and profile page now has a button that opens the original post or blog on BDSMLR in a new tab.

## [0.1.0] - 2026-06-15

### Added

- **Login** — Log in with your email/username and password. Your session stays active across browser tabs.
- **Read-only** — Browse and view content. Posting/liking/following new posts/users unsupported.
- **Compliant** — Complies with bdsmlr's openapi spec and does not use `internal-write` endpoints.
- **Home feed** — See posts from the people you follow right on the home page.
- **User profiles** — Visit any blog by name to see their posts, profile picture, description, and popular tags.
- **Search** — Find posts with powerful filters: by tag, blog name, post type, media type, or date. Includes search tips, and every tag is clickable to find more like it. Search from the beginning of the app's history.
- **Tag search** — Click any tag or search for one to discover all posts with that tag, with sorting options.
- **Post pages** — Click any post to see it in full detail with all media, tags, and engagement counts. Permalinks to share or revisit posts.
- **Liked posts** — Browse everything you've liked, with sorting options.
- **Download posts** — Each post has a download button that supports both single and multiple images, with the option to preserve order, as well as videos.
- **Full-screen media** — Tap any image or video to view it full-screen without losing quality.
- **Reblog tracking** — See who originally posted content and jump straight to the original post.
- **Fixed Media** — Using old source urls to allow images/gifs/videos to play like they once did.
- **Smooth media** — Images, GIFs, and videos display smoothly in your feed. Animated GIFs play automatically.
- **Deleted posts** — Posts from deleted authors now show a "DELETED" flair so you know why they can't be opened, and their permalinks are hidden.

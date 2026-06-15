# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- **User dropdown in navbar** — The navbar now shows your avatar and username instead of a plain "Sign out" button. Clicking it opens a dropdown with a "Following" shortcut and a "Sign out" button. The dropdown closes on outside click or Escape.
- **Following page** — Visit `/:username/following` to see every blog a user follows, with links to each profile. The navbar has a `Following` shortcut for the current user.
- **Profile Following button** — Every user profile page now has a "Following" button next to the BDSMLR icon that links to the user's following list.

## [0.2.0] - 2026-06-15

### Added

- **Show all tags** — A "Show all (N)" button appears after the top 5 tags on user profiles. Clicking it opens a modal with every remaining tag. The modal closes when you click outside, click the X, or click a tag (which also adds it to the current filter).
- **Bulk downloads** — You can now download every post from a blog or all of your liked posts as a single ZIP archive. A progress panel in the header tracks each job and lets you download the ZIP once it is ready.
- **Resumable downloads** — Bulk downloads are persisted on the server using SQLite. If you navigate away or close the tab, the job continues in the background and you can resume it when you return.
- **Login disclaimer** — The login page now shows a legal disclaimer explaining that this is an alternative front-end to BDSMLR, that all content is user-provided and hosted by BDSMLR, and that you must be of legal age to view adult content. You must check an acknowledgement box before signing in, confirming that the developers own no displayed content and that you comply with BDSMLR's Terms of Service.
- **Profile search fix** — Searching on user profiles now uses the blog-specific search API again instead of the global tag search.
- **Sort readability** — Sort field and order values are now expressed as human-readable named constants (`SortField.Date`, `SortOrder.Descending`, etc.) throughout the codebase.
- **Sort label fix** — Sort dropdowns now correctly label `Date + Descending` as "Newest" and `Date + Ascending` as "Oldest", matching the actual API semantics.
- **Custom sort dropdown** — The sort selector is now a custom dropdown instead of a native browser `<select>`. It stays open when you click elsewhere on the page, and its selection persists when you submit a search or press Enter. Each page can configure which sort options are available.
- **Open on BDSMLR** — Every post card and profile page now has a button that opens the original post or blog on BDSMLR in a new tab.

### Fixed

- **Auth reactivity** — Extracted auth state into a shared `useAuth` hook with a context provider so the nav bar and every page reactively reflect the login state instead of each one duplicating `localStorage` reads and module-level variable checks. Login redirects and sign-out now work consistently across all routes.
- **Tags with spaces** — Tags containing spaces are now wrapped in quotes when added to the search filter (e.g. `tag:"hello world"` instead of `tag:hello world`), so the API correctly matches the full tag.
- **Liked posts bulk download authentication** — The liked-posts page and download-jobs panel now read the user from `localStorage` reactively instead of capturing it at module load time, so the bulk download button works reliably on direct page refreshes.
- **Cookie forwarding for download jobs** — All download-job API calls now explicitly send `credentials: 'include'`, ensuring the server can forward the authentication cookie to the BDSMLR API when discovering and downloading liked posts.
- **Two-phase bulk downloads** — Clicking "Download all" now starts a discovery phase that finds all posts without downloading anything. Once discovery is complete, the download panel shows a confirmation prompt: "You're about to download X images from Y posts." You must click "Start download" before any actual downloading begins. This makes large bulk downloads more predictable and easier to debug.

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

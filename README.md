# Better BDSMLR

A read-only browser client for [BDSMLR](https://bdsmlr.com/). Log in, follow your feed, search posts, and browse blogs — no posting or write capabilities.

## Features

- **Login** — Authenticate with email/username and password. Includes a legal disclaimer and acknowledgement checkbox.
- **Following feed** — See recent posts from blogs you follow, with sort and pagination
- **Blog pages** — View any blog's posts, header, avatar, description, top tags (expandable in a modal), and following count
- **Following page** — Visit `/:username/following` to browse every blog a user follows, with avatar, description, and creation date
- **Advanced Search** — Rich query syntax with operators, field filters (`tag:`, `blog:`, `post:`, `media:`, `when:`), and boolean logic
- **Liked posts** — Browse your liked posts with sorting
- **Post detail** — View full post content with media, tags, counts, and reblog attribution
- **Media lightbox** — Click images/videos for a full-screen overlay
- **Individual post downloads** — Download single or multiple images from a post, with ordering and video support
- **Bulk downloads** — Download every post from a blog or all your liked posts as a ZIP archive. Downloads resume if interrupted and persist across sessions via SQLite.
- **User dropdown** — The navbar shows your avatar and username with quick access to Following and Sign out
- **Open on BDSMLR** — Every post and profile has a button to open the original on BDSMLR in a new tab
- **Reblog tracking** — See who originally posted content and jump to the original post
- **Deleted post flair** — Posts from deleted authors show a "DELETED" badge; permalinks are hidden
- **Read-only** — Browsing client with no posting or write capabilities

## Disclaimer

I will not deploy or host a public instance of this app for legal reasons. You **must self-host** if you want to use it. A downloadable desktop version may come in the future for ease of use.

## Running the app in Docker

> **Not a developer?** Install [opencode desktop](https://opencode.ai) and use its free "**big pickle**" model — most of this repo was written with it, so it can handle setting everything up for you.

1. Install [Docker](https://www.docker.com/) on your system.
2. Clone the repo
3. Run: `docker compose up -d`

That's all there is to it.

The app listens on **port 3000**. A named volume (`drizzle-data`) persists the SQLite database across restarts. SQLite stores download information.

Then open [http://localhost:3000](http://localhost:3000).

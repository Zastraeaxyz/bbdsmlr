# Better BDSMLR

A read-only browser client for [BDSMLR](https://bdsmlr.com/). Log in, follow your feed, search posts, and browse blogs — no posting or write capabilities.

## Features

- **Login** — Authenticate with email/username and password
- **Following feed** — See recent posts from blogs you follow, with sort and pagination
- **Blog pages** — View any blog's posts, header, avatar, description, and top tags
- **Advanced Search** — Rich query syntax with operators, field filters (`tag:`, `blog:`, `post:`, `media:`, `when:`), and boolean logic
- **Liked posts** — Browse your liked posts
- **Post detail** — View full post content with media, tags, counts, and reblog attribution
- **Media lightbox** — Click images/videos for a full-screen overlay
- **Read-only** — Browsing client with no posting or write capabilities

## Disclaimer

I will not deploy or host a public instance of this app for legal reasons. You **must self-host** if you want to use it. A downloadable desktop version may come in the future for ease of use.

## Running Locally

> **Not a developer?** Install [opencode desktop](https://opencode.ai) and use its free "**big pickle**" model — most of this repo was written with it, so it can handle setting everything up for you.

```bash
# Install dependencies
npm install
# Start the dev server
npm run dev
```

The app opens at [http://localhost:5173](http://localhost:5173). Log in with your BDSMLR credentials to get started.

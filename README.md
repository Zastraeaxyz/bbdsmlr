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

I will not deploy or host a public instance of this app for legal reasons. You **must self-host** if you want to use it. A downloadable desktop version is available for Windows.

## Desktop app (Windows)

The desktop app is a single `.exe` that runs the web server in the background and lives in the Windows system tray. Right-click the tray icon to open the app in your browser or quit.

### Download a pre-built release

1. Go to the [Releases](https://github.com/yourname/bbdmslr/releases) page.
2. Download the latest `BetterBDSMLR-vX.X.X-windows.zip`.
3. Extract the zip anywhere.
4. Run `BetterBDSMLR.exe`.
5. Right-click the system tray icon and select **Open in Browser**.

### Build the desktop app yourself

You need Node.js 22+ and pnpm.

```bash
pnpm install
pnpm desktop:build
```

The output will be in `dist-desktop/`. Zip that folder and distribute it.

### How it works

- The app is a **Node.js Single Executable Application (SEA)**. The entire Node.js runtime is embedded in the `.exe`.
- The web server starts automatically on launch.
- Your data (database and downloads) is stored in `%APPDATA%\BetterBDSMLR`.
- The server runs on **port 3000**.

## Running the app in Docker

> **Not a developer?** Install [opencode desktop](https://opencode.ai) and use its free "**big pickle**" model — most of this repo was written with it, so it can handle setting everything up for you.

1. Install [Docker](https://www.docker.com/) on your system.
2. Clone the repo
3. Run: `docker compose up -d`

That's all there is to it.

The app listens on **port 3000**. A named volume (`drizzle-data`) persists the SQLite database across restarts. SQLite stores download information.

Then open [http://localhost:3000](http://localhost:3000).

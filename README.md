# donnie.com

Personal site of Donnie Flood — bio, projects, and writing.
Built with [Astro 6](https://astro.build), [Tailwind v4](https://tailwindcss.com), and a custom **Riad** design system (Bohemian Mediterranean palette: cobalt, marigold, coral, olive, plum, terracotta, cream).

> Working on the site with Claude Code or another agent? Read **[AGENTS.md](./AGENTS.md)** first — it has everything you need.

---

## Run it locally

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # static site → ./dist
npm run preview  # preview the production build
```

| Command           | What it does                                    |
| ----------------- | ----------------------------------------------- |
| `npm run dev`     | Dev server with hot reload                      |
| `npm run build`   | Build static site to `./dist/`                  |
| `npm run preview` | Preview the production build                    |
| `npm run format`  | Prettier-format the codebase                    |
| `npx astro check` | TypeScript / Astro diagnostics                  |

---

## Add a blog post

Drop a `.md` (or `.mdx`) file into [`src/content/posts/`](./src/content/posts). The filename becomes the URL slug.

```markdown
---
title: "On writing fewer, longer notes"
description: "Why I stopped chasing the perfect note-taking system."
date: "2026-05-02"
tags: ["writing", "tools"]   # optional, defaults to []
image: "/static/og-image.png" # optional, used for social cards
---

Your post body in **Markdown**. Code blocks get syntax highlighting:

​```ts
const sum = (a: number, b: number) => a + b;
​```
```

That's it — the post will appear at `/posts/<filename>` and on the home page's "Featured posts" list (latest 4).

The schema lives in [`src/content.config.ts`](./src/content.config.ts).

---

## Add a project

Drop a `.md` file into [`src/content/projects/`](./src/content/projects). Each project becomes a card on the home page's "Featured projects" grid.

```markdown
---
title: "LiveVue"
description: "Server-rendered, real-time UIs for Vue developers."
year: "2024"
meta: "Open source · TypeScript"   # optional, shown after the year
badge: "Open source"               # optional pill on the card
badgeColor: "cobalt"               # cobalt | marigold | coral | olive | plum
thumbColor: "cobalt"               # cobalt | coral | olive | plum
order: 1                           # lower numbers come first
href: "https://github.com/floodfx" # optional click target
---

Optional longer description (not currently rendered, but the file body is available
on the entry if you want to show it later).
```

---

## Theming — the design system

All design tokens live in **[`src/styles/global.css`](./src/styles/global.css)**. Two layers:

1. **CSS custom properties** (`:root { --c-cobalt: … }`) — raw values for the palette, semantic roles, shadows, etc. Override them under `[data-theme="dark"]` / `html.dark` for dark mode.
2. **`@theme` block** — exposes those CSS vars as Tailwind utilities. So `--color-cobalt: var(--c-cobalt)` makes `bg-cobalt`, `text-cobalt`, `border-cobalt` Just Work.

To retheme, edit the values in `:root` and the dark variant — every component picks them up automatically. To add a new color, define a `--c-foo` and add `--color-foo: var(--c-foo)` under `@theme`.

Reusable component classes (`.btn`, `.badge`, `.tag`, `.eyebrow`, `.surface`) are in the same file under `@layer components`.

---

## Project structure

```
.
├── public/                  # static assets (favicon, fonts, images)
├── src/
│   ├── components/          # Header, Footer, ThemeToggle
│   ├── content/
│   │   ├── posts/           # blog post markdown files
│   │   └── projects/        # project markdown files
│   ├── content.config.ts    # collection schemas (zod)
│   ├── layouts/Layout.astro # html shell, fonts, theme bootstrap
│   ├── pages/
│   │   ├── index.astro      # home (hero, projects, posts, about)
│   │   ├── posts/index.astro      # /posts list
│   │   ├── posts/[...slug].astro  # individual post
│   │   ├── rss.xml.js
│   │   └── robots.txt.ts
│   ├── styles/global.css    # design system + Tailwind v4 @theme
│   ├── lib/utils.ts         # small helpers (formatDate, etc.)
│   └── consts.ts            # SITE_TITLE, EMAIL, etc.
├── astro.config.mjs         # Astro + @tailwindcss/vite + Shiki config
└── AGENTS.md                # agent guide (start here if you're an LLM)
```

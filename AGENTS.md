# Agent guide — donnie.com

Hello, agent. This file is the source of truth for working on this repo. The user-facing [README.md](./README.md) covers the basics; this file goes deeper on conventions, tradeoffs, and gotchas you'll hit.

## What this is

A personal site (`donnie.com`) — static, deployed to GitHub Pages. Three kinds of pages:

- `/` — home: hero, featured projects, featured posts, about, contact
- `/posts` and `/posts/[slug]` — writing
- `/rss.xml`, `/robots.txt`, `/sitemap-index.xml` — generated

Two content collections, both under `src/content/`:

- **`posts`** — blog entries, latest 4 surfaced on the home page
- **`projects`** — work the user wants to highlight on the home page

## Stack — and why

| Piece                 | Version | Notes                                                                    |
| --------------------- | ------- | ------------------------------------------------------------------------ |
| Astro                 | 6.x     | Uses the **Content Layer API** (`glob()` loader). No legacy collections. |
| Tailwind              | 4.x     | Wired via `@tailwindcss/vite`. **No `tailwind.config.ts`** — it's gone.  |
| Shiki                 | bundled | Dual themes (`github-light` + `github-dark-dimmed`), `defaultColor:false`|
| MDX, RSS, Sitemap     | latest  | Standard Astro integrations                                              |

If you upgrade Astro or Tailwind, expect content collections (Astro) and `@theme` directives (Tailwind) to break first — those are the surfaces with the most churn.

## Adding content

### A blog post

Create `src/content/posts/<slug>.md` (or `.mdx`):

```markdown
---
title: "Post title"
description: "One-sentence summary used in lists and meta tags."
date: "2026-05-09"          # ISO or anything Date can parse
tags: ["writing", "tools"]   # optional, default []
image: "/static/og.png"      # optional, default placeholder
---

Body in Markdown.
```

The frontmatter schema is enforced by [`src/content.config.ts`](./src/content.config.ts) (zod). If you add a field, update both the schema and any pages that read it.

Code fences with a language get syntax highlighting via Shiki:

````
```ts
const x: number = 1;
```
````

Both light and dark themes are emitted as CSS variables; the active one is selected by `html.dark` (see `.astro-code` rules in `src/styles/global.css`).

### A project

Create `src/content/projects/<slug>.md`:

```markdown
---
title: "LiveVue"
description: "One-sentence pitch — shown directly on the card."
year: "2024"                  # free-form string, e.g. "2023 — present"
meta: "Open source · TypeScript"   # optional
badge: "Open source"          # optional pill text
badgeColor: "cobalt"          # cobalt | marigold | coral | olive | plum
thumbColor: "cobalt"          # cobalt | coral | olive | plum
order: 1                      # lower = earlier
href: "https://…"             # optional link target
---
```

The body of the file is currently unused on the home page. Don't waste effort writing prose there until/unless the user asks for project detail pages.

## Design system — the Riad palette

Tokens live in **`src/styles/global.css`**. The setup is intentionally simple so it stays editable.

```
:root { --c-cobalt: #1f4ea8; ... }   ← raw palette
:root { --bg, --fg, --primary, ... }  ← semantic roles, mapped to palette
@theme { --color-cobalt: var(--c-cobalt); ... }   ← exposed to Tailwind
```

Three rules of thumb:

1. **To retheme**, edit the `:root` values (and the dark variant under `html.dark, [data-theme="dark"]`). Every component picks up the change.
2. **To add a color**, declare `--c-foo` in `:root`, mirror it in dark mode, then add `--color-foo: var(--c-foo)` inside `@theme`. After that, `bg-foo`/`text-foo`/`border-foo` work as Tailwind utilities.
3. **To add a component**, prefer extending `@layer components` in `global.css` over creating new Astro components — the design system is meant to be a small set of shared primitives.

### Tailwind v4 quirks worth knowing

- There is **no `tailwind.config.ts`** in this repo. All theme tokens come from the `@theme {}` block in `global.css`.
- `@apply` inside Astro **scoped `<style>` blocks** needs `@reference "../styles/global.css";` (relative path) at the top of the block, otherwise the build fails with `Cannot apply unknown utility class …`. Examples in `src/components/Header.astro` and `src/pages/index.astro`.
- Arbitrary values (`text-[clamp(40px,5.5vw,72px)]`, `grid-template-columns:[1.4fr_1fr]`) are common in this codebase — preserve them rather than inventing new tokens for one-offs.

## Theme switching

`html.dark` toggles dark mode. The bootstrap script in `src/layouts/Layout.astro` reads `localStorage.theme` first, falls back to `prefers-color-scheme`, and a `MutationObserver` writes back to `localStorage` whenever the class changes. The `ThemeToggle` button just toggles the class.

If you need a third theme, the right move is another `[data-theme="X"]` block in `global.css`, not adding logic to the bootstrap script.

## Routes & content APIs (Astro 6)

```ts
// posts collection — uses the new glob loader
const posts = await getCollection("posts");
post.id          // ← the slug (formerly post.slug; do not use .slug, it's gone)
const { Content } = await render(post); // ← `render` from "astro:content", not post.render()
```

Both `src/pages/posts/[...slug].astro` and `src/pages/rss.xml.js` already use the new API. If you're adding new pages that consume collections, follow the same pattern.

## Things to leave alone unless asked

- The **font stack** (Playfair Display + Atkinson Hyperlegible + JetBrains Mono) is loaded from Google Fonts in `Layout.astro`. The `--font-display`/`--font-sans`/`--font-mono` vars in `@theme` map to it. Don't swap these without a heads-up — the whole feel rests on Playfair Display italic.
- The **`max-w-[1100px]` + `px-6` outer container** is the page rhythm. Keep new sections consistent with it.
- The **eyebrow + h2 + lede** pattern at the top of every section. It's the design system's section header — reuse it, don't reinvent it.

## PR conventions

- **Never include a "Test plan" section in PR descriptions.** Summary only.

## When in doubt

- Read [README.md](./README.md) for the user-facing contract.
- Look at `src/pages/index.astro` — it exercises every part of the design system and is the best reference for how things compose.
- The Riad design system source files (the original CSS / HTML the system was ported from) were dropped in `~/Downloads/Donnie Blog/` — they're the canonical reference if you need to trace a token or component back to its origin.

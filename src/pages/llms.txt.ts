import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import {
  AUTHOR_HEADLINE,
  AUTHOR_NAME,
  GITHUB_URL,
  LINKEDIN_URL,
  SITE_DESCRIPTION,
  SITE_LOCATION,
  SITE_TITLE,
  SITE_URL,
} from "../consts";

// llms.txt — see https://llmstxt.org
//
// A short, plain-text site index aimed at LLMs and AI crawlers. Mirrors
// the human-readable site map: who, where, and the canonical URLs for
// each piece of writing or project. Auto-generated from the collections
// so it never drifts.

export const GET: APIRoute = async ({ site }) => {
  const base = site ?? new URL(SITE_URL);

  const posts = (await getCollection("posts")).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
  );
  const projects = (await getCollection("projects")).sort(
    (a, b) =>
      (parseInt(b.data.year.slice(0, 4), 10) || 0) -
      (parseInt(a.data.year.slice(0, 4), 10) || 0),
  );

  const lines: string[] = [];
  lines.push(`# ${SITE_TITLE}`);
  lines.push("");
  lines.push(`> ${SITE_DESCRIPTION}`);
  lines.push("");
  lines.push(`Author: ${AUTHOR_NAME} — ${AUTHOR_HEADLINE}`);
  lines.push(`Location: ${SITE_LOCATION}`);
  lines.push(`GitHub: ${GITHUB_URL}`);
  lines.push(`LinkedIn: ${LINKEDIN_URL}`);
  lines.push("");
  lines.push("## Writing");
  lines.push("");
  for (const p of posts) {
    const url = new URL(`/posts/${p.id}`, base).toString();
    lines.push(`- [${p.data.title}](${url}): ${p.data.description}`);
  }
  lines.push("");
  lines.push("## Projects");
  lines.push("");
  for (const p of projects) {
    const url = p.data.href ?? new URL(`/projects/${p.id}`, base).toString();
    lines.push(`- [${p.data.title}](${url}): ${p.data.description}`);
  }
  lines.push("");
  lines.push("## Optional");
  lines.push("");
  lines.push(`- [RSS feed](${new URL("/rss.xml", base).toString()})`);
  lines.push(
    `- [Sitemap](${new URL("/sitemap-index.xml", base).toString()})`,
  );
  lines.push("");

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};

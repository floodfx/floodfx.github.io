import type { APIRoute } from "astro";

// Open to everything by default — search engines and the major
// LLM crawlers (GPTBot, ClaudeBot, PerplexityBot, etc.) are
// explicitly welcomed via the wildcard rule below.
//
// To deny a specific crawler later, add a stanza like:
//   User-agent: BadBot
//   Disallow: /
const getRobotsTxt = (sitemapURL: URL, llmsURL: URL) => `User-agent: *
Allow: /

# Companion file for AI crawlers / LLMs.
# https://llmstxt.org
LLM-Index: ${llmsURL.href}

Sitemap: ${sitemapURL.href}
`;

export const GET: APIRoute = ({ site }) => {
  const sitemapURL = new URL("sitemap-index.xml", site);
  const llmsURL = new URL("llms.txt", site);
  return new Response(getRobotsTxt(sitemapURL, llmsURL), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};

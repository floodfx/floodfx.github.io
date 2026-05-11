import { OGImageRoute } from "astro-og-canvas";
import { getCollection } from "astro:content";
import {
  AUTHOR_NAME,
  SITE_TAGLINE,
  SITE_TITLE,
  SITE_LOCATION,
} from "../../consts";

// Build a map from route key → { title, description } for every URL
// that needs a social-card image. Each becomes /og/<key>.png.
const posts = await getCollection("posts");
const projects = await getCollection("projects");

type Page = { title: string; description: string };
const pages: Record<string, Page> = {
  index: {
    title: AUTHOR_NAME,
    description: SITE_TAGLINE,
  },
  posts: {
    title: "Writing",
    description: `Notes and essays from ${AUTHOR_NAME}.`,
  },
};

for (const post of posts) {
  pages[`posts/${post.id}`] = {
    title: post.data.title,
    description: post.data.description,
  };
}
for (const project of projects) {
  pages[`projects/${project.id}`] = {
    title: project.data.title,
    description: project.data.description,
  };
}

// Riad palette — kept literal here so the OG card stays in sync
// with the site even if CSS tokens shift.
const COBALT: [number, number, number] = [31, 78, 168];
const CREAM: [number, number, number] = [241, 236, 226];
const PAPER: [number, number, number] = [247, 243, 234];
const INK: [number, number, number] = [28, 24, 20];
const INK_SOFT: [number, number, number] = [58, 52, 44];
const FG_MUTE: [number, number, number] = [106, 96, 85];
const CORAL: [number, number, number] = [232, 85, 62];

export const prerender = true;

// `OGImageRoute` is async (it pre-resolves font + image data), so the
// top-level await is required for the destructured exports below.
export const { getStaticPaths, GET } = await OGImageRoute({
  param: "route",
  pages,
  getImageOptions: (_path, page) => ({
    title: page.title,
    description: page.description,
    logo: { path: "./public/favicon.svg", size: [120] },
    bgGradient: [PAPER, CREAM],
    border: { color: COBALT, width: 8, side: "block-start" },
    padding: 60,
    font: {
      title: {
        families: ["Playfair Display", "Georgia", "serif"],
        size: 78,
        weight: "Bold",
        color: INK,
        lineHeight: 1.1,
      },
      description: {
        families: ["Atkinson Hyperlegible", "Inter", "sans-serif"],
        size: 30,
        weight: "Normal",
        color: INK_SOFT,
        lineHeight: 1.4,
      },
    },
    fonts: [
      "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&display=swap",
      "https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:wght@400;700&display=swap",
    ],
    quality: 90,
    format: "PNG",
  }),
});


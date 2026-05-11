import type { APIRoute } from "astro";
import { ImageResponse } from "@vercel/og";
import { getCollection } from "astro:content";
import { readFileSync } from "node:fs";
import path from "node:path";
import { AUTHOR_NAME, SITE_TAGLINE } from "../../consts";

// Per-page Open Graph card generator.
//
// We use @vercel/og (which is Satori + resvg under the hood) instead
// of a CanvasKit-based pipeline because it lets us lay out the card
// with real JSX + inline CSS. Fonts are bundled as TTFs from
// src/fonts/ so the title renders in actual Playfair Display Italic
// — matching the site's hero — rather than a system fallback.

export const prerender = true;

// — Build the route map: every URL that needs an OG card -----------
type Page = { title: string; description: string };

const posts = await getCollection("posts");
const projects = await getCollection("projects");

const pages: Record<string, Page> = {
  index: { title: AUTHOR_NAME, description: SITE_TAGLINE },
  posts: {
    title: "Writing",
    description: `Notes and essays from ${AUTHOR_NAME}.`,
  },
};
for (const p of posts) {
  pages[`posts/${p.id}`] = {
    title: p.data.title,
    description: p.data.description,
  };
}
for (const p of projects) {
  pages[`projects/${p.id}`] = {
    title: p.data.title,
    description: p.data.description,
  };
}

export const getStaticPaths = () =>
  Object.entries(pages).map(([key, page]) => ({
    // The `.png` suffix is part of the URL so that pages with parent
    // segments (e.g. `posts` + `posts/hello-world`) don't collide on
    // disk during the static build.
    params: { route: `${key}.png` },
    props: page,
  }));

// — Fonts (loaded once) --------------------------------------------
// Satori (the engine inside @vercel/og) supports TTF / OTF / WOFF
// but NOT WOFF2, and chokes on Google's variable Playfair TTFs.
// @fontsource ships static-weight WOFFs that work cleanly, so we
// load those instead. Paths are resolved from project root so they
// stay correct after the route is bundled into dist/.prerender/.
const fontPath = (rel: string) =>
  path.join(process.cwd(), "node_modules", rel);

const playfairBold = readFileSync(
  fontPath("@fontsource/playfair-display/files/playfair-display-latin-700-normal.woff"),
);
const playfairItalic = readFileSync(
  fontPath("@fontsource/playfair-display/files/playfair-display-latin-700-italic.woff"),
);
const atkinson = readFileSync(
  fontPath("@fontsource/atkinson-hyperlegible/files/atkinson-hyperlegible-latin-400-normal.woff"),
);

// — Riad palette ---------------------------------------------------
const COBALT = "#1f4ea8";
const COBALT_INK = "#14306b";
const CORAL = "#e8553e";
const PAPER = "#f7f3ea";
const CREAM = "#f1ece2";
const INK = "#1c1814";
const INK_SOFT = "#3a342c";

// Water-tank brand mark, laid out with flex divs (Satori has limited
// SVG support — no <text> element). The wavy water surface is drawn
// as a single inline SVG <path>, which Satori does support.
const TankLogo = (size: number) => {
  const water = Math.round(size * 0.7);
  return {
    type: "div",
    props: {
      style: {
        width: `${size}px`,
        height: `${size}px`,
        position: "relative",
        background: CREAM,
        borderRadius: `${Math.round(size * 0.18)}px`,
        border: `${Math.max(2, Math.round(size * 0.045))}px solid ${COBALT_INK}`,
        display: "flex",
        overflow: "hidden",
      },
      children: [
        // Wavy water surface — single SVG path (Satori supports <path>).
        {
          type: "svg",
          props: {
            width: size,
            height: water,
            viewBox: "0 0 100 70",
            preserveAspectRatio: "none",
            style: { position: "absolute", left: 0, bottom: 0 },
            children: [
              {
                type: "path",
                props: {
                  d: "M 0 14 Q 12 6, 25 14 T 50 14 T 75 14 T 100 14 L 100 70 L 0 70 Z",
                  fill: COBALT,
                },
              },
            ],
          },
        },
        // "D" centered, sitting on the floor of the tank.
        {
          type: "div",
          props: {
            style: {
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center",
              paddingBottom: `${Math.round(size * 0.04)}px`,
              fontFamily: "Playfair Display",
              fontWeight: 700,
              fontSize: Math.round(size * 0.6),
              lineHeight: 1,
              color: CREAM,
            },
            children: "D",
          },
        },
      ],
    },
  };
};

// — Endpoint --------------------------------------------------------
export const GET: APIRoute<Page> = async ({ props }) => {
  const { title, description } = props;

  return new ImageResponse(
    {
      type: "div",
      props: {
        style: {
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          background: `linear-gradient(180deg, ${PAPER} 0%, ${CREAM} 100%)`,
          fontFamily: "Atkinson Hyperlegible",
          color: INK,
          position: "relative",
        },
        children: [
          // Coral top border
          {
            type: "div",
            props: {
              style: {
                width: "100%",
                height: "10px",
                background: CORAL,
              },
            },
          },
          // Main content area
          {
            type: "div",
            props: {
              style: {
                flex: 1,
                display: "flex",
                flexDirection: "column",
                padding: "60px 70px",
                gap: "32px",
              },
              children: [
                // Top-left logo
                TankLogo(110),
                // Title + description block, pushed down with margin
                {
                  type: "div",
                  props: {
                    style: {
                      marginTop: "auto",
                      display: "flex",
                      flexDirection: "column",
                      gap: "16px",
                      // Leave room on the right edge for the "Donnie.com"
                      // mark so long descriptions never crowd it.
                      maxWidth: "920px",
                    },
                    children: [
                      {
                        type: "div",
                        props: {
                          style: {
                            fontFamily: "Playfair Display Italic",
                            fontWeight: 700,
                            fontStyle: "italic",
                            // Scale down for long titles; Satori doesn't
                            // do fit-to-box so we keep this conservative.
                            fontSize: 72,
                            color: COBALT,
                            lineHeight: 1.05,
                            letterSpacing: "-0.01em",
                          },
                          children: title,
                        },
                      },
                      {
                        type: "div",
                        props: {
                          style: {
                            fontFamily: "Atkinson Hyperlegible",
                            fontSize: 32,
                            color: INK_SOFT,
                            lineHeight: 1.4,
                          },
                          children: description,
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
          // Bottom-right brand mark — far away from text, bold + larger
          {
            type: "div",
            props: {
              style: {
                position: "absolute",
                right: "70px",
                bottom: "44px",
                fontFamily: "Playfair Display Italic",
                fontStyle: "italic",
                fontWeight: 700,
                fontSize: 56,
                color: COBALT,
                letterSpacing: "-0.01em",
              },
              children: "Donnie.com",
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Playfair Display",
          data: playfairBold,
          weight: 700,
          style: "normal",
        },
        {
          name: "Playfair Display Italic",
          data: playfairItalic,
          weight: 700,
          style: "italic",
        },
        {
          name: "Atkinson Hyperlegible",
          data: atkinson,
          weight: 400,
          style: "normal",
        },
      ],
    },
  );
};

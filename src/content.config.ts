import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const posts = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/posts" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    image: z.string().default("/static/blog-placeholder.png"),
    tags: z.array(z.string()).default([]),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    year: z.string(),
    meta: z.string().optional(),
    badge: z.string().optional(),
    badgeColor: z
      .enum(["cobalt", "marigold", "coral", "olive", "plum"])
      .default("cobalt"),
    thumbColor: z
      .enum(["cobalt", "coral", "olive", "plum", "marigold", "terracotta"])
      .default("cobalt"),
    order: z.number().default(0),
    href: z.string().optional(),
    // Custom artwork name. Maps to a component in ProjectArt.astro.
    // Leave unset for the default colored-canvas + index-number fallback.
    artwork: z.string().optional(),
    // Pin the gallery layout for this piece. If unset, the page falls
    // back to a deterministic cycle by index — but pinning means
    // adding/removing projects doesn't reshuffle the others.
    gallerySize: z.enum(["lg", "md", "sm", "xl"]).optional(),
    frameStyle: z
      .enum([
        "thick",
        "thin-double",
        "gilded",
        "wood",
        "bone",
        "cobalt-thin",
        "plum-velvet",
        "fillet-gold",
        "terracotta",
        "iron",
      ])
      .optional(),
  }),
});

export const collections = { posts, projects };

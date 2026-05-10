export function formatDate(date: Date) {
  return Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

// Map a request pathname to the auto-generated OG image URL produced
// by `src/pages/og/[...route].png.ts`. Pathnames are normalized to
// the same keys we register in that file (e.g. "/posts/foo/" →
// "posts/foo"; "/" → "index").
export function ogImageUrl(pathname: string): string {
  const stripped = pathname.replace(/^\/+|\/+$/g, "");
  const key = stripped === "" ? "index" : stripped;
  return `/og/${key}.png`;
}

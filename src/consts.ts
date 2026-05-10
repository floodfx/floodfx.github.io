// Single source of truth for site-wide metadata. Everything below is
// imported into the Layout, structured-data blocks, RSS feed, robots
// and llms files — change a value here and the whole site picks it up.

export const SITE_URL = "https://donnie.com";
export const SITE_TITLE = "Donnie Flood";
export const SITE_TAGLINE = "Passionate Learner & software tinkerer";
export const SITE_DESCRIPTION =
  "Donnie Flood — entrepreneur, software engineer, and curious tinkerer in Denver, CO. Notes on software, systems, and the small projects in between.";

export const SITE_LOCALE = "en_US";
export const SITE_LOCATION = "Denver, CO";

export const AUTHOR_NAME = "Donnie Flood";
export const AUTHOR_HEADLINE = "Entrepreneur & software engineer";

export const EMAIL = "donnie@floodfx.com";
export const GITHUB_URL = "https://github.com/floodfx";
export const LINKEDIN_URL = "https://linkedin.com/in/donnieflood";

// Default Open Graph / Twitter card image. Pages may override.
export const OG_IMAGE = "/og.png";
export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;

// Brand color — used in <meta name="theme-color">.
export const THEME_COLOR = "#1f4ea8"; // cobalt

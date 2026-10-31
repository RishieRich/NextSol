/**
 * Configuration is read here and nowhere else.
 * NEXT_PUBLIC_SITE_URL is baked in at build time (static export), so set it before `npm run build`.
 */

const DEFAULT_SITE_URL = "https://nxtsolutions.in";

function readSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const value = raw && raw.length > 0 ? raw : DEFAULT_SITE_URL;
  try {
    return new URL(value).origin;
  } catch {
    throw new Error(`NEXT_PUBLIC_SITE_URL is not a valid URL: "${value}"`);
  }
}

export const config = {
  siteUrl: readSiteUrl(),
} as const;

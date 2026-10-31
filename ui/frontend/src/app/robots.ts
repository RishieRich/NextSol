import type { MetadataRoute } from "next";

import { config } from "@/lib/config";

export const dynamic = "force-static";

/** Search engines are welcome everywhere. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: new URL("/sitemap.xml", config.siteUrl).toString(),
  };
}

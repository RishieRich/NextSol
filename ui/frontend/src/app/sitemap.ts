import type { MetadataRoute } from "next";

import { primaryNav } from "@/content/navigation";
import { productPages } from "@/content/products";
import { toolHref, tools } from "@/content/tools";
import { config } from "@/lib/config";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "/",
    ...primaryNav.map((item) => item.href),
    ...productPages.map((product) => product.page ?? "/"),
    ...tools.map(toolHref),
  ];
  return [...new Set(paths)].map((path) => ({
    url: new URL(path, config.siteUrl).toString(),
    changeFrequency: "monthly",
    priority: path === "/" ? 1 : 0.8,
  }));
}

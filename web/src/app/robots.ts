import type { MetadataRoute } from "next";
import { absolute } from "@/lib/seo";

// /robots.txt used to 404, so crawlers had no sitemap pointer at all.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Personal, per-account screens — nothing for a crawler to index.
        disallow: ["/api/", "/results", "/journey", "/login"],
      },
    ],
    sitemap: absolute("/sitemap.xml"),
  };
}

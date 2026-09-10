import type { MetadataRoute } from "next";
import { ROUTES, absolute } from "@/lib/seo";

// Both languages live on the same URL (the choice is a cookie), so each route
// appears once with the two languages declared as alternates of each other.
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const priority: Record<string, number> = {
    "/": 1,
    "/diagnostic": 0.9,
    "/daily": 0.9,
    "/science": 0.8,
    "/abstract": 0.7,
    "/practice": 0.7,
    "/nback": 0.7,
    "/about": 0.6,
  };
  return ROUTES.filter((r) => !["/results", "/journey", "/login"].includes(r)).map(
    (route) => ({
      url: absolute(route),
      lastModified: now,
      changeFrequency: route === "/daily" ? "daily" : "monthly",
      priority: priority[route] ?? 0.5,
      alternates: {
        languages: { ar: absolute(route), en: absolute(route) },
      },
    }),
  );
}

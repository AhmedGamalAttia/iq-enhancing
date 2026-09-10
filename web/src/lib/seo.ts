import type { Metadata } from "next";
import type { Locale } from "@/i18n/config";

/**
 * The canonical origin. Vercel sets VERCEL_PROJECT_PRODUCTION_URL on every
 * deployment, so previews and production both resolve correctly without a
 * hard-coded domain; NEXT_PUBLIC_SITE_URL overrides it for a custom domain.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "https://iq-enhancing.vercel.app")
).replace(/\/$/, "");

export function absolute(path: string): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Every route the sitemap and the language alternates cover. */
export const ROUTES = [
  "/",
  "/journey",
  "/diagnostic",
  "/practice",
  "/daily",
  "/abstract",
  "/nback",
  "/results",
  "/science",
  "/about",
  "/privacy",
  "/terms",
  "/login",
] as const;

/**
 * Page metadata for a client-rendered route.
 *
 * Every page used to inherit one title and had no Open Graph tags at all, so a
 * shared link showed the site's generic name with no preview. The language is
 * chosen by a cookie rather than the URL, so both languages share one canonical
 * URL and are declared as alternates of each other.
 */
export function pageMetadata({
  locale,
  path,
  title,
  description,
}: {
  locale: Locale;
  path: string;
  title: string;
  description: string;
}): Metadata {
  const url = absolute(path);
  const appName =
    locale === "ar" ? "منصّة تنمية القدرات المعرفية" : "Cognitive Skills Platform";
  // A segment that declares `openGraph` without `images` does NOT inherit the
  // root opengraph-image, so every sub-page shared with no preview at all.
  const images = [
    { url: absolute("/opengraph-image"), width: 1200, height: 630, alt: appName },
  ];
  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: { ar: url, en: url, "x-default": url },
    },
    openGraph: {
      type: "website",
      url,
      siteName: appName,
      title: `${title} · ${appName}`,
      description,
      locale: locale === "ar" ? "ar_EG" : "en_US",
      alternateLocale: locale === "ar" ? "en_US" : "ar_EG",
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} · ${appName}`,
      description,
      images,
    },
  };
}

import type { MetadataRoute } from "next";

// Generated rather than a static file, so it always points at the PNG icons the
// install prompt actually requires.
export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "منصّة تنمية القدرات المعرفية · Cognitive Skills Platform",
    short_name: "القدرات المعرفية",
    description:
      "تقييم وتدريب القدرات المعرفية بطرق مدروسة — تقييم تكيّفي، تكرار متباعد، وتحدٍّ يومي بلا لغة.",
    start_url: "/journey",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#0b0c14",
    theme_color: "#0b0c14",
    lang: "ar",
    dir: "rtl",
    categories: ["education", "productivity"],
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
    ],
    shortcuts: [
      { name: "التحدّي اليومي", short_name: "التحدّي", url: "/daily" },
      { name: "التدريب", short_name: "التدريب", url: "/practice" },
    ],
  };
}

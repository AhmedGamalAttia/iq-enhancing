import type { Metadata } from "next";
import { getLocale } from "@/i18n/server";
import { pageMetadata } from "@/lib/seo";

// The page itself is a client component, so its metadata lives here.
export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return pageMetadata({
    locale,
    path: "/science",
    title: locale === "ar" ? "العلم وراء المنصّة" : "The Science Behind This",
    description:
      locale === "ar"
        ? "كيف نقيس، وعلى أي مبادئ نبني، وأين تقف حدود ما نستطيع ادّعاءه."
        : "How we measure, the principles we build on, and where the limits of our claims are.",
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

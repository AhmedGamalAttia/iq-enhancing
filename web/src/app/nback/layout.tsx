import type { Metadata } from "next";
import { getLocale } from "@/i18n/server";
import { pageMetadata } from "@/lib/seo";

// The page itself is a client component, so its metadata lives here.
export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return pageMetadata({
    locale,
    path: "/nback",
    title: locale === "ar" ? "تمرين الذاكرة العاملة" : "Working-Memory Task",
    description:
      locale === "ar"
        ? "تمرين n-back المؤقّت — الطريقة الوحيدة التي نقيس بها الذاكرة العاملة."
        : "The timed n-back task — the only way we measure working memory.",
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

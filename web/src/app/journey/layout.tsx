import type { Metadata } from "next";
import { getLocale } from "@/i18n/server";
import { pageMetadata } from "@/lib/seo";

// The page itself is a client component, so its metadata lives here.
export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return pageMetadata({
    locale,
    path: "/journey",
    title: locale === "ar" ? "رحلتي" : "My Journey",
    description:
      locale === "ar"
        ? "خريطة تقدّمك: التقييم، التدريب اليومي، وإعادة القياس بعد أسبوعين."
        : "Your map: assess, train daily, and re-measure after two weeks.",
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

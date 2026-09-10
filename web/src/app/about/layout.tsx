import type { Metadata } from "next";
import { getLocale } from "@/i18n/server";
import { pageMetadata } from "@/lib/seo";

// The page itself is a client component, so its metadata lives here.
export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return pageMetadata({
    locale,
    path: "/about",
    title: locale === "ar" ? "عن المنصّة" : "About",
    description:
      locale === "ar"
        ? "منصّة مجانية لتنمية القدرات المعرفية، مبنية لتكون عادلة مع أي عمر أو تعليم أو مهنة."
        : "A free cognitive-training platform, built to be fair across age, schooling and profession.",
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

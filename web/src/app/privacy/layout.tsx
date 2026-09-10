import type { Metadata } from "next";
import { getLocale } from "@/i18n/server";
import { pageMetadata } from "@/lib/seo";

// The page itself is a client component, so its metadata lives here.
export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return pageMetadata({
    locale,
    path: "/privacy",
    title: locale === "ar" ? "سياسة الخصوصية" : "Privacy Policy",
    description:
      locale === "ar"
        ? "ما نجمعه، وأين يُخزّن، وما لا نجمعه إطلاقاً."
        : "What we collect, where it is stored, and what we never collect.",
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

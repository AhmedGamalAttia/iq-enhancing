import type { Metadata } from "next";
import { getLocale } from "@/i18n/server";
import { pageMetadata } from "@/lib/seo";

// The page itself is a client component, so its metadata lives here.
export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return pageMetadata({
    locale,
    path: "/abstract",
    title: locale === "ar" ? "الاستدلال المجرّد" : "Abstract Reasoning",
    description:
      locale === "ar"
        ? "أنماط بصرية مولّدة تلقائياً تتكيّف مع مستواك، وتشرح لك قاعدة كل بند بعد الإجابة."
        : "Procedurally generated visual patterns that adapt to your level and explain each rule after you answer.",
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

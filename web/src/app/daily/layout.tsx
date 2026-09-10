import type { Metadata } from "next";
import { getLocale } from "@/i18n/server";
import { pageMetadata } from "@/lib/seo";

// The page itself is a client component, so its metadata lives here.
export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return pageMetadata({
    locale,
    path: "/daily",
    title: locale === "ar" ? "التحدّي اليومي" : "Daily Challenge",
    description:
      locale === "ar"
        ? "عشر أحاجي بصرية، نفس المجموعة لكل اللاعبين اليوم. بلا لغة ولا معلومات مسبقة."
        : "Ten visual puzzles — the same set for every player today. No language, no prior knowledge.",
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

import type { Metadata } from "next";
import { getLocale } from "@/i18n/server";
import { pageMetadata } from "@/lib/seo";

// The page itself is a client component, so its metadata lives here.
export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return pageMetadata({
    locale,
    path: "/practice",
    title: locale === "ar" ? "التدريب" : "Practice",
    description:
      locale === "ar"
        ? "تدريب بالتكرار المتباعد على نقاط ضعفك، مع خلط بين المحاور لأن التعلّم المتشابك أثبت أكثر."
        : "Spaced-repetition practice on your weak spots, interleaved across dimensions.",
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

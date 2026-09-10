import type { Metadata } from "next";
import { getLocale } from "@/i18n/server";
import { pageMetadata } from "@/lib/seo";

// The page itself is a client component, so its metadata lives here.
export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return pageMetadata({
    locale,
    path: "/login",
    title: locale === "ar" ? "تسجيل الدخول" : "Sign in",
    description:
      locale === "ar"
        ? "سجّل دخولك لمزامنة تقدّمك بين أجهزتك."
        : "Sign in to sync your progress across devices.",
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

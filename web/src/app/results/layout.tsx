import type { Metadata } from "next";
import { getLocale } from "@/i18n/server";
import { pageMetadata } from "@/lib/seo";

// The page itself is a client component, so its metadata lives here.
export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return pageMetadata({
    locale,
    path: "/results",
    title: locale === "ar" ? "نتائجك" : "Your Results",
    description:
      locale === "ar"
        ? "نتائجك في كل محور معرفي، معروضة كنطاق مرجّح مع حدود القياس."
        : "Your per-dimension results, shown as a likely range with the limits stated.",
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

import type { Metadata } from "next";
import { getLocale } from "@/i18n/server";
import { pageMetadata } from "@/lib/seo";

// The page itself is a client component, so its metadata lives here.
export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return pageMetadata({
    locale,
    path: "/diagnostic",
    title: locale === "ar" ? "التقييم التشخيصي" : "Diagnostic Assessment",
    description:
      locale === "ar"
        ? "٢٠ سؤالاً تكيّفياً في خمسة محاور معرفية، والنتيجة تقدير مبدئي يُعرض كنطاق لا كرقم قاطع."
        : "20 adaptive questions across five cognitive dimensions, reported as a range rather than a verdict.",
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

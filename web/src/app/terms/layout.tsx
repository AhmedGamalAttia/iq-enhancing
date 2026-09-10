import type { Metadata } from "next";
import { getLocale } from "@/i18n/server";
import { pageMetadata } from "@/lib/seo";

// The page itself is a client component, so its metadata lives here.
export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return pageMetadata({
    locale,
    path: "/terms",
    title: locale === "ar" ? "شروط الاستخدام" : "Terms of Use",
    description:
      locale === "ar"
        ? "المنصّة مجانية وتجريبية، وليست أداة تشخيص ولا اختبار ذكاء."
        : "The platform is free and experimental — not a diagnostic tool and not an IQ test.",
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

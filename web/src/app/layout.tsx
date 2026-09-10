import type { Metadata, Viewport } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { I18nProvider } from "@/i18n/context";
import { getLocale } from "@/i18n/server";
import { dirFor } from "@/i18n/config";
import { SITE_URL } from "@/lib/seo";
import { SiteFooter } from "@/components/site-footer";
import { ServiceWorkerRegistrar } from "@/components/service-worker";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const isAr = locale === "ar";
  const appName = isAr
    ? "منصّة تنمية القدرات المعرفية"
    : "Cognitive Skills Platform";
  const description = isAr
    ? "منصّة قائمة على الأدلّة العلمية لتنمية القدرات المعرفية: تقييم تشخيصي يعطيك تقديراً مبدئياً، مسار تدريب مخصّص، وتحدٍّ يومي عادل بلا لغة."
    : "An evidence-based platform for cognitive training: a diagnostic that gives you a first estimate, a personalized path, and a language-free daily challenge.";
  const title = isAr
    ? `${appName} — تعلّم أسرع، فكّر أوضح`
    : `${appName} — learn faster, think clearer`;

  return {
    metadataBase: new URL(SITE_URL),
    title: { default: title, template: `%s · ${appName}` },
    description,
    applicationName: appName,
    manifest: "/manifest.webmanifest",
    appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: appName },
    icons: {
      icon: [
        { url: "/icon.svg", type: "image/svg+xml" },
        { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      ],
      apple: "/icon-192.png",
    },
    // Both languages share one URL (the choice is a cookie), so they are
    // declared as alternates of each other rather than separate pages.
    alternates: {
      canonical: SITE_URL,
      languages: { ar: SITE_URL, en: SITE_URL, "x-default": SITE_URL },
    },
    openGraph: {
      type: "website",
      url: SITE_URL,
      siteName: appName,
      title,
      description,
      locale: isAr ? "ar_EG" : "en_US",
      alternateLocale: isAr ? "en_US" : "ar_EG",
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f7fb" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0c14" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();

  return (
    <html
      lang={locale}
      dir={dirFor(locale)}
      className={`${cairo.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <I18nProvider initialLocale={locale}>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
          <ServiceWorkerRegistrar />
        </I18nProvider>
      </body>
    </html>
  );
}

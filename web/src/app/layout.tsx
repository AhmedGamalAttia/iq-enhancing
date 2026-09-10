import type { Metadata, Viewport } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { I18nProvider } from "@/i18n/context";
import { getLocale } from "@/i18n/server";
import { dirFor } from "@/i18n/config";

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
  return {
    title: {
      default: isAr
        ? `${appName} — تعلّم أسرع، فكّر أوضح`
        : `${appName} — learn faster, think clearer`,
      template: `%s · ${appName}`,
    },
    description: isAr
      ? "منصّة قائمة على الأدلّة العلمية لتنمية القدرات المعرفية: تقييم تشخيصي دقيق، مسار تطوير مخصّص، وتدريب بالتكرار المتباعد."
      : "An evidence-based platform to develop cognitive abilities: a precise diagnostic, a personalized path, and spaced-repetition training.",
    applicationName: appName,
    manifest: "/manifest.webmanifest",
    appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: appName },
    icons: { icon: "/icon.svg", apple: "/icon.svg" },
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
        </I18nProvider>
      </body>
    </html>
  );
}

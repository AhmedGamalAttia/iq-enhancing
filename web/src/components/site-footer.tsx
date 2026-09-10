"use client";

import Link from "next/link";
import { useI18n } from "@/i18n/context";

// A site with accounts, stored results and public leaderboard entries needs its
// legal pages reachable from every screen, not just from one card.
const LINKS = [
  { href: "/science", ar: "العلم وراءنا", en: "The science" },
  { href: "/about", ar: "عن المنصّة", en: "About" },
  { href: "/privacy", ar: "الخصوصية", en: "Privacy" },
  { href: "/terms", ar: "الشروط", en: "Terms" },
];

export function SiteFooter() {
  const { t, locale } = useI18n();
  return (
    <footer className="mt-10 border-t border-border-soft px-4 py-8 md:px-6">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 text-center">
        <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm text-fg-muted hover:text-fg hover:underline"
            >
              {locale === "ar" ? l.ar : l.en}
            </Link>
          ))}
        </nav>
        <p className="text-xs leading-relaxed text-fg-faint">{t.home.footer}</p>
        <p className="max-w-xl text-xs leading-relaxed text-fg-faint">
          {t.honesty.notIQ}
        </p>
      </div>
    </footer>
  );
}

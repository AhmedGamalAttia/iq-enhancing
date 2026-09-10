"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/env";
import { useI18n } from "@/i18n/context";
import { Button, cn } from "@/components/ui";

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { t, locale, setLocale } = useI18n();
  const [email, setEmail] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) {
      setReady(true);
      return;
    }
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? null);
      setReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setEmail(session?.user?.email ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  // Navigating away closes the drawer; Escape does too.
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  async function signOut() {
    const supabase = createClient();
    if (supabase) {
      await supabase.auth.signOut();
      setEmail(null);
      setOpen(false);
      router.refresh();
    }
  }

  // Every trainable route lives here. /daily, /abstract and /nback used to be
  // reachable only from cards buried inside other pages.
  const nav = [
    { href: "/journey", label: t.nav.journey, icon: "🧭" },
    { href: "/diagnostic", label: t.nav.diagnostic, icon: "📋" },
    { href: "/practice", label: t.nav.practice, icon: "🔁" },
    { href: "/daily", label: t.nav.daily, icon: "🏆" },
    { href: "/abstract", label: t.nav.abstract, icon: "◈" },
    { href: "/nback", label: t.nav.nback, icon: "🧠" },
    { href: "/results", label: t.nav.results, icon: "📈" },
  ];

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const langButton = (
    <button
      onClick={() => setLocale(locale === "ar" ? "en" : "ar")}
      className="rounded-lg border border-border px-2.5 py-1.5 text-xs font-semibold text-fg-muted hover:border-brand/50 hover:text-fg"
      aria-label={t.lang.label}
    >
      {t.lang.switchTo}
    </button>
  );

  const authControl = !ready ? null : email ? (
    <>
      <span className="hidden max-w-[14ch] truncate text-xs text-fg-faint xl:inline">
        {email}
      </span>
      <Button variant="ghost" size="sm" onClick={signOut}>
        {t.nav.logout}
      </Button>
    </>
  ) : isSupabaseConfigured ? (
    <Link
      href="/login"
      className="rounded-lg bg-surface-2 px-3 py-2 text-sm font-semibold hover:bg-surface"
    >
      {t.nav.login}
    </Link>
  ) : (
    <span className="rounded-full border border-border bg-surface-2 px-3 py-1 text-xs text-fg-faint">
      {t.nav.guest}
    </span>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-border-soft bg-bg/70 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 md:px-6">
        <Link href="/" className="flex min-w-0 items-center gap-2 font-bold">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand-strong text-white shadow-[0_8px_24px_-12px_var(--brand)]">
            ⌘
          </span>
          <span className="hidden truncate lg:inline">{t.nav.brand}</span>
        </Link>

        {/* Seven links only fit from lg up; below that they live in the drawer. */}
        <nav className="hidden items-center gap-1 lg:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={cn(
                "rounded-lg px-2.5 py-2 text-sm font-medium transition-colors",
                isActive(item.href)
                  ? "bg-surface-2 text-fg"
                  : "text-fg-muted hover:bg-surface-2/60 hover:text-fg",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          {langButton}
          {authControl}
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="site-menu"
          aria-label={open ? t.nav.closeMenu : t.nav.openMenu}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-border text-fg-muted hover:text-fg lg:hidden"
        >
          <span aria-hidden="true" className="text-lg leading-none">
            {open ? "✕" : "☰"}
          </span>
        </button>
      </div>

      {open && (
        <div
          id="site-menu"
          className="animate-rise border-t border-border-soft bg-bg/95 backdrop-blur-lg lg:hidden"
        >
          <nav className="mx-auto grid max-w-6xl gap-1 px-4 py-3">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium",
                  isActive(item.href)
                    ? "bg-surface-2 text-fg"
                    : "text-fg-muted hover:bg-surface-2/60 hover:text-fg",
                )}
              >
                <span aria-hidden="true" className="w-5 text-center">
                  {item.icon}
                </span>
                {item.label}
              </Link>
            ))}
            <div className="mt-2 flex flex-wrap items-center gap-2 border-t border-border-soft pt-3">
              {langButton}
              {authControl}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

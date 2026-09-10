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

  async function signOut() {
    const supabase = createClient();
    if (supabase) {
      await supabase.auth.signOut();
      setEmail(null);
      router.refresh();
    }
  }

  const nav = [
    { href: "/", label: t.nav.home },
    { href: "/diagnostic", label: t.nav.diagnostic },
    { href: "/results", label: t.nav.results },
    { href: "/practice", label: t.nav.practice },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-border-soft bg-bg/70 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 font-bold">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand text-white shadow-[0_8px_24px_-12px_var(--brand)]">
            ⌘
          </span>
          <span className="hidden sm:inline">{t.nav.brand}</span>
        </Link>

        <nav className="flex items-center gap-1">
          {nav.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-lg px-2.5 py-2 text-sm font-medium transition-colors md:px-3",
                  active
                    ? "bg-surface-2 text-fg"
                    : "text-fg-muted hover:text-fg hover:bg-surface-2/60",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setLocale(locale === "ar" ? "en" : "ar")}
            className="rounded-lg border border-border px-2.5 py-1.5 text-xs font-semibold text-fg-muted hover:text-fg hover:border-brand/50"
            aria-label={t.lang.label}
          >
            {t.lang.switchTo}
          </button>
          {!ready ? null : email ? (
            <>
              <span className="hidden text-xs text-fg-faint md:inline">
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
          )}
        </div>
      </div>
    </header>
  );
}

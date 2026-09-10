"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/env";
import { useI18n } from "@/i18n/context";
import { Button, Card } from "@/components/ui";

export default function LoginPage() {
  const router = useRouter();
  const { t } = useI18n();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    const supabase = createClient();
    if (!supabase) return;

    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMessage(t.login.signupSuccess);
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.push("/");
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t.login.genericError);
    } finally {
      setBusy(false);
    }
  }

  if (!isSupabaseConfigured) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 md:px-6">
        <Card className="p-8 text-center">
          <div className="mb-3 text-4xl">🔑</div>
          <h1 className="mb-2 text-xl font-bold">
            {t.login.notConfiguredTitle}
          </h1>
          <p className="mb-6 text-fg-muted">{t.login.notConfiguredBody}</p>
          <Link href="/" className="text-brand hover:underline">
            {t.login.backHome}
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16 md:px-6">
      <Card className="p-8">
        <h1 className="mb-1 text-2xl font-bold">
          {mode === "signin" ? t.login.signinTitle : t.login.signupTitle}
        </h1>
        <p className="mb-6 text-sm text-fg-faint">{t.login.subtitle}</p>

        <form onSubmit={submit} className="grid gap-4">
          <div>
            <label className="mb-1 block text-sm font-semibold">
              {t.login.email}
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11 w-full rounded-xl border border-border bg-surface px-4 text-sm outline-none focus:border-brand"
              placeholder="you@example.com"
              dir="ltr"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold">
              {t.login.password}
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11 w-full rounded-xl border border-border bg-surface px-4 text-sm outline-none focus:border-brand"
              placeholder="••••••••"
              dir="ltr"
            />
          </div>

          {error && <p className="text-sm text-danger">{error}</p>}
          {message && <p className="text-sm text-success">{message}</p>}

          <Button type="submit" size="lg" disabled={busy}>
            {busy ? t.login.busy : mode === "signin" ? t.login.signin : t.login.signup}
          </Button>
        </form>

        <button
          onClick={() => {
            setMode(mode === "signin" ? "signup" : "signin");
            setError(null);
            setMessage(null);
          }}
          className="mt-4 w-full text-center text-sm text-fg-muted hover:text-fg"
        >
          {mode === "signin" ? t.login.toSignup : t.login.toSignin}
        </button>
      </Card>
    </div>
  );
}

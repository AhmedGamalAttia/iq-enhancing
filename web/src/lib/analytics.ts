"use client";

import { createClient } from "@/lib/supabase/client";

// Privacy-respecting product analytics.
//
// The platform had none, so nobody knew how many people start an assessment and
// never finish it. What is recorded is a COUNTER per (day, event, language) —
// no user id, no session id, no timestamp finer than the day, no page URL, no
// free-form properties. It cannot be joined back to a person, which is why it
// can be described plainly in the privacy policy.

export type AnalyticsEvent =
  | "home_view"
  | "diagnostic_start"
  | "diagnostic_resume"
  | "diagnostic_finish"
  | "practice_start"
  | "practice_finish"
  | "daily_start"
  | "daily_finish"
  | "daily_share"
  | "abstract_start"
  | "nback_finish"
  | "signup"
  | "signin";

// One counter per event per day per device, so a single enthusiastic user can't
// dominate a funnel and we don't send a request on every render.
const sentThisSession = new Set<string>();

// Before the SQL migration is applied the function doesn't exist, and every
// event would fire a request that 404s and litters the console. One failure is
// enough to conclude analytics aren't available in this deployment.
let disabled = false;

export function track(event: AnalyticsEvent, locale: "ar" | "en" = "ar"): void {
  if (typeof window === "undefined" || disabled) return;
  const key = `${event}:${locale}`;
  if (sentThisSession.has(key)) return;
  sentThisSession.add(key);

  const supabase = createClient();
  if (!supabase) return;
  // Fire and forget: analytics must never delay or break a session.
  void supabase
    .rpc("bump_usage_event", { p_event: event, p_locale: locale })
    .then(
      ({ error }) => {
        if (error) disabled = true;
      },
      () => {
        disabled = true;
      },
    );
}

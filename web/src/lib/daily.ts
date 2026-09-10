"use client";

import { createClient } from "@/lib/supabase/client";

// Daily-challenge leaderboard. Signed-in players post their best score for the
// day (public read for the board). Guests can play and view the board.

const LS_NAME = "cog:displayname";

export function getDisplayName(): string {
  if (typeof window === "undefined") return "";
  try {
    return localStorage.getItem(LS_NAME) ?? "";
  } catch {
    return "";
  }
}

export function setDisplayName(name: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LS_NAME, name.slice(0, 24));
  } catch {
    /* ignore */
  }
}

export function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

const LS_DAYS = "cog:daily:days";

function getLocalDays(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(LS_DAYS) ?? "[]") as string[];
  } catch {
    return [];
  }
}

export function logDailyToday(): void {
  if (typeof window === "undefined") return;
  const days = getLocalDays();
  const today = todayKey();
  if (!days.includes(today)) {
    days.push(today);
    try {
      localStorage.setItem(LS_DAYS, JSON.stringify(days));
    } catch {
      /* ignore */
    }
  }
}

/** Days the player completed the daily challenge (Supabase for signed-in). */
export async function getCompletedDays(): Promise<string[]> {
  const supabase = createClient();
  const local = getLocalDays();
  if (supabase) {
    const { data: u } = await supabase.auth.getUser();
    const uid = u.user?.id;
    if (uid) {
      const { data } = await supabase
        .from("daily_scores")
        .select("date")
        .eq("user_id", uid);
      const remote = (data ?? []).map((r) => String(r.date).slice(0, 10));
      return Array.from(new Set([...remote, ...local]));
    }
  }
  return local;
}

/** Accuracy-primary, time as tiebreak, in a single sortable number. */
export function dailyScore(correct: number, timeMs: number): number {
  return correct * 10000 - Math.round(timeMs / 100);
}

export interface DailyEntry {
  display_name: string;
  correct: number;
  time_ms: number;
  score: number;
  user_id?: string;
}

export async function submitDailyScore(entry: {
  correct: number;
  timeMs: number;
  score: number;
}): Promise<{ posted: boolean }> {
  const supabase = createClient();
  if (!supabase) return { posted: false };
  const { data: u } = await supabase.auth.getUser();
  let user = u.user;
  if (!user) {
    // Give guests a stable, real id (no email needed) so they can appear on the
    // board — far more robust than an IP. Requires "Anonymous sign-ins" enabled
    // in the Supabase dashboard; if it's off, we simply don't post.
    const { data, error } = await supabase.auth.signInAnonymously();
    if (error || !data.user) return { posted: false };
    user = data.user;
  }

  const date = todayKey();
  const name = (
    getDisplayName() ||
    user.email?.split("@")[0] ||
    "Player"
  ).slice(0, 24);

  // Keep the best score for the day.
  const { data: existing } = await supabase
    .from("daily_scores")
    .select("score")
    .eq("date", date)
    .eq("user_id", user.id)
    .maybeSingle();
  if (existing && (existing.score as number) >= entry.score) {
    return { posted: true };
  }

  await supabase.from("daily_scores").upsert(
    {
      date,
      user_id: user.id,
      display_name: name,
      correct: entry.correct,
      time_ms: entry.timeMs,
      score: entry.score,
    },
    { onConflict: "date,user_id" },
  );
  return { posted: true };
}

export interface DailyResult {
  correct: number;
  total: number;
  timeMs: number;
  score: number;
}

const LS_RESULT = "cog:daily:result";

export function saveLocalResult(r: DailyResult): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(`${LS_RESULT}:${todayKey()}`, JSON.stringify(r));
  } catch {
    /* ignore */
  }
}

export function getLocalResult(): DailyResult | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(`${LS_RESULT}:${todayKey()}`);
    return raw ? (JSON.parse(raw) as DailyResult) : null;
  } catch {
    return null;
  }
}

/** The signed-in user's already-submitted score for today (for the one-a-day gate). */
export async function getMyTodayScore(): Promise<DailyResult | null> {
  const supabase = createClient();
  if (!supabase) return null;
  const { data: u } = await supabase.auth.getUser();
  const uid = u.user?.id;
  if (!uid) return null;
  const { data } = await supabase
    .from("daily_scores")
    .select("correct, time_ms, score")
    .eq("date", todayKey())
    .eq("user_id", uid)
    .maybeSingle();
  if (!data) return null;
  return {
    correct: data.correct as number,
    total: 10,
    timeMs: data.time_ms as number,
    score: data.score as number,
  };
}

export async function getLeaderboard(limit = 20): Promise<DailyEntry[]> {
  const supabase = createClient();
  if (!supabase) return [];
  const { data } = await supabase
    .from("daily_scores")
    .select("display_name, correct, time_ms, score, user_id")
    .eq("date", todayKey())
    .order("score", { ascending: false })
    .limit(limit);
  return (data ?? []) as DailyEntry[];
}

export async function getRank(
  score: number,
): Promise<{ rank: number; total: number; percentile: number } | null> {
  const supabase = createClient();
  if (!supabase) return null;
  const date = todayKey();

  const totalRes = await supabase
    .from("daily_scores")
    .select("*", { count: "exact", head: true })
    .eq("date", date);
  const betterRes = await supabase
    .from("daily_scores")
    .select("*", { count: "exact", head: true })
    .eq("date", date)
    .gt("score", score);

  const total = totalRes.count ?? 0;
  const better = betterRes.count ?? 0;
  const rank = better + 1;
  const percentile = total > 0 ? Math.round(((total - rank) / total) * 100) : 0;
  return { rank, total, percentile };
}

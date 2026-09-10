"use client";

import { createClient } from "@/lib/supabase/client";
import { challengeDayKey } from "@/lib/day";

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
  return challengeDayKey();
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
    const { data: s } = await supabase.auth.getSession();
    const uid = s.session?.user?.id;
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

/**
 * Accuracy-primary, time as tiebreak, in a single sortable number.
 * The time term MUST be capped below one accuracy step (10000), otherwise a
 * slow perfect run loses to a fast wrong one (10/10 in 20 min used to rank
 * below 9/10 in 30 s). Mirrors the server-side formula.
 */
export function dailyScore(correct: number, timeMs: number): number {
  return correct * 10000 - Math.min(9999, Math.round(timeMs / 100));
}

export interface DailyEntry {
  display_name: string;
  correct: number;
  time_ms: number;
  score: number;
  user_id?: string;
}

export interface SubmitResult {
  posted: boolean;
  /** The score actually stored server-side (differs if today was already played). */
  storedScore?: number;
  /** False when a row for today already existed — one attempt per day. */
  accepted?: boolean;
}

export async function submitDailyScore(entry: {
  correct: number;
  timeMs: number;
}): Promise<SubmitResult> {
  const supabase = createClient();
  if (!supabase) return { posted: false };
  // getSession() reads the local session; getUser() does a network round trip
  // and returns null on a hiccup, which used to mis-detect signed-in users.
  const { data: s } = await supabase.auth.getSession();
  let user = s.session?.user ?? null;
  if (!user) {
    // Give guests a stable, real id (no email needed) so they can appear on the
    // board — far more robust than an IP. Requires "Anonymous sign-ins" enabled
    // in the Supabase dashboard; if it's off, we simply don't post.
    const { data, error } = await supabase.auth.signInAnonymously();
    if (error || !data.user) return { posted: false };
    user = data.user;
  }

  const name = (
    getDisplayName() ||
    user.email?.split("@")[0] ||
    "Player"
  ).slice(0, 24);

  // The server derives the date, recomputes the score and enforces the limits,
  // so the client can no longer assert any of them (direct writes are revoked).
  const { data, error } = await supabase.rpc("submit_daily_score", {
    p_correct: entry.correct,
    p_time_ms: entry.timeMs,
    p_display_name: name,
  });
  if (error) return { posted: false };

  const row = (Array.isArray(data) ? data[0] : data) as
    | { accepted: boolean; stored_score: number }
    | undefined;
  if (!row) return { posted: false };
  return {
    posted: true,
    storedScore: row.stored_score,
    accepted: row.accepted,
  };
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

/** Whether today's daily challenge is already completed (guest or signed-in). */
export async function hasDoneTodayDaily(): Promise<boolean> {
  if (getLocalResult()) return true;
  return (await getMyTodayScore()) !== null;
}

/** The signed-in user's already-submitted score for today (for the one-a-day gate). */
export async function getMyTodayScore(): Promise<DailyResult | null> {
  const supabase = createClient();
  if (!supabase) return null;
  const { data: s } = await supabase.auth.getSession();
  const uid = s.session?.user?.id;
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
  // Share of *other* players beaten: the only player of the day is 100%, and
  // the value can never go negative (it used to read "better than -25%").
  const percentile =
    total > 1 ? Math.round(((total - rank) / (total - 1)) * 100) : 100;
  return { rank, total, percentile: Math.max(0, Math.min(100, percentile)) };
}

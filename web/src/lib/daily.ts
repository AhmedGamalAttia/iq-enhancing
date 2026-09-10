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
  const user = u.user;
  if (!user) return { posted: false };

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

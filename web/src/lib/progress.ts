// Progress helpers for the journey hub.

import { MIN_RELIABLE_ITEMS } from "@/lib/diagnostic";
import { challengeDayKey, previousDayKey } from "@/lib/day";

/**
 * Current consecutive-day streak. Counts back from today (or from yesterday if
 * today hasn't been practiced yet, so the streak survives until end of day).
 * Days are calendar keys in the challenge timezone, and stepping back is exact
 * calendar arithmetic — mixing UTC formatting with local date maths used to
 * miscount around midnight and DST.
 */
export function computeStreak(days: string[]): number {
  if (days.length === 0) return 0;
  const set = new Set(days);

  let cursor = challengeDayKey();
  if (!set.has(cursor)) {
    cursor = previousDayKey(cursor);
    if (!set.has(cursor)) return 0;
  }

  let streak = 0;
  while (set.has(cursor)) {
    streak += 1;
    cursor = previousDayKey(cursor);
  }
  return streak;
}

/** Whole days elapsed since an ISO timestamp. */
export function daysSince(iso: string, now: Date = new Date()): number {
  const then = new Date(iso);
  return Math.floor((now.getTime() - then.getTime()) / 86_400_000);
}

export const REASSESS_INTERVAL_DAYS = 14;

/**
 * Mean of the per-skill scores in a diagnostic's estimates (0..100).
 * Skills with too few items are excluded — their scores are trapped near the
 * middle and would flatten the trend line.
 */
export function avgScore(
  estimates: Record<string, { score: number; total?: number } | undefined>,
): number {
  const all = Object.values(estimates).filter(
    (e): e is { score: number; total?: number } => !!e,
  );
  const reliable = all.filter((e) => (e.total ?? Infinity) >= MIN_RELIABLE_ITEMS);
  const scores = (reliable.length > 0 ? reliable : all).map((e) => e.score);
  if (scores.length === 0) return 0;
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
}

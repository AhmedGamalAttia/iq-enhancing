// Progress helpers for the journey hub.

function dayKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/**
 * Current consecutive-day practice streak. Counts back from today (or from
 * yesterday if today hasn't been practiced yet, so the streak survives until
 * end of day).
 */
export function computeStreak(days: string[]): number {
  if (days.length === 0) return 0;
  const set = new Set(days);
  const cursor = new Date();

  if (!set.has(dayKey(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
    if (!set.has(dayKey(cursor))) return 0;
  }

  let streak = 0;
  while (set.has(dayKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

/** Whole days elapsed since an ISO timestamp. */
export function daysSince(iso: string, now: Date = new Date()): number {
  const then = new Date(iso);
  return Math.floor((now.getTime() - then.getTime()) / 86_400_000);
}

export const REASSESS_INTERVAL_DAYS = 14;

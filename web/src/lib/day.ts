// The single definition of "a day" for the whole app.
//
// Previously the daily puzzles were seeded from the LOCAL calendar date while
// the leaderboard row, the one-a-day gate and the streak used the UTC date.
// Those disagree for several hours every night in any non-UTC timezone, which
// let a player take the same challenge twice (the second time with the answers
// already known) and inflated streaks. Everything now derives from one key.

export const CHALLENGE_TZ = "Africa/Cairo";

/** "YYYY-MM-DD" in the challenge timezone. */
export function challengeDayKey(d: Date = new Date()): string {
  // en-CA formats as YYYY-MM-DD.
  return new Intl.DateTimeFormat("en-CA", { timeZone: CHALLENGE_TZ }).format(d);
}

/** The same day as a numeric seed (YYYYMMDD) for deterministic generation. */
export function challengeDaySeed(d: Date = new Date()): number {
  return Number(challengeDayKey(d).replaceAll("-", ""));
}

/** Calendar-exact previous day for a "YYYY-MM-DD" key (DST-safe). */
export function previousDayKey(key: string): string {
  const [y, m, d] = key.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() - 1);
  return dt.toISOString().slice(0, 10);
}

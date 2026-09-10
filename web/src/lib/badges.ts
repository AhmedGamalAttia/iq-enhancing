"use client";

// Daily-challenge badges. Definitions are language-neutral (emoji + id);
// names are resolved via i18n (messages.daily.badgeNames).

export interface BadgeDef {
  id: string;
  emoji: string;
}

export const BADGES: BadgeDef[] = [
  { id: "first", emoji: "🎯" },
  { id: "perfect", emoji: "💯" },
  { id: "speedy", emoji: "⚡" },
  { id: "streak3", emoji: "🔥" },
  { id: "streak7", emoji: "📅" },
  { id: "streak30", emoji: "🏅" },
  { id: "podium", emoji: "🥉" },
  { id: "champion", emoji: "👑" },
];

export interface BadgeContext {
  correct: number;
  total: number;
  timeMs: number;
  streak: number;
  rank: number | null;
}

/** Badge ids earned by a given completion. */
export function evaluateBadges(ctx: BadgeContext): string[] {
  const ids = ["first"];
  if (ctx.correct === ctx.total) ids.push("perfect");
  if (ctx.timeMs < 60_000 && ctx.correct >= 8) ids.push("speedy");
  if (ctx.streak >= 3) ids.push("streak3");
  if (ctx.streak >= 7) ids.push("streak7");
  if (ctx.streak >= 30) ids.push("streak30");
  if (ctx.rank !== null && ctx.rank <= 3) ids.push("podium");
  if (ctx.rank === 1) ids.push("champion");
  return ids;
}

const LS_BADGES = "cog:badges";

export function getEarnedBadges(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(LS_BADGES) ?? "[]") as string[];
  } catch {
    return [];
  }
}

/** Merge newly-earned badges into the stored collection; returns the new ones. */
export function addEarnedBadges(ids: string[]): string[] {
  if (typeof window === "undefined") return [];
  const have = new Set(getEarnedBadges());
  const fresh = ids.filter((id) => !have.has(id));
  if (fresh.length > 0) {
    fresh.forEach((id) => have.add(id));
    try {
      localStorage.setItem(LS_BADGES, JSON.stringify([...have]));
    } catch {
      /* ignore */
    }
  }
  return fresh;
}

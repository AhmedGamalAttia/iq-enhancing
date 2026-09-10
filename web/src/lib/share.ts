"use client";

import { challengeDayKey } from "@/lib/day";

// The daily challenge has the shape that makes a puzzle spread: one set for
// everyone, one attempt, a result you can show without spoiling the answers.
// Without a share card that loop simply doesn't exist.

export interface ShareInput {
  correct: number;
  total: number;
  timeMs: number;
  /** Per-item outcome, in order. Empty falls back to a plain summary line. */
  marks: boolean[];
  streak: number;
  rank?: { rank: number; total: number } | null;
  locale: "ar" | "en";
  url: string;
}

const AR_DIGITS = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
const digits = (n: number | string, locale: "ar" | "en") =>
  locale === "ar"
    ? String(n).replace(/[0-9]/g, (d) => AR_DIGITS[Number(d)])
    : String(n);

function clock(ms: number, locale: "ar" | "en"): string {
  const s = Math.floor(ms / 1000);
  return digits(`${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`, locale);
}

/**
 * A spoiler-free result block: squares say which items you got, never which
 * answer they were.
 */
export function buildShareText(i: ShareInput): string {
  const ar = i.locale === "ar";
  const day = challengeDayKey();
  const [, month, dayOfMonth] = day.split("-");
  const date = digits(`${dayOfMonth}/${month}`, i.locale);

  const title = ar
    ? `منصّة القدرات المعرفية — تحدّي ${date}`
    : `Cognitive Skills Platform — Daily ${date}`;

  const score = ar
    ? `${digits(i.correct, "ar")}/${digits(i.total, "ar")} · ${clock(i.timeMs, "ar")}`
    : `${i.correct}/${i.total} · ${clock(i.timeMs, "en")}`;

  const grid = i.marks.length
    ? i.marks.map((m) => (m ? "🟩" : "⬜")).join("")
    : "";

  const lines = [title, score, grid].filter(Boolean);

  if (i.streak > 1) {
    lines.push(
      ar ? `🔥 ${digits(i.streak, "ar")} أيام متّصلة` : `🔥 ${i.streak}-day streak`,
    );
  }
  if (i.rank && i.rank.total > 1) {
    lines.push(
      ar
        ? `🏅 ترتيبك ${digits(i.rank.rank, "ar")} من ${digits(i.rank.total, "ar")} اليوم`
        : `🏅 Rank ${i.rank.rank} of ${i.rank.total} today`,
    );
  }
  lines.push(i.url);
  return lines.join("\n");
}

export type ShareOutcome = "shared" | "copied" | "failed";

/** Native share sheet where it exists, clipboard everywhere else. */
export async function shareResult(text: string): Promise<ShareOutcome> {
  try {
    if (typeof navigator !== "undefined" && navigator.share) {
      await navigator.share({ text });
      return "shared";
    }
  } catch (err) {
    // A user dismissing the sheet is not a failure worth reporting.
    if (err instanceof Error && err.name === "AbortError") return "shared";
  }
  try {
    await navigator.clipboard.writeText(text);
    return "copied";
  } catch {
    return "failed";
  }
}

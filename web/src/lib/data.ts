"use client";

import { createClient } from "@/lib/supabase/client";
import { challengeDayKey } from "@/lib/day";
import type { DiagnosticResult, ReviewCardRecord } from "@/lib/types";

// Unified persistence layer.
// - Signed in + Supabase configured  → data is stored in Supabase (synced).
// - Otherwise                        → data is stored in localStorage (guest).
//
// Every function is safe to call from client components and degrades to guest
// mode automatically.

const LS_DIAGNOSTIC = "cog:diagnostic:latest";
const LS_HISTORY = "cog:diagnostic:history";
const LS_CARDS = "cog:reviewcards";
const LS_PRACTICE_DAYS = "cog:practicedays";

function hasWindow() {
  return typeof window !== "undefined";
}

// localStorage throws (not just returns null) when site data is blocked or the
// quota is full. An unguarded call used to freeze the practice session and hang
// the journey page forever, so every access goes through these helpers.
function lsGet(key: string): string | null {
  if (!hasWindow()) return null;
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function lsSet(key: string, value: string): void {
  if (!hasWindow()) return;
  try {
    localStorage.setItem(key, value);
  } catch {
    /* storage blocked or full — keep going, the session still works */
  }
}

function lsReadJSON<T>(key: string, fallback: T): T {
  const raw = lsGet(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

/**
 * The current signed-in user id, or null in guest mode.
 * Uses the locally-cached session: `getUser()` always hits the network and
 * returns null on any hiccup, which silently demoted signed-in users to guests
 * and orphaned their results in localStorage.
 */
export async function getUserId(): Promise<string | null> {
  const supabase = createClient();
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  return data.session?.user?.id ?? null;
}

// ------------------------------- Diagnostic -------------------------------

function saveDiagnosticLocally(result: DiagnosticResult): void {
  lsSet(LS_DIAGNOSTIC, JSON.stringify(result));
  const hist = readHistoryLS();
  hist.push(result);
  lsSet(LS_HISTORY, JSON.stringify(hist.slice(-30)));
}

export async function saveDiagnostic(result: DiagnosticResult): Promise<void> {
  const supabase = createClient();
  const userId = await getUserId();

  // Always keep a local copy first: a 20-question assessment must never be lost
  // to a rejected insert, an aborted request or a flaky connection.
  saveDiagnosticLocally(result);

  if (supabase && userId) {
    const { error } = await supabase.from("diagnostic_results").insert({
      user_id: userId,
      finished_at: result.finishedAt,
      estimates: result.estimates,
      items: result.items,
    });
    if (error) markPendingSync();
  }
}

// When a cloud write fails we remember that the local copy is ahead, so it can
// be pushed on the next successful sign-in / migration pass.
const LS_PENDING = "cog:pendingsync";
function markPendingSync(): void {
  lsSet(LS_PENDING, "1");
}
export function hasPendingSync(): boolean {
  return lsGet(LS_PENDING) === "1";
}

function readHistoryLS(): DiagnosticResult[] {
  const hist = lsReadJSON<DiagnosticResult[] | null>(LS_HISTORY, null);
  if (hist && hist.length > 0) return hist;
  // No history array yet — fall back to the single latest result if present.
  const latest = lsReadJSON<DiagnosticResult | null>(LS_DIAGNOSTIC, null);
  return latest ? [latest] : [];
}

function readCardsLS(): ReviewCardRecord[] {
  return lsReadJSON<ReviewCardRecord[]>(LS_CARDS, []);
}

/** All past diagnostics, oldest → newest, for the progress-over-time view. */
export async function getDiagnosticHistory(): Promise<DiagnosticResult[]> {
  const supabase = createClient();
  const userId = await getUserId();

  if (supabase && userId) {
    const { data } = await supabase
      .from("diagnostic_results")
      .select("id, finished_at, estimates")
      .eq("user_id", userId)
      .order("finished_at", { ascending: true });
    return (data ?? []).map((d) => ({
      id: String(d.id),
      finishedAt: d.finished_at as string,
      estimates: d.estimates as DiagnosticResult["estimates"],
      items: [],
    }));
  }

  return readHistoryLS();
}

export async function getLatestDiagnostic(): Promise<DiagnosticResult | null> {
  const supabase = createClient();
  const userId = await getUserId();

  if (supabase && userId) {
    const { data } = await supabase
      .from("diagnostic_results")
      .select("id, finished_at, estimates, items")
      .eq("user_id", userId)
      .order("finished_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (!data) return null;
    return {
      id: String(data.id),
      finishedAt: data.finished_at as string,
      estimates: data.estimates as DiagnosticResult["estimates"],
      items: data.items as DiagnosticResult["items"],
    };
  }

  return lsReadJSON<DiagnosticResult | null>(LS_DIAGNOSTIC, null);
}

// ------------------------------- Review cards -------------------------------

export async function getReviewCards(): Promise<ReviewCardRecord[]> {
  const supabase = createClient();
  const userId = await getUserId();

  if (supabase && userId) {
    const { data } = await supabase
      .from("review_cards")
      .select("question_id, skill, fsrs, due, updated_at")
      .eq("user_id", userId);
    return (data ?? []).map((row) => ({
      questionId: row.question_id as string,
      skill: row.skill as ReviewCardRecord["skill"],
      fsrs: row.fsrs as Record<string, unknown>,
      due: row.due as string,
      updatedAt: (row.updated_at as string) ?? new Date().toISOString(),
    }));
  }

  return readCardsLS();
}

export async function upsertReviewCard(card: ReviewCardRecord): Promise<void> {
  const supabase = createClient();
  const userId = await getUserId();

  // Always mirror locally so scheduling survives a failed or offline write.
  const cards = readCardsLS();
  const idx = cards.findIndex((c) => c.questionId === card.questionId);
  if (idx >= 0) cards[idx] = card;
  else cards.push(card);
  lsSet(LS_CARDS, JSON.stringify(cards));

  if (supabase && userId) {
    const { error } = await supabase.from("review_cards").upsert(
      {
        user_id: userId,
        question_id: card.questionId,
        skill: card.skill,
        fsrs: card.fsrs,
        due: card.due,
        updated_at: card.updatedAt,
      },
      { onConflict: "user_id,question_id" },
    );
    if (error) markPendingSync();
  }
}

// ------------------------------- Recently-seen items -------------------------------
// Remembered across assessments so a retake doesn't serve the same questions
// (which would show practice effects as cognitive improvement).

const LS_SEEN = "cog:seenquestions";
const SEEN_CAP = 150;

export function getRecentQuestionIds(): string[] {
  return lsReadJSON<string[]>(LS_SEEN, []);
}

export function addRecentQuestionIds(ids: string[]): void {
  if (ids.length === 0) return;
  const merged = [...getRecentQuestionIds(), ...ids];
  // keep the most recent, de-duplicated
  const unique = [...new Set(merged.reverse())].reverse();
  lsSet(LS_SEEN, JSON.stringify(unique.slice(-SEEN_CAP)));
}

// ------------------------------- Practice-day log -------------------------------
// A local (per-device) log of days the learner practiced, used for streaks.
// Kept in localStorage for now; can move to Supabase later.

export function getPracticeDays(): string[] {
  return lsReadJSON<string[]>(LS_PRACTICE_DAYS, []);
}

export function logPracticeToday(): void {
  const days = getPracticeDays();
  const today = challengeDayKey();
  if (!days.includes(today)) {
    days.push(today);
    lsSet(LS_PRACTICE_DAYS, JSON.stringify(days.slice(-400)));
  }
}

// ------------------------------- Guest → account migration -------------------------------

const LS_MIGRATED = "cog:migrated";

/**
 * Uploads progress a guest built up locally so signing in doesn't orphan it.
 * Runs once per device after a successful sign-in.
 */
export async function migrateLocalToAccount(): Promise<void> {
  const supabase = createClient();
  const userId = await getUserId();
  if (!supabase || !userId) return;
  if (lsGet(LS_MIGRATED) === "1" && !hasPendingSync()) return;

  try {
    const history = readHistoryLS();
    if (history.length > 0) {
      const { data: existing } = await supabase
        .from("diagnostic_results")
        .select("finished_at")
        .eq("user_id", userId);
      const known = new Set(
        (existing ?? []).map((r) => String(r.finished_at)),
      );
      const rows = history
        .filter((h) => !known.has(h.finishedAt))
        .map((h) => ({
          user_id: userId,
          finished_at: h.finishedAt,
          estimates: h.estimates,
          items: h.items ?? [],
        }));
      if (rows.length > 0) {
        await supabase.from("diagnostic_results").insert(rows);
      }
    }

    const cards = readCardsLS();
    if (cards.length > 0) {
      await supabase.from("review_cards").upsert(
        cards.map((c) => ({
          user_id: userId,
          question_id: c.questionId,
          skill: c.skill,
          fsrs: c.fsrs,
          due: c.due,
          updated_at: c.updatedAt,
        })),
        { onConflict: "user_id,question_id" },
      );
    }

    lsSet(LS_MIGRATED, "1");
    lsSet(LS_PENDING, "0");
  } catch {
    /* leave the local copy in place; it will be retried next sign-in */
  }
}

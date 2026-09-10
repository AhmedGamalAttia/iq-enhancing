"use client";

import { createClient } from "@/lib/supabase/client";
import type { DiagnosticResult, ReviewCardRecord } from "@/lib/types";

// Unified persistence layer.
// - Signed in + Supabase configured  → data is stored in Supabase (synced).
// - Otherwise                        → data is stored in localStorage (guest).
//
// Every function is safe to call from client components and degrades to guest
// mode automatically.

const LS_DIAGNOSTIC = "cog:diagnostic:latest";
const LS_CARDS = "cog:reviewcards";
const LS_PRACTICE_DAYS = "cog:practicedays";

function hasWindow() {
  return typeof window !== "undefined";
}

/** The current signed-in user id, or null in guest mode. */
export async function getUserId(): Promise<string | null> {
  const supabase = createClient();
  if (!supabase) return null;
  const { data } = await supabase.auth.getUser();
  return data.user?.id ?? null;
}

// ------------------------------- Diagnostic -------------------------------

export async function saveDiagnostic(result: DiagnosticResult): Promise<void> {
  const supabase = createClient();
  const userId = await getUserId();

  if (supabase && userId) {
    await supabase.from("diagnostic_results").insert({
      user_id: userId,
      finished_at: result.finishedAt,
      estimates: result.estimates,
      items: result.items,
    });
    return;
  }

  if (hasWindow()) {
    localStorage.setItem(LS_DIAGNOSTIC, JSON.stringify(result));
  }
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

  if (hasWindow()) {
    const raw = localStorage.getItem(LS_DIAGNOSTIC);
    if (raw) {
      try {
        return JSON.parse(raw) as DiagnosticResult;
      } catch {
        return null;
      }
    }
  }
  return null;
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

  if (hasWindow()) {
    const raw = localStorage.getItem(LS_CARDS);
    if (raw) {
      try {
        return JSON.parse(raw) as ReviewCardRecord[];
      } catch {
        return [];
      }
    }
  }
  return [];
}

export async function upsertReviewCard(card: ReviewCardRecord): Promise<void> {
  const supabase = createClient();
  const userId = await getUserId();

  if (supabase && userId) {
    await supabase.from("review_cards").upsert(
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
    return;
  }

  if (hasWindow()) {
    const cards = await getReviewCards();
    const idx = cards.findIndex((c) => c.questionId === card.questionId);
    if (idx >= 0) cards[idx] = card;
    else cards.push(card);
    localStorage.setItem(LS_CARDS, JSON.stringify(cards));
  }
}

// ------------------------------- Practice-day log -------------------------------
// A local (per-device) log of days the learner practiced, used for streaks.
// Kept in localStorage for now; can move to Supabase later.

function todayKey(): string {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}

export function getPracticeDays(): string[] {
  if (!hasWindow()) return [];
  const raw = localStorage.getItem(LS_PRACTICE_DAYS);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as string[];
  } catch {
    return [];
  }
}

export function logPracticeToday(): void {
  if (!hasWindow()) return;
  const days = getPracticeDays();
  const today = todayKey();
  if (!days.includes(today)) {
    days.push(today);
    localStorage.setItem(LS_PRACTICE_DAYS, JSON.stringify(days));
  }
}

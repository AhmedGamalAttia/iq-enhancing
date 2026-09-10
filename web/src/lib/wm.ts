"use client";

// Working memory is the one dimension a static multiple-choice item cannot
// measure: the old `wm-*` questions printed the digits and left them on screen
// while you answered, so they tested reading, not holding. The dimension is now
// measured where it actually can be — the timed n-back task — and this module
// is the single place that result lives.

const LS_WM = "cog:wm:latest";

export interface WorkingMemoryResult {
  /** n-back level: 1, 2 or 3. */
  n: number;
  /** Hit-rate minus false-alarm rate, 0..100. */
  score: number;
  /** ISO timestamp. */
  at: string;
}

export function saveWorkingMemory(result: WorkingMemoryResult): void {
  if (typeof window === "undefined") return;
  try {
    const prev = getWorkingMemory();
    // Keep the strongest demonstration: a harder level always wins, and at the
    // same level the better score wins. Practising an easier level shouldn't
    // erase evidence that you can do a harder one.
    if (prev && (prev.n > result.n || (prev.n === result.n && prev.score >= result.score))) {
      return;
    }
    localStorage.setItem(LS_WM, JSON.stringify(result));
  } catch {
    /* storage blocked — the round still counted, it just isn't remembered */
  }
}

export function getWorkingMemory(): WorkingMemoryResult | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(LS_WM);
    if (!raw) return null;
    const r = JSON.parse(raw) as WorkingMemoryResult;
    return typeof r?.n === "number" && typeof r?.score === "number" ? r : null;
  } catch {
    return null;
  }
}

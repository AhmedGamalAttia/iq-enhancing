import type {
  DiagnosticItem,
  Question,
  SkillEstimate,
  SkillKey,
} from "@/lib/types";

// ---------------------------------------------------------------------------
// Adaptive engine
//
// We estimate ability (theta) on a 1..5 scale using a lightweight Elo/IRT-style
// update. After each answer, theta moves toward the item difficulty depending
// on whether the expected outcome matched the actual one. This is a defensible
// simplification of Item Response Theory suitable for an MVP; a fully
// calibrated IRT model is a later-phase upgrade.
// ---------------------------------------------------------------------------

export const START_THETA = 3;
const K = 0.6; // learning rate of the estimate
const DISCRIMINATION = 1.2; // how sharply probability changes with the gap

/** Expected probability of a correct answer given ability and difficulty. */
export function expectedCorrect(theta: number, difficulty: number): number {
  return 1 / (1 + Math.pow(10, (difficulty - theta) / DISCRIMINATION));
}

/** Update the ability estimate after one response. */
export function updateTheta(
  theta: number,
  difficulty: number,
  correct: boolean,
): number {
  const expected = expectedCorrect(theta, difficulty);
  const next = theta + K * ((correct ? 1 : 0) - expected);
  return Math.min(5, Math.max(1, next));
}

/**
 * Pick the next unseen question for a skill whose difficulty is closest to the
 * current ability estimate — the most informative item.
 */
export function selectNextQuestion(
  pool: Question[],
  seenIds: Set<string>,
  theta: number,
): Question | null {
  const candidates = pool.filter((q) => !seenIds.has(q.id));
  if (candidates.length === 0) return null;
  const target = Math.round(theta);
  candidates.sort((a, b) => {
    const da = Math.abs(a.difficulty - target);
    const db = Math.abs(b.difficulty - target);
    if (da !== db) return da - db;
    return Math.random() - 0.5; // tie-break randomly
  });
  return candidates[0];
}

const SCORE_MIN = 1;
const SCORE_MAX = 5;

/** Map a 1..5 ability estimate to a friendly 0..100 score. */
export function thetaToScore(theta: number): number {
  return Math.round(((theta - SCORE_MIN) / (SCORE_MAX - SCORE_MIN)) * 100);
}

export type BandKey =
  | "advanced"
  | "veryGood"
  | "average"
  | "needsWork"
  | "beginner";

/** Qualitative band for a 0..100 score (label is resolved via i18n). */
export function scoreBand(score: number): { key: BandKey; tone: string } {
  if (score >= 80) return { key: "advanced", tone: "success" };
  if (score >= 60) return { key: "veryGood", tone: "brand" };
  if (score >= 40) return { key: "average", tone: "accent" };
  if (score >= 20) return { key: "needsWork", tone: "warning" };
  return { key: "beginner", tone: "danger" };
}

/** Recompute per-skill estimates from a full item log (used for persistence). */
export function estimateFromItems(
  items: DiagnosticItem[],
): Partial<Record<SkillKey, SkillEstimate>> {
  const bySkill = new Map<SkillKey, DiagnosticItem[]>();
  for (const item of items) {
    const list = bySkill.get(item.skill) ?? [];
    list.push(item);
    bySkill.set(item.skill, list);
  }

  const result: Partial<Record<SkillKey, SkillEstimate>> = {};
  for (const [skill, list] of bySkill) {
    let theta = START_THETA;
    let correct = 0;
    for (const item of list) {
      theta = updateTheta(theta, item.difficulty, item.correct);
      if (item.correct) correct += 1;
    }
    result[skill] = {
      skill,
      theta,
      score: thetaToScore(theta),
      correct,
      total: list.length,
    };
  }
  return result;
}

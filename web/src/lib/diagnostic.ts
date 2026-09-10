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

// Per-skill difficulty scale. Text dimensions use 1..5; the abstract dimension
// uses a wider 1..10 range (child → expert) with a faster early "calibration"
// step so it homes in on the right level within a few items.
export interface SkillScale {
  min: number;
  max: number;
  start: number;
  k: number; // learning rate
  fastK: number; // learning rate for the first fastN items
  fastN: number; // number of fast-calibration items
  disc: number; // discrimination
}

const TEXT_SCALE: SkillScale = {
  min: 1,
  max: 5,
  start: 3,
  k: 0.6,
  fastK: 0.6,
  fastN: 0,
  disc: 1.2,
};

export const SKILL_SCALE: Record<SkillKey, SkillScale> = {
  logical: TEXT_SCALE,
  verbal: TEXT_SCALE,
  working_memory: TEXT_SCALE,
  numeracy: TEXT_SCALE,
  critical: TEXT_SCALE,
  abstract: { min: 1, max: 10, start: 5, k: 0.7, fastK: 1.6, fastN: 3, disc: 1.5 },
};

export const START_THETA = TEXT_SCALE.start;

/** Expected probability of a correct answer given ability and difficulty. */
export function expectedCorrect(
  theta: number,
  difficulty: number,
  disc: number = TEXT_SCALE.disc,
): number {
  return 1 / (1 + Math.pow(10, (difficulty - theta) / disc));
}

/** Update the ability estimate after one response (scale-aware). */
export function updateTheta(
  theta: number,
  difficulty: number,
  correct: boolean,
  scale: SkillScale = TEXT_SCALE,
  itemIndex = 999,
): number {
  const k = itemIndex < scale.fastN ? scale.fastK : scale.k;
  const expected = expectedCorrect(theta, difficulty, scale.disc);
  const next = theta + k * ((correct ? 1 : 0) - expected);
  return Math.min(scale.max, Math.max(scale.min, next));
}

/**
 * Pick the next unseen question for a skill whose difficulty is closest to the
 * current ability estimate — the most informative item.
 */
export function selectNextQuestion(
  pool: Question[],
  seenIds: Set<string>,
  theta: number,
  recentIds?: Set<string>,
): Question | null {
  const candidates = pool.filter((q) => !seenIds.has(q.id));
  if (candidates.length === 0) return null;

  // Prefer items the learner hasn't met in recent assessments, so a retake
  // measures ability rather than memory of the same questions.
  const fresh = recentIds
    ? candidates.filter((q) => !recentIds.has(q.id))
    : [];
  const usable = fresh.length > 0 ? fresh : candidates;

  const target = Math.round(theta);
  let closest = Infinity;
  for (const q of usable) {
    closest = Math.min(closest, Math.abs(q.difficulty - target));
  }
  // Uniform pick among the equally-informative items (a `Math.random() - 0.5`
  // comparator is not a uniform shuffle and barely varies the selection).
  const ties = usable.filter(
    (q) => Math.abs(q.difficulty - target) === closest,
  );
  return ties[Math.floor(Math.random() * ties.length)];
}

/** Map an ability estimate to a friendly 0..100 score (scale-aware). */
export function thetaToScore(
  theta: number,
  scale: SkillScale = TEXT_SCALE,
): number {
  return Math.round(((theta - scale.min) / (scale.max - scale.min)) * 100);
}

/**
 * Below this many items an estimate is too noisy to report. Because theta can
 * move at most `k` per item, a 2-item skill is mathematically trapped near the
 * middle (≈37–63) — it can never read "advanced" or "beginner" no matter how
 * the learner performs — so showing an X/100 with a band would be misleading,
 * and it must not drive the "weakest skill" recommendation either.
 * At 4 items the attainable range is ≈18–82, which is usable.
 */
export const MIN_RELIABLE_ITEMS = 4;

export function isReliable(est: { total: number }): boolean {
  return est.total >= MIN_RELIABLE_ITEMS;
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
    const scale = SKILL_SCALE[skill];
    let theta = scale.start;
    let correct = 0;
    list.forEach((item, idx) => {
      theta = updateTheta(theta, item.difficulty, item.correct, scale, idx);
      if (item.correct) correct += 1;
    });
    result[skill] = {
      skill,
      theta,
      score: thetaToScore(theta, scale),
      correct,
      total: list.length,
    };
  }
  return result;
}

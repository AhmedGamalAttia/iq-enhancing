// Adaptive ability estimate for the abstract-reasoning dimension.
// Wider scale (1..10) than the text dimensions so it spans child → expert, and
// a faster learning rate for the first few items so it homes in on the right
// level within ~3-4 questions (a physicist quickly rises, a child settles low)
// — without ever asking the person their age or level.

export const ABS_MIN = 1;
export const ABS_MAX = 10;
export const ABS_START = 5;

const K = 0.7;
const FAST_K = 1.6;
const FAST_N = 3; // number of early "calibration" items with the big step
const DISCRIMINATION = 1.5;

export function updateAbstractTheta(
  theta: number,
  difficulty: number,
  correct: boolean,
  itemIndex: number,
): number {
  const k = itemIndex < FAST_N ? FAST_K : K;
  const expected = 1 / (1 + Math.pow(10, (difficulty - theta) / DISCRIMINATION));
  const next = theta + k * ((correct ? 1 : 0) - expected);
  return Math.min(ABS_MAX, Math.max(ABS_MIN, next));
}

/** Difficulty of the next item = the level we currently estimate. */
export function abstractTargetDifficulty(theta: number): number {
  return Math.min(ABS_MAX, Math.max(ABS_MIN, Math.round(theta)));
}

/** Map a 1..10 ability estimate to a friendly 0..100 score. */
export function abstractScore(theta: number): number {
  return Math.round(((theta - ABS_MIN) / (ABS_MAX - ABS_MIN)) * 100);
}

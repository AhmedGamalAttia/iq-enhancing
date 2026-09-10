import {
  createEmptyCard,
  fsrs,
  generatorParameters,
  Rating,
  type Card,
} from "ts-fsrs";
import type { ReviewCardRecord, SkillKey } from "@/lib/types";

// Spaced-repetition scheduling powered by FSRS (Free Spaced Repetition
// Scheduler). We keep default parameters for the MVP; these can later be
// optimized per-user from their review history.
const scheduler = fsrs(generatorParameters({ enable_fuzz: true }));

/** A fresh card for a question the learner has not scheduled yet. */
export function newCardRecord(
  questionId: string,
  skill: SkillKey,
  now: Date = new Date(),
): ReviewCardRecord {
  const card = createEmptyCard(now);
  return {
    questionId,
    skill,
    fsrs: serializeCard(card),
    due: card.due.toISOString(),
    updatedAt: now.toISOString(),
  };
}

/**
 * Grade a review and return the updated card record.
 * Correct answers map to `Good`; wrong answers map to `Again`.
 */
export function reviewCard(
  record: ReviewCardRecord,
  correct: boolean,
  now: Date = new Date(),
): ReviewCardRecord {
  const card = deserializeCard(record.fsrs, now);
  const rating = correct ? Rating.Good : Rating.Again;
  const { card: next } = scheduler.next(card, now, rating);
  return {
    ...record,
    fsrs: serializeCard(next),
    due: next.due.toISOString(),
    updatedAt: now.toISOString(),
  };
}

/** Cards whose due date is at or before `now`. */
export function isDue(record: ReviewCardRecord, now: Date = new Date()): boolean {
  return new Date(record.due).getTime() <= now.getTime();
}

// ts-fsrs Card holds Date instances; localStorage/JSON needs ISO strings.
//
// Every field is written out BY NAME. `{ ...card }` looked equivalent, but it
// silently kept only what the library happens to expose as own enumerable
// properties — cards written that way landed in localStorage as `{ due }` alone,
// and the next review threw `FSRSValidationError: Invalid state:[undefined]`,
// which killed the practice session on the first answer.
function serializeCard(card: Card): Record<string, unknown> {
  return {
    due: card.due.toISOString(),
    stability: card.stability,
    difficulty: card.difficulty,
    elapsed_days: card.elapsed_days,
    scheduled_days: card.scheduled_days,
    learning_steps: card.learning_steps,
    reps: card.reps,
    lapses: card.lapses,
    state: card.state,
    last_review: card.last_review
      ? card.last_review.toISOString()
      : undefined,
  };
}

const REQUIRED: (keyof Card)[] = [
  "stability",
  "difficulty",
  "elapsed_days",
  "scheduled_days",
  "reps",
  "lapses",
  "state",
];

/**
 * Rebuild a Card from stored JSON. A record that is missing fields — written by
 * the old serializer, or truncated — restarts scheduling from a fresh card
 * instead of throwing: losing one card's interval is recoverable, losing the
 * session is not.
 */
function deserializeCard(data: Record<string, unknown>, now: Date): Card {
  const usable =
    !!data &&
    typeof data.due === "string" &&
    REQUIRED.every((k) => typeof data[k as string] === "number");
  if (!usable) return createEmptyCard(now);

  const raw = data as unknown as Card & { due: string; last_review?: string };
  return {
    due: new Date(raw.due),
    stability: raw.stability,
    difficulty: raw.difficulty,
    elapsed_days: raw.elapsed_days,
    scheduled_days: raw.scheduled_days,
    learning_steps: raw.learning_steps ?? 0,
    reps: raw.reps,
    lapses: raw.lapses,
    state: raw.state,
    last_review: raw.last_review ? new Date(raw.last_review) : undefined,
  } as Card;
}

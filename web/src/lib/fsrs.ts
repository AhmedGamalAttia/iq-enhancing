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
  const card = deserializeCard(record.fsrs);
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
function serializeCard(card: Card): Record<string, unknown> {
  return {
    ...card,
    due: card.due.toISOString(),
    last_review: card.last_review ? card.last_review.toISOString() : undefined,
  };
}

function deserializeCard(data: Record<string, unknown>): Card {
  const raw = data as unknown as Card & {
    due: string;
    last_review?: string;
  };
  return {
    ...raw,
    due: new Date(raw.due),
    last_review: raw.last_review ? new Date(raw.last_review) : undefined,
  } as Card;
}

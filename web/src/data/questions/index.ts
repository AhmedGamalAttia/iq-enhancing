import type { Question } from "@/lib/types";
import type { Locale } from "@/i18n/config";
import { LOGICAL_QUESTIONS } from "./logical";
import { VERBAL_QUESTIONS } from "./verbal";
import { NUMERACY_QUESTIONS } from "./numeracy";
import { CRITICAL_QUESTIONS } from "./critical";

// Original, hand-authored item bank. NOT copied from any standardized IQ test.
// Each item declares a difficulty (1 easy → 5 hard) used by the adaptive engine
// and a plain explanation shown after answering.
//
// `working_memory` deliberately has NO items here. A multiple-choice item leaves
// the digits on screen while you answer, so it measures reading rather than
// holding; the dimension is measured by the timed n-back task instead
// (see `lib/wm.ts`).
//
// The fifth dimension, `abstract`, is procedurally generated
// (see `lib/abstract/generate.ts`) rather than authored.

export const QUESTIONS: Question[] = [
  ...LOGICAL_QUESTIONS,
  ...VERBAL_QUESTIONS,
  ...NUMERACY_QUESTIONS,
  ...CRITICAL_QUESTIONS,
];

export function questionsBySkill(
  skill: string,
  locale: Locale = "ar",
): Question[] {
  return QUESTIONS.filter(
    (q) => q.skill === skill && (q.locale ?? "ar") === locale,
  );
}

export function questionById(id: string): Question | undefined {
  return QUESTIONS.find((q) => q.id === id);
}

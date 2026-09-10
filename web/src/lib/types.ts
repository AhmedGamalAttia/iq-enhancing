// Core domain types for the cognitive-training platform.

import type { Locale } from "@/i18n/config";

export type SkillKey =
  | "abstract"
  | "logical"
  | "verbal"
  | "working_memory"
  | "numeracy"
  | "critical";

// Visual metadata for a skill. Localized text (name/tagline/desc) lives in the
// i18n messages under `skills[key]`.
export interface Skill {
  key: SkillKey;
  icon: string; // emoji
  accent: string; // hex — meters, strokes, tinted chip backgrounds
  /**
   * The same hue, but a step that clears 4.5:1 on every surface in both themes.
   * Use this (never `accent`) whenever the colour is applied to text.
   */
  accentText: string; // CSS var reference
}

export type QuestionType = "mcq";

export type Difficulty = 1 | 2 | 3 | 4 | 5;

export interface Question {
  id: string;
  skill: SkillKey;
  difficulty: Difficulty;
  type: QuestionType;
  stem: string;
  choices: string[];
  answer: number; // index into choices
  explanation: string;
  source?: "authored" | "ai";
  locale?: Locale; // defaults to "ar" when omitted
}

export interface DiagnosticItem {
  questionId: string;
  skill: SkillKey;
  difficulty: number;
  chosen: number;
  correct: boolean;
  msTaken: number;
}

export interface SkillEstimate {
  skill: SkillKey;
  theta: number; // ability on a 1..5 continuous scale
  score: number; // 0..100
  correct: number;
  total: number;
}

export interface DiagnosticResult {
  id: string;
  finishedAt: string; // ISO timestamp
  estimates: Partial<Record<SkillKey, SkillEstimate>>;
  items: DiagnosticItem[];
}

// A spaced-repetition card. `fsrs` holds the serialized ts-fsrs Card state.
export interface ReviewCardRecord {
  questionId: string;
  skill: SkillKey;
  fsrs: Record<string, unknown>; // serialized ts-fsrs Card (dates as ISO strings)
  due: string; // ISO timestamp
  updatedAt: string;
}

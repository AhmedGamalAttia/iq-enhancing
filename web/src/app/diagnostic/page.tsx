"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type {
  DiagnosticItem,
  Question,
  SkillKey,
} from "@/lib/types";
import { questionsBySkill } from "@/data/questions";
import { SKILL_LIST } from "@/data/skills";
import {
  START_THETA,
  estimateFromItems,
  selectNextQuestion,
  updateTheta,
} from "@/lib/diagnostic";
import { saveDiagnostic, upsertReviewCard } from "@/lib/data";
import { newCardRecord } from "@/lib/fsrs";
import { useI18n } from "@/i18n/context";
import { QuestionCard } from "@/components/question-card";
import { Button, ButtonLink, Card } from "@/components/ui";

const SKILL_ORDER: SkillKey[] = [
  "logical",
  "verbal",
  "working_memory",
  "numeracy",
  "critical",
];
const PER_SKILL = 4;
const TOTAL = SKILL_ORDER.length * PER_SKILL;

function initThetas(): Record<SkillKey, number> {
  return Object.fromEntries(
    SKILL_ORDER.map((k) => [k, START_THETA]),
  ) as Record<SkillKey, number>;
}

function initSeen(): Record<SkillKey, Set<string>> {
  return Object.fromEntries(
    SKILL_ORDER.map((k) => [k, new Set<string>()]),
  ) as Record<SkillKey, Set<string>>;
}

export default function DiagnosticPage() {
  const router = useRouter();
  const { t, locale } = useI18n();
  const [phase, setPhase] = useState<"intro" | "running" | "saving">("intro");
  const [step, setStep] = useState(0);
  const [current, setCurrent] = useState<Question | null>(null);

  // Mutable engine state kept in refs to avoid stale closures.
  const thetas = useRef<Record<SkillKey, number>>(initThetas());
  const seen = useRef<Record<SkillKey, Set<string>>>(initSeen());
  const items = useRef<DiagnosticItem[]>([]);
  const shownAt = useRef<number>(0);

  function skillForStep(s: number): SkillKey {
    return SKILL_ORDER[s % SKILL_ORDER.length];
  }

  function pickFor(s: number): Question | null {
    const skill = skillForStep(s);
    const q = selectNextQuestion(
      questionsBySkill(skill, locale),
      seen.current[skill],
      thetas.current[skill],
    );
    return q;
  }

  function start() {
    thetas.current = initThetas();
    seen.current = initSeen();
    items.current = [];
    const first = pickFor(0);
    setCurrent(first);
    setStep(0);
    shownAt.current = Date.now();
    setPhase("running");
  }

  async function onNext(correct: boolean, chosen: number) {
    if (!current) return;
    const skill = current.skill;
    items.current.push({
      questionId: current.id,
      skill,
      difficulty: current.difficulty,
      chosen,
      correct,
      msTaken: Date.now() - shownAt.current,
    });
    thetas.current[skill] = updateTheta(
      thetas.current[skill],
      current.difficulty,
      correct,
    );
    seen.current[skill].add(current.id);

    const nextStep = step + 1;
    if (nextStep >= TOTAL) {
      await finish();
      return;
    }
    const next = pickFor(nextStep);
    if (!next) {
      await finish();
      return;
    }
    setStep(nextStep);
    setCurrent(next);
    shownAt.current = Date.now();
  }

  async function finish() {
    setPhase("saving");
    const estimates = estimateFromItems(items.current);
    const result = {
      id:
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : String(Date.now()),
      finishedAt: new Date().toISOString(),
      estimates,
      items: items.current,
    };
    await saveDiagnostic(result);
    // Seed spaced-repetition cards from mistakes.
    const wrong = items.current.filter((i) => !i.correct);
    for (const item of wrong) {
      await upsertReviewCard(newCardRecord(item.questionId, item.skill));
    }
    router.push("/results");
  }

  const progress = Math.round((step / TOTAL) * 100);

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 md:px-6">
      {phase === "intro" && (
        <Card className="animate-rise p-8 text-center">
          <div className="mb-4 text-5xl">🧭</div>
          <h1 className="mb-2 text-2xl font-bold">{t.diagnostic.title}</h1>
          <p className="mx-auto mb-6 max-w-md leading-relaxed text-fg-muted">
            {t.diagnostic.intro(TOTAL)}
          </p>
          <div className="mb-6 flex flex-wrap justify-center gap-2">
            {SKILL_LIST.map((s) => (
              <span
                key={s.key}
                className="inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold"
                style={{
                  color: s.accent,
                  borderColor: `${s.accent}55`,
                  background: `${s.accent}14`,
                }}
              >
                <span>{s.icon}</span> {t.skills[s.key].name}
              </span>
            ))}
          </div>
          <p className="mb-6 text-xs text-fg-faint">{t.diagnostic.notIQ}</p>
          <Button size="lg" onClick={start}>
            {t.diagnostic.start}
          </Button>
        </Card>
      )}

      {phase === "running" && current && (
        <>
          <div className="mb-4 h-2 w-full overflow-hidden rounded-full bg-surface-2">
            <div
              className="h-full rounded-full bg-brand transition-[width] duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <QuestionCard
            key={current.id}
            question={current}
            index={step}
            total={TOTAL}
            mode="assess"
            onNext={onNext}
          />
        </>
      )}

      {phase === "saving" && (
        <Card className="p-10 text-center">
          <div className="mb-3 text-4xl">📊</div>
          <p className="text-fg-muted">{t.diagnostic.saving}</p>
          <div className="mt-4 flex justify-center">
            <ButtonLink href="/results" variant="ghost" size="sm">
              {t.diagnostic.goResults}
            </ButtonLink>
          </div>
        </Card>
      )}
    </div>
  );
}

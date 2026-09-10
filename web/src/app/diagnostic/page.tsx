"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { DiagnosticItem, Question, SkillKey } from "@/lib/types";
import type { AbstractItem } from "@/lib/abstract/types";
import { questionsBySkill } from "@/data/questions";
import { SKILLS } from "@/data/skills";
import {
  SKILL_SCALE,
  estimateFromItems,
  selectNextQuestion,
  updateTheta,
} from "@/lib/diagnostic";
import { generateAbstractItem, typeForStep } from "@/lib/abstract/generate";
import {
  addRecentQuestionIds,
  getRecentQuestionIds,
  saveDiagnostic,
  upsertReviewCard,
} from "@/lib/data";
import { newCardRecord } from "@/lib/fsrs";
import { useI18n } from "@/i18n/context";
import { QuestionCard } from "@/components/question-card";
import { AbstractQuestionCard } from "@/components/abstract-question-card";
import { Button, ButtonLink, Card } from "@/components/ui";

// Weighted schedule — the fair, culture-free abstract dimension dominates;
// the culturally-loaded verbal/critical dimensions are de-weighted.
// (working_memory is measured better by the interactive n-back task.)
const WEIGHTS: Partial<Record<SkillKey, number>> = {
  abstract: 8,
  logical: 4,
  numeracy: 4,
  verbal: 2,
  critical: 2,
};
const SKILL_ORDER = Object.keys(WEIGHTS) as SkillKey[];
const TOTAL = SKILL_ORDER.reduce((s, k) => s + (WEIGHTS[k] ?? 0), 0);

/** Even, weighted round-robin so abstract items are spread across the test. */
function buildSchedule(): SkillKey[] {
  const counts: Record<string, number> = {};
  SKILL_ORDER.forEach((k) => (counts[k] = 0));
  const schedule: SkillKey[] = [];
  for (let i = 0; i < TOTAL; i++) {
    let best: SkillKey | null = null;
    let bestRatio = Infinity;
    for (const k of SKILL_ORDER) {
      const w = WEIGHTS[k] ?? 0;
      if (counts[k] >= w) continue;
      const ratio = counts[k] / w;
      if (ratio < bestRatio) {
        bestRatio = ratio;
        best = k;
      }
    }
    if (!best) break;
    schedule.push(best);
    counts[best] += 1;
  }
  return schedule;
}

type Item =
  | { kind: "text"; q: Question }
  | { kind: "abstract"; a: AbstractItem };

function initThetas(): Record<SkillKey, number> {
  return Object.fromEntries(
    SKILL_ORDER.map((k) => [k, SKILL_SCALE[k].start]),
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
  const [current, setCurrent] = useState<Item | null>(null);

  const thetas = useRef<Record<SkillKey, number>>(initThetas());
  const seen = useRef<Record<SkillKey, Set<string>>>(initSeen());
  const items = useRef<DiagnosticItem[]>([]);
  const schedule = useRef<SkillKey[]>([]);
  const abstractSeen = useRef(0);
  const shownAt = useRef<number>(0);
  const recent = useRef<Set<string>>(new Set());

  function pickFor(s: number): Item | null {
    const skill = schedule.current[s];
    if (skill === "abstract") {
      const scale = SKILL_SCALE.abstract;
      const diff = Math.min(
        scale.max,
        Math.max(scale.min, Math.round(thetas.current.abstract)),
      );
      return {
        kind: "abstract",
        a: generateAbstractItem(typeForStep(abstractSeen.current), diff),
      };
    }
    const q = selectNextQuestion(
      questionsBySkill(skill, locale),
      seen.current[skill],
      thetas.current[skill],
      recent.current,
    );
    return q ? { kind: "text", q } : null;
  }

  function start() {
    thetas.current = initThetas();
    seen.current = initSeen();
    items.current = [];
    abstractSeen.current = 0;
    schedule.current = buildSchedule();
    recent.current = new Set(getRecentQuestionIds());
    setCurrent(pickFor(0));
    setStep(0);
    shownAt.current = Date.now();
    setPhase("running");
  }

  async function onNext(correct: boolean, chosen: number) {
    if (!current) return;
    const skill: SkillKey = current.kind === "text" ? current.q.skill : "abstract";
    const id = current.kind === "text" ? current.q.id : current.a.id;
    const difficulty =
      current.kind === "text" ? current.q.difficulty : current.a.difficulty;
    const idx = seen.current[skill].size;

    items.current.push({
      questionId: id,
      skill,
      difficulty,
      chosen,
      correct,
      msTaken: Date.now() - shownAt.current,
    });
    thetas.current[skill] = updateTheta(
      thetas.current[skill],
      difficulty,
      correct,
      SKILL_SCALE[skill],
      idx,
    );
    seen.current[skill].add(id);
    if (skill === "abstract") abstractSeen.current += 1;

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
    // Remember the authored items served, so the next assessment picks others.
    addRecentQuestionIds(
      items.current
        .filter((i) => i.skill !== "abstract")
        .map((i) => i.questionId),
    );
    // Seed spaced-repetition cards from text mistakes (abstract items are
    // procedurally generated and practiced via the endless /abstract session).
    const wrong = items.current.filter(
      (i) => !i.correct && i.skill !== "abstract",
    );
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
            {SKILL_ORDER.map((k) => (
              <span
                key={k}
                className="inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold"
                style={{
                  color: SKILLS[k].accent,
                  borderColor: `${SKILLS[k].accent}55`,
                  background: `${SKILLS[k].accent}14`,
                }}
              >
                <span>{SKILLS[k].icon}</span> {t.skills[k].name}
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
          {current.kind === "text" ? (
            <QuestionCard
              key={current.q.id}
              question={current.q}
              index={step}
              total={TOTAL}
              mode="assess"
              onNext={onNext}
            />
          ) : (
            <AbstractQuestionCard
              key={current.a.id}
              item={current.a}
              index={step}
              total={TOTAL}
              mode="assess"
              onNext={onNext}
            />
          )}
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

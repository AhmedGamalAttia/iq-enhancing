"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { Locale } from "@/i18n/config";
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
import { track } from "@/lib/analytics";
import { HonestyNote } from "@/components/honesty-note";
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

// ---------------------------- resume support ----------------------------
// Leaving mid-assessment used to throw away every answer. The run is small
// enough to snapshot after each item, so a closed tab or a stray back-swipe
// costs nothing.
const LS_RUN = "cog:diagnostic:inprogress";
const RUN_TTL_MS = 24 * 60 * 60 * 1000;

interface SavedRun {
  locale: Locale;
  step: number;
  thetas: Record<string, number>;
  seen: Record<string, string[]>;
  items: DiagnosticItem[];
  schedule: SkillKey[];
  abstractSeen: number;
  savedAt: number;
}

function readRun(): SavedRun | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(LS_RUN);
    if (!raw) return null;
    const run = JSON.parse(raw) as SavedRun;
    if (!run?.schedule?.length || run.step <= 0) return null;
    if (Date.now() - run.savedAt > RUN_TTL_MS) return null;
    return run;
  } catch {
    return null;
  }
}

function clearRun(): void {
  try {
    localStorage.removeItem(LS_RUN);
  } catch {
    /* ignore */
  }
}

export default function DiagnosticPage() {
  const router = useRouter();
  const { t, locale } = useI18n();
  const [phase, setPhase] = useState<"intro" | "running" | "saving">("intro");
  const [step, setStep] = useState(0);
  const [current, setCurrent] = useState<Item | null>(null);
  const [saved, setSaved] = useState<SavedRun | null>(null);

  const thetas = useRef<Record<SkillKey, number>>(initThetas());
  const seen = useRef<Record<SkillKey, Set<string>>>(initSeen());
  const items = useRef<DiagnosticItem[]>([]);
  const schedule = useRef<SkillKey[]>([]);
  const abstractSeen = useRef(0);
  const shownAt = useRef<number>(0);
  const recent = useRef<Set<string>>(new Set());
  // The language the run STARTED in. Switching mid-assessment used to mix
  // Arabic and English items into one estimate.
  const runLocale = useRef<Locale>(locale);

  useEffect(() => setSaved(readRun()), []);

  function persistRun() {
    try {
      const run: SavedRun = {
        locale: runLocale.current,
        step: step + 1,
        thetas: thetas.current,
        seen: Object.fromEntries(
          Object.entries(seen.current).map(([k, v]) => [k, [...v]]),
        ),
        items: items.current,
        schedule: schedule.current,
        abstractSeen: abstractSeen.current,
        savedAt: Date.now(),
      };
      localStorage.setItem(LS_RUN, JSON.stringify(run));
    } catch {
      /* storage blocked — the run still works, it just can't be resumed */
    }
  }

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
      questionsBySkill(skill, runLocale.current),
      seen.current[skill],
      thetas.current[skill],
      recent.current,
    );
    return q ? { kind: "text", q } : null;
  }

  function start() {
    track("diagnostic_start", locale);
    clearRun();
    setSaved(null);
    runLocale.current = locale;
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

  function resume(run: SavedRun) {
    track("diagnostic_resume", locale);
    runLocale.current = run.locale;
    thetas.current = { ...initThetas(), ...run.thetas } as Record<SkillKey, number>;
    seen.current = Object.fromEntries(
      SKILL_ORDER.map((k) => [k, new Set(run.seen[k] ?? [])]),
    ) as Record<SkillKey, Set<string>>;
    items.current = run.items;
    schedule.current = run.schedule;
    abstractSeen.current = run.abstractSeen;
    recent.current = new Set(getRecentQuestionIds());
    const next = pickFor(run.step);
    if (!next) {
      start();
      return;
    }
    setStep(run.step);
    setCurrent(next);
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
    persistRun();
    setStep(nextStep);
    setCurrent(next);
    shownAt.current = Date.now();
  }

  async function finish() {
    setPhase("saving");
    track("diagnostic_finish", locale);
    clearRun();
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
                  color: SKILLS[k].accentText,
                  borderColor: `${SKILLS[k].accent}55`,
                  background: `${SKILLS[k].accent}14`,
                }}
              >
                <span>{SKILLS[k].icon}</span> {t.skills[k].name}
              </span>
            ))}
          </div>
          <HonestyNote variant="full" className="mx-auto mb-6 max-w-md" />

          {saved ? (
            <div className="mx-auto max-w-sm rounded-xl border border-brand/30 bg-brand-soft p-4">
              <p className="mb-1 font-bold text-brand-ink">
                {t.diagnostic.resumeTitle}
              </p>
              <p className="mb-4 text-sm text-fg-muted">
                {t.diagnostic.resumeBody(saved.step, TOTAL)}
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Button onClick={() => resume(saved)}>
                  {t.diagnostic.resume}
                </Button>
                <Button variant="outline" onClick={start}>
                  {t.diagnostic.restart}
                </Button>
              </div>
            </div>
          ) : (
            <Button size="lg" onClick={start}>
              {t.diagnostic.start}
            </Button>
          )}
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
          {locale !== runLocale.current && (
            <p className="mb-3 rounded-lg border border-warning/30 bg-warning/10 px-3 py-2 text-xs text-fg-muted">
              {t.diagnostic.localeLocked}
            </p>
          )}
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

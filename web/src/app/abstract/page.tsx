"use client";

import { useRef, useState } from "react";
import type { AbstractItem } from "@/lib/abstract/types";
import { generateAbstractItem, typeForStep } from "@/lib/abstract/generate";
import {
  ABS_START,
  abstractScore,
  abstractTargetDifficulty,
  updateAbstractTheta,
} from "@/lib/abstract/adaptive";
import { scoreBand } from "@/lib/diagnostic";
import { logPracticeToday } from "@/lib/data";
import { useI18n } from "@/i18n/context";
import { track } from "@/lib/analytics";
import { HonestyNote } from "@/components/honesty-note";
import { AbstractQuestionCard } from "@/components/abstract-question-card";
import { Badge, Button, ButtonLink, Card, ProgressBar } from "@/components/ui";

const SESSION = 14;

export default function AbstractPage() {
  const { t, locale } = useI18n();
  const [phase, setPhase] = useState<"intro" | "running" | "done">("intro");
  const [step, setStep] = useState(0);
  const [current, setCurrent] = useState<AbstractItem | null>(null);
  const [liveScore, setLiveScore] = useState(abstractScore(ABS_START));
  const [finalScore, setFinalScore] = useState(0);

  const thetaRef = useRef(ABS_START);
  const stats = useRef({ correct: 0, answered: 0 });

  function makeItem(s: number): AbstractItem {
    return generateAbstractItem(typeForStep(s), abstractTargetDifficulty(thetaRef.current));
  }

  function start() {
    track("abstract_start", locale);
    thetaRef.current = ABS_START;
    stats.current = { correct: 0, answered: 0 };
    setStep(0);
    setLiveScore(abstractScore(ABS_START));
    setCurrent(makeItem(0));
    setPhase("running");
  }

  function finish() {
    const score = abstractScore(thetaRef.current);
    setFinalScore(score);
    logPracticeToday();
    setPhase("done");
  }

  function onNext(correct: boolean) {
    if (!current) return;
    stats.current.answered += 1;
    if (correct) stats.current.correct += 1;
    thetaRef.current = updateAbstractTheta(
      thetaRef.current,
      current.difficulty,
      correct,
      step,
    );
    setLiveScore(abstractScore(thetaRef.current));

    const next = step + 1;
    if (next >= SESSION) {
      finish();
      return;
    }
    setStep(next);
    setCurrent(makeItem(next));
  }

  const band = scoreBand(finalScore);

  return (
    <div className="mx-auto max-w-xl px-4 py-10 md:px-6">
      {phase === "intro" && (
        <Card className="animate-rise p-8 text-center">
          <div className="mb-4 text-5xl">◈</div>
          <h1 className="mb-2 text-2xl font-bold">{t.abstract.title}</h1>
          <p className="mx-auto mb-4 max-w-md leading-relaxed text-fg-muted">
            {t.abstract.intro}
          </p>
          <p className="mb-6 text-sm text-fg-faint">{t.abstract.patternsNote}</p>
          <Button size="lg" onClick={start}>
            {t.abstract.start}
          </Button>
        </Card>
      )}

      {phase === "running" && current && (
        <>
          <div className="mb-4 flex items-center justify-between gap-3">
            <Badge tone="brand">{t.abstract.levelNow(liveScore)}</Badge>
            <div className="h-2 w-32 overflow-hidden rounded-full bg-surface-2">
              <div
                className="h-full rounded-full bg-brand transition-[width] duration-500"
                style={{ width: `${Math.round((step / SESSION) * 100)}%` }}
              />
            </div>
          </div>
          <AbstractQuestionCard
            key={current.id}
            item={current}
            index={step}
            total={SESSION}
            mode="learn"
            onNext={(correct) => onNext(correct)}
          />
        </>
      )}

      {phase === "done" && (
        <Card className="animate-rise p-8 text-center">
          <div className="mb-2 text-4xl">◈</div>
          <h2 className="mb-4 text-xl font-bold">{t.abstract.doneTitle}</h2>

          <p className="mb-1 text-sm text-fg-faint">{t.abstract.estimatedLevel}</p>
          <div className="mb-2 text-5xl font-extrabold text-brand-ink">
            {t.num(finalScore)}
            <span className="text-lg text-fg-faint">/{t.num(100)}</span>
          </div>
          <Badge tone={band.tone}>{t.bands[band.key]}</Badge>

          <ProgressBar value={finalScore} className="mx-auto mt-4 max-w-xs" />

          <p className="mt-4 mb-6 text-fg-muted">
            {t.abstract.accuracy(stats.current.correct, stats.current.answered)}
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            <Button onClick={start}>{t.abstract.again}</Button>
            <ButtonLink href="/practice" variant="outline">
              {t.abstract.toPractice}
            </ButtonLink>
          </div>

          <HonestyNote className="mt-6" />
        </Card>
      )}
    </div>
  );
}

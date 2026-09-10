"use client";

import { useMemo, useState } from "react";
import type { Question } from "@/lib/types";
import { SKILLS } from "@/data/skills";
import { seededOrder } from "@/lib/shuffle";
import { useI18n } from "@/i18n/context";
import { Button, Card, cn } from "@/components/ui";

export function QuestionCard({
  question,
  index,
  total,
  mode,
  onNext,
}: {
  question: Question;
  index: number;
  total: number;
  mode: "assess" | "learn";
  onNext: (correct: boolean, chosenIndex: number) => void;
}) {
  const { t, locale } = useI18n();
  const [chosen, setChosen] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [aiText, setAiText] = useState<string | null>(null);
  const [aiState, setAiState] = useState<"idle" | "loading" | "off">("idle");

  const meta = SKILLS[question.skill];
  const skillName = t.skills[question.skill].name;

  // Options are shown in a shuffled order so the bank's answer-position bias
  // can't be exploited. `chosen` is a DISPLAY index; `order[chosen]` maps back
  // to the original index used for scoring and logging.
  const order = useMemo(
    () => seededOrder(question.choices.length, question.id),
    [question.id, question.choices.length],
  );
  const displayChoices = order.map((i) => question.choices[i]);
  const correctDisplay = order.indexOf(question.answer);
  const correct = chosen !== null && chosen === correctDisplay;

  function choose(i: number) {
    if (revealed) return;
    setChosen(i);
    if (mode === "learn") setRevealed(true);
  }

  function handleNext() {
    if (chosen === null) return;
    onNext(chosen === correctDisplay, order[chosen]);
  }

  async function explainWithAI() {
    setAiState("loading");
    try {
      const res = await fetch("/api/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stem: question.stem,
          choices: displayChoices,
          correctText: question.choices[question.answer],
          chosenText: chosen !== null ? displayChoices[chosen] : undefined,
          skill: question.skill,
          locale,
        }),
      });
      const data = await res.json();
      if (!data.available) {
        setAiState("off");
        return;
      }
      setAiText(data.explanation ?? data.error ?? "");
      setAiState("idle");
    } catch {
      setAiState("idle");
      setAiText(t.question.aiConnectError);
    }
  }

  return (
    <Card className="animate-pop p-6 md:p-8">
      <div className="mb-5 flex items-center justify-between gap-3">
        <span
          className="inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold"
          style={{
            color: meta.accent,
            borderColor: `${meta.accent}55`,
            background: `${meta.accent}14`,
          }}
        >
          <span>{meta.icon}</span> {skillName}
        </span>
        <span className="text-sm text-fg-faint">
          {t.question.progress(index + 1, total, question.difficulty)}
        </span>
      </div>

      <h2 className="mb-6 text-xl font-bold leading-relaxed md:text-2xl">
        {question.stem}
      </h2>

      <div className="grid gap-3">
        {displayChoices.map((choice, i) => {
          const isChosen = chosen === i;
          const isCorrect = i === correctDisplay;
          const showState = revealed;
          return (
            <button
              key={i}
              onClick={() => choose(i)}
              disabled={revealed}
              className={cn(
                "flex items-center gap-3 rounded-xl border p-4 text-start text-base transition-all",
                "hover:border-brand/50 hover:bg-surface-2",
                !showState && isChosen && "border-brand bg-brand-soft",
                showState && isCorrect && "border-success bg-success/10",
                showState &&
                  isChosen &&
                  !isCorrect &&
                  "border-danger bg-danger/10",
                showState && !isChosen && !isCorrect && "opacity-60",
                "disabled:pointer-events-none",
              )}
            >
              <span
                className={cn(
                  "grid h-7 w-7 shrink-0 place-items-center rounded-lg border text-sm font-bold",
                  isChosen ? "border-brand text-brand" : "border-border text-fg-faint",
                )}
              >
                {t.question.letters[i] ?? i + 1}
              </span>
              <span className="flex-1">{choice}</span>
              {showState && isCorrect && <span className="text-success">✓</span>}
              {showState && isChosen && !isCorrect && (
                <span className="text-danger">✗</span>
              )}
            </button>
          );
        })}
      </div>

      {revealed && (
        <div className="mt-5 animate-rise rounded-xl border border-border-soft bg-surface-2/60 p-4">
          <p className="mb-1 text-sm font-bold">
            {correct ? t.question.correct : t.question.incorrect}
          </p>
          <p className="text-sm leading-relaxed text-fg-muted">
            {question.explanation}
          </p>

          {aiText && (
            <div className="mt-3 rounded-lg border border-brand/30 bg-brand-soft p-3">
              <p className="mb-1 text-xs font-bold text-brand">
                {t.question.aiExtraTitle}
              </p>
              <p className="text-sm leading-relaxed text-fg">{aiText}</p>
            </div>
          )}

          {aiState !== "off" && !aiText && (
            <button
              onClick={explainWithAI}
              disabled={aiState === "loading"}
              className="mt-3 text-sm font-semibold text-brand hover:underline disabled:opacity-50"
            >
              {aiState === "loading" ? t.question.generating : t.question.explainAI}
            </button>
          )}
        </div>
      )}

      <div className="mt-6 flex justify-end">
        <Button onClick={handleNext} disabled={chosen === null} size="lg">
          {index + 1 === total ? t.question.finish : t.question.next}
        </Button>
      </div>
    </Card>
  );
}

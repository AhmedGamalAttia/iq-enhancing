"use client";

import { useState } from "react";
import type { AbstractItem } from "@/lib/abstract/types";
import { useI18n } from "@/i18n/context";
import { AbstractFigure, MissingCell } from "@/components/abstract-figure";
import { Button, Card, cn } from "@/components/ui";

export function AbstractQuestionCard({
  item,
  index,
  total,
  mode,
  onNext,
}: {
  item: AbstractItem;
  index: number;
  total: number;
  mode: "assess" | "learn";
  onNext: (correct: boolean, chosenIndex: number) => void;
}) {
  const { t } = useI18n();
  const [chosen, setChosen] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  const correct = chosen !== null && chosen === item.answer;

  const instruction =
    item.type === "sequence"
      ? t.abstract.instrSequence
      : item.type === "matrix"
        ? t.abstract.instrMatrix
        : t.abstract.instrOddone;

  function choose(i: number) {
    if (revealed) return;
    setChosen(i);
    if (mode === "learn") setRevealed(true);
  }

  function handleNext() {
    if (chosen === null) return;
    onNext(chosen === item.answer, chosen);
  }

  return (
    <Card className="animate-pop p-6 md:p-8">
      <div className="mb-4 flex items-center justify-between gap-3">
        <span className="text-sm font-semibold">{instruction}</span>
        <span dir="ltr" className="text-sm text-fg-faint">
          {t.abstract.progress(index + 1, total)}
        </span>
      </div>

      {/* Prompt */}
      {item.type === "sequence" && (
        <div dir="ltr" className="mb-6 flex flex-wrap items-center justify-center gap-2">
          {item.prompt.map((cell, i) => (
            <AbstractFigure key={i} cell={cell} size={58} />
          ))}
          <span className="text-xl text-fg-faint">→</span>
          <MissingCell size={58} />
        </div>
      )}

      {item.type === "matrix" && (
        <div dir="ltr" className="mb-6 flex justify-center">
          <div className="grid grid-cols-3 gap-2">
            {Array.from({ length: 9 }).map((_, i) =>
              i < 8 ? (
                <AbstractFigure key={i} cell={item.prompt[i]} size={62} />
              ) : (
                <MissingCell key={i} size={62} />
              ),
            )}
          </div>
        </div>
      )}

      {/* Options */}
      <div className="grid grid-cols-4 gap-3">
        {item.options.map((cell, i) => {
          const isChosen = chosen === i;
          const isCorrect = i === item.answer;
          const show = revealed;
          return (
            <button
              key={i}
              onClick={() => choose(i)}
              disabled={revealed}
              className={cn(
                "grid place-items-center rounded-xl border p-2 transition-all",
                "hover:border-brand/60 hover:bg-surface-2",
                !show && isChosen && "border-brand bg-brand-soft",
                show && isCorrect && "border-success bg-success/10",
                show && isChosen && !isCorrect && "border-danger bg-danger/10",
                show && !isChosen && !isCorrect && "opacity-55",
                !show && !isChosen && "border-border-soft",
                "disabled:pointer-events-none",
              )}
            >
              <AbstractFigure cell={cell} size={62} />
            </button>
          );
        })}
      </div>

      {revealed && (
        <p className="mt-4 text-sm font-bold">
          {correct ? t.abstract.correct : t.abstract.incorrect}
        </p>
      )}

      <div className="mt-6 flex justify-end">
        <Button onClick={handleNext} disabled={chosen === null} size="lg">
          {index + 1 === total ? t.abstract.finish : t.abstract.next}
        </Button>
      </div>
    </Card>
  );
}

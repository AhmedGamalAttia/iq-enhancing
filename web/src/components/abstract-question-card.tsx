"use client";

import { useState } from "react";
import type { AbstractItem } from "@/lib/abstract/types";
import { describeCell } from "@/lib/abstract/describe";
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
    <Card className="animate-pop p-5 md:p-8">
      <div className="mb-4 flex items-center justify-between gap-3">
        <span className="text-sm font-semibold">{instruction}</span>
        <span dir="ltr" className="shrink-0 text-sm text-fg-faint">
          {t.abstract.progress(index + 1, total)}
        </span>
      </div>

      {/* Prompt */}
      {item.type === "sequence" && (
        <div
          dir="ltr"
          aria-hidden="true"
          className="mb-6 flex items-center justify-center gap-1.5 sm:gap-2"
        >
          {/* Sized in CSS so five tiles + the arrow stay on ONE row at 360px;
              wrapping used to drop the "?" tile onto a line of its own. */}
          {item.prompt.map((cell, i) => (
            <AbstractFigure
              key={i}
              cell={cell}
              size={58}
              className="h-11 w-11 shrink-0 sm:h-[58px] sm:w-[58px]"
            />
          ))}
          <span className="shrink-0 text-lg text-fg-faint">→</span>
          <MissingCell
            size={58}
            className="h-11 w-11 shrink-0 sm:h-[58px] sm:w-[58px]"
          />
        </div>
      )}

      {item.type === "matrix" && (
        <div dir="ltr" aria-hidden="true" className="mb-6 flex justify-center">
          <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
            {Array.from({ length: 9 }).map((_, i) =>
              i < 8 ? (
                <AbstractFigure
                  key={i}
                  cell={item.prompt[i]}
                  size={62}
                  className="h-[62px] w-[62px] max-[360px]:h-14 max-[360px]:w-14"
                />
              ) : (
                <MissingCell
                  key={i}
                  size={62}
                  className="h-[62px] w-[62px] max-[360px]:h-14 max-[360px]:w-14"
                />
              ),
            )}
          </div>
        </div>
      )}

      {/* The same prompt as text, for screen readers only. Without it the item
          is unanswerable without sight. */}
      {item.prompt.length > 0 && (
        <div className="sr-only">
          <h3>{t.abstractA11y.promptTitle}</h3>
          <ol>
            {item.prompt.map((cell, i) => (
              <li key={i}>
                {item.type === "matrix"
                  ? t.abstractA11y.matrixCellAt(
                      Math.floor(i / 3) + 1,
                      (i % 3) + 1,
                      describeCell(cell, t),
                    )
                  : t.abstractA11y.promptStep(i + 1, describeCell(cell, t))}
              </li>
            ))}
            <li>{t.abstractA11y.emptyCell}</li>
          </ol>
        </div>
      )}

      {/* Options — two per row on phones so the fourth is never off-screen. */}
      <h3 className="sr-only">{t.abstractA11y.optionsTitle}</h3>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {item.options.map((cell, i) => {
          const isChosen = chosen === i;
          const isCorrect = i === item.answer;
          const show = revealed;
          const letter = t.question.letters[i] ?? String(i + 1);
          return (
            <button
              key={i}
              onClick={() => choose(i)}
              disabled={revealed}
              aria-pressed={isChosen}
              aria-label={t.a11y.optionLetter(letter, describeCell(cell, t))}
              className={cn(
                "relative grid min-h-20 place-items-center rounded-xl border p-2 transition-all",
                "hover:border-brand/60 hover:bg-surface-2",
                !show && isChosen && "border-brand bg-brand-soft",
                show && isCorrect && "border-success bg-success/10",
                show && isChosen && !isCorrect && "border-danger bg-danger/10",
                show && !isChosen && !isCorrect && "opacity-55",
                !show && !isChosen && "border-border-soft",
                "disabled:pointer-events-none",
              )}
            >
              {/* A visible letter so the choice can be named out loud, and so
                  identity never rests on colour alone. */}
              <span
                aria-hidden="true"
                className={cn(
                  "absolute top-1.5 start-1.5 text-[11px] font-bold",
                  isChosen ? "text-brand-ink" : "text-fg-faint",
                )}
              >
                {letter}
              </span>
              <AbstractFigure cell={cell} size={62} />
            </button>
          );
        })}
      </div>

      {revealed && (
        <p className="mt-4 text-sm font-bold" role="status">
          {correct ? t.abstract.correct : t.abstract.incorrect}
        </p>
      )}

      {/* Sticky on phones: the Next button used to sit below the fold on every
          single item, with the daily-challenge clock running. */}
      <div className="sticky bottom-0 -mx-5 mt-6 flex justify-end border-t border-border-soft bg-surface/95 px-5 py-3 backdrop-blur md:static md:mx-0 md:border-0 md:bg-transparent md:p-0">
        <Button
          onClick={handleNext}
          disabled={chosen === null}
          size="lg"
          className="w-full md:w-auto"
        >
          {index + 1 === total ? t.abstract.finish : t.abstract.next}
        </Button>
      </div>
    </Card>
  );
}

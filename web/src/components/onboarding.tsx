"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/i18n/context";
import { Button, Card, cn } from "@/components/ui";

const FLAG = "cog:onboarded";

export function Onboarding() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    try {
      if (!localStorage.getItem(FLAG)) setOpen(true);
    } catch {
      /* ignore */
    }
  }, []);

  function dismiss() {
    try {
      localStorage.setItem(FLAG, "1");
    } catch {
      /* ignore */
    }
    setOpen(false);
  }

  if (!open) return null;

  const steps = t.onboarding.steps;
  const isLast = step === steps.length - 1;
  const current = steps[step];

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-sm">
      <Card className="w-full max-w-md p-8 text-center animate-pop">
        <div className="mb-4 text-5xl">{current.icon}</div>
        <h2 className="mb-3 text-2xl font-bold">{current.title}</h2>
        <p className="mx-auto mb-6 max-w-sm leading-relaxed text-fg-muted">
          {current.body}
        </p>

        <div className="mb-6 flex justify-center gap-2">
          {steps.map((_, i) => (
            <span
              key={i}
              className={cn(
                "h-2 rounded-full transition-all",
                i === step ? "w-6 bg-brand" : "w-2 bg-surface-2",
              )}
            />
          ))}
        </div>

        <div className="flex items-center justify-between gap-3">
          {step > 0 ? (
            <Button variant="ghost" size="sm" onClick={() => setStep(step - 1)}>
              {t.onboarding.back}
            </Button>
          ) : (
            <Button variant="ghost" size="sm" onClick={dismiss}>
              {t.onboarding.skip}
            </Button>
          )}

          {isLast ? (
            <Button onClick={dismiss}>{t.onboarding.start}</Button>
          ) : (
            <Button onClick={() => setStep(step + 1)}>{t.onboarding.next}</Button>
          )}
        </div>
      </Card>
    </div>
  );
}

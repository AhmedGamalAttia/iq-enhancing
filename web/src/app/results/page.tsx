"use client";

import { useEffect, useMemo, useState } from "react";
import type { DiagnosticResult, SkillEstimate, SkillKey } from "@/lib/types";
import { getDiagnosticHistory, getLatestDiagnostic } from "@/lib/data";
import { getWorkingMemory, type WorkingMemoryResult } from "@/lib/wm";
import { isReliable, scoreBand, scoreRange } from "@/lib/diagnostic";
import { SKILLS } from "@/data/skills";
import { useI18n } from "@/i18n/context";
import { HonestyNote } from "@/components/honesty-note";
import { ProgressTrend } from "@/components/progress-trend";
import { Badge, ButtonLink, Card, ProgressBar } from "@/components/ui";

export default function ResultsPage() {
  const { t, locale } = useI18n();
  const [result, setResult] = useState<DiagnosticResult | null>(null);
  const [history, setHistory] = useState<DiagnosticResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [wm, setWm] = useState<WorkingMemoryResult | null>(null);

  useEffect(() => {
    Promise.all([getLatestDiagnostic(), getDiagnosticHistory()])
      .then(([r, h]) => {
        setResult(r);
        setHistory(h);
      })
      .finally(() => setLoading(false));
    setWm(getWorkingMemory());
  }, []);

  const estimates = useMemo(
    () =>
      result
        ? (Object.values(result.estimates).filter(Boolean) as SkillEstimate[])
            // working_memory gets its own card below, fed by the n-back task;
            // older saved results may still carry a bank-derived estimate.
            .filter((e) => e.skill !== "working_memory")
        : [],
    [result],
  );

  // Only skills with enough items may drive the recommendation — otherwise the
  // advice is decided by how many questions a skill got, not by ability.
  const weakest = useMemo(() => {
    const reliable = estimates.filter(isReliable);
    if (reliable.length === 0) return null;
    return [...reliable].sort((a, b) => a.score - b.score)[0];
  }, [estimates]);

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center text-fg-muted">
        {t.results.loading}
      </div>
    );
  }

  if (!result || estimates.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 md:px-6">
        <Card className="p-10 text-center">
          <div className="mb-3 text-4xl">🧭</div>
          <h1 className="mb-2 text-xl font-bold">{t.results.noResultsTitle}</h1>
          <p className="mb-6 text-fg-muted">{t.results.noResultsBody}</p>
          <ButtonLink href="/diagnostic" size="lg">
            {t.results.startAssessment}
          </ButtonLink>
        </Card>
      </div>
    );
  }

  const finishedAt = new Date(result.finishedAt).toLocaleString(
    locale === "ar" ? "ar-EG" : "en-US",
    { dateStyle: "medium", timeStyle: "short" },
  );

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:px-6">
      <header className="mb-8">
        <h1 className="text-2xl font-bold md:text-3xl">{t.results.title}</h1>
        <p className="mt-1 text-sm text-fg-faint">
          {t.results.lastAssessment(finishedAt)}
        </p>
      </header>

      <div className="grid gap-4">
        {estimates.map((est) => {
          const skill = SKILLS[est.skill as SkillKey];
          const meta = t.skills[est.skill as SkillKey];
          const band = scoreBand(est.score);
          const reliable = isReliable(est);
          const range = scoreRange(est);
          return (
            <Card key={est.skill} className="animate-rise p-6">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{skill.icon}</span>
                  <div>
                    <h2 className="font-bold">{meta.name}</h2>
                    <p className="text-xs text-fg-faint">{meta.tagline}</p>
                  </div>
                </div>
                <div className="text-end">
                  {reliable ? (
                    <>
                      {/* A range, not a point value: a bare number gets read as
                          an IQ, and this engine cannot resolve that finely. */}
                      <div
                        dir="ltr"
                        className="text-2xl font-extrabold"
                        style={{ color: skill.accentText }}
                      >
                        {t.num(range[0])}–{t.num(range[1])}
                      </div>
                      <div className="text-[10px] text-fg-faint">
                        {t.honesty.rangeLabel} {t.results.outOf100}
                      </div>
                      <Badge tone={band.tone}>{t.bands[band.key]}</Badge>
                    </>
                  ) : (
                    <Badge tone="muted">{t.results.lowConfidence}</Badge>
                  )}
                </div>
              </div>
              {reliable && <ProgressBar value={est.score} color={skill.accent} />}
              <p className="mt-2 text-xs text-fg-faint">
                {reliable
                  ? t.results.correctOfTotal(est.correct, est.total)
                  : t.results.lowConfidenceHint}
              </p>
            </Card>
          );
        })}
      </div>

      {/* Working memory is measured by the n-back task, not by the item bank —
          a printed digit span that stays on screen tests reading, not holding. */}
      <Card className="mt-4 p-6">
        <div className="mb-2 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{SKILLS.working_memory.icon}</span>
            <h2 className="font-bold">{t.results.wmTitle}</h2>
          </div>
          {wm ? (
            <div className="text-end">
              <div
                dir="ltr"
                className="font-extrabold"
                style={{ color: SKILLS.working_memory.accentText }}
              >
                {t.results.wmMeasured(wm.n, wm.score)}
              </div>
              <div className="text-[10px] text-fg-faint">
                {t.results.wmAt(
                  new Date(wm.at).toLocaleDateString(
                    locale === "ar" ? "ar-EG" : "en-US",
                    { dateStyle: "medium" },
                  ),
                )}
              </div>
            </div>
          ) : (
            <Badge tone="muted">{t.results.wmNotMeasured}</Badge>
          )}
        </div>
        <p className="mb-3 text-xs leading-relaxed text-fg-muted">
          {t.results.wmWhy}
        </p>
        <ButtonLink href="/nback" variant="outline" size="sm">
          {t.results.wmCta}
        </ButtonLink>
      </Card>

      {weakest && (
        <Card className="mt-6 border-brand/30 bg-brand-soft p-6">
          <p className="mb-1 text-sm font-bold text-brand-ink">
            {t.results.recommendationTitle}
          </p>
          <p className="leading-relaxed text-fg">
            {t.results.recommendationBody(t.skills[weakest.skill as SkillKey].name)}
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <ButtonLink href="/practice">{t.results.startTraining}</ButtonLink>
            <ButtonLink href="/diagnostic" variant="outline">
              {t.results.retake}
            </ButtonLink>
          </div>
        </Card>
      )}

      <ProgressTrend history={history} />

      <HonestyNote variant="full" className="mt-6" />
    </div>
  );
}

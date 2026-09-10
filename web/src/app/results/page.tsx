"use client";

import { useEffect, useMemo, useState } from "react";
import type { DiagnosticResult, SkillEstimate, SkillKey } from "@/lib/types";
import { getDiagnosticHistory, getLatestDiagnostic } from "@/lib/data";
import { isReliable, scoreBand } from "@/lib/diagnostic";
import { SKILLS } from "@/data/skills";
import { useI18n } from "@/i18n/context";
import { ProgressTrend } from "@/components/progress-trend";
import { Badge, ButtonLink, Card, ProgressBar } from "@/components/ui";

export default function ResultsPage() {
  const { t, locale } = useI18n();
  const [result, setResult] = useState<DiagnosticResult | null>(null);
  const [history, setHistory] = useState<DiagnosticResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getLatestDiagnostic(), getDiagnosticHistory()])
      .then(([r, h]) => {
        setResult(r);
        setHistory(h);
      })
      .finally(() => setLoading(false));
  }, []);

  const estimates = useMemo(
    () =>
      result
        ? (Object.values(result.estimates).filter(Boolean) as SkillEstimate[])
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
                      <div
                        dir="ltr"
                        className="text-2xl font-extrabold"
                        style={{ color: skill.accentText }}
                      >
                        {est.score}
                        <span className="text-sm text-fg-faint">
                          {t.results.outOf100}
                        </span>
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

      <p className="mt-6 text-center text-xs leading-relaxed text-fg-faint">
        {t.diagnostic.notIQ}
      </p>
    </div>
  );
}

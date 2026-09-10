"use client";

import { useEffect, useState, type ReactNode } from "react";
import type { DiagnosticResult, SkillEstimate, SkillKey } from "@/lib/types";
import {
  getLatestDiagnostic,
  getPracticeDays,
  getReviewCards,
} from "@/lib/data";
import { questionById } from "@/data/questions";
import { isDue } from "@/lib/fsrs";
import {
  REASSESS_INTERVAL_DAYS,
  computeStreak,
  daysSince,
} from "@/lib/progress";
import { SKILLS } from "@/data/skills";
import { useI18n } from "@/i18n/context";
import { Onboarding } from "@/components/onboarding";
import { Badge, ButtonLink, Card, ProgressBar, cn } from "@/components/ui";

type StageKey = "assess" | "practice" | "reassess";

export default function JourneyPage() {
  const { t, locale } = useI18n();
  const [loading, setLoading] = useState(true);
  const [diagnostic, setDiagnostic] = useState<DiagnosticResult | null>(null);
  const [dueCount, setDueCount] = useState(0);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    async function load() {
      const [diag, cards] = await Promise.all([
        getLatestDiagnostic(),
        getReviewCards(),
      ]);
      const due = cards.filter((c) => {
        if (!isDue(c)) return false;
        const q = questionById(c.questionId);
        return q ? (q.locale ?? "ar") === locale : false;
      });
      setDiagnostic(diag);
      setDueCount(due.length);
      setStreak(computeStreak(getPracticeDays()));
      setLoading(false);
    }
    void load();
  }, [locale]);

  const hasDiag = !!diagnostic;
  const dsince = diagnostic ? daysSince(diagnostic.finishedAt) : 0;
  const reassessReady = hasDiag && dsince >= REASSESS_INTERVAL_DAYS;
  const reassessInDays = Math.max(0, REASSESS_INTERVAL_DAYS - dsince);

  const nextStep: StageKey = !hasDiag
    ? "assess"
    : reassessReady
      ? "reassess"
      : "practice";

  const estimates = diagnostic
    ? (Object.values(diagnostic.estimates).filter(Boolean) as SkillEstimate[])
    : [];

  const finishedAt = diagnostic
    ? new Date(diagnostic.finishedAt).toLocaleDateString(
        locale === "ar" ? "ar-EG" : "en-US",
        { dateStyle: "medium" },
      )
    : "";

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 md:px-6">
      <Onboarding />

      <header className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">{t.journey.title}</h1>
          <p className="mt-1 text-sm text-fg-muted">{t.journey.subtitle}</p>
        </div>
        <Badge tone={streak > 0 ? "warning" : "muted"}>
          {streak > 0 ? t.journey.streak(streak) : t.journey.noStreak}
        </Badge>
      </header>

      <Card className="mb-4 flex items-center justify-between gap-3 border-brand/30 bg-brand-soft p-4">
        <div>
          <p className="font-bold">🏆 {t.daily.title}</p>
          <p className="text-xs text-fg-faint">{t.daily.cardHint}</p>
        </div>
        <ButtonLink href="/daily" size="sm">
          {t.daily.start}
        </ButtonLink>
      </Card>

      {loading ? (
        <p className="py-10 text-center text-fg-muted">{t.results.loading}</p>
      ) : (
        <div className="grid gap-4">
          {/* Stage 1 — Assess */}
          <Stage
            icon="🧭"
            title={t.journey.assessTitle}
            desc={t.journey.assessDesc}
            active={nextStep === "assess"}
            activeBadge={t.journey.nextStepBadge}
          >
            {hasDiag ? (
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="text-sm text-fg-faint">
                  {t.journey.assessDoneAt(finishedAt)}
                </span>
                <Badge tone="success">{t.journey.done}</Badge>
              </div>
            ) : (
              <ButtonLink href="/diagnostic">{t.journey.assessCta}</ButtonLink>
            )}
          </Stage>

          {/* Stage 2 — Practice */}
          <Stage
            icon="🔁"
            title={t.journey.practiceTitle}
            desc={t.journey.practiceDesc}
            active={nextStep === "practice"}
            activeBadge={t.journey.nextStepBadge}
            locked={!hasDiag}
          >
            <p className="mb-3 text-sm font-semibold">
              {dueCount > 0 ? t.journey.dueToday(dueCount) : t.journey.noDueToday}
            </p>
            <ButtonLink href="/practice">{t.journey.practiceCta}</ButtonLink>
            <div className="mt-3 flex flex-wrap gap-2">
              <ButtonLink href="/abstract" variant="outline" size="sm">
                ◈ {t.abstract.title}
              </ButtonLink>
              <ButtonLink href="/nback" variant="outline" size="sm">
                🧠 {t.nback.title}
              </ButtonLink>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-fg-faint">
              {t.journey.cadence}
            </p>
          </Stage>

          {/* Stage 3 — Progress */}
          <Stage
            icon="📈"
            title={t.journey.progressTitle}
            desc={t.journey.progressDesc}
            locked={!hasDiag}
          >
            {estimates.length > 0 && (
              <div className="mb-4 grid gap-2">
                {estimates.map((est) => {
                  const skill = SKILLS[est.skill as SkillKey];
                  return (
                    <div key={est.skill} className="flex items-center gap-3">
                      <span className="w-6 text-center">{skill.icon}</span>
                      <span className="w-28 shrink-0 truncate text-xs text-fg-muted">
                        {t.skills[est.skill as SkillKey].name}
                      </span>
                      <ProgressBar value={est.score} color={skill.accent} className="flex-1" />
                      <span className="w-8 text-end text-xs font-bold" style={{ color: skill.accent }}>
                        {est.score}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
            <ButtonLink href="/results" variant="outline">
              {t.journey.progressCta}
            </ButtonLink>
          </Stage>

          {/* Stage 4 — Re-assess */}
          <Stage
            icon="🔄"
            title={t.journey.reassessTitle}
            desc={t.journey.reassessDesc}
            active={nextStep === "reassess"}
            activeBadge={t.journey.nextStepBadge}
            locked={!hasDiag}
          >
            {reassessReady ? (
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-sm font-semibold text-brand">
                  {t.journey.reassessReady}
                </span>
                <ButtonLink href="/diagnostic">{t.journey.reassessCta}</ButtonLink>
              </div>
            ) : (
              <span className="text-sm text-fg-faint">
                {t.journey.reassessIn(reassessInDays)}
              </span>
            )}
          </Stage>
        </div>
      )}
    </div>
  );
}

function Stage({
  icon,
  title,
  desc,
  children,
  active = false,
  activeBadge,
  locked = false,
}: {
  icon: string;
  title: string;
  desc: string;
  children: ReactNode;
  active?: boolean;
  activeBadge?: string;
  locked?: boolean;
}) {
  return (
    <Card
      className={cn(
        "p-6 transition-all",
        active && "border-brand ring-1 ring-brand/40",
        locked && "opacity-55",
      )}
    >
      <div className="mb-2 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-surface-2 text-xl">
            {locked ? "🔒" : icon}
          </span>
          <h2 className="text-lg font-bold">{title}</h2>
        </div>
        {active && activeBadge && <Badge tone="brand">{activeBadge}</Badge>}
      </div>
      <p className="mb-4 text-sm leading-relaxed text-fg-muted">{desc}</p>
      {!locked && children}
    </Card>
  );
}

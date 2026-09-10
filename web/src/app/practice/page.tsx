"use client";

import { useEffect, useRef, useState } from "react";
import type { Question, ReviewCardRecord, SkillKey } from "@/lib/types";
import { QUESTIONS, questionById } from "@/data/questions";
import { SKILL_LIST } from "@/data/skills";
import {
  getLatestDiagnostic,
  getReviewCards,
  logPracticeToday,
  upsertReviewCard,
} from "@/lib/data";
import { hasDoneTodayDaily } from "@/lib/daily";
import { isDue, newCardRecord, reviewCard } from "@/lib/fsrs";
import { useI18n } from "@/i18n/context";
import { QuestionCard } from "@/components/question-card";
import { Badge, Button, ButtonLink, Card } from "@/components/ui";

const SESSION_TARGET = 8;

export default function PracticePage() {
  const { t, locale } = useI18n();
  const [phase, setPhase] = useState<"loading" | "empty" | "running" | "done">(
    "loading",
  );
  const [queue, setQueue] = useState<Question[]>([]);
  const [pos, setPos] = useState(0);
  const [stats, setStats] = useState({ correct: 0, answered: 0 });
  const [aiAvailable, setAiAvailable] = useState(true);
  const [genState, setGenState] = useState<"idle" | "loading">("idle");
  const [genSkill, setGenSkill] = useState<SkillKey>("logical");
  const [genDiff, setGenDiff] = useState(3);
  const [genError, setGenError] = useState<string | null>(null);
  const [dailyDone, setDailyDone] = useState(false);

  const queueRef = useRef<Question[]>([]);
  const cardMap = useRef<Map<string, ReviewCardRecord>>(new Map());

  useEffect(() => {
    void buildSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale]);

  useEffect(() => {
    hasDoneTodayDaily()
      .then(setDailyDone)
      .catch(() => setDailyDone(false));
  }, []);

  async function buildSession() {
    setPhase("loading");
    // A failure here must still land on a real screen: the authored bank is
    // local, so a session can be built even when the cloud is unreachable.
    let cards: ReviewCardRecord[] = [];
    let diagnostic: Awaited<ReturnType<typeof getLatestDiagnostic>> = null;
    try {
      [cards, diagnostic] = await Promise.all([
        getReviewCards(),
        getLatestDiagnostic(),
      ]);
    } catch (err) {
      console.error("[practice] could not load progress", err);
    }
    cardMap.current = new Map(cards.map((c) => [c.questionId, c]));

    // 1) Due spaced-repetition cards in the current language.
    const due = cards
      .filter((c) => isDue(c))
      .map((c) => questionById(c.questionId))
      .filter((q): q is Question => !!q && (q.locale ?? "ar") === locale);

    // 2) Top up with new authored questions, weakest skill first.
    const weakFirst = weakestSkillOrder(diagnostic?.estimates);
    const carded = new Set(cards.map((c) => c.questionId));
    const fresh = QUESTIONS.filter(
      (q) =>
        (q.locale ?? "ar") === locale &&
        !carded.has(q.id) &&
        !due.some((d) => d.id === q.id),
    ).sort((a, b) => {
      const s = weakFirst.indexOf(a.skill) - weakFirst.indexOf(b.skill);
      if (s !== 0) return s;
      return a.difficulty - b.difficulty;
    });

    const session = [...due, ...fresh].slice(0, SESSION_TARGET);
    queueRef.current = session;
    setQueue(session);
    setPos(0);
    setStats({ correct: 0, answered: 0 });
    setPhase(session.length > 0 ? "running" : "empty");
  }

  async function onNext(correct: boolean) {
    logPracticeToday();
    const q = queueRef.current[pos];
    if (q && q.source !== "ai") {
      const existing =
        cardMap.current.get(q.id) ?? newCardRecord(q.id, q.skill);
      const updated = reviewCard(existing, correct);
      cardMap.current.set(q.id, updated);
      await upsertReviewCard(updated);
    }
    setStats((s) => ({
      correct: s.correct + (correct ? 1 : 0),
      answered: s.answered + 1,
    }));

    const nextPos = pos + 1;
    if (nextPos >= queueRef.current.length) {
      setPhase("done");
    } else {
      setPos(nextPos);
    }
  }

  async function generateAI() {
    setGenState("loading");
    setGenError(null);
    try {
      const res = await fetch("/api/generate-practice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          skill: genSkill,
          difficulty: genDiff,
          count: 3,
          locale,
        }),
      });
      const data = await res.json().catch(() => ({}));
      // Only an explicit `available: false` means "no AI configured". A plain
      // 400 used to hide the whole panel for the rest of the session.
      if (data.available === false) {
        setAiAvailable(false);
        return;
      }
      if (data.error || !res.ok) {
        setGenError(data.error ?? t.practice.aiFailed);
        return;
      }
      const newQs: Question[] = data.questions ?? [];
      if (newQs.length) {
        const startIndex = queueRef.current.length;
        const merged = [...queueRef.current, ...newQs];
        queueRef.current = merged;
        setQueue(merged);
        if (phase !== "running") {
          setPos(startIndex);
          setPhase("running");
        }
      }
    } catch {
      // Silence here meant the button just did nothing, forever.
      setGenError(t.practice.aiFailed);
    } finally {
      setGenState("idle");
    }
  }

  const current = queue[pos];

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 md:px-6">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t.practice.title}</h1>
          <p className="text-sm text-fg-faint">{t.practice.subtitle}</p>
        </div>
        {phase === "running" && (
          <Badge tone="brand">
            <span dir="ltr">
              {t.num(pos + 1)} / {t.num(queue.length)}
            </span>
          </Badge>
        )}
      </header>

      <Card className="mb-3 flex items-center justify-between gap-3 border-brand/30 bg-brand-soft p-4">
        <div>
          <p className="font-bold">🏆 {t.daily.title}</p>
          <p className="text-xs text-fg-faint">{t.daily.cardHint}</p>
        </div>
        <ButtonLink href="/daily" size="sm">
          {dailyDone ? t.daily.viewResult : t.daily.start}
        </ButtonLink>
      </Card>

      <Card className="mb-3 flex items-center justify-between gap-3 p-4">
        <div>
          <p className="font-bold">🧠 {t.nback.title}</p>
          <p className="text-xs text-fg-faint">{t.nback.cardHint}</p>
        </div>
        <ButtonLink href="/nback" variant="outline" size="sm">
          {t.nback.start}
        </ButtonLink>
      </Card>

      <Card className="mb-6 flex items-center justify-between gap-3 p-4">
        <div>
          <p className="font-bold">◈ {t.abstract.title}</p>
          <p className="text-xs text-fg-faint">{t.abstract.cardHint}</p>
        </div>
        <ButtonLink href="/abstract" variant="outline" size="sm">
          {t.abstract.start}
        </ButtonLink>
      </Card>

      {phase === "loading" && (
        <p className="py-10 text-center text-fg-muted">{t.practice.loading}</p>
      )}

      {phase === "empty" && (
        <Card className="p-8 text-center">
          <div className="mb-3 text-4xl">🎉</div>
          <h2 className="mb-2 text-lg font-bold">{t.practice.emptyTitle}</h2>
          <p className="mb-6 text-fg-muted">{t.practice.emptyBody}</p>
          <div className="flex flex-wrap justify-center gap-3">
            <ButtonLink href="/diagnostic" variant="outline">
              {t.practice.newAssessment}
            </ButtonLink>
          </div>
        </Card>
      )}

      {phase === "running" && current && (
        <QuestionCard
          key={`${current.id}-${pos}`}
          question={current}
          index={pos}
          total={queue.length}
          mode="learn"
          onNext={(correct) => onNext(correct)}
        />
      )}

      {phase === "done" && (
        <Card className="p-8 text-center">
          <div className="mb-3 text-4xl">✅</div>
          <h2 className="mb-2 text-lg font-bold">{t.practice.doneTitle}</h2>
          <p className="mb-6 text-fg-muted">
            {t.practice.doneBody(stats.correct, stats.answered)}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button onClick={buildSession}>{t.practice.newSession}</Button>
            <ButtonLink href="/results" variant="outline">
              {t.practice.myResults}
            </ButtonLink>
          </div>
        </Card>
      )}

      {/* AI top-up panel */}
      {aiAvailable && phase !== "loading" && (
        <Card className="mt-6 p-5">
          <p className="mb-3 text-sm font-bold">{t.practice.aiPanelTitle}</p>
          <div className="flex flex-wrap items-center gap-3">
            <select
              aria-label={t.a11y.chooseSkill}
              value={genSkill}
              onChange={(e) => setGenSkill(e.target.value as SkillKey)}
              className="h-10 rounded-lg border border-border bg-surface px-3 text-sm"
            >
              {SKILL_LIST.filter((s) => s.key !== "abstract").map((s) => (
                <option key={s.key} value={s.key}>
                  {t.skills[s.key].name}
                </option>
              ))}
            </select>
            <select
              aria-label={t.a11y.chooseDifficulty}
              value={genDiff}
              onChange={(e) => setGenDiff(Number(e.target.value))}
              className="h-10 rounded-lg border border-border bg-surface px-3 text-sm"
            >
              {[1, 2, 3, 4, 5].map((d) => (
                <option key={d} value={d}>
                  {t.practice.difficultyOpt(d)}
                </option>
              ))}
            </select>
            <Button
              variant="outline"
              size="sm"
              onClick={generateAI}
              disabled={genState === "loading"}
            >
              {genState === "loading" ? t.practice.generating : t.practice.generate}
            </Button>
          </div>
          {genError && <p className="mt-2 text-xs text-danger">{genError}</p>}
          <p className="mt-2 text-xs text-fg-faint">{t.practice.aiNote}</p>
        </Card>
      )}
    </div>
  );
}

function weakestSkillOrder(
  estimates?: Record<string, { skill: string; score: number } | undefined>,
): SkillKey[] {
  const all: SkillKey[] = SKILL_LIST.map((s) => s.key);
  if (!estimates) return all;
  const scored = all
    .map((k) => ({ k, score: estimates[k]?.score ?? 50 }))
    .sort((a, b) => a.score - b.score);
  return scored.map((s) => s.k);
}

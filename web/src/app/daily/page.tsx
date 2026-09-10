"use client";

import { useEffect, useRef, useState } from "react";
import type { AbstractItem } from "@/lib/abstract/types";
import {
  dateSeedNumber,
  generateDailyChallenge,
} from "@/lib/abstract/generate";
import {
  dailyScore,
  getDisplayName,
  getLeaderboard,
  getRank,
  setDisplayName,
  submitDailyScore,
  type DailyEntry,
} from "@/lib/daily";
import { getUserId, logPracticeToday } from "@/lib/data";
import { useI18n } from "@/i18n/context";
import { AbstractQuestionCard } from "@/components/abstract-question-card";
import { Badge, Button, ButtonLink, Card, cn } from "@/components/ui";

function fmt(ms: number): string {
  const s = Math.floor(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

export default function DailyPage() {
  const { t } = useI18n();
  const [phase, setPhase] = useState<"intro" | "running" | "done">("intro");
  const [step, setStep] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [name, setName] = useState("");
  const [result, setResult] = useState<{
    correct: number;
    total: number;
    timeMs: number;
    score: number;
  } | null>(null);
  const [board, setBoard] = useState<DailyEntry[]>([]);
  const [rank, setRank] = useState<{
    rank: number;
    total: number;
    percentile: number;
  } | null>(null);
  const [posted, setPosted] = useState(true);
  const [myId, setMyId] = useState<string | null>(null);

  const items = useRef<AbstractItem[]>([]);
  const startAt = useRef(0);
  const correct = useRef(0);

  useEffect(() => {
    setName(getDisplayName());
    getUserId().then(setMyId);
  }, []);

  useEffect(() => {
    if (phase !== "running") return;
    const id = setInterval(() => setElapsed(Date.now() - startAt.current), 250);
    return () => clearInterval(id);
  }, [phase]);

  function start() {
    items.current = generateDailyChallenge(dateSeedNumber());
    correct.current = 0;
    startAt.current = Date.now();
    setElapsed(0);
    setStep(0);
    setPhase("running");
  }

  async function onNext(isCorrect: boolean) {
    if (isCorrect) correct.current += 1;
    const next = step + 1;
    if (next >= items.current.length) {
      await finish();
      return;
    }
    setStep(next);
  }

  async function finish() {
    const timeMs = Date.now() - startAt.current;
    const total = items.current.length;
    const c = correct.current;
    const score = dailyScore(c, timeMs);
    const res = { correct: c, total, timeMs, score };
    setResult(res);
    setElapsed(timeMs);
    setPhase("done");
    logPracticeToday();

    const { posted } = await submitDailyScore({ correct: c, timeMs, score });
    setPosted(posted);
    const [b, r] = await Promise.all([getLeaderboard(), getRank(score)]);
    setBoard(b);
    if (posted) setRank(r);
  }

  const current = items.current[step];

  return (
    <div className="mx-auto max-w-xl px-4 py-10 md:px-6">
      {phase === "intro" && (
        <Card className="animate-rise p-8 text-center">
          <div className="mb-4 text-5xl">🏆</div>
          <h1 className="mb-2 text-2xl font-bold">{t.daily.title}</h1>
          <p className="mx-auto mb-6 max-w-md leading-relaxed text-fg-muted">
            {t.daily.intro}
          </p>
          <div className="mx-auto mb-6 max-w-xs text-start">
            <label className="mb-1 block text-sm font-semibold">
              {t.daily.nameLabel}
            </label>
            <input
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setDisplayName(e.target.value);
              }}
              placeholder={t.daily.namePlaceholder}
              maxLength={24}
              className="h-11 w-full rounded-xl border border-border bg-surface px-4 text-sm outline-none focus:border-brand"
            />
          </div>
          <Button size="lg" onClick={start}>
            {t.daily.start}
          </Button>
        </Card>
      )}

      {phase === "running" && current && (
        <>
          <div className="mb-4 flex items-center justify-between gap-3">
            <Badge tone="brand">
              ⏱️ {t.daily.elapsed}: <span dir="ltr">{fmt(elapsed)}</span>
            </Badge>
            <span dir="ltr" className="text-sm text-fg-faint">
              {t.daily.progress(step + 1, items.current.length)}
            </span>
          </div>
          <AbstractQuestionCard
            key={current.id}
            item={current}
            index={step}
            total={items.current.length}
            mode="assess"
            onNext={(c) => onNext(c)}
          />
        </>
      )}

      {phase === "done" && result && (
        <div className="animate-rise">
          <Card className="p-8 text-center">
            <div className="mb-2 text-4xl">🏆</div>
            <h2 className="mb-5 text-xl font-bold">{t.daily.doneTitle}</h2>

            <div className="mb-5 grid grid-cols-3 gap-2 text-sm">
              <Stat
                label={t.daily.correctLabel}
                value={`${result.correct}/${result.total}`}
              />
              <Stat label={t.daily.timeLabel} value={fmt(result.timeMs)} />
              <Stat label={t.daily.scoreLabel} value={String(result.score)} />
            </div>

            {posted && rank && rank.total > 0 && (
              <div className="mb-2 rounded-xl border border-brand/30 bg-brand-soft p-3">
                <p className="font-bold text-brand">
                  {t.daily.rank(rank.rank, rank.total)}
                </p>
                <p className="text-sm text-fg-muted">
                  {t.daily.percentile(rank.percentile)}
                </p>
              </div>
            )}
            {!posted && (
              <p className="mb-2 text-sm text-fg-muted">{t.daily.guestNote}</p>
            )}
            <p className="text-xs text-fg-faint">{t.daily.comeBack}</p>
          </Card>

          {/* Leaderboard */}
          <Card className="mt-4 p-6">
            <h3 className="mb-3 font-bold">🏅 {t.daily.leaderboardTitle}</h3>
            {board.length === 0 ? (
              <p className="text-sm text-fg-muted">{t.daily.emptyBoard}</p>
            ) : (
              <ol className="grid gap-1">
                {board.map((row, i) => {
                  const mine = !!myId && row.user_id === myId;
                  return (
                    <li
                      key={i}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm",
                        mine ? "bg-brand-soft" : "odd:bg-surface-2/40",
                      )}
                    >
                      <span className="w-6 text-center font-bold text-fg-faint">
                        {i + 1}
                      </span>
                      <span className="flex-1 truncate font-semibold">
                        {mine ? `${row.display_name} (${t.daily.you})` : row.display_name}
                      </span>
                      <span dir="ltr" className="text-xs text-fg-faint">
                        {row.correct}/10 · {fmt(row.time_ms)}
                      </span>
                      <span className="w-14 text-end font-bold text-brand">
                        {row.score}
                      </span>
                    </li>
                  );
                })}
              </ol>
            )}
          </Card>

          <div className="mt-4 flex justify-center">
            <ButtonLink href="/journey" variant="outline">
              {t.daily.toJourney}
            </ButtonLink>
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border-soft bg-surface-2/50 p-3">
      <div dir="ltr" className="text-2xl font-bold text-brand">
        {value}
      </div>
      <div className="text-xs text-fg-faint">{label}</div>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import type { AbstractItem } from "@/lib/abstract/types";
import {
  dateSeedNumber,
  generateDailyChallenge,
} from "@/lib/abstract/generate";
import {
  dailyScore,
  getCompletedDays,
  getDisplayName,
  getLeaderboard,
  getLocalResult,
  getMyTodayScore,
  getRank,
  logDailyToday,
  saveLocalResult,
  setDisplayName,
  submitDailyScore,
  type DailyEntry,
  type DailyResult,
} from "@/lib/daily";
import { describeRule } from "@/lib/abstract/describe";
import { buildShareText, shareResult } from "@/lib/share";
import { track } from "@/lib/analytics";
import { getUserId, logPracticeToday } from "@/lib/data";
import { computeStreak } from "@/lib/progress";
import {
  BADGES,
  addEarnedBadges,
  evaluateBadges,
  getEarnedBadges,
} from "@/lib/badges";
import { useI18n } from "@/i18n/context";
import { HonestyNote } from "@/components/honesty-note";
import { AbstractQuestionCard } from "@/components/abstract-question-card";
import { Badge, Button, ButtonLink, Card, cn } from "@/components/ui";

function fmt(ms: number): string {
  const s = Math.floor(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

export default function DailyPage() {
  const { t, locale } = useI18n();
  const [phase, setPhase] = useState<"intro" | "running" | "done">("intro");
  const [step, setStep] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [name, setName] = useState("");
  const [result, setResult] = useState<DailyResult | null>(null);
  const [shareState, setShareState] = useState<
    "idle" | "shared" | "copied" | "failed"
  >("idle");
  const [board, setBoard] = useState<DailyEntry[]>([]);
  const [rank, setRank] = useState<{
    rank: number;
    total: number;
    percentile: number;
  } | null>(null);
  const [posted, setPosted] = useState(true);
  const [myId, setMyId] = useState<string | null>(null);
  const [streak, setStreak] = useState(0);
  const [earnedBadges, setEarnedBadges] = useState<string[]>([]);
  const [newBadges, setNewBadges] = useState<string[]>([]);

  const items = useRef<AbstractItem[]>([]);
  const startAt = useRef(0);
  const correct = useRef(0);
  // Per-item outcome, for the spoiler-free share grid.
  const marks = useRef<boolean[]>([]);
  const hiddenMs = useRef(0);
  const hiddenAt = useRef(0);
  const submitting = useRef(false);

  useEffect(() => {
    setName(getDisplayName());
    setEarnedBadges(getEarnedBadges());
    let active = true;
    (async () => {
      const uid = await getUserId();
      if (!active) return;
      setMyId(uid);
      getCompletedDays().then((days) => active && setStreak(computeStreak(days)));

      // One challenge per day: if already completed today, show the result.
      let res = getLocalResult();
      if (!res) {
        const mine = await getMyTodayScore();
        if (mine) res = mine;
      }
      if (res && active) {
        setResult(res);
        setPosted(!!uid);
        setPhase("done");
        const [b, r] = await Promise.all([getLeaderboard(), getRank(res.score)]);
        if (!active) return;
        setBoard(b);
        if (uid) setRank(r);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  // The clock only runs while the tab is visible, so switching away (or being
  // interrupted) doesn't ruin the run — and can't be used to farm a bad time.
  const activeMs = () => Date.now() - startAt.current - hiddenMs.current;

  useEffect(() => {
    if (phase !== "running") return;
    const id = setInterval(() => setElapsed(activeMs()), 250);

    const onVisibility = () => {
      if (document.hidden) {
        hiddenAt.current = Date.now();
      } else if (hiddenAt.current) {
        hiddenMs.current += Date.now() - hiddenAt.current;
        hiddenAt.current = 0;
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", onVisibility);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  function start() {
    track("daily_start", locale);
    items.current = generateDailyChallenge(dateSeedNumber());
    correct.current = 0;
    marks.current = [];
    startAt.current = Date.now();
    hiddenMs.current = 0;
    hiddenAt.current = 0;
    setElapsed(0);
    setStep(0);
    setPhase("running");
  }

  async function onNext(isCorrect: boolean) {
    marks.current.push(isCorrect);
    if (isCorrect) correct.current += 1;
    const next = step + 1;
    if (next >= items.current.length) {
      await finish();
      return;
    }
    setStep(next);
  }

  async function finish() {
    if (submitting.current) return; // a double tap must not submit twice
    submitting.current = true;

    const timeMs = activeMs();
    const total = items.current.length;
    const c = correct.current;
    const score = dailyScore(c, timeMs);
    const res = { correct: c, total, timeMs, score, marks: [...marks.current] };
    setResult(res);
    saveLocalResult(res);
    setElapsed(timeMs);
    setPhase("done");
    logPracticeToday();
    logDailyToday();
    track("daily_finish", locale);

    try {
      const sub = await submitDailyScore({ correct: c, timeMs });
      setPosted(sub.posted);
      // Rank against the score the server actually stored.
      const rankScore = sub.storedScore ?? score;
      const [b, r] = await Promise.all([
        getLeaderboard(),
        getRank(rankScore),
      ]);
      setBoard(b);
      if (sub.posted) setRank(r);

      const days = await getCompletedDays();
      const s = computeStreak(days);
      setStreak(s);
      const earnedNow = evaluateBadges({
        correct: c,
        total,
        timeMs,
        streak: s,
        rank: sub.posted && r ? r.rank : null,
      });
      setNewBadges(addEarnedBadges(earnedNow));
      setEarnedBadges(getEarnedBadges());
    } catch {
      setPosted(false);
      setStreak(computeStreak(await getCompletedDays().catch(() => [])));
    }
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
          {streak > 0 && (
            <div className="mb-6">
              <Badge tone="warning">{t.daily.streakDays(streak)}</Badge>
              <p className="mt-2 text-xs text-fg-faint">{t.daily.keepStreak}</p>
            </div>
          )}
          <div className="mx-auto mb-6 max-w-xs text-start">
            <label htmlFor="display-name" className="mb-1 block text-sm font-semibold">
              {t.daily.nameLabel}
            </label>
            <input
              id="display-name"
              name="display-name"
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
              ⏱️ {t.daily.elapsed}: <span dir="ltr">{t.num(fmt(elapsed))}</span>
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
            <h2 className="mb-3 text-xl font-bold">{t.daily.doneTitle}</h2>
            {streak > 0 && (
              <div className="mb-4">
                <Badge tone="warning">{t.daily.streakDays(streak)}</Badge>
              </div>
            )}

            <div className="mb-5 grid grid-cols-3 gap-2 text-sm">
              <Stat
                label={t.daily.correctLabel}
                value={`${t.num(result.correct)}/${t.num(result.total)}`}
              />
              <Stat label={t.daily.timeLabel} value={t.num(fmt(result.timeMs))} />
              <Stat label={t.daily.scoreLabel} value={t.num(result.score)} />
            </div>

            {posted && rank && rank.total > 0 && (
              <div className="mb-2 rounded-xl border border-brand/30 bg-brand-soft p-3">
                <p className="font-bold text-brand-ink">
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
            {/* The share loop: the daily challenge is one set for everyone and
                one attempt, which is exactly the shape that spreads — but with
                no share card that loop simply didn't exist. */}
            <div className="mt-5 border-t border-border-soft pt-5">
              <Button
                size="lg"
                className="w-full sm:w-auto"
                onClick={async () => {
                  const text = buildShareText({
                    correct: result.correct,
                    total: result.total,
                    timeMs: result.timeMs,
                    marks: result.marks ?? [],
                    streak,
                    rank: posted ? rank : null,
                    locale,
                    url: `${window.location.origin}/daily`,
                  });
                  setShareState(await shareResult(text));
                  track("daily_share", locale);
                }}
              >
                📤 {t.daily.share}
              </Button>
              <p className="mt-2 text-xs text-fg-faint">
                {shareState === "copied"
                  ? t.daily.shareCopied
                  : shareState === "shared"
                    ? t.daily.shareShared
                    : shareState === "failed"
                      ? t.daily.shareFailed
                      : t.daily.shareHint}
              </p>
            </div>

            <p className="mt-4 text-xs text-fg-faint">{t.daily.comeBack}</p>
            <HonestyNote className="mt-4" />
          </Card>

          {/* The rules of today's ten puzzles. Regenerated from the day seed, so
              this works even when the result was restored after a reload. */}
          <Card className="mt-4 p-6">
            <h3 className="mb-1 font-bold">🔑 {t.daily.rulesTitle}</h3>
            <p className="mb-3 text-xs leading-relaxed text-fg-faint">
              {t.daily.rulesHint}
            </p>
            <ol className="grid gap-2">
              {generateDailyChallenge(dateSeedNumber()).map((it, i) => (
                <li
                  key={it.id}
                  className="rounded-lg border border-border-soft bg-surface-2/40 px-3 py-2"
                >
                  <span className="text-xs font-bold text-fg-faint">
                    {t.daily.itemN(i + 1)}
                  </span>
                  <ul className="mt-0.5 grid gap-0.5">
                    {it.rules.map((rule, j) => (
                      <li key={j} className="text-sm leading-relaxed">
                        {describeRule(rule, t)}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
            <p className="mt-3 text-xs leading-relaxed text-fg-muted">
              {t.abstractRules.metaTip}
            </p>
          </Card>

          {/* Badges */}
          <Card className="mt-4 p-6">
            <h3 className="mb-3 font-bold">🏅 {t.daily.badgesTitle}</h3>
            <div className="grid grid-cols-4 gap-3">
              {BADGES.map((b) => {
                const earned = earnedBadges.includes(b.id);
                const isNew = newBadges.includes(b.id);
                return (
                  <div
                    key={b.id}
                    className={cn(
                      "relative rounded-xl border p-2 text-center",
                      earned
                        ? "border-brand/30 bg-brand-soft"
                        : "border-border-soft opacity-40",
                    )}
                  >
                    <div className="text-2xl">{b.emoji}</div>
                    <div className="mt-1 text-[10px] leading-tight text-fg-muted">
                      {t.daily.badgeNames[b.id]}
                    </div>
                    {isNew && (
                      <span className="absolute -top-1 -end-1 rounded-full bg-brand-strong px-1.5 py-0.5 text-[9px] font-bold text-white">
                        {t.daily.newBadge}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Leaderboard */}
          <Card className="mt-4 p-6">
            <h3 className="mb-1 font-bold">🏅 {t.daily.leaderboardTitle}</h3>
            <p className="mb-3 text-xs leading-relaxed text-fg-faint">
              {t.daily.boardNote}
            </p>
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
                        {t.num(i + 1)}
                      </span>
                      <span className="flex-1 truncate">
                        <span className="font-semibold">
                          {mine
                            ? `${row.display_name} (${t.daily.you})`
                            : row.display_name}
                        </span>
                        {row.user_id && (
                          <span className="ms-1 text-[10px] text-fg-faint">
                            #{row.user_id.slice(0, 4)}
                          </span>
                        )}
                      </span>
                      <span dir="ltr" className="text-xs text-fg-faint">
                        {t.num(row.correct)}/{t.num(10)} · {t.num(fmt(row.time_ms))}
                      </span>
                      <span className="w-14 text-end font-bold text-brand-ink">
                        {t.num(row.score)}
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
      <div dir="ltr" className="text-2xl font-bold text-brand-ink">
        {value}
      </div>
      <div className="text-xs text-fg-faint">{label}</div>
    </div>
  );
}

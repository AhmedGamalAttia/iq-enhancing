"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { logPracticeToday } from "@/lib/data";
import { saveWorkingMemory } from "@/lib/wm";
import { track } from "@/lib/analytics";
import { useI18n } from "@/i18n/context";
import { HonestyNote } from "@/components/honesty-note";
import { Button, ButtonLink, Card, cn } from "@/components/ui";

const TRIALS = 20;
const STIM_MS = 700; // stimulus visible
const TRIAL_MS = 2500; // full trial length (stimulus + gap)
const TARGET_RATE = 0.32;

type Phase = "intro" | "countdown" | "running" | "done";
interface Stats {
  hits: number;
  misses: number;
  fa: number;
  cr: number;
}

/**
 * A sequence with an EXACT, fixed number of targets.
 *
 * Drawing each target from a coin flip made rounds incomparable — and a round
 * that happened to contain no targets at all scored 0 however perfectly it was
 * played, because the hit rate was 0/0.
 */
function genSequence(n: number, trials: number): number[] {
  const eligible = [];
  for (let i = n; i < trials; i++) eligible.push(i);
  const targetCount = Math.max(1, Math.round(trials * TARGET_RATE));
  // Fisher–Yates, then take the first k positions as the targets.
  for (let i = eligible.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [eligible[i], eligible[j]] = [eligible[j], eligible[i]];
  }
  const targets = new Set(eligible.slice(0, targetCount));

  const seq: number[] = [];
  for (let i = 0; i < trials; i++) {
    if (targets.has(i)) {
      seq.push(seq[i - n]); // target: repeat the n-back position
    } else {
      let c: number;
      do {
        c = Math.floor(Math.random() * 9);
      } while (i >= n && c === seq[i - n]); // avoid accidental matches
      seq.push(c);
    }
  }
  return seq;
}

export default function NBackPage() {
  const { t } = useI18n();
  const [phase, setPhase] = useState<Phase>("intro");
  const [nLevel, setNLevel] = useState(1);
  const [activeCell, setActiveCell] = useState<number | null>(null);
  const [index, setIndex] = useState(0);
  const [countdown, setCountdown] = useState(3);
  const [pressed, setPressed] = useState(false);
  const [result, setResult] = useState<(Stats & { score: number }) | null>(null);
  const [best, setBest] = useState<number | null>(null);

  const seqRef = useRef<number[]>([]);
  const idxRef = useRef(0);
  const respondedRef = useRef(false);
  const statsRef = useRef<Stats>({ hits: 0, misses: 0, fa: 0, cr: 0 });
  const nRef = useRef(1);
  const phaseRef = useRef<Phase>("intro");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  function clearTimers() {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }

  // Load best score for the selected level on the intro screen.
  useEffect(() => {
    if (phase !== "intro") return;
    try {
      const v = localStorage.getItem(`cog:nback:best:${nLevel}`);
      setBest(v ? Number(v) : null);
    } catch {
      setBest(null);
    }
  }, [phase, nLevel]);

  const respond = useCallback(() => {
    if (phaseRef.current !== "running" || respondedRef.current) return;
    respondedRef.current = true;
    setPressed(true);
    timers.current.push(setTimeout(() => setPressed(false), 150));
  }, []);

  // Spacebar to respond — bound ONLY while a round is running. It used to be
  // bound for the whole page lifetime, which swallowed Space everywhere and left
  // keyboard users unable to activate any button on the intro or result screen.
  useEffect(() => {
    if (phase !== "running") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.code !== "Space") return;
      const el = e.target as HTMLElement | null;
      // Never steal Space from a control the user is actually focused on.
      if (el && el.closest("button, a, input, select, textarea, [contenteditable]")) {
        return;
      }
      e.preventDefault();
      respond();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, respond]);

  useEffect(() => () => clearTimers(), []);

  function evaluateTrial(i: number) {
    const n = nRef.current;
    const isTarget = i >= n && seqRef.current[i] === seqRef.current[i - n];
    const responded = respondedRef.current;
    const s = statsRef.current;
    if (isTarget && responded) s.hits += 1;
    else if (isTarget && !responded) s.misses += 1;
    else if (!isTarget && responded) s.fa += 1;
    else s.cr += 1;
  }

  const runTrial = useCallback(() => {
    const i = idxRef.current;
    if (i >= seqRef.current.length) {
      finish();
      return;
    }
    respondedRef.current = false;
    setIndex(i);
    setActiveCell(seqRef.current[i]);
    timers.current.push(setTimeout(() => setActiveCell(null), STIM_MS));
    timers.current.push(
      setTimeout(() => {
        evaluateTrial(i);
        idxRef.current = i + 1;
        runTrial();
      }, TRIAL_MS),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function finish() {
    clearTimers();
    const s = statsRef.current;
    const targets = s.hits + s.misses;
    const nonTargets = s.fa + s.cr;
    const hitRate = targets ? s.hits / targets : 0;
    const faRate = nonTargets ? s.fa / nonTargets : 0;
    const score = Math.max(0, Math.min(100, Math.round((hitRate - faRate) * 100)));
    setResult({ ...s, score });
    setActiveCell(null);
    setPhase("done");
    phaseRef.current = "done";
    logPracticeToday();
    track("nback_finish");
    // This round IS the working-memory measurement for the whole platform.
    saveWorkingMemory({
      n: nRef.current,
      score,
      at: new Date().toISOString(),
    });
    try {
      const key = `cog:nback:best:${nRef.current}`;
      const prev = Number(localStorage.getItem(key) ?? 0);
      const nextBest = Math.max(prev, score);
      localStorage.setItem(key, String(nextBest));
      setBest(nextBest);
    } catch {
      /* ignore */
    }
  }

  function start() {
    clearTimers();
    nRef.current = nLevel;
    seqRef.current = genSequence(nLevel, TRIALS);
    idxRef.current = 0;
    statsRef.current = { hits: 0, misses: 0, fa: 0, cr: 0 };
    setResult(null);
    setIndex(0);
    setPhase("countdown");
    phaseRef.current = "countdown";
    let c = 3;
    setCountdown(3);
    const tick = () => {
      c -= 1;
      if (c > 0) {
        setCountdown(c);
        timers.current.push(setTimeout(tick, 700));
      } else {
        setPhase("running");
        phaseRef.current = "running";
        runTrial();
      }
    };
    timers.current.push(setTimeout(tick, 700));
  }

  const interp = (score: number) =>
    score >= 70 ? t.nback.interpHigh : score >= 40 ? t.nback.interpMid : t.nback.interpLow;

  return (
    <div className="mx-auto max-w-md px-4 py-10 md:px-6">
      {phase === "intro" && (
        <Card className="animate-rise p-8 text-center">
          <div className="mb-4 text-5xl">🧠</div>
          <h1 className="mb-2 text-2xl font-bold">{t.nback.title}</h1>
          <p className="mb-2 leading-relaxed text-fg-muted">{t.nback.intro}</p>
          <p className="mb-4 leading-relaxed text-fg">
            {t.nback.instruction(nLevel)}
          </p>

          {/* How to play — a worked visual example */}
          <div className="mb-6 rounded-xl border border-border-soft bg-surface-2/50 p-4">
            <p className="mb-3 text-sm font-bold">👀 {t.nback.howTitle}</p>
            <NBackExample n={nLevel} />
            <p className="mt-3 text-xs leading-relaxed text-fg-muted">
              {t.nback.exampleCaption(nLevel)}
            </p>
          </div>

          <p className="mb-2 text-sm font-semibold">{t.nback.chooseLevel}</p>
          <div className="mb-4 flex justify-center gap-2">
            {[1, 2, 3].map((n) => (
              <button
                key={n}
                onClick={() => setNLevel(n)}
                className={cn(
                  "flex flex-col items-center rounded-xl border px-4 py-2 text-sm font-bold transition-colors",
                  nLevel === n
                    ? "border-brand bg-brand-soft text-brand-ink"
                    : "border-border text-fg-muted hover:border-brand/50",
                )}
              >
                <span dir="ltr">{t.nback.level(n)}</span>
                <span className="text-[10px] font-normal text-fg-faint">
                  {t.nback.levelTag(n)}
                </span>
              </button>
            ))}
          </div>
          {best != null && (
            <p className="mb-6 text-xs text-fg-faint">
              {t.nback.bestLabel(nLevel)}: <b className="text-brand-ink">{t.num(best)}</b>
            </p>
          )}
          <Button size="lg" onClick={start}>
            {t.nback.start}
          </Button>
        </Card>
      )}

      {phase === "countdown" && (
        <Card className="grid place-items-center p-16">
          <div className="text-6xl font-extrabold text-brand-ink">
            {t.num(countdown)}
          </div>
          <p className="mt-3 text-fg-muted">{t.nback.getReady}</p>
        </Card>
      )}

      {phase === "running" && (
        <div>
          <div className="mb-4 flex items-center justify-between text-sm text-fg-faint">
            <span dir="ltr" className="font-bold text-brand-ink">
              {t.nback.level(nLevel)}
            </span>
            <span dir="ltr">{t.nback.progress(index + 1, TRIALS)}</span>
          </div>

          <div className="mx-auto mb-6 grid aspect-square max-w-[300px] grid-cols-3 gap-3">
            {Array.from({ length: 9 }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  "rounded-xl border transition-all duration-150",
                  activeCell === i
                    ? "border-brand bg-brand shadow-[0_0_30px_-4px_var(--brand)]"
                    : "border-border-soft bg-surface-2",
                )}
              />
            ))}
          </div>

          <button
            onClick={respond}
            className={cn(
              "w-full rounded-2xl border-2 py-5 text-lg font-bold transition-all",
              pressed
                ? "border-brand bg-brand-strong text-white"
                : "border-brand/40 bg-brand-soft text-brand-ink hover:bg-brand/15",
            )}
          >
            {t.nback.match}
          </button>
          <p className="mt-3 text-center text-xs text-fg-faint">
            {t.nback.matchHint}
          </p>
        </div>
      )}

      {phase === "done" && result && (
        <Card className="animate-rise p-8 text-center">
          <div className="mb-2 text-4xl">🧠</div>
          <h2 className="mb-4 text-xl font-bold">{t.nback.doneTitle}</h2>

          <div className="mb-4">
            <div dir="ltr" className="text-5xl font-extrabold text-brand-ink">
              {t.num(result.score)}
              <span className="text-lg text-fg-faint">/{t.num(100)}</span>
            </div>
            <p className="text-xs text-fg-faint">{t.nback.scoreLabel}</p>
          </div>

          <div className="mb-5 grid grid-cols-3 gap-2 text-sm">
            <Stat label={t.nback.hitsLabel} value={t.num(result.hits)} tone="text-success" />
            <Stat label={t.nback.missesLabel} value={t.num(result.misses)} tone="text-warning" />
            <Stat label={t.nback.falseAlarmsLabel} value={t.num(result.fa)} tone="text-danger" />
          </div>

          <p className="mb-6 leading-relaxed text-fg-muted">{interp(result.score)}</p>

          <div className="flex flex-wrap justify-center gap-3">
            <Button onClick={start}>{t.nback.playAgain}</Button>
            <ButtonLink href="/practice" variant="outline">
              {t.nback.toPractice}
            </ButtonLink>
          </div>

          <HonestyNote className="mt-6" />
        </Card>
      )}
    </div>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: string;
}) {
  return (
    <div className="rounded-xl border border-border-soft bg-surface-2/50 p-3">
      <div className={cn("text-2xl font-bold", tone)}>{value}</div>
      <div className="text-xs text-fg-faint">{label}</div>
    </div>
  );
}

// A tiny static illustration: a row of 3×3 grids where the last square matches
// the one n steps back (highlighted), teaching the rule at a glance.
function NBackExample({ n }: { n: number }) {
  const base = [1, 5, 7, 3, 0];
  const pos = [...base];
  pos[4] = pos[4 - n];
  const partner = 4 - n;

  return (
    <div dir="ltr" className="flex items-end justify-center gap-2">
      {pos.map((p, idx) => {
        const isCurrent = idx === 4;
        const isPartner = idx === partner;
        return (
          <div key={idx} className="flex flex-col items-center gap-1">
            <div
              className={cn(
                "grid grid-cols-3 gap-[2px] rounded-md border p-1",
                isCurrent
                  ? "border-brand bg-brand-soft"
                  : isPartner
                    ? "border-accent"
                    : "border-border-soft",
              )}
            >
              {Array.from({ length: 9 }).map((_, c) => (
                <span
                  key={c}
                  className={cn(
                    "h-2.5 w-2.5 rounded-[2px]",
                    c === p
                      ? isCurrent
                        ? "bg-brand"
                        : isPartner
                          ? "bg-accent"
                          : "bg-fg"
                      : "bg-surface-2",
                  )}
                />
              ))}
            </div>
            <span className="h-4 text-xs">
              {isCurrent ? "✋" : isPartner ? "↑" : ""}
            </span>
          </div>
        );
      })}
    </div>
  );
}

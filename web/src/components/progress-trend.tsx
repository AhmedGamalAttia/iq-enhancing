"use client";

import { useMemo } from "react";
import type { DiagnosticResult, SkillKey } from "@/lib/types";
import { avgScore } from "@/lib/progress";
import { SKILLS } from "@/data/skills";
import { useI18n } from "@/i18n/context";
import { Card } from "@/components/ui";

export function ProgressTrend({ history }: { history: DiagnosticResult[] }) {
  const { t, locale } = useI18n();

  const points = useMemo(
    () =>
      history.map((h) => ({
        label: new Date(h.finishedAt).toLocaleDateString(
          locale === "ar" ? "ar-EG" : "en-US",
          { month: "short", day: "numeric" },
        ),
        score: avgScore(h.estimates),
      })),
    [history, locale],
  );

  // Per-skill change from the first assessment to the latest.
  const deltas = useMemo(() => {
    if (history.length < 2) return [];
    const first = history[0].estimates;
    const last = history[history.length - 1].estimates;
    return (Object.keys(last) as SkillKey[])
      .filter((k) => last[k])
      .map((k) => {
        const now = last[k]!.score;
        const then = first[k]?.score;
        return { key: k, now, delta: then != null ? now - then : null };
      });
  }, [history]);

  if (history.length < 2) {
    return (
      <Card className="mt-6 p-6">
        <h2 className="mb-2 text-lg font-bold">{t.results.trendTitle}</h2>
        <p className="text-sm text-fg-muted">{t.results.trendNeedMore}</p>
      </Card>
    );
  }

  return (
    <Card className="mt-6 p-6">
      <h2 className="mb-1 text-lg font-bold">{t.results.trendTitle}</h2>
      <p className="mb-4 text-xs text-fg-faint">{t.results.trendAvgLabel}</p>

      <div dir="ltr" className="mb-6 overflow-x-auto">
        <TrendChart points={points} />
      </div>

      {/* Per-skill change since first assessment */}
      <h3 className="mb-3 text-sm font-bold">{t.results.trendChangeTitle}</h3>
      <div className="mb-6 grid gap-2 sm:grid-cols-2">
        {deltas.map((d) => {
          const skill = SKILLS[d.key];
          const up = d.delta != null && d.delta > 0;
          const down = d.delta != null && d.delta < 0;
          return (
            <div
              key={d.key}
              className="flex items-center gap-2 rounded-lg border border-border-soft bg-surface-2/40 px-3 py-2"
            >
              <span>{skill.icon}</span>
              <span className="flex-1 truncate text-sm">{t.skills[d.key].name}</span>
              <span className="text-sm font-bold" style={{ color: skill.accentText }}>
                {d.now}
              </span>
              <span
                className={
                  "w-14 text-end text-xs font-bold " +
                  (up ? "text-success" : down ? "text-danger" : "text-fg-faint")
                }
              >
                {d.delta == null
                  ? "—"
                  : d.delta === 0
                    ? "—"
                    : `${up ? "▲" : "▼"} ${Math.abs(d.delta)}`}
              </span>
            </div>
          );
        })}
      </div>

      {/* History list (the table view) */}
      <h3 className="mb-2 text-sm font-bold">{t.results.trendHistoryTitle}</h3>
      <ul className="divide-y divide-border-soft text-sm">
        {[...history].reverse().map((h, i) => (
          <li key={i} className="flex items-center justify-between py-2">
            <span className="text-fg-muted">
              {new Date(h.finishedAt).toLocaleDateString(
                locale === "ar" ? "ar-EG" : "en-US",
                { dateStyle: "medium" },
              )}
            </span>
            <span className="font-bold text-brand-ink">{avgScore(h.estimates)}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

function TrendChart({ points }: { points: { label: string; score: number }[] }) {
  const W = 600;
  const H = 220;
  const L = 36;
  const R = 12;
  const T = 14;
  const B = 26;
  const pw = W - L - R;
  const ph = H - T - B;
  const n = points.length;

  const x = (i: number) => (n === 1 ? L + pw / 2 : L + (pw * i) / (n - 1));
  const y = (s: number) => T + ph * (1 - s / 100);

  const line = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(p.score).toFixed(1)}`)
    .join(" ");
  const area =
    `M${x(0).toFixed(1)},${(T + ph).toFixed(1)} ` +
    points.map((p, i) => `L${x(i).toFixed(1)},${y(p.score).toFixed(1)}`).join(" ") +
    ` L${x(n - 1).toFixed(1)},${(T + ph).toFixed(1)} Z`;

  const grid = [0, 50, 100];

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="h-auto w-full min-w-[420px]"
      role="img"
      aria-label="Average score over time"
    >
      <defs>
        <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--brand)" stopOpacity="0.22" />
          <stop offset="100%" stopColor="var(--brand)" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* gridlines + y labels */}
      {grid.map((g) => (
        <g key={g}>
          <line
            x1={L}
            y1={y(g)}
            x2={W - R}
            y2={y(g)}
            stroke="var(--border-soft)"
            strokeWidth="1"
          />
          <text
            x={L - 6}
            y={y(g) + 3}
            textAnchor="end"
            fontSize="10"
            fill="var(--fg-faint)"
          >
            {g}
          </text>
        </g>
      ))}

      {/* area + line */}
      <path d={area} fill="url(#trendFill)" />
      <path
        d={line}
        fill="none"
        stroke="var(--brand)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* markers with hover titles */}
      {points.map((p, i) => (
        <circle
          key={i}
          cx={x(i)}
          cy={y(p.score)}
          r="4"
          fill="var(--brand)"
          stroke="var(--surface)"
          strokeWidth="2"
        >
          <title>{`${p.label}: ${p.score}`}</title>
        </circle>
      ))}

      {/* x labels: first & last */}
      <text x={x(0)} y={H - 8} textAnchor="start" fontSize="10" fill="var(--fg-faint)">
        {points[0].label}
      </text>
      {n > 1 && (
        <text
          x={x(n - 1)}
          y={H - 8}
          textAnchor="end"
          fontSize="10"
          fill="var(--fg-faint)"
        >
          {points[n - 1].label}
        </text>
      )}
    </svg>
  );
}

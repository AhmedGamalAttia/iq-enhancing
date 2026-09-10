"use client";

import { useI18n } from "@/i18n/context";
import { cn } from "@/components/ui";

/**
 * The claims we are willing to defend, shown wherever a number is.
 *
 * The disclaimer used to appear on 2 of the 6 screens that hand out a score,
 * and the transfer warning — which the project's own plan requires — appeared
 * nowhere at all. A score with no caveat next to it gets read as an IQ.
 *
 * `variant`:
 *   "short" — one line under a score (the default for task screens)
 *   "full"  — disclaimer + transfer warning + re-test guidance (results, home)
 */
export function HonestyNote({
  variant = "short",
  className,
}: {
  variant?: "short" | "full";
  className?: string;
}) {
  const { t } = useI18n();

  if (variant === "short") {
    return (
      <p
        className={cn(
          "text-center text-xs leading-relaxed text-fg-faint",
          className,
        )}
      >
        {t.honesty.notIQ}
      </p>
    );
  }

  return (
    <div
      className={cn(
        "rounded-xl border border-border-soft bg-surface-2/40 p-4 text-start",
        className,
      )}
    >
      <p className="mb-2 text-sm font-bold">⚖️ {t.honesty.transferTitle}</p>
      <p className="mb-2 text-xs leading-relaxed text-fg-muted">
        {t.honesty.transfer}
      </p>
      <p className="mb-2 text-xs leading-relaxed text-fg-muted">
        {t.honesty.fluctuates}
      </p>
      <p className="text-xs leading-relaxed text-fg-faint">{t.honesty.notIQ}</p>
    </div>
  );
}

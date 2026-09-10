import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

export function cn(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(" ");
}

// ------------------------------- Card -------------------------------
export function Card({
  className,
  children,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius)] border border-border bg-surface/80 backdrop-blur-sm shadow-[0_10px_40px_-24px_rgba(0,0,0,0.6)]",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// ------------------------------- Badge -------------------------------
const toneMap: Record<string, string> = {
  brand: "bg-brand-soft text-brand border-brand/30",
  accent: "bg-accent-soft text-accent border-accent/30",
  success: "bg-success/10 text-success border-success/30",
  warning: "bg-warning/10 text-warning border-warning/30",
  danger: "bg-danger/10 text-danger border-danger/30",
  muted: "bg-surface-2 text-fg-muted border-border",
};

export function Badge({
  tone = "muted",
  children,
  className,
}: {
  tone?: keyof typeof toneMap | string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold",
        toneMap[tone] ?? toneMap.muted,
        className,
      )}
    >
      {children}
    </span>
  );
}

// ------------------------------- Button -------------------------------
type ButtonVariant = "primary" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

const variantMap: Record<ButtonVariant, string> = {
  primary:
    "bg-brand text-white hover:bg-brand-strong border border-transparent shadow-[0_8px_24px_-12px_var(--brand)]",
  outline:
    "bg-transparent text-fg border border-border hover:border-brand/50 hover:bg-surface-2",
  ghost: "bg-transparent text-fg-muted hover:text-fg hover:bg-surface-2 border border-transparent",
};

const sizeMap: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-7 text-base",
};

const baseBtn =
  "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:pointer-events-none select-none";

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ComponentProps<"button"> & { variant?: ButtonVariant; size?: ButtonSize }) {
  return (
    <button
      className={cn(baseBtn, variantMap[variant], sizeMap[size], className)}
      {...props}
    />
  );
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ComponentProps<typeof Link> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
}) {
  return (
    <Link
      className={cn(baseBtn, variantMap[variant], sizeMap[size], className)}
      {...props}
    />
  );
}

// ------------------------------- ProgressBar -------------------------------
export function ProgressBar({
  value,
  className,
  color,
}: {
  value: number; // 0..100
  className?: string;
  color?: string;
}) {
  return (
    <div className={cn("h-2 w-full rounded-full bg-surface-2 overflow-hidden", className)}>
      <div
        className="h-full rounded-full transition-[width] duration-500"
        style={{
          width: `${Math.min(100, Math.max(0, value))}%`,
          background: color ?? "var(--brand)",
        }}
      />
    </div>
  );
}

import type { Cell, Shape } from "@/lib/abstract/types";

// Renders a Cell (a set of monochrome shapes) as a self-contained SVG tile.
// Foreground color only — no rule ever depends on color.

const SIZE_MUL: Record<number, number> = { 1: 0.72, 2: 1, 3: 1.28 };

// Smallest distance between two shape centres for each count. The radius is
// derived from this so shapes can never touch — otherwise adjacent solid shapes
// merge into one bar and the *count* becomes unreadable, which silently
// invalidates the item.
const SPACING: Record<number, number> = { 1: Infinity, 2: 44, 3: 32, 4: 40 };
const CLEARANCE = 0.42; // r ≤ 0.42 × spacing ⇒ ≥16% gap between neighbours
const MAX_R = 34; // keep the largest single shape inside the tile

/** Largest size fits exactly at the clearance cap; smaller sizes stay in ratio. */
function radiusFor(count: number, size: number): number {
  const cap = Math.min((SPACING[count] ?? 40) * CLEARANCE, MAX_R);
  const base = cap / SIZE_MUL[3];
  return base * (SIZE_MUL[size] ?? 1);
}

function positions(count: number): [number, number][] {
  switch (count) {
    case 1:
      return [[50, 50]];
    case 2:
      return [
        [28, 50],
        [72, 50],
      ];
    case 3:
      return [
        [18, 50],
        [50, 50],
        [82, 50],
      ];
    case 4:
      return [
        [30, 30],
        [70, 30],
        [30, 70],
        [70, 70],
      ];
    default:
      return [[50, 50]];
  }
}

function arrowPoints(cx: number, cy: number, r: number): string {
  const p: [number, number][] = [
    [cx - r, cy - r * 0.35],
    [cx + r * 0.15, cy - r * 0.35],
    [cx + r * 0.15, cy - r * 0.75],
    [cx + r, cy],
    [cx + r * 0.15, cy + r * 0.75],
    [cx + r * 0.15, cy + r * 0.35],
    [cx - r, cy + r * 0.35],
  ];
  return p.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
}

function ShapeMark({
  shape,
  cx,
  cy,
  r,
}: {
  shape: Shape;
  cx: number;
  cy: number;
  r: number;
}) {
  const outline = shape.fill === "outline";
  const common = {
    fill: outline ? "none" : "var(--fg)",
    stroke: "var(--fg)",
    strokeWidth: outline ? 4 : 0,
    strokeLinejoin: "round" as const,
  };

  let mark: React.ReactNode;
  switch (shape.kind) {
    case "circle":
      mark = <circle cx={cx} cy={cy} r={r} {...common} />;
      break;
    case "square":
      mark = <rect x={cx - r} y={cy - r} width={2 * r} height={2 * r} rx={3} {...common} />;
      break;
    case "diamond":
      mark = (
        <polygon
          points={`${cx},${cy - r} ${cx + r},${cy} ${cx},${cy + r} ${cx - r},${cy}`}
          {...common}
        />
      );
      break;
    case "triangle":
      mark = (
        <polygon
          points={`${cx},${cy - r} ${cx + r * 0.87},${cy + r * 0.6} ${cx - r * 0.87},${cy + r * 0.6}`}
          {...common}
        />
      );
      break;
    case "arrow":
      mark = <polygon points={arrowPoints(cx, cy, r)} {...common} />;
      break;
  }

  return <g transform={`rotate(${shape.rotation} ${cx} ${cy})`}>{mark}</g>;
}

export function AbstractFigure({
  cell,
  size = 64,
  className,
}: {
  cell: Cell;
  size?: number;
  /** Optional responsive sizing; CSS wins over the width/height attributes. */
  className?: string;
}) {
  const count = Math.min(4, Math.max(1, cell.shapes.length));
  const pos = positions(count);

  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
    >
      <rect x={2} y={2} width={96} height={96} rx={12} fill="var(--surface-2)" />
      {cell.shapes.slice(0, 4).map((shape, i) => {
        const [cx, cy] = pos[i] ?? [50, 50];
        return (
          <ShapeMark
            key={i}
            shape={shape}
            cx={cx}
            cy={cy}
            r={radiusFor(count, shape.size)}
          />
        );
      })}
    </svg>
  );
}

export function MissingCell({
  size = 64,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
    >
      <rect
        x={3}
        y={3}
        width={94}
        height={94}
        rx={12}
        fill="var(--surface-2)"
        stroke="var(--brand)"
        strokeWidth={2}
        strokeDasharray="6 5"
      />
      <text
        x={50}
        y={68}
        textAnchor="middle"
        fontSize={44}
        fontWeight="bold"
        fill="var(--brand)"
      >
        ?
      </text>
    </svg>
  );
}

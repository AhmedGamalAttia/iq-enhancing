import type { Cell, Shape } from "@/lib/abstract/types";

// Renders a Cell (a set of monochrome shapes) as a self-contained SVG tile.
// Foreground color only — no rule ever depends on color.

const SLOT: Record<number, number> = { 1: 30, 2: 19, 3: 15, 4: 17 };
const SIZE_MUL: Record<number, number> = { 1: 0.72, 2: 1, 3: 1.28 };

function positions(count: number): [number, number][] {
  switch (count) {
    case 1:
      return [[50, 50]];
    case 2:
      return [
        [31, 50],
        [69, 50],
      ];
    case 3:
      return [
        [25, 50],
        [50, 50],
        [75, 50],
      ];
    case 4:
      return [
        [32, 32],
        [68, 32],
        [32, 68],
        [68, 68],
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
}: {
  cell: Cell;
  size?: number;
}) {
  const count = Math.min(4, Math.max(1, cell.shapes.length));
  const pos = positions(count);
  const slot = SLOT[count] ?? 24;

  return (
    <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden="true">
      <rect x={2} y={2} width={96} height={96} rx={12} fill="var(--surface-2)" />
      {cell.shapes.slice(0, 4).map((shape, i) => {
        const [cx, cy] = pos[i] ?? [50, 50];
        const r = slot * (SIZE_MUL[shape.size] ?? 1);
        return <ShapeMark key={i} shape={shape} cx={cx} cy={cy} r={r} />;
      })}
    </svg>
  );
}

export function MissingCell({ size = 64 }: { size?: number }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden="true">
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

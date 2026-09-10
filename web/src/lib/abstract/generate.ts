import type {
  AbstractItem,
  AbstractType,
  Cell,
  Fill,
  Rotation,
  ShapeKind,
  Size,
} from "./types";
import { challengeDaySeed } from "@/lib/day";

// ---------------------------------------------------------------------------
// Procedural generator for culture-fair abstract-reasoning items.
// Difficulty (1..10) controls how many attributes vary and how subtle the
// distractors are. No rule ever depends on color or language.
// ---------------------------------------------------------------------------

type Attr = "count" | "kind" | "rotation" | "fill" | "size";
interface Desc {
  count: number;
  kind: ShapeKind;
  rotation: Rotation;
  fill: Fill;
  size: Size;
}

const KINDS: ShapeKind[] = ["circle", "square", "triangle", "diamond", "arrow"];
const ROT_KINDS: ShapeKind[] = ["triangle", "arrow"]; // rotation is visible on these
const ROTS: Rotation[] = [0, 90, 180, 270];
const FILLS: Fill[] = ["solid", "outline"];
const SIZES: Size[] = [1, 2, 3];
const COUNTS = [1, 2, 3, 4];

// Swappable RNG so a daily challenge can be generated deterministically from a
// date seed (everyone gets the same puzzles), while normal play stays random.
let RNG: () => number = Math.random;

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function randInt(n: number): number {
  return Math.floor(RNG() * n);
}
function pick<T>(arr: T[]): T {
  return arr[randInt(arr.length)];
}
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = randInt(i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function pickN<T>(arr: T[], n: number): T[] {
  return shuffle(arr).slice(0, n);
}
function uid(p: string): string {
  return `${p}-${Date.now()}-${randInt(1_000_000)}`;
}

function valuesFor(attr: Attr): (number | string)[] {
  switch (attr) {
    case "count":
      return COUNTS;
    case "kind":
      return KINDS;
    case "rotation":
      return ROTS;
    case "fill":
      return FILLS;
    case "size":
      return SIZES;
  }
}

function randomDesc(): Desc {
  return {
    count: pick([1, 2, 3]),
    kind: pick(KINDS),
    rotation: pick(ROTS),
    fill: pick(FILLS),
    size: 2,
  };
}

function cellFromDesc(d: Desc): Cell {
  return {
    shapes: Array.from({ length: d.count }, () => ({
      kind: d.kind,
      rotation: d.rotation,
      fill: d.fill,
      size: d.size,
    })),
  };
}

function serializeCell(c: Cell): string {
  return c.shapes
    .map((s) => `${s.kind}:${s.rotation}:${s.fill}:${s.size}`)
    .join("|");
}

function setAttr(d: Desc, attr: Attr, value: number | string): void {
  (d as unknown as Record<string, number | string>)[attr] = value;
}
function getAttr(d: Desc, attr: Attr): number | string {
  return (d as unknown as Record<string, number | string>)[attr];
}

/** Build n options (one correct + unique distractors) and the answer index. */
function buildOptions(
  correct: Cell,
  factory: () => Cell,
  n: number,
): { options: Cell[]; answer: number } {
  const seen = new Set([serializeCell(correct)]);
  const distractors: Cell[] = [];
  let tries = 0;
  while (distractors.length < n - 1 && tries < 300) {
    tries += 1;
    const c = factory();
    const s = serializeCell(c);
    if (!seen.has(s)) {
      seen.add(s);
      distractors.push(c);
    }
  }
  while (distractors.length < n - 1) {
    const c = cellFromDesc(randomDesc());
    const s = serializeCell(c);
    if (!seen.has(s)) {
      seen.add(s);
      distractors.push(c);
    }
  }
  const options = shuffle([correct, ...distractors]);
  const cs = serializeCell(correct);
  return { options, answer: options.findIndex((o) => serializeCell(o) === cs) };
}

// ------------------------------- SEQUENCE -------------------------------
function cycleFor(attr: Attr): (number | string)[] {
  if (attr === "fill") return shuffle([...FILLS]); // period 2 — repeat is visible
  if (attr === "rotation") {
    // MUST be a steady progression, not a random permutation: with period 4 over
    // 4 prompt cells no value repeats, so an arbitrary order leaves the solver
    // no inferable rule at all.
    const start = pick(ROTS);
    const step = pick([90, 270]); // clockwise or counter-clockwise
    return [0, 1, 2, 3].map(
      (i) => ((start + step * i) % 360) as Rotation,
    );
  }
  if (attr === "size") return shuffle([...SIZES]); // period 3 — repeat is visible
  if (attr === "count") return shuffle([1, 2, 3]); // period 3 (avoid 4-overflow)
  return shuffle([...KINDS]).slice(0, 3);
}

function genSequence(d: number): AbstractItem {
  const L = 4;
  const numProg = d <= 3 ? 1 : d <= 7 ? 2 : 3; // expert ceiling: 3 attrs
  const progAttrs = pickN<Attr>(["rotation", "fill", "size", "count"], numProg);

  const base = randomDesc();
  base.rotation = 0;
  base.fill = pick(FILLS);
  base.size = 2;
  base.kind = pick(["circle", "square", "triangle", "diamond"]);
  if (progAttrs.includes("rotation")) base.kind = pick(ROT_KINDS);

  const cycles: Partial<Record<Attr, (number | string)[]>> = {};
  for (const a of progAttrs) cycles[a] = cycleFor(a);

  const descAt = (i: number): Desc => {
    const desc = { ...base };
    for (const a of progAttrs) {
      const cyc = cycles[a]!;
      setAttr(desc, a, cyc[i % cyc.length]);
    }
    return desc;
  };

  const prompt = Array.from({ length: L }, (_, i) => cellFromDesc(descAt(i)));
  const answerDesc = descAt(L);
  const answerCell = cellFromDesc(answerDesc);

  const distractor = (): Cell => {
    const desc = { ...answerDesc };
    const a = pick(progAttrs);
    const cyc = cycles[a]!;
    const cur = getAttr(answerDesc, a);
    const alt = pick(cyc.filter((v) => v !== cur));
    if (alt !== undefined) setAttr(desc, a, alt);
    return cellFromDesc(desc);
  };

  const { options, answer } = buildOptions(answerCell, distractor, 4);
  return { id: uid("seq"), type: "sequence", difficulty: d, prompt, options, answer };
}

// ------------------------------- ODD-ONE-OUT -------------------------------
function genOddone(d: number): AbstractItem {
  const attrToDiffer: Attr =
    d <= 3 ? pick<Attr>(["kind", "count"]) : pick<Attr>(["rotation", "size", "fill", "kind", "count"]);

  const base = randomDesc();
  if (attrToDiffer === "rotation") base.kind = pick(ROT_KINDS);
  if (attrToDiffer === "count") base.count = pick([1, 2, 3]);

  const oddDesc = { ...base };
  const cur = getAttr(base, attrToDiffer);
  const alt = pick(valuesFor(attrToDiffer).filter((v) => v !== cur));
  setAttr(oddDesc, attrToDiffer, alt);

  const n = 4;
  const oddIndex = randInt(n);
  const options = Array.from({ length: n }, (_, i) =>
    cellFromDesc(i === oddIndex ? oddDesc : base),
  );
  return { id: uid("odd"), type: "oddone", difficulty: d, prompt: [], options, answer: oddIndex };
}

// ------------------------------- MATRIX -------------------------------
function matrixCycle(attr: Attr): (number | string)[] {
  if (attr === "fill") return shuffle([...FILLS]); // len 2, index by r%2
  if (attr === "rotation") {
    const start = pick(ROTS);
    return [start, ((start + 90) % 360) as Rotation, ((start + 180) % 360) as Rotation];
  }
  if (attr === "size") return shuffle([...SIZES]);
  if (attr === "count") return pickN([1, 2, 3, 4], 3);
  return pickN([...KINDS], 3);
}

type Axis = "row" | "col" | "diag";
const AXES: Axis[] = ["row", "col", "diag"];

function genMatrix(d: number): AbstractItem {
  const numGov = d <= 4 ? 1 : d <= 7 ? 2 : 3; // expert ceiling: 3 governed attrs
  const govAttrs = pickN<Attr>(["rotation", "fill", "size", "count"], numGov);

  const base = randomDesc();
  base.size = 2;
  if (govAttrs.includes("rotation")) base.kind = pick(ROT_KINDS);

  const gov = govAttrs.map((a, idx) => ({
    a,
    // 1 governed attr → random axis; 2+ → row, col, then diagonal (r+c)
    axis: (numGov >= 2 ? AXES[idx] : pick<Axis>(["row", "col"])) as Axis,
    cyc: matrixCycle(a),
  }));

  const descAt = (r: number, c: number): Desc => {
    const desc = { ...base };
    for (const g of gov) {
      const idx = g.axis === "row" ? r : g.axis === "col" ? c : r + c;
      setAttr(desc, g.a, g.cyc[idx % g.cyc.length]);
    }
    return desc;
  };

  const prompt: Cell[] = [];
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      if (r === 2 && c === 2) continue;
      prompt.push(cellFromDesc(descAt(r, c)));
    }
  }
  const answerDesc = descAt(2, 2);
  const answerCell = cellFromDesc(answerDesc);

  const distractor = (): Cell => {
    const desc = { ...answerDesc };
    const g = pick(gov);
    const cur = getAttr(answerDesc, g.a);
    const alt = pick(g.cyc.filter((v) => v !== cur));
    if (alt !== undefined) setAttr(desc, g.a, alt);
    else setAttr(desc, pick(govAttrs), pick(valuesFor(pick(govAttrs))));
    return cellFromDesc(desc);
  };

  const { options, answer } = buildOptions(answerCell, distractor, 4);
  return { id: uid("mat"), type: "matrix", difficulty: d, prompt, options, answer };
}

// ------------------------------- dispatch -------------------------------
function genByType(type: AbstractType, d: number): AbstractItem {
  if (type === "sequence") return genSequence(d);
  if (type === "oddone") return genOddone(d);
  return genMatrix(d);
}

export function generateAbstractItem(
  type: AbstractType,
  difficulty: number,
  seed?: number,
): AbstractItem {
  const d = Math.min(10, Math.max(1, Math.round(difficulty)));
  if (seed === undefined) return genByType(type, d);
  const prev = RNG;
  RNG = mulberry32(seed >>> 0);
  try {
    return genByType(type, d);
  } finally {
    RNG = prev;
  }
}

const ROTATION: AbstractType[] = ["sequence", "matrix", "oddone"];

/** Pick a type by step index (interleaves the three patterns). */
export function typeForStep(step: number): AbstractType {
  return ROTATION[step % ROTATION.length];
}

/**
 * A stable numeric seed for a day (YYYYMMDD), from the single app-wide day
 * definition so the puzzles roll over at exactly the same instant as the
 * leaderboard row, the one-a-day gate and the streak.
 */
export function dateSeedNumber(d: Date = new Date()): number {
  return challengeDaySeed(d);
}

// Fixed difficulty ramp so the daily challenge is a standardized, comparable set.
const DAILY_DIFFICULTIES = [2, 3, 4, 5, 5, 6, 7, 7, 8, 9];

/** The same challenge for everyone on a given day (seeded, non-adaptive). */
export function generateDailyChallenge(
  dateNum: number,
  count = 10,
): AbstractItem[] {
  const items: AbstractItem[] = [];
  for (let i = 0; i < count; i++) {
    const type = typeForStep(i);
    const diff = DAILY_DIFFICULTIES[i % DAILY_DIFFICULTIES.length];
    items.push(generateAbstractItem(type, diff, dateNum * 100 + i));
  }
  return items;
}

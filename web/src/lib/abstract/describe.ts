import type { AbstractRule, Cell, RuleAttr } from "./types";
import type { Messages } from "@/i18n/messages";

/**
 * A text rendering of a figure cell.
 *
 * The abstract items are pure SVG, so without this a screen-reader user meets
 * four unnamed buttons and literally cannot take the assessment. Describing the
 * cell keeps the item *solvable* rather than merely navigable: the rule still
 * has to be inferred from the descriptions, exactly as sighted users infer it
 * from the drawings.
 */
export function describeCell(cell: Cell, t: Messages): string {
  const a = t.abstractA11y;
  if (cell.shapes.length === 0) return a.emptyCell;
  const s = cell.shapes[0];
  return a.cell(
    cell.shapes.length,
    a.kinds[s.kind],
    a.fills[s.fill],
    a.sizes[s.size],
    s.rotation,
  );
}

/** One attribute value, named in the reader's language. */
function valueName(attr: RuleAttr, v: number | string, t: Messages): string {
  const a = t.abstractA11y;
  switch (attr) {
    case "kind":
      return a.kinds[v as keyof typeof a.kinds] ?? String(v);
    case "fill":
      return a.fills[v as keyof typeof a.fills] ?? String(v);
    case "size":
      return a.sizes[v as 1 | 2 | 3] ?? String(v);
    case "rotation":
      return `${t.num(v)}°`;
    default:
      // Counts must use the reader's own digits — an Arabic card showed
      // "٣ مثلثات" in the item and "1 ← 2 ← 3" in the rule beside it.
      return t.num(v);
  }
}

/**
 * The generator's rule, as a sentence the learner can act on.
 * This is what turns "❌ wrong" into something teachable.
 */
export function describeRule(rule: AbstractRule, t: Messages): string {
  const r = t.abstractRules;
  const attr = r.attrs[rule.attr];
  const axis =
    rule.axis === "row"
      ? ` ${r.inRows}`
      : rule.axis === "col"
        ? ` ${r.inCols}`
        : rule.axis === "diag"
          ? ` ${r.inDiag}`
          : "";

  if (rule.kind === "odd") return r.odd(attr);

  if (rule.kind === "progression") {
    const step = rule.step ?? 90;
    // 270° one way is 90° the other — say the short way round, it's what a
    // learner actually perceives.
    const clockwise = step <= 180;
    const deg = clockwise ? step : 360 - step;
    return r.rotate(deg, clockwise) + axis;
  }

  const values = (rule.values ?? []).map((v) => valueName(rule.attr, v, t));
  if (rule.kind === "alternate") {
    return r.alternate(attr, values.join(" / ")) + axis;
  }
  return r.cycle(attr, values.join(` ${r.arrow} `)) + axis;
}

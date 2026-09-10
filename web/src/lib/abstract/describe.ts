import type { Cell } from "./types";
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

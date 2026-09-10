// Culture-fair, language-free abstract-reasoning items — procedurally generated.
// Shapes are monochrome (foreground color) so no rule ever depends on color,
// keeping items fair for color-blind users and free of cultural content.

export type ShapeKind = "circle" | "square" | "triangle" | "diamond" | "arrow";
export type Fill = "solid" | "outline";
export type Rotation = 0 | 90 | 180 | 270;
export type Size = 1 | 2 | 3;

export interface Shape {
  kind: ShapeKind;
  rotation: Rotation;
  fill: Fill;
  size: Size;
}

/** A visual cell = a set of shapes (usually identical, arranged by count). */
export interface Cell {
  shapes: Shape[];
}

export type AbstractType = "sequence" | "matrix" | "oddone";

export type RuleAttr = "count" | "kind" | "rotation" | "fill" | "size";

/**
 * The rule the generator actually used, emitted as DATA rather than a sentence
 * so it stays translatable — and so items become machine-auditable.
 *
 * Feedback used to be a bare ✅/❌: the learner knew they were wrong but never
 * why, which is training without learning.
 */
export interface AbstractRule {
  attr: RuleAttr;
  /**
   * progression — the value advances by a fixed step (rotation)
   * cycle       — the value walks a repeating list (count, kind, size)
   * alternate   — two values swap back and forth (fill)
   * odd         — three cells agree on this attribute and one doesn't
   */
  kind: "progression" | "cycle" | "alternate" | "odd";
  /** Which direction the rule runs in a matrix. */
  axis?: "row" | "col" | "diag";
  /** Degrees per step, for a rotation progression. */
  step?: number;
  /** The repeating list, in order, for a cycle. */
  values?: (number | string)[];
}

export interface AbstractItem {
  id: string;
  type: AbstractType;
  difficulty: number; // 1..10 (child → expert)
  // sequence: the visible row of cells (answer continues it)
  // matrix:   8 cells, row-major, the 9th (bottom-right) is the missing hole
  // oddone:   empty (the options themselves are the cells to compare)
  prompt: Cell[];
  options: Cell[];
  answer: number; // index into options
  /** Every rule governing this item, for the post-answer explanation. */
  rules: AbstractRule[];
}

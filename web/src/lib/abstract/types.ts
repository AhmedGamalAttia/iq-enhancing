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
}

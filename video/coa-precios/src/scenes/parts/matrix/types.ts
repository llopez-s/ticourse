import type { CSSProperties } from 'react';
import type { ActionId, CellId, PhaseId } from '../../../data/matrix';
import type { CellTone } from './Cell';
import type { MatrixLayoutOptions } from './layout';

/** State of one row; every field 0–1. */
export interface MatrixRowState {
  /** Steps the row back. */
  dim?: number;
  /** Cyan band: the voice is on this row. */
  lit?: number;
  /** Amber dashed band: a row left with one cell / unprotected. */
  warn?: number;
  /** Rose dashed band with a small siren: the HYPOTHETICAL alarm of s05 `flip` (Actions on Objectives only). */
  alert?: number;
  /** Shows the row's count of populated cells («3 celdas»). */
  count?: number;
}

/** State of one populated cell; numbers 0–1. */
export interface MatrixCellState {
  /** Presence (default 1). 0 = the cell is gone and its slot is empty (s04: Delivery left with its Deny). */
  show?: number;
  dim?: number;
  /** Highlight (border + glow) in `tone` (default 'cyan'). */
  lit?: number;
  tone?: CellTone;
  /** Lifts the cell as a readable card in front of the grid (text ≥ 32 px on screen). */
  lift?: number;
  /** Moves the lifted card from the cell's centre, in px (it is kept inside the grid). */
  shift?: { x?: number; y?: number };
  /** Glow on this cell's `[!]` mark (on top of `markFlash`). */
  mark?: number;
}

/** A label hung beside a cell (DENY / DISRUPT / a gloss). It may overhang the matrix. */
export interface MatrixLabel {
  cell: CellId;
  /** The strong part, e.g. 'DENY'. */
  text?: string;
  /** The plain part, e.g. 'no llega a funcionar'. */
  sub?: string;
  /** More plain lines stacked under the first (a gloss too long for one line). */
  lines?: string[];
  tone?: CellTone;
  side?: 'right' | 'left' | 'above' | 'below';
  /** 0–1. */
  show?: number;
  /** px of `sub` on screen (default 32); `text` is 1.15 × that. */
  size?: number;
  /** Extra offset in px. */
  dx?: number;
  dy?: number;
}

export interface MatrixProps extends MatrixLayoutOptions {
  /** Width in px (default 1000 = scale 1). Height: matrixSize(opts, width).h. */
  width?: number;
  /** 0–1: the whole piece comes in. */
  show?: number;
  /** 0–1: the whole piece steps back. */
  dim?: number;
  /** 0–1 per action: its column header lights (a column «lights when named»). */
  cols?: Partial<Record<ActionId, number>>;
  rows?: Partial<Record<PhaseId, MatrixRowState>>;
  cells?: Partial<Record<CellId, MatrixCellState>>;
  /** 0–1 for every row at once (or use rows[id].count). */
  counts?: number;
  /** 0–1: the two strips («casi nunca a tu alcance», «Discover y Destroy no ocupan celda…»). Default 1. */
  strips?: number;
  /** 0–1: the legend «[!] = acción visible para el actor» takes the strips' place (≥ 32 px). */
  legend?: number;
  /** 0–1: a flash on the three `[!]` marks. */
  markFlash?: number;
  labels?: MatrixLabel[];
  style?: CSSProperties;
}

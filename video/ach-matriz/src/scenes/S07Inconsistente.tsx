import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { FONT } from '../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../engine/src/theme/motion';
import { mix } from '../../../engine/src/ui';
import type { CellId } from '../data/matrix';
import { S07_TEXT } from '../data/s07-inconsistente';
import { DogNotes, Suspects, dogNotesSize, suspectsSize } from './parts/Kitchen';
import { Matrix, matrixSize, type MatrixFocus, type MatrixLayoutOptions } from './parts/Matrix';
import { NEVER, Place, Strip, viewWeight } from './parts/s05-matriz/views';
import { Stage, segment, wordFrame } from './kit';

const S = 's07-inconsistente';
const STAGE_W = 1728;
const STAGE_H = 660;

/** s07's board: no title or legend (room for both count rows and the winner tab). */
const LAYOUT: MatrixLayoutOptions = { title: false, legend: 'none', counts: 'CI' };
const BASE = matrixSize(LAYOUT);
/** The winner tab hangs this far under the box at scale 1. */
const TAB = matrixSize(LAYOUT).overhang.bottom;

/** Under PAPER CRANE's card (it ends at stage y ≈ 141): the header row starts at y ≈ 195. */
const LOW_S = 0.69;
const LOW = { width: BASE.w * LOW_S, x: (STAGE_W - BASE.w * LOW_S) / 2, y: STAGE_H - BASE.h * LOW_S } as const;
/** After the card: as big as the two count rows and the winner tab allow. */
const MAIN_S = 0.86;
const MAIN = { width: BASE.w * MAIN_S, x: (STAGE_W - BASE.w * MAIN_S) / 2, y: 4 } as const;
/** With the closing strip under it. */
const STRIP_S = 0.68;
const STRIP_FRAME = { width: BASE.w * STRIP_S, x: (STAGE_W - BASE.w * STRIP_S) / 2, y: 0 } as const;
const STRIP_TOP = STRIP_FRAME.y + (BASE.h + TAB) * STRIP_S + 34;

const SUSPECTS_W = 1060;
const SUSPECTS = suspectsSize(SUSPECTS_W);
/** Middle of what the line-up draws without tags (silhouettes 112 → names ≈ 532, design units). */
const SUSPECTS_VISIBLE_MID = 322;
const NOTES_W = 520;
const NOTES = dogNotesSize(NOTES_W);
const NOTES_X = STAGE_W - NOTES_W - 10;

const C_CELLS = ['E1-H1', 'E1-H2', 'E1-H3', 'E2-H1', 'E3-H1', 'E4-H1'] as CellId[];
const I_CELLS = ['E2-H2', 'E3-H2', 'E4-H2', 'E3-H3', 'E4-H3'] as CellId[];

/**
 * s07-inconsistente «Gana la que no puedes tumbar».
 *   (intercept)  PAPER CRANE: «Cuenta las que te dan la razón…». The board sits low and
 *                small (scale 0.69) under the card, which stays up to the end of s07-01.
 *   count-c      (from «cuentas») the C light up and the «cuenta de C» row fills 4 · 1 · 1 as the voice
 *                counts; on «engaña» it is struck out. Then the board grows (0.86) and
 *                E1's three C light: the phishing gives a C to every column.
 *   count-i      the I light up and «Inconsistencias» fills 0 · 3 · 2 (cero, tres, dos).
 *   least        H1 framed in emerald, «la menos inconsistente», with the I row.
 *   dog          the kitchen: the dog's five notes for him, then (lethal) the rose «no sabe
 *                abrir la nevera»; on «sacarlo» the dog leaves the line-up.
 *   not-proven   the board again, smaller, with the strip «nadie demuestra una hipótesis;
 *                se descartan las demás» under it; the I row lights on «lo que tumba».
 */
export function S07Inconsistente(props: SceneProps) {
  const frame = useCurrentFrame();
  const w = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);

  const countI = props.cue('count-i');
  const least = props.cue('least');
  const dog = props.cue('dog');
  const lethal = props.cue('lethal');
  const notProven = props.cue('not-proven');
  // PAPER CRANE's card owns the top band until s07-01 has been heard.
  const interceptEnd = segment(props, 's07-01').to;

  const at = {
    cuentas: w('s07-01', 'cuentas'),
    four: w('s07-01', 'cuatro'),
    one: w('s07-01', 'una', 0),
    oneMore: w('s07-01', 'una', 1),
    engana: w('s07-01', 'engaña'),
    phishing: w('s07-02', 'phishing'),
    tumba: w('s07-03', 'tumba'),
    zero: w('s07-03', 'cero'),
    three: w('s07-03', 'tres'),
    two: w('s07-03', 'dos'),
    winner: least + 2,
    favor: w('s07-05', 'Tiene'),
    sacarlo: w('s07-05', 'sacarlo'),
    tumbaEnd: w('s07-07', 'tumba'),
  };

  // One zoom per cell for the scene: the C 1.15, the I 1.25.
  const focus: MatrixFocus[] = [
    { cells: C_CELLS, rows: ['countC'], zoom: 1.15, from: at.cuentas, to: at.engana + 8 },
    { rows: ['E1'], cells: ['E1-H1', 'E1-H2', 'E1-H3'], zoom: 1.15, from: at.phishing, to: countI },
    { cells: I_CELLS, rows: ['countI'], zoom: 1.25, from: at.tumba, to: least },
    // The winner: H1's column and the I row (every focus touches H1, so its frame stays bright).
    { cols: ['H1'], rows: ['countI'], from: least, to: dog },
    { rows: ['countI'], from: at.tumbaEnd, dimRest: false },
  ];

  // Framing.
  const grow = progress(frame, interceptEnd, 22, EASE.inOut);
  const late = frame >= notProven - 20;
  const frameOf = late ? STRIP_FRAME : { width: mix(LOW.width, MAIN.width, grow), x: mix(LOW.x, MAIN.x, grow), y: mix(LOW.y, MAIN.y, grow) };
  const boardOn = late ? viewWeight(frame, notProven) : viewWeight(frame, undefined, dog);
  const kitchenOn = viewWeight(frame, dog, notProven);

  return (
    <Stage style={{ fontFamily: FONT.sans }}>
      <Place x={frameOf.x} y={frameOf.y} opacity={boardOn}>
        <Matrix
          {...LAYOUT}
          width={frameOf.width}
          countAt={{ C: { H1: at.four, H2: at.one, H3: at.oneMore }, I: { H1: at.zero, H2: at.three, H3: at.two } }}
          strikeCAt={at.engana}
          winnerAt={at.winner}
          strongLinkAt={NEVER}
          focus={focus}
          frame={frame}
        />
      </Place>

      {/* The kitchen: the dog, his notes, and the one that takes him out. */}
      {kitchenOn > 0.001 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: kitchenOn }}>
          {/* The line-up's top band (s04's «¿pudo?» tags) is empty here: centre the silhouettes and names instead. */}
          <Place x={10} y={STAGE_H / 2 - SUSPECTS_VISIBLE_MID * SUSPECTS.scale}>
            <Suspects width={SUSPECTS_W} at={dog - 4} focus={[{ id: 'dog', from: dog }]} leaveAt={{ dog: at.sacarlo }} frame={frame} />
          </Place>
          <Place x={NOTES_X} y={(STAGE_H - NOTES.h) / 2}>
            <DogNotes width={NOTES_W} notesAt={[0, 1, 2, 3, 4].map((i) => at.favor + i * 10)} lethalAt={lethal} frame={frame} />
          </Place>
        </div>
      ) : null}

      {late ? (
        <div style={{ position: 'absolute', left: 0, top: STRIP_TOP, width: STAGE_W, display: 'flex', justifyContent: 'center' }}>
          <Strip tone="emerald" size={44} p={progress(frame, notProven + 4, 16)} glow={1 - progress(frame, notProven + 30, 40, EASE.inOut)}>
            {S07_TEXT.notProven}
          </Strip>
        </div>
      ) : null}
    </Stage>
  );
}

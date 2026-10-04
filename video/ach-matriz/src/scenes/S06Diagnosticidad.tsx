import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { FONT } from '../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../engine/src/theme/motion';
import { mix } from '../../../engine/src/ui';
import type { CellId, EvId } from '../data/matrix';
import { S06_TEXT } from '../data/s06-diagnosticidad';
import { Kitchen, kitchenSize } from './parts/Kitchen';
import { Matrix, matrixColBox, matrixSize, type MatrixFocus, type MatrixLayoutOptions } from './parts/Matrix';
import { CONTRAST_ROW, ContrastRow, rowIn } from './parts/s06-diagnosticidad/Contrast';
import { NEVER, Place, TermName, topFadeMask, viewWeight } from './parts/s05-matriz/views';
import { S05_LAYOUT, S05_MAIN, S05_THINK } from './S05Matriz';
import { Stage, wordFrame } from './kit';

const S = 's06-diagnosticidad';
const STAGE_W = 1728;

/** Same bands as s05 plus the diagnosticity column: the cells keep their x, the panel grows to the right. */
const DIAG_LAYOUT: MatrixLayoutOptions = { ...S05_LAYOUT, diag: true };
const DIAG_W = matrixSize(DIAG_LAYOUT).w;
const DIAG_X = (STAGE_W - DIAG_W) / 2;

const KITCHEN_W = 1300;
const KITCHEN = kitchenSize(KITCHEN_W);

/**
 * s06-diagnosticidad «La pista que vale para todos». Opens where s05 left
 * off (the board low, E1 and E2 highlighted) and:
 *   answer         the board rises back to full size; E2 lights («pesan más los seis meses»),
 *                  then E1 with its three C («el phishing encaja con las tres»).
 *   fade-e1        the board slides left and grows its «Diagnosticidad» column; on «apagar»
 *                  E1 goes grey, and on «no separa nada» it gets «NULA» (kept legible).
 *   hungry         the kitchen: on «tenía hambre» the tag sticks to all three suspects at
 *                  once and pushes nobody out.
 *   high-rows      back to the board: E2's I against crime zooms, «ALTA» lands on E2 on
 *                  «sí separa», then on E3 and E4 («las otras dos, también»).
 *   diagnosticity  two rows lifted out of the board, the lesson's contrast: «usa phishing:
 *                  vale para las tres» (NULA) against «nada de cobrar en seis meses: choca
 *                  con el dinero» (ALTA); then the name, «diagnosticidad» and DIAGNOSTICITY —
 *                  all on screen before the exam card, which comes in on «Una prueba…».
 *                  Only emphasis after that: E2 lights on «separa», E1 steps back on «brilla».
 */
export function S06Diagnosticidad(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const w = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);

  const answer = props.cue('answer');
  const fadeE1 = props.cue('fade-e1');
  const hungry = props.cue('hungry');
  const highRows = props.cue('high-rows');
  const diagnosticity = props.cue('diagnosticity');

  const at = {
    phishing: w('s06-01', 'phishing'),
    apagar: w('s06-02', 'apagar'),
    nula: w('s06-02', 'separa'),
    comio: w('s06-03', 'comió'),
    hambre: w('s06-03', 'hambre'),
    crimen: w('s06-04', 'crimen'),
    alta: w('s06-04', 'separa'),
    otras: w('s06-04', 'las'),
    altaE3: w('s06-04', 'otras'),
    altaE4: w('s06-04', 'dos'),
    separar: w('s06-05', 'separar'),
    termEs: w('s06-05', 'diagnosticidad'),
    termEn: w('s06-05', 'diagnosticity'),
    separa: w('s06-05', 'separa'),
    brilla: w('s06-05', 'brilla'),
  };

  const E1 = ['E1-H1', 'E1-H2', 'E1-H3'] as CellId[];
  const focus: MatrixFocus[] = [
    // Continuity with the end of s05 (think prompt: E1 and E2).
    { rows: ['E1', 'E2'], from: -40, to: answer },
    // One zoom per cell for the whole scene (the part takes the max): E2's cells 1.32, E1's 1.25.
    { rows: ['E2'], cells: ['E2-H1', 'E2-H2', 'E2-H3'], zoom: 1.32, from: answer, to: at.phishing },
    { rows: ['E1'], cells: E1, zoom: 1.25, from: at.phishing, to: at.apagar },
    { rows: ['E1'], from: at.nula - 6, to: hungry },
    // Back from the kitchen: highlight without dimming, so the greyed E1 keeps its «NULA» legible.
    { rows: ['E2'], dimRest: false, from: highRows, to: at.crimen },
    { rows: ['E2'], cells: ['E2-H2'], zoom: 1.32, dimRest: false, from: at.crimen, to: at.otras },
    { rows: ['E3', 'E4'], dimRest: false, from: at.otras, to: diagnosticity },
  ];
  const diagAt: Partial<Record<EvId, number>> = { E1: at.nula, E2: at.alta, E3: at.altaE3, E4: at.altaE4 };
  const matrixCommon = {
    focus,
    fadeRows: { E1: at.apagar } as Partial<Record<EvId, number>>,
    // «strong link» is s08's reveal: keep it off here.
    strongLinkAt: NEVER,
    frame,
  };

  // Framing of the board: s05's think framing → full size (answer) → slid left for the
  // diagnosticity column (fade-e1).
  const rise = progress(frame, answer - 6, 22, EASE.inOut);
  const slide = progress(frame, fadeE1 - 4, 18, EASE.inOut);
  const width = mix(S05_THINK.width, S05_MAIN.width, rise);
  const x = mix(mix(S05_THINK.x, S05_MAIN.x, rise), DIAG_X, slide);
  const y = mix(S05_THINK.y, S05_MAIN.y, rise);
  const band = matrixColBox('H1', S05_LAYOUT, width).y;
  const mask = topFadeMask(band, rise);

  // The diag-column board takes over from the plain one once the slide is done (same x, same scale).
  const grow = progress(frame, fadeE1 + 12, 8, EASE.inOut);
  const board1 = viewWeight(frame, undefined, hungry);
  const board2 = viewWeight(frame, highRows, diagnosticity);
  const plainOn = board1 * (1 - progress(frame, fadeE1 + 15, 8, EASE.inOut));
  const diagOn = frame < highRows - 20 ? board1 * grow : board2;
  const kitchenOn = viewWeight(frame, hungry, highRows);
  const contrastOn = viewWeight(frame, diagnosticity);

  // Contrast block layout.
  const NAME_TOP = 84;
  const ROW1_TOP = 302;
  const ROW_GAP = 26;
  const rowX = (STAGE_W - CONTRAST_ROW.w) / 2;

  return (
    <Stage style={{ fontFamily: FONT.sans }}>
      {/* The board: the plain s05 layout, then the one with the diagnosticity column. */}
      {diagOn > 0.001 ? (
        <Place x={x} y={y} opacity={diagOn}>
          <Matrix {...DIAG_LAYOUT} width={DIAG_W * (width / S05_MAIN.width)} diagAt={diagAt} {...matrixCommon} />
        </Place>
      ) : null}
      {plainOn > 0.001 ? (
        <Place x={x} y={y} opacity={plainOn} style={mask}>
          <Matrix {...S05_LAYOUT} width={width} {...matrixCommon} />
        </Place>
      ) : null}

      {/* The kitchen: «tenía hambre» on all three. */}
      <Place x={(STAGE_W - KITCHEN.w) / 2} y={(660 - KITCHEN.h) / 2} opacity={kitchenOn} style={{ transform: `scale(${0.97 + 0.03 * kitchenOn})` }}>
        <Kitchen width={KITCHEN_W} at={hungry - 2} missingAt={at.comio} hungryAt={at.hambre - 2} frame={frame} />
      </Place>

      {/* The contrast and the name. */}
      {contrastOn > 0.001 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: contrastOn }}>
          <TermName es={S06_TEXT.termEs} en={S06_TEXT.termEn} esAt={at.termEs - 4} enAt={at.termEn - 4} frame={frame} fps={fps} style={{ position: 'absolute', left: 0, top: NAME_TOP, width: STAGE_W }} />
          {S06_TEXT.contrast.map((c, i) => {
            const isE2 = c.ev === 'E2';
            const enterAt = isE2 ? at.separar - 6 : diagnosticity + 6;
            return (
              <Place key={c.ev} x={rowX} y={ROW1_TOP + i * (CONTRAST_ROW.h + ROW_GAP)}>
                <ContrastRow
                  ev={c.ev}
                  text={c.text}
                  p={rowIn(frame, enterAt)}
                  emph={isE2 ? progress(frame, at.separa - 4, 14) : 0}
                  dim={isE2 ? 0 : progress(frame, at.brilla - 2, 16, EASE.inOut)}
                />
              </Place>
            );
          })}
        </div>
      ) : null}
    </Stage>
  );
}

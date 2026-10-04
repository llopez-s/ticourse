import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, alpha } from '../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../engine/src/theme/motion';
import { mix, windowWeight } from '../../../engine/src/ui';
import { CELL_IDS, MATRIX_TEXT, type CellId } from '../data/matrix';
import { Matrix, matrixCellBox, matrixColBox, matrixSize, type MatrixFocus, type MatrixLayoutOptions } from './parts/Matrix';
import { topFadeMask } from './parts/s05-matriz/views';
import { Stage, wordFrame } from './kit';

const S = 's05-matriz';

/** The matrix of s05 (and of s06 until the diagnosticity column comes in): title + legend band, no counts. */
export const S05_LAYOUT: MatrixLayoutOptions = { title: true, legend: 'band' };

const STAGE_W = 1728;
const BASE = matrixSize(S05_LAYOUT);
/** Main framing: scale 1, centred, the full 652-high board. */
export const S05_MAIN = { width: BASE.w, x: (STAGE_W - BASE.w) / 2, y: 4 } as const;
/**
 * Think-prompt framing (end of s05, start of s06): scale 0.87, the title and
 * legend bands faded out and the header row pushed down to y 200, clear of
 * the «PAUSA · PIENSA» card (it ends at stage y ≈ 164).
 */
const THINK_SCALE = 0.87;
const THINK_W = BASE.w * THINK_SCALE;
const THINK_BAND = matrixColBox('H1', S05_LAYOUT, THINK_W).y;
export const S05_THINK = { width: THINK_W, x: (STAGE_W - THINK_W) / 2, y: 200 - THINK_BAND, band: THINK_BAND } as const;

/**
 * s05-matriz «Celda a celda» — the demo. The lesson's ACH extract builds on
 * screen at scale 1:
 *   grid       the panel and its title are already there; the hypotheses come in as
 *              columns, the evidence as rows, and twelve dashed slots ripple in on
 *              «cada prueba contra cada hipótesis».
 *   legend     C = encaja · I = choca · N = no dice nada.
 *   row-e1     E1 highlighted, its three C land as the voice names espionaje, crimen,
 *              hacktivistas, and stay zoomed on «Tres C».
 *   row-e2     E2 highlighted; in s05-05 its cells land one by one in the voice's order
 *              (C encaja · I choca · N ni les va ni les viene), each zoomed while it is
 *              explained, with «el ransomware cobra rápido» under the I of H2.
 *   rows-e3e4  E3 and E4 faster (C I I each), then their C and their I in turn.
 *   full       the full board glows: no counts, no diagnosticity yet. On the question,
 *              E1 then E2 are highlighted, and the board drops (title and legend fade)
 *              so the think prompt has the top of the stage.
 */
export function S05Matriz(props: SceneProps) {
  const frame = useCurrentFrame();
  const w = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);

  const rowE1 = props.cue('row-e1');
  const rowE2 = props.cue('row-e2');
  const rowsE3E4 = props.cue('rows-e3e4');
  const full = props.cue('full');

  const at = {
    cols: w('s05-01', 'Hipótesis') - 4,
    rows: w('s05-01', 'pruebas') - 4,
    slots: w('s05-01', 'cada'),
    legend: props.cue('legend') + 4,
    e1: [w('s05-03', 'espionaje'), w('s05-03', 'crimen'), w('s05-03', 'hacktivistas')],
    tres: w('s05-03', 'Tres'),
    e2: [w('s05-05', 'espionaje'), w('s05-05', 'crimen'), w('s05-05', 'hacktivistas')],
    e2Crime: w('s05-05', 'Con', 1),
    e2Hack: w('s05-05', 'A'),
    ransom: w('s05-05', 'ransomware'),
    e3: w('s05-06', 'diseños') - 2,
    e3Row: w('s05-06', 'Solo'),
    e4: w('s05-06', 'certificado') - 2,
    e4Row: w('s05-06', 'Y'),
    fit: w('s05-07', 'encajan'),
    clash: w('s05-07', 'chocan'),
    s07: w('s05-07', 'Las'),
    phishing: w('s05-08', 'phishing'),
    sixMonths: w('s05-08', 'seis'),
    lower: w('s05-08', 'pesa') - 16,
  };

  const revealAt: Record<CellId, number> = {
    'E1-H1': at.e1[0],
    'E1-H2': at.e1[1],
    'E1-H3': at.e1[2],
    'E2-H1': at.e2[0],
    'E2-H2': at.e2[1],
    'E2-H3': at.e2[2],
    'E3-H1': at.e3,
    'E3-H2': at.e3 + 6,
    'E3-H3': at.e3 + 12,
    'E4-H1': at.e4,
    'E4-H2': at.e4 + 6,
    'E4-H3': at.e4 + 12,
  };

  // One zoom value per cell for the whole scene (the part takes the max over entries).
  const E1 = ['E1-H1', 'E1-H2', 'E1-H3'] as CellId[];
  const E3 = ['E3-H1', 'E3-H2', 'E3-H3'] as CellId[];
  const E4 = ['E4-H1', 'E4-H2', 'E4-H3'] as CellId[];
  const focus: MatrixFocus[] = [
    { rows: ['E1'], cells: E1, zoom: 1.25, from: rowE1, to: rowE2 },
    { rows: ['E2'], from: rowE2, to: at.e2[0] },
    { rows: ['E2'], cells: ['E2-H1'], zoom: 1.32, from: at.e2[0], to: at.e2Crime },
    { rows: ['E2'], cells: ['E2-H2'], zoom: 1.32, from: at.e2Crime, to: at.e2Hack },
    { rows: ['E2'], cells: ['E2-H3'], zoom: 1.32, from: at.e2Hack, to: rowsE3E4 },
    { rows: ['E3'], cells: E3, zoom: 1.2, from: at.e3Row, to: at.e4Row },
    { rows: ['E4'], cells: E4, zoom: 1.2, from: at.e4Row, to: at.s07 },
    { rows: ['E3', 'E4'], cells: ['E3-H1', 'E4-H1'], zoom: 1.2, from: at.fit, to: at.clash },
    { rows: ['E3', 'E4'], cells: ['E3-H2', 'E3-H3', 'E4-H2', 'E4-H3'], zoom: 1.2, from: at.clash, to: full },
    // The think question: phishing (E1) against six months (E2).
    { rows: ['E1'], from: at.phishing },
    { rows: ['E2'], from: at.sixMonths },
  ];

  // Framing: main, then the drop for the think prompt.
  const lower = progress(frame, at.lower, 24, EASE.inOut);
  const width = mix(S05_MAIN.width, S05_THINK.width, lower);
  const x = mix(S05_MAIN.x, S05_THINK.x, lower);
  const y = mix(S05_MAIN.y, S05_THINK.y, lower);
  const band = matrixColBox('H1', S05_LAYOUT, width).y;
  const glow = 0.85 * windowWeight(frame, full, at.lower + 10, { ramp: 14, lead: 2 });

  return (
    <Stage style={{ fontFamily: FONT.sans }}>
      <div style={{ position: 'absolute', left: x, top: y, ...topFadeMask(band, 1 - lower) }}>
        <Matrix
          {...S05_LAYOUT}
          width={width}
          colsAt={at.cols}
          rowsAt={at.rows}
          legendAt={at.legend}
          revealAt={revealAt}
          focus={focus}
          notes={[{ anchor: 'E2-H2', text: MATRIX_TEXT.ransomNote, at: at.ransom - 4, to: at.e2Hack + 14, tone: 'rose' }]}
          glow={glow}
          frame={frame}
        />
        <Slots frame={frame} width={width} startAt={at.slots} revealAt={revealAt} until={at.lower} />
      </div>
    </Stage>
  );
}

/**
 * Twelve dashed slots — every piece of evidence against every hypothesis —
 * that ripple in on «cada prueba contra cada hipótesis» and give way to each
 * cell as it lands.
 */
function Slots({ frame, width, startAt, revealAt, until }: { frame: number; width: number; startAt: number; revealAt: Record<CellId, number>; until: number }) {
  if (frame < startAt || frame > until) return null;
  const s = width / BASE.w;
  return (
    <>
      {CELL_IDS.map((id, i) => {
        const box = matrixCellBox(id, S05_LAYOUT, width);
        const inP = progress(frame, startAt + i * 3, 10);
        const out = progress(frame, revealAt[id] - 2, 8, EASE.inOut);
        const o = inP * (1 - out);
        if (o <= 0.001) return null;
        const tw = 84 * s;
        const th = 68 * s;
        return (
          <div
            key={id}
            style={{
              position: 'absolute',
              left: box.cx - tw / 2,
              top: box.cy - th / 2,
              width: tw,
              height: th,
              boxSizing: 'border-box',
              borderRadius: 14 * s,
              border: `${3 * s}px dashed ${alpha(C.muted, 0.6)}`,
              background: alpha(C.ink700, 0.35),
              opacity: o,
              transform: `scale(${0.7 + 0.3 * inP})`,
              zIndex: 3,
            }}
          />
        );
      })}
    </>
  );
}

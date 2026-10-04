import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { EASE, progress, springIn } from '../../../engine/src/theme/motion';
import { mix, windowWeight } from '../../../engine/src/ui';
import { MATRIX_TEXT, type CellId } from '../data/matrix';
import { S08_TEXT } from '../data/s08-sensibilidad';
import { AssumptionSheet, sheetSize } from './parts/AssumptionSheet';
import { Matrix, matrixSize, matrixRowBox, type MatrixFocus, type MatrixLayoutOptions } from './parts/Matrix';
import { Pocket, pocketSize } from './parts/Pocket';
import { ConclusionTable, Stool, TABLE_TEXT, tableSize } from './parts/Table';
import { NEVER, Place, TermName, viewWeight } from './parts/s05-matriz/views';
import { Stage, segment, wordFrame } from './kit';

const S = 's08-sensibilidad';
const STAGE_W = 1728;
const STAGE_H = 660;

/**
 * s08's board: no title or legend, the «Inconsistencias» row, H1's winner
 * frame (its tab hangs below). No diagnosticity column: the «strong link»
 * tag and the plant note are drawn beside E4 by this scene (StrongLinkCallout),
 * bigger than the part's own tag, so the board can sit next to the table later.
 */
const LAYOUT: MatrixLayoutOptions = { title: false, legend: 'none', counts: 'I' };
const BASE = matrixSize(LAYOUT);
const TAB = BASE.overhang.bottom;
/** Room the callout's tag takes right of the box in the think framing. */
const TAG_ROOM = 250;

type Framing = { s: number; x: number; y: number };
/** Under PAPER CRANE's card: the header row starts at y ≈ 210. */
const LOW: Framing = { s: 0.68, x: (STAGE_W - BASE.w * 0.68) / 2, y: STAGE_H - (BASE.h + TAB) * 0.68 };
/** E4 is the subject: big, left, with the tag and the note in the right column. */
const BIG: Framing = { s: 0.88, x: 0, y: (STAGE_H - (BASE.h + TAB) * 0.88) / 2 };
/** Think prompt: smaller and low, the header row clear of the card. */
const THINK: Framing = { s: 0.66, x: (STAGE_W - BASE.w * 0.66 - TAG_ROOM) / 2, y: STAGE_H - (BASE.h + TAB) * 0.66 };
/** Beside the table. */
const SIDE: Framing = { s: 0.78, x: STAGE_W - BASE.w * 0.78, y: (STAGE_H - (BASE.h + TAB) * 0.78) / 2 };

const mixF = (a: Framing, b: Framing, t: number): Framing => ({ s: mix(a.s, b.s, t), x: mix(a.x, b.x, t), y: mix(a.y, b.y, t) });

/** Sheet and pocket. */
const SHEET_W = 814;
const SHEET = sheetSize(SHEET_W);
const POCKET_W = 600;
const POCKET = pocketSize(POCKET_W);

/** Table / stool framings: width, left x and the floor line they stand on. */
type Prop = { w: number; x: number; floor: number };
/** Floor line of Table / Stool (both 760 × 520 design units, floor at 470), per px of width. */
const FLOOR_RATIO = 470 / 760;
/** Top of the Stool's seat (470 − 300 − 42 design units under the box top), per px of width. */
const SEAT_RATIO = 128 / 760;
const propTop = (p: Prop) => p.floor - FLOOR_RATIO * p.w;
const T_SIDE: Prop = { w: 560, x: 0, floor: (STAGE_H - tableSize(560).h) / 2 + FLOOR_RATIO * 560 };
const T_DUO: Prop = { w: 680, x: 120, floor: 600 };
const T_NAME: Prop = { w: 600, x: 200, floor: 640 };
const S_DUO: Prop = { w: 620, x: 940, floor: 600 };
const S_NAME: Prop = { w: 540, x: 980, floor: 640 };
const mixP = (a: Prop, b: Prop, t: number): Prop => ({ w: mix(a.w, b.w, t), x: mix(a.x, b.x, t), floor: mix(a.floor, b.floor, t) });

const E4_CELLS = ['E4-H1', 'E4-H2', 'E4-H3'] as CellId[];

/**
 * s08-sensibilidad «Quita una pata».
 *   (intercept)  PAPER CRANE: «Si una prueba es falsa, se te cae todo…». Under the card, the
 *                board as s07 left it (H1, «la menos inconsistente»), low and small.
 *   assume-2     the KEY ASSUMPTIONS CHECK sheet returns with assumption 2 highlighted; on
 *                «Toca palparse el bolsillo» the hand pats the pocket (phone, wallet) for a beat.
 *   strong-link  the board, big: E4 highlighted, «strong link» lands beside it on «la más fuerte»
 *                and, on «justo», the amber note «justo lo que alguien podría plantar» (nobody
 *                named, nothing said about whether it happened). On «¿cambia…?» the board drops
 *                for the think prompt, E4 and the I row highlighted.
 *   pull-e4      the conclusion as a table in profile, legs E2 · E4 · E3 (the legs light on the
 *                board as «las pruebas que separan»); on «Quitas la del certificado» the E4 leg is
 *                pulled out (ghost left, the table stays up) and E4's row goes grey.
 *   recount      «Inconsistencias» recounts without E4: 0 · 2 · 1, «sin E4».
 *   stands       H1 still framed, the tabletop glows; the six months and the designs against
 *                crime (E2·H2, E3·H2), then the designs against the hacktivists (E3·H3).
 *   stool        the one-legged stool «solo E4» beside the table; «baja la confianza» on
 *                «bajar», it tips over on «cae».
 *   sensitivity  «análisis de sensibilidad» / SENSITIVITY ANALYSIS above the table and the stool.
 */
export function S08Sensibilidad(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const w = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);

  const assume2 = props.cue('assume-2');
  const strongLink = props.cue('strong-link');
  const pullE4 = props.cue('pull-e4');
  const recount = props.cue('recount');
  const stands = props.cue('stands');
  const stool = props.cue('stool');
  const sensitivity = props.cue('sensitivity');
  const interceptEnd = segment(props, 's08-01').to;

  const at = {
    segundo: w('s08-02', 'segundo'),
    toca: w('s08-02', 'Toca'),
    palparse: w('s08-02', 'palparse'),
    fuerte: w('s08-03', 'fuerte'),
    justo: w('s08-03', 'justo'),
    lower: w('s08-04', 'cambia') - 14,
    patas: w('s08-05', 'tres'),
    pruebas: w('s08-05', 'pruebas'),
    quitas: w('s08-05', 'Quitas'),
    pull: w('s08-05', 'certificado') - 6,
    seis: w('s08-06', 'seis'),
    disenos2: w('s08-06', 'diseños', 1),
    bajar: w('s08-07', 'bajar'),
    cae: w('s08-07', 'cae', 0),
    analisis: w('s08-08', 'análisis'),
    sensitivityWord: w('s08-08', 'sensitivity'),
    aguantaName: w('s08-08', 'aguanta'),
  };

  // ---- the board
  // Every entry touches H1 (or does not dim), so the winner frame stays bright.
  const focus: MatrixFocus[] = [
    // E4, the strong link.
    { rows: ['E4'], cells: E4_CELLS, zoom: 1.12, from: strongLink, to: at.lower },
    // Think prompt: E4 and the count it feeds.
    { rows: ['E4', 'countI'], cells: E4_CELLS, zoom: 1.12, from: at.lower, to: at.pruebas },
    // The three legs: the evidence that separates.
    { rows: ['E2', 'E3', 'E4'], cells: ['E2-H1', 'E3-H1', 'E4-H1'], zoom: 1.12, from: at.pruebas, to: at.pull },
    { cols: ['H1'], rows: ['countI'], from: recount, to: at.seis },
    // What still knocks out each alternative without E4: E2 + E3 against H2, E3 against H3 (never E2 against H3).
    { cells: ['E2-H2', 'E3-H2'], zoom: 1.3, dimRest: false, from: at.seis, to: at.disenos2 },
    { cells: ['E3-H3'], zoom: 1.3, dimRest: false, from: at.disenos2, to: stool },
  ];

  const toThink = progress(frame, at.lower, 24, EASE.inOut);
  const toSide = progress(frame, pullE4 - 4, 24, EASE.inOut);
  const early = frame < assume2 + 20;
  const board: Framing = early ? LOW : mixF(mixF(BIG, THINK, toThink), SIDE, toSide);
  const boardOn = early ? viewWeight(frame, undefined, assume2) : viewWeight(frame, strongLink, stool);
  const boardW = BASE.w * board.s;

  // ---- the strong-link callout, anchored to E4's row wherever the board is
  const e4 = matrixRowBox('E4', LAYOUT, boardW);
  const tagOn = viewWeight(frame, at.fuerte - 4, pullE4, 10, 12) * boardOn;
  const noteOn = windowWeight(frame, at.justo, at.lower, { ramp: 12, lead: 2 });

  // ---- sheet + pocket
  const sheetOn = viewWeight(frame, assume2, strongLink);
  const aside = progress(frame, at.toca - 10, 20, EASE.inOut);
  const sheetX = mix((STAGE_W - SHEET.w) / 2, 30, aside);
  const sheetY = mix(Math.max(196, (STAGE_H - SHEET.h) / 2), (STAGE_H - SHEET.h) / 2, Math.max(aside, progress(frame, interceptEnd, 20, EASE.inOut)));
  const pocketOn = viewWeight(frame, at.toca - 6, strongLink + 6);

  // ---- table + stool
  const tableOn = viewWeight(frame, pullE4);
  const duo = progress(frame, stool - 6, 22, EASE.inOut);
  const named = progress(frame, sensitivity - 4, 22, EASE.inOut);
  const tableP = mixP(mixP(T_SIDE, T_DUO, duo), T_NAME, named);
  const stoolP = mixP(S_DUO, S_NAME, named);
  const stoolOn = viewWeight(frame, stool);
  const tableGlow = 0.9 * windowWeight(frame, stands, stool, { ramp: 14 }) + 0.7 * windowWeight(frame, at.aguantaName, Number.POSITIVE_INFINITY, { ramp: 14 });

  return (
    <Stage style={{ fontFamily: FONT.sans }}>
      {/* The board: under the card, then E4, the think prompt, beside the table. */}
      <Place x={board.x} y={board.y} opacity={boardOn}>
        <Matrix {...LAYOUT} width={boardW} winnerAt={-100} fadeRows={{ E4: at.pull }} recountAt={recount + 4} focus={focus} frame={frame} />
      </Place>
      {tagOn > 0.001 ? (
        <StrongLinkCallout x={board.x + boardW} y={board.y + e4.y + e4.h / 2} p={tagOn} landAt={at.fuerte - 4} noteP={noteOn} frame={frame} fps={fps} />
      ) : null}

      {/* KEY ASSUMPTIONS CHECK, assumption 2 highlighted; the pocket for a beat. */}
      <Place x={sheetX} y={sheetY} opacity={sheetOn}>
        <AssumptionSheet width={SHEET_W} at={assume2 - 6} highlight={[{ line: 2, from: assume2 + 16 }]} glow={windowWeight(frame, at.segundo, at.toca, { ramp: 12 })} frame={frame} />
      </Place>
      <Place x={STAGE_W - POCKET.w - 40} y={(STAGE_H - POCKET.h) / 2} opacity={pocketOn}>
        <Pocket width={POCKET_W} at={at.toca - 6} patAt={at.palparse} itemsAt={at.palparse + 4} frame={frame} />
      </Place>

      {/* The table (stays up), then the stool beside it. */}
      <Place x={tableP.x} y={propTop(tableP)} opacity={tableOn}>
        <ConclusionTable width={tableP.w} at={pullE4 + 2} legsAt={at.patas} focusLeg={{ leg: 'E4', from: at.quitas - 4, to: at.pull + 4 }} pullAt={at.pull} glow={tableGlow} frame={frame} />
      </Place>
      <Place x={stoolP.x} y={propTop(stoolP)} opacity={stoolOn}>
        {/* The part's own label would touch the seat while it stands: it is drawn above it instead. */}
        <Stool width={stoolP.w} at={stool} labelAt={NEVER} tipAt={at.cae} frame={frame} />
      </Place>
      {stoolOn > 0.001 ? <LowConfidence cx={stoolP.x + stoolP.w / 2} bottom={propTop(stoolP) + SEAT_RATIO * stoolP.w - 26} p={progress(frame, at.bajar - 4, 14)} opacity={stoolOn} /> : null}

      {frame >= sensitivity - 10 ? (
        <TermName es={S08_TEXT.termEs} en={S08_TEXT.termEn} esAt={at.analisis - 4} enAt={at.sensitivityWord - 4} frame={frame} fps={fps} enSize={76} style={{ position: 'absolute', left: 0, top: 6, width: STAGE_W }} />
      ) : null}
    </Stage>
  );
}

/**
 * «strong link» beside E4's row (a short amber line from the board's edge to
 * the tag) and, under it, the amber note «justo lo que alguien podría
 * plantar» (never rose: nobody is said to have planted it). `x` is the
 * board's right edge, `y` the centre of E4's row.
 */
function StrongLinkCallout({ x, y, p, landAt, noteP, frame, fps }: { x: number; y: number; p: number; landAt: number; noteP: number; frame: number; fps: number }) {
  const pop = frame < landAt ? 0 : springIn(frame, fps, landAt, { damping: 13 });
  const glow = 1 - progress(frame, landAt + 20, 50, EASE.inOut);
  return (
    <div style={{ position: 'absolute', left: x, top: y, opacity: p }}>
      <div style={{ position: 'absolute', left: 4, top: -2, width: 20, height: 4, borderRadius: 2, background: alpha(C.amber, 0.9) }} />
      <div
        style={{
          position: 'absolute',
          left: 22,
          top: 0,
          transform: `translateY(-50%) scale(${0.6 + 0.4 * Math.min(1.05, pop)})`,
          transformOrigin: '0 50%',
          padding: '4px 18px',
          borderRadius: RADIUS.sm,
          border: `3px solid ${alpha(C.amber, 0.75 + 0.25 * glow)}`,
          background: alpha(C.amber, 0.14 + 0.16 * glow),
          color: '#fde68a',
          fontSize: 36,
          fontWeight: 850,
          lineHeight: 1.15,
          whiteSpace: 'nowrap',
          boxShadow: `0 0 ${Math.round(10 + 26 * glow)}px ${alpha(C.amber, 0.25 + 0.35 * glow)}`,
        }}
      >
        {MATRIX_TEXT.strongLink}
      </div>
      {noteP > 0.001 ? (
        <div style={{ position: 'absolute', left: 22, top: 30, opacity: noteP, transform: `translateY(${(1 - noteP) * -10}px)`, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <div style={{ marginLeft: 40, width: 4, height: 22, borderRadius: 2, background: alpha(C.amber, 0.9) }} />
          <div
            style={{
              padding: '10px 22px',
              borderRadius: RADIUS.md,
              border: `3px solid ${alpha(C.amber, 0.9)}`,
              background: alpha(C.ink950, 0.94),
              color: '#fcd34d',
              fontSize: 34,
              fontWeight: 800,
              lineHeight: 1.22,
              whiteSpace: 'nowrap',
              boxShadow: `0 14px 30px ${alpha('#000000', 0.5)}, 0 0 22px ${alpha(C.amber, 0.25)}`,
            }}
          >
            {S08_TEXT.plantNoteLines.map((l) => (
              <div key={l}>{l}</div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

/** «baja la confianza» (the Stool part's text and look), centred on `cx` with its bottom at `bottom`. */
function LowConfidence({ cx, bottom, p, opacity }: { cx: number; bottom: number; p: number; opacity: number }) {
  if (p <= 0.001) return null;
  return (
    <div style={{ position: 'absolute', left: cx, top: bottom, opacity: p * opacity, transform: `translate(-50%, -100%) translateY(${(1 - p) * -10}px)` }}>
      <span
        style={{
          display: 'inline-block',
          padding: '8px 26px',
          borderRadius: RADIUS.md,
          border: `4px solid ${C.amber}`,
          background: alpha(C.ink950, 0.85),
          color: '#fcd34d',
          fontSize: 44,
          fontWeight: 850,
          whiteSpace: 'nowrap',
        }}
      >
        {TABLE_TEXT.lowConfidence}
      </span>
    </div>
  );
}

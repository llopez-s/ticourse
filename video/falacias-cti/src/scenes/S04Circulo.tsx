import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { LINE_1, LINE_2, RING_LABEL } from '../data/s04-circulo';
import { NAMES } from '../data/shared';
import { ExampleLabel } from './parts/ExampleLabel';
import { PAPER, Sheet } from './parts/Paper';
import { RedPen } from './parts/Pen';
import { Arrow, Stroke, curvePoints, linePoints, partial } from './parts/strokes';
import { Stage, wordFrame } from './kit';

const S = 's04-circulo';
const W = STAGE.width;

const SHEET = { x: 20, y: 16, w: 1200, h: 560 } as const;
const CARD1 = { x: 40, y: 14, w: 1120, h: 198 } as const;
const CARD2 = { x: 40, y: 378, w: 1120, h: 150 } as const;

/** The ring, in sheet coordinates: a down arrow on the left, an up arrow on the right, and the card edges between them. */
const A1 = curvePoints({ x: 200, y: 220 }, { x: 24, y: 295 }, { x: 200, y: 370 });
const A2 = curvePoints({ x: 1000, y: 370 }, { x: 1176, y: 295 }, { x: 1000, y: 220 });
const LOOP = [
  ...A2,
  ...linePoints({ x: 1000, y: 220 }, { x: 200, y: 220 }, { n: 30, wobble: 2 }),
  ...A1,
  ...linePoints({ x: 200, y: 370 }, { x: 1000, y: 370 }, { n: 30, wobble: 2 }),
];

/** One line of the example as a card on the sheet: text on two lines, TTPs in amber (the word that comes back). */
function LineCard({ box, lines, note, noteShow = 1, show, glow }: { box: { x: number; y: number; w: number; h: number }; lines: readonly string[]; note?: string; noteShow?: number; show: number; glow: number }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: box.x,
        top: box.y,
        width: box.w,
        height: box.h,
        boxSizing: 'border-box',
        padding: '16px 34px',
        borderRadius: 16,
        border: `3px solid ${alpha(C.sky, 0.5 + 0.4 * glow)}`,
        background: alpha(C.sky, 0.08 + 0.1 * glow),
        boxShadow: glow > 0.01 ? `0 0 ${Math.round(26 * glow)}px ${alpha(C.sky, 0.3 * glow)}` : undefined,
        opacity: show,
        transform: `translateY(${(1 - show) * 16}px)`,
        fontFamily: FONT.sans,
      }}
    >
      {lines.map((l) => (
        <div key={l} style={{ fontSize: 48, fontWeight: 850, letterSpacing: -0.6, lineHeight: 1.18, color: PAPER.ink, whiteSpace: 'nowrap' }}>
          {l.split(/(TTPs)/).map((part, i) => (
            <span key={i} style={part === 'TTPs' ? { color: C.amberDeep } : undefined}>
              {part}
            </span>
          ))}
        </div>
      ))}
      {note ? <div style={{ marginTop: 4, fontSize: 34, fontWeight: 650, color: PAPER.inkSoft, whiteSpace: 'nowrap', opacity: noteShow }}>{note}</div> : null}
    </div>
  );
}

/**
 * s04-circulo «La conclusión ya estaba dentro». The fixed note is on screen from the first frame; a new sheet of examples
 * (not the draft of s01) carries two large lines.
 *   define   «Grupo X = las técnicas (TTPs) de este incidente» (+ the lesson's note «definidas por… este incidente»)
 *   attrib   «Este incidente es de X porque usa TTPs de X», and a down arrow joins the two
 *   loop     (sfx «lock») a second arrow comes back up and closes the ring; the red pen goes over it. In the middle:
 *            «la conclusión ya estaba en la premisa»
 *   circ     RAZONAMIENTO CIRCULAR and, under it, CIRCULAR REASONING. The engine's exam card comes after the sentence
 * No hash, family, real group, hour or country.
 */
export function S04Circulo(props: SceneProps) {
  const frame = useCurrentFrame();
  const defineAt = props.cue('define');
  const attribAt = props.cue('attrib');
  const loopAt = props.cue('loop');
  const circAt = props.cue('circ');
  const at = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);
  const p = (start: number, dur = 14) => progress(frame, start, dur);

  const sheetIn = enter(frame, -14, { distance: 24, duration: 22 });
  const line1 = p(defineAt - 4, 18);
  const note = p(at('s04-01', 'incidente') - 4, 16);
  const line2 = p(attribAt - 4, 18);
  const down = progress(frame, attribAt + 22, 30, EASE.inOut);
  const up = progress(frame, loopAt, 30, EASE.inOut);
  const label = p(at('s04-02', 'conclusión') - 6, 18);

  // The red pen goes over the whole ring once it is closed.
  const retraceT = loopAt + 26;
  const retrace = progress(frame, retraceT, 74, EASE.inOut);
  const tip = partial(LOOP, retrace).tip;
  const penIn = progress(frame, retraceT - 22, 22, EASE.out);
  const penOut = progress(frame, retraceT + 74 + 22, 24, EASE.inOut);
  const penX = retrace > 0 ? SHEET.x + tip.x : SHEET.x + LOOP[0].x + 180 * (1 - penIn);
  const penY = retrace > 0 ? SHEET.y + tip.y : SHEET.y + LOOP[0].y - 200 * (1 - penIn);
  const penShow = p(retraceT - 22, 10) * (1 - penOut);
  const glow1 = Math.max(p(defineAt, 10) * (1 - p(attribAt - 6, 12)), 0.7 * up);
  const glow2 = Math.max(p(attribAt, 10) * (1 - p(loopAt - 6, 12)), 0.7 * up);

  const nameIn = p(circAt - 4, 18);
  const engIn = enter(frame, at('s04-03', 'reasoning') - 22, { distance: 14, duration: 16 });
  const closed = retrace > 0.98 ? 1 : 0;

  return (
    <Stage>
      <ExampleLabel width={W} />

      {/* The sheet of examples */}
      <div style={{ position: 'absolute', left: SHEET.x, top: SHEET.y, opacity: sheetIn.opacity, transform: sheetIn.transform }}>
        <Sheet width={SHEET.w} height={SHEET.h} tone={C.sky} glow={0.1 * closed}>
          <LineCard box={CARD1} lines={LINE_1.text} note={LINE_1.note} noteShow={note} show={line1} glow={glow1} />
          <LineCard box={CARD2} lines={LINE_2.text} show={line2} glow={glow2} />
          <svg width={SHEET.w} height={SHEET.h} viewBox={`0 0 ${SHEET.w} ${SHEET.h}`} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} aria-hidden>
            <Arrow points={A1} p={down} color={C.cyanDeep} width={7} head={26} />
            <Arrow points={A2} p={up} color={C.cyanDeep} width={7} head={26} />
            <Stroke points={LOOP} p={retrace} color={C.rose} width={9} glow={0.5} />
          </svg>
          <div style={{ position: 'absolute', left: 240, top: 234, width: 720, textAlign: 'center', fontSize: 50, fontWeight: 900, letterSpacing: -0.6, lineHeight: 1.16, color: PAPER.ink, opacity: label, transform: `scale(${0.94 + 0.06 * label})` }}>
            <div>{RING_LABEL[0]}</div>
            <div style={{ color: C.roseDeep }}>{RING_LABEL[1]}</div>
          </div>
        </Sheet>
      </div>

      {/* The name of the fallacy */}
      <div style={{ position: 'absolute', left: 1252, top: 110, width: 456, height: 330, boxSizing: 'border-box', borderRadius: RADIUS.lg, border: `3px ${nameIn > 0.2 ? 'solid' : 'dashed'} ${alpha(C.rose, 0.3 + 0.55 * nameIn)}`, background: alpha(C.roseDeep, 0.5 * nameIn), boxShadow: nameIn > 0.02 ? `0 0 ${Math.round(34 * nameIn)}px ${alpha(C.rose, 0.28 * nameIn)}` : undefined, padding: '34px 26px', fontFamily: FONT.mono }}>
        <div style={{ opacity: nameIn, transform: `translateY(${(1 - nameIn) * 12}px)`, fontSize: 52, fontWeight: 800, lineHeight: 1.12, letterSpacing: 1, color: C.textStrong, whiteSpace: 'nowrap' }}>
          <div>RAZONAMIENTO</div>
          <div style={{ color: C.roseSoft }}>CIRCULAR</div>
        </div>
        <div style={{ marginTop: 28, opacity: engIn.opacity, transform: engIn.transform, fontSize: 38, fontWeight: 700, letterSpacing: 1, color: C.text, whiteSpace: 'nowrap' }}>{NAMES.circular}</div>
      </div>

      <RedPen x={penX} y={penY} angle={-52} hand show={penShow} glow={0.4} />
    </Stage>
  );
}

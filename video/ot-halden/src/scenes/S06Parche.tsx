import type { ReactNode } from 'react';
import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, alpha } from '../../../engine/src/theme/tokens';
import { enter, progress } from '../../../engine/src/theme/motion';
import { CRANE_PLACE, Crane, craneHeight } from './parts/Crane';
import { FireTruck, ImageTag, PartInBox, fireIconWidth } from './parts/Firehouse';
import { Pill, TermPill } from './parts/Labels';
import { Stage, wordFrame } from './kit';

const S = 's06-parche';

/** Right-hand column (the crane is at CRANE_PLACE, boom pointing at it). */
const COL_X = CRANE_PLACE.left + CRANE_PLACE.width + 70;
const CARD_W = 1728 - COL_X - 18;
const TEXT_X = 96;
const CARD1 = { top: 0, h: 212 };
const CARD2 = { top: 226, h: 264 };
const COMP_TOP = 508;
/** The fire-station strip sits under the crane. */
const FIRE_TOP = CRANE_PLACE.top + craneHeight(CRANE_PLACE.width) + 24;
const FIRE_SIZE = 76;

/** A bump 0 → 1 → `rest`: lit at `at`, back to `rest` after `hold` frames. */
function bump(frame: number, at: number, hold = 40, rest = 0): number {
  return rest + (1 - rest) * progress(frame, at, 8) * (1 - progress(frame, at + hold, 18));
}

/**
 * s06-parche «Dos preguntas al fabricante». The crane sits at its place on the left (its wind and wireless sensors, the
 * parts the patch question is about, light with the questions); on the right the last requirement of the list comes as
 * two numbered cards. Card 1 («¿Publicará parches, cada cuánto y hasta cuándo?») gets PATCH AVAILABILITY on its words and
 * the chip «si el producto llega al final de su vida, no hay más»; card 2 («¿Se podrán instalar con el muelle
 * trabajando, o en sus paradas?») gets INABILITY TO PATCH, if the answer is «nunca». Under them, in one line,
 * «sin parche que se pueda poner: compensating controls» (no network, no list of controls). On `firehouse-3` the new part
 * in its box and the truck that never leaves its duty come in under the crane, labelled as an image.
 */
export function S06Parche(props: SceneProps) {
  const frame = useCurrentFrame();
  const w = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);
  const q1At = props.cue('patch-q1');
  const availAt = w('s06-02', 'patch') - 4;
  const eolAt = props.cue('eol') - 2;
  const q2At = props.cue('patch-q2');
  const inabAt = w('s06-03', 'inability') - 4;
  const neverAt = w('s06-03', 'nunca') - 6;
  const compAt = props.cue('compensate');
  const compPillAt = w('s06-04', 'compensating') - 4;
  const fhAt = props.cue('firehouse-3');
  const partAt = w('s06-05', 'pieza') - 6;
  const truckAt = w('s06-05', 'camión') - 6;
  const barAt = w('s06-05', 'nunca') - 4;

  // The crane: wind and wireless sensors light with each question, then rest half lit.
  const sensors = Math.max(0.5 * progress(frame, q1At, 14), bump(frame, q1At, 70), bump(frame, q2At, 70));
  const lit = { wind: sensors, wireless: sensors, controllers: 0, anticollision: 0 };

  // Card 1 steps back once the second question takes the voice; card 2 once the compensating line does.
  const back1 = 0.38 * progress(frame, q2At - 6, 14);
  const back2 = 0.3 * progress(frame, compAt - 6, 14);

  return (
    <Stage>
      <div style={{ position: 'absolute', left: 0, top: 56, ...enter(frame, -6, { distance: 14, duration: 16 }) }}>
        <Pill text="el último requisito de la lista" tone={C.cyan} size={36} height={62} on={0.55} />
      </div>

      <div style={{ position: 'absolute', left: CRANE_PLACE.left, top: CRANE_PLACE.top, ...enter(frame, -4, { distance: 14 }) }}>
        <Crane width={CRANE_PLACE.width} lit={lit} dots />
      </div>

      {/* Question 1 → PATCH AVAILABILITY (+ end of life) */}
      <Card
        frame={frame}
        n={1}
        top={CARD1.top}
        height={CARD1.h}
        slotAt={2}
        at={q1At}
        back={back1}
        question={['¿Publicará parches, cada cuánto y hasta cuándo?']}
      >
        {frame >= availAt - 4 ? (
          <div style={{ position: 'absolute', left: TEXT_X, top: 88, ...enter(frame, availAt, { distance: 14 }) }}>
            <TermPill text="PATCH AVAILABILITY" size={38} on={0.9} />
          </div>
        ) : null}
        {frame >= eolAt - 4 ? (
          <div style={{ position: 'absolute', left: TEXT_X, top: 88 + 61 + 10, ...enter(frame, eolAt, { distance: 14 }) }}>
            <Pill text="si el producto llega al final de su vida, no hay más" tone={C.amber} size={31} height={50} weight={700} on={0.7} />
          </div>
        ) : null}
      </Card>

      {/* Question 2 → INABILITY TO PATCH, if the answer is «nunca» */}
      <Card
        frame={frame}
        n={2}
        top={CARD2.top}
        height={CARD2.h}
        slotAt={7}
        at={q2At}
        back={back2}
        question={['¿Se podrán instalar con el muelle trabajando,', 'o en sus paradas?']}
      >
        {frame >= inabAt - 4 ? (
          <div style={{ position: 'absolute', left: TEXT_X, top: 134, ...enter(frame, inabAt, { distance: 14 }) }}>
            <TermPill text="INABILITY TO PATCH" size={38} on={0.9} />
          </div>
        ) : null}
        {frame >= neverAt - 4 ? (
          <div style={{ position: 'absolute', left: TEXT_X, top: 134 + 61 + 10, ...enter(frame, neverAt, { distance: 14 }) }}>
            <Pill text="si la respuesta es «nunca»" tone={C.amber} size={31} height={50} weight={700} on={0.7} />
          </div>
        ) : null}
      </Card>

      {/* One line: compensating controls (which ones is for the next lesson) */}
      {frame >= compAt - 4 ? (
        <div style={{ position: 'absolute', left: COL_X, top: COMP_TOP, width: CARD_W, ...enter(frame, compAt, { distance: 16 }) }}>
          <div style={{ fontFamily: FONT.sans, fontSize: 36, fontWeight: 700, color: C.text, whiteSpace: 'nowrap', lineHeight: 1.2 }}>
            sin parche que se pueda poner:
          </div>
          {frame >= compPillAt - 4 ? (
            <div style={{ marginTop: 10, ...enter(frame, compPillAt, { distance: 12 }) }}>
              <TermPill text="compensating controls" size={42} on={0.9} />
            </div>
          ) : null}
        </div>
      ) : null}

      {/* The fire station: the new part in its box, and the truck that never leaves its duty */}
      {frame >= fhAt - 4 ? (
        <FireStrip frame={frame} at={fhAt} partAt={partAt} truckAt={truckAt} barAt={barAt} />
      ) : null}
    </Stage>
  );
}

/** A numbered requirement card: dashed empty slot at `slotAt`, solid with its question on `at`. */
function Card({
  frame,
  n,
  top,
  height,
  slotAt,
  at,
  back,
  question,
  children,
}: {
  frame: number;
  n: number;
  top: number;
  height: number;
  slotAt: number;
  at: number;
  back: number;
  question: string[];
  children?: ReactNode;
}) {
  const filled = progress(frame, at, 12);
  const hot = filled * (1 - back / 0.38);
  const slotIn = enter(frame, slotAt, { distance: 14 });
  return (
    <div style={{ position: 'absolute', left: COL_X, top, width: CARD_W, height, ...slotIn, opacity: Number(slotIn.opacity ?? 1) * (1 - back) }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          boxSizing: 'border-box',
          borderRadius: 24,
          border: `3px ${filled < 0.5 ? 'dashed' : 'solid'} ${alpha(C.cyan, 0.22 + 0.5 * Math.max(hot, 0.4 * filled))}`,
          background: alpha(C.cyan, 0.03 + 0.08 * Math.max(hot, 0)),
          boxShadow: hot > 0.05 ? `0 0 ${Math.round(26 * hot)}px ${alpha(C.cyan, 0.26 * hot)}` : undefined,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 22,
          top: 20,
          width: 54,
          height: 54,
          borderRadius: 27,
          display: 'grid',
          placeItems: 'center',
          boxSizing: 'border-box',
          fontFamily: FONT.sans,
          fontSize: 34,
          fontWeight: 850,
          color: filled > 0.5 ? C.ink950 : C.faint,
          background: filled > 0.5 ? C.cyan : 'transparent',
          border: `3px solid ${filled > 0.5 ? C.cyan : alpha(C.faint, 0.7)}`,
        }}
      >
        {n}
      </div>
      <div
        style={{
          position: 'absolute',
          left: TEXT_X,
          top: 20,
          fontFamily: FONT.sans,
          fontSize: 35,
          fontWeight: 700,
          lineHeight: 1.26,
          color: C.textStrong,
          whiteSpace: 'nowrap',
          opacity: filled,
          transform: `translateX(${(1 - filled) * 14}px)`,
        }}
      >
        {question.map((l) => (
          <div key={l}>{l}</div>
        ))}
      </div>
      {children}
    </div>
  );
}

/** The part in its box, then the truck: the barrier between them appears on «nunca». */
function FireStrip({ frame, at, partAt, truckAt, barAt }: { frame: number; at: number; partAt: number; truckAt: number; barAt: number }) {
  const gap = 78;
  const partW = fireIconWidth('part', FIRE_SIZE);
  const truckX = partW + gap;
  const truckW = fireIconWidth('truck', FIRE_SIZE);
  const bar = progress(frame, barAt, 12);
  return (
    <div style={{ position: 'absolute', left: 0, top: FIRE_TOP, width: 700, height: 100 }}>
      <div style={{ position: 'absolute', left: 0, top: 0, ...enter(frame, partAt, { distance: 14 }) }}>
        <PartInBox size={FIRE_SIZE} glow={0.3 + 0.5 * bump(frame, partAt, 50)} />
      </div>
      <div style={{ position: 'absolute', left: truckX, top: 0, ...enter(frame, truckAt, { distance: 14 }) }}>
        <FireTruck size={FIRE_SIZE} glow={0.3 + 0.4 * bump(frame, truckAt, 50)} />
      </div>
      {/* the way to the workshop, closed */}
      <svg width={gap} height={FIRE_SIZE} viewBox={`0 0 ${gap} ${FIRE_SIZE}`} style={{ position: 'absolute', left: partW, top: 0, opacity: progress(frame, truckAt, 12), overflow: 'visible' }}>
        <line x1={8} y1={46} x2={gap - 8} y2={46} stroke={alpha(C.sky, 0.6)} strokeWidth={4} strokeDasharray="9 8" strokeLinecap="round" />
        <line x1={gap / 2} y1={46 - 20 * bar} x2={gap / 2} y2={46 + 20 * bar} stroke={C.rose} strokeWidth={7} strokeLinecap="round" opacity={bar} />
      </svg>
      <div style={{ position: 'absolute', left: truckX + truckW + 28, top: 17, ...enter(frame, Math.min(partAt, at + 4), { distance: 10 }) }}>
        <ImageTag size={26} />
      </div>
    </div>
  );
}

import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { Icon } from '../../../../../engine/src/ui';
import { SEAL } from '../../../data/s01-hook';

export const GLOBE = { askW: 860, arrowW: 96, ansW: 440, gap: 22, h: 128 } as const;
export const GLOBE_ROW_W = GLOBE.askW + GLOBE.gap + GLOBE.arrowW + GLOBE.gap + GLOBE.ansW;

/** The seal of the proposal: a dashed stamp pill (the engine draws its own «datos ficticios» pill elsewhere). */
export function Seal({ show = 1 }: { show?: number }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 12,
        height: 52,
        padding: '0 30px 0 20px',
        boxSizing: 'border-box',
        borderRadius: RADIUS.pill,
        border: `2px dashed ${alpha(C.muted, 0.8)}`,
        background: alpha(C.ink850, 0.9),
        color: C.muted,
        fontFamily: FONT.sans,
        fontSize: 30,
        fontWeight: 650,
        letterSpacing: 0.4,
        whiteSpace: 'nowrap',
        opacity: show,
      }}
    >
      <Icon name="flag" size={32} color={C.muted} />
      {SEAL}
    </span>
  );
}

/** One speech globe, no author: a rounded box with a small notch under its left edge. */
function Globe({ x, w, text, accent, size, show, hollow = 0 }: { x: number; w: number; text: string; accent: string; size: number; show: number; hollow?: number }) {
  const border = hollow > 0.5 ? alpha(C.muted, 0.7) : alpha(accent, 0.8);
  return (
    <div style={{ position: 'absolute', left: x, top: 0, width: w, height: GLOBE.h, opacity: show, transform: `translateY(${(1 - show) * 18}px) scale(${0.96 + 0.04 * show})`, transformOrigin: '12% 100%' }}>
      <div
        style={{
          width: '100%',
          height: '100%',
          boxSizing: 'border-box',
          display: 'grid',
          placeItems: 'center',
          borderRadius: 40,
          border: `3px ${hollow > 0.5 ? 'dashed' : 'solid'} ${border}`,
          background: hollow > 0.5 ? alpha(C.ink800, 0.5) : alpha(accent, 0.1),
          boxShadow: hollow > 0.5 ? undefined : `0 0 30px ${alpha(accent, 0.16)}`,
          fontFamily: FONT.sans,
          fontSize: size,
          fontWeight: 750,
          letterSpacing: -0.4,
          color: hollow > 0.5 ? C.muted : C.textStrong,
          whiteSpace: 'nowrap',
        }}
      >
        {text}
      </div>
      <svg style={{ position: 'absolute', left: 38, top: GLOBE.h - 3, overflow: 'visible' }} width={40} height={30} fill="none" stroke={border} strokeWidth={3} strokeLinejoin="round" strokeLinecap="round">
        <path d="M2 0 L12 26 L36 0" />
      </svg>
    </div>
  );
}

/**
 * A question globe, an arrow drawn as SVG and the vague answer globe. `ask` and `answer` are 0–1 entrances;
 * `hollow` 0–1 turns the answer into an empty outline («no es un número»).
 */
export function GlobeRow({ ask, answer, askIn, ansIn, hollow }: { ask: string; answer: string; askIn: number; ansIn: number; hollow: number }) {
  const ax = GLOBE.askW + GLOBE.gap;
  const bx = ax + GLOBE.arrowW + GLOBE.gap;
  const cy = GLOBE.h / 2;
  return (
    <div style={{ position: 'relative', width: GLOBE_ROW_W, height: GLOBE.h }}>
      {askIn < 0.999 ? (
        <div style={{ position: 'absolute', left: 0, top: 0, width: GLOBE.askW, height: GLOBE.h, boxSizing: 'border-box', borderRadius: 40, border: `2px dashed ${alpha(C.ink600, 0.8)}`, opacity: 1 - askIn }} />
      ) : null}
      {askIn > 0.01 ? <Globe x={0} w={GLOBE.askW} text={ask} accent={C.cyan} size={52} show={askIn} /> : null}
      <svg style={{ position: 'absolute', left: ax, top: 0, overflow: 'visible' }} width={GLOBE.arrowW} height={GLOBE.h} opacity={Math.min(1, ansIn * 1.5)}>
        <g fill="none" stroke={hollow > 0.5 ? alpha(C.muted, 0.7) : C.amber} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round">
          <path d={`M6 ${cy} H${6 + (GLOBE.arrowW - 14) * Math.min(1, ansIn * 1.3)}`} />
          {ansIn > 0.7 ? <path d={`M${GLOBE.arrowW - 22} ${cy - 14} L${GLOBE.arrowW - 8} ${cy} L${GLOBE.arrowW - 22} ${cy + 14}`} /> : null}
        </g>
      </svg>
      {ansIn > 0.01 ? <Globe x={bx} w={GLOBE.ansW} text={answer} accent={C.amber} size={60} show={ansIn} hollow={hollow} /> : null}
    </div>
  );
}

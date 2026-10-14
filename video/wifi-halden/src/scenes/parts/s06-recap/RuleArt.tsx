import { C, alpha } from '../../../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../../../engine/src/theme/motion';
import { mix } from '../../../../../engine/src/ui';
import { CarnetGlyph, FloodlightGlyph, LAMP, PadlockGlyph, STEEL, TabletGlyph } from '../Glyphs';

/**
 * The three rule cards' drawings: the video's own images, small. Every frame is local to the scene's
 * Sequence; nothing here reads the timeline.
 */

/** Height of the art slot the cards give these drawings. */
export const ART_H = 190;

const shown = (frame: number, at: number) => Math.min(1, 0.35 + progress(frame, at - 4, 18, EASE.inOut));

// ---------------------------------------------------------------------------
// Rule 1: the dock floodlight. It lights the house across the way until it is lowered and turned inwards.

const FLOOD = { w: 392, ground: 174, pivot: { x: 196, y: 38 }, limit: 244 } as const;

export function FloodArt({ frame, at, turnAt }: { frame: number; at: number; /** «bájalo y gíralo» */ turnAt: number }) {
  const turn = progress(frame, turnAt, 34, EASE.inOut);
  const { pivot, ground, limit } = FLOOD;
  return (
    <svg width={FLOOD.w} height={ART_H} viewBox={`0 0 ${FLOOD.w} ${ART_H}`} style={{ display: 'block', overflow: 'visible', opacity: shown(frame, at) }}>
      {/* the terminal's ground, its limit and the neighbour's house */}
      <line x1={86} y1={ground} x2={limit} y2={ground} stroke={STEEL.light} strokeWidth={4} strokeLinecap="round" />
      <line x1={limit} y1={ground} x2={FLOOD.w - 6} y2={ground} stroke={STEEL.line} strokeWidth={4} strokeLinecap="round" />
      <line x1={limit} y1={70} x2={limit} y2={ground} stroke={STEEL.line} strokeWidth={3} strokeDasharray="5 8" strokeLinecap="round" />
      <path d={`M 304 ${ground} V 118 L 340 88 L 376 118 V ${ground} Z`} fill={STEEL.fill} stroke={STEEL.light} strokeWidth={3.5} strokeLinejoin="round" />
      <rect x={326} y={128} width={28} height={24} rx={3} fill={turn < 1 ? alpha(LAMP, 0.85 * (1 - turn)) : STEEL.dark} stroke={STEEL.line} strokeWidth={2.5} />
      <FloodlightGlyph x={pivot.x} y={pivot.y} h={34} angle={mix(30, 118, turn)} beam={mix(1, 0.6, turn)} reach={mix(196, 132, turn)} spread={14} pole={ground - pivot.y} glow={0.4 * (1 - turn)} />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Rule 2: the combination padlock, bolted to the locker (SAE). It never opens.

export function PadlockArt({ frame, at, brakeAt }: { frame: number; at: number; /** «frena» */ brakeAt: number }) {
  const glow = progress(frame, brakeAt, 12) * (1 - 0.6 * progress(frame, brakeAt + 40, 30, EASE.inOut));
  return (
    <svg width={300} height={ART_H} viewBox={`0 0 300 ${ART_H}`} style={{ display: 'block', overflow: 'visible', opacity: shown(frame, at) }}>
      <PadlockGlyph x={150} y={90} h={170} tone={C.emerald} bolted={1} glow={glow} />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Rule 3: one carné per tablet. Its seal (the certificate) lights when the voice says EAP-TLS.

export function CarnetArt({ frame, at, sealAt }: { frame: number; at: number; /** «EAP-TLS» */ sealAt: number }) {
  const seal = progress(frame, sealAt, 12);
  const glow = seal * (1 - 0.6 * progress(frame, sealAt + 40, 30, EASE.inOut));
  return (
    <svg width={392} height={ART_H} viewBox={`0 0 392 ${ART_H}`} style={{ display: 'block', overflow: 'visible', opacity: shown(frame, at) }}>
      <TabletGlyph x={128} y={95} h={176} screen={0.5} />
      <CarnetGlyph x={266} y={104} h={112} seal={0.25 + 0.75 * seal} glow={glow} />
    </svg>
  );
}

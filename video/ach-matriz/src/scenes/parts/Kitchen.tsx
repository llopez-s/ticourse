import type { CSSProperties, ReactNode } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { C, FONT, RADIUS, alpha } from '../../../../engine/src/theme/tokens';
import { EASE, progress, pulse, springIn } from '../../../../engine/src/theme/motion';
import { clamp01, windowWeight } from '../../../../engine/src/ui';

/**
 * Image «la cocina» (s04, s06, s07): a fridge with one yogurt missing and
 * three suspects in silhouette — «compañera de piso», «hermano (de visita)»,
 * «perro» (no faces; the dog in profile with snout, ear, collar, tail and four
 * legs). One kitchen, three details:
 *   s04  over each suspect, «¿pudo?» turns into «¿no pudo?» (`askAt`, `flipAt`);
 *   s06  «tenía hambre» — what is known about the culprit, not a note someone
 *        left — sticks to all three AT ONCE and pushes nobody out (`hungryAt`);
 *   s07  the dog's five notes for and one against («no sabe abrir la nevera», rose)
 *        (`DogNotes`), and the dog leaves the line-up (`leaveAt`).
 *
 * Exports `Fridge`, `Suspects` (the line-up), `DogNotes` and `Kitchen` (fridge +
 * line-up side by side). All draw in design units scaled to `width`; frames
 * are Sequence-relative; `frame` defaults to useCurrentFrame(). Reveal props:
 * omitted → in the final state, unless the JSDoc says otherwise.
 */

export type SuspectId = 'roommate' | 'brother' | 'dog';
export const SUSPECT_IDS: readonly SuspectId[] = ['roommate', 'brother', 'dog'];

export const KITCHEN_TEXT = {
  roommate: 'compañera de piso',
  brother: ['hermano', '(de visita)'] as const,
  dog: 'perro',
  could: '¿pudo?',
  couldNot: { open: '¿', no: 'no', rest: ' pudo?' },
  hungry: 'tenía hambre',
  dogFor: ['le encanta el yogur', 'estaba en casa', 'tenía hambre', 'pone cara de culpable', 'hay pelos en la cocina'] as const,
  dogAgainst: 'no sabe abrir la nevera',
} as const;

const SIL = '#435572';
const SIL_DARK = '#2a3850';
const SIL_LINE = '#9fb0c6';
const PAPER = '#f2e8cf';
const PAPER_EDGE = '#d9c9a3';
const INK = '#1e293b';

// ---------------------------------------------------------------------------
// Fridge

export const FRIDGE_BASE = { w: 320, h: 560 } as const;

/**
 * Fridge — open, lit inside; the top shelf has four yogurt slots and one is
 * empty (dashed outline). Props: `width` (default 320), `at` (appears;
 * omitted: on screen), `missingAt` (from this frame the gap gets an amber ring
 * that pulses gently; omitted: no ring, the gap is still drawn), `dim`, `style`,
 * `frame`.
 */
export function Fridge({
  width = FRIDGE_BASE.w,
  at,
  missingAt,
  dim = 0,
  frame: frameProp,
  style,
}: {
  width?: number;
  at?: number;
  missingAt?: number;
  dim?: number;
  frame?: number;
  style?: CSSProperties;
}) {
  const current = useCurrentFrame();
  const { fps } = useVideoConfig();
  const frame = frameProp ?? current;
  const s = width / FRIDGE_BASE.w;
  const show = at === undefined ? 1 : progress(frame, at, 16);
  if (show <= 0) return null;
  const ring = missingAt === undefined ? 0 : progress(frame, missingAt, 12) * (0.7 + 0.3 * pulse(frame, fps, 0.6));
  const d = clamp01(dim);
  const W = FRIDGE_BASE.w;
  const H = FRIDGE_BASE.h;
  const body = { x: 10, y: 10, w: 250, h: H - 20 };
  const cav = { x: body.x + 16, y: 150, w: body.w - 32, h: body.h - 160 };
  const shelfY = [cav.y + 120, cav.y + 250];
  const cupW = 40;
  const cupGap = 10;
  const cupsX0 = cav.x + 14;
  const missing = 2;
  return (
    <div style={{ position: 'relative', width, height: H * s, opacity: show * (1 - 0.6 * d), filter: d > 0.001 ? `saturate(${1 - 0.5 * d})` : undefined, ...style }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute', left: 0, top: 0, transform: `scale(${s})`, transformOrigin: '0 0', overflow: 'visible' }}>
        <defs>
          <linearGradient id="fridge-light" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fef3c7" stopOpacity="0.32" />
            <stop offset="1" stopColor="#fef3c7" stopOpacity="0.08" />
          </linearGradient>
        </defs>
        {/* Body */}
        <rect x={body.x} y={body.y} width={body.w} height={body.h} rx={22} fill={C.ink800} stroke={alpha(C.text, 0.8)} strokeWidth={4} />
        {/* Freezer door (closed) */}
        <rect x={body.x + 8} y={body.y + 8} width={body.w - 16} height={120} rx={14} fill={C.ink700} stroke={alpha(C.text, 0.5)} strokeWidth={3} />
        <rect x={body.x + body.w - 46} y={body.y + 40} width={10} height={56} rx={5} fill={alpha(C.text, 0.7)} />
        {/* Lit cavity */}
        <rect x={cav.x} y={cav.y} width={cav.w} height={cav.h} rx={10} fill="url(#fridge-light)" stroke={alpha(C.text, 0.45)} strokeWidth={2} />
        {/* Open door, hinged on the right */}
        <path d={`M ${body.x + body.w} ${cav.y - 4} L ${W - 6} ${cav.y + 20} L ${W - 6} ${cav.y + cav.h - 20} L ${body.x + body.w} ${cav.y + cav.h + 4} Z`} fill={C.ink700} stroke={alpha(C.text, 0.7)} strokeWidth={3} strokeLinejoin="round" />
        <path d={`M ${body.x + body.w + 12} ${cav.y + 110} L ${W - 18} ${cav.y + 118}`} stroke={alpha(C.text, 0.45)} strokeWidth={3} strokeLinecap="round" />
        <path d={`M ${body.x + body.w + 12} ${cav.y + 240} L ${W - 18} ${cav.y + 244}`} stroke={alpha(C.text, 0.45)} strokeWidth={3} strokeLinecap="round" />
        {/* Shelves */}
        {shelfY.map((y) => (
          <rect key={y} x={cav.x + 4} y={y} width={cav.w - 8} height={6} rx={3} fill={alpha(C.text, 0.55)} />
        ))}
        {/* Top shelf: four yogurts, one missing */}
        {[0, 1, 2, 3].map((i) => {
          const x = cupsX0 + i * (cupW + cupGap);
          const y = shelfY[0] - 54;
          if (i === missing) {
            return (
              <g key={i}>
                <path d={`M ${x} ${y} h ${cupW} l -5 52 h ${-(cupW - 10)} Z`} fill="none" stroke={alpha(C.text, 0.75)} strokeWidth={3} strokeDasharray="6 5" strokeLinejoin="round" />
                {ring > 0.01 ? (
                  <ellipse cx={x + cupW / 2} cy={y + 26} rx={36} ry={42} fill="none" stroke={C.amber} strokeWidth={5} opacity={ring} style={{ filter: `drop-shadow(0 0 ${Math.round(10 * ring)}px ${alpha(C.amber, 0.8)})` }} />
                ) : null}
              </g>
            );
          }
          return <Yogurt key={i} x={x} y={y} w={cupW} lid={i % 2 === 0 ? C.cyan : C.roseSoft} />;
        })}
        {/* Lower shelf: a carton and a jar (texture) */}
        <path d={`M ${cav.x + 20} ${shelfY[1] - 92} h 46 v 92 h -46 Z M ${cav.x + 20} ${shelfY[1] - 92} l 23 -20 l 23 20`} fill={alpha('#e2e8f0', 0.85)} stroke={alpha(C.ink950, 0.4)} strokeWidth={2} strokeLinejoin="round" />
        <rect x={cav.x + 90} y={shelfY[1] - 60} width={56} height={60} rx={10} fill={alpha('#fca5a5', 0.55)} stroke={alpha(C.text, 0.5)} strokeWidth={2} />
        <rect x={cav.x + 92} y={shelfY[1] - 70} width={52} height={14} rx={4} fill={alpha(C.text, 0.6)} />
        {/* Bottom drawer */}
        <rect x={cav.x + 8} y={shelfY[1] + 34} width={cav.w - 16} height={cav.y + cav.h - shelfY[1] - 46} rx={8} fill={alpha('#bae6fd', 0.12)} stroke={alpha(C.text, 0.35)} strokeWidth={2} />
      </svg>
    </div>
  );
}

function Yogurt({ x, y, w, lid }: { x: number; y: number; w: number; lid: string }) {
  return (
    <g>
      <path d={`M ${x} ${y + 6} h ${w} l -5 46 h ${-(w - 10)} Z`} fill="#e2e8f0" stroke={alpha(C.ink950, 0.35)} strokeWidth={2} strokeLinejoin="round" />
      <rect x={x - 2} y={y} width={w + 4} height={8} rx={3} fill={lid} />
      <rect x={x + 4} y={y + 22} width={w - 8} height={10} rx={2} fill={alpha(lid, 0.55)} />
    </g>
  );
}

// ---------------------------------------------------------------------------
// Silhouettes (240 × 330 box, floor at the bottom)

const SIL_W = 240;
const SIL_H = 330;

function RoommateSil() {
  return (
    <g>
      {/* Hair behind (shoulder-length, with a ponytail) */}
      <path d="M70 102 C62 44 178 40 170 102 C172 132 166 156 156 172 L84 172 C74 156 68 132 70 102 Z" fill={SIL_DARK} stroke={SIL_LINE} strokeWidth={3} />
      <path d="M164 78 C196 84 204 120 190 150 C186 128 178 110 166 102 Z" fill={SIL_DARK} stroke={SIL_LINE} strokeWidth={3} strokeLinejoin="round" />
      {/* Shoulders */}
      <path d="M32 330 C32 236 66 186 120 186 C174 186 208 236 208 330 Z" fill={SIL} stroke={SIL_LINE} strokeWidth={3} />
      {/* Neck + head */}
      <rect x={106} y={134} width={28} height={60} rx={10} fill={SIL} />
      <circle cx={120} cy={104} r={42} fill={SIL} stroke={SIL_LINE} strokeWidth={3} />
      {/* Fringe */}
      <path d="M80 98 C84 62 156 58 162 96 C140 80 104 80 80 98 Z" fill={SIL_DARK} />
    </g>
  );
}

function BrotherSil() {
  return (
    <g>
      {/* Shoulders (broader) */}
      <path d="M18 330 C20 228 60 180 116 180 C172 180 212 228 214 330 Z" fill={SIL} stroke={SIL_LINE} strokeWidth={3} />
      {/* Backpack strap */}
      <path d="M76 194 C86 236 92 286 94 330" stroke={SIL_DARK} strokeWidth={22} fill="none" strokeLinecap="round" />
      <path d="M76 194 C86 236 92 286 94 330" stroke={alpha(SIL_LINE, 0.5)} strokeWidth={3} fill="none" strokeDasharray="2 10" />
      {/* Neck + head + short hair */}
      <rect x={102} y={130} width={30} height={58} rx={10} fill={SIL} />
      <circle cx={116} cy={98} r={44} fill={SIL} stroke={SIL_LINE} strokeWidth={3} />
      <path d="M72 96 C70 52 162 46 160 94 C150 76 92 74 72 96 Z" fill={SIL_DARK} stroke={SIL_LINE} strokeWidth={2} />
      {/* Travel bag at his side: he is visiting */}
      <rect x={192} y={252} width={66} height={78} rx={10} fill={SIL_DARK} stroke={SIL_LINE} strokeWidth={3} />
      <path d="M206 252 v -16 a 6 6 0 0 1 6 -6 h 26 a 6 6 0 0 1 6 6 v 16" fill="none" stroke={SIL_LINE} strokeWidth={4} />
      <path d="M192 284 h 66" stroke={alpha(SIL_LINE, 0.6)} strokeWidth={2} />
    </g>
  );
}

function DogSil() {
  // Profile, facing left (towards the fridge): snout + nose, floppy ear, collar, tail up, four legs.
  return (
    <g>
      {/* Tail */}
      <path d="M200 232 C226 220 236 192 228 166" stroke={SIL} strokeWidth={16} fill="none" strokeLinecap="round" />
      {/* Back legs */}
      <rect x={156} y={252} width={22} height={78} rx={9} fill={SIL_DARK} stroke={SIL_LINE} strokeWidth={3} />
      <rect x={182} y={248} width={22} height={82} rx={9} fill={SIL} stroke={SIL_LINE} strokeWidth={3} />
      {/* Front legs */}
      <rect x={60} y={252} width={22} height={78} rx={9} fill={SIL_DARK} stroke={SIL_LINE} strokeWidth={3} />
      <rect x={86} y={248} width={22} height={82} rx={9} fill={SIL} stroke={SIL_LINE} strokeWidth={3} />
      {/* Body */}
      <ellipse cx={136} cy={238} rx={80} ry={38} fill={SIL} stroke={SIL_LINE} strokeWidth={3} />
      {/* Neck */}
      <path d="M62 236 C58 206 66 184 84 170 L110 214 Z" fill={SIL} />
      {/* Head */}
      <circle cx={70} cy={166} r={34} fill={SIL} stroke={SIL_LINE} strokeWidth={3} />
      {/* Snout */}
      <rect x={14} y={162} width={58} height={34} rx={15} fill={SIL} stroke={SIL_LINE} strokeWidth={3} />
      <rect x={30} y={164} width={46} height={30} rx={12} fill={SIL} />
      {/* Nose */}
      <circle cx={18} cy={170} r={8} fill={C.ink950} />
      {/* Floppy ear */}
      <path d="M72 136 C98 132 106 164 96 196 C86 200 76 172 72 136 Z" fill={SIL_DARK} stroke={SIL_LINE} strokeWidth={3} strokeLinejoin="round" />
      {/* Collar */}
      <path d="M82 202 C92 214 104 222 116 224" stroke={C.cyan} strokeWidth={9} fill="none" strokeLinecap="round" />
      <circle cx={100} cy={224} r={7} fill={C.amber} />
    </g>
  );
}

const SIL_ART: Record<SuspectId, () => ReactNode> = { roommate: RoommateSil, brother: BrotherSil, dog: DogSil };

// ---------------------------------------------------------------------------
// Suspects (the line-up)

export const SUSPECTS_BASE = { slotW: 340, h: 560, tagH: 96, silTop: 112, labelTop: 452 } as const;
const SLOT_GAP = 20;

/** Size in px of the line-up at `width` (default design width). */
export function suspectsSize(width?: number): { w: number; h: number; scale: number } {
  const w0 = SUSPECTS_BASE.slotW * 3 + SLOT_GAP * 2;
  const s = (width ?? w0) / w0;
  return { w: w0 * s, h: SUSPECTS_BASE.h * s, scale: s };
}

/** Box (px from the line-up's top-left) of one suspect's slot, its silhouette and the chest point where «tenía hambre» lands. */
export function suspectBox(id: SuspectId, width?: number): { x: number; y: number; w: number; h: number; cx: number; chestY: number; headY: number } {
  const { scale: s } = suspectsSize(width);
  const i = SUSPECT_IDS.indexOf(id);
  const x = i * (SUSPECTS_BASE.slotW + SLOT_GAP);
  return {
    x: x * s,
    y: SUSPECTS_BASE.silTop * s,
    w: SUSPECTS_BASE.slotW * s,
    h: SIL_H * s,
    cx: (x + SUSPECTS_BASE.slotW / 2) * s,
    chestY: (SUSPECTS_BASE.silTop + CHEST_Y[id]) * s,
    headY: (SUSPECTS_BASE.silTop + HEAD_Y[id]) * s,
  };
}

/** Where the «tenía hambre» tag sits, in silhouette units. */
const CHEST_Y: Record<SuspectId, number> = { roommate: 262, brother: 262, dog: 250 };
const CHEST_X: Record<SuspectId, number> = { roommate: 120, brother: 116, dog: 152 };
const HEAD_Y: Record<SuspectId, number> = { roommate: 60, brother: 54, dog: 132 };

type PerSuspect = number | Partial<Record<SuspectId, number>>;

const per = (v: PerSuspect | undefined, id: SuspectId, step: number): number | undefined => {
  if (v === undefined) return undefined;
  if (typeof v === 'number') return v + SUSPECT_IDS.indexOf(id) * step;
  return v[id] ?? Number.POSITIVE_INFINITY;
};

/**
 * Suspects — the three silhouettes in a row, names under them. Props:
 *   width?      px (default design width 1060)
 *   at?         frame they appear (staggered 6 frames). Omitted: on screen.
 *   askAt?      «¿pudo?» over each: one frame (staggered 8) or per suspect. Omitted: NO tags (s06/s07 have none).
 *   flipAt?     «¿pudo?» flips to «¿no pudo?» (needs askAt): one frame (staggered 8) or per suspect.
 *   hungryAt?   «tenía hambre» lands on all three at once (one frame). Omitted: no tags.
 *   leaveAt?    per-suspect frame it leaves the line-up: it slides ~150 design units to the right while
 *               fading out (24 frames), leaving a dashed outline and its name struck through. Leave
 *               that room (or accept a brief overlap) if something sits right of the dog.
 *   focus?      [{ id, from, to? }] — glow under that suspect, the others dimmed.
 *   dim?, frame?, style?
 */
export function Suspects({
  width,
  at,
  askAt,
  flipAt,
  hungryAt,
  leaveAt = {},
  focus = [],
  dim = 0,
  frame: frameProp,
  style,
}: {
  width?: number;
  at?: number;
  askAt?: PerSuspect;
  flipAt?: PerSuspect;
  hungryAt?: number;
  leaveAt?: Partial<Record<SuspectId, number>>;
  focus?: { id: SuspectId; from: number; to?: number }[];
  dim?: number;
  frame?: number;
  style?: CSSProperties;
}) {
  const current = useCurrentFrame();
  const { fps } = useVideoConfig();
  const frame = frameProp ?? current;
  const size = suspectsSize(width);
  const s = size.scale;
  const d = clamp01(dim);
  const B = SUSPECTS_BASE;

  const fw = (id: SuspectId) => Math.max(0, ...focus.filter((f) => f.id === id).map((f) => windowWeight(frame, f.from, f.to ?? Number.POSITIVE_INFINITY, { ramp: 10, lead: 4 })));
  const anyFocus = Math.max(0, ...SUSPECT_IDS.map(fw));

  return (
    <div style={{ position: 'relative', width: size.w, height: size.h, opacity: 1 - 0.6 * d, filter: d > 0.001 ? `saturate(${1 - 0.5 * d})` : undefined, ...style }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: size.w / s, height: B.h, transform: `scale(${s})`, transformOrigin: '0 0', fontFamily: FONT.sans }}>
        {SUSPECT_IDS.map((id, i) => {
          const x = i * (B.slotW + SLOT_GAP);
          const appear = at === undefined ? 1 : progress(frame, at + i * 6, 16);
          if (appear <= 0) return null;
          const own = fw(id);
          const dd = anyFocus * (1 - own);
          const leave = leaveAt[id] === undefined ? 0 : progress(frame, leaveAt[id]!, 24, EASE.inOut);
          const ask = per(askAt, id, 8);
          // A suspect missing from a per-suspect record gets Infinity: never shown (interpolate rejects it).
          const askP = ask === undefined || !Number.isFinite(ask) ? 0 : progress(frame, ask, 12);
          const flip = per(flipAt, id, 8);
          const flipP = flip === undefined || !Number.isFinite(flip) ? 0 : progress(frame, flip, 14, EASE.inOut);
          const hungry = hungryAt === undefined ? 0 : frame < hungryAt ? 0 : springIn(frame, fps, hungryAt, { damping: 12, mass: 0.7 });
          const silOpacity = appear * (1 - leave);
          return (
            <div key={id} style={{ position: 'absolute', left: x, top: 0, width: B.slotW, height: B.h, opacity: 1 - 0.6 * dd, filter: dd > 0.001 ? `saturate(${1 - 0.5 * dd})` : undefined }}>
              {/* Focus glow on the floor */}
              {own > 0.01 ? (
                <div
                  style={{
                    position: 'absolute',
                    left: 20,
                    top: B.silTop + SIL_H - 40,
                    width: B.slotW - 40,
                    height: 70,
                    borderRadius: '50%',
                    background: `radial-gradient(closest-side, ${alpha(C.cyan, 0.45 * own)}, transparent)`,
                  }}
                />
              ) : null}
              {/* Ghost left behind */}
              {leave > 0 ? (
                <svg width={SIL_W} height={SIL_H} viewBox={`0 0 ${SIL_W} ${SIL_H}`} style={{ position: 'absolute', left: (B.slotW - SIL_W) / 2, top: B.silTop, overflow: 'visible', opacity: 0.8 * leave }}>
                  {/* CSS beats the drawing's presentation attributes: an empty, dashed outline. */}
                  <style>{`.kitchen-ghost *{fill:none!important;stroke:${alpha(C.muted, 0.7)}!important;stroke-width:3px!important;stroke-dasharray:9 8}`}</style>
                  <g className="kitchen-ghost">{SIL_ART[id]()}</g>
                </svg>
              ) : null}
              {/* Silhouette */}
              <svg
                width={SIL_W}
                height={SIL_H}
                viewBox={`0 0 ${SIL_W} ${SIL_H}`}
                style={{
                  position: 'absolute',
                  left: (B.slotW - SIL_W) / 2,
                  top: B.silTop,
                  overflow: 'visible',
                  opacity: silOpacity,
                  transform: `translate(${leave * 150}px, ${(1 - appear) * 20}px)`,
                  filter: own > 0.01 ? `drop-shadow(0 0 ${Math.round(18 * own)}px ${alpha(C.cyan, 0.6 * own)})` : undefined,
                }}
              >
                {SIL_ART[id]()}
              </svg>
              {/* «tenía hambre» on the chest */}
              {hungry > 0.001 ? (
                <div
                  style={{
                    position: 'absolute',
                    left: (B.slotW - SIL_W) / 2 + CHEST_X[id],
                    top: B.silTop + CHEST_Y[id],
                    transform: `translate(-50%, ${-50 - (1 - Math.min(1, hungry)) * 160}%) rotate(${i === 1 ? 3 : -3}deg)`,
                    opacity: Math.min(1, hungry * 1.6) * (1 - 0.6 * leave),
                  }}
                >
                  <PaperTag>{KITCHEN_TEXT.hungry}</PaperTag>
                </div>
              ) : null}
              {/* «¿pudo?» / «¿no pudo?» */}
              {askP > 0 ? (
                <div style={{ position: 'absolute', left: 0, width: B.slotW, top: 6, height: B.tagH - 12, display: 'flex', justifyContent: 'center', alignItems: 'center', opacity: askP * (1 - 0.6 * leave), perspective: 600 }}>
                  <QuestionTag flip={flipP} />
                </div>
              ) : null}
              {/* Name */}
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: B.labelTop,
                  width: B.slotW,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  opacity: appear * (1 - 0.5 * leave),
                  whiteSpace: 'nowrap',
                }}
              >
                <div style={{ position: 'relative', fontSize: 34, fontWeight: 750, color: C.textStrong, lineHeight: 1.15 }}>
                  {id === 'brother' ? KITCHEN_TEXT.brother[0] : KITCHEN_TEXT[id]}
                  {leave > 0 ? (
                    <div style={{ position: 'absolute', left: -8, top: '54%', height: 4, width: `calc(${leave * 100}% + 16px)`, background: C.rose, borderRadius: 2 }} />
                  ) : null}
                </div>
                {id === 'brother' ? <div style={{ fontSize: 30, fontWeight: 650, color: C.muted, lineHeight: 1.15 }}>{KITCHEN_TEXT.brother[1]}</div> : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** «¿pudo?» card that flips (rotateX) to «¿no pudo?» with the «no» in cyan. */
function QuestionTag({ flip }: { flip: number }) {
  const f = clamp01(flip);
  const back = f >= 0.5;
  const angle = back ? (1 - f) * 180 : f * 180;
  return (
    <div
      style={{
        padding: '8px 24px',
        borderRadius: RADIUS.md,
        border: `3px solid ${back ? alpha(C.cyan, 0.9) : alpha(C.muted, 0.7)}`,
        background: back ? alpha(C.cyanDeep, 0.35) : alpha(C.ink800, 0.95),
        boxShadow: back ? `0 0 22px ${alpha(C.cyan, 0.3)}` : `0 10px 22px ${alpha('#000000', 0.35)}`,
        fontSize: 42,
        fontWeight: 850,
        color: C.textStrong,
        whiteSpace: 'nowrap',
        transform: `rotateX(${angle}deg)`,
      }}
    >
      {back ? (
        <>
          {KITCHEN_TEXT.couldNot.open}
          <span style={{ color: C.cyanSoft }}>{KITCHEN_TEXT.couldNot.no}</span>
          {KITCHEN_TEXT.couldNot.rest}
        </>
      ) : (
        KITCHEN_TEXT.could
      )}
    </div>
  );
}

function PaperTag({ children, tone }: { children: ReactNode; tone?: 'rose' }) {
  const rose = tone === 'rose';
  return (
    <div
      style={{
        padding: '6px 18px',
        borderRadius: 6,
        background: rose ? '#ffe4e6' : PAPER,
        border: `3px solid ${rose ? C.rose : PAPER_EDGE}`,
        color: rose ? '#9f1239' : INK,
        fontSize: 32,
        fontWeight: 800,
        whiteSpace: 'nowrap',
        boxShadow: `0 10px 20px ${alpha('#000000', 0.45)}`,
      }}
    >
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// The dog's notes (s07)

export const DOG_NOTES_BASE = { w: 470, rowH: 62, gap: 12, splitGap: 26 } as const;

/** Size in px of DogNotes at `width`. */
export function dogNotesSize(width: number = DOG_NOTES_BASE.w): { w: number; h: number; scale: number } {
  const B = DOG_NOTES_BASE;
  const h = 6 * B.rowH + 5 * B.gap + B.splitGap;
  const s = width / B.w;
  return { w: width, h: h * s, scale: s };
}

/**
 * DogNotes — the dog's five notes for him (paper, dark ink: «le encanta el
 * yogur», «estaba en casa», «tenía hambre», «pone cara de culpable», «hay
 * pelos en la cocina») and, under a gap, the one against in rose: «no sabe
 * abrir la nevera». Props: `width` (default 470), `notesAt` (frame the five
 * come in, staggered 7 frames, or one frame per note; omitted: shown),
 * `lethalAt` (frame the rose note slams in and the five step back; omitted:
 * shown, the five not dimmed), `dim`, `frame`, `style`.
 */
export function DogNotes({
  width = DOG_NOTES_BASE.w,
  notesAt,
  lethalAt,
  dim = 0,
  frame: frameProp,
  style,
}: {
  width?: number;
  notesAt?: number | readonly number[];
  lethalAt?: number;
  dim?: number;
  frame?: number;
  style?: CSSProperties;
}) {
  const current = useCurrentFrame();
  const { fps } = useVideoConfig();
  const frame = frameProp ?? current;
  const size = dogNotesSize(width);
  const s = size.scale;
  const B = DOG_NOTES_BASE;
  const d = clamp01(dim);
  const lethal = lethalAt === undefined ? 1 : frame < lethalAt ? 0 : springIn(frame, fps, lethalAt, { damping: 11, mass: 0.7 });
  const back = lethalAt === undefined ? 0 : progress(frame, lethalAt + 4, 14);
  const hit = lethalAt === undefined ? 0 : 1 - progress(frame, lethalAt + 8, 40, EASE.inOut);
  return (
    <div style={{ position: 'relative', width: size.w, height: size.h, opacity: 1 - 0.6 * d, ...style }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: B.w, height: size.h / s, transform: `scale(${s})`, transformOrigin: '0 0', fontFamily: FONT.sans }}>
        {KITCHEN_TEXT.dogFor.map((text, i) => {
          const t = notesAt === undefined ? undefined : typeof notesAt === 'number' ? notesAt + i * 7 : notesAt[i] ?? Number.POSITIVE_INFINITY;
          const p = t === undefined ? 1 : Number.isFinite(t) ? progress(frame, t, 12) : 0;
          if (p <= 0) return null;
          return (
            <div
              key={text}
              style={{
                position: 'absolute',
                left: 0,
                top: i * (B.rowH + B.gap),
                width: B.w,
                height: B.rowH,
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                opacity: p * (1 - 0.45 * back),
                transform: `translateX(${(1 - p) * 24}px) rotate(${i % 2 === 0 ? -0.8 : 0.8}deg)`,
              }}
            >
              <div style={{ flexShrink: 0, width: 40, height: 40, borderRadius: 20, display: 'grid', placeItems: 'center', background: alpha(C.muted, 0.2), border: `2px solid ${alpha(C.muted, 0.7)}`, color: C.text, fontSize: 30, fontWeight: 850, lineHeight: 1 }}>
                +
              </div>
              <div style={{ flex: 1, height: B.rowH, boxSizing: 'border-box', padding: '0 18px', display: 'flex', alignItems: 'center', borderRadius: 6, background: PAPER, border: `2px solid ${PAPER_EDGE}`, color: INK, fontSize: 32, fontWeight: 750, whiteSpace: 'nowrap', boxShadow: `0 8px 16px ${alpha('#000000', 0.35)}` }}>
                {text}
              </div>
            </div>
          );
        })}
        {lethal > 0.001 ? (
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 5 * (B.rowH + B.gap) + B.splitGap,
              width: B.w,
              height: B.rowH,
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              opacity: Math.min(1, lethal * 1.5),
              transform: `scale(${1.25 - 0.25 * Math.min(1, lethal)})`,
              transformOrigin: '30% 50%',
            }}
          >
            <div style={{ flexShrink: 0, width: 40, height: 40, borderRadius: 20, display: 'grid', placeItems: 'center', background: C.rose, color: C.ink950, fontSize: 34, fontWeight: 900, lineHeight: 1 }}>
              <div style={{ width: 18, height: 5, borderRadius: 2, background: C.ink950 }} />
            </div>
            <div
              style={{
                flex: 1,
                height: B.rowH,
                boxSizing: 'border-box',
                padding: '0 18px',
                display: 'flex',
                alignItems: 'center',
                borderRadius: 6,
                background: '#ffe4e6',
                border: `3px solid ${C.rose}`,
                color: '#9f1239',
                fontSize: 34,
                fontWeight: 850,
                whiteSpace: 'nowrap',
                boxShadow: `0 8px 16px ${alpha('#000000', 0.35)}, 0 0 ${Math.round(14 + 26 * hit)}px ${alpha(C.rose, 0.3 + 0.4 * hit)}`,
              }}
            >
              {KITCHEN_TEXT.dogAgainst}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Kitchen = fridge + line-up

const KITCHEN_GAP = 70;

/** Size in px of a Kitchen at `width` (default design width 1450). */
export function kitchenSize(width?: number): { w: number; h: number; scale: number } {
  const sus = suspectsSize();
  const w0 = FRIDGE_BASE.w + KITCHEN_GAP + sus.w;
  const s = (width ?? w0) / w0;
  return { w: w0 * s, h: Math.max(FRIDGE_BASE.h, sus.h) * s, scale: s };
}

/**
 * Kitchen — `Fridge` on the left (bottom-aligned with the line-up) and
 * `Suspects` to its right, both at the same scale. Takes `width` plus the
 * props of both: `fridgeAt`, `missingAt` (Fridge) and `at`, `askAt`, `flipAt`,
 * `hungryAt`, `leaveAt`, `focus` (Suspects), `dim`, `frame`, `style`. Use the
 * parts directly for other arrangements (e.g. s07: Suspects + DogNotes).
 */
export function Kitchen({
  width,
  fridgeAt,
  missingAt,
  dim = 0,
  frame,
  style,
  ...suspects
}: {
  width?: number;
  fridgeAt?: number;
  missingAt?: number;
  at?: number;
  askAt?: PerSuspect;
  flipAt?: PerSuspect;
  hungryAt?: number;
  leaveAt?: Partial<Record<SuspectId, number>>;
  focus?: { id: SuspectId; from: number; to?: number }[];
  dim?: number;
  frame?: number;
  style?: CSSProperties;
}) {
  const size = kitchenSize(width);
  const s = size.scale;
  const sus = suspectsSize();
  return (
    <div style={{ position: 'relative', width: size.w, height: size.h, ...style }}>
      <Fridge width={FRIDGE_BASE.w * s} at={fridgeAt} missingAt={missingAt} dim={dim} frame={frame} style={{ position: 'absolute', left: 0, top: size.h - FRIDGE_BASE.h * s }} />
      <Suspects width={sus.w * s} dim={dim} frame={frame} {...suspects} style={{ position: 'absolute', left: (FRIDGE_BASE.w + KITCHEN_GAP) * s, top: size.h - sus.h * s }} />
    </div>
  );
}

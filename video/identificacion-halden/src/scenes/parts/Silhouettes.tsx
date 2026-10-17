import type { ReactElement } from 'react';
import { C, alpha } from '../../../../engine/src/theme/tokens';
import { clamp01 } from '../../../../engine/src/ui';

export type SilhouetteKind = 'server' | 'app' | 'door';

/** Native size of one silhouette (its viewBox); scale with `width`. */
export const SIL_W = 300;
export const SIL_H = 380;
export const SIL_RATIO = SIL_H / SIL_W;

/** The object's box inside the viewBox (the eye sits above it). */
const OBJ = { x: 30, y: 150, w: 240, h: 210 } as const;
/** The blind spot: the right part of the object, outside the eye's cone. */
const BLIND_X = 196;
const EYE = { x: 136, y: 52 } as const;

/**
 * One of the video's three silhouettes (s01, s06, end card, poster): a server, an application window or a door onto the
 * street, each with an eye above it whose cone of light covers most of the object, and a hatched shadow on the side the
 * eye cannot see (its blind spot). `eye` opens the eye and lays the cone; `blind` darkens and hatches the blind spot;
 * `lit` brightens the whole silhouette (the one the voice is on); `dim` steps it back. Drawn in SVG, textless.
 */
export function Silhouette({
  kind,
  width = SIL_W,
  eye = 1,
  blind = 1,
  lit = 0,
  dim = 0,
  tone = C.cyan,
  id,
}: {
  kind: SilhouetteKind;
  width?: number;
  eye?: number;
  blind?: number;
  lit?: number;
  dim?: number;
  tone?: string;
  /** Unique suffix for SVG ids when several of the same kind share a frame. */
  id?: string;
}) {
  const e = clamp01(eye);
  const b = clamp01(blind);
  const l = clamp01(lit);
  const d = clamp01(dim);
  const uid = `${kind}-${id ?? 'a'}`;
  const stroke = alpha(tone, 0.45 + 0.5 * l);
  const ink = alpha(C.text, 0.5 + 0.4 * l);
  const h = width * SIL_RATIO;
  return (
    <svg
      width={width}
      height={h}
      viewBox={`0 0 ${SIL_W} ${SIL_H}`}
      style={{ display: 'block', overflow: 'visible', opacity: 1 - 0.6 * d, filter: d > 0.01 ? `saturate(${1 - 0.6 * d})` : undefined }}
    >
      <defs>
        <linearGradient id={`cone-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={tone} stopOpacity={0.32 + 0.2 * l} />
          <stop offset="100%" stopColor={tone} stopOpacity={0.04} />
        </linearGradient>
        <pattern id={`hatch-${uid}`} width={14} height={14} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width={14} height={14} fill={alpha(C.ink950, 0.82)} />
          <line x1={0} y1={0} x2={0} y2={14} stroke={alpha(C.muted, 0.4)} strokeWidth={4} />
        </pattern>
        <clipPath id={`obj-${uid}`}>
          <rect x={OBJ.x - 6} y={OBJ.y - 6} width={OBJ.w + 12} height={OBJ.h + 12} rx={16} />
        </clipPath>
      </defs>

      {/* glow when lit */}
      {l > 0.01 ? <ellipse cx={150} cy={260} rx={170} ry={150} fill={alpha(tone, 0.1 * l)} /> : null}

      {/* the eye's cone, from the eye down onto the object (not over the blind spot) */}
      <path
        d={`M ${EYE.x - 14} ${EYE.y + 22} L ${EYE.x + 14} ${EYE.y + 22} L ${BLIND_X} ${OBJ.y + OBJ.h} L ${OBJ.x - 4} ${OBJ.y + OBJ.h} Z`}
        fill={`url(#cone-${uid})`}
        opacity={e}
      />

      {/* the object */}
      <g>{OBJECTS[kind](stroke, ink, tone, l)}</g>

      {/* the blind spot: hatched shadow over the part the eye does not reach */}
      <g clipPath={`url(#obj-${uid})`} opacity={b}>
        <rect x={BLIND_X} y={OBJ.y - 10} width={OBJ.x + OBJ.w - BLIND_X + 12} height={OBJ.h + 20} fill={`url(#hatch-${uid})`} />
        <line x1={BLIND_X} y1={OBJ.y - 10} x2={BLIND_X} y2={OBJ.y + OBJ.h + 10} stroke={alpha(C.muted, 0.55)} strokeWidth={3} strokeDasharray="8 7" />
      </g>

      {/* the eye */}
      <g transform={`translate(${EYE.x} ${EYE.y})`}>
        <g transform={`scale(1 ${0.12 + 0.88 * e})`}>
          <path d="M -58 0 Q 0 -40 58 0 Q 0 40 -58 0 Z" fill={C.ink900} stroke={alpha(tone, 0.6 + 0.4 * l)} strokeWidth={5} />
          <circle cx={0} cy={0} r={17} fill={tone} opacity={0.85} />
          <circle cx={0} cy={0} r={7} fill={C.ink950} />
          <circle cx={6} cy={-6} r={4} fill={alpha('#ffffff', 0.8)} />
        </g>
      </g>
    </svg>
  );
}

type Draw = (stroke: string, ink: string, tone: string, lit: number) => ReactElement;

const OBJECTS: Record<SilhouetteKind, Draw> = {
  // A rack server seen from the front: four drive bays with a LED each.
  server: (stroke, ink, tone) => (
    <>
      <rect x={60} y={OBJ.y + 6} width={180} height={OBJ.h - 12} rx={14} fill={C.ink800} stroke={stroke} strokeWidth={5} />
      {[0, 1, 2, 3].map((i) => {
        const y = OBJ.y + 30 + i * 44;
        return (
          <g key={i}>
            <rect x={80} y={y} width={140} height={30} rx={6} fill={C.ink900} stroke={alpha(C.text, 0.2)} strokeWidth={2} />
            <rect x={92} y={y + 11} width={70} height={8} rx={4} fill={ink} opacity={0.6} />
            <circle cx={204} cy={y + 15} r={5} fill={i === 1 ? C.amber : tone} />
          </g>
        );
      })}
    </>
  ),
  // An application window: a title bar with three dots, a header bar and content blocks.
  app: (stroke, ink, tone) => (
    <>
      <rect x={OBJ.x} y={OBJ.y + 20} width={OBJ.w} height={OBJ.h - 30} rx={14} fill={C.ink800} stroke={stroke} strokeWidth={5} />
      <line x1={OBJ.x} y1={OBJ.y + 58} x2={OBJ.x + OBJ.w} y2={OBJ.y + 58} stroke={alpha(C.text, 0.25)} strokeWidth={3} />
      {[0, 1, 2].map((i) => (
        <circle key={i} cx={OBJ.x + 22 + i * 20} cy={OBJ.y + 39} r={6} fill={alpha(C.muted, 0.6)} />
      ))}
      <rect x={OBJ.x + 22} y={OBJ.y + 76} width={110} height={16} rx={6} fill={tone} opacity={0.7} />
      <rect x={OBJ.x + 22} y={OBJ.y + 106} width={190} height={12} rx={6} fill={ink} opacity={0.5} />
      <rect x={OBJ.x + 22} y={OBJ.y + 128} width={160} height={12} rx={6} fill={ink} opacity={0.4} />
      <rect x={OBJ.x + 22} y={OBJ.y + 152} width={80} height={24} rx={12} fill={alpha(tone, 0.3)} stroke={alpha(tone, 0.7)} strokeWidth={2} />
    </>
  ),
  // A door onto the street: frame, leaf ajar with a handle, a strip of pavement and the kerb.
  door: (stroke, ink, tone, lit) => (
    <>
      {/* street light through the gap */}
      <path d={`M 196 ${OBJ.y + 10} L 214 ${OBJ.y + 10} L 262 ${OBJ.y + OBJ.h - 18} L 196 ${OBJ.y + OBJ.h - 18} Z`} fill={alpha(C.amber, 0.12 + 0.2 * lit)} />
      <rect x={82} y={OBJ.y} width={136} height={OBJ.h - 18} rx={6} fill={C.ink900} stroke={stroke} strokeWidth={5} />
      <path d={`M 92 ${OBJ.y + 10} L 196 ${OBJ.y + 18} L 196 ${OBJ.y + OBJ.h - 24} L 92 ${OBJ.y + OBJ.h - 28} Z`} fill={C.ink800} stroke={alpha(C.text, 0.35)} strokeWidth={3} />
      <rect x={108} y={OBJ.y + 30} width={70} height={60} rx={4} fill={alpha(tone, 0.12)} stroke={alpha(tone, 0.4)} strokeWidth={2} />
      <rect x={176} y={OBJ.y + 104} width={8} height={30} rx={4} fill={ink} />
      {/* pavement and kerb */}
      <rect x={OBJ.x} y={OBJ.y + OBJ.h - 18} width={OBJ.w} height={18} rx={4} fill={C.ink700} />
      {[0, 1, 2, 3, 4].map((i) => (
        <line key={i} x1={OBJ.x + 24 + i * 48} y1={OBJ.y + OBJ.h - 18} x2={OBJ.x + 24 + i * 48} y2={OBJ.y + OBJ.h} stroke={alpha(C.text, 0.2)} strokeWidth={2} />
      ))}
    </>
  ),
};

/** Fixed order of the row: the machines, the applications, outside. */
export const SILHOUETTES: readonly SilhouetteKind[] = ['server', 'app', 'door'];

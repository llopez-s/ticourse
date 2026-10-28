import type { CSSProperties } from 'react';
import { C, FONT, alpha } from '../../../../engine/src/theme/tokens';
import { clamp01 } from '../../../../engine/src/ui';
import type { WitnessKind } from './data';

/** Natural size of a witness vignette (its viewBox). */
export const WITNESS_W = 400;
export const WITNESS_H = 420;

/** Which way the witness looks. The firewall's witness looks out to the street, not at the faces. */
export type WitnessLook = 'in' | 'street';

interface Cone {
  /** The eyes. */
  ax: number;
  ay: number;
  /** The far edge: x and its two corners' y. */
  x: number;
  y1: number;
  y2: number;
}
interface Layout {
  /** Person's centre x. */
  px: number;
  headY: number;
  cone: Cone;
}

const LAYOUT: Record<WitnessKind, Layout> = {
  // The counter: the person stands behind it and looks at who arrives, to the left.
  counter: { px: 285, headY: 148, cone: { ax: 252, ay: 148, x: 8, y1: 40, y2: 330 } },
  // The door: a narrow beam, only its own doorway.
  door: { px: 295, headY: 148, cone: { ax: 262, ay: 148, x: 150, y1: 122, y2: 204 } },
  // The window: looks in, through the pane.
  window: { px: 325, headY: 148, cone: { ax: 292, ay: 148, x: 60, y1: 95, y2: 270 } },
  // The exit: stands next to the doorway and looks out to the street (to the right).
  exit: { px: 165, headY: 148, cone: { ax: 198, ay: 148, x: 392, y1: 96, y2: 250 } },
};
/** The exit's witness turned back towards the faces. */
const EXIT_TO_FACES: Cone = { ax: 132, ay: 148, x: 8, y1: 70, y2: 300 };

/**
 * One of the four witnesses: a faceless silhouette in its own place (counter, door, window, exit) with the cone of
 * what it sees. «imagen · no es del puerto»: nobody here is a real person or anyone from the case. `see` (0–1) grows
 * the cone; `glow` (0–1) lights the figure for the moment the voice is on it; `look="street"` (the default for the
 * exit) keeps the exit's witness looking out to the street, `look="in"` turns it back to the faces. `crowd` draws
 * the faceless people it is NOT looking at. Fixed viewBox 400×420, scale it with `width`.
 */
export function WitnessFigure({
  kind,
  width = WITNESS_W,
  see = 1,
  glow = 0,
  look = 'street',
  crowd = false,
  tone = C.cyan,
  style,
}: {
  kind: WitnessKind;
  width?: number;
  see?: number;
  glow?: number;
  look?: WitnessLook;
  crowd?: boolean;
  tone?: string;
  style?: CSSProperties;
}) {
  const L = LAYOUT[kind];
  const cone = kind === 'exit' && look === 'in' ? EXIT_TO_FACES : L.cone;
  const s = clamp01(see);
  const g = clamp01(glow);
  const gid = `wit-cone-${kind}-${look}`;
  const px = L.px;
  const fx = cone.ax + (cone.x - cone.ax) * s;
  const f1 = cone.ay + (cone.y1 - cone.ay) * s;
  const f2 = cone.ay + (cone.y2 - cone.ay) * s;
  const stroke = alpha(tone, 0.55 + 0.45 * g);
  return (
    <svg
      width={width}
      height={(width * WITNESS_H) / WITNESS_W}
      viewBox={`0 0 ${WITNESS_W} ${WITNESS_H}`}
      style={{ display: 'block', overflow: 'visible', ...style }}
      aria-hidden
    >
      <defs>
        <linearGradient id={gid} x1={cone.ax} y1="0" x2={cone.x} y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={tone} stopOpacity={0.4 + 0.2 * g} />
          <stop offset="100%" stopColor={tone} stopOpacity={0.04} />
        </linearGradient>
      </defs>

      {/* ground */}
      <path d="M 14 372 H 386" stroke={C.ink600} strokeWidth={4} strokeLinecap="round" />

      {/* what it sees */}
      {s > 0.01 ? <polygon points={`${cone.ax},${cone.ay} ${fx},${f1} ${fx},${f2}`} fill={`url(#${gid})`} /> : null}

      {/* the place */}
      <Place kind={kind} tone={tone} g={g} />

      {/* the faceless people it does not look at */}
      {crowd ? <Crowd /> : null}

      {/* the person: head and shoulders, no features */}
      <g style={{ filter: g > 0.01 ? `drop-shadow(0 0 ${6 + g * 14}px ${alpha(tone, 0.45 * g)})` : undefined }}>
        <path
          d={`M ${px - 62} 372 V 258 Q ${px - 62} 208 ${px} 208 Q ${px + 62} 208 ${px + 62} 258 V 372 Z`}
          fill={C.ink700}
          stroke={stroke}
          strokeWidth={4}
          strokeLinejoin="round"
        />
        <circle cx={px} cy={L.headY} r={38} fill={C.ink700} stroke={stroke} strokeWidth={4} />
      </g>

      {/* the counter and its laptop sit in front of the body */}
      {kind === 'counter' ? <CounterFront tone={tone} /> : null}
    </svg>
  );
}

function Place({ kind, tone, g }: { kind: WitnessKind; tone: string; g: number }) {
  const frame = C.ink500;
  const lit = alpha(tone, 0.1 + 0.16 * g);
  switch (kind) {
    case 'door':
      return (
        <g>
          <rect x={34} y={104} width={130} height={268} rx={8} fill={C.ink850} stroke={frame} strokeWidth={5} />
          <rect x={48} y={118} width={102} height={254} rx={4} fill={C.ink800} stroke={alpha(frame, 0.8)} strokeWidth={3} />
          <circle cx={134} cy={252} r={8} fill={alpha(tone, 0.8)} />
          <rect x={64} y={142} width={70} height={52} rx={6} fill={lit} stroke={alpha(frame, 0.7)} strokeWidth={3} />
        </g>
      );
    case 'window':
      return (
        <g>
          <rect x={34} y={88} width={228} height={208} rx={10} fill={lit} stroke={frame} strokeWidth={6} />
          <path d="M 148 88 V 296 M 34 192 H 262" stroke={frame} strokeWidth={5} />
          {/* processes running inside, as little panes */}
          <rect x={56} y={110} width={72} height={26} rx={5} fill={alpha(tone, 0.4)} />
          <rect x={168} y={214} width={72} height={26} rx={5} fill={alpha(tone, 0.28)} />
          <rect x={56} y={214} width={52} height={26} rx={5} fill={alpha(tone, 0.2)} />
          <rect x={26} y={296} width={244} height={14} rx={5} fill={alpha(frame, 0.9)} />
        </g>
      );
    case 'exit':
      return (
        <g>
          <rect x={262} y={104} width={120} height={268} rx={8} fill={alpha('#000000', 0.22)} stroke={frame} strokeWidth={5} />
          <rect x={270} y={52} width={104} height={38} rx={8} fill={alpha(C.emerald, 0.16)} stroke={alpha(C.emerald, 0.7)} strokeWidth={3} />
          <text x={322} y={80} textAnchor="middle" fontFamily={FONT.sans} fontSize={24} fontWeight={800} fill={alpha(C.emerald, 0.95)}>
            SALIDA
          </text>
          <path d="M 300 392 L 392 392" stroke={alpha(C.muted, 0.5)} strokeWidth={4} strokeLinecap="round" strokeDasharray="14 12" />
        </g>
      );
    default:
      return null;
  }
}

function CounterFront({ tone }: { tone: string }) {
  return (
    <g>
      <rect x={120} y={292} width={270} height={80} rx={8} fill={C.ink850} stroke={C.ink500} strokeWidth={5} />
      <path d="M 236 292 L 246 250 H 330 L 340 292 Z" fill={C.ink800} stroke={alpha(tone, 0.7)} strokeWidth={3.5} strokeLinejoin="round" />
      <rect x={256} y={262} width={64} height={8} rx={3} fill={alpha(tone, 0.5)} />
      <rect x={256} y={278} width={40} height={6} rx={3} fill={alpha(tone, 0.3)} />
    </g>
  );
}

/** Faceless people on the far left. Only used to show who the witness is NOT looking at. */
function Crowd() {
  return (
    <g opacity={0.6}>
      {[34, 78].map((x, i) => {
        const top = 306 - i * 8;
        return (
          <g key={x}>
            <circle cx={x} cy={top - 22} r={16} fill={C.ink600} stroke={alpha(C.muted, 0.6)} strokeWidth={2.5} />
            <path d={`M ${x - 22} 372 V ${top + 18} Q ${x - 22} ${top} ${x} ${top} Q ${x + 22} ${top} ${x + 22} ${top + 18} V 372 Z`} fill={C.ink600} stroke={alpha(C.muted, 0.6)} strokeWidth={2.5} />
          </g>
        );
      })}
    </g>
  );
}

import { C, alpha } from '../../../../engine/src/theme/tokens';
import { clamp01 } from '../../../../engine/src/ui';

/**
 * The video's thread: the lost-property office's notebook that turns into a screen. Base size 640×470, scaled to
 * `width`. `morph` 0 = a paper notebook with handwriting (unreadable strokes, no person, no date), 1 = a screen with the
 * same four rows as tidy cyan bars; in between a scan line swaps one for the other from top to bottom. The four lost
 * objects (umbrella, key, glasses, bag) stay the same in both. Nothing here is legible: no name, no number.
 */

export const LEDGER = { w: 640, h: 470 } as const;
const ROWS = [122, 204, 286, 368] as const;
const NAME_W = [200, 150, 220, 176] as const;

/** Deterministic pseudo-random in [0, 1) so the handwriting is the same in every render. */
function rand(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** A handwritten word as an unreadable wavy stroke from x0 to x1 around y. */
function scribble(seed: number, x0: number, x1: number, y: number, amp: number): string {
  const r = rand(seed);
  let d = `M${x0} ${y}`;
  const step = 15;
  for (let x = x0; x < x1; x += step) {
    const nx = Math.min(x1, x + step);
    const up = r() > 0.5 ? -1 : 1;
    d += ` Q${((x + nx) / 2).toFixed(1)} ${(y + up * amp * (0.5 + r())).toFixed(1)} ${nx.toFixed(1)} ${(y + (r() - 0.5) * amp * 0.6).toFixed(1)}`;
  }
  return d;
}

/** Handwritten digits as short curved strokes in three groups (a phone number that cannot be read). */
function digits(seed: number, x0: number, y: number): string {
  const r = rand(seed);
  let d = '';
  for (let g = 0; g < 3; g++) {
    for (let k = 0; k < 3; k++) {
      const x = x0 + g * 62 + k * 17;
      const h = 14 + r() * 8;
      d += `M${x} ${y - h / 2} q${(r() * 9 - 2).toFixed(1)} ${(h * 0.3).toFixed(1)} ${(r() * 6 - 1).toFixed(1)} ${(h * 0.6).toFixed(1)} `;
    }
  }
  return d;
}

type Kind = 'umbrella' | 'key' | 'glasses' | 'bag';
const KINDS: readonly Kind[] = ['umbrella', 'key', 'glasses', 'bag'];

/** One lost object, centred on (cx, cy), about 44 px wide. */
function ObjectIcon({ kind, cx, cy }: { kind: Kind; cx: number; cy: number }) {
  const s = { stroke: alpha(C.sky, 0.95), strokeWidth: 3.2, fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round' } as const;
  return (
    <g transform={`translate(${cx} ${cy})`}>
      {kind === 'umbrella' ? (
        <>
          <path d="M-20 4 A20 20 0 0 1 20 4 Z" {...s} fill={alpha(C.sky, 0.12)} />
          <path d="M0 4 V16 q0 6 -6 6" {...s} />
        </>
      ) : null}
      {kind === 'key' ? (
        <>
          <circle cx={-12} cy={0} r={8} {...s} />
          <path d="M-4 0 H20 M13 0 V8 M20 0 V6" {...s} />
        </>
      ) : null}
      {kind === 'glasses' ? (
        <>
          <circle cx={-11} cy={2} r={9} {...s} />
          <circle cx={11} cy={2} r={9} {...s} />
          <path d="M-2 0 q2 -3 4 0 M-20 0 L-23 -6 M20 0 L23 -6" {...s} />
        </>
      ) : null}
      {kind === 'bag' ? (
        <>
          <rect x={-14} y={-12} width={28} height={32} rx={9} {...s} fill={alpha(C.sky, 0.12)} />
          <rect x={-8} y={4} width={16} height={10} rx={3} {...s} />
          <path d="M-7 -12 q7 -10 14 0" {...s} />
        </>
      ) : null}
    </g>
  );
}

/** The paper notebook layer. */
function Notebook() {
  const ink = alpha(C.text, 0.82);
  return (
    <svg width={LEDGER.w} height={LEDGER.h} viewBox={`0 0 ${LEDGER.w} ${LEDGER.h}`} fill="none" style={{ position: 'absolute', left: 0, top: 0 }}>
      <rect x={22} y={12} width={598} height={444} rx={16} fill={alpha(C.amber, 0.1)} stroke={alpha(C.amber, 0.6)} strokeWidth={3.5} />
      {Array.from({ length: 10 }).map((_, i) => (
        <circle key={i} cx={22} cy={48 + i * 42} r={9} fill={C.ink950} stroke={alpha(C.text, 0.6)} strokeWidth={3} />
      ))}
      <path d={scribble(11, 96, 330, 62, 5)} stroke={ink} strokeWidth={4.5} strokeLinecap="round" />
      {ROWS.map((y, i) => (
        <g key={i}>
          <path d={`M60 ${y + 34} H596`} stroke={alpha(C.amber, 0.25)} strokeWidth={2.5} />
          <path d={scribble(31 + i * 7, 146, 146 + NAME_W[i], y + 2, 7)} stroke={ink} strokeWidth={3.6} strokeLinecap="round" />
          <path d={digits(77 + i * 5, 408, y + 4)} stroke={ink} strokeWidth={3.4} strokeLinecap="round" />
        </g>
      ))}
    </svg>
  );
}

/** The screen layer. */
function Screen() {
  return (
    <svg width={LEDGER.w} height={LEDGER.h} viewBox={`0 0 ${LEDGER.w} ${LEDGER.h}`} fill="none" style={{ position: 'absolute', left: 0, top: 0 }}>
      <rect x={20} y={10} width={600} height={402} rx={24} fill={C.ink900} stroke={alpha(C.cyan, 0.75)} strokeWidth={4} />
      <path d="M20 34 a24 24 0 0 1 24 -24 H596 a24 24 0 0 1 24 24 V52 H20 Z" fill={alpha(C.cyan, 0.12)} />
      {[0, 1, 2].map((i) => (
        <circle key={i} cx={52 + i * 24} cy={31} r={6} fill={alpha(C.cyan, 0.7 - i * 0.2)} />
      ))}
      <rect x={150} y={24} width={190} height={14} rx={7} fill={alpha(C.cyan, 0.35)} />
      <path d="M296 412 L282 446 H358 L344 412 Z" fill={C.ink850} stroke={alpha(C.cyan, 0.5)} strokeWidth={3} strokeLinejoin="round" />
      <rect x={236} y={444} width={168} height={14} rx={7} fill={C.ink850} stroke={alpha(C.cyan, 0.5)} strokeWidth={3} />
      {ROWS.map((y, i) => (
        <g key={i}>
          <rect x={44} y={y - 34} width={552} height={68} rx={14} fill={alpha(C.cyan, 0.07)} stroke={alpha(C.cyan, 0.32)} strokeWidth={2.5} />
          <rect x={146} y={y - 12} width={NAME_W[i]} height={22} rx={11} fill={alpha(C.cyan, 0.85)} />
          <rect x={408} y={y - 12} width={150} height={22} rx={11} fill={alpha(C.cyanSoft, 0.4)} />
        </g>
      ))}
    </svg>
  );
}

/** The objects' icons, drawn once on top of both layers so they never swap. */
function Objects() {
  return (
    <svg width={LEDGER.w} height={LEDGER.h} viewBox={`0 0 ${LEDGER.w} ${LEDGER.h}`} fill="none" style={{ position: 'absolute', left: 0, top: 0 }}>
      {ROWS.map((y, i) => (
        <ObjectIcon key={i} kind={KINDS[i]} cx={96} cy={y} />
      ))}
    </svg>
  );
}

export function Ledger({ width = 640, morph = 0, glow = 0 }: { width?: number; morph?: number; glow?: number }) {
  const p = clamp01(morph);
  const k = width / LEDGER.w;
  const showPaper = p < 0.999;
  const showScreen = p > 0.001;
  const scan = p > 0.001 && p < 0.999;
  return (
    <div style={{ position: 'relative', width, height: LEDGER.h * k }}>
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: LEDGER.w,
          height: LEDGER.h,
          transformOrigin: '0 0',
          transform: `scale(${k})`,
          filter: glow > 0.02 ? `drop-shadow(0 0 ${Math.round(26 * glow)}px ${alpha(p > 0.5 ? C.cyan : C.amber, 0.38 * glow)})` : undefined,
        }}
      >
        <div style={{ position: 'absolute', inset: 0, transform: `rotate(${-2.2 * (1 - p)}deg)`, transformOrigin: '50% 55%' }}>
          {showPaper ? (
            <div style={{ position: 'absolute', inset: 0, clipPath: `inset(${p * 100}% 0 0 0)` }}>
              <Notebook />
            </div>
          ) : null}
          {showScreen ? (
            <div style={{ position: 'absolute', inset: 0, clipPath: `inset(0 0 ${(1 - p) * 100}% 0)` }}>
              <Screen />
            </div>
          ) : null}
          <Objects />
          {scan ? (
            <div
              style={{
                position: 'absolute',
                left: 14,
                width: LEDGER.w - 28,
                top: p * LEDGER.h - 2,
                height: 4,
                borderRadius: 2,
                background: C.cyan,
                boxShadow: `0 0 18px ${alpha(C.cyan, 0.9)}`,
              }}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}

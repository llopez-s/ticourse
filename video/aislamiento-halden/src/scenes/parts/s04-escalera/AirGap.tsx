import { C, alpha } from '../../../../../engine/src/theme/tokens';
import { clamp01 } from '../../../../../engine/src/ui';

export const AIRGAP = { w: 340, h: 96 } as const;
const BOX = { w: 92, h: 72, y: 12 } as const;
const L = { x: 0 } as const;
const R = { x: AIRGAP.w - BOX.w } as const;
const CY = BOX.y + BOX.h / 2;
const GAP_X0 = 146;
const GAP_X1 = 194;

/** One blank machine: no name, no screen content (no port system inside the air gap). */
function Machine({ x }: { x: number }) {
  return (
    <g>
      <rect x={x} y={BOX.y} width={BOX.w} height={BOX.h} rx={12} fill={alpha(C.sky, 0.1)} stroke={alpha(C.sky, 0.7)} strokeWidth={3} />
      <rect x={x + 14} y={BOX.y + 14} width={BOX.w - 28} height={10} rx={5} fill={alpha(C.sky, 0.35)} />
      <rect x={x + 14} y={BOX.y + 32} width={BOX.w - 44} height={10} rx={5} fill={alpha(C.sky, 0.25)} />
      <circle cx={x + BOX.w - 18} cy={BOX.y + BOX.h - 16} r={6} fill={alpha(C.emerald, 0.7)} />
    </g>
  );
}

/**
 * The air gap (s04 `air-gap`, the lock sound): two blank machines joined by a cable; with `cut` 0–1 the cable snaps in
 * the middle, both ends spring back and an empty dashed gap is left — no network path. `hand` 0–1 carries a document
 * over the gap along an arc (todo entra y sale a mano). Never a padlock.
 */
export function AirGap({ cut, hand = 0 }: { cut: number; hand?: number }) {
  const c = clamp01(cut);
  const recoil = 14 * c;
  const lx1 = L.x + BOX.w;
  const rx0 = R.x;
  const mid = (GAP_X0 + GAP_X1) / 2;
  const leftEnd = c < 0.02 ? mid : GAP_X0 - recoil;
  const rightStart = c < 0.02 ? mid : GAP_X1 + recoil;
  const spark = c > 0.02 && c < 0.9 ? 1 - c : 0;
  const h = clamp01(hand);
  const hx = mix(L.x + BOX.w / 2, R.x + BOX.w / 2, h);
  const hy = CY - 30 - Math.sin(Math.PI * h) * 26;
  return (
    <svg width={AIRGAP.w} height={AIRGAP.h} viewBox={`0 0 ${AIRGAP.w} ${AIRGAP.h}`} style={{ overflow: 'visible' }}>
      <Machine x={L.x} />
      <Machine x={R.x} />
      <line x1={lx1} y1={CY} x2={leftEnd} y2={CY + 2 * c} stroke={alpha(C.sky, 0.85)} strokeWidth={6} strokeLinecap="round" />
      <line x1={rightStart} y1={CY + 2 * c} x2={rx0} y2={CY} stroke={alpha(C.sky, 0.85)} strokeWidth={6} strokeLinecap="round" />
      {c > 0.02 ? (
        <rect x={GAP_X0 - recoil + 6} y={CY - 22} width={GAP_X1 - GAP_X0 + 2 * recoil - 12} height={44} rx={10} fill="none" stroke={alpha(C.text, 0.5 * c)} strokeWidth={3} strokeDasharray="7 6" />
      ) : null}
      {spark > 0
        ? [-1, 1].map((s) =>
            [0, 1, 2].map((k) => {
              const x0 = s < 0 ? leftEnd : rightStart;
              const a = (-50 + k * 50) * (Math.PI / 180);
              return <line key={`${s}${k}`} x1={x0} y1={CY} x2={x0 + s * 16 * Math.cos(a)} y2={CY + 16 * Math.sin(a)} stroke={alpha(C.amber, spark)} strokeWidth={3} strokeLinecap="round" />;
            }),
          )
        : null}
      {h > 0.01 && h < 0.99 ? (
        <g transform={`translate(${hx - 13} ${hy - 16})`}>
          <path d="M 0 0 L 18 0 L 26 8 L 26 32 L 0 32 Z" fill={C.ink850} stroke={C.text} strokeWidth={3} strokeLinejoin="round" />
          <line x1={5} y1={14} x2={20} y2={14} stroke={alpha(C.text, 0.6)} strokeWidth={2.5} />
          <line x1={5} y1={22} x2={18} y2={22} stroke={alpha(C.text, 0.6)} strokeWidth={2.5} />
        </g>
      ) : null}
    </svg>
  );
}

function mix(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

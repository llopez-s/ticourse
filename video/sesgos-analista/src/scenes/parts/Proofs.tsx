import { C, alpha } from '../../../../engine/src/theme/tokens';
import { Icon } from '../../../../engine/src/ui';

/**
 * The three drawings of the three outside weights (s05) and of the recap's thumbnails. Each is an SVG box
 * 210 × 130 (its own grid), so it can be placed in a card and scaled with CSS.
 */
export const PROOF_BOX = { w: 210, h: 130 } as const;

const STONE = '#94a3b8';

/**
 * A hypothesis on a post and a stone thrown at it. `thrown` 0–1: the stone's flight (it arrives at 1);
 * `wobble` is the card's tilt in degrees after the hit (the scene decays it); with `thrown` = 0 the stone
 * is not drawn. The card stands again at the end: the test does not say whether it holds.
 */
export function HypothesisStone({ thrown = 0, wobble = 0, tone = C.cyan }: { thrown?: number; wobble?: number; tone?: string }) {
  const sx = 12 + (132 - 12) * thrown;
  const sy = 96 - 190 * thrown * (1 - thrown) - 20 * thrown;
  return (
    <svg width={PROOF_BOX.w} height={PROOF_BOX.h} viewBox={`0 0 ${PROOF_BOX.w} ${PROOF_BOX.h}`} style={{ display: 'block', overflow: 'visible' }}>
      <path d="M 148 128 H 196" stroke={alpha(C.muted, 0.6)} strokeWidth={4} strokeLinecap="round" />
      <path d="M 172 128 V 86" stroke={alpha(C.muted, 0.8)} strokeWidth={5} strokeLinecap="round" />
      <g transform={`rotate(${wobble} 172 86)`}>
        <rect x={130} y={20} width={84} height={66} rx={12} fill={alpha(tone, 0.16)} stroke={tone} strokeWidth={4} />
        <g transform="translate(148 36)">
          <path d="M 4 6 H 34 M 4 22 H 28 M 4 38 H 22" stroke={alpha(tone, 0.8)} strokeWidth={5} strokeLinecap="round" />
        </g>
      </g>
      {thrown > 0.01 && thrown < 1 ? <polygon points={`${sx - 12},${sy + 4} ${sx - 6},${sy - 10} ${sx + 8},${sy - 11} ${sx + 13},${sy + 2} ${sx + 4},${sy + 11} ${sx - 8},${sy + 11}`} fill={STONE} stroke="#e2e8f0" strokeWidth={2} strokeLinejoin="round" /> : null}
    </svg>
  );
}

/**
 * Someone who really disagrees: you (cyan) and a reviewer (sky) face to face, your bubble with a tick, theirs
 * with a cross. `show` 0–1 brings the reviewer's bubble in.
 */
export function Peers({ show = 1 }: { show?: number }) {
  const bubble = (x: number, y: number, tone: string, icon: 'check' | 'x', o: number) => (
    <g opacity={o}>
      <rect x={x} y={y} width={64} height={46} rx={14} fill={alpha(tone, 0.16)} stroke={tone} strokeWidth={3.5} />
      <g transform={`translate(${x + 18} ${y + 8})`}>
        <Icon name={icon} size={28} color={tone} strokeWidth={3} />
      </g>
    </g>
  );
  return (
    <svg width={PROOF_BOX.w} height={PROOF_BOX.h} viewBox={`0 0 ${PROOF_BOX.w} ${PROOF_BOX.h}`} style={{ display: 'block', overflow: 'visible' }}>
      <circle cx={40} cy={86} r={34} fill={alpha(C.cyan, 0.14)} stroke={C.cyan} strokeWidth={4} />
      <g transform="translate(18 64)">
        <Icon name="user" size={44} color={C.cyan} strokeWidth={2} />
      </g>
      <circle cx={170} cy={86} r={34} fill={alpha(C.sky, 0.14)} stroke={C.sky} strokeWidth={4} />
      <g transform="translate(148 64)">
        <Icon name="user" size={44} color={C.sky} strokeWidth={2} />
      </g>
      {bubble(20, 8, C.emerald, 'check', 1)}
      {bubble(126, 8, C.amber, 'x', show)}
      <path d="M 86 86 H 124" stroke={alpha(C.muted, 0.7)} strokeWidth={4} strokeDasharray="4 8" strokeLinecap="round" opacity={show} />
    </svg>
  );
}

/**
 * A notebook with its date line left blank (no readable date) and three lines of a judgment being written
 * by a pen. `write` 0–1 is how much has been written.
 */
export function Notebook({ write = 1 }: { write?: number }) {
  const lines = [0, 1, 2];
  const per = 1 / 3;
  return (
    <svg width={PROOF_BOX.w} height={PROOF_BOX.h} viewBox={`0 0 ${PROOF_BOX.w} ${PROOF_BOX.h}`} style={{ display: 'block', overflow: 'visible' }}>
      <rect x={34} y={4} width={142} height={122} rx={12} fill="#e8eef6" stroke="#94a3b8" strokeWidth={3} />
      {[0, 1, 2, 3, 4].map((i) => (
        <circle key={i} cx={34} cy={20 + i * 24} r={6} fill={C.ink800} stroke="#94a3b8" strokeWidth={2.5} />
      ))}
      {/* the date, left blank */}
      <rect x={54} y={16} width={86} height={16} rx={8} fill="none" stroke="#94a3b8" strokeWidth={2.5} strokeDasharray="5 5" />
      {lines.map((i) => {
        const w = Math.max(0, Math.min(1, (write - i * per) / per));
        return <path key={i} d={`M 54 ${54 + i * 22} H ${54 + 106 * w}`} stroke="#475569" strokeWidth={5} strokeLinecap="round" />;
      })}
      {/* the pen */}
      {write > 0.01 && write < 1.0 ? (
        <g transform={`translate(${54 + 106 * Math.max(0, Math.min(1, (write * 3) % 1)) + 4} ${54 + Math.min(2, Math.floor(write * 3)) * 22 - 4}) rotate(35)`}>
          <rect x={0} y={-5} width={46} height={10} rx={5} fill={C.amber} stroke="#b45309" strokeWidth={2} />
          <polygon points="0,-5 -12,0 0,5" fill="#e2e8f0" />
        </g>
      ) : null}
    </svg>
  );
}

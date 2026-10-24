import type { ReactNode } from 'react';
import { C, alpha } from '../../../../engine/src/theme/tokens';

/**
 * The five still, dim, textless backgrounds of the question scenes (stage 1728 × 660). Nothing here moves and
 * nothing is legible: each one only sets the question's place, outside the port.
 */
const W = 1728;
const H = 660;

function Frame({ children }: { children: ReactNode }) {
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} fill="none" style={{ position: 'absolute', left: 0, top: 0 }}>
      <rect x={0} y={20} width={W} height={H - 40} rx={18} fill={C.ink850} />
      {children}
    </svg>
  );
}

/** s04: a power-line pylon (an electricity company, nameless) with three wires running off both sides. */
export function PylonArt() {
  const cx = 864;
  const arms = [
    { y: 150, half: 190 },
    { y: 250, half: 250 },
    { y: 350, half: 190 },
  ];
  return (
    <Frame>
      <path d={`M 0 560 Q 430 500 860 548 T ${W} 530 V ${H - 20} H 0 Z`} fill={alpha(C.ink700, 0.55)} />
      {/* lattice legs and bracing */}
      <path d={`M ${cx - 20} 90 L ${cx - 110} 560 M ${cx + 20} 90 L ${cx + 110} 560`} stroke={alpha(C.sky, 0.8)} strokeWidth={8} strokeLinecap="round" />
      {[150, 230, 310, 390, 470].map((y, k) => {
        const half = 20 + ((y - 90) / 470) * 90;
        const next = 20 + ((y + 80 - 90) / 470) * 90;
        return (
          <g key={y} stroke={alpha(C.sky, 0.5)} strokeWidth={5}>
            <line x1={cx - half} y1={y} x2={cx + half} y2={y} />
            {k < 4 ? <line x1={cx - half} y1={y} x2={cx + next} y2={y + 80} /> : null}
            {k < 4 ? <line x1={cx + half} y1={y} x2={cx - next} y2={y + 80} /> : null}
          </g>
        );
      })}
      {/* crossarms, insulators and the wires */}
      {arms.map((a, i) => (
        <g key={a.y}>
          <line x1={cx - a.half} y1={a.y} x2={cx + a.half} y2={a.y} stroke={alpha(C.sky, 0.9)} strokeWidth={9} strokeLinecap="round" />
          {[-1, 1].map((sd) => (
            <g key={sd}>
              <line x1={cx + sd * a.half} y1={a.y} x2={cx + sd * a.half} y2={a.y + 34} stroke={alpha(C.cyan, 0.85)} strokeWidth={9} strokeLinecap="round" />
              <path d={`M ${cx + sd * a.half} ${a.y + 34} Q ${cx + sd * (a.half + 300)} ${a.y + 120 + i * 20} ${cx + sd * (a.half + 640)} ${a.y + 20 + i * 30}`} stroke={alpha(C.cyan, 0.55)} strokeWidth={4} />
            </g>
          ))}
        </g>
      ))}
    </Frame>
  );
}

/** s06: a generic freight truck, side view, on a road (a logistics company, nameless; no text on the cargo box). */
export function TruckArt() {
  return (
    <Frame>
      <rect x={0} y={470} width={W} height={150} fill={alpha(C.ink700, 0.6)} />
      <line x1={0} y1={545} x2={W} y2={545} stroke={alpha(C.text, 0.25)} strokeWidth={6} strokeDasharray="60 44" />
      <g transform="translate(330 150)">
        <rect x={0} y={0} width={780} height={300} rx={14} fill={alpha(C.cyan, 0.12)} stroke={alpha(C.cyan, 0.7)} strokeWidth={6} />
        {[130, 260, 390, 520, 650].map((x) => (
          <line key={x} x1={x} y1={14} x2={x} y2={286} stroke={alpha(C.cyan, 0.25)} strokeWidth={4} />
        ))}
        <path d="M 800 90 H 940 Q 980 90 1000 150 L 1040 200 V 300 H 800 Z" fill={alpha(C.sky, 0.18)} stroke={alpha(C.sky, 0.8)} strokeWidth={6} strokeLinejoin="round" />
        <path d="M 830 110 H 925 Q 950 110 962 150 L 975 190 H 830 Z" fill={alpha(C.ink900, 0.9)} stroke={alpha(C.sky, 0.5)} strokeWidth={4} />
        {[130, 290, 880].map((x) => (
          <g key={x}>
            <circle cx={x} cy={318} r={52} fill={C.ink900} stroke={alpha(C.text, 0.6)} strokeWidth={8} />
            <circle cx={x} cy={318} r={18} fill={alpha(C.text, 0.3)} />
          </g>
        ))}
      </g>
    </Frame>
  );
}

/** s08: an operations room with its screens dark: a wall screen and three rows of desks (a bank's, nameless). */
export function SocRoomArt() {
  return (
    <Frame>
      <rect x={300} y={60} width={1128} height={170} rx={14} fill={C.ink950} stroke={alpha(C.sky, 0.5)} strokeWidth={6} />
      <rect x={330} y={84} width={1068} height={122} rx={8} fill={C.ink900} />
      {[0, 1, 2].map((r) =>
        [0, 1, 2, 3, 4].map((c) => {
          const x = 220 + c * 260 - r * 0 + (r % 2) * 20;
          const y = 280 + r * 118;
          return (
            <g key={`${r}-${c}`}>
              <rect x={x} y={y + 40} width={200} height={26} rx={8} fill={alpha(C.ink700, 0.9)} stroke={alpha(C.text, 0.2)} strokeWidth={3} />
              <rect x={x + 50} y={y} width={100} height={48} rx={6} fill={C.ink950} stroke={alpha(C.cyan, 0.55)} strokeWidth={4} />
              <rect x={x + 78} y={y + 66} width={44} height={22} rx={10} fill={alpha(C.ink600, 0.7)} />
            </g>
          );
        }),
      )}
    </Frame>
  );
}

/** s10: a grid of lesson tiles of an online course platform (nameless): play triangles and bars, no titles. */
export function LessonGridArt() {
  const cols = 5;
  const rows = 3;
  const tw = 280;
  const th = 150;
  const gx = (W - cols * tw) / (cols + 1);
  const gy = 56;
  return (
    <Frame>
      {Array.from({ length: rows * cols }, (_, i) => {
        const c = i % cols;
        const r = Math.floor(i / cols);
        const x = gx + c * (tw + gx);
        const y = 52 + r * (th + gy + 36);
        const done = [0, 1, 2, 5, 6].includes(i);
        return (
          <g key={i}>
            <rect x={x} y={y} width={tw} height={th} rx={14} fill={C.ink800} stroke={alpha(done ? C.emerald : C.cyan, 0.55)} strokeWidth={4} />
            <path d={`M ${x + tw / 2 - 18} ${y + th / 2 - 24} L ${x + tw / 2 + 24} ${y + th / 2} L ${x + tw / 2 - 18} ${y + th / 2 + 24} Z`} fill={alpha(C.text, 0.4)} />
            <rect x={x} y={y + th + 12} width={tw * 0.8} height={10} rx={5} fill={alpha(C.text, 0.3)} />
            <rect x={x} y={y + th + 32} width={tw * 0.5} height={10} rx={5} fill={alpha(C.text, 0.18)} />
          </g>
        );
      })}
    </Frame>
  );
}

/** s12: a magnifier over a field of dots (a search engine for exposed devices, nameless): the dots in the lens are bigger. */
export function MagnifierArt() {
  const lens = { x: 760, y: 300, r: 190 };
  const dots: [number, number][] = [];
  for (let c = 0; c < 22; c++) for (let r = 0; r < 8; r++) dots.push([90 + c * 70, 90 + r * 70]);
  return (
    <Frame>
      {dots.map(([x, y], i) => {
        const inside = (x - lens.x) ** 2 + (y - lens.y) ** 2 < lens.r ** 2;
        return <circle key={i} cx={x} cy={y} r={inside ? 11 : 5} fill={alpha(inside ? C.cyan : C.sky, inside ? 0.8 : 0.35)} />;
      })}
      <circle cx={lens.x} cy={lens.y} r={lens.r} fill={alpha(C.cyan, 0.06)} stroke={alpha(C.cyanSoft, 0.9)} strokeWidth={14} />
      <line x1={lens.x + lens.r * 0.72} y1={lens.y + lens.r * 0.72} x2={lens.x + lens.r * 1.5} y2={lens.y + lens.r * 1.5} stroke={alpha(C.cyanSoft, 0.9)} strokeWidth={26} strokeLinecap="round" />
    </Frame>
  );
}

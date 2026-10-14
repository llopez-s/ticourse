import { C, alpha } from '../../../../engine/src/theme/tokens';

/**
 * The video's one everyday image: a 400 € phone (1 : 1.000 of R-014's 400.000 €). Shared by s02 (the cracked
 * screen), s04 (the 20 € case and the 90 € case) and s06 (the rule icon).
 *
 *   crack    0 → 1  the screen cracks (a fraction of the value: «se rompe la pantalla», 100 €, EF 0,25).
 *   caseKind 'none' | 'cheap' | 'costly'  the case around it. cheap = 20 €, one that pays for itself (emerald);
 *            costly = 90 € (amber: costs more than the knocks it saves, only in s04, mute).
 *   caseOn   0 → 1  how much of the case is drawn (a case fading in).
 *   glow     0 → 1  highlight halo.
 *
 * Draws at its own scale: `width` is the phone's body width; the SVG is `width × width * 1.9` plus a margin for
 * the case. Position it with a wrapper `div` (position: absolute; left; top).
 */
export type PhoneProps = {
  width?: number;
  crack?: number;
  caseKind?: 'none' | 'cheap' | 'costly';
  caseOn?: number;
  glow?: number;
  opacity?: number;
};

export const PHONE_RATIO = 1.9;

export function Phone({ width = 160, crack = 0, caseKind = 'none', caseOn = 1, glow = 0, opacity = 1 }: PhoneProps) {
  const w = width;
  const h = Math.round(width * PHONE_RATIO);
  const m = Math.round(width * 0.16); // margin for the case
  const r = Math.round(width * 0.17);
  const caseColor = caseKind === 'cheap' ? C.emerald : caseKind === 'costly' ? C.amber : C.muted;
  const caseW = caseKind === 'costly' ? Math.round(width * 0.14) : Math.round(width * 0.075);
  const sx = Math.round(width * 0.09);
  const sy = Math.round(width * 0.16);
  const sw = w - 2 * sx;
  const sh = h - sy - Math.round(width * 0.2);
  const k = (v: number) => Math.round(v * 10) / 10;

  // A crack from the top-right corner of the screen, in five straight segments (deterministic).
  const pts: Array<[number, number]> = [
    [sx + sw * 0.92, sy],
    [sx + sw * 0.7, sy + sh * 0.2],
    [sx + sw * 0.78, sy + sh * 0.38],
    [sx + sw * 0.5, sy + sh * 0.56],
    [sx + sw * 0.58, sy + sh * 0.8],
  ];
  const branch: Array<[number, number]> = [
    [sx + sw * 0.78, sy + sh * 0.38],
    [sx + sw * 0.98, sy + sh * 0.5],
  ];
  const main = pts.map((p, i) => `${i ? 'L' : 'M'} ${k(p[0] + m)} ${k(p[1] + m)}`).join(' ');
  const sec = branch.map((p, i) => `${i ? 'L' : 'M'} ${k(p[0] + m)} ${k(p[1] + m)}`).join(' ');

  return (
    <svg width={w + 2 * m} height={h + 2 * m} viewBox={`0 0 ${w + 2 * m} ${h + 2 * m}`} style={{ opacity, overflow: 'visible' }}>
      {glow > 0.01 ? (
        <rect x={m - 14} y={m - 14} width={w + 28} height={h + 28} rx={r + 14} fill="none" stroke={alpha(C.cyan, 0.5 * glow)} strokeWidth={10} />
      ) : null}
      {caseKind !== 'none' && caseOn > 0.01 ? (
        <rect
          x={m - caseW / 2}
          y={m - caseW / 2}
          width={w + caseW}
          height={h + caseW}
          rx={r + caseW / 2}
          fill={alpha(caseColor, 0.12 * caseOn)}
          stroke={alpha(caseColor, caseOn)}
          strokeWidth={caseW}
        />
      ) : null}
      <rect x={m} y={m} width={w} height={h} rx={r} fill={C.ink800} stroke={C.ink500} strokeWidth={3} />
      <rect x={m + sx} y={m + sy} width={sw} height={sh} rx={Math.round(r * 0.45)} fill={C.ink950} stroke={alpha(C.cyan, 0.35)} strokeWidth={2} />
      <circle cx={m + w / 2} cy={m + h - Math.round(width * 0.1)} r={Math.round(width * 0.045)} fill={C.ink600} />
      {crack > 0.01 ? (
        <g>
          <path d={main} fill="none" stroke={C.rose} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - Math.min(1, crack * 1.2)} />
          <path d={sec} fill="none" stroke={C.roseSoft} strokeWidth={3} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - Math.max(0, Math.min(1, (crack - 0.35) * 1.6))} />
          <rect
            x={m + sx}
            y={m + sy}
            width={sw}
            height={sh}
            rx={Math.round(r * 0.45)}
            fill={alpha(C.rose, 0.1 * crack)}
          />
        </g>
      ) : null}
    </svg>
  );
}

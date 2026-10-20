import { C, alpha } from '../../../../engine/src/theme/tokens';
import { clamp01, mix } from '../../../../engine/src/ui';

/** The cloakroom's own units (viewBox). */
export const CLOAKROOM = { w: 640, h: 400 } as const;

/** A small backpack on a shelf (bottom-centre at x, y). */
export function MiniPack({ x, y, s = 1, tone = '#4d6285', lit = 0 }: { x: number; y: number; s?: number; tone?: string; lit?: number }) {
  const l = clamp01(lit);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {l > 0.02 ? <ellipse cx={0} cy={-26} rx={36} ry={34} fill={alpha(C.cyan, 0.25 * l)} /> : null}
      <path d="M -10 -50 Q -10 -60 0 -60 Q 10 -60 10 -50" fill="none" stroke="#2c3a52" strokeWidth={4} />
      <path d="M -22 -40 Q -22 -54 0 -54 Q 22 -54 22 -40 L 24 -4 Q 24 0 20 0 L -20 0 Q -24 0 -24 -4 Z" fill={l > 0.02 ? '#2f6f86' : tone} stroke={l > 0.02 ? C.cyan : '#62789e'} strokeWidth={l > 0.02 ? 3.5 : 2} />
      <rect x={-14} y={-26} width={28} height={18} rx={5} fill={alpha('#000000', 0.18)} />
      <line x1={-12} y1={-26} x2={12} y2={-26} stroke={alpha('#cbd5e1', 0.6)} strokeWidth={2.5} />
    </g>
  );
}

/** The backpacks on the shelves: [x, shelf y]. Index YOURS is the viewer's. */
const PACKS: [number, number][] = [
  [150, 100], [210, 100], [270, 100], [330, 100], [390, 100], [450, 100], [510, 100],
  [150, 180], [210, 180], [270, 180], [330, 180], [390, 180], [450, 180], [510, 180],
];
const YOURS = 10;
const TONES = ['#4d6285', '#5b4d85', '#4d7a85', '#85664d', '#4d6285', '#6b5b7a', '#4d8571'];
/** Where the taken backpacks go: the pickpocket's side of the counter. */
const EXIT = { x: 60, y: 300 };

/**
 * The station's cloakroom (s06, s08 rule 3, the scene adds «imagen · no es del puerto»): shelves of backpacks behind a
 * counter and its attendant. The pickpocket (rose) never touches a zipper: `fooled` 0–1 puts his speech bubble in front
 * of the attendant, who turns to it; `taken` 0–1 sends every backpack on the shelves — yours too — out by his side of the
 * counter. `yours` 0–1 outlines yours in cyan. Never lockers.
 */
export function Cloakroom({ width, fooled = 0, taken = 0, yours = 0 }: { width: number; fooled?: number; taken?: number; yours?: number }) {
  const h = (width * CLOAKROOM.h) / CLOAKROOM.w;
  const f = clamp01(fooled);
  const t = clamp01(taken);
  return (
    <svg width={width} height={h} viewBox={`0 0 ${CLOAKROOM.w} ${CLOAKROOM.h}`} style={{ display: 'block', overflow: 'visible' }}>
      {/* back wall and shelves */}
      <rect x={110} y={20} width={430} height={230} rx={10} fill={C.ink850} stroke={alpha(C.sky, 0.3)} strokeWidth={3} />
      {[100, 180].map((y) => (
        <rect key={y} x={120} y={y} width={410} height={8} rx={3} fill={C.ink700} />
      ))}
      {/* a sign with a backpack on it, no words */}
      <rect x={270} y={-34} width={110} height={44} rx={8} fill={C.ink800} stroke={alpha(C.sky, 0.6)} strokeWidth={3} />
      <MiniPack x={325} y={4} s={0.62} tone="#38bdf8" />
      {PACKS.map(([x, y], i) => {
        // Each backpack leaves in turn, to the left, past the counter.
        const k = clamp01((t - i * 0.035) / 0.5);
        if (k >= 0.999) return null;
        const px = mix(x, EXIT.x, k);
        const py = mix(y, EXIT.y, k) - Math.sin(Math.PI * k) * 40;
        return (
          <g key={i} opacity={1 - k * 0.85}>
            <MiniPack x={px} y={py} tone={TONES[i % TONES.length]} lit={i === YOURS ? yours : 0} />
          </g>
        );
      })}
      {/* the attendant, behind the counter; looks at the bubble when fooled */}
      <g transform="translate(440 0)">
        <path d="M -46 250 Q -46 196 0 196 Q 46 196 46 250 Z" fill="#2b5875" stroke={alpha(C.sky, 0.8)} strokeWidth={3} />
        <circle cx={0} cy={172} r={24} fill="#3f6f8f" stroke={alpha(C.sky, 0.8)} strokeWidth={3} />
        <circle cx={mix(8, -12, f)} cy={168} r={3.5} fill={C.ink950} />
        <circle cx={mix(-4, -22, f)} cy={168} r={3.5} fill={C.ink950} opacity={f} />
      </g>
      {/* the counter */}
      <rect x={40} y={244} width={560} height={18} rx={5} fill={C.ink700} stroke={alpha(C.sky, 0.6)} strokeWidth={3} />
      <rect x={60} y={262} width={520} height={130} rx={4} fill={C.ink800} stroke={alpha(C.sky, 0.45)} strokeWidth={3} />
      <rect x={60} y={320} width={520} height={5} fill={alpha(C.sky, 0.2)} />
      {/* the pickpocket, at the counter's left end, in front */}
      <g>
        <path d="M 30 400 Q 30 300 90 300 Q 150 300 150 400 Z" fill={C.roseDeep} stroke={alpha(C.rose, 0.85)} strokeWidth={3.5} />
        <circle cx={90} cy={272} r={28} fill="#5a1626" stroke={alpha(C.rose, 0.85)} strokeWidth={3.5} />
      </g>
      {/* his talk, in front of the attendant */}
      {f > 0.01 ? (
        <g opacity={f} transform={`translate(0 ${(1 - f) * 10})`}>
          <path d="M 170 176 Q 170 148 198 148 L 330 148 Q 358 148 358 176 L 358 196 Q 358 224 330 224 L 206 224 L 168 250 L 184 222 Q 170 214 170 196 Z" fill={C.ink900} stroke={alpha(C.rose, 0.85)} strokeWidth={3.5} />
          {[0, 1, 2].map((k) => (
            <circle key={k} cx={232 + k * 32} cy={186} r={8} fill={C.roseSoft} />
          ))}
        </g>
      ) : null}
    </svg>
  );
}

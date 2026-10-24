import { C, STAGE, alpha } from '../../../../engine/src/theme/tokens';

/**
 * The still, textless backgrounds of the question scenes (the engine's panel covers them, dimmed). Each fills the stage
 * centred. No text, brand or name.
 */

/** s03: an external drive inside an open handbag. */
export function BagArt() {
  const w = 760;
  const h = 520;
  return (
    <div style={{ position: 'absolute', left: (STAGE.width - w) / 2, top: (STAGE.height - h) / 2 }}>
      <svg width={w} height={h} viewBox="0 0 380 260" style={{ overflow: 'visible' }}>
        {/* handles */}
        <path d="M 110 96 Q 110 20 190 20 Q 270 20 270 96" fill="none" stroke={C.ink500} strokeWidth={10} strokeLinecap="round" />
        {/* the drive, sticking out of the bag */}
        <rect x={150} y={62} width={92} height={120} rx={12} fill={C.ink800} stroke={C.cyan} strokeWidth={4} transform="rotate(-8 196 122)" />
        <circle cx={186} cy={86} r={5} fill={alpha(C.cyan, 0.8)} transform="rotate(-8 196 122)" />
        <rect x={170} y={150} width={50} height={8} rx={4} fill={alpha(C.cyan, 0.4)} transform="rotate(-8 196 122)" />
        {/* bag body */}
        <path d="M 60 100 L 320 100 L 300 240 Q 298 252 284 252 L 96 252 Q 82 252 80 240 Z" fill={C.ink850} stroke={C.ink500} strokeWidth={5} strokeLinejoin="round" />
        <path d="M 60 100 L 320 100" stroke={C.ink600} strokeWidth={8} />
        <rect x={176} y={120} width={28} height={18} rx={4} fill={C.ink700} stroke={C.ink500} strokeWidth={3} />
      </svg>
    </div>
  );
}

/** s05: an envelope with a sheet of unreadable symbols (squiggles, never letters). */
export function EnvelopeArt() {
  const w = 760;
  const h = 520;
  const squiggle = (y: number, len: number, k: number) => {
    let d = `M 120 ${y}`;
    for (let x = 0; x < len; x += 12) d += ` q 3 ${(k + x) % 24 > 12 ? -7 : 7} 6 0 q 3 ${(k + x) % 36 > 18 ? 6 : -6} 6 0`;
    return d;
  };
  return (
    <div style={{ position: 'absolute', left: (STAGE.width - w) / 2, top: (STAGE.height - h) / 2 }}>
      <svg width={w} height={h} viewBox="0 0 380 260" style={{ overflow: 'visible' }}>
        {/* the sheet, half out of the envelope */}
        <rect x={100} y={18} width={180} height={170} rx={6} fill={C.ink800} stroke={C.ink500} strokeWidth={3} />
        {[44, 66, 88, 110, 132].map((y, i) => (
          <path key={y} d={squiggle(y, 130 - (i % 2) * 30, i * 7)} fill="none" stroke={alpha(C.amber, 0.55)} strokeWidth={2.5} strokeLinecap="round" />
        ))}
        {/* envelope */}
        <path d="M 50 110 L 330 110 L 330 246 L 50 246 Z" fill={C.ink850} stroke={C.ink500} strokeWidth={5} strokeLinejoin="round" />
        <path d="M 50 110 L 190 190 L 330 110" fill="none" stroke={C.ink500} strokeWidth={5} strokeLinejoin="round" />
        <path d="M 50 246 L 160 172 M 330 246 L 220 172" stroke={C.ink600} strokeWidth={4} />
      </svg>
    </div>
  );
}

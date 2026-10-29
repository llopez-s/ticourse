import { ACCENT, C, alpha } from '../../../../engine/src/theme/tokens';

/**
 * The bias (sesgo): a pair of glasses with tinted lenses. The tint colours everything seen through them
 * and leaves nothing on the paper — no head, no scale. A normal-flow box `width` x `width * 0.75`.
 *   tint   0-1  how strong the colour is (lenses, the two beams and the three shapes seen through them)
 *   glow   0-1  halo · dim 0-1 steps back
 * With `scene` false only the glasses are drawn (the recap thumbnail).
 */
export function Glasses({ width = 520, tint = 1, glow = 0, dim = 0, scene = true }: { width?: number; tint?: number; glow?: number; dim?: number; scene?: boolean }) {
  const amber = ACCENT.amber.fg;
  const soft = ACCENT.amber.soft;
  const h = scene ? 330 : 200;
  const shapes: { x: number; kind: 'circle' | 'square' | 'tri' }[] = [
    { x: 80, kind: 'circle' },
    { x: 220, kind: 'square' },
    { x: 360, kind: 'tri' },
  ];
  const shapeFill = (t: number) => (t > 0.5 ? alpha(amber, 0.35 + 0.55 * tint) : alpha(C.muted, 0.55));
  return (
    <div style={{ width, height: (width * h) / 440, opacity: 1 - 0.55 * dim, filter: dim > 0.01 ? `saturate(${1 - 0.5 * dim})` : undefined }}>
      <svg width={width} height={(width * h) / 440} viewBox={`0 0 440 ${h}`} style={{ display: 'block', overflow: 'visible' }} aria-hidden>
        <defs>
          <radialGradient id="fc-lens" cx="35%" cy="30%" r="80%">
            <stop offset="0" stopColor={soft} stopOpacity={0.8} />
            <stop offset="1" stopColor={amber} stopOpacity={0.45} />
          </radialGradient>
        </defs>
        {glow > 0.01 ? <ellipse cx={220} cy={100} rx={230} ry={120} fill={alpha(amber, 0.12 * glow)} /> : null}
        {scene ? (
          <g>
            {/* beams from the lenses to what is seen through them */}
            <path d="M 70 168 L 20 262 L 150 262 L 168 168 Z" fill={alpha(amber, 0.16 * tint)} />
            <path d="M 272 168 L 290 262 L 420 262 L 370 168 Z" fill={alpha(amber, 0.16 * tint)} />
            {shapes.map((s) => {
              const lit = tint;
              const fill = shapeFill(lit);
              const stroke = lit > 0.5 ? alpha(soft, 0.95) : alpha(C.muted, 0.8);
              return (
                <g key={s.kind} transform={`translate(${s.x} 296)`}>
                  {s.kind === 'circle' ? <circle r={30} fill={fill} stroke={stroke} strokeWidth={4} /> : null}
                  {s.kind === 'square' ? <rect x={-28} y={-28} width={56} height={56} rx={8} fill={fill} stroke={stroke} strokeWidth={4} /> : null}
                  {s.kind === 'tri' ? <path d="M 0 -32 L 32 26 L -32 26 Z" fill={fill} stroke={stroke} strokeWidth={4} strokeLinejoin="round" /> : null}
                </g>
              );
            })}
          </g>
        ) : null}
        {/* temples and bridge */}
        <path d="M 46 82 L 4 62 M 394 82 L 436 62" stroke={C.muted} strokeWidth={9} strokeLinecap="round" />
        <path d="M 188 88 Q 220 62 252 88" fill="none" stroke={C.muted} strokeWidth={9} strokeLinecap="round" />
        {/* lenses */}
        {[120, 320].map((cx) => (
          <g key={cx}>
            <circle cx={cx} cy={100} r={74} fill="url(#fc-lens)" opacity={0.25 + 0.75 * tint} />
            <circle cx={cx} cy={100} r={74} fill="none" stroke={C.text} strokeWidth={9} />
            <path d={`M ${cx - 48} ${100 - 30} Q ${cx - 36} ${100 - 52} ${cx - 10} ${100 - 56}`} fill="none" stroke={C.textStrong} strokeWidth={6} strokeLinecap="round" opacity={0.7} />
          </g>
        ))}
      </svg>
    </div>
  );
}

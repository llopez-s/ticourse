import { C, alpha } from '../../../../engine/src/theme/tokens';
import { clamp01, mix } from '../../../../engine/src/ui';

/** The car's own units (side view). */
export const CAR = { w: 380, h: 190 } as const;

/**
 * Concept 3's image («imagen · no es del puerto»): an old boxy car seen from the side. `itv` 0–1 sticks the emerald
 * inspection badge on the windscreen (it still runs: it gets sold); `crushed` 0–1 squashes it flat, grey, wheels gone
 * (the scrapyard). `spin` turns the wheels (frames). No brand, no plate, no driver.
 */
export function Car({ width = CAR.w, itv = 0, crushed = 0, spin = 0 }: { width?: number; itv?: number; crushed?: number; spin?: number }) {
  const k = clamp01(crushed);
  const ok = clamp01(itv);
  const sy = mix(1, 0.42, k);
  const body = k > 0.5 ? C.ink700 : C.ink600;
  const edge = k > 0.5 ? alpha(C.muted, 0.6) : alpha(C.cyan, 0.6);
  const a = (spin * 7) % 360;
  return (
    <svg width={width} height={(width * CAR.h) / CAR.w} viewBox={`0 0 ${CAR.w} ${CAR.h}`} style={{ display: 'block', overflow: 'visible' }}>
      <ellipse cx={CAR.w / 2} cy={178} rx={170} ry={10} fill={alpha('#000000', 0.35)} />
      <g transform={`translate(0 ${170 * (1 - sy)}) scale(1 ${sy})`}>
        {/* body and cabin */}
        <path
          d="M 20 140 L 20 104 Q 22 92 36 90 L 96 86 L 132 40 Q 138 32 150 32 L 262 32 Q 274 32 282 42 L 316 86 L 346 90 Q 360 92 360 106 L 360 140 Z"
          fill={body}
          stroke={edge}
          strokeWidth={4}
          strokeLinejoin="round"
        />
        {/* windows */}
        <path d="M 112 86 L 142 46 L 200 46 L 200 86 Z" fill={alpha(C.sky, k > 0.5 ? 0.08 : 0.22)} stroke={alpha(C.text, 0.35)} strokeWidth={3} />
        <path d="M 214 46 L 264 46 L 296 86 L 214 86 Z" fill={alpha(C.sky, k > 0.5 ? 0.08 : 0.22)} stroke={alpha(C.text, 0.35)} strokeWidth={3} />
        <line x1={207} y1={90} x2={207} y2={138} stroke={alpha(C.ink950, 0.5)} strokeWidth={3} />
        <rect x={150} y={104} width={26} height={6} rx={3} fill={alpha(C.text, 0.4)} />
        <rect x={236} y={104} width={26} height={6} rx={3} fill={alpha(C.text, 0.4)} />
        <rect x={340} y={100} width={18} height={14} rx={4} fill={alpha(C.amber, k > 0.5 ? 0.2 : 0.7)} />
        <rect x={22} y={100} width={14} height={14} rx={4} fill={alpha(C.rose, k > 0.5 ? 0.2 : 0.6)} />
        {/* dents when crushed */}
        {k > 0.05 ? (
          <g opacity={k} stroke={alpha(C.ink950, 0.7)} strokeWidth={4} fill="none" strokeLinecap="round">
            <path d="M 60 96 l 18 22 l 14 -16" />
            <path d="M 170 52 l 20 24 l 18 -20" />
            <path d="M 290 98 l 16 20 l 18 -14" />
          </g>
        ) : null}
      </g>
      {/* wheels (gone when crushed) */}
      {[96, 290].map((x) => (
        <g key={x} opacity={1 - k} transform={`translate(${x} 146) rotate(${a})`}>
          <circle r={30} fill={C.ink950} stroke={alpha(C.text, 0.45)} strokeWidth={4} />
          <circle r={12} fill={C.ink700} />
          <line x1={-22} y1={0} x2={22} y2={0} stroke={alpha(C.text, 0.3)} strokeWidth={3} />
          <line x1={0} y1={-22} x2={0} y2={22} stroke={alpha(C.text, 0.3)} strokeWidth={3} />
        </g>
      ))}
      {/* the inspection badge on the windscreen */}
      {ok > 0.01 && k < 0.5 ? (
        <g opacity={ok} transform={`translate(272 66) scale(${0.6 + 0.4 * ok})`}>
          <circle r={22} fill={C.emerald} stroke="#ffffff" strokeWidth={3} />
          <path d="M -10 0 l 7 8 l 13 -15" fill="none" stroke={C.ink950} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
        </g>
      ) : null}
    </svg>
  );
}

/**
 * A sheet of paper with a seal: the certificate (s06's «certificado de destrucción», the gestor's sheet). `rows` grey
 * lines, nothing legible; `seal` 0–1 stamps the round seal (tone).
 */
export function Sheet({ width = 150, rows = 4, seal = 1, tone = C.emerald }: { width?: number; rows?: number; seal?: number; tone?: string }) {
  const h = width * 1.3;
  const s = clamp01(seal);
  return (
    <svg width={width} height={h} viewBox={`0 0 100 130`} style={{ display: 'block', overflow: 'visible' }}>
      <path d="M 6 4 L 74 4 L 94 24 L 94 126 L 6 126 Z" fill="#e8edf5" stroke={alpha(C.ink950, 0.4)} strokeWidth={2} />
      <path d="M 74 4 L 74 24 L 94 24" fill="#c9d3e2" />
      <rect x={16} y={16} width={44} height={7} rx={3} fill={alpha(C.ink900, 0.65)} />
      {Array.from({ length: rows }, (_, k) => (
        <rect key={k} x={16} y={36 + k * 14} width={[64, 52, 60, 44, 56][k % 5]} height={5} rx={2.5} fill={alpha(C.ink900, 0.3)} />
      ))}
      {s > 0.01 ? (
        <g opacity={s} transform={`translate(70 104) scale(${1.4 - 0.4 * s}) rotate(-12)`}>
          <circle r={16} fill="none" stroke={tone} strokeWidth={4} />
          <circle r={10} fill={alpha(tone, 0.35)} />
        </g>
      ) : null}
    </svg>
  );
}

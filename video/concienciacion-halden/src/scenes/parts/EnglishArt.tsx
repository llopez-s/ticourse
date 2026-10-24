import { C, FONT, alpha } from '../../../../engine/src/theme/tokens';


export const ENGLISH = { w: 330, h: 200 } as const;

/**
 * The school English, the video's one everyday image (always tagged «imagen · no es del puerto» by its scene): a
 * notebook marked as passed, and, next to it, a cup of coffee with an empty speech bubble — you passed it, you have not
 * used it since, and today you would not order a coffee. `fade` 0–1 lets the notebook go grey (the forgetting), `bubble`
 * 0–1 brings the empty bubble, `label` writes «English» on the cover (off in miniatures). No «aula», no «clase».
 */
export function EnglishArt({ scale = 1, fade = 0, bubble = 1, label = true }: { scale?: number; fade?: number; bubble?: number; label?: boolean }) {
  const nb = 1 - 0.55 * fade;
  return (
    <div style={{ width: ENGLISH.w * scale, height: ENGLISH.h * scale }}>
      <svg width={ENGLISH.w * scale} height={ENGLISH.h * scale} viewBox={`0 0 ${ENGLISH.w} ${ENGLISH.h}`} style={{ overflow: 'visible' }}>
        {/* the notebook */}
        <g opacity={nb} style={{ filter: `saturate(${1 - 0.7 * fade})` }}>
          <rect x={8} y={20} width={176} height={168} rx={14} fill={C.ink800} stroke={alpha(C.sky, 0.8)} strokeWidth={4} />
          <rect x={8} y={20} width={26} height={168} rx={12} fill={alpha(C.sky, 0.25)} stroke={alpha(C.sky, 0.8)} strokeWidth={4} />
          {[0, 1, 2].map((k) => (
            <line key={k} x1={54} y1={112 + k * 24} x2={166} y2={112 + k * 24} stroke={alpha(C.muted, 0.45)} strokeWidth={4} strokeLinecap="round" />
          ))}
          {label ? (
            <text x={54} y={84} fontSize={34} fontWeight={800} fill={C.textStrong} fontFamily={FONT.sans}>
              English
            </text>
          ) : (
            <rect x={54} y={58} width={96} height={14} rx={7} fill={alpha(C.text, 0.6)} />
          )}
          <circle cx={168} cy={32} r={22} fill={C.ink900} stroke={C.emerald} strokeWidth={4} />
          <path d="M157 32 l8 8 l14 -15" fill="none" stroke={C.emerald} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
        </g>
        {/* the cup of coffee */}
        <g transform="translate(212 78)">
          <path d="M6 44 h74 v14 a34 34 0 0 1 -34 34 h-6 a34 34 0 0 1 -34 -34 z" fill={C.ink800} stroke={alpha(C.amber, 0.85)} strokeWidth={4} strokeLinejoin="round" />
          <path d="M80 54 h8 a14 14 0 0 1 0 28 h-12" fill="none" stroke={alpha(C.amber, 0.85)} strokeWidth={4} strokeLinecap="round" />
          <path d="M26 34 q-8 -12 0 -22 M46 34 q-8 -12 0 -22 M66 34 q-8 -12 0 -22" fill="none" stroke={alpha(C.muted, 0.5)} strokeWidth={3} strokeLinecap="round" />
        </g>
        {/* the empty bubble */}
        <g opacity={bubble} transform={`translate(0 ${(1 - bubble) * 8})`}>
          <rect x={226} y={-14} width={92} height={56} rx={22} fill={C.ink900} stroke={alpha(C.muted, 0.8)} strokeWidth={3} strokeDasharray="8 6" />
          <path d="M246 42 l-4 18 l20 -18" fill={C.ink900} stroke={alpha(C.muted, 0.8)} strokeWidth={3} strokeDasharray="8 6" />
          <text x={272} y={26} textAnchor="middle" fontSize={40} fontWeight={800} fill={alpha(C.muted, 0.95)} fontFamily={FONT.sans}>
            ?
          </text>
        </g>
      </svg>
    </div>
  );
}

/** Small icon-only version used in the one-line resolution of s07 (no cover text). */
export function EnglishMini({ width = 120 }: { width?: number }) {
  return <EnglishArt scale={width / ENGLISH.w} label={false} fade={0} />;
}


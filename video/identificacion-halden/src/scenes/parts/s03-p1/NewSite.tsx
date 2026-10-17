import { C, alpha } from '../../../../../engine/src/theme/tokens';

const W = 1728;
const H = 660;
const WIN = { x: 314, y: 20, w: 1100, h: 560 } as const;
const BAR_H = 54;
/** Where the half-raised shutter's bottom edge stops (window-local). */
const SHUTTER_Y = 300;

/**
 * s03's still background: a new website, half open and textless — a browser window with a blank address bar, the top
 * of the page built (header bars, a hero block, three cards) and a metal shutter half raised over the rest, like a shop
 * the day before it opens. No name, no address, no readable text. Nothing moves: the exam panel covers it.
 */
export function NewSite() {
  const x0 = WIN.x;
  const y0 = WIN.y;
  const inner = { x: x0 + 2, y: y0 + BAR_H, w: WIN.w - 4, h: WIN.h - BAR_H - 2 };
  const slats = Math.ceil((SHUTTER_Y - BAR_H) / 22);
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ display: 'block' }}>
      <defs>
        <clipPath id="s03-page">
          <rect x={inner.x} y={inner.y} width={inner.w} height={inner.h} rx={4} />
        </clipPath>
        <linearGradient id="s03-glow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={C.cyan} stopOpacity={0.16} />
          <stop offset="100%" stopColor={C.cyan} stopOpacity={0} />
        </linearGradient>
      </defs>

      {/* window */}
      <rect x={x0} y={y0} width={WIN.w} height={WIN.h} rx={20} fill={C.ink850} stroke={alpha(C.text, 0.28)} strokeWidth={3} />
      {/* title bar: three dots and a blank address pill */}
      {[0, 1, 2].map((i) => (
        <circle key={i} cx={x0 + 34 + i * 28} cy={y0 + 27} r={8} fill={alpha(C.muted, 0.45)} />
      ))}
      <rect x={x0 + 150} y={y0 + 12} width={WIN.w - 300} height={30} rx={15} fill={C.ink900} stroke={alpha(C.text, 0.15)} strokeWidth={2} />
      <line x1={x0} y1={y0 + BAR_H} x2={x0 + WIN.w} y2={y0 + BAR_H} stroke={alpha(C.text, 0.18)} strokeWidth={2} />

      <g clipPath="url(#s03-page)">
        {/* the built top of the page */}
        <rect x={inner.x} y={inner.y} width={inner.w} height={inner.h} fill={C.ink900} />
        <rect x={inner.x} y={inner.y} width={inner.w} height={240} fill="url(#s03-glow)" />
        <rect x={x0 + 50} y={y0 + 82} width={150} height={22} rx={6} fill={alpha(C.cyan, 0.45)} />
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x={x0 + 640 + i * 108} y={y0 + 86} width={80} height={14} rx={7} fill={alpha(C.text, 0.25)} />
        ))}
        <rect x={x0 + 50} y={y0 + 136} width={520} height={34} rx={8} fill={alpha(C.text, 0.5)} />
        <rect x={x0 + 50} y={y0 + 184} width={420} height={18} rx={6} fill={alpha(C.text, 0.25)} />
        <rect x={x0 + 50} y={y0 + 214} width={360} height={18} rx={6} fill={alpha(C.text, 0.2)} />
        <rect x={x0 + 50} y={y0 + 252} width={170} height={44} rx={22} fill={alpha(C.cyan, 0.35)} stroke={alpha(C.cyan, 0.6)} strokeWidth={2} />
        <rect x={x0 + 660} y={y0 + 128} width={390} height={180} rx={14} fill={alpha(C.cyanDeep, 0.35)} stroke={alpha(C.cyan, 0.3)} strokeWidth={2} />
        <circle cx={x0 + 760} cy={y0 + 190} r={30} fill={alpha(C.cyan, 0.25)} />
        <path d={`M ${x0 + 680} ${y0 + 300} L ${x0 + 820} ${y0 + 210} L ${x0 + 900} ${y0 + 270} L ${x0 + 960} ${y0 + 230} L ${x0 + 1040} ${y0 + 300} Z`} fill={alpha(C.cyan, 0.2)} />
        {/* three cards further down, half hidden by the shutter */}
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <rect x={x0 + 50 + i * 340} y={y0 + 340} width={310} height={190} rx={14} fill={C.ink800} stroke={alpha(C.text, 0.18)} strokeWidth={2} />
            <rect x={x0 + 76 + i * 340} y={y0 + 366} width={120} height={16} rx={6} fill={alpha(C.text, 0.3)} />
            <rect x={x0 + 76 + i * 340} y={y0 + 398} width={240} height={12} rx={6} fill={alpha(C.text, 0.18)} />
            <rect x={x0 + 76 + i * 340} y={y0 + 420} width={200} height={12} rx={6} fill={alpha(C.text, 0.15)} />
          </g>
        ))}

        {/* the shutter, half raised over the lower half of the page: slats down to the bottom edge */}
        <g transform={`translate(0 ${SHUTTER_Y - BAR_H})`}>
          <rect x={inner.x} y={inner.y} width={inner.w} height={inner.h} fill={C.ink700} />
          {Array.from({ length: slats + 14 }, (_, k) => (
            <g key={k}>
              <rect x={inner.x} y={inner.y + k * 22} width={inner.w} height={22} fill={k % 2 ? C.ink700 : '#22345a'} />
              <line x1={inner.x} y1={inner.y + k * 22 + 21} x2={inner.x + inner.w} y2={inner.y + k * 22 + 21} stroke={alpha('#000000', 0.35)} strokeWidth={2} />
            </g>
          ))}
          {/* its bottom bar and two handles */}
          <rect x={inner.x} y={inner.y - 8} width={inner.w} height={16} fill={C.ink600} />
          <rect x={x0 + WIN.w / 2 - 90} y={inner.y + 16} width={50} height={12} rx={6} fill={alpha(C.text, 0.35)} />
          <rect x={x0 + WIN.w / 2 + 40} y={inner.y + 16} width={50} height={12} rx={6} fill={alpha(C.text, 0.35)} />
        </g>
      </g>
    </svg>
  );
}

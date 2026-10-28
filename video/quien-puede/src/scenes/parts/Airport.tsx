import { C, FONT, RADIUS, alpha } from '../../../../engine/src/theme/tokens';
import { Icon, clamp01 } from '../../../../engine/src/ui';

/**
 * The airport image of s02 (and ONLY s02), always under the «imagen · no es del puerto» tag. Everything is sky-tinted.
 * Cautions of the canon: no numbered arches (V49), no card reader or green light (V50), no suitcase, belt or scanner
 * (V32), no plane or hangar (V30). The gates are the barriers of parts/Gate.tsx; the boarding card is a plain card.
 */

/** The passport control: a cabin with a window and the passport booklet; the emerald check (the «visto») lands on `check`. */
export function PassportBooth({ width = 340, check = 0, glow = 0 }: { width?: number; check?: number; glow?: number }) {
  const k = clamp01(check);
  const g = clamp01(glow);
  const h = (width * 360) / 340;
  const tone = C.sky;
  return (
    <div style={{ position: 'relative', width, height: h, fontFamily: FONT.sans }}>
      <svg width={width} height={h} viewBox="0 0 340 360" style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} aria-hidden>
        {g > 0.02 ? <rect x={20} y={20} width={300} height={320} rx={30} fill={alpha(tone, 0.35 * g)} style={{ filter: 'blur(18px)' }} /> : null}
        {/* the cabin */}
        <rect x={28} y={20} width={284} height={320} rx={28} fill={alpha(tone, 0.08)} stroke={alpha(tone, 0.7 + 0.3 * g)} strokeWidth={4} />
        <rect x={12} y={18} width={316} height={28} rx={12} fill={alpha(tone, 0.22)} stroke={tone} strokeWidth={4} />
        {/* the window with the booklet in it */}
        <rect x={64} y={78} width={212} height={132} rx={14} fill={alpha(C.ink950, 0.6)} stroke={alpha(tone, 0.8)} strokeWidth={4} />
        <rect x={118} y={96} width={104} height={98} rx={10} fill={alpha(tone, 0.18)} stroke={tone} strokeWidth={4} />
        <circle cx={170} cy={140} r={24} fill="none" stroke={alpha(tone, 0.9)} strokeWidth={4} />
        <path d="M146 140h48M170 116c-14 14-14 34 0 48M170 116c14 14 14 34 0 48" fill="none" stroke={alpha(tone, 0.9)} strokeWidth={3} />
        {/* the counter */}
        <rect x={44} y={226} width={252} height={26} rx={10} fill={alpha(tone, 0.28)} stroke={tone} strokeWidth={4} />
        <path d="M70 252v70M270 252v70" stroke={alpha(tone, 0.6)} strokeWidth={6} strokeLinecap="round" />
        <path d="M0 346 H340" stroke={alpha(tone, 0.4)} strokeWidth={4} strokeLinecap="round" />
      </svg>
      {/* the «visto» */}
      <div
        style={{
          position: 'absolute',
          left: width - 118,
          top: 26,
          width: 92,
          height: 92,
          borderRadius: 46,
          display: 'grid',
          placeItems: 'center',
          background: alpha(C.emerald, 0.92),
          border: `4px solid ${C.emeraldDeep}`,
          boxShadow: `0 0 ${Math.round(34 * k)}px ${alpha(C.emerald, 0.6)}`,
          opacity: k,
          transform: `scale(${0.4 + 0.6 * k}) rotate(${(1 - k) * -30}deg)`,
        }}
      >
        <Icon name="check" size={58} color={C.ink950} strokeWidth={3.4} />
      </div>
    </div>
  );
}

/** Barcode-like stripes (deterministic). */
function Stripes({ width, height, tone }: { width: number; height: number; tone: string }) {
  const widths = [6, 3, 9, 3, 5, 3, 8, 4, 3, 7, 3, 5, 9, 3, 4, 6, 3, 8];
  let x = 0;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ display: 'block' }} aria-hidden>
      {widths.map((w, i) => {
        const bar = i % 2 === 0;
        const rect = bar ? <rect key={i} x={x} y={0} width={w * (width / 100)} height={height} fill={tone} /> : null;
        x += w * (width / 100);
        return rect;
      })}
    </svg>
  );
}

/**
 * The boarding card: it names one flight (one gate). Held by the account, not passed through anything. `ghost` draws the
 * empty dashed card that the account lacks for «Partes de avería · escribir» (rose).
 */
export function BoardingPass({ width = 440, flight = 'vuelo 34', on = 0, ghost = false, ghostText = 'escribir' }: { width?: number; flight?: string; on?: number; ghost?: boolean; ghostText?: string }) {
  const g = clamp01(on);
  const tone = ghost ? C.rose : C.sky;
  const h = Math.round(width * 0.4);
  return (
    <div
      style={{
        position: 'relative',
        width,
        height: h,
        boxSizing: 'border-box',
        borderRadius: RADIUS.md,
        border: `4px ${ghost ? 'dashed' : 'solid'} ${alpha(tone, 0.55 + 0.45 * g)}`,
        background: ghost ? alpha(C.rose, 0.05) : `linear-gradient(135deg, ${alpha(tone, 0.2)} 0%, ${alpha(C.ink900, 0.95)} 80%)`,
        boxShadow: g > 0.02 ? `0 0 ${Math.round(34 * g)}px ${alpha(tone, 0.4 * g)}` : `0 14px 30px ${alpha('#000000', 0.35)}`,
        fontFamily: FONT.sans,
        padding: '12px 22px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      {/* the two notches of a ticket */}
      <div style={{ position: 'absolute', left: -22, top: h / 2 - 20, width: 40, height: 40, borderRadius: 20, background: C.ink950, border: `4px ${ghost ? 'dashed' : 'solid'} ${alpha(tone, 0.55)}` }} />
      <div style={{ position: 'absolute', right: -22, top: h / 2 - 20, width: 40, height: 40, borderRadius: 20, background: C.ink950, border: `4px ${ghost ? 'dashed' : 'solid'} ${alpha(tone, 0.55)}` }} />
      <div style={{ fontSize: 30, fontWeight: 750, color: ghost ? C.roseSoft : '#7dd3fc', whiteSpace: 'nowrap' }}>{ghost ? 'tarjeta de embarque · falta' : 'tarjeta de embarque'}</div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 }}>
        <div style={{ fontSize: 58, fontWeight: 900, letterSpacing: -1, color: ghost ? alpha(C.roseSoft, 0.9) : C.textStrong, whiteSpace: 'nowrap' }}>{ghost ? ghostText : flight}</div>
        {ghost ? null : <Stripes width={96} height={58} tone={alpha('#7dd3fc', 0.85)} />}
      </div>
    </div>
  );
}

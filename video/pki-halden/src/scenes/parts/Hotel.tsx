import type { CSSProperties, ReactNode } from 'react';
import { C, FONT, alpha } from '../../../../engine/src/theme/tokens';
import { Icon, Redacted, clamp01 } from '../../../../engine/src/ui';

/**
 * Revocation = the hotel that checks your DNI (canon: out/scene-brief.md «Visual metaphors»). One
 * generic hotel (no name, no address), drawn ONE way in s04, s05 and s06. Who is who — fixed by the
 * accuracy review: in Spain the police issue the DNI, as the CA issues the certificate:
 *
 *   - `Reception`  = the CLIENT that checks (emerald). `phone` raises the handset (OCSP: it phones the
 *                    police for each guest); `check` lights an emerald tick over the receptionist.
 *   - `Guest`      = the PORTAL (cyan), a guest with a small suitcase.
 *   - `DniCard`    = the portal's CERTIFICATE (cyan). Photo silhouette + bars only: never a number (an
 *                    8-digits-plus-letter string could be a real person's). `stolen` tints it amber.
 *   - `Police`     = the CA (sky, Confianza Global's colour). `ring` shows one call coming in, `busy`
 *                    many (OCSP's load on the CA).
 *   - `StolenList` = the CRL: the list of stolen DNI that reception COLLECTS once a day, rows as bars,
 *                    sealed by the police (the CA's seal). `pending` adds the dashed amber slot of a
 *                    DNI stolen this morning, which is not on today's list («no sale hasta mañana»).
 *   - `Justificante` = the police's receipt, «sellado · de esta mañana» (the CA-signed OCSP response).
 *   - `StapledPair` = the justificante stapled to the DNI, brought by the guest = OCSP STAPLING:
 *                    reception only checks the seal. s06 reuses it as rule 3's icon.
 *   - `Staple`, `PhoneGlyph`: the drawn staple and the handset.
 *
 * The seal is never drawn here: `StolenList`, `Justificante` and `StapledPair` take a `seal` render
 * function `(size) => <CaSeal size={size} … />` (the shared `parts/CaSeal.tsx`), so the CA's seal is
 * the same object everywhere. The REVOKE stamp never goes on any of these.
 *
 * Nothing reads the timeline and nothing is positioned: every animation is a 0–1 prop, and each piece
 * sizes from `width` — wrap it in an absolutely positioned div. `*Size()` helpers give the box.
 */

export const HOTEL_TONE = { reception: C.emerald, guest: C.cyan, police: C.sky } as const;
/** Soft text colours that go with the three tones. */
export const HOTEL_TEXT = { reception: '#6ee7b7', guest: C.cyanSoft, police: '#7dd3fc' } as const;
/** Neutral steel for the staple (and nothing that has an owner). */
const STEEL = '#cbd5e1';

/** A seal slot: the scene passes `(size) => <CaSeal size={size} press={…} />`. */
export type SealRender = (size: number) => ReactNode;

const dropGlow = (color: string, g: number) => (g > 0.01 ? `drop-shadow(0 0 ${Math.round(4 + 18 * g)}px ${alpha(color, 0.55 * g)})` : '');
const joinFilters = (...f: string[]) => f.filter(Boolean).join(' ') || undefined;

function dimmed(d: number, extra?: string): Pick<CSSProperties, 'opacity' | 'filter'> {
  const k = clamp01(d);
  return { opacity: 1 - 0.6 * k, filter: joinFilters(extra ?? '', k > 0.01 ? `saturate(${1 - 0.6 * k})` : '') };
}

// ---------------------------------------------------------------------------
// The handset (24×24 stroke icon, the engine's style)

export function PhoneGlyph({ size, color = HOTEL_TONE.reception, strokeWidth = 2, style }: { size: number; color?: string; strokeWidth?: number; style?: CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: 'block', overflow: 'visible', ...style }}>
      <path
        d="M 5 3.5 L 8.5 3.5 L 10.2 8 L 8 9.6 C 9 11.8 11.2 14 13.4 15 L 15 12.8 L 19.5 14.5 L 19.5 18 C 19.5 19.2 18.6 20.2 17.4 20 C 10.4 19.2 4.8 13.6 4 6.6 C 3.8 5.4 4 3.5 5 3.5 Z"
        fill={alpha(color, 0.18)}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Reception (the client that checks)

/** Reception's box: width × 0.78. */
export function receptionSize(width: number) {
  return { w: width, h: width * 0.78 };
}

/** Where the handset sits when raised (px from Reception's top-left), to start a call line from. */
export function receptionPhone(width: number) {
  const s = width / 220;
  return { x: 150 * s, y: 46 * s };
}

/** Where the counter's top is (px from the top-left): papers and cards are laid there. */
export function receptionCounter(width: number) {
  const s = width / 220;
  return { x: 110 * s, y: 96 * s };
}

export function Reception({
  width,
  glow = 0,
  dim = 0,
  phone = 0,
  check = 0,
  style,
}: {
  width: number;
  glow?: number;
  dim?: number;
  /** 0–1: the receptionist lifts the handset to the ear (an OCSP call). */
  phone?: number;
  /** 0–1: an emerald tick over the receptionist (the check passed). */
  check?: number;
  style?: CSSProperties;
}) {
  const col = HOTEL_TONE.reception;
  const g = clamp01(glow);
  const ph = clamp01(phone);
  const ck = clamp01(check);
  const { h } = receptionSize(width);
  const d = dimmed(dim, dropGlow(col, g));
  return (
    <svg width={width} height={h} viewBox="0 0 220 172" style={{ display: 'block', overflow: 'visible', ...d, ...style }}>
      {/* Back wall: a pigeonhole shelf (empty boxes, no keys) */}
      <g stroke={alpha(col, 0.35)} strokeWidth={2} fill="none">
        <rect x={22} y={6} width={56} height={40} rx={3} />
        <path d="M 22 19 L 78 19 M 22 32 L 78 32 M 40.6 6 L 40.6 46 M 59.3 6 L 59.3 46" />
      </g>
      {/* The receptionist */}
      <g stroke={col} strokeWidth={3.2} strokeLinejoin="round">
        <circle cx={110} cy={38} r={17} fill={alpha(col, 0.2)} />
        <path d="M 72 98 Q 74 62 110 60 Q 146 62 148 98 Z" fill={alpha(col, 0.22)} />
      </g>
      {/* The handset, lifted to the ear (OCSP) */}
      {ph > 0.01 ? (
        <g opacity={Math.min(1, ph * 1.5)} transform={`translate(${(1 - ph) * 10} ${(1 - ph) * 30})`}>
          <path d="M 140 92 Q 146 70 136 54" fill="none" stroke={col} strokeWidth={6} strokeLinecap="round" />
          <g transform="translate(124 28) scale(1.5)">
            <path
              d="M 5 3.5 L 8.5 3.5 L 10.2 8 L 8 9.6 C 9 11.8 11.2 14 13.4 15 L 15 12.8 L 19.5 14.5 L 19.5 18 C 19.5 19.2 18.6 20.2 17.4 20 C 10.4 19.2 4.8 13.6 4 6.6 C 3.8 5.4 4 3.5 5 3.5 Z"
              fill={alpha(col, 0.45)}
              stroke={col}
              strokeWidth={1.8}
              strokeLinejoin="round"
            />
          </g>
        </g>
      ) : null}
      {/* Counter */}
      <rect x={4} y={92} width={212} height={12} rx={4} fill={alpha(col, 0.35)} stroke={col} strokeWidth={2.5} />
      <rect x={12} y={104} width={196} height={64} rx={6} fill={C.ink850} stroke={col} strokeWidth={2.5} />
      <path d="M 44 112 L 44 160 M 110 112 L 110 160 M 176 112 L 176 160" stroke={alpha(col, 0.3)} strokeWidth={2} />
      {/* Service bell */}
      <g stroke={col} strokeWidth={2.2} fill={alpha(col, 0.25)}>
        <path d="M 176 92 Q 176 78 188 78 Q 200 78 200 92 Z" />
        <circle cx={188} cy={75} r={2.6} />
      </g>
      {/* The tick: the check passed */}
      {ck > 0.01 ? (
        <g opacity={ck} transform={`translate(${70} ${4}) scale(${0.7 + 0.3 * ck})`}>
          <circle cx={0} cy={0} r={15} fill={alpha(C.emeraldDeep, 0.95)} stroke={col} strokeWidth={3} />
          <path d="M -7 0 L -2 5 L 7 -5" fill="none" stroke={col} strokeWidth={3.4} strokeLinecap="round" strokeLinejoin="round" />
        </g>
      ) : null}
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Guest (the portal)

/** The guest's box: width × 2.2. */
export function guestSize(width: number) {
  return { w: width, h: width * 2.2 };
}

/** The guest's outstretched hand (px from the top-left): a DNI is held there. */
export function guestHand(width: number) {
  const s = width / 90;
  return { x: 88 * s, y: 96 * s };
}

export function Guest({
  width,
  color = HOTEL_TONE.guest,
  glow = 0,
  dim = 0,
  suitcase = true,
  style,
}: {
  width: number;
  color?: string;
  glow?: number;
  dim?: number;
  suitcase?: boolean;
  style?: CSSProperties;
}) {
  const g = clamp01(glow);
  const { h } = guestSize(width);
  return (
    <svg width={width} height={h} viewBox="0 0 90 198" style={{ display: 'block', overflow: 'visible', ...dimmed(dim, dropGlow(color, g)), ...style }}>
      <g stroke={color} strokeWidth={3.2} strokeLinejoin="round" strokeLinecap="round">
        <circle cx={46} cy={24} r={15} fill={alpha(color, 0.2)} />
        <path d="M 24 116 L 22 62 Q 24 46 46 45 Q 68 46 70 62 L 68 116 Z" fill={alpha(color, 0.22)} />
        {/* Arm held forward */}
        <path d="M 66 60 L 86 94" fill="none" strokeWidth={6} />
        {/* Legs */}
        <path d="M 34 116 L 33 190 M 58 116 L 59 190" fill="none" strokeWidth={7} />
      </g>
      {suitcase ? (
        <g stroke={color} strokeWidth={2.6} strokeLinejoin="round">
          <path d="M 2 150 Q 2 142 8 142 L 8 138 L 16 138 L 16 142 Q 22 142 22 150 L 22 186 L 2 186 Z" fill={alpha(color, 0.12)} />
          <path d="M 2 160 L 22 160" fill="none" />
        </g>
      ) : null}
    </svg>
  );
}

// ---------------------------------------------------------------------------
// DNI (the certificate)

/** ID-1 card proportions: width × 0.63. */
export function dniSize(width: number) {
  return { w: width, h: Math.round(width * 0.63) };
}

export function DniCard({
  width,
  glow = 0,
  dim = 0,
  stolen = 0,
  style,
}: {
  width: number;
  glow?: number;
  dim?: number;
  /** 0–1: the card turns amber (reported stolen). */
  stolen?: number;
  style?: CSSProperties;
}) {
  const { h } = dniSize(width);
  const st = clamp01(stolen);
  const col = st > 0.5 ? C.amber : HOTEL_TONE.guest;
  const g = clamp01(glow);
  const u = width / 100;
  const bar = Math.max(8, Math.round(6 * u));
  return (
    <div
      style={{
        position: 'relative',
        width,
        height: h,
        boxSizing: 'border-box',
        borderRadius: Math.round(7 * u),
        border: `${Math.max(2, Math.round(1.6 * u))}px solid ${alpha(col, 0.85)}`,
        background: `linear-gradient(160deg, ${alpha(col, 0.2)} 0%, ${alpha(C.ink900, 0.97)} 70%)`,
        boxShadow: `0 0 ${Math.round(8 + 26 * g)}px ${alpha(col, 0.12 + 0.35 * g)}, 0 ${Math.round(6 * u)}px ${Math.round(14 * u)}px ${alpha('#000000', 0.4)}`,
        overflow: 'hidden',
        ...dimmed(dim),
        ...style,
      }}
    >
      {/* Header band */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          right: 0,
          height: Math.round(13 * u),
          background: alpha(col, 0.22),
          display: 'flex',
          alignItems: 'center',
          paddingLeft: Math.round(6 * u),
          fontFamily: FONT.sans,
          fontSize: Math.round(8.5 * u),
          fontWeight: 850,
          letterSpacing: Math.round(0.8 * u),
          color: st > 0.5 ? '#fcd34d' : HOTEL_TEXT.guest,
        }}
      >
        DNI
      </div>
      {/* Photo silhouette */}
      <svg
        width={Math.round(26 * u)}
        height={Math.round(32 * u)}
        viewBox="0 0 26 32"
        style={{ position: 'absolute', left: Math.round(6 * u), top: Math.round(18 * u), display: 'block' }}
      >
        <rect x={0.8} y={0.8} width={24.4} height={30.4} rx={2.5} fill={alpha(col, 0.12)} stroke={alpha(col, 0.7)} strokeWidth={1.2} />
        <circle cx={13} cy={12} r={5.4} fill={alpha(col, 0.55)} />
        <path d="M 3.5 31 Q 4 20.5 13 20.5 Q 22 20.5 22.5 31 Z" fill={alpha(col, 0.55)} />
      </svg>
      {/* Data: bars only */}
      <div style={{ position: 'absolute', left: Math.round(38 * u), top: Math.round(20 * u), display: 'flex', flexDirection: 'column', gap: Math.round(5 * u) }}>
        <Redacted width={Math.round(48 * u)} height={bar} tone={col} strength={0.55} />
        <Redacted width={Math.round(38 * u)} height={bar} tone={col} strength={0.45} />
        <Redacted width={Math.round(44 * u)} height={bar} tone={col} strength={0.45} />
      </div>
      {/* Machine-readable strip: one long bar */}
      <div style={{ position: 'absolute', left: Math.round(6 * u), bottom: Math.round(5 * u) }}>
        <Redacted width={Math.round(86 * u)} height={Math.max(6, Math.round(4.5 * u))} tone="muted" strength={0.5} />
      </div>
      {/* Stolen: amber corner mark */}
      {st > 0.01 ? (
        <div style={{ position: 'absolute', right: Math.round(4 * u), top: Math.round(2 * u), opacity: st }}>
          <Icon name="alert" size={Math.round(10 * u)} color={C.amber} strokeWidth={2.4} />
        </div>
      ) : null}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Police (the CA)

/** The station's box: width × 0.92. */
export function policeSize(width: number) {
  return { w: width, h: width * 0.92 };
}

/** The station's phone (px from the top-left), where a call line ends. */
export function policePhone(width: number) {
  const s = width / 200;
  return { x: 168 * s, y: 34 * s };
}

export function Police({
  width,
  glow = 0,
  dim = 0,
  ring = 0,
  busy = 0,
  style,
}: {
  width: number;
  glow?: number;
  dim?: number;
  /** 0–1: one call coming in (waves by the roof). */
  ring?: number;
  /** 0–1: the lines are saturated (several ringing handsets). */
  busy?: number;
  style?: CSSProperties;
}) {
  const col = HOTEL_TONE.police;
  const g = clamp01(glow);
  const r = clamp01(ring);
  const b = clamp01(busy);
  const { h } = policeSize(width);
  return (
    <svg width={width} height={h} viewBox="0 0 200 184" style={{ display: 'block', overflow: 'visible', ...dimmed(dim, dropGlow(col, g)), ...style }}>
      <g stroke={col} strokeWidth={3} strokeLinejoin="round">
        {/* Pediment and the emblem: a shield with a star */}
        <path d="M 8 66 L 100 18 L 192 66 Z" fill={alpha(col, 0.14)} />
        <path d="M 100 30 L 114 35 L 114 46 Q 114 56 100 62 Q 86 56 86 46 L 86 35 Z" fill={alpha(col, 0.3)} strokeWidth={2.4} />
        <path d="M 100 38 L 102.4 43.2 L 108 43.6 L 103.7 47.2 L 105.1 52.6 L 100 49.6 L 94.9 52.6 L 96.3 47.2 L 92 43.6 L 97.6 43.2 Z" fill={col} stroke="none" />
        {/* Sign band */}
        <rect x={18} y={68} width={164} height={18} rx={3} fill={alpha(col, 0.45)} />
        {/* Facade, columns, windows */}
        <rect x={18} y={86} width={164} height={90} fill={C.ink850} />
        <path d="M 40 90 L 40 172 M 160 90 L 160 172" strokeWidth={5} stroke={alpha(col, 0.55)} />
        <g strokeWidth={2} fill={alpha(col, 0.18)}>
          <rect x={56} y={98} width={22} height={22} rx={2} />
          <rect x={89} y={98} width={22} height={22} rx={2} />
          <rect x={122} y={98} width={22} height={22} rx={2} />
          <rect x={56} y={134} width={22} height={22} rx={2} />
          <rect x={89} y={134} width={22} height={22} rx={2} />
          <rect x={122} y={134} width={22} height={22} rx={2} />
        </g>
        <path d="M 2 178 L 198 178" strokeWidth={3.5} />
      </g>
      {/* One call: waves by the roof */}
      {r > 0.01 ? (
        <g fill="none" stroke={col} strokeWidth={3} strokeLinecap="round" opacity={r}>
          <path d="M 176 22 Q 184 30 176 38" />
          <path d="M 184 14 Q 198 30 184 46" opacity={0.7} />
        </g>
      ) : null}
      {/* Saturated: handsets crowding the roof */}
      {b > 0.01
        ? [
            { x: 4, y: -6, k: 0 },
            { x: 44, y: -24, k: 1 },
            { x: 136, y: -24, k: 2 },
            { x: 176, y: -6, k: 3 },
          ].map(({ x, y, k }) => {
            const p = clamp01(b * 4 - k);
            if (p <= 0.01) return null;
            return (
              <g key={k} opacity={p} transform={`translate(${x} ${y + (1 - p) * 8}) scale(1.2)`}>
                <circle cx={12} cy={12} r={13} fill={alpha(C.amberDeep, 0.9)} stroke={C.amber} strokeWidth={1.6} />
                <path
                  d="M 7 6 L 9.5 6 L 10.8 9.4 L 9.2 10.6 C 9.9 12.2 11.5 13.8 13.1 14.5 L 14.3 12.9 L 17.6 14.2 L 17.6 16.7 C 17.6 17.6 16.9 18.3 16.1 18.2 C 11 17.6 6.9 13.5 6.3 8.4 C 6.1 7.5 6.3 6 7 6 Z"
                  fill={alpha(C.amber, 0.35)}
                  stroke={C.amber}
                  strokeWidth={1.3}
                  strokeLinejoin="round"
                />
              </g>
            );
          })
        : null}
    </svg>
  );
}

// ---------------------------------------------------------------------------
// The list of stolen DNI (the CRL)

/** The sheet's box for `rows` rows (+1 when `pending` is drawn). */
export function stolenListSize(width: number, rows = 4, pending = false) {
  const u = width / 100;
  const n = rows + (pending ? 1 : 0);
  return { w: width, h: Math.round(26 * u + n * 14 * u + 8 * u) };
}

/** Where a seal sits on the sheet (centre, px from the top-left) and its size. */
export function stolenListSeal(width: number, rows = 4, pending = false) {
  const { h } = stolenListSize(width, rows, pending);
  const size = Math.round(width * 0.36);
  return { x: width - size * 0.42, y: h - size * 0.36, size };
}

export function StolenList({
  width,
  title = 'DNI robados',
  rows = 4,
  pending = 0,
  tab,
  seal,
  glow = 0,
  dim = 0,
  style,
}: {
  width: number;
  title?: string;
  rows?: number;
  /** 0–1: the dashed amber slot of a DNI stolen this morning — not on this list yet. */
  pending?: number;
  /** Short text on a tab sticking up from the sheet's top-right (e.g. «hoy»); it sits above the box. */
  tab?: string;
  /** The police's (= the CA's) seal: `(size) => <CaSeal size={size} … />`. */
  seal?: SealRender;
  glow?: number;
  dim?: number;
  style?: CSSProperties;
}) {
  const col = HOTEL_TONE.police;
  const u = width / 100;
  const pd = clamp01(pending);
  const drawPending = pd > 0.001;
  const { h } = stolenListSize(width, rows, drawPending);
  const sl = stolenListSeal(width, rows, drawPending);
  const g = clamp01(glow);
  const rowH = Math.round(14 * u);
  const iconW = Math.round(13 * u);
  const barH = Math.max(8, Math.round(5 * u));
  const widths = [52, 44, 58, 40, 50, 46, 54];
  return (
    <div
      style={{
        position: 'relative',
        width,
        height: h,
        boxSizing: 'border-box',
        borderRadius: Math.round(4 * u),
        border: `${Math.max(2, Math.round(1.2 * u))}px solid ${alpha(col, 0.8)}`,
        background: `linear-gradient(180deg, ${alpha(col, 0.14)} 0%, ${alpha(C.ink900, 0.97)} 45%)`,
        boxShadow: `0 0 ${Math.round(8 + 26 * g)}px ${alpha(col, 0.1 + 0.35 * g)}, 0 ${Math.round(5 * u)}px ${Math.round(14 * u)}px ${alpha('#000000', 0.45)}`,
        fontFamily: FONT.sans,
        ...dimmed(dim),
        ...style,
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: Math.round(7 * u),
          top: Math.round(5 * u),
          display: 'flex',
          alignItems: 'center',
          gap: Math.round(3 * u),
          fontSize: Math.round(13 * u),
          fontWeight: 850,
          color: HOTEL_TEXT.police,
          whiteSpace: 'nowrap',
          lineHeight: 1.2,
        }}
      >
        {title}
      </div>
      {tab ? (
        <div
          style={{
            position: 'absolute',
            right: Math.round(6 * u),
            bottom: '100%',
            marginBottom: -2,
            padding: `${Math.round(1.5 * u)}px ${Math.round(4.5 * u)}px`,
            borderRadius: `${Math.round(3 * u)}px ${Math.round(3 * u)}px 0 0`,
            border: `2px solid ${alpha(col, 0.8)}`,
            borderBottom: 'none',
            background: alpha(C.ink850, 0.98),
            fontSize: Math.round(11 * u),
            fontWeight: 800,
            color: HOTEL_TEXT.police,
            whiteSpace: 'nowrap',
            lineHeight: 1.2,
          }}
        >
          {tab}
        </div>
      ) : null}
      <div style={{ position: 'absolute', left: Math.round(7 * u), top: Math.round(22 * u), display: 'flex', flexDirection: 'column' }}>
        {Array.from({ length: rows }, (_, i) => (
          <div key={i} style={{ height: rowH, display: 'flex', alignItems: 'center', gap: Math.round(4 * u) }}>
            <span
              style={{
                width: iconW,
                height: Math.round(iconW * 0.63),
                boxSizing: 'border-box',
                borderRadius: Math.round(1.5 * u),
                border: `2px solid ${alpha(C.cyan, 0.55)}`,
                background: alpha(C.cyan, 0.12),
                flexShrink: 0,
              }}
            />
            <Redacted width={Math.round(widths[i % widths.length] * u)} height={barH} tone="muted" strength={0.55} />
          </div>
        ))}
        {drawPending ? (
          <div style={{ height: rowH, display: 'flex', alignItems: 'center', gap: Math.round(4 * u), opacity: pd }}>
            <span
              style={{
                width: Math.round(70 * u),
                height: Math.round(10 * u),
                boxSizing: 'border-box',
                borderRadius: Math.round(2 * u),
                border: `2px dashed ${alpha(C.amber, 0.9)}`,
                background: alpha(C.amber, 0.06),
              }}
            />
          </div>
        ) : null}
      </div>
      {seal ? <div style={{ position: 'absolute', left: sl.x - sl.size / 2, top: sl.y - sl.size / 2 }}>{seal(sl.size)}</div> : null}
    </div>
  );
}

// ---------------------------------------------------------------------------
// The police's receipt (the OCSP response)

/** The receipt's box: width × 1.22. */
export function justificanteSize(width: number) {
  return { w: width, h: Math.round(width * 1.22) };
}

/** Where its seal sits (centre, px from the top-left) and its size. */
export function justificanteSeal(width: number) {
  const size = Math.round(width * 0.5);
  return { x: width * 0.66, y: width * 1.22 - size * 0.52, size };
}

export function Justificante({
  width,
  title = ['justificante'],
  seal,
  glow = 0,
  dim = 0,
  style,
}: {
  width: number;
  /** One line per entry (13 % of the width each): e.g. ['respuesta', 'OCSP'] for the portal's slip. */
  title?: readonly string[];
  /** The police's (= the CA's) seal: `(size) => <CaSeal size={size} … />`. */
  seal?: SealRender;
  glow?: number;
  dim?: number;
  style?: CSSProperties;
}) {
  const col = HOTEL_TONE.police;
  const u = width / 100;
  const { h } = justificanteSize(width);
  const titleLines = title.length;
  const sl = justificanteSeal(width);
  const g = clamp01(glow);
  const barH = Math.max(7, Math.round(6 * u));
  return (
    <div
      style={{
        position: 'relative',
        width,
        height: h,
        boxSizing: 'border-box',
        borderRadius: Math.round(5 * u),
        border: `${Math.max(2, Math.round(2 * u))}px solid ${alpha(col, 0.85)}`,
        background: `linear-gradient(180deg, ${alpha(col, 0.18)} 0%, ${alpha(C.ink900, 0.97)} 55%)`,
        boxShadow: `0 0 ${Math.round(8 + 28 * g)}px ${alpha(col, 0.12 + 0.4 * g)}, 0 ${Math.round(5 * u)}px ${Math.round(14 * u)}px ${alpha('#000000', 0.45)}`,
        fontFamily: FONT.sans,
        ...dimmed(dim),
        ...style,
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: Math.round(9 * u),
          top: Math.round(8 * u),
          fontSize: Math.round(13 * u),
          fontWeight: 850,
          color: HOTEL_TEXT.police,
          whiteSpace: 'nowrap',
          lineHeight: 1.1,
        }}
      >
        {title.map((t) => (
          <div key={t}>{t}</div>
        ))}
      </div>
      {/* The receipt's text, as bars; one bar fewer per extra title line, so they stay clear of the seal. */}
      <div
        style={{
          position: 'absolute',
          left: Math.round(9 * u),
          top: Math.round((30 + 14.3 * (titleLines - 1)) * u),
          display: 'flex',
          flexDirection: 'column',
          gap: Math.round(7 * u),
        }}
      >
        {[78, 62, 70].slice(0, Math.max(1, 4 - titleLines)).map((bw) => (
          <Redacted key={bw} width={Math.round(bw * u)} height={barH} tone="muted" strength={0.5} />
        ))}
      </div>
      {seal ? <div style={{ position: 'absolute', left: sl.x - sl.size / 2, top: sl.y - sl.size / 2 }}>{seal(sl.size)}</div> : null}
    </div>
  );
}

// ---------------------------------------------------------------------------
// The staple

/** A drawn staple seen from above, `size` px wide (height size × 0.4). `press` 0–1 drops it in. */
export function Staple({ size, press = 1, style }: { size: number; press?: number; style?: CSSProperties }) {
  const p = clamp01(press);
  if (p <= 0.001) return null;
  return (
    <svg
      width={size}
      height={size * 0.4}
      viewBox="0 0 60 24"
      style={{
        display: 'block',
        overflow: 'visible',
        opacity: Math.min(1, p * 1.6),
        transform: `translateY(${(1 - p) * -size * 0.5}px) scale(${1.25 - 0.25 * p})`,
        filter: `drop-shadow(0 2px 3px ${alpha('#000000', 0.6)})`,
        ...style,
      }}
    >
      <path d="M 6 20 L 6 8 Q 6 4 10 4 L 50 4 Q 54 4 54 8 L 54 20" fill="none" stroke={alpha('#000000', 0.55)} strokeWidth={6} strokeLinecap="round" transform="translate(1 2)" />
      <path d="M 6 20 L 6 8 Q 6 4 10 4 L 50 4 Q 54 4 54 8 L 54 20" fill="none" stroke={STEEL} strokeWidth={5} strokeLinecap="round" />
      <path d="M 12 5.5 L 48 5.5" stroke="#f8fafc" strokeWidth={1.4} strokeLinecap="round" opacity={0.7} />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// The justificante stapled to the DNI (OCSP stapling)

/** Layout of the pair for a DNI `width` px wide: the box and where each piece sits. */
export function stapledPairLayout(width: number) {
  const dni = dniSize(width);
  const jw = Math.round(width * 0.58);
  const j = justificanteSize(jw);
  // The receipt overlaps the DNI's right edge (on top of it), raised a little; the staple binds the overlap.
  const jx = Math.round(width * 0.84);
  const dniY = Math.round(j.h * 0.3);
  const staple = { w: Math.round(width * 0.22), x: jx - Math.round(width * 0.08), y: dniY + Math.round(dni.h * 0.1) };
  return {
    w: jx + jw + 8,
    h: Math.max(dniY + dni.h, j.h) + 6,
    dni: { x: 0, y: dniY, ...dni },
    receipt: { x: jx, y: 0, w: jw, h: j.h },
    staple,
  };
}

export function StapledPair({
  width,
  receipt = 1,
  staple = 1,
  seal,
  glow = 0,
  dim = 0,
  style,
}: {
  /** The DNI's width; the pair is `stapledPairLayout(width).w` wide. */
  width: number;
  /** 0–1: the justificante slides in beside the DNI. */
  receipt?: number;
  /** 0–1: the staple drops in, binding them. */
  staple?: number;
  /** The police's (= the CA's) seal on the justificante. */
  seal?: SealRender;
  glow?: number;
  dim?: number;
  style?: CSSProperties;
}) {
  const L = stapledPairLayout(width);
  const r = clamp01(receipt);
  return (
    <div style={{ position: 'relative', width: L.w, height: L.h, ...dimmed(dim), ...style }}>
      <div style={{ position: 'absolute', left: L.dni.x, top: L.dni.y }}>
        <DniCard width={width} glow={glow} />
      </div>
      {r > 0.001 ? (
        <div
          style={{
            position: 'absolute',
            left: L.receipt.x,
            top: L.receipt.y,
            opacity: Math.min(1, r * 1.4),
            transform: `translateX(${(1 - r) * 40}px) rotate(${3 * r}deg)`,
            transformOrigin: 'left bottom',
          }}
        >
          <Justificante width={L.receipt.w} seal={seal} glow={glow} />
        </div>
      ) : null}
      <div style={{ position: 'absolute', left: L.staple.x, top: L.staple.y }}>
        <Staple size={L.staple.w} press={staple} />
      </div>
    </div>
  );
}

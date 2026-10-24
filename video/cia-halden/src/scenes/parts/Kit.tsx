import { C, FONT, alpha } from '../../../../engine/src/theme/tokens';
import { Icon, clamp01, type IconName } from '../../../../engine/src/ui';

/**
 * The home first-aid kit (concept 3, gap analysis), always labelled «imagen · no es del puerto» by the scene: an open
 * box with an emerald plus (never a red cross), and the list of what it should hold beside it — plasters, yes ·
 * thermometer, no batteries · saline, missing — with the buying order (what you would miss most, first).
 */

export const KIT = { w: 420, h: 340 } as const;
export const kitHeight = (width: number) => (width * KIT.h) / KIT.w;

export type MarkKind = 'yes' | 'half' | 'no';
export const MARK_TONE: Record<MarkKind, string> = { yes: C.emerald, half: C.amber, no: C.rose };
const MARK_ICON: Record<MarkKind, IconName> = { yes: 'check', half: 'alert', no: 'x' };

export const KIT_ITEMS: readonly { name: string; note: string; mark: MarkKind; order?: number }[] = [
  { name: 'tiritas', note: 'sí', mark: 'yes' },
  { name: 'termómetro', note: 'sin pilas', mark: 'half', order: 2 },
  { name: 'suero', note: 'falta', mark: 'no', order: 1 },
];

/**
 * The open box. `items` 0–1 brightens what is inside; `marks` 0–1 tints each item with its mark (the plaster emerald,
 * the thermometer amber, the empty place of the saline rose and dashed).
 */
export function KitBox({ width, items = 1, marks = [0, 0, 0], glow = 0, idSuffix = '' }: { width: number; items?: number; marks?: readonly number[]; glow?: number; idSuffix?: string }) {
  const g = clamp01(glow);
  const it = clamp01(items);
  const tone = (i: number, base: string) => (clamp01(marks[i]) > 0.5 ? MARK_TONE[KIT_ITEMS[i].mark] : base);
  return (
    <svg width={width} height={kitHeight(width)} viewBox={`0 0 ${KIT.w} ${KIT.h}`} style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <filter id={`kit-glow${idSuffix}`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation={8} />
        </filter>
      </defs>
      {/* lid, open behind the box */}
      <path d="M40 140 L70 30 H350 L380 140" fill={alpha(C.emerald, 0.06)} stroke={alpha(C.emerald, 0.55)} strokeWidth={3} strokeLinejoin="round" />
      <path d="M190 62 h40 M210 42 v40" stroke={alpha(C.emerald, 0.55)} strokeWidth={8} strokeLinecap="round" />
      {/* what is inside, peeking over the rim */}
      <g opacity={0.45 + 0.55 * it}>
        {/* plaster */}
        <g transform="translate(70 92) rotate(-12)">
          <rect x={0} y={0} width={96} height={34} rx={17} fill={alpha(tone(0, C.sky), 0.18)} stroke={tone(0, C.sky)} strokeWidth={3} />
          <rect x={34} y={6} width={28} height={22} rx={4} fill={alpha(tone(0, C.sky), 0.35)} />
        </g>
        {/* thermometer */}
        <g transform="translate(196 58) rotate(14)">
          <rect x={0} y={0} width={18} height={92} rx={9} fill={alpha(tone(1, C.sky), 0.14)} stroke={tone(1, C.sky)} strokeWidth={3} />
          <circle cx={9} cy={96} r={14} fill={alpha(tone(1, C.sky), 0.3)} stroke={tone(1, C.sky)} strokeWidth={3} />
        </g>
        {/* saline bottle: a dashed empty place once it is marked missing */}
        <g transform="translate(286 64)">
          {clamp01(marks[2]) > 0.5 ? (
            <path d="M18 0 h24 v18 l14 14 v60 h-52 v-60 l14 -14 Z" fill="none" stroke={C.rose} strokeWidth={3} strokeDasharray="8 7" strokeLinejoin="round" />
          ) : (
            <path d="M18 0 h24 v18 l14 14 v60 h-52 v-60 l14 -14 Z" fill={alpha(C.sky, 0.16)} stroke={C.sky} strokeWidth={3} strokeLinejoin="round" />
          )}
        </g>
      </g>
      {/* box */}
      {g > 0.02 ? <rect x={30} y={140} width={360} height={180} rx={26} fill={alpha(C.emerald, 0.3 * g)} filter={`url(#kit-glow${idSuffix})`} /> : null}
      <rect x={30} y={140} width={360} height={180} rx={26} fill={C.ink850} stroke={C.emerald} strokeOpacity={0.6 + 0.35 * g} strokeWidth={4} />
      <rect x={176} y={186} width={68} height={88} rx={10} fill={alpha(C.emerald, 0.85)} />
      <rect x={166} y={196} width={88} height={68} rx={10} fill={alpha(C.emerald, 0.85)} />
      <rect x={150} y={124} width={120} height={22} rx={11} fill={C.ink800} stroke={alpha(C.emerald, 0.6)} strokeWidth={3} />
    </svg>
  );
}

/** A round mark (check / half / x) in its colour. */
export function Mark({ kind, size, on = 1 }: { kind: MarkKind; size: number; on?: number }) {
  const o = clamp01(on);
  const tone = MARK_TONE[kind];
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        display: 'grid',
        placeItems: 'center',
        flexShrink: 0,
        background: alpha(tone, 0.85 * o),
        border: `3px solid ${alpha(tone, 0.3 + 0.7 * o)}`,
        transform: `scale(${0.6 + 0.4 * o})`,
        opacity: 0.25 + 0.75 * o,
      }}
    >
      <Icon name={MARK_ICON[kind]} size={Math.round(size * 0.6)} color={C.ink950} strokeWidth={2.6} />
    </div>
  );
}

/**
 * The list beside the open kit: «lo que debería tener», one row per item, its mark on `marks[i]`, and the buying order
 * (a numbered badge) on `order`.
 */
export function KitList({ width, show = 1, marks, order = 0 }: { width: number; show?: number; marks: readonly number[]; order?: number }) {
  const ord = clamp01(order);
  return (
    <div
      style={{
        width,
        boxSizing: 'border-box',
        padding: '22px 30px 26px',
        borderRadius: 26,
        background: alpha(C.ink850, 0.92),
        border: `2px solid ${C.ink600}`,
        fontFamily: FONT.sans,
        opacity: clamp01(show),
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 32, fontWeight: 750, color: C.muted, marginBottom: 14, whiteSpace: 'nowrap' }}>
        <Icon name="file" size={32} color={C.muted} />
        lo que debería tener
      </div>
      {KIT_ITEMS.map((it, i) => {
        const m = clamp01(marks[i]);
        const tone = MARK_TONE[it.mark];
        return (
          <div key={it.name} style={{ display: 'flex', alignItems: 'center', gap: 20, height: 84, borderTop: `2px solid ${alpha(C.ink600, 0.7)}` }}>
            <Mark kind={it.mark} size={52} on={m} />
            <div style={{ fontSize: 44, fontWeight: 800, color: C.textStrong, whiteSpace: 'nowrap', width: 270 }}>{it.name}</div>
            <div style={{ fontSize: 40, fontWeight: 800, color: tone, opacity: m, whiteSpace: 'nowrap', flex: 1 }}>{it.note}</div>
            {it.order ? (
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '4px 16px',
                  borderRadius: 999,
                  border: `2px solid ${alpha(C.emerald, 0.8)}`,
                  background: alpha(C.emerald, 0.14),
                  fontSize: 32,
                  fontWeight: 850,
                  color: C.emerald,
                  whiteSpace: 'nowrap',
                  opacity: ord,
                  transform: `scale(${0.7 + 0.3 * ord})`,
                }}
              >
                {`${it.order}.º`}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

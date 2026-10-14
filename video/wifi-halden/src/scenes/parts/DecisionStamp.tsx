import { C, FONT, RADIUS, alpha } from '../../../../engine/src/theme/tokens';
import { Icon, clamp01 } from '../../../../engine/src/ui';

/**
 * The ONE decision stamp of V21: «HALDEN-OPS a WPA3-Enterprise · Infraestructura · 22-12».
 * It lands in s04 on `decision` and s05 opens with it in the same place; on s05's `answer`
 * `eap` goes from 0 to 1 and «· EAP-TLS» opens after «WPA3-Enterprise». At `eap` = 0 the method is
 * not in the tree at all (s04 must not name it).
 *
 * Emerald: a decision taken (the series' improvement strip, in this video's colour for «fixed»).
 * Anchored at its left edge, so opening the insert moves nothing to its left.
 */

/** Where the stamp rests in BOTH scenes (stage-local px). */
export const STAMP_AT = { x: 0, y: 598 } as const;
export const STAMP_H = 58;

const TEXT = {
  network: 'HALDEN-OPS',
  to: 'a',
  mode: 'WPA3-Enterprise',
  method: 'EAP-TLS',
  owner: 'Infraestructura',
  day: '22-12',
} as const;

/** Room for «· EAP-TLS» at the default size (its real width is a little less). */
const INSERT_W = 7.2;
const EMERALD_SOFT = '#6ee7b7';

export function DecisionStamp({
  show = 1,
  eap = 0,
  glow = 0,
  eapGlow = 0,
  size = 36,
}: {
  /** 0–1: the stamp lands (1 = resting). */
  show?: number;
  /** 0–1: «· EAP-TLS» opens after «WPA3-Enterprise». */
  eap?: number;
  glow?: number;
  /** 0–1: the insert alone is lit (it has just arrived). */
  eapGlow?: number;
  size?: number;
}) {
  const s = clamp01(show);
  if (s <= 0.001) return null;
  const e = clamp01(eap);
  const g = clamp01(glow);
  const eg = clamp01(eapGlow);
  const sep = <span style={{ margin: `0 ${Math.round(size * 0.36)}px`, color: alpha(C.emerald, 0.6), fontWeight: 700 }}>·</span>;
  return (
    <div
      style={{
        position: 'absolute',
        left: STAMP_AT.x,
        top: STAMP_AT.y,
        height: STAMP_H,
        display: 'inline-flex',
        alignItems: 'center',
        padding: `0 ${Math.round(size * 0.66)}px 0 ${Math.round(size * 0.44)}px`,
        boxSizing: 'border-box',
        borderRadius: RADIUS.md,
        border: `3px solid ${alpha(C.emerald, 0.8 + 0.2 * g)}`,
        outline: `2px solid ${alpha(C.emerald, 0.3)}`,
        outlineOffset: 4,
        background: `linear-gradient(180deg, ${alpha(C.emerald, 0.16 + 0.08 * g)} 0%, ${alpha(C.ink950, 0.94)} 100%)`,
        boxShadow: `0 0 ${Math.round(10 + 34 * g)}px ${alpha(C.emerald, 0.12 + 0.34 * g)}, 0 10px 24px ${alpha('#000000', 0.4)}`,
        fontFamily: FONT.sans,
        fontSize: size,
        fontWeight: 760,
        lineHeight: 1,
        color: EMERALD_SOFT,
        whiteSpace: 'nowrap',
        opacity: Math.min(1, s * 1.5),
        transform: `scale(${1.22 - 0.22 * s})`,
        transformOrigin: '0 50%',
      }}
    >
      <Icon name="flag" size={Math.round(size * 0.94)} color={C.emerald} strokeWidth={2.3} style={{ marginRight: Math.round(size * 0.36) }} />
      <span style={{ fontFamily: FONT.mono, fontWeight: 800, color: C.textStrong }}>{TEXT.network}</span>
      <span style={{ margin: `0 ${Math.round(size * 0.3)}px`, color: C.text }}>{TEXT.to}</span>
      <span style={{ fontWeight: 850, color: C.textStrong }}>{TEXT.mode}</span>
      {e > 0.001 ? (
        <span style={{ display: 'inline-flex', alignItems: 'center', overflow: 'hidden', maxWidth: e * INSERT_W * size, opacity: Math.min(1, e * 1.6), height: STAMP_H }}>
          {sep}
          <span
            style={{
              fontWeight: 880,
              color: '#ecfdf5',
              textShadow: eg > 0.01 ? `0 0 ${Math.round(22 * eg)}px ${alpha(C.emerald, 0.9 * eg)}` : undefined,
            }}
          >
            {TEXT.method}
          </span>
        </span>
      ) : null}
      {sep}
      <span>{TEXT.owner}</span>
      {sep}
      <span style={{ fontFamily: FONT.mono, fontWeight: 800, color: C.textStrong }}>{TEXT.day}</span>
    </div>
  );
}

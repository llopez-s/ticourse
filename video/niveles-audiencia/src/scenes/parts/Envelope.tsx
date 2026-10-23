import type { CSSProperties, ReactNode } from 'react';
import { C, FONT, alpha } from '../../../../engine/src/theme/tokens';
import { Icon, type IconName } from '../../../../engine/src/ui/Icon';
import { clamp01 } from '../../../../engine/src/ui';

/**
 * The video's image for «lo que entregas a cada lector»: an envelope seen from above, same shape and
 * size for every reader. Natural size 540×470 (body 540×300, the open flap and the card rise above it).
 *
 *   open 0   sealed: the flap lies over the pocket, the seal on its tip
 *   open 1   the flap is up behind the card, the card has risen out of the pocket
 *
 * Geometry (natural px, component-local): body top y = BODY_Y, pocket edge y = POCKET_Y.
 */
export const ENV = { w: 540, h: 470, bodyY: 170, bodyH: 300, pocketY: 290, flapTip: 150 } as const;

export function envelopeHeight(width: number): number {
  return (ENV.h * width) / ENV.w;
}

export function Envelope({
  width = ENV.w,
  label,
  sub,
  tone,
  icon,
  open = 0,
  sealOpacity = 1,
  glow = 0,
  dim = 0,
  card,
  cardTone,
  check = 0,
  style,
}: {
  width?: number;
  /** The big word on the pocket («consejo», «SOC»). */
  label: string;
  /** A line under it (the reader's question). */
  sub?: string;
  /** Envelope colour (#rrggbb). */
  tone: string;
  /** Seal icon. */
  icon: IconName;
  /** 0 sealed … 1 open with the card out. */
  open?: number;
  /** Seal visibility (0–1); a sealed envelope that opens loses it. */
  sealOpacity?: number;
  /** 0–1 halo. */
  glow?: number;
  /** 0–1: pushes the whole envelope back. */
  dim?: number;
  /** The card's content, in natural coordinates (width 480). */
  card?: ReactNode;
  /** Card border colour (defaults to the envelope's). */
  cardTone?: string;
  /** 0–1: an emerald check on the pocket (the right product reached the right reader). */
  check?: number;
  style?: CSSProperties;
}) {
  const s = width / ENV.w;
  const o = clamp01(open);
  const g = clamp01(glow);
  const d = clamp01(dim);
  const tipY = ENV.bodyY + ENV.flapTip - 2 * ENV.flapTip * o; // closed: below the top edge; open: above it
  const flapBehind = o > 0.5;
  const cardTop = ENV.pocketY - 22 - 250 * o; // hidden behind the pocket at 0
  const pocketPath = `M0,${ENV.pocketY} H${ENV.w} V${ENV.h - 18} Q${ENV.w},${ENV.h} ${ENV.w - 18},${ENV.h} H18 Q0,${ENV.h} 0,${ENV.h - 18} Z`;
  const flapPoints = `0,${ENV.bodyY + 2} ${ENV.w},${ENV.bodyY + 2} ${ENV.w / 2},${tipY}`;
  const bodyFill = `linear-gradient(180deg, ${alpha(tone, 0.16)} 0%, ${C.ink850} 100%)`;

  const Flap = (
    <svg width={ENV.w} height={ENV.h} viewBox={`0 0 ${ENV.w} ${ENV.h}`} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} aria-hidden>
      <polygon points={flapPoints} fill={alpha(tone, flapBehind ? 0.22 : 0.3)} stroke={alpha(tone, 0.85)} strokeWidth={3} strokeLinejoin="round" />
    </svg>
  );

  return (
    <div style={{ position: 'relative', width, height: envelopeHeight(width), ...style }}>
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: ENV.w,
          height: ENV.h,
          transform: `scale(${s})`,
          transformOrigin: '0 0',
          fontFamily: FONT.sans,
          opacity: 1 - 0.6 * d,
          filter: d > 0.01 ? `saturate(${1 - 0.5 * d})` : undefined,
        }}
      >
        {/* halo */}
        {g > 0.01 ? (
          <div
            style={{
              position: 'absolute',
              left: -10,
              top: ENV.bodyY - 10,
              width: ENV.w + 20,
              height: ENV.bodyH + 20,
              borderRadius: 30,
              boxShadow: `0 0 ${Math.round(60 * g)}px ${alpha(tone, 0.4 * g)}`,
            }}
          />
        ) : null}
        {/* back of the envelope */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: ENV.bodyY,
            width: ENV.w,
            height: ENV.bodyH,
            boxSizing: 'border-box',
            borderRadius: 20,
            border: `3px solid ${alpha(tone, 0.7)}`,
            background: bodyFill,
            boxShadow: `0 26px 54px ${alpha('#000000', 0.45)}`,
          }}
        />
        {flapBehind ? Flap : null}

        {/* the card, clipped to the envelope's box */}
        <div style={{ position: 'absolute', left: 0, top: 0, width: ENV.w, height: ENV.h, overflow: 'hidden', borderRadius: 20 }}>
          <div
            style={{
              position: 'absolute',
              left: 30,
              top: cardTop,
              width: ENV.w - 60,
              height: 360,
              boxSizing: 'border-box',
              padding: '22px 24px',
              borderRadius: 18,
              border: `3px solid ${alpha(cardTone ?? tone, 0.85)}`,
              background: `linear-gradient(180deg, ${C.ink800} 0%, ${C.ink900} 100%)`,
              boxShadow: `0 14px 30px ${alpha('#000000', 0.35)}`,
              opacity: Math.min(1, o * 4),
            }}
          >
            {card}
          </div>
        </div>

        {/* the pocket (front) */}
        <svg width={ENV.w} height={ENV.h} viewBox={`0 0 ${ENV.w} ${ENV.h}`} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} aria-hidden>
          <path d={pocketPath} fill={C.ink850} />
          <path d={pocketPath} fill={alpha(tone, 0.14)} stroke={alpha(tone, 0.8)} strokeWidth={3} />
          <path d={`M10,${ENV.h - 12} L${ENV.w / 2},${ENV.pocketY + 90} L${ENV.w - 10},${ENV.h - 12}`} stroke={alpha(tone, 0.22)} strokeWidth={2} fill="none" />
        </svg>

        {/* label on the pocket */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: ENV.pocketY + (sub ? 62 : 70),
            width: ENV.w,
            textAlign: 'center',
            whiteSpace: 'nowrap',
          }}
        >
          <div style={{ fontSize: 62, fontWeight: 850, letterSpacing: label === 'SOC' ? 6 : -1, color: C.textStrong, lineHeight: 1 }}>{label}</div>
          {sub ? <div style={{ marginTop: 10, fontSize: 40, fontWeight: 700, color: alpha(tone, 1), lineHeight: 1.05 }}>{sub}</div> : null}
        </div>

        {!flapBehind ? Flap : null}

        {/* seal on the flap tip */}
        {sealOpacity > 0.01 && o < 0.5 ? (
          <div
            style={{
              position: 'absolute',
              left: ENV.w / 2 - 34,
              top: tipY - 34 - 10,
              width: 68,
              height: 68,
              borderRadius: 34,
              display: 'grid',
              placeItems: 'center',
              background: tone,
              boxShadow: `0 6px 18px ${alpha('#000000', 0.45)}`,
              opacity: sealOpacity * (1 - o * 2),
            }}
          >
            <Icon name={icon} size={38} color={C.ink950} strokeWidth={2.4} />
          </div>
        ) : null}

        {/* the right product reached the right reader */}
        {check > 0.01 ? (
          <div
            style={{
              position: 'absolute',
              right: 20,
              top: ENV.bodyY + ENV.bodyH - 20 - 66,
              width: 66,
              height: 66,
              borderRadius: 33,
              display: 'grid',
              placeItems: 'center',
              background: C.emerald,
              boxShadow: `0 6px 18px ${alpha('#000000', 0.45)}`,
              transform: `scale(${0.6 + 0.4 * check})`,
              opacity: check,
            }}
          >
            <Icon name="check" size={40} color={C.ink950} strokeWidth={3.2} />
          </div>
        ) : null}
      </div>
    </div>
  );
}

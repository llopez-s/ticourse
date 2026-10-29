import type { CSSProperties, ReactNode } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../engine/src/theme/tokens';
import { Chip, Icon, clamp01 } from '../../../../engine/src/ui';
import { SOURCES, type SourceId } from './data';

/**
 * One of the four sources on the table («la mesa»). The card's identity never changes between scenes: the same
 * icon, name and cyan border, whatever the verdict on what it says (a card is never recoloured for being «bad»).
 *
 *  - `variant="tile"` (s01): a roomy tile in a row; `flip` 0 = face down (a card back), 1 = face up. The flip is a
 *    horizontal squash through the middle (no 3D), so it stays crisp.
 *  - `variant="row"` (s02, s03): the compact header of a table row (icon + name + format) with `height` set by the
 *    row. Same cyan, same icon.
 *
 * Not positioned: wrap it in an absolutely placed div.
 */
export function SourceCard({
  id,
  variant = 'row',
  width,
  height,
  flip = 1,
  glow = 0,
  formatShown = 1,
  longFormat = false,
  formatChip = 0,
  children,
  style,
}: {
  id: SourceId;
  variant?: 'tile' | 'row';
  width: number;
  height: number;
  flip?: number;
  /** 0–1: the voice is on this card. */
  glow?: number;
  /** 0–1: the format line is on (it arrives with its own cue in s02). */
  formatShown?: number;
  /** «JSON · nombre: valor» instead of «JSON». */
  longFormat?: boolean;
  /** 0–1: the format line turns into a pill (the voice names the format: JSON, CSV). */
  formatChip?: number;
  children?: ReactNode;
  style?: CSSProperties;
}) {
  const src = SOURCES[id];
  const f = clamp01(flip);
  // |cos| squash: 1 → 0 at the middle of the flip → 1.
  const squash = Math.abs(Math.cos(Math.PI * f));
  const faceUp = f >= 0.5;
  const g = clamp01(glow);
  const border = alpha(C.cyan, 0.5 + 0.4 * g);
  const tile = variant === 'tile';
  return (
    <div
      style={{
        position: 'relative',
        width,
        height,
        boxSizing: 'border-box',
        borderRadius: RADIUS.lg,
        border: `2px solid ${border}`,
        background: faceUp
          ? `linear-gradient(180deg, ${alpha(C.ink850, 0.98)} 0%, ${alpha(C.ink900, 0.98)} 100%)`
          : `repeating-linear-gradient(135deg, ${alpha(C.cyan, 0.1)} 0 14px, ${alpha(C.ink800, 1)} 14px 28px)`,
        boxShadow: g > 0.01 ? `0 0 ${20 + g * 34}px ${alpha(C.cyan, 0.3 * g)}` : `0 22px 50px ${alpha('#000000', 0.32)}`,
        transform: `scaleX(${Math.max(0.001, squash)})`,
        transformOrigin: 'center',
        overflow: 'hidden',
        fontFamily: FONT.sans,
        ...style,
      }}
    >
      {faceUp ? (
        tile ? (
          <div style={{ padding: '22px 24px', display: 'flex', flexDirection: 'column', gap: 12, height: '100%', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div
                style={{
                  width: 66,
                  height: 66,
                  borderRadius: 18,
                  background: alpha(C.cyan, 0.14),
                  border: `2px solid ${alpha(C.cyan, 0.6)}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Icon name={src.icon} size={40} color={C.cyan} />
              </div>
              <div style={{ fontSize: 34, fontWeight: 800, lineHeight: 1.12, color: C.textStrong }}>{src.name}</div>
            </div>
            <div style={{ marginTop: 'auto', opacity: formatShown }}>
              <Chip accent="cyan" size={28}>
                {longFormat ? src.formatLong : src.format}
              </Chip>
            </div>
          </div>
        ) : (
          <div style={{ padding: '0 16px', display: 'flex', alignItems: 'center', gap: 14, height: '100%', boxSizing: 'border-box' }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 16,
                background: alpha(C.cyan, 0.14),
                border: `2px solid ${alpha(C.cyan, 0.6)}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Icon name={src.icon} size={34} color={C.cyan} />
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 30, fontWeight: 800, lineHeight: 1.12, color: C.textStrong }}>{src.name}</div>
              <div
                style={{
                  marginTop: 6,
                  fontSize: 22,
                  fontWeight: 650,
                  lineHeight: 1.1,
                  fontFamily: FONT.mono,
                  color: C.cyanSoft,
                  opacity: formatShown,
                  whiteSpace: 'nowrap',
                  display: 'inline-block',
                  padding: '1px 12px',
                  marginLeft: -14,
                  borderRadius: RADIUS.pill,
                  border: `2px solid ${alpha(C.cyan, 0.6 * clamp01(formatChip))}`,
                  background: alpha(C.cyan, 0.12 * clamp01(formatChip)),
                }}
              >
                {longFormat ? src.formatLong : src.format}
              </div>
            </div>
            {children}
          </div>
        )
      ) : (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width={tile ? 96 : 56} height={tile ? 96 : 56} viewBox="14.6 14.6 70.8 70.8" aria-hidden>
            <rect x="25" y="25" width="50" height="50" rx="8" transform="rotate(45 50 50)" fill={alpha(C.cyan, 0.5)} />
          </svg>
        </div>
      )}
    </div>
  );
}

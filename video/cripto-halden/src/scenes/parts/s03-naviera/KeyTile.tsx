import type { CSSProperties } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { clamp01 } from '../../../../../engine/src/ui';
import { PrivateKey, SlotGlyph } from '../Mailbox';
import { PARTY_TONE, type Party } from '../s02-familias/Parties';

/**
 * A key «a la vista» as a card (s03, s07): the public key drawn as the slot
 * plate, the private key as the mailbox's own key, in the owner's colour
 * (cyan = port, emerald = shipping company), with a two-line label
 * («pública» / «de la naviera»). `ring` 0–1 draws a dashed outline in
 * `ringTone` around it (e.g. rose: «lo que propone NULL CIPHER» — the
 * proposal, not the key, is NULL CIPHER's). Height: `keyTileHeight(width)`.
 */

export function keyTileHeight(width: number): number {
  return Math.round(width * 0.74);
}

export function KeyTile({
  kind,
  owner,
  title,
  sub,
  width,
  show = 1,
  glow = 0,
  dim = 0,
  ring = 0,
  ringTone = C.rose,
  style,
}: {
  kind: 'public' | 'private';
  owner: Party;
  title: string;
  sub: string;
  width: number;
  show?: number;
  glow?: number;
  dim?: number;
  ring?: number;
  ringTone?: string;
  style?: CSSProperties;
}) {
  const sh = clamp01(show);
  if (sh <= 0) return null;
  const color = PARTY_TONE[owner];
  const g = clamp01(glow);
  const d = clamp01(dim);
  const r = clamp01(ring);
  const h = keyTileHeight(width);
  const glyphW = Math.round(width * 0.46);
  const k = width / 320;
  return (
    <div
      style={{
        position: 'relative',
        width,
        height: h,
        boxSizing: 'border-box',
        borderRadius: RADIUS.lg,
        border: `3px solid ${alpha(color, 0.55 + 0.45 * g)}`,
        background: `linear-gradient(180deg, ${alpha(color, 0.12 + 0.1 * g)} 0%, ${alpha(C.ink900, 0.96)} 75%)`,
        boxShadow: `0 0 ${Math.round(12 + 30 * g)}px ${alpha(color, 0.12 + 0.35 * g)}, 0 18px 40px ${alpha('#000000', 0.4)}`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: Math.round(12 * k),
        fontFamily: FONT.sans,
        opacity: sh * (1 - 0.6 * d),
        filter: d > 0.01 ? `saturate(${1 - 0.6 * d})` : undefined,
        ...style,
      }}
    >
      <div style={{ height: Math.round(glyphW * 0.55), display: 'flex', alignItems: 'center' }}>
        {kind === 'public' ? <SlotGlyph width={glyphW} color={color} glow={0.4 * g} /> : <PrivateKey width={glyphW} color={color} glow={0.4 * g} />}
      </div>
      <div style={{ textAlign: 'center', lineHeight: 1.12, whiteSpace: 'nowrap' }}>
        <div style={{ fontSize: Math.round(42 * k), fontWeight: 850, color: owner === 'port' ? C.cyanSoft : '#6ee7b7' }}>{title}</div>
        <div style={{ fontSize: Math.round(34 * k), fontWeight: 700, color: C.text }}>{sub}</div>
      </div>
      {r > 0.001 ? (
        <div
          style={{
            position: 'absolute',
            inset: -12,
            borderRadius: RADIUS.lg + 8,
            border: `4px dashed ${alpha(ringTone, 0.9)}`,
            boxShadow: `0 0 26px ${alpha(ringTone, 0.35)}`,
            opacity: r,
            transform: `scale(${1.06 - 0.06 * r})`,
          }}
        />
      ) : null}
    </div>
  );
}

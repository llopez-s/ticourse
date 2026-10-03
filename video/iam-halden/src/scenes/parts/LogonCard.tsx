import type { CSSProperties } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { C, FONT, RADIUS, alpha } from '../../../../engine/src/theme/tokens';
import { EASE, progress, pulse } from '../../../../engine/src/theme/motion';
import { Icon, clamp01, dimStyle } from '../../../../engine/src/ui';

/**
 * The 01:52 SIEM card (V5 / SIEM canon), identical wherever it comes back
 * (s01 hook and close, s09 «least»). Header «4-9 · 01:52», four rows
 * «logon 4624» · «cuenta svc_tosreport» · «desde ADM-WS-07» · «en srv-tc-app03»
 * (identifiers in mono). Optional extras, each reserving its own band so the
 * card never reflows mid-scene:
 * - `stampAt`: the green stamp «contraseña correcta · adelante» lands.
 * - `privAt`: an extra row «4672 · privilegios especiales», highlighted amber.
 * - `privRetiredAt`: that row is struck through and «retirados · solo sacaba
 *   informes» (emerald) appears under it.
 * Drawn in design units (LOGON_BASE_W wide) and scaled to `width`. All frames
 * are Sequence-relative; `frame` defaults to useCurrentFrame().
 */

export const LOGON_BASE_W = 760;

export const LOGON_TEXT = {
  header: '4-9 · 01:52',
  rows: [
    { label: 'logon', value: '4624' },
    { label: 'cuenta', value: 'svc_tosreport' },
    { label: 'desde', value: 'ADM-WS-07' },
    { label: 'en', value: 'srv-tc-app03' },
  ],
  stamp: 'contraseña correcta · adelante',
  privCode: '4672',
  privText: 'privilegios especiales',
  retired: 'retirados · solo sacaba informes',
} as const;

const PAD_X = 32;
const HEAD_H = 92;
const ROW_H = 64;
const ROWS_TOP = HEAD_H + 14;
const PRIV_H = 70;
const RETIRED_H = 58;
const STAMP_H = 112;
const BOTTOM_PAD = 18;
const LABEL_W = 150;

/** Which optional bands the card reserves. Pass the same flags you give the card (its props). */
export interface LogonCardBands {
  stamp?: boolean;
  priv?: boolean;
  retired?: boolean;
}

/** Height in design units (at LOGON_BASE_W) for the given bands. */
function baseHeight({ stamp = false, priv = false, retired = false }: LogonCardBands): number {
  let h = ROWS_TOP + LOGON_TEXT.rows.length * ROW_H;
  if (priv) h += PRIV_H;
  if (priv && retired) h += RETIRED_H;
  if (stamp) h += STAMP_H;
  return h + BOTTOM_PAD;
}

/**
 * Height in px of a LogonCard drawn at `width` with these bands. Bands follow
 * the props: `stamp` = stampAt is set, `priv` = privAt is set, `retired` =
 * privRetiredAt is set.
 */
export function logonCardHeight(width = LOGON_BASE_W, bands: LogonCardBands = {}): number {
  return (baseHeight(bands) * width) / LOGON_BASE_W;
}

/** Top of the 4672 row in px from the card's top-left at `width` (to anchor a label next to it; only drawn with privAt). */
export function logonPrivRowTop(width = LOGON_BASE_W): number {
  return ((ROWS_TOP + LOGON_TEXT.rows.length * ROW_H) * width) / LOGON_BASE_W;
}

export function LogonCard({
  at,
  dim = 0,
  stampAt,
  privAt,
  privRetiredAt,
  width = LOGON_BASE_W,
  glow = 0,
  frame: frameProp,
  style,
}: {
  /** Frame the card appears (rows follow, staggered). Undefined: already on screen. */
  at?: number;
  /** 0–1: steps the card back (focus elsewhere). */
  dim?: number;
  /** Frame the green stamp lands. Undefined: no stamp band. */
  stampAt?: number;
  /** Frame the «4672 · privilegios especiales» row appears, highlighted. Undefined: no row. */
  privAt?: number;
  /** Frame that row is struck and «retirados · solo sacaba informes» appears. Needs privAt. */
  privRetiredAt?: number;
  width?: number;
  /** 0–1: cyan halo (the card the voice is on). */
  glow?: number;
  frame?: number;
  style?: CSSProperties;
}) {
  const current = useCurrentFrame();
  const frame = frameProp ?? current;
  const { fps } = useVideoConfig();
  const s = width / LOGON_BASE_W;
  const bands: LogonCardBands = { stamp: stampAt !== undefined, priv: privAt !== undefined, retired: privAt !== undefined && privRetiredAt !== undefined };
  const h = baseHeight(bands);

  const t0 = at ?? Number.NEGATIVE_INFINITY;
  const show = at === undefined ? 1 : progress(frame, at, 16);
  if (show <= 0) return null;
  const rowIn = (i: number) => (at === undefined ? 1 : progress(frame, t0 + 8 + i * 6, 14));
  const g = clamp01(glow);
  const dimmed = dimStyle(dim, show);

  // Priv row (4672) and its retirement.
  const privIn = privAt === undefined ? 0 : progress(frame, privAt, 14);
  const privHi = privAt === undefined ? 0 : progress(frame, privAt, 10) * (privRetiredAt === undefined ? 1 : 1 - progress(frame, privRetiredAt, 14, EASE.inOut));
  const strike = privRetiredAt === undefined ? 0 : progress(frame, privRetiredAt, 14, EASE.inOut);
  const retiredIn = privRetiredAt === undefined ? 0 : progress(frame, privRetiredAt + 8, 14);

  // Stamp: lands with a quick scale-down exactly at stampAt.
  const stampP = stampAt === undefined ? 0 : progress(frame, stampAt, 9, EASE.out);
  const stampGlow = stampAt === undefined ? 0 : progress(frame, stampAt, 6) * (1 - progress(frame, stampAt + 10, 30, EASE.inOut));

  const rowsBottom = ROWS_TOP + LOGON_TEXT.rows.length * ROW_H;
  const privTop = rowsBottom;
  const stampTop = rowsBottom + (bands.priv ? PRIV_H : 0) + (bands.retired ? RETIRED_H : 0);

  return (
    <div style={{ position: 'relative', width, height: h * s, ...style, ...dimmed }}>
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: LOGON_BASE_W,
          height: h,
          transform: `scale(${s}) translateY(${(1 - show) * 18}px)`,
          transformOrigin: '0 0',
          boxSizing: 'border-box',
          borderRadius: RADIUS.lg,
          border: `2px solid ${g > 0 ? alpha(C.cyan, 0.4 + 0.5 * g) : C.ink600}`,
          background: `linear-gradient(180deg, ${C.ink850} 0%, ${C.ink900} 100%)`,
          boxShadow: `0 28px 64px ${alpha('#000000', 0.42)}${g > 0 ? `, 0 0 ${26 + 30 * g}px ${alpha(C.cyan, 0.3 * g * (0.8 + 0.2 * pulse(frame, fps, 0.6)))}` : ''}`,
          overflow: 'hidden',
          fontFamily: FONT.sans,
        }}
      >
        {/* Left accent bar */}
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 8, background: C.cyan, opacity: 0.85 }} />

        {/* Header: date · time */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: LOGON_BASE_W,
            height: HEAD_H,
            display: 'flex',
            alignItems: 'center',
            gap: 18,
            padding: `0 ${PAD_X}px 0 ${PAD_X + 6}px`,
            boxSizing: 'border-box',
            background: alpha(C.ink800, 0.9),
            borderBottom: `2px solid ${C.ink700}`,
          }}
        >
          <Icon name="server" size={42} color={C.cyan} />
          <span style={{ fontFamily: FONT.mono, fontSize: 48, fontWeight: 800, color: C.textStrong, letterSpacing: -0.5, whiteSpace: 'nowrap' }}>
            {LOGON_TEXT.header}
          </span>
        </div>

        {/* The four rows */}
        {LOGON_TEXT.rows.map((r, i) => {
          const p = rowIn(i);
          return (
            <div
              key={r.label}
              style={{
                position: 'absolute',
                left: PAD_X + 6,
                top: ROWS_TOP + i * ROW_H,
                height: ROW_H,
                display: 'flex',
                alignItems: 'center',
                whiteSpace: 'nowrap',
                opacity: p,
                transform: `translateX(${(1 - p) * 14}px)`,
              }}
            >
              <span style={{ width: LABEL_W, fontSize: 34, fontWeight: 600, color: C.muted }}>{r.label}</span>
              <span
                style={{
                  fontFamily: FONT.mono,
                  fontSize: 40,
                  fontWeight: 750,
                  color: i === 1 ? '#fcd34d' : C.textStrong,
                }}
              >
                {r.value}
              </span>
            </div>
          );
        })}

        {/* 4672 · privilegios especiales */}
        {bands.priv && privIn > 0 ? (
          <div
            style={{
              position: 'absolute',
              left: PAD_X - 6,
              top: privTop + 4,
              width: LOGON_BASE_W - 2 * PAD_X + 12,
              height: PRIV_H - 10,
              boxSizing: 'border-box',
              borderRadius: RADIUS.md,
              border: `2px solid ${alpha(C.amber, 0.25 + 0.6 * privHi)}`,
              background: alpha(C.amber, 0.04 + 0.12 * privHi),
              display: 'flex',
              alignItems: 'center',
              gap: 18,
              padding: '0 12px',
              whiteSpace: 'nowrap',
              opacity: privIn,
            }}
          >
            <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', gap: 16 }}>
              <span style={{ fontFamily: FONT.mono, fontSize: 40, fontWeight: 800, color: strike > 0.5 ? C.muted : '#fcd34d' }}>{LOGON_TEXT.privCode}</span>
              <span style={{ fontSize: 34, fontWeight: 400, color: C.faint }}>·</span>
              <span style={{ fontSize: 36, fontWeight: 700, color: strike > 0.5 ? C.muted : C.textStrong }}>{LOGON_TEXT.privText}</span>
              {strike > 0 ? (
                <span
                  style={{
                    position: 'absolute',
                    left: -6,
                    top: '52%',
                    height: 5,
                    width: `calc(${strike * 100}% + 12px)`,
                    borderRadius: 3,
                    background: C.emerald,
                  }}
                />
              ) : null}
            </span>
          </div>
        ) : null}

        {/* retirados · solo sacaba informes */}
        {bands.retired && retiredIn > 0 ? (
          <div
            style={{
              position: 'absolute',
              left: PAD_X + 6,
              top: privTop + PRIV_H,
              height: RETIRED_H - 6,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              whiteSpace: 'nowrap',
              opacity: retiredIn,
              transform: `translateY(${(1 - retiredIn) * -8}px)`,
            }}
          >
            <Icon name="check" size={36} color={C.emerald} strokeWidth={2.6} />
            <span style={{ fontSize: 36, fontWeight: 750, color: '#6ee7b7' }}>{LOGON_TEXT.retired}</span>
          </div>
        ) : null}

        {/* Stamp: contraseña correcta · adelante */}
        {bands.stamp && stampP > 0 ? (
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: stampTop,
              width: LOGON_BASE_W,
              height: STAMP_H,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 14,
                padding: '10px 26px',
                borderRadius: RADIUS.md,
                border: `5px solid ${C.emerald}`,
                background: alpha(C.emeraldDeep, 0.55),
                color: '#6ee7b7',
                fontSize: 38,
                fontWeight: 850,
                whiteSpace: 'nowrap',
                opacity: stampP,
                transform: `rotate(-3deg) scale(${1.5 - 0.5 * stampP})`,
                boxShadow: `0 0 ${18 + 30 * stampGlow}px ${alpha(C.emerald, 0.2 + 0.35 * stampGlow)}`,
              }}
            >
              <Icon name="check" size={40} color={C.emerald} strokeWidth={2.8} />
              {LOGON_TEXT.stamp}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

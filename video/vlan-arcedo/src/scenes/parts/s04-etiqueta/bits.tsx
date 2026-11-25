/**
 * Code-drawn bits of s04-etiqueta (s05-p2 reuses TrunkPipe):
 *   TrunkPipe   the cable between two switches, as a wide pipe frames can travel in
 *   OpenTag     the 802.1Q tag opened in its four fields, the VID highlighted
 *   Tray        the tray an untagged frame falls into (dashed and faint: the native VLAN)
 *   Lines       a label in several lines on a solid ground (strings too long for one line)
 */
import type { ReactNode } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { clamp01 } from '../../../../../engine/src/ui';
import { TAG_FIELDS, TAG_SIZE } from '../../../data/s04-etiqueta';

/** The trunk: a pipe `width`×`height`. `draw` 0–1 grows it from the left; `tones` are faint lanes inside it. */
export function TrunkPipe({
  width,
  height = 84,
  draw = 1,
  tones = [],
  lanes = 0,
  tone = C.sky,
  children,
}: {
  width: number;
  height?: number;
  draw?: number;
  tones?: readonly string[];
  lanes?: number;
  tone?: string;
  children?: ReactNode;
}) {
  const d = clamp01(draw);
  const l = clamp01(lanes);
  return (
    <div
      style={{
        position: 'relative',
        width: Math.round(width * d),
        height,
        overflow: 'hidden',
        boxSizing: 'border-box',
        borderTop: `3px solid ${alpha(tone, 0.7)}`,
        borderBottom: `3px solid ${alpha(tone, 0.7)}`,
        background: C.ink900,
      }}
    >
      {tones.map((t, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: 0,
            width,
            top: Math.round(((height - 6) * (i + 0.5)) / tones.length) - 2,
            height: 4,
            borderRadius: 2,
            background: alpha(t, 0.55 * l),
          }}
        />
      ))}
      {children}
    </div>
  );
}

export const OPEN_TAG_H = 196;

/** The opened tag. `fieldOn[i]` 0–1 brings each field in; `key` 0–1 lights the VID. */
export function OpenTag({ width, tone, fieldOn, keyOn }: { width: number; tone: string; fieldOn: readonly number[]; keyOn: number }) {
  const k = clamp01(keyOn);
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'stretch',
        gap: 14,
        width,
        height: OPEN_TAG_H,
        boxSizing: 'border-box',
        padding: 16,
        borderRadius: RADIUS.lg,
        border: `3px solid ${alpha(tone, 0.7)}`,
        background: C.ink900,
        boxShadow: `0 18px 50px ${alpha(C.ink950, 0.6)}`,
        fontFamily: FONT.sans,
        whiteSpace: 'nowrap',
      }}
    >
      <div style={{ width: 210, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 50, fontWeight: 800, color: C.textStrong }}>{TAG_SIZE}</div>
      {TAG_FIELDS.map((f, i) => {
        const on = clamp01(fieldOn[i] ?? 1);
        const lit = 'key' in f && f.key ? k : 0;
        return (
          <div
            key={f.name}
            style={{
              flex: f.flex,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              boxSizing: 'border-box',
              borderRadius: RADIUS.md,
              border: `3px solid ${alpha(tone, 0.35 + 0.65 * lit)}`,
              background: alpha(tone, 0.06 + 0.2 * lit),
              boxShadow: lit > 0.02 ? `0 0 ${Math.round(30 * lit)}px ${alpha(tone, 0.45 * lit)}` : undefined,
              opacity: on * (1 - 0.35 * k * (1 - lit)),
              transform: `translateY(${(1 - on) * 12}px)`,
            }}
          >
            <div style={{ fontFamily: FONT.mono, fontSize: 48, fontWeight: 800, lineHeight: 1, color: lit > 0.5 ? C.textStrong : C.text }}>{f.name}</div>
            <div style={{ fontSize: 34, fontWeight: 700, lineHeight: 1.1, color: lit > 0.5 ? C.textStrong : C.text }}>{f.value}</div>
          </div>
        );
      })}
    </div>
  );
}

/** A tray seen from the front: open at the top, dashed (nothing lives in it). `label` is written on its front. */
export function Tray({ width, height = 96, tone, on = 0, label }: { width: number; height?: number; tone: string; on?: number; label?: ReactNode }) {
  const o = clamp01(on);
  return (
    <div
      style={{
        position: 'relative',
        width,
        height,
        boxSizing: 'border-box',
        borderLeft: `4px dashed ${alpha(tone, 0.9)}`,
        borderRight: `4px dashed ${alpha(tone, 0.9)}`,
        borderBottom: `4px dashed ${alpha(tone, 0.9)}`,
        borderRadius: `0 0 ${RADIUS.md}px ${RADIUS.md}px`,
        background: alpha(tone, 0.1 + 0.12 * o),
        boxShadow: o > 0.02 ? `0 0 ${Math.round(26 * o)}px ${alpha(tone, 0.5 * o)}` : undefined,
      }}
    >
      {label ? (
        <div style={{ position: 'absolute', right: 16, bottom: 14, fontFamily: FONT.mono, fontSize: 40, fontWeight: 800, lineHeight: 1, color: C.text }}>{label}</div>
      ) : null}
    </div>
  );
}

/** A label in several lines: the first one is the name (bigger), the rest explain it. */
export function Lines({ lines, tone, width, on = 0, headSize = 44, size = 32 }: { lines: readonly string[]; tone: string; width: number; on?: number; headSize?: number; size?: number }) {
  const o = clamp01(on);
  return (
    <div
      style={{
        width,
        boxSizing: 'border-box',
        padding: '10px 20px 12px',
        borderRadius: RADIUS.md,
        border: `2px solid ${alpha(tone, 0.6 + 0.35 * o)}`,
        background: alpha(C.ink950, 0.9),
        boxShadow: o > 0.02 ? `0 0 ${Math.round(24 * o)}px ${alpha(tone, 0.35 * o)}` : undefined,
        fontFamily: FONT.sans,
        whiteSpace: 'nowrap',
      }}
    >
      {lines.map((t, i) => (
        <div key={i} style={{ fontSize: i === 0 ? headSize : size, fontWeight: i === 0 ? 800 : 650, lineHeight: 1.22, color: i === 0 ? C.textStrong : C.text }}>
          {t}
        </div>
      ))}
    </div>
  );
}

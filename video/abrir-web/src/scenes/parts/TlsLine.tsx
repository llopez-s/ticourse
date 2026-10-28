import type { CSSProperties } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../engine/src/theme/tokens';
import { clamp01 } from '../../../../engine/src/ui';
import { TLS_LINE } from './data';

/**
 * «La línea» of the TLS connection, in the SPIRIT of V11's `TlsLine.tsx` (cripto-halden): monospace, coloured chips
 * separated by slashes — but this is ANOTHER connection, not the one of 3-11: three chips
 * `TLSv1.3 / TLS_AES_256_GCM_SHA384 / X25519`, NO date, NO `id-ecPublicKey`, NO «SSL certificate verify ok».
 * Colours: TLSv1.3 sky (the channel), the suite cyan, X25519 steel (the session keys).
 *
 *   - `show`   0–1 appear (each chip staggers in);   `light`  per chip 0–1 (default 1 = lit; 0 = dim).
 *   - `size`   mono font size, default 44 (the line is about 1180 px wide at 44 → fits the 1728 stage).
 *
 * `tlsLineWidth(size)` gives its width. Not positioned: wrap it in an absolutely positioned div.
 */

const TONES = [C.sky, C.cyan, '#cbd5e1'] as const;
const SOFT = ['#7dd3fc', C.cyanSoft, '#e2e8f0'] as const;

function metrics(size: number) {
  const padX = Math.round(size * 0.42);
  const border = 3;
  const gap = Math.round(size * 0.55);
  const slash = Math.round(size * 0.6);
  return { padX, border, gap, slash, advance: size * 0.6, chipH: Math.round(size * 1.25 + size * 0.48 + 6) };
}

export function tlsLineWidth(size = 44): number {
  const m = metrics(size);
  const chips = TLS_LINE.reduce((s, t) => s + t.length * m.advance + 2 * m.padX + 2 * m.border, 0);
  return Math.round(chips + (TLS_LINE.length - 1) * (m.slash + 2 * m.gap));
}

export function tlsLineHeight(size = 44): number {
  return metrics(size).chipH;
}

export function TlsLine({
  size = 44,
  show = 1,
  light = [1, 1, 1],
  style,
}: {
  size?: number;
  show?: number;
  light?: readonly number[];
  style?: CSSProperties;
}) {
  const m = metrics(size);
  const s = clamp01(show);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: m.gap, fontFamily: FONT.mono, fontSize: size, opacity: s, ...style }}>
      {TLS_LINE.map((t, i) => {
        const l = clamp01(light[i] ?? 1);
        const tone = TONES[i];
        return (
          <div key={t} style={{ display: 'flex', alignItems: 'center', gap: m.gap }}>
            {i > 0 ? <span style={{ width: m.slash, textAlign: 'center', fontWeight: 600, color: C.faint }}>/</span> : null}
            <span
              style={{
                display: 'inline-block',
                boxSizing: 'border-box',
                height: m.chipH,
                lineHeight: `${m.chipH - 2 * m.border}px`,
                padding: `0 ${m.padX}px`,
                borderRadius: RADIUS.md,
                border: `${m.border}px solid ${alpha(tone, 0.35 + 0.55 * l)}`,
                background: alpha(tone, 0.06 + 0.12 * l),
                color: l > 0.5 ? SOFT[i] : C.muted,
                fontWeight: 600,
                whiteSpace: 'nowrap',
                boxShadow: l > 0.5 ? `0 0 ${Math.round(22 * l)}px ${alpha(tone, 0.25 * l)}` : undefined,
              }}
            >
              {t}
            </span>
          </div>
        );
      })}
    </div>
  );
}

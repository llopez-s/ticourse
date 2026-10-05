import type { CSSProperties, ReactNode } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { C, FONT, RADIUS, alpha } from '../../../../engine/src/theme/tokens';
import { pulse as pulseOf } from '../../../../engine/src/theme/motion';
import { Icon, clamp01, mix, tone as toneOf, type Tone } from '../../../../engine/src/ui';
import { HOUSE_KEY_SILVER } from './Mailbox';
import { PAINT, lerpColor } from './PaintMix';

/**
 * «La línea»: the ONE line of the shipping company's TLS connection to the
 * berth-booking portal on Tuesday 3-11-2026, drawn ONE way everywhere (canon:
 * out/scene-brief.md «Canon»). s01 shows it half-lit and splits it into four
 * pieces with a «?» each; s09 brings it back and lights each piece as the
 * voice reads it; the poster stacks its chips.
 *
 * ORDER — deliberate, binding (canon): the four pieces sit on screen as
 *     TLS 1.3 · X25519 · TLS_AES_256_GCM_SHA384 · id-ecPublicKey
 * so that s09's voice reads them left to right (la pintura, AES, la huella,
 * la clave pública del servidor). This is NOT curl's own order — `curl -v`
 * prints «TLSv1.3 / TLS_AES_256_GCM_SHA384 / X25519 / id-ecPublicKey»
 * (`TLS_CURL_LINE`, for raw terminal output only). Never re-sort it.
 *
 * Pieces and parts
 *   - `TlsChipId` 'tls' | 'x25519' | 'suite' | 'eckey' — the four chips.
 *   - `TlsPart` 'tls' | 'x25519' | 'aes' | 'sha' | 'eckey' — what lights.
 *     The suite chip holds two parts: `AES_256_GCM` (aes: the symmetric
 *     cipher of all the traffic) and `SHA384` (sha: the fingerprint that
 *     checks nobody touched the handshake); its `TLS_` and `_` are glue and
 *     never light. `tls` lights on s09's «Así funciona TLS».
 *   - `TLS_TONES` default lit colour per part (cyan = the port's key/seal).
 *
 * Layout (exact: JetBrains Mono advances 0.6 em)
 *   - `tlsLayout({ size, prefix, verify })` → { width, height, chips, parts }
 *     with every rect relative to the line's top-left corner. At size 46 the
 *     line is 1660 px wide (fits the 1728 stage); the chip row is
 *     `height` tall minus the optional rows. `prefix` reserves a row above
 *     the chips for the dim «SSL connection using»; `verify` reserves a row
 *     below for «SSL certificate verify ok» (under the key chip).
 *   - `tlsPartRect(part, opts)` = `tlsLayout(opts).parts[part]` — anchor
 *     connectors / labels to a piece (s09). Add your wrapper's offset.
 *   - The «?» badges overflow each chip's top-right corner by ~0.4 × size.
 *
 * Components
 *   - `<TlsLine size? split? ask? light? tones? prefix? verify? pulse? frame? style? />`
 *     Not positioned — wrap it in an absolutely positioned div.
 *       split  0 = one continuous bar (as lifted out of the terminal),
 *              1 = four separate chips.
 *       ask    0–1: the «?» badge on each chip (s01 «cuatro piezas»).
 *       light  per part, 0 = «a media luz» (default), 1 = lit in its tone.
 *       prefix 0–1 opacity of «SSL connection using» (row only when given).
 *       verify 0–1 opacity of «SSL certificate verify ok» (row only when given).
 *       pulse  breathe the glow of lit parts (0.5 Hz).
 *   - `<TlsChip id size? light? tones? ask? split? />` one chip on its own,
 *     relatively positioned (the poster stacks them).
 */

export type TlsChipId = 'tls' | 'x25519' | 'suite' | 'eckey';
export type TlsPart = 'tls' | 'x25519' | 'aes' | 'sha' | 'eckey';

/** The portal's public name (never its host name, never an IP). */
export const TLS_HOST = 'reservas.haldenport.example';
export const TLS_PREFIX = 'SSL connection using';
export const TLS_VERIFY_OK = 'SSL certificate verify ok';
/** The raw line exactly as `curl -v` prints it (curl's order) — terminal texture only. */
export const TLS_CURL_LINE = 'SSL connection using TLSv1.3 / TLS_AES_256_GCM_SHA384 / X25519 / id-ecPublicKey';

interface Span {
  text: string;
  /** Absent: glue that never lights. */
  part?: TlsPart;
}

/** Canon order (see the file comment). */
export const TLS_CHIPS: readonly { id: TlsChipId; spans: readonly Span[] }[] = [
  { id: 'tls', spans: [{ text: 'TLS 1.3', part: 'tls' }] },
  { id: 'x25519', spans: [{ text: 'X25519', part: 'x25519' }] },
  { id: 'suite', spans: [{ text: 'TLS_' }, { text: 'AES_256_GCM', part: 'aes' }, { text: '_' }, { text: 'SHA384', part: 'sha' }] },
  { id: 'eckey', spans: [{ text: 'id-ecPublicKey', part: 'eckey' }] },
];

/** Reading order of the parts (s09's voice: la pintura, AES, la huella, la clave pública). */
export const TLS_PARTS: readonly TlsPart[] = ['tls', 'x25519', 'aes', 'sha', 'eckey'];

/**
 * Default lit colour per part, taken from each piece's image: X25519 = the paint's final colour
 * (PaintMix PAINT.final); AES = the house key's silver (Mailbox HOUSE_KEY_SILVER: it belongs to
 * both sides); SHA384 = the fingerprint and id-ecPublicKey = the port's seal, both cyan (the port);
 * TLS 1.3 = sky (the connection, the public road).
 */
export const TLS_TONES: Record<TlsPart, Tone> = {
  tls: 'sky',
  // Lightened a little so the lit text reads on the dark chip.
  x25519: lerpColor(PAINT.final, '#ffffff', 0.3),
  aes: HOUSE_KEY_SILVER,
  sha: 'cyan',
  eckey: 'cyan',
};

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** JetBrains Mono advance width, in em. */
const MONO = 0.6;

function geom(size: number) {
  const border = 3;
  const padX = Math.round(size * 0.42);
  const padY = Math.round(size * 0.24);
  const lineH = Math.round(size * 1.25);
  return {
    border,
    padX,
    padY,
    lineH,
    chipH: lineH + 2 * padY + 2 * border,
    gap: Math.round(size * 0.95),
    cw: size * MONO,
    prefixSize: Math.round(size * 0.6),
    verifySize: Math.round(size * 0.6),
  };
}

export interface TlsLayoutOpts {
  size?: number;
  prefix?: boolean;
  verify?: boolean;
}

export interface TlsLayout {
  size: number;
  width: number;
  height: number;
  /** Top of the chip row (after the prefix row). */
  rowY: number;
  chipH: number;
  chips: Record<TlsChipId, Rect>;
  parts: Record<TlsPart, Rect>;
  /** The verify row's box (under the key chip), when reserved. */
  verify?: Rect;
}

/** The line's geometry at `size` (see the file comment). */
export function tlsLayout({ size = 46, prefix = false, verify = false }: TlsLayoutOpts = {}): TlsLayout {
  const g = geom(size);
  const rowY = prefix ? Math.round(g.prefixSize * 1.3) + 10 : 0;
  const chips = {} as Record<TlsChipId, Rect>;
  const parts = {} as Record<TlsPart, Rect>;
  let x = 0;
  for (const c of TLS_CHIPS) {
    const chars = c.spans.reduce((n, s) => n + s.text.length, 0);
    const width = Math.round(chars * g.cw + 2 * g.padX + 2 * g.border);
    chips[c.id] = { x, y: rowY, width, height: g.chipH };
    let at = x + g.border + g.padX;
    for (const s of c.spans) {
      const w = s.text.length * g.cw;
      if (s.part) parts[s.part] = { x: Math.round(at), y: rowY, width: Math.round(w), height: g.chipH };
      at += w;
    }
    x += width + g.gap;
  }
  const width = x - g.gap;
  const verifyH = verify ? Math.round(g.verifySize * 1.3) + 14 : 0;
  const key = chips.eckey;
  return {
    size,
    width,
    height: rowY + g.chipH + verifyH,
    rowY,
    chipH: g.chipH,
    chips,
    parts,
    verify: verify ? { x: key.x, y: rowY + g.chipH + 14, width: key.width, height: verifyH - 14 } : undefined,
  };
}

/** One part's box in the line's layout (relative to its top-left corner). */
export function tlsPartRect(part: TlsPart, opts?: TlsLayoutOpts): Rect {
  return tlsLayout(opts).parts[part];
}

// ---------------------------------------------------------------------------

/** Text that cross-fades from the half-lit colour to its lit colour (no colour snap). */
function LitText({ text, k, lit, glow, style }: { text: string; k: number; lit: string; glow: number; style?: CSSProperties }) {
  return (
    <span style={{ position: 'relative', display: 'inline-block', whiteSpace: 'pre', ...style }}>
      <span style={{ color: C.muted, opacity: 0.78 * (1 - k) }}>{text}</span>
      {k > 0.001 ? (
        <span
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            color: lit,
            opacity: k,
            textShadow: glow > 0.02 ? `0 0 ${Math.round(18 * glow)}px ${alpha(lit, 0.55 * glow)}` : undefined,
          }}
        >
          {text}
        </span>
      ) : null}
    </span>
  );
}

/** The «?» badge at a chip's top-right corner. */
function Ask({ size, k }: { size: number; k: number }) {
  if (k <= 0.001) return null;
  const d = Math.round(size * 1.02);
  return (
    <div
      style={{
        position: 'absolute',
        right: -Math.round(d * 0.38),
        top: -Math.round(d * 0.5),
        width: d,
        height: d,
        borderRadius: d / 2,
        display: 'grid',
        placeItems: 'center',
        background: C.ink700,
        border: `3px solid ${alpha(C.text, 0.75)}`,
        boxShadow: `0 6px 16px ${alpha('#000000', 0.45)}`,
        fontFamily: FONT.sans,
        fontSize: Math.round(size * 0.72),
        fontWeight: 850,
        lineHeight: 1,
        color: C.textStrong,
        opacity: Math.min(1, k * 1.4),
        transform: `scale(${0.5 + 0.5 * Math.min(1, k)})`,
      }}
    >
      ?
    </div>
  );
}

/**
 * One chip, relatively positioned (see the file comment). `split` 0 hides the
 * chip's own frame (TlsLine draws one bar around the whole line instead).
 */
export function TlsChip({
  id,
  size = 46,
  light = {},
  tones = {},
  ask = 0,
  split = 1,
  pulse = false,
  frame: frameProp,
  style,
}: {
  id: TlsChipId;
  size?: number;
  light?: Partial<Record<TlsPart, number>>;
  tones?: Partial<Record<TlsPart, Tone>>;
  ask?: number;
  split?: number;
  pulse?: boolean;
  frame?: number;
  style?: CSSProperties;
}) {
  const current = useCurrentFrame();
  const { fps } = useVideoConfig();
  const frame = frameProp ?? current;
  const g = geom(size);
  const chip = TLS_CHIPS.find((c) => c.id === id)!;
  const toneOfPart = (p: TlsPart) => toneOf(tones[p] ?? TLS_TONES[p]);
  const lit = chip.spans.filter((s) => s.part).map((s) => ({ part: s.part!, k: clamp01(light[s.part!] ?? 0) }));
  // Ties go to the later part: once AES and SHA384 are both lit, the chip takes SHA384's colour.
  const hot = lit.reduce((a, b) => (b.k >= a.k ? b : a), lit[0]);
  const k = hot.k;
  const t = toneOfPart(hot.part);
  const breathe = pulse ? 0.8 + 0.2 * pulseOf(frame, fps, 0.5) : 1;
  const glow = k * breathe;
  const s = clamp01(split);
  const whole = chip.spans.length === 1;
  return (
    <div
      style={{
        position: 'relative',
        boxSizing: 'border-box',
        height: g.chipH,
        display: 'inline-flex',
        alignItems: 'center',
        padding: `0 ${g.padX}px`,
        borderRadius: RADIUS.md,
        border: `${g.border}px solid ${alpha(k > 0.01 ? t.fg : C.ink500, s * (0.55 + 0.4 * k))}`,
        // Opaque underlay (whatever sits behind the line never shows through), plus the lit wash.
        background: `linear-gradient(${alpha(t.fg, whole ? s * 0.15 * k : 0)}, ${alpha(t.fg, whole ? s * 0.15 * k : 0)}), ${alpha(C.ink850, s * 0.98)}`,
        boxShadow: glow > 0.02 && s > 0.01 ? `0 0 ${Math.round(30 * glow)}px ${alpha(t.fg, 0.32 * glow * s)}` : undefined,
        fontFamily: FONT.mono,
        fontSize: size,
        fontWeight: 750,
        lineHeight: `${g.lineH}px`,
        whiteSpace: 'pre',
        ...style,
      }}
    >
      {chip.spans.map((sp, i) => {
        if (!sp.part) return <LitText key={i} text={sp.text} k={0} lit={C.muted} glow={0} />;
        const pk = clamp01(light[sp.part] ?? 0);
        const pt = toneOfPart(sp.part);
        const pg = pk * breathe;
        return (
          <span key={i} style={{ position: 'relative', display: 'inline-block' }}>
            {/* A sub-part of the suite chip gets its own wash and underline, so it is clear which half is lit. */}
            {!whole && pk > 0.001 ? (
              <>
                <span
                  style={{
                    position: 'absolute',
                    left: -4,
                    right: -4,
                    top: Math.round(g.lineH * 0.04),
                    bottom: Math.round(g.lineH * 0.04),
                    borderRadius: 8,
                    background: alpha(pt.fg, 0.16 * pk),
                  }}
                />
                <span style={{ position: 'absolute', left: 0, right: 0, bottom: -Math.round(g.padY * 0.55), height: 4, borderRadius: 2, background: alpha(pt.fg, pk) }} />
              </>
            ) : null}
            <LitText text={sp.text} k={pk} lit={pt.soft} glow={pg} />
          </span>
        );
      })}
      <Ask size={size} k={ask} />
    </div>
  );
}

/** «La línea» (see the file comment). Not positioned. */
export function TlsLine({
  size = 46,
  split = 1,
  ask = 0,
  light = {},
  tones = {},
  prefix,
  verify,
  pulse = false,
  frame: frameProp,
  style,
  children,
}: {
  size?: number;
  split?: number;
  ask?: number | Partial<Record<TlsChipId, number>>;
  light?: Partial<Record<TlsPart, number>>;
  tones?: Partial<Record<TlsPart, Tone>>;
  /** 0–1 opacity of «SSL connection using»; omitted, no row is reserved. */
  prefix?: number;
  /** 0–1 opacity of «SSL certificate verify ok»; omitted, no row is reserved. */
  verify?: number;
  pulse?: boolean;
  frame?: number;
  style?: CSSProperties;
  /** Drawn on top, in the line's coordinates (e.g. connectors anchored with tlsPartRect). */
  children?: ReactNode;
}) {
  const current = useCurrentFrame();
  const frame = frameProp ?? current;
  const g = geom(size);
  const L = tlsLayout({ size, prefix: prefix !== undefined, verify: verify !== undefined });
  const s = clamp01(split);
  const askOf = (id: TlsChipId) => (typeof ask === 'number' ? ask : ask[id] ?? 0);
  const order = TLS_CHIPS.map((c) => c.id);
  const verifyLit = clamp01(light.eckey ?? 0);
  return (
    <div style={{ position: 'relative', width: L.width, height: L.height, ...style }}>
      {/* The one continuous bar (split 0), prefix row included, fading as the chips come apart. */}
      {s < 0.999 ? (
        <div
          style={{
            position: 'absolute',
            left: -6,
            top: -6,
            width: L.width + 12,
            height: L.rowY + L.chipH + 12,
            boxSizing: 'border-box',
            borderRadius: RADIUS.md + 4,
            border: `${g.border}px solid ${alpha(C.ink500, 0.9 * (1 - s))}`,
            background: alpha(C.ink850, 0.98 * (1 - s)),
            boxShadow: s < 0.5 ? `0 24px 60px ${alpha('#000000', 0.45 * (1 - 2 * s))}` : undefined,
          }}
        />
      ) : null}

      {/* «SSL connection using», over the bar. */}
      {prefix !== undefined && prefix > 0.001 ? (
        <div
          style={{
            position: 'absolute',
            left: g.padX,
            top: 2,
            fontFamily: FONT.mono,
            fontSize: g.prefixSize,
            fontWeight: 650,
            color: C.text,
            whiteSpace: 'pre',
            opacity: 0.85 * clamp01(prefix),
          }}
        >
          {TLS_PREFIX}
        </div>
      ) : null}

      {order.map((id, i) => {
        const r = L.chips[id];
        const next = order[i + 1];
        return (
          <div key={id}>
            <div style={{ position: 'absolute', left: r.x, top: r.y }}>
              <TlsChip id={id} size={size} light={light} tones={tones} ask={askOf(id)} split={s} pulse={pulse} frame={frame} />
            </div>
            {next ? (
              <div
                style={{
                  position: 'absolute',
                  left: r.x + r.width,
                  top: r.y,
                  width: g.gap,
                  height: r.height,
                  display: 'grid',
                  placeItems: 'center',
                  fontFamily: FONT.mono,
                  fontSize: size,
                  fontWeight: 600,
                  color: C.faint,
                  opacity: 0.9 - 0.35 * s,
                }}
              >
                /
              </div>
            ) : null}
          </div>
        );
      })}

      {verify !== undefined && L.verify && verify > 0.001 ? (
        <div
          style={{
            position: 'absolute',
            left: L.verify.x,
            top: L.verify.y,
            width: L.verify.width,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 10,
            fontFamily: FONT.mono,
            fontSize: g.verifySize,
            fontWeight: 650,
            whiteSpace: 'pre',
            opacity: clamp01(verify),
          }}
        >
          <Icon name="check" size={Math.round(g.verifySize * 1.05)} color={verifyLit > 0.5 ? C.emerald : C.faint} strokeWidth={2.4} />
          <span style={{ color: mixColor(verifyLit) }}>{TLS_VERIFY_OK}</span>
        </div>
      ) : null}

      {children}
    </div>
  );
}

/** Half-lit grey to emerald for the verify line (two stops are enough at its size). */
function mixColor(k: number): string {
  return k > 0.5 ? alpha('#6ee7b7', mix(0.7, 1, k)) : alpha(C.muted, mix(0.75, 0.85, k));
}

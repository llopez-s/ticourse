import type { ReactNode } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../../../engine/src/theme/motion';
import { Icon, clamp01 } from '../../../../../engine/src/ui';
import { CURL } from '../../../data/s01-hook';

/**
 * s01's console: «prueba de conexión · desde fuera, como una naviera», the
 * typed `curl -v`, the five handshake messages in grey, curl's own SSL line
 * (curl's order, half-lit until it glows) and the three certificate lines,
 * half-lit and never read. Not positioned. Rows sit at fixed offsets from the
 * content top (`ROWS`), so the scene can move the box's top edge (the header
 * travels with it and covers the first rows) without moving the text.
 */

export const CONSOLE = { width: 1560, headerH: 64, padX: 30 } as const;

const CMD_H = 54;
const OUT_H = 38;
const SSL_H = 46;
const GAP = 10;

/** Row offsets from the content top. */
export const ROWS = (() => {
  const handshake = CURL.handshake.map((_, i) => CMD_H + GAP + i * OUT_H);
  const ssl = CMD_H + GAP + CURL.handshake.length * OUT_H + 4;
  const cert = CURL.cert.map((_, i) => ssl + SSL_H + 4 + i * OUT_H);
  return { cmd: 0, handshake, ssl, cert, height: cert[cert.length - 1] + OUT_H };
})();

export interface PrintTimes {
  /** Typing of the command starts. */
  typeAt: number;
  /** Frames to type the whole command. */
  typeFrames: number;
  handshake: number[];
  ssl: number;
  cert: number[];
}

/** Lays the printing out between `from` and `until` (local frames), compressing it if the voice is quick. */
export function printTimes(from: number, until: number): PrintTimes {
  const span = Math.max(30, until - from);
  const typeFrames = Math.round(Math.min(34, span * 0.36));
  const rest = span - typeFrames - 6;
  const n = CURL.handshake.length + 1 + CURL.cert.length;
  const step = Math.max(2, Math.min(5, Math.floor(rest / n)));
  const start = from + typeFrames + 6;
  const handshake = CURL.handshake.map((_, i) => start + i * step);
  const ssl = start + CURL.handshake.length * step + 2;
  const cert = CURL.cert.map((_, i) => ssl + (i + 1) * step + 2);
  return { typeAt: from, typeFrames, handshake, ssl, cert };
}

function Row({ y, at, frame, children, opacity = 1 }: { y: number; at: number; frame: number; children: ReactNode; opacity?: number }) {
  const p = progress(frame, at, 4, EASE.out);
  if (p <= 0) return null;
  return (
    <div style={{ position: 'absolute', left: CONSOLE.padX, top: y, opacity: p * opacity, whiteSpace: 'pre', transform: `translateY(${(1 - p) * 6}px)` }}>
      {children}
    </div>
  );
}

export function CurlConsole({
  height,
  contentY,
  frame,
  times,
  sslGlow = 0,
  textureDim = 0,
  right,
}: {
  /** Box height (the box is CONSOLE.width wide). */
  height: number;
  /** Content top relative to the box top (rows above `headerH` hide under the header). */
  contentY: number;
  frame: number;
  times: PrintTimes;
  /** 0–1: curl's SSL line glows (it is the one that stays). */
  sslGlow?: number;
  /** 0–1: the command and handshake rows step back. */
  textureDim?: number;
  /** Anything for the title bar's right slot. */
  right?: ReactNode;
}) {
  const typed = Math.max(0, Math.min(CURL.cmd.length, Math.floor(((frame - times.typeAt) / Math.max(1, times.typeFrames)) * CURL.cmd.length)));
  const typing = frame >= times.typeAt - 8 && typed < CURL.cmd.length;
  const g = clamp01(sslGlow);
  // The handshake goes almost dark under the lifted line; the command stays as context.
  const tex = 1 - 0.88 * clamp01(textureDim);
  const cmdTex = 1 - 0.4 * clamp01(textureDim);
  return (
    <div
      style={{
        position: 'relative',
        width: CONSOLE.width,
        height,
        boxSizing: 'border-box',
        borderRadius: RADIUS.lg,
        border: `2px solid ${C.ink700}`,
        background: `linear-gradient(180deg, ${alpha(C.ink850, 0.97)} 0%, ${alpha(C.ink900, 0.97)} 100%)`,
        boxShadow: `0 30px 70px ${alpha('#000000', 0.42)}, inset 0 1px 0 ${alpha('#ffffff', 0.04)}`,
        overflow: 'hidden',
        fontFamily: FONT.mono,
      }}
    >
      {/* Content */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: contentY, height: ROWS.height }}>
        {/* The command */}
        <div style={{ position: 'absolute', left: CONSOLE.padX, top: ROWS.cmd, height: CMD_H, display: 'flex', alignItems: 'center', fontSize: 34, fontWeight: 700, whiteSpace: 'pre', opacity: cmdTex }}>
          <span style={{ color: C.emerald }}>$ </span>
          <span style={{ color: C.textStrong }}>{CURL.cmd.slice(0, typed)}</span>
          {typing ? <span style={{ display: 'inline-block', width: 18, height: 36, marginLeft: 2, background: alpha(C.textStrong, 0.85) }} /> : null}
        </div>
        {/* The handshake, grey */}
        {CURL.handshake.map((l, i) => (
          <Row key={l} y={ROWS.handshake[i]} at={times.handshake[i]} frame={frame} opacity={tex}>
            <span style={{ fontSize: 26, fontWeight: 500, color: C.faint }}>{l}</span>
          </Row>
        ))}
        {/* curl's SSL line: the one that stays */}
        <Row y={ROWS.ssl} at={times.ssl} frame={frame}>
          <div
            style={{
              position: 'relative',
              left: -12,
              padding: '2px 12px',
              borderRadius: 10,
              border: `2px solid ${alpha(C.cyan, 0.85 * g)}`,
              background: alpha(C.cyan, 0.1 * g),
              boxShadow: g > 0.02 ? `0 0 ${Math.round(26 * g)}px ${alpha(C.cyan, 0.3 * g)}` : undefined,
              fontSize: 28,
              fontWeight: 650,
              color: g > 0.5 ? C.cyanSoft : C.muted,
            }}
          >
            {CURL.ssl}
          </div>
        </Row>
        {/* The certificate, half-lit and never read */}
        {CURL.cert.map((l, i) => (
          <Row key={l} y={ROWS.cert[i]} at={times.cert[i]} frame={frame} opacity={0.62}>
            <span style={{ fontSize: 26, fontWeight: 500, color: C.muted }}>{l}</span>
          </Row>
        ))}
      </div>

      {/* Title bar (on top of the content, which scrolls under it) */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          height: CONSOLE.headerH,
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          padding: `0 ${CONSOLE.padX - 6}px`,
          background: C.ink800,
          borderBottom: `2px solid ${C.ink700}`,
          fontFamily: FONT.sans,
          whiteSpace: 'nowrap',
        }}
      >
        <Icon name="terminal" size={34} color={C.cyan} />
        <span style={{ fontSize: 32, fontWeight: 750, color: C.textStrong }}>{CURL.title}</span>
        <span style={{ flex: 1 }} />
        {right}
      </div>
    </div>
  );
}

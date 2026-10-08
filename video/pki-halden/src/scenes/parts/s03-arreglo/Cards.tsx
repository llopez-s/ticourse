import type { ReactNode } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { Icon, clamp01 } from '../../../../../engine/src/ui';
import { CaSeal } from '../CaSeal';

/**
 * s03's smaller pieces: the man in the middle's blank certificate, the two files the CA hands over, the
 * root card (Subject = Issuer, sealed by its own owner), the 09:10 strip and the shipping company's padlock
 * on the road. Not positioned; 0–1 states; nothing reads the timeline.
 */

/** The blank certificate the shadow holds up: amber dashed outline, folded corner, no text, no seal. Aspect 100×128. */
export function BlankCert({ width, show = 1, tilt = 0 }: { width: number; show?: number; tilt?: number }) {
  const s = clamp01(show);
  if (s <= 0.001) return null;
  const h = (width * 128) / 100;
  return (
    <svg
      width={width}
      height={h}
      viewBox="0 0 100 128"
      style={{ display: 'block', overflow: 'visible', opacity: s, transform: `translateY(${(1 - s) * 16}px) rotate(${tilt}deg)` }}
    >
      <path d="M 6 4 L 74 4 L 94 24 L 94 124 L 6 124 Z" fill={alpha(C.ink900, 0.96)} stroke={C.amber} strokeWidth={3.2} strokeDasharray="8 6" strokeLinejoin="round" />
      <path d="M 74 4 L 74 24 L 94 24" fill="none" stroke={alpha(C.amber, 0.8)} strokeWidth={2.4} strokeLinejoin="round" />
    </svg>
  );
}

/** A document with a folded corner (180 wide), its glyph and its label under it. `absent` 0–1 turns it into a dashed, dim outline. */
export function FileCard({
  kind,
  label,
  tone,
  show = 1,
  absent = 0,
  glow = 0,
  width = 160,
  labelSize = 36,
}: {
  kind: 'cert' | 'chain';
  label: string;
  tone: string;
  show?: number;
  absent?: number;
  glow?: number;
  width?: number;
  labelSize?: number;
}) {
  const s = clamp01(show);
  if (s <= 0.001) return null;
  const a = clamp01(absent);
  const g = clamp01(glow);
  const h = width * 1.25;
  const edge = a > 0.5 ? '#94a3b8' : tone;
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 14,
        opacity: s * (1 - 0.55 * a),
        transform: `translateY(${(1 - s) * 18}px)`,
        fontFamily: FONT.sans,
      }}
    >
      <div style={{ position: 'relative', width, height: h }}>
        <svg width={width} height={h} viewBox="0 0 100 125" style={{ display: 'block', overflow: 'visible', filter: g > 0.01 ? `drop-shadow(0 0 ${Math.round(18 * g)}px ${alpha(tone, 0.6 * g)})` : undefined }}>
          <path
            d="M 6 4 L 72 4 L 94 26 L 94 121 L 6 121 Z"
            fill={a > 0.5 ? alpha(C.ink900, 0.6) : `${alpha(tone, 0.1)}`}
            stroke={edge}
            strokeWidth={3}
            strokeDasharray={a > 0.5 ? '8 6' : undefined}
            strokeLinejoin="round"
          />
          <path d="M 72 4 L 72 26 L 94 26" fill="none" stroke={alpha(edge, 0.8)} strokeWidth={2.4} strokeLinejoin="round" />
          {/* Text lines (texture, no words) */}
          {[38, 50, 62].map((y, i) => (
            <rect key={y} x={16} y={y} width={i === 2 ? 40 : 62} height={5} rx={2.5} fill={alpha(edge, 0.45)} />
          ))}
          {kind === 'chain' ? (
            // Two links: the chain file carries the intermediate
            <g fill="none" stroke={edge} strokeWidth={4.5}>
              <ellipse cx={40} cy={94} rx={9} ry={14} />
              <ellipse cx={56} cy={94} rx={9} ry={14} transform="rotate(90 56 94)" />
            </g>
          ) : null}
        </svg>
        {kind === 'cert' ? (
          // The certificate carries the CA's seal
          <div style={{ position: 'absolute', left: width * 0.3, top: h * 0.62, opacity: 1 - 0.6 * a }}>
            <CaSeal size={width * 0.36} />
          </div>
        ) : null}
      </div>
      <div style={{ fontSize: labelSize, fontWeight: 800, color: a > 0.5 ? C.muted : C.textStrong, whiteSpace: 'nowrap' }}>{label}</div>
    </div>
  );
}

/** The root, enlarged: Subject and Issuer the same, the CA's own seal pressed on it. */
export function RootCard({
  width,
  subject,
  issuer,
  verdict,
  show = 1,
  verdictIn = 0,
  seal = 0,
  sameMark = 0,
}: {
  width: number;
  subject: { label: string; value: string };
  issuer: { label: string; value: string };
  verdict: { same: string; self: string };
  show?: number;
  verdictIn?: number;
  /** 0–1: the seal presses on. */
  seal?: number;
  /** 0–1: the two values light up together (Subject = Issuer). */
  sameMark?: number;
}) {
  const s = clamp01(show);
  if (s <= 0.001) return null;
  const v = clamp01(verdictIn);
  const m = clamp01(sameMark);
  const valueColour = m > 0.01 ? '#7dd3fc' : C.text;
  const field = (f: { label: string; value: string }) => (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontFamily: FONT.mono, fontSize: 24, fontWeight: 700, color: '#c4b5fd' }}>{f.label}</div>
      <div
        style={{
          display: 'inline-block',
          marginTop: 2,
          padding: '2px 8px',
          marginLeft: -8,
          borderRadius: 8,
          background: alpha(C.sky, 0.12 * m),
          border: `2px solid ${alpha(C.sky, 0.6 * m)}`,
          fontFamily: FONT.mono,
          fontSize: 26,
          fontWeight: 700,
          color: valueColour,
          whiteSpace: 'nowrap',
        }}
      >
        {f.value}
      </div>
    </div>
  );
  const sealSize = Math.round(width * 0.22);
  return (
    <div
      style={{
        position: 'relative',
        width,
        boxSizing: 'border-box',
        padding: '22px 28px 22px',
        borderRadius: RADIUS.lg,
        border: `3px solid ${alpha(C.sky, 0.75)}`,
        background: `linear-gradient(180deg, ${alpha(C.sky, 0.1)} 0%, ${alpha(C.ink900, 0.98)} 70%)`,
        boxShadow: `0 0 34px ${alpha(C.sky, 0.18)}, 0 24px 50px ${alpha('#000000', 0.5)}`,
        fontFamily: FONT.sans,
      }}
    >
      {field(subject)}
      {field(issuer)}
      <div style={{ height: 2, background: alpha(C.sky, 0.35), margin: '6px 0 12px', width: width - 56 - sealSize * 0.6 }} />
      <div style={{ opacity: v, transform: `translateY(${(1 - v) * 8}px)`, paddingRight: sealSize * 0.7 }}>
        <div style={{ fontFamily: FONT.mono, fontSize: 30, fontWeight: 800, color: '#7dd3fc', whiteSpace: 'nowrap' }}>{verdict.same}</div>
        <div style={{ fontSize: 32, fontWeight: 800, color: C.textStrong, whiteSpace: 'nowrap', marginTop: 4 }}>{verdict.self}</div>
      </div>
      {seal > 0.001 ? (
        <div style={{ position: 'absolute', right: 18, bottom: 18 }}>
          <CaSeal size={sealSize} press={seal} glow={0.4} />
        </div>
      ) : null}
    </div>
  );
}

/** The strip over the console: «09:10 · Infraestructura instala la intermedia» (Halden time). */
export function Strip({ time, what, show = 1, size = 34 }: { time: string; what: ReactNode; show?: number; size?: number }) {
  const s = clamp01(show);
  if (s <= 0.001) return null;
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 16,
        height: Math.round(size * 1.6),
        padding: '0 26px 0 18px',
        boxSizing: 'border-box',
        borderRadius: RADIUS.md,
        border: `2px solid ${alpha(C.cyan, 0.7)}`,
        background: alpha(C.cyan, 0.1),
        fontFamily: FONT.sans,
        whiteSpace: 'nowrap',
        opacity: s,
        transform: `translateY(${(1 - s) * -10}px)`,
      }}
    >
      <Icon name="clock" size={Math.round(size * 0.95)} color={C.cyan} />
      <span style={{ fontFamily: FONT.mono, fontSize: size, fontWeight: 800, color: C.cyanSoft }}>{time}</span>
      <span style={{ fontSize: size * 0.94, fontWeight: 700, color: C.faint }}>·</span>
      <span style={{ fontSize: size * 0.94, fontWeight: 750, color: C.textStrong }}>{what}</span>
    </div>
  );
}

/** The shipping company's encrypted traffic: an emerald padlock in a ring. */
export function LockToken({ size = 64, show = 1, tone = C.emerald, open = false }: { size?: number; show?: number; tone?: string; open?: boolean }) {
  const s = clamp01(show);
  if (s <= 0.001) return null;
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: RADIUS.pill,
        display: 'grid',
        placeItems: 'center',
        background: alpha(C.ink950, 0.92),
        border: `3px solid ${alpha(tone, 0.85)}`,
        boxShadow: `0 0 22px ${alpha(tone, 0.45)}`,
        opacity: s,
      }}
    >
      <Icon name={open ? 'unlock' : 'lock'} size={Math.round(size * 0.58)} color={tone} strokeWidth={2.4} />
    </div>
  );
}

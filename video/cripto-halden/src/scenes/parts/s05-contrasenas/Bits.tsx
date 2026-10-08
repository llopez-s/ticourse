import type { ReactNode } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { clamp01, dimStyle } from '../../../../../engine/src/ui';
import { FingerprintGlyph, FingerprintMachine, RoundsGlyph, SaltGrain, machineAnchors } from '../Fingerprint';
import { CrossBadge } from '../s04-huella/marks';

/**
 * s05's smaller pieces: the two trick cards (told in plain words, no names), the two neutral
 * buttons they become for the think prompt, the catalog of precomputed fingerprints (struck),
 * the two clocks, and the closing summary. Not positioned; 0–1 states.
 */

export const TRICK_W = 800;
export const TRICK_H = 420;

/** One trick, as a card: an illustration of the machine (salt hopper, or the rounds loop) and two lines. */
export function TrickCard({ kind, lines, show, frame, dim = 0 }: { kind: 'salt' | 'rounds'; lines: readonly string[]; show: number; frame: number; dim?: number }) {
  const s = clamp01(show);
  if (s <= 0.001) return null;
  const mw = 300;
  const ma = machineAnchors(mw);
  return (
    <div
      style={{
        position: 'relative',
        width: TRICK_W,
        height: TRICK_H,
        boxSizing: 'border-box',
        borderRadius: RADIUS.lg,
        border: `3px solid ${alpha(C.cyan, 0.5)}`,
        background: `linear-gradient(180deg, ${alpha(C.ink800, 0.96)} 0%, ${alpha(C.ink900, 0.98)} 100%)`,
        fontFamily: FONT.sans,
        transform: `translateY(${(1 - s) * 22}px)`,
        ...dimStyle(dim, s),
      }}
    >
      <div style={{ position: 'absolute', left: (TRICK_W - mw) / 2, top: kind === 'salt' ? 78 : 30 }}>
        <FingerprintMachine
          width={mw}
          label={null}
          run={0.8}
          frame={frame}
          salt={kind === 'salt' ? clamp01((s - 0.2) / 0.8) : 0}
          rounds={kind === 'rounds' ? clamp01((s - 0.1) / 0.9) : 0}
          count={10000}
        />
      </div>
      {/* Keep the illustration's own height in mind: the text sits under it */}
      <div style={{ position: 'absolute', left: 0, width: TRICK_W, top: kind === 'salt' ? 78 + ma.h + 26 : 30 + ma.h * 1.42 + 34, textAlign: 'center' }}>
        {lines.map((l) => (
          <div key={l} style={{ fontSize: 36, fontWeight: 780, color: C.textStrong, whiteSpace: 'nowrap', lineHeight: 1.25 }}>
            {l}
          </div>
        ))}
      </div>
    </div>
  );
}

/** A neutral button with the trick's icon (the think prompt's two options). */
export function TrickButton({ kind, label, show, state = 0, glow = 0 }: { kind: 'salt' | 'rounds'; label: string; show: number; state?: number; glow?: number }) {
  const s = clamp01(show);
  if (s <= 0.001) return null;
  // state: 0 neutral, 1 = chosen (emerald), −1 = stepped back.
  const chosen = Math.max(0, state);
  const back = Math.max(0, -state);
  const edge = chosen > 0.01 ? C.emerald : C.ink500;
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 16,
        padding: '12px 30px 12px 20px',
        borderRadius: RADIUS.pill,
        border: `3px solid ${alpha(edge, 0.7 + 0.3 * chosen)}`,
        background: chosen > 0.01 ? `linear-gradient(180deg, ${alpha(C.emerald, 0.22 * chosen)} 0%, ${C.ink900} 100%)` : C.ink900,
        boxShadow: `0 0 ${Math.round(10 + 24 * Math.max(glow, chosen))}px ${alpha(chosen > 0.01 ? C.emerald : C.muted, 0.12 + 0.3 * Math.max(glow, chosen))}`,
        fontFamily: FONT.sans,
        fontSize: 38,
        fontWeight: 800,
        color: C.textStrong,
        whiteSpace: 'nowrap',
        transform: `translateY(${(1 - s) * 14}px) scale(${1 + 0.06 * chosen})`,
        ...dimStyle(back, s),
      }}
    >
      {kind === 'salt' ? <SaltGrain size={50} tone={chosen > 0.01 ? C.emerald : C.text} /> : <RoundsGlyph size={50} tone={chosen > 0.01 ? C.emerald : C.text} />}
      {label}
    </div>
  );
}

export const CATALOG_W = 470;
export const CATALOG_H = 300;

/** The catalog of fingerprints computed in advance: an open book of rows (texture), struck at `strike`. */
export function Catalog({ title, show, strike }: { title: string; show: number; strike: number }) {
  const s = clamp01(show);
  if (s <= 0.001) return null;
  const k = clamp01(strike);
  const page = (x: number) => (
    <g transform={`translate(${x} 0)`}>
      {Array.from({ length: 6 }, (_, i) => (
        <g key={i} transform={`translate(18 ${22 + i * 26})`}>
          <rect width={60} height={9} rx={4.5} fill={alpha(C.muted, 0.6)} />
          <rect x={74} width={90} height={9} rx={4.5} fill={alpha(C.cyan, 0.45)} />
        </g>
      ))}
    </g>
  );
  return (
    <div
      style={{
        position: 'relative',
        width: CATALOG_W,
        height: CATALOG_H,
        boxSizing: 'border-box',
        padding: '16px 22px',
        borderRadius: RADIUS.lg,
        border: `3px solid ${alpha(k > 0.5 ? C.amber : C.ink500, 0.7)}`,
        background: alpha(C.ink900, 0.96),
        fontFamily: FONT.sans,
        opacity: s,
        transform: `translateY(${(1 - s) * 16}px)`,
      }}
    >
      <div style={{ fontSize: 34, fontWeight: 800, color: k > 0.5 ? C.muted : C.textStrong, whiteSpace: 'nowrap', textAlign: 'center' }}>{title}</div>
      <svg width={CATALOG_W - 44} height={190} style={{ display: 'block', marginTop: 12, overflow: 'visible', opacity: 1 - 0.45 * k }}>
        {/* Open book */}
        <path d={`M 4 6 Q ${(CATALOG_W - 44) / 4} -4 ${(CATALOG_W - 44) / 2} 10 Q ${((CATALOG_W - 44) * 3) / 4} -4 ${CATALOG_W - 48} 6 L ${CATALOG_W - 48} 182 Q ${((CATALOG_W - 44) * 3) / 4} 172 ${(CATALOG_W - 44) / 2} 186 Q ${(CATALOG_W - 44) / 4} 172 4 182 Z`} fill={C.ink800} stroke={alpha(C.text, 0.5)} strokeWidth={3} />
        <line x1={(CATALOG_W - 44) / 2} y1={10} x2={(CATALOG_W - 44) / 2} y2={186} stroke={alpha(C.text, 0.4)} strokeWidth={2.5} />
        {page(0)}
        {page((CATALOG_W - 44) / 2)}
      </svg>
      {/* The strike: two amber bars across, and a cross */}
      {k > 0.001 ? (
        <>
          <svg width={CATALOG_W} height={CATALOG_H} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
            <line x1={30} y1={CATALOG_H - 30} x2={30 + (CATALOG_W - 60) * clamp01(k * 2)} y2={CATALOG_H - 30 - (CATALOG_H - 60) * clamp01(k * 2)} stroke={C.amber} strokeWidth={8} strokeLinecap="round" />
          </svg>
          <div style={{ position: 'absolute', right: -22, top: -22 }}>
            <CrossBadge size={64} p={clamp01((k - 0.4) / 0.6)} tone={C.amber} />
          </div>
        </>
      ) : null}
    </div>
  );
}

export const CLOCK_W = 540;
export const CLOCK_H = 300;

/** A clock and what it means: the hand sweeps `sweep` turns. `wall` adds a brick wall (the attacker's side). */
export function ClockCard({ who, what, tone, show, sweep, wall = false, glow = 0 }: { who: string; what: string; tone: string; show: number; sweep: number; wall?: boolean; glow?: number }) {
  const s = clamp01(show);
  if (s <= 0.001) return null;
  const r = 70;
  const ang = sweep * 360;
  return (
    <div
      style={{
        position: 'relative',
        width: CLOCK_W,
        height: CLOCK_H,
        boxSizing: 'border-box',
        borderRadius: RADIUS.lg,
        border: `3px solid ${alpha(tone, 0.65)}`,
        background: `linear-gradient(180deg, ${alpha(tone, 0.1)} 0%, ${alpha(C.ink900, 0.97)} 100%)`,
        boxShadow: `0 0 ${Math.round(16 + 24 * glow)}px ${alpha(tone, 0.14 + 0.25 * glow)}`,
        fontFamily: FONT.sans,
        opacity: s,
        transform: `translateY(${(1 - s) * 18}px)`,
      }}
    >
      <svg width={2 * r + 20} height={2 * r + 20} style={{ position: 'absolute', left: 24, top: 22, overflow: 'visible' }}>
        <g transform={`translate(${r + 10} ${r + 10})`}>
          <circle r={r} fill={C.ink950} stroke={tone} strokeWidth={5} />
          {Array.from({ length: 12 }, (_, i) => {
            const a = (i * 30 * Math.PI) / 180;
            return <line key={i} x1={Math.cos(a) * (r - 10)} y1={Math.sin(a) * (r - 10)} x2={Math.cos(a) * (r - 18)} y2={Math.sin(a) * (r - 18)} stroke={alpha(C.text, 0.6)} strokeWidth={3} />;
          })}
          {/* The sweep so far */}
          {sweep > 0.002 ? (
            <path
              d={`M 0 0 L 0 ${-(r - 6)} A ${r - 6} ${r - 6} 0 ${(ang % 360) > 180 || sweep >= 1 ? 1 : 0} 1 ${Math.sin((Math.min(ang, 359.9) * Math.PI) / 180) * (r - 6)} ${-Math.cos((Math.min(ang, 359.9) * Math.PI) / 180) * (r - 6)} Z`}
              fill={alpha(tone, 0.28)}
            />
          ) : null}
          <line x1={0} y1={0} x2={Math.sin((ang * Math.PI) / 180) * (r - 14)} y2={-Math.cos((ang * Math.PI) / 180) * (r - 14)} stroke={C.textStrong} strokeWidth={5} strokeLinecap="round" />
          <circle r={7} fill={tone} />
        </g>
      </svg>
      {wall ? (
        <svg width={120} height={84} style={{ position: 'absolute', right: 24, top: 30 }}>
          {[0, 1, 2, 3].map((row) =>
            [0, 1, 2].map((c) => (
              <rect key={`${row}${c}`} x={(row % 2 ? -20 : 0) + c * 42 + 2} y={row * 21 + 1} width={38} height={18} rx={3} fill={alpha(C.amber, 0.3)} stroke={C.amber} strokeWidth={2} />
            )),
          )}
        </svg>
      ) : null}
      <div style={{ position: 'absolute', left: 28, right: 20, bottom: 24 }}>
        <div style={{ fontSize: 32, fontWeight: 700, color: C.text, whiteSpace: 'nowrap' }}>{who}</div>
        <div style={{ fontSize: 40, fontWeight: 850, color: C.textStrong, whiteSpace: 'nowrap' }}>{what}</div>
      </div>
    </div>
  );
}

/** One item of the closing summary: an icon over a short line. */
export function WrapItem({ icon, label, show }: { icon: ReactNode; label: string; show: number }) {
  const s = clamp01(show);
  if (s <= 0.001) return null;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, opacity: s, transform: `translateY(${(1 - s) * 16}px)`, fontFamily: FONT.sans }}>
      <div
        style={{
          width: 128,
          height: 128,
          borderRadius: 64,
          display: 'grid',
          placeItems: 'center',
          border: `3px solid ${alpha(C.emerald, 0.7)}`,
          background: alpha(C.emerald, 0.1),
          boxShadow: `0 0 26px ${alpha(C.emerald, 0.22)}`,
        }}
      >
        {icon}
      </div>
      <div style={{ fontSize: 46, fontWeight: 850, color: C.textStrong, whiteSpace: 'nowrap' }}>{label}</div>
    </div>
  );
}

export { FingerprintGlyph };

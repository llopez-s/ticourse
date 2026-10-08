import type { CSSProperties, ReactNode } from 'react';
import { C, FONT, alpha } from '../../../../../engine/src/theme/tokens';
import { clamp01, mix } from '../../../../../engine/src/ui';
import { AXES, IPS } from '../../../data/s09-camara';
import { Checkpoint } from '../Checkpoint';
import { FenceCamera } from './FenceCamera';

/**
 * s09-03 «Hazte dos preguntas»: two crossed axes. Horizontal = dónde está
 * (INLINE · el tráfico lo atraviesa — TAP · recibe una copia); vertical = qué
 * puede hacer (ACTIVE · corta, bloquea, reescribe — PASSIVE · mira, registra,
 * avisa). The four quadrants are tiles: INLINE × ACTIVE holds the staffed
 * checkpoint (it stops), TAP × PASSIVE the fence camera (it sees), TAP ×
 * ACTIVE the «IPS» on a mirror port with its name struck through, INLINE ×
 * PASSIVE stays empty. Exam names violet. Local px AXES_W × AXES_H.
 */

export const AXES_W = 920;
export const AXES_H = 660;

const CX = 460;
const CY = 330;
const H0 = 240;
const H1 = 680;
const V0 = 104;
const V1 = 556;
const GAP = 12;
const EXAM = '#c4b5fd';

export type Quadrant = 'tl' | 'tr' | 'bl' | 'br';

const TILE: Record<Quadrant, { x: number; y: number; w: number; h: number }> = {
  tl: { x: H0, y: V0 + 4, w: CX - GAP - H0, h: CY - GAP - V0 - 4 },
  tr: { x: CX + GAP, y: V0 + 4, w: H1 - CX - GAP, h: CY - GAP - V0 - 4 },
  bl: { x: H0, y: CY + GAP, w: CX - GAP - H0, h: V1 - 4 - CY - GAP },
  br: { x: CX + GAP, y: CY + GAP, w: H1 - CX - GAP, h: V1 - 4 - CY - GAP },
};

/** A quadrant's box in AXES-local px. */
export function axesTile(q: Quadrant) {
  return TILE[q];
}

function Tile({ q, show, lit = 0, color = C.cyan, dim = 0, children }: { q: Quadrant; show: number; lit?: number; color?: string; dim?: number; children?: ReactNode }) {
  const t = TILE[q];
  const s = clamp01(show);
  const l = clamp01(lit);
  if (s <= 0) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: t.x,
        top: t.y,
        width: t.w,
        height: t.h,
        boxSizing: 'border-box',
        borderRadius: 18,
        border: `${l > 0.3 ? 3 : 2}px solid ${alpha(l > 0.01 ? color : C.ink600, 0.45 + 0.5 * l)}`,
        background: `linear-gradient(180deg, ${alpha(color, 0.03 + 0.1 * l)} 0%, ${alpha(C.ink900, 0.9)} 100%)`,
        boxShadow: l > 0.01 ? `0 0 ${Math.round(36 * l)}px ${alpha(color, 0.3 * l)}` : undefined,
        display: 'grid',
        placeItems: 'center',
        opacity: s * (1 - 0.6 * clamp01(dim)),
      }}
    >
      {children}
    </div>
  );
}

function Name({ text, lit, style }: { text: string; lit: number; style?: CSSProperties }) {
  const l = clamp01(lit);
  return (
    <div
      style={{
        fontSize: 48,
        fontWeight: 900,
        letterSpacing: 1,
        lineHeight: 1.05,
        color: EXAM,
        textShadow: l > 0.01 ? `0 0 ${Math.round(24 * l)}px ${alpha(C.violet, 0.8 * l)}` : undefined,
        transform: `scale(${1 + 0.08 * l})`,
        ...style,
      }}
    >
      {text}
    </div>
  );
}

export function Axes({
  frame,
  lines,
  labels,
  questions,
  names,
  tiles,
  content,
  lit,
  dim,
  ipsStrike,
  cameraPower,
  halfInline,
}: {
  frame: number;
  /** 0–1 the two axis lines grow from the centre. */
  lines: { h: number; v: number };
  /** 0–1 the ends' labels: h = dónde está (INLINE · TAP), v = qué puede hacer (ACTIVE · PASSIVE). */
  labels: { h: number; v: number };
  /** 0–1 the two questions (dónde está · qué puede hacer), before their answers. */
  questions: { h: number; v: number };
  /** 0–1 glow per name. */
  names: { inline: number; tap: number; active: number; passive: number };
  /** 0–1 per tile outline. */
  tiles: Record<Quadrant, number>;
  /** 0–1 per tile drawing (the checkpoint, the camera, the IPS). */
  content: Record<Quadrant, number>;
  /** 0–1 per tile (lit). */
  lit: Record<Quadrant, number>;
  /** 0–1 per tile (stepped back). */
  dim: Record<Quadrant, number>;
  /** 0–1 the strike over the «IPS» name. */
  ipsStrike: number;
  /** The camera in TAP × PASSIVE (0 = switched off). */
  cameraPower: number;
  /** 0–1 a bracket over the INLINE half (failure modes are only decided there). */
  halfInline: number;
}) {
  const h = clamp01(labels.h);
  const v = clamp01(labels.v);
  const lh = clamp01(lines.h);
  const lv = clamp01(lines.v);
  const axisCol = alpha(C.muted, 0.85);
  const tlT = TILE.tl;
  const half = clamp01(halfInline);
  return (
    <div style={{ position: 'relative', width: AXES_W, height: AXES_H, fontFamily: FONT.sans }}>
      {/* INLINE half bracket (under everything) */}
      {half > 0.01 ? (
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: V0 - 8,
            width: CX + 2,
            height: V1 - V0 + 16,
            borderRadius: 24,
            border: `3px solid ${alpha(C.cyan, 0.75 * half)}`,
            background: alpha(C.cyan, 0.05 * half),
            boxShadow: `0 0 ${Math.round(40 * half)}px ${alpha(C.cyan, 0.22 * half)}`,
          }}
        />
      ) : null}

      <Tile q="tl" show={tiles.tl} lit={lit.tl} color={C.cyan} dim={dim.tl}>
        <div style={{ opacity: clamp01(content.tl), transform: `scale(${0.9 + 0.1 * clamp01(content.tl)})` }}>
          <Checkpoint width={Math.min(180, tlT.w - 26)} fence={false} state="powered" glow={0.5 * clamp01(lit.tl)} frame={frame} />
        </div>
      </Tile>
      <Tile q="br" show={tiles.br} lit={lit.br} color={cameraPower > 0.5 ? C.amber : C.rose} dim={dim.br}>
        <div style={{ transform: `translate(34px, -14px) scale(${0.9 + 0.1 * clamp01(content.br)})`, opacity: clamp01(content.br) }}>
          <FenceCamera width={150} aim={40} coneLength={190} coneSpread={22} power={cameraPower} frame={frame} />
        </div>
      </Tile>
      <Tile q="tr" show={tiles.tr} lit={lit.tr} color={C.rose} dim={dim.tr}>
        <IpsOnMirror show={content.tr} strike={ipsStrike} />
      </Tile>
      <Tile q="bl" show={tiles.bl} lit={lit.bl} color={C.cyan} dim={dim.bl} />

      {/* the axes */}
      <svg width={AXES_W} height={AXES_H} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        <g stroke={axisCol} strokeWidth={4} strokeLinecap="round" fill="none">
          <line x1={mix(CX, H0, lh)} y1={CY} x2={mix(CX, H1, lh)} y2={CY} />
          <line x1={CX} y1={mix(CY, V0, lv)} x2={CX} y2={mix(CY, V1, lv)} />
        </g>
        <g fill={axisCol}>
          {lh > 0.95 ? (
            <>
              <path d={`M ${H0 - 6} ${CY} L ${H0 + 14} ${CY - 11} L ${H0 + 14} ${CY + 11} Z`} />
              <path d={`M ${H1 + 6} ${CY} L ${H1 - 14} ${CY - 11} L ${H1 - 14} ${CY + 11} Z`} />
            </>
          ) : null}
          {lv > 0.95 ? (
            <>
              <path d={`M ${CX} ${V0 - 6} L ${CX - 11} ${V0 + 14} L ${CX + 11} ${V0 + 14} Z`} />
              <path d={`M ${CX} ${V1 + 6} L ${CX - 11} ${V1 - 14} L ${CX + 11} ${V1 - 14} Z`} />
            </>
          ) : null}
        </g>
      </svg>

      {/* the two questions: dónde está (over INLINE) and qué puede hacer (beside the top of the vertical axis) */}
      <div style={{ position: 'absolute', right: AXES_W - H0 + 20, top: CY - 66, fontSize: 30, fontWeight: 700, fontStyle: 'italic', color: C.muted, whiteSpace: 'nowrap', opacity: clamp01(questions.h) }}>
        {AXES.where}
      </div>
      <div style={{ position: 'absolute', left: CX + 14, top: 56, fontSize: 30, fontWeight: 700, fontStyle: 'italic', color: C.muted, whiteSpace: 'nowrap', opacity: clamp01(questions.v) }}>
        {AXES.what}
      </div>

      {/* INLINE (left end) */}
      <div style={{ position: 'absolute', right: AXES_W - H0 + 20, top: CY - 25, textAlign: 'right', opacity: h, transform: `translateX(${(1 - h) * 20}px)` }}>
        <Name text={AXES.inline.name} lit={names.inline} style={{ transformOrigin: 'right center', fontSize: 46 }} />
        <div style={{ fontSize: 32, fontWeight: 650, lineHeight: 1.18, color: C.text, marginTop: 4 }}>
          {AXES.inline.desc.map((l) => (
            <div key={l}>{l}</div>
          ))}
        </div>
      </div>
      {/* TAP (right end) */}
      <div style={{ position: 'absolute', left: H1 + 20, top: CY - 25, textAlign: 'left', opacity: h, transform: `translateX(${-(1 - h) * 20}px)` }}>
        <Name text={AXES.tap.name} lit={names.tap} style={{ transformOrigin: 'left center', fontSize: 46 }} />
        <div style={{ fontSize: 32, fontWeight: 650, lineHeight: 1.18, color: C.text, marginTop: 4 }}>
          {AXES.tap.desc.map((l) => (
            <div key={l}>{l}</div>
          ))}
        </div>
      </div>
      {/* ACTIVE (top end) */}
      <div style={{ position: 'absolute', left: 0, width: AXES_W, top: 0, display: 'flex', justifyContent: 'center', opacity: v, transform: `translateY(${(1 - v) * 14}px)` }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, whiteSpace: 'nowrap' }}>
          <Name text={AXES.active.name} lit={names.active} />
          <span style={{ fontSize: 32, fontWeight: 650, color: C.text }}>{AXES.active.desc}</span>
        </div>
      </div>
      {/* PASSIVE (bottom end) */}
      <div style={{ position: 'absolute', left: 0, width: AXES_W, top: V1 + 22, display: 'flex', justifyContent: 'center', opacity: v, transform: `translateY(${-(1 - v) * 14}px)` }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, whiteSpace: 'nowrap' }}>
          <Name text={AXES.passive.name} lit={names.passive} />
          <span style={{ fontSize: 32, fontWeight: 650, color: C.text }}>{AXES.passive.desc}</span>
        </div>
      </div>
    </div>
  );
}

/** TAP × ACTIVE: an «IPS» fed by a mirror port. Its name gets struck through: on a copy it stops nothing. */
function IpsOnMirror({ show, strike }: { show: number; strike: number }) {
  const s = clamp01(show);
  const k = clamp01(strike);
  if (s <= 0) return null;
  return (
    <div style={{ position: 'relative', width: 200, height: 170, opacity: s, transform: `scale(${0.9 + 0.1 * s})` }}>
      {/* the mirror port it hangs from */}
      <svg width={200} height={170} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        <rect x={40} y={8} width={120} height={36} rx={8} fill={C.ink800} stroke={C.sky} strokeWidth={3} />
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x={54 + i * 24} y={24} width={14} height={11} rx={2} fill={i === 3 ? alpha(C.cyan, 0.6) : C.ink700} stroke={alpha(C.sky, 0.6)} strokeWidth={1.6} />
        ))}
        <line x1={133} y1={44} x2={133} y2={84} stroke={alpha(C.cyanSoft, 0.8)} strokeWidth={3} strokeDasharray="7 6" />
      </svg>
      <div
        style={{
          position: 'absolute',
          left: 46,
          top: 84,
          width: 132,
          height: 66,
          boxSizing: 'border-box',
          display: 'grid',
          placeItems: 'center',
          borderRadius: 12,
          border: `3px solid ${alpha(C.violet, 0.8)}`,
          background: alpha(C.violet, 0.12),
          fontFamily: FONT.mono,
          fontSize: 40,
          fontWeight: 800,
          color: EXAM,
        }}
      >
        {IPS.name}
        {/* the strike, drawn left to right */}
        <div
          style={{
            position: 'absolute',
            left: 12,
            top: 30,
            width: 108 * k,
            height: 5,
            borderRadius: 3,
            background: C.rose,
            boxShadow: `0 0 10px ${alpha(C.rose, 0.6)}`,
            transform: 'rotate(-8deg)',
            transformOrigin: 'left center',
          }}
        />
      </div>
    </div>
  );
}

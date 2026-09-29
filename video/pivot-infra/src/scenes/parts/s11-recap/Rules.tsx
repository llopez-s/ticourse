import type { ReactNode } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { EASE, progress, pulse, springIn } from '../../../../../engine/src/theme/motion';
import { Chip, Icon } from '../../../../../engine/src/ui';

export const RULE_W = 544;
export const RULE_GAP = (1728 - 3 * RULE_W) / 2;
export const RULE_TOP = 88;
export const RULE_H = 440;
export const LAB_TOP = 550;
export const LAB_H = 106;

export type Rule = {
  /** Two hard-broken lines (the title is 54 px, too wide for one line in the card). */
  title: [string, string];
  sub: [ReactNode, ReactNode];
  art: 'tenants' | 'key' | 'passive';
};

/** The three rules, each with the image the video used for it. */
export const RULES: Rule[] = [
  {
    title: ['Cuenta los', 'inquilinos'],
    sub: [<span style={{ color: C.amber }}>compartido contamina</span>, <span style={{ color: C.emerald }}>dedicado discrimina</span>],
    art: 'tenants',
  },
  {
    title: ['Busca lo que', 'es solo suyo'],
    sub: ['un certificado', <span style={{ color: C.emerald }}>hecho a mano</span>],
    art: 'key',
  },
  {
    title: ['Mira siempre', 'en pasivo'],
    sub: ['que el actor no sepa', <span style={{ color: C.emerald }}>que vas detrás</span>],
    art: 'passive',
  },
];

/**
 * One rule card: a dashed numbered slot until its cue, then lit (the one the
 * voice is on), then dimmed once the voice moves on (`dim` 0–1).
 */
export function RuleCard({ n, rule, frame, fps, slotAt, at, dim }: { n: number; rule: Rule; frame: number; fps: number; slotAt: number; at: number; dim: number }) {
  const slot = progress(frame, slotAt, 12);
  const p = springIn(frame, fps, at - 4, { damping: 16 });
  const lit = Math.min(1, p * 1.3);
  const hot = progress(frame, at - 4, 10) * (1 - dim);
  const glow = hot * (0.75 + 0.25 * pulse(frame, fps, 0.5));
  const left = (n - 1) * (RULE_W + RULE_GAP);
  return (
    <>
      {/* The waiting slot. */}
      {lit < 1 ? (
        <div
          style={{
            position: 'absolute',
            left,
            top: RULE_TOP,
            width: RULE_W,
            height: RULE_H,
            boxSizing: 'border-box',
            borderRadius: RADIUS.lg,
            border: `2px dashed ${C.ink600}`,
            display: 'grid',
            placeItems: 'center',
            opacity: slot * (1 - lit),
            transform: `translateY(${(1 - slot) * 16}px)`,
          }}
        >
          <span style={{ fontFamily: FONT.sans, fontSize: 120, fontWeight: 850, color: C.ink700 }}>{n}</span>
        </div>
      ) : null}
      {lit > 0 ? (
        <div
          style={{
            position: 'absolute',
            left,
            top: RULE_TOP,
            width: RULE_W,
            height: RULE_H,
            boxSizing: 'border-box',
            padding: '22px 28px 26px',
            borderRadius: RADIUS.lg,
            border: `${glow > 0.3 ? 3 : 2}px solid ${alpha(C.cyan, 0.35 + 0.55 * glow)}`,
            background: `linear-gradient(180deg, ${alpha(C.cyan, 0.05 + 0.08 * glow)} 0%, ${alpha(C.ink900, 0.95)} 55%)`,
            boxShadow: glow > 0.02 ? `0 0 ${Math.round(40 * glow)}px ${alpha(C.cyan, 0.28 * glow)}` : `0 20px 50px ${alpha('#000000', 0.3)}`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            fontFamily: FONT.sans,
            opacity: lit * (1 - 0.5 * dim),
            transform: `translateY(${(1 - p) * 22}px) scale(${(0.96 + 0.04 * Math.min(1, p)) * (1 - 0.04 * dim)})`,
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: 20,
              top: 20,
              width: 54,
              height: 54,
              borderRadius: 27,
              display: 'grid',
              placeItems: 'center',
              background: glow > 0.3 ? C.cyan : alpha(C.cyan, 0.18),
              border: `2px solid ${alpha(C.cyan, 0.7)}`,
              fontSize: 32,
              fontWeight: 850,
              color: glow > 0.3 ? C.ink950 : C.cyanSoft,
            }}
          >
            {n}
          </div>
          <div style={{ height: 150, marginTop: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Art kind={rule.art} frame={frame} at={at} />
          </div>
          <div style={{ marginTop: 14, fontSize: 54, fontWeight: 850, lineHeight: 1.08, letterSpacing: -1, color: C.textStrong, textAlign: 'center', whiteSpace: 'nowrap' }}>
            {rule.title[0]}
            <br />
            {rule.title[1]}
          </div>
          <div style={{ marginTop: 12, fontSize: 34, fontWeight: 700, lineHeight: 1.22, color: C.text, textAlign: 'center', whiteSpace: 'nowrap' }}>
            {rule.sub[0]}
            <br />
            {rule.sub[1]}
          </div>
        </div>
      ) : null}
    </>
  );
}

function Art({ kind, frame, at }: { kind: Rule['art']; frame: number; at: number }) {
  if (kind === 'tenants') return <BlockVsHouse frame={frame} at={at} />;
  if (kind === 'key') return <HandKey frame={frame} at={at} />;
  return <ClosedEye frame={frame} at={at} />;
}

/** Rule 1: the block of 14.000 flats (amber, shared) against the house with one tenant (emerald, dedicated). */
function BlockVsHouse({ frame, at }: { frame: number; at: number }) {
  const bx = 34;
  const by = 16;
  const bw = 112;
  const bh = 134;
  const cols = 4;
  const rows = 7;
  const ww = 16;
  const wh = 10;
  const gx = (bw - cols * ww) / (cols + 1);
  const gy = (bh - 8 - rows * wh) / (rows + 1);
  const windows: ReactNode[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const i = r * cols + c;
      const on = progress(frame, at + (rows - 1 - r) * 1.5 + (c % 2), 8);
      const h = (i * 53 + 17) % 20;
      const fill = h < 10 ? alpha(C.amber, 0.8) : h < 13 ? alpha(C.cyan, 0.5) : alpha(C.muted, 0.3);
      windows.push(<rect key={i} x={bx + gx + c * (ww + gx)} y={by + 4 + gy + r * (wh + gy)} width={ww} height={wh} rx={2} fill={fill} opacity={on} />);
    }
  }
  const hx = 290;
  const lit = progress(frame, at + 10, 12);
  return (
    <svg width={380} height={150} style={{ overflow: 'visible' }}>
      {/* The block (shared) */}
      <rect x={bx - 6} y={by - 10} width={bw + 12} height={12} rx={4} fill={C.ink700} />
      <rect x={bx} y={by} width={bw} height={bh} rx={6} fill={C.ink850} stroke={alpha(C.amber, 0.7)} strokeWidth={3} />
      {windows}
      {/* Divider */}
      <line x1={190} y1={30} x2={190} y2={140} stroke={C.ink600} strokeWidth={3} strokeLinecap="round" strokeDasharray="2 10" />
      {/* The house (dedicated) */}
      <rect x={hx + 36} y={52} width={18} height={32} rx={3} fill={C.ink800} stroke={alpha(C.emerald, 0.6)} strokeWidth={3} />
      <path d={`M${hx - 76},${88} L${hx},${36} L${hx + 76},${88} Z`} fill={C.ink850} />
      <path d={`M${hx - 76},${88} L${hx},${36} L${hx + 76},${88} Z`} fill={alpha(C.emerald, 0.14)} stroke={C.emerald} strokeWidth={4} strokeLinejoin="round" />
      <rect x={hx - 60} y={86} width={120} height={64} rx={5} fill={C.ink850} stroke={C.emerald} strokeWidth={4} />
      <rect x={hx - 46} y={100} width={40} height={30} rx={4} fill={alpha(C.emerald, 0.2 + 0.65 * lit)} stroke={alpha(C.emerald, 0.8)} strokeWidth={3} />
      <rect x={hx + 14} y={108} width={28} height={42} rx={3} fill={C.ink800} stroke={alpha(C.emerald, 0.5)} strokeWidth={3} />
    </svg>
  );
}

/** Rule 2: the hand-made key (the self-signed certificate) with its CN. */
function HandKey({ frame, at }: { frame: number; at: number }) {
  const turn = progress(frame, at, 20, EASE.out);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
      <div
        style={{
          width: 136,
          height: 136,
          borderRadius: 68,
          display: 'grid',
          placeItems: 'center',
          background: alpha(C.emerald, 0.12),
          border: `3px solid ${alpha(C.emerald, 0.7)}`,
        }}
      >
        <div style={{ transform: `rotate(${-40 + 20 * turn}deg)` }}>
          <Icon name="key" size={84} color={C.emerald} strokeWidth={2.2} />
        </div>
      </div>
      <span
        style={{
          fontFamily: FONT.mono,
          fontSize: 28,
          fontWeight: 750,
          color: C.emerald,
          padding: '8px 16px',
          borderRadius: RADIUS.pill,
          border: `2px solid ${alpha(C.emerald, 0.55)}`,
          background: alpha(C.emerald, 0.1),
          whiteSpace: 'nowrap',
          opacity: progress(frame, at + 8, 12),
        }}
      >
        CN=updatesvc
      </span>
    </div>
  );
}

/** Rule 3: the closed eye of passive collection (the actor does not see you). */
function ClosedEye({ frame, at }: { frame: number; at: number }) {
  const blink = progress(frame, at + 4, 10);
  return (
    <div
      style={{
        width: 136,
        height: 136,
        borderRadius: 68,
        display: 'grid',
        placeItems: 'center',
        background: alpha(C.emerald, 0.12),
        border: `3px solid ${alpha(C.emerald, 0.7)}`,
      }}
    >
      <div style={{ gridArea: '1 / 1', opacity: 1 - blink }}>
        <Icon name="eye" size={80} color={C.muted} strokeWidth={2.2} />
      </div>
      <div style={{ gridArea: '1 / 1', opacity: blink }}>
        <Icon name="eyeOff" size={80} color={C.emerald} strokeWidth={2.2} />
      </div>
    </div>
  );
}

/** The single next action: Lab 3A, with a query budget. */
export function LabAction({ frame, fps, at }: { frame: number; fps: number; at: number }) {
  if (frame < at - 6) return null;
  const p = springIn(frame, fps, at - 4, { damping: 15 });
  const lit = Math.min(1, p * 1.3);
  const glow = lit * (0.75 + 0.25 * pulse(frame, fps, 0.5));
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: LAB_TOP,
        width: 1728,
        height: LAB_H,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 26,
        borderRadius: RADIUS.lg,
        border: `3px solid ${alpha(C.cyan, 0.85)}`,
        background: `linear-gradient(90deg, ${alpha(C.cyan, 0.2)} 0%, ${alpha(C.ink900, 0.95)} 45%, ${alpha(C.ink900, 0.95)} 100%)`,
        boxShadow: `0 0 ${Math.round(40 * glow)}px ${alpha(C.cyan, 0.32 * glow)}`,
        fontFamily: FONT.sans,
        opacity: lit,
        transform: `translateY(${(1 - p) * 24}px) scale(${0.96 + 0.04 * Math.min(1, p)})`,
      }}
    >
      <div style={{ width: 74, height: 74, borderRadius: 20, display: 'grid', placeItems: 'center', background: C.cyan, flexShrink: 0 }}>
        <Icon name="target" size={46} color={C.ink950} strokeWidth={2.2} />
      </div>
      <span style={{ fontSize: 50, fontWeight: 850, letterSpacing: -0.5, color: C.textStrong, whiteSpace: 'nowrap' }}>
        Ahora te toca: <span style={{ color: C.cyanSoft }}>Lab 3A · Pivot Hunt</span>
      </span>
      <Chip accent="cyan" icon="search" size={34}>
        consultas contadas
      </Chip>
    </div>
  );
}

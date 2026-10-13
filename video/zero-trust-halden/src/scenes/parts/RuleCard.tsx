import type { ReactNode } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../engine/src/theme/tokens';
import { Icon, clamp01 } from '../../../../engine/src/ui';
import { VestGlyph } from './People';

/**
 * Today's firewall rule, drawn ONE way (s01 full size, s02 smaller, over the painted line):
 * a neutral steel card headed «regla del cortafuegos» with a single row of four fields,
 * «Operaciones» · «a erp.local» · «tcp/443» · «permitir». No rule number, no other rows,
 * no ALLOW/DENY words; steel, never rose or amber («la regla creció así», nobody's fault).
 *
 * `reading` opens a second row with how s02 redraws the rule, «chaleco de Operaciones: pasa»;
 * `pass` (0–1) is the answer's pulse: «pasa» pops emerald each time a figure crosses.
 *
 * Plain HTML, sized from `width` alone; nothing reads the timeline or positions itself.
 */

/** Canon strings (out/scene-brief.md «Canon»). `erp.local` and `tcp/443` are the only mono text. */
export const RULE = {
  title: 'regla del cortafuegos',
  src: 'Operaciones',
  dstLead: 'a',
  dst: 'erp.local',
  svc: 'tcp/443',
  act: 'permitir',
} as const;

/** s02: the same rule, read the way the port lives it. «de Operaciones» exists only here. */
export const RULE_READING = { lead: 'chaleco de Operaciones:', verdict: 'pasa' } as const;

export type RuleField = 'src' | 'dst' | 'svc' | 'act';
const FIELDS: RuleField[] = ['src', 'dst', 'svc', 'act'];

const STEEL = '#94a3b8';
const STEEL_SOFT = '#cbd5e1';
const DESIGN_W = 1080;

function metrics(width: number) {
  const k = width / DESIGN_W;
  return {
    k,
    border: 2,
    head: Math.round(Math.max(36, 58 * k)),
    row: Math.round(Math.max(54, 104 * k)),
    field: Math.max(26, Math.round(42 * k)),
    title: Math.max(22, Math.round(32 * k)),
    reading: Math.max(36, Math.round(50 * k)),
    readingRow: Math.round(Math.max(62, 92 * k)),
    pad: Math.round(Math.max(8, 20 * k)),
  };
}

/** Outer size of the card at `width` (`reading` 0–1 = how far the second row is open). */
export function ruleCardSize(width: number, reading = 0): { w: number; h: number } {
  const m = metrics(width);
  return { w: width, h: 2 * m.border + m.head + m.row + Math.round(m.readingRow * clamp01(reading)) };
}

export function RuleCard({
  width,
  write = 1,
  lit,
  reading = 0,
  pass = 0,
}: {
  /** Outer width in px; every size follows from it (design width 1080). */
  width: number;
  /** 0–1: the four fields written in, left to right (0 = the empty card, header only). */
  write?: number;
  /** 0–1 per field (and `title`): the piece the voice is on, brightened in neutral white. */
  lit?: Partial<Record<RuleField | 'title', number>>;
  /** 0–1: opens the s02 row «chaleco de Operaciones: pasa». */
  reading?: number;
  /** 0–1: the answer's pulse («pasa» pops emerald, the card glows with it). */
  pass?: number;
}) {
  const m = metrics(width);
  const r = clamp01(reading);
  const p = clamp01(pass);
  const titleLit = clamp01(lit?.title ?? 0);
  const size = ruleCardSize(width, r);

  const cells: Record<RuleField, ReactNode> = {
    src: <span style={{ fontWeight: 800 }}>{RULE.src}</span>,
    dst: (
      <>
        <span style={{ fontWeight: 650, color: STEEL_SOFT, marginRight: Math.round(m.field * 0.3) }}>{RULE.dstLead}</span>
        <span style={{ fontFamily: FONT.mono, fontWeight: 750 }}>{RULE.dst}</span>
      </>
    ),
    svc: <span style={{ fontFamily: FONT.mono, fontWeight: 750 }}>{RULE.svc}</span>,
    act: <span style={{ fontWeight: 800 }}>{RULE.act}</span>,
  };

  return (
    <div
      style={{
        width: size.w,
        height: size.h,
        boxSizing: 'border-box',
        borderRadius: Math.round(Math.max(RADIUS.md, RADIUS.lg * m.k)),
        border: `${m.border}px solid ${alpha(STEEL, 0.6)}`,
        background: `linear-gradient(180deg, ${C.ink850} 0%, ${C.ink900} 100%)`,
        boxShadow: `0 ${Math.round(24 * m.k + 6)}px ${Math.round(56 * m.k + 14)}px ${alpha('#000000', 0.45)}, inset 0 1px 0 ${alpha('#ffffff', 0.06)}${
          p > 0.01 ? `, 0 0 ${Math.round(18 + 26 * p)}px ${alpha(C.emerald, 0.3 * p)}` : ''
        }`,
        overflow: 'hidden',
        fontFamily: FONT.sans,
      }}
    >
      {/* Header: whose rule this is */}
      <div
        style={{
          height: m.head,
          boxSizing: 'border-box',
          display: 'flex',
          alignItems: 'center',
          gap: Math.round(m.title * 0.5),
          padding: `0 ${Math.round(m.pad * 1.2)}px`,
          background: alpha(C.ink700, 0.55),
          borderBottom: `2px solid ${alpha(STEEL, 0.4)}`,
          whiteSpace: 'nowrap',
        }}
      >
        <Icon name="firewall" size={Math.round(m.title * 1.15)} color={titleLit > 0.5 ? C.textStrong : STEEL_SOFT} strokeWidth={2.1} />
        <span style={{ position: 'relative', fontSize: m.title, fontWeight: 750, letterSpacing: 0.6, color: STEEL_SOFT }}>
          {RULE.title}
          <span style={{ position: 'absolute', left: 0, top: 0, color: C.textStrong, opacity: titleLit }}>{RULE.title}</span>
        </span>
      </div>

      {/* The one row */}
      <div style={{ height: m.row, display: 'flex', alignItems: 'stretch' }}>
        {FIELDS.map((f, i) => {
          const w = clamp01((clamp01(write) - i * 0.18) / 0.46);
          const l = clamp01(lit?.[f] ?? 0);
          return (
            <div
              key={f}
              style={{
                position: 'relative',
                flex: '1 1 auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: `0 ${m.pad}px`,
                borderLeft: i ? `2px solid ${alpha(STEEL, 0.28)}` : undefined,
                background: l > 0.01 ? alpha('#ffffff', 0.07 * l) : undefined,
                fontSize: m.field,
                lineHeight: 1,
                color: l > 0.5 ? C.textStrong : C.text,
                textShadow: l > 0.01 ? `0 0 ${Math.round(18 * l)}px ${alpha('#ffffff', 0.45 * l)}` : undefined,
                whiteSpace: 'nowrap',
              }}
            >
              {/* The field still to be written: a dashed stub (grey = not there yet) */}
              {w < 0.999 ? (
                <span
                  style={{
                    position: 'absolute',
                    left: '22%',
                    right: '22%',
                    top: '50%',
                    borderTop: `3px dashed ${alpha(C.faint, 0.7)}`,
                    opacity: 1 - w,
                  }}
                />
              ) : null}
              <span style={{ display: 'inline-flex', alignItems: 'baseline', opacity: w, transform: `translateY(${(1 - w) * 8}px)` }}>{cells[f]}</span>
              {/* Underline of the field the voice is on */}
              {l > 0.01 ? (
                <span
                  style={{
                    position: 'absolute',
                    left: m.pad,
                    right: m.pad,
                    bottom: Math.round(m.row * 0.16),
                    height: Math.max(3, Math.round(5 * m.k)),
                    borderRadius: 3,
                    background: alpha('#ffffff', 0.85),
                    transform: `scaleX(${l})`,
                    transformOrigin: '0 50%',
                  }}
                />
              ) : null}
            </div>
          );
        })}
      </div>

      {/* s02: the rule as the port lives it */}
      {r > 0.001 ? (
        <div
          style={{
            height: m.readingRow,
            boxSizing: 'border-box',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: Math.round(m.reading * 0.36),
            borderTop: `2px solid ${alpha(STEEL, 0.4)}`,
            background: alpha(C.ink950, 0.45),
            opacity: r,
            whiteSpace: 'nowrap',
          }}
        >
          <svg width={Math.round(m.reading * 1.05)} height={Math.round(m.reading * 1.3)} viewBox="-42 -54 84 108" style={{ flexShrink: 0, display: 'block' }}>
            <VestGlyph x={0} y={0} h={100} />
          </svg>
          <span style={{ fontSize: m.reading, fontWeight: 750, color: C.textStrong }}>{RULE_READING.lead}</span>
          <span
            style={{
              display: 'inline-block',
              padding: `${Math.round(m.reading * 0.06)}px ${Math.round(m.reading * 0.42)}px ${Math.round(m.reading * 0.1)}px`,
              borderRadius: RADIUS.pill,
              border: `2px solid ${alpha(C.emerald, 0.55 + 0.45 * p)}`,
              background: alpha(C.emerald, 0.12 + 0.2 * p),
              boxShadow: p > 0.01 ? `0 0 ${Math.round(26 * p)}px ${alpha(C.emerald, 0.55 * p)}` : undefined,
              fontSize: m.reading,
              fontWeight: 850,
              color: p > 0.5 ? '#a7f3d0' : '#6ee7b7',
              transform: `scale(${1 + 0.12 * p})`,
            }}
          >
            {RULE_READING.verdict}
          </span>
        </div>
      ) : null}
    </div>
  );
}

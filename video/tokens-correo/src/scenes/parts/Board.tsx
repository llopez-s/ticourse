import { C, FONT, RADIUS, alpha } from '../../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../../engine/src/theme/motion';
import { Icon, type IconName } from '../../../../engine/src/ui/Icon';
import { tone as toneOf, type Tone } from '../../../../engine/src/ui/tone';
import { Tag, WHO } from './bits';

/** The four participants of the case, one column each (the same order in every scene). */
export const COLS: { id: keyof typeof WHO; title: string; sub: string; icon: IconName }[] = [
  { id: 'ana', title: 'Ana', sub: 'usuaria', icon: 'user' },
  { id: 'app', title: 'Resumen del turno', sub: 'aplicación', icon: 'app' },
  { id: 'idp', title: 'Microsoft Entra ID', sub: 'servicio de identidad', icon: 'shield' },
  { id: 'graph', title: 'Microsoft Graph', sub: 'recurso: correo', icon: 'mail' },
];

export const COL_W = 390;
export const COL_GAP = 56;
export const HEAD_H = 104;
const colX = (i: number) => i * (COL_W + COL_GAP);
const colC = (i: number) => colX(i) + COL_W / 2;

/** One arrow between two lifelines. Frames are relative to the Sequence. */
export interface Msg {
  from: number;
  to: number;
  /** Arrow height inside the board (the label sits above it). */
  y: number;
  label: string;
  tag?: string;
  tone?: Tone;
  at: number;
  dashed?: boolean;
  /** 0–1: steps the arrow back. */
  dim?: number;
  /** Frame at which the arrow turns from `tone` to `litTone` and glows. */
  litAt?: number;
  litTone?: Tone;
  /** Small icon at the head (a check, a question mark). */
  mark?: { icon: IconName; tone: Tone; at: number };
}

/**
 * Four participants as columns with a lifeline each, and arrows between them (a sequence diagram). A column
 * appears at `colAt[i]`; `lit[i]` (0–1) glows it. Everything is drawn inside a `width`×`height` box.
 */
export function Board({
  frame,
  height,
  colAt,
  lit = [0, 0, 0, 0],
  msgs,
  width = 1728,
}: {
  frame: number;
  height: number;
  colAt: [number, number, number, number];
  lit?: [number, number, number, number];
  msgs: Msg[];
  width?: number;
}) {
  return (
    <div style={{ position: 'relative', width, height, fontFamily: FONT.sans }}>
      {/* lifelines */}
      <svg width={width} height={height} style={{ position: 'absolute', left: 0, top: 0 }}>
        {COLS.map((col, i) => {
          const p = progress(frame, colAt[i] + 8, 24);
          const color = WHO[col.id];
          return <line key={col.id} x1={colC(i)} x2={colC(i)} y1={HEAD_H} y2={HEAD_H + (height - HEAD_H) * p} stroke={alpha(color, 0.3 + 0.4 * lit[i])} strokeWidth={3} strokeDasharray="4 12" strokeLinecap="round" />;
        })}
        {msgs.map((m, k) => {
          const p = progress(frame, m.at, 18, EASE.inOut);
          if (p <= 0) return null;
          const dir = m.to > m.from ? 1 : -1;
          const x1 = colC(m.from) + dir * 14;
          const x2 = colC(m.to) - dir * 16;
          const len = Math.abs(x2 - x1);
          const lt = m.litAt !== undefined ? progress(frame, m.litAt, 12) : 0;
          const base = toneOf(m.tone ?? 'cyan').fg;
          const color = lt > 0 ? toneOf(m.litTone ?? 'emerald').fg : base;
          const d = 1 - 0.65 * (m.dim ?? 0);
          return (
            <g key={k} opacity={d}>
              <line x1={x1} y1={m.y} x2={x1 + dir * len * p} y2={m.y} stroke={color} strokeWidth={4 + 2 * lt} strokeLinecap="round" strokeDasharray={m.dashed ? '12 10' : undefined} />
              {p > 0.92 ? <polygon points={`${x2},${m.y} ${x2 - dir * 20},${m.y - 11} ${x2 - dir * 20},${m.y + 11}`} fill={color} /> : null}
            </g>
          );
        })}
      </svg>

      {/* column heads */}
      {COLS.map((col, i) => {
        const p = progress(frame, colAt[i], 18);
        const color = WHO[col.id];
        const g = lit[i];
        return (
          <div
            key={col.id}
            style={{
              position: 'absolute',
              left: colX(i),
              top: 0,
              width: COL_W,
              height: HEAD_H - 14,
              boxSizing: 'border-box',
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              padding: '0 18px 0 14px',
              borderRadius: RADIUS.md,
              background: g > 0 ? alpha(color, 0.12) : C.ink850,
              border: `2px solid ${alpha(color, 0.4 + 0.5 * g)}`,
              boxShadow: g > 0 ? `0 0 ${18 + 26 * g}px ${alpha(color, 0.3 * g)}` : 'none',
              opacity: p,
              transform: `translateY(${(1 - p) * -14}px)`,
            }}
          >
            <div style={{ width: 58, height: 58, borderRadius: 14, display: 'grid', placeItems: 'center', background: alpha(color, 0.14), border: `2px solid ${alpha(color, 0.4)}`, flexShrink: 0 }}>
              <Icon name={col.icon} size={34} color={color} />
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 31, fontWeight: 800, color: C.textStrong, lineHeight: 1.1, whiteSpace: 'nowrap' }}>{col.title}</div>
              <div style={{ marginTop: 3, fontSize: 25, fontWeight: 560, color: toneOf(color).soft, whiteSpace: 'nowrap' }}>{col.sub}</div>
            </div>
          </div>
        );
      })}

      {/* labels and marks */}
      {msgs.map((m, k) => {
        const p = progress(frame, m.at + 6, 14);
        if (p <= 0) return null;
        const mid = (colC(m.from) + colC(m.to)) / 2;
        const lt = m.litAt !== undefined ? progress(frame, m.litAt, 12) : 0;
        const color = lt > 0 ? toneOf(m.litTone ?? 'emerald').fg : toneOf(m.tone ?? 'cyan').fg;
        const mk = m.mark && progress(frame, m.mark.at, 12);
        return (
          <div key={k} style={{ position: 'absolute', left: mid, top: m.y - 52, transform: `translate(-50%, ${(1 - p) * 8}px)`, opacity: p * (1 - 0.65 * (m.dim ?? 0)), display: 'flex', alignItems: 'center', gap: 12, whiteSpace: 'nowrap' }}>
            <span style={{ padding: '5px 18px', borderRadius: RADIUS.pill, background: alpha(C.ink950, 0.92), border: `2px solid ${alpha(color, 0.7)}`, fontSize: 31, fontWeight: 700, color: lt > 0 ? '#a7f3d0' : C.text }}>{m.label}</span>
            {m.tag ? <Tag tone={color} size={28}>{m.tag}</Tag> : null}
            {m.mark && mk ? <Icon name={m.mark.icon} size={40} color={toneOf(m.mark.tone).fg} strokeWidth={3} style={{ opacity: mk }} /> : null}
          </div>
        );
      })}
    </div>
  );
}

export { colC, colX };

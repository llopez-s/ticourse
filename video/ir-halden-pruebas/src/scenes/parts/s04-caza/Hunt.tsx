import type { CSSProperties, ReactNode } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { EASE, enter, progress, pulse, springIn } from '../../../../../engine/src/theme/motion';
import { Chip, Icon, Panel, clamp01, dimStyle, mix, windowWeight } from '../../../../../engine/src/ui';
import { ALERTS, HUNT, HYPOTHESIS, METER_NOTES, QUERY, REFERENCE, SILENCE, type MeterNote } from '../../../data/s04-caza';
import { MeterDial } from '../Meter';
import { fitSize, textWidth } from './text';

/**
 * Pieces of s04-caza, in stage-local coordinates (the stage is 1728×660).
 * They never read the timeline: the scene passes Sequence-relative frames.
 */

const W = 1728;
const VIOLET_SOFT = '#c4b5fd';
const EMERALD_SOFT = '#6ee7b7';

// ---------------------------------------------------------------------------
// s04-01: «que no suene nada no quiere decir que no haya nadie» — low on the
// stage, under the intercepted message.
// ---------------------------------------------------------------------------

const SIL = { y: 392, r: 96, leftX: 470, midX: 864, rightX: 1258, labelTop: 512 };

export function Silence({ frame, bellAt, neqAt, nobodyAt, opacity }: { frame: number; bellAt: number; neqAt: number; nobodyAt: number; opacity: number }) {
  if (opacity <= 0.001) return null;
  // Visible from the first frame: s04 opens a chapter, the wipe reveals it from the left.
  const bellIn = 1;
  const bellLabel = progress(frame, bellAt - 4, 14);
  const neq = progress(frame, neqAt - 4, 14);
  const slash = progress(frame, neqAt + 4, 12, EASE.inOut);
  const nobody = springIn(frame, 30, nobodyAt - 6, { damping: 16 });
  const circle = (cx: number, dashed: boolean, content: ReactNode, o: number, scale = 1) => (
    <div
      style={{
        position: 'absolute',
        left: cx - SIL.r,
        top: SIL.y - SIL.r,
        width: 2 * SIL.r,
        height: 2 * SIL.r,
        boxSizing: 'border-box',
        borderRadius: SIL.r,
        border: `4px ${dashed ? 'dashed' : 'solid'} ${dashed ? alpha(C.muted, 0.6) : C.ink600}`,
        background: alpha(C.ink850, 0.95),
        display: 'grid',
        placeItems: 'center',
        opacity: o,
        transform: `scale(${scale})`,
      }}
    >
      {content}
    </div>
  );
  const label = (cx: number, text: string, o: number) => (
    <div style={{ position: 'absolute', left: cx - 300, width: 600, top: SIL.labelTop, textAlign: 'center', fontSize: 52, fontWeight: 800, letterSpacing: -0.6, color: C.textStrong, whiteSpace: 'nowrap', opacity: o, transform: `translateY(${(1 - o) * 12}px)` }}>
      {text}
    </div>
  );
  return (
    <div style={{ position: 'absolute', inset: 0, opacity, fontFamily: FONT.sans }}>
      {/* the silent bell: no sound rings */}
      {circle(SIL.leftX, false, <Icon name="bell" size={104} color={C.muted} strokeWidth={1.6} />, bellIn)}
      {label(SIL.leftX, SILENCE.bell.text, bellLabel)}

      {/* «no quiere decir»: a drawn not-equal sign (no glyph) */}
      {neq > 0.001 ? (
        <svg width={140} height={140} viewBox="-70 -70 140 140" style={{ position: 'absolute', left: SIL.midX - 70, top: SIL.y - 70, overflow: 'visible', opacity: neq }}>
          <g stroke={C.cyan} strokeWidth={12} strokeLinecap="round" style={{ filter: `drop-shadow(0 0 10px ${alpha(C.cyan, 0.5)})` }}>
            <line x1={-48 * neq} y1={-18} x2={48 * neq} y2={-18} />
            <line x1={-48 * neq} y1={18} x2={48 * neq} y2={18} />
            <line x1={22} y1={-52} x2={22 - 44 * slash} y2={-52 + 104 * slash} opacity={slash > 0.01 ? 1 : 0} />
          </g>
        </svg>
      ) : null}

      {nobody > 0.001 ? (
        <>
          {circle(SIL.rightX, true, <Icon name="users" size={96} color={C.muted} strokeWidth={1.6} />, Math.min(1, nobody * 1.3), 0.85 + 0.15 * Math.min(1, nobody))}
          {label(SIL.rightX, SILENCE.nobody.text, Math.min(1, nobody * 1.3))}
        </>
      ) : null}
    </div>
  );
}

// ---------------------------------------------------------------------------
// s04-02: the notes beside the water meter.
// ---------------------------------------------------------------------------

export const NOTES = { left: 900, top: 58, pitch: 112, dripTop: 470 } as const;

export function MeterNotes({ frame, at, headAt, head, spinFrom, opacity }: { frame: number; at: number[]; headAt: number; head: string; spinFrom: number; opacity: number }) {
  if (opacity <= 0.001) return null;
  // The latest note is bright; the earlier ones step back a little.
  const latest = at.reduce((m, a, i) => (frame >= a - 4 ? i : m), -1);
  const headIn = progress(frame, headAt - 4, 14);
  return (
    <div style={{ position: 'absolute', inset: 0, opacity, fontFamily: FONT.sans }}>
      {headIn > 0.001 ? (
        <div style={{ position: 'absolute', left: NOTES.left, top: NOTES.top - 18, display: 'flex', alignItems: 'center', gap: 16, whiteSpace: 'nowrap', ...enter(frame, headAt - 4, { distance: 12 }) }}>
          <DropGlyph size={40} />
          <span style={{ fontSize: 40, fontWeight: 700, color: C.muted }}>{head}</span>
        </div>
      ) : null}
      {METER_NOTES.map((n, i) => {
        if (frame < at[i] - 6) return null;
        const dim = n.key !== 'drip' && latest > i ? 0.45 : 0;
        const top = n.key === 'drip' ? NOTES.dripTop : NOTES.top + 70 + i * NOTES.pitch;
        return (
          <div key={n.key} style={{ position: 'absolute', left: NOTES.left, top, ...dimStyle(dim) }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 22, whiteSpace: 'nowrap', ...enter(frame, at[i] - 6, { distance: 16, axis: 'x' }) }}>
              <NoteGlyph note={n} frame={frame} spinFrom={spinFrom} />
              <span
                style={{
                  fontSize: n.key === 'drip' ? 66 : 46,
                  fontWeight: n.key === 'drip' ? 850 : 750,
                  letterSpacing: n.key === 'drip' ? -1 : -0.4,
                  color: n.key === 'drip' ? EMERALD_SOFT : C.textStrong,
                  textShadow: n.key === 'drip' ? `0 0 24px ${alpha(C.emerald, 0.45)}` : undefined,
                }}
              >
                {n.text}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function NoteGlyph({ note, frame, spinFrom }: { note: MeterNote; frame: number; spinFrom: number }) {
  const box = (child: ReactNode, size = 72) => <div style={{ width: size, height: size, display: 'grid', placeItems: 'center', flexShrink: 0 }}>{child}</div>;
  switch (note.key) {
    case 'stain':
      return box(
        <svg width={64} height={44} viewBox="-32 -22 64 44">
          <path d="M -26 -8 C -24 10 -8 16 4 11 C 18 17 30 6 26 -8 Z" fill={alpha(C.muted, 0.1)} stroke={alpha(C.muted, 0.85)} strokeWidth={3} strokeDasharray="6 5" />
          <line x1={-30} y1={-12} x2={30} y2={-12} stroke={C.ink500} strokeWidth={5} strokeLinecap="round" />
        </svg>,
      );
    case 'taps':
      return box(<TapGlyph size={60} />);
    case 'meter':
      return box(<MeterDial size={72} spinFrom={spinFrom} frame={frame} glow={0.6} />);
    case 'drip':
      return box(<DropGlyph size={70} />, 80);
  }
}

export function DropGlyph({ size = 40, color = C.sky }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="-12 -13 24 26" style={{ flexShrink: 0 }}>
      <path d="M 0 -11 C 4 -5 7.5 -1 7.5 3.5 A 7.5 7.5 0 0 1 -7.5 3.5 C -7.5 -1 -4 -5 0 -11 Z" fill={alpha(color, 0.3)} stroke={color} strokeWidth={2} strokeLinejoin="round" />
    </svg>
  );
}

function TapGlyph({ size = 60, color = C.muted }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" style={{ flexShrink: 0 }}>
      <g fill="none" stroke={color} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round">
        <line x1={10} y1={14} x2={42} y2={14} />
        <line x1={26} y1={14} x2={26} y2={24} />
        <rect x={16} y={24} width={20} height={14} rx={4} fill={C.ink700} />
        <path d="M 18 31 L 8 31 Q 4 31 4 38 L 4 44" />
      </g>
    </svg>
  );
}

// ---------------------------------------------------------------------------
// s04-03 / s04-04: the hypothesis — a big card, then a compact strip on top.
// ---------------------------------------------------------------------------

export const CARD = { height: 262, compactHeight: 92 } as const;

type Mark = { text: string; w: number };

/** line2 with its marked spans lit by weight. */
function MarkedLine({ text, marks }: { text: string; marks: Mark[] }) {
  const pieces: { text: string; w: number | null }[] = [];
  let rest = text;
  for (const m of marks) {
    const i = rest.indexOf(m.text);
    if (i < 0) continue;
    if (i > 0) pieces.push({ text: rest.slice(0, i), w: null });
    pieces.push({ text: m.text, w: m.w });
    rest = rest.slice(i + m.text.length);
  }
  if (rest) pieces.push({ text: rest, w: null });
  return (
    <>
      {pieces.map((p, k) =>
        p.w === null ? (
          <span key={k}>{p.text}</span>
        ) : (
          <span
            key={k}
            style={{
              color: p.w > 0.02 ? EMERALD_SOFT : undefined,
              textShadow: p.w > 0.02 ? `0 0 18px ${alpha(C.emerald, 0.45 * p.w)}` : undefined,
              backgroundImage: `linear-gradient(${alpha(C.emerald, 0.85)}, ${alpha(C.emerald, 0.85)})`,
              backgroundSize: `${Math.round(100 * p.w)}% 4px`,
              backgroundPosition: '0 100%',
              backgroundRepeat: 'no-repeat',
              paddingBottom: 2,
            }}
          >
            {p.text}
          </span>
        ),
      )}
    </>
  );
}

export function HypothesisCard({
  frame,
  boxAt,
  line1At,
  line2At,
  markAt,
  refAt,
  compact,
}: {
  frame: number;
  boxAt: number;
  line1At: number;
  line2At: number;
  markAt: number[];
  /** «la otra vez» gets a dashed underline when the reference card comes. */
  refAt: number;
  /** 0–1: the big card gives way to the strip. */
  compact: number;
}) {
  if (frame < boxAt - 2) return null;
  const box = progress(frame, boxAt, 16);
  const l1 = progress(frame, line1At, 14);
  const l2 = progress(frame, line2At, 14);
  const refMark = progress(frame, refAt - 4, 12);
  const marks: Mark[] = HYPOTHESIS.marks.map((m, i) => ({ text: m.text, w: progress(frame, markAt[i] - 2, 12) }));
  const frameStyle = (h: number, glow: number): CSSProperties => ({
    position: 'absolute',
    left: 0,
    top: 0,
    width: W,
    height: h,
    boxSizing: 'border-box',
    borderRadius: RADIUS.lg,
    border: `2px solid ${alpha(C.emerald, 0.35 + 0.3 * glow)}`,
    background: `linear-gradient(180deg, ${alpha(C.emerald, 0.08)} 0%, ${alpha(C.ink900, 0.96)} 100%)`,
    boxShadow: `0 24px 60px ${alpha('#000000', 0.35)}`,
    fontFamily: FONT.sans,
  });
  const big = box * (1 - compact);
  const strip = compact;
  const joined = `${HYPOTHESIS.line1} · `;
  const stripHead = `${HYPOTHESIS.head}:`;
  const stripSize = fitSize(`${stripHead}  ${joined}${HYPOTHESIS.line2}`, W - 40 - 44 - 18 - 40, 34);
  return (
    <>
      {big > 0.001 ? (
        <div style={{ ...frameStyle(CARD.height, l2), opacity: big, transform: `translateY(${(1 - box) * 16 - compact * 24}px)` }}>
          <div style={{ position: 'absolute', left: 40, top: 26, display: 'flex', alignItems: 'center', gap: 14, whiteSpace: 'nowrap' }}>
            <Icon name="target" size={38} color={C.emerald} strokeWidth={2.2} />
            <span style={{ fontSize: 30, fontWeight: 800, letterSpacing: 4, color: EMERALD_SOFT, textTransform: 'uppercase' }}>{HYPOTHESIS.head}</span>
          </div>
          <div style={{ position: 'absolute', left: 40, top: 82, fontSize: 54, fontWeight: 800, letterSpacing: -0.8, color: C.textStrong, whiteSpace: 'nowrap', opacity: l1, transform: `translateY(${(1 - l1) * 10}px)` }}>
            {HYPOTHESIS.line1.slice(0, HYPOTHESIS.line1.length - REFERENCE.label.length)}
            <span style={{ borderBottom: `4px dashed ${alpha(C.muted, 0.85 * refMark)}`, paddingBottom: 2 }}>{REFERENCE.label}</span>
          </div>
          <div style={{ position: 'absolute', left: 40, top: 160, fontSize: 54, fontWeight: 800, letterSpacing: -0.8, color: C.textStrong, whiteSpace: 'nowrap', opacity: l2, transform: `translateY(${(1 - l2) * 10}px)` }}>
            <MarkedLine text={HYPOTHESIS.line2} marks={marks} />
          </div>
        </div>
      ) : null}
      {strip > 0.001 ? (
        <div style={{ ...frameStyle(CARD.compactHeight, 0.3), opacity: strip, transform: `translateY(${(1 - strip) * 20}px)`, display: 'flex', alignItems: 'center', gap: 18, padding: '0 40px', whiteSpace: 'nowrap' }}>
          <Icon name="target" size={44} color={C.emerald} strokeWidth={2.2} />
          <span style={{ fontSize: stripSize, fontWeight: 750, color: C.textStrong }}>
            <span style={{ color: EMERALD_SOFT, fontWeight: 800 }}>{stripHead}</span>
            {'  '}
            {joined}
            <MarkedLine text={HYPOTHESIS.line2} marks={marks.map((m) => ({ ...m, w: 1 }))} />
          </span>
        </div>
      ) : null}
    </>
  );
}

/** Centre of «la otra vez» at the end of line 1, on the card's bottom edge (for the connector to the reference). */
export function refAnchor(): { x: number; y: number } {
  const head = HYPOTHESIS.line1.slice(0, HYPOTHESIS.line1.length - REFERENCE.label.length);
  const x = 40 + (textWidth(head, 54) + textWidth(REFERENCE.label, 54) / 2) * 0.97;
  return { x, y: CARD.height };
}

// ---------------------------------------------------------------------------
// s04-03: «la otra vez» — the reference to the incident.
// ---------------------------------------------------------------------------

export const REF = { left: 492, top: 318, width: 540, height: 176 } as const;

export function RefCard({ frame, at, opacity }: { frame: number; at: number; opacity: number }) {
  if (frame < at - 4 || opacity <= 0.001) return null;
  const p = progress(frame, at, 16);
  const from = refAnchor();
  const to = { x: REF.left + REF.width / 2, y: REF.top - 6 };
  const line = progress(frame, at - 4, 14, EASE.inOut);
  const nameSize = fitSize(`${REFERENCE.account} ${REFERENCE.from} ${REFERENCE.host}`, REF.width - 56, 32, { mono: true });
  return (
    <div style={{ position: 'absolute', inset: 0, opacity, fontFamily: FONT.sans }}>
      <svg width={W} height={660} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        <path
          d={`M ${from.x} ${from.y + 4} C ${from.x} ${(from.y + to.y) / 2} ${to.x} ${(from.y + to.y) / 2} ${to.x} ${to.y}`}
          fill="none"
          stroke={alpha(C.muted, 0.8)}
          strokeWidth={3}
          strokeDasharray="8 8"
          opacity={line}
        />
        <circle cx={to.x} cy={to.y} r={6} fill={alpha(C.muted, 0.9)} opacity={line} />
      </svg>
      <div
        style={{
          position: 'absolute',
          left: REF.left,
          top: REF.top,
          width: REF.width,
          height: REF.height,
          boxSizing: 'border-box',
          padding: '18px 28px',
          borderRadius: RADIUS.md,
          border: `2px solid ${C.ink600}`,
          background: alpha(C.ink850, 0.95),
          opacity: p,
          transform: `translateY(${(1 - p) * 14}px)`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, whiteSpace: 'nowrap' }}>
          <Icon name="clock" size={30} color={C.muted} />
          <span style={{ fontSize: 30, fontWeight: 700, color: C.muted }}>{REFERENCE.label}</span>
        </div>
        <div style={{ marginTop: 10, fontFamily: FONT.mono, fontSize: 38, fontWeight: 800, color: C.textStrong, whiteSpace: 'nowrap' }}>{REFERENCE.when}</div>
        <div style={{ marginTop: 6, display: 'flex', alignItems: 'baseline', gap: 12, whiteSpace: 'nowrap', fontSize: nameSize }}>
          <span style={{ fontFamily: FONT.mono, fontWeight: 800, color: '#fcd34d' }}>{REFERENCE.account}</span>
          <span style={{ fontWeight: 650, color: C.muted }}>{REFERENCE.from}</span>
          <span style={{ fontFamily: FONT.mono, fontWeight: 800, color: C.text }}>{REFERENCE.host}</span>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// s04-03 / s04-04: what the alerts say about this hypothesis.
// ---------------------------------------------------------------------------

export const ALERT_BOX = { left: 1068, top: 318, width: 660, height: 322 } as const;

export function AlertsBox({ frame, fps, at, alarmAt }: { frame: number; fps: number; at: number; alarmAt: number }) {
  if (frame < at - 4) return null;
  const p = progress(frame, at, 16);
  const rule = progress(frame, at + 12, 16);
  // «No esperas a la alarma»: both zeros breathe for a while.
  const stress = windowWeight(frame, alarmAt - 4, alarmAt + 70, { ramp: 12 }) * (0.7 + 0.3 * pulse(frame, fps, 0.6));
  const zeroColor = stress > 0.02 ? C.cyanSoft : C.textStrong;
  return (
    <div
      style={{
        position: 'absolute',
        left: ALERT_BOX.left,
        top: ALERT_BOX.top,
        width: ALERT_BOX.width,
        height: ALERT_BOX.height,
        boxSizing: 'border-box',
        borderRadius: RADIUS.lg,
        border: `2px solid ${stress > 0.02 ? alpha(C.cyan, 0.3 + 0.4 * stress) : C.ink600}`,
        background: `linear-gradient(180deg, ${C.ink850} 0%, ${C.ink900} 100%)`,
        boxShadow: `0 24px 60px ${alpha('#000000', 0.35)}${stress > 0.02 ? `, 0 0 ${Math.round(30 * stress)}px ${alpha(C.cyan, 0.25 * stress)}` : ''}`,
        fontFamily: FONT.sans,
        opacity: p,
        transform: `translateY(${(1 - p) * 16}px)`,
      }}
    >
      <div style={{ position: 'absolute', left: 28, top: 26, display: 'flex', alignItems: 'center', gap: 18 }}>
        <BellOff size={60} />
        <div style={{ fontSize: 36, fontWeight: 750, lineHeight: 1.18, color: C.text, whiteSpace: 'nowrap' }}>
          <div>{ALERTS.head[0]}</div>
          <div>{ALERTS.head[1]}</div>
        </div>
      </div>
      <div style={{ position: 'absolute', right: 40, top: 14, fontSize: 104, fontWeight: 850, lineHeight: 1, color: zeroColor, textShadow: stress > 0.02 ? `0 0 26px ${alpha(C.cyan, 0.5 * stress)}` : undefined, fontVariantNumeric: 'tabular-nums' }}>
        {ALERTS.zero}
      </div>
      <div style={{ position: 'absolute', left: 28, right: 28, top: 134, height: 2, background: C.ink700 }} />
      <div style={{ position: 'absolute', left: 28, top: 150, opacity: rule, transform: `translateY(${(1 - rule) * 10}px)`, whiteSpace: 'nowrap' }}>
        <div style={{ fontSize: 28, fontWeight: 700, color: C.muted }}>{ALERTS.ruleLabel}</div>
        <div style={{ marginTop: 4, fontSize: 34, fontWeight: 700, color: C.text }}>{ALERTS.rule[0]}</div>
        <div style={{ marginTop: 2, display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: 34, fontWeight: 700, color: C.text }}>{ALERTS.rule[1]}</span>
          <Chip accent="muted" size={30} style={stress > 0.02 ? { borderColor: alpha(C.cyan, 0.6 * stress + 0.3), color: zeroColor } : undefined}>
            {ALERTS.fired}
          </Chip>
        </div>
      </div>
    </div>
  );
}

function BellOff({ size = 56 }: { size?: number }) {
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <Icon name="bell" size={size} color={C.muted} strokeWidth={1.8} />
      <svg width={size} height={size} viewBox="0 0 24 24" style={{ position: 'absolute', left: 0, top: 0 }}>
        <line x1={3.5} y1={3.5} x2={20.5} y2={20.5} stroke={C.ink900} strokeWidth={4} strokeLinecap="round" />
        <line x1={3.5} y1={3.5} x2={20.5} y2={20.5} stroke={C.muted} strokeWidth={1.9} strokeLinecap="round" />
      </svg>
    </div>
  );
}

// ---------------------------------------------------------------------------
// s04-04: the query, row by row as the voice names it; the 30 nights tick by.
// ---------------------------------------------------------------------------

export const QUERY_BOX = { left: 0, top: 120, width: 1030, height: 520 } as const;
const ROW = { top: 112, pitch: 82, iconBox: 54, textMax: 36 } as const;

export function QueryPanel({
  frame,
  at,
  rowAt,
  scanFrom,
  scanTo,
  opacity = 1,
}: {
  frame: number;
  at: number;
  rowAt: number[];
  scanFrom: number;
  scanTo: number;
  opacity?: number;
}) {
  if (frame < at - 2) return null;
  const p = progress(frame, at, 18);
  const textW = QUERY_BOX.width - 2 * 30 - ROW.iconBox - 20;
  const nights = QUERY.nights;
  const tickGap = 10;
  const tickW = (QUERY_BOX.width - 60 - tickGap * (nights - 1)) / nights;
  const scanned = frame < scanFrom ? 0 : Math.min(nights, Math.floor(mix(0, nights + 0.999, (frame - scanFrom) / Math.max(1, scanTo - scanFrom))));
  const ticksIn = progress(frame, rowAt[rowAt.length - 1] + 2, 14);
  const running = scanned > 0 && scanned < nights ? 1 : 0;
  return (
    <div style={{ position: 'absolute', left: QUERY_BOX.left, top: QUERY_BOX.top, opacity: p * opacity, transform: `translateY(${(1 - p) * 18}px)` }}>
      <Panel accent="emerald" glow={0.25 + 0.35 * running} style={{ width: QUERY_BOX.width, height: QUERY_BOX.height }}>
        <div style={{ position: 'absolute', left: 30, top: 22, right: 30, height: 56, display: 'flex', alignItems: 'center', gap: 16, whiteSpace: 'nowrap', fontFamily: FONT.sans }}>
          <Icon name="search" size={42} color={C.emerald} strokeWidth={2.3} />
          <span style={{ fontSize: 40, fontWeight: 850, color: C.textStrong, letterSpacing: -0.4 }}>{QUERY.head}</span>
          <span style={{ marginLeft: 'auto', fontFamily: FONT.mono, fontSize: 34, fontWeight: 800, color: C.text, padding: '6px 18px', borderRadius: RADIUS.sm, background: alpha(C.ink700, 0.8), border: `2px solid ${C.ink600}` }}>{QUERY.date}</span>
        </div>
        <div style={{ position: 'absolute', left: 30, right: 30, top: 92, height: 2, background: C.ink700 }} />
        {QUERY.rows.map((r, i) => {
          if (frame < rowAt[i] - 6) return null;
          const hot = windowWeight(frame, rowAt[i] - 4, (rowAt[i + 1] ?? rowAt[i] + 40) - 4, { ramp: 8 });
          const size = fitSize(r.text, textW, ROW.textMax);
          return (
            <div
              key={r.text}
              style={{
                position: 'absolute',
                left: 18,
                right: 18,
                top: ROW.top + i * ROW.pitch,
                height: ROW.pitch - 12,
                borderRadius: RADIUS.sm,
                background: alpha(C.emerald, 0.1 * hot),
                display: 'flex',
                alignItems: 'center',
                gap: 20,
                padding: '0 12px',
                whiteSpace: 'nowrap',
                fontFamily: FONT.sans,
                ...enter(frame, rowAt[i] - 6, { distance: 14, axis: 'x' }),
              }}
            >
              <div style={{ width: ROW.iconBox, height: ROW.iconBox, borderRadius: 14, display: 'grid', placeItems: 'center', background: alpha(C.emerald, 0.12), border: `2px solid ${alpha(C.emerald, 0.35 + 0.4 * hot)}`, flexShrink: 0 }}>
                <Icon name={r.icon} size={32} color={C.emerald} strokeWidth={2.1} />
              </div>
              <span style={{ fontSize: size, fontWeight: 750, color: C.textStrong }}>{r.text}</span>
            </div>
          );
        })}
        {/* the 30 nights */}
        {ticksIn > 0.001 ? (
          <div style={{ position: 'absolute', left: 30, top: 448, width: QUERY_BOX.width - 60, height: 40, opacity: ticksIn }}>
            {Array.from({ length: nights }, (_, k) => {
              const on = k < scanned;
              const head = k === scanned - 1 && running;
              return (
                <div
                  key={k}
                  style={{
                    position: 'absolute',
                    left: k * (tickW + tickGap),
                    top: head ? 0 : 6,
                    width: tickW,
                    height: head ? 40 : 28,
                    borderRadius: 5,
                    background: on ? alpha(C.emerald, head ? 0.95 : 0.55) : C.ink700,
                    boxShadow: head ? `0 0 14px ${alpha(C.emerald, 0.7)}` : undefined,
                  }}
                />
              );
            })}
          </div>
        ) : null}
      </Panel>
    </div>
  );
}

// ---------------------------------------------------------------------------
// s04-04: THREAT HUNTING, then «sales tú de caza».
// ---------------------------------------------------------------------------

export const NAME_BOX = { left: 1068, top: 124, width: 660 } as const;

export function HuntName({ frame, fps, at, taglineAt, spinFrom }: { frame: number; fps: number; at: number; taglineAt: number; spinFrom: number }) {
  if (frame < at - 6) return null;
  const p = springIn(frame, fps, at, { damping: 16 });
  const t = progress(frame, taglineAt, 14);
  const nameSize = fitSize(HUNT.name, NAME_BOX.width - 52 - 16, 58);
  return (
    <div style={{ position: 'absolute', left: NAME_BOX.left, top: NAME_BOX.top, width: NAME_BOX.width, fontFamily: FONT.sans }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, whiteSpace: 'nowrap', opacity: clamp01(p * 1.3), transform: `translateY(${(1 - Math.min(1, p)) * 16}px)` }}>
        <Icon name="mortarboard" size={52} color={C.violet} strokeWidth={2} />
        <span style={{ fontSize: nameSize, fontWeight: 850, letterSpacing: -0.5, color: VIOLET_SOFT, textShadow: `0 0 26px ${alpha(C.violet, 0.4)}` }}>{HUNT.name}</span>
      </div>
      {t > 0.001 ? (
        <div style={{ marginTop: 18, display: 'flex', alignItems: 'center', gap: 16, whiteSpace: 'nowrap', opacity: t, transform: `translateX(${(1 - t) * 14}px)` }}>
          <MeterDial size={56} spinFrom={spinFrom} frame={frame} glow={0.5} />
          <span style={{ fontSize: 48, fontWeight: 800, letterSpacing: -0.5, color: EMERALD_SOFT }}>{HUNT.tagline}</span>
        </div>
      ) : null}
    </div>
  );
}

import type { CSSProperties, ReactNode } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { C, FONT, alpha } from '../../../../engine/src/theme/tokens';
import { EASE, progress, pulse, springIn } from '../../../../engine/src/theme/motion';
import { clamp01, windowWeight } from '../../../../engine/src/ui';

/**
 * Image 1, the neighbours' warning note: a paper notice pinned to the wall,
 * «número de un timador», then the lines that read the STIX fields in plain
 * words — «avisa: la asociación», «se fía: bastante», «no lo cuentes fuera de
 * casa», «vale hasta el 25 de junio». Identical wherever it comes back (s02,
 * s03, the mini in s06 rule-1).
 *
 * s03 state (`reassignAt`, `lockAt`, `labelAt`): the number passes to a new
 * owner — a small clinic to the right of the paper — and a padlock falls on
 * her: «a ciegas, castigas a quien lo herede». Nothing is said about the
 * domain itself.
 *
 * Drawn in design units and scaled so the whole piece (paper, plus the clinic
 * slot and the label band when used) is `width` px wide. All frames are
 * Sequence-relative; `frame` defaults to useCurrentFrame().
 */

export type NoteLineId = 'number' | 'source' | 'confidence' | 'share' | 'until';

export const NOTE_TEXT = {
  number: 'número de un timador',
  source: { lead: 'avisa:', rest: 'la asociación' },
  confidence: { lead: 'se fía:', rest: 'bastante' },
  share: 'no lo cuentes fuera de casa',
  until: 'vale hasta el 25 de junio',
  blind: 'a ciegas, castigas a quien lo herede',
} as const;

/** The four body lines, top to bottom (the title is the number line). */
export const NOTE_BODY: NoteLineId[] = ['source', 'confidence', 'share', 'until'];

/** Design units. */
export const NOTE_BASE = {
  /** The paper. */
  w: 600,
  h: 392,
  /** Clinic slot to the right of the paper (s03). */
  gap: 44,
  clinicW: 250,
  /** Label band under paper + clinic (s03). */
  labelGap: 22,
  labelH: 58,
} as const;
/** Default px width of the mini (paper only). */
export const NOTE_MINI_W = 300;

const PAD_X = 40;
const TITLE_Y = 46;
const TITLE_H = 64;
const BODY_Y = 134;
const LINE_H = 60;

/** Clinic slot (design units, piece-local) and the reassignment arrow from the note's handset to her roof. */
const CLINIC_X = NOTE_BASE.w + NOTE_BASE.gap;
const CLINIC_H = 250;
const CLINIC_TOP = NOTE_BASE.h - CLINIC_H;
const CLINIC_BODY_TOP = 92;
const ARROW_START = { x: PAD_X + 30, y: TITLE_Y + 2 } as const;
const ARROW_END = { x: CLINIC_X + 64, y: CLINIC_TOP + CLINIC_BODY_TOP - 10 } as const;
const ARROW_D = `M ${ARROW_START.x} ${ARROW_START.y} Q ${(ARROW_START.x + ARROW_END.x) / 2} -120 ${ARROW_END.x} ${ARROW_END.y}`;

const PAPER = '#f2e8cf';
const PAPER_EDGE = '#d9c9a3';
const INK = '#1e293b';
const INK_SOFT = '#55657a';
/** Ink and highlighter colours per line (readable on paper). */
const LINE_STYLE: Record<NoteLineId, { ink: string; marker: string }> = {
  number: { ink: '#9f1239', marker: '#fda4af' },
  source: { ink: '#075985', marker: '#7dd3fc' },
  confidence: { ink: '#075985', marker: '#7dd3fc' },
  share: { ink: '#92400e', marker: '#fcd34d' },
  until: { ink: '#92400e', marker: '#fcd34d' },
};

export interface NoteOptions {
  /** The clinic slot (s03 reassignment). */
  clinic?: boolean;
  /** The «a ciegas…» band under it. */
  label?: boolean;
}

function baseSize({ clinic = false, label = false }: NoteOptions): { w: number; h: number } {
  const w = NOTE_BASE.w + (clinic ? NOTE_BASE.gap + NOTE_BASE.clinicW : 0);
  const h = NOTE_BASE.h + (label ? NOTE_BASE.labelGap + NOTE_BASE.labelH : 0);
  return { w, h };
}

/**
 * Size in px of a NeighbourNote drawn `width` px wide. Pass `clinic: true`
 * when you give it `reassignAt`, `label: true` when you give it `labelAt`.
 */
export function neighbourNoteSize(width: number = NOTE_BASE.w, opts: NoteOptions = {}): { w: number; h: number; scale: number } {
  const b = baseSize(opts);
  const s = width / b.w;
  return { w: width, h: b.h * s, scale: s };
}

/** Box of one line in px from the piece's top-left (y and centre), at `width`. */
export function noteLineBox(id: NoteLineId, width: number = NOTE_BASE.w, opts: NoteOptions = {}): { x: number; y: number; h: number; cy: number } {
  const s = width / baseSize(opts).w;
  const y = id === 'number' ? TITLE_Y : BODY_Y + NOTE_BODY.indexOf(id) * LINE_H;
  const h = id === 'number' ? TITLE_H : LINE_H;
  return { x: PAD_X * s, y: y * s, h: h * s, cy: (y + h / 2) * s };
}

/** A hand-drawn phone handset (stroke only), the scammer's «number». */
function Handset({ size, color, strokeWidth = 2.2 }: { size: number; color: string; strokeWidth?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block', flexShrink: 0 }}>
      <path d="M7 3.5h3l1.5 4.5-2.2 1.6c1 2.4 2.7 4.1 5.1 5.1l1.6-2.2 4.5 1.5v3c0 1.1-.9 2-2 2C10.9 19 5 13.1 5 5.5c0-1.1.9-2 2-2z" />
    </svg>
  );
}

export function NeighbourNote({
  at,
  lineAt,
  focus = [],
  reassignAt,
  lockAt,
  labelAt,
  width,
  mini = false,
  dim = 0,
  glow = 0,
  frame: frameProp,
  style,
}: {
  /** Frame the paper is pinned up. Undefined: already on screen. */
  at?: number;
  /** When each line is written. Omitted: every line already written. Given: only the listed lines appear, at their frames. */
  lineAt?: Partial<Record<NoteLineId, number>>;
  /** Highlighter windows behind a line (the voice is on it). */
  focus?: { id: NoteLineId; from: number; to?: number }[];
  /** s03: the number passes to the clinic (the clinic appears and the arrow draws). */
  reassignAt?: number;
  /** s03: the padlock falls on the clinic. */
  lockAt?: number;
  /** s03: «a ciegas, castigas a quien lo herede» under paper and clinic. */
  labelAt?: number;
  /** Width in px of the whole piece (default its design width, or NOTE_MINI_W when `mini`). */
  width?: number;
  /** Small illustration (s06): paper only, thicker strokes. */
  mini?: boolean;
  dim?: number;
  /** 0–1 warm halo around the paper. */
  glow?: number;
  frame?: number;
  style?: CSSProperties;
}) {
  const current = useCurrentFrame();
  const { fps } = useVideoConfig();
  const frame = frameProp ?? current;
  const clinic = !mini && reassignAt !== undefined;
  const label = !mini && labelAt !== undefined;
  const base = baseSize({ clinic, label });
  const w = width ?? (mini ? NOTE_MINI_W : base.w);
  const s = w / base.w;

  const show = at === undefined ? 1 : progress(frame, at, 16);
  if (show <= 0) return null;
  const lineP = (id: NoteLineId) => {
    if (!lineAt) return 1;
    const f = lineAt[id];
    return f === undefined ? 0 : progress(frame, f, 16, EASE.out);
  };
  const marker = (id: NoteLineId) => Math.max(0, ...focus.filter((f) => f.id === id).map((f) => windowWeight(frame, f.from, f.to ?? Number.POSITIVE_INFINITY, { ramp: 8, lead: 3 })));

  const g = clamp01(glow);
  const d = clamp01(dim);
  const tilt = -1.2 - (1 - show) * 3;
  const stroke = mini ? 3 : 2;

  // s03: clinic, arrow, padlock, label.
  const clinicIn = reassignAt === undefined ? 0 : progress(frame, reassignAt, 16);
  const arrow = reassignAt === undefined ? 0 : progress(frame, reassignAt + 6, 22, EASE.inOut);
  const lockDrop = lockAt === undefined ? 0 : springIn(frame, fps, lockAt, { damping: 11, mass: 0.7 });
  const lockGlow = lockAt === undefined ? 0 : progress(frame, lockAt + 4, 10) * (0.75 + 0.25 * pulse(frame, fps, 0.6));
  const labelIn = labelAt === undefined ? 0 : progress(frame, labelAt, 16);

  const writeLine = (id: NoteLineId, content: ReactNode, y: number, h: number) => {
    const p = lineP(id);
    if (p <= 0) return null;
    const m = marker(id);
    return (
      <div key={id} style={{ position: 'absolute', left: PAD_X, top: y, height: h, display: 'flex', alignItems: 'center' }}>
        <div
          style={{
            position: 'relative',
            height: h,
            display: 'inline-flex',
            alignItems: 'center',
            whiteSpace: 'nowrap',
            clipPath: p < 1 ? `inset(-10px ${(1 - p) * 100}% -10px -20px)` : undefined,
          }}
        >
          {/* Highlighter stroke behind the words while the voice is on this line. */}
          {m > 0.01 ? (
            <div
              style={{
                position: 'absolute',
                left: -10,
                top: h * 0.16,
                height: h * 0.7,
                width: `calc(${m * 100}% + 20px)`,
                borderRadius: 6,
                background: alpha(LINE_STYLE[id].marker, 0.62),
                transform: 'skewX(-8deg)',
              }}
            />
          ) : null}
          <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>{content}</span>
        </div>
      </div>
    );
  };

  return (
    <div style={{ position: 'relative', width: w, height: base.h * s, opacity: show * (1 - 0.6 * d), filter: d > 0.001 ? `saturate(${1 - 0.5 * d})` : undefined, ...style }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: base.w, height: base.h, transform: `scale(${s})`, transformOrigin: '0 0', fontFamily: FONT.sans }}>
        {/* The paper */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: NOTE_BASE.w,
            height: NOTE_BASE.h,
            transform: `translateY(${(1 - show) * -26}px) rotate(${tilt}deg)`,
            transformOrigin: '50% 0',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: 6,
              background: `linear-gradient(180deg, ${PAPER} 0%, #ede1c4 100%)`,
              border: `${stroke}px solid ${PAPER_EDGE}`,
              boxShadow: `0 22px 48px ${alpha('#000000', 0.45)}${g > 0 ? `, 0 0 ${30 + 26 * g}px ${alpha(C.amber, 0.35 * g)}` : ''}`,
            }}
          />
          {/* Ruled lines */}
          {NOTE_BODY.map((id, i) => (
            <div
              key={id}
              style={{ position: 'absolute', left: PAD_X - 6, right: PAD_X - 6, top: BODY_Y + (i + 1) * LINE_H - 8, height: 2, background: alpha('#8b7a55', 0.22) }}
            />
          ))}
          {/* Pin */}
          <div
            style={{
              position: 'absolute',
              left: NOTE_BASE.w / 2 - 15,
              top: -12,
              width: 30,
              height: 30,
              borderRadius: '50%',
              background: `radial-gradient(circle at 35% 35%, #fda4af 0%, ${C.rose} 55%, #9f1239 100%)`,
              boxShadow: `0 6px 10px ${alpha('#000000', 0.45)}`,
            }}
          />
          {/* Title: the number */}
          {writeLine(
            'number',
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 14 }}>
              <Handset size={46} color={LINE_STYLE.number.ink} strokeWidth={mini ? 2.8 : 2.2} />
              <span style={{ fontSize: 42, fontWeight: 850, color: LINE_STYLE.number.ink, letterSpacing: -0.5 }}>{NOTE_TEXT.number}</span>
            </span>,
            TITLE_Y,
            TITLE_H,
          )}
          {/* Separator under the title */}
          <div style={{ position: 'absolute', left: PAD_X - 6, right: PAD_X - 6, top: TITLE_Y + TITLE_H + 6, height: 3, background: alpha(LINE_STYLE.number.ink, 0.3 * lineP('number')) }} />
          {/* Body lines */}
          {writeLine(
            'source',
            <span style={{ fontSize: 38, fontWeight: 650, color: INK_SOFT }}>
              {NOTE_TEXT.source.lead} <span style={{ fontWeight: 800, color: LINE_STYLE.source.ink }}>{NOTE_TEXT.source.rest}</span>
            </span>,
            BODY_Y,
            LINE_H,
          )}
          {writeLine(
            'confidence',
            <span style={{ fontSize: 38, fontWeight: 650, color: INK_SOFT }}>
              {NOTE_TEXT.confidence.lead} <span style={{ fontWeight: 800, color: LINE_STYLE.confidence.ink }}>{NOTE_TEXT.confidence.rest}</span>
            </span>,
            BODY_Y + LINE_H,
            LINE_H,
          )}
          {writeLine('share', <span style={{ fontSize: 38, fontWeight: 800, color: LINE_STYLE.share.ink }}>{NOTE_TEXT.share}</span>, BODY_Y + 2 * LINE_H, LINE_H)}
          {writeLine('until', <span style={{ fontSize: 38, fontWeight: 800, color: INK }}>{NOTE_TEXT.until}</span>, BODY_Y + 3 * LINE_H, LINE_H)}
        </div>

        {/* s03: the number passes to the clinic, and the padlock falls on her */}
        {clinic && clinicIn > 0 ? (
          <>
            <svg width={base.w} height={NOTE_BASE.h} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
              <defs>
                {/* Reveals the dashed arrow progressively along its length. */}
                <mask id="nn-arrow-reveal" maskUnits="userSpaceOnUse" x={-200} y={-300} width={base.w + 400} height={NOTE_BASE.h + 600}>
                  <path d={ARROW_D} fill="none" stroke="#ffffff" strokeWidth={14} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - arrow} />
                </mask>
              </defs>
              <path d={ARROW_D} fill="none" stroke={alpha(C.text, 0.9)} strokeWidth={4} strokeLinecap="round" strokeDasharray="14 12" mask="url(#nn-arrow-reveal)" opacity={clinicIn} />
            </svg>
            <ClinicArrowHead x={ARROW_END.x} y={ARROW_END.y} show={arrow} />
            <div style={{ position: 'absolute', left: CLINIC_X, top: CLINIC_TOP, width: NOTE_BASE.clinicW, height: CLINIC_H, opacity: clinicIn, transform: `translateY(${(1 - clinicIn) * 14}px)` }}>
              <Clinic w={NOTE_BASE.clinicW} lockDrop={lockAt === undefined ? -1 : lockDrop} lockGlow={lockGlow} />
            </div>
          </>
        ) : null}

        {/* s03 label */}
        {label && labelIn > 0 ? (
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: NOTE_BASE.h + NOTE_BASE.labelGap,
              width: base.w,
              height: NOTE_BASE.labelH,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 42,
              fontWeight: 800,
              color: C.roseSoft,
              whiteSpace: 'nowrap',
              letterSpacing: -0.3,
              opacity: labelIn,
              transform: `translateY(${(1 - labelIn) * 12}px)`,
              textShadow: `0 0 22px ${alpha(C.rose, 0.35)}`,
            }}
          >
            {NOTE_TEXT.blind}
          </div>
        ) : null}
      </div>
    </div>
  );
}

/** Arrow head where the reassignment arrow lands on the clinic. */
function ClinicArrowHead({ x, y, show }: { x: number; y: number; show: number }) {
  if (show < 0.9) return null;
  // Points down onto the roof; the curve arrives from the upper left.
  return (
    <svg width={40} height={40} style={{ position: 'absolute', left: x - 20, top: y - 22, overflow: 'visible', opacity: clamp01((show - 0.9) / 0.1) }}>
      <polygon points="4,6 34,10 16,32" fill={alpha(C.text, 0.95)} />
    </svg>
  );
}

/**
 * The new owner: a small clinic (a cross on the roof sign, a door, two
 * windows) with the number's handset on her sign. `lockDrop` (spring 0→1,
 * −1 = no padlock) brings a rose padlock down onto her door.
 */
function Clinic({ w, lockDrop, lockGlow }: { w: number; lockDrop: number; lockGlow: number }) {
  const h = CLINIC_H;
  const bodyTop = CLINIC_BODY_TOP;
  const lockY = -120 + (bodyTop + 70 + 120) * Math.max(0, lockDrop);
  return (
    <div style={{ position: 'relative', width: w, height: h }}>
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        {/* Sign with the cross */}
        <rect x={w / 2 - 34} y={18} width={68} height={58} rx={10} fill={alpha(C.text, 0.08)} stroke={C.text} strokeWidth={3} />
        <path d={`M ${w / 2 - 6} 30 h 12 v 12 h 12 v 12 h -12 v 12 h -12 v -12 h -12 v -12 h 12 z`} fill={C.textStrong} />
        <line x1={w / 2} y1={76} x2={w / 2} y2={bodyTop} stroke={C.text} strokeWidth={3} />
        {/* Building */}
        <rect x={16} y={bodyTop} width={w - 32} height={h - bodyTop - 6} rx={8} fill={alpha(C.ink700, 0.9)} stroke={C.text} strokeWidth={3} />
        <rect x={34} y={bodyTop + 26} width={48} height={40} rx={4} fill={alpha(C.cyanSoft, 0.18)} stroke={alpha(C.text, 0.7)} strokeWidth={2} />
        <rect x={w - 82} y={bodyTop + 26} width={48} height={40} rx={4} fill={alpha(C.cyanSoft, 0.18)} stroke={alpha(C.text, 0.7)} strokeWidth={2} />
        <rect x={w / 2 - 28} y={bodyTop + 70} width={56} height={h - bodyTop - 76} rx={4} fill={alpha(C.ink900, 0.9)} stroke={alpha(C.text, 0.8)} strokeWidth={2} />
      </svg>
      {/* The number now rings here */}
      <div style={{ position: 'absolute', left: w / 2 - 22, top: bodyTop + 22, width: 44, height: 44, display: 'grid', placeItems: 'center', borderRadius: 10, background: alpha(C.ink900, 0.9), border: `2px solid ${alpha(C.text, 0.6)}` }}>
        <Handset size={30} color={C.textStrong} />
      </div>
      {/* Padlock */}
      {lockDrop >= 0 && lockDrop > 0.001 ? (
        <svg
          width={110}
          height={120}
          viewBox="0 0 110 120"
          style={{
            position: 'absolute',
            left: w / 2 - 55,
            top: lockY,
            overflow: 'visible',
            filter: lockGlow > 0 ? `drop-shadow(0 0 ${Math.round(16 * lockGlow)}px ${alpha(C.rose, 0.8)})` : undefined,
          }}
        >
          <path d="M28 52V36a27 27 0 0 1 54 0v16" fill="none" stroke={C.rose} strokeWidth={11} strokeLinecap="round" />
          <rect x={12} y={50} width={86} height={64} rx={12} fill={C.rose} />
          <circle cx={55} cy={78} r={9} fill={C.roseDeep} />
          <rect x={51} y={80} width={8} height={18} rx={3} fill={C.roseDeep} />
        </svg>
      ) : null}
    </div>
  );
}

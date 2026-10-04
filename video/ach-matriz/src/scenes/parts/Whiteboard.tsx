import type { CSSProperties, ReactNode } from 'react';
import { useCurrentFrame } from 'remotion';
import { C, FONT, RADIUS, alpha } from '../../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../../engine/src/theme/motion';
import { clamp01, windowWeight } from '../../../../engine/src/ui';

/**
 * Image «la pizarra de la sala» (s01, s02, poster): the whiteboard in
 * Meridian's analysis room. Four sticky notes, the lesson's evidence in short
 * («entrada por spearphishing», «6 meses sin cifrar ni extorsionar»,
 * «exfiltración selectiva de diseños de propulsión», «certificado TLS
 * compartido con una campaña de espionaje que reportó el ISAC»); next to each
 * the marker word «encaja» (never a tick, never a C) with a stroke towards the
 * centre; in the centre «ESPIONAJE», circled, «todo encaja» under it. s02: the
 * devil's advocate writes «¿y si es un rescate?» at the bottom.
 *
 * Hand-drawn feel: notes slightly askew, marker text written left to right,
 * the circle and strokes drawn along their path. Drawn in design units
 * (WHITEBOARD_BASE, 1480 × 640 with the tray) scaled to `width`; frames are
 * Sequence-relative; `frame` defaults to useCurrentFrame(). Reveal props:
 * omitted → already written, except `question` and `header` (opt-in).
 */

export const WHITEBOARD_TEXT = {
  notes: [
    ['entrada por', 'spearphishing'],
    ['6 meses sin cifrar', 'ni extorsionar'],
    ['exfiltración', 'selectiva de', 'diseños de', 'propulsión'],
    ['certificado TLS', 'compartido con', 'una campaña de', 'espionaje que', 'reportó el ISAC'],
  ] as const,
  fits: 'encaja',
  centre: 'ESPIONAJE',
  allFit: 'todo encaja',
  question: '¿y si es un rescate?',
  header: 'Meridian Dynamics · reunión de análisis',
} as const;

/** Note index: 0 E1 (top left), 1 E2 (bottom left), 2 E3 (top right), 3 E4 (bottom right). */
export type BoardNote = 0 | 1 | 2 | 3;

export const WHITEBOARD_BASE = { w: 1480, h: 640, boardH: 612 } as const;

const NOTE_W = 370;
const NOTE_H = 226;
const NOTE_POS: readonly { x: number; y: number; rot: number }[] = [
  { x: 44, y: 40, rot: -2.2 },
  { x: 44, y: 352, rot: 1.6 },
  { x: WHITEBOARD_BASE.w - 44 - NOTE_W, y: 40, rot: 1.8 },
  { x: WHITEBOARD_BASE.w - 44 - NOTE_W, y: 352, rot: -1.4 },
];
const CENTRE = { x: 740, y: 296 };
const ELLIPSE = { rx: 262, ry: 96 };

const MARKER = '#1e3a8a';
const TEAL = '#0f766e';
const NOTE_PAPER = '#cffafe';
const NOTE_EDGE = '#a5e4ee';
const NOTE_INK = '#0f2a4a';

/** «encaja» tag position (centre) per note: on the board beside the note's inner edge, at its middle. */
const fitPos = (i: BoardNote) => {
  const n = NOTE_POS[i];
  const left = i < 2;
  return { x: left ? n.x + NOTE_W + 80 : n.x - 80, y: n.y + 60, left };
};

/** Size in px of the whiteboard at `width` (default design width). */
export function whiteboardSize(width?: number): { w: number; h: number; scale: number } {
  const s = (width ?? WHITEBOARD_BASE.w) / WHITEBOARD_BASE.w;
  return { w: WHITEBOARD_BASE.w * s, h: WHITEBOARD_BASE.h * s, scale: s };
}

/** Box (px from the board's top-left) of a note, for anchoring a pointer or a card. */
export function whiteboardNoteBox(i: BoardNote, width?: number): { x: number; y: number; w: number; h: number } {
  const { scale: s } = whiteboardSize(width);
  const n = NOTE_POS[i];
  return { x: n.x * s, y: n.y * s, w: NOTE_W * s, h: NOTE_H * s };
}

/** Where «¿y si es un rescate?» is written (px), e.g. to place a hand / marker over it. */
export function whiteboardQuestionBox(width?: number): { x: number; y: number; w: number; h: number } {
  const { scale: s } = whiteboardSize(width);
  return { x: 500 * s, y: 518 * s, w: 480 * s, h: 64 * s };
}

type Quad = number | readonly [number, number, number, number];
const quad = (v: Quad | undefined, i: number, step: number): number | undefined =>
  v === undefined ? undefined : typeof v === 'number' ? v + i * step : v[i];

/**
 * Whiteboard — props:
 *   width?        px (default 1480)
 *   at?           frame the board appears. Omitted: on screen.
 *   notesAt?      frame the notes stick on (staggered 8) or one per note. Omitted: stuck.
 *   fitsAt?       frame «encaja» is written by each note (staggered 10) or one per note. Omitted: written.
 *   centreAt?     frame «ESPIONAJE» is written. Omitted: written.
 *   circleAt?     frame the circle is drawn (default centreAt + 16). Omitted with no centreAt: drawn.
 *   allFitAt?     frame «todo encaja» is written (with its underline). Omitted: written.
 *   question?     s02: «¿y si es un rescate?» — false (default, s01), true (written), or the frame it is written.
 *   questionTone? marker colour of the question (default amber-dark #b45309).
 *   header?       «Meridian Dynamics · reunión de análisis» on a strip at the board's top edge —
 *                 false (default), true, or the frame it appears. It straddles the frame and overhangs
 *                 ~24 design units ABOVE the box `whiteboardSize` reports: leave that room.
 *   focus?        [{ target: 0–3 | 'centre' | 'question', from, to? }] — a soft cyan glow behind it, the rest dimmed.
 *   dim?, glow? (0–1 cyan halo), frame?, style?
 */
export function Whiteboard({
  width,
  at,
  notesAt,
  fitsAt,
  centreAt,
  circleAt,
  allFitAt,
  question = false,
  questionTone = '#b45309',
  header = false,
  focus = [],
  dim = 0,
  glow = 0,
  frame: frameProp,
  style,
}: {
  width?: number;
  at?: number;
  notesAt?: Quad;
  fitsAt?: Quad;
  centreAt?: number;
  circleAt?: number;
  allFitAt?: number;
  question?: boolean | number;
  questionTone?: string;
  header?: boolean | number;
  focus?: { target: BoardNote | 'centre' | 'question'; from: number; to?: number }[];
  dim?: number;
  glow?: number;
  frame?: number;
  style?: CSSProperties;
}) {
  const current = useCurrentFrame();
  const frame = frameProp ?? current;
  const size = whiteboardSize(width);
  const s = size.scale;
  const W = WHITEBOARD_BASE.w;
  const BH = WHITEBOARD_BASE.boardH;

  const show = at === undefined ? 1 : progress(frame, at, 16);
  if (show <= 0) return null;
  const p = (f: number | undefined, dur = 18) => (f === undefined ? 1 : progress(frame, f, dur, EASE.inOut));

  const fw = (t: BoardNote | 'centre' | 'question') =>
    Math.max(0, ...focus.filter((f) => f.target === t).map((f) => windowWeight(frame, f.from, f.to ?? Number.POSITIVE_INFINITY, { ramp: 10, lead: 4 })));
  const anyFocus = Math.max(0, ...([0, 1, 2, 3, 'centre', 'question'] as const).map(fw));
  const dimOf = (t: BoardNote | 'centre' | 'question') => anyFocus * (1 - fw(t));
  const dimCss = (dd: number): CSSProperties => ({ opacity: 1 - 0.55 * dd, filter: dd > 0.001 ? `saturate(${1 - 0.5 * dd})` : undefined });

  const centreP = p(centreAt, 22);
  const circleP = circleAt !== undefined ? p(circleAt, 26) : centreAt !== undefined ? p(centreAt + 16, 26) : 1;
  const allFitP = p(allFitAt, 18);
  const questionP = question === false ? 0 : question === true ? 1 : p(question, 26);
  const headerP = header === false ? 0 : header === true ? 1 : progress(frame, header, 14);
  const d = clamp01(dim);
  const g = clamp01(glow);

  return (
    <div style={{ position: 'relative', width: size.w, height: size.h, opacity: show * (1 - 0.6 * d), filter: d > 0.001 ? `saturate(${1 - 0.5 * d})` : undefined, ...style }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: W, height: WHITEBOARD_BASE.h, transform: `scale(${s})`, transformOrigin: '0 0', fontFamily: FONT.sans }}>
        {/* Board: aluminium frame + slightly grey surface (not a glaring white) */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: W,
            height: BH,
            boxSizing: 'border-box',
            borderRadius: 14,
            border: '12px solid #9aa8ba',
            background: 'linear-gradient(160deg, #eef2f6 0%, #dfe5ec 55%, #d6dde6 100%)',
            boxShadow: `0 30px 70px ${alpha('#000000', 0.5)}, inset 0 0 0 2px ${alpha('#ffffff', 0.5)}${g > 0 ? `, 0 0 ${Math.round(30 + 30 * g)}px ${alpha(C.cyan, 0.35 * g)}` : ''}`,
          }}
        />
        {/* Faint ghosts of old erased writing (texture) */}
        <svg width={W} height={BH} style={{ position: 'absolute', left: 0, top: 0 }}>
          <path d="M620 92 C690 82 760 100 830 88 M650 122 C720 114 790 128 850 118" stroke={alpha('#64748b', 0.12)} strokeWidth={10} fill="none" strokeLinecap="round" />
        </svg>
        {/* Tray with two markers */}
        <div style={{ position: 'absolute', left: 120, top: BH - 6, width: W - 240, height: 22, borderRadius: '0 0 10px 10px', background: 'linear-gradient(180deg, #8392a6 0%, #5d6b80 100%)' }} />
        <div style={{ position: 'absolute', left: 300, top: BH - 4, width: 120, height: 14, borderRadius: 7, background: MARKER }} />
        <div style={{ position: 'absolute', left: 440, top: BH - 4, width: 120, height: 14, borderRadius: 7, background: TEAL }} />

        {/* Header strip (opt-in) */}
        {headerP > 0 ? (
          <div
            style={{
              position: 'absolute',
              left: W / 2,
              top: -22,
              transform: 'translateX(-50%)',
              padding: '6px 22px',
              borderRadius: RADIUS.sm,
              background: C.ink900,
              border: `2px solid ${alpha(C.cyan, 0.6)}`,
              color: C.text,
              fontSize: 28,
              fontWeight: 700,
              whiteSpace: 'nowrap',
              opacity: headerP,
            }}
          >
            {WHITEBOARD_TEXT.header}
          </div>
        ) : null}

        {/* Strokes from each «encaja» towards the circle */}
        <svg width={W} height={BH} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
          {([0, 1, 2, 3] as const).map((i) => {
            const f = fitPos(i);
            const fp = p(quad(fitsAt, i, 10) === undefined ? undefined : quad(fitsAt, i, 10)! + 10, 16);
            if (fp <= 0) return null;
            const ex = CENTRE.x + (f.left ? -1 : 1) * (ELLIPSE.rx * 0.72);
            const ey = CENTRE.y + (i % 2 === 0 ? -1 : 1) * (ELLIPSE.ry * 0.75);
            const sx = f.x + (f.left ? 30 : -30);
            const sy = f.y + (i % 2 === 0 ? 28 : -28);
            const mx = (sx + ex) / 2 + (f.left ? -10 : 10);
            const my = (sy + ey) / 2 + (i % 2 === 0 ? 14 : -14);
            return (
              <path
                key={i}
                d={`M ${sx} ${sy} Q ${mx} ${my} ${ex} ${ey}`}
                stroke={alpha(TEAL, 0.75)}
                strokeWidth={5}
                fill="none"
                strokeLinecap="round"
                pathLength={1}
                strokeDasharray="1 1"
                strokeDashoffset={1 - fp}
                style={dimCss(Math.max(dimOf(i), dimOf('centre') * 0.5))}
              />
            );
          })}
        </svg>

        {/* Sticky notes */}
        {([0, 1, 2, 3] as const).map((i) => {
          const n = NOTE_POS[i];
          const t = quad(notesAt, i, 8);
          const np = t === undefined ? 1 : progress(frame, t, 14, EASE.out);
          if (np <= 0) return null;
          const own = fw(i);
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: n.x,
                top: n.y,
                width: NOTE_W,
                height: NOTE_H,
                transform: `rotate(${n.rot}deg) translateY(${(1 - np) * -24}px) scale(${1 + 0.04 * own})`,
                opacity: np,
                ...dimCss(dimOf(i)),
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: 4,
                  background: `linear-gradient(180deg, ${NOTE_PAPER} 0%, #bdf1fa 100%)`,
                  border: `2px solid ${NOTE_EDGE}`,
                  boxShadow: `0 14px 26px ${alpha('#0f172a', 0.28)}${own > 0.01 ? `, 0 0 ${Math.round(28 * own)}px ${alpha(C.cyan, 0.6 * own)}` : ''}`,
                }}
              />
              {/* Adhesive band */}
              <div style={{ position: 'absolute', left: 0, top: 0, width: NOTE_W, height: 22, background: alpha('#67e8f9', 0.35), borderRadius: '4px 4px 0 0' }} />
              <div
                style={{
                  position: 'absolute',
                  inset: '26px 22px 16px 24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  color: NOTE_INK,
                  fontSize: 32,
                  fontWeight: 750,
                  lineHeight: '38px',
                  whiteSpace: 'nowrap',
                }}
              >
                {WHITEBOARD_TEXT.notes[i].map((ln) => (
                  <div key={ln}>{ln}</div>
                ))}
              </div>
            </div>
          );
        })}

        {/* «encaja» by each note */}
        {([0, 1, 2, 3] as const).map((i) => {
          const f = fitPos(i);
          const t = quad(fitsAt, i, 10);
          const wp = p(t, 14);
          if (wp <= 0) return null;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: f.x,
                top: f.y,
                transform: `translate(-50%, -50%) rotate(${f.left ? -7 : 6}deg)`,
                ...dimCss(dimOf(i)),
              }}
            >
              <Written p={wp}>
                <span style={{ fontSize: 40, fontWeight: 800, color: TEAL, letterSpacing: 0.5, padding: '0 10px', background: alpha('#e6ebf0', 0.85), borderRadius: 8 }}>{WHITEBOARD_TEXT.fits}</span>
              </Written>
            </div>
          );
        })}

        {/* Centre: ESPIONAJE, circled */}
        <div style={{ position: 'absolute', left: CENTRE.x, top: CENTRE.y, transform: 'translate(-50%, -50%)', ...dimCss(dimOf('centre')) }}>
          {fw('centre') > 0.01 ? (
            <div style={{ position: 'absolute', left: '50%', top: '50%', width: ELLIPSE.rx * 2.2, height: ELLIPSE.ry * 2.6, transform: 'translate(-50%, -50%)', borderRadius: '50%', background: `radial-gradient(closest-side, ${alpha(C.cyan, 0.28 * fw('centre'))}, transparent)` }} />
          ) : null}
          <Written p={centreP}>
            <span style={{ fontSize: 76, fontWeight: 900, color: MARKER, letterSpacing: 2, lineHeight: 1 }}>{WHITEBOARD_TEXT.centre}</span>
          </Written>
        </div>
        <svg width={W} height={BH} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', ...dimCss(dimOf('centre')) }}>
          {/* A rough hand-drawn loop: one ellipse, slightly open, and a second overlapping pass */}
          <path
            d={roughEllipse(CENTRE.x, CENTRE.y, ELLIPSE.rx, ELLIPSE.ry, -0.12, 1.06)}
            stroke={MARKER}
            strokeWidth={7}
            fill="none"
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray="1 1"
            strokeDashoffset={1 - circleP}
          />
          <path
            d={roughEllipse(CENTRE.x + 6, CENTRE.y - 4, ELLIPSE.rx + 10, ELLIPSE.ry + 6, 0.7, 0.35)}
            stroke={alpha(MARKER, 0.7)}
            strokeWidth={4}
            fill="none"
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray="1 1"
            strokeDashoffset={1 - clamp01((circleP - 0.7) / 0.3)}
          />
        </svg>
        {/* todo encaja */}
        <div style={{ position: 'absolute', left: CENTRE.x, top: CENTRE.y + ELLIPSE.ry + 66, transform: 'translate(-50%, -50%) rotate(-2deg)', ...dimCss(dimOf('centre')) }}>
          <Written p={allFitP}>
            <span style={{ fontSize: 48, fontWeight: 800, color: TEAL, whiteSpace: 'nowrap' }}>{WHITEBOARD_TEXT.allFit}</span>
          </Written>
          <svg width={300} height={20} style={{ position: 'absolute', left: '50%', top: '100%', transform: 'translateX(-50%)', overflow: 'visible' }}>
            <path d="M8 8 C90 2 200 14 292 6" stroke={TEAL} strokeWidth={5} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - clamp01((allFitP - 0.6) / 0.4)} />
          </svg>
        </div>

        {/* s02: the devil's advocate's question */}
        {questionP > 0 ? (
          <div style={{ position: 'absolute', left: CENTRE.x, top: 550, transform: 'translate(-50%, -50%) rotate(-3deg)', ...dimCss(dimOf('question')) }}>
            {fw('question') > 0.01 ? (
              <div style={{ position: 'absolute', inset: '-16px -30px', borderRadius: 20, background: alpha('#fbbf24', 0.22 * fw('question')) }} />
            ) : null}
            <Written p={questionP}>
              <span style={{ fontSize: 50, fontWeight: 850, color: questionTone, whiteSpace: 'nowrap' }}>{WHITEBOARD_TEXT.question}</span>
            </Written>
          </div>
        ) : null}
      </div>
    </div>
  );
}

/** Reveals its child left to right like a marker writing it (p 0–1). */
function Written({ p, children }: { p: number; children: ReactNode }) {
  const k = clamp01(p);
  if (k <= 0) return null;
  return (
    <div style={{ position: 'relative', display: 'inline-block', whiteSpace: 'nowrap', clipPath: k < 1 ? `inset(-20px ${(1 - k) * 100}% -20px -20px)` : undefined }}>
      {children}
    </div>
  );
}

/**
 * A hand-drawn ellipse as a path: starts at angle `start` (radians from the
 * top), runs `turns` of a full loop, and wobbles a little in radius.
 */
function roughEllipse(cx: number, cy: number, rx: number, ry: number, start: number, turns: number): string {
  const steps = 64;
  const pts: string[] = [];
  for (let k = 0; k <= steps; k++) {
    const a = start * Math.PI + (k / steps) * turns * 2 * Math.PI;
    const wob = 1 + 0.025 * Math.sin(a * 3 + 0.6) + 0.015 * Math.sin(a * 7);
    const x = cx + Math.sin(a) * rx * wob;
    const y = cy - Math.cos(a) * ry * wob;
    pts.push(`${k === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  return pts.join(' ');
}

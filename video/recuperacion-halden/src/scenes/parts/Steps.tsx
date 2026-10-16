import type { CSSProperties } from 'react';
import { interpolateColors, useCurrentFrame } from 'remotion';
import { C, FONT, alpha } from '../../../../engine/src/theme/tokens';
import { clamp01, tone as toneOf, type Tone } from '../../../../engine/src/ui';

/**
 * «Cuatro formas de probarlo» (canon: out/scene-brief.md «Shared parts»): four
 * blocks rising left to right in realism and risk. Never call it a ladder on
 * screen; it is just drawn as steps.
 *
 *   1 TABLETOP EXERCISE   «el plan: roles, quién declara, a quién se llama»  toca producción: no
 *   2 SIMULATION          «sin mover producción»                              no
 *   3 PARALLEL PROCESSING «el respaldo funciona, sin interrumpir»             no
 *   4 FAIL OVER           «la producción cambia de sitio, de verdad»          sí
 *
 * Each column: the name (exam term, violet) and its Spanish note sit ABOVE the
 * block; the block's face carries the number and the tag «toca producción · no/sí».
 *
 * Props:
 *   - `width`, `height` px (default 1728 × 560). Below 520 px wide the parts
 *     switch to icon detail: blocks + numbers only (s06's ~180 px rule icon).
 *   - `steps`  up to four per-step views (index 0 = step 1), each optional:
 *       `state`   'on' | 'dim' | 'hidden' | 'off' — shorthand for the weights:
 *                 on = shown + lit, dim = shown + dimmed, hidden = shown with a
 *                 «?» plate over name, note, number and tag, off = not drawn.
 *       `show`    0–1 appear (fade + rise); `focus` 0–1 lit (1) vs dimmed (0);
 *       `hidden`  0–1 the «?» plate (animate 1→0 to uncover step 4);
 *       `touches` 0–1 the tag's value, «no» (0, cyan) → «sí» (1, amber); the
 *                 default is the step's own (only step 4 touches production).
 *                 s04 animates step 4's 0→1 on `answer`/`swap`.
 *       `note`    replaces the default Spanish note; `tone` the lit accent
 *                 (default cyan = the plan; e.g. 'emerald' once fail over passed).
 *     Explicit weights override the `state` shorthand.
 *   - `tags`   false hides every «toca producción» tag (default true).
 *   - `notes`  false hides the notes (default true).
 *   - `frame`  optional; defaults to useCurrentFrame() (only the «?» breathes, ≤ 1 Hz).
 *   - `style`  extra style on the root div.
 * `stepsLayout(width, height)` returns each column's box so a scene can anchor
 * things to a step (e.g. s03's two theatres next to step 3, s04's comparison).
 * Nothing is positioned and nothing reads the timeline.
 *
 * Used in: s03 (steps 1–3 light up, 4 hidden), s04 (step 4 uncovers and lights,
 * its tag flips to «sí»; then step 1 vs step 4), s06 (rule-card icon).
 */

export interface StepDef {
  n: number;
  name: string;
  note: string;
  touches: boolean;
}

export const STEP_DEFS: readonly StepDef[] = [
  { n: 1, name: 'TABLETOP EXERCISE', note: 'el plan: roles, quién declara, a quién se llama', touches: false },
  { n: 2, name: 'SIMULATION', note: 'sin mover producción', touches: false },
  { n: 3, name: 'PARALLEL PROCESSING', note: 'el respaldo funciona, sin interrumpir', touches: false },
  { n: 4, name: 'FAIL OVER', note: 'la producción cambia de sitio, de verdad', touches: true },
];

export type StepState = 'on' | 'dim' | 'hidden' | 'off';

export interface StepView {
  state?: StepState;
  show?: number;
  focus?: number;
  hidden?: number;
  touches?: number;
  note?: string;
  tone?: Tone;
}

export interface StepsProps {
  width?: number;
  height?: number;
  steps?: readonly (StepView | undefined)[];
  tags?: boolean;
  notes?: boolean;
  frame?: number;
  style?: CSSProperties;
}

const PRESET: Record<StepState, { show: number; focus: number; hidden: number }> = {
  on: { show: 1, focus: 1, hidden: 0 },
  dim: { show: 1, focus: 0, hidden: 0 },
  hidden: { show: 1, focus: 0.6, hidden: 1 },
  off: { show: 0, focus: 0, hidden: 0 },
};

const TYPE_S = { name: 40, note: 32, nameLH: 1.06, noteLH: 1.18 } as const;
const DEPTH = 16;

export interface StepColumn {
  /** column left / width (px, from the Steps' top-left) */
  x: number;
  w: number;
  /** top of the block's front face */
  blockTop: number;
  /** top of the name/note card above the block */
  cardTop: number;
  /** bottom of everything (the floor line) */
  bottom: number;
}

/** Column boxes of a Steps `width` × `height`. */
export function stepsLayout(width = 1728, height = 560): { icon: boolean; columns: StepColumn[]; cardH: number } {
  const icon = width < 520;
  const gap = icon ? Math.max(6, width * 0.045) : 28;
  const colW = (width - gap * 3) / 4;
  const cardH = icon ? 0 : TYPE_S.name * TYPE_S.nameLH * 2 + 10 + TYPE_S.note * TYPE_S.noteLH * 2 + 18;
  const bottom = height;
  const minH = icon ? height * 0.24 : 132;
  const maxH = Math.max(minH + (icon ? height * 0.5 : 60), height - cardH - DEPTH);
  const columns = [0, 1, 2, 3].map((i) => {
    const h = minH + ((maxH - minH) * i) / 3;
    const blockTop = bottom - h;
    return { x: i * (colW + gap), w: colW, blockTop, cardTop: blockTop - DEPTH - cardH, bottom };
  });
  return { icon, columns, cardH };
}

/** Name lines: one if it fits at `size`, else split at the space nearest the middle. */
function nameLines(name: string, w: number, size: number): { lines: string[]; size: number } {
  const cw = 0.64; // uppercase bold, average advance / em
  if (name.length * cw * size <= w) return { lines: [name], size };
  const spaces = [...name].map((c, i) => (c === ' ' ? i : -1)).filter((i) => i > 0);
  if (spaces.length === 0) return { lines: [name], size: Math.min(size, w / (name.length * cw)) };
  const mid = name.length / 2;
  const cut = spaces.reduce((a, b) => (Math.abs(b - mid) < Math.abs(a - mid) ? b : a));
  const lines = [name.slice(0, cut), name.slice(cut + 1)];
  const longest = Math.max(...lines.map((l) => l.length));
  return { lines, size: Math.min(size, w / (longest * cw)) };
}

/**
 * Largest note size (32 down to 22 px) whose wrapped lines fit the reserved
 * note box (two lines at 32 px ≈ three at 22 px).
 */
function fitNote(note: string, w: number): number {
  const boxH = TYPE_S.note * TYPE_S.noteLH * 2;
  for (let size = TYPE_S.note; size > 22; size -= 1) {
    const lines = Math.ceil((note.length * 0.53 * size) / (w * 0.94));
    if (lines * size * TYPE_S.noteLH <= boxH) return size;
  }
  return 22;
}

export function Steps({ width = 1728, height = 560, steps = [], tags = true, notes = true, frame, style }: StepsProps) {
  const current = useCurrentFrame();
  const f = frame ?? current;
  const { icon, columns } = stepsLayout(width, height);
  const breathe = 0.5 - 0.5 * Math.cos((2 * Math.PI * 0.5 * f) / 30); // 0.5 Hz

  return (
    <div style={{ position: 'relative', width, height, fontFamily: FONT.sans, ...style }}>
      {/* floor line */}
      <div style={{ position: 'absolute', left: -12, right: -12, top: height - 2, height: 3, borderRadius: 2, background: alpha(C.ink500, 0.8) }} />

      {STEP_DEFS.map((def, i) => {
        const view = steps[i] ?? {};
        const pre = PRESET[view.state ?? 'on'];
        const show = clamp01(view.show ?? pre.show);
        if (show <= 0.001) return null;
        const focus = clamp01(view.focus ?? pre.focus);
        const hidden = clamp01(view.hidden ?? pre.hidden);
        const touches = clamp01(view.touches ?? (def.touches ? 1 : 0));
        const t = toneOf(view.tone ?? 'cyan');
        const col = columns[i];
        const faceH = col.bottom - col.blockTop;
        const dim = 1 - focus;

        const faceFill = `linear-gradient(180deg, ${interpolateColors(focus, [0, 1], [C.ink800, alpha(t.deep, 0.95)])} 0%, ${C.ink850} 100%)`;
        const border = interpolateColors(focus, [0, 1], [C.ink600, t.fg]);
        const topFill = interpolateColors(focus, [0, 1], [C.ink700, alpha(t.fg, 0.55)]);
        const valueColor = interpolateColors(touches, [0, 1], [C.cyanSoft, C.amber]);
        const valueText = touches >= 0.5 ? 'sí' : 'no';
        const flip = Math.abs(touches - 0.5) * 2; // 0 at the flip, 1 settled

        const nm = nameLines(def.name, col.w - 8, TYPE_S.name);
        const note = view.note ?? def.note;
        const noteSize = fitNote(note, col.w);
        const tagScale = Math.min(1, (col.w - 24) / 300);
        const numSize = icon ? Math.max(18, col.w * 0.5) : 60;

        return (
          <div
            key={def.n}
            style={{
              position: 'absolute',
              left: col.x,
              top: 0,
              width: col.w,
              height,
              opacity: show * (1 - 0.58 * dim),
              filter: dim > 0.01 ? `saturate(${1 - 0.5 * dim})` : undefined,
              transform: `translateY(${(1 - show) * 24}px)`,
            }}
          >
            {/* block: top face (parallelogram) + front face */}
            <svg width={col.w} height={DEPTH + 2} style={{ position: 'absolute', left: 0, top: col.blockTop - DEPTH, overflow: 'visible' }}>
              <path d={`M0,${DEPTH} L${DEPTH},0 L${col.w},0 L${col.w - DEPTH},${DEPTH} Z`} fill={topFill} stroke={border} strokeWidth={icon ? 1.5 : 2} strokeLinejoin="round" />
            </svg>
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: col.blockTop,
                width: col.w - DEPTH,
                height: faceH,
                borderRadius: icon ? 3 : 6,
                background: faceFill,
                border: `${icon ? 1.5 : 2.5}px solid ${border}`,
                boxShadow: focus > 0.01 ? `0 0 ${Math.round(30 * focus)}px ${alpha(t.fg, 0.28 * focus)}` : undefined,
                boxSizing: 'border-box',
              }}
            />
            {/* side face */}
            <svg width={DEPTH + 2} height={faceH + DEPTH} style={{ position: 'absolute', left: col.w - DEPTH, top: col.blockTop - DEPTH, overflow: 'visible' }}>
              <path d={`M0,${DEPTH} L${DEPTH},0 L${DEPTH},${faceH} L0,${faceH + DEPTH} Z`} fill={interpolateColors(focus, [0, 1], [C.ink850, alpha(t.deep, 0.8)])} stroke={border} strokeWidth={icon ? 1.5 : 2} strokeLinejoin="round" />
            </svg>

            {/* number */}
            <div
              style={{
                position: 'absolute',
                left: icon ? 0 : 20,
                width: icon ? col.w - DEPTH : undefined,
                top: col.blockTop + (icon ? Math.max(2, faceH * 0.5 - numSize * 0.62) : 10),
                fontSize: numSize,
                lineHeight: 1,
                fontWeight: 900,
                textAlign: icon ? 'center' : 'left',
                color: interpolateColors(focus, [0, 1], [C.muted, t.soft]),
                opacity: 1 - hidden,
              }}
            >
              {def.n}
            </div>

            {/* tag «toca producción · no/sí» */}
            {!icon && tags && (
              <div
                style={{
                  position: 'absolute',
                  left: 14,
                  top: col.bottom - 14 - 46 * tagScale,
                  height: 46 * tagScale,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10 * tagScale,
                  padding: `0 ${14 * tagScale}px`,
                  borderRadius: 999,
                  background: alpha(C.ink950, 0.75),
                  border: `2px solid ${alpha(valueColor, 0.7)}`,
                  whiteSpace: 'nowrap',
                  opacity: 1 - hidden,
                }}
              >
                <span style={{ fontSize: 26 * tagScale, fontWeight: 650, color: C.muted }}>toca producción</span>
                <span style={{ fontSize: 34 * tagScale, fontWeight: 850, color: valueColor, opacity: 0.35 + 0.65 * flip, display: 'inline-block', transform: `scale(${0.85 + 0.15 * flip})` }}>
                  {valueText}
                </span>
              </div>
            )}

            {/* name + note above the block */}
            {!icon && (
              <div style={{ position: 'absolute', left: 0, top: col.cardTop, width: col.w, opacity: 1 - hidden }}>
                <div
                  style={{
                    height: TYPE_S.name * TYPE_S.nameLH * 2,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    fontSize: nm.size,
                    lineHeight: TYPE_S.nameLH,
                    fontWeight: 850,
                    letterSpacing: 0.5,
                    color: interpolateColors(focus, [0, 1], [C.muted, '#c4b5fd']),
                    whiteSpace: 'nowrap',
                  }}
                >
                  {nm.lines.map((l) => (
                    <div key={l}>{l}</div>
                  ))}
                </div>
                {notes && (
                  <div
                    style={{
                      marginTop: 10,
                      height: TYPE_S.note * TYPE_S.noteLH * 2,
                      fontSize: noteSize,
                      lineHeight: TYPE_S.noteLH,
                      fontWeight: 600,
                      color: interpolateColors(focus, [0, 1], [C.muted, C.text]),
                      overflow: 'hidden',
                    }}
                  >
                    {note}
                  </div>
                )}
              </div>
            )}

            {/* the «?» plate */}
            {hidden > 0.001 && (
              <div
                style={{
                  position: 'absolute',
                  left: icon ? 0 : -4,
                  top: icon ? col.blockTop : col.cardTop - 4,
                  width: icon ? col.w - DEPTH : col.w + 8,
                  height: icon ? col.bottom - col.blockTop : col.bottom - col.cardTop + 4,
                  borderRadius: icon ? 4 : 14,
                  background: `linear-gradient(180deg, ${C.ink850} 0%, ${C.ink900} 100%)`,
                  border: `${icon ? 1.5 : 3}px dashed ${alpha(C.violet, 0.55 + 0.25 * breathe)}`,
                  boxSizing: 'border-box',
                  opacity: hidden,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span style={{ fontSize: icon ? Math.max(18, col.w * 0.6) : 150, fontWeight: 900, lineHeight: 1, color: alpha('#c4b5fd', 0.7 + 0.3 * breathe) }}>?</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

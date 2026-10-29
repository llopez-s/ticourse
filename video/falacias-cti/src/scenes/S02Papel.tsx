import { Fragment } from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { ACCENT, C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { Icon, mix } from '../../../engine/src/ui';
import { BIAS, FALLACY, RULE, SOLID } from '../data/s02-papel';
import { Glasses } from './parts/Glasses';
import { MATH_BOX, MATH_ROWS, MathSheet } from './parts/MathSheet';
import { DRAFT_BOX, DRAFT_RING, DraftSheet } from './parts/Paper';
import { RedPen } from './parts/Pen';
import { Stroke, ellipsePoints, partial } from './parts/strokes';
import { Stage, wordFrame } from './kit';

const S = 's02-papel';
const W = STAGE.width;

/** The maths sheet starts centred; it then moves to the right half, where it turns into the draft. */
const SHEET_A = { x: 544, y: 40, s: 1 } as const;
const SHEET_C = { x: 1038, y: 30, s: 0.84 } as const;
const GLASS = { x: 154, y: 34, w: 560 } as const;
const OFFSTAGE = { x: 1400, y: 90 } as const;
const AMBER = ACCENT.amber.soft;

/** Frames made strictly increasing (interpolate needs it). */
function seq(frames: number[], gap = 3): number[] {
  const out: number[] = [];
  frames.forEach((f, i) => out.push(i === 0 ? f : Math.max(f, out[i - 1] + gap)));
  return out;
}

/** A label of parts, each lit on its own frame, separated by dots. */
function Parts({ parts, at, frame, size = 38, first, left = 'center' }: { parts: readonly string[]; at: readonly number[]; frame: number; size?: number; first: string; left?: 'center' | 'start' }) {
  return (
    <div style={{ display: 'flex', justifyContent: left === 'center' ? 'center' : 'flex-start', alignItems: 'baseline', gap: 14, fontFamily: FONT.sans, fontSize: size, fontWeight: 800, whiteSpace: 'nowrap' }}>
      {parts.map((p, i) => {
        const e = enter(frame, at[i] - 4, { distance: 12, duration: 14 });
        return (
          <Fragment key={p}>
            {i > 0 ? <span style={{ color: C.faint, opacity: e.opacity }}>·</span> : null}
            <span style={{ color: i === 0 ? first : C.textStrong, opacity: e.opacity, transform: e.transform }}>{p}</span>
          </Fragment>
        );
      })}
    </div>
  );
}

/**
 * s02-papel «Sesgo o falacia».
 *   math      a maths problem solved on squared paper — four steps and a result, figures blurred; step 3 is twisted. A
 *             hand with a red pen goes over the result and then the steps, one by one, and marks nothing yet
 *   bias      the sheet moves right; on the left, tinted glasses: the colour stains what is seen through them and
 *             leaves nothing on the paper — «sesgo · cognición · cómo miras»
 *   fallacy   the sheet on the right becomes the draft of s01 — «falacia · argumentación · el paso de la hoja»
 *   pen       (sfx «error») the pen draws a red ring round row 4, the step with no tick
 *   solid     the three pruebas get their green tick while the ring stays and the step turns rose:
 *             «pruebas sólidas, razonamiento que falla»
 *   rule      both pictures step aside for two columns (the lesson's exam note) and, under them, «el examen mezcla
 *             ambos en la misma pregunta». The engine's exam card comes at the end of the sentence, outside the stage
 */
export function S02Papel(props: SceneProps) {
  const frame = useCurrentFrame();
  const mathAt = props.cue('math');
  const biasAt = props.cue('bias');
  const fallacyAt = props.cue('fallacy');
  const penAt = props.cue('pen');
  const solidAt = props.cue('solid');
  const ruleAt = props.cue('rule');
  const at = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);

  // ---- The maths sheet: centred, then to the right half.
  const toRight = progress(frame, biasAt + 8, 36, EASE.inOut);
  const mx = mix(SHEET_A.x, SHEET_C.x, toRight);
  const my = mix(SHEET_A.y, SHEET_C.y, toRight);
  const ms = mix(SHEET_A.s, SHEET_C.s, toRight);
  const sheetIn = enter(frame, -12, { distance: 24, duration: 22 });
  const draftIn = progress(frame, fallacyAt - 4, 18);
  const mathOpacity = 1 - draftIn;
  const flip = 1 + 0.025 * Math.sin(Math.PI * draftIn);

  // ---- The hand and the pen over the maths sheet: the result first, then the steps one by one; nothing is marked.
  const rowY = (i: number) => SHEET_A.y + MATH_ROWS.first + i * MATH_ROWS.step + MATH_ROWS.h / 2;
  const resultY = SHEET_A.y + MATH_ROWS.result + MATH_ROWS.resultH / 2;
  const x0 = SHEET_A.x + 170;
  const a = at('s02-01', 'resultado');
  const b = at('s02-01', 'buscan');
  const d = at('s02-01', 'tuerce');
  const [f0, f1, f2, f3, f4, f5, f6, f7, f8, f9, f10] = seq([mathAt - 6, a - 2, a + 26, b, b + 14, Math.max(b + 20, mix(b, d, 0.45)), Math.max(b + 34, mix(b, d, 0.45)) + 14, d, d + 18, d + 34, biasAt + 4]);
  const fs = [f0, f1, f2, f3, f4, f5, f6, f7, f8, f9, f10];
  const penAx = interpolate(frame, fs, [OFFSTAGE.x, x0 + 260, x0 + 420, x0, x0 + 190, x0, x0 + 190, x0 + 60, x0 + 150, x0 + 80, OFFSTAGE.x], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE.inOut });
  const penAy = interpolate(frame, fs, [OFFSTAGE.y, resultY, resultY, rowY(0), rowY(0), rowY(1), rowY(1), rowY(2), rowY(2), rowY(2), OFFSTAGE.y], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE.inOut });
  const penAShow = progress(frame, mathAt - 6, 10) * (1 - progress(frame, biasAt + 8, 14));

  // ---- The glasses (left) and their label.
  const glassIn = enter(frame, biasAt + 6, { distance: -50, duration: 24, axis: 'x' });
  const tint = progress(frame, biasAt + 14, 46, EASE.inOut);
  const biasAtParts = [at('s02-02', 'sesgo') - 2, at('s02-02', 'fallo'), at('s02-02', 'cómo')];

  // ---- The draft (right): label, the ring, the ticks and the crooked step.
  const fallacyParts = [at('s02-03', 'falacia'), at('s02-03', 'argumentas'), at('s02-03', 'paso')];
  const ringPts = ellipsePoints(DRAFT_RING.cx, DRAFT_RING.cy, DRAFT_RING.rx, DRAFT_RING.ry, { start: -0.55, turns: 1.08 });
  const drawP = progress(frame, penAt, 40, EASE.inOut);
  const ring = partial(ringPts, drawP);
  const ringX = (px: number) => SHEET_C.x + px * SHEET_C.s;
  const ringY = (py: number) => SHEET_C.y + py * SHEET_C.s;
  const enterT = progress(frame, penAt - 24, 24, EASE.out);
  const startPt = ringPts[0];
  const penBaseX = ringX(startPt.x) + 150;
  const penBaseY = ringY(startPt.y) - 190;
  const penCx = drawP > 0 ? ringX(ring.tip.x) : mix(penBaseX, ringX(startPt.x), enterT);
  const penCy = drawP > 0 ? ringY(ring.tip.y) : mix(penBaseY, ringY(startPt.y), enterT);
  const penCOut = progress(frame, solidAt + 40, 24, EASE.inOut);
  const penCShow = progress(frame, penAt - 24, 12) * (1 - penCOut);
  const penCxNow = mix(penCx, OFFSTAGE.x, penCOut);
  const penCyNow = mix(penCy, OFFSTAGE.y, penCOut);

  const checks = [0, 1, 2].map((i) => progress(frame, solidAt + i * 14, 14));
  const crooked = progress(frame, at('s02-04', 'razonamiento') - 6, 20, EASE.inOut);
  const solidIn = enter(frame, solidAt - 4, { distance: 14, duration: 16 });
  const glassDim = 0.5 * progress(frame, solidAt - 6, 20, EASE.inOut);

  // ---- The rule: both pictures step aside for two columns.
  const cOut = progress(frame, ruleAt - 4, 14, EASE.inOut);
  const colL = enter(frame, Math.min(at('s02-05', 'sesgo') - 8, ruleAt + 6), { distance: 24, duration: 18 });
  const colR = enter(frame, at('s02-05', 'falacia') - 8, { distance: 24, duration: 18 });
  const mixed = enter(frame, at('s02-05', 'examen') - 8, { distance: 18, duration: 18 });
  const miniRing = ellipsePoints(DRAFT_RING.cx, DRAFT_RING.cy, DRAFT_RING.rx, DRAFT_RING.ry, { start: -0.55, turns: 1.08 });

  return (
    <Stage>
      {/* Phase A and C: the sheet, the glasses, the labels */}
      {cOut < 0.999 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: 1 - cOut, transform: `scale(${1 - 0.04 * cOut})`, transformOrigin: '50% 40%' }}>
          {/* The maths sheet / the draft */}
          <div style={{ position: 'absolute', left: mx, top: my, width: MATH_BOX.w, height: MATH_BOX.h, transform: `scale(${ms * flip})`, transformOrigin: '0 0', opacity: sheetIn.opacity * mathOpacity }}>
            <div style={{ transform: sheetIn.transform }}>
              <MathSheet />
            </div>
          </div>
          {draftIn > 0.01 ? (
            <div style={{ position: 'absolute', left: SHEET_C.x, top: SHEET_C.y, opacity: draftIn, transform: `scale(${flip})`, transformOrigin: '0 0' }}>
              <DraftSheet scale={SHEET_C.s} checks={checks} crooked={crooked} />
            </div>
          ) : null}
          {draftIn > 0.01 ? (
            <svg width={DRAFT_BOX.w * SHEET_C.s} height={DRAFT_BOX.h * SHEET_C.s} viewBox={`0 0 ${DRAFT_BOX.w} ${DRAFT_BOX.h}`} style={{ position: 'absolute', left: SHEET_C.x, top: SHEET_C.y, overflow: 'visible' }} aria-hidden>
              <Stroke points={ringPts} p={drawP} width={9} glow={0.5 * (1 - progress(frame, penAt + 60, 30))} />
            </svg>
          ) : null}

          {/* The glasses and their label */}
          {frame >= biasAt ? (
            <div style={{ opacity: glassIn.opacity, transform: glassIn.transform }}>
              <div style={{ position: 'absolute', left: GLASS.x, top: GLASS.y }}>
                <Glasses width={GLASS.w} tint={tint} glow={0.6 * tint} dim={glassDim} />
              </div>
              <div style={{ position: 'absolute', left: 34, top: 490, width: 800, opacity: 1 - 0.45 * (glassDim / 0.5) }}>
                <Parts parts={BIAS.parts} at={biasAtParts} frame={frame} first={AMBER} size={40} />
              </div>
            </div>
          ) : null}

          {/* The draft's labels */}
          {frame >= fallacyAt - 4 ? (
            <div style={{ position: 'absolute', left: 868, top: 464, width: 860 }}>
              <Parts parts={FALLACY.parts} at={fallacyParts} frame={frame} first={C.roseSoft} size={38} />
            </div>
          ) : null}
          {frame >= solidAt - 4 ? (
            <div style={{ position: 'absolute', left: 868, top: 530, width: 860, display: 'flex', justifyContent: 'center', fontFamily: FONT.sans, fontSize: 42, fontWeight: 850, whiteSpace: 'nowrap', opacity: solidIn.opacity, transform: solidIn.transform }}>
              <span style={{ color: '#6ee7b7' }}>{SOLID.split(',')[0]}</span>
              <span style={{ color: C.faint }}>,&nbsp;</span>
              <span style={{ color: C.roseSoft }}>{SOLID.split(', ')[1]}</span>
            </div>
          ) : null}

          {/* The pen over the maths sheet, and then over the draft */}
          <RedPen x={penAx} y={penAy} angle={-52} hand show={penAShow} />
          <RedPen x={penCxNow} y={penCyNow} angle={-52} hand show={penCShow} glow={0.4 * (1 - drawP)} />
        </div>
      ) : null}

      {/* Phase D: the lesson's exam note, as two columns */}
      {cOut > 0.02 ? (
        <div style={{ position: 'absolute', inset: 0, fontFamily: FONT.sans, opacity: cOut }}>
          {([
            { key: 'bias', x: 20, tone: ACCENT.amber, data: RULE.bias, e: colL },
            { key: 'fallacy', x: 878, tone: ACCENT.rose, data: RULE.fallacy, e: colR },
          ] as const).map(({ key, x, tone, data, e }) => (
            <div
              key={key}
              style={{
                position: 'absolute',
                left: x,
                top: 36,
                width: 830,
                height: 330,
                boxSizing: 'border-box',
                borderRadius: RADIUS.lg,
                border: `3px solid ${alpha(tone.fg, 0.7)}`,
                background: `linear-gradient(180deg, ${alpha(tone.fg, 0.1)} 0%, ${alpha(C.ink900, 0.96)} 60%), ${C.ink900}`,
                boxShadow: `0 0 34px ${alpha(tone.fg, 0.18)}`,
                opacity: e.opacity,
                transform: e.transform,
              }}
            >
              <div style={{ position: 'absolute', left: 28, top: 46 }}>
                {key === 'bias' ? (
                  <Glasses width={200} tint={1} scene={false} />
                ) : (
                  <div style={{ position: 'relative', width: 210, height: 166 }}>
                    <DraftSheet scale={0.32} crooked={1} notice={false} title={false} />
                    <svg width={DRAFT_BOX.w * 0.32} height={DRAFT_BOX.h * 0.32} viewBox={`0 0 ${DRAFT_BOX.w} ${DRAFT_BOX.h}`} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} aria-hidden>
                      <Stroke points={miniRing} p={1} width={14} />
                    </svg>
                  </div>
                )}
              </div>
              <div style={{ position: 'absolute', left: 258, top: 30, whiteSpace: 'nowrap' }}>
                <div style={{ fontSize: 72, fontWeight: 900, letterSpacing: -1.4, lineHeight: 1.05, color: tone.soft }}>{data.term}</div>
                <div style={{ fontSize: 42, fontWeight: 800, lineHeight: 1.15, color: C.textStrong }}>= {data.is}</div>
              </div>
              <div style={{ position: 'absolute', left: 30, top: 230, width: 770, fontSize: 38, fontWeight: 650, lineHeight: 1.2, color: C.text }}>{data.examples}</div>
            </div>
          ))}
          <div style={{ position: 'absolute', left: 0, top: 420, width: W, display: 'flex', justifyContent: 'center', opacity: mixed.opacity, transform: mixed.transform }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 20, height: 92, padding: '0 40px 0 30px', boxSizing: 'border-box', borderRadius: RADIUS.pill, border: `3px solid ${alpha(C.violet, 0.85)}`, background: alpha(C.violetDeep, 0.7), boxShadow: `0 0 34px ${alpha(C.violet, 0.28)}`, fontSize: 48, fontWeight: 850, color: C.textStrong, whiteSpace: 'nowrap' }}>
              <Icon name="mortarboard" size={50} color={C.violet} strokeWidth={2} />
              {RULE.mixed}
            </div>
          </div>
        </div>
      ) : null}
    </Stage>
  );
}

import { useCurrentFrame } from 'remotion';
import { enterFramesFor, sceneTiming } from '../../../engine/src/timeline/load';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress, springIn } from '../../../engine/src/theme/motion';
import { dimStyle, mix } from '../../../engine/src/ui';
import { FAULTS, FIX, GAP, MTTR_LABEL, MTTR_MIN, RTO_LABEL, RTO_MIN, SOURCES, TECHNICIAN } from '../data/s04-medida';
import { TIMELINE } from '../timeline/load';
import { Technician } from './parts/Cafe';
import { FaultBars } from './parts/s04-medida/FaultBars';
import { LogConsole, SEAL_H, Seal } from './parts/s04-medida/ConsoleBits';
import { Stage, wordFrame } from './kit';

const S = 's04-medida';
const W = STAGE.width;

// ---- Chart geometry, in the console body's coordinates (one scale for the four bars, in minutes).
const LABEL_W = 200;
const X0 = 28 + LABEL_W;
const PX_PER_MIN = 6.6;
const RTO_X = X0 + RTO_MIN * PX_PER_MIN;
const MTTR_X = X0 + MTTR_MIN * PX_PER_MIN;
const ROWS_TOP = 56;
const COL_X = 1070;
const COL_W = 626;

// ---- Two layouts of the console: A (roomy, the whole story) and B (low, under the intercepted message's band).
const A = { top: 14, body: 500, row: 100, bar: 64 } as const;
const B = { top: 242, body: 346, row: 60, bar: 42 } as const;
const RISEN_TOP = 170;

/** The intercepted message's window in this scene's local frames (from the timeline). */
function interceptWindow(): { from: number; to: number } | null {
  const e = TIMELINE.intercept?.find((i) => i.scene === S);
  if (!e) return null;
  const origin = sceneTiming(TIMELINE, S).from - enterFramesFor(TIMELINE, S);
  return { from: e.from - origin, to: e.from + e.durationInFrames - origin };
}

/** A vertical marker across the rows (the promise or the mean), drawn top to bottom with a label chip on top. */
function MarkLine({
  x,
  y1,
  y2,
  color,
  draw,
  chip,
  label,
  labelColor,
  pulse = 0,
}: {
  x: number;
  y1: number;
  y2: number;
  color: string;
  draw: number;
  chip: number;
  label: string;
  labelColor: string;
  pulse?: number;
}) {
  if (draw <= 0.001) return null;
  const h = (y2 - y1) * draw;
  return (
    <>
      <div style={{ position: 'absolute', left: x - 2 - pulse, top: y1, width: 4 + pulse * 2, height: h, borderRadius: 2, background: color, boxShadow: `0 0 ${14 + pulse * 10}px ${alpha(color, 0.55)}` }} />
      <div
        style={{
          position: 'absolute',
          left: x,
          top: 2,
          transform: `translateX(-50%) scale(${0.85 + 0.15 * Math.min(1, chip)})`,
          opacity: Math.min(1, chip * 1.5),
          padding: '3px 16px',
          borderRadius: RADIUS.pill,
          border: `3px solid ${color}`,
          background: alpha(C.ink950, 0.92),
          fontFamily: FONT.mono,
          fontSize: 32,
          fontWeight: 850,
          color: labelColor,
          whiteSpace: 'nowrap',
        }}
      >
        {label}
      </div>
    </>
  );
}

/**
 * s04-medida «Lo prometido y lo que mides». The fault-log console: on `log` its title and the proposal seal, on
 * `rows` four bars on one scale (each row lands on its spoken ordinal, each bar grows on its spoken number), on
 * `promise-line` the amber 30-minute line («RTO 30 min»), on `mean` the cyan line at 80 («MTTR 80 min», sfx
 * «ding») and on `gap` the parts past the promise turn rose with «las cuatro pasan de 30» (sfx «block»). The
 * console then steps down below the intercepted message's band (top-centre stays clear until its segment ends);
 * `correct` names the source of each number, `technician` hangs the café's technician on the MTTR, and `fix`
 * closes in the conditional above the console.
 */
export function S04Medida(props: SceneProps) {
  const frame = useCurrentFrame();
  const logAt = props.cue('log');
  const rowsAt = props.cue('rows');
  const promiseAt = props.cue('promise-line');
  const meanAt = props.cue('mean');
  const gapAt = props.cue('gap');
  const correctAt = props.cue('correct');
  const techAt = props.cue('technician');
  const fixAt = props.cue('fix');
  const ic = interceptWindow();

  const rowAt = FAULTS.map((f, i) => Math.max(rowsAt - 2 + i * 4, wordFrame(S, 's04-02', f.said) - 6));
  const barAt = FAULTS.map((f) => wordFrame(S, 's04-02', f.number) - 2);
  const rtoWordAt = Math.max(promiseAt, wordFrame(S, 's04-03', 'RTO') - 6);
  const srcAt = [wordFrame(S, 's04-05', 'RTO') - 4, wordFrame(S, 's04-05', 'MTTR') - 4];
  const fixSecondAt = Math.max(fixAt + 8, wordFrame(S, 's04-07', 'mejorar') - 6);

  // ---- Layout: roomy until the intercepted message is about to type out, then low.
  const stepFrom = Math.max(gapAt + 44, (ic ? ic.from : correctAt - 120) - 30);
  const step = progress(frame, stepFrom, 26, EASE.inOut);
  // Once the message is gone the console rises a little (not to the top: the closing text goes above it).
  const rise = progress(frame, (ic ? ic.to : correctAt + 340) + 2, 24, EASE.inOut);
  const top = mix(mix(A.top, B.top, step), RISEN_TOP, rise);
  const bodyH = mix(A.body, B.body, step);
  const rowH = mix(A.row, B.row, step);
  const barH = mix(A.bar, B.bar, step);
  const rowsEnd = ROWS_TOP + 4 * rowH;

  const panelIn = progress(frame, 0, 14);
  const sealIn = progress(frame, logAt - 2, 14);
  const skelIn = (i: number) => progress(frame, logAt + 4 + i * 5, 12);

  // ---- The promise, the mean, the gap.
  const lineP = progress(frame, promiseAt, 18);
  const rtoChip = springIn(frame, 30, rtoWordAt, { damping: 15 });
  const meanP = progress(frame, meanAt, 16);
  const meanChip = springIn(frame, 30, meanAt + 4, { damping: 15 });
  const gapIn = springIn(frame, 30, gapAt + 2, { damping: 14 });

  // ---- Where each number comes from, then the technician, then the close.
  const srcIn = srcAt.map((a) => springIn(frame, 30, a, { damping: 15 }));
  const rtoPulse = progress(frame, srcAt[0], 8) * (1 - progress(frame, srcAt[0] + 36, 12));
  const mttrPulse = progress(frame, srcAt[1], 8) * (1 - progress(frame, srcAt[1] + 36, 12));
  const techIn = springIn(frame, 30, techAt, { damping: 14 });
  const tagIn = enter(frame, techAt + 10, { distance: 8, duration: 14 });
  const afterTech = progress(frame, techAt + 20, 16);
  const fixDim = progress(frame, fixAt - 4, 18, EASE.inOut);

  return (
    <Stage>
      {/* The fault-log console */}
      <div style={{ position: 'absolute', left: 0, top, width: W, ...dimStyle(0.5 * fixDim, panelIn) }}>
        <LogConsole width={W} height={bodyH + 68}>
          {/* row skeleton: the log's four slots before the bars arrive */}
          {FAULTS.map((f, i) => (
            <div
              key={`skel-${f.ordinal}`}
              style={{
                position: 'absolute',
                left: X0,
                top: ROWS_TOP + i * rowH + (rowH - 10) / 2,
                width: 330,
                height: 10,
                borderRadius: 5,
                background: alpha(C.ink600, 0.55),
                opacity: skelIn(i) * (1 - progress(frame, rowAt[i], 6)),
              }}
            />
          ))}

          {/* the chart */}
          <div style={{ position: 'absolute', left: 28, top: ROWS_TOP, width: 1000, height: 4 * rowH }}>
            <FaultBars frame={frame} x0={LABEL_W} pxPerMin={PX_PER_MIN} rowH={rowH} barH={barH} rowAt={rowAt} barAt={barAt} gapAt={gapAt} labelW={LABEL_W} />
          </div>

          {/* the promise line (amber) and the mean line (cyan) */}
          <MarkLine x={RTO_X} y1={50} y2={rowsEnd} color={C.amber} draw={lineP} chip={rtoChip} label={RTO_LABEL} labelColor="#fde68a" pulse={rtoPulse * 2} />
          <MarkLine x={MTTR_X} y1={50} y2={rowsEnd} color={C.cyanSoft} draw={meanP} chip={meanChip} label={MTTR_LABEL} labelColor={C.cyanSoft} pulse={mttrPulse * 2} />

          {/* the seal */}
          <div style={{ position: 'absolute', left: 28, top: bodyH - SEAL_H - 2 }}>
            <Seal opacity={sealIn} />
          </div>

          {/* right column: the gap, the sources, the technician */}
          {gapIn > 0.01 ? (
            <div
              style={{
                position: 'absolute',
                left: COL_X,
                top: 14,
                width: COL_W,
                display: 'flex',
                alignItems: 'center',
                padding: '8px 22px',
                boxSizing: 'border-box',
                borderRadius: RADIUS.md,
                border: `3px solid ${alpha(C.rose, 0.9)}`,
                background: alpha(C.roseDeep, 0.7),
                boxShadow: `0 0 ${Math.round(26 * Math.min(1, gapIn))}px ${alpha(C.rose, 0.3)}`,
                fontFamily: FONT.sans,
                fontSize: 40,
                fontWeight: 850,
                color: '#fecdd3',
                whiteSpace: 'nowrap',
                transform: `scale(${0.92 + 0.08 * Math.min(1, gapIn)})`,
                transformOrigin: 'left center',
                ...dimStyle(0.6 * progress(frame, correctAt - 4, 14), Math.min(1, gapIn * 1.4)),
              }}
            >
              {GAP}
            </div>
          ) : null}

          {SOURCES.map((s, i) =>
            srcIn[i] > 0.01 ? (
              <div
                key={s.term}
                style={{
                  position: 'absolute',
                  left: COL_X,
                  top: 100 + i * 62,
                  width: COL_W,
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: 16,
                  fontFamily: FONT.sans,
                  whiteSpace: 'nowrap',
                  transform: `translateX(${(1 - Math.min(1, srcIn[i])) * 24}px)`,
                  ...dimStyle(0.55 * afterTech, Math.min(1, srcIn[i] * 1.4)),
                }}
              >
                <span style={{ fontFamily: FONT.mono, fontSize: 38, fontWeight: 850, color: i === 0 ? '#fde68a' : C.cyanSoft, minWidth: 104 }}>{s.term}</span>
                <span style={{ fontSize: 32, fontWeight: 650, color: C.text }}>{s.says}</span>
              </div>
            ) : null,
          )}

          {techIn > 0.01 ? (
            <div style={{ position: 'absolute', left: COL_X, top: 216, width: COL_W, display: 'flex', alignItems: 'center', gap: 20, opacity: Math.min(1, techIn * 1.4) }}>
              <div style={{ transform: `scale(${0.6 + 0.4 * Math.min(1.05, techIn)})`, transformOrigin: 'center', flexShrink: 0 }}>
                <Technician size={92} glow={0.5 * progress(frame, techAt, 20)} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2, fontFamily: FONT.sans, whiteSpace: 'nowrap' }}>
                <span style={{ fontSize: 38, fontWeight: 800, color: C.textStrong }}>{TECHNICIAN.says}</span>
                <span style={{ fontSize: 32, fontWeight: 650, color: C.cyanSoft }}>{TECHNICIAN.sub}</span>
                <span style={{ fontSize: 22, fontWeight: 600, color: C.muted, letterSpacing: 0.4, ...tagIn }}>{TECHNICIAN.tag}</span>
              </div>
            </div>
          ) : null}
        </LogConsole>
      </div>

      {/* The conditional close, above the console (the top band is free again once the message is gone) */}
      {frame >= fixAt - 2 ? (
        <div style={{ position: 'absolute', left: 0, top: 22, width: W, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, fontFamily: FONT.sans, textAlign: 'center' }}>
          <div style={{ ...enter(frame, fixAt, { distance: 18, duration: 16 }), fontSize: 58, fontWeight: 850, color: C.textStrong, whiteSpace: 'nowrap', lineHeight: 1.15 }}>{FIX.main}</div>
          <div style={{ ...enter(frame, fixSecondAt, { distance: 14, duration: 16 }), fontSize: 46, fontWeight: 750, color: C.cyanSoft, whiteSpace: 'nowrap', lineHeight: 1.15 }}>{FIX.fix}</div>
        </div>
      ) : null}
    </Stage>
  );
}

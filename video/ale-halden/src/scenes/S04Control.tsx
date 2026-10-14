import { useCurrentFrame } from 'remotion';
import { enterFramesFor, sceneTiming } from '../../../engine/src/timeline/load';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { EASE, progress, springIn } from '../../../engine/src/theme/motion';
import { Icon, dimStyle } from '../../../engine/src/ui';
import {
  BAR_ALE,
  BAR_CONTROL,
  BAR_REBUILD,
  CASE_CHEAP,
  CASE_COSTLY,
  ELIMINATES,
  FITS,
  NET,
  NOTE,
  NO_FIT,
  OVER_LABEL,
  SCALE_CHIP,
  SEAL,
} from '../data/s04-control';
import { TIMELINE } from '../timeline/load';
import { Phone } from './parts/Phone';
import { BAR_H, BAR_OFF, BarRow, CaseCard, PX, Seal, Verdict } from './parts/s04-control/bits';
import { Stage, wordFrame } from './kit';

const S = 's04-control';
const LINE_X = BAR_ALE.k * PX;

// ---- The chart group (one scale, three rows). `g` is its top in stage-local px.
const G_BASE = 90;
/** While the intercepted message is up the group sits below its slot (stage y 10–~192). */
const G_DOWN = 200;
const NET_TOP = 114;
const R1 = 0;
const R2 = 188;
const BRACKET = 294;
const R3 = 338;
const LINE_TOP = 40;
const LINE_BOTTOM = R3 + BAR_OFF + BAR_H + 12;
/** The yardstick's pieces (group y): beside bar 1, beside bar 2 and its bracket, beside bar 3. */
const YARD_PIECES: ReadonlyArray<readonly [number, number]> = [
  [R1 + BAR_OFF - 10, R1 + BAR_OFF + BAR_H + 10],
  [R2 + BAR_OFF - 10, BRACKET + 14],
  [R3 + BAR_OFF - 10, R3 + BAR_OFF + BAR_H + 12],
];

// ---- The right column.
const RX = 1170;
const S1_TOP = 212;
const S2_TOP = 326;
const PHONE_W = 88;
const PHONE_TOP = 418;
const NOTE_TOP = 552;

/** The intercepted message's window in this scene's local frames (from the timeline). */
function interceptWindow(): { from: number; to: number } {
  const e = TIMELINE.intercept?.find((i) => i.scene === S);
  if (!e) return { from: Number.POSITIVE_INFINITY, to: Number.NEGATIVE_INFINITY };
  const origin = sceneTiming(TIMELINE, S).from - enterFramesFor(TIMELINE, S);
  return { from: e.from - origin, to: e.from + e.durationInFrames - origin };
}

/**
 * s04-control «Lo que cuesta el control». Three annual bars on ONE scale (10 px per 1.000 €): the ALE (50.000, cyan),
 * the control (20.000, emerald) and, later, the rebuild (90.000, amber). On `bars` the ALE bar grows under its yardstick
 * line; on `control` the 20.000 bar follows, with the bracket «ALE que elimina (estimación)»; on `net` the difference
 * is written between the two bars. On `fits` the verdict («en los números, sale a cuenta») and the seal land, and the
 * phone gets its 20 € case. On `alt` the 90.000 bar arrives at full length with the yardstick line covered (faded), and
 * the 90 € case comes in mute. The group steps down under PAPER GOVERNOR's message; on `over` the line is revealed
 * top to bottom and the part of the bar that passes it lights. On `annual` the verdict turns («solo con estos números,
 * no sale»), the cases dim and the note about another argument lands at the bottom.
 */
export function S04Control(props: SceneProps) {
  const frame = useCurrentFrame();
  const barsAt = props.cue('bars');
  const controlAt = props.cue('control');
  const netAt = props.cue('net');
  const fitsAt = props.cue('fits');
  const altAt = props.cue('alt');
  const overAt = props.cue('over');
  const annualAt = props.cue('annual');
  const ic = interceptWindow();

  // ---- The group's vertical position: base, down for the intercepted message, back up after `over`.
  const down = progress(frame, ic.from - 32, 24, EASE.inOut);
  const up = progress(frame, overAt + 34, 26, EASE.inOut);
  const g = G_BASE + (G_DOWN - G_BASE) * (down - up);

  // ---- Row 1: the ALE.
  const amount1At = wordFrame(S, 's04-01', '50.000') - 6;
  const r1Name = progress(frame, barsAt - 2, 14);
  const r1Amount = progress(frame, amount1At, 10);
  const r1Grow = progress(frame, wordFrame(S, 's04-01', '50.000') - 22, 24, EASE.inOut);

  // ---- Row 2: the control and the ALE it eliminates.
  const amount2At = wordFrame(S, 's04-01', '20.000') - 6;
  const r2Name = progress(frame, controlAt - 4, 14);
  const r2Amount = progress(frame, amount2At, 10);
  const r2Grow = progress(frame, wordFrame(S, 's04-01', '20.000') - 22, 22, EASE.inOut);
  const brkIn = progress(frame, wordFrame(S, 's04-01', '20.000') + 22, 16);

  // ---- The difference.
  const netA = progress(frame, netAt + 2, 14);
  const netC = progress(frame, wordFrame(S, 's04-02', '30.000') - 8, 14);
  const ghostFill = progress(frame, wordFrame(S, 's04-02', '30.000') - 12, 16);

  // ---- Fits: verdict, seal, check, the 20 € case.
  const fitsIn = progress(frame, fitsAt - 2, 14);
  const sealIn = progress(frame, fitsAt + 22, 12);
  const phoneAIn = springIn(frame, 30, fitsAt + 4, { damping: 16 });
  const caseAOn = progress(frame, wordFrame(S, 's04-03', 'funda') - 6, 16);

  // ---- The 90.000 bar and its mute case.
  const r3Name = progress(frame, altAt - 2, 14);
  const amount3At = wordFrame(S, 's04-04', '90.000') - 6;
  const r3Amount = progress(frame, amount3At, 10);
  const r3Grow = progress(frame, wordFrame(S, 's04-04', '90.000') - 22, 26, EASE.inOut);
  const phoneBIn = springIn(frame, 30, altAt + 2, { damping: 16 });
  const caseBOn = progress(frame, altAt + 10, 16);

  // ---- The yardstick: visible over rows 1–2, covered from `alt`, revealed top to bottom on `over`.
  const lineOut = progress(frame, altAt - 2, 12);
  const lineBack = progress(frame, overAt, 18, EASE.inOut);
  const lineIn = progress(frame, barsAt + 22, 18);
  const overGlow = progress(frame, overAt + 6, 14);
  const lineHot = progress(frame, overAt, 12);

  // ---- Annual.
  const annualIn = progress(frame, annualAt - 2, 14);
  const noteIn = progress(frame, wordFrame(S, 's04-07', 'Haría') - 6, 16);
  const caseDim = progress(frame, annualAt - 2, 14);
  const fitsOut = progress(frame, annualAt - 4, 10);

  // ---- Chip (until the verdict takes its slot).
  const chipIn = progress(frame, 2, 14) * (1 - progress(frame, fitsAt - 6, 10));

  const rowTop = (off: number) => g + off;
  const eqStyle = { fontFamily: FONT.mono, fontSize: 44, fontWeight: 800, lineHeight: '52px', whiteSpace: 'nowrap' } as const;

  return (
    <Stage>
      {/* The baseline all three bars start from */}
      <div style={{ position: 'absolute', left: -2, top: g + LINE_TOP, width: 3, height: LINE_BOTTOM - LINE_TOP, background: alpha(C.ink500, 0.6), opacity: progress(frame, 0, 18) }} />

      {/* The yardstick: the ALE's line, drawn only beside the bars so it never crosses a title or the formula */}
      {lineIn > 0.01 ? (
        <svg width={LINE_X + 40} height={LINE_BOTTOM + 20} style={{ position: 'absolute', left: 0, top: g, overflow: 'visible' }}>
          {YARD_PIECES.map(([y1, y2], i) => {
            const isRow3 = i === 2;
            // rows 1–2: there from `bars`, covered from `alt`, back on `over`; row 3: drawn top to bottom on `over`
            const op = isRow3 ? lineBack : Math.min(1, 1 - lineOut + lineBack) * lineIn;
            const len = isRow3 ? (y2 - y1) * lineBack : y2 - y1;
            if (op < 0.01 || len < 1) return null;
            return (
              <line
                key={i}
                x1={LINE_X}
                x2={LINE_X}
                y1={y1}
                y2={y1 + len}
                stroke={lineHot > 0.01 ? C.cyanSoft : alpha(C.cyanSoft, 0.85)}
                strokeWidth={4 + 2 * lineHot}
                strokeDasharray="12 9"
                strokeLinecap="round"
                opacity={op * (0.8 + 0.2 * lineHot)}
              />
            );
          })}
        </svg>
      ) : null}

      {/* Row 1's empty track, so the first frames already read as a chart */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: rowTop(R1 + BAR_OFF),
          width: LINE_X,
          height: BAR_H,
          boxSizing: 'border-box',
          borderRadius: 12,
          border: `2px dashed ${alpha(C.ink500, 0.6)}`,
          opacity: progress(frame, 0, 16) * (1 - r1Grow),
        }}
      />

      {/* Row 1: the ALE */}
      <BarRow top={rowTop(R1)} tone={C.cyan} name={BAR_ALE.name} amount={BAR_ALE.amount} k={BAR_ALE.k} nameIn={r1Name} amountIn={r1Amount} grow={r1Grow} />

      {/* The difference, between the two bars */}
      <div style={{ position: 'absolute', left: 0, top: rowTop(NET_TOP), display: 'flex', gap: 18, alignItems: 'baseline', textShadow: `0 0 8px ${C.ink950}, 0 0 12px ${C.ink950}` }}>
        <span style={{ ...eqStyle, color: C.cyanSoft, opacity: netA }}>{NET.a}</span>
        <span style={{ ...eqStyle, color: C.muted, opacity: netA }}>{NET.minus}</span>
        <span style={{ ...eqStyle, color: C.emerald, opacity: netA }}>{NET.b}</span>
        <span style={{ ...eqStyle, color: C.muted, opacity: netC }}>{NET.equals}</span>
        <span style={{ ...eqStyle, color: C.textStrong, opacity: netC, transform: `scale(${0.94 + 0.06 * netC})`, transformOrigin: 'left center' }}>{NET.c}</span>
      </div>

      {/* Row 2: the control, with the ghost of the ALE it eliminates and its bracket */}
      <BarRow top={rowTop(R2)} tone={C.emerald} name={BAR_CONTROL.name} amount={BAR_CONTROL.amount} k={BAR_CONTROL.k} nameIn={r2Name} amountIn={r2Amount} grow={r2Grow} />
      {brkIn > 0.01 ? (
        <>
          {/* the ALE the control would remove: dashed ghost beyond its own bar, filled on `net` */}
          <div
            style={{
              position: 'absolute',
              left: BAR_CONTROL.k * PX,
              top: rowTop(R2 + BAR_OFF),
              width: (LINE_X - BAR_CONTROL.k * PX) * brkIn,
              height: BAR_H,
              boxSizing: 'border-box',
              borderRadius: '0 12px 12px 0',
              border: `3px dashed ${alpha(C.emerald, 0.75)}`,
              borderLeft: 'none',
              background: alpha(C.emerald, 0.06 + 0.2 * ghostFill),
            }}
          />
          <div style={{ position: 'absolute', left: 0, top: rowTop(BRACKET), width: LINE_X, height: 12, boxSizing: 'border-box', borderLeft: `3px solid ${alpha(C.amber, 0.9)}`, borderRight: `3px solid ${alpha(C.amber, 0.9)}`, borderBottom: `3px solid ${alpha(C.amber, 0.9)}`, borderRadius: '0 0 8px 8px', opacity: brkIn }} />
          <div style={{ position: 'absolute', left: LINE_X + 22, top: rowTop(R2 + BAR_OFF + 7), fontFamily: FONT.sans, fontSize: 32, fontWeight: 700, lineHeight: '38px', color: '#fde68a', whiteSpace: 'nowrap', opacity: brkIn, textShadow: `0 0 8px ${C.ink950}` }}>{ELIMINATES}</div>
        </>
      ) : null}
      {/* Row 3: the rebuild, 90.000 */}
      <BarRow
        top={rowTop(R3)}
        tone={C.amber}
        name={BAR_REBUILD.name}
        amount={BAR_REBUILD.amount}
        k={BAR_REBUILD.k}
        nameIn={r3Name}
        amountIn={r3Amount}
        grow={r3Grow}
        over={BAR_ALE.k}
        overGlow={overGlow}
        overLabel={OVER_LABEL}
      />
      {annualIn > 0.01 ? (
        <div
          style={{
            position: 'absolute',
            left: BAR_REBUILD.k * PX + 22,
            top: rowTop(R3 + BAR_OFF + 3),
            width: 46,
            height: 46,
            borderRadius: 23,
            display: 'grid',
            placeItems: 'center',
            border: `3px solid ${C.amber}`,
            background: alpha(C.amberDeep, 0.8),
            opacity: annualIn,
            transform: `scale(${0.6 + 0.4 * annualIn})`,
          }}
        >
          <Icon name="x" size={28} color={C.amber} strokeWidth={3.4} />
        </div>
      ) : null}

      {/* ===== Right column ===== */}
      {/* S1: scale chip, then the verdict, then the turned verdict */}
      {chipIn > 0.01 ? (
        <div style={{ position: 'absolute', left: RX, top: S1_TOP + 18, opacity: chipIn }}>
          <span
            style={{
              display: 'inline-flex',
              padding: '8px 20px',
              borderRadius: RADIUS.pill,
              border: `2px solid ${alpha(C.cyan, 0.6)}`,
              background: alpha(C.cyan, 0.1),
              fontFamily: FONT.sans,
              fontSize: 32,
              fontWeight: 700,
              color: C.cyanSoft,
              whiteSpace: 'nowrap',
            }}
          >
            {SCALE_CHIP}
          </span>
        </div>
      ) : null}
      <Verdict lines={FITS} tone={C.emerald} icon="check" show={fitsIn * (1 - fitsOut)} style={{ position: 'absolute', left: RX, top: S1_TOP }} />
      <Verdict lines={NO_FIT} tone={C.amber} icon="x" show={annualIn} style={{ position: 'absolute', left: RX, top: S1_TOP }} />

      {/* S2: the committee seal */}
      <div style={{ position: 'absolute', left: RX + 4, top: S2_TOP, opacity: 1 - fitsOut }}>
        <Seal lines={SEAL} show={sealIn} />
      </div>

      {/* The two cases */}
      {phoneAIn > 0.01 ? (
        <div style={{ position: 'absolute', left: RX + 120, top: PHONE_TOP, transform: `translateY(${(1 - Math.min(1, phoneAIn)) * 18}px)`, ...dimStyle(caseDim, Math.min(1, phoneAIn * 1.3)) }}>
          <CaseCard label={CASE_CHEAP} tone={C.emerald} labelIn={caseAOn}>
            <Phone width={PHONE_W} caseKind="cheap" caseOn={caseAOn} />
          </CaseCard>
        </div>
      ) : null}
      {phoneBIn > 0.01 ? (
        <div style={{ position: 'absolute', left: RX + 340, top: PHONE_TOP, transform: `translateY(${(1 - Math.min(1, phoneBIn)) * 18}px)`, ...dimStyle(caseDim, Math.min(1, phoneBIn * 1.3)) }}>
          <CaseCard label={CASE_COSTLY} tone={C.amber} labelIn={caseBOn}>
            <Phone width={PHONE_W} caseKind="costly" caseOn={caseBOn} />
          </CaseCard>
        </div>
      ) : null}

      {/* The note: another argument */}
      {noteIn > 0.01 ? (
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: NOTE_TOP,
            width: RX - 36,
            boxSizing: 'border-box',
            padding: '12px 24px',
            borderRadius: RADIUS.md,
            borderLeft: `6px solid ${C.amber}`,
            background: alpha(C.amberDeep, 0.38),
            fontFamily: FONT.sans,
            fontSize: 32,
            fontWeight: 650,
            lineHeight: 1.22,
            color: C.text,
            opacity: noteIn,
            transform: `translateY(${(1 - noteIn) * 14}px)`,
          }}
        >
          {NOTE}
        </div>
      ) : null}
    </Stage>
  );
}

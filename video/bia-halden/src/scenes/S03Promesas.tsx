import type { CSSProperties } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress, pulse } from '../../../engine/src/theme/motion';
import { clamp01, dimStyle, focusWeights, mix, windowWeight } from '../../../engine/src/ui';
import {
  CAFE_TAG,
  DIALS,
  PROCESSES,
  RPO_LABEL,
  RTO_LABEL,
  TILL_BROKEN,
  VALUES,
} from '../data/s03-promesas';
import { Clock, Notebook, Till } from './parts/Cafe';
import { Dial } from './parts/s03-promesas/Dial';
import { AnswerButtons, BUTTONS_W } from './parts/s03-promesas/AnswerButtons';
import { CARD_H, CARD_W, ProcessCard } from './parts/s03-promesas/ProcessCard';
import { Stage, wordFrame } from './kit';

const S = 's03-promesas';
const W = 1728;

// ---- Café layout (stage-local).
const COL_W = 600;
const SIDE_CX = [300, 1428] as const;
const GLYPH = 230;
const GLYPH_TOP = 104;
const LABEL_TOP = 392;
const TILL_SIZE = 300;
const TILL_TOP = 88;
const COUNTER_Y = 356;

// ---- Cards: they come in high and glide down once the think prompt needs the top band.
const ROW_GAP = 10;
const ROWS_TOP_EARLY = 56;
const ROWS_TOP_THINK = 190;
const BUTTONS_TOP = 582;

// ---- Dials.
const DIAL_SIZE = 380;
const DIAL_TOP = 36;
const DIAL_CX = [432, 1296] as const;
const DIAL_LABEL_TOP = 440;
const DIAL_LABEL_W = 760;

/** «RTO · cuánto…»: the term in its colour, the rest in text. */
function Lead({ line, tone, size = 40 }: { line: string; tone: string; size?: number }) {
  const i = line.indexOf(' · ');
  const head = i < 0 ? '' : line.slice(0, i);
  const rest = i < 0 ? line : line.slice(i);
  return (
    <div style={{ fontFamily: FONT.sans, fontSize: size, fontWeight: 750, lineHeight: 1.2, color: C.textStrong, textAlign: 'center', textWrap: 'balance' }}>
      <span style={{ color: tone, fontWeight: 900 }}>{head}</span>
      {rest}
    </div>
  );
}

function Term({ text }: { text: string }) {
  return (
    <div style={{ marginTop: 8, fontFamily: FONT.mono, fontSize: 32, fontWeight: 700, color: '#c4b5fd', textAlign: 'center' }}>{text}</div>
  );
}

/** A bit of the tally under the notebook: `n` strokes, the fifth crossing the other four. */
function Tally({ marks }: { marks: number }) {
  const groups = [0, 1];
  return (
    <svg width={220} height={44} viewBox="0 0 220 44" style={{ overflow: 'visible' }}>
      {groups.map((g) => {
        const base = g * 5;
        const x0 = 10 + g * 112;
        return (
          <g key={g}>
            {[0, 1, 2, 3].map((i) =>
              marks > base + i ? <line key={i} x1={x0 + i * 20} y1={4} x2={x0 + i * 20} y2={40} stroke={C.amber} strokeWidth={6} strokeLinecap="round" /> : null,
            )}
            {marks > base + 4 ? <line x1={x0 - 8} y1={34} x2={x0 + 70} y2={10} stroke={C.amber} strokeWidth={6} strokeLinecap="round" /> : null}
          </g>
        );
      })}
    </svg>
  );
}

/**
 * s03-promesas «Dos promesas por proceso». Phase A: the café (labelled «imagen · no es del puerto»): the till is fine, it
 * breaks (`till`), the clock arrives (`clock`) and the notebook (`notebook`); each gets its label as the voice names it
 * (`rto`, `rpo`). Phase B: the café steps back and the two process cards of s02 come back with empty slots (`rows`);
 * Operaciones is the one to fill (`board`, `both-set`: RTO 30 min · RPO 24 h and its note, with the lock),
 * Facturación follows (`bills`: RTO 48 h and its note, the RPO slot stays empty). On `think` the answers appear as two
 * equal pills (the prompt itself is the engine's, in the top band, so the cards sit below it); on `rpo-five` the
 * RPO slot takes «RPO 5 min» and «Más a menudo» lights. On `two-dials` the cards give way to two dials in words.
 */
export function S03Promesas(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cafeAt = props.cue('cafe');
  const tillAt = props.cue('till');
  const clockAt = props.cue('clock');
  const notebookAt = props.cue('notebook');
  const rtoAt = props.cue('rto');
  const rpoAt = props.cue('rpo');
  const rowsAt = props.cue('rows');
  const boardAt = props.cue('board');
  const bothAt = props.cue('both-set');
  const billsAt = props.cue('bills');
  const thinkAt = props.cue('think');
  const fiveAt = props.cue('rpo-five');
  const dialsAt = props.cue('two-dials');

  // ================= Phase A: the café =================
  const cafeIn = progress(frame, 0, 16);
  const tillIn = progress(frame, Math.max(0, cafeAt - 4), 16);
  const broken = progress(frame, tillAt, 10);
  const throb = 0.6 + 0.4 * pulse(frame, fps, 0.7);
  const clockIn = progress(frame, clockAt - 4, 18);
  const notebookIn = progress(frame, notebookAt - 4, 18);
  const cafeOut = progress(frame, rowsAt - 6, 22, EASE.inOut);

  // The voice is on the clock (rto) and then on the notebook (rpo): the other one steps back.
  const fw = focusWeights(frame, [rtoAt, rpoAt], { end: rowsAt - 6 });
  const clockFocus = fw.weights[0];
  const noteFocus = fw.weights[1];
  const tillDim = Math.max(clockFocus, noteFocus) * 0.9;

  // Time passes round the clock; sales pile up in the notebook.
  const ring = progress(frame, clockAt + 6, 160, EASE.linear);
  const marks = Math.min(10, Math.max(0, Math.floor((frame - notebookAt - 6) / 16) + 1));
  const rtoLabel = enter(frame, rtoAt, { distance: 14 });
  const rpoLabel = enter(frame, rpoAt, { distance: 14 });
  const brokenLabel = enter(frame, tillAt + 4, { distance: 10 });

  // ================= Phase B: the cards =================
  const rowsIn = [progress(frame, rowsAt, 18), progress(frame, rowsAt + 12, 18)];
  const cardFocus = focusWeights(frame, [boardAt, billsAt], { end: dialsAt });
  const rowsTop = mix(ROWS_TOP_EARLY, ROWS_TOP_THINK, progress(frame, thinkAt - 2, 26, EASE.inOut));
  const rowsOut = progress(frame, dialsAt - 6, 18, EASE.inOut);

  // Operaciones fills on the words, with the lock on the cue.
  const boardRto = progress(frame, wordFrame(S, 's03-04', 'media') - 4, 14);
  const boardRpo = progress(frame, wordFrame(S, 's03-04', 'día') - 4, 14);
  const boardNote = progress(frame, wordFrame(S, 's03-04', 'datos') + 2, 14);
  const lock = progress(frame, bothAt, 12);
  // Facturación: RTO 48 h and its note; the RPO slot stays empty until the answer.
  const billsRto = progress(frame, wordFrame(S, 's03-04', 'dos') - 4, 14);
  const billsNote = progress(frame, wordFrame(S, 's03-04', 'casi') - 4, 14);
  const answered = frame >= fiveAt;
  const billsRpo = progress(frame, fiveAt, 14);

  // The answers.
  const btnIn: [number, number] = [progress(frame, thinkAt + 6, 16), progress(frame, thinkAt + 14, 16)];
  const reveal = progress(frame, fiveAt, 16);
  const btnOut = progress(frame, dialsAt - 6, 18, EASE.inOut);

  // ================= Phase C: the dials =================
  const dialRtoIn = progress(frame, dialsAt - 2, 18);
  const cincoAt = wordFrame(S, 's03-07', 'cinco');
  const dialRpoIn = progress(frame, cincoAt - 10, 18);
  const rtoSweep = progress(frame, dialsAt + 2, 44, EASE.inOut);
  const rpoSweep = progress(frame, cincoAt - 6, 44, EASE.inOut);
  const dosAt = wordFrame(S, 's03-07', 'dos');
  const rtoValue = progress(frame, dosAt, 12);
  const rpoValue = progress(frame, cincoAt, 12);
  const esperarAt = wordFrame(S, 's03-08', 'esperar');
  const perderAt = wordFrame(S, 's03-08', 'perder');
  const rtoGlow = windowWeight(frame, esperarAt, perderAt, { ramp: 12, lead: 4 });
  const rpoGlow = windowWeight(frame, perderAt, Number.POSITIVE_INFINITY, { ramp: 12, lead: 4 });
  const dialsUp = Math.max(dialRtoIn, dialRpoIn);

  const absolute = (left: number, top: number, extra?: CSSProperties): CSSProperties => ({ position: 'absolute', left, top, ...extra });

  const showCafe = cafeOut < 0.999;

  return (
    <Stage>
      {/* ================= Phase A: the café ================= */}
      {showCafe ? (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 1 - cafeOut,
            transform: `scale(${1 - 0.06 * cafeOut}) translateY(${-24 * cafeOut}px)`,
            transformOrigin: '50% 40%',
          }}
        >
          {/* the label: this is not the port */}
          <div
            style={{
              ...absolute(0, 0),
              opacity: cafeIn,
              fontFamily: FONT.mono,
              fontSize: 32,
              fontWeight: 700,
              color: C.muted,
              padding: '6px 20px',
              borderRadius: RADIUS.pill,
              border: `2px dashed ${alpha(C.muted, 0.7)}`,
              background: alpha(C.ink900, 0.7),
              whiteSpace: 'nowrap',
            }}
          >
            {CAFE_TAG}
          </div>

          {/* the till on its counter */}
          <div style={absolute((W - 560) / 2, COUNTER_Y, { width: 560, height: 8, borderRadius: 4, background: C.ink600, opacity: cafeIn })} />
          <div style={absolute((W - TILL_SIZE) / 2, TILL_TOP, { opacity: tillIn * (1 - 0.6 * tillDim), filter: tillDim > 0.01 ? `saturate(${1 - 0.5 * tillDim})` : undefined })}>
            <Till size={TILL_SIZE} broken={broken} glow={broken > 0.5 ? throb * broken : 0} />
          </div>
          <div
            style={{
              ...absolute((W - 480) / 2, COUNTER_Y + 30, { width: 480, textAlign: 'center' }),
              ...brokenLabel,
              opacity: brokenLabel.opacity * (1 - 0.6 * tillDim),
              fontFamily: FONT.sans,
              fontSize: 40,
              fontWeight: 800,
              color: C.roseSoft,
            }}
          >
            {TILL_BROKEN}
          </div>

          {/* the clock on the wall (RTO) */}
          <div
            style={{
              ...absolute(SIDE_CX[0] - COL_W / 2, 0, { width: COL_W, height: 600 }),
              ...dimStyle(noteFocus, clockIn),
              transform: `translateY(${(1 - clockIn) * 20}px) scale(${1 + 0.05 * clockFocus - 0.03 * noteFocus})`,
              transformOrigin: '50% 30%',
            }}
          >
            <div style={absolute((COL_W - GLYPH) / 2, GLYPH_TOP)}>
              <Clock size={GLYPH} glow={0.3 + 0.7 * clockFocus} />
              {/* elapsed time: a ring that closes round the clock */}
              <svg width={GLYPH} height={GLYPH} viewBox="0 0 100 100" style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
                <circle
                  cx={50}
                  cy={50}
                  r={55}
                  fill="none"
                  stroke={C.cyanSoft}
                  strokeWidth={3.5}
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 55} ${2 * Math.PI * 55}`}
                  strokeDashoffset={2 * Math.PI * 55 * (1 - ring)}
                  transform="rotate(-90 50 50)"
                  opacity={0.9 * clockIn}
                />
              </svg>
            </div>
            <div style={absolute(0, LABEL_TOP, { width: COL_W, ...rtoLabel })}>
              <Lead line={RTO_LABEL.line} tone={C.cyan} />
              <Term text={RTO_LABEL.term} />
            </div>
          </div>

          {/* the notebook (RPO) */}
          <div
            style={{
              ...absolute(SIDE_CX[1] - COL_W / 2, 0, { width: COL_W, height: 600 }),
              ...dimStyle(clockFocus, notebookIn),
              transform: `translateY(${(1 - notebookIn) * 20}px) scale(${1 + 0.05 * noteFocus - 0.03 * clockFocus})`,
              transformOrigin: '50% 30%',
            }}
          >
            <div style={absolute((COL_W - GLYPH) / 2, GLYPH_TOP)}>
              <Notebook size={GLYPH} glow={0.3 + 0.7 * noteFocus} />
            </div>
            <div style={absolute((COL_W - 220) / 2, GLYPH_TOP + GLYPH + 6, { opacity: notebookIn })}>
              <Tally marks={marks} />
            </div>
            <div style={absolute(0, LABEL_TOP + 16, { width: COL_W, ...rpoLabel })}>
              <Lead line={RPO_LABEL.line} tone={C.amber} />
              <Term text={RPO_LABEL.term} />
            </div>
          </div>
        </div>
      ) : null}

      {/* ================= Phase B: the cards and the answers ================= */}
      {frame >= rowsAt - 2 && rowsOut < 0.999 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: 1 - rowsOut, transform: `translateY(${-14 * rowsOut}px)` }}>
          {PROCESSES.map((p, i) => {
            const isBoard = p.key === 'board';
            const k = isBoard ? 0 : 1;
            const focus = cardFocus.weights[k];
            const dim = cardFocus.dims[k];
            return (
              <div key={p.key} style={absolute((W - CARD_W) / 2, rowsTop + i * (CARD_H + ROW_GAP))}>
                <ProcessCard
                  name={p.name}
                  area={p.area}
                  show={rowsIn[i]}
                  focus={focus}
                  dim={dim}
                  rtoValue={isBoard ? VALUES.board.rto : VALUES.bills.rto}
                  rpoValue={isBoard ? VALUES.board.rpo : answered ? VALUES.bills.rpoFive : null}
                  note={isBoard ? VALUES.board.note : VALUES.bills.note}
                  rtoShow={isBoard ? boardRto : billsRto}
                  rpoShow={isBoard ? boardRpo : billsRpo}
                  noteShow={isBoard ? boardNote : billsNote}
                  locked={isBoard ? lock : 0}
                  rpoPending={!isBoard && !answered && frame >= billsAt}
                  rpoLit={isBoard ? 0 : reveal}
                />
              </div>
            );
          })}
          {frame >= thinkAt ? (
            <div style={{ ...absolute((W - BUTTONS_W) / 2, BUTTONS_TOP), opacity: 1 - btnOut }}>
              <AnswerButtons show={btnIn} reveal={reveal} />
            </div>
          ) : null}
        </div>
      ) : null}

      {/* ================= Phase C: two dials in words ================= */}
      {dialsUp > 0.001 ? (
        <>
          {([
            { key: 'rto', cx: DIAL_CX[0], tone: C.cyan, line: DIALS.rto.line, value: DIALS.rto.value, target: 82, sweep: rtoSweep, show: dialRtoIn, vShow: rtoValue, glow: rtoGlow, term: RTO_LABEL.term },
            { key: 'rpo', cx: DIAL_CX[1], tone: C.amber, line: DIALS.rpo.line, value: DIALS.rpo.value, target: -82, sweep: rpoSweep, show: dialRpoIn, vShow: rpoValue, glow: rpoGlow, term: RPO_LABEL.term },
          ] as const).map((d) => (
            <div key={d.key}>
              <div style={absolute(d.cx - DIAL_SIZE / 2, DIAL_TOP)}>
                <Dial size={DIAL_SIZE} tone={d.tone} target={d.target} at={d.sweep} show={d.show} glow={d.glow} value={d.value} valueShow={d.vShow} />
              </div>
              <div
                style={{
                  ...absolute(d.cx - DIAL_LABEL_W / 2, DIAL_LABEL_TOP, { width: DIAL_LABEL_W }),
                  opacity: clamp01(d.show * 1.3),
                  transform: `translateY(${(1 - clamp01(d.show)) * 16}px)`,
                }}
              >
                <Lead line={d.line} tone={d.tone} size={44} />
                <Term text={d.term} />
              </div>
            </div>
          ))}
        </>
      ) : null}
    </Stage>
  );
}

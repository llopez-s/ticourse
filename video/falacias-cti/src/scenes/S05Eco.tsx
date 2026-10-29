import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { ACCENT, C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { Icon, type IconName } from '../../../engine/src/ui';
import { CARDS, CITES, CONSENSUS, COUNTER, INDEP, PROVISIONAL, SHEET_TITLE, THERMO } from '../data/s05-eco';
import { CraneCard } from './parts/CraneCard';
import { Desk } from './parts/Desk';
import { ExampleLabel } from './parts/ExampleLabel';
import { Thermometer } from './parts/Marks';
import { Bars, DraftSheet, PAPER, Sheet } from './parts/Paper';
import { Arrow, linePoints, partial } from './parts/strokes';
import { RedPen } from './parts/Pen';
import { Stage, segment, wordFrame } from './kit';

const S = 's05-eco';
const W = STAGE.width;

/** The sheet with the three reports (left) and the right column. */
const SHEET = { x: 20, y: 214, w: 820, h: 380 } as const;
const CARD_A = { x: 170, y: 72, w: 480, h: 104 } as const;
const CARD_B = { x: 40, y: 270, w: 290, h: 96 } as const;
const CARD_C = { x: 490, y: 270, w: 290, h: 96 } as const;
const CENTRE = (c: { x: number; y: number; w: number; h: number }) => ({ x: c.x + c.w / 2, y: c.y + c.h / 2 });

const B_TO_A = linePoints({ x: 160, y: 262 }, { x: 262, y: 184 }, { n: 16, wobble: 1.5 });
const C_TO_B = linePoints({ x: 484, y: 318 }, { x: 338, y: 318 }, { n: 16, wobble: 1.5 });
const C_TO_A = linePoints({ x: 660, y: 262 }, { x: 560, y: 184 }, { n: 16, wobble: 1.5 });
const LAP = [
  ...linePoints(CENTRE(CARD_A), CENTRE(CARD_B), { n: 16, wobble: 0 }),
  ...linePoints(CENTRE(CARD_B), CENTRE(CARD_C), { n: 16, wobble: 0 }),
  ...linePoints(CENTRE(CARD_C), CENTRE(CARD_A), { n: 16, wobble: 0 }),
];

const COL = { x: 870, thermo: 880, label: 996, counters: 1236 } as const;

/** A small report card: its letter and text bars. No name, no signature. */
function Report({ box, letter, tag, glow = 0 }: { box: { w: number; h: number }; letter: string; tag?: { text: string; show: number }; glow?: number }) {
  return (
    <Sheet width={box.w} height={box.h} tone={C.sky} glow={glow} style={{ borderRadius: 14 }}>
      <div style={{ position: 'absolute', left: 16, top: (box.h - 62) / 2, width: 62, height: 62, borderRadius: 31, background: alpha(C.sky, 0.25), border: `3px solid ${alpha(C.sky, 0.85)}`, display: 'grid', placeItems: 'center', fontSize: 40, fontWeight: 900, color: PAPER.ink, fontFamily: FONT.sans }}>{letter}</div>
      {tag ? (
        <div style={{ position: 'absolute', left: 96, top: 14, fontSize: 30, fontWeight: 800, color: C.amberDeep, whiteSpace: 'nowrap', opacity: tag.show, transform: `translateY(${(1 - tag.show) * 8}px)`, fontFamily: FONT.sans }}>{tag.text}</div>
      ) : null}
      <Bars x={96} y={tag ? 58 : 30} widths={[box.w - 96 - 28, box.w - 96 - 90]} h={12} gap={12} />
    </Sheet>
  );
}

/** A label on the paper (the «cita a» / «ve consenso» legends). */
function Legend({ x, y, text, show, color = PAPER.ink }: { x: number; y: number; text: string; show: number; color?: string }) {
  return (
    <div style={{ position: 'absolute', left: x, top: y, fontSize: 32, fontWeight: 800, color, whiteSpace: 'nowrap', opacity: show, transform: `translateY(${(1 - show) * 8}px)`, fontFamily: FONT.sans }}>{text}</div>
  );
}

const ORIGINS: readonly IconName[] = ['eye', 'database', 'network'];

/**
 * s05-eco «Tres fuentes, ninguna prueba nueva». The note is there from the first frame; the engine's message (PAPER CRANE)
 * is over the top of the stage until s05-01 ends, with the same card top right.
 *   reply-crane2  the message steps aside; a sheet of examples: «3 informes dicen lo mismo», cards A, B and C
 *   chain         two citations (arrows with «cita a»: B cita a A, C cita a B) and a dotted line, the third join, that
 *                 is not a citation: A «ve consenso» (C to A). The thermometer «confianza en la atribución» rises with
 *                 each join, with «atribución provisional» on A; then a dot goes round the ring and it rises at each lap
 *   zero          (sfx «block») «fuentes: 3» against «pruebas nuevas: 0», and «eco de feeds» under them
 *   indep         the rule «solo cuentas pruebas independientes, no repeticiones» and a row of cards that each cite their
 *                 own origin and never each other, facing the ring (dim). The engine's exam card follows the sentence
 */
export function S05Eco(props: SceneProps) {
  const frame = useCurrentFrame();
  const replyAt = props.cue('reply-crane2');
  const chainAt = props.cue('chain');
  const zeroAt = props.cue('zero');
  const indepAt = props.cue('indep');
  const msg = segment(props, 's05-01');
  const at = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);
  const p = (start: number, dur = 14) => progress(frame, start, dur);

  // ---- PAPER CRANE's card, top right.
  const crane = p(Math.max(8, msg.from - 80), 16) * (1 - p(msg.to - 10, 14));

  // ---- The draft of s01 waits on the desk until the sheet of examples comes in.
  const sheetIn = enter(frame, replyAt, { distance: -80, duration: 24, axis: 'x' });
  const draftOut = p(replyAt - 6, 22);

  // ---- The three reports and their joins.
  const cardIn = [0, 1, 2].map((i) => enter(frame, replyAt + 8 + i * 8, { distance: 22, duration: 16 }));
  const titleIn = enter(frame, replyAt + 2, { distance: 12, duration: 16 });
  const provisional = p(at('s05-02', 'atribución') - 4, 16);
  const citeB = at('s05-02', 'cita');
  const citeC = at('s05-02', 'tercero');
  const consensusAt = at('s05-02', 'consenso');
  const joins = [progress(frame, citeB - 6, 22, EASE.inOut), progress(frame, citeC - 4, 22, EASE.inOut), progress(frame, consensusAt - 8, 26, EASE.inOut)];
  const legends = [p(citeB + 10), p(citeC + 8), p(consensusAt + 12)];

  // ---- The thermometer: a step at each join, then one per lap of the dot round the ring.
  const lapStart = (k: number) => zeroAt + 24 + k * 72;
  const laps = [0, 1, 2].map((k) => progress(frame, lapStart(k) + 56, 16));
  const level = 0.1 + 0.08 * p(at('s05-02', 'atribución'), 16) + 0.14 * joins[0] + 0.14 * joins[1] + 0.2 * joins[2] + 0.1 * laps[0] + 0.1 * laps[1] + 0.1 * laps[2];
  const thermoIn = p(chainAt - 4, 18);
  const lapP = [0, 1, 2].map((k) => progress(frame, lapStart(k), 56, EASE.inOut));
  const dotLap = lapP.findIndex((v) => v > 0 && v < 1);
  const dot = dotLap >= 0 ? partial(LAP, lapP[dotLap]).tip : null;

  // ---- The counters.
  const sources = enter(frame, zeroAt, { distance: 18, duration: 16 });
  const fresh = enter(frame, zeroAt + 10, { distance: 18, duration: 16 });
  const block = p(zeroAt + 10, 8) * (1 - p(zeroAt + 40, 24));
  const echo = enter(frame, at('s05-03', 'eco') - 6, { distance: 14, duration: 16 });

  // ---- The rule and the independent cards.
  const toIndep = progress(frame, indepAt - 10, 22, EASE.inOut);
  const ruleIn = enter(frame, indepAt, { distance: 16, duration: 18 });
  const indIn = [0, 1, 2].map((i) => enter(frame, indepAt + 8 + i * 8, { distance: 20, duration: 16 }));
  const outs = [0, 1, 2].map((i) => progress(frame, indepAt + 24 + i * 8, 20, EASE.inOut));
  const ringDim = 0.55 * toIndep;

  return (
    <Stage>
      <Desk />
      <ExampleLabel width={W} />

      <div style={{ position: 'absolute', left: 1326, top: 14 }}>
        <CraneCard width={390} show={crane} />
      </div>

      {/* The draft of s01 and its pen, still on the desk while the message is up */}
      {draftOut < 0.999 ? (
        <div style={{ opacity: 1 - draftOut, transform: `translateX(${draftOut * 160}px)` }}>
          <div style={{ position: 'absolute', left: 678, top: 286 }}>
            <DraftSheet scale={0.6} checks={[1, 1, 1]} pill={1} q={1} dim={0.2} />
          </div>
          <RedPen x={678 + 372 + 70} y={556} angle={-72} capped />
        </div>
      ) : null}

      {/* The sheet with the three reports */}
      {frame >= replyAt - 4 ? (
        <div style={{ position: 'absolute', left: SHEET.x, top: SHEET.y, opacity: sheetIn.opacity * (1 - ringDim), transform: sheetIn.transform }}>
          <Sheet width={SHEET.w} height={SHEET.h} tone={C.sky}>
            <div style={{ position: 'absolute', left: 28, top: 12, fontSize: 38, fontWeight: 850, letterSpacing: -0.4, color: PAPER.ink, whiteSpace: 'nowrap', opacity: titleIn.opacity, transform: titleIn.transform }}>{SHEET_TITLE}</div>
            {[CARD_A, CARD_B, CARD_C].map((c, i) => (
              <div key={CARDS[i]} style={{ position: 'absolute', left: c.x, top: c.y, opacity: cardIn[i].opacity, transform: cardIn[i].transform }}>
                <Report box={c} letter={CARDS[i]} tag={i === 0 ? { text: PROVISIONAL, show: provisional } : undefined} glow={i === 0 ? 0.5 * joins[2] : 0} />
              </div>
            ))}
            <svg width={SHEET.w} height={SHEET.h} viewBox={`0 0 ${SHEET.w} ${SHEET.h}`} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} aria-hidden>
              <Arrow points={B_TO_A} p={joins[0]} color={C.cyanDeep} width={6} head={22} />
              <Arrow points={C_TO_B} p={joins[1]} color={C.cyanDeep} width={6} head={22} />
              <Arrow points={C_TO_A} p={joins[2]} color={C.amberDeep} width={6} head={22} dashed />
              {dot ? <circle cx={dot.x} cy={dot.y} r={13} fill={C.rose} stroke={C.textStrong} strokeWidth={3} /> : null}
            </svg>
            <Legend x={52} y={196} text={CITES} show={legends[0]} />
            <Legend x={368} y={268} text={CITES} show={legends[1]} />
            <Legend x={604} y={196} text={CONSENSUS} show={legends[2]} color={C.amberDeep} />
          </Sheet>
        </div>
      ) : null}

      {/* The thermometer */}
      {thermoIn > 0.01 ? (
        <div style={{ position: 'absolute', left: COL.thermo, top: 232, opacity: thermoIn * (1 - toIndep) }}>
          <Thermometer height={340} level={level} glow={Math.max(joins[2] * (1 - laps[2]), 0) * 0.6} />
        </div>
      ) : null}
      {thermoIn > 0.01 ? (
        <div style={{ position: 'absolute', left: COL.label, top: 236, width: 230, fontFamily: FONT.sans, fontSize: 32, fontWeight: 800, lineHeight: 1.18, color: C.text, opacity: thermoIn * (1 - toIndep) }}>
          {THERMO.split(' ').reduce<string[]>((lines, w) => {
            const last = lines[lines.length - 1];
            if (last !== undefined && (last + ' ' + w).length <= 14) lines[lines.length - 1] = `${last} ${w}`;
            else lines.push(w);
            return lines;
          }, []).map((l) => (
            <div key={l} style={{ whiteSpace: 'nowrap' }}>
              {l}
            </div>
          ))}
        </div>
      ) : null}

      {/* The counters: three sources against no new evidence */}
      {frame >= zeroAt - 4 ? (
        <div style={{ position: 'absolute', left: COL.counters, top: 232, width: W - COL.counters - 20, fontFamily: FONT.sans, opacity: 1 - toIndep }}>
          <div style={{ opacity: sources.opacity, transform: sources.transform, display: 'flex', alignItems: 'baseline', gap: 14, padding: '10px 26px', borderRadius: RADIUS.lg, border: `3px solid ${alpha(C.amber, 0.7)}`, background: alpha(C.amber, 0.1), whiteSpace: 'nowrap' }}>
            <span style={{ fontSize: 36, fontWeight: 800, color: C.text }}>{COUNTER.sources}:</span>
            <span style={{ fontSize: 76, fontWeight: 900, color: ACCENT.amber.soft, lineHeight: 1 }}>{COUNTER.sourcesValue}</span>
          </div>
          <div style={{ marginTop: 22, opacity: fresh.opacity, transform: fresh.transform, display: 'flex', alignItems: 'baseline', gap: 14, padding: '10px 26px', borderRadius: RADIUS.lg, border: `3px solid ${alpha(C.rose, 0.7 + 0.3 * block)}`, background: alpha(C.rose, 0.1 + 0.2 * block), boxShadow: block > 0.01 ? `0 0 ${Math.round(34 * block)}px ${alpha(C.rose, 0.5 * block)}` : undefined, whiteSpace: 'nowrap' }}>
            <span style={{ fontSize: 36, fontWeight: 800, color: C.text }}>{COUNTER.fresh}:</span>
            <span style={{ fontSize: 76, fontWeight: 900, color: C.roseSoft, lineHeight: 1 }}>{COUNTER.freshValue}</span>
          </div>
          <div style={{ marginTop: 26, opacity: echo.opacity, transform: echo.transform, fontSize: 52, fontWeight: 900, letterSpacing: 0.5, color: C.textStrong, whiteSpace: 'nowrap' }}>{COUNTER.echo}</div>
        </div>
      ) : null}

      {/* The rule and the independent cards */}
      {toIndep > 0.01 ? (
        <div style={{ position: 'absolute', left: COL.x, top: 214, width: W - COL.x - 20, fontFamily: FONT.sans, opacity: toIndep }}>
          <div style={{ opacity: ruleIn.opacity, transform: ruleIn.transform, fontSize: 42, fontWeight: 850, lineHeight: 1.16, letterSpacing: -0.4, color: C.textStrong, whiteSpace: 'nowrap' }}>
            <div>{INDEP.rule[0]}</div>
            <div style={{ color: ACCENT.emerald.soft }}>{INDEP.rule[1]}</div>
          </div>
          <div style={{ position: 'relative', marginTop: 24, height: 280 }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ position: 'absolute', left: 30 + i * 270, top: 0, width: 230, opacity: indIn[i].opacity, transform: indIn[i].transform }}>
                <Report box={{ w: 230, h: 110 }} letter={String(i + 1)} />
                <svg width={230} height={170} viewBox="0 0 230 170" style={{ position: 'absolute', left: 0, top: 110, overflow: 'visible' }} aria-hidden>
                  <Arrow points={linePoints({ x: 115, y: 6 }, { x: 115, y: 44 }, { n: 10, wobble: 0 })} p={outs[i]} color={C.emerald} width={6} head={20} />
                </svg>
                <div style={{ position: 'absolute', left: 115 - 40, top: 158, width: 80, height: 80, borderRadius: 40, display: 'grid', placeItems: 'center', background: alpha(C.emerald, 0.14), border: `3px solid ${alpha(C.emerald, 0.8)}`, opacity: outs[i] }}>
                  <Icon name={ORIGINS[i]} size={44} color={C.emerald} strokeWidth={2} />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </Stage>
  );
}

import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { Icon, mix, windowWeight } from '../../../engine/src/ui';
import { S04_BOARD, S04_FEEDBACK, S04_JUDGE, S04_TITLES, S04_WRAP } from '../data/s04-final';
import { BoardTable, GuestBook, PanelTitle, PlateTable, Report, Tray, ValuationCard } from './parts/KitchenBits';
import { StationLine, stationX, type StationState } from './parts/StationLine';
import { Stage, wordFrame } from './kit';

const S = 's04-final';
const W = STAGE.width;
/** Nothing in the top ~200 px while EMBER FOX's message is up (from before s04-04 to its end). */
const TOP = 206;
/** The tags that share the message's band sit a little lower. */
const TAG_Y = 226;

/**
 * s04-final «De la valoración al aplauso». The three last stations, one panel each, with the line small at the
 * bottom (its current station lit) and everything under y 200 — EMBER FOX's message sits on s04-04.
 *   judge     Analysis & Production: a valuation card («juicio · valoración · hipótesis», a confidence meter)
 *             whose heading is EMPTY; «¿valoración de qué?» is written into it, and a perfect plate lands on a
 *             table with no comanda («sin comanda»).
 *   board     Dissemination: a technical report rides a tray to the board's table («consejo») — the wrong
 *             table («mesa equivocada»), sound `block` on the cue.
 *   reply-ii  the message is up: a «…» over the board's chair, «nadie se queja · no es un aplauso», and the
 *             question that defines Feedback («¿se cubrió la necesidad? · refina los requirements») arrives.
 *   feedback  an empty guest book, five empty stars, «sin feedback · el ciclo nunca mejora».
 *   wrap-ii   the line grows to the whole chain, first and last amber, a spark running along it: «sin pregunta
 *             falla en cadena» under the first, «sin feedback ni te enteras» under the last.
 * Image and supposition: nothing here says a Meridian report failed.
 */
export function S04Final(props: SceneProps) {
  const frame = useCurrentFrame();
  const judgeAt = props.cue('judge');
  const boardAt = props.cue('board');
  const replyAt = props.cue('reply-ii');
  const feedbackAt = props.cue('feedback');
  const wrapAt = props.cue('wrap-ii');
  const at = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);
  const p = (start: number, dur = 14) => progress(frame, start, dur);

  const fbWord = at('s04-04', 'Feedback') - 6;
  const defAt = at('s04-04', 'comprobar') - 6;

  // ---- Panel visibility.
  const aOut = 1 - progress(frame, boardAt - 8, 14, EASE.inOut);
  const bIn = p(boardAt - 4, 14);
  const bOut = 1 - progress(frame, feedbackAt - 8, 14, EASE.inOut);
  const bDim = 0.55 * progress(frame, fbWord, 16);
  const dIn = p(feedbackAt - 4, 16);
  const dOut = 1 - progress(frame, wrapAt - 12, 14, EASE.inOut);
  const defOut = 1 - progress(frame, wrapAt - 12, 14, EASE.inOut);
  const defIn = enter(frame, defAt, { distance: 18, duration: 16 });

  // ---- The valuation and the plate.
  const cardIn = p(judgeAt - 4, 18);
  const chips = progress(frame, at('s04-01', 'valoración') - 6, 36);
  const meter = progress(frame, at('s04-01', 'cuánto') - 4, 40);
  const ask = p(at('s04-02', 'valoración') - 4, 14);
  const plate = p(at('s04-02', 'plato') - 6, 18);
  const empty = p(at('s04-02', 'nadie') - 6, 16);

  // ---- The report rides to the wrong table.
  const reportAt = at('s04-03', 'mandas') - 4;
  const toBoard = at('s04-03', 'consejo') - 4;
  const arrive = Math.max(toBoard + 36, at('s04-03', 'mesa') + 4);
  const ride = progress(frame, toBoard, arrive - toBoard, EASE.inOut);
  const wrongIn = p(arrive, 12);
  const silenceAt = at('s04-04', 'queje') - 6;
  const silence = p(silenceAt, 14);
  const tagSwap = p(replyAt + 4, 12);

  // ---- The line, small at the bottom, then the whole chain.
  const big = progress(frame, wrapAt - 10, 26, EASE.inOut);
  const tile = mix(76, 130, big);
  const lineY = mix(540, 170, big);
  const label = 32;
  const cur = [windowWeight(frame, 0, boardAt), windowWeight(frame, boardAt, fbWord), windowWeight(frame, fbWord, wrapAt)];
  const states: StationState[] = [0, 1, 2, 3, 4, 5].map((i) => {
    const forgotten = i === 0 || i === 5;
    const amber = forgotten ? big : 0;
    const w = i >= 3 ? cur[i - 3] : 0;
    const passed = i >= 3 && i <= 4 ? progress(frame, [boardAt, fbWord][i - 3], 16) * (1 - w) : 0;
    return {
      show: 1,
      name: big,
      tone: amber > 0.5 ? 'amber' : 'cyan',
      lit: Math.max(w, 0.35 * passed, big * 0.85),
      dim: big < 1 && i < 3 ? 0.55 * (1 - big) : 0,
    };
  });

  // ---- The spark that runs along the chain.
  const sparkAt = wrapAt + 8;
  const spark = progress(frame, sparkAt, 70, EASE.inOut);
  const c0 = stationX(W, 0);
  const c5 = stationX(W, 5);

  return (
    <Stage>
      {/* ---- Analysis & Production */}
      {aOut > 0.01 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: aOut }}>
          <div style={{ position: 'absolute', left: 0, top: TOP }}>
            <PanelTitle kind="stove" show={cardIn}>
              {S04_TITLES.judge}
            </PanelTitle>
          </div>
          <div style={{ position: 'absolute', left: 0, top: TOP + 64, opacity: cardIn, transform: `translateY(${(1 - cardIn) * 18}px)` }}>
            <ValuationCard width={820} chips={chips} meter={meter} ask={ask} header={S04_JUDGE.header} words={S04_JUDGE.chips} confidence={S04_JUDGE.confidence} />
          </div>
          <div style={{ position: 'absolute', left: 900, top: TOP + 44 }}>
            <PlateTable width={828} plate={plate} empty={empty} label={S04_JUDGE.noOrder} />
          </div>
        </div>
      ) : null}

      {/* ---- Dissemination (and the silence after it) */}
      {bIn > 0.01 && bOut > 0.01 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: bOut }}>
          <div style={{ position: 'absolute', left: 0, top: TOP, opacity: 1 - bDim }}>
            <PanelTitle kind="tray" show={bIn}>
              {S04_TITLES.board}
            </PanelTitle>
          </div>
          <div style={{ position: 'absolute', left: 1100, top: 300, opacity: bIn * (1 - bDim * 0.5) }}>
            <BoardTable label={S04_BOARD.board} />
          </div>
          {/* The report and its tray */}
          {frame >= reportAt - 4 ? (
            <div style={{ position: 'absolute', left: mix(60, 1255, ride), top: 442 - 170, opacity: Math.min(1, p(reportAt, 14) * 1.2) * (1 - bDim * 0.5), transform: `translateY(${(1 - p(reportAt, 16)) * 16}px)` }}>
              <Report width={360} height={170} label={S04_BOARD.report} />
              <div style={{ marginTop: 0 }}>
                <Tray width={360} />
              </div>
            </div>
          ) : null}
          {/* The wrong table, then the silence */}
          <div style={{ position: 'absolute', left: 1180, top: TAG_Y, width: W - 1180, display: 'flex', justifyContent: 'flex-end', opacity: wrongIn * (1 - tagSwap), transform: `translateY(${(1 - wrongIn) * 10}px)` }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 12, padding: '6px 24px 8px 16px', borderRadius: RADIUS.pill, border: `2px solid ${alpha(C.amber, 0.8)}`, background: alpha(C.amberDeep, 0.7), fontFamily: FONT.sans, fontSize: 36, fontWeight: 800, color: '#fde68a', whiteSpace: 'nowrap' }}>
              <Icon name="alert" size={34} color={C.amber} strokeWidth={2.2} />
              {S04_BOARD.wrong}
            </span>
          </div>
          <div style={{ position: 'absolute', left: 900, top: TAG_Y, width: W - 900, display: 'flex', justifyContent: 'flex-end', opacity: silence * tagSwap, transform: `translateY(${(1 - silence) * 10}px)` }}>
            <span style={{ fontFamily: FONT.sans, fontSize: 40, fontWeight: 850, color: C.amber, whiteSpace: 'nowrap' }}>{S04_BOARD.silence}</span>
          </div>
        </div>
      ) : null}

      {/* ---- Feedback: the question that defines it, then the empty book */}
      {defAt - 6 < frame && defOut > 0.01 ? (
        <div style={{ position: 'absolute', left: 380, top: TOP + 64, opacity: defIn.opacity * defOut, transform: defIn.transform }}>
          <div style={{ padding: '18px 36px 22px', borderRadius: RADIUS.lg, border: `2px solid ${alpha(C.cyan, 0.7)}`, background: `linear-gradient(180deg, ${alpha(C.cyan, 0.1)} 0%, ${alpha(C.ink900, 0.96)} 70%)`, fontFamily: FONT.sans, fontSize: 46, fontWeight: 850, lineHeight: 1.2, color: C.textStrong, whiteSpace: 'nowrap' }}>
            <div>{S04_FEEDBACK.question[0]}</div>
            <div style={{ color: C.cyanSoft }}>{S04_FEEDBACK.question[1]}</div>
          </div>
        </div>
      ) : null}
      {dIn > 0.01 && dOut > 0.01 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: dOut }}>
          <div style={{ position: 'absolute', left: 0, top: TOP }}>
            <PanelTitle kind="notebook" show={p(fbWord, 14)}>
              {S04_TITLES.feedback}
            </PanelTitle>
          </div>
          <div style={{ position: 'absolute', left: 60, top: TOP + 64, opacity: dIn, transform: `translateY(${(1 - dIn) * 16}px)` }}>
            <GuestBook />
          </div>
          <div style={{ position: 'absolute', left: 380, top: TOP + 64 + 196, ...enter(frame, feedbackAt + 2, { distance: 14, duration: 16 }), fontFamily: FONT.sans, fontSize: 46, fontWeight: 850, color: C.amber, whiteSpace: 'nowrap' }}>
            {S04_FEEDBACK.never}
          </div>
        </div>
      ) : null}

      {/* ---- The line, small and then whole */}
      <StationLine width={W} tile={tile} labelSize={label} states={states} style={{ position: 'absolute', left: 0, top: lineY }} />
      {big > 0.01 && spark > 0 && spark < 1 ? (
        <div style={{ position: 'absolute', left: mix(c0, c5, spark) - 14, top: lineY + tile / 2 - 14, width: 28, height: 28, borderRadius: 14, background: C.amber, boxShadow: `0 0 24px ${alpha(C.amber, 0.8)}`, opacity: Math.sin(Math.PI * spark) * 1.4 }} />
      ) : null}
      {big > 0.01 ? (
        <>
          <div style={{ position: 'absolute', left: 0, top: lineY + 232, fontFamily: FONT.sans, fontSize: 44, fontWeight: 850, color: C.amber, whiteSpace: 'nowrap', ...enter(frame, wrapAt + 4, { distance: 14, duration: 16 }) }}>{S04_WRAP.first}</div>
          <div style={{ position: 'absolute', right: 0, top: lineY + 232, fontFamily: FONT.sans, fontSize: 44, fontWeight: 850, color: C.amber, whiteSpace: 'nowrap', ...enter(frame, at('s04-06', 'feedback') - 6, { distance: 14, duration: 16 }) }}>{S04_WRAP.last}</div>
        </>
      ) : null}
    </Stage>
  );
}

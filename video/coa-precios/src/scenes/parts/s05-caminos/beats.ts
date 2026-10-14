import type { SceneProps } from '../../../../../engine/src/timeline/types';
import { EASE, progress } from '../../../../../engine/src/theme/motion';
import { windowWeight } from '../../../../../engine/src/ui';
import type { MatrixProps } from '../Matrix';
import { wordFrame } from '../../kit';

const S = 's05-caminos';

/** The moments of s05 that more than one piece needs, as local frames (cues and words only). */
export function s05Marks(props: SceneProps) {
  const at = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);
  const c = props.cue;
  return {
    at,
    reply: c('reply-move'),
    rowC2: c('row-c2'),
    visible: c('visible'),
    sink: c('sinkhole-deny'),
    walkie: c('walkie'),
    supose: c('supose'),
    answer: c('answer'),
    watch: c('watch'),
    flip: c('flip'),
    business: c('business'),
    wrap: c('wrap-ii'),
    /** «¿Cortas?»: the question; «Cortas ya»: the cut of `flip`. */
    ask: at('s05-05', 'Cortas') - 4,
    cut: at('s05-07', 'Cortas') - 4,
    taken: at('s05-07', 'llevan') - 2,
  };
}

/** Every 0–1 weight of the matrix and of the labels around it at `frame`. */
export function s05Beats(props: SceneProps, frame: number, fps: number) {
  const m = s05Marks(props);
  const { at } = m;
  const p = (start: number, dur = 14) => progress(frame, start, dur);
  const io = (start: number, dur = 20) => progress(frame, start, dur, EASE.inOut);
  const win = (from: number, to?: number, ramp = 12) => windowWeight(frame, from, to, { ramp });

  // ---- places: small under the intercepted message, back to full on `row-c2`, top masked from `supose`
  const small = io(Math.max(0, props.enterFrames - 6), 24) * (1 - io(m.rowC2 - 4, 22));
  const enlarge = progress(frame, m.rowC2 + 2, 20, EASE.inOut);
  const mask = io(m.supose - 8, 20);
  // What s04 left lit on the matrix (its counts, its five column headers) goes out as it steps down.
  const left = 1 - io(Math.max(0, props.enterFrames - 6), 18);

  // ---- the reply to the message: the C2 row, its cut, what the cut costs
  const replyRow = win(m.reply - 2, m.rowC2 - 4);
  const cutNow = win(m.reply, at('s05-01', 'Pero') - 4);
  const blind = win(at('s05-01', 'dejas') - 4, m.rowC2 - 4);
  const asks = win(at('s05-01', 'Por') - 4, m.rowC2 - 4);

  // ---- the row, its marked cell, the sinkhole
  const bridge = p(m.rowC2 + 10, 14) * (1 - io(m.supose - 12, 12));
  const flash = windowWeight(frame, m.visible, m.visible + 22, { ramp: 8, lead: 2 });
  const legend = p(m.visible - 2, 14);
  const markGloss = win(at('s05-02', 'acción') - 4, m.sink - 6);
  const sink = win(m.sink - 2, m.walkie - 6);
  const gloss = p(at('s05-03', 'corta') - 10, 12) * (1 - io(m.walkie - 12, 12));
  const glossLines: [number, number] = [p(at('s05-03', 'corta') - 8, 12), p(at('s05-03', 'pero') - 4, 12)];
  const denyTag = p(at('s05-03', 'Deny.') - 4, 12);

  // ---- the walkie: nobody answers / a noisy channel and somebody listening
  const nobody = win(at('s05-04', 'nadie') - 4, at('s05-04', 'o', 1) - 2);
  const noisy = win(at('s05-04', 'ruido,') - 6, m.supose - 8);
  const listen = win(at('s05-04', 'escuchas.') - 4, m.supose - 8);

  // ---- the question: both options marked, one after the other, no cost on either
  const options = win(m.ask, m.answer - 2);
  const turn = 0.5 + 0.5 * Math.cos((2 * Math.PI * 0.42 * Math.max(0, frame - m.ask - 20)) / fps);
  const chips: [number, number] = [p(m.supose - 2, 12), p(at('s05-05', 'importante') - 8, 12)];
  const chipsOut = io(m.answer - 4, 10);

  // ---- the answer, its other branch, the name
  const keep = win(m.answer - 2, m.cut);
  const onDetect = win(at('s05-06', 'Detect,') - 4, at('s05-06', 'frenas') - 4);
  const onDegrade = win(at('s05-06', 'Degrade.') - 4, at('s05-06', 'Para') + 10);
  const watch = p(m.watch - 2, 14) * (1 - io(m.flip - 10, 10));
  const watchSub = p(at('s05-06', 'Para') - 6, 14);
  const flipLabel = p(m.flip - 2, 14) * (1 - io(m.business - 10, 10));
  const alarm = p(m.taken, 14) * (1 - io(m.business - 10, 12));
  const cut = win(m.cut, m.business - 4);
  const gain = p(at('s05-08', 'ganas') - 4, 12);
  const loss = p(at('s05-08', 'pierdes') - 4, 12);
  const name = p(at('s05-08', 'intelligence') - 6, 14);
  const decision = p(at('s05-08', 'decide') - 8, 14);
  const prices = p(at('s05-08', 'SOC.') + 10, 14);
  const priced = win(at('s05-09', 'acción') - 4);

  const pair = Math.max(options * (0.55 + 0.45 * (1 - turn)), 0.8 * keep, 0.8 * gain);
  const cells: MatrixProps['cells'] = {
    'c2-detect': { tone: 'cyan', lit: Math.max(0.9 * listen, pair, onDetect), dim: Math.max(0.6 * blind, 0.45 * sink, 0.5 * nobody, 0.6 * cut) },
    'c2-degrade': { tone: 'cyan', lit: Math.max(0.9 * noisy, pair, onDegrade), dim: Math.max(0.45 * sink, 0.5 * nobody, 0.6 * cut) },
    'c2-deny': {
      tone: 'emerald',
      lit: Math.max(0.9 * cutNow, 0.9 * sink, 0.9 * nobody, options * (0.55 + 0.45 * turn), cut, 0.8 * loss),
      mark: Math.max(asks, p(m.visible - 2, 10)),
      dim: Math.max(0.5 * Math.max(noisy, listen) * (1 - options), 0.55 * keep),
    },
  };
  const rows: MatrixProps['rows'] = { c2: { lit: 0.9 * replyRow }, aoo: { alert: alarm } };
  const denyLit = Math.max(sink, nobody, options * turn, cut, loss);
  return { small, enlarge, mask, left, cells, rows, flash, legend, bridge, markGloss, gloss, glossLines, denyTag, denyLit, denyDim: 0.9 * keep, chips, chipsOut, watch, watchSub, flipLabel, flipAct: p(m.cut, 12), alarm, name, decision, prices, priced, tagPair: gain, tagDeny: loss };
}

import type { SceneProps } from '../../../../../engine/src/timeline/types';
import { EASE, progress, springIn } from '../../../../../engine/src/theme/motion';
import { windowWeight } from '../../../../../engine/src/ui';
import { S03 } from '../../../data/s03-apreton';
import { segment, wordFrame } from '../../kit';

const S = 's03-apreton';
const TRAVEL = 26;

/**
 * Every beat of s03-apreton as a 0–1 number at `frame`, from the cues and the words of the frozen
 * narration only (no absolute frames, no assumption about how long a segment lasts).
 */
export function beats(props: SceneProps, frame: number, fps: number) {
  const at = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);
  const p = (start: number, dur = 12) => progress(frame, start, dur);
  const io = (start: number, dur = 16) => progress(frame, start, dur, EASE.inOut);

  const hsAt = props.cue('handshake');
  const capAt = props.cue('captured');
  const offAt = props.cue('offline');
  const padAt = props.cue('padlock');
  const sealAt = props.cue('sealed');
  const oneAt = props.cue('one-by-one');
  const tapeAt = props.cue('tape');
  const sharedAt = props.cue('still-shared');
  const s3 = segment(props, 's03-03');
  const s5 = segment(props, 's03-05');
  const s6 = segment(props, 's03-06');
  const s7 = segment(props, 's03-07');

  // ---- the label, read aloud and then a strip ----
  const stripBig = 1 - io(hsAt - 16, 22);
  const stripLit = [p(at('s03-01', 'permiso') - 6), p(at('s03-01', 'punto') - 4), p(at('s03-01', 'acceso') + 8), p(at('s03-01', 'clave') - 4)];
  const wpa3 = io(at('s03-05', 'WPA3') - 6, 14);
  const saeName = p(at('s03-05', 'SAE') - 4, 10);
  const protoLit = Math.max(windowWeight(frame, hsAt, at('s03-02', 'tableta')), windowWeight(frame, at('s03-05', 'WPA3'), at('s03-05', 'apretón')), windowWeight(frame, at('s03-05', 'SAE'), oneAt));

  // ---- WPA2: four messages, each recorded as it passes ----
  const first = at('s03-02', 'comprueban') - 4;
  const step = Math.max(6, (capAt - 12 - TRAVEL - first) / 3);
  const starts = [0, 1, 2, 3].map((i) => first + step * i);
  const msgs = starts.map((t) => progress(frame, t, TRAVEL, EASE.linear));
  const drops = starts.map((t) => progress(frame, t + TRAVEL * 0.5, 20, EASE.linear));
  const slots = starts.map((t) => p(t + TRAVEL * 0.5 + 18, 8));
  const morph = io(at('s03-05', 'apretón') - 6, 14);
  const pass = [progress(frame, at('s03-05', 'apretón'), TRAVEL, EASE.linear), progress(frame, at('s03-05', 'cambia') - 4, TRAVEL, EASE.linear)];
  const grab = at('s03-05', 'grabarlo') - 2;
  const dropsSae = [progress(frame, grab, 20, EASE.linear), progress(frame, grab + 8, 20, EASE.linear)];

  // ---- the laptop goes «a casa» and comes back for the second half ----
  const away = io(offAt - 2, 34) * (1 - io(s5.from - 4, 34));
  const fileShow = frame < capAt - 4 ? 0 : springIn(frame, fps, capAt - 3, { damping: 15 });
  const fileGlow = windowWeight(frame, capAt, offAt);
  const home = io(offAt + 4, 16);
  const tape = io(s7.from - 6, 16);
  const padIn = frame < padAt - 4 ? 0 : springIn(frame, fps, padAt - 3, { damping: 15 });
  const fileTag = io(padAt - 6, 16);

  // ---- the counter: three uneven jumps on arbitrary words, then still ----
  const jumps = [at('s03-03', 'prueba'), at('s03-03', 'claves') + 2, at('s03-03', 'offline')];
  const jump = jumps.filter((t) => frame >= t).length;
  const tried = { show: p(jumps[0] - 3, 6) * (1 - io(sealAt - 30, 12)), value: S03.triedSteps[Math.max(0, jump - 1)], bump: jump ? 1 - progress(frame, jumps[jump - 1], 12, EASE.linear) : 0 };
  const trying = frame >= jumps[0] && frame < sealAt - 30 ? Math.floor((Math.min(frame, s3.to) - jumps[0]) / 7) : -1;
  const offlineTag = p(at('s03-03', 'offline') - 4, 10);
  const offlineLit = windowWeight(frame, at('s03-03', 'offline'), s3.to);
  const netBlind = at('s03-03', 'red') - 6;

  // ---- SAE: the padlock goes to the locker and is bolted there ----
  const travel = io(sealAt - 30, 26);
  const bolted = p(sealAt - 4, 8);
  const sealGlow = windowWeight(frame, sealAt, oneAt);
  const tries = [0.03, 0.36, 0.62].map((k) => oneAt + Math.round((s6.to - oneAt) * k));
  const attempts = tries.map((t) => progress(frame, t, 24, EASE.inOut));
  const received = attempts.filter((a) => a >= 1).length;
  const lastHit = tries.filter((t) => frame >= t + 24).pop();
  const hit = lastHit === undefined ? 0 : 1 - progress(frame, lastHit + 24, 16, EASE.linear);

  return {
    stripBig,
    stripLit,
    wpa3,
    saeName,
    protoLit,
    msgs,
    drops,
    slots,
    morph,
    pass,
    dropsSae,
    away,
    fileShow,
    fileGlow,
    home,
    tape,
    padIn,
    fileTag,
    tried,
    trying,
    offlineTag,
    offlineLit,
    travel,
    bolted,
    sealGlow,
    attempts,
    received,
    hit,
    tablet: p(at('s03-02', 'tableta') - 6),
    ap: p(at('s03-01', 'punto') - 4),
    ear: p(first - 8),
    title: p(at('s03-02', 'apretón') - 6) * (1 - morph),
    exam: p(at('s03-02', 'four-way') - 4),
    examLit: windowWeight(frame, at('s03-02', 'four-way'), capAt),
    recv: p(netBlind, 10),
    recvLit: Math.max(windowWeight(frame, netBlind, s3.to), hit),
    ghost: io(sealAt - 22, 14) * (1 - tape),
    attemptPath: p(oneAt - 2, 10) * (1 - 0.6 * tape),
    one: p(oneAt - 2),
    oneLit: p(at('s03-06', 'uno') - 4),
    tapeWpa2: p(at('s03-07', 'aunque') - 4, 14),
    tapeSae: p(at('s03-07', 'no') - 6, 14),
    forward: p(tapeAt - 2, 10),
    forwardLit: windowWeight(frame, tapeAt, sharedAt),
    shared: io(sharedAt - 8, 24),
    more: progress(frame, at('s03-08', 'para') - 6, 20),
  };
}

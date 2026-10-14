import type { SceneProps } from '../../../../../engine/src/timeline/types';
import { EASE, progress, springIn } from '../../../../../engine/src/theme/motion';
import { mix, windowWeight } from '../../../../../engine/src/ui';
import { segment, wordFrame } from '../../kit';
import { ANTENNAS, INNER, examFrame, walkNearest } from './geometry';
import type { LobeState } from './Heat';

const S = 's02-foco';

/** One short swell (a halo), starting at `at`. */
function swell(frame: number, at: number): number {
  return progress(frame, at, 10) * (1 - progress(frame, at + 18, 28, EASE.inOut));
}

/**
 * Every beat of s02 as 0–1 numbers at `frame`, derived from cues and spoken words only (the real
 * voice moves all of them). Kept apart from the drawing so the scene file stays readable.
 */
export function focoBeats(frame: number, fps: number, props: SceneProps) {
  const surveyAt = props.cue('survey');
  const spillAt = props.cue('spill');
  const lampAt = props.cue('floodlight');
  const scanAt = props.cue('scan');
  const hideAt = props.cue('hide');
  const fixAt = props.cue('fix');
  const remeasureAt = props.cue('remeasure');
  const stillAt = props.cue('still');
  const w = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);

  // ---- s02-01: the survey walk; each access point's coverage blooms as the walk passes it.
  const walkDur = Math.max(60, spillAt - 24 - surveyAt);
  const walk = progress(frame, surveyAt, walkDur, EASE.inOut);
  const bloom = (x: number, y: number) => progress(frame, surveyAt + walkNearest(x, y) * walkDur * 0.9 - 4, 30);
  const inner = INNER.map((ap) => bloom(ap.x, ap.y));
  const marker = 1 - progress(frame, spillAt - 20, 14, EASE.inOut);
  const trail = mix(1, 0.35, progress(frame, spillAt - 20, 14)) * (1 - progress(frame, hideAt - 20, 16));
  const names = [progress(frame, w('s02-01', 'site') - 4, 12), progress(frame, w('s02-01', 'heat') - 4, 12)];
  const toCorner = progress(frame, spillAt - 18, 22, EASE.inOut);

  // ---- s02-02: the spill, the floodlight, the laptop in the car park.
  const grow = [progress(frame, spillAt - 2, 26), progress(frame, spillAt + 8, 26)];
  const spillMark = progress(frame, spillAt + 12, 14);
  const parkLit = progress(frame, w('s02-02', 'aparcamiento') - 4, 12);
  const lampIn = springIn(frame, fps, lampAt - 2, { damping: 15 });
  const beamIn = progress(frame, lampAt + 2, 18);
  const slide = progress(frame, scanAt - 30, 30, EASE.inOut);
  const laptopIn = springIn(frame, fps, scanAt - 2, { damping: 15 });
  const panelAt = scanAt + 4;
  const row = progress(frame, w('s02-02', 'oye') - 4, 12);
  const value = progress(frame, w('s02-02', '55') - 4, 12);

  // ---- s02-03: hiding the name does not switch the lamp off.
  const strikeHide = progress(frame, w('s02-03', 'no') - 2, 14, EASE.inOut);
  const hidden = windowWeight(frame, hideAt + 6, w('s02-03', 'conecta') - 2, { ramp: 10 });
  const lampGlow = swell(frame, w('s02-03', 'foco') - 4);
  const whyHideAt = w('s02-03', 've') - 8;
  const tabletAt = w('s02-03', 'tableta') - 4;
  const tablet = springIn(frame, fps, tabletAt, { damping: 15 }) * (1 - progress(frame, fixAt - 12, 12, EASE.inOut));
  const seen = swell(frame, w('s02-03', 'conecta') - 2);

  // ---- s02-04: a longer key does not either; the lamp is lowered and turned inwards.
  const whyHideOut = progress(frame, fixAt - 12, 10, EASE.inOut);
  const strikeLonger = progress(frame, w('s02-04', 'larga') + 6, 14, EASE.inOut);
  const whyLongerAt = w('s02-04', 'baja') - 4;
  const low = [progress(frame, w('s02-04', 'baja', 1) - 2, 22, EASE.inOut), 0];
  const turn = [progress(frame, w('s02-04', 'gira') - 2, 36, EASE.inOut), 0];
  const worksAt = w('s02-04', 'potencia') - 6;

  // ---- s02-05: Tuesday (the second antenna follows), Wednesday (the second measurement).
  const tuesdayAt = w('s02-05', 'martes') - 6;
  const adjust = progress(frame, w('s02-05', 'ajustas') - 2, 36, EASE.inOut);
  low[1] = adjust;
  turn[1] = adjust;
  const ringAt = w('s02-05', 'dos') - 2;
  const rings = [progress(frame, ringAt, 30), progress(frame, ringAt + 8, 30)];
  const fixesOut = progress(frame, tuesdayAt - 6, 14, EASE.inOut);
  const swap = progress(frame, tuesdayAt, 16, EASE.inOut);
  const worksUp = progress(frame, tuesdayAt, 22, EASE.inOut);
  const worksLit = windowWeight(frame, worksAt, tuesdayAt, { ramp: 12 });
  // «−78 dBm» is on screen and still before the exam card, whatever the voice does.
  const examAt = examFrame(S) ?? Number.POSITIVE_INFINITY;
  const saidAt = w('s02-05', '78') - 4;
  const valueAt = Math.max(remeasureAt + 8, Math.min(saidAt, examAt - 14));
  const second = progress(frame, remeasureAt - 2, 10);
  const secondValue = progress(frame, valueAt, 10);
  const secondGlow = swell(frame, Math.max(valueAt, saidAt));
  // Less power: an adjusted antenna's round coverage shrinks with its lobe.
  const edge = ANTENNAS.map((ap, i) => bloom(ap.x, ap.y) * (1 - 0.32 * low[i]));
  const pings = [progress(frame, w('s02-02', 'oye') - 2, 32), progress(frame, remeasureAt + 2, 32)];
  const still: [number, number] = [progress(frame, stillAt - 4, 12), progress(frame, w('s02-05', 'pero') - 4, 12)];

  // ---- The two lobes: one geometry for the heat map and for the floodlight's cone.
  const lobes: LobeState[] = ANTENNAS.map((a, i) => ({
    x: a.x,
    y: a.y,
    spread: a.spread,
    angle: mix(a.out.angle, a.inward.angle, turn[i]),
    reach: grow[i] * mix(a.out.reach, a.inward.reach, low[i]),
  }));
  const residual = Math.max(0.55 * turn[0], turn[1]);
  const band = { from: segment(props, 's02-02').to, to: segment(props, 's02-03').to };

  return {
    at: { hideAt, fixAt, remeasureAt, tuesdayAt, panelAt, whyHideAt, whyLongerAt, worksAt, tabletAt },
    walk, inner, edge, marker, trail, names, toCorner,
    spillMark: spillMark * (1 - turn[1]), parkLit, lampIn, beamIn, slide, laptopIn, row, value,
    strikeHide, hidden, lampGlow, tablet, seen, whyHideOut, strikeLonger, low, turn,
    rings, fixesOut, swap, worksUp, worksLit, second, secondValue, secondGlow, pings, still,
    lobes, residual, band,
  };
}

export type FocoBeats = ReturnType<typeof focoBeats>;

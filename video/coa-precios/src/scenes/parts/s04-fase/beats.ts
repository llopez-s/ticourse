import type { SceneProps } from '../../../../../engine/src/timeline/types';
import { EASE, progress } from '../../../../../engine/src/theme/motion';
import { windowWeight } from '../../../../../engine/src/ui';
import { PHASE_IDS } from '../../../data/matrix';
import type { MatrixProps } from '../Matrix';
import { wordFrame } from '../../kit';

const S = 's04-fase';

/**
 * Every 0–1 weight of s04 at `frame`, from the cues and the words of the narration (never from
 * absolute frames). The scene only places things.
 */
export function s04Beats(props: SceneProps, frame: number) {
  const p = (start: number, dur = 14) => progress(frame, start, dur);
  const io = (start: number, dur = 20) => progress(frame, start, dur, EASE.inOut);
  const at = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);
  const win = (from: number, to?: number, ramp = 12) => windowWeight(frame, from, to, { ramp });
  const rowsAt = props.cue('rows');
  const countsAt = props.cue('counts');
  const singleAt = props.cue('single');
  const failsAt = props.cue('fails');
  const unopposedAt = props.cue('unopposed');
  const backAt = props.cue('back');
  const manyAt = props.cue('many');

  // ---- 1: the whole matrix, row by row, and how many cells each row has
  const note = p(Math.max(2, rowsAt - 8), 16) * (1 - io(failsAt - 16, 12));
  const sweepAt = at('s04-01', 'filas,') - 4;
  const counts = Math.max(p(countsAt - 2, 14) * (1 - io(singleAt - 12, 12)), p(at('s04-04', 'varias') - 4, 14));

  // ---- 2: Delivery left with one cell
  const alone = io(at('s04-02', 'solo') - 6, 16);
  const restore = io(backAt - 6, 18);
  const single = alone * (1 - restore);
  const lift = win(at('s04-02', 'bloquear') - 6, failsAt - 6);

  // ---- 3: an e-mail from a domain that is not on the list
  const mailIn = p(failsAt - 2, 12);
  const flyAt = at('s04-03', 'correo') + 6;
  const fly = progress(frame, flyAt, Math.max(30, unopposedAt - 4 - flyAt), EASE.inOut);
  const got = p(unopposedAt - 4, 12);
  const tag = p(unopposedAt + 2, 14) * (1 - io(backAt - 10, 10));
  const tiendaAt = at('s04-03', 'tienda') - 4;
  const lockFailA = p(tiendaAt + 6, 10);
  const doorA = io(at('s04-03', 'sola') - 6, 22);

  // ---- 4: lock, alarm and guard
  const alarmOn = p(at('s04-04', 'alarma') - 4, 12);
  const guard = p(at('s04-04', 'vigilante,') - 4, 12);
  const fails = p(at('s04-04', 'falla,') - 4, 10);
  const warns = p(at('s04-04', 'avisa') - 4, 10);
  const catches = p(at('s04-04', 'atrapa.') - 4, 10);
  const line = p(at('s04-04', 'si') - 6, 14);
  const many = p(manyAt - 2, 14);
  const passive = p(at('s04-04', 'miran') - 4, 10);
  const active = p(at('s04-04', 'actúan.') - 4, 10);

  const rows: MatrixProps['rows'] = {};
  PHASE_IDS.forEach((id, i) => {
    const sweep = 0.9 * windowWeight(frame, sweepAt + i * 8, sweepAt + i * 8 + 16, { ramp: 7, lead: 0 });
    rows[id] = id === 'delivery' ? { lit: Math.max(sweep, 0.8 * win(backAt - 2, manyAt - 4), 0.8 * win(singleAt - 2, at('s04-02', 'solo'))), warn: single * (0.7 + 0.3 * got) } : { lit: sweep, dim: 0.62 * single };
  });
  const cells: MatrixProps['cells'] = {
    'delivery-detect': { show: 1 - single, lit: 0.9 * Math.max(win(at('s04-04', 'avisa') - 4, manyAt - 4), passive), tone: 'cyan' },
    'delivery-deceive': { show: 1 - single },
    // The one control left: it never sees this e-mail (it is not removed, it just does not match).
    'delivery-deny': { lift, lit: 0.8 * single * (1 - got), tone: 'emerald', dim: Math.max(0.7 * got * (1 - restore), 0.5 * fails * (1 - passive)) },
  };
  const cols: MatrixProps['cols'] = { detect: passive, deny: active, disrupt: active, degrade: active, deceive: active };

  const shop = {
    dim: 0.5 * (1 - p(tiendaAt, 14)),
    devices: Math.max(1 - alone, alarmOn),
    alarm: alarmOn,
    ring: win(at('s04-04', 'avisa') - 2, manyAt + 6, 10),
    lock: alone,
    lockFail: Math.max(lockFailA * (1 - restore), fails),
    door: Math.max(doorA * (1 - restore), 0.3 * fails),
    doorWarn: p(at('s04-03', 'cerradura.') - 6, 12) * (1 - restore),
    guard,
    guardGlow: catches,
  };
  return { note, counts, rows, cells, cols, mailIn, fly, got, restore, tag, line, said: [fails, warns, catches] as [number, number, number], many, passive, active, shop };
}

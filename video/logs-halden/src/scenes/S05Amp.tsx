import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { EASE, progress } from '../../../engine/src/theme/motion';
import { mix, windowWeight } from '../../../engine/src/ui';
import { ANSWER_W, AnswerPanel, JoinedNames, NAMES_W, NotPoison, OnCallLine } from './parts/s05-amp/Answer';
import { COUNTERS_W, Counters } from './parts/s05-amp/Counters';
import { BytesSketch, INSET_H, PhoneInset, SKETCH_W } from './parts/s05-amp/Inset';
import { NetFlowPanel } from './parts/s05-amp/NetFlow';
import { STREET_H, Street } from './parts/s05-amp/Street';
import { ExpandingRow, overlayWindows } from './parts/TrailRow';
import { Stage, segment, wordFrame } from './kit';

const S = 's05-amp';
const W = 1728;

// Phase A: NetFlow on the left, the three readings on the right (under the strip, stage y 0–90).
const FLOW_POS = { x: 0, y: 104 } as const;
const COUNTERS_POS = { x: W - COUNTERS_W, y: 150 } as const;
// Phase B: the inset (left) and the sketch (right) over the street; the names between them.
const INSET_POS = { x: 0, y: 100 } as const;
const SKETCH_POS = { x: W - SKETCH_W, y: 100 } as const;
const NAMES_POS = { x: (W - NAMES_W) / 2, y: 104 } as const;
const POISON_Y = 322;
const STREET_Y = 386;
// Phase C: the answer panel and the on-call line (left); the joined name moves to the top right.
const ANSWER_POS = { x: 0, y: 102 } as const;
const ONCALL_Y = 322;
const JOINED_RIGHT = { x: ANSWER_W + (W - ANSWER_W) / 2 - NAMES_W / 2, y: 12, s: 0.8 } as const;

/**
 * s05-amp «Pedidos que nadie hizo». The pipe row of the morning queue opens into NetFlow inbound to
 * `hpa-portal-web-01`, 05:40–06:05: four readable resolvers, all from port 53 (the column lights),
 * then «orígenes distintos: 340», the link meter «enlace de 1 Gb/s · 100 %» and «consultas DNS del
 * portal a esos servidores: 0». The image: restaurants send riders with enormous orders to your
 * portal and the street jams before its door; in an inset, someone phones the restaurants and gives
 * your address. A sketch of the mechanism, labelled as such (60 / 3.000 bytes, to scale). REFLECTED
 * and AMPLIFIED join into DNS AMPLIFICATION; «DNS poisoning» struck. The think prompt finds the top
 * clear; only after it, the answer: provider filtering (a gate on the avenue), third-party open
 * resolvers, closing them at the source, and then the on-call line at 05:44.
 */
export function S05Amp(props: SceneProps) {
  const frame = useCurrentFrame();

  const netflowAt = props.cue('netflow');
  const port53At = props.cue('port53');
  const sourcesAt = props.cue('sources');
  const fullAt = props.cue('full');
  const zeroQAt = props.cue('zero-q');
  const deliveryAt = props.cue('delivery');
  const reflectedAt = props.cue('reflected');
  const amplifiedAt = props.cue('amplified');
  const notPoisonAt = props.cue('not-poison');
  const upstreamAt = props.cue('upstream');
  const onCallAt = props.cue('on-call');
  const s7 = segment(props, 's05-07');

  // ---- Phase A: NetFlow and the readings.
  const stripAt = Math.min(props.enterFrames, netflowAt);
  const panelAt = Math.max(netflowAt + 6, stripAt + 12);
  const aOut = progress(frame, deliveryAt - 10, 14, EASE.inOut);
  const timeLit = windowWeight(frame, wordFrame(S, 's05-01', 'seis') - 4, port53At);
  const hostLit = windowWeight(frame, wordFrame(S, 's05-01', 'portal') - 6, port53At);

  // ---- Phase B: the image.
  const streetIn = progress(frame, deliveryAt + 2, 18);
  const insetAt = wordFrame(S, 's05-04', 'alguien') - 6;
  const callsAt = wordFrame(S, 's05-04', 'pidiera') - 2;
  const shopsAt = wordFrame(S, 's05-04', 'restaurantes') - 10;
  const addressAt = wordFrame(S, 's05-04', 'dirección') - 6;
  const waveAt = Math.max(addressAt, reflectedAt - 36);
  const reflectedWord = wordFrame(S, 's05-05', 'reflected') - 4;
  const amplifiedWord = wordFrame(S, 's05-05', 'amplified') - 4;
  const joinAt = Math.max(notPoisonAt, wordFrame(S, 's05-06', 'amplificación') - 6);
  const poisonAt = wordFrame(S, 's05-06', 'envenenamiento') - 8;
  const jam = Math.max(
    windowWeight(frame, wordFrame(S, 's05-06', 'atasca') - 4, s7.from),
    windowWeight(frame, wordFrame(S, 's05-08', 'calle') - 4),
  );

  // ---- The think prompt (s05-07): the top band clears; nothing of the answer yet.
  const clearTop = progress(frame, s7.from - 8, 12, EASE.inOut);

  // ---- Phase C: the answer (from `upstream`), then the on-call line.
  const toRight = progress(frame, upstreamAt - 2, 18, EASE.inOut);
  const rows = [
    progress(frame, upstreamAt + 2, 14),
    progress(frame, wordFrame(S, 's05-08', 'terceros') - 6, 14),
    progress(frame, wordFrame(S, 's05-08', 'otros') + 8, 14),
  ];
  const third = windowWeight(frame, wordFrame(S, 's05-08', 'terceros') - 6, wordFrame(S, 's05-08', 'calle') - 4);
  const gate = progress(frame, upstreamAt + 4, 18);

  const joined = {
    x: mix(NAMES_POS.x, JOINED_RIGHT.x, toRight),
    y: mix(NAMES_POS.y, JOINED_RIGHT.y, toRight),
    s: mix(1, JOINED_RIGHT.s, toRight),
  };

  return (
    <Stage>
      {/* The pipe row of the morning queue opens into the title strip; it folds aside for the think prompt. */}
      <ExpandingRow kind="pipe" frame={frame} startAt={stripAt} away={overlayWindows(S)} />

      {/* ===== Phase A ===== */}
      {aOut < 1 ? (
        <>
          <div style={{ position: 'absolute', left: FLOW_POS.x, top: FLOW_POS.y, opacity: 1 - aOut }}>
            <NetFlowPanel
              open={progress(frame, panelAt, 18)}
              rows={progress(frame, panelAt + 6, 34)}
              time={timeLit}
              host={hostLit}
              port={progress(frame, port53At, 12)}
            />
          </div>
          <div style={{ position: 'absolute', left: COUNTERS_POS.x, top: COUNTERS_POS.y, opacity: 1 - aOut }}>
            <Counters
              sources={progress(frame, sourcesAt - 4, 14)}
              count={progress(frame, sourcesAt, 40, EASE.inOut)}
              link={progress(frame, fullAt - 6, 14)}
              fill={progress(frame, fullAt, 30, EASE.inOut)}
              asked={progress(frame, zeroQAt - 2, 14)}
            />
          </div>
        </>
      ) : null}

      {/* ===== Phase B: the street (it stays to the end) ===== */}
      {streetIn > 0 ? (
        <div style={{ position: 'absolute', left: 0, top: STREET_Y, height: STREET_H }}>
          <Street
            frame={frame}
            scene={streetIn}
            shops={progress(frame, shopsAt, 20)}
            wave={waveAt}
            stopAt={s7.from}
            box={progress(frame, wordFrame(S, 's05-05', 'enorme') - 6, 18, EASE.inOut)}
            jam={jam}
            third={third}
            gate={gate}
          />
        </div>
      ) : null}

      {/* The inset and the sketch: gone before the think prompt */}
      {frame >= insetAt - 2 && clearTop < 1 ? (
        <div style={{ position: 'absolute', left: INSET_POS.x, top: INSET_POS.y, height: INSET_H, opacity: 1 - clearTop }}>
          <PhoneInset
            show={progress(frame, insetAt, 16)}
            calls={progress(frame, callsAt, 50, EASE.inOut)}
            address={progress(frame, addressAt, 14)}
            addressGlow={windowWeight(frame, reflectedAt - 4, joinAt)}
          />
        </div>
      ) : null}
      {frame >= amplifiedAt - 6 && clearTop < 1 ? (
        <div style={{ position: 'absolute', left: SKETCH_POS.x, top: SKETCH_POS.y, opacity: 1 - clearTop }}>
          <BytesSketch
            show={progress(frame, amplifiedAt - 4, 14)}
            q={progress(frame, wordFrame(S, 's05-05', 'pregunta') - 2, 10)}
            a={progress(frame, wordFrame(S, 's05-05', 'respuesta') - 2, 24, EASE.inOut)}
          />
        </div>
      ) : null}

      {/* REFLECTED + AMPLIFIED, joining into DNS AMPLIFICATION (which stays, then moves aside for the answer) */}
      {frame >= reflectedWord - 2 ? (
        <div
          style={{
            position: 'absolute',
            left: joined.x,
            top: joined.y,
            transform: `scale(${joined.s})`,
            transformOrigin: '50% 0',
          }}
        >
          <JoinedNames
            reflected={progress(frame, reflectedWord, 14)}
            amplified={progress(frame, amplifiedWord, 14)}
            join={progress(frame, joinAt, 18)}
            parents={1 - clearTop}
          />
        </div>
      ) : null}
      {frame >= poisonAt - 2 && clearTop < 1 ? (
        <div style={{ position: 'absolute', left: 0, top: POISON_Y, width: W, display: 'flex', justifyContent: 'center', opacity: 1 - clearTop }}>
          <NotPoison show={progress(frame, poisonAt, 14)} strike={progress(frame, poisonAt + 14, 14, EASE.inOut)} />
        </div>
      ) : null}

      {/* ===== Phase C: the answer, then what the night shift did ===== */}
      {rows[0] > 0 ? (
        <div style={{ position: 'absolute', left: ANSWER_POS.x, top: ANSWER_POS.y }}>
          <AnswerPanel rows={rows} />
        </div>
      ) : null}
      {frame >= onCallAt - 4 ? (
        <div style={{ position: 'absolute', left: 0, top: ONCALL_Y }}>
          <OnCallLine show={progress(frame, onCallAt - 2, 14)} time={progress(frame, wordFrame(S, 's05-09', 'cuatro') - 6, 12)} />
        </div>
      ) : null}
    </Stage>
  );
}

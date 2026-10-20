import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, STAGE } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { DEFINITION, LADDER, LADDER_HEAD, PORT } from '../data/s04-funcion';
import { FunctionBlock } from './parts/FunctionBlock';
import { CaseStamp, Pill } from './parts/Labels';
import { BikeBeat } from './parts/s04-funcion/BikeBeat';
import { FunctionBeat } from './parts/s04-funcion/FunctionBeat';
import { Strips } from './parts/s04-funcion/Strips';
import { Stage, wordFrame } from './kit';

const S = 's04-funcion';
const W = STAGE.width;
const DEF_BLOCK = 220;
const LADDER_X = 330;
const LADDER_Y = [150, 270, 390];

/**
 * s04-funcion «Sin máquina». First a plain sentence with the function block: «función: código que corre sin que
 * gestiones servidores» (on «código»). On `bike` the image («imagen · no es del puerto»): the public bike in its dock,
 * the tracker struck, the route on the service's screen, the pass. On `ladder`, with no question, who patches the
 * system in each model, one chip per model on its word. On `port` the proposal: the night task becomes a serverless
 * function in the provider's frame; «tuyo…» half-lit; «sin agente · sin captura de tráfico»; the provider's logs on
 * `logs`, sent to Seguridad's console on `decision`; and, half-lit at the end, the pass and «vendor lock-in».
 */
export function S04Funcion(props: SceneProps) {
  const frame = useCurrentFrame();
  const w = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);
  const bikeAt = props.cue('bike');
  const ladderAt = props.cue('ladder');
  const portAt = props.cue('port');
  const defAt = w('s04-01', 'código') - 6;

  const introOut = progress(frame, bikeAt - 14, 14, EASE.inOut);
  const bikeOut = progress(frame, ladderAt - 14, 14, EASE.inOut);
  const ladderOut = progress(frame, portAt - 14, 14, EASE.inOut);
  const chipAt = LADDER.map((l) => w('s04-03', l.word) - 6);

  return (
    <Stage>
      {/* The plain sentence, with the function block: faint from the first frame */}
      {introOut < 1 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: 1 - introOut }}>
          <div style={{ position: 'absolute', left: (W - DEF_BLOCK) / 2, top: 90, opacity: 0.35 + 0.65 * progress(frame, 0, 18) }}>
            <FunctionBlock size={DEF_BLOCK} glow={0.5 * progress(frame, defAt, 12)} />
          </div>
          {frame >= defAt - 4 ? (
            <div style={{ position: 'absolute', left: 0, width: W, top: 370, display: 'flex', justifyContent: 'center', ...enter(frame, defAt, { distance: 16 }) }}>
              <Pill text={DEFINITION} tone={C.cyan} icon="bolt" size={40} height={72} on={progress(frame, defAt, 12)} />
            </div>
          ) : null}
        </div>
      ) : null}

      {frame >= bikeAt - 8 && bikeOut < 1 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: 1 - bikeOut }}>
          <BikeBeat
            frame={frame}
            t={{
              bike: bikeAt,
              fixed: w('s04-01', 'arregla') - 6,
              route: props.cue('route'),
              tracker: w('s04-02', 'localizador.') - 4,
              trip: w('s04-02', 'recorrido') - 4,
              pass: props.cue('pass'),
            }}
          />
        </div>
      ) : null}

      {/* Who patches the system, model by model (no name for the series) */}
      {frame >= ladderAt - 8 && ladderOut < 1 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: 1 - ladderOut }}>
          <div style={{ position: 'absolute', left: LADDER_X, top: 40, fontFamily: FONT.sans, fontSize: 44, fontWeight: 850, color: C.text, whiteSpace: 'nowrap', ...enter(frame, ladderAt, { distance: 14 }) }}>{LADDER_HEAD}</div>
          {LADDER.map((l, i) => {
            if (frame < chipAt[i] - 4) return null;
            const on = progress(frame, chipAt[i], 10) * (i < LADDER.length - 1 ? 1 - 0.45 * progress(frame, chipAt[i + 1], 10) : 1);
            return (
              <div key={l.word} style={{ position: 'absolute', left: LADDER_X + i * 60, top: LADDER_Y[i], ...enter(frame, chipAt[i], { distance: 16 }) }}>
                <Pill text={l.text} tone={l.mine ? C.cyan : C.sky} icon={l.mine ? 'user' : 'cloud'} size={44} height={78} on={on} />
              </div>
            );
          })}
        </div>
      ) : null}

      {frame >= portAt - 6 ? (
        <>
          <div style={{ position: 'absolute', left: 0, top: 0, ...enter(frame, portAt - 4, { distance: 14 }) }}>
            <CaseStamp what={PORT.what} kind={PORT.kind} />
          </div>
          <FunctionBeat
            frame={frame}
            t={{ port: portAt, fn: w('s04-04', 'función') - 4, scale: w('s04-04', 'escala.') - 4, logs: props.cue('logs'), lockin: props.cue('lockin') }}
          />
          <Strips
            frame={frame}
            t={{ yours: props.cue('yours'), blind: w('s04-05', 'Pero') - 2, logs: props.cue('logs'), decision: props.cue('decision'), lockin: props.cue('lockin') }}
          />
        </>
      ) : null}
    </Stage>
  );
}

import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, STAGE } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { ACTORS, CASE, SAME } from '../data/s02-pantallas';
import { Bars, WantsRow } from './parts/Bars';
import { GRAFFITI, Graffiti } from './parts/Graffiti';
import { CaseTag, Pill, TermPill } from './parts/Labels';
import { ImageTag } from './parts/Tags';
import { DepartureScreen } from './parts/s02-pantallas/DepartureScreen';
import { CauseMessage, NickMessage } from './parts/s02-pantallas/Messages';
import { Stage, wordFrame } from './kit';

const S = 's02-pantallas';
const W = STAGE.width;
const COL_W = 840;
const COL_X = [0, W - COL_W] as const;
// The big, empty template of the first beat.
const TPL = { w: 1240, labelW: 470, rowH: 112, top: 150 } as const;
// The two case columns: screen, then ficha.
const SCREEN = { y: 70, w: COL_W - 20, h: 246 } as const;
const FICHA = { y: 356, labelW: 240, rowH: 52 } as const;
const WANTS_Y = 548;
const WALL_W = 1500;
const WALL = { x: (W - WALL_W) / 2, y: 62, h: (WALL_W * GRAFFITI.h) / GRAFFITI.w } as const;

/**
 * s02-pantallas «Dos pantallas, el mismo hueco». On `bars` an empty three-bar ficha takes the stage; each row lights
 * as the voice names it («fuera», «dinero», «sabe») and on `attributes`' English sentence the exam names come in under
 * the plain ones. On `screens` the template splits into two empty fichas under two departure screens of the passenger
 * terminal («Imagina dos mañanas · caso de ejemplo · sin fecha»). On `swap` both screens glitch once (the sfx) and go
 * dark, «mismo hueco · misma herramienta descargada» top right; `cause` brings the slogan and its link, `nick` the tag
 * and the greetings. On «barras» the fichas fill almost alike (the hacktivist's money «bajo o medio»); on `wants` the
 * fourth row lights with each motive. On `spray` the screens give way to the wall with the same can: the slogan paints
 * on «lema», the tag on «mote» («imagen · no es del puerto»). On `names` each column gets its exam name.
 */
export function S02Pantallas(props: SceneProps) {
  const frame = useCurrentFrame();
  const barsAt = props.cue('bars');
  const rowAt = [wordFrame(S, 's02-01', 'fuera'), wordFrame(S, 's02-01', 'dinero'), wordFrame(S, 's02-01', 'sabe')];
  const enAt = wordFrame(S, 's02-02', 'internal') - 6;
  const screensAt = props.cue('screens');
  const swapAt = props.cue('swap');
  const causeAt = props.cue('cause');
  const nickAt = props.cue('nick');
  const fillAt = wordFrame(S, 's02-05', 'barras') - 4;
  const wantsAt = props.cue('wants');
  const sprayAt = props.cue('spray');
  const lemaAt = wordFrame(S, 's02-06', 'lema') - 12;
  const moteAt = wordFrame(S, 's02-06', 'mote') - 10;
  const namesAt = props.cue('names');
  const nameAt = [wordFrame(S, 's02-07', 'hacktivist') - 8, wordFrame(S, 's02-07', 'unskilled') - 8];

  const tplIn = progress(frame, barsAt - 10, 16);
  const tplOut = progress(frame, screensAt - 8, 14, EASE.inOut);
  const casesIn = progress(frame, screensAt, 16);
  const fill = progress(frame, fillAt, 34, EASE.inOut);
  const wall = progress(frame, sprayAt - 4, 16, EASE.inOut);
  const tagOut = progress(frame, sprayAt - 4, 12);

  return (
    <Stage>
      {/* Beat 1: the empty template */}
      {tplOut < 1 ? (
        <div style={{ position: 'absolute', left: (W - TPL.w) / 2, top: TPL.top, opacity: tplIn * (1 - tplOut), fontFamily: FONT.sans }}>
          <div style={{ fontSize: 36, fontWeight: 750, color: C.muted, marginBottom: 22 }}>tres barras por actor</div>
          <Bars
            width={TPL.w}
            labelW={TPL.labelW}
            rowH={TPL.rowH}
            plainSize={46}
            enSize={34}
            en={progress(frame, enAt, 16)}
            rowOn={rowAt.map((a, i) => progress(frame, a - 6, 10) * (1 - 0.6 * progress(frame, (rowAt[i + 1] ?? enAt) - 2, 10)))}
          />
        </div>
      ) : null}

      {/* Beat 2: the case */}
      {casesIn > 0 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: casesIn }}>
          <div style={{ position: 'absolute', left: 0, top: 0, opacity: 1 - tagOut }}>
            <CaseTag text={CASE} />
          </div>
          {frame >= swapAt + 8 ? (
            <div style={{ position: 'absolute', right: 0, top: 0, opacity: 1 - tagOut }}>
              <div style={enter(frame, swapAt + 10, { distance: 12 })}>
                <Pill text={SAME} tone={C.amber} size={28} height={46} />
              </div>
            </div>
          ) : null}

          {/* the two screens, then the wall */}
          {wall < 1
            ? COL_X.map((x, i) => (
                <div key={i} style={{ position: 'absolute', left: x + 10, top: SCREEN.y, opacity: 1 - wall }}>
                  <DepartureScreen w={SCREEN.w} h={SCREEN.h} frame={frame} swapAt={swapAt} reveal={progress(frame, i === 0 ? causeAt : nickAt, 14)}>
                    {i === 0 ? <CauseMessage /> : <NickMessage />}
                  </DepartureScreen>
                </div>
              ))
            : null}
          {wall > 0 ? (
            <div style={{ position: 'absolute', left: WALL.x, top: WALL.y, opacity: wall }}>
              <Graffiti width={WALL_W} lema={progress(frame, lemaAt, 22)} mote={progress(frame, moteAt, 22)} />
              <div style={{ position: 'absolute', right: 16, top: 14 }}>
                <ImageTag size={26} />
              </div>
            </div>
          ) : null}

          {/* the two fichas */}
          {COL_X.map((x, i) => {
            const a = ACTORS[i];
            return (
              <div key={i} style={{ position: 'absolute', left: x, top: FICHA.y }}>
                <Bars width={COL_W} labelW={FICHA.labelW} rowH={FICHA.rowH} plainSize={28} side={0} sideOn={fill} money={a.money} skill={a.skill} fill={fill} />
                <div style={{ position: 'absolute', left: 0, top: WANTS_Y - FICHA.y }}>
                  <WantsRow labelW={FICHA.labelW} text={a.wants.text} en={a.wants.en} show={progress(frame, wantsAt + i * 8, 14)} size={30} />
                </div>
              </div>
            );
          })}

          {/* the names */}
          {COL_X.map((x, i) =>
            frame >= nameAt[i] - 2 && frame >= namesAt - 2 ? (
              <div key={`n${i}`} style={{ position: 'absolute', left: x, top: 0, ...enter(frame, Math.max(namesAt, nameAt[i]), { distance: 14 }) }}>
                <TermPill text={ACTORS[i].name} size={38} on={progress(frame, nameAt[i], 10)} />
              </div>
            ) : null,
          )}
        </div>
      ) : null}
    </Stage>
  );
}

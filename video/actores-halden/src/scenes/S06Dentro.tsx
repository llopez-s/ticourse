import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { windowWeight } from '../../../engine/src/ui';
import { ACCESS, CASE, NAMES } from '../data/s06-dentro';
import { Bars } from './parts/Bars';
import { Kitchen } from './parts/Kitchen';
import { CaseTag, TermPill } from './parts/Labels';
import { ImageTag } from './parts/Tags';
import { ChatFace } from './parts/s06-dentro/ChatFace';
import { FACE } from './parts/s06-dentro/FacePanel';
import { MailFace, SanctionFace } from './parts/s06-dentro/SanctionMail';
import { Stage, wordFrame } from './kit';

const S = 's06-dentro';
const W = STAGE.width;
const COL_X = [0, (W - FACE.w) / 2, W - FACE.w];
const CASE_Y = 196;
const FACES_Y = 256;
const NAMES_Y = 574;
const KITCHEN_W = 1180;

/**
 * s06-dentro «Los que ya están dentro». A ficha on top: on `inside` the switch jumps from «fuera» to «dentro»; on
 * `access` the other two rows go to half light and «su ventaja es el acceso» lands beside them. «Imagina una semana ·
 * caso de ejemplo · sin fecha» on «Imagina», then three faces, each lit while the voice is on it: the sanctioned
 * employee (`wipe`: the orders struck and gone, one error flash), the list sent by mistake (`sent`: the envelope crosses
 * to «fuera»), the amarradores' group (`chat-ping`: a new photo pops into their phones; «Sistemas no lo sabe»). On
 * `kitchen` the ficha gives way to the kitchen («imagen · no es del puerto»), each cook lit on its word together with
 * his face. On `names` the three exam names land under their faces, each on its word.
 */
export function S06Dentro(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const insideAt = props.cue('inside');
  const accessAt = props.cue('access');
  const caseAt = wordFrame(S, 's06-02', 'imagina') - 6;
  const faceAt = [props.cue('sanction'), props.cue('wrong-mail'), props.cue('crew-chat')];
  const kitchenAt = props.cue('kitchen');
  const cookAt = [wordFrame(S, 's06-05', 'jamon') - 8, wordFrame(S, 's06-05', 'nevera') - 8, wordFrame(S, 's06-05', 'freidora') - 8];
  const namesAt = props.cue('names');
  const nameAt = [wordFrame(S, 's06-06', 'intentional') - 8, wordFrame(S, 's06-06', 'unintentional') - 8, wordFrame(S, 's06-06', 'shadow') - 8];
  const end = props.durationInFrames;

  const kitchen = progress(frame, kitchenAt - 4, 16, EASE.inOut);
  // Which face is lit: its own beat, then its cook, then its name; all three on «Los tres ya estaban dentro».
  const faceOn = [0, 1, 2].map((i) =>
    Math.max(
      windowWeight(frame, faceAt[i], i < 2 ? faceAt[i + 1] : kitchenAt),
      windowWeight(frame, cookAt[i], i < 2 ? cookAt[i + 1] : namesAt),
      windowWeight(frame, namesAt, nameAt[0]),
      windowWeight(frame, nameAt[i], i < 2 ? nameAt[i + 1] : end + 30),
    ),
  );

  return (
    <Stage>
      {/* Row A: the ficha, then the kitchen */}
      {kitchen < 1 ? (
        <div style={{ position: 'absolute', left: 0, top: 0, opacity: (1 - kitchen) * progress(frame, insideAt - 14, 14) }}>
          <Bars width={1000} labelW={260} rowH={50} plainSize={30} side={progress(frame, insideAt + 4, 16, EASE.inOut)} sideOn={1} fill={0} dimRest={progress(frame, accessAt, 14)} rowOn={[progress(frame, insideAt, 12), 0, 0]} />
          <div style={{ position: 'absolute', left: 1060, top: 64, fontFamily: FONT.sans, fontSize: 44, fontWeight: 850, color: C.sky, whiteSpace: 'nowrap', textShadow: `0 0 18px ${alpha(C.sky, 0.35)}`, ...enter(frame, accessAt + 4, { distance: 14 }) }}>
            {ACCESS}
          </div>
        </div>
      ) : null}
      {kitchen > 0 ? (
        <div style={{ position: 'absolute', left: 0, top: 0, opacity: kitchen }}>
          <Kitchen width={KITCHEN_W} lit={cookAt.map((a, i) => Math.max(progress(frame, a, 10) * (1 - 0.6 * progress(frame, (cookAt[i + 1] ?? namesAt) - 2, 10)), 0.25))} />
          <div style={{ position: 'absolute', left: KITCHEN_W + 24, top: 10 }}>
            <ImageTag size={26} />
          </div>
        </div>
      ) : null}

      <div style={{ position: 'absolute', left: 0, top: CASE_Y, opacity: 1 - kitchen }}>
        <div style={enter(frame, caseAt, { distance: 12 })}>
          <CaseTag text={CASE} />
        </div>
      </div>

      {/* The three faces */}
      <div style={{ position: 'absolute', left: COL_X[0], top: FACES_Y, ...enter(frame, faceAt[0] - 10, { distance: 18 }) }}>
        <SanctionFace frame={frame} on={faceOn[0]} wipeAt={props.cue('wipe')} />
      </div>
      <div style={{ position: 'absolute', left: COL_X[1], top: FACES_Y, ...enter(frame, faceAt[1] - 10, { distance: 18 }) }}>
        <MailFace frame={frame} on={faceOn[1]} mailAt={faceAt[1]} sentAt={props.cue('sent')} />
      </div>
      <div style={{ position: 'absolute', left: COL_X[2], top: FACES_Y, ...enter(frame, faceAt[2] - 10, { distance: 18 }) }}>
        <ChatFace
          frame={frame}
          fps={fps}
          on={faceOn[2]}
          chatAt={faceAt[2]}
          pingAt={props.cue('chat-ping')}
          systemsAt={wordFrame(S, 's06-04', 'sistemas') - 6}
          afterAt={wordFrame(S, 's06-06', 'malicia') - 6}
        />
      </div>

      {/* The names */}
      {NAMES.map((n, i) =>
        frame >= nameAt[i] - 2 ? (
          <div key={n} style={{ position: 'absolute', left: COL_X[i], top: NAMES_Y, ...enter(frame, nameAt[i], { distance: 14 }) }}>
            <TermPill text={n} size={32} />
          </div>
        ) : null,
      )}
    </Stage>
  );
}

import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress, springIn } from '../../../engine/src/theme/motion';
import { Icon } from '../../../engine/src/ui';
import { ANSWER, ENCRYPT_HEAD, ENCRYPT_LINES, PERMISSION, PLANT_LINES, PROPOSALS, PROPOSALS_HEAD } from '../data/s02-causa';
import { CaseTag, Pill, TermPill } from './parts/Labels';
import { Plant } from './parts/Plant';
import { ImageTag } from './parts/Tags';
import { Folder } from './parts/s02-causa/Folder';
import { PROPOSAL_H, Proposal } from './parts/s02-causa/Proposal';
import { VerbMap } from './parts/s02-causa/VerbMap';
import { Stage, wordFrame } from './kit';

const S = 's02-causa';
const W = STAGE.width;
const COL_A = 0;
const COL_B = 540;
const COL_C = 1180;
const COL_C_W = W - COL_C;
const PROP_TOP = 112;
const PROP_GAP = 16;

/** A line with an emerald tick or a rose cross, lit on its word. */
function Reading({ text, good, show, size = 32 }: { text: string; good: boolean; show: number; size?: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, opacity: show, transform: `translateY(${(1 - show) * 10}px)`, fontFamily: FONT.sans }}>
      <div style={{ marginTop: 2 }}>
        <Icon name={good ? 'check' : 'x'} size={size + 4} color={good ? C.emerald : C.rose} strokeWidth={3} />
      </div>
      <span style={{ fontSize: size, fontWeight: 750, lineHeight: 1.18, color: C.textStrong }}>{text}</span>
    </div>
  );
}

/**
 * s02-causa «La carpeta abierta». The department's folder (documents as grey bars, no names) from `folder`; on
 * `everyone` the permission card «todos · leer» pops in rose with a shake and an error flash while the whole staff
 * gathers round the folder. On `four` four proposals land in the middle, each with an emerald tick on «funcionan». On
 * `plant` the living-room plant (imagen · no es del puerto) wilts, gets watered on «agua» and shows aphids on «pulgón».
 * On `permission` the permission card is ringed («aquí falla»), the fourth proposal wins and «Access control» lands on
 * «access», with «el principio: least privilege» dim under it — the fix is never shown as done. On `not-encrypt` the
 * encryption card is struck and its reason replaces the plant. On `map` everything gives way to the verb map.
 */
export function S02Causa(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const folderAt = props.cue('folder');
  const everyoneAt = props.cue('everyone');
  const fourAt = props.cue('four');
  const plantAt = props.cue('plant');
  const permAt = props.cue('permission');
  const encAt = props.cue('not-encrypt');
  const mapAt = props.cue('map');
  const tickAt = wordFrame(S, 's02-02', 'funcionan') - 6;
  const pochaAt = wordFrame(S, 's02-03', 'pocha') - 8;
  const plantLineAt = PLANT_LINES.map((l) => wordFrame(S, 's02-03', l.word) - 6);
  const regarlaAt = wordFrame(S, 's02-03', 'regarla') - 4;
  const accessAt = wordFrame(S, 's02-04', 'access') - 8;
  const encLineAt = ENCRYPT_LINES.map((l) => wordFrame(S, 's02-05', l.word) - 6);

  const caseIn = enter(frame, -6, { distance: 12, duration: 14 });
  const boardOut = progress(frame, mapAt - 12, 14, EASE.inOut);
  const folderIn = enter(frame, folderAt - 4, { distance: 18, duration: 16 });
  const crowd = progress(frame, everyoneAt, 22);
  const flash = frame >= everyoneAt - 1 ? Math.max(0, 1 - (frame - everyoneAt + 1) / 18) : 0;
  const permIn = springIn(frame, fps, everyoneAt - 2, { damping: 11 });
  const shake = frame >= everyoneAt && frame < everyoneAt + 16 ? Math.sin((frame - everyoneAt) * 2.4) * 10 * (1 - (frame - everyoneAt) / 16) : 0;
  const ring = progress(frame, permAt, 14) * (1 - 0.5 * progress(frame, encAt, 16));
  const termIn = enter(frame, accessAt, { distance: 14, duration: 14 });
  const principleIn = progress(frame, accessAt + 18, 14);

  const win = progress(frame, accessAt - 4, 14);
  const strike = progress(frame, encAt + 4, 14);
  const plantDim = progress(frame, permAt, 16);
  const plantOut = progress(frame, encAt - 8, 12, EASE.inOut);
  const encIn = progress(frame, encAt, 14);

  return (
    <Stage>
      <div style={{ position: 'absolute', left: 0, top: 0, ...caseIn }}>
        <CaseTag />
      </div>

      {boardOut < 1 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: 1 - boardOut }}>
          {/* Column A: the folder, its permission, and the answer */}
          <div style={{ position: 'absolute', left: COL_A + 10, top: 76, ...folderIn }}>
            <Folder open={crowd} flash={flash} />
          </div>
          {frame >= everyoneAt - 4 ? (
            <div style={{ position: 'absolute', left: COL_A + 70, top: 392, opacity: Math.min(1, permIn * 1.4), transform: `translateX(${shake}px) scale(${0.85 + 0.15 * Math.min(1, permIn)})`, transformOrigin: '0 50%' }}>
              <div style={{ borderRadius: 999, boxShadow: ring > 0.01 ? `0 0 0 ${Math.round(6 * ring)}px ${alpha(C.amber, 0.7 * ring)}` : undefined }}>
                <Pill text={PERMISSION} tone={C.rose} icon="users" size={40} height={68} on={1} />
              </div>
            </div>
          ) : null}
          {frame >= accessAt - 2 ? (
            <div style={{ position: 'absolute', left: COL_A + 70, top: 488, ...termIn }}>
              <TermPill text={ANSWER.term} size={38} />
            </div>
          ) : null}
          <div style={{ position: 'absolute', left: COL_A + 74, top: 586, fontFamily: FONT.sans, fontSize: 30, fontWeight: 650, color: C.muted, opacity: 0.75 * principleIn, whiteSpace: 'nowrap' }}>
            {ANSWER.principle}
          </div>

          {/* Column B: the four proposals */}
          <div style={{ position: 'absolute', left: COL_B, top: 60, fontFamily: FONT.sans, fontSize: 30, fontWeight: 750, color: C.muted, opacity: progress(frame, fourAt - 4, 12), whiteSpace: 'nowrap' }}>
            {PROPOSALS_HEAD}
          </div>
          {PROPOSALS.map((p, i) => {
            const show = progress(frame, fourAt + i * 5, 12);
            if (show <= 0.001) return null;
            return (
              <div key={p.text} style={{ position: 'absolute', left: COL_B, top: PROP_TOP + i * (PROPOSAL_H + PROP_GAP) + (1 - show) * 12 }}>
                <Proposal
                  text={p.text}
                  icon={p.icon}
                  show={show}
                  tick={frame >= tickAt + i * 3 ? springIn(frame, fps, tickAt + i * 3, { damping: 12 }) : 0}
                  win={p.answer ? win : 0}
                  dim={p.answer ? 0 : win * (p.encrypt ? 0.5 + 0.5 * strike : 1)}
                  strike={p.encrypt ? strike : 0}
                />
              </div>
            );
          })}

          {/* Column C: the plant, then encryption's reason */}
          {plantOut < 1 && frame >= plantAt - 6 ? (
            <div style={{ position: 'absolute', left: COL_C, top: 0, width: COL_C_W, opacity: progress(frame, plantAt - 4, 14) * (1 - 0.55 * plantDim) * (1 - plantOut) }}>
              <ImageTag size={26} />
              <div style={{ position: 'absolute', left: (COL_C_W - 340) / 2, top: 44 }}>
                <Plant width={340} droop={progress(frame, pochaAt, 22) * (1 - 0.6 * progress(frame, plantLineAt[0] + 10, 20)) + 0.6 * progress(frame, plantLineAt[1], 20)} water={progress(frame, plantLineAt[0], 12) * (1 - progress(frame, plantLineAt[1] - 4, 10)) + progress(frame, regarlaAt, 10)} aphids={progress(frame, plantLineAt[1], 18)} frame={frame} />
              </div>
              <div style={{ position: 'absolute', left: 6, top: 452, display: 'flex', flexDirection: 'column', gap: 18 }}>
                {PLANT_LINES.map((l, k) => (
                  <Reading key={l.text} text={l.text} good={l.good} show={progress(frame, plantLineAt[k], 12)} />
                ))}
              </div>
            </div>
          ) : null}
          {encIn > 0.01 ? (
            <div style={{ position: 'absolute', left: COL_C, top: 70, width: COL_C_W, opacity: encIn, transform: `translateY(${(1 - encIn) * 14}px)`, fontFamily: FONT.sans }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 38, fontWeight: 850, color: C.textStrong }}>
                <Icon name="key" size={40} color={C.muted} />
                {ENCRYPT_HEAD}
              </div>
              <div style={{ marginTop: 26, display: 'flex', flexDirection: 'column', gap: 22 }}>
                {ENCRYPT_LINES.map((l, k) => (
                  <Reading key={l.text} text={l.text} good={l.good} size={32} show={progress(frame, encLineAt[k], 12)} />
                ))}
              </div>
            </div>
          ) : null}
        </div>
      ) : null}

      {/* The verb map */}
      {boardOut > 0.01 ? (
        <div style={{ position: 'absolute', left: 0, top: 64, opacity: boardOut }}>
          <VerbMap frame={frame} at={mapAt} width={W} />
        </div>
      ) : null}
    </Stage>
  );
}

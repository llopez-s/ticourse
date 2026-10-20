import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { CASE, NAMES } from '../data/s04-intrusos';
import { Bars } from './parts/Bars';
import { CaseTag, ExamChip, TermPill } from './parts/Labels';
import { ImageTag } from './parts/Tags';
import { HiddenMic, Thief } from './parts/ThiefMic';
import { Network } from './parts/s04-intrusos/Network';
import { Office } from './parts/s04-intrusos/Office';
import { Stage, wordFrame } from './kit';

const S = 's04-intrusos';
const W = STAGE.width;
const COL_W = 840;
const COL_X = [0, W - COL_W] as const;
const ROW_A = 62;
const ROW_B = 250;
const ROW_C = 538;
const FULL = { lo: 1 } as const;
const IMAGE_LINES = ['coge y se va', 'se queda y escucha'] as const;

/**
 * s04-intrusos «Un ladrón y un micrófono». «Imagina dos intrusos · caso de ejemplo · sin fecha» from the first frame.
 * On `both-full` two fichas fill: «fuera», money and skill to the top. Under them, two vignettes: the office with no
 * name (`ransom` a rose dot comes in, `encrypt` the documents scramble and «cifrado» lands with the lock sound, `note`
 * «o pagáis, o no recuperáis nada» + «ransomware») and the port's network (`year` a quiet dot «más de un año dentro»,
 * `zero-day` both toolkits get «fallos que nadie conocía · zero-day», `reports` the reports copied page by page with the
 * typing sound, `quiet` «no pide nada · no rompe nada»). On «separan» an equals sign joins the two fichas. On `thief`
 * and `mic` each ficha gives way to its image («imagen · no es del puerto») and the exam name lands below, with its
 * motives; the exam card comes after the microphone.
 */
export function S04Intrusos(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fullAt = props.cue('both-full');
  const zeroAt = props.cue('zero-day');
  const sameAt = wordFrame(S, 's04-04', 'separan') - 12;
  const imageAt = [props.cue('thief'), props.cue('mic')];
  const nameAt = [wordFrame(S, 's04-05', 'organized') - 8, wordFrame(S, 's04-06', 'nation-state') - 8];

  const fill = progress(frame, fullAt + 4, 30, EASE.inOut);
  const same = progress(frame, sameAt, 14) * (1 - progress(frame, imageAt[0] - 6, 12));

  return (
    <Stage>
      <div style={{ position: 'absolute', left: 0, top: 0 }}>
        <CaseTag text={CASE} />
      </div>

      {COL_X.map((x, i) => {
        const img = progress(frame, imageAt[i] - 4, 16, EASE.inOut);
        return (
          <div key={i}>
            {/* Row A: the ficha, then the image */}
            {img < 1 ? (
              <div style={{ position: 'absolute', left: x, top: ROW_A, opacity: (1 - img) * progress(frame, fullAt - 10, 14) }}>
                <Bars width={COL_W} labelW={230} rowH={50} plainSize={28} side={0} sideOn={fill} money={FULL} skill={FULL} fill={fill} />
              </div>
            ) : null}
            {img > 0 ? (
              <div style={{ position: 'absolute', left: x, top: ROW_A - 6, width: COL_W, height: 180, opacity: img, display: 'flex', alignItems: 'center', gap: 28 }}>
                <div style={{ flexShrink: 0 }}>{i === 0 ? <Thief size={180} walk={progress(frame, imageAt[0], 60)} /> : <HiddenMic size={180} listen={progress(frame, imageAt[1] + 8, 20)} />}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'flex-start' }}>
                  <ImageTag size={26} />
                  <div style={{ fontFamily: FONT.sans, fontSize: 40, fontWeight: 850, color: C.textStrong, whiteSpace: 'nowrap' }}>{IMAGE_LINES[i]}</div>
                </div>
              </div>
            ) : null}

            {/* Row B: the vignette */}
            <div style={{ position: 'absolute', left: x, top: ROW_B, ...enter(frame, i === 0 ? props.cue('ransom') - 14 : props.cue('year') - 14, { distance: 18 }) }}>
              {i === 0 ? (
                <Office frame={frame} ransomAt={props.cue('ransom')} encryptAt={props.cue('encrypt')} noteAt={props.cue('note')} toolsAt={zeroAt + 10} />
              ) : (
                <Network frame={frame} fps={fps} yearAt={props.cue('year')} toolsAt={zeroAt} reportsAt={props.cue('reports')} quietAt={props.cue('quiet')} />
              )}
            </div>

            {/* Row C: the name and its motives */}
            {frame >= nameAt[i] - 2 ? (
              <div style={{ position: 'absolute', left: x, top: ROW_C, display: 'flex', flexDirection: 'column', gap: 10, ...enter(frame, nameAt[i], { distance: 14 }) }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <TermPill text={NAMES[i].name} size={36} />
                  {NAMES[i].chips.map((c, k) => (
                    <div key={c} style={{ opacity: progress(frame, nameAt[i] + 8 + k * 6, 10) }}>
                      <ExamChip text={c} size={28} />
                    </div>
                  ))}
                </div>
                {NAMES[i].also ? (
                  <div style={{ opacity: progress(frame, nameAt[i] + 24, 12), fontFamily: FONT.sans, fontSize: 28, fontWeight: 750, color: '#c4b5fd', whiteSpace: 'nowrap' }}>{NAMES[i].also}</div>
                ) : null}
              </div>
            ) : null}
          </div>
        );
      })}

      {/* «Las barras no los separan»: an equals sign between the two full fichas */}
      {same > 0 ? (
        <div style={{ position: 'absolute', left: W / 2 - 14, top: ROW_A + 66, opacity: same }}>
          {[0, 1].map((k) => (
            <div key={k} style={{ width: 28, height: 7, borderRadius: 4, background: C.textStrong, marginBottom: 12, boxShadow: `0 0 12px ${alpha(C.text, 0.5)}` }} />
          ))}
        </div>
      ) : null}
    </Stage>
  );
}

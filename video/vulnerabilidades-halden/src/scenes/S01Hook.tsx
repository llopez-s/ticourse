import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { mix } from '../../../engine/src/ui';
import { PLAQUE, STAMP, THREE, TITLE } from '../data/s01-hook';
import { CHIP_H, CaseStamp, PlaqueChip, Pill } from './parts/Labels';
import { Silhouette } from './parts/Silhouettes';
import { Stage, wordFrame } from './kit';

const S = 's01-hook';
const W = STAGE.width;
/** Centres of the three silhouettes, and their size/top before and after the title lands. */
const CX = [W / 2 - 520, W / 2, W / 2 + 520];
const SIZE0 = 320;
const TOP0 = 130;
const SIZE1 = 280;
const TOP1 = 262;
const CHIPS_TOP = 572;
const TITLE_TOP = 92;
const TITLE_SIZE = 104;

/**
 * s01-hook «Dónde nació». The case stamp from the first frame; on `three` the three silhouettes come in, each on the
 * word that names it — the shared server (a rack with three machines), the cloud, the phone. On `cracks` a rose crack
 * runs down each one, and they glow on «nació». Before 12 s the row glides down and shrinks, «Dónde nace el fallo»
 * lands on top with «SY0-701 · 2.3», and the promise comes as one chip under each silhouette, lit on its own word
 * («máquina», «nube», «bolsillo»).
 */
export function S01Hook(props: SceneProps) {
  const frame = useCurrentFrame();
  const threeAt = props.cue('three');
  const cracksAt = props.cue('cracks');
  const titleAt = Math.min(props.cue('title') - 6, 12 * 30 - 22);
  const bornAt = wordFrame(S, 's01-01', 'nació') - 4;
  const inAt = THREE.map((_, i) => threeAt - 4 + i * 6);
  const litAt = THREE.map((t) => wordFrame(S, 's01-01', t.inWord) - 6);
  const chipAt = THREE.map((t) => wordFrame(S, 's01-02', t.chipWord) - 6);
  const lastWord = props.segments[props.segments.length - 1].to;

  const stampIn = enter(frame, -6, { distance: 16, duration: 16 });
  const glide = progress(frame, titleAt - 16, 30, EASE.inOut);
  const size = mix(SIZE0, SIZE1, glide);
  const top = mix(TOP0, TOP1, glide);
  const titleIn = enter(frame, titleAt, { distance: 22, duration: 18 });
  const plaqueIn = enter(frame, titleAt + 4, { distance: 14, duration: 16 });
  const born = progress(frame, bornAt, 12) * (1 - 0.6 * progress(frame, titleAt, 20));

  return (
    <Stage>
      <div style={{ position: 'absolute', left: 0, top: 0, ...stampIn }}>
        <CaseStamp what={STAMP.what} kind={STAMP.kind} />
      </div>
      {frame >= titleAt ? (
        <div style={{ position: 'absolute', right: 0, top: 5, ...plaqueIn }}>
          <PlaqueChip text={PLAQUE} />
        </div>
      ) : null}

      {/* The three silhouettes */}
      {THREE.map((t, i) => {
        const e = enter(frame, inAt[i], { distance: 24, duration: 18 });
        const crack = progress(frame, cracksAt + i * 8, 22, EASE.inOut);
        const chipOn = progress(frame, chipAt[i], 10) * (1 - 0.5 * progress(frame, (chipAt[i + 1] ?? lastWord) - 2, 12, EASE.inOut));
        return (
          <div key={t.kind}>
            <div style={{ position: 'absolute', left: CX[i] - size / 2, top, ...e }}>
              <Silhouette kind={t.kind} size={size} crack={crack} glow={0.15 + 0.55 * progress(frame, litAt[i], 12) * (1 - progress(frame, cracksAt, 12)) + 0.7 * Math.max(born, chipOn)} />
            </div>
            {frame >= chipAt[i] - 2 ? (
              <div style={{ position: 'absolute', left: CX[i] - 300, width: 600, top: CHIPS_TOP, display: 'flex', justifyContent: 'center', ...enter(frame, chipAt[i], { distance: 16 }) }}>
                <Pill text={t.chip} tone={i === 1 ? C.sky : C.cyan} on={chipOn} height={CHIP_H} size={36} />
              </div>
            ) : null}
          </div>
        );
      })}

      {/* The title */}
      {frame >= titleAt - 2 ? (
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: TITLE_TOP,
            width: W,
            textAlign: 'center',
            fontFamily: FONT.sans,
            fontSize: TITLE_SIZE,
            fontWeight: 900,
            letterSpacing: -2,
            lineHeight: 1.04,
            color: C.textStrong,
            whiteSpace: 'nowrap',
            textShadow: `0 0 30px ${alpha(C.cyan, 0.2)}`,
            ...titleIn,
          }}
        >
          {TITLE[0]}
          <span style={{ color: C.rose }}>{TITLE[1]}</span>
        </div>
      ) : null}
    </Stage>
  );
}

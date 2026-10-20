import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { mix, type IconName } from '../../../engine/src/ui';
import { AdversaryTag } from './parts/Adversary';
import { CaseStamp, PlaqueChip, Pill } from './parts/Labels';
import { LureCard } from './parts/Messages';
import { Stage, wordFrame } from './kit';

const S = 's01-hook';
const W = STAGE.width;

// ---- the lure: big and centred first, then small at the top-left once the title lands
const LURE_W = 1320;
const LURE_X0 = Math.round((W - LURE_W) / 2);
const LURE_Y0 = 170;
const LURE_S1 = 0.6;
const LURE_Y1 = 96;
// ---- the promise chips, 2 × 2 under the small lure
const CHIP_X = [0, 440];
const CHIP_Y = [262, 336];
// ---- the right column: plate and title
const COL_X = 960;
const PLAQUE_TOP = 96;
const TITLE_TOP = 158;
// ---- RED MARROW's tag, centred at the bottom
const TAG_TOP = 462;

const PROMISE: { text: string; word: string; icon: IconName }[] = [
  { text: 'cómo llega', word: 'llega', icon: 'mail' },
  { text: 'qué te pide', word: 'pide', icon: 'bell' },
  { text: 'quién dice ser', word: 'dice', icon: 'user' },
  { text: 'si sabe que miente', word: 'miente', icon: 'eye' },
];

/**
 * s01-hook «Un mensaje bien escrito». The stamp «Autoridad Portuaria de Halden · caso de ejemplo» from the first frame
 * (no date); on `message` the lure lands big in the middle — «Cobra la nueva ayuda de transporte: confirma tus datos
 * antes del viernes» (rose rim, the deadline in amber). On `title` (before 12 s) it shrinks to the top-left and
 * «Ingeniería social» lands on the right under the plate «SY0-701 · 2.2»; the promise follows as four chips under the
 * lure, each lit on its word. On `adversary` RED MARROW's tag (a hook, «vive de engañar») comes in at the bottom.
 */
export function S01Hook(props: SceneProps) {
  const frame = useCurrentFrame();
  const msgAt = props.cue('message') - 4;
  const titleAt = Math.min(props.cue('title') - 6, 12 * 30 - 22);
  const chipAt = PROMISE.map((p, i) => {
    const at = wordFrame(S, 's01-02', p.word) - 6;
    return i === 0 ? Math.min(at, props.cue('promise') + 14) : at;
  });
  const advAt = props.cue('adversary') - 4;
  const lieAt = wordFrame(S, 's01-03', 'engañar') - 4;

  const stampIn = enter(frame, -6, { distance: 16, duration: 16 });
  const lureIn = enter(frame, msgAt, { distance: 26, duration: 18 });
  const glide = progress(frame, titleAt - 18, 30, EASE.inOut);
  const lureX = mix(LURE_X0, 0, glide);
  const lureY = mix(LURE_Y0, LURE_Y1, glide);
  const lureS = mix(1, LURE_S1, glide);
  const plaqueIn = enter(frame, titleAt - 4, { distance: 14, duration: 16 });
  const titleIn = enter(frame, titleAt, { distance: 22, duration: 18 });
  const lastChip = advAt;
  const chipOn = PROMISE.map((_, i) => progress(frame, chipAt[i], 10) * (1 - 0.55 * progress(frame, (chipAt[i + 1] ?? lastChip) - 2, 12, EASE.inOut)));
  const tagIn = enter(frame, advAt, { distance: 24, duration: 18 });
  const glow = progress(frame, lieAt, 12);

  return (
    <Stage>
      <div style={{ position: 'absolute', left: 0, top: 0, ...stampIn }}>
        <CaseStamp what="Autoridad Portuaria de Halden" kind="caso de ejemplo" />
      </div>

      {frame >= msgAt - 2 ? (
        <div style={{ position: 'absolute', left: lureX, top: lureY, transformOrigin: '0 0', transform: `scale(${lureS})` }}>
          <div style={{ opacity: lureIn.opacity, transform: lureIn.transform }}>
            <LureCard size={54} width={LURE_W} />
          </div>
        </div>
      ) : null}

      {frame >= titleAt - 6 ? (
        <div style={{ position: 'absolute', left: COL_X, top: PLAQUE_TOP, ...plaqueIn }}>
          <PlaqueChip text="SY0-701 · 2.2" />
        </div>
      ) : null}
      {frame >= titleAt - 2 ? (
        <div style={{ position: 'absolute', left: COL_X, top: TITLE_TOP, fontFamily: FONT.sans, ...titleIn }}>
          {['Ingeniería', 'social'].map((l, k) => (
            <div
              key={l}
              style={{
                fontSize: 112,
                fontWeight: 900,
                letterSpacing: -2,
                lineHeight: 1.02,
                color: k === 0 ? C.textStrong : C.cyan,
                whiteSpace: 'nowrap',
                textShadow: `0 0 30px ${alpha(k === 0 ? C.cyan : C.cyan, 0.18)}`,
              }}
            >
              {l}
            </div>
          ))}
        </div>
      ) : null}

      {PROMISE.map((p, i) => {
        if (frame < chipAt[i] - 2) return null;
        const e = enter(frame, chipAt[i], { distance: 16 });
        return (
          <div key={p.text} style={{ position: 'absolute', left: CHIP_X[i % 2], top: CHIP_Y[Math.floor(i / 2)], ...e }}>
            <Pill icon={p.icon} text={p.text} on={chipOn[i]} tone={C.cyan} />
          </div>
        );
      })}

      {frame >= advAt - 2 ? (
        <div style={{ position: 'absolute', left: 0, top: TAG_TOP, width: W, display: 'flex', justifyContent: 'center', ...tagIn }}>
          <AdversaryTag glow={glow} />
        </div>
      ) : null}
    </Stage>
  );
}

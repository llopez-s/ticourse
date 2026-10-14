import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { dimStyle, mix, windowWeight } from '../../../engine/src/ui';
import { PROMISE, TITLE } from '../data/s01-hook';
import { AdversaryTag } from './parts/s01-hook/AdversaryTag';
import { AuditStamp, CHIP_H, PromiseChip, STAMP_H } from './parts/s01-hook/Bits';
import { FINDING, KeyCard, SignalCard } from './parts/s01-hook/Findings';
import { WIFI, WifiHero } from './parts/s01-hook/Wifi';
import { Stage, wordFrame } from './kit';

const S = 's01-hook';
const W = STAGE.width;
const H = STAGE.height;

// ---- Today's picture: the stamp over a row of [finding 1 · the wifi of the tablets · finding 2].
const GAP = 30;
const GROUP_W = FINDING.w + GAP + WIFI.w + GAP + FINDING.w;
const GROUP_X = Math.round((W - GROUP_W) / 2);
const ROW_Y = STAMP_H + 16;
const GROUP_H = ROW_Y + FINDING.h;
const HERO_X = FINDING.w + GAP;
const KEY_X = HERO_X + WIFI.w + GAP;
/** Centred on the stage until the title lands; then it drops under the title block. */
const GROUP_Y_A = Math.round((H - GROUP_H) / 2);
const GROUP_Y_B = H - GROUP_H - 14;
/** Before the findings arrive, the wifi drawing is alone and bigger (it grows upwards, the stamp rides on it). */
const HERO_BIG = 1.45;
const HERO_RISE = FINDING.h * (HERO_BIG - 1);

// ---- Title block (from `title`): the title and, under it, the promise as a short list.
const TITLE_SIZE = 88;
const CHIPS_TOP = 98;
const CHIP_GAP = 10;
/** The block is centred on the stage; it steps left when SILENT PAGER's tag takes the right. */
const BLOCK_CX = W / 2;
const BLOCK_CX_ADV = 520;

/**
 * s01-hook «Una clave para toda la terminal». The wifi of the crane tablets settles from the first
 * frame: one access point, three tablets on it. On `audit` Monday's stamp lands over it («14-12 ·
 * lunes · auditoría del trimestre · wifi de la terminal»). On `findings` the audit's two findings
 * take its sides: «la señal llega al aparcamiento de visitantes · −55 dBm» and «HALDEN-OPS · WPA2 ·
 * una clave que sabe toda la terminal · sin cambiar desde 2022»; as the voice says who knows the
 * key, the three tablets' screens turn the same amber, and «sin cambiar desde 2022» lights on
 * «no cambia». Before 12 s (`title`) «WPA3» lands at the top while today's picture drops and steps
 * back; the promise follows as three chips, each lit on its words. On `adversary` the title block
 * moves left and SILENT PAGER's tag («SILENT PAGER · sección 4» / «cuenta con que tu SOC duerma»,
 * a silenced bell) enters on the right. The last frame: title and promise dimmed, the tag, and the
 * two findings under them.
 */
export function S01Hook(props: SceneProps) {
  const frame = useCurrentFrame();
  const auditAt = props.cue('audit');
  const findingsAt = props.cue('findings');
  const advAt = props.cue('adversary');
  // Title before 12 s, whatever the voice does.
  const titleAt = Math.min(props.cue('title') - 6, 12 * 30 - 22);
  const w1 = (word: string) => wordFrame(S, 's01-01', word);

  // ---- The wifi of the tablets: there from frame 0, alone until the findings need its sides.
  const settle = progress(frame, -10, 22);
  const waves = 0.34 + 0.66 * progress(frame, 2, 34, EASE.inOut);
  const alone = 1 - progress(frame, findingsAt - 26, 24, EASE.inOut);
  const heroScale = mix(1, HERO_BIG, alone);
  const stampIn = enter(frame, auditAt - 4, { distance: 14, duration: 16 });

  // ---- The two findings; the voice is on the second one (who knows the key, and since when).
  const signalIn = enter(frame, findingsAt - 14, { distance: 18, duration: 16 });
  const keyIn = enter(frame, findingsAt - 2, { distance: 18, duration: 16 });
  const keyLit = windowWeight(frame, findingsAt, titleAt - 6, { ramp: 12 });
  const said: [number, number] = [progress(frame, findingsAt - 2, 12), progress(frame, w1('cambia') - 4, 12)];
  const shared = [0, 1, 2].map((i) => progress(frame, w1('toda') - 4 + i * 5, 12));

  // ---- Title and promise; today's picture drops and steps back under them.
  const titleIn = enter(frame, titleAt, { distance: 22, duration: 18 });
  const drop = progress(frame, titleAt - 8, 24, EASE.inOut);
  const groupY = mix(GROUP_Y_A, GROUP_Y_B, drop) + (alone * HERO_RISE) / 2;
  const chipAt = PROMISE.map((p) => wordFrame(S, 's01-02', p.word) - 6);

  // ---- SILENT PAGER: the title block steps left and back, the tag takes the right.
  const toAdv = progress(frame, advAt - 14, 24, EASE.inOut);
  const blockCx = mix(BLOCK_CX, BLOCK_CX_ADV, toAdv);
  const blockDim = 0.55 * progress(frame, advAt - 8, 16, EASE.inOut);
  const tagIn = enter(frame, advAt - 2, { distance: 26, duration: 18, axis: 'x' });
  const sleepGlow = windowWeight(frame, wordFrame(S, 's01-03', 'duerma') - 6, Number.POSITIVE_INFINITY, { ramp: 14 });
  const groupDim = 0.5 * progress(frame, titleAt - 4, 18, EASE.inOut) * (1 - 0.6 * progress(frame, advAt + 2, 20, EASE.inOut));

  return (
    <Stage>
      {/* Today's picture: stamp, the wifi of the tablets, and the two findings */}
      <div style={{ position: 'absolute', left: GROUP_X, top: groupY, width: GROUP_W, height: GROUP_H, ...dimStyle(groupDim) }}>
        {/* Monday 14-12: the quarter's audit */}
        {frame >= auditAt - 6 ? (
          <div style={{ position: 'absolute', left: 0, top: -alone * HERO_RISE, width: GROUP_W, display: 'flex', justifyContent: 'center', ...stampIn }}>
            <AuditStamp />
          </div>
        ) : null}

        <div style={{ position: 'absolute', left: HERO_X, top: ROW_Y, opacity: settle, transform: `scale(${heroScale})`, transformOrigin: '50% 100%' }}>
          <WifiHero waves={waves} shared={shared} />
        </div>

        {frame >= findingsAt - 16 ? (
          <div style={{ position: 'absolute', left: 0, top: ROW_Y, ...signalIn }}>
            <SignalCard />
          </div>
        ) : null}
        {frame >= findingsAt - 4 ? (
          <div style={{ position: 'absolute', left: KEY_X, top: ROW_Y, ...keyIn }}>
            <KeyCard lit={keyLit} said={said} />
          </div>
        ) : null}
      </div>

      {/* Title and promise */}
      {frame >= titleAt - 2 ? (
        <div style={{ position: 'absolute', left: blockCx - W / 2, top: 0, width: W, fontFamily: FONT.sans, ...dimStyle(blockDim) }}>
          <div style={{ position: 'absolute', left: 0, top: 0, width: W, textAlign: 'center', ...titleIn }}>
            <span style={{ fontSize: TITLE_SIZE, fontWeight: 900, letterSpacing: -1.2, lineHeight: 1, color: C.cyan, textShadow: `0 0 34px ${alpha(C.cyan, 0.28)}`, whiteSpace: 'nowrap' }}>
              {TITLE}
            </span>
          </div>
          {PROMISE.map((p, i) => {
            if (frame < chipAt[i] - 2) return null;
            const e = enter(frame, chipAt[i], { distance: 16 });
            const on = progress(frame, chipAt[i], 10) * (1 - 0.55 * progress(frame, (chipAt[i + 1] ?? advAt - 6) - 2, 12, EASE.inOut));
            return (
              <div key={p.text} style={{ position: 'absolute', left: 0, top: CHIPS_TOP + i * (CHIP_H + CHIP_GAP), width: W, display: 'flex', justifyContent: 'center', ...e }}>
                <PromiseChip icon={p.icon} text={p.text} on={on} />
              </div>
            );
          })}
        </div>
      ) : null}

      {/* SILENT PAGER: it counts on a sleeping SOC */}
      {frame >= advAt - 4 ? (
        <div style={{ position: 'absolute', right: 16, top: 10, ...tagIn }}>
          <AdversaryTag glow={sleepGlow} />
        </div>
      ) : null}
    </Stage>
  );
}

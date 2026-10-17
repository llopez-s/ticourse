import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { mix } from '../../../engine/src/ui';
import { PLAQUE, PROMISE, STAMP, TITLE } from '../data/s01-hook';
import { CaseStamp, PlaqueChip, Pill } from './parts/Bits';
import { SIL_RATIO, SILHOUETTES, Silhouette } from './parts/Silhouettes';
import { Stage, wordFrame } from './kit';

const S = 's01-hook';
const W = STAGE.width;

// ---- The row of silhouettes, in its own coordinates (scaled down when it glides left).
const SIL_W = 300;
const SIL_GAP = 110;
const ROW_W = 3 * SIL_W + 2 * SIL_GAP;
const ROW_H = SIL_W * SIL_RATIO;
const ROW_X0 = Math.round((W - ROW_W) / 2);
const ROW_Y0 = 112;
const ROW_SCALE1 = 0.64;
const ROW_X1 = 10;
const ROW_Y1 = 170;
// ---- The stamp: centred first, left-aligned once the row has glided.
const STAMP_W = 760; // approximate, only to centre it
const STAMP_X0 = Math.round((W - STAMP_W) / 2);
// ---- The right column (stage coordinates): plate, title and the three chips.
const COL_X = 830;
const PLAQUE_TOP = 104;
const TITLE_TOP = 172;
const TITLE_SIZE = 88;
const CHIPS_TOP = 392;
const CHIP_H = 58;
const CHIP_GAP = 16;

/**
 * s01-hook «Ninguno lo ve todo». From the first frame the case stamp and three dim silhouettes wait in a row — a server,
 * an application window and a door onto the street — with their eyes shut. On `three` each eye opens and lays its cone
 * of light; on «puntos ciegos» (`blind`) the part each eye cannot reach darkens into a hatched shadow. Before 12 s
 * (`title`) the row glides left and «Qué ve cada método» lands on the right under the plate «SY0-701 · 4.3»; the promise
 * follows as three chips, each lit on the word that names its look («máquinas», «aplicaciones», «fuera») and lighting
 * its silhouette.
 */
export function S01Hook(props: SceneProps) {
  const frame = useCurrentFrame();
  const threeAt = props.cue('three');
  const blindAt = Math.max(props.cue('blind'), wordFrame(S, 's01-01', 'puntos') - 6);
  // Title before 12 s, whatever the voice does.
  const titleAt = Math.min(props.cue('title') - 6, 12 * 30 - 22);
  const chipAt = PROMISE.map((p, i) => {
    const at = wordFrame(S, 's01-02', p.word) - 6;
    return i === 0 ? Math.min(at, props.cue('promise') + 14) : at;
  });
  const lastWord = wordFrame(S, 's01-02', 'examen') - 4;

  const stampIn = enter(frame, -6, { distance: 16, duration: 16 });
  const rowIn = progress(frame, -4, 18);
  const glide = progress(frame, titleAt - 16, 30, EASE.inOut);
  const rowX = mix(ROW_X0, ROW_X1, glide);
  const rowY = mix(ROW_Y0, ROW_Y1, glide);
  const rowScale = mix(1, ROW_SCALE1, glide);
  const stampX = mix(STAMP_X0, 0, glide);

  // Chips: each lit while the voice is on it, stepping back as the next starts; after the last, all rest lit.
  const chipLive = PROMISE.map((_, i) => progress(frame, chipAt[i], 10) * (1 - progress(frame, (chipAt[i + 1] ?? lastWord) - 2, 12, EASE.inOut)));
  const chipOn = PROMISE.map((_, i) => progress(frame, chipAt[i], 10) * (1 - 0.4 * progress(frame, (chipAt[i + 1] ?? lastWord) - 2, 12, EASE.inOut)));
  const silLit = (k: number) => Math.max(0, ...PROMISE.map((p, i) => (p.sil === k ? chipLive[i] : 0)));
  // While the chips run, the silhouettes not being named step back a little.
  const chipsRunning = progress(frame, chipAt[0], 10) * (1 - progress(frame, lastWord - 2, 12, EASE.inOut));

  const titleIn = enter(frame, titleAt, { distance: 22, duration: 18 });
  const plaqueIn = enter(frame, titleAt - 4, { distance: 14, duration: 16 });

  return (
    <Stage>
      {/* Case stamp */}
      <div style={{ position: 'absolute', left: stampX, top: 0, ...stampIn }}>
        <CaseStamp what={STAMP.what} kind={STAMP.kind} />
      </div>

      {/* The three silhouettes */}
      <div
        style={{
          position: 'absolute',
          left: rowX,
          top: rowY,
          width: ROW_W,
          height: ROW_H,
          transformOrigin: '0 0',
          transform: `scale(${rowScale})`,
          opacity: rowIn,
        }}
      >
        {SILHOUETTES.map((kind, k) => {
          const at = threeAt + k * 10;
          const eye = progress(frame, at, 16);
          const blind = progress(frame, blindAt + k * 6, 16);
          const lit = Math.max(silLit(k), 0);
          const dim = (1 - eye) * 0.5 + chipsRunning * (1 - silLit(k)) * 0.5;
          return (
            <div key={kind} style={{ position: 'absolute', left: k * (SIL_W + SIL_GAP), top: 0 }}>
              <Silhouette kind={kind} width={SIL_W} eye={eye} blind={blind} lit={lit} dim={dim} tone={kind === 'door' ? C.amber : C.cyan} id={`s01-${k}`} />
            </div>
          );
        })}
      </div>

      {/* Plate, title and promise */}
      {frame >= titleAt - 6 ? (
        <div style={{ position: 'absolute', left: COL_X, top: PLAQUE_TOP, ...plaqueIn }}>
          <PlaqueChip text={PLAQUE} />
        </div>
      ) : null}
      {frame >= titleAt - 2 ? (
        <div style={{ position: 'absolute', left: COL_X, top: TITLE_TOP, fontFamily: FONT.sans, ...titleIn }}>
          {TITLE.map((l, k) => (
            <div
              key={k}
              style={{
                fontSize: TITLE_SIZE,
                fontWeight: 900,
                letterSpacing: -1.5,
                lineHeight: 1.04,
                color: k === 0 ? C.textStrong : C.cyan,
                whiteSpace: 'nowrap',
                textShadow: `0 0 30px ${alpha(C.cyan, 0.2)}`,
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
          <div key={p.text} style={{ position: 'absolute', left: COL_X, top: CHIPS_TOP + i * (CHIP_H + CHIP_GAP), ...e }}>
            <Pill icon={p.icon} text={p.text} on={chipOn[i]} tone={C.cyan} size={34} />
          </div>
        );
      })}
    </Stage>
  );
}

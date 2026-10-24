import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { mix } from '../../../engine/src/ui';
import { PLAQUE, PROMISE, STAMP, TITLE } from '../data/canon';
import { CHIP_H, CaseStamp, PlaqueChip, Pill } from './parts/Labels';
import { Ledger } from './parts/Ledger';
import { Stage, wordFrame } from './kit';

const S = 's01-hook';
/** Before the title: the notebook big and centred. After: smaller on the left, the title on the right. */
const BIG = { w: 700, x: (1728 - 700) / 2, y: 100 } as const;
const SMALL = { w: 600, x: 20, y: 150 } as const;
const TEXT_X = 700;
const TITLE_TOP = 64;
const TITLE_SIZE = 108;
const TITLE_LH = 1.04;
const PLAQUE_TOP = TITLE_TOP + 2 * TITLE_SIZE * TITLE_LH + 18;
const CHIPS_TOP = PLAQUE_TOP + 74;

/**
 * s01-hook «Un cuaderno que se va». The proposal stamp from the first frame and the lost-property notebook, faint (never
 * an empty stage), solid on `notebook`: four lost objects, handwriting nobody can read, no person, no date. On `screen`
 * a scan line turns it into a screen with the same four rows, tidy. Before 12 s the screen glides left, the title
 * «Antes, después y a tiempo» lands with «SY0-701 · 5.4», and on `promise` the three chips come in, each lit on its own
 * word (lanzarlo · funciona · guarda). It is a proposal: nothing says the system already works.
 */
export function S01Hook(props: SceneProps) {
  const frame = useCurrentFrame();
  const notebookAt = props.cue('notebook');
  const screenAt = props.cue('screen');
  const titleAt = Math.min(props.cue('title') - 6, 12 * 30 - 22);
  const promiseAt = Math.max(props.cue('promise') - 4, titleAt + 24);
  const chipAt = PROMISE.map((p) => Math.max(promiseAt - 6, wordFrame(S, 's01-02', p.word) - 8));

  const stampIn = enter(frame, -6, { distance: 16, duration: 16 });
  const bookIn = enter(frame, notebookAt - 4, { distance: 22, duration: 18 });
  const morph = progress(frame, screenAt - 2, 40, EASE.inOut);
  const glide = progress(frame, titleAt - 16, 30, EASE.inOut);
  const lw = mix(BIG.w, SMALL.w, glide);
  const lx = mix(BIG.x, SMALL.x, glide);
  const ly = mix(BIG.y, SMALL.y, glide);
  const glow = (0.35 + 0.4 * progress(frame, notebookAt, 14)) * (1 - 0.5 * progress(frame, titleAt, 20));

  const titleIn = enter(frame, titleAt, { distance: 22, duration: 18 });
  const plaqueIn = enter(frame, titleAt + 8, { distance: 14, duration: 16 });
  const last = PROMISE.length - 1;

  return (
    <Stage>
      <div style={{ position: 'absolute', left: 0, top: 0, ...stampIn }}>
        <CaseStamp parts={STAMP} />
      </div>

      {/* The notebook (faint from the first frame), then the screen */}
      <div style={{ position: 'absolute', left: lx, top: ly, opacity: 0.3 + 0.7 * bookIn.opacity, transform: bookIn.transform }}>
        <Ledger width={lw} morph={morph} glow={glow} />
      </div>

      {/* The title */}
      {frame >= titleAt - 2 ? (
        <div
          style={{
            position: 'absolute',
            left: TEXT_X,
            top: TITLE_TOP,
            fontFamily: FONT.sans,
            fontSize: TITLE_SIZE,
            fontWeight: 900,
            letterSpacing: -3,
            lineHeight: TITLE_LH,
            color: C.textStrong,
            whiteSpace: 'nowrap',
            textShadow: `0 0 30px ${alpha(C.cyan, 0.2)}`,
            ...titleIn,
          }}
        >
          <div>{TITLE[0]}</div>
          <div style={{ color: C.cyan }}>{TITLE[1]}</div>
        </div>
      ) : null}
      {frame >= titleAt ? (
        <div style={{ position: 'absolute', left: TEXT_X, top: PLAQUE_TOP, ...plaqueIn }}>
          <PlaqueChip text={PLAQUE} />
        </div>
      ) : null}

      {/* The promise: three chips, one per chapter */}
      {PROMISE.map((p, i) => {
        const at = chipAt[i];
        if (frame < at - 2) return null;
        const on = progress(frame, at, 10) * (1 - 0.45 * (i < last ? progress(frame, chipAt[i + 1], 10) : 0));
        return (
          <div key={p.text} style={{ position: 'absolute', left: TEXT_X, top: CHIPS_TOP + i * (CHIP_H + 14), ...enter(frame, at, { distance: 16 }) }}>
            <Pill text={p.text} tone={C.cyan} icon={p.icon} on={0.3 + 0.7 * on} size={40} height={CHIP_H} />
          </div>
        );
      })}
    </Stage>
  );
}

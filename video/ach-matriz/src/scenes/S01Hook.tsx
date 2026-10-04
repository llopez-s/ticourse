import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { Icon, mix } from '../../../engine/src/ui';
import { S01_CISO, S01_PROMISE, S01_TITLE } from '../data/s01-hook';
import { PromiseIcon } from './parts/PromiseIcons';
import { Whiteboard } from './parts/Whiteboard';
import { Stage, wordFrame } from './kit';

const S = 's01-hook';
const W = STAGE.width;

// The whiteboard: big while the voice reads it, centred under the title, then small on the left for the promise.
const BIG = { w: 1400, x: (W - 1400) / 2, y: 38 } as const;
const MID = { w: 1120, x: (W - 1120) / 2, y: 166 } as const;
const SMALL = { w: 720, x: 0, y: 236 } as const;

// Title: one line across the top of the stage once it lands.
const TITLE_TOP = 4;

// Right column (beside the small board): the promise rows, then the CISO card in their place.
const COL_X = 792;
const COL_W = W - COL_X;
const ROW_TOP = 176;
const ROW_STEP = 156;
const CISO = { top: 206, h: 384 } as const;

/**
 * s01-hook «Todo encaja». Meridian's analysis room: the whiteboard («Meridian Dynamics ·
 * reunión de análisis») fills the stage and already has its answer — «ESPIONAJE»,
 * circled, as the voice says «respuesta» — then the four evidence notes stick on
 * («Cuatro pruebas»), «encaja» is written by each one (never a tick, never a C) and «todo
 * encaja» under the circle. Right after «espionaje» the title lands across the top, before
 * 10 s («ACH: gana la hipótesis que no puedes tumbar», «análisis de hipótesis en
 * competencia» when the voice says it) and the board settles under it. For the promise
 * the board steps left and the three PromiseIcons light one per sentence on the right
 * (list with a question mark, grid, table). On `ciso` the CISO card takes their place —
 * «¿Qué busca el intruso?», then on `stakes` «de eso depende qué se protege primero» —
 * while ESPIONAJE glows on the board. Nobody is blamed: the room's first idea is normal.
 */
export function S01Hook(props: SceneProps) {
  const frame = useCurrentFrame();

  const room = props.cue('room');
  const titleCue = props.cue('title');
  const promise = props.cue('promise');
  const ciso = props.cue('ciso');
  const stakes = props.cue('stakes');

  // ---- Board beats, on the words of s01-01.
  const centreAt = Math.max(room, wordFrame(S, 's01-01', 'respuesta') - 6);
  const notesAt = wordFrame(S, 's01-01', 'Cuatro') - 4;
  const fitsAt = wordFrame(S, 's01-01', 'todas') - 2;
  const allFitAt = wordFrame(S, 's01-01', 'palabra') - 4;
  const spyWord = wordFrame(S, 's01-01', 'espionaje');

  // ---- Title: must be on screen before 10 s, so it follows the end of «espionaje» rather than waiting for its cue.
  const titleAt = Math.min(titleCue - 6, spyWord + 14);
  const toMid = progress(frame, titleAt - 12, 24, EASE.inOut);
  const toSmall = progress(frame, promise - 22, 22, EASE.inOut);
  const board = {
    w: mix(mix(BIG.w, MID.w, toMid), SMALL.w, toSmall),
    x: mix(mix(BIG.x, MID.x, toMid), SMALL.x, toSmall),
    y: mix(mix(BIG.y, MID.y, toMid), SMALL.y, toSmall),
  };
  const titleIn = progress(frame, titleAt, 16);
  const subAt = wordFrame(S, 's01-02', 'análisis') - 6;

  // ---- Promise: one icon per sentence of s01-03.
  const itemAt = S01_PROMISE.map((p) => wordFrame(S, 's01-03', p.word) - 6);
  const promiseOut = progress(frame, ciso - 14, 14, EASE.inOut);

  // ---- CISO strip.
  const cisoIn = progress(frame, ciso - 6, 16);
  const stakesIn = progress(frame, stakes - 4, 14);

  return (
    <Stage>
      <div style={{ position: 'absolute', left: board.x, top: board.y }}>
        <Whiteboard
          width={board.w}
          header
          centreAt={centreAt}
          notesAt={notesAt}
          fitsAt={fitsAt}
          allFitAt={allFitAt}
          focus={[
            { target: 'centre', from: spyWord - 2, to: titleAt + 18 },
            { target: 'centre', from: ciso + 6 },
          ]}
          glow={0.5 * progress(frame, ciso + 6, 16)}
          frame={frame}
        />
      </div>

      {/* Title: one line across the top */}
      {titleIn > 0 ? (
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: TITLE_TOP,
            width: W,
            textAlign: 'center',
            fontFamily: FONT.sans,
            opacity: titleIn,
            transform: `translateY(${(1 - titleIn) * 18}px)`,
          }}
        >
          <div style={{ fontSize: 62, fontWeight: 850, color: C.textStrong, letterSpacing: -1.2, lineHeight: 1.08, whiteSpace: 'nowrap' }}>
            <span style={{ color: C.cyan }}>{S01_TITLE.lead}</span> {S01_TITLE.rest}
          </div>
          <div style={{ marginTop: 10, fontSize: 36, fontWeight: 700, color: C.cyanSoft, whiteSpace: 'nowrap', ...enter(frame, subAt, { distance: 12 }) }}>{S01_TITLE.sub}</div>
        </div>
      ) : null}

      {/* Promise: the three icons, one row each, lit one at a time */}
      {frame >= itemAt[0] - 2 && promiseOut < 1 ? (
        <div style={{ position: 'absolute', left: COL_X, top: ROW_TOP, width: COL_W, opacity: 1 - promiseOut }}>
          {S01_PROMISE.map((p, i) => {
            const e = enter(frame, itemAt[i], { distance: 22, axis: 'x' });
            const next = itemAt[i + 1] ?? ciso;
            const lit = progress(frame, itemAt[i], 10) * (1 - 0.6 * progress(frame, next - 2, 12, EASE.inOut));
            const draw = progress(frame, itemAt[i], 24, EASE.inOut);
            return (
              <div key={p.kind} style={{ position: 'absolute', left: 0, top: i * ROW_STEP, display: 'flex', alignItems: 'center', gap: 26, ...e, opacity: e.opacity * (0.55 + 0.45 * lit) }}>
                <div
                  style={{
                    flexShrink: 0,
                    width: 128,
                    height: 128,
                    borderRadius: 64,
                    display: 'grid',
                    placeItems: 'center',
                    background: alpha(C.cyan, 0.06 + 0.1 * lit),
                    border: `3px solid ${alpha(C.cyan, 0.35 + 0.55 * lit)}`,
                    boxShadow: lit > 0.05 ? `0 0 ${Math.round(30 * lit)}px ${alpha(C.cyan, 0.35 * lit)}` : undefined,
                  }}
                >
                  <PromiseIcon kind={p.kind} size={88} draw={draw} />
                </div>
                <div style={{ fontFamily: FONT.sans, fontSize: 42, fontWeight: 750, lineHeight: 1.12, color: C.textStrong, whiteSpace: 'nowrap' }}>
                  {p.text}
                </div>
              </div>
            );
          })}
        </div>
      ) : null}

      {/* The CISO card, in the promise's place */}
      {cisoIn > 0 ? (
        <div
          style={{
            position: 'absolute',
            left: COL_X,
            top: CISO.top,
            width: COL_W,
            height: CISO.h,
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: 26,
            padding: '0 44px',
            borderRadius: RADIUS.lg,
            border: `2px solid ${alpha(C.cyan, 0.6)}`,
            background: `linear-gradient(180deg, ${alpha(C.cyan, 0.12)} 0%, ${alpha(C.ink900, 0.96)} 55%)`,
            boxShadow: `0 24px 60px ${alpha('#000000', 0.45)}`,
            fontFamily: FONT.sans,
            whiteSpace: 'nowrap',
            opacity: cisoIn,
            transform: `translateY(${(1 - cisoIn) * 22}px)`,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{ width: 96, height: 96, borderRadius: 48, display: 'grid', placeItems: 'center', background: alpha(C.cyan, 0.12), border: `3px solid ${alpha(C.cyan, 0.7)}` }}>
              <Icon name="user" size={56} color={C.cyan} strokeWidth={2} />
            </div>
            <span style={{ fontSize: 40, fontWeight: 850, letterSpacing: 5, color: C.cyanSoft }}>{S01_CISO.who}</span>
          </div>
          <span style={{ fontSize: 66, fontWeight: 850, color: C.textStrong, letterSpacing: -1, lineHeight: 1 }}>{S01_CISO.question}</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 14, fontSize: 38, fontWeight: 750, color: C.cyanSoft, lineHeight: 1.1, ...enter(frame, stakes - 4, { distance: 14 }), opacity: stakesIn }}>
            <Icon name="shield" size={40} color={C.cyan} />
            {S01_CISO.stakes}
          </span>
        </div>
      ) : null}
    </Stage>
  );
}

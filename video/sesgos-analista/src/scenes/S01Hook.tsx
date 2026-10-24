import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress, springIn } from '../../../engine/src/theme/motion';
import { mix } from '../../../engine/src/ui';
import { Head } from './parts/Head';
import { NameBars, ThoughtBubble, Trail } from './parts/Bubbles';
import { CISO_QUESTION, CisoStrip } from './parts/CisoStrip';
import { Stage, wordFrame } from './kit';

const S = 's01-hook';
const W = STAGE.width;

const TITLE = { lead: 'El instrumento de medida', rest: 'eres tú', sub: 'cuatro atajos de la cabeza y cómo frenarlos' } as const;
/** The promise, in the order the voice says it; each chip lights on its first word. */
const PROMISE = [
  { text: 'cuatro atajos', word: 'cuatro' },
  { text: 'cómo se cuelan en el análisis', word: 'cómo' },
  { text: 'qué hacer', word: 'qué' },
] as const;

/**
 * Today's picture, left to right: the CISO's card, the bubble that already has the answer, the head that
 * thinks it. The head group is 386 px tall (head, then its label); it is centred on the stage until the
 * title lands and then drops under it, at the same size.
 */
const CISO = { x: 30, w: 760, size: 50, h: 236, label: 62 } as const;
const HEAD = { x: 1440, w: 270, labelGap: 14, labelH: 48 } as const;
const HEAD_H = Math.round((360 * HEAD.w) / 300);
const GROUP_H = HEAD_H + HEAD.labelGap + HEAD.labelH;
const BUBBLE = { x: 832, w: 570, top: 36 } as const;
const GROUP_A = Math.round((660 - GROUP_H) / 2);
const GROUP_B = 238;

/**
 * s01-hook «Una respuesta antes de tiempo». From the first frame «Meridian Dynamics · aeroespacial» and, on
 * the right, a head in profile labelled «tu cabeza · ejemplo» (not the campaign's analyst), dim.
 *   ciso     the CISO's card enters on the left: «CISO · responsable de seguridad» — «¿Quién está detrás?».
 *            A question, not a decision: cyan, the defender's side, no verdict colour.
 *   hunch    a bubble pops over the head (ping): «ya sé quién fue» and the name behind bars, unreadable —
 *            no country, no group, no flag, no map, no language, no time
 *   title    (before 12 s) «El instrumento de medida eres tú» lands across the top with «cuatro atajos de la
 *            cabeza y cómo frenarlos» under it; both halves of the picture drop and step back
 *   promise  three chips, each lit on its words: cuatro atajos · cómo se cuelan en el análisis · qué hacer
 * No date, no time.
 */
export function S01Hook(props: SceneProps) {
  const frame = useCurrentFrame();
  const cisoAt = props.cue('ciso');
  const hunchAt = props.cue('hunch');
  const promiseAt = props.cue('promise');
  // Title before 12 s, whatever the voice does.
  const titleAt = Math.min(props.cue('title') - 6, 12 * 30 - 22);
  const w1 = (word: string, nth = 0) => wordFrame(S, 's01-01', word, nth);

  // ---- The head is there from the start, a little dim until it has something to think.
  const headIn = enter(frame, -12, { distance: 16, duration: 20 });
  const orgIn = enter(frame, -14, { distance: 12, duration: 18 });

  // ---- The CISO.
  const cisoIn = enter(frame, cisoAt - 6, { distance: 30, duration: 18, axis: 'x' });
  const cisoGlow = progress(frame, cisoAt, 12) * (1 - progress(frame, titleAt + 4, 22, EASE.inOut));
  const cisoDim = 0.25 * progress(frame, promiseAt - 6, 20, EASE.inOut);

  // ---- The hunch: the bubble pops on `hunch`, the name is covered on «respuesta».
  const hunch = springIn(frame, 30, hunchAt - 4, { damping: 16 });
  const headGlow = progress(frame, hunchAt - 2, 12) * (1 - progress(frame, hunchAt + 50, 40, EASE.inOut) * 0.6);
  const textIn = progress(frame, hunchAt + 2, 12);
  const barsIn = progress(frame, w1('respuesta') - 4, 20);
  const headDim = 0.45 * (1 - progress(frame, hunchAt - 6, 16));

  // ---- Title and promise; both halves of the picture drop and step back.
  const titleIn = enter(frame, titleAt, { distance: 22, duration: 18 });
  const subIn = enter(frame, titleAt + 10, { distance: 12, duration: 16 });
  const drop = progress(frame, titleAt - 10, 26, EASE.inOut);
  const groupY = mix(GROUP_A, GROUP_B, drop);
  const cisoY = groupY + (GROUP_H - CISO.h) / 2 + 14;
  const chipAt = PROMISE.map((p) => wordFrame(S, 's01-02', p.word) - 6);
  const allLit = progress(frame, chipAt[2] + 44, 16, EASE.inOut);

  return (
    <Stage>
      {/* The company, above the CISO's card */}
      <div style={{ position: 'absolute', left: CISO.x, top: cisoY - CISO.label, fontFamily: FONT.sans, whiteSpace: 'nowrap', ...orgIn }}>
        <span style={{ fontSize: 38, fontWeight: 850, color: C.textStrong }}>Meridian Dynamics</span>
        <span style={{ fontSize: 38, fontWeight: 600, color: C.faint }}> · </span>
        <span style={{ fontSize: 38, fontWeight: 700, color: C.text }}>aeroespacial</span>
      </div>

      {/* The CISO: «¿Quién está detrás?» */}
      {frame >= cisoAt - 8 ? (
        <div style={{ position: 'absolute', left: CISO.x, top: cisoY, ...cisoIn }}>
          <CisoStrip width={CISO.w} question={CISO_QUESTION} questionSize={CISO.size} glow={cisoGlow} dim={cisoDim} />
        </div>
      ) : null}

      {/* Your head and the answer it already has */}
      <div style={{ position: 'absolute', left: 0, top: groupY, width: W, height: GROUP_H, ...headIn }}>
        {hunch > 0.01 ? (
          <div style={{ position: 'absolute', left: BUBBLE.x, top: BUBBLE.top }}>
            <ThoughtBubble width={BUBBLE.w} pop={hunch} glow={headGlow} tone="cyan" origin="100% 60%">
              <div style={{ fontSize: 52, fontWeight: 850, letterSpacing: -0.8, color: C.textStrong, whiteSpace: 'nowrap', opacity: textIn }}>ya sé quién fue</div>
              <div style={{ marginTop: 14, opacity: textIn }}>
                <NameBars widths={[200, 130]} height={34} sweep={barsIn} />
              </div>
            </ThoughtBubble>
            <div style={{ position: 'absolute', left: BUBBLE.w, top: 74 }}>
              <Trail dir="right" opacity={hunch} />
            </div>
          </div>
        ) : null}
        <div style={{ position: 'absolute', left: HEAD.x, top: 0 }}>
          <Head width={HEAD.w} glow={headGlow} dim={headDim} />
        </div>
        <div style={{ position: 'absolute', left: HEAD.x - 30, top: HEAD_H + HEAD.labelGap, width: HEAD.w + 60, display: 'flex', justifyContent: 'center' }}>
          <span
            style={{
              padding: '6px 22px',
              borderRadius: RADIUS.pill,
              border: `2px solid ${alpha(C.muted, 0.5)}`,
              background: alpha(C.ink900, 0.7),
              fontFamily: FONT.sans,
              fontSize: 30,
              fontWeight: 650,
              color: C.text,
              whiteSpace: 'nowrap',
            }}
          >
            tu cabeza · ejemplo
          </span>
        </div>
      </div>

      {/* Title, subtitle and the promise */}
      {frame >= titleAt - 2 ? (
        <div style={{ position: 'absolute', left: 0, top: 0, width: W, fontFamily: FONT.sans, textAlign: 'center' }}>
          <div style={{ fontSize: 80, fontWeight: 900, letterSpacing: -1.6, lineHeight: 1, whiteSpace: 'nowrap', ...titleIn }}>
            <span style={{ color: C.textStrong }}>{TITLE.lead}</span>
            <span style={{ color: C.cyan, textShadow: `0 0 34px ${alpha(C.cyan, 0.28)}` }}> {TITLE.rest}</span>
          </div>
          <div style={{ position: 'absolute', left: 0, top: 92, width: W, fontSize: 38, fontWeight: 700, lineHeight: 1.1, color: C.cyanSoft, whiteSpace: 'nowrap', ...subIn }}>{TITLE.sub}</div>
          <div style={{ position: 'absolute', left: 0, top: 152, width: W, display: 'flex', justifyContent: 'center', gap: 20 }}>
            {PROMISE.map((p, i) => {
              const e = enter(frame, chipAt[i], { distance: 16 });
              const on = Math.max(allLit, progress(frame, chipAt[i], 10) * (1 - 0.55 * progress(frame, (chipAt[i + 1] ?? chipAt[i] + 400) - 2, 12, EASE.inOut)));
              return (
                <div
                  key={p.text}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    height: 58,
                    padding: '0 28px',
                    boxSizing: 'border-box',
                    borderRadius: RADIUS.pill,
                    border: `2px solid ${alpha(C.cyan, 0.4 + 0.5 * on)}`,
                    background: alpha(C.cyan, 0.06 + 0.12 * on),
                    boxShadow: on > 0.02 ? `0 0 ${Math.round(22 * on)}px ${alpha(C.cyan, 0.3 * on)}` : undefined,
                    fontSize: 34,
                    fontWeight: 750,
                    color: alpha(C.textStrong, 0.6 + 0.4 * on),
                    whiteSpace: 'nowrap',
                    ...e,
                  }}
                >
                  {p.text}
                </div>
              );
            })}
          </div>
        </div>
      ) : null}
    </Stage>
  );
}

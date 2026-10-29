import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { mix } from '../../../engine/src/ui';
import { PROMISE } from '../data/s01-hook';
import { TITLE } from '../data/shared';
import { ContextStrip, Desk } from './parts/Desk';
import { DraftSheet } from './parts/Paper';
import { RedPen } from './parts/Pen';
import { Stage, wordFrame } from './kit';

const S = 's01-hook';

/** The group (sheet + pen) is centred until the title lands, then slides left to make room for the text. */
const SHEET = { x0: 464, y: 40, w: 620 } as const;
const SLIDE = -394;
const PEN = { dx: 86, y: 492, angle: -72 } as const;
const COL = { x: 930, w: 760 } as const;

/**
 * s01-hook «Un borrador con pruebas buenas». From the first frame: the analyst's desk seen from above, the label
 * «Meridian Dynamics · aeroespacial · tú, su analista de inteligencia» and, to the right of where the sheet will be, a
 * red pen with its cap on, unused. No date, no hour, no alert, no person.
 *   draft     the draft report slides in: four numbered rows and «conclusión», all bars (the notice is on it)
 *   evidence  a green tick on each of the three pruebas, one by one (sfx «check» on the first); «parecen en orden»
 *   title     (before 12 s) the group slides left; «Falacias lógicas en CTI» and «el paso que no se sostiene» land on
 *             the right. On «paso» a small «?» appears on row 4, the step with no tick
 *   promise   three chips fill their waiting slots, each on its words
 */
export function S01Hook(props: SceneProps) {
  const frame = useCurrentFrame();
  const draftAt = props.cue('draft');
  const evidenceAt = props.cue('evidence');
  const promiseAt = props.cue('promise');
  // Title before 12 s, whatever the voice does.
  const titleAt = Math.min(props.cue('title') - 6, 12 * 30 - 22);
  const w1 = (word: string, nth = 0) => wordFrame(S, 's01-01', word, nth);
  const w2 = (word: string, nth = 0) => wordFrame(S, 's01-02', word, nth);
  const w3 = (word: string, nth = 0) => wordFrame(S, 's01-03', word, nth);

  const deskIn = enter(frame, -20, { distance: 0, duration: 20 });
  const penIn = enter(frame, -14, { distance: 20, duration: 20 });
  const sheetIn = progress(frame, draftAt - 6, 22, EASE.out);

  // Ticks: the first exactly on `evidence` (the sound), the others on the next words; then the pill.
  const tickAt = [evidenceAt, w1('que') - 2, w1('cita') - 2];
  const checks = tickAt.map((t) => progress(frame, t, 14));
  const pill = progress(frame, Math.max(w1('parecen') - 4, tickAt[2] + 12), 16);
  const q = progress(frame, w2('paso') - 4, 14);

  // The slide and the title block.
  const move = progress(frame, titleAt - 8, 32, EASE.inOut);
  const dx = mix(0, SLIDE, move);
  const titleIn = enter(frame, titleAt, { distance: 22, duration: 18 });
  const subIn = enter(frame, titleAt + 10, { distance: 14, duration: 16 });
  const slotIn = enter(frame, titleAt + 22, { distance: 12, duration: 16 });
  const chipAt = PROMISE.map((p) => Math.max(promiseAt - 4, w3(p.word) - 10));
  const lit = chipAt.map((t) => progress(frame, t, 12));
  const sheetLeft = SHEET.x0 + dx;

  return (
    <Stage>
      <Desk opacity={deskIn.opacity} />
      <ContextStrip top={598} opacity={deskIn.opacity} lit={0.2 * (1 - move)} />

      {/* The red pen, cap on, unused, to the right of the sheet */}
      <div style={{ opacity: penIn.opacity, transform: penIn.transform }}>
        <RedPen x={sheetLeft + SHEET.w + PEN.dx} y={PEN.y} angle={PEN.angle} capped />
      </div>

      {/* The draft */}
      {sheetIn > 0.01 ? (
        <div style={{ position: 'absolute', left: sheetLeft, top: SHEET.y, opacity: Math.min(1, sheetIn * 1.6), transform: `translateY(${(1 - sheetIn) * -70}px) rotate(${(1 - sheetIn) * -3}deg)`, transformOrigin: '0 0' }}>
          <DraftSheet checks={checks} pill={pill} q={q} glow={0.15 * checks[2]} />
        </div>
      ) : null}

      {/* Title, subtitle and the promise */}
      {frame >= titleAt - 2 ? (
        <div style={{ position: 'absolute', left: COL.x, top: 18, width: COL.w, fontFamily: FONT.sans }}>
          <div style={{ fontSize: 80, fontWeight: 900, letterSpacing: -1.8, lineHeight: 1.02, whiteSpace: 'nowrap', ...titleIn }}>
            <div style={{ color: C.textStrong }}>{TITLE.lead}</div>
            <div style={{ color: C.cyan, textShadow: `0 0 34px ${alpha(C.cyan, 0.28)}` }}>{TITLE.rest}</div>
          </div>
          <div style={{ marginTop: 16, fontSize: 44, fontWeight: 750, lineHeight: 1.1, color: C.cyanSoft, whiteSpace: 'nowrap', ...subIn }}>{TITLE.sub}</div>
          <div style={{ marginTop: 40, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 18, opacity: slotIn.opacity, transform: slotIn.transform }}>
            {PROMISE.map((p, i) => (
              <div
                key={p.text}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  height: 70,
                  padding: '0 32px',
                  boxSizing: 'border-box',
                  borderRadius: RADIUS.pill,
                  border: `2.5px ${lit[i] > 0.3 ? 'solid' : 'dashed'} ${alpha(C.cyan, 0.3 + 0.6 * lit[i])}`,
                  background: alpha(C.cyan, 0.04 + 0.12 * lit[i]),
                  boxShadow: lit[i] > 0.02 ? `0 0 ${Math.round(22 * lit[i])}px ${alpha(C.cyan, 0.28 * lit[i])}` : undefined,
                  fontSize: 38,
                  fontWeight: 750,
                  color: C.textStrong,
                  whiteSpace: 'nowrap',
                }}
              >
                <span style={{ opacity: lit[i], transform: `translateX(${(1 - lit[i]) * 10}px)` }}>{p.text}</span>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </Stage>
  );
}

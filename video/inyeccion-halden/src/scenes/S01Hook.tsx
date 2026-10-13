import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { Icon } from '../../../engine/src/ui';
import { APP, DATE, PROMISE, SCREENS, TITLE } from '../data/s01-hook';
import { Pill } from './parts/bits';
import { ThreeScreens } from './parts/Login';
import { Stage } from './kit';

const W = STAGE.width;
const SCREENS_TOP = 240;

/**
 * s01-hook «Tres cajas de texto». `date` brings the strip «05-11 · jueves · 10:00 · revisión antes de publicar» and `app`
 * the label of the test copy, «Citas de camiones · entorno de pruebas · datos ficticios», with the three small screens
 * of the copy fading in at half light under it (login, appointment search, notes for the gate staff). On `boxes` the
 * box of each screen lights in turn. After the two sentences about the whole assignment, `title` takes the top of the
 * stage (the strip and the label step aside) and `promise` follows as three chips, one per box; then the three boxes
 * light together and the chips with them.
 */
export function S01Hook(props: SceneProps) {
  const frame = useCurrentFrame();
  const dateAt = props.cue('date');
  const appAt = props.cue('app');
  const boxesAt = props.cue('boxes');
  const titleAt = Math.min(props.cue('title') - 6, 12 * 30 - 24);
  const promiseAt = props.cue('promise');

  // ---- strip and label, until the title takes their place
  const gone = progress(frame, titleAt - 4, 14, EASE.inOut);
  const dateIn = enter(frame, dateAt - 4, { distance: 18 });
  const appIn = enter(frame, appAt - 4, { distance: 18 });

  // ---- the three screens: half light from `app`, boxes light in turn from `boxes`, all together at the end
  const show = [0, 1, 2].map((i) => progress(frame, appAt + i * 7, 16));
  const own = [0, 1, 2].map((i) => progress(frame, boxesAt - 2 + i * 14, 12));
  const together = progress(frame, promiseAt + 26, 14);
  const lit = own.map((o) => Math.max(0.65 * o, together));
  const dim = 0.7 * (1 - progress(frame, boxesAt - 6, 20));

  // ---- title and chips
  const titleIn = enter(frame, titleAt, { distance: 22, duration: 18 });
  const chipAt = PROMISE.map((_, i) => promiseAt - 4 + i * 9);

  return (
    <Stage>
      {/* The strip and the label of the copy */}
      {gone < 1 ? (
        <div style={{ position: 'absolute', left: 0, top: 0, width: W, opacity: 1 - gone, transform: `translateY(${-14 * gone}px)`, fontFamily: FONT.sans }}>
          <div style={{ display: 'flex', justifyContent: 'center', ...dateIn }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 16,
                height: 70,
                padding: '0 32px 0 22px',
                boxSizing: 'border-box',
                borderRadius: RADIUS.md,
                border: `2px solid ${alpha(C.cyan, 0.7)}`,
                background: alpha(C.cyan, 0.1),
                fontSize: 40,
                whiteSpace: 'nowrap',
              }}
            >
              <Icon name="clock" size={40} color={C.cyan} />
              <span style={{ fontFamily: FONT.mono, fontWeight: 800, color: C.cyanSoft }}>{DATE.day}</span>
              <Dot />
              <span style={{ fontWeight: 700, color: C.text }}>{DATE.weekday}</span>
              <Dot />
              <span style={{ fontFamily: FONT.mono, fontWeight: 700, color: C.text }}>{DATE.time}</span>
              <Dot />
              <span style={{ fontWeight: 800, color: C.textStrong }}>{DATE.what}</span>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20, ...appIn }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 14, fontSize: 38, whiteSpace: 'nowrap' }}>
              <Icon name="globe" size={40} color={C.muted} />
              <span style={{ fontWeight: 800, color: C.textStrong }}>{APP.name}</span>
              <span style={{ fontWeight: 600, color: C.muted }}>· {APP.rest}</span>
            </div>
          </div>
        </div>
      ) : null}

      {/* Title and the promise */}
      {frame >= titleAt - 2 ? (
        <div style={{ position: 'absolute', left: 0, top: 0, width: W, textAlign: 'center', fontFamily: FONT.sans, ...titleIn }}>
          <div style={{ fontSize: 76, fontWeight: 850, letterSpacing: -1.5, lineHeight: 1.08, color: C.textStrong, whiteSpace: 'nowrap' }}>
            {TITLE.before}
            <span style={{ color: C.cyan }}>{TITLE.hot}</span>
            {TITLE.after}
          </div>
        </div>
      ) : null}
      {frame >= chipAt[0] - 2 ? (
        <div style={{ position: 'absolute', left: 0, top: 108, width: W, display: 'flex', justifyContent: 'center', gap: 24 }}>
          {PROMISE.map((p, i) => {
            const e = progress(frame, chipAt[i], 14);
            const glow = Math.max(lit[i] - 0.65, 0) / 0.35;
            return (
              <Pill key={p.text} icon={p.icon} show={e} size={38} tone={C.cyan} style={{ background: alpha(C.cyan, 0.1 + 0.16 * glow), boxShadow: glow > 0.02 ? `0 0 ${Math.round(26 * glow)}px ${alpha(C.cyan, 0.4 * glow)}` : undefined }}>
                {p.text}
              </Pill>
            );
          })}
        </div>
      ) : null}

      {/* The three screens of the copy */}
      <div style={{ position: 'absolute', left: 0, top: SCREENS_TOP }}>
        <ThreeScreens screens={SCREENS} show={show} lit={lit} dim={dim} />
      </div>
    </Stage>
  );
}

function Dot() {
  return <span style={{ fontWeight: 700, color: C.faint }}>·</span>;
}

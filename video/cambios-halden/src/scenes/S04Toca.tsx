import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { RESTART_CHIPS } from '../data/canon';
import { Pill, TermPill } from './parts/Labels';
import { RequestSheet } from './parts/Request';
import { ServiceHub } from './parts/Service';
import { SiteList } from './parts/SiteList';
import { AllowCard } from './parts/s04/AllowCard';
import { Stage, wordFrame } from './kit';

const S = 's04-toca';
const SHEET_W = 400;
const MAIN_X = 450;
const MAIN_W = 1728 - MAIN_X;
const ASK_TOP = 444;
const ALLOW_X = 0;
const SITE_X = 610;
const SITE_W = 900;
const CHIPS_TOP = 540;

/**
 * s04-toca «¿Quién más lo usa?». The request comes back on the left (ticked and signed). On `service` the shared folders
 * of the offices stand in a box (no host or product); on `hangs` two office programs hang from it, on `old-program` an
 * old program in amber «solo entiende la versión anterior», noted «para decidir qué hacer con él». On `ask` «lo que sale
 * al preguntar, no al fallar» with «dependencies» on its word. On `list` the diagram gives way to the request's step
 * «dar de alta el servidor nuevo en la lista de permitidos» («allow list»); on `site-list` the site list comes in
 * («imagen · no es del puerto»): the trusted person who is not on it is stopped, today's plumber is put on it — not
 * his firm — and walks in. On `one-line` the single line «el servidor nuevo» is typed. On `chips` the five silent chips.
 */
export function S04Toca(props: SceneProps) {
  const frame = useCurrentFrame();
  const serviceAt = props.cue('service');
  const hangsAt = props.cue('hangs');
  const oldAt = props.cue('old-program');
  const askAt = props.cue('ask');
  const listAt = props.cue('list');
  const siteAt = props.cue('site-list');
  const oneAt = props.cue('one-line');
  const chipsAt = props.cue('chips');
  const noteAt = wordFrame(S, 's04-02', 'anota') - 6;
  const depAt = wordFrame(S, 's04-03', 'dependencies') - 6;
  const allowAt = wordFrame(S, 's04-04', 'allow') - 6;
  const figuraAt = wordFrame(S, 's04-05', 'figura') - 8;
  const pasaAt = wordFrame(S, 's04-05', 'pasa') - 6;
  const plumberAt = wordFrame(S, 's04-06', 'fontanero') - 8;
  const empresaAt = wordFrame(S, 's04-06', 'empresa') - 6;

  const sheetGlow = progress(frame, 0, 12) * (1 - progress(frame, serviceAt, 16));
  const hubOut = progress(frame, listAt - 6, 16, EASE.inOut);
  const askIn = progress(frame, askAt - 2, 14) * (1 - hubOut);
  const dim = 1 - 0.55 * progress(frame, chipsAt - 2, 14);
  const sheetIn = enter(frame, -4, { distance: 16 });

  return (
    <Stage>
      <div style={{ position: 'absolute', left: 0, top: 0, ...sheetIn, opacity: sheetIn.opacity * (1 - progress(frame, listAt - 8, 12)) }}>
        <RequestSheet width={SHEET_W} owner={1} checks={[1, 1, 1]} stamp="cab" glow={sheetGlow} />
      </div>

      {hubOut < 1 ? (
        <div style={{ position: 'absolute', left: MAIN_X, top: 0, opacity: 1 - hubOut }}>
          <ServiceHub
            width={MAIN_W}
            service={progress(frame, serviceAt - 2, 16)}
            hangs={progress(frame, hangsAt - 2, 18)}
            old={progress(frame, oldAt - 2, 18)}
            note={progress(frame, noteAt, 14)}
            oldGlow={progress(frame, oldAt, 12) * (1 - progress(frame, askAt, 14))}
          />
        </div>
      ) : null}
      {askIn > 0.01 ? (
        <div style={{ position: 'absolute', left: MAIN_X, top: ASK_TOP, display: 'flex', alignItems: 'center', gap: 18, opacity: askIn, transform: `translateY(${(1 - askIn) * 12}px)` }}>
          <Pill text="lo que sale al preguntar, no al fallar" tone={C.cyan} icon="search" size={34} height={60} />
          {frame >= depAt - 2 ? (
            <div style={enter(frame, depAt, { distance: 12 })}>
              <TermPill text="dependencies" size={34} />
            </div>
          ) : null}
        </div>
      ) : null}

      {frame >= listAt - 6 ? (
        <div style={{ position: 'absolute', left: ALLOW_X, top: 0, opacity: dim }}>
          <AllowCard show={progress(frame, listAt, 16)} term={progress(frame, allowAt, 12)} typed={progress(frame, oneAt, 30, EASE.linear)} />
        </div>
      ) : null}

      {frame >= siteAt - 6 ? (
        <div style={{ position: 'absolute', left: SITE_X, top: 0, opacity: dim * progress(frame, siteAt - 4, 16) }}>
          <SiteList
            width={SITE_W}
            base={1}
            trusted={progress(frame, figuraAt, 14)}
            blocked={progress(frame, pasaAt, 12)}
            plumber={progress(frame, plumberAt, 14)}
            walk={progress(frame, empresaAt + 10, 40, EASE.inOut)}
            firm={progress(frame, empresaAt, 12)}
          />
        </div>
      ) : null}

      {RESTART_CHIPS.map((row, r) => (
        <div key={r} style={{ position: 'absolute', left: 0, top: CHIPS_TOP + r * 62, width: 1728, display: 'flex', justifyContent: 'center', gap: 12 }}>
          {row.map((c, i) => {
            const at = chipsAt + (r * 3 + i) * 4;
            if (frame < at - 2) return null;
            return (
              <div key={c} style={enter(frame, at, { distance: 12 })}>
                <TermPill text={c} size={26} />
              </div>
            );
          })}
        </div>
      ))}
    </Stage>
  );
}

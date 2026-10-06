import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, STAGE, TYPE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { Chip, clamp01, windowWeight } from '../../../engine/src/ui';
import { CHIPS, FRAME_WORDS, NAME } from '../data/s02-pelicula';
import { BUILD_STEPS_THREAD, BuildOrder, buildOrderLayout } from './parts/BuildOrder';
import { FILM_W, FilmLabel, FilmRail, MERIDIAN_FRAMES, VICTIMS, type FilmFrame, type PhaseId } from './parts/FilmRail';
import { Stage, segment, wordFrame } from './kit';

const S = 's02-pelicula';
const W = STAGE.width;

const RAIL_Y = 60;
const BOTTOM_Y = 588;
const BO_SIZE = TYPE.label;
const BO = buildOrderLayout(BUILD_STEPS_THREAD, BO_SIZE);

/**
 * s02-pelicula «La película de Meridian». The V3 rail draws itself (`rail`), Weaponization dashed and Recon empty
 * as V13 left them; on «por fecha y por fase» (`frames`) a light runs over the phase names. Meridian's photos then
 * drop one by one into their slots on the words that tell them (Delivery on «correo», Exploitation on «Se abre»,
 * Installation on «instala», the first call on «llama»; E7 on «alerta», beside it in C2; E9 on «E9», whose line
 * lights on «Comprime»), each lifted while the voice is on it. They hang a little crooked until `order`, when they
 * straighten and their dates are read left to right. `thread`: the rose string runs over them and the rail turns
 * rose. `film`: the strip forms, and ACTIVITY THREAD lands on «activity». Chips «una intrusión · una víctima · en
 * orden de tiempo y de fase» on their words; `wrap-i`: the build order, half built, «eventos · hilo».
 */
export function S02Pelicula(props: SceneProps) {
  const frame = useCurrentFrame();
  const framesCue = props.cue('frames');
  const orderAt = props.cue('order');
  const threadAt = props.cue('thread');
  const filmAt = props.cue('film');
  const wrapAt = props.cue('wrap-i');
  const s05 = segment(props, 's02-05');

  // ---- Rail from the first frame (no empty stage during the transition).
  const rail = progress(frame, 0, 46, EASE.inOut);
  const label = enter(frame, 4, { distance: 14, duration: 18 });

  // ---- «por fecha y por fase»: a light sweeps over the names (left to right).
  const sweepAt = Math.max(framesCue, wordFrame(S, 's02-02', 'fase') - 14);
  const sweep = progress(frame, sweepAt, 34, EASE.inOut);

  // ---- Frames: each drops on its word (kept in order, at least 10 frames apart).
  const at: number[] = [];
  FRAME_WORDS.forEach(([, seg, word], i) => {
    const w = wordFrame(S, seg, word) - 6;
    at.push(Math.max(i === 0 ? framesCue : at[i - 1] + 10, w));
  });
  const focusEnd = orderAt - 4;
  const e9LineAt = Math.max(at[5] + 12, wordFrame(S, 's02-05', 'Comprime') - 4);
  const aooLitAt = Math.max(at[5] + 6, wordFrame(S, 's02-05', 'última') - 4);

  const loose = 1 - progress(frame, orderAt, 24, EASE.inOut);
  const dateSweep = progress(frame, orderAt + 10, 70, EASE.inOut);

  const frames: FilmFrame[] = MERIDIAN_FRAMES.map((f, i) => {
    const show = progress(frame, at[i], 18, EASE.out);
    const next = i < at.length - 1 ? at[i + 1] : focusEnd;
    const focus = windowWeight(frame, at[i], i === 5 ? Math.min(focusEnd, s05.to) : next, { ramp: 10, lead: 0 });
    // Dates are read left to right on `order`.
    const di = i / (MERIDIAN_FRAMES.length - 1);
    const dateHot = clamp01(dateSweep * 1.35 - di * 0.35) * (1 - progress(frame, threadAt - 6, 14));
    const lineHot = i === 5 ? windowWeight(frame, e9LineAt, s05.to, { ramp: 10, lead: 0 }) : 0;
    return { ...f, show, focus, dateHot, lineHot };
  });

  const thread = progress(frame, threadAt, 44, EASE.inOut);
  const film = progress(frame, filmAt, 30, EASE.inOut);
  // Actions on Objectives lights on «última», while the voice is on E9.
  const lit: Partial<Record<PhaseId, number>> = {
    actions: windowWeight(frame, aooLitAt, orderAt, { ramp: 12, lead: 0 }),
  };

  // ---- ACTIVITY THREAD on «activity».
  const nameAt = Math.max(filmAt + 14, wordFrame(S, 's02-07', 'activity') - 6);
  const name = enter(frame, nameAt, { distance: 20, duration: 18 });

  // ---- Chips on their words.
  const chipAt = CHIPS.map((c, i) => Math.max(nameAt + 6 + i * 6, wordFrame(S, c.seg, c.word) - 6));

  // ---- Build order on `wrap-i`: «eventos» on «eventos», «hilo» on «hilo».
  const eventosAt = Math.max(wrapAt, wordFrame(S, 's02-09', 'eventos') - 6);
  const hiloAt = Math.max(eventosAt + 8, wordFrame(S, 's02-09', 'hilo') - 6);
  const completeAt = Math.max(hiloAt + 8, wordFrame(S, 's02-09', 'completo') - 4);
  const complete = windowWeight(frame, completeAt, Number.POSITIVE_INFINITY, { ramp: 16, lead: 0 });

  return (
    <Stage>
      {/* ---- Meridian's label and, on «activity», the name */}
      <div style={{ position: 'absolute', left: 0, top: 8, ...label }}>
        <FilmLabel name={VICTIMS.meridian.name} tone={VICTIMS.meridian.tone} />
      </div>
      <div
        style={{
          position: 'absolute',
          right: 0,
          top: -4,
          fontFamily: FONT.sans,
          fontSize: 54,
          fontWeight: 850,
          letterSpacing: 2,
          color: C.violet,
          whiteSpace: 'nowrap',
          textShadow: `0 0 ${Math.round(24 * name.opacity)}px ${alpha(C.violet, 0.35)}`,
          ...name,
        }}
      >
        {NAME}
      </div>

      {/* ---- The film */}
      <div style={{ position: 'absolute', left: 0, top: RAIL_Y }}>
        <NameSweep sweep={sweep} />
        <FilmRail
          width={FILM_W}
          frames={frames}
          rail={rail}
          loose={loose}
          lit={lit}
          thread={thread}
          film={film}
          tone={VICTIMS.meridian.tone}
          style={{ filter: complete > 0.01 ? `drop-shadow(0 0 ${Math.round(18 * complete)}px ${alpha(C.cyan, 0.18 * complete)})` : undefined }}
        />
      </div>

      {/* ---- Chips (left) and the build order (right) */}
      <div style={{ position: 'absolute', left: 0, top: BOTTOM_Y + 4, display: 'flex', gap: 16 }}>
        {CHIPS.map((c, i) => (
          <div key={c.text} style={enter(frame, chipAt[i], { distance: 16, duration: 16 })}>
            <Chip accent="muted" size={TYPE.label}>
              {c.text}
            </Chip>
          </div>
        ))}
      </div>
      <div style={{ position: 'absolute', left: W - BO.width, top: BOTTOM_Y }}>
        <BuildOrder
          size={BO_SIZE}
          steps={[
            { label: BUILD_STEPS_THREAD[0], show: progress(frame, eventosAt, 16), lit: progress(frame, eventosAt + 4, 14) },
            { label: BUILD_STEPS_THREAD[1], show: progress(frame, hiloAt, 16), lit: progress(frame, hiloAt + 4, 14) },
          ]}
        />
      </div>
    </Stage>
  );
}

/** «por fecha y por fase»: a soft band of light that runs once over the phase names, left to right. */
function NameSweep({ sweep }: { sweep: number }) {
  if (sweep <= 0 || sweep >= 1) return null;
  const x = -200 + (FILM_W + 400) * sweep;
  const a = Math.sin(Math.PI * sweep);
  return (
    <div
      style={{
        position: 'absolute',
        left: x - 160,
        top: 422,
        width: 320,
        height: 88,
        borderRadius: 44,
        background: `radial-gradient(closest-side, ${alpha(C.text, 0.16 * a)}, ${alpha(C.text, 0)})`,
      }}
    />
  );
}

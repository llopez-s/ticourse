import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress, pulse } from '../../../engine/src/theme/motion';
import { Cursor, Icon, mix } from '../../../engine/src/ui';
import { BUTTONS, DELETE_NOW, DISABLED, DOOR_COUNT, LOCKER, PERSON, RETIRES, TERM, WRAP } from '../data/s03-leaver';
import { PortBadge, portBadgeHeight, type PortBadgeProps } from './parts/Badge';
import { Locker } from './parts/Locker';
import { LifecycleRing, ringHeight } from './parts/Ring';
import { Stage, wordFrame } from './kit';

const S = 's03-leaver';
const W = 1728;

const RING_S02 = { size: 400, left: 0, top: 0 };
// Smaller once the scene starts, so the think prompt (top centre) never covers its labels.
const RING_SMALL = { size: 280, left: 0, top: 0 };
const RING_WRAP = { size: 720, left: 40, top: Math.round((660 - ringHeight(720)) / 2) };
const BADGE_W = 740;
// The badge starts centred (below the think-prompt band), then slides to the left slot.
const BADGE_MID = { left: (W - BADGE_W) / 2, top: 250 };
const BADGE_LEFT = { left: 0, top: 250 };
// Right side: the two buttons, then the locker and its notes.
const RIGHT_X = 820;
const BTN = { w: 440, h: 130, gap: 40, top: 330 };
const BTN_X0 = RIGHT_X + (W - RIGHT_X - (2 * BTN.w + BTN.gap)) / 2;
const LOCKER_POS = { left: RIGHT_X, top: 24, width: 320 };
const NOTES_X = 1190;

/**
 * s03-leaver «Se jubila el viernes». The ring from s02 hands its light from
 * «cambio» to «baja». o.virta's badge (Importación, «la oficina que trata con
 * aduanas», door tiles without names) with «se jubila el viernes 23-10».
 * «choice»: two buttons, «borrar» / «deshabilitar», neither lit — and the
 * top-centre band stays clear for the think prompt. «same-day» (sfx lock,
 * on the cue): «deshabilitar» is pressed and the steel seal «deshabilitada ·
 * 23-10 · fin de turno» lands on the badge. «locker»: his locker is sealed,
 * not emptied; «retention»: «buzón · archivos · registros» inside, «se
 * conservan», and «borrar: cuando lo diga la política de retención». «borrar
 * hoy» struck with «sin vuelta atrás», then DEPROVISIONING. «wrap»: the whole
 * ring with «cambio: también quita» and «baja: deshabilitada ese día».
 */
export function S03Leaver(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const w = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);

  const leaver = props.cue('leaver');
  const choice = props.cue('choice');
  const sameDay = props.cue('same-day');
  const locker = props.cue('locker');
  const retention = props.cue('retention');
  const deprov = props.cue('deprov');
  const wrap = props.cue('wrap');

  // ---- Ring: «cambio» hands over to «baja», then the whole ring for the wrap.
  const handOut = 1 - progress(frame, leaver - 12, 12, EASE.inOut);
  const toBaja = progress(frame, leaver, 14, EASE.inOut) * (1 - progress(frame, wrap - 8, 16, EASE.inOut));
  const ringFocus = frame < leaver ? 'cambio' : 'baja';
  const ringFocusW = frame < leaver ? handOut : toBaja;
  const settle = progress(frame, leaver - 6, 22, EASE.inOut);
  const grow = progress(frame, wrap - 8, 28, EASE.inOut);
  const ringNow = {
    size: mix(mix(RING_S02.size, RING_SMALL.size, settle), RING_WRAP.size, grow),
    left: mix(mix(RING_S02.left, RING_SMALL.left, settle), RING_WRAP.left, grow),
    top: mix(mix(RING_S02.top, RING_SMALL.top, settle), RING_WRAP.top, grow),
  };
  const wrapAt = WRAP.map((l) => w('s03-06', l.word) - 6);
  const ringLit: [number, number, number] = [0, progress(frame, wrapAt[0], 12), progress(frame, wrapAt[1], 12)];

  // ---- Badge: centred, then the left slot at «choice»; sealed exactly on «same-day».
  const slide = progress(frame, choice - 4, 22, EASE.inOut);
  const badgeLeft = mix(BADGE_MID.left, BADGE_LEFT.left, slide);
  const badgeTop = mix(BADGE_MID.top, BADGE_LEFT.top, slide);
  const badgeProps: PortBadgeProps = {
    name: PERSON.name,
    dept: PERSON.dept,
    sub: PERSON.sub,
    subAt: w('s03-01', 'aduanas') - 8,
    doors: Array.from({ length: DOOR_COUNT }, () => ({ label: '', tone: 'cyan' as const })),
    width: BADGE_W,
    at: leaver - 6,
    disabledAt: sameDay,
    disabledLabel: DISABLED,
  };
  const badgeH = portBadgeHeight(badgeProps);
  const retireIn = progress(frame, w('s03-01', 'jubila') - 6, 14);
  const lockerPhaseDim = 0.3 * progress(frame, locker, 16, EASE.inOut);
  const wrapOut = progress(frame, wrap - 10, 16, EASE.inOut);

  // ---- Buttons and the click.
  const btnIn = [progress(frame, choice + 2, 14), progress(frame, choice + 8, 14)];
  const pressed = progress(frame, sameDay, 6, EASE.out);
  const btnOut = progress(frame, locker - 12, 14, EASE.inOut);
  const disableCenter = { x: BTN_X0 + BTN.w + BTN.gap + BTN.w * 0.62, y: BTN.top + BTN.h * 0.62 };

  // ---- Locker and notes.
  const lockerIn = progress(frame, locker - 6, 16);
  const sealP = progress(frame, w('s03-04', 'precinta') - 2, 9, EASE.out);
  const contents = progress(frame, retention - 4, 16);
  const keepIn = progress(frame, w('s03-04', 'registros') - 2, 14);
  const policyIn = progress(frame, w('s03-04', 'política') - 6, 14);
  const delNowAt = w('s03-05', 'borrar') - 6;
  const delNowIn = progress(frame, delNowAt, 12);
  const strike = progress(frame, delNowAt + 12, 12, EASE.inOut);
  const noBackIn = progress(frame, w('s03-05', 'vuelta') - 6, 12);
  const termAt = Math.max(deprov, w('s03-05', 'deprovisioning') - 8);
  const termIn = progress(frame, termAt, 14);
  const beat = 0.8 + 0.2 * pulse(frame, fps, 0.6);

  return (
    <Stage>
      {/* Ring */}
      <div style={{ position: 'absolute', left: ringNow.left, top: ringNow.top }}>
        <LifecycleRing size={ringNow.size} focus={ringFocus} focusW={ringFocusW} lit={ringLit} frame={frame} />
      </div>

      {/* Wrap lines */}
      {frame >= wrapAt[0] - 2 ? (
        <div style={{ position: 'absolute', left: RING_WRAP.left + RING_WRAP.size + 40, top: 170, fontFamily: FONT.sans }}>
          {WRAP.map((l, i) => (
            <div
              key={l.text}
              style={{
                position: 'absolute',
                left: 0,
                top: i * 150,
                display: 'flex',
                alignItems: 'center',
                gap: 18,
                whiteSpace: 'nowrap',
                ...enter(frame, wrapAt[i], { distance: 18, axis: 'x' }),
              }}
            >
              <div style={{ width: 8, height: 64, borderRadius: 4, background: C.cyan }} />
              <span style={{ fontSize: 56, fontWeight: 850, color: C.textStrong, letterSpacing: -0.5 }}>{l.text}</span>
            </div>
          ))}
        </div>
      ) : null}

      {wrapOut < 1 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: 1 - wrapOut }}>
          {/* o.virta's badge */}
          <div style={{ position: 'absolute', left: badgeLeft, top: badgeTop, opacity: 1 - lockerPhaseDim }}>
            <PortBadge {...badgeProps} frame={frame} />
            {retireIn > 0 ? (
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: badgeH + 18,
                  width: BADGE_W,
                  display: 'flex',
                  justifyContent: 'center',
                  ...enter(frame, w('s03-01', 'jubila') - 6, { distance: 12 }),
                }}
              >
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 14,
                    padding: '8px 24px',
                    borderRadius: RADIUS.pill,
                    border: `2px solid ${alpha(C.cyan, 0.5)}`,
                    background: alpha(C.cyan, 0.08),
                    fontFamily: FONT.sans,
                    fontSize: 40,
                    fontWeight: 750,
                    color: C.textStrong,
                    whiteSpace: 'nowrap',
                  }}
                >
                  <Icon name="clock" size={40} color={C.cyan} />
                  {RETIRES}
                </span>
              </div>
            ) : null}
          </div>

          {/* The two buttons */}
          {btnOut < 1 && frame >= choice ? (
            <div style={{ position: 'absolute', left: 0, top: 0, opacity: 1 - btnOut }}>
              {[BUTTONS.del, BUTTONS.disable].map((label, i) => {
                const isDisable = i === 1;
                const on = isDisable ? pressed : 0;
                const off = isDisable ? 0 : pressed;
                return (
                  <div
                    key={label}
                    style={{
                      position: 'absolute',
                      left: BTN_X0 + i * (BTN.w + BTN.gap),
                      top: BTN.top,
                      width: BTN.w,
                      height: BTN.h,
                      boxSizing: 'border-box',
                      borderRadius: RADIUS.lg,
                      border: `3px solid ${on > 0 ? alpha(C.cyan, 0.5 + 0.5 * on) : alpha(C.muted, 0.6)}`,
                      background: on > 0 ? alpha(C.cyan, 0.08 + 0.2 * on) : C.ink850,
                      boxShadow: on > 0 ? `0 0 ${Math.round(34 * on * beat)}px ${alpha(C.cyan, 0.4 * on)}` : `0 18px 40px ${alpha('#000000', 0.4)}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 18,
                      fontFamily: FONT.sans,
                      fontSize: 50,
                      fontWeight: 850,
                      color: on > 0.5 ? C.cyanSoft : C.textStrong,
                      whiteSpace: 'nowrap',
                      opacity: btnIn[i] * (1 - 0.55 * off),
                      transform: `translateY(${(1 - btnIn[i]) * 18}px) scale(${1 - 0.04 * on * (1 - progress(frame, sameDay + 6, 8))})`,
                    }}
                  >
                    <Icon name={isDisable ? 'lock' : 'x'} size={46} color={on > 0.5 ? C.cyan : C.muted} />
                    {label}
                  </div>
                );
              })}
              <Cursor
                frame={frame}
                path={[
                  { x: disableCenter.x + 160, y: disableCenter.y + 210, at: sameDay - 28 },
                  { x: disableCenter.x, y: disableCenter.y, at: sameDay, click: true },
                ]}
              />
            </div>
          ) : null}

          {/* The locker */}
          {lockerIn > 0 ? (
            <div style={{ position: 'absolute', left: LOCKER_POS.left, top: LOCKER_POS.top, ...enter(frame, locker - 6, { distance: 20 }) }}>
              <Locker width={LOCKER_POS.width} seal={sealP} contents={contents} labels={LOCKER.labels} sealLabel={LOCKER.seal} />
            </div>
          ) : null}

          {/* Notes beside the locker */}
          <div style={{ position: 'absolute', left: NOTES_X, top: 0, width: W - NOTES_X, fontFamily: FONT.sans }}>
            {keepIn > 0 ? (
              <div style={{ position: 'absolute', left: 0, top: 96, display: 'flex', alignItems: 'center', gap: 14, whiteSpace: 'nowrap', ...enter(frame, w('s03-04', 'registros') - 2, { distance: 14, axis: 'x' }) }}>
                <Icon name="check" size={46} color={C.emerald} strokeWidth={2.6} />
                <span style={{ fontSize: 48, fontWeight: 850, color: '#6ee7b7' }}>{LOCKER.keep}</span>
              </div>
            ) : null}
            {policyIn > 0 ? (
              <div style={{ position: 'absolute', left: 0, top: 176, width: W - NOTES_X, fontSize: 36, fontWeight: 700, color: C.text, lineHeight: 1.2, ...enter(frame, w('s03-04', 'política') - 6, { distance: 12 }) }}>
                {LOCKER.policy}
              </div>
            ) : null}
            {delNowIn > 0 ? (
              <div style={{ position: 'absolute', left: 0, top: 316, ...enter(frame, delNowAt, { distance: 12 }) }}>
                <div
                  style={{
                    position: 'relative',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 14,
                    height: 78,
                    padding: '0 30px',
                    boxSizing: 'border-box',
                    borderRadius: RADIUS.md,
                    border: `3px solid ${alpha(C.muted, 0.6)}`,
                    background: C.ink850,
                    fontSize: 42,
                    fontWeight: 800,
                    color: strike > 0.5 ? C.muted : C.textStrong,
                    whiteSpace: 'nowrap',
                  }}
                >
                  <Icon name="x" size={40} color={C.muted} />
                  {DELETE_NOW.button}
                  {strike > 0 ? (
                    <div style={{ position: 'absolute', left: 12, top: 36, width: `calc(${strike * 100}% - 24px)`, height: 6, borderRadius: 3, background: C.rose }} />
                  ) : null}
                </div>
                <div style={{ marginTop: 14, fontSize: 42, fontWeight: 850, color: C.roseSoft, whiteSpace: 'nowrap', opacity: noBackIn }}>{DELETE_NOW.note}</div>
              </div>
            ) : null}
          </div>

        </div>
      ) : null}

      {/* DEPROVISIONING (stays through the wrap, under its two lines) */}
      {termIn > 0 ? (
        <div
          style={{
            position: 'absolute',
            left: mix((RIGHT_X + W) / 2, RING_WRAP.left + RING_WRAP.size + 40 + 290, grow) - 450,
            top: mix(556, 470, grow),
            width: 900,
            textAlign: 'center',
            fontFamily: FONT.sans,
            fontSize: 60,
            fontWeight: 850,
            letterSpacing: 2,
            color: '#c4b5fd',
            whiteSpace: 'nowrap',
            textShadow: `0 0 26px ${alpha(C.violet, 0.45 * termIn)}`,
            ...enter(frame, termAt, { distance: 16 }),
          }}
        >
          {TERM}
        </div>
      ) : null}
    </Stage>
  );
}

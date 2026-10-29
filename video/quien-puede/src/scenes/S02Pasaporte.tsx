import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { Icon, mix } from '../../../engine/src/ui';
import { curveBetween } from '../../../engine/src/ui/geometry';
import { Connector } from '../../../engine/src/ui/Connector';
import { Stage, wordFrame } from './kit';
import { AccountCard } from './parts/AccountCard';
import { BoardingPass, PassportBooth } from './parts/Airport';
import { SceneStamp } from './parts/Bits';
import { FLIGHTS, FOLDER_NAME } from './parts/data';
import { LabelledGate } from './parts/Gate';
import { ImageTag, Pill, TermPill } from './parts/Labels';

const S = 's02-pasaporte';

/** The three actions of the account, with the result each one gets on `authz`. */
const ACTIONS = [
  { word: 'abrir', spoken: 'abrir', ok: true },
  { word: 'guardar', spoken: 'guardar', ok: false },
  { word: 'borrar', spoken: 'borrar', ok: false },
] as const;

/** Gate centres (x) in the airport image; the fourth one is the folder's «escribir» gate. */
const GATES = [
  { cx: 600, w: 290, label: FLIGHTS[0] },
  { cx: 905, w: 290, label: FLIGHTS[1] },
  { cx: 1210, w: 290, label: FLIGHTS[2] },
] as const;
const WRITE_GATE_CX = 1550;
const GATE_TOP = 78;
const WALK_Y = 500; // the band where the account and its card walk

/**
 * s02-pasaporte «Pasaporte y tarjeta de embarque». Part 1: «tu cuenta» as a tag; on `authn` a check beside
 * «contraseña comprobada» (AUTHENTICATION, quién eres); on `actions` abrir · guardar · borrar appear without a result
 * and on `authz` each gets its own (AUTHORIZATION, qué puedes). Part 2, the image tagged «imagen · no es del puerto»: a
 * passport control with its check (`passport`), several barrier gates, each with its flight, and a boarding card that
 * opens only one (`boarding`). The account passes the control (`passed`) and stops in front of «Partes de avería ·
 * escribir», which stays shut (`missing`); the label «el problema es de autorización» closes the scene (`diagnosis`).
 */
export function S02Pasaporte(props: SceneProps) {
  const frame = useCurrentFrame();
  const accountAt = props.cue('account');
  const authnAt = props.cue('authn');
  const actionsAt = props.cue('actions');
  const authzAt = props.cue('authz');
  const airportAt = props.cue('airport');
  const passportAt = props.cue('passport');
  const boardingAt = props.cue('boarding');
  const passedAt = props.cue('passed');
  const missingAt = props.cue('missing');
  const diagnosisAt = props.cue('diagnosis');
  const actionAts = ACTIONS.map((a) => Math.max(actionsAt, wordFrame(S, 's02-02', a.spoken)));

  // --- part 1 leaves as the airport arrives
  const p1 = 1 - progress(frame, airportAt - 10, 16);
  const accountIn = enter(frame, accountAt - 4, { distance: 24, duration: 18 });
  const authn = progress(frame, authnAt, 12);
  const authz = progress(frame, authzAt, 12);

  // --- part 2: the image
  const imageIn = progress(frame, airportAt, 18);
  const boothCheck = progress(frame, passportAt + 14, 14, EASE.out);
  const gateIn = (i: number) => progress(frame, passportAt + 36 + i * 12, 14);
  const passIn = progress(frame, boardingAt, 16);
  const gate2Open = progress(frame, boardingAt + 14, 22) * (1 - progress(frame, passedAt + 14, 20));
  const writeGateIn = progress(frame, passedAt - 4, 16);
  const travel = progress(frame, passedAt + 8, 80, EASE.inOut);
  const lack = progress(frame, missingAt, 14);
  const refuseF = frame - (missingAt + 24);
  const refuse = refuseF >= 0 && refuseF < 12 ? Math.sin((refuseF / 12) * Math.PI * 2) * 5 * (1 - refuseF / 12) : 0;
  const diag = progress(frame, diagnosisAt - 2, 16);

  const fichaX = mix(0, 980, travel);
  const passX = mix(360, 1330, travel);
  const gate2 = GATES[1];

  return (
    <Stage>
      <SceneStamp frame={frame} />

      {/* ---------- part 1: authentication and authorization ---------- */}
      {p1 > 0.01 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: p1 }}>
          <div style={{ position: 'absolute', left: 0, top: 104, ...accountIn }}>
            <AccountCard on={authn} />
          </div>

          {/* authentication: a check beside «contraseña comprobada», the exam term and what it answers */}
          {frame >= authnAt - 2 ? (
            <>
              <div style={{ position: 'absolute', left: 520, top: 122, ...enter(frame, authnAt, { distance: 20, duration: 14 }) }}>
                <Pill text="contraseña comprobada" tone={C.emerald} icon="check" on={0.8 + 0.2 * authn} size={40} height={78} />
              </div>
              <div style={{ position: 'absolute', left: 1130, top: 106, ...enter(frame, authnAt + 10, { distance: 20, duration: 14 }) }}>
                <TermPill text="AUTHENTICATION" size={46} on={authn} />
                <div style={{ fontFamily: FONT.sans, fontSize: 52, fontWeight: 850, color: C.textStrong, marginTop: 14, paddingLeft: 8 }}>quién eres</div>
              </div>
            </>
          ) : null}

          {/* the three actions of the account */}
          <div style={{ position: 'absolute', left: 0, top: 330, display: 'grid', gap: 16 }}>
            {ACTIONS.map((a, i) => {
              const at = actionAts[i];
              const show = progress(frame, at - 2, 14);
              const res = progress(frame, authzAt + i * 16, 12);
              const tone = a.ok ? C.emerald : C.rose;
              return (
                <div key={a.word} style={{ display: 'flex', alignItems: 'center', gap: 20, height: 72, opacity: show, transform: `translateX(${(1 - show) * -24}px)` }}>
                  <span style={{ width: 52, height: 52, borderRadius: 26, display: 'grid', placeItems: 'center', background: alpha(C.cyan, 0.16), border: `3px solid ${C.cyan}` }}>
                    <Icon name="key" size={30} color={C.cyan} strokeWidth={2.2} />
                  </span>
                  <span style={{ fontFamily: FONT.sans, fontSize: 50, fontWeight: 850, color: C.textStrong, width: 200 }}>{a.word}</span>
                  <span style={{ fontSize: 40, fontWeight: 800, color: C.faint }}>·</span>
                  <span style={{ position: 'relative', width: 270, height: 62 }}>
                    <span style={{ position: 'absolute', inset: 0, borderRadius: RADIUS.md, border: `3px dashed ${alpha(C.muted, 0.5)}`, opacity: 1 - res }} />
                    {res > 0.01 ? (
                      <span
                        style={{
                          position: 'absolute',
                          inset: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 10,
                          borderRadius: RADIUS.md,
                          border: `3px solid ${alpha(tone, 0.9)}`,
                          background: alpha(tone, 0.16),
                          fontFamily: FONT.sans,
                          fontSize: 38,
                          fontWeight: 850,
                          color: a.ok ? '#6ee7b7' : C.roseSoft,
                          opacity: res,
                          transform: `scale(${0.9 + 0.1 * res})`,
                        }}
                      >
                        <Icon name={a.ok ? 'check' : 'x'} size={36} color={tone} strokeWidth={3.2} />
                        {a.ok ? 'permitido' : 'denegado'}
                      </span>
                    ) : null}
                  </span>
                </div>
              );
            })}
          </div>
          {frame >= authzAt - 2 ? (
            <div style={{ position: 'absolute', left: 1130, top: 340, ...enter(frame, authzAt + 4, { distance: 20, duration: 14 }) }}>
              <TermPill text="AUTHORIZATION" size={46} on={authz} />
              <div style={{ fontFamily: FONT.sans, fontSize: 52, fontWeight: 850, color: C.textStrong, marginTop: 14, paddingLeft: 8 }}>qué puedes</div>
            </div>
          ) : null}
        </div>
      ) : null}

      {/* ---------- part 2: the image ---------- */}
      {imageIn > 0.01 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: imageIn }}>
          <div style={{ position: 'absolute', right: 0, top: 4 }}>
            <ImageTag />
          </div>

          {/* passport control */}
          <div style={{ position: 'absolute', left: 0, top: 88 }}>
            <PassportBooth width={270} check={boothCheck} glow={progress(frame, passportAt, 12) * (1 - progress(frame, passportAt + 60, 20))} />
          </div>
          <div style={{ position: 'absolute', left: 0, top: 88 + 286 + 6, width: 270, textAlign: 'center', fontFamily: FONT.sans, fontSize: 32, fontWeight: 750, lineHeight: 1.15, color: '#7dd3fc', opacity: progress(frame, airportAt + 6, 14) }}>
            control de
            <br />
            pasaportes
            <div style={{ fontSize: 30, fontWeight: 850, color: C.violet, opacity: progress(frame, passportAt + 4, 12), marginTop: 2 }}>= autenticación</div>
          </div>

          {/* the gates: each with its flight; only one opens with the boarding card */}
          {GATES.map((g, i) => (
            <div key={g.label} style={{ position: 'absolute', left: g.cx - g.w / 2, top: GATE_TOP, opacity: gateIn(i) }}>
              <LabelledGate width={g.w} label={g.label} open={i === 1 ? gate2Open : 0} tone={C.sky} on={i === 1 ? passIn : 0} size={36} />
            </div>
          ))}
          <div style={{ position: 'absolute', left: WRITE_GATE_CX - 160, top: GATE_TOP, opacity: writeGateIn }}>
            <LabelledGate width={320} label={FOLDER_NAME} sub="escribir" open={0} tone={lack > 0.5 ? C.rose : C.sky} on={lack} shake={refuse} size={34} />
          </div>

          {/* the boarding card names one flight: a dashed line to the only gate it opens */}
          <svg width={1728} height={660} style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none', overflow: 'visible' }} aria-hidden>
            <Connector curve={curveBetween({ x: passX + 190, y: WALK_Y - 6 }, { x: gate2.cx, y: GATE_TOP + 262 }, 0.35)} color={C.sky} width={5} dashed opacity={passIn * (1 - progress(frame, passedAt, 12))} />
          </svg>
          <div style={{ position: 'absolute', left: passX, top: WALK_Y - 14, opacity: passIn * (1 - lack) }}>
            <BoardingPass width={400} flight={gate2.label} on={passIn} />
          </div>
          <div style={{ position: 'absolute', left: passX + 10, top: WALK_Y + 150, fontFamily: FONT.sans, fontSize: 30, fontWeight: 850, color: C.violet, opacity: passIn * (1 - lack) }}>= autorización</div>
          <div style={{ position: 'absolute', left: passX + 10, top: WALK_Y - 6, opacity: lack }}>
            <BoardingPass width={360} ghost ghostText="escribir" />
          </div>

          {/* the account walks through the control and stops in front of the shut gate */}
          <div style={{ position: 'absolute', left: fichaX, top: WALK_Y + 18, opacity: progress(frame, airportAt + 20, 14) }}>
            <AccountCard compact on={progress(frame, passedAt, 12)} />
          </div>

          {/* the diagnosis */}
          {diag > 0.01 ? (
            <div style={{ position: 'absolute', left: 340, top: 392, opacity: diag, transform: `translateY(${(1 - diag) * 16}px)`, fontFamily: FONT.sans, fontSize: 62, fontWeight: 900, letterSpacing: -1.5, color: C.textStrong, whiteSpace: 'nowrap' }}>
              el problema es de <span style={{ color: C.violet }}>autorización</span>
            </div>
          ) : null}
        </div>
      ) : null}
    </Stage>
  );
}

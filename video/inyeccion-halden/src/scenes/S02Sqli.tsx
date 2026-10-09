import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, alpha } from '../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../engine/src/theme/motion';
import { Icon, Panel, mix, windowWeight } from '../../../engine/src/ui';
import { ATTEMPT, FORM, MARKS, NAME, NOTES, ROWS } from '../data/s02-sqli';
import { PAYLOAD } from '../data/query';
import { Pill, TermName } from './parts/bits';
import { LOGIN, LoginScreen } from './parts/Login';
import { PortForm } from './parts/PortForm';
import { QUERY_REST, QueryBlock, QueryNote, RowsTable } from './parts/QueryBlock';
import { Stage, wordFrame } from './kit';

const S = 's02-sqli';
const W = 1728;
const LOGIN_Y = 40;
const PANEL = { x: 600, y: 20, w: 1128, h: 600 } as const;
const QUERY_SIZE = 40;
const FORM_POS = { x: 0, y: 130 } as const;

/** Characters typed so far: `n` of them from `start`, one every `rate` frames. */
function typed(frame: number, start: number, n: number, rate: number): number {
  return Math.max(0, Math.min(n, Math.floor((frame - start) / rate)));
}

/**
 * s02-sqli «Una comilla en el login». The copy's login: a normal attempt with a wrong password gets «usuario o
 * contraseña incorrectos» (`fail`). Then what is behind it (`query`): the lesson's query, program in white and the
 * person's text in cyan; the name slot is lit (`hole`), the payload types into it and, as the voice names its three
 * parts, the quote turns white (`quote`: it closes the name early), « OR 1=1» is read as order (`always-true`) and
 * « --» switches off the rest of the line, the password included, struck in grey (`comment`). The query returns every
 * row (`result`) and the login opens a session without a password (`bypass`). Then the image (`form`): the port's form
 * with a hole, the slip pasted into it and spilling over the sentence; name SQL INJECTION, data to order (`name`).
 * The payload exists only as text on screen.
 */
export function S02Sqli(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (id: string) => props.cue(id);
  const loginAt = at('login');
  const failAt = at('fail');
  const queryAt = at('query');
  const holeAt = at('hole');
  const quoteAt = at('quote');
  const alwaysAt = at('always-true');
  const commentAt = at('comment');
  const resultAt = at('result');
  const bypassAt = at('bypass');
  const formAt = at('form');
  const nameAt = at('name');
  const w = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);

  // ---- the login window: centred, then to the left when the query arrives; gone when the form arrives
  const slide = progress(frame, queryAt - 20, 26, EASE.inOut);
  const loginX = mix((W - LOGIN.w) / 2, 0, slide);
  const loginIn = progress(frame, loginAt - 4, 14);
  const phase2Out = progress(frame, formAt - 16, 14, EASE.inOut);

  // ---- the ordinary attempt, then the payload
  const attemptOn = frame < queryAt - 12;
  const userN = typed(frame, loginAt + 12, ATTEMPT.user.length, 3);
  const dotsN = typed(frame, loginAt + 12 + 3 * ATTEMPT.user.length + 6, ATTEMPT.dots, 3);
  const ahora = w('s02-03', 'Ahora');
  const payStart = ahora + 4;
  const rate = Math.max(2, (quoteAt - 4 - payStart) / PAYLOAD.length);
  const payN = Math.max(0, Math.min(PAYLOAD.length, Math.floor((frame - payStart) / rate)));
  const error = progress(frame, failAt - 4, 10) * (1 - progress(frame, queryAt - 14, 10));
  const session = progress(frame, bypassAt - 2, 10);
  const userText = attemptOn ? ATTEMPT.user.slice(0, userN) : PAYLOAD.slice(0, payN);
  const caret = attemptOn ? (dotsN < ATTEMPT.dots ? (userN < ATTEMPT.user.length ? 'user' : 'pass') : null) : payN > 0 && payN < PAYLOAD.length + 1 && session < 0.5 ? 'user' : null;
  const bypassFlash = windowWeight(frame, bypassAt, bypassAt + 40, { ramp: 8 });

  // ---- the query panel
  const panelIn = progress(frame, queryAt - 4, 16);
  const holeW = windowWeight(frame, holeAt, ahora - 2, { ramp: 12 });
  const state = {
    ...QUERY_REST,
    typed: payN,
    emptyPass: progress(frame, ahora + 2, 6),
    quote: progress(frame, quoteAt - 2, 10),
    always: progress(frame, alwaysAt - 2, 10),
    comment: progress(frame, commentAt - 2, 10),
    hole: holeW,
  };
  const noteHole = windowWeight(frame, holeAt + 6, ahora - 2, { ramp: 12 });
  const marksOut = progress(frame, resultAt - 10, 12);
  const marksAt = MARKS.map((m) => at(m.cue));
  const passTag = progress(frame, w('s02-04', 'contraseña') - 6, 12);
  const tableIn = progress(frame, resultAt - 4, 14);
  const rowsLit = progress(frame, resultAt + 4, 26);

  // ---- the form
  const formIn = progress(frame, formAt - 4, 16);
  const slip = progress(frame, w('s02-06', 'pegas') - 12, 14);
  const tape = progress(frame, w('s02-06', 'cambia') - 4, 24);
  const formGlow = windowWeight(frame, w('s02-06', 'hueco') - 6, w('s02-06', 'pegas') - 4, { ramp: 10 });
  const redactas = progress(frame, w('s02-06', 'redactas') - 8, 12);
  const rellenas = progress(frame, w('s02-06', 'rellenas') - 8, 12);

  // ---- name
  const nameShow = progress(frame, nameAt - 4, 16);
  const fromAt = w('s02-07', 'dato', 0) - 6;
  const toAt = w('s02-07', 'orden', 0) - 6;

  return (
    <Stage>
      {/* ---------------- the login window ---------------- */}
      {phase2Out < 1 ? (
        <div style={{ position: 'absolute', left: loginX, top: LOGIN_Y, opacity: loginIn * (1 - phase2Out), transform: `translateY(${(1 - loginIn) * 18}px)` }}>
          <LoginScreen
            user={userText}
            dots={attemptOn ? dotsN : 0}
            caret={caret}
            error={error}
            session={session}
            glowUser={attemptOn ? 0 : payN > 0 ? 0.7 : 0}
            glow={0.7 * bypassFlash}
            frame={frame}
            fps={fps}
          />
        </div>
      ) : null}

      {/* ---------------- the query ---------------- */}
      {panelIn > 0.001 && phase2Out < 1 ? (
        <div style={{ position: 'absolute', left: PANEL.x, top: PANEL.y, width: PANEL.w, height: PANEL.h, opacity: panelIn * (1 - phase2Out), transform: `translateX(${(1 - panelIn) * 30}px)` }}>
          <Panel title={NOTES.panel} icon="database" accent="cyan" style={{ width: PANEL.w, height: PANEL.h }}>
            <div style={{ position: 'absolute', left: 34, top: 22 }}>
              <QueryBlock state={state} size={QUERY_SIZE} />
              {/* the password line's note */}
              <div style={{ position: 'absolute', left: 16 * 24 + 36, top: QUERY_SIZE * 3 + 10, fontFamily: FONT.sans, fontSize: 32, fontWeight: 700, color: C.roseSoft, whiteSpace: 'nowrap', opacity: passTag * (1 - marksOut) }}>
                {NOTES.pass}
              </div>
            </div>
            {/* the hole */}
            <div style={{ position: 'absolute', left: 34, top: 22 + QUERY_SIZE * 4.5 + 6 }}>
              <QueryNote x={14 * 24 - 14} text={NOTES.hole} tone={C.cyan} show={noteHole} width={560} />
            </div>
            {/* the three marks of the payload */}
            <div style={{ position: 'absolute', left: 34, top: 262, display: 'flex', gap: 18, opacity: 1 - marksOut }}>
              {MARKS.map((m, i) => {
                const show = progress(frame, marksAt[i] - 4, 12);
                const next = marksAt[i + 1] ?? resultAt - 10;
                const hot = windowWeight(frame, marksAt[i], next, { ramp: 10 });
                return (
                  <div
                    key={m.cue}
                    style={{
                      width: 336,
                      height: 104,
                      boxSizing: 'border-box',
                      borderRadius: 16,
                      padding: '10px 18px',
                      border: `3px solid ${alpha(m.tone, 0.4 + 0.6 * hot)}`,
                      background: alpha(m.tone, 0.07 + 0.12 * hot),
                      boxShadow: hot > 0.02 ? `0 0 ${Math.round(28 * hot)}px ${alpha(m.tone, 0.35 * hot)}` : undefined,
                      opacity: show,
                      transform: `translateY(${(1 - show) * 14}px)`,
                    }}
                  >
                    <div style={{ fontFamily: FONT.mono, fontSize: 38, fontWeight: 850, color: m.tone, lineHeight: 1.1 }}>{m.token}</div>
                    <div style={{ marginTop: 6, fontFamily: FONT.sans, fontSize: 32, fontWeight: 700, color: C.textStrong, whiteSpace: 'nowrap' }}>{m.caption}</div>
                  </div>
                );
              })}
            </div>
            {/* the result */}
            <div style={{ position: 'absolute', left: 34, top: 262 }}>
              <RowsTable rows={ROWS} show={tableIn} lit={rowsLit} width={520} />
            </div>
            <div style={{ position: 'absolute', left: 34 + 520 + 40, top: 290, opacity: tableIn, transform: `translateY(${(1 - tableIn) * 12}px)`, fontFamily: FONT.sans, fontWeight: 850, color: C.textStrong, lineHeight: 1.12 }}>
              <div style={{ fontSize: 44, color: C.muted, fontWeight: 700 }}>{NOTES.rows[0]}</div>
              <div style={{ fontSize: 62, color: C.roseSoft, letterSpacing: -1 }}>{NOTES.rows[1]}</div>
            </div>
          </Panel>
        </div>
      ) : null}

      {/* ---------------- the form with a hole ---------------- */}
      {formIn > 0.001 ? (
        <>
          <div style={{ position: 'absolute', left: FORM_POS.x, top: FORM_POS.y, opacity: formIn, transform: `translateY(${(1 - formIn) * 20}px)` }}>
            <PortForm box={0} slip={slip} tape={tape} glow={formGlow} />
          </div>
          <div style={{ position: 'absolute', left: FORM_POS.x, top: FORM_POS.y + 372, width: 920, fontFamily: FONT.sans, fontSize: 44, fontWeight: 800, whiteSpace: 'nowrap' }}>
            <span style={{ color: C.muted, opacity: rellenas, textDecoration: redactas > 0.5 ? 'line-through' : undefined, textDecorationThickness: 3 }}>{FORM.rellenas}</span>{' '}
            <span style={{ color: C.roseSoft, opacity: redactas }}>{FORM.redactas}</span>
          </div>
        </>
      ) : null}

      {/* ---------------- name ---------------- */}
      {nameShow > 0.001 ? (
        <div style={{ position: 'absolute', left: 1000, top: 140 }}>
          <TermName text={NAME.title} show={nameShow} size={70} />
          <div style={{ marginTop: 36, display: 'flex', alignItems: 'center', gap: 22 }}>
            <Pill tone={C.cyan} size={44} show={progress(frame, fromAt, 14)}>
              {NAME.from}
            </Pill>
            <div style={{ opacity: progress(frame, toAt - 8, 12) }}>
              <Icon name="arrowRight" size={52} color={C.muted} strokeWidth={2.4} />
            </div>
            <Pill tone={C.textStrong} size={44} show={progress(frame, toAt, 14)} style={{ background: alpha(C.textStrong, 0.1) }}>
              {NAME.to}
            </Pill>
          </div>
        </div>
      ) : null}
    </Stage>
  );
}

import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, alpha } from '../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../engine/src/theme/motion';
import { clamp01, dimStyle, mix, windowWeight } from '../../../engine/src/ui';
import { DEFENCE, type LogTokenId } from '../data/s04-traversal';
import { AccessLog, LOG_H, logRowTop, logTokenW, logTokenX, type TokenLight } from './parts/s04-traversal/AccessLog';
import { DECODE_H, DecodeStrip, NOTE403_W, NoFilterNote, TraversalName } from './parts/s04-traversal/Decode';
import { FolderPlan, PLAN_H, PLAN_W, planWeights } from './parts/s04-traversal/FolderPlan';
import { VENT_H, VENT_W, Ventanilla } from './parts/s04-traversal/Ventanilla';
import { ExpandingRow, overlayWindows } from './parts/TrailRow';
import { Stage, segment, wordFrame } from './kit';

const S = 's04-traversal';
const W = 1728;

// Log panel: under the header strip (stage y 0–90) at first, then lowered below the intercepted
// message (stage y ≈ 10–195) while it is up and for the encoded line after it.
const LOG_TOP = 100;
const LOG_LOW = 214;
// Folder plan: centred under the log (A), small on the left beside the window (B), centred alone (E).
const PLAN_A = { x: (W - PLAN_W) / 2, y: LOG_TOP + LOG_H + 8, s: 1 } as const;
const PLAN_B = { x: 0, y: LOG_TOP + LOG_H + 14, s: 0.55 } as const;
const PLAN_E = { x: (W - PLAN_W * 1.05) / 2, y: 150, s: 1.05 } as const;
// The records-office window (B), and the name under the small plan.
const VENT = { x: W - VENT_W, y: LOG_TOP + LOG_H + 34 } as const;
const NAME = { x: 10, y: PLAN_B.y + PLAN_H * PLAN_B.s + 18 } as const;
// The decode strip and the 403 note (C–D), under the lowered log.
const DECODE = { x: 0, y: LOG_LOW + LOG_H + 26 } as const;
const NOTE403 = { x: W - NOTE403_W, y: DECODE.y + 62 } as const;
// The defence label under the plan (E).
const DEF_Y = PLAN_E.y + PLAN_H * PLAN_E.s + 40;


/**
 * s04-traversal «Una nota con indicaciones». The folder row of the morning queue opens into the
 * access log of `hpa-portal-web-01` (portal público de reservas de atraque), two requests from
 * 192.0.2.157. «Mira qué archivo pide»: `file=`. Each `../` lights with one step of the folder plan,
 * from the portal's folder up to the root and down to `etc/passwd`; «se lo da»: `200` and `1834` grow,
 * «se lo llevó». The image: a records-office window and the note «sal de la sala y sube cuatro
 * plantas»; DIRECTORY TRAVERSAL, and «inyección» struck through. RED MARROW's message types out at the
 * top while the log sits lower. The second line: `%2e%2e%2f` decoded character by character to `../`,
 * «la misma nota, codificada»; by `403 0`, «403: el servidor no puede leer shadow · no es un filtro».
 * The defence on the plan: the clerk calculates the whole route first («resolver la ruta»), it ends
 * outside the room («comprobar que sigue dentro»), and it is rejected.
 */
export function S04Traversal(props: SceneProps) {
  const frame = useCurrentFrame();

  const accessAt = props.cue('access-log');
  const paramAt = props.cue('param');
  const climbAt = props.cue('climb');
  const servedAt = props.cue('served');
  const traversalAt = props.cue('traversal');
  const notSqliAt = props.cue('not-sqli');
  const encodedAt = props.cue('encoded');
  const noFilterAt = props.cue('no-filter');
  const canonAt = props.cue('canon');
  const confineAt = props.cue('confine');
  const s4 = segment(props, 's04-04');
  const s5 = segment(props, 's04-05');
  const s8 = segment(props, 's04-08');

  // ---- Phase A: the log and the climb.
  const stripAt = Math.min(props.enterFrames, accessAt);
  const logIn = progress(frame, Math.max(accessAt + 6, stripAt + 12), 18);
  const timeAt = wordFrame(S, 's04-01', 'cuatro') - 4;
  const docAt = wordFrame(S, 's04-01', 'documento') - 4;
  const planIn = progress(frame, paramAt + 8, 18);
  // The four `../`: from the first «punto» to «carpeta», then down to `etc` and `passwd`.
  const step0 = Math.max(climbAt, wordFrame(S, 's04-02', 'punto', 0) - 2);
  const step3 = Math.max(step0 + 36, wordFrame(S, 's04-02', 'carpeta'));
  const stepAt = [0, 1, 2, 3].map((k) => step0 + ((step3 - step0) * k) / 3);
  const etcAt = Math.max(step3 + 14, wordFrame(S, 's04-02', 'salir') - 2);
  const fileAt = Math.max(etcAt + 12, wordFrame(S, 's04-02', 'portal') - 4);
  const usersAt = wordFrame(S, 's04-03', 'lista') - 4;
  const plan = planWeights(frame, { steps: stepAt, etc: etcAt, file: fileAt });
  const servedP = progress(frame, servedAt + 2, 16);

  // ---- Phase B: the window and the note; the name; not an injection.
  const toB = progress(frame, s4.from - 6, 22, EASE.inOut);
  const windowAt = wordFrame(S, 's04-04', 'ventanilla') - 8;
  const noteAt = wordFrame(S, 's04-04', 'nota') - 6;
  const strikeAt = wordFrame(S, 's04-05', 'inyección') - 4;

  // ---- Phase C: the intercepted message (from s04-05's end to s04-06's end), the encoded line.
  // The card's first frame (the timeline's intercept window, which overlayWindows starts 14 frames early).
  const cFrom = (overlayWindows(S)[0]?.[0] ?? s5.to - 14) + 14;
  const bOut = progress(frame, cFrom - 12, 14, EASE.inOut);
  const lower = progress(frame, cFrom - 12, 22, EASE.inOut);
  const secondAt = Math.max(encodedAt + 4, wordFrame(S, 's04-06', 'segunda') - 4);
  const codedAt = wordFrame(S, 's04-06', 'codificada') - 4;
  const sameAt = wordFrame(S, 's04-06', 'misma') - 4;
  const decodeIn = progress(frame, codedAt, 14);
  const pairs = [0, 1, 2].map((k) => progress(frame, codedAt + 12 + k * 10, 12));

  // ---- Phase D: the 403.
  const otherAt = wordFrame(S, 's04-07', 'otro') - 4;
  const filterAt = wordFrame(S, 's04-07', 'Filtro') - 4;

  // ---- Phase E: the defence on the plan.
  const dOut = progress(frame, s8.from - 16, 14, EASE.inOut);
  const planE = progress(frame, s8.from - 6, 18);
  const calcAt = wordFrame(S, 's04-08', 'calcular') - 2;
  const calc = progress(frame, calcAt, Math.max(24, Math.min(60, canonAt - calcAt - 6)), EASE.inOut);
  const resolve = progress(frame, canonAt - 2, 14);
  const confine = progress(frame, confineAt - 2, 16);
  const reject = progress(frame, wordFrame(S, 's04-08', 'rechaza') - 6, 14);

  // ---- The log's token lights.
  const w = (from: number, to = Number.POSITIVE_INFINITY) => windowWeight(frame, from, to);
  const rose = (v: number): TokenLight => ({ w: v, tone: C.rose });
  const lit: Partial<Record<LogTokenId, TokenLight>> = {
    t1: { w: w(timeAt, docAt), tone: C.amber },
    p1: { w: w(docAt, paramAt), tone: C.cyan },
    f1: { w: w(paramAt, servedAt), tone: C.amber },
    u1a: rose(plan.steps[0]),
    u1b: rose(plan.steps[1]),
    u1c: rose(plan.steps[2]),
    u1d: rose(plan.steps[3]),
    e1: rose(Math.max(plan.file, 0)),
    s1: rose(progress(frame, servedAt, 12)),
    b1: rose(progress(frame, servedAt, 12)),
    x2a: rose(progress(frame, codedAt, 12) * (1 - 0.4 * progress(frame, noFilterAt, 12))),
    x2b: rose(progress(frame, codedAt + 4, 12) * (1 - 0.4 * progress(frame, noFilterAt, 12))),
    x2c: rose(progress(frame, codedAt + 8, 12) * (1 - 0.4 * progress(frame, noFilterAt, 12))),
    e2b: rose(progress(frame, otherAt, 12)),
    s2: { w: progress(frame, noFilterAt, 12), tone: C.amber },
    b2: { w: progress(frame, noFilterAt, 12), tone: C.amber },
  };
  const hostLit = w(wordFrame(S, 's04-01', 'portal') - 6, paramAt);
  // Line 2 waits dimmed until «segunda»; line 1 steps back then.
  const second = progress(frame, secondAt, 14);
  const dim1 = Math.max(0.5 * toB * (1 - lower), 0.6 * second);
  const dim2 = (1 - second) * 0.85;
  const logDim = 0.45 * toB * (1 - lower);
  const logY = mix(LOG_TOP, LOG_LOW, lower);
  const logOut = dOut;

  // Plan placement through A and B (it fades for C–D and comes back alone in E).
  const planAB = {
    x: mix(PLAN_A.x, PLAN_B.x, toB),
    y: mix(PLAN_A.y, PLAN_B.y, toB),
    s: mix(PLAN_A.s, PLAN_B.s, toB),
  };
  const roomLeft = progress(frame, stepAt[0] + 6, 10) * (1 - progress(frame, servedAt + 30, 20));

  // The 403 note's connector to `403` in the lowered log.
  const x403 = logTokenX('s2') + logTokenW('s2') / 2;
  const row2Bottom = LOG_LOW + logRowTop(1) + 52;
  const noteIn = progress(frame, noFilterAt + 4, 16);

  return (
    <Stage>
      {/* The folder row of the morning queue opens into the title strip; it folds aside while the
          intercepted message is up (timeline windows, so they follow the real voice). */}
      <ExpandingRow kind="folder" frame={frame} startAt={stripAt} away={overlayWindows(S)} />

      {/* ===== The log (A–D) ===== */}
      {logOut < 1 ? (
        <div style={{ position: 'absolute', left: 0, top: logY, ...dimStyle(logDim, 1 - logOut) }}>
          <AccessLog
            open={logIn}
            lit={lit}
            grow1={progress(frame, servedAt, 14) * (1 - 0.6 * toB)}
            served={servedP}
            dim1={dim1}
            dim2={dim2}
            hostLit={hostLit}
            glow={0}
          />
        </div>
      ) : null}

      {/* ===== Phases A–B: the plan ===== */}
      {planIn > 0 && bOut < 1 ? (
        <div
          style={{
            position: 'absolute',
            left: planAB.x,
            top: planAB.y,
            transform: `scale(${planAB.s})`,
            transformOrigin: '0 0',
            ...dimStyle(0.35 * toB, planIn * (1 - bOut)),
          }}
        >
          <FolderPlan
            steps={plan.steps}
            etc={plan.etc}
            file={plan.file}
            served={servedP}
            users={progress(frame, usersAt, 14)}
            roomLeft={roomLeft}
          />
        </div>
      ) : null}

      {/* ===== Phase B: the records-office window and the note; the name ===== */}
      {toB > 0 && bOut < 1 ? (
        <div style={{ position: 'absolute', left: VENT.x, top: VENT.y, height: VENT_H, opacity: 1 - bOut }}>
          <Ventanilla window={progress(frame, windowAt, 18)} note={progress(frame, noteAt, 20, EASE.out)} />
        </div>
      ) : null}
      {frame >= traversalAt - 6 && bOut < 1 ? (
        <div style={{ position: 'absolute', left: NAME.x, top: NAME.y, opacity: 1 - bOut }}>
          <TraversalName
            width={840}
            name={progress(frame, traversalAt - 2, 16)}
            note={progress(frame, notSqliAt, 16)}
            strike={progress(frame, strikeAt, 14, EASE.inOut)}
          />
        </div>
      ) : null}

      {/* ===== Phases C–D: the encoded line, decoded; the 403 ===== */}
      {decodeIn > 0 && logOut < 1 ? (
        <div style={{ position: 'absolute', left: DECODE.x, top: DECODE.y, height: DECODE_H, ...dimStyle(0.45 * progress(frame, noFilterAt, 14), 1 - logOut) }}>
          <DecodeStrip show={decodeIn} pairs={pairs} label={progress(frame, sameAt, 14)} />
        </div>
      ) : null}
      {noteIn > 0 && logOut < 1 ? (
        <>
          <svg width={W} height={660} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: noteIn * (1 - logOut) }}>
            <line x1={x403} y1={row2Bottom + 4} x2={x403} y2={mix(row2Bottom + 4, NOTE403.y - 4, noteIn)} stroke={alpha(C.amber, 0.85)} strokeWidth={3} strokeLinecap="round" />
            <circle cx={x403} cy={row2Bottom + 4} r={5} fill={C.amber} />
          </svg>
          <div style={{ position: 'absolute', left: NOTE403.x, top: NOTE403.y, opacity: 1 - logOut }}>
            <NoFilterNote show={noteIn} file={progress(frame, otherAt, 12)} filter={progress(frame, filterAt, 12)} />
          </div>
        </>
      ) : null}

      {/* ===== Phase E: the defence, drawn on the plan ===== */}
      {planE > 0 ? (
        <>
          <div style={{ position: 'absolute', left: PLAN_E.x, top: PLAN_E.y, opacity: planE, transform: `translateY(${(1 - planE) * 18}px) scale(${PLAN_E.s})`, transformOrigin: '0 0' }}>
            <FolderPlan
              steps={[1, 1, 1, 1]}
              etc={1}
              file={1}
              marker={false}
              clerk={progress(frame, s8.from + 4, 14)}
              calc={calc}
              resolve={resolve}
              confine={confine}
              reject={reject}
            />
          </div>
          <DefenceLabel resolve={resolve} confine={confine} y={DEF_Y} />
        </>
      ) : null}
    </Stage>
  );
}

/** «resolver la ruta · comprobar que sigue dentro», each half lit on its beat (emerald: what holds). */
function DefenceLabel({ resolve, confine, y }: { resolve: number; confine: number; y: number }) {
  if (resolve <= 0) return null;
  const part = (text: string, p: number) => (
    <span
      style={{
        display: 'inline-block',
        opacity: p,
        transform: `translateY(${(1 - p) * 10}px)`,
        color: '#6ee7b7',
        textShadow: `0 0 22px ${alpha(C.emerald, 0.35 * p)}`,
      }}
    >
      {text}
    </span>
  );
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: y,
        width: W,
        textAlign: 'center',
        fontFamily: FONT.sans,
        fontSize: 48,
        fontWeight: 850,
        letterSpacing: -0.3,
        whiteSpace: 'nowrap',
      }}
    >
      {part(DEFENCE.resolve, resolve)}
      <span style={{ color: C.faint, opacity: confine, whiteSpace: 'pre' }}>{DEFENCE.sep}</span>
      {part(DEFENCE.confine, confine)}
      <div style={{ margin: '12px auto 0', width: mix(0, 980, clamp01(resolve * 0.5 + confine * 0.5)), height: 3, borderRadius: 2, background: alpha(C.emerald, 0.6) }} />
    </div>
  );
}


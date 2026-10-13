import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { EASE, progress } from '../../../engine/src/theme/motion';
import { mix, windowWeight } from '../../../engine/src/ui';
import { DecisionStamp } from './parts/DecisionStamp';
import { CarnetExplainer, LostExample, NameBlock, NeedChips } from './parts/s04-enterprise/Bits';
import { Carnets } from './parts/s04-enterprise/Carnets';
import { Fleet } from './parts/s04-enterprise/Fleet';
import { StairKeypad } from './parts/s04-enterprise/Keypad';
import { RadiusCard } from './parts/s04-enterprise/Radius';
import { Reply, Sign } from './parts/s04-enterprise/Sign';
import { COL_X, H, KEYPAD_BIG, KEYPAD_SMALL, LOST, RADIUS_CARD, RAIL_FROM, SIGN_BIG, SIGN_SMALL, TABLET, W } from './parts/s04-enterprise/layout';
import { Stage, wordFrame } from './kit';

const S = 's04-enterprise';
const between = (a: { x: number; y: number; scale: number }, b: { x: number; y: number; scale: number }, t: number) => ({ x: mix(a.x, b.x, t), y: mix(a.y, b.y, t), scale: mix(a.scale, b.scale, t) });

/**
 * s04-enterprise «La clave de todos». Left: whoever lets the tablets in; right: the crane tablets.
 *   (open)     the sign with the shared key is on screen from the first frame, low: SILENT PAGER's
 *              card types out over it (top-centre stays free until s04-01 ends).
 *   shared     the sign lights; «larga aguanta las pruebas, sí».
 *   long-key   «mira quién la sabe»: «toda la terminal» lights on the sign and ONE amber rail takes
 *              the same key to every tablet.
 *   lost       the image: the stairwell keypad, whose code the whole building knows (the sign goes
 *              small over it). On «Si se pierde…»: «ejemplo · sin fecha», one tablet is lost and the
 *              key has to be changed on all the others.
 *   accept     enterprise mode: the keypad steps back; each tablet shows its own carné (its seal is
 *              its certificate), the RADIUS server decides and writes line 1 of its log, under the
 *              label «ejemplo · sin fecha · no es el registro del puerto» (there to the last frame).
 *   revoke     line 2; the lost tablet's carné is annulled.
 *   reject     line 3 (rose) and, on «Las demás…», line 4: the others never notice.
 *   aaa        WPA3-ENTERPRISE and what stands under it, in the top band.
 *   needs      the three chips. Everything is still when the exam card lands.
 *   decision   the stamp, bottom-left (s05 opens with it there and completes it).
 */
export function S04Enterprise(props: SceneProps) {
  const frame = useCurrentFrame();
  const at = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);
  const p = (start: number, dur = 12) => progress(frame, start, dur);

  const sharedAt = props.cue('shared');
  const longAt = props.cue('long-key');
  const lostAt = props.cue('lost');
  const acceptAt = props.cue('accept');
  const revokeAt = props.cue('revoke');
  const rejectAt = props.cue('reject');
  const aaaAt = props.cue('aaa');
  const needsAt = props.cue('needs');
  const decisionAt = props.cue('decision');

  // ---------------- The shared key ----------------
  const toKeypad = progress(frame, lostAt, 22, EASE.inOut);
  const toEnterprise = progress(frame, acceptAt - 6, 18, EASE.inOut);
  const railDraw = progress(frame, longAt - 2, 26, EASE.inOut);
  const shared = TABLET.xs.map((_, i) => p(longAt + 4 + i * 5, 12));
  const codigoAt = at('s04-02', 'código') - 4;

  // ---------------- The example: one tablet is lost ----------------
  const siAt = at('s04-02', 'Si') - 6;
  const lost = progress(frame, at('s04-02', 'pierde') - 4, 18, EASE.inOut);
  const cambiarAt = at('s04-02', 'cambiarlo') - 6;
  const change = TABLET.xs.map((_, i) => (i === LOST ? 0 : progress(frame, cambiarAt + i * 5, 22, EASE.inOut)));

  // ---------------- Enterprise mode ----------------
  const ensenaAt = at('s04-03', 'enseña') - 4;
  const carneAt = at('s04-03', 'carné') - 6;
  const sealAt = at('s04-03', 'certificado') - 4;
  const servidorAt = at('s04-03', 'servidor') - 4;
  const decideAt = at('s04-03', 'decide') - 2;
  const rise = TABLET.xs.map((_, i) => progress(frame, ensenaAt + i * 4, 14, EASE.out));
  const verdict = TABLET.xs.map((_, i) => p(decideAt + i * 3, 10));
  const anulaAt = Math.max(revokeAt, at('s04-04', 'anula') - 4);
  const revoked = progress(frame, anulaAt, 14, EASE.inOut);
  const reject = progress(frame, rejectAt, 10, EASE.out);
  const demasAt = at('s04-04', 'demás') - 6;
  const calm = windowWeight(frame, demasAt, aaaAt - 6);

  // The log: one line per beat, each lit while it is the line of the moment.
  const lineAt = [decideAt, revokeAt, rejectAt - 2, demasAt];
  const lines = lineAt.map((a) => p(a, 10));
  const lit = lineAt.map((a, i) => windowWeight(frame, a, lineAt[i + 1] ?? aaaAt - 6));
  const serverGlow = Math.max(windowWeight(frame, servidorAt, revokeAt - 6), windowWeight(frame, needsAt, decisionAt - 20));

  // ---------------- The names ----------------
  const topOut = progress(frame, aaaAt - 12, 12, EASE.inOut);
  const nameIn = p(Math.max(aaaAt, at('s04-05', 'WPA3') - 6), 14);
  const sub = [p(at('s04-05', '802.1X') - 4), p(needsAt - 2), p(at('s04-05', 'autentica') - 4)];
  const needs = [0, 1, 2].map((i) => p(needsAt + 4 + i * 6, 12));
  const stamp = progress(frame, decisionAt - 2, 12, EASE.out);
  const closing = windowWeight(frame, at('s04-06', 'enterprise') - 2, Number.POSITIVE_INFINITY);

  return (
    <Stage>
      {/* ---- Left: the shared key, then its image ---- */}
      <StairKeypad
        at={between(KEYPAD_BIG, KEYPAD_SMALL, toEnterprise)}
        show={p(lostAt + 16, 14) * (1 - topOut)}
        lit={p(codigoAt, 14)}
        change={p(cambiarAt, 12) * (1 - toEnterprise)}
        caption={p(codigoAt, 12) * (1 - toEnterprise)}
        dim={toEnterprise}
      />
      <Sign at={between(SIGN_BIG, SIGN_SMALL, toKeypad)} show={1 - toEnterprise} lit={Math.max(0.25, windowWeight(frame, sharedAt, lostAt + 8))} who={windowWeight(frame, longAt, lostAt + 8)} dim={0.3 * toKeypad} />

      {/* ---- Left: the RADIUS server and its log (the example label is part of the card) ---- */}
      <RadiusCard show={p(acceptAt + 2, 16)} label={p(acceptAt + 8, 12)} glow={serverGlow} lines={lines} lit={lit} />

      {/* ---- Right: the tablets ---- */}
      <svg width={W} height={H} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        <Fleet
          shared={shared}
          rail={{ from: mix(RAIL_FROM.sign, RAIL_FROM.keypad, toKeypad), draw: railDraw, opacity: 1 - toEnterprise }}
          lost={lost}
          change={change}
          dim={toEnterprise}
        />
        <Carnets rise={rise} seal={p(sealAt, 12)} trunk={{ from: RADIUS_CARD.x + RADIUS_CARD.w, draw: progress(frame, servidorAt, 22, EASE.inOut) }} verdict={verdict} revoked={revoked} reject={reject} calm={calm} glow={0.6 * closing} />
      </svg>
      <Reply x={COL_X} y={238} first={p(sharedAt - 2, 14)} second={p(longAt - 4, 14)} out={p(siAt - 6, 10)} />
      <LostExample x={COL_X} right={W} y={196} label={p(siAt, 12)} line={p(siAt + 4, 12) * (1 - toEnterprise)} />

      {/* ---- Top band: free while the intercepted message is up; then the carné, then the names ---- */}
      <CarnetExplainer x={1120} y={98} card={p(carneAt, 14)} seal={p(sealAt, 12)} out={topOut} />
      <NameBlock x={0} y={2} show={nameIn} sub={sub} glow={windowWeight(frame, aaaAt, needsAt + 30)} />
      <NeedChips right={W} y={8} show={needs} />

      {/* ---- The decision ---- */}
      <DecisionStamp show={stamp} glow={0.7 * windowWeight(frame, decisionAt, Number.POSITIVE_INFINITY)} />
    </Stage>
  );
}

import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, alpha } from '../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../engine/src/theme/motion';
import { Icon, windowWeight } from '../../../engine/src/ui';
import { S08 } from '../data/s08-mezcla';
import { PAINT_LAYOUT, PaintExchange, paintPotHeight } from './parts/PaintMix';
import { TermTag } from './parts/s04-huella/marks';
import { Stage, segment, wordFrame } from './kit';

const S = 's08-mezcla';
const W = 1728;
const L = PAINT_LAYOUT;
const POT_H = paintPotHeight(L.potW);

/**
 * s08-mezcla «Pinturas en la carretera». The whole scene is PaintExchange (parts/PaintMix.tsx) on
 * s02's road, with s02's shadow under it and the two sides' badges at the ends.
 *   road        s02's question comes back: the dashed copy of the key on the road, the shadow
 *               watching it, «¿cómo le llega la copia de la llave?» in amber.
 *   common      «color común · lo ve todo el mundo» at the top centre; on «mundo» a copy goes to
 *               each side.
 *   secrets     the port's secret pot (on «puerto») is poured into its copy (on «añade»); the
 *               shipping company's (on «naviera»/«suyo»).
 *   swap        the two mixtures cross the road; the shadow's eye lines follow them and it keeps a
 *               copy of each.
 *   same        each side pours its secret into the other's mixture: both pots turn the same colour
 *               (on «mismo»: «los dos llegan al mismo color», both glow).
 *   unmix       the shadow and its copies light: «solo mezclas · una mezcla no se separa».
 *   choice      the two final pots glow; the think prompt finds the top centre empty (nothing has
 *               said what travels, nothing names the key, the final colour is never on the road).
 *   s08-06      «no viaja · cada lado lo calcula» (on «No»), a check by each final pot (on
 *               «calcula»); dh: DIFFIE-HELLMAN · «ECDH: la misma idea con curvas elípticas».
 *   with-whom   under the shadow, amber: «la pintura no dice con quién has mezclado».
 *   session-key the final pots become s02's house key in the final colour (on «sale»), one per
 *               side: SESSION KEY · «la copia que nadie tuvo que llevar». Holds.
 */
export function S08Mezcla(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const w = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);

  const roadAt = props.cue('road');
  const commonAt = props.cue('common');
  const secretsAt = props.cue('secrets');
  const swapAt = props.cue('swap');
  const sameAt = props.cue('same');
  const unmixAt = props.cue('unmix');
  const choiceAt = props.cue('choice');
  const dhAt = props.cue('dh');
  const withWhomAt = props.cue('with-whom');
  const sessionKeyAt = props.cue('session-key');
  const s05 = segment(props, 's08-05');
  const s06 = segment(props, 's08-06');

  const at = {
    pinturas: w('s08-02', 'pinturas'),
    mundo: w('s08-02', 'mundo'),
    puerto: w('s08-02', 'puerto'),
    anade: w('s08-02', 'añade'),
    naviera: w('s08-02', 'naviera'),
    suyo: w('s08-02', 'suyo'),
    echa: w('s08-03', 'echa'),
    mismo: w('s08-03', 'mismo'),
    no: w('s08-06', 'No'),
    calcula: w('s08-06', 'calcula'),
    curvas: w('s08-06', 'curvas'),
    pintura: w('s08-07', 'pintura'),
    sale: w('s08-08', 'sale'),
    copia: w('s08-08', 'copia'),
    sesion: w('s08-08', 'sesión'),
  };

  // ---- the diagram
  const scene = progress(frame, 0, 16);
  const question = progress(frame, Math.min(roadAt, 8), 16) * (1 - progress(frame, Math.min(at.pinturas, commonAt - 16), 16, EASE.inOut));
  const common = progress(frame, commonAt - 4, 16);
  const share = progress(frame, Math.max(commonAt + 16, at.mundo - 8), 36, EASE.inOut);
  const shareEnd = Math.max(commonAt + 16, at.mundo - 8) + 36;
  const secretPort = progress(frame, Math.max(secretsAt, at.puerto - 6), 14);
  const mixPortFrom = Math.max(shareEnd, at.anade - 4);
  const mixPort = progress(frame, mixPortFrom, 40, EASE.linear);
  const secretNav = progress(frame, at.naviera - 6, 14);
  const mixNavFrom = Math.max(shareEnd, Math.min(at.suyo - 14, swapAt - 44));
  const mixNav = progress(frame, mixNavFrom, 40, EASE.linear);
  const swapFrom = Math.max(swapAt, mixNavFrom + 40);
  const swap = progress(frame, swapFrom, 76, EASE.linear);
  const peek = progress(frame, swapFrom + 34, 16);
  const pourFrom = Math.max(swapFrom + 78, Math.min(sameAt, at.echa - 10));
  const pour = progress(frame, pourFrom, 56, EASE.linear);
  const sameGlow = Math.max(
    windowWeight(frame, Math.max(pourFrom + 56, at.mismo - 4), unmixAt, { ramp: 12 }),
    0.8 * windowWeight(frame, choiceAt, s05.to, { ramp: 12 }),
    0.6 * windowWeight(frame, at.calcula, withWhomAt, { ramp: 12 }),
  );
  const peekGlow = windowWeight(frame, unmixAt - 2, choiceAt + 10, { ramp: 12 });
  const keys = progress(frame, at.sale - 6, 30, EASE.inOut);

  // ---- statements under the shadow
  const sameLine = windowWeight(frame, at.mismo - 4, unmixAt - 4, { ramp: 10 });
  const unmixLine = windowWeight(frame, unmixAt + 2, withWhomAt, { ramp: 12 }) * (1 - 0.5 * windowWeight(frame, choiceAt, s05.to, { ramp: 12 }));
  const limitLine = progress(frame, at.pintura - 6, 14) * (1 - 0.45 * progress(frame, at.sale, 20));
  const questionLine = question;

  // ---- top: the answer, Diffie-Hellman, then the session key
  const answerIn = progress(frame, Math.max(s06.from, at.no - 4), 14) * (1 - progress(frame, sessionKeyAt - 6, 14, EASE.inOut));
  const checks = progress(frame, at.calcula - 4, 12) * (1 - progress(frame, at.sale - 6, 14));
  const dhOut = progress(frame, sessionKeyAt - 6, 14, EASE.inOut);
  const copyLine = progress(frame, at.copia - 6, 16);

  return (
    <Stage style={{ fontFamily: FONT.sans }}>
      <PaintExchange
        frame={frame}
        scene={scene}
        question={question}
        common={common}
        share={share}
        secretPort={secretPort}
        secretNav={secretNav}
        mixPort={mixPort}
        mixNav={mixNav}
        swap={swap}
        peek={peek}
        pour={pour}
        same={sameGlow}
        keys={keys}
        peekGlow={peekGlow}
      />

      {/* One line under the shadow: the question, «mismo color», «una mezcla no se separa», the limit */}
      <Statement text={S08.question} p={questionLine} color="#fde68a" />
      <Statement text={S08.same} p={sameLine} color="#6ee7b7" />
      <Statement text={S08.unmix} p={unmixLine} color={C.text} />
      <Statement text={S08.limit} p={limitLine} color="#fde68a" icon />

      {/* «cada lado lo calcula»: a check by each final pot */}
      {checks > 0.001
        ? [L.mixPort, L.mixNav].map((p, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: p.x + (i === 0 ? 50 : -50) - 26,
                top: p.y - POT_H - 30,
                width: 52,
                height: 52,
                borderRadius: 26,
                display: 'grid',
                placeItems: 'center',
                background: alpha(C.emeraldDeep, 0.92),
                border: `3px solid ${C.emerald}`,
                opacity: checks,
                transform: `scale(${1.3 - 0.3 * checks})`,
              }}
            >
              <Icon name="check" size={30} color={C.emerald} strokeWidth={3} />
            </div>
          ))
        : null}

      {/* The answer (after the think prompt) */}
      {answerIn > 0.001 ? (
        <div style={{ position: 'absolute', left: 0, width: W, top: 14, display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: 18, opacity: answerIn, transform: `translateY(${(1 - answerIn) * -8}px)`, whiteSpace: 'nowrap' }}>
          <span style={{ fontSize: 54, fontWeight: 880, color: '#6ee7b7' }}>{S08.answer.lead}</span>
          <span style={{ fontSize: 44, fontWeight: 760, color: C.muted }}>·</span>
          <span style={{ fontSize: 44, fontWeight: 800, color: C.textStrong }}>{S08.answer.rest}</span>
        </div>
      ) : null}
      {dhOut < 1 ? (
        <div style={{ position: 'absolute', left: 0, width: W, top: 98, display: 'flex', justifyContent: 'center', opacity: 1 - dhOut }}>
          <TermTag frame={frame} fps={fps} at={dhAt + 2} term={S08.dh.term} sub={S08.dh.sub} subAt={at.curvas - 4} size={54} subSize={34} align="center" />
        </div>
      ) : null}

      {/* SESSION KEY: the copy nobody had to carry */}
      {copyLine > 0.001 ? (
        <div style={{ position: 'absolute', left: 0, width: W, top: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18 }}>
          <TermTag frame={frame} fps={fps} at={at.sesion - 6} term={S08.sessionKey.term} size={58} align="center" />
          <div style={{ fontSize: 44, fontWeight: 820, color: C.textStrong, whiteSpace: 'nowrap', opacity: copyLine, transform: `translateY(${(1 - copyLine) * 10}px)` }}>{S08.sessionKey.sub}</div>
        </div>
      ) : null}
    </Stage>
  );
}

/** One statement line in the band under the shadow (centred). */
function Statement({ text, p, color, icon = false }: { text: string; p: number; color: string; icon?: boolean }) {
  if (p <= 0.001) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        width: W,
        top: L.underOnlooker.y + 6,
        display: 'flex',
        justifyContent: 'center',
        opacity: p,
        transform: `translateY(${(1 - p) * 8}px)`,
      }}
    >
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 12, padding: '4px 18px', borderRadius: 14, background: alpha(C.ink950, 0.82), fontSize: 38, fontWeight: 800, color, whiteSpace: 'nowrap' }}>
        {icon ? <Icon name="alert" size={36} color={C.amber} strokeWidth={2.4} /> : null}
        {text}
      </span>
    </div>
  );
}

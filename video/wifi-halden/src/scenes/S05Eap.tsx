import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, alpha } from '../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../engine/src/theme/motion';
import { windowWeight } from '../../../engine/src/ui';
import { EAP, LANES, OPTIONS } from '../data/s05-eap';
import { DecisionStamp } from './parts/DecisionStamp';
import { EapSpine, Lane, OptionButton } from './parts/s05-eap/Lanes';
import { PeapText, TlsText, WeakerTag } from './parts/s05-eap/LaneText';
import { PeapArt } from './parts/s05-eap/PeapArt';
import { TlsArt } from './parts/s05-eap/TlsArt';
import { LANE_X, W } from './parts/s05-eap/layout';
import { Stage, wordFrame } from './kit';

const S = 's05-eap';
const VIOLET_SOFT = '#c4b5fd';

/**
 * s05-eap «Dos formas de entrar». The decision stamp of s04 is on screen from the first frame, in
 * its s04 form, bottom-left.
 *   lanes      «802.1X» and, big, «EAP» in the top band; on «grupos» EAP comes down between the two
 *              groups, whose titles land on their own words: «EAP-TLS», then «PEAP», «· TTLS».
 *   think      the premise, left of the prompt: a tablet with its carné. Then the two buttons, one
 *              in each (empty) group. Nothing moves during the hold and the top-centre is free: the
 *              groups show only their titles, no colour and no drawing.
 *   answer     «EAP-TLS» is chosen; the stamp gains «· EAP-TLS»; the tablet and its carné go over
 *              the EAP-TLS group.
 *   peap       the PEAP · TTLS picture: user and password inside a tunnel to the server; only the
 *              server has a certificate.
 *   validate   «más débil que EAP-TLS» and, big, the warning: the client has to validate the
 *              server's certificate.
 *   fake-ap    outside the terminal, «hipótesis»: a fake access point with the same network name
 *              takes the «credenciales».
 *   tls        the EAP-TLS picture: a certificate on each side.
 *   mutual     each one checks the other: «autenticación mutua», then «no hay contraseña que
 *              robar». Everything is in place before `wrap`, when the exam card lands.
 *   wrap       lights only: the last line, then PEAP's warning again.
 */
export function S05Eap(props: SceneProps) {
  const frame = useCurrentFrame();
  const at = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);
  const p = (start: number, dur = 12) => progress(frame, start, dur);

  const lanesAt = props.cue('lanes');
  const thinkAt = props.cue('think');
  const answerAt = props.cue('answer');
  const peapAt = props.cue('peap');
  const validateAt = props.cue('validate');
  const fakeAt = props.cue('fake-ap');
  const tlsAt = props.cue('tls');
  const mutualAt = props.cue('mutual');
  const wrapAt = props.cue('wrap');

  // ---------------- The two groups ----------------
  const lanesIn = 0.5 + 0.5 * p(lanesAt - 4, 14);
  const gruposAt = at('s05-01', 'grupos') - 6;
  const dot1xIn = p(at('s05-01', '802.1X') - 4);
  const heroIn = p(at('s05-01', 'EAP') - 4, 14);
  const heroOut = progress(frame, gruposAt, 16, EASE.inOut);
  const spine = p(gruposAt + 8, 10);
  const title = { tls: p(at('s05-01', 'EAP-TLS') - 4), peap: p(at('s05-01', 'PEAP') - 4), ttls: p(at('s05-01', 'TTLS') - 4) };

  // ---------------- The question ----------------
  const premise = p(thinkAt, 14);
  const premiseCarnet = p(at('s05-02', 'tienen') - 4, 12);
  const premiseSeal = p(at('s05-02', 'certificado') - 4, 12);
  const buttonsAt = at('s05-02', 'cuál') - 8;

  // ---------------- The answer ----------------
  const chosen = p(answerAt, 12);
  const eap = progress(frame, answerAt + 2, 14, EASE.inOut);
  const move = progress(frame, answerAt + 10, 26, EASE.inOut);
  const stampGlow = Math.max(0.7 * (1 - progress(frame, 10, 40, EASE.inOut)), 0.7 * windowWeight(frame, answerAt + 2, peapAt - 10));

  // ---------------- PEAP · TTLS ----------------
  const usuarioAt = at('s05-03', 'usuario') - 4;
  const tunelAt = at('s05-03', 'túnel');
  const creds = progress(frame, usuarioAt, Math.max(24, tunelAt - usuarioAt + 6), EASE.inOut);
  const warningAt = at('s05-04', 'dependen') - 6;
  const steal = progress(frame, at('s05-04', 'recoge') - 2, 22, EASE.inOut);

  // ---------------- EAP-TLS ----------------
  const up = progress(frame, mutualAt - 2, 16, EASE.inOut);
  const down = progress(frame, at('s05-05', 'comprueba') - 2, 16, EASE.inOut);
  // The third line is in place before the exam card lands (on `wrap`); the voice lights it later.
  const nothingAt = Math.max(mutualAt + 24, wrapAt - 22);
  const again = windowWeight(frame, at('s05-05', 'PEAP'), Number.POSITIVE_INFINITY);
  const warn = Math.max(windowWeight(frame, warningAt, fakeAt - 6), 0.8 * again);
  const litNothing = windowWeight(frame, at('s05-05', 'contraseña') - 2, at('s05-05', 'PEAP') - 2);

  return (
    <Stage>
      {/* ---- Top band, first sentence only: 802.1X, and EAP inside it ---- */}
      {heroIn * (1 - heroOut) > 0.001 || dot1xIn * (1 - heroOut) > 0.001 ? (
        <div style={{ position: 'absolute', left: 0, top: 18, width: W, display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: FONT.sans, whiteSpace: 'nowrap', opacity: 1 - heroOut, transform: `translateY(${heroOut * 96}px) scale(${1 - 0.5 * heroOut})`, transformOrigin: '50% 100%' }}>
          <div style={{ fontSize: 44, fontWeight: 820, letterSpacing: 1, color: alpha(VIOLET_SOFT, 0.85), opacity: dot1xIn }}>802.1X</div>
          <div style={{ fontSize: 120, fontWeight: 900, letterSpacing: 2, lineHeight: 1.05, color: '#ede9fe', textShadow: `0 0 34px ${alpha(C.violet, 0.6)}`, opacity: heroIn, transform: `scale(${0.9 + 0.1 * heroIn})` }}>{EAP}</div>
        </div>
      ) : null}

      {/* ---- The pictures (nothing here until `answer`, except the premise at the far left) ---- */}
      <PeapArt
        show={p(peapAt - 6, 14)}
        tunnel={progress(frame, at('s05-03', 'dentro') - 6, 18, EASE.inOut)}
        creds={creds}
        cert={p(at('s05-03', 'TLS') + 4, 12)}
        check={p(at('s05-04', 'valide') - 4, 12)}
        fake={p(fakeAt - 2, 14)}
        name={p(at('s05-04', 'falso') - 4, 12)}
        steal={steal}
        word={p(at('s05-04', 'credenciales') - 2, 12)}
      />
      <TlsArt tablet={premise} carnet={premiseCarnet} seal={premiseSeal} move={move} server={p(tlsAt - 4, 14)} cert={p(at('s05-05', 'dos') - 4, 12)} up={up} down={down} glow={windowWeight(frame, mutualAt, wrapAt + 6)} />

      {/* ---- The two groups ---- */}
      <Lane
        x={LANE_X.peap}
        show={lanesIn}
        edge={C.amber}
        tone={p(validateAt, 14)}
        glow={warn}
        title={
          <>
            <span style={{ opacity: title.peap }}>{LANES.peap[0]}</span>
            <span style={{ opacity: title.ttls }}>
              <span style={{ margin: '0 4px', color: alpha(VIOLET_SOFT, 0.6) }}>·</span> {LANES.peap[1]}
            </span>
          </>
        }
        tag={<WeakerTag show={p(at('s05-04', 'débiles') - 4)} />}
      >
        <OptionButton label={OPTIONS.peap} show={p(buttonsAt) * (1 - p(peapAt - 14, 10))} chosen={-chosen} />
        <PeapText inside={p(usuarioAt - 2)} cert={p(at('s05-03', 'TLS') + 4, 12)} warning={p(warningAt, 14)} warn={warn} />
      </Lane>
      <Lane x={LANE_X.tls} show={lanesIn} tone={p(answerAt + 2, 14)} glow={windowWeight(frame, answerAt + 2, peapAt - 10)} title={<span style={{ opacity: title.tls }}>{LANES.tls}</span>}>
        <OptionButton label={OPTIONS.tls} show={p(buttonsAt + 5) * (1 - p(tlsAt - 14, 10))} chosen={chosen} />
        <TlsText both={p(tlsAt - 2)} mutual={p(mutualAt + 4, 12)} nothing={p(nothingAt, 10)} lit={[windowWeight(frame, mutualAt + 4, wrapAt), litNothing]} />
      </Lane>
      <EapSpine show={spine} />

      {/* ---- The decision: s04's stamp, completed on `answer` ---- */}
      <DecisionStamp eap={eap} eapGlow={windowWeight(frame, answerAt + 2, peapAt - 10)} glow={stampGlow} />
    </Stage>
  );
}

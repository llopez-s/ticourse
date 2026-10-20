import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { Icon } from '../../../engine/src/ui';
import { SisterPhoneArt } from './parts/Images';
import { CaseStamp, Pill, TermName } from './parts/Labels';
import { BecMail } from './parts/Messages';
import { ImageTag } from './parts/Tags';
import { Stage, wordFrame } from './kit';

const S = 's03-bec';
const MAIL_TOP = 76;
const COL_X = 960;
const NOTHING = ['enlaces: ninguno', 'adjuntos: ninguno', 'el antivirus: nada que mirar'];
const CHECKS = ['SPF', 'DKIM', 'DMARC'];

/**
 * s03-bec «Un correo de un directivo». A «supuesto» (amber stamp). On `bec-mail` the mail comes in from a director's
 * real mailbox (cyan, «el de verdad», no name or post) to Finanzas; on «colado» the rose intruder shows inside that
 * mailbox; `ask` writes the urgent payment to a new account, `excuse` the meeting and the secrecy, then the signature
 * «¿dudas? a mi móvil nuevo · número en la firma» (digit blocks). On the right, `nothing`: links none, attachments none,
 * nothing for the antivirus; `green`: SPF, DKIM and DMARC pass in emerald, «es su buzón: todo cuadra». `sister` swaps
 * them for the stolen phone of your sister (small, «imagen · no es del puerto»). `names` lands BUSINESS EMAIL
 * COMPROMISE (BEC) under the mail; `pretext` rings the excuse and ties PRETEXTING to it; `lookalike` adds the small
 * line about a forged port domain. No domains, no alignment.
 */
export function S03Bec(props: SceneProps) {
  const frame = useCurrentFrame();
  const mailAt = props.cue('bec-mail') - 6;
  const insideAt = wordFrame(S, 's03-02', 'colado') - 6;
  const askAt = props.cue('ask') - 4;
  const excuseAt = props.cue('excuse') - 4;
  const signAt = wordFrame(S, 's03-03', 'nadie') + 6;
  const nothingAt = props.cue('nothing') - 4;
  const rowAt = [nothingAt, wordFrame(S, 's03-04', 'adjunto') - 6, wordFrame(S, 's03-04', 'antivirus') - 6];
  const greenAt = props.cue('green') - 4;
  const checkAt = [greenAt, wordFrame(S, 's03-05', 'DKIM') - 6, wordFrame(S, 's03-05', 'DMARC') - 6];
  const cuadraAt = wordFrame(S, 's03-05', 'suyo') - 10;
  const sisterAt = props.cue('sister') - 6;
  const namesAt = props.cue('names') - 4;
  const pretextAt = props.cue('pretext') - 4;
  const lookAt = props.cue('lookalike') - 4;

  const stampIn = enter(frame, -6, { distance: 14, duration: 16 });
  const mailIn = enter(frame, mailAt, { distance: 26, axis: 'x', duration: 18 });
  const phaseA = progress(frame, nothingAt, 14) * (1 - progress(frame, sisterAt - 12, 14, EASE.inOut));
  const sister = progress(frame, sisterAt, 18) * (1 - progress(frame, pretextAt - 14, 14, EASE.inOut));
  const hand = progress(frame, wordFrame(S, 's03-06', 'pero') - 8, 16);
  const bec = enter(frame, namesAt, { distance: 16, duration: 16 });
  const pre = progress(frame, pretextAt, 16);
  const look = enter(frame, lookAt, { distance: 14, duration: 16 });

  return (
    <Stage>
      <div style={{ position: 'absolute', left: 0, top: 0, ...stampIn }}>
        <CaseStamp what="Supuesto" kind="imagina · sin fecha" tone={C.amber} icon="eye" />
      </div>

      {frame >= mailAt - 2 ? (
        <div style={{ position: 'absolute', left: 0, top: MAIL_TOP, ...mailIn }}>
          <BecMail
            inside={progress(frame, insideAt, 14)}
            ask={progress(frame, askAt, 14)}
            excuse={progress(frame, excuseAt, 14)}
            sign={progress(frame, signAt, 14)}
            excuseGlow={pre}
          />
        </div>
      ) : null}

      {/* nothing technical, and the three checks pass */}
      {phaseA > 0.001 ? (
        <div style={{ position: 'absolute', left: COL_X, top: MAIL_TOP, width: 768, opacity: phaseA, fontFamily: FONT.sans, whiteSpace: 'nowrap' }}>
          <div style={{ boxSizing: 'border-box', padding: '18px 26px', borderRadius: RADIUS.lg, border: `2px solid ${alpha(C.muted, 0.45)}`, background: C.ink900 }}>
            {NOTHING.map((t, i) => (
              <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 16, height: 58, opacity: progress(frame, rowAt[i], 12) }}>
                <Icon name="x" size={34} color={C.muted} strokeWidth={2.6} />
                <span style={{ fontSize: 36, fontWeight: 750, color: C.text }}>{t}</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 16, marginTop: 30 }}>
            {CHECKS.map((c, i) =>
              frame >= checkAt[i] - 2 ? (
                <div key={c} style={enter(frame, checkAt[i], { distance: 12, duration: 12 })}>
                  <Pill text={c} icon="check" tone={C.emerald} size={36} on={1} />
                </div>
              ) : null,
            )}
          </div>
          {frame >= cuadraAt - 2 ? (
            <div style={{ marginTop: 18, fontSize: 40, fontWeight: 800, color: C.emerald, ...enter(frame, cuadraAt, { distance: 12, duration: 14 }) }}>es su buzón: todo cuadra</div>
          ) : null}
        </div>
      ) : null}

      {/* your sister's phone */}
      {sister > 0.001 ? (
        <div style={{ position: 'absolute', left: COL_X + 60, top: 20, opacity: sister, transform: `translateY(${(1 - sister) * 18}px)` }}>
          <SisterPhoneArt width={340} hand={hand} />
          <div style={{ marginTop: 10, marginLeft: 20 }}>
            <ImageTag />
          </div>
        </div>
      ) : null}

      {/* BEC */}
      {frame >= namesAt - 2 ? (
        <div style={{ position: 'absolute', left: 0, top: 574, ...bec }}>
          <TermName term="BUSINESS EMAIL COMPROMISE (BEC)" size={44} />
        </div>
      ) : null}

      {/* PRETEXTING, tied to the excuse */}
      {pre > 0.001 ? (
        <>
          <svg width={1728} height={660} style={{ position: 'absolute', left: 0, top: 0, opacity: pre, pointerEvents: 'none' }}>
            <path d="M 740 410 C 840 410, 880 352, 990 352" stroke={C.amber} strokeWidth={4} fill="none" strokeDasharray="10 8" />
            <circle cx={990} cy={352} r={7} fill={C.amber} />
          </svg>
          <div style={{ position: 'absolute', left: COL_X + 40, top: 296, opacity: pre, transform: `translateX(${(1 - pre) * 20}px)` }}>
            <TermName term="PRETEXTING" gloss="la excusa para saltarse el paso" size={52} tone={C.violet} />
          </div>
        </>
      ) : null}

      {/* a forged port domain is another story */}
      {frame >= lookAt - 2 ? (
        <div style={{ position: 'absolute', left: COL_X + 40, top: 482, fontFamily: FONT.sans, whiteSpace: 'nowrap', ...look }}>
          <div style={{ padding: '12px 22px', borderRadius: RADIUS.md, border: `2px dashed ${alpha(C.sky, 0.6)}`, background: alpha(C.sky, 0.06) }}>
            <div style={{ fontSize: 32, fontWeight: 700, color: C.text }}>o falsificando el dominio del puerto</div>
            <div style={{ fontSize: 32, fontWeight: 800, color: C.sky }}>eso sí lo caza DMARC</div>
          </div>
        </div>
      ) : null}
    </Stage>
  );
}

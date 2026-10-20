import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { Icon } from '../../../engine/src/ui';
import { BankCardArt, PersonArt } from './parts/Images';
import { Caption, CaseStamp, DigitBlocks, TermName } from './parts/Labels';
import { BEC, BEC_W, BecMail } from './parts/Messages';
import { ImageTag } from './parts/Tags';
import { Stage, interceptWindow, wordFrame } from './kit';

const S = 's05-fuera';
const W = STAGE.width;
const MAIL_S = 0.62;
const MAIL_X = Math.round((W - BEC_W * MAIL_S) / 2);
const MAIL_Y = 236;
const CARD_X = 40;
const CARD_Y = 60;
const TERM_X = 600;
const BOOK_W = 1080;

/**
 * s05-fuera «El número de siempre». The «supuesto» of s03 comes back (its amber stamp at the bottom-left, until
 * `ends`). On `how` the question «¿cómo se para algo que no tiene nada técnico?» sits over the director's mail (small);
 * the question folds away before RED MARROW's intercepted message (the ENGINE's card owns the top-centre until the
 * reply ends). On `intercept-reply` the signature's number is ringed in rose and «contesta quien escribe» comes in
 * beside it. `number`/`card`: the bank card («imagen · no es del puerto») turns over and the number on its back lights
 * in emerald. `oob`: OUT-OF-BAND VERIFICATION «por un canal que ya tenías»; `two`: DUAL APPROVAL with two signatures.
 * `ends`: the port's address book, the director in his office, «el pago no sale · al buzón se le cambia la contraseña».
 * `wrap`: «contra un engaño sin código, el control es un paso que no se salta».
 */
export function S05Fuera(props: SceneProps) {
  const frame = useCurrentFrame();
  const howAt = props.cue('how') - 6;
  const msg = interceptWindow(S) ?? [props.cue('intercept-reply') - 200, props.cue('intercept-reply') + 160];
  const replyAt = props.cue('intercept-reply') - 4;
  const writerAt = wordFrame(S, 's05-02', 'contesta') - 6;
  const numberAt = props.cue('number') - 6;
  const cardAt = props.cue('card') - 4;
  const backAt = wordFrame(S, 's05-03', 'detrás') - 8;
  const oobAt = props.cue('oob') - 4;
  const twoAt = props.cue('two') - 4;
  const firmaAt = wordFrame(S, 's05-05', 'segunda') - 6;
  const endsAt = props.cue('ends') - 6;
  const deskAt = wordFrame(S, 's05-06', 'despacho') - 8;
  const saleAt = wordFrame(S, 's05-06', 'sale') - 8;
  const wrapAt = props.cue('wrap') - 4;

  const stamp = progress(frame, -6, 16) * (1 - progress(frame, endsAt, 14, EASE.inOut));
  const qIn = progress(frame, howAt, 16) * (1 - progress(frame, msg[0] - 18, 14, EASE.inOut));
  const mailIn = progress(frame, howAt + 6, 18) * (1 - progress(frame, msg[0] - 22, 14, EASE.inOut));
  const signIn = progress(frame, msg[0] - 8, 16) * (1 - progress(frame, numberAt - 14, 14, EASE.inOut));
  const ring = progress(frame, replyAt, 14);
  const writer = progress(frame, writerAt, 14);
  const phase2 = progress(frame, numberAt, 16) * (1 - progress(frame, endsAt - 16, 16, EASE.inOut));
  const flip = progress(frame, cardAt, 22, EASE.inOut);
  const glow = progress(frame, backAt, 14);
  const oob = enter(frame, oobAt, { distance: 18, duration: 16 });
  const two = enter(frame, twoAt, { distance: 18, duration: 16 });
  const sign2 = progress(frame, firmaAt, 14);
  const book = progress(frame, endsAt, 18);
  const desk = progress(frame, deskAt, 14);
  const sale = enter(frame, saleAt, { distance: 14, duration: 16 });
  const wrap = enter(frame, wrapAt, { distance: 16, duration: 16 });

  return (
    <Stage>
      {/* the supuesto's stamp, at the bottom-left (the top belongs to RED MARROW's card) */}
      {stamp > 0.001 ? (
        <div style={{ position: 'absolute', left: 0, top: 598, opacity: stamp }}>
          <CaseStamp what="Supuesto" kind="imagina · sin fecha" tone={C.amber} icon="eye" />
        </div>
      ) : null}

      {/* the question, until RED MARROW's card comes */}
      {qIn > 0.001 ? (
        <div style={{ position: 'absolute', left: 0, top: 40, width: W, textAlign: 'center', fontFamily: FONT.sans, fontSize: 66, fontWeight: 850, letterSpacing: -1, color: C.textStrong, whiteSpace: 'nowrap', opacity: qIn, transform: `translateY(${(1 - qIn) * 14}px)` }}>
          ¿cómo se para algo que no tiene nada técnico?
        </div>
      ) : null}

      {/* the director's mail, small, under the question */}
      {mailIn > 0.001 ? (
        <div style={{ position: 'absolute', left: MAIL_X, top: MAIL_Y, transformOrigin: '0 0', transform: `scale(${MAIL_S})`, opacity: mailIn }}>
          <BecMail excuseGlow={0} />
        </div>
      ) : null}

      {/* under RED MARROW's card: the mail's signature, big; its number is the writer's */}
      {signIn > 0.001 ? (
        <div style={{ position: 'absolute', left: 0, top: 262, width: W, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 34, opacity: signIn, fontFamily: FONT.sans, whiteSpace: 'nowrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 26, padding: '22px 34px', borderRadius: RADIUS.lg, border: `2px solid ${alpha(C.cyan, 0.5)}`, background: `linear-gradient(180deg, ${C.ink850} 0%, ${C.ink900} 100%)` }}>
            <Icon name="mail" size={44} color={C.cyan} />
            <span style={{ fontSize: 42, fontWeight: 750, color: C.text }}>{BEC.sign}</span>
            <span
              style={{
                display: 'inline-flex',
                padding: '10px 14px',
                borderRadius: 14,
                border: `3px solid ${alpha(C.rose, 0.95 * ring)}`,
                background: alpha(C.rose, 0.1 * ring),
                boxShadow: ring > 0.02 ? `0 0 26px ${alpha(C.rose, 0.4 * ring)}` : undefined,
              }}
            >
              <DigitBlocks n={9} tone={ring > 0.5 ? C.roseSoft : C.muted} w={18} h={30} gap={6} />
            </span>
          </div>
          <div style={{ opacity: writer, transform: `translateY(${(1 - writer) * 14}px)` }}>
            <Caption text="contesta quien escribe" icon="user" tone={C.rose} size={44} />
          </div>
        </div>
      ) : null}

      {/* the bank card, and the two names */}
      {phase2 > 0.001 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: phase2 }}>
          <div style={{ position: 'absolute', left: CARD_X, top: CARD_Y }}>
            <BankCardArt width={460} flip={flip} glow={glow} />
            <div style={{ marginTop: 18, marginLeft: 70 }}>
              <ImageTag />
            </div>
          </div>
          {frame >= oobAt - 2 ? (
            <div style={{ position: 'absolute', left: TERM_X, top: 60, ...oob }}>
              <TermName term="OUT-OF-BAND VERIFICATION" gloss="por un canal que ya tenías" size={54} tone={C.violet} />
            </div>
          ) : null}
          {frame >= twoAt - 2 ? (
            <div style={{ position: 'absolute', left: TERM_X, top: 290, display: 'flex', alignItems: 'center', gap: 40, ...two }}>
              <TermName term="DUAL APPROVAL" gloss="pagos y cambios de cuenta: dos firmas" size={54} tone={C.violet} />
              <div style={{ display: 'flex', gap: 20 }}>
                {[1, sign2].map((o, i) => (
                  <div key={i} style={{ position: 'relative', opacity: 0.25 + 0.75 * o }}>
                    <PersonArt size={110} tone={C.emerald} />
                    <div style={{ position: 'absolute', right: -8, bottom: -6, width: 44, height: 44, borderRadius: 999, background: C.emeraldDeep, border: `2px solid ${C.emerald}`, display: 'grid', placeItems: 'center' }}>
                      <Icon name="check" size={28} color={C.emerald} strokeWidth={3} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      ) : null}

      {/* the port's address book: the director never asked */}
      {book > 0.001 ? (
        <div style={{ position: 'absolute', left: (W - BOOK_W) / 2, top: 30, width: BOOK_W, opacity: book, transform: `translateY(${(1 - book) * 18}px)`, fontFamily: FONT.sans, whiteSpace: 'nowrap' }}>
          <div style={{ boxSizing: 'border-box', borderRadius: RADIUS.lg, border: `2px solid ${alpha(C.cyan, 0.55)}`, background: `linear-gradient(180deg, ${C.ink850} 0%, ${C.ink900} 100%)`, overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, height: 62, padding: '0 26px', background: C.ink800, borderBottom: `2px solid ${C.ink700}` }}>
              <Icon name="archive" size={36} color={C.cyan} />
              <span style={{ fontSize: 36, fontWeight: 800, color: C.textStrong }}>agenda del puerto</span>
            </div>
            <div style={{ padding: '22px 30px 26px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
                <span style={{ fontSize: 36, fontWeight: 750, color: C.text }}>el directivo</span>
                <span style={{ padding: '8px 16px', borderRadius: 12, border: `3px solid ${alpha(C.emerald, 0.85)}`, background: alpha(C.emerald, 0.1), boxShadow: `0 0 20px ${alpha(C.emerald, 0.25)}` }}>
                  <DigitBlocks n={9} tone={C.emerald} w={14} h={24} gap={6} />
                </span>
                <Icon name="check" size={36} color={C.emerald} strokeWidth={3} />
              </div>
              <div style={{ marginTop: 22, fontSize: 38, fontWeight: 800, color: C.cyanSoft, opacity: desk }}>en su despacho · no ha pedido nada</div>
            </div>
          </div>
          {frame >= saleAt - 2 ? (
            <div style={{ marginTop: 28, display: 'flex', justifyContent: 'center', ...sale }}>
              <Caption text="el pago no sale · al buzón se le cambia la contraseña" icon="shield" tone={C.emerald} size={40} />
            </div>
          ) : null}
        </div>
      ) : null}

      {/* the chapter's close */}
      {frame >= wrapAt - 2 ? (
        <div style={{ position: 'absolute', left: 0, top: 500, width: W, display: 'flex', justifyContent: 'center', ...wrap }}>
          <Caption text="contra un engaño sin código, el control es un paso que no se salta" tone={C.violet} size={38} />
        </div>
      ) : null}
    </Stage>
  );
}

import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { Icon, mix } from '../../../engine/src/ui';
import { DeskPhone, DisguiseArt } from './parts/Images';
import { Caption, CaseStamp, Pill, TermName } from './parts/Labels';
import { CASE_TAG, ImageTag } from './parts/Tags';
import { FakeWeb, WaveLogo } from './parts/Web';
import { Stage, interceptWindow, wordFrame } from './kit';

const S = 's07-disfraz';
const W = STAGE.width;
const WEB_W = 860;
const ART_X = 1010;
const ART_Y = 196;
const ART_W = 520;

/** The speech balloon over the phone, with the mask inside: the caller was disguised as someone else. */
function MaskBalloon() {
  return (
    <div style={{ position: 'relative', width: 340, height: 250 }}>
      <svg width={340} height={250} style={{ position: 'absolute', left: 0, top: 0 }}>
        <path d="M24 4 H316 Q336 4 336 24 V196 Q336 216 316 216 H170 L140 246 L144 216 H24 Q4 216 4 196 V24 Q4 4 24 4 Z" fill={alpha(C.rose, 0.1)} stroke={alpha(C.rose, 0.7)} strokeWidth={3} />
      </svg>
      <div style={{ position: 'absolute', left: 70, top: 14 }}>
        <DisguiseArt width={200} crop="mask" />
      </div>
    </div>
  );
}

/**
 * s07-disfraz «Una persona o una empresa». `call-back`: the call of question 1, small (a desk phone, «vishing»), and
 * in its balloon the mask — the caller was disguised as someone else; `person` lands IMPERSONATION «una persona o un
 * cargo: la directora, el técnico, la auditora». `web` («caso de ejemplo · sin fecha»): a web with the port's logo,
 * colours and tone asks hauliers to renew their access accreditation with a card; `brand` turns its rim rose and lands
 * BRAND IMPERSONATION over the disguise image (person dimmed, company lit; «imagen · no es del puerto»). Before RED
 * MARROW's message (the ENGINE's card owns the top-centre) the right side clears and the web drops below it. `logo`:
 * the logo and its copy, «se copia en un minuto»; `https`: «conexión segura» in the address bar (no padlock) and
 * «conexión segura = cifrada · no dice de quién es». After the card: «nadie ha pagado · ni con la llamada ni con la
 * web», and the disguise comes back with «una persona» / «una empresa» under each half.
 */
export function S07Disfraz(props: SceneProps) {
  const frame = useCurrentFrame();
  const callAt = props.cue('call-back') - 6;
  const maskAt = wordFrame(S, 's07-01', 'disfrazaba') - 8;
  const personAt = props.cue('person') - 4;
  const webAt = props.cue('web') - 6;
  const cardWordAt = wordFrame(S, 's07-03', 'tarjeta') - 6;
  const brandAt = props.cue('brand') - 4;
  const msg = interceptWindow(S) ?? [brandAt + 150, props.cue('intercept-reply') + 250];
  const logoAt = props.cue('logo') - 4;
  const httpsAt = props.cue('https') - 4;
  const endAt = Math.max(msg[1] - 4, wordFrame(S, 's07-06', 'nadie') - 10);

  // phase 1: the call
  const p1 = progress(frame, Math.min(-6, callAt), 16) * (1 - progress(frame, webAt - 14, 14, EASE.inOut));
  const mask = progress(frame, maskAt, 14);
  const imp = enter(frame, personAt, { distance: 16, duration: 16 });
  // phase 2: the web; it drops under the card's band before RED MARROW's message
  const webIn = enter(frame, webAt, { distance: 22, axis: 'x', duration: 18 });
  const drop = progress(frame, msg[0] - 26, 22, EASE.inOut);
  const webS = mix(1, 0.86, drop);
  const webY = mix(72, 240, drop);
  const stamp = progress(frame, webAt, 14) * (1 - progress(frame, msg[0] - 30, 12, EASE.inOut));
  const brandIn = progress(frame, brandAt, 16) * (1 - progress(frame, msg[0] - 30, 14, EASE.inOut));
  const rimRose = progress(frame, brandAt, 14);
  // phase 3: during the card, below it
  const logo = progress(frame, logoAt, 14) * (1 - progress(frame, endAt - 14, 14, EASE.inOut));
  const https = progress(frame, httpsAt, 14);
  const httpsBox = https * (1 - progress(frame, endAt - 14, 14, EASE.inOut));
  // phase 4: after the card
  const end = enter(frame, endAt, { distance: 16, duration: 16 });
  const back = progress(frame, endAt + 10, 18);

  const address =
    https > 0.01 ? (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '2px 12px', borderRadius: 999, background: alpha(C.emerald, 0.15 * https), border: `2px solid ${alpha(C.emerald, 0.8 * https)}`, fontSize: 24, fontWeight: 800, color: C.emerald }}>
        conexión segura
      </span>
    ) : undefined;

  return (
    <Stage>
      {/* phase 1: the call of question 1, and the mask */}
      {p1 > 0.001 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: p1 }}>
          <div style={{ position: 'absolute', left: 30, top: 36, opacity: mask, transform: `scale(${0.9 + 0.1 * mask})`, transformOrigin: '50% 100%' }}>
            <MaskBalloon />
          </div>
          <div style={{ position: 'absolute', left: 30, top: 300 }}>
            <DeskPhone width={320} />
          </div>
          <div style={{ position: 'absolute', left: 380, top: 380 }}>
            <Pill text="vishing" tone={C.violet} icon="mortarboard" size={34} />
          </div>
          <div style={{ position: 'absolute', left: 30, top: 512, opacity: mask }}>
            <ImageTag />
          </div>
          {frame >= personAt - 2 ? (
            <div style={{ position: 'absolute', left: 560, top: 110, ...imp }}>
              <TermName term="IMPERSONATION" gloss="una persona o un cargo: la directora, el técnico, la auditora" size={60} />
            </div>
          ) : null}
        </div>
      ) : null}

      {/* the case's stamp, until the card */}
      {stamp > 0.001 ? (
        <div style={{ position: 'absolute', left: 0, top: 0, opacity: stamp }}>
          <CaseStamp what={CASE_TAG} tone={C.cyan} />
        </div>
      ) : null}

      {/* the fake web */}
      {frame >= webAt - 2 ? (
        <div style={{ position: 'absolute', left: 0, top: webY, transformOrigin: '0 0', transform: `scale(${webS})` }}>
          <div style={{ opacity: webIn.opacity, transform: webIn.transform }}>
            <FakeWeb width={WEB_W} form={progress(frame, webAt + 20, 16)} card={progress(frame, cardWordAt, 14)} rim={rimRose > 0.5 ? C.rose : C.cyan} address={address} />
          </div>
        </div>
      ) : null}

      {/* BRAND IMPERSONATION over the disguise image */}
      {brandIn > 0.001 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: brandIn }}>
          <div style={{ position: 'absolute', left: 920, top: 64, transform: `translateY(${(1 - Math.min(1, brandIn * 1.5)) * 16}px)` }}>
            <TermName term="BRAND IMPERSONATION" gloss="toda una organización" size={50} />
          </div>
          <div style={{ position: 'absolute', left: ART_X + 40, top: ART_Y + 30 }}>
            <DisguiseArt width={ART_W - 80} person={0.3} brand={1} />
          </div>
          <div style={{ position: 'absolute', left: ART_X + 70, top: 568 }}>
            <ImageTag />
          </div>
        </div>
      ) : null}

      {/* during the card: the logo is copied, the secure connection says nothing about whose it is */}
      {logo > 0.001 ? (
        <div style={{ position: 'absolute', left: 940, top: 250, width: 788, opacity: logo, fontFamily: FONT.sans, whiteSpace: 'nowrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 26 }}>
            <WaveLogo size={110} tone={C.cyanSoft} />
            <svg width={60} height={40}>
              <path d="M6 12 H54 M6 28 H54" stroke={C.text} strokeWidth={5} strokeLinecap="round" />
            </svg>
            <div style={{ position: 'relative' }}>
              <WaveLogo size={110} tone={C.roseSoft} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Icon name="clock" size={36} color={C.amber} />
              <span style={{ fontSize: 36, fontWeight: 800, color: C.text }}>se copia en un minuto</span>
            </div>
          </div>
        </div>
      ) : null}
      {httpsBox > 0.001 ? (
        <div style={{ position: 'absolute', left: 940, top: 420, opacity: httpsBox, transform: `translateY(${(1 - httpsBox) * 14}px)`, fontFamily: FONT.sans, whiteSpace: 'nowrap' }}>
          <div style={{ padding: '16px 28px', borderRadius: RADIUS.lg, border: `2px solid ${alpha(C.emerald, 0.6)}`, background: alpha(C.emerald, 0.07) }}>
            <div style={{ fontSize: 42, fontWeight: 850, color: C.emerald }}>conexión segura = cifrada</div>
            <div style={{ fontSize: 42, fontWeight: 850, color: C.roseSoft }}>no dice de quién es</div>
          </div>
        </div>
      ) : null}

      {/* after the card */}
      {frame >= endAt - 2 ? (
        <div style={{ position: 'absolute', left: 0, top: 40, width: W, display: 'flex', justifyContent: 'center', ...end }}>
          <Caption text="nadie ha pagado · ni con la llamada ni con la web" icon="shield" tone={C.emerald} size={42} />
        </div>
      ) : null}
      {back > 0.001 ? (
        <div style={{ position: 'absolute', left: ART_X - 20, top: 190, opacity: back, fontFamily: FONT.sans }}>
          <DisguiseArt width={ART_W - 20} person={1} brand={1} />
          <div style={{ position: 'relative', height: 50, marginTop: 4 }}>
            {[
              { t: 'una persona', x: (151 / 640) * (ART_W - 20) },
              { t: 'una empresa', x: (475 / 640) * (ART_W - 20) },
            ].map((l) => (
              <div key={l.t} style={{ position: 'absolute', left: l.x, top: 0, transform: 'translateX(-50%)', fontSize: 34, fontWeight: 800, color: C.text, whiteSpace: 'nowrap' }}>
                {l.t}
              </div>
            ))}
          </div>
          <div style={{ marginTop: 10, marginLeft: 90 }}>
            <ImageTag />
          </div>
        </div>
      ) : null}
    </Stage>
  );
}

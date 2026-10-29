import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, pulse, progress } from '../../../engine/src/theme/motion';
import { Chip } from '../../../engine/src/ui/Chip';
import { Cursor } from '../../../engine/src/ui/Interaction';
import type { IconName } from '../../../engine/src/ui/Icon';
import { Stage, wordFrame } from './kit';
import { NAV, Navegador } from './parts/Navegador';
import { PLANO, Plano } from './parts/Plano';

const S = 's01-clic';
const W = STAGE.width;

/** The four promises, lit by the word that names them (s01-04). */
const PROMISES: { text: string; word: string; icon: IconName }[] = [
  { text: 'por dónde sale', word: 'sale', icon: 'arrowRight' },
  { text: 'qué lleva encima', word: 'encima', icon: 'file' },
  { text: 'quién lo cambia', word: 'cambia', icon: 'split' },
  { text: 'quién decide', word: 'decide', icon: 'firewall' },
];

/**
 * s01-clic «Un clic». The portal in a browser from the first frame (address bar readable, no padlock): the
 * cursor clicks «Reservar atraque» on the word «clic»; on `reply` «Reserva confirmada» arrives and the
 * stopwatch stops at «0,4 s». On `title` the window steps down and the title lands above it; on `plan` the
 * browser shrinks into the laptop while the plan zooms out (office, router with firewall, Internet, portal).
 * On `promise` four chips light, one per word. No case stamp in this scene.
 */
export function S01Clic(props: SceneProps) {
  const frame = useCurrentFrame();
  const replyAt = props.cue('reply');
  const titleAt = props.cue('title');
  const planAt = props.cue('plan');
  const promiseAt = props.cue('promise');
  const clickAt = Math.min(wordFrame(S, 's01-01', 'clic') + 4, replyAt - 36);

  // ---- browser: position through the three phases ----
  const toTitle = progress(frame, titleAt - 6, 30, EASE.inOut);
  const zoom = progress(frame, planAt - 8, 44, EASE.inOut);
  const k1 = 1 - 0.28 * toTitle;
  const left1 = 264 + (432 - 264) * toTitle;
  const top1 = 50 + (240 - 50) * toTitle;
  const cx = left1 + (NAV.w * k1) / 2;
  const cy = top1 + (NAV.h * k1) / 2;
  const target = { x: PLANO.laptop.x, y: PLANO.laptop.y };
  const size = 1 - 0.9 * zoom;
  const navCx = cx + (target.x - cx) * zoom;
  const navCy = cy + (target.y - cy) * zoom;
  const k = k1 * size;
  const navOpacity = 1 - progress(frame, planAt - 2, 34, EASE.inOut);

  const pressed = progress(frame, clickAt, 4) * (1 - progress(frame, clickAt + 8, 8));
  const ok = progress(frame, replyAt, 10);
  const watch = frame < clickAt ? undefined : frame < replyAt ? 0 : progress(frame, replyAt, 12, EASE.linear);

  // ---- title ----
  const titleIn = enter(frame, titleAt - 2, { distance: 24, duration: 20 });
  const subIn = enter(frame, titleAt + 16, { distance: 16, duration: 18 });
  const titleOut = 1 - progress(frame, planAt - 6, 22, EASE.inOut);

  // ---- plan: zooms out around the laptop, zones arrive with the voice ----
  const navelAt = wordFrame(S, 's01-03', 'naviera') - 4;
  const haldenAt = wordFrame(S, 's01-03', 'Halden') - 6;
  const planIn = progress(frame, planAt - 10, 36);
  const zoomK = 1 + (2.6 - 1) * (1 - progress(frame, planAt - 8, 48, EASE.inOut));
  const show = {
    office: progress(frame, planAt - 6, 22),
    router: progress(frame, planAt + 26, 18),
    cloud: progress(frame, planAt + 36, 18),
    portal: progress(frame, haldenAt, 18),
  };
  const dashed = progress(frame, haldenAt + 20, 70, EASE.inOut);
  const officeGlow = Math.max(0, Math.min(1, pulse(frame - navelAt, 30, 0.7))) * progress(frame, navelAt, 8) * (1 - progress(frame, navelAt + 50, 14));
  const portalGlow = progress(frame, haldenAt, 10) * (1 - progress(frame, haldenAt + 56, 14));

  // ---- chips ----
  const chipsIn = progress(frame, promiseAt - 4, 14);
  const lits = PROMISES.map((p) => progress(frame, wordFrame(S, 's01-04', p.word) - 4, 8));

  return (
    <Stage>
      {/* the title block */}
      <div style={{ position: 'absolute', left: 0, top: 18, width: W, textAlign: 'center', opacity: titleOut, fontFamily: FONT.sans }}>
        {frame >= titleAt - 4 ? (
          <>
            <div style={{ ...titleIn, fontSize: 98, fontWeight: 850, letterSpacing: -2, color: C.textStrong, whiteSpace: 'nowrap', lineHeight: 1.05 }}>
              Cómo viaja <span style={{ color: C.cyan }}>una conexión</span>
            </div>
            <div style={{ ...subIn, marginTop: 14, fontSize: 42, fontWeight: 700, color: C.cyanSoft, letterSpacing: 1, whiteSpace: 'nowrap' }}>IP · gateway · NAT · puertos</div>
          </>
        ) : null}
      </div>

      {/* the portal in the browser */}
      {navOpacity > 0.01 ? (
        <div style={{ position: 'absolute', left: navCx - (NAV.w * k) / 2, top: navCy - (NAV.h * k) / 2, width: NAV.w, height: NAV.h, transform: `scale(${k})`, transformOrigin: 'top left', opacity: navOpacity }}>
          <Navegador pressed={pressed} ok={ok} watch={watch} />
        </div>
      ) : null}
      {zoom < 0.5 ? <Cursor frame={frame} appearAt={-30} path={[{ x: 980, y: 540, at: clickAt - 44 }, { x: 264 + NAV.button.x + NAV.button.w * 0.62, y: 50 + NAV.button.y + NAV.button.h * 0.6, at: clickAt, click: true }]} /> : null}

      {/* the plan */}
      {planIn > 0.01 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: planIn }}>
          <Plano
            view={{ x: 0, y: 0, k: zoomK }}
            originTransform={{ x: PLANO.laptop.x, y: PLANO.laptop.y }}
            show={show}
            glow={{ laptop: officeGlow, printer: officeGlow * 0.6, server: officeGlow * 0.6, portal: portalGlow }}
            dashed={dashed}
          />
        </div>
      ) : null}

      {/* four promises */}
      {chipsIn > 0.01 ? (
        <div style={{ position: 'absolute', left: 0, top: 588, width: W, display: 'flex', justifyContent: 'center', gap: 26, opacity: chipsIn }}>
          {PROMISES.map((p, i) => (
            <div key={p.text} style={{ transform: `scale(${1 + 0.06 * lits[i]})`, opacity: 0.45 + 0.55 * lits[i], filter: lits[i] < 0.05 ? 'saturate(0.5)' : undefined }}>
              <Chip accent={lits[i] > 0.5 ? 'cyan' : 'muted'} solid={false} icon={p.icon} size={36} style={{ background: lits[i] > 0.05 ? alpha(C.cyan, 0.16) : alpha(C.ink700, 0.7), borderRadius: RADIUS.pill }}>
                {p.text}
              </Chip>
            </div>
          ))}
        </div>
      ) : null}
    </Stage>
  );
}

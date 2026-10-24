import type { ReactNode } from 'react';
import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { Icon } from '../../../engine/src/ui';
import { CORRIDOR, Corridor, RestArt, TransitArt, UseArt } from './parts/s02-estados/Art';
import { Caption, ImageTag, Pill, TermPill } from './parts/Labels';
import { Hand, Piggy, Transfer } from './parts/PiggyBank';
import { Stage, wordFrame } from './kit';

const S = 's02-estados';
const COL_W = 556;
const GAP = 30;
const colX = (i: number) => i * (COL_W + GAP);
const PANEL_H = 424;
const STRIP_TOP = 440;

const PANELS = [
  { state: 'Guardada', where: 'en la base de datos del sistema nuevo', term: 'DATA AT REST', gloss: 'cifrar el almacenamiento · permisos' },
  { state: 'En camino', where: 'del reloj al servidor, por la red', term: 'DATA IN TRANSIT', gloss: 'cifrar la conexión' },
  { state: 'Abierta', where: 'en la pantalla de la jefa de turno', term: 'DATA IN USE', gloss: 'ya está descifrada: ni el disco ni la conexión la cubren' },
] as const;

const PIGGY = [
  { caption: ['guardado,', 'en la hucha'] },
  { caption: ['viajando,', 'una transferencia'] },
  { caption: ['en tu mano, al pagar:', 'ya no hay hucha'] },
] as const;

function Panel({ i, vis, on, warn, art }: { i: number; vis: number; on: number; warn: number; art: ReactNode }) {
  const p = PANELS[i];
  const tone = warn > 0.5 ? C.amber : C.cyan;
  return (
    <div
      style={{
        position: 'absolute',
        left: colX(i),
        top: 0,
        width: COL_W,
        height: PANEL_H,
        boxSizing: 'border-box',
        padding: '18px 22px 16px',
        borderRadius: RADIUS.lg,
        border: `${on > 0.5 ? 3 : 2}px solid ${alpha(tone, 0.25 + 0.6 * on)}`,
        background: `linear-gradient(180deg, ${alpha(tone, 0.04 + 0.08 * on)} 0%, ${alpha(C.ink900, 0.9)} 60%)`,
        boxShadow: on > 0.05 ? `0 0 ${Math.round(30 * on)}px ${alpha(tone, 0.22 * on)}` : undefined,
        opacity: vis * (0.5 + 0.5 * Math.max(on, 0.4)),
        transform: `translateY(${(1 - vis) * 18}px)`,
        fontFamily: FONT.sans,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <div style={{ height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{art}</div>
      <div style={{ marginTop: 10, fontSize: 44, fontWeight: 850, color: C.textStrong, letterSpacing: -1 }}>{p.state}</div>
      <div style={{ marginTop: 2, fontSize: 28, fontWeight: 650, color: C.muted, whiteSpace: 'nowrap' }}>{p.where}</div>
      <div style={{ marginTop: 14, opacity: on > 0.02 || warn > 0 ? 1 : 0.0 }}>
        <TermPill text={p.term} size={34} on={on} />
      </div>
    </div>
  );
}

/**
 * s02-estados «Guardado, en camino, en pantalla». On `three` three panels come in, left to right, dim. Each lights on
 * its cue with its place, its exam term and what protects it: «Guardada» in the database (DATA AT REST, the emerald lock
 * on «cifrado»), «En camino» from the clock to the server (DATA IN TRANSIT, «TLS» only on screen, on «conexión»),
 * «Abierta» on the shift manager's screen (DATA IN USE, «ya está descifrada»). The strip below holds an unvoiced chip
 * (secure enclaves), then the top-down corridor: on `corridor` the screen's amber view cone reaches the empty corridor,
 * «cualquiera que pasara podría leerla»; on `decision` the proposal — turn it, lock on `autolock`, each manager only her
 * team — and LEAST PRIVILEGE lights only on «least». On `piggybank` the strip becomes the piggy bank in three pictures,
 * one under each state.
 */
export function S02Estados(props: SceneProps) {
  const frame = useCurrentFrame();
  const threeAt = props.cue('three');
  const restAt = props.cue('rest');
  const transitAt = props.cue('transit');
  const useAt = props.cue('use');
  const corridorAt = props.cue('corridor');
  const decisionAt = props.cue('decision');
  // {autolock} is a sound-only cue (not in the timeline's cues): sync on its word.
  const autolockAt = Math.max(decisionAt + 10, wordFrame(S, 's02-05', 'bloquee') - 4);
  const piggyAt = props.cue('piggybank');
  const lockWord = Math.max(restAt + 10, wordFrame(S, 's02-01', 'cifrado') - 4);
  const tlsAt = Math.max(transitAt + 10, wordFrame(S, 's02-02', 'conexión') - 6);
  const girarAt = Math.max(decisionAt, wordFrame(S, 's02-05', 'girarla') - 4);
  const jefaAt = Math.max(autolockAt + 6, wordFrame(S, 's02-05', 'jefa') - 4);
  const leastAt = Math.max(jefaAt + 6, wordFrame(S, 's02-05', 'least') - 4);
  const piggyItemAt = [
    piggyAt + 6,
    Math.max(piggyAt + 12, wordFrame(S, 's02-06', 'transferencia') - 8),
    Math.max(piggyAt + 18, wordFrame(S, 's02-06', 'mano') - 8),
  ];

  const startAt = [restAt, transitAt, useAt];
  const vis = [0, 1, 2].map((i) => progress(frame, Math.min(threeAt, restAt - 12) + i * 6, 16));
  // Each panel is in focus from its cue to the next; afterwards half lit. From `corridor` the in-use panel holds.
  const on = [0, 1, 2].map((i) => {
    const lit = progress(frame, startAt[i] - 4, 12);
    const next = i < 2 ? startAt[i + 1] : corridorAt;
    const after = i === 2 ? 1 : 1 - 0.55 * progress(frame, next - 6, 12);
    const back = i < 2 ? 1 - 0.3 * progress(frame, corridorAt - 6, 12) : 1;
    return lit * after * back;
  });
  const warn = progress(frame, corridorAt, 10) * (1 - progress(frame, decisionAt + 30, 16));

  const tTransit = ((frame - transitAt) % 60) / 60;
  const glossOf = (i: number) => progress(frame, startAt[i] + (i === 2 ? 20 : 12), 14);

  const enclaveIn = progress(frame, useAt + 70, 14) * (1 - progress(frame, corridorAt - 14, 10));
  const stripOut = progress(frame, piggyAt - 12, 12);
  const corridorIn = progress(frame, corridorAt - 4, 14) * (1 - stripOut);
  const expose = progress(frame, corridorAt + 4, 20);
  const turn = progress(frame, girarAt, 26, EASE.inOut);
  const lock = progress(frame, autolockAt, 12);
  const piggyIn = progress(frame, piggyAt - 4, 14);

  return (
    <Stage>
      <Panel i={0} vis={vis[0]} on={on[0]} warn={0} art={<RestArt on={on[0]} lock={progress(frame, lockWord, 12)} />} />
      <Panel i={1} vis={vis[1]} on={on[1]} warn={0} art={<TransitArt on={on[1]} t={frame >= transitAt ? tTransit : 0} tls={progress(frame, tlsAt, 12)} />} />
      <Panel i={2} vis={vis[2]} on={on[2]} warn={warn} art={<UseArt on={on[2]} warn={warn} />} />

      {/* Glosses: what protects each state, inside the panels' bottom */}
      {PANELS.map((p, i) => {
        const g = glossOf(i);
        if (g <= 0.01) return null;
        const isUse = i === 2;
        return (
          <div
            key={p.term}
            style={{
              position: 'absolute',
              left: colX(i) + 20,
              top: 336,
              width: COL_W - 40,
              textAlign: 'center',
              fontFamily: FONT.sans,
              fontSize: isUse ? 30 : 34,
              fontWeight: 750,
              lineHeight: 1.18,
              color: isUse ? C.amber : C.emerald,
              opacity: g * (0.55 + 0.45 * Math.max(on[i], isUse ? 1 : 0)),
            }}
          >
            {p.gloss}
          </div>
        );
      })}

      {/* Strip, before the corridor: the unvoiced chip */}
      {enclaveIn > 0.01 ? (
        <div style={{ position: 'absolute', right: 0, top: STRIP_TOP + 10, opacity: enclaveIn * 0.85 }}>
          <Pill text="secure enclaves · cifrado en memoria: entornos avanzados" tone={C.muted} icon="layers" size={28} height={50} weight={700} color={C.text} />
        </div>
      ) : null}

      {/* Strip: the corridor and the decision */}
      {corridorIn > 0.01 ? (
        <div style={{ position: 'absolute', left: 0, top: STRIP_TOP, width: 1728, height: 230, opacity: corridorIn }}>
          <div style={{ position: 'absolute', left: 0, top: 14 }}>
            <Corridor expose={expose} turn={turn} lock={lock} />
          </div>
          <Caption size={28} color={C.muted} style={{ position: 'absolute', left: 362, top: 178 }}>
            pasillo
          </Caption>
          <div style={{ position: 'absolute', left: CORRIDOR.w + 30, top: 22, opacity: 1 - 0.6 * progress(frame, decisionAt, 12) }}>
            <Caption size={36} color={C.amber}>
              cualquiera que pasara podría leerla
            </Caption>
          </div>
          {frame >= decisionAt - 4 ? (
            <div style={{ position: 'absolute', left: CORRIDOR.w + 30, top: 80, display: 'flex', flexDirection: 'column', gap: 12, ...enter(frame, decisionAt, { distance: 14 }) }}>
              <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                <span style={{ fontFamily: FONT.sans, fontSize: 28, fontWeight: 800, color: C.muted, letterSpacing: 1 }}>PROPUESTA</span>
                <div style={{ opacity: progress(frame, girarAt, 10) }}>
                  <Pill text="girarla" tone={C.emerald} size={32} height={52} />
                </div>
                <div style={{ opacity: progress(frame, autolockAt, 10) }}>
                  <Pill text="bloqueo automático a los pocos minutos" tone={C.emerald} icon="lock" size={32} height={52} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: 18, alignItems: 'center', opacity: progress(frame, jefaAt, 12) }}>
                <Pill text="cada jefa, solo su equipo" tone={C.emerald} icon="users" size={32} height={52} />
                <Icon name="play" size={28} color={C.faint} />
                <TermPill text="LEAST PRIVILEGE" size={34} on={progress(frame, leastAt, 12)} style={{ opacity: 0.25 + 0.75 * progress(frame, leastAt, 12) }} />
              </div>
            </div>
          ) : null}
        </div>
      ) : null}

      {/* Strip: the piggy bank, one picture under each state */}
      {piggyIn > 0.01 ? (
        <div style={{ position: 'absolute', left: 0, top: STRIP_TOP, width: 1728, height: 230, opacity: piggyIn }}>
          {PIGGY.map((p, i) => {
            const it = enter(frame, piggyItemAt[i], { distance: 14 });
            return (
              <div key={i} style={{ position: 'absolute', left: colX(i) + 24, top: 22, display: 'flex', alignItems: 'center', gap: 22, ...it }}>
                {i === 0 ? <Piggy width={150} /> : i === 1 ? <Transfer width={150} t={progress(frame, piggyItemAt[1], 40, EASE.inOut)} /> : <Hand width={150} />}
                <div style={{ fontFamily: FONT.sans, fontSize: 34, fontWeight: 750, lineHeight: 1.18, color: C.text, whiteSpace: 'nowrap' }}>
                  <div>{p.caption[0]}</div>
                  <div style={{ color: i === 2 ? C.amber : C.cyanSoft }}>{p.caption[1]}</div>
                </div>
              </div>
            );
          })}
          <div style={{ position: 'absolute', right: 0, top: 168 }}>
            <ImageTag size={26} />
          </div>
        </div>
      ) : null}
    </Stage>
  );
}

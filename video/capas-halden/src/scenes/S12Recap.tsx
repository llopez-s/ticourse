import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { BrandMark } from '../../../engine/src/overlay/ChapterRail';
import { isElevenLabsVoice } from '../../../engine/src/timeline/voice';
import { C, FONT, RADIUS, STAGE, TYPE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, fadeIn, progress, springIn } from '../../../engine/src/theme/motion';
import { Chip, Icon, type IconName } from '../../../engine/src/ui';
import { TIMELINE } from '../timeline/load';
import { Stage, segment, wordFrame } from './kit';

const S = 's12-recap';

const LAYERS: { label: string; icon: IconName }[] = [
  { label: 'Correo', icon: 'mail' },
  { label: 'DNS', icon: 'globe' },
  { label: 'Firewall', icon: 'firewall' },
  { label: 'IDS/IPS', icon: 'radar' },
  { label: 'Endpoint', icon: 'laptop' },
  { label: 'Datos', icon: 'database' },
];

type Reflex = { icon: IconName; title: string; detail: string; at: number };

/**
 * S12 «Para el examen» — the closing recap in four beats:
 *   recap-map     SILENT PAGER counted on rest; the six layers answer, one by one
 *   recap-reflex  three scenario phrases, each mapped to its exam reflex
 *   (s12-03)      the stolen service credential, a thread left for the SIEM lesson
 *   endcard       ALERTÓPOLIS end card, holding to the last frame
 */
export function S12Recap(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const mapAt = props.cue('recap-map');
  const reflexAt = props.cue('recap-reflex');
  const teaserAt = segment(props, 's12-03').from;
  const endcardAt = props.cue('endcard');

  const mapOpacity = fadeIn(frame, mapAt, 14) * (1 - progress(frame, reflexAt - 14, 14, EASE.inOut));
  const reflexOpacity = fadeIn(frame, reflexAt, 14) * (1 - progress(frame, teaserAt - 14, 14, EASE.inOut));
  const teaserOpacity = fadeIn(frame, teaserAt, 14) * (1 - progress(frame, endcardAt - 14, 14, EASE.inOut));

  const reflexes: Reflex[] = [
    { icon: 'mail', title: '¿Falsifican tu dominio?', detail: 'DMARC en reject', at: wordFrame(S, 's12-02', 'reject') },
    { icon: 'radar', title: '¿Detectó y no bloqueó?', detail: 'Un IDS', at: wordFrame(S, 's12-02', 'IDS') },
    { icon: 'firewall', title: '¿Ninguna regla lo permite?', detail: 'Implicit deny', at: wordFrame(S, 's12-02', 'deny') },
  ];

  return (
    <Stage>
      {mapOpacity > 0.001 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: mapOpacity }}>
          <RecapMap frame={frame} fps={fps} at={mapAt} />
        </div>
      ) : null}
      {reflexOpacity > 0.001 ? (
        <div style={{ position: 'absolute', left: 0, top: 150, width: STAGE.width, opacity: reflexOpacity }}>
          <div style={{ ...enter(frame, reflexAt - 6, { distance: 16 }), display: 'flex', alignItems: 'center', gap: 16, fontFamily: FONT.sans, marginBottom: 28 }}>
            <Icon name="mortarboard" size={38} color={C.violet} />
            <span style={{ fontSize: TYPE.h3, fontWeight: 800, color: C.textStrong }}>Para el examen</span>
          </div>
          <ReflexGrid frame={frame} fps={fps} items={reflexes} />
        </div>
      ) : null}
      {teaserOpacity > 0.001 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: teaserOpacity }}>
          <CredentialTeaser frame={frame} fps={fps} at={teaserAt} />
        </div>
      ) : null}
      <EndCard frame={frame} fps={fps} at={endcardAt} />
    </Stage>
  );
}

/** SILENT PAGER counted on the SOC sleeping; instead every layer answers its question. */
function RecapMap({ frame, fps, at }: { frame: number; fps: number; at: number }) {
  const tagIn = progress(frame, at, 10);
  const tagOut = progress(frame, at + 46, 14);
  const rowStart = at + 60;
  const captionAt = rowStart + LAYERS.length * 16 + 30;
  return (
    <div style={{ fontFamily: FONT.sans }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, opacity: tagIn * (1 - tagOut) }}>
        <Icon name="alert" size={30} color={C.rose} />
        <span style={{ fontSize: TYPE.label, fontWeight: 700, color: C.roseSoft }}>SILENT PAGER contaba con tu descanso</span>
      </div>
      <div style={{ marginTop: 36, display: 'flex', gap: 20 }}>
        {LAYERS.map((layer, i) => {
          const p = springIn(frame, fps, rowStart + i * 16, { damping: 14, mass: 0.7 });
          const lit = Math.min(1, p * 1.2);
          return (
            <div
              key={layer.label}
              style={{
                flex: 1,
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 12,
                padding: '26px 10px',
                borderRadius: RADIUS.lg,
                border: `2px solid ${alpha(C.cyan, 0.3 + 0.4 * lit)}`,
                background: alpha(C.cyan, 0.07 * lit),
                boxShadow: lit > 0.5 ? `0 0 24px ${alpha(C.cyan, 0.18 * lit)}` : 'none',
                opacity: Math.min(1, lit * 1.3),
                transform: `translateY(${(1 - lit) * 22}px)`,
              }}
            >
              <Icon name={layer.icon} size={36} color={lit > 0.5 ? C.cyanSoft : C.muted} />
              <span style={{ fontSize: TYPE.small, fontWeight: 700, color: lit > 0.5 ? C.textStrong : C.muted, whiteSpace: 'nowrap' }}>
                {layer.label}
              </span>
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: 30, fontSize: TYPE.label, fontWeight: 650, color: C.text, opacity: progress(frame, captionAt, 14) }}>
        Capa a capa, cada control contestó su pregunta.
      </div>
    </div>
  );
}

function ReflexGrid({ frame, fps, items }: { frame: number; fps: number; items: Reflex[] }) {
  return (
    <div style={{ display: 'flex', gap: 28 }}>
      {items.map((r) => {
        const p = springIn(frame, fps, r.at - 4, { damping: 15 });
        return (
          <div
            key={r.title}
            style={{
              flex: 1,
              boxSizing: 'border-box',
              padding: '28px 26px',
              borderRadius: RADIUS.lg,
              border: `2px solid ${alpha(C.violet, 0.55)}`,
              background: `linear-gradient(180deg, ${alpha(C.violet, 0.12)} 0%, ${C.ink900} 70%)`,
              fontFamily: FONT.sans,
              opacity: Math.min(1, p * 1.3),
              transform: `translateY(${(1 - p) * 36}px)`,
            }}
          >
            <div style={{ width: 60, height: 60, borderRadius: 30, display: 'grid', placeItems: 'center', background: alpha(C.violet, 0.2) }}>
              <Icon name={r.icon} size={32} color={C.violet} />
            </div>
            <div style={{ marginTop: 18, fontSize: TYPE.body, fontWeight: 800, color: C.textStrong, lineHeight: 1.2 }}>{r.title}</div>
            <div style={{ marginTop: 12, fontSize: TYPE.label, color: '#c4b5fd', fontWeight: 700 }}>{r.detail}</div>
          </div>
        );
      })}
    </div>
  );
}

/** A loose end for the SIEM lesson: the service credential surfaces again at 01:52. */
function CredentialTeaser({ frame, fps, at }: { frame: number; fps: number; at: number }) {
  const p = springIn(frame, fps, at + 4, { damping: 16 });
  return (
    <div style={{ position: 'absolute', left: 0, top: 220, width: STAGE.width, display: 'flex', justifyContent: 'center' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 22,
          padding: '24px 34px',
          borderRadius: RADIUS.lg,
          border: `2px solid ${alpha(C.rose, 0.55)}`,
          background: `linear-gradient(180deg, ${alpha(C.rose, 0.1)} 0%, ${C.ink900} 70%)`,
          fontFamily: FONT.sans,
          opacity: Math.min(1, p * 1.3),
          transform: `translateY(${(1 - p) * 24}px)`,
        }}
      >
        <Icon name="key" size={40} color={C.roseSoft} />
        <div>
          <div style={{ fontSize: TYPE.small, color: C.muted }}>Cabo suelto</div>
          <div style={{ fontSize: TYPE.h3, fontWeight: 800, color: C.textStrong }}>Credencial de servicio · 01:52</div>
        </div>
        <Icon name="arrowRight" size={30} color={C.faint} />
        <Chip accent="cyan" icon="bell" size={TYPE.label}>
          otra alerta: el SIEM
        </Chip>
      </div>
    </div>
  );
}

const CARD_W = 1320;

/** Closing card: ALERTÓPOLIS brand, title, exam objective, an invitation to keep practising, disclaimer. */
function EndCard({ frame, fps, at }: { frame: number; fps: number; at: number }) {
  if (frame < at - 8) return null;
  const cardIn = springIn(frame, fps, at - 6, { damping: 18 });
  const brand = enter(frame, at - 2, { distance: 16 });
  const title = enter(frame, at + 2, { distance: 24 });
  const objective = enter(frame, at + 8, { distance: 18 });
  const ruleDraw = progress(frame, at + 8, 18);
  const cta = enter(frame, at + 14, { distance: 18 });
  const disclaimer = enter(frame, at + 22, { distance: 12 });
  return (
    <div
      style={{
        position: 'absolute',
        left: (STAGE.width - CARD_W) / 2,
        top: 40,
        width: CARD_W,
        height: STAGE.height - 80,
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 36,
        background: `linear-gradient(180deg, ${C.ink850} 0%, ${C.ink900} 100%)`,
        border: `2px solid ${C.ink700}`,
        boxShadow: `0 40px 90px ${alpha('#000000', 0.45)}, inset 0 1px 0 ${alpha('#ffffff', 0.05)}`,
        fontFamily: FONT.sans,
        opacity: Math.min(1, cardIn * 1.4),
        transform: `scale(${0.94 + 0.06 * cardIn})`,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: '100%',
          height: 4,
          background: `linear-gradient(90deg, transparent 0%, ${C.cyan} 50%, transparent 100%)`,
          opacity: 0.8,
        }}
      />
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, ...brand }}>
        <BrandMark size={34} />
        <span style={{ fontSize: TYPE.small, fontWeight: 800, letterSpacing: 5, color: C.cyanSoft }}>ALERTÓPOLIS</span>
      </div>
      <div style={{ marginTop: 22, fontSize: TYPE.hero, fontWeight: 850, letterSpacing: -2, lineHeight: 1.05, color: C.textStrong, whiteSpace: 'nowrap', ...title }}>
        Defensa en <span style={{ color: C.cyan }}>capas</span>
      </div>
      <div style={{ marginTop: 22, ...objective }}>
        <Chip accent="violet" icon="mortarboard" size={TYPE.label}>
          Security+ SY0-701 · objetivo 4.5
        </Chip>
      </div>
      <div style={{ marginTop: 38, width: 720 * ruleDraw, height: 2, background: C.ink700 }} />
      <div
        style={{
          marginTop: 38,
          display: 'flex',
          alignItems: 'center',
          gap: 18,
          padding: '16px 30px 16px 22px',
          borderRadius: 999,
          background: alpha(C.cyan, 0.08),
          border: `2px solid ${alpha(C.cyan, 0.55)}`,
          ...cta,
        }}
      >
        <Icon name="play" size={34} color={C.cyan} strokeWidth={2} />
        <span style={{ fontSize: 36, fontWeight: 650, color: C.textStrong, whiteSpace: 'nowrap' }}>
          Ahora te toca a ti: practica en <span style={{ color: C.cyanSoft }}>Alertópolis</span>
        </span>
      </div>
      <div style={{ marginTop: 40, fontSize: TYPE.small, fontWeight: 550, color: C.muted, textAlign: 'center', lineHeight: 1.35, ...disclaimer }}>
        Simulación educativa con datos ficticios. Material independiente, no afiliado a CompTIA.
        {isElevenLabsVoice(TIMELINE.voice) ? (
          <>
            <br />
            Voz: ElevenLabs.
          </>
        ) : null}
      </div>
    </div>
  );
}

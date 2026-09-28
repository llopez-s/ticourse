import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, TYPE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, fadeIn, lerp, progress, springIn, stagger } from '../../../engine/src/theme/motion';
import { Connector, Icon, type IconName } from '../../../engine/src/ui';
import { Stage, wordFrame } from './kit';

/** The seven controls the narration walks through, left to right along the map. */
const LAYERS: { icon: IconName; label: string }[] = [
  { icon: 'mail', label: 'Correo' },
  { icon: 'globe', label: 'DNS' },
  { icon: 'cloud', label: 'Web' },
  { icon: 'firewall', label: 'Firewall' },
  { icon: 'radar', label: 'IDS/IPS' },
  { icon: 'laptop', label: 'Endpoint' },
  { icon: 'database', label: 'Datos' },
];

const NODE_W = 220;
const NODE_H = 150;
const GAP = 26;
const ROW_TOP = 40;
const ICON_SIZE = 92;
const ROW_WIDTH = LAYERS.length * NODE_W + (LAYERS.length - 1) * GAP;
const ROW_LEFT = (1728 - ROW_WIDTH) / 2;
const ICON_CY = ROW_TOP + ICON_SIZE / 2;

const nodeLeft = (i: number) => ROW_LEFT + i * (NODE_W + GAP);
const nodeCenterX = (i: number) => nodeLeft(i) + NODE_W / 2;

/**
 * S01 «Un correo, siete controles»: a mail slides into the map of Halden and,
 * layer by layer, seven controls light up — none of them stops it alone. The
 * "defensa en capas" title beat and the opposing adversary tag (SILENT PAGER)
 * close the hook.
 */
export function S01Hook(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const S = 's01-hook';
  const mapAt = props.cue('map');
  const mailIn = props.cue('mail-in');
  const layersAt = props.cue('layers');
  const titleAt = props.cue('title');
  const silentAt = wordFrame(S, 's01-04', 'SILENT');

  const mapIn = fadeIn(frame, mapAt, 16);
  const envelopeArrive = mailIn + 42;
  const envelopeX = lerp(frame, [mailIn, envelopeArrive], [-70, nodeCenterX(0) - 30]);
  const envelopeOpacity = fadeIn(frame, mailIn, 10) * (1 - progress(frame, envelopeArrive + 14, 16));
  const spineDraw = progress(frame, mailIn, 90, EASE.out);
  const flow = frame / fps;
  const titleDim = 1 - 0.35 * progress(frame, titleAt - 6, 16);

  /** Node 0 (correo) lights when the envelope lands; the rest light in a quick
   * cascade once the narration says "se encienden siete capas". */
  const lightAt = (i: number) => (i === 0 ? envelopeArrive : stagger(layersAt, i - 1, 14));

  return (
    <Stage>
      <div style={{ position: 'absolute', left: 0, top: 0, width: 1728, fontFamily: FONT.sans, opacity: mapIn }}>
        {/* Location kicker */}
        <div
          style={{
            position: 'absolute',
            left: ROW_LEFT,
            top: 10,
            fontSize: TYPE.small,
            fontWeight: 650,
            letterSpacing: 2,
            color: C.muted,
            textTransform: 'uppercase',
          }}
        >
          Autoridad Portuaria de Halden · 3-9-2026, tarde
        </div>

        {/* Spine connecting the seven layers */}
        <svg width={1728} height={660} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none' }}>
          <Connector
            curve={[
              { x: -60, y: ICON_CY },
              { x: nodeCenterX(2), y: ICON_CY },
              { x: nodeCenterX(4), y: ICON_CY },
              { x: nodeCenterX(6) + 40, y: ICON_CY },
            ]}
            color={C.cyan}
            width={4}
            draw={spineDraw}
            flow={flow}
          />
        </svg>

        {/* Envelope travelling from off-stage to the first node */}
        {envelopeOpacity > 0 ? (
          <div style={{ position: 'absolute', top: ROW_TOP + 16, left: envelopeX, opacity: envelopeOpacity }}>
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: 16,
                display: 'grid',
                placeItems: 'center',
                background: alpha(C.cyan, 0.16),
                border: `2px solid ${C.cyan}`,
                boxShadow: `0 0 24px ${alpha(C.cyan, 0.4)}`,
              }}
            >
              <Icon name="mail" size={32} color={C.cyanSoft} />
            </div>
          </div>
        ) : null}

        {/* Seven layers */}
        <div style={{ position: 'absolute', left: ROW_LEFT, top: ROW_TOP, display: 'flex', gap: GAP, opacity: titleDim }}>
          {LAYERS.map((layer, i) => (
            <LayerNode key={layer.label} frame={frame} fps={fps} at={lightAt(i)} icon={layer.icon} label={layer.label} width={NODE_W} height={NODE_H} />
          ))}
        </div>
      </div>

      {/* Title beat: "defensa en capas" */}
      <Title frame={frame} fps={fps} at={titleAt} />

      {/* Adversary: SILENT PAGER, counting on a sleeping SOC */}
      <Adversary frame={frame} at={silentAt} />
    </Stage>
  );
}

function LayerNode({
  frame,
  fps,
  at,
  icon,
  label,
  width,
}: {
  frame: number;
  fps: number;
  at: number;
  icon: IconName;
  label: string;
  width: number;
  height: number;
}) {
  const lit = progress(frame, at, 12, EASE.out);
  const pop = springIn(frame, fps, at, { damping: 13, mass: 0.7 });
  const scale = 0.88 + 0.12 * Math.min(1, pop * 1.15);
  const color = lit > 0.15 ? C.cyan : C.faint;
  return (
    <div style={{ width, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
      <div
        style={{
          width: ICON_SIZE,
          height: ICON_SIZE,
          borderRadius: 22,
          display: 'grid',
          placeItems: 'center',
          background: alpha(C.cyan, 0.12 * lit),
          border: `3px solid ${lit > 0 ? alpha(C.cyan, 0.4 + 0.5 * lit) : C.ink700}`,
          boxShadow: lit > 0 ? `0 0 ${30 * lit}px ${alpha(C.cyan, 0.4 * lit)}` : 'none',
          transform: `scale(${scale})`,
        }}
      >
        <Icon name={icon} size={46} color={color} />
      </div>
      <div style={{ fontSize: TYPE.label, fontWeight: 700, color: lit > 0.15 ? C.textStrong : C.muted, whiteSpace: 'nowrap' }}>{label}</div>
    </div>
  );
}

function Title({ frame, fps, at }: { frame: number; fps: number; at: number }) {
  if (frame < at - 24) return null;
  const pop = springIn(frame, fps, at, { damping: 14, mass: 0.85 });
  const op = progress(frame, at, 14, EASE.out);
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: 296,
        width: 1728,
        textAlign: 'center',
        opacity: op,
        transform: `scale(${0.85 + 0.15 * Math.min(1, pop)})`,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 22 }}>
        <Icon name="layers" size={62} color={C.cyan} />
        <span style={{ fontFamily: FONT.sans, fontSize: TYPE.hero, fontWeight: 850, color: C.textStrong, letterSpacing: -1, whiteSpace: 'nowrap' }}>
          Defensa en capas
        </span>
      </div>
    </div>
  );
}

function Adversary({ frame, at }: { frame: number; at: number }) {
  const inn = enter(frame, at - 4, { distance: 26 });
  if (frame < at - 20) return null;
  return (
    <div style={{ position: 'absolute', left: 0, top: 468, width: 1728, display: 'flex', justifyContent: 'center', ...inn }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 20,
          padding: '18px 32px',
          borderRadius: RADIUS.lg,
          border: `2px solid ${alpha(C.rose, 0.7)}`,
          background: alpha(C.rose, 0.1),
          boxShadow: `0 0 32px ${alpha(C.rose, 0.22)}`,
          fontFamily: FONT.sans,
        }}
      >
        <Icon name="eyeOff" size={44} color={C.rose} />
        <div>
          <div style={{ fontFamily: FONT.mono, fontSize: TYPE.h3, fontWeight: 800, color: C.roseSoft, letterSpacing: 1 }}>SILENT PAGER</div>
          <div style={{ fontSize: TYPE.small, color: C.text, marginTop: 4 }}>cuenta con que tu SOC duerma</div>
        </div>
      </div>
    </div>
  );
}

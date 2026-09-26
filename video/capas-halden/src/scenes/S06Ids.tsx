import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, TYPE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, fadeIn, progress } from '../../../engine/src/theme/motion';
import { Chip, Connector, Icon, MonoLine, NodeCard, Panel, curveBetween } from '../../../engine/src/ui';
import { Stage } from './kit';

const LANE_Y = 234;
const IDS_TOP = 336;
const IDS_H = 114;
const NODE_W = 400;
const TAP_X = 864;

// Phase B (the inline IPS) sits below phase A with its own local coordinate
// space; the badge row and the anomaly note each get a fixed, non-overlapping slot.
const IPS_TOP = 452;
const IPS_H = 660 - IPS_TOP;
const IPS_LANE_Y = 46;
const BADGES_TOP = 104;
const ANOMALY_TOP = 160;

/**
 * s06-ids «Detectó pero no bloqueó»: a sensor on a tap sees a copy of the
 * traffic — its signature matches the beacon, an alert fires, and the real
 * packet keeps going, because the sensor was never in the path. Contrast: an
 * inline IPS sits IN the path and can drop the packet, at the cost of false
 * positives. The top-centre stays clear here — the intercepted message runs
 * across the end of the first beat and all of the second.
 */
export function S06Ids(props: SceneProps) {
  const frame = useCurrentFrame();
  const tap = props.cue('tap');
  const sigMatch = props.cue('sig-match');
  const alert = props.cue('alert');
  const passes = props.cue('passes');
  const inline = props.cue('inline');
  const anomaly = props.cue('anomaly');

  const laneIn = enter(frame, 4, { distance: 16 });
  const ipsIn = enter(frame, inline - 12, { distance: 24 });

  const wireOn = progress(frame, tap, 18);
  const destState = frame >= passes ? 'active' : 'normal';
  const passOneShot = progress(frame, passes, 26, EASE.inOut);

  const sigOn = frame >= sigMatch;
  const alertOn = frame >= alert;

  const ipsWireOn = progress(frame, inline, 18);
  const ipsDotT = progress(frame, inline + 4, 26, EASE.inOut);
  const dropped = frame >= inline + 26;

  return (
    <Stage>
      {/* ================= Phase A: out-of-band IDS on a tap ================= */}
      <div style={{ position: 'absolute', left: 0, top: 0, width: 1728, height: 660, ...laneIn }}>
        <svg width={1728} height={660} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
          <Connector curve={curveBetween({ x: NODE_W, y: LANE_Y }, { x: TAP_X - 50, y: LANE_Y }, 0)} color={C.cyan} width={4} draw={wireOn} flow={wireOn >= 1 ? frame / 30 : undefined} />
          <Connector curve={curveBetween({ x: TAP_X + 50, y: LANE_Y }, { x: 1728 - NODE_W, y: LANE_Y }, 0)} color={C.cyan} width={4} draw={wireOn} flow={wireOn >= 1 ? frame / 30 : undefined} />
          <Connector curve={curveBetween({ x: TAP_X, y: LANE_Y + 46 }, { x: TAP_X, y: IDS_TOP }, 0.3)} color={alpha(C.cyanSoft, 0.8)} width={3} draw={progress(frame, tap + 6, 16)} />
          {passOneShot > 0 && passOneShot < 1 ? (
            <circle cx={TAP_X + 50 + (1728 - NODE_W - TAP_X - 50) * passOneShot} cy={LANE_Y} r={9} fill={C.cyanSoft} opacity={Math.min(1, passOneShot * 6, (1 - passOneShot) * 6)} />
          ) : null}
        </svg>

        <div style={{ position: 'absolute', left: 0, top: LANE_Y - 46, width: NODE_W }}>
          <NodeCard icon="laptop" label="Operaciones" sublabel="tráfico real" accent="cyan" state="active" />
        </div>
        <div style={{ position: 'absolute', left: 1728 - NODE_W, top: LANE_Y - 46, width: NODE_W }}>
          <NodeCard icon="cloud" label="C2 · Internet" sublabel="cdn-halden-sync" accent="rose" state={destState} />
        </div>
        {frame >= passes ? (
          <div style={{ position: 'absolute', left: 1728 - NODE_W, top: LANE_Y + 44, opacity: fadeIn(frame, passes, 12) }}>
            <Chip accent="rose" size={TYPE.micro}>
              el paquete sigue
            </Chip>
          </div>
        ) : null}

        <TapMarker frame={frame} at={tap} />

        <div style={{ position: 'absolute', left: 384, top: IDS_TOP, width: 960, height: IDS_H }}>
          <Panel
            title="Sensor IDS · fuera de línea"
            icon="radar"
            accent="cyan"
            glow={progress(frame, alert, 10) * (1 - progress(frame, alert + 120, 30))}
            style={{ width: '100%', height: '100%' }}
            bodyStyle={{ padding: '0 26px', display: 'flex', alignItems: 'center', gap: 22 }}
          >
            <MonoLine
              tokens={[
                { t: 'firma: ', c: C.muted },
                { t: 'patrón de baliza C2 conocida', c: sigOn ? C.cyanSoft : C.muted, bold: sigOn },
              ]}
              size={TYPE.label}
            />
            {alertOn ? (
              <span style={{ marginLeft: 'auto', opacity: fadeIn(frame, alert, 10) }}>
                <Chip accent="rose" icon="bell" size={TYPE.small} solid>
                  ALERTA
                </Chip>
              </span>
            ) : null}
          </Panel>
        </div>
      </div>

      {/* ================= Phase B: an inline IPS drops the packet ================= */}
      <div style={{ position: 'absolute', left: 0, top: IPS_TOP, width: 1728, height: IPS_H, ...ipsIn }}>
        <svg width={1728} height={IPS_H} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
          <Connector curve={curveBetween({ x: NODE_W, y: IPS_LANE_Y }, { x: 624, y: IPS_LANE_Y }, 0)} color={C.cyan} width={4} draw={ipsWireOn} flow={ipsWireOn >= 1 ? frame / 30 : undefined} />
          {ipsDotT > 0 && ipsDotT < 1 ? (
            <circle cx={NODE_W + (624 - NODE_W) * ipsDotT} cy={IPS_LANE_Y} r={9} fill={C.cyanSoft} opacity={Math.min(1, ipsDotT * 6, (1 - ipsDotT) * 6)} />
          ) : null}
          {dropped ? (
            <g opacity={fadeIn(frame, inline + 26, 10)}>
              <line x1={1104} y1={IPS_LANE_Y - 16} x2={1140} y2={IPS_LANE_Y + 16} stroke={C.rose} strokeWidth={5} strokeLinecap="round" />
              <line x1={1140} y1={IPS_LANE_Y - 16} x2={1104} y2={IPS_LANE_Y + 16} stroke={C.rose} strokeWidth={5} strokeLinecap="round" />
            </g>
          ) : null}
        </svg>

        <div style={{ position: 'absolute', left: 0, top: IPS_LANE_Y - 46, width: NODE_W }}>
          <NodeCard icon="laptop" label="Operaciones" sublabel="tráfico real" accent="cyan" state="normal" />
        </div>
        <div style={{ position: 'absolute', left: 624, top: IPS_LANE_Y - 46, width: 480 }}>
          <NodeCard icon="shield" label="IPS en línea" sublabel="en el camino" accent="cyan" state={dropped ? 'alert' : 'active'} />
        </div>
        <div style={{ position: 'absolute', left: 1728 - NODE_W, top: IPS_LANE_Y - 46, width: NODE_W, opacity: 0.45 }}>
          <NodeCard icon="cloud" label="C2 · Internet" sublabel="nunca llega" accent="rose" state="idle" />
        </div>

        {/* Badges: reserved side by side so the second one fading in never reflows the first. */}
        {dropped ? (
          <div style={{ position: 'absolute', left: 624, top: BADGES_TOP, display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ opacity: fadeIn(frame, inline + 30, 10) }}>
              <Chip accent="rose" icon="x" size={TYPE.small} solid>
                DESCARTADO
              </Chip>
            </div>
            <div style={{ opacity: fadeIn(frame, inline + 56, 14) }}>
              <Chip accent="amber" size={TYPE.micro}>
                riesgo: falso positivo
              </Chip>
            </div>
          </div>
        ) : null}

        {frame >= anomaly - 8 ? (
          <div style={{ position: 'absolute', left: 0, top: ANOMALY_TOP, width: 1728, display: 'flex', alignItems: 'center', gap: 20, opacity: fadeIn(frame, anomaly, 14) }}>
            <div
              style={{
                width: 56,
                height: 56,
                flexShrink: 0,
                borderRadius: 16,
                display: 'grid',
                placeItems: 'center',
                background: alpha(C.cyan, 0.12),
                border: `2px solid ${alpha(C.cyan, 0.5)}`,
              }}
            >
              <Icon name="brain" size={28} color={C.cyan} />
            </div>
            <span style={{ fontFamily: FONT.sans, fontSize: TYPE.label, fontWeight: 650, color: C.text }}>
              Detección por anomalías: aprende lo normal y avisa si algo se desvía.
            </span>
          </div>
        ) : null}
      </div>
    </Stage>
  );
}

function TapMarker({ frame, at }: { frame: number; at: number }) {
  const p = progress(frame, at, 14);
  if (p <= 0) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: TAP_X,
        top: LANE_Y,
        transform: `translate(-50%, -50%) scale(${0.85 + 0.15 * p})`,
        opacity: p,
        textAlign: 'center',
      }}
    >
      <div
        style={{
          width: 84,
          height: 84,
          borderRadius: 20,
          display: 'grid',
          placeItems: 'center',
          background: alpha(C.cyan, 0.12),
          border: `2px solid ${alpha(C.cyan, 0.6)}`,
        }}
      >
        <Icon name="split" size={36} color={C.cyan} />
      </div>
      <div style={{ marginTop: 8, fontFamily: FONT.sans, fontSize: TYPE.small, fontWeight: 700, color: C.cyanSoft, whiteSpace: 'nowrap' }}>TAP</div>
      <div style={{ fontFamily: FONT.sans, fontSize: TYPE.micro, color: C.muted, whiteSpace: 'nowrap' }}>copia del tráfico</div>
    </div>
  );
}

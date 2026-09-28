import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, TYPE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, fadeIn, progress, pulse, springIn } from '../../../engine/src/theme/motion';
import { CaseStrip, Checklist, Chip, Cursor, Icon, NodeCard, Panel, type IconName } from '../../../engine/src/ui';
import { CHANNELS, ISOLATION, PRESERVED } from '../data/s09-isolate';
import { Stage, segment } from './kit';

const MAIN_TOP = 108;
const LEFT_W = 840;
const RIGHT_LEFT = LEFT_W + 48;
const RIGHT_W = STAGE.width - RIGHT_LEFT;

/**
 * S09 «Aislar sin apagar»: the EDR isolation button, only the EDR channel
 * left open, RAM preserved as evidence, and the whole action logged. The
 * laptop stays on until the 04:12 seizure. A loose end nobody had detected
 * yet: a service-account credential already left before isolation.
 *
 * s09-01 carries an intercepted message (top-centre, silent lead) rendered
 * by the shared overlay — this scene keeps stage-local y 0–200 empty until
 * the `edr-channel` cue, when the overlay's window closes.
 */
export function S09Isolate(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const isolate = props.cue('isolate');
  const edrChannel = props.cue('edr-channel');
  const ram = props.cue('ram');
  const documented = props.cue('documented');
  const looseEndAt = segment(props, 's09-05').from;
  // "...hasta que lo incauten a las 04:12" falls near the end of s09-04.
  const seizureRevealAt = segment(props, 's09-04').to - 40;

  const phase1Out = progress(frame, edrChannel - 12, 14, EASE.inOut);
  // Starts exactly at edrChannel (not before): the intercept card is still
  // fading out until then, and the top band must stay clear until it's gone.
  const phase2In = progress(frame, edrChannel, 16, EASE.inOut);

  return (
    <Stage>
      {/* Phase 1: the isolate button, kept well below the intercept card's slot. */}
      {phase1Out < 1 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: 1 - phase1Out }}>
          <IsolateButton frame={frame} fps={fps} isolate={isolate} />
        </div>
      ) : null}

      {/* Phase 2: only unlocks once the intercept's window has closed. */}
      {frame >= edrChannel - 20 ? (
        <div style={{ opacity: phase2In }}>
          <CaseStrip
            status="AISLADO"
            statusAccent="emerald"
            markers={[
              { time: '01:52', label: 'logon', accent: 'rose', reveal: 0 },
              { time: '04:12', label: 'incautación', accent: 'amber', reveal: progress(frame, seizureRevealAt, 14) },
            ]}
            style={{ position: 'absolute', left: 0, top: 0 }}
          />

          <div style={{ position: 'absolute', left: 0, top: MAIN_TOP, width: LEFT_W }}>
            <ChannelHub frame={frame} at={edrChannel} width={LEFT_W} />
          </div>

          {frame >= ram - 10 ? (
            <div style={{ position: 'absolute', left: 0, top: MAIN_TOP + 290, width: LEFT_W, ...enter(frame, ram, { distance: 16 }) }}>
              <RamPanel frame={frame} at={ram} width={LEFT_W} />
            </div>
          ) : null}

          {frame >= documented - 10 ? (
            <div style={{ position: 'absolute', left: RIGHT_LEFT, top: MAIN_TOP, width: RIGHT_W, ...enter(frame, documented, { distance: 16, axis: 'x' }) }}>
              <LogPanel frame={frame} at={documented} width={RIGHT_W} />
            </div>
          ) : null}

          {frame >= looseEndAt ? (
            <div style={{ position: 'absolute', left: RIGHT_LEFT, top: MAIN_TOP + 372, width: RIGHT_W, ...enter(frame, looseEndAt, { distance: 14 }) }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  padding: '18px 24px',
                  borderRadius: RADIUS.md,
                  border: `2px solid ${alpha(C.rose, 0.7)}`,
                  background: alpha(C.rose, 0.1),
                }}
              >
                <Icon name="key" size={36} color={C.roseSoft} />
                <div style={{ fontFamily: FONT.sans, fontSize: TYPE.label, fontWeight: 700, color: C.textStrong, lineHeight: 1.3 }}>
                  Credencial de cuenta de servicio ya expuesta
                  <div style={{ fontSize: TYPE.small, fontWeight: 650, color: C.roseSoft, marginTop: 4 }}>aún sin detectar</div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </Stage>
  );
}

function IsolateButton({ frame, fps, isolate }: { frame: number; fps: number; isolate: number }) {
  const boxW = 760;
  const boxLeft = (STAGE.width - boxW) / 2;
  const boxTop = 260;
  const pressed = frame >= isolate;
  const clickBump = springIn(frame, fps, isolate, { damping: 13 });
  // Box-relative (the <Cursor> below is nested inside this box's own
  // positioning context, not the stage): the button is the flex row's
  // right-hand child, 220x92, inset 32px from the panel's right/bottom edge.
  const buttonCx = boxW - 32 - 220 / 2;
  const buttonCy = 64 + (220 - 64) / 2;

  return (
    <div style={{ position: 'absolute', left: boxLeft, top: boxTop, width: boxW }}>
      <Panel title="EDR · Contención" icon="shield" accent="cyan" style={{ height: 220 }} bodyStyle={{ padding: '0 32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', height: '100%', gap: 32 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: FONT.sans, fontSize: TYPE.label, fontWeight: 750, color: C.textStrong }}>{ISOLATION.host}</div>
            <div style={{ fontFamily: FONT.sans, fontSize: TYPE.small, color: C.muted, marginTop: 4 }}>{ISOLATION.user}</div>
            <div style={{ marginTop: 14 }}>
              <Chip accent={pressed ? 'emerald' : 'cyan'} icon={pressed ? 'lock' : 'unlock'} size={TYPE.small}>
                {pressed ? 'AISLADO' : 'EN LÍNEA'}
              </Chip>
            </div>
          </div>
          <div
            style={{
              width: 220,
              height: 92,
              borderRadius: RADIUS.lg,
              border: `3px solid ${alpha(C.rose, pressed ? 0.5 : 0.9)}`,
              background: pressed ? alpha(C.rose, 0.12) : alpha(C.rose, 0.22),
              display: 'grid',
              placeItems: 'center',
              fontFamily: FONT.sans,
              fontSize: TYPE.label,
              fontWeight: 800,
              letterSpacing: 1,
              color: C.textStrong,
              transform: `scale(${1 - 0.06 * Math.min(1, clickBump)})`,
            }}
          >
            {pressed ? 'AISLANDO…' : 'AISLAR'}
          </div>
        </div>
      </Panel>
      {frame < isolate + 20 ? (
        <Cursor
          frame={frame}
          appearAt={isolate - 40}
          path={[
            { x: buttonCx + 60, y: buttonCy + 90, at: isolate - 34 },
            { x: buttonCx, y: buttonCy, at: isolate - 2 },
            { x: buttonCx, y: buttonCy, at: isolate, click: true },
            { x: buttonCx + 30, y: buttonCy + 50, at: isolate + 18 },
          ]}
        />
      ) : null}
    </div>
  );
}

const HUB_NODE_W = 190;
const HUB_GAP = 26;

function ChannelHub({ frame, at, width }: { frame: number; at: number; width: number }) {
  const step = HUB_NODE_W + HUB_GAP;
  const rowW = CHANNELS.length * step - HUB_GAP;
  const xOffset = (width - rowW) / 2;
  const centers = CHANNELS.map((_, i) => xOffset + i * step + HUB_NODE_W / 2);
  const hubW = 260;
  const hubLeft = (width - hubW) / 2;
  const hubTop = 0;
  const hubH = 96; // NodeCard's actual rendered height
  const barY = hubTop + hubH + 26;
  const childTop = barY + 22;

  return (
    <div style={{ position: 'relative', width, height: 300 }}>
      <div style={{ position: 'absolute', left: hubLeft, top: hubTop, width: hubW, height: hubH }}>
        <NodeCard icon="laptop" label={ISOLATION.host} accent="emerald" state="active" width={hubW} />
      </div>

      {/* Stub down from the hub, and the horizontal bar it branches from. */}
      <div style={{ position: 'absolute', left: hubLeft + hubW / 2 - 1.5, top: hubTop + hubH, width: 3, height: barY - (hubTop + hubH), background: C.ink500 }} />
      <div style={{ position: 'absolute', left: centers[0], top: barY, width: centers[centers.length - 1] - centers[0], height: 3, background: C.ink500 }} />

      {CHANNELS.map((ch, i) => {
        const nodeAt = at + i * 8;
        if (frame < nodeAt) return null;
        const inn = enter(frame, nodeAt, { distance: 12 });
        const cut = ch.cut && frame >= nodeAt + 6;
        const stubColor = ch.cut ? (cut ? C.rose : C.ink500) : C.emerald;
        return (
          <div key={ch.key}>
            <div style={{ position: 'absolute', left: centers[i] - 1.5, top: barY, width: 3, height: childTop - barY, background: stubColor, opacity: ch.cut ? (cut ? 0.9 : 0.5) : 0.5 + 0.5 * pulse(frame, 30, 0.7) }} />
            <div style={{ position: 'absolute', left: centers[i] - HUB_NODE_W / 2, top: childTop, width: HUB_NODE_W, ...inn }}>
              <ChannelNode icon={ch.icon as IconName} label={ch.label} cut={cut} keep={!ch.cut} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ChannelNode({ icon, label, cut, keep }: { icon: IconName; label: string; cut: boolean; keep: boolean }) {
  const accent = keep ? C.emerald : cut ? C.rose : C.ink500;
  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
        padding: '14px 10px',
        borderRadius: RADIUS.md,
        border: `2px solid ${alpha(accent, keep || cut ? 0.7 : 0.4)}`,
        background: alpha(accent, keep ? 0.12 : cut ? 0.08 : 0.05),
      }}
    >
      <Icon name={cut ? 'unplug' : icon} size={30} color={accent} />
      {/* "Consola EDR" is what `edr-channel` names — keep it at label size; the
          three cut channels are texture and read fine smaller. */}
      <span style={{ fontFamily: FONT.sans, fontSize: keep ? TYPE.label : TYPE.small, fontWeight: 700, color: keep ? C.textStrong : C.text, textAlign: 'center', lineHeight: 1.15 }}>
        {label}
      </span>
    </div>
  );
}

function RamPanel({ frame, at, width }: { frame: number; at: number; width: number }) {
  return (
    <Panel title="Memoria" icon="bolt" accent="emerald" glow={0.35} style={{ width, height: 250 }} bodyStyle={{ padding: '14px 26px' }}>
      <div style={{ display: 'flex', alignItems: 'center', height: '100%', gap: 28 }}>
        {/* "procesos, conexiones y claves" is spoken at `ram` — keep it at label size. */}
        <Checklist frame={frame} items={PRESERVED.map((label, i) => ({ label, at: at + i * 8 }))} accent="emerald" size={TYPE.label} />
        <div style={{ marginLeft: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, opacity: fadeIn(frame, at + 30, 10) }}>
          <Icon name="power" size={30} color={C.roseSoft} />
          <span style={{ fontFamily: FONT.sans, fontSize: TYPE.micro, fontWeight: 700, color: C.roseSoft }}>Sin apagar</span>
        </div>
      </div>
    </Panel>
  );
}

function LogPanel({ frame, at, width }: { frame: number; at: number; width: number }) {
  const rows = [
    { label: 'Motivo', value: ISOLATION.reason },
    { label: 'Hora', value: ISOLATION.time },
    { label: 'Responsable', value: ISOLATION.owner },
  ];
  return (
    <Panel title="Registro de aislamiento" icon="file" accent="cyan" style={{ width, height: 340 }} bodyStyle={{ padding: '10px 28px' }}>
      <div style={{ display: 'grid', gap: 20, paddingTop: 10 }}>
        {rows.map((row, i) => {
          const rowAt = at + i * 10;
          if (frame < rowAt) return null;
          return (
            <div key={row.label} style={{ ...enter(frame, rowAt, { distance: 12 }) }}>
              <div style={{ fontFamily: FONT.sans, fontSize: TYPE.micro, fontWeight: 750, letterSpacing: 1, textTransform: 'uppercase', color: C.muted }}>
                {row.label}
              </div>
              <div style={{ fontFamily: FONT.sans, fontSize: TYPE.label, fontWeight: 650, color: C.textStrong, marginTop: 2 }}>{row.value}</div>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}

import type { ReactNode } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { ACCENT, C, FONT, TYPE, alpha, type Accent } from '../../../engine/src/theme/tokens';
import { EASE, enter, fadeIn, progress } from '../../../engine/src/theme/motion';
import { Chip, Connector, Icon, MonoLine, NodeCard, Panel, curveBetween, type IconName, type MonoToken } from '../../../engine/src/ui';
import { Stage } from './kit';

const DOMAIN = 'cdn-halden-sync.example';
const FALLBACK = '203.0.113.77 · 443';

const LEFT_W = 860;
const RIGHT_LEFT = LEFT_W + 40;
const RIGHT_W = 1728 - RIGHT_LEFT;
const TOP_H = 470;
const BOTTOM_Y = TOP_H + 24;
const BOTTOM_H = 660 - BOTTOM_Y;

/**
 * s04-dns «DNS filtering»: Lucía enables the macro and PowerShell asks the DNS
 * for the newly-registered C2 domain. Reputation flags it, the filter
 * withholds the answer, and the connection never starts — but the malware's
 * plan B, a hard-coded IP on 443, never touches the DNS, so this control
 * cannot see it.
 */
export function S04Dns(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const openDoc = props.cue('open-doc');
  const resolve = props.cue('resolve');
  const newlyReg = props.cue('newly-registered');
  const blocked = props.cue('blocked');
  const fallback = props.cue('fallback-ip');

  const leftIn = enter(frame, 6, { distance: 18 });
  const rightIn = enter(frame, openDoc + 16, { distance: 18, axis: 'x' });
  const bottomIn = enter(frame, fallback - 8, { distance: 20 });

  return (
    <Stage>
      {/* Left: Lucía's laptop — the macro fires PowerShell, which asks the DNS. */}
      <div style={{ position: 'absolute', left: 0, top: 0, width: LEFT_W, height: TOP_H, ...leftIn }}>
        <Panel title="Portátil de Lucía" icon="laptop" accent="amber" style={{ height: '100%' }} bodyStyle={{ padding: '22px 28px' }}>
          <DocBanner frame={frame} at={openDoc} />
          <Terminal frame={frame} fps={fps} resolveAt={resolve} blockedAt={blocked} />
        </Panel>
      </div>

      {/* Right: the DNS filtering pipeline — query, reputation, verdict. */}
      <div style={{ position: 'absolute', left: RIGHT_LEFT, top: 0, width: RIGHT_W, height: TOP_H, ...rightIn }}>
        <Panel
          title="DNS filtering"
          icon="shield"
          accent="cyan"
          glow={progress(frame, blocked, 10) * (1 - progress(frame, blocked + 110, 40))}
          style={{ height: '100%' }}
          bodyStyle={{ padding: '10px 30px' }}
        >
          <Step icon="globe" label="Consulta" at={resolve} accent="rose">
            <MonoLine tokens={[{ t: DOMAIN, c: C.roseSoft, bold: true }]} size={TYPE.label} />
          </Step>
          <StepArrow frame={frame} at={resolve + 26} />
          <Step icon="radar" label="Reputación" at={newlyReg} accent="amber">
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
              <span style={{ fontFamily: FONT.sans, fontSize: TYPE.label, color: C.text }}>Registrado hace 2 días</span>
              <Chip accent="amber" size={TYPE.small}>
                SOSPECHOSO
              </Chip>
            </div>
          </Step>
          <StepArrow frame={frame} at={newlyReg + 26} />
          <Step icon="x" label="Resultado" at={blocked} accent="emerald">
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
              <span style={{ fontFamily: FONT.sans, fontSize: TYPE.label, color: C.text }}>Sin respuesta</span>
              <Chip accent="emerald" icon="check" size={TYPE.small} solid>
                BLOQUEADO
              </Chip>
            </div>
          </Step>
        </Panel>
      </div>

      {/* Bottom: the malware's plan B bypasses the DNS entirely. */}
      <div style={{ position: 'absolute', left: 0, top: BOTTOM_Y, width: 1728, height: BOTTOM_H, ...bottomIn }}>
        <FallbackRow frame={frame} fallback={fallback} />
      </div>
    </Stage>
  );
}

function DocBanner({ frame, at }: { frame: number; at: number }) {
  const p = progress(frame, at, 12);
  if (p <= 0) return null;
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        marginBottom: 18,
        opacity: p,
        transform: `translateY(${(1 - p) * -10}px)`,
      }}
    >
      <Icon name="file" size={36} color={C.amber} />
      <span style={{ fontFamily: FONT.sans, fontSize: TYPE.label, fontWeight: 700, color: C.textStrong }}>turnos_muelle3.docm</span>
      <Chip accent="amber" solid size={TYPE.small}>
        MACRO HABILITADA
      </Chip>
    </div>
  );
}

function Terminal({ frame, fps, resolveAt, blockedAt }: { frame: number; fps: number; resolveAt: number; blockedAt: number }) {
  const SIZE = 27;
  const cmd: MonoToken[] = [
    { t: 'PS> ', c: C.faint },
    { t: `Resolve-DnsName ${DOMAIN}` },
  ];
  const cmdLen = cmd.reduce((sum, t) => sum + t.t.length, 0);
  const visible = Math.min(cmdLen, Math.max(0, Math.floor(((frame - resolveAt) / fps) * 52)));
  const typing = visible < cmdLen;
  return (
    <div style={{ opacity: fadeIn(frame, resolveAt - 4, 10) }}>
      {frame >= resolveAt ? <MonoLine tokens={cmd} size={SIZE} visibleChars={visible} caret={typing} /> : null}
      {frame >= blockedAt ? (
        <div style={{ marginTop: 14, opacity: fadeIn(frame, blockedAt, 14) }}>
          <MonoLine
            tokens={[
              { t: 'Resolve-DnsName : ', c: C.roseSoft, bold: true },
              { t: 'No se pudo resolver el nombre.', c: C.roseSoft },
            ]}
            size={SIZE - 2}
          />
        </div>
      ) : null}
    </div>
  );
}

function Step({ icon, label, at, accent, children }: { icon: IconName; label: string; at: number; accent: Accent; children: ReactNode }) {
  const frame = useCurrentFrame();
  const p = progress(frame, at, 14);
  const a = ACCENT[accent];
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 20, padding: '12px 4px', opacity: 0.35 + 0.65 * p }}>
      <div
        style={{
          width: 56,
          height: 56,
          flexShrink: 0,
          borderRadius: 14,
          display: 'grid',
          placeItems: 'center',
          background: alpha(a.fg, 0.1 + 0.1 * p),
          border: `2px solid ${alpha(a.fg, 0.3 + 0.5 * p)}`,
          boxShadow: p > 0 ? `0 0 ${20 * p}px ${alpha(a.fg, 0.3 * p)}` : 'none',
        }}
      >
        <Icon name={icon} size={30} color={a.fg} />
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontFamily: FONT.sans, fontSize: TYPE.small, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: C.muted }}>
          {label}
        </div>
        <div style={{ marginTop: 6 }}>{children}</div>
      </div>
    </div>
  );
}

function StepArrow({ frame, at }: { frame: number; at: number }) {
  const p = progress(frame, at, 10);
  if (p <= 0) return null;
  return (
    <div style={{ display: 'flex', justifyContent: 'center', opacity: p, margin: '0 0' }}>
      <Icon name="arrowDown" size={24} color={C.ink500} />
    </div>
  );
}

function FallbackRow({ frame, fallback }: { frame: number; fallback: number }) {
  if (frame < fallback - 24) return null;
  const draw = progress(frame, fallback, 22, EASE.inOut);
  const labelIn = fadeIn(frame, fallback + 8, 14);
  const curve = curveBetween({ x: 220, y: 76 }, { x: 1508, y: 76 }, 0.4);
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <svg width={1728} height={166} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        <Connector curve={curve} color={C.rose} width={4} draw={draw} flow={draw >= 1 ? frame / 30 : undefined} />
      </svg>
      <div style={{ position: 'absolute', left: 0, top: 12 }}>
        <NodeCard icon="bolt" label="Malware" sublabel="plan B" accent="rose" state="active" />
      </div>
      <div style={{ position: 'absolute', left: '50%', top: 2, transform: 'translateX(-50%)', textAlign: 'center', opacity: labelIn }}>
        <Icon name="unplug" size={28} color={C.roseSoft} />
        <div style={{ fontFamily: FONT.sans, fontSize: TYPE.small, color: C.roseSoft, fontWeight: 700, marginTop: 4, whiteSpace: 'nowrap' }}>
          sin consulta DNS
        </div>
        <div style={{ fontFamily: FONT.sans, fontSize: TYPE.micro, color: C.muted, whiteSpace: 'nowrap' }}>este filtro no lo ve</div>
      </div>
      <div style={{ position: 'absolute', right: 0, top: 12 }}>
        <NodeCard icon="server" label={FALLBACK} sublabel="IP fija · sin DNS" accent="rose" state="active" />
      </div>
    </div>
  );
}

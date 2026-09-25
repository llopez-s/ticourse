import { interpolateColors, useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, TYPE, alpha } from '../../../engine/src/theme/tokens';
import { enter, fadeIn, lerp, progress, pulse, springIn } from '../../../engine/src/theme/motion';
import { Chip, Icon, Panel, Stamp } from '../../../engine/src/ui';
import { CASE } from '../data/canon';
import { Stage, wordFrame } from './kit';

const COL_W = 540;
const GAP = (1728 - COL_W * 3) / 2;
const TOP_H = 430;
const BAR_TOP = TOP_H + 36;
const BAR_H = 660 - BAR_TOP;

/**
 * S01 «Operaciones lo quiere esta noche»: the isolated but powered-on laptop,
 * Operations' rebuild request (allowed, but only after the capture), the legal
 * hold and the log rotation it suspends.
 */
export function S01Hold(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const laptopOn = props.cue('laptop-on');
  const rebuild = props.cue('rebuild');
  const hold = props.cue('hold');
  const stop = props.cue('retention-stop');
  const afterCapture = wordFrame('s01-hold', 's01-02', 'capturarlo');
  const court = wordFrame('s01-hold', 's01-02', 'juez');
  const foreseeable = wordFrame('s01-hold', 's01-03', 'previsible');

  const laptop = enter(frame, laptopOn - 6, { distance: 30 });
  const ops = enter(frame, rebuild - 8, { distance: 30 });
  const legal = springIn(frame, fps, hold - 6, { damping: 16 });
  const bar = enter(frame, stop - 40, { distance: 24 });

  return (
    <Stage>
      {/* A · the laptop: isolated, still powered on */}
      <div style={{ position: 'absolute', left: 0, top: 0, width: COL_W, height: TOP_H, ...laptop }}>
        <Panel title={CASE.laptop} icon="laptop" accent="amber" style={{ height: '100%' }} bodyStyle={{ padding: 28 }}>
          <LaptopBody frame={frame} fps={fps} start={laptopOn} />
        </Panel>
      </div>

      {/* B · Operations wants it rebuilt tonight */}
      <div style={{ position: 'absolute', left: COL_W + GAP, top: 0, width: COL_W, height: TOP_H, ...ops }}>
        <Panel title="Operaciones" icon="users" accent="amber" style={{ height: '100%' }} bodyStyle={{ padding: 28 }}>
          <OpsRequest frame={frame} rebuild={rebuild} afterCapture={afterCapture} court={court} hold={hold} />
        </Panel>
      </div>

      {/* C · the legal hold */}
      <div
        style={{
          position: 'absolute',
          left: 2 * (COL_W + GAP),
          top: 0,
          width: COL_W,
          height: TOP_H,
          opacity: Math.min(1, legal * 1.4),
          transform: `translateY(${(1 - legal) * 40}px) rotate(${(1 - legal) * 3}deg)`,
        }}
      >
        <Panel
          title="Asesoría jurídica"
          icon="file"
          accent="cyan"
          glow={0.6 * (1 - progress(frame, hold + 60, 30))}
          right={
            <Stamp frame={frame} at={hold + 26} accent="emerald" rotate={-4} size={22} style={{ padding: '4px 14px', borderWidth: 3 }}>
              En vigor
            </Stamp>
          }
          style={{ height: '100%' }}
          bodyStyle={{ padding: 28 }}
        >
          <HoldNotice frame={frame} hold={hold} foreseeable={foreseeable} />
        </Panel>
      </div>

      {/* Bottom · the 30-day log rotation stops */}
      <div style={{ position: 'absolute', left: 0, top: BAR_TOP, width: 1728, height: BAR_H, ...bar }}>
        <RetentionBar frame={frame} fps={fps} stop={stop} />
      </div>
    </Stage>
  );
}

function LaptopBody({ frame, fps, start }: { frame: number; fps: number; start: number }) {
  const led = 0.55 + 0.45 * pulse(frame, fps, 0.8);
  const chip1 = enter(frame, start + 10, { distance: 14 });
  const chip2 = enter(frame, start + 22, { distance: 14 });
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
      <div style={{ position: 'relative', marginTop: 6 }}>
        <Icon name="laptop" size={170} color={C.text} strokeWidth={1.4} />
        <div
          style={{
            position: 'absolute',
            left: 146,
            top: 20,
            width: 18,
            height: 18,
            borderRadius: 9,
            background: C.emerald,
            opacity: led,
            boxShadow: `0 0 ${10 + 14 * led}px ${alpha(C.emerald, 0.8)}`,
          }}
        />
      </div>
      <div style={{ fontFamily: FONT.sans, fontSize: TYPE.small, color: C.muted, marginTop: 4 }}>{CASE.place}</div>
      <div style={{ display: 'flex', gap: 14, marginTop: 26 }}>
        <Chip accent="amber" icon="unplug" size={TYPE.label} style={chip1}>
          Aislado
        </Chip>
        <Chip accent="emerald" icon="power" size={TYPE.label} style={chip2}>
          Encendido
        </Chip>
      </div>
    </div>
  );
}

function OpsRequest({ frame, rebuild, afterCapture, court, hold }: { frame: number; rebuild: number; afterCapture: number; court: number; hold: number }) {
  const bubble = enter(frame, rebuild - 4, { distance: 16 });
  const later = progress(frame, afterCapture - 4, 14);
  const locked = progress(frame, hold + 18, 14);
  const courtIn = enter(frame, court - 4, { distance: 12 });
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22, height: '100%' }}>
      <div
        style={{
          alignSelf: 'flex-start',
          maxWidth: 440,
          padding: '18px 24px',
          borderRadius: '22px 22px 22px 6px',
          background: C.ink800,
          border: `2px solid ${C.ink600}`,
          fontFamily: FONT.sans,
          fontSize: TYPE.label,
          lineHeight: 1.3,
          color: C.textStrong,
          ...bubble,
        }}
      >
        ¿Lo reinstalamos esta noche?
      </div>
      <div style={{ position: 'relative', height: 76 }}>
        {/* The request button turns into the condition: after the capture. */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            padding: '0 24px',
            borderRadius: 16,
            border: `3px solid ${interpolateColors(later, [0, 1], [C.amber, C.cyan])}`,
            background: alpha(later > 0.5 ? C.cyan : C.amber, 0.12),
            fontFamily: FONT.sans,
            fontSize: TYPE.label,
            fontWeight: 700,
            color: C.textStrong,
          }}
        >
          <Icon name={locked > 0.5 ? 'lock' : later > 0.5 ? 'clock' : 'gear'} size={36} color={later > 0.5 ? C.cyan : C.amber} />
          <span style={{ opacity: 1 - later, position: 'absolute', left: 78 }}>Reinstalar ya</span>
          <span style={{ opacity: later, position: 'absolute', left: 78 }}>Reinstalar tras la captura</span>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontFamily: FONT.sans, fontSize: TYPE.small, color: C.muted, ...courtIn }}>
        <Icon name="alert" size={30} color={C.amber} />
        Puede acabar ante un juez
      </div>
    </div>
  );
}

function HoldNotice({ frame, hold, foreseeable }: { frame: number; hold: number; foreseeable: number }) {
  const rows = [
    { k: 'Caso', v: CASE.id, at: hold + 10 },
    { k: 'Nace', v: 'litigio previsible', at: foreseeable - 4 },
    { k: 'No espera', v: 'a la demanda', at: foreseeable + 20 },
  ];
  return (
    <div style={{ position: 'relative', height: '100%', fontFamily: FONT.sans }}>
      <div style={{ fontSize: TYPE.h3, fontWeight: 850, letterSpacing: 1, color: C.textStrong }}>LEGAL HOLD</div>
      <div style={{ marginTop: 6, fontSize: TYPE.small, color: C.muted }}>Orden de conservación</div>
      <div style={{ marginTop: 22, display: 'grid', gap: 14 }}>
        {rows.map((r) => (
          <div key={r.k} style={{ display: 'flex', gap: 16, alignItems: 'baseline', ...enter(frame, r.at, { distance: 12 }) }}>
            <span style={{ width: 150, fontSize: TYPE.small, color: C.faint, flexShrink: 0 }}>{r.k}</span>
            <span style={{ fontSize: TYPE.label, fontWeight: 650, color: C.cyanSoft }}>{r.v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/** 30 days of case logs; the rotation sweep eats the oldest until the hold freezes it. */
function RetentionBar({ frame, fps, stop }: { frame: number; fps: number; stop: number }) {
  const DAYS = 30;
  const barW = 1728 - 2 * 32;
  const sweepStart = stop - 60;
  // The sweep advances until the cue, then freezes where it is.
  const sweep = lerp(Math.min(frame, stop), [sweepStart, stop], [0, 4.2]);
  const frozen = progress(frame, stop, 12);
  const labelIn = fadeIn(frame, stop + 4, 12);
  const paused = springIn(frame, fps, stop, { damping: 15 });
  return (
    <div
      style={{
        position: 'relative',
        height: '100%',
        borderRadius: 22,
        border: `2px solid ${frozen > 0.5 ? alpha(C.emerald, 0.6) : C.ink700}`,
        background: `linear-gradient(180deg, ${C.ink850} 0%, ${C.ink900} 100%)`,
        padding: '18px 32px',
        boxSizing: 'border-box',
        fontFamily: FONT.sans,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <Icon name="archive" size={32} color={C.muted} />
        <span style={{ fontSize: TYPE.label, fontWeight: 650, color: C.text }}>Logs del caso · rotación a 30 días</span>
        <span style={{ marginLeft: 'auto', opacity: labelIn }}>
          <Chip accent="emerald" icon="pause" size={TYPE.label} solid>
            Borrado suspendido
          </Chip>
        </span>
      </div>
      <div style={{ position: 'relative', marginTop: 20, width: barW, height: 44 }}>
        {Array.from({ length: DAYS }, (_, d) => {
          const gone = d < Math.floor(sweep);
          return (
            <div
              key={d}
              style={{
                position: 'absolute',
                left: (d * barW) / DAYS + 2,
                top: 0,
                width: barW / DAYS - 4,
                height: 44,
                borderRadius: 6,
                background: gone ? alpha(C.rose, 0.12) : alpha(C.cyan, 0.28),
                border: `2px solid ${gone ? alpha(C.rose, 0.35) : alpha(C.cyan, 0.5)}`,
              }}
            />
          );
        })}
        {/* The sweep head */}
        <div
          style={{
            position: 'absolute',
            left: (sweep * barW) / DAYS - 3,
            top: -10,
            width: 6,
            height: 64,
            borderRadius: 3,
            background: frozen > 0.5 ? C.emerald : C.rose,
            boxShadow: `0 0 16px ${alpha(frozen > 0.5 ? C.emerald : C.rose, 0.8)}`,
            transform: `scaleY(${1 + 0.25 * paused * (1 - frozen)})`,
          }}
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, width: barW, fontSize: TYPE.micro, color: C.faint }}>
        <span>día 30 (el más antiguo)</span>
        <span>hoy</span>
      </div>
    </div>
  );
}

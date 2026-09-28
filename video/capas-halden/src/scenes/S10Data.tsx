import type { ReactNode } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { ACCENT, C, FONT, RADIUS, TYPE, alpha, type Accent } from '../../../engine/src/theme/tokens';
import { progress, springIn } from '../../../engine/src/theme/motion';
import { Chip, Icon, type IconName } from '../../../engine/src/ui';
import { Stage } from './kit';

const CELL_W = 852;
const CELL_H = 318;
const GAP = 24;

/**
 * S10 «Datos, dispositivos y personas»: four independent vignettes, each a
 * question with its answering capability — FIM, DLP, NAC, UBA. All four
 * questions are visible from the start (dimmed); each one resolves on its
 * own cue with a small illustrated answer.
 */
export function S10Data(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fim = props.cue('fim');
  const dlp = props.cue('dlp');
  const nac = props.cue('nac');
  const uba = props.cue('uba');

  const cells: {
    x: number;
    y: number;
    at: number;
    icon: IconName;
    question: string;
    cap: string;
    accent: Accent;
    node: ReactNode;
  }[] = [
    {
      x: 0,
      y: 0,
      at: fim,
      icon: 'file',
      question: '¿Alguien ha tocado este archivo?',
      cap: 'FIM',
      accent: 'cyan',
      node: <FimVisual frame={frame} at={fim} />,
    },
    {
      x: CELL_W + GAP,
      y: 0,
      at: dlp,
      icon: 'mail',
      question: '¿Se nos va información?',
      cap: 'DLP',
      accent: 'emerald',
      node: <DlpVisual frame={frame} fps={fps} at={dlp} />,
    },
    {
      x: 0,
      y: CELL_H + GAP,
      at: nac,
      icon: 'network',
      question: '¿Debería estar en la red?',
      cap: 'NAC',
      accent: 'amber',
      node: <NacVisual frame={frame} fps={fps} at={nac} />,
    },
    {
      x: CELL_W + GAP,
      y: CELL_H + GAP,
      at: uba,
      icon: 'users',
      question: '¿Encaja con sus costumbres?',
      cap: 'UBA',
      accent: 'cyan',
      node: <UbaVisual frame={frame} at={uba} />,
    },
  ];

  return (
    <Stage>
      {cells.map((c) => (
        <div key={c.cap} style={{ position: 'absolute', left: c.x, top: c.y, width: CELL_W, height: CELL_H }}>
          <Vignette frame={frame} fps={fps} at={c.at} icon={c.icon} question={c.question} capLabel={c.cap} accent={c.accent}>
            {c.node}
          </Vignette>
        </div>
      ))}
    </Stage>
  );
}

function Vignette({
  frame,
  fps,
  at,
  icon,
  question,
  capLabel,
  accent,
  children,
}: {
  frame: number;
  fps: number;
  at: number;
  icon: IconName;
  question: string;
  capLabel: string;
  accent: Accent;
  children: ReactNode;
}) {
  const solved = frame >= at;
  const pop = springIn(frame, fps, at, { damping: 14 });
  const a = ACCENT[accent];
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        boxSizing: 'border-box',
        padding: '24px 28px',
        borderRadius: RADIUS.lg,
        border: `2px solid ${solved ? alpha(a.fg, 0.55) : C.ink700}`,
        background: `linear-gradient(180deg, ${C.ink850} 0%, ${C.ink900} 100%)`,
        boxShadow: solved ? `0 0 30px ${alpha(a.fg, 0.16)}` : 'none',
        fontFamily: FONT.sans,
        overflow: 'hidden',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
        <Icon name={icon} size={34} color={solved ? a.fg : C.muted} style={{ marginTop: 2, flexShrink: 0 }} />
        <div style={{ fontSize: TYPE.label, fontWeight: 700, lineHeight: 1.2, color: solved ? C.textStrong : C.muted, flex: 1 }}>
          {question}
        </div>
        {solved ? (
          <span style={{ opacity: Math.min(1, pop * 1.3), transform: `scale(${0.7 + 0.3 * pop})`, flexShrink: 0 }}>
            <Chip accent={accent} size={TYPE.label} solid>
              {capLabel}
            </Chip>
          </span>
        ) : null}
      </div>
      <div style={{ marginTop: 22, opacity: solved ? 1 : 0.28 }}>{children}</div>
    </div>
  );
}

function MiniArrow({ lit }: { lit: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.35 + 0.65 * lit, flexShrink: 0, paddingTop: 24 }}>
      <Icon name="arrowRight" size={24} color={lit > 0.5 ? C.cyanSoft : C.faint} />
    </div>
  );
}

/**
 * Compact icon tile with a wrapping label/sublabel — unlike NodeCard, text
 * never overflows its box, which matters when three of these share one cell.
 */
function MiniNode({
  icon,
  label,
  sublabel,
  accent,
  dim,
  w,
}: {
  icon: IconName;
  label: string;
  sublabel?: string;
  accent: Accent;
  dim?: boolean;
  w: number;
}) {
  const a = ACCENT[accent];
  return (
    <div
      style={{
        width: w,
        boxSizing: 'border-box',
        flexShrink: 0,
        padding: '14px 10px',
        borderRadius: RADIUS.md,
        border: `2px solid ${dim ? C.ink700 : alpha(a.fg, 0.55)}`,
        background: dim ? C.ink850 : alpha(a.fg, 0.1),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: 6,
      }}
    >
      <Icon name={icon} size={26} color={dim ? C.muted : a.fg} />
      <span style={{ fontSize: TYPE.small, fontWeight: 700, color: dim ? C.muted : C.textStrong, lineHeight: 1.2 }}>{label}</span>
      {sublabel ? <span style={{ fontSize: TYPE.micro, color: C.faint, lineHeight: 1.2 }}>{sublabel}</span> : null}
    </div>
  );
}

/** FIM: a stored baseline hash vs. the current one — the config file's manifest. */
function FimVisual({ frame, at }: { frame: number; at: number }) {
  const mismatch = progress(frame, at + 22, 14);
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <HashRow label="Línea base" time="ayer · 22:00" hash="A63F 2B9E 71D0" color={C.cyanSoft} />
      <HashRow
        label="Ahora"
        time="hoy · 14:32"
        hash={mismatch > 0.15 ? 'E91C 04AA 58F7' : '···· ···· ····'}
        color={mismatch > 0.5 ? C.roseSoft : C.faint}
        flag={mismatch > 0.5}
      />
      <div style={{ fontSize: TYPE.micro, color: C.muted, fontStyle: 'italic' }}>
        firewall-rules.conf · como cotejar la carga con su manifiesto
      </div>
    </div>
  );
}

function HashRow({ label, time, hash, color, flag }: { label: string; time: string; hash: string; color: string; flag?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <span style={{ width: 118, fontSize: TYPE.small, fontWeight: 650, color: C.text, flexShrink: 0 }}>{label}</span>
      <span style={{ fontFamily: FONT.mono, fontSize: TYPE.small, fontWeight: 700, color, letterSpacing: 1 }}>{hash}</span>
      <span style={{ fontSize: TYPE.micro, color: C.faint, marginLeft: 'auto' }}>{time}</span>
      {flag ? (
        <Chip accent="rose" size={TYPE.micro} solid style={{ marginLeft: 10 }}>
          CAMBIÓ
        </Chip>
      ) : null}
    </div>
  );
}

/** DLP: the practicaje contract heading to a personal webmail, blocked in transit. */
function DlpVisual({ frame, fps, at }: { frame: number; fps: number; at: number }) {
  const lit1 = progress(frame, at, 10);
  const blocked = progress(frame, at + 16, 12);
  const pop = springIn(frame, fps, at + 16, { damping: 14 });
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
      <MiniNode icon="laptop" label="Portátil" sublabel="contrato-practicaje.pdf" accent="cyan" dim={lit1 <= 0} w={235} />
      <MiniArrow lit={lit1} />
      <MiniNode icon="shield" label="DLP" sublabel={blocked > 0 ? 'bloquea' : 'inspecciona'} accent="emerald" dim={lit1 <= 0} w={195} />
      <MiniArrow lit={blocked} />
      <div style={{ position: 'relative', width: 235 }}>
        <MiniNode icon="mail" label="Webmail personal" sublabel="destino no corporativo" accent="rose" dim={blocked <= 0} w={235} />
        {blocked > 0.4 ? (
          <span
            style={{
              position: 'absolute',
              right: -6,
              top: -16,
              opacity: Math.min(1, (blocked - 0.4) * 2 * pop * 1.3),
              transform: `scale(${0.7 + 0.3 * pop})`,
            }}
          >
            <Chip accent="emerald" icon="x" size={TYPE.micro} solid>
              BLOQUEADO
            </Chip>
          </span>
        ) : null}
      </div>
    </div>
  );
}

/** NAC: a contractor's laptop lands in a quarantine VLAN after identity + posture check. */
function NacVisual({ frame, fps, at }: { frame: number; fps: number; at: number }) {
  const lit1 = progress(frame, at, 10);
  const decided = progress(frame, at + 16, 12);
  const pop = springIn(frame, fps, at + 16, { damping: 14 });
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
      <MiniNode icon="laptop" label="Portátil contratista" sublabel="identidad no corporativa" accent="amber" dim={lit1 <= 0} w={245} />
      <MiniArrow lit={lit1} />
      <MiniNode icon="network" label="NAC" sublabel="identidad + estado" accent="cyan" dim={lit1 <= 0} w={190} />
      <MiniArrow lit={decided} />
      <div style={{ position: 'relative', width: 230 }}>
        <MiniNode icon="router" label="VLAN cuarentena" sublabel="acceso limitado" accent="amber" dim={decided <= 0} w={230} />
        {decided > 0.4 ? (
          <span
            style={{
              position: 'absolute',
              right: -6,
              top: -16,
              opacity: Math.min(1, (decided - 0.4) * 2 * pop * 1.3),
              transform: `scale(${0.7 + 0.3 * pop})`,
            }}
          >
            <Chip accent="amber" size={TYPE.micro} solid>
              CUARENTENA
            </Chip>
          </span>
        ) : null}
      </div>
    </div>
  );
}

const UBA_BUCKETS: { label: string; base: number }[] = [
  { label: '00', base: 8 },
  { label: '03', base: 6 },
  { label: '06', base: 4 },
  { label: '09', base: 30 },
  { label: '12', base: 42 },
  { label: '15', base: 38 },
  { label: '18', base: 46 },
  { label: '21', base: 20 },
];

/** UBA: an account's usual pattern of downloads by hour, and one bulk download at 03:00. */
function UbaVisual({ frame, at }: { frame: number; at: number }) {
  const spike = progress(frame, at + 10, 20);
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, height: 100 }}>
        {UBA_BUCKETS.map((b, i) => {
          const isSpike = i === 1;
          const h = isSpike ? 12 + spike * 78 : b.base;
          const lit = isSpike && spike > 0.3;
          return (
            <div key={b.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, width: 60 }}>
              <div
                style={{
                  width: '100%',
                  height: h,
                  borderRadius: 5,
                  background: lit ? C.rose : C.ink600,
                  boxShadow: lit ? `0 0 18px ${alpha(C.rose, 0.5)}` : 'none',
                }}
              />
              <span style={{ fontSize: TYPE.micro, fontFamily: FONT.mono, color: lit ? C.roseSoft : C.faint }}>{b.label}</span>
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: 10, fontSize: TYPE.micro, color: C.muted }}>línea base de descargas por franja horaria</div>
      {spike > 0.3 ? (
        <span style={{ display: 'inline-block', marginTop: 10, opacity: Math.min(1, (spike - 0.3) * 2) }}>
          <Chip accent="rose" size={TYPE.micro} solid>
            03:00 · fuera de la línea base
          </Chip>
        </span>
      ) : null}
    </div>
  );
}

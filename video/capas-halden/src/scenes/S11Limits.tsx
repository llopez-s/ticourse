import type { ReactNode } from 'react';
import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { ACCENT, C, FONT, RADIUS, TYPE, alpha, type Accent } from '../../../engine/src/theme/tokens';
import { enter, progress } from '../../../engine/src/theme/motion';
import { Chip, Icon, NodeCard, type IconName } from '../../../engine/src/ui';
import { Stage, wordFrame } from './kit';

const COL_W = 557;
const GAP = 28;
const PROTO_PAIRS: { unsafe: string; safe: string }[] = [
  { unsafe: 'telnet', safe: 'SSH' },
  { unsafe: 'LDAP', safe: 'LDAPS' },
  { unsafe: 'SNMPv2c', safe: 'SNMPv3' },
];

/**
 * S11 «Lo que no ven»: three blind spots, one per layer already met — the EDR
 * only sees enrolled endpoints, DMARC does not stop lookalike domains, and
 * plaintext protocols get replaced (not merely IP-restricted). Closes with the
 * columns settling into a stacked-layers gesture that answers "por eso se apilan".
 */
export function S11Limits(props: SceneProps) {
  const frame = useCurrentFrame();
  const unenrolled = props.cue('unenrolled');
  const lookalike = props.cue('lookalike');
  const secureProto = props.cue('secure-proto');
  const stackAt = wordFrame('s11-limits', 's11-04', 'apilan');

  const collapse = progress(frame, stackAt, 20);
  const colStyle = { opacity: 1 - 0.78 * collapse, transform: `scale(${1 - 0.05 * collapse})` };

  return (
    <Stage>
      <div style={{ position: 'absolute', left: 0, top: 0, width: COL_W, height: '100%', ...colStyle }}>
        <ColumnShell frame={frame} at={unenrolled} icon="eyeOff" title="Cobertura del EDR" accent="cyan">
          <EdrContent frame={frame} at={unenrolled} />
        </ColumnShell>
      </div>
      <div style={{ position: 'absolute', left: COL_W + GAP, top: 0, width: COL_W, height: '100%', ...colStyle }}>
        <ColumnShell frame={frame} at={lookalike} icon="globe" title="Dominios parecidos" accent="cyan">
          <LookalikeContent frame={frame} at={lookalike} />
        </ColumnShell>
      </div>
      <div style={{ position: 'absolute', left: (COL_W + GAP) * 2, top: 0, width: COL_W, height: '100%', ...colStyle }}>
        <ColumnShell frame={frame} at={secureProto} icon="lock" title="Protocolo en claro" accent="cyan">
          <ProtoContent frame={frame} at={secureProto} />
        </ColumnShell>
      </div>
      <StackClose frame={frame} at={stackAt} />
    </Stage>
  );
}

function ColumnShell({
  frame,
  at,
  icon,
  title,
  accent,
  children,
}: {
  frame: number;
  at: number;
  icon: IconName;
  title: string;
  accent: Accent;
  children: ReactNode;
}) {
  const inn = enter(frame, at, { distance: 26 });
  const a = ACCENT[accent];
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        boxSizing: 'border-box',
        padding: '28px 28px',
        borderRadius: RADIUS.lg,
        border: `2px solid ${alpha(a.fg, 0.4)}`,
        background: `linear-gradient(180deg, ${C.ink850} 0%, ${C.ink900} 100%)`,
        fontFamily: FONT.sans,
        opacity: inn.opacity,
        transform: inn.transform,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <Icon name={icon} size={32} color={a.fg} />
        <span style={{ fontSize: TYPE.label, fontWeight: 750, color: C.textStrong }}>{title}</span>
      </div>
      <div style={{ marginTop: 28 }}>{children}</div>
    </div>
  );
}

/** The EDR only sees the laptop that carries its agent; the other one is invisible to it. */
function EdrContent({ frame, at }: { frame: number; at: number }) {
  const reveal = progress(frame, at + 16, 16);
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <NodeCard icon="laptop" label="Con agente EDR" sublabel="visible para el EDR" accent="cyan" state="active" width={480} />
      <div style={{ textAlign: 'center', fontSize: TYPE.micro, color: C.faint }}>misma red corporativa</div>
      <NodeCard
        icon={reveal > 0.5 ? 'eyeOff' : 'laptop'}
        label="Sin agente"
        sublabel={reveal > 0.5 ? 'invisible para el EDR' : 'estado desconocido'}
        accent={reveal > 0.5 ? 'rose' : 'muted'}
        state={reveal > 0.5 ? 'active' : 'idle'}
        width={480}
      />
    </div>
  );
}

function Domain({ text, highlightIndex }: { text: string; highlightIndex?: number }) {
  return (
    <span style={{ fontFamily: FONT.mono, fontSize: TYPE.small, fontWeight: 700, letterSpacing: 0.5 }}>
      {text.split('').map((ch, i) => (
        <span key={i} style={{ color: i === highlightIndex ? C.rose : C.text }}>
          {ch}
        </span>
      ))}
    </span>
  );
}

/** DMARC aligns the From against your own domain — a domain with a swapped character is a different domain. */
function LookalikeContent({ frame, at }: { frame: number; at: number }) {
  const reveal = progress(frame, at + 12, 16);
  return (
    <div style={{ display: 'grid', gap: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <Icon name="check" size={28} color={C.emerald} style={{ flexShrink: 0 }} />
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: TYPE.micro, color: C.muted }}>Tu dominio</div>
          <Domain text="haldenport.example" />
        </div>
        <span style={{ marginLeft: 'auto', flexShrink: 0 }}>
          <Chip accent="emerald" size={TYPE.micro}>
            protegido
          </Chip>
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, opacity: Math.max(0.3, reveal) }}>
        <Icon name="x" size={28} color={reveal > 0.5 ? C.rose : C.faint} style={{ flexShrink: 0 }} />
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: TYPE.micro, color: C.muted }}>Dominio parecido</div>
          <Domain text="haldenp0rt.example" highlightIndex={7} />
        </div>
        <span style={{ marginLeft: 'auto', flexShrink: 0 }}>
          <Chip accent="rose" size={TYPE.micro} solid={reveal > 0.5}>
            sin proteger
          </Chip>
        </span>
      </div>
      <div style={{ fontSize: TYPE.micro, color: C.muted }}>DMARC protege tu dominio, no sus imitaciones.</div>
    </div>
  );
}

/** Plaintext protocols are replaced by their secure version; IP restriction alone is not enough. */
function ProtoContent({ frame, at }: { frame: number; at: number }) {
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      {PROTO_PAIRS.map((p, i) => {
        const lit = progress(frame, at + 10 + i * 16, 12);
        return (
          <div key={p.unsafe} style={{ display: 'flex', alignItems: 'center', gap: 14, opacity: Math.max(0.32, lit) }}>
            <Chip accent="rose" size={TYPE.small}>
              {p.unsafe}
            </Chip>
            <Icon name="arrowRight" size={24} color={lit > 0.5 ? C.cyanSoft : C.faint} />
            <Chip accent="emerald" size={TYPE.small} solid={lit > 0.5}>
              {p.safe}
            </Chip>
          </div>
        );
      })}
      <div
        style={{
          marginTop: 10,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '14px 18px',
          borderRadius: RADIUS.md,
          border: `2px solid ${alpha(C.amber, 0.5)}`,
          background: alpha(C.amber, 0.09),
          opacity: progress(frame, at + 62, 14),
        }}
      >
        <Icon name="eye" size={26} color={C.amber} style={{ flexShrink: 0 }} />
        <span style={{ fontSize: TYPE.small, fontWeight: 650, color: C.text, lineHeight: 1.25 }}>
          Restringir por IP no basta: sigue viajando en claro.
        </span>
      </div>
    </div>
  );
}

/** Closing gesture: every layer has a blind spot, which is why they stack. */
function StackClose({ frame, at }: { frame: number; at: number }) {
  const p = progress(frame, at, 20);
  if (p <= 0) return null;
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: p,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 20,
          padding: '40px 56px',
          borderRadius: RADIUS.lg,
          background: alpha(C.ink950, 0.86),
          border: `2px solid ${alpha(C.cyan, 0.4)}`,
          boxShadow: `0 30px 70px ${alpha('#000000', 0.45)}`,
        }}
      >
        <Icon name="layers" size={72} color={C.cyan} />
        <div style={{ fontFamily: FONT.sans, fontSize: TYPE.h3, fontWeight: 800, color: C.textStrong, textAlign: 'center', whiteSpace: 'nowrap' }}>
          Cada capa tiene un punto ciego
        </div>
      </div>
    </div>
  );
}

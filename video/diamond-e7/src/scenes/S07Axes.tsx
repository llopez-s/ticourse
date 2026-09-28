import type { ReactNode } from 'react';
import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, TYPE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, fadeIn, progress } from '../../../engine/src/theme/motion';
import { Chip, Icon } from '../../../engine/src/ui';
import { Diamond, vertexPoint } from './parts/Diamond';
import { Stage, wordFrame } from './kit';

const SCENE = 's07-axes';
// Diamond shifted left so the «¿Por qué Meridian?» card fits on the right.
const GEO = { cx: 600, cy: 322, hw: 430, hh: 238 };
const CARD_W = 340;

/**
 * s07-axes «Dos ejes»: the full E7 diamond (Adversary still UNKNOWN). The
 * socio-political axis (Adversary–Victim) draws in and asks «por qué esta
 * víctima» — Meridian, for its propulsion IP, the customer's need. Then the
 * technology axis (Capability–Infrastructure) draws in with the four pieces
 * of how the technique is deployed. End: «porqué» vs «cómo».
 */
export function S07Axes(props: SceneProps) {
  const frame = useCurrentFrame();
  const axisSp = props.cue('axis-sp');
  const whyMeridian = props.cue('why-meridian');
  const axisTech = props.cue('axis-tech');

  const sp = progress(frame, axisSp, 34, EASE.inOut);
  const tech = progress(frame, axisTech, 34, EASE.inOut);

  // Emphasis: the pair of vertices joined by the axis being drawn.
  const spGlow = progress(frame, axisSp, 14) * (1 - progress(frame, axisSp + 90, 30));
  const techGlow = progress(frame, axisTech, 14) * (1 - progress(frame, axisTech + 90, 30));

  const pieces = [
    { text: 'implante', at: wordFrame(SCENE, 's07-03', 'implante'), side: 'cap' as const },
    { text: 'dominio', at: wordFrame(SCENE, 's07-03', 'dominio'), side: 'infra' as const },
    { text: 'hosting', at: wordFrame(SCENE, 's07-03', 'hosting'), side: 'infra' as const },
    { text: 'certificado', at: wordFrame(SCENE, 's07-03', 'certificado'), side: 'infra' as const },
  ];
  const whyAt = wordFrame(SCENE, 's07-04', 'porqué');
  const howAt = wordFrame(SCENE, 's07-04', 'cómo');

  const cap = vertexPoint('cap', GEO);
  const infra = vertexPoint('infra', GEO);

  return (
    <Stage>
      <Diamond
        {...GEO}
        cardW={CARD_W}
        axes={{ sp, tech }}
        vertices={{
          adv: { unknown: true, glow: spGlow },
          vic: { items: ['ENG-WS-041'], glow: spGlow },
          cap: { items: ['GLASS VIPER'], glow: techGlow },
          infra: { items: ['update-svc-cdn.com'], glow: techGlow },
        }}
      />

      {/* Socio-political axis label, centred on the upper half of the vertical axis. */}
      <AxisLabel
        x={GEO.cx}
        y={GEO.cy - 84}
        color={C.roseSoft}
        title="eje socio-político"
        sub="por qué esta víctima"
        show={progress(frame, axisSp + 14, 18)}
        tag={{ text: 'PORQUÉ', show: progress(frame, whyAt, 14) }}
      />

      {/* Technology axis label, under the horizontal axis. */}
      <AxisLabel
        x={GEO.cx}
        y={GEO.cy + 70}
        color={C.cyanSoft}
        title="eje tecnológico"
        sub="cómo se despliega la técnica"
        show={progress(frame, axisTech + 14, 18)}
        tag={{ text: 'CÓMO', show: progress(frame, howAt, 14) }}
      />

      {/* The four deployment pieces, filed under the vertex they belong to. */}
      <div style={{ position: 'absolute', left: cap.x - 110, top: cap.y + 96, width: 220, display: 'flex', justifyContent: 'center' }}>
        <PieceChip {...pieces[0]} frame={frame} />
      </div>
      <div
        style={{
          position: 'absolute',
          left: infra.x - 110,
          top: infra.y + 96,
          width: 220,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 12,
        }}
      >
        {pieces.slice(1).map((p) => (
          <PieceChip key={p.text} {...p} frame={frame} />
        ))}
      </div>

      {/* Side card: why Meridian. */}
      <div style={{ position: 'absolute', left: 1236, top: 24, width: 492, ...enter(frame, whyMeridian, { distance: 26, axis: 'x' }) }}>
        <SideCard>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <Icon name="target" size={38} color={C.roseSoft} />
            <div style={{ fontSize: TYPE.body, fontWeight: 850, color: C.textStrong, whiteSpace: 'nowrap' }}>¿Por qué Meridian?</div>
          </div>
          <div style={{ marginTop: 18, fontSize: TYPE.label, fontWeight: 650, color: C.text, lineHeight: 1.25 }}>
            propiedad intelectual de propulsión
          </div>
          <div style={{ marginTop: 12, fontSize: TYPE.label, fontWeight: 700, color: C.textStrong, lineHeight: 1.25, opacity: fadeIn(frame, whyMeridian + 40, 16) }}>
            <span style={{ color: C.roseSoft, fontWeight: 850 }}>=</span> la necesidad del <span style={{ color: C.roseSoft, fontWeight: 850 }}>customer</span>
          </div>
        </SideCard>
      </div>

      {/* End state: one axis explains why, the other how. */}
      <div style={{ position: 'absolute', left: 1236, top: 380, width: 492, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <SummaryRow color={C.roseSoft} axis="socio-político" word="el porqué" style={enter(frame, whyAt, { distance: 20, axis: 'x' })} />
        <SummaryRow color={C.cyanSoft} axis="tecnológico" word="el cómo" style={enter(frame, howAt, { distance: 20, axis: 'x' })} />
      </div>
    </Stage>
  );
}

function AxisLabel({
  x,
  y,
  color,
  title,
  sub,
  show,
  tag,
}: {
  x: number;
  y: number;
  color: string;
  title: string;
  sub: string;
  show: number;
  tag: { text: string; show: number };
}) {
  if (show <= 0) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `translate(-50%, -50%) scale(${0.92 + 0.08 * show})`,
        opacity: show,
        padding: '10px 22px 12px',
        borderRadius: RADIUS.md,
        border: `2px solid ${alpha(color, 0.6 + 0.4 * tag.show)}`,
        background: alpha(C.ink950, 0.92),
        boxShadow: tag.show > 0 ? `0 0 ${Math.round(30 * tag.show)}px ${alpha(color, 0.35 * tag.show)}` : undefined,
        fontFamily: FONT.sans,
        textAlign: 'center',
        whiteSpace: 'nowrap',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: TYPE.label, fontWeight: 850, color, lineHeight: 1.15 }}>{title}</div>
        {/* The tag's slot grows with it, so the title re-centres smoothly instead of jumping. */}
        <div style={{ maxWidth: Math.round(170 * EASE.inOut(tag.show)), overflow: 'hidden', padding: '6px 0', flexShrink: 0 }}>
        <div
          style={{
            marginLeft: 14,
            display: 'inline-block',
            transform: `rotate(-4deg) scale(${1.3 - 0.3 * tag.show})`,
            opacity: tag.show,
            padding: '2px 12px',
            borderRadius: RADIUS.sm,
            background: color,
            color: C.ink950,
            fontSize: TYPE.small,
            fontWeight: 900,
            letterSpacing: 2,
          }}
        >
          {tag.text}
        </div>
        </div>
      </div>
      <div style={{ fontSize: TYPE.label, fontWeight: 600, color: C.text, lineHeight: 1.2, marginTop: 2 }}>{sub}</div>
    </div>
  );
}

function PieceChip({ text, at, side, frame }: { text: string; at: number; side: 'cap' | 'infra'; frame: number }) {
  const p = progress(frame, at, 14);
  if (p <= 0) return null;
  return (
    <div style={{ opacity: p, transform: `translateY(${(1 - p) * 14}px)` }}>
      <Chip accent={side === 'cap' ? 'amber' : 'cyan'} size={TYPE.label} style={side === 'infra' ? { borderColor: alpha(C.sky, 0.6), color: C.sky, background: alpha(C.sky, 0.1) } : undefined}>
        {text}
      </Chip>
    </div>
  );
}

function SideCard({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        padding: '22px 26px 24px',
        borderRadius: RADIUS.lg,
        border: `2px solid ${alpha(C.roseSoft, 0.55)}`,
        background: `linear-gradient(180deg, ${alpha(C.rose, 0.12)} 0%, ${alpha(C.ink900, 0.96)} 100%)`,
        boxShadow: `0 24px 60px ${alpha('#000000', 0.35)}`,
        fontFamily: FONT.sans,
      }}
    >
      {children}
    </div>
  );
}

function SummaryRow({ color, axis, word, style }: { color: string; axis: string; word: string; style: { opacity: number; transform: string } }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        padding: '14px 22px',
        borderRadius: RADIUS.md,
        border: `2px solid ${alpha(color, 0.6)}`,
        background: alpha(C.ink900, 0.94),
        fontFamily: FONT.sans,
        ...style,
      }}
    >
      <div style={{ width: 34, height: 0, borderTop: `5px dashed ${color}`, flexShrink: 0 }} />
      <div style={{ whiteSpace: 'nowrap' }}>
        <div style={{ fontSize: TYPE.h3, fontWeight: 850, color, lineHeight: 1.05 }}>{word}</div>
        <div style={{ fontSize: TYPE.label, fontWeight: 600, color: C.text, marginTop: 4 }}>eje {axis}</div>
      </div>
    </div>
  );
}

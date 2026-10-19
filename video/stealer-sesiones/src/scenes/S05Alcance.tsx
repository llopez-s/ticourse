import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../engine/src/theme/motion';
import { Icon, type IconName } from '../../../engine/src/ui/Icon';
import { tone as toneOf, type Tone } from '../../../engine/src/ui/tone';
import { Note, Pill, Reveal, Tag } from './parts/bits';
import { Stage, segment, wordFrame } from './kit';

const S = 's05-caso';
const RAIL_Y = 124;
const NODE_X = [216, 648, 1080, 1512];
const SRC_Y = 262;
const SRC_W = 408;

interface Node {
  icon: IconName;
  title: string;
  sub: string;
  tone: Tone;
  dashed: boolean;
}

const NODES: Node[] = [
  { icon: 'unplug', title: 'Posible extracción', sub: 'periodo posible', tone: 'rose', dashed: true },
  { icon: 'radar', title: 'Detección', sub: 'cuándo se detectó', tone: 'cyan', dashed: false },
  { icon: 'power', title: 'Contención', sub: 'qué se hizo', tone: 'emerald', dashed: false },
  { icon: 'search', title: 'Accesos posteriores', sub: 'qué ocurrió después', tone: 'amber', dashed: true },
];

const SOURCES: { icon: IconName; title: string; sub: string; tone: Tone }[] = [
  { icon: 'laptop', title: 'Endpoint', sub: 'cuentas y apps expuestas', tone: 'rose' },
  { icon: 'shield', title: 'Identidad', sub: 'inicios de sesión y cambios', tone: 'emerald' },
  { icon: 'app', title: 'Aplicaciones', sub: 'permisos y consentimientos', tone: 'sky' },
  { icon: 'mail', title: 'Auditoría de correo', sub: 'accesos y cambios relevantes', tone: '#fb923c' },
];

function TimelineNode({ frame, i, at }: { frame: number; i: number; at: number }) {
  const n = NODES[i];
  const t = toneOf(n.tone);
  const p = progress(frame, at, 16);
  return (
    <div style={{ position: 'absolute', left: NODE_X[i] - 190, top: RAIL_Y - 40, width: 380, textAlign: 'center', opacity: p, transform: `translateY(${(1 - p) * 14}px)`, fontFamily: FONT.sans }}>
      <div style={{ margin: '0 auto', width: 80, height: 80, borderRadius: 40, display: 'grid', placeItems: 'center', background: C.ink950, border: `3px ${n.dashed ? 'dashed' : 'solid'} ${alpha(t.fg, 0.9)}`, boxShadow: n.dashed ? 'none' : `0 0 24px ${alpha(t.fg, 0.28)}` }}>
        <Icon name={n.icon} size={42} color={t.fg} />
      </div>
      <div style={{ marginTop: 10, fontSize: 36, fontWeight: 800, color: C.textStrong, lineHeight: 1.1 }}>{n.title}</div>
      <div style={{ marginTop: 2, fontSize: 27, fontWeight: 580, color: n.dashed ? C.muted : t.soft }}>{n.sub}</div>
    </div>
  );
}

/**
 * s05-caso «Ampliar el alcance con preguntas». A didactic timeline with no invented hours: detection first
 * (what is known), then the period that could have been active and what came after; two tags separate the time
 * of observation from the time the alert arrived. The four sources (endpoint, identity, applications, mail
 * audit) follow as the voice names them; a lone new address is not proof. At s05-c a log bar shows the part
 * already deleted by retention: a limit, not a «nothing happened».
 */
export function S05Alcance(props: SceneProps) {
  const frame = useCurrentFrame();
  const at = (id: string) => segment(props, id).from;
  const nodeAt = [wordFrame(S, 's05-01', 'periodo') - 20, wordFrame(S, 's05-01', 'detectó') - 20, wordFrame(S, 's05-01', 'después') - 10, wordFrame(S, 's05-01', 'ocurrió') - 8];
  const rail = progress(frame, at('s05-01') + 6, 200, EASE.inOut);
  const srcAt = [at('s05-03') - 4, wordFrame(S, 's05-03', 'identidad') - 14, at('s05-04') + 4, wordFrame(S, 's05-03', 'correo') - 14];
  const cap = props.cue('s05-c');
  const gap = wordFrame(S, 's05-05', 'borrado') - 30;
  const limit = at('s05-06');
  const barW = 1000;
  const goneW = 420 * progress(frame, gap + 10, 30);

  return (
    <Stage>
      {/* timeline */}
      <svg width={1728} height={250} style={{ position: 'absolute', left: 0, top: 0 }}>
        <line x1={NODE_X[0]} x2={NODE_X[0] + (NODE_X[3] - NODE_X[0]) * rail} y1={RAIL_Y} y2={RAIL_Y} stroke={alpha(C.cyan, 0.4)} strokeWidth={4} strokeDasharray="4 12" strokeLinecap="round" />
      </svg>
      {NODES.map((_, i) => (
        <TimelineNode key={i} frame={frame} i={i} at={nodeAt[i]} />
      ))}
      <Reveal frame={frame} at={at('s05-01') + 8} outAt={at('s05-02') - 6} x={0} y={8} w={1100}>
        <Pill icon="clock" tone="cyan" size={32}>línea temporal con lo que sí conoces</Pill>
      </Reveal>
      <Reveal frame={frame} at={at('s05-02')} x={310} y={14} w={720}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Tag tone="cyan" size={28}>hora de observación</Tag>
          <Icon name="split" size={38} color={C.muted} />
          <Tag tone="amber" size={28}>hora de la alerta</Tag>
        </div>
      </Reveal>

      {/* sources */}
      {SOURCES.map((s, i) => {
        const t = toneOf(s.tone);
        return (
          <Reveal key={s.title} frame={frame} at={srcAt[i]} x={i * (SRC_W + 32)} y={SRC_Y} w={SRC_W}>
            <div style={{ boxSizing: 'border-box', width: SRC_W, height: 176, padding: '14px 20px', borderRadius: RADIUS.md, background: C.ink850, border: `2px solid ${alpha(t.fg, 0.6)}`, fontFamily: FONT.sans }}>
              <Icon name={s.icon} size={44} color={t.fg} />
              <div style={{ marginTop: 6, fontSize: 34, fontWeight: 800, color: C.textStrong, lineHeight: 1.1 }}>{s.title}</div>
              <div style={{ marginTop: 3, fontSize: 27, fontWeight: 580, lineHeight: 1.15, color: t.soft }}>{s.sub}</div>
            </div>
          </Reveal>
        );
      })}
      <Reveal frame={frame} at={wordFrame(S, 's05-04', 'dirección') - 16} outAt={cap - 6} x={0} y={466} w={1728}>
        <Note icon="alert" tone="amber" size={30} w={900}>una dirección de red nueva, aislada, no basta para demostrar abuso</Note>
      </Reveal>

      {/* retention gap */}
      <Reveal frame={frame} at={cap - 6} x={0} y={540} w={1728}>
        <div style={{ position: 'relative', width: barW, height: 100, fontFamily: FONT.sans }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: C.muted }}>registros disponibles</div>
          <div style={{ position: 'absolute', left: 0, top: 44, width: barW, height: 52, boxSizing: 'border-box', borderRadius: 10, border: `2px solid ${alpha(C.cyan, 0.6)}`, background: alpha(C.cyan, 0.18), overflow: 'hidden' }}>
            <div style={{ position: 'absolute', left: 0, top: 0, width: goneW, height: '100%', background: `repeating-linear-gradient(135deg, ${alpha(C.amber, 0.35)} 0 10px, ${alpha(C.amber, 0.08)} 10px 20px)`, borderRight: `3px dashed ${C.amber}` }} />
          </div>
          {goneW > 8 ? (
            <div style={{ position: 'absolute', left: 8, top: 52, fontSize: 28, fontWeight: 800, color: '#fcd34d', opacity: progress(frame, gap + 24, 12) }}>borrados al vencer el plazo</div>
          ) : null}
        </div>
      </Reveal>
      <Reveal frame={frame} at={limit} x={1060} y={534} w={668}>
        <div style={{ display: 'grid', gap: 10 }}>
          <Pill icon="search" tone="muted" size={30}>no demuestra que nada ocurriera</Pill>
          <Pill icon="flag" tone="amber" size={30}>queda anotado como límite</Pill>
        </div>
      </Reveal>
    </Stage>
  );
}

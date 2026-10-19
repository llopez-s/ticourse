import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { progress } from '../../../engine/src/theme/motion';
import { windowWeight } from '../../../engine/src/ui/Focus';
import { Icon, type IconName } from '../../../engine/src/ui/Icon';
import { LearningCard, Pill, Reveal, Tag } from './parts/bits';
import { Stage, audioEnd, segment, wordFrame } from './kit';

const S = 's09-caso';
const PANEL_W = 780;
const PANEL_H = 420;
const RIGHT_X = 948;

function Panel({ frame, at, subAt, x, icon, title, sub, tone }: { frame: number; at: number; subAt: number; x: number; icon: IconName; title: string; sub: string; tone: string }) {
  const p = progress(frame, at, 18);
  const s = progress(frame, subAt, 14);
  return (
    <div style={{ position: 'absolute', left: x, top: 0, width: PANEL_W, height: PANEL_H, boxSizing: 'border-box', borderRadius: RADIUS.lg, background: alpha(tone, 0.05), border: `2px solid ${alpha(tone, 0.55)}`, opacity: p, transform: `translateY(${(1 - p) * 14}px)`, fontFamily: FONT.sans }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '18px 26px 0' }}>
        <Icon name={icon} size={52} color={tone} />
        <div>
          <div style={{ fontSize: 42, fontWeight: 850, color: C.textStrong, lineHeight: 1.1 }}>{title}</div>
          <div style={{ marginTop: 2, fontSize: 28, fontWeight: 600, color: tone, opacity: s, height: 32 }}>{sub}</div>
        </div>
      </div>
    </div>
  );
}

function Item({ frame, at, lit, x, y, icon, label, tone }: { frame: number; at: number; lit: number; x: number; y: number; icon: IconName; label: string; tone: string }) {
  return (
    <Reveal frame={frame} at={at} x={x} y={y} w={PANEL_W - 48}>
      <div style={{ boxSizing: 'border-box', width: PANEL_W - 48, height: 64, display: 'flex', alignItems: 'center', gap: 18, padding: '0 22px', borderRadius: RADIUS.md, background: lit > 0.01 ? alpha(tone, 0.14) : C.ink850, border: `2px solid ${alpha(tone, 0.35 + 0.55 * lit)}`, boxShadow: `0 0 ${10 + 22 * lit}px ${alpha(tone, 0.3 * lit)}`, fontFamily: FONT.sans }}>
        <Icon name={icon} size={38} color={tone} />
        <span style={{ fontSize: 36, fontWeight: 750, color: C.textStrong }}>{label}</span>
      </div>
    </Reveal>
  );
}

/**
 * s09-caso «El equipo no vale más por recibir más muestras». Two separate panels: what the source observes
 * (devices, episodes, records) and the CTI value chain (requirement, product, decision, result), each step lit
 * as the voice names it. Between them, a dashed arrow with a cross: volume does not become value or lower risk
 * on its own. Coverage / activity / collection as sources of change, the separate sections of a deliverable,
 * and «temporal coincidence is not a demonstrated cause». Learning card closes the scene.
 */
export function S09Caso(props: SceneProps) {
  const frame = useCurrentFrame();
  const at = (id: string) => segment(props, id).from;
  const w = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);
  const sep = props.cue('s09-c');
  const cardAt = audioEnd(S, 's09-06') + 6;

  const say = (seg: string, word: string, next: number) => windowWeight(frame, w(seg, word), next, { ramp: 12, lead: 6 });
  const prod = w('s09-02', 'productos');
  const req = w('s09-02', 'requisitos');
  const dec = w('s09-02', 'decisiones');
  const res = w('s09-02', 'resultados');
  const end2 = at('s09-03');
  const cross = progress(frame, w('s09-03', 'demuestra') - 6, 16);

  return (
    <Stage>
      <Panel frame={frame} at={at('s09-01') - 6} subAt={sep} x={0} icon="radar" title="Métricas de amenaza" sub="qué observaste" tone={C.cyan} />
      <Panel frame={frame} at={prod - 30} subAt={sep + 10} x={RIGHT_X} icon="target" title="Valor CTI" sub="qué decisión ayuda a tomar" tone={C.sky} />

      <Item frame={frame} at={w('s09-01', 'fenómeno') - 8} lit={0} x={24} y={116} icon="laptop" label="Dispositivos" tone={C.cyan} />
      <Item frame={frame} at={w('s09-01', 'fenómeno') + 8} lit={0} x={24} y={194} icon="clock" label="Episodios" tone={C.cyan} />
      <Item frame={frame} at={w('s09-01', 'fenómeno') + 24} lit={0} x={24} y={272} icon="database" label="Registros" tone={C.cyan} />

      <Item frame={frame} at={prod - 8} lit={say('s09-02', 'requisitos', dec)} x={RIGHT_X + 24} y={112} icon="flag" label="Requisito" tone={C.sky} />
      <Item frame={frame} at={prod + 4} lit={say('s09-02', 'productos', req)} x={RIGHT_X + 24} y={188} icon="file" label="Producto" tone={C.sky} />
      <Item frame={frame} at={prod + 16} lit={say('s09-02', 'decisiones', res)} x={RIGHT_X + 24} y={264} icon="users" label="Decisión" tone={C.sky} />
      <Item frame={frame} at={prod + 28} lit={say('s09-02', 'resultados', end2)} x={RIGHT_X + 24} y={340} icon="check" label="Resultado" tone={C.sky} />

      {/* no automatic cause between volume and value */}
      <svg width={168} height={80} style={{ position: 'absolute', left: PANEL_W, top: 170, opacity: cross }}>
        <line x1={14} y1={40} x2={150} y2={40} stroke={alpha(C.muted, 0.8)} strokeWidth={4} strokeDasharray="10 9" strokeLinecap="round" />
        <polygon points="158,40 138,29 138,51" fill={alpha(C.muted, 0.8)} />
        <circle cx={84} cy={40} r={26} fill={C.ink950} stroke={C.amber} strokeWidth={3.5} />
        <path d="M73 29l22 22M95 29L73 51" stroke={C.amber} strokeWidth={4} strokeLinecap="round" />
      </svg>

      <Reveal frame={frame} at={w('s09-03', 'Recibir') - 6} outAt={at('s09-04') - 6} x={0} y={444} w={900}>
        <Pill icon="x" tone="amber" size={32}>recibir más archivos no demuestra más valor</Pill>
      </Reveal>
      <Reveal frame={frame} at={w('s09-03', 'menos') - 8} outAt={at('s09-04') - 6} x={RIGHT_X} y={444} w={780}>
        <Pill icon="x" tone="amber" size={32}>recibir menos no prueba menos riesgo</Pill>
      </Reveal>

      <Reveal frame={frame} at={w('s09-04', 'cobertura') - 8} outAt={at('s09-06') - 6} x={0} y={444} w={900}>
        <div style={{ display: 'flex', gap: 14 }}>
          <Tag tone="amber" size={30}>cobertura</Tag>
          <Tag tone="amber" size={30}>actividad</Tag>
          <Tag tone="amber" size={30}>colección</Tag>
        </div>
      </Reveal>
      <Reveal frame={frame} at={w('s09-04', 'conectar') - 8} outAt={at('s09-06') - 6} x={RIGHT_X} y={444} w={780}>
        <Pill icon="link" tone="sky" size={32}>conectar con consumidores y decisiones</Pill>
      </Reveal>

      <Reveal frame={frame} at={w('s09-05', 'entrega') - 8} x={0} y={520} w={1728}>
        <Pill icon="split" tone="muted" size={36}>en la entrega: clasificación de amenazas y evaluación del programa, por separado</Pill>
      </Reveal>
      <Reveal frame={frame} at={at('s09-06')} x={0} y={596} w={1728}>
        <Pill icon="alert" tone="amber" size={36}>una coincidencia temporal no es una causa demostrada</Pill>
      </Reveal>

      <LearningCard frame={frame} at={cardAt} text="Actividad de amenazas no mide por sí sola el valor CTI" />
    </Stage>
  );
}

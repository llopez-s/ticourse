import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { progress } from '../../../engine/src/theme/motion';
import { Icon } from '../../../engine/src/ui/Icon';
import { Choices, InfoCard, LearningCard, Pill, Reveal, Tag, FEED } from './parts/bits';
import { Sym } from './parts/feeds';
import { Stage, audioEnd, segment, wordFrame } from './kit';

const S = 's04-caso';
const NODE_W = 372;
const STEP = NODE_W + 80;
const NODE_Y = 190; // below the think card (first ~165 px) so the chain can stay put the whole scene

function Arrow({ frame, at, x }: { frame: number; at: number; x: number }) {
  const p = progress(frame, at, 14);
  return (
    <svg width={80} height={40} style={{ position: 'absolute', left: x, top: NODE_Y + 42, opacity: p }}>
      <line x1={6} y1={20} x2={52 + 14 * p} y2={20} stroke={C.muted} strokeWidth={5} strokeLinecap="round" />
      <polygon points="74,20 52,8 52,32" fill={C.muted} />
    </svg>
  );
}

function Bars({ a, b, tone }: { a: number; b: number; tone: string }) {
  return (
    <div style={{ display: 'grid', gap: 12, width: 340, padding: '14px 18px', borderRadius: RADIUS.md, border: `2px solid ${alpha(tone, 0.5)}`, background: C.ink850 }}>
      <div style={{ height: 24, width: a, borderRadius: 12, background: alpha(C.text, 0.4) }} />
      <div style={{ height: 24, width: b, borderRadius: 12, background: alpha(C.text, 0.4) }} />
    </div>
  );
}

/**
 * s04-caso «El mismo recorte en tres sobres». The citation chain Faro → Atlas → Eco → blog enters as the voice
 * names it, with no origin marked. Both answers stay neutral through the pause; at `s04-b` the origin option lights,
 * Faro is marked as the origin and the same clipping sits in three envelopes. Then why the publications are kept
 * (not ×3), de-duplication with provenance and times, the two look-alike pairs, and the learning card.
 */
export function S04Caso(props: SceneProps) {
  const frame = useCurrentFrame();
  const at = (id: string) => segment(props, id).from;
  const w = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);
  const reveal = props.cue('s04-b');
  const dedup = props.cue('s04-c');
  const pairs = at('s04-06');
  const cardAt = audioEnd(S, 's04-06') + 6;
  const lit = progress(frame, reveal, 16);
  const nodes = [
    { id: 'faro', verb: 'observa', at: w('s04-01', 'Faro') - 6 },
    { id: 'atlas', verb: 'cita', at: w('s04-01', 'Atlas') - 6 },
    { id: 'eco', verb: 'reproduce', at: w('s04-01', 'Eco') - 6 },
  ] as const;
  const blogAt = at('s04-02') + 24;
  const times = w('s04-04', 'publicaciones');

  return (
    <Stage>
      {nodes.map((n, i) => (
        <Reveal key={n.id} frame={frame} at={n.at} x={i * STEP} y={NODE_Y} w={NODE_W}>
          <InfoCard
            icon={FEED[n.id].icon}
            title={FEED[n.id].name}
            sub={n.id === 'faro' && lit > 0.5 ? 'observa · origen' : n.verb}
            tone={n.id === 'faro' && lit > 0 ? 'emerald' : FEED[n.id].color}
            lit={n.id === 'faro' ? lit : 0}
            dim={n.id === 'faro' ? 0 : 0.45 * lit}
            w={NODE_W}
            h={124}
            titleSize={38}
            subSize={28}
          />
        </Reveal>
      ))}
      <Arrow frame={frame} at={nodes[1].at - 14} x={NODE_W} />
      <Arrow frame={frame} at={nodes[2].at - 14} x={STEP + NODE_W} />
      <Arrow frame={frame} at={blogAt - 8} x={2 * STEP + NODE_W} />
      <Reveal frame={frame} at={blogAt} x={3 * STEP} y={NODE_Y} w={NODE_W}>
        <InfoCard icon="globe" title="blog" sub="otra publicación" tone="muted" w={NODE_W} h={124} titleSize={38} subSize={28} dim={0.45 * lit} />
      </Reveal>

      {/* delivery times stay different: anticipation is kept */}
      {nodes.map((n, i) => (
        <Reveal key={n.id} frame={frame} at={times + 10 + i * 18} x={i * STEP} y={326} w={NODE_W}>
          <Tag tone="sky" size={28}>{['entrega: primero', 'entrega: después', 'entrega: más tarde'][i]}</Tag>
        </Reveal>
      ))}

      <Reveal frame={frame} at={at('s04-02')} outAt={at('s04-04') - 10} x={0} y={400} w={1728}>
        <Choices frame={frame} at={at('s04-02')} revealAt={reveal} labels={['Tres confirmaciones independientes', 'Una observación de origen']} answer={1} />
      </Reveal>

      {/* the same clipping in three envelopes */}
      {nodes.map((n, i) => (
        <Reveal key={n.id} frame={frame} at={w('s04-03', 'recorte') + i * 18} outAt={dedup - 8} x={i * STEP} y={514} w={NODE_W}>
          <div style={{ boxSizing: 'border-box', height: 110, display: 'flex', alignItems: 'center', gap: 16, padding: '0 22px', borderRadius: RADIUS.md, border: `2px solid ${alpha(C.emerald, 0.6)}`, background: alpha(C.emerald, 0.07), fontFamily: FONT.sans }}>
            <Icon name="mail" size={44} color={C.emerald} />
            <span style={{ fontSize: 32, fontWeight: 700, color: C.text }}>mismo recorte</span>
          </div>
        </Reveal>
      ))}
      <Reveal frame={frame} at={w('s04-03', 'hecho')} outAt={dedup - 8} x={3 * STEP} y={514} w={NODE_W}>
        <InfoCard icon="check" title="1 observación" sub="de origen" tone="emerald" w={NODE_W} h={110} titleSize={34} subSize={28} />
      </Reveal>

      <Reveal frame={frame} at={at('s04-04')} outAt={dedup - 8} x={0} y={400} w={1728}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <Pill icon="check" tone="emerald" size={32}>aportan contexto</Pill>
          <Pill icon="bolt" tone="emerald" size={32}>aportan rapidez</Pill>
          <Reveal frame={frame} at={w('s04-04', 'multiplicas') - 4} x={0} y={0} style={{ position: 'relative' }}>
            <Pill icon="x" tone="amber" size={32} strike>corroboración ×3</Pill>
          </Reveal>
        </div>
      </Reveal>

      {/* de-duplication */}
      <Reveal frame={frame} at={dedup} outAt={pairs - 10} x={0} y={514} w={1728}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Pill icon="layers" tone="muted" size={32}>eco de feeds</Pill>
          <Reveal frame={frame} at={w('s04-05', 'deduplicas') - 6} x={0} y={0} style={{ position: 'relative' }}>
            <Pill icon="funnel" tone="cyan" size={32}>deduplicar entidades y eventos</Pill>
          </Reveal>
          <Reveal frame={frame} at={w('s04-05', 'procedencia') - 6} x={0} y={0} style={{ position: 'relative' }}>
            <Tag tone="sky" size={30}>procedencia</Tag>
          </Reveal>
          <Reveal frame={frame} at={w('s04-05', 'tiempos') - 6} x={0} y={0} style={{ position: 'relative' }}>
            <Tag tone="sky" size={30}>tiempos</Tag>
          </Reveal>
        </div>
      </Reveal>

      <Reveal frame={frame} at={pairs} x={0} y={514} w={840}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
          <Bars a={290} b={200} tone={C.emerald} />
          <span style={{ fontFamily: FONT.sans, fontSize: 64, fontWeight: 850, color: C.emerald }}>=</span>
          <Pill tone="emerald" size={30}>misma exposición</Pill>
        </div>
      </Reveal>
      <Reveal frame={frame} at={w('s04-06', 'alertas') - 6} x={888} y={514} w={840}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
          <Bars a={290} b={290} tone={C.amber} />
          <Sym kind="ne" size={60} color={C.amber} strokeWidth={3} />
          <Pill tone="amber" size={30}>hechos distintos</Pill>
        </div>
      </Reveal>
      <LearningCard frame={frame} at={cardAt} text="Sigue el origen; republicar no corrobora" />
    </Stage>
  );
}

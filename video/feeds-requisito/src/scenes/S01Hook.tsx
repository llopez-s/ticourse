import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, alpha } from '../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../engine/src/theme/motion';
import { InfoCard, Pill, Reveal, FEED, FEED_IDS } from './parts/bits';
import { Envelope, Sym } from './parts/feeds';
import { Stage, segment, wordFrame } from './kit';

const S = 's01-hook';

/**
 * s01-hook «Una oferta que parece ganadora». Headline at the `title` cue; the three fictitious offers enter as
 * the voice says «tres feeds», with «más datos / cuesta menos» and volume ≠ value. Meridian and what a feed is at
 * `s01-b`, the «inventados» notice. At `s01-c` those rows step back and give way to two sealed envelopes R1/R2
 * (no results table yet); «dos preguntas diferentes» closes the scene.
 */
export function S01Hook(props: SceneProps) {
  const frame = useCurrentFrame();
  const at = (id: string) => segment(props, id).from;
  const w = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);
  const title = props.cue('title');
  const ctx = props.cue('s01-b');
  const two = props.cue('s01-c');
  const dim = progress(frame, two - 4, 20, EASE.inOut);
  const tres = w('s01-01', 'tres');
  const gone = two - 10;

  return (
    <Stage>
      <div style={{ position: 'absolute', left: 0, top: 0, width: 1728, opacity: progress(frame, title, 18), transform: `translateY(${(1 - progress(frame, title, 18)) * 18}px)`, fontFamily: FONT.sans, fontSize: 66, fontWeight: 850, letterSpacing: -1.5, color: C.textStrong, whiteSpace: 'nowrap' }}>
        Tres ofertas, <span style={{ color: C.cyan }}>¿cuál compras?</span>
      </div>

      <div style={{ position: 'absolute', left: 0, top: 0, width: 1728, height: 330, opacity: 1 - 0.55 * dim }}>
        {FEED_IDS.map((id, i) => (
          <Reveal key={id} frame={frame} at={tres + i * 22 - 8} x={i * 594} y={100} w={540}>
            <InfoCard icon={FEED[id].icon} title={FEED[id].name} sub="oferta ficticia" tone={FEED[id].color} w={540} h={124} />
          </Reveal>
        ))}
        <Reveal frame={frame} at={w('s01-01', 'datos')} x={0} y={252} w={300}>
          <Pill icon="database" tone="cyan" size={32}>más datos</Pill>
        </Reveal>
        <Reveal frame={frame} at={w('s01-01', 'cuesta')} x={338} y={252} w={380}>
          <Pill icon="clock" tone="cyan" size={32}>cuesta menos</Pill>
        </Reveal>
        <Reveal frame={frame} at={w('s01-01', 'volumen')} x={800} y={252} w={928}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
            <Pill icon="layers" tone="muted" size={32}>volumen</Pill>
            <Sym kind="ne" size={52} color={C.amber} />
            <Pill icon="target" tone="emerald" size={32}>valor</Pill>
          </div>
        </Reveal>
      </div>

      <Reveal frame={frame} at={ctx} outAt={gone} x={0} y={350} w={1728}>
        <div style={{ display: 'flex', gap: 48 }}>
          <InfoCard icon="user" title="Meridian · tú, la analista" sub="empresa aeroespacial" tone="sky" w={840} h={116} titleSize={36} />
          <Reveal frame={frame} at={w('s01-02', 'feeds') - 4} x={0} y={0} style={{ position: 'relative' }}>
            <InfoCard icon="database" title="feed = suministro recurrente" sub="entrega datos de forma recurrente" tone="cyan" w={840} h={116} titleSize={36} />
          </Reveal>
        </div>
      </Reveal>
      <Reveal frame={frame} at={at('s01-03')} outAt={gone} x={0} y={490} w={1728}>
        <Pill icon="alert" tone="amber" size={32}>Faro, Atlas y Eco son inventados · sin marcas reales</Pill>
      </Reveal>

      <Reveal frame={frame} at={two} x={0} y={346}>
        <Envelope id="R1" text="exposición de cuentas, con rapidez" tone="cyan" w={800} h={230} />
      </Reveal>
      <Reveal frame={frame} at={w('s01-04', 'También')} x={928} y={346}>
        <Envelope id="R2" text="infraestructura en datos históricos" tone="sky" w={800} h={230} />
      </Reveal>
      <Reveal frame={frame} at={w('s01-05', 'diferentes')} x={0} y={600} w={1728}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
          <Pill icon="split" tone="cyan" size={34}>dos preguntas diferentes</Pill>
          <span style={{ fontFamily: FONT.sans, fontSize: 32, fontWeight: 650, color: alpha(C.text, 0.85) }}>mucha ayuda con una, poca con la otra</span>
        </div>
      </Reveal>
    </Stage>
  );
}

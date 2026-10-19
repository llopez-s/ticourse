import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { progress } from '../../../engine/src/theme/motion';
import { Icon } from '../../../engine/src/ui/Icon';
import { InfoCard, Pill, Reveal, Tag } from './parts/bits';
import { CodeBlock, type CodeLine } from './parts/Code';
import { Stage, segment, wordFrame } from './kit';

const S = 's03-caso';
const TOP = 190; // the engine's intercepted-message card owns the first ~170 px of the stage while it lasts

/**
 * s03-caso «Dos palabras corrientes no hacen una familia». Nothing above y 190 (the HOLLOW LANTERN card). The
 * control benign-common holds two ordinary strings; the naive rule «2 of them» matches it (amber glow, false
 * positive). Below: the two questions to ask first, then narrow-sample vs variants, then the closing pills.
 */
export function S03Comunes(props: SceneProps) {
  const frame = useCurrentFrame();
  const at = (id: string) => segment(props, id).from;
  const w = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);
  const fileAt = at('s03-01') + 6;
  const naiveAt = at('s03-03');
  const hit = w('s03-03', 'detectar') - 6;
  const habit = w('s03-04', 'costumbre') - 20;
  const narrowAt = at('s03-05');
  const s06 = at('s03-06');

  const hitP = progress(frame, hit, 14);
  const code: CodeLine[] = [
    { text: 'strings:', at: naiveAt + 6 },
    { text: '  $a = "Mozilla/5.0"', at: naiveAt + 12 },
    { text: '  $b = "kernel32.dll"', at: naiveAt + 18 },
    { text: 'condition:', at: naiveAt + 24 },
    { text: '  2 of them', at: naiveAt + 30, lit: hitP, tone: 'amber', marks: { '2': { tone: 'amber', at: habit } } },
  ];

  return (
    <Stage>
      {/* the control with two ordinary names */}
      <Reveal frame={frame} at={fileAt} x={0} y={TOP} w={780}>
        <div style={{ boxSizing: 'border-box', width: 780, height: 250, borderRadius: RADIUS.lg, background: C.ink900, border: `2px solid ${alpha(hitP > 0 ? C.amber : C.muted, 0.45 + 0.5 * hitP)}`, boxShadow: hitP > 0 ? `0 0 ${20 + 24 * hitP}px ${alpha(C.amber, 0.3 * hitP)}` : 'none', padding: '18px 24px', fontFamily: FONT.sans }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <Icon name="file" size={38} color={C.muted} />
            <span style={{ fontFamily: FONT.mono, fontSize: 34, fontWeight: 800, color: C.textStrong }}>benign-common</span>
            <span style={{ marginLeft: 'auto' }}>
              <Pill tone="muted" size={26}>control</Pill>
            </span>
          </div>
          <div style={{ marginTop: 26, display: 'flex', gap: 22, flexWrap: 'wrap' }}>
            <Tag tone="muted" size={34}>Mozilla/5.0</Tag>
            <Tag tone="muted" size={34}>kernel32.dll</Tag>
          </div>
          <div style={{ marginTop: 22 }}>
            <Pill icon="globe" tone="amber" size={26}>corrientes en software legítimo</Pill>
          </div>
        </div>
      </Reveal>

      {/* the naive rule */}
      <Reveal frame={frame} at={naiveAt} x={830} y={TOP} w={898}>
        <CodeBlock
          frame={frame}
          lines={code}
          title="regla ingenua"
          width={898}
          size={30}
          tone={hitP > 0 ? 'amber' : 'cyan'}
          lit={hitP}
          chip={hitP > 0 ? <span style={{ opacity: hitP }}><Pill icon="alert" tone="amber" size={26}>coincide con el control</Pill></span> : undefined}
        />
      </Reveal>

      {/* what to ask first */}
      <Reveal frame={frame} at={at('s03-02')} outAt={narrowAt - 8} x={0} y={496}>
        <div style={{ display: 'flex', gap: 24 }}>
          <Pill icon="search" tone="sky" size={32}>¿qué aporta cada patrón?</Pill>
          <Pill icon="archive" tone="sky" size={32}>¿qué control podría contenerlo?</Pill>
        </div>
      </Reveal>

      {/* narrow sample vs variants */}
      <Reveal frame={frame} at={narrowAt} x={0} y={492}>
        <InfoCard icon="target" title="Una muestra" sub="puede usar un rasgo muy específico" tone="cyan" w={840} h={100} titleSize={36} subSize={28} />
      </Reveal>
      <Reveal frame={frame} at={narrowAt + 50} x={888} y={492}>
        <InfoCard icon="layers" title="Variantes" sub="justifica qué se conserva y qué cambia" tone="sky" w={840} h={100} titleSize={36} subSize={28} />
      </Reveal>

      <Reveal frame={frame} at={s06} x={0} y={606}>
        <div style={{ display: 'flex', gap: 20 }}>
          <Pill icon="check" tone="emerald" size={28}>el objetivo y la evidencia mandan</Pill>
          <Pill icon="x" tone="amber" size={28}>ningún umbral hace fiable una cadena débil</Pill>
        </div>
      </Reveal>
    </Stage>
  );
}

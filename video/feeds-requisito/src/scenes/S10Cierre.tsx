import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, TYPE, alpha } from '../../../engine/src/theme/tokens';
import { progress } from '../../../engine/src/theme/motion';
import { RuleCards } from '../../../engine/src/ui/RuleCards';
import { Icon } from '../../../engine/src/ui/Icon';
import { Pill, Reveal, Tag } from './parts/bits';
import { FeedName, Sym } from './parts/feeds';
import { Stage, segment, wordFrame } from './kit';

const S = 's10-cierre';

/**
 * s10-cierre «La compra que puedes defender». Three rule cards (requisito primero / incremento con origen / piloto
 * y coste total) light as the voice says them; under them the consequences one line at a time (R1 → Faro and R2 →
 * Atlas, renovar or dejar de pagar, utilidad observable and not a brand or an isolated percentage). They clear at
 * the call to action: resolve the feed comparison of the lesson s3m1. Credits close, with the GCTI disclaimer;
 * no exam badge.
 */
export function S10Cierre(props: SceneProps) {
  const frame = useCurrentFrame();
  const at = (id: string) => segment(props, id).from;
  const w = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);
  const action = props.cue('s10-c');
  const clear = action - 12;
  const credits = progress(frame, action + 90, 20);

  return (
    <Stage>
      <RuleCards
        width={1728}
        height={330}
        slotAt={at('s10-01') - 20}
        dimFrom={action}
        titleSize={44}
        subSize={30}
        artHeight={0}
        rules={[
          { title: ['Requisito', 'primero'], sub: 'la pregunta antes de las ofertas', icon: 'target', tone: 'cyan', at: at('s10-01') },
          { title: ['Incremento', 'con origen'], sub: 'citar no es confirmar', icon: 'layers', tone: 'sky', at: w('s10-01', 'Cuenta') - 6 },
          { title: ['Piloto y', 'coste total'], sub: 'criterios antes de mirar quién gana', icon: 'chart', tone: 'emerald', at: at('s10-02') },
        ]}
      />

      <Reveal frame={frame} at={at('s10-03')} outAt={clear} x={0} y={366} w={1728}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <Tag tone="cyan" size={32}>R1</Tag>
          <Sym kind="arrow" size={40} color={C.muted} />
          <Reveal frame={frame} at={w('s10-03', 'compras') - 6} x={0} y={0} style={{ position: 'relative' }}><FeedName id="faro" size={34} /></Reveal>
          <span style={{ width: 40 }} />
          <Reveal frame={frame} at={w('s10-03', 'valoras') - 14} x={0} y={0} style={{ position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
              <Tag tone="sky" size={32}>R2</Tag>
              <Sym kind="arrow" size={40} color={C.muted} />
              <FeedName id="atlas" size={34} />
            </div>
          </Reveal>
        </div>
      </Reveal>
      <Reveal frame={frame} at={at('s10-04')} outAt={clear} x={0} y={448} w={1728}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <Pill icon="check" tone="emerald" size={32}>renovar</Pill>
          <Reveal frame={frame} at={w('s10-04', 'dejarías') - 6} x={0} y={0} style={{ position: 'relative' }}><Pill icon="x" tone="amber" size={32}>dejar de pagar</Pill></Reveal>
        </div>
      </Reveal>
      <Reveal frame={frame} at={at('s10-05')} outAt={clear} x={0} y={528} w={1728}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <Pill icon="eye" tone="emerald" size={32}>utilidad observable</Pill>
          <Reveal frame={frame} at={w('s10-05', 'marca') - 6} x={0} y={0} style={{ position: 'relative' }}><Pill icon="x" tone="muted" size={30} strike>una marca</Pill></Reveal>
          <Reveal frame={frame} at={w('s10-05', 'porcentaje') - 6} x={0} y={0} style={{ position: 'relative' }}><Pill icon="x" tone="muted" size={30} strike>un % aislado</Pill></Reveal>
        </div>
      </Reveal>

      <Reveal frame={frame} at={action} x={0} y={366} w={1728}>
        <div style={{ boxSizing: 'border-box', width: 1728, height: 176, display: 'flex', alignItems: 'center', gap: 26, padding: '0 40px', borderRadius: RADIUS.lg, border: `3px solid ${alpha(C.amber, 0.75)}`, background: alpha(C.amberDeep, 0.35), fontFamily: FONT.sans }}>
          <Icon name="flag" size={52} color={C.amber} />
          <div>
            <div style={{ fontSize: TYPE.small, fontWeight: 800, letterSpacing: 4, color: C.amber }}>PRÁCTICA COMPLEMENTARIA</div>
            <div style={{ marginTop: 4, fontSize: 46, fontWeight: 800, lineHeight: 1.15, color: C.textStrong }}>Resuelve la comparación de feeds de la lección s3m1</div>
            <div style={{ marginTop: 6, fontSize: 30, fontWeight: 600, lineHeight: 1.2, color: C.text }}>Una fuente por requisito, y qué evidencia cambiaría tu elección</div>
          </div>
        </div>
      </Reveal>
      <Reveal frame={frame} at={at('s10-07')} x={0} y={552} w={1728}>
        <Pill icon="split" tone="cyan" size={32}>si mañana cambia la base, la decisión también puede cambiar</Pill>
      </Reveal>
      {credits > 0 ? (
        <div style={{ position: 'absolute', left: 0, top: 636, width: 1728, opacity: credits, fontFamily: FONT.sans, fontSize: TYPE.micro + 2, fontWeight: 560, color: C.faint }}>
          Alertópolis · material independiente, no afiliado a SANS/GIAC · datos y participantes ficticios
        </div>
      ) : null}
    </Stage>
  );
}

import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, alpha } from '../../../engine/src/theme/tokens';
import { progress } from '../../../engine/src/theme/motion';
import { windowWeight } from '../../../engine/src/ui/Focus';
import { InfoCard, LearningCard, NotEqual, Pill, Reveal, Tag } from './parts/bits';
import { Stage, audioEnd, segment, wordFrame } from './kit';

const S = 's02-caso';
const COL = { fam: 0, op: 640, role: 1188 };
const NODE_W = 440;
const FAM_Y = [70, 250];
const OP_Y = [70, 250];
const NODE_H = 130;

function Header({ frame, at, x, w, children }: { frame: number; at: number; x: number; w: number; children: string }) {
  return (
    <Reveal frame={frame} at={at} x={x} y={0} w={w}>
      <div style={{ fontFamily: FONT.sans, fontSize: 30, fontWeight: 800, letterSpacing: 3, color: C.muted, textTransform: 'uppercase' }}>{children}</div>
    </Reveal>
  );
}

/** A line from a family node to an operator node; `lit` (0–1) turns it cyan and thicker. */
function Edge({ frame, at, from, to, lit }: { frame: number; at: number; from: number; to: number; lit: number }) {
  const p = progress(frame, at, 18);
  if (p <= 0) return null;
  const y1 = FAM_Y[from] + NODE_H / 2;
  const y2 = OP_Y[to] + NODE_H / 2;
  const x1 = COL.fam + NODE_W + 8;
  const x2 = COL.op - 10;
  const color = lit > 0.05 ? C.cyan : alpha(C.muted, 0.75);
  const ex = x1 + (x2 - x1) * p;
  const ey = y1 + (y2 - y1) * p;
  return (
    <g>
      <line x1={x1} y1={y1} x2={ex} y2={ey} stroke={color} strokeWidth={4 + 2 * lit} strokeLinecap="round" />
      {p > 0.95 ? <polygon points={`${x2},${y2} ${x2 - 20},${y2 - 11} ${x2 - 20},${y2 + 11}`} fill={color} /> : null}
    </g>
  );
}

/**
 * s02-caso «El programa y quien lo usa». Families, operators and the distributor arrive as the voice defines
 * them, then campaign and broker. Three lines show the many-to-many link (one family, several operators; one
 * operator, several families). Abstract «Familia A/B» and «Operador 1/2» keep the real dataset families out of
 * it. Attribution limits, then the learning card.
 */
export function S02Caso(props: SceneProps) {
  const frame = useCurrentFrame();
  const at = (id: string) => segment(props, id).from;
  const w = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);
  const famAt = w('s02-01', 'familia') - 12;
  const opAt = w('s02-01', 'operador') - 12;
  const distAt = w('s02-01', 'distribuidor') - 12;
  const campAt = w('s02-02', 'campaña') - 12;
  const brokerAt = w('s02-02', 'broker') - 12;
  const same = w('s02-03', 'misma');
  const many = w('s02-03', 'Un');
  const announce = w('s02-04', 'anuncia');
  const oneRow = w('s02-04', 'fila');
  const label = props.cue('s02-c');
  const limit = at('s02-06');
  const cardAt = audioEnd(S, 's02-06') + 6;

  const litA = windowWeight(frame, same, many, { ramp: 10, lead: 6 });
  const litB = windowWeight(frame, many, at('s02-04'), { ramp: 10, lead: 6 });

  return (
    <Stage>
      <Header frame={frame} at={famAt} x={COL.fam} w={NODE_W}>Familia</Header>
      <Header frame={frame} at={opAt} x={COL.op} w={NODE_W}>Operador</Header>
      <Header frame={frame} at={distAt} x={COL.role} w={540}>Alrededor</Header>

      <svg width={1728} height={440} style={{ position: 'absolute', left: 0, top: 0 }}>
        <Edge frame={frame} at={same - 6} from={0} to={0} lit={litA} />
        <Edge frame={frame} at={same + 10} from={0} to={1} lit={Math.max(litA, litB)} />
        <Edge frame={frame} at={many + 6} from={1} to={1} lit={litB} />
      </svg>

      <Reveal frame={frame} at={famAt + 8} x={COL.fam} y={FAM_Y[0]}>
        <InfoCard icon="file" title="Familia A" sub="código y capacidades" tone="rose" w={NODE_W} h={NODE_H} titleSize={40} subSize={28} />
      </Reveal>
      <Reveal frame={frame} at={famAt + 26} x={COL.fam} y={FAM_Y[1]}>
        <InfoCard icon="file" title="Familia B" sub="otros criterios" tone="rose" w={NODE_W} h={NODE_H} titleSize={40} subSize={28} />
      </Reveal>
      <Reveal frame={frame} at={opAt + 8} x={COL.op} y={OP_Y[0]}>
        <InfoCard icon="user" title="Operador 1" sub="usa el malware" tone="sky" w={NODE_W} h={NODE_H} titleSize={40} subSize={28} />
      </Reveal>
      <Reveal frame={frame} at={opAt + 26} x={COL.op} y={OP_Y[1]}>
        <InfoCard icon="user" title="Operador 2" sub="usa el malware" tone="sky" w={NODE_W} h={NODE_H} titleSize={40} subSize={28} />
      </Reveal>

      <Reveal frame={frame} at={distAt + 8} x={COL.role} y={60}>
        <InfoCard icon="plug" title="Distribuidor" sub="lo entrega a objetivos" tone="amber" w={540} h={150} titleSize={40} subSize={28} />
      </Reveal>
      <Reveal frame={frame} at={campAt + 8} x={COL.role} y={230}>
        <InfoCard icon="layers" title="Campaña" sub="actividad, alcance y periodo" tone="cyan" w={540} h={150} titleSize={40} subSize={28} />
      </Reveal>
      <Reveal frame={frame} at={brokerAt + 8} x={COL.role} y={400}>
        <InfoCard icon="key" title="Broker" sub="comercializa acceso" tone="emerald" w={540} h={150} titleSize={40} subSize={28} />
      </Reveal>

      {/* what the lines say */}
      <Reveal frame={frame} at={w('s02-02', 'nombres') - 10} outAt={same - 8} x={0} y={450} w={1100}>
        <Pill icon="split" tone="muted" size={34}>no son nombres de lo mismo</Pill>
      </Reveal>
      <Reveal frame={frame} at={same - 8} outAt={announce - 10} x={0} y={450} w={1100}>
        <Pill icon="arrowRight" tone="cyan" size={34}>una familia, varios operadores</Pill>
      </Reveal>
      <Reveal frame={frame} at={many - 8} outAt={announce - 10} x={0} y={526} w={1100}>
        <Pill icon="arrowRight" tone="cyan" size={34}>un operador, varias familias</Pill>
      </Reveal>
      <Reveal frame={frame} at={announce - 8} outAt={label - 10} x={0} y={450} w={1100}>
        <Pill icon="split" tone="amber" size={34}>quien anuncia los datos puede no ser quien los obtuvo</Pill>
      </Reveal>
      <Reveal frame={frame} at={oneRow - 8} outAt={label - 10} x={0} y={526} w={1100}>
        <Pill icon="x" tone="amber" size={34}>no cabe en una fila: un programa, una persona</Pill>
      </Reveal>

      {/* a family label does not attribute */}
      <Reveal frame={frame} at={label - 6} x={0} y={470} w={1100}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
          <Tag tone="rose" size={34}>etiqueta de familia</Tag>
          <NotEqual />
          <Pill icon="user" tone="muted" size={34} strike>autor del robo</Pill>
          <Pill icon="key" tone="muted" size={34} strike>vendedor</Pill>
        </div>
      </Reveal>
      <Reveal frame={frame} at={limit} x={0} y={582} w={1728}>
        <Pill icon="search" tone="sky" size={36}>autoría y relaciones comerciales necesitan otras evidencias</Pill>
      </Reveal>

      <LearningCard frame={frame} at={cardAt} text="Familia, operador y campaña no son equivalentes" />
    </Stage>
  );
}

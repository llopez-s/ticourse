import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { windowWeight } from '../../../engine/src/ui/Focus';
import { Pill, Reveal } from './parts/bits';
import { Board, colX, type Msg } from './parts/Board';
import { Stage, segment, wordFrame } from './kit';

const S = 's03-caso';
const TOP = 180; // the engine's intercepted-message card owns the first 170 px of the stage

/**
 * s03-caso «Cuatro participantes en la misma pantalla». The four columns appear as the voice names them and
 * stay for the rest of the case. Then three separate moves: the request (Mail.Read, on screen only), the
 * consent and policies, Ana's authentication, and the grant — never merged into one arrow.
 */
export function S03Caso(props: SceneProps) {
  const frame = useCurrentFrame();
  const at = (id: string) => segment(props, id).from;
  const w = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);

  const colAt: [number, number, number, number] = [w('s03-01', 'Ana', 0) - 24, w('s03-01', 'Resumen') - 24, at('s03-02') - 4, at('s03-03') - 4];
  const reqAt = w('s03-03', 'pide') - 6;
  const authAt = w('s03-05', 'demuestra') - 6;
  const grantAt = at('s03-06');
  const toGraphAt = w('s03-06', 'Graph') - 8;
  const said = (a: number, b: number) => windowWeight(frame, a, b, { ramp: 10, lead: 4 });
  const lit: [number, number, number, number] = [
    said(w('s03-01', 'Ana', 0), w('s03-01', 'Resumen')),
    said(w('s03-01', 'Resumen'), at('s03-02')),
    said(at('s03-02'), at('s03-03')),
    said(at('s03-03'), reqAt),
  ];
  const allDistinct = windowWeight(frame, w('s03-06', 'identidad') - 4);
  const l2: [number, number, number, number] = [Math.max(lit[0], allDistinct), Math.max(lit[1], allDistinct), Math.max(lit[2], allDistinct), Math.max(lit[3], allDistinct)];

  const msgs: Msg[] = [
    { from: 1, to: 2, y: 150, label: 'solicita acceso', tag: 'Mail.Read', tone: 'sky', at: reqAt },
    { from: 0, to: 2, y: 318, label: 'Ana se identifica · autenticación', tone: 'cyan', at: authAt },
    { from: 2, to: 1, y: 388, label: 'concede una credencial', tone: 'emerald', at: grantAt },
    { from: 1, to: 3, y: 458, label: 'pide leer mensajes de Ana', tone: '#fb923c', at: toGraphAt },
  ];
  return (
    <Stage>
      <div style={{ position: 'absolute', left: 0, top: TOP }}>
        <Board frame={frame} height={480} colAt={colAt} lit={l2} msgs={msgs} />
      </div>
      <Reveal frame={frame} at={at('s03-04')} x={colX(2) + 6} y={TOP + 166} w={380}>
        <div style={{ display: 'grid', gap: 12, justifyItems: 'start' }}>
          <Pill icon="check" tone="sky" size={28}>consentimiento</Pill>
          <Pill icon="shield" tone="sky" size={28}>políticas del entorno</Pill>
        </div>
      </Reveal>
    </Stage>
  );
}

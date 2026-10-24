import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../engine/src/theme/motion';
import { Icon } from '../../../engine/src/ui';
import { Card, Choices, Disc, Pop, Tick } from './parts/bits';
import { Paper } from './parts/Paper';
import { Stage, segment, thinkWindow, wordFrame } from './kit';

const S = 's06-fuentes';
const W = STAGE.width;
const COL_X = 600;
const COL_W = W - COL_X;

/** Interlocking piece (SVG): a rounded plate with a tab on one side and a notch on the other. */
function Piece({ w, h, tone, tab }: { w: number; h: number; tone: string; tab: 'right' | 'left' }) {
  const t = 36;
  const d =
    tab === 'right'
      ? `M6 6 H${w - t - 6} V${h / 2 - 34} a34 34 0 1 1 0 68 V${h - 6} H6 Z`
      : `M${t + 6} 6 H${w - 6} V${h - 6} H${t + 6} V${h / 2 + 34} a34 34 0 1 0 0 -68 Z`;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
      <path d={d} fill={alpha(tone, 0.14)} stroke={tone} strokeWidth={5} strokeLinejoin="round" />
    </svg>
  );
}

/**
 * s06-fuentes «Lo que no se ve». A government attribution document on the left: on `redacted` the black bars
 * sweep across it and only the conclusion stays readable. On `unseen` the header «puede apoyarse en fuentes
 * como…» and two classes of source on the right (SIGINT · comunicaciones interceptadas / evidencia técnica
 * parcial), then the reminder «tu red no tiene esta clase de fuente». As the voice asks, two boxes «ignorar»
 * / «pesar» wait UNMARKED (the whole layout has stepped down so the think prompt keeps the top 176 px).
 * On `weigh` «pesar» is ticked, the document becomes one more sheet in a pile of sources, evaluated, with
 * «peso único · base opaca · fines propios»; at the last segment two interlocking pieces, «empresa privada»
 * and «gobierno», one showing its proof and the other what you cannot see.
 */
export function S06Fuentes(props: SceneProps) {
  const frame = useCurrentFrame();
  const redacted = props.cue('redacted');
  const unseen = props.cue('unseen');
  const weigh = props.cue('weigh');
  const think = thinkWindow(S, 's06-04');
  const pairAt = segment(props, 's06-06').from;

  const sweep = progress(frame, redacted + 6, 34, EASE.inOut);
  const youAt = segment(props, 's06-03').from + 4;
  const choiceAt = wordFrame(S, 's06-04', 'haces') - 4;
  const shift = progress(frame, Math.min(think.from, choiceAt) - 20, 20, EASE.inOut) * 170;
  const w = progress(frame, weigh, 14, EASE.inOut);
  const pair = progress(frame, pairAt - 4, 16, EASE.inOut);
  const evalAt = wordFrame(S, 's06-06', 'fuente') - 6;
  const chipAt = [wordFrame(S, 's06-05', 'único') - 8, wordFrame(S, 's06-05', 'tienen') - 8, wordFrame(S, 's06-05', 'objetivos') - 6];

  return (
    <Stage>
      <div style={{ position: 'absolute', left: 0, top: 0, width: W, height: STAGE.height, transform: `translateY(${shift}px)` }}>
        {/* The document, with its black bars */}
        <Pop at={redacted - 4} frame={frame} x={0} y={10} w={540} h={440} out={w} distance={24}>
          <Paper w={540} h={440} tone="sky" light kicker="documento del gobierno" title="Atribución" titleSize={50} lines={6} redact={[0, 1, 3, 4]} sweep={sweep} legible={<>Conclusión: atribuida a un estado</>} legibleSize={31} glow={0.2} />
        </Pop>

        {/* The pile: the same document as one more source, evaluated */}
        <Pop at={weigh + 6} frame={frame} x={0} y={40} w={540} h={330} out={pair * 0} distance={30}>
          {[2, 1, 0].map((k) => (
            <div key={k} style={{ position: 'absolute', left: k * 18, top: 40, width: 470, height: 150, transform: `translateY(${-k * 18 + 20}px)` }}>
              <Card tone={k === 0 ? 'sky' : 'muted'} pad={0} style={{ display: 'flex', alignItems: 'center', gap: 20, padding: '0 24px', opacity: k === 0 ? 1 : 0.9 }}>
                <Icon name="file" size={52} color={k === 0 ? C.sky : C.muted} strokeWidth={2} />
                <span style={{ fontSize: 36, fontWeight: 800, color: k === 0 ? C.textStrong : C.muted }}>{k === 0 ? 'documento del gobierno' : 'otra fuente'}</span>
              </Card>
            </div>
          ))}
          <div style={{ position: 'absolute', left: 0, top: 232, display: 'flex', alignItems: 'center', gap: 14, opacity: progress(frame, evalAt, 14), fontFamily: FONT.sans, fontSize: 34, fontWeight: 800, color: C.emerald }}>
            <Tick size={44} />
            una fuente más, evaluada
          </div>
        </Pop>
        <div style={{ position: 'absolute', left: COL_X, top: 40, width: COL_W, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 22, opacity: 1 - pair }}>
          {['peso único', 'base opaca', 'fines propios'].map((c, i) => {
            const e = progress(frame, chipAt[i], 12);
            return (
              <div key={c} style={{ opacity: e, transform: `translateX(${(1 - e) * -30}px)`, display: 'inline-flex', padding: '8px 34px', borderRadius: RADIUS.pill, border: `3px solid ${alpha(C.sky, 0.75)}`, background: alpha(C.sky, 0.12), fontFamily: FONT.sans, fontSize: 48, fontWeight: 850, color: C.textStrong }}>
                {c}
              </div>
            );
          })}
        </div>

        {/* Classes of source the public cannot review */}
        <Pop at={unseen - 8} frame={frame} x={COL_X} y={10} distance={16} out={w}>
          <div style={{ fontFamily: FONT.sans, fontSize: 38, fontWeight: 800, color: C.textStrong }}>
            puede apoyarse en fuentes <span style={{ color: C.sky }}>como…</span>
          </div>
        </Pop>
        <Pop at={unseen} frame={frame} x={COL_X} y={74} w={COL_W} h={94} out={w} axis="x" distance={50}>
          <Card tone="sky" pad={0} style={{ display: 'flex', alignItems: 'center', gap: 22, padding: '0 26px' }}>
            <Disc icon="radar" size={70} tone="sky" />
            <span style={{ fontSize: 40, fontWeight: 850, color: C.textStrong }}>SIGINT <span style={{ color: C.muted, fontWeight: 650, fontSize: 34 }}>· comunicaciones interceptadas</span></span>
          </Card>
        </Pop>
        <Pop at={unseen + 16} frame={frame} x={COL_X} y={180} w={COL_W} h={94} out={w} axis="x" distance={50}>
          <Card tone="sky" pad={0} style={{ display: 'flex', alignItems: 'center', gap: 22, padding: '0 26px' }}>
            <Disc icon="search" size={70} tone="sky" />
            <span style={{ fontSize: 40, fontWeight: 850, color: C.textStrong }}>evidencia técnica parcial</span>
          </Card>
        </Pop>
        <Pop at={youAt} frame={frame} x={COL_X} y={292} w={COL_W} h={64} out={Math.max(w, progress(frame, choiceAt - 2, 10))} distance={16}>
          <Card tone="amber" pad={0} radius={RADIUS.pill} style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '0 28px' }}>
            <Icon name="eyeOff" size={40} color={C.amber} strokeWidth={2} />
            <span style={{ fontSize: 34, fontWeight: 800, color: '#fde68a' }}>tu red no tiene esta clase de fuente</span>
          </Card>
        </Pop>

        {/* The question: two boxes, unmarked until the answer */}
        <div style={{ position: 'absolute', left: COL_X, top: 366, width: COL_W, height: 96, opacity: (1 - pair) }}>
          {frame >= choiceAt ? <Choices frame={frame} at={choiceAt} markAt={weigh} options={['ignorar', 'pesar']} chosen={1} width={COL_W} height={96} /> : null}
        </div>

        {/* A private company and a government: complementary papers */}
        {pair > 0 ? (
          <div style={{ position: 'absolute', left: COL_X, top: 40, width: COL_W, height: 380, opacity: pair, transform: `translateY(${(1 - pair) * 20}px)` }}>
            <div style={{ position: 'absolute', left: 140, top: 40, width: 480, height: 270 }}>
              <Piece w={480} h={270} tone={C.cyan} tab="right" />
              <div style={{ position: 'absolute', left: 30, top: 0, width: 400, height: 270, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, fontFamily: FONT.sans }}>
                <Icon name="file" size={60} color={C.cyan} strokeWidth={2} />
                <span style={{ fontSize: 46, fontWeight: 900, color: C.textStrong }}>empresa privada</span>
                <span style={{ fontSize: 32, fontWeight: 700, color: C.cyanSoft }}>enseña sus pruebas</span>
              </div>
            </div>
            <div style={{ position: 'absolute', left: 536, top: 40, width: 480, height: 270 }}>
              <Piece w={480} h={270} tone={C.sky} tab="left" />
              <div style={{ position: 'absolute', left: 60, top: 0, width: 400, height: 270, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, fontFamily: FONT.sans }}>
                <Icon name="flag" size={60} color={C.sky} strokeWidth={2} />
                <span style={{ fontSize: 46, fontWeight: 900, color: C.textStrong }}>gobierno</span>
                <span style={{ fontSize: 32, fontWeight: 700, color: '#7dd3fc' }}>aporta lo que tú no ves</span>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </Stage>
  );
}

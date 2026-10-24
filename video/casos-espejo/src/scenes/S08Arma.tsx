import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../engine/src/theme/motion';
import { Icon, type IconName } from '../../../engine/src/ui';
import { Arrow, Card, Disc, Pop, Tick } from './parts/bits';
import { Paper } from './parts/Paper';
import { Stage, wordFrame } from './kit';

const S = 's08-arma';
const W = STAGE.width;

const CYCLE: readonly { icon: IconName; text: string; tone: string; word: string }[] = [
  { icon: 'file', text: 'informe de una empresa', tone: C.cyan, word: 'informe' },
  { icon: 'flag', text: 'atribución de un gobierno', tone: C.sky, word: 'atribución' },
  { icon: 'alert', text: 'acusación formal', tone: C.rose, word: 'acusación' },
];

/**
 * s08-arma «Lo robado, convertido en arma». It continues the victim's box (small, left): on `leak` documents
 * leave it for a publishing site («sitios de filtraciones»), passing through the card «identidades falsas»;
 * the label «hack-and-leak · operación de influencia» lands on the words and «los datos robados pueden ser
 * munición pública» under them. On `indict` a sealed formal indictment points at «oficiales del GRU» and an
 * arrow with a head runs to the grey strip «coincide en buena parte con el clustering técnico privado».
 * On `cycle` both zones leave and three pieces take the stage in a row — informe de una empresa, atribución
 * de un gobierno, acusación formal — closing on «sirve para contrastar el análisis privado». No year, no people.
 */
export function S08Arma(props: SceneProps) {
  const frame = useCurrentFrame();
  const leak = props.cue('leak');
  const indict = props.cue('indict');
  const cycle = props.cue('cycle');

  const labelAt = wordFrame(S, 's08-02', 'hack-and-leak') - 6;
  const ammoAt = wordFrame(S, 's08-02', 'munición') - 8;
  const gruAt = wordFrame(S, 's08-03', 'GRU') - 8;
  const matchAt = wordFrame(S, 's08-03', 'coincidía') - 8;
  const out = progress(frame, cycle - 10, 16, EASE.inOut);
  const dimLeak = progress(frame, indict - 4, 14);
  const pieceAt = CYCLE.map((c) => wordFrame(S, 's08-04', c.word) - 8);
  const checkAt = wordFrame(S, 's08-04', 'contrastar') - 8;

  return (
    <Stage>
      <div style={{ position: 'absolute', left: 0, top: 0, width: W, height: STAGE.height, opacity: 1 - out, display: out >= 1 ? 'none' : 'block' }}>
        {/* The victim's box and the documents that leave it */}
        <Pop at={leak - 20} frame={frame} x={0} y={14} w={420} h={286} dim={dimLeak} distance={20}>
          <div style={{ width: '100%', height: '100%', boxSizing: 'border-box', borderRadius: 24, border: `4px dashed ${alpha(C.cyan, 0.6)}`, background: alpha(C.cyan, 0.05), display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, fontFamily: FONT.sans }}>
            <Icon name="server" size={110} color={C.cyan} strokeWidth={1.8} />
            <span style={{ fontSize: 42, fontWeight: 850, color: C.textStrong }}>red de la víctima</span>
          </div>
        </Pop>
        <div style={{ position: 'absolute', left: 0, top: 0, opacity: 1 - 0.55 * dimLeak }}>
          <Arrow x1={436} y1={157} x2={940} y2={157} p={progress(frame, leak, 24, EASE.inOut)} color={C.muted} width={5} />
          {[0, 1, 2, 3].map((i) => {
            const p = progress(frame, leak + 10 + i * 12, 34, EASE.inOut);
            if (p <= 0 || p >= 1) return null;
            return (
              <div key={i} style={{ position: 'absolute', left: 440 + p * 480, top: 116 + (i % 2) * 24, width: 60, height: 76, borderRadius: 6, border: `2px solid ${alpha('#e2e8f0', 0.6)}`, background: alpha('#e2e8f0', 0.14), transform: `rotate(${(i - 1.5) * 8}deg)` }} />
            );
          })}
        </div>
        <Pop at={leak + 6} frame={frame} x={500} y={196} w={400} h={92} dim={dimLeak} distance={16}>
          <Card tone="amber" pad={0} radius={RADIUS.pill} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '0 24px' }}>
            <Icon name="user" size={40} color={C.amber} strokeWidth={2} />
            <span style={{ fontSize: 36, fontWeight: 800, color: C.textStrong }}>identidades falsas</span>
          </Card>
        </Pop>
        <Pop at={leak + 14} frame={frame} x={960} y={10} w={420} h={300} dim={dimLeak} distance={20}>
          <Card tone="amber" pad={0} style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ height: 64, display: 'flex', alignItems: 'center', gap: 14, padding: '0 20px', flexShrink: 0, borderBottom: `2px solid ${C.ink700}`, background: alpha(C.ink800, 0.9) }}>
              <Icon name="globe" size={32} color={C.amber} strokeWidth={2} />
              <span style={{ fontSize: 28, fontWeight: 800, color: C.text, whiteSpace: 'nowrap' }}>sitios de filtraciones</span>
            </div>
            <div style={{ padding: 22, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              {[0, 1, 2, 3].map((i) => (
                <div key={i} style={{ height: 80, borderRadius: 8, border: `2px solid ${alpha('#e2e8f0', 0.35)}`, background: alpha('#e2e8f0', 0.08), opacity: progress(frame, leak + 40 + i * 8, 10) }} />
              ))}
            </div>
          </Card>
        </Pop>
        <Pop at={labelAt} frame={frame} x={1420} y={30} w={W - 1420} dim={dimLeak} distance={22}>
          <div style={{ fontFamily: FONT.sans }}>
            <div style={{ fontFamily: FONT.mono, fontSize: 36, fontWeight: 800, color: C.amber, lineHeight: 1.05, whiteSpace: 'nowrap' }}>hack-and-leak</div>
            <div style={{ marginTop: 14, fontSize: 36, fontWeight: 800, lineHeight: 1.1, color: C.textStrong }}>operación de influencia</div>
          </div>
        </Pop>
        <Pop at={ammoAt} frame={frame} x={0} y={338} w={W} dim={dimLeak} distance={16}>
          <div style={{ fontFamily: FONT.sans, fontSize: 50, fontWeight: 850, color: C.textStrong, whiteSpace: 'nowrap' }}>
            los datos robados pueden ser <span style={{ color: C.amber }}>munición pública</span>
          </div>
        </Pop>

        {/* The formal indictment */}
        <Pop at={indict} frame={frame} x={0} y={424} w={340} h={226} distance={24}>
          <Paper w={340} h={226} tone="rose" kicker="documento sellado" title="Acusación formal" titleSize={36} lines={3}
            seal={<Disc icon="shield" size={64} tone="rose" glow={0.5} />} />
        </Pop>
        <Pop at={gruAt} frame={frame} x={420} y={448} distance={16}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 16, padding: '10px 28px', borderRadius: RADIUS.pill, border: `3px solid ${alpha(C.rose, 0.8)}`, background: alpha(C.roseDeep, 0.7), fontFamily: FONT.sans, fontSize: 40, fontWeight: 850, color: '#fecdd3', whiteSpace: 'nowrap' }}>
            <Icon name="target" size={42} color={C.rose} strokeWidth={2} />
            oficiales del GRU
          </span>
        </Pop>
        <div style={{ position: 'absolute', left: 0, top: 0 }}>
          <Arrow x1={354} y1={580} x2={894} y2={580} p={progress(frame, matchAt - 6, 26, EASE.inOut)} color={C.sky} width={6} />
        </div>
        <Pop at={matchAt} frame={frame} x={910} y={510} w={W - 910} h={142} distance={20}>
          <Card tone="muted" pad={0} style={{ display: 'flex', alignItems: 'center', gap: 20, padding: '0 26px', background: alpha(C.muted, 0.14) }}>
            <Disc icon="layers" size={70} tone="sky" />
            <span style={{ fontSize: 34, fontWeight: 750, lineHeight: 1.2, color: C.textStrong }}>coincide en buena parte con el clustering técnico privado</span>
          </Card>
        </Pop>
      </div>

      {/* The cycle */}
      {CYCLE.map((c, i) => (
        <Pop key={c.text} at={pieceAt[i]} frame={frame} x={i * 592} y={150} w={544} h={190} distance={24}>
          <Card tone={c.tone} pad={0} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
            <Disc icon={c.icon} size={76} tone={c.tone} glow={0.4} />
            <span style={{ fontSize: 40, fontWeight: 850, color: C.textStrong, textAlign: 'center', lineHeight: 1.1 }}>{c.text}</span>
          </Card>
        </Pop>
      ))}
      {[0, 1].map((i) => (
        <div key={i} style={{ position: 'absolute', left: 0, top: 0 }}>
          <Arrow x1={i * 592 + 552} y1={245} x2={i * 592 + 584} y2={245} p={progress(frame, pieceAt[i + 1] - 4, 10)} color={C.muted} width={6} />
        </div>
      ))}
      <Pop at={checkAt} frame={frame} x={0} y={410} w={W} distance={18}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24, fontFamily: FONT.sans, fontSize: 54, fontWeight: 900, color: C.textStrong }}>
          <Tick size={64} />
          sirve para <span style={{ color: C.emerald }}>contrastar</span> el análisis privado
        </div>
      </Pop>
    </Stage>
  );
}

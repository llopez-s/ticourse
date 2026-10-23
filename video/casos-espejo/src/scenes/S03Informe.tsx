import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { Chip, Icon, type IconName } from '../../../engine/src/ui';
import { Card, Disc, Pop } from './parts/bits';
import { Paper } from './parts/Paper';
import { Stage, wordFrame } from './kit';

const S = 's03-informe';
const W = STAGE.width;
const COL_X = 860;
const COL_W = W - COL_X;

const EVIDENCE: readonly { icon: IconName; text: string }[] = [
  { icon: 'network', text: 'infraestructura' },
  { icon: 'users', text: 'personas' },
  { icon: 'clock', text: 'horarios' },
  { icon: 'target', text: 'victimología' },
];
const STANDARD: readonly { icon: IconName; text: string }[] = [
  { icon: 'bolt', text: 'TTPs' },
  { icon: 'network', text: 'infraestructura' },
  { icon: 'target', text: 'victimología' },
  { icon: 'file', text: 'apéndice de indicadores' },
];

/**
 * s03-informe «Un informe con las pruebas a la vista». On `a1-report` an open report: «APT1», a
 * private company's name stays off it («empresa privada»), «espionaje económico documentado durante años».
 * On `a1-evidence` the attribution tag lands («atribuido, según el informe, a una unidad militar
 * concreta (Unidad 61398 del PLA)») and four annex sheets come out of the document as the voice says
 * «evidencia»: infraestructura, personas, horarios, victimología. On `a1-first` the seal «según la lección:
 * primera gran atribución pública privada con evidencia publicada» with «naming and shaming» beside it.
 * On `a1-standard` that column leaves for «el estándar del informe de actor» (TTPs + infraestructura +
 * victimología + apéndice de indicadores) and, set apart, «después, acusación formal de EE. UU. a oficiales
 * del PLA». No logos, no photos, no year.
 */
export function S03Informe(props: SceneProps) {
  const frame = useCurrentFrame();
  const report = props.cue('a1-report');
  const evidence = props.cue('a1-evidence');
  const first = props.cue('a1-first');
  const standard = props.cue('a1-standard');

  const tagAt = evidence + 2;
  const sheetAt = Math.max(evidence + 10, wordFrame(S, 's03-02', 'evidencia') - 8);
  const nameAt = wordFrame(S, 's03-03', 'naming') - 6;
  const colOut = progress(frame, standard - 8, 14, EASE.inOut);
  const afterAt = Math.max(standard + 60, wordFrame(S, 's03-04', 'después') - 8);
  const docGlow = progress(frame, evidence, 14) * (1 - progress(frame, first + 30, 20));

  return (
    <Stage>
      {/* The report, open */}
      <Pop at={report} frame={frame} x={20} y={30} w={780} h={600} distance={28}>
        <div style={{ transform: 'rotate(-1.2deg)', transformOrigin: '50% 50%' }}>
          <Paper w={780} h={600} tone="sky" kicker="informe publicado" title="APT1" titleSize={120} lines={4} glow={docGlow}
            legible={<>espionaje económico documentado durante años</>} legibleSize={36}>
            <div style={{ marginTop: 22 }}>
              <Chip accent="cyan" icon="file" size={32}>
                empresa privada
              </Chip>
            </div>
          </Paper>
        </div>
      </Pop>

      {/* The attribution tag and the four annexes */}
      <Pop at={tagAt} frame={frame} x={COL_X} y={30} w={COL_W} h={150} axis="x" distance={60} out={colOut}>
        <Card tone="rose" pad={0} style={{ display: 'flex', alignItems: 'center', gap: 24, padding: '0 28px' }}>
          <Disc icon="flag" size={78} tone="rose" />
          <span style={{ fontSize: 36, fontWeight: 750, lineHeight: 1.2, color: C.textStrong }}>
            atribuido, según el informe, a una unidad militar concreta <span style={{ color: C.roseSoft }}>(Unidad 61398 del PLA)</span>
          </span>
        </Card>
      </Pop>
      {EVIDENCE.map((e, i) => (
        <Pop key={e.text} at={sheetAt + i * 9} frame={frame} x={COL_X + (i % 2) * (COL_W / 2 + 6)} y={200 + Math.floor(i / 2) * 142} w={COL_W / 2 - 6} h={128} axis="x" distance={-70} out={colOut}>
          <Card tone="cyan" pad={0} style={{ display: 'flex', alignItems: 'center', gap: 20, padding: '0 24px' }}>
            <Disc icon={e.icon} size={66} />
            <span style={{ fontSize: 38, fontWeight: 800, color: C.textStrong }}>{e.text}</span>
          </Card>
        </Pop>
      ))}

      {/* The seal */}
      <Pop at={first} frame={frame} x={COL_X} y={494} w={COL_W} h={150} distance={26} out={colOut}>
        <div style={{ transform: 'rotate(-1.5deg)', height: '100%' }}>
          <Card tone="emerald" glow={progress(frame, first, 14) * (1 - progress(frame, first + 90, 30))} pad={0} style={{ display: 'flex', alignItems: 'center', gap: 22, padding: '0 28px', border: `4px solid ${C.emerald}` }}>
            <Disc icon="check" size={70} tone="emerald" />
            <span style={{ fontSize: 34, fontWeight: 800, lineHeight: 1.2, color: C.textStrong }}>según la lección: primera gran atribución pública privada con evidencia publicada</span>
          </Card>
        </div>
      </Pop>
      <Pop at={nameAt} frame={frame} x={COL_X + COL_W - 470} y={452} out={colOut} distance={14}>
        <Chip accent="amber" icon="alert" size={34} solid>
          naming and shaming
        </Chip>
      </Pop>

      {/* The standard, and the indictment apart */}
      <Pop at={standard} frame={frame} x={COL_X} y={30} w={COL_W} distance={24}>
        <div style={{ fontFamily: FONT.sans, fontSize: 46, fontWeight: 850, color: C.textStrong, lineHeight: 1.1 }}>
          el estándar del <span style={{ color: C.cyan }}>informe de actor</span>
        </div>
      </Pop>
      {STANDARD.map((s, i) => (
        <Pop key={s.text} at={standard + 16 + i * 14} frame={frame} x={COL_X} y={112 + i * 98} w={COL_W} h={84} axis="x" distance={50}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, height: '100%', fontFamily: FONT.sans }}>
            <span style={{ width: 44, textAlign: 'center', fontSize: 48, fontWeight: 900, color: i === 0 ? 'transparent' : C.muted }}>+</span>
            <Card tone="cyan" pad={0} radius={RADIUS.pill} style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '0 28px', width: 'auto', height: 84 }}>
              <Icon name={s.icon} size={42} color={C.cyan} strokeWidth={2} />
              <span style={{ fontSize: 40, fontWeight: 800, color: C.textStrong, whiteSpace: 'nowrap' }}>{s.text}</span>
            </Card>
          </div>
        </Pop>
      ))}
      <Pop at={afterAt - 10} frame={frame} x={COL_X} y={516} w={COL_W} h={4} duration={20}>
        <div style={{ height: 4, borderRadius: 2, background: `repeating-linear-gradient(90deg, ${alpha(C.muted, 0.7)} 0 18px, transparent 18px 32px)` }} />
      </Pop>
      <Pop at={afterAt} frame={frame} x={COL_X} y={536} w={COL_W} h={112} distance={22}>
        <Card tone="rose" pad={0} style={{ display: 'flex', alignItems: 'center', gap: 22, padding: '0 26px' }}>
          <span style={{ fontSize: 26, fontWeight: 800, letterSpacing: 3, color: C.muted, textTransform: 'uppercase', writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>después</span>
          <Disc icon="file" size={64} tone="rose" />
          <span style={{ fontSize: 34, fontWeight: 750, lineHeight: 1.2, color: C.textStrong }}>acusación formal de EE. UU. a oficiales del PLA</span>
        </Card>
      </Pop>
    </Stage>
  );
}

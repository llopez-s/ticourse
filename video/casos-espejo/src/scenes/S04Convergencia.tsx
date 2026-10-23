import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../engine/src/theme/motion';
import { Icon, type IconName } from '../../../engine/src/ui';
import { Arrow, Card, Disc, Pop } from './parts/bits';
import { Diamond4 } from './parts/Diamond4';
import { Dossier } from './parts/Dossier';
import { Paper } from './parts/Paper';
import { Stage, wordFrame } from './kit';

const S = 's04-convergencia';
const W = STAGE.width;

// Full diamond (left) and its compact version (after the dossier takes the stage).
const BIG = { cx: 560, cy: 256, hw: 380, hh: 180 } as const;
const MINI = { cx: 300, cy: 190, hw: 190, hh: 105 } as const;
const ITEMS = {
  adv: 'Unidad 61398 del PLA',
  cap: 'familias de malware propias y TTPs',
  infra: 'bloques de red en Shanghai · dominios y C2 reutilizados',
  vic: '~141 organizaciones',
} as const;
const META: readonly { icon: IconName; text: string; word: string }[] = [
  { icon: 'clock', text: 'horarios coherentes con Shanghai', word: 'Horarios' },
  { icon: 'desktop', text: 'configuración de teclado e idioma', word: 'idioma' },
  { icon: 'target', text: 'victimología leída desde el eje socio-político: ¿a quién beneficia?', word: 'víctimas' },
];
const SHEETS = ['horarios', 'idioma', 'victimología'] as const;

/**
 * s04-convergencia «Cuatro esquinas, años de datos». Under VELVET CICADA's message (`a1-reply`, the top 176 px
 * stay clear) the APT1 report sits low and dim. On `a1-diamond` it slides away and the diamond draws with the
 * lesson's table filed under each vertex as the voice names them (Adversary «Unidad 61398 del PLA», Capability,
 * Infrastructure «bloques de red en Shanghai…», Victim «~141 organizaciones»); on «año» a band «años» crosses
 * them, and the card «el informe señala al sponsor · casi nadie llega» sits on the right. On `a1-meta` the three
 * meta-features come as what the report said. On `a1-weight` the diamond shrinks to its four names, the loose
 * sheets («horarios», «idioma», «victimología», each «pesa muy poco» alone) lie on the right and then go into
 * the evidence file, which thickens. On `converge` every line points at the same place, the file «pesa»
 * (emerald) and the rule «no hay pistola humeante · hay peso de evidencia» lands. On `a1-mirror` «tu diamante,
 * cuatro esquinas» and the small note about sources. No scale, no year.
 */
export function S04Convergencia(props: SceneProps) {
  const frame = useCurrentFrame();
  const reply = props.cue('a1-reply');
  const diamond = props.cue('a1-diamond');
  const meta = props.cue('a1-meta');
  const weight = props.cue('a1-weight');
  const converge = props.cue('converge');
  const mirror = props.cue('a1-mirror');

  const docOut = progress(frame, diamond - 6, 16, EASE.inOut);
  const yearsAt = wordFrame(S, 's04-03', 'año') - 6;
  const signAt = wordFrame(S, 's04-02', 'sponsor') - 8;
  const itemAt = [wordFrame(S, 's04-03', 'cuatro') - 4, wordFrame(S, 's04-03', 'vértices') - 2, wordFrame(S, 's04-03', 'diamante') - 2, wordFrame(S, 's04-03', 'víctimas') - 8];
  const itemP = itemAt.map((a) => progress(frame, a, 14));
  const metaAt = META.map((m) => Math.max(meta - 2, wordFrame(S, 's04-04', m.word) - 8));
  const metaOut = progress(frame, weight - 6, 12, EASE.inOut);
  const big = 1 - progress(frame, weight - 8, 14, EASE.inOut);
  const mini = progress(frame, weight - 4, 16);

  const littleAt = wordFrame(S, 's04-05', 'poco') - 8;
  const joinAt = wordFrame(S, 's04-05', 'contaron') - 4;
  const restAt = wordFrame(S, 's04-05', 'demás') - 10;
  const join = progress(frame, joinAt, 20, EASE.inOut);
  const sheetCount = 2 + 3 * join + 4 * progress(frame, restAt, 40) + 3 * progress(frame, converge, 40);
  const heavy = progress(frame, converge, 20);
  const lines = progress(frame, converge - 6, 24, EASE.inOut);
  const ruleIn = progress(frame, converge + 8, 18);
  const dossierX = 800;

  return (
    <Stage>
      {/* The APT1 report, dim and low under the message */}
      <Pop at={-10} frame={frame} x={500} y={210} out={docOut} dim={0.5 * progress(frame, reply, 12)}>
        <Paper w={700} h={420} tone="sky" kicker="informe publicado" title="APT1" titleSize={92} lines={4} legible={<>espionaje económico documentado durante años</>} legibleSize={34} />
      </Pop>

      {/* The diamond with the lesson's table */}
      <div style={{ position: 'absolute', left: 0, top: 0, opacity: big }}>
        {/* the band «años» crossing the four vertices (behind the cards) */}
        {frame >= yearsAt - 4 ? (
          <div style={{ position: 'absolute', left: 6, top: BIG.cy - 22, width: 1100 * progress(frame, yearsAt, 36, EASE.inOut), height: 44, borderRadius: RADIUS.pill, background: `linear-gradient(90deg, ${alpha(C.amber, 0.05)} 0%, ${alpha(C.amber, 0.5)} 100%)` }} />
        ) : null}
        <Diamond4
          {...BIG}
          cardW={360}
          items={ITEMS}
          show={[progress(frame, diamond, 14), progress(frame, diamond + 5, 14), progress(frame, diamond + 10, 14), progress(frame, diamond + 15, 14)]}
          itemShow={itemP}
          edges={progress(frame, diamond, 40, EASE.inOut)}
        />
        <Pop at={yearsAt + 18} frame={frame} x={BIG.cx - 90} y={BIG.cy - 30} distance={10}>
          <div style={{ fontFamily: FONT.sans, fontSize: 44, fontWeight: 900, letterSpacing: 4, color: '#fde68a', background: alpha(C.ink900, 0.9), padding: '2px 22px', borderRadius: RADIUS.pill, border: `2px solid ${alpha(C.amber, 0.7)}` }}>años</div>
        </Pop>
      </div>
      <Pop at={signAt} frame={frame} x={1170} y={110} w={558} h={230} out={1 - big}>
        <Card tone="emerald" pad={0} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 12, padding: '0 28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Disc icon="flag" size={64} tone="emerald" />
            <span style={{ fontSize: 30, fontWeight: 800, letterSpacing: 3, color: C.muted, textTransform: 'uppercase' }}>según la lección</span>
          </div>
          <span style={{ fontSize: 36, fontWeight: 800, lineHeight: 1.18, color: C.textStrong }}>
            el informe señala al <span style={{ color: C.emerald }}>sponsor</span> · casi nadie llega
          </span>
        </Card>
      </Pop>

      {/* The three meta-features, as the report said them */}
      <Pop at={meta - 4} frame={frame} x={0} y={500} out={metaOut} distance={12}>
        <div style={{ fontFamily: FONT.sans, fontSize: 28, fontWeight: 700, letterSpacing: 2, color: C.muted, textTransform: 'uppercase' }}>según el informe, además</div>
      </Pop>
      {META.map((m, i) => (
        <Pop key={m.text} at={metaAt[i]} frame={frame} x={[0, 546, 1122][i]} y={534} w={[530, 560, 606][i]} h={118} out={metaOut} distance={20}>
          <Card tone="cyan" pad={0} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '0 20px' }}>
            <Disc icon={m.icon} size={60} />
            <span style={{ fontSize: 30, fontWeight: 750, lineHeight: 1.16, color: C.textStrong }}>{m.text}</span>
          </Card>
        </Pop>
      ))}

      {/* After a1-weight: the compact diamond, the loose sheets, the evidence file */}
      <div style={{ position: 'absolute', left: 0, top: 0, opacity: mini }}>
        <Diamond4 {...MINI} cardW={250} compact edges={1} glow={0.5 * lines} />
      </div>
      <Pop at={weight + 4} frame={frame} x={dossierX} y={90} distance={26}>
        <Dossier w={470} h={330} sheets={sheetCount} heavy={heavy} label="expediente" labelSize={40} />
      </Pop>
      {SHEETS.map((s, i) => {
        const at = littleAt + i * 8;
        const go = join;
        return (
          <Pop key={s} at={at} frame={frame} x={1330 - go * 380} y={86 + i * 112 + go * (110 - i * 60)} w={398} h={100} out={join > 0.98 ? 1 : 0} style={{ opacity: Math.min(progress(frame, at, 16), 1 - 0.8 * go) }} distance={30} axis="x">
            <Card tone="cyan" pad={0} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 2, padding: '0 24px' }}>
              <span style={{ fontSize: 38, fontWeight: 800, color: C.textStrong, lineHeight: 1.1 }}>{s}</span>
              <span style={{ fontSize: 28, fontWeight: 700, color: C.muted }}>pesa muy poco</span>
            </Card>
          </Pop>
        );
      })}

      {/* Convergence: every line to the same place */}
      <div style={{ position: 'absolute', left: 0, top: 0 }}>
        {[0, 1, 2].map((i) => (
          <Arrow key={`l${i}`} x1={650} y1={90 + i * 90} x2={dossierX - 6} y2={170 + i * 70} p={lines} color={C.emerald} width={5} />
        ))}
        {[0, 1, 2].map((i) => (
          <Arrow key={`r${i}`} x1={1700} y1={90 + i * 100} x2={dossierX + 470 + 6} y2={170 + i * 70} p={lines} color={C.emerald} width={5} />
        ))}
      </div>

      {/* The rule */}
      {ruleIn > 0 ? (
        <div style={{ position: 'absolute', left: 640, top: 478, width: W - 640, height: 150, opacity: ruleIn, transform: `translateY(${(1 - ruleIn) * 18}px)` }}>
          <Card tone="emerald" glow={heavy * 0.6} pad={0} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 6, padding: '0 34px' }}>
            <div style={{ fontSize: 40, fontWeight: 800, color: C.muted, textDecoration: 'line-through', textDecorationColor: C.rose, textDecorationThickness: 4 }}>no hay pistola humeante</div>
            <div style={{ fontSize: 56, fontWeight: 900, letterSpacing: -1, color: C.textStrong }}>
              hay <span style={{ color: C.emerald }}>peso de evidencia</span>
            </div>
          </Card>
        </div>
      ) : null}

      {/* The mirror */}
      <Pop at={mirror} frame={frame} x={0} y={396} w={620} distance={18}>
        <div style={{ fontFamily: FONT.sans }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 36, fontWeight: 850, color: C.textStrong, whiteSpace: 'nowrap' }}>
            <Icon name="target" size={40} color={C.cyan} strokeWidth={2} />
            tu diamante, cuatro esquinas
          </div>
          <div style={{ marginTop: 12, fontSize: 30, fontWeight: 650, color: C.muted, lineHeight: 1.2 }}>hasta dónde llegas depende de tus fuentes</div>
        </div>
      </Pop>
    </Stage>
  );
}

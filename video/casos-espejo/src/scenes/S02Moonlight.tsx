import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { Icon } from '../../../engine/src/ui';
import { Arrow, Card, Disc, Pop, VcStamp } from './parts/bits';
import { Folder } from './parts/Folder';
import { Notebook } from './parts/Notebook';
import { Stage, interceptWindow, wordFrame } from './kit';

const S = 's02-moonlight';
const W = STAGE.width;

const CASE_LINES = [
  { icon: 'eye', text: 'espionaje prolongado', seg: 's02-01', word: 'espionaje' },
  { icon: 'network', text: 'redes de gobierno e investigación de EE. UU.', seg: 's02-01', word: 'redes' },
  { icon: 'archive', text: 'documentación en grandes volúmenes', seg: 's02-02', word: 'documentación' },
] as const;

/**
 * s02-moonlight «Un actor que no se va». On `mm-case` the MOONLIGHT MAZE folder (no year) and, as the voice
 * says each phrase, its three lines (prolonged espionage · US government and research networks · documentation
 * in large volumes); two cards follow («una de las primeras intrusiones estatales investigadas a gran escala»,
 * «años de investigación · cooperación multiagencia»). On `mm-tool` a dateless timeline draws along the bottom:
 * a tool from that folder, and the SAME tool far to the right with the lesson's note (later analyses tied its
 * tooling to much later activity, Turla). On `mm-persist` the folder and cards go and the rule takes the
 * middle (always below the top 176 px, where VELVET CICADA's message lands). On `mm-reply` the note and the
 * tool light again; on `mm-notebook` the folder sits on the left and the group's notebook on the right with
 * VELVET CICADA's stamp, three campaign tabs and «un intrusion set atraviesa varias campañas».
 */
export function S02Moonlight(props: SceneProps) {
  const frame = useCurrentFrame();
  const mmCase = props.cue('mm-case');
  const mmTool = props.cue('mm-tool');
  const persist = props.cue('mm-persist');
  const reply = props.cue('mm-reply');
  const notebook = props.cue('mm-notebook');
  const icp = interceptWindow(S, 's02-05');

  const lineAt = CASE_LINES.map((l) => Math.max(mmCase + 4, wordFrame(S, l.seg, l.word) - 6));
  const firstAt = wordFrame(S, 's02-02', 'Suele') - 6;
  const yearsAt = wordFrame(S, 's02-03', 'llevan') - 8;
  const tlDraw = progress(frame, mmTool - 10, 50, EASE.inOut);
  const rightNode = progress(frame, mmTool + 36, 16);
  const noteAt = mmTool + 30;

  // Phase A (folder + cards + note) leaves as the rule lands; the notebook phase replaces everything.
  const aOut = progress(frame, persist - 6, 14, EASE.inOut);
  const ruleIn = progress(frame, persist - 2, 18);
  const ruleDim = progress(frame, reply - 2, 14, EASE.inOut);
  const phaseB = progress(frame, notebook - 12, 16, EASE.inOut);
  const noteBack = progress(frame, reply, 14) * (1 - phaseB);
  const toolGlow = Math.max(progress(frame, mmTool + 36, 16) * (1 - progress(frame, persist - 6, 10)), noteBack);

  const tabs = progress(frame, notebook + 20, 90, EASE.out) * 3;
  const noteBook = enter(frame, wordFrame(S, 's02-07', 'apuntes') - 8, { distance: 14 });

  return (
    <Stage>
      {/* A: the folder, its lines and two cards */}
      <Pop at={mmCase} frame={frame} x={0} y={20} out={Math.max(aOut, phaseB)} distance={26}>
        <Folder w={820} h={332} title="MOONLIGHT MAZE" titleSize={62} tone="sky">
          <div style={{ marginTop: 22, display: 'flex', flexDirection: 'column', gap: 14 }}>
            {CASE_LINES.map((l, i) => {
              const e = enter(frame, lineAt[i], { distance: 16, axis: 'x' });
              return (
                <div key={l.text} style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 32, fontWeight: 700, color: C.text, whiteSpace: 'nowrap', ...e }}>
                  <Icon name={l.icon} size={34} color={C.sky} strokeWidth={2} />
                  {l.text}
                </div>
              );
            })}
          </div>
        </Folder>
      </Pop>
      <Pop at={firstAt} frame={frame} x={880} y={20} w={848} h={170} out={Math.max(aOut, phaseB)}>
        <Card tone="cyan" pad={0} style={{ display: 'flex', alignItems: 'center', gap: 22, padding: '0 28px' }}>
          <Disc icon="flag" size={72} />
          <span style={{ fontSize: 34, fontWeight: 750, lineHeight: 1.2, color: C.textStrong }}>suele considerarse una de las primeras intrusiones estatales investigadas a gran escala</span>
        </Card>
      </Pop>
      <Pop at={yearsAt} frame={frame} x={880} y={212} w={848} h={140} out={Math.max(aOut, phaseB)}>
        <Card tone="cyan" pad={0} style={{ display: 'flex', alignItems: 'center', gap: 22, padding: '0 28px' }}>
          <Disc icon="users" size={72} />
          <span style={{ fontSize: 36, fontWeight: 750, lineHeight: 1.2, color: C.textStrong }}>años de investigación · cooperación multiagencia</span>
        </Card>
      </Pop>

      {/* The tool's timeline: dateless, along the bottom */}
      <div style={{ position: 'absolute', left: 0, top: 0, width: W, height: STAGE.height, opacity: Math.max(0, 1 - phaseB) * (frame >= mmTool - 12 ? 1 : 0) }}>
        <div style={{ position: 'absolute', left: 150, top: 584, width: (1560 - 150) * tlDraw, height: 6, borderRadius: 3, background: `linear-gradient(90deg, ${C.sky}, ${alpha(C.sky, 0.4)})` }} />
        <div style={{ position: 'absolute', left: 150, top: 538, width: 1410, textAlign: 'center', fontFamily: FONT.sans, fontSize: 30, fontWeight: 650, color: C.muted, opacity: progress(frame, mmTool + 20, 14) }}>mucho tiempo después</div>
        <div style={{ position: 'absolute', left: 30, top: 540, opacity: progress(frame, mmTool - 6, 14), fontFamily: FONT.sans, textAlign: 'center' }}>
          <Disc icon="gear" size={92} tone="sky" glow={toolGlow * 0.6} />
        </div>
        <div style={{ position: 'absolute', left: 130, top: 612, fontFamily: FONT.sans, fontSize: 28, fontWeight: 700, color: C.sky, opacity: progress(frame, mmTool - 6, 14), whiteSpace: 'nowrap' }}>la herramienta de la carpeta</div>
        <div style={{ position: 'absolute', left: 1584, top: 540, opacity: rightNode, transform: `scale(${0.8 + 0.2 * rightNode})` }}>
          <Disc icon="gear" size={92} tone="sky" glow={0.3 + 0.6 * toolGlow} />
        </div>
      </div>
      <Pop at={noteAt} frame={frame} x={980} y={398} w={748} h={128} out={Math.max(aOut, phaseB) * (1 - noteBack)} dim={0}>
        <Card tone="sky" glow={toolGlow} pad={0} style={{ display: 'flex', alignItems: 'center', padding: '0 26px' }}>
          <span style={{ fontSize: 33, fontWeight: 700, lineHeight: 1.2, color: C.textStrong }}>
            análisis posteriores vincularon su tooling con actividad muy posterior <span style={{ color: C.roseSoft }}>(Turla)</span>
          </span>
        </Card>
      </Pop>

      {/* The rule */}
      {ruleIn > 0 && phaseB < 1 ? (
        <div style={{ position: 'absolute', left: 60, top: 194, width: W - 120, height: 190, opacity: ruleIn * (1 - phaseB) * (1 - 0.55 * ruleDim), transform: `translateY(${(1 - ruleIn) * 22}px)` }}>
          <Card tone="amber" pad={0} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 36, padding: '0 40px' }}>
            <Disc icon="clock" size={108} tone="amber" glow={0.5} />
            <div style={{ fontSize: 66, fontWeight: 900, letterSpacing: -1.5, lineHeight: 1.06, color: C.textStrong }}>
              <span style={{ color: C.roseSoft }}>el actor persiste</span> más que
              <br />
              la memoria del defensor
            </div>
          </Card>
        </div>
      ) : null}

      {/* B: the folder (left) and the group's notebook (right) */}
      <Pop at={notebook - 6} frame={frame} x={0} y={170} distance={22}>
        <div style={{ opacity: phaseB }}>
          <Folder w={600} h={300} title="MOONLIGHT MAZE" titleSize={44} tone="sky">
            <div style={{ marginTop: 16, fontSize: 30, fontWeight: 650, color: C.muted, fontFamily: FONT.sans }}>caso cerrado, cuaderno abierto</div>
          </Folder>
        </div>
      </Pop>
      <Pop at={notebook} frame={frame} x={900} y={100} w={640} h={360} distance={22}>
        <Notebook w={640} h={360} tabs={tabs} label="cuaderno del grupo" glow={0.4}>
          <div style={{ marginTop: 18 }}>
            <VcStamp size={30} />
          </div>
          <div style={{ marginTop: 22, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[0.9, 0.7, 0.8].map((k, i) => (
              <div key={i} style={{ height: 10, width: `${k * 100}%`, borderRadius: 5, background: alpha(C.cyan, 0.3) }} />
            ))}
          </div>
        </Notebook>
      </Pop>
      <Pop at={notebook + 14} frame={frame} x={900} y={64} out={0}>
        <div style={{ fontFamily: FONT.sans, fontSize: 30, fontWeight: 700, color: C.cyanSoft }}>el grupo que ataca a Meridian</div>
      </Pop>
      {phaseB > 0.5 ? <Arrow x1={620} y1={300} x2={880} y2={300} p={progress(frame, notebook + 8, 20)} color={C.cyan} dashed width={6} /> : null}
      <Pop at={notebook + 24} frame={frame} x={0} y={512} w={W} distance={18}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, fontFamily: FONT.sans }}>
          <div style={{ fontSize: 42, fontWeight: 850, color: C.textStrong, whiteSpace: 'nowrap' }}>
            un <span style={{ color: C.cyan }}>intrusion set</span> <span style={{ color: C.muted, fontWeight: 650 }}>(lo que hace un mismo grupo)</span> atraviesa varias campañas
          </div>
          <div style={{ fontSize: 36, fontWeight: 750, color: C.cyanSoft, ...noteBook, whiteSpace: 'nowrap' }}>lo que apuntas hoy te sirve mañana</div>
        </div>
      </Pop>
    </Stage>
  );
}

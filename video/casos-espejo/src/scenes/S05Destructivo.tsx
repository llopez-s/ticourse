import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../engine/src/theme/motion';
import { Chip, Icon } from '../../../engine/src/ui';
import { Card, Disc, Pop, Tick } from './parts/bits';
import { Folder } from './parts/Folder';
import { Stage, segment, wordFrame } from './kit';

const S = 's05-destructivo';
const W = STAGE.width;
const MACHINES = 6;

/**
 * s05-destructivo «Cuando el ataque destruye». On `sony-case` the folder «Sony Pictures» («en la lección,
 * junto al nombre Lazarus») and the quiet line «hasta aquí, espionaje callado». On `wiper` the chip «wiper»
 * lands over a row of generic machines (plain rectangles, no names) that go dark one by one, and as the
 * voice says «filtraron» documents spill on the right under «filtraciones masivas». On `sony-attr` the
 * attribution card («atribuido públicamente por el gobierno de EE. UU. a Corea del Norte»); on `sony-motive`
 * the two motive boxes appear unmarked and then «político» is ticked and «económico» struck. On the last
 * sentence the lesson: states do not only spy, they can also attack to destroy or pressure. Sony is the
 * victim; Lazarus is only the name the lesson gives. No real logos, no film stills, no people.
 */
export function S05Destructivo(props: SceneProps) {
  const frame = useCurrentFrame();
  const sonyCase = props.cue('sony-case');
  const wiper = props.cue('wiper');
  const attr = props.cue('sony-attr');
  const motive = props.cue('sony-motive');
  const lesson = segment(props, 's05-05').from;

  const quietAt = wordFrame(S, 's05-01', 'espionaje') - 10;
  const quietOut = progress(frame, wiper + 8, 16, EASE.inOut);
  const leakAt = wordFrame(S, 's05-02', 'filtraron') - 8;
  const massAt = wordFrame(S, 's05-02', 'masa') - 6;
  const polAt = wordFrame(S, 's05-04', 'político') - 4;
  const ecoAt = wordFrame(S, 's05-04', 'económico') - 4;
  const pol = progress(frame, polAt, 14, EASE.inOut);
  const eco = progress(frame, ecoAt, 14, EASE.inOut);

  return (
    <Stage>
      <Pop at={sonyCase} frame={frame} x={0} y={8} distance={26}>
        <Folder w={620} h={244} title="Sony Pictures" titleSize={58} tone="sky">
          <div style={{ marginTop: 14, fontSize: 31, fontWeight: 650, lineHeight: 1.2, color: C.muted }}>en la lección, junto al nombre <span style={{ color: C.roseSoft, fontWeight: 800 }}>Lazarus</span></div>
        </Folder>
      </Pop>
      <Pop at={quietAt} frame={frame} x={0} y={272} w={620} h={74} distance={14} dim={quietOut}>
        <Card tone="muted" pad={0} style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '0 22px' }}>
          <Icon name="eyeOff" size={42} color={C.muted} strokeWidth={2} />
          <span style={{ fontSize: 32, fontWeight: 700, color: C.muted, textDecoration: quietOut > 0.5 ? 'line-through' : 'none', textDecorationColor: C.rose, textDecorationThickness: 3 }}>hasta aquí, espionaje callado</span>
        </Card>
      </Pop>

      {/* The machines and the wiper */}
      <Pop at={wiper - 6} frame={frame} x={680} y={8} distance={14}>
        <Chip accent="rose" icon="bolt" solid size={36}>
          wiper
        </Chip>
      </Pop>
      <Pop at={wiper} frame={frame} x={680} y={80} w={680} h={130} distance={0}>
        <div style={{ display: 'flex', gap: 16, height: '100%' }}>
          {Array.from({ length: MACHINES }).map((_, i) => {
            const off = progress(frame, wiper + 12 + i * 11, 8);
            const e = progress(frame, wiper + i * 3, 12);
            const fg = off > 0.5 ? C.rose : C.cyan;
            return (
              <div key={i} style={{ flex: 1, opacity: e, display: 'grid', placeItems: 'center', borderRadius: 16, border: `3px solid ${alpha(fg, off > 0.5 ? 0.6 : 0.7)}`, background: off > 0.5 ? C.ink950 : alpha(C.cyan, 0.1), boxShadow: off > 0.5 ? `inset 0 0 30px ${alpha('#000000', 0.8)}` : undefined, position: 'relative' }}>
                <Icon name="desktop" size={64} color={off > 0.5 ? alpha(C.faint, 0.8) : C.cyan} strokeWidth={2} />
                {off > 0.5 ? <Icon name="x" size={44} color={C.rose} strokeWidth={3.4} style={{ position: 'absolute', bottom: 8, right: 8 }} /> : null}
              </div>
            );
          })}
        </div>
      </Pop>
      <Pop at={wiper + 10} frame={frame} x={680} y={228} distance={10}>
        <span style={{ fontFamily: FONT.sans, fontSize: 30, fontWeight: 650, color: C.muted }}>un programa pensado para borrar</span>
      </Pop>

      {/* Documents that spill */}
      {[0, 1, 2, 3, 4].map((i) => {
        const at = leakAt + i * 6;
        const p = progress(frame, at, 22, EASE.out);
        if (p <= 0) return null;
        const x = 1404 + (i % 3) * 92 + (i > 2 ? 44 : 0);
        const y = 10 + (i % 3) * 22 + (i > 2 ? 96 : 0) + p * (i > 2 ? 36 : 18);
        return (
          <div key={i} style={{ position: 'absolute', left: x, top: y, width: 96, height: 124, boxSizing: 'border-box', borderRadius: 8, border: `2px solid ${alpha('#e2e8f0', 0.5)}`, background: `linear-gradient(180deg, ${alpha('#e2e8f0', 0.14)} 0%, ${alpha('#e2e8f0', 0.06)} 100%), ${C.ink900}`, transform: `rotate(${(i - 2) * 9 * p}deg)`, opacity: p, padding: 14 }}>
            {[0.9, 0.7, 0.8, 0.6].map((k, j) => (
              <div key={j} style={{ height: 8, width: `${k * 100}%`, borderRadius: 4, background: alpha('#e2e8f0', 0.3), marginBottom: 10 }} />
            ))}
          </div>
        );
      })}
      <Pop at={massAt} frame={frame} x={1360} y={340} w={368} distance={10}>
        <div style={{ textAlign: 'center', fontFamily: FONT.sans, fontSize: 32, fontWeight: 850, color: C.amber, whiteSpace: 'nowrap' }}>filtraciones masivas</div>
      </Pop>

      {/* Who said it */}
      <Pop at={attr} frame={frame} x={0} y={402} w={860} h={130} distance={22}>
        <Card tone="sky" pad={0} style={{ display: 'flex', alignItems: 'center', gap: 22, padding: '0 26px' }}>
          <Disc icon="flag" size={76} tone="sky" />
          <span style={{ fontSize: 34, fontWeight: 750, lineHeight: 1.2, color: C.textStrong }}>
            atribuido públicamente por el gobierno de EE. UU. a <span style={{ color: C.roseSoft, fontWeight: 850 }}>Corea del Norte</span>
          </span>
        </Card>
      </Pop>

      {/* The motive: two boxes, one marked, one struck */}
      <Pop at={motive} frame={frame} x={900} y={402} w={568} h={130} distance={22}>
        <Card tone={pol > 0.4 ? 'emerald' : 'cyan'} glow={pol * 0.6} pad={0} style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '0 22px' }}>
          {pol > 0.2 ? <Tick size={52} p={pol} /> : <span style={{ width: 52, height: 52, borderRadius: 26, border: `3px solid ${alpha(C.muted, 0.7)}`, flexShrink: 0 }} />}
          <span style={{ fontSize: 31, fontWeight: 750, lineHeight: 1.18, color: C.textStrong }}>
            <b style={{ fontSize: 38 }}>político:</b> en el curso, represalia por una película
          </span>
        </Card>
      </Pop>
      <Pop at={motive + 6} frame={frame} x={1486} y={402} w={242} h={130} distance={22} style={{ opacity: Math.min(progress(frame, motive + 6, 16), 1 - 0.55 * eco) }}>
        <Card tone="muted" pad={0} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          <span style={{ fontSize: 40, fontWeight: 800, color: C.muted }}>económico</span>
          <div style={{ position: 'absolute', left: 22, top: '50%', width: `${eco * 198}px`, height: 5, marginTop: -2, borderRadius: 3, background: C.rose, boxShadow: `0 0 10px ${alpha(C.rose, 0.6)}` }} />
        </Card>
      </Pop>

      {/* The lesson */}
      <Pop at={lesson} frame={frame} x={0} y={556} w={W} h={100} distance={22}>
        <Card tone="amber" pad={0} radius={RADIUS.lg} style={{ display: 'flex', alignItems: 'center', gap: 22, padding: '0 30px' }}>
          <Disc icon="alert" size={64} tone="amber" glow={0.5} />
          <span style={{ fontSize: 37, fontWeight: 800, lineHeight: 1.18, color: C.textStrong }}>
            la lección: los estados no solo espían, también pueden <span style={{ color: C.amber }}>atacar para destruir o presionar</span>
          </span>
        </Card>
      </Pop>
    </Stage>
  );
}

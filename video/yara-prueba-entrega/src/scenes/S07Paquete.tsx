import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { progress } from '../../../engine/src/theme/motion';
import { windowWeight } from '../../../engine/src/ui/Focus';
import { Icon, type IconName } from '../../../engine/src/ui/Icon';
import { Pill, Reveal } from './parts/bits';
import { Stage, wordFrame } from './kit';

const S = 's07-caso';
const TOP = 190; // the engine's intercepted-message card owns the first 170 px of the stage
const ITEM_W = 552;
const ITEM_H = 100;
const GAP = 36;

function Item({ frame, at, icon, tone, title, lit }: { frame: number; at: number; icon: IconName; tone: string; title: string; lit: number }) {
  const p = progress(frame, at, 16);
  return (
    <div style={{ boxSizing: 'border-box', width: ITEM_W, height: ITEM_H, display: 'flex', alignItems: 'center', gap: 18, padding: '0 22px', borderRadius: RADIUS.md, background: lit > 0 ? alpha(tone, 0.1) : C.ink850, border: `2px solid ${alpha(tone, 0.35 + 0.5 * lit)}`, boxShadow: lit > 0 ? `0 0 ${16 + 22 * lit}px ${alpha(tone, 0.26 * lit)}` : 'none', opacity: p, transform: `translateY(${(1 - p) * 14}px)`, fontFamily: FONT.sans }}>
      <div style={{ width: 60, height: 60, borderRadius: 14, display: 'grid', placeItems: 'center', background: alpha(tone, 0.14), border: `2px solid ${alpha(tone, 0.4)}`, flexShrink: 0 }}>
        <Icon name={icon} size={36} color={tone} />
      </div>
      <span style={{ fontSize: 32, fontWeight: 800, color: C.textStrong, lineHeight: 1.12 }}>{title}</span>
    </div>
  );
}

/**
 * s07-caso «Mandar la regla no basta». The delivery package as nine items in a 3×3 grid, entering in the order
 * the voice says them (rule + version + hash, objective, engine, corpus + hash, results matrix, scope with known
 * FP / FN, action + human review, recipients and permitted use, rights). Each item glows while it is being said.
 * The YARA Forge capture is placed beside what it does not replace; «sin secretos» and the rights warning follow.
 * The grid starts below the intercepted-message card.
 */
export function S07Paquete(props: SceneProps) {
  const frame = useCurrentFrame();
  const w = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);

  const items: { icon: IconName; tone: string; title: string; at: number }[] = [
    { icon: 'file', tone: C.sky, title: 'Regla · versión · hash', at: w('s07-01', 'regla') - 6 },
    { icon: 'target', tone: C.sky, title: 'Objetivo y origen de patrones', at: w('s07-01', 'objetivo') - 6 },
    { icon: 'gear', tone: C.cyan, title: 'Motor y versión', at: w('s07-02', 'motor') - 6 },
    { icon: 'archive', tone: C.cyan, title: 'Corpus y hash', at: w('s07-02', 'corpus') - 6 },
    { icon: 'layers', tone: C.cyan, title: 'Matriz de resultados', at: w('s07-02', 'matriz') - 6 },
    { icon: 'alert', tone: C.amber, title: 'Alcance, FP y FN conocidos', at: w('s07-03', 'limitaciones') - 6 },
    { icon: 'eye', tone: C.amber, title: 'Acción y revisión humana', at: w('s07-03', 'revisión') - 6 },
    { icon: 'users', tone: C.sky, title: 'Destinatarios y uso permitido', at: w('s07-05', 'quién') - 6 },
    { icon: 'lock', tone: C.sky, title: 'Derechos y material de terceros', at: w('s07-06', 'derechos') - 6 },
  ];
  const forgeOut = props.cue('s07-c') - 6;
  const rowY = TOP + 3 * (ITEM_H + 18) + 6;

  return (
    <Stage>
      {items.map((it, i) => {
        const col = i % 3;
        const row = Math.floor(i / 3);
        const next = items[i + 1]?.at ?? it.at + 120;
        return (
          <div key={it.title} style={{ position: 'absolute', left: col * (ITEM_W + GAP), top: TOP + row * (ITEM_H + 18) }}>
            <Item frame={frame} at={it.at} icon={it.icon} tone={it.tone} title={it.title} lit={windowWeight(frame, it.at + 6, Math.min(next, it.at + 150))} />
          </div>
        );
      })}

      <Reveal frame={frame} at={w('s07-04', 'Forge') - 6} outAt={forgeOut} x={0} y={rowY}>
        <Pill icon="terminal" tone="amber" size={30}>captura de YARA Forge: simulación por etiquetas</Pill>
      </Reveal>
      <Reveal frame={frame} at={w('s07-04', 'sustituye') - 6} outAt={forgeOut} x={880} y={rowY}>
        <Pill icon="x" tone="rose" size={30}>no sustituye compilar y ejecutar</Pill>
      </Reveal>

      <Reveal frame={frame} at={w('s07-05', 'secretos') - 14} x={0} y={rowY}>
        <Pill icon="eyeOff" tone="emerald" size={30}>datos sintéticos: sin secretos</Pill>
      </Reveal>
      <Reveal frame={frame} at={w('s07-06', 'olvidar') - 8} x={620} y={rowY}>
        <Pill icon="alert" tone="amber" size={30}>siguen los derechos y la protección de evidencias</Pill>
      </Reveal>
    </Stage>
  );
}

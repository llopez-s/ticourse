import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../engine/src/theme/motion';
import { Icon, type IconName } from '../../../engine/src/ui';
import { Arrow, Card, Pop, VcStamp } from './parts/bits';
import { Stage, wordFrame } from './kit';

const S = 's10-mapa';
const W = STAGE.width;
const COLS = [
  { key: 'case', head: 'Caso', w: 250 },
  { key: 'attr', head: 'Atribución alcanzada', w: 340 },
  { key: 'evid', head: 'Evidencia clave', w: 580 },
  { key: 'lesson', head: 'Lección central', w: 558 },
] as const;
/** The lesson's table without its «Época» column and without years in the other cells. */
const ROWS = [
  ['MOONLIGHT MAZE', 'Estatal (años después)', 'Forense multiagencia; lineage de tooling relacionado mucho después', 'La persistencia del actor supera la memoria del defensor'],
  ['APT1', 'Sponsor-level pública (unidad militar)', 'Infraestructura + horarios + victimología + personas, todo publicado', 'Atribución privada creíble = evidencia publicable acumulada'],
  ['Sony / Lazarus', 'Sponsor por gobierno', 'SIGINT no publicada + evidencia técnica parcial', 'Atribución gubernamental: peso único, base opaca'],
  ['DNC / APT28+29', 'Operator a sponsor (acusación formal)', 'Dos clusters técnicos separados; luego acusación formal coincidente', 'Clusters separados aunque la víctima coincida; hack-and-leak'],
  ['APT10 / Cloud Hopper', 'Sponsor + acusación formal', 'Investigación conjunta público-privada', 'El acceso vía MSP escala el espionaje a toda su cartera'],
] as const;
const ROW_H = 78;
const HEAD_H = 44;

const EVOLUTION: readonly { icon: IconName; text: string; tone: string }[] = [
  { icon: 'file', text: 'informe privado (APT1)', tone: C.cyan },
  { icon: 'flag', text: 'declaración de un gobierno (Sony)', tone: C.sky },
  { icon: 'users', text: 'investigación conjunta y acusación formal (APT10)', tone: C.emerald },
];
const MARKS = ['espionaje persistente', 'evidencia técnica acumulada', 'ataca también a los proveedores de sus víctimas'] as const;

/**
 * s10-mapa «Los cinco, lado a lado». On `map` the lesson's table «Los cinco casos, lado a lado» fills the
 * top in one plane (caso · atribución alcanzada · evidencia clave · lección central), rows from MOONLIGHT MAZE
 * to APT10 / Cloud Hopper, WITHOUT the «Época» column and without years in any cell. On `evolution` the
 * three pieces of public attribution come one by one (informe privado · declaración de un gobierno ·
 * investigación conjunta y acusación formal) and on `joint` «se apoyan unas en otras» lights. On `vc-patterns`
 * the VELVET CICADA stamp and the three marks of the lesson's callout (espionaje persistente · evidencia
 * técnica acumulada · ataca también a los proveedores de sus víctimas) and a fourth grey slot,
 * «¿puente? aún sin respuesta»: a question, not a conclusion.
 */
export function S10Mapa(props: SceneProps) {
  const frame = useCurrentFrame();
  const map = props.cue('map');
  const evolution = props.cue('evolution');
  const joint = props.cue('joint');
  const vc = props.cue('vc-patterns');

  const lessonAt = wordFrame(S, 's10-01', 'lección') - 6;
  const lessonGlow = progress(frame, lessonAt, 14) * (1 - progress(frame, evolution - 6, 12));
  const evAt = [Math.max(evolution, wordFrame(S, 's10-02', 'Primero') - 8), wordFrame(S, 's10-02', 'Luego') - 8, wordFrame(S, 's10-03', 'APT10') - 8];
  const lean = progress(frame, joint, 16);
  const markAt = [vc, wordFrame(S, 's10-04', 'evidencia') - 8, wordFrame(S, 's10-04', 'proveedores') - 8];
  const bridgeAt = wordFrame(S, 's10-05', 'puente') - 8;
  const tableDim = progress(frame, vc - 6, 14, EASE.inOut) * 0.35;

  let x = 0;
  const colX = COLS.map((c) => {
    const v = x;
    x += c.w;
    return v;
  });

  return (
    <Stage>
      {/* The table */}
      <div style={{ position: 'absolute', left: 0, top: 0, width: W, opacity: 1 - tableDim }}>
        <Pop at={map - 6} frame={frame} x={0} y={0} w={W} h={HEAD_H} distance={10}>
          <div style={{ position: 'relative', height: HEAD_H, fontFamily: FONT.sans }}>
            {COLS.map((c, i) => (
              <div key={c.key} style={{ position: 'absolute', left: colX[i], width: c.w, top: 0, height: HEAD_H, boxSizing: 'border-box', padding: '0 14px', display: 'flex', alignItems: 'center', fontSize: 27, fontWeight: 850, letterSpacing: 0.5, color: c.key === 'lesson' && lessonGlow > 0.3 ? C.amber : C.muted, borderBottom: `3px solid ${alpha(c.key === 'lesson' ? C.amber : C.cyan, 0.5 + 0.4 * (c.key === 'lesson' ? lessonGlow : 0))}` }}>
                {c.head}
              </div>
            ))}
          </div>
        </Pop>
        {ROWS.map((r, ri) => (
          <Pop key={r[0]} at={map + 4 + ri * 7} frame={frame} x={0} y={HEAD_H + ri * ROW_H} w={W} h={ROW_H} distance={14}>
            <div style={{ position: 'relative', height: ROW_H, fontFamily: FONT.sans }}>
              {r.map((cell, ci) => (
                <div key={ci} style={{ position: 'absolute', left: colX[ci], width: COLS[ci].w, top: 0, height: ROW_H, boxSizing: 'border-box', padding: '0 14px', display: 'flex', alignItems: 'center', fontSize: ci === 0 ? 29 : 27, fontWeight: ci === 0 ? 900 : 600, lineHeight: 1.14, color: ci === 0 ? C.textStrong : ci === 3 ? (lessonGlow > 0.3 ? '#fde68a' : C.text) : C.text, borderBottom: `1px solid ${alpha(C.ink600, 0.8)}`, background: ci === 3 && lessonGlow > 0 ? alpha(C.amber, 0.08 * lessonGlow) : undefined }}>
                  {cell}
                </div>
              ))}
            </div>
          </Pop>
        ))}
      </div>

      {/* How public attribution evolved */}
      {EVOLUTION.map((e, i) => (
        <Pop key={e.text} at={evAt[i]} frame={frame} x={[0, 430, 930][i]} y={452} w={[400, 470, 520][i]} h={90} distance={20} dim={tableDim * 0.6}>
          <Card tone={e.tone} glow={i === 2 ? lean * 0.5 : 0} pad={0} radius={RADIUS.md} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '0 16px' }}>
            <Icon name={e.icon} size={40} color={e.tone} strokeWidth={2} />
            <span style={{ fontSize: 28, fontWeight: 800, lineHeight: 1.14, color: C.textStrong }}>{e.text}</span>
          </Card>
        </Pop>
      ))}
      {[0, 1].map((i) => (
        <div key={i} style={{ position: 'absolute', left: 0, top: 0 }}>
          <Arrow x1={[404, 904][i]} y1={497} x2={[426, 926][i]} y2={497} p={progress(frame, evAt[i + 1] - 2, 10)} color={C.muted} width={5} />
        </div>
      ))}
      <Pop at={joint} frame={frame} x={1470} y={452} w={W - 1470} h={90} distance={16} dim={tableDim * 0.6}>
        <div style={{ height: '100%', display: 'flex', alignItems: 'center', gap: 14, fontFamily: FONT.sans, fontSize: 32, fontWeight: 850, lineHeight: 1.14, color: C.emerald }}>
          <svg width={26} height={84} viewBox="0 0 26 92" fill="none" stroke={C.emerald} strokeWidth={5} strokeLinecap="round" style={{ flexShrink: 0 }}>
            <path d="M4 4 C20 4 20 12 20 26 V30 L24 46 L20 62 V66 C20 80 20 88 4 88" />
          </svg>
          se apoyan unas en otras
        </div>
      </Pop>

      {/* VELVET CICADA's marks */}
      <Pop at={vc - 4} frame={frame} x={0} y={560} w={240} h={92} distance={20}>
        <div style={{ height: '100%', display: 'flex', alignItems: 'center' }}>
          <VcStamp size={26} style={{ whiteSpace: 'normal', lineHeight: 1.15 }} />
        </div>
      </Pop>
      {MARKS.map((m, i) => (
        <Pop key={m} at={markAt[i]} frame={frame} x={[252, 504, 846][i]} y={560} w={[240, 330, 460][i]} h={92} distance={18}>
          <Card tone="rose" pad={0} radius={RADIUS.md} style={{ display: 'flex', alignItems: 'center', padding: '0 18px' }}>
            <span style={{ fontSize: 28, fontWeight: 800, lineHeight: 1.12, color: C.textStrong }}>{m}</span>
          </Card>
        </Pop>
      ))}
      <Pop at={bridgeAt} frame={frame} x={1318} y={560} w={410} h={92} distance={18}>
        <Card tone="muted" dashed pad={0} radius={RADIUS.md} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '0 18px' }}>
          <span style={{ fontSize: 50, fontWeight: 900, color: C.muted }}>?</span>
          <span style={{ fontSize: 28, fontWeight: 800, lineHeight: 1.14, color: C.muted }}>¿puente? aún sin respuesta</span>
        </Card>
      </Pop>
    </Stage>
  );
}

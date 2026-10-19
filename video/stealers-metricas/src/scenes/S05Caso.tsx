import type { ReactNode } from 'react';
import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { windowWeight } from '../../../engine/src/ui/Focus';
import { Icon, type IconName } from '../../../engine/src/ui/Icon';
import { InfoCard, Pill, Reveal } from './parts/bits';
import { Stage, segment, wordFrame } from './kit';

const S = 's05-caso';
const ROW_Y = 190;
const ROW_H = 70;
const ROW_GAP = 8;
const TABLE_W = 1180;

function Row({ frame, at, until, i, unit, by }: { frame: number; at: number; until: number; i: number; unit: string; by: string }) {
  const lit = windowWeight(frame, at, until, { ramp: 12, lead: 0 });
  return (
    <Reveal frame={frame} at={at} outAt={undefined} x={0} y={ROW_Y + i * (ROW_H + ROW_GAP)} w={TABLE_W}>
      <div style={{ boxSizing: 'border-box', width: TABLE_W, height: ROW_H, display: 'flex', alignItems: 'center', gap: 20, padding: '0 24px', borderRadius: RADIUS.md, background: lit > 0.01 ? alpha(C.cyan, 0.1) : C.ink850, border: `2px solid ${alpha(C.cyan, 0.3 + 0.55 * lit)}`, boxShadow: `0 0 ${10 + 24 * lit}px ${alpha(C.cyan, 0.28 * lit)}`, fontFamily: FONT.sans }}>
        <span style={{ width: 300, fontSize: 38, fontWeight: 800, color: C.textStrong }}>{unit}</span>
        <Icon name="arrowRight" size={34} color={C.muted} />
        <span style={{ fontSize: 33, fontWeight: 700, color: C.cyanSoft, whiteSpace: 'nowrap' }}>{by}</span>
      </div>
    </Reveal>
  );
}

function Moment({ frame, at, x, icon, title, sub, tone }: { frame: number; at: number; x: number; icon: IconName; title: string; sub: string; tone: string }) {
  return (
    <Reveal frame={frame} at={at} x={x - 190} y={70} w={380}>
      <div style={{ textAlign: 'center', fontFamily: FONT.sans }}>
        <div style={{ margin: '0 auto', width: 100, height: 100, borderRadius: 50, display: 'grid', placeItems: 'center', background: alpha(tone, 0.14), border: `3px solid ${alpha(tone, 0.85)}`, boxShadow: `0 0 28px ${alpha(tone, 0.25)}` }}>
          <Icon name={icon} size={52} color={tone} />
        </div>
        <div style={{ marginTop: 14, fontSize: 42, fontWeight: 800, color: C.textStrong }}>{title}</div>
        <div style={{ marginTop: 4, fontSize: 30, fontWeight: 560, color: C.muted }}>{sub}</div>
      </div>
    </Reveal>
  );
}

/**
 * s05-caso «Una cifra necesita su método». Provider coverage and the 1–30 September window, then one row per
 * unit with its deduplication key as the voice names it. Identifier pitfalls and the resale note sit on the
 * right; «decisiones del ejercicio, no reglas universales» stays at the bottom. The last paragraph swaps the
 * table for three separate dates (obtain, publish, sell).
 */
export function S05Caso(props: SceneProps) {
  const frame = useCurrentFrame();
  const at = (id: string) => segment(props, id).from;
  const w = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);
  const dates = at('s05-06') - 8;
  const regs = w('s05-05', 'registros') - 8;
  const end = (id: string) => segment(props, id).to;

  const rowsAt = [w('s05-03', 'hash') - 10, w('s05-03', 'episodios') - 10, w('s05-03', 'dispositivos') - 10, regs, regs + 70];
  const rows: [string, string][] = [
    ['Muestras', 'hash SHA-256 distinto'],
    ['Episodios', 'equipo y día'],
    ['Dispositivos', 'identificador estable'],
    ['Registros', 'dispositivo + artefacto + fecha de obtención'],
    ['Organizaciones', 'identidad validada'],
  ];

  return (
    <Stage>
      <Reveal frame={frame} at={at('s05-01') - 6} outAt={dates} x={0} y={0} w={840}>
        <InfoCard icon="globe" title="Demo-P: no ve todo el mundo" sub="dos regiones y anuncios seleccionados" tone="sky" w={840} h={130} />
      </Reveal>
      <Reveal frame={frame} at={w('s05-02', 'ventana') - 10} outAt={dates} x={888} y={0} w={840}>
        <InfoCard icon="clock" title="1–30 de septiembre · UTC" sub="la ventana de todas las cifras" tone="cyan" w={840} h={130} />
      </Reveal>

      {/* unit → key */}
      <Reveal frame={frame} at={w('s05-02', 'duplicados') - 10} outAt={dates} x={0} y={ROW_Y - 40} w={TABLE_W}>
        <div style={{ display: 'flex', gap: 20, padding: '0 24px', fontFamily: FONT.sans, fontSize: 27, fontWeight: 700, letterSpacing: 2, color: C.muted, textTransform: 'uppercase' }}>
          <span style={{ width: 334 }}>Unidad</span>
          <span>Se deduplica por</span>
        </div>
      </Reveal>
      {rows.map(([unit, by], i) => (
        <RowOut key={unit} until={dates}>
          <Row frame={frame} at={rowsAt[i]} until={rowsAt[i + 1] ?? end('s05-05')} i={i} unit={unit} by={by} />
        </RowOut>
      ))}

      {/* right-hand pitfalls */}
      <Reveal frame={frame} at={at('s05-04') + 40} outAt={regs - 6} x={1236} y={ROW_Y} w={492}>
        <InfoCard icon="split" title="Un equipo, dos identificadores" sub="se divide un mismo equipo" tone="amber" w={492} h={150} titleSize={32} subSize={27} />
      </Reveal>
      <Reveal frame={frame} at={at('s05-04') + 90} outAt={regs - 6} x={1236} y={ROW_Y + 170} w={492}>
        <InfoCard icon="merge" title="Dos equipos, un identificador" sub="se unen por error" tone="amber" w={492} h={150} titleSize={32} subSize={27} />
      </Reveal>
      <Reveal frame={frame} at={w('s05-05', 'reventa') - 10} outAt={dates} x={1236} y={ROW_Y + 80} w={492}>
        <InfoCard icon="archive" title="Una reventa" sub="no suma otra infección" tone="amber" w={492} h={140} titleSize={36} />
      </Reveal>

      <Reveal frame={frame} at={at('s05-04')} outAt={dates} x={0} y={598} w={1728}>
        <Pill icon="flag" tone="sky" size={34}>decisiones del ejercicio, no reglas universales</Pill>
      </Reveal>

      {/* three separate dates */}
      <svg width={1728} height={300} style={{ position: 'absolute', left: 0, top: 0, opacity: windowWeight(frame, dates + 10, undefined, { ramp: 16, lead: 0 }) }}>
        <line x1={278} y1={120} x2={790} y2={120} stroke={alpha(C.muted, 0.7)} strokeWidth={4} strokeDasharray="10 10" />
        <line x1={938} y1={120} x2={1450} y2={120} stroke={alpha(C.muted, 0.7)} strokeWidth={4} strokeDasharray="10 10" />
      </svg>
      <Moment frame={frame} at={w('s05-06', 'obtener') - 10} x={200} icon="laptop" title="Obtener los datos" sub="su propia fecha" tone={C.cyan} />
      <Moment frame={frame} at={w('s05-06', 'publicarlos') - 10} x={864} icon="globe" title="Publicarlos" sub="su propia fecha" tone={C.sky} />
      <Moment frame={frame} at={w('s05-06', 'venderlos') - 10} x={1528} icon="key" title="Venderlos" sub="su propia fecha" tone={C.amber} />
      <Reveal frame={frame} at={w('s05-06', 'Confundir') - 8} x={364} y={360} w={1000}>
        <InfoCard icon="alert" title="Confundir esas fechas" sub="una exposición antigua parece reciente" tone="amber" w={1000} h={140} titleSize={42} />
      </Reveal>
    </Stage>
  );
}

/** Fades a whole row out at `until` (the rows themselves only know their own entrance). */
function RowOut({ until, children }: { until: number; children: ReactNode }) {
  const frame = useCurrentFrame();
  const o = windowWeight(frame, until, undefined, { ramp: 14, lead: 0 });
  return <div style={{ opacity: 1 - o }}>{children}</div>;
}

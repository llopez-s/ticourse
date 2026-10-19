import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, alpha } from '../../../engine/src/theme/tokens';
import { progress } from '../../../engine/src/theme/motion';
import { Icon, type IconName } from '../../../engine/src/ui/Icon';
import { InfoCard, LearningCard, Pill, Reveal } from './parts/bits';
import { Ficha } from './parts/Ficha';
import { Stage, audioEnd, segment, wordFrame } from './kit';

const S = 's06-caso';

/** An arrow from (x1,y1) to (x2,y2), drawn between `at` and `at + 20`, with an optional label on its middle. */
function Edge({ frame, at, x1, y1, x2, y2, color, dash, label, dim = 0, labelSize = 26 }: { frame: number; at: number; x1: number; y1: number; x2: number; y2: number; color: string; dash?: string; label?: string; dim?: number; labelSize?: number }) {
  const p = progress(frame, at, 20);
  if (p <= 0) return null;
  const ex = x1 + (x2 - x1) * p;
  const ey = y1 + (y2 - y1) * p;
  const ang = Math.atan2(y2 - y1, x2 - x1);
  const hx = (r: number, a: number) => x2 - Math.cos(ang + a) * r;
  const hy = (r: number, a: number) => y2 - Math.sin(ang + a) * r;
  return (
    <g opacity={1 - 0.7 * dim}>
      <line x1={x1} y1={y1} x2={ex} y2={ey} stroke={color} strokeWidth={4} strokeDasharray={dash} strokeLinecap="round" />
      {p > 0.92 ? <polygon points={`${x2},${y2} ${hx(20, 0.45)},${hy(20, 0.45)} ${hx(20, -0.45)},${hy(20, -0.45)}`} fill={color} /> : null}
      {label && p > 0.5 ? (
        <g>
          <rect x={(x1 + x2) / 2 - label.length * 7.4 - 12} y={(y1 + y2) / 2 - 20} width={label.length * 14.8 + 24} height={40} rx={20} fill={C.ink950} stroke={alpha(color, 0.7)} strokeWidth={2} />
          <text x={(x1 + x2) / 2} y={(y1 + y2) / 2 + 9} textAnchor="middle" fontFamily={FONT.sans} fontSize={labelSize} fontWeight={700} fill={C.text}>{label}</text>
        </g>
      ) : null}
    </g>
  );
}

function Node({ icon, title, sub, tone, w = 340 }: { icon: IconName; title: string; sub?: string; tone: string; w?: number }) {
  return <InfoCard icon={icon} title={title} sub={sub} tone={tone} w={w} h={84} titleSize={30} subSize={24} style={{ gap: 14 }} />;
}

/** A small hub-and-spoke graph for the closing comparison. */
function Hub({ frame, at, styles }: { frame: number; at: number; styles: { color: string; dash?: string; label?: string }[] }) {
  const p = progress(frame, at, 16);
  const n = styles.length;
  return (
    <svg width={820} height={250} style={{ opacity: p, fontFamily: FONT.sans }}>
      <rect x={20} y={95} width={90} height={60} rx={12} fill={alpha(C.cyan, 0.15)} stroke={C.cyan} strokeWidth={3} />
      <text x={65} y={137} textAnchor="middle" fontFamily={FONT.mono} fontSize={38} fontWeight={800} fill={C.cyanSoft}>A</text>
      {styles.map((s, i) => {
        const y = 24 + i * ((250 - 48) / (n - 1));
        return (
          <g key={i}>
            <line x1={110} y1={125} x2={560} y2={y} stroke={s.color} strokeWidth={4} strokeDasharray={s.dash} strokeLinecap="round" />
            <circle cx={580} cy={y} r={14} fill={C.ink850} stroke={s.color} strokeWidth={3} />
            {s.label ? <text x={606} y={y + 9} fontSize={26} fontWeight={700} fill={C.text}>{s.label}</text> : null}
          </g>
        );
      })}
    </svg>
  );
}

/**
 * s06-caso «Una línea no cuenta cómo ocurrió». Phase 1: A with its four kinds of relation (parent, embedded
 * domain, observed contact, dropped file), each with a direction; embedded and contact are the two the voice
 * unpacks. Phase 2: D shares a hosting address with A across a wide interval on a multi-client server, and what
 * to check. Phase 3: server TLS vs code-signing certificates, direction/time/source, and the same graph with
 * every line equal vs lines that say what they are.
 */
export function S06Relaciones(props: SceneProps) {
  const frame = useCurrentFrame();
  const at = (id: string) => segment(props, id).from;
  const w = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);
  const p2 = at('s06-03') - 6;
  const p3 = props.cue('s06-c') - 6;
  const cardAt = audioEnd(S, 's06-06') + 6;
  const rel = w('s06-01', 'significado.') - 10;

  return (
    <Stage>
      {/* phase 1 · four kinds of relation around A */}
      <Reveal frame={frame} at={rel - 14} outAt={p2} x={0} y={0} w={1728} h={500}>
        <svg width={1728} height={500} style={{ position: 'absolute', left: 0, top: 0 }}>
          <Edge frame={frame} at={rel + 6} x1={380} y1={232} x2={706} y2={232} color={C.muted} label="lo ejecutó" />
          <Edge frame={frame} at={rel + 20} x1={1020} y1={222} x2={1380} y2={62} color={C.amber} dash="10 8" label="contiene" />
          <Edge frame={frame} at={rel + 34} x1={1020} y1={232} x2={1380} y2={232} color={C.sky} label="contactó" />
          <Edge frame={frame} at={rel + 48} x1={1020} y1={242} x2={1380} y2={402} color={C.cyan} label="soltó" />
        </svg>
        <div style={{ position: 'absolute', left: 714, top: 182 }}>
          <Ficha letter="A" tone={C.cyan} title="Muestra A" sub="el archivo" w={300} h={100} tile={60} titleSize={32} subSize={26} />
        </div>
        <div style={{ position: 'absolute', left: 40, top: 190 }}>
          <Node icon="play" title="Padre de ejecución" sub="quién lo lanzó" tone={C.muted} />
        </div>
        <div style={{ position: 'absolute', left: 1388, top: 20, opacity: progress(frame, rel + 20, 14) }}>
          <Node icon="file" title="Dominio incrustado" sub="texto dentro del archivo" tone={C.amber} />
        </div>
        <div style={{ position: 'absolute', left: 1388, top: 190, opacity: progress(frame, rel + 34, 14) }}>
          <Node icon="globe" title="Contacto observado" sub="visto al ejecutarlo" tone={C.sky} />
        </div>
        <div style={{ position: 'absolute', left: 1388, top: 360, opacity: progress(frame, rel + 48, 14) }}>
          <Node icon="archive" title="Archivo soltado" sub="creado por A" tone={C.cyan} />
        </div>
      </Reveal>
      <Reveal frame={frame} at={w('s06-01', 'prueba') - 8} outAt={p2} x={0} y={500} w={1728}>
        <Pill icon="x" tone="amber" size={30}>un dominio escrito en el archivo no prueba contacto</Pill>
      </Reveal>
      <Reveal frame={frame} at={w('s06-02', 'demuestra') - 6} outAt={p2} x={0} y={566} w={1728}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <Pill icon="x" tone="amber" size={30}>contacto observado no prueba control del atacante</Pill>
          <span style={{ opacity: progress(frame, w('s06-02', 'compartido') - 12, 14) }}>
            <Pill icon="users" tone="sky" size={28}>servicio compartido</Pill>
          </span>
          <span style={{ opacity: progress(frame, w('s06-02', 'comprobación') - 8, 14) }}>
            <Pill icon="check" tone="emerald" size={28}>comprobación legítima</Pill>
          </span>
        </div>
      </Reveal>

      {/* phase 2 · D shares a hosting address with A */}
      <Reveal frame={frame} at={at('s06-03')} outAt={p3} x={0} y={0} w={1728} h={620}>
        <svg width={1728} height={620} style={{ position: 'absolute', left: 0, top: 0 }}>
          <Edge frame={frame} at={w('s06-03', 'con') + 4} x1={380} y1={90} x2={552} y2={150} color={C.cyan} />
          <Edge frame={frame} at={w('s06-03', 'comparte')} x1={380} y1={240} x2={552} y2={190} color={C.sky} />
          <line x1={60} y1={440} x2={940} y2={440} stroke={alpha(C.muted, 0.6)} strokeWidth={3} />
        </svg>
        <div style={{ position: 'absolute', left: 0, top: 40, opacity: progress(frame, at('s06-03') + 4, 14) }}>
          <Ficha letter="A" tone={C.cyan} title="Muestra A" w={360} h={100} tile={60} titleSize={32} />
        </div>
        <div style={{ position: 'absolute', left: 0, top: 190, opacity: progress(frame, at('s06-03') + 4, 14) }}>
          <Ficha letter="D" tone={C.sky} title="Candidato D" w={360} h={100} tile={60} titleSize={32} />
        </div>
        <div style={{ position: 'absolute', left: 560, top: 100, opacity: progress(frame, w('s06-03', 'dirección') - 6, 14) }}>
          <InfoCard icon="server" title="IP de alojamiento" sub="la misma para A y D" tone="sky" w={430} h={120} titleSize={34} subSize={26} />
        </div>
        <div style={{ position: 'absolute', left: 560, top: 252, display: 'flex', gap: 14, alignItems: 'center', opacity: progress(frame, w('s06-03', 'varios') - 6, 14) }}>
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} style={{ width: 62, height: 56, borderRadius: 10, display: 'grid', placeItems: 'center', background: C.ink850, border: `2px solid ${alpha(C.muted, 0.6)}` }}>
              <Icon name="desktop" size={34} color={C.muted} />
            </div>
          ))}
        </div>
        <Reveal frame={frame} at={w('s06-03', 'clientes.') - 6} x={560} y={316} w={430}>
          <span style={{ fontFamily: FONT.sans, fontSize: 28, fontWeight: 700, color: C.muted }}>un servidor, varios clientes</span>
        </Reveal>
        <Reveal frame={frame} at={w('s06-03', 'intervalo') - 6} x={0} y={372} w={1000}>
          <div style={{ position: 'relative', width: 1000, height: 100 }}>
            <div style={{ position: 'absolute', left: 60, top: 0, width: 880, height: 44, borderRadius: 22, background: alpha(C.amber, 0.18), border: `2px solid ${alpha(C.amber, 0.8)}`, display: 'grid', placeItems: 'center', fontFamily: FONT.sans, fontSize: 28, fontWeight: 700, color: '#fcd34d' }}>intervalo amplio</div>
            {[
              ['A', 190, C.cyan],
              ['D', 780, C.sky],
            ].map(([l, x, col]) => (
              <div key={l as string} style={{ position: 'absolute', left: (x as number) - 22, top: 60, width: 44, height: 44, borderRadius: 22, display: 'grid', placeItems: 'center', background: alpha(col as string, 0.2), border: `3px solid ${col}`, fontFamily: FONT.mono, fontSize: 26, fontWeight: 800, color: C.textStrong }}>{l}</div>
            ))}
          </div>
        </Reveal>
        <Reveal frame={frame} at={w('s06-03', 'basta') - 14} x={0} y={500} w={1000}>
          <Pill icon="x" tone="amber" size={32}>esa coincidencia no basta para unirlos</Pill>
        </Reveal>
        {[
          ['clock', '¿Cuándo resolvió cada dominio?', w('s06-04', 'cuándo')],
          ['server', '¿Qué servicio era?', w('s06-04', 'servicio')],
          ['link', '¿Qué evidencia los vincula?', w('s06-04', 'evidencia')],
        ].map(([icon, t, f], i) => (
          <Reveal key={t as string} frame={frame} at={(f as number) - 10} x={1060} y={40 + i * 116} w={668}>
            <InfoCard icon={icon as IconName} title={t as string} tone="cyan" w={668} h={96} titleSize={32} />
          </Reveal>
        ))}
      </Reveal>

      {/* phase 3 · certificates, direction/time/source, equal vs distinguished lines */}
      <Reveal frame={frame} at={props.cue('s06-c')} x={0} y={0} w={820}>
        <InfoCard icon="server" title="Certificado TLS del servidor" sub="vincula servidor y dominio" tone="sky" w={820} h={112} titleSize={34} />
      </Reveal>
      <Reveal frame={frame} at={w('s06-05', 'certificados', 1) - 10} x={0} y={134} w={820}>
        <InfoCard icon="shield" title="Certificado de firma de código" sub="vincula archivos firmados" tone="cyan" w={820} h={112} titleSize={34} />
      </Reveal>
      <Reveal frame={frame} at={w('s06-05', 'Vinculan') - 4} x={0} y={266} w={820}>
        <Pill icon="split" tone="muted" size={30}>objetos diferentes</Pill>
      </Reveal>
      <Reveal frame={frame} at={w('s06-05', 'Mantén') - 6} x={900} y={0} w={828}>
        <div style={{ display: 'grid', gap: 14 }}>
          <span style={{ fontFamily: FONT.sans, fontSize: 32, fontWeight: 800, color: C.textStrong }}>De cada relación, conserva</span>
          <div style={{ display: 'flex', gap: 14 }}>
            <span style={{ opacity: progress(frame, w('s06-05', 'dirección') - 6, 14) }}><Pill icon="arrowRight" tone="cyan" size={30}>dirección</Pill></span>
            <span style={{ opacity: progress(frame, w('s06-05', 'dirección') + 14, 14) }}><Pill icon="clock" tone="amber" size={30}>tiempo</Pill></span>
            <span style={{ opacity: progress(frame, w('s06-05', 'fuente') - 6, 14) }}><Pill icon="archive" tone="sky" size={30}>fuente</Pill></span>
          </div>
        </div>
      </Reveal>
      <Reveal frame={frame} at={at('s06-06')} x={0} y={340} w={820}>
        <div style={{ fontFamily: FONT.sans, fontSize: 30, fontWeight: 800, color: '#fcd34d', marginBottom: 4 }}>Todas las líneas iguales</div>
      </Reveal>
      <Reveal frame={frame} at={at('s06-06') + 10} x={0} y={380} w={820} h={250}>
        <Hub frame={frame} at={at('s06-06') + 10} styles={[0, 1, 2, 3, 4].map(() => ({ color: C.muted }))} />
      </Reveal>
      <Reveal frame={frame} at={w('s06-06', 'concluyente')} x={900} y={340} w={828}>
        <div style={{ fontFamily: FONT.sans, fontSize: 30, fontWeight: 800, color: '#6ee7b7', marginBottom: 4 }}>Líneas que dicen lo que son</div>
      </Reveal>
      <Reveal frame={frame} at={w('s06-06', 'concluyente') + 10} x={900} y={380} w={820} h={250}>
        <Hub
          frame={frame}
          at={w('s06-06', 'concluyente') + 10}
          styles={[
            { color: C.muted, label: 'lo ejecutó' },
            { color: C.amber, dash: '10 8', label: 'contiene' },
            { color: C.sky, label: 'contactó' },
            { color: C.cyan, label: 'soltó' },
            { color: C.sky, dash: '3 9', label: 'misma IP' },
          ]}
        />
      </Reveal>
      <LearningCard frame={frame} at={cardAt} text="Comprueba función, dirección y tiempo de la relación" />
    </Stage>
  );
}

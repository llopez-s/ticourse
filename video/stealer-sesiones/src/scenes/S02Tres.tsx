import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { progress } from '../../../engine/src/theme/motion';
import { Icon, type IconName } from '../../../engine/src/ui/Icon';
import { tone as toneOf, type Tone } from '../../../engine/src/ui/tone';
import { LearningCard, Note, Reveal } from './parts/bits';
import { Stage, audioEnd, segment, wordFrame } from './kit';

const S = 's02-caso';
const COL_W = 540;
const GAP = 54;
const SLOT_Y = 112;
const SLOT_H = 250;
const colX = (i: number) => i * (COL_W + GAP);

interface Claim {
  icon: IconName;
  title: string;
  sub: string;
  tone: Tone;
  ev: { title: string; sub: string };
}

const CLAIMS: Claim[] = [
  { icon: 'file', title: 'Puede robar', sub: 'capacidad', tone: 'sky', ev: { title: 'Ficha técnica', sub: 'la familia puede robar contraseñas' } },
  { icon: 'database', title: 'Hay datos extraídos', sub: 'exposición', tone: 'cyan', ev: { title: 'Evidencia del incidente', sub: 'ciertos datos salieron del equipo' } },
  { icon: 'eye', title: 'Hubo un acceso', sub: 'uso', tone: 'rose', ev: { title: 'Registro del servicio', sub: 'un acceso posterior' } },
];

/** One column: header, and a slot that shows «desconocido» until its evidence slides in. */
function Column({ frame, i, colAt, evAt, factsAt }: { frame: number; i: number; colAt: number; evAt: number; factsAt: number }) {
  const c = CLAIMS[i];
  const t = toneOf(c.tone);
  const p = progress(frame, colAt, 18);
  const ev = progress(frame, evAt, 20);
  const facts = progress(frame, factsAt, 14);
  return (
    <div style={{ position: 'absolute', left: colX(i), top: 0, width: COL_W, fontFamily: FONT.sans }}>
      <div style={{ boxSizing: 'border-box', height: 92, display: 'flex', alignItems: 'center', gap: 16, padding: '0 22px', borderRadius: RADIUS.md, background: alpha(t.fg, 0.14), border: `2px solid ${alpha(t.fg, 0.7)}`, opacity: p, transform: `translateY(${(1 - p) * -12}px)` }}>
        <Icon name={c.icon} size={46} color={t.fg} />
        <div>
          <div style={{ fontSize: 38, fontWeight: 850, color: C.textStrong, lineHeight: 1.1 }}>{c.title}</div>
          <div style={{ fontSize: 28, fontWeight: 600, color: t.soft }}>{c.sub}</div>
        </div>
      </div>
      <div style={{ position: 'absolute', left: 0, top: SLOT_Y, width: COL_W, height: SLOT_H, opacity: p }}>
        {/* the unknown that waits */}
        <div style={{ boxSizing: 'border-box', position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', borderRadius: RADIUS.md, border: `2px dashed ${alpha(C.faint, 0.8)}`, opacity: 1 - ev }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 76, fontWeight: 850, lineHeight: 1, color: C.faint }}>?</div>
            <div style={{ fontSize: 36, fontWeight: 750, color: C.muted }}>desconocido</div>
          </div>
        </div>
        {/* the evidence */}
        {ev > 0 ? (
          <div style={{ boxSizing: 'border-box', position: 'absolute', inset: 0, padding: '18px 24px', borderRadius: RADIUS.md, border: `2px solid ${alpha(t.fg, 0.8)}`, background: C.ink850, boxShadow: `0 0 ${24 * ev}px ${alpha(t.fg, 0.25 * ev)}`, opacity: ev, transform: `translateY(${(1 - ev) * 90}px)` }}>
            <div style={{ fontSize: 38, fontWeight: 800, lineHeight: 1.12, color: C.textStrong }}>{c.ev.title}</div>
            <div style={{ marginTop: 6, fontSize: 30, fontWeight: 600, lineHeight: 1.18, color: t.soft }}>{c.ev.sub}</div>
            <div style={{ marginTop: 14, display: 'grid', gap: 6, opacity: facts }}>
              {['fecha', 'procedencia'].map((f) => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 28, fontWeight: 650, color: C.amber }}>
                  <Icon name="alert" size={28} color={C.amber} />
                  {f}: desconocida
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

/**
 * s02-caso «Tres afirmaciones distintas». Three columns (can steal / data left / was used), each with an
 * «desconocido» slot. The evidence of each slides in as the voice names it (capacity → exposure → use), and
 * nothing fills the next column. At s02-b two crossed links say one claim does not prove the next; notes on the
 * detection and the listing for sale; at s02-c the date and origin of each piece show as unknown. Learning card.
 */
export function S02Tres(props: SceneProps) {
  const frame = useCurrentFrame();
  const at = (id: string) => segment(props, id).from;
  const colAt = [at('s02-01') - 4, wordFrame(S, 's02-01', 'evidencia') - 14, wordFrame(S, 's02-02', 'registro') - 18];
  const evAt = [wordFrame(S, 's02-01', 'capacidad') - 62, wordFrame(S, 's02-01', 'salieron') - 40, wordFrame(S, 's02-02', 'permite') - 36];
  const link = props.cue('s02-b');
  const facts = props.cue('s02-c') + 8;
  const cardAt = audioEnd(S, 's02-06') + 6;

  return (
    <Stage>
      {[0, 1, 2].map((i) => (
        <Column key={i} frame={frame} i={i} colAt={colAt[i]} evAt={evAt[i]} factsAt={facts + i * 40} />
      ))}

      {/* no automatic link between claims */}
      {[0, 1].map((i) => {
        const p = progress(frame, link + i * 16, 16);
        if (p <= 0) return null;
        const x = colX(i) + COL_W;
        return (
          <div key={i} style={{ position: 'absolute', left: x - 12, top: SLOT_Y + SLOT_H / 2 - 30, width: GAP + 24, height: 60, display: 'grid', placeItems: 'center', opacity: p }}>
            <div style={{ width: 56, height: 56, borderRadius: 28, display: 'grid', placeItems: 'center', background: C.ink950, border: `3px solid ${alpha(C.rose, 0.9)}` }}>
              <Icon name="x" size={34} color={C.rose} strokeWidth={3.2} />
            </div>
          </div>
        );
      })}

      <Reveal frame={frame} at={link + 36} x={0} y={382} w={1728}>
        <Note icon="split" tone="muted" size={34} w={1728}>una afirmación no demuestra automáticamente las otras dos</Note>
      </Reveal>
      <Reveal frame={frame} at={wordFrame(S, 's02-03', 'detección') - 12} x={colX(1)} y={468} w={COL_W}>
        <Note icon="search" tone="amber" size={28} w={COL_W}>una detección no identifica por sí sola todos los datos</Note>
      </Reveal>
      <Reveal frame={frame} at={wordFrame(S, 's02-04', 'listado') - 12} x={colX(2)} y={468} w={COL_W}>
        <Note icon="database" tone="amber" size={28} w={COL_W}>un listado en venta no acredita un acceso reciente</Note>
      </Reveal>
      <Reveal frame={frame} at={wordFrame(S, 's02-05', 'antiguo') - 12} outAt={at('s02-06') - 6} x={0} y={584} w={1000}>
        <Note icon="clock" tone="amber" size={30} w={1000}>un dato antiguo puede revenderse, duplicarse o estar mal atribuido</Note>
      </Reveal>
      <Reveal frame={frame} at={at('s02-06')} x={0} y={584} w={1728}>
        <Note icon="alert" tone="cyan" size={34} w={1728}>una sospecha no es una secuencia demostrada</Note>
      </Reveal>

      <LearningCard frame={frame} at={cardAt} text="Capacidad, exposición y uso requieren evidencia distinta" />
    </Stage>
  );
}

import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { progress } from '../../../engine/src/theme/motion';
import { Icon, type IconName } from '../../../engine/src/ui/Icon';
import { InfoCard, LearningCard, Note, Pill, Reveal, WHO } from './parts/bits';
import { Stage, audioEnd, segment, wordFrame } from './kit';

const S = 's09-caso';
const REVIEW_Y = 234;
const REVIEW_W = 408;

const REVIEWS: { icon: IconName; title: string; sub: string; tone: string }[] = [
  { icon: 'laptop', title: 'Equipo', sub: 'recuperación autorizada', tone: WHO.ana },
  { icon: 'shield', title: 'Identidad', sub: 'sesiones del servicio', tone: WHO.idp },
  { icon: 'app', title: 'Aplicación', sub: 'permisos y sesión propia', tone: WHO.app },
  { icon: 'mail', title: 'Graph', sub: 'accesos al correo', tone: WHO.graph },
];

function Verdict({ frame, at, x, w, label, text, tone, icon }: { frame: number; at: number; x: number; w: number; label: string; text: string; tone: string; icon: IconName }) {
  return (
    <Reveal frame={frame} at={at} x={x} y={0} w={w}>
      <div style={{ boxSizing: 'border-box', width: w, height: 100, padding: '10px 20px', borderRadius: RADIUS.md, border: `2px solid ${alpha(tone, 0.6)}`, background: alpha(tone, 0.08), fontFamily: FONT.sans }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Icon name={icon} size={30} color={tone} />
          <span style={{ fontSize: 27, fontWeight: 800, letterSpacing: 2, color: tone, textTransform: 'uppercase' }}>{label}</span>
        </div>
        <div style={{ marginTop: 6, fontSize: 31, fontWeight: 650, color: C.textStrong }}>{text}</div>
      </div>
    </Reveal>
  );
}

/**
 * s09-caso «Volver al caso de Ana». Ana and Resumen del turno are tagged as exercise data (not a published
 * incident). Her computer is contained and the change is made from another trusted device; then four separate
 * reviews (device, identity, application, Graph) in the order the voice lists them, the two questions the
 * review asks, the rule against reusing an exposed credential, and the short report: confirmed / probable / still
 * to observe, closing with «acciones + efectos + límites». Learning card.
 */
export function S09Ana(props: SceneProps) {
  const frame = useCurrentFrame();
  const at = (id: string) => segment(props, id).from;
  const report = props.cue('s09-c');
  const cardAt = audioEnd(S, 's09-06') + 6;
  const revAt = [at('s09-01') + 150, wordFrame(S, 's09-02', 'identidad') - 14, wordFrame(S, 's09-02', 'permisos') - 14, wordFrame(S, 's09-02', 'actividad') - 14];
  const arrowP = progress(frame, wordFrame(S, 's09-01', 'otro') - 8, 18);
  const ctxAt = wordFrame(S, 's09-01', 'Ana') - 10;

  return (
    <Stage>
      <Reveal frame={frame} at={ctxAt} x={0} y={0} w={1728}>
        <div style={{ display: 'flex', gap: 16 }}>
          <Pill icon="user" tone="muted" size={28}>Ana · datos del ejercicio</Pill>
          <Pill icon="app" tone="muted" size={28}>Resumen del turno · datos del ejercicio</Pill>
        </div>
      </Reveal>

      <Reveal frame={frame} at={wordFrame(S, 's09-01', 'contenido') - 16} x={0} y={66} w={820}>
        <InfoCard icon="laptop" title="Equipo de Ana · contenido" sub="aislado con el procedimiento autorizado" tone="rose" w={820} h={112} titleSize={37} subSize={28} />
      </Reveal>
      <Reveal frame={frame} at={wordFrame(S, 's09-01', 'otro') - 16} x={908} y={66} w={820}>
        <InfoCard icon="desktop" title="Otro dispositivo confiable" sub="desde aquí se cambia la contraseña" tone="emerald" w={820} h={112} titleSize={37} subSize={28} />
      </Reveal>
      {arrowP > 0 ? (
        <svg width={88} height={40} style={{ position: 'absolute', left: 820, top: 102, opacity: arrowP }}>
          <line x1={64} y1={20} x2={64 - 56 * arrowP} y2={20} stroke={C.emerald} strokeWidth={4} strokeLinecap="round" strokeDasharray="10 8" />
        </svg>
      ) : null}

      {REVIEWS.map((r, i) => (
        <Reveal key={r.title} frame={frame} at={revAt[i]} x={i * (REVIEW_W + 32)} y={REVIEW_Y} w={REVIEW_W}>
          <InfoCard icon={r.icon} title={r.title} sub={r.sub} tone={r.tone} w={REVIEW_W} h={118} titleSize={36} subSize={27} />
        </Reveal>
      ))}
      <Reveal frame={frame} at={wordFrame(S, 's09-02', 'Después') - 8} x={0} y={REVIEW_Y - 38} w={900}>
        <div style={{ fontFamily: FONT.sans, fontSize: 26, fontWeight: 800, letterSpacing: 3, color: C.faint }}>CUATRO REVISIONES SEPARADAS</div>
      </Reveal>

      <Reveal frame={frame} at={wordFrame(S, 's09-03', 'funcionaron') - 16} outAt={report - 6} x={0} y={364} w={820}>
        <div style={{ display: 'flex', gap: 16 }}>
          <Pill icon="check" tone="cyan" size={30}>¿funcionaron las medidas?</Pill>
          <Pill icon="radar" tone="cyan" size={30} style={{ opacity: progress(frame, wordFrame(S, 's09-03', 'nuevas') - 8, 12) }}>¿nuevas señales?</Pill>
        </div>
      </Reveal>
      <Reveal frame={frame} at={at('s09-04')} outAt={report - 6} x={0} y={364 + 74} w={1728}>
        <Note icon="x" tone="rose" size={30} w={1100}>no se reutiliza ninguna credencial expuesta para intentar entrar</Note>
      </Reveal>

      {/* conclusion report */}
      <Reveal frame={frame} at={report - 4} x={0} y={364} w={1728}>
        <div style={{ boxSizing: 'border-box', width: 1728, height: 282, borderRadius: RADIUS.lg, border: `2px solid ${alpha(C.cyan, 0.55)}`, background: C.ink900, overflow: 'hidden', fontFamily: FONT.sans }}>
          <div style={{ height: 56, display: 'flex', alignItems: 'center', gap: 12, padding: '0 24px', background: alpha(C.cyan, 0.1), borderBottom: `2px solid ${C.ink700}` }}>
            <Icon name="file" size={32} color={C.cyan} />
            <span style={{ fontSize: 31, fontWeight: 800, color: C.cyanSoft }}>Informe de conclusión</span>
          </div>
          <div style={{ position: 'relative', height: 100, marginTop: 24 }}>
            <Verdict frame={frame} at={wordFrame(S, 's09-05', 'confirmado') - 8} x={24} w={540} label="Confirmado" text="lo que consta" tone={C.cyan} icon="check" />
            <Verdict frame={frame} at={wordFrame(S, 's09-05', 'probable') - 8} x={594} w={540} label="Probable" text="lo que apunta la evidencia" tone={C.amber} icon="alert" />
            <Verdict frame={frame} at={wordFrame(S, 's09-05', 'observar') - 18} x={1164} w={540} label="Falta por observar" text="lo que aún no se ha visto" tone={C.sky} icon="eye" />
          </div>
          <div style={{ marginTop: 22, padding: '0 24px', display: 'flex', alignItems: 'center', gap: 16, opacity: progress(frame, at('s09-06'), 14) }}>
            <Pill icon="check" tone="muted" size={28}>acciones completadas</Pill>
            <span style={{ fontSize: 34, fontWeight: 800, color: C.muted }}>+</span>
            <Pill icon="search" tone="cyan" size={28}>sus efectos</Pill>
            <span style={{ fontSize: 34, fontWeight: 800, color: C.muted }}>+</span>
            <Pill icon="flag" tone="amber" size={28}>sus límites</Pill>
          </div>
        </div>
      </Reveal>

      <LearningCard frame={frame} at={cardAt} text="Recuperación y cierre se apoyan en evidencia del caso" />
    </Stage>
  );
}

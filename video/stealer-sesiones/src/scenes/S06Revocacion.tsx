import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { progress } from '../../../engine/src/theme/motion';
import { Icon, type IconName } from '../../../engine/src/ui/Icon';
import { tone as toneOf, type Tone } from '../../../engine/src/ui/tone';
import { LearningCard, Note, Reveal } from './parts/bits';
import { Stage, audioEnd, segment, wordFrame } from './kit';

const S = 's06-caso';
const COLS = [
  { x: 0, w: 430 },
  { x: 464, w: 634 },
  { x: 1132, w: 596 },
] as const;
const HEAD_H = 46;
const ROW_H = 92;
const ROW_GAP = 8;
const rowY = (i: number) => HEAD_H + 10 + i * (ROW_H + ROW_GAP);
const SEP_Y = rowY(4) + 34;

interface Row {
  icon: IconName;
  tone: Tone;
  scenario: string;
  action: string;
  check: string;
}

const ROWS: Row[] = [
  { icon: 'lock', tone: 'cyan', scenario: 'Contraseña expuesta', action: 'Cambiarla desde un entorno confiable', check: 'las sesiones existentes siguen pendientes' },
  { icon: 'globe', tone: 'amber', scenario: 'Cookie o sesión web', action: 'Invalidarla en el servicio que la gestiona', check: 'sesión del proveedor y de la aplicación: distintas' },
  { icon: 'plug', tone: 'sky', scenario: 'Token de renovación', action: 'Revocar la capacidad de renovar, según el emisor', check: 'denegar la renovación no cierra los access tokens ya emitidos' },
  { icon: 'key', tone: 'emerald', scenario: 'Token de acceso', action: 'Controles del emisor y del recurso', check: 'puede aceptarse hasta caducar o intervención compatible' },
];
const APP: Row = { icon: 'app', tone: '#fb923c', scenario: 'Aplicación o consentimiento', action: 'Revisar permisos, retirar la concesión, rotar credenciales de la aplicación', check: 'no depende de la contraseña de la persona' };

function MatrixRow({ frame, y, row, at, litAt, dashed = false }: { frame: number; y: number; row: Row; at: number; litAt?: number; dashed?: boolean }) {
  const t = toneOf(row.tone);
  const p = progress(frame, at, 16);
  const lit = litAt === undefined ? 0 : progress(frame, litAt, 14);
  return (
    <div style={{ position: 'absolute', left: 0, top: y, width: 1728, height: ROW_H, fontFamily: FONT.sans }}>
      <div style={{ position: 'absolute', inset: 0, borderRadius: RADIUS.md, border: `2px dashed ${alpha(C.ink600, 0.7)}`, opacity: 1 - p }} />
      <div style={{ position: 'absolute', inset: 0, opacity: p, transform: `translateX(${(1 - p) * 20}px)` }}>
        <div style={{ boxSizing: 'border-box', position: 'absolute', left: COLS[0].x, width: COLS[0].w, height: ROW_H, display: 'flex', alignItems: 'center', gap: 16, padding: '0 18px', borderRadius: RADIUS.md, background: alpha(t.fg, 0.12), border: `2px ${dashed ? 'dashed' : 'solid'} ${alpha(t.fg, 0.7)}` }}>
          <Icon name={row.icon} size={42} color={t.fg} style={{ flexShrink: 0 }} />
          <span style={{ fontSize: 33, fontWeight: 800, lineHeight: 1.1, color: C.textStrong }}>{row.scenario}</span>
        </div>
        <div style={{ boxSizing: 'border-box', position: 'absolute', left: COLS[1].x, width: COLS[1].w, height: ROW_H, display: 'flex', alignItems: 'center', padding: '0 22px', borderRadius: RADIUS.md, background: C.ink850, border: `2px solid ${C.ink700}`, fontSize: 31, fontWeight: 650, lineHeight: 1.16, color: C.text }}>{row.action}</div>
        <div style={{ boxSizing: 'border-box', position: 'absolute', left: COLS[2].x, width: COLS[2].w, height: ROW_H, display: 'flex', alignItems: 'center', gap: 14, padding: '0 22px', borderRadius: RADIUS.md, background: lit > 0 ? alpha(C.amber, 0.06 + 0.08 * lit) : C.ink850, border: `2px solid ${lit > 0 ? alpha(C.amber, 0.45 + 0.4 * lit) : C.ink700}`, fontSize: 29, fontWeight: 620, lineHeight: 1.16, color: lit > 0 ? '#fde68a' : C.muted }}>
          <Icon name="search" size={30} color={lit > 0 ? C.amber : C.faint} style={{ flexShrink: 0 }} />
          {row.check}
        </div>
      </div>
    </div>
  );
}

/**
 * s06-caso «Elegir la revocación que corresponde». The scenario / action / check matrix of the lesson, drawn
 * as empty slots and filled as the voice goes: password and web session (s06-a), the application row apart
 * at the bottom, then renewal and access tokens (s06-b). The check column lights where the voice warns
 * (renewal, then the two session levels), and the app row gets its own pass at s06-c. Learning card.
 */
export function S06Revocacion(props: SceneProps) {
  const frame = useCurrentFrame();
  const at = (id: string) => segment(props, id).from;
  const checkHead = wordFrame(S, 's06-02', 'comprobación') - 12;
  const rowAt = [at('s06-01') + 4, wordFrame(S, 's06-01', 'sesiones') - 22, at('s06-03') + 4, wordFrame(S, 's06-03', 'acceso') - 12];
  const appAt = wordFrame(S, 's06-02', 'concesión') - 20;
  const closing = at('s06-06');
  const cardAt = audioEnd(S, 's06-06') + 6;

  return (
    <Stage>
      {/* header */}
      <div style={{ position: 'absolute', left: 0, top: 0, width: 1728, height: HEAD_H, fontFamily: FONT.sans, fontSize: 27, fontWeight: 800, letterSpacing: 3, color: C.faint }}>
        {['ESCENARIO', 'ACCIÓN QUE SE VALORA', 'COMPROBACIÓN PENDIENTE'].map((h, i) => (
          <span key={h} style={{ position: 'absolute', left: COLS[i].x + 4, top: 6, color: i === 2 ? alpha(C.amber, 0.55 + 0.45 * progress(frame, checkHead, 14)) : C.faint }}>{h}</span>
        ))}
      </div>
      {ROWS.map((r, i) => (
        <MatrixRow key={r.scenario} frame={frame} y={rowY(i)} row={r} at={rowAt[i]} litAt={[undefined, at('s06-04') + 10, wordFrame(S, 's06-03', 'renovación') - 6, wordFrame(S, 's06-03', 'tokens') - 6][i]} />
      ))}
      <MatrixRow frame={frame} y={SEP_Y} row={APP} at={appAt} litAt={wordFrame(S, 's06-05', 'elimina') - 40} dashed />
      <Reveal frame={frame} at={appAt - 6} x={1180} y={SEP_Y - 36} w={548}>
        <div style={{ textAlign: 'right', fontFamily: FONT.sans, fontSize: 26, fontWeight: 700, letterSpacing: 2, color: C.faint }}>FILA APARTE</div>
      </Reveal>
      <Reveal frame={frame} at={closing} x={0} y={SEP_Y + ROW_H + 12} w={1728}>
        <Note icon="check" tone="cyan" size={30} w={1728}>cierras las vías que indique la investigación y compruebas el efecto de cada medida</Note>
      </Reveal>

      <LearningCard frame={frame} at={cardAt} text="La acción depende del artefacto y del servicio emisor" />
    </Stage>
  );
}

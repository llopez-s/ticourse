import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { progress } from '../../../engine/src/theme/motion';
import { Icon, type IconName } from '../../../engine/src/ui/Icon';
import { tone as toneOf, type Tone } from '../../../engine/src/ui/tone';
import { Note, Pill, Reveal } from './parts/bits';
import { Stage, segment, wordFrame } from './kit';

const S = 's03-caso';
const TOP = 180; // the engine's intercepted-message card owns the first 170 px of the stage
const ROW_H = 90;
const ROW_GAP = 12;
const FIELDS = ['recurso', 'vigencia', 'controles'] as const;

interface Item {
  icon: IconName;
  name: string;
  does: string;
  tone: Tone;
}

const ITEMS: Item[] = [
  { icon: 'lock', name: 'Contraseña', does: 'puede iniciar una autenticación nueva', tone: 'cyan' },
  { icon: 'globe', name: 'Cookie de sesión', does: 'puede mantener un acceso web existente', tone: 'amber' },
  { icon: 'key', name: 'Token de acceso', does: 'operaciones sobre un recurso concreto', tone: 'sky' },
  { icon: 'plug', name: 'Token de renovación', does: 'pide tokens nuevos al servidor de autorización', tone: 'emerald' },
];

/** One credential: what it does, and three fields that stay pending (no real value is ever shown). */
function Row({ frame, i, at, checkAt, focus }: { frame: number; i: number; at: number; checkAt: number; focus: number }) {
  const it = ITEMS[i];
  const t = toneOf(it.tone);
  const p = progress(frame, at, 16);
  const chk = progress(frame, checkAt + i * 22, 14);
  return (
    <div style={{ position: 'absolute', left: 0, top: i * (ROW_H + ROW_GAP), width: 1728, height: ROW_H, boxSizing: 'border-box', display: 'flex', alignItems: 'center', gap: 22, padding: '0 22px 0 16px', borderRadius: RADIUS.md, background: C.ink850, border: `2px solid ${alpha(t.fg, 0.4 + 0.45 * focus)}`, boxShadow: focus > 0 ? `0 0 ${20 * focus}px ${alpha(t.fg, 0.25 * focus)}` : 'none', opacity: p, transform: `translateX(${(1 - p) * 24}px)`, fontFamily: FONT.sans }}>
      <div style={{ width: 62, height: 62, borderRadius: 14, display: 'grid', placeItems: 'center', background: alpha(t.fg, 0.14), border: `2px solid ${alpha(t.fg, 0.45)}`, flexShrink: 0 }}>
        <Icon name={it.icon} size={38} color={t.fg} />
      </div>
      <div style={{ width: 880 }}>
        <div style={{ fontSize: 38, fontWeight: 800, color: C.textStrong, lineHeight: 1.1 }}>{it.name}</div>
        <div style={{ fontSize: 28, fontWeight: 600, color: t.soft, lineHeight: 1.15 }}>{it.does}</div>
      </div>
      <div style={{ marginLeft: 'auto', display: 'flex', gap: 12 }}>
        {FIELDS.map((f) => (
          <span key={f} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: RADIUS.pill, border: `2px dashed ${alpha(C.amber, 0.5 + 0.4 * chk)}`, background: alpha(C.amber, 0.05 + 0.1 * chk), fontSize: 28, fontWeight: 700, color: chk > 0 ? '#fcd34d' : C.muted }}>
            {f}
            <span style={{ fontWeight: 850, color: C.amber }}>?</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/**
 * s03-caso «No todas las credenciales abren igual». The intercepted message (one insufficient action) owns
 * the top band until s03-02, so the four rows start below it: password and cookie as the voice names them,
 * then access and renewal tokens. Resource, validity and controls stay as pending fields (never a value). At
 * s03-05 the password row is marked «necesario, no suficiente»; at s03-06 the fields light as the checks to
 * make, with the warning against testing an exposed credential.
 */
export function S03Credenciales(props: SceneProps) {
  const frame = useCurrentFrame();
  const at = (id: string) => segment(props, id).from;
  const rowAt = [wordFrame(S, 's03-01', 'contraseña') - 12, wordFrame(S, 's03-01', 'cookie') - 14, at('s03-02') - 4, at('s03-03') - 4];
  const insufficient = wordFrame(S, 's03-05', 'insuficiente') - 30;
  const checks = wordFrame(S, 's03-06', 'comprueba') - 6;
  const identify = wordFrame(S, 's03-05', 'Identifica') - 6;
  const focus = [progress(frame, insufficient, 14) * (1 - progress(frame, identify, 14)), 0, 0, 0];

  return (
    <Stage>
      <div style={{ position: 'absolute', left: 0, top: TOP }}>
        {ITEMS.map((_, i) => (
          <Row key={i} frame={frame} i={i} at={rowAt[i]} checkAt={checks} focus={focus[i]} />
        ))}
      </div>
      <Reveal frame={frame} at={insufficient} outAt={checks} x={650} y={TOP + 22} w={470}>
        <Pill icon="alert" tone="amber" size={26}>necesario, pero insuficiente</Pill>
      </Reveal>
      <Reveal frame={frame} at={identify} outAt={checks} x={0} y={TOP + 4 * (ROW_H + ROW_GAP) + 4} w={1728}>
        <div style={{ display: 'flex', gap: 18 }}>
          <Pill icon="search" tone="cyan" size={34}>identifica el artefacto</Pill>
          <Pill icon="shield" tone="cyan" size={34}>identifica su emisor</Pill>
        </div>
      </Reveal>
      <Reveal frame={frame} at={checks} x={0} y={TOP + 4 * (ROW_H + ROW_GAP) + 4} w={1728}>
        <Note icon="x" tone="rose" size={32} w={1728}>sin probar una credencial expuesta contra el servicio</Note>
      </Reveal>
    </Stage>
  );
}

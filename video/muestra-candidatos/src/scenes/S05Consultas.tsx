import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { progress } from '../../../engine/src/theme/motion';
import { Icon } from '../../../engine/src/ui/Icon';
import { Pill, Reveal } from './parts/bits';
import { Stage, segment, wordFrame } from './kit';

const S = 's05-caso';
const ROW_H = 76;
const ROW_Y = 92 + 64 + 8;

// Illustrative syntax only: placeholder values, never executed.
const QUERIES = [
  { mod: 'imphash', val: '11111111111111111111111111111111', q: '¿mismos imports?' },
  { mod: 'content', val: '"cicada-demo-v1"', q: '¿contiene esta cadena?' },
  { mod: 'metadata', val: '"ldr.pdb"', q: '¿aparece esta ruta?' },
  { mod: 'signature', val: '"Meridian Demo Signing"', q: '¿qué firma lleva?' },
] as const;

/**
 * s05-caso «La consulta conserva su pregunta». Hash of an existing report (no upload), then the four
 * illustrative queries one per word the voice says, each tied to the question it answers. Content row = candidates
 * that contain the string; metadata row = open the result and check what matched. Then what the access depends on,
 * the fallback (exercise fichas, public reports) and the closing reassurance.
 */
export function S05Consultas(props: SceneProps) {
  const frame = useCurrentFrame();
  const at = (id: string) => segment(props, id).from;
  const w = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);
  const rowAt = [w('s05-02', 'imports,') - 8, w('s05-02', 'contenido,') - 8, w('s05-02', 'metadatos') - 8, w('s05-02', 'claves.') - 4];
  const qAt = [w('s05-03', 'pregunta') - 8, w('s05-03', 'pregunta') + 4, w('s05-03', 'pregunta') + 16, w('s05-03', 'pregunta') + 28];
  const content = progress(frame, w('s05-03', 'cadena') - 4, 14) * (1 - progress(frame, at('s05-04'), 14));
  const meta = progress(frame, w('s05-04', 'metadatos'), 14) * (1 - progress(frame, at('s05-05'), 14));
  const avail = at('s05-05');
  const dim = progress(frame, avail - 6, 22) * 0.62;
  const end = at('s05-07');
  const dimEnd = progress(frame, end - 6, 22);
  const upper = 1 - Math.max(dim, 0.62 * dimEnd) - 0.28 * dimEnd;

  return (
    <Stage>
      <Reveal frame={frame} at={at('s05-01')} x={0} y={0}>
        <Pill icon="search" tone="emerald" size={32}>partir del hash de un informe existente</Pill>
      </Reveal>
      <Reveal frame={frame} at={w('s05-01', 'subir')} x={760} y={0}>
        <Pill icon="x" tone="muted" size={32}>no es subir el archivo</Pill>
      </Reveal>

      {/* the four illustrative queries */}
      <div style={{ position: 'absolute', left: 0, top: 92, opacity: upper }}>
        <Reveal frame={frame} at={w('s05-02', 'avanzadas') - 8} x={0} y={0} w={1100}>
          <div style={{ boxSizing: 'border-box', width: 1100, height: 64 + QUERIES.length * ROW_H + 16, borderRadius: RADIUS.lg, border: `2px solid ${alpha(C.sky, 0.5)}`, background: C.ink900, fontFamily: FONT.sans }}>
            <div style={{ boxSizing: 'border-box', height: 64, display: 'flex', alignItems: 'center', gap: 14, padding: '0 24px', background: alpha(C.sky, 0.1), borderBottom: `2px solid ${C.ink700}`, borderRadius: `${RADIUS.lg}px ${RADIUS.lg}px 0 0` }}>
              <Icon name="terminal" size={36} color={C.sky} />
              <span style={{ fontSize: 32, fontWeight: 800, color: '#7dd3fc' }}>Búsqueda avanzada</span>
              <span style={{ marginLeft: 'auto', opacity: progress(frame, w('s05-02', 'ilustrativas.') - 14, 14) }}>
                <Pill tone="amber" size={26}>ilustrativas · valores inventados · no se ejecutan</Pill>
              </span>
            </div>
          </div>
        </Reveal>
      </div>
      {QUERIES.map((q, i) => {
        const p = progress(frame, rowAt[i], 14);
        const hi = i === 1 ? content : i === 2 ? meta : 0;
        const qp = progress(frame, qAt[i], 14);
        return (
          <div key={q.mod} style={{ opacity: upper }}>
            <div
              style={{
                position: 'absolute',
                left: 18,
                top: ROW_Y + i * ROW_H,
                width: 1064,
                height: ROW_H - 10,
                boxSizing: 'border-box',
                display: 'flex',
                alignItems: 'center',
                padding: '0 22px',
                borderRadius: RADIUS.sm,
                background: hi > 0 ? alpha(C.cyan, 0.1 + 0.05 * hi) : C.ink950,
                border: `2px solid ${alpha(hi > 0 ? C.cyan : C.ink600, hi > 0 ? 0.9 : 1)}`,
                opacity: p,
                transform: `translateX(${(1 - p) * -16}px)`,
                fontFamily: FONT.mono,
                fontSize: 32,
                fontWeight: 600,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
              }}
            >
              <span style={{ color: C.cyan }}>{q.mod}:</span>
              <span style={{ color: C.text }}>{q.val}</span>
            </div>
            <div style={{ position: 'absolute', left: 1130, top: ROW_Y + i * ROW_H + 3, opacity: qp, transform: `translateX(${(1 - qp) * 12}px)` }}>
              <Pill icon="search" tone={i === 2 && meta > 0 ? 'amber' : 'sky'} size={30}>{i === 2 && meta > 0 ? 'también otros campos' : q.q}</Pill>
            </div>
          </div>
        );
      })}
      <Reveal frame={frame} at={w('s05-03', 'contienen.') - 40} outAt={at('s05-04')} x={1130} y={ROW_Y + 4 * ROW_H + 16}>
        <Pill icon="users" tone="cyan" size={28}>recupera candidatos que la contienen</Pill>
      </Reveal>
      <Reveal frame={frame} at={w('s05-04', 'Abre')} outAt={avail} x={0} y={ROW_Y + 4 * ROW_H + 16} w={1100}>
        <Pill icon="eye" tone="amber" size={30}>abre el resultado y comprueba qué coincidió</Pill>
      </Reveal>

      {/* availability and fallback */}
      <Reveal frame={frame} at={avail} outAt={end - 4} x={0} y={548} w={1728}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <span style={{ fontFamily: FONT.sans, fontSize: 32, fontWeight: 800, color: C.textStrong }}>El acceso depende de</span>
          {[
            ['server', 'el producto', w('s05-05', 'producto,')],
            ['lock', 'los permisos', w('s05-05', 'permisos')],
            ['database', 'los datos disponibles', w('s05-05', 'datos')],
          ].map(([icon, t, f]) => (
            <span key={t} style={{ opacity: progress(frame, (f as number) - 6, 14) }}>
              <Pill icon={icon as 'lock'} tone="sky" size={30}>{t}</Pill>
            </span>
          ))}
        </div>
      </Reveal>
      <Reveal frame={frame} at={at('s05-06')} outAt={end - 4} x={0} y={604} w={1728}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <span style={{ fontFamily: FONT.sans, fontSize: 32, fontWeight: 800, color: C.textStrong }}>Sin esas funciones</span>
          <span style={{ opacity: progress(frame, w('s05-06', 'fichas') - 8, 14) }}>
            <Pill icon="archive" tone="emerald" size={30}>fichas del ejercicio</Pill>
          </span>
          <span style={{ opacity: progress(frame, w('s05-06', 'informes') - 8, 14) }}>
            <Pill icon="globe" tone="emerald" size={30}>informes públicos con procedencia</Pill>
          </span>
        </div>
      </Reveal>
      <Reveal frame={frame} at={end} x={0} y={540} w={1728}>
        <div style={{ display: 'flex', gap: 24 }}>
          <Pill icon="check" tone="emerald" size={34}>practicar el razonamiento sin pagar</Pill>
          <span style={{ opacity: progress(frame, w('s05-07', 'subir') - 8, 14) }}>
            <Pill icon="eyeOff" tone="emerald" size={34}>sin subir datos sensibles</Pill>
          </span>
        </div>
      </Reveal>
    </Stage>
  );
}

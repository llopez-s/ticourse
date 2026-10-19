import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { progress } from '../../../engine/src/theme/motion';
import { windowWeight } from '../../../engine/src/ui/Focus';
import { Mark, Pill, Reveal, Tag } from './parts/bits';
import { Stage, segment, wordFrame } from './kit';

const S = 's03-caso';
const TOP = 180; // the engine's intercepted-message card owns the first 170 px of the stage
const HEAD_H = 50;
const ROW_H = 56;
const COLS = { file: 360, want: 180, got: 180, read: 180 } as const;
const X_WANT = COLS.file;
const X_GOT = X_WANT + COLS.want;
const X_READ = X_GOT + COLS.got;

const ROWS = [
  { label: 'A', target: true },
  { label: 'B', target: true },
  { label: 'C', target: true },
  { label: 'control: ruta sola', target: false },
  { label: 'control: marcador solo', target: false },
  { label: 'control: bytes sueltos', target: false },
  { label: 'manual con las cadenas', target: false },
];

function Head({ label, x, w, lit }: { label: string; x: number; w: number; lit: number }) {
  return (
    <div style={{ position: 'absolute', left: x, top: 0, width: w, height: HEAD_H, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase', color: lit > 0 ? C.cyanSoft : C.faint, borderBottom: `3px solid ${alpha(C.cyan, 0.15 + 0.75 * lit)}`, background: alpha(C.cyan, 0.1 * lit) }}>
      {label}
    </div>
  );
}

function Quad({ frame, at, lit, tone, abbr, name, x, y }: { frame: number; at: number; lit: number; tone: string; abbr: string; name: string; x: number; y: number }) {
  const p = progress(frame, at, 14);
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: 300, height: 120, boxSizing: 'border-box', padding: '10px 16px', borderRadius: RADIUS.md, background: alpha(tone, 0.06 + 0.12 * lit), border: `2px solid ${alpha(tone, 0.3 + 0.65 * lit)}`, boxShadow: lit > 0 ? `0 0 ${18 + 22 * lit}px ${alpha(tone, 0.3 * lit)}` : 'none', opacity: p * (0.55 + 0.45 * Math.max(lit, 0)), transform: `translateY(${(1 - p) * 12}px)` }}>
      <div style={{ fontFamily: FONT.mono, fontSize: 46, fontWeight: 800, color: tone, lineHeight: 1.1 }}>{abbr}</div>
      <div style={{ marginTop: 4, fontSize: 26, fontWeight: 650, color: C.text, whiteSpace: 'nowrap' }}>{name}</div>
    </div>
  );
}

/**
 * s03-caso «Acertar algo y detectar de más». Matrix per file (A, B, C and four controls): what was expected, what
 * a naive rule (any string) returned, and the reading. Rows and the expected column enter first; «la regla lo
 * acepta» fills the obtained column; «falso positivo» marks the four controls. A 2×2 legend keeps TP / FP / FN / TN
 * defined on screen and lights one cell as the voice names it. Controls light one by one, then the three column
 * heads as the voice says esperaba / ocurrió / por qué. Everything starts below the intercepted-message card.
 */
export function S03Errores(props: SceneProps) {
  const frame = useCurrentFrame();
  const at = (id: string) => segment(props, id).from;
  const w = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);

  const tRows = w('s03-01', 'coincidencias') - 10;
  const tGot = w('s03-01', 'acepta');
  const tFP = w('s03-01', 'falso');
  const tFN = w('s03-02', 'falso');
  const tLegend = w('s03-01', 'objetivo') - 6;

  const fpLit = windowWeight(frame, tFP, tFN - 4);
  const fnLit = windowWeight(frame, tFN, at('s03-03') - 4);
  const rowLit = [
    0,
    0,
    0,
    Math.max(windowWeight(frame, w('s03-03', 'ruta'), w('s03-03', 'marcador')), windowWeight(frame, w('s03-04', 'aceptas'), w('s03-05', 'revisas'))),
    Math.max(windowWeight(frame, w('s03-03', 'marcador'), w('s03-03', 'bytes')), windowWeight(frame, w('s03-04', 'aceptas'), w('s03-05', 'revisas'))),
    Math.max(windowWeight(frame, w('s03-03', 'bytes'), w('s03-03', 'condición')), windowWeight(frame, w('s03-04', 'aceptas'), w('s03-05', 'revisas'))),
    windowWeight(frame, w('s03-04', 'aceptas'), w('s03-05', 'revisas')),
  ];
  const negBracket = windowWeight(frame, w('s03-05', 'negativos'), w('s03-06', 'verificador'));
  const headWant = Math.max(windowWeight(frame, w('s03-02', 'objetivo'), at('s03-03') - 4), windowWeight(frame, w('s03-05', 'esperaba'), w('s03-05', 'ocurrió')));
  const headGot = windowWeight(frame, w('s03-05', 'ocurrió'), w('s03-05', 'por', 1));
  const headRead = windowWeight(frame, w('s03-05', 'por', 1), at('s03-06'));
  const sixOut = at('s03-06') - 6;

  return (
    <Stage>
      {/* matrix */}
      <div style={{ position: 'absolute', left: 0, top: TOP, width: 900, height: HEAD_H + ROWS.length * ROW_H, fontFamily: FONT.sans }}>
        <Reveal frame={frame} at={tRows} x={0} y={0} w={900} distance={8}>
          <div style={{ position: 'relative', width: 900, height: HEAD_H }}>
            <Head label="Archivo" x={0} w={COLS.file} lit={0} />
            <Head label="Esperado" x={X_WANT} w={COLS.want} lit={headWant} />
            <Head label="Obtenido" x={X_GOT} w={COLS.got} lit={headGot} />
            <Head label="Lectura" x={X_READ} w={COLS.read} lit={headRead} />
          </div>
        </Reveal>
        {ROWS.map((r, i) => {
          const rowAt = tRows + 8 + i * 5;
          const gotAt = tGot + i * 5;
          const lit = rowLit[i];
          const kind = r.target ? 'TP' : 'FP';
          const tagAt = tFP + (r.target ? 8 : i * 3);
          return (
            <Reveal key={r.label} frame={frame} at={rowAt} x={0} y={HEAD_H + i * ROW_H} w={900} h={ROW_H} distance={10}>
              <div style={{ position: 'relative', width: 900, height: ROW_H, boxSizing: 'border-box', borderBottom: `2px solid ${C.ink700}`, background: alpha(C.amber, 0.14 * lit), outline: lit > 0.5 ? `2px solid ${alpha(C.amber, 0.7 * lit)}` : 'none', outlineOffset: -2 }}>
                <div style={{ position: 'absolute', left: 18, top: 0, height: ROW_H, display: 'flex', alignItems: 'center', fontSize: r.target ? 34 : 28, fontWeight: r.target ? 850 : 650, color: r.target ? C.cyanSoft : C.text }}>{r.label}</div>
                <div style={{ position: 'absolute', left: X_WANT, top: 0, width: COLS.want, height: ROW_H, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, fontSize: 28, fontWeight: 750, color: r.target ? C.cyanSoft : C.muted }}>
                  <Mark kind={r.target ? 'yes' : 'none'} size={36} color={r.target ? C.cyan : undefined} />
                  {r.target ? 'sí' : 'no'}
                </div>
                <div style={{ position: 'absolute', left: X_GOT, top: 0, width: COLS.got, height: ROW_H, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, fontSize: 28, fontWeight: 750, color: C.text, opacity: progress(frame, gotAt, 12) }}>
                  <Mark kind="yes" size={36} color={r.target ? C.emerald : C.amber} />
                  sí
                </div>
                <div style={{ position: 'absolute', left: X_READ, top: 0, width: COLS.read, height: ROW_H, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: progress(frame, tagAt, 12) }}>
                  <Tag tone={r.target ? C.emerald : C.amber} size={30} solid={!r.target}>{kind}</Tag>
                </div>
              </div>
            </Reveal>
          );
        })}
        {negBracket > 0 ? (
          <div style={{ position: 'absolute', left: -10, top: HEAD_H + 3 * ROW_H - 4, width: 920, height: 4 * ROW_H + 8, borderRadius: RADIUS.md, border: `3px dashed ${alpha(C.amber, 0.8 * negBracket)}`, opacity: negBracket, pointerEvents: 'none' }} />
        ) : null}
      </div>

      {/* naive rule + definitions */}
      <Reveal frame={frame} at={tGot - 22} x={960} y={TOP} w={768}>
        <Pill icon="search" tone="amber" size={30}>regla ingenua: basta con cualquier cadena</Pill>
      </Reveal>
      <div style={{ position: 'absolute', left: 960, top: TOP + 76, width: 768, height: 330, fontFamily: FONT.sans }}>
        <Reveal frame={frame} at={tLegend} x={0} y={0} w={768} distance={8}>
          <div style={{ position: 'relative', width: 768, height: 330 }}>
            <div style={{ position: 'absolute', left: 130, top: 0, width: 300, textAlign: 'center', fontSize: 26, fontWeight: 700, color: C.muted }}>la regla coincide</div>
            <div style={{ position: 'absolute', left: 444, top: 0, width: 300, textAlign: 'center', fontSize: 26, fontWeight: 700, color: C.muted }}>no coincide</div>
            <div style={{ position: 'absolute', left: 0, top: 48, width: 118, height: 120, display: 'flex', alignItems: 'center', fontSize: 26, fontWeight: 700, lineHeight: 1.15, color: C.cyanSoft }}>debía entrar</div>
            <div style={{ position: 'absolute', left: 0, top: 182, width: 118, height: 120, display: 'flex', alignItems: 'center', fontSize: 26, fontWeight: 700, lineHeight: 1.15, color: C.muted }}>no debía entrar</div>
          </div>
        </Reveal>
        <Quad frame={frame} at={tLegend + 6} lit={0} tone={C.emerald} abbr="TP" name="verdadero positivo" x={130} y={48} />
        <Quad frame={frame} at={tLegend + 12} lit={fnLit} tone={C.rose} abbr="FN" name="falso negativo" x={444} y={48} />
        <Quad frame={frame} at={tLegend + 18} lit={fpLit} tone={C.amber} abbr="FP" name="falso positivo" x={130} y={182} />
        <Quad frame={frame} at={tLegend + 24} lit={0} tone={C.muted} abbr="TN" name="verdadero negativo" x={444} y={182} />
      </div>

      <Reveal frame={frame} at={w('s03-04', 'ampliado') - 20} outAt={sixOut} x={960} y={TOP + 436} w={768}>
        <Pill icon="alert" tone="amber" size={30}>4 coincidencias de más, 0 variantes nuevas</Pill>
      </Reveal>
      <Reveal frame={frame} at={at('s03-06') + 8} x={960} y={TOP + 436} w={768}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Tag tone={C.amber} size={30} solid>exit 1</Tag>
          <Pill icon="x" tone="rose" size={28}>falla si hay discrepancias</Pill>
        </div>
      </Reveal>
    </Stage>
  );
}

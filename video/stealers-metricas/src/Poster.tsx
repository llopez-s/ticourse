import { AbsoluteFill } from 'remotion';
import { ensureFonts } from '../../engine/src/theme/fonts';
import { C, FONT, LAYOUT, TYPE, alpha } from '../../engine/src/theme/tokens';
import { Backdrop } from '../../engine/src/ui/Backdrop';
import { Chip } from '../../engine/src/ui/Chip';
import { BrandMark } from '../../engine/src/overlay/ChapterRail';
import { FAMILIES, type Metric } from './scenes/parts/data';

ensureFonts();

const COLUMNS: { metric: Metric; label: string }[] = [
  { metric: 'muestras', label: 'Muestras' },
  { metric: 'dispositivos', label: 'Dispositivos' },
  { metric: 'registros', label: 'Registros' },
];
const CH_W = 250;
const CH_H = 430;
const BAR_W = 62;

/**
 * Poster / YouTube thumbnail for «El infostealer número uno depende de qué estés contando». Title on the left;
 * on the right the same three families in three columns of bars (scaled to each column's own maximum): the
 * tallest bar changes family from one column to the next.
 */
export function Poster() {
  const left = LAYOUT.marginX;
  return (
    <AbsoluteFill style={{ fontFamily: FONT.sans, color: C.text }}>
      <Backdrop />
      <div style={{ position: 'absolute', left: 1030, top: 230, width: 810, height: 640 }}>
        {COLUMNS.map((col, ci) => {
          const max = Math.max(...FAMILIES.map((f) => f[col.metric]));
          const best = FAMILIES.findIndex((f) => f[col.metric] === max);
          return (
            <div key={col.metric} style={{ position: 'absolute', left: ci * (CH_W + 30), top: 0, width: CH_W }}>
              <div style={{ position: 'relative', width: CH_W, height: CH_H, borderBottom: `4px solid ${C.ink600}` }}>
                {FAMILIES.map((f, fi) => {
                  const h = Math.max(14, (f[col.metric] / max) * (CH_H - 30));
                  const win = fi === best;
                  return (
                    <div key={f.id} style={{ position: 'absolute', left: 10 + fi * (BAR_W + 12), bottom: 0, width: BAR_W, height: h, borderRadius: '10px 10px 0 0', background: alpha(f.color, win ? 0.95 : 0.4), border: `3px solid ${alpha(f.color, win ? 1 : 0.6)}`, borderBottom: 'none', boxShadow: win ? `0 0 34px ${alpha(f.color, 0.45)}` : 'none' }} />
                  );
                })}
              </div>
              <div style={{ marginTop: 18, textAlign: 'center', fontSize: 33, fontWeight: 800, color: C.textStrong }}>{col.label}</div>
              <div style={{ marginTop: 6, textAlign: 'center', fontSize: 30, fontWeight: 800, color: FAMILIES[best].color }}>{FAMILIES[best].name}</div>
            </div>
          );
        })}
        <div style={{ position: 'absolute', left: 0, top: 575, width: 810, textAlign: 'center', fontSize: 28, fontWeight: 600, color: C.muted }}>
          tres columnas de la misma tabla, tres ganadores
        </div>
      </div>

      <div style={{ position: 'absolute', left, top: 250, display: 'flex', alignItems: 'center', gap: 16 }}>
        <BrandMark size={30} />
        <span style={{ fontSize: TYPE.small, fontWeight: 800, letterSpacing: 5, color: C.cyanSoft }}>ALERTÓPOLIS</span>
      </div>
      <div style={{ position: 'absolute', left: left - 6, top: 298, fontWeight: 850, letterSpacing: -2.5, color: C.textStrong }}>
        <div style={{ fontSize: 112, lineHeight: 1.04, whiteSpace: 'nowrap' }}>El infostealer</div>
        <div style={{ fontSize: 112, lineHeight: 1.04, color: C.cyan, whiteSpace: 'nowrap' }}>número uno</div>
      </div>
      <div style={{ position: 'absolute', left, top: 562, fontSize: 50, fontWeight: 650, lineHeight: 1.2, color: C.text, whiteSpace: 'nowrap' }}>depende de qué estés contando</div>
      <div style={{ position: 'absolute', left, top: 676, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 16 }}>
        <div style={{ display: 'flex', gap: 14 }}>
          <Chip accent="amber" icon="flag" size={30}>Práctica complementaria</Chip>
          <Chip accent="muted" icon="clock" size={30}>~9 min</Chip>
        </div>
        <Chip accent="muted" size={26} style={{ color: C.muted }}>Datos ficticios</Chip>
      </div>
      <div style={{ position: 'absolute', left, top: 986, fontSize: TYPE.micro, fontWeight: 550, color: C.faint }}>
        Material independiente, no afiliado a SANS/GIAC.
      </div>
    </AbsoluteFill>
  );
}

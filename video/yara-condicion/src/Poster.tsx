import { AbsoluteFill } from 'remotion';
import { ensureFonts } from '../../engine/src/theme/fonts';
import { C, FONT, LAYOUT, TYPE, alpha } from '../../engine/src/theme/tokens';
import { Backdrop } from '../../engine/src/ui/Backdrop';
import { Chip } from '../../engine/src/ui/Chip';
import { BrandMark } from '../../engine/src/overlay/ChapterRail';

ensureFonts();

const ROWS = [
  { label: 'A', bytes: ['41', '4C', '52', '54', '22', '7F'], color: C.muted },
  { label: 'C', bytes: ['41', '4C', '52', '54', '99', '7F'], color: C.muted },
  { label: '$hex', bytes: ['41', '4C', '52', '54', '??', '7F'], color: C.cyan },
] as const;

/**
 * Poster / YouTube thumbnail for «Escribir YARA: qué debe coincidir y qué puede cambiar». Title on the left; on the
 * right, the bytes of two inert files that differ in one position and the pattern that lets exactly that one vary.
 */
export function Poster() {
  const left = LAYOUT.marginX;
  return (
    <AbsoluteFill style={{ fontFamily: FONT.sans, color: C.text }}>
      <Backdrop />
      <div style={{ position: 'absolute', left: 1010, top: 250, width: 830 }}>
        {ROWS.map((r, ri) => (
          <div key={r.label} style={{ marginBottom: ri === 1 ? 54 : 30 }}>
            <div style={{ fontSize: 40, fontWeight: 800, fontFamily: FONT.mono, color: r.color === C.cyan ? C.cyanSoft : C.muted, marginBottom: 12 }}>{r.label}</div>
            <div style={{ display: 'flex', gap: 14 }}>
              {r.bytes.map((b, i) => {
                const hot = i === 4;
                const col = hot ? (ri === 2 ? C.cyan : C.amber) : C.ink600;
                return (
                  <div key={i} style={{ boxSizing: 'border-box', width: 120, height: 104, display: 'grid', placeItems: 'center', borderRadius: 16, fontFamily: FONT.mono, fontSize: 52, fontWeight: 800, color: hot ? C.textStrong : C.text, background: hot ? alpha(col, 0.2) : C.ink850, border: `4px solid ${hot ? col : C.ink700}`, boxShadow: hot ? `0 0 34px ${alpha(col, 0.5)}` : 'none' }}>
                    {b}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div style={{ position: 'absolute', left, top: 250, display: 'flex', alignItems: 'center', gap: 16 }}>
        <BrandMark size={30} />
        <span style={{ fontSize: TYPE.small, fontWeight: 800, letterSpacing: 5, color: C.cyanSoft }}>ALERTÓPOLIS</span>
      </div>
      <div style={{ position: 'absolute', left: left - 6, top: 298, fontWeight: 850, letterSpacing: -2.5, color: C.textStrong }}>
        <div style={{ fontSize: 124, lineHeight: 1.04, whiteSpace: 'nowrap' }}>Escribir YARA</div>
        <div style={{ fontSize: 84, lineHeight: 1.1, color: C.cyan, whiteSpace: 'nowrap' }}>qué debe coincidir</div>
      </div>
      <div style={{ position: 'absolute', left, top: 570, fontSize: 50, fontWeight: 650, lineHeight: 1.2, color: C.text, whiteSpace: 'nowrap' }}>y qué puede cambiar</div>
      <div style={{ position: 'absolute', left, top: 680, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 16 }}>
        <div style={{ display: 'flex', gap: 14 }}>
          <Chip accent="amber" icon="flag" size={30}>Práctica complementaria</Chip>
          <Chip accent="muted" icon="clock" size={30}>~9 min</Chip>
        </div>
        <Chip accent="muted" size={26} style={{ color: C.muted }}>Datos ficticios · corpus inerte</Chip>
      </div>
      <div style={{ position: 'absolute', left, top: 986, fontSize: TYPE.micro, fontWeight: 550, color: C.faint }}>
        Material independiente, no afiliado a SANS/GIAC.
      </div>
    </AbsoluteFill>
  );
}

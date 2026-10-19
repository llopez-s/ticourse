import { AbsoluteFill } from 'remotion';
import { ensureFonts } from '../../engine/src/theme/fonts';
import { C, FONT, LAYOUT, TYPE, alpha } from '../../engine/src/theme/tokens';
import { Backdrop } from '../../engine/src/ui/Backdrop';
import { Chip } from '../../engine/src/ui/Chip';
import { Icon } from '../../engine/src/ui/Icon';
import { BrandMark } from '../../engine/src/overlay/ChapterRail';
import { CASES } from './scenes/parts/data';

ensureFonts();

const TILE_W = 190;
const TILE_H = 150;
const GAP = 20;

/**
 * Poster / YouTube thumbnail for «Tu YARA compila: ahora demuestra qué detecta». Title on the left; on the right
 * the twelve cases of the package as a grid — cyan where the rule must match, grey where it must not — and one
 * amber dashed tile for the known limit, so the picture says «12 de 12, con denominador».
 */
export function Poster() {
  const left = LAYOUT.marginX;
  return (
    <AbsoluteFill style={{ fontFamily: FONT.sans, color: C.text }}>
      <Backdrop />
      <div style={{ position: 'absolute', left: 1020, top: 200, width: 4 * TILE_W + 3 * GAP, height: 3 * TILE_H + 2 * GAP }}>
        {CASES.map((c, i) => {
          const hit = c.hits.length > 0;
          const limit = c.file === 'future-uncovered.dat';
          const col = limit ? C.amber : hit ? C.cyan : C.muted;
          return (
            <div
              key={c.file}
              style={{
                position: 'absolute',
                left: (i % 4) * (TILE_W + GAP),
                top: Math.floor(i / 4) * (TILE_H + GAP),
                width: TILE_W,
                height: TILE_H,
                boxSizing: 'border-box',
                borderRadius: 22,
                display: 'grid',
                placeItems: 'center',
                background: alpha(col, limit ? 0.14 : hit ? 0.12 : 0.05),
                border: `3px ${limit ? 'dashed' : 'solid'} ${alpha(col, limit ? 0.95 : hit ? 0.8 : 0.4)}`,
              }}
            >
              <Icon name={limit ? 'alert' : hit ? 'check' : 'file'} size={limit ? 76 : 66} color={col} strokeWidth={limit ? 2.4 : 2.8} />
            </div>
          );
        })}
      </div>
      <div style={{ position: 'absolute', left: 1020, top: 200 + 3 * TILE_H + 2 * GAP + 36, display: 'flex', gap: 14 }}>
        <Chip accent="cyan" size={30}>debe coincidir</Chip>
        <Chip accent="muted" size={30}>debe quedar fuera</Chip>
        <Chip accent="amber" size={30}>límite conocido</Chip>
      </div>

      <div style={{ position: 'absolute', left, top: 250, display: 'flex', alignItems: 'center', gap: 16 }}>
        <BrandMark size={30} />
        <span style={{ fontSize: TYPE.small, fontWeight: 800, letterSpacing: 5, color: C.cyanSoft }}>ALERTÓPOLIS</span>
      </div>
      <div style={{ position: 'absolute', left: left - 6, top: 298, fontWeight: 850, letterSpacing: -2.5, color: C.textStrong }}>
        <div style={{ fontSize: 112, lineHeight: 1.04, whiteSpace: 'nowrap' }}>Tu YARA compila</div>
        <div style={{ fontSize: 112, lineHeight: 1.04, color: C.cyan, whiteSpace: 'nowrap' }}>¿qué detecta?</div>
      </div>
      <div style={{ position: 'absolute', left, top: 562, fontSize: 50, fontWeight: 650, lineHeight: 1.2, color: C.text, whiteSpace: 'nowrap' }}>compilar no es validar</div>
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

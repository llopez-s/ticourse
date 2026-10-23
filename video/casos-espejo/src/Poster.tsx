import { AbsoluteFill } from 'remotion';
import { ensureFonts } from '../../engine/src/theme/fonts';
import { C, FONT, LAYOUT, TYPE, alpha } from '../../engine/src/theme/tokens';
import { Backdrop } from '../../engine/src/ui/Backdrop';
import { Chip } from '../../engine/src/ui/Chip';
import { Icon } from '../../engine/src/ui/Icon';
import { BrandMark } from '../../engine/src/overlay/ChapterRail';

ensureFonts();

const CASES = ['MOONLIGHT MAZE', 'APT1', 'Sony Pictures', 'DNC', 'APT10 / Cloud Hopper'] as const;
const CARD_W = 700;
const CARD_H = 142;
const STEP = 150;
const STACK_X = 1040;
const STACK_Y = 140;

/**
 * Poster / YouTube thumbnail for «Cinco casos históricos y lo que enseñó cada uno». Big title on the
 * left («Cinco» huge in cyan, the rest in two lines); on the right the video's driving image: five case
 * folders fanned in a stack, one name each, no year, flag or logo. The tag says «Casos reales · análisis
 * educativo» (the video's own label), never the engine's «datos ficticios».
 */
export function Poster() {
  const left = LAYOUT.marginX;
  return (
    <AbsoluteFill style={{ fontFamily: FONT.sans, color: C.text }}>
      <Backdrop />

      {/* soft halo behind the folders */}
      <div style={{ position: 'absolute', left: STACK_X - 200, top: STACK_Y - 120, width: CARD_W + 400, height: STEP * 5 + 300, background: `radial-gradient(closest-side, ${alpha(C.sky, 0.14)} 0%, transparent 100%)` }} />
      {CASES.map((name, i) => (
        <div
          key={name}
          style={{
            position: 'absolute',
            left: STACK_X + (i % 2 === 0 ? -16 : 24),
            top: STACK_Y + i * STEP,
            width: CARD_W,
            height: CARD_H,
            transform: `rotate(${(i - 2) * 1.6}deg)`,
            boxSizing: 'border-box',
            borderRadius: 24,
            border: `4px solid ${alpha(C.sky, 0.8)}`,
            background: `linear-gradient(180deg, ${alpha(C.sky, 0.22)} 0%, ${C.ink900} 100%)`,
            boxShadow: `0 24px 50px ${alpha('#000000', 0.5)}`,
            display: 'flex',
            alignItems: 'center',
            gap: 24,
            padding: '0 34px',
          }}
        >
          <Icon name="archive" size={56} color={C.sky} strokeWidth={2} />
          <span style={{ fontSize: name.length > 16 ? 50 : 58, fontWeight: 900, letterSpacing: -1, color: C.textStrong, whiteSpace: 'nowrap' }}>{name}</span>
        </div>
      ))}

      {/* brand */}
      <div style={{ position: 'absolute', left, top: 214, display: 'flex', alignItems: 'center', gap: 16 }}>
        <BrandMark size={30} />
        <span style={{ fontSize: TYPE.small, fontWeight: 800, letterSpacing: 5, color: C.cyanSoft }}>ALERTÓPOLIS</span>
      </div>

      {/* title */}
      <div style={{ position: 'absolute', left: left - 8, top: 252, fontWeight: 850, letterSpacing: -2.5, color: C.textStrong }}>
        <div style={{ fontSize: 176, lineHeight: 1, color: C.cyan, whiteSpace: 'nowrap', textShadow: `0 0 40px ${alpha(C.cyan, 0.3)}` }}>Cinco casos</div>
        <div style={{ marginTop: 10, fontSize: 118, lineHeight: 1.02, whiteSpace: 'nowrap' }}>históricos</div>
        <div style={{ marginTop: 18, fontSize: 66, lineHeight: 1.06, whiteSpace: 'nowrap', color: C.text }}>y lo que enseñó cada uno</div>
      </div>

      {/* chips */}
      <div style={{ position: 'absolute', left, top: 760, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 16 }}>
        <div style={{ display: 'flex', gap: 14 }}>
          <Chip accent="violet" icon="mortarboard" size={30}>
            GCTI · Dissemination
          </Chip>
          <Chip accent="muted" icon="clock" size={30}>
            ~8 min
          </Chip>
        </div>
        <Chip accent="muted" size={26} style={{ color: C.muted }}>
          Casos reales · análisis educativo
        </Chip>
      </div>

      {/* disclaimer */}
      <div style={{ position: 'absolute', left, top: 986, fontSize: TYPE.micro, fontWeight: 550, color: C.faint }}>
        Material independiente, no afiliado a SANS/GIAC.
      </div>
    </AbsoluteFill>
  );
}

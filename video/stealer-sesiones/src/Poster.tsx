import { AbsoluteFill } from 'remotion';
import { ensureFonts } from '../../engine/src/theme/fonts';
import { C, FONT, LAYOUT, TYPE, alpha } from '../../engine/src/theme/tokens';
import { Backdrop } from '../../engine/src/ui/Backdrop';
import { Chip } from '../../engine/src/ui/Chip';
import { Icon, type IconName } from '../../engine/src/ui/Icon';
import { BrandMark } from '../../engine/src/overlay/ChapterRail';

ensureFonts();

const OPEN = [
  { icon: 'globe', label: 'Cookie de sesión', color: C.amber },
  { icon: 'key', label: 'Token de acceso', color: C.sky },
  { icon: 'plug', label: 'Token de renovación', color: '#fb923c' },
] as const satisfies readonly { icon: IconName; label: string; color: string }[];

/**
 * Poster / YouTube thumbnail for «Cambiar la contraseña no cierra todo». Title on the left; on the right the
 * infected computer with one box ticked in green («contraseña cambiada») and three sessions that stay open.
 */
export function Poster() {
  const left = LAYOUT.marginX;
  return (
    <AbsoluteFill style={{ fontFamily: FONT.sans, color: C.text }}>
      <Backdrop />
      <div style={{ position: 'absolute', left: 1060, top: 190, width: 770, height: 700 }}>
        <div style={{ position: 'absolute', left: 0, top: 0, display: 'flex', alignItems: 'center', gap: 20, padding: '0 28px 0 22px', height: 120, width: 770, boxSizing: 'border-box', borderRadius: 24, background: alpha(C.emerald, 0.12), border: `4px solid ${alpha(C.emerald, 0.85)}` }}>
          <div style={{ width: 62, height: 62, borderRadius: 14, display: 'grid', placeItems: 'center', background: alpha(C.emerald, 0.25), border: `4px solid ${C.emerald}` }}>
            <Icon name="check" size={44} color={C.emerald} strokeWidth={3.6} />
          </div>
          <span style={{ fontSize: 50, fontWeight: 850, color: '#6ee7b7' }}>contraseña cambiada</span>
        </div>

        <div style={{ position: 'absolute', left: 0, top: 190, width: 190, height: 190, borderRadius: 30, display: 'grid', placeItems: 'center', background: alpha(C.rose, 0.12), border: `4px solid ${alpha(C.rose, 0.85)}`, boxShadow: `0 0 50px ${alpha(C.rose, 0.3)}` }}>
          <Icon name="laptop" size={110} color={C.rose} />
        </div>
        <div style={{ position: 'absolute', left: 0, top: 396, width: 190, textAlign: 'center', fontSize: 34, fontWeight: 800, color: C.roseSoft }}>infostealer</div>

        <svg width={770} height={560} style={{ position: 'absolute', left: 0, top: 140 }}>
          {OPEN.map((_, i) => (
            <g key={i}>
              <line x1={214} y1={145} x2={336} y2={80 + i * 150} stroke={alpha(C.amber, 0.7)} strokeWidth={5} strokeDasharray="14 12" strokeLinecap="round" />
            </g>
          ))}
        </svg>
        {OPEN.map((o, i) => (
          <div key={o.label} style={{ position: 'absolute', left: 340, top: 160 + i * 150, width: 430, height: 120, boxSizing: 'border-box', display: 'flex', alignItems: 'center', gap: 18, padding: '0 22px', borderRadius: 22, background: alpha(o.color, 0.1), border: `3px solid ${alpha(o.color, 0.8)}` }}>
            <Icon name={o.icon} size={50} color={o.color} />
            <div>
              <div style={{ fontSize: 31, fontWeight: 800, lineHeight: 1.1, whiteSpace: 'nowrap', color: C.textStrong }}>{o.label}</div>
              <div style={{ marginTop: 4, display: 'flex', alignItems: 'center', gap: 8, fontSize: 28, fontWeight: 700, color: C.amber }}>
                <Icon name="unlock" size={30} color={C.amber} />
                sigue abierta
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ position: 'absolute', left, top: 250, display: 'flex', alignItems: 'center', gap: 16 }}>
        <BrandMark size={30} />
        <span style={{ fontSize: TYPE.small, fontWeight: 800, letterSpacing: 5, color: C.cyanSoft }}>ALERTÓPOLIS</span>
      </div>
      <div style={{ position: 'absolute', left: left - 6, top: 298, fontWeight: 850, letterSpacing: -2.5, color: C.textStrong }}>
        <div style={{ fontSize: 108, lineHeight: 1.04, whiteSpace: 'nowrap' }}>Cambiar la</div>
        <div style={{ fontSize: 108, lineHeight: 1.04, whiteSpace: 'nowrap' }}>contraseña</div>
        <div style={{ fontSize: 108, lineHeight: 1.04, color: C.cyan, whiteSpace: 'nowrap' }}>no cierra todo</div>
      </div>
      <div style={{ position: 'absolute', left, top: 640, fontSize: 48, fontWeight: 650, lineHeight: 1.2, color: C.text, whiteSpace: 'nowrap' }}>cómo responder a un infostealer</div>
      <div style={{ position: 'absolute', left, top: 730, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 16 }}>
        <div style={{ display: 'flex', gap: 14 }}>
          <Chip accent="amber" icon="flag" size={30}>Práctica complementaria</Chip>
          <Chip accent="muted" icon="clock" size={30}>~9 min</Chip>
        </div>
        <Chip accent="muted" size={26} style={{ color: C.muted }}>Datos ficticios</Chip>
      </div>
      <div style={{ position: 'absolute', left, top: 986, fontSize: TYPE.micro, fontWeight: 550, color: C.faint }}>
        Material independiente, no afiliado a CompTIA.
      </div>
    </AbsoluteFill>
  );
}

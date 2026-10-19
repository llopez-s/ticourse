import { AbsoluteFill } from 'remotion';
import { ensureFonts } from '../../engine/src/theme/fonts';
import { C, FONT, LAYOUT, TYPE, alpha } from '../../engine/src/theme/tokens';
import { Backdrop } from '../../engine/src/ui/Backdrop';
import { Chip } from '../../engine/src/ui/Chip';
import { Icon } from '../../engine/src/ui/Icon';
import { BrandMark } from '../../engine/src/overlay/ChapterRail';
import { WHO } from './scenes/parts/bits';

ensureFonts();

const CAST = [
  { icon: 'user', color: WHO.ana, label: 'Ana' },
  { icon: 'app', color: WHO.app, label: 'App' },
  { icon: 'shield', color: WHO.idp, label: 'Entra ID' },
  { icon: 'mail', color: WHO.graph, label: 'Graph' },
] as const;

/**
 * Poster / YouTube thumbnail for «La sesión sigue abierta: identidad, permisos y tokens». Title on the left;
 * on the right, the four participants as a column of lifelines with one open arrow — a pass, not a master key.
 */
export function Poster() {
  const left = LAYOUT.marginX;
  return (
    <AbsoluteFill style={{ fontFamily: FONT.sans, color: C.text }}>
      <Backdrop />
      <div style={{ position: 'absolute', left: 1020, top: 170, width: 810, height: 740 }}>
        {CAST.map((c, i) => (
          <div key={c.label} style={{ position: 'absolute', left: i * 210, top: 0, width: 190 }}>
            <div style={{ width: 190, height: 150, borderRadius: 24, display: 'grid', placeItems: 'center', background: alpha(c.color, 0.12), border: `3px solid ${alpha(c.color, 0.8)}` }}>
              <Icon name={c.icon} size={84} color={c.color} />
            </div>
            <div style={{ marginTop: 14, textAlign: 'center', fontSize: 34, fontWeight: 800, color: C.textStrong }}>{c.label}</div>
            <div style={{ margin: '14px auto 0', width: 4, height: 480, background: `repeating-linear-gradient(${alpha(c.color, 0.5)} 0 8px, transparent 8px 22px)` }} />
          </div>
        ))}
        <svg width={810} height={740} style={{ position: 'absolute', left: 0, top: 0 }}>
          <line x1={105} y1={420} x2={505} y2={420} stroke={C.cyan} strokeWidth={8} strokeLinecap="round" />
          <polygon points="525,420 497,404 497,436" fill={C.cyan} />
          <line x1={525} y1={560} x2={725} y2={560} stroke="#fb923c" strokeWidth={8} strokeLinecap="round" />
          <polygon points="745,560 717,544 717,576" fill="#fb923c" />
        </svg>
      </div>

      <div style={{ position: 'absolute', left, top: 250, display: 'flex', alignItems: 'center', gap: 16 }}>
        <BrandMark size={30} />
        <span style={{ fontSize: TYPE.small, fontWeight: 800, letterSpacing: 5, color: C.cyanSoft }}>ALERTÓPOLIS</span>
      </div>
      <div style={{ position: 'absolute', left: left - 6, top: 298, fontWeight: 850, letterSpacing: -2.5, color: C.textStrong }}>
        <div style={{ fontSize: 112, lineHeight: 1.04, whiteSpace: 'nowrap' }}>La sesión</div>
        <div style={{ fontSize: 112, lineHeight: 1.04, color: C.cyan, whiteSpace: 'nowrap' }}>sigue abierta</div>
      </div>
      <div style={{ position: 'absolute', left, top: 562, fontSize: 50, fontWeight: 650, lineHeight: 1.2, color: C.text, whiteSpace: 'nowrap' }}>identidad, permisos y tokens</div>
      <div style={{ position: 'absolute', left, top: 676, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 16 }}>
        <div style={{ display: 'flex', gap: 14 }}>
          <Chip accent="amber" icon="flag" size={30}>Práctica complementaria</Chip>
          <Chip accent="muted" icon="clock" size={30}>~8 min</Chip>
        </div>
        <Chip accent="muted" size={26} style={{ color: C.muted }}>Datos ficticios</Chip>
      </div>
      <div style={{ position: 'absolute', left, top: 986, fontSize: TYPE.micro, fontWeight: 550, color: C.faint }}>
        Material independiente, no afiliado a CompTIA.
      </div>
    </AbsoluteFill>
  );
}

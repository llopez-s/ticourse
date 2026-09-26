import { AbsoluteFill } from 'remotion';
import { ensureFonts } from '../../engine/src/theme/fonts';
import { C, FONT, LAYOUT, TYPE, alpha } from '../../engine/src/theme/tokens';
import { Backdrop } from '../../engine/src/ui/Backdrop';
import { Chip } from '../../engine/src/ui/Chip';
import { Icon, type IconName } from '../../engine/src/ui/Icon';
import { BrandMark } from '../../engine/src/overlay/ChapterRail';
import { SIMULATION_LABEL } from '../../engine/src/overlay/SimulationTag';

ensureFonts();

/** The stacked layers, top to bottom: mail is where the breach enters, data is where it is stopped. */
const LAYERS: { label: string; icon: IconName; tint: string }[] = [
  { label: 'Correo', icon: 'mail', tint: C.rose },
  { label: 'DNS', icon: 'globe', tint: C.cyan },
  { label: 'Firewall', icon: 'firewall', tint: C.cyan },
  { label: 'IDS / IPS', icon: 'radar', tint: C.cyan },
  { label: 'Endpoint', icon: 'laptop', tint: C.cyan },
  { label: 'Datos', icon: 'database', tint: C.emerald },
];

const MOTIF = { x: 1180, y: 230, w: 640, plateH: 84, gap: 18 };

/**
 * Poster / YouTube thumbnail for «Defensa en capas». The title is set big and
 * two lines so it stays legible at small sizes; the stacked-layers motif sits
 * on the right, clear of the centre where the player draws its play button.
 */
export function Poster() {
  const left = LAYOUT.marginX;
  return (
    <AbsoluteFill style={{ fontFamily: FONT.sans, color: C.text }}>
      <Backdrop />
      <Motif />

      {/* brand */}
      <div style={{ position: 'absolute', left, top: 262, display: 'flex', alignItems: 'center', gap: 16 }}>
        <BrandMark size={30} />
        <span style={{ fontSize: TYPE.small, fontWeight: 800, letterSpacing: 5, color: C.cyanSoft }}>ALERTÓPOLIS</span>
      </div>

      {/* title, two lines for thumbnail legibility */}
      <div style={{ position: 'absolute', left: left - 6, top: 310, fontWeight: 850, letterSpacing: -2.5, color: C.textStrong }}>
        <div style={{ fontSize: TYPE.hero, lineHeight: 1.04, whiteSpace: 'nowrap' }}>Defensa en</div>
        <div style={{ fontSize: TYPE.hero, lineHeight: 1.04, color: C.cyan, whiteSpace: 'nowrap' }}>capas</div>
      </div>

      {/* subtitle */}
      <div style={{ position: 'absolute', left, top: 560, fontSize: TYPE.h3, fontWeight: 600, lineHeight: 1.25 }}>
        <div style={{ color: C.text }}>del correo falso</div>
        <div style={{ color: C.muted }}>al equipo aislado</div>
      </div>

      {/* chips */}
      <div style={{ position: 'absolute', left, top: 712, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 16 }}>
        <div style={{ display: 'flex', gap: 14 }}>
          <Chip accent="violet" icon="mortarboard" size={30}>
            Security+ SY0-701 · 4.5
          </Chip>
          <Chip accent="muted" icon="clock" size={30}>
            ~7 min
          </Chip>
        </div>
        <Chip accent="muted" size={26} style={{ color: C.muted }}>
          {SIMULATION_LABEL}
        </Chip>
      </div>

      {/* disclaimer */}
      <div style={{ position: 'absolute', left, top: 986, fontSize: TYPE.micro, fontWeight: 550, color: C.faint }}>
        Material independiente, no afiliado a CompTIA.
      </div>
    </AbsoluteFill>
  );
}

/** Six stacked plates: the layers the attack has to clear, mail down to data. */
function Motif() {
  return (
    <div style={{ position: 'absolute', left: MOTIF.x, top: MOTIF.y, width: MOTIF.w }}>
      {LAYERS.map((l, i) => (
        <div
          key={l.label}
          style={{
            position: 'absolute',
            left: 0,
            top: i * (MOTIF.plateH + MOTIF.gap),
            width: MOTIF.w,
            height: MOTIF.plateH,
            boxSizing: 'border-box',
            display: 'flex',
            alignItems: 'center',
            gap: 20,
            padding: '0 26px',
            borderRadius: 20,
            border: `2px solid ${alpha(l.tint, 0.55)}`,
            background: `linear-gradient(180deg, ${alpha(l.tint, 0.12)} 0%, ${alpha(C.ink900, 0.9)} 100%)`,
          }}
        >
          <Icon name={l.icon} size={42} color={l.tint} />
          <span style={{ fontSize: 34, fontWeight: 750, color: C.textStrong, whiteSpace: 'nowrap' }}>{l.label}</span>
        </div>
      ))}
    </div>
  );
}

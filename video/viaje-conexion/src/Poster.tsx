import { AbsoluteFill } from 'remotion';
import { ensureFonts } from '../../engine/src/theme/fonts';
import { C, FONT, LAYOUT, TYPE } from '../../engine/src/theme/tokens';
import { Backdrop } from '../../engine/src/ui/Backdrop';
import { Chip } from '../../engine/src/ui/Chip';
import { BrandMark } from '../../engine/src/overlay/ChapterRail';
import { SIMULATION_LABEL } from '../../engine/src/overlay/SimulationTag';
import { Edificio } from './scenes/parts/Edificio';
import { DeviceTile } from './scenes/parts/Glyphs';
import { Label } from './scenes/parts/Label';
import { EPHEMERAL_PORT, HTTPS_PORT, LAPTOP, PORTAL_IP } from './scenes/parts/data';
import { TIMELINE } from './timeline/load';

ensureFonts();

/** The video's length, rounded to half a minute, from the timeline the poster is rendered with. */
function durationLabel(): string {
  const min = Math.round((TIMELINE.durationInFrames / TIMELINE.fps / 60) * 2) / 2;
  return `~${String(min).replace('.', ',')} min`;
}

/**
 * Poster / YouTube thumbnail for «Cómo viaja una conexión»: the video's thread, the five-box label, on its way
 * from the laptop to the port's portal (dashed route), beside the title block, the brand line and the chips.
 */
export function Poster() {
  const left = LAYOUT.marginX;
  return (
    <AbsoluteFill style={{ fontFamily: FONT.sans, color: C.text }}>
      <Backdrop />

      {/* brand */}
      <div style={{ position: 'absolute', left, top: 236, display: 'flex', alignItems: 'center', gap: 16 }}>
        <BrandMark size={30} />
        <span style={{ fontSize: TYPE.small, fontWeight: 800, letterSpacing: 5, color: C.cyanSoft }}>ALERTÓPOLIS</span>
      </div>

      {/* title, two lines for thumbnail legibility */}
      <div style={{ position: 'absolute', left: left - 6, top: 284, fontWeight: 850, letterSpacing: -2.5, color: C.textStrong }}>
        <div style={{ fontSize: 128, lineHeight: 1.04, whiteSpace: 'nowrap' }}>Cómo viaja</div>
        <div style={{ fontSize: 128, lineHeight: 1.04, whiteSpace: 'nowrap', color: C.cyan }}>una conexión</div>
      </div>

      {/* subtitle */}
      <div style={{ position: 'absolute', left, top: 572, fontSize: 52, fontWeight: 700, lineHeight: 1.18, color: C.text, whiteSpace: 'nowrap' }}>
        <div>IP, gateway, NAT</div>
        <div>
          y <span style={{ color: '#fcd34d' }}>puertos</span>
        </div>
      </div>

      {/* chips */}
      <div style={{ position: 'absolute', left, top: 730, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 16 }}>
        <div style={{ display: 'flex', gap: 14 }}>
          <Chip accent="violet" icon="mortarboard" size={30}>
            Fundamentos · Security+
          </Chip>
          <Chip accent="muted" icon="clock" size={30}>
            {durationLabel()}
          </Chip>
        </div>
        <Chip accent="muted" size={26} style={{ color: C.muted }}>
          {SIMULATION_LABEL}
        </Chip>
      </div>


      {/* art: laptop -> label (on a parcel) -> portal */}
      <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0 }}>
        <path d="M1190,790 C1190,640 1420,720 1560,610 C1640,545 1655,500 1668,470" fill="none" stroke={C.cyanSoft} strokeWidth={8} strokeLinecap="round" strokeDasharray="22 26" opacity={0.9} />
      </svg>
      <div style={{ position: 'absolute', left: 1560, top: 150, width: 300 }}>
        <Edificio width={300} height={340} glow={0.5} />
      </div>
      <div style={{ position: 'absolute', left: 1050, top: 790, width: 300 }}>
        <DeviceTile kind="laptop" tile={150} />
      </div>
      <div style={{ position: 'absolute', left: 1085, top: 548, transform: 'rotate(-4deg)', transformOrigin: 'center' }}>
        <Label values={{ oAddr: LAPTOP.ip, oPort: EPHEMERAL_PORT, dAddr: PORTAL_IP, dPort: HTTPS_PORT, proto: 'TCP' }} scale={1.02} glass={0} />
      </div>

      {/* disclaimer */}
      <div style={{ position: 'absolute', left, top: 986, fontSize: TYPE.micro, fontWeight: 550, color: C.faint }}>
        Material independiente, no afiliado a CompTIA.
      </div>
    </AbsoluteFill>
  );
}

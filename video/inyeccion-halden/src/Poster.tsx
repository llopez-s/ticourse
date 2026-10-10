import { AbsoluteFill } from 'remotion';
import { ensureFonts } from '../../engine/src/theme/fonts';
import { C, FONT, LAYOUT, TYPE, alpha } from '../../engine/src/theme/tokens';
import { Backdrop } from '../../engine/src/ui/Backdrop';
import { Chip } from '../../engine/src/ui/Chip';
import { BrandMark } from '../../engine/src/overlay/ChapterRail';
import { SIMULATION_LABEL } from '../../engine/src/overlay/SimulationTag';
import { Vitrina } from './scenes/parts/Page';
import { PortForm } from './scenes/parts/PortForm';
import { TIMELINE } from './timeline/load';

ensureFonts();

/** The video's length, rounded to half a minute, from the timeline the poster is rendered with. */
function durationLabel(): string {
  const min = Math.round((TIMELINE.durationInFrames / TIMELINE.fps / 60) * 2) / 2;
  return `~${String(min).replace('.', ',')} min`;
}

/**
 * Poster / YouTube thumbnail for «SQL injection y XSS: cuando un texto se vuelve orden». Left column as V16 / V17:
 * brand, big two-line title (the second line cyan), subtitle, chips, disclaimer. On the right the video's two images:
 * the port's form with a hole, with the cyan slip pasted in and running over the rest of the sentence (what goes
 * wrong), and in front, the glass case with the script on view and a lock (what the defence does: it is read, it is
 * not obeyed). The script text is a bare tag, no address, nothing that works.
 */
export function Poster() {
  const left = LAYOUT.marginX;
  return (
    <AbsoluteFill style={{ fontFamily: FONT.sans, color: C.text }}>
      <Backdrop />

      {/* soft halos behind the art */}
      <div style={{ position: 'absolute', left: 1000, top: 60, width: 900, height: 900, background: `radial-gradient(closest-side, ${alpha(C.cyan, 0.12)} 0%, transparent 100%)` }} />
      <div style={{ position: 'absolute', left: 1200, top: 560, width: 560, height: 460, background: `radial-gradient(closest-side, ${alpha(C.emerald, 0.16)} 0%, transparent 100%)` }} />

      {/* the form with a hole, tilted, behind */}
      <div style={{ position: 'absolute', left: 1010, top: 120, transform: 'rotate(-3deg)', transformOrigin: 'center' }}>
        <PortForm box={0} slip={1} tape={1} scale={0.88} />
      </div>

      {/* the glass case, in front */}
      <div style={{ position: 'absolute', left: 1230, top: 560, transform: 'rotate(1.6deg)', transformOrigin: 'center' }}>
        <div style={{ padding: '14px 10px 30px', borderRadius: 28, background: alpha(C.ink900, 0.9), border: `3px solid ${alpha(C.emerald, 0.55)}`, boxShadow: `0 40px 90px ${alpha('#000000', 0.55)}, 0 0 40px ${alpha(C.emerald, 0.16)}` }}>
          <Vitrina w={1} lock={1} pad={34}>
            <span style={{ fontFamily: FONT.mono, fontSize: 84, fontWeight: 800, color: C.cyan }}>{'<script>'}</span>
          </Vitrina>
        </div>
      </div>

      {/* brand */}
      <div style={{ position: 'absolute', left, top: 236, display: 'flex', alignItems: 'center', gap: 16 }}>
        <BrandMark size={30} />
        <span style={{ fontSize: TYPE.small, fontWeight: 800, letterSpacing: 5, color: C.cyanSoft }}>ALERTÓPOLIS</span>
      </div>

      {/* title, two lines for thumbnail legibility */}
      <div style={{ position: 'absolute', left: left - 6, top: 284, fontWeight: 850, letterSpacing: -2.5, color: C.textStrong }}>
        <div style={{ fontSize: 118, lineHeight: 1.04, whiteSpace: 'nowrap' }}>SQL injection</div>
        <div style={{ fontSize: 118, lineHeight: 1.04, whiteSpace: 'nowrap', color: C.cyan }}>y XSS</div>
      </div>

      {/* subtitle */}
      <div style={{ position: 'absolute', left, top: 556, fontSize: 52, fontWeight: 700, lineHeight: 1.2, color: C.text, whiteSpace: 'nowrap' }}>
        cuando un <span style={{ color: C.cyan }}>texto</span> se vuelve orden
      </div>

      {/* chips */}
      <div style={{ position: 'absolute', left, top: 690, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 16 }}>
        <div style={{ display: 'flex', gap: 14 }}>
          <Chip accent="violet" icon="mortarboard" size={30}>
            Security+ SY0-701 · 2.3
          </Chip>
          <Chip accent="muted" icon="clock" size={30}>
            {durationLabel()}
          </Chip>
        </div>
        <Chip accent="muted" size={26} style={{ color: C.muted }}>
          {SIMULATION_LABEL}
        </Chip>
      </div>

      {/* disclaimer */}
      <div style={{ position: 'absolute', left, top: 986, fontSize: TYPE.micro, fontWeight: 550, color: C.faint }}>Material independiente, no afiliado a CompTIA.</div>
    </AbsoluteFill>
  );
}

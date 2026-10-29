import { AbsoluteFill } from 'remotion';
import { ensureFonts } from '../../engine/src/theme/fonts';
import { C, FONT, LAYOUT, RADIUS, TYPE, alpha } from '../../engine/src/theme/tokens';
import { Backdrop } from '../../engine/src/ui/Backdrop';
import { Chip } from '../../engine/src/ui/Chip';
import { Icon } from '../../engine/src/ui';
import { BrandMark } from '../../engine/src/overlay/ChapterRail';
import { SIMULATION_LABEL } from '../../engine/src/overlay/SimulationTag';
import { CHRONO, SOURCES } from './scenes/parts/data';
import { TIMELINE } from './timeline/load';

ensureFonts();

const ART = { w: 720, h: 560 } as const;
/** The image on the right (absolute 1920×1080 coordinates). */
const ART_POS = { x: 1920 - LAYOUT.marginX - ART.w - 4, y: 300 } as const;

/** The video's length, rounded to half a minute, from the timeline the poster is rendered with. */
function durationLabel(): string {
  const min = Math.round((TIMELINE.durationInFrames / TIMELINE.fps / 60) * 2) / 2;
  return `~${String(min).replace('.', ',')} min`;
}

/**
 * The video in one image: the chronology as a vertical rule of five UTC hours, each with the source's icon and its
 * original hour in grey (the video's screen rule). No hostnames, accounts, addresses or dates: only times and icons.
 */
function PosterArt() {
  const rowH = ART.h / CHRONO.length;
  return (
    <div style={{ position: 'relative', width: ART.w, height: ART.h }}>
      <div style={{ position: 'absolute', left: 38, top: rowH / 2, width: 6, height: ART.h - rowH, borderRadius: 3, background: alpha(C.emerald, 0.55) }} />
      {CHRONO.map((row, i) => {
        const src = SOURCES[row.source];
        const first = i === 0;
        return (
          <div key={row.id} style={{ position: 'absolute', left: 0, top: i * rowH, height: rowH, display: 'flex', alignItems: 'center', gap: 22 }}>
            <div style={{ width: 82, display: 'flex', justifyContent: 'center' }}>
              <div style={{ width: first ? 38 : 26, height: first ? 38 : 26, borderRadius: 20, background: C.emerald, border: `5px solid ${C.ink950}`, boxShadow: first ? `0 0 28px ${alpha(C.emerald, 0.8)}` : undefined }} />
            </div>
            <div
              style={{
                height: 92,
                padding: '0 24px',
                display: 'flex',
                alignItems: 'center',
                gap: 22,
                borderRadius: RADIUS.lg,
                border: `3px solid ${alpha(C.emerald, first ? 0.95 : 0.55)}`,
                background: alpha(C.ink850, 0.96),
                boxShadow: first ? `0 0 40px ${alpha(C.emerald, 0.3)}` : undefined,
              }}
            >
              <span style={{ fontFamily: FONT.mono, fontSize: 52, fontWeight: 800, color: C.textStrong, letterSpacing: -1 }}>{row.utc}</span>
              <Icon name={src.icon} size={46} color={C.cyan} />
              <span style={{ fontFamily: FONT.mono, fontSize: 26, fontWeight: 500, color: C.muted }}>{row.original}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/**
 * Poster / YouTube thumbnail for «Cómo reconstruir lo ocurrido». The series' layout: the brand, a big title («Cómo
 * reconstruir» white, «lo ocurrido» cyan), the subtitle, the objective and length chips. On the right, ONE image
 * from the video: the five UTC hours in order, each with its source's icon and its original hour in grey.
 */
export function Poster() {
  const left = LAYOUT.marginX;
  return (
    <AbsoluteFill style={{ fontFamily: FONT.sans, color: C.text }}>
      <Backdrop />

      <div style={{ position: 'absolute', left: ART_POS.x, top: ART_POS.y }}>
        <PosterArt />
      </div>

      {/* brand */}
      <div style={{ position: 'absolute', left, top: 226, display: 'flex', alignItems: 'center', gap: 16 }}>
        <BrandMark size={30} />
        <span style={{ fontSize: TYPE.small, fontWeight: 800, letterSpacing: 5, color: C.cyanSoft }}>ALERTÓPOLIS</span>
      </div>

      {/* title: three big lines for thumbnail legibility */}
      <div style={{ position: 'absolute', left: left - 8, top: 262, fontSize: 138, fontWeight: 850, letterSpacing: -4.5, lineHeight: 1.02, color: C.textStrong, whiteSpace: 'nowrap' }}>
        <div>Cómo</div>
        <div>reconstruir</div>
        <div style={{ color: C.cyan }}>lo ocurrido</div>
      </div>

      {/* subtitle */}
      <div style={{ position: 'absolute', left, top: 700, fontSize: 58, fontWeight: 700, letterSpacing: -1, lineHeight: 1.1, color: C.text, whiteSpace: 'nowrap' }}>
        Logs, UTC y cronologías
      </div>

      {/* chips */}
      <div style={{ position: 'absolute', left, top: 806, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 16 }}>
        <div style={{ display: 'flex', gap: 14 }}>
          <Chip accent="violet" icon="mortarboard" size={30}>
            Security+ · SY0-701 · 4.8 y 4.9
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
      <div style={{ position: 'absolute', left, top: 986, fontSize: TYPE.micro, fontWeight: 550, color: C.faint }}>
        Material independiente, no afiliado a CompTIA.
      </div>
    </AbsoluteFill>
  );
}

import { AbsoluteFill } from 'remotion';
import { ensureFonts } from '../../engine/src/theme/fonts';
import { C, FONT, LAYOUT, TYPE, alpha } from '../../engine/src/theme/tokens';
import { Backdrop } from '../../engine/src/ui/Backdrop';
import { Chip } from '../../engine/src/ui/Chip';
import { Icon } from '../../engine/src/ui/Icon';
import { BrandMark } from '../../engine/src/overlay/ChapterRail';
import { SIMULATION_LABEL } from '../../engine/src/overlay/SimulationTag';
import { CASE, HASH_ROWS } from './data/canon';

ensureFonts();

/** Motif box on the right; the centre of the frame (the browser's play button) stays clear. */
const MOTIF = { x: 1180, y: 250, w: 640, h: 560 };

/**
 * Poster frame for the lesson's <video> element. It is shown ~896 px wide, so
 * everything that must be read is ≥ 26 px here (≈ 12 px on screen).
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
        <span style={{ fontSize: TYPE.small, fontWeight: 800, letterSpacing: 5, color: C.cyanSoft }}>INTELFORGE ACADEMY</span>
      </div>

      {/* title */}
      <div style={{ position: 'absolute', left: left - 6, top: 318, fontSize: TYPE.hero, fontWeight: 850, letterSpacing: -2.5, lineHeight: 1, color: C.textStrong, whiteSpace: 'nowrap' }}>
        Adquisición <span style={{ color: C.cyan }}>forense</span>
      </div>
      <div style={{ position: 'absolute', left, top: 452, fontSize: TYPE.h3, fontWeight: 600, lineHeight: 1.25, color: C.text }}>
        <div>Capturar sin contaminar:</div>
        <div style={{ color: C.muted }}>hash, imagen y custodia</div>
      </div>

      {/* chips */}
      <div style={{ position: 'absolute', left, top: 612, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 16 }}>
        <div style={{ display: 'flex', gap: 14 }}>
          <Chip accent="violet" icon="mortarboard" size={30}>
            Security+ SY0-701 · 4.8
          </Chip>
          <Chip accent="muted" icon="clock" size={30}>
            ~3 min
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

/** The sealed evidence bag and the three matching hashes of the acquisition. */
function Motif() {
  return (
    <div style={{ position: 'absolute', left: MOTIF.x, top: MOTIF.y, width: MOTIF.w, height: MOTIF.h }}>
      {/* bag */}
      <div
        style={{
          position: 'absolute',
          left: 60,
          top: 0,
          width: 520,
          height: 250,
          boxSizing: 'border-box',
          borderRadius: 28,
          border: `3px solid ${alpha(C.muted, 0.5)}`,
          background: `linear-gradient(180deg, ${alpha(C.sky, 0.12)} 0%, ${alpha(C.ink800, 0.9)} 45%)`,
          padding: '22px 26px',
        }}
      >
        <div style={{ height: 12, borderRadius: 6, background: `repeating-linear-gradient(90deg, ${C.ink600} 0 10px, ${C.ink700} 10px 18px)` }} />
        <div style={{ marginTop: 22, display: 'flex', alignItems: 'center', gap: 16 }}>
          <Icon name="database" size={56} color={C.amber} />
          <div>
            <div style={{ fontFamily: FONT.mono, fontSize: 34, fontWeight: 700, color: C.textStrong }}>{CASE.evidence}</div>
            <div style={{ fontSize: TYPE.small, color: C.muted }}>{CASE.device}</div>
          </div>
        </div>
        <div
          style={{
            position: 'absolute',
            right: -30,
            bottom: -34,
            width: 140,
            height: 140,
            borderRadius: 70,
            display: 'grid',
            placeItems: 'center',
            textAlign: 'center',
            background: C.ink900,
            border: `4px solid ${C.rose}`,
            transform: 'rotate(-10deg)',
            color: C.roseSoft,
            boxShadow: `0 0 0 10px ${alpha(C.rose, 0.12)}`,
          }}
        >
          <div>
            <div style={{ fontSize: TYPE.micro, fontWeight: 800, letterSpacing: 2 }}>PRECINTO</div>
            <div style={{ fontFamily: FONT.mono, fontSize: 40, fontWeight: 800 }}>{CASE.sealSeizure}</div>
          </div>
        </div>
      </div>

      {/* three matching hashes */}
      <div style={{ position: 'absolute', left: 0, top: 300, width: MOTIF.w, display: 'grid', gap: 14 }}>
        {HASH_ROWS.map((row) => (
          <div
            key={row.key}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              height: 70,
              padding: '0 22px',
              borderRadius: 16,
              border: `2px solid ${alpha(C.emerald, 0.45)}`,
              background: alpha(C.ink850, 0.95),
            }}
          >
            <span style={{ fontFamily: FONT.mono, fontSize: 32, fontWeight: 700, color: C.cyanSoft }}>{CASE.hash}</span>
            <span style={{ fontSize: TYPE.micro, color: C.muted }}>{row.label}</span>
            <Icon name="check" size={36} color={C.emerald} strokeWidth={2.6} style={{ marginLeft: 'auto' }} />
          </div>
        ))}
      </div>
    </div>
  );
}

import { AbsoluteFill } from 'remotion';
import { ensureFonts } from '../../engine/src/theme/fonts';
import { C, FONT, LAYOUT, TYPE, alpha } from '../../engine/src/theme/tokens';
import { Backdrop } from '../../engine/src/ui/Backdrop';
import { Chip } from '../../engine/src/ui/Chip';
import { BrandMark } from '../../engine/src/overlay/ChapterRail';
import { Stopwatch } from './scenes/parts/Stopwatch';
import { SIMULATION_LABEL } from '../../engine/src/overlay/SimulationTag';

ensureFonts();

/** The five pieces of the ribbon, in the order the video lights them, with the job each one does (rule 1 of s12). */
const PIECES: { name: string; job: string }[] = [
  { name: 'DHCP', job: 'te configura' },
  { name: 'DNS', job: 'traduce el nombre' },
  { name: 'TCP', job: 'abre la conversación' },
  { name: 'TLS', job: 'la protege' },
  { name: 'HTTP', job: 'pide la página' },
];

/**
 * Poster / YouTube thumbnail for «Qué sucede al abrir una web»: big two-line title on the left for small-size
 * legibility and, on the right, the video's thread — the five-piece ribbon stacked vertically, all lit, each with the
 * job it does — under a stopwatch frozen at «3 s» (the question the video answers).
 */
export function Poster() {
  const left = LAYOUT.marginX;
  return (
    <AbsoluteFill style={{ fontFamily: FONT.sans, color: C.text }}>
      <Backdrop />

      {/* the thread: five pieces, lit, in order */}
      <div style={{ position: 'absolute', left: 1130, top: 214, width: 700, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {PIECES.map(({ name, job }, i) => (
          <div
            key={name}
            style={{
              height: 104,
              borderRadius: 20,
              border: `3px solid ${alpha(C.cyan, 0.75)}`,
              background: alpha(C.cyan, 0.14),
              boxShadow: `0 0 28px ${alpha(C.cyan, 0.22)}`,
              display: 'flex',
              alignItems: 'center',
              gap: 22,
              padding: '0 26px',
            }}
          >
            <span
              style={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                background: C.cyan,
                color: C.ink950,
                fontSize: 36,
                fontWeight: 850,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              {i + 1}
            </span>
            <span style={{ fontSize: 58, fontWeight: 850, letterSpacing: 3, color: C.textStrong, minWidth: 190 }}>{name}</span>
            <span style={{ fontSize: 34, fontWeight: 650, color: C.cyanSoft, whiteSpace: 'nowrap' }}>{job}</span>
          </div>
        ))}
      </div>

      {/* the three seconds */}
      <div style={{ position: 'absolute', left: 1130, top: 60, display: 'flex', alignItems: 'center', gap: 24 }}>
        <Stopwatch seconds={3} size={120} />
        <span style={{ fontSize: 40, fontWeight: 750, color: C.text, lineHeight: 1.15 }}>
          lo que pasa
          <br />
          en esos 3 segundos
        </span>
      </div>

      {/* brand */}
      <div style={{ position: 'absolute', left, top: 250, display: 'flex', alignItems: 'center', gap: 16 }}>
        <BrandMark size={30} />
        <span style={{ fontSize: TYPE.small, fontWeight: 800, letterSpacing: 5, color: C.cyanSoft }}>ALERTÓPOLIS</span>
      </div>

      {/* title, two lines for thumbnail legibility */}
      <div style={{ position: 'absolute', left: left - 6, top: 298, fontWeight: 850, letterSpacing: -2.5, color: C.textStrong }}>
        <div style={{ fontSize: 116, lineHeight: 1.04, whiteSpace: 'nowrap' }}>Qué sucede al</div>
        <div style={{ fontSize: 116, lineHeight: 1.04, color: C.cyan, whiteSpace: 'nowrap' }}>abrir una web</div>
      </div>

      {/* subtitle */}
      <div style={{ position: 'absolute', left, top: 562, fontSize: 54, fontWeight: 650, lineHeight: 1.2, color: C.text, whiteSpace: 'nowrap' }}>cinco piezas, una detrás de otra</div>

      {/* chips */}
      <div style={{ position: 'absolute', left, top: 676, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 16 }}>
        <div style={{ display: 'flex', gap: 14 }}>
          <Chip accent="violet" icon="mortarboard" size={30}>
            Fundamentos · Security+
          </Chip>
          <Chip accent="muted" icon="clock" size={30}>
            ~9 min
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

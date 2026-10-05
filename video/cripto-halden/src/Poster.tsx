import type { ReactNode } from 'react';
import { AbsoluteFill } from 'remotion';
import { ensureFonts } from '../../engine/src/theme/fonts';
import { C, FONT, LAYOUT, TYPE, alpha } from '../../engine/src/theme/tokens';
import { Backdrop } from '../../engine/src/ui/Backdrop';
import { Chip } from '../../engine/src/ui/Chip';
import { tone as toneOf } from '../../engine/src/ui/tone';
import { BrandMark } from '../../engine/src/overlay/ChapterRail';
import { SIMULATION_LABEL } from '../../engine/src/overlay/SimulationTag';
import { FingerprintGlyph } from './scenes/parts/Fingerprint';
import { PaintIcon, PaintKey } from './scenes/parts/PaintMix';
import { WaxSeal } from './scenes/parts/WaxSeal';
import { TLS_TONES, type TlsPart } from './scenes/parts/TlsLine';

ensureFonts();

/** The four pieces of the line, read: a 2×2 grid of tiles on the right (absolute 1920×1080 coordinates). */
const TILE = 340;
const GAP = 30;
const GRID = { x: 1150, y: 170 } as const;

const PIECES: { part: Exclude<TlsPart, 'tls'>; label: string; art: ReactNode }[] = [
  { part: 'x25519', label: 'X25519', art: <PaintIcon size={186} glow={0.5} /> },
  { part: 'aes', label: 'AES_256_GCM', art: <PaintKey width={262} side="naviera" glow={0.5} /> },
  { part: 'sha', label: 'SHA384', art: <FingerprintGlyph size={186} glow={0.5} /> },
  { part: 'eckey', label: 'id-ecPublicKey', art: <WaxSeal size={196} glow={0.4} /> },
];

/** One tile: the piece's image and its name in the line, lit in its colour. */
function PieceTile({ i }: { i: number }) {
  const p = PIECES[i];
  const t = toneOf(TLS_TONES[p.part]);
  const x = GRID.x + (i % 2) * (TILE + GAP);
  const y = GRID.y + Math.floor(i / 2) * (TILE + GAP);
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: TILE,
        height: TILE,
        boxSizing: 'border-box',
        borderRadius: 36,
        border: `4px solid ${alpha(t.fg, 0.8)}`,
        background: `linear-gradient(180deg, ${alpha(t.fg, 0.14)} 0%, ${alpha(C.ink900, 0.96)} 70%)`,
        boxShadow: `0 0 50px ${alpha(t.fg, 0.25)}`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 22,
      }}
    >
      <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{p.art}</div>
      <span style={{ fontFamily: FONT.mono, fontSize: 34, fontWeight: 800, color: t.soft, whiteSpace: 'nowrap' }}>{p.label}</span>
    </div>
  );
}

/**
 * Poster / YouTube thumbnail for «Criptografía: quién usa qué clave y por qué
 * TLS es híbrido». Big two-line title on the left for small-size legibility;
 * on the right, the video's frame: the four pieces of the line, read — the
 * paint (X25519), the house key (AES_256_GCM), the fingerprint (SHA384) and
 * the port's seal (id-ecPublicKey), each lit in its colour.
 */
export function Poster() {
  const left = LAYOUT.marginX;
  return (
    <AbsoluteFill style={{ fontFamily: FONT.sans, color: C.text }}>
      <Backdrop />

      {/* soft halo behind the tiles */}
      <div
        style={{
          position: 'absolute',
          left: 1050,
          top: 90,
          width: 900,
          height: 900,
          background: `radial-gradient(closest-side, ${alpha(C.cyan, 0.12)} 0%, transparent 100%)`,
        }}
      />
      {PIECES.map((_, i) => (
        <PieceTile key={i} i={i} />
      ))}

      {/* brand */}
      <div style={{ position: 'absolute', left, top: 236, display: 'flex', alignItems: 'center', gap: 16 }}>
        <BrandMark size={30} />
        <span style={{ fontSize: TYPE.small, fontWeight: 800, letterSpacing: 5, color: C.cyanSoft }}>ALERTÓPOLIS</span>
      </div>

      {/* title, two lines for thumbnail legibility */}
      <div style={{ position: 'absolute', left: left - 6, top: 284, fontWeight: 850, letterSpacing: -2.5, color: C.textStrong }}>
        <div style={{ fontSize: 120, lineHeight: 1.04, whiteSpace: 'nowrap' }}>Quién usa</div>
        <div style={{ fontSize: 120, lineHeight: 1.04, whiteSpace: 'nowrap' }}>
          qué <span style={{ color: C.cyan }}>clave</span>
        </div>
      </div>

      {/* subtitle */}
      <div style={{ position: 'absolute', left, top: 560, fontSize: 48, fontWeight: 650, lineHeight: 1.2, color: C.text, whiteSpace: 'nowrap' }}>
        Criptografía, y por qué TLS es híbrido
      </div>

      {/* chips */}
      <div style={{ position: 'absolute', left, top: 676, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 16 }}>
        <div style={{ display: 'flex', gap: 14 }}>
          <Chip accent="violet" icon="mortarboard" size={30}>
            Security+ · SY0-701 · 1.4
          </Chip>
          <Chip accent="muted" icon="clock" size={30}>
            ~8,5 min
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

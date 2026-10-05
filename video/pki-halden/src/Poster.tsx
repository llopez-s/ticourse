import type { ReactNode } from 'react';
import { AbsoluteFill } from 'remotion';
import { ensureFonts } from '../../engine/src/theme/fonts';
import { C, FONT, LAYOUT, RADIUS, TYPE, alpha } from '../../engine/src/theme/tokens';
import { Backdrop } from '../../engine/src/ui/Backdrop';
import { Chip } from '../../engine/src/ui/Chip';
import { BrandMark } from '../../engine/src/overlay/ChapterRail';
import { SIMULATION_LABEL } from '../../engine/src/overlay/SimulationTag';
import { AnchorChain, anchorChainPoints, anchorChainSize } from './scenes/parts/AnchorChain';

ensureFonts();

/** The anchor chain on the right (absolute 1920×1080 coordinates). */
const CHAIN_H = 760;
const CHAIN = anchorChainSize(CHAIN_H);
const CHAIN_X = 1150;
const CHAIN_Y = 168;
const PTS = anchorChainPoints(CHAIN_H);
const TAG_GAP = 40;

/** A tag beside one element of the chain, vertically centred on it. */
function Tag({ x, y, color, dashed = false, children }: { x: number; y: number; color: string; dashed?: boolean; children: ReactNode }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: 'translateY(-50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 4,
        padding: '12px 24px',
        borderRadius: RADIUS.md,
        border: `3px ${dashed ? 'dashed' : 'solid'} ${alpha(color, 0.8)}`,
        background: `linear-gradient(180deg, ${alpha(color, 0.14)} 0%, ${alpha(C.ink900, 0.94)} 100%)`,
        boxShadow: `0 0 34px ${alpha(color, 0.2)}`,
        fontFamily: FONT.sans,
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </div>
  );
}

/**
 * Poster / YouTube thumbnail for «PKI en la consola: el eslabón que falta,
 * CRL y OCSP». Big two-line title on the left for small-size legibility, «que
 * falta» in amber; on the right, the video's image at the moment of the
 * question: the anchor chain with the anchor (the root) solid on its deck,
 * the last link (the portal's certificate) solid, and the middle link (the
 * intermediate) dashed and amber-tagged, «no ha llegado». Steel links, owners
 * by tags: the root in the CA's sky, the portal in cyan.
 */
export function Poster() {
  const left = LAYOUT.marginX;
  const anchorY = CHAIN_Y + PTS.anchor.y;
  const middleY = CHAIN_Y + PTS.middle.y;
  const leafY = CHAIN_Y + PTS.leaf.y;
  return (
    <AbsoluteFill style={{ fontFamily: FONT.sans, color: C.text }}>
      <Backdrop />

      {/* soft halo behind the chain */}
      <div
        style={{
          position: 'absolute',
          left: CHAIN_X + CHAIN.width / 2 - 480,
          top: 60,
          width: 960,
          height: 960,
          background: `radial-gradient(closest-side, ${alpha(C.sky, 0.1)} 0%, transparent 100%)`,
        }}
      />
      {/* amber glow where the middle link should be */}
      <div
        style={{
          position: 'absolute',
          left: CHAIN_X + PTS.middle.x - 170,
          top: middleY - 170,
          width: 340,
          height: 340,
          background: `radial-gradient(closest-side, ${alpha(C.amber, 0.22)} 0%, transparent 100%)`,
        }}
      />

      <div style={{ position: 'absolute', left: CHAIN_X, top: CHAIN_Y }}>
        <AnchorChain height={CHAIN_H} anchor={1} deck={1} middle={0} leaf={1} />
      </div>

      {/* tags: the root (sky), the missing intermediate (amber, dashed), the portal (cyan) */}
      <Tag x={CHAIN_X + PTS.anchor.right + TAG_GAP} y={anchorY} color={C.sky}>
        <span style={{ fontSize: 44, fontWeight: 850, color: '#7dd3fc' }}>raíz</span>
      </Tag>
      <Tag x={CHAIN_X + PTS.middle.right + TAG_GAP + 30} y={middleY} color={C.amber} dashed>
        <span style={{ fontSize: 44, fontWeight: 850, color: '#fcd34d' }}>intermedia</span>
        <span style={{ fontSize: 34, fontWeight: 700, color: C.text }}>no ha llegado</span>
      </Tag>
      <Tag x={CHAIN_X + PTS.leaf.right + TAG_GAP + 30} y={leafY} color={C.cyan}>
        <span style={{ fontSize: 44, fontWeight: 850, color: C.cyanSoft }}>portal</span>
      </Tag>

      {/* brand */}
      <div style={{ position: 'absolute', left, top: 236, display: 'flex', alignItems: 'center', gap: 16 }}>
        <BrandMark size={30} />
        <span style={{ fontSize: TYPE.small, fontWeight: 800, letterSpacing: 5, color: C.cyanSoft }}>ALERTÓPOLIS</span>
      </div>

      {/* title, two lines for thumbnail legibility */}
      <div style={{ position: 'absolute', left: left - 6, top: 284, fontWeight: 850, letterSpacing: -2.5, color: C.textStrong }}>
        <div style={{ fontSize: 128, lineHeight: 1.04, whiteSpace: 'nowrap' }}>El eslabón</div>
        <div style={{ fontSize: 128, lineHeight: 1.04, whiteSpace: 'nowrap', color: C.amber }}>que falta</div>
      </div>

      {/* subtitle */}
      <div style={{ position: 'absolute', left, top: 576, fontSize: 50, fontWeight: 700, lineHeight: 1.2, color: C.text, whiteSpace: 'nowrap' }}>
        <span style={{ color: C.cyan }}>PKI:</span> la cadena y la revocación
      </div>

      {/* chips */}
      <div style={{ position: 'absolute', left, top: 690, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 16 }}>
        <div style={{ display: 'flex', gap: 14 }}>
          <Chip accent="violet" icon="mortarboard" size={30}>
            Security+ SY0-701 · 1.4
          </Chip>
          <Chip accent="muted" icon="clock" size={30}>
            ~4 min
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

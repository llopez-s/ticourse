import { AbsoluteFill } from 'remotion';
import { ensureFonts } from '../../engine/src/theme/fonts';
import { C, FONT, LAYOUT, RADIUS, TYPE, alpha } from '../../engine/src/theme/tokens';
import { Backdrop } from '../../engine/src/ui/Backdrop';
import { Chip } from '../../engine/src/ui/Chip';
import { BrandMark } from '../../engine/src/overlay/ChapterRail';
import { SIMULATION_LABEL } from '../../engine/src/overlay/SimulationTag';
import { Board, CASE_TIMES, boardGeometry, type BoardProps } from './scenes/parts/Board';
import { Nave, NaveKey } from './scenes/parts/Nave';

ensureFonts();

/** The still frame the parts are drawn at: Contención's `wrong` step is struck and holding (amber 10 + strike 12 f). */
const F = 30;

/** Close-up of the case board, zoomed on Contención (absolute 1920×1080 coordinates). */
/** The panel is Contención only (cut 2 px inside its column rules), right-aligned: no neighbouring column text can leak in. */
const PANEL = { right: 1844, y: 96, h: 506, inset: 2 };
const ZOOM = 1.3;
const BOARD_H = 440;

/** Board-local rows above the column highlight that the crop leaves out (the hidden title row). */
const CROP_TOP = 48;

/** The open warehouse with the master keys, under the board; its master key flies out (the service account). */
const NAVE = { x: 1404, y: 626, w: 420 };
const KEY = { x: 1236, y: 690, size: 132 };

const board: BoardProps = {
  height: BOARD_H,
  title: false,
  columns: {
    detect: { box: 'checked', time: CASE_TIMES.declared },
    analysis: { box: 'checked' },
    contain: {
      focus: true,
      grow: 3,
      tone: 'amber',
      box: [
        { at: -100, state: 'checked', time: CASE_TIMES.firstContainment },
        { at: 0, state: 'wrong' },
      ],
    },
  },
};

/**
 * Poster / YouTube thumbnail for «Respuesta a incidentes: la mañana después».
 * Big two-line title on the left for small-size legibility; on the right, the
 * video in one glance: the case whiteboard zoomed on Contención, its box
 * ticked too early (amber) and struck out (rose), and under it the one nave
 * left open — the one with the master keys.
 */
export function Poster() {
  const left = LAYOUT.marginX;
  const geo = boardGeometry(board, F);
  const contain = geo.columns.contain;
  const panelW = contain.w * ZOOM - 2 * PANEL.inset;
  const panelX = PANEL.right - panelW;
  const boardX = -PANEL.inset - contain.x * ZOOM;
  return (
    <AbsoluteFill style={{ fontFamily: FONT.sans, color: C.text }}>
      <Backdrop />

      {/* The case whiteboard, zoomed on Contención */}
      <div
        style={{
          position: 'absolute',
          left: panelX,
          top: PANEL.y,
          width: panelW,
          height: PANEL.h,
          overflow: 'hidden',
          borderRadius: RADIUS.lg,
          border: `2px solid ${C.ink600}`,
          boxShadow: `0 30px 70px ${alpha('#000000', 0.5)}`,
        }}
      >
        <div style={{ position: 'absolute', left: boardX, top: -CROP_TOP * ZOOM, transform: `scale(${ZOOM})`, transformOrigin: '0 0' }}>
          <Board {...board} frame={F} />
        </div>
      </div>
      <div style={{ position: 'absolute', left: panelX + 26, top: PANEL.y - 22 }}>
        <Chip accent="muted" size={26} style={{ background: C.ink900, color: C.text }}>
          <span style={{ fontFamily: FONT.mono, fontWeight: 800 }}>CASO IR-2026-0147</span>
        </Chip>
      </div>

      {/* The open nave with the master keys */}
      <div style={{ position: 'absolute', left: NAVE.x, top: NAVE.y }}>
        <Nave width={NAVE.w} open={1} contents="keys" keyTaken={1} glow={0.8} glowTone="amber" label="ADM-WS-02" sub="donde viven las llaves" frame={F} />
      </div>
      <div style={{ position: 'absolute', left: KEY.x, top: KEY.y, transform: 'rotate(-28deg)' }}>
        <NaveKey size={KEY.size} glow={1} />
      </div>

      {/* brand */}
      <div style={{ position: 'absolute', left, top: 250, display: 'flex', alignItems: 'center', gap: 16 }}>
        <BrandMark size={30} />
        <span style={{ fontSize: TYPE.small, fontWeight: 800, letterSpacing: 5, color: C.cyanSoft }}>ALERTÓPOLIS</span>
      </div>

      {/* title, two lines for thumbnail legibility */}
      <div style={{ position: 'absolute', left: left - 6, top: 298, fontWeight: 850, letterSpacing: -2.5, color: C.textStrong }}>
        <div style={{ fontSize: 116, lineHeight: 1.04, whiteSpace: 'nowrap' }}>Respuesta a</div>
        <div style={{ fontSize: 116, lineHeight: 1.04, color: C.cyan, whiteSpace: 'nowrap' }}>incidentes</div>
      </div>

      {/* subtitle */}
      <div style={{ position: 'absolute', left, top: 562, fontSize: 54, fontWeight: 650, lineHeight: 1.2, color: C.text, whiteSpace: 'nowrap' }}>la mañana después</div>

      {/* chips */}
      <div style={{ position: 'absolute', left, top: 676, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 16 }}>
        <div style={{ display: 'flex', gap: 14 }}>
          <Chip accent="violet" icon="mortarboard" size={30}>
            Security+ · 4.8
          </Chip>
          <Chip accent="muted" icon="clock" size={30}>
            ~8 min
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

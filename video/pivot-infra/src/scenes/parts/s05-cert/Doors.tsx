import { C, FONT, TYPE, alpha } from '../../../../../engine/src/theme/tokens';
import { EASE, fadeIn, progress } from '../../../../../engine/src/theme/motion';
import { Icon } from '../../../../../engine/src/ui';
import { KEY_COLOR } from './bits';

const DOOR_W = 190;
const DOOR_H = 280;
const DOOR_Y = 312;
const DOOR_A_X = 650;
const DOOR_B_X = 1170;
/** Keyhole, door-local, when the door is shut. */
const HOLE = { x: DOOR_W - 42, y: DOOR_H / 2 + 6 };
const KEY_SIZE = 96;

/** Keyhole x in stage coordinates while a door hinged on its left edge swings open. */
function holeX(doorX: number, open: number): number {
  const sx = 1 - 0.7 * open;
  return doorX + 5 + (HOLE.x - 5) * sx;
}

export interface DoorTiming {
  /** The two doors appear (shut). */
  doorsAt: number;
  /** The key appears and flies from the certificate to door A. */
  keyAt: number;
  /** Door A opens. */
  openA: number;
  /** The key leaves for door B. */
  moveAt: number;
  /** «casi seguro…» */
  ownerAt: number;
  /** Everything fades out (before the scan starts). */
  outAt: number;
}

/**
 * s05-02 «una llave hecha a mano»: the certificate's key opens the C2's door;
 * if the same key opens another door, that door almost surely has the same
 * owner. Drawn below the intercept card's band (stage-local y ≥ 240).
 */
export function KeyDoors({ frame, t, keyFrom }: { frame: number; t: DoorTiming; keyFrom: { x: number; y: number } }) {
  if (frame < t.doorsAt || frame >= t.outAt + 14) return null;
  const out = 1 - progress(frame, t.outAt, 12, EASE.inOut);
  const doorsIn = fadeIn(frame, t.doorsAt, 14);

  const flyA = progress(frame, t.keyAt, 22, EASE.inOut);
  const openA = progress(frame, t.openA, 18, EASE.inOut);
  const hop = progress(frame, t.moveAt, 28, EASE.inOut);
  const arriveB = t.moveAt + 28;
  const openB = progress(frame, arriveB, 18, EASE.inOut);
  const owner = progress(frame, t.ownerAt, 14);

  // Key tip sits in the keyhole; the key rides with the keyhole as the door swings.
  const holeA = { x: holeX(DOOR_A_X, openA), y: DOOR_Y + HOLE.y };
  const holeB = { x: holeX(DOOR_B_X, openB), y: DOOR_Y + HOLE.y };
  const tipOffset = KEY_SIZE * 0.42;
  let kx: number;
  let ky: number;
  if (hop <= 0) {
    kx = keyFrom.x + (holeA.x - tipOffset - keyFrom.x) * flyA;
    ky = keyFrom.y + (holeA.y - keyFrom.y) * flyA;
  } else {
    const ax = holeA.x - tipOffset;
    const bx = holeB.x - tipOffset;
    kx = ax + (bx - ax) * hop;
    ky = holeA.y - Math.sin(Math.PI * hop) * 80;
  }
  const keyOpacity = Math.min(fadeIn(frame, t.keyAt, 8), out);

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: out }}>
      {/* Caption above the doors. */}
      <div
        style={{
          position: 'absolute',
          left: DOOR_A_X - 40,
          width: DOOR_B_X + DOOR_W - DOOR_A_X + 80,
          top: 246,
          textAlign: 'center',
          fontFamily: FONT.sans,
          fontSize: TYPE.h3 - 8,
          fontWeight: 800,
          color: KEY_COLOR,
          whiteSpace: 'nowrap',
          opacity: fadeIn(frame, t.keyAt + 6, 12),
        }}
      >
        una llave hecha a mano
      </div>

      <div style={{ opacity: doorsIn }}>
        <Door x={DOOR_A_X} open={openA} lit={flyA >= 1 ? 1 : 0} />
        <Door x={DOOR_B_X} open={openB} lit={openB > 0 ? 1 : 0} />
        <DoorLabel x={DOOR_A_X} color={C.sky}>
          el C2
        </DoorLabel>
        <DoorLabel x={DOOR_B_X} color={C.muted} opacity={1 - owner}>
          ¿otra puerta?
        </DoorLabel>
        <DoorLabel x={DOOR_B_X} color={KEY_COLOR} opacity={owner}>
          casi seguro, del mismo dueño
        </DoorLabel>
      </div>

      {/* The key. */}
      <div
        style={{
          position: 'absolute',
          left: kx - KEY_SIZE / 2,
          top: ky - KEY_SIZE / 2,
          width: KEY_SIZE,
          height: KEY_SIZE,
          opacity: keyOpacity,
          filter: `drop-shadow(0 0 14px ${alpha(KEY_COLOR, 0.6)})`,
        }}
      >
        <Icon name="key" size={KEY_SIZE} color={KEY_COLOR} strokeWidth={2.4} style={{ transform: 'rotate(45deg)' }} />
      </div>
    </div>
  );
}

function DoorLabel({ x, color, opacity = 1, children }: { x: number; color: string; opacity?: number; children: string }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: x + DOOR_W / 2,
        top: DOOR_Y + DOOR_H + 14,
        transform: 'translateX(-50%)',
        fontFamily: FONT.sans,
        fontSize: TYPE.label,
        fontWeight: 750,
        color,
        whiteSpace: 'nowrap',
        opacity,
      }}
    >
      {children}
    </div>
  );
}

/** A door hinged on its left edge; `open` 0–1 swings the panel and lets the light out. */
function Door({ x, open, lit }: { x: number; open: number; lit: number }) {
  const sx = 1 - 0.7 * open;
  const edge = lit > 0 ? alpha(KEY_COLOR, 0.55 + 0.4 * open) : C.ink600;
  const gid = `door-glow-${x}`;
  return (
    <svg width={DOOR_W} height={DOOR_H} viewBox={`0 0 ${DOOR_W} ${DOOR_H}`} style={{ position: 'absolute', left: x, top: DOOR_Y, overflow: 'visible' }}>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={alpha(KEY_COLOR, 0.05)} />
          <stop offset="100%" stopColor={alpha(KEY_COLOR, 0.55)} />
        </linearGradient>
      </defs>
      {/* Doorway and the light behind it. */}
      <rect x={0} y={0} width={DOOR_W} height={DOOR_H} rx={8} fill={C.ink950} stroke={edge} strokeWidth={4} />
      <rect x={4} y={4} width={DOOR_W - 8} height={DOOR_H - 8} rx={6} fill={`url(#${gid})`} opacity={open} />
      {/* The panel. */}
      <g transform={`translate(5 5) skewY(${-7 * open}) scale(${sx} 1)`}>
        <rect x={0} y={0} width={DOOR_W - 10} height={DOOR_H - 10} rx={5} fill={C.ink700} stroke={C.ink500} strokeWidth={2} />
        <rect x={20} y={22} width={DOOR_W - 50} height={92} rx={4} fill="none" stroke={alpha(C.ink500, 0.9)} strokeWidth={2} />
        <rect x={20} y={140} width={DOOR_W - 50} height={104} rx={4} fill="none" stroke={alpha(C.ink500, 0.9)} strokeWidth={2} />
        <circle cx={HOLE.x - 5} cy={HOLE.y - 5 - 24} r={7} fill={C.ink500} />
        <circle cx={HOLE.x - 5} cy={HOLE.y - 5} r={6} fill={lit > 0 ? KEY_COLOR : C.ink950} />
        <path d={`M${HOLE.x - 8} ${HOLE.y - 3} L${HOLE.x - 2} ${HOLE.y - 3} L${HOLE.x} ${HOLE.y + 9} L${HOLE.x - 10} ${HOLE.y + 9} Z`} fill={lit > 0 ? KEY_COLOR : C.ink950} />
      </g>
    </svg>
  );
}

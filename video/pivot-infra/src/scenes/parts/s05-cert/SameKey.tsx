import { C, FONT, RADIUS, TYPE, alpha } from '../../../../../engine/src/theme/tokens';
import { EASE, fadeIn, progress } from '../../../../../engine/src/theme/motion';
import { Icon, type IconName } from '../../../../../engine/src/ui';
import { CANON, KEY_COLOR, KeyBadge } from './bits';

const CHIP_H = 64;
const CHIP_Y = 8;
const C2_W = 440;
const PHISH_W = 536;
const LINK_W = 240;
const LEFT = (1728 - (C2_W + LINK_W + PHISH_W)) / 2;
const C2_X = LEFT;
const KEY_CX = LEFT + C2_W + LINK_W / 2;
const PHISH_X = LEFT + C2_W + LINK_W;
const MID_Y = CHIP_Y + CHIP_H / 2;
const KEY_TILE = 64;
/** Chip-local x where the domain text starts (border + padding + icon + gap). */
const TEXT_DX = 2 + 20 + 30 + 12;
const TEXT_DY = 11;

export interface SameKeyTiming {
  /** Both domains lift off from where they are on screen. */
  liftAt: number;
  /** The key lands between them («misma llave»). */
  keyAt: number;
  /** «pista muy fuerte de un mismo dueño». */
  clueAt: number;
}

/**
 * s05-06: the conclusion strip in the top band. Copies of the C2 domain and
 * the phishing domain fly up from where they sit, and the same key lands
 * between them: «misma llave · pista muy fuerte de un mismo dueño» — a clue,
 * not proof.
 */
export function SameKey({
  frame,
  t,
  c2From,
  phishFrom,
  keyFrom,
}: {
  frame: number;
  t: SameKeyTiming;
  /** Stage-local top-left of the source domain texts, and the key's source centre. */
  c2From: { x: number; y: number };
  phishFrom: { x: number; y: number };
  keyFrom: { x: number; y: number };
}) {
  if (frame < t.liftAt) return null;
  const c2 = progress(frame, t.liftAt, 24, EASE.inOut);
  const ph = progress(frame, t.liftAt + 6, 24, EASE.inOut);
  const keyFly = progress(frame, t.keyAt - 14, 18, EASE.inOut);
  const draw = progress(frame, t.keyAt + 2, 16, EASE.inOut);
  const keyOn = frame >= t.keyAt - 14;
  const settle = progress(frame, t.keyAt + 4, 20);
  const keyX = keyFrom.x + (KEY_CX - keyFrom.x) * keyFly;
  const keyY = keyFrom.y + (MID_Y - keyFrom.y) * keyFly;
  const flow = draw >= 1 ? (frame - t.keyAt) / 30 : undefined;

  return (
    <>
      <svg width={1728} height={140} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        <KeyLink x1={C2_X + C2_W + 6} x2={KEY_CX - KEY_TILE / 2 - 8} y={MID_Y} p={draw} flow={flow} />
        <KeyLink x1={KEY_CX + KEY_TILE / 2 + 8} x2={PHISH_X - 6} y={MID_Y} p={draw} flow={flow} reverse />
      </svg>

      <FlyingDomain
        icon="server"
        color={C.sky}
        text={CANON.c2}
        width={C2_W}
        from={{ x: c2From.x - TEXT_DX, y: c2From.y - TEXT_DY }}
        to={{ x: C2_X, y: CHIP_Y }}
        p={c2}
        opacity={fadeIn(frame, t.liftAt, 6)}
      />
      <FlyingDomain
        icon="globe"
        color={C.rose}
        text={CANON.phish}
        width={PHISH_W}
        from={{ x: phishFrom.x - TEXT_DX, y: phishFrom.y - TEXT_DY }}
        to={{ x: PHISH_X, y: CHIP_Y }}
        p={ph}
        opacity={fadeIn(frame, t.liftAt + 6, 6)}
      />

      {keyOn ? (
        <div style={{ position: 'absolute', left: keyX - KEY_TILE / 2, top: keyY - KEY_TILE / 2, opacity: fadeIn(frame, t.keyAt - 14, 6) }}>
          <KeyBadge size={KEY_TILE} glow={0.6 + 0.4 * settle} />
        </div>
      ) : null}

      {/* The verdict: a strong clue of a single owner, not proof. «misma llave» sits under the key. */}
      <div
        style={{
          position: 'absolute',
          left: KEY_CX,
          top: CHIP_Y + CHIP_H + 16,
          transform: 'translateX(-50%)',
          fontFamily: FONT.sans,
          fontSize: TYPE.label,
          fontWeight: 750,
          whiteSpace: 'nowrap',
          color: KEY_COLOR,
          opacity: fadeIn(frame, t.keyAt + 6, 12),
        }}
      >
        misma llave
        <span
          style={{
            position: 'absolute',
            left: '100%',
            top: 0,
            color: C.text,
            opacity: fadeIn(frame, t.clueAt, 12),
          }}
        >
          <span style={{ color: C.faint, margin: '0 16px' }}>·</span>
          pista muy fuerte de un mismo dueño
        </span>
      </div>
    </>
  );
}

function FlyingDomain({
  icon,
  color,
  text,
  width,
  from,
  to,
  p,
  opacity,
}: {
  icon: IconName;
  color: string;
  text: string;
  width: number;
  from: { x: number; y: number };
  to: { x: number; y: number };
  p: number;
  opacity: number;
}) {
  const x = from.x + (to.x - from.x) * p;
  // A slight lift above the straight line so the copy reads as picked up.
  const y = from.y + (to.y - from.y) * p - Math.sin(Math.PI * p) * 30;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width,
        height: CHIP_H,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '0 20px',
        borderRadius: RADIUS.pill,
        border: `2px solid ${alpha(color, 0.85)}`,
        background: `linear-gradient(180deg, ${alpha(color, 0.16)} 0%, ${alpha(C.ink900, 0.97)} 100%)`,
        boxShadow: `0 16px 36px ${alpha('#000000', 0.45)}, 0 0 ${Math.round(18 + 16 * (1 - p))}px ${alpha(color, 0.3)}`,
        opacity,
        fontFamily: FONT.mono,
        fontSize: TYPE.label,
        fontWeight: 800,
        color: C.textStrong,
        whiteSpace: 'nowrap',
      }}
    >
      <Icon name={icon} size={30} color={color} />
      {text}
    </div>
  );
}

function KeyLink({ x1, x2, y, p, flow, reverse = false }: { x1: number; x2: number; y: number; p: number; flow?: number; reverse?: boolean }) {
  if (p <= 0) return null;
  const len = x2 - x1;
  // Both halves grow out of the key.
  const d = reverse ? `M${x1} ${y} L${x2} ${y}` : `M${x2} ${y} L${x1} ${y}`;
  return (
    <g>
      <path d={d} stroke={alpha(KEY_COLOR, 0.3)} strokeWidth={12} strokeLinecap="round" strokeDasharray={`${len} ${len}`} strokeDashoffset={len * (1 - p)} fill="none" />
      <path d={d} stroke={KEY_COLOR} strokeWidth={4} strokeLinecap="round" strokeDasharray={`${len} ${len}`} strokeDashoffset={len * (1 - p)} fill="none" />
      {flow !== undefined ? (
        <path d={d} stroke={C.textStrong} strokeWidth={2} strokeLinecap="round" strokeDasharray="8 34" strokeDashoffset={-flow * 42} fill="none" opacity={0.7} />
      ) : null}
    </g>
  );
}

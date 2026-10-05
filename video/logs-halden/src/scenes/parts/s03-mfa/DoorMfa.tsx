import type { ReactNode } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { Icon, clamp01 } from '../../../../../engine/src/ui';
import { SECOND_LOCK } from '../../../data/s03-mfa';
import { Door, HwKeyGlyph, KeyGlyph, PhoneGlyph, doorPoint, keyTip } from '../FlatsBlock';

/**
 * s03: the image comes back — the SAME door of the block (FlatsBlock's Door),
 * now with a second lock. The ordinary key turns in the first lock, and the
 * door asks as well for something only you have: a phone or a hardware key
 * (drawn; never the word «código»). Box DOOR_MFA (w × h); not positioned.
 * All states are 0–1 weights.
 */

export const DOOR_MFA = { w: 732, h: 546 } as const;

const DOOR = { x: 36, y: 104, w: 220 } as const;
const L1 = { x: DOOR.x + doorPoint(DOOR.w, 'lock1').x, y: DOOR.y + doorPoint(DOOR.w, 'lock1').y };
const L2 = { x: DOOR.x + doorPoint(DOOR.w, 'lock2').x, y: DOOR.y + doorPoint(DOOR.w, 'lock2').y };
const KEY_W = 130;
const BUBBLE = { x: 300, y: 92, w: 424, h: 236 } as const;

/** Where the MFA tag can sit (under the bubble), in the box's coordinates. */
export const DOOR_MFA_TAG = { x: BUBBLE.x, y: BUBBLE.y + BUBBLE.h + 30, w: BUBBLE.w } as const;

export function DoorMfa({
  show,
  turn,
  ask,
  hold,
  denied,
}: {
  show: number;
  /** 0–1: the ordinary key turns in the first lock. */
  turn: number;
  /** 0–1: the second lock lights and asks for something only you have. */
  ask: number;
  /** 0–1: the second lock holds (emerald), «segundo cerrojo». */
  hold: number;
  /** 0–1: the ordinary key alone no longer opens (a rose cross on it). */
  denied: number;
}) {
  const s = clamp01(show);
  if (s <= 0.001) return null;
  const t = clamp01(turn);
  const a = clamp01(ask);
  const h = clamp01(hold);
  const d = clamp01(denied);
  const tip = keyTip(KEY_W);
  // The turn: the key rotates about its own axis (seen from the side it flips) — read with the arc.
  const flip = Math.cos(Math.PI * t);
  return (
    <div style={{ position: 'relative', width: DOOR_MFA.w, height: DOOR_MFA.h, opacity: s, transform: `translateY(${(1 - s) * 24}px)` }}>
      <div style={{ position: 'absolute', left: DOOR.x, top: DOOR.y }}>
        <Door
          width={DOOR.w}
          lock2={0.55 + 0.45 * Math.max(a, h)}
          lock2Glow={Math.max(a * 0.7, h)}
          lock1Color={t > 0.5 ? C.roseSoft : alpha(C.muted, 0.9)}
          glow={Math.max(0.25, h)}
          glowColor={h > 0.05 ? C.emerald : C.cyan}
          frameColor={h > 0.05 ? alpha(C.emerald, 0.5 + 0.4 * h) : alpha(C.cyan, 0.6)}
        />
      </div>
      {/* The ordinary key in the first lock */}
      <div
        style={{
          position: 'absolute',
          left: L1.x - tip.x,
          top: L1.y - tip.y,
          transform: `scaleY(${flip})`,
          transformOrigin: `${tip.x}px ${tip.y}px`,
        }}
      >
        <KeyGlyph width={KEY_W} glow={0.6} />
      </div>
      {/* The turn arc around the key's bow */}
      {t > 0.01 && t < 1 ? (
        <svg width={120} height={120} style={{ position: 'absolute', left: L1.x + KEY_W - 70, top: L1.y - 60, overflow: 'visible', opacity: Math.sin(Math.PI * t) }}>
          <path d="M 40 22 A 38 38 0 0 1 98 60" fill="none" stroke={C.roseSoft} strokeWidth={5} strokeLinecap="round" />
          <polygon points="88,58 108,58 98,74" fill={C.roseSoft} />
        </svg>
      ) : null}
      {/* The second lock asks: something only you have */}
      {a > 0.001 ? (
        <>
          <svg width={DOOR_MFA.w} height={DOOR_MFA.h} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: a }}>
            <path
              d={`M ${L2.x + 16} ${L2.y} L ${BUBBLE.x + 2} ${L2.y - 22} L ${BUBBLE.x + 2} ${L2.y + 22} Z`}
              fill={alpha(C.emerald, 0.22)}
              stroke={alpha(C.emerald, 0.75)}
              strokeWidth={2.5}
              strokeLinejoin="round"
            />
          </svg>
          <div
            style={{
              position: 'absolute',
              left: BUBBLE.x,
              top: BUBBLE.y,
              width: BUBBLE.w,
              height: BUBBLE.h,
              boxSizing: 'border-box',
              borderRadius: RADIUS.lg,
              border: `3px solid ${alpha(C.emerald, 0.55 + 0.4 * h)}`,
              background: `linear-gradient(180deg, ${alpha(C.emerald, 0.14)} 0%, ${alpha(C.ink900, 0.97)} 100%)`,
              boxShadow: `0 0 ${Math.round(18 + 22 * h)}px ${alpha(C.emerald, 0.2 + 0.25 * h)}`,
              fontFamily: FONT.sans,
              opacity: a,
              transform: `translateX(${(1 - a) * 18}px)`,
            }}
          >
            <div style={{ marginTop: 16, textAlign: 'center', fontSize: 34, fontWeight: 800, color: '#6ee7b7', whiteSpace: 'nowrap' }}>{SECOND_LOCK.only}</div>
            <div style={{ marginTop: 14, display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: 40 }}>
              <Glyph label={SECOND_LOCK.phone}>
                <PhoneGlyph height={104} lit={Math.max(0.4, h)} />
              </Glyph>
              <span style={{ alignSelf: 'center', fontSize: 30, fontWeight: 700, color: C.faint, marginBottom: 30 }}>o</span>
              <Glyph label={SECOND_LOCK.hwkey}>
                <div style={{ height: 104, display: 'flex', alignItems: 'center' }}>
                  <HwKeyGlyph width={136} lit={Math.max(0.4, h)} />
                </div>
              </Glyph>
            </div>
          </div>
        </>
      ) : null}
      {/* «no abre»: a cross on the key */}
      {d > 0.01 ? (
        <div
          style={{
            position: 'absolute',
            left: L1.x + KEY_W * 0.45 - 28,
            top: L1.y - 28,
            width: 56,
            height: 56,
            borderRadius: 28,
            display: 'grid',
            placeItems: 'center',
            background: alpha(C.roseDeep, 0.95),
            border: `3px solid ${C.rose}`,
            boxShadow: `0 0 18px ${alpha(C.rose, 0.5)}`,
            opacity: d,
            transform: `scale(${1.4 - 0.4 * d})`,
          }}
        >
          <svg width={28} height={28} viewBox="0 0 20 20">
            <path d="M 5 5 L 15 15 M 15 5 L 5 15" stroke={C.roseSoft} strokeWidth={3.4} strokeLinecap="round" />
          </svg>
        </div>
      ) : null}
      {/* A small lock icon marks the second lock once it holds */}
      {h > 0.01 ? (
        <div style={{ position: 'absolute', left: L2.x - 70, top: L2.y - 22, opacity: h }}>
          <Icon name="lock" size={40} color={C.emerald} strokeWidth={2.6} />
        </div>
      ) : null}
    </div>
  );
}

function Glyph({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      {children}
      <span style={{ fontSize: 28, fontWeight: 700, color: C.text, whiteSpace: 'nowrap' }}>{label}</span>
    </div>
  );
}

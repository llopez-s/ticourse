import { C, FONT, alpha } from '../../../../../engine/src/theme/tokens';
import { Icon } from '../../../../../engine/src/ui';
import { NOTE } from '../../../data/s04-traversal';

export const VENT_W = 860;
export const VENT_H = 300;

const PAPER = '#f2e8cf';
const PAPER_EDGE = '#d9c9a3';
const NAVY = '#1e3a8a';

const WIN = { x: 20, y: 34, w: 260, h: 230 } as const;
const LEDGE_Y = WIN.y + WIN.h - 14;

/**
 * The records office: a service window (ventanilla) with the clerk behind it and a ledge, and the order
 * note slid across the ledge: «sal de la sala y sube cuatro plantas». `window` (0–1) draws the window,
 * `note` (0–1) slides the note in from the right. Pure view.
 */
export function Ventanilla({ window: win, note }: { window: number; note: number }) {
  return (
    <div style={{ position: 'relative', width: VENT_W, height: VENT_H, fontFamily: FONT.sans }}>
      {/* Wall + window */}
      <div style={{ position: 'absolute', inset: 0, opacity: win, transform: `translateY(${(1 - win) * 14}px)` }}>
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: WIN.x * 2 + WIN.w,
            height: VENT_H,
            borderRadius: 18,
            background: `linear-gradient(180deg, ${C.ink800} 0%, ${C.ink850} 100%)`,
            border: `2px solid ${C.ink700}`,
          }}
        />
        {/* The opening: the clerk behind the glass */}
        <div
          style={{
            position: 'absolute',
            left: WIN.x,
            top: WIN.y,
            width: WIN.w,
            height: WIN.h,
            borderRadius: '90px 90px 10px 10px',
            border: `4px solid ${alpha(C.cyan, 0.75)}`,
            background: `linear-gradient(180deg, ${alpha(C.cyan, 0.14)} 0%, ${alpha(C.ink950, 0.9)} 100%)`,
            overflow: 'hidden',
          }}
        >
          <div style={{ position: 'absolute', left: (WIN.w - 130) / 2, top: 50 }}>
            <Icon name="user" size={130} color={C.cyanSoft} strokeWidth={1.6} />
          </div>
          {/* The archive shelves behind the clerk */}
          <svg width={WIN.w} height={WIN.h} style={{ position: 'absolute', left: 0, top: 0 }}>
            {[70, 120, 170].map((y) => (
              <line key={y} x1={14} y1={y} x2={56} y2={y} stroke={alpha(C.cyan, 0.35)} strokeWidth={4} strokeLinecap="round" />
            ))}
            {[70, 120, 170].map((y) => (
              <line key={`r${y}`} x1={WIN.w - 56} y1={y} x2={WIN.w - 14} y2={y} stroke={alpha(C.cyan, 0.35)} strokeWidth={4} strokeLinecap="round" />
            ))}
          </svg>
        </div>
        {/* The ledge, running out under the note */}
        <div
          style={{
            position: 'absolute',
            left: WIN.x - 14,
            top: LEDGE_Y,
            width: VENT_W - WIN.x + 14,
            height: 22,
            borderRadius: 8,
            background: `linear-gradient(180deg, ${C.ink500} 0%, ${C.ink600} 100%)`,
            boxShadow: `0 10px 22px ${alpha('#000000', 0.45)}`,
          }}
        />
      </div>

      {/* The order note, slid onto the ledge */}
      {note > 0 ? (
        <div
          style={{
            position: 'absolute',
            left: WIN.x + WIN.w + 24,
            top: LEDGE_Y - 170,
            width: 540,
            height: 170,
            boxSizing: 'border-box',
            padding: '26px 22px',
            borderRadius: 6,
            background: `linear-gradient(180deg, ${PAPER} 0%, #ede1c4 100%)`,
            border: `2px solid ${PAPER_EDGE}`,
            boxShadow: `0 18px 40px ${alpha('#000000', 0.5)}`,
            opacity: Math.min(1, note * 1.6),
            transform: `translateX(${(1 - note) * 160}px) rotate(${-2 + (1 - note) * 4}deg)`,
            transformOrigin: '0% 100%',
          }}
        >
          {NOTE.lines.map((line) => (
            <div key={line} style={{ fontSize: 40, fontWeight: 800, fontStyle: 'italic', color: NAVY, lineHeight: 1.22, whiteSpace: 'nowrap' }}>
              {line}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

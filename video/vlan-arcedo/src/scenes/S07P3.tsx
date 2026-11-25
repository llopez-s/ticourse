import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { Icon } from '../../../engine/src/ui';
import { SHEET } from '../data/s07-p3';
import { vlan } from '../data/vlans';
import { QuestionTagFallback } from './parts/Tags';
import { Stage } from './kit';

// Stage-local geometry of the still background.
const DESK_Y = 520;
const SCREEN = { x: 150, y: 96, w: 500, h: 330 } as const;
const CARD = { x: 800, y: 56, w: 780, h: 540 } as const;
const FIELD = { h: 76, gap: 26, top: 150, boxW: 330 } as const;

/**
 * s07-p3 «Sin puerta de enlace». The engine's question panel covers the stage from s07-01 to the end of the scene
 * (question, options, countdown, answer, trap and, on `door`, the card in the top band are all the engine's), so this
 * scene is ONLY a still, half-lit background drawn in code, complete from the first frame and never moving: a
 * workstation of the Usuarios VLAN and its network sheet, filled in by hand — two fields with something in them
 * (neutral bars: no address is ever shown) and «puerta de enlace» left empty. «pregunta tipo test · ejemplo» sits
 * under the stage, where the panel does not reach (the engine's label, from the question's `tag`; the fallback here
 * draws it only while the timeline lacks that field).
 */
export function S07P3(_props: SceneProps) {
  const u = vlan(10);
  const line = alpha(C.text, 0.4);
  return (
    <Stage>
      <svg width={1728} height={660} viewBox="0 0 1728 660" style={{ position: 'absolute', left: 0, top: 0 }}>
        {/* the wall and the desk */}
        <rect x={0} y={20} width={1728} height={DESK_Y - 20} rx={18} fill={C.ink900} />
        <rect x={40} y={DESK_Y} width={700} height={22} rx={6} fill={C.ink700} stroke={alpha(C.text, 0.25)} strokeWidth={3} />
        <rect x={90} y={DESK_Y + 22} width={18} height={118} fill={C.ink800} />
        <rect x={672} y={DESK_Y + 22} width={18} height={118} fill={C.ink800} />

        {/* the workstation: screen, stand, keyboard */}
        <rect x={SCREEN.x} y={SCREEN.y} width={SCREEN.w} height={SCREEN.h} rx={16} fill={C.ink800} stroke={alpha(u.tone, 0.55)} strokeWidth={5} />
        <rect x={SCREEN.x + 22} y={SCREEN.y + 22} width={SCREEN.w - 44} height={SCREEN.h - 44} rx={8} fill={alpha(u.tone, 0.08)} />
        {[0, 1, 2, 3].map((k) => (
          <rect key={k} x={SCREEN.x + 50} y={SCREEN.y + 60 + k * 50} width={[300, 220, 340, 180][k]} height={16} rx={8} fill={alpha(C.text, 0.14)} />
        ))}
        <rect x={SCREEN.x + SCREEN.w / 2 - 16} y={SCREEN.y + SCREEN.h} width={32} height={62} fill={C.ink700} />
        <rect x={SCREEN.x + SCREEN.w / 2 - 110} y={SCREEN.y + SCREEN.h + 62} width={220} height={16} rx={8} fill={C.ink700} stroke={line} strokeWidth={2} />
        <rect x={SCREEN.x + 60} y={DESK_Y - 26} width={300} height={20} rx={6} fill={C.ink700} stroke={alpha(C.text, 0.25)} strokeWidth={2} />
        {/* its network cable, down to the desk */}
        <path d={`M ${SCREEN.x + SCREEN.w - 40} ${SCREEN.y + SCREEN.h} C ${SCREEN.x + SCREEN.w} ${SCREEN.y + SCREEN.h + 30}, ${SCREEN.x + SCREEN.w + 6} ${DESK_Y - 40}, ${SCREEN.x + SCREEN.w - 6} ${DESK_Y}`} fill="none" stroke={alpha(u.tone, 0.5)} strokeWidth={5} strokeLinecap="round" />
        {/* the sheet belongs to this workstation */}
        <path d={`M ${SCREEN.x + SCREEN.w} ${SCREEN.y + 120} L ${CARD.x} ${CARD.y + 120}`} stroke={alpha(C.text, 0.25)} strokeWidth={3} strokeDasharray="10 10" />
      </svg>

      {/* the VLAN the workstation is in */}
      <div
        style={{
          position: 'absolute',
          left: SCREEN.x,
          top: 36,
          display: 'inline-flex',
          alignItems: 'center',
          gap: 12,
          padding: '6px 18px',
          borderRadius: RADIUS.md,
          border: `2px solid ${alpha(u.tone, 0.6)}`,
          background: C.ink950,
          fontFamily: FONT.sans,
          fontSize: 30,
          fontWeight: 750,
          color: C.text,
          whiteSpace: 'nowrap',
        }}
      >
        <span style={{ fontFamily: FONT.mono, fontWeight: 800, color: u.tone }}>{u.id}</span>
        {u.name}
      </div>

      {/* the network sheet */}
      <div
        style={{
          position: 'absolute',
          left: CARD.x,
          top: CARD.y,
          width: CARD.w,
          height: CARD.h,
          boxSizing: 'border-box',
          borderRadius: RADIUS.lg,
          border: `3px solid ${alpha(C.sky, 0.45)}`,
          background: C.ink850,
          fontFamily: FONT.sans,
        }}
      >
        <div style={{ position: 'absolute', left: 40, top: 34, right: 40, display: 'flex', alignItems: 'center', gap: 16 }}>
          <Icon name="network" size={44} color={C.sky} />
          <span style={{ fontSize: 42, fontWeight: 800, color: C.textStrong }}>{SHEET.title}</span>
          <span style={{ flex: 1 }} />
          <span style={{ padding: '4px 18px', borderRadius: RADIUS.pill, border: `2px solid ${alpha(C.muted, 0.6)}`, fontSize: 28, fontWeight: 700, color: C.text }}>{SHEET.mode}</span>
        </div>
        {SHEET.fields.map((f, k) => (
          <div key={f.name} style={{ position: 'absolute', left: 40, right: 40, top: FIELD.top + k * (FIELD.h + FIELD.gap), height: FIELD.h, display: 'flex', alignItems: 'center' }}>
            <span style={{ fontSize: 36, fontWeight: 700, color: f.filled ? C.text : C.textStrong }}>{f.name}</span>
            <span style={{ flex: 1 }} />
            <div
              style={{
                width: FIELD.boxW,
                height: FIELD.h,
                boxSizing: 'border-box',
                borderRadius: RADIUS.sm,
                border: f.filled ? `2px solid ${alpha(C.text, 0.3)}` : `3px dashed ${alpha(C.cyan, 0.9)}`,
                background: C.ink950,
                display: 'flex',
                alignItems: 'center',
                padding: '0 22px',
              }}
            >
              {/* something is written here (never an address on screen); the gateway box stays empty */}
              {f.filled ? <div style={{ width: k === 0 ? 210 : 250, height: 18, borderRadius: 9, background: alpha(C.text, 0.32) }} /> : null}
            </div>
          </div>
        ))}
      </div>

      <QuestionTagFallback scene="s07-p3" />
    </Stage>
  );
}

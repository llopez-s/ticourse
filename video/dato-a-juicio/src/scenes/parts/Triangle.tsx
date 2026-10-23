import type { CSSProperties } from 'react';
import { C, FONT, alpha } from '../../../../engine/src/theme/tokens';
import { Icon, type IconName } from '../../../../engine/src/ui';
import type { Piece } from '../../data/canon';

/**
 * The threat triangle: AMENAZA in the middle, three corners that are empty slots until a piece lands.
 *
 * <ThreatTriangle lit={{ intent, capability, opportunity }} … /> — a box `TRI_W`×`TRI_H` (logical px; `scale`
 * shrinks it as a whole, the wrapper keeps the logical size, so position it by its top-left corner).
 *   lit      0..1 per piece: how filled the corner is (dashed empty slot → solid rose piece with its icon)
 *   gap      0..1 per piece: an amber call-out on an EMPTY slot («falta esta»); wins over `lit` while it is > 0
 *   dim      0..1 per piece: steps a corner back (the others are in focus)
 *   whole    0..1: the three pieces together — the edges and AMENAZA light up
 *   tags     small label tied to a corner (e.g. «malware» on capability), with its own 0..1 `show`
 */
export const TRI_W = 620;
export const TRI_H = 450;

const V: Record<Piece, { x: number; y: number; labelY: number }> = {
  intent: { x: 310, y: 76, labelY: 0 },
  capability: { x: 150, y: 376, labelY: 412 },
  opportunity: { x: 470, y: 376, labelY: 412 },
};
const ICON: Record<Piece, IconName> = { intent: 'target', capability: 'gear', opportunity: 'unlock' };
const NAME: Record<Piece, string> = { intent: 'INTENT', capability: 'CAPABILITY', opportunity: 'OPPORTUNITY' };
const R = 28;

export type TriTag = { piece: Piece; text: string; show: number; tone?: string };

export function ThreatTriangle({
  lit,
  gap,
  dim,
  whole = 0,
  tags = [],
  scale = 1,
  center = 'AMENAZA',
  style,
}: {
  lit: Record<Piece, number>;
  gap?: Partial<Record<Piece, number>>;
  dim?: Partial<Record<Piece, number>>;
  whole?: number;
  tags?: readonly TriTag[];
  scale?: number;
  center?: string;
  style?: CSSProperties;
}) {
  const pieces: Piece[] = ['intent', 'capability', 'opportunity'];
  const edge = (a: Piece, b: Piece) => {
    const k = Math.min(lit[a], lit[b]);
    return (
      <line
        key={`${a}${b}`}
        x1={V[a].x}
        y1={V[a].y}
        x2={V[b].x}
        y2={V[b].y}
        stroke={k > 0.01 ? alpha(C.rose, 0.35 + 0.5 * Math.max(k, whole)) : alpha(C.ink500, 0.8)}
        strokeWidth={k > 0.01 ? 5 : 3}
        strokeDasharray={k > 0.01 ? undefined : '10 10'}
        strokeLinecap="round"
      />
    );
  };
  return (
    <div style={{ position: 'relative', width: TRI_W, height: TRI_H, transform: scale === 1 ? undefined : `scale(${scale})`, transformOrigin: '0 0', fontFamily: FONT.sans, ...style }}>
      {/* the fill of the triangle grows with the pieces */}
      <svg width={TRI_W} height={TRI_H} style={{ position: 'absolute', left: 0, top: 0 }}>
        <polygon points={`${V.intent.x},${V.intent.y} ${V.capability.x},${V.capability.y} ${V.opportunity.x},${V.opportunity.y}`} fill={alpha(C.rose, 0.04 + 0.12 * whole)} />
        {edge('intent', 'capability')}
        {edge('capability', 'opportunity')}
        {edge('opportunity', 'intent')}
      </svg>

      {/* AMENAZA in the middle */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 232,
          width: TRI_W,
          textAlign: 'center',
          fontSize: 34,
          fontWeight: 850,
          letterSpacing: 3,
          color: whole > 0.02 ? C.roseSoft : C.faint,
          textShadow: whole > 0.02 ? `0 0 ${Math.round(24 * whole)}px ${alpha(C.rose, 0.6 * whole)}` : undefined,
        }}
      >
        {center}
      </div>

      {pieces.map((p) => {
        const g = gap?.[p] ?? 0;
        const l = lit[p];
        const d = dim?.[p] ?? 0;
        const col = g > 0.02 ? C.amber : C.rose;
        const on = Math.max(l, 0);
        const labelColor = g > 0.02 ? '#fcd34d' : on > 0.5 ? '#fecdd3' : C.faint;
        return (
          <div key={p} style={{ opacity: 1 - 0.55 * d }}>
            {/* the slot */}
            <div
              style={{
                position: 'absolute',
                left: V[p].x - R,
                top: V[p].y - R,
                width: 2 * R,
                height: 2 * R,
                boxSizing: 'border-box',
                borderRadius: R,
                display: 'grid',
                placeItems: 'center',
                border: `${on > 0.5 || g > 0.02 ? 4 : 3}px ${on > 0.5 && g <= 0.02 ? 'solid' : 'dashed'} ${on > 0.5 || g > 0.02 ? alpha(col, 0.95) : C.ink500}`,
                background: on > 0.02 && g <= 0.02 ? alpha(C.rose, 0.18 * on) : g > 0.02 ? alpha(C.amber, 0.08 * g) : 'transparent',
                boxShadow: g > 0.02 ? `0 0 ${Math.round(40 * g)}px ${alpha(C.amber, 0.55 * g)}` : on > 0.02 ? `0 0 ${Math.round(26 * on)}px ${alpha(C.rose, 0.4 * on)}` : undefined,
                transform: `scale(${0.8 + 0.2 * Math.max(on, g)})`,
              }}
            >
              {on > 0.02 && g <= 0.02 ? <Icon name={ICON[p]} size={32} color={C.roseSoft} strokeWidth={2.2} /> : g > 0.02 ? <Icon name="alert" size={30} color={C.amber} strokeWidth={2.4} /> : null}
            </div>
            {g > 0.02 ? (
              <div
                style={{
                  position: 'absolute',
                  left: V[p].x - R - 14 * g,
                  top: V[p].y - R - 14 * g,
                  width: 2 * R + 28 * g,
                  height: 2 * R + 28 * g,
                  boxSizing: 'border-box',
                  borderRadius: R + 14 * g,
                  border: `3px solid ${alpha(C.amber, 0.55 * g)}`,
                }}
              />
            ) : null}
            {/* the name */}
            <div
              style={{
                position: 'absolute',
                left: V[p].x - 160,
                top: V[p].labelY,
                width: 320,
                textAlign: 'center',
                fontSize: 34,
                fontWeight: 850,
                letterSpacing: 2.5,
                lineHeight: '40px',
                whiteSpace: 'nowrap',
                color: labelColor,
              }}
            >
              {NAME[p]}
            </div>
          </div>
        );
      })}

      {tags.map((t) =>
        t.show > 0.01 ? (
          <div
            key={t.piece + t.text}
            style={{
              position: 'absolute',
              left: V[t.piece].x + (t.piece === 'opportunity' ? -R - 8 : t.piece === 'capability' ? -R - 8 : R + 16),
              top: t.piece === 'intent' ? V.intent.y - 22 : V[t.piece].y - R - 58,
              transform: t.piece === 'opportunity' || t.piece === 'capability' ? 'translateX(-100%)' : undefined,
              opacity: t.show,
              padding: '4px 16px',
              borderRadius: 999,
              border: `2px solid ${alpha(t.tone ?? C.amber, 0.8)}`,
              background: alpha(t.tone ?? C.amber, 0.14),
              color: '#fde68a',
              fontSize: 28,
              fontWeight: 750,
              whiteSpace: 'nowrap',
            }}
          >
            {t.text}
          </div>
        ) : null,
      )}
    </div>
  );
}

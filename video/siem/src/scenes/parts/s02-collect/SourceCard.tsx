import type { ReactNode } from 'react';
import { interpolateColors } from 'remotion';
import { C, FONT, TYPE, alpha } from '../../../../../engine/src/theme/tokens';
import { enter, progress } from '../../../../../engine/src/theme/motion';
import { Icon, Panel } from '../../../../../engine/src/ui';
import { DEVICE_LINE, INFRA_ROWS, type LinkId, type SourceGroup } from '../../../data/s02-collect';
import { CARD, INFRA_ROW_Y, L } from './layout';
import { ClockPill } from './ClockPill';
import { rowFocus, wipeFocus, type S02Timing } from './timing';

/** One device line inside a card: lights up (cyan wash) while the voice names it. */
function DeviceRow({
  frame,
  T,
  link,
  y,
  children,
  clock,
}: {
  frame: number;
  T: S02Timing;
  link: LinkId;
  y: number;
  children: ReactNode;
  clock?: ReactNode;
}) {
  const f = rowFocus(frame, T, link);
  return (
    <div style={{ position: 'absolute', left: L.textX - 14, right: 14, top: y - 23, height: 46 }}>
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 12,
          height: 46,
          padding: '0 14px',
          borderRadius: 12,
          background: alpha(C.cyan, 0.13 * f),
          boxShadow: f > 0 ? `inset 0 0 0 2px ${alpha(C.cyan, 0.45 * f)}` : 'none',
          color: interpolateColors(f, [0, 1], [C.text, C.textStrong]),
        }}
      >
        {children}
      </div>
      {clock ? <div style={{ position: 'absolute', right: 0, top: 0 }}>{clock}</div> : null}
    </div>
  );
}

const deviceText = { fontFamily: FONT.sans, fontSize: TYPE.label, fontWeight: 600, whiteSpace: 'nowrap' } as const;

/**
 * A source group (Sistemas / Aplicaciones / Infraestructura). Idle and dim
 * until its cue, then lit with its one-line meaning; its device rows light
 * again when the voice names their collection method.
 */
export function SourceCard({ frame, T, group, index }: { frame: number; T: S02Timing; group: SourceGroup; index: number }) {
  const box = CARD[group.id];
  const litAt = T[group.id];
  const glowUntil = group.id === 'sys' ? T.app : group.id === 'app' ? T.inf : T.inf + 70;
  const lit = progress(frame, litAt, 14);
  const glow = progress(frame, litAt, 12) * (1 - progress(frame, glowUntil, 16));
  const w = wipeFocus(frame, T);
  const wipeDim = group.id === 'app' ? 1 - w : group.id === 'inf' ? 1 - 0.6 * w : 1;
  const e = enter(frame, index * 3, { distance: 24, axis: 'x' });
  const accent = interpolateColors(lit, [0, 1], [C.muted, C.cyan]);
  const clock = <ClockPill frame={frame} T={T} drifted={group.clock} />;

  return (
    <div
      style={{
        position: 'absolute',
        left: L.srcX,
        top: box.y,
        width: L.srcW,
        height: box.h,
        opacity: e.opacity * (0.5 + 0.5 * lit) * wipeDim,
        transform: e.transform,
      }}
    >
      <Panel glow={glow} style={{ width: '100%', height: '100%' }}>
        {/* Icon tile */}
        <div
          style={{
            position: 'absolute',
            left: L.cardPad,
            top: L.line1 - 26,
            width: 52,
            height: 52,
            borderRadius: 14,
            display: 'grid',
            placeItems: 'center',
            background: alpha(C.cyan, 0.05 + 0.08 * lit),
            border: `2px solid ${alpha(C.cyan, 0.2 + 0.35 * lit)}`,
          }}
        >
          <Icon name={group.icon} size={30} color={accent} />
        </div>
        {/* Title + meaning */}
        <div
          style={{
            position: 'absolute',
            left: L.textX,
            top: L.line1 - 24,
            height: 48,
            display: 'flex',
            alignItems: 'center',
            gap: 18,
            whiteSpace: 'nowrap',
          }}
        >
          <span style={{ fontFamily: FONT.sans, fontSize: 34, fontWeight: 800, color: C.textStrong }}>{group.title}</span>
          <span
            style={{
              fontFamily: FONT.sans,
              fontSize: TYPE.label,
              fontWeight: 650,
              color: C.cyanSoft,
              opacity: lit,
              transform: `translateX(${(1 - lit) * 16}px)`,
            }}
          >
            {group.meaning}
          </span>
        </div>

        {group.id === 'inf' ? (
          INFRA_ROWS.map((row, i) => (
            <DeviceRow key={row.link} frame={frame} T={T} link={row.link} y={INFRA_ROW_Y[i]} clock={i === 0 ? clock : undefined}>
              <Icon name={row.icon} size={30} color={C.cyanSoft} />
              <span style={deviceText}>{row.text}</span>
            </DeviceRow>
          ))
        ) : (
          <DeviceRow frame={frame} T={T} link={group.id} y={L.line2} clock={clock}>
            <span style={deviceText}>{DEVICE_LINE[group.id]}</span>
          </DeviceRow>
        )}
      </Panel>
    </div>
  );
}

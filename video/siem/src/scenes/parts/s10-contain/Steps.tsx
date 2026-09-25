import type { ReactNode } from 'react';
import { C, FONT, TYPE, alpha } from '../../../theme/tokens';
import { Icon, type IconName } from '../../../ui';

export type StepState = 'hidden' | 'locked' | 'waiting' | 'done';

const BOX = 40;

/**
 * Status square used by the playbook and closure lists (same look as the
 * shared Checklist): empty, locked, waiting (amber clock) or done (emerald
 * fill + SVG check). `p` (0–1) animates the tick in.
 */
export function StepBox({ state, p = 1, glow = 0 }: { state: StepState; p?: number; glow?: number }) {
  const done = state === 'done';
  const color = done ? C.emerald : state === 'waiting' ? C.amber : C.ink600;
  const icon: IconName | null = done ? 'check' : state === 'waiting' ? 'clock' : state === 'locked' ? 'lock' : null;
  return (
    <div
      style={{
        width: BOX,
        height: BOX,
        borderRadius: 10,
        display: 'grid',
        placeItems: 'center',
        flexShrink: 0,
        border: `3px solid ${color}`,
        background: done ? alpha(C.emerald, 0.9 * p) : state === 'waiting' ? alpha(C.amber, 0.12 + 0.18 * glow) : 'transparent',
        boxShadow: state === 'waiting' ? `0 0 ${18 * glow}px ${alpha(C.amber, 0.5 * glow)}` : 'none',
      }}
    >
      {icon ? (
        <Icon
          name={icon}
          size={done ? 30 : 24}
          color={done ? C.ink950 : state === 'waiting' ? C.amber : C.faint}
          strokeWidth={done ? 3.2 : 2.2}
          style={{ opacity: done ? p : 1 }}
        />
      ) : null}
    </div>
  );
}

/** One row: status box + label (+ optional right slot). */
export function StepRow({
  state,
  p,
  glow,
  label,
  sub,
  right,
  labelColor,
  opacity = 1,
  dy = 0,
}: {
  state: StepState;
  p?: number;
  glow?: number;
  label: ReactNode;
  sub?: ReactNode;
  right?: ReactNode;
  labelColor?: string;
  opacity?: number;
  dy?: number;
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 18,
        minHeight: 52,
        opacity,
        transform: `translateY(${dy}px)`,
        fontFamily: FONT.sans,
      }}
    >
      <StepBox state={state} p={p} glow={glow} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: TYPE.label,
            fontWeight: 650,
            lineHeight: 1.15,
            whiteSpace: 'nowrap',
            color: labelColor ?? (state === 'done' ? C.textStrong : state === 'waiting' ? C.amber : C.muted),
          }}
        >
          {label}
        </div>
        {sub ? <div style={{ fontSize: TYPE.small, color: C.muted, marginTop: 4, whiteSpace: 'nowrap' }}>{sub}</div> : null}
      </div>
      {right}
    </div>
  );
}

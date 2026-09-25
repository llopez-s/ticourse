import type { ReactNode } from 'react';
import { C, FONT, RADIUS, TYPE, alpha } from '../../../theme/tokens';
import { EASE, fadeIn, fadeOut, lerp, progress, pulse } from '../../../theme/motion';
import { Chip, Icon, Panel } from '../../../ui';
import { StepRow, type StepState } from './Steps';
import type { S10Timing } from './timing';

export const COLUMN = { width: 680, height: 552 } as const;
const HEADER = 66;
const ROW0 = 86;
const PITCH = 78;
/** Centre of the "Aprobar" button in column coordinates (for the cursor). */
export const APPROVE_BUTTON = { x: 572, y: HEADER + ROW0 + 3 * PITCH + 26 } as const;
/** Height the playbook collapses to once the correction starts. */
export const COLLAPSED = 68;

/**
 * SOAR playbook log. It proposes the quarantine, then waits: the analyst's
 * approval ticks first and only then does "ejecutar cuarentena" run.
 */
export function Playbook({ frame, fps, t }: { frame: number; fps: number; t: S10Timing }) {
  // The body fades while the panel folds up (never an empty full-height box);
  // the fold ends at fix + 22, exactly when the closure panel takes the space.
  const collapse = progress(frame, t.fix + 4, 18, EASE.inOut);
  const height = lerp(collapse, [0, 1], [COLUMN.height, COLLAPSED]);
  const bodyOpacity = fadeOut(frame, t.fix + 2, 8);
  const approved = frame >= t.approve;
  // The label only grows once the pressed button has faded out of its slot.
  const relabel = frame >= t.approve + 8;

  const rows: {
    key: string;
    appear: number;
    state: StepState;
    tick?: number;
    label: ReactNode;
    right?: ReactNode;
    labelColor?: string;
    glow?: number;
  }[] = [
    { key: 'flows', appear: t.soar + 10, tick: t.soar + 24, state: 'done', label: 'reunir flujos NetFlow' },
    {
      key: 'enrich',
      appear: t.soar + 26,
      tick: t.soar + 44,
      state: 'done',
      label: (
        <>
          enriquecer IP <span style={{ fontFamily: FONT.mono, fontSize: 30 }}>203.0.113.47</span>
        </>
      ),
    },
    { key: 'propose', appear: t.soar + 36, tick: t.proposed, state: 'done', label: 'proponer cuarentena' },
    {
      key: 'approval',
      appear: t.waiting,
      tick: approved ? t.approve : undefined,
      state: approved ? 'done' : 'waiting',
      glow: approved ? 0 : pulse(frame - t.waiting, fps, 0.8),
      label: relabel ? 'Aprobado por la analista' : 'esperando aprobación',
      right: <ApprovalSlot frame={frame} t={t} />,
    },
    {
      key: 'execute',
      appear: t.waiting + 8,
      tick: t.execute,
      state: frame >= t.execute ? 'done' : approved ? 'hidden' : 'locked',
      label: 'ejecutar cuarentena',
      labelColor: frame >= t.execute ? C.textStrong : C.muted,
      right: (
        <span
          style={{
            fontSize: TYPE.small,
            color: C.faint,
            fontWeight: 600,
            opacity: fadeOut(frame, t.approve, 8),
            whiteSpace: 'nowrap',
          }}
        >
          tras aprobación
        </span>
      ),
    },
  ];

  return (
    <Panel
      title="Playbook SOAR"
      icon="bolt"
      accent="cyan"
      glow={collapse < 1 ? 0.55 * (1 - collapse) * fadeIn(frame, t.soar, 16) : 0}
      right={
        collapse > 0 ? (
          <Chip accent="emerald" icon="check" size={TYPE.small} style={{ opacity: collapse }}>
            ejecutado
          </Chip>
        ) : null
      }
      style={{ width: COLUMN.width, height }}
    >
      <div style={{ position: 'absolute', inset: 0, opacity: bodyOpacity }}>
        <div
          style={{
            position: 'absolute',
            left: 28,
            top: 18,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            fontSize: TYPE.label,
            color: C.cyanSoft,
            fontWeight: 650,
            whiteSpace: 'nowrap',
            opacity: fadeIn(frame, t.soar + 8, 12),
          }}
        >
          <Icon name="gear" size={32} color={C.cyan} />
          automatiza la respuesta
        </div>
        {rows.map((row, i) => {
          if (frame < row.appear) return null;
          const p = progress(frame, row.appear, 14);
          const ticked = row.tick !== undefined && frame >= row.tick;
          const state: StepState = row.state === 'done' ? (ticked ? 'done' : 'hidden') : row.state;
          return (
            <div key={row.key} style={{ position: 'absolute', left: 28, right: 28, top: ROW0 + i * PITCH }}>
              <StepRow
                state={state}
                p={row.tick !== undefined ? progress(frame, row.tick, 8) : 1}
                glow={row.glow}
                label={row.label}
                labelColor={row.labelColor ?? (state === 'hidden' ? C.text : undefined)}
                right={row.right}
                opacity={p}
                dy={(1 - p) * 14}
              />
            </div>
          );
        })}
      </div>
    </Panel>
  );
}

/** Right slot of the approval row: the "Aprobar" button, pressed at the cue, then the analyst icon. */
function ApprovalSlot({ frame, t }: { frame: number; t: S10Timing }) {
  const pressed = progress(frame, t.approve - 3, 6);
  const buttonOut = fadeOut(frame, t.approve + 2, 6);
  const who = progress(frame, t.approve + 10, 12);
  return (
    <div style={{ position: 'relative', width: 150, height: 52 }}>
      {buttonOut > 0 ? (
        <div style={{ position: 'absolute', right: 0, top: 0, opacity: buttonOut }}>
          <ApproveButton pressed={pressed} />
        </div>
      ) : null}
      {who > 0 ? (
        <div style={{ position: 'absolute', right: 6, top: 6, opacity: who }}>
          <Icon name="user" size={40} color={C.emerald} />
        </div>
      ) : null}
    </div>
  );
}

function ApproveButton({ pressed }: { pressed: number }) {
  return (
    <div
      style={{
        height: 52,
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        borderRadius: RADIUS.sm,
        background: pressed > 0 ? alpha(C.emerald, 0.25 + 0.6 * pressed) : alpha(C.emerald, 0.14),
        border: `2px solid ${C.emerald}`,
        color: pressed > 0.5 ? C.ink950 : C.emerald,
        fontFamily: FONT.sans,
        fontSize: TYPE.small,
        fontWeight: 800,
        transform: `scale(${1 - 0.06 * Math.sin(Math.PI * pressed)})`,
        whiteSpace: 'nowrap',
      }}
    >
      Aprobar
    </div>
  );
}

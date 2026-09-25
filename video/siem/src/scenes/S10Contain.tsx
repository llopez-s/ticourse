import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../timeline/types';
import { STAGE } from '../theme/tokens';
import { EASE, fadeOut, lerp, progress } from '../theme/motion';
import { CaseStrip, Cursor, Stamp } from '../ui';
import { Closure } from './parts/s10-contain/Closure';
import { APPROVE_BUTTON, COLLAPSED, COLUMN, Playbook } from './parts/s10-contain/Playbook';
import { DIAG, Topology } from './parts/s10-contain/Topology';
import { s10Timing } from './parts/s10-contain/timing';

/** Top of the working area under the case strip (stage-local px). */
const BODY_TOP = 108;
const COLUMN_LEFT = STAGE.width - COLUMN.width;
const DIAG_CENTERED = (STAGE.width - DIAG.width) / 2;

/**
 * S10 «Contener y validar»: isolate instead of shutting down (quarantine VLAN,
 * power stays on, packet capture), the SOAR playbook that proposed it and the
 * analyst approval that gated it, then correction + validation.
 */
export function S10Contain(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = s10Timing(props);

  // The think card covers the top of the stage: quieten the case strip under it.
  const stripDim = Math.max(progress(frame, t.thinkFrom, 8), 0) * (1 - progress(frame, t.thinkTo, 10));
  // The diagram makes room in the pause before «Un playbook», so the column never overlaps it.
  const slide = progress(frame, t.soar - 12, 18, EASE.inOut);
  const diagX = lerp(slide, [0, 1], [DIAG_CENTERED, 0]);
  // Execution of the quarantine briefly brings the diagram back into focus.
  const executeGlow = progress(frame, t.execute, 8) * (1 - progress(frame, t.execute + 26, 20));
  const diagOpacity = 1 - 0.5 * progress(frame, t.soar + 8, 18) + 0.4 * executeGlow;
  const validated = frame >= t.validate;
  // The pointer leaves right after the click so it never covers the analyst icon.
  const cursorOut = fadeOut(frame, t.approve + 8, 12);
  // The column is flush with the stage's right edge: it rises in (a sideways slide would be clipped).
  const columnIn = progress(frame, t.soar + 4, 18);

  return (
    <AbsoluteFill>
      <div style={{ position: 'absolute', left: STAGE.left, top: STAGE.top, width: STAGE.width, height: STAGE.height, overflow: 'hidden' }}>
        <CaseStrip
          status={validated ? 'VALIDADO' : 'CONTENCIÓN'}
          statusAccent={validated ? 'emerald' : 'amber'}
          // Same labels as S08/S09: the strip is chapter IV's continuity device.
          markers={[
            { time: '01:52', label: 'logon', accent: 'rose', reveal: 1 },
            { time: '02:00', label: 'inicio salida', accent: 'amber', reveal: 1 },
            { time: '04:30', label: 'fin salida', accent: 'amber', reveal: 1 },
          ]}
          style={{ opacity: 1 - 0.8 * stripDim }}
        />

        <div style={{ position: 'absolute', left: diagX, top: BODY_TOP, opacity: diagOpacity }}>
          <Topology frame={frame} fps={fps} t={t} executeGlow={executeGlow} headerDim={stripDim} />
        </div>

        {frame >= t.soar ? (
          <div
            style={{
              position: 'absolute',
              left: COLUMN_LEFT,
              top: BODY_TOP,
              width: COLUMN.width,
              height: COLUMN.height,
              opacity: columnIn,
              transform: `translateY(${(1 - columnIn) * 28}px)`,
            }}
          >
            <Playbook frame={frame} fps={fps} t={t} />
            {frame >= t.fix + 22 ? (
              <div style={{ position: 'absolute', left: 0, top: COLLAPSED + 16 }}>
                <Closure frame={frame} t={t} width={COLUMN.width} height={COLUMN.height - COLLAPSED - 16} />
              </div>
            ) : null}
            {cursorOut > 0 ? (
              <div style={{ position: 'absolute', inset: 0, opacity: cursorOut }}>
                <Cursor
                  frame={frame}
                  path={[
                    { x: APPROVE_BUTTON.x + 70, y: APPROVE_BUTTON.y + 120, at: t.approve - 30 },
                    { x: APPROVE_BUTTON.x, y: APPROVE_BUTTON.y, at: t.approve - 4 },
                    { x: APPROVE_BUTTON.x, y: APPROVE_BUTTON.y, at: t.approve, click: true },
                    { x: APPROVE_BUTTON.x - 40, y: APPROVE_BUTTON.y + 86, at: t.approve + 18 },
                  ]}
                />
              </div>
            ) : null}
          </div>
        ) : null}

        {/* VALIDADO lands over the closed exfiltration path. */}
        <div
          style={{
            position: 'absolute',
            left: DIAG.width - 190,
            top: BODY_TOP + 132,
            width: 0,
            height: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Stamp frame={frame} at={t.validate + 2} accent="emerald" rotate={-8} size={58}>
            Validado
          </Stamp>
        </div>
      </div>
    </AbsoluteFill>
  );
}


import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../../../engine/src/theme/motion';
import { Icon, mix } from '../../../../../engine/src/ui';
import { FUNCTION, LOCKIN, PROVIDER, TASK } from '../../../data/s04-funcion';
import { Arrow } from '../Arrow';
import { Pass } from '../Bike';
import { FunctionBlock } from '../FunctionBlock';
import { TermPill } from '../Labels';

/** The provider's frame (stage-local) and the function blocks inside it. */
export const FRAME = { x: 0, y: 206, w: 660, h: 330 } as const;
const BLOCK = 160;
const BLOCK_Y = 70;
const BLOCK_X = [40, 250, 460];
const TASK_Y = 92;
/** Where the logs leave the frame (its right edge, at the first block's height). */
export const LOGS_OUT: [number, number] = [FRAME.x + FRAME.w + 6, FRAME.y + BLOCK_Y + BLOCK / 2];

export interface FunctionBeatTimes {
  port: number;
  fn: number;
  scale: number;
  logs: number;
  lockin: number;
}

/**
 * s04's port beat, left half: «tarea nocturna · aplicación nueva» comes in on `port` and drops into the provider's sky
 * frame on «función», where it becomes the function block («función serverless»); on «escala» two faint instances
 * appear beside it (no copies of a mould: the provider starts more of the same function). On `logs` the frame sends
 * its log lines out to the right. At the end, half-lit under it, the pass and «atada a ese proveedor · vendor lock-in».
 */
export function FunctionBeat({ frame, t }: { frame: number; t: FunctionBeatTimes }) {
  const taskIn = enter(frame, t.port - 2, { distance: 16 });
  const drop = progress(frame, t.fn - 8, 18, EASE.inOut);
  const frameIn = progress(frame, t.fn - 10, 14);
  const fnIn = progress(frame, t.fn + 4, 12);
  const ghosts = [0, 1].map((k) => progress(frame, t.scale + k * 6, 12));
  const logsOn = progress(frame, t.logs - 4, 12);
  const lock = progress(frame, t.lockin, 14);

  return (
    <>
      {/* The night task, then its drop into the frame */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: mix(TASK_Y, FRAME.y + BLOCK_Y + 20, drop),
          opacity: taskIn.opacity * (1 - drop),
          display: 'flex',
          alignItems: 'center',
          gap: 18,
          height: 80,
          padding: '0 30px 0 22px',
          boxSizing: 'border-box',
          borderRadius: RADIUS.md,
          border: `3px solid ${alpha(C.cyan, 0.7)}`,
          background: alpha(C.cyan, 0.08),
          fontFamily: FONT.sans,
          whiteSpace: 'nowrap',
          transform: taskIn.transform,
        }}
      >
        <Icon name="clock" size={40} color={C.cyan} />
        <span style={{ fontSize: 38, fontWeight: 800, color: C.textStrong }}>{TASK}</span>
      </div>

      {frameIn > 0.01 ? (
        <div style={{ position: 'absolute', left: FRAME.x, top: FRAME.y, width: FRAME.w, height: FRAME.h, opacity: frameIn }}>
          <div style={{ position: 'absolute', inset: 0, borderRadius: RADIUS.lg, border: `3px dashed ${alpha(C.sky, 0.75)}`, background: alpha(C.sky, 0.05) }} />
          <div style={{ position: 'absolute', left: 24, top: 16, display: 'flex', alignItems: 'center', gap: 12, fontFamily: FONT.sans, whiteSpace: 'nowrap' }}>
            <Icon name="cloud" size={34} color={C.sky} />
            <span style={{ fontSize: 32, fontWeight: 750, color: '#bae6fd' }}>{PROVIDER}</span>
          </div>
          {BLOCK_X.map((x, i) => {
            const op = i === 0 ? fnIn : 0.8 * ghosts[i - 1];
            if (op <= 0.01) return null;
            return (
              <div key={x} style={{ position: 'absolute', left: x, top: BLOCK_Y + (1 - op) * 10, opacity: op }}>
                <FunctionBlock size={BLOCK} ghost={i > 0} glow={i === 0 ? 0.3 + 0.6 * logsOn : 0} />
              </div>
            );
          })}
          <div style={{ position: 'absolute', left: BLOCK_X[0], top: BLOCK_Y + BLOCK + 18, fontFamily: FONT.sans, fontSize: 36, fontWeight: 850, color: C.textStrong, whiteSpace: 'nowrap', opacity: fnIn }}>{FUNCTION}</div>
        </div>
      ) : null}

      <svg width={1728} height={660} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none' }}>
        <Arrow points={[[110, TASK_Y + 84], [110, FRAME.y - 6]]} draw={progress(frame, t.fn - 14, 10) * (1 - drop)} color={C.cyan} width={4} />
      </svg>

      {lock > 0.01 ? (
        <div style={{ position: 'absolute', left: 0, top: FRAME.y + FRAME.h + 24, display: 'flex', alignItems: 'center', gap: 22, opacity: 0.25 + 0.5 * lock, fontFamily: FONT.sans }}>
          <Pass width={110} />
          <span style={{ fontSize: 34, fontWeight: 750, color: C.text, whiteSpace: 'nowrap' }}>{LOCKIN.text}</span>
          <TermPill text={LOCKIN.term} size={32} on={0.4} />
        </div>
      ) : null}
    </>
  );
}

import { useVideoConfig } from 'remotion';
import { C, FONT, TYPE, alpha } from '../../../theme/tokens';
import { enter, progress, typewriter } from '../../../theme/motion';
import { Icon, Panel } from '../../../ui';
import { INPUTS, type InputId } from '../../../data/s02-collect';
import { L } from './layout';
import { wipeFocus, type S02Timing } from './timing';

function inputLitAt(T: S02Timing, id: InputId): number {
  return id === 'agent' ? T.agent : id === 'syslog' ? T.syslog : id === 'api' ? T.api : T.netflow;
}

/**
 * The SIEM collector: one input per collection method, each filling in when
 * the voice names it. Glows when "todo converge en un punto central".
 */
export function Collector({ frame, T }: { frame: number; T: S02Timing }) {
  const { fps } = useVideoConfig();
  const e = enter(frame, 2, { distance: 24, axis: 'x' });
  const converge = progress(frame, T.converge, 16) * (1 - 0.75 * progress(frame, T.ntp + 20, 24));
  const w = wipeFocus(frame, T);
  const term = 'log aggregation';
  const typed = typewriter(term, frame, T.intro + 44, fps, 30);
  return (
    <div
      style={{
        position: 'absolute',
        left: L.colX,
        top: L.collectorY,
        width: L.colW,
        height: L.collectorH,
        opacity: e.opacity * (1 - 0.45 * w),
        transform: e.transform,
      }}
    >
      <Panel glow={converge} style={{ width: '100%', height: '100%' }}>
        <div
          style={{
            position: 'absolute',
            left: L.cardPad,
            top: 22,
            width: 56,
            height: 56,
            borderRadius: 16,
            display: 'grid',
            placeItems: 'center',
            background: alpha(C.cyan, 0.14),
            border: `2px solid ${alpha(C.cyan, 0.55)}`,
          }}
        >
          <Icon name="funnel" size={32} color={C.cyan} />
        </div>
        <div style={{ position: 'absolute', left: 96, top: 16, whiteSpace: 'nowrap' }}>
          <div style={{ fontFamily: FONT.sans, fontSize: 36, fontWeight: 800, color: C.textStrong, lineHeight: 1.15 }}>
            Colector SIEM
          </div>
          <div style={{ fontFamily: FONT.sans, fontSize: TYPE.label, fontWeight: 600, color: C.cyanSoft, lineHeight: 1.2, height: 38 }}>
            {typed}
          </div>
        </div>
        <div style={{ position: 'absolute', left: 20, right: 20, top: 112, height: 2, background: C.ink700 }} />
        {/* Empty input slots, waiting for their method to be named */}
        {INPUTS.map((input, i) => {
          const empty = progress(frame, 8, 14) * (1 - progress(frame, inputLitAt(T, input.id), 8));
          if (empty <= 0) return null;
          return (
            <div
              key={`slot-${input.id}`}
              style={{
                position: 'absolute',
                left: 26,
                width: 200,
                top: L.inputRow0 + i * L.inputStep - 1,
                height: 2,
                borderRadius: 1,
                background: C.ink700,
                opacity: empty,
              }}
            />
          );
        })}
        {INPUTS.map((input, i) => {
          const at = inputLitAt(T, input.id);
          const p = progress(frame, at, 14);
          const focus = progress(frame, at, 8) * (1 - progress(frame, at + 44, 16));
          return (
            <div
              key={input.id}
              style={{
                position: 'absolute',
                left: 12,
                right: 12,
                top: L.inputRow0 + i * L.inputStep - 20,
                height: 40,
                borderRadius: 10,
                background: alpha(C.cyan, 0.12 * focus),
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                paddingLeft: 26,
                opacity: p,
                transform: `translateX(${(1 - p) * -18}px)`,
                whiteSpace: 'nowrap',
              }}
            >
              <span style={{ fontFamily: FONT.sans, fontSize: TYPE.label, fontWeight: 750, color: focus > 0.2 ? C.textStrong : C.cyanSoft }}>
                {input.label}
              </span>
              {input.detail ? (
                <span style={{ fontFamily: FONT.mono, fontSize: TYPE.small, fontWeight: 550, color: C.muted }}>{input.detail}</span>
              ) : null}
            </div>
          );
        })}
      </Panel>
    </div>
  );
}

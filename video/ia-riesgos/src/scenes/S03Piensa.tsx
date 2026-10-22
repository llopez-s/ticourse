import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, progress, springIn, typewriter } from '../../../engine/src/theme/motion';
import { Chip, Icon, Panel } from '../../../engine/src/ui';
import { PANEL } from '../data/s03-piensa';
import { GrayLines } from './parts/Bits';
import { Stage, overlayWindow } from './kit';

const S = 's03-piensa';
const W = STAGE.width;
/** Always under the think prompt's band (stage y 10–205). */
const BOX = { w: 1320, h: 400, top: 236 };

/**
 * s03-piensa «¿Basta una línea?». The assistant's instructions panel (gray
 * lines, never readable rules); at `prompt` the team's added line types in,
 * amber, tagged «nueva». The engine's think prompt then takes the top band;
 * the panel stays below it and dims a little while the viewer thinks.
 */
export function S03Piensa(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const prompt = props.cue('prompt');
  const think = overlayWindow(S);

  const panelIn = springIn(frame, fps, Math.max(0, prompt - 20), { damping: 17 });
  const lineIn = progress(frame, prompt + 6, 10);
  const typed = typewriter(PANEL.added, frame, prompt + 10, fps, 30);
  const tag = progress(frame, prompt + 10 + Math.ceil((PANEL.added.length / 30) * fps), 10);
  const thinking = think ? progress(frame, think.from, 12, EASE.inOut) * (1 - progress(frame, think.to - 12, 12)) : 0;

  return (
    <Stage>
      <div
        style={{
          position: 'absolute',
          left: (W - BOX.w) / 2,
          top: BOX.top,
          width: BOX.w,
          height: BOX.h,
          opacity: Math.min(1, panelIn * 1.3) * (1 - 0.3 * thinking),
          transform: `translateY(${(1 - Math.min(1, panelIn)) * 24}px)`,
        }}
      >
        <Panel title={PANEL.title} icon="gear" accent="cyan" glow={0.4 * lineIn * (1 - thinking)} style={{ width: BOX.w, height: BOX.h }}>
          <div style={{ padding: '30px 36px', display: 'flex', flexDirection: 'column', gap: 26 }}>
            <GrayLines widths={[880, 760, 940]} height={20} gap={20} />
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 18,
                height: 92,
                padding: '0 24px',
                borderRadius: RADIUS.md,
                border: `3px solid ${alpha(C.amber, 0.5 + 0.4 * lineIn)}`,
                background: alpha(C.amber, 0.1),
                opacity: lineIn,
                transform: `translateX(${(1 - lineIn) * 18}px)`,
                fontFamily: FONT.sans,
                whiteSpace: 'nowrap',
              }}
            >
              <Icon name="alert" size={44} color={C.amber} />
              <span style={{ fontSize: 44, fontWeight: 800, color: C.textStrong, minWidth: 940 }}>{typed}</span>
              <span style={{ opacity: tag, transform: `scale(${0.8 + 0.2 * tag})` }}>
                <Chip accent="amber" size={30}>
                  {PANEL.addedTag}
                </Chip>
              </span>
            </div>
          </div>
        </Panel>
      </div>
    </Stage>
  );
}

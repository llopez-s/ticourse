import { C, FONT, TYPE, alpha } from '../../../../../engine/src/theme/tokens';
import { springIn } from '../../../../../engine/src/theme/motion';
import { Chip, Icon } from '../../../../../engine/src/ui';
import { NEXT } from '../../../data/s06-recap';

/** The one next step: the lesson's questions. A pill centred on `width`, from `at`. */
export function NextAction({ frame, fps, at, top, width }: { frame: number; fps: number; at: number; top: number; width: number }) {
  if (frame < at - 6) return null;
  const p = springIn(frame, fps, at - 4, { damping: 16 });
  return (
    <div style={{ position: 'absolute', left: 0, top, width, display: 'flex', justifyContent: 'center', opacity: Math.min(1, p * 1.4), transform: `translateY(${(1 - Math.min(1, p)) * 18}px)` }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 22,
          padding: '13px 30px 13px 28px',
          borderRadius: 32,
          background: alpha(C.cyan, 0.08),
          border: `3px solid ${alpha(C.cyan, 0.7)}`,
          boxShadow: `0 0 34px ${alpha(C.cyan, 0.22)}`,
          fontFamily: FONT.sans,
          whiteSpace: 'nowrap',
        }}
      >
        <Icon name="play" size={42} color={C.cyan} strokeWidth={2} />
        <span style={{ fontSize: 46, fontWeight: 850, color: C.textStrong }}>{NEXT.text}</span>
        <Chip accent="cyan" icon="check" size={TYPE.label} solid>
          {NEXT.chip}
        </Chip>
      </div>
    </div>
  );
}

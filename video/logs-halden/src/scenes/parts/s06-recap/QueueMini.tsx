import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { progress, pulse, springIn } from '../../../../../engine/src/theme/motion';
import { Icon } from '../../../../../engine/src/ui';
import { TrailIcon } from '../TrailIcons';
import { QUEUE, TRAILS, TRAIL_ORDER } from '../TrailRow';

/**
 * The end card's art: the morning queue in miniature, its three rows
 * reviewed (an emerald check pops on each from `checkAt`) and a dashed
 * empty row under them — «hasta el próximo rastro». Only icons, times and
 * the header date: no new readable text. Not positioned.
 */
export function QueueMini({ width, frame, fps, checkAt }: { width: number; frame: number; fps: number; checkAt: number }) {
  const rowH = 74;
  const gap = 14;
  const pad = 20;
  const date = QUEUE.headerText.split(' · ').slice(0, 2).join(' · ');
  return (
    <div
      style={{
        width,
        boxSizing: 'border-box',
        padding: pad,
        borderRadius: RADIUS.lg,
        border: `2px solid ${C.ink700}`,
        background: `linear-gradient(180deg, ${alpha(C.ink800, 0.9)} 0%, ${alpha(C.ink900, 0.95)} 100%)`,
        fontFamily: FONT.sans,
      }}
    >
      {/* Header: bell + date */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, height: 40, paddingLeft: 6 }}>
        <Icon name="bell" size={28} color={C.cyan} />
        <span style={{ fontFamily: FONT.mono, fontSize: 26, fontWeight: 800, color: C.cyanSoft, whiteSpace: 'nowrap' }}>{date}</span>
      </div>
      <div style={{ height: 2, background: C.ink700, margin: '12px 0 14px' }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap }}>
        {TRAIL_ORDER.map((k, i) => {
          const c = springIn(frame, fps, checkAt + i * 7, { damping: 13 });
          return (
            <div
              key={k}
              style={{
                position: 'relative',
                height: rowH,
                boxSizing: 'border-box',
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                padding: '0 16px 0 16px',
                borderRadius: 14,
                border: `2px solid ${alpha(C.rose, 0.5)}`,
                background: `linear-gradient(90deg, ${alpha(C.rose, 0.12)} 0%, ${alpha(C.ink850, 0.95)} 45%)`,
                overflow: 'hidden',
              }}
            >
              <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 6, background: C.rose }} />
              <div
                style={{
                  width: rowH - 18,
                  height: rowH - 18,
                  borderRadius: 12,
                  display: 'grid',
                  placeItems: 'center',
                  background: alpha(C.rose, 0.14),
                  border: `2px solid ${alpha(C.rose, 0.7)}`,
                }}
              >
                <TrailIcon kind={k} size={Math.round((rowH - 18) * 0.7)} />
              </div>
              <span style={{ fontFamily: FONT.mono, fontSize: 30, fontWeight: 800, color: C.textStrong }}>{TRAILS[k].time}</span>
              {/* Texture for the description: no readable text */}
              <div style={{ flex: 1, height: 12, borderRadius: 6, background: alpha(C.muted, 0.22), maxWidth: 130 - i * 22 }} />
              <div style={{ flex: 1 }} />
              <div
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: 23,
                  display: 'grid',
                  placeItems: 'center',
                  background: alpha(C.emerald, 0.16),
                  border: `2px solid ${C.emerald}`,
                  opacity: Math.min(1, c * 1.4),
                  transform: `scale(${0.5 + 0.5 * Math.min(1.1, c)})`,
                }}
              >
                <Icon name="check" size={30} color={C.emerald} strokeWidth={2.6} />
              </div>
            </div>
          );
        })}
        {/* The next trail: an empty dashed row */}
        <div
          style={{
            height: rowH - 10,
            boxSizing: 'border-box',
            borderRadius: 14,
            border: `2px dashed ${C.ink600}`,
            display: 'flex',
            alignItems: 'center',
            paddingLeft: 22,
            opacity: progress(frame, checkAt + 24, 14),
          }}
        >
          <div style={{ width: 16, height: 16, borderRadius: 8, background: C.cyan, opacity: 0.35 + 0.5 * pulse(frame, fps, 0.6), boxShadow: `0 0 14px ${alpha(C.cyan, 0.6)}` }} />
        </div>
      </div>
    </div>
  );
}

import { C, FONT, RADIUS, TYPE, alpha } from '../../../../../engine/src/theme/tokens';
import { enter, progress } from '../../../../../engine/src/theme/motion';
import { Chip, Icon, Panel, type IconName } from '../../../../../engine/src/ui';

const ITEMS: { icon: IconName; main: string; sub: string }[] = [
  { icon: 'network', main: 'NetFlow = metadatos', sub: 'packet capture = contenido' },
  { icon: 'gear', main: 'Alert fatigue se cura con alert tuning', sub: 'no desactivando la regla' },
  { icon: 'archive', main: 'Archiving = investigaciones y cumplimiento', sub: 'no para el trabajo diario' },
];

export interface ExamTimes {
  exam: number;
  /** Word frames at which each reflex is spoken (NetFlow, alert, archiving). */
  items: number[];
}

/**
 * Violet "Para el examen" card with the three reflexes, each arriving on its
 * spoken word; the item being spoken is highlighted until the next one.
 */
export function ExamReflexes({ frame, t, width, height }: { frame: number; t: ExamTimes; width: number; height: number }) {
  const card = enter(frame, t.exam - 2, { distance: 24, duration: 18 });
  const glow = progress(frame, t.exam, 12) * (1 - 0.55 * progress(frame, t.items[t.items.length - 1] + 20, 40));

  return (
    <Panel
      title="Para el examen"
      icon="mortarboard"
      accent="violet"
      glow={glow}
      right={
        <Chip accent="violet" size={TYPE.small}>
          SY0-701 · 4.4
        </Chip>
      }
      style={{ width, height, ...card }}
      bodyStyle={{ padding: '26px 28px', display: 'flex', flexDirection: 'column', gap: 16 }}
    >
      {ITEMS.map((item, i) => {
        const at = t.items[i];
        const next = t.items[i + 1];
        // Rows wait as dim placeholders and light up on their word.
        const lit = progress(frame, at - 3, 14);
        const focus = progress(frame, at, 8) * (next === undefined ? 1 : 1 - progress(frame, next - 2, 10));
        return (
          <div
            key={item.main}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 24,
              flex: 1,
              padding: '0 22px',
              borderRadius: RADIUS.md,
              background: alpha(C.violet, 0.04 + 0.1 * focus),
              border: `2px solid ${alpha(C.violet, 0.14 + 0.5 * focus)}`,
              fontFamily: FONT.sans,
              opacity: 0.26 + 0.74 * lit,
              transform: `translateX(${(1 - lit) * 14}px)`,
            }}
          >
            <div
              style={{
                width: 74,
                height: 74,
                borderRadius: 18,
                display: 'grid',
                placeItems: 'center',
                background: alpha(C.violet, 0.14),
                border: `2px solid ${alpha(C.violet, 0.45)}`,
                flexShrink: 0,
              }}
            >
              <Icon name={item.icon} size={40} color={C.violet} strokeWidth={2} />
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 36, fontWeight: 750, color: C.textStrong, lineHeight: 1.15, whiteSpace: 'nowrap' }}>{item.main}</div>
              <div style={{ marginTop: 6, fontSize: 30, fontWeight: 600, color: C.muted, lineHeight: 1.15, whiteSpace: 'nowrap' }}>
                {item.sub}
              </div>
            </div>
          </div>
        );
      })}
    </Panel>
  );
}

import { ACCENT, C, FONT, RADIUS, TYPE, alpha } from '../../../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../../../engine/src/theme/motion';
import { Chip, Icon } from '../../../../../engine/src/ui';
import { EXCLUSION_RECORDS } from '../../../data/s07-tuning';
import { mixColor } from './timing';

/** Height of the band each card behind the front one leaves visible. */
const PEEK = 50;
const HEADER_H = 60;
const LABEL_W = 290;

/**
 * "Cada exclusión se documenta: qué, por qué y quién la aprobó." A small deck
 * of exclusion records, one per noisy pattern; the front one (the backup
 * agent) shows its fields, each lighting up as the narration names it.
 */
export function ExclusionDeck({
  frame,
  top,
  height,
  landAt,
  fieldsAt,
  approvedAt,
}: {
  frame: number;
  top: number;
  height: number;
  landAt: number;
  /** Frame each field (qué, por qué, quién, revisión) is named. */
  fieldsAt: readonly [number, number, number, number];
  approvedAt: number;
}) {
  // Back cards land first so the front record (the backup agent) ends on top.
  const order = [2, 1, 0];
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, top, height }}>
      {order.map((recordIndex, depthFromBack) => {
        const record = EXCLUSION_RECORDS[recordIndex];
        const depth = recordIndex; // 0 = front
        const cardTop = (2 - depth) * PEEK;
        const inset = depth * 18;
        const isFront = depth === 0;
        const land = enter(frame, landAt + depthFromBack * 6, { distance: 36, duration: 14 });
        const approved = isFront ? progress(frame, approvedAt, 12) : 0;
        return (
          <div
            key={record.id}
            style={{
              position: 'absolute',
              left: inset,
              right: inset,
              top: cardTop,
              height: height - cardTop,
              borderRadius: RADIUS.lg,
              background: isFront
                ? `linear-gradient(180deg, ${C.ink800} 0%, ${C.ink900} 100%)`
                : mixColor(C.ink850, C.ink900, depth / 2),
              border: `2px solid ${isFront ? mixColor(C.ink600, C.emerald, 0.35 + 0.4 * approved) : C.ink700}`,
              boxShadow: `0 -10px 30px ${alpha('#000000', 0.35)}`,
              overflow: 'hidden',
              ...land,
            }}
          >
            <div
              style={{
                height: isFront ? HEADER_H : PEEK,
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: '0 24px',
                borderBottom: isFront ? `2px solid ${C.ink700}` : 'none',
                background: isFront ? alpha(C.ink800, 0.9) : 'transparent',
              }}
            >
              <Icon name="file" size={28} color={isFront ? C.emerald : C.faint} />
              <span style={{ fontFamily: FONT.mono, fontSize: TYPE.micro, fontWeight: 700, color: C.muted }}>{record.id}</span>
              <span
                style={{
                  fontFamily: FONT.sans,
                  fontSize: TYPE.small,
                  fontWeight: 700,
                  color: isFront ? C.textStrong : C.muted,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  flex: 1,
                }}
              >
                {record.pattern}
              </span>
              {isFront && approved > 0 ? (
                <span style={{ opacity: approved }}>
                  <Chip accent="emerald" icon="check" size={TYPE.small}>
                    aprobada
                  </Chip>
                </span>
              ) : null}
            </div>
            {isFront ? (
              <div style={{ padding: '10px 26px 0' }}>
                {record.fields.map((field, i) => {
                  const lit = progress(frame, fieldsAt[i] - 2, 10, EASE.out);
                  return (
                    <div
                      key={field.label}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        height: 70,
                        borderBottom: i < record.fields.length - 1 ? `1px solid ${C.ink700}` : 'none',
                      }}
                    >
                      <div
                        style={{
                          width: LABEL_W,
                          fontFamily: FONT.sans,
                          fontSize: TYPE.label,
                          fontWeight: 750,
                          color: mixColor(C.faint, ACCENT.cyan.soft, lit),
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {field.label}
                      </div>
                      <div
                        style={{
                          fontFamily: FONT.sans,
                          fontSize: 28,
                          fontWeight: 550,
                          color: C.text,
                          whiteSpace: 'nowrap',
                          opacity: 0.25 + 0.75 * lit,
                        }}
                      >
                        {field.value}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

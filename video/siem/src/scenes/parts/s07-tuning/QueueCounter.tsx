import { ACCENT, C, FONT, RADIUS, TYPE, alpha } from '../../../theme/tokens';
import { EASE, countUp, fadeIn, fmtInt, lerp, progress } from '../../../theme/motion';
import { Icon, type IconName } from '../../../ui';
import { QUEUE_AFTER_DEDUP, QUEUE_AFTER_EXCLUDE, QUEUE_BEFORE } from '../../../data/s07-tuning';
import { mixColor } from './timing';

export const COMPACT_H = 132;

export interface CounterTimes {
  /** Card grows to hero size / shrinks back to a strip. */
  growAt: number;
  shrinkAt: number;
  /** "Excluidos los tres patrones" (row 2 label). */
  excludedAt: number;
  count1320: number;
  /** "Deduplicar y agrupar" (row 3 label). */
  dedupAt: number;
  count400: number;
}

function Step({
  top,
  icon,
  label,
  sub,
  value,
  valueIn,
  appear,
  active,
  accent,
}: {
  top: number;
  icon: IconName;
  label: string;
  sub: string;
  value: string;
  valueIn: number;
  appear: number;
  active: number;
  accent: string;
}) {
  return (
    <div
      style={{
        position: 'absolute',
        left: 30,
        right: 30,
        top,
        height: 88,
        display: 'flex',
        alignItems: 'center',
        gap: 20,
        padding: '0 22px',
        borderRadius: RADIUS.md,
        background: alpha(accent, 0.1 * active),
        border: `2px solid ${mixColor(C.ink700, accent, 0.25 + 0.6 * active)}`,
        opacity: appear * (0.5 + 0.5 * active),
        transform: `translateY(${(1 - appear) * 16}px)`,
      }}
    >
      <Icon name={icon} size={34} color={mixColor(C.muted, accent, active)} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: FONT.sans, fontSize: TYPE.label, fontWeight: 700, color: C.textStrong, whiteSpace: 'nowrap' }}>{label}</div>
        <div style={{ fontFamily: FONT.sans, fontSize: TYPE.small, fontWeight: 550, color: C.muted, whiteSpace: 'nowrap', marginTop: 2 }}>
          {sub}
        </div>
      </div>
      <div
        style={{
          fontFamily: FONT.mono,
          fontSize: 38,
          fontWeight: 750,
          color: mixColor(C.muted, accent, active),
          whiteSpace: 'nowrap',
          opacity: valueIn,
        }}
      >
        {value}
      </div>
    </div>
  );
}

/**
 * The alert queue's daily volume. It sits as a compact strip at the top of the
 * right column, grows into the hero counter for 6.000 then 1.320 then 400 / día
 * (with the three steps that got it there) and shrinks back afterwards.
 */
export function QueueCounter({
  frame,
  t,
  width,
  fullHeight,
  dim,
}: {
  frame: number;
  t: CounterTimes;
  width: number;
  fullHeight: number;
  dim: number;
}) {
  const grow = progress(frame, t.growAt, 18, EASE.inOut) * (1 - progress(frame, t.shrinkAt, 16, EASE.inOut));
  const height = lerp(grow, [0, 1], [COMPACT_H, fullHeight]);
  const compactOp = 1 - Math.min(1, grow * 2.2);
  const fullOp = Math.max(0, grow * 2 - 1);

  const value =
    frame < t.count400
      ? countUp(frame, t.count1320, 20, QUEUE_BEFORE, QUEUE_AFTER_EXCLUDE)
      : countUp(frame, t.count400, 22, QUEUE_AFTER_EXCLUDE, QUEUE_AFTER_DEDUP);
  const toCyan = progress(frame, t.count1320, 20, EASE.inOut);
  const toEmerald = progress(frame, t.count400, 22, EASE.inOut);
  // amber -> white -> cyan (a direct blend would pass through a misleading green), then cyan -> emerald.
  const toward = toCyan < 0.5 ? mixColor(C.amber, C.textStrong, toCyan * 2) : mixColor(C.textStrong, C.cyan, toCyan * 2 - 1);
  const color = mixColor(toward, C.emerald, toEmerald);
  const tuned = frame >= t.count400 + 10;

  // Steps: 6.000 (sin afinar) -> 1.320 (tras excluir) -> 400 (deduplicar y agrupar).
  const a2 = progress(frame, t.count1320, 12) * (1 - progress(frame, t.count400, 12));
  const a1 = 1 - progress(frame, t.count1320, 12);
  const a3 = progress(frame, t.count400, 12);

  const barW = width - 60;
  const share = value / QUEUE_BEFORE;

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width,
        height,
        borderRadius: RADIUS.lg,
        background: `linear-gradient(180deg, ${C.ink850} 0%, ${C.ink900} 100%)`,
        border: `2px solid ${grow > 0.05 ? mixColor(C.ink700, color, 0.35 + 0.35 * grow) : C.ink700}`,
        boxShadow: `0 24px 60px ${alpha('#000000', 0.3)}${grow > 0 ? `, 0 0 ${40 * grow}px ${alpha(color, 0.18 * grow)}` : ''}`,
        overflow: 'hidden',
        opacity: dim,
      }}
    >
      {/* Compact strip */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          height: COMPACT_H,
          display: 'flex',
          alignItems: 'center',
          gap: 22,
          padding: '0 30px',
          opacity: compactOp,
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 16,
            display: 'grid',
            placeItems: 'center',
            background: alpha(color, 0.12),
            border: `2px solid ${alpha(color, 0.45)}`,
            flexShrink: 0,
          }}
        >
          <Icon name="bell" size={34} color={color} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: FONT.sans, fontSize: TYPE.small, fontWeight: 750, color: C.muted, letterSpacing: 1.5 }}>COLA DE ALERTAS</div>
          <div style={{ fontFamily: FONT.sans, fontSize: TYPE.small, fontWeight: 550, color: C.faint, marginTop: 4 }}>
            {tuned ? 'tras afinar' : 'sin afinar'}
          </div>
        </div>
        <div style={{ fontFamily: FONT.sans, whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' }}>
          <span style={{ fontSize: 76, fontWeight: 800, color, letterSpacing: -1 }}>{fmtInt(value)}</span>
          <span style={{ fontSize: 32, fontWeight: 650, color: C.muted, marginLeft: 10 }}>/ día</span>
        </div>
      </div>

      {/* Hero counter */}
      {fullOp > 0 ? (
        <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: fullHeight, opacity: fullOp }}>
          <div style={{ position: 'absolute', left: 30, top: 26, display: 'flex', alignItems: 'center', gap: 12 }}>
            <Icon name="bell" size={30} color={color} />
            <span style={{ fontFamily: FONT.sans, fontSize: TYPE.small, fontWeight: 750, color: C.muted, letterSpacing: 1.5 }}>
              COLA DE ALERTAS · MEDIA DIARIA
            </span>
          </div>
          <div
            style={{
              position: 'absolute',
              left: 30,
              top: 76,
              fontFamily: FONT.sans,
              whiteSpace: 'nowrap',
              fontVariantNumeric: 'tabular-nums',
              lineHeight: 1,
            }}
          >
            <span style={{ fontSize: 120, fontWeight: 800, color, letterSpacing: -2 }}>{fmtInt(value)}</span>
            <span style={{ fontSize: 50, fontWeight: 650, color: C.muted, marginLeft: 16 }}>/ día</span>
          </div>

          {/* Volume bar: 6.000 outline, current volume filled, excluded part hatched. */}
          <div style={{ position: 'absolute', left: 30, top: 222, width: barW, height: 40 }}>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: 10,
                border: `2px dashed ${alpha(C.amber, 0.45)}`,
                backgroundImage: `repeating-linear-gradient(135deg, ${alpha(C.amber, 0.14)} 0 10px, transparent 10px 20px)`,
                opacity: progress(frame, t.count1320, 16),
              }}
            />
            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: Math.max(10, barW * share), borderRadius: 10, background: color }} />
          </div>

          <Step
            top={296}
            icon="bell"
            label="sin afinar"
            sub="la cola de siempre"
            value={fmtInt(QUEUE_BEFORE)}
            valueIn={1}
            appear={fadeIn(frame, t.growAt + 8, 12)}
            active={a1}
            accent={C.amber}
          />
          <Step
            top={398}
            icon="funnel"
            label="tras excluir los 3 patrones"
            sub="copias · escáner · balanceador"
            value={fmtInt(QUEUE_AFTER_EXCLUDE)}
            valueIn={fadeIn(frame, t.count1320 + 12, 8)}
            appear={fadeIn(frame, t.excludedAt, 12)}
            active={a2}
            accent={ACCENT.cyan.fg}
          />
          <Step
            top={500}
            icon="merge"
            label="deduplicar y agrupar"
            sub="eventos relacionados, una alerta"
            value={fmtInt(QUEUE_AFTER_DEDUP)}
            valueIn={fadeIn(frame, t.count400 + 14, 8)}
            appear={fadeIn(frame, t.dedupAt, 12)}
            active={a3}
            accent={C.emerald}
          />
        </div>
      ) : null}
    </div>
  );
}

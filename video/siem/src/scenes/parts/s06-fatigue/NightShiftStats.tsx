import type { CSSProperties, ReactNode } from 'react';
import { ACCENT, C, FONT, RADIUS, TYPE, alpha, type Accent } from '../../../theme/tokens';
import { EASE, countUp, enter, fmtInt, lerp, progress } from '../../../theme/motion';
import { Counter, Icon, type IconName } from '../../../ui';
import { CLOSED_UNREAD, CLOSED_UNREAD_PCT, DAILY_ALERTS } from '../../../data/s06-fatigue';

function Card({
  top,
  height,
  accent,
  focus,
  dim,
  style,
  children,
}: {
  top: number;
  height: number;
  accent: Accent;
  focus: number;
  dim: number;
  style: CSSProperties;
  children: ReactNode;
}) {
  const a = ACCENT[accent];
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top,
        height,
        padding: '24px 30px',
        borderRadius: RADIUS.lg,
        background: `linear-gradient(180deg, ${C.ink850} 0%, ${C.ink900} 100%)`,
        border: `2px solid ${focus > 0 ? alpha(a.fg, 0.3 + 0.5 * focus) : C.ink700}`,
        boxShadow: `0 24px 60px ${alpha('#000000', 0.3)}${focus > 0 ? `, 0 0 ${36 * focus}px ${alpha(a.fg, 0.28 * focus)}` : ''}`,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        ...style,
        opacity: (style.opacity === undefined ? 1 : Number(style.opacity)) * dim,
      }}
    >
      {children}
    </div>
  );
}

function Label({ icon, color, children }: { icon: IconName; color: string; children: ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
      <Icon name={icon} size={30} color={color} />
      <span style={{ fontFamily: FONT.sans, fontSize: TYPE.small, fontWeight: 700, color: C.muted, letterSpacing: 1.5 }}>
        {children}
      </span>
    </div>
  );
}

/**
 * Right-hand column of the queue view: the daily volume, what the night shift
 * does with it (90 % closed unread) and the name of the problem.
 */
export function NightShiftStats({
  frame,
  queue,
  close,
  fatigueAt,
  left,
  width,
}: {
  frame: number;
  queue: number;
  close: number;
  fatigueAt: number;
  left: number;
  width: number;
}) {
  // Mounted during the wipe; the tally races up (ease-in) and lands on 6.000 as the voice says it.
  const tallyFrom = Math.min(12, queue - 20);
  const total = DAILY_ALERTS * progress(frame, tallyFrom, queue + 30 - tallyFrom, EASE.in);
  const pct = countUp(frame, close + 8, 16, 0, CLOSED_UNREAD_PCT);
  const closed = countUp(frame, close + 8, 16, 0, CLOSED_UNREAD);

  const focus1 = progress(frame, queue - 4, 12) * (1 - progress(frame, close + 4, 12));
  const focus2 = progress(frame, close + 8, 12) * (1 - progress(frame, fatigueAt - 4, 12));
  const focus3 = progress(frame, fatigueAt - 4, 12);
  const dim1 = 1 - 0.4 * progress(frame, close + 4, 14);
  const dim2 = 1 - 0.35 * progress(frame, fatigueAt - 4, 14);

  // While it is the only card, the tally sits big in the middle of the column;
  // it glides up to make room as the night-shift card arrives.
  const settle = progress(frame, close - 4, 14, EASE.inOut);
  const tallyTop = lerp(settle, [0, 1], [180, 0]);
  const tallyH = lerp(settle, [0, 1], [300, 200]);
  const tallySize = lerp(settle, [0, 1], [132, 104]);

  return (
    <div style={{ position: 'absolute', left, top: 0, width, height: 660 }}>
      <Card top={tallyTop} height={tallyH} accent="cyan" focus={focus1} dim={dim1} style={enter(frame, tallyFrom - 4, { distance: 24 })}>
        <Label icon="bell" color={C.cyan}>
          ALERTAS EN LA CONSOLA
        </Label>
        <Counter value={total} unit="/ día" size={tallySize} />
      </Card>

      <Card top={220} height={224} accent="amber" focus={focus2} dim={dim2} style={enter(frame, close + 8, { distance: 24 })}>
        <Label icon="clock" color={C.amber}>
          TURNO DE NOCHE
        </Label>
        <div style={{ display: 'flex', alignItems: 'center', gap: 26 }}>
          <div
            style={{
              fontFamily: FONT.sans,
              fontSize: 96,
              fontWeight: 800,
              color: C.amber,
              lineHeight: 1,
              letterSpacing: -1,
              fontVariantNumeric: 'tabular-nums',
              whiteSpace: 'nowrap',
              minWidth: 214,
            }}
          >
            {`${Math.round(pct)} %`}
          </div>
          <div>
            <div style={{ fontFamily: FONT.mono, fontSize: 44, fontWeight: 750, color: ACCENT.amber.soft, lineHeight: 1.05 }}>
              {fmtInt(closed)}
            </div>
            <div style={{ fontFamily: FONT.sans, fontSize: TYPE.label, fontWeight: 650, color: C.text, marginTop: 4 }}>
              cerradas sin abrir
            </div>
          </div>
        </div>
        <div style={{ marginTop: 18, height: 12, borderRadius: 6, background: alpha(C.cyan, 0.35), overflow: 'hidden' }}>
          <div style={{ width: `${pct}%`, height: '100%', background: C.amber }} />
        </div>
      </Card>

      <Card top={464} height={196} accent="amber" focus={focus3} dim={1} style={enter(frame, fatigueAt - 4, { distance: 24 })}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <div
            style={{
              width: 84,
              height: 84,
              borderRadius: 20,
              display: 'grid',
              placeItems: 'center',
              background: alpha(C.amber, 0.12),
              border: `2px solid ${alpha(C.amber, 0.5)}`,
              flexShrink: 0,
            }}
          >
            <Icon name="alert" size={50} color={C.amber} />
          </div>
          <div>
            <div style={{ fontFamily: FONT.sans, fontSize: TYPE.h2, fontWeight: 800, color: C.amber, lineHeight: 1.05 }}>alert fatigue</div>
            <div style={{ fontFamily: FONT.sans, fontSize: TYPE.label, fontWeight: 600, color: C.muted, marginTop: 6 }}>
              fatiga de alertas
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

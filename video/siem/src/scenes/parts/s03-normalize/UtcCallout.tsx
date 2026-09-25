import { interpolateColors } from 'remotion';
import { C, FONT, TYPE } from '../../../theme/tokens';
import { EASE, progress } from '../../../theme/motion';
import { Chip, Icon, Panel } from '../../../ui';
import { UTC_BEAT } from '../../../data/s03-normalize';
import { COL, L, type S03Timing } from './layout';

/**
 * The time beat: "10:14 · hora de Halden (UTC+1)" becomes "09:14 UTC" and
 * an arrow ties it to the schema's time column.
 */
export function UtcCallout({ frame, T }: { frame: number; T: S03Timing }) {
  const show = progress(frame, T.utc, 14);
  if (show <= 0) return null;
  const shift = progress(frame, T.wShift, 12);
  const roll = progress(frame, T.wRoll, 12, EASE.inOut);
  const utcWord = progress(frame, T.wUtc, 12);
  const color = interpolateColors(roll, [0, 1], [C.amber, C.emerald]);
  const { x, y, w, h } = L.callout;
  const arrowX = COL.hora.x + 60;
  const arrowTop = y + h + 6;
  const arrowBottom = L.tableY - 4;

  const bigNumber = (text: string, o: number, dy: number) => (
    <span
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        fontFamily: FONT.mono,
        fontSize: TYPE.hero,
        fontWeight: 750,
        lineHeight: '124px',
        letterSpacing: -2,
        color,
        opacity: o,
        transform: `translateY(${dy}px)`,
      }}
    >
      {text}
    </span>
  );

  return (
    <>
      <div style={{ position: 'absolute', left: x, top: y, width: w, height: h, opacity: show, transform: `translateY(${(1 - show) * 18}px)` }}>
        <Panel accent={roll > 0.5 ? 'emerald' : 'amber'} glow={0.55} style={{ width: '100%', height: '100%' }}>
          <div style={{ position: 'absolute', left: 30, top: 18, display: 'flex', alignItems: 'center', gap: 12 }}>
            <Icon name="clock" size={30} color={color} />
            <span style={{ fontFamily: FONT.sans, fontSize: TYPE.small, fontWeight: 700, color: C.muted, letterSpacing: 1 }}>HORA DEL EVENTO</span>
          </div>
          {/* Big time */}
          <div style={{ position: 'absolute', left: 30, top: 70, width: 330, height: 124, overflow: 'hidden' }}>
            {bigNumber(UTC_BEAT.local, 1 - roll, -roll * 60)}
            {bigNumber(UTC_BEAT.utc, roll, (1 - roll) * 60)}
          </div>
          {/* Shift chip */}
          <div style={{ position: 'absolute', left: 58, top: 196, opacity: shift * (1 - 0.5 * utcWord), transform: `translateY(${(1 - shift) * 8}px)` }}>
            <Chip accent="muted" icon="arrowDown" size={TYPE.small}>
              {UTC_BEAT.shift}
            </Chip>
          </div>
          {/* Right column: local label, then UTC */}
          <div style={{ position: 'absolute', left: 390, top: 76, right: 24, height: 150 }}>
            <div style={{ position: 'absolute', left: 0, top: 0, opacity: 1 - roll, transform: `translateY(${-roll * 20}px)` }}>
              <div style={{ fontFamily: FONT.sans, fontSize: TYPE.h3, fontWeight: 750, color: C.textStrong, whiteSpace: 'nowrap' }}>
                {UTC_BEAT.localLabel}
              </div>
              <div style={{ marginTop: 12 }}>
                <Chip accent="amber" size={TYPE.label}>
                  {UTC_BEAT.offset}
                </Chip>
              </div>
            </div>
            <div style={{ position: 'absolute', left: 0, top: 0, opacity: roll, transform: `translateY(${(1 - roll) * 20}px)` }}>
              <div style={{ fontFamily: FONT.sans, fontSize: TYPE.h1, fontWeight: 850, color: C.emerald, lineHeight: 1, whiteSpace: 'nowrap' }}>
                UTC
              </div>
              <div style={{ marginTop: 14, fontFamily: FONT.sans, fontSize: TYPE.small, fontWeight: 600, color: C.text, whiteSpace: 'nowrap' }}>
                {UTC_BEAT.utcNote}
              </div>
            </div>
          </div>
        </Panel>
      </div>
      {/* Arrow into the time column */}
      <div
        style={{
          position: 'absolute',
          left: arrowX - 2,
          top: arrowTop,
          width: 4,
          height: (arrowBottom - arrowTop - 20) * show,
          borderRadius: 2,
          background: color,
          opacity: show,
        }}
      />
      <div style={{ position: 'absolute', left: arrowX - 16, top: arrowBottom - 30, opacity: show }}>
        <Icon name="arrowDown" size={32} color={color} strokeWidth={2.6} />
      </div>
    </>
  );
}

import { interpolateColors } from 'remotion';
import { C, FONT, TYPE, alpha } from '../../../theme/tokens';
import { EASE, enter, progress } from '../../../theme/motion';
import { Chip, Icon, Panel } from '../../../ui';
import { STORE_LINES } from '../../../data/s02-collect';
import { L } from './layout';
import { packetArrival, type S02Timing } from './timing';

/** Lines that change place when the clocks agree, ranked by their true order (re-entry stagger). */
const MOVERS = STORE_LINES.map((line, arrivalIndex) => ({ line, arrivalIndex }))
  .filter(({ line, arrivalIndex }) => line.order !== arrivalIndex)
  .sort((a, b) => a.line.order - b.line.order)
  .map(({ line }) => line.id);

const FIRST_ARRIVAL = (T: S02Timing) => Math.min(...STORE_LINES.map((line) => packetArrival(T, line.link, line.packet)));

/**
 * The central copy ("copia central"). Lines arrive with the timestamps of
 * their drifting source clocks, out of order; at NTP the times agree and the
 * misplaced lines step out and re-enter in true order (lines already in place
 * stay put, so the eye sees what moved). At the end it is the copy that
 * survives: the two domain-controller lines are outlined in emerald.
 */
export function Store({ frame, T }: { frame: number; T: S02Timing }) {
  const e = enter(frame, 5, { distance: 24, axis: 'x' });
  const warn = progress(frame, T.ntp - 32, 10);
  const sync = progress(frame, T.ntp, 10);
  const out = progress(frame, T.ntp + 2, 7, EASE.in);
  const flipAt = T.ntp + 9;
  const survive = progress(frame, T.wipe + 48, 14);
  const central = progress(frame, T.wipe + 86, 16);
  const converge = progress(frame, T.converge + 20, 16) * (1 - 0.8 * progress(frame, T.ntp + 20, 24));
  const glow = Math.max(converge * 0.8, central);
  const timeColor = interpolateColors(warn + sync, [0, 1, 2], [C.text, C.amber, C.emerald]);
  const inOrder = progress(frame, flipAt + MOVERS.length * 3 + 4, 12);
  const first = FIRST_ARRIVAL(T);
  const waiting = progress(frame, 10, 12) * (1 - progress(frame, first - 8, 8));

  return (
    <div
      style={{
        position: 'absolute',
        left: L.colX,
        top: L.storeY,
        width: L.colW,
        height: L.storeH,
        opacity: e.opacity,
        transform: e.transform,
      }}
    >
      <Panel glow={glow} accent={central > 0 ? 'emerald' : 'cyan'} style={{ width: '100%', height: '100%' }}>
        <div style={{ position: 'absolute', left: 22, right: 18, top: 12, height: 44, display: 'flex', alignItems: 'center', gap: 14 }}>
          <Icon name="database" size={32} color={central > 0.5 ? C.emerald : C.cyan} />
          <span style={{ fontFamily: FONT.sans, fontSize: TYPE.label, fontWeight: 750, color: C.textStrong, whiteSpace: 'nowrap' }}>
            copia central
          </span>
          <div style={{ marginLeft: 'auto', opacity: inOrder, transform: `translateY(${(1 - inOrder) * 8}px)` }}>
            <Chip accent="emerald" icon="check" size={TYPE.small}>
              en orden
            </Chip>
          </div>
        </div>
        <div style={{ position: 'absolute', left: 16, right: 16, top: 58, height: 2, background: C.ink700 }} />
        {waiting > 0 ? (
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 60,
              bottom: 0,
              display: 'grid',
              placeItems: 'center',
              opacity: waiting,
              fontFamily: FONT.sans,
              fontSize: TYPE.small,
              fontWeight: 550,
              color: C.faint,
              whiteSpace: 'nowrap',
            }}
          >
            esperando registros
          </div>
        ) : null}
        {STORE_LINES.map((line, arrivalIndex) => {
          const at = packetArrival(T, line.link, line.packet);
          const p = progress(frame, at, 12);
          if (p <= 0) return null;
          const rank = MOVERS.indexOf(line.id);
          const moves = rank >= 0;
          const flipped = moves && frame >= flipAt;
          const back = moves ? progress(frame, flipAt + rank * 3, 8) : 1;
          const slot = flipped ? line.order : arrivalIndex;
          const presence = !moves ? 1 : flipped ? back : 1 - out;
          const shift = !moves ? 0 : flipped ? (1 - back) * 18 : out * 18;
          const kept = line.dc ? survive : 0;
          const focusDim = line.dc ? 1 : 1 - 0.55 * survive;
          return (
            <div
              key={line.id}
              style={{
                position: 'absolute',
                left: 12,
                right: 12,
                top: L.storeRow0 + slot * L.storeStep,
                height: L.storeStep - 3,
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                paddingLeft: 12,
                borderRadius: 8,
                opacity: p * presence * focusDim,
                transform: `translateX(${(1 - p) * -14 + shift}px)`,
                background: kept > 0 ? alpha(C.emerald, 0.12 * kept) : 'transparent',
                boxShadow: kept > 0 ? `inset 0 0 0 2px ${alpha(C.emerald, 0.7 * kept)}` : 'none',
                whiteSpace: 'nowrap',
              }}
            >
              <span style={{ position: 'relative', width: 118, height: 30, fontFamily: FONT.mono, fontSize: 24, fontWeight: 600 }}>
                <span style={{ position: 'absolute', left: 0, top: 0, lineHeight: '30px', color: timeColor, opacity: 1 - sync }}>{line.drifted}</span>
                <span style={{ position: 'absolute', left: 0, top: 0, lineHeight: '30px', color: timeColor, opacity: sync }}>{line.synced}</span>
              </span>
              <span style={{ width: 104, fontFamily: FONT.mono, fontSize: 24, fontWeight: 600, color: line.dc && kept > 0.5 ? C.textStrong : C.cyanSoft }}>
                {line.host}
              </span>
              <span style={{ fontFamily: FONT.sans, fontSize: 24, fontWeight: 500, color: line.dc && kept > 0.5 ? C.text : C.muted }}>{line.what}</span>
            </div>
          );
        })}
      </Panel>
    </div>
  );
}

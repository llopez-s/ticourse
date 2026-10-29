import { C, alpha } from '../../../../engine/src/theme/tokens';
import { progress } from '../../../../engine/src/theme/motion';
import { Icon } from '../../../../engine/src/ui';
import { S04_CMF } from '../../data/s04-madurez';
import { Bus } from './Figures';
import { Neighbourhoods } from './Neighbourhoods';

export const ART_H = 144;

/**
 * Stage 1, reactivo: one loose bus and breakdown notices that go out one by
 * one. `show` is the presence, `out` the frame the notices start to go out.
 */
export function ReactiveArt({ frame, at, outAt, dim = 0 }: { frame: number; at: number; outAt: number; dim?: number }) {
  const show = progress(frame, at, 16);
  return (
    <div style={{ position: 'relative', width: 460 - 44, height: ART_H, opacity: show * (1 - 0.65 * dim) }}>
      <div style={{ position: 'absolute', left: 10, top: 28, transform: `translateX(${(1 - show) * -60}px)` }}>
        <Bus width={190} tone={C.amber} />
      </div>
      {[0, 1, 2].map((k) => {
        const on = 1 - progress(frame, outAt + k * 14, 14);
        const pop = progress(frame, at + 8 + k * 8, 12);
        return (
          <div
            key={k}
            style={{
              position: 'absolute',
              left: 240 + k * 62,
              top: 18 + (k % 2) * 56,
              width: 52,
              height: 52,
              borderRadius: 14,
              display: 'grid',
              placeItems: 'center',
              border: `3px solid ${alpha(on > 0.5 ? C.amber : C.ink500, 0.9)}`,
              background: alpha(on > 0.5 ? C.amber : C.ink700, 0.16),
              opacity: pop * (0.35 + 0.65 * on),
              transform: `scale(${0.7 + 0.3 * pop})`,
            }}
          >
            <Icon name="alert" size={32} color={on > 0.5 ? C.amber : C.ink500} />
          </div>
        );
      })}
    </div>
  );
}

/**
 * Stage 2, en desarrollo: three lines with a timetable (a clock and ticks) that
 * then lie over a map of four districts, one of which has no line.
 */
export function ScheduledArt({ frame, at, mapAt, dim = 0 }: { frame: number; at: number; mapAt: number; dim?: number }) {
  const show = progress(frame, at, 16);
  const toMap = progress(frame, mapAt, 20);
  return (
    <div style={{ position: 'relative', width: 560 - 44, height: ART_H, opacity: show * (1 - 0.65 * dim) }}>
      <div style={{ position: 'absolute', inset: 0, opacity: 1 - toMap }}>
        {[0, 1, 2].map((k) => {
          const p = progress(frame, at + 6 + k * 10, 18);
          return (
            <div key={k} style={{ position: 'absolute', left: 0, top: 10 + k * 44, width: 516, height: 36, display: 'flex', alignItems: 'center', gap: 12 }}>
              <Icon name="clock" size={32} color={C.cyan} />
              <svg width={456} height={30} viewBox="0 0 456 30" aria-hidden>
                <line x1="0" y1="15" x2={456 * p} y2="15" stroke={C.cyan} strokeWidth="6" strokeLinecap="round" />
                {[0, 1, 2, 3, 4, 5].map((t) => (
                  <circle key={t} cx={10 + t * 87} cy="15" r="7" fill={C.ink950} stroke={C.cyan} strokeWidth="3.5" opacity={p > t / 6 ? 1 : 0} />
                ))}
              </svg>
            </div>
          );
        })}
      </div>
      <div style={{ position: 'absolute', left: 0, top: 6, opacity: toMap }}>
        <Neighbourhoods width={516} height={118} cols={4} gutter={14} line={[progress(frame, mapAt + 8, 22), progress(frame, mapAt + 20, 22), progress(frame, mapAt + 32, 22), 0]} gap={3} gapLabel={S04_CMF.gap} seed={4} />
      </div>
    </div>
  );
}

/** A tiny hospital or school in a rounded tile: generic, no names. */
function CityTile({ kind, x, y, p }: { kind: 'hospital' | 'school'; x: number; y: number; p: number }) {
  return (
    <g transform={`translate(${x} ${y})`} opacity={p}>
      <rect x="0" y="0" width="52" height="52" rx="12" fill={alpha(C.sky, 0.14)} stroke={C.sky} strokeWidth="3.5" />
      {kind === 'hospital' ? (
        <path d="M26 12 V40 M12 26 H40" stroke={C.sky} strokeWidth="7" strokeLinecap="round" />
      ) : (
        <>
          <path d="M8 24 L26 10 L44 24" fill="none" stroke={C.sky} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="14" y="26" width="24" height="16" rx="3" fill="none" stroke={C.sky} strokeWidth="4" />
        </>
      )}
    </g>
  );
}

/**
 * Stage 3, maduro: our network wired into the rest of the city (a hospital and
 * a school, no names) and a second network, someone else's, linked to ours.
 */
export function IntegratedArt({ frame, at, otherAt, dim = 0 }: { frame: number; at: number; otherAt: number; dim?: number }) {
  const show = progress(frame, at, 16);
  const ours = [
    [60, 72],
    [128, 34],
    [128, 112],
    [200, 72],
    [268, 36],
  ] as const;
  const edges = [
    [0, 1],
    [0, 2],
    [1, 3],
    [2, 3],
    [3, 4],
  ] as const;
  const city = progress(frame, at + 22, 18);
  const other = progress(frame, otherAt, 20);
  return (
    <div style={{ position: 'relative', width: 660 - 44, height: ART_H, opacity: show * (1 - 0.65 * dim) }}>
      <svg width={616} height={ART_H} viewBox="0 0 616 144" style={{ position: 'absolute', left: 0, top: 0 }} aria-hidden>
        {edges.map(([a, b], i) => (
          <line key={i} x1={ours[a][0]} y1={ours[a][1]} x2={ours[b][0]} y2={ours[b][1]} stroke={C.emerald} strokeWidth="5" strokeLinecap="round" opacity={progress(frame, at + i * 4, 14)} />
        ))}
        {ours.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="14" fill={C.ink950} stroke={C.emerald} strokeWidth="5" opacity={progress(frame, at + i * 4, 12)} />
        ))}
        {/* wiring into the city */}
        <path d="M268 36 C 320 36, 330 24, 372 24" fill="none" stroke={C.emerald} strokeWidth="5" strokeLinecap="round" opacity={city} />
        <path d="M200 72 C 280 84, 320 108, 372 108" fill="none" stroke={C.emerald} strokeWidth="5" strokeLinecap="round" opacity={city} />
        <CityTile kind="hospital" x={372} y={0} p={city} />
        <CityTile kind="school" x={372} y={84} p={city} />
        {/* someone else's network, linked to ours */}
        <g opacity={other}>
          <path d="M268 36 C 330 -4, 470 60, 516 44" fill="none" stroke={C.violet} strokeWidth="5" strokeDasharray="2 11" strokeLinecap="round" />
          <line x1="516" y1="44" x2="580" y2="84" stroke={C.violet} strokeWidth="5" strokeLinecap="round" />
          <line x1="516" y1="44" x2="548" y2="118" stroke={C.violet} strokeWidth="5" strokeLinecap="round" />
          <line x1="580" y1="84" x2="548" y2="118" stroke={C.violet} strokeWidth="5" strokeLinecap="round" />
          {[
            [516, 44],
            [580, 84],
            [548, 118],
          ].map(([x, y]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r="13" fill={C.ink950} stroke={C.violet} strokeWidth="5" />
          ))}
        </g>
      </svg>
    </div>
  );
}

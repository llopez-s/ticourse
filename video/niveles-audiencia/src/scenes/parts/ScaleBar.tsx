import { C, FONT, alpha } from '../../../../engine/src/theme/tokens';
import { progress } from '../../../../engine/src/theme/motion';
import { Icon, clamp01 } from '../../../../engine/src/ui';
import { SCALE_ARROW, S05, STOPS } from '../../data/niveles';

/**
 * The Sliding Scale as a bar: five stops from left to right (Architecture, Passive Defense, Active
 * Defense, Intelligence, Offense), numbered nodes on a rail that ends in an arrow, the stop's name
 * under each. Frames are the scene's. Height of the nodes+labels block: BAR_H. Below it, when asked
 * for, the arrow's sentence (s04) or the two halves (s05: «base, mejor retorno» / «solo rinde si la
 * base existe»).
 */
export const BAR_H = 150;
const NODE = 26;

export function ScaleBar({
  width,
  frame,
  at,
  focus = [0, 0, 0, 0, 0],
  off = 0,
  answer = 0,
  arrow = 0,
  halves = [0, 0],
  labelSize = 32,
}: {
  width: number;
  frame: number;
  /** Frame each stop is built (very negative: already there). */
  at: readonly number[];
  /** 0–1 per stop: the one the voice is on. */
  focus?: readonly number[];
  /** 0–1: every stop switched off (the question is open). */
  off?: number;
  /** 0–1: the Passive Defense stop in emerald (the answer). */
  answer?: number;
  /** 0–1: the arrow's sentence (s04). */
  arrow?: number;
  /** 0–1 each: the two halves (s05). */
  halves?: readonly [number, number];
  labelSize?: number;
}) {
  const step = width / 5;
  const cx = (i: number) => step * (i + 0.5);
  const built = STOPS.map((_, i) => progress(frame, at[i], 14));
  // The rail fills up to the last built stop that is not Offense (Offense stays dark and locked).
  const fillTo = cx(0) + step * (built[1] + built[2] + built[3]) * (built[0] > 0.01 ? 1 : 0);
  const dimAll = clamp01(off);
  return (
    <div style={{ position: 'relative', width, height: BAR_H + (arrow > 0.01 || halves[0] > 0.01 || halves[1] > 0.01 ? 190 : 0), fontFamily: FONT.sans }}>
      {/* rail */}
      <svg width={width} height={NODE * 2 + 8} viewBox={`0 0 ${width} ${NODE * 2 + 8}`} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} aria-hidden>
        <path d={`M${cx(0)} ${NODE + 4} H${width - 18}`} stroke={C.ink600} strokeWidth={5} strokeLinecap="round" strokeDasharray={built[0] > 0.01 ? undefined : '10 10'} />
        <path d={`M${width - 34} ${NODE - 8} L${width - 12} ${NODE + 4} L${width - 34} ${NODE + 16}`} fill="none" stroke={C.ink500} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
        <path d={`M${cx(0)} ${NODE + 4} H${fillTo}`} stroke={alpha(C.sky, 0.9 * (1 - 0.7 * dimAll))} strokeWidth={6} strokeLinecap="round" />
      </svg>

      {STOPS.map((stop, i) => {
        const b = built[i];
        const f = clamp01(focus[i] ?? 0);
        const isPassive = stop.id === 'passive';
        const locked = stop.id === 'offense';
        const tone = isPassive && answer > 0.01 ? C.emerald : stop.tone;
        const lit = locked ? 0 : b * (1 - dimAll) + (isPassive ? answer * dimAll : 0);
        const glow = locked ? 0 : Math.max(f * (1 - dimAll), isPassive ? answer : 0);
        const fill = glow > 0.4 ? tone : alpha(tone, 0.16 * lit);
        return (
          <div key={stop.id} style={{ position: 'absolute', left: cx(i) - step / 2, top: 0, width: step, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div
              style={{
                width: NODE * 2,
                height: NODE * 2,
                marginTop: 4,
                boxSizing: 'border-box',
                borderRadius: NODE,
                border: `${glow > 0.3 ? 4 : 3}px ${b > 0.05 || locked ? 'solid' : 'dashed'} ${locked ? alpha(C.muted, 0.7) : lit > 0.05 ? alpha(tone, 0.45 + 0.55 * Math.max(lit, glow)) : C.ink600}`,
                background: fill,
                boxShadow: glow > 0.02 ? `0 0 ${Math.round(34 * glow)}px ${alpha(tone, 0.45 * glow)}` : undefined,
                display: 'grid',
                placeItems: 'center',
                transform: `scale(${1 + 0.14 * glow})`,
              }}
            >
              {locked ? (
                <Icon name="lock" size={26} color={alpha(C.text, b)} strokeWidth={2.4} />
              ) : (
                <span style={{ fontSize: 30, fontWeight: 850, color: glow > 0.4 ? C.ink950 : lit > 0.05 ? C.textStrong : C.faint }}>{i + 1}</span>
              )}
            </div>
            <div
              style={{
                marginTop: 16,
                textAlign: 'center',
                fontSize: labelSize,
                fontWeight: 800,
                lineHeight: 1.1,
                letterSpacing: -0.3,
                whiteSpace: 'nowrap',
                color: locked ? alpha(C.muted, 0.5 + 0.4 * b) : glow > 0.3 ? C.textStrong : lit > 0.05 ? alpha(C.text, 0.55 + 0.45 * lit) : C.faint,
                opacity: 0.35 + 0.65 * Math.max(b, 0.001) * (1 - 0.4 * dimAll * (isPassive && answer > 0.01 ? 0 : 1)),
              }}
            >
              {stop.lines.map((l) => (
                <div key={l}>{l}</div>
              ))}
            </div>
          </div>
        );
      })}

      {/* s04: the arrow's sentence, under the bar */}
      {arrow > 0.01 ? (
        <div style={{ position: 'absolute', left: 0, top: BAR_H + 6, width, opacity: arrow, transform: `translateY(${(1 - arrow) * 10}px)` }}>
          <div style={{ height: 6, borderRadius: 3, background: `linear-gradient(90deg, ${alpha(C.emerald, 0.95)} 0%, ${alpha(C.amber, 0.35)} 100%)` }} />
          {SCALE_ARROW.split(' · ').map((line, k) => (
            <div key={line} style={{ marginTop: 12, fontSize: 30, fontWeight: 700, color: k === 0 ? '#6ee7b7' : '#fcd34d', textAlign: k === 0 ? 'left' : 'right', whiteSpace: 'nowrap' }}>
              {line}
            </div>
          ))}
        </div>
      ) : null}

      {/* s05: the two halves */}
      {halves[0] > 0.01 || halves[1] > 0.01 ? (
        <div style={{ position: 'absolute', left: 0, top: BAR_H + 4, width }}>
          {halves[0] > 0.01 ? <Half from={0} to={3 * step} tone={C.emerald} lines={[S05.left]} grow={halves[0]} /> : null}
          {halves[1] > 0.01 ? <Half from={3 * step} to={width} tone={C.amber} lines={S05.rightLines} grow={halves[1]} /> : null}
        </div>
      ) : null}
    </div>
  );
}

function Half({ from, to, tone, lines, grow }: { from: number; to: number; tone: string; lines: readonly string[]; grow: number }) {
  const w = (to - from - 24) * clamp01(grow);
  return (
    <div style={{ position: 'absolute', left: from + 12, top: 0, width: to - from - 24 }}>
      <div style={{ width: w, height: 16, borderLeft: `5px solid ${tone}`, borderRight: `5px solid ${tone}`, borderBottom: `5px solid ${tone}`, borderRadius: '0 0 12px 12px', boxSizing: 'border-box' }} />
      <div style={{ marginTop: 10, textAlign: 'center', fontSize: 36, fontWeight: 800, lineHeight: 1.12, color: tone === C.emerald ? '#6ee7b7' : '#fcd34d', whiteSpace: 'nowrap', opacity: grow }}>
        {lines.map((l) => (
          <div key={l}>{l}</div>
        ))}
      </div>
    </div>
  );
}

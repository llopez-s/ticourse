import { useMemo } from 'react';
import { ACCENT, C, FONT, TYPE, alpha } from '../../../theme/tokens';
import { EASE, enter, fadeIn, lerp, progress, pulse } from '../../../theme/motion';
import { Chip, Connector, Icon, Packet, Panel, type Point } from '../../../ui';

/** Body-relative geometry (panel body is width × (height − 64)). */
const COLS = 14;
const ROWS = 5;
const SP = 44;
const GX = 170;
const GY = 126;
const DOT_R = 6;
/** Blind-zone padding around the host grid. */
const PAD_X = 26;
const PAD_TOP = 40;
const PAD_BOTTOM = 30;
/**
 * Hosts with a precise, documented exclusion in R-112 (col, row): only the
 * backup agent (backup01), matching the rule editor. The scanner and the
 * balancer are exclusions of other rules (R-087, R-203).
 */
const PRECISE: readonly [number, number][] = [[3, 1]];
const TARGET: [number, number] = [8, 2];

const dotAt = (c: number, r: number): Point => ({ x: GX + c * SP, y: GY + r * SP });
const isPrecise = (c: number, r: number) => PRECISE.some(([pc, pr]) => pc === c && pr === r);

/**
 * "Una exclusión demasiado amplia crea falsos negativos": the rule's view of
 * the internal network. The precise exclusion is one emerald ring; the
 * over-broad one grows from it until it swallows the whole /16, and
 * an attacker's packet crosses that blind zone without raising anything.
 */
export function CoverageMap({
  frame,
  fps,
  top,
  width,
  height,
  enterAt,
  floodAt,
  falseNegAt,
}: {
  frame: number;
  fps: number;
  top: number;
  width: number;
  height: number;
  enterAt: number;
  floodAt: number;
  falseNegAt: number;
}) {
  const dotsPath = useMemo(() => {
    let d = '';
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (isPrecise(c, r)) continue;
        const p = dotAt(c, r);
        d += `M${p.x - DOT_R},${p.y}a${DOT_R},${DOT_R} 0 1,0 ${DOT_R * 2},0a${DOT_R},${DOT_R} 0 1,0 ${-DOT_R * 2},0`;
      }
    }
    return d;
  }, []);

  const flood = progress(frame, floodAt, 22, EASE.inOut);
  const seed = dotAt(PRECISE[0][0], PRECISE[0][1]);
  const full = {
    x: GX - PAD_X,
    y: GY - PAD_TOP,
    w: (COLS - 1) * SP + PAD_X * 2,
    h: (ROWS - 1) * SP + PAD_TOP + PAD_BOTTOM,
  };
  const zone = {
    x: lerp(flood, [0, 1], [seed.x - 22, full.x]),
    y: lerp(flood, [0, 1], [seed.y - 22, full.y]),
    w: lerp(flood, [0, 1], [44, full.w]),
    h: lerp(flood, [0, 1], [44, full.h]),
  };
  const zoneIn = fadeIn(frame, floodAt - 2, 6);

  const target = dotAt(TARGET[0], TARGET[1]);
  const attacker: Point = { x: 118, y: target.y };
  const curve: [Point, Point, Point, Point] = [attacker, { x: 230, y: target.y - 84 }, { x: 400, y: target.y + 86 }, target];
  const travel = progress(frame, floodAt + 16, 40, EASE.inOut);
  const arrived = progress(frame, floodAt + 54, 10);
  const attackerIn = enter(frame, floodAt + 6, { distance: 16, duration: 12, axis: 'x' });

  return (
    <Panel
      title="Cobertura de la regla R-112 · 10.20.0.0/16"
      icon="radar"
      accent={flood > 0.5 ? 'rose' : 'cyan'}
      glow={0.5 * arrived}
      style={{ position: 'absolute', left: 0, top, width, height, ...enter(frame, enterAt, { distance: 24, duration: 14 }) }}
    >
      <div
        style={{
          position: 'absolute',
          left: 30,
          top: 16,
          display: 'flex',
          alignItems: 'center',
          gap: 28,
          fontFamily: FONT.sans,
          fontSize: TYPE.small,
          fontWeight: 550,
          color: C.muted,
        }}
      >
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 12, height: 12, borderRadius: 6, background: C.cyan }} />
          vigilado
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 16, height: 16, borderRadius: 8, border: `3px solid ${C.emerald}` }} />
          exclusión precisa
        </span>
      </div>

      <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width={width} height={height - 64}>
        <defs>
          <pattern id="s07-hatch" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="14" height="14" fill={alpha(C.rose, 0.08)} />
            <line x1="0" y1="0" x2="0" y2="14" stroke={alpha(C.rose, 0.35)} strokeWidth="5" />
          </pattern>
        </defs>

        {/* monitored hosts fade out as the blind zone covers them */}
        <path d={dotsPath} fill={C.cyan} opacity={0.85 * (1 - flood)} />
        <path d={dotsPath} fill={C.ink600} opacity={flood} />

        {PRECISE.map(([c, r]) => {
          const p = dotAt(c, r);
          return (
            <g key={`${c}-${r}`}>
              <circle cx={p.x} cy={p.y} r={DOT_R} fill={C.emerald} />
              <circle cx={p.x} cy={p.y} r={15} fill="none" stroke={C.emerald} strokeWidth={3} />
            </g>
          );
        })}

        {zoneIn > 0 ? (
          <rect
            x={zone.x}
            y={zone.y}
            width={zone.w}
            height={zone.h}
            rx={18}
            fill="url(#s07-hatch)"
            stroke={C.rose}
            strokeWidth={3}
            strokeDasharray="12 9"
            opacity={zoneIn}
          />
        ) : null}

        <Connector curve={curve} color={C.rose} width={4} draw={travel} opacity={fadeIn(frame, floodAt + 14, 6)} />
        <Packet curve={curve} t={travel > 0 && travel < 1 ? travel : -1} color={C.rose} radius={10} />

        {arrived > 0 ? (
          <g opacity={arrived}>
            <circle cx={target.x} cy={target.y} r={DOT_R + 2} fill={C.rose} />
            <circle
              cx={target.x}
              cy={target.y}
              r={16 + 6 * pulse(frame - floodAt, fps, 0.8)}
              fill="none"
              stroke={C.rose}
              strokeWidth={3}
              opacity={0.9 - 0.5 * pulse(frame - floodAt, fps, 0.8)}
            />
          </g>
        ) : null}
      </svg>

      {/* zone label, straddling the top edge of the blind zone */}
      <div
        style={{
          position: 'absolute',
          left: full.x + 18,
          top: full.y - 25,
          opacity: progress(frame, floodAt + 14, 10),
        }}
      >
        <Chip accent="rose" solid icon="eyeOff" size={TYPE.small}>
          zona ciega
        </Chip>
      </div>

      {/* the attacker */}
      <div
        style={{
          position: 'absolute',
          left: attacker.x - 74,
          top: attacker.y - 36,
          width: 72,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 6,
          ...attackerIn,
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 32,
            display: 'grid',
            placeItems: 'center',
            background: alpha(C.rose, 0.16),
            border: `2px solid ${alpha(C.rose, 0.8)}`,
          }}
        >
          <Icon name="user" size={34} color={C.rose} />
        </div>
        <span style={{ fontFamily: FONT.sans, fontSize: TYPE.label, fontWeight: 700, color: ACCENT.rose.soft, whiteSpace: 'nowrap' }}>atacante</span>
      </div>

      {/* nothing fires */}
      <div
        style={{
          position: 'absolute',
          left: target.x + 26,
          top: target.y - 64,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '4px 12px',
          borderRadius: 10,
          background: alpha(C.ink950, 0.9),
          border: `2px solid ${alpha(C.rose, 0.7)}`,
          fontFamily: FONT.sans,
          fontSize: TYPE.small,
          fontWeight: 700,
          color: ACCENT.rose.soft,
          whiteSpace: 'nowrap',
          opacity: arrived,
        }}
      >
        <Icon name="bell" size={26} color={C.rose} />
        sin alerta
      </div>

      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 352,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <div style={enter(frame, falseNegAt, { distance: 14, duration: 12 })}>
          <Chip accent="rose" icon="eyeOff" size={34}>
            falso negativo (false negative)
          </Chip>
        </div>
      </div>
    </Panel>
  );
}

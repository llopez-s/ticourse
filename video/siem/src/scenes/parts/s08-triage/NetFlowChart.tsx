import { C, FONT, TYPE, alpha } from '../../../theme/tokens';
import { lerp } from '../../../theme/motion';
import { Counter, Icon } from '../../../ui';
import { EXFIL, NETFLOW_MAX, NETFLOW_SERIES } from '../../../data/s08-triage';

const HOURS = [0, 1, 2, 3, 4, 5, 6];
const PAD_L = 124;
const PAD_R = 44;
const PAD_B = 58;

/**
 * NetFlow area chart of srv-tc-app03's outbound rate, 00:00–06:00. The
 * baseline is cyan (data); the 02:00–04:30 plateau is amber (the anomaly
 * under triage). `compress` (0–1) moves from the tall layout to the short one
 * used once the metadata cards take the bottom of the stage.
 */
export function NetFlowChart({
  width,
  height,
  compress,
  draw,
  rateLabel,
  counter,
  counterOpacity,
  dest,
  mark02,
  mark0430,
}: {
  width: number;
  height: number;
  compress: number;
  /** 0–1 left-to-right reveal of the series. */
  draw: number;
  rateLabel: number;
  /** Current value of the GB counter. */
  counter: number;
  counterOpacity: number;
  dest: number;
  mark02: number;
  mark0430: number;
}) {
  const padT = lerp(compress, [0, 1], [104, 40]);
  const plotW = width - PAD_L - PAD_R;
  const plotH = height - padT - PAD_B;
  const x = (h: number) => PAD_L + (h / 6) * plotW;
  const y = (v: number) => padT + plotH * (1 - v / NETFLOW_MAX);
  const bottom = padT + plotH;

  const line = (pts: { h: number; v: number }[]) => pts.map((p, i) => `${i ? 'L' : 'M'}${x(p.h).toFixed(1)},${y(p.v).toFixed(1)}`).join(' ');
  const area = (pts: { h: number; v: number }[]) =>
    `${line(pts)} L${x(pts[pts.length - 1].h).toFixed(1)},${bottom} L${x(pts[0].h).toFixed(1)},${bottom} Z`;
  // Split the series so the ramps are vertical and the fills never overlap
  // (amber over cyan would read olive).
  const pre = NETFLOW_SERIES.filter((p) => p.h < EXFIL.startH - 1e-6);
  const plateau = NETFLOW_SERIES.filter((p) => p.h >= EXFIL.startH - 1e-6 && p.h <= EXFIL.endH + 1e-6);
  const post = NETFLOW_SERIES.filter((p) => p.h > EXFIL.endH + 1e-6);
  const preEdge = [...pre, { h: EXFIL.startH, v: pre[pre.length - 1].v }];
  const postEdge = [{ h: EXFIL.endH, v: post[0].v }, ...post];
  const exfil = [preEdge[preEdge.length - 1], ...plateau, postEdge[0]];

  const headX = PAD_L + plotW * draw;
  const headIndex = Math.min(NETFLOW_SERIES.length - 1, Math.round(draw * (NETFLOW_SERIES.length - 1)));
  const counterSize = lerp(compress, [0, 1], [118, 68]);
  const plateauTop = y(EXFIL.rate);
  const clipId = 's08-netflow-clip';

  return (
    <div style={{ position: 'relative', width, height }}>
      <svg width={width} height={height} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
        <defs>
          <clipPath id={clipId}>
            <rect x={0} y={0} width={headX} height={height} />
          </clipPath>
        </defs>
        {/* Grid + y labels */}
        {[0, 2.5, 5].map((v) => (
          <g key={v}>
            <line x1={PAD_L} x2={PAD_L + plotW} y1={y(v)} y2={y(v)} stroke={alpha(C.ink600, v === 0 ? 0.9 : 0.45)} strokeWidth={2} strokeDasharray={v === 0 ? undefined : '6 10'} />
            <text x={PAD_L - 18} y={y(v) + 8} textAnchor="end" fill={C.faint} fontFamily={FONT.mono} fontSize={TYPE.micro}>
              {v === 0 ? '0' : v === 5 ? '5 MB/s' : '2,5'}
            </text>
          </g>
        ))}
        {/* x axis */}
        {HOURS.map((h) => {
          const is02 = h === EXFIL.startH;
          return (
            <text
              key={h}
              x={x(h)}
              y={bottom + 40}
              textAnchor="middle"
              fontFamily={FONT.mono}
              fontSize={is02 ? lerp(mark02, [0, 1], [24, 28]) : 24}
              fontWeight={is02 && mark02 > 0.5 ? 800 : 500}
              fill={is02 && mark02 > 0.5 ? C.amber : C.muted}
            >
              {`0${h}:00`}
            </text>
          );
        })}
        {mark0430 > 0 ? (
          <g opacity={mark0430}>
            <rect x={x(EXFIL.endH) - 50} y={bottom + 12} width={100} height={40} rx={10} fill={C.ink900} />
            <text x={x(EXFIL.endH)} y={bottom + 40} textAnchor="middle" fontFamily={FONT.mono} fontSize={28} fontWeight={800} fill={C.amber}>
              {EXFIL.end}
            </text>
          </g>
        ) : null}

        {/* Series */}
        <g clipPath={`url(#${clipId})`}>
          <path d={area(preEdge)} fill={alpha(C.cyan, 0.12)} />
          <path d={area(postEdge)} fill={alpha(C.cyan, 0.12)} />
          <path d={line(preEdge)} fill="none" stroke={C.cyan} strokeWidth={3} strokeLinejoin="round" />
          <path d={line(postEdge)} fill="none" stroke={C.cyan} strokeWidth={3} strokeLinejoin="round" />
          <path d={area(plateau)} fill={alpha(C.amber, 0.18)} />
          <path d={line(exfil)} fill="none" stroke={C.amber} strokeWidth={4} strokeLinejoin="round" />
        </g>
        {draw > 0 && draw < 1 ? (
          <circle cx={headX} cy={y(NETFLOW_SERIES[headIndex].v)} r={8} fill={C.textStrong} stroke={C.cyan} strokeWidth={3} />
        ) : null}

        {/* 02:00 and 04:30 guides */}
        {[
          { h: EXFIL.startH, o: mark02 },
          { h: EXFIL.endH, o: mark0430 },
        ].map((m) =>
          m.o > 0 ? (
            <line
              key={m.h}
              x1={x(m.h)}
              x2={x(m.h)}
              y1={plateauTop - 22}
              y2={bottom}
              stroke={C.amber}
              strokeWidth={3}
              strokeDasharray="8 8"
              opacity={m.o}
            />
          ) : null,
        )}

        {/* Rate label on the plateau */}
        <text
          x={x(EXFIL.startH) + 18}
          y={plateauTop + 36}
          fontFamily={FONT.mono}
          fontSize={TYPE.small}
          fontWeight={700}
          fill={C.amber}
          opacity={rateLabel}
        >
          {EXFIL.rateLabel}
        </text>
      </svg>

      {/* 38 GB: the area under the plateau. */}
      <div
        style={{
          position: 'absolute',
          left: x((EXFIL.startH + EXFIL.endH) / 2),
          top: (plateauTop + bottom) / 2 + lerp(compress, [0, 1], [10, 8]),
          transform: 'translate(-50%, -50%)',
          opacity: counterOpacity,
        }}
      >
        <Counter value={counter} unit="GB" size={counterSize} color={C.textStrong} />
      </div>

      {/* Destination, to the right of the plateau. */}
      <div
        style={{
          position: 'absolute',
          left: x(EXFIL.endH) + 34,
          top: (plateauTop + bottom) / 2 - lerp(compress, [0, 1], [48, 54]),
          opacity: dest,
          transform: `translateX(${(1 - dest) * 16}px)`,
          fontFamily: FONT.sans,
          whiteSpace: 'nowrap',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Icon name="arrowRight" size={34} color={C.amber} strokeWidth={2.4} />
          <span style={{ fontFamily: FONT.mono, fontSize: 32, fontWeight: 800, color: C.textStrong }}>{EXFIL.destination}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 6, marginLeft: 44 }}>
          <Icon name="globe" size={30} color={C.amber} />
          <span style={{ fontSize: TYPE.label, color: C.amber, fontWeight: 700 }}>IP desconocida</span>
        </div>
      </div>
    </div>
  );
}

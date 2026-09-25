import { useMemo, type ReactNode } from 'react';
import { random } from 'remotion';
import { C, FONT, RADIUS, TYPE, alpha } from '../../../../../engine/src/theme/tokens';
import { EASE, fadeIn, lerp, progress, pulse, springIn } from '../../../../../engine/src/theme/motion';
import { Chip, Connector, Icon, cubicPoint, curveBetween, type IconName } from '../../../../../engine/src/ui';
import { Kicker } from './Tile';
import type { S11Timing } from './timing';

const PAD = 24;
const VIS_H = 164;
/** One visual-column width for every "story" tile, so all text columns share one x. */
const VW = 380;

/** Visual on the left, text on the right — the layout of the three "story" tiles. */
function Split({ visual, text }: { visual: ReactNode; text: ReactNode }) {
  return (
    <>
      <div style={{ position: 'absolute', left: PAD, top: PAD, width: VW, height: VIS_H }}>{visual}</div>
      <div style={{ position: 'absolute', left: PAD + VW + 30, right: PAD, top: PAD + 2 }}>{text}</div>
    </>
  );
}

function Title({ children, color = C.textStrong, opacity = 1 }: { children: ReactNode; color?: string; opacity?: number }) {
  return (
    <div style={{ marginTop: 12, fontSize: TYPE.label, fontWeight: 800, lineHeight: 1.18, color, opacity, textWrap: 'balance' }}>{children}</div>
  );
}

function Caption({
  children,
  color = C.muted,
  opacity = 1,
  size = TYPE.small,
}: {
  children: ReactNode;
  color?: string;
  opacity?: number;
  /** TYPE.label when the line is what the voice is saying. */
  size?: number;
}) {
  return (
    <div style={{ marginTop: 8, fontSize: size, fontWeight: 600, lineHeight: 1.2, color, opacity, textWrap: 'balance' }}>{children}</div>
  );
}

function IconTile({ name, color, size = 48, dashed = false }: { name: IconName; color: string; size?: number; dashed?: boolean }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        boxSizing: 'border-box',
        borderRadius: 12,
        display: 'grid',
        placeItems: 'center',
        background: alpha(color, 0.12),
        border: `2px ${dashed ? 'dashed' : 'solid'} ${alpha(color, dashed ? 0.8 : 0.45)}`,
        flexShrink: 0,
      }}
    >
      <Icon name={name} size={Math.round(size * 0.58)} color={color} />
    </div>
  );
}

/* ------------------------------------------------------------------ 1 */

const SRC = 52;
const BS = { siem: { x: VW - 150, y: (VIS_H - 92) / 2, w: 150, h: 92 } } as const;
const SOURCES: { icon: IconName; y: number }[] = [
  { icon: 'firewall', y: 0 },
  { icon: 'server', y: (VIS_H - SRC) / 2 },
  { icon: 'app', y: VIS_H - SRC },
];

/** The SIEM only sees what reaches it: two plugged sources, one unplugged. */
export function BlindSource({ frame, fps, t }: { frame: number; fps: number; t: S11Timing }) {
  const target = { x: BS.siem.x, y: BS.siem.y + BS.siem.h / 2 };
  const from = (s: { y: number }) => ({ x: SRC, y: s.y + SRC / 2 });
  const blindIn = progress(frame, t.blind, 16);
  const blindCurve = curveBetween(from(SOURCES[2]), target, 0.55);
  const plug = cubicPoint(blindCurve, 0.5);
  const text = progress(frame, t.blind + 4, 16);
  // First the rule (cyan, while the voice says «fuentes integradas»), then the exception in rose.
  const ruleKicker = fadeIn(frame, t.intro + 16, 12) * (1 - progress(frame, t.blind, 10));
  const blindKicker = progress(frame, t.blind, 12);
  const visual = (
    <>
      <svg width={VW} height={VIS_H} style={{ position: 'absolute', inset: 0, overflow: 'visible' }} aria-hidden>
        {SOURCES.slice(0, 2).map((s, i) => (
          <Connector
            key={s.icon}
            curve={curveBetween(from(s), target, 0.55)}
            color={C.cyan}
            draw={progress(frame, t.intro + 6 + i * 6, 16)}
            flow={frame / fps}
            width={3.5}
          />
        ))}
        <g opacity={blindIn}>
          <path
            d={`M${blindCurve[0].x},${blindCurve[0].y} C${blindCurve[1].x},${blindCurve[1].y} ${blindCurve[2].x},${blindCurve[2].y} ${blindCurve[3].x},${blindCurve[3].y}`}
            fill="none"
            stroke={alpha(C.rose, 0.75)}
            strokeWidth={3.5}
            strokeDasharray="9 10"
          />
          <circle cx={plug.x} cy={plug.y} r={22} fill={C.ink900} stroke={C.rose} strokeWidth={3} />
        </g>
      </svg>
      {blindIn > 0 ? (
        <div style={{ position: 'absolute', left: plug.x - 15, top: plug.y - 15, opacity: blindIn }}>
          <Icon name="unplug" size={30} color={C.rose} strokeWidth={2.2} />
        </div>
      ) : null}
      {SOURCES.map((s, i) => {
        const p = i < 2 ? progress(frame, t.intro + i * 6, 14) : blindIn;
        return (
          <div key={s.icon} style={{ position: 'absolute', left: 0, top: s.y, opacity: p, transform: `translateX(${(1 - p) * -12}px)` }}>
            <IconTile name={s.icon} color={i < 2 ? C.cyan : C.rose} dashed={i === 2} size={SRC} />
          </div>
        );
      })}
      <div
        style={{
          position: 'absolute',
          left: BS.siem.x,
          top: BS.siem.y,
          width: BS.siem.w,
          height: BS.siem.h,
          boxSizing: 'border-box',
          borderRadius: RADIUS.md,
          border: `2px solid ${alpha(C.cyan, 0.8)}`,
          background: alpha(C.cyan, 0.1),
          boxShadow: `0 0 24px ${alpha(C.cyan, 0.2)}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
          opacity: progress(frame, t.intro, 14),
        }}
      >
        <Icon name="radar" size={36} color={C.cyan} />
        <span style={{ fontSize: TYPE.label, fontWeight: 800, color: C.textStrong }}>SIEM</span>
      </div>
    </>
  );
  return (
    <Split
      visual={visual}
      text={
        <>
          <div style={{ position: 'relative', height: 32 }}>
            {ruleKicker > 0 ? (
              <div style={{ position: 'absolute', left: 0, top: 0, opacity: ruleKicker }}>
                <Kicker color={C.cyan} icon="check">
                  FUENTES INTEGRADAS
                </Kicker>
              </div>
            ) : null}
            {blindKicker > 0 ? (
              <div style={{ position: 'absolute', left: 0, top: 0, opacity: blindKicker, transform: `translateY(${(1 - blindKicker) * 8}px)` }}>
                <Kicker color={C.roseSoft} icon="eyeOff">
                  FUENTE NO INTEGRADA
                </Kicker>
              </div>
            ) : null}
          </div>
          <div style={{ opacity: text, transform: `translateY(${(1 - text) * 10}px)` }}>
            <Title>no integrada = invisible</Title>
            <Caption size={TYPE.label} color={C.text}>
              lo que no le llega, para él no ocurrió
            </Caption>
          </div>
        </>
      }
    />
  );
}

/* ------------------------------------------------------------------ 2 */

const SIL = { vw: VW, base: 150, dropX: 236 } as const;

/** Events per second from one source flatten to zero: missing logs. */
export function Silence({ frame, fps, t }: { frame: number; fps: number; t: S11Timing }) {
  const { live, dropPath } = useMemo(() => {
    const n = 22;
    const pts: string[] = [];
    for (let i = 0; i <= n; i++) {
      const x = (SIL.dropX * i) / n;
      const y = 72 + (random(`s11-eps-${i}`) - 0.5) * 34;
      pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    }
    const last = pts[pts.length - 1];
    return { live: `M${pts.join(' L')}`, dropPath: `M${last} L${SIL.dropX + 12},${SIL.base} L${SIL.vw},${SIL.base}` };
  }, []);
  // The line races to the moment the source goes quiet ("se calla"), then flattens.
  const dropAt = t.silence + 22;
  const drawLive = progress(frame, t.silence + 2, 20, EASE.inOut);
  const drawDrop = progress(frame, dropAt, 26, EASE.out);
  const dropped = frame >= dropAt + 4;
  const text = progress(frame, t.silence + 36, 14);
  const caption = progress(frame, t.silence + 60, 14);
  const visual = (
    <>
      <div style={{ position: 'absolute', left: 0, top: 0, fontSize: TYPE.small, fontWeight: 650, color: C.muted, opacity: fadeIn(frame, t.silence, 12) }}>
        eventos/s
      </div>
      <div
        style={{
          position: 'absolute',
          right: 6,
          top: 72,
          fontFamily: FONT.mono,
          fontSize: 58,
          fontWeight: 800,
          lineHeight: 1,
          color: C.amber,
          opacity: progress(frame, dropAt + 10, 10),
        }}
      >
        0
      </div>
      <svg width={SIL.vw} height={VIS_H} style={{ position: 'absolute', inset: 0, overflow: 'visible' }} aria-hidden>
        <line x1={0} y1={SIL.base} x2={SIL.vw} y2={SIL.base} stroke={C.ink600} strokeWidth={2} />
        <path d={live} fill="none" stroke={C.cyan} strokeWidth={3.5} strokeLinejoin="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - drawLive} />
        <path
          d={dropPath}
          fill="none"
          stroke={C.amber}
          strokeWidth={4}
          strokeLinejoin="round"
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray="1 1"
          strokeDashoffset={1 - drawDrop}
        />
        {dropped ? (
          <g transform={`translate(${SIL.dropX + 44} ${SIL.base - 38})`} opacity={0.55 + 0.45 * pulse(frame - dropAt, fps, 0.8)}>
            <circle r={24} fill={alpha(C.amber, 0.14)} stroke={C.amber} strokeWidth={2.5} />
          </g>
        ) : null}
      </svg>
      {dropped ? (
        <div style={{ position: 'absolute', left: SIL.dropX + 44 - 15, top: SIL.base - 38 - 15 }}>
          <Icon name="bell" size={30} color={C.amber} strokeWidth={2.2} />
        </div>
      ) : null}
    </>
  );
  return (
    <Split
      visual={visual}
      text={
        <>
          <div style={{ opacity: fadeIn(frame, t.silence + 6, 12) }}>
            <Kicker color={C.amber} icon="alert">
              FUENTE QUE SE CALLA
            </Kicker>
          </div>
          <div style={{ opacity: text, transform: `translateY(${(1 - text) * 10}px)` }}>
            <Title color={C.amber}>missing logs</Title>
          </div>
          <div style={{ opacity: caption }}>
            <div style={{ marginTop: 8, fontSize: TYPE.label, fontWeight: 650, lineHeight: 1.2, color: C.textStrong, textWrap: 'balance' }}>
              tan sospechosa como una alerta
            </div>
          </div>
        </>
      }
    />
  );
}

/* ------------------------------------------------------------------ 3 */

const SK = { slot: [16, 94] as const, chipX: 30, tagX: 264 } as const;

/** Two events in the wrong order because one clock runs 7 minutes ahead; NTP fixes it. */
export function ClockSkew({ frame, t }: { frame: number; t: S11Timing }) {
  const inP = progress(frame, t.skew, 16);
  const swap = progress(frame, t.snap, 18, EASE.inOut);
  const fixed = frame >= t.snap + 8;
  const text = progress(frame, t.skew + 6, 14);
  // 4625 (failed logon) is really first; its source's clock is +7 min, so it lands second.
  const yFail = lerp(swap, [0, 1], [SK.slot[1], SK.slot[0]]);
  const yOk = lerp(swap, [0, 1], [SK.slot[0], SK.slot[1]]);
  const tagSkew = 1 - progress(frame, t.snap, 8);
  const tagNtp = progress(frame, t.snap + 10, 12);
  const visual = (
    <div style={{ opacity: inP }}>
      {/* Time spine: top = earlier. */}
      <svg width={30} height={VIS_H} style={{ position: 'absolute', left: 0, top: 0 }} aria-hidden>
        <line x1={12} y1={10} x2={12} y2={148} stroke={C.ink500} strokeWidth={3} />
        <path d="M4,142 L12,156 L20,142" fill="none" stroke={C.ink500} strokeWidth={3} strokeLinejoin="round" />
        <circle cx={12} cy={yOk + 24} r={7} fill={C.cyan} />
        <circle cx={12} cy={yFail + 24} r={7} fill={fixed ? C.cyan : C.amber} />
      </svg>
      <EventChip y={yOk} id="4624" label="correcto" />
      <EventChip y={yFail} id="4625" label="fallido" warn={!fixed} />
      {/* Tag next to the skewed event: "+7 min", then "NTP". */}
      <div style={{ position: 'absolute', left: SK.tagX, top: yFail + 5 }}>
        {tagSkew > 0 ? (
          <div style={{ position: 'absolute', opacity: tagSkew }}>
            <Chip accent="amber" size={TYPE.small}>
              +7 min
            </Chip>
          </div>
        ) : null}
        {tagNtp > 0 ? (
          <div style={{ position: 'absolute', opacity: tagNtp, transform: `scale(${0.8 + 0.2 * tagNtp})`, transformOrigin: 'left center' }}>
            <Chip accent="emerald" icon="check" size={TYPE.small}>
              NTP
            </Chip>
          </div>
        ) : null}
      </div>
    </div>
  );
  return (
    <Split
      visual={visual}
      text={
        <div style={{ opacity: text, transform: `translateY(${(1 - text) * 10}px)` }}>
          <Kicker color={C.amber} icon="clock">
            RELOJES DESFASADOS
          </Kicker>
          <Title>la correlación se desordena</Title>
          <div style={{ position: 'relative', height: 34 }}>
            <div style={{ position: 'absolute', inset: 0, opacity: tagSkew }}>
              <Caption color={C.amber}>un reloj va 7 min adelantado</Caption>
            </div>
            <div style={{ position: 'absolute', inset: 0, opacity: tagNtp }}>
              <Caption color={C.emerald}>con NTP vuelve el orden</Caption>
            </div>
          </div>
        </div>
      }
    />
  );
}

function EventChip({ y, id, label, warn = false }: { y: number; id: string; label: string; warn?: boolean }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: SK.chipX,
        top: y,
        height: 48,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '0 12px',
        borderRadius: RADIUS.sm,
        border: `2px solid ${warn ? alpha(C.amber, 0.7) : C.ink600}`,
        background: warn ? alpha(C.amber, 0.08) : C.ink800,
        fontFamily: FONT.mono,
        fontSize: TYPE.small,
        whiteSpace: 'nowrap',
      }}
    >
      <span style={{ color: C.cyanSoft, fontWeight: 700 }}>{id}</span>
      <span style={{ color: C.text }}>{label}</span>
    </div>
  );
}

/* ------------------------------------------------------------------ 4 */

/** Metadata (who, when, how much) is visible; the content is not. */
export function NoPayload({ frame, t }: { frame: number; t: S11Timing }) {
  const meta = progress(frame, t.meta + 8, 16);
  const locked = progress(frame, t.noPayload, 16);
  return (
    <>
      <div style={{ position: 'absolute', left: PAD, top: PAD, opacity: fadeIn(frame, t.meta, 12) }}>
        <Kicker color={C.roseSoft} icon="eyeOff">
          SIN CONTENIDO
        </Kicker>
      </div>
      <div
        style={{
          position: 'absolute',
          left: PAD,
          top: 82,
          width: 390,
          display: 'flex',
          alignItems: 'center',
          gap: 18,
          opacity: meta,
          transform: `translateY(${(1 - meta) * 12}px)`,
        }}
      >
        <IconTile name="mail" color={C.cyan} size={72} />
        <div>
          <div style={{ fontSize: TYPE.label, fontWeight: 800, color: C.cyanSoft, lineHeight: 1.15 }}>metadatos:</div>
          <div style={{ fontSize: 28, fontWeight: 650, color: C.textStrong, lineHeight: 1.25, whiteSpace: 'nowrap' }}>
            quién, cuándo, cuánto
          </div>
        </div>
      </div>
      <div style={{ position: 'absolute', left: 426, top: 84, width: 2, height: 100, background: C.ink700, opacity: locked }} />
      <div
        style={{
          position: 'absolute',
          left: 452,
          top: 82,
          display: 'flex',
          alignItems: 'center',
          gap: 18,
          opacity: locked,
          transform: `translateY(${(1 - locked) * 12}px)`,
        }}
      >
        <div style={{ position: 'relative' }}>
          <IconTile name="lock" color={C.rose} size={72} />
        </div>
        <div>
          <div style={{ fontSize: TYPE.label, fontWeight: 800, color: C.roseSoft, lineHeight: 1.15 }}>contenido:</div>
          <div style={{ fontSize: 28, fontWeight: 650, color: C.textStrong, lineHeight: 1.25, whiteSpace: 'nowrap' }}>
            el SIEM no lo ve
          </div>
        </div>
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ 5 */

// The lesson's example: an intrusion found «a los ocho meses» sits just past the
// 6-month online window, so only the archive can still reconstruct it.
const RET = { left: 640, width: 1060, online: 300, labelY: 22, barY: 72, barH: 36, pinX: 352 } as const;

/** Retention bar: 6 months online, 7 years in the archive; an old intrusion is reachable only inside it. */
export function Retention({ frame, fps, t }: { frame: number; fps: number; t: S11Timing }) {
  const head = progress(frame, t.archive, 14);
  const online = progress(frame, t.archive + 6, 16, EASE.inOut);
  const archived = progress(frame, t.archive + 20, 30, EASE.inOut);
  const purpose = springIn(frame, fps, t.purpose);
  const pinDrop = springIn(frame, fps, t.pin, { damping: 12, mass: 0.7 });
  const pinLabel = progress(frame, t.pin + 8, 14);
  const archW = RET.width - RET.online - 8;
  return (
    <>
      <div style={{ position: 'absolute', left: PAD + 4, top: PAD + 8, opacity: head }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, whiteSpace: 'nowrap' }}>
          <Icon name="archive" size={40} color={C.cyan} strokeWidth={2} />
          <span style={{ fontSize: 42, fontWeight: 800, color: C.textStrong, lineHeight: 1.1 }}>Archivado</span>
          <span style={{ fontSize: TYPE.small, fontWeight: 800, letterSpacing: 2.2, color: C.cyan }}>ARCHIVING</span>
        </div>
        <div style={{ marginTop: 16, opacity: Math.min(1, purpose), transform: `scale(${0.9 + 0.1 * Math.min(1, purpose)})`, transformOrigin: 'left center' }}>
          <Chip accent="cyan" icon="search" size={TYPE.label}>
            investigaciones y cumplimiento
          </Chip>
        </div>
      </div>

      <div style={{ position: 'absolute', left: RET.left, top: 0, width: RET.width, height: '100%' }}>
        {/* Segment labels */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: RET.labelY,
            fontSize: TYPE.label,
            fontWeight: 800,
            color: C.cyanSoft,
            whiteSpace: 'nowrap',
            opacity: progress(frame, t.archive + 10, 12),
          }}
        >
          6 meses en línea
        </div>
        <div
          style={{
            position: 'absolute',
            left: RET.online + 22,
            top: RET.labelY,
            fontSize: TYPE.label,
            fontWeight: 800,
            color: C.text,
            whiteSpace: 'nowrap',
            opacity: progress(frame, t.archive + 30, 12),
          }}
        >
          7 años en archivo
        </div>

        <svg width={RET.width} height={130} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} aria-hidden>
          <defs>
            <pattern id="s11-arch" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <rect width="14" height="14" fill={alpha(C.cyanDeep, 0.35)} />
              <rect width="5" height="14" fill={alpha(C.cyan, 0.22)} />
            </pattern>
          </defs>
          <rect x={0} y={RET.barY} width={RET.width} height={RET.barH} rx={10} fill={alpha(C.ink800, 0.9)} stroke={C.ink600} strokeWidth={2} />
          <rect x={0} y={RET.barY} width={RET.online * online} height={RET.barH} rx={10} fill={C.cyan} />
          <rect
            x={RET.online + 8}
            y={RET.barY}
            width={archW * archived}
            height={RET.barH}
            rx={10}
            fill="url(#s11-arch)"
            stroke={alpha(C.cyan, 0.55)}
            strokeWidth={2}
          />
          {/* Pin: an old intrusion, inside the archive window. */}
          {pinDrop > 0.01 ? (
            <g transform={`translate(${RET.pinX} ${RET.barY + RET.barH / 2 - (1 - Math.min(1, pinDrop)) * 24})`} opacity={Math.min(1, pinDrop * 1.5)}>
              <line x1={0} y1={0} x2={0} y2={46} stroke={C.rose} strokeWidth={3} />
              <circle r={17} fill={C.ink900} stroke={C.rose} strokeWidth={3.5} />
              <circle r={7} fill={C.rose} />
            </g>
          ) : null}
        </svg>
        {/* Age tag riding on the bar, right of the pin head. */}
        <div
          style={{
            position: 'absolute',
            left: RET.pinX + 30,
            top: RET.barY + RET.barH / 2,
            transform: `translateY(-50%) scale(${0.85 + 0.15 * pinLabel})`,
            transformOrigin: 'left center',
            opacity: pinLabel,
          }}
        >
          <Chip accent="rose" size={TYPE.small} style={{ background: C.ink900 }}>
            hace 8 meses
          </Chip>
        </div>
        <div
          style={{
            position: 'absolute',
            left: RET.pinX,
            top: RET.barY + RET.barH + 26,
            transform: `translate(-50%, ${(1 - pinLabel) * 8}px)`,
            whiteSpace: 'nowrap',
            fontSize: TYPE.label,
            fontWeight: 650,
            color: C.textStrong,
            opacity: pinLabel,
          }}
        >
          <span style={{ color: C.roseSoft, fontWeight: 800 }}>intrusión antigua:</span> solo si llega la retención
        </div>
      </div>
    </>
  );
}


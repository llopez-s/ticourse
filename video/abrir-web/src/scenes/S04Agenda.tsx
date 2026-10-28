import type { CSSProperties, ReactNode } from 'react';
import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { EASE, progress, pulse } from '../../../engine/src/theme/motion';
import { Icon, mix, windowWeight, type IconName } from '../../../engine/src/ui';
import { Stage } from './kit';
import { BrowserWindow, PortalPage } from './parts/Browser';
import { PORTAL } from './parts/data';
import { AgendaImage } from './parts/Images';
import { Ribbon, ribbonLit } from './parts/Ribbon';
import { ImaginaSeal } from './parts/Seal';

const LADDER = { x: 560, y: 104, w: 700, h: 68, dx: 56, dy: 100 } as const;
const STEPS: { label: string; icon: IconName; tone: string }[] = [
  { label: 'tu portátil', icon: 'laptop', tone: C.cyan },
  { label: 'resolutor de la oficina', icon: 'search', tone: C.sky },
  { label: 'raíz', icon: 'globe', tone: C.sky },
  { label: 'servidores del final del nombre', icon: 'network', tone: C.sky },
  { label: 'servidor del puerto', icon: 'server', tone: C.sky },
];
const stepX = (i: number) => LADDER.x + i * LADDER.dx;
const stepY = (i: number) => LADDER.y + i * LADDER.dy;

/** A paper slip travelling between two points. */
function Paper({ children, x, y, w = 190, tone = C.amber, show, style }: { children: ReactNode; x: number; y: number; w?: number; tone?: string; show: number; style?: CSSProperties }) {
  if (show <= 0) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: w,
        boxSizing: 'border-box',
        padding: '6px 14px',
        borderRadius: 10,
        background: C.ink900,
        border: `2px solid ${alpha(tone, 0.85)}`,
        boxShadow: `0 10px 24px ${alpha('#000000', 0.45)}`,
        fontFamily: FONT.sans,
        fontSize: 28,
        fontWeight: 800,
        color: tone === C.emerald ? '#6ee7b7' : '#fcd34d',
        textAlign: 'center',
        whiteSpace: 'nowrap',
        opacity: Math.min(1, show * 2),
        transform: 'rotate(-2deg)',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/**
 * s04-agenda «La agenda».
 *   0 – agenda   the browser knows the NAME but needs an ADDRESS («?.?.?.?»).
 *   agenda       the phone agenda (a name, a number), labelled «imagen · no es del puerto», next to the same pair
 *                for the web: name → address. The ribbon is NOT lit here (DNS lights in s05).
 *   cache        the laptop's cache of names, empty. The ladder of five steps appears on the right.
 *   resolver     the laptop asks ONLY the resolver and waits; udp: the little «UDP» box of F1's label.
 *   unknown      the resolver does not have it either: «primera consulta del día».
 *   top / levels / last   it is the RESOLVER who goes down the ladder: root, the servers of the end of the name,
 *                the port's server; each upper step hands it a slip «pregunta a…»; the last one gives the address,
 *                and the resolver passes it to the laptop.
 */
export function S04Agenda(props: SceneProps) {
  const frame = useCurrentFrame();
  const agenda = props.cue('agenda');
  const cache = props.cue('cache');
  const resolver = props.cue('resolver');
  const udp = props.cue('udp');
  const unknown = props.cue('unknown');
  const top = props.cue('top');
  const levels = props.cue('levels');
  const last = props.cue('last');

  // ---- Phase 1: the name needs an address.
  const p1In = progress(frame, 8, 20);
  const p1Out = progress(frame, agenda - 10, 16, EASE.inOut);
  // ---- Phase 2: the agenda.
  const agendaIn = progress(frame, agenda - 4, 22);
  const pick = progress(frame, agenda + 40, 24);
  const eqWeb = progress(frame, agenda + 78, 20);
  const toLeft = progress(frame, cache - 6, 26, EASE.inOut);
  const eqOut = progress(frame, cache - 12, 14, EASE.inOut);
  // ---- Phase 3: the ladder.
  const ladderIn = progress(frame, cache + 4, 22);
  const cacheIn = progress(frame, cache + 12, 16);
  const lit = [
    progress(frame, cache + 4, 16),
    progress(frame, resolver, 14),
    progress(frame, top, 14),
    progress(frame, levels, 14),
    progress(frame, last, 14),
  ];
  const arrows = [
    progress(frame, resolver + 2, 18, EASE.inOut),
    progress(frame, top + 2, 18, EASE.inOut),
    progress(frame, levels + 2, 14, EASE.inOut),
    progress(frame, last + 2, 14, EASE.inOut),
  ];
  const udpIn = progress(frame, udp - 4, 14);
  const unknownIn = progress(frame, unknown - 4, 14) * (1 - progress(frame, top - 8, 14));
  const wait = windowWeight(frame, resolver + 10, Number.POSITIVE_INFINITY, { ramp: 10 });

  // The slips and the answer.
  const note1At = top + 54;
  const note2At = levels + 30;
  const addrAt = last + 40;
  const rest1 = { x: 1336, y: stepY(1) + 2 };
  const rest2 = { x: 1532, y: stepY(1) + 2 };
  const from1 = { x: stepX(2) + LADDER.w + 14, y: stepY(2) + 8 };
  const from2 = { x: stepX(3) + LADDER.w + 14, y: stepY(3) + 8 };
  const from3 = { x: stepX(4) + LADDER.w + 14, y: stepY(4) + 8 };
  const n1 = progress(frame, note1At, 22, EASE.inOut);
  const n2 = progress(frame, note2At, 22, EASE.inOut);
  const toResolver = progress(frame, addrAt + 22, 24, EASE.inOut);
  const toLaptop = progress(frame, addrAt + 66, 26, EASE.inOut);
  const addrX = toLaptop > 0 ? mix(rest1.x, LADDER.x + LADDER.w + 24, toLaptop) : mix(from3.x, rest1.x, toResolver);
  const addrY = toLaptop > 0 ? mix(rest1.y, stepY(0) + 8, toLaptop) : mix(from3.y, rest1.y, toResolver);
  const notesDim = progress(frame, addrAt + 18, 16);

  const beat = 0.5 + 0.5 * pulse(frame, 30, 0.7);

  return (
    <Stage>
      <Ribbon lit={ribbonLit(frame, {}, ['DHCP'])} />

      {/* ---- phase 1: name in, address needed */}
      {p1In > 0 && p1Out < 1 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: p1In * (1 - p1Out) }}>
          <div style={{ position: 'absolute', left: 60, top: 150 }}>
            <BrowserWindow scale={0.66} url={PORTAL.host}>
              <PortalPage show={0.0} />
            </BrowserWindow>
          </div>
          <div style={{ position: 'absolute', left: 840, top: 170, width: 800, fontFamily: FONT.sans }}>
            <div style={{ fontSize: 34, fontWeight: 700, color: C.muted }}>tiene el nombre</div>
            <div style={{ marginTop: 6, marginBottom: 34, fontFamily: FONT.mono, fontSize: 38, fontWeight: 600, color: C.textStrong, whiteSpace: 'nowrap' }}>{PORTAL.host}</div>
            <div style={{ fontSize: 34, fontWeight: 700, color: C.muted }}>y necesita una dirección</div>
            <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 22, padding: '14px 28px', borderRadius: RADIUS.lg, border: `3px dashed ${alpha(C.amber, 0.7)}`, background: alpha(C.amber, 0.06) }}>
              <Icon name="alert" size={52} color={C.amber} />
              <span style={{ fontFamily: FONT.mono, fontSize: 64, fontWeight: 800, color: '#fcd34d', letterSpacing: 2 }}>?.?.?.?</span>
            </div>
          </div>
        </div>
      ) : null}

      {/* ---- phase 2: the agenda (shrinks to the left column when the ladder arrives) */}
      {agendaIn > 0 ? (
        <div
          style={{
            position: 'absolute',
            left: mix(150, 20, toLeft),
            top: mix(108, 232, toLeft),
            transform: `scale(${mix(1, 0.72, toLeft)})`,
            transformOrigin: 'top left',
            opacity: mix(1, 0.75, toLeft),
          }}
        >
          <AgendaImage width={340} show={agendaIn} pick={pick} />
        </div>
      ) : null}
      {agendaIn > 0 && eqOut < 1 ? (
        <div style={{ position: 'absolute', left: 640, top: 160, width: 1000, fontFamily: FONT.sans, opacity: agendaIn * (1 - eqOut) }}>
          <EqRow icon="user" left="nombre" right="número" glow={pick} tone={C.muted} />
          <div style={{ height: 36 }} />
          <EqRow left={PORTAL.host} right="dirección" glow={eqWeb} tone={C.cyan} mono show={eqWeb} />
        </div>
      ) : null}

      {/* ---- phase 3: the name on top-left, then the ladder */}
      {toLeft > 0 ? (
        <div
          style={{
            position: 'absolute',
            left: 20,
            top: 104,
            width: 500,
            boxSizing: 'border-box',
            padding: '8px 18px',
            borderRadius: RADIUS.md,
            border: `2px solid ${alpha(C.cyan, 0.55)}`,
            background: alpha(C.cyan, 0.07),
            opacity: toLeft,
            fontFamily: FONT.sans,
          }}
        >
          <div style={{ fontSize: 26, fontWeight: 650, color: C.muted }}>busca el nombre</div>
          <div style={{ fontFamily: FONT.mono, fontSize: 27, fontWeight: 600, color: C.textStrong, whiteSpace: 'nowrap' }}>{PORTAL.host}</div>
        </div>
      ) : null}

      {ladderIn > 0 ? (
        <>
          {/* arrows down the ladder */}
          <svg width={1728} height={660} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
            {arrows.map((a, i) => {
              if (a <= 0) return null;
              const x = stepX(i + 1) + 60;
              const y1 = stepY(i) + LADDER.h + 2;
              const y2 = stepY(i + 1) - 4;
              const yT = y1 + (y2 - y1) * a;
              return (
                <g key={i} stroke={i === 0 ? C.cyan : C.sky} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" fill="none">
                  <line x1={x} y1={y1} x2={x} y2={yT} />
                  {a > 0.7 ? <path d={`M ${x - 11} ${yT - 11} L ${x} ${yT} L ${x + 11} ${yT - 11}`} /> : null}
                </g>
              );
            })}
          </svg>
          {STEPS.map((s, i) => {
            const on = lit[i];
            const l = ladderIn * Math.max(0.35, on);
            return (
              <div
                key={s.label}
                style={{
                  position: 'absolute',
                  left: stepX(i),
                  top: stepY(i),
                  width: LADDER.w,
                  height: LADDER.h,
                  boxSizing: 'border-box',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  padding: '0 22px',
                  borderRadius: RADIUS.md,
                  border: `3px solid ${alpha(s.tone, 0.3 + 0.6 * on)}`,
                  background: `linear-gradient(180deg, ${C.ink800} 0%, ${C.ink900} 100%)`,
                  boxShadow: on > 0.2 ? `0 0 ${Math.round(24 * on)}px ${alpha(s.tone, 0.25 * on)}` : undefined,
                  opacity: l,
                  transform: `translateY(${(1 - ladderIn) * 20}px)`,
                  fontFamily: FONT.sans,
                }}
              >
                <Icon name={s.icon} size={44} color={s.tone} strokeWidth={1.7} />
                <span style={{ fontSize: 33, fontWeight: 800, color: C.textStrong, whiteSpace: 'nowrap' }}>{s.label}</span>
                {i === 0 ? (
                  <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10, opacity: cacheIn }}>
                    <span style={{ fontSize: 26, fontWeight: 700, color: C.muted }}>caché vacía</span>
                    {[0, 1].map((k) => (
                      <span key={k} style={{ width: 34, height: 28, borderRadius: 6, border: `2px dashed ${alpha(C.muted, 0.7)}` }} />
                    ))}
                  </div>
                ) : null}
              </div>
            );
          })}

          {/* the little UDP box on the first arrow */}
          {udpIn > 0 ? (
            <div
              style={{
                position: 'absolute',
                left: stepX(1) + 116,
                top: stepY(0) + LADDER.h + 2,
                height: 30,
                padding: '0 12px',
                borderRadius: 8,
                border: `2px solid ${alpha(C.cyan, 0.9)}`,
                background: C.ink950,
                fontFamily: FONT.mono,
                fontSize: 24,
                fontWeight: 800,
                color: C.cyanSoft,
                display: 'flex',
                alignItems: 'center',
                opacity: udpIn,
              }}
            >
              UDP
            </div>
          ) : null}
          {udpIn > 0 ? (
            <div style={{ position: 'absolute', left: stepX(1) + 190, top: stepY(0) + LADDER.h - 2, fontFamily: FONT.sans, fontSize: 28, fontWeight: 650, color: C.muted, opacity: udpIn }}>
              consulta DNS
            </div>
          ) : null}

          {/* waiting hourglass next to the laptop */}
          {wait > 0 ? (
            <div style={{ position: 'absolute', left: LADDER.x + LADDER.w + 24, top: stepY(0) + 10, display: 'flex', alignItems: 'center', gap: 10, opacity: wait * (1 - toLaptop) * (0.6 + 0.4 * beat), fontFamily: FONT.sans }}>
              <Icon name="clock" size={40} color={C.cyanSoft} />
              <span style={{ fontSize: 30, fontWeight: 700, color: C.cyanSoft }}>espera</span>
            </div>
          ) : null}

          {/* "first query of the day" */}
          {unknownIn > 0 ? (
            <div
              style={{
                position: 'absolute',
                left: stepX(1) + LADDER.w + 20,
                top: stepY(1) + 2,
                width: 300,
                padding: '4px 16px',
                borderRadius: RADIUS.md,
                border: `2px solid ${alpha(C.amber, 0.7)}`,
                background: alpha(C.amber, 0.09),
                fontFamily: FONT.sans,
                fontSize: 30,
                fontWeight: 750,
                color: '#fcd34d',
                lineHeight: 1.15,
                opacity: unknownIn,
              }}
            >
              primera consulta del día
            </div>
          ) : null}

          {/* slips and the answer */}
          <Paper show={n1} tone={C.amber} x={mix(from1.x, rest1.x, n1)} y={mix(from1.y, rest1.y, n1)} style={{ opacity: Math.min(1, n1 * 3) * (1 - 0.6 * notesDim) }}>
            pregunta a…
          </Paper>
          <Paper show={n2} tone={C.amber} x={mix(from2.x, rest2.x, n2)} y={mix(from2.y, rest2.y, n2)} style={{ opacity: Math.min(1, n2 * 3) * (1 - 0.6 * notesDim) }}>
            pregunta a…
          </Paper>
          <Paper show={progress(frame, addrAt, 10)} tone={C.emerald} w={230} x={addrX} y={addrY} style={{ fontFamily: FONT.mono, fontSize: 32 }}>
            {PORTAL.ip}
          </Paper>
        </>
      ) : null}

      <ImaginaSeal />
    </Stage>
  );
}

function EqRow({ icon, left, right, glow, tone, mono = false, show = 1 }: { icon?: IconName; left: string; right: string; glow: number; tone: string; mono?: boolean; show?: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 24, opacity: show, transform: `translateY(${(1 - show) * 14}px)` }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          padding: '10px 26px',
          borderRadius: RADIUS.md,
          border: `3px solid ${alpha(tone, 0.4 + 0.5 * glow)}`,
          background: alpha(tone, 0.08),
          fontFamily: mono ? FONT.mono : FONT.sans,
          fontSize: mono ? 33 : 44,
          fontWeight: 750,
          color: C.textStrong,
          whiteSpace: 'nowrap',
        }}
      >
        {icon ? <Icon name={icon} size={44} color={tone} /> : null}
        {left}
      </div>
      <svg width={90} height={30} style={{ flexShrink: 0 }}>
        <line x1={4} y1={15} x2={76} y2={15} stroke={tone} strokeWidth={5} strokeLinecap="round" />
        <path d="M 62 3 L 78 15 L 62 27" fill="none" stroke={tone} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <div
        style={{
          padding: '10px 26px',
          borderRadius: RADIUS.md,
          border: `3px solid ${alpha(tone, 0.4 + 0.5 * glow)}`,
          background: alpha(tone, 0.08),
          fontFamily: FONT.sans,
          fontSize: 44,
          fontWeight: 750,
          color: tone === C.cyan ? C.cyanSoft : C.text,
          whiteSpace: 'nowrap',
        }}
      >
        {right}
      </div>
    </div>
  );
}

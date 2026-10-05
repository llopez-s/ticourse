import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { EASE, progress, pulse } from '../../../engine/src/theme/motion';
import { Icon, mix, windowWeight } from '../../../engine/src/ui';
import { E7_NET_CONN } from '../data/e7';
import { HOSTS, HOSTS_HEAD } from '../data/report';
import { S04_TEXT } from '../data/s04-llamadas';
import { Stage, segment, wordFrame } from './kit';
import { BorrowedPhone, OwnGlyph } from './parts/BorrowedPhone';
import { HostList, hostListMetrics } from './parts/HostList';

const SCENE = 's04-llamadas';
const STAGE_W = 1728;
const STAGE_H = 660;

/** The host list: centred and low (the think prompt sits above it), then on the left. */
const LIST = { w: 1000, size: 40, labelSize: 32, gap: 10, lowTop: 240 } as const;
const CENTRE_X = (STAGE_W - LIST.w) / 2;
/** Right column (phone, then the blackout map). */
const RIGHT_X = 1056;
const PHONE_H = 470;
/** spare: V3's lines on the left, the spare row enlarged on the right. */
const SPARE = { panelX: 0, panelY: 206, panelW: 680, rowX: 720, rowY: 206, rowW: 1008, size: 48, labelSize: 32, captionY: 478 } as const;

/**
 * s04-llamadas «Cinco llamadas».
 *   hosts     the report's five contacted hosts, enlarged, ONE colour, bare;
 *             low and still for the think prompt «Cinco sitios en la lista…»
 *   (s04-02)  «el sandbox lo apunta todo»: a light sweep over the five rows
 *   phone     the list moves left; the borrowed phone and its call log on the right:
 *             two calls «de quien lo usa», three «del propio teléfono»
 *   two       two rows rose, «su servidor de siempre · el de E7», «de repuesto»
 *   three     three rows grey with the phone's icons and plain labels, and
 *             «las hace Windows solo, con muestra o sin ella» above them
 *   blackout  a padlock on all five (rose); Meridian's machines with blank clocks
 *             and the connection in doubt: «gol en propia puerta»
 *   triage    the locks lift off the three; the two keep theirs (emerald). No date.
 *   spare     the spare row enlarged beside V3's two connection lines (both to the
 *             usual server): «en la alerta de E7: no salía» · «lo ha dado el sandbox»
 */
export function S04Llamadas(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const hostsAt = props.cue('hosts');
  const phoneAt = props.cue('phone');
  const twoAt = props.cue('two');
  const threeAt = props.cue('three');
  const blackoutAt = props.cue('blackout');
  const triageAt = props.cue('triage');
  const spareAt = props.cue('spare');
  const s01 = segment(props, 's04-01');
  const apuntaAt = wordFrame(SCENE, 's04-02', 'apunta');
  const quienAt = wordFrame(SCENE, 's04-03', 'quien');
  const propioAt = wordFrame(SCENE, 's04-03', 'propio');
  const usualAt = wordFrame(SCENE, 's04-04', 'su');
  const repuestoAt = wordFrame(SCENE, 's04-04', 'repuesto');
  const tresAt = wordFrame(SCENE, 's04-05', 'tres');
  const windowsAt = wordFrame(SCENE, 's04-05', 'Windows');
  const golAt = wordFrame(SCENE, 's04-06', 'Gol');
  const candadoAt = wordFrame(SCENE, 's04-07', 'candado');

  // «Ahora, con lupa»: the report's rows are there from the first frame, small and dim, and
  // enlarge on «hosts»; they are still well before the think prompt.
  const zoom = progress(frame, hostsAt + 2, Math.min(40, Math.max(20, s01.to - 150 - hostsAt)), EASE.inOut);
  // Weights of the reading.
  const actor = progress(frame, twoAt - 2, 16);
  const windows = progress(frame, threeAt - 2, 16);
  const labels = [
    progress(frame, usualAt, 14),
    progress(frame, repuestoAt, 14),
    progress(frame, tresAt, 14),
    progress(frame, tresAt + 6, 14),
    progress(frame, tresAt + 12, 14),
  ];
  const note = progress(frame, windowsAt - 4, 16);
  // Locks: all five at blackout (rose), then only the two (emerald).
  const lockOn = (i: number) => progress(frame, blackoutAt + 4 + i * 5, 12);
  const unlock = progress(frame, triageAt + 2, 16, EASE.inOut);
  const locks = HOSTS.map((h, i) => lockOn(i) * (h.side === 'windows' ? 1 - unlock : 1));
  const lockHold = progress(frame, candadoAt, 16, EASE.inOut);

  // Placement: centre & low → left (phone) → vertically centred as it grows → centre (triage).
  const m = hostListMetrics(HOSTS, { size: LIST.size, labelSize: LIST.labelSize, labels, note, gap: LIST.gap });
  const toLeft = progress(frame, phoneAt - 4, 26, EASE.inOut);
  const backToCentre = progress(frame, triageAt + 10, 28, EASE.inOut);
  const listX = mix(mix(CENTRE_X, 0, toLeft), CENTRE_X, backToCentre);
  const settle = progress(frame, twoAt - 6, 24, EASE.inOut);
  const listTop = mix(LIST.lowTop, Math.max(8, (STAGE_H - m.height) / 2), settle);
  const listOut = progress(frame, spareAt - 2, 12, EASE.inOut);

  // «lo apunta todo»: one light pass over the rows.
  const sweep = (i: number) => progress(frame, apuntaAt - 2 + i * 5, 22, EASE.inOut);

  // Header «Hosts contactados:» with the lens, beside the low list (outside the think band).
  const headIn = mix(0.45, 1, progress(frame, hostsAt, 14)) * (1 - progress(frame, phoneAt - 6, 14, EASE.inOut));

  // Right column: the phone, then the blackout map.
  const phoneIn = progress(frame, phoneAt, 18) * (1 - progress(frame, blackoutAt - 2, 14, EASE.inOut));
  const phoneLog = progress(frame, phoneAt + 6, 40, EASE.linear);
  const guest = progress(frame, quienAt - 2, 14);
  const own = progress(frame, propioAt - 2, 14);
  const pulseGuest = windowWeight(frame, twoAt, threeAt, { ramp: 12 }) * (0.55 + 0.45 * pulse(frame, fps, 0.8));
  const pulseOwn = windowWeight(frame, threeAt, blackoutAt, { ramp: 12 }) * (0.55 + 0.45 * pulse(frame, fps, 0.8));
  const mapIn = progress(frame, blackoutAt + 4, 18) * (1 - progress(frame, triageAt, 16, EASE.inOut));
  const golIn = progress(frame, golAt - 4, 14);

  // spare: the spare row travels from its place in the list to the right column.
  const spareMove = progress(frame, spareAt, 24, EASE.inOut);
  const spareShow = progress(frame, spareAt - 2, 8);
  const panelIn = progress(frame, spareAt + 18, 18);
  const capIn = [progress(frame, spareAt + 26, 14), progress(frame, wordFrame(SCENE, 's04-08', 'destapado') - 4, 14)];
  const spareFrom = { x: listX, y: listTop + m.rowY[1], s: LIST.size / SPARE.size };

  return (
    <Stage>
      {/* Lens + the report's field name, left of the low list */}
      {headIn > 0.01 ? (
        <div style={{ position: 'absolute', left: 8, top: LIST.lowTop + 10, display: 'flex', alignItems: 'center', gap: 14, opacity: headIn }}>
          <Icon name="search" size={40} color={C.sky} strokeWidth={2.2} />
          <span style={{ fontFamily: FONT.mono, fontSize: 28, fontWeight: 600, color: C.muted, whiteSpace: 'nowrap' }}>{HOSTS_HEAD}</span>
        </div>
      ) : null}

      {/* The five rows */}
      {listOut < 0.999 ? (
        <div
          style={{
            position: 'absolute',
            left: listX,
            top: listTop,
            opacity: (1 - listOut) * mix(0.45, 1, zoom),
            transform: zoom < 0.999 ? `scale(${mix(0.7, 1, zoom)})` : undefined,
            transformOrigin: '50% 40%',
          }}
        >
          <HostList
            hosts={HOSTS}
            width={LIST.w}
            size={LIST.size}
            labelSize={LIST.labelSize}
            gap={LIST.gap}
            actor={actor}
            windows={windows}
            labels={labels}
            note={note}
            locks={locks}
            lockHold={lockHold}
          />
          {/* «lo apunta todo»: a light pass over each row (no annotation, nothing per row) */}
          {HOSTS.map((h, i) => {
            const t = sweep(i);
            if (t <= 0.001 || t >= 0.999) return null;
            return (
              <div
                key={h.id}
                style={{
                  position: 'absolute',
                  left: 64,
                  top: m.rowY[i],
                  width: LIST.w - 64,
                  height: m.rowH[i],
                  borderRadius: RADIUS.md,
                  overflow: 'hidden',
                  pointerEvents: 'none',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    left: `${-30 + 130 * t}%`,
                    width: '30%',
                    background: `linear-gradient(90deg, transparent, ${alpha(C.cyan, 0.28)}, transparent)`,
                  }}
                />
              </div>
            );
          })}
        </div>
      ) : null}

      {/* The borrowed phone */}
      {phoneIn > 0.01 ? (
        <div style={{ position: 'absolute', left: RIGHT_X, top: (STAGE_H - PHONE_H) / 2, opacity: phoneIn, transform: `translateY(${(1 - phoneIn) * 20}px)` }}>
          <BorrowedPhone height={PHONE_H} log={phoneLog} guest={guest} own={own} pulse={{ guest: pulseGuest, own: pulseOwn }} captionSize={36} />
        </div>
      ) : null}

      {/* blackout: Meridian's machines without time or connection check */}
      {mapIn > 0.01 ? <BlackoutMap p={mapIn} gol={golIn} frame={frame} fps={fps} /> : null}

      {/* spare: V3's two connection lines and the spare row, enlarged */}
      {panelIn > 0.01 ? (
        <div style={{ position: 'absolute', left: SPARE.panelX, top: SPARE.panelY, opacity: panelIn, transform: `translateY(${(1 - panelIn) * 16}px)` }}>
          <E7Lines width={SPARE.panelW} />
        </div>
      ) : null}
      {spareShow > 0.01 ? (
        <div
          style={{
            position: 'absolute',
            left: mix(spareFrom.x, SPARE.rowX, spareMove),
            top: mix(spareFrom.y, SPARE.rowY, spareMove),
            transform: `scale(${mix(spareFrom.s, 1, spareMove)})`,
            transformOrigin: '0 0',
            opacity: spareShow,
          }}
        >
          <HostList
            hosts={HOSTS}
            only={['spare']}
            width={SPARE.rowW}
            size={SPARE.size}
            labelSize={SPARE.labelSize}
            actor={1}
            labels={[1]}
            locks={[1]}
            lockHold={1}
          />
        </div>
      ) : null}
      {capIn[0] > 0.01 ? (
        <SpareCaption x={SPARE.panelX + 8} y={SPARE.captionY} p={capIn[0]} color={C.text}>
          {S04_TEXT.spare[0]}
        </SpareCaption>
      ) : null}
      {capIn[1] > 0.01 ? (
        <SpareCaption x={SPARE.rowX + 72} y={SPARE.captionY} p={capIn[1]} color={C.cyanSoft}>
          {S04_TEXT.spare[1]}
        </SpareCaption>
      ) : null}
    </Stage>
  );
}

function SpareCaption({ x, y, p, color, children }: { x: number; y: number; p: number; color: string; children: string }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        opacity: p,
        transform: `translateY(${(1 - p) * 12}px)`,
        fontFamily: FONT.sans,
        fontSize: 42,
        fontWeight: 800,
        letterSpacing: -0.4,
        color,
        whiteSpace: 'nowrap',
      }}
    >
      <div style={{ width: 7, height: 52, borderRadius: 4, background: color, opacity: 0.85 }} />
      {children}
    </div>
  );
}

/** V3's two NET_CONN events, as the EDR showed them (head muted, the usual server in rose). */
function E7Lines({ width }: { width: number }) {
  const size = 26;
  return (
    <div
      style={{
        width,
        boxSizing: 'border-box',
        padding: '20px 26px',
        borderRadius: RADIUS.lg,
        border: `2px solid ${alpha(C.cyan, 0.4)}`,
        background: `linear-gradient(180deg, ${alpha(C.cyanDeep, 0.18)} 0%, ${alpha(C.ink900, 0.95)} 100%)`,
        boxShadow: `0 24px 60px ${alpha('#000000', 0.35)}`,
        fontFamily: FONT.mono,
        fontSize: size,
        lineHeight: 1.5,
        whiteSpace: 'pre',
      }}
    >
      {E7_NET_CONN.map((e) => {
        const [pre, rest] = e.detail.split('update-svc-cdn.com');
        return (
          <div key={e.head}>
            <div style={{ color: C.muted }}>{e.head}</div>
            <div style={{ color: C.text }}>
              {'  '}
              {pre}
              <span style={{ color: C.roseSoft, fontWeight: 700 }}>update-svc-cdn.com</span>
              {rest}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/** blackout: Meridian's machines (generic, no count), each with a blank clock; the connection in doubt. */
function BlackoutMap({ p, gol, frame, fps }: { p: number; gol: number; frame: number; fps: number }) {
  const cols = 4;
  const rows = 3;
  const cell = 120;
  const gridW = cols * cell;
  const panelW = 640;
  const left = RIGHT_X + 16;
  const top = 20;
  const blink = 0.6 + 0.4 * pulse(frame, fps, 0.6);
  return (
    <div style={{ position: 'absolute', left, top, width: panelW, opacity: p, transform: `translateY(${(1 - p) * 18}px)` }}>
      <div
        style={{
          position: 'relative',
          width: panelW,
          height: rows * cell + 130,
          boxSizing: 'border-box',
          borderRadius: RADIUS.lg,
          border: `2px solid ${alpha(C.cyan, 0.35)}`,
          background: `linear-gradient(180deg, ${alpha(C.ink850, 0.96)} 0%, ${alpha(C.ink900, 0.96)} 100%)`,
          backgroundImage: `linear-gradient(${alpha(C.cyan, 0.05)} 1px, transparent 1px), linear-gradient(90deg, ${alpha(C.cyan, 0.05)} 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'absolute', left: (panelW - gridW) / 2, top: 18, width: gridW }}>
          {Array.from({ length: cols * rows }, (_, i) => {
            const cx = (i % cols) * cell;
            const cy = Math.floor(i / cols) * cell;
            const d = Math.min(1, p * 1.6 - (i % 5) * 0.08);
            return (
              <div key={i} style={{ position: 'absolute', left: cx + 18, top: cy + 10, width: cell - 36, height: cell - 24, opacity: Math.max(0, d) }}>
                <Icon name={i % 3 === 1 ? 'laptop' : 'desktop'} size={76} color={alpha(C.cyan, 0.85)} strokeWidth={1.6} />
                <svg width={44} height={44} viewBox="0 0 44 44" style={{ position: 'absolute', left: 52, top: -8 }}>
                  <circle cx={22} cy={22} r={17} fill={C.ink900} stroke={alpha(C.rose, blink)} strokeWidth={3.2} />
                  <circle cx={22} cy={22} r={2.4} fill={alpha(C.rose, 0.6)} />
                </svg>
              </div>
            );
          })}
        </div>
        {/* The two things that stop: the time (a blank clock) and the connection check (in doubt) */}
        <div style={{ position: 'absolute', left: 0, right: 0, top: rows * cell + 28, display: 'flex', justifyContent: 'center', gap: 56 }}>
          <svg width={84} height={84} viewBox="0 0 84 84">
            <circle cx={42} cy={42} r={34} fill={alpha(C.rose, 0.1)} stroke={C.rose} strokeWidth={4} />
            <circle cx={42} cy={42} r={4} fill={alpha(C.rose, 0.7)} />
          </svg>
          <svg width={110} height={84} viewBox="0 0 110 84">
            <OwnGlyph name="signal" x={40} y={44} size={64} color={C.rose} sw={4} />
            <circle cx={88} cy={22} r={19} fill={alpha(C.roseDeep, 0.9)} stroke={C.rose} strokeWidth={3} />
            <text x={88} y={31} textAnchor="middle" fontFamily={FONT.sans} fontSize={28} fontWeight={900} fill={C.roseSoft}>
              ?
            </text>
          </svg>
        </div>
      </div>
      {gol > 0.01 ? (
        <div
          style={{
            marginTop: 22,
            textAlign: 'center',
            fontFamily: FONT.sans,
            fontSize: 54,
            fontWeight: 900,
            letterSpacing: -0.8,
            color: C.roseSoft,
            whiteSpace: 'nowrap',
            opacity: gol,
            transform: `scale(${0.9 + 0.1 * gol})`,
            textShadow: `0 0 22px ${alpha(C.rose, 0.45)}`,
          }}
        >
          {S04_TEXT.blackout}
        </div>
      ) : null}
    </div>
  );
}

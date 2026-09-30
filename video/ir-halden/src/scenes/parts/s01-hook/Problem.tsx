import { C, FONT, alpha } from '../../../../../engine/src/theme/tokens';
import { EASE, countUp, enter, progress, pulse } from '../../../../../engine/src/theme/motion';
import { Chip, Icon } from '../../../../../engine/src/ui';
import { HOOK_HOST, ISOLATED_TAG, LEAK, PORT_NAME } from '../../../data/s01-hook';
import { Padlock } from '../s03-scope/Hosts';

/**
 * s01's first beat: Lucía's laptop, padlocked inside a cyan isolation bubble
 * (it spent the night isolated, as it should), and next to it the port, from
 * which a rose stream of data leaves the stage while a counter climbs to
 * 38 GB. Stage-local coordinates; frames from the scene.
 */

export interface ProblemTimes {
  /** Laptop's isolation shows (padlock, bubble, chip). */
  isolatedAt: number;
  /** «como tocaba»: small emerald tick by the chip. */
  okAt: number;
  /** The rose beacon on the crane (the error sound). */
  beaconAt: number;
  /** «Y aun así»: the stream starts. */
  streamAt: number;
  /** «de madrugada». */
  nightAt: number;
  /** The counter climbs from here … */
  countFrom: number;
  /** … and lands on «38». */
  countTo: number;
  /** «del puerto»: caption. */
  portAt: number;
}

const LAPTOP = { left: 70, top: 80, w: 440 };
const PORT = { left: 590, top: 190, w: 560, h: 300 };
const STREAM_Y = PORT.top + 214;
const COUNTER = { left: 1190, top: 104, w: 538 };

export function Problem({ frame, fps, t }: { frame: number; fps: number; t: ProblemTimes }) {
  // Already mostly there on the very first frame of the video (no empty stage).
  const appear = progress(frame, -12, 20);
  const iso = progress(frame, t.isolatedAt - 6, 14);
  const stream = progress(frame, t.streamAt - 4, 20, EASE.inOut);
  const gb = countUp(frame, t.countFrom, Math.max(8, t.countTo - t.countFrom), 0, LEAK.gb);
  const counterIn = progress(frame, t.countFrom - 8, 12);
  const landed = progress(frame, t.countTo - 2, 10);
  return (
    <div style={{ position: 'absolute', inset: 0, fontFamily: FONT.sans }}>
      {/* The laptop */}
      <div style={{ position: 'absolute', left: LAPTOP.left, top: LAPTOP.top, width: LAPTOP.w, opacity: appear, transform: `translateY(${(1 - appear) * 16}px)` }}>
        <Laptop w={LAPTOP.w} iso={iso} frame={frame} fps={fps} />
        <div style={{ marginTop: 26, textAlign: 'center', whiteSpace: 'nowrap' }}>
          <div style={{ fontFamily: FONT.mono, fontSize: 56, fontWeight: 800, color: C.textStrong, lineHeight: 1.1 }}>{HOOK_HOST.host}</div>
          <div style={{ fontSize: 36, fontWeight: 650, color: C.muted, marginTop: 4 }}>{HOOK_HOST.role}</div>
          <div style={{ marginTop: 18, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 14, ...enter(frame, t.isolatedAt - 2, { distance: 12 }) }}>
            <Chip accent="cyan" icon="lock" size={34}>
              {ISOLATED_TAG}
            </Chip>
            <span style={{ opacity: progress(frame, t.okAt - 4, 10), transform: `scale(${0.6 + 0.4 * progress(frame, t.okAt - 4, 10)})`, display: 'inline-flex' }}>
              <Icon name="check" size={44} color={C.emerald} strokeWidth={3} />
            </span>
          </div>
        </div>
      </div>

      {/* The port */}
      <div style={{ position: 'absolute', left: PORT.left, top: PORT.top, width: PORT.w, opacity: appear }}>
        <Port w={PORT.w} h={PORT.h} frame={frame} fps={fps} beaconAt={t.beaconAt} leak={stream} />
        <div style={{ marginTop: 16, textAlign: 'center', fontSize: 30, fontWeight: 650, color: C.muted, whiteSpace: 'nowrap' }}>{PORT_NAME}</div>
      </div>

      {/* The outflow: from the port to the edge of the stage */}
      <svg width={1728} height={660} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none' }}>
        {stream > 0 ? (
          <>
            <line x1={PORT.left + PORT.w - 40} y1={STREAM_Y} x2={PORT.left + PORT.w - 40 + (1728 + 40 - PORT.left - PORT.w) * stream} y2={STREAM_Y} stroke={alpha(C.rose, 0.25)} strokeWidth={26} strokeLinecap="round" />
            <line
              x1={PORT.left + PORT.w - 40}
              y1={STREAM_Y}
              x2={PORT.left + PORT.w - 40 + (1728 + 40 - PORT.left - PORT.w) * stream}
              y2={STREAM_Y}
              stroke={C.rose}
              strokeWidth={8}
              strokeLinecap="round"
              strokeDasharray="26 22"
              strokeDashoffset={-frame * 4}
              style={{ filter: `drop-shadow(0 0 10px ${alpha(C.rose, 0.7)})` }}
            />
            {/* Arrow head at the stage edge (SVG, not a glyph) */}
            {stream > 0.95 ? (
              <polyline points={`1690,${STREAM_Y - 26} 1720,${STREAM_Y} 1690,${STREAM_Y + 26}`} fill="none" stroke={C.rose} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
            ) : null}
          </>
        ) : null}
      </svg>

      {/* The counter */}
      {counterIn > 0.001 ? (
        <div style={{ position: 'absolute', left: COUNTER.left, top: COUNTER.top, width: COUNTER.w, textAlign: 'center', opacity: counterIn }}>
          <div
            style={{
              fontSize: 168,
              fontWeight: 850,
              color: C.roseSoft,
              letterSpacing: -4,
              lineHeight: 1,
              whiteSpace: 'nowrap',
              fontVariantNumeric: 'tabular-nums',
              textShadow: `0 0 ${Math.round(20 + 30 * landed)}px ${alpha(C.rose, 0.3 + 0.3 * landed)}`,
              transform: `scale(${1 + 0.05 * landed * (1 - progress(frame, t.countTo + 8, 14))})`,
            }}
          >
            {Math.round(gb)}
            <span style={{ fontSize: 72, fontWeight: 800, color: C.rose, marginLeft: 16, letterSpacing: 0 }}>{LEAK.unit}</span>
          </div>
          <div style={{ marginTop: 18, fontSize: 38, fontWeight: 750, color: C.textStrong, whiteSpace: 'nowrap', ...enter(frame, t.portAt - 6, { distance: 10 }) }}>{LEAK.caption}</div>
        </div>
      ) : null}
      {frame >= t.nightAt - 6 ? (
        <div style={{ position: 'absolute', left: COUNTER.left, top: STREAM_Y + 44, width: COUNTER.w, display: 'flex', justifyContent: 'center', ...enter(frame, t.nightAt - 4, { distance: 12 }) }}>
          <Chip accent="rose" icon="clock" size={34}>
            {LEAK.when}
          </Chip>
        </div>
      ) : null}
    </div>
  );
}

/** Laptop with a padlock on its screen, inside a dashed cyan isolation bubble. */
function Laptop({ w, iso, frame, fps }: { w: number; iso: number; frame: number; fps: number }) {
  const s = w / 440;
  const h = 300 * s;
  const breathe = 0.6 + 0.4 * pulse(frame, fps, 0.5);
  return (
    <div style={{ position: 'relative', width: w, height: h }}>
      <svg width={w} height={h} viewBox="0 0 440 300" style={{ display: 'block', overflow: 'visible' }}>
        {/* Isolation bubble */}
        {iso > 0.01 ? (
          <rect
            x={-26}
            y={-22}
            width={492}
            height={340}
            rx={48}
            fill={alpha(C.cyan, 0.05 * iso)}
            stroke={alpha(C.cyan, (0.45 + 0.35 * breathe) * iso)}
            strokeWidth={4}
            strokeDasharray="18 14"
            style={{ filter: `drop-shadow(0 0 ${Math.round(10 * iso)}px ${alpha(C.cyan, 0.5 * iso)})` }}
          />
        ) : null}
        {/* Screen */}
        <rect x={46} y={14} width={348} height={232} rx={16} fill={C.ink800} stroke={C.ink500} strokeWidth={4} />
        <rect x={62} y={30} width={316} height={200} rx={8} fill={C.ink950} />
        {/* Base */}
        <path d="M 10 256 L 430 256 L 410 288 Q 408 292 400 292 L 40 292 Q 32 292 30 288 Z" fill={C.ink700} stroke={C.ink500} strokeWidth={4} strokeLinejoin="round" />
        <rect x={180} y={256} width={80} height={8} rx={4} fill={C.ink600} />
      </svg>
      <div style={{ position: 'absolute', left: (220 - 55) * s, top: (130 - 70) * s }}>
        <Padlock size={130 * s} drop={iso} />
      </div>
    </div>
  );
}

/** A flat port silhouette: water, quay, container stacks and a gantry crane with a rose beacon. */
function Port({ w, h, frame, fps, beaconAt, leak }: { w: number; h: number; frame: number; fps: number; beaconAt: number; leak: number }) {
  const beacon = progress(frame, beaconAt - 2, 8) * (0.55 + 0.45 * pulse(Math.max(0, frame - beaconAt), fps, 0.8));
  const stacks = [
    { x: 150, cols: 3, rows: 3 },
    { x: 290, cols: 2, rows: 2 },
    { x: 380, cols: 3, rows: 4 },
  ];
  const tones = [C.ink600, '#27496b', C.ink500, '#3a3f52'];
  return (
    <svg width={w} height={h} viewBox="0 0 560 300" style={{ display: 'block', overflow: 'visible' }}>
      {/* Water */}
      {[0, 1, 2].map((i) => (
        <line key={i} x1={20 + i * 30} y1={276 + i * 9} x2={540 - i * 40} y2={276 + i * 9} stroke={alpha(C.sky, 0.25 - i * 0.06)} strokeWidth={3} strokeLinecap="round" strokeDasharray="30 18" />
      ))}
      {/* Quay */}
      <rect x={10} y={252} width={540} height={16} rx={3} fill={C.ink700} stroke={C.ink500} strokeWidth={2} />
      {/* Container stacks */}
      {stacks.map((st, k) =>
        Array.from({ length: st.rows }, (_, r) =>
          Array.from({ length: st.cols }, (_, c) => (
            <rect
              key={`${k}-${r}-${c}`}
              x={st.x + c * 30}
              y={252 - (r + 1) * 22}
              width={28}
              height={20}
              rx={2}
              fill={tones[(k + r + c) % tones.length]}
              stroke={alpha(C.ink950, 0.6)}
              strokeWidth={1.5}
            />
          )),
        ),
      )}
      {/* Gantry crane */}
      <g stroke={C.muted} strokeWidth={5} strokeLinecap="round" fill="none" opacity={0.85}>
        <line x1={40} y1={252} x2={60} y2={60} />
        <line x1={120} y1={252} x2={100} y2={60} />
        <line x1={50} y1={160} x2={110} y2={160} />
        <line x1={20} y1={60} x2={250} y2={60} />
        <line x1={80} y1={60} x2={80} y2={30} />
        <line x1={80} y1={30} x2={20} y2={60} />
        <line x1={80} y1={30} x2={250} y2={60} />
        <line x1={200} y1={60} x2={200} y2={110} strokeWidth={3} />
      </g>
      <rect x={186} y={110} width={28} height={16} rx={2} fill={C.ink500} />
      {/* The office where the data lives (the outflow leaves from here) */}
      <rect x={470} y={160} width={70} height={92} rx={4} fill={C.ink800} stroke={leak > 0.05 ? alpha(C.rose, 0.4 + 0.5 * leak) : C.ink500} strokeWidth={3} />
      {[0, 1, 2].map((r) =>
        [0, 1].map((c) => <rect key={`w${r}${c}`} x={482 + c * 26} y={174 + r * 24} width={16} height={12} rx={2} fill={leak > 0.05 && (r + c) % 2 === 0 ? alpha(C.rose, 0.7 * leak) : alpha(C.cyanSoft, 0.35)} />),
      )}
      {/* Beacon */}
      {beacon > 0.01 ? (
        <>
          <circle cx={80} cy={26} r={16} fill={alpha(C.rose, 0.25 * beacon)} />
          <circle cx={80} cy={26} r={7} fill={C.rose} opacity={beacon} style={{ filter: `drop-shadow(0 0 8px ${alpha(C.rose, 0.9)})` }} />
        </>
      ) : (
        <circle cx={80} cy={26} r={6} fill={C.ink500} />
      )}
    </svg>
  );
}

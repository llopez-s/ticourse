import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { EASE, fadeOut, progress } from '../../../engine/src/theme/motion';
import { Icon, mix } from '../../../engine/src/ui';
import { Stage, wordFrame } from './kit';
import { CLOCKS, type Clock, type ClockId } from './parts/data';
import { CaseStamp } from './parts/CaseStamp';
import { ClockChip, RULER, RulerLine, SourceTag, naiveSlot, utcSlot } from './parts/Ruler';

const S = 's05-utc';

// ---- Layout (stage-local), phase A. The ruler is compacted in phase B (globe, summer).
const CHIP_Y = 150;
const LINE_Y = 330;
const TAG_Y = 352;
const LABEL_Y = 424;
const KEEP_Y = 486;
/** One hour to the left, in px on the ordinal axis. */
const HOUR_PX = 150;
/** Compact ruler (phase B). */
const COMPACT = { s: 0.66, x: 369, y: -80 } as const;

/** The grey original of each hour, as the source wrote it. */
const ORIGINAL: Record<ClockId, string> = { proxy: '09:01:40Z', edr1: '09:02:41Z', edr2: '09:02:58Z', login: '09:58:12', fw: '10:03:05+01:00' };

/**
 * s05-utc «La hora de referencia». The ruler of s04 is back as it ended (`answer`: the login chip is the answer,
 * «el inicio de sesión»). `shift`: the two local hours (login, firewall) slide one hour to the left and become
 * 08:58:12 and 09:03:05, each keeping its original in grey. `jump` (whoosh): the login chip hops to the start of the
 * ruler and the others make room. `order`: the five hours in UTC order, every one with its original in grey — the
 * video's screen rule. `first`: «sesión» then «subida bloqueada»; `keep`: «guarda la hora original». `globe`: the ruler
 * shrinks to the top and a globe says «UTC · igual en todas partes · sin horario de verano»; `summer`: a calendar
 * whose local-offset arrow changes length (winter +01:00, summer +02:00 — an assumption to confirm: the canon only
 * fixes Halden's winter offset). The exam card on `rule` is sentence-end: nothing changes layout there.
 */
export function S05Utc(props: SceneProps) {
  const frame = useCurrentFrame();
  const answerAt = props.cue('answer');
  const shiftAt = props.cue('shift');
  const jumpAt = props.cue('jump');
  const orderAt = props.cue('order');
  const firstAt = props.cue('first');
  const keepAt = props.cue('keep');
  const globeAt = props.cue('globe');
  const summerAt = props.cue('summer');
  const changeAt = wordFrame(S, 's05-06', 'cambia') - 4;

  const shiftP = progress(frame, shiftAt, 34, EASE.inOut);
  const jumpP = progress(frame, jumpAt, 36, EASE.inOut);
  const orderP = progress(frame, orderAt, 18);
  const compact = progress(frame, globeAt - 10, 32, EASE.inOut);
  const phaseAOut = fadeOut(frame, globeAt - 14, 14);

  const s = mix(1, COMPACT.s, compact);
  const tx = mix(0, COMPACT.x, compact);
  const ty = mix(0, COMPACT.y, compact);

  return (
    <Stage>
      {/* the answer, then the new rule's name */}
      <div style={{ position: 'absolute', left: 0, top: 12, display: 'flex', alignItems: 'center', gap: 16, fontFamily: FONT.sans, opacity: progress(frame, answerAt, 16) * (1 - progress(frame, shiftAt - 4, 12)) }}>
        <div style={{ width: 62, height: 62, borderRadius: 31, background: alpha(C.emerald, 0.18), border: `3px solid ${C.emerald}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="check" size={38} color={C.emerald} strokeWidth={2.6} />
        </div>
        <span style={{ fontSize: 56, fontWeight: 850, color: C.textStrong, letterSpacing: -1 }}>el inicio de sesión</span>
      </div>
      <div style={{ position: 'absolute', left: 0, top: 12, display: 'flex', alignItems: 'center', gap: 14, fontFamily: FONT.sans, opacity: progress(frame, shiftAt + 6, 16) * phaseAOut }}>
        <span style={{ fontSize: 52, fontWeight: 850, color: C.emerald, letterSpacing: -1 }}>regla en UTC</span>
        <span style={{ fontSize: 34, fontWeight: 650, color: C.muted }}>todo a la misma hora</span>
      </div>

      {/* the ruler (everything in it scales together in phase B) */}
      <div style={{ position: 'absolute', left: 0, top: 0, width: 1728, height: 660, transformOrigin: '0 0', transform: `translate(${tx}px, ${ty}px) scale(${s})` }}>
        <div style={{ opacity: 1 - jumpP }}>
          <RulerLine y={LINE_Y} slots={RULER.naiveX} breakAt={RULER.breakX} />
        </div>
        <div style={{ opacity: jumpP }}>
          <RulerLine y={LINE_Y} slots={RULER.utcX} tickColor={C.emerald} />
        </div>

        {CLOCKS.map((clock) => (
          <Chip
            key={clock.id}
            clock={clock}
            shiftP={shiftP}
            jumpP={jumpP}
            orderP={orderP}
            answerP={progress(frame, answerAt, 16) * (1 - progress(frame, shiftAt, 18))}
            keepP={progress(frame, keepAt, 16) * phaseAOut}
          />
        ))}

        {/* "-1 h" over the two hours that move */}
        {(['login', 'fw'] as const).map((id) => {
          const x = id === 'login' ? naiveSlot('login') - HOUR_PX : utcSlot('fw');
          const p = progress(frame, shiftAt + 4, 14) * (1 - progress(frame, jumpAt - 6, 12));
          return (
            <div key={id} style={{ position: 'absolute', left: x, top: CHIP_Y - 58, transform: `translateX(-50%) translateY(${(1 - p) * 10}px)`, opacity: p }}>
              <div style={{ padding: '4px 18px', borderRadius: RADIUS.pill, border: `3px solid ${alpha(C.sky, 0.85)}`, background: alpha(C.sky, 0.14), fontFamily: FONT.mono, fontSize: 34, fontWeight: 800, color: C.sky, whiteSpace: 'nowrap' }}>
                −1 h
              </div>
            </div>
          );
        })}
      </div>

      {/* first it came in, then it tried to upload */}
      <First frame={frame} at={firstAt} out={phaseAOut} />

      {/* keep the original */}
      <div
        style={{
          position: 'absolute',
          left: 700,
          top: KEEP_Y,
          width: 1028,
          height: 100,
          boxSizing: 'border-box',
          display: 'flex',
          alignItems: 'center',
          gap: 22,
          padding: '0 28px',
          borderRadius: RADIUS.md,
          border: `3px solid ${alpha(C.muted, 0.6)}`,
          background: alpha(C.ink850, 0.95),
          fontFamily: FONT.sans,
          opacity: progress(frame, keepAt, 16) * phaseAOut,
          transform: `translateY(${(1 - progress(frame, keepAt, 16)) * 14}px)`,
        }}
      >
        <Icon name="archive" size={52} color={C.muted} />
        <div style={{ whiteSpace: 'nowrap' }}>
          <div style={{ fontSize: 40, fontWeight: 800, color: C.textStrong, lineHeight: 1.15 }}>guarda la hora original</div>
          <div style={{ fontSize: 30, fontWeight: 600, color: C.muted, lineHeight: 1.2 }}>en gris, al lado, por si te equivocas de zona</div>
        </div>
      </div>

      {/* phase B: UTC does not move; local time does */}
      <Globe frame={frame} at={globeAt} />
      <Summer frame={frame} at={summerAt} changeAt={changeAt} />

      <CaseStamp frame={frame} />
    </Stage>
  );
}

/** One hour of the ruler through the whole scene: naive position → shifted → jumped to its UTC slot. */
function Chip({ clock, shiftP, jumpP, orderP, answerP, keepP }: { clock: Clock; shiftP: number; jumpP: number; orderP: number; answerP: number; keepP: number }) {
  const local = clock.id === 'login' || clock.id === 'fw';
  const x0 = naiveSlot(clock.id);
  const x1 = utcSlot(clock.id);
  const shifted = local ? x0 - HOUR_PX * shiftP : x0;
  const x = mix(shifted, x1, jumpP);
  // The login hops over the others on its way to the front.
  const hop = clock.id === 'login' ? -70 * Math.sin(Math.PI * jumpP) : 0;
  const swap = local ? shiftP : orderP;
  const w = clock.id === 'fw' ? mix(RULER.wFw, RULER.w, shiftP) : RULER.w;
  const isAnswer = clock.id === 'login';
  const glow = Math.max(isAnswer ? answerP : 0, keepP * 0.5);
  const stemTop = CHIP_Y + RULER.h2;
  return (
    <div>
      <div style={{ position: 'absolute', left: x - w / 2, top: CHIP_Y + hop, zIndex: clock.id === 'login' ? 2 : 1 }}>
        <ClockChip
          time={clock.time}
          zone={clock.zone}
          alt={{ time: clock.utc }}
          swap={swap}
          original={ORIGINAL[clock.id]}
          originalOn={local ? shiftP : orderP}
          tone={swap > 0.5 ? 'norm' : 'plain'}
          width={w}
          glow={glow}
        />
      </div>
      <svg width={8} height={LINE_Y - stemTop} style={{ position: 'absolute', left: x - 4, top: stemTop, }} aria-hidden>
        <path d={`M 4 0 V ${LINE_Y - stemTop}`} stroke={alpha(C.cyan, 0.45)} strokeWidth={4} strokeDasharray="6 7" />
      </svg>
      <div style={{ position: 'absolute', left: x, top: TAG_Y, transform: 'translateX(-50%)' }}>
        <SourceTag id={clock.source} />
      </div>
    </div>
  );
}

/** «sesión» → «subida bloqueada» (first the login, then the blocked upload), under the first two slots of the UTC ruler. */
function First({ frame, at, out }: { frame: number; at: number; out: number }) {
  const a = progress(frame, at, 14);
  const b = progress(frame, at + 22, 14);
  const arrow = progress(frame, at + 10, 22);
  const x1 = RULER.utcX[0];
  const x2 = RULER.utcX[1];
  return (
    <div style={{ opacity: out }}>
      <div style={{ position: 'absolute', left: x1, top: LABEL_Y, transform: `translateX(-50%) translateY(${(1 - a) * 10}px)`, opacity: a, fontFamily: FONT.sans, fontSize: 40, fontWeight: 800, color: C.emerald, whiteSpace: 'nowrap' }}>
        sesión
      </div>
      <div style={{ position: 'absolute', left: x2, top: LABEL_Y, transform: `translateX(-50%) translateY(${(1 - b) * 10}px)`, opacity: b, fontFamily: FONT.sans, fontSize: 36, fontWeight: 800, color: C.textStrong, whiteSpace: 'nowrap' }}>
        subida bloqueada
      </div>
      <svg width={1728} height={80} style={{ position: 'absolute', left: 0, top: LABEL_Y - 6, pointerEvents: 'none' }} aria-hidden>
        {arrow > 0.03 ? <path d={`M ${x1 + 70} 30 H ${x1 + 70 + (x2 - 170 - x1 - 70) * arrow}`} stroke={C.emerald} strokeWidth={5} strokeLinecap="round" fill="none" /> : null}
        {arrow > 0.95 ? <path d={`M ${x2 - 184} 18 L ${x2 - 168} 30 L ${x2 - 184} 42`} stroke={C.emerald} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" fill="none" /> : null}
      </svg>
    </div>
  );
}

/** UTC is the same everywhere and has no summer time. */
function Globe({ frame, at }: { frame: number; at: number }) {
  const p = progress(frame, at + 4, 22);
  if (p <= 0.001) return null;
  return (
    <div style={{ position: 'absolute', left: 30, top: 252, display: 'flex', alignItems: 'center', gap: 36, opacity: p, transform: `translateY(${(1 - p) * 18}px)` }}>
      <svg width={290} height={290} viewBox="0 0 290 290" aria-hidden>
        <circle cx={145} cy={145} r={130} fill={alpha(C.cyan, 0.07)} stroke={C.cyan} strokeWidth={5} />
        <ellipse cx={145} cy={145} rx={60} ry={130} fill="none" stroke={alpha(C.cyan, 0.55)} strokeWidth={3.5} />
        <ellipse cx={145} cy={145} rx={104} ry={130} fill="none" stroke={alpha(C.cyan, 0.3)} strokeWidth={3} />
        <path d="M 15 145 H 275 M 32 90 H 258 M 32 200 H 258" stroke={alpha(C.cyan, 0.45)} strokeWidth={3} fill="none" />
        <path d="M 145 15 V 275" stroke={C.emerald} strokeWidth={6} />
        <rect x={85} y={118} width={120} height={54} rx={14} fill={C.ink900} stroke={C.emerald} strokeWidth={4} />
        <text x={145} y={157} textAnchor="middle" fontFamily={FONT.mono} fontSize={38} fontWeight={800} fill={C.emerald}>
          UTC
        </text>
      </svg>
      <div style={{ width: 380, fontFamily: FONT.sans, fontSize: 38, fontWeight: 750, lineHeight: 1.22, color: C.text }}>
        <span style={{ color: C.emerald, fontFamily: FONT.mono, fontWeight: 800 }}>UTC</span> · igual en todas partes · sin horario de verano
      </div>
    </div>
  );
}

/** A calendar and the local-offset arrow, which is the only thing that changes length. */
function Summer({ frame, at, changeAt }: { frame: number; at: number; changeAt: number }) {
  const p = progress(frame, at, 20);
  if (p <= 0.001) return null;
  const q = progress(frame, changeAt, 34, EASE.inOut);
  const unit = 150;
  const len = mix(unit, 2 * unit, q);
  const x0 = 1130;
  const summer = q > 0.5;
  const tone = summer ? C.amber : C.sky;
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, opacity: p, transform: `translateY(${(1 - p) * 18}px)` }}>
      {/* the calendar */}
      <svg width={230} height={210} viewBox="0 0 230 210" style={{ position: 'absolute', left: 780, top: 262 }} aria-hidden>
        <rect x={8} y={20} width={214} height={180} rx={20} fill={C.ink850} stroke={tone} strokeWidth={5} />
        <path d="M 8 74 H 222" stroke={tone} strokeWidth={5} />
        <path d="M 62 6 V 38 M 168 6 V 38" stroke={C.muted} strokeWidth={8} strokeLinecap="round" />
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((k) => (
          <rect key={k} x={32 + (k % 5) * 38} y={96 + Math.floor(k / 5) * 46} width={24} height={26} rx={6} fill={alpha(tone, 0.28)} />
        ))}
      </svg>
      <div style={{ position: 'absolute', left: 780, top: 484, width: 230, textAlign: 'center', fontFamily: FONT.sans, fontSize: 46, fontWeight: 850, color: tone }}>{summer ? 'verano' : 'invierno'}</div>

      {/* UTC stays where it is; the local hour is one offset away, and the offset is what changes */}
      <svg width={700} height={200} viewBox="0 0 700 200" style={{ position: 'absolute', left: x0 - 20, top: 306, overflow: 'visible' }} aria-hidden>
        <path d="M 20 10 V 170" stroke={C.emerald} strokeWidth={7} strokeLinecap="round" />
        <path d={`M ${20 + len} 10 V 170`} stroke={tone} strokeWidth={7} strokeLinecap="round" />
        <path d={`M 28 100 H ${20 + len - 12}`} stroke={tone} strokeWidth={7} strokeLinecap="round" />
        <path d={`M ${20 + len - 34} 78 L ${20 + len - 10} 100 L ${20 + len - 34} 122`} stroke={tone} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
      <div style={{ position: 'absolute', left: x0 - 80, top: 262, width: 160, textAlign: 'center', fontFamily: FONT.mono, fontSize: 36, fontWeight: 800, color: C.emerald }}>UTC</div>
      <div style={{ position: 'absolute', left: x0 + len - 150, top: 482, width: 300, textAlign: 'center', fontFamily: FONT.sans, fontSize: 32, fontWeight: 700, color: C.text, whiteSpace: 'nowrap' }}>hora de Halden</div>
      <div style={{ position: 'absolute', left: x0, width: len, top: 322, textAlign: 'center', fontFamily: FONT.mono, fontSize: 42, fontWeight: 800, color: tone }}>
        {summer ? '+02:00' : '+01:00'}
      </div>
      <div style={{ position: 'absolute', left: x0 - 80, top: 538, width: 640, fontFamily: FONT.sans, fontSize: 34, fontWeight: 650, color: C.muted }}>el desfase se mira en cada fecha</div>
    </div>
  );
}

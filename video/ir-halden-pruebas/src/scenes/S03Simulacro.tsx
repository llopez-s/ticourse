import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress, springIn } from '../../../engine/src/theme/motion';
import { Chip, Icon, Stamp, clamp01, dimStyle, mix, type IconName } from '../../../engine/src/ui';
import { BARS, BOTH, COST, DRILL, FIX_ROW, NAME, SPLIT, WORDS } from '../data/s03-simulacro';
import { ImprovementRow, Phone, SpeechBubble } from './parts/Bits';
import { EdrConsole, type ConsoleTimes } from './parts/s03-simulacro/EdrConsole';
import { Stopwatch } from './parts/s03-simulacro/Stopwatch';
import { DrillArt, MesaArt, WAY_TONE, WayChip, twoWaysSize } from './parts/TwoWays';
import { Stage, wordFrame } from './kit';

const S = 's03-simulacro';
const W = 1728;

/** Drill positions: waiting on the right (P1), in front (P2), SIMULATION (P5), closing column (P6). */
const DRILL_POS = {
  wait: { left: 1230, top: 290, w: 420 },
  /** Alone in front before the port's drill comes in. */
  centre: { left: (1728 - 520) / 2, top: 40, w: 520 },
  front: { left: 40, top: 40, w: 520 },
  both: { left: 974, top: 60, w: 560 },
} as const;
const MESA_P1 = { left: 70, top: 250, w: 440 } as const;
const MESA_BOTH = { left: 194, top: 60, w: 560 } as const;
const SCEN_X = 620;
const WATCH = { left: 1360, top: 4, size: 330 } as const;
const CONSOLE_POS = { left: 0, top: 20, w: 1250, h: 400 } as const;
const ROWS_TOP = 446;
const FIX_TOP = 590;

/**
 * s03-simulacro «Probarlo de verdad». The deputy's words at the table,
 * «aislar es cosa mía», and a «¿seguro?» stamp. The fire drill comes back to
 * the front. The port's drill on 2026-10-08 at 22:00: a test laptop
 * (ptl-pruebas-02) inside the test VLAN, a fake attack, a call to the deputy
 * through the out-of-band list, and a minutes stopwatch that starts. The EDR
 * console refuses her «Aislar equipo» (the finding): the plan says she can,
 * her account cannot. The on-call analyst isolates it by her order and the
 * stopwatch stops at «11 min», against more than 18 h in September. The fix
 * row, the exam name SIMULATION and its cost, and the closing columns: the
 * table tests what is said, the drill what is done.
 */
export function S03Simulacro(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = props.cue('words');
  const night = props.cue('night');
  const denied = props.cue('denied');
  const eleven = props.cue('eleven');
  const real = props.cue('real');
  const cost = props.cue('cost');
  const both = props.cue('both');

  const pero = wordFrame(S, 's03-01', 'Pero');
  const demuestra = wordFrame(S, 's03-01', 'demuestra');
  const simulacro = wordFrame(S, 's03-02', 'simulacro.');
  const noche = wordFrame(S, 's03-02', 'noche,');
  const fingen = wordFrame(S, 's03-02', 'fingen');
  const ataque = wordFrame(S, 's03-02', 'ataque');
  const equipo = wordFrame(S, 's03-02', 'equipo');
  const llaman = wordFrame(S, 's03-02', 'llaman');
  const plan = wordFrame(S, 's03-03', 'plan');
  const cuenta = wordFrame(S, 's03-03', 'cuenta');
  const orden = wordFrame(S, 's03-04', 'orden');
  const septiembre = wordFrame(S, 's03-04', 'septiembre,');
  const dieciocho = wordFrame(S, 's03-04', 'dieciocho');
  const horas = wordFrame(S, 's03-04', 'horas.');
  const simulation = wordFrame(S, 's03-05', 'simulation,');
  const gente = wordFrame(S, 's03-05', 'gente');
  const pactado = wordFrame(S, 's03-05', 'pactado');
  const operaciones = wordFrame(S, 's03-05', 'Operaciones.');
  const mesaWord = wordFrame(S, 's03-06', 'mesa');
  const simulacro2 = wordFrame(S, 's03-06', 'simulacro,');

  // --- Phase windows -----------------------------------------------------------
  const p1Out = progress(frame, night - 8, 14, EASE.inOut);
  const scenOut = progress(frame, denied - 16, 14, EASE.inOut);
  const consoleIn = progress(frame, denied - 14, 14);
  const consoleOut = progress(frame, septiembre - 10, 14, EASE.inOut);
  const barsOut = progress(frame, real - 10, 14, EASE.inOut);
  const p5Out = progress(frame, both - 10, 14, EASE.inOut);

  // --- The drill: waiting → front → (gone for the console) → SIMULATION → closing column
  const toFront = progress(frame, night - 6, 22, EASE.inOut);
  const drillBack = progress(frame, real - 8, 20, EASE.inOut);
  const toBoth = progress(frame, both - 8, 22, EASE.inOut);
  const frontLeft = mix(DRILL_POS.centre.left, DRILL_POS.front.left, progress(frame, noche - 16, 20, EASE.inOut));
  const drillLeft = toBoth > 0 ? mix(DRILL_POS.front.left, DRILL_POS.both.left, toBoth) : mix(DRILL_POS.wait.left, frame < real - 20 ? frontLeft : DRILL_POS.front.left, toFront);
  const drillTop = toBoth > 0 ? mix(DRILL_POS.front.top, DRILL_POS.both.top, toBoth) : mix(DRILL_POS.wait.top, DRILL_POS.front.top, toFront);
  const drillW = toBoth > 0 ? mix(DRILL_POS.front.w, DRILL_POS.both.w, toBoth) : mix(DRILL_POS.wait.w, DRILL_POS.front.w, toFront);
  const drillWait = progress(frame, demuestra - 6, 16);
  const drillOpacity = frame < real - 20 ? drillWait * (1 - scenOut) : drillBack;
  const drillAct = Math.max(progress(frame, simulacro - 6, 16), progress(frame, real - 4, 16));
  const drillGlow = toBoth > 0.5 ? progress(frame, simulacro2 - 6, 14) : Math.max(toFront * (1 - scenOut) * 0.8, drillBack * 0.75);
  const drillDim = 0.75 * drillWait * (1 - toFront) + 0.5 * toBoth * (1 - progress(frame, simulacro2 - 6, 14));

  // --- The console and the stopwatch
  const consoleT: ConsoleTimes = { clickAt: denied + 2, analystAt: eleven - 10, isolateAt: eleven + 2, orderAt: orden - 6 };
  const watchStart = fingen - 2;
  const watchStop = consoleT.isolateAt + 6;
  const watchIn = progress(frame, fingen - 12, 14);

  return (
    <Stage>
      {/* P1: the words at the table, and the doubt */}
      {p1Out < 1 ? <Words frame={frame} fps={fps} at={words} doubtAt={pero - 4} out={p1Out} /> : null}

      {/* The drill (every phase but the console) */}
      {drillOpacity > 0.001 ? (
        <div style={{ position: 'absolute', left: drillLeft, top: drillTop, width: drillW, opacity: drillOpacity }}>
          <DrillArt width={drillW} act={drillAct} glow={drillGlow} dim={drillDim} frame={frame} />
          {frame < real ? (
            <div style={{ marginTop: 12, textAlign: 'center', fontFamily: FONT.sans, fontSize: 44, fontWeight: 800, color: C.amber, whiteSpace: 'nowrap', opacity: toFront * (1 - scenOut) }}>{DRILL.caption}</div>
          ) : null}
        </div>
      ) : null}

      {/* P2: the port's drill */}
      {frame >= noche - 10 && scenOut < 1 ? (
        <Scenario frame={frame} fps={fps} dateAt={noche - 6} hostAt={equipo - 10} attackAt={ataque - 4} callAt={llaman - 4} out={scenOut} />
      ) : null}

      {/* The stopwatch runs from the fake attack to the isolation */}
      {watchIn > 0.001 && barsOut < 1 ? (
        <div style={{ position: 'absolute', left: WATCH.left, top: WATCH.top, opacity: watchIn * (1 - barsOut), transform: `translateY(${(1 - watchIn) * 16}px)` }}>
          <Stopwatch frame={frame} fps={fps} size={WATCH.size} startAt={watchStart} stopAt={watchStop} />
        </div>
      ) : null}

      {/* P3/P4a: the console, and what it split */}
      {consoleIn > 0.001 && consoleOut < 1 ? (
        <>
          <div style={{ position: 'absolute', left: CONSOLE_POS.left, top: CONSOLE_POS.top, opacity: consoleIn * (1 - consoleOut), transform: `translateY(${(1 - consoleIn) * 18}px)` }}>
            <EdrConsole frame={frame} fps={fps} width={CONSOLE_POS.w} height={CONSOLE_POS.h} t={consoleT} glow={0.35 * consoleIn} />
          </div>
          <SplitRow top={ROWS_TOP} icon="check" tone={C.emerald} text={SPLIT.plan} p={springIn(frame, fps, plan - 6, { damping: 15 })} dim={0.5 * progress(frame, eleven - 8, 14)} out={consoleOut} />
          <SplitRow top={ROWS_TOP + 92} icon="x" tone={C.rose} text={SPLIT.account} p={springIn(frame, fps, cuenta - 6, { damping: 15 })} dim={0.5 * progress(frame, eleven - 8, 14)} out={consoleOut} />
        </>
      ) : null}

      {/* P4b: eleven minutes against September */}
      {frame >= septiembre - 12 && barsOut < 1 ? <Bars frame={frame} fps={fps} at={septiembre - 8} growAt={dieciocho - 12} out={barsOut} /> : null}

      {/* The fix row, from the bars to the closing columns */}
      {frame >= horas && p5Out < 1 ? (
        <FixRow frame={frame} fps={fps} at={horas + 2} out={p5Out} />
      ) : null}

      {/* P5: SIMULATION and its cost */}
      {frame >= real - 6 && p5Out < 1 ? (
        <NameColumn frame={frame} fps={fps} labelAt={real - 2} nameAt={simulation - 8} chipAt={[gente - 6, pactado - 6, operaciones + 8]} costAt={cost} out={p5Out} />
      ) : null}

      {/* P6: the table says, the drill does */}
      {frame >= both - 10 ? <Closing frame={frame} fps={fps} at={both} mesaAt={mesaWord - 6} drillAt={simulacro2 - 6} /> : null}
    </Stage>
  );
}

// ---------------------------------------------------------------------------
// P1
// ---------------------------------------------------------------------------

function Words({ frame, fps, at, doubtAt, out }: { frame: number; fps: number; at: number; doubtAt: number; out: number }) {
  const mesaIn = progress(frame, 0, 12);
  const bubble = springIn(frame, fps, at - 2, { damping: 15 });
  const who = progress(frame, at + 8, 12);
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: 1 - out, transform: `translateY(${-out * 20}px)` }}>
      <div style={{ position: 'absolute', left: MESA_P1.left, top: MESA_P1.top, opacity: mesaIn }}>
        <MesaArt width={MESA_P1.w} act={1} glow={0.3} frame={frame} />
      </div>
      {bubble > 0.001 ? (
        <div style={{ position: 'absolute', left: 380, top: 60, opacity: Math.min(1, bubble * 1.3), transform: `scale(${0.85 + 0.15 * Math.min(1, bubble)})`, transformOrigin: '10% 100%' }}>
          <SpeechBubble tone={WAY_TONE.mesa} size={66} tail="bottom-left" tailAt={70} glow={0.5}>
            «{WORDS.said}»
          </SpeechBubble>
        </div>
      ) : null}
      <div style={{ position: 'absolute', left: 540, top: 212, opacity: who, transform: `translateY(${(1 - who) * 8}px)` }}>
        <WayChip tone={WAY_TONE.mesa} icon="user" size={34}>
          {WORDS.who}
        </WayChip>
      </div>
      <div style={{ position: 'absolute', left: 1112, top: 126 }}>
        <Stamp frame={frame} at={doubtAt} accent="amber" rotate={7} size={80} style={{ textTransform: 'none', letterSpacing: 0, background: alpha(C.ink950, 0.9), boxShadow: `0 0 36px ${alpha(C.amber, 0.3)}` }}>
          {WORDS.doubt}
        </Stamp>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// P2: the port's drill (date, test VLAN, test laptop, the call)
// ---------------------------------------------------------------------------

function Scenario({ frame, fps, dateAt, hostAt, attackAt, callAt, out }: { frame: number; fps: number; dateAt: number; hostAt: number; attackAt: number; callAt: number; out: number }) {
  const date = enter(frame, dateAt, { distance: 12 });
  const vlan = springIn(frame, fps, hostAt, { damping: 16 });
  const attack = progress(frame, attackAt, 12);
  const call = springIn(frame, fps, callAt, { damping: 15 });
  return (
    <div style={{ position: 'absolute', left: SCEN_X, top: 0, width: 680, height: 660, opacity: 1 - out, fontFamily: FONT.sans }}>
      <div style={{ position: 'absolute', left: 0, top: 44, display: 'flex', alignItems: 'center', gap: 16, whiteSpace: 'nowrap', ...date }}>
        <Icon name="clock" size={46} color={C.amber} />
        <span style={{ fontFamily: FONT.mono, fontSize: 48, fontWeight: 800, color: C.textStrong }}>
          {DRILL.date} <span style={{ color: C.faint }}>·</span> <span style={{ color: '#fcd34d' }}>{DRILL.time}</span>
        </span>
      </div>
      {vlan > 0.001 ? (
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 140,
            width: 640,
            height: 190,
            boxSizing: 'border-box',
            borderRadius: RADIUS.lg,
            border: `3px dashed ${alpha(C.amber, 0.7)}`,
            background: alpha(C.amber, 0.05),
            opacity: Math.min(1, vlan * 1.3),
            transform: `scale(${0.94 + 0.06 * Math.min(1, vlan)})`,
          }}
        >
          <div style={{ position: 'absolute', left: 22, top: -26 }}>
            <Chip accent="amber" icon="network" size={32} style={{ background: C.ink900 }}>
              {DRILL.vlan}
            </Chip>
          </div>
          <div style={{ position: 'absolute', left: 36, top: 54, display: 'flex', alignItems: 'center', gap: 22, whiteSpace: 'nowrap' }}>
            <div style={{ position: 'relative' }}>
              <Icon name="laptop" size={92} color={C.cyan} strokeWidth={1.7} />
              <div style={{ position: 'absolute', right: -16, top: -10, width: 44, height: 44, borderRadius: 22, display: 'grid', placeItems: 'center', background: C.amber, opacity: attack, transform: `scale(${0.6 + 0.4 * attack})` }}>
                <Icon name="bolt" size={28} color={C.ink950} strokeWidth={2.2} />
              </div>
            </div>
            <span style={{ fontFamily: FONT.mono, fontSize: 48, fontWeight: 800, color: C.textStrong }}>{DRILL.host}</span>
          </div>
        </div>
      ) : null}
      {call > 0.001 ? (
        <div style={{ position: 'absolute', left: 30, top: 370, display: 'flex', alignItems: 'center', gap: 34, opacity: Math.min(1, call * 1.3), transform: `translateY(${(1 - Math.min(1, call)) * 16}px)` }}>
          <Phone width={96} list={1} ring={1} frame={frame} />
          <Chip accent="emerald" icon="check" size={34}>
            {DRILL.outOfBand}
          </Chip>
        </div>
      ) : null}
    </div>
  );
}

// ---------------------------------------------------------------------------
// P3: the finding, in two rows (icons drawn, never glyphs)
// ---------------------------------------------------------------------------

function SplitRow({ top, icon, tone, text, p, dim, out }: { top: number; icon: IconName; tone: string; text: string; p: number; dim: number; out: number }) {
  if (p <= 0.001) return null;
  return (
    <div style={{ position: 'absolute', left: 0, top, height: 76, display: 'flex', alignItems: 'center', gap: 24, whiteSpace: 'nowrap', fontFamily: FONT.sans, ...dimStyle(dim, Math.min(1, p * 1.3) * (1 - out)), transform: `translateX(${(1 - Math.min(1, p)) * 24}px)` }}>
      <div style={{ width: 70, height: 70, borderRadius: 35, display: 'grid', placeItems: 'center', background: alpha(tone, 0.16), border: `3px solid ${alpha(tone, 0.9)}` }}>
        <Icon name={icon} size={42} color={tone} strokeWidth={2.8} />
      </div>
      <span style={{ fontSize: 48, fontWeight: 800, color: C.textStrong }}>{text}</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// P4b: the comparison bars
// ---------------------------------------------------------------------------

const TRACK_W = 1200;

function Bars({ frame, fps, at, growAt, out }: { frame: number; fps: number; at: number; growAt: number; out: number }) {
  const b1 = springIn(frame, fps, at, { damping: 16 });
  const b2 = springIn(frame, fps, at + 10, { damping: 16 });
  const grow = progress(frame, growAt, 34, EASE.inOut);
  const w1 = Math.max(20, (TRACK_W * BARS.drill.minutes) / BARS.sept.minutes);
  const bar = (top: number, w: number, tone: string, p: number) => (
    <div style={{ position: 'absolute', left: 0, top, width: TRACK_W, height: 56, borderRadius: 12, background: alpha(C.ink700, 0.7), opacity: Math.min(1, p * 1.3) }}>
      <div style={{ width: w, height: '100%', borderRadius: 12, background: tone, boxShadow: `0 0 24px ${alpha(tone, 0.45)}` }} />
    </div>
  );
  return (
    <div style={{ position: 'absolute', left: 0, top: 40, width: TRACK_W, height: 440, opacity: 1 - out, fontFamily: FONT.sans, whiteSpace: 'nowrap' }}>
      <div style={{ position: 'absolute', left: 0, top: 0, fontSize: 48, fontWeight: 800, color: C.textStrong, ...enter(frame, at, { distance: 12 }) }}>
        {BARS.drill.label} <span style={{ color: C.faint }}>·</span> <span style={{ fontFamily: FONT.mono, color: '#6ee7b7' }}>{BARS.drill.value}</span>
      </div>
      {bar(76, w1, C.emerald, b1)}
      <div style={{ position: 'absolute', left: 0, top: 190, fontSize: 44, fontWeight: 800, color: C.textStrong, ...enter(frame, at + 10, { distance: 12 }) }}>
        <span style={{ color: C.roseSoft }}>{BARS.sept.label}</span> <span style={{ color: C.faint }}>·</span> <span style={{ fontFamily: FONT.mono }}>{BARS.sept.host}</span> <span style={{ color: C.faint }}>·</span> {BARS.sept.value}
      </div>
      {bar(262, Math.max(20, TRACK_W * grow), C.rose, b2)}
    </div>
  );
}

function FixRow({ frame, fps, at, out }: { frame: number; fps: number; at: number; out: number }) {
  const p = springIn(frame, fps, at, { damping: 16 });
  if (p <= 0.001) return null;
  const lit = progress(frame, at, 12) * (1 - 0.5 * progress(frame, at + 90, 20));
  return (
    <div style={{ position: 'absolute', left: 0, top: FIX_TOP, opacity: Math.min(1, p * 1.3) * (1 - out), transform: `translateY(${(1 - Math.min(1, p)) * 18}px)` }}>
      <ImprovementRow imp={FIX_ROW} width={W} height={62} textSize={36} ownerX={1236} dateX={1560} lit={lit} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// P5: SIMULATION and its cost
// ---------------------------------------------------------------------------

const NAME_X = 640;

function NameColumn({ frame, fps, labelAt, nameAt, chipAt, costAt, out }: { frame: number; fps: number; labelAt: number; nameAt: number; chipAt: readonly number[]; costAt: number; out: number }) {
  const label = springIn(frame, fps, labelAt, { damping: 16 });
  const name = progress(frame, nameAt, 14);
  const costHead = progress(frame, costAt - 4, 12);
  return (
    <div style={{ position: 'absolute', left: NAME_X, top: 0, width: W - NAME_X, height: 580, opacity: 1 - out, fontFamily: FONT.sans }}>
      <div style={{ position: 'absolute', left: 0, top: 36, opacity: Math.min(1, label * 1.3), transform: `translateY(${(1 - Math.min(1, label)) * 14}px)` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 32, fontWeight: 700, color: C.text, whiteSpace: 'nowrap' }}>
          <Icon name="mortarboard" size={38} color={C.violet} />
          {NAME.label}
        </div>
        <div style={{ marginTop: 6, fontSize: 72, fontWeight: 850, letterSpacing: 1, color: '#fcd34d', whiteSpace: 'nowrap', opacity: name, transform: `translateY(${(1 - name) * 10}px)`, textShadow: `0 0 28px ${alpha(C.amber, 0.35 * name)}` }}>{NAME.en}</div>
      </div>
      <div style={{ position: 'absolute', left: 0, top: 214, width: 700, height: 3, background: alpha(C.amber, 0.35), opacity: costHead, transform: `scaleX(${costHead})`, transformOrigin: 'left center' }} />
      {COST.map((c, i) => {
        const p = springIn(frame, fps, chipAt[i], { damping: 15 });
        if (p <= 0.001) return null;
        return (
          <div key={c} style={{ position: 'absolute', left: 0, top: 244 + i * 96, opacity: Math.min(1, p * 1.3), transform: `translateX(${(1 - Math.min(1, p)) * 24}px)` }}>
            <Chip accent="amber" icon={(['users', 'link', 'alert'] as const)[i]} size={40}>
              {c}
            </Chip>
          </div>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// P6: the two columns
// ---------------------------------------------------------------------------

function Closing({ frame, fps, at, mesaAt, drillAt }: { frame: number; fps: number; at: number; mesaAt: number; drillAt: number }) {
  const mesaIn = springIn(frame, fps, at - 6, { damping: 16 });
  const mesaLit = progress(frame, mesaAt, 14) * (1 - 0.5 * progress(frame, drillAt, 14));
  const drillLit = progress(frame, drillAt, 14);
  const { height } = twoWaysSize(MESA_BOTH.w);
  const cols = [
    { left: MESA_BOTH.left, tone: '#7dd3fc', name: BOTH.mesa.name, line: BOTH.mesa.line, lit: mesaLit },
    { left: DRILL_POS.both.left, tone: '#fcd34d', name: BOTH.drill.name, line: BOTH.drill.line, lit: drillLit },
  ];
  return (
    <>
      <div style={{ position: 'absolute', left: MESA_BOTH.left, top: MESA_BOTH.top, opacity: Math.min(1, mesaIn * 1.3), transform: `translateY(${(1 - Math.min(1, mesaIn)) * 20}px)` }}>
        <MesaArt width={MESA_BOTH.w} act={1} glow={mesaLit} dim={0.5 * drillLit * (1 - mesaLit)} frame={frame} />
      </div>
      {cols.map((c) => (
        <div key={c.name} style={{ position: 'absolute', left: c.left, top: MESA_BOTH.top + height + 14, width: MESA_BOTH.w, textAlign: 'center', fontFamily: FONT.sans, whiteSpace: 'nowrap', opacity: clamp01(0.35 + c.lit) }}>
          <div style={{ fontSize: 38, fontWeight: 750, color: c.tone }}>{c.name}</div>
          <div style={{ marginTop: 2, fontSize: 56, fontWeight: 850, letterSpacing: -0.6, color: C.textStrong, transform: `scale(${0.94 + 0.06 * c.lit})` }}>{c.line}</div>
        </div>
      ))}
    </>
  );
}

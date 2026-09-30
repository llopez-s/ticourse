import type { CSSProperties, ReactNode } from 'react';
import { interpolateColors, useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, fadeIn, progress, pulse, springIn } from '../../../engine/src/theme/motion';
import { Chip, Cursor, Icon, dimStyle, mix, windowWeight } from '../../../engine/src/ui';
import {
  BOARD_BEFORE,
  CLOSURE,
  CLOSURE_HEAD,
  ERRORS_TITLE,
  ERROR_EVIDENCE,
  ERROR_KEY,
  GONE,
  MORNING,
  SERVER,
  STEPS,
  TICK,
  WIPE,
  type ClosureRow,
  type Step,
} from '../data/s05-order';
import { Board, columnDef, type BoardProps } from './parts/Board';
import { NaveKey } from './parts/Nave';
import { Stage, segment, wordFrame } from './kit';

const S = 's05-order';

/**
 * s05-order «Formatéalo ya».
 *   (intercept)  SILENT PAGER: «Formatea el servidor ya». Under the card (top band kept clear
 *                until s05-01 ends): srv-tc-app03 and a tempting «Formatear ahora» button,
 *                the cursor drifting towards it.
 *   wipe         «sin rastro»: it suits her, not you; the cursor pulls back.
 *   evidence     cleaning before containing = two mistakes. Mistake 1: the memory and the
 *                disk fall into their card and break (the evidence is gone).
 *   back         mistake 2: her key falls in; a return arc draws as the server boots and she
 *                slips back in.
 *   closed       the order: contener, erradicar, recuperar (SVG arrows); «esta mañana» on
 *                the first step, which slams shut on «de golpe».
 *   done         the morning closure at 10:30, all at once: both stations isolated,
 *                srv-tc-app03 quarantined without powering it off, svc_tosreport's password
 *                changed; «los datos ya se habían ido» (04:30); Contención ticked again «10:30».
 */
export function S05Order(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const evidence = props.cue('evidence');
  const closed = props.cue('closed');
  const done = props.cue('done');
  // The intercept card owns the top band until s05-01 has been heard.
  const interceptEnd = segment(props, 's05-01').to;

  const w = {
    her: wordFrame(S, 's05-01', WIPE.herWord),
    you: wordFrame(S, 's05-01', WIPE.youWord),
    dos: wordFrame(S, 's05-02', ERRORS_TITLE.chipWord),
    land1: wordFrame(S, 's05-02', ERROR_EVIDENCE.landWord),
    title1: wordFrame(S, 's05-02', ERROR_EVIDENCE.titleWord),
    break1: wordFrame(S, 's05-02', ERROR_EVIDENCE.breakWord),
    parts: ERROR_EVIDENCE.parts.map((p) => wordFrame(S, 's05-02', p.word)),
    land2: wordFrame(S, 's05-03', ERROR_KEY.landWord),
    title2: wordFrame(S, 's05-03', ERROR_KEY.titleWord),
    sub2: wordFrame(S, 's05-03', ERROR_KEY.subWord),
    arc2: wordFrame(S, 's05-03', ERROR_KEY.arcWord),
    tag2: wordFrame(S, 's05-03', ERROR_KEY.tagWord),
    steps: STEPS.map((s) => (s.word ? wordFrame(S, 's05-04', s.word) : null)),
    despues: wordFrame(S, 's05-04', 'después'),
    morning: wordFrame(S, 's05-04', MORNING.word),
    slam: wordFrame(S, 's05-04', MORNING.slamWord),
    rows: CLOSURE.map((r) => wordFrame(S, 's05-05', r.word)),
    gone: wordFrame(S, 's05-05', GONE.word),
    tick: wordFrame(S, 's05-05', TICK.word),
  };

  // Phase weights: each block cross-fades into the next on its cue.
  const offerOn = fadeIn(frame, 0, 12) * (1 - progress(frame, evidence - 4, 14, EASE.inOut));
  const errorsOn = progress(frame, interceptEnd + 2, 14) * (1 - progress(frame, closed - 6, 14, EASE.inOut));
  const stepsOn = progress(frame, closed + 2, 16) * (1 - progress(frame, done - 8, 12, EASE.inOut));
  const closureOn = progress(frame, done - 6, 14);

  const tickAt = w.tick - 2;
  const board: BoardProps = {
    compact: 1,
    columns: {
      ...BOARD_BEFORE,
      contain: {
        focus: [done - 4, Number.POSITIVE_INFINITY],
        box: [{ at: tickAt, state: 'checked', time: TICK.time }],
        glow: progress(frame, tickAt + 6, 16),
      },
    },
  };

  return (
    <Stage style={{ fontFamily: FONT.sans }}>
      {offerOn > 0.001 ? <WipeOffer frame={frame} opacity={offerOn} herAt={w.her} youAt={w.you} /> : null}

      {errorsOn > 0.001 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: errorsOn }}>
          <ErrorsTitle frame={frame} at={interceptEnd + 4} chipAt={w.dos} />
          <ErrorSlot n={1} left={60} frame={frame} fps={fps} outlineAt={interceptEnd + 10} landAt={w.land1}>
            <EvidenceArt frame={frame} fps={fps} landAt={w.land1} breakAt={w.break1} partAt={w.parts} />
            <CardText frame={frame} title={ERROR_EVIDENCE.title} titleAt={w.title1} sub="lo que había en memoria y en disco" subAt={w.parts[0] - 4} />
          </ErrorSlot>
          <ErrorSlot n={2} left={904} frame={frame} fps={fps} outlineAt={interceptEnd + 10} landAt={w.land2}>
            <KeyArt frame={frame} fps={fps} landAt={w.land2} glowAt={w.title2} arcAt={w.arc2} backAt={w.tag2} />
            <CardText frame={frame} title={ERROR_KEY.title} titleAt={w.title2 - 4} sub={ERROR_KEY.sub} subAt={w.sub2 - 4} />
          </ErrorSlot>
        </div>
      ) : null}

      {stepsOn > 0.001 ? (
        <Steps frame={frame} fps={fps} opacity={stepsOn} at={closed} litAt={w.steps} arrowAt={[w.despues, (w.steps[1] ?? w.despues) + 10]} morningAt={w.morning} slamAt={w.slam} />
      ) : null}

      {closureOn > 0.001 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: closureOn }}>
          <div style={{ position: 'absolute', left: 0, top: 0 }}>
            <Board {...board} show={progress(frame, done - 8, 18)} frame={frame} />
          </div>
          <Closure frame={frame} fps={fps} at={done} rowAt={w.rows} goneAt={w.gone} />
        </div>
      ) : null}
    </Stage>
  );
}

// ---------------------------------------------------------------------------
// s05-01: the server and the tempting button (under the intercepted message).
// ---------------------------------------------------------------------------

const OFFER = { left: 314, top: 262, width: 1100, height: 360 } as const;
const BUTTON = { top: 142, height: 104 } as const;

function WipeOffer({ frame, opacity, herAt, youAt }: { frame: number; opacity: number; herAt: number; youAt: number }) {
  const { fps } = useVideoConfig();
  const tempt = pulse(frame, fps, 0.6) * (1 - progress(frame, youAt, 12));
  const cool = progress(frame, youAt, 14);
  const bx = OFFER.left + OFFER.width / 2;
  const by = OFFER.top + BUTTON.top + BUTTON.height / 2;
  return (
    <div style={{ position: 'absolute', inset: 0, opacity }}>
      <div
        style={{
          position: 'absolute',
          left: OFFER.left,
          top: OFFER.top,
          width: OFFER.width,
          height: OFFER.height,
          boxSizing: 'border-box',
          borderRadius: RADIUS.lg,
          border: `2px solid ${C.ink600}`,
          background: `linear-gradient(180deg, ${C.ink850} 0%, ${C.ink900} 100%)`,
          boxShadow: `0 24px 60px ${alpha('#000000', 0.4)}`,
          ...enter(frame, 0, { distance: 18 }),
        }}
      >
        <div style={{ position: 'absolute', left: 36, top: 26, display: 'flex', alignItems: 'center', gap: 22 }}>
          <Icon name="server" size={64} color={C.cyan} />
          <div>
            <div style={{ fontFamily: FONT.mono, fontSize: 48, fontWeight: 800, color: C.textStrong, lineHeight: 1.1 }}>{SERVER.host}</div>
            <div style={{ fontSize: 28, fontWeight: 600, color: C.muted, marginTop: 2 }}>{SERVER.role}</div>
          </div>
        </div>
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: BUTTON.top,
            height: BUTTON.height,
            transform: 'translateX(-50%)',
            display: 'flex',
            alignItems: 'center',
            gap: 20,
            padding: '0 44px',
            borderRadius: RADIUS.md,
            border: `3px solid ${interpolateColors(cool, [0, 1], [C.rose, C.ink500])}`,
            background: alpha(cool > 0.5 ? C.ink700 : C.rose, 0.12 + 0.1 * tempt),
            boxShadow: `0 0 ${Math.round(18 + 26 * tempt)}px ${alpha(C.rose, 0.35 * tempt)}`,
            whiteSpace: 'nowrap',
          }}
        >
          <Icon name="bolt" size={50} color={interpolateColors(cool, [0, 1], [C.roseSoft, C.muted])} strokeWidth={2.2} />
          <span style={{ fontSize: 52, fontWeight: 800, color: interpolateColors(cool, [0, 1], [C.textStrong, C.muted]) }}>{WIPE.button}</span>
        </div>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 282, display: 'flex', justifyContent: 'center', gap: 28 }}>
          <div style={enter(frame, herAt - 4, { distance: 12 })}>
            <Chip accent="rose" icon="user" size={34}>
              {WIPE.her}
            </Chip>
          </div>
          <div style={enter(frame, youAt - 2, { distance: 12 })}>
            <Chip accent="amber" icon="x" size={34}>
              {WIPE.you}
            </Chip>
          </div>
        </div>
      </div>
      <Cursor
        frame={frame}
        appearAt={16}
        path={[
          { x: 1330, y: 640, at: 26 },
          { x: bx + 90, y: by + 26, at: Math.max(60, herAt - 20) },
          { x: bx + 470, y: by + 210, at: youAt + 30 },
        ]}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// s05-02 / s05-03: the two mistakes, one card and one falling icon each.
// ---------------------------------------------------------------------------

const SLOT = { top: 116, width: 764, height: 520 } as const;
const ART = { top: 40, height: 270 } as const;

function ErrorsTitle({ frame, at, chipAt }: { frame: number; at: number; chipAt: number }) {
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, top: 16, height: 76, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 26, ...enter(frame, at, { distance: 14 }) }}>
      <span style={{ fontSize: 54, fontWeight: 850, letterSpacing: -0.5, color: C.textStrong, whiteSpace: 'nowrap' }}>{ERRORS_TITLE.text}</span>
      <div style={enter(frame, chipAt - 4, { distance: 10, axis: 'x' })}>
        <Chip accent="rose" icon="alert" size={36}>
          {ERRORS_TITLE.chip}
        </Chip>
      </div>
    </div>
  );
}

function ErrorSlot({ n, left, frame, fps, outlineAt, landAt, children }: { n: number; left: number; frame: number; fps: number; outlineAt: number; landAt: number; children: ReactNode }) {
  const outline = fadeIn(frame, outlineAt - 2 + (n - 1) * 5, 12);
  const filled = progress(frame, landAt + 6, 14);
  const pop = springIn(frame, fps, landAt + 6, { damping: 16 });
  if (outline <= 0) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left,
        top: SLOT.top,
        width: SLOT.width,
        height: SLOT.height,
        boxSizing: 'border-box',
        borderRadius: RADIUS.lg,
        border: `2px ${filled > 0.5 ? 'solid' : 'dashed'} ${filled > 0.5 ? alpha(C.rose, 0.55) : alpha(C.muted, 0.45)}`,
        background: filled > 0.01 ? `linear-gradient(180deg, ${alpha(C.ink850, filled)} 0%, ${alpha(C.ink900, filled)} 100%)` : 'transparent',
        boxShadow: filled > 0.01 ? `0 20px 50px ${alpha('#000000', 0.35 * filled)}, 0 0 ${Math.round(30 * pop)}px ${alpha(C.rose, 0.12 * pop)}` : undefined,
        opacity: outline,
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: 24,
          top: 22,
          width: 60,
          height: 60,
          borderRadius: 30,
          display: 'grid',
          placeItems: 'center',
          border: `3px solid ${filled > 0.5 ? C.rose : alpha(C.muted, 0.6)}`,
          color: filled > 0.5 ? C.roseSoft : C.muted,
          fontSize: 34,
          fontWeight: 850,
          background: alpha(C.ink950, 0.6),
        }}
      >
        {n}
      </div>
      {children}
    </div>
  );
}

function CardText({ frame, title, titleAt, sub, subAt }: { frame: number; title: string; titleAt: number; sub?: string; subAt?: number }) {
  return (
    <>
      <div style={{ position: 'absolute', left: 20, right: 20, top: ART.top + ART.height + 18, textAlign: 'center', fontSize: 54, fontWeight: 850, letterSpacing: -0.4, color: C.textStrong, whiteSpace: 'nowrap', ...enter(frame, titleAt, { distance: 14 }) }}>
        {title}
      </div>
      {sub && subAt !== undefined ? (
        <div style={{ position: 'absolute', left: 20, right: 20, top: ART.top + ART.height + 94, textAlign: 'center', fontSize: 34, fontWeight: 600, color: C.muted, whiteSpace: 'nowrap', ...enter(frame, subAt, { distance: 10 }) }}>
          {sub}
        </div>
      ) : null}
    </>
  );
}

/** How far a falling icon still is above its place (px) and its opacity. */
function fall(frame: number, fps: number, at: number, height = 240) {
  const s = springIn(frame, fps, at, { damping: 11, mass: 0.7 });
  return { y: (1 - s) * -height, opacity: progress(frame, at, 6) };
}

/** Mistake 1: memory and disk fall into the card, then break (the evidence is gone). */
function EvidenceArt({ frame, fps, landAt, breakAt, partAt }: { frame: number; fps: number; landAt: number; breakAt: number; partAt: number[] }) {
  if (frame < landAt - 1) return null;
  const broken = progress(frame, breakAt, 16, EASE.inOut);
  const items = [
    { kind: 'ram' as const, x: 150, tilt: -9 },
    { kind: 'disk' as const, x: 470, tilt: 8 },
  ];
  return (
    <div style={{ position: 'absolute', left: 0, top: ART.top, width: SLOT.width, height: ART.height }}>
      {items.map((it, i) => {
        const f = fall(frame, fps, landAt + i * 6);
        const x = progress(frame, breakAt + 4 + i * 4, 12, EASE.inOut);
        const said = windowWeight(frame, partAt[i], i === 0 ? partAt[1] : partAt[1] + 40, { ramp: 8 });
        return (
          <div key={it.kind} style={{ position: 'absolute', left: it.x, top: 0, width: 150, height: ART.height, opacity: f.opacity }}>
            <div style={{ position: 'absolute', left: 0, top: 30, width: 150, height: 150, transform: `translateY(${f.y + 16 * broken}px) rotate(${it.tilt * broken}deg)` }}>
              <svg width={150} height={150} viewBox="0 0 150 150" style={{ overflow: 'visible' }}>
                {/* Two layers (whole, broken) cross-fade: alpha() needs hex colours, not interpolated rgba. */}
                <g opacity={1 - broken}>{it.kind === 'ram' ? <RamStick color={C.cyan} broken={0} /> : <Disk color={C.cyan} broken={0} />}</g>
                <g opacity={broken}>{it.kind === 'ram' ? <RamStick color={C.faint} broken={1} /> : <Disk color={C.faint} broken={1} />}</g>
                {x > 0.001 ? (
                  <g stroke={C.rose} strokeWidth={9} strokeLinecap="round" opacity={0.95}>
                    <line x1={22} y1={22} x2={22 + 106 * x} y2={22 + 106 * x} />
                    <line x1={128} y1={22} x2={128 - 106 * Math.max(0, x * 2 - 1)} y2={22 + 106 * Math.max(0, x * 2 - 1)} />
                  </g>
                ) : null}
              </svg>
            </div>
            <div
              style={{
                position: 'absolute',
                left: -30,
                width: 210,
                top: 196,
                textAlign: 'center',
                fontSize: 40,
                fontWeight: 750,
                color: interpolateColors(said, [0, 1], [C.muted, C.roseSoft]),
                textShadow: said > 0.05 ? `0 0 16px ${alpha(C.rose, 0.5 * said)}` : undefined,
                transform: `scale(${1 + 0.1 * said})`,
              }}
            >
              {ERROR_EVIDENCE.parts[i].label}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function RamStick({ color, broken }: { color: string; broken: number }) {
  return (
    <g>
      <rect x={8} y={44} width={134} height={56} rx={6} fill={alpha(color, 0.14)} stroke={color} strokeWidth={4} strokeDasharray={broken > 0.5 ? '8 7' : undefined} />
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={20 + i * 31} y={54} width={22} height={28} rx={3} fill={alpha(color, 0.55)} />
      ))}
      {Array.from({ length: 11 }, (_, i) => (
        <rect key={i} x={16 + i * 11.6} y={100} width={6} height={12} fill={color} opacity={0.8} />
      ))}
    </g>
  );
}

function Disk({ color, broken }: { color: string; broken: number }) {
  return (
    <g fill="none" stroke={color} strokeWidth={4} strokeDasharray={broken > 0.5 ? '8 7' : undefined}>
      <ellipse cx={75} cy={38} rx={52} ry={16} fill={alpha(color, 0.12)} />
      <path d="M 23 38 L 23 112 A 52 16 0 0 0 127 112 L 127 38" fill={alpha(color, 0.08)} />
      <path d="M 23 75 A 52 16 0 0 0 127 75" />
    </g>
  );
}

/** Mistake 2: her key falls in; a return arc draws as the server boots and she is back inside. */
function KeyArt({ frame, fps, landAt, glowAt, arcAt, backAt }: { frame: number; fps: number; landAt: number; glowAt: number; arcAt: number; backAt: number }) {
  if (frame < landAt - 1) return null;
  const f = fall(frame, fps, landAt, 260);
  const glow = progress(frame, glowAt - 4, 14) * (0.7 + 0.3 * pulse(frame, fps, 0.6));
  const arc = progress(frame, arcAt - 6, 26, EASE.inOut);
  const inside = progress(frame, backAt - 2, 14);
  const cx = SLOT.width / 2;
  const cy = ART.height / 2 + 6;
  const R = 118;
  // A 290° return arc (clockwise from the lower left), with an SVG chevron at its end.
  const a0 = (130 * Math.PI) / 180;
  const sweep = ((290 * Math.PI) / 180) * arc;
  const a1 = a0 + sweep;
  const P = (a: number) => ({ x: cx + R * Math.cos(a), y: cy + R * Math.sin(a) });
  const p0 = P(a0);
  const p1 = P(a1);
  const large = sweep > Math.PI ? 1 : 0;
  const tangent = a1 + Math.PI / 2;
  const head = 22;
  const hx = (d: number) => p1.x + head * Math.cos(tangent + d);
  const hy = (d: number) => p1.y + head * Math.sin(tangent + d);
  return (
    <div style={{ position: 'absolute', left: 0, top: ART.top, width: SLOT.width, height: ART.height }}>
      <svg width={SLOT.width} height={ART.height} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        {arc > 0.01 ? (
          <g stroke={C.rose} strokeWidth={8} fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d={`M ${p0.x} ${p0.y} A ${R} ${R} 0 ${large} 1 ${p1.x} ${p1.y}`} />
            {arc > 0.2 ? <path d={`M ${hx(Math.PI - 0.55)} ${hy(Math.PI - 0.55)} L ${p1.x} ${p1.y} L ${hx(Math.PI + 0.55)} ${hy(Math.PI + 0.55)}`} /> : null}
          </g>
        ) : null}
        {arc > 0.01 ? (
          <g transform={`translate(${p0.x} ${p0.y})`} opacity={Math.min(1, arc * 3)}>
            <circle r={24} fill={C.ink900} stroke={C.emerald} strokeWidth={3} />
            <path d="M -7 -9 A 11 11 0 1 0 7 -9 M 0 -14 L 0 -2" stroke={C.emerald} strokeWidth={3.5} fill="none" strokeLinecap="round" />
          </g>
        ) : null}
      </svg>
      <div style={{ position: 'absolute', left: cx, top: cy, transform: `translate(-50%, -50%) translateY(${f.y}px)`, opacity: f.opacity }}>
        <div style={{ opacity: 1 - inside }}>
          <NaveKey size={170} glow={glow} color={C.amber} />
        </div>
        {inside > 0.001 ? (
          <div style={{ position: 'absolute', left: 0, top: 0, opacity: inside }}>
            <NaveKey size={170} glow={glow} color={C.rose} />
          </div>
        ) : null}
      </div>
      {inside > 0.01 ? (
        <svg width={60} height={80} viewBox="-30 -70 60 80" style={{ position: 'absolute', left: cx + 118, top: cy + 34, overflow: 'visible', opacity: inside, transform: `translateX(${(1 - inside) * 30}px)` }}>
          <g style={{ filter: `drop-shadow(0 0 6px ${alpha(C.rose, 0.7)})` }}>
            <path d="M -17 0 L -15 -30 Q -14 -40 0 -41 Q 14 -40 15 -30 L 17 0 Z" fill={C.rose} />
            <circle cx={0} cy={-52} r={11} fill={C.rose} />
          </g>
        </svg>
      ) : null}
    </div>
  );
}

// ---------------------------------------------------------------------------
// s05-04: contener, erradicar, recuperar.
// ---------------------------------------------------------------------------

const STEP = { top: 170, width: 440, height: 300, gap: 132 } as const;
const stepLeft = (i: number) => 72 + i * (STEP.width + STEP.gap);

function Steps({
  frame,
  fps,
  opacity,
  at,
  litAt,
  arrowAt,
  morningAt,
  slamAt,
}: {
  frame: number;
  fps: number;
  opacity: number;
  at: number;
  litAt: (number | null)[];
  arrowAt: number[];
  morningAt: number;
  slamAt: number;
}) {
  // The third step (recuperar) is not said: it lights just after «limpias».
  const lits = litAt.map((l, i) => l ?? (litAt[i - 1] ?? at) + 16);
  const morning = progress(frame, morningAt - 6, 16);
  const cy = STEP.top + STEP.height / 2;
  return (
    <div style={{ position: 'absolute', inset: 0, opacity }}>
      {STEPS.map((s, i) => (
        <StepCard
          key={s.id}
          step={s}
          n={i + 1}
          left={stepLeft(i)}
          frame={frame}
          fps={fps}
          appearAt={at + 2 + i * 6}
          litAt={lits[i] - 4}
          dim={i > 0 ? morning : 0}
          slamAt={i === 0 ? slamAt : null}
        />
      ))}
      <svg width={1728} height={660} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        {[0, 1].map((i) => {
          const draw = progress(frame, arrowAt[i] - 6, 14, EASE.inOut);
          if (draw <= 0.001) return null;
          const x0 = stepLeft(i) + STEP.width + 18;
          const x1 = stepLeft(i + 1) - 18;
          const xe = x0 + (x1 - x0) * draw;
          return (
            <g key={i} stroke={C.cyan} strokeWidth={7} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={1 - 0.6 * (i === 1 ? morning : 0)}>
              <line x1={x0} y1={cy} x2={xe} y2={cy} />
              {draw > 0.6 ? <path d={`M ${xe - 20} ${cy - 20} L ${xe} ${cy} L ${xe - 20} ${cy + 20}`} opacity={progress(draw, 0.6, 0.4)} /> : null}
            </g>
          );
        })}
      </svg>
      {morning > 0.001 ? (
        <div style={{ position: 'absolute', left: stepLeft(0) + STEP.width / 2, top: STEP.top + STEP.height + 34, opacity: morning, transform: `translateX(-50%) translateY(${(1 - morning) * 12}px)` }}>
          <Chip accent="cyan" icon="clock" size={36}>
            {MORNING.label} · {MORNING.time}
          </Chip>
        </div>
      ) : null}
    </div>
  );
}

function StepCard({
  step,
  n,
  left,
  frame,
  fps,
  appearAt,
  litAt,
  dim,
  slamAt,
}: {
  step: Step;
  n: number;
  left: number;
  frame: number;
  fps: number;
  appearAt: number;
  litAt: number;
  dim: number;
  slamAt: number | null;
}) {
  const inn = enter(frame, appearAt, { distance: 20 });
  const lit = progress(frame, litAt, 12);
  const slam = slamAt === null ? 0 : springIn(frame, fps, slamAt - 4, { damping: 9 });
  const slamPulse = slamAt === null ? 0 : progress(frame, slamAt - 4, 6) * (1 - progress(frame, slamAt + 6, 20));
  const iconScale = slamAt !== null && frame >= slamAt - 4 ? 1.35 - 0.35 * slam : 1;
  const def = columnDef(step.id);
  const ring = Math.max(lit * 0.8, slamPulse);
  return (
    <div
      style={{
        position: 'absolute',
        left,
        top: STEP.top,
        width: STEP.width,
        height: STEP.height,
        boxSizing: 'border-box',
        borderRadius: RADIUS.lg,
        border: `2px solid ${interpolateColors(lit, [0, 1], [C.ink600, alpha(C.cyan, 0.85)])}`,
        background: `linear-gradient(180deg, ${alpha(C.cyan, 0.03 + 0.08 * lit)} 0%, ${C.ink900} 100%)`,
        boxShadow: `0 18px 44px ${alpha('#000000', 0.35)}${ring > 0.01 ? `, 0 0 ${Math.round(20 + 30 * ring)}px ${alpha(C.cyan, 0.3 * ring)}` : ''}`,
        textAlign: 'center',
        opacity: inn.opacity,
        transform: `${inn.transform} scale(${1 + 0.04 * lit - 0.04 * dim})`,
        ...dimStyle(dim, inn.opacity),
      }}
    >
      <div style={{ position: 'absolute', left: 22, top: 16, fontSize: 26, fontWeight: 800, color: lit > 0.5 ? C.cyanSoft : C.faint }}>{n}</div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 30, display: 'flex', justifyContent: 'center' }}>
        <Icon name={step.icon} size={66} color={interpolateColors(lit, [0, 1], [C.muted, C.cyan])} strokeWidth={2.2} style={{ transform: `scale(${iconScale})` }} />
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 108, fontSize: 60, fontWeight: 850, letterSpacing: -0.5, color: C.textStrong, lineHeight: 1.1 }}>{step.verb}</div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 180, fontSize: 30, fontWeight: 650, color: '#c4b5fd' }}>{def.en}</div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 230, fontSize: 36, fontWeight: 700, color: C.cyanSoft, whiteSpace: 'nowrap', opacity: lit }}>{step.sub}</div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// s05-05: the morning closure, all at once.
// ---------------------------------------------------------------------------

const TILE = { top: 222, width: 852, height: 150, gapX: 24, gapY: 14 } as const;
const GONE_BOX = { top: 556, height: 94 } as const;

function Closure({ frame, fps, at, rowAt, goneAt }: { frame: number; fps: number; at: number; rowAt: number[]; goneAt: number }) {
  const slam = springIn(frame, fps, at - 2, { damping: 15 });
  // Each row lights from its word until the next one is said (the last until «datos»).
  const lit = rowAt.map((r, i) => windowWeight(frame, r, rowAt[i + 1] ?? goneAt, { ramp: 8 }));
  const head: CSSProperties = { position: 'absolute', left: 0, top: 166, height: 46, display: 'flex', alignItems: 'center', gap: 16, whiteSpace: 'nowrap', ...enter(frame, at - 4, { distance: 10 }) };
  return (
    <>
      <div style={head}>
        <Icon name="clock" size={40} color={C.cyan} />
        <span style={{ fontFamily: FONT.mono, fontSize: 38, fontWeight: 800, color: C.cyanSoft }}>
          {CLOSURE_HEAD.date} · {CLOSURE_HEAD.time}
        </span>
        <span style={{ fontSize: 34, fontWeight: 650, color: C.muted }}>{CLOSURE_HEAD.text}</span>
      </div>
      {CLOSURE.map((r, i) => (
        <ClosureTile key={r.name} row={r} i={i} slam={slam} lit={lit[i]} />
      ))}
      <Gone frame={frame} at={goneAt} />
    </>
  );
}

function ClosureTile({ row, i, slam, lit }: { row: ClosureRow; i: number; slam: number; lit: number }) {
  const col = i % 2;
  const line = Math.floor(i / 2);
  const left = col * (TILE.width + TILE.gapX);
  const top = TILE.top + line * (TILE.height + TILE.gapY);
  return (
    <div
      style={{
        position: 'absolute',
        left,
        top,
        width: TILE.width,
        height: TILE.height,
        boxSizing: 'border-box',
        borderRadius: RADIUS.md,
        border: `2px solid ${interpolateColors(lit, [0, 1], [alpha(C.cyan, 0.35), C.cyan])}`,
        background: `linear-gradient(90deg, ${alpha(C.cyan, 0.06 + 0.08 * lit)} 0%, ${C.ink900} 70%)`,
        boxShadow: lit > 0.01 ? `0 0 ${Math.round(26 * lit)}px ${alpha(C.cyan, 0.3 * lit)}` : undefined,
        opacity: Math.min(1, slam * 1.3),
        transform: `scale(${mix(1.08, 1, slam)})`,
        display: 'flex',
        alignItems: 'center',
        gap: 24,
        padding: '0 26px',
      }}
    >
      <div style={{ width: 88, height: 88, flexShrink: 0, borderRadius: 18, display: 'grid', placeItems: 'center', background: alpha(C.cyan, 0.12), border: `2px solid ${alpha(C.cyan, 0.5)}` }}>
        <Icon name={row.icon} size={52} color={C.cyan} strokeWidth={2.2} />
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontFamily: FONT.mono, fontSize: 42, fontWeight: 800, color: C.textStrong, lineHeight: 1.15, whiteSpace: 'nowrap' }}>{row.name}</div>
        <div style={{ fontSize: 38, fontWeight: 800, color: C.cyanSoft, lineHeight: 1.15, whiteSpace: 'nowrap' }}>{row.state}</div>
        {row.note ? <div style={{ fontSize: 27, fontWeight: 600, color: C.muted, lineHeight: 1.25, whiteSpace: 'nowrap' }}>{row.note}</div> : null}
      </div>
    </div>
  );
}

function Gone({ frame, at }: { frame: number; at: number }) {
  if (frame < at - 6) return null;
  const inn = enter(frame, at - 4, { distance: 16 });
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: GONE_BOX.top,
        width: 1728,
        height: GONE_BOX.height,
        boxSizing: 'border-box',
        borderRadius: RADIUS.md,
        border: `2px solid ${alpha(C.amber, 0.7)}`,
        background: alpha(C.amber, 0.08),
        display: 'flex',
        alignItems: 'center',
        gap: 22,
        padding: '0 30px',
        whiteSpace: 'nowrap',
        ...inn,
      }}
    >
      <Icon name="alert" size={46} color={C.amber} strokeWidth={2.2} />
      <span style={{ fontSize: 46, fontWeight: 800, color: '#fcd34d' }}>{GONE.text}</span>
      <span style={{ marginLeft: 'auto', fontFamily: FONT.mono, fontSize: 30, fontWeight: 700, color: C.text }}>{GONE.detail}</span>
    </div>
  );
}

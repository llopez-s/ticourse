import type { ReactNode } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { EASE, progress, pulse, springIn } from '../../../engine/src/theme/motion';
import { Icon, clamp01, dimStyle, mix } from '../../../engine/src/ui';
import { LABELS, LOGIN, TOKENS, TYPES } from '../data/s07-factors';
import { MarkStamp, TermTag, TokenChip, flight, type Pt } from './parts/Marks';
import { Stage, segment, wordFrame } from './kit';

const S = 's07-factors';
const W = 1728;

// The two login screens (phase A).
const SCREEN = { w: 760, h: 350, gap: 40 };
const PAIR_X = (W - (2 * SCREEN.w + SCREEN.gap)) / 2;
const SCREEN_Y_HIGH = 155; // centred while the stage is free
const SCREEN_Y_LOW = 262; // under the intercepted message

// The four bins (phase B).
const BIN_W = 414;
const BIN_GAP = (W - 4 * BIN_W) / 3;
const binX = (i: number) => i * (BIN_W + BIN_GAP);
const BIN = { headH: 76, exTop: 94, exPitch: 48, trayTop: 298, trayH: 150 };
const slotY = (k: number) => BIN.trayTop + 42 + k * 66;
const trayCenter = (i: number, k: number): Pt => ({ x: binX(i) + BIN_W / 2, y: slotY(k) });
const exampleCenter = (i: number, k: number): Pt => ({ x: binX(i) + 28 + 100, y: BIN.exTop + k * BIN.exPitch + 20 });

// Bottom band: the ATM (left), the two screens as chips (right), labels (centre).
const ATM = { x: 6, y: 466, w: 180, h: 193 };
const SRC_RIGHT = W;
const SRC_Y = [480, 556];
const LABEL_Y = 566;

/**
 * s07-factors «Tarjeta y PIN». A generic login asks for a password and then a
 * secret question (two screens, no brand). After SILENT PAGER's message, four
 * bins — algo que sabes / tienes / eres / dónde estás — and things drop into
 * their trays: the ATM's card and PIN land in two different bins («dos robos
 * distintos»); the password and the question both land in «sabes» («1 factor»,
 * on the cue, with the error sound), and so do a token and a code app in
 * «tienes». MFA · multifactor: «tipos distintos, no pantallas».
 */
export function S07Factors(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const types = props.cue('types');
  const atm = props.cue('atm');
  const twoThefts = props.cue('two-thefts');
  const sameType = props.cue('same-type');
  const oneFactor = props.cue('one-factor');
  const mfa = props.cue('mfa');
  const s01 = segment(props, 's07-01');

  const wPass = wordFrame(S, 's07-01', 'contraseña');
  const wQuestion = wordFrame(S, 's07-01', 'pregunta');
  const binAt = [types, wordFrame(S, 's07-03', 'tienes') - 6, wordFrame(S, 's07-03', 'eres') - 6, wordFrame(S, 's07-03', 'dónde') - 6];
  const wCard = wordFrame(S, 's07-04', 'tarjeta');
  const wHave = wordFrame(S, 's07-04', 'tienes');
  const wPin = wordFrame(S, 's07-04', 'PIN');
  const wKnow = wordFrame(S, 's07-04', 'sabes');
  const wPass2 = wordFrame(S, 's07-05', 'contraseña');
  const wQuestion2 = wordFrame(S, 's07-05', 'pregunta');
  const wCall = wordFrame(S, 's07-05', 'llamada');
  const wToken = wordFrame(S, 's07-06', 'token');
  const wApp = wordFrame(S, 's07-06', 'app');
  const wHave2 = wordFrame(S, 's07-06', 'tienes');

  // ---- Phase A: the two login screens --------------------------------------
  const lower = progress(frame, s01.to - 26, 22, EASE.inOut);
  const screenY = mix(SCREEN_Y_HIGH, SCREEN_Y_LOW, lower);
  const second = progress(frame, wQuestion - 8, 18, EASE.inOut);
  const screensOut = progress(frame, types - 10, 16, EASE.inOut);
  const s1x = mix((W - SCREEN.w) / 2, PAIR_X, second);
  const s2x = PAIR_X + SCREEN.w + SCREEN.gap;

  // ---- Phase B ---------------------------------------------------------------
  const srcIn = progress(frame, types - 2, 14);
  const atmIn = progress(frame, atm - 2, 16);
  const atmOut = progress(frame, sameType - 8, 16, EASE.inOut);
  const srcOut = progress(frame, mfa - 6, 16, EASE.inOut);

  // Flights (start, duration).
  const cardFly = { start: wCard + 2, dur: Math.max(14, wHave + 6 - (wCard + 2)) };
  const pinFly = { start: wPin + 2, dur: Math.max(12, wKnow + 6 - (wPin + 2)) };
  const passFly = { start: wPass2 - 2, dur: 20 };
  const questionFly = { start: wQuestion2 - 2, dur: 20 };
  const tokenFly = { start: wToken - 4, dur: 18 };
  const appFly = { start: wApp - 4, dur: 18 };
  const atmTokensOut = progress(frame, sameType - 8, 12, EASE.inOut);

  const theftsGlow = progress(frame, twoThefts - 2, 12) * (1 - atmTokensOut);
  const knowAmber = progress(frame, oneFactor, 8);
  const haveAmber = progress(frame, wHave2, 8);

  // Bin focus: «eres» and «dónde estás» step back while the pairs are tested; «sabes» / «tienes» take turns.
  const testing = progress(frame, atm - 4, 14) * (1 - progress(frame, mfa - 4, 14));
  const haveBack = progress(frame, sameType - 4, 14) * (1 - progress(frame, wToken - 10, 12));
  const knowBack = progress(frame, wToken - 10, 12) * (1 - progress(frame, mfa - 4, 14)) * 0.6;
  const binDim = [knowBack, haveBack, testing, testing];
  const allGlow = progress(frame, mfa, 16);

  const ex = TYPES[1].examples;

  return (
    <Stage>
      {/* Phase A: the generic login, two screens */}
      {screensOut < 1 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: 1 - screensOut, transform: `scale(${1 - 0.12 * screensOut})`, transformOrigin: '80% 85%' }}>
          <LoginScreen x={s1x} y={screenY} step={1} frame={frame} typeAt={wPass + 2} active={1 - second * 0.5} />
          {second > 0 ? (
            <div style={{ opacity: second }}>
              <LoginScreen x={s2x + (1 - second) * 80} y={screenY} step={2} frame={frame} typeAt={wQuestion + 26} active={1} />
            </div>
          ) : null}
        </div>
      ) : null}

      {/* Phase B: the four bins */}
      {TYPES.map((t, i) => {
        const p = springIn(frame, fps, binAt[i], { damping: 17 });
        if (frame < binAt[i] - 1) return null;
        return (
          <div key={t.id} style={{ position: 'absolute', left: binX(i), top: 0 }}>
            <Bin
              type={t}
              p={Math.min(1, p)}
              dim={binDim[i]}
              dashed={t.id === 'where'}
              trayTone={i === 0 ? (knowAmber > 0 ? 'amber' : theftsGlow > 0 ? 'emerald' : 'cyan') : i === 1 ? (haveAmber > 0 ? 'amber' : theftsGlow > 0 ? 'emerald' : 'cyan') : 'cyan'}
              trayGlow={i < 2 ? Math.max(theftsGlow, i === 0 ? knowAmber * (1 - knowBack) : haveAmber) : 0}
              headGlow={allGlow * (0.75 + 0.25 * pulse(frame, fps, 0.5))}
            />
          </div>
        );
      })}

      {/* The ATM */}
      {atmIn > 0 && atmOut < 1 ? (
        <div style={{ position: 'absolute', left: ATM.x, top: ATM.y, opacity: atmIn * (1 - atmOut), transform: `translateY(${(1 - atmIn) * 20}px)` }}>
          <AtmArt w={ATM.w} h={ATM.h} cardOut={1 - progress(frame, cardFly.start, 8)} />
        </div>
      ) : null}

      {/* The two screens, waiting as chips (right) */}
      {srcIn > 0 && srcOut < 1 ? (
        <>
          <SourceChip text={TOKENS.password} y={SRC_Y[0]} gone={progress(frame, passFly.start, 4)} p={srcIn * (1 - srcOut)} />
          <SourceChip text={TOKENS.question} y={SRC_Y[1]} gone={progress(frame, questionFly.start, 4)} p={srcIn * (1 - srcOut)} />
        </>
      ) : null}

      {/* Flying tokens */}
      <Flyer frame={frame} {...cardFly} from={{ x: ATM.x + 130, y: ATM.y + 100 }} to={trayCenter(1, 0)} out={atmTokensOut} appearAt={wCard - 4}>
        <TokenChip size={34} text={TOKENS.card} icon="layers" tone={theftsGlow > 0.3 ? 'emerald' : 'sky'} glow={theftsGlow} />
      </Flyer>
      <Flyer frame={frame} {...pinFly} from={{ x: ATM.x + 64, y: ATM.y + 150 }} to={trayCenter(0, 0)} out={atmTokensOut} appearAt={wPin - 4}>
        <TokenChip size={34} text={TOKENS.pin} icon="gear" tone={theftsGlow > 0.3 ? 'emerald' : 'sky'} glow={theftsGlow} />
      </Flyer>
      <Flyer frame={frame} {...passFly} from={{ x: SRC_RIGHT - 150, y: SRC_Y[0] + 28 }} to={trayCenter(0, 0)} out={0} appearAt={passFly.start}>
        <TokenChip size={34} text={TOKENS.password} icon="app" tone={knowAmber > 0.3 ? 'amber' : 'cyan'} glow={knowAmber * (1 - knowBack)} />
      </Flyer>
      <Flyer frame={frame} {...questionFly} from={{ x: SRC_RIGHT - 190, y: SRC_Y[1] + 28 }} to={trayCenter(0, 1)} out={0} appearAt={questionFly.start}>
        <TokenChip size={34} text={TOKENS.question} icon="app" tone={knowAmber > 0.3 ? 'amber' : 'cyan'} glow={knowAmber * (1 - knowBack)} />
      </Flyer>
      <Flyer frame={frame} {...tokenFly} from={exampleCenter(1, 0)} to={trayCenter(1, 0)} out={0} appearAt={tokenFly.start} lift={20}>
        <TokenChip size={34} text={ex[0]} icon="key" tone={haveAmber > 0.3 ? 'amber' : 'cyan'} glow={haveAmber} />
      </Flyer>
      <Flyer frame={frame} {...appFly} from={exampleCenter(1, 1)} to={trayCenter(1, 1)} out={0} appearAt={appFly.start} lift={20}>
        <TokenChip size={34} text={ex[1]} icon="key" tone={haveAmber > 0.3 ? 'amber' : 'cyan'} glow={haveAmber} />
      </Flyer>

      {/* «dos robos distintos»: a bracket under «sabes» and «tienes» */}
      <Thefts frame={frame} at={twoThefts} out={atmTokensOut} />

      {/* «en una sola llamada te sacan las dos» */}
      <BottomLine frame={frame} at={wCall - 8} outAt={wToken - 10} tone={C.amber}>
        {LABELS.oneCall}
      </BottomLine>

      {/* «1 factor» stamps: «sabes» on the cue (error sound), «tienes» on «tienes» */}
      <div style={{ position: 'absolute', left: binX(0), top: BIN.trayTop + BIN.trayH + 12, width: BIN_W, display: 'flex', justifyContent: 'center', ...dimStyle(knowBack) }}>
        <MarkStamp frame={frame} at={oneFactor} tone="amber" size={44}>
          {LABELS.oneFactor}
        </MarkStamp>
      </div>
      <div style={{ position: 'absolute', left: binX(1), top: BIN.trayTop + BIN.trayH + 12, width: BIN_W, display: 'flex', justifyContent: 'center' }}>
        <MarkStamp frame={frame} at={wHave2} tone="amber" size={44}>
          {LABELS.oneFactor}
        </MarkStamp>
      </div>

      {/* MFA · multifactor */}
      <div style={{ position: 'absolute', left: binX(2), top: BIN.trayTop + BIN.trayH + 26, width: W - binX(2), display: 'flex', justifyContent: 'center' }}>
        <TermTag frame={frame} fps={fps} at={mfa} term={LABELS.mfa} sub={LABELS.mfaSub} subAt={wordFrame(S, 's07-07', 'Tipos') - 4} size={56} subSize={38} align="center" />
      </div>
    </Stage>
  );
}

// ---------------------------------------------------------------------------

function LoginScreen({ x, y, step, frame, typeAt, active }: { x: number; y: number; step: 1 | 2; frame: number; typeAt: number; active: number }) {
  const dots = Math.max(0, Math.min(step === 1 ? 10 : 6, Math.floor((frame - typeAt) / 2)));
  const pressed = progress(frame, typeAt + (step === 1 ? 24 : 16), 8);
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: SCREEN.w,
        height: SCREEN.h,
        boxSizing: 'border-box',
        borderRadius: RADIUS.lg,
        border: `2px solid ${alpha(C.cyan, 0.25 + 0.4 * active)}`,
        background: `linear-gradient(180deg, ${C.ink850} 0%, ${C.ink900} 100%)`,
        boxShadow: `0 30px 70px ${alpha('#000000', 0.42)}`,
        overflow: 'hidden',
        fontFamily: FONT.sans,
        opacity: 0.55 + 0.45 * active,
      }}
    >
      <div style={{ height: 64, display: 'flex', alignItems: 'center', gap: 14, padding: '0 26px', background: alpha(C.ink800, 0.95), borderBottom: `2px solid ${C.ink700}` }}>
        <Icon name="user" size={34} color={C.cyan} />
        <span style={{ fontSize: 34, fontWeight: 800, color: C.textStrong }}>{LOGIN.title}</span>
        <span style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          {[1, 2].map((k) => (
            <span key={k} style={{ width: 14, height: 14, borderRadius: 7, background: k === step ? C.cyan : C.ink600 }} />
          ))}
        </span>
      </div>
      <div style={{ padding: '22px 30px 0' }}>
        {step === 1 ? (
          <div style={{ fontSize: 40, fontWeight: 750, color: C.text }}>{LOGIN.password}</div>
        ) : (
          <>
            <div style={{ fontSize: 32, fontWeight: 650, color: C.muted }}>{LOGIN.questionLabel}</div>
            <div style={{ marginTop: 4, fontSize: 36, fontWeight: 750, color: C.textStrong, whiteSpace: 'nowrap' }}>{LOGIN.question}</div>
          </>
        )}
        <div
          style={{
            marginTop: 14,
            height: 62,
            borderRadius: RADIUS.sm,
            border: `2px solid ${dots > 0 ? alpha(C.cyan, 0.7) : C.ink600}`,
            background: C.ink950,
            display: 'flex',
            alignItems: 'center',
            padding: '0 18px',
            gap: 10,
          }}
        >
          {Array.from({ length: dots }, (_, k) => (
            <span key={k} style={{ width: 16, height: 16, borderRadius: 8, background: C.text }} />
          ))}
        </div>
        <div style={{ marginTop: step === 1 ? 40 : 16, display: 'flex', justifyContent: 'flex-end' }}>
          <span
            style={{
              padding: '10px 30px',
              borderRadius: RADIUS.sm,
              background: pressed > 0.5 ? C.cyanDeep : alpha(C.cyan, 0.85),
              color: C.ink950,
              fontSize: 28,
              fontWeight: 800,
            }}
          >
            {step === 1 ? LOGIN.next : LOGIN.enter}
          </span>
        </div>
      </div>
    </div>
  );
}

function Bin({
  type,
  p,
  dim,
  dashed,
  trayTone,
  trayGlow,
  headGlow,
}: {
  type: (typeof TYPES)[number];
  p: number;
  dim: number;
  dashed: boolean;
  trayTone: 'cyan' | 'emerald' | 'amber';
  trayGlow: number;
  headGlow: number;
}) {
  const col = trayTone === 'emerald' ? C.emerald : trayTone === 'amber' ? C.amber : C.cyan;
  const hg = clamp01(headGlow);
  return (
    <div style={{ position: 'relative', width: BIN_W, height: BIN.trayTop + BIN.trayH, ...dimStyle(dim, p), transform: `translateY(${(1 - p) * 22}px)` }}>
      {/* Header */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: BIN_W,
          height: BIN.headH,
          boxSizing: 'border-box',
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          padding: '0 18px',
          borderRadius: RADIUS.md,
          border: `${dashed ? '2px dashed' : '2px solid'} ${alpha(C.cyan, 0.45 + 0.45 * hg)}`,
          background: `linear-gradient(180deg, ${alpha(C.cyan, 0.12 + 0.1 * hg)} 0%, ${alpha(C.ink900, 0.95)} 100%)`,
          boxShadow: hg > 0.02 ? `0 0 ${Math.round(28 * hg)}px ${alpha(C.cyan, 0.35 * hg)}` : undefined,
        }}
      >
        <Icon name={type.icon} size={44} color={C.cyan} strokeWidth={2} />
        <span style={{ fontSize: 40, fontWeight: 850, color: C.textStrong, whiteSpace: 'nowrap', letterSpacing: -0.4 }}>{type.title}</span>
      </div>
      {/* Examples */}
      {type.examples.map((e, k) => (
        <div
          key={e}
          style={{
            position: 'absolute',
            left: 28,
            top: BIN.exTop + k * BIN.exPitch,
            height: 42,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            fontSize: 32,
            fontWeight: 600,
            color: C.text,
            whiteSpace: 'nowrap',
          }}
        >
          <span style={{ width: 8, height: 8, borderRadius: 4, background: alpha(C.cyan, 0.7) }} />
          {e}
        </div>
      ))}
      {/* Tray */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: BIN.trayTop,
          width: BIN_W,
          height: BIN.trayH,
          boxSizing: 'border-box',
          borderRadius: RADIUS.md,
          border: `3px dashed ${alpha(col, 0.35 + 0.55 * clamp01(trayGlow))}`,
          background: alpha(col, 0.04 + 0.08 * clamp01(trayGlow)),
          boxShadow: trayGlow > 0.02 ? `0 0 ${Math.round(30 * trayGlow)}px ${alpha(col, 0.3 * trayGlow)}` : undefined,
        }}
      />
    </div>
  );
}

function AtmArt({ w, h, cardOut }: { w: number; h: number; cardOut: number }) {
  return (
    <svg width={w} height={h} viewBox="0 0 200 214" style={{ overflow: 'visible' }}>
      <rect x={4} y={4} width={192} height={206} rx={16} fill={C.ink800} stroke={C.sky} strokeWidth={4} />
      <rect x={22} y={20} width={156} height={60} rx={8} fill={alpha(C.sky, 0.16)} stroke={alpha(C.sky, 0.7)} strokeWidth={3} />
      <path d="M 40 42 L 120 42 M 40 58 L 96 58" stroke={alpha(C.sky, 0.8)} strokeWidth={5} strokeLinecap="round" />
      {/* Card slot with the card sticking out */}
      <rect x={110} y={94} width={70} height={10} rx={4} fill={C.ink950} stroke={alpha(C.sky, 0.6)} strokeWidth={2} />
      {cardOut > 0 ? (
        <g opacity={cardOut}>
          <rect x={120} y={98} width={50} height={34} rx={5} fill={alpha(C.sky, 0.9)} />
          <rect x={126} y={106} width={12} height={9} rx={2} fill={C.amber} />
        </g>
      ) : null}
      {/* Keypad */}
      {Array.from({ length: 9 }, (_, k) => (
        <rect key={k} x={26 + (k % 3) * 26} y={120 + Math.floor(k / 3) * 26} width={20} height={20} rx={4} fill={C.ink700} stroke={alpha(C.sky, 0.5)} strokeWidth={2} />
      ))}
    </svg>
  );
}

function SourceChip({ text, y, gone, p }: { text: string; y: number; gone: number; p: number }) {
  if (p <= 0.001) return null;
  return (
    <div style={{ position: 'absolute', right: 0, top: y, display: 'flex', justifyContent: 'flex-end', opacity: p * (1 - 0.75 * gone), transform: `translateX(${(1 - p) * 30}px)` }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '8px 22px',
          borderRadius: RADIUS.md,
          border: `2px ${gone > 0.5 ? 'dashed' : 'solid'} ${alpha(C.cyan, 0.45)}`,
          background: alpha(C.ink850, 0.9),
          fontFamily: FONT.sans,
          fontSize: 30,
          fontWeight: 700,
          color: gone > 0.5 ? C.faint : C.text,
          whiteSpace: 'nowrap',
        }}
      >
        <Icon name="app" size={32} color={C.cyan} />
        {text}
      </div>
    </div>
  );
}

function Flyer({ frame, start, dur, from, to, out, appearAt, lift = 90, children }: { frame: number; start: number; dur: number; from: Pt; to: Pt; out: number; appearAt: number; lift?: number; children: ReactNode }) {
  if (frame < appearAt) return null;
  const pos = flight(frame, start, dur, from, to, lift);
  const appear = progress(frame, appearAt, 8);
  const vis = appear * (1 - out);
  if (vis <= 0.001) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: pos.x,
        top: pos.y,
        transform: `translate(-50%, -50%) scale(${0.85 + 0.15 * appear})`,
        opacity: vis,
      }}
    >
      {children}
    </div>
  );
}

function Thefts({ frame, at, out }: { frame: number; at: number; out: number }) {
  const p = progress(frame, at - 2, 16) * (1 - out);
  if (p <= 0.001) return null;
  const x1 = binX(0) + BIN_W / 2;
  const x2 = binX(1) + BIN_W / 2;
  const y = BIN.trayTop + BIN.trayH + 8;
  return (
    <>
      <svg width={W} height={660} style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none', opacity: p }}>
        <path d={`M ${x1} ${y} L ${x1} ${y + 22} L ${x2} ${y + 22} L ${x2} ${y}`} fill="none" stroke={C.emerald} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <div style={{ position: 'absolute', left: ATM.x + ATM.w + 26, top: y + 34, display: 'flex', opacity: p, transform: `translateY(${(1 - p) * 10}px)` }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 12, fontFamily: FONT.sans, fontSize: 44, fontWeight: 850, color: '#6ee7b7', whiteSpace: 'nowrap' }}>
          <Icon name="check" size={44} color={C.emerald} strokeWidth={2.6} />
          {LABELS.twoThefts}
        </span>
      </div>
    </>
  );
}

function BottomLine({ frame, at, outAt, tone, children }: { frame: number; at: number; outAt: number; tone: string; children: ReactNode }) {
  const p = progress(frame, at, 14) * (1 - progress(frame, outAt, 12, EASE.inOut));
  if (p <= 0.001) return null;
  return (
    <div style={{ position: 'absolute', left: 0, top: LABEL_Y, width: W, display: 'flex', justifyContent: 'center', opacity: p, transform: `translateY(${(1 - p) * 12}px)` }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          padding: '14px 30px',
          borderRadius: RADIUS.lg,
          border: `2px solid ${alpha(tone, 0.7)}`,
          background: `linear-gradient(180deg, ${alpha(tone, 0.14)} 0%, ${alpha(C.ink900, 0.96)} 100%)`,
          fontFamily: FONT.sans,
          fontSize: 42,
          fontWeight: 800,
          color: C.textStrong,
          whiteSpace: 'nowrap',
        }}
      >
        <Handset size={44} color={tone} />
        {children}
      </div>
    </div>
  );
}

/** A phone handset (a call), drawn: the icon set has none. */
function Handset({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <path d="M5 3.5h3.2l1.6 4.2-2.1 1.4a11 11 0 0 0 7.2 7.2l1.4-2.1 4.2 1.6V19a1.6 1.6 0 0 1-1.7 1.6C10.4 20.1 3.9 13.6 3.4 5.2A1.6 1.6 0 0 1 5 3.5Z" />
    </svg>
  );
}

import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { BrandMark } from '../../../engine/src/overlay/ChapterRail';
import { isElevenLabsVoice } from '../../../engine/src/timeline/voice';
import { C, FONT, RADIUS, STAGE, TYPE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress, pulse, springIn } from '../../../engine/src/theme/motion';
import { Chip, Icon, RuleCards, focusWeights, mix, type RuleCardDef } from '../../../engine/src/ui';
import { ADVERSARY, END, NEXT, RULES, SHORTCUTS } from '../data/s11-recap';
import { TIMELINE } from '../timeline/load';
import { KeyCabinet } from './parts/Cabinet';
import { Locker } from './parts/Locker';
import { PassCard } from './parts/PassCard';
import { Voucher } from './parts/Voucher';
import { Stage, wordFrame } from './kit';

const S = 's11-recap';
const W = STAGE.width;

const STRIP_Y = 30; // centre line of the struck shortcuts once filed at the top
const CARDS_TOP = 78;
const CARDS_H = 446;
const NEXT_TOP = 548;
const ART_H = 150;
const CHIP_SIZE = 42; // phase-1 size; the strip scales it down
const STRIP_SCALE = 0.62;

/**
 * s11-recap «Tres reglas». SILENT PAGER's three shortcuts (s05, s07, s10),
 * big and stacked, are struck as the voice says «contra cada uno, una regla»,
 * then filed in a row at the top; under them three rule cards light one at a
 * time, each with its image — the sealed locker, the signed pass and the
 * voucher, the guardhouse cabinet — and the shortcuts each rule answers glow
 * while it is on. One next step (the lesson's 8 questions), then the
 * ALERTÓPOLIS end card, where the cabinet's doors close («cerramos la
 * garita»); it holds to the last frame.
 */
export function S11Recap(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const recap = props.cue('recap');
  const ruleAt = [props.cue('rule-1'), props.cue('rule-2'), props.cue('rule-3')];
  const next = props.cue('next');
  const endcard = props.cue('endcard');

  const wEntraba = wordFrame(S, 's11-01', 'entraba');
  const wContra = wordFrame(S, 's11-01', 'Contra');
  const wRegla = wordFrame(S, 's11-01', 'regla');
  const wCerramos = wordFrame(S, 's11-05', 'cerramos');

  const boardOut = progress(frame, endcard - 14, 14, EASE.inOut);
  const file = progress(frame, ruleAt[0] - 14, 22, EASE.inOut);
  const { weights } = focusWeights(frame, ruleAt, { end: next });

  const rules: RuleCardDef[] = [
    {
      title: RULES[0].title,
      sub: RULES[0].sub,
      tone: 'cyan',
      at: ruleAt[0],
      art: <Locker width={98} mini seal={1} contents={1} />,
    },
    {
      title: RULES[1].title,
      sub: (
        <div style={{ lineHeight: 1.22 }}>
          {RULES[1].sub.map((l) => (
            <div key={l}>{l}</div>
          ))}
        </div>
      ),
      tone: 'cyan',
      at: ruleAt[1],
      art: (
        <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
          <PassCard mini width={150} frame={frame} />
          <Voucher mini width={170} />
        </div>
      ),
    },
    {
      title: RULES[2].title,
      sub: RULES[2].sub,
      tone: 'emerald',
      at: ruleAt[2],
      art: <KeyCabinet width={214} frame={frame} />,
    },
  ];

  return (
    <Stage>
      {boardOut < 1 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: 1 - boardOut, fontFamily: FONT.sans }}>
          {/* SILENT PAGER, while the shortcuts are big */}
          <div style={{ position: 'absolute', left: 0, top: 70, width: W, display: 'flex', justifyContent: 'center', opacity: progress(frame, recap - 4, 12) * (1 - file) }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 12, padding: '8px 22px', borderRadius: RADIUS.pill, border: `2px solid ${alpha(C.rose, 0.8)}`, background: alpha(C.roseDeep, 0.7), whiteSpace: 'nowrap' }}>
              <Icon name="terminal" size={34} color={C.rose} />
              <span style={{ fontFamily: FONT.mono, fontSize: 32, fontWeight: 800, letterSpacing: 2, color: C.roseSoft }}>{ADVERSARY}</span>
            </span>
          </div>

          {/* The rule cards (slots wait from «regla») */}
          <RuleCards
            rules={rules}
            width={W}
            height={CARDS_H}
            gap={24}
            slotAt={Math.max(wRegla - 6, ruleAt[0] - 40)}
            dimFrom={next}
            subSize={30}
            artHeight={ART_H}
            frame={frame}
            fps={fps}
            style={{ position: 'absolute', left: 0, top: CARDS_TOP, opacity: progress(frame, ruleAt[0] - 40, 12) }}
          />

          {/* The three shortcuts: big and stacked, struck, then filed at the top */}
          {SHORTCUTS.map((sc, i) => {
            const inP = springIn(frame, fps, recap + 2 + i * 8, { damping: 16 });
            const strike = progress(frame, wContra - 4 + i * 5, 12, EASE.inOut);
            const big = { x: W / 2, y: 228 + i * 116 };
            const small = { x: (W * (2 * i + 1)) / 6, y: STRIP_Y };
            const x = mix(big.x, small.x, file);
            const y = mix(big.y, small.y, file);
            const scale = mix(1, STRIP_SCALE, file);
            const answered = weights[sc.rule] ?? 0;
            const shown = Math.min(1, inP * 1.3) * (1 - 0.45 * progress(frame, next - 4, 14));
            return (
              <div
                key={sc.text}
                style={{
                  position: 'absolute',
                  left: x,
                  top: y,
                  transform: `translate(-50%, -50%) scale(${scale * (0.9 + 0.1 * Math.min(1, inP))})`,
                  opacity: shown * (1 - 0.35 * file * (1 - answered)),
                }}
              >
                <ShortcutChip text={sc.text} strike={strike} glow={answered * (0.8 + 0.2 * pulse(frame, fps, 0.5))} entered={frame >= wEntraba - 10} />
              </div>
            );
          })}

          <NextAction frame={frame} fps={fps} at={next} />
        </div>
      ) : null}

      <EndCard frame={frame} fps={fps} at={endcard} closeAt={wCerramos - 4} />
    </Stage>
  );
}

// ---------------------------------------------------------------------------

function ShortcutChip({ text, strike, glow, entered }: { text: string; strike: number; glow: number; entered: boolean }) {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 16,
        padding: '12px 30px',
        borderRadius: RADIUS.lg,
        border: `2px solid ${glow > 0.05 ? alpha(C.emerald, 0.5 + 0.4 * glow) : alpha(C.rose, 0.75)}`,
        background: `linear-gradient(180deg, ${alpha(C.roseDeep, 0.85)} 0%, ${alpha(C.ink900, 0.95)} 100%)`,
        boxShadow: glow > 0.05 ? `0 0 ${Math.round(30 * glow)}px ${alpha(C.emerald, 0.35 * glow)}` : `0 16px 36px ${alpha('#000000', 0.4)}`,
        whiteSpace: 'nowrap',
        fontFamily: FONT.sans,
      }}
    >
      <Icon name="terminal" size={CHIP_SIZE} color={entered ? C.rose : C.roseSoft} />
      <span style={{ position: 'relative', fontSize: CHIP_SIZE, fontWeight: 800, color: strike > 0.5 ? C.muted : C.textStrong, letterSpacing: -0.3 }}>
        {`«${text}»`}
        {strike > 0 ? <span style={{ position: 'absolute', left: -6, top: '53%', height: 6, width: `calc(${strike * 100}% + 12px)`, borderRadius: 3, background: C.emerald }} /> : null}
      </span>
    </div>
  );
}

function NextAction({ frame, fps, at }: { frame: number; fps: number; at: number }) {
  if (frame < at - 6) return null;
  const p = springIn(frame, fps, at - 4, { damping: 16 });
  return (
    <div style={{ position: 'absolute', left: 0, top: NEXT_TOP, width: W, display: 'flex', justifyContent: 'center', opacity: Math.min(1, p * 1.4), transform: `translateY(${(1 - Math.min(1, p)) * 18}px)` }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 24,
          padding: '18px 36px 18px 28px',
          borderRadius: 32,
          background: alpha(C.cyan, 0.08),
          border: `3px solid ${alpha(C.cyan, 0.7)}`,
          boxShadow: `0 0 34px ${alpha(C.cyan, 0.22)}`,
        }}
      >
        <Icon name="play" size={46} color={C.cyan} strokeWidth={2} />
        <span style={{ fontSize: 48, fontWeight: 850, color: C.textStrong, whiteSpace: 'nowrap' }}>{NEXT}</span>
      </div>
    </div>
  );
}

const CARD_W = 1420;
const CAB_W = 440;

/** Closing card: the guardhouse cabinet closing its doors, ALERTÓPOLIS, title, objective, disclaimer. */
function EndCard({ frame, fps, at, closeAt }: { frame: number; fps: number; at: number; closeAt: number }) {
  if (frame < at - 8) return null;
  const cardIn = springIn(frame, fps, at - 6, { damping: 18 });
  const brand = enter(frame, at - 2, { distance: 16 });
  const title = enter(frame, at + 2, { distance: 24 });
  const sub = enter(frame, at + 6, { distance: 18 });
  const objective = enter(frame, at + 10, { distance: 18 });
  const ruleDraw = progress(frame, at + 10, 18);
  const disclaimer = enter(frame, at + 18, { distance: 12 });
  return (
    <div
      style={{
        position: 'absolute',
        left: (W - CARD_W) / 2,
        top: 30,
        width: CARD_W,
        height: STAGE.height - 60,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        gap: 56,
        padding: '0 64px',
        borderRadius: 36,
        background: `linear-gradient(180deg, ${C.ink850} 0%, ${C.ink900} 100%)`,
        border: `2px solid ${C.ink700}`,
        boxShadow: `0 40px 90px ${alpha('#000000', 0.45)}, inset 0 1px 0 ${alpha('#ffffff', 0.05)}`,
        fontFamily: FONT.sans,
        opacity: Math.min(1, cardIn * 1.4),
        transform: `scale(${0.94 + 0.06 * cardIn})`,
        overflow: 'hidden',
      }}
    >
      <div style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: 4, background: `linear-gradient(90deg, transparent 0%, ${C.cyan} 50%, transparent 100%)`, opacity: 0.8 }} />
      {/* The guardhouse closes */}
      <div style={{ flexShrink: 0, ...enter(frame, at, { distance: 20 }) }}>
        <KeyCabinet width={CAB_W} closeAt={closeAt} showLedger frame={frame} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, ...brand }}>
          <BrandMark size={34} />
          <span style={{ fontSize: TYPE.small, fontWeight: 800, letterSpacing: 5, color: C.cyanSoft }}>ALERTÓPOLIS</span>
        </div>
        <div style={{ marginTop: 18, fontSize: 76, fontWeight: 850, letterSpacing: -2, lineHeight: 1.05, color: C.textStrong, whiteSpace: 'nowrap', ...title }}>
          {END.title.split(' ')[0]} <span style={{ color: C.cyan }}>{END.title.split(' ').slice(1).join(' ')}</span>
        </div>
        <div style={{ marginTop: 10, fontSize: 40, fontWeight: 650, color: C.text, whiteSpace: 'nowrap', ...sub }}>{END.sub}</div>
        <div style={{ marginTop: 24, ...objective }}>
          <Chip accent="violet" icon="mortarboard" size={TYPE.label}>
            {END.objective}
          </Chip>
        </div>
        <div style={{ marginTop: 28, width: 640 * ruleDraw, height: 2, background: C.ink700 }} />
        <div style={{ marginTop: 24, width: 700, fontSize: TYPE.small, fontWeight: 550, color: C.muted, lineHeight: 1.35, ...disclaimer }}>
          {END.disclaimer}
          {isElevenLabsVoice(TIMELINE.voice) ? (
            <>
              <br />
              Voz: ElevenLabs.
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}

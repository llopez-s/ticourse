import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { BrandMark } from '../../../engine/src/overlay/ChapterRail';
import { isElevenLabsVoice } from '../../../engine/src/timeline/voice';
import { C, FONT, RADIUS, STAGE, TYPE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress, springIn } from '../../../engine/src/theme/motion';
import { Chip, Icon, RuleCards, type RuleCardDef } from '../../../engine/src/ui';
import { END, LESSON, NEXT, RULES } from '../data/s06-recap';
import { TIMELINE } from '../timeline/load';
import { TrailIcon } from './parts/TrailIcons';
import { QUEUE, QueuePanel } from './parts/TrailRow';
import { QueueMini } from './parts/s06-recap/QueueMini';
import { Stage, wordFrame } from './kit';

const S = 's06-recap';
const W = STAGE.width;
const CARDS_TOP = 16;
const CARDS_H = 452;
const NEXT_TOP = 496;
const ART_H = 132;
const QUEUE_Y = Math.round((STAGE.height - QUEUE.height) / 2);

/** The row's icon tile, enlarged: the same drawing the queue used all video. */
function IconTile({ kind, size, draw }: { kind: (typeof RULES)[number]['kind']; size: number; draw: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 26,
        display: 'grid',
        placeItems: 'center',
        background: alpha(C.rose, 0.12),
        border: `3px solid ${alpha(C.rose, 0.7)}`,
        boxShadow: `0 0 26px ${alpha(C.rose, 0.18)}`,
      }}
    >
      <TrailIcon kind={kind} size={Math.round(size * 0.7)} draw={draw} />
    </div>
  );
}

/**
 * s06-recap «Tres reglas». The wipe reveals the morning queue once more, its
 * three rows lit («Tres rastros…»); on «reglas» it steps back and three
 * numbered slots wait. Each rule card lights as the voice says it, with its
 * row's icon tile (key, folder, pipe): the shape as the title, then the
 * detail, the exam name in violet and what to do in emerald. On `next` the
 * cards step back for the one next step, «Ahora te toca: las preguntas de la
 * lección» with «sp2m7 · 8 preguntas»; on `endcard` the ALERTÓPOLIS end card
 * — the queue in miniature, its three rows checked and an empty dashed row
 * for «el próximo rastro» — holds to the last frame.
 */
export function S06Recap(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const recapAt = props.cue('recap');
  const ruleAt = [props.cue('rule-1'), props.cue('rule-2'), props.cue('rule-3')];
  const nextAt = props.cue('next');
  const endcardAt = props.cue('endcard');
  const reglasAt = Math.min(wordFrame(S, 's06-01', 'reglas') - 6, ruleAt[0] - 18);

  // ---- The queue callback, until «reglas».
  const queueOut = progress(frame, reglasAt, 12, EASE.inOut);
  const rowsOn = { lit: 1, pulse: frame >= recapAt - 4 };

  const boardOut = progress(frame, endcardAt - 14, 14, EASE.inOut);

  const rules: RuleCardDef[] = RULES.map((r, i) => ({
    title: r.title,
    sub: (
      <div style={{ lineHeight: 1.22 }}>
        <div style={{ color: C.text, fontWeight: 650 }}>
          {/* Words in capitals are exam terms: violet. */}
          {r.detail.split(' ').map((w, k) => (
            <span key={k} style={/^[A-Z]{2,}$/.test(w) ? { color: '#c4b5fd', fontWeight: 850 } : undefined}>
              {k ? ' ' : ''}
              {w}
            </span>
          ))}
        </div>
        <div style={{ color: '#c4b5fd', fontWeight: 850, letterSpacing: 0.5 }}>{r.exam}</div>
        <div style={{ color: '#6ee7b7', fontWeight: 750 }}>
          {r.action.lead}
          {r.action.strong ? <span style={{ color: C.emerald, fontWeight: 850 }}>{r.action.strong}</span> : null}
        </div>
      </div>
    ),
    tone: 'cyan',
    at: ruleAt[i],
    art: <IconTile kind={r.kind} size={ART_H} draw={progress(frame, ruleAt[i] - 4, 22, EASE.inOut)} />,
  }));

  return (
    <Stage>
      {boardOut < 1 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: 1 - boardOut, fontFamily: FONT.sans }}>
          <RuleCards
            rules={rules}
            width={W}
            height={CARDS_H}
            gap={24}
            slotAt={reglasAt + 8}
            dimFrom={nextAt}
            subSize={32}
            artHeight={ART_H}
            frame={frame}
            fps={fps}
            style={{ position: 'absolute', left: 0, top: CARDS_TOP }}
          />
          <NextAction frame={frame} fps={fps} at={nextAt} />
        </div>
      ) : null}

      {/* «Tres rastros»: the morning queue, lit, stepping back on «reglas» */}
      {queueOut < 1 ? (
        <div
          style={{
            position: 'absolute',
            left: QUEUE.x,
            top: QUEUE_Y,
            opacity: 1 - queueOut,
            transform: `scale(${1 - 0.12 * queueOut})`,
            transformOrigin: '50% 50%',
          }}
        >
          <QueuePanel
            rows={{ key: rowsOn, folder: rowsOn, pipe: rowsOn }}
            chromeDim={0.4}
            frame={frame}
          />
        </div>
      ) : null}

      <EndCard frame={frame} fps={fps} at={endcardAt} />
    </Stage>
  );
}

/** The one next step: the lesson's questions. */
function NextAction({ frame, fps, at }: { frame: number; fps: number; at: number }) {
  if (frame < at - 6) return null;
  const p = springIn(frame, fps, at - 4, { damping: 16 });
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: NEXT_TOP,
        width: W,
        display: 'flex',
        justifyContent: 'center',
        opacity: Math.min(1, p * 1.4),
        transform: `translateY(${(1 - Math.min(1, p)) * 18}px)`,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 24,
          padding: '16px 20px 16px 28px',
          borderRadius: 32,
          background: alpha(C.cyan, 0.08),
          border: `3px solid ${alpha(C.cyan, 0.7)}`,
          boxShadow: `0 0 34px ${alpha(C.cyan, 0.22)}`,
          whiteSpace: 'nowrap',
        }}
      >
        <Icon name="play" size={44} color={C.cyan} strokeWidth={2} />
        <span style={{ fontSize: 46, fontWeight: 850, color: C.textStrong }}>{NEXT}</span>
        <span
          style={{
            padding: '8px 20px',
            borderRadius: RADIUS.pill,
            background: alpha(C.cyan, 0.16),
            border: `2px solid ${alpha(C.cyan, 0.55)}`,
            fontSize: 34,
            fontWeight: 800,
            color: C.cyanSoft,
          }}
        >
          {LESSON}
        </span>
      </div>
    </div>
  );
}

const CARD_W = 1580;
const ART_W = 430;

/** Closing card: the queue in miniature, ALERTÓPOLIS, title, the next step, lesson and objective, disclaimer. */
function EndCard({ frame, fps, at }: { frame: number; fps: number; at: number }) {
  if (frame < at - 8) return null;
  const cardIn = springIn(frame, fps, at - 6, { damping: 18 });
  const art = enter(frame, at, { distance: 20 });
  const brand = enter(frame, at - 2, { distance: 16 });
  const title = enter(frame, at + 2, { distance: 24 });
  const sub = enter(frame, at + 6, { distance: 18 });
  const cta = enter(frame, at + 10, { distance: 18 });
  const chips = enter(frame, at + 14, { distance: 18 });
  const ruleDraw = progress(frame, at + 14, 18);
  const disclaimer = enter(frame, at + 20, { distance: 12 });
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
        padding: '0 60px',
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
      {/* The morning queue, reviewed */}
      <div style={{ flexShrink: 0, width: ART_W, ...art }}>
        <QueueMini width={ART_W} frame={frame} fps={fps} checkAt={at + 8} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, ...brand }}>
          <BrandMark size={34} />
          <span style={{ fontSize: TYPE.small, fontWeight: 800, letterSpacing: 5, color: C.cyanSoft }}>ALERTÓPOLIS</span>
        </div>
        <div style={{ marginTop: 16, fontSize: 76, fontWeight: 850, letterSpacing: -2, lineHeight: 1.05, color: C.textStrong, whiteSpace: 'nowrap', ...title }}>
          {END.title.lead}
          <span style={{ color: C.cyan }}>{END.title.accent}</span>
        </div>
        <div style={{ marginTop: 8, fontSize: 38, fontWeight: 650, color: C.text, whiteSpace: 'nowrap', ...sub }}>{END.sub}</div>
        <div style={{ marginTop: 22, display: 'inline-flex', alignItems: 'center', gap: 14, fontSize: 38, fontWeight: 800, color: C.cyanSoft, whiteSpace: 'nowrap', ...cta }}>
          <Icon name="play" size={36} color={C.cyan} strokeWidth={2} />
          {NEXT}
        </div>
        <div style={{ marginTop: 18, display: 'flex', alignItems: 'center', gap: 14, ...chips }}>
          <Chip accent="cyan" icon="check" size={TYPE.label}>
            {LESSON}
          </Chip>
          <Chip accent="violet" icon="mortarboard" size={TYPE.label}>
            {END.objective}
          </Chip>
        </div>
        <div style={{ marginTop: 24, width: 640 * ruleDraw, height: 2, background: C.ink700 }} />
        <div style={{ marginTop: 18, width: 860, fontSize: TYPE.small, fontWeight: 550, color: C.muted, lineHeight: 1.35, ...disclaimer }}>
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

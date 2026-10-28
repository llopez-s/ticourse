import type { ReactNode } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { BrandMark } from '../../../engine/src/overlay/ChapterRail';
import { isElevenLabsVoice } from '../../../engine/src/timeline/voice';
import { C, FONT, RADIUS, STAGE, TYPE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress, springIn } from '../../../engine/src/theme/motion';
import { Chip, Icon, RuleCards, type RuleCardDef } from '../../../engine/src/ui';
import { TIMELINE } from '../timeline/load';
import { Stage, wordFrame } from './kit';
import { CHRONO, SOURCES, type WitnessKind } from './parts/data';
import { COLS } from './parts/Columns';
import { END, RULES } from './parts/data-b';
import { ClockChip } from './parts/Ruler';
import { WitnessFigure } from './parts/Witness';

const S = 's12-reglas';
const W = STAGE.width;
const CARDS_TOP = 36;
const CARDS_H = 500;

/** One sub line, lit on its word. */
function Line({ text, show }: { text: string; show: number }) {
  return <div style={{ color: C.text, fontWeight: 650, opacity: 0.25 + 0.75 * show }}>{text}</div>;
}

/** Rule 1's image: the four witnesses, each at its place. */
function WitnessesArt({ on }: { on: number }) {
  const kinds: WitnessKind[] = ['counter', 'door', 'window', 'exit'];
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'center', opacity: 0.4 + 0.6 * on }}>
      {kinds.map((k) => (
        <WitnessFigure key={k} kind={k} width={112} see={0.8} glow={on * 0.5} />
      ))}
    </div>
  );
}

/** Rule 3's image: the three columns, observed / hypothesis / conclusion. */
function ColumnsArt({ on }: { on: number }) {
  const cols = [
    { color: COLS.obs.color, rows: 3 },
    { color: COLS.hyp.color, rows: 2 },
    { color: COLS.con.color, rows: 0 },
  ];
  return (
    <div style={{ display: 'flex', gap: 14, alignItems: 'flex-end', height: 112, opacity: 0.4 + 0.6 * on }}>
      {cols.map((c, i) => (
        <div
          key={i}
          style={{
            width: 124,
            height: 108,
            boxSizing: 'border-box',
            padding: 10,
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            borderRadius: RADIUS.md,
            border: `3px ${c.rows ? 'solid' : 'dashed'} ${alpha(c.color, c.rows ? 0.85 : 0.6)}`,
            background: alpha(c.color, 0.06),
          }}
        >
          {Array.from({ length: c.rows }).map((_, k) => (
            <div key={k} style={{ height: 22, borderRadius: 6, background: alpha(c.color, 0.5) }} />
          ))}
        </div>
      ))}
    </div>
  );
}

/** The closing card: the video's image (the five UTC hours with their sources), ALERTÓPOLIS, the title, the task. */
function EndCard({ frame, fps, at }: { frame: number; fps: number; at: number }) {
  if (frame < at - 8) return null;
  const CARD_W = 1620;
  const cardIn = springIn(frame, fps, at - 6, { damping: 18 });
  const art = enter(frame, at - 4, { distance: 20 });
  const brand = enter(frame, at - 4, { distance: 16 });
  const title = enter(frame, at - 2, { distance: 24 });
  const cta = enter(frame, at + 6, { distance: 18 });
  const chips = enter(frame, at + 10, { distance: 18 });
  const ruleDraw = progress(frame, at + 10, 18, EASE.out);
  const disclaimer = enter(frame, at + 14, { distance: 12 });
  const glow = progress(frame, at + 8, 20);
  const sentences = END.disclaimer.split('. ');
  return (
    <div
      style={{
        position: 'absolute',
        left: (W - CARD_W) / 2,
        top: 24,
        width: CARD_W,
        height: STAGE.height - 48,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        gap: 64,
        padding: '0 56px 0 52px',
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
      {/* the image: the chronology as a column of UTC hours, each with its source's icon and its original in grey */}
      <div style={{ flexShrink: 0, width: 520, position: 'relative', height: 360, ...art }}>
        <div style={{ position: 'absolute', left: 19, top: 36, width: 6, height: 288, borderRadius: 3, background: alpha(C.emerald, 0.55) }} />
        {CHRONO.map((row, i) => (
          <div key={row.id} style={{ position: 'absolute', left: 0, top: i * 72, height: 72, display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 40, display: 'flex', justifyContent: 'center' }}>
              <div style={{ width: 22, height: 22, borderRadius: 11, background: C.emerald, border: `4px solid ${C.ink900}`, boxShadow: i === 0 ? `0 0 ${22 * glow}px ${alpha(C.emerald, 0.8)}` : undefined }} />
            </div>
            <span style={{ fontFamily: FONT.mono, fontSize: 40, fontWeight: 800, color: C.textStrong, letterSpacing: -1 }}>{row.utc}</span>
            <Icon name={SOURCES[row.source].icon} size={36} color={C.cyan} />
            <span style={{ fontFamily: FONT.mono, fontSize: 22, fontWeight: 500, color: C.muted }}>{row.original}</span>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, ...brand }}>
          <BrandMark size={34} />
          <span style={{ fontSize: TYPE.small, fontWeight: 800, letterSpacing: 5, color: C.cyanSoft }}>ALERTÓPOLIS</span>
        </div>
        <div style={{ marginTop: 14, fontWeight: 850, whiteSpace: 'nowrap', ...title }}>
          <div style={{ fontSize: 72, letterSpacing: -2, lineHeight: 1.05, color: C.cyan }}>{END.title[0]}</div>
          <div style={{ fontSize: 72, letterSpacing: -2, lineHeight: 1.05, color: C.textStrong }}>{END.title[1]}</div>
        </div>
        <div
          style={{
            marginTop: 26,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 16,
            padding: '12px 30px 12px 22px',
            borderRadius: 30,
            background: alpha(C.cyan, 0.1),
            border: `3px solid ${alpha(C.cyan, 0.75)}`,
            boxShadow: `0 0 ${30 * glow}px ${alpha(C.cyan, 0.25)}`,
            fontSize: 44,
            fontWeight: 850,
            color: C.textStrong,
            whiteSpace: 'nowrap',
            ...cta,
          }}
        >
          <Icon name="play" size={40} color={C.cyan} strokeWidth={2} />
          {END.button}
        </div>
        <div style={{ marginTop: 20, display: 'flex', ...chips }}>
          <Chip accent="violet" icon="mortarboard" size={TYPE.label}>
            {END.objective}
          </Chip>
        </div>
        <div style={{ marginTop: 20, width: 640 * ruleDraw, height: 2, background: C.ink700 }} />
        <div style={{ marginTop: 12, fontSize: TYPE.small, fontWeight: 550, color: C.muted, lineHeight: 1.35, whiteSpace: 'nowrap', ...disclaimer }}>
          {sentences.map((s, k) => (
            <div key={k}>{k < sentences.length - 1 ? `${s}.` : s}</div>
          ))}
          {isElevenLabsVoice(TIMELINE.voice) ? <div>Voz: ElevenLabs.</div> : null}
        </div>
      </div>
    </div>
  );
}

/**
 * s12-reglas «Tres reglas». Three numbered cards wait from `rules`; each lights on its cue with the image the video gave
 * it — the four witnesses, one hour with its original in grey, the three columns — and its sub lines on their own words.
 * On `action` the cards step back and the closing card takes the stage: ALERTÓPOLIS, the title and the practice
 * «Práctica · Cronología y límites». No case stamp here: the case is over.
 */
export function S12Reglas(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rulesAt = props.cue('rules');
  const ruleAt = [props.cue('r-one'), props.cue('r-two'), props.cue('r-three')];
  const actionAt = props.cue('action');

  const boardOut = progress(frame, actionAt - 14, 14, EASE.inOut);
  const lit = ruleAt.map((t) => progress(frame, t, 18));

  // Each sub line lights on its own spoken word (never before its card).
  const lineAt = (card: number, seg: string, word: string, nth = 0) => Math.max(ruleAt[card] + 6, wordFrame(S, seg, word, nth) - 6);
  const sub = (i: number, frames: number[]): ReactNode => (
    <div style={{ lineHeight: 1.22 }}>
      {RULES[i].sub.map((t, k) => (
        <Line key={t} text={t} show={progress(frame, frames[k], 12)} />
      ))}
    </div>
  );

  const art = [<WitnessesArt key="a" on={lit[0]} />, <ClockChip key="b" time="08:58:12" original="09:58:12" tone="norm" style={{ opacity: 0.4 + 0.6 * lit[1] }} />, <ColumnsArt key="c" on={lit[2]} />];
  const frames = [
    [lineAt(0, 's12-02', 'apunta'), lineAt(0, 's12-02', 'es')],
    [lineAt(1, 's12-03', 'original'), lineAt(1, 's12-03', 'lado')],
    [lineAt(2, 's12-04', 'bloqueo'), lineAt(2, 's12-04', 'permitido'), lineAt(2, 's12-04', 'demuestra')],
  ];
  const rules: RuleCardDef[] = RULES.map((r, i) => ({
    title: r.title.length === 2 ? ([r.title[0], r.title[1]] as const) : r.title[0],
    sub: sub(i, frames[i]),
    tone: 'cyan',
    at: ruleAt[i],
    art: art[i],
  }));

  return (
    <Stage>
      {boardOut < 1 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: 1 - boardOut }}>
          <RuleCards
            rules={rules}
            width={W}
            height={CARDS_H}
            gap={24}
            slotAt={Math.min(rulesAt - 10, ruleAt[0] - 40)}
            dimFrom={actionAt}
            subSize={30}
            artHeight={128}
            frame={frame}
            fps={fps}
            style={{ position: 'absolute', left: 0, top: CARDS_TOP }}
          />
        </div>
      ) : null}
      <EndCard frame={frame} fps={fps} at={actionAt} />
    </Stage>
  );
}

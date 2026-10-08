import type { ReactNode } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { BrandMark } from '../../../engine/src/overlay/ChapterRail';
import { isElevenLabsVoice } from '../../../engine/src/timeline/voice';
import { C, FONT, RADIUS, STAGE, TYPE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress, springIn } from '../../../engine/src/theme/motion';
import { Chip, Icon, RuleCards, type RuleCardDef } from '../../../engine/src/ui';
import { END, LAB, NEXT, RULES, type RecapLine, type RuleArt } from '../data/s10-recap';
import { TIMELINE } from '../timeline/load';
import { Checkpoint } from './parts/Checkpoint';
import { ServiceCounter } from './parts/Counter';
import { FenceCamera } from './parts/s09-camara/FenceCamera';
import { OneDoor } from './parts/s10-recap/OneDoor';
import { Stage, wordFrame } from './kit';

const S = 's10-recap';
const W = STAGE.width;
const CARDS_TOP = 12;
const CARDS_H = 520;
const NEXT_TOP = 546;
const ART_H = 190;

const EXAM_TEXT = '#c4b5fd';

/** One sub line: words in capitals are exam terms (violet), trailing punctuation aside; hyphenated ones too. */
function Line({ line, show }: { line: RecapLine; show: number }) {
  return (
    <div style={{ color: line.strong ? C.textStrong : C.text, fontWeight: line.strong ? 800 : 650, opacity: show }}>
      {line.text.split(' ').map((w, k) => {
        const m = /^([A-ZÁÉÍÓÚÑ][A-ZÁÉÍÓÚÑ-]+)(\W*)$/.exec(w);
        return (
          <span key={k}>
            {k ? ' ' : ''}
            {m ? (
              <>
                <span style={{ color: EXAM_TEXT, fontWeight: 850 }}>{m[1]}</span>
                {m[2]}
              </>
            ) : (
              w
            )}
          </span>
        );
      })}
    </div>
  );
}

/** Per-rule moments for the art (local frames). */
interface ArtTimes {
  /** The card lights. */
  at: number;
  /** Rule 2: the one door lights («puerta»); rule 3: the camera («copia»). */
  a: number;
}

/** The card's illustration: the same drawings the video used. */
function RuleImage({ art, frame, t }: { art: RuleArt; frame: number; t: ArtTimes }): ReactNode {
  const draw = progress(frame, t.at - 4, 20, EASE.inOut);
  const show = Math.min(1, 0.35 + draw);
  switch (art) {
    case 'checkpoint':
      // The fence and its staffed checkpoint (s02): same trust inside, a control at the gate.
      return (
        <div style={{ opacity: show }}>
          <Checkpoint width={360} state="powered" glow={0.45 * draw} frame={frame} />
        </div>
      );
    case 'counter-door': {
      // The counter window (the DMZ, s04) and the one door (the jump server, s05).
      const door = progress(frame, t.a, 14);
      return (
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 30, opacity: show }}>
          <ServiceCounter width={236} glow={0.4 * draw} frame={frame} />
          <div style={{ opacity: 0.45 + 0.55 * door }}>
            <OneDoor width={156} lit={door} />
          </div>
        </div>
      );
    }
    case 'barrier-camera': {
      // The barrier in a power cut, decided both ways (s06–s07), and the camera that only watches a copy (s09).
      const cam = progress(frame, t.a, 14);
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, opacity: show }}>
          <Checkpoint width={160} fence={false} state="cut" barrier={1} frame={frame} />
          <Checkpoint width={160} fence={false} state="cut" barrier={0} frame={frame} />
          <div style={{ marginLeft: 4, opacity: 0.4 + 0.6 * cam, transform: 'translateY(-6px)' }}>
            <FenceCamera width={136} aim={40} coneLength={150} power={1} watch={0.6 + 0.4 * cam} glow={0.4 * cam} frame={frame} />
          </div>
        </div>
      );
    }
  }
}

/**
 * s10-recap «Tres reglas». Three numbered slots wait from the first frame (the
 * transition reveals them). Each rule card lights as the voice says it, with
 * the image the video gave it, and its three lines light on their own words:
 * the fence and its staffed checkpoint («Una zona: valla y garita»); the
 * counter window and the one door, which lights on «puerta» («Lo público, a
 * la ventanilla»); the barrier in a power cut, raised and lowered, and the
 * fence camera, which lights on «copia» («Al caerse, ya está decidido»). On
 * `next` the cards step back for «Tu turno: el laboratorio Zone Defense» with
 * «12 sistemas · cuatro zonas» (never the lab id); on `endcard` the
 * ALERTÓPOLIS end card (V11/V12's layout) holds to the last frame: three
 * checkpoints counted one by one on «garitas» under «¿Menos es más? Cuenta
 * las garitas.», the title, the next step, the objective (Security+ SY0-701 ·
 * 3.2) and the CompTIA disclaimer.
 */
export function S10Recap(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ruleAt = [props.cue('rule-1'), props.cue('rule-2'), props.cue('rule-3')];
  const nextAt = props.cue('next');
  const endcardAt = props.cue('endcard');
  const reglasAt = Math.min(wordFrame(S, 's10-01', 'reglas') - 6, ruleAt[0] - 12);
  const countAt = Math.max(endcardAt + 24, wordFrame(S, 's10-04', 'garitas') - 10);

  const boardOut = progress(frame, endcardAt - 14, 14, EASE.inOut);

  const lineAt = (seg: string, l: RecapLine, at: number) => Math.max(at + 4, wordFrame(S, seg, l.word, l.nth ?? 0) - 6);

  const art: ArtTimes[] = [
    { at: ruleAt[0], a: ruleAt[0] },
    { at: ruleAt[1], a: wordFrame(S, 's10-02', 'puerta') - 6 },
    { at: ruleAt[2], a: wordFrame(S, 's10-03', 'copia') - 6 },
  ];

  const rules: RuleCardDef[] = RULES.map((r, i) => ({
    title: r.title,
    sub: (
      <div style={{ lineHeight: 1.22 }}>
        {r.sub.map((l, k) => (
          <Line key={k} line={l} show={0.25 + 0.75 * progress(frame, lineAt(r.seg, l, ruleAt[i]), 12)} />
        ))}
      </div>
    ),
    tone: 'cyan',
    at: ruleAt[i],
    art: <RuleImage art={r.art} frame={frame} t={art[i]} />,
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
            slotAt={Math.min(-14, reglasAt - 40)}
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
      <EndCard frame={frame} fps={fps} at={endcardAt} countAt={countAt} />
    </Stage>
  );
}

/** The one next step: the Zone Defense lab, with its size (never its id). */
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
          gap: 22,
          padding: '16px 20px 16px 26px',
          borderRadius: 32,
          background: alpha(C.cyan, 0.08),
          border: `3px solid ${alpha(C.cyan, 0.7)}`,
          boxShadow: `0 0 34px ${alpha(C.cyan, 0.22)}`,
          whiteSpace: 'nowrap',
        }}
      >
        <Icon name="play" size={42} color={C.cyan} strokeWidth={2} />
        <span style={{ fontSize: 44, fontWeight: 850, color: C.textStrong }}>{NEXT}</span>
        <span
          style={{
            padding: '8px 20px',
            borderRadius: RADIUS.pill,
            background: alpha(C.cyan, 0.16),
            border: `2px solid ${alpha(C.cyan, 0.55)}`,
            fontSize: 32,
            fontWeight: 800,
            color: C.cyanSoft,
          }}
        >
          {LAB}
        </span>
      </div>
    </div>
  );
}

const CARD_W = 1620;
const ART_W = 470;
const COUNT_CK = 300;

/** «¿Menos es más? Cuenta las garitas.»: three staffed checkpoints, counted one by one. */
function CountGates({ frame, at, countAt }: { frame: number; at: number; countAt: number }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 6 }}>
      <div style={{ fontSize: 40, fontWeight: 850, lineHeight: 1.12, letterSpacing: -0.5, marginBottom: 10, opacity: progress(frame, at + 4, 12) }}>
        <div style={{ color: C.text }}>{END.remate[0]}</div>
        <div style={{ color: '#6ee7b7' }}>{END.remate[1]}</div>
      </div>
      {[0, 1, 2].map((i) => {
        const c = progress(frame, countAt + i * 9, 10);
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 18, opacity: progress(frame, at + 6 + i * 4, 12) }}>
            <Checkpoint width={COUNT_CK} state="powered" glow={0.6 * c} frame={frame} />
            <div
              style={{
                width: 54,
                height: 54,
                borderRadius: 27,
                display: 'grid',
                placeItems: 'center',
                fontSize: 32,
                fontWeight: 850,
                background: c > 0.5 ? C.emerald : alpha(C.emerald, 0.12),
                border: `2px solid ${alpha(C.emerald, 0.4 + 0.5 * c)}`,
                color: c > 0.5 ? C.ink950 : alpha(C.emerald, 0.6),
                transform: `scale(${0.85 + 0.15 * c})`,
              }}
            >
              {i + 1}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/** Closing card: the gates, counted; ALERTÓPOLIS, title, the next step, the lab, objective, disclaimer. */
function EndCard({ frame, fps, at, countAt }: { frame: number; fps: number; at: number; countAt: number }) {
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
        top: 24,
        width: CARD_W,
        height: STAGE.height - 48,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        gap: 54,
        padding: '0 56px',
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
      <div style={{ flexShrink: 0, width: ART_W, ...art }}>
        <CountGates frame={frame} at={at} countAt={countAt} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, ...brand }}>
          <BrandMark size={34} />
          <span style={{ fontSize: TYPE.small, fontWeight: 800, letterSpacing: 5, color: C.cyanSoft }}>ALERTÓPOLIS</span>
        </div>
        <div style={{ marginTop: 14, fontSize: 64, fontWeight: 850, letterSpacing: -1.6, lineHeight: 1.05, color: C.textStrong, whiteSpace: 'nowrap', ...title }}>
          <div style={{ color: C.cyan }}>{END.title[0]}</div>
          <div>{END.title[1]}</div>
        </div>
        <div style={{ marginTop: 8, fontSize: 38, fontWeight: 700, color: C.text, whiteSpace: 'nowrap', ...sub }}>{END.sub}</div>
        <div style={{ marginTop: 22, display: 'inline-flex', alignItems: 'center', gap: 14, fontSize: 36, fontWeight: 800, color: C.cyanSoft, whiteSpace: 'nowrap', ...cta }}>
          <Icon name="play" size={34} color={C.cyan} strokeWidth={2} />
          {NEXT}
        </div>
        <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 10, ...chips }}>
          <Chip accent="cyan" icon="check" size={TYPE.label}>
            {LAB}
          </Chip>
          <Chip accent="violet" icon="mortarboard" size={TYPE.label}>
            {END.objective}
          </Chip>
        </div>
        <div style={{ marginTop: 20, width: 640 * ruleDraw, height: 2, background: C.ink700 }} />
        <div style={{ marginTop: 14, width: 860, fontSize: TYPE.small, fontWeight: 550, color: C.muted, lineHeight: 1.35, ...disclaimer }}>
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

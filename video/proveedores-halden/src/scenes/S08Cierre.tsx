import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../engine/src/theme/motion';
import { Icon, RuleCards, type RuleCardDef } from '../../../engine/src/ui';
import { PHRASE, RULES, type RuleArt } from '../data/s08-cierre';
import { Seal } from './parts/Art';
import { NurseryHouse } from './parts/Nursery';
import { EndCard, NextAction } from './parts/s08-cierre/EndCard';
import { MiniTimeline } from './parts/Timeline';
import { Stage, wordFrame } from './kit';

const S = 's08-cierre';
const W = STAGE.width;
const CARDS_H = 560;
const ART_H = 104;
const PHRASE_TOP = 170;
const NEXT_TOP = 560;

const PHRASE_TONE = { cyan: C.cyan, violet: '#c4b5fd' } as const;

/** One sub line: lit on its word. */
function Line({ text, strong, show }: { text: string; strong?: boolean; show: number }) {
  return <div style={{ color: strong ? C.textStrong : C.text, fontWeight: strong ? 800 : 650, opacity: show, whiteSpace: 'nowrap' }}>{text}</div>;
}

/** The four papers as four small tags: NDA, MSA, SOW, SLA. */
function PaperTags({ glow }: { glow: number }) {
  return (
    <div style={{ display: 'flex', gap: 10, fontFamily: FONT.sans }}>
      {['NDA', 'MSA', 'SOW', 'SLA'].map((t) => (
        <div
          key={t}
          style={{
            height: 58,
            padding: '0 14px',
            boxSizing: 'border-box',
            display: 'flex',
            alignItems: 'center',
            borderRadius: 14,
            border: `2px solid ${alpha(C.cyan, 0.5 + 0.4 * glow)}`,
            background: alpha(C.cyan, 0.08 + 0.1 * glow),
            fontSize: 30,
            fontWeight: 900,
            color: C.textStrong,
          }}
        >
          {t}
        </div>
      ))}
    </div>
  );
}

/** The three icons, one per rule: the nursery with an outside seal, the timeline with the signature, the four papers. */
function Art({ art, glow }: { art: RuleArt; glow: number }) {
  if (art === 'nursery') {
    return (
      <div style={{ position: 'relative', width: 200, height: ART_H }}>
        <NurseryHouse width={124} />
        <div style={{ position: 'absolute', left: 108, top: 22 }}>
          <Seal size={68} />
        </div>
      </div>
    );
  }
  if (art === 'timeline') {
    return (
      <div style={{ width: 348, height: ART_H, position: 'relative' }}>
        <div style={{ position: 'absolute', left: 0, top: -14, transform: 'scale(0.74)', transformOrigin: '0 0' }}>
          <MiniTimeline width={470} labels={false} glow={glow} />
        </div>
      </div>
    );
  }
  return <PaperTags glow={glow} />;
}

/**
 * s08-cierre «Para el examen». Three numbered slots wait from the first frame; each rule card lights on its cue with its
 * icon — the nursery with an outside seal, the timeline with the signature, the four papers — and the full rule of the
 * storyboard, its lines lit on the voice's words. On `phrase` the cards step back and «Mira quién ha hecho la prueba,
 * mira si ya has firmado y mira qué tiene que fijar el papel» comes over them, a beat per clause. On `next` «Tu turno:
 * las preguntas de la lección»; on `endcard` the ALERTÓPOLIS end card takes the stage and holds.
 */
export function S08Cierre(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const recapAt = props.cue('recap');
  const ruleAt = [props.cue('rule-1'), props.cue('rule-2'), props.cue('rule-3')];
  const phraseAt = props.cue('phrase');
  const nextAt = props.cue('next');
  const endcardAt = props.cue('endcard');
  const boardOut = progress(frame, endcardAt - 14, 14, EASE.inOut);

  const phraseIn = progress(frame, phraseAt - 2, 16);
  const beatAt = PHRASE.map((p, i) => (i === 0 ? phraseAt : Math.max(phraseAt + 6, wordFrame(S, 's08-04', p.word) - 8)));
  // Rule 1's card lights on `recap` (its first sentence), the others on their cues.
  const cardAt = [Math.min(recapAt, ruleAt[0]), ruleAt[1], ruleAt[2]];

  const rules: RuleCardDef[] = RULES.map((r, i) => {
    const frames = r.sub.map((l) => Math.max(cardAt[i] + 4, wordFrame(S, r.seg, l.word) - 6) + (l.lag ?? 0));
    const show = progress(frame, cardAt[i] + 2, 14);
    return {
      title: r.title,
      sub: (
        <div style={{ lineHeight: 1.2 }}>
          {r.sub.map((l, k) => (
            <Line key={k} text={l.text} strong={l.strong} show={0.4 + 0.6 * progress(frame, frames[k] + k * 2, 12)} />
          ))}
        </div>
      ),
      tone: i === 1 ? 'emerald' : i === 2 ? 'sky' : 'cyan',
      at: cardAt[i],
      art: (
        <div style={{ opacity: show }}>
          <Art art={r.art} glow={0.5 * show} />
        </div>
      ),
    };
  });

  return (
    <Stage>
      {boardOut < 1 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: 1 - boardOut, fontFamily: FONT.sans }}>
          <RuleCards
            rules={rules}
            width={W}
            height={CARDS_H}
            gap={24}
            slotAt={recapAt - 20}
            dimFrom={phraseAt}
            titleSize={50}
            subSize={30}
            artHeight={ART_H}
            frame={frame}
            fps={fps}
            style={{ position: 'absolute', left: 0, top: 0 }}
          />

          {/* A scrim over the stepped-back cards, so the phrase reads alone */}
          {phraseIn > 0.01 ? <div style={{ position: 'absolute', left: 0, top: 0, width: W, height: CARDS_H, background: alpha(C.ink950, 0.6 * phraseIn) }} /> : null}
          {phraseIn > 0.01 ? (
            <div style={{ position: 'absolute', left: 0, top: PHRASE_TOP, width: W, display: 'flex', justifyContent: 'center' }}>
              <div
                style={{
                  boxSizing: 'border-box',
                  padding: '22px 44px',
                  borderRadius: 26,
                  background: alpha(C.ink900, 0.96),
                  border: `3px solid ${alpha(C.violet, 0.7)}`,
                  boxShadow: `0 0 40px ${alpha(C.violet, 0.22)}, 0 30px 80px ${alpha('#000000', 0.5)}`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 28,
                  opacity: phraseIn,
                  transform: `translateY(${(1 - phraseIn) * 16}px)`,
                  whiteSpace: 'nowrap',
                }}
              >
                <Icon name="mortarboard" size={64} color={C.violet} strokeWidth={2} />
                <div style={{ fontSize: 52, fontWeight: 850, lineHeight: 1.15 }}>
                  {PHRASE.map((p, i) => (
                    <div key={p.text} style={{ color: PHRASE_TONE[p.tone], opacity: 0.25 + 0.75 * progress(frame, beatAt[i], 12) }}>
                      {p.text}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}

          <NextAction frame={frame} fps={fps} at={nextAt} top={NEXT_TOP} />
        </div>
      ) : null}
      <EndCard frame={frame} fps={fps} at={endcardAt} />
    </Stage>
  );
}

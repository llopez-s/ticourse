import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../engine/src/theme/motion';
import { Icon, RuleCards, type RuleCardDef } from '../../../engine/src/ui';
import { PHRASE, RULES } from '../data/s08-cierre';
import { EndCard } from './parts/s08-cierre/EndCard';
import { THUMB, Thumb } from './parts/s08-cierre/Thumb';
import { ImageTag } from './parts/Tags';
import { Stage, wordFrame } from './kit';

const S = 's08-cierre';
const W = STAGE.width;
const CARDS_H = 404;
const TAG_TOP = 414;
const PHRASE_TOP = 474;
const PHRASE_W = 1240;
/** How far down the row waits before the sentence comes in. */
const LOW = 104;

/**
 * s08-cierre «Para llevarte». Three numbered slots wait from the first frame; each idea lights on its cue with the
 * image the video told it with — the letter, envelope and box in the van (the wrappers), the box changing van at the
 * warehouse (ARP and the gateway) and the numbered sheets with their receipt (TCP) — as a small crop of the art, and
 * its two lines light on their own words. One «imagen · no es el
 * Consorcio» tag under the row covers the three crops. On `phrase` the cards step back and the closing sentence
 * comes in under them. `next` and `endcard` are under a second apart, so there is no separate «next» pill: on `next`
 * the board gives way to the ALERTÓPOLIS end card and its one task lands on `endcard`; the card holds to the end.
 */
export function S08Cierre(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const recapAt = props.cue('recap');
  const ruleAt = [props.cue('rule-1'), props.cue('rule-2'), props.cue('rule-3')];
  const phraseAt = props.cue('phrase');
  const nextAt = props.cue('next');
  const endcardAt = props.cue('endcard');
  const whatAt = Math.max(phraseAt + 6, wordFrame(S, 's08-03', PHRASE.word) - 6);
  const boardOut = progress(frame, nextAt - 14, 12, EASE.inOut);
  const phraseIn = progress(frame, phraseAt - 2, 16);
  // Until the sentence needs the room, the row sits in the middle of the stage.
  const rowY = Math.round(LOW * (1 - progress(frame, phraseAt - 22, 24, EASE.inOut)));

  const rules: RuleCardDef[] = RULES.map((r, i) => {
    // Each line lights on its own word, never before its card (rule 3 shares its segment with rule 2).
    const frames = r.sub.map((l) => {
      const seg = props.segments.find((x) => x.id === r.seg);
      if (!seg) throw new Error(`segment ${r.seg} is not in ${S}`);
      let nth = l.nth ?? 0;
      let at = wordFrame(S, r.seg, l.word, nth);
      // Skip matches spoken before this card's cue (rule 3 shares s08-02 with rule 2).
      while (at < ruleAt[i] - 2) at = wordFrame(S, r.seg, l.word, ++nth);
      return Math.max(ruleAt[i] + 4, at - 6);
    });
    const hot = progress(frame, ruleAt[i], 12) * (1 - progress(frame, (ruleAt[i + 1] ?? phraseAt) - 6, 14, EASE.inOut));
    return {
      title: r.title,
      sub: (
        <div style={{ lineHeight: 1.22 }}>
          {r.sub.map((l, k) => (
            <div key={k} style={{ color: C.textStrong, fontWeight: 750, opacity: 0.25 + 0.75 * progress(frame, frames[k], 12) }}>
              {l.text}
            </div>
          ))}
        </div>
      ),
      tone: 'cyan',
      at: ruleAt[i],
      art: <Thumb thumb={r.thumb} glow={hot} />,
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
            slotAt={Math.min(2, recapAt - 10)}
            dimFrom={phraseAt}
            titleSize={52}
            subSize={30}
            artHeight={THUMB.h}
            frame={frame}
            fps={fps}
            style={{ position: 'absolute', left: 0, top: rowY }}
          />

          {/* the three crops are images, not the Consorcio */}
          <div style={{ position: 'absolute', left: 0, top: TAG_TOP + rowY, width: W, display: 'flex', justifyContent: 'center', opacity: progress(frame, ruleAt[0] + 6, 14) }}>
            <ImageTag size={24} />
          </div>

          {/* the closing sentence */}
          {phraseIn > 0.01 ? (
            <div style={{ position: 'absolute', left: 0, top: PHRASE_TOP, width: W, display: 'flex', justifyContent: 'center' }}>
              <div
                style={{
                  width: PHRASE_W,
                  boxSizing: 'border-box',
                  padding: '18px 36px',
                  borderRadius: 26,
                  background: alpha(C.cyan, 0.08),
                  border: `3px solid ${alpha(C.cyan, 0.6)}`,
                  boxShadow: `0 0 34px ${alpha(C.cyan, 0.18)}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 28,
                  opacity: phraseIn,
                  transform: `translateY(${(1 - phraseIn) * 16}px)`,
                }}
              >
                <Icon name="search" size={64} color={C.cyan} strokeWidth={2} />
                <div style={{ fontSize: 46, fontWeight: 800, lineHeight: 1.22, color: C.textStrong, whiteSpace: 'nowrap' }}>
                  <div>{PHRASE.lead}</div>
                  <div style={{ color: C.cyan, opacity: 0.25 + 0.75 * progress(frame, whatAt, 12) }}>{PHRASE.what}</div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
      <EndCard frame={frame} fps={fps} at={nextAt} taskAt={endcardAt} />
    </Stage>
  );
}

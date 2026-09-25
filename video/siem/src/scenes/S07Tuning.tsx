import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { STAGE } from '../../../engine/src/theme/tokens';
import { progress } from '../../../engine/src/theme/motion';
import { CoverageMap } from './parts/s07-tuning/CoverageMap';
import { CureOptions } from './parts/s07-tuning/CureOptions';
import { ExclusionDeck } from './parts/s07-tuning/ExclusionDeck';
import { COMPACT_H, QueueCounter } from './parts/s07-tuning/QueueCounter';
import { RuleEditor } from './parts/s07-tuning/RuleEditor';
import { segmentFrom, steps, wordFrame } from './parts/s07-tuning/timing';

const EDITOR_W = 900;
const RIGHT_X = 940;
const RIGHT_W = STAGE.width - RIGHT_X;
const LOWER_TOP = COMPACT_H + 20;

/**
 * S07 · Alert tuning.
 *   (s07-01)   → "¿La cura?": más gente / otra herramienta struck out, afinar lit
 *   exclude    → the rule editor gets a precise exclusion for the backup agent
 *   rule-on    → the rule stays ACTIVE; "Desactivar regla" is struck out
 *   documented → exclusion records (qué · por qué · quién la aprobó · revisión)
 *   count-1320 → the queue counter grows: 6.000 → 1.320 tras excluir los 3 patrones
 *   count-400  → 1.320 → 400 / día tras deduplicar y agrupar
 *   overtune   → an over-broad exclusion turns rose; an attacker crosses the blind zone
 */
export function S07Tuning({ cue, segments }: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const exclude = cue('exclude');
  const ruleOn = cue('rule-on');
  const documented = cue('documented');
  const count1320 = cue('count-1320');
  const count400 = cue('count-400');
  const overtune = cue('overtune');

  const seg1 = segmentFrom(segments, 's07-01', 27);
  const seg3 = segmentFrom(segments, 's07-03', count1320 - 60);
  const seg4 = segmentFrom(segments, 's07-04', overtune - 15);

  const gente = wordFrame(segments, 's07-01', 'gente', seg1 + 32);
  const herramienta = wordFrame(segments, 's07-01', 'herramienta', seg1 + 52);
  const afinar = wordFrame(segments, 's07-01', 'afinar', seg1 + 84);
  const fieldsAt = [
    wordFrame(segments, 's07-02', 'qué', documented + 30),
    wordFrame(segments, 's07-02', 'por', documented + 36),
    wordFrame(segments, 's07-02', 'quién', documented + 50),
    wordFrame(segments, 's07-02', 'aprobó', documented + 60) + 10,
  ] as const;
  const approvedAt = wordFrame(segments, 's07-02', 'aprobó', documented + 60);
  const excludedAt = wordFrame(segments, 's07-03', 'Excluidos', seg3 + 3);
  const dedupAt = wordFrame(segments, 's07-03', 'Deduplicar', count400 - 68);
  const alarm = wordFrame(segments, 's07-04', 'demasiado', overtune + 24);
  const falseNeg = wordFrame(segments, 's07-04', 'falsos', overtune + 58);

  const optionsOut = progress(frame, documented - 14, 12);
  const optionsDim = 1 - 0.6 * progress(frame, exclude - 6, 12);
  const deckOut = progress(frame, seg3 - 6, 12);
  const counterDim = steps(frame, 0.85, [
    { at: seg3 - 6, to: 1 },
    { at: seg4, to: 0.7 },
  ], 12);

  return (
    <AbsoluteFill>
      <div style={{ position: 'absolute', left: STAGE.left, top: STAGE.top, width: STAGE.width, height: STAGE.height }}>
        <RuleEditor
          frame={frame}
          fps={fps}
          width={EDITOR_W}
          height={STAGE.height}
          t={{
            afinar,
            exclude,
            ruleOn,
            documented,
            countPhase: seg3 - 6,
            overtunePhase: seg4 - 4,
            overtune,
            alarm,
            falseNeg,
          }}
        />

        <div style={{ position: 'absolute', left: RIGHT_X, top: 0, width: RIGHT_W, height: STAGE.height }}>
          {optionsOut < 1 ? (
            <div style={{ position: 'absolute', inset: 0, opacity: optionsDim * (1 - optionsOut), transform: `translateY(${-24 * optionsOut}px)` }}>
              <CureOptions frame={frame} top={LOWER_TOP + 4} gente={gente} herramienta={herramienta} afinar={afinar} />
            </div>
          ) : null}

          {frame >= documented - 8 && deckOut < 1 ? (
            <div style={{ position: 'absolute', inset: 0, opacity: 1 - deckOut, transform: `translateY(${-24 * deckOut}px)` }}>
              <ExclusionDeck
                frame={frame}
                top={LOWER_TOP}
                height={STAGE.height - LOWER_TOP}
                landAt={documented - 6}
                fieldsAt={fieldsAt}
                approvedAt={approvedAt}
              />
            </div>
          ) : null}

          {frame >= seg4 - 2 ? (
            <CoverageMap
              frame={frame}
              fps={fps}
              top={LOWER_TOP}
              width={RIGHT_W}
              height={STAGE.height - LOWER_TOP}
              enterAt={seg4 + 2}
              floodAt={alarm + 4}
              falseNegAt={falseNeg}
            />
          ) : null}

          <QueueCounter
            frame={frame}
            width={RIGHT_W}
            fullHeight={STAGE.height}
            dim={counterDim}
            t={{ growAt: seg3 - 4, shrinkAt: seg4 - 16, excludedAt, count1320, dedupAt, count400 }}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
}

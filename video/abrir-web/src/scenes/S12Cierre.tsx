import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { FONT } from '../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../engine/src/theme/motion';
import { RuleCards, type RuleCardDef } from '../../../engine/src/ui';
import { Stage } from './kit';
import { RULES } from './parts/data';
import { EndCard, PracticePill } from './parts/EndCard';
import { Ribbon, ribbonLit } from './parts/Ribbon';
import { ImaginaSeal } from './parts/Seal';

const CARDS_TOP = 100;
const CARDS_H = 392;
const PILL_TOP = 522;

/**
 * s12-cierre «Cinco piezas».
 *   recap     the lit ribbon (all five) stays on top and three numbered slots wait;   rule-1 / rule-2 / rule-3  each
 *             rule card lights on its cue;   next  the cards step back and the practice «Diagnóstico de conectividad»
 *             comes in;   endcard  the closing card (ALERTÓPOLIS, title, the practice button) holds to the last frame.
 */
export function S12Cierre(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const recap = props.cue('recap');
  const ruleAt = [props.cue('rule-1'), props.cue('rule-2'), props.cue('rule-3')];
  const next = props.cue('next');
  const endcard = props.cue('endcard');
  const boardOut = progress(frame, endcard - 14, 14, EASE.inOut);

  const rules: RuleCardDef[] = RULES.map((r, i) => ({
    title: [r.title[0], r.title[1]] as const,
    sub: r.sub,
    icon: (['layers', 'clock', 'user'] as const)[i],
    tone: (['cyan', 'sky', 'emerald'] as const)[i],
    at: ruleAt[i],
  }));

  return (
    <Stage>
      <Ribbon lit={ribbonLit(frame, {}, ['DHCP', 'DNS', 'TCP', 'TLS', 'HTTP'])} />

      {boardOut < 1 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: 1 - boardOut, fontFamily: FONT.sans }}>
          <RuleCards
            rules={rules}
            width={1728}
            height={CARDS_H}
            gap={24}
            slotAt={recap - 10}
            dimFrom={next}
            subSize={32}
            artHeight={150}
            frame={frame}
            fps={fps}
            style={{ position: 'absolute', left: 0, top: CARDS_TOP }}
          />
          <PracticePill frame={frame} fps={fps} at={next} top={PILL_TOP} />
        </div>
      ) : null}

      <EndCard frame={frame} fps={fps} at={endcard} />
      <ImaginaSeal />
    </Stage>
  );
}

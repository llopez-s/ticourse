import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, STAGE } from '../../../engine/src/theme/tokens';
import { progress } from '../../../engine/src/theme/motion';
import { SITE_LABEL } from '../data/canon';
import { QuestionFrame, SlotLine, SlotText } from './parts/Question';
import { SITE, SiteList } from './parts/SiteList';
import { Stage } from './kit';

const BG_W = 1080;

/**
 * s05-p2 «Un proveedor nuevo». The engine's ExamQuestionLayer draws question 2 (with «MEJOR» in its question, already
 * explained in s03) over this scene from s05-01 to its end, so the stage is a still, dim, textless background — the site
 * list without its words — plus «pregunta tipo examen · ejemplo». No store, provider or firewall is drawn. On
 * `site-back` the site list comes back in one line under the panel: «se apunta al fontanero, no a la empresa».
 */
export function S05P2(props: SceneProps) {
  const frame = useCurrentFrame();
  const backAt = props.cue('site-back');
  const backIn = progress(frame, backAt, 14);
  const h = (BG_W * SITE.h) / SITE.w;
  return (
    <Stage>
      <QuestionFrame>
        <div style={{ position: 'absolute', left: (STAGE.width - BG_W) / 2, top: (STAGE.height - h) / 2, opacity: 0.8 }}>
          <SiteList width={BG_W} bare walk={0.3} />
        </div>
      </QuestionFrame>

      <SlotLine opacity={backIn} dy={(1 - backIn) * 14}>
        <SiteList width={200} bare walk={1} />
        <SlotText>
          <span>se apunta </span>
          <span style={{ color: C.emerald }}>al fontanero</span>
          <span style={{ color: C.muted }}>, no a la empresa</span>
        </SlotText>
        <span style={{ fontFamily: FONT.sans, fontSize: 28, fontWeight: 700, color: C.muted, whiteSpace: 'nowrap' }}>{SITE_LABEL}</span>
      </SlotLine>
    </Stage>
  );
}

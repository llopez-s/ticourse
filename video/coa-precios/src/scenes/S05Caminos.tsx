import type { CSSProperties } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { MATRIX_POSE } from '../data/s04-fase';
import { MATRIX_UNDER_CARD, mixPose } from '../data/s05-caminos';
import { Matrix } from './parts/Matrix';
import { Shop } from './parts/Shop';
import { s05Beats } from './parts/s05-caminos/beats';
import { AooTag, PriceTag, SupposeChips } from './parts/s05-caminos/Chips';
import { GEOM, MASK } from './parts/s05-caminos/geom';
import { BridgeLine, DenyTag, MarkGloss, SinkholeGloss } from './parts/s05-caminos/Glosses';
import { s05Shop } from './parts/s05-caminos/shop';
import { BusinessBlock, FlipLabel, WatchLabel } from './parts/s05-caminos/Verdicts';
import { Stage } from './kit';

/** Room around the matrix inside its masked wrapper, so the mask does not clip its shadow. */
const PAD = 80;
/** Price tags: in each card's header, at its right (left of the `[!]` chip on the sinkhole's). */
const TAG = {
  detect: { x: GEOM.detect.x + GEOM.detect.w - 36, y: GEOM.detect.y + 27 },
  deny: { x: GEOM.deny.x + GEOM.deny.w - 104, y: GEOM.deny.y + 27 },
  degrade: { x: GEOM.degrade.x + GEOM.degrade.w - 36, y: GEOM.degrade.y + 27 },
} as const;

/**
 * s05-caminos «Dos caminos para el C2».
 *   start          s04's matrix and shop; both step down under GLASS VIPER's card (top-centre band free
 *                  until s05-01 ends).
 *   reply-move     the C2 row lights; its Deny cell on «Cortarle», its Detect cell goes dark on «dejas de
 *                  verle», its [!] glows on «por eso te lo pide».
 *   row-c2         the matrix comes back, the C2 row enlarged into three readable cards; small, beside the
 *                  rows above it, «los pasos de antes ya no los puedes impedir» (until `supose`).
 *   visible        the legend «[!] = acción visible para el actor», a flash on the three marks that stays
 *                  on C2's, and the gloss «el actor lo sabrá en minutos» over it.
 *   sinkhole-deny  over the sinkhole card, «no corta la llamada en curso / las siguientes no llegan a
 *                  ninguna parte» and its DENY tag, which stays on the card to the end.
 *   walkie         the shop: the suspect's walkie; nobody answers (the sinkhole card lights), then a noisy
 *                  channel with somebody listening (Degrade and Detect light), the safe closed.
 *   supose         the rows above C2 fade out (the band is free for the question); the two «Supón…»
 *                  chips; on «¿Cortas?» the two options are marked, turn by turn, with no cost on them.
 *   answer/watch   Detect + Degrade stay; «ves su operación, avisas menos · mientras lo valioso esté
 *                  protegido».
 *   flip           first «si ya se llevan lo crítico:», then the hypothetical alarm on Actions on
 *                  Objectives; on «Cortas», «contener ahora, recoger después» and the sinkhole card (DENY).
 *   business       a price tag on each option, INTELLIGENCE GAIN/LOSS, «la decisión final es del negocio,
 *                  no del SOC · tú pones los precios sobre la mesa». No decision is shown.
 *   wrap-ii        the tag beside the [!] glows. Holds.
 */
export function S05Caminos(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s05Beats(props, frame, fps);
  const { pose, shop } = s05Shop(props, frame, fps);
  const mp = mixPose(MATRIX_POSE, MATRIX_UNDER_CARD, b.small);
  const clear = `rgba(0,0,0,${(1 - b.mask).toFixed(3)})`;
  const maskImage = `linear-gradient(to bottom, ${clear} 0px, ${clear} ${PAD + MASK.from}px, #000 ${PAD + MASK.to}px)`;
  const mask: CSSProperties = b.mask > 0.001 ? { maskImage, WebkitMaskImage: maskImage } : {};

  return (
    <Stage>
      <div style={{ position: 'absolute', left: pose.x, top: pose.y }}>
        <Shop width={pose.w} {...shop} />
      </div>

      <div style={{ position: 'absolute', left: mp.x - PAD, top: mp.y - PAD, padding: PAD, ...mask }}>
        <Matrix width={mp.w} enlarge={{ c2: b.enlarge }} rows={b.rows} cells={b.cells} counts={b.left} cols={{ detect: b.left, deny: b.left, disrupt: b.left, degrade: b.left, deceive: b.left }} legend={b.legend} markFlash={b.flash} />
      </div>

      <BridgeLine show={b.bridge} />
      <MarkGloss show={b.markGloss} />
      <SinkholeGloss show={b.gloss} lines={b.glossLines} />
      <DenyTag show={b.denyTag} lit={b.denyLit} dim={b.denyDim} />
      <AooTag show={b.alarm} />
      <PriceTag {...TAG.detect} show={b.tagPair} />
      <PriceTag {...TAG.degrade} show={b.tagPair} />
      <PriceTag {...TAG.deny} show={b.tagDeny} glow={b.priced} />

      <SupposeChips show={b.chips} out={b.chipsOut} />

      <WatchLabel show={b.watch} sub={b.watchSub} />
      <FlipLabel show={b.flipLabel} act={b.flipAct} />
      <BusinessBlock name={b.name} decision={b.decision} prices={b.prices} glow={b.priced} />
    </Stage>
  );
}

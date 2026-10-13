import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { mix } from '../../../engine/src/ui';
import { MATRIX_POSE } from '../data/s04-fase';
import { SHOP_POSE } from '../data/shop-poses';
import { Matrix, matrixColBox, matrixRowBox } from './parts/Matrix';
import { Shop } from './parts/Shop';
import { s04Beats } from './parts/s04-fase/beats';
import { Envelope } from './parts/s04-fase/Envelope';
import { FallbackLine, ManyBlock, RowNote, UnopposedTag } from './parts/s04-fase/Labels';
import { Stage } from './kit';

const M = MATRIX_POSE;
/** The whole shop, low and left (where s03 had it under the intercepted message): labels go over it. */
const SHOP = SHOP_POSE.card;
const ROW = matrixRowBox('delivery', {}, M.w);
/** The e-mail's lane: Delivery's row, from the left column to the empty slots past the Deny cell. */
const LANE = { y: M.y + ROW.cy, from: 660, to: M.x + matrixColBox('degrade', {}, M.w).x - 6 } as const;
const MAIL = { big: 150, small: 98 } as const;
/** Left column, over the shop: the note, then the two lines of the rule. */
const TEXT = { x: 16, note: 84, line: 20, many: 80 } as const;

/**
 * s04-fase «Fase por fase».
 *   start      the lesson's matrix, whole, and the shop (dim) under an empty band.
 *   rows       «cada fila es una fase»; the five rows light one after another on «filas».
 *   counts     how many cells each row has: 3 · 2 · 2 · 3 · 3.
 *   single     Delivery is left with its Deny only (amber dashed row; the cell lifts, readable, on
 *              «bloquear»); the door is left with its lock only (alarm and camera go).
 *   fails      a hypothetical e-mail (its sender chip dashed and empty) comes along the row and goes
 *              through: the one control does not see it.
 *   unopposed  «la fase, desprotegida»; on «tienda» the lock gives way and the door stands open.
 *   back       the row gets its Detect and its (dimmed) Deceive back; the door, its alarm, camera and
 *              guard: «si una falla, otra avisa o atrapa», each part on its word.
 *   many       «varias celdas por fase · pasivas y activas» with the counts back; Detect's column
 *              lights on «miran», the other four on «actúan». Holds under the exam card.
 */
export function S04Fase(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = s04Beats(props, frame);
  const mail = mix(MAIL.big, MAIL.small, b.fly);
  const mailX = mix(LANE.from, LANE.to, b.fly);
  const s = b.shop;

  return (
    <Stage>
      <div style={{ position: 'absolute', left: SHOP.x, top: SHOP.y }}>
        <Shop
          width={SHOP.w}
          phase={frame / fps}
          dim={s.dim}
          alarmShow={s.devices}
          cameraShow={s.devices}
          alarm={s.alarm}
          ring={s.ring}
          camera={s.alarm}
          live={s.alarm}
          labels={{ live: s.alarm }}
          lock={s.lock}
          lockFail={s.lockFail}
          door={s.door}
          doorWarn={s.doorWarn}
          guard={s.guard}
          guardGlow={s.guardGlow}
        />
      </div>

      <div style={{ position: 'absolute', left: M.x, top: M.y }}>
        <Matrix width={M.w} rows={b.rows} cells={b.cells} cols={b.cols} counts={b.counts} />
      </div>

      {/* The hypothetical e-mail, on Delivery's row */}
      <div style={{ position: 'absolute', left: mailX - mail / 2, top: LANE.y - (mail * 0.8) / 2 + 3, zIndex: 7 }}>
        <Envelope w={mail} warn={b.got * (1 - b.restore)} opacity={b.mailIn * (1 - 0.4 * b.restore)} />
      </div>
      <div style={{ position: 'absolute', left: M.x, top: M.y + ROW.y + ROW.h + 14, width: M.w, display: 'flex', justifyContent: 'center', zIndex: 8 }}>
        <UnopposedTag show={b.tag} />
      </div>

      {/* Left column, over the shop */}
      <div style={{ position: 'absolute', left: TEXT.x, top: TEXT.note }}>
        <RowNote show={b.note} />
      </div>
      <div style={{ position: 'absolute', left: TEXT.x, top: TEXT.line }}>
        <FallbackLine show={b.line * (1 - 0.35 * b.many)} said={b.said} />
      </div>
      <div style={{ position: 'absolute', left: TEXT.x, top: TEXT.many }}>
        <ManyBlock show={b.many} passive={b.passive} active={b.active} />
      </div>
    </Stage>
  );
}

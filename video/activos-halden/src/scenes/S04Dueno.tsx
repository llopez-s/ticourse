import type { ReactNode } from 'react';
import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { Icon, mix } from '../../../engine/src/ui';
import { CLASSIFICATION, CONTENTS, DEVICE, DUTIES, LABEL, LIST_TITLE, OBLIGATIONS, OWNER, OWNER_VALUE, PERSON } from '../data/s04-dueno';
import { Pill } from './parts/Labels';
import { Nas } from './parts/Nas';
import { SUITCASE, SUITCASE_STICKER, SUITCASE_TAG, Suitcase } from './parts/Suitcase';
import { ImageTag } from './parts/Tags';
import { Stage, wordFrame } from './kit';

const S = 's04-dueno';
const W = 1728;

// ---- The list card with the disk's row (stage-local).
const TITLE_H = 58;
const DIM_ROW_H = 46;
const ROW_CLOSED = 46;
const ROW_OPEN = 176;
const ROW_TOP = TITLE_H + DIM_ROW_H;
const DEV = { x: 22, w: 300 } as const;
const OWN = { x: 340, w: 640 } as const;
const CLS = { x: 1000, w: 706 } as const;
const BOX_TOP = 54;
const BOX_H = 104;
// ---- Below the row.
const LOW_TOP = 300;
const DUTY_GAP = 62;
const OBL_TOP = 384;
const OBL_GAP_Y = 66;
const OBL_COL = [CLS.x, CLS.x + 340];
// ---- The suitcase.
const SUIT_W = 440;
const SUIT = { x: 420, y: 318 } as const;
const SUIT_TAG = { x: 24, y: 572 } as const;
const SUIT_SCALE = SUIT_W / SUITCASE.w;

/** An empty field box (dashed) that fills: `fill` 0–1 swaps the dashes for a solid, lit box. */
function FieldBox({ w, fill, tone, glow, children }: { w: number; fill: number; tone: string; glow: number; children?: ReactNode }) {
  const f = Math.max(0, Math.min(1, fill));
  return (
    <div
      style={{
        position: 'relative',
        width: w,
        height: BOX_H,
        boxSizing: 'border-box',
        borderRadius: RADIUS.md,
        border: `3px ${f > 0.5 ? 'solid' : 'dashed'} ${alpha(tone, 0.45 + 0.45 * Math.max(f, glow))}`,
        background: alpha(tone, 0.04 + 0.08 * f + 0.12 * glow),
        boxShadow: glow > 0.02 ? `0 0 ${Math.round(28 * glow)}px ${alpha(tone, 0.4 * glow)}` : undefined,
        display: 'flex',
        alignItems: 'center',
        padding: '0 22px',
      }}
    >
      {children}
    </div>
  );
}

/**
 * s04-dueno «De quién es y qué trato». Sistemas' list again; on `row` the network disk's row opens and two empty fields
 * of the table appear, «owner» and «classification» (a table row, not V28's two-box tag). On `owner` the first fills
 * with «responsable de la oficina de la terminal de pasajeros» (a post, no name); `person` adds «una persona, no un
 * área»; on `duties` three chips say what that means, each on its word. On `contents` «listas de embarque · nombres de
 * pasajeros» comes in under the second field and on `label` it fills with «Private» (never said); on `obligations` four
 * chips come out of it: «cifrado · quién accede · copias · cómo se retira». On `suitcase` the details step out and the
 * suitcase on the belt comes in («imagen · no es del puerto»): its name tag is tied to the owner field and its «frágil»
 * sticker to the classification field, each lit on its word.
 */
export function S04Dueno(props: SceneProps) {
  const frame = useCurrentFrame();
  const rowAt = props.cue('row');
  const ownerAt = props.cue('owner');
  const personAt = props.cue('person');
  const dutiesAt = props.cue('duties');
  const contentsAt = props.cue('contents');
  const labelAt = props.cue('label');
  const oblAt = props.cue('obligations');
  const suitAt = props.cue('suitcase');
  const valueAt = wordFrame(S, 's04-02', 'responde') - 6;
  const dutyAt = [wordFrame(S, 's04-03', 'Aprueba') - 6, wordFrame(S, 's04-03', 'decide') - 6, wordFrame(S, 's04-03', 'owner') - 10];
  const privateAt = wordFrame(S, 's04-04', 'classification') - 4;
  const oblWord = [wordFrame(S, 's04-04', 'cifra') - 6, wordFrame(S, 's04-04', 've') - 6, 0, wordFrame(S, 's04-04', 'retira') - 6];
  oblWord[2] = Math.round((oblWord[1] + oblWord[3]) / 2);
  const tagAt = wordFrame(S, 's04-05', 'etiqueta') - 6;
  const stickerAt = wordFrame(S, 's04-05', 'pegatina') - 6;

  const cardIn = enter(frame, -6, { distance: 14, duration: 14 });
  const open = progress(frame, rowAt, 18, EASE.inOut);
  const rowH = mix(ROW_CLOSED, ROW_OPEN, open);
  const fieldsIn = progress(frame, rowAt + 10, 14);
  const ownerFocus = progress(frame, ownerAt - 6, 12) * (1 - 0.7 * progress(frame, contentsAt - 6, 14));
  const ownerFill = progress(frame, valueAt, 14);
  const clsFocus = progress(frame, contentsAt - 6, 14) * (1 - 0.6 * progress(frame, suitAt, 14));
  const clsFill = progress(frame, privateAt, 12);
  const tagGlow = progress(frame, tagAt, 10) * (1 - progress(frame, stickerAt, 14));
  const stickerGlow = progress(frame, stickerAt, 10);

  const lowOut = progress(frame, suitAt - 10, 14, EASE.inOut);
  const lowOwn = 1 - 0.55 * progress(frame, contentsAt - 6, 14);
  const suitIn = progress(frame, suitAt - 4, 18);
  const tagLine = progress(frame, tagAt, 14);
  const stickerLine = progress(frame, stickerAt, 14);

  // Connector ends (stage-local).
  const tag = { x: SUIT.x + SUITCASE_TAG.x * SUIT_SCALE + 20 * SUIT_SCALE, y: SUIT.y + SUITCASE_TAG.y * SUIT_SCALE };
  const sticker = { x: SUIT.x + SUITCASE_STICKER.x * SUIT_SCALE, y: SUIT.y + SUITCASE_STICKER.y * SUIT_SCALE };
  const boxBottom = ROW_TOP + BOX_TOP + BOX_H + 4;
  const ownTo = { x: OWN.x + 180, y: boxBottom };
  const clsTo = { x: CLS.x + 10, y: boxBottom };

  return (
    <Stage>
      <div style={{ position: 'absolute', inset: 0, fontFamily: FONT.sans }}>
        {/* ---------- The list card and the disk's row ---------- */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: W,
            height: TITLE_H + DIM_ROW_H + rowH + 10,
            boxSizing: 'border-box',
            borderRadius: RADIUS.lg,
            border: `3px solid ${alpha(C.cyan, 0.55)}`,
            background: C.ink850,
            overflow: 'hidden',
            ...cardIn,
          }}
        >
          <div style={{ height: TITLE_H, display: 'flex', alignItems: 'center', gap: 14, padding: '0 22px', background: alpha(C.cyan, 0.12), fontSize: 32, fontWeight: 800, color: C.textStrong }}>
            <Icon name="file" size={32} color={C.cyan} />
            {LIST_TITLE}
          </div>
          {/* one row of the list above, grey bars */}
          <svg width={W} height={DIM_ROW_H} style={{ display: 'block' }}>
            {[
              [70, 200],
              [OWN.x + 20, 300],
              [CLS.x + 20, 220],
            ].map(([x, w]) => (
              <rect key={x} x={x} y={DIM_ROW_H / 2 - 7} width={w} height={14} rx={7} fill={alpha(C.text, 0.2)} />
            ))}
            <line x1={18} y1={DIM_ROW_H - 1} x2={W - 18} y2={DIM_ROW_H - 1} stroke={C.ink700} strokeWidth={2} />
          </svg>
          {/* the disk's row */}
          <div style={{ position: 'absolute', left: 8, right: 8, top: ROW_TOP + 4, height: rowH - 4, borderRadius: RADIUS.md, background: alpha(C.cyan, 0.06 + 0.06 * open), border: `2px solid ${alpha(C.cyan, 0.3 + 0.4 * open)}` }} />
          <div style={{ position: 'absolute', left: DEV.x, top: ROW_TOP + mix(4, 30, open), display: 'flex', flexDirection: 'column', alignItems: 'center', width: DEV.w - 30, gap: 10 }}>
            <Nas width={mix(52, 120, open)} frame={frame} />
            <div style={{ fontSize: 32, fontWeight: 800, color: C.textStrong, whiteSpace: 'nowrap', opacity: open }}>{DEVICE}</div>
          </div>
          {fieldsIn > 0.01 ? (
            <>
              <div style={{ position: 'absolute', left: OWN.x, top: ROW_TOP + 10, opacity: fieldsIn * (0.55 + 0.45 * Math.max(ownerFocus, 1 - clsFocus)) }}>
                <div style={{ fontSize: 32, fontWeight: 850, color: C.violet, height: BOX_TOP - 10, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Icon name="user" size={30} color={C.violet} />
                  {OWNER}
                </div>
                <FieldBox w={OWN.w - 20} fill={ownerFill} tone={C.cyan} glow={Math.max(0.6 * ownerFocus * (1 - ownerFill * 0.5), tagGlow)}>
                  {ownerFill > 0.01 ? <div style={{ fontSize: 32, fontWeight: 750, lineHeight: 1.18, color: C.textStrong, opacity: ownerFill }}>{OWNER_VALUE}</div> : null}
                </FieldBox>
              </div>
              <div style={{ position: 'absolute', left: CLS.x, top: ROW_TOP + 10, opacity: fieldsIn * (0.55 + 0.45 * Math.max(clsFocus, 1 - ownerFocus)) }}>
                <div style={{ fontSize: 32, fontWeight: 850, color: C.violet, height: BOX_TOP - 10, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Icon name="layers" size={30} color={C.violet} />
                  {CLASSIFICATION}
                </div>
                <FieldBox w={CLS.w - 20} fill={clsFill} tone={C.violet} glow={Math.max(0.6 * clsFocus * (1 - clsFill * 0.5), stickerGlow)}>
                  {clsFill > 0.01 ? (
                    <div style={{ fontSize: 50, fontWeight: 900, color: '#c4b5fd', opacity: clsFill, transform: `scale(${0.9 + 0.1 * clsFill})`, transformOrigin: '0 50%' }}>{LABEL}</div>
                  ) : null}
                </FieldBox>
              </div>
            </>
          ) : null}
        </div>

        {/* ---------- Below the row: what each field means ---------- */}
        {lowOut < 0.99 ? (
          <div style={{ position: 'absolute', inset: 0, opacity: (1 - lowOut) * lowOwn }}>
              {frame >= personAt - 4 ? (
                <div style={{ position: 'absolute', left: OWN.x, top: LOW_TOP, ...enter(frame, personAt, { distance: 12, duration: 12 }) }}>
                  <Pill text={PERSON} icon="user" tone={C.amber} size={32} height={54} on={progress(frame, personAt, 12) * (1 - 0.5 * progress(frame, dutiesAt, 14))} />
                </div>
              ) : null}
              {DUTIES.map((d, i) => {
                const at = Math.max(dutiesAt - 4, dutyAt[i]);
                if (frame < at - 2) return null;
                return (
                  <div key={d.text} style={{ position: 'absolute', left: OWN.x, top: LOW_TOP + 76 + i * DUTY_GAP, ...enter(frame, at, { distance: 12, duration: 12 }) }}>
                    <Pill text={d.text} icon={d.icon} tone={C.cyan} size={30} height={52} on={progress(frame, at, 10) * (1 - 0.5 * progress(frame, at + 40, 14))} />
                  </div>
                );
              })}
          </div>
        ) : null}
        <div style={{ position: 'absolute', inset: 0, opacity: 1 - 0.25 * lowOut }}>
            {frame >= contentsAt - 6 ? (
              <div style={{ position: 'absolute', left: CLS.x, top: LOW_TOP, ...enter(frame, contentsAt - 2, { distance: 12, duration: 12 }) }}>
                <Pill text={CONTENTS} icon="file" tone={C.cyan} size={29} height={54} on={progress(frame, contentsAt, 12) * (1 - 0.5 * progress(frame, labelAt, 14))} />
              </div>
            ) : null}
            {OBLIGATIONS.map((o, i) => {
              const at = Math.max(oblAt - 4, oblWord[i]);
              if (frame < at - 2) return null;
              return (
                <div key={o.text} style={{ position: 'absolute', left: OBL_COL[i % 2], top: OBL_TOP + Math.floor(i / 2) * OBL_GAP_Y, ...enter(frame, at, { distance: 12, duration: 12 }) }}>
                  <Pill text={o.text} icon={o.icon} tone={C.violet} size={32} height={56} on={progress(frame, at, 10) * (1 - 0.4 * progress(frame, at + 36, 14))} />
                </div>
              );
            })}
        </div>

        {/* ---------- The suitcase ---------- */}
        {suitIn > 0.01 ? (
          <>
            <svg width={W} height={660} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
              {tagLine > 0.01 ? (
                <line x1={tag.x} y1={tag.y} x2={mix(tag.x, ownTo.x, tagLine)} y2={mix(tag.y, ownTo.y, tagLine)} stroke={C.cyan} strokeWidth={4} strokeDasharray="10 8" />
              ) : null}
              {stickerLine > 0.01 ? (
                <line x1={sticker.x} y1={sticker.y} x2={mix(sticker.x, clsTo.x, stickerLine)} y2={mix(sticker.y, clsTo.y, stickerLine)} stroke={C.amber} strokeWidth={4} strokeDasharray="10 8" />
              ) : null}
            </svg>
            <div style={{ position: 'absolute', left: SUIT.x, top: SUIT.y, opacity: suitIn, transform: `translateY(${(1 - suitIn) * 20}px)` }}>
              <Suitcase width={SUIT_W} roll={frame - suitAt} tagGlow={tagGlow} stickerGlow={stickerGlow} />
            </div>
            <div style={{ position: 'absolute', left: SUIT_TAG.x, top: SUIT_TAG.y, opacity: suitIn }}>
              <ImageTag size={28} />
            </div>
          </>
        ) : null}
      </div>
    </Stage>
  );
}

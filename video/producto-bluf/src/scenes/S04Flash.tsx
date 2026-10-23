import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { Icon, mix, windowWeight } from '../../../engine/src/ui';
import type { BlockId } from '../data/flash';
import { FlashSheet, camOn, camWhole, mixCam, SHEET } from './parts/FlashSheet';
import { Stage, interceptWindow, wordFrame } from './kit';

const S = 's04-flash';
const W = STAGE.width;

// Camera stops (stage px). The last one sits left so the chips of `why` have a column on the right.
export const LEFT_X = 30 + SHEET.w / 2;
const CAM_HEAD = camOn([0, 1], 1.2, 250);
const CAM_ALL = camWhole(16, 650);
const CAM_BLUF = camOn([3, 6], 1.12, 300);
const CAM_KNOW = camOn([8, 11], 1.12, 320);
export const CAM_UNK = camOn([13, 14], 1.0, 452, LEFT_X);
/** While the intercepted message is up the page is hidden above this stage y. */
export const CLIP_TOP_MSG = 208;

const CHIPS = [
  { text: 'el lector no supone de más', icon: 'eye', word: 'suponga' },
  { text: 'sabe que habrá actualización', icon: 'clock', word: 'actualización' },
] as const;

/**
 * s04-flash «Un flash por dentro». The lesson's flash alert (no `Ref:` line) as one sheet the
 * camera moves over.
 *   issue     (sound: ping2) opens on the header — «MERIDIAN CTI — FLASH ALERT MER-FA-2026-014 ·
 *             TLP:AMBER», «Issued: … 11:40 UTC» — TLP only as text; on «Cabe» it pulls back to the
 *             whole page and, on «cada parte», each block gets its outline.
 *   bluf      the camera goes to the BLUF; on «moderada» «moderate confidence» is marked. The
 *             group's name is in the lesson's text and is neither underlined nor labelled.
 *   know      WHAT WE KNOW with its three lines lit (the first two as the voice reads them).
 *   (message) before VELVET CICADA's card the page has already moved down to WHAT WE DO NOT KNOW
 *             YET and its top is hidden under the card's band, so the BLUF never shares a shot with
 *             it; the page then stays still.
 *   unknown   the amber block lights and its one line is marked on «credenciales».
 *   why       two small chips by the amber block: «el lector no supone de más», «sabe que habrá
 *             actualización».
 */
export function S04Flash(props: SceneProps) {
  const frame = useCurrentFrame();
  const issue = props.cue('issue');
  const bluf = props.cue('bluf');
  const know = props.cue('know');
  const unknown = props.cue('unknown');
  const why = props.cue('why');
  const w = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);
  const msg = interceptWindow(S, 's04-05');

  const cabe = w('s04-01', 'Cabe') - 10;
  const cada = w('s04-01', 'cada') - 4;
  const moderate = w('s04-03', 'moderada') - 6;

  // ---- Camera: head → whole page → BLUF → know → the amber block (before the message).
  const toAll = progress(frame, cabe, 28, EASE.inOut);
  const toBluf = progress(frame, bluf - 12, 26, EASE.inOut);
  const toKnow = progress(frame, know - 12, 26, EASE.inOut);
  const toUnk = progress(frame, msg.from - 40, 30, EASE.inOut);
  let cam = mixCam(CAM_HEAD, CAM_ALL, toAll);
  cam = mixCam(cam, CAM_BLUF, toBluf);
  cam = mixCam(cam, CAM_KNOW, toKnow);
  cam = mixCam(cam, CAM_UNK, toUnk);
  const clipTop = mix(0, CLIP_TOP_MSG, toUnk);

  // ---- Which block the voice is on.
  const ov = windowWeight(frame, cabe + 4, bluf - 2, { ramp: 12, lead: 0 });
  const hd = windowWeight(frame, -20, cabe + 6, { ramp: 12, lead: 0 });
  const bl = windowWeight(frame, bluf - 2, know - 2, { ramp: 12, lead: 0 });
  const kn = windowWeight(frame, know - 2, msg.from - 30, { ramp: 12, lead: 0 });
  const unkLit = Math.max(0.55 * progress(frame, msg.from - 30, 20), progress(frame, unknown - 4, 14));
  const lit: Partial<Record<BlockId, number>> = {
    head: Math.max(hd, ov),
    bluf: Math.max(ov, bl),
    know: Math.max(ov, kn),
    unknown: Math.max(ov, unkLit),
    actions: ov,
    next: ov,
    contact: ov,
  };
  const outlineAt = [cada, cada + 8, cada + 16, cada + 24, cada + 32, cada + 40];
  const outlineIds: BlockId[] = ['head', 'bluf', 'know', 'unknown', 'actions', 'next'];
  const outFade = 1 - progress(frame, bluf - 6, 14, EASE.inOut);
  const boxes: Partial<Record<BlockId, number>> = {};
  outlineIds.forEach((id, i) => {
    boxes[id] = progress(frame, outlineAt[i], 10) * outFade;
  });
  const bands: Partial<Record<BlockId, number>> = {
    head: progress(frame, issue, 12) * (1 - progress(frame, cabe, 14)),
    unknown: progress(frame, unknown - 2, 16),
  };
  const conf = progress(frame, moderate, 12);
  const lineHl: Record<number, number> = {
    9: progress(frame, w('s04-04', 'correos') - 6, 10) * (1 - progress(frame, w('s04-04', 'señuelo') - 6, 10)),
    10: progress(frame, w('s04-04', 'señuelo') - 6, 10) * (1 - progress(frame, msg.from - 40, 12)),
    14: progress(frame, w('s04-06', 'credenciales') - 8, 12),
  };

  const sheetIn = progress(frame, 0, 16);
  const chipAt = CHIPS.map((c, i) => Math.max(why - 4 + i * 10, w('s04-07', c.word) - 10));

  return (
    <Stage style={{ fontFamily: FONT.sans }}>
      <FlashSheet cam={cam} lit={lit} bands={bands} boxes={boxes} lineHl={lineHl} conf={conf} clipTop={clipTop} opacity={sheetIn} style={{ transform: `translateY(${(1 - sheetIn) * 20}px)` }} />

      {/* «1 página» while the whole page is in view */}
      {toAll > 0.4 && toBluf < 0.6 ? (
        <div style={{ position: 'absolute', left: W - 420, top: 250, ...enter(frame, cabe + 8, { distance: 16 }), opacity: Math.min(toAll, 1 - toBluf) }}>
          <div style={{ padding: '6px 26px 8px', borderRadius: RADIUS.pill, border: `2px solid ${alpha(C.cyan, 0.7)}`, background: alpha(C.ink950, 0.92), fontSize: 40, fontWeight: 800, color: C.cyanSoft, whiteSpace: 'nowrap' }}>1 página</div>
        </div>
      ) : null}

      {/* The two reasons, next to the amber block */}
      <svg width={W} height={660} viewBox={`0 0 ${W} 660`} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
        {CHIPS.map((c, i) => {
          const p = progress(frame, chipAt[i] + 2, 18, EASE.inOut);
          const y1 = 342 + i * 122 + 44;
          return <path key={c.text} d={`M${30 + SHEET.w - 10} 440 C${30 + SHEET.w + 20} 440 ${1352} ${y1} ${1370} ${y1}`} fill="none" stroke={alpha(C.emerald, 0.7)} strokeWidth={4} strokeLinecap="round" strokeDasharray="400" strokeDashoffset={400 * (1 - p)} />;
        })}
      </svg>
      {CHIPS.map((c, i) => {
        const e = enter(frame, chipAt[i], { distance: 24, axis: 'x', duration: 18 });
        return (
          <div key={c.text} style={{ position: 'absolute', left: 1372, top: 342 + i * 122, width: W - 1372, minHeight: 88, boxSizing: 'border-box', display: 'flex', alignItems: 'center', gap: 14, padding: '10px 20px', borderRadius: RADIUS.lg, border: `2px solid ${alpha(C.emerald, 0.8)}`, background: alpha(C.emerald, 0.12), fontSize: 30, fontWeight: 750, lineHeight: 1.18, color: C.textStrong, ...e }}>
            <Icon name={c.icon} size={38} color={C.emerald} />
            <span>{c.text}</span>
          </div>
        );
      })}
    </Stage>
  );
}


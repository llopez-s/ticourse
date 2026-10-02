import type { ReactNode } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { EASE, progress, pulse, springIn } from '../../../engine/src/theme/motion';
import { Icon, mix, windowWeight } from '../../../engine/src/ui';
import {
  S05_DATES,
  S05_HASH_RULE,
  S05_HIT,
  S05_LABELS,
  S05_LAYOUT as L,
  S05_LEFT_PATH,
  S05_RULE,
} from '../data/s05-otra-ropa';
import { Stage, segment, wordFrame } from './kit';
import { Person } from './parts/Person';
import { ProcessTree, treeHitProgress, treeNodeAnchor, treeRowEnd } from './parts/ProcessTree';
import { Pyramid } from './parts/Pyramid';
import { MARK_TONE, MarkLine, PhotoFrame, RightLog } from './parts/s05-otra-ropa/Photo';

const SCENE = 's05-otra-ropa';
/** Inner width of a photo (frame minus its 3 px border and padding). */
const inner = (w: number) => w - 2 * (L.pad + 3);
const TREE_W = inner(L.left.w);
const LOG_H = L.photoH - 2 * (L.pad + 3) - L.captionH - 10;
/** Stage-local y of the photo content's top, relative to the photo's top. */
const CONTENT_TOP = 3 + L.pad + L.captionH + 10;

type Box = { x: number; y: number; s: number };
const mixBox = (a: Box, b: Box, t: number): Box => ({ x: mix(a.x, b.x, t), y: mix(a.y, b.y, t), s: mix(a.s, b.s, t) });

const THINK_W = (L.left.w + L.right.w) * L.think.scale + L.think.gap;
const THINK_X = (1728 - THINK_W) / 2;
const THINK_Y = 660 - L.photoH * L.think.scale - 2;
const BOX = {
  aL: { ...L.a.left, s: 1 },
  aR: { ...L.a.right, s: 1 },
  tL: { x: THINK_X, y: THINK_Y, s: L.think.scale },
  tR: { x: THINK_X + L.left.w * L.think.scale + L.think.gap, y: THINK_Y, s: L.think.scale },
  cL: { ...L.c.left, s: 1 },
  cR: { x: L.c.right.x, y: L.c.right.y, s: L.c.right.scale },
};

/** Right region (after the 05-03 photo has gone): the hit callout, then the person and a small pyramid. */
const RIGHT_X = 960;
const PERSON_W = 390;
const MINI = { x: RIGHT_X + PERSON_W + 24, w: 1728 - (RIGHT_X + PERSON_W + 24) - 8, top: 176, h: 470 };

/**
 * s05-otra-ropa «Tres días después».
 *   two-photos   the 02-03 photo (the process tree + winhlp.exe's path) beside
 *                the 05-03 photo (V3's EDR lines, no pipe, no signed=)
 *   zero-hits    the hash rule sweeps the 05-03 photo; «0 coincidencias» on «Cero»
 *   ropa         only the hash, amber, on both photos — «la ropa»
 *   accent       image name and folder, steel — the long label
 *   same-domain  the domain, cyan, on both — «de momento»
 *   (s05-05)     the photos move down and shrink: the top-centre band stays
 *                clear for the question and the think prompt
 *   rule         the behaviour rule in big type, «sin hash»; the 02-03 photo
 *                comes under it, its rule nodes lit; the 05-03 photo steps back
 *   chain        the glow walks explorer, powershell, wcssvc, winhlp, schtasks
 *   retro-hit    the rule fires on the schtasks row: «09:44:20», no hash looked at
 *   walk         the person (new coat, disguised accent, footprints lit) beside
 *                a small pyramid with TTPs lit; the photo steps back
 */
export function S05OtraRopa(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const twoPhotos = props.cue('two-photos');
  const zeroHits = props.cue('zero-hits');
  const ropaAt = props.cue('ropa');
  const accentAt = props.cue('accent');
  const domainAt = props.cue('same-domain');
  const ruleAt = props.cue('rule');
  const chainAt = props.cue('chain');
  const hitAt = props.cue('retro-hit');
  const walkAt = props.cue('walk');
  const s0505 = segment(props, 's05-05');
  const ceroAt = Math.max(zeroHits + 20, wordFrame(SCENE, 's05-02', 'cero'));
  const walkRopa = wordFrame(SCENE, 's05-08', 'ropa');
  const walkAcento = wordFrame(SCENE, 's05-08', 'acento');
  const walkAnda = wordFrame(SCENE, 's05-08', 'anda');

  // Phase moves: the comparison, the think prompt (low and small), the rule.
  const think = progress(frame, s0505.from - 6, 24, EASE.inOut);
  const toRule = progress(frame, ruleAt + 2, 26, EASE.inOut);
  const leftBox = mixBox(mixBox(BOX.aL, BOX.tL, think), BOX.cL, toRule);
  const rightBox = mixBox(mixBox(BOX.aR, BOX.tR, think), BOX.cR, toRule);
  const rightGone = progress(frame, chainAt - 4, 18, EASE.inOut);
  const rightOpacity = (1 - 0.5 * toRule) * (1 - rightGone);
  const leftDim = progress(frame, walkAt - 2, 16);

  // Comparison highlights (they hold until the rule).
  const markEnd = ruleAt;
  const hashMark = windowWeight(frame, ropaAt, markEnd, { ramp: 12 });
  const imageMark = windowWeight(frame, accentAt, markEnd, { ramp: 12 });
  const domainMark = windowWeight(frame, domainAt, markEnd, { ramp: 12 });
  const anyMark = Math.max(hashMark, imageMark, domainMark);

  // Photos appear: frames dim from the first frame, content at two-photos.
  const frameIn = 0.45 + 0.55 * progress(frame, 0, 14);
  const lit = progress(frame, twoPhotos - 8, 16);
  const treeDraw = 0.25 + 0.75 * progress(frame, 0, Math.max(20, twoPhotos + 24));
  const logAppear = progress(frame, twoPhotos, 36, EASE.linear);

  // The hash rule's sweep and its result.
  const scanT = progress(frame, zeroHits + 8, Math.max(16, ceroAt - zeroHits - 14), EASE.inOut);
  const scan = frame >= zeroHits + 8 && frame < ceroAt ? scanT : -1;
  const ruleChipIn = progress(frame, zeroHits - 2, 14);
  const stamp = springIn(frame, fps, ceroAt - 2, { damping: 13 });
  const bandOut = progress(frame, s0505.from - 10, 14, EASE.inOut);
  const resultOut = progress(frame, ropaAt - 6, 14, EASE.inOut);

  // The behaviour rule on the 02-03 tree.
  const ruleIn = springIn(frame, fps, ruleAt + 4, { damping: 17 });
  const ruleNodes = windowWeight(frame, ruleAt + 16, chainAt, { ramp: 14 });
  const walk = progress(frame, chainAt + 8, Math.max(40, hitAt - chainAt - 16), EASE.linear);
  const hit = treeHitProgress(frame, hitAt);
  const hashFade = 1 - 0.7 * progress(frame, ruleAt, 20);
  const callout = progress(frame, hitAt + 2, 14) * (1 - progress(frame, walkAt - 6, 12, EASE.inOut));

  // The person and the small pyramid.
  const personIn = progress(frame, walkAt, 18);
  const swap = progress(frame, walkRopa, 16);
  const disguise = progress(frame, walkAcento, 16);
  const andar = progress(frame, walkAnda - 2, 14);

  // Hit row in stage coordinates (the left photo at phase C).
  const schtasks = treeNodeAnchor('schtasks', TREE_W);
  const rowEndX = BOX.cL.x + 3 + L.pad + treeRowEnd('schtasks', TREE_W);
  const rowY = BOX.cL.y + CONTENT_TOP + schtasks.y;

  return (
    <Stage>
      {/* The 05-03 photo. */}
      {rightOpacity > 0.001 ? (
        <div
          style={{
            position: 'absolute',
            left: rightBox.x,
            top: rightBox.y,
            transform: `scale(${rightBox.s})`,
            transformOrigin: '0 0',
            opacity: frameIn * rightOpacity,
            filter: toRule > 0.01 ? `saturate(${1 - 0.5 * toRule})` : undefined,
          }}
        >
          <PhotoFrame width={L.right.w} date={S05_DATES.right} glow={lit * (1 - toRule) * 0.25}>
            <RightLog
              width={inner(L.right.w)}
              height={LOG_H}
              appear={logAppear}
              scan={scan}
              dim={anyMark}
              marks={{ hash: hashMark, image: imageMark, domain: domainMark }}
            />
          </PhotoFrame>
        </div>
      ) : null}

      {/* The 02-03 photo: the process tree and winhlp.exe's path. */}
      <div
        style={{
          position: 'absolute',
          left: leftBox.x,
          top: leftBox.y,
          transform: `scale(${leftBox.s})`,
          transformOrigin: '0 0',
          opacity: frameIn * (1 - 0.45 * leftDim),
          filter: leftDim > 0.01 ? `saturate(${1 - 0.4 * leftDim})` : undefined,
        }}
      >
        <PhotoFrame width={L.left.w} date={S05_DATES.left} glow={Math.max(lit * (1 - think) * 0.25, toRule * 0.6 * (1 - leftDim))} glowTone={toRule > 0.5 ? C.emerald : C.cyan}>
          <ProcessTree
            width={TREE_W}
            frame={frame}
            draw={treeDraw}
            dim={Math.max(anyMark * 0.6, ruleNodes * 0.55)}
            focus={{ explorer: ruleNodes, powershell: ruleNodes, schtasks: ruleNodes }}
            focusTone={C.emerald}
            highlight={{ hash: hashMark, domain: domainMark }}
            showHash={hashFade}
            walk={walk}
            hit={hit}
          />
          <div style={{ marginTop: 10, height: 46, display: 'flex', alignItems: 'center', opacity: lit * (1 - 0.6 * toRule) }}>
            <MarkLine text={S05_LEFT_PATH} size={32} strong tone={MARK_TONE.image} mark={imageMark} dim={anyMark} />
          </div>
        </PhotoFrame>
      </div>

      {/* zero-hits: the hash rule and its result, under the 05-03 photo. */}
      {ruleChipIn > 0 && bandOut < 1 && resultOut < 1 ? (
        <div
          style={{
            position: 'absolute',
            left: L.a.right.x,
            top: L.bandY + 14,
            display: 'flex',
            alignItems: 'center',
            gap: 22,
            opacity: ruleChipIn * (1 - resultOut) * (1 - bandOut),
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '10px 20px',
              borderRadius: RADIUS.pill,
              border: `2px solid ${alpha(C.amber, 0.75)}`,
              background: alpha(C.amber, 0.1 + 0.12 * (scan >= 0 ? pulse(frame, fps, 0.8) : 0)),
              fontFamily: FONT.sans,
              fontSize: 32,
              fontWeight: 700,
              color: C.textStrong,
              whiteSpace: 'nowrap',
            }}
          >
            <Icon name="search" size={32} color={C.amber} />
            {S05_HASH_RULE.label}
            <span style={{ fontFamily: FONT.mono, color: C.amber }}>{S05_HASH_RULE.hash}</span>
          </div>
          {stamp > 0.01 ? (
            <div
              style={{
                padding: '8px 22px',
                borderRadius: RADIUS.sm,
                border: `4px solid ${C.rose}`,
                background: alpha(C.roseDeep, 0.85),
                color: C.roseSoft,
                fontFamily: FONT.sans,
                fontSize: 42,
                fontWeight: 900,
                letterSpacing: -0.5,
                whiteSpace: 'nowrap',
                transform: `scale(${1.25 - 0.25 * Math.min(1, stamp)}) rotate(-3deg)`,
                opacity: Math.min(1, stamp * 1.5),
                boxShadow: `0 0 26px ${alpha(C.rose, 0.4)}`,
              }}
            >
              {S05_HASH_RULE.result}
            </div>
          ) : null}
        </div>
      ) : null}

      {/* ropa / accent / same-domain labels. */}
      {bandOut < 1 ? (
        <div style={{ position: 'absolute', left: 0, top: L.bandY + 8, width: 1728, height: 122, opacity: 1 - bandOut }}>
          <BandLabel x={0} at={ropaAt} frame={frame} tone={MARK_TONE.hash} size={44}>
            {S05_LABELS.ropa}
          </BandLabel>
          <BandLabel x={262} at={accentAt} frame={frame} tone={MARK_TONE.image} size={32}>
            <div>{S05_LABELS.accent[0]}</div>
            <div>{S05_LABELS.accent[1]}</div>
          </BandLabel>
          <BandLabel x={L.a.right.x} at={domainAt} frame={frame} tone={MARK_TONE.domain} size={44}>
            {S05_LABELS.domain}
          </BandLabel>
        </div>
      ) : null}

      {/* rule: the behaviour rule, big, with «sin hash». */}
      {ruleIn > 0.01 ? <RuleCard p={ruleIn} glow={1 - 0.5 * leftDim} /> : null}

      {/* retro-hit: the rule fires on the schtasks row. */}
      {callout > 0.001 ? (
        <>
          <svg width={1728} height={660} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: callout }}>
            <line x1={rowEndX + 24} y1={rowY} x2={RIGHT_X + 40 - 14} y2={rowY} stroke={C.emerald} strokeWidth={4} strokeLinecap="round" strokeDasharray="2 10" />
          </svg>
          <div
            style={{
              position: 'absolute',
              left: RIGHT_X + 40,
              top: rowY,
              transform: `translateY(-50%) translateX(${(1 - callout) * 18}px)`,
              opacity: callout,
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
              padding: '16px 28px 18px',
              borderRadius: RADIUS.lg,
              border: `3px solid ${alpha(C.emerald, 0.85)}`,
              background: `linear-gradient(180deg, ${alpha(C.emerald, 0.16)} 0%, ${alpha(C.ink900, 0.95)} 100%)`,
              boxShadow: `0 0 ${Math.round(20 + 26 * (1 - progress(frame, hitAt + 10, 40)))}px ${alpha(C.emerald, 0.4)}`,
              fontFamily: FONT.sans,
              whiteSpace: 'nowrap',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <Icon name="bell" size={46} color={C.emerald} />
              <span style={{ fontFamily: FONT.mono, fontSize: 58, fontWeight: 800, color: C.emerald }}>{S05_HIT.time}</span>
            </div>
            <span style={{ fontSize: 36, fontWeight: 750, color: C.textStrong }}>{S05_HIT.caption}</span>
          </div>
        </>
      ) : null}

      {/* walk: the person changed coat and disguised the accent; the walk stays. */}
      {personIn > 0 ? (
        <>
          <div style={{ position: 'absolute', left: RIGHT_X, top: MINI.top }}>
            <Person
              width={PERSON_W}
              height={MINI.h}
              frame={frame}
              show={personIn}
              swapClothes={swap}
              acentoDisguised={disguise}
              focus={{ andar }}
              labelSize={38}
            />
          </div>
          <div style={{ position: 'absolute', left: MINI.x, top: MINI.top, opacity: personIn }}>
            <Pyramid width={MINI.w} height={MINI.h} frame={frame} labels="name" focus={{ ttps: andar }} />
          </div>
        </>
      ) : null}
    </Stage>
  );
}

/** A coloured label in the band under the photos: a bar in the highlight colour and its text. */
function BandLabel({ x, at, frame, tone, size, children }: { x: number; at: number; frame: number; tone: string; size: number; children: ReactNode }) {
  const p = progress(frame, at - 2, 14);
  if (p <= 0) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: 0,
        height: 110,
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        opacity: p,
        transform: `translateY(${(1 - p) * 14}px)`,
        fontFamily: FONT.sans,
      }}
    >
      <div style={{ width: 8, height: 86, borderRadius: 4, background: tone, boxShadow: `0 0 14px ${alpha(tone, 0.6)}` }} />
      <div style={{ fontSize: size, fontWeight: 800, lineHeight: 1.18, letterSpacing: -0.3, color: tone, whiteSpace: 'nowrap' }}>{children}</div>
    </div>
  );
}

/** The lesson's behaviour rule across the top of the stage (after the think prompt has gone). */
function RuleCard({ p, glow }: { p: number; glow: number }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: 1728,
        height: L.c.ruleH,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        gap: 30,
        padding: '0 34px',
        borderRadius: RADIUS.lg,
        border: `3px solid ${alpha(C.emerald, 0.4 + 0.45 * glow)}`,
        background: `linear-gradient(90deg, ${alpha(C.emerald, 0.14)} 0%, ${alpha(C.ink900, 0.96)} 60%)`,
        boxShadow: `0 0 ${Math.round(34 * glow)}px ${alpha(C.emerald, 0.22 * glow)}, 0 24px 60px ${alpha('#000000', 0.4)}`,
        fontFamily: FONT.sans,
        opacity: Math.min(1, p * 1.4),
        transform: `translateY(${(1 - Math.min(1, p)) * -18}px)`,
      }}
    >
      <div
        style={{
          width: 84,
          height: 84,
          borderRadius: 42,
          display: 'grid',
          placeItems: 'center',
          flexShrink: 0,
          background: alpha(C.emerald, 0.14),
          border: `3px solid ${alpha(C.emerald, 0.75)}`,
        }}
      >
        <Icon name="radar" size={48} color={C.emerald} strokeWidth={2.2} />
      </div>
      <div style={{ flex: 1, fontSize: 46, fontWeight: 850, lineHeight: 1.12, letterSpacing: -0.6, color: C.textStrong, whiteSpace: 'nowrap' }}>
        <div>{S05_RULE.lines[0]}</div>
        <div>{S05_RULE.lines[1]}</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, flexShrink: 0 }}>
        <span style={{ fontSize: 26, fontWeight: 650, color: C.muted, whiteSpace: 'nowrap' }}>{S05_RULE.kicker}</span>
        <span
          style={{
            padding: '8px 22px',
            borderRadius: RADIUS.pill,
            background: C.emerald,
            color: C.ink950,
            fontSize: 34,
            fontWeight: 850,
            whiteSpace: 'nowrap',
          }}
        >
          {S05_RULE.badge}
        </span>
      </div>
    </div>
  );
}

import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { mix } from '../../../engine/src/ui';
import { STAMP_CASE, WRONG_LABEL } from '../data/canon';
import { CASE, CaseDiagram } from './parts/CaseDiagram';
import { CaseStamp, Gloss, ImageTag, Pill, TermPill } from './parts/Labels';
import { HeadChip, Sheet, Signature, Typed } from './parts/Paper';
import { BANNER, Banner, CAPSIGN, CapSign, PoolWall } from './parts/Pool';
import { Stage, wordFrame } from './kit';

const S = 's02-que';

const SHEET_W = 500;
const SHEET_H = 340;
const SHEET_TOP = 100;
/** Final columns (with the pool) and the centred places the sheets take before it comes in. */
const X1_END = 0;
const X2_END = 520;
const X1_ALONE = (1728 - SHEET_W) / 2;
const X1_PAIR = (1728 - (2 * SHEET_W + 20)) / 2;
const X2_PAIR = X1_PAIR + SHEET_W + 20;
const LABEL_TOP = 456;
const ROW_TOP = 532;

const WALL = { x: 1050, y: 92, w: 678, h: 566 } as const;

/** One sheet "coming closer to be read": rises into place, lifted a little while it is being read. */
function approach(frame: number, at: number) {
  const p = progress(frame, at - 6, 20);
  const lift = progress(frame, at, 14) * (1 - progress(frame, at + 60, 30, EASE.inOut));
  return { p, lift };
}

/**
 * s02-que «Qué y por qué, y cuánto». The case first, big and centred: the port sends documents out (shipping lines and
 * customs), and on «cuatro hojas» four sheet pictograms stack under it. Then it makes room: on `sheet-1` the policy
 * sheet comes closer and its text types itself («…para protegerla»), the management signature draws on «dirección»;
 * on `policy` its heading gets the check and POLICY lands with three glosses lit on the voice's words. On `sheet-2`
 * Security's sheet (the platform has no name; «AES-256» appears beside «cifrado», on screen only) and on `standard`
 * its «POLÍTICA» heading is struck and STANDARD lands. On `pool-1` the pool wall comes in («imagen · no es del
 * puerto») with the two boards, the columns stepping back; on `pool-both` each board gets what it answers and that it
 * obliges, and the two labels light with them.
 */
export function S02Que(props: SceneProps) {
  const frame = useCurrentFrame();
  const caseAt = props.cue('case');
  const sheet1At = props.cue('sheet-1');
  const policyAt = props.cue('policy');
  const sheet2At = props.cue('sheet-2');
  const standardAt = props.cue('standard');
  const pool1At = props.cue('pool-1');
  const bothAt = props.cue('pool-both');

  // The sheets are centred while they are alone and glide left, together, to make room for the pool.
  const glide1 = progress(frame, sheet2At - 36, 26, EASE.inOut);
  const glide2 = progress(frame, pool1At - 24, 24, EASE.inOut);
  const X1 = mix(mix(X1_ALONE, X1_PAIR, glide1), X1_END, glide2);
  const X2 = mix(X2_PAIR, X2_END, glide2);

  const fourAt = Math.max(caseAt + 20, wordFrame(S, 's02-01', 'cuatro') - 4);
  const stampIn = enter(frame, -6, { distance: 16, duration: 16 });

  // The case: big and centred, then gone before the first sheet arrives.
  const caseIn = progress(frame, caseAt - 8, 16);
  const caseOut = progress(frame, sheet1At - 22, 16, EASE.inOut);
  const caseVisible = caseIn * (1 - caseOut);

  // Sheet 1 (policy)
  const s1 = approach(frame, sheet1At);
  const dirAt = Math.max(sheet1At + 6, wordFrame(S, 's02-02', 'dirección') - 4);
  const infoAt = Math.max(sheet1At + 12, wordFrame(S, 's02-02', 'información') - 6);
  const protAt = Math.max(infoAt + 40, wordFrame(S, 's02-02', 'protegerla') + 8);
  const sign = progress(frame, dirAt, 34, EASE.inOut);
  const policyCheck = progress(frame, policyAt, 12);
  const policyPill = progress(frame, policyAt, 12);
  const pQue = progress(frame, Math.max(policyAt + 6, wordFrame(S, 's02-03', 'qué') - 4), 12);
  const pObl = progress(frame, Math.max(policyAt + 12, wordFrame(S, 's02-03', 'obliga') - 4), 12);
  const pTec = progress(frame, Math.max(policyAt + 18, wordFrame(S, 's02-03', 'tecnología') - 6), 12);

  // Sheet 2 (standard)
  const s2 = approach(frame, sheet2At);
  const segAt = Math.max(sheet2At + 6, wordFrame(S, 's02-04', 'Seguridad') - 4);
  const confAt = Math.max(sheet2At + 14, wordFrame(S, 's02-04', 'confidencial') - 6);
  const cifAt = Math.max(confAt + 20, wordFrame(S, 's02-04', 'cifrado') - 4);
  const diasAt = Math.max(cifAt + 50, wordFrame(S, 's02-04', 'días') + 8);
  const aesIn = progress(frame, cifAt + 4, 12);
  const strike = progress(frame, standardAt + 2, 14);
  const stdPill = progress(frame, standardAt, 12);
  const sCuanto = progress(frame, Math.max(standardAt + 6, wordFrame(S, 's02-05', 'cuánto') - 4), 12);
  const sObl = progress(frame, Math.max(standardAt + 12, wordFrame(S, 's02-05', 'obliga') - 4), 12);
  const sCad = progress(frame, Math.max(standardAt + 20, wordFrame(S, 's02-05', 'obliga') + 10), 12);

  // The pool
  const poolIn = progress(frame, pool1At - 6, 18);
  const bannerAt = pool1At + 8;
  const capAt = Math.max(bannerAt + 40, wordFrame(S, 's02-06', 'lado') - 12);
  const bannerIn = progress(frame, bannerAt, 16);
  const capIn = progress(frame, capAt, 16);
  const stepBack = progress(frame, pool1At - 4, 14) * (1 - progress(frame, bothAt - 8, 14));
  const tagQue = progress(frame, Math.max(bothAt + 2, wordFrame(S, 's02-07', 'qué') - 6), 12);
  const tagCuanto = progress(frame, Math.max(bothAt + 14, wordFrame(S, 's02-07', 'cuánto') - 6), 12);
  const tagObl = progress(frame, Math.max(bothAt + 26, wordFrame(S, 's02-07', 'obligan') - 6), 12);
  const lit1 = tagQue * (1 - 0.0);
  const lit2 = tagCuanto;

  // The case group is centred, then disappears in place.
  const caseX = (1728 - CASE.w) / 2;
  const caseY = mix(110, 90, caseOut);

  return (
    <Stage>
      <div style={{ position: 'absolute', left: 0, top: 0, ...stampIn }}>
        <CaseStamp parts={[...STAMP_CASE]} size={30} />
      </div>

      {caseVisible > 0.01 ? (
        <div style={{ position: 'absolute', left: caseX, top: caseY, opacity: caseVisible, transform: `scale(${mix(1, 0.94, caseOut)})`, transformOrigin: '50% 50%' }}>
          <CaseDiagram frame={frame} travelFrom={caseAt + 6} fourAt={fourAt} />
        </div>
      ) : null}

      {/* Sheet 1 · policy */}
      {s1.p > 0.01 ? (
        <div style={{ position: 'absolute', left: X1, top: SHEET_TOP, opacity: s1.p * (1 - 0.6 * stepBack), transform: `translateY(${(1 - s1.p) * 46}px)` }}>
          <Sheet
            width={SHEET_W}
            height={SHEET_H}
            heading={WRONG_LABEL}
            headTone={policyCheck > 0.3 ? 'right' : 'plain'}
            check={policyCheck}
            lift={26 * s1.lift}
            scale={1 + 0.02 * s1.lift}
            glow={0.55 * policyPill * (1 - progress(frame, policyAt + 40, 30)) + 0.6 * lit1}
            glowTone={C.cyan}
          >
            <Typed
              text="La información del puerto sale solo por canales aprobados y según su clasificación, para protegerla."
              frame={frame}
              start={infoAt}
              end={protAt}
              size={30}
            />
            <div style={{ position: 'absolute', left: 0, bottom: 0 }}>
              <Signature draw={sign} label="dirección" />
            </div>
          </Sheet>
        </div>
      ) : null}
      {policyPill > 0.01 ? (
        <div style={{ position: 'absolute', left: X1, top: LABEL_TOP, opacity: 1 - 0.55 * stepBack, transform: `translateY(${(1 - policyPill) * 12}px) scale(${1 + 0.05 * lit1})`, transformOrigin: '0 50%' }}>
          <TermPill text="POLICY" size={40} on={Math.max(policyPill * 0.7, lit1)} />
        </div>
      ) : null}
      <div style={{ position: 'absolute', left: X1, top: ROW_TOP, display: 'flex', flexDirection: 'column', gap: 6, opacity: 1 - 0.55 * stepBack }}>
        <Gloss icon="target" tone={C.cyan} text="qué y por qué" on={pQue} />
        <Gloss icon="check" tone={C.emerald} text="obliga a todos" on={pObl} />
        <Gloss icon="unplug" tone={C.sky} text="sin tecnología" on={pTec} />
      </div>

      {/* Sheet 2 · standard */}
      {s2.p > 0.01 ? (
        <div style={{ position: 'absolute', left: X2, top: SHEET_TOP, opacity: s2.p * (1 - 0.6 * stepBack), transform: `translateY(${(1 - s2.p) * 46}px)` }}>
          <Sheet
            width={SHEET_W}
            height={SHEET_H}
            heading={WRONG_LABEL}
            headTone={strike > 0.3 ? 'wrong' : 'plain'}
            strike={strike}
            lift={26 * s2.lift}
            scale={1 + 0.02 * s2.lift}
            glow={0.55 * stdPill * (1 - progress(frame, standardAt + 40, 30)) + 0.6 * lit2}
            glowTone={C.cyan}
            headRight={
              <div style={{ opacity: progress(frame, segAt, 12) }}>
                <HeadChip icon="shield" text="Seguridad" />
              </div>
            }
          >
            <div style={{ lineHeight: 1.28 }}>
              <Typed text="Lo confidencial sale cifrado " frame={frame} start={confAt} end={cifAt + 10} size={30} />
              <span
                style={{
                  display: 'inline-block',
                  verticalAlign: 'baseline',
                  padding: '0 12px',
                  margin: '0 2px',
                  borderRadius: 10,
                  background: 'rgba(14, 116, 144, 0.16)',
                  border: '2px solid rgba(14, 116, 144, 0.7)',
                  fontFamily: FONT.mono,
                  fontSize: 26,
                  fontWeight: 800,
                  color: '#0e5a70',
                  opacity: aesIn,
                  transform: `translateY(${(1 - aesIn) * 6}px)`,
                }}
              >
                AES-256
              </span>
              <Typed
                text=", por la plataforma de intercambio aprobada, con enlaces que caducan a los 7 días."
                frame={frame}
                start={cifAt + 20}
                end={diasAt}
                size={30}
              />
            </div>
          </Sheet>
        </div>
      ) : null}
      {stdPill > 0.01 ? (
        <div style={{ position: 'absolute', left: X2, top: LABEL_TOP, opacity: 1 - 0.55 * stepBack, transform: `translateY(${(1 - stdPill) * 12}px) scale(${1 + 0.05 * lit2})`, transformOrigin: '0 50%' }}>
          <TermPill text="STANDARD" size={40} on={Math.max(stdPill * 0.7, lit2)} />
        </div>
      ) : null}
      <div style={{ position: 'absolute', left: X2, top: ROW_TOP, display: 'flex', flexDirection: 'column', gap: 6, opacity: 1 - 0.55 * stepBack }}>
        <Gloss icon="gear" tone={C.cyan} text="cuánto exactamente" on={sCuanto} />
        <Gloss icon="check" tone={C.emerald} text="obliga" on={sObl} />
        <Gloss icon="clock" tone={C.amber} text="caduca con la tecnología" on={sCad} />
      </div>

      {/* The pool */}
      {poolIn > 0.01 ? (
        <div style={{ position: 'absolute', left: WALL.x, top: WALL.y, opacity: poolIn, transform: `translateY(${(1 - poolIn) * 20}px)` }}>
          <PoolWall width={WALL.w} height={WALL.h} t={frame / 120}>
            <div style={{ position: 'absolute', left: (WALL.w - 4 - BANNER.w) / 2, top: 20, opacity: bannerIn, transform: `translateY(${(1 - bannerIn) * -14}px)` }}>
              <Banner />
            </div>
            <div style={{ position: 'absolute', left: (WALL.w - 4 - BANNER.w) / 2, top: 20 + BANNER.h + 8, width: BANNER.w, display: 'flex', gap: 14, justifyContent: 'center' }}>
              <Pill text="qué y por qué" tone={C.cyan} size={30} height={48} on={tagQue} style={{ opacity: tagQue }} />
              <Pill text="obliga" tone={C.emerald} icon="check" size={30} height={48} on={tagObl} style={{ opacity: tagObl }} />
            </div>
            <div style={{ position: 'absolute', left: (WALL.w - 4 - CAPSIGN.w) / 2, top: 20 + BANNER.h + 8 + 48 + 18, opacity: capIn, transform: `translateY(${(1 - capIn) * -14}px)` }}>
              <CapSign />
            </div>
            <div style={{ position: 'absolute', left: (WALL.w - 4 - BANNER.w) / 2, top: 20 + BANNER.h + 8 + 48 + 18 + CAPSIGN.h + 8, width: BANNER.w, display: 'flex', gap: 14, justifyContent: 'center' }}>
              <Pill text="cuánto" tone={C.cyan} size={30} height={48} on={tagCuanto} style={{ opacity: tagCuanto }} />
              <Pill text="obliga" tone={C.emerald} icon="check" size={30} height={48} on={tagObl} style={{ opacity: tagObl }} />
            </div>
            <div style={{ position: 'absolute', left: 0, top: WALL.h - 54 - 66, width: WALL.w - 4, display: 'flex', justifyContent: 'center' }}>
              <ImageTag size={26} style={{ background: alpha(C.ink950, 0.85) }} />
            </div>
          </PoolWall>
        </div>
      ) : null}
    </Stage>
  );
}


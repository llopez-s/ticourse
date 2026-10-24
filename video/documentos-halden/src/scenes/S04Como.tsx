import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { Icon, mix } from '../../../engine/src/ui';
import { STAMP_CASE, WRONG_LABEL } from '../data/canon';
import { CaseStamp, Gloss, ImageTag, Pill, TermPill } from './parts/Labels';
import { HeadChip, PAPER, Sheet, SheetGlyph, Typed } from './parts/Paper';
import { LIFEGUARD, LifeguardSheet, PhoneGlyph, PoolWall, SUNSIGN, SunSign } from './parts/Pool';
import { Stage, wordFrame } from './kit';

const S = 's04-como';

const SHEET_W = 500;
const SHEET_H = 352;
const SHEET_TOP = 100;
/** Final columns (with the pool) and the centred places the sheet and the card take before it comes in. */
const X1_END = 0;
const X2_END = 530;
const X1_ALONE = (1728 - SHEET_W) / 2;
const X1_PAIR = (1728 - (2 * SHEET_W + 30)) / 2;
const X2_PAIR = X1_PAIR + SHEET_W + 30;
const LABEL_TOP = 468;
const ROW_TOP = 544;

const WALL = { x: 1060, y: 92, w: 668, h: 566 } as const;
const STEPS = ['Clasifícalo', 'Súbelo a la plataforma', 'Manda el enlace', 'Comprueba que ha llegado'] as const;

function approach(frame: number, at: number) {
  const p = progress(frame, at - 6, 20);
  const lift = progress(frame, at, 14) * (1 - progress(frame, at + 60, 30, EASE.inOut));
  return { p, lift };
}

/**
 * s04-como «El cómo y el consejo». Same proposal stamp. On `sheet-3` Systems' sheet comes closer and its four steps
 * light on the voice's words (classify it, upload it to the platform, send the link, check it arrived); on `procedure`
 * its heading is struck, PROCEDURE lands with «cómo, paso a paso» and «obliga a quien lo hace». On `playbook` a card
 * hangs off the sheet — «un procedure para un caso concreto · ejemplo: ransomware» — and PLAYBOOK on its word; it
 * leaves before `sheet-4`, where the fourth sheet recommends a phone call (PhoneGlyph, no number) and on `guideline`
 * gets GUIDELINE with «un consejo», «no obliga» and «no seguirla no es incumplir» (the voice's words). On `pool-2` the pool wall
 * brings the lifeguard's sheet (PROCEDURE, playbook, obliga) and the sunscreen sign (GUIDELINE, no obliga).
 */
export function S04Como(props: SceneProps) {
  const frame = useCurrentFrame();
  const sheet3At = props.cue('sheet-3');
  const procAt = props.cue('procedure');
  const playAt = props.cue('playbook');
  const sheet4At = props.cue('sheet-4');
  const guideAt = props.cue('guideline');
  const pool2At = props.cue('pool-2');

  const stampIn = enter(frame, -6, { distance: 16, duration: 16 });

  // Centred while alone; the sheet glides left to make room for the card (and later its neighbour), then both go to the
  // pool's columns.
  const glideA = progress(frame, playAt - 34, 26, EASE.inOut);
  const glideB = progress(frame, pool2At - 24, 24, EASE.inOut);
  const X1 = mix(mix(X1_ALONE, X1_PAIR, glideA), X1_END, glideB);
  const X2 = mix(X2_PAIR, X2_END, glideB);

  // Sheet 3
  const s3 = approach(frame, sheet3At);
  const sisAt = Math.max(sheet3At + 6, wordFrame(S, 's04-01', 'Sistemas') - 4);
  const stepAt = [
    Math.max(sisAt + 20, wordFrame(S, 's04-01', 'clasificarlo') - 6),
    0,
    0,
    Math.max(sisAt + 80, wordFrame(S, 's04-01', 'comprobar') - 6),
  ];
  stepAt[1] = stepAt[0] + Math.round((stepAt[3] - stepAt[0]) / 3);
  stepAt[2] = stepAt[0] + Math.round(((stepAt[3] - stepAt[0]) * 2) / 3);
  const strike3 = progress(frame, procAt + 2, 14);
  const procPill = progress(frame, procAt, 12);
  const rComo = progress(frame, Math.max(procAt + 6, wordFrame(S, 's04-02', 'cómo') - 4), 12);
  const rObl = progress(frame, Math.max(procAt + 14, wordFrame(S, 's04-02', 'obliga') - 4), 12);

  // Playbook card (hangs off sheet 3, gone before sheet 4)
  const cardIn = progress(frame, playAt - 8, 16);
  const cardOut = progress(frame, sheet4At - 16, 14, EASE.inOut);
  const conAt = Math.max(playAt, wordFrame(S, 's04-03', 'concreto') - 6);
  const ranAt = Math.max(conAt + 10, wordFrame(S, 's04-03', 'ransomware') - 6);
  const pbAt = Math.max(ranAt + 10, wordFrame(S, 's04-03', 'playbook') - 6);
  const oblAt = Math.max(pbAt + 20, wordFrame(S, 's04-03', 'obliga') - 6);

  // Sheet 4
  const s4 = approach(frame, sheet4At);
  const recAt = Math.max(sheet4At + 6, wordFrame(S, 's04-04', 'recomienda') - 8);
  const recibeAt = Math.max(recAt + 40, wordFrame(S, 's04-04', 'recibe') + 6);
  const strike4 = progress(frame, guideAt + 2, 14);
  const guidePill = progress(frame, guideAt, 12);
  const gAcon = progress(frame, Math.max(guideAt + 6, wordFrame(S, 's04-04', 'aconseja') - 4), 12);
  const gNo = progress(frame, Math.max(guideAt + 14, wordFrame(S, 's04-04', 'obliga') - 4), 12);
  const gInc = progress(frame, Math.max(guideAt + 22, wordFrame(S, 's04-04', 'incumplir') - 14), 12);

  // The pool
  const poolIn = progress(frame, pool2At - 6, 18);
  const lifeAt = Math.max(pool2At + 4, wordFrame(S, 's04-05', 'socorrista') - 10);
  const pasoAt = Math.max(lifeAt + 12, wordFrame(S, 's04-05', 'paso') - 6);
  const oblPoolAt = Math.max(pasoAt + 20, wordFrame(S, 's04-05', 'obliga') - 6);
  const sunAt = Math.max(oblPoolAt + 20, wordFrame(S, 's04-05', 'crema') - 10);
  const aconAt = Math.max(sunAt + 14, wordFrame(S, 's04-05', 'aconseja') - 6);
  const lifeIn = progress(frame, lifeAt, 16);
  const sunIn = progress(frame, sunAt, 16);
  const tProc = progress(frame, pasoAt, 12);
  const tPb = progress(frame, pasoAt + 8, 12);
  const tObl = progress(frame, oblPoolAt, 12);
  const tGuide = progress(frame, aconAt, 12);
  const tNo = progress(frame, aconAt + 10, 12);
  const colDim = 0.5 * progress(frame, pool2At - 4, 14);

  return (
    <Stage>
      <div style={{ position: 'absolute', left: 0, top: 0, ...stampIn }}>
        <CaseStamp parts={[...STAMP_CASE]} size={30} />
      </div>

      {/* Sheet 3 · procedure */}
      {s3.p > 0.01 ? (
        <div style={{ position: 'absolute', left: X1, top: SHEET_TOP, opacity: s3.p * (1 - colDim), transform: `translateY(${(1 - s3.p) * 46}px)` }}>
          <Sheet
            width={SHEET_W}
            height={SHEET_H}
            heading={WRONG_LABEL}
            headTone={strike3 > 0.3 ? 'wrong' : 'plain'}
            strike={strike3}
            lift={26 * s3.lift}
            scale={1 + 0.02 * s3.lift}
            glow={0.55 * procPill * (1 - progress(frame, procAt + 40, 30))}
            glowTone={C.cyan}
            headRight={
              <div style={{ opacity: progress(frame, sisAt, 12) }}>
                <HeadChip icon="gear" text="Sistemas" />
              </div>
            }
          >
            <div style={{ fontFamily: FONT.sans, fontSize: 30, fontWeight: 800, lineHeight: 1.2, color: PAPER.ink, opacity: progress(frame, sisAt + 6, 12) }}>Cómo mandar un fichero a una naviera</div>
            <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 4 }}>
              {STEPS.map((t, i) => {
                const a = progress(frame, stepAt[i], 12);
                return (
                  <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 14, height: 38, opacity: 0.15 + 0.85 * a }}>
                    <div style={{ width: 34, height: 34, borderRadius: 17, background: PAPER.ink, color: '#ffffff', display: 'grid', placeItems: 'center', fontFamily: FONT.sans, fontSize: 22, fontWeight: 850 }}>{i + 1}</div>
                    <span style={{ fontFamily: FONT.sans, fontSize: 28, fontWeight: 700, color: PAPER.ink, whiteSpace: 'nowrap' }}>{t}</span>
                  </div>
                );
              })}
            </div>
          </Sheet>
        </div>
      ) : null}
      {procPill > 0.01 ? (
        <div style={{ position: 'absolute', left: X1, top: LABEL_TOP, opacity: 1 - colDim, transform: `translateY(${(1 - procPill) * 12}px)` }}>
          <TermPill text="PROCEDURE" size={40} on={procPill} />
        </div>
      ) : null}
      <div style={{ position: 'absolute', left: X1, top: ROW_TOP, display: 'flex', flexDirection: 'column', gap: 6, opacity: 1 - colDim }}>
        <Gloss icon="arrowDown" tone={C.cyan} text="cómo, paso a paso" on={rComo} />
        <Gloss icon="check" tone={C.emerald} text="obliga a quien lo hace" on={rObl} />
      </div>

      {/* The playbook card */}
      {cardIn * (1 - cardOut) > 0.01 ? (
        <div
          style={{
            position: 'absolute',
            left: X2,
            top: SHEET_TOP + 20,
            width: SHEET_W,
            height: 290,
            boxSizing: 'border-box',
            padding: '18px 26px',
            borderRadius: RADIUS.lg,
            border: `3px solid ${alpha(C.violet, 0.7)}`,
            background: `linear-gradient(180deg, ${alpha(C.violet, 0.1)} 0%, ${alpha(C.ink900, 0.95)} 70%)`,
            boxShadow: `0 0 30px ${alpha(C.violet, 0.16)}`,
            fontFamily: FONT.sans,
            opacity: cardIn * (1 - cardOut),
            transform: `translateX(${(1 - cardIn) * -30}px)`,
          }}
        >
          <div style={{ opacity: 0.25 + 0.75 * progress(frame, pbAt, 12) }}>
            <TermPill text="PLAYBOOK" size={40} on={progress(frame, pbAt, 12)} />
          </div>
          <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 16, opacity: 0.2 + 0.8 * progress(frame, conAt, 12) }}>
            <SheetGlyph width={46} />
            <div style={{ fontSize: 32, fontWeight: 800, lineHeight: 1.2, color: C.textStrong }}>
              <div>un procedure para</div>
              <div style={{ color: C.cyanSoft }}>un caso concreto</div>
            </div>
          </div>
          <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 12, fontSize: 30, fontWeight: 750, color: C.text, opacity: progress(frame, ranAt, 12) }}>
            <Icon name="lock" size={32} color={C.roseSoft} strokeWidth={2.2} />
            <span style={{ color: C.muted }}>ejemplo:</span> ransomware
          </div>
          <div style={{ marginTop: 12 }}>
            <Gloss icon="check" tone={C.emerald} text="sigue siendo procedure: obliga igual" on={progress(frame, oblAt, 12)} size={28} />
          </div>
        </div>
      ) : null}

      {/* Sheet 4 · guideline */}
      {s4.p > 0.01 ? (
        <div style={{ position: 'absolute', left: X2, top: SHEET_TOP, opacity: s4.p * (1 - colDim), transform: `translateY(${(1 - s4.p) * 46}px)` }}>
          <Sheet
            width={SHEET_W}
            height={SHEET_H}
            heading={WRONG_LABEL}
            headTone={strike4 > 0.3 ? 'wrong' : 'plain'}
            strike={strike4}
            lift={26 * s4.lift}
            scale={1 + 0.02 * s4.lift}
            glow={0.55 * guidePill * (1 - progress(frame, guideAt + 40, 30))}
            glowTone={C.cyan}
          >
            <Typed text="Te recomendamos avisar por teléfono a quien recibe de que le llega un enlace." frame={frame} start={recAt} end={recibeAt} size={30} />
            <div style={{ position: 'absolute', right: 6, bottom: 4, opacity: progress(frame, recibeAt - 10, 14) }}>
              <PhoneGlyph size={64} color={PAPER.soft} />
            </div>
          </Sheet>
        </div>
      ) : null}
      {guidePill > 0.01 ? (
        <div style={{ position: 'absolute', left: X2, top: LABEL_TOP, opacity: 1 - colDim, transform: `translateY(${(1 - guidePill) * 12}px)` }}>
          <TermPill text="GUIDELINE" size={40} on={guidePill} />
        </div>
      ) : null}
      <div style={{ position: 'absolute', left: X2, top: ROW_TOP, display: 'flex', flexDirection: 'column', gap: 6, opacity: 1 - colDim }}>
        <Gloss icon="brain" tone={C.sky} text="un consejo" on={gAcon} />
        <Gloss icon="x" tone={C.amber} text="no obliga" on={gNo} />
        <Gloss icon="unlock" tone={C.sky} text="no seguirla no es incumplir" on={gInc} size={30} />
      </div>

      {/* The pool */}
      {poolIn > 0.01 ? (
        <div style={{ position: 'absolute', left: WALL.x, top: WALL.y, opacity: poolIn, transform: `translateY(${(1 - poolIn) * 20}px)` }}>
          <PoolWall width={WALL.w} height={WALL.h} t={frame / 120}>
            <div style={{ position: 'absolute', left: (WALL.w - 4 - LIFEGUARD.w) / 2, top: 14, opacity: lifeIn, transform: `translateY(${(1 - lifeIn) * -14}px)` }}>
              <LifeguardSheet />
            </div>
            <div style={{ position: 'absolute', left: 0, top: 14 + LIFEGUARD.h + 8, width: WALL.w - 4, display: 'flex', gap: 12, justifyContent: 'center' }}>
              <TermPill text="PROCEDURE" size={28} on={tProc} style={{ opacity: tProc }} />
              <Pill text="playbook" tone={C.violet} size={28} height={45} on={tPb} style={{ opacity: tPb }} />
              <Gloss icon="check" tone={C.emerald} text="obliga" on={tObl} size={28} />
            </div>
            <div style={{ position: 'absolute', left: (WALL.w - 4 - SUNSIGN.w) / 2, top: 14 + LIFEGUARD.h + 8 + 46 + 12, opacity: sunIn, transform: `translateY(${(1 - sunIn) * -14}px)` }}>
              <SunSign />
            </div>
            <div style={{ position: 'absolute', left: 0, top: 14 + LIFEGUARD.h + 8 + 46 + 12 + SUNSIGN.h + 8, width: WALL.w - 4, display: 'flex', gap: 14, justifyContent: 'center' }}>
              <TermPill text="GUIDELINE" size={28} on={tGuide} style={{ opacity: tGuide }} />
              <Gloss icon="x" tone={C.amber} text="solo aconseja" on={tNo} size={28} />
            </div>
            <div style={{ position: 'absolute', left: 0, top: WALL.h - 54 - 6, width: WALL.w - 4, display: 'flex', justifyContent: 'center', transform: 'translateY(0px)' }}>
              <ImageTag size={26} style={{ background: alpha(C.ink950, 0.85) }} />
            </div>
          </PoolWall>
        </div>
      ) : null}
    </Stage>
  );
}

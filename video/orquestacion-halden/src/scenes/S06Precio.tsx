import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../engine/src/theme/motion';
import { Icon } from '../../../engine/src/ui';
import { ACCOUNT, COMPLEXITY, COMPLEX_CAPTION, DEBT, DEBT_TAG, PLATFORM, PRIVILEGED, SPOF, STEPS, SUPPORT, TOUCHES, WHO } from '../data/s06-precio';
import { AVENUE, Avenue, avenueLight } from './parts/Avenue';
import { Arrow } from './parts/Flow';
import { ImageTag, Pill, TermPill } from './parts/Labels';
import { TrafficLight } from './parts/TrafficLight';
import { ToolGlyph } from './parts/Tools';
import { Stage, wordFrame } from './kit';

const S = 's06-precio';
const W = 1728;

// ---- Phase 1: the platform in the centre, the avenue's two faces either side.
const SIDE_W = 520;
const AV_H = (SIDE_W * AVENUE.h) / AVENUE.w;
const AV_Y = 20;
const LEFT_X = 0;
const RIGHT_X = W - SIDE_W;
const TERM_Y = AV_Y + AV_H + 22;
const BOX = { x: 590, y: 0, w: 548, h: 392 };
const STEP_Y = 82;
const STEP_H = 58;
const STEP_GAP = 10;
const ACC_Y = 290;
const TILE = 84;
const TILE_Y = 448;
const TILE_GAP = (BOX.w - 4 * TILE) / 3;
const TAG_Y = 596;

// ---- Phase 2: the two cards.
const CARD_W = 830;
const CARD_H = 470;
const CARD_GAP = W - 2 * CARD_W;
const CARD_TERM_Y = CARD_H + 16;
const SUPPORT_Y = 584;
const N40 = 40;
/** The forty-light avenue inside its card. */
const AVW = 620;
const AVW_H = (AVW * AVENUE.h) / AVENUE.w;

/**
 * s06-precio «Toda la avenida en una central». On `one-box` the flow's three steps gather into one box, «plataforma
 * de orquestación». On `central-down` the avenue comes back on the left with its central switched off: every light
 * red, the cars bunched; on `grey` the box's steps go grey one by one on their words: «no se abre el caso · no se
 * avisa a nadie · no se corta nada». On `central-taken` the avenue on the right: someone inside the central (rose),
 * every light green; in the box the steps come back and «cuenta de la plataforma» sends arrows to every tool it touches
 * (icons only: no permissions, vault or keys). On `spof` each face gets its name: «Single point of failure» under the
 * switched-off central (exam term, violet), «objetivo privilegiado» under the taken one (a Spanish label, neutral). On `two-cards` two cards: the forty-light avenue,
 * well kept — on «atasca» a knot of reds, on «entenderla» a sweep across all of it — named «Complexity»; the one
 * street light with its tag «lo programó alguien que ya no trabaja aquí · sin planos · sin dueño», named «Technical
 * debt». On `support`, «Ongoing supportability» with «¿quién lo va a mantener?».
 */
export function S06Precio(props: SceneProps) {
  const frame = useCurrentFrame();
  const boxAt = props.cue('one-box');
  const downAt = props.cue('central-down');
  const greyAt = props.cue('grey');
  const takenAt = props.cue('central-taken');
  const spofAt = props.cue('spof');
  const cardsAt = props.cue('two-cards');
  const complexAt = props.cue('complexity');
  const debtAt = props.cue('debt');
  const supportAt = props.cue('support');
  const greyWord = STEPS.map((s) => Math.max(greyAt, wordFrame(S, 's06-02', s.word) - 6));
  const accountAt = wordFrame(S, 's06-03', 'cuenta') - 6;
  const spofWord = Math.max(spofAt, wordFrame(S, 's06-04', 'single') - 6);
  const privWord = wordFrame(S, 's06-04', 'privilegiado') - 6;
  const jamWord = wordFrame(S, 's06-05', 'atasca') - 4;
  const sweepWord = wordFrame(S, 's06-05', 'entenderla') - 4;
  const complexWord = Math.max(complexAt, wordFrame(S, 's06-05', 'complexity') - 6);
  const debtWord = wordFrame(S, 's06-06', 'debt') - 6;

  // ---- Phase 1
  const p1Out = progress(frame, cardsAt - 10, 16, EASE.inOut);
  const boxIn = progress(frame, boxAt - 4, 16);
  const stepIn = STEPS.map((_, i) => progress(frame, boxAt + 6 + i * 8, 14));
  const restore = progress(frame, takenAt - 2, 14);
  const grey = greyWord.map((at) => progress(frame, at, 12) * (1 - restore));
  const accIn = progress(frame, accountAt, 14);
  const tileDraw = TOUCHES.map((_, i) => progress(frame, accountAt + 14 + i * 7, 12));

  const downIn = progress(frame, downAt - 4, 16);
  const off = progress(frame, downAt + 10, 16);
  const jam = progress(frame, downAt + 10, 36, EASE.inOut);
  const takenIn = progress(frame, takenAt - 4, 16);
  const taken = progress(frame, takenAt + 14, 16);
  const allGreen = progress(frame, takenAt + 20, 10);
  const leftFocus = 1 - 0.4 * progress(frame, takenAt, 14) * (1 - progress(frame, spofWord - 4, 12));
  const rightFocus = 1 - 0.4 * progress(frame, spofWord - 4, 12) * (1 - progress(frame, privWord - 4, 12));
  const spofIn = progress(frame, spofWord, 12);
  const privIn = progress(frame, privWord, 12);

  // ---- Phase 2
  const cardsIn = progress(frame, cardsAt - 2, 16);
  const debtIn = progress(frame, cardsAt + 6, 16);
  const debtLit = progress(frame, debtAt - 4, 16);
  const knot = progress(frame, jamWord, 12);
  const sweep = progress(frame, sweepWord, 50, EASE.inOut);
  const sweepOn = frame >= sweepWord && frame < sweepWord + 60 ? 1 - progress(frame, sweepWord + 46, 12) : 0;
  const complexIn = progress(frame, complexWord, 12);
  const debtTermIn = progress(frame, debtWord, 12);
  const supportIn = progress(frame, supportAt - 2, 14);
  const leftCardFocus = 1 - 0.4 * progress(frame, debtAt - 6, 14);
  const knotSet = new Set([17, 18, 19, 20, 21]);
  const sweepX = sweep * AVENUE.w;
  const green40 = (i: number) => {
    if (knotSet.has(i)) return 1 - knot;
    return 1;
  };

  const tileX = (i: number) => BOX.x + i * (TILE + TILE_GAP);
  const accCentre = { x: BOX.x + BOX.w / 2, y: ACC_Y + 56 };

  return (
    <Stage>
      <div style={{ position: 'absolute', inset: 0, fontFamily: FONT.sans }}>
        {/* ---------- Phase 1 ---------- */}
        {p1Out < 0.99 ? (
          <div style={{ position: 'absolute', inset: 0, opacity: 1 - p1Out }}>
            {/* the platform */}
            <div
              style={{
                position: 'absolute',
                left: BOX.x,
                top: BOX.y,
                width: BOX.w,
                height: BOX.h,
                boxSizing: 'border-box',
                borderRadius: RADIUS.lg,
                border: `3px solid ${alpha(C.cyan, 0.8)}`,
                background: alpha(C.cyan, 0.05),
                boxShadow: `0 0 30px ${alpha(C.cyan, 0.18)}`,
                opacity: boxIn,
                transform: `scale(${0.96 + 0.04 * boxIn})`,
              }}
            >
              <div style={{ height: 64, display: 'flex', alignItems: 'center', gap: 12, padding: '0 20px', fontSize: 34, fontWeight: 850, color: C.textStrong, whiteSpace: 'nowrap' }}>
                <Icon name="layers" size={36} color={C.cyan} />
                {PLATFORM}
              </div>
              {STEPS.map((s, i) => {
                const g = grey[i];
                return (
                  <div
                    key={s.on}
                    style={{
                      position: 'absolute',
                      left: 20,
                      right: 20,
                      top: STEP_Y + i * (STEP_H + STEP_GAP),
                      height: STEP_H,
                      boxSizing: 'border-box',
                      borderRadius: 12,
                      border: `2px solid ${g > 0.5 ? alpha(C.faint, 0.6) : alpha(C.cyan, 0.6)}`,
                      background: g > 0.5 ? alpha(C.ink800, 0.95) : alpha(C.cyan, 0.08),
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '0 16px',
                      fontSize: 32,
                      fontWeight: 750,
                      color: g > 0.5 ? C.muted : C.textStrong,
                      whiteSpace: 'nowrap',
                      opacity: stepIn[i],
                      transform: `translateX(${(1 - stepIn[i]) * (i % 2 ? 30 : -30)}px)`,
                    }}
                  >
                    <Icon name={s.icon} size={32} color={g > 0.5 ? C.faint : C.cyan} />
                    {g > 0.5 ? s.off : s.on}
                  </div>
                );
              })}
              {accIn > 0.01 ? (
                <div style={{ position: 'absolute', left: 0, right: 0, top: ACC_Y, display: 'flex', justifyContent: 'center', opacity: accIn }}>
                  <Pill text={ACCOUNT} icon="user" tone={C.rose} size={32} height={56} on={0.8} />
                </div>
              ) : null}
            </div>

            {/* the arrows to every tool it touches */}
            <svg width={W} height={660} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
              {TOUCHES.map((_, i) => (
                <Arrow key={i} points={[[accCentre.x, accCentre.y], [tileX(i) + TILE / 2, TILE_Y - 6]]} draw={tileDraw[i]} color={C.rose} width={4} />
              ))}
            </svg>
            {TOUCHES.map((t, i) =>
              tileDraw[i] > 0.01 ? (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    left: tileX(i),
                    top: TILE_Y,
                    width: TILE,
                    height: TILE,
                    boxSizing: 'border-box',
                    borderRadius: 16,
                    border: `2px solid ${alpha(C.sky, 0.7)}`,
                    background: C.ink850,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: progress(frame, accountAt + 22 + i * 7, 10),
                  }}
                >
                  <ToolGlyph icon={t} size={44} color={C.sky} />
                </div>
              ) : null,
            )}

            {/* face 1: the central switched off */}
            {downIn > 0.01 ? (
              <div style={{ position: 'absolute', left: LEFT_X, top: AV_Y, opacity: downIn * leftFocus }}>
                <Avenue width={SIDE_W} green={() => 0} frame={frame} off={off} jam={jam} />
              </div>
            ) : null}
            {spofIn > 0.01 ? (
              <div style={{ position: 'absolute', left: LEFT_X, top: TERM_Y, opacity: spofIn, transform: `translateY(${(1 - spofIn) * 12}px)` }}>
                <TermPill text={SPOF} on={spofIn * (1 - 0.4 * privIn)} size={34} />
              </div>
            ) : null}

            {/* face 2: the central taken */}
            {takenIn > 0.01 ? (
              <div style={{ position: 'absolute', left: RIGHT_X, top: AV_Y, opacity: takenIn * rightFocus }}>
                <Avenue width={SIDE_W} green={() => allGreen} frame={frame} taken={taken} />
              </div>
            ) : null}
            {privIn > 0.01 ? (
              <div style={{ position: 'absolute', left: RIGHT_X, top: TERM_Y, opacity: privIn, transform: `translateY(${(1 - privIn) * 12}px)` }}>
                <Pill text={PRIVILEGED} icon="target" tone={C.cyan} size={34} height={58} on={0.6 * privIn} />
              </div>
            ) : null}
            {downIn > 0.01 ? (
              <div style={{ position: 'absolute', left: 0, top: TAG_Y, width: W, display: 'flex', justifyContent: 'center', opacity: downIn }}>
                <ImageTag />
              </div>
            ) : null}
          </div>
        ) : null}

        {/* ---------- Phase 2: the two cards ---------- */}
        {cardsIn > 0.01 ? (
          <div style={{ position: 'absolute', inset: 0, opacity: cardsIn }}>
            {/* complexity: the forty-light avenue */}
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: CARD_W,
                height: CARD_H,
                boxSizing: 'border-box',
                borderRadius: RADIUS.lg,
                border: `2px solid ${alpha(C.cyan, 0.3 + 0.5 * complexIn * leftCardFocus)}`,
                background: C.ink850,
                padding: 20,
                opacity: leftCardFocus,
                transform: `translateY(${(1 - cardsIn) * 16}px)`,
              }}
            >
              <div style={{ position: 'relative', width: AVW, height: AVW_H, marginLeft: (CARD_W - 40 - AVW) / 2 }}>
                <Avenue width={AVW} n={N40} green={green40} frame={frame} cars={false} />
                {sweepOn > 0.01 ? (
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      bottom: 0,
                      left: `${(sweepX / AVENUE.w) * 100}%`,
                      width: 60,
                      marginLeft: -30,
                      background: `linear-gradient(90deg, transparent, ${alpha(C.cyan, 0.35)}, transparent)`,
                      opacity: sweepOn,
                    }}
                  />
                ) : null}
                {knot > 0.01 ? (
                  <div
                    style={{
                      position: 'absolute',
                      left: `${((avenueLight(19, N40).x - 46) / AVENUE.w) * 100}%`,
                      top: `${((avenueLight(19, N40).y - 46) / AVENUE.h) * 100}%`,
                      width: (92 / AVENUE.w) * AVW,
                      height: (92 / AVENUE.h) * AVW_H,
                      borderRadius: 999,
                      border: `3px dashed ${alpha(C.rose, 0.8)}`,
                      opacity: knot,
                    }}
                  />
                ) : null}
              </div>
              <div style={{ marginTop: 8, fontSize: 32, fontWeight: 750, color: C.text, whiteSpace: 'nowrap' }}>{COMPLEX_CAPTION}</div>
            </div>

            {/* technical debt: one street light nobody owns */}
            {debtIn > 0.01 ? (
              <div
                style={{
                  position: 'absolute',
                  left: CARD_W + CARD_GAP,
                  top: 0,
                  width: CARD_W,
                  height: CARD_H,
                  boxSizing: 'border-box',
                  borderRadius: RADIUS.lg,
                  border: `2px solid ${alpha(C.muted, 0.3 + 0.4 * debtTermIn)}`,
                  filter: debtLit < 0.99 ? `saturate(${0.4 + 0.6 * debtLit})` : undefined,
                  background: C.ink850,
                  opacity: debtIn,
                  transform: `translateY(${(1 - debtIn) * 16}px)`,
                  overflow: 'hidden',
                }}
              >
                {/* a side street */}
                <div style={{ position: 'absolute', left: 0, right: 0, top: 360, height: 70, background: C.ink700 }} />
                <div style={{ position: 'absolute', left: 30, right: 30, top: 394, height: 0, borderTop: `3px dashed ${alpha(C.text, 0.25)}` }} />
                <div style={{ position: 'absolute', left: 70, top: 40 }}>
                  <TrafficLight width={104} green={0.2 + 0.4 * debtLit} housing={C.ink800} stroke={alpha(C.muted, 0.35)} />
                </div>
                {/* the tag tied to the pole */}
                <div
                  style={{
                    position: 'absolute',
                    left: 230,
                    top: 70,
                    width: 560,
                    boxSizing: 'border-box',
                    padding: '18px 24px',
                    borderRadius: 12,
                    background: '#e7dcc4',
                    opacity: debtLit,
                    color: C.ink900,
                    transform: 'rotate(-2deg)',
                    boxShadow: `0 10px 26px ${alpha('#000000', 0.45)}`,
                    fontSize: 34,
                    fontWeight: 750,
                    lineHeight: 1.25,
                  }}
                >
                  {DEBT_TAG.map((l, k) => (
                    <div key={k} style={{ whiteSpace: 'nowrap', opacity: progress(frame, debtAt + 4 + k * 10, 12) }}>
                      {l}
                    </div>
                  ))}
                </div>
                <svg width={CARD_W} height={CARD_H} style={{ position: 'absolute', left: 0, top: 0, opacity: debtLit }}>
                  <path d="M 174 120 Q 200 110 232 104" fill="none" stroke={alpha(C.text, 0.5)} strokeWidth={3} />
                </svg>
              </div>
            ) : null}

            {complexIn > 0.01 ? (
              <div style={{ position: 'absolute', left: 0, top: CARD_TERM_Y, opacity: complexIn, transform: `translateY(${(1 - complexIn) * 12}px)` }}>
                <TermPill text={COMPLEXITY} on={complexIn * leftCardFocus} size={36} />
              </div>
            ) : null}
            {debtTermIn > 0.01 ? (
              <div style={{ position: 'absolute', left: CARD_W + CARD_GAP, top: CARD_TERM_Y, opacity: debtTermIn, transform: `translateY(${(1 - debtTermIn) * 12}px)` }}>
                <TermPill text={DEBT} on={debtTermIn * (1 - 0.4 * supportIn)} size={36} />
              </div>
            ) : null}
            {supportIn > 0.01 ? (
              <div style={{ position: 'absolute', left: 0, top: SUPPORT_Y, width: W, display: 'flex', justifyContent: 'center', gap: 20, opacity: supportIn, transform: `translateY(${(1 - supportIn) * 12}px)` }}>
                <TermPill text={SUPPORT} on={supportIn} size={36} />
                <Pill text={WHO} icon="user" tone={C.cyan} size={34} height={58} on={0.6} />
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </Stage>
  );
}

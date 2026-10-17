import type { CSSProperties, ReactNode } from 'react';
import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { EASE, progress, springIn } from '../../../engine/src/theme/motion';
import { Icon, dimStyle, mix } from '../../../engine/src/ui';
import { DEPOT, LINE_LEFT, LINE_RIGHT, LOCK_TAG, MORNING, NIGHT, RULE } from '../data/s04-camara';
import { ControlTag } from './parts/ControlTag';
import { LOCK_RATIO, LOCK_TIE, Lock } from './parts/Lock';
import { DEPOT_GROUND, DEPOT_H, DEPOT_LENS, DEPOT_W, DepotEntrance, Figure, Playback } from './parts/s04-camara/Depot';
import { Stage, wordFrame } from './kit';

const S = 's04-camara';

// ---- Phase A (`both`): the lock and its tag, centred.
const LOCK_A = { x: 470, y: 118, w: 230 } as const;
const TAG_A_W = 560;
const TAG_A_S = TAG_A_W / 420;
const TIE_A = { x: LOCK_A.x + LOCK_A.w * LOCK_TIE.x, y: LOCK_A.y + LOCK_A.w * LOCK_RATIO * LOCK_TIE.y };

// ---- Phase B (`depot` → `scenario`): the panorama, then two vignettes.
const PANO = { x: 110, y: 40, w: 720 } as const;
const PANEL_W = 840;
const PANEL_H = 500;
const PANEL_GAP = 48;
const PANEL_TOP = 20;
const PIC = { dx: 16, y: PANEL_TOP + 104, w: 440 } as const;
const PIC_H = (PIC.w * DEPOT_H) / DEPOT_W;
const TAG_V = { dx: 474, w: 350 } as const;
/** The compact tag is ~0.69 × its width tall: centre it on the picture. */
const TAG_V_TOP = PIC.y + (PIC_H - TAG_V.w * 0.69) / 2;
const NIGHT_CENTER_X = (1728 - PANEL_W) / 2;
const RULE_TOP = 562;
/** The morning playback frame, in the picture's bottom-left corner (clear of the camera). */
const PLAY_W = 206;

// ---- Phase C (`line`): camera | lock, below the top-centre (the exam card lands as it begins).
const C_TOP = 236;
const DIVIDER_X = 864;
const COL_W = 820;
const RIGHT_X = 908;
const C_PIC = { x: 240, y: 302, w: 340 } as const;
const DOOR = { x: RIGHT_X + 330, y: 300, w: 196, h: 266 } as const;
const LOCK_C = { x: DOOR.x + 66, y: DOOR.y + 50, w: 100 } as const;
const C_CAPTION = 592;

/**
 * s04-camara «La cámara del depósito». On `both` the lock from s01 comes back with its two-box tag, which fills
 * «Physical» (top) and then «Preventive» (bottom) on the words. On `depot` the entrance of the empty-container
 * depot, with its camera on a post, fills the left of the stage with its label. On `night` the picture shrinks into
 * the night vignette: a figure walks up, sees the camera (sight line), turns back; the vignette's tag gets
 * «Deterrent». On `morning` the night vignette slides left and the morning one enters: the same entrance by day and,
 * in its sky, a playback frame where last night's figure comes and goes; its tag gets «Detective». On `scenario`
 * both cameras glow and the rule lands at the bottom. On `line` the vignettes give way to camera | lock split by a
 * dividing line, all below the stage's top-centre: the figure walking away from the camera («depende de que decida
 * parar») and the same lock on a door that holds while the figure pushes («la para aunque insista»).
 */
export function S04Camara(props: SceneProps) {
  const frame = useCurrentFrame();
  const depotAt = props.cue('depot');
  const nightAt = props.cue('night');
  const morningAt = props.cue('morning');
  const scenarioAt = props.cue('scenario');
  const lineAt = props.cue('line');

  // ---- Phase A.
  const physicalAt = wordFrame(S, 's04-01', 'physical') - 4;
  const preventiveAt = wordFrame(S, 's04-01', 'preventive') - 4;
  const aOut = progress(frame, depotAt - 8, 14, EASE.inOut);
  const lockGlow = progress(frame, preventiveAt, 16) * (1 - aOut);

  // ---- Phase B.
  const panoIn = progress(frame, depotAt - 2, 16);
  const labelIn = progress(frame, depotAt + 10, 16) * (1 - progress(frame, nightAt - 8, 10));
  const toNight = progress(frame, nightAt - 6, 24, EASE.inOut);
  const toLeft = progress(frame, morningAt - 6, 24, EASE.inOut);
  const nightMode = progress(frame, nightAt - 2, 20);
  const panelIn = progress(frame, nightAt + 12, 14);
  const morningIn = progress(frame, morningAt + 2, 18);
  const rulesIn = progress(frame, scenarioAt - 2, 16);
  const camGlow = progress(frame, scenarioAt, 14);
  const bOut = progress(frame, lineAt - 8, 14, EASE.inOut);

  const nightPanelX = mix(NIGHT_CENTER_X, 0, toLeft);
  const picX = mix(PANO.x, nightPanelX + PIC.dx, toNight);
  const picY = mix(PANO.y, PIC.y, toNight);
  const picW = mix(PANO.w, PIC.w, toNight);

  // The night figure: walks up on «acerca», stops and looks on «ve», turns back on «vuelta».
  const approachAt = wordFrame(S, 's04-02', 'acerca') - 10;
  const seeAt = wordFrame(S, 's04-02', 've') - 2;
  const turnAt = wordFrame(S, 's04-02', 'vuelta') - 8;
  const nightFig = nightFigure(frame, approachAt, seeAt, turnAt);
  const sight = progress(frame, seeAt, 10) * (1 - progress(frame, turnAt + 6, 12));
  const turnArrow = progress(frame, turnAt, 14) * (1 - progress(frame, turnAt + 60, 14));
  const deterrentAt = wordFrame(S, 's04-02', 'deterrent') - 4;

  // The morning playback: runs once from «grabación».
  const playAt = wordFrame(S, 's04-03', 'grabación') - 6;
  const playIn = progress(frame, playAt, 14);
  const playT = progress(frame, playAt + 6, 78, EASE.linear);
  const detectiveAt = wordFrame(S, 's04-03', 'detective') - 4;

  // ---- Phase C.
  const cIn = progress(frame, lineAt + 2, 16);
  const leftHeadIn = progress(frame, wordFrame(S, 's04-04', 'disuadir') - 4, 12);
  const rightHeadIn = progress(frame, wordFrame(S, 's04-04', 'impedir') - 4, 12);
  const cameraWord = wordFrame(S, 's04-04', 'cámara') - 4;
  const lockWord = wordFrame(S, 's04-04', 'cerradura') - 4;
  const insistAt = wordFrame(S, 's04-04', 'insista') - 6;
  const leftCapIn = progress(frame, cameraWord, 14);
  const rightCapIn = progress(frame, lockWord, 14);
  const rightDim = progress(frame, cameraWord, 12) * (1 - progress(frame, lockWord, 12));
  const leftDim = 0.55 * progress(frame, lockWord, 12);
  const walkAway = progress(frame, cameraWord + 20, 60, EASE.inOut);
  const push = progress(frame, insistAt, 10, EASE.out) * (1 - progress(frame, insistAt + 22, 14, EASE.inOut));
  const holds = springIn(frame, 30, insistAt + 8, { damping: 14 });

  // ---- The one lock: centred with its tag in phase A, on the door in phase C.
  const inC = frame >= (depotAt + lineAt) / 2;
  const lockBox = inC ? LOCK_C : LOCK_A;
  const lockOpacity = inC ? cIn : 1 - aOut;

  const phaseB = panoIn > 0.01 && bOut < 0.99;

  return (
    <Stage>
      {/* ===== Phase A: the lock's tag, completed ===== */}
      {aOut < 0.99 ? (
        <div style={{ position: 'absolute', left: TIE_A.x, top: TIE_A.y - 26 * TAG_A_S, opacity: 1 - aOut, transform: `translateX(${-40 * aOut}px)` }}>
          <ControlTag frame={frame} width={TAG_A_W} top={LOCK_TAG.top} topAt={physicalAt} bottom={LOCK_TAG.bottom} bottomAt={preventiveAt} />
        </div>
      ) : null}

      {/* ===== Phase B: the depot ===== */}
      {phaseB ? (
        <div style={{ position: 'absolute', inset: 0, opacity: 1 - bOut }}>
          {/* the vignette cards (behind the pictures) */}
          <Panel x={nightPanelX} show={panelIn}>
            <Caption when={NIGHT.when} what={NIGHT.what} tone={C.cyanSoft} />
          </Panel>
          {morningIn > 0.01 ? (
            <Panel x={PANEL_W + PANEL_GAP + (1 - morningIn) * 60} show={morningIn}>
              <Caption when={MORNING.when} what={MORNING.what} tone={C.cyanSoft} />
            </Panel>
          ) : null}

          {/* the panorama that becomes the night picture */}
          <div
            style={{
              position: 'absolute',
              left: picX,
              top: picY,
              width: picW,
              height: (picW * DEPOT_H) / DEPOT_W,
              borderRadius: mix(RADIUS.lg, RADIUS.md, toNight),
              overflow: 'hidden',
              opacity: panoIn,
              boxShadow: `0 16px 44px ${alpha('#000000', 0.45)}`,
              border: `2px solid ${alpha(C.text, 0.18)}`,
            }}
          >
            <Layered
              bottom={<DepotEntrance width={picW} mode="day" cameraGlow={camGlow} />}
              top={
                <DepotEntrance width={picW} mode="night" cameraGlow={camGlow}>
                  {sight > 0.01 ? (
                    <line
                      x1={nightFig.x + (nightFig.facing === 'left' ? -10 : 10)}
                      y1={DEPOT_GROUND - 124}
                      x2={DEPOT_LENS.x}
                      y2={DEPOT_LENS.y}
                      stroke={C.amber}
                      strokeWidth={4}
                      strokeDasharray="10 9"
                      strokeLinecap="round"
                      opacity={0.9 * sight}
                    />
                  ) : null}
                  <Figure x={nightFig.x} facing={nightFig.facing} walk={nightFig.walk} />
                  {turnArrow > 0.01 ? <TurnArrow x={nightFig.x} show={turnArrow} /> : null}
                </DepotEntrance>
              }
              mix={nightMode}
            />
          </div>

          {/* the panorama's label, with a leader to the camera */}
          {labelIn > 0.01 ? (
            <div style={{ position: 'absolute', inset: 0, opacity: labelIn }}>
              <svg width={1728} height={660} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
                <line
                  x1={PANO.x + (DEPOT_LENS.x / DEPOT_W) * PANO.w + 22}
                  y1={PANO.y + (DEPOT_LENS.y / DEPOT_H) * ((PANO.w * DEPOT_H) / DEPOT_W)}
                  x2={PANO.x + (DEPOT_LENS.x / DEPOT_W) * PANO.w + 22 + (880 - 22 - (PANO.x + (DEPOT_LENS.x / DEPOT_W) * PANO.w)) * labelIn}
                  y2={PANO.y + (DEPOT_LENS.y / DEPOT_H) * ((PANO.w * DEPOT_H) / DEPOT_W)}
                  stroke={alpha(C.cyanSoft, 0.8)}
                  strokeWidth={3}
                  strokeDasharray="10 8"
                />
                <circle cx={PANO.x + (DEPOT_LENS.x / DEPOT_W) * PANO.w + 22} cy={PANO.y + (DEPOT_LENS.y / DEPOT_H) * ((PANO.w * DEPOT_H) / DEPOT_W)} r={7} fill={C.cyanSoft} />
              </svg>
              <div style={{ position: 'absolute', left: 900, top: 214, width: 800, fontFamily: FONT.sans }}>
                <div style={{ fontSize: 50, fontWeight: 850, color: C.textStrong, letterSpacing: -0.5, lineHeight: 1.1 }}>{DEPOT.title}</div>
                <div style={{ fontSize: 36, fontWeight: 600, color: C.cyanSoft, marginTop: 14, lineHeight: 1.2 }}>{DEPOT.sub}</div>
              </div>
            </div>
          ) : null}

          {/* the morning picture: the same entrance by day, last night on playback in its sky */}
          {morningIn > 0.01 ? (
            <div
              style={{
                position: 'absolute',
                left: PANEL_W + PANEL_GAP + PIC.dx + (1 - morningIn) * 60,
                top: PIC.y,
                width: PIC.w,
                height: PIC_H,
                borderRadius: RADIUS.md,
                overflow: 'hidden',
                opacity: morningIn,
                border: `2px solid ${alpha(C.text, 0.18)}`,
              }}
            >
              <DepotEntrance width={PIC.w} mode="day" cameraGlow={camGlow} />
              {playIn > 0.01 ? (
                <div style={{ position: 'absolute', left: 10, top: PIC_H - PLAY_W * 0.66 - 10, opacity: playIn, transform: `scale(${0.9 + 0.1 * playIn})`, transformOrigin: 'left bottom' }}>
                  <Playback width={PLAY_W} t={playT} />
                </div>
              ) : null}
            </div>
          ) : null}

          {/* the vignettes' tags: bottom box only */}
          {panelIn > 0.01 ? (
            <div style={{ position: 'absolute', left: nightPanelX + TAG_V.dx, top: TAG_V_TOP, opacity: panelIn }}>
              <ControlTag frame={frame} width={TAG_V.w} hole={false} bottom={NIGHT.type} bottomAt={deterrentAt} />
            </div>
          ) : null}
          {morningIn > 0.01 ? (
            <div style={{ position: 'absolute', left: PANEL_W + PANEL_GAP + TAG_V.dx + (1 - morningIn) * 60, top: TAG_V_TOP, opacity: morningIn }}>
              <ControlTag frame={frame} width={TAG_V.w} hole={false} bottom={MORNING.type} bottomAt={detectiveAt} />
            </div>
          ) : null}

          {/* the rule, at the bottom */}
          {rulesIn > 0.01 ? (
            <div
              style={{
                position: 'absolute',
                left: 0,
                width: 1728,
                top: RULE_TOP,
                display: 'flex',
                justifyContent: 'center',
                opacity: rulesIn,
                transform: `translateY(${(1 - rulesIn) * 14}px)`,
              }}
            >
              <div
                style={{
                  padding: '14px 34px',
                  borderRadius: RADIUS.md,
                  borderLeft: `6px solid ${C.violet}`,
                  background: alpha(C.violetDeep, 0.55),
                  fontFamily: FONT.sans,
                  fontSize: 46,
                  fontWeight: 750,
                  color: C.textStrong,
                  whiteSpace: 'nowrap',
                }}
              >
                {RULE.lead}
                <span style={{ color: '#c4b5fd' }}>{RULE.key}</span>
                {RULE.rest}
              </div>
            </div>
          ) : null}
        </div>
      ) : null}

      {/* ===== Phase C: deterring vs preventing ===== */}
      {cIn > 0.01 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: cIn }}>
          {/* the dividing line */}
          <div style={{ position: 'absolute', left: DIVIDER_X - 2, top: C_TOP, width: 4, height: 660 - C_TOP - 6, borderRadius: 2, background: alpha(C.muted, 0.45) }} />

          {/* left: the camera only works if the person decides to stop */}
          <div style={{ position: 'absolute', left: 0, top: 0, width: COL_W, height: 660, ...dimStyle(leftDim) }}>
            <Heading verb={LINE_LEFT.verb} term={LINE_LEFT.term} show={leftHeadIn} />
            <div style={{ position: 'absolute', left: C_PIC.x, top: C_PIC.y, width: C_PIC.w, height: (C_PIC.w * DEPOT_H) / DEPOT_W, borderRadius: RADIUS.md, overflow: 'hidden', border: `2px solid ${alpha(C.text, 0.18)}` }}>
              <DepotEntrance width={C_PIC.w} mode="night">
                <Figure x={470 + 90 * walkAway} facing="right" walk={walkAway > 0.001 && walkAway < 0.999 ? walkAway * 3 : 0} />
              </DepotEntrance>
            </div>
            <ColCaption text={LINE_LEFT.text} show={leftCapIn} />
          </div>

          {/* right: the lock holds even if they insist */}
          <div style={{ position: 'absolute', left: RIGHT_X, top: 0, width: COL_W, height: 660, ...dimStyle(rightDim * 0.6) }}>
            <Heading verb={LINE_RIGHT.verb} term={LINE_RIGHT.term} show={rightHeadIn} />
            <ColCaption text={LINE_RIGHT.text} show={rightCapIn} />
          </div>
          <div style={{ position: 'absolute', left: DOOR.x, top: DOOR.y, width: DOOR.w, height: DOOR.h, borderRadius: 10, background: C.ink800, border: `4px solid ${alpha(C.text, 0.3)}`, boxSizing: 'border-box', ...dimStyle(rightDim * 0.6) }}>
            <div style={{ position: 'absolute', left: 16, top: 16, right: 16, height: 86, borderRadius: 6, border: `2px solid ${alpha(C.text, 0.12)}` }} />
            <div style={{ position: 'absolute', left: 16, top: 128, right: 16, bottom: 16, borderRadius: 6, border: `2px solid ${alpha(C.text, 0.12)}` }} />
          </div>
          {/* the figure pushing the door */}
          <svg width={200} height={260} viewBox="0 0 200 260" style={{ position: 'absolute', left: DOOR.x - 168, top: DOOR.y + DOOR.h - 260 + 6, overflow: 'visible', ...dimStyle(rightDim * 0.6) }}>
            <g transform={`rotate(${4 * push} 110 254)`}>
              <Figure x={110 + 6 * push} ground={254} facing="right" height={230} />
            </g>
          </svg>
          {holds > 0.01 ? (
            <div
              style={{
                position: 'absolute',
                left: DOOR.x + DOOR.w - 24,
                top: DOOR.y - 26,
                width: 58,
                height: 58,
                borderRadius: 29,
                display: 'grid',
                placeItems: 'center',
                background: alpha(C.emeraldDeep, 0.9),
                border: `3px solid ${C.emerald}`,
                transform: `scale(${Math.min(1.1, holds)})`,
              }}
            >
              <Icon name="check" size={34} color={C.emerald} strokeWidth={3.4} />
            </div>
          ) : null}
        </div>
      ) : null}

      {/* ===== The one lock (phase A centred, phase C on the door) ===== */}
      {lockOpacity > 0.01 ? (
        <div style={{ position: 'absolute', left: lockBox.x, top: lockBox.y, opacity: lockOpacity, ...(inC ? dimStyle(rightDim * 0.6, lockOpacity) : {}) }}>
          <Lock width={lockBox.w} glow={inC ? 0 : lockGlow} />
        </div>
      ) : null}
    </Stage>
  );
}

/** The night figure's position, facing and walking phase at `frame` (picture units). */
function nightFigure(frame: number, approachAt: number, seeAt: number, turnAt: number): { x: number; facing: 'left' | 'right'; walk: number } {
  const FAR = 660;
  const NEAR = 468;
  const inP = progress(frame, approachAt, Math.max(12, seeAt - approachAt), EASE.out);
  if (frame < turnAt) {
    const moving = inP > 0.001 && inP < 0.98;
    return { x: FAR - (FAR - NEAR) * inP, facing: 'left', walk: moving ? (frame - approachAt) / 16 : 0 };
  }
  const outP = progress(frame, turnAt + 8, 54, EASE.inOut);
  const moving = outP > 0.001 && outP < 0.999;
  return { x: NEAR + (FAR + 40 - NEAR) * outP, facing: 'right', walk: moving ? (frame - turnAt) / 16 : 0 };
}

/** A curved «turn back» mark over the figure's head (SVG, picture units). */
function TurnArrow({ x, show }: { x: number; show: number }) {
  const y = DEPOT_GROUND - 168;
  return (
    <g opacity={show} transform={`translate(${x} ${y})`}>
      <path d="M -30 10 C -30 -18, 30 -18, 30 6" fill="none" stroke={C.amber} strokeWidth={5} strokeLinecap="round" />
      <path d="M 18 0 L 31 12 L 40 -4" fill="none" stroke={C.amber} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
}

/** Cross-fades two stacked layers (`mix` 0 = bottom only, 1 = top only). */
function Layered({ bottom, top, mix: m }: { bottom: ReactNode; top: ReactNode; mix: number }) {
  return (
    <div style={{ position: 'relative' }}>
      <div style={{ opacity: 1 - m }}>{bottom}</div>
      <div style={{ position: 'absolute', left: 0, top: 0, opacity: m }}>{top}</div>
    </div>
  );
}

/** A vignette's card (behind its picture and tag). */
function Panel({ x, show, children }: { x: number; show: number; children: ReactNode }) {
  if (show < 0.01) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: PANEL_TOP,
        width: PANEL_W,
        height: PANEL_H,
        boxSizing: 'border-box',
        borderRadius: RADIUS.lg,
        background: alpha(C.ink850, 0.92),
        border: `2px solid ${alpha(C.ink500, 0.7)}`,
        opacity: show,
      }}
    >
      {children}
    </div>
  );
}

function Caption({ when, what, tone }: { when: string; what: string; tone: string }) {
  return (
    <div style={{ position: 'absolute', left: 26, top: 14, right: 26, fontFamily: FONT.sans, whiteSpace: 'nowrap' }}>
      <div style={{ fontSize: 36, fontWeight: 850, color: tone, lineHeight: 1.15 }}>{when}</div>
      <div style={{ fontSize: 33, fontWeight: 600, color: C.text, lineHeight: 1.2, marginTop: 2 }}>{what}</div>
    </div>
  );
}

function Heading({ verb, term, show }: { verb: string; term: string; show: number }) {
  const style: CSSProperties = { fontSize: 48, fontWeight: 850, lineHeight: 1.1, whiteSpace: 'nowrap' };
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        width: COL_W,
        top: C_TOP,
        display: 'flex',
        justifyContent: 'center',
        gap: 22,
        fontFamily: FONT.sans,
        opacity: show,
        transform: `translateY(${(1 - show) * 10}px)`,
      }}
    >
      <span style={{ ...style, color: C.textStrong }}>{verb}</span>
      <span style={{ ...style, color: '#c4b5fd' }}>{term}</span>
    </div>
  );
}

function ColCaption({ text, show }: { text: string; show: number }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: 10,
        width: COL_W - 20,
        top: C_CAPTION,
        textAlign: 'center',
        fontFamily: FONT.sans,
        fontSize: 32,
        fontWeight: 650,
        lineHeight: 1.2,
        whiteSpace: 'nowrap',
        color: C.text,
        opacity: show,
        transform: `translateY(${(1 - show) * 10}px)`,
      }}
    >
      {text}
    </div>
  );
}

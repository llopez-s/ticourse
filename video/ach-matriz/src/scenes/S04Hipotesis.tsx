import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress, springIn } from '../../../engine/src/theme/motion';
import { Icon, dimStyle, mix, windowWeight } from '../../../engine/src/ui';
import { S04_NAME, S04_STRIP, S04_TECHS } from '../data/s04-hipotesis';
import { AssumptionSheet, sheetBox } from './parts/AssumptionSheet';
import { FRIDGE_BASE, Fridge, Suspects, suspectsSize } from './parts/Kitchen';
import { TechniqueCard } from './parts/s02-fuera/TechniqueCard';
import { WHITEBOARD_TEXT } from './parts/Whiteboard';
import { Stage, segment, wordFrame } from './kit';

const S = 's04-hipotesis';
const W = STAGE.width;

// The kitchen: the fridge alone and big, then fridge + line-up, then small under the name.
const KITCHEN_GAP = 70;
const SUS_W = suspectsSize().w; // design width of the line-up (1060)
const FRIDGE_C = { w: 340, x: (W - 340) / 2, y: 22 } as const;
const K1 = { s: 1, x: (W - (FRIDGE_BASE.w + KITCHEN_GAP + SUS_W)) / 2, y: 82 } as const;
const K2_S = 0.6;
const K2 = { s: K2_S, x: (W - (FRIDGE_BASE.w + KITCHEN_GAP + SUS_W) * K2_S) / 2, y: STAGE.height - 560 * K2_S - 8 } as const;

// Technique chips and the name, above the small kitchen.
const CHIPS_TOP = 6;
const CHIP_H = 70;
const CHIP_W = { devil: 450, kac: 530, ach: 236 } as const;
const NAME_TOP = 106;

// Meridian: the sheet on the left, the devil's advocate's question on the right, the strip at the bottom.
const SHEET = { x: 56, y: 14, w: 960 } as const;
const RESCUE = { x: 1074, y: 150, w: 640 } as const;
const STRIP_TOP = 566;

const BOARD_INK = '#b45309';

/**
 * s04-hipotesis «Todas a la vez». The idea before the name: a fridge with one yogurt
 * missing (ring on «yogur»), then three suspects in silhouette — «compañera de piso»,
 * «hermano (de visita)», «perro» — each lit as the voice names it. On `refute` «¿pudo?»
 * appears over each and flips to «¿no pudo?» on «no pudo». On `ach` the kitchen steps
 * down and the three techniques of today line up (Devil's Advocacy, Key Assumptions
 * Check, then ACH lights as «la tercera»), with the name ANALYSIS OF COMPETING
 * HYPOTHESES (ACH) and, on `heuer`, «Richards Heuer». On `hypotheses` the s03 sheet is
 * back and its three slots fill on «Espionaje», «Crimen», «hacktivistas» (eye, padlock,
 * flag — never a member of staff); on «rescate» the devil's advocate's «¿y si es un
 * rescate?» is pinned beside the sheet and H2 glows amber. On `all-first` the strip
 * «primero todas, con el equipo; después, las pruebas» (its second half on «después»).
 */
export function S04Hipotesis(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const suspects = props.cue('suspects');
  const refute = props.cue('refute');
  const ach = props.cue('ach');
  const heuer = props.cue('heuer');
  const hypotheses = props.cue('hypotheses');
  const allFirst = props.cue('all-first');
  const s5 = segment(props, 's04-05');

  // ---- Kitchen.
  const missingAt = Math.max(props.cue('fridge'), wordFrame(S, 's04-01', 'yogur') - 4);
  const nameRoommate = wordFrame(S, 's04-01', 'compañera') - 2;
  const nameBrother = wordFrame(S, 's04-01', 'hermano') - 2;
  const nameDog = wordFrame(S, 's04-01', 'perro') - 2;
  const askAt = wordFrame(S, 's04-02', 'pudo', 0) - 6;
  const flipAt = wordFrame(S, 's04-02', 'no') - 4;
  const toK1 = progress(frame, suspects - 14, 22, EASE.inOut);
  const toK2 = progress(frame, ach - 10, 24, EASE.inOut);
  const kitchenOut = progress(frame, hypotheses - 16, 14, EASE.inOut);
  const ks = mix(1, K2_S, toK2);
  const kx = mix(K1.x, K2.x, toK2);
  const ky = mix(K1.y, K2.y, toK2);
  const fridgeBox = {
    w: mix(FRIDGE_C.w, FRIDGE_BASE.w * ks, toK1),
    x: mix(FRIDGE_C.x, kx, toK1),
    y: mix(FRIDGE_C.y, ky, toK1),
  };

  // ---- The name.
  const thirdAt = wordFrame(S, 's04-03', 'tercera') - 4;
  const nameAt = Math.max(ach + 4, wordFrame(S, 's04-03', 'análisis') - 6);
  const authorAt = heuer - 2;
  const nameOut = kitchenOut;

  // ---- Meridian: the sheet and its hypotheses.
  const sheetAt = hypotheses - 8;
  const slotAt: [number, number, number] = [
    wordFrame(S, 's04-04', 'Espionaje') - 4,
    wordFrame(S, 's04-04', 'Crimen') - 4,
    wordFrame(S, 's04-04', 'hacktivistas') - 4,
  ];
  const rescueAt = wordFrame(S, 's04-04', 'rescate') - 8;
  const h2Ring = windowWeight(frame, rescueAt, slotAt[2], { ramp: 12, lead: 0 });
  const stripThenAt = wordFrame(S, 's04-05', 'después') - 4;
  const stripIn = progress(frame, Math.min(allFirst + 4, s5.to - 30), 16);

  return (
    <Stage>
      {/* ================= The kitchen ================= */}
      {kitchenOut < 1 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: 1 - kitchenOut }}>
          <Fridge
            width={fridgeBox.w}
            missingAt={missingAt}
            dim={0.3 * toK2}
            frame={frame}
            style={{ position: 'absolute', left: fridgeBox.x, top: fridgeBox.y }}
          />
          <Suspects
            width={SUS_W * ks}
            at={suspects - 2}
            askAt={askAt}
            flipAt={flipAt}
            focus={[
              { id: 'roommate', from: nameRoommate, to: nameBrother },
              { id: 'brother', from: nameBrother, to: nameDog },
              { id: 'dog', from: nameDog, to: refute - 4 },
            ]}
            dim={0.3 * toK2}
            frame={frame}
            style={{ position: 'absolute', left: kx + (FRIDGE_BASE.w + KITCHEN_GAP) * ks, top: ky }}
          />
        </div>
      ) : null}

      {/* ================= The name: the third technique ================= */}
      {toK2 > 0 && nameOut < 1 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: 1 - nameOut, fontFamily: FONT.sans }}>
          <div style={{ position: 'absolute', left: 0, top: CHIPS_TOP, width: W, display: 'flex', justifyContent: 'center', gap: 24 }}>
            {S04_TECHS.map((id, i) => {
              const isAch = id === 'ach';
              const inP = progress(frame, ach - 8 + i * 6, 14);
              const lit = isAch ? (frame < thirdAt ? 0 : Math.min(1, springIn(frame, fps, thirdAt, { damping: 14 }))) : 0;
              const d = isAch ? 0.5 * (1 - lit) : 0.5 * progress(frame, thirdAt, 14);
              return (
                <div key={id} style={{ ...dimStyle(d, inP), transform: `translateY(${(1 - inP) * -14}px) scale(${1 + 0.06 * lit})` }}>
                  <TechniqueCard id={id} width={CHIP_W[id]} height={CHIP_H} fontSize={32} number={i + 1} lit={lit} />
                </div>
              );
            })}
          </div>
          <div style={{ position: 'absolute', left: 0, top: NAME_TOP, width: W, textAlign: 'center', whiteSpace: 'nowrap' }}>
            <div style={{ fontSize: 56, fontWeight: 850, letterSpacing: 1, color: '#c4b5fd', ...enter(frame, nameAt, { distance: 16 }), textShadow: `0 0 26px ${alpha(C.violet, 0.35)}` }}>
              {S04_NAME.term} <span style={{ color: C.cyan }}>{S04_NAME.short}</span>
            </div>
            <div style={{ marginTop: 12, fontSize: 40, fontWeight: 700, color: C.text, ...enter(frame, authorAt, { distance: 12 }) }}>{S04_NAME.author}</div>
          </div>
        </div>
      ) : null}

      {/* ================= Meridian: the sheet's slots fill ================= */}
      {frame >= sheetAt ? (
        <>
          <div style={{ position: 'absolute', left: SHEET.x, top: SHEET.y }}>
            <AssumptionSheet width={SHEET.w} at={sheetAt} titleAt={sheetAt - 40} slots={slotAt} frame={frame} />
            {/* H2 lit amber while the voice ties it to the devil's advocate (same −0.8° as the sheet) */}
            {h2Ring > 0.01 ? <SlotRing frame={frame} weight={h2Ring} /> : null}
          </div>
          <RescueNote frame={frame} fps={fps} at={rescueAt} dim={0.35 * progress(frame, slotAt[2], 14)} />
          {stripIn > 0 ? <Strip frame={frame} inP={stripIn} thenAt={stripThenAt} /> : null}
        </>
      ) : null}
    </Stage>
  );
}

// ---------------------------------------------------------------------------

/** Amber ring around the sheet's H2 slot. */
function SlotRing({ frame, weight }: { frame: number; weight: number }) {
  const b = sheetBox('H2', SHEET.w);
  const pad = 8;
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, transform: 'rotate(-0.8deg)', transformOrigin: '0 0', pointerEvents: 'none' }}>
      <div
        style={{
          position: 'absolute',
          left: b.x - pad,
          top: b.y - pad,
          width: b.w + 2 * pad,
          height: b.h + 2 * pad,
          boxSizing: 'border-box',
          borderRadius: 16,
          border: `5px solid ${alpha(C.amber, 0.9 * weight)}`,
          boxShadow: `0 0 ${Math.round(28 * weight)}px ${alpha(C.amber, 0.55 * weight)}`,
          transform: `scale(${1 + 0.02 * Math.sin(frame / 9) * weight})`,
        }}
      />
    </div>
  );
}

/** «¿y si es un rescate?», a fragment of the room's whiteboard, pinned beside the sheet. */
function RescueNote({ frame, fps, at, dim }: { frame: number; fps: number; at: number; dim: number }) {
  if (frame < at) return null;
  const p = Math.min(1, springIn(frame, fps, at, { damping: 14 }));
  return (
    <div
      style={{
        position: 'absolute',
        left: RESCUE.x,
        top: RESCUE.y,
        width: RESCUE.w,
        fontFamily: FONT.sans,
        ...dimStyle(dim, Math.min(1, p * 1.4)),
        transform: `translateX(${(1 - p) * 50}px) rotate(${2 - 1 * p}deg)`,
      }}
    >
      <div
        style={{
          boxSizing: 'border-box',
          padding: '22px 30px 26px',
          borderRadius: 14,
          border: '10px solid #9aa8ba',
          background: 'linear-gradient(160deg, #eef2f6 0%, #dfe5ec 100%)',
          boxShadow: `0 24px 50px ${alpha('#000000', 0.45)}, 0 0 ${Math.round(30 * p)}px ${alpha(C.amber, 0.3)}`,
          textAlign: 'center',
          whiteSpace: 'nowrap',
        }}
      >
        <div style={{ fontSize: 52, fontWeight: 850, color: BOARD_INK, transform: 'rotate(-3deg)' }}>{WHITEBOARD_TEXT.question}</div>
      </div>
      <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, whiteSpace: 'nowrap' }}>
        <Icon name="lock" size={40} color={C.amber} />
        <span style={{ fontSize: 40, fontWeight: 850, color: '#fcd34d' }}>H2</span>
      </div>
    </div>
  );
}

/** «primero todas, con el equipo; después, las pruebas». */
function Strip({ frame, inP, thenAt }: { frame: number; inP: number; thenAt: number }) {
  const then = enter(frame, thenAt, { distance: 14, axis: 'x' });
  return (
    <div style={{ position: 'absolute', left: 0, top: STRIP_TOP, width: W, display: 'flex', justifyContent: 'center', opacity: inP, transform: `translateY(${(1 - inP) * 16}px)` }}>
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 18,
          height: 82,
          padding: '0 36px 0 26px',
          boxSizing: 'border-box',
          borderRadius: RADIUS.lg,
          border: `2px solid ${alpha(C.cyan, 0.6)}`,
          background: `linear-gradient(90deg, ${alpha(C.cyan, 0.16)} 0%, ${alpha(C.ink900, 0.96)} 50%)`,
          boxShadow: `0 18px 44px ${alpha('#000000', 0.4)}`,
          fontFamily: FONT.sans,
          fontSize: 44,
          fontWeight: 800,
          whiteSpace: 'nowrap',
        }}
      >
        <Icon name="users" size={46} color={C.cyan} />
        <span style={{ color: C.textStrong }}>{S04_STRIP.first}</span>
        <span style={{ color: C.cyanSoft, ...then }}>{S04_STRIP.then}</span>
      </div>
    </div>
  );
}

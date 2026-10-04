import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress, springIn } from '../../../engine/src/theme/motion';
import { Icon, cubicPath, cubicPoint, curveBetween, dimStyle, mix, type Point } from '../../../engine/src/ui';
import { S02_NAME, S02_ROLE, S02_SHEET_TITLE, TECHNIQUES } from '../data/s02-fuera';
import { HEAD_BASE, HEAD_EXIT, ProfileHead } from './parts/s02-fuera/Head';
import { TechniqueCard } from './parts/s02-fuera/TechniqueCard';
import { Whiteboard } from './parts/Whiteboard';
import { Stage, segment, wordFrame } from './kit';

const S = 's02-fuera';
const W = STAGE.width;

// Phase A: the head, centred while it is alone, then on the left beside the techniques sheet.
const HEAD_C = { x: (W - 540) / 2, y: 22, w: 540 } as const;
const HEAD = { x: 30, y: 74, w: 460 } as const;
const SHEET = { x: 760, y: 22, w: 940, h: 616 } as const;
const CARD = { x: 46, y: 112, w: 848, h: 86, gap: 14 } as const;

// Phase B: the room. The colleague on the left, the whiteboard on the right (s03 picks the board up from here).
export const S02_BOARD = { x: 568, y: 96, w: 1150 } as const;
const LEFT_W = 520;

const PAPER = '#f2e8cf';
const PAPER_EDGE = '#d9c9a3';
const NAVY = '#1e3a8a';
const ROLE = '#fbbf24';

/**
 * s02-fuera «Sácalo de la cabeza». A head in profile with a thought tangle that keeps
 * knotting; on «sesgos» the faint «confirmation bias» and «anchoring» peek out. On
 * `paper` three strands of thought leave the head for a sheet that lands on «hoja»; on
 * `sats` it gets its title, STRUCTURED ANALYTIC TECHNIQUES, and the five technique cards
 * (Key Assumptions Check, Devil's Advocacy, What-If Analysis, brainstorming estructurado,
 * ACH). «hoy usas tres» lights the three this video uses; on `devil` Devil's Advocacy
 * grows and the rest dim. On `contrary` the room: a colleague (generic icon, no name)
 * gets the card «abogada del diablo · defiende lo contrario» and «¿y si es un rescate?»
 * is written on the s01 whiteboard as the voice reads it; `advocacy` names it, DEVIL'S
 * ADVOCACY (the exam card draws in the top band). It is her role: nobody loses.
 */
export function S02Fuera(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const head = props.cue('head');
  const paper = props.cue('paper');
  const sats = props.cue('sats');
  const devil = props.cue('devil');
  const contrary = props.cue('contrary');
  const advocacy = props.cue('advocacy');
  const last = segment(props, 's02-06');

  // ---- Phase A: head, strands, sheet.
  const biasesAt = Math.max(head, wordFrame(S, 's02-01', 'sesgos') - 8);
  const sheetAt = Math.max(paper + 12, wordFrame(S, 's02-02', 'hoja') - 10);
  const titleAt = sats - 2;
  const cardAt = (i: number) => sats + 8 + i * 10;
  const todayAt = wordFrame(S, 's02-03', 'tres') - 4;
  const phaseAOut = progress(frame, contrary - 18, 16, EASE.inOut);
  const calm = progress(frame, paper, 70, EASE.inOut);
  const strandsIn = progress(frame, paper - 2, 40, EASE.inOut);
  const strandsOut = progress(frame, sats + 30, 20, EASE.inOut);

  // Card states: «hoy usas tres» lights the three of today, `devil` zooms Devil's Advocacy.
  const today = progress(frame, todayAt, 14);
  const zoom = progress(frame, devil - 4, 16, EASE.inOut);

  // ---- Phase B: the room.
  const roomIn = progress(frame, contrary - 10, 16);
  const colleagueAt = contrary - 2;
  const roleAt = Math.max(colleagueAt + 10, wordFrame(S, 's02-04', 'compañera') - 6);
  const questionAt = wordFrame(S, 's02-04', 'y');
  const nameAt = advocacy - 2;

  // The head steps left as the strands start.
  const toLeft = progress(frame, paper - 18, 22, EASE.inOut);
  const headBox = { x: mix(HEAD_C.x, HEAD.x, toLeft), y: mix(HEAD_C.y, HEAD.y, toLeft), w: mix(HEAD_C.w, HEAD.w, toLeft) };
  const s = headBox.w / HEAD_BASE.w;
  const exit: Point = { x: headBox.x + HEAD_EXIT.x * s, y: headBox.y + HEAD_EXIT.y * s };
  const targets: Point[] = [
    { x: SHEET.x + 10, y: SHEET.y + 170 },
    { x: SHEET.x + 10, y: SHEET.y + 330 },
    { x: SHEET.x + 10, y: SHEET.y + 490 },
  ];

  return (
    <Stage>
      {/* ================= Phase A ================= */}
      {phaseAOut < 1 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: 1 - phaseAOut, transform: `translateX(${-60 * phaseAOut}px)` }}>
          <ProfileHead
            width={headBox.w}
            frame={frame}
            tangle={1 - 0.65 * calm}
            biases={progress(frame, biasesAt, 22) * (1 - 0.5 * calm)}
            glow={0.6 * progress(frame, head, 14) * (1 - calm)}
            style={{ position: 'absolute', left: headBox.x, top: headBox.y }}
          />

          {/* Strands of thought leaving the head for the sheet */}
          {strandsIn > 0 && strandsOut < 1 ? (
            <svg width={W} height={STAGE.height} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: 1 - strandsOut }}>
              {targets.map((t, i) => {
                const curve = curveBetween(exit, t, 0.55);
                const p = progress(frame, paper - 2 + i * 8, 40, EASE.inOut);
                const dot = cubicPoint(curve, p);
                return (
                  <g key={i}>
                    <path d={cubicPath(curve)} stroke={alpha(C.cyanSoft, 0.7)} strokeWidth={4} strokeLinecap="round" fill="none" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p} opacity={p > 0 ? 1 : 0} />
                    {p > 0 ? <circle cx={dot.x} cy={dot.y} r={9} fill={C.cyan} style={{ filter: `drop-shadow(0 0 8px ${alpha(C.cyan, 0.8)})` }} /> : null}
                  </g>
                );
              })}
            </svg>
          ) : null}

          {/* The sheet: STRUCTURED ANALYTIC TECHNIQUES with the five cards */}
          <TechSheet frame={frame} at={sheetAt} titleAt={titleAt} cardAt={cardAt} today={today} zoom={zoom} />
        </div>
      ) : null}

      {/* ================= Phase B: the room ================= */}
      {roomIn > 0 ? (
        <>
          <div style={{ position: 'absolute', left: S02_BOARD.x, top: S02_BOARD.y, opacity: roomIn, transform: `translateX(${(1 - roomIn) * 40}px)` }}>
            <Whiteboard
              width={S02_BOARD.w}
              header
              question={questionAt}
              focus={[{ target: 'question', from: questionAt, to: last.from }]}
              frame={frame}
            />
          </div>
          <Colleague frame={frame} fps={fps} at={colleagueAt} roleAt={roleAt} nameAt={nameAt} />
        </>
      ) : null}
    </Stage>
  );
}

// ---------------------------------------------------------------------------

/** The techniques sheet (paper, navy title) with its five cards. */
function TechSheet({
  frame,
  at,
  titleAt,
  cardAt,
  today,
  zoom,
}: {
  frame: number;
  at: number;
  titleAt: number;
  cardAt: (i: number) => number;
  today: number;
  zoom: number;
}) {
  const show = progress(frame, at, 16);
  if (show <= 0) return null;
  const titleP = progress(frame, titleAt, 22, EASE.inOut);
  return (
    <div
      style={{
        position: 'absolute',
        left: SHEET.x,
        top: SHEET.y,
        width: SHEET.w,
        height: SHEET.h,
        opacity: show,
        transform: `translateY(${(1 - show) * -24}px) rotate(${0.6 - (1 - show) * 2}deg)`,
        fontFamily: FONT.sans,
      }}
    >
      <div style={{ position: 'absolute', inset: 0, borderRadius: 6, background: `linear-gradient(180deg, ${PAPER} 0%, #ede1c4 100%)`, border: `2px solid ${PAPER_EDGE}`, boxShadow: `0 24px 50px ${alpha('#000000', 0.45)}` }} />
      <div style={{ position: 'absolute', left: 30, top: 0, width: 2, height: SHEET.h, background: alpha('#e11d48', 0.18) }} />
      {/* Title, written left to right */}
      <div style={{ position: 'absolute', left: CARD.x, top: 30, whiteSpace: 'nowrap', clipPath: titleP < 1 ? `inset(-20px ${(1 - titleP) * 100}% -20px -20px)` : undefined, opacity: titleP > 0 ? 1 : 0 }}>
        <span style={{ fontSize: 42, fontWeight: 900, color: NAVY, letterSpacing: 1.2 }}>{S02_SHEET_TITLE}</span>
        <svg width={760} height={14} style={{ position: 'absolute', left: 0, top: 54, overflow: 'visible' }}>
          <path d="M2 7 C200 2 500 12 756 4" stroke={NAVY} strokeWidth={5} fill="none" strokeLinecap="round" />
        </svg>
      </div>
      {/* The five cards */}
      {TECHNIQUES.map((t, i) => {
        const p = progress(frame, cardAt(i), 14);
        if (p <= 0) return null;
        const isDevil = t.id === 'devil';
        // «hoy usas tres»: the three of today get the cyan accent, the other two step back a little.
        const lit = t.today ? 0.45 * today * (1 - zoom) + (isDevil ? zoom : 0) : 0;
        const d = t.today ? (isDevil ? 0 : zoom) : Math.max(0.55 * today, zoom);
        const z = isDevil ? zoom : 0;
        return (
          <div
            key={t.id}
            style={{
              position: 'absolute',
              left: CARD.x,
              top: CARD.y + i * (CARD.h + CARD.gap),
              zIndex: isDevil ? 2 : 1,
              ...dimStyle(d, p),
              transform: `translateX(${(1 - p) * 30}px) scale(${1 + 0.07 * z}) rotate(${i % 2 === 0 ? -0.5 : 0.5}deg)`,
              transformOrigin: '50% 50%',
            }}
          >
            <TechniqueCard id={t.id} width={CARD.w} height={CARD.h} fontSize={40} lit={lit} />
          </div>
        );
      })}
    </div>
  );
}

/** The colleague who plays the devil's advocate: a generic icon, her role card, and the name. */
function Colleague({ frame, fps, at, roleAt, nameAt }: { frame: number; fps: number; at: number; roleAt: number; nameAt: number }) {
  const p = progress(frame, at, 16);
  if (p <= 0) return null;
  const role = frame < roleAt ? 0 : springIn(frame, fps, roleAt, { damping: 13 });
  const name = progress(frame, nameAt, 16);
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: LEFT_W, height: STAGE.height, fontFamily: FONT.sans }}>
      {/* The colleague (no name, generic) */}
      <div style={{ position: 'absolute', left: (LEFT_W - 190) / 2, top: 40, ...enter(frame, at, { distance: 20 }) }}>
        <div style={{ width: 190, height: 190, borderRadius: 95, display: 'grid', placeItems: 'center', background: alpha(C.cyan, 0.1), border: `3px solid ${alpha(C.cyan, 0.65)}`, boxShadow: `0 0 ${Math.round(26 * role)}px ${alpha(ROLE, 0.35 * role)}` }}>
          <Icon name="user" size={112} color={C.cyan} strokeWidth={1.8} />
        </div>
      </div>
      {/* The role card she receives */}
      {role > 0.001 ? (
        <div
          style={{
            position: 'absolute',
            left: 10,
            top: 262,
            width: LEFT_W - 20,
            boxSizing: 'border-box',
            padding: '20px 26px',
            borderRadius: RADIUS.lg,
            border: `3px solid ${alpha(ROLE, 0.85)}`,
            background: `linear-gradient(180deg, ${alpha(C.amberDeep, 0.7)} 0%, ${alpha(C.ink900, 0.95)} 100%)`,
            boxShadow: `0 20px 44px ${alpha('#000000', 0.45)}`,
            textAlign: 'center',
            whiteSpace: 'nowrap',
            opacity: Math.min(1, role * 1.4),
            transform: `translateY(${(1 - Math.min(1, role)) * -40}px) rotate(${-2 + 2 * Math.min(1, role)}deg)`,
          }}
        >
          <div style={{ fontSize: 48, fontWeight: 850, color: '#fde68a', lineHeight: 1.1 }}>{S02_ROLE.title}</div>
          <div style={{ marginTop: 8, fontSize: 36, fontWeight: 700, color: C.text, lineHeight: 1.1 }}>{S02_ROLE.sub}</div>
        </div>
      ) : null}
      {/* The name (exam term) */}
      {name > 0 ? (
        <div style={{ position: 'absolute', left: 0, top: 446, width: LEFT_W, textAlign: 'center', opacity: name, transform: `translateY(${(1 - name) * 14}px)` }}>
          <div style={{ display: 'inline-block', fontSize: 46, fontWeight: 850, letterSpacing: 2, color: '#c4b5fd', whiteSpace: 'nowrap', textShadow: `0 0 24px ${alpha(C.violet, 0.45 * name)}` }}>{S02_NAME}</div>
          <div style={{ margin: '10px auto 0', width: mix(0, 420, name), height: 3, borderRadius: 2, background: alpha(C.violet, 0.7) }} />
        </div>
      ) : null}
    </div>
  );
}

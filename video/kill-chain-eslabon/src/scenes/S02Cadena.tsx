import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { EASE, progress, pulse } from '../../../engine/src/theme/motion';
import { mix, windowWeight, type Tone } from '../../../engine/src/ui';
import { AGAIN, HIM, MODEL_CAPTION, NOBODY_OPENS, STAYS_AT_DOOR, YOU } from '../data/s02-cadena';
import { KillChain, PHASE_IDS, Vignette, killChainLayout, type PhaseId, type VignetteLook } from './parts/KillChain';
import { TrapBox, trapBoxHeight } from './parts/TrapBox';
import { Stage, segment, wordFrame } from './kit';

const S = 's02-cadena';
const W = 1728;

/** The chain row (stage-local); everything above it stays free for the intercept and the labels. */
const ROW = { x: 0, y: 250 } as const;
const L = killChainLayout(W);
/** The opening image: the sidewalk vignette, big, before it drops into slot 1. */
const BIG = { x: (W - 760) / 2, y: 14, w: 760 } as const;
/** Where the plans sit in the sidewalk vignette (design units of the 240×200 vignette). */
const PLANS_AT = { x: 147, y: 116 } as const;

const NEW_BOX_W = 96;
const HIM_Y = ROW.y + L.height + 16;

const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

/** interpolate() with its input frames forced strictly increasing (word timings can bunch up). */
function steps(frame: number, xs: number[], ys: number[]): number {
  const fixed = xs.reduce<number[]>((acc, x) => [...acc, acc.length ? Math.max(x, acc[acc.length - 1] + 1) : x], []);
  return interpolate(frame, fixed, ys, clamp);
}

/**
 * s02-cadena «Siete pasos, en orden». The opening image is the sidewalk: a
 * house on a street (cyan, the plans in its window) and the thief (rose,
 * faceless) walking up to look. «Siete pasos»: it drops into slot 1 of seven
 * numbered slots, and the other six vignettes draw in on the voice's words
 * (workshop, box at the door, box opened with the device lit, key in the pot,
 * «sigo aquí, ¿qué hago?», the plans). `names`: the seven names under the
 * slots, «Cyber Kill Chain · Lockheed Martin» small. `chain`: the rings hook
 * each vignette to the previous one. GLASS VIPER's card (top centre) has the
 * stage above the row to itself. `break`: the Exploitation link cracks and the
 * box stays shut («nadie la abre»); `grey`: the three after it go grey on
 * «llave», «aviso», «planos»; «esta se queda en la puerta» (emerald). A new box
 * comes out of the WORKSHOP again: «si lo intenta otra vez, empieza de nuevo».
 * `asymmetry`: «él: necesita las siete, en orden» bracketing the whole row and
 * «tú: te basta con romper una a tu alcance» on the broken link. Then still.
 */
export function S02Cadena(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sevenAt = props.cue('seven');
  const namesAt = props.cue('names');
  const chainAt = props.cue('chain');
  const breakAt = props.cue('break');
  const greyAt = props.cue('grey');
  const asymAt = props.cue('asymmetry');
  const s07 = segment(props, 's02-07');

  const w = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);
  const wLadron = w('s02-01', 'ladrón');
  const wPlanos1 = w('s02-01', 'planos');
  const wPrimero = w('s02-02', 'Primero');
  const wTaller = w('s02-02', 'taller');
  const wMete = w('s02-02', 'mete');
  const wParece = w('s02-02', 'parece');
  const wLlega = w('s02-03', 'llega');
  const wPuerta = w('s02-03', 'puerta');
  const wAbre = w('s02-03', 'abre');
  const wEnciende = w('s02-03', 'enciende');
  const wEsconde = w('s02-04', 'esconde');
  const wLlave4 = w('s02-04', 'llave');
  const wMaceta = w('s02-04', 'maceta');
  const wAvisa = w('s02-04', 'avisa');
  const wSigo = w('s02-04', 'sigo');
  const wEntra = w('s02-05', 'entra');
  const wPlanos5 = w('s02-05', 'planos');
  const wCyber = w('s02-05', 'Cyber');
  const wColarse = w('s02-07', 'colarse');
  const wSiete8 = w('s02-08', 'siete');
  const wLlave8 = w('s02-08', 'llave');
  const wAviso = w('s02-08', 'aviso');
  const wPlanos8 = w('s02-08', 'planos', 1);
  const wManda = w('s02-09', 'manda');
  const wEmpieza = w('s02-09', 'empieza');
  const wPrepara = w('s02-09', 'prepara');
  const wTi = w('s02-10', 'ti');

  // ---- Opening: the sidewalk, big; then it drops into slot 1 -----------------------------------
  const slot1 = L.slots[0];
  const fly = progress(frame, sevenAt - 2, 26, EASE.inOut);
  const landed = fly >= 1;
  const big = { x: mix(BIG.x, ROW.x + slot1.x, fly), y: mix(BIG.y, ROW.y + slot1.y, fly), w: mix(BIG.w, slot1.w, fly) };
  const reconAct = steps(frame, [wLadron - 8, wLadron + 40], [0, 1]);
  const plansRing = windowWeight(frame, wPlanos1 - 4, sevenAt + 4, { ramp: 10 });

  // ---- The story: each vignette on its words ----------------------------------------------------
  const showAt: Record<PhaseId, number> = {
    reconnaissance: 0,
    weaponization: wTaller - 10,
    delivery: wLlega - 12,
    exploitation: wAbre - 16,
    installation: wEsconde - 12,
    c2: wAvisa - 14,
    actions: wEntra - 14,
  };
  const act: Record<PhaseId, number> = {
    reconnaissance: reconAct,
    weaponization: steps(frame, [wMete - 6, wParece + 16], [0, 1]),
    delivery: steps(frame, [wLlega - 6, wPuerta + 6], [0, 1]),
    exploitation: steps(frame, [wAbre - 10, wEnciende - 2, wEnciende + 16], [0, 0.72, 1]),
    installation: steps(frame, [wLlave4 - 6, wMaceta + 12], [0, 1]),
    c2: steps(frame, [wAvisa - 8, wSigo + 4], [0, 1]),
    actions: steps(frame, [wEntra - 6, wPlanos5 + 18], [0, 1]),
  };
  const storyWin: Record<PhaseId, [number, number]> = {
    reconnaissance: [wPrimero - 2, wTaller - 8],
    weaponization: [wTaller - 8, wLlega - 8],
    delivery: [wLlega - 8, wAbre - 10],
    exploitation: [wAbre - 10, wEsconde - 8],
    installation: [wEsconde - 8, wAvisa - 8],
    c2: [wAvisa - 8, wEntra - 8],
    actions: [wEntra - 8, namesAt],
  };

  // ---- After the message: in order, break, grey, again, asymmetry -------------------------------
  const colar = windowWeight(frame, wColarse - 4, s07.to - 6, { ramp: 12 });
  const broken = progress(frame, breakAt - 2, 18, EASE.inOut);
  const greyStart: Partial<Record<PhaseId, number>> = {
    installation: Math.max(greyAt, wLlave8 - 6),
    c2: wAviso - 6,
    actions: wPlanos8 - 6,
  };
  const nobodyIn = progress(frame, breakAt + 8, 12);
  const staysIn = progress(frame, wPlanos8 + 10, 14);
  const boxRise = progress(frame, wManda - 6, 26, EASE.inOut);
  const againIn = progress(frame, wEmpieza - 6, 14);
  const prepLit = windowWeight(frame, wPrepara - 4, wPrepara + 46);
  const himDraw = progress(frame, asymAt - 2, 24, EASE.inOut);
  const himIn = progress(frame, asymAt + 6, 14);
  const youIn = progress(frame, wTi - 4, 14);
  const youPtr = progress(frame, wTi + 2, 18, EASE.inOut);
  const settle = progress(frame, asymAt, 18);

  const looks: Partial<Record<PhaseId, VignetteLook>> = {};
  PHASE_IDS.forEach((id, i) => {
    const sweep = windowWeight(frame, wSiete8 + i * 5, wSiete8 + i * 5 + 18, { ramp: 6, lead: 2 });
    let lit = windowWeight(frame, storyWin[id][0], storyWin[id][1]);
    let tone: Tone | undefined;
    if (sweep > 0.02) {
      tone = 'rose';
      lit = Math.max(lit, sweep);
    }
    if ((id === 'delivery' || id === 'exploitation') && colar > 0.02 && broken < 0.02) {
      tone = 'rose';
      lit = Math.max(lit, 0.65 * colar);
    }
    if (id === 'weaponization' && prepLit > 0.02) {
      tone = 'cyan';
      lit = Math.max(lit, prepLit);
    }
    if (id === 'delivery' && staysIn > 0.02) {
      tone = 'emerald';
      lit = Math.max(lit, 0.6 * staysIn * (1 - 0.4 * settle));
    }
    if (id === 'exploitation' && broken > 0.02) {
      tone = 'emerald';
      lit = Math.max(lit, windowWeight(frame, breakAt - 2, breakAt + 50), 0.9 * youIn);
    }
    const g = greyStart[id] !== undefined ? progress(frame, greyStart[id] as number, 14) : 0;
    looks[id] = {
      pop: windowWeight(frame, storyWin[id][0], storyWin[id][1], { ramp: 12 }),
      show: id === 'reconnaissance' ? (landed ? 1 : 0) : progress(frame, showAt[id], 14),
      act: act[id],
      lit: lit * (1 - g),
      tone: g > 0.5 ? undefined : tone,
      grey: g,
      broken: id === 'exploitation' ? broken : 0,
    };
  });

  const names = Object.fromEntries(PHASE_IDS.map((id, i) => [id, progress(frame, namesAt + i * 5, 12)])) as Record<PhaseId, number>;
  const links = PHASE_IDS.slice(0, -1).map((_, k) => progress(frame, chainAt + k * 7, 14, EASE.inOut));
  const slots = Object.fromEntries(
    PHASE_IDS.map((id, i) => [id, id === 'reconnaissance' ? 0 : progress(frame, sevenAt + 10 + i * 4, 12) * (1 - (looks[id]?.show ?? 0))]),
  ) as Record<PhaseId, number>;
  const capIn = progress(frame, wCyber - 4, 14);

  // ---- Geometry of the overlays -------------------------------------------------------------------
  const sDel = L.slot('delivery')!;
  const sExp = L.slot('exploitation')!;
  const sWeap = L.slot('weaponization')!;
  const k = sWeap.w / 240;
  const boxFrom = { x: ROW.x + sWeap.x + 150 * k - 22, y: ROW.y + 66 * k, w: 44 };
  const boxTo = { x: ROW.x + sWeap.cx - NEW_BOX_W / 2, y: 82, w: NEW_BOX_W };
  const nb = { x: mix(boxFrom.x, boxTo.x, boxRise), y: mix(boxFrom.y, boxTo.y, boxRise), w: mix(boxFrom.w, boxTo.w, boxRise) };
  const crackTop = { x: ROW.x + sExp.x + (130 / 240) * sExp.w, y: ROW.y };
  const beat = 0.75 + 0.25 * pulse(frame, fps, 0.5);

  return (
    <Stage>
      {/* The row: seven slots, vignettes, rings, names */}
      <div style={{ position: 'absolute', left: ROW.x, top: ROW.y }}>
        <KillChain width={W} looks={looks} names={names} links={links} slots={slots} frame={frame} />
      </div>

      {/* «Cyber Kill Chain · Lockheed Martin», small */}
      {capIn > 0.01 ? (
        <div
          style={{
            position: 'absolute',
            left: 4,
            top: 616,
            fontFamily: FONT.sans,
            fontSize: 26,
            fontWeight: 650,
            letterSpacing: 0.4,
            color: C.muted,
            whiteSpace: 'nowrap',
            opacity: capIn * (1 - 0.3 * settle),
          }}
        >
          {MODEL_CAPTION}
        </div>
      ) : null}

      {/* The opening image, flying into slot 1 */}
      {!landed ? (
        <div style={{ position: 'absolute', left: big.x, top: big.y }}>
          <Vignette phase="reconnaissance" width={big.w} look={{ act: reconAct }} frame={frame} />
          {plansRing > 0.01 ? (
            <svg width={big.w} height={(big.w * 200) / 240} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
              <circle
                cx={(PLANS_AT.x * big.w) / 240}
                cy={(PLANS_AT.y * big.w) / 240}
                r={(26 + 4 * beat) * (big.w / 240)}
                fill="none"
                stroke={C.cyan}
                strokeWidth={4}
                opacity={plansRing}
              />
            </svg>
          ) : null}
        </div>
      ) : null}

      {/* «nadie la abre»: stamped on the cracked link */}
      {nobodyIn > 0.01 ? (
        <div
          style={{
            position: 'absolute',
            left: ROW.x + sExp.cx,
            top: ROW.y + sExp.h * 0.36,
            transform: `translate(-50%, -50%) rotate(-6deg) scale(${1.25 - 0.25 * nobodyIn})`,
            padding: '6px 18px',
            borderRadius: RADIUS.md,
            border: `3px solid ${C.emerald}`,
            background: alpha(C.ink950, 0.9),
            boxShadow: `0 0 24px ${alpha(C.emerald, 0.35)}`,
            fontFamily: FONT.sans,
            fontSize: 34,
            fontWeight: 850,
            color: '#6ee7b7',
            whiteSpace: 'nowrap',
            opacity: nobodyIn,
          }}
        >
          {NOBODY_OPENS}
        </div>
      ) : null}

      {/* «esta se queda en la puerta», over the box at the door */}
      {staysIn > 0.01 ? (
        <div style={{ position: 'absolute', left: ROW.x + sDel.cx, top: 174, opacity: staysIn * (1 - 0.45 * settle), transform: `translate(-50%, ${(1 - staysIn) * 10}px)` }}>
          <div style={{ fontFamily: FONT.sans, fontSize: 36, fontWeight: 850, color: '#6ee7b7', whiteSpace: 'nowrap', textAlign: 'center' }}>{STAYS_AT_DOOR}</div>
          <svg width={20} height={34} style={{ display: 'block', margin: '2px auto 0', overflow: 'visible' }}>
            <line x1={10} y1={0} x2={10} y2={26} stroke={C.emerald} strokeWidth={3.5} strokeLinecap="round" />
            <path d="M 3 19 L 10 28 L 17 19" fill="none" stroke={C.emerald} strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      ) : null}

      {/* A new box, out of the WORKSHOP again */}
      {boxRise > 0.01 ? (
        <>
          <svg width={W} height={ROW.y + 10} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: boxRise * (1 - 0.5 * settle) }}>
            <line
              x1={ROW.x + sWeap.cx}
              y1={ROW.y - 4}
              x2={nb.x + nb.w / 2}
              y2={nb.y + trapBoxHeight(nb.w) - 4}
              stroke={alpha(C.roseSoft, 0.7)}
              strokeWidth={3}
              strokeDasharray="7 7"
              strokeLinecap="round"
            />
          </svg>
          <div style={{ position: 'absolute', left: nb.x, top: nb.y, opacity: Math.min(1, boxRise * 3) * (1 - 0.5 * settle) }}>
            <TrapBox width={nb.w} mini />
          </div>
        </>
      ) : null}
      {againIn > 0.01 ? (
        <div
          style={{
            position: 'absolute',
            right: W - (boxTo.x - 18),
            top: boxTo.y + trapBoxHeight(NEW_BOX_W) / 2,
            fontFamily: FONT.sans,
            fontSize: 34,
            fontWeight: 800,
            lineHeight: 1.12,
            color: C.text,
            whiteSpace: 'nowrap',
            textAlign: 'right',
            opacity: againIn * (1 - 0.5 * settle),
            transform: `translate(${(1 - againIn) * -10}px, -50%)`,
          }}
        >
          <div>{AGAIN[0]}</div>
          <div>{AGAIN[1]}</div>
          <div style={{ color: C.roseSoft }}>{AGAIN[2]}</div>
        </div>
      ) : null}

      {/* asymmetry: «él» brackets the whole chain (rose) … */}
      {himDraw > 0.01 ? (
        <>
          <svg width={W} height={40} style={{ position: 'absolute', left: 0, top: HIM_Y - 14, overflow: 'visible' }}>
            <path
              d={`M 6 0 L 6 14 L ${W - 6} 14 L ${W - 6} 0`}
              fill="none"
              stroke={C.rose}
              strokeWidth={3.5}
              strokeLinejoin="round"
              strokeDasharray={`${(W + 28) * himDraw} ${W + 40}`}
            />
          </svg>
          <div
            style={{
              position: 'absolute',
              left: W / 2,
              top: HIM_Y + 12,
              transform: 'translateX(-50%)',
              padding: '2px 18px',
              background: C.ink950,
              fontFamily: FONT.sans,
              fontSize: 36,
              fontWeight: 800,
              whiteSpace: 'nowrap',
              opacity: himIn,
            }}
          >
            <span style={{ color: C.roseSoft }}>{HIM.who}</span> <span style={{ color: C.text }}>{HIM.text}</span>
          </div>
        </>
      ) : null}

      {/* … and «tú» points at the one link you broke (emerald) */}
      {youIn > 0.01 ? (
        <>
          <svg width={W} height={ROW.y} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
            <path
              d={`M 1000 168 C 960 200, ${crackTop.x + 20} 200, ${crackTop.x + 4} ${crackTop.y - 6}`}
              fill="none"
              stroke={C.emerald}
              strokeWidth={3.5}
              strokeLinecap="round"
              strokeDasharray={`${260 * youPtr} 300`}
            />
            {youPtr > 0.95 ? <circle cx={crackTop.x + 4} cy={crackTop.y - 6} r={6} fill={C.emerald} /> : null}
          </svg>
          <div
            style={{
              position: 'absolute',
              left: 960,
              top: 114,
              fontFamily: FONT.sans,
              fontSize: 34,
              fontWeight: 800,
              whiteSpace: 'nowrap',
              opacity: youIn,
              transform: `translateX(${(1 - youIn) * 14}px)`,
            }}
          >
            <span style={{ color: '#6ee7b7' }}>{YOU.who}</span> <span style={{ color: C.textStrong }}>{YOU.text}</span>
          </div>
        </>
      ) : null}
    </Stage>
  );
}

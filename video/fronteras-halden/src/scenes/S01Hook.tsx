import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { dimStyle, mix, windowWeight } from '../../../engine/src/ui';
import { PATHS, PROMISE, SUBTITLE, TITLE } from '../data/s01-hook';
import { ArrowHead } from './parts/glyphs';
import { ZoneRow, zoneRowLayout } from './parts/ZoneRow';
import { AdversaryTag, ApprovedStamp, Fence, PATH_TILE, PathTile, PromiseChip } from './parts/s01-hook/Bits';
import { Stage, wordFrame } from './kit';

const S = 's01-hook';
const W = STAGE.width;
const H = STAGE.height;

// ---- The approved zone plan (V16's ZoneRow, unchanged). Rendered at 1500 px (its names keep their size)
// and scaled as a whole: big while the voice is on it, small once the paths take over (texture then).
const PW = 1500;
const PH = zoneRowLayout(PW).h;
/** Where the plan sits in each phase: x/y top-left, k = scale. */
const PLAN_A = { x: (W - PW) / 2, y: Math.round((H - PH) / 2), k: 1 } as const; // the bridge
const PLAN_B = { x: (W - PW) / 2, y: Math.round(H - PH), k: 1 } as const; // under the title
const PLAN_C_K = 0.62;
const PLAN_C = { x: Math.round((W - PW * PLAN_C_K) / 2), y: 14, k: PLAN_C_K } as const; // inside the fence
/** The stamp, plan-local (it scales with the plan). */
const STAMP_AT = { x: PW - 400, y: -40 } as const;

// ---- Title block (B).
const SUB_TOP = 78;
const CHIPS_TOP_B = 140;

// ---- Paths (C): the fence under the plan, three tiles below it, each with its promise chip.
const FENCE = { x: 40, y: PLAN_C.y + Math.round(PH * PLAN_C_K) + 22, w: W - 80, h: 40 } as const;
const SLOT_X = [300, 864, 1420] as const;
const TILE_TOP = 330;
const CHIPS_TOP_C = TILE_TOP + PATH_TILE.h + 20;
/** Where each path enters the plan (its bottom edge, plan-relative fraction of the width). */
const ENTRY = [0.3, 0.5, 0.7] as const;
const PLAN_C_BOTTOM = PLAN_C.y + PH * PLAN_C_K;

// ---- Adversary (D): the whole composition shrinks to the left, the tag takes the right column.
const COMP_D_K = 0.58;
const TAG_X = 1040;

/**
 * s01-hook «Tres caminos hacia dentro».
 *   plan       V16's zone plan (the blueprint ZoneRow) draws in, centred.
 *   bridge     on «aprobó» the emerald stamp «aprobado · 20-11» lands on its corner: approved, not running.
 *   title      before 12 s whatever the voice does: «Por dónde se entra» with «802.1X · VPN · IPSec»
 *              under it; the plan settles to the bottom and steps back.
 *   promise    three chips, each on its word: «quién se enchufa», «cómo se unen dos sedes», «cómo entra
 *              quien está fuera».
 *   paths      the title leaves; the plan shrinks to the top, a fence draws under it, three tiles come in
 *              below — a wall socket with its cable, the container terminal, a laptop in front of a hotel —
 *              each chip drops under its tile, and each path lights on its word with a dashed line that
 *              crosses the fence into the plan.
 *   adversary  the composition moves left; BLIND ARCHITECT's tag («BLIND ARCHITECT · sección 3» / «vive
 *              de los planos con atajos») enters on the right and glows on «atajos»; on «camino» the three
 *              paths light again, one by one. Last frame: the paths and the tag.
 */
export function S01Hook(props: SceneProps) {
  const frame = useCurrentFrame();
  const planAt = Math.max(8, props.cue('plan') - 36);
  const bridgeAt = props.cue('bridge');
  const titleAt = Math.min(props.cue('title') - 6, 12 * 30 - 22);
  const pathsAt = props.cue('paths');
  const advAt = props.cue('adversary');

  // The chips ride the promise (`promise` opens s01-03); each lands on its own word.
  const chipAt = PROMISE.map((p) => Math.max(props.cue('promise'), wordFrame(S, 's01-03', p.word) - 6));
  const pathAt = PATHS.map((p) => wordFrame(S, 's01-04', p.word) - 6);
  const atajosAt = wordFrame(S, 's01-05', 'atajos') - 6;
  const caminoAt = wordFrame(S, 's01-05', 'camino') - 4;

  // ---- Phases.
  const toB = progress(frame, titleAt - 8, 24, EASE.inOut);
  const toC = progress(frame, pathsAt - 8, 28, EASE.inOut);
  const toD = progress(frame, advAt - 14, 26, EASE.inOut);

  // ---- The plan's place.
  const px = mix(mix(PLAN_A.x, PLAN_B.x, toB), PLAN_C.x, toC);
  const py = mix(mix(PLAN_A.y, PLAN_B.y, toB), PLAN_C.y, toC);
  const pk = mix(mix(PLAN_A.k, PLAN_B.k, toB), PLAN_C.k, toC);
  // It steps back while the title and the promise are on, comes back for the paths.
  const planDim = 0.5 * toB * (1 - toC);
  const stampGlow = windowWeight(frame, bridgeAt, titleAt, { ramp: 14 });

  // ---- Title block.
  const titleOut = progress(frame, pathsAt - 12, 14, EASE.inOut);
  const titleIn = enter(frame, titleAt, { distance: 22, duration: 18 });
  const subIn = enter(frame, titleAt + 10, { distance: 14, duration: 16 });

  // ---- Chips: in a row under the title (B), then under their tiles (C).
  const chipY = mix(CHIPS_TOP_B, CHIPS_TOP_C, toC);
  const chipLit = (i: number) => {
    if (frame < pathsAt - 8) {
      // B: each lights on its word, then steps half back when the next one comes.
      const next = chipAt[i + 1] ?? pathsAt - 20;
      return progress(frame, chipAt[i], 10) * (1 - 0.55 * progress(frame, next - 2, 12, EASE.inOut));
    }
    return pathLit(i);
  };

  // ---- Paths: tiles in, each lit on its word (the last one stays lit until the adversary), lit again on «camino».
  const tileIn = (i: number) => progress(frame, pathsAt + 14 + i * 6, 18);
  const pathOn = (i: number) => progress(frame, pathAt[i], 18);
  const relit = (i: number) => windowWeight(frame, caminoAt + i * 10, caminoAt + i * 10 + 36, { ramp: 10 });
  function pathLit(i: number) {
    const next = pathAt[i + 1] ?? advAt - 10;
    const own = progress(frame, pathAt[i], 12) * (1 - 0.5 * progress(frame, next, 14, EASE.inOut));
    return Math.max(own, relit(i));
  }
  const fenceDraw = progress(frame, pathsAt + 2, 30, EASE.inOut);

  // ---- Composition (D).
  const compK = mix(1, COMP_D_K, toD);
  const tagIn = enter(frame, advAt + 6, { distance: 26, duration: 18, axis: 'x' });
  const tagGlow = windowWeight(frame, atajosAt, Number.POSITIVE_INFINITY, { ramp: 14 });

  return (
    <Stage style={{ fontFamily: FONT.sans }}>
      {/* ================= Everything but the tag (shrinks left on `adversary`) ================= */}
      <div style={{ position: 'absolute', left: 0, top: 0, width: W, height: H, transform: `scale(${compK})`, transformOrigin: `0px ${H / 2}px` }}>
        {/* The fence (C) */}
        {fenceDraw > 0.001 ? (
          <div style={{ position: 'absolute', left: FENCE.x, top: FENCE.y }}>
            <Fence width={FENCE.w} height={FENCE.h} draw={fenceDraw} />
          </div>
        ) : null}

        {/* The approved zone plan */}
        <div style={{ position: 'absolute', left: px, top: py, width: PW, height: PH, transform: `scale(${pk})`, transformOrigin: '0 0', ...dimStyle(planDim) }}>
          <ZoneRow width={PW} at={planAt} stagger={7} />
          <div style={{ position: 'absolute', left: STAMP_AT.x, top: STAMP_AT.y, filter: stampGlow > 0.01 ? `drop-shadow(0 0 ${Math.round(18 * stampGlow)}px ${alpha(C.emerald, 0.45 * stampGlow)})` : undefined }}>
            <ApprovedStamp frame={frame} at={bridgeAt - 2} />
          </div>
        </div>

        {/* Paths: dashed lines from each tile, across the fence, into the plan */}
        {toC > 0.001 ? (
          <svg width={W} height={H} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
            {SLOT_X.map((x, i) => {
              const on = pathOn(i);
              if (on <= 0.001) return null;
              const xe = PLAN_C.x + PW * PLAN_C_K * ENTRY[i];
              const y0 = TILE_TOP - 6;
              const y1 = PLAN_C_BOTTOM + 14;
              const d = `M ${x} ${y0} C ${x} ${y0 - 60}, ${xe} ${y1 + 50}, ${xe} ${y1}`;
              const lit = pathLit(i);
              const col = alpha(C.cyan, 0.55 + 0.45 * lit);
              return (
                <g key={i}>
                  <path d={d} fill="none" stroke={col} strokeWidth={5 + 2 * lit} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - on} />
                  {on > 0.98 ? (
                    <path d={d} fill="none" stroke={alpha(C.cyanSoft, 0.9 * lit)} strokeWidth={5} strokeLinecap="round" strokeDasharray="10 22" strokeDashoffset={-frame * 1.6} />
                  ) : null}
                  {on > 0.9 ? <ArrowHead x={xe} y={y1 - 4} angle={-Math.PI / 2} size={20} color={col} /> : null}
                </g>
              );
            })}
          </svg>
        ) : null}

        {/* The three path tiles */}
        {SLOT_X.map((x, i) => (
          <div key={PATHS[i].kind} style={{ position: 'absolute', left: x - PATH_TILE.w / 2, top: TILE_TOP }}>
            <PathTile kind={PATHS[i].kind} show={tileIn(i)} lit={pathLit(i)} dim={0.6 * (1 - pathOn(i))} />
          </div>
        ))}

        {/* Title + English line */}
        {frame >= titleAt - 2 && titleOut < 1 ? (
          <div style={{ position: 'absolute', left: 0, top: 0, width: W, textAlign: 'center', opacity: 1 - titleOut, transform: `translateY(${-18 * titleOut}px)` }}>
            <div style={{ ...titleIn }}>
              <div style={{ fontSize: 66, fontWeight: 850, letterSpacing: -1.3, lineHeight: 1.08, color: C.textStrong, whiteSpace: 'nowrap' }}>
                {TITLE.lead}
                <span style={{ color: C.cyan }}>{TITLE.lit}</span>
              </div>
            </div>
            <div style={{ position: 'absolute', left: 0, top: SUB_TOP, width: W, ...subIn }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 18, fontFamily: FONT.mono, fontSize: 34, fontWeight: 700, color: C.muted, whiteSpace: 'nowrap' }}>
                {SUBTITLE.map((t, i) => (
                  <span key={t} style={{ display: 'inline-flex', alignItems: 'center', gap: 18 }}>
                    {i ? <span style={{ color: C.faint }}>·</span> : null}
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ) : null}

        {/* Promise chips: under the title, then under their paths */}
        {PROMISE.map((p, i) => {
          if (frame < chipAt[i] - 2) return null;
          const e = enter(frame, chipAt[i], { distance: 16 });
          return (
            <div key={p.text} style={{ position: 'absolute', left: SLOT_X[i], top: chipY, transform: 'translateX(-50%)' }}>
              <div style={{ ...e }}>
                <PromiseChip text={p.text} icon={p.icon} lit={chipLit(i)} />
              </div>
            </div>
          );
        })}
      </div>

      {/* ================= BLIND ARCHITECT: lives off plans with shortcuts ================= */}
      {frame >= advAt ? (
        <div style={{ position: 'absolute', left: TAG_X, top: 0, height: H, display: 'flex', alignItems: 'center', ...tagIn }}>
          <AdversaryTag glow={tagGlow} />
        </div>
      ) : null}
    </Stage>
  );
}

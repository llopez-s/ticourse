import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { mix } from '../../../engine/src/ui';
import { ENTRIES, USB } from '../data/map';
import { BELL, NONE_BROKEN, POCKET_SURFACE, POCKET_VECTOR, SURFACE, VECTOR } from '../data/s02-mapa';
import { BACKPACK, Backpack, POCKET_CENTRE } from './parts/Backpack';
import { EntryMap, MAP } from './parts/EntryMap';
import { CaseTag, ImageTag, Pill, TermPill } from './parts/Labels';
import { Stage, wordFrame } from './kit';

const S = 's02-mapa';

// ---- Phase A: the map, almost full stage, under the case tag.
const MAP_S0 = 0.95;
const MAP_X0 = Math.round((1728 - MAP.w * MAP_S0) / 2);
const MAP_Y0 = 70;
/** The free block under the reception, in stage coordinates (between the left and right boxes). */
const NOTE = { x: MAP_X0 + 494 * MAP_S0, y: MAP_Y0 + 474 * MAP_S0, w: 748 * MAP_S0 } as const;
// ---- Phase B: the map steps left and small; the backpack comes in on the right.
const MAP_S1 = 0.6;
const MAP_X1 = 0;
const MAP_Y1 = 130;
const PACK_W = 360;
const PACK_H = (PACK_W * BACKPACK.h) / BACKPACK.w;
const PACK = { x: 1270, y: 66 } as const;
const PK = PACK_W / BACKPACK.w;
const LABELS_TOP = PACK.y + PACK_H + 24;

/**
 * s02-mapa «El mapa de la recepción». «Caso de ejemplo · sin fecha». On `map` Systems' sheet lands with the reception in
 * the middle; on `lines` five hand-drawn lines reach the counter, each with what it is; on `names` each gets its exam
 * chip in English (the voice never reads them). On `none-broken`, «ninguna tiene hoy un fallo conocido · cuentan las
 * cinco». On `one` the USB line lights — a dot runs along it — and the rest step back: «Threat vector · un camino»; on
 * `all` every line lights and the sheet is ringed: «Attack surface · todos los caminos». On `backpack` the map steps
 * left and the backpack in the metro comes in on the right («imagen · no es del puerto»): the pickpocket's hand goes
 * into the top pocket on «carterista», «el vector» on its word, every pocket outlined on «superficie». On `sew` the
 * left pocket is stitched shut (no caption; the printer panel stays on the map); on `bell` a jingle bell hangs from
 * the right one and rings — «te avisa, pero sigue ahí».
 */
export function S02Mapa(props: SceneProps) {
  const frame = useCurrentFrame();
  const mapAt = props.cue('map');
  const linesAt = props.cue('lines');
  const namesAt = props.cue('names');
  const noneAt = props.cue('none-broken');
  const oneAt = props.cue('one');
  const allAt = props.cue('all');
  const packAt = props.cue('backpack');
  const sewAt = props.cue('sew');
  const bellAt = props.cue('bell');
  const handAt = wordFrame(S, 's02-04', 'carterista') - 10;
  const vecWord = wordFrame(S, 's02-04', 'vector') - 6;
  const surfWord = wordFrame(S, 's02-04', 'superficie') - 6;
  const vectorWord = wordFrame(S, 's02-03', 'threat') - 6;
  const surfaceWord = wordFrame(S, 's02-03', 'attack') - 6;

  // ---- the map
  const sheet = progress(frame, mapAt - 10, 16);
  const line = ENTRIES.map((_, i) => progress(frame, linesAt - 4 + i * 6, 16));
  const label = ENTRIES.map((_, i) => progress(frame, linesAt + 2 + i * 6, 14));
  const chip = ENTRIES.map((_, i) => progress(frame, namesAt + i * 6, 12));
  const oneOn = progress(frame, oneAt, 14) * (1 - progress(frame, allAt - 4, 12));
  const allOn = progress(frame, allAt, 16) * (1 - 0.55 * progress(frame, packAt, 20));
  const lit = ENTRIES.map((_, i) => (i === USB ? oneOn : 0));
  const dim = ENTRIES.map((_, i) => (i === USB ? 0 : oneOn));

  const glide = progress(frame, packAt - 10, 26, EASE.inOut);
  const ms = mix(MAP_S0, MAP_S1, glide);
  const mx = mix(MAP_X0, MAP_X1, glide);
  const my = mix(MAP_Y0, MAP_Y1, glide);

  // ---- the notes under the reception (phase A only)
  const notesOut = progress(frame, packAt - 14, 12);
  const noneIn = progress(frame, noneAt - 2, 14) * (1 - progress(frame, oneAt - 8, 10));
  const vecIn = progress(frame, Math.min(oneAt + 6, vectorWord), 12) * (1 - progress(frame, allAt - 8, 10));
  const surfIn = progress(frame, Math.min(allAt + 6, surfaceWord), 12);

  // ---- the backpack (phase B)
  const packIn = progress(frame, packAt + 4, 18);
  const hand = progress(frame, handAt, 22, EASE.inOut);
  const vecLabel = progress(frame, vecWord, 12);
  const surf = progress(frame, surfWord, 14);
  const sewn = progress(frame, sewAt + 4, 40, EASE.inOut);
  const bellIn = progress(frame, bellAt - 2, 14);
  const ring = progress(frame, bellAt + 6, 10) * (1 - progress(frame, bellAt + 110, 30));
  const bellLabel = progress(frame, wordFrame(S, 's02-06', 'avisa') - 4, 12);
  const topPocket = { x: PACK.x + POCKET_CENTRE.top.x * PK, y: PACK.y + POCKET_CENTRE.top.y * PK };

  return (
    <Stage>
      <div style={{ position: 'absolute', inset: 0, fontFamily: FONT.sans }}>
        <div style={{ position: 'absolute', left: 0, top: 0, ...enter(frame, -6, { distance: 12, duration: 14 }) }}>
          <CaseTag />
        </div>

        {/* the map */}
        <div style={{ position: 'absolute', left: mx, top: my, transform: `scale(${ms})`, transformOrigin: '0 0', opacity: 0.35 + 0.65 * sheet }}>
          <EntryMap frame={frame} sheet={0.3 + 0.7 * sheet} line={line} label={label} chip={chip} lit={lit} dim={dim} surface={allOn} />
        </div>

        {/* the notes under the reception */}
        {notesOut < 0.99 ? (
          <div style={{ position: 'absolute', left: NOTE.x, top: NOTE.y, width: NOTE.w, height: 120, opacity: 1 - notesOut }}>
            {noneIn > 0.01 ? (
              <div style={{ position: 'absolute', left: 0, top: 6, width: NOTE.w, textAlign: 'center', opacity: noneIn, transform: `translateY(${(1 - noneIn) * 10}px)` }}>
                <div style={{ fontSize: 34, fontWeight: 750, color: C.text, lineHeight: 1.2 }}>{NONE_BROKEN[0]}</div>
                <div style={{ fontSize: 36, fontWeight: 850, color: C.emerald, lineHeight: 1.25 }}>{NONE_BROKEN[1]}</div>
              </div>
            ) : null}
            {vecIn > 0.01 ? (
              <div style={{ position: 'absolute', left: 0, top: 22, width: NOTE.w, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 18, opacity: vecIn }}>
                <TermPill text={VECTOR.term} size={38} on={vecIn} />
                <span style={{ fontSize: 36, fontWeight: 800, color: C.cyanSoft, whiteSpace: 'nowrap' }}>{VECTOR.plain}</span>
              </div>
            ) : null}
            {surfIn > 0.01 ? (
              <div style={{ position: 'absolute', left: 0, top: 22, width: NOTE.w, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 18, opacity: surfIn }}>
                <TermPill text={SURFACE.term} size={36} on={surfIn} />
                <span style={{ fontSize: 34, fontWeight: 800, color: C.cyanSoft, whiteSpace: 'nowrap' }}>{SURFACE.plain}</span>
              </div>
            ) : null}
          </div>
        ) : null}

        {/* the backpack */}
        {packIn > 0.01 ? (
          <>
            <div style={{ position: 'absolute', left: PACK.x, top: PACK.y, opacity: packIn, transform: `translateX(${(1 - packIn) * 30}px)` }}>
              <Backpack
                width={PACK_W}
                frame={frame}
                lit={{ top: vecLabel * (1 - 0.6 * surf) }}
                open={{ top: hand * 0.8 }}
                hand={{ pocket: 'top', at: hand * (1 - progress(frame, sewAt - 10, 14)) }}
                surface={surf}
                sewn={sewn}
                bell={bellIn}
                ring={ring}
                dim={progress(frame, sewAt, 14) * 0.6}
              />
            </div>
            <div style={{ position: 'absolute', left: PACK.x - 100, top: 0, width: PACK_W + 200, display: 'flex', justifyContent: 'center', opacity: packIn }}>
              <ImageTag />
            </div>
            {vecLabel > 0.01 ? (
              <>
                <svg width={1728} height={660} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: vecLabel * (1 - 0.5 * surf) }}>
                  <line x1={topPocket.x - 136} y1={topPocket.y} x2={topPocket.x - 54} y2={topPocket.y} stroke={C.cyan} strokeWidth={4} strokeLinecap="round" />
                  <circle cx={topPocket.x - 54} cy={topPocket.y} r={6} fill={C.cyan} />
                </svg>
                <div style={{ position: 'absolute', left: topPocket.x - 136 - 230, top: topPocket.y - 29, width: 220, display: 'flex', justifyContent: 'flex-end', opacity: vecLabel * (1 - 0.5 * surf) }}>
                  <Pill text={POCKET_VECTOR} tone={C.cyan} size={34} on={vecLabel * (1 - surf)} />
                </div>
              </>
            ) : null}
            {surf > 0.01 ? (
              <div style={{ position: 'absolute', left: PACK.x - 140, top: LABELS_TOP, width: PACK_W + 280, display: 'flex', justifyContent: 'center', opacity: surf * (1 - 0.5 * bellLabel) }}>
                <Pill text={POCKET_SURFACE} tone={C.violet} size={34} on={surf * (1 - bellLabel)} />
              </div>
            ) : null}
            {bellLabel > 0.01 ? (
              <div style={{ position: 'absolute', left: PACK.x - 180, top: LABELS_TOP + 70, width: PACK_W + 360, display: 'flex', justifyContent: 'center', ...enter(frame, wordFrame(S, 's02-06', 'avisa') - 4, { distance: 10, duration: 12 }) }}>
                <Pill text={BELL} icon="bell" tone={C.amber} size={34} on={bellLabel} />
              </div>
            ) : null}
          </>
        ) : null}
      </div>
    </Stage>
  );
}

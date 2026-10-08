import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, alpha } from '../../../engine/src/theme/tokens';
import { EASE, progress, pulse } from '../../../engine/src/theme/motion';
import { mix, windowWeight } from '../../../engine/src/ui';
import { CLUES, LABEL_CAPTION, LNK_GLOSS, WEAPON_GLOSS } from '../data/s05-taller';
import { Lupa, PhaseTitle, Vignette } from './parts/KillChain';
import { INFERRED_NOTE, LogLine, logLineSpan, logLineWidth } from './parts/LessonLog';
import { TrapBox, trapBoxHeight, trapBoxLabelSlot } from './parts/TrapBox';
import { WorkshopLabel } from './parts/WorkshopLabel';
import { Stage, segment, wordFrame } from './kit';

const S = 's05-taller';
const W = 1728;

/** The workshop: vignette 2 with its door shut, its left edge out of frame. */
const SHOP = { x: -100, y: 150, w: 480 } as const;
/** Where the door's right edge sits in the shut-door drawing (design units). */
const SHOP_DOOR = { x: 180, y: 90 } as const;
/** The box he left at your door: centred first, then to the left when its clues come out (`clues`). */
const BOX = { x: 430, y: 290, w: 410 } as const;
const BOX_X0 = 800;
const BOX_H = trapBoxHeight(BOX.w);

/** The zoomed attachment line, its gloss and the lesson's note (top band, after the message). */
const LINE = { x: 430, y: 22, size: 34 } as const;
const LINE_END = { size: 24, y: 10 } as const;
const GLOSS = { x: 430, y: 90, size: 34 } as const;
const NOTE = { x: 430, y: 150, size: 32 } as const;
const NOTE_END = { size: 26, y: 62 } as const;

const CLUE_X = 900;
const CLUE_Y = [236, 320, 404] as const;
const CLUE_SIZE = 40;

const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

function steps(frame: number, xs: number[], ys: number[]): number {
  const fixed = xs.reduce<number[]>((acc, x) => [...acc, acc.length ? Math.max(x, acc[acc.length - 1] + 1) : x], []);
  return interpolate(frame, fixed, ys, clamp);
}

/** Rough width of the Inter note line at `size` (for right-aligning it). */
const noteWidth = (size: number) => INFERRED_NOTE.length * size * 0.5;

/**
 * s05-taller «El taller que no ves». GLASS VIPER's card owns the top centre
 * while the scene opens on the thief's workshop — vignette 2 with its door
 * shut, half out of frame on the left — and, on «la caja», the box he left at
 * your door. `door`: light under the shut door. `box`: the box opens in layers
 * («capa a capa»): flaps, the paper disguise aside, the device up (dark: nobody
 * runs it here). `lnk`: the attachment line, zoomed, its parts lit on the
 * voice — ZIP (the box), «acceso directo» (the device, .lnk), PDF (the sheet,
 * .pdf) — and «un acceso directo que se hace pasar por un PDF, dentro de un
 * ZIP». `inferred`: the lesson's note and a dashed cyan line from the box back
 * to the shut door. `clues`: three clues come out of the box; the third,
 * «rutas de compilación (PDB)», points at «la etiqueta del taller» sewn on the
 * device inside the open box — its field blank. `weaponization`: WEAPONIZATION
 * with the magnifier, «no se observa · se deduce», the workshop dashed cyan.
 */
export function S05Taller(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const doorAt = props.cue('door');
  const lnkAt = props.cue('lnk');
  const inferredAt = props.cue('inferred');
  const cluesAt = props.cue('clues');
  const weapAt = props.cue('weaponization');
  const s03 = segment(props, 's05-03');

  const w = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);
  const wCaja1 = w('s05-01', 'caja');
  const wCerrada = w('s05-02', 'cerrada');
  const wCapa1 = w('s05-02', 'capa', 0);
  const wCapa2 = w('s05-02', 'capa', 1);
  const wPreparo = w('s05-02', 'preparó');
  const wZip = w('s05-03', 'ZIP');
  const wAcceso = w('s05-03', 'acceso');
  const wPdf = w('s05-03', 'PDF');
  const wConstruyo = w('s05-04', 'construyó');
  const wDeduces4 = w('s05-04', 'deduces');
  const wHecha = w('s05-05', 'hecha');
  const wHerramienta = w('s05-05', 'herramienta');
  const wEtiqueta = w('s05-05', 'etiqueta');
  const wDeduces6 = w('s05-06', 'deduces');

  // ---- The workshop and the box --------------------------------------------------------------------
  const doorLit = windowWeight(frame, doorAt, wCerrada + 40, { ramp: 12 });
  const dashedP = progress(frame, weapAt - 2, 16);
  const boxIn = progress(frame, wCaja1 - 8, 16, EASE.out);
  const layers = steps(frame, [wCapa1 - 4, wCapa1 + 16, wCapa2 - 2, wCapa2 + 18, wPreparo - 4, wPreparo + 22], [0, 1, 1, 2, 2, 3]);

  // ---- The attachment line, lit part by part ---------------------------------------------------------
  const lineIn = progress(frame, lnkAt - 4, 16);
  const zipH = windowWeight(frame, wZip - 2, wAcceso - 4, { ramp: 8 });
  const lnkH = windowWeight(frame, wAcceso - 4, wPdf - 4, { ramp: 8 });
  const pdfH = windowWeight(frame, wPdf - 4, s03.to - 6, { ramp: 8 });
  const glossIn = progress(frame, wPdf + 6, 14);
  const noteIn = progress(frame, inferredAt + 2, 14);
  const toCorner = progress(frame, weapAt - 8, 26, EASE.inOut);
  const lineSize = mix(LINE.size, LINE_END.size, toCorner);
  const lineW = logLineWidth('attachment', lineSize);
  const lineX = mix(LINE.x, W - logLineWidth('attachment', LINE_END.size) - 4, toCorner);
  const lineY = mix(LINE.y, LINE_END.y, toCorner);
  const noteSize = mix(NOTE.size, NOTE_END.size, toCorner);
  const noteX = mix(NOTE.x, W - noteWidth(NOTE_END.size) - 6, toCorner);
  const noteY = mix(NOTE.y, NOTE_END.y, toCorner);
  const topDim = 0.45 * progress(frame, cluesAt - 4, 14) * (1 - toCorner);

  // ---- Inference: the box points back to the shut door ------------------------------------------------
  const inferDraw = progress(frame, wConstruyo - 6, 30, EASE.inOut);
  const inferBright = Math.max(windowWeight(frame, wDeduces4 - 4, wDeduces4 + 40), windowWeight(frame, wDeduces6 - 4, wDeduces6 + 50));

  // ---- Clues ------------------------------------------------------------------------------------------
  const clueAt = [wHecha - 6, wHerramienta - 6, wEtiqueta - 8];
  const clueP = clueAt.map((at) => progress(frame, at, 18, EASE.out));
  const tagIn = progress(frame, wEtiqueta - 4, 16);
  const tagGlow = windowWeight(frame, wEtiqueta - 4, weapAt);
  const capIn = progress(frame, wEtiqueta + 8, 14);
  const cluesDim = 0.35 * progress(frame, weapAt, 16);

  // ---- WEAPONIZATION -----------------------------------------------------------------------------------
  const titleIn = progress(frame, weapAt + 4, 18);
  const lupaGlow = 0.4 + 0.6 * windowWeight(frame, wDeduces6 - 4, wDeduces6 + 50);
  const beat = pulse(frame, fps, 0.5);

  // Geometry
  const s = SHOP.w / 240;
  const doorEdge = { x: SHOP.x + SHOP_DOOR.x * s + 10, y: SHOP.y + SHOP_DOOR.y * s };
  const boxDrop = (1 - boxIn) * -40;
  const boxX = mix(BOX_X0, BOX.x, progress(frame, cluesAt - 16, 26, EASE.inOut));
  const slot = trapBoxLabelSlot(BOX.w, Math.max(0.01, layers - 2));
  const tagW = slot.w * 1.2;
  const tagAt = { x: boxX + slot.cx, y: BOX.y + slot.cy };
  const inferFrom = { x: boxX + 46, y: BOX.y + 0.62 * BOX_H };
  const inferPath = `M ${inferFrom.x} ${inferFrom.y} C ${inferFrom.x - 70} ${inferFrom.y - 10}, ${doorEdge.x + 90} ${doorEdge.y + 30}, ${doorEdge.x} ${doorEdge.y}`;
  const lnk = logLineSpan('attachment', 'lnk', lineSize);
  const ch = lineSize * 0.6;
  const underline = (x0: number, x1: number, p: number) =>
    p > 0.01 ? <div style={{ position: 'absolute', left: x0, top: lineSize * 1.5 + 2, width: (x1 - x0) * p, height: 5, borderRadius: 3, background: C.amber, boxShadow: `0 0 12px ${alpha(C.amber, 0.6)}` }} /> : null;

  return (
    <Stage>
      {/* The workshop, door shut, half out of frame */}
      <div style={{ position: 'absolute', left: 0, top: 0, width: W, height: 660, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', left: SHOP.x, top: SHOP.y }}>
          <Vignette
            phase="weaponization"
            width={SHOP.w}
            frame={frame}
            look={{ variant: 'closed', lit: Math.max(0.8 * doorLit, 0.7 * dashedP), tone: dashedP > 0.3 ? 'cyan' : 'rose', dashed: dashedP }}
          />
        </div>
      </div>

      {/* Inference: dashed cyan from the box back to the shut door */}
      {inferDraw > 0.01 ? (
        <svg width={W} height={660} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
          <defs>
            <mask id="s05-infer-draw" maskUnits="userSpaceOnUse" x={0} y={0} width={W} height={660}>
              <path d={inferPath} fill="none" stroke="#ffffff" strokeWidth={16} pathLength={1000} strokeDasharray={`${1000 * inferDraw} 1000`} />
            </mask>
          </defs>
          <path
            d={inferPath}
            fill="none"
            stroke={C.cyan}
            strokeWidth={4 + 1.5 * inferBright}
            strokeDasharray="12 10"
            strokeLinecap="round"
            opacity={0.6 + 0.4 * inferBright}
            mask="url(#s05-infer-draw)"
          />
          {inferDraw > 0.95 ? (
            <path
              d={`M ${doorEdge.x + 18} ${doorEdge.y - 12} L ${doorEdge.x} ${doorEdge.y} L ${doorEdge.x + 20} ${doorEdge.y + 8}`}
              fill="none"
              stroke={C.cyan}
              strokeWidth={4}
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={0.6 + 0.4 * inferBright}
            />
          ) : null}
        </svg>
      ) : null}

      {/* Your doorstep and the box on it */}
      {boxIn > 0.01 ? (
        <>
          <div
            style={{
              position: 'absolute',
              left: boxX - 24,
              top: BOX.y + BOX_H - 34,
              width: BOX.w + 48,
              height: 22,
              borderRadius: 6,
              background: '#3f4a5c',
              border: `2px solid #5b6b82`,
              opacity: boxIn,
            }}
          />
          <div style={{ position: 'absolute', left: boxX, top: BOX.y + boxDrop }}>
            <TrapBox
              width={BOX.w}
              show={boxIn}
              layers={layers}
              highlight={{ box: zipH, device: lnkH, sheet: pdfH }}
            >
              <WorkshopLabel width={tagW} show={tagIn} glow={tagGlow * (0.6 + 0.4 * beat)} />
            </TrapBox>
          </div>
        </>
      ) : null}

      {/* The attachment line, zoomed, its parts lit on the voice */}
      {lineIn > 0.01 ? (
        <div style={{ position: 'absolute', left: lineX, top: lineY, opacity: lineIn * (1 - topDim), transform: `translateY(${(1 - lineIn) * 12}px)` }}>
          <LogLine id="attachment" size={lineSize} highlight={{ zip: zipH, lnk: Math.max(lnkH, pdfH) }} />
          {underline(lnk.x0 + 16 * ch, lnk.x1, lnkH)}
          {underline(lnk.x0 + 12 * ch, lnk.x0 + 16 * ch, pdfH)}
          <div style={{ position: 'absolute', left: 0, top: 0, width: lineW }} />
        </div>
      ) : null}
      {glossIn * (1 - toCorner) > 0.01 ? (
        <div
          style={{
            position: 'absolute',
            left: GLOSS.x,
            top: GLOSS.y,
            fontFamily: FONT.sans,
            fontSize: GLOSS.size,
            fontWeight: 750,
            color: '#fde68a',
            whiteSpace: 'nowrap',
            opacity: glossIn * (1 - toCorner) * (1 - topDim),
            transform: `translateY(${(1 - glossIn) * 10}px)`,
          }}
        >
          {LNK_GLOSS}
        </div>
      ) : null}
      {noteIn > 0.01 ? (
        <div
          style={{
            position: 'absolute',
            left: noteX,
            top: noteY,
            paddingLeft: 16,
            borderLeft: `4px dashed ${C.cyan}`,
            fontFamily: FONT.sans,
            fontSize: noteSize,
            fontWeight: 650,
            fontStyle: 'italic',
            color: C.text,
            whiteSpace: 'nowrap',
            opacity: noteIn * (1 - topDim),
            transform: `translateY(${(1 - noteIn) * 10}px)`,
          }}
        >
          <span style={{ color: C.cyanSoft, fontWeight: 800 }}>{INFERRED_NOTE.slice(0, INFERRED_NOTE.indexOf(':') + 1)}</span>
          {INFERRED_NOTE.slice(INFERRED_NOTE.indexOf(':') + 1)}
        </div>
      ) : null}

      {/* Three clues come out of the box */}
      {CLUES.map((text, i) => {
        const p = clueP[i];
        if (p <= 0.01) return null;
        const from = { x: boxX + BOX.w * 0.8, y: BOX.y + BOX_H * 0.35 };
        const y = CLUE_Y[i];
        const cy = y + CLUE_SIZE * 0.62;
        const x = mix(from.x, CLUE_X, p);
        return (
          <div key={text} style={{ position: 'absolute', inset: 0, opacity: (1 - cluesDim) * Math.min(1, p * 2) }}>
            <svg width={W} height={660} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
              <line x1={from.x} y1={from.y} x2={x - 18} y2={mix(from.y, cy, p)} stroke={alpha(C.cyan, 0.35)} strokeWidth={2.5} strokeDasharray="4 7" />
              <circle cx={x - 18} cy={mix(from.y, cy, p)} r={8} fill={C.cyan} />
            </svg>
            <div
              style={{
                position: 'absolute',
                left: x,
                top: mix(from.y - CLUE_SIZE * 0.62, y, p),
                fontFamily: FONT.sans,
                fontSize: CLUE_SIZE,
                fontWeight: 760,
                color: C.textStrong,
                whiteSpace: 'nowrap',
                transform: `scale(${0.6 + 0.4 * p})`,
                transformOrigin: 'left center',
              }}
            >
              {text}
            </div>
          </div>
        );
      })}

      {/* The third clue points at the tag on the device, inside the open box */}
      {tagIn > 0.01 && clueP[2] > 0.9 ? (
        <svg width={W} height={660} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: tagIn * (1 - cluesDim) }}>
          <path
            d={`M ${CLUE_X - 30} ${CLUE_Y[2] + CLUE_SIZE * 0.62} C ${CLUE_X - 120} ${CLUE_Y[2] + 40}, ${tagAt.x + tagW / 2 + 90} ${tagAt.y}, ${tagAt.x + tagW / 2 + 8} ${tagAt.y}`}
            fill="none"
            stroke="#fcd34d"
            strokeWidth={3}
            strokeLinecap="round"
            strokeDasharray={`${420 * tagIn} 500`}
          />
        </svg>
      ) : null}
      {capIn > 0.01 ? (
        <div
          style={{
            position: 'absolute',
            left: CLUE_X,
            top: CLUE_Y[2] + 58,
            fontFamily: FONT.sans,
            fontSize: 32,
            fontWeight: 700,
            fontStyle: 'italic',
            color: '#fde68a',
            whiteSpace: 'nowrap',
            opacity: capIn * (1 - cluesDim),
          }}
        >
          {LABEL_CAPTION}
        </div>
      ) : null}

      {/* WEAPONIZATION, with the magnifier */}
      {titleIn > 0.01 ? (
        <div style={{ position: 'absolute', left: 6, top: 4 }}>
          <PhaseTitle phase="weaponization" sub={WEAPON_GLOSS} show={titleIn} icon={<Lupa glow={lupaGlow} />} size={56} subSize={36} />
        </div>
      ) : null}

    </Stage>
  );
}

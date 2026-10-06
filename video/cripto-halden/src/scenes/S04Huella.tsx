import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../engine/src/theme/motion';
import { clamp01, cubicPoint, mix, windowWeight, type Point } from '../../../engine/src/ui';
import { S04 } from '../data/s04-huella';
import { FingerprintMachine, HashLine, OfferSheet, hashLineSize, machineAnchors, offerSheetSize } from './parts/Fingerprint';
import { HouseKey } from './parts/Mailbox';
import { CrossBadge, LookTag, MarkStamp, TermTag } from './parts/s04-huella/marks';
import { Stage, wordFrame } from './kit';

const S = 's04-huella';
const W = 1728;

// ---- Phase A: offer (left) → machine (centre) → line (right)
const DOC = { x: 30, y: 140, w: 430 } as const;
const DOC_SIZE = offerSheetSize(DOC.w, true);
const MACHINE = { x: 590, y: 180, w: 560 } as const;
const MA = machineAnchors(MACHINE.w);
const INLET = { x: MACHINE.x + MA.inlet.x, y: MACHINE.y + MA.inlet.y };
const OUTLET = { x: MACHINE.x + MA.outlet.x, y: MACHINE.y + MA.outlet.y };
const LINE_SIZE = 60;
const LINE_BOX = hashLineSize(S04.print, LINE_SIZE);
const LINE = { x: 1200, y: OUTLET.y - LINE_BOX.h / 2 } as const;
/** Where the stuck fingerprint sits on the sheet (OfferSheet's attached line, size 30). */
const ATTACHED_SIZE = Math.round(30 * (DOC.w / 360));
const ATTACHED_BOX = hashLineSize(S04.print, ATTACHED_SIZE);
const DOC_PAD = Math.round(20 * (DOC.w / 360));
const ATTACHED = {
  x: DOC.x + 3 + DOC_PAD + (DOC.w - 6 - 2 * DOC_PAD - ATTACHED_BOX.w) / 2,
  y: DOC.y + DOC_SIZE.h - 3 - DOC_PAD - ATTACHED_BOX.h,
} as const;
/** The ghost copy of the sheet that the machine reads. */
const GHOST_SCALE = 0.5;
const GHOST = { w: DOC.w * GHOST_SCALE, h: offerSheetSize(DOC.w).h * GHOST_SCALE } as const;

// ---- Phase B: the collision (left) and the algorithms (right)
const COL_DOC = { x: 40, w: 150, h: 172 } as const;
const COL_Y = [196, 432] as const;
const COL_LINE_SIZE = 48;
const COL_LINE_BOX = hashLineSize(S04.collision.value, COL_LINE_SIZE);
const COL_LINE_X = 470;
const BOARD = { x: 1170, w: W - 1170 } as const;

/** The way back (struck): from the top of the line, over the machine, to the top-right of the sheet. */
const BACK: [Point, Point, Point, Point] = [
  { x: LINE.x + LINE_BOX.w * 0.35, y: LINE.y - 8 },
  { x: 1240, y: 30 },
  { x: 600, y: 30 },
  { x: DOC.x + DOC.w - 50, y: DOC.y - 12 },
];

/** Points of the way back up to t (0–1), for a polyline. */
function backPoints(t: number): string {
  const n = 48;
  const pts: string[] = [];
  for (let i = 0; i <= n; i++) {
    const p = cubicPoint(BACK, (i / n) * clamp01(t));
    pts.push(`${p.x.toFixed(1)},${p.y.toFixed(1)}`);
  }
  return pts.join(' ');
}

/**
 * s04-huella «Una huella no se descifra».
 *   machine     the offer (left) is read by the SHA-256 machine: a ghost copy slides into the inlet,
 *               the rollers turn and the short line `e3a1…9c07` comes out on the right; on «siempre»
 *               a bracket under it: «siempre igual de larga · 64 caracteres; aquí, abreviada».
 *   print       a copy of the line flies onto the sheet: the fingerprint stuck to the offer, «la
 *               huella de la oferta».
 *   change      «12,40» becomes «12,41» (amber); the copy goes through again and the line at the
 *               outlet flips EVERY character to `58bd…f26e`, while the one on the sheet keeps the
 *               old value — compare them: «integridad: ¿ha cambiado?» (on «integridad»).
 *   one-way     a way back from the line to the offer, over the machine, struck (on «no sacas»);
 *               a key, struck (on «clave»); «una sola dirección · sin clave · no se descifra».
 *   hash        HASH, «no es cifrado» (on «cifrado»).
 *   collision   phase B: two different documents, one line each, both `a46f…0d3b`, ringed amber:
 *               COLLISION «colisión: dos documentos, la misma huella».
 *   retired     MD5 and SHA-1 (MD5 now on the arrows) with the stamp «retirados» (on
 *               «retirados»); then SHA-256 and SHA-3, «hoy». Holds to the end.
 */
export function S04Huella(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const w = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);

  const machineAt = props.cue('machine');
  const printAt = props.cue('print');
  const changeAt = props.cue('change');
  const oneWayAt = props.cue('one-way');
  const hashAt = props.cue('hash');
  const collisionAt = props.cue('collision');
  const retiredAt = props.cue('retired');

  const at = {
    maquina: w('s04-01', 'máquina'),
    sale: w('s04-01', 'sale'),
    siempre: w('s04-01', 'siempre'),
    centimo: w('s04-02', 'céntimo'),
    cambia: w('s04-02', 'cambia'),
    integridad: w('s04-02', 'integridad'),
    sacas: w('s04-03', 'sacas'),
    clave: w('s04-03', 'clave'),
    cifrado: w('s04-04', 'cifrado'),
    retirados: w('s04-05', 'retirados'),
  };

  // ---------------- Phase A ----------------
  const aIn = progress(frame, 0, 16);
  const aOut = progress(frame, collisionAt - 10, 16, EASE.inOut);

  // Pass 1: the copy goes in, the machine runs, the line comes out.
  const feed1From = Math.min(machineAt + 6, at.maquina - 30);
  const feed1 = progress(frame, feed1From, 40, EASE.inOut);
  const outFrom = Math.max(feed1From + 30, at.sale - 6);
  const lineOut = progress(frame, outFrom, 18);
  const lineReveal = progress(frame, outFrom + 4, 22, EASE.linear);
  const bracket = windowWeight(frame, at.siempre - 2, changeAt, { ramp: 12 });

  // print: a copy flies onto the sheet.
  const fly = progress(frame, printAt - 2, 22, EASE.inOut);
  const stuck = progress(frame, printAt + 16, 8);
  const printLabel = progress(frame, printAt + 10, 14);

  // change: the cent, pass 2, every character flips.
  const cent = progress(frame, at.centimo - 2, 16);
  const feed2From = Math.max(changeAt + 10, at.centimo + 8);
  const feed2 = progress(frame, feed2From, 26, EASE.inOut);
  const morphFrom = Math.max(feed2From + 18, at.cambia - 4);
  const morph = progress(frame, morphFrom, 30, EASE.linear);
  const changed = morph > 0.001;
  const changeLabel = windowWeight(frame, morphFrom + 6, oneWayAt + 6, { ramp: 12 });
  const integrity = progress(frame, at.integridad - 4, 14);
  const compare = windowWeight(frame, at.integridad - 4, oneWayAt, { ramp: 12 });

  const run = Math.max(
    windowWeight(frame, feed1From + 16, outFrom + 30, { ramp: 8 }),
    windowWeight(frame, feed2From + 8, morphFrom + 30, { ramp: 8 }),
    0.6 * windowWeight(frame, oneWayAt, hashAt, { ramp: 12 }),
  );

  // one-way: the road back, struck; the key, struck.
  const backDraw = progress(frame, oneWayAt + 2, 26, EASE.inOut);
  const backCross = progress(frame, at.sacas - 4, 12);
  const keyIn = progress(frame, at.clave - 8, 12);
  const keyCross = progress(frame, at.clave + 4, 10);
  const oneWayLabel = progress(frame, oneWayAt + 10, 16);

  // hash
  const termSubAt = at.cifrado - 4;

  // ---------------- Phase B ----------------
  const bIn = progress(frame, collisionAt + 2, 18);
  const colDocs = [progress(frame, collisionAt + 2, 16), progress(frame, collisionAt + 10, 16)];
  const colLines = [progress(frame, collisionAt + 16, 16), progress(frame, collisionAt + 24, 16)];
  const colMark = progress(frame, collisionAt + 40, 14);
  const viaIn = progress(frame, retiredAt - 2, 14);
  const retiredIn = progress(frame, retiredAt, 16);
  const stampAt = at.retirados - 2;
  const todayIn = progress(frame, stampAt + 18, 16);

  // Positions for the flying copy (outlet line → sheet).
  const flyScale = mix(1, ATTACHED_SIZE / LINE_SIZE, fly);
  const flyX = mix(LINE.x, ATTACHED.x, fly);
  const flyY = mix(LINE.y, ATTACHED.y, fly) - Math.sin(Math.PI * fly) * 70;

  const apex = cubicPoint(BACK, 0.5);

  return (
    <Stage style={{ fontFamily: FONT.sans }}>
      {/* ============ Phase A ============ */}
      {aOut < 1 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: aIn * (1 - aOut) }}>
          {/* The machine */}
          <div style={{ position: 'absolute', left: MACHINE.x, top: MACHINE.y }}>
            <FingerprintMachine width={MACHINE.w} label={S04.machine} run={run} frame={frame} />
          </div>

          {/* The ghost copies the machine reads (clipped at the inlet: they go inside) */}
          <div style={{ position: 'absolute', left: 0, top: 0, width: INLET.x, height: 660, overflow: 'hidden' }}>
            {[
              { p: feed1, on: feed1 > 0.001 && feed1 < 1, change: 0 },
              { p: feed2, on: feed2 > 0.001 && feed2 < 1, change: 1 },
            ].map((g, i) =>
              g.on ? (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    left: mix(DOC.x + DOC.w * 0.25, INLET.x + 6, g.p),
                    top: mix(DOC.y + 40, INLET.y - GHOST.h / 2, g.p),
                    width: DOC.w,
                    transform: `scale(${GHOST_SCALE})`,
                    transformOrigin: '0 0',
                    opacity: 0.75,
                  }}
                >
                  <OfferSheet width={DOC.w} change={g.change} />
                </div>
              ) : null,
            )}
          </div>

          {/* The offer, with its fingerprint stuck to it after `print` */}
          <div style={{ position: 'absolute', left: DOC.x, top: DOC.y }}>
            <OfferSheet
              width={DOC.w}
              change={cent}
              attached={{ value: S04.print, p: stuck }}
              attachedMark={0.8 * compare}
              attachedTone={C.cyan}
              glow={0.4 * windowWeight(frame, machineAt, feed1From + 30)}
            />
          </div>
          {printLabel > 0.001 ? (
            <div style={{ position: 'absolute', left: DOC.x - 40, width: DOC.w + 80, top: DOC.y + DOC_SIZE.h + 12, textAlign: 'center', opacity: printLabel }}>
              <span style={{ fontSize: 38, fontWeight: 800, color: C.cyanSoft, whiteSpace: 'nowrap' }}>{S04.printLabel}</span>
            </div>
          ) : null}

          {/* The line at the outlet: e3a1…9c07, then every character flips to 58bd…f26e */}
          {lineOut > 0.001 ? (
            <div
              style={{
                position: 'absolute',
                left: LINE.x,
                top: LINE.y,
                opacity: lineOut,
                transform: `translateX(${(1 - lineOut) * -60}px)`,
              }}
            >
              <HashLine
                value={changed ? S04.changed : S04.print}
                from={changed ? S04.print : undefined}
                morph={morph}
                size={LINE_SIZE}
                reveal={lineReveal}
                tone={changed ? C.amber : C.cyan}
                glow={changed ? 0.5 * morph : 0.4 * windowWeight(frame, outFrom, printAt + 20)}
                mark={0.8 * compare}
              />
            </div>
          ) : null}

          {/* «siempre igual de larga»: a bracket under the line */}
          {bracket > 0.001 ? (
            <div style={{ position: 'absolute', left: LINE.x, top: LINE.y + LINE_BOX.h + 10, width: LINE_BOX.w, opacity: bracket }}>
              <svg width={LINE_BOX.w} height={22} style={{ display: 'block' }}>
                <path d={`M 3 2 L 3 14 L ${LINE_BOX.w - 3} 14 L ${LINE_BOX.w - 3} 2`} fill="none" stroke={C.cyanSoft} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div style={{ textAlign: 'center', marginTop: 6 }}>
                <div style={{ fontSize: 36, fontWeight: 800, color: C.textStrong, whiteSpace: 'nowrap' }}>{S04.sameLength}</div>
                <div style={{ fontSize: 26, fontWeight: 650, color: C.muted, whiteSpace: 'nowrap', marginTop: 2 }}>{S04.sameLengthSub}</div>
              </div>
            </div>
          ) : null}

          {/* The copy that flies onto the sheet */}
          {fly > 0.001 && stuck < 1 ? (
            <div style={{ position: 'absolute', left: flyX, top: flyY, transform: `scale(${flyScale})`, transformOrigin: '0 0', opacity: 1 - stuck }}>
              <HashLine value={S04.print} size={LINE_SIZE} tone={C.cyan} glow={0.6} />
            </div>
          ) : null}

          {/* «un céntimo: la huella cambia entera» */}
          {changeLabel > 0.001 ? (
            <div style={{ position: 'absolute', left: LINE.x - 60, width: LINE_BOX.w + 120, top: LINE.y + LINE_BOX.h + 18, textAlign: 'center', opacity: changeLabel }}>
              <span style={{ fontSize: 34, fontWeight: 800, color: '#fde68a', whiteSpace: 'nowrap' }}>{S04.changeLabel}</span>
            </div>
          ) : null}

          {/* The way back, struck: drawn on as a dashed curve */}
          {backDraw > 0.001 ? (
            <svg width={W} height={660} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
              <polyline points={backPoints(backDraw)} fill="none" stroke={alpha(C.muted, 0.85)} strokeWidth={5} strokeDasharray="14 12" strokeLinecap="round" strokeLinejoin="round" />
              {backDraw > 0.97 ? (
                <polygon points={`${BACK[3].x},${BACK[3].y + 6} ${BACK[3].x - 10},${BACK[3].y - 18} ${BACK[3].x + 14},${BACK[3].y - 16}`} fill={alpha(C.muted, 0.85)} />
              ) : null}
            </svg>
          ) : null}
          {backCross > 0.001 ? (
            <div style={{ position: 'absolute', left: apex.x - 32, top: apex.y - 32 }}>
              <CrossBadge size={64} p={backCross} />
            </div>
          ) : null}
          {keyIn > 0.001 ? (
            <div style={{ position: 'absolute', left: apex.x - 70, top: apex.y + 44, opacity: keyIn, transform: `translateY(${(1 - keyIn) * 8}px)` }}>
              <div style={{ position: 'relative', width: 150, height: 60 }}>
                <HouseKey width={130} color={C.muted} />
                <div style={{ position: 'absolute', left: 104, top: -6 }}>
                  <CrossBadge size={52} p={keyCross} />
                </div>
              </div>
            </div>
          ) : null}
          {oneWayLabel > 0.001 ? (
            <div style={{ position: 'absolute', left: 0, width: W, top: 0, display: 'flex', justifyContent: 'center', opacity: oneWayLabel, transform: `translateY(${(1 - oneWayLabel) * -8}px)` }}>
              <span style={{ fontSize: 38, fontWeight: 820, color: C.textStrong, whiteSpace: 'nowrap', padding: '2px 18px', borderRadius: RADIUS.md, background: alpha(C.ink950, 0.8) }}>{S04.oneWay}</span>
            </div>
          ) : null}

          {/* integridad, then HASH: the bottom band */}
          <div style={{ position: 'absolute', left: LINE.x - 10, top: 556 }}>
            <LookTag text={S04.integrity} tone={C.cyan} p={integrity} icon="search" glow={compare} />
          </div>
          <div style={{ position: 'absolute', left: MACHINE.x + 40, top: 506 }}>
            <TermTag frame={frame} fps={fps} at={hashAt} term={S04.term} sub={S04.termSub} subAt={termSubAt} size={58} subSize={38} />
          </div>
        </div>
      ) : null}

      {/* ============ Phase B ============ */}
      {bIn > 0.001 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: bIn }}>
          {/* COLLISION */}
          <div style={{ position: 'absolute', left: COL_DOC.x, top: 0 }}>
            <TermTag frame={frame} fps={fps} at={collisionAt + 6} term={S04.collision.term} sub={S04.collision.sub} size={50} subSize={34} />
          </div>
          {COL_Y.map((y, i) => {
            const lineY = y + COL_DOC.h / 2 - COL_LINE_BOX.h / 2;
            return (
              <div key={i}>
                <div style={{ position: 'absolute', left: COL_DOC.x, top: y, opacity: colDocs[i], transform: `translateX(${(1 - colDocs[i]) * -20}px)` }}>
                  <DocGlyph width={COL_DOC.w} height={COL_DOC.h} variant={i} label={S04.collision.docs[i]} />
                </div>
                {/* The arrow into the line; MD5 on it once the voice names it */}
                <svg width={COL_LINE_X - 210} height={60} style={{ position: 'absolute', left: 205, top: y + COL_DOC.h / 2 - 30, overflow: 'visible', opacity: colLines[i] }}>
                  <line x1={6} y1={30} x2={COL_LINE_X - 236} y2={30} stroke={alpha(C.muted, 0.8)} strokeWidth={5} strokeLinecap="round" />
                  <polygon points={`${COL_LINE_X - 222},30 ${COL_LINE_X - 240},18 ${COL_LINE_X - 240},42`} fill={alpha(C.muted, 0.8)} />
                </svg>
                {viaIn > 0.001 ? (
                  <div
                    style={{
                      position: 'absolute',
                      left: 236,
                      top: y + COL_DOC.h / 2 - 52,
                      padding: '0 12px',
                      borderRadius: RADIUS.sm,
                      border: `2px solid ${alpha(C.amber, 0.8)}`,
                      background: C.ink900,
                      fontFamily: FONT.mono,
                      fontSize: 30,
                      fontWeight: 800,
                      color: '#fde68a',
                      opacity: viaIn,
                    }}
                  >
                    {S04.collision.via}
                  </div>
                ) : null}
                <div style={{ position: 'absolute', left: COL_LINE_X, top: lineY, opacity: colLines[i], transform: `translateX(${(1 - colLines[i]) * -24}px)` }}>
                  <HashLine value={S04.collision.value} size={COL_LINE_SIZE} tone={C.text} mark={colMark} markTone={C.amber} glow={0.3 * colMark} />
                </div>
              </div>
            );
          })}
          {/* «la misma huella»: a bracket joining both lines */}
          {colMark > 0.001 ? (
            <div style={{ position: 'absolute', left: COL_LINE_X + COL_LINE_BOX.w + 18, top: COL_Y[0] + COL_DOC.h / 2, opacity: colMark }}>
              <svg width={36} height={COL_Y[1] - COL_Y[0]} style={{ display: 'block', overflow: 'visible' }}>
                <path d={`M 2 2 L 22 2 L 22 ${COL_Y[1] - COL_Y[0] - 2} L 2 ${COL_Y[1] - COL_Y[0] - 2}`} fill="none" stroke={C.amber} strokeWidth={4} strokeLinejoin="round" strokeLinecap="round" />
              </svg>
              <div style={{ position: 'absolute', left: 40, top: (COL_Y[1] - COL_Y[0]) / 2 - 48, fontSize: 36, fontWeight: 800, color: '#fde68a', lineHeight: 1.15 }}>
                <div>{S04.collision.same[0]}</div>
                <div>{S04.collision.same[1]}</div>
              </div>
            </div>
          ) : null}

          {/* The algorithms */}
          {retiredIn > 0.001 ? (
            <div style={{ position: 'absolute', left: BOARD.x, top: 170, width: BOARD.w }}>
              <div style={{ position: 'relative', display: 'flex', gap: 24, justifyContent: 'center', opacity: retiredIn }}>
                {S04.algos.retired.map((a, i) => (
                  <AlgoChip key={a} name={a} tone={C.amber} dim={0.5 * progress(frame, stampAt + 4, 12)} p={progress(frame, retiredAt + i * 8, 14)} />
                ))}
                <div style={{ position: 'absolute', left: 0, width: BOARD.w, top: 84, display: 'flex', justifyContent: 'center' }}>
                  <MarkStamp frame={frame} at={stampAt} tone={C.amber} soft="#fde68a" size={46} rotate={-6}>
                    {S04.algos.retiredStamp}
                  </MarkStamp>
                </div>
              </div>
              {todayIn > 0.001 ? (
                <div style={{ marginTop: 140, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, opacity: todayIn, transform: `translateY(${(1 - todayIn) * 12}px)` }}>
                  <div style={{ display: 'flex', gap: 24 }}>
                    {S04.algos.today.map((a) => (
                      <AlgoChip key={a} name={a} tone={C.emerald} p={1} />
                    ))}
                  </div>
                  <LookTag text={S04.algos.todayChip} tone={C.emerald} p={1} icon="check" size={36} />
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : null}
    </Stage>
  );
}

/** An algorithm name on a tile (monospace). */
function AlgoChip({ name, tone, p, dim = 0 }: { name: string; tone: string; p: number; dim?: number }) {
  const v = clamp01(p);
  return (
    <div
      style={{
        padding: '14px 26px',
        borderRadius: RADIUS.md,
        border: `3px solid ${alpha(tone, 0.75 - 0.35 * dim)}`,
        background: `linear-gradient(180deg, ${alpha(tone, 0.14)} 0%, ${alpha(C.ink900, 0.96)} 100%)`,
        fontFamily: FONT.mono,
        fontSize: 46,
        fontWeight: 800,
        color: dim > 0.5 ? C.muted : C.textStrong,
        whiteSpace: 'nowrap',
        opacity: v * (1 - 0.35 * dim),
        transform: `translateY(${(1 - v) * 10}px)`,
      }}
    >
      {name}
    </div>
  );
}

/** A small generic document (A or B: different text patterns), with its name under it. */
function DocGlyph({ width, height, variant, label }: { width: number; height: number; variant: number; label: string }) {
  const lines = variant === 0 ? [0.8, 0.55, 0.7, 0.4, 0.65] : [0.5, 0.75, 0.35, 0.8, 0.6];
  return (
    <div style={{ position: 'relative', width, height }}>
      <svg width={width} height={height} style={{ display: 'block' }}>
        <path d={`M 4 4 L ${width - 34} 4 L ${width - 4} 34 L ${width - 4} ${height - 4} L 4 ${height - 4} Z`} fill={C.ink800} stroke={alpha(C.text, 0.7)} strokeWidth={3} strokeLinejoin="round" />
        <path d={`M ${width - 34} 4 L ${width - 34} 34 L ${width - 4} 34`} fill="none" stroke={alpha(C.text, 0.7)} strokeWidth={3} strokeLinejoin="round" />
        {lines.map((l, i) => (
          <rect key={i} x={18} y={50 + i * 22} width={(width - 36) * l} height={8} rx={4} fill={alpha(C.muted, 0.55)} />
        ))}
        <text x={18} y={38} fontFamily={FONT.sans} fontSize={30} fontWeight={850} fill={C.textStrong}>
          {variant === 0 ? 'A' : 'B'}
        </text>
      </svg>
      <div style={{ position: 'absolute', left: -40, width: width + 80, top: height + 4, textAlign: 'center', fontSize: 32, fontWeight: 750, color: C.text, whiteSpace: 'nowrap' }}>{label}</div>
    </div>
  );
}

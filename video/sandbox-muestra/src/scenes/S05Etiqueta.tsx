import type { ReactNode } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../engine/src/theme/motion';
import { Redacted, focusWeights, mix, windowWeight } from '../../../engine/src/ui';
import { HOSTS, STATIC_LINES, type StaticLineId } from '../data/report';
import { S05_NAMES, S05_TEXT } from '../data/s05-etiqueta';
import { Stage, wordFrame } from './kit';
import { CollarCloseUp, Garment, collarCloseUpSize, garmentCollarSlot, garmentHeight } from './parts/Garment';
import { HostList, hostListMetrics } from './parts/HostList';
import { SandboxReport } from './parts/SandboxReport';
import { ExamName, MonoValue, Readout } from './parts/s05-etiqueta/Readout';

const SCENE = 's05-etiqueta';

type Box = { x: number; y: number; w: number };
const mixBox = (a: Box, b: Box, t: number): Box => ({ x: mix(a.x, b.x, t), y: mix(a.y, b.y, t), w: mix(a.w, b.w, t) });
type Pos = { x: number; y: number; s: number };
const mixPos = (a: Pos, b: Pos, t: number): Pos => ({ x: mix(a.x, b.x, t), y: mix(a.y, b.y, t), s: mix(a.s, b.s, t) });

/** The garment: beside the readouts · small next to the collar close-up · the old one at `close`. */
const G1: Box = { x: 40, y: 52, w: 440 };
const G2: Box = { x: 24, y: 62, w: 330 };
const G_OLD: Box = { x: 600, y: 150, w: 380 };
const G_NEW: Box = { x: 1110, y: 70, w: 456 };
/** The report's static band: low on the right under the intercept, then at the top of the right column. */
const BAND = { w: 950, font: 22 } as const;
const BAND_REPLY: Pos = { x: 700, y: 296, s: 1 };
const BAND_TOP: Pos = { x: 560, y: 0, s: 0.9 };
const READ = { x: 560, y: 300, w: 1168 } as const;
/** The two actor rows, locked: centred under the intercept, then aside. */
const ROWS = { w: 1000, size: 42, labelSize: 30, gap: 10 } as const;
const ROWS_OPEN: Pos = { x: 364, y: 330, s: 1 };
const ROWS_REPLY: Pos = { x: 24, y: 300, s: 0.62 };
/** The collar close-up (label ≥ 960 px wide: the path reads at ≈ 28 px). */
const CU = { x: 522, y: 34, labelW: 960 } as const;
const CU_SIZE = collarCloseUpSize(CU.labelW);
const CAP_Y = 514;

const field = (id: StaticLineId) => {
  const f = STATIC_LINES.find((l) => l.id === id);
  if (!f) throw new Error(`static line ${id} missing`);
  return f;
};

/**
 * s05-etiqueta «Lo que lleva escrito».
 *   (intercept) the two actor rows of s04, still locked, low under the card
 *   reply     the rows step aside; «gastar otro» = a generic redacted domain;
 *             «Rehacer la muestra… no» = the report's static band comes back
 *   garment   the garment on its hanger; «su hash» = the whole garment amber, the
 *             SHA-256 readout, «esta prenda exacta · un byte y ya es otra»
 *   imports   the pieces (buttons, lining) light; the three imported functions
 *   imphash   the pieces' set outlined emerald, «comparte tabla de imports con 3
 *             muestras previas», «apunta a la familia», IMPHASH
 *   ssdeep    «patrón» = the cutting pattern; «calca» = the almost identical one
 *             over it, «ssdeep · 94 % · variante de 2026-01», SSDEEP (fuzzy hashing)
 *   (s05-06)  «la carpeta donde se hizo» = the PDB path line of the report
 *   label     the collar flips over: the workshop label sewn inside; the close-up
 *             (label 960 px wide), «la etiqueta del taller», «no siempre la lleva»,
 *             the two-line rule «si otro programa trae la misma» / «mismo taller ·
 *             enlace fuerte»; PDB PATH at `pdb`
 *   date      `Compile time : 2026-02-19`, «la pone quien compila · a veces, falsa»,
 *             «enlace débil» — compared with nothing
 *   close     the domain chip «se cambia en un rato» against a new garment that
 *             looks like the old one (same pieces, same pattern) and has NO label
 */
export function S05Etiqueta(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const replyAt = props.cue('reply');
  const garmentAt = props.cue('garment');
  const importsAt = props.cue('imports');
  const imphashAt = props.cue('imphash');
  const ssdeepAt = props.cue('ssdeep');
  const labelAt = props.cue('label');
  const pdbAt = props.cue('pdb');
  const dateAt = props.cue('date');
  const closeAt = props.cue('close');
  const w = (seg: string, word: string) => wordFrame(SCENE, seg, word);
  const otroAt = w('s05-01', 'otro');
  const rehacerAt = w('s05-01', 'Rehacer');
  const hashAt = w('s05-02', 'hash');
  const exactaAt = w('s05-02', 'exacta');
  const imphashWord = w('s05-04', 'imphash');
  const compartenAt = w('s05-04', 'comparten');
  const apuntaAt = w('s05-04', 'Apunta');
  const patronAt = w('s05-05', 'patrón');
  const calcaAt = w('s05-05', 'calca');
  const carpetaAt = w('s05-06', 'carpeta');
  const etiquetaAt = w('s05-06', 'etiqueta');
  const siempreAt = w('s05-07', 'siempre');
  const otroProgAt = w('s05-07', 'otro');
  const mismoAt = w('s05-07', 'mismo');
  const poneAt = w('s05-08', 'pone');
  const falsaAt = w('s05-08', 'falsa');
  const dominioAt = w('s05-09', 'dominio');
  const saleAt = w('s05-09', 'sale');
  const prendaAt = w('s05-09', 'prenda');
  const recuerdeAt = w('s05-09', 'recuerde');

  // ── Opening and reply: the two locked rows, the next domain, the static band.
  const rowsOut = progress(frame, garmentAt - 8, 16, EASE.inOut);
  // They stay centred for «sigue valiendo… gastar otro» and step aside just before the band comes back.
  const rowsPos = mixPos(ROWS_OPEN, ROWS_REPLY, progress(frame, Math.max(replyAt, rehacerAt - 26), 26, EASE.inOut));
  const rowsM = hostListMetrics(HOSTS.filter((h) => h.side === 'actor'), { size: ROWS.size, labelSize: ROWS.labelSize, labels: [1, 1], gap: ROWS.gap });
  const nextIn = progress(frame, otroAt - 2, 14);
  const nextSweep = progress(frame, otroAt, 20, EASE.inOut);

  const bandShow = Math.max(
    progress(frame, rehacerAt - 4, 18) * (1 - progress(frame, labelAt + 4, 14, EASE.inOut)),
    progress(frame, dateAt + 4, 16) * (1 - progress(frame, closeAt - 2, 14, EASE.inOut)),
  );
  const bandPos = mixPos(BAND_REPLY, BAND_TOP, progress(frame, garmentAt - 2, 26, EASE.inOut));
  const bandIds: StaticLineId[] = ['sha256', 'imports', 'imphash', 'ssdeep', 'pdb', 'compile'];
  const bandStarts = [hashAt, importsAt, imphashAt, patronAt, carpetaAt, dateAt];
  const { weights: bw, dims: bd } = focusWeights(frame, bandStarts, { end: closeAt });
  const bandFocus = Object.fromEntries(bandIds.map((id, i) => [id, bw[i]]));
  const bandDim = Object.fromEntries(bandIds.map((id, i) => [id, bd[i]]));

  // ── The garment.
  const gIn = progress(frame, garmentAt - 2, 22);
  const toG2 = progress(frame, labelAt + 6, 26, EASE.inOut) * (1 - progress(frame, dateAt - 4, 26, EASE.inOut));
  const toClose = progress(frame, closeAt, 28, EASE.inOut);
  const gBox = mixBox(mixBox(G1, G2, toG2), G_OLD, toClose);
  const match = progress(frame, recuerdeAt - 8, 18);
  const whole = windowWeight(frame, hashAt, importsAt, { ramp: 14 });
  const pieces = Math.max(windowWeight(frame, importsAt, patronAt, { ramp: 12 }), match);
  const family = Math.max(windowWeight(frame, imphashWord, patronAt, { ramp: 12 }), match);
  const pattern = Math.max(windowWeight(frame, patronAt, labelAt, { ramp: 12 }), match);
  const twin = windowWeight(frame, calcaAt, labelAt, { ramp: 12 });
  const collar = progress(frame, labelAt + 2, 26, EASE.inOut);
  const oldDim = progress(frame, prendaAt - 4, 16) * 0.35;

  // ── Readouts (one at a time, cross-fading in place).
  const rw = (from: number, to: number) => windowWeight(frame, from, to, { ramp: 12, lead: 4 });
  const rSha = rw(hashAt, importsAt);
  const rImports = rw(importsAt, imphashAt);
  const rImphash = rw(imphashAt, calcaAt - 6);
  const rSsdeep = rw(calcaAt, carpetaAt);
  const rPdb = rw(carpetaAt, labelAt + 12);
  const rDate = rw(dateAt + 6, closeAt);

  // ── The collar close-up.
  const cuIn = progress(frame, labelAt + 8, 22, EASE.inOut) * (1 - progress(frame, dateAt - 8, 18, EASE.inOut));
  const labelShow = progress(frame, labelAt + 26, 16);
  const labelGlow = windowWeight(frame, etiquetaAt, siempreAt, { ramp: 14 });
  const capOut = 1 - progress(frame, dateAt - 8, 16, EASE.inOut);
  const capLabel = progress(frame, etiquetaAt - 2, 14) * capOut;
  const capNot = progress(frame, siempreAt - 4, 14) * capOut;
  const rule1 = progress(frame, otroProgAt - 4, 14) * capOut;
  const rule2 = progress(frame, mismoAt - 6, 14) * capOut;
  const slot = garmentCollarSlot(gBox.w);
  // The close-up zooms out of the collar (origin: its left edge, 30 % down); the connectors follow it.
  const cuK = 0.4 + 0.6 * cuIn;
  const cuY = (y: number) => CU.y + CU_SIZE.h * 0.3 + (y - CU_SIZE.h * 0.3) * cuK;

  // ── close: the domain, cheap, against the new garment.
  // The chip waits until the garment has left its corner on the way to the centre (they overlapped mid-move).
  const chipIn = progress(frame, Math.max(dominioAt - 4, closeAt + 22), 14);
  const chipCap = progress(frame, saleAt - 2, 14);
  const newIn = progress(frame, prendaAt - 6, 20);

  return (
    <Stage>
      {/* Opening + reply: the two actor rows, still locked */}
      {rowsOut < 0.999 ? (
        <div style={{ position: 'absolute', left: rowsPos.x, top: rowsPos.y, transform: `scale(${rowsPos.s})`, transformOrigin: '0 0', opacity: 1 - rowsOut }}>
          <HostList
            hosts={HOSTS}
            only={['usual', 'spare']}
            width={ROWS.w}
            size={ROWS.size}
            labelSize={ROWS.labelSize}
            gap={ROWS.gap}
            actor={1}
            labels={[1, 1]}
            locks={[1, 1]}
            lockHold={1}
          />
          {nextIn > 0.01 ? (
            <div
              style={{
                position: 'absolute',
                left: 64,
                top: rowsM.height + 18,
                width: ROWS.w - 64,
                height: 74,
                boxSizing: 'border-box',
                borderRadius: RADIUS.md,
                border: `3px dashed ${alpha(C.rose, 0.55)}`,
                display: 'flex',
                alignItems: 'center',
                paddingLeft: 30,
                opacity: nextIn,
                transform: `translateY(${(1 - nextIn) * 14}px)`,
              }}
            >
              <Redacted width={360} height={30} tld={70} tone="rose" sweep={nextSweep} strength={0.6} />
            </div>
          ) : null}
        </div>
      ) : null}

      {/* The report's static band (the same panel as s03) */}
      {bandShow > 0.01 ? (
        <div style={{ position: 'absolute', left: bandPos.x, top: bandPos.y, transform: `scale(${bandPos.s})`, transformOrigin: '0 0', opacity: bandShow }}>
          <SandboxReport
            width={BAND.w}
            bands="static"
            fontSize={BAND.font}
            notes={false}
            focus={bandFocus}
            dim={bandDim}
            focusScale={1}
            focusTone={{ sha256: 'amber', imports: 'emerald', imphash: 'emerald', ssdeep: 'emerald', pdb: 'emerald', compile: 'amber' }}
          />
        </div>
      ) : null}

      {/* The garment */}
      {gIn > 0.01 ? (
        <div style={{ position: 'absolute', left: gBox.x, top: gBox.y, opacity: gIn * (1 - oldDim), filter: oldDim > 0.01 ? `saturate(${1 - oldDim})` : undefined }}>
          <Garment
            width={gBox.w}
            whole={whole}
            pieces={pieces}
            family={family}
            pattern={pattern}
            twin={twin}
            collar={collar}
            labelPath={field('pdb').value}
            labelGlow={labelGlow * 0.8}
          />
        </div>
      ) : null}

      {/* close: the new garment — same cut, same pieces, no workshop label */}
      {newIn > 0.01 ? (
        <div style={{ position: 'absolute', left: G_NEW.x, top: G_NEW.y, opacity: newIn, transform: `translateX(${(1 - newIn) * 30}px)` }}>
          <Garment width={G_NEW.w} variant="new" pieces={match} family={match} pattern={match} />
        </div>
      ) : null}

      {/* Readouts */}
      <div style={{ position: 'absolute', left: READ.x, top: READ.y }}>
        <Slot>
          <Readout
            width={READ.w}
            p={rSha}
            tone={C.amber}
            value={<MonoValue k={field('sha256').key} value={field('sha256').value} color={C.amber} />}
            caption={S05_TEXT.hash}
            captionP={progress(frame, exactaAt - 6, 14)}
          />
        </Slot>
        <Slot>
          <Readout
            width={READ.w}
            p={rImports}
            tone="#cbd5e1"
            value={<MonoValue k={field('imports').key} sep=" :" value="" color={C.text} size={40} />}
            caption={<ImportChips names={field('imports').value.split(', ')} frame={frame} at={importsAt + 8} />}
          />
        </Slot>
        <Slot>
          <Readout
            width={READ.w}
            p={rImphash}
            tone={C.emerald}
            value={<MonoValue k={field('imphash').key} value={field('imphash').value} color={C.emerald} />}
            caption={S05_TEXT.imphashNote}
            captionP={progress(frame, compartenAt - 4, 14)}
            chip={S05_TEXT.family}
            chipP={progress(frame, apuntaAt - 4, 14)}
            name={<ExamName en={S05_NAMES.imphash.en} at={imphashWord} frame={frame} fps={fps} />}
          />
        </Slot>
        <Slot>
          <Readout
            width={READ.w}
            p={rSsdeep}
            tone={C.emerald}
            value={
              <span style={{ fontSize: 42, fontWeight: 800, whiteSpace: 'pre', color: C.emerald, letterSpacing: -0.4 }}>
                <span style={{ fontFamily: FONT.mono, color: C.textStrong }}>{S05_TEXT.ssdeep.key}</span>
                {S05_TEXT.ssdeep.rest}
              </span>
            }
            minHeight={160}
            name={<ExamName en={S05_NAMES.ssdeep.en} gloss={S05_NAMES.ssdeep.gloss} at={ssdeepAt} frame={frame} fps={fps} size={64} />}
          />
        </Slot>
        <Slot>
          <Readout width={READ.w} p={rPdb} tone="#cbd5e1" value={<MonoValue k={field('pdb').key} sep=" : " value={field('pdb').value} color={C.textStrong} size={34} />} />
        </Slot>
        <Slot>
          <Readout
            width={READ.w}
            p={rDate}
            tone={C.amber}
            value={<MonoValue k={field('compile').key} sep=" : " value={field('compile').value} color={C.amber} />}
            caption={S05_TEXT.date}
            captionP={progress(frame, poneAt - 4, 14)}
            chip={S05_TEXT.weak}
            chipTone={C.amber}
            chipP={progress(frame, falsaAt - 4, 14)}
          />
        </Slot>
      </div>

      {/* label: the collar close-up, tied to the garment's collar */}
      {cuIn > 0.01 ? (
        <>
          <svg width={1728} height={660} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: cuIn }}>
            {[
              [gBox.x + slot.x + slot.w, gBox.y + slot.y, CU.x + 4 * cuK, cuY(40)],
              [gBox.x + slot.x + slot.w, gBox.y + slot.y + slot.h, CU.x + 34 * cuK, cuY(CU_SIZE.h - 4)],
            ].map(([x1, y1, x2, y2], i) => (
              <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={alpha('#efe6d2', 0.55)} strokeWidth={3} strokeDasharray="6 8" strokeLinecap="round" />
            ))}
            <rect x={gBox.x + slot.x - 6} y={gBox.y + slot.y - 6} width={slot.w + 12} height={slot.h + 12} rx={6} fill="none" stroke={alpha('#efe6d2', 0.8)} strokeWidth={2.5} />
          </svg>
          <div
            style={{
              position: 'absolute',
              left: CU.x,
              top: CU.y,
              opacity: Math.min(1, cuIn * 1.3),
              transform: `scale(${cuK})`,
              transformOrigin: '0% 30%',
            }}
          >
            <CollarCloseUp labelWidth={CU.labelW} path={field('pdb').value} labelShow={labelShow} labelGlow={labelGlow} />
          </div>
        </>
      ) : null}
      <Caption x={CU.x + 18} y={CAP_Y} p={capLabel} size={46} color="#f3ead6" weight={850}>
        {S05_TEXT.label}
      </Caption>
      <Caption x={CU.x + 18} y={CAP_Y + 68} p={capNot} size={36} color={C.text} weight={700}>
        {S05_TEXT.notAlways}
      </Caption>
      <Caption x={1100} y={CAP_Y + 2} p={rule1} size={36} color={C.text} weight={700}>
        {S05_TEXT.rule[0]}
      </Caption>
      <Caption x={1100} y={CAP_Y + 50} p={rule2} size={40} color={C.emerald} weight={850}>
        {S05_TEXT.rule[1]}
      </Caption>
      {frame >= pdbAt - 1 && capOut > 0.01 ? (
        <div style={{ position: 'absolute', left: G2.x + 4, top: G2.y + garmentHeight(G2.w) + 34, opacity: capOut }}>
          <ExamName en={S05_NAMES.pdb.en} at={pdbAt} frame={frame} fps={fps} size={64} align="flex-start" />
        </div>
      ) : null}

      {/* close: the domain, a small rose chip */}
      {chipIn > 0.01 ? (
        <div style={{ position: 'absolute', left: 16, top: 250, opacity: chipIn, transform: `translateY(${(1 - chipIn) * 14}px)` }}>
          <span
            style={{
              display: 'inline-block',
              padding: '10px 22px',
              borderRadius: RADIUS.pill,
              border: `3px solid ${C.rose}`,
              background: alpha(C.roseDeep, 0.85),
              fontFamily: FONT.mono,
              fontSize: 34,
              fontWeight: 750,
              color: C.roseSoft,
              whiteSpace: 'nowrap',
              boxShadow: `0 0 22px ${alpha(C.rose, 0.35)}`,
            }}
          >
            {HOSTS[0].host}
          </span>
          <div style={{ marginTop: 16, marginLeft: 6, fontFamily: FONT.sans, fontSize: 36, fontWeight: 750, color: C.roseSoft, whiteSpace: 'nowrap', opacity: chipCap }}>
            {S05_TEXT.domain}
          </div>
        </div>
      ) : null}
    </Stage>
  );
}

/** Stacks readouts in the same place (they cross-fade). */
function Slot({ children }: { children: ReactNode }) {
  return <div style={{ position: 'absolute', left: 0, top: 0 }}>{children}</div>;
}

/** The three imported functions as three «pieces». */
function ImportChips({ names, frame, at }: { names: string[]; frame: number; at: number }) {
  return (
    <div style={{ display: 'flex', gap: 14 }}>
      {names.map((n, i) => {
        const p = progress(frame, at + i * 6, 12);
        return (
          <span
            key={n}
            style={{
              display: 'inline-block',
              padding: '6px 18px',
              borderRadius: RADIUS.sm,
              border: `2px solid ${alpha('#f1f5f9', 0.6)}`,
              background: alpha('#f1f5f9', 0.08),
              fontFamily: FONT.mono,
              fontSize: 33,
              fontWeight: 700,
              color: C.textStrong,
              opacity: p,
              transform: `translateY(${(1 - p) * 8}px)`,
            }}
          >
            {n}
          </span>
        );
      })}
    </div>
  );
}

function Caption({ x, y, p, size, color, weight, children }: { x: number; y: number; p: number; size: number; color: string; weight: number; children: string }) {
  if (p <= 0.01) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        fontFamily: FONT.sans,
        fontSize: size,
        fontWeight: weight,
        letterSpacing: -0.3,
        lineHeight: 1.15,
        color,
        whiteSpace: 'nowrap',
        opacity: p,
        transform: `translateY(${(1 - p) * 10}px)`,
      }}
    >
      {children}
    </div>
  );
}


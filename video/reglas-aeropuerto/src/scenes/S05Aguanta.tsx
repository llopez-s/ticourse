import type { ReactNode } from 'react';
import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../engine/src/theme/motion';
import { BREAKS, CLOSE, LADDER, WHERE } from '../data/s05-aguanta';
import { BoardingCard, Gate, Passport, Scanner, Suitcase } from './parts/Airport';
import { Stage, wordFrame } from './kit';

const S = 's05-aguanta';
const W = STAGE.width;

// ---- Phase A: two columns.
const COL_W = 820;
const COL_GAP = W - 2 * COL_W;
const COL_TOP = 40;
const COL_H = 580;

// ---- Phase B: three rows.
const ROW_TOP = [92, 280, 468];
const ROW_H = 168;
const ICON_W = 210;

// ---- Phase C: the three chips.
const CHIP_W = 520;
const CHIP_H = 104;
const CHIP_GAP = (W - 3 * CHIP_W) / 2;
const CHIP_TOP = 104;
const STRIP_TOP = 348;

/**
 * s05-aguanta «Dónde corre y qué la rompe». On `where` two columns: YARA (the scanner) and Sigma (the gate's logbook
 * under a lens). YARA lists where it runs, one place per word, then «repositorio de muestras»; Sigma says it is translated
 * to your SIEM's query: on `sigma-runs` the straight path rule → «tu SIEM» is crossed out, on `convert` the «consulta»
 * step comes in between. On `breaks` the columns give way to «qué la rompe» in three rows (suitcase / two passports, the
 * second rose / the boarding card). On `ladder` three chips «el nombre del disco» · «el nombre original» · «la cadena
 * entera»; on `limit` the middle one dims amber under the strip, on «árbol» the chain lights emerald. `loop` brings
 * «mide si dispara» and `wrap-ii` closes the chapter with «cada una tiene su punto débil» above it.
 */
export function S05Aguanta(props: SceneProps) {
  const frame = useCurrentFrame();
  const whereAt = props.cue('where');
  const yaraAt = props.cue('yara-runs');
  const sigmaAt = props.cue('sigma-runs');
  const convertAt = props.cue('convert');
  const breaksAt = props.cue('breaks');
  const breaksYaraAt = props.cue('breaks-yara');
  const breaksSigmaAt = props.cue('breaks-sigma');
  const breaksFilterAt = props.cue('breaks-filter');
  const ladderAt = props.cue('ladder');
  const limitAt = props.cue('limit');
  const loopAt = props.cue('loop');
  const wrapAt = props.cue('wrap-ii');

  const placeAt = [
    wordFrame(S, 's05-01', 'escáner'),
    wordFrame(S, 's05-01', 'sandbox'),
    wordFrame(S, 's05-01', 'EDR'),
    wordFrame(S, 's05-01', 'EDR') + 16,
  ];
  const otherPassAt = wordFrame(S, 's05-04', 'pasaporte');
  const chainAt = wordFrame(S, 's05-05', 'árbol');
  const mideAt = wordFrame(S, 's05-06', 'mide');

  // ---- Phase windows.
  const colsIn = progress(frame, Math.min(whereAt - 6, 4), 18);
  const colsOut = 1 - progress(frame, breaksAt - 10, 12);
  const rowsOut = 1 - progress(frame, ladderAt - 10, 12);
  const rowFrame = progress(frame, breaksAt + 4, 16);
  const ladderDim = 1 - 0.55 * progress(frame, loopAt - 4, 14) - 0.15 * progress(frame, wrapAt, 14);

  // ---- Sigma's path.
  const sigmaIn = progress(frame, sigmaAt - 2, 14);
  const straightOut = 1 - progress(frame, convertAt - 4, 12);
  const queryIn = progress(frame, convertAt, 16);
  const arrowsDraw = progress(frame, convertAt + 6, 20, EASE.inOut);

  return (
    <Stage>
      {/* ===== Phase A: where each one runs ===== */}
      {colsOut > 0.01 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: colsIn * colsOut }}>
          <Column left={0} title={WHERE.yara.title} icon={<Scanner width={280} items={['bottle', 'rare']} />} iconH={158}>
            <div style={{ fontFamily: FONT.sans, fontSize: 38, fontWeight: 700, color: C.muted, opacity: progress(frame, yaraAt - 4, 12) }}>{WHERE.yara.runsOn}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 18, marginTop: 20, width: COL_W - 64 }}>
              {WHERE.yara.places.map((p, i) => {
                const a = progress(frame, placeAt[i] - 4, 12);
                return (
                  <span
                    key={p}
                    style={{
                      padding: '8px 26px',
                      borderRadius: RADIUS.pill,
                      border: `2px solid ${alpha(C.cyan, 0.75)}`,
                      background: alpha(C.cyan, 0.12),
                      fontFamily: FONT.sans,
                      fontSize: 46,
                      fontWeight: 750,
                      color: C.cyanSoft,
                      lineHeight: 1.2,
                      whiteSpace: 'nowrap',
                      opacity: a,
                      transform: `translateY(${(1 - a) * 12}px)`,
                    }}
                  >
                    {p}
                  </span>
                );
              })}
            </div>
          </Column>

          <Column left={COL_W + COL_GAP} title={WHERE.sigma.title} icon={<Gate width={268} lens={1} pass={1} />} iconH={158}>
            <div style={{ width: COL_W - 64, fontFamily: FONT.sans, fontSize: 38, fontWeight: 700, lineHeight: 1.25, color: C.text, opacity: sigmaIn }}>{WHERE.sigma.runs}</div>
            <SigmaPath top={140} sigmaIn={sigmaIn} straightOut={straightOut} queryIn={queryIn} draw={arrowsDraw} />
          </Column>
        </div>
      ) : null}

      {/* ===== Phase B: what breaks each one ===== */}
      {frame >= breaksAt - 12 && rowsOut > 0.01 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: rowsOut }}>
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 8,
              fontFamily: FONT.sans,
              fontSize: 52,
              fontWeight: 850,
              color: C.textStrong,
              opacity: progress(frame, breaksAt - 2, 14),
            }}
          >
            {BREAKS.title}
          </div>
          <BreakRow
            top={ROW_TOP[0]}
            a={rowFrame}
            t={progress(frame, breaksYaraAt - 4, 14)}
            who={BREAKS.rows[0].who}
            what={BREAKS.rows[0].what}
            icon={<Suitcase width={150} contents={['rare']} flag={0} flagTone={C.amber} />}
          />
          <BreakRow
            top={ROW_TOP[1]}
            a={rowFrame}
            t={progress(frame, breaksSigmaAt - 4, 14)}
            who={BREAKS.rows[1].who}
            what={BREAKS.rows[1].what}
            whatTone="#fecdd3"
            icon={
              <div style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
                <Passport width={74} dim={progress(frame, otherPassAt, 12) * 0.8} />
                <div style={{ opacity: progress(frame, otherPassAt - 4, 12), transform: `translateX(${(1 - progress(frame, otherPassAt - 4, 12)) * 16}px)` }}>
                  <Passport width={74} tone={C.rose} glow={0.6} />
                </div>
              </div>
            }
          />
          <BreakRow
            top={ROW_TOP[2]}
            a={rowFrame}
            t={progress(frame, breaksFilterAt - 4, 14)}
            who={BREAKS.rows[2].who}
            what={BREAKS.rows[2].what}
            icon={<BoardingCard width={170} />}
          />
        </div>
      ) : null}

      {/* ===== Phase C: three things a rule can key on ===== */}
      {frame >= ladderAt - 12 ? (
        <div style={{ position: 'absolute', inset: 0 }}>
          <div style={{ position: 'absolute', inset: 0, opacity: ladderDim }}>
            {/* arrows between chips (SVG, never arrow characters) */}
            <svg width={W} height={STAGE.height} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
              {[0, 1].map((i) => {
                const a = progress(frame, ladderAt + 6 + i * 8, 12);
                const x1 = (i + 1) * CHIP_W + i * CHIP_GAP + 10;
                const x2 = x1 + CHIP_GAP - 20;
                const y = CHIP_TOP + CHIP_H / 2;
                return (
                  <g key={i} opacity={a}>
                    <line x1={x1} y1={y} x2={x2 - 12} y2={y} stroke={alpha(C.muted, 0.8)} strokeWidth={4} strokeLinecap="round" />
                    <path d={`M ${x2 - 16} ${y - 11} L ${x2} ${y} L ${x2 - 16} ${y + 11}`} fill="none" stroke={alpha(C.muted, 0.8)} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
                  </g>
                );
              })}
            </svg>
            {LADDER.chips.map((label, i) => {
              const a = progress(frame, ladderAt - 2 + i * 8, 14);
              const left = i * (CHIP_W + CHIP_GAP);
              const broken = i === 1 ? progress(frame, limitAt, 14) : 0;
              const lit = i === 2 ? progress(frame, chainAt - 4, 14) : 0;
              const tone = i === 0 ? C.muted : i === 1 ? (broken > 0.5 ? C.amber : C.cyan) : lit > 0.5 ? C.emerald : C.cyan;
              const textTone = i === 0 ? C.muted : i === 1 ? (broken > 0.5 ? '#fde68a' : C.cyanSoft) : lit > 0.5 ? '#a7f3d0' : C.cyanSoft;
              return (
                <div key={label} style={{ position: 'absolute', left, top: 0, width: CHIP_W, opacity: a * (i === 0 ? 0.7 : 1), transform: `translateY(${(1 - a) * 14}px)` }}>
                  <div style={{ height: CHIP_TOP - 12, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                    {i === 0 ? <BoardingCard width={150} dim={0.4} /> : i === 1 ? <Passport width={62} dim={broken * 0.5} /> : <ChainGlyph tone={tone} lit={lit} />}
                  </div>
                  <div
                    style={{
                      position: 'absolute',
                      top: CHIP_TOP,
                      width: CHIP_W,
                      height: CHIP_H,
                      boxSizing: 'border-box',
                      display: 'grid',
                      placeItems: 'center',
                      borderRadius: RADIUS.md,
                      border: `3px solid ${alpha(tone, 0.85)}`,
                      background: `linear-gradient(${alpha(tone, 0.12 + 0.1 * lit)}, ${alpha(tone, 0.12 + 0.1 * lit)}), ${C.ink900}`,
                      boxShadow: lit > 0.01 ? `0 0 ${Math.round(28 * lit)}px ${alpha(C.emerald, 0.35 * lit)}` : undefined,
                      fontFamily: FONT.sans,
                      fontSize: 42,
                      fontWeight: 800,
                      color: textTone,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {label}
                    {broken > 0.01 ? (
                      <div style={{ position: 'absolute', left: 30, right: 30, top: CHIP_H / 2 - 2, height: 4, borderRadius: 2, background: C.amber, transform: `scaleX(${broken})`, transformOrigin: 'left center' }} />
                    ) : null}
                  </div>
                  {i === 2 ? (
                    <div
                      style={{
                        position: 'absolute',
                        top: CHIP_TOP + CHIP_H + 14,
                        width: CHIP_W,
                        textAlign: 'center',
                        fontFamily: FONT.sans,
                        fontSize: 32,
                        fontWeight: 650,
                        color: lit > 0.5 ? C.text : C.muted,
                        lineHeight: 1.2,
                      }}
                    >
                      {LADDER.chainSub}
                    </div>
                  ) : null}
                </div>
              );
            })}
            {/* the limit strip */}
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: STRIP_TOP,
                width: W,
                height: 76,
                boxSizing: 'border-box',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: RADIUS.md,
                border: `2px solid ${alpha(C.amber, 0.75)}`,
                background: `linear-gradient(${alpha(C.amber, 0.12)}, ${alpha(C.amber, 0.12)}), ${C.ink900}`,
                fontFamily: FONT.sans,
                fontSize: 40,
                fontWeight: 750,
                color: '#fde68a',
                whiteSpace: 'nowrap',
                opacity: progress(frame, limitAt - 2, 14),
                transform: `translateY(${(1 - progress(frame, limitAt - 2, 14)) * 12}px)`,
              }}
            >
              {LADDER.limit}
            </div>
          </div>

          {/* ===== Phase D: chapter close ===== */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 456,
              width: W,
              textAlign: 'center',
              fontFamily: FONT.sans,
              fontSize: 40,
              fontWeight: 700,
              color: C.text,
              opacity: progress(frame, wrapAt, 14),
              transform: `translateY(${(1 - progress(frame, wrapAt, 14)) * 10}px)`,
            }}
          >
            {CLOSE.weak}
          </div>
          <LoopLine top={528} a={progress(frame, loopAt, 16)} lit={progress(frame, mideAt - 6, 16)} />
        </div>
      ) : null}
    </Stage>
  );
}

function Column({ left, title, icon, iconH, children }: { left: number; title: string; icon: ReactNode; iconH: number; children: ReactNode }) {
  return (
    <div
      style={{
        position: 'absolute',
        left,
        top: COL_TOP,
        width: COL_W,
        height: COL_H,
        boxSizing: 'border-box',
        padding: '24px 32px',
        borderRadius: RADIUS.lg,
        border: `2px solid ${alpha(C.cyan, 0.4)}`,
        background: alpha(C.ink850, 0.9),
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 30, height: iconH }}>
        {icon}
        <span style={{ fontFamily: FONT.sans, fontSize: 64, fontWeight: 850, color: C.cyanSoft, letterSpacing: 0.5 }}>{title}</span>
      </div>
      <div style={{ marginTop: 26, position: 'relative' }}>{children}</div>
    </div>
  );
}

/** Sigma's path to the SIEM: the straight one is crossed out, the real one goes through its query. */
function SigmaPath({ top, sigmaIn, straightOut, queryIn, draw }: { top: number; sigmaIn: number; straightOut: number; queryIn: number; draw: number }) {
  const NODE_H = 92;
  const RULE_W = 250;
  const QUERY_W = 210;
  const SIEM_W = 210;
  const span = COL_W - 64;
  const gap = (span - RULE_W - QUERY_W - SIEM_W) / 2;
  const qx = RULE_W + gap;
  const sx = qx + QUERY_W + gap;
  const y = NODE_H / 2;
  const node = (x: number, w: number, label: string, tone: string, a: number, mono = false, pill = false) => (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: 0,
        width: w,
        height: NODE_H,
        boxSizing: 'border-box',
        display: 'grid',
        placeItems: 'center',
        borderRadius: pill ? RADIUS.pill : RADIUS.sm,
        border: `3px solid ${alpha(tone, 0.85)}`,
        background: `linear-gradient(${alpha(tone, 0.14)}, ${alpha(tone, 0.14)}), ${C.ink900}`,
        fontFamily: mono ? FONT.mono : FONT.sans,
        fontSize: 38,
        fontWeight: 800,
        color: C.textStrong,
        whiteSpace: 'nowrap',
        opacity: a,
        transform: `scale(${0.92 + 0.08 * a})`,
      }}
    >
      {label}
    </div>
  );
  const arrow = (x1: number, x2: number, a: number, tone: string) => {
    const xe = x1 + (x2 - x1) * a;
    return a > 0.01 ? (
      <g>
        <line x1={x1} y1={y} x2={xe - 8} y2={y} stroke={tone} strokeWidth={4} strokeLinecap="round" />
        {a > 0.95 ? <path d={`M ${x2 - 16} ${y - 11} L ${x2} ${y} L ${x2 - 16} ${y + 11}`} fill="none" stroke={tone} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" /> : null}
      </g>
    ) : null;
  };
  // the straight path arcs over the query slot
  const arcFrom = RULE_W / 2 + 40;
  const arcTo = sx + SIEM_W / 2 - 40;
  return (
    <div style={{ position: 'absolute', left: 0, top, width: span, height: 220 }}>
      <svg width={span} height={220} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        {sigmaIn * straightOut > 0.01 ? (
          <g opacity={sigmaIn * straightOut}>
            <path d={`M ${arcFrom} ${NODE_H + 6} C ${arcFrom + 40} ${NODE_H + 90} ${arcTo - 40} ${NODE_H + 90} ${arcTo} ${NODE_H + 6}`} fill="none" stroke={alpha(C.amber, 0.85)} strokeWidth={4} strokeDasharray="10 9" />
            <g transform={`translate(${(arcFrom + arcTo) / 2} ${NODE_H + 70})`}>
              <circle r={26} fill={C.ink900} stroke={C.amber} strokeWidth={4} />
              <path d="M -11 -11 L 11 11 M 11 -11 L -11 11" stroke={C.amber} strokeWidth={5} strokeLinecap="round" />
            </g>
          </g>
        ) : null}
        {arrow(RULE_W + 8, qx - 8, draw, C.cyan)}
        {arrow(qx + QUERY_W + 8, sx - 8, Math.max(0, draw * 2 - 1), C.cyan)}
      </svg>
      {node(0, RULE_W, WHERE.sigma.rule, C.cyan, sigmaIn)}
      {node(qx, QUERY_W, WHERE.sigma.query, C.cyan, queryIn)}
      {node(sx, SIEM_W, WHERE.sigma.siem, C.sky, sigmaIn, false, true)}
    </div>
  );
}

function BreakRow({ top, a, t, who, what, whatTone = '#fde68a', icon }: { top: number; a: number; t: number; who: string; what: string; whatTone?: string; icon: ReactNode }) {
  if (a <= 0.01) return null;
  // The empty row frame is there from `breaks` (its icon dimmed); its words land on its own cue.
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top,
        width: W,
        height: ROW_H,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        borderRadius: RADIUS.md,
        border: `2px solid ${alpha(C.amber, 0.2 + 0.15 * t)}`,
        borderLeft: `6px solid ${alpha(C.amber, 0.35 + 0.65 * t)}`,
        background: alpha(C.ink850, 0.9),
        opacity: a,
        transform: `translateX(${(1 - a) * 20}px)`,
      }}
    >
      <div style={{ width: ICON_W, display: 'flex', justifyContent: 'center', alignItems: 'center', opacity: 0.3 + 0.7 * t }}>{icon}</div>
      <div style={{ flex: 1, paddingRight: 32, display: 'flex', flexDirection: 'column', gap: 6, opacity: t, transform: `translateX(${(1 - t) * 16}px)` }}>
        <span style={{ fontFamily: FONT.sans, fontSize: 40, fontWeight: 850, color: C.cyanSoft, lineHeight: 1.15 }}>{who}</span>
        <span style={{ fontFamily: FONT.sans, fontSize: 38, fontWeight: 700, color: whatTone, lineHeight: 1.2 }}>{what}</span>
      </div>
    </div>
  );
}

/** A tiny process chain: three nodes joined (explorer, PowerShell, scheduled task). */
function ChainGlyph({ tone, lit }: { tone: string; lit: number }) {
  return (
    <svg width={190} height={70} viewBox="0 0 190 70" style={{ overflow: 'visible', filter: lit > 0.01 ? `drop-shadow(0 0 ${Math.round(10 * lit)}px ${alpha(C.emerald, 0.6 * lit)})` : undefined }}>
      <path d="M 34 35 L 78 35 M 112 35 L 156 35" stroke={tone} strokeWidth={4} strokeLinecap="round" />
      {[17, 95, 173].map((x) => (
        <rect key={x} x={x - 17} y={18} width={34} height={34} rx={8} fill={alpha(tone, 0.2 + 0.2 * lit)} stroke={tone} strokeWidth={3.5} />
      ))}
    </svg>
  );
}

/** «mide si dispara» with a loop arrow that turns once on «mide». */
function LoopLine({ top, a, lit }: { top: number; a: number; lit: number }) {
  if (a <= 0.01) return null;
  const tone = lit > 0.5 ? C.emerald : C.cyan;
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top,
        width: W,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 26,
        opacity: a,
        transform: `scale(${(0.94 + 0.06 * a) * (1 + 0.05 * lit)})`,
      }}
    >
      <svg width={96} height={96} viewBox="-50 -50 100 100" style={{ overflow: 'visible', transform: `rotate(${360 * lit}deg)` }}>
        <path d="M 0 -36 A 36 36 0 1 1 -33 -14" fill="none" stroke={tone} strokeWidth={8} strokeLinecap="round" />
        <path d="M -44 -30 L -33 -12 L -14 -20" fill="none" stroke={tone} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span style={{ fontFamily: FONT.sans, fontSize: 72, fontWeight: 850, color: lit > 0.5 ? '#a7f3d0' : C.textStrong, whiteSpace: 'nowrap', textShadow: lit > 0.01 ? `0 0 ${Math.round(24 * lit)}px ${alpha(C.emerald, 0.4 * lit)}` : undefined }}>
        {CLOSE.loop}
      </span>
    </div>
  );
}

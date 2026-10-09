import { useCurrentFrame } from 'remotion';
import { enterFramesFor, sceneTiming } from '../../../engine/src/timeline/load';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress, springIn } from '../../../engine/src/theme/motion';
import { Icon, mix, windowWeight } from '../../../engine/src/ui';
import { CARD, HULL_LABELS, INSURANCE_SEAL, OPTIONS, RECORD } from '../data/s04-sinparche';
import { TIMELINE } from '../timeline/load';
import { DataSeal, ScoreBadge } from './parts/Finding';
import { ExceptionRecord, type RecordFieldDef } from './parts/ExceptionRecord';
import { Hull, hullPoint, hullSize } from './parts/Hull';
import { OptionTile } from './parts/Options';
import { Stage, wordFrame } from './kit';

const S = 's04-sinparche';
const W = STAGE.width;

// ---- Phase A–B: the finding's card and the four options. Both slide down before the intercepted message (its slot is stage y 10–175).
const CARD_W = 1680;
const CARD_H = 236;
const CARD_X = (W - CARD_W) / 2;
const CARD_TOP_A = 10;
const CARD_TOP_B = 190;
const CARD_SCALE_B = 0.78;
const OPT_TOP_A = 276;
const OPT_TOP_B = 392;
const OPT_H = 160;
const OPT_WS = [330, 340, 540, 330] as const;
const OPT_GAP = 32;
const SEAL_TOP = OPT_TOP_B + OPT_H + 16;

// ---- Phase C: the strip on top, the hull, the record.
const STRIP_H = 66;
const MINI = [250, 200, 420, 260] as const;
const HULL_W = 700;
const HULL_TOP = 108;
const HULL_H = hullSize(HULL_W).h;
const REC_W = 960;
const REC_X = W - REC_W;
const REC_TOP = 96;

/** The intercepted message's window in this scene's local frames (from the timeline). */
function interceptWindow(): { from: number; to: number } {
  const e = TIMELINE.intercept?.find((i) => i.scene === S);
  if (!e) return { from: Number.POSITIVE_INFINITY, to: Number.NEGATIVE_INFINITY };
  const origin = sceneTiming(TIMELINE, S).from - enterFramesFor(TIMELINE, S);
  return { from: e.from - origin, to: e.from + e.durationInFrames - origin };
}

/**
 * s04-sinparche «Lo que no tiene parche». On `unpatchable` the third finding's card arrives (`cam-nvr-02`, the
 * cameras' recorder, CVE-2026-38105, 8.1 HIGH, «firmware sin soporte», «el fabricante no publica parche»). On `options`
 * four tiles arrive one by one; on `no-patch` «parchear» is struck out (sfx «block»). The card and the tiles step down
 * for SILENT PAGER's message; on `insurance` «seguro · insurance» is struck out and the seal says why («transfiere el
 * coste · el fallo sigue igual de explotable»). On `isolate` «aislar y compensar» lights, the tiles become a strip at
 * the top, and the same hull arrives: mamparos on «mamparos» (isolate), the pump on «bombas» (alertas reforzadas).
 * On `record` the exception record lands (sfx «lock») and fills field by field; `owner` (Dueño, with its note),
 * `expiry` (Caduca, lit) and the review. The last frame: strip, hull, the quiet record.
 */
export function S04Sinparche(props: SceneProps) {
  const frame = useCurrentFrame();
  const unpatchableAt = props.cue('unpatchable');
  const optionsAt = props.cue('options');
  const noPatchAt = props.cue('no-patch');
  const insuranceAt = props.cue('insurance');
  const isolateAt = props.cue('isolate');
  const recordAt = props.cue('record');
  const ownerAt = props.cue('owner');
  const expiryAt = props.cue('expiry');
  const ic = interceptWindow();

  // ---- The card.
  const cardIn = springIn(frame, 30, unpatchableAt - 4, { damping: 16 });
  const scoreAt = wordFrame(S, 's04-01', 'Tiene') - 4;
  const chipAt = [wordFrame(S, 's04-01', 'pero') - 4, wordFrame(S, 's04-01', 'fabricante') - 6];
  const slide = progress(frame, ic.from - 30, 24, EASE.inOut);
  const toC = progress(frame, isolateAt + 26, 16, EASE.inOut);

  // ---- The options.
  const tileIn = OPTIONS.map((_, i) => progress(frame, optionsAt + 8 + i * 12, 14));
  const patchCross = progress(frame, noPatchAt - 2, 12);
  const insCross = progress(frame, insuranceAt, 12);
  const isoLit = progress(frame, isolateAt, 14);
  const excLit = progress(frame, recordAt - 4, 14);
  const sealA = progress(frame, wordFrame(S, 's04-03', 'paga') - 4, 14);
  const sealB = progress(frame, wordFrame(S, 's04-03', 'explotable') - 10, 14);
  const sealOut = 1 - toC;

  // ---- The hull and its labels.
  const hullIn = springIn(frame, 30, isolateAt + 20, { damping: 17 });
  const bulkAt = wordFrame(S, 's04-04', 'mamparos') - 12;
  const pumpAt = wordFrame(S, 's04-04', 'bombas') - 12;
  const bulk = progress(frame, bulkAt, 26, EASE.inOut);
  const pump = progress(frame, pumpAt, 22, EASE.inOut);
  const move = progress(frame, recordAt - 10, 26, EASE.inOut);
  const hullLeft = mix((W - HULL_W) / 2, 6, move);
  const labelA = progress(frame, bulkAt + 12, 14);
  const labelB = progress(frame, pumpAt + 12, 14);

  // ---- The record.
  const fields: RecordFieldDef[] = RECORD.rows.map((r) => {
    const at: Record<string, number> = {
      what: recordAt + 16,
      why: recordAt + 44,
      owner: ownerAt + 4,
      controls: wordFrame(S, 's04-05', 'controles') - 8,
      expiry: expiryAt + 2,
      review: wordFrame(S, 's04-06', 'revisa') - 6,
    };
    return { key: r.key, label: r.label, value: r.value, at: at[r.key], note: 'note' in r ? r.note : undefined, noteAt: ownerAt + 30, tone: r.key === 'owner' ? '#c4b5fd' : undefined };
  });
  const expiryGlow = windowWeight(frame, expiryAt, wordFrame(S, 's04-06', 'revisa') - 10);

  const cardTop = mix(CARD_TOP_A, CARD_TOP_B, slide);
  const cardScale = mix(1, CARD_SCALE_B, slide);
  const optTop = mix(OPT_TOP_A, OPT_TOP_B, slide);

  return (
    <Stage>
      {/* ================= A–B: the card, the options, the insurance seal ================= */}
      {toC < 1 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: 1 - toC }}>
          {cardIn > 0.01 ? (
            <div style={{ position: 'absolute', left: CARD_X, top: cardTop, width: CARD_W, height: CARD_H, transformOrigin: '50% 0%', transform: `scale(${cardScale}) translateY(${(1 - Math.min(1, cardIn)) * 26}px)`, opacity: Math.min(1, cardIn * 1.4) }}>
              <FindingCard frame={frame} scoreAt={scoreAt} chipAt={chipAt} />
            </div>
          ) : null}

          <div style={{ position: 'absolute', left: (W - (OPT_WS.reduce((a, b) => a + b, 0) + 3 * OPT_GAP)) / 2, top: optTop, display: 'flex', gap: OPT_GAP }}>
            {OPTIONS.map((o, i) => (
              <OptionTile
                key={o.key}
                main={o.main}
                terms={o.terms}
                width={OPT_WS[i]}
                height={OPT_H}
                show={tileIn[i]}
                cross={o.key === 'patch' ? patchCross : o.key === 'insurance' ? insCross : 0}
                lit={o.key === 'isolate' ? isoLit : 0}
              />
            ))}
          </div>

          {sealA > 0.01 ? (
            <div style={{ position: 'absolute', left: 0, top: SEAL_TOP, width: W, display: 'flex', justifyContent: 'center', opacity: sealOut }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 22, fontFamily: FONT.sans, whiteSpace: 'nowrap' }}>
                <span
                  style={{
                    padding: '6px 22px',
                    borderRadius: RADIUS.md,
                    border: `4px solid ${C.rose}`,
                    background: alpha(C.roseDeep, 0.7),
                    color: '#fecdd3',
                    fontSize: 36,
                    fontWeight: 850,
                    letterSpacing: 1,
                    transform: `rotate(-2deg) scale(${1.25 - 0.25 * sealA})`,
                    opacity: sealA,
                  }}
                >
                  {INSURANCE_SEAL.stamp}
                </span>
                <span style={{ fontSize: 38, fontWeight: 750, color: C.text, opacity: sealA }}>{INSURANCE_SEAL.line1}</span>
                <span style={{ fontSize: 38, fontWeight: 750, color: C.faint, opacity: sealB }}>·</span>
                <span style={{ fontSize: 38, fontWeight: 850, color: '#fda4af', opacity: sealB }}>{INSURANCE_SEAL.line2}</span>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}

      {/* ================= C: the strip, the hull, the record ================= */}
      {toC > 0.01 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: toC }}>
          <div style={{ position: 'absolute', left: 0, top: 0, width: W, height: STRIP_H, display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, height: STRIP_H, boxSizing: 'border-box', padding: '0 20px', borderRadius: RADIUS.md, border: `2px solid ${alpha(C.rose, 0.6)}`, background: alpha(C.roseDeep, 0.5), fontFamily: FONT.mono, fontSize: 34, fontWeight: 800, color: C.textStrong, whiteSpace: 'nowrap' }}>
              {CARD.host}
              <span style={{ color: '#fecdd3' }}>{CARD.score}</span>
            </div>
            {OPTIONS.map((o, i) => (
              <OptionTile
                key={o.key}
                mini
                main={o.main}
                terms={[]}
                width={MINI[i]}
                height={STRIP_H}
                cross={o.key === 'patch' || o.key === 'insurance' ? 1 : 0}
                lit={o.key === 'isolate' ? 1 : o.key === 'exception' ? excLit : 0}
              />
            ))}
          </div>

          {hullIn > 0.01 ? (
            <div style={{ position: 'absolute', left: hullLeft, top: HULL_TOP, width: HULL_W, height: HULL_H + 150, opacity: Math.min(1, hullIn * 1.4), transform: `translateY(${(1 - Math.min(1, hullIn)) * 24}px)` }}>
              <Hull width={HULL_W} sea={1} storm={0} hole={1} bulkheads={bulk} pumps={pump} />
              <HullLabel width={HULL_W} anchor={hullPoint(HULL_W, 'bulkheadL')} at={{ x: 0, y: HULL_H + 20 }} main={HULL_LABELS.bulkheads.main} sub={HULL_LABELS.bulkheads.sub} tone={C.emerald} show={labelA} />
              <HullLabel width={HULL_W} anchor={hullPoint(HULL_W, 'pump')} at={{ x: 262, y: HULL_H + 20 }} main={HULL_LABELS.pumps.main} sub={HULL_LABELS.pumps.sub} tone={C.amber} show={labelB} />
            </div>
          ) : null}

          <div style={{ position: 'absolute', left: REC_X, top: REC_TOP }}>
            <ExceptionRecord width={REC_W} title={RECORD.title} fields={fields} at={recordAt} glow={{ expiry: expiryGlow }} />
          </div>
        </div>
      ) : null}
    </Stage>
  );
}

/** The finding, expanded: host and what it is, the CVE (invented: sealed), the 8.1 HIGH, and why it cannot be patched. */
function FindingCard({ frame, scoreAt, chipAt }: { frame: number; scoreAt: number; chipAt: number[] }) {
  const scoreIn = enter(frame, scoreAt, { distance: 14, duration: 14 });
  return (
    <div
      style={{
        width: CARD_W,
        height: CARD_H,
        boxSizing: 'border-box',
        borderRadius: RADIUS.lg,
        border: `2px solid ${alpha('#fb7185', 0.8)}`,
        background: `linear-gradient(90deg, ${alpha('#5b0f24', 0.7)} 0%, ${alpha(C.ink900, 0.97)} 62%)`,
        boxShadow: `0 0 28px ${alpha(C.rose, 0.16)}`,
        padding: '22px 36px 18px 40px',
        fontFamily: FONT.sans,
        position: 'relative',
      }}
    >
      <div style={{ position: 'absolute', left: 0, top: 14, bottom: 14, width: 9, borderRadius: 5, background: '#fb7185' }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 36, height: 124 }}>
        <div style={{ width: 520 }}>
          <div style={{ fontFamily: FONT.mono, fontSize: 48, fontWeight: 850, color: C.textStrong, lineHeight: 1.1 }}>{CARD.host}</div>
          <div style={{ fontSize: 36, fontWeight: 650, color: C.text, marginTop: 6 }}>{CARD.what}</div>
        </div>
        <div style={{ width: 400, ...scoreIn }}>
          <div style={{ fontFamily: FONT.mono, fontSize: 38, fontWeight: 800, color: C.cyanSoft, whiteSpace: 'nowrap' }}>{CARD.cve}</div>
          <div style={{ marginTop: 6 }}>
            <DataSeal size={24} />
          </div>
        </div>
        <div style={{ ...scoreIn }}>
          <div style={{ fontSize: 30, fontWeight: 650, color: C.muted }}>{CARD.version}</div>
          <ScoreBadge score={CARD.score} sev={CARD.sev} size={68} />
          <div style={{ fontFamily: FONT.mono, fontSize: 24, fontWeight: 600, color: C.faint, marginTop: 4, whiteSpace: 'nowrap' }}>{CARD.vector}</div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 20, marginTop: 8 }}>
        {CARD.chips.map((c, i) => {
          const e = enter(frame, chipAt[i], { distance: 12, duration: 12 });
          return (
            <span
              key={c}
              style={{
                ...e,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 12,
                padding: '6px 22px 6px 14px',
                borderRadius: RADIUS.pill,
                border: `3px solid ${alpha(i === 0 ? C.amber : C.rose, 0.8)}`,
                background: alpha(i === 0 ? C.amberDeep : C.roseDeep, 0.6),
                fontSize: 36,
                fontWeight: 800,
                color: i === 0 ? '#fde68a' : '#fecdd3',
                whiteSpace: 'nowrap',
              }}
            >
              <Icon name={i === 0 ? 'alert' : 'unplug'} size={36} color={i === 0 ? C.amber : C.rose} />
              {c}
            </span>
          );
        })}
      </div>
    </div>
  );
}

/** A label under the hull with a dashed leader to the part it names. */
function HullLabel({ width, anchor, at, main, sub, tone, show }: { width: number; anchor: { x: number; y: number }; at: { x: number; y: number }; main: string; sub: string; tone: string; show: number }) {
  if (show < 0.01) return null;
  return (
    <>
      <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none' }} width={width} height={1}>
        <path d={`M ${at.x + 110} ${at.y} L ${anchor.x} ${anchor.y + 14}`} stroke={alpha(tone, 0.8 * show)} strokeWidth={4} strokeDasharray="3 9" fill="none" />
        <circle cx={anchor.x} cy={anchor.y + 14} r={7 * show} fill={tone} />
      </svg>
      <div
        style={{
          position: 'absolute',
          left: at.x,
          top: at.y,
          padding: '4px 20px 6px',
          borderRadius: RADIUS.md,
          border: `3px solid ${alpha(tone, 0.85)}`,
          background: alpha(C.ink900, 0.95),
          boxShadow: `0 0 ${Math.round(20 * show)}px ${alpha(tone, 0.3)}`,
          fontFamily: FONT.sans,
          whiteSpace: 'nowrap',
          opacity: show,
          transform: `translateY(${(1 - show) * 10}px)`,
        }}
      >
        <div style={{ fontSize: 38, fontWeight: 850, color: C.textStrong, lineHeight: 1.15 }}>{main}</div>
        <div style={{ fontSize: 32, fontWeight: 650, color: tone === C.amber ? '#fcd34d' : '#6ee7b7', lineHeight: 1.15 }}>{sub}</div>
      </div>
    </>
  );
}

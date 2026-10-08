import type { ReactNode } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, progress, springIn } from '../../../engine/src/theme/motion';
import { Icon, clamp01, windowWeight, type IconName } from '../../../engine/src/ui';
import { DECISION, FULL, SPLIT, STAMP_LINES, TODAY } from '../data/s09-tunel';
import { Customs, customsLayout } from './parts/Customs';
import { INK, Label } from './parts/glyphs';
import { PlanStamp } from './parts/s09-tunel/PlanStamp';
import { Launch } from './parts/Sites';
import { Stage, segment, wordFrame } from './kit';

const S = 's09-tunel';
const W = STAGE.width;

/** The customs drawing: 1300 wide (h 487) under a header row; the top strip stays free for the header. */
const CUST_W = 1300;
const CUST_X = (W - CUST_W) / 2;
const CUST_Y = 172;
const CL = customsLayout(CUST_W);

/** Header row (stage y 0–150): the scheme on the left, its consequence in a box on the right. */
const HEAD_H = 150;
const BOX_X = 1000;
const BOX_W = W - BOX_X;

const EXAM_TEXT = '#c4b5fd';

/** Loop a token along its route every `n` frames from `t0` (offset `off` of a lap). */
const loop = (frame: number, t0: number, n: number, off = 0) => (frame < t0 ? 0 : ((frame - t0) / n + off) % 1);

/**
 * s09-tunel «Un pie a cada lado». Three beats:
 *
 *  A) Today (`today-split`, then the intercepted message): the port's remote access VPN — the launch with
 *     its client, «Acceso remoto del puerto», REMOTE ACCESS VPN — and the amber «hoy: túnel dividido». Held
 *     low on the stage so the intercept card's strip (stage y 10–146) stays clear until `full`.
 *  B) The lesson's two schemes, one at a time, on the customs drawing (parts/Customs): on `full` the laptop
 *     stands outside and everything goes through the tunnel into the booth (FULL TUNNEL); `inspect` runs the
 *     scanner and the part prints «filtrado web · DLP · registros del SOC»; on «aduana» the booth glows and
 *     the header says «nada pasa sin que lo veas»; `price` lights the amber price box. On `split` the
 *     laptop walks onto the fence (SPLIT TUNNEL): web goes straight out, «directo · sin inspección» (the
 *     part) + «sin DLP · sin registro» (here, under it); `bridge` lights the rose link and its caption.
 *  C) `decision`: the drawing steps back for «portátiles del puerto: túnel completo · Sistemas», and the
 *     committee's stamp lands on «aprueba» — approved, from 1-12, not running. It holds through `wrap`.
 */
export function S09Tunel(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const todayAt = props.cue('today-split');
  const fullAt = props.cue('full');
  const inspectAt = props.cue('inspect');
  const priceAt = props.cue('price');
  const splitAt = props.cue('split');
  const bridgeAt = props.cue('bridge');
  const decisionAt = props.cue('decision');
  const approvedAt = props.cue('approved');
  const s05 = segment(props, 's09-05');
  const customsAt = Math.max(s05.from, wordFrame(S, 's09-05', 'aduana') - 8);
  const nadaAt = Math.max(customsAt, wordFrame(S, 's09-05', 'nada') - 6);
  const stampAt = Math.min(wordFrame(S, 's09-08', 'aprueba') - 4, approvedAt + 36);

  // ---- A) today ---------------------------------------------------------------------------------------
  const aOut = progress(frame, fullAt - 10, 14, EASE.inOut);
  const modeIn = springIn(frame, fps, todayAt + 2, { damping: 15 });
  const termIn = progress(frame, todayAt + 10, 14);

  // ---- B) the two schemes -------------------------------------------------------------------------------
  const draw = progress(frame, fullAt - 4, 24, EASE.inOut);
  const tunnel = progress(frame, fullAt + 10, 24);
  const split = progress(frame, splitAt, 30, EASE.inOut);
  const tokensFrom = fullAt + 26;
  const inspect = progress(frame, inspectAt, 16) * (1 - progress(frame, splitAt, 12));
  const direct = progress(frame, splitAt + 30, 16);
  const bridge = progress(frame, bridgeAt, 18);
  const focusCustoms = windowWeight(frame, customsAt, priceAt);
  const focusLaptop = windowWeight(frame, bridgeAt, decisionAt);

  const headIn = progress(frame, fullAt + 4, 16);
  const toSplit = progress(frame, splitAt - 4, 16, EASE.inOut);
  const subFull = 1 - progress(frame, nadaAt - 6, 10);
  const subCustoms = progress(frame, nadaAt, 12) * (1 - toSplit);
  const priceShow = progress(frame, priceAt, 14) * (1 - progress(frame, splitAt - 8, 12));
  const bridgeShow = progress(frame, bridgeAt + 4, 14);

  // ---- C) the decision and the stamp ---------------------------------------------------------------------
  const cIn = progress(frame, decisionAt - 4, 14, EASE.inOut);
  const decisionIn = springIn(frame, fps, decisionAt, { damping: 16 });

  return (
    <Stage style={{ fontFamily: FONT.sans }}>
      {/* ================= A ================= */}
      {aOut < 1 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: 1 - aOut, transform: `translateY(${-24 * aOut}px)` }}>
          <div style={{ position: 'absolute', left: 340, top: 236, display: 'flex', alignItems: 'center', gap: 64 }}>
            <Launch width={360} wake={1} glow={0.35} />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 14 }}>
              <div style={{ fontSize: 46, fontWeight: 800, color: C.textStrong, letterSpacing: -0.6 }}>{TODAY.service}</div>
              <div style={{ fontSize: 40, fontWeight: 850, color: EXAM_TEXT, letterSpacing: 0.5, opacity: termIn }}>{TODAY.term}</div>
              <div
                style={{
                  marginTop: 10,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 16,
                  padding: '12px 28px 14px 22px',
                  borderRadius: RADIUS.pill,
                  border: `3px solid ${alpha(C.amber, 0.8)}`,
                  background: alpha(C.amber, 0.12),
                  boxShadow: `0 0 34px ${alpha(C.amber, 0.22 * clamp01(modeIn))}`,
                  fontSize: 48,
                  fontWeight: 850,
                  color: INK.amberSoft,
                  opacity: clamp01(modeIn * 1.4),
                  transform: `scale(${0.9 + 0.1 * clamp01(modeIn)})`,
                  transformOrigin: 'left center',
                }}
              >
                <Icon name="split" size={46} color={C.amber} strokeWidth={2.2} />
                {TODAY.mode}
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* ================= B ================= */}
      {draw > 0 ? (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 1 - 0.86 * cIn,
            filter: cIn > 0.01 ? `blur(${(2.5 * cIn).toFixed(2)}px) saturate(${1 - 0.5 * cIn})` : undefined,
          }}
        >
          {/* Header: the scheme in focus, and its consequence */}
          <div style={{ position: 'absolute', left: 0, top: 0, width: BOX_X - 30, height: HEAD_H, opacity: headIn * (1 - cIn) }}>
            <SchemeTitle term={FULL.term} es="túnel completo" show={1 - toSplit} />
            <SchemeTitle term={SPLIT.term} es="túnel dividido" show={toSplit} />
            <SubLine show={subFull * (1 - toSplit)}>{FULL.sub}</SubLine>
            <SubLine show={subCustoms}>{FULL.customs}</SubLine>
            <SubLine show={progress(frame, splitAt + 8, 14)}>{SPLIT.sub}</SubLine>
          </div>
          <ConsequenceBox show={priceShow * (1 - cIn)} color={C.amber} soft={INK.amberSoft} icon="clock" lines={FULL.price} />
          <ConsequenceBox show={bridgeShow * (1 - cIn)} color={C.rose} soft={C.roseSoft} icon="link" lines={SPLIT.bridge} />

          {/* The customs drawing */}
          <div style={{ position: 'absolute', left: CUST_X, top: CUST_Y }}>
            <Customs
              width={CUST_W}
              split={split}
              draw={draw}
              tunnel={tunnel}
              web={loop(frame, tokensFrom, 120)}
              files={loop(frame, tokensFrom, 120, 0.34)}
              mail={loop(frame, tokensFrom, 120, 0.67)}
              inspect={inspect}
              direct={direct}
              bridge={bridge}
              focus={{ customs: focusCustoms, laptop: focusLaptop }}
              frame={frame}
            />
            {/* The canon split string's second half, under the part's «directo · sin inspección» */}
            {direct > 0.01 ? (
              <Label
                x={CL.directLabel.x}
                y={CL.directLabel.y + 46}
                anchor="center-top"
                size={32}
                weight={800}
                color={INK.amberSoft}
                style={{ opacity: direct, background: alpha(C.ink900, 0.9), padding: '2px 12px 4px', borderRadius: 10 }}
              >
                {SPLIT.directRest}
              </Label>
            ) : null}
          </div>
        </div>
      ) : null}

      {/* ================= C ================= */}
      {cIn > 0 ? (
        <div style={{ position: 'absolute', inset: 0 }}>
          <div style={{ position: 'absolute', left: 0, width: W, top: 64, display: 'flex', justifyContent: 'center' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 22,
                padding: '20px 36px 22px 28px',
                borderRadius: 28,
                background: alpha(C.ink900, 0.94),
                border: `3px solid ${alpha(C.cyan, 0.75)}`,
                boxShadow: `0 0 40px ${alpha(C.cyan, 0.2)}, 0 30px 70px ${alpha('#000000', 0.45)}`,
                opacity: clamp01(decisionIn * 1.4),
                transform: `translateY(${(1 - clamp01(decisionIn)) * 20}px)`,
                whiteSpace: 'nowrap',
              }}
            >
              <Icon name="laptop" size={52} color={C.cyan} strokeWidth={2} />
              <span style={{ fontSize: 48, fontWeight: 850, color: C.textStrong, letterSpacing: -0.6 }}>{DECISION.text}</span>
              <span style={{ fontSize: 48, fontWeight: 700, color: C.muted }}>·</span>
              <span style={{ fontSize: 48, fontWeight: 850, color: C.cyanSoft }}>{DECISION.owner}</span>
            </div>
          </div>
          <div style={{ position: 'absolute', left: 0, width: W, top: 262, display: 'flex', justifyContent: 'center' }}>
            <PlanStamp frame={frame} at={stampAt} lines={STAMP_LINES} />
          </div>
        </div>
      ) : null}
    </Stage>
  );
}

/** «FULL TUNNEL» / «SPLIT TUNNEL» (exam term, violet) with its Spanish name; the two cross-fade in place. */
function SchemeTitle({ term, es, show }: { term: string; es: string; show: number }) {
  const s = clamp01(show);
  if (s <= 0.01) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        display: 'flex',
        alignItems: 'baseline',
        gap: 22,
        whiteSpace: 'nowrap',
        opacity: s,
        transform: `translateY(${(1 - s) * 10}px)`,
      }}
    >
      <span style={{ fontSize: 66, fontWeight: 850, color: EXAM_TEXT, letterSpacing: -0.5 }}>{term}</span>
      <span style={{ fontSize: 38, fontWeight: 750, color: C.muted }}>{es}</span>
    </div>
  );
}

/** The line under the title; several share the slot and cross-fade. */
function SubLine({ show, children }: { show: number; children: ReactNode }) {
  const s = clamp01(show);
  if (s <= 0.01) return null;
  return (
    <div style={{ position: 'absolute', left: 2, top: 86, fontSize: 40, fontWeight: 750, color: C.text, whiteSpace: 'nowrap', opacity: s }}>
      {children}
    </div>
  );
}

/** The scheme's price (amber) or risk (rose): a box on the right of the header, two lines. */
function ConsequenceBox({ show, color, soft, icon, lines }: { show: number; color: string; soft: string; icon: IconName; lines: readonly string[] }) {
  const s = clamp01(show);
  if (s <= 0.01) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: BOX_X,
        top: 4,
        width: BOX_W,
        height: HEAD_H - 14,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        gap: 22,
        padding: '0 26px',
        borderRadius: 24,
        border: `3px solid ${alpha(color, 0.8)}`,
        background: `linear-gradient(90deg, ${alpha(color, 0.14)} 0%, ${alpha(C.ink900, 0.92)} 100%)`,
        boxShadow: `0 0 34px ${alpha(color, 0.2 * s)}`,
        opacity: s,
        transform: `translateX(${(1 - s) * 24}px)`,
      }}
    >
      <div style={{ flexShrink: 0, width: 72, height: 72, borderRadius: 36, display: 'grid', placeItems: 'center', background: alpha(color, 0.16), border: `2px solid ${alpha(color, 0.6)}` }}>
        <Icon name={icon} size={42} color={color} strokeWidth={2.2} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 38, fontWeight: 800, color: soft, lineHeight: 1.12, whiteSpace: 'nowrap' }}>
        {lines.map((l, i) => (
          <div key={i}>{l}</div>
        ))}
      </div>
    </div>
  );
}

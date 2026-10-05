import type { ReactNode } from 'react';
import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, alpha } from '../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../engine/src/theme/motion';
import { clamp01, mix, windowWeight } from '../../../engine/src/ui';
import { DELIVERY_GLOSS, FROM_LABEL, REAL_SENDER_LABEL, RECON_CHIP, RECON_WHY } from '../data/s03-correo';
import { MailHeaders, mailHeight, mailRowAnchor, mailSpanAnchor } from './parts/LessonLog';
import { PhaseCard } from './parts/s03-correo/PhaseCard';
import { Stage, segment, wordFrame } from './kit';

const S = 's03-correo';
const W = 1728;

// ---- Places (stage-local) ----------------------------------------------------------------
const PANEL = { x: 0, w: 1300 } as const;
/** The panel sits centred while the voice reads it, and rises when the card and the «why» need room. */
const PANEL_Y = { read: 128, card: 60 } as const;
/** Right-hand column: labels next to the rows, then the phase card. */
const COL = { x: 1328, w: W - 1328 } as const;
const CARD_Y = 214;
const VIGNETTE_W = 300;
/** The «why» strip under the panel. */
const WHY_Y = 500;

/**
 * s03-correo «La caja en la puerta». The spearphish headers exactly as the
 * lesson prints them (no `[fase]` tags, no `*`, no `To:`), titled «pasarela de
 * correo · 2026-03-02 09:41 UTC». Step by step, with the rest dimmed: `From`
 * with `meridian-careers.com` (amber) «parece de casa»; `Return-Path` and the
 * two `Received` lines with `mx1.cdn-sync-status.example` (rose) «apuntan a
 * quien lo envió de verdad» (the IP untouched); the subject. Then the box at
 * the door lights on the right and DELIVERY enters with «llevar el artefacto
 * hasta la víctima». The voice raises «¿Reconnaissance?» next to `From` and
 * strikes it: «investigar a Meridian fue antes · usarlo para que el correo
 * entre y se abra es entrega». The attachment line stays dimmed (s05's).
 */
export function S03Correo(props: SceneProps) {
  const frame = useCurrentFrame();

  const headersAt = props.cue('headers');
  const fromAt = props.cue('from');
  const realAt = props.cue('real-sender');
  const subjectAt = props.cue('subject');
  const deliveryAt = props.cue('delivery');
  const notReconAt = props.cue('not-recon');
  const s5 = segment(props, 's03-05');

  const wParece = wordFrame(S, 's03-02', 'parece');
  const wApuntan = wordFrame(S, 's03-02', 'apuntan');
  const wArtefacto = wordFrame(S, 's03-04', 'artefacto');
  const wDelivery = wordFrame(S, 's03-04', 'Delivery');
  const wRecon = wordFrame(S, 's03-05', 'Reconnaissance');
  const wUsar = wordFrame(S, 's03-06', 'Usar');
  const wEntrega = wordFrame(S, 's03-06', 'entrega');

  // ---- The panel ---------------------------------------------------------------------------
  const draw = progress(frame, 2, 72, EASE.linear);
  const headerGlow = windowWeight(frame, headersAt, fromAt, { ramp: 12 });
  const fFrom = Math.max(windowWeight(frame, fromAt, realAt), windowWeight(frame, s5.from, notReconAt));
  const fReal = windowWeight(frame, realAt, subjectAt);
  const fSubject = windowWeight(frame, subjectAt, deliveryAt);
  const allDim = progress(frame, deliveryAt - 6, 16, EASE.inOut);
  const dim = Math.max(fFrom, fReal, fSubject, allDim);

  const hSender = Math.max(windowWeight(frame, fromAt + 4, realAt), windowWeight(frame, s5.from + 4, notReconAt + 20));
  const hReal = windowWeight(frame, realAt + 6, subjectAt);
  const hSubject = windowWeight(frame, subjectAt + 4, deliveryAt);

  const panelY = mix(PANEL_Y.read, PANEL_Y.card, progress(frame, deliveryAt - 8, 22, EASE.inOut));
  const panelH = mailHeight(PANEL.w);
  const fromRow = mailRowAnchor('from', PANEL.w, 1);
  const senderSpan = mailSpanAnchor('senderDomain', PANEL.w, 1);
  const rpRow = mailRowAnchor('returnPath', PANEL.w);
  const byRow = mailRowAnchor('receivedBy', PANEL.w);

  // ---- Labels in the right column ---------------------------------------------------------
  const fromLabel = progress(frame, wParece - 4, 12) * (1 - progress(frame, realAt - 4, 10));
  const realLabel = progress(frame, wApuntan - 4, 12) * (1 - progress(frame, subjectAt - 4, 10));
  const bracketDraw = progress(frame, wApuntan - 8, 14, EASE.inOut);

  // ---- Delivery ---------------------------------------------------------------------------------
  const vignetteIn = progress(frame, deliveryAt, 16);
  const nameIn = progress(frame, wDelivery - 4, 14);
  const glossIn = progress(frame, wArtefacto - 4, 14);
  const nameGlow = windowWeight(frame, wEntrega - 4, wEntrega + 46, { ramp: 12 });
  const cardLit = 0.45 + 0.55 * windowWeight(frame, deliveryAt, s5.from, { ramp: 14 });

  // ---- «¿Reconnaissance?» -----------------------------------------------------------------------
  const chipIn = progress(frame, wRecon - 6, 12);
  const strike = progress(frame, notReconAt + 2, 14, EASE.inOut);
  const whyBefore = progress(frame, notReconAt + 8, 14);
  const whyUse = progress(frame, wUsar - 4, 14);

  return (
    <Stage>
      {/* The headers */}
      <div style={{ position: 'absolute', left: PANEL.x, top: panelY }}>
        <MailHeaders
          width={PANEL.w}
          draw={draw}
          headerGlow={headerGlow}
          focus={{ from: fFrom, returnPath: fReal, received: fReal, receivedBy: fReal, subject: fSubject }}
          dim={dim}
          rowDim={{ attachment: 1 }}
          focusTone={fFrom > 0.5 ? C.amber : fReal > 0.5 ? C.rose : C.cyan}
          highlight={{ senderDomain: hSender, returnPathDomain: hReal, receivedDomain: hReal, subject: hSubject }}
        />
      </div>

      {/* «parece de casa» next to the From domain */}
      {fromLabel > 0 ? (
        <>
          <svg width={W} height={panelH} style={{ position: 'absolute', left: 0, top: panelY, overflow: 'visible', opacity: fromLabel }}>
            <line x1={senderSpan.x1 + 10} y1={fromRow.y} x2={COL.x - 6} y2={fromRow.y} stroke={alpha(C.amber, 0.8)} strokeWidth={3} strokeLinecap="round" />
          </svg>
          <Pill top={panelY + fromRow.y} tone={C.amber} appear={fromLabel}>
            {FROM_LABEL}
          </Pill>
        </>
      ) : null}

      {/* «apuntan a quien lo envió de verdad»: a bracket over Return-Path + Received */}
      {realLabel > 0 || bracketDraw > 0 ? (
        <>
          <svg width={W} height={panelH} style={{ position: 'absolute', left: 0, top: panelY, overflow: 'visible', opacity: realLabel }}>
            {(() => {
              const x = PANEL.w + 8;
              const y0 = rpRow.y - 22;
              const y1 = byRow.y + 22;
              const ym = (y0 + y1) / 2;
              const len = (y1 - y0) + 2 * 14;
              return (
                <path
                  d={`M${x} ${y0} L${x + 14} ${y0} L${x + 14} ${y1} L${x} ${y1} M${x + 14} ${ym} L${COL.x - 4} ${ym}`}
                  fill="none"
                  stroke={C.rose}
                  strokeWidth={3}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray={`${len + 40} ${len + 40}`}
                  strokeDashoffset={(len + 40) * (1 - bracketDraw)}
                />
              );
            })()}
          </svg>
          <div
            style={{
              position: 'absolute',
              left: COL.x + 6,
              top: panelY + (rpRow.y + byRow.y) / 2,
              transform: `translateY(-50%) translateX(${(1 - realLabel) * 12}px)`,
              opacity: realLabel,
              fontFamily: FONT.sans,
              fontSize: 36,
              fontWeight: 750,
              lineHeight: 1.18,
              color: C.roseSoft,
            }}
          >
            {REAL_SENDER_LABEL.map((l) => (
              <div key={l} style={{ whiteSpace: 'nowrap' }}>
                {l}
              </div>
            ))}
          </div>
        </>
      ) : null}

      {/* The box at the door + DELIVERY */}
      {vignetteIn > 0 ? (
        <div style={{ position: 'absolute', left: COL.x, top: CARD_Y }}>
          <PhaseCard
            phase="delivery"
            width={COL.w}
            vignetteW={VIGNETTE_W}
            look={{ show: vignetteIn, act: progress(frame, deliveryAt + 2, 30, EASE.inOut), lit: Math.max(cardLit, nameGlow), tone: 'cyan' }}
            titleIn={nameIn}
            gloss={DELIVERY_GLOSS}
            glossIn={glossIn}
          />
        </div>
      ) : null}

      {/* «¿Reconnaissance?» next to From, struck on `not-recon` */}
      {chipIn > 0 ? (
        <Pill top={panelY + fromRow.y} tone={C.amber} appear={chipIn} strike={strike} solid>
          {RECON_CHIP}
        </Pill>
      ) : null}

      {/* Why it is not Reconnaissance */}
      {whyBefore > 0 ? (
        <div
          style={{
            position: 'absolute',
            left: 24,
            top: WHY_Y,
            width: PANEL.w - 24,
            display: 'flex',
            flexDirection: 'column',
            gap: 18,
            fontFamily: FONT.sans,
            fontSize: 40,
            fontWeight: 650,
            lineHeight: 1.15,
          }}
        >
          <WhyLine appear={whyBefore} bar={C.amber} color={C.text}>
            {RECON_WHY.before}
          </WhyLine>
          <WhyLine appear={whyUse} bar={C.violet} color={C.textStrong}>
            {RECON_WHY.use}
            <span style={{ color: C.violet, fontWeight: 850 }}>{RECON_WHY.tail}</span>
          </WhyLine>
        </div>
      ) : null}
    </Stage>
  );
}

/** A label pill in the right column, vertically centred on `top`. */
function Pill({
  top,
  tone,
  appear,
  strike = 0,
  solid = false,
  children,
}: {
  top: number;
  tone: string;
  appear: number;
  strike?: number;
  solid?: boolean;
  children: string;
}) {
  const s = clamp01(strike);
  return (
    <div
      style={{
        position: 'absolute',
        left: COL.x,
        top,
        transform: `translateY(-50%) translateX(${(1 - appear) * 14}px)`,
        opacity: appear * (1 - 0.35 * s),
      }}
    >
      <div
        style={{
          position: 'relative',
          display: 'inline-block',
          padding: '8px 24px',
          borderRadius: 999,
          border: `3px solid ${alpha(tone, 0.85)}`,
          background: solid ? C.ink900 : alpha(tone, 0.1),
          fontFamily: FONT.sans,
          fontSize: 38,
          fontWeight: 750,
          lineHeight: 1.15,
          color: tone,
          whiteSpace: 'nowrap',
        }}
      >
        {children}
        {s > 0 ? (
          <div
            style={{
              position: 'absolute',
              left: 14,
              top: '52%',
              height: 5,
              width: `calc(${s} * (100% - 28px))`,
              borderRadius: 3,
              background: C.amber,
              boxShadow: `0 0 10px ${alpha(C.amber, 0.6)}`,
            }}
          />
        ) : null}
      </div>
    </div>
  );
}

function WhyLine({ appear, bar, color, children }: { appear: number; bar: string; color: string; children: ReactNode }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 20,
        opacity: appear,
        transform: `translateY(${(1 - appear) * 12}px)`,
      }}
    >
      <div style={{ width: 8, alignSelf: 'stretch', borderRadius: 4, background: bar }} />
      <div style={{ color, whiteSpace: 'nowrap' }}>{children}</div>
    </div>
  );
}

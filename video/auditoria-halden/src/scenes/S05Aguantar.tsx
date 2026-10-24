import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress, pulse, springIn } from '../../../engine/src/theme/motion';
import { Icon, type IconName } from '../../../engine/src/ui';
import { AdversaryTag, PaperGap } from './parts/Adversary';
import { BoardTable } from './parts/Board';
import { Bars, Sheet } from './parts/Docs';
import { BridgeArt, CertificateArt } from './parts/Images';
import { ImageTag, Pill } from './parts/Labels';
import { Stage, interceptWindow, wordFrame } from './kit';

const S = 's05-aguantar';
const W = STAGE.width;
// ---- Phase A (the board asks, the tag, the message): everything below the intercepted card's slot (stage y ≥ 215).
const BOARD_X = 24;
const BOARD_Y = 326;
const BOARD_SCALE = 0.62;
const COL_X = 620;
const BUBBLE_TOP = 232;
const CHIP_TOP = 366;
const TAG_TOP = 452;
// ---- Phase B (two columns and the bridge).
const COL_W = 840;
const COL_H = 262;
const COLS_GAP = W - 2 * COL_W;
const BANNER_TOP = 284;
const IMAGE_TOP = 346;

/** One column: a tile, the English term big, the question it answers and how. */
function Column({ icon, tone, term, question, how, show, focus = 1 }: { icon: IconName; tone: string; term: string; question: string; how: string; show: number; focus?: number }) {
  return (
    <div
      style={{
        width: COL_W,
        height: COL_H,
        boxSizing: 'border-box',
        padding: '28px 34px',
        borderRadius: RADIUS.lg,
        border: `3px solid ${alpha(tone, 0.35 + 0.5 * show * focus)}`,
        background: alpha(tone, 0.05 + 0.07 * show * focus),
        boxShadow: `0 0 ${Math.round(30 * show * focus)}px ${alpha(tone, 0.22 * show * focus)}`,
        fontFamily: FONT.sans,
        whiteSpace: 'nowrap',
        opacity: show,
        transform: `translateY(${(1 - show) * 18}px)`,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <div style={{ width: 76, height: 76, borderRadius: 20, display: 'grid', placeItems: 'center', border: `3px solid ${alpha(tone, 0.8)}`, background: alpha(tone, 0.12) }}>
          <Icon name={icon} size={46} color={tone} strokeWidth={2} />
        </div>
        <div style={{ fontSize: 54, fontWeight: 900, letterSpacing: 0.5, color: tone }}>{term}</div>
      </div>
      <div style={{ marginTop: 26, fontSize: 46, fontWeight: 850, color: C.textStrong }}>{question}</div>
      <div style={{ marginTop: 10, fontSize: 36, fontWeight: 650, color: C.text }}>{how}</div>
    </div>
  );
}

/**
 * s05-aguantar «Cumplir no es aguantar». Phase A, below the engine's intercepted-message card (stage y ≥ 215): on
 * `board-asks` the board's table (miniature) and its question «¿y si alguien intenta entrar?», with the chip «auditoría
 * independiente · encargada» (no firm, no result); on `adversary` PAPER GOVERNOR's tag («PAPER GOVERNOR · sección 5» /
 * «vive en los huecos de tu gobernanza»), glowing on «huecos». While the card types its message an «acta» fills on the
 * table with rose lines; on `intercept-reply` the acta steps back (the voice answers it with the idea, no reproach).
 * Phase B, from `audit`: phase A leaves and two columns arrive, AUDITORÍA «¿cumplimos el estándar? · evidencias y
 * muestreo» and, on `pentest`, PENETRATION TEST «¿pueden romperlo? · intentándolo, con permiso». On `bridge` the new
 * bridge (tagged «imagen · no es del puerto») draws: its certificate (cumples la norma) feeds the audit, its load test
 * with full trucks (aguantas) the pentest. On `neither` a banner closes it: aprobar una no dice nada de la otra.
 */
export function S05Aguantar(props: SceneProps) {
  const frame = useCurrentFrame();
  const win = interceptWindow(S);
  const askAt = props.cue('board-asks');
  const advAt = props.cue('adversary');
  const replyAt = props.cue('intercept-reply');
  const auditAt = props.cue('audit');
  const pentestAt = props.cue('pentest');
  const bridgeAt = props.cue('bridge');
  const neitherAt = props.cue('neither');
  const winFrom = win ? win[0] : replyAt - 105;

  // ---- Phase A
  const boardIn = enter(frame, askAt - 6, { distance: 20, duration: 20 });
  const bubbleAt = Math.max(askAt + 8, wordFrame(S, 's05-01', 'consejo') - 6);
  const bubble = springIn(frame, 30, bubbleAt, { damping: 15 });
  const chipAt = Math.max(askAt, wordFrame(S, 's05-01', 'independiente') - 10);
  const chipIn = enter(frame, chipAt, { distance: 16 });
  const tagIn = springIn(frame, 30, advAt - 4, { damping: 16 });
  const huecosAt = wordFrame(S, 's05-02', 'huecos') - 6;
  const glow = progress(frame, huecosAt, 10) * (0.55 + 0.45 * pulse(frame, 30, 0.8));
  const actaIn = progress(frame, winFrom + 6, 16);
  const actaDim = progress(frame, replyAt - 4, 14);
  const phaseOut = progress(frame, auditAt - 18, 16, EASE.inOut);

  // ---- Phase B
  const colsAt = Math.max(auditAt - 4, (win ? win[1] : 0) - 8);
  const leftIn = progress(frame, colsAt, 16);
  const rightIn = progress(frame, pentestAt - 4, 16);
  const imageIn = progress(frame, bridgeAt - 8, 16);
  const certAt = Math.max(bridgeAt + 6, wordFrame(S, 's05-06', 'certificado') - 10);
  const loadAt = Math.max(certAt + 20, wordFrame(S, 's05-06', 'prueba') - 10);
  const cert = progress(frame, certAt, 16);
  const load = progress(frame, loadAt, 22, EASE.inOut);
  const neither = progress(frame, neitherAt - 4, 16);
  const focusLeft = frame >= pentestAt - 6 ? 0.6 + 0.4 * (1 - progress(frame, pentestAt - 6, 12)) : 1;

  return (
    <Stage>
      {/* ---------------- Phase A ---------------- */}
      {phaseOut < 0.99 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: 1 - phaseOut, transform: `translateY(${phaseOut * 14}px)` }}>
          <div style={{ position: 'absolute', left: BOARD_X, top: BOARD_Y, ...boardIn }}>
            <BoardTable scale={BOARD_SCALE}>
              {/* the acta: rose lines written while the card types */}
              <div style={{ position: 'absolute', left: 330, top: 168, opacity: actaIn * (1 - 0.55 * actaDim), transform: `rotate(-2deg) translateY(${(1 - actaIn) * 18}px)` }}>
                <Sheet width={220} height={184} tone={C.rose} glow={0.4 * actaIn * (1 - actaDim)}>
                  <div style={{ position: 'absolute', left: 20, top: 16 }}>
                    <PaperGap size={44} color={C.roseSoft} glow={actaIn} />
                  </div>
                  <div style={{ position: 'absolute', left: 20, right: 20, top: 74 }}>
                    <Bars widths={[100, 82, 100, 56].map((w, i) => w * progress(frame, winFrom + 14 + i * 16, 18))} gap={14} h={9} color={C.roseSoft} o={0.55} />
                  </div>
                </Sheet>
              </div>
            </BoardTable>
          </div>

          {frame >= bubbleAt - 2 ? (
            <div style={{ position: 'absolute', left: COL_X, top: BUBBLE_TOP, opacity: Math.min(1, bubble * 1.4), transform: `translateY(${(1 - Math.min(1, bubble)) * 14}px)` }}>
              <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', height: 104, padding: '0 44px', boxSizing: 'border-box', borderRadius: 30, border: `3px solid ${alpha(C.sky, 0.8)}`, background: alpha(C.sky, 0.1), fontFamily: FONT.sans, fontSize: 56, fontWeight: 850, color: C.textStrong, whiteSpace: 'nowrap' }}>
                ¿y si alguien intenta <span style={{ color: C.roseSoft, marginLeft: 14 }}>entrar</span>?
                <svg width={46} height={36} viewBox="0 0 46 36" style={{ position: 'absolute', left: -14, bottom: -4 }} fill="none" aria-hidden>
                  <path d="M44 4 L6 32 L4 2 Z" fill={C.ink900} stroke={alpha(C.sky, 0.8)} strokeWidth={3} strokeLinejoin="round" />
                  <path d="M42 0 L8 26" stroke={C.ink900} strokeWidth={8} />
                </svg>
              </div>
            </div>
          ) : null}

          {frame >= chipAt - 2 ? (
            <div style={{ position: 'absolute', left: COL_X, top: CHIP_TOP, ...chipIn }}>
              <Pill text="auditoría independiente · encargada" icon="shield" tone={C.cyan} size={34} height={58} on={0.4} />
            </div>
          ) : null}

          {frame >= advAt - 6 ? (
            <div style={{ position: 'absolute', left: COL_X, top: TAG_TOP, opacity: Math.min(1, tagIn * 1.4), transform: `translateY(${(1 - Math.min(1, tagIn)) * 18}px)` }}>
              <AdversaryTag glow={glow} />
            </div>
          ) : null}
        </div>
      ) : null}

      {/* ---------------- Phase B ---------------- */}
      {leftIn > 0.01 ? (
        <div style={{ position: 'absolute', left: 0, top: 0 }}>
          <Column icon="chart" tone={C.cyan} term="AUDITORÍA" question="¿cumplimos el estándar?" how="evidencias y muestreo" show={leftIn} focus={focusLeft} />
        </div>
      ) : null}
      {rightIn > 0.01 ? (
        <div style={{ position: 'absolute', left: COL_W + COLS_GAP, top: 0 }}>
          <Column icon="target" tone={C.rose} term="PENETRATION TEST" question="¿pueden romperlo?" how="intentándolo, con permiso" show={rightIn} />
        </div>
      ) : null}

      {/* the bridge: certificate on the audit's side, load test on the pentest's */}
      {imageIn > 0.01 ? (
        <div style={{ position: 'absolute', left: 0, top: IMAGE_TOP, width: W, height: STAGE.height - IMAGE_TOP, opacity: imageIn }}>
          <div style={{ position: 'absolute', left: 0, top: 0 }}>
            <ImageTag />
          </div>
          <div style={{ position: 'absolute', left: 270, top: 28 }}>
            <BridgeArt width={860} load={load} />
          </div>
          <div style={{ position: 'absolute', left: 30, top: 72, opacity: cert, transform: `translateY(${(1 - cert) * 14}px)` }}>
            <CertificateArt width={118} lit={cert} />
            <div style={{ position: 'absolute', left: 140, top: 14, fontFamily: FONT.sans, fontSize: 28, fontWeight: 750, color: C.cyanSoft, lineHeight: 1.2, whiteSpace: 'nowrap' }}>
              <div>cumple</div>
              <div>la norma</div>
            </div>
          </div>
          <div style={{ position: 'absolute', left: 1230, top: 56, fontFamily: FONT.sans, whiteSpace: 'nowrap', opacity: progress(frame, loadAt, 14), transform: `translateY(${(1 - progress(frame, loadAt, 14)) * 14}px)` }}>
            <div style={{ fontSize: 36, fontWeight: 850, color: C.roseSoft }}>la prueba de carga</div>
            <div style={{ marginTop: 6, fontSize: 30, fontWeight: 650, color: C.text }}>camiones llenos encima</div>
            <div style={{ marginTop: 6, fontSize: 30, fontWeight: 750, color: C.rose }}>aguanta</div>
          </div>
        </div>
      ) : null}

      {/* ni una dice nada de la otra */}
      {neither > 0.01 ? (
        <div style={{ position: 'absolute', left: 0, top: BANNER_TOP, width: W, display: 'flex', justifyContent: 'center', opacity: neither, transform: `translateY(${(1 - neither) * 12}px)` }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 22, height: 58, padding: '0 36px 0 24px', boxSizing: 'border-box', borderRadius: RADIUS.pill, border: `3px solid ${alpha(C.amber, 0.85)}`, background: C.ink900, boxShadow: `0 0 28px ${alpha(C.amber, 0.22)}`, fontFamily: FONT.sans, fontSize: 36, fontWeight: 850, color: C.textStrong, whiteSpace: 'nowrap' }}>
            <div style={{ position: 'relative', width: 44, height: 44 }}>
              <Icon name="link" size={44} color={C.amber} strokeWidth={2.2} />
              <div style={{ position: 'absolute', left: -4, right: -4, top: '50%', height: 5, borderRadius: 3, background: C.rose, transform: 'rotate(-42deg)' }} />
            </div>
            aprobar una no dice nada de la otra
          </div>
        </div>
      ) : null}
    </Stage>
  );
}

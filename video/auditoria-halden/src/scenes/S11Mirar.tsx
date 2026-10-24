import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { enter, progress, pulse } from '../../../engine/src/theme/motion';
import { Icon, dimStyle, type IconName } from '../../../engine/src/ui';
import { PLAN_STAMP } from '../data/shared';
import { CaseStamp, Pill } from './parts/Labels';
import { SocLog } from './parts/Log';
import { Stage, wordFrame } from './kit';

const S = 's11-mirar';
const COL_W = 840;
const COL_X = [0, STAGE.width - COL_W] as const;
const HEAD_TOP = 76;
const CARD_TOP = 150;
const CARD_H = 262;
const LOG_TOP = 436;
const LOG_H = 212;

const SOURCES: readonly { text: string; word: string; seg: string }[] = [
  { text: 'registros públicos', word: 'público', seg: 's11-01' },
  { text: 'certificados publicados', word: 'certificados', seg: 's11-02' },
  { text: 'ofertas de empleo', word: 'ofertas', seg: 's11-02' },
  { text: 'buscadores de aparatos expuestos', word: 'buscadores', seg: 's11-02' },
];
const ACTIONS: readonly { text: string; icon: IconName; word: string }[] = [
  { text: 'escanear', icon: 'radar', word: 'escanear' },
  { text: 'preguntar versiones', icon: 'terminal', word: 'versiones' },
];

/** The target (the port's side): a box with its server and a status line under it. */
function Target({ touched, label, status, tone }: { touched: number; label: string; status: string | null; tone: string }) {
  return (
    <div style={{ width: 200, display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: FONT.sans, whiteSpace: 'nowrap' }}>
      <div style={{ position: 'relative', width: 116, height: 86, borderRadius: 18, display: 'grid', placeItems: 'center', border: `3px solid ${alpha(touched > 0.5 ? C.rose : C.muted, 0.8)}`, background: alpha(touched > 0.5 ? C.rose : C.ink800, 0.14), boxShadow: touched > 0.05 ? `0 0 ${Math.round(26 * touched)}px ${alpha(C.rose, 0.4 * touched)}` : undefined }}>
        <Icon name="server" size={54} color={touched > 0.5 ? C.roseSoft : C.text} strokeWidth={2} />
      </div>
      <div style={{ marginTop: 6, fontSize: 30, fontWeight: 750, color: C.text }}>{label}</div>
      <div style={{ marginTop: 2, height: 38, fontSize: 32, fontWeight: 850, color: tone, opacity: status ? 1 : 0 }}>{status ?? '.'}</div>
    </div>
  );
}

/**
 * s11-mirar «Mirar sin tocar». Two weeks of the port's plan in two columns (nothing is run; the plan stamp «propuesta ·
 * sin fecha» is top-left). Left, from `before`: «antes de la ventana» — four public sources light one by one on the
 * voice's words (registros públicos, certificados publicados, ofertas de empleo, buscadores de aparatos expuestos); on
 * `passive` the term «Passive reconnaissance» and the tag «WHOIS» (no voice) land, the dashed line to the target stays
 * cut, and on `empty-log` the SOC's log, below, shows it is empty. Right, from `window`: «ventana pactada · se reconoce»
 * — «escanear» and «preguntar versiones» on their words, then on `active` the term «Active reconnaissance» with
 * «banner grabbing»; the arrow reaches the target and on `log-lines` the SOC's log fills with lines (it shows; that is
 * why it is agreed). On `rule` the targets are labelled: «sin tocar» (emerald) and «tocado» (rose).
 */
export function S11Mirar(props: SceneProps) {
  const frame = useCurrentFrame();
  const beforeAt = props.cue('before');
  const passiveAt = props.cue('passive');
  const emptyAt = props.cue('empty-log');
  const windowAt = props.cue('window');
  const activeAt = props.cue('active');
  const linesAt = props.cue('log-lines');
  const ruleAt = props.cue('rule');
  const seAt = wordFrame(S, 's11-03', 'Se') - 6;

  const stampIn = enter(frame, -6, { distance: 14, duration: 16 });
  const headL = enter(frame, beforeAt - 2, { distance: 14 });
  const headR = enter(frame, windowAt - 8, { distance: 14 });
  const cardL = progress(frame, beforeAt - 4, 16);
  const cardR = progress(frame, windowAt - 4, 16);
  const srcAt = SOURCES.map((s, i) => (i === 0 ? beforeAt + 4 : wordFrame(S, s.seg, s.word) - 8));
  const actAt = ACTIONS.map((a) => wordFrame(S, 's11-03', a.word) - 8);
  const termL = progress(frame, passiveAt - 4, 14);
  const termR = progress(frame, activeAt - 4, 14);
  const whois = progress(frame, passiveAt + 26, 12);
  const banner = progress(frame, activeAt + 26, 12);
  const emptyHi = progress(frame, emptyAt - 2, 12) * (0.6 + 0.4 * pulse(frame, 30, 0.7)) * (1 - progress(frame, windowAt - 10, 12));
  const touch = progress(frame, activeAt, 16);
  const shown = 6 * progress(frame, linesAt, 90) ;
  const rule = progress(frame, ruleAt - 4, 14);
  const logGlow = progress(frame, linesAt - 4, 12);
  const seIn = progress(frame, seAt, 12);
  // while the voice is on the left column the right one waits; from the window on the left steps back a little.
  const leftDim = 0.5 * progress(frame, windowAt - 6, 16) * (1 - rule);

  return (
    <Stage>
      <div style={{ position: 'absolute', left: 0, top: 0, ...stampIn }}>
        <CaseStamp what={PLAN_STAMP.what} kind={PLAN_STAMP.kind} />
      </div>

      {/* column headers */}
      <div style={{ position: 'absolute', left: COL_X[0], top: HEAD_TOP, ...headL, ...dimStyle(leftDim) }}>
        <Pill text="antes de la ventana" icon="clock" tone={C.sky} size={34} height={58} on={0.5} />
      </div>
      <div style={{ position: 'absolute', left: COL_X[1], top: HEAD_TOP, ...headR }}>
        <Pill text="ventana pactada · se reconoce" icon="clock" tone={C.amber} size={34} height={58} on={0.7} />
      </div>

      {/* ghost cards that wait on the right */}
      <div style={{ position: 'absolute', left: COL_X[1], top: CARD_TOP, width: COL_W, height: CARD_H, boxSizing: 'border-box', borderRadius: RADIUS.lg, border: `3px dashed ${alpha(C.muted, 0.4)}`, opacity: 1 - cardR }} />
      <div style={{ position: 'absolute', left: COL_X[1], top: LOG_TOP, width: COL_W, height: LOG_H, boxSizing: 'border-box', borderRadius: RADIUS.md, border: `3px dashed ${alpha(C.muted, 0.3)}`, opacity: 1 - cardR }} />

      {/* ---- Left column: passive */}
      <div style={{ position: 'absolute', left: COL_X[0], top: CARD_TOP, width: COL_W, height: CARD_H, opacity: cardL, ...dimStyle(leftDim) }}>
        <div style={{ position: 'absolute', inset: 0, boxSizing: 'border-box', borderRadius: RADIUS.lg, border: `3px solid ${alpha(C.cyan, 0.4 + 0.4 * termL)}`, background: alpha(C.cyan, 0.05), fontFamily: FONT.sans }}>
          <div style={{ position: 'absolute', left: 26, top: 14, height: 54, display: 'flex', alignItems: 'center', gap: 16, whiteSpace: 'nowrap', opacity: 0.2 + 0.8 * termL }}>
            <span style={{ fontSize: 42, fontWeight: 900, color: C.cyanSoft }}>Passive reconnaissance</span>
          </div>
          <div style={{ position: 'absolute', right: 22, top: 16, opacity: whois }}>
            <div style={{ height: 42, padding: '0 16px', display: 'flex', alignItems: 'center', borderRadius: RADIUS.sm, border: `2px solid ${alpha(C.cyan, 0.7)}`, background: C.ink900, fontFamily: FONT.mono, fontSize: 28, fontWeight: 700, color: C.cyanSoft }}>WHOIS</div>
          </div>
          <div style={{ position: 'absolute', left: 26, top: 84 }}>
            {SOURCES.map((s, i) => {
              const on = progress(frame, srcAt[i], 12);
              return (
                <div key={s.text} style={{ height: 40, display: 'flex', alignItems: 'center', gap: 14, fontSize: 30, fontWeight: 700, color: C.text, whiteSpace: 'nowrap', opacity: on, transform: `translateX(${(1 - on) * -14}px)` }}>
                  <Icon name="globe" size={28} color={C.cyan} />
                  {s.text}
                </div>
              );
            })}
          </div>
          {/* the line to the target stays cut: it never touches it */}
          <svg width={120} height={40} viewBox="0 0 120 40" style={{ position: 'absolute', left: 520, top: 124, opacity: cardL }} fill="none" aria-hidden>
            <path d="M4 20 H52" stroke={alpha(C.muted, 0.85)} strokeWidth={5} strokeDasharray="9 8" strokeLinecap="round" />
            <path d="M70 8 L90 32 M90 8 L70 32" stroke={alpha(C.emerald, 0.9)} strokeWidth={6} strokeLinecap="round" opacity={termL} />
          </svg>
          <div style={{ position: 'absolute', left: 620, top: 58 }}>
            <Target touched={0} label="objetivo" status={rule > 0.5 ? 'sin tocar' : null} tone={C.emerald} />
          </div>
        </div>
      </div>

      {/* ---- Right column: active */}
      {cardR > 0.01 ? (
        <div style={{ position: 'absolute', left: COL_X[1], top: CARD_TOP, width: COL_W, height: CARD_H, opacity: cardR }}>
          <div style={{ position: 'absolute', inset: 0, boxSizing: 'border-box', borderRadius: RADIUS.lg, border: `3px solid ${alpha(C.amber, 0.45 + 0.4 * termR)}`, background: alpha(C.amber, 0.05), fontFamily: FONT.sans }}>
            <div style={{ position: 'absolute', left: 26, top: 14, height: 54, display: 'flex', alignItems: 'center', whiteSpace: 'nowrap', opacity: 0.2 + 0.8 * termR }}>
              <span style={{ fontSize: 42, fontWeight: 900, color: C.amber }}>Active reconnaissance</span>
            </div>
            <div style={{ position: 'absolute', right: 22, top: 16, opacity: banner }}>
              <div style={{ height: 42, padding: '0 16px', display: 'flex', alignItems: 'center', borderRadius: RADIUS.sm, border: `2px solid ${alpha(C.amber, 0.7)}`, background: C.ink900, fontFamily: FONT.mono, fontSize: 28, fontWeight: 700, color: C.amber }}>banner grabbing</div>
            </div>
            <div style={{ position: 'absolute', left: 26, top: 96 }}>
              {ACTIONS.map((a, i) => {
                const on = progress(frame, actAt[i], 12);
                return (
                  <div key={a.text} style={{ height: 62, display: 'flex', alignItems: 'center', gap: 16, fontSize: 36, fontWeight: 800, color: C.textStrong, whiteSpace: 'nowrap', opacity: on, transform: `translateX(${(1 - on) * -14}px)` }}>
                    <Icon name={a.icon} size={38} color={C.amber} strokeWidth={2.2} />
                    {a.text}
                  </div>
                );
              })}
            </div>
            {/* the arrow reaches the target */}
            <svg width={140} height={40} viewBox="0 0 140 40" style={{ position: 'absolute', left: 460, top: 136 }} fill="none" aria-hidden>
              <path d={`M4 20 H${12 + 112 * touch}`} stroke={C.rose} strokeWidth={5} strokeLinecap="round" />
              <path d="M104 8 L126 20 L104 32" stroke={C.rose} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" opacity={touch > 0.9 ? 1 : 0} />
            </svg>
            <div style={{ position: 'absolute', left: 620, top: 58 }}>
              <Target touched={touch} label="objetivo" status={rule > 0.5 ? 'tocado' : null} tone={C.roseSoft} />
            </div>
          </div>
        </div>
      ) : null}

      {/* ---- The SOC's log under each column */}
      <div style={{ position: 'absolute', left: COL_X[0], top: LOG_TOP, ...dimStyle(leftDim) }}>
        <SocLog width={COL_W} height={LOG_H} shown={0} rows={5} titleSize={30} />
        <div style={{ position: 'absolute', left: 0, right: 0, top: 70, bottom: 0, display: 'grid', placeItems: 'center', fontFamily: FONT.sans, fontSize: 40, fontWeight: 850, color: alpha(C.sky, 0.35 + 0.65 * emptyHi) }}>vacío</div>
      </div>
      {cardR > 0.01 ? (
        <div style={{ position: 'absolute', left: COL_X[1], top: LOG_TOP, opacity: cardR }}>
          <SocLog width={COL_W} height={LOG_H} shown={shown} rows={5} titleSize={30} tone={C.amber} />
          <div style={{ position: 'absolute', right: 20, top: 8, fontFamily: FONT.sans, fontSize: 30, fontWeight: 850, color: C.amber, opacity: seIn * (0.5 + 0.5 * logGlow) }}>se ve</div>
        </div>
      ) : null}
    </Stage>
  );
}

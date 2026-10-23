import type { ReactNode } from 'react';
import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress, pulse } from '../../../engine/src/theme/motion';
import { Icon, dimStyle, mix } from '../../../engine/src/ui';
import { LessEq, PageIcon, StormIcon } from './parts/Icons';
import { EnvelopeRain } from './parts/Rain';
import { Stage, wordFrame } from './kit';

const S = 's03-reloj';
const W = STAGE.width;
const SKY = C.sky;

// The timeline starts mid-stage and drops to the bottom when the two documents come up.
const AXIS = { x0: 70, x1: W - 70, yMid: 340, yLow: 580 } as const;
// The two cards (flash left, report right), clear of the think prompt's band.
const CARD = { w: 840, h: 322, top: 192, gap: 48 } as const;
const FLASH_X = (W - 2 * CARD.w - CARD.gap) / 2;
const REPORT_X = FLASH_X + CARD.w + CARD.gap;

/**
 * s03-reloj «El reloj corre». A timeline starts at «06:00 UTC» and envelopes keep falling on it.
 *   wave          (sound: mail) the clock marker starts to move along the axis and the elapsed
 *                 stretch warms from cyan to amber; a grey bar, «informe perfecto», grows more
 *                 slowly beneath it, and on «tarde» the marker gets its «tarde» tag. No other hour.
 *   (question)    the axis drops to the bottom and the two documents rise side by side, neither lit:
 *                 «Flash alert · 1 página» and «Informe de campaña · 3–10 págs». The think prompt
 *                 owns the top band; the cards start under it.
 *   flash-first   the flash lights: «qué pasa · qué hacer · cuándo habrá más», and the rule tagged
 *                 «SLA típico»: «≤ 2–4 h desde confirmación» (the confirmation is not on the clock).
 *   report        the report lights: «3–5 días tras consolidar el cluster», «TTPs + IOCs anexos».
 *   forecast      each card turns into a storm: the flash is the «aviso de tormenta» (bloqueo y
 *                 contención inmediatos), the report the «estudio de la tormenta» (hunting,
 *                 ingeniería de detección, priorización), with the lesson's SLA rows.
 */
export function S03Reloj(props: SceneProps) {
  const frame = useCurrentFrame();

  const wave = props.cue('wave');
  const flashFirst = props.cue('flash-first');
  const report = props.cue('report');
  const forecast = props.cue('forecast');
  const w = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);

  // ---- The clock moves along the axis for the whole scene.
  const clockEnd = forecast + 40;
  const run = Math.min(1, Math.max(0, (frame - wave) / (clockEnd - wave)));
  const lateAt = w('s03-02', 'tarde') - 4;
  const late = progress(frame, lateAt, 20);
  const docsAt = w('s03-03', 'página') - 18;
  const drop = progress(frame, docsAt, 26, EASE.inOut);
  const axisY = mix(AXIS.yMid, AXIS.yLow, drop);
  const span = AXIS.x1 - AXIS.x0 - 200;
  const nowX = AXIS.x0 + span * run;
  const barW = 330 + span * run * 0.36;

  // ---- Rain.
  const rainOpacity = mix(0.9, 0.22, drop);

  // ---- The documents.
  const flashAt = w('s03-03', 'página') - 8;
  const reportAt = w('s03-03', 'informe') - 8;
  const answered = frame >= flashFirst - 6;
  const fLit = progress(frame, flashFirst - 4, 14) * (1 - progress(frame, report - 6, 14));
  const rLit = progress(frame, report - 4, 14) * (1 - progress(frame, forecast - 6, 14));
  const stormP = progress(frame, forecast - 4, 20);
  // Cards are lit only after the answer; before it both are plain (no hint).
  const fDim = answered ? progress(frame, report - 4, 14, EASE.inOut) * (1 - stormP) : 0;
  const rDim = answered ? (1 - progress(frame, report - 4, 14, EASE.inOut)) * (1 - stormP) : 0;

  const wPasa = w('s03-04', 'pasa') - 6;
  const wHacer = w('s03-04', 'hacer') - 6;
  const wMas = w('s03-04', 'más') - 6;
  const wNormal = w('s03-04', 'normal') - 8;
  const wDias = w('s03-05', 'días') - 8;
  const wDetalle = w('s03-05', 'detalle') - 8;
  const wAviso = w('s03-06', 'aviso', 0) - 8;
  const wEstudio = w('s03-06', 'estudio', 0) - 8;
  const wAviso2 = w('s03-06', 'aviso', 1) - 8;
  const wEstudio2 = w('s03-06', 'estudio', 1) - 8;

  return (
    <Stage style={{ fontFamily: FONT.sans }}>
      <EnvelopeRain frame={frame} from={wave - 2} count={28} opacity={rainOpacity} seed={3} />

      {/* The timeline: axis, elapsed stretch, clock marker, the perfect report growing slowly */}
      <svg width={W} height={660} viewBox={`0 0 ${W} 660`} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
        <defs>
          <linearGradient id="elapsed" x1={AXIS.x0} x2={AXIS.x1} y1={0} y2={0} gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor={C.cyan} />
            <stop offset="0.45" stopColor={C.amber} />
            <stop offset="1" stopColor={C.amber} />
          </linearGradient>
        </defs>
        <line x1={AXIS.x0} y1={axisY} x2={AXIS.x1} y2={axisY} stroke={C.ink600} strokeWidth={6} strokeLinecap="round" />
        <line x1={AXIS.x0} y1={axisY} x2={nowX} y2={axisY} stroke="url(#elapsed)" strokeWidth={8} strokeLinecap="round" />
        <circle cx={AXIS.x0} cy={axisY} r={13} fill={C.ink950} stroke={C.cyan} strokeWidth={5} />
      </svg>
      <div style={{ position: 'absolute', left: AXIS.x0 - 12, top: axisY - 62, fontSize: 40, fontWeight: 850, color: C.textStrong, whiteSpace: 'nowrap', textShadow: `0 0 14px ${alpha(C.ink950, 1)}` }}>
        06:00 <span style={{ color: C.cyanSoft, fontSize: 32, fontWeight: 800 }}>UTC</span>
      </div>
      {/* the clock marker */}
      <div style={{ position: 'absolute', left: nowX - 30, top: axisY - 30, width: 60, height: 60, borderRadius: 30, display: 'grid', placeItems: 'center', background: C.ink950, border: `4px solid ${late > 0.5 ? C.amber : C.cyan}`, boxShadow: `0 0 ${Math.round(14 + 12 * pulse(frame, 30, 0.6))}px ${alpha(late > 0.5 ? C.amber : C.cyan, 0.5)}`, opacity: progress(frame, wave, 10) }}>
        <Icon name="clock" size={36} color={late > 0.5 ? C.amber : C.cyan} />
      </div>
      {late > 0 ? (
        <div style={{ position: 'absolute', left: nowX + 42, top: axisY - mix(26, 22, drop), opacity: late, transform: `translateX(${(1 - late) * -10}px)` }}>
          <div style={{ padding: '3px 22px 5px', borderRadius: RADIUS.pill, border: `2px solid ${C.amber}`, background: alpha(C.ink950, 0.9), color: C.amber, fontSize: mix(40, 34, drop), fontWeight: 850, letterSpacing: 1 }}>tarde</div>
        </div>
      ) : null}
      {/* the perfect report: a grey bar that grows slowly */}
      <div style={{ position: 'absolute', left: AXIS.x0, top: axisY + mix(52, 26, drop), width: barW, height: mix(64, 42, drop), borderRadius: RADIUS.md, background: `repeating-linear-gradient(135deg, ${alpha(C.muted, 0.28)} 0 16px, ${alpha(C.muted, 0.16)} 16px 32px)`, border: `2px solid ${alpha(C.muted, 0.55)}`, overflow: 'hidden', opacity: progress(frame, wave + 14, 14) }}>
        <div style={{ position: 'absolute', left: 20, top: 0, bottom: 0, display: 'flex', alignItems: 'center', fontSize: mix(36, 30, drop), fontWeight: 750, color: C.text, whiteSpace: 'nowrap' }}>informe perfecto</div>
      </div>

      {/* The two documents */}
      <DocCard
        x={FLASH_X}
        frame={frame}
        at={flashAt}
        lit={fLit}
        dim={fDim}
        tone={C.cyan}
        title="Flash alert"
        sub="1 página"
        product="Flash alert · 1 página"
        icon={<PageIcon w={84} lines={5} tone={C.cyan} />}
        storm={stormP}
        stormLabel="aviso de tormenta"
        stormAt={wAviso}
        stormVariant="warning"
        stormTone={C.amber}
        chips={
          <ChipRow frame={frame} items={[
            { text: 'qué pasa', at: wPasa },
            { text: 'qué hacer', at: wHacer },
            { text: 'cuándo habrá más', at: wMas },
          ]} tone={C.cyan} />
        }
        rule={
          <Rule frame={frame} at={wNormal} label="SLA típico" tone={C.cyan}>
            <LessEq size={40} color={C.cyanSoft} /> 2–4 h desde confirmación
          </Rule>
        }
        stormBody={<StormLine frame={frame} at={wAviso2} tone={C.amber}>bloqueo y contención inmediatos</StormLine>}
      />
      <DocCard
        x={REPORT_X}
        frame={frame}
        at={reportAt}
        lit={rLit}
        dim={rDim}
        tone={SKY}
        title="Informe de campaña"
        sub="3–10 págs"
        product="Informe de campaña · 3–10 págs"
        icon={<PageIcon w={84} lines={7} tone={SKY} stack={2} />}
        storm={stormP}
        stormLabel="estudio de la tormenta"
        stormAt={wEstudio}
        stormVariant="study"
        stormTone={SKY}
        chips={<ChipRow frame={frame} items={[{ text: 'TTPs + IOCs anexos', at: wDetalle }]} tone={SKY} />}
        rule={<Rule frame={frame} at={wDias} label="SLA típico" tone={SKY}>3–5 días tras consolidar el cluster</Rule>}
        stormBody={<StormLine frame={frame} at={wEstudio2} tone={SKY}>hunting, ingeniería de detección, priorización</StormLine>}
      />
    </Stage>
  );
}

/** One product card: a page icon and its name, a body that fills as the voice explains it; at the end it becomes a storm. */
function DocCard({
  x,
  frame,
  at,
  lit,
  dim,
  tone,
  title,
  sub,
  product,
  icon,
  chips,
  rule,
  storm,
  stormLabel,
  stormAt,
  stormVariant,
  stormTone,
  stormBody,
}: {
  x: number;
  frame: number;
  at: number;
  lit: number;
  dim: number;
  tone: string;
  title: string;
  sub: string;
  product: string;
  icon: ReactNode;
  chips: ReactNode;
  rule: ReactNode;
  storm: number;
  stormLabel: string;
  stormAt: number;
  stormVariant: 'warning' | 'study';
  stormTone: string;
  stormBody: ReactNode;
}) {
  const e = enter(frame, at, { distance: 40, duration: 22 });
  const tIn = progress(frame, stormAt, 16);
  const swap = storm * tIn;
  return (
    <div style={{ position: 'absolute', left: x, top: CARD.top, width: CARD.w, height: CARD.h, boxSizing: 'border-box', borderRadius: RADIUS.lg, border: `3px solid ${alpha(tone, 0.4 + 0.5 * lit)}`, background: `linear-gradient(180deg, ${alpha(tone, 0.06 + 0.12 * lit)} 0%, ${alpha(C.ink900, 0.97)} 70%)`, boxShadow: lit > 0.05 ? `0 0 ${Math.round(40 * lit)}px ${alpha(tone, 0.28 * lit)}` : `0 20px 50px ${alpha('#000000', 0.35)}`, padding: '20px 32px', ...e, ...dimStyle(dim, e.opacity) }}>
      {/* header: icon (a page, then a storm) and the name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 28, height: 112 }}>
        <div style={{ position: 'relative', width: 150, height: 112, flexShrink: 0 }}>
          <div style={{ position: 'absolute', left: 30, top: 0, opacity: 1 - swap }}>{icon}</div>
          <div style={{ position: 'absolute', left: 6, top: 6, opacity: swap }}>
            <StormIcon size={130} variant={stormVariant} tone={stormTone} glow={0.5 * swap} rain={stormVariant === 'warning' ? frame : 0} />
          </div>
        </div>
        <div style={{ position: 'relative', flex: 1, minWidth: 0, height: 112 }}>
          <div style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', opacity: 1 - swap }}>
            <div style={{ fontSize: 46, fontWeight: 850, color: C.textStrong, lineHeight: 1.08, whiteSpace: 'nowrap' }}>{title}</div>
            <div style={{ fontSize: 40, fontWeight: 750, color: tone === C.cyan ? C.cyanSoft : '#7dd3fc', whiteSpace: 'nowrap', lineHeight: 1.1 }}>{sub}</div>
          </div>
          <div style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', opacity: swap }}>
            <div style={{ fontSize: 46, fontWeight: 850, color: stormTone, lineHeight: 1.08, whiteSpace: 'nowrap' }}>{stormLabel}</div>
            <div style={{ fontSize: 32, fontWeight: 700, color: C.muted, whiteSpace: 'nowrap', lineHeight: 1.2 }}>{product}</div>
          </div>
        </div>
      </div>
      <div style={{ position: 'relative', marginTop: 12, height: 84 }}>
        <div style={{ position: 'absolute', left: 0, top: 0, opacity: 1 - swap }}>{chips}</div>
        <div style={{ position: 'absolute', left: 0, top: 4, opacity: swap }}>{stormBody}</div>
      </div>
      <div style={{ marginTop: 6 }}>{rule}</div>
    </div>
  );
}

/** A small row of chips that appear one by one. */
function ChipRow({ frame, items, tone }: { frame: number; items: { text: string; at: number }[]; tone: string }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
      {items.map((it) => {
        const e = enter(frame, it.at, { distance: 12, duration: 14 });
        return (
          <span key={it.text} style={{ padding: '5px 20px 7px', borderRadius: RADIUS.pill, border: `2px solid ${alpha(tone, 0.75)}`, background: alpha(tone, 0.13), fontSize: 32, fontWeight: 750, color: C.textStrong, whiteSpace: 'nowrap', ...e }}>
            {it.text}
          </span>
        );
      })}
    </div>
  );
}

/** A rule: small caps label over the value. */
function Rule({ frame, at, label, tone, children }: { frame: number; at: number; label: string; tone: string; children: ReactNode }) {
  const e = enter(frame, at, { distance: 12, duration: 14 });
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0, ...e }}>
      <span style={{ fontSize: 26, fontWeight: 850, letterSpacing: 2, color: tone, textTransform: 'uppercase', whiteSpace: 'nowrap', lineHeight: 1.2 }}>{label}</span>
      <span style={{ fontSize: 38, fontWeight: 800, color: C.textStrong, lineHeight: 1.12, whiteSpace: 'nowrap' }}>{children}</span>
    </div>
  );
}

/** What the storm card is for (the lesson's «Decisión que habilita»). */
function StormLine({ frame, at, tone, children }: { frame: number; at: number; tone: string; children: ReactNode }) {
  const e = enter(frame, at, { distance: 12, duration: 14 });
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, ...e }}>
      <Icon name="bolt" size={34} color={tone} />
      <span style={{ fontSize: 34, fontWeight: 800, color: C.textStrong, lineHeight: 1.12 }}>{children}</span>
    </div>
  );
}


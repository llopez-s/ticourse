import type { ReactNode } from 'react';
import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress, springIn } from '../../../engine/src/theme/motion';
import { Icon } from '../../../engine/src/ui';
import { Stage, wordFrame } from './kit';

const S = 's07-bluf-flash';
const W = STAGE.width;

/** The weak BLUF (the lesson's wrong option, s5m1q9) and the flash's own (s5m1, flash alert). */
const WEAK = 'Suspicious activity has been observed in the environment.';
const FLASH = {
  lead: 'We assess',
  head: ' with ',
  conf: 'moderate confidence',
  mid: ' that GLASS VIPER is running ',
  judg: 'an active credential-phishing wave against Meridian supplier portals',
  dot: '. ',
  act: 'Block the indicators in annex A and force MFA re-enrollment for supplier accounts TODAY.',
} as const;

const TONE = { judg: C.cyan, conf: C.amber, act: C.emerald } as const;
const CARD = { top: 64, h: 372, leftX: 0, leftW: 540, rightX: 580, rightW: W - 580 } as const;

/**
 * s07-bluf-flash «Dos BLUF frente a frente».
 *   compare   two cards side by side: the lesson's weak BLUF on the left, the flash's own on the
 *             right (literal, with the group's name; the voice never says it).
 *   weak      (sound: error) the left one is marked «cierto, pero no dice qué hacer».
 *   parts     the right one splits into three colours — juicio (cyan), confianza (amber), acción
 *             con plazo (green) — and a legend chip per part comes in on its word.
 *   rule      «BLUF de un flash»: the three chips are the rule (not the rule of every BLUF); then
 *             one of them goes missing and a «?» takes its place: «el lector adivina».
 *   owner     «We assess» is underlined with the gloss «valoramos» and, below, «los hechos se
 *             citan · los juicios se asumen».
 */
export function S07BlufFlash(props: SceneProps) {
  const frame = useCurrentFrame();
  const compare = props.cue('compare');
  const weak = props.cue('weak');
  const parts = props.cue('parts');
  const rule = props.cue('rule');
  const owner = props.cue('owner');
  const w = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);

  // ---- Cards.
  const leftAt = compare;
  const rightAt = Math.max(compare + 14, w('s07-01', 'flash') - 8);
  const weakP = progress(frame, weak - 2, 16);
  const weakStamp = frame < weak ? 0 : springIn(frame, 30, weak, { damping: 12 });

  // ---- Parts: one colour per piece, on its word.
  const pAt = {
    judg: Math.max(parts - 4, w('s07-03', 'juicio') - 8),
    conf: w('s07-03', 'confianza') - 8,
    act: w('s07-03', 'acción') - 8,
  };
  // The colours step back when the voice moves on to «We assess».
  const partsOut = 1 - 0.8 * progress(frame, owner - 4, 16, EASE.inOut);
  const pw = { judg: progress(frame, pAt.judg, 14) * partsOut, conf: progress(frame, pAt.conf, 14) * partsOut, act: progress(frame, pAt.act, 14) * partsOut };

  // ---- Rule: the chips are the rule; one goes missing.
  const ruleLabel = progress(frame, rule - 4, 14);
  const missAt = w('s07-04', 'falta') - 6;
  const miss = progress(frame, missAt, 16, EASE.inOut);
  const guessAt = w('s07-04', 'adivinarla') - 18;
  const guess = progress(frame, guessAt, 14) * (1 - progress(frame, owner - 8, 12, EASE.inOut));

  // ---- Owner.
  const assessAt = w('s07-05', 'assess') - 8;
  const under = progress(frame, assessAt, 16, EASE.inOut);
  const gloss = progress(frame, w('s07-05', 'valoramos') - 8, 14);
  const noteAt = w('s07-05', 'alguien') - 8;

  return (
    <Stage style={{ fontFamily: FONT.sans }}>
      {/* The weak BLUF */}
      <Card x={CARD.leftX} w={CARD.leftW} tone={C.muted} tag="BLUF flojo" frame={frame} at={leftAt} dim={0.28 * weakP}>
        <div style={{ fontSize: 44, fontWeight: 650, lineHeight: 1.3, color: C.text }}>{WEAK}</div>
      </Card>
      {weakStamp > 0 ? (
        <div style={{ position: 'absolute', left: CARD.leftX, top: CARD.top + CARD.h + 22, width: CARD.leftW, opacity: Math.min(1, weakStamp * 1.4), transform: `translateY(${(1 - Math.min(1, weakStamp)) * 14}px)` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '10px 22px 12px 16px', borderRadius: RADIUS.lg, border: `3px solid ${C.rose}`, background: alpha(C.rose, 0.14), fontSize: 36, fontWeight: 800, lineHeight: 1.18, color: '#fda4af' }}>
            <Icon name="x" size={46} color={C.rose} strokeWidth={2.6} />
            cierto, pero no dice qué hacer
          </div>
        </div>
      ) : null}

      {/* The flash's BLUF, in three colours */}
      <Card x={CARD.rightX} w={CARD.rightW} tone={C.cyan} tag="BLUF del flash" frame={frame} at={rightAt} dim={0}>
        <div style={{ fontSize: 41, fontWeight: 600, lineHeight: 1.34, color: C.textStrong }}>
          <span style={{ position: 'relative', display: 'inline-block' }}>
            {FLASH.lead}
            <span style={{ position: 'absolute', left: 0, bottom: 0, height: 6, width: `${under * 100}%`, borderRadius: 3, background: C.cyan, boxShadow: `0 0 14px ${alpha(C.cyan, 0.6)}` }} />
          </span>
          {FLASH.head}
          <Part tone={TONE.conf} on={pw.conf}>{FLASH.conf}</Part>
          {FLASH.mid}
          <Part tone={TONE.judg} on={pw.judg}>{FLASH.judg}</Part>
          {FLASH.dot}
          <Part tone={TONE.act} on={pw.act}>{FLASH.act}</Part>
        </div>
      </Card>

      {/* «valoramos» over «We assess» */}
      {gloss > 0 ? (
        <div style={{ position: 'absolute', left: CARD.rightX + 36, top: CARD.top - 58, opacity: gloss, transform: `translateY(${(1 - gloss) * 10}px)` }}>
          <div style={{ display: 'inline-block', padding: '4px 22px 6px', borderRadius: RADIUS.pill, border: `2px solid ${C.cyan}`, background: alpha(C.ink950, 0.95), fontSize: 36, fontWeight: 800, color: C.cyanSoft }}>valoramos</div>
        </div>
      ) : null}

      {/* The three parts: legend chips that become the rule */}
      <div style={{ position: 'absolute', left: CARD.rightX, top: CARD.top + CARD.h + 26, width: CARD.rightW, }}>
        <div style={{ fontSize: 30, fontWeight: 850, letterSpacing: 3, textTransform: 'uppercase', color: C.cyanSoft, height: 40, opacity: ruleLabel, transform: `translateY(${(1 - ruleLabel) * 8}px)` }}>BLUF de un flash</div>
        <div style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
          <Chip tone={TONE.judg} text="juicio" at={pAt.judg} frame={frame} />
          <Dot />
          <Chip tone={TONE.conf} text="confianza" at={pAt.conf} frame={frame} />
          <Dot />
          <span style={{ position: 'relative', display: 'inline-block' }}>
            <Chip tone={TONE.act} text="acción con plazo" at={pAt.act} frame={frame} gone={miss} />
            {miss > 0 ? (
              <span style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', borderRadius: RADIUS.pill, border: `3px dashed ${alpha(C.amber, 0.9)}`, fontSize: 44, fontWeight: 900, color: C.amber, opacity: miss, transform: `scale(${0.85 + 0.15 * miss})` }}>?</span>
            ) : null}
          </span>
        </div>
        {guess > 0 ? (
          <div style={{ marginTop: 22, display: 'flex', alignItems: 'center', gap: 14, fontSize: 40, fontWeight: 800, color: C.amber, opacity: guess, transform: `translateY(${(1 - guess) * 10}px)` }}>
            <Icon name="alert" size={42} color={C.amber} />
            el lector adivina
          </div>
        ) : null}
      </div>

      {/* Who owns a judgment */}
      {frame >= noteAt - 4 ? (
        <div style={{ position: 'absolute', left: 0, top: 584, width: W, textAlign: 'center', fontSize: 44, fontWeight: 750, color: C.textStrong, whiteSpace: 'nowrap', ...enter(frame, noteAt, { distance: 14 }) }}>
          <span style={{ color: C.muted }}>los hechos se citan</span>
          <span style={{ color: C.faint, margin: '0 18px' }}>·</span>
          <span style={{ color: C.cyanSoft }}>los juicios se asumen</span>
        </div>
      ) : null}
    </Stage>
  );
}

/** A card with a small caps tag on top and the text inside; it enters on `at`. */
function Card({ x, w, tone, tag, frame, at, dim, children }: { x: number; w: number; tone: string; tag: string; frame: number; at: number; dim: number; children: ReactNode }) {
  const e = enter(frame, at, { distance: 30, duration: 20 });
  return (
    <div style={{ position: 'absolute', left: x, top: CARD.top, width: w, height: CARD.h, boxSizing: 'border-box', padding: '24px 34px', borderRadius: RADIUS.lg, border: `3px solid ${alpha(tone, 0.75)}`, background: `linear-gradient(180deg, ${alpha(tone, 0.1)} 0%, ${alpha(C.ink900, 0.97)} 60%)`, boxShadow: `0 20px 50px ${alpha('#000000', 0.4)}`, ...e, opacity: e.opacity * (1 - dim) }}>
      <div style={{ fontSize: 26, fontWeight: 850, letterSpacing: 3, color: tone === C.muted ? C.muted : C.cyanSoft, textTransform: 'uppercase', marginBottom: 14 }}>{tag}</div>
      {children}
    </div>
  );
}

/** A coloured piece of the BLUF: a tinted background and underline that come in with `on`. */
function Part({ tone, on, children }: { tone: string; on: number; children: ReactNode }) {
  return (
    <span style={{ color: on > 0.5 ? C.textStrong : undefined, fontWeight: on > 0.5 ? 750 : 600, background: alpha(tone, 0.24 * on), boxShadow: on > 0.02 ? `0 0 0 5px ${alpha(tone, 0.24 * on)}` : undefined, borderRadius: 6, borderBottom: `5px solid ${alpha(tone, on)}`, paddingBottom: 1 }}>{children}</span>
  );
}

/** A legend chip: enters on `at`; `gone` (0–1) takes it away. */
function Chip({ tone, text, at, frame, gone = 0 }: { tone: string; text: string; at: number; frame: number; gone?: number }) {
  const e = enter(frame, at, { distance: 14, duration: 14 });
  return (
    <span style={{ display: 'inline-block', padding: '6px 26px 8px', borderRadius: RADIUS.pill, border: `3px solid ${alpha(tone, 0.9)}`, background: alpha(tone, 0.16), fontSize: 42, fontWeight: 800, color: C.textStrong, whiteSpace: 'nowrap', ...e, opacity: e.opacity * (1 - gone), transform: `${e.transform} scale(${1 - 0.1 * gone})` }}>{text}</span>
  );
}

function Dot() {
  return <span style={{ fontSize: 40, fontWeight: 900, color: C.faint }}>·</span>;
}

import type { ReactNode } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, progress, springIn } from '../../../engine/src/theme/motion';
import { Icon } from '../../../engine/src/ui';
import { PHRASE, RULES, type RuleArt } from '../data/canon';
import { Cat, Drawer, Salon } from './parts/Images';
import { EndCard, NextAction } from './parts/s08-cierre/EndCard';
import { Stage } from './kit';

const W = STAGE.width;
const CARD_GAP = 24;
const CARD_W = (W - 2 * CARD_GAP) / 3;
const CARD_H = 452;
const ART_H = 96;
const PHRASE_TOP = 470;
const PHRASE_W = 1640;
const NEXT_TOP = 520;

/** The card's image, each in its own box so the three titles line up. */
function Art({ art, show }: { art: RuleArt; show: number }) {
  return (
    <div style={{ height: ART_H, display: 'flex', alignItems: 'center', opacity: show }}>
      {art === 'cat' ? <Cat width={118} /> : null}
      {art === 'salon' ? <Salon width={118} /> : null}
      {art === 'drawer' ? <Drawer width={78} /> : null}
    </div>
  );
}

/** One rule card: its number, its image, its title and its lines (lit as the voice says the rule). */
function RuleCard({ i, hot, dim, show, lines, title, art }: { i: number; hot: number; dim: number; show: number; lines: readonly string[]; title: string; art: RuleArt }) {
  const tone = i === 1 ? C.amber : i === 2 ? C.violet : C.cyan;
  const fg = tone;
  return (
    <div
      style={{
        position: 'absolute',
        left: i * (CARD_W + CARD_GAP),
        top: 0,
        width: CARD_W,
        height: CARD_H,
        boxSizing: 'border-box',
        padding: '18px 26px 20px',
        borderRadius: 24,
        border: `${hot > 0.3 ? 3 : 2}px solid ${alpha(fg, 0.3 + 0.6 * hot)}`,
        background: `linear-gradient(180deg, ${alpha(fg, 0.05 + 0.08 * hot)} 0%, ${alpha(C.ink900, 0.95)} 55%)`,
        boxShadow: hot > 0.02 ? `0 0 ${Math.round(40 * hot)}px ${alpha(fg, 0.28 * hot)}` : `0 20px 50px ${alpha('#000000', 0.3)}`,
        fontFamily: FONT.sans,
        opacity: show * (1 - 0.55 * dim),
        transform: `translateY(${(1 - show) * 22}px) scale(${1 - 0.03 * dim})`,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <div
          style={{
            width: 58,
            height: 58,
            borderRadius: 29,
            display: 'grid',
            placeItems: 'center',
            flexShrink: 0,
            background: hot > 0.3 ? fg : alpha(fg, 0.18),
            border: `2px solid ${alpha(fg, 0.7)}`,
            fontSize: 34,
            fontWeight: 850,
            color: hot > 0.3 ? C.ink950 : '#e2e8f0',
          }}
        >
          {i + 1}
        </div>
        <Art art={art} show={show} />
      </div>
      <div style={{ marginTop: 6, fontSize: 44, fontWeight: 850, letterSpacing: -1, color: C.textStrong, whiteSpace: 'nowrap' }}>{title}</div>
      <div style={{ marginTop: 10, fontSize: 28, fontWeight: 650, lineHeight: 1.22, color: C.text, whiteSpace: 'nowrap' }}>
        {lines.map((l, k) => (
          <div key={k}>{l}</div>
        ))}
      </div>
    </div>
  );
}

/**
 * s08-cierre «Para el examen». Three numbered cards, each with its image (the cat · the hair salon · the filing cabinet,
 * without their «imagen» tag: they were tagged where they came in) and the full rule of the storyboard under its title
 * («Antes y después», «Quién te lo impone», «Inventario y retención»), each lit on its cue (`rule-1` … `rule-3`; `recap`
 * sets them waiting). On `phrase` the cards step back and the exam phrase comes in under them, the question violet. On
 * `next` it gives way to «Tu turno: las preguntas de la lección»; on `endcard` the ALERTÓPOLIS end card takes the stage
 * and holds. No exam card here.
 */
export function S08Cierre(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const recapAt = props.cue('recap');
  const ruleAt = [props.cue('rule-1'), props.cue('rule-2'), props.cue('rule-3')];
  const phraseAt = props.cue('phrase');
  const nextAt = props.cue('next');
  const endcardAt = props.cue('endcard');
  const boardOut = progress(frame, endcardAt - 14, 14, EASE.inOut);

  const phraseIn = progress(frame, phraseAt - 2, 16);
  const phraseOut = progress(frame, nextAt - 16, 12, EASE.inOut);
  const allDim = progress(frame, phraseAt - 4, 14);

  const cards: ReactNode[] = RULES.map((r, i) => {
    const lit = Math.min(1, springIn(frame, fps, ruleAt[i] - 4, { damping: 16 }) * 1.3);
    const next = ruleAt[i + 1] ?? phraseAt;
    const hot = lit * (1 - progress(frame, next - 2, 14)) * (1 - allDim);
    const dim = Math.max(progress(frame, next - 2, 14) * lit, allDim) * 0.9;
    return <RuleCard key={r.title} i={i} hot={hot} dim={Math.min(1, dim)} show={Math.max(0.0001, lit)} lines={r.lines} title={r.title} art={r.art} />;
  });

  return (
    <Stage>
      {boardOut < 1 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: 1 - boardOut, fontFamily: FONT.sans }}>
          {/* The numbered slots wait from `recap` */}
          {RULES.map((_, i) => {
            const lit = Math.min(1, springIn(frame, fps, ruleAt[i] - 4, { damping: 16 }) * 1.3);
            const slot = progress(frame, recapAt - 20 + i * 4, 12) * (1 - lit);
            if (slot < 0.01) return null;
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: i * (CARD_W + CARD_GAP),
                  top: 0,
                  width: CARD_W,
                  height: CARD_H,
                  boxSizing: 'border-box',
                  borderRadius: 24,
                  border: `2px dashed ${C.ink600}`,
                  display: 'grid',
                  placeItems: 'center',
                  opacity: slot,
                  transform: `translateY(${(1 - slot) * 16}px)`,
                }}
              >
                <span style={{ fontSize: 120, fontWeight: 850, color: C.ink700 }}>{i + 1}</span>
              </div>
            );
          })}
          {cards}

          {phraseIn > 0.01 && phraseOut < 0.99 ? (
            <div
              style={{
                position: 'absolute',
                left: (W - PHRASE_W) / 2,
                top: PHRASE_TOP,
                width: PHRASE_W,
                boxSizing: 'border-box',
                padding: '14px 32px',
                borderRadius: 26,
                background: alpha(C.violet, 0.08),
                border: `3px solid ${alpha(C.violet, 0.6)}`,
                boxShadow: `0 0 34px ${alpha(C.violet, 0.18)}`,
                display: 'flex',
                alignItems: 'center',
                gap: 24,
                opacity: phraseIn * (1 - phraseOut),
                transform: `translateY(${(1 - phraseIn) * 16 - phraseOut * 10}px)`,
              }}
            >
              <Icon name="mortarboard" size={56} color={C.violet} strokeWidth={2} />
              <div style={{ fontSize: 42, fontWeight: 800, lineHeight: 1.22, whiteSpace: 'nowrap' }}>
                <div style={{ color: C.textStrong }}>{PHRASE[0]}</div>
                <div style={{ color: '#c4b5fd' }}>{PHRASE[1]}</div>
              </div>
            </div>
          ) : null}

          <NextAction frame={frame} fps={fps} at={nextAt} top={NEXT_TOP} />
        </div>
      ) : null}
      <EndCard frame={frame} fps={fps} at={endcardAt} />
    </Stage>
  );
}

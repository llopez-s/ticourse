import type { CSSProperties, ReactNode } from 'react';
import { interpolateColors } from 'remotion';
import { C, FONT, STAGE, TYPE, alpha } from '../../../theme/tokens';
import { EASE, lerp, progress, springIn } from '../../../theme/motion';
import { Chip, Icon, type IconName } from '../../../ui';

export interface DefinitionTimes {
  title: number;
  /** Word frames of Security, Information, and, Event, Management. */
  words: [number, number, number, number, number];
  defSim: number;
  defSem: number;
  defMerge: number;
  /** Word frame of «cuatro» (verbos): the four verb slots appear dim. */
  verbsIntro: number;
  /** Word frames of agregar, normalizar, correlacionar, alertar. */
  verbs: [number, number, number, number];
}

const EXPANSION = ['Security', 'Information', 'and', 'Event', 'Management'] as const;
/** Which expansion word lights each letter of S-I-E-M. */
const LETTER_WORD = [0, 1, 3, 4] as const;

const CAPSULE = { w: 760, h: 224, top: 300 };
const SIM_LEFT = 64;
const SEM_LEFT = STAGE.width - 64 - CAPSULE.w;
/** Width of each capsule once condensed to icon + acronym, just before the fusion. */
const TOKEN_W = 420;
const CENTRE_X = STAGE.width / 2;
const CARD = { w: 1040, h: 327, top: 118 };
/** Vertical centre of the fused card: the tokens meet there. */
const CARD_CENTRE_Y = CARD.top + CARD.h / 2;
/** Height of the full name + description block under each acronym (collapses when fusing). */
const BODY_H = 129;
const VERBS_TOP = 494;

const VERBS: { label: string; icon: IconName }[] = [
  { label: 'Agregar', icon: 'funnel' },
  { label: 'Normalizar', icon: 'layers' },
  { label: 'Correlacionar', icon: 'link' },
  { label: 'Alertar', icon: 'bell' },
];

/** "Security Information and Event Management" with the S-I-E-M initials in cyan. */
function Expansion({ size, lit, style }: { size: number; lit: number[]; style?: CSSProperties }) {
  return (
    <div style={{ fontSize: size, fontWeight: 600, whiteSpace: 'nowrap', letterSpacing: 0.2, ...style }}>
      {EXPANSION.map((word, i) => {
        const on = lit[i] ?? 1;
        const initial = word !== 'and';
        return (
          <span key={word} style={{ color: interpolateColors(on, [0, 1], [C.faint, C.text]) }}>
            {i > 0 ? ' ' : ''}
            {initial ? (
              <span style={{ color: interpolateColors(on, [0, 1], [C.faint, C.cyan]), fontWeight: 850 }}>{word[0]}</span>
            ) : null}
            {initial ? word.slice(1) : word}
          </span>
        );
      })}
    </div>
  );
}

function Capsule({
  acronym,
  name,
  icon,
  children,
  body = 1,
  mark = 1,
  width = CAPSULE.w,
  style,
}: {
  acronym: string;
  name: string;
  icon: IconName;
  children: ReactNode;
  /** 0-1: the full name and the description; they fade and collapse first when the capsules fuse. */
  body?: number;
  /** Opacity of the icon and the acronym (they stay until the two tokens meet). */
  mark?: number;
  width?: number;
  style?: CSSProperties;
}) {
  return (
    <div
      style={{
        position: 'absolute',
        top: CAPSULE.top,
        width,
        height: CAPSULE.h,
        overflow: 'hidden',
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        gap: 30,
        padding: '0 44px 0 40px',
        borderRadius: CAPSULE.h / 2,
        background: `linear-gradient(180deg, ${C.ink850} 0%, ${C.ink900} 100%)`,
        border: `2px solid ${alpha(C.cyan, 0.55)}`,
        boxShadow: `0 24px 60px ${alpha('#000000', 0.35)}, 0 0 30px ${alpha(C.cyan, 0.12)}`,
        fontFamily: FONT.sans,
        ...style,
      }}
    >
      <div
        style={{
          width: 116,
          height: 116,
          borderRadius: 58,
          display: 'grid',
          placeItems: 'center',
          background: alpha(C.cyan, 0.12),
          border: `2px solid ${alpha(C.cyan, 0.4)}`,
          flexShrink: 0,
          opacity: mark,
        }}
      >
        <Icon name={icon} size={60} color={C.cyan} />
      </div>
      <div style={{ minWidth: 0, opacity: mark }}>
        <div style={{ fontSize: 60, fontWeight: 850, letterSpacing: 3, color: C.textStrong, lineHeight: 1 }}>{acronym}</div>
        <div style={{ height: BODY_H * body, overflow: 'hidden', opacity: body }}>
          <div style={{ marginTop: 6, fontSize: TYPE.small, fontWeight: 600, lineHeight: 1.2, color: C.muted, whiteSpace: 'nowrap' }}>
            {name}
          </div>
          <div style={{ marginTop: 10, fontSize: 34, fontWeight: 650, lineHeight: 1.2, color: C.text, whiteSpace: 'nowrap' }}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * SIEM title, the SIM and SEM capsules, their fusion into one cyan SIEM card
 * and the four verbs. Everything is anchored to the scene cues and to the
 * spoken word frames passed in `t`.
 */
export function Definition({ frame, fps, t }: { frame: number; fps: number; t: DefinitionTimes }) {
  if (frame < t.title - 4) return null;

  /* ---- Title: big SIEM + expansion, word-synced. It is parked at the top (still legible) before
     the SIM capsule arrives, and hands over to the fused card at def-merge. */
  const titleIn = springIn(frame, fps, t.title - 3, { damping: 18 });
  const rise = progress(frame, t.defSim - 24, 22, EASE.inOut);
  const handOver = progress(frame, t.defMerge - 4, 10, EASE.inOut);
  const titleOpacity = Math.min(1, titleIn * 1.4) * lerp(rise, [0, 1], [1, 0.6]) * (1 - handOver);
  const titleScale = (0.9 + 0.1 * titleIn) * lerp(rise, [0, 1], [1, 0.62]);
  const titleTop = lerp(rise, [0, 1], [176, 30]);
  const wordLit = t.words.map((w) => progress(frame, w, 8));

  /* ---- Capsules. SIM arrives next to an empty dashed slot on the right: one half of two. */
  const simIn = progress(frame, t.defSim, 22);
  const semIn = progress(frame, t.defSem, 22);
  const slot = progress(frame, t.defSim + 10, 14) * (1 - progress(frame, t.defSem, 10));
  // Fusion, in one continuous shape: the descriptions fade and collapse, each capsule condenses
  // to icon + acronym, the two tokens slide together and meet at the centre; at that moment
  // they become a single shell that grows into the SIEM card, whose content fades in last.
  const body = 1 - progress(frame, t.defMerge - 4, 8, EASE.inOut);
  const merge = progress(frame, t.defMerge, 14, EASE.inOut);
  const mark = 1 - progress(frame, t.defMerge + 10, 4, EASE.inOut);
  const capsuleW = lerp(merge, [0, 1], [CAPSULE.w, TOKEN_W]);
  const simLeft = lerp(merge, [0, 1], [SIM_LEFT, CENTRE_X - TOKEN_W]);
  const semLeft = lerp(merge, [0, 1], [SEM_LEFT, CENTRE_X]);
  const capsuleLift = (CARD_CENTRE_Y - (CAPSULE.top + CAPSULE.h / 2)) * merge;
  const joinAt = t.defMerge + 14;
  const joined = frame >= joinAt;
  const plus = Math.max(0.45 * progress(frame, t.defSim + 10, 14), semIn) * body;

  /* ---- Fused card: starts as the two joined tokens' silhouette and springs to full size. */
  const grow = springIn(frame, fps, joinAt, { damping: 17 });
  const cardW = 2 * TOKEN_W + (CARD.w - 2 * TOKEN_W) * grow;
  const cardH = CAPSULE.h + (CARD.h - CAPSULE.h) * grow;
  const cardR = Math.max(24, CAPSULE.h / 2 + (32 - CAPSULE.h / 2) * grow);
  const tint = progress(frame, joinAt, 12);
  const cardContent = progress(frame, joinAt, 12);
  const cardGlow = progress(frame, joinAt, 8) * (1 - 0.6 * progress(frame, joinAt + 30, 30));

  return (
    <div style={{ position: 'absolute', inset: 0, fontFamily: FONT.sans }}>
      {titleOpacity > 0.001 ? (
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: titleTop,
            width: STAGE.width,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            opacity: titleOpacity,
            transform: `scale(${titleScale})`,
            transformOrigin: '50% 0%',
          }}
        >
          <div style={{ fontSize: 210, fontWeight: 850, letterSpacing: 10, lineHeight: 1, display: 'flex' }}>
            {'SIEM'.split('').map((letter, i) => {
              const on = wordLit[LETTER_WORD[i]];
              return (
                <span
                  key={letter + i}
                  style={{
                    color: interpolateColors(on, [0, 1], [C.textStrong, C.cyan]),
                    textShadow: `0 0 ${40 * on}px ${alpha(C.cyan, 0.35 * on)}`,
                  }}
                >
                  {letter}
                </span>
              );
            })}
          </div>
          <Expansion size={52} lit={wordLit} style={{ marginTop: 26 }} />
        </div>
      ) : null}

      {slot > 0.001 ? (
        <div
          style={{
            position: 'absolute',
            left: SEM_LEFT,
            top: CAPSULE.top,
            width: CAPSULE.w,
            height: CAPSULE.h,
            boxSizing: 'border-box',
            borderRadius: CAPSULE.h / 2,
            border: `2px dashed ${alpha(C.cyan, 0.35)}`,
            background: alpha(C.cyan, 0.03),
            opacity: slot,
          }}
        />
      ) : null}

      {simIn > 0 && !joined ? (
        <Capsule
          acronym="SIM"
          name="Security Information Management"
          icon="archive"
          body={body}
          mark={mark}
          width={capsuleW}
          style={{
            left: simLeft,
            opacity: simIn,
            transform: `translate(${(1 - simIn) * -60}px, ${capsuleLift}px)`,
          }}
        >
          guarda, busca e informa
          <br />a largo plazo
        </Capsule>
      ) : null}

      {semIn > 0 && !joined ? (
        <Capsule
          acronym="SEM"
          name="Security Event Management"
          icon="radar"
          body={body}
          mark={mark}
          width={capsuleW}
          style={{
            left: semLeft,
            opacity: semIn,
            transform: `translate(${(1 - semIn) * 60}px, ${capsuleLift}px)`,
          }}
        >
          vigila eventos
          <br />en tiempo real
        </Capsule>
      ) : null}

      {plus > 0.001 ? (
        <div
          style={{
            position: 'absolute',
            left: CENTRE_X - 34,
            top: CAPSULE.top + CAPSULE.h / 2 - 34 + capsuleLift,
            width: 68,
            height: 68,
            borderRadius: 34,
            display: 'grid',
            placeItems: 'center',
            background: C.ink900,
            border: `2px solid ${alpha(C.cyan, 0.5)}`,
            color: C.cyanSoft,
            fontSize: 48,
            fontWeight: 700,
            lineHeight: 1,
            opacity: plus,
            transform: `scale(${0.6 + 0.4 * body})`,
          }}
        >
          +
        </div>
      ) : null}

      {joined ? (
        <div
          style={{
            position: 'absolute',
            left: CENTRE_X - cardW / 2,
            top: CARD_CENTRE_Y - cardH / 2,
            width: cardW,
            height: cardH,
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            borderRadius: cardR,
            background: `linear-gradient(180deg, ${C.ink850} 0%, ${C.ink900} 100%)`,
            border: `2px solid ${alpha(C.cyan, 0.55 + 0.35 * cardGlow)}`,
            boxShadow: `0 30px 70px ${alpha('#000000', 0.4)}, 0 0 ${30 + 40 * cardGlow}px ${alpha(C.cyan, 0.12 + 0.22 * cardGlow)}`,
          }}
        >
          {/* Cyan tint that turns the neutral capsule surface into the SIEM card. */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `linear-gradient(180deg, ${alpha(C.cyanDeep, 0.3)} 0%, ${alpha(C.ink900, 0)} 70%)`,
              opacity: tint,
            }}
          />
          <div
            style={{
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              opacity: cardContent,
              transform: `scale(${0.94 + 0.06 * cardContent})`,
            }}
          >
            <div style={{ fontSize: 118, fontWeight: 850, letterSpacing: 8, lineHeight: 1, color: C.cyan }}>SIEM</div>
            <Expansion size={36} lit={[1, 1, 1, 1, 1]} style={{ marginTop: 16 }} />
            <div style={{ marginTop: 26, display: 'flex', alignItems: 'center', gap: 18 }}>
              <Chip accent="cyan" icon="archive" size={TYPE.small}>
                SIM · largo plazo
              </Chip>
              <span style={{ fontSize: 40, fontWeight: 700, color: C.cyanSoft, lineHeight: 1 }}>+</span>
              <Chip accent="cyan" icon="radar" size={TYPE.small}>
                SEM · tiempo real
              </Chip>
            </div>
          </div>
        </div>
      ) : null}

      <div
        style={{
          position: 'absolute',
          left: 0,
          top: VERBS_TOP,
          width: STAGE.width,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 22,
        }}
      >
        {VERBS.map((verb, i) => {
          const at = t.verbs[i];
          // On «cuatro» the row appears as four dim slots, so it is balanced before the first verb;
          // each slot lights with a small pop on its spoken word.
          const ghost = 0.3 * progress(frame, t.verbsIntro + i * 3, 12);
          const lit = progress(frame, at - 2, 8);
          const pop = springIn(frame, fps, at - 2, { damping: 15 });
          const glow = progress(frame, at, 6) * (1 - progress(frame, at + 16, 30));
          const arrow = Math.max(ghost, progress(frame, at - 4, 10));
          return (
            <div key={verb.label} style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
              {i > 0 ? (
                <Icon name="arrowRight" size={40} color={alpha(C.cyan, 0.7)} style={{ opacity: arrow }} />
              ) : null}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  height: 82,
                  padding: '0 30px 0 22px',
                  borderRadius: 41,
                  background: alpha(C.cyan, 0.03 + 0.05 * lit + 0.12 * glow),
                  border: `2px solid ${alpha(C.cyan, 0.3 + 0.2 * lit + 0.45 * glow)}`,
                  boxShadow: `0 0 ${36 * glow}px ${alpha(C.cyan, 0.35 * glow)}`,
                  fontSize: 38,
                  fontWeight: 750,
                  color: interpolateColors(lit, [0, 1], [C.faint, C.textStrong]),
                  whiteSpace: 'nowrap',
                  opacity: Math.max(ghost, Math.min(1, pop * 1.4)),
                  transform: `scale(${0.94 + 0.06 * Math.max(ghost / 0.3, pop)})`,
                }}
              >
                <Icon name={verb.icon} size={40} color={interpolateColors(lit, [0, 1], [C.faint, C.cyan])} />
                {verb.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

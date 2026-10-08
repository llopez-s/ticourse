import type { CSSProperties } from 'react';
import { useCurrentFrame } from 'remotion';
import { C, FONT, RADIUS, TYPE, alpha } from '../../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../../engine/src/theme/motion';
import { Chip, Icon, NodeCard, Panel, dimStyle } from '../../../../engine/src/ui';
import { ALERT } from '../../data/alert';

/**
 * AlertCard — the 5-3 alert («05-03-2026 · 02:13 UTC», ENG-WS-041 «llama a» update-svc-cdn.com, «dominio
 * desconocido»), the same drawing every time it comes back. It mirrors V3's alert
 * (`video/diamond-e7/src/scenes/S01Hook.tsx:176-234,275-287`) «sin nada más»: no severity badge, no «EDR», no
 * «Beacon HTTPS saliente», no «HTTPS» on the link, no beacon/jitter strip (the voice defines «beacon» in s04).
 * Strings: `src/data/alert.ts`.
 *
 * Two variants, same rose card inside:
 * - `full` (s01): the «SOC · Meridian Dynamics» panel with the «turno de noche» chip; before `at` it shows the quiet
 *   console, at `at` the rose card lands with a bell flash and the panel turns rose.
 * - `compact` (s08 `today`): the rose card alone, smaller type, no panel.
 * Either variant can lay out «¿qué le queda por hacer?» under the card (`question` defined, 0–1 = its opacity); a
 * scene that scales the card down draws that line itself instead, so it stays ≥ 32 px.
 *
 * The card has NO success / blocked / contained state, and no prop for one: in this video nobody at Meridian cuts
 * anything, and the 5-3 card never says whether anyone got there in time.
 *
 * Frames are relative to the Sequence (`frame` defaults to `useCurrentFrame()`). The pieces appear in order: card
 * (`at`), host (`hostAt`), the «llama a» link drawing (`linkAt`), domain (`domainAt`), «dominio desconocido»
 * (`unknownAt`); each defaults to a short stagger after `at`, so a scene that does not sync them gets the whole card
 * at once. `dim` (0–1) steps the whole card back (40 % opacity, half saturation). Size: `alertCardSize(variant,
 * width)`; the part draws at its own (left, top) = (0, 0) — wrap it in an absolutely positioned div.
 */
export type AlertCardVariant = 'full' | 'compact';

export interface AlertCardProps {
  variant?: AlertCardVariant;
  /** Outer width: the panel's (full, default 1240) or the card's (compact, default 1040). */
  width?: number;
  /** Frame the alert fires: the rose card lands, the bell flashes. */
  at: number;
  /** Full only: frame the panel itself appears (default: already there). */
  panelAt?: number;
  hostAt?: number;
  linkAt?: number;
  domainAt?: number;
  unknownAt?: number;
  /** «¿qué le queda por hacer?» under the card: undefined = no line laid out; 0–1 = laid out, at that opacity. */
  question?: number;
  /** Lights the question line (0–1): brighter text and a soft glow, for the moment the voice says it. */
  questionGlow?: number;
  /** 0–1: steps the whole card back. */
  dim?: number;
  frame?: number;
  style?: CSSProperties;
}

interface Spec {
  /** Panel body padding (full only). */
  bodyPadX: number;
  bodyPadY: number;
  /** Rose card padding. */
  pad: number;
  bell: number;
  timeSize: number;
  timeLine: number;
  rowGap: number;
  hostW: number;
  domainW: number;
  subGap: number;
  subSize: number;
  linkLabel: number;
  qGap: number;
  qSize: number;
}

const SPEC: Record<AlertCardVariant, Spec> = {
  full: {
    bodyPadX: 32,
    bodyPadY: 26,
    pad: 28,
    bell: 44,
    timeSize: TYPE.h3,
    timeLine: 56,
    rowGap: 26,
    hostW: 400,
    domainW: 470,
    subGap: 10,
    subSize: TYPE.label,
    linkLabel: TYPE.label,
    qGap: 22,
    qSize: TYPE.h3,
  },
  compact: {
    bodyPadX: 0,
    bodyPadY: 0,
    pad: 22,
    bell: 36,
    timeSize: 34,
    timeLine: 42,
    rowGap: 16,
    hostW: 360,
    domainW: 460,
    subGap: 8,
    subSize: TYPE.small,
    linkLabel: 28,
    qGap: 18,
    qSize: 40,
  },
};

/** NodeCard's own height: a 60 px tile + 16 px padding top and bottom + 2 px borders. */
const NODE_H = 96;
const PANEL_HEADER = 64;
const DEFAULT_W: Record<AlertCardVariant, number> = { full: 1240, compact: 1040 };

function cardHeight(s: Spec): number {
  return 4 + 2 * s.pad + s.timeLine + s.rowGap + NODE_H + s.subGap + Math.round(s.subSize * 1.2);
}

/** Outer size of the part; `withQuestion` = the `question` prop is defined (its line is laid out). */
export function alertCardSize(variant: AlertCardVariant = 'full', width = DEFAULT_W[variant], withQuestion = false): { width: number; height: number } {
  const s = SPEC[variant];
  const q = withQuestion ? s.qGap + Math.round(s.qSize * 1.2) : 0;
  if (variant === 'full') return { width, height: 4 + PANEL_HEADER + 2 * s.bodyPadY + cardHeight(s) + q };
  return { width, height: cardHeight(s) + q };
}

export function AlertCard({
  variant = 'full',
  width,
  at,
  panelAt = Number.NEGATIVE_INFINITY,
  hostAt,
  linkAt,
  domainAt,
  unknownAt,
  question,
  questionGlow = 0,
  dim = 0,
  frame: frameProp,
  style,
}: AlertCardProps) {
  const current = useCurrentFrame();
  const frame = frameProp ?? current;
  const s = SPEC[variant];
  const W = width ?? DEFAULT_W[variant];
  const fired = frame >= at;
  const flash = fired ? 1 - progress(frame, at, 40) : 0;

  const tHost = hostAt ?? at + 4;
  const tLink = linkAt ?? tHost + 8;
  const tDomain = domainAt ?? tLink + 10;
  const tUnknown = unknownAt ?? tDomain + 8;

  const cardW = variant === 'full' ? W - 2 * s.bodyPadX - 4 : W;
  const card = (
    <RoseCard
      spec={s}
      width={cardW}
      frame={frame}
      at={at}
      flash={flash}
      hostAt={tHost}
      linkAt={tLink}
      domainAt={tDomain}
      unknownAt={tUnknown}
    />
  );
  const questionLine =
    question === undefined ? null : question > 0 ? (
      <div
        style={{
          marginTop: s.qGap,
          height: Math.round(s.qSize * 1.2),
          textAlign: 'center',
          fontFamily: FONT.sans,
          fontSize: s.qSize,
          fontWeight: 800,
          lineHeight: 1.2,
          letterSpacing: -0.4,
          color: C.textStrong,
          whiteSpace: 'nowrap',
          opacity: question,
          transform: `translateY(${(1 - question) * 12}px)`,
          textShadow: questionGlow > 0.01 ? `0 0 ${Math.round(24 * questionGlow)}px ${alpha(C.cyan, 0.55 * questionGlow)}` : undefined,
        }}
      >
        {ALERT.question}
      </div>
    ) : (
      <div style={{ marginTop: s.qGap, height: Math.round(s.qSize * 1.2) }} />
    );

  if (variant === 'compact') {
    return (
      <div style={{ position: 'relative', width: W, ...dimStyle(dim), ...style }}>
        {card}
        {questionLine}
      </div>
    );
  }

  const panelIn = Number.isFinite(panelAt) ? enter(frame, panelAt, { distance: 14, duration: 14 }) : { opacity: 1, transform: 'none' };
  const size = alertCardSize('full', W, question !== undefined);
  return (
    <div style={{ position: 'relative', width: W, height: size.height, ...dimStyle(dim, panelIn.opacity), transform: panelIn.transform, ...style }}>
      <Panel
        title={ALERT.soc}
        icon="radar"
        accent={fired ? 'rose' : 'cyan'}
        glow={flash}
        right={
          <Chip accent="muted" icon="clock" size={TYPE.micro}>
            {ALERT.shift}
          </Chip>
        }
        style={{ height: '100%' }}
        bodyStyle={{ padding: `${s.bodyPadY}px ${s.bodyPadX}px` }}
      >
        {fired ? (
          card
        ) : (
          <div
            style={{
              height: cardHeight(s),
              boxSizing: 'border-box',
              borderRadius: RADIUS.md,
              border: `2px dashed ${C.ink700}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 16,
              fontFamily: FONT.sans,
              fontSize: TYPE.label,
              fontStyle: 'italic',
              color: C.muted,
            }}
          >
            <Icon name="bell" size={34} color={C.ink500} />
            {ALERT.quiet}
          </div>
        )}
        {questionLine}
      </Panel>
    </div>
  );
}

/** The rose-bordered alert itself: bell + time, then host «llama a» domain with their captions. */
function RoseCard({
  spec: s,
  width,
  frame,
  at,
  flash,
  hostAt,
  linkAt,
  domainAt,
  unknownAt,
}: {
  spec: Spec;
  width: number;
  frame: number;
  at: number;
  flash: number;
  hostAt: number;
  linkAt: number;
  domainAt: number;
  unknownAt: number;
}) {
  const landed = enter(frame, at, { distance: 26, duration: 16 });
  const inner = width - 4 - 2 * s.pad;
  const rowTop = s.pad + s.timeLine + s.rowGap;
  const linkX1 = s.hostW + 14;
  const linkX2 = inner - s.domainW - 14;
  const linkY = rowTop + NODE_H / 2;
  const draw = progress(frame, linkAt, 16, EASE.inOut);
  const xEnd = linkX1 + (linkX2 - linkX1) * draw;
  const host = enter(frame, hostAt, { distance: -18, axis: 'x' });
  const domain = enter(frame, domainAt, { distance: 18, axis: 'x' });
  const unknown = progress(frame, unknownAt, 12);
  const hostSub = progress(frame, hostAt + 6, 12);
  const label = progress(frame, linkAt + 4, 12);
  const sub = (color: string, o: number): CSSProperties => ({
    position: 'absolute',
    top: rowTop + NODE_H + s.subGap,
    fontFamily: FONT.sans,
    fontSize: s.subSize,
    fontWeight: 650,
    lineHeight: 1.2,
    color,
    whiteSpace: 'nowrap',
    opacity: o,
  });

  return (
    <div
      style={{
        position: 'relative',
        width,
        height: cardHeight(s),
        boxSizing: 'border-box',
        borderRadius: RADIUS.md,
        border: `2px solid ${alpha(C.rose, 0.75)}`,
        background: `linear-gradient(180deg, ${alpha(C.rose, 0.1)} 0%, ${alpha(C.ink900, 0.94)} 70%)`,
        boxShadow: `0 0 ${20 + 30 * flash}px ${alpha(C.rose, 0.18 + 0.3 * flash)}`,
        ...landed,
      }}
    >
      <div style={{ position: 'absolute', left: s.pad, top: s.pad, width: inner, height: '100%' }}>
        {/* bell + time */}
        <div style={{ position: 'absolute', left: 0, top: 0, height: s.timeLine, display: 'flex', alignItems: 'center', gap: Math.round(s.bell * 0.4) }}>
          <Icon name="bell" size={s.bell} color={C.rose} strokeWidth={2} />
          <span style={{ fontFamily: FONT.mono, fontSize: s.timeSize, fontWeight: 700, color: C.textStrong, whiteSpace: 'nowrap', letterSpacing: -0.5 }}>
            {ALERT.when}
          </span>
        </div>

        {/* host */}
        <div style={{ position: 'absolute', left: 0, top: rowTop, ...host }}>
          <NodeCard icon="desktop" label={ALERT.host} accent="cyan" state="active" width={s.hostW} />
        </div>
        <div style={{ ...sub(C.cyanSoft, hostSub * host.opacity), left: 6 }}>{ALERT.hostSub}</div>

        {/* «llama a»: a dashed rose link with a drawn arrowhead (no arrow glyphs in text) */}
        <svg width={inner} height={rowTop + NODE_H} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
          {draw > 0 ? (
            <line x1={linkX1} y1={linkY} x2={xEnd - 10} y2={linkY} stroke={alpha(C.rose, 0.8)} strokeWidth={4} strokeDasharray="12 9" strokeLinecap="round" />
          ) : null}
          {draw > 0.9 ? (
            <polygon
              points={`${linkX2 - 16},${linkY - 11} ${linkX2},${linkY} ${linkX2 - 16},${linkY + 11}`}
              fill={C.rose}
              opacity={progress(frame, linkAt + 13, 4)}
            />
          ) : null}
        </svg>
        <div
          style={{
            position: 'absolute',
            left: linkX1,
            top: linkY - s.linkLabel * 1.2 - 12,
            width: linkX2 - linkX1,
            textAlign: 'center',
            fontFamily: FONT.sans,
            fontSize: s.linkLabel,
            fontWeight: 750,
            lineHeight: 1.2,
            color: C.roseSoft,
            whiteSpace: 'nowrap',
            opacity: label,
          }}
        >
          {ALERT.link}
        </div>

        {/* domain */}
        <div style={{ position: 'absolute', left: inner - s.domainW, top: rowTop, ...domain }}>
          <NodeCard icon="globe" label={ALERT.domain} accent="rose" state="alert" width={s.domainW} />
        </div>
        <div style={{ ...sub(C.roseSoft, unknown), left: inner - s.domainW + 6, fontWeight: 750 }}>{ALERT.domainSub}</div>
      </div>
    </div>
  );
}

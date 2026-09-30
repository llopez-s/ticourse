import type { CSSProperties, ReactNode } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { ACCENT, C, FONT, RADIUS, TYPE, alpha, type Accent } from '../../../engine/src/theme/tokens';
import { EASE, enter, fadeIn, fadeOut, progress, pulse, typewriter } from '../../../engine/src/theme/motion';
import { Chip, Icon, type IconName } from '../../../engine/src/ui';
import { PATTERN, PatternChip } from './parts/s07-whois/shared';
import { Stage, segment, wordFrame } from './kit';

const S = 's07-whois';

// Fictional WHOIS data. The domain and the e-mail are canon; the creation date and
// the registrar are this scene's: 2025 (before pDNS first seen 2026-02-11) and the
// registrar the actor already uses in s3m4 (s3.ts, «NameFlow LLC»).
const DOMAIN = 'update-svc-cdn.com';
const EMAIL = 'kazuo.tanji@protonmail.com';
const CREATED = '2025-11-18';
const REGISTRAR = 'NameFlow LLC';
const REDACTED = 'REDACTED FOR PRIVACY';

const CARD_W = 812;
const CARD_H = 408;
/** Below the top-centre band the intercept card uses. */
const CARD_TOP = 236;
const CENTER_X = (1728 - CARD_W) / 2;
const LEFT_X = 24;
const RIGHT_X = 1728 - 24 - CARD_W;
/** How far the older card peeks out from behind before it slides free. */
const PEEK = { x: 16, y: 10 };
const HEADER_H = 58;
const ROW_H = 56;
const FOOT_H = 60;
const LABEL_W = 214;

/** Pattern chips sit in fixed slots so the «juntos» bracket can reach each one. */
const SLOT_W = [400, 420, 280];
const SLOT_GAP = 20;
const SLOTS_LEFT = (1728 - (SLOT_W[0] + SLOT_W[1] + SLOT_W[2] + 2 * SLOT_GAP)) / 2;
const slotCenter = (i: number) => SLOTS_LEFT + SLOT_W.slice(0, i).reduce((s, w) => s + w + SLOT_GAP, 0) + SLOT_W[i] / 2;

type RowId = 'domain' | 'registrant' | 'email' | 'created' | 'registrar';

/**
 * s07-whois «El WHOIS tiene memoria».
 *   s07-01          the registration card: who bought it, when, in which shop (the registrar)
 *   whois-redacted  update-svc-cdn.com today: registrant and e-mail REDACTED FOR PRIVACY
 *   (intercept)     HOLLOW LANTERN boasts — the top-centre band stays clear
 *   whois-history   an older card slides out from behind: «WHOIS histórico · 2025»
 *   email           it carries the contact e-mail — maybe an alias, but a dedicated pivot
 *   pattern         even without it, what privacy leaves visible forms a pattern:
 *                   same registrar, same nameservers, same day — alone nothing, together it gives him away
 */
export function S07Whois(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const redactedAt = props.cue('whois-redacted');
  const historyAt = props.cue('whois-history');
  const emailAt = props.cue('email');
  const patternAt = props.cue('pattern');
  // The intercept card owns the top-centre band from the end of s07-02 to the start of s07-04.
  const interceptFrom = segment(props, 's07-02').to;

  const domainW = wordFrame(S, 's07-01', 'dominio');
  const whoW = wordFrame(S, 's07-01', 'Quién');
  const whenW = wordFrame(S, 's07-01', 'cuándo');
  const shopW = wordFrame(S, 's07-01', 'tienda');
  const registrarW = wordFrame(S, 's07-01', 'registrador');
  const allW = wordFrame(S, 's07-02', 'todo');
  const coveredW = wordFrame(S, 's07-02', 'tapado');
  const privacyW = wordFrame(S, 's07-02', 'activada');
  const todayW = wordFrame(S, 's07-03', 'Hoy');
  const memoryW = wordFrame(S, 's07-03', 'memoria');
  const aliasW = wordFrame(S, 's07-04', 'Puede');
  const pivotW = wordFrame(S, 's07-04', 'pivote');
  const noMailW = wordFrame(S, 's07-05', 'correo');
  const looseW = wordFrame(S, 's07-05', 'suelto');
  const togetherW = wordFrame(S, 's07-05', 'Juntos');

  // --- cards: position ---------------------------------------------------------
  const slide = progress(frame, historyAt, 32, EASE.inOut);
  const peek = progress(frame, memoryW - 6, 14);
  const curX = CENTER_X + (LEFT_X - CENTER_X) * slide;
  const oldX = CENTER_X + PEEK.x + (RIGHT_X - CENTER_X - PEEK.x) * slide;
  const oldY = CARD_TOP + PEEK.y * (1 - slide);
  const oldOpacity = peek * (0.55 + 0.45 * slide);

  // Focus: the current card steps back while the old one talks, and the other way round for the pattern.
  const patternIn = progress(frame, patternAt - 10, 20);
  const curDim = progress(frame, emailAt, 16) * (1 - patternIn);
  const oldDim = patternIn;

  // --- row highlights ---------------------------------------------------------
  const win = (from: number, to: number) => progress(frame, from - 2, 8) * (1 - progress(frame, to, 10));
  const qOut = Math.min(redactedAt - 4, interceptFrom - 24);
  const lit = (row: RowId): number => {
    switch (row) {
      case 'domain':
        return win(domainW, whoW);
      case 'registrant':
      case 'email':
        return win(whoW, whenW);
      case 'created':
        return win(whenW, shopW);
      case 'registrar':
        return win(shopW, qOut);
    }
  };
  const together = progress(frame, togetherW, 14);
  const surviving = progress(frame, patternAt, 14) * (0.55 + 0.45 * together);

  // --- current card values ---------------------------------------------------------
  const domainTyped = typewriter(DOMAIN, frame, redactedAt, fps, 42);
  const valuesIn = fadeIn(frame, redactedAt + 12, 12);
  const sweepRegistrant = progress(frame, allW, 12, EASE.inOut);
  const sweepEmail = progress(frame, coveredW, 12, EASE.inOut);
  const privacyIn = enter(frame, privacyW, { distance: 12 });
  const todayIn = progress(frame, todayW - 2, 12);
  const todayGlow = todayIn * (1 - progress(frame, historyAt + 20, 30)) * (0.6 + 0.4 * pulse(frame, fps, 0.8));

  // --- old card values ---------------------------------------------------------
  const emailTyped = typewriter(EMAIL, frame, emailAt + 4, fps, 46);
  const emailGlow = progress(frame, emailAt, 12) * (1 - 0.75 * progress(frame, noMailW, 16));
  const emailFade = 1 - 0.6 * progress(frame, noMailW, 16);
  const aliasIn = enter(frame, aliasW - 2, { distance: 12 });
  const pivotIn = enter(frame, pivotW - 2, { distance: 12 });

  return (
    <Stage style={{ fontFamily: FONT.sans }}>
      {/* s07-01: the three questions a registration card answers (gone before the intercept). */}
      <Questions frame={frame} whoW={whoW} whenW={whenW} shopW={shopW} outAt={qOut} />

      {/* The older card sits behind the current one until the WHOIS «remembers». */}
      {oldOpacity > 0.001 ? (
        <Card
          x={oldX}
          y={oldY}
          opacity={oldOpacity}
          dim={oldDim}
          icon="archive"
          accent="cyan"
          title="WHOIS histórico · 2025"
          rows={{
            domain: <Mono color={C.roseSoft}>{DOMAIN}</Mono>,
            registrant: <span style={{ fontSize: TYPE.label, color: C.faint, fontWeight: 600 }}>no consta</span>,
            email:
              frame >= emailAt + 4 ? (
                <span
                  style={{
                    display: 'inline-block',
                    padding: '2px 8px',
                    marginLeft: -8,
                    borderRadius: 8,
                    background: alpha(C.emerald, 0.16 * emailGlow),
                    boxShadow: emailGlow > 0.01 ? `0 0 0 2px ${alpha(C.emerald, 0.75 * emailGlow)}` : undefined,
                    opacity: emailFade,
                  }}
                >
                  <Mono color={C.textStrong}>{emailTyped}</Mono>
                </span>
              ) : (
                <Blank />
              ),
            created: <Mono>{CREATED}</Mono>,
            registrar: <Mono>{REGISTRAR}</Mono>,
          }}
          glow={{ email: emailGlow }}
          glowColor={{ email: C.emerald }}
          footer={
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 14, width: '100%' }}>
              <div style={{ position: 'absolute', left: 0, display: 'flex', alignItems: 'center', gap: 12, opacity: 1 - aliasIn.opacity }}>
                <Icon name="clock" size={30} color={C.muted} />
                <span style={{ fontSize: TYPE.label, fontWeight: 600, color: C.muted, whiteSpace: 'nowrap' }}>de antes de la privacidad</span>
              </div>
              <div style={aliasIn}>
                <Chip accent="amber" size={TYPE.label}>
                  ¿alias?
                </Chip>
              </div>
              <div style={pivotIn}>
                <Chip accent="emerald" icon="target" size={TYPE.label}>
                  pivote dedicado
                </Chip>
              </div>
            </div>
          }
          footerOpacity={1 - 0.5 * progress(frame, noMailW, 16)}
        />
      ) : null}

      {/* Today's card for the C2 domain. */}
      <Card
        x={curX}
        y={CARD_TOP}
        opacity={fadeIn(frame, 4, 14)}
        rise={(1 - progress(frame, 4, 18)) * 20}
        dim={curDim}
        icon="file"
        accent="cyan"
        title="WHOIS · ficha de registro"
        right={
          todayIn > 0 ? (
            <div
              style={{
                opacity: todayIn,
                borderRadius: RADIUS.pill,
                boxShadow: todayGlow > 0.01 ? `0 0 ${Math.round(24 * todayGlow)}px ${alpha(C.cyan, 0.5 * todayGlow)}` : undefined,
              }}
            >
              <Chip accent="cyan" size={TYPE.small}>
                hoy
              </Chip>
            </div>
          ) : null
        }
        rows={{
          domain: frame >= redactedAt ? <Mono color={C.roseSoft}>{domainTyped}</Mono> : <Blank />,
          registrant: frame >= allW ? <Redaction sweep={sweepRegistrant} /> : <Blank />,
          email: frame >= coveredW ? <Redaction sweep={sweepEmail} /> : <Blank />,
          created: frame >= redactedAt + 12 ? <Mono style={{ opacity: valuesIn }}>{CREATED}</Mono> : <Blank />,
          registrar: frame >= redactedAt + 12 ? <Mono style={{ opacity: valuesIn }}>{REGISTRAR}</Mono> : <Blank />,
        }}
        rowRight={{
          registrar: (
            <div style={{ marginLeft: 'auto', ...enter(frame, registrarW - 4, { distance: 10, axis: 'x' }) }}>
              <Chip accent="cyan" icon="app" size={TYPE.small}>
                la tienda
              </Chip>
            </div>
          ),
        }}
        glow={{
          domain: lit('domain'),
          registrant: lit('registrant'),
          email: lit('email'),
          created: Math.max(lit('created'), surviving),
          registrar: Math.max(lit('registrar'), surviving),
        }}
        glowColor={{ created: frame >= patternAt ? C.emerald : C.cyan, registrar: frame >= patternAt ? C.emerald : C.cyan }}
        footer={
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, ...privacyIn }}>
            <Icon name="lock" size={34} color={C.amber} strokeWidth={2.2} />
            <span style={{ fontSize: TYPE.label, fontWeight: 650, color: ACCENT.amber.soft, whiteSpace: 'nowrap' }}>
              protección de privacidad activada
            </span>
          </div>
        }
      />

      {/* s07-05: the registration pattern, in the top band once the intercept is long gone. */}
      <Pattern frame={frame} at={patternAt} looseAt={looseW} togetherAt={togetherW} together={together} />
    </Stage>
  );
}

/** «quién lo compró · cuándo · en qué tienda»: each lights with the word that names it. */
function Questions({ frame, whoW, whenW, shopW, outAt }: { frame: number; whoW: number; whenW: number; shopW: number; outAt: number }) {
  const out = fadeOut(frame, outAt, 14);
  if (out <= 0 || frame < whoW - 8) return null;
  const items = [
    { text: 'quién lo compró', at: whoW, until: whenW },
    { text: 'cuándo', at: whenW, until: shopW },
    { text: 'en qué tienda', at: shopW, until: outAt + 40 },
  ];
  return (
    <div style={{ position: 'absolute', left: 0, width: 1728, top: 70, display: 'flex', justifyContent: 'center', gap: 26, opacity: out }}>
      {items.map((q) => {
        const inn = enter(frame, q.at - 4, { distance: 16 });
        const hot = progress(frame, q.at - 2, 8) * (1 - progress(frame, q.until, 10));
        return (
          <div key={q.text} style={{ ...inn, display: 'inline-grid' }}>
            <div style={{ gridArea: '1 / 1', opacity: 1 - hot }}>
              <Chip accent="cyan" size={TYPE.body}>
                {q.text}
              </Chip>
            </div>
            <div style={{ gridArea: '1 / 1', opacity: hot, borderRadius: RADIUS.pill, boxShadow: `0 0 ${Math.round(26 * hot)}px ${alpha(C.cyan, 0.45 * hot)}` }}>
              <Chip accent="cyan" solid size={TYPE.body}>
                {q.text}
              </Chip>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/** Three pattern chips light up together, then a bracket joins them: «juntos, lo delatan». */
function Pattern({
  frame,
  at,
  looseAt,
  togetherAt,
  together,
}: {
  frame: number;
  at: number;
  looseAt: number;
  togetherAt: number;
  together: number;
}) {
  if (frame < at - 6) return null;
  const bracket = progress(frame, togetherAt, 18, EASE.inOut);
  const x0 = slotCenter(0);
  const x2 = slotCenter(2);
  const BRACKET_Y = 104;
  return (
    <>
      {PATTERN.map((p, i) => {
        const inn = enter(frame, at + i * 4, { distance: 18 });
        let left = SLOTS_LEFT;
        for (let k = 0; k < i; k++) left += SLOT_W[k] + SLOT_GAP;
        return (
          <div key={p.text} style={{ position: 'absolute', left, top: 22, width: SLOT_W[i], display: 'flex', justifyContent: 'center', ...inn }}>
            <PatternChip text={p.text} icon={p.icon} lit={together} />
          </div>
        );
      })}
      <svg width={1728} height={140} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        {bracket > 0 ? (
          <g opacity={bracket}>
            <path
              d={`M${x0},${BRACKET_Y - 14} L${x0},${BRACKET_Y} L${x2},${BRACKET_Y} L${x2},${BRACKET_Y - 14} M${slotCenter(1)},${BRACKET_Y - 14} L${slotCenter(1)},${BRACKET_Y}`}
              fill="none"
              stroke={C.emerald}
              strokeWidth={4}
              strokeLinecap="round"
              strokeLinejoin="round"
              pathLength={1}
              strokeDasharray={`${bracket} 1`}
            />
          </g>
        ) : null}
      </svg>
      <div
        style={{
          position: 'absolute',
          left: 0,
          width: 1728,
          top: 124,
          textAlign: 'center',
          fontSize: 40,
          fontWeight: 750,
          whiteSpace: 'nowrap',
          letterSpacing: -0.3,
        }}
      >
        <span style={{ color: C.muted, opacity: fadeIn(frame, looseAt - 4, 12) }}>suelto no dice nada</span>
        <span style={{ color: C.faint, margin: '0 18px', opacity: fadeIn(frame, togetherAt - 4, 12) }}>·</span>
        <span style={{ color: C.emerald, opacity: fadeIn(frame, togetherAt - 4, 12) }}>juntos, lo delatan</span>
      </div>
    </>
  );
}

const ROWS: { id: RowId; label: string }[] = [
  { id: 'domain', label: 'Dominio' },
  { id: 'registrant', label: 'Registrante' },
  { id: 'email', label: 'Email' },
  { id: 'created', label: 'Creado' },
  { id: 'registrar', label: 'Registrador' },
];

/** A WHOIS registration card: header, five fields, a footer line. */
function Card({
  x,
  y,
  opacity,
  rise = 0,
  dim = 0,
  icon,
  accent,
  title,
  right,
  rows,
  rowRight = {},
  glow = {},
  glowColor = {},
  footer,
  footerOpacity = 1,
}: {
  x: number;
  y: number;
  opacity: number;
  rise?: number;
  dim?: number;
  icon: IconName;
  accent: Accent;
  title: string;
  right?: ReactNode;
  rows: Record<RowId, ReactNode>;
  rowRight?: Partial<Record<RowId, ReactNode>>;
  glow?: Partial<Record<RowId, number>>;
  glowColor?: Partial<Record<RowId, string>>;
  footer?: ReactNode;
  footerOpacity?: number;
}) {
  const a = ACCENT[accent];
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: CARD_W,
        height: CARD_H,
        boxSizing: 'border-box',
        borderRadius: RADIUS.lg,
        border: `2px solid ${C.ink600}`,
        background: `linear-gradient(180deg, ${C.ink850} 0%, ${C.ink900} 100%)`,
        boxShadow: `0 28px 64px ${alpha('#000000', 0.45)}, inset 0 1px 0 ${alpha('#ffffff', 0.05)}`,
        overflow: 'hidden',
        opacity,
        transform: `translateY(${rise}px)`,
        filter: dim > 0.001 ? `brightness(${1 - 0.4 * dim})` : undefined,
      }}
    >
      <div
        style={{
          height: HEADER_H,
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          padding: '0 22px',
          borderBottom: `2px solid ${C.ink700}`,
          background: alpha(C.ink800, 0.9),
        }}
      >
        <Icon name={icon} size={30} color={a.fg} />
        <span style={{ flex: 1, fontSize: TYPE.small, fontWeight: 700, color: C.text, whiteSpace: 'nowrap' }}>{title}</span>
        {right}
      </div>
      <div style={{ padding: '6px 14px 0' }}>
        {ROWS.map((r) => {
          const g = glow[r.id] ?? 0;
          const color = glowColor[r.id] ?? C.cyan;
          return (
            <div
              key={r.id}
              style={{
                height: ROW_H,
                display: 'flex',
                alignItems: 'center',
                padding: '0 14px',
                borderRadius: 12,
                background: g > 0.001 ? alpha(color, 0.13 * g) : undefined,
                boxShadow: g > 0.001 ? `inset 4px 0 0 ${alpha(color, 0.9 * g)}` : undefined,
              }}
            >
              <div style={{ width: LABEL_W, flexShrink: 0, fontSize: TYPE.label, fontWeight: 600, color: g > 0.5 ? C.textStrong : C.muted }}>
                {r.label}
              </div>
              <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center' }}>
                {rows[r.id]}
                {rowRight[r.id] ?? null}
              </div>
            </div>
          );
        })}
      </div>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: FOOT_H,
          display: 'flex',
          alignItems: 'center',
          padding: '0 28px',
          borderTop: `2px dashed ${C.ink700}`,
          opacity: footerOpacity,
        }}
      >
        {footer}
      </div>
    </div>
  );
}

function Mono({ children, color = C.text, style }: { children: ReactNode; color?: string; style?: CSSProperties }) {
  return (
    <span style={{ fontFamily: FONT.mono, fontSize: TYPE.label, fontWeight: 650, color, whiteSpace: 'nowrap', ...style }}>{children}</span>
  );
}

/** An empty field: a short dashed rule. */
function Blank() {
  return <div style={{ width: 180, height: 0, borderBottom: `3px dashed ${C.ink600}` }} />;
}

/** A marker sweep covers the field, then the registry's wording appears on it. */
function Redaction({ sweep }: { sweep: number }) {
  return (
    <span
      style={{
        position: 'relative',
        display: 'inline-block',
        padding: '4px 12px',
        marginLeft: -12,
        borderRadius: 8,
        background: alpha(C.ink600, 0.95),
        clipPath: `inset(0 ${((1 - sweep) * 100).toFixed(1)}% 0 0 round 8px)`,
      }}
    >
      <span
        style={{
          fontFamily: FONT.mono,
          fontSize: TYPE.label,
          fontWeight: 700,
          color: C.muted,
          whiteSpace: 'nowrap',
          opacity: progress(sweep, 0.6, 0.4),
        }}
      >
        {REDACTED}
      </span>
    </span>
  );
}

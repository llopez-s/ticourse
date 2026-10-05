import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { Icon, type IconName } from '../../../../../engine/src/ui';
import { ANSWER, NAMES, NOT_POISON, ON_CALL } from '../../../data/s05-amp';

const VIOLET_TXT = '#c4b5fd';
const EMERALD_TXT = '#6ee7b7';

/** One exam name (violet) with what it stands for in the image under it. */
export function ExamName({ name, sub, show, align = 'left', size = 48 }: { name: string; sub?: string; show: number; align?: 'left' | 'right' | 'center'; size?: number }) {
  return (
    <div style={{ fontFamily: FONT.sans, textAlign: align, whiteSpace: 'nowrap', opacity: show, transform: `translateY(${(1 - show) * 12}px)` }}>
      <div style={{ fontSize: size, fontWeight: 850, letterSpacing: 1.5, color: VIOLET_TXT, textShadow: `0 0 22px ${alpha(C.violet, 0.45 * show)}`, lineHeight: 1.1 }}>{name}</div>
      {sub ? <div style={{ marginTop: 4, fontSize: 30, fontWeight: 700, color: C.muted }}>{sub}</div> : null}
    </div>
  );
}

export const NAMES_W = 688;

/**
 * REFLECTED (left, «la dirección falsa») and AMPLIFIED (right, «el pedido enorme») joining into
 * DNS AMPLIFICATION under them: two drawn lines meet at the joined name. 0–1 inputs.
 */
export function JoinedNames({ reflected, amplified, join, parents = 1 }: { reflected: number; amplified: number; join: number; parents?: number }) {
  const mid = NAMES_W / 2;
  return (
    <div style={{ position: 'relative', width: NAMES_W, height: 182 }}>
      <div style={{ position: 'absolute', left: 0, top: 0, opacity: parents }}>
        <ExamName name={NAMES.reflected} sub={NAMES.reflectedSub} show={reflected} />
      </div>
      <div style={{ position: 'absolute', right: 0, top: 0, opacity: parents }}>
        <ExamName name={NAMES.amplified} sub={NAMES.amplifiedSub} show={amplified} align="right" />
      </div>
      {join > 0 ? (
        <svg width={NAMES_W} height={182} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: join * parents }}>
          <path d={`M150 98 Q150 ${118} ${mid - 60} 124`} fill="none" stroke={alpha(C.violet, 0.7)} strokeWidth={3} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - join} />
          <path d={`M${NAMES_W - 150} 98 Q${NAMES_W - 150} 118 ${mid + 60} 124`} fill="none" stroke={alpha(C.violet, 0.7)} strokeWidth={3} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - join} />
        </svg>
      ) : null}
      {join > 0 ? (
        <div style={{ position: 'absolute', left: 0, top: 118, width: NAMES_W, opacity: join }}>
          <ExamName name={NAMES.joined} show={join} align="center" size={56} />
        </div>
      ) : null}
    </div>
  );
}

/** «DNS poisoning: te cambia a dónde vas; esto te atasca la calle» — only «DNS poisoning» is struck. */
export function NotPoison({ show, strike }: { show: number; strike: number }) {
  return (
    <div style={{ fontFamily: FONT.sans, fontSize: 34, fontWeight: 700, color: C.text, whiteSpace: 'nowrap', opacity: show, transform: `translateY(${(1 - show) * 10}px)` }}>
      <span style={{ position: 'relative', color: strike > 0.5 ? C.faint : C.roseSoft }}>
        {NOT_POISON.term}
        <span style={{ position: 'absolute', left: -4, top: '54%', height: 5, width: `calc((100% + 8px) * ${strike})`, borderRadius: 3, background: C.rose }} />
      </span>
      <span style={{ color: C.faint }}>{NOT_POISON.sep}</span>
      <span>{NOT_POISON.rest}</span>
    </div>
  );
}

const ICONS: Record<(typeof ANSWER)[number]['id'], IconName> = { provider: 'shield', third: 'users', source: 'lock' };
const TONES: Record<(typeof ANSWER)[number]['id'], string> = { provider: C.emerald, third: C.sky, source: C.emerald };

export const ANSWER_W = 1110;

/** The answer panel: three rows, each lit on its beat (`rows[k]` 0–1). */
export function AnswerPanel({ rows }: { rows: readonly number[] }) {
  return (
    <div
      style={{
        width: ANSWER_W,
        boxSizing: 'border-box',
        padding: '14px 26px',
        borderRadius: RADIUS.lg,
        border: `2px solid ${alpha(C.emerald, 0.55)}`,
        background: `linear-gradient(90deg, ${alpha(C.emeraldDeep, 0.45)} 0%, ${alpha(C.ink900, 0.96)} 55%)`,
        boxShadow: `0 22px 50px ${alpha('#000000', 0.4)}`,
        fontFamily: FONT.sans,
        opacity: Math.min(1, (rows[0] ?? 0) * 1.5),
      }}
    >
      {ANSWER.map((a, k) => {
        const p = rows[k] ?? 0;
        const tone = TONES[a.id];
        return (
          <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 18, height: 60, opacity: p, transform: `translateX(${(1 - p) * 16}px)`, whiteSpace: 'nowrap' }}>
            <div style={{ width: 48, height: 48, flexShrink: 0, borderRadius: 12, display: 'grid', placeItems: 'center', background: alpha(tone, 0.14), border: `2px solid ${alpha(tone, 0.6)}` }}>
              <Icon name={ICONS[a.id]} size={30} color={tone} />
            </div>
            <span style={{ fontSize: 38, fontWeight: 800, color: a.id === 'third' ? '#7dd3fc' : EMERALD_TXT }}>{a.text}</span>
          </div>
        );
      })}
    </div>
  );
}

/** «guardia · 05:44 · aviso de caída · llamada al proveedor» (after the answer). `time` lights 05:44. */
export function OnCallLine({ show, time }: { show: number; time: number }) {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 14,
        padding: '6px 22px 6px 14px',
        borderRadius: RADIUS.pill,
        border: `2px solid ${alpha(C.cyan, 0.5)}`,
        background: alpha(C.cyan, 0.08),
        fontFamily: FONT.sans,
        fontSize: 34,
        fontWeight: 750,
        color: C.text,
        whiteSpace: 'nowrap',
        opacity: show,
        transform: `translateY(${(1 - show) * 10}px)`,
      }}
    >
      <Icon name="bell" size={34} color={C.cyan} />
      <span style={{ color: C.cyanSoft, fontWeight: 800 }}>{ON_CALL.lead}</span>
      <span style={{ color: C.faint }}>·</span>
      <span
        style={{
          fontFamily: FONT.mono,
          fontWeight: 800,
          color: time > 0.5 ? '#fde68a' : C.textStrong,
          padding: '0 8px',
          borderRadius: 8,
          background: alpha(C.amber, 0.18 * time),
          boxShadow: time > 0 ? `0 0 0 2px ${alpha(C.amber, 0.85 * time)}` : undefined,
        }}
      >
        {ON_CALL.time}
      </span>
      {ON_CALL.rest.map((r) => (
        <span key={r} style={{ display: 'inline-flex', gap: 14 }}>
          <span style={{ color: C.faint }}>·</span>
          <span>{r}</span>
        </span>
      ))}
    </div>
  );
}

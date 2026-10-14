import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { Icon, clamp01 } from '../../../../../engine/src/ui';
import { EXAMPLE, LOG, SERVER, type LogTone } from '../../../data/s04-enterprise';
import { RADIUS_CARD } from './layout';

/**
 * The RADIUS server (sky: infrastructure) and what it writes down. ONE card: the server's plate on
 * top, then the label «ejemplo · sin fecha · no es el registro del puerto» and, under it, the four
 * lines. The label is part of the card: it is there for as long as the lines are.
 */
const HEAD_H = 60;
const LABEL_H = 50;
const ROW_H = 50;
export const RADIUS_H = HEAD_H + LABEL_H + LOG.length * ROW_H + 18;
/** Stage-local y of the server's plate centre (the line to the carnés starts there). */
export const RADIUS_PLATE_Y = RADIUS_CARD.y + HEAD_H / 2;

const TONE: Record<LogTone, string> = { plain: C.textStrong, soft: C.muted, emerald: '#6ee7b7', rose: C.roseSoft };
const EDGE: Record<LogTone, string> = { plain: C.sky, soft: C.sky, emerald: C.emerald, rose: C.rose };

export function RadiusCard({
  show = 1,
  glow = 0,
  label = 1,
  lines,
  lit,
  size = 32,
}: {
  show?: number;
  /** 0–1: the server is the subject («un servidor decide», «RADIUS»). */
  glow?: number;
  /** 0–1: the example label lands (it never leaves). */
  label?: number;
  /** 0–1 per log line: it is written. */
  lines: readonly number[];
  /** 0–1 per log line: it is the line of the moment. */
  lit: readonly number[];
  size?: number;
}) {
  const s = clamp01(show);
  if (s <= 0.001) return null;
  const g = clamp01(glow);
  const lb = clamp01(label);
  return (
    <div
      style={{
        position: 'absolute',
        left: RADIUS_CARD.x,
        top: RADIUS_CARD.y,
        width: RADIUS_CARD.w,
        height: RADIUS_H,
        boxSizing: 'border-box',
        borderRadius: RADIUS.md,
        border: `3px solid ${alpha(C.sky, 0.6 + 0.4 * g)}`,
        background: alpha(C.ink900, 0.95),
        boxShadow: `0 0 ${Math.round(10 + 30 * g)}px ${alpha(C.sky, 0.1 + 0.28 * g)}, 0 14px 30px ${alpha('#000000', 0.4)}`,
        fontFamily: FONT.sans,
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        opacity: s,
        transform: `translateY(${(1 - s) * 14}px)`,
      }}
    >
      {/* the server's plate */}
      <div style={{ height: HEAD_H, display: 'flex', alignItems: 'center', gap: 14, padding: '0 20px 0 16px', background: alpha(C.sky, 0.12 + 0.08 * g), borderBottom: `2px solid ${alpha(C.sky, 0.4)}` }}>
        <Icon name="server" size={42} color={C.sky} strokeWidth={2} />
        <span style={{ fontSize: 40, fontWeight: 880, letterSpacing: 1, color: '#bae6fd' }}>{SERVER}</span>
        <span style={{ flex: 1 }} />
        {[C.emerald, C.sky, alpha(C.sky, 0.4)].map((c, i) => (
          <span key={i} style={{ width: 12, height: 12, borderRadius: 99, background: c }} />
        ))}
      </div>
      {/* the label of the example: it stays over the lines */}
      <div style={{ height: LABEL_H, display: 'flex', alignItems: 'center', padding: '0 16px', opacity: lb }}>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            height: 38,
            padding: '0 16px',
            borderRadius: RADIUS.sm,
            border: `2px dashed ${alpha(C.muted, 0.9)}`,
            background: alpha(C.ink700, 0.6),
            fontSize: 30,
            fontWeight: 760,
            color: C.text,
          }}
        >
          {EXAMPLE.logLabel.join(' · ')}
        </span>
      </div>
      {LOG.map((tokens, i) => {
        const p = clamp01(lines[i] ?? 0);
        const l = clamp01(lit[i] ?? 0);
        const edge = EDGE[tokens[tokens.length - 1].tone ?? 'plain'];
        return (
          <div key={i} style={{ position: 'relative', height: ROW_H, display: 'flex', alignItems: 'center', padding: '0 20px', opacity: p, transform: `translateX(${(1 - p) * -12}px)` }}>
            {l > 0.01 ? <div style={{ position: 'absolute', left: 8, right: 8, top: 3, bottom: 3, borderRadius: 8, background: alpha(edge, 0.15 * l), boxShadow: `inset 5px 0 0 ${alpha(edge, 0.9 * l)}` }} /> : null}
            <span style={{ position: 'relative', fontFamily: FONT.mono, fontSize: size, fontWeight: 700, whiteSpace: 'pre' }}>
              {tokens.map((tk, k) => (
                <span key={k} style={{ color: TONE[tk.tone ?? 'plain'], fontWeight: tk.tone === 'emerald' || tk.tone === 'rose' ? 800 : 700 }}>
                  {tk.t}
                </span>
              ))}
            </span>
          </div>
        );
      })}
    </div>
  );
}

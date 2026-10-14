import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { Icon } from '../../../../../engine/src/ui';
import type { LevelDef } from '../../../data/levels';
import { S02_OURS } from '../../../data/s02-niveles';
import { Confidence } from '../Lanes';

/** Each word in its own no-wrap span, so a line never breaks inside a hyphenated word («público-privada»). */
function words(text: string) {
  // The space stays OUTSIDE the spans: it is the only place a line may break.
  return text.split(' ').flatMap((w, i) => [
    i ? ' ' : '',
    <span key={i} style={{ whiteSpace: 'nowrap' }}>
      {w}
    </span>,
  ]);
}

/**
 * The detail of the band in focus: the evidence that unlocks the level (big), who usually reaches it and
 * the caveat (small), and its realistic confidence. It shows while the voice is on that band and then
 * leaves; the lane keeps the name and the confidence.
 */
export function EvidenceCard({ level, tone, width, show = 1, lines = 1, reach = 1, conf = 1 }: { level: LevelDef; tone: string; width: number; show?: number; lines?: number; reach?: number; conf?: number }) {
  if (show <= 0.001) return null;
  const n = level.evidence.length + (level.lead ? 1 : 0);
  const lineShow = (i: number) => Math.max(0, Math.min(1, lines * n - i));
  return (
    <div
      style={{
        width,
        boxSizing: 'border-box',
        padding: '20px 26px 22px',
        borderRadius: RADIUS.lg,
        border: `2px solid ${alpha(tone, 0.6)}`,
        background: `linear-gradient(180deg, ${alpha(tone, 0.1)} 0%, ${alpha(C.ink900, 0.97)} 46%), ${C.ink900}`,
        boxShadow: `0 20px 50px ${alpha('#000000', 0.45)}`,
        fontFamily: FONT.sans,
        opacity: show,
        transform: `translateX(${(1 - show) * 18}px)`,
      }}
    >
      {level.lead ? <div style={{ fontSize: 34, fontWeight: 850, lineHeight: 1.16, color: tone, opacity: lineShow(0) }}>{level.lead}</div> : null}
      {level.evidence.map((line, i) => (
        <div key={line} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, fontSize: level.lead ? 29 : 34, fontWeight: 750, lineHeight: 1.2, letterSpacing: -0.2, color: C.textStrong, opacity: lineShow(i + (level.lead ? 1 : 0)) }}>
          {level.lead ? <span style={{ flexShrink: 0, width: 10, height: 10, marginTop: 13, borderRadius: 5, background: alpha(tone, 0.8) }} /> : null}
          <span>{words(line)}</span>
        </div>
      ))}
      {level.note ? <div style={{ marginTop: 10, fontSize: 25, fontWeight: 700, lineHeight: 1.2, color: '#cbd5e1', textWrap: 'balance', opacity: reach }}>{words(level.note)}</div> : null}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 12, paddingTop: 12, borderTop: `2px solid ${alpha(C.faint, 0.45)}`, opacity: reach }}>
        <Icon name="users" size={28} color={C.muted} strokeWidth={2} style={{ flexShrink: 0, marginTop: 1 }} />
        <span style={{ fontSize: 25, fontWeight: 650, lineHeight: 1.2, color: C.muted, textWrap: 'balance' }}>{words(level.reach)}</span>
      </div>
      <Confidence level={level} size={28} show={conf} style={{ marginTop: 12 }} />
    </div>
  );
}

/** «tu caso: el programa y su servidor» — what you hold of Meridian, pinned over band 1 (cyan: your network). */
export function OursChip({ show = 1, glow = 0 }: { show?: number; glow?: number }) {
  if (show <= 0.001) return null;
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 12,
        height: 60,
        padding: '0 26px 0 20px',
        boxSizing: 'border-box',
        borderRadius: RADIUS.pill,
        border: `2px solid ${alpha(C.cyan, 0.85)}`,
        background: alpha('#083344', 0.95),
        boxShadow: `0 0 ${Math.round(12 + 22 * glow)}px ${alpha(C.cyan, 0.25 + 0.3 * glow)}`,
        fontFamily: FONT.sans,
        fontSize: 32,
        whiteSpace: 'nowrap',
        opacity: show,
        transform: `translateY(${(1 - show) * 12}px)`,
      }}
    >
      <Icon name="file" size={30} color={C.cyan} strokeWidth={2.2} />
      <span style={{ fontWeight: 700, color: C.cyanSoft }}>{S02_OURS.lead}</span>
      <span style={{ fontWeight: 850, color: C.textStrong }}>{S02_OURS.rest}</span>
    </div>
  );
}

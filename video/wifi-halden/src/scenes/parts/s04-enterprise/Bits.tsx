import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { Icon, clamp01, type IconName } from '../../../../../engine/src/ui';
import { CARNET as CARNET_TEXT, EXAMPLE, NAME, NEEDS } from '../../../data/s04-enterprise';
import { CarnetGlyph } from '../Glyphs';

/** Small pieces of s04. Every state is a 0–1 prop; nothing reads the timeline. */

const VIOLET_SOFT = '#c4b5fd';
const EMERALD_SOFT = '#6ee7b7';

/**
 * The example of the lost tablet, over the tablets: the dashed label «ejemplo · sin fecha» (it
 * stays to the end of the scene: the tablet under it is never a real one) and «si una tableta se
 * pierde» (`line`, which leaves when enterprise mode comes).
 */
export function LostExample({ x, right, y, label, line }: { x: number; right: number; y: number; label: number; line: number }) {
  const lb = clamp01(label);
  const ln = clamp01(line);
  if (lb <= 0.001) return null;
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: right - x, fontFamily: FONT.sans, whiteSpace: 'nowrap' }}>
      <span
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          display: 'inline-flex',
          alignItems: 'center',
          height: 40,
          padding: '0 16px',
          boxSizing: 'border-box',
          borderRadius: RADIUS.sm,
          border: `2px dashed ${alpha(C.muted, 0.9)}`,
          background: alpha(C.ink700, 0.6),
          fontSize: 30,
          fontWeight: 760,
          color: C.text,
          opacity: lb,
          transform: `translateY(${(1 - lb) * -8}px)`,
        }}
      >
        {EXAMPLE.label.join(' · ')}
      </span>
      <div style={{ position: 'absolute', left: 0, top: 48, fontSize: 46, fontWeight: 840, letterSpacing: -0.4, lineHeight: 1.1, color: C.textStrong, opacity: ln, transform: `translateY(${(1 - ln) * 10}px)` }}>{EXAMPLE.lost}</div>
    </div>
  );
}

/**
 * «El carné», big, with the two words the voice gives it: the card («carné») and its seal
 * («certificado»). Centred on (x, y) of the stage; `card`, `seal` 0–1.
 */
export function CarnetExplainer({ x, y, card, seal, out = 0 }: { x: number; y: number; card: number; seal: number; out?: number }) {
  const c = clamp01(card) * (1 - clamp01(out));
  if (c <= 0.001) return null;
  const sl = clamp01(seal);
  const H = 150;
  const sealAt = { x: x + 46 * 1.5, y: y + 24 * 1.5 };
  const textX = x + 168;
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, opacity: c, fontFamily: FONT.sans, whiteSpace: 'nowrap' }}>
      <svg width={1728} height={200} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        <CarnetGlyph x={x} y={y + (1 - c) * 10} h={H} seal={sl} glow={0.5} />
        {sl > 0.01 ? <line x1={sealAt.x + 26} y1={sealAt.y} x2={textX - 12} y2={sealAt.y} stroke={alpha(C.emerald, 0.8 * sl)} strokeWidth={4} strokeLinecap="round" strokeDasharray="4 9" /> : null}
      </svg>
      <div style={{ position: 'absolute', left: textX, top: y - 62, fontSize: 52, fontWeight: 880, letterSpacing: -0.5, lineHeight: 1.1, color: EMERALD_SOFT }}>{CARNET_TEXT.card}</div>
      <div style={{ position: 'absolute', left: textX, top: sealAt.y - 26, fontSize: 42, fontWeight: 800, lineHeight: 1.2, color: C.textStrong, opacity: sl, transform: `translateX(${(1 - sl) * -8}px)` }}>{CARNET_TEXT.seal}</div>
    </div>
  );
}

/**
 * The exam name and what stands under it: WPA3-ENTERPRISE, then
 * «802.1X · RADIUS (AAA) · autenticación, autorización y registro» (`sub`: one 0–1 per part).
 */
export function NameBlock({ x, y, show, sub, glow = 0 }: { x: number; y: number; show: number; sub: readonly number[]; glow?: number }) {
  const s = clamp01(show);
  if (s <= 0.001) return null;
  const g = clamp01(glow);
  const dot = (o: number) => <span style={{ margin: '0 14px', color: C.faint, opacity: o }}>·</span>;
  const part = (i: number) => clamp01(sub[i] ?? 0);
  return (
    <div style={{ position: 'absolute', left: x, top: y, fontFamily: FONT.sans, whiteSpace: 'nowrap' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 18, opacity: s, transform: `translateY(${(1 - s) * -10}px)` }}>
        <Icon name="mortarboard" size={60} color={C.violet} />
        <span style={{ fontSize: 64, fontWeight: 880, letterSpacing: 1, lineHeight: 1.05, color: VIOLET_SOFT, textShadow: `0 0 ${Math.round(8 + 22 * g)}px ${alpha(C.violet, 0.3 + 0.5 * g)}` }}>{NAME.term}</span>
      </div>
      <div style={{ marginTop: 14, display: 'flex', alignItems: 'baseline', fontSize: 38, fontWeight: 780, lineHeight: 1.2 }}>
        <span style={{ color: VIOLET_SOFT, fontWeight: 850, opacity: part(0) }}>{NAME.sub[0]}</span>
        {dot(part(1))}
        <span style={{ color: VIOLET_SOFT, fontWeight: 850, opacity: part(1) }}>{NAME.sub[1]}</span>
        {dot(part(2))}
        <span style={{ color: C.textStrong, opacity: part(2) }}>{NAME.sub[2]}</span>
      </div>
    </div>
  );
}

const NEED_ICON: readonly IconName[] = ['server', 'users', 'shield'];

/** What enterprise mode needs: three sky chips, right-aligned to `right`. */
export function NeedChips({ right, y, show, size = 34 }: { right: number; y: number; show: readonly number[]; size?: number }) {
  if (clamp01(show[0] ?? 0) <= 0.001) return null;
  return (
    <div style={{ position: 'absolute', right: 1728 - right, top: y, display: 'flex', gap: 14, fontFamily: FONT.sans, whiteSpace: 'nowrap' }}>
      {NEEDS.map((text, i) => {
        const s = clamp01(show[i] ?? 0);
        return (
          <span
            key={text}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              height: Math.round(size * 1.7),
              padding: `0 ${Math.round(size * 0.6)}px 0 ${Math.round(size * 0.44)}px`,
              boxSizing: 'border-box',
              borderRadius: RADIUS.pill,
              border: `2px solid ${alpha(C.sky, 0.75)}`,
              background: `linear-gradient(180deg, ${alpha(C.sky, 0.16)} 0%, ${alpha(C.ink900, 0.96)} 100%)`,
              boxShadow: `0 8px 20px ${alpha('#000000', 0.32)}`,
              fontSize: size,
              fontWeight: 820,
              color: C.textStrong,
              opacity: s,
              transform: `translateY(${(1 - s) * 10}px)`,
            }}
          >
            <Icon name={NEED_ICON[i]} size={Math.round(size * 1.02)} color={C.sky} strokeWidth={2.2} />
            {text}
          </span>
        );
      })}
    </div>
  );
}

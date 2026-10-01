import type { CSSProperties } from 'react';
import { C, FONT, alpha } from '../../../../../engine/src/theme/tokens';
import { Icon, type IconName } from '../../../../../engine/src/ui';
import type { BranchTag } from '../../../data/s03-ramas';
import { PE_CARD } from '../../../data/s03-ramas';

const SKY_SOFT = '#7dd3fc';

/** Tactic chip (sky = the TACTIC rung). */
export function TacticPill({ label, size = 28, glow = 0, style }: { label: string; size?: number; glow?: number; style?: CSSProperties }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: `${Math.round(size * 0.28)}px ${Math.round(size * 0.6)}px`,
        borderRadius: 999,
        border: `2px solid ${alpha(C.sky, 0.6 + 0.4 * glow)}`,
        background: alpha(C.sky, 0.12 + 0.18 * glow),
        boxShadow: glow > 0 ? `0 0 ${Math.round(24 * glow)}px ${alpha(C.sky, 0.4 * glow)}` : undefined,
        color: SKY_SOFT,
        fontFamily: FONT.sans,
        fontSize: size,
        fontWeight: 750,
        lineHeight: 1.1,
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {label}
    </span>
  );
}

/**
 * Technique tag beside a tree row. `expand` 1 = technique line, sub-technique
 * line and tactic chip (shifted by `shift` px so it clears its neighbours);
 * 0 = one compact line (short id + tactic chip). `techP` / `tacticP` reveal
 * the technique and the tactic with the voice.
 */
export function TechTag({
  tag,
  expand,
  techP,
  tacticP,
  shift = 0,
}: {
  tag: BranchTag;
  expand: number;
  techP: number;
  tacticP: number;
  shift?: number;
}) {
  if (techP <= 0) return null;
  return (
    <div style={{ position: 'relative', height: 0 }}>
      {/* Expanded */}
      {expand > 0.01 ? (
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            transform: `translateY(calc(-50% + ${shift * expand}px)) translateX(${(1 - techP) * 20}px)`,
            opacity: expand * techP,
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
            padding: '12px 20px 14px',
            borderRadius: 16,
            border: `2px solid ${alpha(C.cyan, 0.55)}`,
            background: alpha(C.ink900, 0.94),
            boxShadow: `0 16px 40px ${alpha('#000000', 0.4)}, 0 0 24px ${alpha(C.cyan, 0.18)}`,
            whiteSpace: 'nowrap',
            fontFamily: FONT.sans,
          }}
        >
          <div style={{ fontSize: 34, fontWeight: 800, color: C.textStrong, lineHeight: 1.15 }}>
            <span style={{ fontFamily: FONT.mono, color: C.cyan }}>{tag.id}</span> {tag.name}
          </div>
          {tag.sub ? <div style={{ fontSize: 30, fontWeight: 650, color: C.cyanSoft, lineHeight: 1.15 }}>{tag.sub}</div> : null}
          <div style={{ height: 50 * tacticP, overflow: 'hidden', marginTop: 4 * tacticP, opacity: tacticP }}>
            <TacticPill label={tag.tactic} size={30} glow={tacticP * expand} />
          </div>
        </div>
      ) : null}
      {/* Compact */}
      {expand < 0.99 ? (
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            transform: 'translateY(-50%)',
            opacity: (1 - expand) * techP,
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            whiteSpace: 'nowrap',
          }}
        >
          <span style={{ fontFamily: FONT.mono, fontSize: 30, fontWeight: 800, color: C.cyan }}>{tag.short}</span>
          <TacticPill label={tag.tactic} size={26} />
        </div>
      ) : null}
    </div>
  );
}

/** PE header card: the on-disk name struck through, the original name kept. */
export function PeCard({ appear, strike, dim }: { appear: number; strike: number; dim: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 34, opacity: appear * (1 - 0.55 * dim), transform: `translateY(${(1 - appear) * 16}px)` }}>
      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          gap: 28,
          height: 84,
          padding: '0 28px',
          borderRadius: 16,
          border: `2px solid ${alpha(C.sky, 0.55)}`,
          background: alpha(C.ink900, 0.95),
          boxShadow: `0 16px 40px ${alpha('#000000', 0.4)}`,
          whiteSpace: 'nowrap',
        }}
      >
        <span
          style={{
            position: 'absolute',
            left: 22,
            top: -15,
            padding: '0 10px',
            background: C.ink900,
            fontFamily: FONT.sans,
            fontSize: 22,
            fontWeight: 750,
            letterSpacing: 1.5,
            color: C.muted,
          }}
        >
          {PE_CARD.title.toUpperCase()}
        </span>
        <Icon name="file" size={34} color={C.sky} />
        <span style={{ position: 'relative', fontFamily: FONT.mono, fontSize: 32, fontWeight: 700, color: strike > 0.5 ? C.muted : C.text }}>
          {PE_CARD.onDisk}
          <span
            style={{
              position: 'absolute',
              left: -4,
              top: '52%',
              height: 4,
              width: `calc(${strike * 100}% + 8px)`,
              background: C.rose,
              borderRadius: 2,
            }}
          />
        </span>
        <div style={{ width: 2, alignSelf: 'stretch', margin: '16px 0', background: C.ink700 }} />
        <span style={{ fontFamily: FONT.mono, fontSize: 32, fontWeight: 700, color: C.textStrong }}>
          <span style={{ color: C.muted, fontWeight: 500 }}>OriginalFileName: </span>
          <span style={{ color: SKY_SOFT }}>CertUtil.exe</span>
        </span>
      </div>
      <span style={{ fontFamily: FONT.sans, fontSize: 40, fontWeight: 800, color: SKY_SOFT, whiteSpace: 'nowrap', opacity: strike }}>{PE_CARD.label}</span>
    </div>
  );
}

/** One generic reader of the shared technique number. */
export function ReaderCard({ icon, label, value, appear, width }: { icon: IconName; label: string; value: string; appear: number; width: number }) {
  return (
    <div
      style={{
        width,
        height: 92,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        gap: 22,
        padding: '0 28px',
        borderRadius: 18,
        border: `2px solid ${C.ink600}`,
        background: alpha(C.ink850, 0.95),
        opacity: appear,
        transform: `translateX(${(1 - appear) * 30}px)`,
        whiteSpace: 'nowrap',
      }}
    >
      <Icon name={icon} size={44} color={C.muted} />
      <span style={{ fontFamily: FONT.sans, fontSize: 40, fontWeight: 750, color: C.text }}>{label}</span>
      <span style={{ marginLeft: 'auto', fontFamily: FONT.sans, fontSize: 28, color: C.faint }}>lee</span>
      <span style={{ fontFamily: FONT.mono, fontSize: 40, fontWeight: 800, color: C.cyan }}>{value}</span>
    </div>
  );
}

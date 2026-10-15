import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { Chip, Icon, type IconName } from '../../../../../engine/src/ui';
import { PAIN_LABEL, SLOTS, ZERO } from '../../../data/s02-negocio';

export const CARD = { w: 820, h: 392 } as const;
const PAD_X = 28;
const INNER_W = CARD.w - 2 * PAD_X;
const VALUE_W = 280;

/** What the card shows at one moment; every number is a 0–1 weight. */
export interface ProcessCardView {
  dept: string;
  name: string;
  icon: IconName;
  /** Focus glow of the card. */
  lit: number;
  /** The two slots are being asked (cyan). */
  ask: readonly [number, number];
  /** «cero minutos» written in the first slot, and cleared again. */
  zero: number;
  zeroOut: number;
  /** The pain label is lit, and how far the bar has grown (already multiplied by the card's own level). */
  painOn: number;
  pain: number;
  /** Chip under the intercepted message («más capacidad»), and the BIA's order chip (`holdsText`). */
  capacity: number;
  capacityText: string;
  holds: number;
  holdsText: string;
}

/** One question slot: its label, and a box that waits (dashed), is asked (cyan), or is written «cero minutos» (rose). */
function Slot({ label, ask, zero, zeroOut }: { label: string; ask: number; zero: number; zeroOut: number }) {
  const z = zero * (1 - zeroOut);
  const border = z > 0.02 ? alpha(C.rose, 0.4 + 0.5 * z) : ask > 0.02 ? alpha(C.cyan, 0.4 + 0.5 * ask) : alpha(C.ink600, 0.95);
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 58 }}>
      <span style={{ fontSize: 32, fontWeight: 650, color: C.text, opacity: 0.55 + 0.45 * Math.max(ask, z) }}>{label}</span>
      <div
        style={{
          position: 'relative',
          width: VALUE_W,
          height: 54,
          boxSizing: 'border-box',
          display: 'grid',
          placeItems: 'center',
          borderRadius: RADIUS.md,
          border: `2px ${z > 0.02 || ask > 0.02 ? 'solid' : 'dashed'} ${border}`,
          background: z > 0.02 ? alpha(C.rose, 0.12 * z) : alpha(C.cyan, 0.1 * ask),
          boxShadow: z > 0.02 ? `0 0 ${Math.round(20 * z)}px ${alpha(C.rose, 0.3 * z)}` : ask > 0.02 ? `0 0 ${Math.round(18 * ask)}px ${alpha(C.cyan, 0.25 * ask)}` : undefined,
          fontFamily: FONT.sans,
          fontSize: 32,
          fontWeight: 800,
          color: z > 0.02 ? C.roseSoft : C.cyanSoft,
        }}
      >
        {z > 0.02 ? <span style={{ opacity: z }}>{ZERO}</span> : <span style={{ opacity: 0.35 + 0.65 * ask }}>?</span>}
        {zeroOut > 0.02 && zeroOut < 0.98 ? <div style={{ position: 'absolute', left: 14, right: 14, top: '50%', height: 3, background: C.roseSoft, opacity: 1 - zeroOut }} /> : null}
      </div>
    </div>
  );
}

/**
 * A process card: the department chip and the process's name, the two slots (what it holds, how much data it can
 * lose) and the bar «cuánto duele cada hora parado» that grows without a figure. Frames are the scene's job: the card
 * only draws the weights it is given. Absolute positioning is the caller's.
 */
export function ProcessCard({ view }: { view: ProcessCardView }) {
  const v = view;
  return (
    <div
      style={{
        position: 'relative',
        width: CARD.w,
        height: CARD.h,
        boxSizing: 'border-box',
        padding: `22px ${PAD_X}px 22px`,
        borderRadius: RADIUS.lg,
        border: `${v.lit > 0.3 ? 3 : 2}px solid ${alpha(C.cyan, 0.3 + 0.5 * v.lit)}`,
        background: `linear-gradient(180deg, ${alpha(C.cyan, 0.05 + 0.07 * v.lit)} 0%, ${C.ink900} 60%)`,
        boxShadow: v.lit > 0.02 ? `0 0 ${Math.round(38 * v.lit)}px ${alpha(C.cyan, 0.26 * v.lit)}` : `0 20px 50px ${alpha('#000000', 0.3)}`,
        fontFamily: FONT.sans,
      }}
    >
      {/* Department and the chips that come later (capacity under the intercept, the BIA's order) */}
      <div style={{ position: 'relative', height: 56 }}>
        <Chip accent="cyan" icon={v.icon} size={32}>
          {v.dept}
        </Chip>
        <div style={{ position: 'absolute', right: 0, top: 0, opacity: v.capacity * (1 - v.holds) }}>
          <Chip accent="rose" icon="layers" size={32}>
            {v.capacityText}
          </Chip>
        </div>
        <div style={{ position: 'absolute', right: 0, top: 0, opacity: v.holds, transform: `translateY(${(1 - v.holds) * 8}px)` }}>
          <Chip accent="cyan" icon="clock" size={32} solid>
            {v.holdsText}
          </Chip>
        </div>
      </div>
      <div style={{ marginTop: 8, fontSize: 36, fontWeight: 800, letterSpacing: -0.5, color: C.textStrong, whiteSpace: 'nowrap' }}>{v.name}</div>

      <div style={{ marginTop: 14, width: INNER_W }}>
        <Slot label={SLOTS[0].label} ask={v.ask[0]} zero={v.zero} zeroOut={v.zeroOut} />
        <div style={{ height: 10 }} />
        <Slot label={SLOTS[1].label} ask={v.ask[1]} zero={0} zeroOut={0} />
      </div>

      {/* The pain: a bar that grows, no figure */}
      <div style={{ marginTop: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 32, fontWeight: 650, color: C.text, opacity: 0.5 + 0.5 * v.painOn }}>
          <Icon name="chart" size={30} color={C.amber} />
          {PAIN_LABEL}
        </div>
        <div style={{ marginTop: 10, width: INNER_W, height: 24, borderRadius: 12, boxSizing: 'border-box', border: `2px solid ${alpha(C.ink600, 0.9)}`, background: alpha(C.ink950, 0.8), overflow: 'hidden' }}>
          <div
            style={{
              width: `${Math.round(100 * v.pain)}%`,
              height: '100%',
              borderRadius: 10,
              background: `linear-gradient(90deg, ${alpha(C.amber, 0.85)} 0%, ${alpha(C.rose, 0.95)} 100%)`,
              boxShadow: `0 0 16px ${alpha(C.rose, 0.35)}`,
            }}
          />
        </div>
      </div>
    </div>
  );
}

/** The dashed outline that waits where a card will land. */
export function CardSlot({ show = 1 }: { show?: number }) {
  return (
    <div style={{ width: CARD.w, height: CARD.h, boxSizing: 'border-box', borderRadius: RADIUS.lg, border: `2px dashed ${alpha(C.ink600, 0.85)}`, opacity: show }} />
  );
}

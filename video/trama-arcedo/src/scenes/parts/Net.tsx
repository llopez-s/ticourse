/**
 * Network drawing bits shared by the scenes of «VLAN y 802.1Q» — always drawn in code, never taken from the art.
 *   Switch       a switch seen from the front, one socket per port; each port has its own tone and light
 *   switchPortX  x of a port's centre inside the switch (to hang lanes, cables and frames from it)
 *   Device       a small tile for an end device (puesto / servidor / teléfono / anything with an engine icon)
 *   FrameGlyph   an Ethernet frame as a short bar, with an optional 802.1Q tag segment (s04 lights it)
 */
import { C, FONT, RADIUS, alpha } from '../../../../engine/src/theme/tokens';
import { Icon, clamp01, type IconName } from '../../../../engine/src/ui';

export interface SwitchPort {
  /** Colour of the port (its VLAN, or neutral sky before VLANs exist). */
  tone?: string;
  /** 0–1: how lit the port is. */
  on?: number;
}

export const SWITCH_PAD = 26;

/** Centre x of port `i` of `n`, in the switch's own coordinates. */
export function switchPortX(i: number, n: number, width: number): number {
  const inner = width - 2 * SWITCH_PAD;
  return SWITCH_PAD + (inner * (i + 0.5)) / n;
}

/** A switch seen from the front. Ports sit on the lower half, a status LED above each. */
export function Switch({ width, height = 92, ports, glow = 0 }: { width: number; height?: number; ports: readonly SwitchPort[]; glow?: number }) {
  const n = ports.length;
  const pw = Math.min(58, ((width - 2 * SWITCH_PAD) / n) * 0.5);
  const ph = Math.round(height * 0.42);
  const g = clamp01(glow);
  return (
    <div
      style={{
        position: 'relative',
        width,
        height,
        boxSizing: 'border-box',
        borderRadius: RADIUS.md,
        border: `3px solid ${alpha(C.sky, 0.55 + 0.35 * g)}`,
        background: `linear-gradient(${C.ink800}, ${C.ink850})`,
        boxShadow: `0 10px 30px ${alpha(C.ink950, 0.7)}${g > 0.02 ? `, 0 0 ${Math.round(30 * g)}px ${alpha(C.sky, 0.3 * g)}` : ''}`,
      }}
    >
      {ports.map((p, i) => {
        const tone = p.tone ?? C.sky;
        const on = clamp01(p.on ?? 0);
        const cx = switchPortX(i, n, width) - 3; // minus the border
        return (
          <div key={i}>
            {/* LED */}
            <div
              style={{
                position: 'absolute',
                left: cx - 5,
                top: Math.round(height * 0.16),
                width: 10,
                height: 10,
                borderRadius: 5,
                background: alpha(tone, 0.35 + 0.65 * on),
                boxShadow: on > 0.05 ? `0 0 ${Math.round(12 * on)}px ${alpha(tone, 0.8 * on)}` : undefined,
              }}
            />
            {/* socket */}
            <div
              style={{
                position: 'absolute',
                left: cx - pw / 2,
                top: height - ph - Math.round(height * 0.16) - 3,
                width: pw,
                height: ph,
                boxSizing: 'border-box',
                borderRadius: 7,
                border: `3px solid ${alpha(tone, 0.55 + 0.45 * on)}`,
                background: on > 0.02 ? alpha(tone, 0.1 + 0.2 * on) : C.ink950,
              }}
            >
              <div style={{ position: 'absolute', left: '28%', right: '28%', bottom: 0, height: '30%', background: alpha(tone, 0.4 + 0.4 * on), borderRadius: '4px 4px 0 0' }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

/** A desk phone (the engine has no phone icon): base, keypad and handset, stroked like the engine's icons. */
export function PhoneGlyph({ size = 36, color = C.sky }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <rect x="8.5" y="6.5" width="12" height="13" rx="2" />
      <rect x="3.5" y="4.5" width="4" height="15" rx="2" />
      <path d="M12 10h5M12 13.5h.01M14.5 13.5h.01M17 13.5h.01M12 16.5h.01M14.5 16.5h.01M17 16.5h.01" />
    </svg>
  );
}

/**
 * An end device as a tile with an engine icon (`icon: 'phone'` draws PhoneGlyph). `on` 0–1 lights it (a frame has
 * just arrived).
 */
export function Device({ icon = 'desktop', tone = C.sky, size = 64, on = 0 }: { icon?: IconName | 'phone'; tone?: string; size?: number; on?: number }) {
  const o = clamp01(on);
  return (
    <div
      style={{
        width: size,
        height: size,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: RADIUS.sm + 2,
        border: `3px solid ${alpha(tone, 0.5 + 0.5 * o)}`,
        background: o > 0.02 ? alpha(tone, 0.08 + 0.2 * o) : C.ink900,
        boxShadow: o > 0.05 ? `0 0 ${Math.round(22 * o)}px ${alpha(tone, 0.5 * o)}` : undefined,
      }}
    >
      {icon === 'phone' ? (
        <PhoneGlyph size={Math.round(size * 0.58)} color={alpha(tone, 0.75 + 0.25 * o)} />
      ) : (
        <Icon name={icon} size={Math.round(size * 0.58)} color={alpha(tone, 0.75 + 0.25 * o)} />
      )}
    </div>
  );
}

/**
 * An Ethernet frame as a short bar: destination · source · [802.1Q tag] · data. Without `tag` it is an untagged
 * frame. `tag.label` is the VLAN number written on the tag (engine text); `tag.on` 0–1 lights it.
 */
export function FrameGlyph({
  width = 64,
  height = 26,
  tone = C.cyanSoft,
  tag,
  glow = 0.6,
}: {
  width?: number;
  height?: number;
  tone?: string;
  tag?: { label?: string; tone: string; on?: number };
  glow?: number;
}) {
  const seg = (flex: number, fill: string, key: string) => <div key={key} style={{ flex, background: fill }} />;
  const tagOn = clamp01(tag?.on ?? 1);
  return (
    <div
      style={{
        width,
        height,
        boxSizing: 'border-box',
        display: 'flex',
        gap: 2,
        padding: 2,
        borderRadius: 6,
        border: `2px solid ${tone}`,
        background: C.ink950,
        boxShadow: glow > 0.02 ? `0 0 ${Math.round(18 * glow)}px ${alpha(tone, 0.6 * glow)}` : undefined,
      }}
    >
      {seg(1, alpha(tone, 0.9), 'dst')}
      {seg(1, alpha(tone, 0.55), 'src')}
      {tag ? (
        <div
          key="tag"
          style={{
            flex: tag.label ? 1.6 : 0.8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: alpha(tag.tone, 0.35 + 0.65 * tagOn),
            fontFamily: FONT.mono,
            fontSize: Math.round(height * 0.62),
            fontWeight: 800,
            color: C.ink950,
            lineHeight: 1,
          }}
        >
          {tag.label}
        </div>
      ) : null}
      {seg(2.4, alpha(tone, 0.3), 'data')}
    </div>
  );
}

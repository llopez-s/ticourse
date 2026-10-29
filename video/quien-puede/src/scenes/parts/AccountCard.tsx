import { C, FONT, RADIUS, alpha } from '../../../../engine/src/theme/tokens';
import { Icon, clamp01 } from '../../../../engine/src/ui';
import { ACCOUNT_LABEL, SERVICE_ACCOUNT } from './data';

/**
 * The account as a tag («ficha»): one component, two looks.
 *  - `person`: «tu cuenta», cyan, a key badge. No name, no gender, no face, no drawing of a person.
 *  - `service`: `svc_resumen`, a gear (never the user icon), mono font, with the two marks of s06 («no es de una
 *    persona · sin inicio de sesión interactivo», «responsable: Sistemas»), each shown by its own 0–1 weight.
 * `on` 0–1 brightens the border/glow (the voice is on it); `dim` 0–1 steps it back.
 */
export function AccountCard({
  kind = 'person',
  width,
  label,
  on = 0,
  dim = 0,
  noLogin = 0,
  owner = 0,
  compact = false,
  tone,
}: {
  kind?: 'person' | 'service';
  width?: number;
  label?: string;
  on?: number;
  dim?: number;
  /** service: weight of the «no es de una persona · sin inicio de sesión interactivo» mark. */
  noLogin?: number;
  /** service: weight of the «responsable: Sistemas» mark. */
  owner?: number;
  compact?: boolean;
  /** Overrides the colour (cyan by default; amber for «sin permiso» states are drawn by the scene). */
  tone?: string;
}) {
  const service = kind === 'service';
  const col = tone ?? (service ? C.sky : C.cyan);
  const g = clamp01(on);
  const d = clamp01(dim);
  const text = label ?? (service ? SERVICE_ACCOUNT.name : ACCOUNT_LABEL);
  const icon = service ? 'gear' : 'key';
  const w = width ?? (service ? 600 : compact ? 330 : 440);
  const badge = compact ? 60 : 76;
  const nl = clamp01(noLogin);
  const ow = clamp01(owner);
  return (
    <div
      style={{
        width: w,
        boxSizing: 'border-box',
        position: 'relative',
        padding: compact ? '14px 22px' : '18px 26px',
        borderRadius: RADIUS.lg,
        background: `linear-gradient(180deg, ${alpha(col, 0.14)} 0%, ${alpha(C.ink900, 0.96)} 70%)`,
        border: `3px solid ${alpha(col, 0.5 + 0.45 * g)}`,
        boxShadow: g > 0.02 ? `0 0 ${Math.round(36 * g)}px ${alpha(col, 0.36 * g)}` : `0 18px 40px ${alpha('#000000', 0.35)}`,
        fontFamily: FONT.sans,
        opacity: 1 - 0.55 * d,
        filter: d > 0.01 ? `saturate(${1 - 0.5 * d})` : undefined,
      }}
    >
      {/* the lanyard hole of a tag */}
      <div style={{ position: 'absolute', left: '50%', top: -7, width: 54, height: 14, marginLeft: -27, borderRadius: 7, background: C.ink950, border: `3px solid ${alpha(col, 0.7)}` }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: compact ? 16 : 22 }}>
        <div style={{ width: badge, height: badge, borderRadius: badge / 2, flexShrink: 0, display: 'grid', placeItems: 'center', background: alpha(col, 0.16), border: `3px solid ${alpha(col, 0.8)}` }}>
          <Icon name={icon} size={Math.round(badge * 0.58)} color={col} strokeWidth={2.2} />
        </div>
        <div
          style={{
            fontSize: compact ? 38 : 46,
            fontWeight: 850,
            color: C.textStrong,
            fontFamily: service ? FONT.mono : FONT.sans,
            letterSpacing: service ? -1 : -0.5,
            whiteSpace: 'nowrap',
          }}
        >
          {text}
        </div>
      </div>
      {service && (nl > 0.01 || ow > 0.01) ? (
        <div style={{ marginTop: 16, display: 'grid', gap: 10 }}>
          <Mark text={SERVICE_ACCOUNT.note} icon="unplug" tone={C.amber} weight={nl} />
          <Mark text={SERVICE_ACCOUNT.login} icon="unplug" tone={C.amber} weight={nl} />
          <Mark text={SERVICE_ACCOUNT.owner} icon="shield" tone={C.cyan} weight={ow} />
        </div>
      ) : null}
    </div>
  );
}

function Mark({ text, icon, tone, weight }: { text: string; icon: 'unplug' | 'shield'; tone: string; weight: number }) {
  if (weight < 0.01) return null;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 30, fontWeight: 700, color: C.text, opacity: weight, transform: `translateX(${(1 - weight) * -14}px)`, whiteSpace: 'nowrap' }}>
      <Icon name={icon} size={32} color={tone} />
      {text}
    </div>
  );
}

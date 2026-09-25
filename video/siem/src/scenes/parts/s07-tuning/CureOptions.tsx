import { ACCENT, C, FONT, RADIUS, TYPE, alpha } from '../../../theme/tokens';
import { EASE, enter, progress } from '../../../theme/motion';
import { Icon, type IconName } from '../../../ui';
import { mixColor } from './timing';

const ROW_H = 112;
const GAP = 22;

function Option({
  frame,
  top,
  icon,
  label,
  sub,
  enterAt,
  verdictAt,
  good,
}: {
  frame: number;
  top: number;
  icon: IconName;
  label: string;
  sub?: string;
  enterAt: number;
  verdictAt: number;
  good: boolean;
}) {
  const v = progress(frame, verdictAt, 12, EASE.out);
  const accent = good ? ACCENT.emerald : ACCENT.rose;
  const tone = mixColor(C.ink700, accent.fg, v);
  const strike = good ? 0 : progress(frame, verdictAt, 10, EASE.inOut);
  const intro = enter(frame, enterAt, { distance: 22, duration: 14 });
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top,
        height: ROW_H,
        display: 'flex',
        alignItems: 'center',
        gap: 24,
        padding: '0 30px',
        borderRadius: RADIUS.lg,
        background: good ? alpha(C.emerald, 0.1 * v) : alpha(C.ink850, 0.9),
        border: `2px solid ${good ? tone : mixColor(C.ink700, C.rose, 0.5 * v)}`,
        boxShadow: good && v > 0 ? `0 0 ${36 * v}px ${alpha(C.emerald, 0.3 * v)}` : 'none',
        opacity: intro.opacity * (good ? 1 : 1 - 0.45 * v),
        transform: intro.transform,
      }}
    >
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: 16,
          display: 'grid',
          placeItems: 'center',
          background: alpha(good ? C.emerald : C.muted, good ? 0.08 + 0.1 * v : 0.08),
          border: `2px solid ${alpha(good ? C.emerald : C.muted, good ? 0.25 + 0.5 * v : 0.25)}`,
          flexShrink: 0,
        }}
      >
        <Icon name={icon} size={36} color={good ? mixColor(C.muted, C.emerald, v) : C.muted} />
      </div>
      <div style={{ position: 'relative', whiteSpace: 'nowrap' }}>
        <span style={{ fontFamily: FONT.sans, fontSize: TYPE.h3, fontWeight: 800, color: good ? C.textStrong : C.text }}>{label}</span>
        {sub ? (
          <span style={{ fontFamily: FONT.sans, fontSize: TYPE.label, fontWeight: 650, color: ACCENT.emerald.soft, marginLeft: 18, opacity: v }}>
            {sub}
          </span>
        ) : null}
        {!good ? (
          <div
            style={{
              position: 'absolute',
              left: -6,
              top: '52%',
              height: 5,
              width: `calc(${strike * 100}% + ${12 * strike}px)`,
              borderRadius: 3,
              background: C.rose,
            }}
          />
        ) : null}
      </div>
      <div style={{ flex: 1 }} />
      {v > 0 ? (
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 24,
            display: 'grid',
            placeItems: 'center',
            background: good ? C.emerald : alpha(C.rose, 0.18),
            border: good ? 'none' : `2px solid ${alpha(C.rose, 0.7)}`,
            transform: `scale(${0.6 + 0.4 * v})`,
            opacity: v,
          }}
        >
          <Icon name={good ? 'check' : 'x'} size={28} color={good ? C.ink950 : C.rose} strokeWidth={3} />
        </div>
      ) : null}
    </div>
  );
}

/**
 * "La cura no es más gente ni otra herramienta: es afinar." Three options, the
 * first two struck out as they are named, the third lit emerald.
 */
export function CureOptions({
  frame,
  top,
  gente,
  herramienta,
  afinar,
}: {
  frame: number;
  top: number;
  gente: number;
  herramienta: number;
  afinar: number;
}) {
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, top, height: 3 * ROW_H + 2 * GAP + 56 }}>
      <div
        style={{
          fontFamily: FONT.sans,
          fontSize: TYPE.label,
          fontWeight: 750,
          color: C.muted,
          letterSpacing: 1.5,
          marginLeft: 6,
          lineHeight: 1,
          ...enter(frame, 2, { distance: 12, duration: 12 }),
        }}
      >
        ¿LA CURA?
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 56 }}>
        <Option frame={frame} top={0} icon="users" label="Más gente" enterAt={4} verdictAt={gente + 2} good={false} />
        <Option frame={frame} top={ROW_H + GAP} icon="app" label="Otra herramienta" enterAt={8} verdictAt={herramienta + 4} good={false} />
        <Option
          frame={frame}
          top={2 * (ROW_H + GAP)}
          icon="gear"
          label="Afinar"
          sub="alert tuning"
          enterAt={12}
          verdictAt={afinar}
          good
        />
      </div>
    </div>
  );
}

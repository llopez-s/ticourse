import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { EASE, progress, springIn } from '../../../../../engine/src/theme/motion';
import { Chip, Cursor, Icon, Panel, clamp01 } from '../../../../../engine/src/ui';
import { CONSOLE, DRILL, ORDER } from '../../../data/s03-simulacro';
import { WayChip } from '../TwoWays';

/**
 * s03's EDR console on the test laptop. The deputy presses «Aislar equipo»
 * and the console refuses (rose: the one refusal of the video); then the
 * on-call analyst presses it, by the deputy's order, and the laptop is
 * isolated (emerald). Nobody is blamed: the refusal names the role, not the
 * person. Frames are Sequence-relative; layout is console-local.
 */

export interface ConsoleTimes {
  /** The deputy's click. */
  clickAt: number;
  /** The analyst takes over (operator chip switches). */
  analystAt: number;
  /** The analyst's click: the laptop is isolated. */
  isolateAt: number;
  /** «por orden de la suplente» under the isolation. */
  orderAt: number;
}

const HEAD = 64;
const BUTTON = { w: 330, h: 84, top: 22 } as const;

export function EdrConsole({ frame, fps, width = 1240, height = 400, t, glow = 0 }: { frame: number; fps: number; width?: number; height?: number; t: ConsoleTimes; glow?: number }) {
  const denied = springIn(frame, fps, t.clickAt + 6, { damping: 14 });
  const analyst = progress(frame, t.analystAt, 12);
  const isolated = progress(frame, t.isolateAt + 4, 12);
  const deniedOut = progress(frame, t.isolateAt, 10, EASE.inOut);
  const press = (at: number) => clamp01(1 - Math.abs(frame - at - 2) / 5);
  const pressed = Math.max(press(t.clickAt), press(t.isolateAt));
  const btn = { x: width - BUTTON.w - 36, y: BUTTON.top };
  const target = { x: btn.x + BUTTON.w * 0.86, y: HEAD + btn.y + BUTTON.h * 0.72 };
  return (
    <div style={{ position: 'relative', width, height, fontFamily: FONT.sans }}>
      <Panel
        title={`${CONSOLE.title} · ${DRILL.vlan}`}
        icon="shield"
        accent="cyan"
        glow={glow}
        style={{ width, height }}
        right={
          <div style={{ position: 'relative', height: 44, width: 420, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
            <span style={{ position: 'absolute', right: 0, opacity: 1 - analyst }}>
              <WayChip tone="sky" icon="user" size={26}>
                {CONSOLE.deputy}
              </WayChip>
            </span>
            <span style={{ position: 'absolute', right: 0, opacity: analyst }}>
              <Chip accent="cyan" icon="user" size={26}>
                {CONSOLE.analyst}
              </Chip>
            </span>
          </div>
        }
      >
        {/* The test laptop */}
        <div style={{ position: 'absolute', left: 32, top: 26, height: 80, display: 'flex', alignItems: 'center', gap: 20, whiteSpace: 'nowrap' }}>
          <div style={{ position: 'relative' }}>
            <Icon name="laptop" size={68} color={isolated > 0.5 ? C.emerald : C.cyan} strokeWidth={1.8} />
            {isolated > 0.01 ? (
              <div style={{ position: 'absolute', right: -14, bottom: -8, width: 36, height: 36, borderRadius: 18, display: 'grid', placeItems: 'center', background: C.emerald, opacity: isolated, transform: `scale(${0.6 + 0.4 * isolated})` }}>
                <Icon name="lock" size={22} color={C.ink950} strokeWidth={2.4} />
              </div>
            ) : null}
          </div>
          <span style={{ fontFamily: FONT.mono, fontSize: 50, fontWeight: 800, color: C.textStrong }}>{DRILL.host}</span>
          <span style={{ position: 'relative', display: 'inline-block', width: 220, height: 44 }}>
            <span style={{ position: 'absolute', left: 0, top: 0, opacity: 1 - isolated }}>
              <Chip accent="cyan" size={28}>
                {CONSOLE.online}
              </Chip>
            </span>
            <span style={{ position: 'absolute', left: 0, top: 0, opacity: isolated }}>
              <Chip accent="emerald" icon="lock" size={28}>
                {CONSOLE.isolated}
              </Chip>
            </span>
          </span>
        </div>

        {/* «Aislar equipo» */}
        <div
          style={{
            position: 'absolute',
            left: btn.x,
            top: btn.y,
            width: BUTTON.w,
            height: BUTTON.h,
            boxSizing: 'border-box',
            borderRadius: RADIUS.md,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 14,
            border: `3px solid ${alpha(isolated > 0.5 ? C.emerald : C.cyan, 0.85)}`,
            background: alpha(isolated > 0.5 ? C.emerald : C.cyan, 0.1 + 0.25 * pressed),
            transform: `scale(${1 - 0.05 * pressed})`,
            fontSize: 38,
            fontWeight: 800,
            color: C.textStrong,
            whiteSpace: 'nowrap',
          }}
        >
          <Icon name="lock" size={38} color={isolated > 0.5 ? C.emerald : C.cyan} strokeWidth={2.2} />
          {CONSOLE.button}
        </div>

        {/* The refusal (rose), then the isolation (emerald), in the same slot */}
        {denied > 0.001 && deniedOut < 1 ? (
          <Result tone={C.rose} icon="x" title={CONSOLE.denied} sub={CONSOLE.deniedWhy} titleColor={C.roseSoft} p={denied} out={deniedOut} />
        ) : null}
        {isolated > 0.001 ? <Result tone={C.emerald} icon="lock" title={`${DRILL.host} ${CONSOLE.isolated}`} mono sub={ORDER} subP={progress(frame, t.orderAt, 12)} titleColor="#6ee7b7" p={isolated} out={0} /> : null}
      </Panel>
      <div style={{ position: 'absolute', left: 0, top: 0, width, height, pointerEvents: 'none' }}>
        <Cursor
          frame={frame}
          path={[
            { x: width * 0.52, y: height * 0.8, at: t.clickAt - 24 },
            { x: target.x, y: target.y, at: t.clickAt, click: true },
            { x: target.x - 60, y: target.y + 120, at: t.clickAt + 40 },
            { x: target.x, y: target.y, at: t.isolateAt, click: true },
            { x: target.x + 40, y: target.y + 110, at: t.isolateAt + 40 },
          ]}
        />
      </div>
    </div>
  );
}

function Result({ tone, icon, title, sub, subP = 1, titleColor, p, out, mono = false }: { tone: string; icon: 'x' | 'lock'; title: string; sub: string; subP?: number; titleColor: string; p: number; out: number; mono?: boolean }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: 32,
        right: 32,
        top: 136,
        height: 170,
        boxSizing: 'border-box',
        borderRadius: RADIUS.md,
        border: `3px solid ${alpha(tone, 0.8)}`,
        background: `linear-gradient(90deg, ${alpha(tone, 0.16)} 0%, ${alpha(C.ink900, 0.95)} 70%)`,
        boxShadow: `0 0 ${Math.round(34 * Math.min(1, p))}px ${alpha(tone, 0.3)}`,
        display: 'flex',
        alignItems: 'center',
        gap: 28,
        padding: '0 34px',
        opacity: Math.min(1, p * 1.4) * (1 - out),
        transform: `translateY(${(1 - Math.min(1, p)) * 16}px) scale(${0.97 + 0.03 * Math.min(1, p)})`,
      }}
    >
      <div style={{ width: 96, height: 96, borderRadius: 48, flexShrink: 0, display: 'grid', placeItems: 'center', background: alpha(tone, 0.16), border: `3px solid ${alpha(tone, 0.9)}` }}>
        <Icon name={icon} size={56} color={tone} strokeWidth={2.6} />
      </div>
      <div style={{ whiteSpace: 'nowrap' }}>
        <div style={{ fontFamily: mono ? FONT.mono : FONT.sans, fontSize: 52, fontWeight: 850, color: titleColor, letterSpacing: mono ? 0 : -0.5 }}>{title}</div>
        <div style={{ marginTop: 6, fontSize: 38, fontWeight: 700, color: C.text, opacity: subP, transform: `translateY(${(1 - subP) * 8}px)` }}>{sub}</div>
      </div>
    </div>
  );
}

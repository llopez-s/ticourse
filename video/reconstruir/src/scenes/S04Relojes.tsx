import type { ReactNode } from 'react';
import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, fadeOut, progress } from '../../../engine/src/theme/motion';
import { Icon, focusWeights } from '../../../engine/src/ui';
import { Stage } from './kit';
import { CLOCKS, type ClockId } from './parts/data';
import { CaseStamp } from './parts/CaseStamp';
import { ClockChip, RULER, RulerLine, SourceTag, naiveSlot } from './parts/Ruler';

// ---- Layout (stage-local). Everything sits below y = 230: the think prompt owns the top-centre at the end.
const BAND_Y = 238;
const CHIP_Y = 332;
const LINE_Y = 442;
const TAG_Y = 464;
const CALL_Y = 518;

/** Which chips each callout is about. */
const FOCUS: ClockId[][] = [['proxy', 'edr1', 'edr2'], ['fw'], ['login']];

/**
 * s04-relojes «Cuatro relojes». The hours land on a naive ruler by their TEXT (`ruler`, then `t-login`, `t-proxy`,
 * `t-edr`, `t-fw`): the login's 09:58 sits after the EDR's 09:02 and before the firewall's 10:03. `naive`: the amber
 * verdict «¿el bloqueo, antes de que nadie entrara?» — the only verdict on screen; the correct order is NOT shown
 * (that is s05's `answer`). `zones`: the end of each hour lights up; `utc`, `plus1`, `nozone` explain Z, +01:00 and
 * the missing zone (with a magnifier over the machine's settings). `ask`: the pause — two buttons, «El bloqueo» /
 * «El inicio de sesión», below the think prompt's band.
 */
export function S04Relojes(props: SceneProps) {
  const frame = useCurrentFrame();
  const rulerAt = props.cue('ruler');
  const at: Record<ClockId, number> = {
    login: props.cue('t-login'),
    proxy: props.cue('t-proxy'),
    edr1: props.cue('t-edr'),
    edr2: props.cue('t-edr') + 16,
    fw: props.cue('t-fw'),
  };
  const naiveAt = props.cue('naive');
  const zonesAt = props.cue('zones');
  const utcAt = props.cue('utc');
  const plus1At = props.cue('plus1');
  const noZoneAt = props.cue('nozone');
  const askAt = props.cue('ask');

  const lineDraw = progress(frame, rulerAt, 26, EASE.inOut);
  const zoneP = progress(frame, zonesAt, 18);
  const { weights } = focusWeights(frame, [utcAt, plus1At, noZoneAt], { ramp: 12, lead: 4, end: askAt + 40 });
  const cap = enter(frame, rulerAt, { distance: 12, duration: 16 });
  const capOut = 1 - progress(frame, naiveAt - 2, 12);
  const naiveP = progress(frame, naiveAt, 16) * fadeOut(frame, askAt - 6, 12);
  const breakP = progress(frame, naiveAt + 4, 14) * fadeOut(frame, askAt - 6, 12);
  const plus1Band = progress(frame, plus1At, 16) * fadeOut(frame, askAt - 6, 12);
  const buttonsAt = askAt + 8;
  const buttonsP = progress(frame, buttonsAt, 16);

  const chipFocus = (id: ClockId): { glow: number; dim: number } => {
    let glow = 0;
    let dim = 0;
    FOCUS.forEach((group, k) => {
      if (group.includes(id)) glow = Math.max(glow, weights[k]);
      else dim = Math.max(dim, weights[k]);
    });
    return { glow, dim: dim * 0.9 };
  };

  return (
    <Stage>
      {/* before the verdict: what the ruler is doing */}
      <div style={{ position: 'absolute', left: 0, top: BAND_Y + 12, fontFamily: FONT.sans, fontSize: 38, fontWeight: 700, color: C.muted, opacity: cap.opacity * capOut * fadeOut(frame, askAt - 6, 12), whiteSpace: 'nowrap' }}>
        Las horas, tal como vienen
      </div>

      {/* the amber verdict */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: BAND_Y,
          height: 70,
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          padding: '0 30px 0 22px',
          boxSizing: 'border-box',
          borderRadius: RADIUS.pill,
          border: `3px solid ${alpha(C.amber, 0.8)}`,
          background: alpha(C.amberDeep, 0.42),
          fontFamily: FONT.sans,
          fontSize: 38,
          fontWeight: 800,
          color: C.amber,
          whiteSpace: 'nowrap',
          opacity: naiveP,
          transform: `translateY(${(1 - naiveP) * 14}px)`,
        }}
      >
        <Icon name="alert" size={40} color={C.amber} />
        ¿el bloqueo, antes de que nadie entrara?
      </div>

      {/* +01:00 means one hour ahead of UTC */}
      <div style={{ position: 'absolute', left: 1010, top: BAND_Y - 6, width: 718, opacity: plus1Band, transform: `translateY(${(1 - plus1Band) * 12}px)`, fontFamily: FONT.sans }}>
        <div style={{ fontSize: 34, fontWeight: 750, color: C.text, whiteSpace: 'nowrap' }}>
          <span style={{ fontFamily: FONT.mono, fontWeight: 800, color: C.sky }}>+01:00</span> = una hora por delante de UTC
        </div>
        <div style={{ marginTop: 4, fontSize: 30, fontWeight: 600, color: C.muted }}>Halden en invierno</div>
      </div>

      {/* the break: nearly an hour between 09:02:58Z and 09:58:12 */}
      <div style={{ position: 'absolute', left: RULER.breakX - 100, top: CHIP_Y + 14, width: 200, textAlign: 'center', fontFamily: FONT.sans, fontSize: 30, fontWeight: 750, color: C.amber, opacity: breakP }}>
        casi 1 h
      </div>

      {/* the ruler */}
      <RulerLine y={LINE_Y} slots={RULER.naiveX} breakAt={RULER.breakX} draw={lineDraw} tickOn={1} />

      {/* the hours, as the text gives them */}
      {CLOCKS.map((clock) => {
        const x = naiveSlot(clock.id);
        const w = clock.id === 'fw' ? RULER.wFw : RULER.w;
        const fall = progress(frame, at[clock.id], 18, EASE.out);
        const { glow, dim } = chipFocus(clock.id);
        const tagP = progress(frame, at[clock.id] + 6, 14);
        return (
          <div key={clock.id}>
            <div
              style={{
                position: 'absolute',
                left: x - w / 2,
                top: CHIP_Y + (1 - fall) * -70,
                opacity: fall,
              }}
            >
              <ClockChip time={clock.time} zone={clock.zone} zoneGlow={zoneP} width={w} glow={glow} dim={dim} />
            </div>
            <svg width={8} height={LINE_Y - CHIP_Y - RULER.h1} style={{ position: 'absolute', left: x - 4, top: CHIP_Y + RULER.h1, opacity: fall }} aria-hidden>
              <path d={`M 4 0 V ${LINE_Y - CHIP_Y - RULER.h1}`} stroke={alpha(C.cyan, 0.45)} strokeWidth={4} strokeDasharray="6 7" />
            </svg>
            <div style={{ position: 'absolute', left: x, top: TAG_Y, transform: `translateX(-50%) translateY(${(1 - tagP) * 10}px)`, opacity: tagP * (1 - 0.55 * dim) }}>
              <SourceTag id={clock.source} />
            </div>
          </div>
        );
      })}

      {/* Z means UTC (under the three hours that end in Z) */}
      <Callout x={0} w={780} p={progress(frame, utcAt, 16)} bracket={[naiveSlot('proxy') - 110, naiveSlot('edr2') + 120]}>
        <span style={{ fontFamily: FONT.mono, fontWeight: 800, color: C.emerald }}>Z</span> = UTC · la hora de referencia mundial
      </Callout>

      {/* no zone: look at the machine's settings, do not assume */}
      <div
        style={{
          position: 'absolute',
          left: 800,
          top: CALL_Y,
          width: 928,
          height: 84,
          boxSizing: 'border-box',
          display: 'flex',
          alignItems: 'center',
          gap: 18,
          padding: '0 24px',
          borderRadius: RADIUS.md,
          border: `3px solid ${alpha(C.amber, 0.7)}`,
          background: alpha(C.amberDeep, 0.3),
          fontFamily: FONT.sans,
          opacity: progress(frame, noZoneAt, 16),
          transform: `translateY(${(1 - progress(frame, noZoneAt, 16)) * 12}px)`,
        }}
      >
        <Icon name="search" size={52} color={C.amber} strokeWidth={2.2} />
        <div style={{ whiteSpace: 'nowrap' }}>
          <div style={{ fontSize: 34, fontWeight: 800, color: C.amber, lineHeight: 1.15 }}>sin zona: se comprueba, no se supone</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 30, fontWeight: 600, color: C.text, lineHeight: 1.2 }}>
            <Icon name="gear" size={28} color={C.muted} />
            configuración del equipo: hora local de Halden
          </div>
        </div>
      </div>

      {/* the pause: two buttons */}
      <div style={{ position: 'absolute', left: 0, top: BAND_Y - 2, width: 1728, display: 'flex', justifyContent: 'center', gap: 56, opacity: buttonsP, transform: `translateY(${(1 - buttonsP) * 14}px)` }}>
        {['El bloqueo', 'El inicio de sesión'].map((label) => (
          <div
            key={label}
            style={{
              height: 80,
              minWidth: 380,
              padding: '0 44px',
              boxSizing: 'border-box',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: RADIUS.pill,
              border: `3px solid ${alpha(C.cyan, 0.8)}`,
              background: alpha(C.cyan, 0.12),
              fontFamily: FONT.sans,
              fontSize: 44,
              fontWeight: 800,
              color: C.textStrong,
              whiteSpace: 'nowrap',
            }}
          >
            {label}
          </div>
        ))}
      </div>

      <CaseStamp frame={frame} />
    </Stage>
  );
}

/** A caption under the ruler with a bracket over the hours it speaks of. */
function Callout({ x, w, p, bracket, children }: { x: number; w: number; p: number; bracket: [number, number]; children: ReactNode }) {
  return (
    <div style={{ position: 'absolute', left: x, top: CALL_Y, width: w, opacity: p, transform: `translateY(${(1 - p) * 12}px)`, fontFamily: FONT.sans }}>
      <svg width={w} height={22} viewBox={`0 0 ${w} 22`} style={{ display: 'block' }} aria-hidden>
        <path d={`M ${bracket[0] - x} 20 V 8 H ${bracket[1] - x} V 20`} stroke={alpha(C.emerald, 0.8)} strokeWidth={4} fill="none" strokeLinejoin="round" />
      </svg>
      <div style={{ marginTop: 8, fontSize: 34, fontWeight: 750, color: C.text, whiteSpace: 'nowrap' }}>{children}</div>
    </div>
  );
}

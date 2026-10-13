import { C, FONT, STAGE, alpha } from '../../../../../engine/src/theme/tokens';
import { PLACES } from '../../../data/s02-foco';
import { FloodlightGlyph, LaptopGlyph, STEEL, TabletGlyph } from '../Glyphs';
import type { FocoBeats } from './beats';
import { ANTENNAS, INNER, LAMP_H, LAPTOP, PARK, PLOT, TABLET } from './geometry';
import { HeatDefs, HeatMap, Residual, SpillOutline } from './Heat';
import { PlanStructure, SurveyWalk } from './Plan';

const W = STAGE.width;
const H = STAGE.height;
const LAMP = ANTENNAS[0];
/** FloodlightGlyph's beam starts this far from its pivot (26 design units at this head size). */
const LENS = (26 * LAMP_H) / 44;

/** A ring that grows and fades once (`p` 0–1). */
function Ping({ x, y, p, tone, r0 = 24, r1 = 86 }: { x: number; y: number; p: number; tone: string; r0?: number; r1?: number }) {
  if (p <= 0.001 || p >= 0.999) return null;
  return <circle cx={x} cy={y} r={r0 + (r1 - r0) * p} fill="none" stroke={tone} strokeWidth={4} opacity={0.9 * (1 - p)} />;
}

/**
 * The plan of the terminal with everything that happens on it, in stage units; `dx` slides the
 * whole plan (it starts centred and steps left when the right column is needed).
 * Layers, bottom to top: structure, heat map, the finding's outline, the survey walk, the crane
 * tablet of s02-03, the floodlight (ONE cone with the first antenna's lobe), the test laptop.
 */
export function PlanLayer({ b, dx }: { b: FocoBeats; dx: number }) {
  const lobe = b.lobes[0];
  const ap = INNER[TABLET.ap];
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: W, height: H, transform: `translateX(${dx}px)` }}>
      <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <HeatDefs />
        <PlanStructure spill={b.spillMark} />
        <HeatMap inner={b.inner} edge={b.edge} lobes={b.lobes} opacity={0.9} />
        <Residual show={b.residual} x={LAPTOP.x} y={LAPTOP.y} />
        <SpillOutline lobes={b.lobes} show={b.spillMark} />
        <SurveyWalk t={b.walk} marker={b.marker} trail={b.trail} />

        {/* Tuesday: the two antennas that were adjusted (sky: infrastructure) */}
        {ANTENNAS.map((a, i) => (
          <g key={i}>
            <circle cx={a.x} cy={a.y} r={48} fill="none" stroke={C.sky} strokeWidth={4} strokeDasharray="10 8" opacity={0.95 * b.rings[i]} />
            <Ping x={a.x} y={a.y} p={b.rings[i]} tone={C.sky} r0={48} r1={104} />
          </g>
        ))}

        {/* A crane tablet joins the network: the name is in the air again */}
        {b.tablet > 0.01 ? (
          <g opacity={Math.min(1, b.tablet)}>
            <line x1={TABLET.x + 26} y1={TABLET.y - 16} x2={ap.x - 16} y2={ap.y + 2} stroke={C.cyanSoft} strokeWidth={4} strokeLinecap="round" strokeDasharray="4 10" />
            <g transform={`translate(${TABLET.x} ${TABLET.y}) scale(${0.7 + 0.3 * b.tablet}) translate(${-TABLET.x} ${-TABLET.y})`}>
              <TabletGlyph x={TABLET.x} y={TABLET.y} h={TABLET.h} screen={0.9} glow={0.5 + 0.5 * b.seen} />
            </g>
          </g>
        ) : null}

        {/* The floodlight: its cone is the first antenna's lobe */}
        {b.lampIn > 0.01 ? (
          <g transform={`translate(${LAMP.x} ${LAMP.y}) scale(${0.6 + 0.4 * b.lampIn}) translate(${-LAMP.x} ${-LAMP.y})`} opacity={Math.min(1, b.lampIn * 1.4)}>
            <FloodlightGlyph
              x={LAMP.x}
              y={LAMP.y}
              h={LAMP_H}
              angle={lobe.angle}
              spread={lobe.spread}
              reach={Math.max(1, lobe.reach - LENS)}
              beam={b.beamIn * (1 - 0.45 * b.low[0])}
              glow={0.35 * b.beamIn + 0.65 * b.lampGlow}
              tone={STEEL.light}
            />
          </g>
        ) : null}

        {/* The test laptop in the car park, and each time it measures */}
        {b.laptopIn > 0.01 ? (
          <g>
            <Ping x={LAPTOP.x} y={LAPTOP.y - 6} p={b.pings[0]} tone={C.cyan} />
            <Ping x={LAPTOP.x} y={LAPTOP.y - 6} p={b.pings[1]} tone={C.cyan} />
            <g transform={`translate(${LAPTOP.x} ${LAPTOP.y}) scale(${0.6 + 0.4 * b.laptopIn}) translate(${-LAPTOP.x} ${-LAPTOP.y})`} opacity={Math.min(1, b.laptopIn * 1.4)}>
              <LaptopGlyph x={LAPTOP.x} y={LAPTOP.y} h={LAPTOP.h} screen={0.9} glow={0.4} />
            </g>
          </g>
        ) : null}
      </svg>

      {/* Places */}
      <div style={{ position: 'absolute', left: PLOT.x0 + 22, top: PLOT.y0 + 8, fontFamily: FONT.sans, fontSize: 34, fontWeight: 800, letterSpacing: 0.6, color: alpha(C.text, 0.92), textShadow: `0 2px 10px ${C.ink950}` }}>
        {PLACES.terminal}
      </div>
      <div
        style={{
          position: 'absolute',
          left: PARK.x0 - 30,
          width: PARK.x1 - PARK.x0 + 60,
          top: PARK.y0 - 84,
          textAlign: 'center',
          fontFamily: FONT.sans,
          fontSize: 32,
          fontWeight: 800,
          lineHeight: 1.15,
          color: alpha(C.text, 0.6 + 0.4 * b.parkLit),
          whiteSpace: 'nowrap',
        }}
      >
        {PLACES.park.map((line) => (
          <div key={line}>{line}</div>
        ))}
      </div>
    </div>
  );
}

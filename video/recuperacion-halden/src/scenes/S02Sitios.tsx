import { useCurrentFrame } from 'remotion';
import { enterFramesFor, sceneTiming } from '../../../engine/src/timeline/load';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress, springIn } from '../../../engine/src/theme/motion';
import { Icon, dimStyle, focusWeights, mix, windowWeight } from '../../../engine/src/ui';
import { MAP, SERVICES_LABEL, SITES, YEARLY } from '../data/s02-sitios';
import { TIMELINE } from '../timeline/load';
import { Theatre, theatreSize } from './parts/Theatre';
import { MAP_SIZE, StreetMap } from './parts/s02-sitios/StreetMap';
import { Stage, segment, wordFrame } from './kit';

const S = 's02-sitios';
const NBSP = ' ';
const W = STAGE.width;
const H = STAGE.height;

// ---- Three columns (stage-local). Everything in a column is left-aligned with the theatre's facade.
const COL_GAP = 48;
const COL_W = (W - 2 * COL_GAP) / 3;
const TH_W = 360;
const TH_X = 56;
const ART_H = theatreSize(TH_W).artH;
const BAND_X = TH_X + theatreSize(TH_W).hallLeft;
const LABEL_TOP = ART_H + 12;
const SUB_TOP = LABEL_TOP + 46;
const META_TOP = SUB_TOP + 80;
// ---- Rows under the three columns (full width).
const YEARLY_TOP = META_TOP + 50;
const COST_TOP = YEARLY_TOP + 44;
const COST_H = 50;
const SERV_LABEL_TOP = COST_TOP + COST_H + 12;
const SERV_TOP = SERV_LABEL_TOP + 42;
const SERV_H = 54;
/** While the intercepted message is up, the whole row shrinks towards the bottom (its top below stage y ≈ 212). */
const SHRUNK = 0.68;
/** How much lower the theatres sit before the cost rows arrive. */
const EARLY_DROP = 110;

// ---- The map, low enough to sit under the intercepted message's slot.
const MAP_X = Math.round((W - MAP_SIZE.w) / 2);
const MAP_Y = H - MAP_SIZE.h - 14;
const TERM_TOP = 70;

/** The intercepted message's window in this scene's local frames (from the timeline). */
function interceptWindow(): { from: number; to: number } {
  const e = TIMELINE.intercept?.find((i) => i.scene === S);
  if (!e) return { from: Number.POSITIVE_INFINITY, to: Number.NEGATIVE_INFINITY };
  const origin = sceneTiming(TIMELINE, S).from - enterFramesFor(TIMELINE, S);
  return { from: e.from - origin, to: e.from + e.durationInFrames - origin };
}

/** The amber cost meter: three pips (a drawing, not a figure) and the words. */
function CostPill({ pips, text, show }: { pips: number; text: string; show: number }) {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 14,
        height: COST_H,
        padding: '0 22px 0 16px',
        boxSizing: 'border-box',
        borderRadius: RADIUS.pill,
        border: `2px solid ${alpha(C.amber, 0.75)}`,
        background: alpha(C.amber, 0.1),
        opacity: show,
        transform: `translateY(${(1 - show) * 12}px)`,
        whiteSpace: 'nowrap',
      }}
    >
      <div style={{ display: 'flex', gap: 6 }}>
        {[0, 1, 2].map((k) => (
          <span
            key={k}
            style={{
              width: 16,
              height: 24,
              borderRadius: 4,
              boxSizing: 'border-box',
              border: `2px solid ${alpha(C.amber, 0.8)}`,
              background: k < pips ? C.amber : 'transparent',
            }}
          />
        ))}
      </div>
      <span style={{ fontSize: 32, fontWeight: 800, color: '#fcd34d' }}>{text}</span>
    </div>
  );
}

/** One nameless service row: what that service would need. */
function ServiceRow({ text, show }: { text: string; show: number }) {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 12,
        height: SERV_H,
        padding: '0 22px 0 16px',
        boxSizing: 'border-box',
        borderRadius: RADIUS.md,
        border: `2px dashed ${alpha(C.cyan, 0.75)}`,
        background: alpha(C.cyan, 0.08),
        opacity: show,
        transform: `translateY(${(1 - show) * 12}px)`,
        whiteSpace: 'nowrap',
      }}
    >
      <Icon name="app" size={32} color={C.cyan} />
      <span style={{ fontSize: 32, fontWeight: 750, color: C.textStrong }}>{text}</span>
    </div>
  );
}

/**
 * s02-sitios «Un teatro de reserva». On `theatres` three small theatres take their places in a row, unlit: what a
 * service WOULD need, not sites the port has. Each lights on its cue with its two lines — HOT SITE «todo encendido ·
 * datos al día» (`hot`), WARM SITE «máquinas y red listas · datos por restaurar» (`warm`), COLD SITE «energía y red ·
 * nada más» (`cold`) — and its time («minutos» · «horas o un día» · «días o semanas») on its own word. On «pagan»
 * the amber line «se paga todo el año» runs under the row, and on `price` the cost pills follow left to right («el
 * más caro» · «medio» · «el más barato»). On «Eliges» the fixed label «lo que necesitaría cada servicio ·
 * propuesta» and three nameless service rows settle, one under each theatre. Before the intercepted message the whole
 * row shrinks to the bottom of the stage so its top-centre band is free. On `far` the row gives way to a generic map,
 * low: «CPD» and, across the street, the reserve theatre «en la misma calle», with replication dots between them.
 * On `dispersion` a rose flood spreads over both and GEOGRAPHIC DISPERSION comes in on top (once the message has
 * gone); on «lejos» the theatre leaves for the far end of the map, out of the water. No distance, no figure.
 */
export function S02Sitios(props: SceneProps) {
  const frame = useCurrentFrame();
  const theatresAt = props.cue('theatres');
  const siteAt = SITES.map((s) => props.cue(s.cue));
  const priceAt = props.cue('price');
  const farAt = props.cue('far');
  const dispersionAt = props.cue('dispersion');
  const ic = interceptWindow();
  const s06 = segment(props, 's02-06');

  // ---- Theatres row.
  const rowIn = SITES.map((_, i) => springIn(frame, 30, theatresAt - 10 + i * 6, { damping: 16 }));
  const litOf = siteAt.map((at) => progress(frame, at - 4, 16));
  const metaAt = [wordFrame(S, 's02-02', 'minutos'), wordFrame(S, 's02-03', 'horas'), wordFrame(S, 's02-04', 'días')].map(
    (f, i) => Math.max(siteAt[i] + 10, f - 6),
  );
  const yearlyAt = Math.max(siteAt[2] + 20, wordFrame(S, 's02-05', 'pagan') - 6);
  const { weights, dims } = focusWeights(frame, siteAt, { end: yearlyAt });
  const costAt = SITES.map((_, i) => priceAt - 2 + i * 8);
  const servAt = Math.max(priceAt + 24, wordFrame(S, 's02-05', 'Eliges') - 6);

  // ---- Shrink before the intercepted message, leave on `far`.
  const shrink = progress(frame, ic.from - 22, 24, EASE.inOut);
  const rowScale = mix(1, SHRUNK, shrink);
  // Until the cost rows arrive the theatres sit lower, so the stage is not top-heavy.
  const rowY = mix(EARLY_DROP, 0, progress(frame, yearlyAt - 12, 24, EASE.inOut));
  const rowOut = progress(frame, farAt - 8, 16, EASE.inOut);

  // ---- The map.
  const mapIn = progress(frame, farAt - 4, 18);
  const link = progress(frame, farAt + 6, 16);
  const flood = progress(frame, dispersionAt - 4, 40, EASE.inOut);
  const move = progress(frame, wordFrame(S, 's02-07', 'lejos') - 8, 30, EASE.inOut);
  const termAt = Math.max(dispersionAt, s06.to + 2, ic.to + 2);
  const termIn = enter(frame, termAt, { distance: 18 });
  const termGlow = windowWeight(frame, wordFrame(S, 's02-07', 'geographic') - 6, Number.POSITIVE_INFINITY, { ramp: 14 });

  return (
    <Stage>
      {/* ---- The three theatres and their rows ---- */}
      {rowOut < 1 ? (
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: W,
            height: H,
            transform: `translateY(${rowY}px) scale(${rowScale})`,
            transformOrigin: '50% 100%',
            opacity: 1 - rowOut,
            ...dimStyle(0.25 * shrink, 1 - rowOut),
            fontFamily: FONT.sans,
          }}
        >
          {SITES.map((site, i) => {
            const x = i * (COL_W + COL_GAP);
            const lit = litOf[i];
            const pop = rowIn[i];
            const dim = Math.max(dims[i], 0.45 * (1 - lit));
            const labelIn = progress(frame, siteAt[i] - 2, 14);
            const subIn = progress(frame, siteAt[i] + 6, 14);
            const metaIn = progress(frame, metaAt[i], 12);
            return (
              <div key={site.kind} style={{ position: 'absolute', left: x, top: 0, width: COL_W, height: H }}>
                <div
                  style={{
                    position: 'absolute',
                    left: TH_X,
                    top: 0,
                    opacity: Math.min(1, pop * 1.4),
                    transform: `translateY(${(1 - Math.min(1, pop)) * 22}px)`,
                    ...dimStyle(dim, Math.min(1, pop * 1.4)),
                  }}
                >
                  <Theatre kind={site.kind} width={TH_W} lit={0.25 + 0.75 * lit} glow={weights[i]} frame={frame} />
                </div>
                {/* label · sub · meta, left-aligned with the facade */}
                <div style={{ position: 'absolute', left: BAND_X, top: LABEL_TOP, width: COL_W - BAND_X, ...dimStyle(dims[i]) }}>
                  <div style={{ fontSize: 42, lineHeight: 1.1, fontWeight: 850, letterSpacing: 1.5, color: '#c4b5fd', whiteSpace: 'nowrap', opacity: labelIn }}>{site.label}</div>
                </div>
                <div
                  style={{
                    position: 'absolute',
                    left: BAND_X,
                    top: SUB_TOP,
                    width: COL_W - BAND_X - 10,
                    height: 78,
                    fontSize: 32,
                    lineHeight: 1.2,
                    fontWeight: 600,
                    color: C.text,
                    textWrap: 'balance',
                    opacity: subIn,
                    ...dimStyle(dims[i], subIn),
                  }}
                >
                  {/* keep «·» at the end of the first line, never at the start of the second */}
                  {site.sub.replace(' · ', NBSP + '· ')}
                </div>
                <div style={{ position: 'absolute', left: BAND_X, top: META_TOP, display: 'flex', alignItems: 'center', gap: 10, opacity: metaIn, ...dimStyle(dims[i], metaIn) }}>
                  <Icon name="clock" size={32} color="#7dd3fc" />
                  <span style={{ fontSize: 36, lineHeight: 1.15, fontWeight: 800, color: C.textStrong, whiteSpace: 'nowrap' }}>{site.meta}</span>
                </div>
                {/* cost */}
                <div style={{ position: 'absolute', left: BAND_X, top: COST_TOP }}>
                  <CostPill pips={site.pips} text={site.cost} show={progress(frame, costAt[i], 14)} />
                </div>
                {/* the nameless service that would fit here */}
                <div style={{ position: 'absolute', left: BAND_X, top: SERV_TOP }}>
                  <ServiceRow text={site.service} show={progress(frame, servAt + 8 + i * 8, 14)} />
                </div>
              </div>
            );
          })}

          {/* «se paga todo el año»: one amber line under the three */}
          {frame >= yearlyAt - 2 ? (
            <div style={{ position: 'absolute', left: BAND_X, top: YEARLY_TOP, width: W - 2 * BAND_X, display: 'flex', alignItems: 'center', gap: 18, ...enter(frame, yearlyAt, { distance: 10, duration: 14 }) }}>
              <div style={{ flex: 1, height: 3, borderRadius: 2, background: alpha(C.amber, 0.55), transformOrigin: '100% 50%', transform: `scaleX(${progress(frame, yearlyAt, 20, EASE.inOut)})` }} />
              <span style={{ fontSize: 32, fontWeight: 750, color: '#fcd34d', whiteSpace: 'nowrap' }}>{YEARLY}</span>
              <div style={{ flex: 1, height: 3, borderRadius: 2, background: alpha(C.amber, 0.55), transformOrigin: '0% 50%', transform: `scaleX(${progress(frame, yearlyAt, 20, EASE.inOut)})` }} />
            </div>
          ) : null}

          {/* fixed label over the service rows */}
          {frame >= servAt - 2 ? (
            <div style={{ position: 'absolute', left: BAND_X, top: SERV_LABEL_TOP, display: 'flex', alignItems: 'center', gap: 12, ...enter(frame, servAt, { distance: 10, duration: 14 }) }}>
              <Icon name="file" size={28} color={C.muted} />
              <span style={{ fontSize: 30, fontWeight: 700, color: C.muted, whiteSpace: 'nowrap' }}>{SERVICES_LABEL}</span>
            </div>
          ) : null}
        </div>
      ) : null}

      {/* ---- The map: two places in the same street ---- */}
      {mapIn > 0 ? (
        <div style={{ position: 'absolute', left: MAP_X, top: MAP_Y }}>
          <StreetMap frame={frame} show={mapIn} link={link} flood={flood} move={move} />
        </div>
      ) : null}

      {/* GEOGRAPHIC DISPERSION, once the intercepted message has gone */}
      {frame >= termAt - 2 ? (
        <div style={{ position: 'absolute', left: 0, top: TERM_TOP, width: W, display: 'flex', justifyContent: 'center', ...termIn }}>
          <span
            style={{
              padding: '10px 36px 12px',
              borderRadius: RADIUS.lg,
              border: `3px solid ${alpha(C.violet, 0.5 + 0.4 * termGlow)}`,
              background: alpha(C.violet, 0.08 + 0.08 * termGlow),
              boxShadow: `0 0 ${Math.round(16 + 26 * termGlow)}px ${alpha(C.violet, 0.2 + 0.2 * termGlow)}`,
              fontSize: 66,
              fontWeight: 900,
              letterSpacing: 2,
              color: '#c4b5fd',
              whiteSpace: 'nowrap',
            }}
          >
            {MAP.term}
          </span>
        </div>
      ) : null}
    </Stage>
  );
}

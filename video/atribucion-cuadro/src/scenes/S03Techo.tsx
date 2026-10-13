import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { clamp01, mix, windowWeight } from '../../../engine/src/ui';
import { S03_CEILING, S03_SOURCES, S03_SPOT, S03_WRAP } from '../data/s03-techo';
import { Lane } from './parts/Lanes';
import { BAND_TONE, Painting, paintingLayout } from './parts/Painting';
import { IntrusionSet, ReportCard, SourcesCard } from './parts/s03-techo/Cards';
import { CountryTag, CraneCard, LaneText } from './parts/s03-techo/Crane';
import { Stage, segment, wordFrame } from './kit';

const S = 's03-techo';
const W = STAGE.width;

/** While the intercepted message is up: the painting and its three lanes, low, under the engine's card. */
const A = { pw: 300, x: 130, y: 240, legs: 0.15 } as const;
/** From `beam` on: the painting at full height, the lamp on its left, the detail slot on the right. */
const B = { pw: 376, x: 420, y: 16, legs: 1 } as const;
const SPOT_GAP = 240;
const SLOT_X = 1196;
const SLOT_W = W - SLOT_X - 12;
const CRANE = { x: 1326, y: 14, w: 390 } as const;
const STRIP_TOP = 594;

/**
 * s03-techo «Hasta dónde llega lo que ves».
 *   start        s02's painting and its three lanes (name + confidence), low: the top-centre band is the
 *                engine's (PAPER CRANE's message) until s03-01 ends.
 *   reply-name   PAPER CRANE's card, top right («célula de engaño · siembra pistas falsas»), and the word
 *                «país» lifted from the message into the SPONSOR lane.
 *   wall         the message leaves; the canvas goes to half light and «país» reads «el tercer nivel».
 *   beam         the painting rises to full height and the lamp «tu telemetría» comes on from the left: it
 *                lights band 1, grazes band 2 and never reaches band 3.
 *   dark         band 3 goes dark («lock»): «no deja rastro en tu red»; on the right, what it would take to
 *                see it (HUMINT, SIGINT, funding and orders, legal records) and who usually has that.
 *   vendor       how a serious report talks: a bracketed name, an overlap at operator level, moderate
 *                confidence and «país: —»; INTRUSION SET; on the left, above the beam, «no es debilidad, es rigor».
 *   ceiling      the beam's edge runs across the lanes: «hasta aquí llega la evidencia técnica». Still before
 *                the exam card.
 *   wrap-i       «tres niveles · tu red ilumina bien el primero»; only the first lane stays lit.
 */
export function S03Techo(props: SceneProps) {
  const frame = useCurrentFrame();
  const replyAt = props.cue('reply-name');
  const wallAt = props.cue('wall');
  const beamAt = props.cue('beam');
  const darkAt = props.cue('dark');
  const vendorAt = props.cue('vendor');
  const ceilingAt = props.cue('ceiling');
  const wrapAt = props.cue('wrap-i');
  const s0301 = segment(props, 's03-01');
  const at = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);
  const p = (start: number, dur = 14) => progress(frame, start, dur);
  const swell = (start: number, hold = 20) => progress(frame, start, 10) * (1 - progress(frame, start + hold, 26, EASE.inOut));

  // ---- The layout: low under the message, then full height with the lamp.
  const rise = progress(frame, beamAt - 14, 30, EASE.inOut);
  const pw = mix(A.pw, B.pw, rise);
  const px = mix(A.x, B.x, rise);
  const py = mix(A.y, B.y, rise);
  const L = paintingLayout(pw, { spotGap: SPOT_GAP });
  const laneX = px + pw + 2;
  const lane = (i: 0 | 1 | 2) => ({ x: laneX, y: py + L.bands[i].y, w: W - laneX, h: L.bands[i].h });

  // ---- Light.
  const half = p(wallAt - 4, 20);
  const beam = progress(frame, at('s03-02', 'foco') - 8, 46, EASE.inOut);
  const onCanvas = clamp01((beam - 0.6) / 0.4);
  const dark = progress(frame, darkAt - 2, 10, EASE.inOut);
  const wrap = p(wrapAt - 4, 18);
  const base = 1 - 0.5 * half;
  const ambient = [base, base - 0.12 * dark - 0.1 * wrap, base * (1 - 0.9 * dark)] as [number, number, number];
  const third = windowWeight(frame, wallAt, beamAt - 12, { ramp: 14 });
  const first = Math.max(swell(at('s03-02', 'primero') - 4, 26), 0.8 * wrap);
  const edge = Math.max(swell(at('s03-02', 'roza') - 4, 30), windowWeight(frame, ceilingAt, wrapAt - 4, { ramp: 14 }));

  // ---- PAPER CRANE and the word «país».
  const craneIn = p(replyAt - 2, 16) * (1 - progress(frame, Math.min(wallAt, s0301.to) - 4, 14, EASE.inOut));
  const tagIn = p(at('s03-01', 'prisas') - 6, 16) * (1 - progress(frame, beamAt - 22, 12, EASE.inOut));
  const tagSaid = p(at('s03-02', 'tercer') - 6, 12);

  // ---- Band 3: what it would take.
  const noTrace = p(at('s03-03', 'porque') - 4);
  const sourcesAt = at('s03-03', 'Verlo') - 8;
  const sources = p(sourcesAt, 16) * (1 - progress(frame, vendorAt - 16, 12, EASE.inOut));
  const items = S03_SOURCES.map((_, i) => p(sourcesAt + 4 + i * 5, 12));
  const said = S03_SOURCES.map((s) => (s.word && s.term ? Math.max(windowWeight(frame, at('s03-03', s.word), at('s03-03', s.word) + 34), swell(at('s03-03', s.term) - 4, 24)) : 0));
  const holders = p(at('s03-03', 'cosa') - 4);

  // ---- The report and the ceiling.
  const report = p(vendorAt - 2, 16);
  const body = progress(frame, vendorAt + 4, 60, EASE.linear);
  const country = p(at('s03-04', 'set') + 6);
  const setIn = p(at('s03-04', 'intrusion') - 4);
  const rigorIn = enter(frame, at('s03-04', 'debilidad') - 4, { distance: 12, duration: 14 });
  const rigorLit = p(at('s03-04', 'rigor') - 4, 12);
  const reachIn = enter(frame, ceilingAt - 2, { distance: 12, duration: 14 });
  const line = progress(frame, ceilingAt - 2, 26, EASE.inOut);
  const slotDim = 0.45 * wrap;
  const said4 = windowWeight(frame, at('s03-05', 'tres') - 4, at('s03-05', 'tu') - 4);

  const ceilY = py + L.ceilingY;
  const strip = enter(frame, wrapAt - 4, { distance: 14, duration: 16 });

  return (
    <Stage>
      {/* The three lanes */}
      {([2, 1, 0] as const).map((i) => {
        const r = lane(i);
        const lit = [Math.max(onCanvas * 0.9, first), 0.25 * onCanvas * (1 - 0.6 * wrap), third][i];
        const off = [0, 0.3 * dark + 0.3 * wrap, dark][i];
        return (
          <Lane key={i} {...r} tone={BAND_TONE[i]} lit={lit} dark={off}>
            <div style={{ position: 'absolute', left: 24, top: 0, bottom: 0, display: 'flex', alignItems: 'center', opacity: 1 - 0.45 * [0, wrap, 0][i] }}>
              <LaneText i={i} tone={BAND_TONE[i]} conf={1 - rise} dark={i === 2 ? noTrace : 0} lit={i === 0 ? first : 0} />
            </div>
          </Lane>
        );
      })}

      {/* The beam's edge, run across the lanes: the ceiling */}
      {line > 0.001 ? (
        <svg width={W} height={660} style={{ position: 'absolute', left: 0, top: 0 }}>
          <path d={`M ${px + pw} ${ceilY} H ${mix(px + pw, SLOT_X - 14, line)}`} stroke={alpha(C.cyanSoft, 0.95)} strokeWidth={4} strokeLinecap="round" strokeDasharray="14 10" />
        </svg>
      ) : null}

      {/* The painting, its lamp and the box that is not in it */}
      <div style={{ position: 'absolute', left: px, top: py }}>
        <Painting
          width={pw}
          legs={mix(A.legs, B.legs, rise)}
          split={1}
          ambient={ambient}
          focus={[first, 0, third]}
          detail={[1, 1, 1]}
          archive={1}
          link={1 - dark}
          archiveLit={third}
          archiveDark={dark}
          spot={p(beamAt - 2, 18)}
          spotGap={SPOT_GAP}
          beam={beam}
          beamEdge={edge}
          spotLabel={S03_SPOT}
          spotLabelAt="beam"
          spotLabelShow={p(at('s03-02', 'telemetría') - 2, 12)}
        />
      </div>

      {/* PAPER CRANE, outside the engine's band, and «país» lifted from the message */}
      <div style={{ position: 'absolute', left: CRANE.x, top: CRANE.y }}>
        <CraneCard width={CRANE.w} show={craneIn} />
      </div>
      <div style={{ position: 'absolute', left: 1010, top: lane(2).y + 26 }}>
        <CountryTag show={tagIn} said={tagSaid} tie={Math.max(10, lane(2).y + 26 - 198)} tieShow={1 - progress(frame, s0301.to - 10, 10, EASE.inOut)} />
      </div>

      {/* Above the beam: where it stops, and why stopping is right */}
      <div style={{ position: 'absolute', left: 20, top: 168, fontFamily: FONT.sans, fontWeight: 850, fontSize: 32, lineHeight: 1.12, whiteSpace: 'nowrap', opacity: 1 - 0.3 * wrap }}>
        <div style={{ color: alpha(C.emerald, 0.75 + 0.25 * rigorLit), ...rigorIn }}>
          {S03_CEILING.rigor.map((t) => (
            <div key={t}>{t}</div>
          ))}
        </div>
        <div style={{ marginTop: 8, color: C.cyanSoft, ...reachIn }}>
          {S03_CEILING.reach.map((t) => (
            <div key={t}>{t}</div>
          ))}
        </div>
      </div>

      {/* The detail slot: what band 3 would take, then how a serious report talks */}
      <div style={{ position: 'absolute', left: SLOT_X, top: B.y + 10 }}>
        <SourcesCard width={SLOT_W} show={sources} items={items} said={said} holders={holders} />
      </div>
      <div style={{ position: 'absolute', left: SLOT_X, top: B.y + 2, display: 'flex', flexDirection: 'column', gap: 18, opacity: 1 - slotDim }}>
        <ReportCard width={SLOT_W} show={report} body={body} country={country} />
        <IntrusionSet show={setIn} glow={swell(at('s03-04', 'intrusion') - 2, 30)} />
      </div>

      {/* «tres niveles · tu red ilumina bien el primero» */}
      {frame >= wrapAt - 6 ? (
        <div style={{ position: 'absolute', left: laneX, width: W - laneX, top: STRIP_TOP, display: 'flex', justifyContent: 'center', ...strip }}>
          <div style={{ padding: '8px 32px 11px', borderRadius: RADIUS.md, border: `2px solid ${alpha(C.cyan, 0.6)}`, background: alpha('#083344', 0.92), fontFamily: FONT.sans, fontSize: 38, fontWeight: 850, lineHeight: 1.1, whiteSpace: 'nowrap' }}>
            <span style={{ color: alpha(C.textStrong, 0.7 + 0.3 * said4) }}>{S03_WRAP.levels}</span>
            <span style={{ color: C.faint }}> · </span>
            <span style={{ color: C.cyanSoft }}>{S03_WRAP.first}</span>
          </div>
        </div>
      ) : null}
    </Stage>
  );
}

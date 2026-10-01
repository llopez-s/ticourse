import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, alpha } from '../../../engine/src/theme/tokens';
import { EASE, progress, pulse, springIn } from '../../../engine/src/theme/motion';
import { Focus, focusWeights, mix, windowWeight } from '../../../engine/src/ui';
import { S04_INDICATORS, S04_LAYOUT as L, S04_REPLY, type Indicator } from '../data/s04-piramide';
import { Stage, segment, wordFrame } from './kit';
import { Person, type PersonTrait } from './parts/Person';
import { Pyramid, RUNGS, rungAnchor, type RungId } from './parts/Pyramid';
import { MonoChip, monoChipHeight, monoChipWidth } from './parts/s04-piramide/MonoChip';

const SCENE = 's04-piramide';
const CHIP = 32;
const ROW_STEP = (monoChipHeight(CHIP) * 1.12) / 2 + 3;
const COL_STEP = Math.max(...S04_INDICATORS.filter((i) => i.col === 0).map((i) => monoChipWidth(i.text, CHIP))) * 1.12 + 14;
const RUNG_ORDER: RungId[] = ['hash', 'domain', 'artifacts', 'tools', 'ttps'];

const colorOf = (rung: RungId) => RUNGS.find((r) => r.id === rung)!.color;

/** Stage-local slot of an indicator chip: left edge and vertical centre. */
function slotOf(ind: Indicator): { x: number; y: number } {
  const a = rungAnchor(ind.rung, L.pyramid.width, L.height);
  return {
    x: L.pyramid.left + a.x + a.w / 2 + L.slotGap + (ind.col ?? 0) * COL_STEP,
    y: L.top + a.y + (ind.row ?? 0) * ROW_STEP,
  };
}

/**
 * s04-piramide «Lo que le duele cambiar».
 *   (intercept)   GLASS VIPER: «Bloquea mi hash…» — the grey pyramid waits
 *                 small and low, below the top-centre band, until s04-01 ends
 *   pyramid       the rungs colour in bottom-up (IP addresses stays grey)
 *   (s04-01 end)  the pyramid grows to full height
 *   person        the walking figure on the left; ropa / acento / cómo anda
 *                 light as the voice names them, rows level with base / middle / top
 *   hash-up …     each indicator climbs from the bottom as a dot and pops out
 *   tool-up       beside its rung; the rung and chip the voice names are enlarged
 *   ttp-up        the four technique tags land at the top (they start rising at
 *                 «técnicas»); then everything rests for the exam card
 *   reply         the hash chip pulses at the base: «lo que menos le duele»
 */
export function S04Piramide(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s0401 = segment(props, 's04-01');
  const s0405 = segment(props, 's04-05');
  const pyramidAt = props.cue('pyramid');
  const personAt = props.cue('person');
  const hashUp = props.cue('hash-up');
  const domainUp = props.cue('domain-up');
  const artifactUp = props.cue('artifact-up');
  const toolUp = props.cue('tool-up');
  const ttpUp = props.cue('ttp-up');
  const replyAt = props.cue('reply');
  const cimaAt = Math.max(s0405.from, wordFrame(SCENE, 's04-05', 'cima'));
  const tagsAt = Math.max(cimaAt + 6, wordFrame(SCENE, 's04-05', 'técnicas') - 6);
  const calmAt = ttpUp + 40;

  // While the intercept card is up (until s04-01 ends) the pyramid waits small, low and centred.
  const grow = progress(frame, s0401.to - 6, 26, EASE.inOut);
  const k = mix(L.waitScale, 1, grow);
  const dx = mix(864 - (L.pyramid.left + L.pyramid.width / 2), 0, grow);
  const show = 0.35 + 0.65 * progress(frame, 0, 22);
  const grey: Partial<Record<RungId, number>> = {};
  RUNGS.forEach((r, i) => {
    grey[r.id] = 1 - progress(frame, pyramidAt + 4 + i * 7, 14);
  });

  // Which rung the voice is on.
  const { weights } = focusWeights(frame, [hashUp, domainUp, artifactUp, toolUp, cimaAt], { end: calmAt });
  const replyW = windowWeight(frame, replyAt, Number.POSITIVE_INFINITY, { ramp: 12 });
  const rungFocus: Partial<Record<RungId, number>> = {};
  RUNG_ORDER.forEach((id, i) => {
    rungFocus[id] = weights[i];
  });
  rungFocus.hash = Math.max(rungFocus.hash ?? 0, replyW);

  // Which trait of the person the voice is on.
  const traitStarts: [number, PersonTrait | null][] = [
    [wordFrame(SCENE, 's04-02', 'ropa'), 'ropa'],
    [wordFrame(SCENE, 's04-02', 'acento'), 'acento'],
    [wordFrame(SCENE, 's04-02', 'anda'), 'andar'],
    [hashUp, 'ropa'],
    [domainUp, null],
    [artifactUp, 'acento'],
    [toolUp, null],
    [cimaAt, 'andar'],
  ];
  const tw = focusWeights(
    frame,
    traitStarts.map(([at]) => at),
    { end: calmAt },
  ).weights;
  const traitFocus = (t: PersonTrait) => Math.max(0, ...traitStarts.map(([, tr], i) => (tr === t ? tw[i] : 0)));
  const personFocus = { ropa: Math.max(traitFocus('ropa'), replyW), acento: traitFocus('acento'), andar: traitFocus('andar') };
  // While the person is introduced (before the indicators climb), each trait also lights its level of the pyramid.
  const pre = 1 - progress(frame, hashUp - 8, 8);
  rungFocus.hash = Math.max(rungFocus.hash ?? 0, 0.7 * pre * personFocus.ropa);
  rungFocus.artifacts = Math.max(rungFocus.artifacts ?? 0, 0.7 * pre * personFocus.acento);
  rungFocus.ttps = Math.max(rungFocus.ttps ?? 0, 0.7 * pre * personFocus.andar);
  const personIn = progress(frame, personAt - 4, 18);

  // Each indicator: launch, climb as a dot, pop out at its slot.
  const chips = S04_INDICATORS.map((ind) => {
    const slot = slotOf(ind);
    const isTag = ind.rung === 'ttps';
    const tagIndex = isTag ? S04_INDICATORS.filter((i) => i.rung === 'ttps').indexOf(ind) : 0;
    const launch = isTag ? tagsAt + tagIndex * 5 : props.cue(ind.cue) - 2 + (ind.delay ?? 0);
    const climb = Math.round(10 + (L.launchY - slot.y) / 22);
    return { ind, slot, launch, land: launch + climb, climb, color: colorOf(ind.rung) };
  });

  const replyIn = progress(frame, replyAt + 6, 16);
  const hashChip = chips[0];

  return (
    <Stage>
      {/* The person, level with the pyramid's base / middle / top. */}
      {personIn > 0 ? (
        <div style={{ position: 'absolute', left: L.person.left, top: L.top }}>
          <Person width={L.person.width} height={L.height} frame={frame} show={personIn} focus={personFocus} />
        </div>
      ) : null}

      {/* The pyramid (small and low while the intercept card is up). */}
      <div
        style={{
          position: 'absolute',
          left: L.pyramid.left,
          top: L.top,
          width: L.pyramid.width,
          height: L.height,
          transform: `translateX(${dx}px) scale(${k})`,
          transformOrigin: '50% 100%',
        }}
      >
        <Pyramid width={L.pyramid.width} height={L.height} frame={frame} show={show} grey={grey} off={['ip']} focus={rungFocus} />
      </div>

      {/* Climbing dots and their trails. */}
      <svg width={1728} height={660} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        {chips.map(({ ind, slot, launch, climb, land, color }) => {
          if (frame < launch || frame > land + 24) return null;
          const t = progress(frame, launch, climb, EASE.inOut);
          const x = slot.x + 16;
          const y = mix(L.launchY, slot.y, t);
          const trail = 1 - progress(frame, land, 20);
          return (
            <g key={ind.text}>
              <line x1={x} y1={L.launchY} x2={x} y2={y} stroke={alpha(color, 0.5 * trail)} strokeWidth={3} strokeDasharray="6 8" strokeLinecap="round" />
              {frame < land + 2 ? (
                <g opacity={Math.min(1, (frame - launch + 1) / 6)}>
                  <circle cx={x} cy={y} r={20} fill={alpha(color, 0.2)} />
                  <circle cx={x} cy={y} r={9} fill={color} />
                </g>
              ) : null}
            </g>
          );
        })}
      </svg>

      {/* The indicator chips, at their rungs. */}
      {chips.map(({ ind, slot, land, color }) => {
        if (frame < land - 4) return null;
        const p = springIn(frame, fps, land - 3, { damping: 15 });
        const f = rungFocus[ind.rung] ?? 0;
        const anyOther = Math.max(0, ...RUNG_ORDER.filter((r) => r !== ind.rung).map((r) => rungFocus[r] ?? 0));
        const isHash = ind.rung === 'hash';
        const beat = isHash ? replyW * pulse(frame, fps, 0.7) : 0;
        return (
          <div
            key={ind.text}
            style={{
              position: 'absolute',
              left: slot.x,
              top: slot.y,
              transform: `translateY(-50%) scale(${0.7 + 0.3 * Math.min(1, p)})`,
              transformOrigin: 'left center',
              opacity: Math.min(1, p * 1.5),
            }}
          >
            <Focus focus={f} dim={anyOther} scale={1.12} origin="left center" frame={frame}>
              <MonoChip color={color} size={CHIP} glow={Math.max(f * 0.8, beat)}>
                {ind.text}
              </MonoChip>
            </Focus>
          </div>
        );
      })}

      {/* reply: the hash, the cheapest thing to change. */}
      {replyIn > 0 ? (
        <div
          style={{
            position: 'absolute',
            left: hashChip.slot.x + monoChipWidth(hashChip.ind.text, CHIP) * 1.12 + 34,
            top: hashChip.slot.y,
            transform: `translateY(-50%) translateX(${(1 - replyIn) * 16}px)`,
            opacity: replyIn,
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            fontFamily: FONT.sans,
          }}
        >
          <div style={{ width: 6, height: 84, borderRadius: 3, background: C.amber, boxShadow: `0 0 16px ${alpha(C.amber, 0.6)}` }} />
          <div style={{ fontSize: 40, fontWeight: 850, lineHeight: 1.05, letterSpacing: -0.5, color: C.amber, whiteSpace: 'nowrap' }}>
            <div>{S04_REPLY[0]}</div>
            <div>{S04_REPLY[1]}</div>
          </div>
        </div>
      ) : null}
    </Stage>
  );
}

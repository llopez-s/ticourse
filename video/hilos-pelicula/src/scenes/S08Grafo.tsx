import type { ReactNode } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress, pulse } from '../../../engine/src/theme/motion';
import { Chip } from '../../../engine/src/ui';
import { BRANCHES, FILMS, GRAPH, INHERIT, PROJECTED } from '../data/s08-grafo';
import { FrameCard } from './parts/EventCard';
import { FilmLabel, FilmRail, MERIDIAN_FRAMES, ORBITAL_FRAMES, VICTIMS, filmRailLayout, withFrames, type FramePhaseId } from './parts/FilmRail';
import { Branches } from './parts/s08-grafo/Branches';
import { PhaseLinks } from './parts/s08-grafo/PhaseLinks';
import { ProjectionBeam, type Rect } from './parts/s08-grafo/Projection';
import { Stage, segment, wordFrame } from './kit';

const S = 's08-grafo';
const W = 1728;
const H = 660;

// Two films of the same width line up slot for slot (FilmRail's fixed column scheme). Only the strips are drawn here
// (the rail under each is clipped away): s08 is about the films, the phases are on each frame.
const FW = 1140;
const L = filmRailLayout(FW);
/** Where the strip (Delivery's edge) starts on stage; the empty Recon/Weaponization zone left of it holds the labels. */
const STRIP_X = 190;
const RAIL_LEFT = STRIP_X - L.stripX0;
/** What came after in Meridian is written over Meridian's film, by E9 (the source of the projection). */
const CAP_TOP = 0;
const M_TOP = 96;
const O_TOP = 380;
/** Clip height: the strip and a little shadow, never the rail line (at L.railY). */
const CLIP_H = Math.round(L.stripBottom + (L.railY - L.dotR * 2 - L.stripBottom) * 0.5);
const RIGHT_X = 1136;
/** Low enough to leave air under the graph's two-line legend (it lands above the chips on `graph`). */
const CHIPS_TOP = 232;

/** A frame's rect on stage. */
function frameAt(top: number, id: FramePhaseId, col: 0 | 1 = 0): Rect {
  const r = L.frameRect(id, col);
  return { x: RAIL_LEFT + r.x, y: top + r.y, w: r.w, h: r.h };
}

const MATCH: readonly { id: FramePhaseId; col: 0 | 1 }[] = [
  { id: 'delivery', col: 0 },
  { id: 'exploitation', col: 0 },
  { id: 'installation', col: 0 },
  { id: 'c2', col: 0 },
];

/** A film strip, clipped to the strip (no rail), with its victim label in the empty zone on its left. */
function Strip({ top, children, label, tone, show = 1, dy = 0 }: { top: number; children: ReactNode; label: string; tone: string; show?: number; dy?: number }) {
  if (show <= 0) return null;
  return (
    <div style={{ position: 'absolute', left: 0, top: top + dy, width: W, height: CLIP_H, opacity: Math.min(1, show * 1.3) }}>
      <div style={{ position: 'absolute', left: RAIL_LEFT, top: 0, width: FW, height: CLIP_H, overflow: 'hidden' }}>{children}</div>
      <div style={{ position: 'absolute', left: 0, top: L.frameTop + L.frameH / 2 - 22 }}>
        <FilmLabel name={label} tone={tone} size={32} />
      </div>
    </div>
  );
}

/**
 * s08-grafo «La escena que viene»:
 *   start/reply-iv  Orbital's partial film alone, low (the intercept owns the top); its call home and the «?» gap
 *                   step forward on «la llamada»
 *   overlay         Meridian's whole film comes down over it, slot for slot
 *   match-phases    Delivery to C2 line up and link (rose links, frame to frame)
 *   projected       E9's frame casts a beam into Orbital's gap: a PROJECTED frame (dashed, translucent, light), never an
 *                   observed one; «lo que vino después en Meridian: compresión en una carpeta temporal · salida grande»
 *   inherit         «a comprobar»: qué hará después · con qué · qué busca (the tag pulses on «compruebas»)
 *   possible        two dashed branches out of the gap: «otra carpeta» · «otro destino»
 *   graph           only now ACTIVITY-ATTACK GRAPH, «lo que hizo / y lo que podría hacer» (solid / dashed legend)
 */
export function S08Grafo(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const overlayAt = props.cue('overlay');
  const matchAt = props.cue('match-phases');
  const projAt = props.cue('projected');
  const inheritAt = props.cue('inherit');
  const possibleAt = props.cue('possible');
  const graphAt = props.cue('graph');
  const s01 = segment(props, 's08-01');
  const callAt = wordFrame(S, 's08-01', 'llamada');
  const whatAt = Math.max(projAt + 14, wordFrame(S, 's08-03', 'comprimir') - 6);
  const chipAt = [wordFrame(S, 's08-04', 'hará'), wordFrame(S, 's08-04', 'herramientas'), wordFrame(S, 's08-04', 'busca')].map((f) => Math.max(inheritAt + 10, f - 6));
  const checkAt = wordFrame(S, 's08-05', 'compruebas');
  // The paths grow out of the gap with «salen otros caminos posibles»; each label lands on its word.
  const branchAt = [possibleAt + 4, possibleAt + 14];
  const branchLabelAt = [Math.max(possibleAt + 24, wordFrame(S, 's08-06', 'carpeta') - 8), Math.max(possibleAt + 34, wordFrame(S, 's08-06', 'destino') - 8)];

  // Orbital: there from the first frame; the call home and the gap step forward on «la llamada».
  const orbIn = progress(frame, 0, 14);
  const callHot = progress(frame, callAt - 6, 12) * (1 - progress(frame, overlayAt, 14));
  // Meridian comes down over Orbital once the intercept card has gone.
  const merIn = progress(frame, Math.max(overlayAt, s01.to) - 2, 26, EASE.out);
  const links = MATCH.map((_, i) => progress(frame, matchAt + 4 + i * 6, 14, EASE.inOut));
  const linkGlow = progress(frame, matchAt + 4, 14) * (1 - 0.6 * progress(frame, projAt, 16));
  // The projection.
  const beam = progress(frame, projAt - 2, 20, EASE.inOut);
  const cast = progress(frame, projAt + 12, 18);
  const castGlow = cast * (0.7 + 0.3 * pulse(frame, fps, 0.5)) * (1 - 0.35 * progress(frame, inheritAt, 20));
  const lead = enter(frame, projAt + 10, { distance: 14 });
  const what = enter(frame, whatAt, { distance: 14 });
  // Hypotheses, branches, name.
  const tag = enter(frame, inheritAt, { distance: 14 });
  const tagPulse = progress(frame, checkAt - 4, 10) * (1 - progress(frame, checkAt + 26, 16));
  const branch = branchAt.map((f) => progress(frame, f, 26, EASE.inOut));
  const branchLabel = branchLabelAt.map((f) => progress(frame, f, 12));
  const name = enter(frame, graphAt, { distance: 18 });
  const legend = [enter(frame, graphAt + 10, { distance: 10 }), enter(frame, graphAt + 18, { distance: 10 })];

  // E9's line is long for a frame at this size: fitLine shrinks it to fit (it is also written out above the film).
  const mFrames = withFrames(MERIDIAN_FRAMES, {
    'm-e9': {
      fitLine: true, glow: Math.max(0.5 * beam, 0.3 * castGlow), focus: 0.6 * beam * (1 - progress(frame, inheritAt, 20)) },
    ...Object.fromEntries(MATCH.map((m, i) => [MERIDIAN_FRAMES.find((f) => f.phase === m.id && (f.col ?? 0) === m.col)!.key, { glow: 0.5 * links[i] * linkGlow }])),
  });
  const oFrames = withFrames(ORBITAL_FRAMES, {
    'o-c2': { focus: callHot, glow: 0.5 * links[3] * linkGlow },
    'o-actions': { focus: callHot, q: 1 - cast },
    'o-delivery': { glow: 0.5 * links[0] * linkGlow },
    'o-exploitation': { glow: 0.5 * links[1] * linkGlow },
    'o-installation': { glow: 0.5 * links[2] * linkGlow },
  });

  const mE9 = frameAt(M_TOP, 'actions');
  const gap = frameAt(O_TOP, 'actions');
  const e9 = MERIDIAN_FRAMES.find((f) => f.key === 'm-e9')!;

  return (
    <Stage>
      <div style={{ position: 'absolute', inset: 0, fontFamily: FONT.sans }}>
        {/* Orbital's partial film */}
        <Strip top={O_TOP} label={FILMS.orbital} tone={VICTIMS.orbital.tone} show={orbIn}>
          <FilmRail width={FW} frames={oFrames} rail={0} names={0} slots={0} kicker={0} stems={0} thread={1} film={1} tone={VICTIMS.orbital.tone} />
        </Strip>
        {/* The projected frame in Orbital's gap: light, dashed — never an observed photo */}
        {cast > 0 ? (
          <div style={{ position: 'absolute', left: gap.x, top: gap.y, opacity: cast, transform: `scale(${0.96 + 0.04 * cast})` }}>
            <FrameCard width={gap.w} height={gap.h} look="projected" id={e9.id} date={e9.date} phase="Actions on Objectives" line={e9.line} fitLine diamond glow={castGlow} film={1} />
          </div>
        ) : null}
        {/* Meridian's whole film, over it */}
        <Strip top={M_TOP} label={FILMS.meridian} tone={VICTIMS.meridian.tone} show={merIn} dy={(1 - merIn) * -60}>
          <FilmRail width={FW} frames={mFrames} rail={0} names={0} slots={0} kicker={0} stems={0} thread={1} film={1} tone={VICTIMS.meridian.tone} />
        </Strip>
        <PhaseLinks pairs={MATCH.map((m, i) => ({ top: frameAt(M_TOP, m.id, m.col), bottom: frameAt(O_TOP, m.id, m.col), draw: links[i] }))} width={W} height={H} glow={linkGlow} />
        <ProjectionBeam from={mE9} to={gap} reach={beam} glow={Math.max(0.35, castGlow) * beam} land={0.92} width={W} height={H} />

        {/* What the projection carries, over its source (E9) */}
        <div style={{ position: 'absolute', left: STRIP_X, top: CAP_TOP, width: mE9.x + mE9.w - STRIP_X, textAlign: 'right' }}>
          <div style={{ fontSize: 32, fontWeight: 700, color: C.roseSoft, whiteSpace: 'nowrap', ...lead }}>{PROJECTED.lead}</div>
          <div style={{ marginTop: 4, fontSize: 36, fontWeight: 800, color: C.textStrong, whiteSpace: 'nowrap', ...what }}>{PROJECTED.what}</div>
        </div>

        {/* Out of the gap: the possible paths */}
        <Branches
          from={{ x: gap.x + gap.w + 6, y: gap.y + gap.h / 2 }}
          branches={[
            { to: { x: RIGHT_X + 64, y: gap.y + gap.h / 2 - 72 }, label: BRANCHES[0], draw: branch[0], labelShow: branchLabel[0] },
            { to: { x: RIGHT_X + 64, y: gap.y + gap.h / 2 + 72 }, label: BRANCHES[1], draw: branch[1], labelShow: branchLabel[1] },
          ]}
          width={W}
          height={H}
          size={34}
          glow={0.5 * progress(frame, graphAt, 16)}
        />

        {/* Inherited hypotheses, to check (beside the group's film they come from) */}
        <div style={{ position: 'absolute', left: RIGHT_X, top: CHIPS_TOP, width: W - RIGHT_X, display: 'flex', flexWrap: 'wrap', gap: 12, ...tag }}>
          <Chip
            accent="amber"
            size={32}
            solid={tagPulse > 0.5}
            style={{ boxShadow: tagPulse > 0.02 ? `0 0 ${Math.round(26 * tagPulse)}px ${alpha(C.amber, 0.5 * tagPulse)}` : undefined }}
          >
            {INHERIT.tag}
          </Chip>
          {INHERIT.chips.map((c, i) => {
            const p = progress(frame, chipAt[i], 12);
            return (
              <Chip key={c} accent="muted" size={32} style={{ opacity: p, transform: `translateY(${(1 - p) * 10}px)`, borderStyle: 'dashed' }}>
                {c}
              </Chip>
            );
          })}
        </div>

        {/* Only now, the name */}
        <div style={{ position: 'absolute', left: RIGHT_X, top: CAP_TOP }}>
          <div style={{ fontSize: 44, fontWeight: 900, lineHeight: 1.04, letterSpacing: 1.5, color: '#c4b5fd', textShadow: `0 0 18px ${alpha(C.violet, 0.45)}`, whiteSpace: 'nowrap', ...name }}>
            {GRAPH.name.map((l) => (
              <div key={l}>{l}</div>
            ))}
          </div>
          <div style={{ marginTop: 10, height: 4, width: 220 * progress(frame, graphAt + 6, 16), background: C.violet, borderRadius: 2 }} />
          <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {GRAPH.sub.map((s, i) => (
              <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 32, fontWeight: 700, color: C.text, whiteSpace: 'nowrap', ...legend[i] }}>
                <svg width={52} height={10} style={{ flex: 'none', overflow: 'visible' }}>
                  <line x1={2} y1={5} x2={50} y2={5} stroke={C.rose} strokeWidth={5} strokeLinecap="round" strokeDasharray={i === 0 ? undefined : '9 7'} />
                </svg>
                {s}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Stage>
  );
}

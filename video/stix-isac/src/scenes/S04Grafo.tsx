import type { ReactNode } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { EASE, progress, pulse, springIn } from '../../../engine/src/theme/motion';
import { Icon, clamp01, focusWeights, mix, windowWeight, tone as toneOf, type IconName, type Tone } from '../../../engine/src/ui';
import {
  S04_ACTION,
  S04_DOMAIN,
  S04_EDGES,
  S04_ISAC_SOURCE,
  S04_NODES,
  S04_OWN_SOURCE,
  S04_QUESTION,
  S04_RELATIONSHIP,
  S04_SOURCES_LABEL,
} from '../data/s04-grafo';
import { Stage, wordFrame } from './kit';
import { ContactCard, MergeBadge, POSTIT, PostIt, contactCardHeight, type ContactSource } from './parts/ContactCard';
import { TIP_HEADER_H, TipFrame } from './parts/TipFrame';

const S = 's04-grafo';

// ---------------------------------------------------------------------------
// Layout. Stage-local (1728×660) for the post-it and the panel; body-local
// (inside the TIP window, below its title bar) for the graph.

const PANEL = { x: 270, w: 1458, h: 660 };
const BODY = { w: PANEL.w, h: PANEL.h - TIP_HEADER_H };

const ROW = 32;
const CONTACT = { x: 24, y: 20, w: 720, h: contactCardHeight(2, 4, ROW) };
const COL = { x: 930, w: 504 };
const INTRUSION = { x: COL.x, y: 20, w: COL.w, h: 116 };
const MALWARE = { x: COL.x, y: 236, w: COL.w, h: 116 };
const ACTION = { x: 24, y: 432, w: 720, h: 136 };
const CALLOUT = { x: COL.x, y: 432, w: COL.w, h: 136 };
const DUP = { x: 762, y: 34, w: 680 };

const EDGE_Y = MALWARE.y + MALWARE.h / 2;
const IND = { from: { x: CONTACT.x + CONTACT.w, y: EDGE_Y }, to: { x: MALWARE.x, y: EDGE_Y } };
const USES_X = COL.x + COL.w / 2;
const USES = { from: { x: USES_X, y: INTRUSION.y + INTRUSION.h }, to: { x: USES_X, y: MALWARE.y } };
const IND_PILL = { x: (IND.from.x + IND.to.x) / 2, y: EDGE_Y };
const USES_PILL = { x: USES_X, y: (USES.from.y + USES.to.y) / 2 };

// The post-it with its question: centred and big alone, then a dimmed reminder at the left.
const GROUP_W = 600;
const POST_TOP = 186;
const G1 = { x: (1728 - GROUP_W) / 2, y: 8, k: 1 };
const G2 = { x: 6, y: 190, k: 0.4 };

/** Beats in narration order; each element lights in the beats it belongs to and steps back in the others. */
type Beat = 'graph' | 'indicates' | 'uses' | 'action' | 'relationship' | 'merge' | 'sources';
type El = 'contact' | 'malware' | 'intrusion' | 'indEdge' | 'usesEdge' | 'action' | 'callout';
const BEATS: Beat[] = ['graph', 'indicates', 'uses', 'action', 'relationship', 'merge', 'sources'];
const OWNS: Record<Beat, El[]> = {
  graph: ['contact'],
  indicates: ['contact', 'indEdge', 'malware'],
  uses: ['intrusion', 'usesEdge', 'malware'],
  action: ['action', 'malware', 'contact'],
  relationship: ['indEdge', 'usesEdge', 'callout'],
  merge: ['contact'],
  sources: ['contact'],
};
/** How far the others step back in each beat (0–1). */
const DIM_K: Record<Beat, number> = { graph: 0, indicates: 0.7, uses: 0.7, action: 0.8, relationship: 0.8, merge: 1, sources: 0.75 };

/**
 * s04-grafo «Un pósit o un contacto».
 *   postit        a lone yellow post-it with the bare domain, centred, under
 *                 «¿y si aparece en tus registros?»; a faint «?» at «sabrías»
 *   graph         the post-it steps back to the left (a dimmed reminder);
 *                 Meridian's TIP opens on the right with the indicator as a
 *                 contact: «indicator · cdn-sync-status.example», its own source
 *   indicates     indicator «indicates» malware · loader GLASS VIPER (edge draws)
 *   uses          intrusion-set · VELVET CICADA «uses» that malware (arrow into it)
 *   action        chip «si aparece en un equipo: busca allí el loader»
 *   relationship  the edges light; a leader from «indicates» to the callout
 *                 «relationship · también es un objeto STIX» (exam card after)
 *   merge         ON the cue: the ISAC's duplicate (the same contact card, sky)
 *                 slides in from the window's edge and the merge badge pops with
 *                 its check (sfx «check»); at «funde» it slides into the contact
 *   sources       one contact with two sources; each row lights as it is named;
 *                 AMBER+STRICT survives the merge
 */
export function S04Grafo(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const postitAt = props.cue('postit');
  const graphAt = props.cue('graph');
  const indicatesAt = props.cue('indicates');
  const usesAt = props.cue('uses');
  const actionAt = props.cue('action');
  const relAt = props.cue('relationship');
  const mergeAt = props.cue('merge');
  const sourcesAt = props.cue('sources');
  const suponAt = wordFrame(S, 's04-01', 'Supón');
  const sabriasAt = wordFrame(S, 's04-01', 'sabrías');
  const fundeAt = Math.max(mergeAt + 24, wordFrame(S, 's04-05', 'funde'));
  const incidenteAt = Math.max(sourcesAt, wordFrame(S, 's04-06', 'incidente'));
  const isacAt = Math.max(incidenteAt + 8, wordFrame(S, 's04-06', 'ISAC'));

  // --- beat weights → glow / dim per element
  const beatAt: Record<Beat, number> = {
    graph: graphAt,
    indicates: indicatesAt,
    uses: usesAt,
    action: actionAt,
    relationship: relAt,
    merge: mergeAt,
    sources: sourcesAt,
  };
  const { weights } = focusWeights(
    frame,
    BEATS.map((b) => beatAt[b]),
  );
  const wOf = (b: Beat) => weights[BEATS.indexOf(b)];
  const glowOf = (el: El) => Math.max(0, ...BEATS.filter((b) => OWNS[b].includes(el)).map(wOf));
  const dimOf = (el: El) => {
    const g = glowOf(el);
    const d = Math.max(0, ...BEATS.filter((b) => !OWNS[b].includes(el)).map((b) => wOf(b) * DIM_K[b]));
    return d * (1 - g);
  };

  // --- phase 1 → 2: the post-it group moves left and steps back
  const postIn = springIn(frame, fps, Math.min(4, postitAt - 6), { damping: 15 });
  const qIn = progress(frame, Math.max(postitAt, suponAt - 6), 14);
  const toSide = progress(frame, graphAt - 12, 20, EASE.inOut);
  const gx = mix(G1.x, G2.x, toSide);
  const gy = mix(G1.y, G2.y, toSide);
  const gk = mix(G1.k, G2.k, toSide);
  const qMark = progress(frame, sabriasAt - 4, 12) * (1 - progress(frame, graphAt - 10, 10));

  // --- the panel and the graph
  const panelIn = progress(frame, graphAt + 6, 18);
  const contactIn = springIn(frame, fps, graphAt + 12, { damping: 16 });
  const ownRowIn = progress(frame, graphAt + 22, 14);
  const malwareIn = springIn(frame, fps, indicatesAt + 6, { damping: 15 });
  const indDraw = progress(frame, indicatesAt - 2, 16, EASE.inOut);
  const indPillIn = progress(frame, indicatesAt + 8, 10);
  const intrusionIn = springIn(frame, fps, usesAt, { damping: 15 });
  const usesDraw = progress(frame, usesAt + 4, 14, EASE.inOut);
  const usesPillIn = progress(frame, usesAt + 12, 10);
  const actionIn = springIn(frame, fps, actionAt - 2, { damping: 16 });
  const leaderDraw = progress(frame, relAt + 2, 14, EASE.inOut);
  const calloutIn = springIn(frame, fps, relAt + 8, { damping: 16 });

  // --- merge: everything starts ON the cue (the «check» sound)
  const dupIn = progress(frame, mergeAt, 16, EASE.out);
  const badgePop = frame >= mergeAt ? springIn(frame, fps, mergeAt, { damping: 11, mass: 0.6 }) : 0;
  const badgeCheck = frame >= mergeAt + 6 ? springIn(frame, fps, mergeAt + 6, { damping: 12, mass: 0.6 }) : 0;
  const fuse = progress(frame, fundeAt - 4, 18, EASE.inOut);
  const badgeOut = 1 - progress(frame, fundeAt + 12, 12);
  const isacRowIn = progress(frame, fundeAt + 8, 14);
  const mergeFlash = windowWeight(frame, fundeAt + 4, fundeAt + 34, { ramp: 8, lead: 0 });

  // --- sources: the contact in focus, each row as it is named
  const contactScale = 1;
  const ownHot = windowWeight(frame, incidenteAt, Number.POSITIVE_INFINITY, { ramp: 10 });
  const isacHot = windowWeight(frame, isacAt, Number.POSITIVE_INFINITY, { ramp: 10 });

  const sources: ContactSource[] = [
    { lines: [S04_OWN_SOURCE], tone: 'cyan', show: ownRowIn, hot: ownHot },
    { lines: isacLines(), tone: 'sky', show: isacRowIn, hot: isacHot },
  ];

  const beat = pulse(frame, fps, 0.6);

  return (
    <Stage>
      {/* The post-it and its question (phase 1 centred; then a dimmed reminder at the left). */}
      <div style={{ position: 'absolute', left: gx, top: gy, width: GROUP_W, transform: `scale(${gk})`, transformOrigin: '0 0' }}>
        <div
          style={{
            height: POST_TOP - 36,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: FONT.sans,
            fontSize: 52,
            fontWeight: 850,
            lineHeight: 1.08,
            letterSpacing: -1,
            color: C.textStrong,
            opacity: qIn * (1 - 0.55 * toSide),
            transform: `translateY(${(1 - qIn) * 14}px)`,
          }}
        >
          {S04_QUESTION.map((l) => (
            <div key={l} style={{ whiteSpace: 'nowrap' }}>
              {l}
            </div>
          ))}
        </div>
        <div style={{ position: 'absolute', left: (GROUP_W - POSTIT.w) / 2, top: POST_TOP, transform: `scale(${0.85 + 0.15 * Math.min(1, postIn)})`, transformOrigin: '50% 40%' }}>
          <PostIt text={S04_DOMAIN} show={Math.min(1, postIn * 1.4)} dim={toSide} />
        </div>
        {qMark > 0 ? (
          <div
            style={{
              position: 'absolute',
              left: GROUP_W - 10,
              top: POST_TOP + 70,
              fontFamily: FONT.sans,
              fontSize: 150,
              fontWeight: 850,
              color: alpha(C.amber, 0.75),
              opacity: qMark,
              transform: `rotate(10deg) translateY(${(1 - qMark) * 20}px)`,
            }}
          >
            ?
          </div>
        ) : null}
      </div>

      {/* Meridian's TIP with the graph. */}
      {panelIn > 0 ? (
        <div style={{ position: 'absolute', left: PANEL.x, top: 0, transform: `translateX(${(1 - panelIn) * 70}px)` }}>
          <TipFrame width={PANEL.w} height={PANEL.h} at={graphAt + 6} frame={frame}>
            {/* edges + leader */}
            <svg width={BODY.w} height={BODY.h} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
              <Edge from={IND.from} to={IND.to} draw={indDraw} lit={glowOf('indEdge')} dim={dimOf('indEdge')} />
              <Edge from={USES.from} to={USES.to} draw={usesDraw} lit={glowOf('usesEdge')} dim={dimOf('usesEdge')} />
              {leaderDraw > 0 ? (
                <Leader
                  d={`M ${IND_PILL.x} ${EDGE_Y + 22} C ${IND_PILL.x} ${CALLOUT.y + 40}, ${CALLOUT.x - 70} ${CALLOUT.y + CALLOUT.h / 2}, ${CALLOUT.x - 4} ${CALLOUT.y + CALLOUT.h / 2}`}
                  draw={leaderDraw}
                  dim={dimOf('callout')}
                />
              ) : null}
            </svg>

            {/* nodes */}
            <Positioned box={INTRUSION}>
              <GraphNode kind={S04_NODES.intrusionSet.kind} name={S04_NODES.intrusionSet.name} icon="users" tone="rose" show={intrusionIn} glow={glowOf('intrusion')} dim={dimOf('intrusion')} w={INTRUSION.w} h={INTRUSION.h} />
            </Positioned>
            <Positioned box={MALWARE}>
              <GraphNode
                kind={S04_NODES.malware.kind}
                name={S04_NODES.malware.name}
                icon="bolt"
                tone="rose"
                show={malwareIn}
                glow={glowOf('malware')}
                dim={dimOf('malware')}
                w={MALWARE.w}
                h={MALWARE.h}
                ring={wOf('action') * (0.7 + 0.3 * beat)}
              />
            </Positioned>

            {/* relationship pills, on the edges */}
            <RelPill text={S04_EDGES.indicates} at={IND_PILL} show={indPillIn} lit={glowOf('indEdge')} dim={dimOf('indEdge')} beat={wOf('relationship') * beat} />
            <RelPill text={S04_EDGES.uses} at={USES_PILL} show={usesPillIn} lit={glowOf('usesEdge')} dim={dimOf('usesEdge')} beat={wOf('relationship') * beat} />

            {/* action chip, under the contact */}
            <Positioned box={ACTION}>
              <ActionChip lines={S04_ACTION} show={actionIn} glow={glowOf('action')} dim={dimOf('action')} w={ACTION.w} h={ACTION.h} />
            </Positioned>

            {/* relationship callout, under the malware, tied to «indicates» */}
            <Positioned box={CALLOUT}>
              <RelCallout kind={S04_RELATIONSHIP.kind} text={S04_RELATIONSHIP.text} show={calloutIn} glow={glowOf('callout')} dim={dimOf('callout')} w={CALLOUT.w} h={CALLOUT.h} />
            </Positioned>

            {/* the contact: the indicator in your address book */}
            {contactIn > 0.001 ? (
              <div
                style={{
                  position: 'absolute',
                  left: CONTACT.x,
                  top: CONTACT.y,
                  transform: `scale(${(0.92 + 0.08 * Math.min(1, contactIn)) * contactScale})`,
                  transformOrigin: '0 0',
                }}
              >
                <ContactCard
                  kind={S04_NODES.indicator.kind}
                  name={S04_NODES.indicator.name}
                  sources={sources}
                  sourcesLabel={S04_SOURCES_LABEL}
                  width={CONTACT.w}
                  height={CONTACT.h}
                  rowSize={ROW}
                  tone="cyan"
                  show={Math.min(1, contactIn * 1.4)}
                  glow={glowOf('contact')}
                  dim={dimOf('contact')}
                  merge={mergeFlash}
                />
              </div>
            ) : null}

            {/* the ISAC's duplicate: slides in from the window's edge, then into the contact */}
            {dupIn > 0 && fuse < 1 ? (
              <div
                style={{
                  position: 'absolute',
                  left: mix(DUP.x + 760 * (1 - dupIn), CONTACT.x, fuse),
                  top: mix(DUP.y, CONTACT.y, fuse),
                  opacity: 1 - progress(frame, fundeAt + 2, 12),
                  transform: `scale(${1 - 0.04 * fuse})`,
                  transformOrigin: '0 0',
                }}
              >
                <ContactCard
                  kind={S04_NODES.indicator.kind}
                  name={S04_NODES.indicator.name}
                  sources={[{ lines: isacLines(), tone: 'sky' }]}
                  sourcesLabel={S04_SOURCES_LABEL}
                  width={DUP.w}
                  rowSize={ROW}
                  tone="sky"
                  glow={0.6}
                />
              </div>
            ) : null}

            {/* the «merge contacts» badge between the two */}
            {badgePop > 0.001 && badgeOut > 0 ? (
              <div style={{ position: 'absolute', left: (CONTACT.x + CONTACT.w + DUP.x) / 2 - 50, top: CONTACT.y + 66 - 50 + 30 * fuse, opacity: badgeOut }}>
                <MergeBadge size={100} pop={badgePop} check={badgeCheck} />
              </div>
            ) : null}
          </TipFrame>
        </div>
      ) : null}
    </Stage>
  );
}

// ---------------------------------------------------------------------------

/** The ISAC source as three lines (broken at its « · »): source and date, confidence, then the marking and the expiry as amber chips. */
function isacLines() {
  return [
    S04_ISAC_SOURCE.line[0],
    S04_ISAC_SOURCE.line[1],
    <span key="chips" style={{ display: 'inline-flex', alignItems: 'center', gap: 12 }}>
      <AmberChip>{S04_ISAC_SOURCE.marking}</AmberChip>
      <span style={{ color: C.muted }}>·</span>
      <AmberChip>{S04_ISAC_SOURCE.expired}</AmberChip>
    </span>,
  ];
}

function AmberChip({ children }: { children: string }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        height: 40,
        padding: '0 16px',
        borderRadius: RADIUS.pill,
        border: `2px solid ${alpha(C.amber, 0.8)}`,
        background: alpha(C.amber, 0.14),
        color: '#fcd34d',
        fontSize: 28,
        fontWeight: 800,
        letterSpacing: 0.5,
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </span>
  );
}

function Positioned({ box, children }: { box: { x: number; y: number }; children: ReactNode }) {
  return <div style={{ position: 'absolute', left: box.x, top: box.y }}>{children}</div>;
}

/** A STIX object node: icon disc, mono kicker (type) and name. */
function GraphNode({
  kind,
  name,
  icon,
  tone,
  show,
  glow,
  dim,
  w,
  h,
  ring = 0,
}: {
  kind: string;
  name: string;
  icon: IconName;
  tone: Tone;
  show: number;
  glow: number;
  dim: number;
  w: number;
  h: number;
  /** 0–1 emerald ring: «busca allí el loader». */
  ring?: number;
}) {
  if (show <= 0.001) return null;
  const t = toneOf(tone);
  const g = clamp01(glow);
  const d = clamp01(dim);
  const r = clamp01(ring);
  return (
    <div
      style={{
        width: w,
        height: h,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        gap: 18,
        padding: '0 22px',
        borderRadius: 20,
        border: `${g > 0.3 || r > 0.3 ? 3 : 2}px solid ${r > 0.3 ? alpha(C.emerald, 0.6 + 0.4 * r) : alpha(t.fg, 0.45 + 0.5 * g)}`,
        background: `linear-gradient(180deg, ${alpha(t.fg, 0.1 + 0.08 * g)} 0%, ${C.ink900} 100%)`,
        boxShadow: `0 18px 40px ${alpha('#000000', 0.35)}${g > 0.02 ? `, 0 0 ${Math.round(30 * g)}px ${alpha(t.fg, 0.35 * g)}` : ''}${r > 0.02 ? `, 0 0 ${Math.round(34 * r)}px ${alpha(C.emerald, 0.45 * r)}` : ''}`,
        opacity: Math.min(1, show * 1.4) * (1 - 0.6 * d),
        filter: d > 0.01 ? `saturate(${1 - 0.5 * d})` : undefined,
        transform: `scale(${0.88 + 0.12 * Math.min(1, show)})`,
        fontFamily: FONT.sans,
      }}
    >
      <div style={{ width: 58, height: 58, borderRadius: 29, flexShrink: 0, display: 'grid', placeItems: 'center', background: alpha(t.fg, 0.16), border: `2px solid ${alpha(t.fg, 0.7)}` }}>
        <Icon name={icon} size={32} color={t.fg} />
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontFamily: FONT.mono, fontSize: 24, fontWeight: 650, color: t.soft, lineHeight: 1.2 }}>{kind}</div>
        <div style={{ fontSize: 36, fontWeight: 800, color: C.textStrong, lineHeight: 1.2, whiteSpace: 'nowrap', letterSpacing: -0.5 }}>{name}</div>
      </div>
    </div>
  );
}

/** A relationship edge with an arrowhead at `to` (straight; horizontal or vertical). */
function Edge({ from, to, draw, lit, dim }: { from: { x: number; y: number }; to: { x: number; y: number }; draw: number; lit: number; dim: number }) {
  if (draw <= 0) return null;
  const len = Math.hypot(to.x - from.x, to.y - from.y);
  const ux = (to.x - from.x) / len;
  const uy = (to.y - from.y) / len;
  const head = 18;
  const end = { x: from.x + ux * (len - 4) * draw, y: from.y + uy * (len - 4) * draw };
  const color = lit > 0.3 ? C.violet : alpha(C.violet, 0.75);
  const op = 1 - 0.6 * clamp01(dim);
  // Arrowhead triangle at the end of the drawn part.
  const px = -uy;
  const py = ux;
  const base = { x: end.x - ux * head, y: end.y - uy * head };
  const pts = `${end.x},${end.y} ${base.x + px * head * 0.6},${base.y + py * head * 0.6} ${base.x - px * head * 0.6},${base.y - py * head * 0.6}`;
  return (
    <g opacity={op}>
      <line x1={from.x} y1={from.y} x2={base.x} y2={base.y} stroke={color} strokeWidth={4 + 2 * clamp01(lit)} strokeLinecap="round" />
      {lit > 0.02 ? <line x1={from.x} y1={from.y} x2={base.x} y2={base.y} stroke={alpha(C.violet, 0.3 * lit)} strokeWidth={16} strokeLinecap="round" /> : null}
      <polygon points={pts} fill={color} />
    </g>
  );
}

/** The dashed leader from an edge's pill to the relationship callout. */
function Leader({ d, draw, dim }: { d: string; draw: number; dim: number }) {
  const L = 420;
  return (
    <path
      d={d}
      fill="none"
      stroke={alpha(C.violet, 0.85 * (1 - 0.6 * clamp01(dim)))}
      strokeWidth={3}
      strokeDasharray={`${L * draw} ${L}`}
      strokeLinecap="round"
    />
  );
}

/** Relationship type on an edge: a violet mono pill. */
function RelPill({ text, at, show, lit, dim, beat }: { text: string; at: { x: number; y: number }; show: number; lit: number; dim: number; beat: number }) {
  if (show <= 0.001) return null;
  const l = clamp01(Math.max(lit, beat));
  return (
    <div
      style={{
        position: 'absolute',
        left: at.x,
        top: at.y,
        transform: `translate(-50%, -50%) scale(${0.85 + 0.15 * show + 0.06 * clamp01(beat)})`,
        display: 'inline-flex',
        alignItems: 'center',
        height: 48,
        padding: '0 14px',
        borderRadius: RADIUS.pill,
        border: `2px solid ${alpha(C.violet, 0.55 + 0.45 * l)}`,
        background: C.ink900,
        boxShadow: l > 0.02 ? `0 0 ${Math.round(22 * l)}px ${alpha(C.violet, 0.5 * l)}` : 'none',
        fontFamily: FONT.mono,
        fontSize: 32,
        fontWeight: 750,
        color: l > 0.3 ? C.textStrong : '#c4b5fd',
        whiteSpace: 'nowrap',
        opacity: show * (1 - 0.6 * clamp01(dim)),
      }}
    >
      {text}
    </div>
  );
}

/** «si aparece en un equipo: busca allí el loader» (emerald: the search you run). */
function ActionChip({ lines, show, glow, dim, w, h }: { lines: readonly [string, string]; show: number; glow: number; dim: number; w: number; h: number }) {
  if (show <= 0.001) return null;
  const g = clamp01(glow);
  return (
    <div
      style={{
        width: w,
        height: h,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        gap: 24,
        padding: '0 28px',
        borderRadius: 24,
        border: `${g > 0.3 ? 3 : 2}px solid ${alpha(C.emerald, 0.5 + 0.45 * g)}`,
        background: `linear-gradient(180deg, ${alpha(C.emerald, 0.1 + 0.06 * g)} 0%, ${C.ink900} 100%)`,
        boxShadow: g > 0.02 ? `0 0 ${Math.round(34 * g)}px ${alpha(C.emerald, 0.3 * g)}` : `0 18px 40px ${alpha('#000000', 0.35)}`,
        opacity: Math.min(1, show * 1.4) * (1 - 0.6 * clamp01(dim)),
        filter: dim > 0.01 ? `saturate(${1 - 0.5 * clamp01(dim)})` : undefined,
        transform: `translateY(${(1 - Math.min(1, show)) * 18}px)`,
        fontFamily: FONT.sans,
      }}
    >
      <div style={{ width: 76, height: 76, borderRadius: 38, flexShrink: 0, display: 'grid', placeItems: 'center', background: alpha(C.emerald, 0.15), border: `3px solid ${alpha(C.emerald, 0.8)}` }}>
        <Icon name="search" size={42} color={C.emerald} strokeWidth={2.2} />
      </div>
      <div style={{ fontSize: 38, fontWeight: 800, lineHeight: 1.18, letterSpacing: -0.5 }}>
        <div style={{ color: '#6ee7b7', whiteSpace: 'nowrap' }}>{lines[0]}</div>
        <div style={{ color: C.textStrong, whiteSpace: 'nowrap' }}>{lines[1]}</div>
      </div>
    </div>
  );
}

/** «relationship · también es un objeto STIX»: the edge is itself an object (violet: exam term). */
function RelCallout({ kind, text, show, glow, dim, w, h }: { kind: string; text: string; show: number; glow: number; dim: number; w: number; h: number }) {
  if (show <= 0.001) return null;
  const g = clamp01(glow);
  return (
    <div
      style={{
        width: w,
        height: h,
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: 6,
        padding: '0 26px',
        borderRadius: 22,
        border: `${g > 0.3 ? 3 : 2}px solid ${alpha(C.violet, 0.5 + 0.45 * g)}`,
        background: `linear-gradient(180deg, ${alpha(C.violet, 0.14 + 0.08 * g)} 0%, ${C.ink900} 100%)`,
        boxShadow: g > 0.02 ? `0 0 ${Math.round(34 * g)}px ${alpha(C.violet, 0.35 * g)}` : `0 18px 40px ${alpha('#000000', 0.35)}`,
        opacity: Math.min(1, show * 1.4) * (1 - 0.6 * clamp01(dim)),
        filter: dim > 0.01 ? `saturate(${1 - 0.5 * clamp01(dim)})` : undefined,
        transform: `scale(${0.9 + 0.1 * Math.min(1, show)})`,
        transformOrigin: '0 50%',
        fontFamily: FONT.sans,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Icon name="link" size={34} color={C.violet} strokeWidth={2.2} />
        <span style={{ fontFamily: FONT.mono, fontSize: 34, fontWeight: 800, color: '#c4b5fd', whiteSpace: 'nowrap' }}>{kind}</span>
      </div>
      <div style={{ fontSize: 34, fontWeight: 750, color: C.textStrong, whiteSpace: 'nowrap', letterSpacing: -0.3 }}>{text}</div>
    </div>
  );
}

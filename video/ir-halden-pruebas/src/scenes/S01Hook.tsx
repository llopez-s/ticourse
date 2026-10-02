import type { ReactNode } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress, springIn } from '../../../engine/src/theme/motion';
import { Icon, Stamp, clamp01, dimStyle, tone as toneOf, type IconName, type Tone } from '../../../engine/src/ui';
import { BRIDGE, HIGHLIGHT_ROW, IMPROVEMENTS, LIST_TEXT, PROMISE, TITLE } from '../data/s01-hook';
import { BellOff, ImprovementRow } from './parts/Bits';
import { ArtFrame, DrillArt, MesaArt, WAY_TONE, twoWaysSize } from './parts/TwoWays';
import { Stage, wordFrame } from './kit';

const S = 's01-hook';
const W = 1728;

/** The list, full size (phase A) and pushed under the title (phase B). */
const LIST = { top: 96, lowTop: 226, lowScale: 0.78, headH: 50, pitch: 62, rowH: 52, textX: 60, ownerX: 1236, dateX: 1560 };
const TITLE_TOP = 0;
const TILE_W = 380;
const TILE_GAP = 70;
const TILES_TOP = 232;
const STRIP_TOP = 244;
const STRIP_H = 310;

/**
 * s01-hook «¿Funciona el plan nuevo?». The problem first: the list of
 * improvements from the 11-09 meeting (V5 s09's six rows, owner and date),
 * with the deputies row lit; a «¿funciona?» stamp lands on it. The title
 * «Antes del próximo incidente» and its line «tabletop · simulation · threat
 * hunting». The promise: the table with a script, the fire drill and a
 * magnifier for the hunt (under a silenced bell: no alarm has gone off). Then
 * the bridge with V5 in one strip: septiembre · ADM-WS-02 sin aislar · nadie
 * de guardia podía autorizarlo, flowing into «ahora: suplentes que pueden
 * aislar».
 */
export function S01Hook(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const title = props.cue('title');
  const promise = props.cue('promise');
  const bridge = props.cue('bridge');

  const suplentes = wordFrame(S, 's01-01', 'suplentes');
  const funciona = wordFrame(S, 's01-01', 'funciona');
  const antes = wordFrame(S, 's01-01', 'antes');
  const promiseAt = PROMISE.map((p) => wordFrame(S, 's01-02', p.word));
  const alarma = wordFrame(S, 's01-02', 'alarma.');
  const horas = wordFrame(S, 's01-03', 'horas');
  const nadie = wordFrame(S, 's01-03', 'nadie');
  const ahora = wordFrame(S, 's01-03', 'Ahora');

  // Phase A → B: the list steps down under the title; it leaves for the promise.
  // The list is already forming during the silent lead before the voice.
  const listIn = 2;
  // It steps down as the title arrives, carrying the stamp that landed on it.
  const listDown = progress(frame, antes - 16, 20, EASE.inOut);
  const listOut = progress(frame, promise - 10, 14, EASE.inOut);
  const lit = progress(frame, suplentes - 6, 12);

  // Title (stays to the end), tiles (promise), strip (bridge).
  const titleIn = springIn(frame, fps, antes - 8, { damping: 17 });
  const termsAt = antes + 8;
  const tilesOut = progress(frame, bridge - 10, 14, EASE.inOut);

  return (
    <Stage>
      {listOut < 1 ? (
        <ImprovementList
          frame={frame}
          fps={fps}
          at={listIn}
          lit={lit}
          stampAt={Math.max(title + 6, funciona - 4)}
          down={listDown}
          out={listOut}
        />
      ) : null}

      {frame >= antes - 10 ? <TitleBlock frame={frame} p={titleIn} termsAt={termsAt} /> : null}

      {frame >= promiseAt[0] - 10 && tilesOut < 1 ? (
        <Promise frame={frame} fps={fps} at={promiseAt} alarmAt={alarma - 6} out={tilesOut} />
      ) : null}

      {frame >= bridge - 8 ? <BridgeStrip frame={frame} fps={fps} at={[bridge - 2, horas - 4, nadie - 4, ahora - 4]} /> : null}
    </Stage>
  );
}

// ---------------------------------------------------------------------------
// Phase A/B: the improvements of the 11-09 meeting, and the stamp
// ---------------------------------------------------------------------------

function ImprovementList({
  frame,
  fps,
  at,
  lit,
  stampAt,
  down,
  out,
}: {
  frame: number;
  fps: number;
  at: number;
  lit: number;
  stampAt: number;
  down: number;
  out: number;
}) {
  const top = LIST.top + (LIST.lowTop - LIST.top) * down;
  const scale = 1 - (1 - LIST.lowScale) * down;
  const head = enter(frame, at, { distance: 12 });
  const heads = progress(frame, at + 10, 14);
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top,
        width: W,
        height: LIST.headH + IMPROVEMENTS.length * LIST.pitch,
        transform: `translateY(${out * 30}px) scale(${scale})`,
        transformOrigin: 'top center',
        opacity: 1 - out,
        fontFamily: FONT.sans,
      }}
    >
      <div style={{ position: 'absolute', left: 0, top: 0, height: 44, display: 'flex', alignItems: 'center', gap: 14, whiteSpace: 'nowrap', ...head }}>
        <Icon name="file" size={40} color={C.cyan} />
        <span style={{ fontSize: 40, fontWeight: 850, color: C.textStrong, letterSpacing: -0.4 }}>{LIST_TEXT.title}</span>
      </div>
      {[
        { x: LIST.ownerX, text: LIST_TEXT.owner },
        { x: LIST.dateX, text: LIST_TEXT.date },
      ].map((h) => (
        <div key={h.text} style={{ position: 'absolute', left: h.x, top: 8, fontSize: 30, fontWeight: 800, letterSpacing: 0.5, color: C.muted, whiteSpace: 'nowrap', opacity: heads }}>
          {h.text}
        </div>
      ))}
      {IMPROVEMENTS.map((imp, i) => {
        const p = springIn(frame, fps, at + 4 + i * 4, { damping: 16 });
        if (p <= 0.001) return null;
        const hot = i === HIGHLIGHT_ROW ? lit : 0;
        const d = i === HIGHLIGHT_ROW ? 0 : 0.55 * lit;
        return (
          <div
            key={imp.text}
            style={{
              position: 'absolute',
              left: 0,
              top: LIST.headH + 10 + i * LIST.pitch,
              ...dimStyle(d, Math.min(1, p * 1.3)),
              transform: `translateY(${(1 - p) * 14}px) scale(${1 + 0.03 * hot})`,
              transformOrigin: 'left center',
            }}
          >
            <ImprovementRow imp={imp} width={W} height={LIST.rowH} textX={LIST.textX} ownerX={LIST.ownerX} dateX={LIST.dateX} lit={hot} />
          </div>
        );
      })}
      {/* «¿funciona?» lands on the list */}
      <div style={{ position: 'absolute', left: 820, top: 150 }}>
        <Stamp frame={frame} at={stampAt} accent="amber" rotate={-8} size={84} style={{ textTransform: 'none', letterSpacing: 0, boxShadow: `0 0 40px ${alpha(C.amber, 0.35)}`, background: alpha(C.ink950, 0.9) }}>
          {LIST_TEXT.stamp}
        </Stamp>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Phase B→: the title and its line
// ---------------------------------------------------------------------------

const TERM_TONES: Tone[] = [WAY_TONE.mesa, WAY_TONE.drill, 'emerald'];

function TitleBlock({ frame, p, termsAt }: { frame: number; p: number; termsAt: number }) {
  const [lead, ...rest] = TITLE.text.split(' del ');
  const terms = enter(frame, termsAt, { distance: 12 });
  return (
    <div style={{ position: 'absolute', left: 0, top: TITLE_TOP, width: W, fontFamily: FONT.sans }}>
      <div
        style={{
          textAlign: 'center',
          fontSize: 100,
          fontWeight: 850,
          letterSpacing: -2.5,
          lineHeight: 1.05,
          color: C.textStrong,
          whiteSpace: 'nowrap',
          opacity: Math.min(1, p * 1.4),
          transform: `translateY(${(1 - p) * 26}px) scale(${0.96 + 0.04 * Math.min(1, p)})`,
        }}
      >
        {lead} del <span style={{ color: C.cyan }}>{rest.join(' del ')}</span>
      </div>
      <div style={{ marginTop: 14, display: 'flex', justifyContent: 'center', gap: 22, fontSize: 46, fontWeight: 800, whiteSpace: 'nowrap', ...terms }}>
        {TITLE.terms.map((t, i) => (
          <span key={t} style={{ display: 'flex', gap: 22 }}>
            {i > 0 ? <span style={{ color: C.faint }}>·</span> : null}
            <span style={{ color: toneOf(TERM_TONES[i]).soft }}>{t}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Phase C: the promise — two ways to test it, and the hunt
// ---------------------------------------------------------------------------

function Promise({ frame, fps, at, alarmAt, out }: { frame: number; fps: number; at: readonly number[]; alarmAt: number; out: number }) {
  const { height } = twoWaysSize(TILE_W);
  const left0 = (W - (3 * TILE_W + 2 * TILE_GAP)) / 2;
  const tiles = [0, 1, 2].map((i) => {
    const p = springIn(frame, fps, at[i] - 4, { damping: 15 });
    const act = progress(frame, at[i] + 4, 22, EASE.inOut);
    return { p, act };
  });
  const bell = progress(frame, alarmAt, 12);
  const slash = progress(frame, alarmAt + 8, 12, EASE.inOut);
  return (
    <div style={{ position: 'absolute', left: 0, top: TILES_TOP, width: W, height: height + 70, opacity: 1 - out, transform: `translateY(${out * 24}px)` }}>
      {tiles.map(({ p, act }, i) => {
        if (p <= 0.001) return null;
        const left = left0 + i * (TILE_W + TILE_GAP);
        const t = toneOf(TERM_TONES[i]);
        return (
          <div key={i} style={{ position: 'absolute', left, top: 0, width: TILE_W, opacity: Math.min(1, p * 1.3), transform: `translateY(${(1 - p) * 22}px) scale(${0.94 + 0.06 * Math.min(1, p)})` }}>
            {i === 0 ? <MesaArt width={TILE_W} act={act} glow={0.35 * act} frame={frame} /> : null}
            {i === 1 ? <DrillArt width={TILE_W} act={act} glow={0.35 * act} frame={frame} /> : null}
            {i === 2 ? (
              <ArtFrame width={TILE_W} tone="emerald" glow={0.35 * act}>
                <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}>
                  <div style={{ transform: `rotate(${-10 + 10 * act}deg) scale(${0.9 + 0.1 * act})` }}>
                    <Icon name="search" size={176} color={C.emerald} strokeWidth={2} />
                  </div>
                </div>
                <div style={{ position: 'absolute', right: 22, top: 20, opacity: bell }}>
                  <BellOff size={64} color={C.muted} slash={slash} />
                </div>
              </ArtFrame>
            ) : null}
            <div style={{ marginTop: 16, textAlign: 'center', fontFamily: FONT.sans, fontSize: 44, fontWeight: 800, color: t.soft, whiteSpace: 'nowrap' }}>{PROMISE[i].caption}</div>
          </div>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Phase D: the bridge with V5, one strip
// ---------------------------------------------------------------------------

const NODE_X = [150, 500, 880, 1390];
const RAIL_Y = 100;
const NODE_R = 44;

function BridgeStrip({ frame, fps, at }: { frame: number; fps: number; at: readonly number[] }) {
  const band = progress(frame, at[0] - 4, 16);
  const rose = C.rose;
  const nodes: { icon: IconName; tone: string; body: ReactNode }[] = [
    {
      icon: 'clock',
      tone: rose,
      body: <div style={{ fontSize: 46, fontWeight: 850, color: C.roseSoft }}>{BRIDGE.when}</div>,
    },
    {
      icon: 'laptop',
      tone: rose,
      body: (
        <>
          <div style={{ fontFamily: FONT.mono, fontSize: 42, fontWeight: 800, color: C.textStrong }}>{BRIDGE.host}</div>
          <div style={{ fontSize: 38, fontWeight: 750, color: C.text }}>{BRIDGE.hostTail}</div>
        </>
      ),
    },
    {
      icon: 'users',
      tone: rose,
      body: (
        <>
          {BRIDGE.nobody.map((l) => (
            <div key={l} style={{ fontSize: 38, fontWeight: 750, color: C.text }}>
              {l}
            </div>
          ))}
        </>
      ),
    },
    {
      icon: 'user',
      tone: C.emerald,
      body: (
        <>
          <div style={{ fontSize: 40, fontWeight: 850, color: '#6ee7b7' }}>{BRIDGE.now}</div>
          <div style={{ fontSize: 40, fontWeight: 850, color: C.textStrong }}>{BRIDGE.nowTail}</div>
        </>
      ),
    },
  ];
  const lit = at.map((a) => progress(frame, a, 12));
  const roseFill = clamp01(progress(frame, at[0], 10) * 0.05 + progress(frame, at[1] - 6, 16) * 0.45 + progress(frame, at[2] - 6, 16) * 0.5);
  const toNow = progress(frame, at[3] - 8, 18, EASE.inOut);
  const x0 = NODE_X[0];
  const x2 = NODE_X[2];
  const x3 = NODE_X[3];
  return (
    <div style={{ position: 'absolute', left: 0, top: STRIP_TOP, width: W, height: STRIP_H, fontFamily: FONT.sans }}>
      {/* The strip: rose for September, emerald where it flows out */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: W,
          height: STRIP_H,
          borderRadius: 28,
          background: `linear-gradient(90deg, ${alpha(C.rose, 0.1)} 0%, ${alpha(C.rose, 0.05)} 55%, ${alpha(C.emerald, 0.06 + 0.08 * toNow)} 78%, ${alpha(C.emerald, 0.1 + 0.1 * toNow)} 100%)`,
          border: `2px solid ${C.ink700}`,
          opacity: band,
          transform: `translateY(${(1 - band) * 16}px)`,
        }}
      />
      <svg width={W} height={380} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        <line x1={x0} y1={RAIL_Y} x2={x3} y2={RAIL_Y} stroke={C.ink600} strokeWidth={6} strokeLinecap="round" opacity={band} />
        <line x1={x0} y1={RAIL_Y} x2={x0 + (x2 - x0) * roseFill} y2={RAIL_Y} stroke={alpha(rose, 0.85)} strokeWidth={8} strokeLinecap="round" />
        {toNow > 0.001 ? (
          <>
            <line x1={x2} y1={RAIL_Y} x2={x2 + (x3 - NODE_R - 14 - x2) * toNow} y2={RAIL_Y} stroke={C.emerald} strokeWidth={8} strokeLinecap="round" />
            {toNow > 0.85 ? (
              <path
                d={`M ${x3 - NODE_R - 30} ${RAIL_Y - 16} L ${x3 - NODE_R - 12} ${RAIL_Y} L ${x3 - NODE_R - 30} ${RAIL_Y + 16}`}
                fill="none"
                stroke={C.emerald}
                strokeWidth={8}
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={progress(toNow, 0.85, 0.15)}
              />
            ) : null}
          </>
        ) : null}
      </svg>
      {nodes.map((n, i) => {
        const p = springIn(frame, fps, at[i] - 2, { damping: 15 });
        if (p <= 0.001) return null;
        const hot = i === 3 ? lit[3] : lit[i] * (1 - lit[3] * 0.5);
        return (
          <div key={i}>
            <div
              style={{
                position: 'absolute',
                left: NODE_X[i] - NODE_R,
                top: RAIL_Y - NODE_R,
                width: NODE_R * 2,
                height: NODE_R * 2,
                borderRadius: NODE_R,
                display: 'grid',
                placeItems: 'center',
                background: i === 3 ? n.tone : alpha(n.tone, 0.16),
                border: `3px solid ${alpha(n.tone, 0.85)}`,
                boxShadow: `0 0 ${Math.round(30 * hot)}px ${alpha(n.tone, 0.45 * hot)}`,
                opacity: Math.min(1, p * 1.3),
                transform: `scale(${0.6 + 0.4 * Math.min(1, p)})`,
              }}
            >
              <Icon name={n.icon} size={48} color={i === 3 ? C.ink950 : n.tone} strokeWidth={2.2} />
            </div>
            <div
              style={{
                position: 'absolute',
                left: NODE_X[i] - 300,
                top: RAIL_Y + NODE_R + 26,
                width: 600,
                textAlign: 'center',
                lineHeight: 1.18,
                whiteSpace: 'nowrap',
                ...dimStyle(i < 3 ? 0.35 * lit[3] : 0, Math.min(1, p * 1.3)),
                transform: `translateY(${(1 - Math.min(1, p)) * 14}px)`,
              }}
            >
              {n.body}
            </div>
          </div>
        );
      })}
    </div>
  );
}

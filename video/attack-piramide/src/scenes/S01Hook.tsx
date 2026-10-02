import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, fadeIn, progress, pulse } from '../../../engine/src/theme/motion';
import { Icon, focusWeights, mix, windowWeight } from '../../../engine/src/ui';
import { BRIDGE, PROMISE, TITLE } from '../data/s01-hook';
import { Pyramid } from './parts/Pyramid';
import { ProcessTree, treeScale, type TreeNodeId } from './parts/ProcessTree';
import { MatrixSketch } from './parts/s01-hook/Matrix';
import { Stage, segment, wordFrame } from './kit';

const SCENE = 's01-hook';
const W = 1728;

type Box = { x: number; y: number; w: number };
// The tree: alone and big while it draws, then small in the centre between the two maps.
const TREE_BIG: Box = { x: (W - 1060) / 2, y: 90, w: 1060 };
const TREE_SMALL: Box = { x: (W - 700) / 2, y: 158, w: 700 };

// The two empty maps at its sides.
const MAP_TOP = 132;
const MAP_W = 480;
const MAP_LABEL_H = 54;
const MAP_BODY_TOP = MAP_TOP + MAP_LABEL_H + 8;
const MAP_BOTTOM = 520;

// Bottom band: the promise, then the bridge with V3's E7 alert.
const PROMISE_Y = 566;
const BRIDGE_A = 548;
const BRIDGE_B = 612;

const ROW_ORDER: TreeNodeId[] = ['explorer', 'powershell', 'wcssvc', 'winhlp', 'schtasks', 'c2'];

/**
 * s01-hook «Un árbol, dos mapas». The lesson's process tree draws branch by
 * branch, dimmed; two empty maps open at its sides — the ATT&CK matrix and the
 * Pyramid of Pain, grey — under the title. The promise in one line, then the
 * bridge with V3: on 05-03 this machine beaconed to an unknown domain; after
 * the alert, back to how it began on 02-03.
 */
export function S01Hook(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const treeAt = props.cue('tree');
  const titleAt = props.cue('title');
  const promiseAt = props.cue('promise');
  const bridgeAt = props.cue('bridge');
  const s3 = segment(props, 's01-03');

  const wAttack = wordFrame(SCENE, 's01-01', 'ATT&CK');
  const wPyramid = wordFrame(SCENE, 's01-01', 'Pyramid');
  const wNombrar = wordFrame(SCENE, 's01-02', 'nombrar');
  const wElegir = wordFrame(SCENE, 's01-02', 'elegir');
  const wDominio = wordFrame(SCENE, 's01-03', 'dominio');
  const wToco = wordFrame(SCENE, 's01-03', 'tocó');
  const wDos = wordFrame(SCENE, 's01-03', 'dos');

  // ---- Tree: draws branch by branch (the newest row lit), then shrinks between the maps.
  // The first branch is already drawing as the scene opens (no empty panel); the rest follow the voice.
  const drawFrom = Math.max(4, treeAt - 30);
  const DRAW = treeAt + 96 - drawFrom;
  const draw = progress(frame, drawFrom, DRAW, EASE.linear);
  const rowStarts = ROW_ORDER.map((_, i) => drawFrom + (DRAW * i) / 6);
  const { weights: rowW } = focusWeights(frame, rowStarts, { end: titleAt - 6, ramp: 6, lead: 0 });
  const shrink = progress(frame, titleAt - 12, 28, EASE.inOut);
  const tree: Box = { x: mix(TREE_BIG.x, TREE_SMALL.x, shrink), y: mix(TREE_BIG.y, TREE_SMALL.y, shrink), w: mix(TREE_BIG.w, TREE_SMALL.w, shrink) };
  const domainHi = windowWeight(frame, wDominio - 4, s3.to);
  const focus: Partial<Record<TreeNodeId, number>> = {};
  ROW_ORDER.forEach((id, i) => {
    focus[id] = rowW[i];
  });
  focus.c2 = Math.max(focus.c2 ?? 0, domainHi);
  const drawingDim = frame < titleAt ? 0.75 : 0;
  const settledDim = 0.55 * progress(frame, titleAt, 20);
  const treeDim = Math.max(drawingDim, settledDim);

  // Header glow on «el día dos».
  const dayGlow = windowWeight(frame, wDos - 6, Number.POSITIVE_INFINITY, { ramp: 12 });
  const k = treeScale(tree.w);

  // ---- Title and maps.
  const titleIn = progress(frame, titleAt, 18);
  const matrixIn = progress(frame, wAttack - 6, 22, EASE.out);
  const pyrIn = progress(frame, wPyramid - 6, 22, EASE.out);
  const leftGlow = windowWeight(frame, wNombrar - 4, wElegir - 4, { ramp: 10 });
  const rightGlow = windowWeight(frame, wElegir - 4, bridgeAt - 10, { ramp: 10 });

  // ---- Promise, then the bridge.
  const promiseOut = 1 - progress(frame, bridgeAt - 10, 14, EASE.inOut);
  const leftP = progress(frame, Math.min(promiseAt + 6, wNombrar - 6), 14);
  const rightP = progress(frame, wElegir - 6, 14);
  const bridgeA = progress(frame, bridgeAt, 16);
  const unknownP = progress(frame, wordFrame(SCENE, 's01-03', 'nadie') - 4, 12);
  const bridgeB = progress(frame, wToco - 4, 16);
  const backArrow = progress(frame, wToco, 22, EASE.inOut);

  return (
    <Stage>
      {/* Title */}
      <div style={{ position: 'absolute', left: 0, top: 0, width: W, textAlign: 'center', fontFamily: FONT.sans, ...enter(frame, titleAt, { distance: 16 }), opacity: titleIn }}>
        <div style={{ fontSize: 66, fontWeight: 850, color: C.textStrong, lineHeight: 1.05, letterSpacing: -0.5 }}>{TITLE.main}</div>
        <div style={{ marginTop: 8, fontSize: 34, fontWeight: 700, color: C.muted, lineHeight: 1.1 }}>
          <span style={{ color: '#7dd3fc' }}>{TITLE.attack}</span>
          <span style={{ color: C.faint }}> · </span>
          <span style={{ color: '#6ee7b7' }}>{TITLE.pyramid}</span>
        </div>
      </div>

      {/* Left map: ATT&CK */}
      {matrixIn > 0 ? (
        <div style={{ position: 'absolute', left: 0, top: MAP_TOP, width: MAP_W, opacity: matrixIn, transform: `translateX(${(1 - matrixIn) * 140}px)` }}>
          <MapLabel text={TITLE.attack} color="#7dd3fc" glow={leftGlow} />
        </div>
      ) : null}
      {matrixIn > 0 ? (
        <div style={{ position: 'absolute', left: 0, top: MAP_BODY_TOP, opacity: matrixIn, transform: `translateX(${(1 - matrixIn) * 140}px)` }}>
          <MatrixSketch width={MAP_W} height={MAP_BOTTOM - MAP_BODY_TOP} show={matrixIn} glow={leftGlow} />
        </div>
      ) : null}

      {/* Right map: Pyramid of Pain (grey, empty) */}
      {pyrIn > 0 ? (
        <div style={{ position: 'absolute', left: W - MAP_W, top: MAP_TOP, width: MAP_W, opacity: pyrIn, transform: `translateX(${(1 - pyrIn) * -140}px)` }}>
          <MapLabel text={TITLE.pyramid} color="#6ee7b7" glow={rightGlow} />
        </div>
      ) : null}
      {pyrIn > 0 ? (
        <div style={{ position: 'absolute', left: W - MAP_W, top: MAP_BODY_TOP, opacity: 0.6 + 0.4 * rightGlow, transform: `translateX(${(1 - pyrIn) * -140}px)` }}>
          <Pyramid width={MAP_W} height={MAP_BOTTOM - MAP_BODY_TOP} frame={frame} show={pyrIn} grey={1} labels="name" />
        </div>
      ) : null}

      {/* The tree */}
      <div style={{ position: 'absolute', left: tree.x, top: tree.y, opacity: fadeIn(frame, 0, 12) }}>
        <ProcessTree width={tree.w} frame={frame} draw={draw} focus={focus} dim={treeDim} highlight={{ domain: domainHi }} />
        {dayGlow > 0 ? (
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: tree.w,
              height: 60 * k,
              boxSizing: 'border-box',
              borderRadius: `${24 * k}px ${24 * k}px 0 0`,
              border: `3px solid ${alpha(C.cyan, 0.85 * dayGlow)}`,
              boxShadow: `0 0 ${Math.round(26 * dayGlow)}px ${alpha(C.cyan, 0.45 * dayGlow * (0.8 + 0.2 * pulse(frame, fps, 0.6)))}`,
            }}
          />
        ) : null}
      </div>

      {/* Promise */}
      {promiseOut > 0 && frame >= promiseAt ? (
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: PROMISE_Y,
            width: W,
            display: 'flex',
            justifyContent: 'center',
            gap: 22,
            fontFamily: FONT.sans,
            fontSize: 42,
            fontWeight: 750,
            whiteSpace: 'nowrap',
            opacity: promiseOut,
            transform: `translateY(${(1 - promiseOut) * -14}px)`,
          }}
        >
          <span style={{ color: '#7dd3fc', opacity: leftP, transform: `translateY(${(1 - leftP) * 12}px)` }}>{PROMISE.left}</span>
          <span style={{ color: C.faint, opacity: rightP }}>·</span>
          <span style={{ color: '#6ee7b7', opacity: rightP, transform: `translateY(${(1 - rightP) * 12}px)` }}>{PROMISE.right}</span>
        </div>
      ) : null}

      {/* Bridge with V3: the E7 alert, then back to the start */}
      {bridgeA > 0 ? (
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: BRIDGE_A,
            width: W,
            display: 'flex',
            justifyContent: 'center',
            opacity: bridgeA,
            transform: `translateY(${(1 - bridgeA) * 16}px)`,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              height: 56,
              padding: '0 24px 0 12px',
              borderRadius: 14,
              border: `2px solid ${alpha(C.rose, 0.7)}`,
              background: `linear-gradient(90deg, ${alpha(C.rose, 0.16)} 0%, ${alpha(C.ink900, 0.95)} 45%)`,
              fontFamily: FONT.sans,
              fontSize: 32,
              fontWeight: 650,
              color: C.text,
              whiteSpace: 'nowrap',
            }}
          >
            <span style={{ padding: '2px 12px', borderRadius: 8, background: C.rose, color: C.ink950, fontWeight: 850 }}>{BRIDGE.e7}</span>
            <Icon name="bell" size={30} color={C.rose} />
            <span style={{ fontFamily: FONT.mono, fontWeight: 700, color: C.textStrong }}>{BRIDGE.date}</span>
            <span style={{ color: C.faint }}>·</span>
            <span>
              {BRIDGE.beacon}
              <span style={{ fontFamily: FONT.mono, fontWeight: 700, color: C.cyan }}>{BRIDGE.domain}</span>
            </span>
            <span style={{ color: C.faint, opacity: unknownP }}>·</span>
            <span style={{ color: C.roseSoft, fontWeight: 750, opacity: unknownP }}>{BRIDGE.unknown}</span>
          </div>
        </div>
      ) : null}
      {bridgeB > 0 ? (
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: BRIDGE_B,
            width: W,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 16,
            fontFamily: FONT.sans,
            fontSize: 36,
            fontWeight: 750,
            color: C.cyanSoft,
            whiteSpace: 'nowrap',
            opacity: bridgeB,
            transform: `translateX(${(1 - bridgeB) * 24}px)`,
          }}
        >
          <svg width={64} height={40} style={{ overflow: 'visible' }}>
            {/* A drawn «go back» curve (no arrow glyphs in text) */}
            <path
              d="M58 6 C 30 4, 14 14, 12 30"
              fill="none"
              stroke={C.cyan}
              strokeWidth={4}
              strokeLinecap="round"
              strokeDasharray="70 70"
              strokeDashoffset={70 * (1 - backArrow)}
            />
            {backArrow > 0.9 ? <polygon points="2,24 12,38 22,24" fill={C.cyan} /> : null}
          </svg>
          <span>{BRIDGE.back}</span>
          <span style={{ color: C.faint }}>·</span>
          <span
            style={{
              fontFamily: FONT.mono,
              fontWeight: 800,
              color: C.cyan,
              padding: '0 10px',
              borderRadius: 8,
              boxShadow: dayGlow > 0 ? `0 0 0 3px ${alpha(C.cyan, 0.8 * dayGlow)}` : undefined,
            }}
          >
            {BRIDGE.backDate}
          </span>
        </div>
      ) : null}
    </Stage>
  );
}

/** Big label above a map (the voice names both maps). */
function MapLabel({ text, color, glow }: { text: string; color: string; glow: number }) {
  return (
    <div style={{ height: MAP_LABEL_H, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
      <span
        style={{
          fontFamily: FONT.sans,
          fontSize: 42,
          fontWeight: 850,
          color,
          whiteSpace: 'nowrap',
          textShadow: glow > 0 ? `0 0 ${Math.round(22 * glow)}px ${alpha(color, 0.6 * glow)}` : undefined,
          opacity: 0.75 + 0.25 * glow,
        }}
      >
        {text}
      </span>
    </div>
  );
}


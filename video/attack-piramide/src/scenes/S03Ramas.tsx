import type { ReactNode } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, alpha } from '../../../engine/src/theme/tokens';
import { EASE, fadeIn, progress, pulse } from '../../../engine/src/theme/motion';
import { Icon, focusWeights, mix, windowWeight, type IconName } from '../../../engine/src/ui';
import { BRANCH_TAGS, COMMON, TACTICS, WRAP } from '../data/s03-ramas';
import { Ladder, ladderLayout } from './parts/Ladder';
import { ProcessTree, treeNodeAnchor, treeRowEnd, type TreeNodeId } from './parts/ProcessTree';
import { PeCard, ReaderCard, TacticPill, TechTag } from './parts/s03-ramas/bits';
import { Stage, segment, wordFrame } from './kit';

const SCENE = 's03-ramas';
const W = 1728;

type Box = { x: number; y: number; w: number };
// Tree layouts: branches (full width, tags on the right) · common (small, left) · tactics (centred) · wrap (left).
const T1: Box = { x: 0, y: 0, w: W };
const T2: Box = { x: 0, y: 120, w: 820 };
const T3: Box = { x: (W - 900) / 2, y: 16, w: 900 };
const T4: Box = { x: 0, y: 16, w: 820 };

/** Vertical shift of each expanded tag so it clears its neighbours' rows. */
const TAG_SHIFT: Partial<Record<TreeNodeId, number>> = { powershell: 44, wcssvc: 30, c2: 6 };

// «Idioma común» column (right of the small tree).
const RX = 880;
const RW = W - RX;
const HERO_Y = 44;
const HERO = { size: 52, padX: 24 };
const READER_Y = 140;
const READER_STEP = 118;
const IDIOMA_Y = 560;

// Tactics row (bottom) and the compact ladder (wrap).
const ROW_TOP = 470;
const LAD = { x: RX, y: 56, w: RW };

const boxMix = (a: Box, b: Box, t: number): Box => ({ x: mix(a.x, b.x, t), y: mix(a.y, b.y, t), w: mix(a.w, b.w, t) });

/**
 * s03-ramas «El resto del árbol». The whole tree comes back and the other
 * branches light one by one with their ATT&CK tag (the previous one folds to a
 * short form): PowerShell · Execution, the renamed certutil · Defense Evasion
 * (with its PE header), the TLS call home · Command and Control. Then the
 * technique number as a common language (three generic readers), the four
 * tactics in a row as the voice names their verbs, and the ladder of s02
 * beside the row: three rungs per branch.
 */
export function S03Ramas(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const psAt = props.cue('branch-ps');
  const decodeAt = props.cue('branch-decode');
  const realAt = props.cue('real-name');
  const c2At = props.cue('branch-c2');
  const commonAt = props.cue('common');
  const tacticsAt = props.cue('tactics');
  const wrapAt = props.cue('wrap');
  const s5 = segment(props, 's03-05');

  const wExecution = wordFrame(SCENE, 's03-01', 'Execution');
  const wDefense = wordFrame(SCENE, 's03-02', 'Defense');
  const wCertutil = wordFrame(SCENE, 's03-02', 'certutil');
  const wCommand = wordFrame(SCENE, 's03-03', 'Command');
  const wWeb = wordFrame(SCENE, 's03-03', 'web');
  const wSoc = wordFrame(SCENE, 's03-04', 'SOC');
  const wProveedor = wordFrame(SCENE, 's03-04', 'proveedor');
  const wInforme = wordFrame(SCENE, 's03-04', 'informe');
  const wIdioma = wordFrame(SCENE, 's03-04', 'idioma');
  const verbAt = [
    wordFrame(SCENE, 's03-05', 'Ejecutar'),
    wordFrame(SCENE, 's03-05', 'despistar'),
    wordFrame(SCENE, 's03-05', 'quedarse'),
    wordFrame(SCENE, 's03-05', 'llamar'),
  ];
  const wPorque = wordFrame(SCENE, 's03-06', 'porqué');
  const wComo = wordFrame(SCENE, 's03-06', 'cómo');
  const wHace = wordFrame(SCENE, 's03-06', 'hace');

  // ---- Tree layout across the four phases.
  const shrink = progress(frame, commonAt - 14, 26, EASE.inOut);
  const centre = progress(frame, s5.from - 8, 24, EASE.inOut);
  const back = progress(frame, wrapAt - 10, 24, EASE.inOut);
  const tree = boxMix(boxMix(boxMix(T1, T2, shrink), T3, centre), T4, back);

  // ---- Branch focus (phase 1).
  const branchStarts = [psAt, decodeAt, c2At];
  const { weights: bw } = focusWeights(frame, branchStarts, { end: commonAt - 10, ramp: 12 });
  const commonFocus = windowWeight(frame, commonAt, s5.from - 4);
  const verbW = focusWeights(frame, verbAt, { end: tacticsAt, ramp: 8 }).weights;
  const tacticsDim = progress(frame, tacticsAt, 16);

  const focus: Partial<Record<TreeNodeId, number>> = {
    powershell: Math.max(bw[0], verbW[0]),
    wcssvc: Math.max(bw[1], verbW[1]),
    c2: Math.max(bw[2], verbW[3]),
    schtasks: Math.max(commonFocus, verbW[2]),
  };
  const anyFocus = Math.max(...Object.values(focus).map((v) => v ?? 0));
  const dim = Math.max(anyFocus, 0.7 * tacticsDim);
  const focusTone = frame >= s5.from - 4 ? C.sky : C.cyan;

  // ---- Tags (phase 1).
  const tagsOut = 1 - progress(frame, commonAt - 16, 14);
  const tagAt: Record<string, { tech: number; tactic: number }> = {
    powershell: { tech: psAt + 8, tactic: wExecution - 4 },
    wcssvc: { tech: decodeAt + 8, tactic: wDefense - 4 },
    c2: { tech: c2At + 8, tactic: wCommand - 4 },
  };
  const tags: Partial<Record<TreeNodeId, ReactNode>> = {};
  BRANCH_TAGS.forEach((tag, i) => {
    if (tagsOut <= 0) return;
    const t = tagAt[tag.node];
    tags[tag.node] = (
      <div style={{ opacity: tagsOut }}>
        <TechTag tag={tag} expand={bw[i]} techP={progress(frame, t.tech, 14)} tacticP={progress(frame, t.tactic, 12)} shift={TAG_SHIFT[tag.node]} />
      </div>
    );
  });

  // ---- PE header (real-name).
  const peIn = progress(frame, realAt, 14) * (1 - progress(frame, wCommand - 12, 14));
  const peStrike = progress(frame, wCertutil + 4, 14, EASE.inOut);
  const peDim = progress(frame, c2At, 14);

  // ---- Common language (phase 2).
  const commonOut = 1 - progress(frame, s5.from - 10, 14);
  const heroFly = progress(frame, commonAt + 6, 24, EASE.inOut);
  const schEnd = { x: T2.x + treeRowEnd('schtasks', T2.w), y: T2.y + treeNodeAnchor('schtasks', T2.w).y };
  const heroX = mix(schEnd.x + 12, RX, heroFly);
  const heroY = mix(schEnd.y, HERO_Y, heroFly) - Math.sin(Math.PI * heroFly) * 30;
  const heroS = mix(0.6, 1, heroFly);
  const readerAt = [wSoc - 8, wProveedor - 8, wInforme - 8];
  const idiomaP = progress(frame, wIdioma - 4, 14);
  const idiomaGlow = idiomaP * (1 - progress(frame, wIdioma + 40, 30));

  // ---- Tactics row (phase 3) and ladder (phase 4).
  const verbLit = verbAt.map((at) => progress(frame, at - 4, 12));
  const allGlow = progress(frame, tacticsAt - 2, 10) * (1 - progress(frame, tacticsAt + 30, 30));
  const ladW = [windowWeight(frame, wPorque, wComo), windowWeight(frame, wComo, wHace), windowWeight(frame, wHace, Number.POSITIVE_INFINITY)];
  const rowGlow = Math.max(allGlow, ladW[0]);
  const ladIn = progress(frame, wrapAt, 16);
  const ladBox = ladderLayout(LAD.w, true).rungs[0];
  const linkP = progress(frame, wPorque - 4, 16, EASE.inOut);

  return (
    <Stage>
      {/* The tree */}
      <div style={{ position: 'absolute', left: tree.x, top: tree.y }}>
        <ProcessTree
          width={tree.w}
          frame={frame}
          draw={progress(frame, 0, 26, EASE.linear)}
          focus={focus}
          dim={dim}
          focusTone={focusTone}
          tags={tags}
          highlight={{ domain: windowWeight(frame, wWeb - 4, commonAt - 10) }}
        />
      </div>

      {/* PE header of the renamed certutil */}
      {peIn > 0 ? (
        <div style={{ position: 'absolute', left: 122, top: 566 }}>
          <PeCard appear={peIn} strike={peStrike} dim={peDim} />
        </div>
      ) : null}

      {/* Common language: the same number for everyone */}
      {frame >= commonAt && commonOut > 0 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: commonOut }}>
          <div
            style={{
              position: 'absolute',
              left: heroX,
              top: heroY,
              transform: `translateY(-50%) scale(${heroS})`,
              transformOrigin: '0 50%',
              padding: `8px ${HERO.padX}px`,
              borderRadius: 16,
              border: `3px solid ${C.cyan}`,
              background: alpha(C.ink900, 0.96),
              boxShadow: `0 0 30px ${alpha(C.cyan, 0.35)}`,
              fontFamily: FONT.mono,
              fontSize: HERO.size,
              fontWeight: 800,
              lineHeight: 1.15,
              color: C.cyan,
              whiteSpace: 'nowrap',
              opacity: progress(frame, commonAt + 6, 6),
            }}
          >
            {COMMON.technique}
          </div>
          <div
            style={{
              position: 'absolute',
              left: RX + RW / 2,
              top: IDIOMA_Y,
              transform: `translate(-50%, -50%) translateY(${(1 - idiomaP) * 16}px)`,
              opacity: idiomaP,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '10px 26px',
              borderRadius: 999,
              border: `2px solid ${alpha(C.sky, 0.7 + 0.3 * idiomaGlow)}`,
              background: alpha(C.sky, 0.12 + 0.12 * idiomaGlow),
              boxShadow: idiomaGlow > 0 ? `0 0 ${Math.round(28 * idiomaGlow)}px ${alpha(C.sky, 0.4 * idiomaGlow)}` : undefined,
              fontFamily: FONT.sans,
              fontSize: 42,
              fontWeight: 800,
              color: '#7dd3fc',
              whiteSpace: 'nowrap',
            }}
          >
            <Icon name="globe" size={40} color={C.sky} />
            {COMMON.chip}
          </div>
          {/* Drawn fan from the number to its readers */}
          <svg width={W} height={660} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
            {readerAt.map((at, i) => {
              const p = progress(frame, at, 12, EASE.inOut);
              if (p <= 0) return null;
              const x = RX + 40;
              const y0 = HERO_Y + 36;
              const y1 = READER_Y + i * READER_STEP + 2;
              return <line key={i} x1={x} y1={y0} x2={x} y2={y0 + (y1 - y0) * p} stroke={alpha(C.cyan, 0.5)} strokeWidth={3} strokeDasharray="6 8" />;
            })}
          </svg>
          {COMMON.readers.map((r, i) => {
            const p = progress(frame, readerAt[i] + 4, 14);
            if (p <= 0) return null;
            return (
              <div key={r.label} style={{ position: 'absolute', left: RX, top: READER_Y + i * READER_STEP }}>
                <ReaderCard icon={r.icon as IconName} label={r.label} value={COMMON.technique} appear={p} width={RW} />
              </div>
            );
          })}
        </div>
      ) : null}

      {/* Tactics row */}
      {frame >= verbAt[0] - 6 ? (
        <div style={{ position: 'absolute', left: 0, top: ROW_TOP, width: W, display: 'flex', justifyContent: 'center', gap: 36 }}>
          {TACTICS.map((t, i) => {
            const lit = verbLit[i];
            const glow = Math.max(rowGlow, verbW[i] ?? 0) * (0.8 + 0.2 * pulse(frame, fps, 0.6));
            return (
              <div
                key={t.tactic}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 10,
                  opacity: fadeIn(frame, verbAt[i] - 4, 10),
                  transform: `translateY(${(1 - lit) * 16}px)`,
                }}
              >
                <span style={{ fontFamily: FONT.sans, fontSize: 32, fontWeight: 650, color: C.muted, whiteSpace: 'nowrap' }}>{t.verb}</span>
                <TacticPill label={t.tactic} size={40} glow={glow} />
              </div>
            );
          })}
        </div>
      ) : null}

      {/* Wrap: the ladder beside the tactics row */}
      {ladIn > 0 ? (
        <>
          <div
            style={{
              position: 'absolute',
              left: LAD.x + 22,
              top: 0,
              height: 46,
              display: 'flex',
              alignItems: 'center',
              fontFamily: FONT.sans,
              fontSize: 40,
              fontWeight: 800,
              color: C.textStrong,
              whiteSpace: 'nowrap',
              opacity: ladIn,
            }}
          >
            {WRAP.title}
          </div>
          <div style={{ position: 'absolute', left: LAD.x, top: LAD.y, opacity: ladIn }}>
            <Ladder
              width={LAD.w}
              frame={frame}
              compact
              focus={ladW}
              rungs={[
                { at: wrapAt + 2, content: WRAP.rungs[0].content, gloss: WRAP.rungs[0].gloss },
                { at: wrapAt + 8, content: <span style={{ fontFamily: FONT.mono }}>{WRAP.rungs[1].content}</span>, gloss: WRAP.rungs[1].gloss },
                { at: wrapAt + 14, content: WRAP.rungs[2].content, gloss: WRAP.rungs[2].gloss },
              ]}
            />
          </div>
          {/* The row is the TACTIC rung of each branch. */}
          <svg width={W} height={660} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
            {(() => {
              const x0 = LAD.x + ladBox.x;
              const y0 = LAD.y + ladBox.y + ladBox.h / 2;
              const xm = LAD.x - 26;
              const y1 = ROW_TOP - 8;
              const len = x0 - xm + (y1 - y0);
              return (
                <path
                  d={`M${x0} ${y0} L${xm} ${y0} L${xm} ${y1}`}
                  fill="none"
                  stroke={alpha(C.sky, 0.4 + 0.5 * ladW[0])}
                  strokeWidth={3 + ladW[0]}
                  strokeLinecap="round"
                  strokeDasharray={`${len} ${len}`}
                  strokeDashoffset={len * (1 - linkP)}
                />
              );
            })()}
          </svg>
        </>
      ) : null}
    </Stage>
  );
}

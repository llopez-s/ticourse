import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, alpha } from '../../../engine/src/theme/tokens';
import { EASE, fadeIn, progress } from '../../../engine/src/theme/motion';
import { Icon, dimStyle, mix, windowWeight } from '../../../engine/src/ui';
import { DISGUISE_LABEL, PLAIN_LINE, RUNG_TEXT, TAG_TEXT, TASK_CMD, TASK_CMD_TEXT } from '../data/s02-escalera';
import { KeyPot, keyPotTagAnchor } from './parts/KeyPot';
import { Ladder, ladderLayout } from './parts/Ladder';
import { ProcessTree, treeNodeAnchor } from './parts/ProcessTree';
import { Stage, segment, wordFrame } from './kit';

const SCENE = 's02-escalera';
const W = 1728;

// Phase A: the whole tree, then the schtasks branch lifts off.
const TREE = { x: 244, y: 50, w: 1240 };
/** Where s01-hook leaves the tree (its TREE_SMALL). */
const S01_TREE = { x: (W - 700) / 2, y: 158, w: 700 };
// Ladder (right) and KeyPot (left) once the ladder builds.
const LAD = { x: 578, y: 114, w: 1150 };
const KP_CENTRE = { x: (W - 620) / 2, y: 112, w: 620 };
const KP_LEFT = { x: 0, y: 140, w: 550 };

/** JetBrains Mono advance. */
const ADV = 0.6;
const CMD_LEN = TASK_CMD_TEXT.length;

type Spot = { x: number; y: number; s: number };

// The flying command: left edge, vertical centre and font size at each stop.
const schAnchor = treeNodeAnchor('schtasks', TREE.w);
const P0: Spot = { x: TREE.x + schAnchor.x, y: TREE.y + schAnchor.y, s: 30 * 1.06 };
const P1: Spot = { x: (W - CMD_LEN * ADV * 42) / 2, y: 300, s: 42 };
const P2: Spot = { x: (W - CMD_LEN * ADV * 34) / 2, y: 50, s: 34 };
const rung3 = ladderLayout(LAD.w).rungs[2];
const P3: Spot = { x: LAD.x + rung3.contentX, y: LAD.y + (rung3.contentY + rung3.y + rung3.h - 12) / 2, s: 32 };

// The disguise row (top strip, once the command has gone down into the ladder).
const ROW_Y = 50;
const TAG_CHIP = { x: 24, w: 384, size: 38 };
const LINK = { x0: TAG_CHIP.x + TAG_CHIP.w + 14, x1: TAG_CHIP.x + TAG_CHIP.w + 118 };
const WUC_CHIP = { x: LINK.x1 + 14, size: 40, padX: 18 };
const WUC_CHIP_W = TASK_CMD.name.length * ADV * WUC_CHIP.size + 2 * WUC_CHIP.padX;
const LABEL_X = WUC_CHIP.x + WUC_CHIP_W + 40;

const spotMix = (a: Spot, b: Spot, t: number): Spot => ({ x: mix(a.x, b.x, t), y: mix(a.y, b.y, t), s: mix(a.s, b.s, t) });

/**
 * s02-escalera «Porqué, cómo y cómo exactamente». The schtasks branch lifts
 * out of the tree with its plain reading; the key-under-the-pot image; then
 * the ladder builds top-down with the voice — TACTIC Persistence, TECHNIQUE
 * T1053 (.005) with the ajar window as «otra técnica, el mismo porqué», and
 * the command itself drops into PROCEDURE. Last, the task name and the key's
 * tag «revisión del gas» meet in the top strip: the disguise is procedure too.
 */
export function S02Escalera(props: SceneProps) {
  const frame = useCurrentFrame();

  const zoomAt = props.cue('zoom-task');
  const keyAt = props.cue('key');
  const tacticAt = props.cue('tactic');
  const techniqueAt = props.cue('technique');
  const otherAt = props.cue('other-way');
  const procedureAt = props.cue('procedure');
  const disguiseAt = props.cue('disguise');
  const s5 = segment(props, 's02-05');

  const wTarea1 = wordFrame(SCENE, 's02-01', 'tarea');
  const wPara = wordFrame(SCENE, 's02-01', 'para');
  const wLlave2 = wordFrame(SCENE, 's02-02', 'llave');
  const wMaceta = wordFrame(SCENE, 's02-02', 'maceta');
  const wPersistence = wordFrame(SCENE, 's02-03', 'Persistence');
  const wLlave4 = wordFrame(SCENE, 's02-04', 'llave');
  const wTarea4 = wordFrame(SCENE, 's02-04', 'tarea');
  const wPorque4 = wordFrame(SCENE, 's02-04', 'porqué');
  const wComando = wordFrame(SCENE, 's02-05', 'comando');
  const wNombre5 = wordFrame(SCENE, 's02-05', 'nombre');
  const wImita = wordFrame(SCENE, 's02-06', 'imita');
  const wEtiqueta = wordFrame(SCENE, 's02-06', 'etiqueta');
  const wRevision = wordFrame(SCENE, 's02-06', 'revisión');

  // --- The flying command (one element through four stops).
  const lift = progress(frame, wTarea1 - 8, 26, EASE.inOut);
  const toStrip = progress(frame, keyAt - 8, 24, EASE.inOut);
  const toRung = progress(frame, wComando - 4, 28, EASE.inOut);
  const cmd = spotMix(spotMix(spotMix(P0, P1, lift), P2, toStrip), P3, toRung);
  const cmdArc = Math.sin(Math.PI * toRung) * 40;
  const nameRose = windowWeight(frame, wNombre5, procedureAt + 10, { ramp: 8 });
  const nameAmber = progress(frame, disguiseAt, 10);

  // --- Tree (phase A).
  const treeIn = fadeIn(frame, 0, 12);
  const treeOut = 1 - progress(frame, wTarea1 - 4, 22, EASE.inOut);
  const schFocus = progress(frame, zoomAt, 12);
  // Hand-off from s01: the tree starts where s01 left it (small, centred) and grows into place.
  const grow = progress(frame, 0, 26, EASE.inOut);
  const treeBox = { x: mix(S01_TREE.x, TREE.x, grow), y: mix(S01_TREE.y, TREE.y, grow), w: mix(S01_TREE.w, TREE.w, grow) };

  // --- KeyPot.
  const kpShow = progress(frame, keyAt - 2, 18);
  const toLeft = progress(frame, tacticAt - 16, 26, EASE.inOut);
  const kp = { x: mix(KP_CENTRE.x, KP_LEFT.x, toLeft), y: mix(KP_CENTRE.y, KP_LEFT.y, toLeft), w: mix(KP_CENTRE.w, KP_LEFT.w, toLeft) };
  const keyGlow = Math.max(windowWeight(frame, wLlave2, wMaceta + 40), windowWeight(frame, wLlave4, wLlave4 + 40));
  const windowP = progress(frame, otherAt, 16);
  const windowWin = windowWeight(frame, otherAt, s5.from);
  const tagP = progress(frame, wEtiqueta - 4, 12);
  const kpDim = 0.5 * progress(frame, tacticAt, 14) * (1 - Math.max(windowWin, keyGlow, tagP));

  // --- Ladder.
  const w0 = Math.max(windowWeight(frame, tacticAt, techniqueAt), windowWeight(frame, wPorque4, s5.from));
  const w1 = windowWeight(frame, techniqueAt, s5.from);
  const w2 = windowWeight(frame, procedureAt - 6, Number.POSITIVE_INFINITY);

  // --- Disguise row (top strip).
  const wucFly = progress(frame, wImita - 6, 24, EASE.inOut);
  const tagFly = progress(frame, wEtiqueta - 2, 24, EASE.inOut);
  const linkDraw = progress(frame, wRevision - 2, 16, EASE.inOut);
  const labelIn = progress(frame, wRevision + 12, 14);

  // Copy sources (where the originals sit at that moment).
  const wucFrom: Spot = { x: P3.x + TASK_CMD.before.length * ADV * P3.s, y: P3.y, s: P3.s };
  const wucTo: Spot = { x: WUC_CHIP.x + WUC_CHIP.padX, y: ROW_Y, s: WUC_CHIP.size };
  const wuc = spotMix(wucFrom, wucTo, wucFly);
  const tagA = keyPotTagAnchor(KP_LEFT.w);
  const tagFrom = { x: KP_LEFT.x + tagA.x0, y: KP_LEFT.y + tagA.y, s: KP_LEFT.w / 600 };
  const tagX = mix(tagFrom.x, TAG_CHIP.x, tagFly);
  const tagY = mix(tagFrom.y, ROW_Y, tagFly) - Math.sin(Math.PI * tagFly) * 30;
  const tagS = mix(tagFrom.s * 1.0, TAG_CHIP.size / 36, tagFly);

  const stripPanel = toStrip * (1 - progress(frame, wComando - 6, 14));

  return (
    <Stage>
      {/* Phase A: the whole tree, schtasks in focus. */}
      {treeOut > 0 ? (
        <div style={{ position: 'absolute', left: treeBox.x, top: treeBox.y, opacity: treeIn * treeOut }}>
          <ProcessTree width={treeBox.w} frame={frame} focus={{ schtasks: schFocus }} dim={Math.max(schFocus, 0.55 * (1 - grow))} focusTone={C.rose} />
        </div>
      ) : null}

      {/* Card behind the zoomed branch. */}
      {lift > 0 && toStrip < 1 ? (
        <div
          style={{
            position: 'absolute',
            left: 90,
            top: P1.y - 150,
            width: W - 180,
            height: 290,
            borderRadius: 26,
            border: `2px solid ${alpha(C.rose, 0.35)}`,
            background: `radial-gradient(ellipse at 50% 40%, ${alpha(C.rose, 0.08)} 0%, ${alpha(C.ink900, 0.9)} 70%)`,
            opacity: progress(frame, wTarea1 + 4, 16) * (1 - toStrip),
          }}
        />
      ) : null}

      {/* Plain reading under the zoomed branch. */}
      {frame >= wPara - 4 && toStrip < 1 ? (
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: P1.y + 64,
            width: W,
            textAlign: 'center',
            fontFamily: FONT.sans,
            fontSize: 44,
            fontWeight: 650,
            color: C.text,
            opacity: fadeIn(frame, wPara - 4, 14) * (1 - toStrip),
            transform: `translateY(${(1 - progress(frame, wPara - 4, 16)) * 12}px)`,
          }}
        >
          {PLAIN_LINE}
        </div>
      ) : null}
      {lift > 0 && toStrip < 1 ? (
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: P1.y - 96,
            width: W,
            display: 'flex',
            justifyContent: 'center',
            opacity: progress(frame, wTarea1 + 10, 12) * (1 - toStrip),
          }}
        >
          <span style={{ fontFamily: FONT.sans, fontSize: 34, fontWeight: 800, letterSpacing: 3, color: C.roseSoft }}>UNA TAREA PROGRAMADA</span>
        </div>
      ) : null}

      {/* Strip that holds the command while the key and the first rungs arrive. */}
      {stripPanel > 0 ? (
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 6,
            width: W,
            height: 88,
            borderRadius: 18,
            border: `2px solid ${alpha(C.rose, 0.45)}`,
            background: `linear-gradient(90deg, ${alpha(C.rose, 0.08)} 0%, ${alpha(C.ink900, 0.94)} 40%)`,
            opacity: stripPanel,
          }}
        >
          <div style={{ position: 'absolute', left: 26, top: 0, height: 88, display: 'flex', alignItems: 'center' }}>
            <Icon name="terminal" size={38} color={C.rose} />
          </div>
        </div>
      ) : null}

      {/* KeyPot */}
      <div style={{ position: 'absolute', left: kp.x, top: kp.y, ...dimStyle(kpDim) }}>
        <KeyPot width={kp.w} frame={frame} show={kpShow} glow={keyGlow} tag={tagP} window={windowP} />
      </div>

      {/* Ladder */}
      <div style={{ position: 'absolute', left: LAD.x, top: LAD.y }}>
        <Ladder
          width={LAD.w}
          frame={frame}
          focus={[w0, w1, w2]}
          rungs={[
            {
              at: tacticAt - 4,
              gloss: RUNG_TEXT.tactic.gloss,
              content: (
                <span style={{ fontSize: 54, fontWeight: 850, color: '#7dd3fc', opacity: fadeIn(frame, wPersistence - 4, 12), lineHeight: 1 }}>
                  {RUNG_TEXT.tactic.content}
                </span>
              ),
            },
            {
              at: techniqueAt - 4,
              gloss: RUNG_TEXT.technique.gloss,
              content: (
                <div style={{ opacity: fadeIn(frame, wTarea4 - 4, 12), lineHeight: 1.15 }}>
                  <div style={{ fontSize: 42, fontWeight: 800, color: C.textStrong }}>
                    <span style={{ fontFamily: FONT.mono, color: C.cyan }}>{RUNG_TEXT.technique.id}</span> {RUNG_TEXT.technique.name}
                  </div>
                  <div style={{ fontSize: 32, fontWeight: 650, color: C.cyanSoft, marginTop: 4 }}>{RUNG_TEXT.technique.sub}</div>
                </div>
              ),
            },
            { at: procedureAt - 8, gloss: RUNG_TEXT.procedure.gloss },
          ]}
        />
      </div>

      {/* The command itself (tree row, centre, strip, then PROCEDURE). */}
      {lift > 0 ? (
        <div
          style={{
            position: 'absolute',
            left: cmd.x,
            top: cmd.y - cmdArc,
            transform: 'translateY(-50%)',
            fontFamily: FONT.mono,
            fontSize: cmd.s,
            lineHeight: 1.3,
            whiteSpace: 'pre',
            color: C.textStrong,
            fontWeight: 600,
            textShadow: lift < 1 || (toRung > 0 && toRung < 1) ? `0 0 18px ${alpha(C.rose, 0.6)}` : undefined,
          }}
        >
          <span style={{ fontWeight: 800, color: C.roseSoft }}>{TASK_CMD.before.slice(0, 12)}</span>
          {TASK_CMD.before.slice(12)}
          <TaskName rose={nameRose * (1 - nameAmber)} amber={nameAmber} />
          {TASK_CMD.after}
        </div>
      ) : null}

      {/* Disguise row: the task name and the key's tag, linked. */}
      {wucFly > 0 ? (
        <div
          style={{
            position: 'absolute',
            left: wuc.x - WUC_CHIP.padX * (wuc.s / WUC_CHIP.size),
            top: wuc.y - Math.sin(Math.PI * wucFly) * 40,
            transform: 'translateY(-50%)',
            padding: `6px ${WUC_CHIP.padX * (wuc.s / WUC_CHIP.size)}px`,
            borderRadius: 12,
            border: `3px solid ${alpha(C.amber, 0.85)}`,
            background: alpha(C.ink900, 0.96),
            boxShadow: `0 0 26px ${alpha(C.amber, 0.4)}`,
            fontFamily: FONT.mono,
            fontSize: wuc.s,
            fontWeight: 800,
            lineHeight: 1.2,
            color: '#fde68a',
            whiteSpace: 'nowrap',
            opacity: progress(frame, wImita - 6, 6),
          }}
        >
          {TASK_CMD.name}
        </div>
      ) : null}
      {tagFly > 0 ? (
        <div
          style={{
            position: 'absolute',
            left: tagX,
            top: tagY,
            transform: `translateY(-50%) scale(${tagS})`,
            transformOrigin: '0 50%',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            height: 62,
            boxSizing: 'border-box',
            padding: '0 22px 0 14px',
            borderRadius: '10px 16px 16px 10px',
            border: `3px solid ${C.amber}`,
            background: `linear-gradient(180deg, ${alpha(C.amber, 0.28)} 0%, ${alpha(C.ink900, 0.95)} 100%)`,
            boxShadow: `0 0 26px ${alpha(C.amber, 0.45)}`,
            whiteSpace: 'nowrap',
            opacity: progress(frame, wEtiqueta - 2, 6),
          }}
        >
          <div style={{ width: 14, height: 14, borderRadius: 7, border: `3px solid ${C.amber}` }} />
          <span style={{ fontFamily: FONT.sans, fontSize: 36, fontWeight: 750, color: '#fde68a', letterSpacing: -0.4 }}>{TAG_TEXT}</span>
        </div>
      ) : null}
      {linkDraw > 0 ? (
        <svg width={W} height={120} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
          <line
            x1={LINK.x0}
            y1={ROW_Y}
            x2={LINK.x0 + (LINK.x1 - LINK.x0) * linkDraw}
            y2={ROW_Y}
            stroke={C.amber}
            strokeWidth={5}
            strokeLinecap="round"
          />
          <circle cx={LINK.x0} cy={ROW_Y} r={8} fill={C.amber} />
          {linkDraw >= 1 ? <circle cx={LINK.x1} cy={ROW_Y} r={8} fill={C.amber} /> : null}
        </svg>
      ) : null}
      {labelIn > 0 ? (
        <div
          style={{
            position: 'absolute',
            left: LABEL_X,
            top: ROW_Y,
            transform: `translate(${(1 - labelIn) * 16}px, -50%)`,
            fontFamily: FONT.sans,
            fontSize: 42,
            fontWeight: 800,
            whiteSpace: 'nowrap',
            opacity: labelIn,
            color: '#fde68a',
          }}
        >
          {DISGUISE_LABEL.lead}
          <span style={{ color: C.roseSoft }}>{DISGUISE_LABEL.tail}</span>
        </div>
      ) : null}
    </Stage>
  );
}

/** «WindowsUpdateCheck» inside the command: rose while the voice names it, amber as the disguise. */
function TaskName({ rose, amber }: { rose: number; amber: number }) {
  const tone = amber > 0.05 ? C.amber : C.rose;
  const h = Math.max(rose, amber);
  return (
    <span
      style={{
        color: amber > 0.05 ? '#fde68a' : h > 0.05 ? C.roseSoft : undefined,
        fontWeight: h > 0.05 ? 800 : undefined,
        background: h > 0 ? alpha(tone, 0.16 * h) : undefined,
        boxShadow: h > 0 ? `0 0 0 3px ${alpha(tone, 0.85 * h)}` : undefined,
        borderRadius: 6,
      }}
    >
      {TASK_CMD.name}
    </span>
  );
}

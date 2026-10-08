import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { EASE, progress, pulse } from '../../../engine/src/theme/motion';
import { Icon, dimStyle, focusWeights, windowWeight } from '../../../engine/src/ui';
import { ABSENT, EMPTY, INFERRED, OBSERVED_HEAD } from '../data/s06-frontera';
import { KillChain, LUPA_SIZE, Lupa, PHASE_IDS, killChainLayout, type PhaseId, type VignetteLook } from './parts/KillChain';
import { LogLine, OBSERVED, type ObservedPhaseId } from './parts/LessonLog';
import { Stage, wordFrame } from './kit';

const S = 's06-frontera';
const W = 1728;

/** The map: the seven slots (no rings), names under them. */
const ROW = { x: 0, y: 116 } as const;
const L = killChainLayout(W);
const CHIP_Y = 40;
const BELOW = ROW.y + L.height + 22;

/** The observed log strip (one line per observed phase, texture size). */
const LOG = { x: 520, y: BELOW + 58, size: 24, step: 38, timeW: 168 } as const;

const OBSERVED_IDS = OBSERVED.map((o) => o.phase) as readonly ObservedPhaseId[];
const isObserved = (id: PhaseId): id is ObservedPhaseId => (OBSERVED_IDS as readonly string[]).includes(id);

/**
 * s06-frontera «Visto, deducido y sin ver». The seven phases as a map of what
 * you know. `observed`: Delivery, Exploitation, Installation and Command &
 * Control turn cyan, each with a clock and its time as in its source («UTC»
 * only on the mail one; no deltas, no arrows between them), «observadas: hay
 * un registro con hora» and one log line per phase. `dashed`: Weaponization in
 * a dashed frame with the magnifier, «inferida» (no clock). `absent`:
 * Reconnaissance greys and blurs, «casi nunca la ves · a veces asoma en los
 * registros de lo que tienes de cara a internet, como tu web». `empty`: Actions
 * on Objectives empties to its outline, «sin pruebas todavía». `wrap-iii`: the
 * clocks pulse on «hora»; on «taller … te deja», a dashed cyan line runs from
 * the box at the door back to the workshop.
 */
export function S06Frontera(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const mapAt = props.cue('map');
  const observedAt = props.cue('observed');
  const dashedAt = props.cue('dashed');
  const absentAt = props.cue('absent');
  const emptyAt = props.cue('empty');
  const wrapAt = props.cue('wrap-iii');

  const w = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);
  const wRegistro = w('s06-02', 'registro');
  const wHora2 = w('s06-02', 'hora');
  const wArtefacto = w('s06-03', 'artefacto');
  const wAsoma = w('s06-04', 'asoma');
  const wPruebas = w('s06-05', 'pruebas');
  const wHora6 = w('s06-06', 'hora');
  const wTaller = w('s06-06', 'taller');
  const wDeja = w('s06-06', 'deja');

  // Focus: one status at a time, then all of them together on the wrap.
  const { dims } = focusWeights(frame, [observedAt, dashedAt, absentAt, emptyAt], { end: wrapAt, ramp: 12 });
  const [dObs, dWeap, dRecon, dAct] = dims;

  const obsIn = progress(frame, observedAt, 16);
  const weapIn = progress(frame, dashedAt - 2, 16);
  const reconOut = progress(frame, absentAt - 2, 22, EASE.inOut);
  const actEmpty = progress(frame, emptyAt - 2, 22, EASE.inOut);
  const clockBeat = windowWeight(frame, wHora6 - 4, wHora6 + 50) * pulse(frame, fps, 0.8);
  const tallerLit = windowWeight(frame, wTaller - 4, Number.POSITIVE_INFINITY);
  const backLine = progress(frame, wDeja - 10, 26, EASE.inOut);
  const boxHint = windowWeight(frame, wArtefacto - 4, wArtefacto + 46);

  const looks: Partial<Record<PhaseId, VignetteLook>> = {};
  PHASE_IDS.forEach((id, i) => {
    const show = progress(frame, i * 3, 14);
    if (isObserved(id)) {
      const k = OBSERVED_IDS.indexOf(id);
      const p = progress(frame, observedAt + k * 6, 14);
      looks[id] = {
        show,
        tone: p > 0.3 ? 'cyan' : undefined,
        lit: p * (0.55 + 0.45 * windowWeight(frame, observedAt, dashedAt)) + (id === 'delivery' ? 0.6 * boxHint : 0),
        dim: dObs,
      };
    } else if (id === 'weaponization') {
      looks[id] = { show, dashed: weapIn, lit: Math.max(0.6 * weapIn * windowWeight(frame, dashedAt, absentAt), 0.7 * tallerLit), tone: weapIn > 0.3 ? 'cyan' : undefined, dim: dWeap };
    } else if (id === 'reconnaissance') {
      looks[id] = { show, grey: reconOut, blurred: reconOut, dim: dRecon };
    } else {
      // Actions on Objectives: empty from the start (outline only); `empty` only lights it.
      looks[id] = { show, empty: 1, lit: 0.5 * actEmpty, dim: dAct };
    }
  });
  const names = Object.fromEntries(PHASE_IDS.map((id, i) => [id, progress(frame, Math.min(mapAt, 12) + i * 3, 14)])) as Record<PhaseId, number>;

  const slot = (id: PhaseId) => L.slot(id)!;
  const sObsL = slot('delivery');
  const sObsR = slot('c2');
  const sWeap = slot('weaponization');
  const sRecon = slot('reconnaissance');
  const sAct = slot('actions');
  const sDel = slot('delivery');
  // From the box at the door (slot 3) across the gap into the workshop (slot 2).
  const back = { x0: ROW.x + sDel.x + 0.3 * sDel.w, x1: ROW.x + sWeap.x + 0.84 * sWeap.w, y: ROW.y + 0.6 * sDel.h };
  const backPath = `M ${back.x0} ${back.y} C ${back.x0 - 40} ${back.y - 46}, ${back.x1 + 40} ${back.y - 46}, ${back.x1} ${back.y}`;

  return (
    <Stage>
      {/* The map */}
      <div style={{ position: 'absolute', left: ROW.x, top: ROW.y }}>
        <KillChain width={W} looks={looks} names={names} links={0} frame={frame} />
      </div>

      {/* Observed: a clock and its time over each of the four slots */}
      {OBSERVED.map((o, k) => {
        const p = progress(frame, Math.max(observedAt + k * 6, wHora2 - 18 + k * 4), 14);
        if (p <= 0.01) return null;
        const s = slot(o.phase);
        const beat = clockBeat;
        return (
          <div
            key={o.phase}
            style={{
              position: 'absolute',
              left: ROW.x + s.cx,
              top: CHIP_Y,
              transform: `translate(-50%, ${(1 - p) * 10}px) scale(${1 + 0.06 * beat})`,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 14px',
              borderRadius: RADIUS.pill,
              border: `2px solid ${alpha(C.cyan, 0.75 + 0.25 * beat)}`,
              background: alpha(C.cyan, 0.1 + 0.12 * beat),
              boxShadow: beat > 0.02 ? `0 0 ${Math.round(20 * beat)}px ${alpha(C.cyan, 0.5 * beat)}` : undefined,
              whiteSpace: 'nowrap',
              opacity: p,
              ...dimStyle(dObs, p),
            }}
          >
            <Icon name="clock" size={30} color={C.cyan} strokeWidth={2.2} />
            <span style={{ fontFamily: FONT.mono, fontSize: 28, fontWeight: 700, color: C.cyanSoft }}>{o.time}</span>
          </div>
        );
      })}

      {/* «observadas: hay un registro con hora», bracketing the four, and one log line each */}
      {obsIn > 0.01 ? (
        <div style={{ position: 'absolute', inset: 0, ...dimStyle(dObs) }}>
          <svg width={W} height={40} style={{ position: 'absolute', left: 0, top: BELOW - 16, overflow: 'visible', opacity: obsIn }}>
            <path
              d={`M ${ROW.x + sObsL.x + 8} 0 L ${ROW.x + sObsL.x + 8} 10 L ${ROW.x + sObsR.x + sObsR.w - 8} 10 L ${ROW.x + sObsR.x + sObsR.w - 8} 0`}
              fill="none"
              stroke={C.cyan}
              strokeWidth={3}
              strokeDasharray={`${1100 * obsIn} 1200`}
            />
          </svg>
          <div
            style={{
              position: 'absolute',
              left: ROW.x + (sObsL.x + sObsR.x + sObsR.w) / 2,
              top: BELOW + 2,
              transform: 'translateX(-50%)',
              padding: '0 14px',
              background: C.ink950,
              fontFamily: FONT.sans,
              fontSize: 38,
              fontWeight: 800,
              color: C.cyanSoft,
              whiteSpace: 'nowrap',
              opacity: obsIn,
            }}
          >
            {OBSERVED_HEAD}
          </div>
          {OBSERVED.map((o, k) => {
            const p = progress(frame, wRegistro - 6 + k * 6, 14);
            if (p <= 0.01) return null;
            const y = LOG.y + k * LOG.step;
            return (
              <div key={o.phase} style={{ position: 'absolute', left: LOG.x, top: y, display: 'flex', alignItems: 'center', opacity: p, transform: `translateX(${(1 - p) * 14}px)` }}>
                <Icon name="clock" size={24} color={alpha(C.cyan, 0.85)} strokeWidth={2.2} />
                <span style={{ width: LOG.timeW, paddingLeft: 10, fontFamily: FONT.mono, fontSize: LOG.size, fontWeight: 650, color: C.cyanSoft, whiteSpace: 'nowrap' }}>{o.time}</span>
                <LogLine id={o.line} size={LOG.size} showTime={false} bright={0.4} />
              </div>
            );
          })}
        </div>
      ) : null}

      {/* Weaponization: the magnifier and «inferida», no clock */}
      {weapIn > 0.01 ? (
        <div
          style={{
            position: 'absolute',
            left: ROW.x + sWeap.cx,
            top: CHIP_Y - (LUPA_SIZE - 44) / 2,
            transform: `translate(-50%, ${(1 - weapIn) * 10}px)`,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            whiteSpace: 'nowrap',
            ...dimStyle(dWeap, weapIn),
          }}
        >
          <Lupa glow={Math.max(0.4 * weapIn, tallerLit)} />
          <span style={{ fontFamily: FONT.sans, fontSize: 36, fontWeight: 800, fontStyle: 'italic', color: C.cyanSoft }}>{INFERRED}</span>
        </div>
      ) : null}

      {/* Reconnaissance: «casi nunca la ves» */}
      {reconOut > 0.01 ? (
        <div style={{ position: 'absolute', left: ROW.x + sRecon.x + 4, top: BELOW, fontFamily: FONT.sans, whiteSpace: 'nowrap', transform: `translateY(${(1 - reconOut) * 10}px)`, ...dimStyle(dRecon, reconOut) }}>
          <div style={{ fontSize: 38, fontWeight: 800, color: C.text }}>{ABSENT.head}</div>
          <div style={{ marginTop: 8, fontSize: 30, fontWeight: 650, lineHeight: 1.22, color: C.muted, opacity: progress(frame, wAsoma - 6, 14) }}>
            {ABSENT.lines.map((l) => (
              <div key={l}>{l}</div>
            ))}
          </div>
        </div>
      ) : null}

      {/* Actions on Objectives: «sin pruebas todavía», over its empty slot */}
      {actEmpty > 0.01 ? (
        <div
          style={{
            position: 'absolute',
            left: ROW.x + sAct.cx,
            top: ROW.y - 14,
            fontFamily: FONT.sans,
            fontSize: 34,
            fontWeight: 800,
            lineHeight: 1.08,
            color: C.text,
            whiteSpace: 'nowrap',
            textAlign: 'center',
            transform: `translate(-50%, calc(-100% + ${(1 - actEmpty) * 10}px))`,
            ...dimStyle(dAct, progress(frame, Math.min(wPruebas - 8, emptyAt + 20), 14)),
          }}
        >
          <div>{EMPTY[0]}</div>
          <div>{EMPTY[1]}</div>
        </div>
      ) : null}

      {/* wrap-iii: the box he left points back to his workshop (dashed: deduced) */}
      {backLine > 0.01 ? (
        <svg width={W} height={660} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
          <defs>
            <mask id="s06-back-draw" maskUnits="userSpaceOnUse" x={0} y={0} width={W} height={660}>
              <path d={backPath} fill="none" stroke="#ffffff" strokeWidth={16} pathLength={1000} strokeDasharray={`${1000 * backLine} 1000`} />
            </mask>
          </defs>
          <path d={backPath} fill="none" stroke={C.ink950} strokeWidth={9} strokeLinecap="round" mask="url(#s06-back-draw)" />
          <path d={backPath} fill="none" stroke={C.cyan} strokeWidth={4.5} strokeDasharray="11 9" strokeLinecap="round" mask="url(#s06-back-draw)" />
          {backLine > 0.95 ? (
            <path
              d={`M ${back.x1 + 16} ${back.y - 13} L ${back.x1} ${back.y} L ${back.x1 + 16} ${back.y + 13}`}
              fill="none"
              stroke={C.cyan}
              strokeWidth={4.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ) : null}
        </svg>
      ) : null}
    </Stage>
  );
}

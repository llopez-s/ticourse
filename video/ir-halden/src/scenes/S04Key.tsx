import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { Chip, Icon, mix, windowWeight } from '../../../engine/src/ui';
import { SCOPE_HOSTS } from '../data/s03-scope';
import { ADM_REASONS, NOT_ISOLATED, STILL_HARM, TRAIL } from '../data/s04-key';
import { Board, CASE_TIMES, type BoardProps, type ColumnGeo } from './parts/Board';
import { HostRow, stackRows } from './parts/s03-scope/Hosts';
import { SCOPE_LAYOUT, scopeRowTop } from './parts/s03-scope/layout';
import { HARBOR_H, Harbor, type HarborState } from './parts/s04-key/Harbor';
import { ExamTerm, Lesson, RuleHead, RuleScope, RuleSteps } from './parts/s04-key/Rule';
import { NightTrail } from './parts/s04-key/Trail';
import { Stage, segment, wordFrame } from './kit';

const S = 's04-key';
const W = 1728;
/** Content under the compact board. */
const CONTENT_TOP = 168;
const ZOOM_ROWS_TOP = 170;
const HARBOR_TOP = 204;
const SHRUNK = { scale: 0.5, top: 256 } as const;

/**
 * s04-key «La llave maestra»: the answer to s03's think prompt. The board
 * opens with Contención in focus and its 16:15 tick goes wrong (amber, struck
 * out, empty): the box asks that the attacker can do no more harm, and she
 * still could. Then the ADM-WS-02 row, zoomed: never isolated (its owner could
 * not be reached, nobody on call could authorise it). This morning's finding
 * as a night timeline: 21:14 ADM-WS-02 to ADM-WS-07 (no EDR agent), 01:52
 * svc_tosreport from there into srv-tc-app03, the 02:00–04:30 outflow with the
 * alarm nobody looked at until the morning triage. The analogy: three naves,
 * two padlocked and the third — the key room — open; one key flies out. The
 * rule: padlock everything, hosts and the accounts through them (three
 * steps). The lesson and the exam term, «containment».
 */
export function S04Key(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const no = props.cue('no');
  const adm = props.cue('adm');
  const found = props.cue('found');
  const alert = props.cue('alert');
  const masterKey = props.cue('master-key');
  const rule = props.cue('rule');
  const name = props.cue('name');
  const s07 = segment(props, 's04-07').from;

  // s04-01 / s04-02
  const noWord = wordFrame(S, 's04-01', 'no.');
  const pide = wordFrame(S, 's04-01', 'pide');
  const todavia = wordFrame(S, 's04-01', 'todavía');
  const sinAislar = wordFrame(S, 's04-02', 'sin');
  const reasonsAt = ADM_REASONS.map((r) => wordFrame(S, 's04-02', r.word));
  // s04-05 / s04-06 / s04-07
  const candado = wordFrame(S, 's04-05', 'candado');
  const abierta = wordFrame(S, 's04-05', 'abierta');
  const llaves = wordFrame(S, 's04-05', 'llaves');
  const cuenta = wordFrame(S, 's04-05', 'cuenta');
  const candado6 = wordFrame(S, 's04-06', 'candado');
  const todo = wordFrame(S, 's04-06', 'todo,');
  const equipos = wordFrame(S, 's04-06', 'equipos');
  const cuentas = wordFrame(S, 's04-06', 'cuentas');
  const stepsAt = [wordFrame(S, 's04-06', 'Anulas'), wordFrame(S, 's04-06', 'cortas'), wordFrame(S, 's04-06', 'bloqueas')];
  const aislado = wordFrame(S, 's04-07', 'aislado');
  const noEs = wordFrame(S, 's04-07', 'no');
  const contenido = wordFrame(S, 's04-07', 'contenido.');
  const containment = wordFrame(S, 's04-07', 'containment.');

  // --- Board: opens from s03's lowered strip, goes full for the wrong tick, then back to the strip.
  const expand = progress(frame, no - 22, 24, EASE.inOut);
  const refold = progress(frame, adm - 14, 22, EASE.inOut);
  const compact = Math.min(1, 1 - expand + refold);
  const boardTop = mix(SCOPE_LAYOUT.stripTop.think, 0, expand);
  const wrongAt = noWord - 2;
  const examGlow = progress(frame, name - 4, 16);
  const board: BoardProps = {
    compact,
    columns: {
      detect: { box: 'checked', time: CASE_TIMES.declared },
      analysis: { box: 'checked' },
      contain: {
        focus: true,
        grow: 3,
        tone: frame >= name - 4 ? 'violet' : 'cyan',
        box: [
          { at: -1000, state: 'checked', time: CASE_TIMES.firstContainment },
          { at: wrongAt, state: 'wrong' },
        ],
        condition: windowWeight(frame, pide - 2, adm - 12, { ramp: 12 }),
        conditionTone: 'rose',
        glow: examGlow,
        glowTone: 'violet',
        body: (g) => <ContainBody g={g} frame={frame} at={todavia - 4} />,
      },
    },
  };

  // --- s03's rows (the opening frame) fade as the board expands.
  const s03Rows = 1 - progress(frame, no - 24, 16, EASE.inOut);

  // --- s04-02: the three rows again, ADM-WS-02 zoomed.
  const rowsIn = progress(frame, adm - 4, 16) * (1 - progress(frame, found - 8, 14, EASE.inOut));
  const zoom = progress(frame, adm + 4, 22, EASE.inOut);
  const zoomTops = stackRows([0, 0, zoom], ZOOM_ROWS_TOP, 12);
  const openAdm = progress(frame, sinAislar - 6, 16);

  // --- s04-03 / s04-04: the night timeline.
  const trailIn = progress(frame, found - 2, 14) * (1 - progress(frame, masterKey - 12, 14, EASE.inOut));
  const trailAt = TRAIL.map((e) => wordFrame(S, e.seg, e.word) + (e.after ?? 0));
  trailAt[2] = Math.min(trailAt[2], alert + 2);
  const lineAt = TRAIL.map((e) => e.lines.map((l) => wordFrame(S, l.seg, l.word) - 2));

  // --- s04-05 / s04-06: the naves.
  const harborIn = frame >= masterKey - 12;
  // «a todo»: the third door closes and locks while the naves are still big; then they step aside for the rule.
  const closeAt = Math.min(candado6 - 4, todo - 12);
  const shrinkAt = Math.max(equipos - 26, todo + 12);
  const shrink = progress(frame, shrinkAt, 18, EASE.inOut);
  const closeAdm = progress(frame, closeAt, 16, EASE.inOut);
  const scopeAt = [Math.max(equipos - 6, shrinkAt + 12), 0];
  scopeAt[1] = Math.max(cuentas - 6, scopeAt[0] + 10);
  const harbor: HarborState = {
    show: [0, 1, 2].map((i) => progress(frame, masterKey - 8 + i * 6, 16)),
    lock: [progress(frame, candado - 6, 12, EASE.in), progress(frame, candado + 4, 12, EASE.in), progress(frame, closeAt + 14, 12, EASE.in)],
    open: progress(frame, abierta - 8, 20, EASE.inOut) * (1 - closeAdm),
    keysGlow: windowWeight(frame, llaves - 4, todo, { ramp: 12 }),
    keyTaken: progress(frame, cuenta - 8, 8),
    fly: progress(frame, cuenta - 2, 26, EASE.inOut),
    keyLabel: progress(frame, cuenta + 14, 14),
    keyLock: progress(frame, closeAt + 20, 12, EASE.in),
    labels: 1 - progress(frame, shrinkAt - 2, 8),
  };
  const harborOut = progress(frame, name - 10, 14, EASE.inOut);
  const hScale = mix(1, SHRUNK.scale, shrink);
  const hTop = mix(HARBOR_TOP, SHRUNK.top, shrink);

  // --- s04-06 / s04-07: rule, lesson, exam term.
  const headIn = frame >= rule - 6;
  const headOut = progress(frame, s07 - 6, 12, EASE.inOut);
  const ruleOut = progress(frame, name - 10, 14, EASE.inOut);
  const stepsDim = progress(frame, s07 - 4, 14);

  return (
    <Stage>
      <div style={{ position: 'absolute', left: 0, top: boardTop }}>
        <Board {...board} frame={frame} />
      </div>

      {/* s03's closing rows, still there for the crossfade. */}
      {s03Rows > 0.001
        ? SCOPE_HOSTS.map((host, i) => (
            <div key={host.host} style={{ position: 'absolute', left: 0, top: scopeRowTop(i, 1) + (1 - s03Rows) * 30, opacity: s03Rows }}>
              <HostRow host={host} width={W} lock={host.isolated ? 1 : 0} power={host.isolated ? 1 : 0} keys={host.keys ? 1 : 0} />
            </div>
          ))
        : null}

      {/* s04-02: ADM-WS-02 zoomed. */}
      {rowsIn > 0.001
        ? SCOPE_HOSTS.map((host, i) => {
            const isAdm = !!host.keys;
            return (
              <div key={host.host} style={{ position: 'absolute', left: 0, top: zoomTops[i], opacity: rowsIn }}>
                <HostRow
                  host={host}
                  width={W}
                  show={progress(frame, adm - 4 + i * 5, 14)}
                  lock={host.isolated ? 1 : 0}
                  power={host.isolated ? 1 : 0}
                  keys={isAdm ? 1 : 0}
                  zoom={isAdm ? zoom : 0}
                  dim={isAdm ? 0 : 0.85 * zoom}
                  open={isAdm ? openAdm : 0}
                  openLabel={NOT_ISOLATED}
                  glow={isAdm ? 0.8 * zoom : 0}
                  glowTone={C.amber}
                  extra={isAdm ? <Reasons frame={frame} at={reasonsAt} /> : undefined}
                />
              </div>
            );
          })
        : null}

      {trailIn > 0.001 ? (
        <div style={{ position: 'absolute', left: 0, top: CONTENT_TOP, opacity: trailIn }}>
          <NightTrail events={TRAIL} frame={frame} fps={fps} drawAt={found} headAt={found - 2} head="Hallazgo de esta mañana" at={trailAt} lineAt={lineAt} release={trailAt[3] + 36} />
        </div>
      ) : null}

      {harborIn && harborOut < 1 ? (
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: hTop,
            width: W,
            height: HARBOR_H,
            transform: hScale !== 1 ? `scale(${hScale})` : undefined,
            transformOrigin: '0 0',
            opacity: 1 - harborOut,
          }}
        >
          <Harbor s={harbor} frame={frame} />
        </div>
      ) : null}

      {headIn && headOut < 1 ? <RuleHead frame={frame} at={rule - 4} opacity={1 - headOut} /> : null}
      {frame >= scopeAt[0] - 6 && ruleOut < 1 ? (
        <RuleScope frame={frame} at={scopeAt} left={Math.round(1728 * SHRUNK.scale) + 60} opacity={1 - ruleOut} />
      ) : null}
      {frame >= stepsAt[0] - 8 && ruleOut < 1 ? <RuleSteps frame={frame} at={stepsAt.map((a) => a - 4)} dim={stepsDim} opacity={1 - ruleOut} /> : null}

      {frame >= s07 - 6 ? <Lesson frame={frame} at={Math.max(s07, aislado - 14)} notAt={noEs} bAt={contenido - 8} opacity={progress(frame, s07 - 6, 12)} /> : null}
      {frame >= name - 6 ? <ExamTerm frame={frame} at={name} termAt={containment} /> : null}
    </Stage>
  );
}

// ---------------------------------------------------------------------------
// Body of the full Contención column: «todavía podía hacer daño».
// ---------------------------------------------------------------------------

function ContainBody({ g, frame, at }: { g: ColumnGeo; frame: number; at: number }) {
  const on = progress(g.focus, 0.6, 0.3) * (1 - g.dim);
  if (on <= 0 || frame < at - 2) return null;
  return (
    <div style={{ position: 'absolute', left: 0, bottom: 10, ...enter(frame, at, { distance: 12 }), opacity: on * progress(frame, at, 18) }}>
      <Chip accent="rose" icon="alert" size={36} solid>
        {STILL_HARM}
      </Chip>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Why ADM-WS-02 stayed open (in its zoomed row).
// ---------------------------------------------------------------------------

function Reasons({ frame, at }: { frame: number; at: readonly number[] }) {
  return (
    <div style={{ display: 'grid', gap: 12, paddingTop: 4, fontFamily: FONT.sans }}>
      {ADM_REASONS.map((r, i) =>
        frame >= at[i] - 6 ? (
          <div key={r.text} style={{ display: 'flex', alignItems: 'center', gap: 16, whiteSpace: 'nowrap', ...enter(frame, at[i] - 6, { distance: 14, axis: 'x' }) }}>
            <div
              style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                display: 'grid',
                placeItems: 'center',
                background: alpha(C.amber, 0.14),
                border: `2px solid ${alpha(C.amber, 0.5)}`,
                flexShrink: 0,
              }}
            >
              <Icon name={r.icon} size={28} color={C.amber} />
            </div>
            <span style={{ fontSize: 40, fontWeight: 750, color: C.textStrong }}>{r.text}</span>
          </div>
        ) : null,
      )}
    </div>
  );
}

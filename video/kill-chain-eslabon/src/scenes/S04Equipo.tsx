import type { ReactNode } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, alpha } from '../../../engine/src/theme/tokens';
import { EASE, progress, pulse } from '../../../engine/src/theme/motion';
import { Icon, clamp01, mix, windowWeight } from '../../../engine/src/ui';
import { BEACON_LABEL, COLUMNS, EXPLOITATION_GLOSS, INSTALLATION_GLOSS } from '../data/s04-equipo';
import { KillChain, PhaseTitle, Vignette, killChainLayout, type PhaseId } from './parts/KillChain';
import { LogLine, OBSERVED, logScale } from './parts/LessonLog';
import { ProcessTree, edrRowAnchor } from './parts/ProcessTree';
import { PhaseCard } from './parts/s03-correo/PhaseCard';
import { Stage, wordFrame } from './kit';

const S = 's04-equipo';
const W = 1728;

// ---- Places (stage-local) ----------------------------------------------------------------
const PANEL = { x: 0, w: 1300 } as const;
/** Resting top of the panel (where s03 leaves its mail panel), and where it drops at `beacon` so the think prompt sits over empty stage. */
const PANEL_Y = { rest: 60, beacon: 190 } as const;
const COL = { x: 1328, w: W - 1328 } as const;
const CARD_Y = 20;
const CARD_VIGNETTE_W = 360;
/** The answer's two columns. */
const COL_A = { x: 0, y: 20, w: 968, h: 620 } as const;
const COL_B = { x: 1000, y: 20, w: W - 1000, h: 620 } as const;
const A_VIGNETTE = { y: 172, w: 330 } as const;
const A_LINE = { x: 36, y: 548, size: 22 } as const;
const B_VIGNETTE = { y: 236, w: 330 } as const;
/** The `wrap-ii` row: the four observed phases. */
const WRAP_IDS: readonly PhaseId[] = ['delivery', 'exploitation', 'installation', 'c2'];
const WRAP_W = 1520;
const WRAP_X = (W - WRAP_W) / 2;
const WRAP_L = killChainLayout(WRAP_W, { ids: WRAP_IDS });
const CHIP_H = 56;
const WRAP_Y = Math.round((660 - (WRAP_L.height + 18 + CHIP_H)) / 2);

/**
 * s04-equipo «Dentro del equipo». The lesson's EDR chain (no `[fase]` tags),
 * «host ENG-WS-041 · mismo día», line by line: the line the voice explains is
 * enlarged, the rest dimmed, and its vignette lights on the right with its
 * name: the LNK opened + PowerShell, EXPLOITATION «se ejecuta código al
 * abrirlo» (the box open, the device lit); the new program + the scheduled
 * task, INSTALLATION «quedarse» (the key under the pot). Then the beacon line
 * alone, labelled only «beacon · cada 60 s» — no phase, no vignette — while
 * the panel drops so the think prompt sits over empty stage. The answer
 * (`c2`): two columns, COMMAND & CONTROL «C2: el canal que permite la misión»
 * (the «sigo aquí, ¿qué hago?» vignette; the beacon line falls into it) and
 * «Actions on Objectives: leer las carpetas de diseño, comprimirlas, sacarlas»
 * (`mission`; its slot still empty). `wrap-ii`: the four observed phases in a
 * row, each with its time as in its source.
 */
export function S04Equipo(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const edrAt = props.cue('edr');
  const openAt = props.cue('open');
  const exploitationAt = props.cue('exploitation');
  const dropAt = props.cue('drop');
  const taskAt = props.cue('task');
  const installationAt = props.cue('installation');
  const beaconAt = props.cue('beacon');
  const c2At = props.cue('c2');
  const missionAt = props.cue('mission');
  const wrapAt = props.cue('wrap-ii');

  const wPowerShell = wordFrame(S, 's04-01', 'PowerShell');
  const wCodigo = wordFrame(S, 's04-02', 'código');
  const wExploitation = wordFrame(S, 's04-02', 'Exploitation');
  const wQuedarse = wordFrame(S, 's04-04', 'quedarse');
  const wInstallation = wordFrame(S, 's04-04', 'Installation');
  const wMinuto = wordFrame(S, 's04-05', 'minuto');
  const wDominio = wordFrame(S, 's04-05', 'dominio');
  const wCamino = wordFrame(S, 's04-07', 'camino');
  const wCorreo = wordFrame(S, 's04-09', 'correo');
  const wEquipo = wordFrame(S, 's04-09', 'equipo');
  const wHora = wordFrame(S, 's04-09', 'hora');

  // ---- The EDR panel ----------------------------------------------------------------------
  const k = logScale(PANEL.w);
  const draw = progress(frame, edrAt - 4, 44, EASE.linear);
  const slide = progress(frame, beaconAt - 10, 22, EASE.inOut);
  const panelY = mix(PANEL_Y.rest, PANEL_Y.beacon, slide);
  const panelOut = progress(frame, c2At - 2, 12, EASE.inOut);
  const fall = progress(frame, c2At + 2, 26, EASE.inOut);

  const fExplorer = windowWeight(frame, openAt, wPowerShell);
  const fOpen = windowWeight(frame, openAt, dropAt);
  const fPs = windowWeight(frame, wPowerShell - 2, dropAt);
  const fDrop = windowWeight(frame, dropAt, beaconAt);
  const fTask = windowWeight(frame, taskAt, beaconAt);
  const fBeacon = windowWeight(frame, beaconAt, Number.POSITIVE_INFINITY);
  const dim = Math.max(fExplorer, fOpen, fPs, fDrop, fTask, fBeacon);

  // The beacon's pulse along the drawn arrow, once every 2 s («como un latido»).
  const beat = frame >= wMinuto ? ((frame - wMinuto) % 60) / 60 : undefined;
  const beaconRow = edrRowAnchor('beacon', PANEL.w, fBeacon);

  // ---- Right column: the phase card ------------------------------------------------------------
  const exIn = progress(frame, exploitationAt, 16) * (1 - progress(frame, installationAt - 8, 12));
  const exDim = progress(frame, dropAt, 14) * 0.7;
  const inIn = progress(frame, installationAt, 16) * (1 - progress(frame, beaconAt - 8, 12));
  const labelIn = progress(frame, wMinuto - 4, 14) * (1 - progress(frame, c2At, 12));
  const labelBeat = pulse(frame, fps, 0.5);

  // ---- The answer: two columns ---------------------------------------------------------------------
  // The columns stay through the exam card and give way as the voice starts the wrap («el correo…»).
  const colsOut = progress(frame, Math.max(wrapAt, wCorreo - 16), 12, EASE.inOut);
  const colA = progress(frame, c2At + 6, 14) * (1 - colsOut);
  const c2Name = progress(frame, c2At + 4, 16);
  const c2Head = progress(frame, wCamino - 4, 14);
  const colB = progress(frame, missionAt - 2, 16) * (1 - colsOut);
  const colBText = progress(frame, missionAt + 8, 14);

  // The beacon line flying from the panel into column A.
  const startSize = 30 * k * (1 + 0.1 * fBeacon);
  const lineSize = mix(startSize, A_LINE.size, fall);
  const lineLeft = mix(PANEL.x + beaconRow.x, COL_A.x + A_LINE.x, fall);
  const lineMid = mix(panelY + beaconRow.y, COL_A.y + A_LINE.y, fall);

  // ---- wrap-ii -----------------------------------------------------------------------------------------
  const wrapAt4: Record<string, number> = {
    delivery: wCorreo - 4,
    exploitation: wEquipo - 6,
    installation: wEquipo - 1,
    c2: wEquipo + 4,
  };
  const wrapShow = (id: PhaseId) => progress(frame, wrapAt4[id], 14);

  return (
    <Stage>
      {/* The EDR panel */}
      {panelOut < 1 ? (
        <div style={{ position: 'absolute', left: PANEL.x, top: panelY, opacity: 1 - panelOut, transform: `translateY(${panelOut * -24}px)` }}>
          <ProcessTree
            width={PANEL.w}
            draw={draw}
            show={{ beacon: fall > 0 ? 0 : 1 }}
            focus={{ explorer: fExplorer, open: fOpen, powershell: fPs, drop: fDrop, schtasks: fTask, schtasksTr: fTask, beacon: fBeacon }}
            dim={dim}
            focusTone={fBeacon > 0.5 ? C.rose : C.cyan}
            highlight={{
              openLnk: windowWeight(frame, openAt + 6, dropAt),
              powershell: windowWeight(frame, wPowerShell, dropAt),
              dropPath: windowWeight(frame, dropAt + 4, beaconAt),
              taskName: windowWeight(frame, taskAt + 4, beaconAt),
              beaconDomain: windowWeight(frame, wDominio - 4, Number.POSITIVE_INFINITY),
            }}
            beat={beat}
          />
        </div>
      ) : null}

      {/* «beacon · cada 60 s»: the line's only label before the answer */}
      {labelIn > 0 ? (
        <>
          <svg width={W} height={660} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: labelIn }}>
            <line x1={PANEL.x + beaconRow.end + 14} y1={panelY + beaconRow.y} x2={COL.x - 4} y2={panelY + beaconRow.y} stroke={alpha(C.roseSoft, 0.8)} strokeWidth={3} strokeLinecap="round" />
          </svg>
          <div
            style={{
              position: 'absolute',
              left: COL.x,
              top: panelY + beaconRow.y,
              transform: `translateY(-50%) translateX(${(1 - labelIn) * 12}px)`,
              opacity: labelIn,
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              padding: '8px 22px',
              borderRadius: 999,
              border: `3px solid ${alpha(C.roseSoft, 0.8)}`,
              background: alpha(C.rose, 0.1),
              fontFamily: FONT.sans,
              fontSize: 36,
              fontWeight: 750,
              color: C.roseSoft,
              whiteSpace: 'nowrap',
            }}
          >
            <span
              style={{
                width: 18,
                height: 18,
                borderRadius: 9,
                background: C.rose,
                boxShadow: `0 0 ${Math.round(6 + 16 * labelBeat)}px ${alpha(C.rose, 0.4 + 0.5 * labelBeat)}`,
                transform: `scale(${0.8 + 0.35 * labelBeat})`,
              }}
            />
            {BEACON_LABEL}
          </div>
        </>
      ) : null}

      {/* Right column: Exploitation, then Installation */}
      {exIn > 0 ? (
        <div style={{ position: 'absolute', left: COL.x, top: CARD_Y }}>
          <PhaseCard
            phase="exploitation"
            width={COL.w}
            vignetteW={CARD_VIGNETTE_W}
            look={{ show: exIn, act: progress(frame, exploitationAt + 2, 40, EASE.inOut), lit: 1 - exDim, tone: 'cyan' }}
            titleIn={progress(frame, wExploitation - 4, 14)}
            gloss={EXPLOITATION_GLOSS}
            glossIn={progress(frame, wCodigo - 4, 14)}
            dim={exDim}
          />
        </div>
      ) : null}
      {inIn > 0 ? (
        <div style={{ position: 'absolute', left: COL.x, top: CARD_Y }}>
          <PhaseCard
            phase="installation"
            width={COL.w}
            vignetteW={CARD_VIGNETTE_W}
            look={{ show: inIn, act: progress(frame, installationAt + 2, 36, EASE.inOut), lit: 1, tone: 'cyan' }}
            titleIn={progress(frame, wInstallation - 4, 14)}
            gloss={INSTALLATION_GLOSS}
            glossIn={progress(frame, wQuedarse - 4, 14)}
          />
        </div>
      ) : null}

      {/* Column A: C2, the channel */}
      {colA > 0 ? (
        <Column box={COL_A} appear={colA} tone={C.cyan}>
          <div style={{ position: 'absolute', left: 36, top: 30 }}>
            <PhaseTitle phase="c2" show={c2Name} size={50} />
          </div>
          <div
            style={{
              position: 'absolute',
              left: 36,
              top: 110,
              fontFamily: FONT.sans,
              fontSize: 40,
              fontWeight: 700,
              color: C.text,
              whiteSpace: 'nowrap',
              opacity: c2Head,
              transform: `translateY(${(1 - c2Head) * 10}px)`,
            }}
          >
            <span style={{ color: C.cyan, fontWeight: 850 }}>{COLUMNS.c2.head}</span> {COLUMNS.c2.text}
          </div>
          <div style={{ position: 'absolute', left: (COL_A.w - A_VIGNETTE.w) / 2, top: A_VIGNETTE.y }}>
            <Vignette phase="c2" width={A_VIGNETTE.w} look={{ act: progress(frame, c2At + 4, 40, EASE.inOut), lit: 1, tone: 'cyan' }} />
          </div>
          {/* the slot the beacon line falls into */}
          <div
            style={{
              position: 'absolute',
              left: 20,
              right: 20,
              top: A_LINE.y - 34,
              height: 68,
              borderRadius: 14,
              background: alpha(C.ink950, 0.7),
              border: `2px solid ${alpha(C.rose, 0.4 * fall)}`,
            }}
          />
        </Column>
      ) : null}

      {/* Column B: what Actions on Objectives would be — its slot still empty */}
      {colB > 0 ? (
        <Column box={COL_B} appear={colB} tone={C.faint}>
          <div style={{ position: 'absolute', left: 36, top: 30, right: 30, fontFamily: FONT.sans, opacity: colBText }}>
            <div style={{ fontSize: 42, fontWeight: 800, color: C.text, whiteSpace: 'nowrap' }}>{COLUMNS.aoo.head}</div>
            <div style={{ marginTop: 10, fontSize: 36, fontWeight: 600, lineHeight: 1.22, color: C.muted }}>{COLUMNS.aoo.text}</div>
          </div>
          <div style={{ position: 'absolute', left: (COL_B.w - B_VIGNETTE.w) / 2, top: B_VIGNETTE.y }}>
            <Vignette phase="actions" width={B_VIGNETTE.w} look={{ empty: 1, show: colBText }} />
          </div>
        </Column>
      ) : null}

      {/* The beacon line falling from the panel into column A (drawn over the columns) */}
      {fall > 0 && colsOut < 1 ? (
        <div
          style={{
            position: 'absolute',
            left: lineLeft,
            top: lineMid,
            transform: `translateY(-50%) scale(${lineSize / 30})`,
            transformOrigin: '0 50%',
            opacity: 1 - colsOut,
          }}
        >
          <LogLine id="beacon" size={30} highlight={{ beaconDomain: 1 }} beat={beat} />
        </div>
      ) : null}

      {/* wrap-ii: the four observed phases, each with its time as in its source */}
      {frame >= wrapAt4.delivery ? (
        <div style={{ position: 'absolute', left: WRAP_X, top: WRAP_Y }}>
          <KillChain
            width={WRAP_W}
            ids={WRAP_IDS}
            looks={Object.fromEntries(WRAP_IDS.map((id) => [id, { show: wrapShow(id), tone: 'cyan' as const, lit: 0.5 }]))}
            names={Object.fromEntries(WRAP_IDS.map((id) => [id, progress(frame, wrapAt4[id] + 6, 12)]))}
            overlay={OBSERVED.map((o, i) => {
              const s = WRAP_L.slot(o.phase);
              if (!s) return null;
              const t = progress(frame, wHora - 8 + i * 4, 12);
              return (
                <div
                  key={o.phase}
                  style={{
                    position: 'absolute',
                    left: s.cx,
                    top: WRAP_L.height + 18,
                    height: CHIP_H,
                    transform: `translateX(-50%) scale(${mix(0.9, 1, t)})`,
                    opacity: t,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '0 22px',
                    borderRadius: 999,
                    border: `2px solid ${alpha(C.cyan, 0.7)}`,
                    background: alpha(C.cyan, 0.1),
                    fontFamily: FONT.mono,
                    fontSize: 36,
                    fontWeight: 700,
                    color: C.cyan,
                    whiteSpace: 'nowrap',
                  }}
                >
                  <Icon name="clock" size={34} color={C.cyan} />
                  {o.time}
                </div>
              );
            })}
          />
        </div>
      ) : null}
    </Stage>
  );
}

function Column({ box, appear, tone, children }: { box: { x: number; y: number; w: number; h: number }; appear: number; tone: string; children: ReactNode }) {
  const a = clamp01(appear);
  return (
    <div
      style={{
        position: 'absolute',
        left: box.x,
        top: box.y,
        width: box.w,
        height: box.h,
        borderRadius: 24,
        border: `2px solid ${alpha(tone, 0.55)}`,
        background: `linear-gradient(180deg, ${alpha(C.ink850, 0.92)} 0%, ${alpha(C.ink900, 0.92)} 100%)`,
        opacity: a,
        transform: `translateY(${(1 - a) * 18}px)`,
      }}
    >
      {children}
    </div>
  );
}

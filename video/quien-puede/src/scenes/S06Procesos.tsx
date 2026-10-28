import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { Icon, clamp01, dimStyle } from '../../../engine/src/ui';
import { Link } from './parts/Link';
import { curveBetween, cubicPoint } from '../../../engine/src/ui/geometry';
import { Stage } from './kit';
import { AccountCard } from './parts/AccountCard';
import { ProcessRow, Rotulo, SceneStamp } from './parts/Bits';
import { FOLDER_NAME, INFORMES, PARTES, PROCESS_ROW, REPORTS_NAME } from './parts/data';
import { FolderAcl, FolderGlyph, aclRowCenterY } from './parts/FolderAcl';
import { Pill } from './parts/Labels';
import { win } from './parts/timing';

const DAYS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'] as const;
const FRIDAY = 4;
const DY = 44; // every layer sits a little lower than the stamp
const W = STAGE.width;
const H = STAGE.height;

/** A week grid with the Friday column marked: no month, no day numbers (the case has no date). */
function Calendar({ frame, fridayAt, show }: { frame: number; fridayAt: number; show: number }) {
  const cell = { w: 70, h: 54, gap: 6 };
  return (
    <div style={{ position: 'absolute', left: 0, top: 66, opacity: show, transform: `translateY(${(1 - show) * 16}px)`, fontFamily: FONT.sans }}>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(7, ${cell.w}px)`, gap: cell.gap }}>
        {DAYS.map((d, i) => {
          const on = i === FRIDAY ? progress(frame, fridayAt - 4, 12) : 0;
          return (
            <div key={d} style={{ height: 50, display: 'grid', placeItems: 'center', fontSize: 38, fontWeight: 850, color: on > 0.4 ? C.cyan : C.muted }}>
              {d}
            </div>
          );
        })}
        {Array.from({ length: 28 }, (_, k) => {
          const col = k % 7;
          const row = Math.floor(k / 7);
          const on = col === FRIDAY ? progress(frame, fridayAt + row * 5, 12) : 0;
          return (
            <div
              key={k}
              style={{
                height: cell.h,
                boxSizing: 'border-box',
                borderRadius: 12,
                border: `2px solid ${on > 0.02 ? alpha(C.cyan, 0.5 + 0.45 * on) : C.ink600}`,
                background: on > 0.02 ? alpha(C.cyan, 0.1 + 0.28 * on) : alpha(C.ink850, 0.9),
                boxShadow: on > 0.3 ? `0 0 ${Math.round(18 * on)}px ${alpha(C.cyan, 0.28 * on)}` : undefined,
                display: 'grid',
                placeItems: 'center',
              }}
            >
              {on > 0.3 ? <Icon name="check" size={30} color={C.cyan} strokeWidth={3} style={{ opacity: on }} /> : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** The program as a node of the pipeline. */
function ProgramCard({ left, top, width, height, glow, dim }: { left: number; top: number; width: number; height: number; glow: number; dim: number }) {
  return (
    <div
      style={{
        position: 'absolute',
        left,
        top,
        width,
        height,
        boxSizing: 'border-box',
        borderRadius: RADIUS.lg,
        border: `3px solid ${alpha(C.sky, 0.5 + 0.45 * glow)}`,
        background: `linear-gradient(180deg, ${alpha(C.sky, 0.1 + 0.06 * glow)}, ${alpha(C.ink900, 0.96)} 70%)`,
        boxShadow: glow > 0.02 ? `0 0 ${Math.round(36 * glow)}px ${alpha(C.sky, 0.34 * glow)}` : undefined,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        fontFamily: FONT.sans,
        ...dimStyle(dim),
      }}
    >
      <Icon name="app" size={64} color={C.sky} strokeWidth={1.9} />
      <div style={{ fontSize: 40, fontWeight: 850, color: C.textStrong, lineHeight: 1.1, textAlign: 'center', whiteSpace: 'nowrap' }}>
        programa
        <br />
        de resumen
      </div>
    </div>
  );
}

/** The compact process (phase 3): icon, executable name and its PID. */
function ProcessChip({ show }: { show: number }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: 60,
        width: 560,
        boxSizing: 'border-box',
        padding: '16px 24px',
        borderRadius: RADIUS.lg,
        border: `3px solid ${alpha(C.sky, 0.7)}`,
        background: `linear-gradient(90deg, ${alpha(C.sky, 0.14)}, ${alpha(C.ink850, 0.96)} 80%)`,
        fontFamily: FONT.sans,
        opacity: show,
        transform: `translateY(${(1 - show) * 16}px)`,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
        <div style={{ width: 60, height: 60, borderRadius: 14, display: 'grid', placeItems: 'center', background: alpha(C.sky, 0.14), border: `2px solid ${alpha(C.sky, 0.7)}` }}>
          <Icon name="app" size={36} color={C.sky} />
        </div>
        <span style={{ fontFamily: FONT.mono, fontSize: 42, fontWeight: 800, color: C.textStrong, letterSpacing: -1 }}>{PROCESS_ROW.name}</span>
      </div>
      <div style={{ marginTop: 10, fontSize: 34, fontWeight: 700, color: C.muted, whiteSpace: 'nowrap' }}>
        PID <span style={{ fontFamily: FONT.mono, color: C.textStrong, fontWeight: 800 }}>{PROCESS_ROW.pid}</span> · en marcha
      </div>
    </div>
  );
}

/** A grey placeholder row of the process list: no names (the case invents none). */
function SkeletonRow({ top, left, width, bar, show }: { top: number; left: number; width: number; bar: number; show: number }) {
  return (
    <div style={{ position: 'absolute', left, top, width, height: 52, boxSizing: 'border-box', display: 'flex', alignItems: 'center', gap: 18, padding: '0 22px', borderRadius: RADIUS.md, border: `2px solid ${C.ink700}`, background: alpha(C.ink850, 0.7), opacity: 0.55 * show }}>
      <div style={{ width: 32, height: 32, borderRadius: 8, background: alpha(C.sky, 0.25) }} />
      <div style={{ width: bar, height: 16, borderRadius: 8, background: alpha(C.muted, 0.3) }} />
      <span style={{ flex: 1 }} />
      <div style={{ width: 120, height: 16, borderRadius: 8, background: alpha(C.muted, 0.2) }} />
    </div>
  );
}

/**
 * s06-procesos «Los programas también tienen cuenta». Three phases on the same stage:
 *  1. (`friday`, `report`, `process`, `identity`) a week grid with the Friday column marked, the summary program reading the
 *     partes and leaving a document in «Informes»; with `process` the running program becomes a process and with
 *     `identity` it carries an account tag.
 *  2. (`plist`, `row`, `pid`, `proc-account`) the process list of srv-fich02, one real row between grey placeholders: the
 *     PID and the account are rotulated one after the other.
 *  3. (`service`, `no-login`, `owner`, `same`) the compact process, its account tag with the two marks, and on `same` the
 *     account joined to its two folders (Informes still without a write row: s07 shows it missing).
 * Layout note: «Partes de avería» here is a one-row view of the real list (the svc_resumen row), not the whole thread.
 */
export function S06Procesos(props: SceneProps) {
  const frame = useCurrentFrame();
  const fridayAt = props.cue('friday');
  const reportAt = props.cue('report');
  const processAt = props.cue('process');
  const identityAt = props.cue('identity');
  const plistAt = props.cue('plist');
  const rowAt = props.cue('row');
  const pidAt = props.cue('pid');
  const accountAt = props.cue('proc-account');
  const serviceAt = props.cue('service');
  const noLoginAt = props.cue('no-login');
  const ownerAt = props.cue('owner');
  const sameAt = props.cue('same');

  const p1 = 1 - progress(frame, plistAt - 10, 12, EASE.inOut);
  const p2 = win(frame, plistAt - 4, serviceAt - 6, 14);
  const p3 = progress(frame, serviceAt - 4, 16);

  // --- phase 1
  const back = progress(frame, processAt - 4, 16); // calendar and folders step back once the program is the subject
  const doc = progress(frame, reportAt + 4, 44, EASE.inOut);
  const landed = progress(frame, reportAt + 48, 12);
  const arrow1 = curveBetween({ x: 784, y: 250 }, { x: 908, y: 250 }, 0.4);
  const arrow2 = curveBetween({ x: 1304, y: 250 }, { x: 1488, y: 250 }, 0.4);
  const docPos = cubicPoint(arrow2, doc);
  const tag = progress(frame, identityAt, 18);

  // --- phase 2
  const pidCall = win(frame, pidAt, accountAt - 4, 10);
  const accCall = win(frame, accountAt, serviceAt - 12, 10);
  const rowW = progress(frame, rowAt - 4, 16);
  const X0 = (W - 1100) / 2;

  // --- phase 3
  const folders = progress(frame, serviceAt + 50, 22);
  const link = progress(frame, sameAt, 26, EASE.inOut);
  const sameOn = progress(frame, sameAt - 6, 14);
  const connA = curveBetween({ x: 600, y: 384 }, { x: 960, y: 60 + aclRowCenterY(0) }, 0.5);
  const connB = curveBetween({ x: 600, y: 384 }, { x: 960, y: 300 + 52 }, 0.5);
  const idLink = progress(frame, serviceAt + 6, 16);

  return (
    <Stage>
      <SceneStamp frame={frame} />

      {/* ---------- phase 1: the Friday program ---------- */}
      {p1 > 0.01 ? (
        <div style={{ position: 'absolute', left: 0, top: DY, width: W, height: H, opacity: p1 }}>
          <div style={{ ...dimStyle(back * 0.6) }}>
            <Calendar frame={frame} fridayAt={fridayAt} show={progress(frame, 4, 14)} />
            <Rotulo weight={progress(frame, fridayAt, 14)} size={58} style={{ position: 'absolute', left: 0, top: 410 }}>
              cada <span style={{ color: C.cyan }}>viernes</span>
            </Rotulo>
          </div>

          {/* partes -> program -> informes */}
          <div style={{ position: 'absolute', left: 560, top: 190, width: 320, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, fontFamily: FONT.sans, ...dimStyle(back * 0.6, progress(frame, 6, 14)) }}>
            <FolderGlyph width={110} />
            <span style={{ fontSize: 36, fontWeight: 800, color: C.textStrong, whiteSpace: 'nowrap' }}>{FOLDER_NAME}</span>
          </div>
          <div style={{ position: 'absolute', left: 1420, top: 190, width: 280, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, fontFamily: FONT.sans, ...dimStyle(back * 0.6, progress(frame, 10, 14)) }}>
            <FolderGlyph width={110} />
            <span style={{ fontSize: 36, fontWeight: 800, color: C.textStrong, whiteSpace: 'nowrap' }}>{REPORTS_NAME}</span>
            <span style={{ fontSize: 32, fontWeight: 700, color: '#6ee7b7', opacity: landed, whiteSpace: 'nowrap' }}>resumen</span>
          </div>
          <ProgramCard left={920} top={165} width={370} height={170} glow={Math.max(win(frame, fridayAt, reportAt + 40, 10) * 0.7, win(frame, processAt, plistAt - 8, 12))} dim={0} />
          <svg width={W} height={H} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} aria-hidden>
            <Link head curve={arrow1} color={C.cyan} width={5} draw={progress(frame, 12, 14)} opacity={1 - 0.6 * back} />
            <Link head curve={arrow2} color={C.cyan} width={5} draw={progress(frame, 14, 14)} opacity={1 - 0.6 * back} />
            <Link head curve={curveBetween({ x: 1105, y: 335 }, { x: 1105, y: 398 }, 0.4)} color={C.cyan} width={5} draw={tag} />
            {doc > 0 ? (
              <g transform={`translate(${docPos.x - 30} ${docPos.y - 66 + 12 * landed})`} opacity={clamp01(doc * 8) * (1 - 0.3 * landed)}>
                <Icon name="file" size={60} color={C.emerald} strokeWidth={2.2} />
              </g>
            ) : null}
          </svg>
          {/* running = a process; and it acts with the identity of an account */}
          <div style={{ position: 'absolute', left: 920, top: 98, width: 370, display: 'flex', justifyContent: 'center', ...enter(frame, processAt, { distance: 14, duration: 14 }) }}>
            <Pill text="en marcha: proceso" tone={C.sky} icon="play" size={36} on={win(frame, processAt, plistAt - 8, 10)} />
          </div>
          <div style={{ position: 'absolute', left: 905, top: 400, opacity: tag, transform: `translateY(${(1 - tag) * 14}px)` }}>
            <AccountCard kind="service" compact width={400} label="una cuenta" on={win(frame, identityAt, plistAt - 8, 10)} />
          </div>
        </div>
      ) : null}

      {/* ---------- phase 2: the process list of the server ---------- */}
      {p2 > 0.01 ? (
        <div style={{ position: 'absolute', left: 0, top: DY, width: W, height: H, opacity: p2 }}>
          <div style={{ position: 'absolute', left: X0, top: 64, display: 'flex', alignItems: 'center', gap: 18, fontFamily: FONT.sans, ...enter(frame, plistAt, { distance: 14, duration: 14 }) }}>
            <Icon name="server" size={52} color={C.sky} />
            <span style={{ fontSize: 48, fontWeight: 850, color: C.textStrong, letterSpacing: -1 }}>procesos en marcha</span>
            <Pill text={PROCESS_ROW.host} tone={C.sky} size={34} height={56} style={{ fontFamily: FONT.mono }} />
          </div>
          <SkeletonRow top={140} left={X0} width={1100} bar={300} show={progress(frame, plistAt + 4, 14)} />
          <SkeletonRow top={202} left={X0} width={1100} bar={220} show={progress(frame, plistAt + 8, 14)} />
          <div style={{ position: 'absolute', left: X0, top: 268, opacity: rowW, transform: `translateY(${(1 - rowW) * 18}px)` }}>
            <ProcessRow
              name={PROCESS_ROW.name}
              pid={PROCESS_ROW.pid}
              account={PROCESS_ROW.account}
              parent={PROCESS_ROW.parent}
              focus={rowW}
              pidOn={Math.max(pidCall, 0.45 * progress(frame, accountAt, 10))}
              accountOn={progress(frame, accountAt, 12)}
              parentOn={0}
            />
          </div>
          {/* call-outs under the chips */}
          <svg width={W} height={H} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} aria-hidden>
            {pidCall > 0.02 ? <path d={`M${X0 + 118} 440 V${440 + 44 * pidCall}`} stroke={alpha(C.sky, 0.9)} strokeWidth={5} strokeLinecap="round" /> : null}
            {accCall > 0.02 ? <path d={`M${X0 + 410} 440 V${440 + 44 * accCall}`} stroke={alpha(C.cyan, 0.9)} strokeWidth={5} strokeLinecap="round" /> : null}
          </svg>
          <Rotulo weight={pidCall} size={50} tone={C.textStrong} style={{ position: 'absolute', left: X0 + 24, top: 492 }}>
            <span style={{ color: C.sky, fontFamily: FONT.mono }}>PID</span> · número de proceso
          </Rotulo>
          <Rotulo weight={accCall} size={50} style={{ position: 'absolute', left: X0 + 200, top: 492 }}>
            la <span style={{ color: C.cyan }}>cuenta</span> con la que corre
          </Rotulo>
        </div>
      ) : null}

      {/* ---------- phase 3: the service account and its two folders ---------- */}
      {p3 > 0.01 ? (
        <div style={{ position: 'absolute', left: 0, top: DY, width: W, height: H, opacity: p3 }}>
          <ProcessChip show={progress(frame, serviceAt - 2, 16)} />
          <svg width={W} height={H} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} aria-hidden>
            <Link head curve={curveBetween({ x: 280, y: 196 }, { x: 280, y: 256 }, 0.4)} color={C.sky} width={5} draw={idLink} />
            <Link head curve={connA} color={C.cyan} width={5} draw={link} opacity={sameOn} />
            <Link head curve={connB} color={C.cyan} width={5} draw={link} opacity={sameOn} />
          </svg>
          <div style={{ position: 'absolute', left: 300, top: 206, fontFamily: FONT.sans, fontSize: 34, fontWeight: 700, color: C.muted, whiteSpace: 'nowrap', opacity: idLink }}>corre con esta cuenta</div>
          <div style={{ position: 'absolute', left: 0, top: 262, opacity: progress(frame, serviceAt, 16), transform: `translateY(${(1 - progress(frame, serviceAt, 16)) * 16}px)` }}>
            <AccountCard kind="service" noLogin={progress(frame, noLoginAt, 14)} owner={progress(frame, ownerAt, 14)} on={Math.max(win(frame, serviceAt, noLoginAt, 10), sameOn * 0.8)} />
          </div>
          {/* the two folders it can reach */}
          <div style={{ position: 'absolute', left: 968, top: 60, ...dimStyle(0.55 * (1 - sameOn), folders) }}>
            <FolderAcl entries={[PARTES[3]]} width={760} server={null} rest={false} fx={{ svc: { focus: sameOn } }} />
          </div>
          <div style={{ position: 'absolute', left: 968, top: 300, ...dimStyle(0.55 * (1 - sameOn), folders) }}>
            <FolderAcl entries={[INFORMES[0]]} name={REPORTS_NAME} width={760} server={null} rest={false} fx={{ boss: { focus: sameOn * 0.4 } }} />
          </div>
          <Rotulo weight={progress(frame, sameAt + 4, 16)} size={54} style={{ position: 'absolute', left: 968, top: 500 }}>
            el proceso puede lo que
            <br />
            puede <span style={{ color: C.cyan }}>su cuenta</span>
          </Rotulo>
        </div>
      ) : null}
    </Stage>
  );
}

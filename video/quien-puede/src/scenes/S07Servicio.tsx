import type { ReactNode } from 'react';
import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { Icon, clamp01 } from '../../../engine/src/ui';
import { Link } from './parts/Link';
import { curveBetween } from '../../../engine/src/ui/geometry';
import { Stage, wordFrame } from './kit';
import { AccountCard } from './parts/AccountCard';
import { ChoiceButtons, Rotulo, SceneStamp } from './parts/Bits';
import { FOLDER_NAME, INFORMES, PROCESS_ROW, REPORTS_NAME } from './parts/data';
import { FolderAcl, FolderGlyph, PermChip, aclRowCenterY } from './parts/FolderAcl';
import { GreyHand } from './parts/Hand';
import { Pencil } from './parts/People';
import { thinkWindow, win } from './parts/timing';

const S = 's07-servicio';
const W = STAGE.width;
const H = STAGE.height;
const INF_TOP = 240; // top of the Informes list
const DY = 40; // phases B and C sit lower than the stamp
const CHOICES = ['Administrador del servidor', 'Escribir en Informes'] as const;

/** The program as a failing / working card. `tone` rose = fails, emerald = fixed, sky = neutral. */
function ProgramBar({ tone, status, show, icon }: { tone: string; status: string; show: number; icon: 'x' | 'check' | 'app' }) {
  return (
    <div
      style={{
        width: 900,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        gap: 22,
        padding: '12px 28px 12px 22px',
        borderRadius: RADIUS.lg,
        border: `3px solid ${alpha(tone, 0.85)}`,
        background: `linear-gradient(90deg, ${alpha(tone, 0.14)}, ${alpha(C.ink850, 0.96)} 80%)`,
        boxShadow: `0 0 ${Math.round(30 * show)}px ${alpha(tone, 0.28)}`,
        fontFamily: FONT.sans,
      }}
    >
      <div style={{ width: 64, height: 64, borderRadius: 16, display: 'grid', placeItems: 'center', background: alpha(tone, 0.16), border: `2px solid ${alpha(tone, 0.8)}` }}>
        <Icon name="app" size={40} color={tone} />
      </div>
      <div style={{ display: 'grid', gap: 4 }}>
        <span style={{ fontFamily: FONT.mono, fontSize: 40, fontWeight: 800, color: C.textStrong, letterSpacing: -1 }}>{PROCESS_ROW.name}</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 12, fontSize: 36, fontWeight: 800, color: tone === C.rose ? C.roseSoft : tone === C.emerald ? '#6ee7b7' : C.muted, whiteSpace: 'nowrap' }}>
          {icon !== 'app' ? <Icon name={icon} size={36} color={tone} strokeWidth={2.8} /> : null}
          {status}
        </span>
      </div>
    </div>
  );
}

/** A thing the account can reach: folder (or server) icon, what it could do, in a tone. */
function Target({ icon, text, tone, perm, width = 768, show, focus = 0 }: { icon: 'folder' | 'server'; text: ReactNode; tone: string; perm?: 'read' | 'write'; width?: number; show: number; focus?: number }) {
  const s = clamp01(show);
  return (
    <div
      style={{
        width,
        height: 96,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        gap: 20,
        padding: '0 22px 0 20px',
        borderRadius: RADIUS.md,
        border: `3px solid ${alpha(tone, 0.55 + 0.4 * focus)}`,
        background: `linear-gradient(90deg, ${alpha(tone, 0.12)}, ${alpha(C.ink850, 0.95)} 80%)`,
        boxShadow: focus > 0.02 ? `0 0 ${Math.round(30 * focus)}px ${alpha(tone, 0.3 * focus)}` : undefined,
        opacity: s,
        transform: `translateX(${(1 - s) * 30}px)`,
        fontFamily: FONT.sans,
      }}
    >
      {icon === 'folder' ? <FolderGlyph width={66} tone={tone} /> : <Icon name="server" size={58} color={tone} strokeWidth={2} />}
      <span style={{ fontSize: 42, fontWeight: 850, letterSpacing: -0.5, color: C.textStrong, whiteSpace: 'nowrap' }}>{text}</span>
      <span style={{ flex: 1 }} />
      {perm ? <PermChip perm={perm} tone={tone} size={32} /> : null}
    </div>
  );
}

/** A grey placeholder bar: what lies beyond the account's reach (the case names none of it). */
function Beyond({ top, show }: { top: number; show: number }) {
  return (
    <div style={{ position: 'absolute', left: 960, top, width: 768, height: 56, boxSizing: 'border-box', display: 'flex', alignItems: 'center', gap: 18, padding: '0 22px', borderRadius: RADIUS.md, border: `2px dashed ${alpha(C.muted, 0.4)}`, background: alpha(C.ink850, 0.5), opacity: 0.6 * show }}>
      <div style={{ width: 34, height: 34, borderRadius: 8, background: alpha(C.muted, 0.3) }} />
      <div style={{ width: 280, height: 16, borderRadius: 8, background: alpha(C.muted, 0.3) }} />
    </div>
  );
}

/**
 * s07-servicio «El viernes del resumen». Phase A: the summary program fails (`fails`, rose) because «Informes» has no
 * write row for svc_resumen (ghost row); the quick fix (`proposal`: svc_resumen to administradores, an amber connector);
 * the think prompt (`choice`) with the two buttons LOW, left; `answer` turns «Escribir en Informes» emerald and the missing
 * row appears in green. Phase B (`hand`, `admin-risk`): a grey hand takes the process and reaches exactly what its account
 * reaches (a dashed emerald fence, «ni un paso más»); with administrador the fence goes and the same three slots turn amber.
 * Phase C (`needs`, `config`, `wrap`): two needs, two green grants, «una cuenta de servicio también, lo justo».
 */
export function S07Servicio(props: SceneProps) {
  const frame = useCurrentFrame();
  const failsAt = props.cue('fails');
  const proposalAt = props.cue('proposal');
  const choiceAt = props.cue('choice');
  const answerAt = props.cue('answer');
  const handAt = props.cue('hand');
  const adminAt = props.cue('admin-risk');
  const needsAt = props.cue('needs');
  const configAt = props.cue('config');
  const wrapAt = props.cue('wrap');
  const think = thinkWindow(S);
  const hold = think ? win(frame, think.from - 6, think.to + 6, 8) : 0;

  const wA = 1 - progress(frame, handAt - 8, 12, EASE.inOut);
  const wB = win(frame, handAt - 4, needsAt - 8, 12);
  const wC = progress(frame, needsAt - 4, 14);

  // --- phase A
  const fail = progress(frame, failsAt, 14);
  const fixed = progress(frame, answerAt + 30, 16);
  const propose = progress(frame, proposalAt, 16);
  const rejected = progress(frame, answerAt + 6, 16);
  const choose = progress(frame, choiceAt, 14);
  const reveal = progress(frame, answerAt, 14);
  const rowIn = progress(frame, answerAt + 8, 16);
  const connRose = curveBetween({ x: 904, y: 294 }, { x: 962, y: INF_TOP + aclRowCenterY(1) }, 0.5);

  // --- phase B
  const handIn = progress(frame, handAt - 2, 20, EASE.inOut);
  const fence = 1 - progress(frame, adminAt - 4, 12);
  const admin = progress(frame, adminAt, 12);
  const a1 = Math.max(adminAt + 2, wordFrame(S, 's07-03', 'borrar') - 6);
  const a2 = Math.max(a1 + 16, wordFrame(S, 's07-03', 'tocar') - 6);
  const a3 = Math.max(a2 + 16, wordFrame(S, 's07-03', 'servidor') - 6);
  const t1 = progress(frame, a1, 14);
  const t2 = progress(frame, a2, 14);
  const t3 = progress(frame, a3, 14);
  const slotTop = [110, 214, 318] as const;
  const reachTone = admin > 0.5 ? C.amber : C.emerald;
  const reachCurve = (i: number) => curveBetween({ x: 650, y: 355 }, { x: 954, y: slotTop[i] + 48 }, 0.5);

  // --- phase C
  const need1 = progress(frame, needsAt, 14);
  const need2 = progress(frame, Math.max(needsAt + 14, wordFrame(S, 's07-04', 'escribir') - 8), 14);
  const grant1 = progress(frame, configAt, 14);
  const grant2 = progress(frame, configAt + 22, 14);

  return (
    <Stage>
      <SceneStamp frame={frame} hide={hold} />

      {/* ---------- phase A ---------- */}
      {wA > 0.01 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: wA }}>
          <Rotulo weight={progress(frame, 4, 16) * (1 - hold) * (1 - progress(frame, answerAt, 12))} size={58} style={{ position: 'absolute', left: 0, top: 78 }}>
            un viernes, el resumen <span style={{ color: C.rose }}>falla</span>
          </Rotulo>

          {/* the program */}
          <div style={{ position: 'absolute', left: 0, top: 236, ...enter(frame, 2, { distance: 16, duration: 14 }) }}>
            <ProgramBar tone={fixed > 0.5 ? C.emerald : fail > 0.4 ? C.rose : C.sky} status={fixed > 0.5 ? 'guarda en Informes' : fail > 0.4 ? 'no puede guardar en Informes' : 'resumen del viernes'} show={Math.max(fail * (1 - fixed), fixed)} icon={fixed > 0.5 ? 'check' : fail > 0.4 ? 'x' : 'app'} />
          </div>

          {/* Informes: the write row does not exist yet */}
          <div style={{ position: 'absolute', left: 968, top: INF_TOP, ...enter(frame, 6, { distance: 18, duration: 16 }) }}>
            <FolderAcl
              entries={INFORMES}
              name={REPORTS_NAME}
              server={null}
              rest={false}
              width={760}
              fx={{ svcw: { missing: frame < answerAt + 8, focus: rowIn, show: frame < answerAt + 8 ? 1 : 0.4 + 0.6 * rowIn } }}
            />
          </div>
          <svg width={W} height={H} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} aria-hidden>
            <Link curve={connRose} color={fixed > 0.5 ? C.emerald : C.rose} width={5} dashed opacity={fail * (1 - 0.7 * rowIn)} />
          </svg>
          <div style={{ position: 'absolute', left: 936, top: INF_TOP + aclRowCenterY(1) - 26, width: 52, height: 52, borderRadius: 26, display: 'grid', placeItems: 'center', background: alpha(C.ink950, 0.9), border: `3px solid ${C.rose}`, opacity: fail * (1 - rowIn) }}>
            <Icon name="x" size={30} color={C.rose} strokeWidth={3} />
          </div>

          <div style={{ position: 'absolute', left: 968, top: INF_TOP + aclRowCenterY(1) - 22, width: 736, textAlign: 'right', fontFamily: FONT.sans, fontSize: 30, fontWeight: 750, color: C.roseSoft, opacity: fail * (1 - rowIn), whiteSpace: 'nowrap' }}>falta la fila de escritura</div>

          {/* the quick fix: an amber proposal */}
          <div style={{ position: 'absolute', left: 0, top: 366, width: 900, height: 84, opacity: propose * (1 - 0.65 * rejected), transform: `translateY(${(1 - propose) * 16}px)` }}>
            <div style={{ position: 'absolute', left: 0, top: 0, width: 340, height: 84, boxSizing: 'border-box', display: 'flex', alignItems: 'center', gap: 14, padding: '0 20px', borderRadius: RADIUS.md, border: `3px dashed ${alpha(C.amber, 0.7)}`, background: alpha(C.amber, 0.07), fontFamily: FONT.sans }}>
              <Icon name="gear" size={44} color={C.sky} />
              <span style={{ fontFamily: FONT.mono, fontSize: 36, fontWeight: 800, color: C.textStrong, letterSpacing: -1, whiteSpace: 'nowrap' }}>svc_resumen</span>
            </div>
            <div style={{ position: 'absolute', left: 430, top: 0, width: 470, height: 84, boxSizing: 'border-box', display: 'flex', alignItems: 'center', gap: 14, padding: '0 20px', borderRadius: RADIUS.md, border: `3px dashed ${alpha(C.amber, 0.7)}`, background: alpha(C.amber, 0.07), fontFamily: FONT.sans }}>
              <Icon name="shield" size={44} color={C.amber} />
              <span style={{ fontSize: 40, fontWeight: 850, color: C.textStrong, whiteSpace: 'nowrap' }}>administradores</span>
            </div>
            <svg width={900} height={84} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} aria-hidden>
              <Link head curve={curveBetween({ x: 346, y: 42 }, { x: 424, y: 42 }, 0.4)} color={C.amber} width={5} draw={progress(frame, proposalAt + 8, 14)} />
            </svg>
          </div>

          {/* the two buttons of the think prompt */}
          <div style={{ position: 'absolute', left: 0, top: 478 }}>
            <ChoiceButtons items={CHOICES} answer={1} show={choose} reveal={reveal} width={900} size={38} />
          </div>
        </div>
      ) : null}

      {/* ---------- phase B: the grey hand ---------- */}
      {wB > 0.01 ? (
        <div style={{ position: 'absolute', left: 0, top: DY, width: W, height: H, opacity: wB }}>
          {/* the process, with a hand on it */}
          <div style={{ position: 'absolute', left: 90, top: 292, opacity: progress(frame, handAt - 6, 14) }}>
            <div style={{ width: 560, boxSizing: 'border-box', padding: '16px 24px', borderRadius: RADIUS.lg, border: `3px solid ${alpha(C.sky, 0.7)}`, background: `linear-gradient(90deg, ${alpha(C.sky, 0.14)}, ${alpha(C.ink850, 0.96)} 80%)`, fontFamily: FONT.sans }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
                <Icon name="app" size={50} color={C.sky} />
                <span style={{ fontFamily: FONT.mono, fontSize: 42, fontWeight: 800, color: C.textStrong, letterSpacing: -1 }}>{PROCESS_ROW.name}</span>
              </div>
              <div style={{ marginTop: 6, fontSize: 32, fontWeight: 700, color: C.muted, whiteSpace: 'nowrap' }}>
                cuenta <span style={{ fontFamily: FONT.mono, color: C.cyan, fontWeight: 800 }}>{PROCESS_ROW.account}</span>
              </div>
            </div>
          </div>
          <div style={{ position: 'absolute', left: 250, top: 96 - 26 * (1 - handIn), opacity: handIn }}>
            <GreyHand size={150} tilt={180} tone={admin > 0.5 ? C.amber : C.muted} />
          </div>
          <Rotulo weight={handIn} size={38} style={{ position: 'absolute', left: 60, top: 462 }}>
            si alguien <span style={{ color: C.muted }}>maneja el programa</span>
          </Rotulo>

          {/* what its account reaches */}
          <div style={{ position: 'absolute', left: 946, top: 46, fontFamily: FONT.sans, fontSize: 34, fontWeight: 750, color: '#6ee7b7', opacity: handIn * fence, whiteSpace: 'nowrap' }}>hasta aquí llega su cuenta</div>
          <div style={{ position: 'absolute', left: 946, top: 94, width: 782, height: 232, boxSizing: 'border-box', borderRadius: RADIUS.lg, border: `3px dashed ${alpha(C.emerald, 0.75)}`, opacity: handIn * fence }} />
          <div style={{ position: 'absolute', left: 960, top: slotTop[0] }}>
            <Target icon="folder" tone={admin > 0.5 ? C.amber : C.emerald} perm={admin > 0.5 ? undefined : 'read'} show={handIn} focus={t1 * admin} text={admin > 0.5 ? <>borrar <span style={{ color: C.amber }}>{FOLDER_NAME}</span></> : FOLDER_NAME} />
          </div>
          <div style={{ position: 'absolute', left: 960, top: slotTop[1] }}>
            <Target icon="folder" tone={admin > 0.5 ? C.amber : C.emerald} perm={admin > 0.5 ? undefined : 'write'} show={handIn} focus={t2 * admin} text={admin > 0.5 ? <>tocar <span style={{ color: C.amber }}>{REPORTS_NAME}</span></> : REPORTS_NAME} />
          </div>
          <div style={{ position: 'absolute', left: 960, top: slotTop[2] }}>
            <Target icon="server" tone={C.amber} show={t3} focus={t3} text="el servidor entero" />
          </div>
          {/* ni un paso más: the wall, and what lies beyond it */}
          <div style={{ position: 'absolute', left: 946, top: 346, width: 782, borderTop: `5px dashed ${alpha(C.rose, 0.85)}`, opacity: handIn * fence }} />
          <Rotulo weight={handIn * fence} size={44} tone={C.roseSoft} style={{ position: 'absolute', left: 946, top: 366 }}>
            ni un paso más
          </Rotulo>
          <Beyond top={452} show={handIn * fence} />
          <Beyond top={520} show={handIn * fence} />
          <svg width={W} height={H} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} aria-hidden>
            <Link head curve={reachCurve(0)} color={reachTone} width={5} draw={handIn} />
            <Link head curve={reachCurve(1)} color={reachTone} width={5} draw={handIn} />
            <Link head curve={reachCurve(2)} color={C.amber} width={5} draw={t3} />
          </svg>
        </div>
      ) : null}

      {/* ---------- phase C: two needs, two grants ---------- */}
      {wC > 0.01 ? (
        <div style={{ position: 'absolute', left: 0, top: DY, width: W, height: H, opacity: wC }}>
          <div style={{ position: 'absolute', left: 0, top: 40, opacity: progress(frame, needsAt - 2, 14) }}>
            <AccountCard kind="service" compact width={520} on={win(frame, needsAt, wrapAt, 12) * 0.7} />
          </div>
          <div style={{ position: 'absolute', left: 0, top: 172, opacity: need1, transform: `translateY(${(1 - need1) * 16}px)` }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 18, height: 96, padding: '0 30px 0 22px', boxSizing: 'border-box', borderRadius: RADIUS.pill, border: `3px solid ${alpha(C.cyan, 0.8)}`, background: alpha(C.cyan, 0.1), fontFamily: FONT.sans, fontSize: 46, fontWeight: 850, color: C.textStrong, whiteSpace: 'nowrap' }}>
              <Icon name="eye" size={48} color={C.cyan} strokeWidth={2} />
              leer los partes
            </div>
          </div>
          <div style={{ position: 'absolute', left: 0, top: 292, opacity: need2, transform: `translateY(${(1 - need2) * 16}px)` }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 18, height: 96, padding: '0 30px 0 22px', boxSizing: 'border-box', borderRadius: RADIUS.pill, border: `3px solid ${alpha(C.cyan, 0.8)}`, background: alpha(C.cyan, 0.1), fontFamily: FONT.sans, fontSize: 46, fontWeight: 850, color: C.textStrong, whiteSpace: 'nowrap' }}>
              <Pencil size={48} color={C.cyan} strokeWidth={2} />
              escribir en informes
            </div>
          </div>
          <svg width={W} height={H} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} aria-hidden>
            <Link head curve={curveBetween({ x: 640, y: 220 }, { x: 850, y: 220 }, 0.4)} color={C.emerald} width={5} draw={grant1} />
            <Link head curve={curveBetween({ x: 640, y: 340 }, { x: 850, y: 340 }, 0.4)} color={C.emerald} width={5} draw={grant2} />
          </svg>
          <div style={{ position: 'absolute', left: 860, top: 172 }}>
            <Target icon="folder" tone={C.emerald} perm="read" width={868} show={grant1} focus={grant1 * 0.6} text={`${FOLDER_NAME}`} />
          </div>
          <div style={{ position: 'absolute', left: 860, top: 292 }}>
            <Target icon="folder" tone={C.emerald} perm="write" width={868} show={grant2} focus={grant2 * 0.6} text={REPORTS_NAME} />
          </div>
          <Rotulo weight={progress(frame, wrapAt, 16)} size={62} style={{ position: 'absolute', left: 0, top: 462 }}>
            una cuenta de servicio también:
            <br />
            <span style={{ color: C.emerald }}>lo justo</span>
          </Rotulo>
        </div>
      ) : null}
    </Stage>
  );
}

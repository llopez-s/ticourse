import type { ReactNode } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { EASE, progress, pulse, springIn } from '../../../engine/src/theme/motion';
import { Chip, Icon, clamp01, dimStyle } from '../../../engine/src/ui';
import { CABINET, CLOCK_TICKS, COPY, LOAN, REQUEST, STANDING, TERMS, WINDOW } from '../data/s10-jit';
import { KeyCabinet } from './parts/Cabinet';
import { MarkStamp, TermTag } from './parts/Marks';
import { VaultConsole, VaultField } from './parts/VaultConsole';
import { Stage, segment, wordFrame } from './kit';

const S = 's10-jit';
const W = 1728;

// The 24-h clock (left), clear of the intercepted message above it.
const RING = { cx: 250, cy: 420, r: 186, stroke: 30 };
// Right side.
const CONSOLE = { x: 520, y: 0, w: W - 520, h: 404 };
const LOANC = { x: 520, y: 424, w: 690, h: 232 };
const COPYC = { x: 1262, y: 452, w: 466, h: 132 };
const CAB = { x: 40, y: 104, w: 770 };

const angleOf = (h: number) => (h / 24) * 360 - 90;
const polar = (h: number, r: number) => {
  const a = (angleOf(h) * Math.PI) / 180;
  return { x: RING.cx + r * Math.cos(a), y: RING.cy + r * Math.sin(a) };
};
/** SVG arc path between two hours (clockwise). */
function arcPath(h0: number, h1: number, r: number): string {
  const span = Math.max(0.0001, Math.min(23.999, h1 - h0));
  const a = polar(h0, r);
  const b = polar(h0 + span, r);
  const large = span > 12 ? 1 : 0;
  return `M ${a.x} ${a.y} A ${r} ${r} 0 ${large} 1 ${b.x} ${b.y}`;
}

/**
 * s10-jit «Solo durante la ventana». Under SILENT PAGER's message, a 24-h clock
 * fills rose all day: «administrador del dominio · fijo», labelled «sin JIT ·
 * lo que propone» (his proposal, not the port's state). In the port the
 * privilege is asked for: the vault console shows L. Ferrer's request (window
 * 28-10 · 22:00–23:00), R. Salas approves, the vault lends a credential valid
 * until 23:00 (recorded session, separate admin account). At 23:00 the
 * privilege is withdrawn and the password rotated; a padlock snaps on the cue
 * (JUST-IN-TIME PERMISSIONS); a copy tried at 23:05 bounces on the cue — «ya no
 * sirve» (EPHEMERAL CREDENTIALS). Chapter close: the guardhouse cabinet lends
 * the key and changes the lock when it comes back.
 */
export function S10Jit(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const standing = props.cue('standing');
  const request = props.cue('request');
  const approve = props.cue('approve');
  const checkout = props.cue('checkout');
  const clock = props.cue('clock');
  const revoked = props.cue('revoked');
  const copy = props.cue('copy');
  const lockChange = props.cue('lock-change');
  const s01 = segment(props, 's10-01');

  const wFijo = wordFrame(S, 's10-01', 'fijo');
  const wDia = wordFrame(S, 's10-01', 'día');
  const wRobada = wordFrame(S, 's10-01', 'robada');
  const wAdmin = wordFrame(S, 's10-02', 'administrador');
  const wCambio = wordFrame(S, 's10-02', 'cambio');
  const wDiez = wordFrame(S, 's10-02', 'diez');
  const wPunto = wordFrame(S, 's10-04', 'punto');
  const wDesaparece = wordFrame(S, 's10-04', 'desaparece');
  const wVentana = wordFrame(S, 's10-05', 'ventana');
  const wSirve = wordFrame(S, 's10-06', 'sirve');
  const wEphemeral = wordFrame(S, 's10-06', 'ephemeral');
  const wPrestan = wordFrame(S, 's10-07', 'prestan');
  const wDevolverla = wordFrame(S, 's10-07', 'devolverla');
  const wCambian = wordFrame(S, 's10-07', 'cambian');

  // ---- The clock -------------------------------------------------------------
  const sweep = progress(frame, standing + 4, Math.max(30, wDia - standing), EASE.inOut);
  const roseOut = progress(frame, s01.to - 8, 16, EASE.inOut);
  const windowIn = progress(frame, wDiez - 6, 16);
  const windowPulse = progress(frame, wVentana - 6, 10) * (1 - progress(frame, wVentana + 24, 14));
  const handIn = progress(frame, checkout, 14);
  const handP = progress(frame, clock + 2, Math.max(16, wPunto - clock), EASE.inOut);
  const windowDone = progress(frame, wPunto, 14);
  const hourNow = WINDOW.from + (WINDOW.to - WINDOW.from) * handP;

  // ---- Right side --------------------------------------------------------------
  const consoleOut = progress(frame, revoked - 10, 14, EASE.inOut);
  const retiredAt = wDesaparece - 4;
  const loanDim = progress(frame, retiredAt - 2, 12);
  // The shackle closes ending exactly on the cue (the lock sound's click).
  const lockSnap = progress(frame, revoked - 6, 6, EASE.in);
  const copyIn = progress(frame, copy - 10, 10, EASE.out);
  const shake = frame >= copy && frame < copy + 14 ? Math.sin((frame - copy) * 1.9) * 12 * (1 - (frame - copy) / 14) : 0;
  const reject = progress(frame, copy, 6);

  // ---- Chapter close -------------------------------------------------------------
  const allOut = progress(frame, lockChange - 10, 16, EASE.inOut);
  const takeAt = wPrestan - 2;
  const returnAt = wDevolverla - 2;

  return (
    <Stage>
      {allOut < 1 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: 1 - allOut }}>
          {/* ===== The 24-h clock ===== */}
          <svg width={W} height={660} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
            {/* track */}
            <circle cx={RING.cx} cy={RING.cy} r={RING.r} fill={alpha(C.ink900, 0.9)} stroke={C.ink700} strokeWidth={RING.stroke} />
            {Array.from({ length: 24 }, (_, h) => {
              const major = h % 6 === 0;
              const a = polar(h, RING.r + RING.stroke / 2 + 4);
              const b = polar(h, RING.r + RING.stroke / 2 + (major ? 20 : 11));
              return <line key={h} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={major ? C.muted : C.ink500} strokeWidth={major ? 4 : 2.5} strokeLinecap="round" />;
            })}
            {/* SILENT PAGER's proposal: rose all day */}
            {sweep > 0 && roseOut < 1 ? (
              <path d={arcPath(0, 24 * sweep, RING.r)} fill="none" stroke={C.rose} strokeWidth={RING.stroke} strokeLinecap="butt" opacity={1 - roseOut} />
            ) : null}
            {/* The approved window, 22:00–23:00 */}
            {windowIn > 0 ? (
              <path
                d={arcPath(WINDOW.from, WINDOW.to, RING.r)}
                fill="none"
                stroke={windowDone > 0.5 ? C.emerald : C.cyan}
                strokeWidth={RING.stroke + 14 + 8 * windowPulse}
                strokeLinecap="round"
                opacity={windowIn * (1 - 0.45 * windowDone)}
              />
            ) : null}
            {/* The hand */}
            {handIn > 0 ? (
              <g opacity={handIn}>
                <line x1={RING.cx} y1={RING.cy} x2={polar(hourNow, RING.r - 40).x} y2={polar(hourNow, RING.r - 40).y} stroke={C.cyanSoft} strokeWidth={6} strokeLinecap="round" />
                <circle cx={RING.cx} cy={RING.cy} r={9} fill={C.cyanSoft} />
              </g>
            ) : null}
          </svg>
          {/* hour labels, inside the ring */}
          {CLOCK_TICKS.map((t) => {
            const p = polar(t.h, RING.r - 50);
            return (
              <div key={t.h} style={{ position: 'absolute', left: p.x - 30, top: p.y - 18, width: 60, textAlign: 'center', fontFamily: FONT.mono, fontSize: 28, fontWeight: 700, color: C.muted }}>
                {t.label}
              </div>
            );
          })}
          {/* the stolen password, valid any night */}
          {roseOut < 1 ? (
            <div style={{ position: 'absolute', left: polar(2.5, RING.r).x - 30, top: polar(2.5, RING.r).y - 30, width: 60, height: 60, borderRadius: 30, display: 'grid', placeItems: 'center', background: C.ink950, border: `3px solid ${C.rose}`, opacity: progress(frame, wRobada - 4, 10) * (1 - roseOut), transform: `scale(${0.8 + 0.2 * progress(frame, wRobada - 4, 10)})` }}>
              <Icon name="key" size={36} color={C.rose} strokeWidth={2.4} />
            </div>
          ) : null}
          {/* centre: the time once the loan starts */}
          {handIn > 0 ? (
            <div style={{ position: 'absolute', left: RING.cx - 110, top: RING.cy + 26, width: 220, textAlign: 'center', fontFamily: FONT.mono, fontSize: 54, fontWeight: 800, color: windowDone > 0.5 ? '#6ee7b7' : C.textStrong, opacity: handIn, fontVariantNumeric: 'tabular-nums' }}>
              {fmtHour(hourNow)}
            </div>
          ) : null}

          {/* SILENT PAGER's proposal, labelled as such */}
          {roseOut < 1 ? (
            <div style={{ position: 'absolute', left: 520, top: 286, opacity: 1 - roseOut, fontFamily: FONT.sans }}>
              <div style={{ opacity: progress(frame, standing, 14), transform: `translateX(${(1 - progress(frame, standing, 14)) * 20}px)` }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 12, padding: '8px 22px', borderRadius: RADIUS.pill, border: `2px solid ${alpha(C.rose, 0.8)}`, background: alpha(C.roseDeep, 0.7), fontSize: 34, fontWeight: 800, color: C.roseSoft, whiteSpace: 'nowrap' }}>
                  <Icon name="terminal" size={34} color={C.rose} />
                  {STANDING.label}
                </span>
              </div>
              <div style={{ marginTop: 26, display: 'flex', alignItems: 'center', gap: 18, opacity: progress(frame, wFijo - 6, 14), transform: `translateX(${(1 - progress(frame, wFijo - 6, 14)) * 20}px)` }}>
                <span style={{ width: 54, height: 18, borderRadius: 9, background: C.rose, flexShrink: 0 }} />
                <span style={{ fontSize: 50, fontWeight: 850, color: C.textStrong, whiteSpace: 'nowrap', letterSpacing: -0.5 }}>{STANDING.band}</span>
              </div>
            </div>
          ) : null}

          {/* ===== The vault console: the request ===== */}
          {consoleOut < 1 ? (
            <div style={{ position: 'absolute', left: CONSOLE.x, top: CONSOLE.y, opacity: 1 - consoleOut }}>
              <VaultConsole
                width={CONSOLE.w}
                height={CONSOLE.h}
                at={request - 4}
                glow={progress(frame, approve - 4, 12) * (1 - progress(frame, checkout + 20, 20))}
                right={
                  <Chip accent="amber" icon="file" size={28}>
                    {REQUEST.chip}
                  </Chip>
                }
              >
                <div style={{ position: 'absolute', left: 30, top: 18 }}>
                  <VaultField label="" labelW={0} value={REQUEST.who} at={request + 2} icon="user" size={42} />
                </div>
                <div style={{ position: 'absolute', left: 30, top: 84 }}>
                  <VaultField label="" labelW={0} value={REQUEST.role} at={wAdmin - 6} icon="shield" tone="amber" size={38} />
                </div>
                <div style={{ position: 'absolute', left: 30, top: 144 }}>
                  <VaultField label={REQUEST.reasonLabel} value={REQUEST.reason} at={wCambio - 6} icon="file" size={36} labelW={168} />
                </div>
                <div style={{ position: 'absolute', left: 30, top: 202 }}>
                  <VaultField label={REQUEST.windowLabel} value={REQUEST.window} at={wDiez - 6} icon="clock" size={36} labelW={168} mono focus={windowIn * (1 - progress(frame, approve, 12))} />
                </div>
                <ApproveRow frame={frame} fps={fps} at={approve} />
              </VaultConsole>
            </div>
          ) : null}

          {/* ===== The loan ===== */}
          <LoanCard frame={frame} fps={fps} at={checkout} dim={loanDim} retiredAt={retiredAt} lockSnap={lockSnap} lockAt={revoked} />

          {/* ===== The copy at 23:05 ===== */}
          {copyIn > 0 ? (
            <>
              <svg width={W} height={660} style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none', opacity: copyIn }}>
                <path d={`M ${LOANC.x + LOANC.w + 4} ${LOANC.y + 60} C ${LOANC.x + LOANC.w + 30} ${LOANC.y + 60} ${COPYC.x - 30} ${COPYC.y + COPYC.h / 2} ${COPYC.x - 6} ${COPYC.y + COPYC.h / 2}`} fill="none" stroke={alpha(C.rose, 0.7)} strokeWidth={4} strokeDasharray="10 9" />
              </svg>
              <div style={{ position: 'absolute', left: COPYC.x + (1 - copyIn) * 120 + shake, top: COPYC.y, width: COPYC.w, height: COPYC.h, opacity: copyIn }}>
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    boxSizing: 'border-box',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 18,
                    padding: '0 26px',
                    borderRadius: RADIUS.lg,
                    border: `3px dashed ${alpha(C.rose, 0.8)}`,
                    background: `linear-gradient(180deg, ${alpha(C.rose, 0.12)} 0%, ${alpha(C.ink900, 0.96)} 100%)`,
                    fontFamily: FONT.sans,
                    ...dimStyle(0.6 * reject),
                  }}
                >
                  <Icon name="key" size={52} color={C.rose} strokeWidth={2.2} />
                  <span style={{ fontSize: 42, fontWeight: 850, color: C.textStrong, whiteSpace: 'nowrap' }}>{COPY.card}</span>
                </div>
                {reject > 0 ? (
                  <div style={{ position: 'absolute', left: COPYC.w - 46, top: -30, width: 72, height: 72, borderRadius: 36, display: 'grid', placeItems: 'center', background: C.rose, boxShadow: `0 0 26px ${alpha(C.rose, 0.6)}`, opacity: reject, transform: `scale(${1.5 - 0.5 * reject})` }}>
                    <Icon name="x" size={48} color={C.ink950} strokeWidth={3.4} />
                  </div>
                ) : null}
              </div>
              <div style={{ position: 'absolute', left: COPYC.x, top: COPYC.y + COPYC.h + 16, width: COPYC.w, display: 'flex', justifyContent: 'center', opacity: progress(frame, wSirve - 4, 12), transform: `translateY(${(1 - progress(frame, wSirve - 4, 12)) * 10}px)` }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 12, padding: '8px 26px', borderRadius: RADIUS.pill, border: `3px solid ${C.emerald}`, background: alpha(C.emerald, 0.14), fontFamily: FONT.sans, fontSize: 40, fontWeight: 850, color: '#6ee7b7', whiteSpace: 'nowrap' }}>
                  <Icon name="check" size={40} color={C.emerald} strokeWidth={2.8} />
                  {COPY.useless}
                </span>
              </div>
            </>
          ) : null}

          {/* ===== Exam terms, where the console was ===== */}
          <div style={{ position: 'absolute', left: CONSOLE.x + 40, top: 40 }}>
            <TermTag frame={frame} fps={fps} at={revoked} term={TERMS.jit} size={56} />
          </div>
          <div style={{ position: 'absolute', left: CONSOLE.x + 40, top: 214 }}>
            <TermTag frame={frame} fps={fps} at={wEphemeral - 4} term={TERMS.ephemeral} size={56} />
          </div>
        </div>
      ) : null}

      {/* ===== Chapter close: the guardhouse cabinet ===== */}
      {frame >= lockChange - 12 ? (
        <>
          <div style={{ position: 'absolute', left: CAB.x, top: CAB.y }}>
            <KeyCabinet
              at={lockChange - 6}
              width={CAB.w}
              takeAt={takeAt}
              returnAt={returnAt}
              lockChangeAt={wCambian - 2}
              logLines={CABINET.log}
              logAt={[takeAt + 10, returnAt + 12]}
              keyGlow={progress(frame, takeAt, 10)}
              frame={frame}
            />
          </div>
          <div style={{ position: 'absolute', left: 880, top: 190, fontFamily: FONT.sans }}>
            <CaptionLine frame={frame} at={wPrestan - 6} icon={<Icon name="key" size={50} color={C.cyan} strokeWidth={2.2} />}>
              {CABINET.lent}
            </CaptionLine>
            <div style={{ height: 40 }} />
            <CaptionLine frame={frame} at={wDevolverla - 6} icon={<Icon name="lock" size={50} color={C.emerald} strokeWidth={2.2} />} tone="#6ee7b7" glow={progress(frame, wCambian - 2, 12)}>
              {splitAfterComma(CABINET.changed)}
            </CaptionLine>
          </div>
        </>
      ) : null}
    </Stage>
  );
}

// ---------------------------------------------------------------------------

function fmtHour(h: number): string {
  const total = Math.round(h * 60);
  const hh = Math.floor(total / 60) % 24;
  const mm = total % 60;
  return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
}

function splitAfterComma(text: string): ReactNode {
  const i = text.indexOf(',');
  if (i < 0) return text;
  return (
    <>
      <div>{text.slice(0, i + 1)}</div>
      <div>{text.slice(i + 2)}</div>
    </>
  );
}

function ApproveRow({ frame, fps, at }: { frame: number; fps: number; at: number }) {
  if (frame < at - 2) return null;
  const p = springIn(frame, fps, at - 2, { damping: 15 });
  return (
    <div style={{ position: 'absolute', left: 22, top: 262, opacity: Math.min(1, p * 1.3), transform: `scale(${0.92 + 0.08 * Math.min(1, p)})`, transformOrigin: 'left center' }}>
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 14,
          padding: '8px 24px',
          borderRadius: RADIUS.md,
          border: `3px solid ${C.emerald}`,
          background: alpha(C.emerald, 0.14),
          fontFamily: FONT.sans,
          fontSize: 38,
          fontWeight: 850,
          color: '#6ee7b7',
          whiteSpace: 'nowrap',
        }}
      >
        <Icon name="check" size={40} color={C.emerald} strokeWidth={2.8} />
        {REQUEST.approve}
      </span>
    </div>
  );
}

function LoanCard({ frame, fps, at, dim, retiredAt, lockSnap, lockAt }: { frame: number; fps: number; at: number; dim: number; retiredAt: number; lockSnap: number; lockAt: number }) {
  if (frame < at - 2) return null;
  const p = springIn(frame, fps, at, { damping: 16 });
  const rows = [at + 4, at + 16, at + 28].map((a) => progress(frame, a, 12));
  const glow = clamp01(progress(frame, at, 10) * (1 - progress(frame, retiredAt, 14))) * (0.8 + 0.2 * pulse(frame, fps, 0.5));
  return (
    <div style={{ position: 'absolute', left: LOANC.x, top: LOANC.y, width: LOANC.w, height: LOANC.h, opacity: Math.min(1, p * 1.3), transform: `translateY(${(1 - Math.min(1, p)) * -30}px)` }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          boxSizing: 'border-box',
          borderRadius: RADIUS.lg,
          border: `2px solid ${alpha(C.cyan, 0.4 + 0.45 * glow)}`,
          background: `linear-gradient(180deg, ${alpha(C.cyan, 0.08 + 0.06 * glow)} 0%, ${alpha(C.ink900, 0.96)} 100%)`,
          boxShadow: glow > 0.05 ? `0 0 ${Math.round(32 * glow)}px ${alpha(C.cyan, 0.28 * glow)}` : `0 24px 50px ${alpha('#000000', 0.35)}`,
          fontFamily: FONT.sans,
        }}
      >
        <div style={{ position: 'absolute', left: 26, top: 20, opacity: 1 - 0.82 * dim, filter: dim > 0.01 ? `saturate(${1 - 0.7 * dim})` : undefined }}>
          <Row p={rows[0]} icon="key" size={38} strong>
            {LOAN.valid}
          </Row>
          <div style={{ height: 14 }} />
          <Row p={rows[1]} icon="record" size={32} iconColor={C.amber}>
            {LOAN.recorded}
          </Row>
          <div style={{ height: 12 }} />
          <Row p={rows[2]} icon="user" size={32}>
            <div style={{ lineHeight: 1.15 }}>
              <div>{LOAN.separate[0]}</div>
              <div>{LOAN.separate[1]}</div>
            </div>
          </Row>
        </div>
      </div>
      {/* 23:00: privilege withdrawn, password rotated */}
      <div style={{ position: 'absolute', left: 0, top: 54, width: LOANC.w, display: 'flex', justifyContent: 'center' }}>
        <MarkStamp frame={frame} at={retiredAt} tone="emerald" icon="check" size={40} rotate={-4}>
          <div style={{ lineHeight: 1.15 }}>
            <div>{LOAN.retired[0]}</div>
            <div>{LOAN.retired[1]}</div>
          </div>
        </MarkStamp>
      </div>
      {/* The padlock snaps shut on the cue (lock sound) */}
      {frame >= lockAt - 14 ? <SnapLock snap={lockSnap} appear={progress(frame, lockAt - 14, 6)} /> : null}
    </div>
  );
}

function Row({ p, icon, size, strong = false, iconColor, children }: { p: number; icon: 'key' | 'record' | 'user'; size: number; strong?: boolean; iconColor?: string; children: ReactNode }) {
  if (p <= 0.001) return null;
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, opacity: p, transform: `translateX(${(1 - p) * 14}px)`, whiteSpace: 'nowrap' }}>
      <Icon name={icon} size={Math.round(size * 1.1)} color={iconColor ?? C.cyan} strokeWidth={2.2} style={{ marginTop: 2 }} />
      <span style={{ fontSize: size, fontWeight: strong ? 850 : 700, color: strong ? C.textStrong : C.text }}>{children}</span>
    </div>
  );
}

/** Padlock that drops onto the loan card's corner and closes exactly on the cue. */
function SnapLock({ snap, appear }: { snap: number; appear: number }) {
  const shackleY = -16 * (1 - snap);
  return (
    <svg width={110} height={120} viewBox="-55 -60 110 120" style={{ position: 'absolute', left: LOANC.w - 56, top: -92, overflow: 'visible', opacity: appear }}>
      <path d={`M -22 ${-6 + shackleY} L -22 ${-26 + shackleY} A 22 22 0 0 1 22 ${-26 + shackleY} L 22 ${-6 + shackleY}`} fill="none" stroke={C.cyan} strokeWidth={9} strokeLinecap="round" />
      <rect x={-34} y={-8} width={68} height={56} rx={10} fill={C.ink800} stroke={C.cyan} strokeWidth={5} />
      <circle cx={0} cy={14} r={7} fill={C.cyan} />
      <path d="M 0 18 L 0 32" stroke={C.cyan} strokeWidth={6} strokeLinecap="round" />
      {snap >= 1 ? <circle cx={0} cy={18} r={52} fill="none" stroke={alpha(C.cyan, 0.4)} strokeWidth={3} /> : null}
    </svg>
  );
}

function CaptionLine({ frame, at, icon, tone, glow = 0, children }: { frame: number; at: number; icon: ReactNode; tone?: string; glow?: number; children: ReactNode }) {
  const p = progress(frame, at, 14);
  if (p <= 0.001) return null;
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20, opacity: p, transform: `translateX(${(1 - p) * 20}px)` }}>
      <div style={{ marginTop: 4 }}>{icon}</div>
      <div style={{ fontSize: 52, fontWeight: 850, lineHeight: 1.15, letterSpacing: -0.6, color: tone ?? C.textStrong, whiteSpace: 'nowrap', textShadow: glow > 0.05 ? `0 0 22px ${alpha(C.emerald, 0.5 * glow)}` : undefined }}>{children}</div>
    </div>
  );
}

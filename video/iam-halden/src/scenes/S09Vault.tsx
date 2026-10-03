import type { ReactNode } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { EASE, progress, pulse, springIn } from '../../../engine/src/theme/motion';
import { Chip, Icon, dimStyle, mix } from '../../../engine/src/ui';
import { BARS, CABINET, DONE, FOCUS_ROW, IMPROVEMENTS, LEAST, LIST_HEAD, LIST_TITLE, PAM, VAULT } from '../data/s09-vault';
import { KeyCabinet } from './parts/Cabinet';
import { LogonCard } from './parts/LogonCard';
import { MarkStamp, TermTag } from './parts/Marks';
import { VaultConsole, VaultLog, VaultTable, type VaultRow } from './parts/VaultConsole';
import { Stage, segment, wordFrame } from './kit';

const S = 's09-vault';
const W = 1728;

// Phase 1: V5's list.
const LIST = { top: 40, rowsTop: 128, pitch: 82, rowH: 66, textX: 66, textW: 1000, ownerX: 1086, dateX: 1300, stampX: 1418 };
// Phase 2: the cabinet (big, then small on the left) and the console (right).
const CAB_BIG = { x: 60, y: 46, w: 800 };
const CAB_MID = { x: 0, y: 92, w: 600 };
const CAB_SMALL = { x: 70, y: 386, w: 380 };
const CONSOLE = { x: 640, y: 0, w: W - 640, h: 640 };

/**
 * s09-vault «El armario de llaves». V5's list of improvements comes back: only
 * «cuentas de servicio en gestor de contraseñas con rotación · Sistemas ·
 * 31-10» lights, ticked and stamped «27-10 · hecho» on the cue (check sound);
 * the other five stay dimmed, with no status. The image: the guardhouse key
 * cabinet with its logbook (nobody keeps a key; every use is written down).
 * The vault console: the service accounts join the domain admins (already
 * there); «¿quién la sabe?» — nadie; rotation every 24 h and every time a
 * person returns one, with its access log. PAM / PASSWORD VAULTING. A limit,
 * not a miracle: September's stolen password lasted until someone noticed
 * (4-9 · 10:30); now 24 h at most. The 01:52 card returns and loses its
 * special privileges: LEAST PRIVILEGE.
 */
export function S09Vault(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const improvement = props.cue('improvement');
  const cabinet = props.cue('cabinet');
  const vault = props.cue('vault');
  const nobody = props.cue('nobody');
  const rotate = props.cue('rotate');
  const pam = props.cue('pam');
  const beforeAfter = props.cue('before-after');
  const least = props.cue('least');
  const s06 = segment(props, 's09-06');

  const done = props.cue('done');
  const wNadie = wordFrame(S, 's09-02', 'Nadie');
  const wApunta = wordFrame(S, 's09-02', 'apunta');
  const wAdmin = wordFrame(S, 's09-03', 'administrador');
  const wDevuelve = wordFrame(S, 's09-04', 'devuelve');
  const wPassword = wordFrame(S, 's09-05', 'password');
  const wSeptiembre = wordFrame(S, 's09-06', 'septiembre');
  const wCuenta = wordFrame(S, 's09-06', 'cuenta');
  const wAhora = wordFrame(S, 's09-06', 'Ahora');
  const wMucho = wordFrame(S, 's09-06', 'mucho');
  const wPierde = wordFrame(S, 's09-07', 'pierde');
  const wLeast = wordFrame(S, 's09-07', 'Least');

  // ---- Phase 1: the list -----------------------------------------------------
  const listOut = progress(frame, cabinet - 10, 16, EASE.inOut);

  // ---- Phase 2: cabinet + console --------------------------------------------
  const cabIn = progress(frame, cabinet - 4, 16);
  const toMid = progress(frame, vault - 8, 20, EASE.inOut);
  const toSmall = progress(frame, pam - 8, 20, EASE.inOut);
  const cab = {
    x: mix(mix(CAB_BIG.x, CAB_MID.x, toMid), CAB_SMALL.x, toSmall),
    y: mix(mix(CAB_BIG.y, CAB_MID.y, toMid), CAB_SMALL.y, toSmall),
    w: mix(mix(CAB_BIG.w, CAB_MID.w, toMid), CAB_SMALL.w, toSmall),
  };
  const captionOut = progress(frame, vault - 10, 14, EASE.inOut);
  const phase2Out = progress(frame, beforeAfter - 8, 16, EASE.inOut);

  // ---- Phase 3 / 4 ---------------------------------------------------------------
  const barsOut = progress(frame, least - 8, 14, EASE.inOut);

  const rows: VaultRow[] = [
    {
      id: 'admins',
      cells: {
        account: (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 16 }}>
            <Icon name="shield" size={34} color={C.amber} />
            <span style={{ fontSize: 32, fontWeight: 750, color: C.text }}>{VAULT.admins}</span>
            <span style={{ opacity: progress(frame, wAdmin - 6, 12) }}>
              <Chip accent="muted" icon="check" size={26} style={progress(frame, wAdmin - 6, 12) > 0 ? { boxShadow: `0 0 ${18 * windowGlow(frame, wAdmin - 6, nobody)}px ${alpha(C.cyan, 0.5)}` } : undefined}>
                {VAULT.already}
              </Chip>
            </span>
          </span>
        ),
        who: <Nadie />,
      },
      cellAt: { who: nobody + 4 },
      dim: 0.35 * (1 - progress(frame, wAdmin - 6, 12)),
    },
    ...VAULT.accounts.map(
      (a, i): VaultRow => ({
        id: a,
        at: vault + 8 + i * 10,
        tone: 'cyan',
        focus: windowGlow(frame, vault + 8 + i * 10, wAdmin - 6) * 0.8,
        cells: {
          account: (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 16 }}>
              <Icon name="gear" size={34} color={C.cyan} />
              <span style={{ fontFamily: FONT.mono, fontSize: 34, fontWeight: 800, color: C.textStrong }}>{a}</span>
            </span>
          ),
          who: <Nadie />,
        },
        cellAt: { who: nobody + 10 + (i + 1) * 6 },
      }),
    ),
    {
      id: 'rest',
      at: vault + 28,
      cells: {
        account: (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 16 }}>
            <Icon name="layers" size={34} color={C.cyan} />
            <span style={{ fontSize: 32, fontWeight: 700, color: C.text }}>{VAULT.rest}</span>
          </span>
        ),
        who: <Nadie />,
      },
      cellAt: { who: nobody + 28 },
    },
  ];

  return (
    <Stage>
      {/* ===== Phase 1: V5's improvements ===== */}
      {listOut < 1 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: 1 - listOut, transform: `translateY(${-listOut * 24}px)` }}>
          <ImprovementList frame={frame} fps={fps} litAt={improvement} hechoAt={done} />
        </div>
      ) : null}

      {/* ===== Phase 2: the cabinet and the vault ===== */}
      {cabIn > 0 && phase2Out < 1 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: 1 - phase2Out }}>
          <div style={{ position: 'absolute', left: cab.x, top: cab.y + (1 - cabIn) * 20, opacity: cabIn }}>
            <KeyCabinet
              width={cab.w}
              glow={windowGlow(frame, wNadie - 6, vault)}
              logLines={CABINET.log}
              logAt={[wApunta - 2, wApunta + 14, wApunta + 30]}
              frame={frame}
            />
          </div>
          {captionOut < 1 ? (
            <div style={{ position: 'absolute', left: CAB_BIG.x + CAB_BIG.w + 50, top: 170, opacity: 1 - captionOut, fontFamily: FONT.sans }}>
              <Caption frame={frame} at={wNadie - 6} icon="key">
                {CABINET.nobody}
              </Caption>
              <div style={{ height: 34 }} />
              <Caption frame={frame} at={wApunta - 6} icon="file">
                {CABINET.logged}
              </Caption>
            </div>
          ) : null}

          {/* The vault console */}
          {frame >= vault - 8 ? (
            <div style={{ position: 'absolute', left: CONSOLE.x, top: CONSOLE.y }}>
              <VaultConsole width={CONSOLE.w} height={CONSOLE.h} at={vault - 6} glow={windowGlow(frame, pam - 4, beforeAfter) * 0.8}>
                <VaultTable
                  frame={frame}
                  rowH={62}
                  gap={8}
                  style={{ position: 'absolute', left: 6, top: 10 }}
                  columns={[
                    { id: 'account', label: VAULT.colAccount, width: 700 },
                    { id: 'who', label: VAULT.colWho, width: 300, at: nobody - 4, align: 'center', focus: windowGlow(frame, nobody - 4, rotate - 4) },
                  ]}
                  rows={rows}
                />
                {/* rotation + access log */}
                <div style={{ position: 'absolute', left: 28, top: 350, right: 28 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, opacity: progress(frame, rotate - 4, 14), transform: `translateX(${(1 - progress(frame, rotate - 4, 14)) * 16}px)`, whiteSpace: 'nowrap' }}>
                    <Icon name="clock" size={36} color={C.emerald} strokeWidth={2.2} />
                    <span style={{ fontSize: 32, fontWeight: 800, color: C.textStrong }}>{VAULT.rotation}</span>
                  </div>
                  <div style={{ marginTop: 14, padding: '10px 18px', borderRadius: RADIUS.sm, background: alpha(C.ink950, 0.8), border: `1px solid ${C.ink700}`, opacity: progress(frame, rotate + 6, 12) }}>
                    <VaultLog
                      frame={frame}
                      size={24}
                      pitch={32}
                      lines={[
                        { text: VAULT.log[0], at: rotate + 10 },
                        { text: VAULT.log[1], at: rotate + 24 },
                        { text: VAULT.log[2], at: wDevuelve - 4, tone: 'emerald' },
                      ]}
                    />
                  </div>
                </div>
              </VaultConsole>
            </div>
          ) : null}

          {/* PAM / PASSWORD VAULTING, where the cabinet was */}
          <div style={{ position: 'absolute', left: 0, top: 20 }}>
            <TermTag frame={frame} fps={fps} at={pam} term={PAM.term} sub={PAM.sub} subAt={pam + 8} size={64} subSize={32} />
          </div>
          <div style={{ position: 'absolute', left: 0, top: 220 }}>
            <TermTag frame={frame} fps={fps} at={wPassword - 4} term={PAM.vaulting} size={44} />
          </div>
        </div>
      ) : null}

      {/* ===== Phase 3: a limit, not a miracle ===== */}
      {frame >= beforeAfter - 6 && barsOut < 1 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: (1 - barsOut) * progress(frame, beforeAfter - 6, 14) }}>
          <Bars frame={frame} fps={fps} startAt={beforeAfter} beforeAt={wSeptiembre - 6} whenAt={wCuenta - 4} afterAt={wAhora - 6} capAt={wMucho - 4} endAt={s06.to} />
        </div>
      ) : null}

      {/* ===== Phase 4: least privilege ===== */}
      {frame >= least - 6 ? (
        <>
          <div style={{ position: 'absolute', left: 120, top: 46 }}>
            <LogonCard at={least - 4} privAt={least + 12} privRetiredAt={wPierde - 2} width={780} frame={frame} />
          </div>
          <div style={{ position: 'absolute', left: 1010, top: 236 }}>
            <TermTag frame={frame} fps={fps} at={wLeast - 4} term={LEAST} size={62} />
          </div>
        </>
      ) : null}
    </Stage>
  );
}

// ---------------------------------------------------------------------------

/** 0–1 weight of a [from, to) window with eased ramps. */
function windowGlow(frame: number, from: number, to: number): number {
  return progress(frame, from, 10) * (1 - progress(frame, to, 12));
}

function Nadie() {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontSize: 34, fontWeight: 850, color: '#6ee7b7' }}>
      <Icon name="eyeOff" size={34} color={C.emerald} strokeWidth={2.2} />
      {VAULT.nobody}
    </span>
  );
}

function Caption({ frame, at, icon, children }: { frame: number; at: number; icon: 'key' | 'file'; children: ReactNode }) {
  const p = progress(frame, at, 14);
  if (p <= 0.001) return null;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 18, opacity: p, transform: `translateX(${(1 - p) * 20}px)`, whiteSpace: 'nowrap' }}>
      <Icon name={icon} size={48} color={C.cyan} strokeWidth={2.2} />
      <span style={{ fontSize: 48, fontWeight: 850, color: C.textStrong, letterSpacing: -0.5 }}>{children}</span>
    </div>
  );
}

function ImprovementList({ frame, fps, litAt, hechoAt }: { frame: number; fps: number; litAt: number; hechoAt: number }) {
  // The list is on screen from the first frame; the focus row lights on the cue, and the tick and the stamp land
  // when the voice says «Hecho» (cue done, check sound).
  const lit = progress(frame, litAt, 8);
  const tick = progress(frame, hechoAt, 8);
  const hecho = progress(frame, hechoAt - 4, 10) * (1 - progress(frame, hechoAt + 20, 24));
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: W, fontFamily: FONT.sans }}>
      <div style={{ position: 'absolute', left: 6, top: LIST.top, height: 56, display: 'flex', alignItems: 'center', gap: 16, whiteSpace: 'nowrap' }}>
        <Icon name="file" size={44} color={C.cyan} />
        <span style={{ fontSize: 44, fontWeight: 850, color: C.textStrong, letterSpacing: -0.4 }}>{LIST_TITLE}</span>
      </div>
      <div style={{ position: 'absolute', left: LIST.ownerX, top: LIST.top + 14, fontSize: 28, fontWeight: 800, color: C.muted, whiteSpace: 'nowrap' }}>{LIST_HEAD.owner}</div>
      <div style={{ position: 'absolute', left: LIST.dateX, top: LIST.top + 14, fontSize: 28, fontWeight: 800, color: C.muted, whiteSpace: 'nowrap' }}>{LIST_HEAD.date}</div>
      {IMPROVEMENTS.map((imp, i) => {
        const focus = i === FOCUS_ROW;
        const top = LIST.rowsTop + i * LIST.pitch;
        const size = Math.min(32, Math.floor(LIST.textW / (imp.text.length * 0.54)));
        const d = focus ? 0 : lit;
        const f = focus ? lit : 0;
        return (
          <div
            key={imp.text}
            style={{
              position: 'absolute',
              left: 0,
              top,
              width: LIST.dateX + 110,
              height: LIST.rowH,
              boxSizing: 'border-box',
              borderRadius: RADIUS.sm,
              border: `2px solid ${alpha(focus ? C.emerald : C.cyan, 0.18 + 0.6 * f)}`,
              background: f > 0.02 ? `linear-gradient(90deg, ${alpha(C.emerald, 0.16 * f)} 0%, ${alpha(C.ink850, 0.95)} 70%)` : alpha(C.ink850, 0.9),
              boxShadow: f > 0.02 ? `0 0 ${Math.round(30 * f)}px ${alpha(C.emerald, 0.28 * f)}` : undefined,
              ...dimStyle(d * 0.85),
            }}
          >
            {/* Bullet, or the tick box on the lit row */}
            <div style={{ position: 'absolute', left: 14, top: 0, height: LIST.rowH, display: 'flex', alignItems: 'center' }}>
              {focus ? <TickBox p={tick} /> : <span style={{ width: 10, height: 10, borderRadius: 5, marginLeft: 10, background: alpha(C.muted, 0.7) }} />}
            </div>
            <div style={{ position: 'absolute', left: LIST.textX, top: 0, height: LIST.rowH, display: 'flex', alignItems: 'center', fontSize: size, fontWeight: 700, color: C.textStrong, whiteSpace: 'nowrap' }}>{imp.text}</div>
            <div style={{ position: 'absolute', left: LIST.ownerX, top: 0, height: LIST.rowH, display: 'flex', alignItems: 'center' }}>
              <Chip accent="cyan" icon="user" size={26}>
                {imp.owner}
              </Chip>
            </div>
            <div style={{ position: 'absolute', left: LIST.dateX, top: 0, height: LIST.rowH, display: 'flex', alignItems: 'center', fontFamily: FONT.mono, fontSize: 32, fontWeight: 800, color: C.text }}>{imp.date}</div>
          </div>
        );
      })}
      {/* «27-10 · hecho»: lands with the tick when the voice says «Hecho» (cue done, check sound) */}
      <div style={{ position: 'absolute', left: LIST.stampX, top: LIST.rowsTop + FOCUS_ROW * LIST.pitch - 2 }}>
        <MarkStamp frame={frame} at={hechoAt} tone="emerald" icon="check" size={36} rotate={-5} glowOut={20} style={hecho > 0 ? { boxShadow: `0 0 ${20 + 34 * hecho * (0.7 + 0.3 * pulse(frame, fps, 0.8))}px ${alpha(C.emerald, 0.3 + 0.4 * hecho)}` } : undefined}>
          {DONE}
        </MarkStamp>
      </div>
    </div>
  );
}

function TickBox({ p }: { p: number }) {
  const S2 = 36;
  return (
    <svg width={S2} height={S2} viewBox={`0 0 ${S2} ${S2}`}>
      <rect x={2} y={2} width={S2 - 4} height={S2 - 4} rx={8} fill={alpha(C.emerald, 0.85 * p)} stroke={p > 0.05 ? C.emerald : C.muted} strokeWidth={3} />
      <path d={`M ${S2 * 0.24} ${S2 * 0.52} L ${S2 * 0.44} ${S2 * 0.72} L ${S2 * 0.78} ${S2 * 0.3}`} fill="none" stroke={C.ink950} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p} />
    </svg>
  );
}

/** «septiembre: hasta que alguien se diera cuenta» (open start, ends at 4-9 · 10:30) vs «ahora: 24 h como mucho» (hard cap). */
function Bars({ frame, fps, startAt, beforeAt, whenAt, afterAt, capAt, endAt }: { frame: number; fps: number; startAt: number; beforeAt: number; whenAt: number; afterAt: number; capAt: number; endAt: number }) {
  const X0 = 90;
  const X1 = 1560;
  const CAP_X = 560;
  const A = { labelY: 96, barY: 178, h: 58 };
  const B = { labelY: 372, barY: 454, h: 58 };
  const aGrow = progress(frame, beforeAt + 4, Math.max(20, whenAt - beforeAt - 4), EASE.inOut);
  const aEnd = mix(X0 + 120, X1, aGrow);
  const when = progress(frame, whenAt, 12);
  const bGrow = progress(frame, afterAt + 4, Math.max(14, capAt - afterAt - 4), EASE.inOut);
  const bEnd = mix(X0 + 40, CAP_X, bGrow);
  // At the cue («pone un límite») both rows are already there, waiting dimmed, and the 24-h wall stands;
  // each row lights and fills as the voice reaches it.
  const rowsIn = progress(frame, startAt, 14);
  const cap = springIn(frame, fps, startAt + 6, { damping: 14 });
  const capTag = progress(frame, capAt, 12);
  const aLabel = rowsIn * (0.42 + 0.58 * progress(frame, beforeAt, 12));
  const bLabel = rowsIn * (0.42 + 0.58 * progress(frame, afterAt, 12));
  const settle = progress(frame, endAt - 30, 20);
  return (
    <div style={{ position: 'absolute', inset: 0, fontFamily: FONT.sans }}>
      {/* September */}
      <div style={{ position: 'absolute', left: X0, top: A.labelY, display: 'flex', alignItems: 'center', gap: 16, opacity: aLabel, whiteSpace: 'nowrap' }}>
        <Icon name="key" size={44} color={C.amber} strokeWidth={2.2} />
        <span style={{ fontSize: 46, fontWeight: 850, color: C.textStrong, letterSpacing: -0.4 }}>{BARS.before}</span>
      </div>
      <svg width={W} height={660} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        <defs>
          <linearGradient id="s09-bar-a" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={alpha(C.amber, 0)} />
            <stop offset="18%" stopColor={alpha(C.amber, 0.75)} />
            <stop offset="100%" stopColor={C.amber} />
          </linearGradient>
        </defs>
        {/* tracks */}
        <rect x={X0} y={A.barY} width={X1 - X0} height={A.h} rx={A.h / 2} fill={alpha(C.ink700, 0.6 * rowsIn)} />
        <rect x={X0} y={B.barY} width={X1 - X0} height={B.h} rx={B.h / 2} fill={alpha(C.ink700, 0.6 * rowsIn)} />
        {aGrow > 0 ? <rect x={X0} y={A.barY} width={aEnd - X0} height={A.h} rx={A.h / 2} fill="url(#s09-bar-a)" /> : null}
        {when > 0 ? (
          <g opacity={when}>
            <line x1={X1} y1={A.barY - 16} x2={X1} y2={A.barY + A.h + 16} stroke={C.textStrong} strokeWidth={5} strokeLinecap="round" />
          </g>
        ) : null}
        {/* Now: 24 h at most, hard cap */}
        {bGrow > 0 ? <rect x={X0} y={B.barY} width={bEnd - X0} height={B.h} rx={B.h / 2} fill={C.emerald} /> : null}
        {cap > 0.01 ? (
          <g opacity={Math.min(1, cap * 1.3)}>
            <rect x={CAP_X - 6} y={B.barY - 30} width={14} height={B.h + 60} rx={5} fill={C.emerald} />
            <rect x={CAP_X + 8} y={B.barY} width={X1 - CAP_X - 8} height={B.h} rx={B.h / 2} fill="none" stroke={alpha(C.emerald, 0.25 * (1 - settle * 0.5))} strokeWidth={2} strokeDasharray="10 10" />
          </g>
        ) : null}
      </svg>
      {when > 0 ? (
        <div style={{ position: 'absolute', left: X1 - 140, top: A.barY + A.h + 22, width: 280, textAlign: 'center', fontFamily: FONT.mono, fontSize: 30, fontWeight: 800, color: C.text, opacity: when }}>{BARS.beforeWhen}</div>
      ) : null}
      <div style={{ position: 'absolute', left: X0, top: B.labelY, display: 'flex', alignItems: 'center', gap: 16, opacity: bLabel, whiteSpace: 'nowrap' }}>
        <Icon name="clock" size={44} color={C.emerald} strokeWidth={2.2} />
        <span style={{ fontSize: 46, fontWeight: 850, color: C.textStrong, letterSpacing: -0.4 }}>{BARS.after}</span>
      </div>
      {capTag > 0.01 ? (
        <div style={{ position: 'absolute', left: CAP_X + 30, top: B.barY + 2, height: B.h, display: 'flex', alignItems: 'center', opacity: capTag }}>
          <span style={{ padding: '4px 18px', borderRadius: RADIUS.pill, background: C.emerald, color: C.ink950, fontSize: 34, fontWeight: 850, whiteSpace: 'nowrap' }}>{BARS.cap}</span>
        </div>
      ) : null}
    </div>
  );
}


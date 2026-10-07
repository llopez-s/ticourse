import type { ReactNode } from 'react';
import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../engine/src/theme/motion';
import { Icon, clamp01, mix, windowWeight } from '../../../engine/src/ui';
import { S08 } from '../data/s08-puertas';
import { Checkpoint } from './parts/Checkpoint';
import { StateChip, TermCard } from './parts/s06-barrera/marks';
import { Door } from './parts/s08-puertas/Door';
import { Stage, wordFrame } from './kit';

const S = 's08-puertas';
const W = 1728;

// ---- The corridor of the office building
const WALL = { top: 92, bottom: 520 } as const;
const LAMPS = [300, 864, 1428] as const;
const DOOR = { w: 260, h: 300, top: 220 } as const;
const LX = 490; // emergency exit (centre)
const RX = 1238; // server room (centre)
const SIGN = { w: 300, h: 84, top: 120 } as const;
const TAG_Y = 548;
/** The lowered-barrier icon next to the server-room door («igual que la barrera bajada»). */
const BARRIER_TILE = { x: 1440, y: 268, w: 176 } as const;

// ---- Wrap: the four answers, two groups
const GROUP = [480, 1248] as const;
const TILE_W = 330;

/**
 * s08-puertas «La salida de emergencia».
 *   0 / power-cut  a corridor of the office building («edificio de oficinas»): lamps on, two doors
 *                  — the emergency exit (green sign) and the server room (badge reader, racks'
 *                  lights through a narrow window). On «luz» the lamps go out and the corridor
 *                  darks; the exit sign stays lit.
 *   exit           the exit swings open on «abre» («se abre»), daylight; people go out on «gente»;
 *                  FAIL-SAFE + «primero, la gente» on «fail-safe».
 *   server-room    the server door stays shut: a padlock on «bloqueada» («se queda bloqueada»), the
 *                  reader's light red; FAIL-SECURE + «primero, lo que guarda» on «fail-secure»; on
 *                  «barrera» a small lowered barrier (s06's) joins it.
 *   life           «en las personas manda la vida;» (left door glows) · «en los datos, la
 *                  protección» (on «datos», right door glows).
 *   wrap           chapter close: the corridor gives way to the four answers, «cada control»
 *                  (FAIL-OPEN, FAIL-CLOSED: the barrier up and down) and «cada puerta» (FAIL-SAFE,
 *                  FAIL-SECURE: the door open and locked). Holds with the lesson's line on top.
 */
export function S08Puertas(props: SceneProps) {
  const frame = useCurrentFrame();
  const w = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);

  const cutCue = props.cue('power-cut');
  const exitAt = props.cue('exit');
  const serverAt = props.cue('server-room');
  const lifeAt = props.cue('life');
  const wrapAt = props.cue('wrap');

  const at = {
    puertas: w('s08-01', 'puertas'),
    luz: w('s08-01', 'luz'),
    oficinas: w('s08-01', 'oficinas'),
    abre: w('s08-02', 'abre'),
    gente: w('s08-02', 'gente'),
    failSafe: w('s08-02', 'fail-safe'),
    bloqueada: w('s08-03', 'bloqueada'),
    failSecure: w('s08-03', 'fail-secure'),
    barrera: w('s08-03', 'barrera'),
    personas: w('s08-04', 'personas'),
    datos: w('s08-04', 'datos'),
    control: w('s08-05', 'control'),
    puerta: w('s08-05', 'puerta'),
  };

  // ---------------- The corridor
  const sceneIn = progress(frame, 0, 14);
  const cut = progress(frame, at.luz - 2, 10);
  const power = 1 - cut;
  const plaque = progress(frame, Math.min(cutCue + 6, at.oficinas - 8), 14) * (1 - progress(frame, lifeAt - 8, 14, EASE.inOut));
  const doorsHint = windowWeight(frame, at.puertas - 4, at.luz - 6, { ramp: 10 });
  const corridorOut = progress(frame, wrapAt - 4, 20, EASE.inOut);

  // Exit
  const open = progress(frame, at.abre - 4, 22, EASE.inOut);
  const opensChip = progress(frame, at.abre + 4, 14);
  const people = (i: number) => progress(frame, at.gente - 16 + i * 14, 44, EASE.inOut);
  // Each term card arrives with its name (the voice names it last).
  const safeTag = progress(frame, Math.max(exitAt + 10, at.failSafe - 6), 14);
  const safeTerm = safeTag;
  // Server room
  const lock = progress(frame, at.bloqueada - 4, 12, EASE.out);
  const lockedChip = progress(frame, at.bloqueada + 6, 14);
  const secureTag = progress(frame, Math.max(serverAt + 10, at.failSecure - 6), 14);
  const secureTerm = secureTag;
  const barrierTile = progress(frame, at.barrera - 6, 14);
  // Focus while each door is explained, then the two halves of the lesson's line
  const focusL = Math.max(windowWeight(frame, exitAt, serverAt, { ramp: 12 }), windowWeight(frame, at.personas - 4, at.datos - 4, { ramp: 10 }));
  const focusR = Math.max(windowWeight(frame, serverAt, lifeAt, { ramp: 12 }), windowWeight(frame, at.datos - 4, wrapAt, { ramp: 10 }));
  const dimL = 0.5 * windowWeight(frame, serverAt, lifeAt, { ramp: 12 });
  const life1 = progress(frame, lifeAt - 4, 14);
  const life2 = progress(frame, at.datos - 6, 14);

  // ---------------- Wrap
  const wrapIn = progress(frame, wrapAt + 8, 18);
  const g1 = progress(frame, Math.max(wrapAt + 8, at.control - 8), 16);
  const g2 = progress(frame, Math.max(wrapAt + 20, at.puerta - 8), 16);

  return (
    <Stage style={{ fontFamily: FONT.sans, opacity: sceneIn }}>
      {/* ================= The corridor ================= */}
      {corridorOut < 1 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: 1 - corridorOut, transform: `scale(${1 - 0.04 * corridorOut})`, transformOrigin: '50% 60%' }}>
          {/* Wall, floor */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: WALL.top,
              width: W,
              height: WALL.bottom - WALL.top,
              borderRadius: `${RADIUS.md}px ${RADIUS.md}px 0 0`,
              background: `linear-gradient(180deg, ${C.ink800} 0%, ${C.ink850} 100%)`,
              border: `2px solid ${alpha(C.ink600, 0.8)}`,
              borderBottom: 'none',
            }}
          />
          <div style={{ position: 'absolute', left: 0, top: WALL.bottom, width: W, height: 36, background: `linear-gradient(180deg, ${C.ink700} 0%, ${alpha(C.ink900, 0)} 100%)` }} />
          <div style={{ position: 'absolute', left: 0, top: WALL.bottom - 3, width: W, height: 6, background: alpha(C.muted, 0.35) }} />

          {/* Lamps and their light */}
          <svg width={W} height={WALL.bottom} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
            <defs>
              <linearGradient id="s08-cone" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#fde68a" stopOpacity={0.22} />
                <stop offset="1" stopColor="#fde68a" stopOpacity={0} />
              </linearGradient>
            </defs>
            {LAMPS.map((x) => (
              <g key={x}>
                <path d={`M ${x - 56} ${WALL.top + 16} L ${x + 56} ${WALL.top + 16} L ${x + 210} ${WALL.bottom} L ${x - 210} ${WALL.bottom} Z`} fill="url(#s08-cone)" opacity={power} />
                <rect x={x - 62} y={WALL.top + 4} width={124} height={12} rx={6} fill={power > 0.5 ? '#fef3c7' : '#334155'} stroke="#64748b" strokeWidth={2} />
              </g>
            ))}
          </svg>
          {/* The corridor goes dark */}
          <div style={{ position: 'absolute', left: 0, top: WALL.top, width: W, height: WALL.bottom - WALL.top + 36, background: alpha('#000000', 0.42 * cut) }} />
          {cut > 0.01 ? (
            <div
              style={{
                position: 'absolute',
                left: LAMPS[1] - 30,
                top: WALL.top + 30,
                width: 60,
                height: 60,
                borderRadius: 30,
                display: 'grid',
                placeItems: 'center',
                background: C.ink900,
                border: `3px solid ${C.amber}`,
                opacity: cut,
                transform: `scale(${1.3 - 0.3 * cut})`,
              }}
            >
              <svg width={36} height={36} viewBox="-18 -18 36 36">
                <path d="M 3 -11 L -6 2 L 0 2 L -3 11 L 7 -3 L 1 -3 Z" fill={C.amber} />
                <line x1={-12} y1={-12} x2={12} y2={12} stroke={C.amber} strokeWidth={3} strokeLinecap="round" />
              </svg>
            </div>
          ) : null}

          {/* Plaque */}
          {plaque > 0.001 ? (
            <div style={{ position: 'absolute', left: 8, top: 22, display: 'flex', alignItems: 'center', gap: 12, opacity: plaque, whiteSpace: 'nowrap' }}>
              <svg width={34} height={34} viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth={2} strokeLinejoin="round">
                <rect x={5} y={3} width={14} height={18} rx={1} />
                <path d="M 9 7 h 2 M 13 7 h 2 M 9 11 h 2 M 13 11 h 2 M 9 15 h 2 M 13 15 h 2 M 11 21 v -3 h 2 v 3" />
              </svg>
              <span style={{ fontSize: 36, fontWeight: 780, color: C.text }}>{S08.building}</span>
            </div>
          ) : null}

          {/* ---- The emergency exit ---- */}
          <div style={{ position: 'absolute', left: LX - SIGN.w / 2, top: SIGN.top, width: SIGN.w, height: SIGN.h, boxSizing: 'border-box', borderRadius: 10, background: '#047857', border: '3px solid #34d399', boxShadow: `0 0 ${Math.round(20 + 16 * cut)}px ${alpha(C.emerald, 0.45)}`, display: 'flex', alignItems: 'center', gap: 12, padding: '0 16px', ...dimOpacity(dimL) }}>
            <svg width={44} height={52} viewBox="0 0 22 26" fill="none" stroke="#ecfdf5" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
              {/* A person walking out of a door */}
              <rect x={12} y={2} width={8} height={22} rx={1} />
              <circle cx={6} cy={5} r={2.4} fill="#ecfdf5" />
              <path d="M 6 8 L 5 15 L 2 21 M 5 15 L 8 18 L 8 23 M 6 10 L 10 12 M 6 10 L 2 12" />
            </svg>
            <div style={{ fontSize: 32, fontWeight: 850, lineHeight: 1.05, color: '#ecfdf5', whiteSpace: 'nowrap' }}>
              <div>{S08.exitSign[0]}</div>
              <div>{S08.exitSign[1]}</div>
            </div>
          </div>
          <div style={{ position: 'absolute', left: LX - DOOR.w / 2, top: DOOR.top, ...dimOpacity(dimL) }}>
            <Door w={DOOR.w} h={DOOR.h} kind="exit" open={open} power={power} glow={Math.max(doorsHint, focusL)} glowTone={C.emerald} />
          </div>
          {/* People going out */}
          {[0, 1, 2].map((i) => {
            const k = people(i);
            if (k <= 0.001 || k >= 1) return null;
            const x = mix(LX - 330 + i * 70, LX, k);
            const y = mix(DOOR.top + DOOR.h - 120, DOOR.top + DOOR.h * 0.5, k);
            const s = mix(1, 0.45, EASE.in(k));
            return (
              <div key={i} style={{ position: 'absolute', left: x - 34, top: y - 34, opacity: Math.min(1, k * 5, (1 - k) * 4), transform: `scale(${s})` }}>
                <Icon name="user" size={68} color="#6ee7b7" strokeWidth={2.4} />
              </div>
            );
          })}
          <div style={{ position: 'absolute', left: LX - 200, width: 400, top: DOOR.top + DOOR.h - 80, display: 'flex', justifyContent: 'center' }}>
            <StateChip text={S08.opens} tone={C.emerald} p={opensChip} />
          </div>

          {/* ---- The server room ---- */}
          <div style={{ position: 'absolute', left: RX - SIGN.w / 2, top: SIGN.top, width: SIGN.w, height: SIGN.h, boxSizing: 'border-box', borderRadius: 10, background: '#1e293b', border: `3px solid ${C.ink500}`, display: 'flex', alignItems: 'center', gap: 12, padding: '0 16px', opacity: 1 - 0.3 * cut }}>
            <Icon name="server" size={46} color={C.cyanSoft} strokeWidth={2} />
            <div style={{ fontSize: 32, fontWeight: 850, lineHeight: 1.05, color: C.textStrong, whiteSpace: 'nowrap' }}>
              <div>{S08.serverSign[0]}</div>
              <div>{S08.serverSign[1]}</div>
            </div>
          </div>
          <div style={{ position: 'absolute', left: RX - DOOR.w / 2, top: DOOR.top }}>
            <Door w={DOOR.w} h={DOOR.h} kind="server" lock={lock} power={power} glow={Math.max(doorsHint, focusR)} glowTone={C.amber} />
          </div>
          <div style={{ position: 'absolute', left: RX - 220, width: 440, top: DOOR.top + DOOR.h - 80, display: 'flex', justifyContent: 'center' }}>
            <StateChip text={S08.locked} tone={C.amber} p={lockedChip} />
          </div>

          {/* «igual que la barrera bajada»: s06's lowered barrier, small */}
          {barrierTile > 0.001 ? (
            <div
              style={{
                position: 'absolute',
                left: BARRIER_TILE.x,
                top: BARRIER_TILE.y,
                width: BARRIER_TILE.w,
                boxSizing: 'border-box',
                padding: '12px 8px 8px',
                borderRadius: RADIUS.md,
                border: `3px solid ${alpha(C.violet, 0.75)}`,
                background: alpha(C.ink900, 0.94),
                boxShadow: `0 0 24px ${alpha(C.violet, 0.3)}`,
                display: 'flex',
                justifyContent: 'center',
                opacity: barrierTile,
                transform: `translateY(${(1 - barrierTile) * 10}px) scale(${0.9 + 0.1 * barrierTile})`,
              }}
            >
              <Checkpoint width={150} crop="gate" fence={false} state="cut" barrier={0} />
            </div>
          ) : null}
          {barrierTile > 0.001 ? (
            <svg width={W} height={660} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: barrierTile }}>
              <line x1={BARRIER_TILE.x + BARRIER_TILE.w / 2} y1={BARRIER_TILE.y + 138} x2={BARRIER_TILE.x + BARRIER_TILE.w / 2} y2={TAG_Y - 4} stroke={alpha(C.violet, 0.7)} strokeWidth={3} strokeDasharray="8 7" />
            </svg>
          ) : null}

          {/* ---- The two terms, under the floor line ---- */}
          <div style={{ position: 'absolute', left: LX - 400, width: 800, top: TAG_Y, display: 'flex', justifyContent: 'center' }}>
            <TermCard
              term={S08.safe.term}
              p={safeTag}
              termP={safeTerm}
              size={42}
              dim={dimL}
              glow={windowWeight(frame, at.personas - 4, at.datos - 4, { ramp: 10 })}
              glowTone={C.emerald}
              aside={<InlineSub text={S08.safe.sub} p={safeTag} color="#6ee7b7" />}
            />
          </div>
          <div style={{ position: 'absolute', left: RX - 420, width: 840, top: TAG_Y, display: 'flex', justifyContent: 'center' }}>
            <TermCard
              term={S08.secure.term}
              p={secureTag}
              termP={secureTerm}
              size={42}
              glow={windowWeight(frame, at.datos - 4, wrapAt, { ramp: 10 })}
              glowTone={C.cyan}
              aside={<InlineSub text={S08.secure.sub} p={secureTag} color="#fcd34d" />}
            />
          </div>
        </div>
      ) : null}

      {/* ================= The lesson's line ================= */}
      {life1 > 0.001 ? (
        <div style={{ position: 'absolute', left: 0, width: W, top: 14, display: 'flex', justifyContent: 'center', gap: 16, whiteSpace: 'nowrap', fontSize: 44, fontWeight: 860 }}>
          <span style={{ color: '#6ee7b7', opacity: life1, transform: `translateY(${(1 - life1) * 10}px)` }}>{S08.life[0]}</span>
          <span style={{ color: C.cyanSoft, opacity: life2, transform: `translateY(${(1 - life2) * 10}px)` }}>{S08.life[1]}</span>
        </div>
      ) : null}

      {/* ================= Wrap: every control and every door has its answer ================= */}
      {wrapIn > 0.001 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: wrapIn }}>
          {[0, 1].map((gi) => {
            const show = gi === 0 ? g1 : g2;
            if (show <= 0.001) return null;
            return (
              <div
                key={gi}
                style={{
                  position: 'absolute',
                  left: GROUP[gi] - (TILE_W * 2 + 30) / 2,
                  width: TILE_W * 2 + 30,
                  top: 112,
                  opacity: show,
                  transform: `translateY(${(1 - show) * 14}px)`,
                }}
              >
                <div style={{ textAlign: 'center', fontSize: 42, fontWeight: 850, color: C.textStrong, whiteSpace: 'nowrap', marginBottom: 20 }}>{gi === 0 ? S08.wrap.controls : S08.wrap.doors}</div>
                <div style={{ display: 'flex', gap: 30 }}>
                  {gi === 0 ? (
                    <>
                      <WrapTile term={S08.wrap.terms.open} art={<Checkpoint width={240} crop="gate" fence={false} state="cut" barrier={1} />} />
                      <WrapTile term={S08.wrap.terms.closed} art={<Checkpoint width={240} crop="gate" fence={false} state="cut" barrier={0} />} />
                    </>
                  ) : (
                    <>
                      <WrapTile term={S08.wrap.terms.safe} art={<Door w={136} h={176} kind="exit" open={1} power={0.4} icon />} />
                      <WrapTile term={S08.wrap.terms.secure} art={<Door w={136} h={176} kind="server" lock={1} power={0.4} icon />} />
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : null}
    </Stage>
  );
}

function dimOpacity(d: number) {
  return d > 0.001 ? { opacity: 1 - 0.55 * clamp01(d), filter: `saturate(${1 - 0.5 * clamp01(d)})` } : {};
}

/** The term's line, inline after it («primero, …»). */
function InlineSub({ text, p, color }: { text: string; p: number; color: string }) {
  const k = clamp01(p);
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 14, opacity: k, fontSize: 34, fontWeight: 800, color, whiteSpace: 'nowrap' }}>
      <span style={{ color: C.muted, fontWeight: 700 }}>·</span>
      {text}
    </span>
  );
}

/** One answer of the wrap: its picture and its exam term. */
function WrapTile({ term, art }: { term: string; art: ReactNode }) {
  return (
    <div
      style={{
        width: TILE_W,
        height: 360,
        boxSizing: 'border-box',
        borderRadius: RADIUS.lg,
        border: `2px solid ${alpha(C.violet, 0.55)}`,
        background: `linear-gradient(180deg, ${alpha(C.ink800, 0.9)} 0%, ${alpha(C.ink900, 0.96)} 100%)`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '26px 12px 22px',
      }}
    >
      <div style={{ height: 200, display: 'grid', placeItems: 'center' }}>{art}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 36, fontWeight: 850, color: '#c4b5fd', whiteSpace: 'nowrap' }}>
        <Icon name="mortarboard" size={32} color={C.violet} />
        {term}
      </div>
    </div>
  );
}

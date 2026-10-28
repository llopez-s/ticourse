import type { ReactNode } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, progress, springIn } from '../../../engine/src/theme/motion';
import { Icon, clamp01, type IconName } from '../../../engine/src/ui';
import { Packet } from '../../../engine/src/ui/Connector';
import { Link } from './parts/Link';
import { curveBetween, curveBetweenV } from '../../../engine/src/ui/geometry';
import { Stage, wordFrame } from './kit';
import { Rotulo, SceneStamp } from './parts/Bits';
import { FOLDER_NAME, PARTES, type AclId } from './parts/data';
import { FolderAcl, FolderGlyph, type RowFx } from './parts/FolderAcl';
import { Pill } from './parts/Labels';
import { GroupCard } from './parts/People';
import { win } from './parts/timing';

const S = 's10-vuelta';
const W = STAGE.width;
const H = STAGE.height;
const RX = 880;
const IDS: AclId[] = ['staff', 'maint', 'ops', 'svc'];
const SLOT_X = RX + 32 + 5 * 128 + 64; // centre of the empty slot of a GroupCard of 5 members, 840 wide

/** One line of what happens in the day: an icon in a disc and a short sentence. */
function Beat({ icon, children, show, tone = C.cyan }: { icon: IconName; children: ReactNode; show: number; tone?: string }) {
  const s = clamp01(show);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 20, height: 58, fontFamily: FONT.sans, opacity: s, transform: `translateX(${(1 - s) * 26}px)` }}>
      <div style={{ width: 56, height: 56, borderRadius: 28, flexShrink: 0, display: 'grid', placeItems: 'center', background: alpha(tone, 0.16), border: `3px solid ${alpha(tone, 0.8)}` }}>
        <Icon name={icon} size={32} color={tone} strokeWidth={2.4} />
      </div>
      <span style={{ fontSize: 42, fontWeight: 800, letterSpacing: -0.5, color: C.textStrong, whiteSpace: 'nowrap' }}>{children}</span>
    </div>
  );
}

/** One of the three pieces of the closing picture. */
function Piece({ icon, word, sub, tone, show, children }: { icon?: IconName; word: string; sub: string; tone: string; show: number; children?: ReactNode }) {
  const s = clamp01(show);
  return (
    <div
      style={{
        width: 500,
        height: 330,
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 18,
        borderRadius: RADIUS.lg,
        border: `3px solid ${alpha(tone, 0.4 + 0.5 * s)}`,
        background: `linear-gradient(180deg, ${alpha(tone, 0.12)}, ${alpha(C.ink900, 0.96)} 75%)`,
        boxShadow: `0 0 ${Math.round(34 * s)}px ${alpha(tone, 0.25 * s)}`,
        fontFamily: FONT.sans,
        opacity: Math.min(1, s * 1.5),
        transform: `translateY(${(1 - s) * 50}px) scale(${0.92 + 0.08 * s})`,
      }}
    >
      <div style={{ width: 128, height: 128, borderRadius: 64, display: 'grid', placeItems: 'center', background: alpha(tone, 0.14), border: `3px solid ${alpha(tone, 0.85)}` }}>
        {children ?? (icon ? <Icon name={icon} size={72} color={tone} strokeWidth={2} /> : null)}
      </div>
      <div style={{ fontSize: 64, fontWeight: 850, letterSpacing: -1.5, color: C.textStrong }}>{word}</div>
      <div style={{ fontSize: 34, fontWeight: 700, color: C.muted, whiteSpace: 'nowrap' }}>{sub}</div>
    </div>
  );
}

/**
 * s10-vuelta «Vuelta al taller». The thread again, as in s03 but now with the account inside Mantenimiento. `member`: the
 * gate opens and the account fills its slot (the system reads the groups when you log in); `saved`, `ops-reads`,
 * `friday` light, one by one, the row that makes each thing possible and add a line to the day; `nobody`: the whole list
 * in green, nobody with more than they need. `moves`: the account leaves Mantenimiento for another group and the list does
 * not change (`follow`: permissions follow the post, not the person). `pieces`: identidad · grupo · permiso.
 */
export function S10Vuelta(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const memberAt = props.cue('member');
  const savedAt = props.cue('saved');
  const opsAt = props.cue('ops-reads');
  const fridayAt = props.cue('friday');
  const nobodyAt = props.cue('nobody');
  const movesAt = props.cue('moves');
  const followAt = props.cue('follow');
  const piecesAt = props.cue('pieces');

  const wMain = 1 - progress(frame, piecesAt - 10, 14, EASE.inOut);
  const wPieces = progress(frame, piecesAt - 4, 14);

  // --- the thread
  const gateOpen = 1; // the account joined in s03: the thread is already open
  const mine = 1 - progress(frame, movesAt, 14);
  const fMaint = win(frame, savedAt, opsAt, 10);
  const fOps = win(frame, opsAt, fridayAt, 10);
  const fSvc = win(frame, fridayAt, nobodyAt, 10);
  const all = progress(frame, nobodyAt, 16) * 0.75 * (1 - 0.6 * progress(frame, movesAt, 20));
  const focusOf: Record<AclId, number> = { staff: all, maint: Math.max(fMaint, all), ops: Math.max(fOps, all), svc: Math.max(fSvc, all) };
  const fx: Partial<Record<AclId, RowFx>> = {};
  IDS.forEach((id) => {
    const others = IDS.filter((o) => o !== id).reduce((m, o) => Math.max(m, id === 'staff' || o === 'staff' ? 0 : focusOf[o]), 0);
    fx[id] = { focus: focusOf[id], dim: all > 0.1 ? 0 : others * 0.7, mine: id === 'maint' ? mine : 0, tone: all > 0.1 ? C.emerald : undefined };
  });

  // --- the right-hand zone: Mantenimiento, the day, the other group
  const slotFill = 1 - progress(frame, movesAt, 16);
  const topCard = win(frame, 4, followAt - 6, 12);
  const lines = [progress(frame, savedAt, 14), progress(frame, opsAt, 14), progress(frame, fridayAt, 14)] as const;
  const beatsOut = 1 - progress(frame, movesAt - 8, 12);
  const loginHint = win(frame, 14, savedAt - 6, 10);
  const nobody = progress(frame, nobodyAt, 16) * beatsOut;
  const otherIn = progress(frame, movesAt - 4, 16);
  const otherFill = progress(frame, movesAt + 22, 22, EASE.out);
  const hop = progress(frame, movesAt + 4, 34, EASE.inOut);
  const hopCurve = curveBetweenV({ x: SLOT_X, y: 84 + 225 }, { x: SLOT_X, y: 400 + 225 }, 0.5);
  const follow = progress(frame, followAt, 18);

  // --- pieces
  const pieceAt = [piecesAt, piecesAt + 14, piecesAt + 28];
  const suyaAt = wordFrame(S, 's10-04', 'suya');

  return (
    <Stage>
      <SceneStamp frame={frame} />

      {wMain > 0.01 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: wMain }}>
          <div style={{ position: 'absolute', left: 0, top: 84 }}>
            <FolderAcl entries={PARTES} fx={fx} rest={{ dim: all > 0.1 ? 0 : 0.5 * Math.max(fMaint, fOps, fSvc) }} gate={{ open: gateOpen }} />
          </div>

          {/* Mantenimiento and the account: not in yet, then in */}
          <div style={{ position: 'absolute', left: RX, top: 84, opacity: topCard }}>
            <GroupCard
              title="grupo Mantenimiento"
              members={5}
              show={progress(frame, 6, 24)}
              glow={win(frame, memberAt, savedAt, 12) * 0.8}
              slot={{ label: slotFill > 0.5 ? 'tu cuenta · ya dentro' : frame >= movesAt ? 'tu cuenta · ya no' : 'tu cuenta · aún no', fill: slotFill, show: 1, labelTone: frame >= movesAt && slotFill < 0.5 ? C.muted : undefined }}
            />
          </div>

          {/* the day */}
          <div style={{ position: 'absolute', left: RX, top: 392, opacity: loginHint }}>
            <Pill text="vuelves a iniciar sesión" tone={C.cyan} icon="key" size={42} height={72} />
            <div style={{ marginTop: 14, fontFamily: FONT.sans, fontSize: 36, fontWeight: 700, color: C.muted, whiteSpace: 'nowrap' }}>el sistema mira tus grupos al entrar</div>
          </div>
          <div style={{ position: 'absolute', left: RX, top: 392, display: 'grid', gap: 10, opacity: beatsOut }}>
            <Beat icon="file" show={lines[0]} tone={C.emerald}>
              parte guardado
            </Beat>
            <Beat icon="eye" show={lines[1]} tone={C.emerald}>
              Operaciones lo lee
            </Beat>
            <Beat icon="gear" show={lines[2]} tone={C.sky}>
              el viernes, el resumen lo recoge
            </Beat>
          </div>
          <Rotulo weight={nobody} size={44} style={{ position: 'absolute', left: RX, top: 592 }}>
            nadie con <span style={{ color: C.emerald }}>más de lo que necesita</span>
          </Rotulo>

          {/* the move to another group */}
          <div style={{ position: 'absolute', left: RX, top: 400, opacity: otherIn, transform: `translateY(${(1 - otherIn) * 18}px)` }}>
            <GroupCard title="otro grupo" members={4} show={otherIn} slot={{ label: otherFill > 0.5 ? 'tu cuenta · ya dentro' : 'tu cuenta · aún no', fill: otherFill, show: 1 }} glow={win(frame, movesAt + 20, followAt, 12) * 0.7} />
          </div>
          <svg width={W} height={H} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} aria-hidden>
            <Link curve={hopCurve} color={C.cyan} width={5} dashed opacity={progress(frame, movesAt + 2, 10) * (1 - progress(frame, movesAt + 44, 14))} />
            {hop > 0 && hop < 1 ? <Packet curve={hopCurve} t={hop} color={C.cyan} radius={14} /> : null}
          </svg>

          {/* permissions follow the post */}
          <Rotulo weight={follow} size={54} style={{ position: 'absolute', left: RX, top: 100 }}>
            los permisos siguen <span style={{ color: C.emerald }}>al puesto</span>,
            <br />
            no a la persona
          </Rotulo>
          <div style={{ position: 'absolute', left: RX, top: 300, display: 'flex', alignItems: 'center', gap: 16, opacity: follow, fontFamily: FONT.sans, fontSize: 36, fontWeight: 700, color: C.muted, whiteSpace: 'nowrap' }}>
            <FolderGlyph width={64} />
            {FOLDER_NAME}: la lista no cambia
          </div>
        </div>
      ) : null}

      {/* ---------- the three pieces ---------- */}
      {wPieces > 0.01 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: wPieces }}>
          <div style={{ position: 'absolute', left: 0, top: 160 }}>
            <Piece icon="key" word="identidad" sub="tu cuenta" tone={C.cyan} show={springIn(frame, fps, pieceAt[0], { damping: 16 })} />
          </div>
          <div style={{ position: 'absolute', left: 614, top: 160 }}>
            <Piece icon="users" word="grupo" sub="tu puesto" tone={C.sky} show={springIn(frame, fps, pieceAt[1], { damping: 16 })} />
          </div>
          <div style={{ position: 'absolute', left: 1228, top: 160 }}>
            <Piece word="permiso" sub="lo que concede la carpeta" tone={C.emerald} show={springIn(frame, fps, pieceAt[2], { damping: 16 })}>
              <FolderGlyph width={78} tone={C.emerald} />
            </Piece>
          </div>
          <svg width={W} height={H} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} aria-hidden>
            <Link curve={curveBetween({ x: 508, y: 325 }, { x: 606, y: 325 }, 0.3)} color={C.cyan} width={6} draw={progress(frame, pieceAt[1] + 10, 14)} />
            <Link curve={curveBetween({ x: 1122, y: 325 }, { x: 1220, y: 325 }, 0.3)} color={C.cyan} width={6} draw={progress(frame, pieceAt[2] + 10, 14)} />
          </svg>
          <Rotulo weight={progress(frame, Math.max(pieceAt[2] + 24, suyaAt - 40), 18)} size={58} style={{ position: 'absolute', left: 0, right: 0, top: 548, textAlign: 'center' }}>
            cada fallo se arregla <span style={{ color: C.emerald }}>en su pieza</span>
          </Rotulo>
        </div>
      ) : null}
    </Stage>
  );
}

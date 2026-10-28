import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../engine/src/theme/motion';
import { Icon } from '../../../engine/src/ui';
import { Stage, wordFrame } from './kit';
import { HOST, UPLOAD_DST } from './parts/data';
import { PATH_LABELS } from './parts/data-b';
import { CaseStamp } from './parts/CaseStamp';
import { SourceTag } from './parts/Ruler';
import { WitnessFigure } from './parts/Witness';

const S = 's10-bloqueo';

// ---- Geometry (stage-local). The two paths leave the equipment on the left and meet the Internet on the right.
const EQUIPO = { x: 140, y: 300, r: 60 } as const;
const INTERNET = { x: 1588, y: 300, r: 60 } as const;
const DOOR = { left: 560, top: 20, w: 300 } as const;
const UPPER = 'M 204 276 C 390 276, 390 204, 576 204';
const BEYOND = 'M 880 204 C 1100 204, 1300 250, 1526 290';
const DIRECT = 'M 150 360 C 150 520, 320 500, 560 500 L 1000 500 C 1300 500, 1440 470, 1562 358';
/** The outbound firewall stands at the shared exit, where both paths must cross it (it sees the proxy's traffic too). */
const FIREWALL_AT = { x: 1385, y: 360 } as const;
const GATE = { x: 1385, top: 232, bottom: 486 } as const;

/** A path drawn along `d` (0–1), with a soft halo. */
function PathLine({ d, color, draw, width = 8, dim = 0, dashed = false }: { d: string; color: string; draw: number; width?: number; dim?: number; dashed?: boolean }) {
  if (draw < 0.005) return null;
  const o = 1 - 0.6 * dim;
  return (
    <g opacity={o}>
      {!dashed ? <path d={d} fill="none" stroke={alpha(color, 0.25)} strokeWidth={width + 12} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} /> : null}
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
        pathLength={dashed ? undefined : 1}
        strokeDasharray={dashed ? '4 22' : 1}
        strokeDashoffset={dashed ? 0 : 1 - draw}
        opacity={dashed ? draw : 1}
      />
    </g>
  );
}

function Node({ x, y, r, icon, label, sub, on }: { x: number; y: number; r: number; icon: 'laptop' | 'globe'; label: string; sub?: string; on: number }) {
  return (
    <div style={{ position: 'absolute', left: x - 130, top: y - r - (sub ? 88 : 54), width: 260, display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: FONT.sans, opacity: on, transform: `translateY(${(1 - on) * 14}px)` }}>
      <div style={{ fontSize: 40, fontWeight: 850, color: C.textStrong, lineHeight: 1.1 }}>{label}</div>
      {sub ? <div style={{ fontFamily: FONT.mono, fontSize: 28, fontWeight: 600, color: C.muted }}>{sub}</div> : null}
      <div style={{ marginTop: 10, width: r * 2, height: r * 2, borderRadius: r, background: alpha(C.cyan, 0.1), border: `3px solid ${alpha(C.cyan, 0.8)}`, display: 'grid', placeItems: 'center', boxShadow: `0 0 26px ${alpha(C.cyan, 0.18)}` }}>
        <Icon name={icon} size={r * 1.15} color={C.cyan} strokeWidth={2} />
      </div>
    </div>
  );
}

/**
 * s10-bloqueo «Un bloqueo no cierra el caso». Two paths from the equipment to the Internet. `two-paths`: the first goes
 * through the proxy's door and stops there: `403 BLOQUEADO` (rose, the only rose in the scene) and a cross. `door`: the
 * proxy's witness (the same silhouette as s02, «imagen · no es del puerto») looks only at its own doorway — a narrow
 * beam. `direct`: the second path is drawn later and goes AROUND the door; the firewall (and the EDR) saw it talking
 * to `dst=198.51.100.117:443`, boxed on the path, with ALLOW (white, never alarm-coloured). The firewall stands at the
 * shared exit, where both paths cross it (it also sees the proxy's traffic); the first path's far side stays dotted:
 * through there nothing left. `other`: the direct path is the one in focus. `finding`: amber label «¿sale sin proxy?
 * a comprobar» (a question to check, not a verdict). `close`: «ni el bloqueo te tranquiliza ni el permitido te condena».
 */
export function S10Bloqueo(props: SceneProps) {
  const frame = useCurrentFrame();
  const twoAt = props.cue('two-paths');
  const doorAt = props.cue('door');
  const directAt = props.cue('direct');
  const otherAt = props.cue('other');
  const findingAt = props.cue('finding');
  const closeAt = props.cue('close');
  const proveAt = Math.max(directAt + 40, wordFrame(S, 's10-02', 'prueba') - 6);

  const nodes = progress(frame, twoAt - 2, 18);
  const upper = progress(frame, twoAt + 6, 40, EASE.inOut);
  const doorFig = progress(frame, twoAt + 14, 20);
  const blockedChip = progress(frame, twoAt + 30, 16);
  const cross = progress(frame, twoAt + 44, 12);
  const caption = progress(frame, twoAt + 50, 16);
  const see = progress(frame, doorAt, 30, EASE.out);
  const doorGlow = progress(frame, doorAt - 2, 14) * (1 - progress(frame, directAt - 6, 16));

  const direct = progress(frame, directAt, 64, EASE.inOut);
  const fwNode = progress(frame, directAt + 30, 16);
  const dstAt = Math.max(directAt + 40, wordFrame(S, 's10-02', 'dirección') - 6);
  const dstChip = progress(frame, dstAt, 16);
  const allowChip = progress(frame, directAt + 64, 16);
  const beyond = progress(frame, proveAt, 24);
  const focusDirect = progress(frame, otherAt - 4, 16);
  const finding = progress(frame, findingAt, 18);
  const closeLines = [progress(frame, closeAt, 16), progress(frame, closeAt + 14, 16)];

  return (
    <Stage>
      <svg width={1728} height={620} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} aria-hidden>
        <PathLine d={UPPER} color={C.cyan} draw={upper} dim={focusDirect * 0.8} />
        <PathLine d={BEYOND} color={C.muted} draw={beyond} width={6} dashed />
        <PathLine d={DIRECT} color={C.cyan} draw={direct} width={8 + 2 * focusDirect} />
        {/* the firewall's gate at the shared exit: both paths cross it */}
        {fwNode > 0.01 ? <line x1={GATE.x} y1={GATE.top} x2={GATE.x} y2={GATE.top + (GATE.bottom - GATE.top) * fwNode} stroke={alpha(C.cyan, 0.55)} strokeWidth={8} strokeLinecap="round" strokeDasharray="2 14" /> : null}
        {/* the cross on the door */}
        {cross > 0.01 ? (
          <g opacity={cross} transform={`translate(576 204) scale(${0.6 + 0.4 * cross})`}>
            <circle r={26} fill={C.ink900} stroke={C.rose} strokeWidth={5} />
            <path d="M -11 -11 L 11 11 M 11 -11 L -11 11" stroke={C.rose} strokeWidth={6} strokeLinecap="round" />
          </g>
        ) : null}
      </svg>

      <Node x={EQUIPO.x} y={EQUIPO.y} r={EQUIPO.r} icon="laptop" label="equipo" sub={HOST} on={nodes} />
      <Node x={INTERNET.x} y={INTERNET.y} r={INTERNET.r} icon="globe" label="Internet" on={nodes} />

      {/* the proxy's witness, at its door */}
      <div style={{ position: 'absolute', left: DOOR.left, top: DOOR.top, opacity: doorFig, transform: `translateY(${(1 - doorFig) * 14}px)` }}>
        <WitnessFigure kind="door" width={DOOR.w} see={see} glow={doorGlow} />
      </div>
      <div style={{ position: 'absolute', left: DOOR.left, top: DOOR.top + 322, display: 'flex', alignItems: 'center', gap: 16, fontFamily: FONT.sans, opacity: caption }}>
        <SourceTag id="proxy" size={30} />
        <span style={{ fontSize: 28, fontWeight: 600, color: C.muted, whiteSpace: 'nowrap' }}>{PATH_LABELS.witnessCaption}</span>
      </div>

      {/* 403 BLOQUEADO on the first path (the only rose here) */}
      <div
        style={{
          position: 'absolute',
          left: 238,
          top: 130,
          padding: '6px 20px',
          borderRadius: RADIUS.md,
          border: `3px solid ${alpha(C.rose, 0.9)}`,
          background: alpha(C.rose, 0.14),
          fontFamily: FONT.mono,
          fontSize: 36,
          fontWeight: 800,
          color: C.roseSoft,
          whiteSpace: 'nowrap',
          opacity: blockedChip,
          transform: `translateY(${(1 - blockedChip) * 12}px)`,
        }}
      >
        {PATH_LABELS.blocked}
      </div>

      {/* the first path's far side: nothing left through there */}
      <div style={{ position: 'absolute', left: 1000, top: 150, fontFamily: FONT.sans, fontSize: 30, fontWeight: 650, color: C.muted, whiteSpace: 'nowrap', opacity: beyond }}>{PATH_LABELS.notThrough}</div>

      {/* the firewall at the shared exit, the destination it saw on the direct path, and ALLOW */}
      <div style={{ position: 'absolute', left: FIREWALL_AT.x - 130, top: FIREWALL_AT.y - 32, width: 260, display: 'flex', justifyContent: 'center', opacity: fwNode, transform: `scale(${0.92 + 0.08 * fwNode})` }}>
        <div style={{ padding: 4, borderRadius: RADIUS.pill, background: C.ink900 }}>
          <SourceTag id="firewall" size={34} />
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          left: 1170,
          top: 404,
          padding: '6px 22px',
          borderRadius: RADIUS.md,
          border: `3px solid ${alpha(C.textStrong, 0.85)}`,
          background: alpha(C.textStrong, 0.08),
          fontFamily: FONT.mono,
          fontSize: 38,
          fontWeight: 800,
          color: C.textStrong,
          whiteSpace: 'nowrap',
          opacity: allowChip,
          transform: `translateY(${(1 - allowChip) * 12}px)`,
        }}
      >
        {PATH_LABELS.allowed}
      </div>

      <div
        style={{
          position: 'absolute',
          left: 600,
          top: 416,
          padding: '4px 18px',
          borderRadius: RADIUS.md,
          border: `3px solid ${alpha(C.textStrong, 0.85)}`,
          background: alpha(C.textStrong, 0.08),
          fontFamily: FONT.mono,
          fontSize: 32,
          fontWeight: 800,
          color: C.textStrong,
          whiteSpace: 'nowrap',
          opacity: dstChip,
          transform: `translateY(${(1 - dstChip) * 12}px)`,
        }}
      >
        <span style={{ color: C.muted }}>dst=</span>
        {UPLOAD_DST}
      </div>

      {/* the finding, over the direct path */}
      <div
        style={{
          position: 'absolute',
          left: 410,
          top: 522,
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          padding: '8px 28px 8px 18px',
          borderRadius: RADIUS.pill,
          border: `3px solid ${alpha(C.amber, 0.9)}`,
          background: alpha(C.amber, 0.12),
          boxShadow: `0 0 ${24 * finding}px ${alpha(C.amber, 0.3 * finding)}`,
          fontFamily: FONT.sans,
          fontSize: 40,
          fontWeight: 850,
          color: C.amber,
          whiteSpace: 'nowrap',
          opacity: finding,
          transform: `translateY(${(1 - finding) * 14}px)`,
        }}
      >
        <Icon name="flag" size={40} color={C.amber} strokeWidth={2.2} />
        {PATH_LABELS.finding}
        <span style={{ fontSize: 32, fontWeight: 650, color: alpha(C.amber, 0.85) }}>{PATH_LABELS.findingTail}</span>
      </div>

      {/* the chapter's close */}
      <div style={{ position: 'absolute', left: 1010, top: 4, fontFamily: FONT.sans, fontSize: 40, fontWeight: 800, lineHeight: 1.2, color: C.textStrong, whiteSpace: 'nowrap' }}>
        {PATH_LABELS.close.map((line, k) => (
          <div key={line} style={{ opacity: closeLines[k], transform: `translateX(${(1 - closeLines[k]) * 18}px)` }}>
            {line}
          </div>
        ))}
      </div>

      <CaseStamp frame={frame} />
    </Stage>
  );
}

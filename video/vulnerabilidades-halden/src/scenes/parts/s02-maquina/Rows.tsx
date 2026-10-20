import { C, alpha } from '../../../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../../../engine/src/theme/motion';
import { ESCAPE, REUSE } from '../../../data/s02-maquina';
import { Arrow } from '../Arrow';
import { Caption, TermPill } from '../Labels';
import { Disk, HV, SERVER, Server, vmRect } from '../Server';

export const SRV_W = 760;
const TEXT_X = 830;
const HV_MID = HV.y + HV.h / 2;

/** Point at fraction `p` (0–1, by length) along a polyline. */
function along(points: [number, number][], p: number): [number, number] {
  const segs = points.slice(1).map((pt, i) => Math.hypot(pt[0] - points[i][0], pt[1] - points[i][1]));
  let left = segs.reduce((a, b) => a + b, 0) * Math.max(0, Math.min(1, p));
  for (let i = 0; i < segs.length; i++) {
    if (left <= segs[i] || i === segs.length - 1) {
      const k = segs[i] === 0 ? 0 : Math.min(1, left / segs[i]);
      return [points[i][0] + (points[i + 1][0] - points[i][0]) * k, points[i][1] + (points[i + 1][1] - points[i][1]) * k];
    }
    left -= segs[i];
  }
  return points[points.length - 1];
}

/** The term and its fix, on the right of a row. */
function RowText({ frame, top, term, fix, termAt, fixAt }: { frame: number; top: number; term: string; fix: string; termAt: number; fixAt: number }) {
  return (
    <>
      {frame >= termAt - 4 ? (
        <div style={{ position: 'absolute', left: TEXT_X, top: top + 40, ...enter(frame, termAt, { distance: 16 }) }}>
          <TermPill text={term} size={44} on={progress(frame, termAt, 10) * (1 - 0.4 * progress(frame, fixAt + 20, 14))} />
        </div>
      ) : null}
      {frame >= fixAt - 4 ? (
        <div style={{ position: 'absolute', left: TEXT_X + 6, top: top + 132, ...enter(frame, fixAt, { distance: 14 }) }}>
          <Caption size={36} color={C.text}>
            {fix}
          </Caption>
        </div>
      ) : null}
    </>
  );
}

/**
 * Row 1, VM escape: three machines on the hypervisor. On `escape` a rose code block lights in the first machine; on
 * `cross` (the glitch) a rose arrow runs down into the hypervisor — the bar jolts, flashes once and cracks — and up
 * into the next machine. «VM escape» on its word, «se cierra parcheando el hipervisor» on «parcheando».
 */
export function EscapeRow({ frame, top, t }: { frame: number; top: number; t: { server: number; escape: number; cross: number; term: number; fix: number } }) {
  const v0 = vmRect(0, 3);
  const v1 = vmRect(1, 3);
  const code = progress(frame, t.escape, 12);
  const draw = progress(frame, t.cross, 20, EASE.inOut);
  const reached = progress(frame, t.cross + 16, 10);
  const path: [number, number][] = [
    [v0.x + v0.w / 2, v0.y + v0.h - 6],
    [v0.x + v0.w / 2, HV_MID],
    [v1.x + v1.w / 2, HV_MID],
    [v1.x + v1.w / 2, v1.y + v1.h - 14],
  ];
  return (
    <>
      <div style={{ position: 'absolute', left: 0, top, ...enter(frame, t.server - 4, { distance: 18 }) }}>
        <Server
          width={SRV_W}
          vms={[{ glow: code * (1 - 0.6 * reached) }, { glow: reached, tone: reached > 0.5 ? C.rose : C.cyan }, {}]}
          hvGlow={0.3}
          hvFlicker={frame >= t.cross ? progress(frame, t.cross, 14, EASE.linear) : 0}
          hvCrack={progress(frame, t.cross, 10)}
        >
          {code > 0.01 ? (
            <g opacity={code}>
              <rect x={v0.x + v0.w / 2 - 44} y={v0.y + 34} width={88} height={56} rx={10} fill={alpha(C.rose, 0.25)} stroke={C.rose} strokeWidth={3} />
              {[0, 1, 2].map((k) => (
                <rect key={k} x={v0.x + v0.w / 2 - 30} y={v0.y + 46 + k * 12} width={k === 1 ? 40 : 60} height={6} rx={3} fill={alpha(C.roseSoft, 0.9)} />
              ))}
            </g>
          ) : null}
          <Arrow points={path} draw={draw} color={C.rose} width={6} />
        </Server>
      </div>
      <RowText frame={frame} top={top} term={ESCAPE.term} fix={ESCAPE.fix} termAt={t.term} fixAt={t.fix} />
    </>
  );
}

/**
 * Row 2, resource reuse: a machine «de baja» (dashed) and, on «nueva», a new one. On «disco» the retired machine's disk,
 * with the amber lines it still holds, travels down through the hypervisor and up into the new machine; on «borrarlo»
 * its residue glows. Nobody crosses a wall. «resource reuse» on its word, the fix on «limpiando».
 */
export function ReuseRow({ frame, top, t }: { frame: number; top: number; t: { reuse: number; fresh: number; disk: number; residue: number; term: number; fix: number } }) {
  const v0 = vmRect(0, 3);
  const v2 = vmRect(1, 3);
  const fresh = progress(frame, t.fresh - 4, 14);
  const move = progress(frame, t.disk - 4, 30, EASE.inOut);
  const residue = progress(frame, t.residue - 4, 12);
  const path: [number, number][] = [
    [v0.x + v0.w / 2, v0.y + 52],
    [v0.x + v0.w / 2, HV_MID],
    [v2.x + v2.w / 2, HV_MID],
    [v2.x + v2.w / 2, v2.y + 52],
  ];
  const [dx, dy] = along(path, move);
  return (
    <>
      <div style={{ position: 'absolute', left: 0, top, ...enter(frame, t.reuse - 4, { distance: 18 }) }}>
        <Server
          width={SRV_W}
          vms={[
            { dashed: true, tone: C.muted, label: REUSE.retired },
            { label: REUSE.fresh, show: fresh, glow: residue },
            {},
          ]}
          hvGlow={move > 0 && move < 1 ? 0.8 : 0.3}
        >
          {move > 0.01 && move < 0.99 ? <path d={`M ${path.map((p) => p.join(' ')).join(' L ')}`} fill="none" stroke={alpha(C.amber, 0.4)} strokeWidth={4} strokeDasharray="8 8" /> : null}
          {residue > 0.01 ? <circle cx={dx} cy={dy} r={38 + 4 * residue} fill={alpha(C.amber, 0.14 * residue)} stroke={alpha(C.amber, 0.6 * residue)} strokeWidth={3} /> : null}
          <Disk cx={dx} cy={dy} residue={1} tone={C.sky} scale={0.82} />
        </Server>
      </div>
      <RowText frame={frame} top={top} term={REUSE.term} fix={REUSE.fix} termAt={t.term} fixAt={t.fix} />
    </>
  );
}

export const ROW_H = (SRV_W * SERVER.h) / SERVER.w;

import { useMemo } from 'react';
import { C, STAGE, alpha } from '../../../../../engine/src/theme/tokens';
import { progress } from '../../../../../engine/src/theme/motion';
import { Packet, cubicLength, cubicPath } from '../../../../../engine/src/ui';
import type { LinkId } from '../../../data/s02-collect';
import { L, LANDING, LINK_IDS, PORT, inputY, linkCurve } from './layout';
import { DRAW, TRAVEL, linkLitAt, wipeFocus, type S02Timing } from './timing';

/**
 * Every source-to-collector link: a faint dashed guide from the start, drawn
 * solid in cyan when the voice names its method, with log packets flowing to
 * the collector. The most recent link carries a soft halo.
 */
export function Links({ frame, T }: { frame: number; T: S02Timing }) {
  const geo = useMemo(
    () =>
      LINK_IDS.map((id) => {
        const curve = linkCurve(id);
        return { id, curve, d: cubicPath(curve), length: cubicLength(curve) };
      }),
    [],
  );
  const guides = progress(frame, 8, 16) * 0.5;
  const w = wipeFocus(frame, T);

  return (
    <svg
      width={STAGE.width}
      height={STAGE.height}
      style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}
    >
      {geo.map(({ id, curve, d, length }) => {
        const litAt = linkLitAt(T, id);
        const draw = progress(frame, litAt, DRAW);
        const halo = progress(frame, litAt, 8) * (1 - progress(frame, litAt + 50, 18));
        // In the closing beat only the Sistemas link (the path the evidence already took) stays visible.
        const dim = 1 - (id === 'sys' ? 0.5 : 0.92) * w;
        return (
          <g key={id} opacity={dim}>
            <path d={d} fill="none" stroke={C.ink600} strokeWidth={3} strokeDasharray="8 12" opacity={guides * (1 - draw)} />
            {halo > 0 ? (
              <path d={d} fill="none" stroke={alpha(C.cyan, 0.22 * halo)} strokeWidth={14} strokeLinecap="round" />
            ) : null}
            {draw > 0 ? (
              <path
                d={d}
                fill="none"
                stroke={alpha(C.cyan, 0.55 + 0.4 * halo)}
                strokeWidth={4}
                strokeLinecap="round"
                strokeDasharray={`${length} ${length}`}
                strokeDashoffset={length * (1 - draw)}
              />
            ) : null}
            {draw >= 1 && w < 0.5 ? <Packets frame={frame} id={id} T={T} curve={curve} /> : null}
          </g>
        );
      })}
    </svg>
  );
}

/** Port dots on the card edges and on the collector, drawn above the panels. */
export function Ports({ frame, T }: { frame: number; T: S02Timing }) {
  const w = wipeFocus(frame, T);
  const litInputs = new Set(LINK_IDS.filter((id) => frame >= linkLitAt(T, id)).map((id) => LANDING[id]));
  return (
    <svg
      width={STAGE.width}
      height={STAGE.height}
      style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}
    >
      {/* Exit ports on the source cards */}
      {LINK_IDS.map((id) => {
        const lit = progress(frame, linkLitAt(T, id), 8);
        return <PortDot key={id} x={PORT[id].x} y={PORT[id].y} lit={lit} opacity={progress(frame, 4, 10) * (1 - (id === 'sys' ? 0.4 : id === 'app' ? 1 : 0.9) * w)} />;
      })}
      {/* Landing ports on the collector */}
      {(['agent', 'syslog', 'api', 'netflow'] as const).map((input) => (
        <PortDot
          key={input}
          x={L.colX}
          y={inputY(input)}
          lit={litInputs.has(input) ? 1 : 0}
          opacity={progress(frame, 4, 10) * (1 - (input === 'agent' ? 0.45 : 0.8) * w)}
        />
      ))}
    </svg>
  );
}

function PortDot({ x, y, lit, opacity }: { x: number; y: number; lit: number; opacity: number }) {
  return (
    <g opacity={opacity}>
      <circle cx={x} cy={y} r={9} fill={C.ink900} stroke={lit > 0 ? C.cyan : C.ink600} strokeWidth={3} />
      <circle cx={x} cy={y} r={4.5 * lit} fill={C.cyan} />
    </g>
  );
}

function Packets({
  frame,
  id,
  T,
  curve,
}: {
  frame: number;
  id: LinkId;
  T: S02Timing;
  curve: ReturnType<typeof linkCurve>;
}) {
  const start = linkLitAt(T, id) + DRAW;
  return (
    <>
      {[0, 1].map((k) => {
        const elapsed = frame - start - k * (TRAVEL / 2);
        if (elapsed < 0) return null;
        const t = (elapsed / TRAVEL) % 1;
        return <Packet key={k} curve={curve} t={t} radius={7} />;
      })}
    </>
  );
}

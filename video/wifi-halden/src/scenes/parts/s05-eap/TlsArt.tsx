import { C, alpha } from '../../../../../engine/src/theme/tokens';
import { clamp01, mix } from '../../../../../engine/src/ui';
import { SERVER } from '../../../data/s05-eap';
import { CarnetGlyph, TabletGlyph } from '../Glyphs';
import { CertSeal, CheckArrow, ServerGlyph } from './Server';
import { ART_H, PREMISE, TLS_ART as A, W } from './layout';

/**
 * The tablet with its carné, and what EAP-TLS does with it. Draws over the whole stage's top band.
 *
 *   tablet, carnet, seal   0–1: the premise of the question, left of the think prompt («las
 *                          tabletas ya tienen certificado»): a tablet, its carné, the carné's seal
 *   move                   0–1: the pair goes to its place over the EAP-TLS group (the answer)
 *   server, cert           0–1: the server, and ITS certificate
 *   up, down               0–1: the two checks, one each way (the server checks the tablet's
 *                          carné, the tablet checks the server's certificate)
 */
export function TlsArt({
  tablet,
  carnet,
  seal,
  move,
  server,
  cert,
  up,
  down,
  glow = 0,
}: {
  tablet: number;
  carnet: number;
  seal: number;
  move: number;
  server: number;
  cert: number;
  up: number;
  down: number;
  /** 0–1: both certificates glow (mutual authentication is the point). */
  glow?: number;
}) {
  const t = clamp01(tablet);
  if (t <= 0.001) return null;
  const m = clamp01(move);
  const c = clamp01(carnet);
  const sv = clamp01(server);
  const u = clamp01(up);
  const d = clamp01(down);
  const g = clamp01(glow);
  const tab = { x: mix(PREMISE.tablet.x, A.tablet.x, m), y: mix(PREMISE.tablet.y, A.tablet.y, m), h: mix(PREMISE.tablet.h, A.tablet.h, m) };
  const car = { x: mix(PREMISE.carnet.x, A.carnet.x, m), y: mix(PREMISE.carnet.y, A.carnet.y, m), h: mix(PREMISE.carnet.h, A.carnet.h, m) };
  const K = A.checks;
  const mid = (K.x1 + K.x2) / 2;
  return (
    <svg width={W} height={ART_H} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
      <TabletGlyph x={tab.x} y={tab.y} h={tab.h} opacity={t} screen={0.5} />
      {c > 0.001 ? <CarnetGlyph x={car.x} y={car.y + (1 - c) * 14} h={car.h} opacity={c} seal={seal} glow={Math.max(0.35 * clamp01(seal) * (1 - m), 0.6 * g)} /> : null}
      {sv > 0.001 ? (
        <g opacity={sv}>
          <ServerGlyph x={A.server.x} y={A.server.y} w={A.server.w} h={A.server.h} label={SERVER} />
        </g>
      ) : null}
      <CertSeal x={A.server.x - A.server.w / 2 + 24} y={A.server.y - A.server.h / 2 - 6} r={19} show={cert} glow={0.7 * g} />
      {/* each one checks the other */}
      <CheckArrow x1={K.x1} x2={K.x2} y={K.up} draw={u} />
      <CheckArrow x1={K.x2} x2={K.x1 - 110} y={K.down} draw={d} />
      <Tick x={mid} y={K.up} show={clamp01(u * 3 - 2)} />
      <Tick x={mid - 55} y={K.down} show={clamp01(d * 3 - 2)} />
    </svg>
  );
}

/** A check that passed: an emerald tick in a disc, on its arrow. */
function Tick({ x, y, show }: { x: number; y: number; show: number }) {
  if (show <= 0.001) return null;
  return (
    <g transform={`translate(${x} ${y}) scale(${0.6 + 0.4 * show})`} opacity={show} style={{ filter: `drop-shadow(0 0 8px ${alpha(C.emerald, 0.6)})` }}>
      <circle r={21} fill={C.ink900} stroke={C.emerald} strokeWidth={4.5} />
      <path d="M -10 0 L -3 9 L 11 -9" fill="none" stroke={C.emerald} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
}

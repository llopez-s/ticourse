import { C, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { EASE, progress, pulse } from '../../../../../engine/src/theme/motion';
import { clamp01, mix } from '../../../../../engine/src/ui';
import { NETWORK } from '../../../data/s04-intrusos';
import { ToolsStrip, VignetteFrame } from './Vignette';

const NODES: [number, number][] = [
  [50, 90],
  [150, 70],
  [250, 100],
  [100, 150],
  [210, 160],
];
const LINKS: [number, number][] = [
  [0, 1],
  [1, 2],
  [0, 3],
  [3, 4],
  [2, 4],
  [1, 4],
];
const HOME = 4;
const PAGE = { w: 78, h: 98, y: 98 } as const;
const STACK_X = 362;
const COPY_X = [480, 580, 680];
/** The typing sfx runs ~91 f: three copies, ~30 f each. */
const COPY_F = 30;

function Page({ x, y, lines, tone }: { x: number; y: number; lines: number; tone: string }) {
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: PAGE.w, height: PAGE.h, borderRadius: 6, background: '#e2e8f0', border: `2px solid ${alpha(tone, 0.8)}`, boxSizing: 'border-box', padding: '12px 10px' }}>
      {Array.from({ length: 5 }, (_, i) => {
        const w = clamp01(lines * 5 - i);
        return <div key={i} style={{ width: `${(i % 2 ? 70 : 92) * w}%`, height: 6, borderRadius: 3, background: '#475569', marginBottom: 8 }} />;
      })}
    </div>
  );
}

/**
 * The second intruder (s04): the port's network as five unnamed nodes. On `yearAt` a rose dot settles on one of them
 * and stays, breathing slowly, with «más de un año dentro». On `reportsAt` (the typing sound, ~3 s) «informes para el
 * Gobierno» are copied page by page: three copies fill line by line beside the original, which never moves. On
 * `quietAt`, «no pide nada · no rompe nada». The toolkit strip («zero-day») comes in on `toolsAt`.
 */
export function Network({ frame, fps, yearAt, toolsAt, reportsAt, quietAt }: { frame: number; fps: number; yearAt: number; toolsAt: number; reportsAt: number; quietAt: number }) {
  const dotIn = progress(frame, yearAt - 4, 16);
  const breathe = frame >= yearAt ? pulse(frame, fps, 0.5) : 0;
  const docsIn = progress(frame, reportsAt - 10, 14);
  const quiet = progress(frame, quietAt, 14);
  return (
    <VignetteFrame label={NETWORK.label}>
      <svg width={340} height={200} style={{ position: 'absolute', left: 20, top: 0, overflow: 'visible' }}>
        {LINKS.map(([a, b]) => (
          <line key={`${a}-${b}`} x1={NODES[a][0]} y1={NODES[a][1]} x2={NODES[b][0]} y2={NODES[b][1]} stroke={alpha(C.cyan, 0.4)} strokeWidth={3} strokeDasharray="8 8" />
        ))}
        {NODES.map(([x, y], i) => (
          <rect key={i} x={x - 18} y={y - 14} width={36} height={28} rx={6} fill={C.ink800} stroke={alpha(C.cyan, 0.7)} strokeWidth={3} />
        ))}
        {dotIn > 0 ? (
          <circle cx={NODES[HOME][0] + 26} cy={NODES[HOME][1] - 18} r={11 + 3 * breathe} fill={C.rose} opacity={dotIn} style={{ filter: `drop-shadow(0 0 ${8 + 8 * breathe}px ${alpha(C.rose, 0.7)})` }} />
        ) : null}
      </svg>
      {dotIn > 0 ? (
        <div style={{ position: 'absolute', left: 20, top: 172, opacity: dotIn, padding: '2px 16px', borderRadius: RADIUS.pill, border: `2px solid ${alpha(C.rose, 0.7)}`, background: alpha(C.rose, 0.1), fontSize: 28, fontWeight: 800, color: C.roseSoft, whiteSpace: 'nowrap' }}>
          {NETWORK.year}
        </div>
      ) : null}

      {/* the reports and their copies */}
      {docsIn > 0 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: docsIn }}>
          <div style={{ position: 'absolute', left: STACK_X, top: 56, fontSize: 28, fontWeight: 750, color: C.text, whiteSpace: 'nowrap' }}>{NETWORK.reports}</div>
          <Page x={STACK_X + 6} y={PAGE.y + 6} lines={1} tone={C.cyan} />
          <Page x={STACK_X} y={PAGE.y} lines={1} tone={C.cyan} />
          {COPY_X.map((x, k) => {
            const start = reportsAt + k * COPY_F;
            const slide = progress(frame, start - 4, 10, EASE.out);
            if (slide <= 0) return null;
            return (
              <div key={x} style={{ opacity: slide }}>
                <Page x={mix(STACK_X, x, slide)} y={PAGE.y} lines={progress(frame, start + 4, COPY_F - 6, EASE.linear)} tone={C.rose} />
              </div>
            );
          })}
        </div>
      ) : null}
      {quiet > 0 ? (
        <div style={{ position: 'absolute', right: 18, top: 8, opacity: quiet, padding: '2px 16px', borderRadius: RADIUS.pill, border: `2px solid ${alpha(C.muted, 0.6)}`, background: alpha(C.ink800, 0.9), fontSize: 28, fontWeight: 800, color: C.text, whiteSpace: 'nowrap' }}>
          {NETWORK.quiet}
        </div>
      ) : null}
      <ToolsStrip show={progress(frame, toolsAt, 14)} />
    </VignetteFrame>
  );
}

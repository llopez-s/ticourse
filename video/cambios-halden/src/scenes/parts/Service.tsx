import { C, FONT, RADIUS, alpha } from '../../../../engine/src/theme/tokens';
import { Icon, clamp01, type IconName } from '../../../../engine/src/ui';

/** The diagram's own units; `width` scales it. */
export const HUB = { w: 1300, h: 420 } as const;

const BOX = { x: 0, y: 128, w: 420, h: 164 } as const;
const NODE_X = 590;
const NODE_W = HUB.w - NODE_X;
const NODES = [
  { y: 0, h: 112, tone: C.cyan, title: 'programa de las oficinas', sub: ['guarda ahí sus informes'] },
  { y: 134, h: 112, tone: C.cyan, title: 'programa de las oficinas', sub: ['guarda ahí sus informes'] },
  { y: 268, h: 152, tone: C.amber, title: 'programa antiguo', sub: ['solo entiende la versión anterior'] },
] as const;

function Bar({ w, h = 20, tone = C.muted, o = 0.5 }: { w: number; h?: number; tone?: string; o?: number }) {
  return <span style={{ display: 'block', width: w, height: h, borderRadius: h / 2, background: alpha(tone, o) }} />;
}

function Node({ y, h, tone, icon, title, sub, note, show, glow, mini }: {
  y: number;
  h: number;
  tone: string;
  icon: IconName;
  title: string;
  sub: readonly string[];
  note?: number;
  show: number;
  glow: number;
  mini: boolean;
}) {
  return (
    <div
      style={{
        position: 'absolute',
        left: NODE_X,
        top: y,
        width: NODE_W,
        height: h,
        boxSizing: 'border-box',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        gap: 20,
        borderRadius: RADIUS.lg,
        border: `3px solid ${alpha(tone, 0.4 + 0.5 * glow)}`,
        background: alpha(tone, 0.06 + 0.08 * glow),
        boxShadow: glow > 0.02 ? `0 0 ${Math.round(30 * glow)}px ${alpha(tone, 0.3 * glow)}` : undefined,
        opacity: show,
        transform: `translateX(${(1 - show) * 24}px)`,
      }}
    >
      <Icon name={icon} size={52} color={tone} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: mini ? 12 : 2, whiteSpace: 'nowrap' }}>
        {mini ? <Bar w={300} tone={tone} o={0.7} /> : <div style={{ fontSize: 34, fontWeight: 850, color: C.textStrong }}>{title}</div>}
        {sub.map((s) => (mini ? <Bar key={s} w={360} /> : <div key={s} style={{ fontSize: 30, fontWeight: 650, color: C.text }}>{s}</div>))}
        {note !== undefined && note > 0.01 ? (
          mini ? (
            <Bar w={260} tone={C.amber} o={0.5 * note} />
          ) : (
            <div style={{ fontSize: 28, fontWeight: 750, color: C.amber, opacity: note }}>se anota · para decidir qué hacer con él</div>
          )
        ) : null}
      </div>
    </div>
  );
}

/**
 * «Lo que toca»: the shared-folders service of the offices in a box (no host, no product) and what hangs from it — two
 * office programs that keep their reports there and, in amber, an old program that only understands the previous
 * version, noted «para decidir qué hacer con él». `mini` swaps the words for bars (s08's icon).
 */
export function ServiceHub({
  width = HUB.w,
  service = 1,
  hangs = 1,
  old = 1,
  note = 1,
  oldGlow = 0,
  mini = false,
}: {
  width?: number;
  service?: number;
  hangs?: number;
  old?: number;
  note?: number;
  oldGlow?: number;
  mini?: boolean;
}) {
  const k = width / HUB.w;
  const shows = [clamp01(hangs), clamp01(hangs), clamp01(old)];
  const sx = BOX.x + BOX.w;
  const sy = BOX.y + BOX.h / 2;
  return (
    <div style={{ position: 'relative', width, height: HUB.h * k }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: HUB.w, height: HUB.h, transform: `scale(${k})`, transformOrigin: '0 0', fontFamily: FONT.sans }}>
        <svg width={HUB.w} height={HUB.h} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
          {NODES.map((n, i) => {
            const ty = n.y + n.h / 2;
            const s = shows[i];
            if (s <= 0.01) return null;
            const d = `M ${sx} ${sy} C ${sx + 120} ${sy}, ${NODE_X - 120} ${ty}, ${NODE_X} ${ty}`;
            return (
              <path key={i} d={d} fill="none" stroke={alpha(n.tone, 0.65)} strokeWidth={4} strokeDasharray="420" strokeDashoffset={420 * (1 - s)} />
            );
          })}
        </svg>
        <div
          style={{
            position: 'absolute',
            left: BOX.x,
            top: BOX.y,
            width: BOX.w,
            height: BOX.h,
            boxSizing: 'border-box',
            padding: '0 26px',
            display: 'flex',
            alignItems: 'center',
            gap: 20,
            borderRadius: RADIUS.lg,
            border: `3px solid ${alpha(C.cyan, 0.85)}`,
            background: alpha(C.cyan, 0.1),
            boxShadow: `0 0 34px ${alpha(C.cyan, 0.22)}`,
            opacity: clamp01(service),
            transform: `scale(${0.94 + 0.06 * clamp01(service)})`,
          }}
        >
          <Icon name="archive" size={64} color={C.cyan} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: mini ? 14 : 0, whiteSpace: 'nowrap' }}>
            {mini ? <Bar w={260} h={24} tone={C.cyan} o={0.8} /> : <div style={{ fontSize: 38, fontWeight: 850, color: C.textStrong }}>carpetas</div>}
            {mini ? <Bar w={220} h={24} tone={C.cyan} o={0.8} /> : <div style={{ fontSize: 38, fontWeight: 850, color: C.textStrong }}>compartidas</div>}
            {mini ? <Bar w={180} /> : <div style={{ fontSize: 30, fontWeight: 650, color: C.cyanSoft }}>de las oficinas</div>}
          </div>
        </div>
        {NODES.map((n, i) => (
          <Node
            key={i}
            y={n.y}
            h={n.h}
            tone={n.tone}
            icon="app"
            title={n.title}
            sub={n.sub}
            note={i === 2 ? clamp01(note) : undefined}
            show={shows[i]}
            glow={i === 2 ? clamp01(oldGlow) : 0}
            mini={mini}
          />
        ))}
      </div>
    </div>
  );
}

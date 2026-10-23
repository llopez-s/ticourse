import type { ReactNode } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../engine/src/theme/tokens';
import { Icon, clamp01, type IconName } from '../../../../engine/src/ui';
import { CheckBox } from './Marks';
import { TermPill } from './Labels';

/** One box's own units; the row is three of them with GAP between. */
export const DOC = { w: 430, h: 460, gap: 20 } as const;
export const DOCS_W = DOC.w * 3 + DOC.gap * 2;

function Bar({ w, h = 18, tone = C.muted, o = 0.45 }: { w: number; h?: number; tone?: string; o?: number }) {
  return <span style={{ display: 'block', width: w, height: h, borderRadius: h / 2, background: alpha(tone, o) }} />;
}

/** A box's frame: icon + heading on top, a tick in the corner, lit by `on`. */
function Box({ icon, head, on, tick, bare, children }: { icon: IconName; head: readonly string[]; on: number; tick: number; bare: boolean; children: ReactNode }) {
  const o = clamp01(on);
  const tone = tick > 0.5 ? C.emerald : C.cyan;
  return (
    <div
      style={{
        position: 'relative',
        width: DOC.w,
        height: DOC.h,
        boxSizing: 'border-box',
        padding: '22px 24px',
        borderRadius: RADIUS.lg,
        border: `3px solid ${alpha(tone, 0.25 + 0.6 * o)}`,
        background: `linear-gradient(180deg, ${alpha(C.ink800, 0.6 + 0.4 * o)} 0%, ${alpha(C.ink850, 0.6 + 0.4 * o)} 100%)`,
        boxShadow: o > 0.02 ? `0 0 ${Math.round(34 * o)}px ${alpha(tone, 0.22 * o)}` : undefined,
        opacity: 0.4 + 0.6 * o,
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, minHeight: 80 }}>
        <Icon name={icon} size={44} color={tone} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: bare ? 12 : 0 }}>
          {head.map((h, i) => (bare ? <Bar key={h} w={[220, 160][i] ?? 160} h={22} tone={C.text} /> : <div key={h} style={{ fontSize: 34, fontWeight: 850, lineHeight: 1.12, color: C.textStrong, whiteSpace: 'nowrap' }}>{h}</div>))}
        </div>
      </div>
      {children}
      <div style={{ position: 'absolute', right: 18, top: 18 }}>{tick > 0.01 ? <CheckBox size={46} tick={tick} /> : null}</div>
    </div>
  );
}

/** The service diagram, the new server in its place (sky → emerald when it is lit). */
function Diagram({ server, bare }: { server: number; bare: boolean }) {
  const s = clamp01(server);
  const W = 382;
  const H = 230;
  const hub = { x: 120, y: 110 };
  const others = [
    { x: 30, y: 40 },
    { x: 30, y: 180 },
    { x: 230, y: 40 },
  ];
  const fresh = { x: 290, y: 150 };
  return (
    <div style={{ position: 'relative', width: W, height: H }}>
      <svg width={W} height={H} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        {others.map((n, i) => (
          <line key={i} x1={hub.x} y1={hub.y} x2={n.x} y2={n.y} stroke={alpha(C.muted, 0.55)} strokeWidth={4} />
        ))}
        <line x1={hub.x} y1={hub.y} x2={fresh.x} y2={fresh.y} stroke={alpha(C.emerald, 0.85)} strokeWidth={5} strokeDasharray={220} strokeDashoffset={220 * (1 - s)} />
        {others.map((n, i) => (
          <rect key={i} x={n.x - 24} y={n.y - 18} width={48} height={36} rx={8} fill={C.ink700} stroke={alpha(C.muted, 0.8)} strokeWidth={3} />
        ))}
        <rect x={hub.x - 34} y={hub.y - 26} width={68} height={52} rx={10} fill={alpha(C.cyan, 0.2)} stroke={C.cyan} strokeWidth={4} />
        <g opacity={s}>
          <rect x={fresh.x - 34} y={fresh.y - 26} width={68} height={52} rx={10} fill={alpha(C.emerald, 0.2)} stroke={C.emerald} strokeWidth={4} />
        </g>
      </svg>
      {!bare ? (
        <div style={{ position: 'absolute', left: fresh.x - 150, top: fresh.y + 34, width: 210, textAlign: 'right', fontSize: 28, fontWeight: 800, color: C.emerald, opacity: s, whiteSpace: 'nowrap' }}>
          servidor nuevo
        </div>
      ) : null}
    </div>
  );
}

/** The procedure step by step, the step that changed lit, then the SOP tag. */
function Procedure({ step, sop, bare }: { step: number; sop: number; bare: boolean }) {
  const s = clamp01(step);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {bare ? <Bar w={300} /> : <div style={{ fontSize: 27, fontWeight: 650, color: C.muted, lineHeight: 1.15 }}>cómo se pide acceso<br />a una carpeta</div>}
      {[0, 1, 2, 3].map((i) => {
        const hot = i === 2 ? s : 0;
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, height: 32 }}>
            <span style={{ width: 30, fontSize: 26, fontWeight: 850, color: hot > 0.5 ? C.amber : C.faint, fontFamily: FONT.mono }}>{i + 1}</span>
            <Bar w={[230, 180, 210, 160][i]} h={16} tone={hot > 0.01 ? C.amber : C.muted} o={0.4 + 0.5 * hot} />
            {i === 2 && !bare ? <span style={{ fontSize: 26, fontWeight: 800, color: C.amber, opacity: s, whiteSpace: 'nowrap' }}>cambió</span> : null}
          </div>
        );
      })}
      {sop > 0.01 ? (
        <div style={{ marginTop: 4, display: 'flex', alignItems: 'center', gap: 12, opacity: clamp01(sop) }}>
          {bare ? <Bar w={330} tone={C.violet} /> : <TermPill text="SOP" size={28} />}
          {bare ? null : <span style={{ fontSize: 26, fontWeight: 750, color: C.text, lineHeight: 1.15 }}>lo hace igual<br />quien lo haga</span>}
        </div>
      ) : null}
    </div>
  );
}

/** The saved version: a tag with the change, who changed what and when, and the way back. */
function Version({ tag, term, bare }: { tag: number; term: number; bare: boolean }) {
  const t = clamp01(tag);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ opacity: t, transform: `translateY(${(1 - t) * 12}px)`, padding: '14px 18px', borderRadius: RADIUS.md, border: `2px solid ${alpha(C.cyan, 0.6)}`, background: alpha(C.cyan, 0.08), display: 'flex', flexDirection: 'column', gap: bare ? 14 : 8 }}>
        {bare ? <Bar w={160} tone={C.cyan} o={0.8} /> : <div style={{ fontSize: 30, fontWeight: 850, color: C.cyanSoft }}>el cambio</div>}
        {bare ? <Bar w={300} /> : <div style={{ fontSize: 27, fontWeight: 700, color: C.text, lineHeight: 1.15 }}>quién cambió qué<br />y cuándo</div>}
        {bare ? <Bar w={250} /> : <div style={{ fontSize: 27, fontWeight: 700, color: C.text, lineHeight: 1.15 }}>volver a la anterior<br />si hace falta</div>}
      </div>
      {!bare && term > 0.01 ? <div style={{ opacity: clamp01(term) }}><TermPill text="version control" size={30} /></div> : null}
    </div>
  );
}

/**
 * «Lo que queda»: the three documents that must say what there is before the request is closed — the service diagram
 * (with the new server in its place), the procedure step by step (the step that changed, and the SOP tag) and the saved
 * version (version control). Each lights on its cue and takes a tick on `close`. `bare` drops every word (s07).
 */
export function DocBoxes({
  on = [1, 1, 1],
  tick = 0,
  server = 1,
  step = 1,
  sop = 1,
  tag = 1,
  term = 1,
  bare = false,
}: {
  on?: readonly [number, number, number];
  tick?: number;
  server?: number;
  step?: number;
  sop?: number;
  tag?: number;
  term?: number;
  bare?: boolean;
}) {
  return (
    <div style={{ display: 'flex', gap: DOC.gap, fontFamily: FONT.sans }}>
      <Box icon="network" head={['diagrama', 'de servicios']} on={on[0]} tick={tick} bare={bare}>
        <Diagram server={server} bare={bare} />
      </Box>
      <Box icon="file" head={['procedimiento', 'paso a paso']} on={on[1]} tick={tick} bare={bare}>
        <Procedure step={step} sop={sop} bare={bare} />
      </Box>
      <Box icon="archive" head={['versión', 'guardada']} on={on[2]} tick={tick} bare={bare}>
        <Version tag={tag} term={term} bare={bare} />
      </Box>
    </div>
  );
}

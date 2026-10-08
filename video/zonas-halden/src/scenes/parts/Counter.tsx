import { useId, type CSSProperties } from 'react';
import { useCurrentFrame } from 'remotion';
import { C, FONT, alpha } from '../../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../../engine/src/theme/motion';
import { clamp01, mix } from '../../../../engine/src/ui';

/**
 * «La ventanilla» = the DMZ (canon: out/scene-brief.md «Visual metaphors»):
 * the service window for shipping companies and hauliers, set into the port's
 * fence and seen from outside. Served from outside, NO door to the offices
 * behind (they peek over the fence), only a tray under the glass to pass
 * papers through, and someone behind it who looks at each one. Nobody crosses.
 *
 * Exported as `ServiceCounter` (the engine already has a numeric `Counter`).
 * Amber booth = the DMZ's colour («baja»); the person who checks is cyan (the
 * control). Animations are 0–1 weights the scene drives:
 *   - `paper`   a paper travels: outside (0) → into the tray (0.45) → under
 *               the glass (0.7) → held up by the person (1);
 *   - `inspect` the person bends over it, a scan line runs down the paper,
 *               then a small emerald tick (`checked`, default follows inspect);
 *   - `trayGlow`, `noDoor` (a dashed door, crossed out: there is none),
 *     `visitor` (a haulier in the foreground, from behind).
 * Design units COUNTER_BASE (600 × 420) scaled to `width`; `counterPoint()`
 * gives px anchors. Nothing is positioned and nothing reads the timeline
 * except the optional `at` pop-in.
 */

export const COUNTER_BASE = { w: 600, h: 420 } as const;

const A = {
  booth: { x: 300, y: 240 },
  sign: { x: 300, y: 122 },
  window: { x: 300, y: 228 },
  person: { x: 300, y: 214 },
  tray: { x: 300, y: 304 },
  outside: { x: 140, y: 318 },
  held: { x: 300, y: 262 },
  noDoor: { x: 444, y: 238 },
  ground: { x: 300, y: 380 },
} as const;

export type CounterPoint = keyof typeof A;

export function counterSize(width: number): { w: number; h: number; scale: number } {
  const s = width / COUNTER_BASE.w;
  return { w: width, h: COUNTER_BASE.h * s, scale: s };
}

/**
 * An anchor in px from the counter's top-left: 'booth' (centre), 'sign' (the
 * band over the window), 'window', 'person', 'tray', 'outside' (where the
 * paper starts), 'held' (where the person holds it), 'noDoor' (the crossed
 * door), 'ground'.
 */
export function counterPoint(width: number, which: CounterPoint): { x: number; y: number } {
  const s = width / COUNTER_BASE.w;
  return { x: A[which].x * s, y: A[which].y * s };
}

function useSvgId(prefix: string): string {
  return `${prefix}-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
}

const dropGlow = (color: string, g: number) => (g > 0.01 ? `drop-shadow(0 0 ${Math.round(4 + 16 * g)}px ${alpha(color, 0.55 * g)})` : '');
const joinFilters = (...f: string[]) => f.filter(Boolean).join(' ') || undefined;
const seg = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));

/** Paper pose along its trip (design units). */
function paperPose(p: number): { x: number; y: number; rot: number; sx: number; sy: number } {
  if (p <= 0.45) {
    const k = EASE.inOut(seg(p, 0, 0.45));
    return { x: mix(A.outside.x, A.tray.x, k), y: mix(A.outside.y, A.tray.y, k) - Math.sin(k * Math.PI) * 26, rot: mix(-14, 0, k), sx: mix(1, 0.92, k), sy: mix(1, 0.4, k) };
  }
  if (p <= 0.7) {
    const k = EASE.inOut(seg(p, 0.45, 0.7));
    return { x: A.tray.x, y: mix(A.tray.y, 290, k), rot: 0, sx: 0.92, sy: 0.4 };
  }
  const k = EASE.out(seg(p, 0.7, 1));
  return { x: A.tray.x, y: mix(290, A.held.y, k), rot: mix(0, -3, k), sx: mix(0.92, 0.82, k), sy: mix(0.4, 0.82, k) };
}

export function ServiceCounter({
  width,
  paper = 0,
  inspect = 0,
  checked,
  trayGlow = 0,
  noDoor = 0,
  visitor = 0,
  offices,
  person = 1,
  detail: detailProp,
  tone = C.amber,
  sign,
  glow = 0,
  dim = 0,
  at,
  frame: frameProp,
  style,
}: {
  /** Width in px (height = width × 0.7). Full ≈ 600–700, icon ≈ 120–180. */
  width: number;
  /** 0–1: a paper's trip from outside, through the tray, to the person (0 = no paper). */
  paper?: number;
  /** 0–1: the person checks the paper (bends over it, scan line). */
  inspect?: number;
  /** 0–1: the emerald tick on the checked paper (default: the last third of `inspect`). */
  checked?: number;
  /** 0–1: the tray lights up («solo una bandeja»). */
  trayGlow?: number;
  /** 0–1: a dashed door, crossed out, beside the booth («sin puerta a las oficinas»). */
  noDoor?: number;
  /** 0–1: a haulier in the foreground, seen from behind, handing the paper. */
  visitor?: number;
  /** The offices peeking over the fence behind (default: not at icon size). */
  offices?: boolean;
  /** 0–1: the person behind the glass. */
  person?: number;
  /** 'icon' thickens strokes and drops texture (default: icon below 260 px wide). */
  detail?: 'full' | 'icon';
  /** Booth accent (default amber: the DMZ's colour). */
  tone?: string;
  /** Optional text on the band over the window (full detail only; ≤ ~14 characters at 30 px). */
  sign?: string;
  glow?: number;
  dim?: number;
  /** Frame (Sequence-relative) the counter pops in; omitted = on screen. */
  at?: number;
  frame?: number;
  style?: CSSProperties;
}) {
  const id = useSvgId('ctr');
  const current = useCurrentFrame();
  const frame = frameProp ?? current;
  const s = width / COUNTER_BASE.w;
  const h = COUNTER_BASE.h * s;
  const icon = (detailProp ?? (width < 260 ? 'icon' : 'full')) === 'icon';
  const showOffices = offices ?? !icon;
  const pop = at === undefined ? 1 : progress(frame, at, 14, EASE.out);
  if (pop <= 0) return null;
  const sw = (base: number, minPx: number) => Math.max(base, minPx / s);
  const pp = clamp01(paper);
  const ins = clamp01(inspect);
  const ck = clamp01(checked ?? seg(ins, 0.66, 1));
  const tg = clamp01(trayGlow);
  const nd = clamp01(noDoor);
  const vis = icon ? 0 : clamp01(visitor);
  const pv = clamp01(person);
  const g = clamp01(glow);
  const d = clamp01(dim);
  const line = sw(3.2, icon ? 1.8 : 1.6);
  const thin = sw(2, icon ? 1.1 : 1);
  const fence = '#64748b';
  const crew = C.cyan;

  const pose = pp > 0.001 ? paperPose(pp) : null;
  const paperInside = pp > 0.45;

  const paperEl = pose ? (
    <g transform={`translate(${pose.x} ${pose.y}) rotate(${pose.rot}) scale(${pose.sx} ${pose.sy})`}>
      <rect x={-30} y={-38} width={60} height={76} rx={3} fill="#f1f5f9" stroke={alpha('#020617', 0.55)} strokeWidth={sw(1.6, 0.8)} />
      {!icon ? <path d="M -20 -24 L 20 -24 M -20 -12 L 16 -12 M -20 0 L 20 0 M -20 12 L 8 12" stroke="#94a3b8" strokeWidth={3} strokeLinecap="round" /> : null}
      {/* Scan line while it is checked */}
      {ins > 0.01 && ins < 0.7 && pp > 0.95 ? (
        <line x1={-34} x2={34} y1={-36 + 72 * seg(ins, 0.05, 0.66)} y2={-36 + 72 * seg(ins, 0.05, 0.66)} stroke={crew} strokeWidth={sw(4, 1.6)} strokeLinecap="round" />
      ) : null}
      {/* The tick */}
      {ck > 0.01 && pp > 0.95 ? (
        <g opacity={ck} transform={`translate(18 22) scale(${0.7 + 0.3 * ck})`}>
          <circle cx={0} cy={0} r={15} fill={C.emeraldDeep} stroke={C.emerald} strokeWidth={3} />
          <path d="M -7 0 L -2 5 L 7 -5" fill="none" stroke={C.emerald} strokeWidth={3.6} strokeLinecap="round" strokeLinejoin="round" />
        </g>
      ) : null}
    </g>
  ) : null;

  const posts = [8, 48, 88, 128, 168, 432, 472, 512, 552, 592];

  return (
    <div
      style={{
        position: 'relative',
        width,
        height: h,
        opacity: pop * (1 - 0.6 * d),
        transform: pop < 1 ? `translateY(${(1 - pop) * 14}px)` : undefined,
        filter: joinFilters(dropGlow(tone, g), d > 0.01 ? `saturate(${1 - 0.6 * d})` : ''),
        ...style,
      }}
    >
      <svg width={width} height={h} viewBox={`0 0 ${COUNTER_BASE.w} ${COUNTER_BASE.h}`} style={{ display: 'block', overflow: 'visible' }}>
        <defs>
          <linearGradient id={`${id}-glass`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={C.sky} stopOpacity={0.2} />
            <stop offset="1" stopColor={C.sky} stopOpacity={0.06} />
          </linearGradient>
          <clipPath id={`${id}-win`}>
            <rect x={214} y={160} width={172} height={138} rx={6} />
          </clipPath>
        </defs>

        {/* The offices behind (no way in from here) */}
        {showOffices ? (
          <g>
            <rect x={70} y={34} width={460} height={170} rx={6} fill={C.ink850} stroke="#334155" strokeWidth={line} />
            <rect x={60} y={26} width={480} height={14} rx={4} fill={C.ink700} />
            {Array.from({ length: 2 }, (_, r) =>
              Array.from({ length: 9 }, (_, c) => (
                <rect key={`${r}-${c}`} x={92 + c * 48} y={56 + r * 44} width={30} height={26} rx={3} fill={alpha(C.muted, (r + c) % 4 === 1 ? 0.3 : 0.16)} />
              )),
            )}
          </g>
        ) : null}

        {/* Fence: the counter is set into it */}
        <g stroke={fence} strokeLinecap="round" fill="none">
          <path d="M 0 204 L 190 204 M 0 368 L 190 368 M 410 204 L 600 204 M 410 368 L 600 368" strokeWidth={thin} />
          {!icon ? (
            <path
              d={Array.from({ length: 14 }, (_, i) => `M ${i * 14} 204 L ${i * 14 + 160} 368`).join(' ') + ' ' + Array.from({ length: 14 }, (_, i) => `M ${416 + i * 14} 204 L ${416 + i * 14 - 160} 368`).join(' ')}
              strokeWidth={sw(1.2, 0.7)}
              opacity={0.28}
              clipPath={`url(#${id}-fenceclip)`}
            />
          ) : null}
          {posts.map((x) => (
            <line key={x} x1={x} y1={380} x2={x} y2={194} strokeWidth={line} />
          ))}
        </g>
        <defs>
          <clipPath id={`${id}-fenceclip`}>
            <rect x={0} y={204} width={190} height={164} />
            <rect x={410} y={204} width={190} height={164} />
          </clipPath>
        </defs>
        <line x1={0} y1={381} x2={600} y2={381} stroke="#334155" strokeWidth={line} />

        {/* Booth */}
        <rect x={188} y={104} width={224} height={278} rx={8} fill={C.ink800} stroke={alpha(tone, 0.85)} strokeWidth={line} />
        <rect x={188} y={104} width={224} height={38} rx={8} fill={alpha(tone, 0.24)} stroke={alpha(tone, 0.85)} strokeWidth={line} />
        {sign && !icon ? (
          <text x={300} y={131} textAnchor="middle" fontFamily={FONT.sans} fontSize={26} fontWeight={800} fill="#fde68a" letterSpacing={0.5}>
            {sign}
          </text>
        ) : null}
        {/* Window: interior, the person, a paper inside, then the glass */}
        <rect x={214} y={160} width={172} height={138} rx={6} fill="#050a14" />
        {pv > 0.01 ? (
          <g clipPath={`url(#${id}-win)`} opacity={pv}>
            <g transform={`translate(0 ${6 * ins}) rotate(${-7 * ins} 300 300)`}>
              <path d="M 246 300 Q 248 250 300 246 Q 352 250 354 300 Z" fill={alpha(crew, 0.22)} stroke={crew} strokeWidth={sw(3, 1.4)} />
              <circle cx={300} cy={212} r={23} fill={alpha(crew, 0.22)} stroke={crew} strokeWidth={sw(3, 1.4)} />
            </g>
          </g>
        ) : null}
        {paperInside ? <g clipPath={`url(#${id}-win)`}>{paperEl}</g> : null}
        <rect x={214} y={160} width={172} height={138} rx={6} fill={`url(#${id}-glass)`} stroke="#94a3b8" strokeWidth={thin} />
        {!icon ? (
          <g stroke={alpha('#ffffff', 0.12)} strokeWidth={6} strokeLinecap="round">
            <line x1={232} y1={250} x2={276} y2={176} />
            <line x1={248} y1={262} x2={300} y2={176} />
          </g>
        ) : null}
        {/* Speaking holes */}
        {!icon ? (
          <g fill={alpha('#cbd5e1', 0.5)}>
            {[-12, 0, 12].map((dx) => [-8, 4].map((dy) => <circle key={`${dx}${dy}`} cx={300 + dx} cy={180 + dy} r={2.2} />))}
          </g>
        ) : null}

        {/* Counter ledge and the tray under the glass */}
        <rect x={196} y={296} width={208} height={12} rx={3} fill="#2b3a55" stroke={alpha(tone, 0.6)} strokeWidth={thin} />
        <rect x={192} y={306} width={216} height={12} rx={3} fill={C.ink700} stroke={alpha(tone, 0.6)} strokeWidth={thin} />
        {tg > 0.01 ? <rect x={240} y={286} width={120} height={36} rx={10} fill={alpha(tone, 0.3 * tg)} /> : null}
        <rect x={254} y={293} width={92} height={14} rx={5} fill="#020617" stroke={tg > 0.01 ? alpha(tone, 0.5 + 0.5 * tg) : '#64748b'} strokeWidth={sw(2 + 1.5 * tg, 1)} />

        {/* The paper on its way in (in front of the glass) */}
        {pose && !paperInside ? paperEl : null}

        {/* No door: a dashed door, crossed out */}
        {nd > 0.01 ? (
          <g opacity={nd} transform={`translate(${A.noDoor.x - 30} ${A.noDoor.y - 50})`}>
            <rect x={0} y={0} width={60} height={100} rx={6} fill={alpha(C.ink900, 0.85)} stroke={C.roseSoft} strokeWidth={sw(3, 1.4)} strokeDasharray="9 7" />
            <circle cx={46} cy={54} r={4} fill={C.roseSoft} />
            <path d="M -8 -8 L 68 108 M 68 -8 L -8 108" stroke={C.rose} strokeWidth={sw(6, 2)} strokeLinecap="round" />
          </g>
        ) : null}

        {/* A haulier in the foreground, from behind */}
        {vis > 0.01 ? (
          <g opacity={vis} transform={`translate(0 ${(1 - vis) * 20})`}>
            <path d="M 52 420 Q 54 352 112 346 Q 170 352 172 420 Z" fill={C.ink700} stroke="#94a3b8" strokeWidth={line} />
            <circle cx={112} cy={318} r={30} fill={C.ink700} stroke="#94a3b8" strokeWidth={line} />
            {pp < 0.12 ? <path d="M 160 366 Q 170 346 150 330" fill="none" stroke="#94a3b8" strokeWidth={sw(10, 3)} strokeLinecap="round" /> : null}
          </g>
        ) : null}
      </svg>
    </div>
  );
}

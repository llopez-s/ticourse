import { C, FONT, alpha } from '../../../../engine/src/theme/tokens';
import { Icon, clamp01, mix } from '../../../../engine/src/ui';
import { SITE_LABEL } from '../../data/canon';
import { CheckBox } from './Marks';
import { Pill } from './Labels';

/** The image's own units; `width` scales it. */
export const SITE = { w: 840, h: 470 } as const;

const GROUND = 410;
const CLIP = { x: 140, y: 120, w: 280, h: 280 } as const;
const DOOR = { x: 456, y: 150, w: 150, h: GROUND - 150 } as const;
const BOSS_X = 64;
const TRUST_X = 715;
const PLUMB_FROM = 800;
const PLUMB_TO = DOOR.x + DOOR.w / 2;

/** A plain silhouette standing on the ground, centred on `x`. */
function Person({ x, tone, h = 130, o = 1 }: { x: number; tone: string; h?: number; o?: number }) {
  const r = h * 0.15;
  const top = GROUND - h;
  return (
    <g opacity={o}>
      <circle cx={x} cy={top + r} r={r} fill={alpha(tone, 0.9)} />
      <path
        d={`M ${x - h * 0.24} ${GROUND} L ${x - h * 0.24} ${top + h * 0.5} Q ${x - h * 0.24} ${top + h * 0.36} ${x - h * 0.1} ${top + h * 0.36} L ${x + h * 0.1} ${top + h * 0.36} Q ${x + h * 0.24} ${top + h * 0.36} ${x + h * 0.24} ${top + h * 0.5} L ${x + h * 0.24} ${GROUND} Z`}
        fill={alpha(tone, 0.75)}
      />
    </g>
  );
}

function Tag({ x, y, children, color, size = 30, o = 1 }: { x: number; y: number; children: string; color: string; size?: number; o?: number }) {
  return (
    <div style={{ position: 'absolute', left: x - 200, top: y, width: 400, textAlign: 'center', fontSize: size, fontWeight: 800, color, whiteSpace: 'nowrap', opacity: o }}>
      {children}
    </div>
  );
}

/**
 * The site list («imagen · no es del puerto»): the foreman next to his list at the door. Whoever is on it goes in;
 * someone «de confianza» who is not on it is stopped; today's plumber is put on the list — that plumber and nobody else
 * from his firm — and walks through. No fence, gatehouse or helmet. `bare` drops every word (question background).
 */
export function SiteList({
  width = SITE.w,
  base = 1,
  trusted = 1,
  blocked = 1,
  plumber = 1,
  walk = 1,
  firm = 1,
  bare = false,
}: {
  width?: number;
  base?: number;
  trusted?: number;
  blocked?: number;
  plumber?: number;
  walk?: number;
  firm?: number;
  bare?: boolean;
}) {
  const k = width / SITE.w;
  const b = clamp01(base);
  const tr = clamp01(trusted);
  const bl = clamp01(blocked);
  const pl = clamp01(plumber);
  const wk = clamp01(walk);
  const fm = clamp01(firm);
  const px = mix(PLUMB_FROM, PLUMB_TO, wk);
  const pIn = pl * (1 - clamp01((wk - 0.85) / 0.15) * 0.75);
  const rows = [150, 200, 250];
  return (
    <div style={{ position: 'relative', width, height: SITE.h * k }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: SITE.w, height: SITE.h, transform: `scale(${k})`, transformOrigin: '0 0', fontFamily: FONT.sans }}>
        {!bare ? (
          <div style={{ position: 'absolute', left: 0, top: 0, opacity: b }}>
            <Pill text={SITE_LABEL} tone={C.sky} icon="eye" size={28} height={48} on={0.3} color={C.text} />
          </div>
        ) : null}
        <svg width={SITE.w} height={SITE.h} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: b }}>
          <line x1={0} y1={GROUND} x2={SITE.w} y2={GROUND} stroke={alpha(C.muted, 0.5)} strokeWidth={3} />
          {/* the door: frame, dark opening, the leaf swung open */}
          <rect x={DOOR.x} y={DOOR.y} width={DOOR.w} height={DOOR.h} fill={alpha(C.ink950, 0.9)} stroke={alpha(C.sky, 0.8)} strokeWidth={5} />
          <path d={`M ${DOOR.x + DOOR.w} ${DOOR.y} L ${DOOR.x + DOOR.w + 46} ${DOOR.y + 22} L ${DOOR.x + DOOR.w + 46} ${GROUND - 8} L ${DOOR.x + DOOR.w} ${GROUND}`} fill={alpha(C.sky, 0.12)} stroke={alpha(C.sky, 0.6)} strokeWidth={3} />
          {/* the clipboard on the wall */}
          <rect x={CLIP.x} y={CLIP.y} width={CLIP.w} height={CLIP.h} rx={16} fill={alpha(C.ink800, 0.95)} stroke={alpha(C.text, 0.55)} strokeWidth={3} />
          <rect x={CLIP.x + CLIP.w / 2 - 50} y={CLIP.y - 14} width={100} height={30} rx={8} fill={alpha(C.muted, 0.8)} />
          {rows.map((y, i) => (
            <rect key={y} x={CLIP.x + 26} y={y + 6} width={[190, 150, 170][i]} height={16} rx={8} fill={alpha(C.muted, 0.4)} />
          ))}
          <Person x={BOSS_X} tone={C.cyan} h={150} />
          {tr > 0.01 ? <Person x={TRUST_X} tone={bl > 0.5 ? C.rose : C.text} o={tr} /> : null}
          {pl > 0.01 ? <Person x={px} tone={C.emerald} o={pIn} /> : null}
        </svg>
        {/* the plumber's line on the list, and «su empresa» struck under it */}
        <div style={{ position: 'absolute', left: CLIP.x + 22, top: 290, display: 'flex', alignItems: 'center', gap: 12, opacity: pl }}>
          <CheckBox size={32} tick={pl} />
          {bare ? (
            <span style={{ display: 'block', width: 150, height: 16, borderRadius: 8, background: alpha(C.emerald, 0.7) }} />
          ) : (
            <span style={{ fontSize: 30, fontWeight: 800, color: C.emerald }}>fontanero</span>
          )}
        </div>
        {!bare && fm > 0.01 ? (
          <div style={{ position: 'absolute', left: CLIP.x + 66, top: 340, opacity: fm, fontSize: 28, fontWeight: 700, color: C.muted, whiteSpace: 'nowrap' }}>
            <span style={{ position: 'relative' }}>
              su empresa
              <span style={{ position: 'absolute', left: -4, right: -4, top: '55%', height: 4, background: C.rose, borderRadius: 2 }} />
            </span>
          </div>
        ) : null}
        {/* the trusted person is stopped */}
        {bl > 0.01 ? (
          <div style={{ position: 'absolute', left: TRUST_X - 30, top: GROUND - 220, opacity: bl, transform: `scale(${0.8 + 0.2 * bl})` }}>
            <Icon name="x" size={60} color={C.rose} strokeWidth={2.4} />
          </div>
        ) : null}
        {!bare ? (
          <>
            <Tag x={BOSS_X + 30} y={GROUND + 12} color={C.cyanSoft} o={b}>
              capataz
            </Tag>
            <Tag x={TRUST_X} y={GROUND - 340} color={C.roseSoft} o={bl}>
              de confianza
            </Tag>
            <Tag x={TRUST_X} y={GROUND - 302} color={C.text} size={28} o={bl}>
              no figura · no pasa
            </Tag>
            <Tag x={px} y={GROUND + 12} color={C.emerald} o={pl * (1 - 0.6 * wk)}>
              fontanero
            </Tag>
          </>
        ) : null}
      </div>
    </div>
  );
}

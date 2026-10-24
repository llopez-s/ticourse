import type { ReactNode } from 'react';
import { C, FONT, alpha } from '../../../../engine/src/theme/tokens';
import { clamp01, Icon } from '../../../../engine/src/ui';
import { Person } from './Person';

/** Every vignette is drawn in a 540×300 box (the triptych panel's art slot). `t` 0–1 runs its small animation. */
export const ART = { w: 540, h: 300 } as const;

function Box({ children }: { children: ReactNode }) {
  return <div style={{ position: 'relative', width: ART.w, height: ART.h }}>{children}</div>;
}

function Svg({ children }: { children: ReactNode }) {
  return (
    <svg width={ART.w} height={ART.h} viewBox={`0 0 ${ART.w} ${ART.h}`} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
      {children}
    </svg>
  );
}

/** A round badge with an icon, centred at (cx, cy). */
function Badge({ cx, cy, icon, tone, show = 1, r = 22 }: { cx: number; cy: number; icon: 'check' | 'lock' | 'x' | 'alert'; tone: string; show?: number; r?: number }) {
  const s = clamp01(show);
  if (s <= 0.01) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: cx - r,
        top: cy - r,
        width: 2 * r,
        height: 2 * r,
        borderRadius: r,
        display: 'grid',
        placeItems: 'center',
        background: C.ink900,
        border: `3px solid ${alpha(tone, 0.9)}`,
        opacity: s,
        transform: `scale(${0.6 + 0.4 * s})`,
      }}
    >
      <Icon name={icon} size={Math.round(r * 1.1)} color={tone} strokeWidth={2.6} />
    </div>
  );
}

/** A small photo frame with a mountain and a sun. */
function Photo({ x, y, w = 64, h = 46, tone = C.sky, o = 1 }: { x: number; y: number; w?: number; h?: number; tone?: string; o?: number }) {
  return (
    <g opacity={o}>
      <rect x={x} y={y} width={w} height={h} rx={6} fill={alpha(tone, 0.1)} stroke={alpha(tone, 0.7)} strokeWidth={3} />
      <path d={`M${x + 6} ${y + h - 6} L${x + w * 0.38} ${y + h * 0.42} L${x + w * 0.58} ${y + h * 0.68} L${x + w * 0.72} ${y + h * 0.5} L${x + w - 6} ${y + h - 6} Z`} fill={alpha(tone, 0.25)} />
      <circle cx={x + w * 0.76} cy={y + h * 0.27} r={h * 0.1} fill={alpha(C.amber, 0.7)} />
    </g>
  );
}

/** A squiggle standing for handwriting or text (never legible). */
function Scribble({ x, y, w, tone, o = 1, sw = 3.5 }: { x: number; y: number; w: number; tone: string; o?: number; sw?: number }) {
  const n = Math.max(2, Math.round(w / 22));
  let d = `M${x} ${y}`;
  for (let i = 0; i < n; i++) d += ` q ${w / n / 4} ${i % 2 ? 9 : -9} ${w / n / 2} 0 t ${w / n / 2} 0`;
  return <path d={d} fill="none" stroke={alpha(tone, 0.85)} strokeWidth={sw} strokeLinecap="round" opacity={o} />;
}

/* ───────────────────────────── the grandmother's album (s02) ───────────────────────────── */

/** The open album: two pages, two rows of two photos each. */
function Album({ tone }: { tone: string }) {
  return (
    <>
      <rect x={196} y={148} width={334} height={142} rx={14} fill={C.ink850} stroke={alpha(tone, 0.75)} strokeWidth={4} />
      <path d="M363 150 V288" stroke={alpha(tone, 0.45)} strokeWidth={3} />
      {[214, 288].map((x) => [164, 226].map((y) => <Photo key={`${x}${y}`} x={x} y={y} tone={tone} />))}
      {[380, 454].map((x) => [164, 226].map((y) => <Photo key={`${x}${y}`} x={x} y={y} tone={tone} />))}
    </>
  );
}

/** The grandmother decides which photos leave the house: one gets a tick, one stays locked. */
export function AlbumOwner({ t }: { t: number }) {
  return (
    <Box>
      <Svg>
        <Album tone={C.cyan} />
        <path d="M118 176 Q166 176 214 214" fill="none" stroke={alpha(C.cyan, 0.9)} strokeWidth={9} strokeLinecap="round" />
        <circle cx={218} cy={218} r={11} fill={C.ink800} stroke={alpha(C.cyan, 0.9)} strokeWidth={4} />
      </Svg>
      <Person kind="grandma" tone={C.cyan} x={0} y={26} height={270} />
      <Badge cx={486} cy={164} icon="check" tone={C.emerald} show={t} />
      <Badge cx={246} cy={272} icon="lock" tone={C.sky} show={clamp01(t * 1.6 - 0.5)} />
    </Box>
  );
}

/** The grandson scans a photo, keeps the copy and puts a password on it. */
export function AlbumCustodian({ t }: { t: number }) {
  const beam = 196 + 62 * (0.5 - 0.5 * Math.cos(Math.PI * 2 * clamp01(t * 1.2)));
  const dots = Math.round(clamp01(t * 1.5 - 0.2) * 4);
  return (
    <Box>
      <Svg>
        <path d="M200 240 H392 L372 190 H220 Z" fill={alpha(C.sky, 0.1)} stroke={alpha(C.sky, 0.8)} strokeWidth={4} strokeLinejoin="round" />
        <rect x={196} y={240} width={200} height={42} rx={10} fill={C.ink850} stroke={alpha(C.sky, 0.8)} strokeWidth={4} />
        <Photo x={248} y={202} w={96} h={30} tone={C.sky} />
        <path d={`M212 ${beam > 244 ? 244 : beam}  H380`} stroke={alpha(C.cyan, 0.9)} strokeWidth={5} strokeLinecap="round" opacity={0.2 + 0.8 * clamp01(t * 3)} />
        <path d="M398 232 H430" stroke={alpha(C.sky, 0.8)} strokeWidth={5} strokeLinecap="round" strokeDasharray="8 8" />
        <path d="M444 122 H488 L508 142 V210 H444 Z" fill={C.ink850} stroke={alpha(C.sky, 0.85)} strokeWidth={4} strokeLinejoin="round" />
        <Photo x={452} y={150} w={48} h={34} tone={C.sky} o={clamp01(t * 2 - 0.3)} />
        <rect x={420} y={248} width={112} height={40} rx={10} fill={C.ink850} stroke={alpha(C.sky, 0.7)} strokeWidth={3} />
        {[0, 1, 2, 3].map((i) => (
          <circle key={i} cx={440 + i * 24} cy={268} r={7} fill={i < dots ? C.sky : alpha(C.muted, 0.3)} />
        ))}
      </Svg>
      <Person kind="kid" tone={C.sky} x={0} y={26} height={270} />
      <Badge cx={488} cy={206} icon="lock" tone={C.sky} show={clamp01(t * 2 - 0.9)} r={20} />
    </Box>
  );
}

/** The aunt writes on the back of a photo who is in it and in which year (squiggles, nothing legible). */
export function AlbumSteward({ t }: { t: number }) {
  const w = (from: number, to: number) => clamp01((t - from) / (to - from));
  return (
    <Box>
      <Svg>
        <rect x={226} y={60} width={220} height={190} rx={12} fill={C.ink850} stroke={alpha(C.emerald, 0.8)} strokeWidth={4} />
        <path d="M244 112 H428 M244 196 H428" stroke={alpha(C.muted, 0.18)} strokeWidth={2} />
        <g opacity={0.35 + 0.65 * w(0, 0.4)}>
          <Scribble x={300} y={96} w={w(0, 0.5) * 120} tone={C.emerald} />
        </g>
        <g opacity={0.35 + 0.65 * w(0.4, 0.8)}>
          <Scribble x={300} y={168} w={w(0.4, 0.9) * 90} tone={C.emerald} />
        </g>
        <g transform={`translate(${430 - 30 * w(0, 1)} ${64 + 38 * w(0, 1)}) rotate(-38)`}>
          <rect x={-6} y={0} width={14} height={92} rx={3} fill={alpha(C.amber, 0.85)} />
          <path d="M-6 92 L1 112 L8 92 Z" fill={C.text} />
        </g>
        <path d="M118 176 Q170 170 226 188" fill="none" stroke={alpha(C.emerald, 0.9)} strokeWidth={9} strokeLinecap="round" />
      </Svg>
      <div style={{ position: 'absolute', left: 250, top: 74, opacity: 0.5 + 0.5 * w(0, 0.2) }}>
        <Icon name="users" size={38} color={C.emerald} strokeWidth={2.2} />
      </div>
      <div style={{ position: 'absolute', left: 250, top: 148, opacity: 0.5 + 0.5 * w(0.4, 0.6) }}>
        <Icon name="clock" size={38} color={C.emerald} strokeWidth={2.2} />
      </div>
      <Person kind="aunt" tone={C.emerald} x={0} y={26} height={270} />
    </Box>
  );
}

/* ───────────────────────────── the removal van (s04) ───────────────────────────── */

function Carton({ x, y, w = 70, h = 56, tone = C.amber, o = 1 }: { x: number; y: number; w?: number; h?: number; tone?: string; o?: number }) {
  return (
    <g opacity={o}>
      <rect x={x} y={y} width={w} height={h} rx={5} fill={alpha(tone, 0.14)} stroke={alpha(tone, 0.8)} strokeWidth={3.5} />
      <path d={`M${x + w * 0.35} ${y} V${y + h * 0.3} H${x + w * 0.65} V${y}`} fill="none" stroke={alpha(tone, 0.6)} strokeWidth={3} />
    </g>
  );
}

/** You decide what goes: three boxes, each ticked as the voice says «qué se lleva». */
export function MoveController({ t }: { t: number }) {
  return (
    <Box>
      <Svg>
        <Carton x={216} y={226} w={92} h={64} />
        <Carton x={322} y={226} w={92} h={64} />
        <Carton x={268} y={156} w={92} h={64} />
        <Carton x={430} y={226} w={92} h={64} />
        <path d="M118 176 Q170 150 262 176" fill="none" stroke={alpha(C.cyan, 0.9)} strokeWidth={9} strokeLinecap="round" />
      </Svg>
      <Person kind="you" tone={C.cyan} x={0} y={26} height={270} />
      <Badge cx={262} cy={226} icon="check" tone={C.emerald} show={clamp01(t * 3)} r={20} />
      <Badge cx={368} cy={226} icon="check" tone={C.emerald} show={clamp01(t * 3 - 0.8)} r={20} />
      <Badge cx={314} cy={156} icon="check" tone={C.emerald} show={clamp01(t * 3 - 1.6)} r={20} />
    </Box>
  );
}

/** The removal firm loads the van as it is told: the boxes slide in, an instruction note above. */
export function MoveProcessor({ t }: { t: number }) {
  const slide = (i: number) => clamp01(t * 3 - i * 0.7);
  return (
    <Box>
      <Svg>
        <rect x={190} y={116} width={236} height={140} rx={10} fill={C.ink850} stroke={alpha(C.sky, 0.8)} strokeWidth={4} />
        <path d="M426 160 H478 L512 204 V256 H426 Z" fill={C.ink850} stroke={alpha(C.sky, 0.8)} strokeWidth={4} strokeLinejoin="round" />
        <path d="M444 172 H470 L494 202 H444 Z" fill={alpha(C.sky, 0.15)} stroke={alpha(C.sky, 0.6)} strokeWidth={3} />
        {[0, 1, 2].map((i) => {
          const s = slide(i);
          return <Carton key={i} x={206 + i * 70 - (1 - s) * 90} y={196} w={58} h={46} o={s} />;
        })}
        <circle cx={250} cy={262} r={24} fill={C.ink800} stroke={alpha(C.sky, 0.9)} strokeWidth={5} />
        <circle cx={466} cy={262} r={24} fill={C.ink800} stroke={alpha(C.sky, 0.9)} strokeWidth={5} />
        <path d="M118 176 Q150 150 190 176" fill="none" stroke={alpha(C.sky, 0.9)} strokeWidth={9} strokeLinecap="round" />
        <rect x={190} y={34} width={104} height={62} rx={14} fill={alpha(C.cyan, 0.1)} stroke={alpha(C.cyan, 0.7)} strokeWidth={3} strokeDasharray="8 7" />
        <path d="M160 96 L190 76" stroke={alpha(C.cyan, 0.7)} strokeWidth={3} strokeDasharray="8 7" />
      </Svg>
      <div style={{ position: 'absolute', left: 190, top: 34, width: 104, height: 62, display: 'grid', placeItems: 'center' }}>
        <Icon name="file" size={40} color={C.cyan} strokeWidth={2.2} />
      </div>
      <Person kind="mover" tone={C.sky} x={0} y={26} height={270} />
    </Box>
  );
}

/** The sofa the firm keeps to sell: price tag, coin, and the sofa left outside the van. */
export function MoveOwnPurpose({ t }: { t: number }) {
  const s = clamp01(t * 2);
  return (
    <Box>
      <Svg>
        <path d="M216 150 Q216 112 254 112 H420 Q458 112 458 150 V190 H216 Z" fill={alpha(C.amber, 0.1)} stroke={alpha(C.amber, 0.85)} strokeWidth={4.5} strokeLinejoin="round" />
        <rect x={190} y={186} width={294} height={54} rx={20} fill={alpha(C.amber, 0.14)} stroke={alpha(C.amber, 0.85)} strokeWidth={4.5} />
        <rect x={190} y={142} width={44} height={98} rx={20} fill={alpha(C.amber, 0.18)} stroke={alpha(C.amber, 0.85)} strokeWidth={4.5} />
        <rect x={440} y={142} width={44} height={98} rx={20} fill={alpha(C.amber, 0.18)} stroke={alpha(C.amber, 0.85)} strokeWidth={4.5} />
        <path d="M222 240 V262 M452 240 V262" stroke={alpha(C.amber, 0.85)} strokeWidth={7} strokeLinecap="round" />
        <g opacity={s} transform={`translate(0 ${(1 - s) * -14})`}>
          <path d="M392 30 H470 L504 62 L470 94 H392 Z" fill={C.ink850} stroke={alpha(C.amber, 0.95)} strokeWidth={4} strokeLinejoin="round" />
          <circle cx={412} cy={62} r={7} fill={alpha(C.amber, 0.9)} />
          <circle cx={456} cy={62} r={16} fill="none" stroke={alpha(C.amber, 0.9)} strokeWidth={4} />
          <path d="M456 54 V70" stroke={alpha(C.amber, 0.9)} strokeWidth={4} strokeLinecap="round" />
          <path d="M446 112 L430 94" stroke={alpha(C.amber, 0.8)} strokeWidth={3} strokeDasharray="6 6" />
        </g>
        <path d="M118 176 Q150 170 190 200" fill="none" stroke={alpha(C.sky, 0.9)} strokeWidth={9} strokeLinecap="round" />
      </Svg>
      <Person kind="mover" tone={C.sky} x={0} y={26} height={270} />
    </Box>
  );
}

/* ───────────────────────────── the neighbourhood club (s06) ───────────────────────────── */

/** The board of the club: a table with five seats and the accounts, ticked. */
export function ClubBoard({ t }: { t: number }) {
  return (
    <Box>
      <Svg>
        <rect x={170} y={130} width={200} height={110} rx={22} fill={alpha(C.cyan, 0.08)} stroke={alpha(C.cyan, 0.8)} strokeWidth={4.5} />
        {[0, 1, 2].map((i) => (
          <circle key={`a${i}`} cx={210 + i * 60} cy={104} r={22} fill={C.ink800} stroke={alpha(C.cyan, 0.85)} strokeWidth={4} />
        ))}
        {[0, 1, 2].map((i) => (
          <circle key={`b${i}`} cx={210 + i * 60} cy={266} r={22} fill={C.ink800} stroke={alpha(C.cyan, 0.85)} strokeWidth={4} />
        ))}
        <rect x={396} y={80} width={124} height={170} rx={12} fill={C.ink850} stroke={alpha(C.cyan, 0.75)} strokeWidth={4} />
        {[0, 1, 2, 3].map((i) => (
          <g key={i}>
            <rect x={414} y={104 + i * 34} width={60} height={9} rx={4.5} fill={alpha(C.muted, 0.3)} />
            <rect x={482} y={104 + i * 34} width={22} height={9} rx={4.5} fill={alpha(C.muted, 0.2)} />
          </g>
        ))}
      </Svg>
      <Badge cx={500} cy={236} icon="check" tone={C.emerald} show={clamp01(t * 2)} r={24} />
    </Box>
  );
}

/** The party committee: bunting and a note it sends up to the board's table. */
export function ClubCommittee({ t }: { t: number }) {
  const flags = [C.amber, C.cyan, C.sky, C.emerald, C.amber, C.cyan, C.sky];
  const go = clamp01(t * 1.5);
  return (
    <Box>
      <Svg>
        <path d="M30 30 Q270 130 510 30" fill="none" stroke={alpha(C.muted, 0.6)} strokeWidth={4} />
        {flags.map((c, i) => {
          const x = 70 + i * 63;
          const y = 30 + 100 * (1 - Math.pow((x - 270) / 240, 2)) * 0.6 + 6;
          return <path key={i} d={`M${x - 20} ${y} L${x + 20} ${y} L${x} ${y + 44} Z`} fill={alpha(c, 0.3)} stroke={alpha(c, 0.9)} strokeWidth={3.5} strokeLinejoin="round" />;
        })}
        <rect x={96} y={168} width={108} height={96} rx={10} fill={C.ink850} stroke={alpha(C.sky, 0.8)} strokeWidth={4} />
        {[0, 1, 2].map((i) => (
          <rect key={i} x={114} y={188 + i * 24} width={i === 2 ? 44 : 72} height={9} rx={4.5} fill={alpha(C.muted, 0.32)} />
        ))}
        <path d="M214 216 H300" stroke={alpha(C.cyan, 0.9)} strokeWidth={5} strokeLinecap="round" strokeDasharray="10 9" opacity={go} />
        <path d="M296 204 L314 216 L296 228" fill="none" stroke={alpha(C.cyan, 0.9)} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" opacity={go} />
        <rect x={326} y={176} width={176} height={80} rx={18} fill={alpha(C.cyan, 0.08)} stroke={alpha(C.cyan, 0.7)} strokeWidth={4} strokeDasharray="10 8" />
        {[0, 1, 2].map((i) => (
          <circle key={i} cx={366 + i * 48} cy={170} r={14} fill={C.ink800} stroke={alpha(C.cyan, 0.7)} strokeWidth={3.5} />
        ))}
      </Svg>
    </Box>
  );
}

/** The town hall gives the club's licence: façade with a clock and a sheet with a seal. */
export function ClubTownHall({ t }: { t: number }) {
  const s = clamp01(t * 2);
  return (
    <Box>
      <Svg>
        <path d="M130 130 L254 52 L378 130 Z" fill={alpha(C.sky, 0.1)} stroke={alpha(C.sky, 0.85)} strokeWidth={4.5} strokeLinejoin="round" />
        <circle cx={254} cy={102} r={17} fill={C.ink850} stroke={alpha(C.sky, 0.9)} strokeWidth={3.5} />
        <path d="M254 92 V102 L262 108" fill="none" stroke={alpha(C.sky, 0.9)} strokeWidth={3} strokeLinecap="round" />
        <rect x={140} y={136} width={228} height={134} fill={C.ink850} stroke={alpha(C.sky, 0.85)} strokeWidth={4.5} />
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x={158 + i * 52} y={146} width={20} height={104} rx={4} fill={alpha(C.sky, 0.18)} stroke={alpha(C.sky, 0.6)} strokeWidth={3} />
        ))}
        <rect x={120} y={266} width={268} height={14} rx={4} fill={alpha(C.sky, 0.25)} stroke={alpha(C.sky, 0.8)} strokeWidth={3} />
        <path d="M384 200 H416" stroke={alpha(C.emerald, 0.9)} strokeWidth={5} strokeLinecap="round" strokeDasharray="8 8" opacity={s} />
        <g opacity={0.35 + 0.65 * s}>
          <rect x={424} y={120} width={100} height={132} rx={10} fill={C.ink850} stroke={alpha(C.emerald, 0.85)} strokeWidth={4} />
          <rect x={440} y={138} width={68} height={9} rx={4.5} fill={alpha(C.muted, 0.35)} />
          <rect x={440} y={158} width={50} height={9} rx={4.5} fill={alpha(C.muted, 0.28)} />
          <circle cx={474} cy={212} r={20} fill={alpha(C.emerald, 0.2)} stroke={alpha(C.emerald, 0.95)} strokeWidth={4} />
        </g>
      </Svg>
    </Box>
  );
}

/* ───────────────────────────── small glyphs (end card, rule cards, one-line slots) ───────────────────────────── */

/** The open album, small (rule 1, the slot line under question 1). */
export function AlbumGlyph({ size = 110, tone = C.cyan }: { size?: number; tone?: string }) {
  return (
    <svg width={size} height={size * 0.7} viewBox="0 0 110 77" style={{ overflow: 'visible' }}>
      <rect x={3} y={6} width={104} height={66} rx={10} fill={C.ink850} stroke={alpha(tone, 0.85)} strokeWidth={4} />
      <path d="M55 8 V70" stroke={alpha(tone, 0.5)} strokeWidth={3} />
      {[14, 66].map((x) => [16, 42].map((y) => <rect key={`${x}${y}`} x={x} y={y} width={30} height={20} rx={4} fill={alpha(tone, 0.2)} stroke={alpha(tone, 0.75)} strokeWidth={2.5} />))}
    </svg>
  );
}

/** The removal van, small (rule 2). */
export function VanGlyph({ size = 130, tone = C.sky }: { size?: number; tone?: string }) {
  return (
    <svg width={size} height={size * 0.6} viewBox="0 0 130 78" style={{ overflow: 'visible' }}>
      <rect x={4} y={8} width={78} height={48} rx={6} fill={C.ink850} stroke={alpha(tone, 0.85)} strokeWidth={4} />
      <path d="M82 22 H106 L124 42 V56 H82 Z" fill={C.ink850} stroke={alpha(tone, 0.85)} strokeWidth={4} strokeLinejoin="round" />
      <rect x={14} y={22} width={22} height={22} rx={3} fill={alpha(C.amber, 0.25)} stroke={alpha(C.amber, 0.85)} strokeWidth={2.5} />
      <rect x={42} y={26} width={28} height={18} rx={3} fill={alpha(C.amber, 0.25)} stroke={alpha(C.amber, 0.85)} strokeWidth={2.5} />
      <circle cx={30} cy={62} r={10} fill={C.ink800} stroke={alpha(tone, 0.9)} strokeWidth={4} />
      <circle cx={102} cy={62} r={10} fill={C.ink800} stroke={alpha(tone, 0.9)} strokeWidth={4} />
    </svg>
  );
}

/** The club: bunting over a small hall, small (rule 3, the slot line under question 3). */
export function ClubGlyph({ size = 120, tone = C.sky }: { size?: number; tone?: string }) {
  return (
    <svg width={size} height={size * 0.75} viewBox="0 0 120 90" style={{ overflow: 'visible' }}>
      <path d="M6 8 Q60 30 114 8" fill="none" stroke={alpha(C.muted, 0.7)} strokeWidth={3} />
      {[22, 42, 62, 82, 100].map((x, i) => (
        <path key={x} d={`M${x - 7} ${14 + 6 * Math.sin(((x - 6) / 108) * Math.PI)} h14 l-7 14 Z`} fill={alpha([C.amber, C.cyan, C.emerald, C.sky, C.amber][i], 0.5)} />
      ))}
      <path d="M18 78 V50 L60 32 L102 50 V78 Z" fill={C.ink850} stroke={alpha(tone, 0.85)} strokeWidth={4} strokeLinejoin="round" />
      <rect x={50} y={56} width={20} height={22} rx={3} fill={alpha(tone, 0.25)} stroke={alpha(tone, 0.8)} strokeWidth={2.5} />
    </svg>
  );
}

/** The font is the video's own; exported so a vignette caption can match. */
export const CAPTION_FONT = FONT.sans;

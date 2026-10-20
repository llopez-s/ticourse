import { C, FONT, alpha } from '../../../../engine/src/theme/tokens';
import { clamp01 } from '../../../../engine/src/ui';

/*
 * The video's six everyday images (canon: out/scene-brief.md, «Visual metaphors»), each drawn once and reused:
 * the letter that arrives three ways (concept 1, the case itself), your sister's stolen phone (2), the back of the
 * bank card (3), the disguise (4), the watering hole (5) and people for the family group (6). Plus the desk phone of
 * the call. Pure SVG in their own units, scaled by `width`; text that the voice points at is drawn by the scenes in
 * HTML at ≥ 32 px, never inside these drawings (except «hermana», sized for the widths it is used at).
 */

const PAPER = '#e8eef7';
const PAPER_EDGE = '#cbd5e1';

/** The letter: a sheet with a folded corner, four lines and a cyan seal. 100×128 in its own units. */
function Sheet({ x, y, s = 1, tone = C.cyan }: { x: number; y: number; s?: number; tone?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0 0 H76 L100 24 V128 H0 Z" fill={PAPER} stroke={alpha(tone, 0.9)} strokeWidth={3} strokeLinejoin="round" />
      <path d="M76 0 V24 H100" fill={PAPER_EDGE} stroke={alpha(tone, 0.9)} strokeWidth={3} strokeLinejoin="round" />
      {[70, 60, 72, 46].map((w, i) => (
        <rect key={i} x={14} y={36 + i * 16} width={w} height={7} rx={3} fill="#94a3b8" />
      ))}
      <circle cx={74} cy={106} r={12} fill={tone} />
    </g>
  );
}

export type LetterForm = 'envelope' | 'phone' | 'handset';
export const LETTER_VB = { w: 260, h: 240 } as const;

/** The same letter in one of its three ways of arriving: in an envelope, in a phone's message bubble, out of a handset. */
export function LetterArt({ form, width = 260, tone = C.cyan }: { form: LetterForm; width?: number; tone?: string }) {
  const h = (width * LETTER_VB.h) / LETTER_VB.w;
  return (
    <svg width={width} height={h} viewBox={`0 0 ${LETTER_VB.w} ${LETTER_VB.h}`} style={{ display: 'block', overflow: 'visible' }}>
      {form === 'envelope' ? (
        <g>
          <rect x={30} y={110} width={200} height={120} rx={10} fill={C.ink700} stroke={alpha(tone, 0.8)} strokeWidth={4} />
          <Sheet x={80} y={28} s={1} tone={tone} />
          <path d="M30 128 L130 186 L230 128 V222 Q230 230 222 230 H38 Q30 230 30 222 Z" fill={C.ink800} stroke={alpha(tone, 0.8)} strokeWidth={4} strokeLinejoin="round" />
          <path d="M30 230 L110 172 M230 230 L150 172" stroke={alpha(tone, 0.45)} strokeWidth={3} />
        </g>
      ) : form === 'phone' ? (
        <g>
          <rect x={66} y={6} width={128} height={228} rx={20} fill={C.ink900} stroke={alpha(tone, 0.8)} strokeWidth={4} />
          <rect x={78} y={26} width={104} height={188} rx={8} fill={C.ink800} />
          <rect x={112} y={14} width={36} height={5} rx={2.5} fill={alpha(tone, 0.5)} />
          <path d="M86 52 H170 Q178 52 178 60 V176 Q178 184 170 184 H100 L88 196 L90 184 Q86 184 86 176 Z" fill={alpha(tone, 0.16)} stroke={alpha(tone, 0.7)} strokeWidth={3} strokeLinejoin="round" />
          <Sheet x={98} y={64} s={0.78} tone={tone} />
        </g>
      ) : (
        <g>
          {/* the balloon with the letter */}
          <path d="M60 6 H214 Q230 6 230 22 V112 Q230 128 214 128 H128 L104 150 L108 128 H60 Q44 128 44 112 V22 Q44 6 60 6 Z" fill={alpha(tone, 0.16)} stroke={alpha(tone, 0.7)} strokeWidth={3} strokeLinejoin="round" />
          <Sheet x={104} y={16} s={0.8} tone={tone} />
          {/* the desk phone */}
          <path d="M40 222 L66 176 H194 L220 222 Q222 232 212 232 H48 Q38 232 40 222 Z" fill={C.ink800} stroke={alpha(tone, 0.8)} strokeWidth={4} strokeLinejoin="round" />
          {[0, 1, 2].map((r) =>
            [0, 1, 2].map((c) => <rect key={`${r}${c}`} x={104 + c * 20} y={190 + r * 12} width={12} height={7} rx={2} fill={alpha(tone, 0.45)} />),
          )}
          <path d="M58 166 Q58 150 74 150 H186 Q202 150 202 166 V170 H170 V164 H90 V170 H58 Z" fill={C.ink700} stroke={alpha(tone, 0.8)} strokeWidth={4} strokeLinejoin="round" />
        </g>
      )}
    </svg>
  );
}

/** A desk phone on its own (the call of s02 and the still of s04): base, keypad and the handset on its cradle. */
export function DeskPhone({ width = 360, tone = C.cyan }: { width?: number; tone?: string }) {
  return (
    <svg width={width} height={(width * 220) / 360} viewBox="0 0 360 220" style={{ display: 'block' }}>
      <path d="M40 200 L84 92 H276 L320 200 Q323 214 308 214 H52 Q37 214 40 200 Z" fill={C.ink800} stroke={alpha(tone, 0.8)} strokeWidth={5} strokeLinejoin="round" />
      {[0, 1, 2, 3].map((r) =>
        [0, 1, 2].map((c) => <rect key={`${r}${c}`} x={148 + c * 24} y={116 + r * 20} width={16} height={11} rx={3} fill={alpha(tone, 0.45)} />),
      )}
      <path d="M60 78 Q60 42 98 42 H262 Q300 42 300 78 V96 H250 V80 H110 V96 H60 Z" fill={C.ink700} stroke={alpha(tone, 0.8)} strokeWidth={5} strokeLinejoin="round" />
      <path d="M150 214 Q160 236 190 226" stroke={alpha(tone, 0.4)} strokeWidth={4} fill="none" />
    </svg>
  );
}

/**
 * Your sister's phone, stolen: the chat header says «hermana» (her real number, as digit blocks), her bubble arrives,
 * and a rose gloved hand holds the phone. `hand` 0–1 brings the hand in (the thief), so the image can open on the
 * innocent screen first.
 */
export function SisterPhoneArt({ width = 360, hand = 1 }: { width?: number; hand?: number }) {
  const h = clamp01(hand);
  return (
    <svg width={width} height={(width * 440) / 380} viewBox="0 0 380 440" style={{ display: 'block', overflow: 'visible' }}>
      <rect x={70} y={14} width={240} height={410} rx={30} fill={C.ink900} stroke={alpha(C.cyan, 0.7)} strokeWidth={5} />
      <rect x={84} y={40} width={212} height={370} rx={12} fill={C.ink800} />
      <rect x={84} y={40} width={212} height={86} rx={12} fill={C.ink700} />
      <circle cx={114} cy={74} r={20} fill={alpha(C.amber, 0.55)} />
      <circle cx={114} cy={68} r={8} fill={C.ink800} />
      <path d="M100 88 Q114 76 128 88" fill={C.ink800} />
      <text x={142} y={86} fontFamily={FONT.sans} fontSize={36} fontWeight={800} fill={C.textStrong}>
        hermana
      </text>
      {[0, 1, 2].map((g) =>
        [0, 1, 2].map((i) => <rect key={`${g}${i}`} x={146 + g * 46 + i * 12} y={98} width={9} height={14} rx={2} fill={alpha(C.text, 0.55)} />),
      )}
      <path d="M100 150 H262 Q278 150 278 166 V226 Q278 242 262 242 H118 L100 258 L104 242 Q100 242 100 226 Z" fill={alpha(C.cyan, 0.16)} stroke={alpha(C.cyan, 0.6)} strokeWidth={3} />
      {[150, 128, 140].map((w, i) => (
        <rect key={i} x={118} y={168 + i * 22} width={w} height={10} rx={5} fill={alpha(C.text, 0.55)} />
      ))}
      <path d="M100 280 H230 Q246 280 246 296 V320 Q246 336 230 336 H118 L100 350 L104 336 Q100 336 100 320 Z" fill={alpha(C.cyan, 0.16)} stroke={alpha(C.cyan, 0.6)} strokeWidth={3} />
      <rect x={118} y={302} width={104} height={10} rx={5} fill={alpha(C.text, 0.55)} />
      {/* the thief's gloved hand */}
      <g opacity={h} transform={`translate(${(1 - h) * -40} ${(1 - h) * 30})`}>
        <path d="M18 440 Q6 360 60 320 L104 300 Q120 296 122 312 L118 360 Q150 400 130 440 Z" fill={C.roseDeep} stroke={C.rose} strokeWidth={4} strokeLinejoin="round" />
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x={284} y={236 + i * 36} width={62} height={30} rx={15} fill={C.roseDeep} stroke={C.rose} strokeWidth={4} />
        ))}
      </g>
    </svg>
  );
}

/**
 * The bank card. `flip` 0–1 turns it over (0 front, 1 back); `glow` 0–1 lights the phone line on the back (digit
 * blocks, emerald). No bank, no digits.
 */
export function BankCardArt({ width = 420, flip = 1, glow = 0 }: { width?: number; flip?: number; glow?: number }) {
  const f = clamp01(flip);
  const sx = Math.abs(Math.cos(Math.PI * f));
  const back = f >= 0.5;
  const g = clamp01(glow);
  return (
    <svg width={width} height={(width * 230) / 360} viewBox="0 0 360 230" style={{ display: 'block', overflow: 'visible' }}>
      <g transform={`translate(180 0) scale(${Math.max(0.02, sx)} 1) translate(-180 0)`}>
        {back ? (
          <g>
            <rect x={10} y={8} width={340} height={214} rx={20} fill={C.ink800} stroke={alpha(C.cyan, 0.7)} strokeWidth={4} />
            <rect x={10} y={36} width={340} height={44} fill={C.ink950} />
            <rect x={30} y={98} width={210} height={34} rx={4} fill={alpha(C.text, 0.85)} />
            <path d="M42 120 q12 -14 24 0 t24 0 t24 0" stroke={C.ink700} strokeWidth={3} fill="none" />
            <rect x={252} y={98} width={58} height={34} rx={4} fill={alpha(C.text, 0.3)} />
            {g > 0.01 ? <rect x={22} y={150} width={316} height={56} rx={14} fill={alpha(C.emerald, 0.16 * g)} stroke={alpha(C.emerald, 0.9 * g)} strokeWidth={3} /> : null}
            <path d="M40 186 q0 -18 10 -22 l8 8 q-6 6 0 12 q6 6 12 0 l8 8 q-4 10 -22 10 q-16 0 -16 -16 Z" fill={g > 0.3 ? C.emerald : alpha(C.text, 0.6)} />
            {[0, 1, 2].map((gr) =>
              [0, 1, 2].map((i) => (
                <rect key={`${gr}${i}`} x={100 + gr * 76 + i * 20} y={166} width={14} height={24} rx={3} fill={g > 0.3 ? C.emerald : alpha(C.text, 0.6)} />
              )),
            )}
          </g>
        ) : (
          <g>
            <rect x={10} y={8} width={340} height={214} rx={20} fill={C.cyanDeep} stroke={alpha(C.cyan, 0.8)} strokeWidth={4} />
            <rect x={40} y={70} width={56} height={42} rx={8} fill={alpha(C.amber, 0.75)} />
            <circle cx={298} cy={54} r={22} fill={alpha('#ffffff', 0.18)} />
            <circle cx={318} cy={54} r={22} fill={alpha('#ffffff', 0.12)} />
            {[0, 1, 2, 3].map((gr) =>
              [0, 1, 2, 3].map((i) => <rect key={`${gr}${i}`} x={40 + gr * 72 + i * 15} y={150} width={11} height={18} rx={2} fill={alpha('#ffffff', 0.6)} />),
            )}
          </g>
        )}
      </g>
    </svg>
  );
}

/**
 * The disguise: on the left a person's (a face mask with a cap, on a stand), on the right a whole company's (a
 * shopfront façade worn as a costume, a blank logo circle, two legs underneath). `person` / `brand` 0–1 are each
 * half's opacity (0 hides it). `crop` draws only one half (its own tighter viewBox).
 */
export function DisguiseArt({ width = 640, person = 1, brand = 1, crop }: { width?: number; person?: number; brand?: number; crop?: 'person' | 'mask' | 'brand' }) {
  const p = clamp01(person);
  const b = clamp01(brand);
  const vb = crop === 'person' ? [56, 20, 230, 390] : crop === 'mask' ? [66, 24, 210, 210] : crop === 'brand' ? [340, 36, 270, 370] : [0, 0, 640, 420];
  return (
    <svg width={width} height={(width * vb[3]) / vb[2]} viewBox={vb.join(' ')} style={{ display: 'block', overflow: 'visible' }}>
      {/* the person's disguise */}
      {crop !== 'brand' && p > 0.001 ? (
        <g opacity={p}>
          {crop !== 'mask' ? (
            <>
              <rect x={146} y={230} width={10} height={160} fill={C.ink600} />
              <ellipse cx={151} cy={396} rx={60} ry={12} fill={C.ink700} />
            </>
          ) : null}
          <ellipse cx={151} cy={150} rx={74} ry={84} fill={PAPER} stroke={C.rose} strokeWidth={5} />
          <ellipse cx={122} cy={140} rx={18} ry={11} fill={C.ink900} />
          <ellipse cx={180} cy={140} rx={18} ry={11} fill={C.ink900} />
          <path d="M120 192 Q151 210 182 192" stroke={C.ink700} strokeWidth={6} fill="none" strokeLinecap="round" />
          <path d="M80 92 Q84 34 151 34 Q218 34 222 92 Z" fill={C.cyanDeep} stroke={alpha(C.cyan, 0.8)} strokeWidth={4} />
          <path d="M76 92 H262 Q262 108 240 108 H76 Z" fill={C.cyanDeep} stroke={alpha(C.cyan, 0.8)} strokeWidth={4} />
        </g>
      ) : null}
      {/* the company's disguise */}
      {crop !== 'person' && crop !== 'mask' && b > 0.001 ? (
        <g opacity={b}>
          <rect x={436} y={322} width={22} height={68} rx={6} fill={C.ink600} />
          <rect x={492} y={322} width={22} height={68} rx={6} fill={C.ink600} />
          <rect x={426} y={384} width={40} height={14} rx={6} fill={C.ink700} />
          <rect x={484} y={384} width={40} height={14} rx={6} fill={C.ink700} />
          <rect x={360} y={48} width={230} height={278} rx={8} fill={C.ink800} stroke={C.rose} strokeWidth={5} />
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <rect key={i} x={360 + i * (230 / 6)} y={48} width={230 / 6} height={42} fill={i % 2 ? C.ink700 : alpha(C.cyan, 0.55)} />
          ))}
          <circle cx={475} cy={136} r={30} fill="none" stroke={alpha(C.cyan, 0.85)} strokeWidth={4} strokeDasharray="8 7" />
          <rect x={384} y={184} width={88} height={70} rx={6} fill={alpha(C.sky, 0.18)} stroke={alpha(C.cyan, 0.6)} strokeWidth={3} />
          <rect x={496} y={184} width={70} height={142} rx={6} fill={C.ink700} stroke={alpha(C.cyan, 0.6)} strokeWidth={3} />
          <circle cx={554} cy={258} r={5} fill={alpha(C.cyan, 0.8)} />
        </g>
      ) : null}
    </svg>
  );
}

/**
 * The watering hole: the usual pond (right) and a fake puddle beside it (left, dashed rose rim); `poison` 0–1 drops a
 * rose drop into the usual one and spreads its ripples; `eyes` 0–1 opens a predator's eyes in the grass, waiting.
 * 900×380 in its own units; labels are the scene's.
 */
export function PondArt({ width = 900, fake = 1, poison = 1, eyes = 1 }: { width?: number; fake?: number; poison?: number; eyes?: number }) {
  const fk = clamp01(fake);
  const po = clamp01(poison);
  const ey = clamp01(eyes);
  const dropY = 40 + Math.min(1, po * 1.6) * 150;
  const ripple = clamp01((po - 0.6) / 0.4);
  return (
    <svg width={width} height={(width * 380) / 900} viewBox="0 0 900 380" style={{ display: 'block', overflow: 'visible' }}>
      <rect x={0} y={120} width={900} height={260} rx={30} fill={alpha(C.emerald, 0.07)} />
      {/* the fake puddle */}
      <g opacity={fk}>
        <ellipse cx={200} cy={250} rx={150} ry={50} fill={alpha(C.sky, 0.2)} stroke={C.rose} strokeWidth={4} strokeDasharray="12 9" />
        <rect x={326} y={160} width={8} height={96} fill={C.ink600} />
        <rect x={296} y={140} width={68} height={40} rx={6} fill={C.ink700} stroke={alpha(C.rose, 0.7)} strokeWidth={3} />
      </g>
      {/* the usual pond */}
      <ellipse cx={630} cy={240} rx={220} ry={72} fill={alpha(C.sky, 0.35)} stroke={C.sky} strokeWidth={4} />
      {ripple > 0 ? (
        <g fill="none" stroke={C.rose} strokeWidth={3}>
          <ellipse cx={630} cy={232} rx={40 + 120 * ripple} ry={12 + 36 * ripple} opacity={1 - 0.6 * ripple} />
          <ellipse cx={630} cy={232} rx={20 + 60 * ripple} ry={6 + 18 * ripple} opacity={0.8} />
          <ellipse cx={630} cy={232} rx={30 + 90 * ripple} ry={10 + 26 * ripple} fill={alpha(C.rose, 0.2 * ripple)} stroke="none" />
        </g>
      ) : null}
      {po > 0.01 && po < 0.85 ? <path d={`M630 ${dropY - 26} Q646 ${dropY - 4} 630 ${dropY + 6} Q614 ${dropY - 4} 630 ${dropY - 26} Z`} fill={C.rose} /> : null}
      {/* grass and the eyes that wait */}
      {[380, 404, 428, 452, 476, 500].map((x, i) => (
        <path key={x} d={`M${x} 372 Q${x + 6} ${330 - (i % 2) * 14} ${x + 14} 372`} fill={alpha(C.emerald, 0.45)} />
      ))}
      <g opacity={ey}>
        <ellipse cx={426} cy={346} rx={11} ry={6 * ey} fill={C.amber} />
        <ellipse cx={458} cy={346} rx={11} ry={6 * ey} fill={C.amber} />
        <rect x={424} y={342} width={4} height={8} fill={C.ink950} />
        <rect x={456} y={342} width={4} height={8} fill={C.ink950} />
      </g>
    </svg>
  );
}

/** A person as a silhouette (head and shoulders), in a tone: the maker (rose), the aunt (amber). */
export function PersonArt({ size = 120, tone = C.cyan }: { size?: number; tone?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: 'block' }}>
      <circle cx={50} cy={50} r={48} fill={alpha(tone, 0.12)} stroke={alpha(tone, 0.8)} strokeWidth={3} />
      <circle cx={50} cy={38} r={16} fill={tone} />
      <path d="M20 84 Q22 58 50 58 Q78 58 80 84 Z" fill={tone} />
    </svg>
  );
}

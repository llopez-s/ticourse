import type { CSSProperties, ReactNode } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { C, FONT, alpha } from '../../../../engine/src/theme/tokens';
import { EASE, progress, springIn } from '../../../../engine/src/theme/motion';
import { Icon, clamp01, windowWeight, type IconName } from '../../../../engine/src/ui';
import { HYPOTHESES, type HypId } from '../../data/matrix';
import { TableIcon } from './PromiseIcons';

/**
 * Image «la hoja KEY ASSUMPTIONS CHECK» (s03, s04, s08): a handwritten sheet
 * with two assumptions, «1 · no hay otra explicación» and «2 · las pruebas
 * son lo que parecen», each followed by «¿y si no?». Assumption 1 opens three
 * hypothesis slots (empty in s03, filled in s04 with H1–H3 and generic icons:
 * eye, padlock, flag — never a person of the staff); assumption 2 opens a
 * small table with «lo comprobamos al final». s08 brings it back with
 * assumption 2 highlighted (`highlight`).
 *
 * Drawn in design units (SHEET_BASE, 1130 × 620) scaled to `width`; frames are
 * Sequence-relative; `frame` defaults to useCurrentFrame(). Reveal props:
 * omitted → in the final state; `slots` is explicit (s03 wants them empty).
 */

export const SHEET_TEXT = {
  title: 'KEY ASSUMPTIONS CHECK',
  a1: '1 · no hay otra explicación',
  a2: '2 · las pruebas son lo que parecen',
  ask: '¿y si no?',
  later: 'lo comprobamos al final',
} as const;

/** Generic icons for the hypotheses (also handy for the scenes): espionage = eye, crime = padlock, hacktivism / insider = flag. */
export const HYP_ICON: Record<HypId, IconName> = { H1: 'eye', H2: 'lock', H3: 'flag' };

export const SHEET_BASE = { w: 1130, h: 620 } as const;

const PAPER = '#f2e8cf';
const PAPER_EDGE = '#d9c9a3';
const INK = '#1e293b';
const NAVY = '#1e3a8a';
const ASK = '#b45309';
const HIGHLIGHT = '#fde047';

const X0 = 54;
const TITLE_Y = 34;
const LINE1_Y = 118;
const SLOTS_Y = 192;
const SLOT_W = 326;
const SLOT_H = 146;
const SLOT_GAP = 18;
const LINE2_Y = 372;
const TABLE_Y = 440;
const LINE_H = 58;

/** Size in px of the sheet at `width` (default design width). */
export function sheetSize(width?: number): { w: number; h: number; scale: number } {
  const s = (width ?? SHEET_BASE.w) / SHEET_BASE.w;
  return { w: SHEET_BASE.w * s, h: SHEET_BASE.h * s, scale: s };
}

/** Box (px from the sheet's top-left) of an assumption line, a slot, or the table row. */
export function sheetBox(part: 'a1' | 'a2' | 'table' | HypId, width?: number): { x: number; y: number; w: number; h: number } {
  const { scale: s } = sheetSize(width);
  const b =
    part === 'a1'
      ? { x: X0, y: LINE1_Y, w: 980, h: LINE_H }
      : part === 'a2'
        ? { x: X0, y: LINE2_Y, w: 980, h: LINE_H }
        : part === 'table'
          ? { x: X0, y: TABLE_Y, w: 640, h: 130 }
          : { x: X0 + ['H1', 'H2', 'H3'].indexOf(part) * (SLOT_W + SLOT_GAP), y: SLOTS_Y, w: SLOT_W, h: SLOT_H };
  return { x: b.x * s, y: b.y * s, w: b.w * s, h: b.h * s };
}

/**
 * AssumptionSheet — props:
 *   width?      px (default 1130)
 *   at?         frame the sheet lands. Omitted: on screen.
 *   titleAt?    frame «KEY ASSUMPTIONS CHECK» is written (default `at`). Omitted: written.
 *   writeAt?    [a1, a2] frames each assumption is written by hand. Omitted: written.
 *   askAt?      [q1, q2] frames each «¿y si no?» appears (default writeAt[i] + 30). Omitted with no writeAt: shown.
 *   openAt?     [slots, table] frames assumption 1 opens its three slots and assumption 2 its
 *               table + «lo comprobamos al final» (default askAt[i] + 16). Omitted: open.
 *   slots?      'empty' | 'filled' (default) | [h1, h2, h3] frames each slot is filled.
 *   highlight?  [{ line: 1 | 2, from, to? }] — yellow highlighter behind that assumption (s08: line 2).
 *   dim?, glow? (0–1 warm halo), frame?, style?
 */
export function AssumptionSheet({
  width,
  at,
  titleAt,
  writeAt,
  askAt,
  openAt,
  slots = 'filled',
  highlight = [],
  dim = 0,
  glow = 0,
  frame: frameProp,
  style,
}: {
  width?: number;
  at?: number;
  titleAt?: number;
  writeAt?: readonly [number, number];
  askAt?: readonly [number, number];
  openAt?: readonly [number, number];
  slots?: 'empty' | 'filled' | readonly [number, number, number];
  highlight?: { line: 1 | 2; from: number; to?: number }[];
  dim?: number;
  glow?: number;
  frame?: number;
  style?: CSSProperties;
}) {
  const current = useCurrentFrame();
  const { fps } = useVideoConfig();
  const frame = frameProp ?? current;
  const size = sheetSize(width);
  const s = size.scale;

  const show = at === undefined ? 1 : progress(frame, at, 16);
  if (show <= 0) return null;

  const tTitle = titleAt ?? at;
  const titleP = tTitle === undefined ? 1 : progress(frame, tTitle, 20, EASE.inOut);
  const writeT = (i: 0 | 1) => writeAt?.[i];
  const askT = (i: 0 | 1) => askAt?.[i] ?? (writeAt ? writeAt[i] + 30 : undefined);
  const openT = (i: 0 | 1) => openAt?.[i] ?? (askT(i) === undefined ? undefined : askT(i)! + 16);
  const writeP = (i: 0 | 1) => (writeT(i) === undefined ? 1 : progress(frame, writeT(i)!, 26, EASE.inOut));
  const askP = (i: 0 | 1) => (askT(i) === undefined ? 1 : frame < askT(i)! ? 0 : springIn(frame, fps, askT(i)!, { damping: 13 }));
  const openP = (i: 0 | 1) => (openT(i) === undefined ? 1 : progress(frame, openT(i)!, 18));
  const fillP = (k: number) => (slots === 'empty' ? 0 : slots === 'filled' ? 1 : progress(frame, slots[k], 16));
  const marker = (line: 1 | 2) => Math.max(0, ...highlight.filter((h) => h.line === line).map((h) => windowWeight(frame, h.from, h.to ?? Number.POSITIVE_INFINITY, { ramp: 10, lead: 3 })));

  const d = clamp01(dim);
  const g = clamp01(glow);

  const line = (n: 1 | 2, text: string, y: number) => {
    const i = (n - 1) as 0 | 1;
    const wp = writeP(i);
    const ap = askP(i);
    const m = marker(n);
    return (
      <div style={{ position: 'absolute', left: X0, top: y, height: LINE_H, display: 'flex', alignItems: 'center', gap: 30, whiteSpace: 'nowrap' }}>
        <div style={{ position: 'relative', height: LINE_H, display: 'inline-flex', alignItems: 'center' }}>
          {m > 0.01 ? (
            <div
              style={{
                position: 'absolute',
                left: -12,
                top: LINE_H * 0.14,
                height: LINE_H * 0.74,
                width: `calc(${m * 100}% + 24px)`,
                borderRadius: 6,
                background: alpha(HIGHLIGHT, 0.7),
                transform: 'skewX(-8deg)',
              }}
            />
          ) : null}
          <Written p={wp}>
            <span style={{ position: 'relative', fontSize: 44, fontWeight: 800, color: INK, letterSpacing: -0.3 }}>{text}</span>
          </Written>
        </div>
        {ap > 0.001 ? (
          <span
            style={{
              display: 'inline-block',
              fontSize: 42,
              fontWeight: 850,
              color: ASK,
              transform: `rotate(-4deg) scale(${0.6 + 0.4 * Math.min(1.1, ap)})`,
              opacity: Math.min(1, ap * 1.5),
              padding: '2px 14px',
              border: `3px solid ${alpha(ASK, 0.8)}`,
              borderRadius: 30,
            }}
          >
            {SHEET_TEXT.ask}
          </span>
        ) : null}
      </div>
    );
  };

  const o1 = openP(0);
  const o2 = openP(1);

  return (
    <div style={{ position: 'relative', width: size.w, height: size.h, opacity: show * (1 - 0.6 * d), filter: d > 0.001 ? `saturate(${1 - 0.5 * d})` : undefined, ...style }}>
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: SHEET_BASE.w,
          height: SHEET_BASE.h,
          transform: `scale(${s}) translateY(${(1 - show) * -24}px) rotate(${-0.8 - (1 - show) * 2}deg)`,
          transformOrigin: '0 0',
          fontFamily: FONT.sans,
        }}
      >
        {/* Paper */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 6,
            background: `linear-gradient(180deg, ${PAPER} 0%, #ede1c4 100%)`,
            border: `2px solid ${PAPER_EDGE}`,
            boxShadow: `0 24px 50px ${alpha('#000000', 0.45)}${g > 0 ? `, 0 0 ${Math.round(30 + 26 * g)}px ${alpha(C.amber, 0.35 * g)}` : ''}`,
          }}
        />
        {/* Margin rule */}
        <div style={{ position: 'absolute', left: 30, top: 0, width: 2, height: SHEET_BASE.h, background: alpha('#e11d48', 0.18) }} />
        {/* Title */}
        <div style={{ position: 'absolute', left: X0, top: TITLE_Y, whiteSpace: 'nowrap' }}>
          <Written p={titleP}>
            <span style={{ fontSize: 46, fontWeight: 900, color: NAVY, letterSpacing: 1.5 }}>{SHEET_TEXT.title}</span>
          </Written>
          <svg width={620} height={16} style={{ position: 'absolute', left: 0, top: 56, overflow: 'visible' }}>
            <path d="M2 8 C160 2 400 14 610 5" stroke={NAVY} strokeWidth={5} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - clamp01((titleP - 0.5) / 0.5)} />
          </svg>
        </div>

        {line(1, SHEET_TEXT.a1, LINE1_Y)}

        {/* Three hypothesis slots */}
        {o1 > 0
          ? HYPOTHESES.map((h, k) => {
              const x = X0 + k * (SLOT_W + SLOT_GAP);
              const fp = fillP(k);
              const slotIn = progress(frame, (openT(0) ?? -100) + k * 5, 14);
              const sp = openT(0) === undefined ? 1 : slotIn;
              return (
                <div key={h.id} style={{ position: 'absolute', left: x, top: SLOTS_Y, width: SLOT_W, height: SLOT_H, opacity: sp, transform: `translateY(${(1 - sp) * 10}px)` }}>
                  <svg width={SLOT_W} height={SLOT_H} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
                    <rect x={2} y={2} width={SLOT_W - 4} height={SLOT_H - 4} rx={12} fill={fp > 0 ? alpha('#ffffff', 0.35 * fp) : 'none'} stroke={alpha(INK, fp > 0.5 ? 0.6 : 0.45)} strokeWidth={3} strokeDasharray={fp > 0.5 ? undefined : '10 8'} />
                  </svg>
                  {fp > 0 ? (
                    <div style={{ position: 'absolute', inset: '12px 16px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 4, opacity: fp, transform: `scale(${0.9 + 0.1 * fp})`, transformOrigin: 'left center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <Icon name={HYP_ICON[h.id]} size={40} color={NAVY} strokeWidth={2.4} />
                        <span style={{ fontSize: 38, fontWeight: 900, color: NAVY, lineHeight: 1 }}>{h.id}</span>
                      </div>
                      <div style={{ fontSize: 32, fontWeight: 750, color: INK, lineHeight: 1.12, whiteSpace: 'nowrap' }}>
                        {h.lines.map((ln) => (
                          <div key={ln}>{ln}</div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', fontSize: 40, fontWeight: 850, color: alpha(INK, 0.3) }}>{h.id}</div>
                  )}
                </div>
              );
            })
          : null}

        {line(2, SHEET_TEXT.a2, LINE2_Y)}

        {/* Small table + «lo comprobamos al final» */}
        {o2 > 0 ? (
          <div style={{ position: 'absolute', left: X0, top: TABLE_Y, height: 130, display: 'flex', alignItems: 'center', gap: 26, opacity: o2, transform: `translateY(${(1 - o2) * 10}px)` }}>
            <TableIcon size={124} color={NAVY} accent={ASK} strokeWidth={3.4} draw={openT(1) === undefined ? 1 : progress(frame, openT(1)!, 26)} />
            <Written p={openT(1) === undefined ? 1 : progress(frame, openT(1)! + 8, 22, EASE.inOut)}>
              <span style={{ fontSize: 40, fontWeight: 800, color: NAVY }}>{SHEET_TEXT.later}</span>
            </Written>
          </div>
        ) : null}
      </div>
    </div>
  );
}

/** Reveals its child left to right like a pen writing it (p 0–1). */
function Written({ p, children }: { p: number; children: ReactNode }) {
  const k = clamp01(p);
  if (k <= 0) return null;
  return (
    <div style={{ position: 'relative', display: 'inline-block', whiteSpace: 'nowrap', clipPath: k < 1 ? `inset(-20px ${(1 - k) * 100}% -20px -20px)` : undefined }}>
      {children}
    </div>
  );
}

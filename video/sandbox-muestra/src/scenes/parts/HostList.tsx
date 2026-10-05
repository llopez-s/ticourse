import type { CSSProperties } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../engine/src/theme/tokens';
import { clamp01 } from '../../../../engine/src/ui';
import { WINDOWS_NOTE, type ContactedHost, type HostId } from '../../data/report';
import { OwnGlyph, type PhoneOwnIcon } from './BorrowedPhone';
import { mixHex } from './Garment';

/**
 * The report's «Hosts contactados», enlarged (s04; s05's opening). Five rows of
 * `host:port`, ALL ONE COLOUR (sky) and bare — no annotation, response, bytes,
 * HTTP code or «conectado»: they are what the sandbox wrote down, not
 * connections made. Then, driven by the scene:
 *
 * - `actor`    0–1 the two actor rows turn rose, with the guest glyph of the phone;
 * - `windows`  0–1 the three Windows rows turn grey, with the phone's own icons
 *              (clock, shield, signal bars);
 * - `labels`   per-row 0–1: the plain label under the host (s04's, from report.ts);
 * - `note`     0–1 «las hace Windows solo, con muestra o sin ella» opens above the
 *              Windows rows;
 * - `locks`    per-row 0–1 padlock at the row's end; `lockHold` blends it from
 *              rose (blackout: everything blocked) to emerald (triage: what holds);
 * - `dims`     per-row 0–1 step back (focus on the others);
 * - `only`     draw just these rows (e.g. the two actor rows, locked, in s05).
 *
 * Frame-free: every weight comes from the scene. Wrap it in a positioned div.
 */

const SKY = C.sky;
const GREY = '#94a3b8';
const GUTTER = 64;
const ICON_FOR: Partial<Record<HostId, PhoneOwnIcon>> = { time: 'clock', certs: 'shield', connect: 'signal' };

export interface HostListMetrics {
  rowH: number[];
  rowY: number[];
  noteY: number;
  noteH: number;
  height: number;
}

/** Row heights and offsets for a given state (so the scene can place things next to a row). */
export function hostListMetrics(
  rows: readonly ContactedHost[],
  { size = 44, labelSize = 32, labels = [], note = 0, gap = 14 }: { size?: number; labelSize?: number; labels?: readonly number[]; note?: number; gap?: number },
): HostListMetrics {
  const base = Math.round(size * 1.62);
  const labelH = Math.round(labelSize * 1.32);
  const noteH = Math.round(note * (labelSize * 1.5 + 10));
  const rowH: number[] = [];
  const rowY: number[] = [];
  let y = 0;
  let noteY = 0;
  rows.forEach((r, i) => {
    if (i > 0 && r.side === 'windows' && rows[i - 1].side === 'actor') {
      noteY = y;
      y += noteH;
    }
    const h = base + Math.round(clamp01(labels[i] ?? 0) * labelH);
    rowY.push(y);
    rowH.push(h);
    y += h + gap;
  });
  return { rowH, rowY, noteY, noteH, height: Math.max(0, y - gap) };
}

export function HostList({
  hosts,
  width,
  size = 44,
  labelSize = 32,
  appear = 1,
  actor = 0,
  windows = 0,
  labels = [],
  note = 0,
  locks = [],
  lockHold = 0,
  dims = [],
  only,
  gap = 14,
  style,
}: {
  hosts: readonly ContactedHost[];
  width: number;
  size?: number;
  labelSize?: number;
  /** 0–1 staggered entrance of the rows. */
  appear?: number;
  actor?: number;
  windows?: number;
  /** Per drawn row (after `only`), 0–1. */
  labels?: readonly number[];
  note?: number;
  locks?: readonly number[];
  lockHold?: number;
  dims?: readonly number[];
  only?: readonly HostId[];
  gap?: number;
  style?: CSSProperties;
}) {
  const rows = only ? hosts.filter((h) => only.includes(h.id)) : hosts;
  const m = hostListMetrics(rows, { size, labelSize, labels, note, gap });
  const a = clamp01(actor);
  const wi = clamp01(windows);
  const hold = clamp01(lockHold);
  const lockTone = mixHex(C.rose, C.emerald, hold);
  const n = rows.length;
  const rowIn = (i: number) => clamp01((clamp01(appear) * (1 + 0.14 * (n - 1)) - 0.14 * i) / 1);
  const cardW = width - GUTTER;
  const lockSize = Math.round(size * 1.18);
  const firstWindows = rows.findIndex((r) => r.side === 'windows');

  return (
    <div style={{ position: 'relative', width, height: m.height, fontFamily: FONT.sans, ...style }}>
      {/* «las hace Windows solo, con muestra o sin ella» above the Windows rows */}
      {note > 0.02 && firstWindows > 0 ? (
        <div
          style={{
            position: 'absolute',
            left: GUTTER + 6,
            top: m.noteY + (m.noteH - labelSize * 1.3) / 2 - 4,
            fontSize: labelSize + 2,
            fontWeight: 700,
            color: C.text,
            whiteSpace: 'nowrap',
            opacity: clamp01((note - 0.4) / 0.6),
          }}
        >
          {WINDOWS_NOTE}
        </div>
      ) : null}

      {rows.map((r, i) => {
        const p = rowIn(i);
        if (p <= 0.001) return null;
        const isActor = r.side === 'actor';
        const t = isActor ? a : wi;
        const tone = mixHex(SKY, isActor ? C.rose : GREY, t);
        const lab = clamp01(labels[i] ?? 0);
        const lock = clamp01(locks[i] ?? 0);
        const d = clamp01(dims[i] ?? 0);
        const icon = ICON_FOR[r.id];
        const textTone = isActor ? mixHex(C.text, C.roseSoft, t) : mixHex(C.textStrong, '#cbd5e1', t);
        return (
          <div
            key={r.id}
            style={{
              position: 'absolute',
              left: 0,
              top: m.rowY[i],
              width,
              height: m.rowH[i],
              opacity: p * (1 - 0.6 * d),
              transform: `translateX(${(1 - p) * 26}px) scale(${0.94 + 0.06 * p})`,
              transformOrigin: 'left center',
              filter: d > 0.01 ? `saturate(${1 - 0.5 * d})` : undefined,
            }}
          >
            {/* Gutter glyph: the phone's guest (actor) or the phone's own icon (Windows) */}
            {t > 0.02 ? (
              <svg
                width={GUTTER - 10}
                height={GUTTER - 10}
                viewBox="0 0 54 54"
                style={{ position: 'absolute', left: 0, top: Math.round(size * 1.62) / 2 - (GUTTER - 10) / 2, opacity: t, overflow: 'visible' }}
              >
                <circle cx={27} cy={27} r={24} fill={alpha(tone, 0.14)} stroke={alpha(tone, 0.7)} strokeWidth={2.4} />
                {icon ? (
                  <OwnGlyph name={icon} x={27} y={27} size={30} color={tone} sw={2.6} />
                ) : (
                  <g transform="translate(12 12) scale(1.25)" fill="none" stroke={tone} strokeWidth={2.1} strokeLinecap="round">
                    <circle cx={12} cy={8} r={4} />
                    <path d="M4.5 20.5a7.5 7.5 0 0 1 15 0" />
                  </g>
                )}
              </svg>
            ) : null}

            {/* The row card */}
            <div
              style={{
                position: 'absolute',
                left: GUTTER,
                top: 0,
                width: cardW,
                height: m.rowH[i],
                boxSizing: 'border-box',
                borderRadius: RADIUS.md,
                border: `2px solid ${alpha(tone, 0.45 + 0.25 * t)}`,
                background: `linear-gradient(90deg, ${alpha(tone, 0.13 + 0.06 * t)} 0%, ${alpha(C.ink900, 0.92)} 70%)`,
                overflow: 'hidden',
              }}
            >
              <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 7, background: tone, opacity: 0.85 }} />
              <div
                style={{
                  position: 'absolute',
                  left: 30,
                  top: 0,
                  height: Math.round(size * 1.62),
                  display: 'flex',
                  alignItems: 'center',
                  fontFamily: FONT.mono,
                  fontSize: size,
                  fontWeight: 650,
                  whiteSpace: 'nowrap',
                  letterSpacing: -0.3,
                }}
              >
                <span style={{ color: textTone }}>{r.host}</span>
                <span style={{ color: alpha(C.muted, 0.95) }}>:{r.port}</span>
              </div>
              {lab > 0.01 ? (
                <div
                  style={{
                    position: 'absolute',
                    left: 32,
                    top: Math.round(size * 1.62) - 8,
                    fontSize: labelSize,
                    fontWeight: 700,
                    color: isActor ? C.roseSoft : C.text,
                    whiteSpace: 'nowrap',
                    opacity: clamp01((lab - 0.3) / 0.7),
                    transform: `translateY(${(1 - lab) * 8}px)`,
                  }}
                >
                  {r.label}
                </div>
              ) : null}
            </div>

            {/* Padlock at the row's end */}
            {lock > 0.01 ? (
              <div
                style={{
                  position: 'absolute',
                  left: width - lockSize - 14,
                  top: Math.round(size * 1.62) / 2 - lockSize / 2,
                  width: lockSize,
                  height: lockSize,
                  borderRadius: lockSize / 2,
                  display: 'grid',
                  placeItems: 'center',
                  background: alpha(lockTone, 0.2),
                  border: `3px solid ${alpha(lockTone, 0.9)}`,
                  boxShadow: `0 0 ${Math.round(18 * lock)}px ${alpha(lockTone, 0.45)}`,
                  opacity: Math.min(1, lock * 1.4),
                  transform: `scale(${0.6 + 0.4 * lock})`,
                }}
              >
                <svg width={lockSize * 0.6} height={lockSize * 0.6} viewBox="0 0 24 24" fill="none" stroke={lockTone} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
                  <rect x={5} y={10.5} width={14} height={10} rx={2} fill={alpha(lockTone, 0.25)} />
                  <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
                </svg>
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

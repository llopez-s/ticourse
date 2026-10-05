import type { CSSProperties, ReactNode } from 'react';
import { C, FONT, alpha } from '../../../../engine/src/theme/tokens';
import { Icon, clamp01, dimStyle, tone as toneOf, type Tone } from '../../../../engine/src/ui';
import {
  BAND_TITLE,
  DYNAMIC_LINES,
  HOSTS,
  HOSTS_HEAD,
  KEY_PAD,
  REPORT_HEADER,
  STATIC_LINES,
  hostText,
  pipeParts,
  reportLine,
  type DynamicLineId,
  type HostId,
  type ReportField,
  type StaticLineId,
} from '../../data/report';

/**
 * The sandbox report of s03 (and s05's static band): one dark panel, the header «Informe de sandbox · extracto ·
 * …» and two bands, ESTÁTICO and DINÁMICO, with the lesson's lines in mono (data: src/data/report.ts). Host rows are
 * small, plain, one colour and WITHOUT annotations. Owner: builder A.
 *
 *   <SandboxReport width={1180} />                                  // both bands, with header
 *   <SandboxReport width={1180} bands="static" focus={{ sha256: w }} />   // s05: the static band alone
 *   <SandboxReport width={1180} bands="dynamic" header={false} />   // s03: the bottom band as its own panel
 *
 * Every input is a 0–1 weight computed by the scene (nothing reads the timeline):
 * - `reveal[row]` — the row appears (default 1).
 * - `focus[row]`  — the voice is on it: tinted bar, brighter text, text grows to `focusScale` (origin left).
 * - `dim[row]`    — steps the row back (dimStyle); `bandDim[band]` does it for a whole band.
 * - `bandGlow[band]` — tints the band (the voice says «arriba» / «abajo»).
 * - `pipeSplit`   — colours the pipe's `vc_pipe_` prefix cyan and its last eight characters amber.
 * - `notes`       — false drops the lesson's parenthesis from the static lines (`Compile time : 2026-02-19`).
 *
 * `reportLayout()` returns the same geometry the panel uses (row tops, band boxes, text widths), so a scene can hang
 * captions or connectors on a line without reading this file. Wrap the panel in an absolutely positioned div.
 */

export type ReportBands = 'both' | 'static' | 'dynamic';
export type ReportBandId = 'static' | 'dynamic';
export type ReportRowId = StaticLineId | DynamicLineId | 'hostsHead' | HostId;

export const STATIC_ROWS: readonly StaticLineId[] = STATIC_LINES.map((l) => l.id);
export const DYNAMIC_ROWS: readonly ReportRowId[] = [...DYNAMIC_LINES.map((l) => l.id), 'hostsHead', ...HOSTS.map((h) => h.id)];

/** Sizes derived from the mono font size (JetBrains Mono advances 0.6 em). */
export function reportMetrics(fontSize = 22) {
  const f = fontSize;
  return {
    fontSize: f,
    charW: f * 0.6,
    lineH: Math.round(f * 1.48),
    padX: Math.round(f * 1.2),
    headerH: Math.round(f * 2.5),
    bandTitleH: Math.round(f * 1.7),
    bandPadTop: Math.round(f * 0.5),
    bandPadBottom: Math.round(f * 0.6),
    dividerH: 2,
  };
}

export interface ReportRowBox {
  /** Top of the row, panel coordinates. */
  y: number;
  h: number;
  /** Left of the text. */
  x: number;
  /** Width of the unscaled text (characters × advance). */
  textW: number;
  /** The text drawn (the lesson's line). */
  text: string;
}

export interface ReportLayout {
  width: number;
  height: number;
  metrics: ReturnType<typeof reportMetrics>;
  header?: { y: number; h: number };
  bands: Partial<Record<ReportBandId, { y: number; h: number }>>;
  rows: Partial<Record<ReportRowId, ReportRowBox>>;
}

function staticText(f: ReportField, notes: boolean): string {
  return notes ? reportLine(f) : `${f.key.padEnd(KEY_PAD)}: ${f.value}`;
}

function rowText(id: ReportRowId, notes: boolean): string {
  const s = STATIC_LINES.find((l) => l.id === id);
  if (s) return staticText(s, notes);
  const d = DYNAMIC_LINES.find((l) => l.id === id);
  if (d) return reportLine(d);
  if (id === 'hostsHead') return HOSTS_HEAD;
  const h = HOSTS.find((x) => x.id === id);
  if (h) return `  ${hostText(h)}`;
  throw new Error(`unknown report row ${id}`);
}

/** Geometry of a report panel (same numbers the panel draws with). */
export function reportLayout({
  width,
  bands = 'both',
  header,
  fontSize = 22,
  notes = true,
}: {
  width: number;
  bands?: ReportBands;
  header?: boolean;
  fontSize?: number;
  notes?: boolean;
}): ReportLayout {
  const m = reportMetrics(fontSize);
  const withHeader = header ?? bands !== 'dynamic';
  const out: ReportLayout = { width, height: 0, metrics: m, bands: {}, rows: {} };
  let y = 0;
  if (withHeader) {
    out.header = { y: 0, h: m.headerH };
    y += m.headerH;
  }
  const list: ReportBandId[] = bands === 'both' ? ['static', 'dynamic'] : [bands];
  list.forEach((band, i) => {
    const y0 = y;
    y += m.bandPadTop + m.bandTitleH;
    for (const id of band === 'static' ? STATIC_ROWS : DYNAMIC_ROWS) {
      const text = rowText(id, notes);
      out.rows[id] = { y, h: m.lineH, x: m.padX, textW: text.length * m.charW, text };
      y += m.lineH;
    }
    y += m.bandPadBottom;
    out.bands[band] = { y: y0, h: y - y0 };
    if (i < list.length - 1) y += m.dividerH;
  });
  out.height = y;
  return out;
}

/** Height of a report panel. */
export function reportHeight(opts: Parameters<typeof reportLayout>[0]): number {
  return reportLayout(opts).height;
}

/** Linear blend of two #rrggbb colours. */
function mixHex(a: string, b: string, t: number): string {
  const k = clamp01(t);
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  return `#${pa.map((v, i) => Math.round(v + (pb[i] - v) * k).toString(16).padStart(2, '0')).join('')}`;
}

const KEY_C = C.muted;
const NOTE_C = C.faint;

export function SandboxReport({
  width,
  bands = 'both',
  header,
  fontSize = 22,
  notes = true,
  show = 1,
  reveal = {},
  focus = {},
  dim = {},
  focusTone = {},
  valueTone = {},
  focusScale = 1.4,
  bandDim = {},
  bandGlow = {},
  bandTone = {},
  glow = 0,
  pipeSplit = 0,
  hostTone = 'sky',
  style,
}: {
  width: number;
  bands?: ReportBands;
  /** Default: true, except for `bands="dynamic"`. */
  header?: boolean;
  fontSize?: number;
  notes?: boolean;
  show?: number;
  reveal?: Partial<Record<ReportRowId, number>>;
  focus?: Partial<Record<ReportRowId, number>>;
  dim?: Partial<Record<ReportRowId, number>>;
  focusTone?: Partial<Record<ReportRowId, Tone>>;
  valueTone?: Partial<Record<ReportRowId, Tone>>;
  focusScale?: number;
  bandDim?: Partial<Record<ReportBandId, number>>;
  bandGlow?: Partial<Record<ReportBandId, number>>;
  bandTone?: Partial<Record<ReportBandId, Tone>>;
  glow?: number;
  pipeSplit?: number;
  hostTone?: Tone;
  style?: CSSProperties;
}) {
  const sh = clamp01(show);
  if (sh <= 0) return null;
  const L = reportLayout({ width, bands, header, fontSize, notes });
  const m = L.metrics;
  const g = clamp01(glow);
  const headerSize = Math.min(Math.round(fontSize * 1.1), Math.floor((width - m.padX * 2 - 48) / (REPORT_HEADER.length * 0.52)));
  const hostC = toneOf(hostTone).soft;

  const bandBlocks = (Object.keys(L.bands) as ReportBandId[]).map((band) => {
    const box = L.bands[band]!;
    const t = toneOf(bandTone[band] ?? 'cyan');
    const bg = clamp01(bandGlow[band] ?? 0);
    const bd = clamp01(bandDim[band] ?? 0);
    return (
      <div key={band} style={{ position: 'absolute', left: 0, top: box.y, width, height: box.h, ...dimStyle(bd) }}>
        {bg > 0.001 ? (
          <div
            style={{
              position: 'absolute',
              inset: 4,
              borderRadius: 12,
              background: alpha(t.fg, 0.07 * bg),
              boxShadow: `inset 0 0 0 2px ${alpha(t.fg, 0.55 * bg)}, 0 0 ${Math.round(30 * bg)}px ${alpha(t.fg, 0.18 * bg)}`,
            }}
          />
        ) : null}
        <div
          style={{
            position: 'absolute',
            left: m.padX,
            top: m.bandPadTop,
            height: m.bandTitleH,
            right: m.padX,
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            fontFamily: FONT.mono, fontVariantLigatures: 'none', fontFeatureSettings: '"liga" 0, "calt" 0',
            fontSize: Math.round(fontSize * 0.95),
            fontWeight: 800,
            letterSpacing: 3,
            color: mixHex(C.muted, t.soft, 0.35 + 0.65 * bg),
          }}
        >
          <span style={{ color: C.faint, letterSpacing: 0 }}>===</span>
          <span>{BAND_TITLE[band]}</span>
          <span style={{ color: C.faint, letterSpacing: 0 }}>===</span>
          <div style={{ flex: 1, height: 2, background: alpha(t.fg, 0.12 + 0.3 * bg), marginLeft: 6 }} />
        </div>
      </div>
    );
  });

  // Rows: dimmed / revealed rows first, focused rows last so their bar covers the neighbours.
  const ids = Object.keys(L.rows) as ReportRowId[];
  const order = [...ids].sort((a, b) => (focus[a] ?? 0) - (focus[b] ?? 0));
  const rowBand = (id: ReportRowId): ReportBandId => ((STATIC_ROWS as readonly string[]).includes(id) ? 'static' : 'dynamic');

  const rows = order.map((id) => {
    const box = L.rows[id]!;
    const r = clamp01(reveal[id] ?? 1);
    if (r <= 0) return null;
    const f = clamp01(focus[id] ?? 0);
    // A focused row escapes its own dim and its band's.
    const d = Math.max(clamp01(dim[id] ?? 0), clamp01(bandDim[rowBand(id)] ?? 0)) * (1 - f);
    const t = toneOf(focusTone[id] ?? 'cyan');
    const k = 1 + (focusScale - 1) * f;
    const barH = box.h * (1 + (k - 1) * 0.9);
    const ds = dimStyle(d, r);
    const shift = (1 - r) * 14;
    return (
      <div key={id} style={{ position: 'absolute', left: 0, top: box.y, width, height: box.h, zIndex: f > 0.01 ? 2 : 1 }}>
        {f > 0.01 ? (
          <div
            style={{
              position: 'absolute',
              left: box.x - 12,
              top: (box.h - barH) / 2,
              width: box.textW * k + 26,
              height: barH,
              borderRadius: 10,
              background: `linear-gradient(90deg, ${alpha(t.fg, 0.2 * f)} 0%, ${alpha(t.fg, 0.05 * f)} 100%), ${alpha(C.ink850, f)}`,
              boxShadow: `inset 5px 0 0 ${alpha(t.fg, 0.95 * f)}, 0 0 ${Math.round(26 * f)}px ${alpha(t.fg, 0.25 * f)}`,
              border: `2px solid ${alpha(t.fg, 0.45 * f)}`,
              boxSizing: 'border-box',
            }}
          />
        ) : null}
        <div
          style={{
            position: 'absolute',
            left: box.x,
            top: 0,
            height: box.h,
            display: 'flex',
            alignItems: 'center',
            fontFamily: FONT.mono, fontVariantLigatures: 'none', fontFeatureSettings: '"liga" 0, "calt" 0',
            fontSize,
            fontWeight: 500 + Math.round(150 * f),
            whiteSpace: 'pre',
            transform: k !== 1 || shift > 0 ? `translateX(${shift}px) scale(${k})` : undefined,
            transformOrigin: 'left center',
            ...ds,
          }}
        >
          {renderRow(id, { f, pipeSplit, hostC, valueTone, notes })}
        </div>
      </div>
    );
  });

  return (
    <div
      style={{
        position: 'relative',
        width,
        height: L.height,
        borderRadius: 18,
        background: `linear-gradient(180deg, ${C.ink850} 0%, ${C.ink900} 100%)`,
        border: `2px solid ${g > 0 ? alpha(C.cyan, 0.3 + 0.5 * g) : C.ink700}`,
        boxShadow: `0 30px 70px ${alpha('#000000', 0.35)}, inset 0 1px 0 ${alpha('#ffffff', 0.05)}${g > 0 ? `, 0 0 ${Math.round(24 + 30 * g)}px ${alpha(C.cyan, 0.3 * g)}` : ''}`,
        boxSizing: 'border-box',
        overflow: 'hidden',
        opacity: sh,
        ...style,
      }}
    >
      {L.header ? (
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width,
            height: L.header.h,
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            padding: `0 ${m.padX}px`,
            boxSizing: 'border-box',
            background: alpha(C.ink800, 0.9),
            borderBottom: `2px solid ${C.ink700}`,
            fontFamily: FONT.sans,
            fontSize: headerSize,
            fontWeight: 650,
            color: C.text,
            whiteSpace: 'nowrap',
          }}
        >
          <Icon name="file" size={Math.round(headerSize * 1.2)} color={C.cyan} />
          <span>{REPORT_HEADER}</span>
        </div>
      ) : null}
      {bandBlocks}
      {bands === 'both' && L.bands.dynamic ? (
        <div style={{ position: 'absolute', left: m.padX, right: m.padX, top: L.bands.dynamic.y - m.dividerH, height: m.dividerH, background: C.ink700 }} />
      ) : null}
      {rows}
    </div>
  );
}

function renderRow(
  id: ReportRowId,
  {
    f,
    pipeSplit,
    hostC,
    valueTone,
    notes,
  }: { f: number; pipeSplit: number; hostC: string; valueTone: Partial<Record<ReportRowId, Tone>>; notes: boolean },
): ReactNode {
  const valueC = (fallback: string) => (valueTone[id] ? toneOf(valueTone[id]!).soft : mixHex(fallback, C.textStrong, f));
  if (id === 'hostsHead') return <span style={{ color: mixHex(KEY_C, C.text, f) }}>{HOSTS_HEAD}</span>;
  const host = HOSTS.find((h) => h.id === id);
  if (host) return <span style={{ color: valueTone[id] ? toneOf(valueTone[id]!).soft : hostC }}>{`  ${hostText(host)}`}</span>;
  const field = STATIC_LINES.find((l) => l.id === id) ?? DYNAMIC_LINES.find((l) => l.id === id);
  if (!field) return null;
  const key = (
    <>
      <span style={{ color: mixHex(KEY_C, C.text, f) }}>{field.key.padEnd(KEY_PAD)}</span>
      <span style={{ color: C.faint }}>: </span>
    </>
  );
  if (id === 'pipe') {
    const p = pipeParts(field.value);
    return (
      <>
        {key}
        <span style={{ color: valueC(C.text) }}>{p.root}</span>
        <span style={{ color: mixHex(valueC(C.text), C.cyan, pipeSplit) }}>{p.prefix}</span>
        <span style={{ color: mixHex(valueC(C.text), C.amber, pipeSplit) }}>{p.run}</span>
      </>
    );
  }
  const showNote = notes && field.note;
  return (
    <>
      {key}
      <span style={{ color: valueC(C.text) }}>{field.value}</span>
      {showNote ? <span style={{ color: NOTE_C }}>{' '.repeat(field.gap ?? 1) + field.note}</span> : null}
    </>
  );
}

import type { CSSProperties } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../engine/src/theme/tokens';
import { Icon, clamp01, dimStyle } from '../../../../engine/src/ui';
import { FOLDER_NAME, PERM_PLAIN, PERM_WINDOWS, REST_LABEL, REST_NOTE, SERVER, THREAD, type AclEntry, type Perm } from './data';
import { GateBar } from './Gate';
import { Pencil } from './People';

/**
 * THE THREAD: the folder «Partes de avería» (drawn in SVG: the icon set has no folder) with its list of entries under
 * it. Same rows, same order, same place (THREAD in data.ts) in every scene; each scene lights the row it explains and
 * dims the rest. Everything is driven by 0–1 weights, never frames, so B can reuse it:
 *
 *   <FolderAcl entries={PARTES} fx={{ maint: { focus: 1 }, ops: { dim: 1 } }} rest={{ show: 1 }} />
 *
 * Rows are addressed by id (AclId), not index. `naming` flips «leer / leer y escribir» to «Lectura / Modificar» (s08 only).
 * The same component draws «Informes» (entries={INFORMES}, name={REPORTS_NAME}) and the subfolder «2026» (`greyAll`).
 * Geometry helpers (`aclRowCenterY`, `aclRestTop`, `aclHeight`) let a scene hang a connector on a row without measuring.
 */

export const ACL = { rowH: 76, gap: 6, headH: 104, restH: 70 } as const;
export const aclRowTop = (i: number) => ACL.headH + i * (ACL.rowH + ACL.gap);
export const aclRowCenterY = (i: number) => aclRowTop(i) + ACL.rowH / 2;
export const aclRestTop = (n: number) => aclRowTop(n) + 4;
export const aclHeight = (n: number, rest = true) => aclRestTop(n) + (rest ? ACL.restH : -4);

/** Per-row effects (all optional). `show` defaults to 1. */
export interface RowFx {
  show?: number;
  /** The voice is on this row: border, glow and a slight growth. */
  focus?: number;
  /** Another row is in focus. */
  dim?: number;
  /** Border/chip colour override (emerald by default; rose for a denial; amber for an excess). */
  tone?: string;
  /** Ghost row: dashed and empty (e.g. `svc_resumen · escribir` before s07's `answer`). */
  missing?: boolean;
  /** A cyan key badge on the row: «tu cuenta» is a member (Mantenimiento from s03 `joins` to s10 `moves`). */
  mine?: number;
  /** Weight of the «para qué» text to the right of the row (s04). */
  why?: number;
}

export interface RestFx {
  show?: number;
  focus?: number;
  dim?: number;
  /** «nadie más» (default) or «el resto del puerto» (s04). */
  label?: string;
  /** Weight of «no aparece = no entra» to the right of the row. */
  note?: number;
}

export interface GateFx {
  /** 0 closed (rose) … 1 open (emerald). */
  open: number;
  /** px of wobble for a refused open. */
  shake?: number;
}

/** The folder icon, cyan = data. */
export function FolderGlyph({ width = 96, tone = C.cyan, glow = 0 }: { width?: number; tone?: string; glow?: number }) {
  const g = clamp01(glow);
  return (
    <svg width={width} height={(width * 76) / 96} viewBox="0 0 96 76" style={{ display: 'block', flexShrink: 0, overflow: 'visible' }} aria-hidden>
      {g > 0.02 ? <rect x={4} y={14} width={88} height={56} rx={12} fill={alpha(tone, 0.5 * g)} style={{ filter: 'blur(10px)' }} /> : null}
      <path d="M6 16 a8 8 0 0 1 8 -8 h22 l10 10 h38 a8 8 0 0 1 8 8 v40 a8 8 0 0 1 -8 8 h-70 a8 8 0 0 1 -8 -8 Z" fill={alpha(tone, 0.16)} stroke={tone} strokeWidth={4} strokeLinejoin="round" />
      <path d="M6 30 h84" stroke={alpha(tone, 0.7)} strokeWidth={4} />
    </svg>
  );
}

/** «leer», «leer y escribir», «escribir», «denegar» (or Windows names), with its icons. */
export function PermChip({ perm, naming = 'plain', tone = C.emerald, size = 32, on = 0 }: { perm: Perm; naming?: 'plain' | 'windows'; tone?: string; size?: number; on?: number }) {
  const text = (naming === 'windows' ? PERM_WINDOWS : PERM_PLAIN)[perm];
  const deny = perm === 'deny';
  const col = deny && tone === C.emerald ? C.rose : tone;
  const o = clamp01(on);
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        height: size * 1.6,
        padding: `0 ${Math.round(size * 0.6)}px`,
        boxSizing: 'border-box',
        borderRadius: RADIUS.pill,
        border: `2px solid ${alpha(col, 0.6 + 0.4 * o)}`,
        background: alpha(col, 0.14 + 0.14 * o),
        fontFamily: FONT.sans,
        fontSize: size,
        fontWeight: 800,
        color: col === C.emerald ? '#6ee7b7' : col === C.rose ? C.roseSoft : '#fcd34d',
        whiteSpace: 'nowrap',
      }}
    >
      {deny ? <Icon name="x" size={size} color={col} strokeWidth={2.6} /> : null}
      {perm === 'read' || perm === 'rw' ? <Icon name="eye" size={size} color={col} /> : null}
      {perm === 'write' || perm === 'rw' ? <Pencil size={size} color={col} strokeWidth={2} /> : null}
      {text}
    </span>
  );
}

/** One row of the list. Exported so a scene can show a single row on its own (s05). */
export function AclRow<I extends string>({
  entry,
  width = THREAD.width,
  naming = 'plain',
  fx = {},
  greyAll = false,
  whyText,
}: {
  entry: AclEntry<I>;
  width?: number;
  naming?: 'plain' | 'windows';
  fx?: RowFx;
  greyAll?: boolean;
  /** Overrides the «para qué» text (default: entry.why). */
  whyText?: string;
}) {
  const f = clamp01(fx.focus ?? 0);
  const show = clamp01(fx.show ?? 1);
  const tone = fx.tone ?? (greyAll ? C.muted : entry.perm === 'deny' ? C.rose : C.emerald);
  const missing = !!fx.missing;
  const service = entry.kind === 'service';
  const mine = clamp01(fx.mine ?? 0);
  const why = clamp01(fx.why ?? 0);
  const text = whyText ?? entry.why;
  return (
    <div style={{ position: 'relative', width, height: ACL.rowH, ...dimStyle(fx.dim ?? 0, show), transform: `translateY(${(1 - show) * 10}px) scale(${1 + 0.035 * f})`, transformOrigin: 'left center' }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          boxSizing: 'border-box',
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          padding: '0 18px 0 16px',
          borderRadius: RADIUS.md,
          border: missing ? `3px dashed ${alpha(tone, 0.55)}` : `${f > 0.3 ? 3 : 2}px solid ${f > 0.02 ? alpha(tone, 0.4 + 0.55 * f) : C.ink600}`,
          background: missing ? alpha(tone, 0.04) : f > 0.02 ? `linear-gradient(90deg, ${alpha(tone, 0.06 + 0.1 * f)}, ${alpha(C.ink850, 0.95)} 70%)` : alpha(C.ink850, 0.94),
          boxShadow: f > 0.02 ? `0 0 ${Math.round(32 * f)}px ${alpha(tone, 0.3 * f)}` : undefined,
          fontFamily: FONT.sans,
        }}
      >
        <Icon name={service ? 'gear' : 'users'} size={44} color={greyAll ? C.muted : service ? C.sky : C.cyan} />
        <span style={{ fontSize: service ? 34 : 38, fontWeight: 800, fontFamily: service ? FONT.mono : FONT.sans, color: greyAll ? C.muted : C.textStrong, whiteSpace: 'nowrap', letterSpacing: service ? -1 : -0.3 }}>
          {entry.who}
        </span>
        <span style={{ flex: 1 }} />
        {mine > 0.01 ? (
          <span style={{ width: 44, height: 44, flexShrink: 0, borderRadius: 22, display: 'grid', placeItems: 'center', background: alpha(C.cyan, 0.2), border: `3px solid ${C.cyan}`, opacity: mine, transform: `scale(${0.6 + 0.4 * mine})` }}>
            <Icon name="key" size={26} color={C.cyan} strokeWidth={2.2} />
          </span>
        ) : null}
        {missing ? null : <PermChip perm={entry.perm} naming={naming} tone={greyAll ? C.muted : tone} on={f} />}
      </div>
      {text && why > 0.01 ? <WhyText x={width} text={text} weight={why} /> : null}
    </div>
  );
}

/** The «para qué» text, hanging from the right edge of a row by a dashed stub. */
function WhyText({ x, text, weight }: { x: number; text: string; weight: number }) {
  return (
    <div style={{ position: 'absolute', left: x, top: 0, height: ACL.rowH, display: 'flex', alignItems: 'center', gap: 16, opacity: weight, transform: `translateX(${(1 - weight) * -16}px)` }}>
      <div style={{ width: 40, borderTop: `4px dashed ${alpha(C.cyan, 0.7)}` }} />
      <span style={{ fontFamily: FONT.sans, fontSize: 42, fontWeight: 750, color: C.text, whiteSpace: 'nowrap' }}>{text}</span>
    </div>
  );
}

export function FolderAcl<I extends string = string>({
  entries,
  name = FOLDER_NAME,
  server = SERVER,
  width = THREAD.width,
  naming = 'plain',
  show = 1,
  fx = {},
  rest = {},
  gate,
  greyAll = false,
  glow = 0,
  style,
}: {
  entries: readonly AclEntry<I>[];
  name?: string;
  /** Small mono line under the name; null hides it. */
  server?: string | null;
  width?: number;
  naming?: 'plain' | 'windows';
  /** 0–1 for the whole folder; rows then ride on their own `fx.show`. */
  show?: number;
  fx?: Partial<Record<I, RowFx>>;
  /** The grey row at the bottom; `false` leaves it out. */
  rest?: RestFx | false;
  /** The small «escribir» barrier at the right of the header. */
  gate?: GateFx;
  greyAll?: boolean;
  glow?: number;
  style?: CSSProperties;
}) {
  const s = clamp01(show);
  const n = entries.length;
  const r = rest === false ? null : rest;
  const rf = clamp01(r?.focus ?? 0);
  const restShow = clamp01(r?.show ?? 1);
  const gateTone = gate ? (gate.open > 0.5 ? C.emerald : C.rose) : C.rose;
  return (
    <div style={{ position: 'relative', width, height: aclHeight(n, rest !== false), opacity: s, fontFamily: FONT.sans, ...style }}>
      {/* header: the folder, its name, the server it lives on, and the gate of «escribir» */}
      <div style={{ position: 'absolute', left: 0, top: 0, width, height: ACL.headH - 12, display: 'flex', alignItems: 'center', gap: 22 }}>
        <FolderGlyph width={96} glow={glow} />
        <div>
          <div style={{ fontSize: 48, fontWeight: 850, letterSpacing: -1, color: C.textStrong, whiteSpace: 'nowrap', lineHeight: 1.05 }}>{name}</div>
          {server ? <div style={{ fontFamily: FONT.mono, fontSize: 28, color: C.muted, marginTop: 4, whiteSpace: 'nowrap' }}>{server}</div> : null}
        </div>
        <span style={{ flex: 1 }} />
        {gate ? (
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12 }}>
            <GateBar width={104} open={gate.open} tone={gateTone} shake={gate.shake ?? 0} />
            <span style={{ fontSize: 32, fontWeight: 800, color: gateTone === C.emerald ? '#6ee7b7' : C.roseSoft, paddingBottom: 6 }}>escribir</span>
          </div>
        ) : null}
      </div>
      {entries.map((e, i) => (
        <div key={e.id} style={{ position: 'absolute', left: 0, top: aclRowTop(i) }}>
          <AclRow entry={e} width={width} naming={naming} fx={fx[e.id] ?? {}} greyAll={greyAll} />
        </div>
      ))}
      {r ? (
        <div style={{ position: 'absolute', left: 0, top: aclRestTop(n), width, height: ACL.restH, ...dimStyle(r.dim ?? 0, restShow), transform: `scale(${1 + 0.03 * rf})`, transformOrigin: 'left center' }}>
          <div
            style={{
              width,
              height: ACL.restH,
              boxSizing: 'border-box',
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              padding: '0 18px 0 16px',
              borderRadius: RADIUS.md,
              border: `3px dashed ${alpha(C.muted, 0.35 + 0.45 * rf)}`,
              background: alpha(C.ink800, 0.55),
            }}
          >
            <Icon name="users" size={40} color={C.faint} />
            <span style={{ fontSize: 36, fontWeight: 700, color: C.muted, whiteSpace: 'nowrap' }}>{r.label ?? REST_LABEL}</span>
          </div>
          {r.note && r.note > 0.01 ? <WhyTextRest weight={clamp01(r.note)} x={width} /> : null}
        </div>
      ) : null}
    </div>
  );
}

function WhyTextRest({ x, weight }: { x: number; weight: number }) {
  return (
    <div style={{ position: 'absolute', left: x, top: 0, height: ACL.restH, display: 'flex', alignItems: 'center', gap: 16, opacity: weight, transform: `translateX(${(1 - weight) * -16}px)` }}>
      <div style={{ width: 40, borderTop: `4px dashed ${alpha(C.rose, 0.7)}` }} />
      <span style={{ fontFamily: FONT.sans, fontSize: 42, fontWeight: 750, color: C.roseSoft, whiteSpace: 'nowrap' }}>{REST_NOTE}</span>
    </div>
  );
}

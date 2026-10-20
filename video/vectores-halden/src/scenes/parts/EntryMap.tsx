import { C, FONT, RADIUS, alpha } from '../../../../engine/src/theme/tokens';
import { clamp01, cubicLength, cubicPath, cubicPoint, curveBetween, type Point } from '../../../../engine/src/ui';
import { ENTRIES, SHEET_TITLE, type EntryAnchor } from '../../data/map';
import { Glyph } from './Glyph';
import { ExamChip } from './Labels';
import { RECEPTION, RECEPTION_ANCHORS, Reception, type ReceptionPart } from './Reception';

/** The map's own size (stage-like units); scenes scale it with a transform. */
export const MAP = { w: 1728, h: 600 } as const;

/** Where the reception sits on the sheet. */
export const MAP_RECEPTION = { x: 564, y: 160, w: 600 } as const;
const RS = MAP_RECEPTION.w / RECEPTION.w;

const BOX_W = 470;
/** Box of each entry (same order as ENTRIES): left column for the mail and the USB, right for the rest. */
export const MAP_BOX: readonly { x: number; y: number; side: 'left' | 'right' }[] = [
  { x: 20, y: 50, side: 'left' },
  { x: 1238, y: 215, side: 'right' },
  { x: 20, y: 370, side: 'left' },
  { x: 1238, y: 420, side: 'right' },
  { x: 1238, y: 10, side: 'right' },
];
/** Height of the title row: the line leaves the box at its middle. */
const ROW_MID = 36;

const PART: Record<EntryAnchor, ReceptionPart> = { mail: 'pc1', phone: 'phone', usb: 'usb', printer: 'printer', updates: 'pc2' };

/** A point of the reception (viewBox units) in map coordinates. */
export function receptionPoint(p: { x: number; y: number }): Point {
  return { x: MAP_RECEPTION.x + p.x * RS, y: MAP_RECEPTION.y + p.y * RS };
}

/** The curve(s) of entry `i`, from its box to the reception (the USB line forks to both ports). */
export function entryCurves(i: number): [Point, Point, Point, Point][] {
  const b = MAP_BOX[i];
  const start = { x: b.side === 'left' ? b.x + BOX_W : b.x, y: b.y + ROW_MID };
  const a = ENTRIES[i].anchor;
  const ends = a === 'usb' ? [RECEPTION_ANCHORS.usb, RECEPTION_ANCHORS.usb2] : [RECEPTION_ANCHORS[a]];
  return ends.map((e) => curveBetween(start, receptionPoint(e), 0.55));
}

const at = (xs: readonly number[] | undefined, i: number, d = 0) => clamp01(xs?.[i] ?? d);

/**
 * The entry map Systems draws on a sheet (s02, s04, s06): the reception in the middle and five hand-drawn lines that
 * reach it, each from a box with what it is and, under it, its exam chip in English. Per line (index as in ENTRIES):
 * `line` draws it, `label` shows its box, `chip` its chip, `lit` lights it (a dot runs along it to the counter),
 * `dim` steps it back. `surface` lights every line and rings the whole sheet (the attack surface). `sheet` fades the
 * paper in. Native size MAP (1728×600).
 */
export function EntryMap({
  frame,
  sheet = 1,
  line,
  label,
  chip,
  lit,
  dim,
  surface = 0,
  title = 1,
}: {
  frame: number;
  sheet?: number;
  line?: readonly number[];
  label?: readonly number[];
  chip?: readonly number[];
  lit?: readonly number[];
  dim?: readonly number[];
  surface?: number;
  /** The sheet's heading. */
  title?: number;
}) {
  const sf = clamp01(surface);
  const recLit: Partial<Record<ReceptionPart, number>> = {};
  ENTRIES.forEach((e, i) => {
    const v = Math.max(at(lit, i), sf * 0.6);
    const part = PART[e.anchor];
    recLit[part] = Math.max(recLit[part] ?? 0, v);
  });
  return (
    <div style={{ position: 'relative', width: MAP.w, height: MAP.h, fontFamily: FONT.sans }}>
      {/* the sheet */}
      <svg width={MAP.w} height={MAP.h} style={{ position: 'absolute', left: 0, top: 0, opacity: clamp01(sheet), overflow: 'visible' }}>
        <defs>
          <pattern id="map-grid" width={40} height={40} patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke={alpha(C.sky, 0.06)} strokeWidth={1.5} />
          </pattern>
        </defs>
        <rect x={0} y={0} width={MAP.w} height={MAP.h} rx={22} fill="#0e182b" />
        <rect x={0} y={0} width={MAP.w} height={MAP.h} rx={22} fill="url(#map-grid)" />
        <rect
          x={1.5}
          y={1.5}
          width={MAP.w - 3}
          height={MAP.h - 3}
          rx={21}
          fill="none"
          stroke={sf > 0.02 ? alpha(C.violet, 0.3 + 0.6 * sf) : alpha(C.sky, 0.25)}
          strokeWidth={sf > 0.02 ? 4 : 2}
          strokeDasharray={sf > 0.02 ? '18 12' : undefined}
          style={{ filter: sf > 0.02 ? `drop-shadow(0 0 ${Math.round(16 * sf)}px ${alpha(C.violet, 0.5 * sf)})` : undefined }}
        />
      </svg>
      <div
        style={{
          position: 'absolute',
          left: MAP_RECEPTION.x,
          top: 22,
          width: MAP_RECEPTION.w,
          textAlign: 'center',
          fontSize: 28,
          fontWeight: 650,
          color: C.muted,
          opacity: clamp01(sheet) * clamp01(title),
          whiteSpace: 'nowrap',
        }}
      >
        {SHEET_TITLE}
      </div>

      {/* the reception */}
      <div style={{ position: 'absolute', left: MAP_RECEPTION.x, top: MAP_RECEPTION.y, opacity: clamp01(sheet) }}>
        <Reception width={MAP_RECEPTION.w} lit={recLit} glow={sf} />
      </div>

      {/* the lines */}
      <svg width={MAP.w} height={MAP.h} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        {ENTRIES.map((_, i) => {
          const d = at(line, i);
          if (d <= 0.001) return null;
          const l = Math.max(at(lit, i), sf);
          const fade = 1 - 0.7 * at(dim, i);
          return entryCurves(i).map((cv, k) => {
            const len = cubicLength(cv);
            const dot = l > 0.05 ? cubicPoint(cv, ((((frame + i * 9) % 42) + 42) % 42) / 42) : null;
            return (
              <g key={`${i}-${k}`} opacity={fade}>
                {l > 0.02 ? <path d={cubicPath(cv)} fill="none" stroke={alpha(C.cyan, 0.25 * l)} strokeWidth={16} strokeLinecap="round" /> : null}
                <path
                  d={cubicPath(cv)}
                  fill="none"
                  stroke={l > 0.02 ? C.cyan : alpha(C.cyan, 0.6)}
                  strokeWidth={l > 0.02 ? 5 : 4}
                  strokeLinecap="round"
                  strokeDasharray={`${len} ${len}`}
                  strokeDashoffset={len * (1 - d)}
                />
                {d > 0.97 ? <circle cx={cv[3].x} cy={cv[3].y} r={7} fill={C.cyan} /> : null}
                {dot && k === 0 && d > 0.97 ? (
                  <g opacity={l}>
                    <circle cx={dot.x} cy={dot.y} r={16} fill={alpha(C.cyan, 0.25)} />
                    <circle cx={dot.x} cy={dot.y} r={8} fill={C.cyanSoft} />
                  </g>
                ) : null}
              </g>
            );
          });
        })}
      </svg>

      {/* the boxes: what it is, and its chip */}
      {ENTRIES.map((e, i) => {
        const s = at(label, i);
        if (s <= 0.001) return null;
        const b = MAP_BOX[i];
        return (
          <div key={e.title} style={{ position: 'absolute', left: b.x, top: b.y, opacity: s * (1 - 0.65 * at(dim, i)), transform: `translateY(${(1 - s) * 12}px)` }}>
            <EntryBox entry={e} lit={Math.max(at(lit, i), sf * 0.7)} chip={at(chip, i)} />
          </div>
        );
      })}
    </div>
  );
}

/** Width of an entry's box. */
export const ENTRY_BOX_W = BOX_W;

/**
 * One entry of the map as a box: its icon, what it is (and a second line), and under it its exam chip (`chip` 0–1).
 * `lit` 0–1 brightens it. Used by the map and on its own (s04's USB line).
 */
export function EntryBox({ entry, lit = 0, chip = 1 }: { entry: (typeof ENTRIES)[number]; lit?: number; chip?: number }) {
  const l = clamp01(lit);
  const c = clamp01(chip);
  return (
    <div
      style={{
        width: BOX_W,
        boxSizing: 'border-box',
        padding: '12px 18px 14px',
        borderRadius: RADIUS.lg,
        border: `3px solid ${alpha(C.cyan, 0.3 + 0.6 * l)}`,
        background: alpha(C.ink850, 0.92),
        boxShadow: l > 0.02 ? `0 0 ${Math.round(26 * l)}px ${alpha(C.cyan, 0.3 * l)}` : undefined,
        fontFamily: FONT.sans,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
        <div style={{ marginTop: 2 }}>
          <Glyph name={entry.icon} size={42} color={l > 0.02 ? C.cyanSoft : C.cyan} />
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 34, fontWeight: 800, lineHeight: '44px', color: C.textStrong, whiteSpace: 'nowrap' }}>{entry.title}</div>
          {entry.sub ? <div style={{ fontSize: 30, fontWeight: 650, lineHeight: '36px', color: C.muted, whiteSpace: 'nowrap' }}>{entry.sub}</div> : null}
        </div>
      </div>
      <div style={{ marginTop: 10, marginLeft: 56, height: 45, opacity: c, transform: `translateX(${(1 - c) * -10}px)` }}>
        <ExamChip text={entry.chip} on={0.5 + 0.5 * Math.max(l, c * 0.4)} />
      </div>
    </div>
  );
}

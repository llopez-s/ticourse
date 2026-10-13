import type { CSSProperties } from 'react';
import { C, FONT, alpha } from '../../../../engine/src/theme/tokens';
import { clamp01, mix } from '../../../../engine/src/ui';
import { Person, type PersonCarry } from './People';

/**
 * V20's shared illustration: CONTROL PLANE / DATA PLANE and the three verbs as a port warehouse seen in
 * section, with three people and a paper (canon: out/scene-brief.md «Visual metaphors»). Drawn ONE way
 * in s03 (full stage), s04/s05 (compact, beside the simulator's cards), s06 and the poster (icon).
 *
 *   UPSTAIRS (cyan = the control plane), left to right:
 *     a cabinet with «el historial» (ledger spines, top) and «las normas» (a rulebook, bottom) · the desk
 *     of «la oficina de pedidos» with its clerk (POLICY ENGINE · decide) · a printer on an open stand and
 *     «el administrativo de turno» beside it (POLICY ADMINISTRATOR · comunica).
 *   THE FLOOR LINE splits the nave in two.
 *   DOWNSTAIRS (neutral steel; hi-vis vests), left to right:
 *     «quien recoge» · a roller track that runs through «el mozo»'s counter (POLICY ENFORCEMENT POINT
 *     (PEP) · aplica; the order system's inlet at the counter's left end, «la bandeja» at its right
 *     end, right under the printer) · the shelf with the mercancía (the resource, the ERP).
 *
 * The sequence reads clockwise, each step a connector with a travelling mark:
 *   `request`   quien recoge → the counter (the pedido slip, an arc)
 *   `consult`   the counter → the office, up «el sistema de pedidos» (a tube with a capsule — never a
 *               phone, a handset or a call)
 *   `decision`  the office → the administrativo (a NEUTRAL dot: the tick stays at the office)
 *   `issue`     the administrativo's printer → down the chute → the mozo's tray (the mark is the `order`)
 *   `traffic`   the roller track between quien recoge and the shelf (the mercancía / the traffic), with
 *               `cargo` boxes sliding on it
 *   `signal`    quien recoge's device → the office's cabinet (a new signal, e.g. the EDR's; rose by
 *               default; meant for the compact variant)
 *
 * WHO DECIDES: the only verdict mark of the part is `verdict`, on the pedido at the office's desk. No
 * prop puts a tick, a cross or a verdict colour on the mozo or on the administrativo (their `focus` is a
 * plain glow). Nothing here is a phone, a door, a key, a gate, a fence, a booth, a barrier or a padlock.
 *
 * Pure and prop-driven: nothing reads the timeline, nothing positions itself (wrap it in an absolutely
 * positioned div), every animation is a 0–1 prop. The drawing is laid out in px for the `width` ×
 * `height` you pass — not a scaled viewBox — so ALL TEXT KEEPS ITS PX SIZE (labels 32, exam names 40
 * wide / 32 compact) while the drawing shrinks. Figure size follows the two floors' height (capped by
 * the width), never the total height: a taller `roof` or band does not change the people's proportions,
 * it only leaves less room.
 *
 * ---------------------------------------------------------------------------------------------------
 * EXPORTS
 *   Warehouse(props: WarehouseProps)            the illustration
 *   warehouseLayout(width, height, opts?)       → WarehouseLayout: every anchor in px from the part's
 *                                               top-left, to overlay your own chips / leaders
 *   Order(props: OrderProps), orderSize(width)  the printed order on its own (a 5:3 ticket)
 *   WAREHOUSE_TEXT                              the canon strings the part writes
 *   types: WarehouseProps, WarehouseLayout, WarehouseLayoutOptions, WarehouseVariant, WarehouseElement,
 *          WarehouseLabel, WarehouseVerb, WarehouseAnchor, WarehousePoint, WarehouseRect, FlowState,
 *          TrafficState, CargoBox, WarehouseOrder, OrderProps
 *
 * VARIANTS (auto from the size; `variant` overrides)
 *   'wide'    width / height ≥ 2.2 (s03: 1728 × 598–660). Room on the upper left for the two item labels;
 *             «quien recoge» and «mozo» go over their heads.
 *   'compact' anything else ≥ 520 px wide (s04/s05: ≈ 1040 × 600; people ≈ 150 px tall). The item labels
 *             do not fit (leave `history` / `rules` off); «quien recoge» and «mozo» go under the ground.
 *   'icon'    width < 520 (recap card / poster, ≈ 300 × 220): no text, no tag bands, thicker lines; by
 *             default only the office, the administrativo and the mozo (requester, shelf, ledger and
 *             rulebook default to 0 — pass 1 to bring them back).
 *
 * LAYOUT OPTIONS (props of Warehouse; pass the same ones to warehouseLayout to get matching anchors)
 *   variant?    see above
 *   labelSize?  px of place labels, small labels, the plane chips, PDP and the zone label. Default 32.
 *   nameSize?   px of the exam names and their verbs. Default 40 (wide) / 32 (compact).
 *   roof?       px of roof space above everything (a gable; tall = a truss roof, as s03 draws while the
 *               intercepted message is up). Default ≈ 3.4 % of the height.
 *   bands?      { top?, bottom? } px reserved for text above the upstairs heads and under the ground.
 *               Defaults: top = place line + name line (L.bands.full); bottom = L.bands.full ('band') or
 *               the name line only (L.bands.one, 'head'). Upstairs tags hang from the top band's bottom
 *               (the name line next to the heads), so with only the names on, top: L.bands.one is enough.
 *   placeDown?  where «quien recoge» and «mozo» are written: 'head' = over their heads, inside the nave;
 *               'band' = first line of the bottom band. Default 'head' (wide) / 'band' (compact).
 *
 * PROPS — every number is 0–1 unless said otherwise
 *   width, height            px box of the part
 *   -- structure
 *   nave = 1                 walls, roof, ground (opacity)
 *   roofDetail = 1           the roof's trusses (only drawn when `roof` is tall)
 *   floor = 1                the line that splits the nave in two; draws left → right
 *   fixtures = 1             the mozo's counter, his tray and the roller track
 *   -- downstairs
 *   requester = 1            quien recoge (0 = not there)
 *   requesterShift = 0       px added to his x (negative = further left, to walk him in)
 *   requesterCarry = 'slip'  'none' | 'slip' (the pedido) | 'box' | 'laptop' (People.tsx's PersonCarry)
 *   requesterCarryTone?      colour of what he carries (default paper white)
 *   requesterCarryMark?      a small warning dot on the carried laptop (a colour, e.g. C.rose)
 *   mozo = 1                 the mozo, behind his counter
 *   mozoCarry = 'none'       what his raised hand holds
 *   mozoFacing = 'left'      'left' (towards quien recoge) | 'right' (towards the tray)
 *   shelf = 1                the shelf with the mercancía
 *   shelfTaken = 0           a COUNT 0–n: how many boxes of the track-level tier are gone, from the left
 *                            (fractional = the next one fading; their slots stay as dashed outlines)
 *   shelfPick = 0            the first box of that tier lights emerald (the one the order names)
 *   shelfLabel?              text on a small plate on the shelf (e.g. 'ERP'); none by default
 *   trayGlow = 0             the tray glows cyan (the order has just landed)
 *   -- upstairs
 *   office = 1               1 = the office's clerk and desk are there (cyan); < 1 = empty: a dashed grey
 *                            outline at `ghosts` strength
 *   admin = 1                the same for the administrativo and his printer
 *   ghosts = 1               how visible the dashed outlines of whoever is absent are (0 = truly empty)
 *   ledger = 1, rulebook = 1 «el historial» and «las normas», in the cabinet left of the desk (they may
 *                            be there while the office is still empty)
 *   deskSlip = 0             the pedido has reached the desk (a slip in the desk's inbox)
 *   verdict = 0              the decision, stamped beside that slip — at the office and nowhere else
 *   verdictKind = 'yes'      'yes' emerald tick | 'no' rose cross | 'ask' amber dots (asks for more proof)
 *   printing = 0             the printer's slot lights
 *   -- the sequence
 *   flows?                   { request?, consult?, decision?, issue?, signal? }: each a number n (= draw n,
 *                            lit n) or a FlowState { draw = 1, lit = 0, mark?, tone? }. `draw` reveals
 *                            the connector from its start, `lit` brightens it, `mark` 0–1 is where its
 *                            travelling mark is (omit / 0 / 1 = none), `tone` recolours it (e.g. C.rose for
 *                            a revocation going engine → administrator → PEP). `issue` has no mark of
 *                            its own: move the `order`.
 *   traffic?                 number or TrafficState { draw = 1, lit = 0, phase?, toShelf = true, cut = 0,
 *                            tone = emerald }: the lit line along the roller track. `phase` (any number,
 *                            e.g. frame / 30) runs its dashes; `toShelf` picks the direction (false =
 *                            shelf → quien recoge); `cut` opens a gap at the mozo's counter and lets the
 *                            line go grey (the PEP cuts the session; two small rose end caps, no barrier).
 *   cargo?                   boxes on the track: numbers t or CargoBox { at, tone?, opacity? }; t = 0 at
 *                            the shelf's first slot, 1 at the pick-up end (linear, not clamped:
 *                            L.cargoSlot(k) is the t of slot k, so a box can start exactly in its slot).
 *                            Steel by default; pass tone C.emerald for granted traffic.
 *   order?                   WarehouseOrder — the printed order (absent by default):
 *                              show = 1      it exists (0 → 1: it comes out of the printer)
 *                              travel = 0    0 = hanging from the printer's mouth, 1 = in the mozo's tray
 *                              zoom = 0      held up big and readable beside where it is: upper right by
 *                                            the printer; right of the tray once there (that spot covers
 *                                            the shelf's corner and the DATA PLANE chip — pass `zoomAt`,
 *                                            or use the standalone Order outside the part)
 *                              zoomWidth?    px width when zoomed (default 300 wide / 240 compact)
 *                              zoomAt?       { x, y } centre of the zoomed order, px from the part's
 *                                            top-left (overrides the default spot)
 *                              title?, mode?, modeTone?, expiry?, clock?, clockLit?, revoked?, stamp?,
 *                              glow?         passed to Order (see OrderProps), e.g. mode 'lectura y
 *                                            escritura' / 'solo lectura' (modeTone 'amber'), expiry
 *                                            '30 min', revoked 1 (stamp 'anulada' by default)
 *   -- text (all off by default)
 *   labels?                  Partial<Record<WarehouseLabel, number>>:
 *                              requester «quien recoge» · mozo «mozo» · office «oficina de pedidos» ·
 *                              admin «administrativo de turno» (place labels, white)
 *                              engine / administrator / pep: the exam names (violet); a name unrolls from
 *                              the left as its value goes 0 → 1
 *                              system «sistema de pedidos» (left of the tube) · history «el historial de
 *                              quien recoge» · rules «las normas · las mismas para todos» (wide only)
 *                              control «CONTROL PLANE» · data «DATA PLANE» (chips at the right end of the
 *                              floor line, above and below it; `control` shares the upper-right corner
 *                              with an order zoomed by the printer)
 *                              pdp «PDP» (a chip between the desk and the printer) · zone «IMPLICIT TRUST
 *                              ZONE» (under the shelf, first line of the bottom band; with placeDown
 *                              'head' it shares that line with the PEP's name — use pepName 'PEP' there)
 *   verbs?                   Partial<Record<WarehouseVerb, number>>: «decide» / «comunica» / «aplica»
 *                            (white), written after their name as «NAME · verbo»; a verb alone is centred
 *   pepName?                 the PEP's name text (default 'POLICY ENFORCEMENT POINT (PEP)'; pass 'PEP'
 *                            for the short form)
 *   -- planes, bracket, zone (all 0 by default; s03 never turns them on)
 *   planes?                  { control?, data? }: a tint over each floor (cyan above, slate below)
 *   pdp = 0                  the dashed cyan bracket around the office and the administrativo
 *   zone = 0                 the dashed emerald outline around the shelf (the implicit trust zone)
 *   -- focus
 *   focus?, dim?             Partial<Record<WarehouseElement, number>> ('requester' | 'mozo' | 'shelf' |
 *                            'office' | 'admin'): focus glows one (steel downstairs, cyan upstairs); its
 *                            labels follow its dim
 *   autoDim = true           when something is in focus the other elements step back (to 40 %)
 *   dimAll = 0               the whole part steps back
 *   style?                   extra CSS on the wrapper
 *
 * COORDINATES — `const L = warehouseLayout(1040, 600)`; all px from the part's top-left:
 *   L.at.<anchor>   requester, requesterHead, requesterHand, pickup, mozo, mozoHead, inlet, tray, counter,
 *                   shelf, shelfTop, office, officeHead, desk, inbox, ledger, rulebook, admin, adminHead,
 *                   printer, tube, decision, chute, traffic (the last four: mid-points of the connectors)
 *   L.rect.<name>   control, data (the two floors), pdp, zone, shelf, counter, desk, cabinet, printer
 *   L.tag.<role>    { x, px, y1, y2 } for requester / mozo / office / admin: centre x of the name line,
 *                   centre x of the place label, top of the place label, top of the name line
 *   L.order         { small, zoom: { w, h }; printer, tray, zoomPrinter, zoomTray: centre points }
 *   L.floorY, L.slab, L.groundY, L.ceilY, L.roof, L.hUp, L.hDown, L.trackY, L.counterTop, L.deskTop,
 *   L.shelfTop, L.x.<element>, L.bands { top, bottom, full, one }, L.cargoX(t), L.cargoSlot(k)
 *
 * USAGE (compact, as in s04/s05):
 *   <div style={{ position: 'absolute', left: 660, top: 40 }}>
 *     <Warehouse
 *       width={1040} height={600}
 *       labels={{ office: 1, admin: 1, mozo: 1, engine: 1, administrator: 1, pep: 1, control, data, pdp }}
 *       verbs={{ engine: 1 }}
 *       requesterCarry="laptop"
 *       flows={{ request: 1, consult: { lit: consult, mark: consultT }, decision: decide, issue }}
 *       deskSlip={1} verdict={decide}
 *       order={{ show: issue, travel: orderT, mode: 'lectura y escritura', expiry: '30 min' }}
 *       traffic={{ draw: traffic, lit: traffic, phase: frame / 30 }} cargo={[{ at: boxT, tone: C.emerald }]}
 *       zone={zone} planes={{ control, data }} pdp={pdp}
 *     />
 *   </div>
 *   Icon:              <Warehouse width={300} height={220} flows={{ consult: 1, decision: 1, issue: 1 }} order={{ travel: 1 }} />
 *   The order alone:   <Order width={150} expiry="30 min" />   (orderSize(150) → { w: 150, h: 90 })
 */

// ---------------------------------------------------------------------------
// Canon strings

export const WAREHOUSE_TEXT = {
  requester: 'quien recoge',
  mozo: 'mozo',
  office: 'oficina de pedidos',
  admin: 'administrativo de turno',
  engine: 'POLICY ENGINE',
  administrator: 'POLICY ADMINISTRATOR',
  pep: 'POLICY ENFORCEMENT POINT (PEP)',
  pepShort: 'PEP',
  verbs: { engine: 'decide', administrator: 'comunica', pep: 'aplica' },
  system: 'sistema de pedidos',
  history: 'el historial de quien recoge',
  rules: 'las normas · las mismas para todos',
  control: 'CONTROL PLANE',
  data: 'DATA PLANE',
  pdp: 'PDP',
  zone: 'IMPLICIT TRUST ZONE',
  order: 'orden',
  revoked: 'anulada',
} as const;

// ---------------------------------------------------------------------------
// Palette (canon «Colour meanings»): steel/slate = structure, cyan = the control plane, emerald = granted
// and flowing, rose = revoked, violet = exam names, dashed grey = absent.

const STRUCT = '#64748b';
const STRUCT_SOFT = '#475569';
const STRUCT_FAINT = '#334155';
const STEEL = '#cbd5e1';
const GHOST = '#64748b';
const BOX_FILL = '#26364d';
const PAPER = '#e2e8f0';
const PAPER_INK = '#0f172a';
const VIOLET_SOFT = '#c4b5fd';
const CTRL = C.cyan;
/** Upstairs clothes: the control plane's cyan, deep enough not to fight the faces. */
const CTRL_CLOTHES = '#0e7490';

// ---------------------------------------------------------------------------
// Types

export type WarehouseVariant = 'wide' | 'compact' | 'icon';
export type WarehouseElement = 'requester' | 'mozo' | 'shelf' | 'office' | 'admin';
export type WarehouseVerb = 'engine' | 'administrator' | 'pep';
export type WarehouseLabel =
  | 'requester'
  | 'mozo'
  | 'office'
  | 'admin'
  | 'engine'
  | 'administrator'
  | 'pep'
  | 'system'
  | 'history'
  | 'rules'
  | 'control'
  | 'data'
  | 'pdp'
  | 'zone';
export type WarehouseAnchor =
  | 'requester'
  | 'requesterHead'
  | 'requesterHand'
  | 'pickup'
  | 'mozo'
  | 'mozoHead'
  | 'inlet'
  | 'tray'
  | 'counter'
  | 'shelf'
  | 'shelfTop'
  | 'office'
  | 'officeHead'
  | 'desk'
  | 'inbox'
  | 'ledger'
  | 'rulebook'
  | 'admin'
  | 'adminHead'
  | 'printer'
  | 'tube'
  | 'decision'
  | 'chute'
  | 'traffic';

export interface WarehousePoint {
  x: number;
  y: number;
}
export interface WarehouseRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface FlowState {
  /** 0–1 the connector is drawn from its start. Default 1. */
  draw?: number;
  /** 0–1 it is lit (the step is happening / has happened). Default 0. */
  lit?: number;
  /** 0–1 position of the travelling mark; omitted, 0 or 1 = no mark. */
  mark?: number;
  /** Colour of the lit line (default: cyan upstairs, steel for the pedido). */
  tone?: string;
}

export interface TrafficState {
  draw?: number;
  lit?: number;
  /** Runs the dashes (any number, e.g. frame / 30). */
  phase?: number;
  /** true (default): quien recoge → the shelf; false: the shelf → quien recoge. */
  toShelf?: boolean;
  /** 0–1 the PEP cuts it: a gap at the counter, the line goes grey. */
  cut?: number;
  tone?: string;
}

export interface CargoBox {
  /** 0 = the shelf's first slot, 1 = the pick-up end (not clamped). */
  at: number;
  tone?: string;
  opacity?: number;
}

export interface OrderProps {
  /** px; the ticket is width × 0.6. Under 130 px it draws bars instead of text ('icon'). */
  width: number;
  /** Header text. Default «orden». */
  title?: string;
  /** What it allows, e.g. 'lectura y escritura' / 'solo lectura'. Omitted: a box glyph and two bars. */
  mode?: string;
  /** 'amber' marks the mode as a restriction («solo lectura»). */
  modeTone?: 'ink' | 'amber';
  /** Text beside the clock, e.g. '30 min'. Omitted: a time bar. */
  expiry?: string;
  /** 0–1 how much of its time has run (the clock's wedge). Default 0.25. */
  clock?: number;
  /** 0–1 a ring around the clock («con su caducidad»). */
  clockLit?: number;
  /** 0–1 annulled: rose, struck through, stamped. */
  revoked?: number;
  /** The stamp's text when revoked. Default «anulada». */
  stamp?: string;
  glow?: number;
  dim?: number;
  detail?: 'full' | 'icon';
  style?: CSSProperties;
}

export interface WarehouseOrder extends Omit<OrderProps, 'width' | 'dim' | 'detail' | 'style'> {
  show?: number;
  travel?: number;
  zoom?: number;
  zoomWidth?: number;
  /** Centre of the zoomed order, px from the part's top-left (overrides the default spot). */
  zoomAt?: WarehousePoint;
}

export interface WarehouseLayoutOptions {
  variant?: WarehouseVariant;
  labelSize?: number;
  nameSize?: number;
  roof?: number;
  bands?: { top?: number; bottom?: number };
  /** Where «quien recoge» and «mozo» are written: over their heads ('head') or in the bottom band's first line ('band'). */
  placeDown?: 'band' | 'head';
}

type XKey =
  | 'requester'
  | 'pickup'
  | 'counter0'
  | 'counter1'
  | 'mozo'
  | 'tube'
  | 'tray'
  | 'shelf0'
  | 'shelf1'
  | 'items0'
  | 'items1'
  | 'desk0'
  | 'desk1'
  | 'clerk'
  | 'printer'
  | 'admin';

export interface WarehouseLayout {
  variant: WarehouseVariant;
  width: number;
  height: number;
  labelSize: number;
  nameSize: number;
  /** Bottom of the roof space = the tie beam. */
  roof: number;
  /** Top of the upstairs floor's room (below the top tag band). */
  ceilY: number;
  /** The line that splits the nave: upstairs people stand on it. */
  floorY: number;
  /** Thickness of that line. */
  slab: number;
  groundY: number;
  /** `full` = a band with both lines; `one` = a band with the name line only. */
  bands: { top: number; bottom: number; full: number; one: number };
  /** Height of an upstairs / a downstairs figure. */
  hUp: number;
  hDown: number;
  /** x of each element, px. */
  x: Record<XKey, number>;
  counterTop: number;
  /** Where boxes sit: the counter's and the roller track's top surface. */
  trackY: number;
  deskTop: number;
  standTop: number;
  shelfTop: number;
  box: { w: number; h: number; pitch: number };
  at: Record<WarehouseAnchor, WarehousePoint>;
  rect: Record<'control' | 'data' | 'pdp' | 'zone' | 'shelf' | 'counter' | 'desk' | 'cabinet' | 'printer', WarehouseRect>;
  /** Where «quien recoge» and «mozo» are written: over their heads or in the bottom band's first line. */
  placeDown: 'band' | 'head';
  /** Per role: `x` = centre of the name line, `px` = centre of the place label, `y1` / `y2` = top of the place label / of the name line. */
  tag: Record<'requester' | 'mozo' | 'office' | 'admin', { x: number; px: number; y1: number; y2: number }>;
  order: {
    small: { w: number; h: number };
    zoom: { w: number; h: number };
    printer: WarehousePoint;
    tray: WarehousePoint;
    zoomPrinter: WarehousePoint;
    zoomTray: WarehousePoint;
  };
  /** x of a cargo box's centre at t (0 = the shelf's first slot, 1 = the pick-up end). */
  cargoX: (t: number) => number;
  /** The t at which a cargo box sits exactly on slot k of the track-level tier. */
  cargoSlot: (k: number) => number;
}

export interface WarehouseProps extends WarehouseLayoutOptions {
  width: number;
  height: number;
  nave?: number;
  roofDetail?: number;
  floor?: number;
  fixtures?: number;
  requester?: number;
  requesterShift?: number;
  requesterCarry?: PersonCarry;
  requesterCarryTone?: string;
  requesterCarryMark?: string;
  mozo?: number;
  mozoCarry?: PersonCarry;
  mozoFacing?: 'left' | 'right';
  shelf?: number;
  shelfTaken?: number;
  shelfPick?: number;
  shelfLabel?: string;
  trayGlow?: number;
  office?: number;
  admin?: number;
  ghosts?: number;
  ledger?: number;
  rulebook?: number;
  deskSlip?: number;
  verdict?: number;
  verdictKind?: 'yes' | 'no' | 'ask';
  printing?: number;
  flows?: Partial<Record<'request' | 'consult' | 'decision' | 'issue' | 'signal', number | FlowState>>;
  traffic?: number | TrafficState;
  cargo?: readonly (number | CargoBox)[];
  order?: WarehouseOrder;
  labels?: Partial<Record<WarehouseLabel, number>>;
  verbs?: Partial<Record<WarehouseVerb, number>>;
  pepName?: string;
  planes?: { control?: number; data?: number };
  pdp?: number;
  zone?: number;
  focus?: Partial<Record<WarehouseElement, number>>;
  dim?: Partial<Record<WarehouseElement, number>>;
  autoDim?: boolean;
  dimAll?: number;
  style?: CSSProperties;
}

// ---------------------------------------------------------------------------
// Layout

/** Where things stand, as fractions of the width. */
const XF: Record<WarehouseVariant, Record<XKey, number>> = {
  wide: {
    requester: 0.115,
    pickup: 0.185,
    counter0: 0.455,
    counter1: 0.727,
    mozo: 0.59,
    tube: 0.493,
    tray: 0.7,
    shelf0: 0.8,
    shelf1: 0.975,
    items0: 0.35,
    items1: 0.4,
    desk0: 0.41,
    desk1: 0.52,
    clerk: 0.465,
    printer: 0.7,
    admin: 0.757,
  },
  compact: {
    requester: 0.085,
    pickup: 0.155,
    counter0: 0.315,
    counter1: 0.6,
    mozo: 0.455,
    tube: 0.345,
    tray: 0.545,
    shelf0: 0.8,
    shelf1: 0.975,
    items0: 0.135,
    items1: 0.205,
    desk0: 0.215,
    desk1: 0.375,
    clerk: 0.295,
    printer: 0.545,
    admin: 0.635,
  },
  icon: {
    requester: 0.07,
    pickup: 0.15,
    counter0: 0.27,
    counter1: 0.75,
    mozo: 0.48,
    tube: 0.335,
    tray: 0.665,
    shelf0: 0.84,
    shelf1: 0.985,
    items0: 0.02,
    items1: 0.11,
    desk0: 0.13,
    desk1: 0.43,
    clerk: 0.245,
    printer: 0.665,
    admin: 0.85,
  },
};

/** Rough advance width of `text` in em (bold Inter): enough to keep two tags from touching. */
function em(text: string): number {
  let w = 0;
  for (const ch of text) {
    if (ch === ' ') w += 0.28;
    else if ('·.,:;()/«»'.includes(ch)) w += 0.34;
    else if (ch >= 'A' && ch <= 'Z') w += ch === 'I' ? 0.3 : ch === 'M' || ch === 'W' ? 0.86 : 0.69;
    else if ('ilj'.includes(ch)) w += 0.27;
    else if ('mw'.includes(ch)) w += 0.86;
    else if ('frt'.includes(ch)) w += 0.38;
    else w += 0.58;
  }
  return w;
}

export function warehouseLayout(width: number, height: number, opts: WarehouseLayoutOptions = {}): WarehouseLayout {
  const variant: WarehouseVariant = opts.variant ?? (width < 520 ? 'icon' : width / height >= 2.2 ? 'wide' : 'compact');
  const icon = variant === 'icon';
  const labelSize = opts.labelSize ?? (icon ? 0 : 32);
  const nameSize = opts.nameSize ?? (icon ? 0 : variant === 'wide' ? 40 : 32);
  const roof = opts.roof ?? Math.max(icon ? 8 : 12, Math.round(height * 0.034));
  const placeDown = opts.placeDown ?? (variant === 'wide' ? 'head' : 'band');
  const full = icon ? 0 : Math.round((labelSize + nameSize) * 1.16 + 8);
  const one = icon ? 0 : Math.round(nameSize * 1.16 + 8);
  const bandTop = opts.bands?.top ?? full;
  const bandBottom = opts.bands?.bottom ?? (placeDown === 'head' ? one : full);
  const pad = icon ? 4 : 8;
  const room = Math.max(40, height - roof - bandTop - bandBottom - pad);
  const upperH = room * 0.44;
  const lowerH = room * 0.56;
  const ceilY = roof + bandTop;
  const floorY = ceilY + upperH;
  const groundY = floorY + lowerH;
  const hUp = Math.min(upperH * 0.88, width * (icon ? 0.25 : 0.14));
  const hDown = Math.min(lowerH * 0.7, width * (icon ? 0.27 : 0.145));
  const slab = Math.max(4, hDown * 0.045);

  const f = XF[variant];
  const x = Object.fromEntries((Object.keys(f) as XKey[]).map((k) => [k, f[k] * width])) as Record<XKey, number>;

  const counterTop = groundY - 0.44 * hDown;
  const trackY = counterTop - 0.035 * hDown;
  const deskTop = floorY - 0.42 * hUp;
  const standTop = floorY - 0.42 * hUp;
  const shelfTop = groundY - hDown;
  const box = { w: 0.22 * hDown, h: 0.2 * hDown, pitch: 0.27 * hDown };

  const printerW = 0.56 * hUp;
  const printerH = 0.24 * hUp;
  const cabinetTop = floorY - 0.86 * hUp;
  const compH = (0.86 * hUp) / 2;

  // The order: small (hanging from the printer, lying in the tray) and zoomed (readable).
  const smallW = 0.34 * hDown;
  const small = { w: smallW, h: smallW * 0.6 };
  const zoomW = icon ? smallW : variant === 'wide' ? 300 : 240;
  const zoom = { w: zoomW, h: zoomW * 0.6 };
  const adminRight = x.admin + 0.25 * hUp;
  const zoomPrinter = {
    x: Math.min(width - 14 - zoom.w / 2, Math.max(adminRight + 24 + zoom.w / 2, (adminRight + width) / 2)),
    y: Math.max(ceilY + 6 + zoom.h / 2, Math.min(floorY - 8 - zoom.h / 2, ceilY + upperH / 2)),
  };
  const zoomTray = {
    x: Math.min(width - 14 - zoom.w / 2, x.tray + 0.3 * hDown + zoom.w / 2),
    y: floorY + slab + 8 + zoom.h / 2,
  };

  // Cargo: slot 0 of the track-level tier → the pick-up end.
  const slot0 = x.shelf0 + 0.06 * hDown + box.w / 2;
  const cargoEnd = x.pickup + 0.05 * hDown + box.w / 2;
  const cargoX = (t: number) => slot0 + (cargoEnd - slot0) * t;
  const cargoSlot = (k: number) => (k * box.pitch) / (cargoEnd - slot0);

  // Tags: two lines centred on their role, clamped to the box, the two upstairs ones pushed apart.
  const T = WAREHOUSE_TEXT;
  const tagW = (place: string, name: string, verb: string) => 1.03 * Math.max(em(place) * labelSize, (em(name) + 0.9 + em(verb)) * nameSize);
  const clampX = (cx: number, w: number) => (w >= width - 24 ? width / 2 : Math.min(Math.max(cx, 12 + w / 2), width - 12 - w / 2));
  const wOffice = tagW(T.office, T.engine, T.verbs.engine);
  const wAdmin = tagW(T.admin, T.administrator, T.verbs.administrator);
  const wMozo = tagW(placeDown === 'head' ? '' : T.mozo, T.pep, T.verbs.pep);
  let officeX = clampX((x.items0 + x.desk1) / 2, wOffice);
  let adminX = clampX((x.printer + x.admin) / 2 + 0.1 * hUp, wAdmin);
  const gap = 40;
  const over = officeX + wOffice / 2 + gap - (adminX - wAdmin / 2);
  if (over > 0 && !icon) {
    adminX = clampX(adminX + over / 2, wAdmin);
    officeX = Math.max(12 + wOffice / 2, Math.min(officeX, adminX - wAdmin / 2 - gap - wOffice / 2));
    adminX = clampX(Math.max(adminX, officeX + wOffice / 2 + gap + wAdmin / 2), wAdmin);
  }
  // Upstairs tags hang from the band's bottom (the name line next to the heads), downstairs ones from its top.
  const line1 = labelSize * 1.16;
  const topY2 = ceilY - 4 - nameSize * 1.16;
  const topY1 = topY2 - line1;
  const bottomY1 = groundY + pad + 2;
  const downPlaceY = placeDown === 'head' ? groundY - hDown - 6 - line1 : bottomY1;
  const downNameY = placeDown === 'head' ? bottomY1 : bottomY1 + line1;
  const requesterX = clampX(x.requester, 1.03 * em(T.requester) * labelSize);
  const mozoX = clampX(x.mozo, wMozo);

  const yChestDown = groundY - 0.62 * hDown;
  const yChestUp = floorY - 0.62 * hUp;
  const decisionY = deskTop - 0.2 * hUp;
  const decision0 = x.desk1 + 0.08 * hUp;
  const decision1 = x.printer - printerW / 2 - 0.08 * hUp;

  const pdpX0 = x.items0 - 14;
  const pdpX1 = Math.min(width - 6, adminRight + 14);
  const zoneX0 = x.shelf0 - 12;
  const zoneX1 = Math.min(width - 5, x.shelf1 + 12);

  return {
    variant,
    width,
    height,
    labelSize,
    nameSize,
    roof,
    ceilY,
    floorY,
    slab,
    groundY,
    bands: { top: bandTop, bottom: bandBottom, full, one },
    hUp,
    hDown,
    x,
    counterTop,
    trackY,
    deskTop,
    standTop,
    shelfTop,
    box,
    at: {
      requester: { x: x.requester, y: yChestDown },
      requesterHead: { x: x.requester, y: groundY - hDown },
      requesterHand: { x: x.requester + 0.26 * hDown, y: groundY - 0.64 * hDown },
      pickup: { x: cargoEnd, y: trackY },
      mozo: { x: x.mozo, y: yChestDown },
      mozoHead: { x: x.mozo, y: groundY - hDown },
      inlet: { x: x.tube, y: trackY },
      tray: { x: x.tray, y: trackY },
      counter: { x: (x.counter0 + x.counter1) / 2, y: trackY },
      shelf: { x: (x.shelf0 + x.shelf1) / 2, y: (shelfTop + groundY) / 2 },
      shelfTop: { x: (x.shelf0 + x.shelf1) / 2, y: shelfTop },
      office: { x: x.clerk, y: yChestUp },
      officeHead: { x: x.clerk, y: floorY - hUp },
      desk: { x: (x.desk0 + x.desk1) / 2, y: deskTop },
      inbox: { x: x.tube, y: deskTop },
      ledger: { x: (x.items0 + x.items1) / 2, y: cabinetTop + compH / 2 },
      rulebook: { x: (x.items0 + x.items1) / 2, y: cabinetTop + compH * 1.5 },
      admin: { x: x.admin, y: yChestUp },
      adminHead: { x: x.admin, y: floorY - hUp },
      printer: { x: x.printer, y: standTop - printerH / 2 },
      tube: { x: x.tube, y: (floorY + slab + trackY) / 2 },
      decision: { x: (decision0 + decision1) / 2, y: decisionY },
      chute: { x: x.tray, y: (floorY + slab + trackY) / 2 },
      traffic: { x: (x.counter1 + x.shelf0) / 2, y: trackY },
    },
    rect: {
      control: { x: 0, y: roof, w: width, h: floorY - roof },
      data: { x: 0, y: floorY + slab, w: width, h: groundY - floorY - slab },
      pdp: { x: pdpX0, y: ceilY + 2, w: pdpX1 - pdpX0, h: floorY - 4 - ceilY - 2 },
      zone: { x: zoneX0, y: shelfTop - 12, w: zoneX1 - zoneX0, h: groundY + 4 - shelfTop + 12 },
      shelf: { x: x.shelf0, y: shelfTop, w: x.shelf1 - x.shelf0, h: groundY - shelfTop },
      counter: { x: x.counter0, y: counterTop, w: x.counter1 - x.counter0, h: groundY - counterTop },
      desk: { x: x.desk0, y: deskTop, w: x.desk1 - x.desk0, h: floorY - deskTop },
      cabinet: { x: x.items0, y: cabinetTop, w: x.items1 - x.items0, h: floorY - cabinetTop },
      printer: { x: x.printer - printerW / 2, y: standTop - printerH, w: printerW, h: printerH },
    },
    placeDown,
    tag: {
      requester: { x: requesterX, px: requesterX, y1: downPlaceY, y2: downNameY },
      mozo: { x: mozoX, px: placeDown === 'head' ? x.mozo : mozoX, y1: downPlaceY, y2: downNameY },
      office: { x: officeX, px: officeX, y1: topY1, y2: topY2 },
      admin: { x: adminX, px: adminX, y1: topY1, y2: topY2 },
    },
    order: {
      small,
      zoom,
      printer: { x: x.printer, y: standTop + 5 + small.h / 2 },
      tray: { x: x.tray, y: trackY - 2 - small.h / 2 },
      zoomPrinter,
      zoomTray,
    },
    cargoX,
    cargoSlot,
  };
}

// ---------------------------------------------------------------------------
// Small helpers

function mixHex(a: string, b: string, t: number): string {
  const k = clamp01(t);
  const p = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const [r1, g1, b1] = p(a);
  const [r2, g2, b2] = p(b);
  const c = (m: number, n: number) => Math.round(m + (n - m) * k).toString(16).padStart(2, '0');
  return `#${c(r1, r2)}${c(g1, g2)}${c(b1, b2)}`;
}

const dropGlow = (color: string, g: number) => (g > 0.01 ? `drop-shadow(0 0 ${Math.round(5 + 16 * g)}px ${alpha(color, 0.65 * g)})` : '');
const joinFilters = (...f: string[]) => f.filter(Boolean).join(' ') || undefined;

function flowOf(v: number | FlowState | undefined): { draw: number; lit: number; mark?: number; tone?: string } {
  if (v === undefined) return { draw: 0, lit: 0 };
  if (typeof v === 'number') return { draw: clamp01(v), lit: clamp01(v) };
  return { draw: clamp01(v.draw ?? 1), lit: clamp01(v.lit ?? 0), mark: v.mark, tone: v.tone };
}

/** Opacity of a travelling mark at t: nothing at the ends, a short fade next to them. */
const markFade = (t: number | undefined) => (t === undefined || t <= 0 || t >= 1 ? 0 : Math.min(1, t * 9, (1 - t) * 9));

function Arrow({ x, y, angle, size, color, opacity = 1 }: { x: number; y: number; angle: number; size: number; color: string; opacity?: number }) {
  if (opacity <= 0.01) return null;
  return (
    <path
      d={`M 0 0 L ${-size} ${-size * 0.6} L ${-size * 0.7} 0 L ${-size} ${size * 0.6} Z`}
      transform={`translate(${x} ${y}) rotate(${angle})`}
      fill={color}
      stroke={color}
      strokeWidth={size * 0.12}
      strokeLinejoin="round"
      opacity={opacity}
    />
  );
}

/** A carton, bottom-centre at (x, y). */
function Carton({ x, y, w, h, stroke = STEEL, sw, opacity = 1, glow = 0 }: { x: number; y: number; w: number; h: number; stroke?: string; sw: number; opacity?: number; glow?: number }) {
  if (opacity <= 0.01) return null;
  return (
    <g opacity={opacity} style={glow > 0.01 ? { filter: dropGlow(stroke, glow) } : undefined}>
      <rect x={x - w / 2} y={y - h} width={w} height={h} rx={w * 0.08} fill={BOX_FILL} stroke={stroke} strokeWidth={sw} />
      <line x1={x - w / 2} y1={y - h * 0.62} x2={x + w / 2} y2={y - h * 0.62} stroke={alpha(stroke, 0.5)} strokeWidth={sw * 0.7} />
      <line x1={x} y1={y - h} x2={x} y2={y - h * 0.62} stroke={alpha(stroke, 0.75)} strokeWidth={sw * 0.8} />
    </g>
  );
}

/** The pedido: a small paper slip centred at (x, y), `h` tall. */
function Slip({ x, y, h, opacity = 1, rotate = 0 }: { x: number; y: number; h: number; opacity?: number; rotate?: number }) {
  if (opacity <= 0.01) return null;
  const w = h * 0.78;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`} opacity={opacity}>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={h * 0.08} fill={PAPER} stroke={alpha(PAPER_INK, 0.5)} strokeWidth={Math.max(1, h * 0.04)} />
      <path
        d={`M ${-w * 0.3} ${-h * 0.22} H ${w * 0.3} M ${-w * 0.3} 0 H ${w * 0.3} M ${-w * 0.3} ${h * 0.22} H ${w * 0.08}`}
        stroke={alpha(PAPER_INK, 0.55)}
        strokeWidth={Math.max(1.2, h * 0.07)}
        strokeLinecap="round"
      />
    </g>
  );
}

/** A dashed outline where somebody is not there yet: feet on (x, y), `h` tall (People.tsx proportions). */
function GhostPerson({ x, y, h, opacity, sw }: { x: number; y: number; h: number; opacity: number; sw: number }) {
  if (opacity <= 0.01) return null;
  const s = h / 240;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={opacity} fill={alpha(C.ink900, 0.5)} stroke={GHOST} strokeWidth={sw / s} strokeDasharray={`${7 / s} ${6 / s}`} strokeLinecap="round" strokeLinejoin="round">
      <circle cx={0} cy={-207} r={17} />
      <path d="M -27 -176 Q 0 -190 27 -176 L 33 -110 L 23 -100 L 22 -4 L -22 -4 L -23 -100 L -33 -110 Z" />
    </g>
  );
}

// ---------------------------------------------------------------------------
// The printed order

/** The ticket's box: width × 0.6. */
export function orderSize(width: number) {
  return { w: width, h: Math.round(width * 0.6) };
}

/**
 * «La orden, con su caducidad» = the token: a paper ticket, cyan as issued (the control plane's paper),
 * «orden» on its header, what / how much as rows, and a clock with its expiry. `revoked` annuls it
 * (rose, struck through, stamped). Sized from `width` alone (texts included: 240 px is the readable size).
 */
export function Order({
  width,
  title = WAREHOUSE_TEXT.order,
  mode,
  modeTone = 'ink',
  expiry,
  clock = 0.25,
  clockLit = 0,
  revoked = 0,
  stamp = WAREHOUSE_TEXT.revoked,
  glow = 0,
  dim = 0,
  detail,
  style,
}: OrderProps) {
  const { h } = orderSize(width);
  const u = width / 240;
  const full = (detail ?? (width >= 130 ? 'full' : 'icon')) === 'full';
  const rv = clamp01(revoked);
  const g = clamp01(glow);
  const d = clamp01(dim);
  const edge = mixHex(C.cyanDeep, '#be123c', rv);
  const head = mixHex(C.cyanDeep, '#9f1239', rv);
  const paper = mixHex('#e6fbff', '#ffe4e8', rv);
  const ink = mixHex('#0f172a', '#4c0519', rv);
  const accent = mixHex(C.cyan, C.rose, rv);
  const headH = 40 * u;
  const padX = 13 * u;
  const inner = width - 2 * padX;
  const modeSize = mode ? Math.min(24 * u, inner / (em(mode) * 1.04 + (modeTone === 'amber' ? 0.9 : 0))) : 0;
  const cl = clamp01(clock);
  const lit = clamp01(clockLit);
  // Clock wedge: from 12 o'clock, clockwise.
  const R = 18;
  const ang = cl * 2 * Math.PI;
  const wedge = cl >= 0.999 ? '' : `M 0 0 L 0 ${-R} A ${R} ${R} 0 ${cl > 0.5 ? 1 : 0} 1 ${R * Math.sin(ang)} ${-R * Math.cos(ang)} Z`;
  const clockPx = 46 * u;
  const longStamp = em(stamp) > 6;
  const stamped = clamp01(rv * 2 - 0.6);
  return (
    <div
      style={{
        position: 'relative',
        width,
        height: h,
        boxSizing: 'border-box',
        borderRadius: 8 * u,
        border: `${Math.max(1.5, 2.6 * u)}px solid ${edge}`,
        background: paper,
        boxShadow: `0 0 ${Math.round(6 + 30 * g)}px ${alpha(accent, 0.18 + 0.5 * g)}, 0 ${Math.round(5 * u)}px ${Math.round(12 * u)}px ${alpha('#000000', 0.45)}`,
        overflow: 'hidden',
        fontFamily: FONT.sans,
        opacity: 1 - 0.6 * d,
        filter: d > 0.01 ? `saturate(${1 - 0.6 * d})` : undefined,
        ...style,
      }}
    >
      {/* Header: «orden» */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          right: 0,
          height: headH,
          background: head,
          display: 'flex',
          alignItems: 'center',
          paddingLeft: padX,
          color: '#f0fdff',
          fontSize: 27 * u,
          fontWeight: 850,
          letterSpacing: 0.4 * u,
          lineHeight: 1,
        }}
      >
        {full ? title : <span style={{ width: 0.42 * width, height: Math.max(3, 9 * u), borderRadius: 9, background: alpha('#f0fdff', 0.85) }} />}
      </div>

      {/* What / how much */}
      <div style={{ position: 'absolute', left: padX, width: inner, top: headH + 8 * u, height: 36 * u, display: 'flex', alignItems: 'center', gap: 9 * u, whiteSpace: 'nowrap' }}>
        {mode && full ? (
          <span
            style={{
              fontSize: modeSize,
              fontWeight: 820,
              lineHeight: 1.15,
              color: modeTone === 'amber' ? '#78350f' : ink,
              background: modeTone === 'amber' ? alpha(C.amber, 0.55) : 'transparent',
              padding: modeTone === 'amber' ? `${2 * u}px ${0.4 * modeSize}px` : 0,
              borderRadius: 6 * u,
            }}
          >
            {mode}
          </span>
        ) : (
          <>
            <svg width={30 * u} height={26 * u} viewBox="0 0 30 26" style={{ display: 'block', flexShrink: 0 }}>
              <rect x={2} y={3} width={26} height={21} rx={2.5} fill={alpha(ink, 0.12)} stroke={ink} strokeWidth={2.6} />
              <path d="M 2 11 H 28 M 15 3 V 11" stroke={ink} strokeWidth={2.2} />
            </svg>
            <span style={{ display: 'flex', flexDirection: 'column', gap: 6 * u }}>
              <span style={{ display: 'block', width: 0.5 * inner, height: Math.max(2.5, 7 * u), borderRadius: 9, background: alpha(ink, 0.8) }} />
              <span style={{ display: 'block', width: 0.3 * inner, height: Math.max(2.5, 7 * u), borderRadius: 9, background: alpha(ink, 0.5) }} />
            </span>
          </>
        )}
      </div>

      {/* The clock and its expiry */}
      <div style={{ position: 'absolute', left: padX, width: inner, bottom: 7 * u, height: clockPx, display: 'flex', alignItems: 'center', gap: 11 * u, whiteSpace: 'nowrap', opacity: longStamp && full ? 1 - 0.8 * rv : 1 }}>
        <svg width={clockPx} height={clockPx} viewBox="-23 -23 46 46" style={{ display: 'block', flexShrink: 0, overflow: 'visible' }}>
          {lit > 0.01 ? <circle r={22 + 4 * lit} fill="none" stroke={alpha(accent, 0.9 * lit)} strokeWidth={3.5} /> : null}
          <circle r={R + 2} fill="#ffffff" stroke={ink} strokeWidth={3} />
          {cl >= 0.999 ? <circle r={R} fill={alpha(accent, 0.6)} /> : <path d={wedge} fill={alpha(accent, 0.6)} />}
          <path d={`M 0 0 L 0 ${-R * 0.72} M 0 0 L ${R * 0.5 * Math.sin(ang)} ${-R * 0.5 * Math.cos(ang)}`} stroke={ink} strokeWidth={3} strokeLinecap="round" />
          <circle r={2.6} fill={ink} />
        </svg>
        {expiry && full ? (
          <span style={{ fontSize: 27 * u, fontWeight: 850, lineHeight: 1, color: ink }}>{expiry}</span>
        ) : (
          <span style={{ position: 'relative', display: 'block', width: 0.42 * inner, height: Math.max(3, 9 * u), borderRadius: 9, background: alpha(ink, 0.2) }}>
            <span style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${Math.round((1 - cl) * 100)}%`, borderRadius: 9, background: alpha(ink, 0.75) }} />
          </span>
        )}
      </div>

      {/* Annulled: struck through and stamped */}
      {rv > 0.01 ? (
        <>
          <svg width={width} height={h} viewBox={`0 0 ${width} ${h}`} style={{ position: 'absolute', left: 0, top: 0, display: 'block' }}>
            <line
              x1={0.06 * width}
              y1={h * 0.92}
              x2={0.06 * width + 0.88 * width * rv}
              y2={h * 0.92 - (h * 0.92 - headH - 7 * u) * rv}
              stroke={alpha(C.rose, 0.82)}
              strokeWidth={Math.max(2.2, 5 * u)}
              strokeLinecap="round"
            />
          </svg>
          {full && stamp ? (
            <div
              style={{
                position: 'absolute',
                ...(longStamp ? { left: '50%', bottom: 9 * u } : { right: 8 * u, top: 3 * u }),
                padding: `${2 * u}px ${9 * u}px ${3 * u}px`,
                borderRadius: 7 * u,
                border: `${Math.max(2, 3 * u)}px solid ${C.rose}`,
                background: alpha('#fff1f2', 0.94),
                color: '#be123c',
                fontSize: Math.min((longStamp ? 24 : 21) * u, (width - 44 * u) / (em(stamp) * 1.1)),
                fontWeight: 880,
                lineHeight: 1.1,
                letterSpacing: 0.5 * u,
                whiteSpace: 'nowrap',
                opacity: stamped,
                transform: `${longStamp ? 'translateX(-50%) rotate(-3deg)' : 'rotate(-5deg)'} scale(${1.3 - 0.3 * stamped})`,
              }}
            >
              {stamp}
            </div>
          ) : null}
        </>
      ) : null}
    </div>
  );
}

// ---------------------------------------------------------------------------
// The warehouse

const ELEMENTS: readonly WarehouseElement[] = ['requester', 'mozo', 'shelf', 'office', 'admin'];

export function Warehouse({
  width,
  height,
  variant,
  labelSize,
  nameSize,
  roof,
  bands,
  nave = 1,
  roofDetail = 1,
  floor = 1,
  fixtures = 1,
  requester,
  requesterShift = 0,
  requesterCarry = 'slip',
  requesterCarryTone = PAPER,
  requesterCarryMark,
  mozo = 1,
  mozoCarry = 'none',
  mozoFacing = 'left',
  shelf,
  shelfTaken = 0,
  shelfPick = 0,
  shelfLabel,
  trayGlow = 0,
  office = 1,
  admin = 1,
  ghosts = 1,
  ledger,
  rulebook,
  deskSlip = 0,
  verdict = 0,
  verdictKind = 'yes',
  printing = 0,
  flows = {},
  traffic,
  cargo = [],
  order,
  labels = {},
  verbs = {},
  pepName = WAREHOUSE_TEXT.pep,
  planes = {},
  pdp = 0,
  zone = 0,
  focus = {},
  dim = {},
  autoDim = true,
  dimAll = 0,
  style,
}: WarehouseProps) {
  const L = warehouseLayout(width, height, { variant, labelSize, nameSize, roof, bands });
  const icon = L.variant === 'icon';
  const W = width;
  const h = L.hDown;
  const hu = L.hUp;
  const g = L.groundY;
  const fl = L.floorY;
  const sw = Math.max(2, h * (icon ? 0.03 : 0.02));
  const thin = Math.max(1.3, h * 0.0125);
  const T = WAREHOUSE_TEXT;

  const pRequester = clamp01(requester ?? (icon ? 0 : 1));
  const pShelf = clamp01(shelf ?? (icon ? 0 : 1));
  const pLedger = clamp01(ledger ?? (icon ? 0 : 1));
  const pRulebook = clamp01(rulebook ?? (icon ? 0 : 1));
  const pMozo = clamp01(mozo);
  const pOffice = clamp01(office);
  const pAdmin = clamp01(admin);
  const pGhost = clamp01(ghosts);
  const nv = clamp01(nave);
  const fx = clamp01(fixtures);

  // ---- focus / dim -----------------------------------------------------------------------------------
  const maxF = ELEMENTS.reduce((m, k) => Math.max(m, clamp01(focus[k] ?? 0)), 0);
  const fd = (k: WarehouseElement) => {
    const f = clamp01(focus[k] ?? 0);
    return { focus: f, dim: Math.max(clamp01(dim[k] ?? 0), autoDim ? Math.max(0, maxF - f) : 0) * (1 - f) };
  };
  const dimCss = (k: WarehouseElement, show = 1): CSSProperties => {
    const d = fd(k).dim;
    return { opacity: show * (1 - 0.6 * d), filter: d > 0.01 ? `saturate(${1 - 0.5 * d})` : undefined };
  };
  const groupCss = (k: WarehouseElement, color: string, show = 1): CSSProperties => {
    const s = fd(k);
    return { opacity: show * (1 - 0.6 * s.dim), filter: joinFilters(dropGlow(color, s.focus * 0.8), s.dim > 0.01 ? `saturate(${1 - 0.5 * s.dim})` : '') };
  };

  // ---- flows -----------------------------------------------------------------------------------------
  const fRequest = flowOf(flows.request);
  const fConsult = flowOf(flows.consult);
  const fDecision = flowOf(flows.decision);
  const fIssue = flowOf(flows.issue);
  const fSignal = flowOf(flows.signal);
  const tr = typeof traffic === 'number' ? { draw: clamp01(traffic), lit: clamp01(traffic), phase: 0, toShelf: true, cut: 0, tone: C.emerald } : { draw: clamp01(traffic?.draw ?? (traffic ? 1 : 0)), lit: clamp01(traffic?.lit ?? 0), phase: traffic?.phase ?? 0, toShelf: traffic?.toShelf ?? true, cut: clamp01(traffic?.cut ?? 0), tone: traffic?.tone ?? C.emerald };

  // ---- nave ------------------------------------------------------------------------------------------
  const apexY = Math.max(2, L.roof * 0.2);
  const tall = clamp01((L.roof - 50) / 90) * clamp01(roofDetail);
  const rafterY = (xx: number) => L.roof + (apexY - L.roof) * (1 - Math.abs(xx - W / 2) / (W / 2));
  const wallW = Math.max(3, sw * 1.2);
  const naveEl = (
    <g opacity={nv}>
      <path d={`M 0 ${g} L 0 ${L.roof} L ${W / 2} ${apexY} L ${W} ${L.roof} L ${W} ${g} Z`} fill={alpha(C.ink900, 0.6)} />
      {tall > 0.01 ? (
        <g stroke={STRUCT_FAINT} strokeWidth={Math.max(2, sw * 0.9)} strokeLinecap="round" opacity={tall} fill="none">
          {[1 / 6, 2 / 6, 3 / 6, 4 / 6, 5 / 6].map((k) => (
            <line key={k} x1={W * k} y1={L.roof} x2={W * k} y2={rafterY(W * k)} />
          ))}
          <path
            d={`M ${W / 6} ${L.roof} L ${(W * 2) / 6} ${rafterY((W * 2) / 6)} M ${(W * 2) / 6} ${L.roof} L ${W / 2} ${apexY} M ${(W * 4) / 6} ${L.roof} L ${W / 2} ${apexY} M ${(W * 5) / 6} ${L.roof} L ${(W * 4) / 6} ${rafterY((W * 4) / 6)}`}
          />
        </g>
      ) : null}
      <line x1={0} y1={L.roof} x2={W} y2={L.roof} stroke={STRUCT_SOFT} strokeWidth={thin * 1.2} />
      <path d={`M ${wallW / 2} ${g} L ${wallW / 2} ${L.roof} L ${W / 2} ${apexY} L ${W - wallW / 2} ${L.roof} L ${W - wallW / 2} ${g}`} fill="none" stroke={STRUCT} strokeWidth={wallW} strokeLinejoin="round" />
      <line x1={0} y1={g} x2={W} y2={g} stroke={STRUCT} strokeWidth={wallW} strokeLinecap="round" />
    </g>
  );

  // ---- planes (tints) ---------------------------------------------------------------------------------
  const pControl = clamp01(planes.control ?? 0);
  const pData = clamp01(planes.data ?? 0);
  const planesEl = (
    <g>
      {pControl > 0.01 ? <rect x={wallW} y={L.roof} width={W - 2 * wallW} height={fl - L.roof} fill={alpha(C.cyan, 0.09 * pControl)} /> : null}
      {pData > 0.01 ? <rect x={wallW} y={fl + L.slab} width={W - 2 * wallW} height={g - fl - L.slab} fill={alpha('#94a3b8', 0.1 * pData)} /> : null}
    </g>
  );

  // ---- the floor line ---------------------------------------------------------------------------------
  const pFloor = clamp01(floor);
  const floorEl =
    pFloor > 0.001 ? (
      <g>
        <rect x={0} y={fl} width={W * pFloor} height={L.slab} fill={STRUCT_SOFT} />
        <line x1={0} y1={fl} x2={W * pFloor} y2={fl} stroke={STEEL} strokeWidth={thin * 1.3} opacity={0.75} />
      </g>
    ) : null;

  // ---- downstairs: shelf -----------------------------------------------------------------------------
  const sx0 = L.x.shelf0;
  const sx1 = L.x.shelf1;
  const boards = [g - 0.07 * h, L.trackY, g - 0.72 * h];
  const perTier = Math.max(1, Math.floor((sx1 - sx0 - 0.1 * h) / L.box.pitch));
  const taken = Math.max(0, shelfTaken);
  const pick = clamp01(shelfPick);
  const shelfEl =
    pShelf > 0.01 ? (
      <g style={groupCss('shelf', STEEL, pShelf)}>
        <rect x={sx0} y={L.shelfTop} width={sx1 - sx0} height={g - L.shelfTop} fill={alpha(C.ink850, 0.7)} />
        {boards.map((by, tier) => (
          <g key={tier}>
            {Array.from({ length: perTier }, (_, k) => {
              const bx = sx0 + 0.06 * h + L.box.w / 2 + k * L.box.pitch;
              const gone = tier === 1 ? clamp01(taken - k) : 0;
              const lit = tier === 1 && k === 0 ? pick : 0;
              return (
                <g key={k}>
                  {gone > 0.01 && !icon ? (
                    <rect x={bx - L.box.w / 2} y={by - L.box.h} width={L.box.w} height={L.box.h} rx={2} fill="none" stroke={STRUCT_FAINT} strokeWidth={thin} strokeDasharray="5 5" opacity={gone} />
                  ) : null}
                  <Carton x={bx} y={by} w={L.box.w} h={L.box.h} sw={thin * (1 + 0.5 * lit)} stroke={lit > 0.01 ? mixHex(STEEL, C.emerald, lit) : STEEL} opacity={1 - gone} glow={lit} />
                </g>
              );
            })}
            <line x1={sx0} y1={by + thin} x2={sx1} y2={by + thin} stroke={STRUCT} strokeWidth={sw} />
          </g>
        ))}
        <path d={`M ${sx0} ${g} V ${L.shelfTop} H ${sx1} V ${g}`} fill="none" stroke={STRUCT} strokeWidth={sw * 1.15} strokeLinejoin="round" />
      </g>
    ) : null;

  // ---- downstairs: roller track, counter, tray --------------------------------------------------------
  const railH = Math.max(3, 0.05 * h);
  const trackRun = (x0: number, x1: number, key: string) => {
    if (x1 - x0 < 6) return null;
    const rollers: number[] = [];
    for (let xx = x0 + 0.08 * h; xx < x1 - 0.04 * h; xx += 0.16 * h) rollers.push(xx);
    const legs: number[] = [];
    const n = Math.max(1, Math.round((x1 - x0) / (1.1 * h)));
    for (let i = 0; i <= n; i++) legs.push(x0 + 0.06 * h + ((x1 - x0 - 0.12 * h) * i) / n);
    return (
      <g key={key}>
        {legs.map((xx) => (
          <line key={xx} x1={xx} y1={L.trackY + railH} x2={xx} y2={g} stroke={STRUCT_SOFT} strokeWidth={thin * 1.3} />
        ))}
        <rect x={x0} y={L.trackY} width={x1 - x0} height={railH} rx={railH / 2} fill={STRUCT_FAINT} stroke={STRUCT} strokeWidth={thin} />
        {!icon
          ? rollers.map((xx) => <circle key={xx} cx={xx} cy={L.trackY + railH / 2} r={railH * 0.32} fill={alpha(STEEL, 0.75)} />)
          : null}
      </g>
    );
  };
  const tw = 0.44 * h;
  const th = 0.1 * h;
  const tg = clamp01(trayGlow);
  const counterBack = fx > 0.01 ? <g opacity={fx}>{[trackRun(L.x.pickup, L.x.counter0, 'tl'), pShelf > 0.01 ? trackRun(L.x.counter1, sx0, 'tr') : null]}</g> : null;
  const counterEl =
    fx > 0.01 ? (
      <g style={dimCss('mozo', fx)}>
        <rect x={L.x.counter0} y={L.counterTop} width={L.x.counter1 - L.x.counter0} height={g - L.counterTop} fill={C.ink850} stroke={alpha(STEEL, 0.85)} strokeWidth={sw} />
        {!icon ? (
          <path
            d={[0.25, 0.5, 0.75].map((k) => `M ${mix(L.x.counter0, L.x.counter1, k)} ${L.counterTop + 0.08 * h} V ${g - 0.06 * h}`).join(' ')}
            stroke={STRUCT_FAINT}
            strokeWidth={thin}
          />
        ) : null}
        <rect x={L.x.counter0 - 0.03 * h} y={L.trackY} width={L.x.counter1 - L.x.counter0 + 0.06 * h} height={0.075 * h} rx={0.02 * h} fill="#334155" stroke={STEEL} strokeWidth={thin * 1.2} />
        {/* la bandeja */}
        <g style={tg > 0.01 ? { filter: dropGlow(CTRL, tg) } : undefined}>
          <path
            d={`M ${L.x.tray - tw / 2} ${L.trackY - th} L ${L.x.tray - tw / 2 + 0.05 * h} ${L.trackY} H ${L.x.tray + tw / 2 - 0.05 * h} L ${L.x.tray + tw / 2} ${L.trackY - th}`}
            fill={alpha(C.ink900, 0.9)}
            stroke={mixHex(STEEL, C.cyanSoft, tg)}
            strokeWidth={sw}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </g>
      </g>
    ) : null;

  // ---- downstairs: people -----------------------------------------------------------------------------
  const mozoEl = pMozo > 0.01 ? (
    <g style={dimCss('mozo')}>
      <Person x={L.x.mozo} y={g} h={h} vest={1} carry={mozoCarry} carryTone={PAPER} facing={mozoFacing} opacity={pMozo} glow={fd('mozo').focus * 0.7} glowTone={STEEL} />
    </g>
  ) : null;
  const requesterEl = pRequester > 0.01 ? (
    <g style={dimCss('requester')}>
      <Person x={L.x.requester + requesterShift} y={g} h={h} vest={1} carry={requesterCarry} carryTone={requesterCarryTone} carryMark={requesterCarryMark} facing="right" opacity={pRequester} glow={fd('requester').focus * 0.7} glowTone={STEEL} />
    </g>
  ) : null;

  // ---- flow: request (an arc from quien recoge to the counter's left end) ------------------------------
  const rA = { x: L.at.requesterHand.x, y: L.at.requesterHand.y - 0.1 * h };
  const rB = { x: L.x.tube - 0.2 * h, y: L.trackY - 0.14 * h };
  const rC = { x: (rA.x + rB.x) / 2, y: g - 1.3 * h };
  const quad = (t: number) => {
    const k = 1 - t;
    return { x: k * k * rA.x + 2 * k * t * rC.x + t * t * rB.x, y: k * k * rA.y + 2 * k * t * rC.y + t * t * rB.y };
  };
  const rAngle = (Math.atan2(rB.y - rC.y, rB.x - rC.x) * 180) / Math.PI;
  const requestCol = fRequest.tone ?? STEEL;
  const requestEl =
    fRequest.draw > 0.01 ? (
      <g>
        <path
          d={`M ${rA.x} ${rA.y} Q ${rC.x} ${rC.y} ${rB.x} ${rB.y}`}
          fill="none"
          stroke={alpha(requestCol, 0.3 + 0.6 * fRequest.lit)}
          strokeWidth={sw * (0.9 + 0.3 * fRequest.lit)}
          strokeLinecap="round"
          pathLength={100}
          strokeDasharray="100 100"
          strokeDashoffset={100 * (1 - fRequest.draw)}
        />
        <Arrow x={rB.x} y={rB.y} angle={rAngle} size={0.09 * h} color={mixHex(STRUCT, requestCol, fRequest.lit)} opacity={clamp01((fRequest.draw - 0.9) * 10)} />
      </g>
    ) : null;

  // ---- flow: consult (the tube, «el sistema de pedidos») ----------------------------------------------
  const tubeY0 = L.trackY - 0.12 * h;
  const tubeY1 = L.deskTop + 0.05 * hu;
  const tubeTop = mix(tubeY0, tubeY1, fConsult.draw);
  const pipe = Math.max(4, 0.07 * h);
  const consultCol = fConsult.tone ?? CTRL;
  const consultEl =
    fConsult.draw > 0.01 ? (
      <g>
        <rect x={L.x.tube - pipe / 2} y={tubeTop} width={pipe} height={tubeY0 - tubeTop} fill={alpha(C.ink900, 0.9)} stroke={mixHex(STRUCT, consultCol, 0.35 + 0.65 * fConsult.lit)} strokeWidth={thin * 1.3} />
        {fConsult.lit > 0.01 ? <line x1={L.x.tube} y1={tubeTop + 2} x2={L.x.tube} y2={tubeY0} stroke={alpha(consultCol, 0.55 * fConsult.lit)} strokeWidth={pipe * 0.34} /> : null}
        {!icon
          ? [0.3, 0.72].map((k) => {
              const yy = mix(tubeY0, fl + L.slab, k);
              return yy > tubeTop + 2 ? <rect key={k} x={L.x.tube - pipe * 0.8} y={yy} width={pipe * 1.6} height={Math.max(2, 0.025 * h)} rx={1} fill={STRUCT} /> : null;
            })
          : null}
        {/* The inlet on the counter */}
        <path
          d={`M ${L.x.tube - pipe * 1.15} ${L.trackY} L ${L.x.tube - pipe * 0.7} ${tubeY0} H ${L.x.tube + pipe * 0.7} L ${L.x.tube + pipe * 1.15} ${L.trackY} Z`}
          fill={C.ink900}
          stroke={mixHex(STEEL, consultCol, 0.5 * fConsult.lit)}
          strokeWidth={thin * 1.3}
          strokeLinejoin="round"
        />
      </g>
    ) : null;

  // ---- flow: issue (the chute from the printer to the tray) -------------------------------------------
  const chuteY0 = L.standTop + 0.06 * hu;
  const chuteY1 = L.trackY - th - 0.03 * h;
  const issueCol = fIssue.tone ?? CTRL;
  const chuteW = L.order.small.w * 1.25;
  const chuteBottom = mix(chuteY0, chuteY1, fIssue.draw);
  const issueEl =
    fIssue.draw > 0.01 ? (
      <g>
        {/* The slot through the floor */}
        <rect x={L.x.printer - chuteW / 2} y={fl - 1} width={chuteW} height={L.slab + 2} fill={C.ink950} opacity={clamp01(fIssue.draw * 3)} />
        {[-1, 1].map((s) => (
          <line
            key={s}
            x1={L.x.printer + (s * chuteW) / 2}
            y1={Math.min(fl + L.slab, chuteBottom)}
            x2={L.x.tray + (s * chuteW) / 2}
            y2={Math.max(fl + L.slab, chuteBottom)}
            stroke={mixHex(STRUCT, issueCol, 0.3 + 0.7 * fIssue.lit)}
            strokeWidth={thin * 1.3}
            strokeDasharray={`${0.07 * h} ${0.06 * h}`}
            strokeLinecap="round"
          />
        ))}
        <Arrow x={L.x.tray} y={chuteY1} angle={90} size={0.085 * h} color={mixHex(STRUCT, issueCol, 0.3 + 0.7 * fIssue.lit)} opacity={clamp01((fIssue.draw - 0.9) * 10)} />
      </g>
    ) : null;

  // ---- traffic and cargo on the track -----------------------------------------------------------------
  const trafficY = L.trackY - Math.max(2, 0.02 * h);
  const tx0 = L.x.pickup + 0.02 * h;
  const tx1 = sx0 - 0.02 * h;
  const gapHalf = tr.cut * 0.3 * h;
  const trafficCol = mixHex(tr.tone, STRUCT, tr.cut);
  const trafficSeg = (a: number, b: number, key: string) => {
    // Visible part of [a, b] given the draw direction.
    const from = tr.toShelf ? tx0 : tx1;
    const head = mix(from, tr.toShelf ? tx1 : tx0, tr.draw);
    const lo = Math.max(a, Math.min(from, head));
    const hi = Math.min(b, Math.max(from, head));
    if (hi - lo < 1) return null;
    return (
      <g key={key}>
        <line x1={lo} y1={trafficY} x2={hi} y2={trafficY} stroke={alpha(trafficCol, 0.3 + 0.25 * tr.lit)} strokeWidth={Math.max(3, 0.04 * h)} strokeLinecap="round" />
        {tr.lit > 0.01 && tr.cut < 0.5 ? (
          <line
            x1={lo}
            y1={trafficY}
            x2={hi}
            y2={trafficY}
            stroke={alpha(trafficCol, 0.95 * tr.lit)}
            strokeWidth={Math.max(3, 0.04 * h)}
            strokeLinecap="round"
            strokeDasharray={`${0.14 * h} ${0.2 * h}`}
            strokeDashoffset={(tr.toShelf ? -1 : 1) * tr.phase * 0.5 * h}
          />
        ) : null}
      </g>
    );
  };
  const trafficEl =
    tr.draw > 0.01 ? (
      <g style={tr.lit > 0.01 && tr.cut < 0.5 ? { filter: dropGlow(tr.tone, 0.5 * tr.lit) } : undefined}>
        {tr.cut > 0.01
          ? [
              trafficSeg(tx0, L.x.mozo - gapHalf, 'a'),
              trafficSeg(L.x.mozo + gapHalf, tx1, 'b'),
              <path
                key="caps"
                d={`M ${L.x.mozo - gapHalf} ${trafficY - 0.07 * h} V ${trafficY + 0.03 * h} M ${L.x.mozo + gapHalf} ${trafficY - 0.07 * h} V ${trafficY + 0.03 * h}`}
                stroke={C.rose}
                strokeWidth={Math.max(2.5, 0.03 * h)}
                strokeLinecap="round"
                opacity={tr.cut}
              />,
            ]
          : trafficSeg(tx0, tx1, 'all')}
      </g>
    ) : null;
  const cargoEl = cargo.map((c, i) => {
    const b = typeof c === 'number' ? { at: c } : c;
    const tone = b.tone;
    return <Carton key={i} x={L.cargoX(b.at)} y={L.trackY} w={L.box.w} h={L.box.h} sw={thin * (tone ? 1.5 : 1)} stroke={tone ?? STEEL} opacity={clamp01(b.opacity ?? 1)} glow={tone ? 0.7 : 0} />;
  });

  // ---- upstairs: cabinet with the ledger and the rulebook ---------------------------------------------
  const cab = L.rect.cabinet;
  const compH = cab.h / 2;
  const officeCol = mixHex(GHOST, CTRL, pOffice);
  const adminCol = mixHex(GHOST, CTRL, pAdmin);
  const ghostDash = (p: number) => (p < 0.5 ? '7 6' : undefined);
  const officeShow = Math.max(pOffice, pGhost * 0.85);
  const adminShow = Math.max(pAdmin, pGhost * 0.85);
  const itemsShow = Math.max(officeShow, pLedger, pRulebook);
  const spineW = (cab.w - 0.16 * hu) / 3;
  const cabinetEl =
    itemsShow > 0.01 && !icon ? (
      <g style={groupCss('office', CTRL)}>
        <g opacity={officeShow} stroke={officeCol} strokeDasharray={ghostDash(pOffice)} fill="none" strokeWidth={thin * 1.3}>
          <rect x={cab.x} y={cab.y} width={cab.w} height={cab.h} rx={3} fill={alpha(C.ink850, 0.8)} />
          <line x1={cab.x} y1={cab.y + compH} x2={cab.x + cab.w} y2={cab.y + compH} />
        </g>
        {/* el historial: three ledger spines */}
        {pLedger > 0.01 ? (
          <g opacity={pLedger}>
            {[0, 1, 2].map((k) => {
              const bx = cab.x + 0.06 * hu + k * (spineW + 0.02 * hu);
              const bh = compH * (k === 1 ? 0.7 : 0.78);
              return (
                <g key={k}>
                  <rect x={bx} y={cab.y + compH - bh - 2} width={spineW} height={bh} rx={2} fill={alpha(CTRL, 0.22)} stroke={CTRL} strokeWidth={thin * 1.2} />
                  <rect x={bx + spineW * 0.22} y={cab.y + compH - bh + bh * 0.16} width={spineW * 0.56} height={bh * 0.26} rx={1.5} fill={alpha('#ecfeff', 0.9)} />
                </g>
              );
            })}
          </g>
        ) : null}
        {/* las normas: one book, its rules as lines */}
        {pRulebook > 0.01 ? (
          <g opacity={pRulebook}>
            <rect x={cab.x + cab.w * 0.14} y={cab.y + compH * 1.14} width={cab.w * 0.72} height={compH * 0.74} rx={3} fill={alpha(CTRL, 0.22)} stroke={CTRL} strokeWidth={thin * 1.3} />
            <line x1={cab.x + cab.w * 0.27} y1={cab.y + compH * 1.14} x2={cab.x + cab.w * 0.27} y2={cab.y + compH * 1.88} stroke={CTRL} strokeWidth={thin * 1.1} />
            <path
              d={[0.32, 0.5, 0.68].map((k) => `M ${cab.x + cab.w * 0.38} ${cab.y + compH * (1.14 + 0.74 * k)} H ${cab.x + cab.w * 0.76}`).join(' ')}
              stroke={alpha('#ecfeff', 0.9)}
              strokeWidth={Math.max(1.6, thin * 1.2)}
              strokeLinecap="round"
            />
          </g>
        ) : null}
      </g>
    ) : null;

  // ---- upstairs: the office (clerk + desk) ------------------------------------------------------------
  const dk = L.rect.desk;
  const inboxW = 0.3 * hu;
  const ds = clamp01(deskSlip);
  const officeEl =
    officeShow > 0.01 ? (
      <g style={dimCss('office')}>
        <GhostPerson x={L.x.clerk} y={fl} h={hu} opacity={(1 - pOffice) * pGhost} sw={thin * 1.2} />
        {pOffice > 0.01 ? <Person x={L.x.clerk} y={fl} h={hu} vest={0} tone={CTRL_CLOTHES} facing="right" opacity={pOffice} glow={fd('office').focus * 0.8} glowTone={CTRL} /> : null}
        <g opacity={officeShow} strokeDasharray={ghostDash(pOffice)}>
          <rect x={dk.x} y={dk.y} width={dk.w} height={dk.h} fill={C.ink850} stroke={officeCol} strokeWidth={sw} />
          {!icon ? <line x1={dk.x + 0.1 * hu} y1={dk.y + dk.h * 0.5} x2={dk.x + dk.w - 0.1 * hu} y2={dk.y + dk.h * 0.5} stroke={alpha(officeCol, 0.4)} strokeWidth={thin} /> : null}
          <rect x={dk.x - 0.04 * hu} y={dk.y - 0.03 * hu} width={dk.w + 0.08 * hu} height={0.075 * hu} rx={0.02 * hu} fill={mixHex('#334155', '#164e63', pOffice)} stroke={officeCol} strokeWidth={thin * 1.2} />
          {/* The inbox where the order system delivers */}
          <path
            d={`M ${L.x.tube - inboxW / 2} ${dk.y - 0.03 * hu - 0.09 * hu} L ${L.x.tube - inboxW / 2 + 0.04 * hu} ${dk.y - 0.03 * hu} H ${L.x.tube + inboxW / 2 - 0.04 * hu} L ${L.x.tube + inboxW / 2} ${dk.y - 0.03 * hu - 0.09 * hu}`}
            fill={alpha(C.ink900, 0.9)}
            stroke={officeCol}
            strokeWidth={thin * 1.3}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </g>
        <Slip x={L.x.tube} y={dk.y - 0.03 * hu - 0.12 * hu + (1 - ds) * 0.1 * hu} h={0.24 * hu} opacity={ds} />
      </g>
    ) : null;

  // ---- upstairs: the administrativo and his printer ---------------------------------------------------
  const pr = L.rect.printer;
  const legX = 0.24 * hu;
  const pt = clamp01(printing);
  const adminEl =
    adminShow > 0.01 ? (
      <g style={dimCss('admin')}>
        <GhostPerson x={L.x.admin} y={fl} h={hu} opacity={(1 - pAdmin) * pGhost} sw={thin * 1.2} />
        {pAdmin > 0.01 ? <Person x={L.x.admin} y={fl} h={hu} vest={0} tone={CTRL_CLOTHES} facing="left" opacity={pAdmin} glow={fd('admin').focus * 0.8} glowTone={CTRL} /> : null}
        <g opacity={adminShow} strokeDasharray={ghostDash(pAdmin)} strokeLinejoin="round" strokeLinecap="round">
          {/* open stand */}
          <path d={`M ${L.x.printer - legX} ${fl} V ${L.standTop} M ${L.x.printer + legX} ${fl} V ${L.standTop}`} stroke={adminCol} strokeWidth={sw} fill="none" />
          {/* paper feed */}
          <rect x={L.x.printer - pr.w * 0.26} y={pr.y - pr.h * 0.42} width={pr.w * 0.52} height={pr.h * 0.5} rx={2} fill={alpha('#ecfeff', 0.22 + 0.5 * pAdmin)} stroke={adminCol} strokeWidth={thin} />
          {/* body */}
          <rect x={pr.x} y={pr.y} width={pr.w} height={pr.h} rx={0.05 * hu} fill={C.ink850} stroke={adminCol} strokeWidth={sw} />
          <rect x={pr.x - 0.03 * hu} y={L.standTop - 0.01 * hu} width={pr.w + 0.06 * hu} height={0.05 * hu} rx={0.02 * hu} fill={mixHex('#334155', '#164e63', pAdmin)} stroke={adminCol} strokeWidth={thin} />
          {/* slot + light */}
          <line x1={pr.x + pr.w * 0.2} y1={pr.y + pr.h * 0.72} x2={pr.x + pr.w * 0.8} y2={pr.y + pr.h * 0.72} stroke={mixHex(STRUCT, C.cyanSoft, Math.max(pt, 0.35 * pAdmin))} strokeWidth={Math.max(2, thin * 1.6)} />
          <circle cx={pr.x + pr.w * 0.84} cy={pr.y + pr.h * 0.3} r={Math.max(2, 0.025 * hu)} fill={mixHex(STRUCT, C.cyanSoft, pt)} />
        </g>
      </g>
    ) : null;

  // ---- flow: decision (office → administrativo) -------------------------------------------------------
  const dA = { x: L.x.desk1 + 0.08 * hu, y: L.at.decision.y };
  const dB = { x: pr.x - 0.08 * hu, y: L.at.decision.y };
  const decisionCol = fDecision.tone ?? CTRL;
  const decisionEl =
    fDecision.draw > 0.01 ? (
      <g>
        <line x1={dA.x} y1={dA.y} x2={mix(dA.x, dB.x, fDecision.draw)} y2={dB.y} stroke={alpha(decisionCol, 0.3 + 0.65 * fDecision.lit)} strokeWidth={sw * (0.9 + 0.3 * fDecision.lit)} strokeLinecap="round" />
        <Arrow x={dB.x + 0.02 * hu} y={dB.y} angle={0} size={0.1 * hu} color={mixHex(STRUCT, decisionCol, 0.3 + 0.7 * fDecision.lit)} opacity={clamp01((fDecision.draw - 0.9) * 10)} />
      </g>
    ) : null;

  // ---- PDP bracket and the implicit trust zone --------------------------------------------------------
  const pPdp = clamp01(pdp);
  const pZone = clamp01(zone);
  const bracketEl = (
    <g fill="none" strokeLinejoin="round">
      {pPdp > 0.01 ? (
        <rect x={L.rect.pdp.x} y={L.rect.pdp.y} width={L.rect.pdp.w} height={L.rect.pdp.h} rx={0.1 * hu} stroke={alpha(CTRL, 0.9)} strokeWidth={Math.max(2.5, sw)} strokeDasharray="14 9" fill={alpha(CTRL, 0.05)} opacity={pPdp} />
      ) : null}
      {pZone > 0.01 ? (
        <rect x={L.rect.zone.x} y={L.rect.zone.y} width={L.rect.zone.w} height={L.rect.zone.h} rx={0.08 * h} stroke={C.emerald} strokeWidth={Math.max(2.5, sw)} strokeDasharray="12 8" fill={alpha(C.emerald, 0.07)} opacity={pZone} />
      ) : null}
    </g>
  );

  // ---- flow: signal (what quien recoge's device reports → the office's cabinet) ------------------------
  const sA = { x: L.at.requesterHand.x + 0.05 * h, y: L.at.requesterHand.y - 0.22 * h };
  const sB = { x: cab.x - 0.08 * hu, y: L.at.ledger.y };
  const sC1 = { x: sA.x, y: sB.y + 0.2 * (sA.y - sB.y) };
  const sC2 = { x: sA.x + 0.25 * (sB.x - sA.x), y: sB.y };
  const cubic = (t: number) => {
    const k = 1 - t;
    return {
      x: k * k * k * sA.x + 3 * k * k * t * sC1.x + 3 * k * t * t * sC2.x + t * t * t * sB.x,
      y: k * k * k * sA.y + 3 * k * k * t * sC1.y + 3 * k * t * t * sC2.y + t * t * t * sB.y,
    };
  };
  const signalCol = fSignal.tone ?? C.rose;
  const signalEl =
    fSignal.draw > 0.01 ? (
      <g>
        <path
          d={`M ${sA.x} ${sA.y} C ${sC1.x} ${sC1.y} ${sC2.x} ${sC2.y} ${sB.x} ${sB.y}`}
          fill="none"
          stroke={alpha(signalCol, 0.35 + 0.6 * fSignal.lit)}
          strokeWidth={sw * (0.9 + 0.3 * fSignal.lit)}
          strokeLinecap="round"
          pathLength={100}
          strokeDasharray="100 100"
          strokeDashoffset={100 * (1 - fSignal.draw)}
        />
        <Arrow x={sB.x + 0.02 * hu} y={sB.y} angle={0} size={0.1 * hu} color={mixHex(STRUCT, signalCol, 0.35 + 0.65 * fSignal.lit)} opacity={clamp01((fSignal.draw - 0.9) * 10)} />
      </g>
    ) : null;

  // ---- travelling marks (above the labels) ------------------------------------------------------------
  const mR = markFade(fRequest.mark);
  const mS = markFade(fSignal.mark);
  const sigPt = cubic(clamp01(fSignal.mark ?? 0));
  const mC = markFade(fConsult.mark);
  const mD = markFade(fDecision.mark);
  const reqPt = quad(clamp01(fRequest.mark ?? 0));
  const capY = mix(tubeY0, tubeY1, clamp01(fConsult.mark ?? 0));
  const decX = mix(dA.x, dB.x, clamp01(fDecision.mark ?? 0));
  const vd = clamp01(verdict);
  const vCol = verdictKind === 'yes' ? C.emerald : verdictKind === 'no' ? C.rose : C.amber;
  const vR = Math.max(9, 0.13 * hu);
  const vPos = { x: L.x.tube + 0.2 * hu, y: dk.y - 0.36 * hu };
  const marksEl = (
    <>
      <Slip x={reqPt.x} y={reqPt.y} h={0.2 * h} opacity={mR} rotate={-8 + 16 * clamp01(fRequest.mark ?? 0)} />
      {mS > 0.01 ? (
        <g opacity={mS}>
          <circle cx={sigPt.x} cy={sigPt.y} r={0.1 * h} fill={alpha(signalCol, 0.22)} />
          <circle cx={sigPt.x} cy={sigPt.y} r={0.045 * h} fill={signalCol} />
        </g>
      ) : null}
      {mC > 0.01 ? (
        <g opacity={mC}>
          <rect x={L.x.tube - pipe * 0.75} y={capY - pipe * 1.3} width={pipe * 1.5} height={pipe * 2.6} rx={pipe * 0.7} fill={C.ink900} stroke={C.cyanSoft} strokeWidth={thin * 1.4} />
          <rect x={L.x.tube - pipe * 0.34} y={capY - pipe * 0.7} width={pipe * 0.68} height={pipe * 1.4} rx={1.5} fill={PAPER} />
        </g>
      ) : null}
      {mD > 0.01 ? (
        <g opacity={mD}>
          <circle cx={decX} cy={dA.y} r={0.11 * hu} fill={alpha(decisionCol, 0.2)} />
          <circle cx={decX} cy={dA.y} r={0.05 * hu} fill={decisionCol} />
        </g>
      ) : null}
      {vd > 0.01 ? (
        <g transform={`translate(${vPos.x} ${vPos.y}) scale(${0.6 + 0.4 * vd})`} opacity={Math.min(1, vd * 1.5)}>
          <circle r={vR * 1.4} fill={alpha(vCol, 0.2)} />
          <circle r={vR} fill={C.ink900} stroke={vCol} strokeWidth={vR * 0.2} />
          {verdictKind === 'yes' ? (
            <path d={`M ${-vR * 0.45} ${vR * 0.03} L ${-vR * 0.13} ${vR * 0.37} L ${vR * 0.48} ${-vR * 0.33}`} fill="none" stroke={vCol} strokeWidth={vR * 0.24} strokeLinecap="round" strokeLinejoin="round" />
          ) : verdictKind === 'no' ? (
            <path d={`M ${-vR * 0.36} ${-vR * 0.36} L ${vR * 0.36} ${vR * 0.36} M ${vR * 0.36} ${-vR * 0.36} L ${-vR * 0.36} ${vR * 0.36}`} fill="none" stroke={vCol} strokeWidth={vR * 0.24} strokeLinecap="round" />
          ) : (
            [-1, 0, 1].map((k) => <circle key={k} cx={k * vR * 0.42} cy={0} r={vR * 0.13} fill={vCol} />)
          )}
        </g>
      ) : null}
    </>
  );

  // ---- labels (HTML, px) ------------------------------------------------------------------------------
  const lab = (k: WarehouseLabel) => clamp01(labels[k] ?? 0);
  const verb = (k: WarehouseVerb) => clamp01(verbs[k] ?? 0);
  const shadow = `0 2px 8px ${alpha(C.ink950, 0.95)}`;
  const roleTag = (key: 'office' | 'admin' | 'mozo', el: WarehouseElement, place: string, placeOp: number, name: string, nameOp: number, verbText: string, verbOp: number) => {
    if (icon || (placeOp <= 0.001 && nameOp <= 0.001 && verbOp <= 0.001)) return null;
    const t = L.tag[key];
    const nameMax = (em(name) + 0.9) * L.nameSize * 1.25;
    const upstairs = key !== 'mozo';
    const split = !upstairs && L.placeDown === 'head';
    const anchor: CSSProperties = upstairs ? { bottom: height - (t.y2 + L.nameSize * 1.16) } : { top: split ? t.y2 : t.y1 };
    return (
      <div key={key} style={{ position: 'absolute', left: t.x, ...anchor, transform: 'translateX(-50%)', textAlign: 'center', whiteSpace: 'nowrap', fontFamily: FONT.sans, textShadow: shadow, ...dimCss(el) }}>
        {split ? null : (
          <div style={{ fontSize: L.labelSize, fontWeight: 750, lineHeight: 1.16, height: L.labelSize * 1.16 * clamp01(placeOp * 6), color: C.text, opacity: placeOp }}>{place}</div>
        )}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: L.nameSize, fontWeight: 850, lineHeight: 1.16, letterSpacing: 0.2 }}>
          <span style={{ display: 'block', overflow: 'hidden', maxWidth: nameOp >= 0.999 ? undefined : nameMax * nameOp, opacity: Math.min(1, nameOp * 1.6) }}>
            <span style={{ color: VIOLET_SOFT }}>{name}</span>
            <span style={{ color: C.faint, opacity: verbOp }}>{' · '}</span>
          </span>
          <span style={{ color: C.textStrong, opacity: verbOp }}>{verbText}</span>
        </div>
      </div>
    );
  };
  const chip = (text: string, op: number, css: CSSProperties, tone: string = C.violet, textColor: string = VIOLET_SOFT) =>
    op > 0.001 && !icon ? (
      <div
        key={text}
        style={{
          position: 'absolute',
          padding: `${Math.round(L.labelSize * 0.08)}px ${Math.round(L.labelSize * 0.4)}px ${Math.round(L.labelSize * 0.12)}px`,
          borderRadius: 10,
          border: `2px solid ${alpha(tone, 0.75)}`,
          background: alpha(C.ink900, 0.92),
          fontFamily: FONT.sans,
          fontSize: L.labelSize,
          fontWeight: 850,
          lineHeight: 1.16,
          letterSpacing: 0.6,
          color: textColor,
          whiteSpace: 'nowrap',
          opacity: op,
          ...css,
        }}
      >
        {text}
      </div>
    ) : null;
  const plain = (text: string, op: number, css: CSSProperties, color: string = C.text, weight = 750) =>
    op > 0.001 && !icon ? (
      <div key={text} style={{ position: 'absolute', fontFamily: FONT.sans, fontSize: L.labelSize, fontWeight: weight, lineHeight: 1.16, color, whiteSpace: 'nowrap', textShadow: shadow, opacity: op, ...css }}>
        {text}
      </div>
    ) : null;
  const chipH = L.labelSize * 1.36 + 4;
  const rulesParts = T.rules.split(' · ');
  const labelsEl = (
    <>
      {/* role tags */}
      {roleTag('office', 'office', T.office, lab('office'), T.engine, lab('engine'), T.verbs.engine, verb('engine'))}
      {roleTag('admin', 'admin', T.admin, lab('admin'), T.administrator, lab('administrator'), T.verbs.administrator, verb('administrator'))}
      {roleTag('mozo', 'mozo', T.mozo, lab('mozo'), pepName, lab('pep'), T.verbs.pep, verb('pep'))}
      {L.placeDown === 'head' ? plain(T.mozo, lab('mozo'), { left: L.tag.mozo.px, top: L.tag.mozo.y1, transform: 'translateX(-50%)', ...dimCss('mozo', lab('mozo')) }) : null}
      {plain(T.requester, lab('requester'), { left: L.tag.requester.px + requesterShift, top: L.tag.requester.y1, transform: 'translateX(-50%)', ...dimCss('requester', lab('requester')) })}
      {/* sistema de pedidos, beside the tube */}
      {plain(T.system, lab('system'), { right: W - (L.x.tube - pipe - 0.1 * h), top: fl + L.slab + 10 }, C.cyanSoft, 720)}
      {/* what the office has: the two item labels, left of the cabinet */}
      {plain(T.history, lab('history'), { right: W - (cab.x - 0.14 * hu), top: L.at.ledger.y - L.labelSize * 0.58 }, C.cyanSoft)}
      {lab('rules') > 0.001 && !icon ? (
        <div key="rules" style={{ position: 'absolute', right: W - (cab.x - 0.14 * hu), top: L.at.rulebook.y - L.labelSize * 0.58, fontFamily: FONT.sans, fontSize: L.labelSize, fontWeight: 750, lineHeight: 1.16, whiteSpace: 'nowrap', textShadow: shadow, opacity: lab('rules') }}>
          <span style={{ color: C.cyanSoft }}>{rulesParts[0]}</span>
          <span style={{ color: C.faint }}> · </span>
          <span style={{ color: C.text }}>{rulesParts[1]}</span>
        </div>
      ) : null}
      {/* planes: chips at the right end of the floor line */}
      {chip(T.control, lab('control'), { right: wallW + 10, top: fl - 8 - chipH })}
      {chip(T.data, lab('data'), { right: wallW + 10, top: fl + L.slab + 8 })}
      {/* PDP: between the desk and the printer */}
      {chip(T.pdp, lab('pdp'), { left: (L.x.desk1 + pr.x) / 2, top: fl - 8 - chipH, transform: 'translateX(-50%)' }, CTRL)}
      {/* implicit trust zone: under the shelf */}
      {plain(T.zone, lab('zone'), { right: Math.max(8, W - L.x.shelf1 - 12), top: g + (icon ? 4 : 8) + 2, color: VIOLET_SOFT, letterSpacing: 0.4 }, VIOLET_SOFT, 850)}
      {/* the shelf's plate */}
      {shelfLabel && pShelf > 0.01 && !icon ? (
        <div
          key="shelf"
          style={{
            position: 'absolute',
            left: (sx0 + sx1) / 2,
            top: L.shelfTop + 0.16 * h,
            transform: 'translate(-50%, -50%)',
            padding: '2px 16px 4px',
            borderRadius: 8,
            border: `2px solid ${STEEL}`,
            background: C.ink900,
            fontFamily: FONT.sans,
            fontSize: L.labelSize,
            fontWeight: 850,
            lineHeight: 1.16,
            color: C.textStrong,
            whiteSpace: 'nowrap',
            ...dimCss('shelf', pShelf),
          }}
        >
          {shelfLabel}
        </div>
      ) : null}
    </>
  );

  // ---- the order (HTML, on top) -----------------------------------------------------------------------
  let orderEl = null;
  if (order && clamp01(order.show ?? 1) > 0.001) {
    const { show = 1, travel = 0, zoom = 0, zoomWidth, zoomAt, ...paper } = order;
    const s = clamp01(show);
    const tv = clamp01(travel);
    const z = icon ? 0 : clamp01(zoom);
    const zw = zoomWidth ?? L.order.zoom.w;
    const w = mix(L.order.small.w, zw, z);
    const hh = w * 0.6;
    const rest = { x: mix(L.order.printer.x, L.order.tray.x, tv), y: mix(L.order.printer.y, L.order.tray.y, tv) - (1 - s) * L.order.small.h * 0.8 };
    const zx = zoomAt?.x ?? mix(L.order.zoomPrinter.x, L.order.zoomTray.x, tv);
    const zy = zoomAt?.y ?? mix(L.order.zoomPrinter.y, L.order.zoomTray.y, tv);
    const cx = Math.min(W - 10 - w / 2, mix(rest.x, zx, z));
    const cy = mix(rest.y, zy, z);
    orderEl = (
      <div style={{ position: 'absolute', left: cx - w / 2, top: cy - hh / 2, opacity: Math.min(1, s * 1.5) }}>
        <Order width={w} {...paper} />
      </div>
    );
  }

  const dAll = clamp01(dimAll);
  return (
    <div style={{ position: 'relative', width, height, opacity: 1 - 0.6 * dAll, filter: dAll > 0.01 ? `saturate(${1 - 0.6 * dAll})` : undefined, ...style }}>
      <svg width={width} height={height} style={{ position: 'absolute', left: 0, top: 0, display: 'block', overflow: 'visible' }}>
        {naveEl}
        {planesEl}
        {shelfEl}
        {counterBack}
        {floorEl}
        {consultEl}
        {issueEl}
        {mozoEl}
        {counterEl}
        {trafficEl}
        {cargoEl}
        {requesterEl}
        {requestEl}
        {signalEl}
        {cabinetEl}
        {officeEl}
        {adminEl}
        {decisionEl}
        {bracketEl}
      </svg>
      {labelsEl}
      <svg width={width} height={height} style={{ position: 'absolute', left: 0, top: 0, display: 'block', overflow: 'visible', pointerEvents: 'none' }}>
        {marksEl}
      </svg>
      {orderEl}
    </div>
  );
}

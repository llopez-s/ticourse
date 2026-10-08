# Shared parts — V16 «Zonas de seguridad» (`zonas-halden`)

Four shared images that set the visual language of the whole video. Every scene that shows one of these
metaphors must use these parts (wrap them, never redraw them), so the napkin, the checkpoint, the
blueprint zones and the counter look identical everywhere.

| File | Metaphor (canon) | Main exports |
|---|---|---|
| `Napkin.tsx` | «la servilleta» = today's network, hand-drawn | `Napkin`, `PerimeterRule`, `napkinPoint`, `napkinBox`, `napkinSize`, `NAPKIN_TEXT`, `NAPKIN_HALT_AT` |
| `Checkpoint.tsx` | «la garita» = a zone's frontier and its control | `Checkpoint`, `checkpointSize`, `checkpointPoint`, `TruckTop`, `CHECKPOINT_PRESETS`, `PEN` |
| `ZoneRow.tsx` | «el plan nuevo» = blueprint zones | `ZoneRow`, `ZoneBox`, `BlueprintPanel`, `zoneRowLayout`, `zoneBoxContent`, `ZONES`, `ZONE_ORDER`, `CONFIDENCE`, `zoneColor` |
| `Counter.tsx` | «la ventanilla» = the DMZ | `ServiceCounter`, `counterSize`, `counterPoint` |

Import from the scene file, e.g. `import { Napkin, napkinPoint } from './parts/Napkin';`.

## Conventions (all four parts)

- **Nothing positions itself.** Wrap each part in `<div style={{ position: 'absolute', left, top }}>` with
  stage-local coordinates (the stage is 1728 × 660, inside `<Stage>`). Every part sizes from `width`; its
  height follows a fixed aspect (see each part). Use the `*Size()` / `*Point()` helpers to aim lines,
  labels and flights at a part — they return px from the part's top-left at the width you pass.
- **Frames are relative to the scene's Sequence.** Props named `at` are frames (the part's own pop-in or
  draw-in; omitted = already on screen). Every other animated prop is a **0–1 weight** you compute in the
  scene, usually `progress(frame, props.cue('x'), 18)` or `windowWeight(...)`. Parts accept an optional
  `frame` (defaults to `useCurrentFrame()`); none reads the timeline.
- `glow` (0–1) adds a halo, `dim` (0–1) steps the part back (≈40 % opacity, half saturation).
- Deterministic: every wobble is seeded; no `Math.random`.
- **Legibility.** Text the voice points at must render ≥ 32 px. The napkin draws its labels inside the
  scaled drawing: VLAN names and «Internet» / «Operaciones» are 40 design units, the VLAN note 38, the
  host labels 36–38, «portal» 32, «cortafuegos interno» 30 — they render at `size × width / 1280` (VLAN
  names 34 px at 1100, 31 px at 1000; the note 32 px at 1080). Keep the napkin **1080–1110 px wide** while
  the voice reads its names or the note; everything it draws **unscaled** (portal callout, «puestos de
  Importación», halt note, firewall slot) stays at 32–42 px whatever the width. Checked at 960 and 480 px.
- **Top-centre band.** s02, s04 and s06 have an intercepted-message card, s05 and s07 a think prompt in
  stage-local y 0–230, x 400–1330. Keep these parts low or small during those windows (see each scene's
  timing notes in `out/scene-brief.md`).
- Colours: ink on paper for today (napkin); cyan blueprint for the plan; zone colours by confidence
  (`CONFIDENCE`), the same everywhere; the person who checks / the guard is cyan; the counter is amber
  (the DMZ's colour).

---

## 1. `Napkin` — today's network

A warm paper napkin (fold creases, embossed border, the paper tilted −1.2°) with the network drawn in pen:
`Internet` → `fw-perimetro-01` → `rt-core`; hanging from `rt-core` the four VLAN **Oficinas**,
**Administración**, **Producción**, **Pruebas**; apart, **Operaciones** behind «cortafuegos interno»; the
note «entre estas VLAN: / el router no filtra» beside the router's drop; in Oficinas a small server
labelled «portal» (the portal, **dimmed by default**) next to two unnamed workstations (the «puestos de
Importación»). No OT, no PLC, no Contratistas, no quarantine VLAN — do not add them.

Pens: ink (`PEN.ink`) for everything; red pen (`PEN.red`) for the packet, the reach lines and the breach;
blue pen (`PEN.blue`) for the control that appears on the frontier; green pen (`PEN.green`) for the internal
firewall that holds. A yellow highlighter wash (`highlight`) points at nodes.

**Size.** Design 1280 × 760, scaled to `width` (height = width × 0.594). Full stage height ⇒ **width ≤ 1110**.
Only the paper is tilted; the drawing is straight, so anchors are exact.

**Nodes** (`NapkinNode`): `internet`, `fw`, `rtcore`, `fwint`, `operaciones`, `oficinas`, `administracion`,
`produccion`, `pruebas`, `portal`, `note`. Extra anchors (`NapkinAnchor`): `workstations`, `laptop`, `gate`
(the barrier on Producción's link), `bus` (where the router's drop meets the VLAN bus).

### Props

| Prop | Type | Default | Meaning |
|---|---|---|---|
| `width` | number | 1280 | px width |
| `at` | frame | — | draw-in starts (strokes appear in network order, labels are written); omitted with no `draw` = drawn |
| `drawDur` | frames | 75 | length of the draw-in |
| `draw` | 0–1 | — | drive the draw-in yourself instead of `at` |
| `tilt` | deg | −1.2 | paper rotation (drawing stays straight) |
| `highlight` | `{ [node]: 0–1 }` | `{}` | highlighter wash per node (e.g. `note`, `rtcore` when the voice says the router doesn't filter) |
| `dim` | `{ [node]: 0–1 }` | `{}` | fade per node |
| `highlightColor` | colour | `#facc15` | highlighter colour |
| `portal` | `'hidden' \| 'dim' \| 'normal' \| 0–1` | `'dim'` | the portal inside Oficinas (dim in s01–s03; normal from s04; hidden once it moved to the DMZ) |
| `portalZoom` | 0–1 | 0 | the portal grows ×1.3 and its **callout** pops out: `hpa-portal-web-01` (mono 42 px) + «portal público de reservas de atraque» (32 px), with a leader line |
| `portalCallout` | boolean | true | false = no callout (draw your own at `napkinPoint('portal')`) |
| `portalCalloutAt` | `{x,y}` px | above the bus, over Oficinas | callout's bottom-left, px from the napkin's top-left (it covers the top-left of the drawing by default) |
| `importTag` | 0–1 | 0 | tag «puestos de / Importación» (32 px, unscaled) hung below Oficinas with a leader to the workstations |
| `importTagAt` | `{x,y}` px | below Oficinas | tag's top-centre (no leader when set) |
| `packet` | 0–1 \| undefined | — | a red envelope along Oficinas → up the bus → **through `rt-core`** → Producción. Not drawn at ≤0 or ≥1. **Clamped at the gate when `gateControl ≥ 0.5`** (it can never pass a control) |
| `packetColor` | colour | `PEN.red` | |
| `gate` | 0–1 | 0 | Producción's fence and the **empty** checkpoint on its link (nobody inside, barrier raised, a cobweb) |
| `gateControl` | 0–1 | 0 | the control appears on that frontier: guard in, lamp on, barrier comes down (blue pen) |
| `haltNote` | 0–1 | 0 | «solo si una regla lo deja» (32 px, unscaled) beside the halted packet |
| `laptop` | 0–1 | 0 | s03's laptop in Oficinas, circled in red (not drawn otherwise) |
| `reach` | `{ portal, administracion, produccion, pruebas: 0–1 }` | `{}` | red reach line from the laptop (via the bus) to each target; the last 30 % washes the target red |
| `reachBlocked` | 0–1 | 0 | dashed red attempt towards Operaciones, stopped by a bar at «cortafuegos interno», which gets a green ring (it holds). Operaciones itself is never washed |
| `breach` | 0–1 | 0 | s04: dotted red line from Internet along the network to the portal (first 65 %), then from the portal on to the workstations |
| `breachColor` | colour | `PEN.red` | |
| `fwSlot` | ReactNode | — | anything pinned on `fw-perimetro-01`, drawn unscaled (e.g. `<PerimeterRule/>`) |
| `fwSlotPlacement` | `'above' \| 'below'` | `'above'` | `above`: entirely above the napkin's top edge with a pin line to the firewall's label (leave ~110 px above the napkin); `below`: under the firewall box, over the drawing |
| `glow`, `dimAll` | 0–1 | 0 | whole-napkin halo / dim |
| `frame`, `style` | | | |

**`PerimeterRule`** — s04's rule as a printed label taped to the napkin, in four columns: «origen /
Internet» · «destino / hpa-portal-web-01» · «tcp/443» · «permitir» (green). Props: `show` 0–1 (columns
appear left to right), `focus` (column index 0–3 gets a highlighter), `size` (value font, default 34 →
≈ 900 px wide; 30 → ≈ 800). Pass it as `fwSlot` or place it yourself.

**Helpers.** `napkinSize(width)` → `{ w, h, scale }`; `napkinBox(node, width)` → px rect;
`napkinPoint(anchor, 'center'|'top'|'bottom'|'left'|'right', width)` → px point;
`NAPKIN_HALT_AT` = the `packet` fraction where it stops at the gate (time the halt note from it);
`NAPKIN_TEXT` = every canon string on the napkin. `roughLine`, `roughRect`, `roughCircle` (seeded pen
strokes, design units) are exported if a scene needs to add a matching pen mark of its own.

### Usage — s01–s04

```tsx
// s01: the napkin draws itself; the note and the router light up when the voice says they don't filter
const napkinAt = props.cue('napkin');
const routerW = windowWeight(frame, wordFrame(S, 's01-04', 'router'), segment(props, 's01-04').to);
<div style={{ position: 'absolute', left: 0, top: 0 }}>
  <Napkin width={1100} at={napkinAt} highlight={{ note: routerW, rtcore: routerW }} />
</div>

// s02: packet crosses unchecked; then the empty gate; then the control stops the same packet
const pass1 = progress(frame, props.cue('packet'), 45, EASE.inOut);             // runs 0→1, crosses rt-core
const pass2 = progress(frame, props.cue('control') + 10, 40, EASE.inOut);       // second run, halts at the gate
<Napkin
  width={1000}
  gate={progress(frame, props.cue('passes'), 16)}
  gateControl={progress(frame, props.cue('control'), 16)}
  packet={frame < props.cue('control') ? pass1 : pass2}                          // reset to 0 before the second run
  haltNote={progress(frame, props.cue('control') + 34, 12)}
  highlight={{ produccion: progress(frame, props.cue('empty-gate'), 12) }}
/>

// s03: the laptop's reach, one target at a time; Operaciones stays out
const r = props.cue('reach');
<Napkin width={1000} laptop={progress(frame, props.cue('laptop'), 14)}
  reach={{ portal: progress(frame, r, 20), administracion: progress(frame, r + 30, 24),
           produccion: progress(frame, r + 55, 24), pruebas: progress(frame, r + 80, 24) }}
  reachBlocked={progress(frame, r + 110, 30)} />

// s04: zoom on the portal, its inbound rule on the perimeter firewall, then the dotted breach
<div style={{ position: 'absolute', left: 60, top: 130 }}>   {/* room above for the rule */}
  <Napkin width={900} portal="normal"
    portalZoom={progress(frame, props.cue('portal'), 18) * (1 - progress(frame, props.cue('rule-in'), 12))}
    importTag={progress(frame, wordFrame(S, 's04-01', 'Importación') - 4, 12)}
    highlight={{ fw: progress(frame, props.cue('rule-in'), 12) }}
    fwSlot={<PerimeterRule show={progress(frame, props.cue('rule-in'), 30)} />}
    breach={progress(frame, props.cue('inside'), 40, EASE.linear)} />
</div>
// When the portal moves to the DMZ: portal="hidden" and fly your own copy from napkinPoint('portal', 'center', 900).
```

---

## 2. `Checkpoint` — the gate with its hut

A fenced gate seen from above at three-quarters: the guard hut («garita»), a striped barrier arm across the
road, a fork rest, two fence stubs. States are continuous weights so they animate:

| Weight | 0 | 1 |
|---|---|---|
| `manned` | **empty**: nobody was ever posted — no lamp fixture, no cable, faded grey paint, weeds, a cobweb, dust. *Not a failure mode.* | equipped and staffed: guard with a peaked cap, lamp, power pole and cable |
| `power` | **power cut**: lamp dark, window dark (guard only a shadow: nobody looks), cable broken, amber «no power» badge | lamp lit (emerald), window lit, the guard's view cone over the road |
| `barrier` | arm **down** (closed) | arm **raised** (open) |

`state` presets (each weight overridable): `'empty'` → manned 0, power 0, barrier 1 · `'powered'` → 1, 1, 0 ·
`'cut'` → 1, 0, 0 (pass `barrier={1}` for the fail-open ending; keep 0 for fail-closed). Empty and
cut-with-the-barrier-up are deliberately different stills: grey, weeds and no equipment vs. a cyan,
equipped hut gone dark with a broken cable and the badge.

**Looks.** `'scene'` (dark-stage illustration, default) · `'ink'` (pen on the napkin: structure in `ink`,
guard/lamp/arm turning to `accent` as `manned` rises — the Napkin uses this one) · `'plan'` (cyan blueprint
line art — ZoneRow uses this one).

**Crops and sizes** (design width 600 with fence, 350 without):

| Crop | `fence` | Height | Use |
|---|---|---|---|
| `'gate'` | true | width × 0.43 | s02 port overview gates (medium, 220–320 px), s10 rule-1 icon |
| `'gate'` | false | width × 0.737 | icons (s10 rule-3 barrier, 100–160 px), napkin, blueprint |
| `'road'` | true | width × 1.0 | s06/s07 full size (≈ 400–600 px; at 600 it fills the stage height — use ≤ 560 with labels) |
| `'road'` | false | width × 1.714 | tall full-size variant |

`detail` is picked from the hut's size (`full` ≥ ~380 px wide with fence, `medium`, `icon` ≤ ~170 px): icon
drops texture, the road and the cobweb, and thickens strokes so lines never render under ~1.6 px.

### Props

| Prop | Type | Default | Meaning |
|---|---|---|---|
| `width` | number | — | px width (height from crop, see table) |
| `state` | `'empty' \| 'powered' \| 'cut'` | `'powered'` | preset for the three weights |
| `manned`, `power`, `barrier` | 0–1 | from `state` | see above; animate them (e.g. `power={1 - progress(frame, cutAt, 8)}`) |
| `look` | `'scene' \| 'ink' \| 'plan'` | `'scene'` | |
| `crop` | `'gate' \| 'road'` | `'gate'` | |
| `fence` | boolean | true | fence stubs (false: just hut + barrier, narrower box) |
| `road` | boolean | scene look, not icon | road surface with lane dashes |
| `pole` | boolean | scene + road crop + full | power pole and cable (only when manned) |
| `queue` | 0–3 | 0 | trucks waiting outside the barrier; a fraction slides the last one in from below |
| `passing` | 0–1 or array | `[]` | trucks driving through, bottom → beyond the top (raise the barrier first!) |
| `watch` | 0–1 | manned × power | the guard's view cone |
| `cutMark` | 0–1 | manned × (1 − power) | the amber «no power» badge |
| `detail` | `'full' \| 'medium' \| 'icon'` | from width | |
| `tone` | Tone | `'cyan'` | hut outline in the scene look |
| `ink`, `accent`, `paper` | colours | `PEN.*` | pens for the ink look |
| `glow`, `dim` | 0–1 | 0 | |
| `at` | frame | — | pop-in |

**Helpers.** `checkpointSize(width, { crop, fence })` → `{ w, h, scale }`;
`checkpointPoint(width, which, { crop, fence })` with `which` = `'gate'` (road centre on the barrier
line — aim packets/paths here), `'hut'`, `'window'`, `'lamp'`, `'pivot'`, `'queue'` (first waiting truck's
nose), `'inside'`, `'outside'`, `'fenceLeft'`, `'fenceRight'`. `TruckTop` draws one top-view truck (design
units, inside your own `<svg>`). `CHECKPOINT_PRESETS`, `PEN`.

### Usage — s02, s06, s07, s10

```tsx
// s02, port overview: several staffed gates; the badge opens the offices' gate, the dock's stays down
<Checkpoint width={260} state="powered" barrier={progress(frame, badgeAt, 12) * (1 - progress(frame, badgeAt + 30, 12))} />
<Checkpoint width={260} state="powered" glow={progress(frame, dockAt, 10)} />   // stays closed

// s06: before the cut, the cut, two endings side by side
const cut = progress(frame, props.cue('barrier') + 20, 8);
<Checkpoint width={520} crop="road" state="powered" power={1 - cut}
  barrier={progress(frame, props.cue('open') - 10, 14)}
  passing={[progress(frame, props.cue('open'), 70, EASE.linear)]} />            // FAIL-OPEN: up, trucks pass
<Checkpoint width={520} crop="road" state="powered" power={1 - cut}
  queue={3 * progress(frame, props.cue('closed') - 10, 60)} />                  // FAIL-CLOSED: down, a queue

// s07: the management firewall fails closed
<Checkpoint width={420} crop="road" state="cut" queue={1} />

// s10 icons: rule 1 = fence + hut, rule 3 = the barrier
<Checkpoint width={300} state="powered" />
<Checkpoint width={140} fence={false} state="cut" barrier={1} />
```

---

## 3. `ZoneRow` / `ZoneBox` / `BlueprintPanel` — the new plan

The plan is never running yet, so it is always a **blueprint**: dark navy paper, a faint cyan grid, corner
registration ticks, a small mono «plan» tag. Zone colours come from the confidence, one map everywhere:

| Zone (`ZONES`, in `ZONE_ORDER`) | Confidence | Colour |
|---|---|---|
| `internet` «Internet» | «ninguna» | slate (`C.muted`) |
| `dmz` «DMZ» | «baja» | amber |
| `interna` «interna» | «media» | sky |
| `ot` «OT» | «crítica, pero frágil» (two lines) | rose |
| `gestion` «gestión» | «máxima» | emerald |
| `invitados` «invitados» | «ninguna» | slate |

No system names inside the zones (the lab places them).

### `ZoneRow`

The six zones in a row on a blueprint panel, a planned checkpoint (`Checkpoint look="plan"`) on the road
between each two. Design 1728 × 400 (height = width × 0.231). Boxes 204 × 248, name 44 px, a small
«confianza» caption, the confidence in its colour (32 px).

| Prop | Type | Default | Meaning |
|---|---|---|---|
| `width` | number | 1728 | |
| `at` | frame | — | draw-in, zone by zone left to right, `stagger` frames apart (omitted: drawn) |
| `stagger` | frames | 9 | |
| `zoneAt` | `{ [zone]: frame }` | — | per-zone start frames instead |
| `draw` | 0–1 | — | drive the whole draw-in yourself |
| `focus` | `{ [zone]: 0–1 }` | `{}` | glow; with `autoDim` the other zones step back |
| `dim` | `{ [zone]: 0–1 }` | `{}` | extra dim |
| `autoDim` | boolean | true | |
| `gates` | boolean | true | the checkpoints and roads between zones |
| `laptop` | 0–1 | 0 | s03's laptop inside «interna» (rose tile) |
| `reach` | 0–1 | 0 | rose outline around «interna» only (its own zone) |
| `ruleLink` | 0–1 | 0 | dashed rose link from the laptop through the DMZ gate into the DMZ («lo que una regla permita») |
| `reachCaption` | 0–1 | = `ruleLink` | «alcanza: **su zona** y **lo que una regla permita**» under «interna» (34 px) |
| `panel` | boolean | true | draw the blueprint panel (false: zones on your own panel) |
| `tag` | string \| false | `'plan'` | |
| `gateFocus` | 0–1 | 0 | the checkpoints between zones grow ×1.45 and glow («una garita en cada frontera», s03-03) |

Keep the row **≥ 1500 px wide**: names scale with it down to 0.86 (38 px), the confidence stays 32 px
(«invitados» and «pero frágil» need the box width).

`zoneRowLayout(width)` → `{ w, h, scale, zones: { [zone]: {x,y,w,h} }, gates: [{x,y,w}] (gate i between
zone i and i+1), roadY, laptop: {x,y}, caption: {x,y} }` in px.

### `ZoneBox` — one zone alone, same style

| Prop | Type | Default | Meaning |
|---|---|---|---|
| `zone` | ZoneId | — | takes name, confidence and colour from `ZONES` |
| `name` | ReactNode | from zone | override / custom name |
| `confidence` | Confidence \| null | from zone | override; `null` hides it |
| `color` | colour | confidence colour (cyan if none) | outline colour |
| `width`, `height` | number | — | px |
| `layout` | `'stack' \| 'header'` | `'stack'` | `stack`: centred name, caption, confidence (s03); `header`: name left, confidence pill right (wraps under a long name), room for `children` below |
| `caption` | string \| false | `'confianza'` | small caption over the confidence (stack only) |
| `nameSize`, `confSize` | px | 44, 32 | |
| `draw` | 0–1 | 1 | outline draws, fill and labels follow |
| `focus`, `dim` | 0–1 | 0 | |
| `dashed` | boolean | false | dashed outline |
| `children` | ReactNode | — | drawn inside, below the label block: `zoneBoxContent(width, height, { layout, zone })` gives that area |

### `BlueprintPanel`

The paper to put single zones on, so s04/s05/s07 match s03. Props: `width`, `height`, `tag` (`'plan'` /
false), `draw` 0–1, `glow`, `dim`, `grid` (px, 32), `children` (positioned by you, panel-local px).

### Usage — s03, s04, s05, s07

```tsx
// s03: six zones on `six`, then the same laptop's reach on `reach-after`
const ra = props.cue('reach-after');
const six = props.cue('six');
<div style={{ position: 'absolute', left: 0, top: 120 }}>
  <ZoneRow at={six} gateFocus={windowWeight(frame, wordFrame(S, 's03-03', 'garita'), ra - 10)}
    focus={{ interna: progress(frame, ra - 6, 12) }}
    laptop={progress(frame, ra, 12)} reach={progress(frame, ra + 10, 14)} ruleLink={progress(frame, ra + 30, 24)} />
</div>

// s04: the DMZ between the perimeter and the internal network, the portal inside
<BlueprintPanel width={1100} height={360}>
  <div style={{ position: 'absolute', left: 60, top: 70 }}>{/* perimeter firewall: your own glyph */}</div>
  <div style={{ position: 'absolute', left: 380, top: 60 }}>
    <ZoneBox zone="dmz" width={340} height={260} layout="header" draw={progress(frame, props.cue('dmz'), 24)}>
      {/* the portal (e.g. a server Icon + «hpa-portal-web-01») */}
    </ZoneBox>
  </div>
  <div style={{ position: 'absolute', left: 800, top: 60 }}>
    <ZoneBox zone="interna" width={260} height={260} layout="header" />
  </div>
</BlueprintPanel>

// s05: the management zone with its interfaces (no access label until `answer`)
<ZoneBox zone="gestion" width={420} height={300} layout="header" draw={progress(frame, props.cue('converge'), 24)}>
  {/* switch / firewall interfaces */}
</ZoneBox>

// s07: the management firewall in front of the zone; the pumps network apart, no line to any VLAN
<ZoneBox zone="gestion" width={360} height={240} layout="header" />
<ZoneBox zone="ot" confidence={null} name={/* your label, canon: «en la red de las bombas de las esclusas» */ '…'} width={420} height={220} layout="header" />
```

---

## 4. `ServiceCounter` (`Counter.tsx`) — «la ventanilla»

The service window for shipping companies and hauliers, set into the port's fence and seen from outside.
Amber booth (the DMZ's colour), a glass window with **someone behind it (cyan) who looks at each paper**, a
counter ledge with **a tray under the glass** — the only way through. **No door to the offices**: the
offices peek over the fence behind it, out of reach. Exported as `ServiceCounter` because the engine
already exports a numeric `Counter`.

**Size.** Design 600 × 420 (height = width × 0.7). Full (s04): 560–760 px. Icon (s05 wrap, s10 rule 2):
120–200 px (`detail` switches to `'icon'` below 260 px: no offices, no visitor, no texture, thick strokes).

| Prop | Type | Default | Meaning |
|---|---|---|---|
| `width` | number | — | |
| `paper` | 0–1 | 0 | a paper's trip: outside (0) → in the tray (0.45) → under the glass (0.7) → held up by the person (1); 0 = no paper |
| `inspect` | 0–1 | 0 | the person bends over it and a cyan scan line runs down the paper («mira cada papel») — use with `paper = 1` |
| `checked` | 0–1 | last third of `inspect` | the emerald tick on the paper |
| `trayGlow` | 0–1 | 0 | the tray lights up («solo una bandeja») |
| `noDoor` | 0–1 | 0 | a dashed door crossed out in rose beside the booth («no tiene puerta a las oficinas») |
| `visitor` | 0–1 | 0 | a haulier in the foreground, seen from behind (full detail only) |
| `offices` | boolean | not at icon size | the offices behind the fence |
| `person` | 0–1 | 1 | the person behind the glass |
| `sign` | string | — | optional text on the band over the window (≤ ~14 characters) |
| `detail` | `'full' \| 'icon'` | from width | |
| `tone` | colour | `C.amber` | booth accent |
| `glow`, `dim` | 0–1 | 0 | |
| `at` | frame | — | pop-in |

`counterSize(width)`; `counterPoint(width, which)` with `which` = `'booth'`, `'sign'`, `'window'`,
`'person'`, `'tray'`, `'outside'` (where the paper starts), `'held'`, `'noDoor'`, `'ground'`.

### Usage — s04, s05, s10

```tsx
// s04: the counter on `counter`; no door, the tray, someone who looks at each paper (s04-05)
const c = props.cue('counter');
<ServiceCounter width={640} at={c} visitor={progress(frame, c + 6, 14)}
  noDoor={windowWeight(frame, wordFrame(S, 's04-05', 'puerta') - 4, wordFrame(S, 's04-05', 'bandeja'))}
  trayGlow={windowWeight(frame, wordFrame(S, 's04-05', 'bandeja') - 4, wordFrame(S, 's04-05', 'alguien'))}
  paper={progress(frame, wordFrame(S, 's04-05', 'bandeja'), 40, EASE.linear)}
  inspect={progress(frame, wordFrame(S, 's04-05', 'mira'), 36, EASE.linear)} />

// s05 wrap («lo público, a la ventanilla») and s10 rule 2: the icon
<ServiceCounter width={170} />
```

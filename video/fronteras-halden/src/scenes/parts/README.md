# Shared parts — V17 «Por dónde se entra» (`fronteras-halden`)

Two parts are copied unchanged from V16 (`zonas-halden`) so the zone plan V17 opens on (s01, s04) looks exactly like
the one V16 approved: `ZoneRow.tsx` (with `ZoneBox`, `BlueprintPanel`) and `Checkpoint.tsx`, which `ZoneRow` uses for the
gates between zones. V17 uses the checkpoint ONLY inside the zone plan: the garita and its barrier are V16's images
(the control between zones, the power cut), never V17's entrance gate. Their docs, copied from V16's README, are below;
V17's own parts follow.

Conventions (all parts): nothing positions itself (wrap each part in an absolutely positioned div, stage-local
coordinates, stage 1728 × 660); `at` props are frames relative to the scene's Sequence, every other animated prop is a
0–1 weight the scene computes; optional `frame`; deterministic; text the voice points at ≥ 32 px.

## Copied from V16 · `ZoneRow` / `ZoneBox` / `BlueprintPanel` — the new plan

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

## Copied from V16 · `Checkpoint` — the gate with its hut

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

# V17's own parts

Five metaphors, one file each, plus `glyphs.tsx` (the drawings they share). All follow the conventions above. Colour
semantics: the port's systems cyan; the closed port amber; a yes (RADIUS, the office, the gate) emerald, a no rose;
structure that belongs to nobody (walls, fences, the street) slate; exam terms violet; people neutral white. Every part
exports a `*_TEXT` constant with its canon strings — use it instead of retyping them. Strings a part prints that are NOT
in the brief's canon are listed at the end of this file.

QA: every part was checked at the sizes below in a temporary showcase (frames of `S01Hook`, since restored).

## `RoleLanes` — the three 802.1X roles (s03, s04) · `RoleLanes.tsx`

The lesson's diagram (`sp3-part3.ts:78-104`) turned on its side to fit 16:9: three **horizontal** swimlanes stacked top
to bottom — «equipo · supplicant», «switch de acceso · authenticator», «RADIUS · authentication server» (each canon
string drawn stacked: Spanish name 42 px over the exam term in violet 32 px, both halves verbatim). Time runs left to
right; every message is a **vertical** arrow between two lanes:

- the **port** (`SwitchPort`) sits on the switch lane right under the device's arrow: `ask` comes down into it carrying
  the accreditation card (V16's badge = «dice quién es»), `relay` continues down to RADIUS — one straight line through
  the port: only authentication passes;
- `check`: RADIUS's horizontal arrow to «el directorio» (a card index; a highlight runs down it);
- `answer`: the arrow back UP into the port with «accept · reject». **0 by default** — keep it 0 until s03's `decides`;
- right of the port, the **status slot**: «cerrado · solo pasa la autenticación (EAPOL)» (`closed`), swapped for the
  ending by `verdict` (`PortVerdict`: «Access-Accept» + «puerto abierto · y la VLAN de su zona», or «Access-Reject» +
  «puerto cerrado · o VLAN de cuarentena, solo para que lo arreglen»);
- `switchNote` adds «abre o cierra la toma» under the switch's name (its role);
- `eap` turns the card riding ask/relay into a violet «EAP» chip (s04: «el marco»).

Layout is in **px, not a uniform scale**: text keeps its size when you squeeze the lanes. Height = 3 × `laneHeight` +
2 × `gap` (616 by default). Checked: 1728 × 196 (default), 1300 × 146 (squeezed for the think card), 1150 × 196.

| Prop | Type | Default | Meaning |
|---|---|---|---|
| `width` | px | 1728 | ≥ 1150. The closed label wraps to 2 lines below ~1500; the Access-Reject caption takes 3 lines at 1150 |
| `laneHeight` | px | 196 | ≥ 146; below ~180 keep `width` ≥ 1300 so the reject caption stays in 2 lines |
| `gap` | px | 14 | between lanes |
| `labelWidth` | px | 500 | header column (icon + name + term) |
| `draw` | 0–1 | 1 | the three lanes come in, staggered (device, switch, RADIUS) |
| `closed` | 0–1 | 0 | the port appears shut (amber) + the closed label; also the faint cable from the device's lane |
| `ask` / `relay` / `check` / `answer` | 0–1 | 0 | each message's arrow draws in (the token rides ask/relay to their midpoints) |
| `switchNote` | 0–1 | 0 | «abre o cierra la toma» under «authenticator» (the header text moves up to make room) |
| `eap` | 0–1 | 0 | card → «EAP» chip on ask/relay |
| `tokens` | 0–1 | 1 | hide the riding tokens altogether |
| `outcome` | `'accept' \| 'reject'` | `'accept'` | which ending `verdict` shows |
| `verdict` | 0–1 | 0 | the ending: port opens emerald / stays shut with a rose cross; status slot → `PortVerdict`; RADIUS's tile, the directory and the answer arrow take the colour; the chosen word of «accept · reject» stays lit, the other fades |
| `focus` / `dim` | `{ device?, switch?, radius? }` 0–1 | `{}` | lane glow / extra dim |
| `autoDim` | boolean | true | the other lanes step back while one is in focus |
| `children` | ReactNode | — | drawn over the lanes (px from the part's top-left; use the layout) |
| `frame`, `style` | | | |

**Layout helper.** `roleLanesLayout({ width, laneHeight, gap, labelWidth })` → `{ width, height, lanes: { device,
switch, radius }: {x,y,w,h,cy}, life: {device, switch, radius} (lifeline y), trackX, header: { icon(id), textX }, port:
{x,y,size} (centre), status: {x,y,maxWidth} (left-centre of the slot), arrows: { ask, relay, answer: {x,y1,y2}, check:
{x1,x2,y} }, directory: {x,y,size}, answerLabel: {x,y}, note: {x,y}, tokens: { ask, relay } }`. `roleLanesSize(opts)`.

**Standalone pieces.** `SwitchPort({ size, open, color, cross, show, glow })` — the port; `PortVerdict({ kind, show,
width, portSize, titleSize, captionSize, port })` — port + ending, for s04's two endings side by side; `EapChip({ size,
show })`; `DirectoryGlyph({ size, color, sweep, found, foundShow })`; `SwitchGlyph({ size, color })`.
Text: `ROLE_LANES_TEXT`.

```tsx
// s03: built step by step; the answer only on `decides`
const closedAt = props.cue('closed'), askAt = props.cue('ask'), relayAt = props.cue('relay');
const checkAt = props.cue('check'), decidesAt = props.cue('decides');
// Think hold after s03-05: squeeze the lanes down, clear of the card (stage y 10–166)
const s05 = segment(props, 's03-05');
const squeeze = windowWeight(frame, s05.to - 150, decidesAt + 40);   // or your own hold window
<div style={{ position: 'absolute', left: 0, top: mix(20, 196, squeeze) }}>
  <RoleLanes width={1728} laneHeight={mix(196, 146, squeeze)} gap={mix(14, 10, squeeze)}
    draw={progress(frame, props.cue('lanes'), 40)}
    closed={progress(frame, closedAt, 16)} ask={progress(frame, askAt, 22)} relay={progress(frame, relayAt, 22)}
    check={progress(frame, checkAt, 26)} switchNote={progress(frame, wordFrame(S, 's03-04', 'switch'), 14)}
    answer={progress(frame, decidesAt, 18)}
    focus={{ switch: windowWeight(frame, closedAt, askAt), radius: windowWeight(frame, decidesAt, props.cue('roles')) }} />
</div>
// `roles`: light each lane in turn (focus device, then switch, then radius as the voice names them)

// s04: EAP rides the arrows; then the two endings (one RoleLanes with the outcome switched, or PortVerdict ×2)
<RoleLanes width={1500} closed={1} ask={1} relay={1} check={1} answer={1}
  eap={progress(frame, props.cue('eap'), 16)}
  outcome={frame < props.cue('reject') - 6 ? 'accept' : 'reject'}
  verdict={windowWeight(frame, props.cue('accept'), props.cue('reject') - 6) + progress(frame, props.cue('reject'), 14)} />
<PortVerdict kind="accept" width={620} show={progress(frame, props.cue('accept'), 14)} />
<PortVerdict kind="reject" width={620} show={progress(frame, props.cue('reject'), 14)} />
```

---

## `EntranceGate` — «la puerta del recinto» (s03, s04, s10) · `EntranceGate.tsx`

The compound's **entrance**, seen from the side (an elevation: never V16's top-down hut with a striped barrier arm),
left to right in the same order as the three roles: the **driver** in a truck cab outside the fence, holding up the
accreditation card; the **gatehouse** (gabled roof, big lit window) with the **guard on the phone** — he doesn't decide;
the **gate**, a sliding gate with spiked bars between two pillars, that rolls aside behind the gatehouse; and, inside the
fence, **«la oficina de acreditaciones»** — its own building with a sign, the clerk on the phone and the **list** on the
wall. The call is an arc from the gatehouse roof to the office that lights cyan; the answer (emerald tick / rose cross)
travels back along it. Colours: guard and gatehouse cyan; office cyan, then emerald (yes) / rose (no) with `answer`;
gate steel, then emerald / rose with `result`.

Design 1000 × 440 (`h = 0.44 × width`). **Full ≥ 700 px** (at 1000+ the guard's handset and the list read clearly —
use that size while the voice explains it); **`detail: 'icon'` below 440 px** (no sign text: a board with two bars; no
mesh; thick lines) for s10's rule card (~300–400 px). The sign stands on two posts above the office roof; its text is
32 px HTML, so at small widths it overhangs the office to the left (it clears the gate pillars). Checked: 1700, 840,
700, 390, 360.

| Prop | Type | Default | Meaning |
|---|---|---|---|
| `width` | px | — | |
| `card` | 0–1 | 1 | the driver raises the card from the window towards the gatehouse |
| `call` | 0–1 | 0 | the guard lifts the handset, the arc lights gatehouse → office (a dash flows once lit), the clerk picks up |
| `check` | 0–1 | 0 | a highlight runs down the office's list to the found row |
| `answer` | 0–1 | 0 | the verdict mark travels office → gatehouse (lands over the roof at 1); the office takes the verdict colour |
| `verdict` | `'yes' \| 'no'` | `'yes'` | |
| `open` | 0–1 | 0 | the gate rolls aside. **Independent**: it never opens by itself — you pick the beat (keep 0 on «no») |
| `result` | 0–1 | 0 | the verdict on the gate: tick / cross in the opening, pillars and bars emerald / rose |
| `officeCard` | 0–1 | 0 | EAP-TLS: the clerk holds up the office's own accreditation in the window |
| `officeCardSent` | 0–1 | 0 | that card travels back along the arc and lands beside the driver's card |
| `focus` / `dim` | `{ driver?, guard?, gate?, office? }` | `{}` | glow / extra dim per element (`autoDim` true) |
| `sign` | boolean | true | the office sign's text |
| `detail` | `'full' \| 'icon'` | from width | |
| `glow`, `dimAll` | 0–1 | 0 | whole part |
| `at` | frame | — | pop-in |

**Helpers.** `entranceGateSize(width)` → `{ w, h, scale }`; `entranceGatePoint(width, which)` with `which` = `'card'`,
`'driver'`, `'truck'`, `'guard'`, `'booth'`, `'roof'` (where the call leaves), `'gate'`, `'office'`, `'clerk'`, `'list'`,
`'sign'` (bottom-right of the sign), `'ground'`, `'line'` (top of the call arc) — px from the top-left, e.g. to hang
role tags under the driver / guard / office. `entranceGateDetail(width)`. Text: `ENTRANCE_GATE_TEXT`.

```tsx
// s03 `gate`: «El conductor enseña su acreditación, el vigilante llama a la oficina de acreditaciones y abre si le dicen que sí»
const callAt = wordFrame(S, 's03-08', 'llama'), yesAt = wordFrame(S, 's03-08', 'sí');
<EntranceGate width={1100} card={progress(frame, wordFrame(S, 's03-08', 'acreditación') - 6, 16)}
  call={progress(frame, callAt, 20)} check={progress(frame, callAt + 14, 30)}
  answer={progress(frame, yesAt - 14, 18)} open={progress(frame, yesAt + 4, 22)} result={progress(frame, yesAt + 4, 14)}
  focus={{ guard: windowWeight(frame, callAt - 4, yesAt - 14) }} />

// s04-03 EAP-TLS: «como si la oficina también te enseñara su acreditación»
<EntranceGate width={1000} call={1} check={1} officeCard={progress(frame, s0403.from, 16)}
  officeCardSent={progress(frame, s0403.from + 30, 40)} focus={{ office: windowWeight(frame, s0403.from, s0403.to) }} />

// s04 «un portátil que nadie ha dado de alta»: no
<EntranceGate width={900} call={1} check={1} answer={1} verdict="no" result={1} />

// s10 rule 1 icon
<EntranceGate width={360} call={1} answer={1} open={1} result={1} />
```

---

## `Sites` + `Launch` — the corridor and the launch (s05, s07, s08, s10) · `Sites.tsx`

The two sites **from above**, like V16's port map: «sede» (left) and «terminal de contenedores» (right, with container
stacks), their equipment inside, and between them a street that is not yours, «Internet» (slate; anonymous cars when
`traffic` > 0). The **covered corridor** (SITE-TO-SITE VPN) crosses the street from «pasarela de la sede» to «pasarela de
la terminal»: a straight walkway with a ribbed glass roof and its shadow on the street — seen from above it has no
arches, no piers, no cables, so it never reads as a bridge. Water runs along the bottom (the quay) with the sede's jetty,
where **the launch** (REMOTE ACCESS VPN) lands: one person aboard with a laptop and its «cliente» tag.

Design 1728 × 660 = the whole stage (`h = 0.382 × width`). The drawing scales with `width`; label text stays ≥ 32 px
and wraps inside its building. Full ≥ ~1100 px; **`detail: 'icon'` below 560 px** (no labels, equipment or traffic;
thick lines) for s10. Checked: 1728, 1100, 480, 460.

| Prop | Type | Default | Meaning |
|---|---|---|---|
| `width` | px | 1728 | |
| `draw` | 0–1 | 1 | buildings + street appear |
| `corridor` | 0–1 | 1 | the corridor grows across the street, sede → terminal; the gateway doors light with it |
| `gateways` | 0–1 | = `corridor` | the two «pasarela de …» labels (above each end, inside its building) |
| `equipment` | 0–1 | 1 | workstations inside both buildings |
| `transparent` | 0–1 | 0 | «no instalan nada / no saben que existe» (two lines, on the street) + dashed leaders to both groups |
| `traffic` | 0–1 | 0 | cars on the street (they pass under the corridor; frame-driven) |
| `packet` | 0–1 or array | — | something travelling in the corridor, 0 = sede's gateway … 1 = terminal's (nothing drawn at exactly 0 or 1) |
| `cargo` | ReactNode \| `(scale) => ReactNode` | glowing packet | replaces the packet (px, centred on its point). The corridor is 80 × `scale` px tall: a `TunnelContainer` of `width ≤ 210 × scale` fits inside |
| `launch` | 0–1 | 0 | the launch shows |
| `launchT` | 0–1 | 0 | along its route on the water: 0 = out on the right … 1 = at the sede's jetty (a wake while moving) |
| `launchClient` | 0–1 | 1 | its «cliente» tag |
| `water` | 0–1 | 1 | water + quay + jetty (0 for an icon with just the corridor) |
| `focus` / `dim` | `{ sede?, terminal?, street?, corridor?, launch?, equipment? }` | `{}` | (`autoDim` true) |
| `labels` | boolean | true | |
| `detail`, `frame`, `style`, `children` | | | |

**Helpers** (px from the top-left): `sitesLayout(width)` → `{ width, height, scale, sede, terminal, street, corridor:
{x0,x1,y0,y1,cy}, gateways: { sede, terminal }, water, pier, streetLabel, caption, equipment: { sede, terminal } }`;
`sitesPoint(width, 'sede' | 'terminal' | 'street' | 'corridor' | 'gatewaySede' | 'gatewayTerminal' | 'pier' | 'water' |
'caption')`; `corridorPoint(width, t)`; `launchPoint(width, t)`. Text: `SITES_TEXT`.

### `Launch` (standalone: s08 has no buildings)

A small motor boat, bow left (`flip` turns it), ONE person aboard (neutral) with an open laptop (cyan) and the
«cliente» tag over it (32 px). Design 280 × 170 (`launchSize(width)`); ≥ ~220 px keeps the tag in proportion.

| Prop | Type | Default | Meaning |
|---|---|---|---|
| `width` | px | 280 | |
| `client` | 0–1 | 1 | the tag (and the screen lights) |
| `tag` | boolean | true | false: a tag outline without text (icon sizes) |
| `wake` | 0–1 | 0 | wake behind the stern (it is moving) |
| `water` | boolean | true | a short strip of waves under the hull |
| `flip`, `glow`, `dim`, `show`, `style` | | | |

`launchAnchor(width, 'laptop' | 'tag' | 'person' | 'bow' | 'stern' | 'waterline', flip)` → px.

```tsx
// s05: the two sites; Internet in the middle; the corridor; the launch
<Sites draw={progress(frame, props.cue('two-sites'), 24)} corridor={progress(frame, props.cue('gateways') + 20, 30)}
  traffic={progress(frame, props.cue('gateways'), 20)} transparent={progress(frame, props.cue('transparent'), 16)}
  packet={frame > corridorAt ? [((frame - corridorAt) % 90) / 90] : []}
  focus={{ corridor: windowWeight(frame, corridorAt, clientAt) }}
  launch={progress(frame, clientAt, 16)} launchT={progress(frame, props.cue('launch'), 90, EASE.inOut)} />

// s07: the container travels the corridor (tunnel mode, «de pasarela a pasarela»)
<Sites width={1400} equipment={0.5} packet={progress(frame, props.cue('container'), 70, EASE.inOut)}
  cargo={(s) => <TunnelContainer width={200 * s} />} />

// s08: the launch comes back on its own
<Launch width={320} wake={1} />

// s10 rule 2 icon: the corridor carrying the container
<Sites width={460} water={0} packet={0.5} cargo={(s) => <ContainerIcon width={200 * s} />} />
```

---

## `Shipment` — IPSec as a shipment (s06, s07, s10) · `Shipment.tsx`

Four objects in one drawing language (side elevation, steel outlines, the port's seal in cyan). The **load**
(`LoadGlyph`: two cartons and a written sheet) and the **seal** (`SealTag`: a pull-tight security seal — a band, a small
locking head and a flag tag; never a padlock: it shows tampering, it doesn't lock) are the same objects in the bag and
in the box.

| Component | Metaphor | Design (w × h) | Props (0–1 unless noted; default in brackets) |
|---|---|---|---|
| `SealBag` | AH: transparent bag, load visible, seal at the neck | 300 × 360 | `load` [1] drops in from above · `seal` [1] pulled shut · `broken` [0] band snaps, rose |
| `SealedBox` | ESP: the same load in a closed box, same seal on a strap over the seam | 320 × 360 | `load` [1] disappears behind the front · `lid` [1] flaps closed (0 = open) · `seal` [1] (only once the lid is shut) · `broken` [0] |
| `TruckLoad` | transport mode: load under a tarp, plate in view | 490 × 214 | `cover` [1] tarp pulled over the load from the cab backwards (0 = load in the open) · `plateGlow` [0] · `plate` boolean [true] |
| `TunnelContainer` | tunnel mode: the whole truck inside a container | 660 × 250 | `truckIn` [1] (at 0 the truck waits to the LEFT of the box: leave ~one container width free) · `doors` [1] shut · `label` [1] placard · `labelGlow` [0] · `ghost` [0] dashed x-ray of the truck inside · `truck` boolean [true] |
| `ContainerIcon` | s10's rule-2 icon | 220 wide | `TunnelContainer` with everything shut |

All take `width` (px; the height follows), `glow`, `dim`, `show`, `style`. Checked: bag 330, box 340, truck 760, container
800 / 620 / 300 / 220.

- **The plate** is drawn, never written: a white plate with a laptop, a drawn arrow and a server (the original header:
  from one device to another). No letters, no numbers.
- **The placard** prints the canon string on two lines, split at « · » (the line break replaces the separator):
  «pasarela de la sede» / «pasarela de la terminal». 32 px from `width` ≥ ~600 (36 px max); it shrinks to 22 px down to
  360; **below 360 px the placard shows two bars** (icon).
- Sizes: `sealBagSize`, `sealedBoxSize`, `truckLoadSize`, `tunnelContainerSize` (`width` → `{ w, h, scale }`).
- Anchors (px): `sealBagPoint(width, 'seal' | 'load' | 'top')`, `sealedBoxPoint(width, 'seal' | 'lid' | 'top' | 'front')`,
  `truckLoadPoint(width, 'plate' | 'load' | 'cab' | 'rear' | 'front')`, `tunnelContainerPoint(width, 'placard' | 'doors' |
  'front' | 'roof')`. Text: `SHIPMENT_TEXT` (`ah`, `esp`, `transport`, `tunnel`, `container`, `containerLines`).

```tsx
// s06 `seal`: the bag; «si la abren, se nota» (a short broken beat, then intact again)
<SealBag width={360} load={progress(frame, props.cue('ah'), 30)} seal={progress(frame, props.cue('ah') + 30, 12)}
  broken={windowWeight(frame, wordFrame(S, 's06-05', 'abren'), wordFrame(S, 's06-05', 'pero'))} />
// s06 `box`: the same load into the box, lid, seal (sfx «lock» on the seal)
<SealedBox width={380} load={progress(frame, props.cue('box') - 30, 26)} lid={progress(frame, props.cue('box'), 14)}
  seal={progress(frame, props.cue('box') + 14, 10)} />

// s07 `plates`: covered load, plate lit
<TruckLoad width={760} cover={progress(frame, props.cue('transport'), 30)}
  plateGlow={windowWeight(frame, props.cue('plates'), props.cue('tunnel'))} />
// s07 `container`: the truck drives in, doors shut, the placard is all you see
<div style={{ position: 'absolute', left: 900, top: 300 }}>
  <TunnelContainer width={760} truckIn={progress(frame, props.cue('container') - 20, 40, EASE.inOut)}
    doors={progress(frame, props.cue('container') + 24, 12)} label={progress(frame, props.cue('container') + 34, 14)} />
</div>

// s10 rule 2 icon
<ContainerIcon width={220} />
```

---

## `Customs` — «la aduana» and one foot on each side (s09, s10) · `Customs.tsx`

Seen from above: the **fence** runs top to bottom down the middle — outside on the left («Internet», slate, a globe),
inside on the right («red interna», cyan, three systems). The **customs booth** («aduana») sits ON the fence with an
inspection lane and a scanner arch through it; `inspect` runs a scanning beam and shows «filtrado web · DLP · registros
del SOC» under it. The port's **laptop** is a little character on two legs:

- **FULL TUNNEL** (`split` 0): it stands outside; the tunnel (a cyan tube) takes everything it sends — web, files and
  mail tokens — into the booth; after inspection, files and mail go on to the internal network and web goes back out
  to the Internet: every flow passes through customs.
- **SPLIT TUNNEL** (`split` 1): it walks onto the fence line and stands **with one foot on each side**; files and mail
  still go through the booth, but web goes straight out to the Internet, now marked unwatched (amber eye-off) —
  `direct` draws that route in amber with «directo · sin inspección»; `bridge` lights the rose link Internet → laptop →
  internal network (the «puente»; the caption «hace de puente entre Internet sin vigilar y la red interna» is the
  scene's).

Design 1600 × 600 (`h = 0.375 × width`); label text ≥ 32 px. Full ≥ ~1100 px; **`detail: 'icon'` below 560 px** (no
text, thick lines) for s10's rule card. Checked: 1600, 1100, 480.

| Prop | Type | Default | Meaning |
|---|---|---|---|
| `width` | px | 1600 | |
| `split` | 0–1 | 0 | 0 full tunnel … 1 split (the laptop walks onto the fence; routes cross-fade; tokens follow the mode `split` is closer to) |
| `draw` | 0–1 | 1 | fence, regions, booth |
| `tunnel` | 0–1 | 1 | the tube laptop → booth draws in (and the onward branches with it) |
| `laptop` | 0–1 | 1 | |
| `web` / `files` / `mail` | 0–1 or array | — | token(s) along that flow's route in the current mode (loop them, e.g. `((frame - t0) % 120) / 120`) |
| `inspect` | 0–1 | 0 | scanning beam + «filtrado web · DLP · registros del SOC» |
| `direct` | 0–1 | 0 | split only: the amber direct route + «directo · sin inspección» |
| `bridge` | 0–1 | 0 | split only: the rose «puente» link, dashes flowing |
| `focus` / `dim` | `{ customs?, laptop?, internet?, inside? }` | `{}` | (`autoDim` true) |
| `labels`, `detail`, `frame`, `style` | | | |

**Helpers** (px): `customsLayout(width)` → `{ width, height, scale, fenceX, booth, globe, net, laptop: { full, split },
inspectLabel, directLabel }`; `customsPoint(width, 'booth' | 'globe' | 'net' | 'laptopFull' | 'laptopSplit' |
'fenceTop' | 'fenceBottom')`; `customsRoute(width, 'full' | 'split', 'web' | 'files' | 'mail' | 'tunnel')` → the
polyline (to place your own markers). `customsSize`, `customsDetail`. `LeggedLaptop({ x, y, straddle, lw, color })` draws the
laptop alone inside your own `<svg>` (design units; feet ~78 below `y`; `straddle` 1 = one foot each side of `x`).
Text: `CUSTOMS_TEXT`.

```tsx
// s09: full tunnel first, then split; one scheme at a time
const loop = (t0: number, n: number, off = 0) => (frame < t0 ? 0 : ((frame - t0) / n + off) % 1);
const full = props.cue('full'), split = props.cue('split');
<Customs split={progress(frame, split, 30, EASE.inOut)} tunnel={progress(frame, full, 24)}
  web={loop(full, 120)} files={loop(full, 120, 0.33)} mail={loop(full, 120, 0.66)}
  inspect={progress(frame, props.cue('inspect'), 16) * (1 - progress(frame, split, 12))}
  direct={progress(frame, split + 30, 16)} bridge={progress(frame, props.cue('bridge'), 18)}
  focus={{ laptop: windowWeight(frame, props.cue('bridge'), props.cue('decision')) }} />

// s10 rule 3 icon
<Customs width={460} files={0.6} web={0.3} inspect={1} />
```

---

## `glyphs.tsx` — shared drawings and helpers

`CardGlyph` (the accreditation card, V16's look), `PersonBust`, `HandsetGlyph`, `VerdictMark` (emerald tick / rose
cross in a ring), `LoadGlyph`, `SealTag` (`band` 'ring' | 'strap'), `PlateGlyph`, `TruckSide` (side-view truck, nose
right; `cargo` 'none' | 'load', `cover`, `plate`, `driver`), `ArrowHead`, `SvgIcon` (an engine `Icon` inside an
`<svg>`), `Label` (positioned HTML text), and the helpers `INK` (palette), `mixHex` (blend two hex colours — use it
instead of remotion's `interpolateColors`, whose `rgba()` output the theme's `alpha()` can't tint), `strokeAt`,
`resolveFocus`, `elementStyle`, `polylinePoint` / `polylinePath` / `polylineLength`, `useSvgId`, `dropGlow`, `joinFilters`.

## Strings these parts print that are not in the brief's canon list

Plain labels for the drawings: «el directorio» (RoleLanes, RADIUS's lane; the narration says «el directorio»),
«aduana», «red interna» and «Internet» (Customs), «Internet» on the street (Sites; the brief names the street so),
«oficina de acreditaciones» (EntranceGate's sign; named in the narration and in the brief's metaphor), «EAP» (exam
term), «cliente» (the launch's tag; in the brief). Stacked renderings: the three lane labels («name · term») and the
container placard («pasarela de la sede · pasarela de la terminal») are drawn on two lines without the « · ».


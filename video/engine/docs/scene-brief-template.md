<!--
  Template for video/engine/scripts/scene-brief.mjs (the «scene-builder brief» handed to the agents that
  write a video's scenes). Everything in it is generic: edit the rules HERE and every future brief picks them
  up. The generator writes the title line itself and fills each {{placeholder}} from the video's own files
  (video.json, storyboard.json, narration.json, src/timeline.json); an unknown placeholder is an error, and
  {{canon}}, {{scenes}}, {{keepClear}} and {{catalog}} must stay in the template.
  Placeholders: slug, workspace, width, height, fps, trackLine, timelineLine, lessonLine, references,
  exampleComponent, keepClear, canon, scenes, catalog. This comment is not copied into the brief.
-->
Work in {{workspace}}.
Do not switch branches, do not commit, do not push, do not stash. Node: `eval "$(fnm env)"`.
Remotion 4 + React 19 + TypeScript. {{width}}×{{height}}, {{fps}} fps. {{trackLine}}

## Inputs (read these)
- `video/{{slug}}/storyboard.json`: scene ids, titles and `goal` — **the goal is your visual spec** (each
  scene's goal is repeated under «Scenes» below).
- `video/{{slug}}/narration.json`: what is said and where each `{cue}` falls — sync beats to cues. In the
  «narración hablada» style the voice never reads domains, IPs, hashes or e-mail addresses aloud, so **the exact
  strings must be on screen** at the moment the voice refers to them («este dominio», «esta otra IP»).
- `video/{{slug}}/src/timeline.json`: {{timelineLine}} Drive everything from `props.cue(id)`,
  `segment(props, id)`, `wordFrame(...)` (kit.tsx) and relative frames — never absolute numbers from this file,
  and never assume a scene's length.
- Source lesson for accuracy: {{lessonLine}}
- Engine contract: `video/engine/src/timeline/types.ts` (SceneProps), `video/engine/src/theme/tokens.ts` (C, TYPE,
  LAYOUT, STAGE, alpha, ACCENT), `video/engine/src/theme/motion.ts` (EASE, progress, fadeIn, fadeOut, enter,
  springIn), `video/engine/src/ui/*` (see «Componentes del motor» at the end),
  `video/{{slug}}/src/scenes/kit.tsx` (Stage, segment, wordFrame).
- Reference implementations to match in quality and idiom (same engine): {{references}}.

{{canon}}

## Text rules
- On-screen text: Spanish, with exam terms in English (the terms the narration itself uses in English).
- On-screen TEXT may not contain arrow characters or emoji (draw arrows as SVG/Connector).
- Never show «IntelForge»; the brand is «ALERTÓPOLIS». The «datos ficticios» tag is drawn by the engine — do
  not draw your own.

## Layout rules
- Draw ONLY inside the stage (y 190–850; use `<Stage>`; stage-local 1728×660). The top band belongs to the
  chapter rail / exam card; captions own y 872–1046 in the videos
  that burn them in; YouTube (-yt) videos have none on screen (YouTube shows the VTT, over the bottom of the
  frame when the viewer turns it on), so that band is free, but keep essential text above y ≈ 900.
- The top-centre of the stage (stage-local y ≈ 0–230, x ≈ 400–1330) is where the **think prompt** and the
  **intercepted-message card** appear. Keep that area free of essential text during:
{{keepClear}}
  E.g. keep a diagram low or small, or delay a reveal until the card has gone.
- Text the narration points at must be ≥ 32 px (TYPE.label); pure texture (log lines) may be 22–26 px.
- Colour semantics: cyan = defender/system/victim, rose = attacker/critical, amber = noise/warning,
  emerald = OK/validated/«oro», sky = infrastructure, violet = exam. Video-specific meanings are in «Canon».
- Motion: things appear on their cue, ease with EASE/progress, nothing jitters; no text overflow; everything
  readable on a ~896 px wide player. Every scene must look intentional at its first and last frame (no empty
  stage).

{{scenes}}

## Ownership
- Only edit YOUR scene files (listed in your dispatch) and new files you create for them
  (`src/data/<scene-id>.ts` or `src/scenes/parts/<scene-id>/*.tsx`). Do NOT edit kit.tsx, index.ts, Root.tsx,
  Placeholder.tsx, Poster.tsx, storyboard/narration/timeline, anything under video/engine or other videos —
  unless your dispatch says so.
- Shared parts under `src/scenes/parts/` that you do not own are read-only; if you truly need more, wrap them in
  your own file and say so in your report.
- Keep each scene component exported with the same name as its stub (listed per scene above, e.g.
  `export function {{exampleComponent}}(props: SceneProps)`).
- Code comments in English.

## Verify (required)
1. Type check: `node node_modules/typescript/bin/tsc --noEmit -p video/{{slug}}/tsconfig.json` → no errors
   (another agent's in-progress file may break it; if the error is in someone else's file, note it and check
   yours in isolation).
2. QA stills of each of your scenes: `node video/engine/scripts/qa-frames.mjs --video {{slug}} --scene <scene-id>`
   (Bash tool with `dangerouslyDisableSandbox: true`; it bundles to a temp dir and writes JPEGs to
   `video/{{slug}}/out/qa/<scene-id>/`). Other agents render in parallel, so the CPU is busy: run it in the
   background if it's slow, and if Chrome times out, retry once. Open several stills with the Read tool (start,
   each cue, think/intercept moments, end) and fix overflow, overlap, unreadable text, empty frames. Iterate
   until clean.
3. Report: which stills you checked, what you fixed, anything you could not solve.

{{catalog}}

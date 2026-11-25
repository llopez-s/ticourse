# Vídeos de redes (casos con test) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** que el motor de vídeo acepte la pista `opo` y dejar ficha y guion sin congelar de los cinco vídeos del bloque `op1`.

**Architecture:** la pista se añade a las tablas por pista del motor (`video/engine/scripts`), sin tocar perfiles ni componentes. Cada vídeo es una carpeta `video/<slug>/` con `video.json`, `storyboard.json`, `narration.json` y `lexicon.json`, validada con `build-timeline.mjs --estimate`. Las escenas (`src/`) no entran.

**Tech Stack:** Node (`node --test` para `video/engine/scripts/lib/*.test.mjs`), JSON de guion del motor Remotion.

**Spec:** `docs/superpowers/specs/2026-11-24-redes-videos-casos-test-design.md`

## Global Constraints

- Todo en español, preguntas incluidas; sin calificadores en mayúsculas; nunca «como en el examen».
- Preguntas nuevas respecto al `quiz` y los `check` de su lección.
- Direcciones IP, MAC y máscaras completas solo en pantalla; la voz dice qué son.
- Rangos de Arcedo: sede 10.20.10/20/30/99.0/24, oficinas 10.20.8.0/22, CPD 10.20.72.0/21; públicas de documentación.
- Solo hechos de RFC e IEEE 802; lo de fabricante, dicho. Cálculos de subred comprobados con script.
- Sin adversario ni interceptados. `"voice": "recording/lidia"`, sin `recording.tempo`. Música «Go On Going - Stayloose.mp3».
- Sin `"frozen"`. Ni el repo ni los textos públicos nombran una convocatoria.
- Los vídeos de `secplus` y `gcti` no cambian (sus pruebas siguen pasando sin tocarlas).

## Review Focus

- Un `objective` que no sea un bloque de la pista en un vídeo `opo` → error claro del validador (prueba en la tarea 1).
- `youtube.md` de un vídeo `opo` no debe decir «Lista: GCTI» (prueba en la tarea 1).
- `canon-check` de un vídeo `opo` debe leer `src/data/opo` y `canon/arcedo.md`, no el corpus de GCTI (tarea 2, comprobado al ejecutarlo).
- Una pregunta con dos respuestas defendibles o un cálculo mal hecho (revisor de exactitud, tarea 5).
- Una pregunta que parafrasea el cuestionario de la lección (revisor de exactitud, tarea 5).

---

### Task 1: la pista `opo` en el motor

**Files:** `video/engine/scripts/lib/profiles.mjs`, `scripts/youtube-meta.mjs`, `scripts/lib/youtube-api.mjs`, `scripts/lib/scene-brief.mjs`, `scripts/scene-brief.mjs`, `scripts/canon-check.mjs`; pruebas en `scripts/lib/exam-track.test.mjs`, `profiles.test.mjs`, `youtube-meta.test.mjs`.

**Produces:**
- `AFFILIATION.opo = 'ninguna administración pública'`
- `EXAM_BADGE.opo = 'REDES Y ENS'`; `examBadgeFor('opo') === 'REDES Y ENS'`
- `export const OPO_BLOCKS = ['Redes', 'ENS y normativa', 'Servicios de red', 'Infraestructuras', 'Identidad']`; `examObjectiveError('opo', 'Redes') === null`, y con otro valor, `exam.objective must be a block of the track (…)`
- `TRACK_LABEL.opo = 'Redes para oposiciones TIC'`; `TRACK_TAGS.opo = ['redes', 'oposiciones TIC', 'redes de comunicaciones', 'administración pública', 'informática', 'Alertópolis']`; `HASHTAGS.opo = '#Redes #OposicionesTIC #Alertópolis'`; las etiquetas usan el bloque tal cual, como GCTI
- `export function playlistLabel(track)` en `youtube-meta.mjs` → `'Security+ SY0-701' | 'GCTI' | 'Redes y ENS'`, usada en la línea «Lista:»
- `PLAYLIST_TITLES.opo = 'Redes y ENS para oposiciones TIC'`
- `TRACKS.opo = { label: 'Redes y ENS track', campaign: 'Consorcio Provincial de Arcedo (no adversary)' }`; `locateLesson` reconoce ids `opNmN`
- `CAMPAIGN.opo = 'arcedo'`; el corpus de `opo` recorre `src/data/opo`

- [ ] Pruebas primero (fallan), luego el código, luego `node --test video/engine/scripts/lib/` en verde. Commit.

### Task 2: registro de Arcedo

**Files:** crear `docs/superpowers/canon/arcedo.md` con lo que las lecciones `src/data/opo/op1-m*.ts` y `labs-op1.ts` ya fijan (sedes, VLAN, rangos, equipos con nombre), cada dato con `ruta:línea`. Commit.

### Task 3: piloto `video/vlan-arcedo/` (op1m3, `caso-yt`)

**Files:** `video.json`, `storyboard.json`, `narration.json`, `lexicon.json`; ficha `docs/superpowers/plans/fichas-redes/R03-op1m3.md`.

- [ ] Leer `op1-m3.ts` entero; ficha con conceptos, escenas, preguntas y qué queda fuera, citando líneas.
- [ ] Guion; `node video/engine/scripts/build-timeline.mjs --video vlan-arcedo --estimate` sin errores y duración estimada cerca del techo del perfil menos un 10 %.
- [ ] `canon-check.mjs --video vlan-arcedo`. Commit y subir la rama.

### Task 4: los otros cuatro, con el piloto de modelo

`trama-arcedo` (op1m1, `caso-yt`; leer antes `video/viaje-conexion` y `video/abrir-web`), `subredes-arcedo` (op1m2, `caso-principal-yt`), `rutas-arcedo` (op1m4, `caso-principal-yt`), `wan-wifi-arcedo` (op1m5, `caso-yt`). Fichas `R01`, `R02`, `R04`, `R05`. Mismos pasos que la tarea 3; los datos nuevos, al registro. Un commit por vídeo.

### Task 5: revisión

- [ ] Revisor de exactitud (solo lectura): cada dato contra la lección y el estándar; cada cálculo rehecho con script; una sola respuesta defendible; ninguna pregunta repetida del cuestionario.
- [ ] Revisor de naturalidad (solo lectura): reglas de «narración hablada» del plan de vídeos §1.
- [ ] Aplicar lo que proceda, volver a validar los cinco, `node --test` del motor, hojas de grabación con `script-sheets.mjs`, PR sin fusionar.

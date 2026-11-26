# Bloque `op3` «Servicios de red»: plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Añadir a la pista `opo` el bloque `op3` (cinco lecciones, labs, tarjetas, glosario, jefe y dos supuestos)
sobre DNS, DHCP, NTP y servicios de conectividad.

**Architecture:** Igual que `op6` (`docs/superpowers/plans/2026-11-26-opo-op6-ens.md`, léelo como modelo): un
archivo por lección en `src/data/opo/op3-mN.ts`, agregador `op3.ts`, `op3-cards.ts`, `labs-op3.ts`, supuestos en
`src/data/opo/supuestos/op3sN.ts`. Primero un dossier de fuentes primarias (RFC); las piezas solo usan lo que está
en él. Piezas en paralelo, un archivo por subagente; el controlador conecta y confirma.

**Tech Stack:** Vite 7 · React 19 · TypeScript estricto · Vitest. Node vía fnm (`eval "$(fnm env)"`).

**Spec:** `docs/superpowers/specs/2026-11-26-opo-op3-servicios-design.md`

**Worktree:** `C:/Users/lidie/AppData/Local/Temp/alertopolis-voz/op3-servicios`, rama `opo-op3-servicios` desde
`origin/main` (ya incluye `op6`).

## Global Constraints

- Todo en español, preguntas incluidas; protocolos y siglas en su forma habitual, desarrolladas la primera vez.
- Ninguna cifra (puerto, tipo de mensaje, campo, código, temporizador) de memoria: del dossier de la Tarea 1, con
  su RFC. Lo que sea de un fabricante se rotula como tal («valor por defecto de Windows Server», etc.).
- Nunca nombrar una convocatoria ni «como en el examen»/«tipo examen».
- Escenario: canon `docs/superpowers/canon/arcedo.md` (direccionamiento §3; organización de la seguridad §7b).
  Ningún sistema nuevo fuera de los rangos del canon; los servicios corporativos viven en el CPD `10.20.72.0/21`.
- Ids: sección `op3`, `num: 3`, entre `op1` y `op6` en `OP_SECTIONS`; lecciones `op3m1`…`op3m5`; preguntas
  `op3mNqK`; tarjetas `fco301`…; labs `opl3a`…; supuestos `op3s1`, `op3s2`. Dominio: `'Servicios de red'`.
- Cada lección: `objectives` ≥ 4, `check` ≥ 4, `table` ≥ 2, 8 preguntas de 4 opciones, correcta en ≥ 3 posiciones.
- `ca` solo confirmado (TERMCAT bloquea el acceso automático; la Viquipèdia en catalán sí vale).
- Commits con `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`; PR sin merge.

## Review Focus

1. Un puerto, tipo de mensaje o temporizador que no coincide con su RFC (lo cubre la revisión de exactitud por pieza).
2. Valores de fabricante presentados como estándar (Kerberos 5 min, tiempos de concesión por defecto).
3. Siglas nuevas sin glosario (`acronyms.test.ts`, Tarea 7).
4. Direcciones fuera del canon o contradicciones con `op1`/`op6` (revisión final y canon).
5. Respuestas de un supuesto visibles antes de su fase (`validateSupuesto` + revisión).

---

### Task 1: Dossier de fuentes
**Files:** Create `docs/superpowers/sources/2026-11-26-op3-fuentes.md`.
- [ ] Texto de las RFC desde rfc-editor.org (y estado: vigente, actualizada por, obsoleta). Mínimo: 1034, 1035,
  2181, 2136 (DDNS), 2845/8945 (TSIG), 4033–4035 (DNSSEC), 6891 (EDNS), 7766 (DNS sobre TCP), 7858 (DoT), 8484
  (DoH), 1995/5936 (IXFR/AXFR), 6844/8659 (CAA), 2782 (SRV), 2131, 2132, 3046, 3203?, 9915 (DHCPv6, obsoleta la 8415), 4861/4862 y
  la RFC de las flags M/O, 5905 (NTPv4), 8915 (NTS), 4120 (Kerberos, tolerancia de reloj), 7230/9110 (proxies),
  3040, el borrador WPAD y lo que IEEE publica de 802.1X y 1588. Tabla por RFC: apartado · qué fija · cifras literales.
- [ ] Valores de fabricante solo si hay documentación oficial del fabricante (con URL), rotulados.
- [ ] `⚠ sin fuente` en lo no confirmado. Commit `docs(opo): dossier de fuentes del bloque op3`.

### Task 2: Lecciones `op3m1`–`op3m5` (en paralelo, un subagente por archivo)
**Files:** Create `src/data/opo/op3-m1.ts` (`OP3_M1`) … `op3-m5.ts` (`OP3_M5`), contenido de la tabla del spec.
- [ ] Cada una con la forma de `op1-m1.ts`, datos solo del dossier, enlaces `links` a Security+ y a `op1` donde
  ya se explica algo. Sin commit; `npx tsc --noEmit -p .` limpio en su archivo.
- [ ] Revisión de exactitud por lección contra el dossier y la RFC; ronda de correcciones; re-revisión acotada.

### Task 3: Conexión y prueba de forma (controlador)
**Files:** Create `src/data/opo/op3.ts` (`OP3_MODULES`); Modify `sections.ts` (sección `op3` con jefe),
`tracks.ts`, `practical.test.ts` (`originals`), `opo.test.ts`.
- [ ] Test «block 3 (servicios de red) lessons follow the shape»: ids `['op3m1'…'op3m5']`, forma de las Global
  Constraints, dominio `'Servicios de red'`. RED → conectar → GREEN; `npm test`, `npm run build`. Commit.

### Task 4: Labs `opl3a`, `opl3b` (y `opl3c` si encaja)
**Files:** Create `src/data/opo/labs-op3.ts`, `src/data/opo/op3-labs.test.ts`; Modify `opo/labs.ts`,
`lab-guides.ts`, `src/lib/labChallenge.test.ts` (32 → 34 o 35).
- [ ] `opl3a` `order`: DORA con relay (mensajes, quién los emite, giaddr). `opl3b` `classify`: registros DNS por
  función. Test propio que compruebe los datos (12 elementos, respuestas dentro de las categorías, orden de 8 pasos).

### Task 5: Supuesto `op3s1` (diseño) · Task 6: Supuesto `op3s2` (avería)
**Files:** Create `src/data/opo/supuestos/op3s1.ts` / `op3s2.ts`; el controlador registra `meta.ts` y `LOADERS`.
- [ ] Según `docs/supuestos.md` y `op1s1.ts`; 4–6 fases, 100 puntos, `minutes: 60`, `version: 1`,
  `sectionIds: ['op3']`, `refs` a `/learn/op3mN` y a la RFC. Test temporal con `validateSupuesto`, luego borrarlo.

### Task 7: Tarjetas, glosario y siglas
**Files:** Create `src/data/opo/op3-cards.ts`; Modify `tracks.ts`, `acronyms.test.ts`, `opo.test.ts`.
- [ ] ~30 tarjetas `fco301`…, ~50 entradas de glosario con siglas desarrolladas y únicas en la pista; totales
  exactos fijados en el test. Commit.

### Task 8: Canon, documentación, revisión final y PR
- [ ] Canon §3/§7b con los hechos nuevos (servidores DNS/DHCP/NTP del Consorcio, zonas, ámbitos).
- [ ] `CLAUDE.md` y `README.md` con `op3` y los totales; `npm test`, `npm run build`.
- [ ] Prueba de navegador como en `op6` (entrada temporal en `.claude/launch.json`, restaurarla enseguida).
- [ ] Revisión final de toda la rama; una ronda de correcciones; push y PR. Sin merge.

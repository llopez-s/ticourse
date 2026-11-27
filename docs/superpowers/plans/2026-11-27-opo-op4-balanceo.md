# Bloque `op4` «Balanceo y alta disponibilidad»: plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Añadir a la pista `opo` el bloque `op4` (cinco lecciones, labs, tarjetas, glosario, jefe y dos supuestos)
sobre alta disponibilidad, balanceo L4 y L7, persistencia, comprobaciones de salud, descarga de TLS y publicación.

**Architecture:** Igual que `op6` (`docs/superpowers/plans/2026-11-26-opo-op6-ens.md`, léelo como modelo): un
archivo por lección en `src/data/opo/op4-mN.ts`, agregador `op4.ts`, `op4-cards.ts`, `labs-op4.ts`, supuestos en
`src/data/opo/supuestos/op4sN.ts`. Primero un dossier de fuentes primarias (RFC y documentación oficial de fabricantes); las piezas solo usan lo que está
en él. Piezas en paralelo, un archivo por subagente; el controlador conecta y confirma.

**Tech Stack:** Vite 7 · React 19 · TypeScript estricto · Vitest. Node vía fnm (`eval "$(fnm env)"`).

**Spec:** `docs/superpowers/specs/2026-11-26-opo-op4-balanceo-design.md`

**Worktree:** `C:/Users/lidie/AppData/Local/Temp/alertopolis-voz/op4-balanceo`, rama `opo-op4-balanceo` desde
`origin/main` (ya incluye `op3` y `op6`).

## Global Constraints

- Todo en español, preguntas incluidas; protocolos y siglas en su forma habitual, desarrolladas la primera vez.
- Ninguna cifra (puerto, tipo de mensaje, campo, código, temporizador) de memoria: del dossier de la Tarea 1, con
  su RFC. Lo que sea de un fabricante se rotula como tal («valor del fabricante», con el fabricante nombrado). En este bloque es lo más frecuente: algoritmos, valores de las comprobaciones, tiempos de persistencia y protocolo PROXY.
- Nunca nombrar una convocatoria ni «como en el examen»/«tipo examen».
- Escenario: canon `docs/superpowers/canon/arcedo.md` (direccionamiento §3; organización de la seguridad §7b).
  Ningún sistema nuevo fuera de los rangos del canon; los servicios corporativos viven en el CPD `10.20.72.0/21`.
- Ids: sección `op4`, `num: 4`, entre `op3` y `op6` en `OP_SECTIONS`; lecciones `op4m1`…`op4m5`; preguntas
  `op4mNqK`; tarjetas `fco401`…; labs `opl4a`…; supuestos `op4s1`, `op4s2`. Dominio: `'Balanceo y alta disponibilidad'`.
- Cada lección: `objectives` ≥ 4, `check` ≥ 4, `table` ≥ 2, 8 preguntas de 4 opciones, correcta en ≥ 3 posiciones.
- `ca` solo confirmado (TERMCAT bloquea el acceso automático; la Viquipèdia en catalán sí vale).
- Commits con `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`; PR sin merge.

## Review Focus

1. Un valor de fabricante presentado como estándar, o una cifra que no coincide con su fuente (lo cubre la revisión de exactitud por pieza).
2. Valores de fabricante presentados como estándar (Kerberos 5 min, tiempos de concesión por defecto).
3. Siglas nuevas sin glosario (`acronyms.test.ts`, Tarea 7).
4. Direcciones fuera del canon o contradicciones con `op1`/`op3`/`op6` (revisión final y canon).
5. Respuestas de un supuesto visibles antes de su fase (`validateSupuesto` + revisión).

---

### Task 1: Dossier de fuentes
**Files:** Create `docs/superpowers/sources/2026-11-26-op4-fuentes.md`.
- [ ] Texto de las RFC desde rfc-editor.org con su estado (vigente, actualizada por, obsoleta): 9110, 9112, 9113, 7239,
  6265, 8446, 6066, 7301, VRRP vigente (comprobar si la 5798 está obsoleta), 2281 (HSRP, informativa), 2991/2992 (ECMP), 4786
  (anycast), 5880 (BFD), 3022 (NAT), 1794, 7230 si hace falta. Tabla por fuente: apartado · qué fija · cifras literales.
- [ ] Fabricantes con documentación oficial y URL: HAProxy (algoritmos, `check`, `inter`/`rise`/`fall`, `cookie`, protocolo
  PROXY), NGINX (`upstream`, `ip_hash`, `max_fails`/`fail_timeout`), F5 BIG-IP o Microsoft NLB/ARR si aportan algo, y la
  aritmética de disponibilidad (nueves a minutos, serie y paralelo) con su fuente o comprobada.
- [ ] Valores de fabricante solo si hay documentación oficial del fabricante (con URL), rotulados.
- [ ] `⚠ sin fuente` en lo no confirmado. Commit `docs(opo): dossier de fuentes del bloque op3`.

### Task 2: Lecciones `op4m1`–`op4m5` (en paralelo, un subagente por archivo)
**Files:** Create `src/data/opo/op4-m1.ts` (`OP4_M1`) … `op4-m5.ts` (`OP4_M5`), contenido de la tabla del spec.
- [ ] Cada una con la forma de `op1-m1.ts`, datos solo del dossier, enlaces `links` a Security+ y a `op1` donde
  ya se explica algo. Sin commit; `npx tsc --noEmit -p .` limpio en su archivo.
- [ ] Revisión de exactitud por lección contra el dossier y la RFC; ronda de correcciones; re-revisión acotada.

### Task 3: Conexión y prueba de forma (controlador)
**Files:** Create `src/data/opo/op4.ts` (`OP4_MODULES`); Modify `sections.ts` (sección `op4` con jefe),
`tracks.ts`, `practical.test.ts` (`originals`), `opo.test.ts`.
- [ ] Test «block 4 (balanceo) lessons follow the shape»: ids `['op4m1'…'op4m5']`, forma de las Global
  Constraints, dominio `'Balanceo y alta disponibilidad'`. RED → conectar → GREEN; `npm test`, `npm run build`. Commit.

### Task 4: Labs `opl4a`, `opl4b`, `opl4c`
**Files:** Create `src/data/opo/labs-op4.ts`, `src/data/opo/op4-labs.test.ts`; Modify `opo/labs.ts`,
`lab-guides.ts`, `src/lib/labChallenge.test.ts` (35 → 38).
- [ ] `opl4a` `classify`: ¿basta L4 o hace falta L7? `opl4b` `order`: una comprobación de salud saca un miembro, lo drena
  y lo vuelve a meter. `opl4c` `classify`: requisitos por método de persistencia o modo de TLS. Test propio que compruebe los datos (12 elementos, respuestas dentro de las categorías, orden de 8 pasos).

### Task 5: Supuesto `op4s1` (diseño) · Task 6: Supuesto `op4s2` (avería)
**Files:** Create `src/data/opo/supuestos/op4s1.ts` / `op4s2.ts`; el controlador registra `meta.ts` y `LOADERS`.
- [ ] Según `docs/supuestos.md` y `op1s1.ts`; 4–6 fases, 100 puntos, `minutes: 60`, `version: 1`,
  `sectionIds: ['op4']`, `refs` a `/learn/op4mN` y a la RFC. Test temporal con `validateSupuesto`, luego borrarlo.

### Task 7: Tarjetas, glosario y siglas
**Files:** Create `src/data/opo/op4-cards.ts`; Modify `tracks.ts`, `acronyms.test.ts`, `opo.test.ts`.
- [ ] ~30 tarjetas `fco401`…, ~50 entradas de glosario con siglas desarrolladas y únicas en la pista; totales
  exactos fijados en el test. Commit.

### Task 8: Canon, documentación, revisión final y PR
- [ ] Canon §7d con los hechos nuevos (balanceadores, VIP, grupos, sede electrónica publicada) y §9 con lo que no encaje.
- [ ] `CLAUDE.md` y `README.md` con `op4` y los totales; `npm test`, `npm run build`.
- [ ] Prueba de navegador como en `op6` (entrada temporal en `.claude/launch.json`, restaurarla enseguida).
- [ ] Revisión final de toda la rama; una ronda de correcciones; push y PR. Sin merge.

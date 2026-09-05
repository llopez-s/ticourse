# Security+ Track Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a CompTIA Security+ (SY0-701) study track to IntelForge Academy with a track switcher, full section skeleton, and Domain 1 content complete.

**Architecture:** A `TrackMeta` registry (`src/data/tracks.ts`) bundles each track's sections, modules, flashcards, glossary, labs, domains, exam format, campaign and rank names. The Zustand store gains one persisted field (`track`) with a v1→v2 migration; all progress maps are already keyed by globally unique ids so they are per-track for free. Pages read the active track; content pages derive the track from the id in the URL.

**Tech Stack:** Vite 7 · React 19 · TypeScript strict · Tailwind 4 · Zustand persist · react-router 7 (HashRouter) · vitest (new).

**Spec:** `docs/superpowers/specs/2026-09-04-security-plus-track-design.md`

## Global Constraints

- Not a git repository. **Do not `git init`.** Skip every "commit" step; instead run `npx tsc --noEmit` at the end of each task.
- Run everything from `D:\LLM projects\TICourse`. Node is installed via fnm; if `npm` is not on PATH in Bash, prefix commands with `eval "$(fnm env)" &&` or use PowerShell.
- All ids globally unique: sections `sp1..sp6`, modules `sp1m1..`, questions `sp1m1q1..`, flashcards `fcp101..`, labs `spl1a..`, achievements `sp-*`.
- Domain tag for every Domain 1 question: exactly `'General Security Concepts'`.
- Lesson prose in Spanish with English exam terms in **bold**; quiz questions, flashcards fronts/backs in English; glossary terms English, definitions Spanish (mirror `src/data/glossary.ts`).
- Keep the SANS/GIAC disclaimer intact; add "No afiliado a CompTIA. CompTIA y Security+ son marcas de CompTIA, Inc."
- No new dependencies besides `vitest`.
- `npm run build` (`tsc --noEmit && vite build`) must pass at the end.

---

## File map

| File | Responsibility |
|---|---|
| `package.json` | add `vitest`, `"test": "vitest run"` |
| `vitest.config.ts` (new) | vitest config (node env) |
| `src/lib/types.ts` | `TrackId`, wider `Domain`, `track` on `SectionMeta`/`ExamResult`/`ProgressSnapshot` |
| `src/lib/xp.ts` | `rankFor`/`nextRank` accept a rank table |
| `src/data/secplus/sections.ts` (new) | `SP_SECTIONS`, `SP_RANKS`, `SP_DOMAINS`, `SP_DOMAIN_WEIGHTS` |
| `src/data/secplus/sp1.ts` (new) | `SP1_MODULES` (7 lessons) |
| `src/data/secplus/sp6.ts` (new) | `SP6_MODULES` (exam prep) |
| `src/data/secplus/flashcards.ts` (new) | `SP_FLASHCARDS` |
| `src/data/secplus/glossary.ts` (new) | `SP_GLOSSARY` |
| `src/data/secplus/labs.ts` (new) | `SP_LABS`, `SP_CLASSIFY_DATA`, `SP_ORDER_DATA` |
| `src/data/labs.ts` | rename array to `GCTI_LABS`; `LABS` = both; merge SP data maps |
| `src/data/tracks.ts` (new) | `TRACKS`, `TRACK_IDS`, `TrackMeta` |
| `src/data/course.ts` | combined arrays + track-scoped helpers + `sampleExam` |
| `src/lib/store.ts` | `track`, `setTrack`, `migrateProgress`, version 2 |
| `src/data/achievements.ts` | track-aware thresholds + 3 Sec+ achievements |
| `src/components/Layout.tsx` | track switcher, track-scoped nav |
| `src/pages/*.tsx` | track-aware pages |
| `src/data/course.test.ts`, `src/lib/store.test.ts`, `src/data/content.test.ts` (new) | tests |
| `README.md`, `CLAUDE.md`, `../PROJECTS.md` | docs |

---

### Task 1: Vitest + type foundations

**Files:**
- Modify: `package.json`
- Create: `vitest.config.ts`
- Modify: `src/lib/types.ts`
- Create: `src/lib/types.test.ts`

**Interfaces:**
- Produces: `TrackId`, extended `Domain`, `SectionMeta.track`, `ExamResult.track`, `ProgressSnapshot.track`.

- [ ] **Step 1: Install vitest and add the script**

```bash
npm install --save-dev vitest@^3
```

In `package.json` scripts add `"test": "vitest run"`.

- [ ] **Step 2: Create `vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
```

- [ ] **Step 3: Write a smoke test that fails to compile until types exist**

`src/lib/types.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import type { Domain, TrackId } from './types';

describe('types', () => {
  it('accepts both tracks and the Security+ domains', () => {
    const tracks: TrackId[] = ['gcti', 'secplus'];
    const d: Domain = 'General Security Concepts';
    expect(tracks).toHaveLength(2);
    expect(d).toBe('General Security Concepts');
  });
});
```

- [ ] **Step 4: Run it, expect a type error** — `npx tsc --noEmit` reports `TrackId` not exported / `Domain` mismatch.

- [ ] **Step 5: Edit `src/lib/types.ts`**

Replace the `Domain` type and add `TrackId`:

```ts
export type TrackId = 'gcti' | 'secplus';

export type Domain =
  // GCTI
  | 'Requirements'
  | 'Intrusion Analysis'
  | 'Collection'
  | 'Analysis'
  | 'Dissemination'
  // Security+ SY0-701
  | 'General Security Concepts'
  | 'Threats, Vulnerabilities & Mitigations'
  | 'Security Architecture'
  | 'Security Operations'
  | 'Security Program Management & Oversight';
```

Add `track: TrackId;` to `SectionMeta` (after `id`), to `ExamResult` (after `date`), and to `ProgressSnapshot` (first field).

- [ ] **Step 6: Run `npx tsc --noEmit`** — now errors appear in `course.ts` (sections missing `track`) and `store.ts` (initialState missing `track`). That is expected; fix `course.ts` sections by adding `track: 'gcti',` to each of the six `SECTIONS` entries, and in `store.ts` add `track: 'gcti',` as the first field of `initialState()`. In `ExamPage.tsx` `recordExam({...})` add `track: 'gcti',` temporarily (Task 10 replaces it). `npx tsc --noEmit` must be clean.

- [ ] **Step 7: Run `npm test`** — PASS.

---

### Task 2: Rank tables per track

**Files:**
- Modify: `src/lib/xp.ts`
- Create: `src/lib/xp.test.ts`

**Interfaces:**
- Produces: `rankFor(level: number, ranks: Rank[] = RANKS): Rank`, `nextRank(level: number, ranks: Rank[] = RANKS): Rank | null`.

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, it } from 'vitest';
import { nextRank, rankFor, RANKS, type Rank } from './xp';

const ALT: Rank[] = [
  { lvl: 1, name: 'A', icon: 'a' },
  { lvl: 5, name: 'B', icon: 'b' },
];

describe('ranks', () => {
  it('defaults to RANKS', () => {
    expect(rankFor(1).name).toBe(RANKS[0].name);
  });
  it('uses a custom table', () => {
    expect(rankFor(4, ALT).name).toBe('A');
    expect(rankFor(5, ALT).name).toBe('B');
    expect(nextRank(1, ALT)?.name).toBe('B');
    expect(nextRank(5, ALT)).toBeNull();
  });
});
```

- [ ] **Step 2: Run `npm test`** — FAIL (extra argument / wrong result).

- [ ] **Step 3: Implement**

```ts
export function rankFor(level: number, ranks: Rank[] = RANKS): Rank {
  let r = ranks[0];
  for (const rank of ranks) if (level >= rank.lvl) r = rank;
  return r;
}

export function nextRank(level: number, ranks: Rank[] = RANKS): Rank | null {
  for (const rank of ranks) if (rank.lvl > level) return rank;
  return null;
}
```

- [ ] **Step 4: `npm test` PASS, `npx tsc --noEmit` clean.**

---

### Task 3: Security+ skeleton data files

**Files:**
- Create: `src/data/secplus/sections.ts`, `src/data/secplus/sp1.ts`, `src/data/secplus/sp6.ts`, `src/data/secplus/flashcards.ts`, `src/data/secplus/glossary.ts`, `src/data/secplus/labs.ts`
- Modify: `src/data/labs.ts`

**Interfaces:**
- Produces: `SP_SECTIONS: SectionMeta[]`, `SP_RANKS: Rank[]`, `SP_DOMAINS: Domain[]`, `SP_DOMAIN_WEIGHTS: Record<string, number>`, `SP1_MODULES: Module[]` (empty for now), `SP6_MODULES: Module[]`, `SP_FLASHCARDS: Flashcard[]` (empty), `SP_GLOSSARY: GlossaryEntry[]` (empty), `SP_LABS: LabMeta[]` (empty), `SP_CLASSIFY_DATA`, `SP_ORDER_DATA` (empty records), `GCTI_LABS`, `LABS`.

- [ ] **Step 1: `src/data/secplus/sections.ts`**

```ts
import type { Domain, SectionMeta } from '../../lib/types';
import type { Rank } from '../../lib/xp';

export const SP_DOMAINS: Domain[] = [
  'General Security Concepts',
  'Threats, Vulnerabilities & Mitigations',
  'Security Architecture',
  'Security Operations',
  'Security Program Management & Oversight',
];

/** Official SY0-701 exam weights */
export const SP_DOMAIN_WEIGHTS: Record<string, number> = {
  'General Security Concepts': 0.12,
  'Threats, Vulnerabilities & Mitigations': 0.22,
  'Security Architecture': 0.18,
  'Security Operations': 0.28,
  'Security Program Management & Oversight': 0.2,
};

export const SP_RANKS: Rank[] = [
  { lvl: 1, name: 'Trainee', icon: '🎓' },
  { lvl: 3, name: 'Help Desk', icon: '🎧' },
  { lvl: 5, name: 'SOC Analyst I', icon: '🛡️' },
  { lvl: 8, name: 'SOC Analyst II', icon: '🔎' },
  { lvl: 11, name: 'Security Engineer', icon: '⚙️' },
  { lvl: 14, name: 'Security Architect', icon: '🏛️' },
  { lvl: 18, name: 'CISO', icon: '👑' },
];

export const SP_SECTIONS: SectionMeta[] = [
  {
    id: 'sp1', track: 'secplus', num: 1,
    title: 'Conceptos generales de seguridad',
    short: 'Conceptos',
    subtitle: 'Controles de seguridad, CIA y AAA, Zero Trust, seguridad física, change management y criptografía: la base de todo el examen (12%).',
    domain: 'General Security Concepts', icon: '🧱',
    boss: {
      codename: 'FIRST KEY', adversary: 'NULL CIPHER',
      flavor: 'Una célula de acceso inicial prueba cada puerta de la Autoridad Portuaria de Halden: badges clonados, cambios sin aprobar, certificados caducados. Demuestra que dominas los fundamentos antes de que encuentren la que no cierra.',
      dossier: 'NULL CIPHER neutralizada. En su equipo: un lector de badges clonado y un certificado autofirmado que alguien instaló como raíz «temporalmente» hace tres años. La nota adjunta dice: «el puerto sigue sin inventario». Firmado: GH.',
    },
  },
  {
    id: 'sp2', track: 'secplus', num: 2,
    title: 'Amenazas, vulnerabilidades y mitigaciones',
    short: 'Amenazas',
    subtitle: 'Actores y motivaciones, vectores, ingeniería social, malware, vulnerabilidades por tipo, indicadores y mitigaciones (22%).',
    domain: 'Threats, Vulnerabilities & Mitigations', icon: '🦠',
    boss: {
      codename: 'OPEN WOUND', adversary: 'RED MARROW',
      flavor: 'Phishing, USB en el aparcamiento y un proveedor comprometido: RED MARROW ataca por todos los vectores a la vez. Reconoce cada técnica y su mitigación.',
      dossier: 'RED MARROW cae. Sus kits de phishing apuntaban a los operadores de grúas del puerto y su malware llegaba por un proveedor de mantenimiento. GH compra acceso a través de terceros.',
    },
  },
  {
    id: 'sp3', track: 'secplus', num: 3,
    title: 'Arquitectura de seguridad',
    short: 'Arquitectura',
    subtitle: 'Modelos de arquitectura, cloud, IoT/OT, segmentación, protección de datos y resiliencia (18%).',
    domain: 'Security Architecture', icon: '🏗️',
    boss: {
      codename: 'LOAD BEARING', adversary: 'BLIND ARCHITECT',
      flavor: 'Una red plana, sistemas OT en la misma VLAN que las oficinas y backups sin probar. BLIND ARCHITECT solo necesita que un pilar falle.',
      dossier: 'BLIND ARCHITECT derrotada. Su plan dependía de que los PLC de las esclusas fueran alcanzables desde la wifi de invitados. Segmentación y backups probados le cerraron el paso. GH busca un punto único de fallo.',
    },
  },
  {
    id: 'sp4', track: 'secplus', num: 4,
    title: 'Operaciones de seguridad',
    short: 'Operaciones',
    subtitle: 'Hardening, gestión de activos y vulnerabilidades, monitorización, IAM, automatización, respuesta a incidentes y forense (28%).',
    domain: 'Security Operations', icon: '🖥️',
    boss: {
      codename: 'NIGHT WATCH', adversary: 'SILENT PAGER',
      flavor: 'Las alertas llegan a las 3 a. m. y nadie las lee. SILENT PAGER cuenta con que tu SOC duerma. Detecta, responde y documenta más rápido que ella.',
      dossier: 'SILENT PAGER expuesta. Movimiento lateral con cuentas de servicio sin rotar y logs que nadie centralizaba. La cadena de custodia de tus evidencias señala una IP del mismo ASN que NULL CIPHER. GH es una sola operación.',
    },
  },
  {
    id: 'sp5', track: 'secplus', num: 5,
    title: 'Gestión y supervisión del programa de seguridad',
    short: 'Gobernanza',
    subtitle: 'Gobernanza, gestión de riesgos, terceros, cumplimiento, auditorías y concienciación (20%).',
    domain: 'Security Program Management & Oversight', icon: '📜',
    boss: {
      codename: 'FINAL AUDIT', adversary: 'PAPER GOVERNOR',
      flavor: 'Políticas sin dueño, riesgos sin registro y un proveedor sin contrato. PAPER GOVERNOR vive en los huecos de tu gobernanza. Última auditoría, analista.',
      dossier: 'PAPER GOVERNOR desenmascarada: GLASS HARBOR era un contratista con acceso perpetuo y sin due diligence. Registro de riesgos, contratos con SLA de seguridad y auditorías cierran el caso. El puerto vuelve a operar.',
    },
  },
  {
    id: 'sp6', track: 'secplus', num: 6,
    title: 'Preparación del examen Security+',
    short: 'Exam Prep',
    subtitle: 'Formato del examen SY0-701, PBQs, gestión del tiempo y examen de práctica cronometrado.',
    domain: null, icon: '📋', boss: null,
  },
];
```

- [ ] **Step 2: `src/data/secplus/sp1.ts`** — placeholder that compiles (filled in Tasks 11–14):

```ts
import type { Module } from '../../lib/types';

export const SP1_MODULES: Module[] = [];
```

- [ ] **Step 3: `src/data/secplus/sp6.ts`** — write the full exam-prep lesson now (it is short):

```ts
import type { Module } from '../../lib/types';

export const SP6_MODULES: Module[] = [
  {
    id: 'sp6m1',
    sectionId: 'sp6',
    title: 'El examen Security+: formato y estrategia',
    minutes: 10,
    objectives: [
      'Conocer el formato del examen SY0-701',
      'Saber qué son las PBQs y cómo gestionarlas',
      'Repartir el tiempo por tipo de pregunta',
      'Usar los pesos por dominio para priorizar el estudio',
    ],
    blocks: [
      { t: 'p', md: 'El **CompTIA Security+ (SY0-701)** es un examen **closed-book** de hasta **90 preguntas** en **90 minutos**, puntuado en una escala de **100 a 900** con corte en **750**. Mezcla preguntas tipo test (una o varias respuestas correctas) con **performance-based questions (PBQs)**: simulaciones donde configuras un firewall, ordenas pasos de respuesta o clasificas controles. Verifica siempre los datos vigentes en `comptia.org`.' },
      { t: 'callout', kind: 'exam', title: 'PBQs primero… o no', md: 'Las PBQs suelen aparecer al principio y consumen mucho tiempo. Estrategia recomendada: **marca y salta** las PBQs, resuelve el test (tu puntuación segura) y vuelve con el tiempo restante. El examen permite revisar preguntas marcadas.' },
      { t: 'table', headers: ['Dominio', 'Peso', 'Sección aquí'], rows: [
        ['1.0 General Security Concepts', '12%', 'S1'],
        ['2.0 Threats, Vulnerabilities & Mitigations', '22%', 'S2'],
        ['3.0 Security Architecture', '18%', 'S3'],
        ['4.0 Security Operations', '28%', 'S4'],
        ['5.0 Security Program Management & Oversight', '20%', 'S5'],
      ] },
      { t: 'p', md: 'Los pesos importan: **Operaciones (28%) y Amenazas (22%)** suman la mitad del examen. Los conceptos generales (12%) pesan poco en preguntas pero son el **vocabulario** que todas las demás usan: sin ellos no entiendes las preguntas de los otros dominios.' },
      { t: 'list', items: [
        '**Ritmo**: ~1 minuto por pregunta de test; reserva 15–20 minutos para las PBQs.',
        '**Lee el qualifier**: BEST, MOST likely, FIRST, LEAST. Dos opciones serán defendibles; una encaja *mejor* con el objetivo oficial.',
        '**Piensa como CompTIA**: la respuesta correcta es la práctica estándar de la industria, no la más ingeniosa. Si una opción es un control formal (política, MFA, segmentación), suele ganar a una improvisación.',
        '**No dejes preguntas en blanco**: no hay penalización por fallar.',
      ] },
      { t: 'check', q: { q: 'You open the exam and the first three questions are PBQs that look time-consuming. What is the BEST approach?', choices: ['Solve them first — they are worth more points', 'Mark them, complete the multiple-choice questions, then return with the remaining time', 'Skip them permanently; PBQs are optional', 'Spend up to 30 minutes on each'], answer: 1, explain: 'PBQs are heavy; securing the multiple-choice score first and returning to marked items protects your pace. Blank items score nothing, so never skip permanently.' } },
      { t: 'check', q: { q: 'Which two domains together make up about half of the SY0-701 exam?', choices: ['General Security Concepts and Security Architecture', 'Security Operations and Threats, Vulnerabilities & Mitigations', 'Security Architecture and Program Management', 'General Security Concepts and Security Operations'], answer: 1, explain: 'Operations (28%) + Threats (22%) = 50%. Plan study time accordingly.' } },
      { t: 'p', md: 'Tu plan en esta app: completa las secciones S1→S5 (lecciones, quizzes y labs), derrota a los 5 bosses (≥80%), mantén las flashcards al día y cierra con **simulacros completos** de 90 preguntas hasta superar el **83%** (equivalente aproximado al 750/900) de forma estable.' },
      { t: 'callout', kind: 'warn', md: 'Esta app es material **no oficial** e independiente. No reproduce contenido de CompTIA ni está afiliada a ella. CompTIA y Security+ son marcas de CompTIA, Inc.' },
    ],
    quiz: [],
  },
];
```

- [ ] **Step 4: `src/data/secplus/flashcards.ts`, `glossary.ts`** — placeholders:

```ts
import type { Flashcard } from '../../lib/types';
export const SP_FLASHCARDS: Flashcard[] = [];
```
```ts
import type { GlossaryEntry } from '../../lib/types';
export const SP_GLOSSARY: GlossaryEntry[] = [];
```

- [ ] **Step 5: `src/data/secplus/labs.ts`** — placeholder with type-only import:

```ts
import type { ClassifyData, LabMeta, OrderData } from '../labs';

export const SP_LABS: LabMeta[] = [];
export const SP_CLASSIFY_DATA: Record<string, ClassifyData> = {};
export const SP_ORDER_DATA: Record<string, OrderData> = {};
```

- [ ] **Step 6: Modify `src/data/labs.ts`**

At the top add `import { SP_CLASSIFY_DATA, SP_LABS, SP_ORDER_DATA } from './secplus/labs';`.
Rename `export const LABS: LabMeta[] = [` to `export const GCTI_LABS: LabMeta[] = [` and after that array's closing `];` add:

```ts
export const LABS: LabMeta[] = [...GCTI_LABS, ...SP_LABS];
```

Rename `export const CLASSIFY_DATA: Record<string, ClassifyData> = {` to `const GCTI_CLASSIFY: Record<string, ClassifyData> = {` and after its closing `};` add `export const CLASSIFY_DATA: Record<string, ClassifyData> = { ...GCTI_CLASSIFY, ...SP_CLASSIFY_DATA };`. Same for `ORDER_DATA` → `GCTI_ORDER` + merged export.

- [ ] **Step 7: `npx tsc --noEmit` clean; `npm test` PASS.**

---

### Task 4: Track registry and track-scoped course helpers

**Files:**
- Create: `src/data/tracks.ts`
- Modify: `src/data/course.ts`
- Create: `src/data/course.test.ts`

**Interfaces:**
- Produces: `TRACKS: Record<TrackId, TrackMeta>`, `TRACK_IDS`, `trackOf(sectionId)`, `sectionsOf(track)`, `contentSections(track)`, `modulesOfTrack(track)`, `questionsOfTrack(track)`, `nextModule(track, s)`, `examReadiness(track, s)`, `sampleExam(track, n, seed)`. `SECTIONS`, `ALL_MODULES`, `ALL_QUESTIONS` now span both tracks. `DOMAINS` removed (use `TRACKS[t].domains`).

- [ ] **Step 1: Write failing tests `src/data/course.test.ts`**

```ts
import { describe, expect, it } from 'vitest';
import {
  ALL_MODULES, ALL_QUESTIONS, SECTIONS, examReadiness, modulesOfTrack,
  nextModule, sampleExam, sectionsOf, trackOf,
} from './course';
import { FLASHCARDS } from './flashcards';
import { LABS } from './labs';
import { TRACKS } from './tracks';

const unique = (ids: string[]) => new Set(ids).size === ids.length;

describe('ids', () => {
  it('are globally unique', () => {
    expect(unique(SECTIONS.map((s) => s.id))).toBe(true);
    expect(unique(ALL_MODULES.map((m) => m.id))).toBe(true);
    expect(unique(ALL_QUESTIONS.map((q) => q.id))).toBe(true);
    expect(unique(LABS.map((l) => l.id))).toBe(true);
    expect(unique(FLASHCARDS.map((c) => c.id))).toBe(true);
  });
});

describe('track scoping', () => {
  it('maps sections to tracks', () => {
    expect(trackOf('s1')).toBe('gcti');
    expect(trackOf('sp1')).toBe('secplus');
    expect(trackOf('nope')).toBe('gcti');
    expect(sectionsOf('secplus').map((s) => s.id)).toEqual(['sp1', 'sp2', 'sp3', 'sp4', 'sp5', 'sp6']);
    expect(modulesOfTrack('gcti').every((m) => m.id.startsWith('s'))).toBe(true);
    expect(modulesOfTrack('secplus').every((m) => m.id.startsWith('sp'))).toBe(true);
  });
  it('nextModule respects the track', () => {
    const s = { lessons: { s1m1: true } };
    expect(nextModule('gcti', s)?.id).toBe('s1m2');
    expect(nextModule('secplus', {}).id.startsWith('sp')).toBe(true);
  });
  it('examReadiness ignores sections without modules', () => {
    const empty = { lessons: {}, quizBest: {}, labs: {}, bosses: {} };
    expect(examReadiness('gcti', empty)).toBe(0);
    const allSp1 = {
      lessons: Object.fromEntries(modulesOfTrack('secplus').filter((m) => m.sectionId === 'sp1').map((m) => [m.id, true])),
      quizBest: Object.fromEntries(modulesOfTrack('secplus').filter((m) => m.sectionId === 'sp1').map((m) => [m.id, 100])),
      labs: Object.fromEntries(LABS.filter((l) => l.sectionId === 'sp1').map((l) => [l.id, true])),
      bosses: { sp1: 100 },
    };
    expect(examReadiness('secplus', allSp1)).toBe(100);
  });
});

describe('sampleExam', () => {
  it('returns n questions weighted by domain for gcti', () => {
    const qs = sampleExam('gcti', 25, 'seed');
    expect(qs).toHaveLength(25);
    for (const d of TRACKS.gcti.domains) {
      expect(qs.filter((q) => q.domain === d)).toHaveLength(5);
    }
  });
  it('skips empty domains and caps at what exists', () => {
    const qs = sampleExam('secplus', 30, 'seed');
    const available = modulesOfTrack('secplus').flatMap((m) => m.quiz).length;
    expect(qs.length).toBe(Math.min(30, available));
    expect(qs.every((q) => TRACKS.secplus.domains.includes(q.domain))).toBe(true);
    expect(new Set(qs.map((q) => q.id)).size).toBe(qs.length);
  });
  it('is deterministic for a seed', () => {
    expect(sampleExam('gcti', 10, 'x').map((q) => q.id)).toEqual(sampleExam('gcti', 10, 'x').map((q) => q.id));
  });
});
```

- [ ] **Step 2: Run `npm test`** — FAIL (module `./tracks` missing, helpers missing).

- [ ] **Step 3: Create `src/data/tracks.ts`**

```ts
import type { Domain, Flashcard, GlossaryEntry, Module, SectionMeta, TrackId } from '../lib/types';
import { RANKS, type Rank } from '../lib/xp';
import { GCTI_LABS, type LabMeta } from './labs';
import { FLASHCARDS as GCTI_FLASHCARDS } from './flashcards';
import { GLOSSARY as GCTI_GLOSSARY } from './glossary';
import { GCTI_SECTIONS } from './course-gcti';
import { S1_MODULES } from './s1';
import { S2_MODULES } from './s2';
import { S3_MODULES } from './s3';
import { S4_MODULES } from './s4';
import { S5_MODULES } from './s5';
import { S6_MODULES } from './s6';
import { SP_DOMAIN_WEIGHTS, SP_DOMAINS, SP_RANKS, SP_SECTIONS } from './secplus/sections';
import { SP1_MODULES } from './secplus/sp1';
import { SP6_MODULES } from './secplus/sp6';
import { SP_FLASHCARDS } from './secplus/flashcards';
import { SP_GLOSSARY } from './secplus/glossary';
import { SP_LABS } from './secplus/labs';

export type { TrackId };

export interface TrackMeta {
  id: TrackId;
  name: string;
  brand: string;
  icon: string;
  tagline: string;
  disclaimer: string;
  domains: Domain[];
  domainWeights: Record<string, number>;
  sections: SectionMeta[];
  modules: Module[];
  flashcards: Flashcard[];
  glossary: GlossaryEntry[];
  labs: LabMeta[];
  ranks: Rank[];
  exam: {
    name: string;
    realFormat: string;
    passPct: number;
    sprint: { n: number; minutes: number };
    full: { n: number; minutes: number };
  };
  campaign: { title: string; intro: string };
}

const GCTI_DOMAINS: Domain[] = ['Requirements', 'Intrusion Analysis', 'Collection', 'Analysis', 'Dissemination'];

export const TRACKS: Record<TrackId, TrackMeta> = {
  gcti: {
    id: 'gcti',
    name: 'CTI · GCTI',
    brand: 'CTI Academy',
    icon: '◆',
    tagline: 'Preparación FOR578 · GCTI — teoría, labs y examen en un solo sitio.',
    disclaimer: 'Material de estudio no oficial creado para preparar los temas de FOR578/GCTI. No afiliado a SANS ni GIAC.',
    domains: GCTI_DOMAINS,
    domainWeights: Object.fromEntries(GCTI_DOMAINS.map((d) => [d, 0.2])),
    sections: GCTI_SECTIONS,
    modules: [...S1_MODULES, ...S2_MODULES, ...S3_MODULES, ...S4_MODULES, ...S5_MODULES, ...S6_MODULES],
    flashcards: GCTI_FLASHCARDS,
    glossary: GCTI_GLOSSARY,
    labs: GCTI_LABS,
    ranks: RANKS,
    exam: {
      name: 'Simulacro GCTI',
      realFormat: 'Preguntas muestreadas de los 5 dominios del curso, cronometradas y sin feedback inmediato — como el examen real (75 preguntas, 2 h, open-book).',
      passPct: 75,
      sprint: { n: 25, minutes: 30 },
      full: { n: 50, minutes: 60 },
    },
    campaign: {
      title: 'Operación VELVET CICADA',
      intro: 'Eres la primera analista CTI de Meridian Dynamics. Completa las 5 misiones (labs) y derrota a los 5 bosses para desenmascarar al grupo.',
    },
  },
  secplus: {
    id: 'secplus',
    name: 'Security+',
    brand: 'Security+ Forge',
    icon: '🛡️',
    tagline: 'Preparación CompTIA Security+ (SY0-701) — los 5 dominios, labs y simulacros.',
    disclaimer: 'Material de estudio no oficial e independiente para preparar los objetivos públicos del SY0-701. No afiliado a CompTIA. CompTIA y Security+ son marcas de CompTIA, Inc.',
    domains: SP_DOMAINS,
    domainWeights: SP_DOMAIN_WEIGHTS,
    sections: SP_SECTIONS,
    modules: [...SP1_MODULES, ...SP6_MODULES],
    flashcards: SP_FLASHCARDS,
    glossary: SP_GLOSSARY,
    labs: SP_LABS,
    ranks: SP_RANKS,
    exam: {
      name: 'Simulacro Security+',
      realFormat: 'Preguntas muestreadas con los pesos oficiales por dominio, cronometradas y sin feedback hasta el final — como el examen real (hasta 90 preguntas, 90 min, corte 750/900, closed-book).',
      passPct: 83,
      sprint: { n: 30, minutes: 30 },
      full: { n: 90, minutes: 90 },
    },
    campaign: {
      title: 'Operación GLASS HARBOR',
      intro: 'Eres la primera analista de seguridad de la Autoridad Portuaria de Halden. Completa las 5 misiones (labs) y derrota a los 5 bosses para descubrir quién está detrás de GLASS HARBOR.',
    },
  },
};

export const TRACK_IDS: TrackId[] = ['gcti', 'secplus'];
```

- [ ] **Step 4: Move the GCTI `SECTIONS` array out of `course.ts`**

Create `src/data/course-gcti.ts` containing the existing six section objects (copied verbatim from `course.ts`, each with `track: 'gcti'`) exported as `export const GCTI_SECTIONS: SectionMeta[] = [...]`. This avoids a `course.ts ↔ tracks.ts` import cycle.

- [ ] **Step 5: Rewrite `src/data/course.ts`**

```ts
import type { Module, ProgressSnapshot, Question, SectionMeta, TrackId } from '../lib/types';
import { pct, sample, shuffle } from '../lib/util';
import { LABS } from './labs';
import { TRACKS, TRACK_IDS } from './tracks';

export const SECTIONS: SectionMeta[] = TRACK_IDS.flatMap((t) => TRACKS[t].sections);
export const ALL_MODULES: Module[] = TRACK_IDS.flatMap((t) => TRACKS[t].modules);
export const ALL_QUESTIONS: Question[] = ALL_MODULES.flatMap((m) => m.quiz);

// ---- global lookups (ids are unique across tracks) -------------------------
export const sectionById = (id: string) => SECTIONS.find((s) => s.id === id);
export const moduleById = (id: string) => ALL_MODULES.find((m) => m.id === id);
export const modulesOf = (sectionId: string) => ALL_MODULES.filter((m) => m.sectionId === sectionId);
export const labsOf = (sectionId: string) => LABS.filter((l) => l.sectionId === sectionId);
export const questionsOf = (sectionId: string): Question[] => modulesOf(sectionId).flatMap((m) => m.quiz);

// ---- track scoping ---------------------------------------------------------
export const trackOf = (sectionId: string): TrackId => sectionById(sectionId)?.track ?? 'gcti';
export const sectionsOf = (track: TrackId) => TRACKS[track].sections;
export const contentSections = (track: TrackId) => TRACKS[track].sections.filter((s) => s.boss !== null);
export const modulesOfTrack = (track: TrackId) => TRACKS[track].modules;
export const questionsOfTrack = (track: TrackId): Question[] => TRACKS[track].modules.flatMap((m) => m.quiz);
export const nextModule = (track: TrackId, s: Pick<ProgressSnapshot, 'lessons'>) =>
  TRACKS[track].modules.find((m) => !s.lessons[m.id]);

type Prog = Pick<ProgressSnapshot, 'lessons' | 'quizBest' | 'labs' | 'bosses'>;

/** Section mastery 0-100: lessons 40%, best quiz scores 30%, labs 15%, boss 15%. */
export function sectionMastery(sectionId: string, s: Prog): number {
  // (unchanged body from the current file)
}

/** Overall readiness: mean mastery of the track's content sections that have modules. */
export function examReadiness(track: TrackId, s: Prog): number {
  const ids = contentSections(track).filter((sec) => modulesOf(sec.id).length > 0).map((sec) => sec.id);
  if (ids.length === 0) return 0;
  return Math.round(ids.reduce((acc, id) => acc + sectionMastery(id, s), 0) / ids.length);
}

/**
 * Weighted exam sample: round(n × weight) per domain, capped at available
 * questions; shortfall goes to the domains with most spare questions.
 */
export function sampleExam(track: TrackId, n: number, seed: string): Question[] {
  const t = TRACKS[track];
  const all = questionsOfTrack(track);
  const pools = t.domains
    .map((d) => ({ d, qs: all.filter((q) => q.domain === d) }))
    .filter((p) => p.qs.length > 0);
  if (pools.length === 0) return [];
  const totalW = pools.reduce((a, p) => a + (t.domainWeights[p.d] ?? 0), 0);
  const take = pools.map((p) => Math.min(p.qs.length, Math.round((n * (t.domainWeights[p.d] ?? 0)) / totalW)));
  let assigned = take.reduce((a, b) => a + b, 0);
  while (assigned < n) {
    let best = -1;
    let spare = 0;
    pools.forEach((p, i) => {
      const s = p.qs.length - take[i];
      if (s > spare) { spare = s; best = i; }
    });
    if (best < 0) break;
    take[best] += 1;
    assigned += 1;
  }
  while (assigned > n) {
    let best = 0;
    take.forEach((c, i) => { if (c > take[best]) best = i; });
    take[best] -= 1;
    assigned -= 1;
  }
  const picked = pools.flatMap((p, i) => sample(p.qs, take[i], `${seed}-${p.d}`));
  return shuffle(picked, seed);
}
```

Keep the existing `sectionMastery` body verbatim (it uses `modulesOf`, `labsOf`, `sectionById`, `pct`).

- [ ] **Step 6: Fix compile errors in consumers** — `ExamPage.tsx` imports `DOMAINS` (removed) and `Dashboard.tsx`/`ProfilePage.tsx` call `examReadiness(s)`. Temporary minimal fixes so `tsc` passes (Tasks 8–10 rewrite these pages): in `ExamPage.tsx` replace the `useMemo` body with `return config ? sampleExam('gcti', config.n, \`exam-${attempt}-${Date.now()}\`) : [];` and import `sampleExam`; in `Dashboard.tsx` use `examReadiness('gcti', s)`.

- [ ] **Step 7: `npm test` PASS (the secplus sample test passes with 0 questions since `available` is 0); `npx tsc --noEmit` clean.**

---

### Task 5: Store — active track + v2 migration

**Files:**
- Modify: `src/lib/store.ts`
- Create: `src/lib/store.test.ts`

**Interfaces:**
- Produces: `Store.track: TrackId`, `Store.setTrack(t: TrackId): void`, exported `migrateProgress(persisted: unknown, version: number): Partial<ProgressSnapshot>`.

- [ ] **Step 1: Failing test**

```ts
import { describe, expect, it } from 'vitest';
import { migrateProgress } from './store';

describe('migrateProgress', () => {
  it('v1 → v2 adds track and stamps exams', () => {
    const v1 = { xp: 10, exams: [{ date: '2026-01-01', pct: 80, correct: 20, total: 25, domains: {} }] };
    const out = migrateProgress(v1, 1) as { track: string; exams: { track: string }[] };
    expect(out.track).toBe('gcti');
    expect(out.exams[0].track).toBe('gcti');
  });
  it('v2 passes through', () => {
    const v2 = { track: 'secplus', exams: [] };
    expect(migrateProgress(v2, 2)).toEqual(v2);
  });
});
```

- [ ] **Step 2: `npm test`** — FAIL (`migrateProgress` not exported).

- [ ] **Step 3: Implement**

In `store.ts`:
- import `TrackId` from `./types`.
- `initialState()` first field `track: 'gcti',`.
- Add to `Store` interface: `setTrack: (t: TrackId) => void;`.
- Add action: `setTrack: (t) => set({ track: t }),`.
- `resetAll: () => set({ ...initialState(), track: get().track }),`.
- Export before `useStore`:

```ts
export function migrateProgress(persisted: unknown, version: number): Partial<ProgressSnapshot> {
  const p = (persisted ?? {}) as Partial<ProgressSnapshot> & { exams?: Partial<ExamResult>[] };
  if (version < 2) {
    return {
      ...p,
      track: 'gcti',
      exams: (p.exams ?? []).map((e) => ({ ...e, track: 'gcti' }) as ExamResult),
    };
  }
  return p;
}
```
- persist options: `version: 2`, add `migrate: (persisted, version) => migrateProgress(persisted, version) as Store,` and add `track: s.track,` to `partialize`.

- [ ] **Step 4: `npm test` PASS; `npx tsc --noEmit` clean.**

---

### Task 6: Achievements track-aware + Sec+ achievements

**Files:**
- Modify: `src/data/achievements.ts`
- Create: `src/data/achievements.test.ts`

- [ ] **Step 1: Failing test**

```ts
import { describe, expect, it } from 'vitest';
import { ACHIEVEMENTS } from './achievements';
import { modulesOfTrack } from './course';
import type { ProgressSnapshot } from '../lib/types';

const base = (): ProgressSnapshot => ({
  track: 'gcti', xp: 0, streak: { current: 0, best: 0, lastDay: null, freezes: 0 }, activity: {},
  lessons: {}, quizBest: {}, labs: {}, bosses: {}, exams: [], srs: {},
  calibration: { low: { n: 0, c: 0 }, med: { n: 0, c: 0 }, high: { n: 0, c: 0 } },
  totals: { questions: 0, correct: 0, cards: 0, maxCombo: 0, highConfCorrect: 0, perfectQuizzes: 0, questsDone: 0, checkpoints: 0 },
  achievements: {}, day: { date: '2026-01-01', lessons: 0, questions: 0, correct: 0, cards: 0, labs: 0, highConfCorrect: 0, xpEarned: 0, newCards: 0, questsAwarded: [] },
});
const find = (id: string) => ACHIEVEMENTS.find((a) => a.id === id)!;

describe('achievements', () => {
  it('bookworm counts only GCTI lessons', () => {
    const s = base();
    for (const m of modulesOfTrack('gcti')) s.lessons[m.id] = true;
    expect(find('bookworm').test(s)).toBe(true);
    const sp = base();
    for (const m of modulesOfTrack('secplus')) sp.lessons[m.id] = true;
    expect(find('bookworm').test(sp)).toBe(false);
  });
  it('sp-first-lesson needs a secplus lesson', () => {
    const s = base();
    s.lessons['s1m1'] = true;
    expect(find('sp-first-lesson').test(s)).toBe(false);
    s.lessons['sp1m1'] = true;
    expect(find('sp-first-lesson').test(s)).toBe(true);
  });
  it('sp-exam-ready needs ≥83% on a secplus exam', () => {
    const s = base();
    s.exams.push({ date: 'd', track: 'gcti', pct: 90, correct: 9, total: 10, domains: {} });
    expect(find('sp-exam-ready').test(s)).toBe(false);
    s.exams.push({ date: 'd', track: 'secplus', pct: 83, correct: 9, total: 10, domains: {} });
    expect(find('sp-exam-ready').test(s)).toBe(true);
  });
});
```

- [ ] **Step 2: `npm test`** — FAIL.

- [ ] **Step 3: Implement** — at top of `achievements.ts`:

```ts
import { contentSections, modulesOfTrack, trackOf, moduleById } from './course';
import { TRACKS } from './tracks';
import type { TrackId } from '../lib/types';

const lessonsIn = (s: ProgressSnapshot, t: TrackId) =>
  Object.keys(s.lessons).filter((id) => { const m = moduleById(id); return m && trackOf(m.sectionId) === t; }).length;
const labsIn = (s: ProgressSnapshot, t: TrackId) =>
  Object.keys(s.labs).filter((id) => TRACKS[t].labs.some((l) => l.id === id)).length;
const bossesBeatenIn = (s: ProgressSnapshot, t: TrackId) =>
  contentSections(t).filter((sec) => (s.bosses[sec.id] ?? 0) >= 80).length;
```

Change `bookworm` → `desc: \`Completa las ${modulesOfTrack('gcti').length} lecciones del curso GCTI\``, `test: (s) => lessonsIn(s, 'gcti') >= modulesOfTrack('gcti').length`. `all-labs` → `TRACKS.gcti.labs.length` / `labsIn(s,'gcti')`. `campaign-hero` → `bossesBeatenIn(s,'gcti') >= 5`. `boss-slayer` keeps `bossesBeaten(s) >= 1` (any track). Append:

```ts
  { id: 'sp-first-lesson', icon: '🛡️', title: 'Primer parche', desc: 'Completa tu primera lección de Security+', xp: 25, test: (s) => lessonsIn(s, 'secplus') >= 1 },
  { id: 'sp-campaign', icon: '⚓', title: 'Operación GLASS HARBOR', desc: 'Derrota a los 5 bosses de Security+', xp: 200, test: (s) => bossesBeatenIn(s, 'secplus') >= 5 },
  { id: 'sp-exam-ready', icon: '🎖️', title: '750/900', desc: '≥83% en un simulacro Security+', xp: 150, test: (s) => s.exams.some((e) => e.track === 'secplus' && e.pct >= 83) },
```

- [ ] **Step 4: `npm test` PASS; `npx tsc --noEmit` clean.** (Import cycle check: `store → achievements → course → tracks → data files`; none import `store`. OK.)

---

### Task 7: Layout — track switcher and track-scoped navigation

**Files:**
- Modify: `src/components/Layout.tsx`

- [ ] **Step 1: Add a `useTrack` hook** at the top of `Layout.tsx` (exported for other pages):

```ts
import { useNavigate } from 'react-router-dom';
import { TRACKS, TRACK_IDS, type TrackMeta } from '../data/tracks';
import { sectionsOf, modulesOf } from '../data/course';

export function useTrack(): TrackMeta {
  const id = useStore((s) => s.track);
  return TRACKS[id];
}
```

- [ ] **Step 2: `TrackSwitcher` component**

```tsx
function TrackSwitcher({ compact = false }: { compact?: boolean }) {
  const track = useStore((s) => s.track);
  const setTrack = useStore((s) => s.setTrack);
  const navigate = useNavigate();
  return (
    <div className={`flex rounded-lg border border-ink-600 bg-ink-850 p-0.5 ${compact ? '' : 'mx-3 mb-2'}`} role="tablist" aria-label="Track">
      {TRACK_IDS.map((id) => (
        <button
          key={id}
          role="tab"
          aria-selected={track === id}
          onClick={() => { if (track !== id) { setTrack(id); navigate('/'); } }}
          className={`flex-1 rounded-md px-2 py-1 text-xs font-semibold transition-colors ${track === id ? 'bg-cyan-500 text-ink-950' : 'text-slate-400 hover:text-slate-200'}`}
        >
          {TRACKS[id].icon} {TRACKS[id].name}
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Make nav track-scoped**
- `useDueCount`: replace `FLASHCARDS` with `useTrack().flashcards`.
- `SectionLinks`: `const track = useTrack();` and map over `sectionsOf(track.id)`.
- `TopBar`: `const track = useTrack();` `rankFor(level, track.ranks)`, `nextRank(level, track.ranks)`; mobile quick-nav: first item is `<TrackSwitcher compact />`, and section chips come from `sectionsOf(track.id).map((s) => [\`/section/${s.id}\`, \`S${s.num}\`])`.
- Sidebar header subtitle: `{track.brand}`; insert `<TrackSwitcher />` right under the header link; footer disclaimer `{track.disclaimer}`.
- Remove the now-unused `FLASHCARDS`/`SECTIONS` imports.

- [ ] **Step 4: `npx tsc --noEmit` clean. Start the dev server (`.claude/launch.json` → `intelforge-dev`) and confirm the switcher toggles the sidebar sections between S1–S6 (GCTI) and S1–S6 (Security+) and the rank pill name changes.**

---

### Task 8: Dashboard track-aware

**Files:**
- Modify: `src/pages/Dashboard.tsx`

- [ ] **Step 1: Replace imports** — from `../data/course` import `contentSections, examReadiness, labsOf, modulesOf, nextModule, sectionMastery, sectionsOf`; from `../components/Layout` import `useTrack`; drop `ALL_MODULES`, `SECTIONS`, `LABS`.

- [ ] **Step 2: `CampaignPanel`** takes `track` via `useTrack()`: `missions = track.labs.filter(l => l.mission).sort(...)`, `contentSecs = contentSections(track.id)`, title `{track.campaign.title}`, intro `{track.campaign.intro}`, mission label in `LabPage` (Task 9) also uses `track.campaign.title`. `bossesDown/5` → `/{contentSecs.length}`.

- [ ] **Step 3: `Dashboard`** — `const track = useTrack();` `rankFor(level, track.ranks)`; `readiness = examReadiness(track.id, s)`; `next = nextModule(track.id, s)`; tagline `{track.tagline}`; section grid maps `sectionsOf(track.id)`; when `modulesOf(sec.id).length === 0 && sec.boss` render:

```tsx
<div key={sec.id} className="flex items-center gap-4 rounded-xl border border-dashed border-ink-700 bg-ink-900/50 p-4 opacity-70">
  <Ring value={0} size={56} stroke={5} />
  <div className="min-w-0 flex-1">
    <div className="truncate text-sm font-bold text-slate-300">{sec.icon} S{sec.num} · {sec.short}</div>
    <div className="mt-0.5 text-xs text-slate-500">Próximamente · contenido en preparación</div>
  </div>
</div>
```

- [ ] **Step 4: `npx tsc --noEmit`; in the browser switch to Security+ and check: title tagline, "Continuar" points to `/learn/sp6m1` (only module until content lands), campaign panel shows GLASS HARBOR, S2–S5 show "Próximamente".**

---

### Task 9: Section / Module / Quiz / Boss / Lab pages

**Files:**
- Modify: `src/pages/SectionPage.tsx`, `src/pages/ModulePage.tsx`, `src/pages/QuizPage.tsx`, `src/pages/BossPage.tsx`, `src/pages/LabPage.tsx`

- [ ] **Step 1: Add a `useSyncTrack(sectionId)` hook** in `src/components/Layout.tsx` (export):

```ts
export function useSyncTrack(sectionId: string | undefined) {
  const track = useStore((s) => s.track);
  const setTrack = useStore((s) => s.setTrack);
  useEffect(() => {
    if (!sectionId) return;
    const t = trackOf(sectionId);
    if (t !== track) setTrack(t);
  }, [sectionId, track, setTrack]);
}
```
(import `useEffect` from react and `trackOf` from `../data/course`.)

- [ ] **Step 2: SectionPage** — call `useSyncTrack(section?.id)` right after computing `section` (hooks must run unconditionally: compute `const section = sectionById(id ?? '')` first, call the hook, then early-return). Replace `section.id === 's6'` with `section.boss === null && mods.length > 0` for the exam CTA. When `mods.length === 0` render instead of the theory list:

```tsx
<Panel className="mb-6"><div className="text-sm font-bold text-slate-100">🚧 Contenido en preparación</div><p className="mt-1 text-xs text-slate-400">Las lecciones de esta sección llegarán en una próxima actualización. Mientras tanto, avanza con las secciones disponibles.</p></Panel>
```

- [ ] **Step 3: ModulePage** — in `LessonView`: `useSyncTrack(mod.sectionId)`; replace `ALL_MODULES` with `modulesOfTrack(trackOf(mod.sectionId))` for `globalIdx`/`nextMod`.

- [ ] **Step 4: QuizPage** — `useSyncTrack(mod?.sectionId)` before the early return.

- [ ] **Step 5: BossPage** — `useSyncTrack(section?.id)`; replace the "Siguiente sección" logic:

```tsx
const secs = contentSections(section.track);
const idx = secs.findIndex((x) => x.id === section.id);
const nextSec = secs[idx + 1];
```
Render `nextSec ? <Link to={\`/section/${nextSec.id}\`}>Siguiente sección →</Link> : <Link to="/exam">🏆 Campaña completada — al examen →</Link>` when `r.pct >= 80`.

- [ ] **Step 6: LabPage** — `useSyncTrack(meta?.sectionId)`; mission header uses `TRACKS[trackOf(meta.sectionId)].campaign.title` and `Misión {meta.mission.n}/5`.

- [ ] **Step 7: `npx tsc --noEmit`; browser: open `#/learn/sp6m1` directly while GCTI is active → sidebar flips to Security+.**

---

### Task 10: Exam / Cards / Glossary / Profile pages

**Files:**
- Modify: `src/pages/ExamPage.tsx`, `src/pages/CardsPage.tsx`, `src/pages/GlossaryPage.tsx`, `src/pages/ProfilePage.tsx`

- [ ] **Step 1: ExamPage** — `const track = useTrack();` questions: `sampleExam(track.id, config.n, seed)`. Titles: kicker `track.name`, title `⏱️ ${track.exam.name}`, sub `track.exam.realFormat`; sprint/full buttons use `track.exam.sprint` / `track.exam.full` (labels `${n} preguntas · ${minutes} minutos`); objective text `Objetivo: ≥${track.exam.passPct}%`; `recordExam({ date, track: track.id, ... })`; history `exams.filter((e) => e.track === track.id)`; result color threshold `e.pct >= track.exam.passPct`. Domain breakdown bar threshold uses `track.exam.passPct`. If `questions.length === 0` after config, show a Panel "Aún no hay suficientes preguntas en este track" with a back button.

- [ ] **Step 2: CardsPage** — `const cards = useTrack().flashcards;` replace every `FLASHCARDS` with `cards` (the `cardById` memo depends on `cards`).

- [ ] **Step 3: GlossaryPage** — `const track = useTrack();` `GLOSSARY` → `track.glossary`; chips from `contentSections(track.id)`; print header `Índice — IntelForge Academy · ${track.name} (material no oficial)`; `sec` lookup via `sectionById`.

- [ ] **Step 4: ProfilePage** — `const track = useTrack();` ranks via `track.ranks`; mastery list `contentSections(track.id).filter((sec) => modulesOf(sec.id).length > 0)`.

- [ ] **Step 5: `npx tsc --noEmit`; `npm test`; browser: Security+ exam hub shows 30/90 configs and the empty-questions panel (content not yet loaded); GCTI sprint still yields 25 questions.**

---

### Task 11: Content — sp1m1 (controls) and sp1m2 (CIA/AAA/gap analysis)

**Files:**
- Modify: `src/data/secplus/sp1.ts`
- Create: `src/data/content.test.ts`

Writing rules for every lesson (apply in Tasks 11–14):
- Mirror the style of `src/data/s1.ts`: `p` paragraphs in Spanish with **bold English terms**, one `table` where a comparison exists, ≥1 `callout` of kind `exam`, ≥3 `check` blocks (English question, 4 choices, `answer` index, `explain`), a closing paragraph bridging to the next lesson.
- `minutes` 10–14. `objectives` 4–6 Spanish lines.
- Quiz: 6–8 `Question`s, ids `sp1mNq1..`, `domain: 'General Security Concepts'`, English, CompTIA style (scenario + qualifier), 4 choices, `explain` says why the right one wins AND why the tempting distractor loses.

- [ ] **Step 1: Write `src/data/content.test.ts`**

```ts
import { describe, expect, it } from 'vitest';
import { ALL_MODULES, ALL_QUESTIONS, sectionById } from './course';
import { CLASSIFY_DATA, LABS, ORDER_DATA, SELECT_DATA } from './labs';
import { TRACKS } from './tracks';

describe('content integrity', () => {
  it('questions have 4 choices and a valid answer', () => {
    for (const q of ALL_QUESTIONS) {
      expect(q.choices, q.id).toHaveLength(4);
      expect(q.answer, q.id).toBeGreaterThanOrEqual(0);
      expect(q.answer, q.id).toBeLessThan(4);
      expect(q.explain.length, q.id).toBeGreaterThan(20);
    }
  });
  it('modules, cards, glossary and labs point at existing sections', () => {
    for (const m of ALL_MODULES) expect(sectionById(m.sectionId), m.id).toBeDefined();
    for (const t of Object.values(TRACKS)) {
      for (const c of t.flashcards) expect(sectionById(c.sectionId), c.id).toBeDefined();
      for (const g of t.glossary) expect(sectionById(g.sectionId), g.term).toBeDefined();
      for (const l of t.labs) expect(sectionById(l.sectionId), l.id).toBeDefined();
    }
  });
  it('lab data exists for every classify/order/select lab', () => {
    for (const l of LABS) {
      if (l.kind === 'classify') expect(CLASSIFY_DATA[l.id], l.id).toBeDefined();
      if (l.kind === 'order') expect(ORDER_DATA[l.id], l.id).toBeDefined();
      if (l.kind === 'select') expect(SELECT_DATA[l.id], l.id).toBeDefined();
    }
  });
  it('Domain 1 has enough questions and every question uses its section domain', () => {
    const d1 = ALL_MODULES.filter((m) => m.sectionId === 'sp1');
    const qs = d1.flatMap((m) => m.quiz);
    expect(qs.length).toBeGreaterThanOrEqual(40);
    for (const q of qs) expect(q.domain).toBe('General Security Concepts');
    for (const m of d1) expect(m.blocks.filter((b) => b.t === 'check').length, m.id).toBeGreaterThanOrEqual(3);
  });
});
```

- [ ] **Step 2: `npm test`** — the Domain 1 test FAILS (0 questions).

- [ ] **Step 3: Write `sp1m1` — "Categorías y tipos de controles de seguridad" (objective 1.1)**

Must cover: the four **categories** (Technical — implemented by systems: firewalls, encryption, ACLs; Managerial — administrative: policies, risk assessments, security awareness *planning*; Operational — executed by people day-to-day: guards, training delivery, backups procedures, change-management execution; Physical — locks, fences, bollards, badges) and the six **types** (Preventive — stops the event: firewall, locks; Deterrent — discourages: warning signs, visible cameras; Detective — identifies after/ during: IDS, logs, CCTV review; Corrective — restores: backups restore, patching after incident, incident response; Compensating — alternative when the primary is infeasible: extra monitoring for an unpatchable legacy system, MFA when a password policy can't be enforced; Directive — instructs behavior: AUPs, signage "authorized personnel only", policies). Include a `table` with **category × type** examples (e.g. Technical-Preventive = firewall rule; Physical-Deterrent = warning sign; Managerial-Directive = acceptable-use policy; Operational-Detective = guard log review). Exam callout: "a control can be more than one type; the question asks what it does *in that scenario*". Checks: classify a bollard (Physical/Preventive), a warning banner (Deterrent/Directive), a compensating control scenario. Quiz 7 questions: e.g. "legacy SCADA cannot be patched, adding network monitoring is which type?" (Compensating), "security policy requiring annual training is which category?" (Managerial), "CCTV reviewed after a theft" (Detective), "sign 'area under surveillance'" (Deterrent), "restoring from backup after ransomware" (Corrective), "firewall ACL blocking inbound telnet — category" (Technical), "guard checking badges — category" (Operational).

- [ ] **Step 4: Write `sp1m2` — "CIA, non-repudiation, AAA y gap analysis" (objective 1.2)**

Cover: **CIA triad** (confidentiality — encryption, access controls; integrity — hashing, digital signatures, version control; availability — redundancy, backups, DDoS protection) with a table "threat → property attacked → control"; **non-repudiation** (digital signatures, audit logs; a sender cannot deny sending); **AAA**: authentication (proving identity: something you know/have/are; people vs *systems* — certificates, 802.1X, API keys), authorization (what you may do), accounting (logging what you did); **authorization models** overview: least privilege, role-based vs attribute-based (short — full IAM lives in Domain 4); **gap analysis**: compare current state vs desired state/framework (e.g. NIST CSF, ISO 27001), output = prioritized remediation roadmap; when it is used (new regulation, after M&A, before audit). Exam callout: "Which property is affected?" questions — modification = integrity, disclosure = confidentiality, outage = availability, "can't deny" = non-repudiation. Checks: hashing protects which property; a signed email provides which two; a gap analysis output. Quiz 7 questions.

- [ ] **Step 5: `npm test`** — content tests for choices/sections pass; Domain 1 count still < 40 (expected until Task 14). `npx tsc --noEmit` clean.

---

### Task 12: Content — sp1m3 (Zero Trust) and sp1m4 (physical security + deception)

**Files:**
- Modify: `src/data/secplus/sp1.ts`

- [ ] **Step 1: Write `sp1m3` — "Zero Trust: control plane y data plane" (objective 1.2)**

Cover: principle "never trust, always verify"; perimeter model vs zero trust; **control plane**: adaptive identity (auth decisions use context: location, device health, behavior), threat scope reduction (limit blast radius: least privilege, micro-segmentation), policy-driven access control, **Policy Engine** (decides), **Policy Administrator** (issues/revokes the session token, tells the PEP), together = **Policy Decision Point (PDP)**; **data plane**: subject/system (user + device requesting), **implicit trust zones** (small zones where traffic is allowed once authorized), **Policy Enforcement Point (PEP)** (gateway that enforces). Table: component → plane → role. Flow diagram as a `code` block (text) showing subject → PEP → PDP (engine+administrator) → resource. Exam callout: engine decides, administrator communicates, enforcement point enforces; PEP is the only data-plane control component. Checks: which component makes the decision; which plane has PEP; what adaptive identity means. Quiz 6 questions.

- [ ] **Step 2: Write `sp1m4` — "Seguridad física y tecnologías de engaño" (objective 1.2)**

Cover physical controls: **bollards** (vehicles), **access control vestibule** (mantrap — one door at a time, anti-tailgating), **fencing**, **video surveillance** (deterrent + detective; motion recognition, object detection), **security guard**, **access badge** (+ tailgating/piggybacking distinction), **lighting**, **sensors**: infrared (heat/body), pressure (weight on floor/mats), microwave (motion via reflected microwaves, larger areas), ultrasonic (sound waves, small rooms). Table: sensor → detects → best for. Deception & disruption: **honeypot** (decoy system), **honeynet** (network of honeypots), **honeyfile** (bait document, e.g. "passwords.xlsx"), **honeytoken** (fake credential/API key/DB record that triggers alerts when used). Exam callout: "detect insider or attacker without risking real assets" → honey*; "which honey* for a database?" → honeytoken record. Checks: vestibule purpose; pressure sensor scenario; honeytoken identification. Quiz 7 questions.

- [ ] **Step 3: `npm test`, `npx tsc --noEmit`.**

---

### Task 13: Content — sp1m5 (change management)

**Files:**
- Modify: `src/data/secplus/sp1.ts`

- [ ] **Step 1: Write `sp1m5` — "Change management: proceso, implicaciones técnicas y documentación" (objective 1.3)**

Cover business processes: **approval process** (CAB — change advisory board), **ownership** (change owner accountable), **stakeholders**, **impact analysis**, **test results** (in staging before prod), **backout plan**, **maintenance window**, **standard operating procedure (SOP)**; technical implications: **allow lists / deny lists** updates, **restricted activities** during window, **downtime**, **service restart**, **application restart**, **dependencies** (changing a cert affects every service pinning it); documentation: **updating diagrams**, **updating policies/procedures**, **version control** (config in repo, rollback = previous tagged version). Include an ordered `list` with the canonical flow: request → impact analysis → approval (CAB) → schedule maintenance window → test + backout plan → implement → verify → document (diagrams, version control). `code` block: a short change ticket example (text). Exam callout: "emergency change" still needs retroactive approval + documentation; "what should be done FIRST/before" questions → impact analysis / backout plan before implementation. Checks ≥3. Quiz 7 questions (e.g. backout plan purpose; why a maintenance window; dependency scenario; SOP; version control benefit; who approves; what to update after firewall rule change → diagrams/allow list documentation).

- [ ] **Step 2: `npm test`, `npx tsc --noEmit`.**

---

### Task 14: Content — sp1m6 (cryptography) and sp1m7 (PKI, certificates, hardware trust)

**Files:**
- Modify: `src/data/secplus/sp1.ts`

- [ ] **Step 1: Write `sp1m6` — "Criptografía: simétrica, asimétrica, hashing, firmas y más" (objective 1.4)**

Cover: **symmetric** (one shared key; fast; AES; problem = key distribution), **asymmetric** (public/private pair; RSA, ECC; slower; enables key exchange + signatures), **key exchange** (Diffie-Hellman, ECDH; hybrid: asymmetric to agree a symmetric session key), **key length** (longer = stronger but slower; ECC needs shorter keys than RSA for equal strength), **encryption levels**: full-disk (BitLocker/FileVault; protects data at rest if device stolen), partition, file, volume, database, record (column/field-level), **transport/communication** (TLS, VPN — data in transit); **hashing** (one-way, fixed length, integrity; SHA-256; collisions; MD5/SHA-1 deprecated), **salting** (random value added before hashing passwords → defeats rainbow tables), **key stretching** (PBKDF2, bcrypt — slow hashing), **digital signatures** (hash of message encrypted with sender's *private* key; verify with public key → integrity + authentication + non-repudiation), **obfuscation**: steganography (hide data in media), tokenization (replace with token; vault maps back; PCI), data masking (partial display: ****1234), **blockchain / open public ledger** (immutable chained hashes, distributed). Table: need → primitive (confidentiality → symmetric; key distribution → asymmetric/DH; integrity → hash; authenticity+non-repudiation → signature; password storage → salted + stretched hash). Exam callout: "encrypt with recipient's PUBLIC key; sign with your PRIVATE key". Checks ≥3. Quiz 8 questions.

- [ ] **Step 2: Write `sp1m7` — "PKI, certificados y raíces de confianza en hardware" (objective 1.4)**

Cover: **PKI** components: **CA** (issues/signs), **RA**, **CSR** (contains public key + identity; sent to CA), **root of trust** / root CA (offline, self-signed) → intermediate CA → leaf; **certificate** fields (subject, issuer, validity, public key, SAN); **wildcard** cert (`*.example.com`; one level only), **self-signed** (no third-party trust; internal/test), **third-party** (public CA), revocation: **CRL** (periodic list, can be stale) vs **OCSP** (real-time query; OCSP stapling), **key escrow** (third party holds copy of private key for recovery/legal), **key management** basics; hardware: **TPM** (chip on motherboard; stores keys, measures boot; BitLocker), **HSM** (dedicated tamper-resistant appliance for CA/enterprise keys; high performance), **KMS** (cloud key management service; centralized lifecycle), **secure enclave** (isolated processor area for keys/biometrics on devices). Table: TPM vs HSM vs KMS vs secure enclave (where, scope, typical use). Exam callout: "browser warning 'issuer unknown'" → self-signed / missing intermediate; "check revocation quickly" → OCSP; "protect CA private keys" → HSM. Checks ≥3. Quiz 8 questions.

- [ ] **Step 3: `npm test`** — Domain 1 test now PASSES (≥40 questions, 7 modules ≥3 checks). `npx tsc --noEmit` clean.

---

### Task 15: Content — Security+ flashcards and glossary

**Files:**
- Modify: `src/data/secplus/flashcards.ts`, `src/data/secplus/glossary.ts`

- [ ] **Step 1: `SP_FLASHCARDS`** — 26 cards, ids `fcp101`–`fcp126`, `sectionId: 'sp1'`, English, same shape as `src/data/flashcards.ts`. Required fronts: 4 control categories; 6 control types; compensating control definition; CIA triad; non-repudiation; AAA; gap analysis; Zero Trust control-plane components; PEP; adaptive identity; access control vestibule; sensor types (IR/pressure/microwave/ultrasonic); honeypot vs honeynet vs honeyfile vs honeytoken; backout plan; maintenance window; impact analysis; symmetric vs asymmetric; hashing; salting; key stretching; digital signature (which key); CRL vs OCSP; CSR; TPM vs HSM; key escrow; wildcard certificate.

- [ ] **Step 2: `SP_GLOSSARY`** — 40 entries, `sectionId: 'sp1'`, English term + Spanish one-line definition, covering every bold term in sp1m1–sp1m7 (categories, types, CIA, non-repudiation, AAA, gap analysis, Zero Trust, policy engine/administrator/PEP, implicit trust zone, bollard, access control vestibule, sensors, honeypot/net/file/token, CAB, backout plan, maintenance window, SOP, impact analysis, version control, symmetric/asymmetric, key exchange, hashing, salting, key stretching, digital signature, steganography, tokenization, data masking, blockchain, PKI, CA, CSR, CRL, OCSP, wildcard, self-signed, key escrow, TPM, HSM, KMS, secure enclave).

- [ ] **Step 3: `npm test`, `npx tsc --noEmit`.**

---

### Task 16: Content — Security+ Domain 1 labs

**Files:**
- Modify: `src/data/secplus/labs.ts`

- [ ] **Step 1: `SP_LABS`**

```ts
export const SP_LABS: LabMeta[] = [
  { id: 'spl1a', sectionId: 'sp1', title: 'Control Matrix', icon: '🧱', minutes: 10, xp: 100, kind: 'classify',
    brief: 'Clasifica 12 controles de la Autoridad Portuaria en su categoría: Technical, Managerial, Operational o Physical. Necesitas ≥80%.',
    mission: { n: 1, briefing: 'La Autoridad Portuaria de Halden te ficha como su primera analista de seguridad. No hay inventario de controles: hay cosas «que se hacen» y nadie sabe por qué. Tu primera tarea es poner orden: clasifica lo que existe para ver qué falta.' } },
  { id: 'spl1b', sectionId: 'sp1', title: 'Change Flow', icon: '🔁', minutes: 8, xp: 75, kind: 'order',
    brief: 'Ordena los 8 pasos de una solicitud de cambio, desde la petición hasta la documentación final.' },
  { id: 'spl1c', sectionId: 'sp1', title: 'Crypto Toolbox', icon: '🔐', minutes: 10, xp: 100, kind: 'classify',
    brief: 'Para cada necesidad, elige la primitiva criptográfica correcta: Symmetric, Asymmetric, Hashing o Digital signature. Necesitas ≥80%.' },
];
```

- [ ] **Step 2: `SP_CLASSIFY_DATA.spl1a`** — categories `technical/managerial/operational/physical`; 12 items with `why`: firewall ACL (technical), annual risk assessment (managerial), guard patrol log (operational), bollards at the gate (physical), disk encryption on laptops (technical), acceptable-use policy (managerial), daily backup execution by ops team (operational), badge reader doors (physical), security awareness *program design* (managerial), IDS sensors (technical), visitor escort procedure performed by staff (operational), fencing around fuel depot (physical). `passPct: 80`.

- [ ] **Step 3: `SP_ORDER_DATA.spl1b`** — prompt + 8 steps with `detail`: Request submitted → Impact analysis → CAB approval → Maintenance window scheduled → Test in staging + backout plan ready → Implement → Verify (service/app restart, monitoring) → Document (diagrams, policies, version control).

- [ ] **Step 4: `SP_CLASSIFY_DATA.spl1c`** — categories `symmetric/asymmetric/hashing/signature`; 12 scenarios: encrypt 2 TB backup at rest fast (symmetric), verify a download wasn't altered (hashing), prove an email came from the CFO and wasn't modified (signature), agree a session key with a server you've never met (asymmetric), store user passwords (hashing), full-disk encryption (symmetric), sign firmware images (signature), TLS handshake key exchange (asymmetric), detect log tampering with chained digests (hashing), non-repudiation of a contract (signature), encrypt a message with the recipient's public key (asymmetric), VPN bulk traffic encryption (symmetric). `passPct: 80`.

- [ ] **Step 5: `npm test` (lab-data test passes), `npx tsc --noEmit`. Browser: play `#/lab/spl1b` to the end and confirm XP toast + completion.**

---

### Task 17: Docs, build and end-to-end verification

**Files:**
- Modify: `README.md`, `CLAUDE.md`, `../PROJECTS.md`, `.claude/settings.local.json` (fix stale paths only if touched)

- [ ] **Step 1: README** — new "Tracks" section (CTI · GCTI and Security+ SY0-701), updated counts (run a quick node one-liner or read the tests), Security+ itinerary, CompTIA disclaimer paragraph next to the SANS one.

- [ ] **Step 2: CLAUDE.md** — update "What this is" (two tracks), layout tree (`data/secplus/`, `tracks.ts`, `course-gcti.ts`), id conventions table, store key still `intelforge-v1` but **persist version 2** with `migrateProgress`, `npm test` (vitest), and the rule "new content goes in `data/secplus/spN.ts`; register modules in `tracks.ts`".

- [ ] **Step 3: PROJECTS.md** — TICourse row: "gamified GCTI + Security+ (SY0-701) study web app".

- [ ] **Step 4: `npm test` → all green; `npm run build` → success (dist/ refreshed).**

- [ ] **Step 5: Browser verification (dev server `intelforge-dev`)** — with GCTI progress present in localStorage (or none): switch to Security+, open Dashboard, `#/section/sp1` lists 7 lessons + 3 labs + boss; complete a checkpoint in `sp1m1` (XP toast); run a Security+ sprint (30 questions) to the end; check history shows the row under Security+ only; switch back to GCTI and confirm its Dashboard numbers are unchanged. Take a screenshot of the Security+ dashboard and section page.

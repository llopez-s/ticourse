# ◆ IntelForge Academy — Preparación GCTI · Security+

Curso web interactivo y gamificado con **dos tracks** de certificación, que
comparten el mismo motor (XP, rachas, flashcards SM-2, bosses, simulacros):

| Track | Certificación | Estado |
|---|---|---|
| **CTI · GCTI** | GIAC GCTI (asociada a SANS FOR578: Cyber Threat Intelligence) | Completo: 27 lecciones, 174 preguntas, 12 labs, 80 flashcards |
| **Security+** | CompTIA Security+ (SY0-701) | **Completo: los 5 dominios** — 41 lecciones + exam prep, 305 preguntas, 132 checkpoints, 15 labs, 152 flashcards, 233 términos |

**▶ En vivo: https://llopez-s.github.io/ticourse/** — se despliega solo en cada
push a `main` (GitHub Actions: tests → build → Pages).

Cambia de track con el selector de la barra lateral. El progreso de lecciones,
quizzes, labs, bosses y cartas es independiente por track; XP, nivel, racha y
misiones diarias son un único perfil compartido.

> **Material no oficial e independiente.** Todo el contenido es original, escrito
> desde cero y mapeado a los temas *públicos* de cada temario. No reproduce
> material de SANS, GIAC ni CompTIA, y no está afiliado a ninguna de ellas.
> FOR578 y GCTI son marcas de sus respectivos propietarios; CompTIA y Security+
> son marcas de CompTIA, Inc.

## 🚀 Arrancar

```bash
npm install
npm run dev      # → http://localhost:5173
```

Producción: `npm run build` (salida estática en `dist/`). Se publica en **GitHub
Pages** desde `.github/workflows/deploy.yml`: cada push a `main` ejecuta los
tests, construye y despliega. El HashRouter evita reglas de reescritura en el
servidor. El build asume la ruta `/ticourse/`; para servir desde la raíz de un
dominio, usa `BASE_PATH=/ npm run build`.

Tu progreso se guarda **en el navegador** (`localStorage`): sin cuentas, sin
servidor, 100% privado. Puedes resetearlo desde *Perfil → Zona de peligro*.

## 📚 Qué incluye

Todo el contenido está en español con la terminología en inglés del examen; las
preguntas de quiz y las flashcards van en inglés, como en el examen real.

| Pieza | CTI · GCTI | Security+ (SY0-701) |
|---|---|---|
| **Lecciones** | 27 | 41 + exam prep |
| **Preguntas de quiz** | 174 | 305 |
| **Checkpoints en lección** | sí | 132 |
| **Labs interactivos** | 12 | 15 |
| **Flashcards (SM-2)** | 80 | 152 |
| **Glosario** | ~95 términos | 233 términos |
| **Boss battles** | 5 | 5 |

- **Labs GCTI**: kill chain mapping, Diamond, Courses of Action, Pivot Hunt
  (grafo de infraestructura), YARA Forge, CMF, caza de sesgos, matriz ACH,
  calibración ICD 203, Report Forge.
- **Labs Security+**: matriz de controles, flujo de cambios, criptografía,
  actores de amenaza, triaje de vectores, mitigaciones, zonas de red, protección
  de datos, escalera de continuidad, caza en logs, respuesta a incidentes,
  triaje de vulnerabilidades, documentos de gobernanza, acuerdos con
  proveedores y cálculo de riesgo (SLE/ALE).
- **Examen de práctica**: cronometrado, sin feedback hasta el final, con
  muestreo por dominio (los pesos **oficiales** 12/22/18/28/20 en Security+),
  desglose de resultados por dominio e historial.

## 🎮 Gamificación

- **Apuestas de confianza** ⭐: cada respuesta se apuesta a confianza
  *Possible / Likely / Almost certain* (+5/0 · +10/−5 · +20/−15 XP). Tu
  precisión por nivel de confianza se registra en el Perfil — es entrenamiento
  directo del **lenguaje estimativo ICD 203**, la habilidad central del examen.
- **XP, niveles y 7 rangos** de analista: Trainee → … → CTI Director.
- **Campaña narrativa "Operación VELVET CICADA"**: eres la primera analista CTI
  de Meridian Dynamics; 5 labs son misiones y cada boss derrotado desbloquea un
  fragmento del dossier del caso.
- **Boss battles**: quiz cronometrado de 12 preguntas al final de cada sección
  (≥80% para vencer) con barra de vida del adversario. Recompensa: +200 XP y un
  *streak freeze*.
- **Racha diaria** con freezes, heatmap de actividad de 28 días.
- **Misiones diarias** rotatorias (3/día + bonus por completarlas todas).
- **26 logros** y medidor de **exam readiness** por sección.
- **Campaña "Operación GLASS HARBOR"** en el track Security+: eres la primera
  analista de seguridad de la Autoridad Portuaria de Halden; 5 misiones y 5
  bosses (NULL CIPHER → RED MARROW → BLIND ARCHITECT → SILENT PAGER → PAPER
  GOVERNOR).

## 🗺️ Itinerario sugerido

**GCTI**
1. Secciones S1→S5 en orden: lecciones → quiz de cada lección → labs → boss.
2. Flashcards **todos los días** (es lo que mantiene la racha y la memoria).
3. S6: estrategia open-book + imprime el glosario como índice.
4. Simulacros de examen hasta superar el **85%** de forma estable
   (el corte real del GCTI ronda el 71% — verifica los datos vigentes en giac.org).

**Security+ (SY0-701)**
1. S1 Conceptos generales (12%): 7 lecciones → quizzes → 3 labs → boss NULL CIPHER.
2. S2 Amenazas, vulnerabilidades y mitigaciones (22%): 8 lecciones → quizzes → 3 labs → boss RED MARROW.
3. S3 Arquitectura de seguridad (18%): 7 lecciones → quizzes → 3 labs → boss BLIND ARCHITECT.
4. S4 Operaciones de seguridad (28%, el dominio más grande): 11 lecciones → quizzes → 3 labs → boss SILENT PAGER.
5. S5 Gestión y supervisión del programa (20%): 8 lecciones → quizzes → 3 labs → boss PAPER GOVERNOR.
6. S6: formato del examen y estrategia con PBQs.
7. Simulacros (sprint 30 preguntas / completo 90 preguntas, pesos oficiales por
   dominio) hasta superar el **83%** de forma estable (≈ 750/900; verifica los
   datos vigentes en comptia.org). El examen es closed-book: el glosario sirve de
   chequeo rápido, no de índice.

## 🧪 Tests

```bash
npm test         # vitest: integridad de contenido, muestreo de examen, migración del store
```

## 🛠️ Stack

Vite 7 · React 19 · TypeScript (strict) · Tailwind CSS 4 · Zustand (persist) ·
react-router 7 (HashRouter). Sin backend.

```
src/
  lib/         motor: tipos, XP/rangos, SRS SM-2, store persistente (v2, con track activo), markdown-lite
  data/        tracks.ts (registro de tracks), course.ts (helpers), course-gcti.ts + s1–s6 (GCTI),
               secplus/ (sections, sp1–sp6 en ficheros spN-partK, cards, glossary, labs por dominio),
               labs, achievements, quests
  components/  Layout (selector de track), Toasts, BlockRenderer, QuizEngine, labs/ (8 motores)
  pages/       Dashboard, Section, Module, Quiz, Lab, Boss, Exam, Cards, Glossary, Achievements, Profile
```

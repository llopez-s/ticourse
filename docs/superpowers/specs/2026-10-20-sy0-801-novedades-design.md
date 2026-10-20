# Novedades del SY0-801 en el curso de Security+ (diseño)

Fecha: 2026-10-20. Estado: **propuesta, pendiente de aprobación de Lidia**. Rama de trabajo: `sy0-801-novedades`.

## Intención y por qué

El curso Security+ de Alertópolis prepara el **SY0-701**. CompTIA publica el **SY0-801** (V8), con lanzamiento previsto
«on or around» el **17 de noviembre de 2026**; el 701 se retira el 11 de junio de 2027 en inglés y el 13 de agosto de 2027
en los demás idiomas. Quien estudie con la app seguirá presentándose al 701, pero puede tener interés en lo que trae el 801.
Lidia lo pidió así: **el curso del 701 no se toca; los temas nuevos se ofrecen además, como material complementario**.

Fuentes (públicas, verificadas el 2026-10-20):
- Página oficial V8: <https://www.comptia.org/en-us/certifications/security/v8/> (pesos, formato, fecha prevista, «coming soon»).
- Objetivos del examen, documento **versión 2.0** (copyright 2025, alojado por CompTIA):
  <https://lecbyo.files.cmp.optimizely.com/download/77f3bd3223ac11f180820e495f189928>. Sigue siendo previo al lanzamiento:
  puede cambiar. Su texto extraído (UTF-8 con pérdidas) se consulta con `pdftotext -layout`.

Datos del 801 (oficiales): máx. 90 preguntas (test y simulaciones), 90 minutos, aprobado 750 sobre 100–900, solo inglés
en la página de lanzamiento. Pesos: 16 % conceptos generales · 24 % amenazas, vulnerabilidades y ataques · 19 % arquitectura ·
27 % operaciones · 14 % gestión y supervisión del programa (el 701: 12/22/18/28/20).

## Metas

1. Una **sección nueva y separada**, `sp7`, «Novedades SY0-801», con 7 lecciones que cubren lo que el 801 añade o recoloca
   y el 701 no enseña (ver «Contenido»).
2. Que una persona que prepara el 701 pueda **ignorar la sección sin consecuencia alguna**: simulacro, examen de nivel,
   jefes, campaña, preparación por dominio y logros del 701 quedan exactamente como están.
3. Un **bloque de IA** propio, el mayor hueco del curso (objetivo 2.6 del 801 y la parte de IA del 4.6).
4. Tarjetas y glosario de los temas nuevos, buscables y repasables, sin desplazar las del 701.
5. Cada lección dice a qué objetivo(s) del 801 corresponde y con qué lección del 701 se enlaza.

## No metas

- No migrar el curso al 801 ni cambiar los pesos, las preguntas, el simulacro (`passPct`, 90 preguntas) ni el texto
  «SY0-701» del resto de la app.
- No añadir preguntas a ningún banco (`quiz` de los módulos, bosses, simulacro, examen de nivel). Las comprobaciones de las
  lecciones nuevas son **opcionales**, sin XP.
- No hay jefe, laboratorio nuevo, vídeos ni examen de nivel de `sp7` en esta primera entrega.
- No tocar identificadores, versión de persistencia ni claves de `localStorage`.

## Antimetas (fracaso aunque «funcione»)

- Que `sp7` entre en `contentSections`, en la preparación por dominio o en el simulacro del 701.
- Que una tarjeta de `sp7` se cuele **antes** que las del 701 en la cola diaria de repaso.
- Presentar el borrador de objetivos como definitivo, o dar a entender que lo que el 801 deja de nombrar
  (virtualización, contenedores, IoT, ICS/SCADA, RTOS, embedded, SDN, attribute-based access control)
  **ya no cae en el 701**: sigue cayendo, y sus lecciones no cambian.
- Afirmar afiliación con CompTIA o copiar texto del documento de objetivos. El material es original y se conserva el aviso
  de no afiliación.

## Restricciones

- **Precedentes del repositorio que se siguen:** `sp6` (sección sin dominio y sin jefe: queda fuera de `contentSections`, del
  examen de nivel y de la campaña) y las ampliaciones prácticas del 2026-10-19 (`docs/practical-curriculum.md`:
  comprobaciones `optional`, bloques «complementarios», tarjetas con etiqueta).
- IDs globalmente únicos: sección `sp7`, lecciones `sp7m1`–`sp7m7`, tarjetas `fcp7NN`, sin colisiones (el test de contenido
  lo comprueba).
- Contenido en español con terminología de examen en inglés; tarjetas en inglés, como el resto.
- Estructura de datos como el resto del curso: `src/data/secplus/sp7*.ts` (aglutinador `sp7.ts`), `sp7-cards.ts`,
  spread en `tracks.ts`, `flashcards.ts` y `glossary.ts` de `secplus/`.
- Pruebas: la suite de 158 pruebas debe seguir pasando; se añade un test de contenido para `sp7`.

## Contenido (qué entra)

La numeración de objetivos es la del documento v2.0 del 801. Cada lección lleva al principio un aviso «Fuera del SY0-701:
novedad del SY0-801» y, al final, enlaces a las lecciones del 701 que complementa.

| Lección | Título | Objetivos del 801 | Temas | Complementa |
|---|---|---|---|---|
| sp7m1 | De 701 a 801: el mapa | todos | pesos y formato; fechas; qué se mueve de dominio (CVSS/CVE al 2.1, gap analysis al 5.5, RTO/RPO/MTTR/MTBF al 3.4, seguridad física a vectores, deception al 4.1); qué se deja de nombrar; cómo estudiar si te presentas al 701 | `sp6m1` |
| sp7m2 | IA: riesgos y ataques | 2.6, 2.4 | model manipulation, poisoning, prompt injection, jailbreaking, evasion, hallucinations, bias, explainability, privacy y data loss, session hijacking, code execution, ethical considerations; LLM como superficie de ataque | `sp2m5`, `sp2m6` |
| sp7m3 | IA en las operaciones | 4.6 | automatización y scripting, guardrails, automation logic; IA agentic, chatbot, predictive analysis, baselines aumentados con IA; resultados esperados; CI/CD y flujos | `sp4m9` |
| sp7m4 | Vectores e indicadores nuevos | 2.3, 2.5, 5.6 | quishing (QR), deepfake, RCS y herramientas de colaboración, living-off-the-land, extensiones y session tokens del navegador, señales (Bluetooth, RF, NFC), impossible travel, log manipulation, BEC | `sp2m1`–`sp2m4`, `sp2m7` |
| sp7m5 | Código, repositorios y credenciales | 2.4, 4.1, 4.5, 3.2 | hardcoded secrets, unsafe exception handling, malicious update, TOC/TOU, repositorios y almacenamiento públicos, secrets scanning; passkeys y passwordless, cuentas de emergencia, gMSA, privilege creep, vigilancia de credenciales comprometidas | `sp2m5`, `sp4m8`, `sp3m1` |
| sp7m6 | Arquitectura y datos | 3.2, 3.3, 3.4 | Zero Trust como arquitectura (autenticación, gestión de dispositivos, acceso a aplicaciones), security service edge, E2E encrypted messaging, out-of-band management; roles de datos (owner, custodian, steward, operator, controller, subprocessor), ciclo de vida, deidentification y data transpose, cumplimiento por tipo de dato; autoscaling, immutability, restoration testing, capacity planning | `sp1m3`, `sp3m4`–`sp3m7` |
| sp7m7 | Operaciones y gobierno | 1.2, 4.3, 4.7, 5.5, 5.6 | fail forward y CAB; CSPM, IPAM, revisión de código fuente, bounty y responsible disclosure; fase de negociación y notificación externa en respuesta a incidentes; MITRE ATT&CK, Cyber Kill Chain y Diamond Model como fuentes de una auditoría; formación dirigida y puntuación de riesgo por comportamiento | `sp1m5`, `sp4m10`, `sp5m7` |

Alrededor de **2,5 horas** de lectura y práctica opcional en total. Orden pensado para estudiar de corrido o por separado.

Cada lección lleva: 4–8 objetivos de aprendizaje; texto, tablas y ejemplos con el puerto de Halden o casos ficticios (sin
hechos nuevos del canon); entre 3 y 6 comprobaciones **opcionales**; y una tarea breve. **sp7m2 y sp7m3 llevan además un
ejemplo guiado** (qué intenta hacer un atacante contra un asistente interno de la Autoridad Portuaria y por qué falla la defensa
ingenua), con datos inventados y nada ejecutable.

Aparte de las lecciones:
- **~40 tarjetas** `fcp701`… (`sectionId: 'sp7'`) y **~50 términos** de glosario, en inglés / español como el resto.
- Texto de `TRACKS.secplus.tagline` y de `disclaimer`: añadir una frase («incluye una sección opcional con novedades del
  SY0-801») conservando la no afiliación.
- `README.md` y `CLAUDE.md`: cifras nuevas y la regla «sp7 es opcional y está fuera de todo cálculo del 701».

## Decisiones ya tomadas (de Lidia)

- Se prepara el 701; las novedades del 801 son un complemento interesante, no el objetivo.
- Se puede hacer un bloque nuevo de IA.
- «Adelante con todas esas decisiones»: sección complementaria, mecanismo de las ampliaciones prácticas, sin cambiar pesos ni
  simulacro, sin vídeos por ahora.

## Mis decisiones (a revisar)

1. **Sección aparte** (`sp7`) en lugar de bloques sueltos en las lecciones del 701: aísla por construcción de los cálculos del 701 y
   permite una lección entera de IA. Los temas que sí enriquecen una lección concreta se enlazan desde ella con un
   aviso, sin editarla.
2. **Siete lecciones**, incluida una de mapa al principio.
3. **Sin preguntas de examen**: el banco del 701 no se contamina y nadie practica con preguntas de un examen aún sin publicar.
4. Las tarjetas nuevas van **al final** de la lista, así que `buildQueue` las entrega solo cuando se agotan las del 701.
5. **El botón «Continuar» del panel nunca apunta a `sp7`.** `nextModule` ignora la sección `sp7` (una constante
   `OPTIONAL_SECTIONS = ['sp7']` en `course.ts`; `sp6` sigue contando), para que nadie del 701 sea empujado a ella. Se llega a
   `sp7` por su propia tarjeta.
6. **Dónde vive en la interfaz:** una tarjeta propia al final del panel de Security+, debajo de la cuadrícula de secciones, con
   el título «Novedades del SY0-801 · opcional», una línea de contexto y un botón «Empezar» (o «Continuar», si ya empezó). En la
   barra lateral, un grupo «Opcional» detrás de `sp6`. No sale en las tarjetas de dominio ni en la preparación por dominio.
7. **XP, rachas, misiones y logros: comportamiento normal, sin tocar la tienda.** Leer una lección de `sp7` es estudiar de
   verdad y suma como cualquier lección (`XP.lesson`, contador diario, rachas, misiones, logros de «primera lección» y de
   «estudioso»). Lo que `sp7` no puede hacer es entrar en el simulacro, el examen de nivel, los jefes, la campaña ni la preparación
   por dominio. «Ignorar la sección sin consecuencia» significa eso, no que no dé recompensa.
8. **Fuente de los objetivos para quien escribe y revisa:** el texto extraído del documento v2.0 se deja en un fichero local
   fuera de git (`node_modules/.cache/sy0-801/objetivos-v2.0.txt`, regenerable con `pdftotext -layout`), nunca copiado al
   repositorio (el material es original). Los subagentes de contenido y el revisor de exactitud reciben esa ruta. Un tema que no
   se pueda comprobar contra él se omite o se marca como «según el borrador de objetivos»; el revisor de exactitud (de solo
   lectura) lo verifica contra ese texto y contra las lecciones del 701.
9. **El test de cobertura mira temas, no números:** una lista por lección de palabras clave (los términos de examen en inglés
   que ya se mantienen tal cual: `quishing`, `gMSA`, `TOC/TOU`, `prompt injection`…) que deben aparecer en el texto de esa
   lección; vive en el propio fichero de test.
10. **Revisión posterior al lanzamiento:** el documento de objetivos aún es previo. Tras el 17-11-2026 se contrasta con la versión
   final y se corrige la sección (tarea de seguimiento, fuera de esta entrega).

## Cómo se hace (el recetario del repositorio)

Rama `sy0-801-novedades` → andamiaje (`sp7` en `sections.ts`, módulos vacíos, test de completitud) → un subagente de
contenido por lección (`sp7m1`–`sp7m7`) → tarjetas y glosario → **revisor de exactitud** de solo lectura contra el documento de
objetivos y el resto del curso (nada contradice las lecciones del 701; nada afirma que lo que el 801 omite «ya no cae») →
pruebas + build + comprobación en la app → PR (no se fusiona sin pedirlo Lidia).

## Criterios de aceptación

- `sp7` aparece en la barra lateral (grupo «Opcional») y en el panel como una tarjeta propia (decisión 6), con el aviso «Fuera
  del SY0-701»; el botón «Continuar» del panel no lleva nunca a `sp7` (decisión 5).
- `contentSections('secplus')` sigue devolviendo 5 secciones; el simulacro, el examen de nivel (12 preguntas por sección),
  los jefes y la campaña no cambian; la preparación por dominio no incluye `sp7`.
- Ninguna lección de `sp7` tiene `quiz` ni comprobaciones obligatorias; leerlas da el XP y el progreso normales de una lección
  (decisión 7), sin cambios en la tienda, la migración ni la sincronización.
- Los temas de la columna «Temas» de cada lección aparecen en su texto (test de cobertura por palabras clave, decisión 9).
- `npm test` y `npm run build` pasan; búsqueda, glosario y tarjetas encuentran los términos nuevos.
- Ninguna frase presenta como definitivos los objetivos previos al lanzamiento.

## Qué se deja al constructor

Redacción exacta de cada lección, número y texto de comprobaciones, qué ejemplos usar, forma visual del aviso «Fuera del
SY0-701», nombres de ficheros, detalle de las pruebas y orden interno de las lecciones.

# Vídeos de casos y preguntas de examen para Security+ (tandas 6 a 10)

> Diseño del 2026-10-16. Lo pidió Lidia: «que todos los temas tengan vídeo, ya que todo es importante; que sean
> útiles para el aprendizaje y fáciles de entender, que les quede muy claro el contenido para el examen», trabajando
> «posibles preguntas del examen y los conceptos con casos prácticos, casos de uso». Lo que dice *(decisión de
> Claude)* lo decidió Claude porque Lidia se lo delegó («decide tú»); todo lo demás lo dijo ella.

## 1. Por qué

El plan de vídeos (`docs/superpowers/plans/2026-09-25-lesson-videos.md`) termina en V27. Con V24, Security+ tendrá
vídeo en 17 de sus 42 lecciones. Las 25 restantes se dejaron fuera del ranking (§3, «Descartados») porque son
clasificaciones y listas, que se aprenden mejor con tablas, flashcards y labs `classify`. Lidia quiere que **todas**
tengan vídeo. El reto es que un vídeo que lee una lista no enseña nada. Por eso estos vídeos se construyen sobre
**casos prácticos y preguntas tipo examen**: el alumno ve un problema real, entiende el concepto al resolverlo y
practica cómo se lo van a preguntar.

## 2. Qué lecciones

25 lecciones, todas de Security+ (`src/data/secplus/`):

| Dominio (peso) | Lecciones |
|---|---|
| D1 (12 %) | sp1m1 categorías y tipos de controles · sp1m2 CIA, non-repudiation, AAA, gap analysis · sp1m4 seguridad física y engaño · sp1m5 change management |
| D2 (22 %) | sp2m1 actores y motivaciones · sp2m2 vectores y superficie de ataque · sp2m3 ingeniería social · sp2m5 nota de examen: shared responsibility · sp2m6 malware e indicadores · sp2m8 mitigación y hardening |
| D3 (18 %) | sp3m1 cloud, IaC, serverless, microservicios · sp3m2 red, virtualización y contenedores · sp3m3 IoT, ICS/SCADA, RTOS, embedded · sp3m6 protección de datos |
| D4 (28 %) | sp4m1 baselines y hardening · sp4m3 gestión de activos · sp4m4 vulnerabilidades I: identificación · sp4m9 automatización y orquestación |
| D5 (20 %) | sp5m1 políticas, estándares, procedimientos, guidelines · sp5m2 estructuras de gobernanza y roles sobre los datos · sp5m5 riesgo de terceros · sp5m6 cumplimiento y privacidad · sp5m7 auditorías y pentest · sp5m8 concienciación |
| Examen | sp6m1 el examen Security+: formato y estrategia |

**Fuera de este diseño:** GCTI (si se hace, irá en un diseño aparte y más adelante); rehacer el SIEM (sp4m6) o V2
(sp4m11), que ya tienen vídeo aunque sea del formato antiguo; y V24 y V27, que siguen su ficha.

## 3. Objetivos, no objetivos y lo que lo haría fracasar

**Objetivos**
- Cada lección de la tabla tiene un vídeo publicado en el canal Alertópolis y enlazado en la lección (bloque `youtube`).
- Después de ver el vídeo, el alumno sabe **distinguir los conceptos que el examen confunde** y ha practicado ya con
  preguntas de ese tipo.
- Se entiende a la primera: primero el problema, luego la idea y al final el nombre.

**No objetivos**
- Cubrir toda la lección. La lista completa sigue en sus tablas, flashcards y labs. El vídeo elige los 2 o 3
  conceptos que más se confunden en el examen (o 4–6 en los principales).
- Ampliar el canon de Halden. Los casos ocurren en Halden, pero no hacen avanzar la historia.

**Lo que lo haría fracasar aunque «funcione»**
- Leer una lista en voz alta o enseñar una tabla y narrarla.
- Una pregunta con dos respuestas defendibles, o cuya respuesta «correcta» contradiga a CompTIA.
- Copiar preguntas del banco de la lección: destripa el quiz.
- Un caso que solo se entiende si has visto otros vídeos de Halden.
- Preguntas enteras en inglés (decisión de Lidia: en español, con las palabras clave en inglés).

## 4. El formato: «caso y examen»

### 4.1 Estructura de cada vídeo

1. **El caso.** En el puerto pasa algo y alguien tiene que decidir: el puerto contrata un pentest, aparece un USB en
   el aparcamiento, Compras quiere un proveedor nuevo en la nube… El alumno ve el problema antes que el nombre del
   concepto.
2. **El concepto sale del caso.** Cuando el equipo decide, se nombra lo que acaba de hacer: «esto que has visto es un
   *compensating control*». Primero la idea y después su nombre, como manda la «narración hablada» (plan §1).
3. **Preguntas tipo examen** (ver 4.3), repartidas por el vídeo justo después del concepto que ponen a prueba, no
   todas al final *(decisión de Claude)*.
4. **Cierre:** la frase que hay que llevarse al examen y una invitación a hacer el quiz de la lección.

En las lecciones que son listas de cosas parecidas (actores, malware, tipos de controles, roles sobre los datos…), el
vídeo puede llevar **dos o tres casos cortos** en vez de uno largo, para poner los conceptos lado a lado.

### 4.2 Dos tamaños *(decisión de Claude)*

| | Cápsula de casos | Principal de casos |
|---|---|---|
| Duración renderizada | 240–330 s (4–5,5 min) | 420–600 s (7–10 min) |
| Conceptos clave | 2–3 | 4–6 |
| Preguntas tipo examen | 3 | 4–5 |
| Exam cards | 3–5 | 5–8 |
| Mensajes interceptados | 0–1 (opcional) | 0–2 (opcional) |
| Lecciones | el resto | sp2m3, sp2m6, sp5m7, sp6m1 |

La cápsula dura algo más que `capsula-yt` (190–260 s) porque cada pregunta ocupa unos 25–35 s: leerla, dejar tiempo y
resolverla. Las preguntas sustituyen a los *think prompts*: estos vídeos no llevan ninguno.

Los mensajes interceptados dejan de ser obligatorios: estos vídeos se centran en entender, y el adversario solo
aparece si el caso lo pide (por ejemplo, ingeniería social).

### 4.3 Las preguntas tipo examen

- **Idioma** (decisión de Lidia): en español, con los conceptos clave y las palabras del examen en inglés, como en las
  lecciones: «¿Qué tipo de control es la cámara de la verja? A) *Preventive*…».
- **Forma:** como en SY0-701. Un escenario corto, una pregunta y cuatro opciones (A–D), y a menudo con los calificadores
  del examen: «la MEJOR opción», «lo PRIMERO que debe hacer», «lo MÁS probable». En la voz y en la tarjeta se explica
  qué cambia cada calificador la primera vez que sale.
- **Siempre nuevas:** no se copian ni se parafrasean del banco de preguntas de la lección (`Question[]` de `spN-partK.ts`)
  ni de la colocación (`secplus/placement.ts`). El revisor lo comprueba.
- **Cada pregunta ataca una confusión concreta** del examen, y una de las opciones incorrectas es **la trampa**: la que
  elegiría alguien que confunde esos dos conceptos.
- **Cómo se resuelve:** la voz lee el escenario y la pregunta, pero no las cuatro opciones *(decisión de Claude: leerlas
  dobla el tiempo; se ven en pantalla y van en los subtítulos)*. Después dice «pausa si quieres» y deja 5 s de cuenta
  atrás. Luego se resuelve: se marca la correcta y por qué lo es, y se marca la trampa con una frase que explica por qué
  tienta y por qué falla. Las otras dos opciones se apagan sin comentario, salvo que haga falta.
- **No se añaden al quiz de la app** *(decisión de Claude)*: viven en el vídeo. Si algún día se quieren en la app, es un
  cambio aparte.

### 4.4 Los casos

- **En Halden, pero independientes.** Cada caso se entiende solo. Se prefieren roles a personas («la responsable de
  Compras», «el técnico de guardia») y no se ponen fechas, horas ni nombres de equipo salvo que el caso los necesite.
- Todo lo que salga en pantalla y ya exista en Halden (personas, equipos, dominios, fechas) se comprueba contra el
  registro de canon `docs/superpowers/canon/glass-harbor.md` con `canon-check.mjs`, como siempre (plan §8). Lo poco
  nuevo que fije cada vídeo se añade al registro.
- **Realistas y del día a día de un puerto:** turnos, proveedores, grúas, oficinas, sistemas de control (ICS/SCADA en
  sp3m3), Compras, Legal y RR. HH.

### 4.5 Lo que no cambia

Todo lo demás sigue el método actual del plan de vídeos: reglas de «narración hablada» (§1), `wordBudget` a 2,7
palabras/s, revisor de exactitud y revisor de naturalidad (solo lectura), orden de trabajo del §8 (canon → guion →
congelar → hojas de grabación → Lidia graba → importar, `verify-voice`, master, render → subida privada → Lidia publica
→ bloque `youtube` en la lección + `content.test.ts` + registro de canon → PR → Lidia fusiona), voz de Lidia, música
de biblioteca, títulos de escena que no destripan la respuesta, descargo «no afiliado a CompTIA» y perfil de pista
`secplus`.

## 5. Cambios en el motor (`video/engine/`)

- **Dos perfiles nuevos** en `scripts/lib/profiles.mjs`, `caso-yt` y `caso-principal-yt`, con los números de 4.2.
  `thinkPrompts: 0`, `intercepts` desde 0 y un nuevo `examQuestions`. El validador comprueba su número, que cada una
  tenga cuatro opciones, una correcta, una trampa marcada y una explicación de cada, y que la voz no las deletree.
- **Un componente nuevo de pregunta tipo examen** (capa en `src/overlay/` o escena en `src/ui/`, a criterio de quien
  lo construya). Debe mostrar el escenario y la pregunta, las cuatro opciones, la cuenta atrás (se puede reutilizar el
  anillo de `ThinkPrompt.tsx`) con «pausa si quieres», la revelación de la correcta, la trampa marcada y su frase, y
  la plaquita del objetivo («SY0-701 · 1.1»). Tiene que leerse bien en un móvil.
- **El texto de las preguntas en `narration.json`**, junto a la escena, para que los dos revisores lo vean con el guion.
- **Los subtítulos (VTT)** incluyen las cuatro opciones como texto en el momento en que aparecen, para quien no ve la
  pantalla.

## 6. Orden y tandas *(decisión de Claude)*

Primero, **un piloto**: **sp1m1** (categorías y tipos de controles). Es la confusión de examen más clásica, la primera
lección que ve el alumno y una lista pura: si el formato funciona ahí, funciona en las demás. Lidia lo ve terminado y
dice qué cambiar antes de abrir la tanda 6.

Después, tandas por peso del dominio en el examen, cada una con su ficha por vídeo (como las tandas 3–5):

| Tanda | Dominio | Vídeos |
|---|---|---|
| 6 | D4 (28 %) | sp4m4, sp4m1, sp4m9, sp4m3 |
| 7 | D2 (22 %) | sp2m6 (principal), sp2m3 (principal), sp2m1, sp2m2, sp2m8, sp2m5 |
| 8 | D5 (20 %) | sp5m7 (principal), sp5m1, sp5m2, sp5m5, sp5m6, sp5m8 |
| 9 | D3 (18 %) | sp3m1, sp3m2, sp3m3, sp3m6 |
| 10 | D1 (12 %) + cierre | sp1m2, sp1m4, sp1m5, sp6m1 (principal) |

Numeración: siguen a V27 (piloto = V28, y así), en el orden en que se aprueben las fichas. sp2m5 es una nota corta
sobre shared responsibility: su vídeo es una cápsula en el extremo corto del perfil.

Dentro de cada tanda se graba como hasta ahora (un principal con una cápsula por sesión cuando los haya) y se va de un
PR en uno.

## 7. Límites que hay que respetar

- **Lidia graba todas las voces.** 25 vídeos son unos 2 h de audio final. El ritmo lo marca ella, no la tubería.
- **YouTube:** el token de la API dura 7 días (el actual muere el 2026-10-20 a las 09:27Z; Lidia renueva con `--auth`).
  Las subidas van en privado y las publica ella.
- **Máquina:** los worktrees están en exFAT y no tienen `node_modules`. Importar, mezclar, renderizar y subir se hace
  desde el repo de trabajo NTFS o desde el checkout principal. `render.mjs --master` se queda sin memoria: se hace en
  dos etapas.
- **Fusionar a `main` publica la web:** se abre el PR y se pregunta, de uno en uno.
- Hay que respetar los descargos y el canon publicado.

## 8. Qué se deja a quien lo construya

- Las fichas de cada vídeo: casos, escenas, preguntas, exam cards y título, siguiendo este diseño y aprobadas por Lidia
  antes de escribir el guion.
- El diseño visual del componente de pregunta, dentro del lenguaje del motor (`src/theme/`, `ui/CATALOG.md`).
- Los detalles del validador y de los perfiles, si se respetan los números de 4.2.
- Qué conceptos elige cada vídeo, con un criterio: los que más se confunden en el examen y los que más preguntas tienen
  en el banco de la lección.

## 9. Decisiones tras la revisión del diseño *(todas de Claude)*

1. **Qué es «el piloto terminado».** Lidia ve el piloto dos veces. Primero, la ficha y el guion congelado, antes de
   grabar, porque cambiar el formato después de que ella grabe cuesta horas suyas. Después, el render final con su
   voz, subido **en privado**. El formato puede cambiar hasta que lo apruebe en privado: hasta entonces no se publica
   ni se enlaza en la lección. Mientras tanto se pueden escribir las fichas de la tanda 6, pero no se congela ningún
   guion hasta que ella dé por bueno el piloto.
2. **Orden respecto a V24 y V27.** V24 y V27 van primero: tienen el guion congelado y son lo siguiente que graba Lidia.
   **El trabajo de motor** (perfiles `caso-yt` y `caso-principal-yt`, validador, componente de pregunta, opciones en
   el VTT) va en **su propio PR**, con sus tests y una composición de prueba en `src/dev/`. Puede hacerse a la vez
   que V24 y V27, porque no toca sus perfiles. El piloto se graba después de V27, en la misma sesión si a Lidia le
   viene bien. Los números (V28…) se asignan cuando se aprueba cada ficha.
3. **Qué decide «la respuesta de CompTIA».** Manda la lista oficial de objetivos de SY0-701 y, después, el texto de la
   lección. No se pregunta lo que CompTIA deja abierto: si un concepto tiene dos respuestas razonables (una cámara es
   a la vez *detective* y *deterrent*), la pregunta se reescribe para que el escenario decida, o se descarta. Si el
   revisor encuentra que la lección, su quiz o sus flashcards contradicen a CompTIA, se corrige en **el mismo PR del
   vídeo**, como hizo V10 con su lección, y se avisa en la descripción del PR.
4. **Qué cuenta como «el banco» para no copiar.** Las preguntas del quiz (`Question[]`), los *checkpoints* en línea
   de la lección y la colocación (`secplus/placement.ts`). Los labs y las flashcards no, porque tienen otra forma; aun
   así, una pregunta del vídeo no puede ser una flashcard con opciones.
5. **sp6m1 es la excepción.** No tiene caso de Halden. Su «caso» es el alumno delante del examen: cómo leer el
   escenario, los calificadores (MEJOR, PRIMERO, MÁS probable), cómo descartar opciones y cómo encarar las preguntas
   prácticas (*performance-based questions*). Sus 4–5 preguntas son de dominios distintos y sirven para practicar esa
   estrategia, no para enseñar contenido nuevo. Usa el perfil `caso-principal-yt` sin excepciones en el validador.

## 10. Cómo sabremos que funciona

- El piloto: Lidia lo ve y dice si se entiende y si las preguntas se parecen a las del examen.
- Cada pregunta pasa el revisor de exactitud (una sola respuesta defendible según CompTIA, trampa real, que no esté
  copiada del banco).
- Cada lección de la tabla del §2 tiene su bloque `youtube`, y `content.test.ts` lo fija.

### G10 · s5m5 · Cápsula · «Métricas, feedback y madurez: cómo demuestra su valor un equipo CTI»

> Borrador del 2026-10-24, con las opciones recomendadas ya elegidas; pendiente de revisión de exactitud y de naturalidad y de
> que Lidia diga qué cambia. **No está congelado** (`video.json` sin `"frozen"`). Rama `video-feedback-madurez`, desde
> `origin/main`. La versión vigente de escenas y guion es `video/feedback-madurez/storyboard.json` + `narration.json`; qué se
> quedó fuera, en `video/feedback-madurez/out/script-notes.md` (ignorado por git).
>
> **Por qué esta lección.** La pidió Lidia el 2026-10-24 junto con s3m4 (G08) y s4m2 (G09): ninguna tanda cubre de verdad s5m5.
> Las que la rozan no la cuentan. G03 `ciclo-pir` dice que sin feedback «ni te enteras» (`video/ciclo-pir/narration.json`, s04-04
> a s04-06), pero no enseña cómo se pregunta ni qué se apunta. AP07 `stealers-metricas` (s4m4 + s5m5) habla de las métricas **del
> fenómeno** (qué columna ordena qué) y solo en una escena (s09) separa las del equipo («conectar el trabajo con sus
> consumidores y sus decisiones», s09-04) sin explicarlas. G05 y G06 son de s5m1 a s5m4. Este vídeo es sobre **el equipo CTI**,
> no sobre infostealers ni sobre el ciclo en abstracto.

- **Carpeta:** `feedback-madurez` · perfil `capsula-yt` (190-260 s renderizados; estimado 4:18 con 2,5 palabras/s, que con la
  lectura de Lidia al 85-93 % queda en ~3:40-4:00) · objetivo GCTI **Dissemination** (dominio del curso de S5,
  `src/data/course-gcti.ts:89`, y de las seis preguntas de s5m5, `src/data/s5.ts:1161-1248`); las cuatro tarjetas llevan
  `"objective": "Dissemination"` e insignia «GCTI» (`examBadge`) · adversario **VELVET CICADA** (el de la sección,
  `src/data/course-gcti.ts:93`), dos mensajes interceptados · voz `recording/lidia` · **voz del adversario ya existente:**
  `"adversaryVoice": { "voice": "sapi/Microsoft Pablo", "rate": 0, "fx": "machine" }`, la de V27, G05, G06 y G07 · música
  `Go On Going - Stayloose.mp3`. No hace falta voz ni efecto nuevos.
- **Se aparta de G02 en una cosa:** `recording` lleva solo `"maxPauseMs": 250`, sin `"tempo": 1.08`. La memoria de Lidia del
  2026-10-24 («no acelerar su voz: importar a tempo 1») y el CLAUDE.md del repo (ausente = tempo 1) mandan. Los guiones G01-G07
  congelados siguen con 1,08: es decisión de quien los vaya a importar.
- **`video.json`:** `"profile": "capsula-yt"`, `"track": "gcti"`, `"adversary": "VELVET CICADA"`, `"lesson": "s5m5"`, música,
  `"examBadge": "GCTI"`, `"youtubeTitle": "Métricas, feedback y madurez de un equipo CTI"` (YouTube lo completa con «| GIAC GCTI en
  español»), 12 `"tags"`. Sin `"frozen"`. El descargo «Simulación educativa… no afiliado a SANS/GIAC» va en `notice` del
  storyboard y en la tarjeta final (`endcard`), como en G02.
- **Ritmo:** `"examTiming": "sentence-end"`; pregunta con `think.holdMs` 4000; tarjetas con `holdSec` 4; mensajes con `intercept.holdMs` 3000. Un mensaje
  por capítulo (s02 en el capítulo 1, s04 en el 2), ninguno en la escena final; la pregunta para pensar (s05) no comparte
  segmento con ningún mensaje.
- **Efectos (`sfx`, 5 ids únicos, todos con sonidos que existen en `video/engine/sfx/`):** `ask` («mail», llega la pregunta del
  CISO, s01), `km` («typing», sube el contador de kilómetros, s02), `win` («check», el éxito atribuible se resuelve, s03),
  `stages` («ding», aparece la barra de estadios, s04) y `fleet` («error», la flota sin líneas, s05).
- **Léxico** (`lexicon.json` y `lexicon.chatterbox.json`, iguales): solo `CISO` («císo», como G01-G03). `TIP` va marcado en el texto de la voz como `[TIP|tip]`
  (el validador avisaba de una entrada de léxico sin uso fuera del marcado); la hoja de grabación **no** muestra pista «lee:» porque
  «TIP» y «tip» solo se distinguen en mayúsculas. «feedback» y «requirements» no llevan entrada: G03 tampoco las tiene (su léxico
  es `CISO`, `PIR`, `F3EAD`, `EMBER`, `FOX`), así que no hay pronunciación de G03 que copiar. Las dudas van en «Preguntas para Lidia».
- **Duración:** `targetSec` 19, 55, 48, 52, 52 y 26 = **252 s**; `wordBudget` a 2,7 palabras/s: 51, 149, 130, 140, 140 y 70 (679).
  El guion tiene **573 palabras**, 29 segmentos, ninguna frase de más de 20 palabras. Estimado de `build-timeline --estimate --check`:
  4:18 (258,6 s; incluye los dos mensajes, la pregunta y las pausas). Dentro de 190-260, pero **con poco margen**: se quitaron
  `wrap` (s03) y `map` (s04) tras la revisión, que ya eran lo primero que se recortaba. Si hay que recortar más: la fila de
  «tiempo de espera» de s02 (pasa a pantalla sin voz) y la segunda frase de s04-06.
- **Inserción en la lección** (`src/data/s5.ts`, s5m5): **después de la lista de madurez** (`:1123-1129`) y **antes del primer
  check** (`:1130`), como bloque `{ t: 'video', title: 'Métricas, feedback y madurez de un equipo CTI', youtube: '<id>', poster:
  'videos/feedback-madurez-poster.png', transcript: 'videos/feedback-madurez-transcript.txt' }`. Motivo: el vídeo resume los
  tres bloques de texto que acaban de leerse y deja los dos checks (`:1130-1159`) como práctica. **Alternativa** (decide Lidia):
  último bloque, tras el check 2 y antes del `quiz` (`:1160-1161`), como V22; descartada porque los checks ya habrían
  contestado lo que el vídeo explica. Se fija en la suite `lesson videos` de `src/data/content.test.ts` con
  `youtubeVideos.find(... '<id>')?.module → 's5m5'` cuando exista el id (no se toca aquí).
- **Lo que se lee no se deletrea:** no hay dominios, equipos, IP, hashes ni ficheros en el guion. `TIP` es la única sigla nueva;
  `CMF`, `PIR` e `IOC` no se dicen (la voz dice «indicadores» y «mapa de qué fuente responde cada pregunta»). La voz **nunca**
  dice VELVET CICADA ni GLASS VIPER: el nombre solo sale en la firma del mensaje.

#### Historia e imagen

**Historia.** Eres la analista de Meridian (el rótulo de siempre: «Meridian Dynamics · aeroespacial · tú, su analista de
inteligencia», sin fecha ni hora). El CISO te pregunta si el equipo de inteligencia sirve de algo. Tienes números de sobra, pero
**contar no es demostrar**. Eso es el vídeo: qué contar, a quién preguntar y cómo se reconoce un equipo maduro. VELVET CICADA
empuja los dos atajos de siempre en este tema, medir lo fácil: contar indicadores y medir la madurez por lo que se gasta.

**Imagen conductora, una sola: una línea de autobús.** Mucho recorrido con el autobús vacío (indicadores procesados) frente a
la gente que llega adonde iba (decisiones mejor tomadas, amenazas encontradas); el viajero que se baja y a quien se pregunta
(feedback); el tiempo de espera en la parada (tiempo de requisito a respuesta); tres etapas de un servicio (de improvisar a una
red integrada en la ciudad) y la **flota sin líneas** (comprar la plataforma antes que el proceso). **Regla de la imagen:**
una línea, un autobús, sin marcas, sin número de línea, sin ciudad real. El plano de barrios es el de un mapa genérico. Libre
en el curso (comprobado en todas las `narration.json`, `storyboard.json` y `src/data`: solo «pasajeros» en los vídeos del
puerto de Halden, que es otra campaña). **No es** el capitán sin GPS (G01), el club de fútbol (G02), el restaurante (G03), la
báscula (G04), la tormenta (G05), el expediente y el perchero (G06), las páginas de índice (G07), el aeropuerto (V27), la casa
de G02 ni la cocina de V9. Los estadios no se dicen «escalera» ni «peldaños».

**Qué no falsea la imagen:** el autobús vacío es la métrica de actividad (la lección: «optimizar IOCs procesados produce
equipos que procesan IOCs», `src/data/s5.ts:1107`); el viajero que llega es el resultado sobre decisiones y detección
(`:1107`); el tiempo de espera es el tiempo de requisito a respuesta (`:1116`, q6 `:1234-1246`); el plano de qué línea cubre qué
barrio es el CMF (fuentes frente a preguntas, `src/data/s3.ts:22,44`); la flota sin líneas es el almacén de indicadores sin
consumidores del check 2 (`:1151`). Donde la imagen **se queda corta:** un autobús no «atribuye» un éxito a un informe; para
eso el vídeo usa un cuaderno con un ejemplo, no el autobús (s03).

#### Conceptos (3) y tarjetas

Se eligen los **tres**, con reparto desigual, porque son exactamente los tres objetivos de la lección (`src/data/s5.ts:1099-1103`),
cada uno con sus dos preguntas (q1 y q6 las métricas, q2 y q4 el feedback, q3 y q5 la madurez) y cabe en una cápsula si ninguno
recorre su lista entera.

| # | Concepto | Peso | Imagen que se mantiene | Tarjeta |
|---|---|---|---|---|
| 1 | **Medir resultados, no volumen** (`:1107`, tabla `:1110-1118`, check 1 `:1130-1144`, q1 `:1163`, q6 `:1234`). Optimizar «indicadores procesados» produce equipos que procesan indicadores; las métricas sanas miden resultados sobre decisiones y detección. En voz: búsquedas de amenazas nacidas de un informe que encontraron actividad real, requirements respondidos, tiempo de requisito a respuesta | s02, 52 s | Kilómetros que recorre el autobús frente a gente que llega adonde iba | «Mide resultados (decisiones, detección), no volumen» (51) |
| 2 | **Feedback como fase, con sus cuatro preguntas y el éxito atribuible** (`:1121`, q2 `:1177`, q4 `:1205`). ¿Respondió tu pregunta? ¿Llegó a tiempo? ¿Qué decisión apoyó? ¿Qué falta? Y se registra «el hunt nació del informe X y encontró Y», la frase que financia equipos. Con ello se ajustan requirements y productos cada vuelta | s03, 47 s | El viajero que se baja del autobús y a quien se pregunta | «Pregunta tras cada producto y apunta éxitos atribuibles» (55) |
| 3 | **Madurez y la trampa de la plataforma** (`:1126-1127`, check 2 `:1145-1159`, q3 `:1191`, q5 `:1220`). Tres estadios (reactivo, en desarrollo, maduro); la madurez es integración y resultados, no gasto ni plantilla; la trampa del 1 al 2 es comprar plataforma antes que proceso, y el orden sano es consumidores y requirements, productos y proceso, herramienta | s04 + s05, 97 s | Servicio improvisado, líneas con horario y plano, red integrada; la flota sin líneas | «Madurez: integración y resultados, no gasto ni plantilla» (56) y «Primero requirements y proceso; la herramienta, al final» (56) |

Tarjetas: **4** (3-5), una en cada escena de s02 a s05, ninguna en s01 ni en la última, todas «Dissemination». El concepto 2 solo
tiene una tarjeta aunque tiene dos preguntas (q2 y q4): la tarjeta («Pregunta tras cada producto y apunta éxitos atribuibles», distinta de la de G03) junta las dos ideas del párrafo `:1121`; el «ajustas los requirements y los productos» (q2) lo dice la voz. Si Lidia prefiere separarlas, hace falta una escena más.

**Se queda fuera** (y dónde está): la fila «Feeds contratados / cobertura del CMF» (`:1115`, solo en pantalla) y, de «Páginas por informe
/ tiempo requisito→respuesta; satisfacción del consumidor» (`:1116`), la satisfacción (en pantalla; la voz solo dice el tiempo de respuesta); las cifras del primer check (`:1135-1139`); el concepto de
CMF como tal (`src/data/s3.ts:22-60`; sale una vez en pantalla); la telemetría de uso como feedback (`src/data/s5.ts:645`,
s5m3); por qué el feedback es la segunda fase más ignorada (`src/data/s1.ts:556`, ya en G03); las seis fases del ciclo y F3EAD
(G03). Detalle en `out/script-notes.md`.

#### Escenas (seis, tres capítulos: Qué medir y a quién preguntar · Cómo madura un equipo · Para el examen)

| Escena | Cap. | s | Qué se ve | Qué se aprende · cues |
|---|---|---|---|---|
| s01-hook «¿Sirve de algo el equipo?» | 1 | 19 | Tira «Meridian Dynamics · aeroespacial · tú, su analista de inteligencia» (sin fecha ni hora). Tira del CISO: «¿sirve de algo el equipo de inteligencia?» (pregunta, no decisión; efecto `mail`). Un panel «de ejemplo · cifras ficticias» con tres contadores sin valor legible (indicadores procesados, informes publicados, feeds contratados). Título «Métricas, feedback y madurez» (antes de los 12 s) y la promesa en tres chips | La pregunta y «contar no es demostrar» · `ask, panel, numbers, title, promise` |
| s02-medir «Kilómetros y viajeros» | 1 | 55 | La línea de autobús; contador de kilómetros que sube (efecto `typing`) con «Nº de IOCs ingeridos»; el autobús vacío («nadie a bordo»); viajeros que llegan unidos a dos filas de valor. **Mensaje interceptado** (VELVET CICADA) y la tabla de la lección en cuatro filas (chips rojo y verde, sin emoji), con la izquierda que se apaga («el equipo hace lo que se mide») y la derecha que se enciende; la fila de «tiempo de requisito a respuesta» con un reloj que corre desde que el viajero llega a la parada hasta que llega adonde iba (q6: de punta a punta). Tres métricas quietas y la tarjeta | Volumen contra resultados · `route, km, empty, arrive, reply, target, value, wait, lens` · **intercept** |
| s03-bucle «Preguntar al viajero» | 1 | 48 | El viajero se baja y recibe una pregunta; cuatro fichas con las preguntas de la lección; un lazo «producto, feedback, requirements ajustados» (sin las seis fases ni el restaurante de G03); un cuaderno con la frase de ejemplo «esta búsqueda de amenazas nació del informe X y encontró la intrusión Y» rotulada **«Ejemplo de la lección · no es el caso de Meridian»** (efecto `check` al resolverse Y); «la frase que financia equipos»; dos esquemas, atribuible (tres cajas con hilo) frente a «solo coincide en el tiempo» (sin hilo). La tarjeta; sin cue propio, dos rótulos finales: «preguntas para mejorar» y «éxitos para demostrar» | El feedback es una fase del ciclo y los éxitos atribuibles son la prueba · `survey, q1, q2, q3, q4, loop, record, win, fund` |
| s04-madurez «Cómo crece un servicio» | 2 | 52 | **Mensaje interceptado** y, durante toda la escena, una moneda y una persona tachadas con «no se compra». Barra de tres estadios (efecto `ding`): 1 reactivo (un autobús suelto, avisos de avería que se apagan), 2 en desarrollo (tres líneas con horario, «CMF: qué fuente responde qué pregunta», un barrio sin línea), 3 maduro (la red enlazada a la ciudad y a otra red). Rótulos «no cuenta: analistas ni gasto» y «cuenta: decisiones tomadas con lo que produces». La tarjeta | Los tres estadios y que la madurez no es gasto ni plantilla · `reply2, stages, s1, s2, s3, measure` (el plano de barrios va en pantalla durante `s2`, sin cue) · **intercept** |
| s05-plataforma «Una compra tentadora» | 2 | 52 | La barra de estadios con una flecha marcada entre el 1 y el 2; la flota sin líneas (efecto `error`); una caja «plataforma de inteligencia de amenazas (TIP)» llena de fichas de indicadores sin consumidor. **Pregunta para pensar** con la barra apagada y una ficha «plataforma cara · sin requirements escritos», rotulada **«Ejemplo hipotético · no es el equipo de Meridian»** (la voz también dice «con otro equipo que no es Meridian»); respuesta: la ficha se posa en el estadio 1. Tres pasos del orden sano. La tarjeta | La trampa del paso 1 a 2 · `tempt, fleet, tip, question, answer, order` · **think** |
| s06-recap «Tres reglas» | 3 | 26 | Tres tarjetas de regla con su viñeta; tarjeta final Alertópolis: «Tu turno: las preguntas de la lección» (s5m5, 6 preguntas) y el descargo | Reflejos · `recap, rule-1, rule-2, rule-3, next, endcard` |

**Pregunta para pensar** (s05): «Plataforma cara, sin requirements: ¿1 o 2?» (42; `holdMs` 4000). Respuesta: «Sigue en el uno»; lo que define
al 2 son los requirements escritos (`:1126`) y la plataforma no los escribe por ti (q5, `:1231`). El título de la escena, «Una compra
tentadora», no la da. **Aviso para el revisor:** la lección no dice literalmente en qué estadio está ese equipo; lo deduce de la
definición del 2 (ver «Notas de exactitud»).

**Mensajes interceptados** (VELVET CICADA; tutea, dice «analista», ironía, atajo de método, ningún hecho; ninguno empieza con
«Bloquea» y ninguno repite los de V27, G05, G06 ni G07):
- s02 (cap. 1): «Cuenta los indicadores que procesas, analista. Impresiona mucho.» (64). El error: medir volumen. Respuesta: «Contar
  indicadores de compromiso es fácil, sí. Pero un equipo hace lo que se mide, y acabará procesando indicadores, no inteligencia.»
- s04 (cap. 2): «Mide tu madurez por lo que gastas, analista. Más gasto, más madurez.» (68). El error: madurez igual a gasto (q3,
  «not headcount or spend»). Respuesta: «Gastar es fácil de contar, sí. Pero la madurez no se compra. Se ve en tres estadios.»

**Cierre:** tres reglas y una sola tarea. (1) Mide resultados, no volumen. (2) Pregunta tras cada producto y apunta los éxitos
atribuibles. (3) Primero el proceso, luego la plataforma, porque la madurez se mide en decisiones, no en gasto. Tarea: las seis preguntas de s5m5. Sin laboratorios (los de S5 no se tocan).

#### Canon

**Canon nuevo que fija G10** (nada de esto estaba en los datos del curso; para `docs/superpowers/canon/velvet-cicada.md` §3 y §7
al cerrar el vídeo):
- **Sin fecha ni hora**, como V9, V22, V23, V27 y G02.
- **El CISO pregunta «¿sirve de algo el equipo de inteligencia?»**: es el CISO de §3, sin nombre, que pregunta y no decide.
- **Dos mensajes nuevos de VELVET CICADA** (arriba). Ninguno confiesa nada ni dice qué es el grupo.
- **Panel de ejemplo** con contadores sin valor, y **frase de ejemplo** del cuaderno («Ejemplo de la lección · no es el caso de
  Meridian»): no hay ningún hunt de Meridian que haya encontrado nada. **Ejemplo hipotético** de la plataforma cara: no es un
  hecho de Meridian ni sugiere que Meridian haya comprado nada.
- **La imagen del autobús** (línea, viajero, flota, cocheras, plano de barrios) es de la analogía, no del caso.

**No se toca:**
- **Ningún dato de la campaña**: ni hosts, cuentas, horas, IP o hashes; ni el C2, el certificado y `kazuo.tanji@`; ni el flash alert
  MER-FA-2026-014, MER-2026-011, la ola de phishing del 2026-04-18 (`src/data/s5.ts:47-69`) ni la regla YARA o Sigma de s5m3.
- **El dosier de LAST WORD** (`src/data/course-gcti.ts:96-97`): ni «el informe llega al consejo», ni «caso cerrado», ni
  «espionaje dirigido al programa de propulsión». El CISO no lleva nada al consejo en pantalla.
- **Los casos reales de s5m4** (G06) y **el Lab 5B** (`src/data/labs.ts:174-189`): nada.
- **El «martes»** del ejemplo de la lección (`src/data/s5.ts:1121`): el canon ya usa «el martes» para el panel de phishing de
  `141.98.6.10` (`src/data/s1.ts:27,32`); el vídeo no pone día.
- **Las preguntas de colocación pl-s5q11 y pl-s5q12** (`src/data/placement-gcti-s5.ts:186-215`): no se usan sus escenarios (un
  equipo de cinco personas ante una congelación de presupuesto; assessments estratégicos que menos de la mitad abre) ni sus
  respuestas. El gancho es otro: el CISO pregunta si sirve de algo, sin presupuesto ni plantilla.
- **Las cifras del check 1** (`src/data/s5.ts:1135-1139`): no salen.

**Comprobación de límites** (recuentos hechos con scripts de Node sobre `narration.json` y `storyboard.json`, no a ojo; perfil
`capsula-yt`, `video/engine/scripts/lib/profiles.mjs`):
- Duración: suma de `targetSec` 238 s; estimado 254,3 s; ventana 190-260. Sí.
- Capítulos: 3 (máximo 3). Sí.
- Conceptos clave: 3 (2-3). Tarjetas: 4 (3-5), de 51, 55, 56 y 56 caracteres (máximo 58), una por escena, ninguna en la última. Sí.
- Pregunta para pensar: 1, 42 caracteres (máximo 48), `holdMs` 4000 (mínimo 4000). Sí.
- Mensajes: 2 (1-2), de 64 y 68 caracteres (máximo 70), `holdMs` 3000 (2500-4500), uno por capítulo, ninguno en la escena final,
  ninguno en un segmento con pregunta. `video.json` lleva `"adversary": "VELVET CICADA"`. Sí.
- Segmentos: 29, de 9 a 30 palabras, ninguna frase de más de 20; ningún `;`; ningún segmento con dos `:`; ninguna etiqueta de
  emoción repetida en dos segmentos seguidos. Sin flechas ni emoji en narración, tarjetas, pregunta ni mensajes.
- `build-timeline --estimate`: **sin avisos** (una versión anterior avisó de 274,5 s y de dos marcas a 19 fotogramas; recortado y
  corregido). `canon-check`: 0 nombres, 0 en la campaña, 0 nuevos. `script-sheets`: solo el aviso de «no congelado».
  `voice-plan`: falla la lectura de la cuota (falta `ELEVENLABS_API_KEY` en `.env.local`); no importa, la voz es la grabación de Lidia.

#### Laboratorios y preguntas que ya ejercitan el tema

- **Las seis preguntas de s5m5** (`src/data/s5.ts:1163-1246`) y los **dos checks** (`:1130-1159`) son lo que el vídeo explica. No se
  repiten sus cifras ni su redacción; la tarjeta 4 resume el orden de q5 (`:1225`) y la 1 y la 2 son de `:1107` y `:1121`. La literal de la lección («El TIP no sustituye a los requirements», `:1127`) se quitó en la revisión para dejar el TIP en su cue.
- **Tarjeta flash `fc515`** (`src/data/flashcards.ts:92`) y término `Vanity metric` (`src/data/glossary.ts:105`): coinciden con el
  concepto 1; la voz dice «métrica» sin el término inglés, que sale en la tabla de pantalla.
- **Lab 5A** (calibración) y **Lab 5B** (informe final): no se mencionan; ninguno mide al equipo.
- **G03** (`video/ciclo-pir`, s04-04 a s04-06) ya dijo «que nadie se queje no es un aplauso» y «feedback es comprobar si la
  necesidad quedó cubierta» con un intercept de EMBER FOX («si nadie se queja…»). G10 **no repite** esa idea ni su tarjeta («Feedback:
  ¿cubierta la necesidad? Refina requirements»): va por las cuatro preguntas y por el éxito atribuible.
- **AP07** (`video/stealers-metricas`, s09): ya dijo que más archivos no demuestran más valor y que no hay que convertir una
  coincidencia temporal en causa. G10 lo retoma **una vez**, como cautela de «atribuible», con otra imagen.

#### Decisiones de esta ficha (con la alternativa descartada)

1. **Tres conceptos, no dos.** Alternativa descartada: dejar la madurez fuera (métricas + feedback), que es lo que pide el
   objetivo 2 de la lección pero deja sin cubrir q3 y q5 y el check 2. La madurez va en dos escenas cortas (s04 y s05) y el resto
   en dos.
2. **Una línea de autobús, no un huerto ni una emisora.** Alternativas descartadas: un huerto (semillas sembradas frente a platos
   cocinados; roza el restaurante de G03) y una emisora de radio (horas en antena frente a oyentes que cambian de ruta; roza el
   aviso de tormenta de G05). El autobús tiene tiempo de espera (q6), plano de cobertura (CMF) y flota sin líneas (TIP) sin
   inventar nada.
3. **El ejemplo atribuible va en un cuaderno, no en el autobús** (ver «Qué no falsea la imagen»).
4. **El éxito atribuible lleva una cautela** («seguir el hilo, no una coincidencia en el tiempo»), tomada de AP07. Alternativa
   descartada: decir solo la frase de la lección, que deja que un candidato crea que cualquier detección posterior a un informe es
   suya.
5. **VELVET CICADA, dos mensajes de «medir lo fácil»** (volumen y gasto), no uno de feedback. Alternativa descartada: un mensaje
   que anime a saltarse el feedback («ya te dirán si algo falla»): G03 ya gastó esa idea con EMBER FOX.
6. **El vídeo va antes del primer check.** Ver «Inserción».
7. **Los estadios se asignan al ejemplo con la regla de la lección** (sin requirements escritos no hay estadio 2). Alternativa
   descartada: preguntar «¿ya es maduro?», que no obliga a usar los estadios. Si la revisión de exactitud no admite la deducción,
   la pregunta cambia a «Plataforma cara, sin requirements: ¿hay estadio 2?» y la respuesta pierde el «en el uno».
8. **Tarjeta 4 sobre el orden («Primero requirements y proceso; la herramienta, al final») y voz sin género** («lo que llaman
   TIP»), para no discutir «el» o «la» TIP. Alternativa descartada tras la revisión: la tarjeta literal de la lección.

#### Riesgos de solape

- **G03** y **AP07**: ver arriba; los dos se citan como «ya dicho», no se contradicen.
- **G05** (`video/producto-bluf`): usa «probabilidad frente a confianza» con el pronóstico del tiempo; G10 no usa tiempo
  meteorológico. Coincide en el dominio (Dissemination) y en que VELVET CICADA tutea con «analista».
- **G06** y **G07**: VELVET CICADA ya empuja atajos de método (cuarenta páginas, índice «solo una lista»). Los de G10 son de
  distinta familia (contar, gastar).
- **G08 y G09** (otras fichas de esta tanda): no se han leído al escribir esta; si usan un transporte o un autobús, hay que
  cambiar la imagen de una de las dos.

#### Preguntas para Lidia (ninguna bloquea; recomendadas entre paréntesis)

1. ¿Cómo dices **TIP**: «tip» (**recomendado**, es lo que lleva el léxico) o «ti i pe»? La voz la dice una sola vez (s05-03), y la
   tarjeta de pantalla es «El TIP…».
2. ¿Y **feedback** y **requirements**? Como en G03, no llevan entrada de léxico: los dices como te salga.
3. ¿Te encaja la **línea de autobús** (**recomendado**)? Las alternativas están en la decisión 2.
4. ¿El vídeo va **antes del primer check** (**recomendado**) o al final, antes del `quiz`?
5. Para «hunt», la voz dice **«búsqueda de amenazas»**; G02 dice «caza de amenazas» para la Active Defense. ¿Prefieres «caza»?
   (**recomendado: búsqueda**, porque «las cazas que nacieron de un informe» suena peor).
6. ¿Dos mensajes de VELVET CICADA (**recomendado**) o uno?
7. `recording.tempo` va **ausente** (tempo 1), por tu decisión de hoy. ¿Lo confirmas?

#### Notas de exactitud (para el revisor; referencias en `src/data/s5.ts` salvo que se diga)

- **Lo que la voz dice y de dónde sale.** «Contar no es demostrar» y «un equipo hace lo que se mide»: `:1107`, q1 (`:1174`).
  «Decisiones mejor tomadas y amenazas encontradas»: `:1107` («resultados sobre decisiones y detección»). «Búsquedas de amenazas
  nacidas de un informe que encontraron actividad real» y «requirements que ya se respondieron»: `:1113-1114`. «Tiempo de espera
  desde que alguien pregunta»: `:1116`, q6 `:1234-1246`. Las cuatro preguntas del feedback: `:1121`. «No es cortesía, es una fase
  del ciclo»: `:1121` («fase del ciclo, no cortesía»). «Ajustas requirements y productos»: q2 `:1182`. «Financia equipos»: `:1121`.
  Tres estadios: `:1126`. «Requirements escritos, productos regulares»: `:1126`. «Se mide por resultados, y otros usan lo que
  produces»: `:1126` («métricas de resultado, producción propia que la comunidad consume»). «No va de cuántos analistas ni de
  cuánto se gasta»: q3 `:1196-1202`. «Comprar plataforma antes que proceso»: `:1127`. «Amplifica lo que haya, no crea el
  proceso»: q5 `:1231` y check 2 `:1157`. «Almacén de indicadores sin consumidores»: check 2 `:1151`. Orden sano: q5 `:1225`.
- **Glosas propias que conviene mirar.** (a) «Atribuible es poder seguir el hilo del informe a la búsqueda, no una coincidencia en
  el tiempo»: la lección dice «nació del informe X» (`:1121`) y q4 «originated from»; la cautela viene de AP07 s09-06. (b) «Sin
  requirements escritos no hay estadio dos»: deducción de `:1126`. (c) «Lo que llaman TIP»: la lección no expande la sigla; el
  nombre estándar es Threat Intelligence Platform (de memoria; comprobar con el material oficial). (d) «El tiempo de espera en la
  parada» para el tiempo de requisito a respuesta: q6 lo explica como capacidad de respuesta a lo largo de todo el ciclo
  (`:1246`); la imagen cubre la espera, no la producción. (e) «Mide mejor las búsquedas de amenazas…»: la lección habla de
  «detecciones/hunts», y q6 de «responsiveness»; se dicen como ejemplos de métricas de valor, no como lista cerrada.
- **Puntos dudosos de la lección.** (1) `CMF` aparece sin definir en s5m5 (`:1115`); es de s3m1 (`src/data/s3.ts:22`). La voz no lo
  dice; la pantalla lo rotula una vez. (2) La lista de madurez (`:1126`) mezcla rasgos de proceso (requirements escritos, CMF) y de
  producto (producción propia que consume la comunidad) sin un criterio explícito para pasar de un estadio a otro ni para estar
  «entre dos». (3) La tabla usa la flecha «requisito→respuesta» (`:1116`): en pantalla se rotula «de requisito a respuesta». (4)
  El ejemplo del check 1 y q4 hablan de «hunts» mientras el cuerpo de la lección llama «intel» a la fuente: el vídeo dice
  «informe». (5) La lección llama «Madurez típica» a los tres estadios, no «modelo oficial»; el vídeo dice «la lección lo cuenta
  en tres estadios».
- **A verificar con el material oficial** (no van en tarjeta): que el examen use «TIP» sin expandir y que las tres etapas sean
  las del curso y no una simplificación de la lección.

#### Revisiones de exactitud y naturalidad (2026-10-25): qué se aplicó y qué no

Aplicado (texto de la voz salvo que se diga; ids tras renumerar):
- **s02-05:** «Mide, por ejemplo, las búsquedas de amenazas… Y las preguntas del consumidor, los requirements, ya respondidas.»
  Define «requirements» la primera vez que se dice.
- **s02-06:** «Mide también cuánto tarda la respuesta desde que alguien pregunta hasta que llega a su destino. Es el tiempo desde que
  llegas a la parada hasta que llegas adonde ibas.» En el storyboard el reloj corre hasta la llegada (q6, ciclo de punta a punta).
- **s02-07:** «una buena métrica mira resultados, decisiones y detección, no volumen» (la tarjeta no cambia, 51).
- **s02-01, s02-02, s02-03, s02-04:** «Y sale mucha actividad», «no ha llevado a nadie a ningún sitio», «los viajeros que llegan
  adonde iban» (se quitó la segunda frase de s02-03, que repetía s02-07, para ganar tiempo) y «indicadores de compromiso».
- **s03-03, s03-04, s03-05:** «los requirements y los productos»; «los éxitos que de verdad sean tuyos… decir que esta búsqueda
  nació de este informe»; «Esa frase es la que financia equipos. Y se llama éxito atribuible: puedes demostrar que el hallazgo
  salió de tu informe, y no solo que llegó después.» Tarjeta 2: «Pregunta tras cada producto y apunta éxitos atribuibles» (55).
- **s04-01, s04-02, s04-03, s04-05, s04-06:** «Se ve en tres estadios»; «mandar el autobús que haya a donde te lo pidan»; «el de
  desarrollo»; «otros equipos, fuera del tuyo, usan lo que produces»; «Va de si las decisiones se apoyan en tu trabajo y de los
  resultados que puedes demostrar».
- **s05-01 a s05-06:** «primer estadio al segundo… la plataforma antes que el proceso»; «a qué barrios llevas a la gente»;
  «Sin proceso, acaba siendo un almacén de indicadores que nadie usa» (conserva «lo que llaman TIP»; se quitó «No crea el proceso»
  para ganar tiempo); «Una prueba, con otro equipo que no es Meridian» (se quitó el «A ver» por tiempo; se mantiene el rótulo
  «Ejemplo hipotético · no es el equipo de Meridian»); «Sigue en el uno. Lo que define al dos son los requirements escritos…»;
  «El orden sano es al revés». Tarjeta 4: «Primero requirements y proceso; la herramienta, al final» (56).
- **s06-03:** «…porque la madurez se mide en decisiones, no en gasto.»
- **Léxico:** `[TIP|tip]` en el texto de la voz (y fuera `TIP` de ambos léxicos, porque el validador avisaba de que no se usaba fuera del
  marcado). **No** se añadieron «feedback» ni «requirements»: el léxico de G03 no tiene ninguna entrada para ellas, no hay
  pronunciación que copiar, y inventarla afectaría a la comprobación de la grabación de Lidia. Decide ella (pregunta 2).

Recortes hechos para volver a ≤ 260 s (las revisiones subían el estimado a 280 s): se quitaron los segmentos `wrap` (s03-06) y
`map` (s04-04) y sus cues (el plano de barrios y los dos rótulos finales de s03 siguen en pantalla, sin cue); s06-01 pasa a «Mide
resultados, no volumen, ni indicadores procesados» y s06-02 a «Pregunta tras cada producto y apunta los éxitos atribuibles»; s01-01
sin «la aeroespacial» (sigue en el rótulo) y s01-02 sin «con feedback»; pausas largas a 500 ms, mensajes a `holdMs` 3000, pregunta
a `holdMs` 4000 y tarjetas a `holdSec` 4. Estimado final: **258,6 s (4:18)**.

No aplicado:
- Cambiar «estadio» por «etapa»: se deja «estadio», que es la palabra de la lección (`:1127`, «la trampa del estadio 1→2»). Queda como
  **decisión opcional de Lidia** (pregunta 8): «etapa» suena más natural hablado; la palabra del examen no está comprobada.
- El plan B de la pregunta (decisión 7, «¿hay estadio 2?»): se mantiene la pregunta «¿1 o 2?» tal cual.
- Las cadenas de la ficha que dicen «sin requirements escritos no hay estadio 2» siguen valiendo; la voz lo dice ahora como «lo
  que define al dos son los requirements escritos».

Pregunta nueva para Lidia: **8.** ¿«Estadio» (**recomendado por ser la palabra de la lección**) o «etapa»?

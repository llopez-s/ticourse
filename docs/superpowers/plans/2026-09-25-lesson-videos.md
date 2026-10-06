# Plan de contenidos: vídeos explicativos y prácticos (IntelForge Academy)

## Contexto

Hoy el curso tiene 2 vídeos, ambos en Security+ D4:
- **SIEM** (sp4m6): 5:25, Remotion 1080p, voz neural, subtítulos karaoke, exam cards y think prompts. Es el patrón de calidad.
- **EDR** (sp4m7): 1:45, tubería antigua a 720p con voz de Windows. Solo cubre EDR, y la lección entera (4.5) se queda sin vídeo.

GCTI no tiene ningún vídeo.

La usuaria pide identificar qué lecciones ganan más con un vídeo **explicativo + práctico** y un plan detallado.

**Decisiones fijadas con la usuaria:**
- Alcance: ambas pistas.
- Tanda 1: 4 vídeos con brief completo.
- EDR: **rehacer**.
- Formato **mixto**: vídeos principales más cápsulas prácticas.

Resultado esperado: un ranking razonado de todo el curso, tres tandas priorizadas, los guiones-escaleta de la tanda 1 listos para producir, y los prerrequisitos técnicos y de canon que bloquean la producción.

---

## 1. Formatos

| | **Principal** | **Cápsula práctica** | **Principal YouTube (`principal-yt`)** | **Cápsula YouTube (`capsula-yt`)** |
|---|---|---|---|---|
| Suma de `targetSec` de las escenas | 270–300 s | 130–165 s | más que Principal: menos conceptos, mejor contados (lo acota la duración renderizada) | más que Cápsula, ídem |
| Duración renderizada (`minTotalSec`–`maxTotalSec` de `scripts/lib/profiles.mjs`) | ≈ +20 s por márgenes de la tubería (entradas, colas y transiciones de escena, cierre): 290–320 s. En el SIEM, 305 s de escenas dieron 325 s | ≈ +15–20 s: 150–190 s | **380–600 s** (hasta 10 min desde V5, 2026-09-30: es un techo, no un objetivo) | **190–260 s** |
| Estructura | 5 capítulos, 10–12 escenas | 3 capítulos, 5–6 escenas | 5 capítulos (sin cambios) | 3 capítulos (sin cambios) |
| Exam cards (≤58 car., máx. 1 por escena, ninguna en la última) | 8–11 | 4–6 | **5–8** (4–6 conceptos clave) | **3–5** (2–3 conceptos clave) |
| Think prompts (≤48 car.) | 2 | 1 | 2 (sin cambios) | 1 (sin cambios) |
| Mensajes interceptados del adversario (§4) | — (perfil sin ellos) | — (perfil sin ellos) | **2–4, máx. 1 por capítulo** | **1–2** |
| Demo práctica | 1–3 escenas de consola/log/diagrama | ≥50 % del vídeo | igual que Principal | igual que Cápsula |
| crf | 23 (el SIEM dio 31 MB; subir a ~26 en el perfil y comprobarlo con `render --draft`) | 27 | **18** (YouTube vuelve a codificar; sube más calidad) | **18** |
| Tamaño MP4 / dónde vive | ≤25 MB, en `public/videos/` (se commitea) | ≤12 MB, en `public/videos/` (se commitea) | **sin objetivo de tamaño: se sube a YouTube.** El MP4 va a `video/<slug>/out/`, que está **ignorado por git — nunca se commitea** | igual que Principal YouTube |
| Cuándo usarlo | Concepto con flujo o espacio que exige explicar el *porqué* | Una destreza concreta y repetible (procedimiento, lectura de salida) | igual que Principal, para un vídeo nuevo que se publica en el canal de YouTube | igual que Cápsula, ídem |

Estilo común, heredado del SIEM:
- 1920×1080 a 30 fps, sin flechas ni emoji en la narración.
- Subtítulos de 2×42 caracteres.
- Datos ficticios con el sello «Simulación educativa · datos ficticios».
- Descargo por pista: «no afiliado a CompTIA» en Security+, «no afiliado a SANS/GIAC» en GCTI.

### Narración hablada (vídeos nuevos)

Estas reglas rigen los vídeos nuevos (V4 y siguientes) y son **la única copia**: el README del motor y los
diseños remiten aquí. Sustituyen a la «narración con chispa» del 2026-09-26, con la que se escribieron V1
(capas-halden) y V3 (diamond-e7); esos vídeos, como los tres anteriores, no se rehacen. Diseño y motivos:
`docs/superpowers/specs/2026-09-28-spoken-narration-design.md`.

El objetivo: que suene a una persona que te lo explica, no a un texto leído. La narradora es una sola voz, en
segunda persona, y el guion es lo que dice (la transcripción y los subtítulos salen de él).

#### Reglas

1. **Habla, no acotes.** Cada frase tiene a alguien haciendo algo. «Sala de control del muelle 3.» pasa a
   «Estamos en el muelle tres.»
2. **Conectores hablados, no dos puntos.** «porque», «o sea», «así que», «pues», «fíjate», «es que». Como mucho
   un «:» por segmento, y en no más de un tercio de los segmentos.
3. **Primero la idea, luego el nombre.** Se explica con palabras llanas y después se nombra («…si no es el
   mismo, suspenso. Eso es la alineación.»). Ningún término se usa en la historia antes de explicarlo.
4. **Repite lo importante.** Cada concepto clave se dice dos veces, con palabras distintas. Cada capítulo
   anuncia lo que viene y cierra con un «o sea, que…».
5. **Lo que se lee no se deletrea.** Dominios, equipos, IP, hashes, correos y nombres de fichero van en
   pantalla; la voz dice qué son («el dominio del atacante», «una estación de administración»). Como mucho una
   excepción por vídeo, si el nombre es la pista central, justificada en `out/script-notes.md`.
6. **Una analogía por concepto, y se mantiene.** Una imagen cotidiana por concepto clave, que vuelve cuando el
   concepto vuelve. Nada de amontonar imágenes nuevas.
7. **Preguntas de verdad, sin cuota.** Las que se haría quien lo ve, con formas distintas. Nunca la fórmula
   «¿Y X? Pues Y» encadenada.
8. **Frases cortas, unidas como se habla.** Una idea nueva por frase (unas 20 palabras como mucho; nada de
   enumeraciones con punto y coma: una lista de más de tres elementos va a la pantalla), pero con sus
   conectores: una frase corta no tiene que sonar a telegrama.
9. **Humor en el marco, nunca en el dato.** Ironía, guiños y remates van en las frases que presentan o comentan;
   la que transmite el dato va limpia. El texto de las tarjetas de examen no se adorna.
10. **Ritmo vivo.** `pauseAfterMs` normal 250–400 ms; tras un remate o una revelación, 500–700 ms. Emociones
    `<…>` variadas (ElevenLabs las entiende y Chatterbox las traduce a un registro), sin repetir la misma en dos
    segmentos seguidos.
11. **La historia manda.** Halden / GLASS HARBOR en Security+ y VELVET CICADA en GCTI. El adversario provoca y
    la narradora responde (§4).
12. **La prueba del café.** ¿Se lo dirías así a una amiga tomando algo? Si no, se reescribe.

#### Menos conceptos, mejor contados

- Un principal explica **4–6 conceptos clave**; una cápsula, **2–3**. Cada uno recibe explicación llana, nombre,
  su analogía, su momento en la historia y como mucho dos tarjetas de examen.
- Lo que no cabe se queda en el texto de la lección de la app; `out/script-notes.md` dice qué se quedó fuera y
  dónde está. Si una lección tiene demasiado, se parte en dos vídeos.
- **Nunca se rellena** para llegar a la duración mínima del perfil: si el guion queda corto, se baja el mínimo.
- `wordBudget` de cada escena = `targetSec` × **2,7** palabras/s en los perfiles `-yt` (los antiguos, 2,4).

#### Ejemplo (capas-halden s02, aprobado por Lidia)

Antes:

> Sala de control del muelle 3. Lucía, de Operaciones, recibe por correo los turnos de atraque. Remite
> haldenport.example: de casa. ¿Seguro que es de casa? Abres las cabeceras: la etiqueta de envío que casi nadie
> mira. SPF da el aprobado. DKIM, también. Pero lo que validan es hdn-mailer.example, el dominio del atacante.
> […] Falló la alineación. DMARC compara el From que ve Lucía, haldenport.example, con el dominio validado. No
> coinciden: suspenso.

Después (mismos cues, misma pausa para pensar, misma tarjeta de examen):

> Estamos en el muelle tres. A Lucía, de Operaciones, le llega un correo con los turnos de atraque. Y viene de
> casa, del dominio del puerto.
> Bueno, eso parece. Pero antes de fiarte, mira las cabeceras. Son como la etiqueta de envío de un paquete, y
> casi nadie las mira.
> Hay dos comprobaciones en verde. SPF dice que el servidor tenía permiso para enviarlo. Y DKIM, que la firma es
> buena.
> Todo en orden, ¿no? Pues mira de quién es ese permiso. Y esa firma. Del dominio del atacante, no del puerto.
> Lo que falla es que no cuadran. DMARC compara el remitente que ve Lucía con el dominio que han comprobado SPF y
> DKIM. Si no es el mismo, suspenso.
> Eso es la alineación. O sea, que el correo trae dos aprobados y un suspenso… y aun así está en su bandeja.
> ¿Cómo ha entrado?

#### Revisores y validador

- **Dos revisores**, subagentes de solo lectura, en paralelo y antes de grabar o sintetizar la voz:
  - **exactitud**, contra la lección y el objetivo oficial; comprueba también que ninguna analogía ni chiste
    falsee el concepto (una analogía que simplifica en exceso se corrige o se quita);
  - **naturalidad**, contra las doce reglas y el presupuesto de conceptos de arriba; devuelve los segmentos que
    hay que reescribir, con una propuesta para cada uno.
- **Validador del motor** (`analyzeNarration`). El aviso de frase de más de 22 palabras vale para todos los
  perfiles. Los perfiles `-yt` (`chispa: true`) avisan además, **solo como avisos**:
  - dos segmentos seguidos con la misma etiqueta de emoción, y `;` en el texto hablado;
  - más de un «:» usado como conector en un segmento, o «:» en más de un tercio de los segmentos;
  - un dominio, IP, equipo, hash, correo o nombre de fichero leído en voz alta;
  - más de 3 preguntas que empiezan con la misma palabra («¿Y …?»).

  El primer guion con estas reglas debe pasar `build-timeline --estimate` sin ninguno de estos avisos.

#### Grabación propia: ritmo

- `narration.json` → `"recording": { "tempo": 1.08, "maxPauseMs": 250 }`: `import-recording.mjs` acorta a
  250 ms las pausas dentro de cada frase y acelera los clips un 8 % sin cambiar el tono. **Provisional** hasta
  que Lidia elija en la audición de ritmo (escena s02 de capas-halden a 1×, pausas cortas, 1,08× y 1,15×).
- Al grabar: a ritmo de conversación, sin la pausa de lectura entre frases (el corte ya deja aire).
- Si una oración sale mal, basta con repetir **esa oración**: el importador se queda con la última toma de
  cada oración y las empalma (y con la última toma de la frase entera, si se repite completa).

#### Claridad y ritmo (revisión del 2026-09-29)

Del análisis de V1, V3 y el borrador de V4 (`docs/reviews/2026-09-29-videos/analisis-y-prompt.md`): la estética
y los diagramas funcionan; lo que más ayuda es que quien lo ve sepa qué va a aprender, dónde mirar y cuándo pensar.

1. **La promesa, en los primeros 8–12 s.** El problema, qué sabrá hacer quien lo ve y el nombre del tema (el cue
   `title`; `build-timeline` avisa si llega después de los 12 s). Si el vídeo continúa otro, una frase resume lo
   imprescindible para que se entienda por separado.
2. **Tiempo de verdad para pensar.** Dos preguntas en un principal y una en una cápsula, cada una una decisión breve
   (mejor con dos opciones), con `think.holdMs` de 4000–5000 ms: 3–4 s con la tarjeta asentada. Después, la
   respuesta y su motivo.
3. **Primero el ejemplo, después la tarjeta.** `narration.json` → `"examTiming": "sentence-end"`: la tarjeta de
   examen espera a que termine la oración de su cue. Una regla por tarjeta, y nunca una tarjeta nueva mientras hay
   que leer un log o comparar dos valores.
4. **Dónde mirar.** Evidencia, interpretación y regla, por pasos y al compás de la voz. Se amplía la fila, el valor o
   la conexión que se explica y se atenúa el resto; 48–60 px para las etiquetas clave, comprobado a 480 px de ancho.
5. **El adversario trae un error concreto** que la explicación corrige; si solo repite la historia, sobra.
6. **Cierre: tres reglas prácticas y una sola acción siguiente** (una pregunta, un laboratorio o la lección
   siguiente).
7. **El mismo volumen en todos los episodios:** `master_mix.py`, −14 LUFS y −1 dBTP medidos sobre el MP4 ya
   codificado.

#### Vocabulario de etiquetas de emoción

El guion usa etiquetas `<…>` que ElevenLabs entiende de forma nativa y que Chatterbox traduce a un registro
(`video/engine/scripts/lib/moods.mjs`), para que el guion sea el mismo con cualquiera de los dos motores:

| Registro | Etiquetas | `exaggeration` | `cfg_weight` |
|---|---|---|---|
| Sereno | `calm`, `serious`, `steady`, `grave`, `focused`, `firm`, `concerned`, `warning`, `ominous`, `tired`, `sighs` | 0.40 | 0.50 |
| Neutro | sin etiqueta, `clear`, `thoughtful` | 0.50 | 0.50 |
| Cálido | `curious`, `intrigued`, `confident`, `warm`, `warmly`, `satisfied`, `relieved`, `reassuring`, `casual`, `engaging` | 0.60 | 0.45 |
| Vivo | `enthusiastic`, `cheerful`, `mischievously`, `sarcastic`, `urgent`, `suspicious`, `emphatic`, `tense` | 0.75 | 0.35 |

Qué etiqueta decide: la primera dirección del segmento y, dentro de ella («serious, warning»), la primera
palabra que esté en la tabla. Si una etiqueta no está en la tabla, se aplica el registro neutro y se avisa.
Detalle de la síntesis en `video/engine/README.md` («Voz: Chatterbox»).

#### El mensaje interceptado

Un nuevo tipo de aviso en pantalla, sin voz: un mensaje del adversario de la sección de la lección aparece
como interceptado y se escribe letra a letra, y a continuación la narradora lo responde con la explicación.

- Se declara en un segmento de `narration.json` con `"intercept": { "text": "…", "holdMs": 3500 }`
  (`text` ≤ 70 caracteres, sin flechas/emoji/símbolos prohibidos; `holdMs` entre 2500 y 4500 ms — el silencio
  antes del audio del segmento, para dar tiempo a leer el mensaje).
- `video.json` necesita `"adversary": "SILENT PAGER"` (el adversario de la sección, en `src/data/secplus/sections.ts`
  o `src/data/course-gcti.ts`) en cuanto algún segmento use `intercept`; si no, `build-timeline.mjs` lo rechaza
  como error (`analyzeNarration` no lee `video.json`, así que esta comprobación concreta vive en
  `build-timeline.mjs`, donde ya se juntan los dos archivos).
- Límites que valida `analyzeNarration`: como mucho 1 mensaje por capítulo (error), ninguno en la escena final
  (error), y el recuento total fuera del rango del perfil (§1) es solo un aviso.
- No tiene voz ni entra en los subtítulos; sí entra en la transcripción, como
  `[Mensaje interceptado · SILENT PAGER] «…»`, porque es contenido.

#### Los nombres en pantalla

En los vídeos nuevos, el póster y la tarjeta final dicen **«Alertópolis»**, nunca «IntelForge Academy» (el
nombre antiguo, que conservan los tres vídeos ya publicados para no romper su regresión byte a byte). El
`profile` de `video.json` **no** lo decide: `LEGACY_APP_NAME`/`APP_NAME` de `scripts/lib/profiles.mjs` solo
llegan al aviso de marca de la transcripción y la descripción de YouTube (`trackNotice`), nunca al póster ni a
la tarjeta final. El póster (`src/Poster.tsx`) y la tarjeta final (la escena de cierre) de cada vídeo nuevo
escriben «ALERTÓPOLIS» ellos mismos, a mano — nunca se copian de `video/siem/` o `video/forense-adquisicion/`
sin cambiar el nombre. `video/engine/scripts/lib/brand-yt.test.mjs` vigila que ningún vídeo con perfil `-yt`
conserve «INTELFORGE ACADEMY» en su propio `src/`.

**El título de la escena no destripa su pregunta** (revisión de exactitud de V11, 2026-10-05). El título de cada
escena (`storyboard.json` → `title`) se ve arriba durante toda la escena, y la tarjeta de la pregunta para pensar no
lo tapa. Si la escena lleva pregunta, su título no puede dar la respuesta: V11 tuvo que cambiar «Contraseñas con sal»
por «Cómo se guarda una contraseña» y «Un color que nadie envía» por «Pinturas en la carretera».

## 2. Rúbrica de selección (igual para ambas pistas)

`Total = 2·D + 2·P + 2·E + N + G − L` (máximo 24)

- **D** Dinamismo (0–3): el concepto es una secuencia, un flujo, una transformación o una relación espacial.
- **P** Demo práctica simulable (0–3): hay consola, log, cabeceras o formulario que el vídeo puede «ejecutar».
- **E** Examen (0–3): peso del dominio y trampa típica en las preguntas.
- **N** Enganche narrativo (0–3): Halden / GLASS HARBOR o VELVET CICADA.
- **G** Hueco (0–3): lección delgada, sin diagrama o sin salida real.
- **L** Penalización (0–1): un lab `order`/`select`/`classify` ya ejercita la misma secuencia. En ese caso el vídeo debe aportar el *porqué* y la demo, no repetir el orden.

## 3. Ranking

| # | Lección | Tema | D | P | E | N | G | L | **Tot** | Formato | Tanda |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | s3m3 | Infraestructura: pDNS, WHOIS, certificados | 3 | 3 | 3 | 3 | 3 | 0 | **24** | Principal | 1 |
| 2 | sp4m7 | Capas de defensa (firewall, IDS/IPS, correo, EDR) — **rehacer** | 3 | 3 | 3 | 3 | 2 | 0 | **23** | Principal | 1 |
| 3 | sp4m11 | Adquisición forense y custodia | 3 | 3 | 3 | 2 | 1 | 0 | **21** | Cápsula | 1 |
| 4 | sp4m10 | Respuesta a incidentes | 3 | 2 | 3 | 3 | 2 | 1 | **20** | Principal | 2 |
| 5 | sp4m8 | IAM: SAML/OAuth/OIDC, MFA, PAM | 3 | 2 | 3 | 1 | 3 | 0 | **20** | Principal | 2 |
| 6 | s2m5 | ATT&CK + Pyramid of Pain | 2 | 3 | 3 | 3 | 1 | 0 | **20** | Cápsula | 2 |
| 7 | s2m3 | Diamond Model (lab2b ya ejercita la descomposición) | 3 | 2 | 3 | 3 | 1 | 1 | **19** | Principal | **1 (excepción)** |
| 8 | s4m3 | Técnicas estructuradas y ACH | 3 | 2 | 3 | 3 | 1 | 1 | **19** | Principal | 2 |
| 9 | s3m5 | IOCs, STIX/TAXII («¿ingiero este indicador?») | 2 | 3 | 3 | 2 | 1 | 0 | **19** | Cápsula | 2 |
| 10 | sp2m7 | Ataques de red y de contraseña en los logs | 2 | 3 | 3 | 2 | 1 | 0 | **19** | Cápsula | 2 |
| 11 | sp1m6 | Criptografía: quién usa qué clave, TLS híbrido | 3 | 2 | 3 | 1 | 1 | 0 | 18 | Principal | 3 |
| 12 | sp1m7 | PKI: cadena, CRL/OCSP (demo `openssl`) | 3 | 3 | 2 | 1 | 1 | 0 | 18 | Cápsula | 3 |
| 13 | sp3m5 | 802.1X, VPN, IPSec AH/ESP | 3 | 2 | 3 | 1 | 1 | 0 | 18 | Principal | 3 |
| 14 | s2m4 | Activity threads y agrupación | 3 | 2 | 2 | 3 | 1 | 0 | 18 | Principal | 3 |
| 15 | s2m1 | Cyber Kill Chain | 3 | 2 | 3 | 3 | 0 | 1 | 18 | Principal | 3 |
| 16 | s3m2 | Triaje de malware en sandbox | 2 | 3 | 2 | 3 | 1 | 0 | 18 | Cápsula | 3 |
| 17 | sp3m4 | Zonas, colocación, fail-open/closed | 2 | 1 | 3 | 2 | 3 | 0 | 17 | Principal | 3 |
| 18 | sp4m5 | Triaje CVSS por contexto | 1 | 3 | 3 | 2 | 1 | 1 | 16 | Cápsula | backlog |
| 19 | sp2m4 | SQLi y XSS en un login simulado | 2 | 3 | 2 | 1 | 1 | 0 | 16 | Cápsula | backlog |
| 20 | sp1m3 · sp4m2 · s4m5 · s2m2 | Zero Trust · WPA3 · atribución · CoA | — | — | — | — | — | — | 14 | Cápsula | backlog |
| 21 | sp5m3 · s5m3 · sp3m7 · sp5m4 | ALE · YARA/Sigma · DR · RTO/RPO | — | — | — | — | — | — | 12–13 | Cápsula | backlog |

**Cómo se eligió la tanda 1:**
- Entran los tres primeros del ranking.
- El cuarto, s2m3 (19 puntos), es una **excepción deliberada**: pasa por delante de los tres empatados a 20 (sp4m10, sp4m8, s2m5) por tres razones:
  - Es la precuela narrativa de V4: el evento E7 deja pivotes pendientes que V4 resuelve. Sin V3, V4 empieza en frío.
  - Equilibra las pistas: 2 vídeos de Security+ y 2 de GCTI.
  - s6m1 marca S2 como «corazón del examen».
- Esos tres de 20 abren la tanda 2, con sp4m10 en cabeza.

**Descartados:** sp1m1, sp2m1, sp5m1, sp5m2, sp5m6, sp6m1, s4m1, s4m2, s5m5, s6m1, s6m2 (más s1m1–s1m3 y s5m2). Son taxonomías o listas; las sirven mejor las tablas, las flashcards y los labs `classify`. s1m4 (ciclo de vida) queda fuera porque lab1a ya ejercita el orden y el tema no tiene demo.

---

## 4. Tanda 1: orden de producción

Las exam cards se listan en el orden de las escenas:
- V1: una por escena de s02 a s11.
- V2: de s01 a s05.
- V3: de s02 a s10.
- V4: de s02 a s07 y de s09 a s11.

1. **V1** sp4m7 rehecho. No tiene bloqueos de canon y es el segundo vídeo sobre esta tubería (el primero es el SIEM). Por eso la generalización de P2 va **antes de V1**.
2. **V2** sp4m11, cápsula. Valida el perfil corto.
3. **V3** s2m3 Diamond. Requiere antes la corrección de canon de GCTI (§6 P4).
4. **V4** s3m3 Pivoting. Continúa V3.

### V1 · sp4m7 · Principal · «Defensa en capas: del correo falso al equipo aislado»
- **Slug:** `capas-halden`.
- **Objetivo:** 4.5.
- **Duración:** escenas ~296 s; render ≈ 315 s.
- **Sustituye** al bloque EDR en `src/data/secplus/sp4-part4.ts:107-114`.
- **Inserción:** nueva posición justo antes del callout de examen (`:176`), después del check de DLP. El vídeo sintetiza toda la lección y la nota de examen la remata.
- **Qué añade:** hoy la lección es un catálogo de 5 párrafos. El vídeo sigue **un solo ataque capa por capa** y muestra qué control lo ve, cuál falla y por qué. Cubre lo que el EDR antiguo omitía:
  - orden de reglas e implicit deny;
  - IDS frente a IPS;
  - la cadena SPF, DKIM, DMARC;
  - DNS filtering;
  - FIM, DLP, NAC y UBA.
- **Canon Sec+:**
  - Lucía, de Operaciones, en la sala de control del muelle 3. Es la misma usuaria del vídeo EDR antiguo.
  - Tarde del 3-9-2026.
  - El portátil acaba aislado y encendido, y enlaza con la incautación de las 04:12 del 4-9 en sp4m11.
  - Una credencial de servicio robada antes del aislamiento queda como cabo suelto que conecta con el caso del SIEM (logon a las 01:52).
  - Dominio público propuesto: `haldenport.example`. Los typosquats ya existentes, `haldenp0rt.com` y `haldenp0rt-mail.com` (sp2), implican `haldenport` sin guion; el interno es `halden-port.local` (sp1m5). Dominio del atacante: `hdn-mailer.example`. Dominio de C2: `cdn-halden-sync.example`, registrado hace 2 días.
  - Estación de administración: `ADM-WS-02`.
  - **Comprobado:** la callout de sp4m6 (`sp4-part3.ts:448`) no da fecha ni nombre de estación, así que `ADM-WS-02` y el 3-9 no la contradicen. **Queda por verificar** el caso de sp4m10 antes de narrar.
  - Lucía solo existe hoy en el transcript del EDR que se retira; el texto de sp4m7 no la menciona. V1 añade una frase conectora a la lección, por ejemplo en el párrafo del endpoint (`:105`).

| Escena | Cap. | s | Qué se ve (visual y demo) | Qué se aprende · requiredCues |
|---|---|---|---|---|
| s01-hook «Un correo, siete controles» | I El ataque | 24 | Mapa de Halden; el correo entra y se iluminan las capas: correo, DNS, web, firewall, IDS/IPS, endpoint, datos | Un ataque atraviesa varios controles; cada uno responde una pregunta · `map, mail-in, layers, title` |
| s02-spoof «El correo que parecía de casa» | II El correo | 26 | **Demo:** bandeja de Lucía y panel de cabeceras `Authentication-Results: spf=pass smtp.mailfrom=hdn-mailer.example; dkim=pass d=hdn-mailer.example; dmarc=fail (p=NONE) header.from=haldenport.example` | Se pueden pasar SPF y DKIM con el dominio del atacante y mostrar el tuyo en el From · `inbox, headers, spf-pass, dkim-pass, dmarc-fail` |
| s03-dmarc «Tres mecanismos encadenados» | II | 30 | Cadena animada SPF (IP autorizada), DKIM (firma), DMARC (alineación, política, informes). **Demo:** `dig TXT _dmarc.haldenport.example` devuelve `v=DMARC1; p=none; rua=…` y la política se sube de none a quarantine y a reject | DMARC es el único que mira el From visible y dicta qué hacer; el gateway filtra contenido, no identidad · `spf, dkim, dmarc-align, policy, reports, reject` |
| s04-dns «DNS filtering» | III La red | 22 | Macro, PowerShell y resolución de `cdn-halden-sync.example` (dominio recién registrado): reputación y bloqueo antes de conectar. El malware recurre a una IP fija por 443 | DNS filtering corta antes de que exista la conexión; tiene límites · `open-doc, resolve, newly-registered, blocked, fallback-ip` |
| s05-rules «Orden de reglas e implicit deny» | III | 30 | **Demo:** tabla de reglas; el paquete baja de arriba abajo; la regla 3 `ALLOW any any tcp/443`, que sobró de una migración, gana antes que la regla 7, que lo habría bloqueado; al fondo, el implicit deny. Se corrige el orden y se añade un deny+log final | Gana la primera coincidencia; lo no permitido cae en el implicit deny; el deny explícito final sirve para tener log · `table, packet, first-match, shadowed, implicit, fix` · **think** |
| s06-ids «Detectó pero no bloqueó» | III | 24 | Sensor en un tap (copia del tráfico): la firma del beacon casa, salta la alerta y el paquete sigue. Contraste con un IPS en línea que lo descarta (riesgo de falso positivo). Firmas frente a anomalías | IDS fuera de línea frente a IPS en línea; lo nunca visto se detecta por tendencia o anomalía · `tap, sig-match, alert, passes, inline, anomaly` |
| s07-edr «El EDR ve el proceso» | IV El endpoint | 26 | **Demo:** consola EDR con el árbol `WINWORD.EXE`, `cmd.exe`, `powershell.exe -enc …` y la conexión 443; contexto de usuaria, hora, ruta y firma | Una alerta es sospecha, no prueba; el triaje pide contexto · `tree, child, encoded, conn, context` |
| s08-scope «Alcance: la flota y el XDR» | IV | 22 | Búsqueda del hash, el dominio y el patrón en los equipos incorporados: 2 aciertos más, uno de ellos `ADM-WS-02`. XDR une correo, DNS, firewall, IDS y endpoint en un único incidente | El alcance se determina antes de erradicar; XDR como correlación · `hunt, hits-2, adm-ws, xdr` |
| s09-isolate «Aislar sin apagar» | IV | 26 | Botón de aislamiento: solo queda el canal del EDR; memoria preservada; se registra motivo, hora y responsable | Aislar sin apagar: la RAM es evidencia · `isolate, edr-channel, ram, documented` |
| s10-data «Datos, dispositivos y personas» | V El resto del mapa | 26 | Cuatro viñetas: FIM (hash de referencia de configuración), DLP (contrato de practicaje hacia webmail personal), NAC (portátil de contratista en VLAN de cuarentena), UBA (descargas a las 03:00) | Cada pregunta tiene su capacidad · `fim, dlp, nac, uba` |
| s11-limits «Lo que no ven» | V | 20 | El EDR solo cubre equipos incorporados; DMARC no frena dominios parecidos (lookalikes); telnet, LDAP y SNMPv2c se sustituyen por su versión segura, no se restringen por IP | Límites y protocolos seguros · `unenrolled, lookalike, secure-proto` |
| s12-recap «Para el examen» | V | 20 | Frases del escenario asociadas a su capacidad, tarjeta final | Reflejos · `recap-map, recap-reflex, endcard` |

- **Exam cards** (objetivo 4.5), una por escena de s02 a s11:
  - «SPF y DKIM no bastan: DMARC exige alineación» (s02)
  - «DMARC p=none solo informa; p=reject bloquea» (s03)
  - «DNS filtering corta antes de conectar» (s04)
  - «Gana la primera regla; al final, implicit deny» (s05)
  - «IDS detecta sin bloquear; IPS va en línea» (s06)
  - «Malware a medida: comportamiento, no firmas» (s07)
  - «XDR une endpoint, correo, red e identidad» (s08)
  - «EDR aísla el equipo sin apagarlo» (s09)
  - «¿Quién cambió el archivo? FIM» (s10)
  - «Protocolo en claro: sustituir, no restringir» (s11)
- **Think prompts:**
  - «SPF y DKIM pasan. ¿Qué falló entonces?» (s02/s03)
  - «La regla 7 bloquea el C2. ¿Por qué pasó?» (s05)
- **Retirar con V1** (con confirmación):
  - `public/videos/edr-blue-team.*`
  - `public/videos/edr/voice/*.wav`: 4,3 MB que hoy se publican a los usuarios.
  - **HECHO (2026-09-28):** V1 publicado en YouTube (`GfjE0lP2H0s`) y enlazado en sp4m7 (PR #12). Lidia confirmó
    retirar `public/videos/edr-blue-team.*`. Los WAV ya no estaban en git (los ignora `.gitignore`) y se
    borraron en local.
- **No retirar con V1:** la carpeta `video/edr/` y sus scripts se quedan hasta P2. `generate-elevenlabs.mjs` se amplió hoy y puede ser la implementación de referencia de ElevenLabs.

### V2 · sp4m11 · Cápsula · «Adquisición forense: capturar sin contaminar»

> **PRODUCIDO 2026-09-25** (rama `video-forense-adquisicion`, sin commit). Se adelantó a V1 porque la cuota
> gratuita de ElevenLabs estaba agotada (9.963/10.000, renueva el 25-10): V1 habría sustituido un vídeo
> publicado con voz de ElevenLabs por uno con edge-tts, y además exige retirar assets con confirmación.
> Resultado: 2:52, 6 escenas, 5 exam cards, 1 think prompt, voz edge-tts Elvira (pasos para re-locutar en
> `video/forense-adquisicion/README.md`). La revisión de exactitud cambió el guion respecto a esta ficha:
> - las 04:12 son la incautación (el disco ya está precintado), no el momento del portátil encendido;
> - Operaciones podrá reinstalar, pero después de la captura;
> - el hold prevalece solo sobre los logs del caso;
> - el think prompt pasa a «Hash distinto. ¿Basta con firmar el formulario?»;
> - «inadmisible» se matiza a «puede hacerla inadmisible»;
> - el original se vuelve a precintar (0114);
> - la demo verifica el E01 con `ewfverify`, no con `sha256sum` sobre el contenedor.
- **Slug:** `forense-adquisicion`.
- **Objetivo:** 4.8.
- **Duración:** escenas ~162 s; render ≈ 180 s.
- **Inserción:** en `src/data/secplus/sp4-part6.ts`, después del check «hash no coincide» (~`:92`) y antes del encabezado «Fuentes de datos». Cierra la mitad de adquisición.
- **Qué añade:** convierte el formulario de custodia estático (`:50-73`) en un procedimiento ejecutado y enseña el caso de fallo. La mitad 4.9 (qué fuente responde) queda cubierta por la tabla y por spl4a Log Hunt, así que no entra en el vídeo.
- **Canon:** tal como está en la lección:
  - caso IR-2026-0147, evidencia HPA-EV-003;
  - SSD de 512 GB, S/N 8FQ2ZT3;
  - M. Aalto (incauta) y J. Rekola (testigo);
  - R. Sandoval (laboratorio), bloqueador WB-04;
  - `HPA-EV-003.E01`: 12 fragmentos, 476 GiB, hash `9f2b7c…41d0`;
  - precintos 0091 y 0114.

  Es el portátil que V1 dejó aislado.

| Escena | Cap. | s | Qué se ve | Qué se aprende · cues |
|---|---|---|---|---|
| s01-hold «Operaciones lo quiere esta noche» | I Antes de tocar | 24 | 04:12, portátil aislado y encendido; Operaciones pide reconstruirlo; llega el legal hold y la rotación de logs de 30 días se detiene | El hold nace cuando el litigio es previsible y prevalece sobre la retención · `laptop-on, rebuild, hold, retention-stop` |
| s02-volatility «Orden de volatilidad» | I | 28 | Pila animada: RAM/cache, estado de red, procesos/temporales, disco, logs remotos/backups, papel. El cursor sobre «apagar» borra las capas superiores | Memoria antes que disco; apagar destruye evidencia · `stack, ram-first, power-off, lost` |
| s03-image «Demo: imagen bit a bit» | II Adquirir | 38 | **Terminal:** se conecta WB-04; `sha256sum` del original; adquisición E01 sector a sector (incluye espacio no asignado); hash de la imagen: MATCH; nuevo hash del original: MATCH; se abre la copia de trabajo | Write blocker, hash antes y después, se analiza la copia · `blocker, hash-orig, acquire, hash-img, match, work-copy` |
| s04-mismatch «Cuando el hash no cuadra» | II | 22 | Misma ejecución con MISMATCH: imagen inválida, se repite y se documenta. Tachados «firmar el formulario» y «pasar a MD5» | Un hash distinto invalida la copia · `mismatch, invalid, repeat` · **think** |
| s05-custody «Cadena de custodia» | III Custodiar | 30 | La bolsa precintada pasa de mano en mano y las filas del formulario se rellenan. Contrafactual: una noche en un cajón abierto y la evidencia pasa a inadmisible aunque el hash coincida | El hash prueba los datos; la cadena prueba el objeto · `bag, rows, gap, inadmissible, hash-vs-chain` |
| s06-recap «Para el examen» | III | 20 | Cinco reflejos y tarjeta final | · `recap, endcard` |

- **Exam cards:**
  - «Legal hold: cuando el litigio es previsible»
  - «Memoria y cache antes que disco»
  - «Hash antes y después; se analiza la copia»
  - «Hash distinto: repetir la adquisición»
  - «Un hueco en la custodia la hace inadmisible»
- **Think prompt:** «El hash no coincide. ¿Vale si ambos firman?»
- **Comandos:** verosímiles (`sha256sum`, adquisición a E01), con salida ficticia coherente con el formulario de la lección.

### V3 · s2m3 · Principal · «El Diamond Model en acción: el evento E7»
- **Slug:** `diamond-e7`.
- **Duración:** escenas ~290 s; render ≈ 310 s.
- **Inserción:** en `src/data/s2.ts`, después del párrafo de tradecraft (~`:591`) y antes del callout de ejemplo y los checks, que preguntan precisamente por E7 y E9.
- **Qué añade:** hace ver el diamante *construyéndose* a partir de la telemetría cruda. Es la destreza que el lab2b (classify) no enseña: separar los campos y dejar un vértice en UNKNOWN con un plan de pivotes.
- **Canon, tras P4:**
  - E7 a las 02:13 UTC, `ENG-WS-041` de Meridian Dynamics.
  - Implante GLASS VIPER, named pipe `vc_pipe_%08x`.
  - `update-svc-cdn.com` en 185.220.x.x, hosting compartido con ~14.000 dominios.
  - Certificado autofirmado CN=updatesvc, visto en 2 IPs más.
  - WHOIS pendiente de `kazuo.tanji@`.

| Escena | Cap. | s | Qué se ve | Qué se aprende · cues |
|---|---|---|---|---|
| s01-hook «02:13 UTC, un beacon» | I Qué es | 24 | SOC de Meridian; beacon HTTPS desde ENG-WS-041; cuatro preguntas (quién, con qué, a través de qué, contra quién) | Un evento se descompone en cuatro preguntas · `alert, beacon, four-q, title` |
| s02-axiom «El axioma» | I | 24 | El diamante se dibuja vértice a vértice mientras se lee el axioma | Adversary, Capability, Infrastructure, Victim y sus aristas · `axiom, v-adv, v-cap, v-infra, v-vic` |
| s03-victim «Víctima y capability» | II Los cuatro vértices | 26 | **Demo:** líneas crudas de EDR; el analista arrastra el host a Victim y el SHA-256 y el named pipe a Capability | Clasificar la telemetría por vértice · `raw, drag-victim, drag-cap, pipe` |
| s04-infra «Infraestructura» | II | 24 | Dominio, IP y certificado entran en Infrastructure; tarjeta de trampa: «el implante es Capability» | Dominio, IP y servidor son Infrastructure · `domain, ip, cert, not-cap` |
| s05-adversary «UNKNOWN está bien» | II | 26 | Adversary queda en UNKNOWN con sus pivotes pendientes; se separan operator (teclea) y customer (encarga) | Saber qué falta; operator frente a customer · `unknown, pending, operator, customer` · **think** |
| s06-meta «Meta-features» | III Meta-features y ejes | 26 | **Demo:** la ficha E7 se rellena campo a campo: timestamp, fase KC, resultado, dirección, metodología, recursos | Qué son las meta-features · `ts, phase, result, direction, method, resources` |
| s07-axes «Dos ejes» | III | 24 | Eje socio-político (Adversary y Victim: por qué Meridian, la IP de propulsión) frente a eje tecnológico (Capability e Infrastructure) | Los dos ejes · `axis-sp, why-meridian, axis-tech` |
| s08-pivot «Pivotar entre vértices» | IV Pivotar | 26 | Bucle animado: de los logs a la muestra, al C2 hardcodeado, a otras muestras, a un desliz del registrante; el grafo crece | Cada vértice conocido descubre otros · `loop, v2c, c2i, i2c, i2a` |
| s09-quality «No todos los pivotes valen igual» | IV | 26 | Contador de inquilinos de la IP (~14.000: ruido) frente al certificado autofirmado reutilizado (oro); WHOIS pendiente | Recurso dedicado frente a compartido · `tenants, noise, cert-reuse, whois-pending` · **think** |
| s10-thread «De evento a hilo» | IV | 22 | Llega E9, dos días después, en fase Actions on Objectives; los eventos se ordenan y forman un activity thread (puente a s2m4) | Evento frente a hilo · `e9, chrono, thread` |
| s11-limits «Lo que el diamante no hace» | V Límites y examen | 20 | No atribuye por sí solo; un evento no es una campaña; su valor es el plan de pivotes | Límites · `no-attrib, one-event, plan` |
| s12-recap «Para el examen» | V | 22 | Reflejos y tarjeta final que lleva a la lección de infraestructura | · `recap, endcard` |

- **Exam cards:**
  - «Vértices: Adversary, Capability, Infrastructure, Victim»
  - «Loader, exploit o técnica: Capability»
  - «Dominio, IP y servidor C2: Infrastructure»
  - «Operator teclea; customer encarga y se beneficia»
  - «Meta-features: hora, fase, resultado, dirección»
  - «Eje socio-político: Adversary y Victim»
  - «Cada vértice conocido descubre los demás»
  - «Cert autofirmado reutilizado: pivote de oro»
  - «Eventos ordenados en el tiempo: activity thread»
- **Think prompts:**
  - «¿Rellenas Adversary con lo que sospechas?» (s05)
  - «¿Pivotas por la IP o por el certificado?» (s09)

### V4 · s3m3 · Principal · «Pivotar por la infraestructura: pDNS, WHOIS y certificados»

> **Producido el 2026-09-28 con «Narración hablada» (§1)**, que recortó este brief: 11 escenas, 7 tarjetas y 5
> conceptos clave (sin la escena del presupuesto del Lab 3A; lote y bloqueo previo en dos escenas). La versión
> vigente es `video/pivot-infra/storyboard.json`; qué se quedó fuera, en `video/pivot-infra/out/script-notes.md`.
> La tabla de abajo es el brief original.

- **Slug:** `pivot-infra`.
- **Duración:** escenas ~294 s; render ≈ 314 s.
- **Inserción:** en `src/data/s3.ts`, después del check de los 14.000 dominios (~`:627`) y antes del callout de campaña del Lab 3A. El orden queda vídeo, laboratorio.
- **Qué añade:** s3m3 es la lección más delgada de S3: 9 bloques, sin ninguna salida de consulta, y la cadena de pivotes vive en un solo callout. Este es el vídeo con más hueco que llenar de todo el curso.
- **Regla anti-spoiler de Lab 3A:**
  - El vídeo parte del C2 ya conocido (`update-svc-cdn.com`, que aparece en S2) y enseña los tres tipos de pivote y dos trampas.
  - Llega a `141.98.6.10` y a `meridian-sso-portal.com`, ambos ya visibles en s1m1.
  - Muestra **difuminados** los demás vecinos: nunca revela `velvet-house-trading.com`, `stellardyn-vpn.net` ni `meridian-hr-portal.com`.

| Escena | Cap. | s | Qué se ve | Qué se aprende · cues |
|---|---|---|---|---|
| s01-hook «El vértice más expuesto» | I Por qué la infraestructura | 24 | Los pivotes pendientes de E7; el actor registra, alquila y sirve certificados, y todo deja registro | La infraestructura es pública o semipública · `e7-pending, register, rent, serve, records` |
| s02-sources «Tres fuentes, tres preguntas» | I | 26 | Tres tarjetas: pDNS, WHOIS, TLS/CT, cada una con su pregunta | Qué responde cada fuente · `pdns, whois, tls, ct` |
| s03-pdns «Demo: passive DNS» | II Las tres fuentes | 28 | **Consola:** `pdns lookup update-svc-cdn.com` muestra el historial first/last seen en 185.220.x.x; `pdns ip 185.220.x.x` hace subir el contador a 14.000 y aparece un sello de STOP | Resolución histórica e inversa; el ruido · `q-domain, history, q-ip, count-14000, stop` · **think** |
| s04-cert «Demo: el certificado» | II | 30 | **Consola:** búsqueda de la huella en datos de escaneo de Internet: 185.220.x.x, 141.98.6.10 y una tercera difuminada. `pdns ip 141.98.6.10` devuelve pocos inquilinos: `meridian-sso-portal.com` y dos difuminados «(Lab 3A)» | El C2 y el phishing comparten certificado; un recurso dedicado discrimina · `fp, scan, hits, dedicated, phish-link, redacted` |
| s05-whois «Demo: WHOIS histórico» | II | 28 | WHOIS actual REDACTED; histórico de 2025 con `kazuo.tanji@protonmail.com`; patrón de registro (registrar, NS y fecha en lote) | La privacidad no cierra la investigación · `redacted, history, email, pattern` |
| s06-ct «Certificate Transparency» | II | 20 | Flujo de CT: certificado recién emitido para un subdominio lookalike; las CA gratuitas masivas solo pivotan por la huella exacta | Descubrir infraestructura mientras se monta · `ct-stream, new-sub, free-ca` |
| s07-noise «¿Cuántos inquilinos?» | III El ruido | 26 | Filtro animado: hosting compartido, IP de CDN, `ns1.cheap-registrar-dns.com`, sinkhole y CA masiva caen a «compartido»; VPS propio, certificado autofirmado y email de registro quedan como «dedicado» | La regla del pivoteo · `q-tenants, shared, cdn, ns, sinkhole, dedicated` |
| s08-budget «Cada consulta cuesta» | III | 22 | Dos grafos: el disciplinado (pocas consultas, activos encontrados) y el ahogado (miles de nodos grises) | La mecánica del Lab 3A · `budget, disciplined, drowning` |
| s09-lifecycle «Ciclo de vida de un dominio» | IV Ciclo de vida | 26 | Línea temporal: registro en lote, aparcado/envejecido, activación, uso, quemado, abandono o reventa | Ciclo de vida · `batch, parked, active, use, burned, resale` · **think** |
| s10-proactive «Bloquear antes del primer uso» | IV | 20 | El patrón de lote delata dominios hermanos, que se bloquean antes de la entrega (Deny en la matriz de CoA, s2m2) | Defensa proactiva · `batch-detect, pre-block, coa-deny` |
| s11-opsec «Pasivo primero» | V OPSEC y examen | 22 | pDNS, WHOIS y CT no tocan al actor; visitar o escanear su servidor le alerta; managed attribution (s3m4) | OPSEC · `passive, active-risk, managed` |
| s12-recap «Para el examen» | V | 22 | Reflejos y tarjeta final «Ahora te toca: Lab 3A» | · `recap, lab3a, endcard` |

- **Exam cards:**
  - «Passive DNS: a qué resolvió y quién más comparte IP»
  - «IP con miles de dominios: pivote ruidoso»
  - «Recurso dedicado discrimina; compartido contamina»
  - «WHOIS con privacidad: histórico y patrones»
  - «CT logs: cada certificado emitido es público»
  - «IP de CDN: es del proveedor, no del actor»
  - «Dominios dormidos envejecen para evadir reputación»
  - «Detectar el lote permite bloquear antes»
  - «Pivoteo pasivo: el actor no te ve»
- **Think prompts:**
  - «14.000 dominios en la IP. ¿Sigues por ahí?» (s03)
  - «¿Puedes bloquear un dominio antes de usarse?» (s09)
- **Opcional:** añadir a s3m3 un bloque `code` con las mismas salidas de consola, como material de lectura.

---

## 5. Tandas 2 y 3 (esbozo; cada vídeo recibirá su brief al abrir su tanda)

**Tanda 2** (3 principales + 3 cápsulas, 3 Sec+ / 3 GCTI):
- **sp4m10 IR (Principal): abierta el 2026-09-30 como V5, ficha completa abajo.** Lidia eligió partirla en dos
  para no pasar de 4 conceptos: V5 cuenta el proceso (fases, contención, vuelta y revisión final) y el resto va a
  una cápsula aparte.
- **sp4m10 V5b (Cápsula): publicada el 2026-10-01 (YouTube `vlJ9FRtSIlM`), ficha completa abajo.** Tabletop frente a simulation y threat
  hunting, la otra mitad de la lección que V5 dejó fuera.
- **sp4m8 IAM (Principal): V6, publicada el 2026-10-03 (YouTube `It1DrWKbFe4`), ficha completa abajo.** Identidad y acceso en
  Halden del 19 al 28-10: altas, cambios y bajas, SAML, OAuth, MFA y la bóveda de cuentas de servicio.
- **s2m5 ATT&CK + Pyramid (Cápsula): V7, publicada el 2026-10-03 (YouTube `XCOAc7tlPTE`), ficha completa abajo.** El árbol de procesos del
  2-3 en ATT&CK y en la pirámide, con los dos hashes del loader como prueba de su base.
- **s3m5 STIX (Cápsula): V8, publicada el 2026-10-04 (YouTube `KO4REQeaKgM`), ficha completa abajo.** El aviso caducado del ISAC:
  no se bloquea, se busca hacia atrás; el grafo y «STIX describe, TAXII transporta».
- **s4m3 ACH (Principal): V9, publicada el 2026-10-04 (YouTube `TjVViiBTeds`), ficha completa abajo.** La matriz del extracto de la
  lección, celda a celda, con supuestos clave, diagnosticidad y sensibilidad; primera aparición de PAPER CRANE.
- **sp2m7 (Cápsula) «Ataques en los logs»: V10, publicada el 2026-10-05 (YouTube `uHHv-1hTYTE`, la primera subida por la
  API, con `youtube-upload.mjs`), ficha completa abajo.** La noche
  del 20 al 21-10: spraying, traversal y amplificación DNS; primera aparición de RED MARROW.

**Orden propuesto para el resto de la tanda 2** (2026-10-01, pendiente de Lidia): V5b, V6, V7, V8, V9 y V10.
- V6 sigue la historia de Halden justo después de V5b.
- Las tres de GCTI van en el orden del curso (S2, S3, S4), así cada una puede remitir a la anterior.
- V10 va al final: necesita la voz nueva de RED MARROW y un cambio en su lección (fecha e IP).
- Grabación por parejas, un principal y una cápsula por sesión: V6 con V7, V9 con V8, y V10 con el primero de la tanda 3.
- Trabajo de motor antes de renderizar V9: un efecto nuevo para las voces de PAPER CRANE (V9) y RED MARROW (V10), porque
  `adversary_fx.py` solo tiene `machine`, el de los otros tres adversarios. **Para V9 no hace falta** (2026-10-04):
  Lidia eligió `machine` con otra voz, `sapi/Microsoft Laura`.
- Las decisiones de cada ficha, para aprobarlas en una ronda, y los cambios que proponen a las lecciones y a los
  registros de canon: `docs/reviews/2026-10-01-fichas-tanda2/decisiones.md`. Las fichas pasaron una revisión de
  exactitud y canon por campaña y la comprobación de límites del validador; ninguna tiene guion todavía.

### V5 · sp4m10 · Principal · «Respuesta a incidentes: la mañana después»

> Diseñado con Lidia el 2026-09-30 (rama `video-ir-halden`, que sale de `video-pivot-infra`). La versión vigente
> de escenas y guion es `video/ir-halden/storyboard.json` + `narration.json`; qué se quedó fuera, en
> `video/ir-halden/out/script-notes.md`.
>
> **Producido y publicado el 2026-10-01**: YouTube `S_nVqWYkKXM`, 8:19, 10 escenas, 7 tarjetas, 2 preguntas, 3
> mensajes de SILENT PAGER, voz de Lidia (2 frases regrabadas y 4 recortadas de sus propias tomas), música de V4,
> −14,1 LUFS. En la lección sp4m10, tras la tabla de fases. El canon cambió dos veces después de las revisiones, por
> los datos en pantalla del SIEM (la 01:52 desde `ADM-WS-07`, triaje por la mañana) y de V1 (alerta a las 16:04,
> aislamiento a las 16:11): lo que vale es el «Canon nuevo» de abajo y `docs/superpowers/canon/glass-harbor.md`.

- **Carpeta:** `ir-halden` · perfil `principal-yt` · objetivo 4.8 · adversario SILENT PAGER · voz `recording/lidia`
  (tempo 1,08 y pausas de 250 ms, provisionales como en V4).
- **Duración:** Lidia permite hasta 10 minutos; el guion revisado estima ~9:28. No se rellena.
- **Inserción:** en `src/data/secplus/sp4-part5.ts`, justo después de la tabla «Fase / Objetivo / Error clásico» y
  antes del apartado «Entrenamiento y pruebas», como bloque `youtube`.
- **Enfoque («la mañana después»):** 4-9 a mediodía (12:00), sala de crisis. La pizarra del caso IR-2026-0147 tiene siete
  columnas con una casilla cada una. Las fases que ya pasaron en V1, el SIEM y V2 se repasan con una sola pregunta:
  ¿se podía marcar esa casilla? Así aparece el error central: la contención se dio por cerrada con dos equipos de
  tres, y el que quedó abierto era la estación de administración, «donde viven las llaves». SILENT PAGER propone los atajos en sus mensajes y la narradora
  enseña qué se rompería con cada uno. El orden de las fases no se recita: va en pantalla, porque ya lo practica
  spl4b.

**Conceptos (4) y su imagen:**

| # | Concepto | Imagen que se mantiene | Tarjetas |
|---|---|---|---|
| 1 | Una fase se cierra cuando cumple su condición, no cuando lo parece. Detectar es declarar: caso, hora y gravedad | La pizarra con una casilla por columna | «Detectar es declarar: caso, hora y gravedad» |
| 2 | Contener es cerrarlo todo, equipos y cuentas, antes de limpiar. Se aísla encendido y se anulan credenciales y sesiones | Dos naves del puerto con candado y abierta la tercera, la que guarda las llaves maestras | «Contener: aislar sin apagar y anular credenciales» · «Primero contener; después erradicar y recuperar» |
| 3 | Limpiar a fondo (persistencia y agujero, comprobado en todos los equipos) y volver desde una copia anterior al primer compromiso confirmado | La misma nave: revisar cada rincón y tapiar la ventana. La foto hecha con la intrusa ya dentro | «Erradicar: malware, persistencia y el agujero» · «Copia de antes del compromiso, y verificada» |
| 4 | En la revisión final se buscan causas, no culpables, y cada mejora lleva responsable y fecha | La gotera: fregar el suelo frente a arreglar el tejado | «Lecciones aprendidas: causas, no culpables» · «Sin responsable ni fecha, la mejora no existe» |

**Escenas:** diez, en cinco capítulos (La mañana después · Contener de verdad · Limpiar y volver · Aprender · Para el
examen). Pregunta para pensar en s03 («Dos equipos aislados. ¿Contención cerrada?») y en s07 («Copia de las 23:00,
antes de la alerta. ¿Vale?»). Mensajes de SILENT PAGER en s05 (formatear ya), s06 (nos vemos el jueves) y s08
(despide a Lucía). Cierre con tres reglas y una sola tarea: el laboratorio spl4b, más un gancho a V5b.

**Canon nuevo que fija V5** (nada de esto estaba en los datos del curso; lo posterior debe respetarlo):
- IR-2026-0147 se declara el 2026-09-03 a las 16:09 CEST, con gravedad alta (V1 fija en pantalla la alerta del
  EDR a las 16:04 y el aislamiento del portátil de Lucía a las 16:11).
- 16:11 y 16:15: el EDR aísla, encendidos, `OPS-WS-14` (portátil de Lucía) y `OPS-WS-08`, y se marca la contención.
  `ADM-WS-02` se queda sin aislar: su responsable no estaba localizable y nadie de guardia tenía autoridad para
  aislar una estación de administración (el plan no tenía suplentes). Ese día nadie sabía aún que la credencial de
  servicio había salido (V1), así que el alcance del 3-9 son tres equipos y ninguna cuenta.
- **Datos del SIEM que manda en pantalla** (`video/siem/src/data/s09-pivot.ts` y `S10Contain.tsx`, ya publicados):
  la 01:52 es un logon 4624 de `svc_tosreport` desde `ADM-WS-07` (10.20.4.17) en `srv-tc-app03`; la salida de
  38 GB a 203.0.113.47 va de 02:00 a 04:30 y **termina sola**; el mapa UBA de `svc_tosreport` no tiene más
  actividad fuera de horario que esa 01:52; el triaje es por la mañana del 4-9 y la cuarentena (sin apagar) y el
  cambio de contraseña llegan después, con una sesión aún abierta.
- 21:14 del 3-9: desde `ADM-WS-02`, que sigue abierta, la atacante abre una sesión remota hacia `ADM-WS-07`, una
  estación de administración **sin agente EDR** (por eso la búsqueda de V1 no la vio; V1 s11: «uno sin agente, para
  él, no existe»). No usa `svc_tosreport` (el mapa UBA no lo permite). Lo descubre el análisis la mañana del 4-9.
- 01:58, dentro de la sesión de la 01:52: tarea programada en `srv-tc-app03` que arranca el programa cada jueves por
  la noche; otra igual en `ADM-WS-07`.
- 10:30 del 4-9, después del triaje del SIEM: se cierra todo de golpe. `ADM-WS-02` y `ADM-WS-07` aisladas,
  `srv-tc-app03` en cuarentena y la contraseña de `svc_tosreport` cambiada. Los datos ya se habían ido. La sala de
  crisis de V5 es a mediodía (12:00).
- Erradicación: fuera las tareas programadas, retirado el permiso de macros de Operaciones y confirmada la regla 3
  del cortafuegos (ya corregida en V1). La búsqueda de V1 más la tarea, repetida en todos los equipos (también los
  que no tenían agente, `ADM-WS-07` ya con él), da cero resultados.
- Copias de `srv-tc-app03`, cada noche a las 23:00. La del 3-9 se descarta: se hizo con la atacante ya dentro del
  puerto (el incidente empieza el 3-9 por la tarde, con el correo de Lucía), aunque sea anterior a la alerta. Se
  restaura la del 2-9, de antes de todo el incidente, con su integridad comprobada y el visto bueno de Operaciones.
  Vuelve con vigilancia reforzada 30 días.
- Revisión final el 2026-09-11, con dos hilos de «¿por qué?»: la macro se ejecutó por una excepción de Operaciones de
  hace dos años que nunca caducaba (el ejemplo de la propia lección: ya retirada, la causa de fondo es que las
  excepciones no caducan), y la atacante siguió dentro horas porque la contención se cerró con dos equipos de tres,
  ya que faltaban suplentes (un hueco de la preparación). Mejoras con responsable y fecha: suplentes con autoridad
  para aislar (Seguridad, 30-9), las excepciones caducan solas (Sistemas, 18-9), cuentas de servicio en un gestor de
  contraseñas con rotación (Sistemas, 31-10), DMARC en reject (Correo, 25-9) y alerta de logon de cuentas de
  servicio desde estaciones (SOC, 25-9), más agente de seguridad en todas las estaciones de administración
  (Sistemas, 15-10).
- **No se toca:** la pista del ASN de NULL CIPHER ni «GH es una sola operación» (dosier del jefe de sp4). No se culpa
  a nadie, ni a Lucía ni al turno de noche.

### V5b · sp4m10 · Cápsula · «Antes del próximo incidente: tabletop, simulation y threat hunting»

> Diseñado con Lidia el 2026-10-01 (rama `video-ir-halden-pruebas`, desde `main` con V4 y V5 ya fusionados). La
> versión vigente de escenas y guion es `video/ir-halden-pruebas/storyboard.json` + `narration.json`; qué se quedó
> fuera, en `video/ir-halden-pruebas/out/script-notes.md`.
>
> **Producido y publicado el 2026-10-01**: YouTube `vlJ9FRtSIlM`, 3:35, 6 escenas, 4 tarjetas, 1 pregunta, 1 mensaje de
> SILENT PAGER, voz de Lidia en una sola toma (s04-03 recortada de sus propias tomas: arrastraba un «Pues… digo…»), música
> de V4 y V5, −14,1 LUFS. En la lección sp4m10, tras el check de threat hunting. Dos frases dicen lo que se grabó: «un plan
> contra incidentes» y «el atacante» (decisión de Lidia; la serie sigue con «la atacante»). El canon que vale es el de abajo
> y `docs/superpowers/canon/glass-harbor.md`.
>
> **Dos ajustes sobre el diseño aprobado**, porque el validador los rechazaría:
> - Cuatro tarjetas en cinco escenas obligaban a poner dos en la misma, y `analyzeNarration` admite una por escena y
>   ninguna en el cierre. «Salir a buscar» se parte en dos escenas: la caza y lo que deja. Son seis en total, dentro de
>   las 5–6 de una cápsula, y los tres capítulos no cambian.
> - La pregunta para pensar tenía 49 caracteres (máximo 48): pasa a «Sin tocar producción, barato: ¿mesa o simulacro?».

- **Carpeta:** `ir-halden-pruebas` · perfil `capsula-yt` (190–260 s renderizados; objetivo ~3:30–4:00, sin rellenar) ·
  objetivo 4.8 · adversario SILENT PAGER, un mensaje interceptado, con la voz de V5 · voz `recording/lidia` con
  `"recording": { "tempo": 1.08, "maxPauseMs": 250 }` · música de V4 y V5 (`Go On Going - Stayloose.mp3`).
- **Inserción:** en `src/data/secplus/sp4-part5.ts`, lección sp4m10, después del check de threat hunting y antes del
  párrafo final («Ya sabes conducir el incidente…»), como bloque `youtube`. Se fija en la suite `lesson videos` de
  `src/data/content.test.ts`.
- **Enfoque («¿funciona el plan nuevo?»):** V5 acabó con esa pregunta. Las mejoras de la reunión del 11-9 ya están en
  marcha, entre ellas los suplentes con autoridad para aislar. El vídeo prueba el plan de dos maneras (hablando y de
  verdad) y después sale a buscar sin que haya saltado ninguna alarma. Una frase de puente resume V5 para quien no lo
  vio: en septiembre la atacante siguió dentro horas porque nadie de guardia podía aislar un equipo.

**Conceptos (2) y su imagen:**

| # | Concepto | Imagen que se mantiene | Tarjetas |
|---|---|---|---|
| 1 | La mesa (tabletop exercise) es una conversación: roles, quién decide, a quién se llama; no toca ningún sistema y es barata. El simulacro (simulation) se ejecuta de verdad: herramientas, permisos y tiempos reales; cuesta y puede afectar a la operación | Un ensayo con el guion en la mano frente a un simulacro de incendio | «Tabletop: se habla, no se toca nada» · «Simulation: se ejecuta de verdad, con coste» |
| 2 | Threat hunting: salir a buscar sin alerta, desde una hipótesis. Encuentre o no a alguien, deja reglas de detección nuevas y enseña dónde falta visibilidad | Buscar una fuga de agua con el contador, antes de que salga la mancha: cierras los grifos y miras si sigue girando. Un servidor que no manda registros es un grifo que no pasa por el contador | «Hunting: hipótesis y ninguna alerta previa» · «Cada caza deja reglas nuevas y huecos a la vista» |

**Escenas:** seis, en tres capítulos (Probar el plan · Salir a buscar · Para el examen).

| Escena | Cap. | s | Qué se ve | Qué se aprende · cues |
|---|---|---|---|---|
| s01-hook «¿Funciona el plan nuevo?» | I Probar el plan | 26 | La lista de mejoras del 11-9 (la de V5 s09) con «suplentes con permiso para aislar · Seguridad · 30-09» resaltada y un sello «¿funciona?»; título; dos iconos (mesa y simulacro) y una lupa; el puente, en una tira: «3-9 · `ADM-WS-02` sin aislar · nadie de guardia podía autorizarlo» | La promesa en los primeros 10 s y el puente con V5 · `plan, title, promise, bridge` |
| s02-mesa «Ensayo en la sala» | I | 50 | Las dos maneras, a la par: la mesa con el guion en la mano y el simulacro de incendio. Pregunta para pensar. Se ilumina la mesa: «se habla · no se toca ningún sistema · barato» y el nombre TABLETOP EXERCISE. La mesa del 2-10 en la sala de crisis, seis áreas; la tarjeta del caso: «03:00 · se ha caído el correo · ¿a quién llamas?»; «a la suplente de Seguridad»; su teléfono, dentro del buzón, que se apaga; la lista sale a papel y al móvil de guardia | La mesa prueba roles y llamadas sin tocar nada · `two-ways, fire, table, tabletop, room, gap, fix` · **think** |
| s03-simulacro «Probarlo de verdad» | I | 50 | El bocadillo de la mesa «aislar es cosa mía» con un «¿seguro?». El simulacro del 8-10 a las 22:00 en la VLAN de pruebas (`ptl-pruebas-02`), cronómetro en marcha; llaman a la suplente; la suplente pulsa «Aislar equipo» y la consola responde «Acción no permitida · tu rol no incluye aislar equipos»; dos filas separan el plan (ella puede aislar) de su cuenta (no puede); lo hace la analista de guardia por orden de la suplente; el cronómetro para en «11 min» (22:11; nunca «11:00», que se leería como una hora). Barra de comparación: «simulacro · 11 min» frente a «septiembre · `ADM-WS-02` · más de 18 h hasta aislarla». Mejora: «permiso de aislar en la cuenta de la suplente · Seguridad · 09-10». Nombre SIMULATION y su coste en tres chips, sin sugerir una parada de producción. Cierre en dos columnas: la mesa, lo que se dice; el simulacro, lo que se hace | El simulacro prueba herramientas, permisos y tiempos, y cuesta · `words, night, denied, eleven, real, cost, both` |
| s04-caza «Salir a buscar» | II Salir a buscar | 38 | Mensaje interceptado. La fuga: una casa con los grifos cerrados, sin mancha en el techo y el contador girando. La hipótesis: «si vuelve, se moverá como la otra vez: de madrugada, con una cuenta de servicio» (no «entrará»: en septiembre entró por el correo de Lucía), con la referencia «4-9 · 01:52 · `svc_tosreport` desde `ADM-WS-07`». La consulta: «13-10 · 30 días (13-09 a 13-10) · logons de cuentas de servicio · 00:00–06:00 · desde cualquier equipo (estaciones y servidores)», con «alertas para esta hipótesis: 0» y la regla del SOC del 25-09 sin disparos. Nombre THREAT HUNTING | Salir a buscar sin alerta, desde una hipótesis · `calm, meter, hypothesis, hunt, hunting` · **intercept** |
| s05-huecos «Lo que deja la caza» | II | 36 | Resultado: histograma por horas, todo gris («tareas conocidas, a su hora»), «sin explicar: 0». Mapa de cobertura: 24 servidores, 22 encendidos y 2 apagados, `srv-bascula01` (báscula de camiones) y `srv-accesos01` (control de accesos de la puerta de camiones), «0 registros · nunca conectados»; «ni bueno ni malo: no se ven» (no «limpios»: V5 s06 ya dice que la búsqueda en todos los equipos «sale limpia», con otra telemetría). Dos mejoras: «conectar `srv-bascula01` y `srv-accesos01` a la central · Sistemas · 16-10» y «regla: cuenta de servicio fuera de su horario, desde cualquier equipo · SOC · 15-10» | Una caza nunca vuelve de vacío: reglas nuevas y huecos a la vista · `result, dark, unknown, rule, never-empty` |
| s06-recap «Tres reglas» | III Para el examen | 26 | Tres tarjetas de reglas; tarjeta final Alertópolis: «Ahora te toca: las preguntas de la lección» (sp4m10, 8 preguntas) | Reflejos · `recap, rule-1, rule-2, rule-3, next, endcard` |

- **Exam cards** (objetivo 4.8), una por escena de s02 a s05:
  - «Tabletop: se habla, no se toca nada» (s02)
  - «Simulation: se ejecuta de verdad, con coste» (s03)
  - «Hunting: hipótesis y ninguna alerta previa» (s04)
  - «Cada caza deja reglas nuevas y huecos a la vista» (s05)
- **Think prompt:** «Sin tocar producción, barato: ¿mesa o simulacro?» (s02).
- **Mensaje interceptado** (s04): «Sin alarma no hay nada que buscar. Duerme tranquila.» El error concreto que la
  narradora corrige: que no suene nada no quiere decir que no haya nadie.
- **Cierre:** tres reglas (mesa para quién decide y a quién se llama, simulacro para herramientas, permisos y tiempos;
  si ya hay una alerta, no es hunting; ninguna caza vuelve de vacío) y una sola tarea: las preguntas de la lección.

**Canon nuevo que fija V5b** (nada de esto estaba en los datos del curso; lo posterior debe respetarlo):
- **2026-10-02 (viernes), 09:30, sala de crisis: la mesa.** Seis áreas (Seguridad, Sistemas, Operaciones,
  Comunicación, Dirección y Asesoría jurídica). Caso: a las 03:00 se cae el correo corporativo. «¿A quién llamas?»: a
  la suplente de Seguridad, pero su teléfono solo está en la lista de contactos del plan, que vive en el correo
  corporativo. Mejora: una copia de la lista fuera de banda (en papel en la sala y en el móvil de guardia), Seguridad,
  05-10 («tres días después», en voz). Es el ejemplo de la propia lección (`sp4-part5.ts:277`).
- **2026-10-08 (jueves), 22:00–22:11: el simulacro.** El turno de guardia del SOC simula un ataque en un equipo de
  pruebas (`ptl-pruebas-02`, el portátil de pruebas del SIEM, en la VLAN de pruebas) y llama a la suplente de
  Seguridad, sin nombre. Ella pulsa «Aislar equipo» y la consola del EDR dice que no: el plan le da la autoridad (la
  mejora de Seguridad del 30-09 está cumplida), pero a su cuenta de la consola le falta el permiso de aislar equipos.
  Lo ejecuta la analista de guardia por orden de la suplente. Así se sostienen a la vez los dos hechos del diseño
  (ella aísla; a su cuenta le falta un permiso): la autoridad es suya y el botón, de la analista. El equipo queda
  aislado a las 22:11, a los 11 minutos (en pantalla, «11 min», nunca «11:00»). Un EDR aísla equipos, no redes: la
  voz dice «equipo». Comparación: `ADM-WS-02` estuvo abierta del 3-9 a las 16:15 al 4-9 a las 10:30, unas 18 h
  (deducido del registro). Mejora: permiso de aislar en la cuenta de la suplente, Seguridad, 09-10. Que el 8-10 sea
  jueves, la noche de la tarea programada ya borrada (V5 s06), es casualidad: no se dice ni se insinúa nada.
- **2026-10-13 (martes): la caza.** Hipótesis tomada de lo que enseñó el incidente (el logon de `svc_tosreport` a la
  01:52 desde una estación de administración), no del dosier del jefe de sp4: si vuelve, se moverá como la otra vez, de
  madrugada y con una cuenta de servicio (no «entrará»: en septiembre entró por el correo de Lucía, V5 s07). Consulta: logons de cuentas de servicio entre las 00:00 y las 06:00, desde cualquier equipo,
  en los 30 días que guarda la central (13-09 a 13-10). La ventana deja fuera la noche del 4-9 a propósito, para que
  la caza no «encuentre» el caso conocido; y es más amplia que la alerta del SOC del 25-9, que solo mira logons desde
  estaciones. Resultado: ningún rastro de la atacante; todo lo que entra de madrugada son tareas conocidas, a su hora.
  Pero dos servidores **nunca se conectaron** a la central y no han mandado ni un registro: `srv-bascula01` (báscula de
  camiones) y `srv-accesos01` (control de accesos de la puerta de camiones), dos nombres nuevos porque todos los
  servidores neutros del registro ya salen enviando registros en el SIEM. Son 24 servidores en total, 22 con
  registros. Mejoras: conectarlos a la central (Sistemas, 16-10) y convertir la búsqueda en regla, «cuenta de
  servicio fuera de su horario, desde cualquier equipo» (SOC, 15-10).
- **No se toca:** el dosier del jefe de sp4 (el ASN de NULL CIPHER, «GH es una sola operación»), ni la ruta de salida
  de los 38 GB, que sigue siendo un hueco abierto: los dos servidores sin registros no tienen nada que ver con ella y
  el vídeo no los relaciona. No se dice quién instaló esos servidores (los contratistas de fondo siguen neutros).
  «Nunca se conectaron», no «dejaron de enviar»: la lección sp2 ya tiene un servidor de facturación que deja de enviar
  logs (`sp2-part3.ts:441`), y no es este caso. No se culpa a nadie: ni a la suplente por el permiso ni a Sistemas por
  los servidores.


### V6 · sp4m8 · Principal · «Identidad y acceso: quién entra y hasta dónde»

> Abierta el 2026-10-03 (rama `video-iam-halden`, desde `main` con V7 ya fusionado) con las opciones recomendadas de
> la ronda de diseño del 2-10, que quedó sin respuesta; Lidia pidió seguir con el vídeo más prioritario. **Aprobada por
> Lidia el 2026-10-03**, con el guion ya revisado, y congelada ese día. La versión vigente de escenas y guion es
> `video/iam-halden/storyboard.json` + `narration.json`; qué se quedó fuera, en `video/iam-halden/out/script-notes.md`.
>
> **Producido y publicado el 2026-10-03**: YouTube `It1DrWKbFe4`, 9:17, 11 escenas, 8 tarjetas, 2 preguntas, 3 mensajes
> de SILENT PAGER con la voz de V1 y V5, voz de Lidia (s10-02 regrabada: la primera toma decía «el privilegio se pierde»),
> música de V4, −14,1 LUFS. La grabación quedó al 93 % del estimado, como V7. En la lección sp4m8, entre el check de MFA
> y la nota de examen, con una frase de entrada. Dos frases dicen lo que se grabó: s10-01 «Al atacante» (decisión de
> Lidia, como el «el atacante» de V5b) y, en s08-03, Whisper oye «No se rompe nada, te agotas» donde el guion dice «No
> rompe nada, te agota» (se deja). El canon nuevo está en `docs/superpowers/canon/glass-harbor.md`. La regrabación de
> s10-02 se importó con `--match` y en el vídeo publicado queda ~1,4 dB más baja que sus vecinas (con `--lufs` habría
> quedado entre ellas); YouTube no deja cambiar el archivo, así que el repo conserva el clip publicado.
>
> **Ajustes al abrirla** (el guion ya los lleva; la tabla de escenas de abajo es la ficha original):
> - Duración: 520 s de escenas a 2,7 palabras/s darían ~1.400 palabras y unos 620 s estimados, por encima del techo de
>   600. El guion se escribe al ~95 % de cada presupuesto (~1.330 palabras, estimado ≤ 600 s); con el ritmo real de
>   Lidia (85–93 % del estimado) saldrá entre 8:30 y 9:15.
> - Cada tarjeta espera al final de su frase y necesita ~5 s de escena detrás, así que se nombra antes de la última
>   frase de su escena. Cues nuevos: `wrap` (s03, cierre del capítulo II), `sso` (s04), `note` (s05, la imagen del vale
>   después de nombrar OAuth), `mfa` (s07), `pam` (s09, donde se nombran PAM y password vaulting) y `lock-change` (s10,
>   vuelve el armario). Las tarjetas caen en `review`, `deprov`, `federation`, `authz`, `one-factor`, `key`, `pam` y
>   `revoked`.
> - s01: la frase de puente tiene 19 palabras y `title` cae antes de los 12 s; `promise` va en la misma frase.
> - La imagen de OAuth: tú dices que sí y la conserjería (tu casa) le da a tu vecina un vale para ese paquete, no tu
>   DNI. El permiso lo emite el IdP, nunca la usuaria.
> - Mensaje de s07: «¿Contraseña y pregunta secreta? Dos factores. Con eso vas sobrada.» (66), para no repetir la
>   cadencia del «Qué detalle» de V1.
> - En la voz, `c.navarro` es «una compañera de Comunicación» y `o.virta`, «un compañero de Importación» (canon nuevo).
>
> **Cambios de las revisiones del 2026-10-03** (exactitud y naturalidad; el guion y `storyboard.json` ya los llevan, la
> tabla de escenas no):
> - La bóveda rota la contraseña cada 24 h y **cada vez que alguien la devuelve**, no al sacarla (sp4m8q7 y s10).
> - s04: el remate de SAML no dibuja ningún intento de entrar con la cuenta del jubilado; en pantalla, en condicional,
>   «sin pase: acceso denegado».
> - s08: reloj 00:04, porque la voz dice «a medianoche»; y sin cajero falso al final (un cajero falso es donde se copian
>   tarjetas): la llave «no firma, por mucho que la imiten».
> - s09: las otras cinco mejoras de V5 salen atenuadas y sin estado.
> - s01: «¿eres quien dices?» para la authentication; s06 nombra solo SAML, OAuth y LDAP como los que mezcla el examen
>   (OpenID Connect no está en la lista del 4.6).
> - El capítulo V cierra con su «o sea, que…» en el armario de s10, y el final cambia «Nos vemos en Alertópolis» por
>   «Por hoy, cerramos la garita»; en pantalla, «Tu turno», no «Ahora te toca».

- **Carpeta:** `iam-halden` · perfil `principal-yt` (380–600 s renderizados; objetivo ~9 min, sin rellenar) ·
  objetivo 4.6 (identity and access management; lo confirma la cabecera de la lección, `sp4-part4.ts:315`) ·
  adversario SILENT PAGER, tres mensajes interceptados, voz del adversario **ya existe** (la de V1 y V5) · voz
  `recording/lidia` con `"recording": { "tempo": 1.08, "maxPauseMs": 250 }` · música de V4 y V5
  (`Go On Going - Stayloose.mp3`) · en `video.json`, `"lesson": "sp4m8"`.
- **Duración:** suma de `s` = **520 s** (11 escenas); renderizado estimado de unos 535–540 s (unos 8:55) con el margen habitual
  de 15–20 s. Referencia: en V5, 562 s de escenas dieron 8:19 con la grabación a 1,08, así que el techo de 600 s queda
  lejos. `wordBudget` = `s` × 2,7.
- **Inserción:** en `src/data/secplus/sp4-part4.ts`, lección sp4m8, entre el check de MFA («password and then a security
  question answer», bloque `:449–463`) y el callout «Nota de examen: las pistas de IAM son casi siempre literales»
  (`:464–469`), como bloque `youtube` (`{ t: 'video', title, youtube, poster, transcript }`). Como V1 en sp4m7
  (`:168–178`), lo precede un párrafo de una línea: «Antes de la nota de examen, júntalo todo en el puerto: quién entra,
  cómo lo demuestra y hasta dónde llega». El vídeo recorre cuatro de las cinco partes y funciona como síntesis; la nota
  de examen lo remata. Se fija en la suite `lesson videos` de `src/data/content.test.ts` (como V5 en `:274`).
- **Laboratorios:** ninguno de la sección ejercita IAM (spl4a Log Hunt clasifica fuentes de datos, spl4b ordena las
  fases de respuesta, spl4c prioriza vulnerabilidades), así que no hay solución que esconder. Por eso la acción final
  no es un laboratorio: son las 8 preguntas de la lección.
- **Etiquetas** (en `video.json`, `"tags"`): identity and access management, IAM, gestión de identidades, SAML, OAuth,
  OpenID Connect, federación, MFA, MFA fatigue, PAM, just-in-time, permission creep.
- **Enfoque («la contraseña buena no basta»):** el vídeo arranca en la 01:52 del 4-9, que ya es canon del SIEM y de V5:
  una cuenta de servicio robada entró en un servidor con su contraseña de verdad, y el servidor abrió. De ahí salen las
  dos preguntas de todo el objetivo 4.6: ¿quién eres? y ¿qué puedes hacer? El resto es octubre en Halden, después de
  V5b: la revisión trimestral de accesos (19-10), una jubilación (23-10), cómo entra la plantilla en la web de un socio
  y cómo lee el calendario la app de un proveedor (sin fecha, como en la lección), una demo hipotética de avisos push en
  «tu móvil», y el cierre del arco: la mejora de V5 «cuentas de servicio en un gestor de contraseñas con rotación»
  se cumple el 27-10, con un préstamo de privilegio el 28-10. SILENT PAGER propone tres atajos y la narradora enseña qué
  se rompería con cada uno. Frase de puente para quien no vio V5: «En septiembre, una cuenta de servicio del puerto
  entró de madrugada en un servidor. Con su contraseña de verdad.»

**Conceptos (5) y su imagen:**

| # | Concepto | Imagen que se mantiene | Tarjetas |
|---|---|---|---|
| 1 | Ciclo de vida (alta, cambio, baja: joiner-mover-leaver). Cada cambio de puesto suma permisos y nadie quita los viejos: eso es permission creep, y se corrige con least privilege y una attestation periódica, en la que cada responsable confirma lo que se queda y se retira lo demás. Quien se va queda deshabilitado el mismo día y se borra después, según la política de retención (deprovisioning) | La acreditación del puerto que abre puertas: cada puesto le suma puertas; en la revisión, su responsable dice cuáles se quedan. Y la taquilla del que se va: se precinta, no se vacía | «Permission creep: least privilege y attestation» · «Baja: deshabilitar el mismo día, borrar después» |
| 2 | Federación con SAML. Para entrar en la web de un socio con tu cuenta, el socio no te pide nada: te manda a casa, tu casa (el IdP) comprueba quién eres y te da una aserción firmada, para esa web y por unos minutos. El socio se fía de la firma porque las dos organizaciones lo acordaron antes, y nunca ve la contraseña. Si la cuenta se deshabilita en casa, se acaba el acceso fuera. Una vez en casa, muchas webs: SSO, y por eso ese inicio de sesión debe llevar segundo factor (norma de la lección, `:360`; el vídeo no enseña que el IdP de Halden ya lo pida) | Un pase de visita firmado por tu casa: para esa oficina, válido hoy, y la recepción del socio conoce la firma | «Web del socio con tu cuenta: SAML y federation» |
| 3 | OAuth autoriza y delega: una app recibe un permiso con alcance y caducidad, nunca la contraseña, y se retira sin tocarla. No dice quién eres: para eso está OpenID Connect, encima de OAuth. LDAP es otra cosa: consultar el directorio de casa | La nota para que tu vecina recoja un paquete: le deja recoger ese paquete, no le da tu DNI ni la convierte en ti | «OAuth autoriza y delega; no autentica» |
| 4 | MFA son tipos distintos de prueba (algo que sabes, que tienes, que eres, dónde estás), no pantallas: contraseña y pregunta secreta son un solo factor. El push se vence por cansancio (MFA fatigue); la llave FIDO2 hay que tocarla en el equipo donde se entra y solo firma para la web de verdad, así que resiste al phishing. El SMS no es la salida: con él no llegan avisos que aprobar, pero se desvía a otro móvil (SIM swapping) o se teclea en una web falsa; solo cambia el ataque | El cajero: la tarjeta la tienes, el PIN lo sabes, y el ladrón necesita dos robos distintos. Cuando vuelve, una tarjeta que en un cajero falso no funciona | «Dos cosas que sabes o que tienes: un solo factor» · «MFA fatigue: llave FIDO2; el SMS solo cambia el ataque» |
| 5 | PAM. Las credenciales con privilegio viven en una bóveda: nadie las sabe y rotan solas (password vaulting). El privilegio se presta solo durante la ventana aprobada (just-in-time), con una credencial que caduca al acabar (ephemeral credentials); después se retira y la contraseña cambia | El armario de llaves de la garita: nadie se lleva una llave a casa, queda apuntado quién la usa, se presta para el trabajo y al devolverla se cambia la cerradura | «Password vaulting: nadie sabe la clave y rota sola» · «JIT: privilegio solo en la ventana aprobada» |

**Escenas:** once, en cinco capítulos (La contraseña buena · Altas, cambios y bajas · Entrar en casa ajena · Demostrar
que eres tú · Las llaves maestras). Como en V1, el cierre vive dentro del último capítulo de contenido, así que su
mensaje va en s10, no en s11.

| Escena | Cap. | s | Qué se ve | Qué se aprende · cues |
|---|---|---|---|---|
| s01-hook «La contraseña buena» | I La contraseña buena | 44 | La ficha de la 01:52 del SIEM, grande: «4-9 · 01:52 · logon `4624` de `svc_tosreport` desde `ADM-WS-07` en `srv-tc-app03`», con un sello verde «contraseña correcta · adelante»; debajo, en rosa, «¿era quien decía ser?». La ficha se atenúa y entra el título «Identidad y acceso», con «IAM · identity and access management» debajo, y la promesa en tres chips: «quién entra · cómo lo demuestra · hasta dónde llega». Dos preguntas grandes, una cada vez: «¿quién eres?» (authentication) y «¿qué puedes hacer?» (authorization). La ruta del vídeo, cuatro paradas con icono: altas y bajas, casa ajena, segundo factor, llaves maestras | La promesa en los primeros 10 s y el puente con V5; identidad frente a permiso · `logon, title, promise, two-q, route` |
| s02-creep «La acreditación que solo suma» | II Altas, cambios y bajas | 50 | El ciclo en un anillo: alta · cambio · baja (joiner · mover · leaver); se ilumina «cambio» y se atenúa lo demás. «19-10 · revisión trimestral de accesos». La ficha de `c.navarro`: Atención a navieras (2021), Facturación (2023), Comunicación (2025). Su acreditación con 11 puertas: 4 en cian («de su puesto») y 7 en ámbar («de puestos anteriores»); se amplía una, «facturas a navieras · emitir», con la etiqueta «nadie lo decidió». Nombre PERMISSION CREEP. La lista de la revisión: su responsable de Comunicación confirma 4; las 7 sin confirmar se desvanecen con «no confirmado · retirado». Nombres ATTESTATION y LEAST PRIVILEGE | Cada cambio de puesto suma y nadie quita; la revisión periódica retira lo que nadie confirma · `cycle, mover, doors, creep, review, removed` |
| s03-leaver «Se jubila el viernes» | II | 48 | El anillo, ahora con «baja» iluminada. La ficha de `o.virta`, de Importación (la oficina que trata con aduanas): «se jubila el viernes 23-10». Pregunta para pensar, con dos botones: «borrar» y «deshabilitar». La respuesta por pasos: la acreditación pasa a «deshabilitada · 23-10 · fin de turno»; la taquilla, precintada: «buzón · archivos · registros · se conservan»; «borrar: cuando lo diga la política de retención». «Borrar hoy», tachado: «sin vuelta atrás». Nombre DEPROVISIONING | Deshabilitar el mismo día y borrar después · `leaver, choice, same-day, locker, retention, deprov` · **think** |
| s04-saml «Un pase firmado por tu casa» | III Entrar en casa ajena | 54 | Diagrama de secuencia con tres carriles: «navegador · personal del puerto», «plataforma aduanera · el socio (SP)» e «IdP · Autoridad Portuaria de Halden» (sin nombres de host). Cada paso se ilumina al compás de la voz y los anteriores se atenúan: abrir la plataforma; «no te conozco: que responda tu casa» y la redirección al IdP; la contraseña, solo en el carril del IdP, con un candado «no sale de casa» (el carril enseña solo «contraseña»: ningún segundo factor en el IdP de Halden en todo el vídeo); el pase: «quién: cuenta del puerto · para: plataforma aduanera · válido: 5 min · firma: IdP de Halden»; el navegador lo lleva al socio, que comprueba la firma contra una línea discontinua «confianza acordada antes» y abre. Nombres SAML (aserción), FEDERATION y SSO («una vez en casa, muchas webs»). Remate: la cuenta de `o.virta` (Importación, usaba esta plataforma), deshabilitada; el IdP ya no firma pases para esa cuenta y el socio dice «acceso denegado» sin tocar nada allí | El socio se fía de la firma de tu casa y nunca ve la contraseña; deshabilitar en casa corta fuera · `open, redirect, home, assertion, verify, federation, dies` |
| s05-oauth «Una nota para recoger un paquete» | III | 54 | El planificador de atraques de un proveedor externo pide «usuario y contraseña del puerto» para leer el calendario de atraques. Mensaje interceptado. La casilla de contraseña, tachada: «con tu contraseña: correo · archivos · todo · y solo se corta cambiándola». La secuencia OAuth, con el mismo estilo que s04 (app · IdP de Halden · calendario): la app te manda a casa; pantalla de consentimiento «Planificador de atraques quiere: leer el calendario de atraques · Permitir / Rechazar»; a la app le llega un permiso, no la contraseña: `alcance: calendario.leer` · `caduca: 60 min`; lee el calendario (verde) e intenta el correo: «fuera de alcance» (rosa); botón «retirar permiso». Viñeta de la imagen: «autorizo a mi vecina a recoger el paquete de hoy». Nombre OAUTH: «autoriza y delega · no autentica» | Un permiso con alcance y caducidad, sin contraseña, que se retira sin tocarla · `app, crossed, consent, token, scope, revoke, authz` · **intercept** |
| s06-cual «¿Quién eres o qué puede hacer?» | III | 32 | Tres frases de escenario caen y se enganchan a su nombre, con los iconos de las imágenes: «entrar en la web del socio con tu cuenta» (el pase): SAML; «una app lee tu calendario sin tu contraseña» (la nota): OAuth; «Iniciar sesión con…» (la nota con una ficha de identidad encima): OPENID CONNECT. Debajo, el directorio detrás del IdP: «consultar el directorio de casa: LDAP», que luego se atenúa. Fila final: «SAML: quién eres, para entrar · OAuth: qué puede hacer una app por ti · OIDC: OAuth más quién eres» | Los tres nombres que el examen mezcla a propósito · `saml-q, oauth-q, oidc, ldap, sum` |
| s07-factors «Tarjeta y PIN» | IV Demostrar que eres tú | 46 | Un inicio de sesión con «contraseña» y «pregunta secreta: ¿cómo se llamaba tu primera mascota?». Mensaje interceptado. Cuatro columnas: algo que sabes (contraseña, PIN, pregunta), algo que tienes (token, app de códigos, llave de seguridad, tarjeta inteligente), algo que eres (huella, cara, iris) y dónde estás (ubicación, red). El cajero: la tarjeta cae en «tienes» y el PIN en «sabes»: «dos robos distintos». La contraseña y la pregunta caen las dos en «sabes»: «una llamada con engaño se lleva las dos · 1 factor». Un token y una app de códigos, las dos en «tienes»: «1 factor». Rótulo MFA: «tipos distintos, no pantallas» | MFA cuenta tipos de prueba, no pasos · `types, atm, two-thefts, same-type, one-factor` · **intercept** |
| s08-fatigue «Avisos sin parar» | IV | 54 | Un móvil simulado («simulación · sin fecha», reloj 00:47) y una franja: «alguien ya tiene tu contraseña». Avisos que se apilan: «¿Estás iniciando sesión? · Aprobar / Rechazar», contador de 1 a 20 y el pulgar que se acerca a «Aprobar». Nombre MFA FATIGUE · push bombing. Pregunta para pensar. La respuesta en dos columnas: SMS, tachado («se desvía a otro móvil: SIM swapping» · «se teclea en una web falsa»); llave FIDO2 («hay que tocarla, en el equipo donde se entra» · «solo firma para la web de verdad»). La web parecida de V1 s11 (`haldenp0rt.example`; nunca se enseña el host real del IdP): la llave no firma (en voz, «no firma para esa web»). Vuelve la imagen: una tarjeta que en un cajero falso no funciona. Rótulo «resistente al phishing» | El push se vence por cansancio; la llave FIDO2 no tiene nada que aprobar desde lejos y está atada a la web de verdad · `premise, pushes, fatigue, sms, key, origin` · **think** |
| s09-vault «El armario de llaves» | V Las llaves maestras | 48 | La lista de mejoras de V5 s09 con una fila resaltada: «cuentas de servicio en gestor de contraseñas con rotación · Sistemas · 31-10», y un sello «27-10 · hecho». La imagen: el armario de llaves de la garita, con su registro. La consola de la bóveda: `svc_tosreport`, `svc_edi` «y el resto de cuentas de servicio» entran junto a «administradores del dominio · ya estaban»; columna «¿quién la sabe?»: «nadie»; «rotación: cada 24 h y cada vez que una persona la retira»; registro de accesos. Barra de comparación: «septiembre: hasta que alguien se diera cuenta», con «4-9 · 10:30» en pequeño debajo, frente a «ahora: 24 h como mucho, aunque nadie se dé cuenta». Vuelve la ficha de la 01:52 con `4672 · privilegios especiales` ampliado y «retirados · para informes no hacían falta». Nombres PAM y PASSWORD VAULTING | Las credenciales con privilegio viven en una bóveda: nadie las sabe y rotan solas · `improvement, cabinet, vault, nobody, rotate, before-after, least` |
| s10-jit «Solo durante la ventana» | V | 52 | Primero, el mensaje interceptado. Después, lo que propone: un reloj de 24 h con «administrador del dominio · fijo» en rosa todo el día, rotulado «sin JIT · lo que propone» (no es el estado del puerto: en Halden los administradores del dominio ya se prestan por ventana, sp4m8q7 y s09). La consola de la bóveda: solicitud de «L. Ferrer · Infraestructura»: «administrador del dominio · motivo: cambio aprobado · ventana: 28-10 · 22:00–23:00»; «aprueba: R. Salas · jefe de sistemas». El préstamo: «credencial válida hasta las 23:00 · sesión grabada · cuenta de administración, separada de la diaria». Cuenta atrás; a las 23:00, «privilegio retirado · contraseña rotada». Una copia de la credencial a las 23:05: «ya no sirve». Vuelve el armario: se presta la llave para el trabajo y al devolverla se cambia la cerradura. Nombres JUST-IN-TIME PERMISSIONS y EPHEMERAL CREDENTIALS | El privilegio existe solo durante la ventana aprobada · `standing, request, approve, checkout, clock, revoked, copy` · **intercept** |
| s11-recap «Tres reglas» | V | 38 | Tres tarjetas de reglas, una cada vez; tarjeta final Alertópolis: «Ahora te toca: las preguntas de la lección» (sp4m8, 8 preguntas) | Reflejos · `recap, rule-1, rule-2, rule-3, next, endcard` |

- **Exam cards** (objetivo 4.6), una por escena en s02–s05 y s07–s10; ninguna en s01, s06 ni el cierre:
  - «Permission creep: least privilege y attestation» (s02, 47)
  - «Baja: deshabilitar el mismo día, borrar después» (s03, 47)
  - «Web del socio con tu cuenta: SAML y federation» (s04, 46)
  - «OAuth autoriza y delega; no autentica» (s05, 37)
  - «Dos cosas que sabes o que tienes: un solo factor» (s07, 48)
  - «MFA fatigue: llave FIDO2; el SMS solo cambia el ataque» (s08, 54)
  - «Password vaulting: nadie sabe la clave y rota sola» (s09, 50)
  - «JIT: privilegio solo en la ventana aprobada» (s10, 43)
- **Think prompts** (`holdMs` 4500):
  - «Se jubila el viernes. ¿Borrar o deshabilitar?» (s03, 45). Respuesta: deshabilitar, y ese mismo día; borrar más
    tarde, porque el buzón, los archivos y los registros pueden hacer falta y borrar no tiene vuelta atrás.
  - «Avisos sin parar. ¿Códigos SMS o llave FIDO2?» (s08, 45). Respuesta: la llave, porque hay que tocarla en el equipo
    donde se entra y solo firma para la web de verdad; el SMS quita los avisos, pero solo cambia el ataque (se desvía o
    se teclea en una web falsa).
- **Mensajes interceptados** (SILENT PAGER, uno por capítulo en III, IV y V; ninguno en el cierre):
  - s05: «Dale tu contraseña a esa app del calendario. Va más rápido.» (59). El error que corrige la narradora: dar la
    contraseña a una app de terceros. Con ella la app tiene tu cuenta entera y solo se le quita cambiándola; con OAuth
    recibe un permiso para una sola cosa, que caduca y se retira sin tocar la contraseña.
  - s07: «¿Contraseña y pregunta secreta? Dos factores. Qué tranquilidad.» (63). El error: contar pantallas en vez de
    tipos. Las dos son algo que sabes, y una sola llamada con engaño se lleva las dos: un solo factor.
  - s10: «Admin fijo y listo. Pedir permiso cada vez es un rollo.» (55). El error: dejar el privilegio puesto por
    comodidad. Un administrador fijo lo es las 24 horas, y su contraseña robada sirve cualquier noche; con JIT el
    privilegio solo existe durante la ventana aprobada y la credencial caduca al acabar.
- **Cierre:** tres reglas y una sola tarea.
  1. Cada cambio de puesto quita además de dar, y quien se va queda deshabilitado ese mismo día.
  2. Tu contraseña solo la ve tu casa, con un segundo factor de otro tipo: al socio le llega un pase firmado, y a la
     app, un permiso con límite.
  3. Nadie guarda las llaves maestras: la bóveda las cambia sola y solo las presta durante la ventana.

  Tarea: las 8 preguntas de la lección sp4m8.

**Se queda fuera** (está en la lección, que quien ve el vídeo ya ha leído, porque va al final):
- Los cinco modelos de control de acceso (MAC, DAC, RBAC, rule-based, ABAC) y las time-of-day restrictions
  (`sp4-part4.ts:403–443`; preguntas sp4m8q3 y q4; tarjeta fcp427). Es una taxonomía por «quién decide», y la sirven
  mejor la tabla, la tarjeta y las preguntas; meterla subía a 6–7 conceptos. El vídeo solo usa least privilege (s02).
- Contraseñas: longitud frente a complejidad, listas de contraseñas filtradas, sin caducidad forzada, gestores de
  contraseñas y passwordless (`:447`; pregunta sp4m8q6; tarjeta fcp429).
- Identity proofing, el primer paso del alta (`:340`); el anillo de s02 dice «alta», pero no lo explica.
- LDAPS, la interoperabilidad y el riesgo de concentrar todo en un solo inicio de sesión (`:360`, tabla `:363–392`); de
  SSO solo queda que ese inicio de sesión debe llevar segundo factor (s04, como norma: el IdP de Halden no lo enseña).
- De MFA: biometría y ubicación salen solo como ejemplos en las columnas de s07; SIM swapping, solo en pantalla y con
  una frase llana en s08 (`:447`).
- De PAM: la cuenta de administración separada de la diaria y la grabación de sesión salen solo en pantalla (s10).
- El párrafo final, puente a la automatización del objetivo 4.7 (`:471–473`).

**Canon nuevo que fija V6** (nada de esto estaba en los datos del curso; lo posterior debe respetarlo):
- **2026-10-19 (lunes): la revisión trimestral de accesos de octubre.** Es la práctica que la pregunta sp4m8q1 ya da
  como habitual en Halden (cada responsable recibe la lista de su equipo y confirma o retira), así que el vídeo no dice
  que sea la primera. Caso en pantalla: `c.navarro` (**nueva**), de Comunicación; antes, Atención a navieras (2021) y
  Facturación (2023). 11 permisos, 4 de su puesto; su responsable confirma los 4 y se retiran los 7 restantes, entre
  ellos «facturas a navieras · emitir». «Nadie lo decidió»: no se culpa a nadie.
- **2026-10-23 (viernes): se jubila `o.virta`** (**nuevo**), de Importación (la oficina que trata con aduanas, el
  *import desk* de `labs-sp2.ts:146`), así que usaba la plataforma aduanera del socio. Su cuenta se deshabilita ese mismo día, al
  terminar su turno; buzón, archivos y registros se conservan hasta que la política de retención permita borrarlos.
  Es una baja sin conflicto ni sospecha (el check de la lección, `:345`, usa un despido tras una disputa: el vídeo no).
- **Federación y OAuth, sin fecha**, como en la lección: el personal entra en la plataforma aduanera del socio con su
  cuenta del puerto por SAML (`:332`, `:360`, sp4m8q8), con una aserción válida 5 minutos; el planificador de atraques
  de un proveedor externo lee el calendario de atraques con un permiso `calendario.leer` de 60 minutos (`:396`). Sin
  nombres de host ni dominio para el IdP o el socio (el registro ya tiene tres dominios públicos en conflicto, §5.2).
- **La demo de push es hipotética**: «tu móvil», reloj 00:04 (la voz dice «a medianoche»), sin fecha. No es un hecho del caso. La web falsa es
  `haldenp0rt.example`, el ejemplo de dominio parecido que ya enseña V1 s11.
- **2026-10-27 (martes): la mejora de V5 se cumple antes de plazo** («cuentas de servicio en gestor de contraseñas con
  rotación · Sistemas · 31-10»). Las cuentas de servicio (`svc_tosreport`, `svc_edi` y el resto) entran en la bóveda
  de Sistemas, que **ya guardaba** las credenciales de administrador del dominio (sp4m8q7 lo da como práctica del
  puerto). Nadie conoce sus contraseñas; rotan cada 24 h y cada vez que una persona la devuelve (no al sacarla: así lo
  dice sp4m8q7, «rotated automatically the moment the session ends»). A `svc_tosreport` se le retiran los
  privilegios especiales (el `4672` de la 01:52, que el SIEM ya enseña en pantalla): para los informes no hacían falta
  (**deducción nueva**). La contraseña robada en septiembre sirvió hasta que alguien se dio cuenta y la cambió a mano,
  el 4-9 a las 10:30 (V5); sin eso habría seguido valiendo. Con la bóveda dura 24 h como mucho, aunque nadie se dé
  cuenta: la bóveda le pone un límite, no dice que hubiera parado la 01:52.
- **2026-10-28 (miércoles), 22:00–23:00: un préstamo just-in-time.** L. Ferrer (Infraestructura, ya en el registro) pide
  ser administrador del dominio para un cambio aprobado, sin número de cambio; aprueba R. Salas (jefe de sistemas, ya en
  el registro). Credencial válida solo esa hora, sesión grabada, cuenta de administración separada de la diaria. A las
  23:00 se retira el privilegio y la contraseña rota; una copia a las 23:05 ya no sirve.
- **Comprobado contra la cronología:** ninguna fecha nueva choca con las del registro ni con las de V5 (11-9, 18-9, 25-9,
  30-9, 15-10, 31-10), V5b (2-10, 5-10, 8-10, 9-10, 13-10, 15-10, 16-10) y V10 (noche del 20 al 21-10, MFA en el
  proveedor de identidad · Sistemas · 30-11). Días de la semana comprobados con Node. `c.navarro` y `o.virta` no
  existen en el repo y no se parecen a las cuentas del password spraying (`a.berg`, `j.solheim`, `m.lund`,
  `k.nyborg`, `r.haugen`).
- **El IdP de Halden no enseña segundo factor en ningún momento del vídeo.** El 21-10 solo pedía la contraseña (V10) y
  la MFA llega el 30-11; V6 no lo contradice ni se adelanta: el segundo factor sale como norma de la lección (s04) y en
  la demo hipotética del móvil (s07–s08).

**No se toca:**
- El dosier del jefe de sp4 (la IP del ASN de NULL CIPHER, «GH es una sola operación», la firma «GH») ni quién es
  GLASS HARBOR.
- **Ningún contratista** en una baja, en una cuenta que sigue viva o en un privilegio que no caduca, ni la expresión
  «acceso perpetuo»: es el final de sp5 («un contratista con acceso perpetuo», `sections.ts:125`). Los contratistas de
  fondo siguen neutros, y el vídeo no usa el ejemplo de horario de obra de la lección.
- El password spraying del 21-10 (V10, `LOGIN OK user=r.haugen`): es de su ficha. Ningún reloj del vídeo marca las
  03:xx y la demo de push no tiene fecha.
- Ningún segundo factor en el IdP de Halden: el carril del IdP de s04 enseña solo «contraseña» (ver «Canon nuevo»).
- No se dice que el segundo factor, la bóveda o la rotación habrían parado la 01:52: era una cuenta de servicio, sin
  segundo factor, y la contraseña se usó unas diez horas después del robo.
- Lucía no sale en ninguna escena de identidad (ni en los pases, ni en la app, ni en el móvil): V5 ya gastó «Despide a
  Lucía».
- `svc_edi` sale solo como una cuenta de servicio más, sin nada que la relacione con el aviso de ejemplo del SIEM
  (`siem/src/data/s04-enrich.ts`).
- La ruta de salida de los 38 GB, que sigue siendo un hueco abierto.
- No se culpa a nadie: ni a `c.navarro` ni a sus responsables por los permisos acumulados, ni a quien dio los
  privilegios especiales a `svc_tosreport`.

### V7 · s2m5 · Cápsula · «Del comando al TTP: ATT&CK y la Pyramid of Pain»

> Aprobada por Lidia el 2026-10-01 con los ajustes de abajo (rama `video-attack-piramide`, desde `main`). Lidia pidió
> empezar antes de que se fusionara V5b: su rama solo toca su carpeta y su propia sección de este plan, así que las
> dos no se pisan. La versión vigente de escenas y guion será `video/attack-piramide/storyboard.json` +
> `narration.json`; qué se quedó fuera, en `video/attack-piramide/out/script-notes.md`.
>
> **Producido y publicado el 2026-10-03**: YouTube `XCOAc7tlPTE`, 3:59, 6 escenas, 4 tarjetas, 1 pregunta, 1 mensaje
> de GLASS VIPER con la voz de V3, voz de Lidia (una frase recortada de sus propias tomas: a s04-02 se le pegaba el
> arranque abandonado de s04-03), música de V4, −14,1 LUFS. En la lección s2m5, entre el párrafo de la escalera de
> abstracción y el primer check del árbol. La grabación quedó al 93 % del estimado (V5b, 85 %). El canon nuevo está en
> `docs/superpowers/canon/velvet-cicada.md` §7.
>
> **Ajustes al abrirla** (ya incluidos abajo):
> - s03 y s04 acababan en la frase de su tarjeta, y la tarjeta necesita ~5 s de escena detrás: s03 cierra el capítulo
>   I con un «o sea, que…» (cue `wrap`) y s04 responde al mensaje después de la tarjeta (cue `reply`).
> - s01 pasa a `tree, title, promise, bridge`, para que el título caiga antes de los 12 s.
> - La muestra del sandbox con el mismo `9f3a2c...e1` crea la misma tarea `WindowsUpdateCheck` (`src/data/s3.ts:338`):
>   en s05 el segundo tono dice «nombre y carpeta del ejecutable», nunca «artefactos» en general, y la voz, «el nombre
>   y la carpeta del programa».
> - Duración con el ritmo real de Lidia (V5b: 557 palabras, 4:14 estimado, 3:36 grabado, un 85 %): guion de ~545–560
>   palabras, estimado ~4:05–4:15, real ~3:35–3:45.
>
> Sobre el esbozo del plan (§5): se mantiene el árbol mapeado en directo y cada indicador subiendo por la pirámide. Lo
> nuevo es cómo trata el choque del hash del registro (§5, punto 1), que resuelve **solo en parte** (nombre, ruta y
> hash; siguen abiertos el nombre `VC_Loader_v1.dll` del Lab 3B y el punto 11): el `4c81...b3` del árbol y el
> `9f3a...e1` de E7 salen juntos, como otro binario en el mismo equipo que habla con el mismo dominio, y son la prueba
> de la base de la pirámide (ver `V7-s2m5-decisiones.md`). No hace falta ningún ajuste por el validador: 4 tarjetas en
> 6 escenas, una por escena de s02 a s05 y ninguna en el cierre.
>
> Revisada el 2026-10-01 con los arreglos de la revisión de exactitud (`revision-gcti.md`, V7 y «Entre fichas» 1):
> en s05 solo el hash es «la ropa»; las dos compilaciones se dicen con cautela; sub-techniques en pantalla; `certutil`
> en Tools; la regla recorre toda la cadena.

- **Carpeta:** `attack-piramide` · perfil `capsula-yt` (190–260 s renderizados; objetivo ~4:00, sin rellenar) ·
  objetivo GCTI **Intrusion Analysis** (dominio del curso de S2, `src/data/course-gcti.ts:32`, y de todas las
  preguntas de s2m5) · adversario GLASS VIPER, un mensaje interceptado · voz `recording/lidia` con
  `"recording": { "tempo": 1.08, "maxPauseMs": 250 }` · voz del adversario: **ya existe**, la de V3
  (`"adversaryVoice": { "voice": "sapi/Microsoft Pablo", "rate": 0, "fx": "machine" }`,
  `video/diamond-e7/narration.json:6`) · música de V4 y V5 (`Go On Going - Stayloose.mp3`).
- **`video.json`:** `"profile": "capsula-yt"`, `"track": "gcti"`, `"adversary": "GLASS VIPER"`, `"lesson": "s2m5"`,
  la música de arriba y `"tags"` para YouTube (MITRE ATT&CK, Pyramid of Pain, pirámide del dolor, TTP, tácticas
  técnicas y procedimientos, threat intelligence, inteligencia de amenazas, GCTI, detección, SOC). Título de YouTube:
  «Del comando al TTP: ATT&CK y la Pyramid of Pain | GIAC GCTI en español».
- **Ritmo:** `"examTiming": "sentence-end"`; pregunta con `think.holdMs` 4500; mensaje con `intercept.holdMs` 3500.
- **Duración:** suma de `s` **218 s**; guion de ~545–560 palabras, estimado de `build-timeline --estimate`
  ~4:05–4:15 y real ~3:35–3:45 con la voz de Lidia (V5b grabó al 85 % de su estimado). `wordBudget` a 2,7 palabras/s: 65, 124, 86, 108, 140 y 65.
- **Inserción:** en `src/data/s2.ts`, lección s2m5, entre el párrafo «Practica la **escalera de abstracción**…»
  (`:1177-1180`) y el primer check («Given THIS process tree…», `:1181`), como bloque `youtube`:
  `{ t: 'video', title, youtube: '<id>', poster: 'videos/attack-piramide-poster.png', transcript: 'videos/attack-piramide-transcript.txt' }`.
  Igual que V3 en s2m3: el vídeo va justo antes de los checks que preguntan por los mismos datos (el hash como la
  inversión más débil, el comando como procedure). Se fija en la suite `lesson videos` de `src/data/content.test.ts`,
  junto a los de V3, V4 y V5 (`:270-274`).
- **Enfoque («dos fotos del mismo equipo»):** después de la alerta de E7 (V3), Meridian reconstruye cómo empezó todo en
  la estación de ingeniería de propulsión, y el EDR guardaba el árbol de procesos de la mañana del 2 de marzo, el de
  la lección. Primero se le pone nombre a cada rama con ATT&CK (tactic, technique, procedure) y después cada indicador
  sube a su peldaño de la pirámide. GLASS VIPER propone el atajo de siempre, bloquear su hash, y la segunda foto del
  mismo equipo, la del 5 de marzo que ya enseñó V3, le quita la razón: otro binario, con otro hash (la ropa) y otro
  nombre y otra carpeta (el acento), que habla con el mismo dominio. La salida es la regla de comportamiento de la
  propia lección. Una frase de puente resume V3 para quien
  no lo vio: el 5 de marzo, de madrugada, ese equipo llamó a un dominio que nadie conocía.
- **Lo que se lee no se deletrea:** equipo, rutas, hashes, dominio, nombre de la tarea e identificadores de técnica
  (`T1053.005`…) van en pantalla; la voz dice qué son («el equipo de ingeniería», «un nombre que imita una
  actualización de Windows», «la técnica de la tarea programada»). Ninguna excepción. La voz no nombra VELVET CICADA:
  dice «el atacante» o GLASS VIPER, nombre de seguimiento del implante y de quien lo usa, como en V3.

**Conceptos (2) y su imagen:**

| # | Concepto | Imagen que se mantiene | Tarjetas |
|---|---|---|---|
| 1 | La escalera de ATT&CK. La tactic es el porqué del paso (Persistence: poder volver); la technique, el cómo general, que usan muchos (`T1053` Scheduled Task/Job, con su sub-technique `.005` Scheduled Task; la voz dice «la técnica»); la procedure, cómo lo hace exactamente este actor (el comando, con su nombre de tarea disfrazado). Los números de técnica son un idioma común: el mismo número significa lo mismo para tu SOC, tu proveedor y un informe público | La llave escondida. El porqué es volver a entrar en la casa; una manera es dejarse una llave (otra sería una ventana mal cerrada: otra técnica, el mismo porqué); la suya es una copia en la maceta del rellano con una etiqueta que pone «revisión del gas» | «Procedure: el comando exacto de este actor» · «Persistence es una tactic: el porqué, no el cómo» |
| 2 | La Pyramid of Pain ordena los indicadores por lo que le cuesta al adversario cambiarlos: el hash, abajo del todo (otra compilación y ya es otro); el dominio, algo más arriba; los artefactos, como el nombre de la tarea o la ruta y el nombre del ejecutable, en medio (cambiarlos le cuesta más trabajo); las herramientas, más arriba; los comportamientos (TTPs), en la cima. Decisión práctica: invertir arriba, en una regla de comportamiento que le da igual el binario y su nombre | Reconocer a alguien por la ropa (se la cambia en un minuto), por el acento (le cuesta, pero lo disimula; es la imagen que V3 usó para el patrón del named pipe) o por la forma de andar (tendría que aprender a andar otra vez) | «Pyramid of Pain: cuanto más arriba, más le duele» · «Detecta el comportamiento: sobrevive a recompilar» |

**Escenas:** seis, en tres capítulos (El árbol · La pirámide · Para el examen).

| Escena | Cap. | s | Qué se ve | Qué se aprende · cues |
|---|---|---|---|---|
| s01-hook «Un árbol, dos mapas» | I El árbol | 24 | El árbol de procesos de la lección se dibuja rama a rama, atenuado, con la cabecera `ENG-WS-041 · 02-03-2026 · 09:44`. A sus lados se abren dos mapas vacíos: la matriz de ATT&CK (columnas de tácticas) y la pirámide de seis peldaños, en gris. Título. La promesa, en una línea: «ponerle nombre a cada rama · elegir la detección que le duele». El puente, en una tira con la ficha de E7 de V3: «05-03-2026 · 02:13 UTC · beacon a `update-svc-cdn.com` · dominio desconocido» y «después de la alerta: ¿cómo empezó? 02-03» | La promesa en los primeros 10 s (casi tres días con el atacante dentro; qué sabrás hacer; ATT&CK y la Pyramid of Pain) y el puente con V3 · `tree, title, promise, bridge` |
| s02-escalera «Porqué, cómo y cómo exactamente» | I | 46 | Se amplía la rama `schtasks.exe /create /tn WindowsUpdateCheck /sc onlogon` y el resto del árbol se atenúa; debajo, en llano: «que el programa vuelva a arrancar en cada inicio de sesión». Viñeta de la llave: un rellano, una maceta, una llave con la etiqueta «revisión del gas». Escalera de tres peldaños que se construye al compás de la voz, de arriba abajo: TACTIC `Persistence` («el porqué: poder volver»); «TECHNIQUE · `T1053` Scheduled Task/Job · sub-technique `.005` Scheduled Task» («el cómo · lo usan muchos»; la voz dice «la técnica»), con una ventana entornada atenuada al lado («otra técnica, el mismo porqué»); PROCEDURE, el comando entero («así lo hace este»). Al final se resaltan juntos `WindowsUpdateCheck` y la etiqueta «revisión del gas»: el disfraz es parte de la procedure. La tarjeta, con la escalera ya completa | Tactic, technique y procedure en una sola rama; el comando exacto es la procedure, no la técnica · `zoom-task, key, tactic, technique, other-way, procedure, disguise` |
| s03-ramas «El resto del árbol» | I | 32 | El árbol entero vuelve y las otras ramas se encienden una a una; la anterior se atenúa al pasar a la siguiente: `powershell.exe -nop -w hidden -enc SQBFAFgAKA...` con «`T1059` Command and Scripting Interpreter · sub-technique `.001` PowerShell» · Execution; `wcssvc.exe -decode a.txt payload.bin` con «`T1140` Deobfuscate/Decode Files or Information» (technique, sin sub-technique) · Defense Evasion, y al lado la cabecera del ejecutable, `OriginalFileName: CertUtil.exe`, con el nombre en disco tachado como disfraz; la línea de la conexión TLS de `winhlp.exe` a `update-svc-cdn.com:443` con «`T1071` Application Layer Protocol · sub-technique `.001` Web Protocols» · Command and Control. Las etiquetas siguen el formato de s02 (technique y, debajo, su sub-technique); la voz dice «técnica». Chip «idioma común»: tres rótulos genéricos (tu SOC, tu proveedor, un informe público) leen el mismo `T1053.005`. Al final, las cuatro tácticas en fila (Execution, Defense Evasion, Persistence, Command and Control) y la tarjeta, con el árbol ya atenuado. Cierre del capítulo, con el «o sea, que…»: la escalera de s02 junto a la fila de tácticas | Todo el árbol en ATT&CK; los números de técnica son un idioma común; las tácticas son los porqués · `branch-ps, branch-decode, real-name, branch-c2, common, tactics, wrap` |
| s04-piramide «Lo que le duele cambiar» | II La pirámide | 40 | Mensaje interceptado. La pirámide de la lección, de abajo arriba: Hash values · Trivial; IP addresses · Easy; Domain names · Simple; Network/Host artifacts · Annoying; Tools · Challenging; TTPs · Tough. A la izquierda, la viñeta de la persona, alineada con la base, el medio y la cima: la ropa, el acento, la forma de andar. Los indicadores del árbol suben uno a uno a su peldaño y se amplía el que nombra la voz: `4c81...b3` a Hash values; `update-svc-cdn.com` a Domain names; `WindowsUpdateCheck` y la ruta `C:\ProgramData\winhlp.exe` a Host artifacts; `wcssvc.exe (CertUtil)` a Tools; las cuatro etiquetas de técnica (`T1059.001`, `T1140`, `T1053.005`, `T1071.001`) a TTPs, arriba del todo, mientras el dominio de la línea de la conexión se queda en Domain names, como en la lección. Solo IP addresses queda en gris, porque el árbol no trae ninguna IP; la voz no lo comenta, ni dice que falte nada en ningún peldaño. La tarjeta, con la pirámide ya quieta. Después, la respuesta al mensaje: el hash resaltado en la base y «antes de bloquear nada, mira cuánto le cuesta cambiarlo» | La pirámide ordena por lo que le cuesta al adversario cambiar cada cosa; cada indicador del árbol en su peldaño (la ruta y el nombre, con el acento); lo que ATT&CK nombra como técnica vive arriba · `pyramid, person, hash-up, domain-up, artifact-up, tool-up, ttp-up, reply` · **intercept** |
| s05-otra-ropa «Tres días después» | II | 52 | Dos fotos del mismo equipo, lado a lado. Izquierda, «02-03-2026 · 09:44»: `C:\ProgramData\winhlp.exe` · `SHA-256 4c81...b3`. Derecha, «05-03-2026 · 02:11 UTC», las líneas del EDR de V3, solo ruta y hash (sin el campo `signed`): `C:\ProgramData\UpdSvc\updsvc.exe` · `sha256=9f3a...e1`, y debajo `update-svc-cdn.com:443`. Un chip «regla: hash `4c81...b3`» recorre la foto de la derecha y se queda en «0 coincidencias». Tres tonos, al compás de la voz: en ámbar, **solo el hash**, con la etiqueta «la ropa»; en un segundo tono, más apagado, el nombre y la carpeta, con la etiqueta «nombre y carpeta del ejecutable: también cambiaron, con más trabajo» (el acento de s04; la voz dice «el nombre y la carpeta del programa», nunca «los artefactos», porque la muestra del sandbox con el mismo hash crea la misma tarea `WindowsUpdateCheck`, `src/data/s3.ts:338`); en cian lo que sigue igual, el dominio, «de momento». En voz, con cautela: «otro binario, que habla con el mismo dominio. Todo apunta a otra compilación del mismo programa», y la imagen: «cambió de ropa y disimuló el acento. Pero cambiar cómo anda le costaría mucho más» (tras la revisión de exactitud del guion: V3 llamó acento a lo que sobrevive a recompilar, y del 5-3 no se ve ni PowerShell ni la tarea, así que no se dice que «anda igual»). Pregunta para pensar. La regla de la lección, en grande: «PowerShell lanzado por explorer crea una tarea programada no inventariada». Se prueba sobre la foto del 2 de marzo: la animación recorre la cadena entera, de `explorer.exe` a `powershell.exe`, `wcssvc.exe`, `winhlp.exe` y `schtasks.exe`, y solo entonces salta en la línea de la tarea, `09:44:20`, sin mirar ningún hash; la voz dice «en la cadena que arranca ese PowerShell». En la viñeta de s04 se ilumina la forma de andar, en la cima. La tarjeta, con las fotos ya atenuadas | Otro binario, otro hash: la regla por hash no ve la segunda foto; el nombre y la carpeta también cambiaron, con más trabajo; lo que dura es la regla de comportamiento sobre toda la cadena · `two-photos, zero-hits, ropa, accent, same-domain, rule, chain, retro-hit, walk` · **think** |
| s06-recap «Tres reglas» | III Para el examen | 24 | Tres tarjetas de reglas; tarjeta final Alertópolis: «Ahora te toca: las preguntas de la lección» (s2m5, 10 preguntas) | Reflejos · `recap, rule-1, rule-2, rule-3, next, endcard` |

- **Exam cards** (dominio Intrusion Analysis), una por escena de s02 a s05:
  - «Procedure: el comando exacto de este actor» (s02) (42)
  - «Persistence es una tactic: el porqué, no el cómo» (s03) (48)
  - «Pyramid of Pain: cuanto más arriba, más le duele» (s04) (48)
  - «Detecta el comportamiento: sobrevive a recompilar» (s05) (49)
- **Think prompt:** «¿Añades el hash nuevo o vigilas la conducta?» (s05) (44). Respuesta: la conducta, porque el hash
  nuevo caduca con la siguiente compilación, y la regla de comportamiento habría saltado el 2 de marzo sin conocer
  ningún hash.
- **Mensaje interceptado** (s04): «Bloquea mi hash. Así ya no me volverás a ver.» (45). El error concreto que la
  narradora corrige: creer que bloquear el hash lo para. Lo responde en s04 («antes de bloquear nada, mira cuánto le
  cuesta cambiar eso») y lo remata en s05, con la ironía en el marco: tenía razón a su manera, con esa regla ya no le
  ves, porque el 5 de marzo lleva otro hash.
- **Cierre:** tres reglas (el comando exacto es la procedure, la técnica es el cómo y la táctica, el porqué; el hash
  está en la base de la pirámide y caduca con la siguiente compilación, y los nombres y las rutas, un poco más arriba,
  también se cambian con algo más de trabajo; invierte arriba, en una regla que no mira ni la ropa ni el acento, sino
  cómo anda) y una sola tarea: las preguntas de la lección, que además practican lo que el vídeo deja fuera
  (el heatmap y lo que no sale en la ficha de un grupo).

**Se queda fuera** (lo cuenta la lección y lo preguntan sus preguntas):
- ATT&CK como mapa de cobertura: el heatmap de las técnicas de tu amenaza prioritaria frente a lo que detectas, y el
  «technique bingo» (`src/data/s2.ts:1115`, `:1123` y el final de `:1179`; s2m5q4).
- ATT&CK describe, no predice ni es exhaustivo: que una técnica no salga en la ficha de un grupo no quiere decir que no
  la use (`:1123`; s2m5q5 y s2m5q10).
- Emulación y estructura de informes (`:1116-1117`).
- La diferencia entre technique y sub-technique: sale en pantalla (s02 y s03), pero la voz no la explica y dice
  «técnica», como la lección (`:1109`).
- El peldaño IP addresses (el árbol no trae ninguna IP), los ejemplos de la tabla (`:1131-1140`) y el autor de la
  pirámide, David Bianco (`:1128`). `wcssvc.exe (CertUtil)` sube a Tools en pantalla, sin explicación en voz.
- El caso del decodificador propio que sustituye a certutil (s2m5q8): el vídeo llega a la misma conclusión con el
  cambio de binario.

**Canon nuevo que fija V7** (nada de esto estaba en los datos del curso; lo posterior debe respetarlo):
- **El árbol del 2-3 se reconstruye después de E7.** Tras la alerta del 2026-03-05 a las 02:13 UTC (V3), Meridian
  reconstruye en el EDR de `ENG-WS-041` cómo empezó todo; el árbol de s2m5 es el de la mañana del 2026-03-02
  (cabecera `09:44`, sin zona, como s2m1). Nadie vio ni bloqueó nada el 2-3, lo que encaja con V3, que presenta
  `update-svc-cdn.com` como dominio desconocido en E7 (`video/diamond-e7/narration.json:21`;
  `video/diamond-e7/src/scenes/S01Hook.tsx:286`). La reconstrucción no lleva hora.
- **Lectura del caso (no algo que el vídeo demuestre): `4c81...b3` y `9f3a...e1` son dos compilaciones del mismo
  loader** en el mismo equipo: `C:\ProgramData\winhlp.exe` con `4c81...b3` el 2-3 (s2m5, `src/data/s2.ts:1165`) y
  `C:\ProgramData\UpdSvc\updsvc.exe` con `9f3a...e1` el 5-3 a las 02:11:47Z (V3,
  `video/diamond-e7/src/data/s03-victim.ts:25-32`; E7 y s3m2). Loader e implante son el mismo objeto: «implante GLASS
  VIPER (stage-1 loader)» (`src/data/s2.ts:576`) y «es el implante GLASS VIPER, un loader» en V3
  (`video/diamond-e7/narration.json:85`). En pantalla y en voz, V7 solo enseña otro binario que habla con el mismo
  dominio, `update-svc-cdn.com`, y la voz lo dice con cautela («todo apunta a otra compilación del mismo programa»):
  la prueba fuerte, el PDB, es del dosier de BROKEN CHAIN, y el imphash y el ssdeep llegan en s3m2. Entre las dos
  fotos el binario se sustituyó; no se dice cómo ni cuál se compiló antes (el `9f3a2c...e1` de s3m2 tiene compile
  time 2026-02-19, `src/data/s3.ts:331`). Ni la tarea ni el named pipe del 5-3 salen.
- **Solo para el registro (nunca en pantalla ni en voz, porque el Lab 3B no se destripa):** `9f3a...e1` lleva el PDB
  (`src/data/s3.ts:332`), así que es la variante 1 del Lab 3B, «la del incidente de Meridian»
  (`src/data/labs.ts:775,819`); `4c81...b3` queda con rasgos estáticos sin definir y **no** es la variante 2, que no
  es de Meridian (`src/data/labs.ts:826`). Con esto V7 resuelve **solo en parte** el punto 1 de §5: el nombre, la ruta
  y el hash; siguen abiertos el nombre `VC_Loader_v1.dll` que el Lab 3B da a esa variante (§5, punto 1) y cuántas
  muestras comparten PDB (§5, punto 11).
- **Dos pruebas de la analista, no hechos del caso** (posteriores a E7, sin fecha): la regla por el hash `4c81...b3`
  sobre la telemetría del 5-3 da 0 coincidencias; la regla de comportamiento de la lección sobre la del 2-3 salta en
  la línea de la tarea, `09:44:20` (`src/data/s2.ts:81`). No se dice si el SOC las despliega ni quién.

**No se toca:**
- El dosier de BROKEN CHAIN (`src/data/course-gcti.ts:40`): ni el PDB en ninguna forma, ni cuántas muestras hay, ni
  que los TTPs se repitan en sus playbooks, ni «VELVET CICADA ya tiene cara técnica». Los dos binarios son del
  mismo equipo, no de varias víctimas.
- Lab 3A, Lab 3B y el final de la campaña (registro §4): nada en pantalla ni en voz. La nota sobre las variantes del
  Lab 3B de «Canon nuevo» es solo para el registro.
- Las víctimas de s2m4 (`src/data/s2.ts:871-883`): no se usan, porque su vector y su ruta (`C:\Users\..\winhlp.exe`)
  chocan con la cadena de s2m1 (registro §5, punto 4).
- Quién abrió el adjunto (registro §5, punto 5): ni nombre ni puesto; la voz dice que «se abre el adjunto».
- El intervalo del beacon (registro §5, punto 3) y el campo `signed` (punto 2): ni se dicen ni se enseñan.
- lab2a y lab2c: el vídeo habla solo en ATT&CK (Persistence, nunca la fase Installation de la Kill Chain) y no
  clasifica nada en Courses of Action (ni la búsqueda del hash ni la regla).
- El peldaño IP addresses se queda en gris porque el árbol de la lección no trae ninguna IP. La IP del C2
  (`185.220.x.x`) no se añade desde E7: no forma parte de este árbol, y la voz no da ninguna razón al respecto.
- No se culpa a nadie de Meridian: ni a quien abrió el adjunto ni al SOC por no verlo el 2-3.

### V8 · s3m5 · Cápsula · «¿Bloqueo este dominio? Indicadores, STIX y TAXII»

> **Aprobada por Lidia el 2026-10-03**, tal cual y con las recomendaciones de la ronda de diseño, y guion congelado ese día tras su visto bueno (rama `video-stix-isac`,
> desde `main` con V6 ya fusionado). La versión vigente de escenas y guion es `video/stix-isac/storyboard.json` +
> `narration.json`; qué se quedó fuera, en `video/stix-isac/out/script-notes.md`.
>
> **Producido y publicado el 2026-10-04**: YouTube `KO4REQeaKgM` (lo subió Lidia), 3:53, 6 escenas, 4 tarjetas, 1
> pregunta, 1 mensaje de HOLLOW LANTERN con la voz de V4, voz de Lidia (31 de 31 frases importadas, sin las tomas repetidas; dos
> frases del guion se ajustaron a lo grabado), música de V4. En la lección s3m5, después del check «TAXII ; STIX» y
> antes de «YARA en 60 segundos». La grabación quedó al 92 % del estimado, como se calculó. El canon nuevo está en
> `docs/superpowers/canon/velvet-cicada.md` (cronología y §7).
>
> **Ajustes al abrirla** (el guion ya los lleva; la tabla de escenas de abajo es la ficha original):
> - Las dos tarjetas que caían en la última frase de su escena llevan detrás el «o sea, que…» que cierra su capítulo:
>   s03 (`wrap`, capítulo I) y s05 (`close`, capítulo II). La de s05 va en la misma frase que la marca TLP.
> - Duración: 218 s de escenas, como V7. Guion de ~550 palabras, estimado ~4:13; con el ritmo de Lidia, ~3:55.
> - La pregunta para pensar sigue en 48 caracteres, el máximo; en el cierre, en pantalla, «Tu turno», no «Ahora te toca».
> - Retoques de la lección s3m5 en la PR del vídeo (recomendados en la revisión de GCTI): «used-by» pasa a «uses»,
>   «el ISAC empuja» pasa a «publica en una colección y tu TIP lo recoge», y el JSON gana `"modified"`.
> - **No** se renombra el intrusion set STIX de S4 (`s4.ts:1016`): el registro apunta la lectura (GLASS VIPER, el loader
>   y el nombre de los vendors; VELVET CICADA, el intrusion set en el modelo de Meridian).
>
> **Cambios de las revisiones del 2026-10-03** (exactitud y naturalidad; el guion y `storyboard.json` ya los llevan, la
> tabla de escenas no):
> - **Mensaje nuevo de HOLLOW LANTERN:** «Ese dominio lo tiré hace meses. Ya no te sirve para nada.» (58). Con el
>   anterior («Bloquéalo, si te hace ilusión») no quedaba error que rebatir, porque s03 ya ha descartado el bloqueo; el
>   nuevo trae el error que la ficha quería corregir (que un aviso caducado no sirve para nada).
> - s04: el nodo es el del indicador, «indicator · cdn-sync-status.example» (en STIX 2.1 `indicates` solo sale de un
>   `indicator`), y la fuente del ISAC conserva AMBER+STRICT tras la fusión.
> - s03: «hasta donde llegue lo que guardas» se queda; el EDR «llega hasta abril» (solo cubre del 03-04 al 18-04).
> - s01: «seguías al grupo sobre todo con tus datos» (el ISAC ya era fuente del CMF); s02 nombra «indicador» antes de
>   usarlo; s05 cierra con «el contexto viaja dentro de la carta, y tu plataforma la recoge».
> - La lección s3m5 cambia además «patrón del dominio C2» por «patrón de un dominio del actor»: el indicador del
>   ejemplo es el de entrega, no el C2.

- **Carpeta:** `stix-isac` · perfil `capsula-yt` (190–260 s renderizados; objetivo ~4:00, sin rellenar) · dominio del
  curso **Collection** (S3 · Fuentes de colección: las tarjetas llevan `"objective": "Collection"` y la insignia dice
  «GCTI») · adversario HOLLOW LANTERN, un mensaje interceptado, con la voz que ya existe de V4
  (`"adversaryVoice": { "voice": "sapi/Microsoft Pablo", "rate": 0, "fx": "machine" }`) · voz `recording/lidia` con
  `"recording": { "tempo": 1.08, "maxPauseMs": 250 }` · música de V4 y V5 (`Go On Going - Stayloose.mp3`) ·
  `video.json`: `"track": "gcti"`, `"lesson": "s3m5"`, `"adversary": "HOLLOW LANTERN"`.
- **Duración:** suma de `s` = **218 s** (`wordBudget` total de unas 588 palabras, a 2,7 por segundo); renderizado
  estimado, **unos 240 s (4:00)**, sumando la pausa de la pregunta (4,5 s), la del mensaje (3,5 s) y los márgenes de la tubería. El
  techo del perfil es 260 s y V4 acabó 100 s por encima de su suma: el guion no pasa del presupuesto de palabras de
  ninguna escena.
- **Inserción:** en `src/data/s3.ts`, lección s3m5, después del segundo check del apartado STIX/TAXII («Your TIP polled
  a collection on the ISAC server…», que termina en `:1107`) y antes del encabezado «YARA en 60 segundos» (`:1108`),
  como bloque `youtube` (`{ t: 'video', title, youtube, poster, transcript }`). Cierra la mitad STIX/TAXII de la
  lección y deja YARA para el Lab 3B. Se fija en la suite `lesson videos` de `src/data/content.test.ts`, junto a los
  otros tres (`:270-274`). No va entre `:1053` y `:1055`: ese párrafo acaba en dos puntos que presentan el JSON.
- **Laboratorios:** ninguno de S3 ejercita STIX ni TAXII. `lab3a` (Pivot Hunt): ni un nombre suyo ni una pista.
  `lab3b` (YARA Forge): queda fuera con YARA. `lab3c` (CMF Builder) tiene la categoría «ISAC / peers»: el vídeo enseña
  un indicador que llega de un ISAC, pero nunca plantea qué fuente responde a qué pregunta.
- **Lo que se lee no se deletrea:** la voz dice «el dominio», «el ISAC», «el loader», «el grupo que sigues»; el
  dominio, la IP, el identificador del ISAC y los nombres GLASS VIPER y VELVET CICADA van solo en pantalla. Tampoco
  se leen los nombres de campo (`valid_until` es «la fecha de caducidad»). La confianza se dice «70 sobre 100», nunca
  como porcentaje ni como probabilidad.
- **Lo que se decide es este aviso, no el dominio:** la voz habla siempre de «este aviso» y nunca dice que el dominio
  no se bloquee, porque el indicador propio de Meridian para ese dominio (`s5.ts:600-606`) sigue vigente el 2-7. El
  botón «Bloquear» late en la tarjeta del objeto que entra, nunca en el nodo del dominio.
- **Etiquetas propuestas** (`"tags"` de `video.json`): «STIX», «TAXII», «indicadores de compromiso», «IOC»,
  «inteligencia de amenazas», «threat intelligence», «ISAC», «TLP», «GCTI», «CTI».
- **Enfoque («un aviso con fecha de caducidad»):** el caso de la propia lección, con sus datos tal cual. El 2026-07-02
  (el «hoy» de `s3.ts:1076`) llega a la plataforma de inteligencia de Meridian el indicador STIX 2.1 que el ISAC
  aeroespacial creó el 2026-03-11 para `cdn-sync-status.example`, válido hasta el 2026-06-25 (`s3.ts:1059-1072`). La
  tentación es el botón de bloquear; el vídeo enseña a leerlo antes: qué trae, qué significa su fecha, qué hacer con
  él, cómo se guarda con su contexto y por dónde ha llegado. Recoge lo que V4 dejó para esta lección (la edad de los
  indicadores, `video/pivot-infra/out/script-notes.md`). HOLLOW LANTERN, el equipo de infraestructura del adversario,
  presume de haber tirado ese dominio hace meses: la narradora le da la razón en el dato y se la quita en la
  conclusión. Una frase sitúa a quien no ha visto nada: eres la analista de inteligencia de Meridian, una aeroespacial
  a la que un grupo lleva meses atacando; hasta ahora lo seguías sobre todo con tus datos, y hoy te llega un aviso de
  fuera, en STIX (el ISAC ya era fuente de avisos en el CMF de Meridian, `s3.ts:73`).

**Conceptos (3) y su imagen:**

| # | Concepto | Imagen que se mantiene | Tarjetas |
|---|---|---|---|
| 1 | Un indicador que llega se lee antes de meterlo en ningún sitio: quién lo dice (la fuente), cuánto se fía (confianza, 70 sobre 100), con quién se puede compartir (la marca TLP) y hasta cuándo vale (`valid_until`). Los indicadores envejecen porque los dominios y las IP cambian de manos. Si el aviso ha caducado, no va al bloqueo a ciegas: sirve para buscar hacia atrás en tus registros (retro-hunt), y cuanto antes, porque esa búsqueda solo llega hasta donde llega lo que guardas. Y si tus datos lo ven vivo hoy, manda tu evidencia, no la fecha de otro | El aviso de los vecinos sobre el número de un timador: quién avisa, cuánto se fía, a quién se lo puedes contar y hasta cuándo vale. Un número que se da de baja acaba siendo de otra persona; tu registro de llamadas sí te dice si te llamó cuando era suyo | «Listo para ingerir: patrón, validez, confianza y fuente» · «valid_until vencido: buscar hacia atrás, no bloquear» |
| 2 | STIX guarda el contexto como un grafo: las relaciones (que también son objetos y viajan con el dato) unen el indicador al malware y el malware al intrusion set. Dicen qué significa un acierto y qué hacer después. El mismo indicador de dos fuentes no se guarda dos veces: se fusiona y conserva las dos | Un número apuntado en un pósit frente al mismo número en tu agenda: con nombre, de qué lo conoces y quién te lo pasó. Si lo tienes dos veces, fusionas los contactos | «Relaciones STIX: el contexto viaja con el dato» |
| 3 | STIX describe: es el lenguaje, lo que se cuenta y con qué contexto, marca TLP incluida. TAXII transporta: el servidor guarda colecciones y el cliente pasa a consultarlas (pull) | La carta y el correo. La colección es el apartado de correos del ISAC, adonde tu plataforma pasa a recoger | «STIX describe; TAXII transporta» |

**Escenas:** seis, en tres capítulos (Leer el aviso · Contexto y transporte · Para el examen).

| Escena | Cap. | s | Qué se ve | Qué se aprende · cues |
|---|---|---|---|---|
| s01-hook «Un aviso y un botón» | I Leer el aviso | 24 | La plataforma de inteligencia (TIP) de Meridian, con la fecha «02-07-2026». Entra un objeto nuevo, remitente «ISAC aeroespacial», con `cdn-sync-status.example`; en su tarjeta (no en el dominio) late un botón «Bloquear»; lo demás, atenuado. Título «¿Bloqueo este dominio? Indicadores, STIX y TAXII» antes de los 10 s. Tres chips de la promesa: «su fecha · su contexto · cómo llega». Tira de contexto: «Meridian Dynamics · aeroespacial · meses en el punto de mira» y, debajo, el puente: «hasta ahora: sobre todo tus datos · hoy: un aviso de fuera, en STIX» | La promesa: decidir si un indicador que llega entra en tus sistemas; contexto para quien no vio V3 ni V4 · `tip, incoming, block, title, promise, bridge` |
| s02-lectura «Lo que trae el aviso» | I | 42 | El JSON de la lección, tal cual (`s3.ts:1059-1072`), con la cabecera «Indicador STIX 2.1 · ISAC aeroespacial». Se amplía un campo cada vez y se atenúa el resto: `pattern` con `cdn-sync-status.example`; `created_by_ref` `identity--aero-isac-share-0001`, rotulado «quién lo dice: el ISAC»; `confidence: 70`, rotulado «70 sobre 100»; `object_marking_refs` `tlp-amber-strict`, rotulado «solo dentro de Meridian». A la derecha, la nota de los vecinos se rellena al mismo compás: «número de un timador · avisa: la asociación · se fían: bastante · no lo cuentes fuera de casa». Después, `valid_until: 2026-06-25` junto a un calendario con «hoy · 02-07-2026», y la nota añade «vale hasta el 25 de junio». Con la comparación ya hecha y el calendario atenuado, la tarjeta; se va antes de la pregunta para pensar | Un IOC útil trae su contexto: fuente, confianza, marca y validez; los indicadores caducan porque la infraestructura cambia de manos · `json, pattern, source, confidence, tlp, context, until, today` · **think** |
| s03-caducado «Caducado para bloquear» | I | 44 | Respuesta: en la tarjeta del objeto entrante, «bloquear este aviso» se tacha y «mirar atrás» se marca. En la nota de los vecinos, el número puede pasar a otra dueña (el icono de una clínica) y el candado cae sobre ella: «a ciegas, castigas a quien lo herede». Mensaje interceptado. Respuesta: la revalidación que se ve es solo el passive DNS, la fila de s3m4 `198.51.100.84 · last seen 2026-04-18 11:31:55`, ampliada y con «nada después»; debajo, la regla «si lo ves vivo hoy, manda tu evidencia». La búsqueda, sobre un registro de llamadas que corre hacia atrás: una línea de tiempo del 27-02 (registro del dominio) al 02-07 con su tramo visto (27-02 a 18-04) sombreado y las dos barras de retención del CMF de Meridian (`s3.ts:68-69`): «EDR · 90 días · desde el 03-04», que alcanza el final del tramo, y «proxy · 30 días · desde el 02-06 · ya no llega», en gris. Rótulo: «retro-hunt · hasta donde llegue lo que guardas». Sin resultados en pantalla. La tarjeta llega al final, con las barras ya atenuadas | Este aviso caducado no va al bloqueo a ciegas: se busca hacia atrás, y ya, porque la búsqueda vale lo que dure lo que guardas; la evidencia propia manda sobre la fecha ajena · `strike, reassigned, dns-last, own-evidence, retention, retro-hunt` · **intercept** |
| s04-grafo «Un pósit o un contacto» | II Contexto y transporte | 46 | En pantalla: «¿y si aparece en tus registros?». A la izquierda, un pósit con `cdn-sync-status.example`, solo. A la derecha, el mismo dominio como nodo en la plataforma de Meridian, con dos relaciones que se encienden por turnos: `indicator` «indicates» `malware · loader GLASS VIPER`; `intrusion-set · VELVET CICADA` «uses» ese malware. Chip práctico: «si aparece: busca el loader en ese equipo». Sobre una arista, «relationship · también es un objeto STIX». Después, el objeto del ISAC entra por un lado y se funde con el nodo (el icono de fusionar contactos); quedan dos fuentes: «incidente propio · correo del 02-03» e «ISAC aeroespacial · 11-03 · confianza 70 · caducado» | Las relaciones dicen qué significa un acierto y qué hacer; un indicador, un solo nodo con todas sus fuentes · `postit, graph, indicates, uses, action, relationship, merge, sources` |
| s05-taxii «La carta y el correo» | II | 36 | Una carta y su sobre: dentro, el JSON de s02 en miniatura con el rótulo «STIX · qué se cuenta y cómo»; el sobre, «TAXII · cómo llega». El servidor TAXII del ISAC, con una fila de apartados de correos (las colecciones). La plataforma de Meridian pasa a recoger: «consulta (pull) · 02-07 · primera vez: llega todo lo que había», y entre los sobres sale el del 11-03. La marca `tlp-amber-strict` se ilumina dentro de la carta, no en el sobre | STIX es el lenguaje y lleva el contexto y la marca; TAXII es el transporte: colecciones que el cliente consulta · `letter, envelope, collection, pull, backlog, marking, mnemonic` |
| s06-recap «Tres reglas» | III Para el examen | 26 | Tres tarjetas de reglas, cada una con su imagen en miniatura (la nota de los vecinos, la agenda, la carta); tarjeta final Alertópolis: «Ahora te toca: las preguntas de la lección» (s3m5, 10 preguntas) | Reflejos · `recap, rule-1, rule-2, rule-3, next, endcard` |

- **Exam cards** (dominio Collection), una por escena de s02 a s05:
  - «Listo para ingerir: patrón, validez, confianza y fuente» (s02, 55 caracteres; sale después del calendario y antes
    de la pregunta)
  - «valid_until vencido: buscar hacia atrás, no bloquear» (s03, 52)
  - «Relaciones STIX: el contexto viaja con el dato» (s04, 46)
  - «STIX describe; TAXII transporta» (s05, 31)
- **Think prompt:** «Caducó hace una semana. ¿Bloqueas o miras atrás?» (s02, 48 caracteres; `holdMs` 4500). s03 abre con la
  respuesta: este aviso no va al bloqueo, se mira atrás, porque el ISAC ya no responde de él y bloquear a ciegas puede
  castigar a quien herede el dominio (`s3.ts:1076`). La voz: «lo que hizo con él puede seguir en tus registros, hasta
  donde llegue lo que guardas; por eso se busca ya». Es el momento de examen de la escena: la búsqueda hacia atrás vale
  lo que dure lo que guardas (proxy 30 días, EDR 90, en el CMF de `s3.ts:68-69`).
- **Mensaje interceptado** (s03, capítulo I, `holdMs` 3500):
  «Ese dominio lo tiré hace meses. Bloquéalo, si te hace ilusión.» (62 caracteres). El error concreto: que un indicador caducado ya no sirve para nada, como si solo sirviera
  para bloquear. La narradora le da la razón en el dato (el passive DNS no lo ve desde el 18 de abril, y por eso este
  aviso no va al bloqueo) y se la quita en la conclusión: lo que hizo con ese dominio puede seguir en tus registros,
  hasta donde llegue lo que guardas, y se busca hacia atrás ya.
  Mantiene su voz de V4 (tutea, frases cortas, ironía) y no contradice sus tres mensajes publicados; encaja con V4 s08
  («queda quemado y el actor pasa al siguiente»).
- **Cierre:** tres reglas y una sola tarea.
  1. Antes de meter un aviso en el bloqueo, lee su fecha: si ha caducado, busca hacia atrás, y cuanto antes.
  2. Un indicador, un solo nodo: con sus relaciones y todas sus fuentes.
  3. No confundas la carta con el correo: STIX describe, TAXII transporta.

  Tarea: las preguntas de la lección (s3m5, 10 preguntas). No se manda al Lab 3B porque el vídeo no enseña YARA.

**Se queda fuera** (y dónde está):
- **YARA entera:** la anatomía `meta`/`strings`/`condition` y las condiciones combinadas (`s3.ts:1108-1148`, preguntas
  s3m5q4 y s3m5q5) y el Lab 3B. Es la otra mitad de la lección; si hace falta, otra cápsula (backlog).
- **La tabla TLP completa y el «fumble» de TLP:** s3m4 (`s3.ts:807-830`). Aquí solo sale la marca del objeto,
  AMBER+STRICT, en una frase.
- **A qué cola se manda cada indicador** según su confianza y su fuente (`s3.ts:1076`), y el reparto por destino
  (dominios al proxy, hashes al EDR), que es de S5 (`s5.ts:622`).
- **Los demás objetos STIX** de la lista (`threat-actor`, `campaign`, `attack-pattern`, `s3.ts:1043`); campaign frente
  a intrusion set y la relación `attributed-to` son de S4 (`s4.ts:1003-1043`).
- **Los channels de TAXII** (publicación y suscripción, pregunta s3m5q6): TAXII 2.1 reserva el nombre pero no los
  define. El vídeo solo enseña colecciones.
- **La deuda del SOC y las listas de 500.000 entradas** (`s3.ts:1038,1076`): se quedan en una imagen (la clínica), sin
  cifra.
- **El caso «caducado pero sigue activo»** (s3m5q8): una línea en s03; el detalle, en la pregunta.
- **Los resultados de la búsqueda hacia atrás:** no se enseñan (ver «No se toca»).

**Canon nuevo que fija V8** (nada de esto estaba en los datos del curso; lo posterior debe respetarlo):
- **2026-07-02 (jueves), sin hora: el «hoy» de la lección** (`s3.ts:1076`), que el registro todavía no apunta. Ese
  día la plataforma de inteligencia de Meridian consulta **por primera vez** la colección TAXII del ISAC aeroespacial
  (pull) y se trae todo lo que había, entre ello el indicador del 2026-03-11 (`s3.ts:1063`). Así se explica que un
  indicador de marzo llegue en julio. El ISAC ya mandaba avisos antes por otra vía (es fuente del CMF de Meridian,
  `s3.ts:73`, y de la prueba E4 de s4m3, `s4.ts:431-432`); por TAXII, solo desde el 2-7. La colección no tiene nombre
  en pantalla. Nada de la cronología del registro
  ocurre después, salvo los rangos abiertos (la actividad del Cluster-B, de abril de 2026 hasta hoy, en `s4.ts:732`).
- **La revalidación del 2026-07-02:** el passive DNS de `cdn-sync-status.example` sigue acabando en la fila de s3m4,
  `198.51.100.84 · last seen 2026-04-18 11:31:55` (`s3.ts:776`): nada después. Cuadra con el mensaje de HOLLOW
  LANTERN. La revalidación que se ve es solo esa; el WHOIS no sale.
- **Límite de lo que puede decir la voz (WHOIS):** el registro no caduca hasta el 2027-02-27 (`s3.ts:765`), así que
  el 2-7 el dominio sigue a nombre del servicio de privacidad. La voz solo dice que **puede** cambiar de manos, y
  castiga «a quien lo herede», nunca «a quien lo tenga ahora».
- **La búsqueda hacia atrás:** ventana desde el 2026-02-27, el día en que se registró el dominio (`s3.ts:763`), con
  las retenciones del CMF de Meridian (`s3.ts:68-69`): el EDR guarda 90 días (desde el 2026-04-03, así que alcanza el
  final del tramo visto, hasta el 18-4) y el proxy 30 (desde el 2026-06-02: ya no llega). El correo y el DNS interno
  no llevan barra, porque el CMF no da su retención. Sin resultados en pantalla.
- **El grafo de la plataforma de Meridian:** `cdn-sync-status.example` «indicates» `malware · loader GLASS VIPER`
  (el dominio entregó el loader en el correo del 2026-03-02, `s2.ts:68-83`); `intrusion-set · VELVET CICADA` «uses»
  ese malware. Es el ejemplo de la lección (`s3.ts:1048`) con el sentido que marca STIX 2.1: el intrusion set usa el
  malware («used-by» no es un tipo de relación). En S3 el loader ya se llama «GLASS VIPER stage-1» (`s3.ts:62,326`) y
  el grupo, VELVET CICADA (`s3.ts:310`). Solo nombres: ni hash, ni ruta, ni fechas de validez del registro propio.
- **Tras la fusión, dos fuentes en el mismo nodo:** «incidente propio · correo del 02-03» e «ISAC aeroespacial ·
  11-03 · confianza 70 · caducado». La del ISAC conserva sus fechas; la propia no enseña ninguna.
- **HOLLOW LANTERN «tiró» el dominio hace meses** (su palabra, sin fecha): encaja con el passive DNS y con V4 s08.
- **No se toca:** el dosier de DEEP WELL (certificados y `kazuo.tanji@` que llevan a una sola organización): el grafo
  no incluye el C2, el certificado ni el correo de registro. Ningún nombre del Lab 3A. De S4, ni el intrusion set STIX
  de GLASS VIPER (`s4.ts:1013-1021`, `first_seen` 2025-11-03) ni la campaña «PO-REVISION phishing wave» ni
  `attributed-to`. De S5, ni el indicador propio de Meridian para este dominio (`s5.ts:596-607`: del 18-4, válido
  hasta el 18-7) ni la ola de phishing del 18-4 (`s5.ts:47-58`): por eso no se enseñan resultados de la búsqueda ni
  fechas del registro propio, y la voz no dice que Meridian no lo esté bloqueando. No se culpa a nadie: ni a RR. HH.
  por el correo del 2-3 ni al ISAC por la fecha de caducidad.

### V9 · s4m3 · Principal · «ACH: gana la hipótesis que no puedes tumbar»

> **Aprobada por Lidia el 2026-10-04**, tal cual, y guion congelado ese día tras su visto bueno, con una decisión de la ronda de diseño: PAPER CRANE habla con el efecto
> `machine` de siempre y la voz `sapi/Microsoft Laura` (no hay efecto nuevo). Rama `video-ach-matriz`, que sale de
> `video-stix-isac` porque V8 aún no estaba fusionado. Se graba sola (V8 ya se grabó el 2026-10-03). La versión
> vigente de escenas y guion es `video/ach-matriz/storyboard.json` + `narration.json`; qué se quedó fuera, en
> `video/ach-matriz/out/script-notes.md`.
>
> **Producido y publicado el 2026-10-04**: YouTube `TjVViiBTeds`, 8:25, 10 escenas, 7 tarjetas, 2 preguntas, 3 mensajes
> de PAPER CRANE (voz `sapi/Microsoft Laura` con `machine`), voz de Lidia, música de V4 y V5. En la lección s4m3, después
> del cuarto check y antes del callout de campaña que manda al Lab 4B. La grabación quedó en 8:25 frente a los 9:14
> estimados (91 %), en la línea de V7 y V8. El canon nuevo está en `docs/superpowers/canon/velvet-cicada.md` (§7).
>
> Sobre el esbozo del plan (§5): se mantiene todo (matriz celda a celda, la fila sin diagnosticidad que se apaga, gana la
> menos inconsistente, sensibilidad retirando E4) y se usa el extracto de la lección (`src/data/s4.ts:421-437`), no la
> solución del Lab 4B. Lo nuevo: de las técnicas estructuradas entran dos, Key Assumptions Check y Devil's Advocacy, y
> la primera aparición de PAPER CRANE. No hace falta ningún ajuste por el validador: 7 tarjetas en 10 escenas, como
> mucho una por escena y ninguna en el cierre; 3 mensajes en tres capítulos distintos.

- **Carpeta:** `ach-matriz` · perfil `principal-yt` (380–600 s renderizados) · objetivo GCTI **Analysis** (dominio del
  curso de S4, `src/data/course-gcti.ts:70`, y de todas las preguntas de s4m3); las tarjetas llevan
  `"objective": "Analysis"` e insignia «GCTI» · adversario **PAPER CRANE** (`src/data/course-gcti.ts:74-76`), primera
  aparición en pantalla, tres mensajes interceptados · voz `recording/lidia` con
  `"recording": { "tempo": 1.08, "maxPauseMs": 250 }` · voz del adversario: **`sapi/Microsoft Laura` con el efecto
  `machine`** (decidido el 2026-10-04; el motor solo trae `machine`, `video/engine/scripts/lib/adversary.mjs:5`, el de
  SILENT PAGER, GLASS VIPER y HOLLOW LANTERN, que hablan con Pablo) · música de V4 y V5 (`Go On Going - Stayloose.mp3`).
- **`video.json`:** `"profile": "principal-yt"`, `"track": "gcti"`, `"adversary": "PAPER CRANE"`, `"lesson": "s4m3"`,
  la música de arriba y `"tags"` para YouTube (ACH, analysis of competing hypotheses, análisis de hipótesis en
  competencia, structured analytic techniques, key assumptions check, diagnosticity, threat intelligence, GCTI).
- **Ritmo:** `"examTiming": "sentence-end"`; preguntas con `think.holdMs` 4500; mensajes con `intercept.holdMs` 3500–3800.
  En s08 el mensaje abre la escena y la pregunta llega dos segmentos después (el validador no deja los dos en el mismo
  segmento).
- **Duración:** suma de `s` **458 s**; renderizado estimado **~8:00–8:20** (458 s + 15–20 s de márgenes de la tubería
  + ~20 s de silencio de los tres mensajes y las dos preguntas). Es una estimación: V4 (400 s de escenas) salió en
  8:08 y V5 (562 s) en 8:19. No se rellena. `wordBudget` a 2,7 palabras/s: 97, 113, 135, 124, 162, 124, 135, 151, 113
  y 81.
- **Inserción:** en `src/data/s4.ts`, lección s4m3, después del cuarto check («Evidence that is consistent with every
  hypothesis in the matrix:», `:488-502`) y antes del callout de campaña «Campaña» que manda al Lab 4B (`:503`),
  como bloque `youtube`:
  `{ t: 'video', title: 'ACH: gana la hipótesis que no puedes tumbar', youtube: '<id>', poster: 'videos/ach-matriz-poster.png', transcript: 'videos/ach-matriz-transcript.txt' }`.
  Igual que V4 en s3m3: el orden queda lección, checks, vídeo y laboratorio, porque el vídeo resume la lección entera
  (técnicas, pasos, matriz y sensibilidad) y termina mandando al Lab 4B. La alternativa de V3 en s2m3, antes de los
  checks, se descarta por eso mismo: aquí los checks repasan la matriz, y el vídeo va más allá. Se fija en la suite `lesson videos` de
  `src/data/content.test.ts`, junto a los de V3, V4 y V5 (`:270-274`).
- **Enfoque («todo encaja»):** la reunión de análisis de Meridian, la de la misión 4 (`src/data/labs.ts:149`). La sala
  ya tiene respuesta: espionaje, porque las cuatro pruebas encajan. El CISO pregunta qué busca el intruso, porque de eso
  depende qué se protege primero. El vídeo no le lleva la contraria a la sala: le enseña a ganarse esa respuesta.
  Primero saca a la luz lo que todos dan por hecho (que no hay otra explicación y que las pruebas son lo que parecen);
  después pone las tres hipótesis de la lección a competir en su matriz, celda a celda; la fila del phishing se apaga
  porque vale para las tres; gana la que menos choca; y al final se quita la prueba más fuerte, E4, para ver si la
  conclusión se sostiene. PAPER CRANE sale por primera vez y no defiende ninguna hipótesis: empuja atajos de método
  (fiarse de todo, contar lo que encaja, tirarlo todo en cuanto una prueba falla), y la narradora enseña qué se rompe
  con cada uno. La conclusión es provisional: cuatro pruebas de un extracto; la matriz completa es el Lab 4B.
- **Laboratorios:** el Lab 4B ya ejercita ACH (penalización L=1 del ranking). El vídeo aporta el porqué (refutar en
  vez de confirmar, diagnosticidad, sensibilidad) y la demo sobre las 12 celdas del extracto de la lección, con las
  valoraciones de la lección. Nunca enseña las otras cuatro pruebas del laboratorio, sus valoraciones, sus notas ni su
  mecánica (24 celdas y comparar con la solución experta, `src/data/labs.ts:862-930`). Del Lab 4A (sesgos,
  `src/data/labs.ts:447-499`) no sale ninguna de sus ocho frases en la sala.
- **Lo que se lee no se deletrea:** el vídeo casi no tiene identificadores; las etiquetas E1–E4 y H1–H3 y el texto de
  cada fila van en pantalla, y la voz dice qué son («la entrada por phishing», «seis meses sin cobrar nada», «un
  certificado que se repite en una campaña de espionaje»). La voz dice «el intruso»; el nombre VELVET CICADA solo sale en
  el título de la matriz, como en la lección.
- **Se queda fuera:**
  - What-If Analysis y brainstorming estructurado: solo como fichas en pantalla en s02 (`src/data/s4.ts:382-383`).
  - La lista de los ocho pasos de ACH (`src/data/s4.ts:393-404`): el vídeo recorre 1, 2, 3, 4, 6, 7 y 8; el 5 (refinar
    y eliminar) queda dentro de s07.
  - Cómo se expresa la confianza (la escala de ICD 203 y la diferencia entre probabilidad y confianza): s5m2
    (`src/data/s5.ts:294`, `:335`). La nota de s09 dice «moderada» y una tira aparte, fuera de la nota, remite ahí.
  - Qué evidencia es barata de falsificar y la tabla de false flags: s4m5 (`src/data/s4.ts:1060-1075`).
  - Los sesgos y las falacias concretas: s4m1 y s4m2 (en s02 solo asoman, tenues, dos nombres de sesgo).
  - La matriz completa de ocho pruebas: Lab 4B.

**Conceptos (4) y su imagen:**

| # | Concepto | Imagen que se mantiene | Tarjetas |
|---|---|---|---|
| 1 | Técnicas estructuradas: el razonamiento sale de la cabeza a algo que otros pueden revisar, porque los sesgos no se quitan con fuerza de voluntad. Devil's Advocacy: alguien defiende a propósito la postura contraria. Key Assumptions Check: escribes lo que das por hecho y le preguntas «¿y si es falso?» | Palparte el bolsillo antes de salir de casa: das por hecho que llevas el móvil y la cartera. Vuelve en s08, cuando se retoma el segundo supuesto (sin llaves: la llave ya es el certificado en V4 y la persistencia en V7) | «Devil's Advocacy: alguien defiende la postura contraria» · «Key Assumptions Check: ¿y si este supuesto falla?» |
| 2 | ACH: todas las hipótesis primero, con el equipo, y se intenta tumbar cada una; cada prueba contra cada hipótesis (C, I o N). Gana la menos inconsistente, no la más confirmada: una sola inconsistencia sólida basta para descartar | El yogur que falta en la nevera y tres sospechosos: tu compañera de piso, tu hermano, que vino de visita, y el perro. No buscas quién pudo, sino quién no pudo. El perro tiene cinco cosas a favor y una en contra: no sabe abrir la nevera | «ACH: primero todas las hipótesis, luego la evidencia» · «Gana la menos inconsistente, no la más confirmada» |
| 3 | Diagnosticidad: una prueba vale por lo que separa, no por lo llamativa. La que encaja con todas las hipótesis no mueve nada (E1, la entrada por phishing) | En la misma cocina, la nota «tenía hambre», que se pega a los tres sospechosos a la vez y no aparta a ninguno | «Diagnosticity: si encaja con todas, no discrimina» |
| 4 | Sensibilidad e informe: qué prueba, si fuera falsa, cambiaría la conclusión; se quita y se vuelve a contar. Si aguanta, la conclusión es robusta; si depende de ella, baja la confianza. El informe lleva la ganadora, su confianza, las descartadas con su porqué y la prueba que hay que vigilar | La conclusión como una mesa sobre sus patas: quitas una y miras si sigue en pie. Un taburete de una sola pata se cae. Vuelve en miniatura en el informe y en el cierre | «Sensitivity: ¿qué prueba, si cae, cambia la conclusión?» · «Informe: ganadora, confianza y descartadas con su porqué» |

Los conceptos 2 y 3 comparten la cocina del yogur a propósito: es la misma escena con otro detalle, no una imagen nueva.

**Escenas:** diez, en cinco capítulos (Todo encaja · Hipótesis en competencia · Lo que discrimina · ¿Y si una prueba
miente? · Para el examen).

| Escena | Cap. | s | Qué se ve | Qué se aprende · cues |
|---|---|---|---|---|
| s01-hook «Todo encaja» | I Todo encaja | 36 | La reunión de análisis de Meridian. La pizarra con cuatro notas, las pruebas del extracto en corto («entrada por spearphishing», «6 meses sin cifrar ni extorsionar», «exfiltración selectiva de diseños de propulsión», «certificado TLS compartido con una campaña de espionaje que reportó el ISAC») y en el centro «ESPIONAJE», rodeado, con «todo encaja» debajo; junto a cada nota, la palabra «encaja» (nunca un visto; la letra C no sale hasta la leyenda de s05). Título antes de los 10 s. La promesa en tres iconos: una lista con una interrogación (lo que das por hecho), una cuadrícula (la matriz) y una mesa (la prueba que la sostiene). Tira con la pregunta del CISO: «¿Qué busca el intruso?» y debajo «de eso depende qué se protege primero» | Que todo encaje no demuestra nada. La promesa: poner tus hipótesis a competir con ACH y saber qué prueba sostiene tu conclusión · `room, fits, title, promise, ciso, stakes` |
| s02-fuera «Sácalo de la cabeza» | I | 42 | Una cabeza de perfil con ideas que se enredan; asoman, tenues, «confirmation bias» y «anchoring». Las ideas salen y se ordenan en una hoja: STRUCTURED ANALYTIC TECHNIQUES. Cinco fichas (Key Assumptions Check, Devil's Advocacy, What-If Analysis, brainstorming estructurado, ACH); se amplía Devil's Advocacy y el resto se atenúa. En la sala, alguien del equipo recibe una ficha «abogada del diablo · defiende lo contrario» y escribe en la pizarra «¿y si es un rescate?» | Los sesgos no se quitan con fuerza de voluntad: el razonamiento se saca a una estructura que otros revisan. Devil's Advocacy · `head, paper, sats, devil, contrary` |
| s03-supuestos «Lo que das por hecho» | I | 50 | Mensaje interceptado. Ficha de PAPER CRANE: «célula de engaño · siembra pistas falsas». La hoja KEY ASSUMPTIONS CHECK se escribe a mano con dos supuestos: «1 · no hay otra explicación» y «2 · las pruebas son lo que parecen». Junto a cada uno aparece «¿y si no?» y se abre: el 1 deja tres huecos de hipótesis vacíos; el 2, una mesa pequeña con la etiqueta «lo comprobamos al final». La analogía: en la puerta de casa, una mano se palpa el bolsillo buscando el móvil y la cartera | Lo que nadie dice en voz alta es lo primero que se comprueba: se escribe y se le pregunta «¿y si es falso?». Key Assumptions Check · `crane, sheet, assume-1, assume-2, pocket, kac` · **intercept** |
| s04-hipotesis «Todas a la vez» | II Hipótesis en competencia | 46 | El nombre ANALYSIS OF COMPETING HYPOTHESES y «Richards Heuer». La cocina: falta un yogur en la nevera y hay tres sospechosos en silueta (la compañera de piso, el hermano de visita y el perro); sobre cada uno, «¿pudo?» se convierte en «¿no pudo?». Vuelta a Meridian: los tres huecos de s03 se llenan con las hipótesis de la lección, H1 espionaje estatal-industrial, H2 ransomware o crimen financiero y H3 hacktivismo o insider, con iconos genéricos (nunca una persona de la plantilla). Una tira: «primero todas, con el equipo; después, las pruebas» | ACH: todas las hipótesis a la vez y se intenta tumbar cada una; no se busca lo que confirma a tu favorita · `ach, heuer, fridge, suspects, refute, hypotheses, all-first` |
| s05-matriz «Celda a celda» | II | 60 | **Demo:** la matriz de la lección (`src/data/s4.ts:421-434`), con su título «Extracto de matriz ACH · VELVET CICADA (ficticio)». Columnas H1–H3 y filas E1–E4 con su texto; leyenda «C = encaja · I = choca · N = no dice nada». Se rellena por filas; la celda que explica la voz se amplía y el resto se atenúa. E1 (spearphishing): C, C, C. E2 (6 meses, cero cifrado o extorsión): C, I, N, con la I de H2 resaltada y la nota «el ransomware cobra rápido». E3 y E4 entran más deprisa: C, I, I. Matriz completa, todavía sin recuentos ni columna de diagnosticidad. Pregunta para pensar, con las filas E1 y E2 resaltadas | Cada prueba contra cada hipótesis; una I es la prueba chocando con la hipótesis · `grid, legend, row-e1, row-e2, rows-e3e4, full` · **think** |
| s06-diagnosticidad «La pista que vale para todos» | III Lo que discrimina | 46 | La respuesta: se resalta E2. La fila E1 se vuelve gris y se desvanece; en la columna de la derecha aparece «NULA» en E1 y «ALTA» en E2, E3 y E4, como en la lección. Vuelve la cocina: la nota «tenía hambre» se pega a la vez a los tres sospechosos y no aparta a ninguno. Nombre: DIAGNOSTICITY. El contraste de la lección en dos líneas: «usa phishing: vale para las tres» frente a «nada de cobrar en seis meses: choca con el dinero». La tarjeta entra cuando ya no hay que leer la matriz | Una prueba vale por lo que separa, no por lo llamativa; la que encaja con todas no mueve nada · `answer, fade-e1, hungry, high-rows, diagnosticity` |
| s07-inconsistente «Gana la que no puedes tumbar» | III | 50 | Mensaje interceptado. Bajo la matriz, una cuenta de C por columna (4, 1, 1) que se tacha; debajo, la de I, la fila «Inconsistencias» de la lección: 0, 3, 2. H1 se enmarca: «la menos inconsistente». La cocina: el perro con cinco notas a favor («le encanta el yogur», «estaba en casa», «tenía hambre», «pone cara de culpable», «hay pelos en la cocina») y una en contra, en rojo: «no sabe abrir la nevera»; el perro sale de la fila. Una tira: «nadie demuestra una hipótesis; se descartan las demás» | Se cuenta lo que tumba, no lo que encaja; una inconsistencia sólida basta; la ganadora no es «la demostrada». Aquí las dos cuentas dan H1, y la voz avisa de que eso engaña (la C de E1 suma para las tres); el perro enseña dónde no coinciden · `count-c, count-i, least, dog, lethal, not-proven` · **intercept** |
| s08-sensibilidad «Quita una pata» | IV ¿Y si una prueba miente? | 56 | Mensaje interceptado. Vuelve la hoja de s03 con el supuesto 2 resaltado y, un instante, la mano que se palpa el bolsillo. En la fila E4, la etiqueta «strong link» y una nota: «justo lo que alguien podría plantar» (sin decir quién ni si pasó). Pregunta para pensar. La conclusión como tablero de mesa sobre tres patas, E2, E3 y E4 (E1 no es pata: no sostiene nada). Se quita la pata E4: la fila se atenúa, la cuenta pasa a 0, 2, 1 y la mesa sigue en pie. Contraste: un taburete de una sola pata, «solo E4», que se cae, con «baja la confianza». Nombre: SENSITIVITY ANALYSIS | Qué prueba, si fuera falsa, cambia la conclusión, y se vigila. Aquí aguanta sin E4 gracias a E2 y E3: conclusión robusta. Si dependiera solo de E4, bajaría la confianza · `assume-2, strong-link, pull-e4, recount, stands, stool, sensitivity` · **intercept** · **think** |
| s09-informe «Lo que llega al CISO» | IV | 42 | Una nota de una página se escribe línea a línea: «Juicio: H1, la menos inconsistente (extracto de 4 pruebas)» · «Confianza: moderada · 4 pruebas de un extracto; aguanta sin E4» · «Descartadas: H2 (E2, E3, E4) · H3 (E3, E4)» · «Vigilar: E4». La mesa de s08, en miniatura en una esquina: «se apoya en E2 y E3». Sello «provisional» (nunca «caso cerrado»). Fuera de la nota, dos tiras aparte: «cómo se dice la confianza: s5m2» y «la matriz completa, en el Lab 4B» | El informe lleva la conclusión, su confianza, las alternativas descartadas con su porqué y la prueba que hay que vigilar · `memo, verdict, confidence, discarded, watch, provisional` |
| s10-recap «Tres reglas» | V Para el examen | 30 | Tres tarjetas de reglas con sus iconos (lista con interrogación, cuadrícula, mesa); tarjeta final Alertópolis: «Ahora te toca: Lab 4B» | Reflejos · `recap, rule-1, rule-2, rule-3, lab4b, endcard` |

- **Exam cards** (dominio Analysis), una por escena en s02, s03, s04, s06, s07, s08 y s09 (ninguna en s01, en la demo
  de la matriz de s05 ni en el cierre):
  - «Devil's Advocacy: alguien defiende la postura contraria» (s02, 55)
  - «Key Assumptions Check: ¿y si este supuesto falla?» (s03, 49)
  - «ACH: primero todas las hipótesis, luego la evidencia» (s04, 52)
  - «Diagnosticity: si encaja con todas, no discrimina» (s06, 49)
  - «Gana la menos inconsistente, no la más confirmada» (s07, 49)
  - «Sensitivity: ¿qué prueba, si cae, cambia la conclusión?» (s08, 55)
  - «Informe: ganadora, confianza y descartadas con su porqué» (s09, 56)
- **Think prompts:**
  - «¿Qué pesa más: el phishing o los seis meses?» (s05, 44). Respuesta en s06: los seis meses, porque el phishing
    vale para las tres hipótesis y seis meses sin cobrar nada chocan con el crimen financiero.
  - «Sin el certificado, ¿cambia la ganadora?» (s08, 40). Respuesta: no; E2 y E3 tumban a H2, y E3 tumba a H3: la cuenta queda en 0, 2 y 1
    (E2 frente a H3 es N, `src/data/s4.ts:429`).
- **Mensajes interceptados** (PAPER CRANE; tutea, dos frases cortas, ironía; empuja atajos de método, nunca una
  hipótesis, y no confiesa nada):
  - s03 (cap. I): «Fíate de lo que ves, analista. Las pruebas nunca mienten.» (57). El error: tomar las pruebas por lo
    que parecen. La narradora: eso es justo lo que le conviene que pienses a quien siembra pistas falsas; «las pruebas
    son lo que parecen» es un supuesto, y los supuestos se escriben y se comprueban.
  - s07 (cap. III): «Cuenta las que te dan la razón. La que más sume, gana.» (54). El error: contar lo que encaja. La
    narradora: lo que encaja suma para varias hipótesis a la vez (la C de E1 cuenta para las tres); lo que decide es lo
    que tumba, y una sola inconsistencia sólida basta, como la nevera para el perro.
  - s08 (cap. IV): «Si una prueba es falsa, se te cae todo. Empieza de cero.» (56). El error: todo o nada ante una
    prueba dudosa. La narradora: antes te pedía que te fiaras de todo y ahora de nada, y las dos cosas le vienen bien;
    lo que toca es medir: quitas esa prueba, vuelves a contar y miras si la conclusión sigue en pie.
- **Cierre:** tres reglas (antes de pesar pruebas, escribe lo que das por hecho y pon todas las hipótesis en la mesa;
  cuenta lo que tumba, no lo que encaja: gana la menos inconsistente; quita la prueba más fuerte y mira si tu
  conclusión sigue en pie) y una sola tarea: el Lab 4B, la matriz completa.

**Canon nuevo que fija V9** (nada de esto estaba en los datos del curso; todo va sin fecha ni hora, así que no se
ordena contra la cronología del registro ni choca con ella; lo posterior debe respetarlo):
- **La reunión de análisis se ve por primera vez.** Es la de la misión 4 (`src/data/labs.ts:149`), sin fecha. En la
  pizarra, las cuatro pruebas del extracto de la lección, tal cual (`src/data/s4.ts:428-432`), y «ESPIONAJE» como la idea
  que la sala ya daba por buena. No es un fallo de nadie: es lo normal antes de un Key Assumptions Check.
- **El CISO** (sin nombre, `src/data/labs.ts:57`) pregunta qué busca el intruso para decidir qué proteger primero.
- **La abogada del diablo:** alguien del equipo, sin nombre, recibe ese papel y defiende H2 («¿y si es un rescate?»).
  Es su papel, no un error suyo; no «pierde».
- **La hoja de Key Assumptions Check** con dos supuestos: «no hay otra explicación» y «las pruebas son lo que parecen».
- **La nota al CISO:** juicio provisional (H1, la menos inconsistente con las cuatro pruebas del extracto), confianza
  «moderada · 4 pruebas de un extracto; aguanta sin E4», descartadas H2 (E2, E3, E4) y H3 (E3, E4), y vigilar E4. No es el informe final del caso,
  el que lee el consejo «el lunes» (`src/data/labs.ts:187,1144`).
- **PAPER CRANE en pantalla por primera vez:** sus tres mensajes pasan a ser canon de su voz (tutea, frases cortas,
  ironía; atajos de método, nunca una hipótesis; nunca confiesa haber plantado nada). Su ficha en pantalla repite solo
  lo que ya dice la sección: «célula de engaño · siembra pistas falsas» (`src/data/course-gcti.ts:74-76`).
- Los sospechosos del yogur son de la analogía, no del canon de Meridian.

**No se toca:**
- **El dosier de HALL OF MIRRORS** (`src/data/course-gcti.ts:78`): nada de strings en cirílico, horarios falsos ni «PAPER
  CRANE las plantó»; tampoco «espionaje industrial sistemático», «las alternativas se desmoronan» ni «caso cerrado».
  H1 sale la menos inconsistente porque así lo dice la lección (`src/data/s4.ts:441`), siempre como provisional y con
  cuatro pruebas. De E4 solo se dice lo que dice la lección: que es el tipo de prueba que un actor podría plantar; ni
  quién, ni si pasó, ni cómo.
- **El Lab 4B** (`src/data/labs.ts:862-930`): solo las cuatro filas del extracto con las valoraciones de la lección (E3
  contra H3 es I en la lección y N en el laboratorio: manda la lección). Nunca sus otras cuatro pruebas (loader propio,
  horario UTC+8, silencio público, exfiltración lenta en bloques pequeños), sus notas ni su mecánica.
- **El horario UTC+8:** fuera del vídeo. Es la prueba estrella de baja diagnosticidad del Lab 4B (`src/data/labs.ts:907`),
  una frase del Lab 4A (`:481`) y roza los «horarios falsos» del dosier; s4m3 no lo trae. El ejemplo de diagnosticidad
  nula es E1, el de la lección.
- **El Lab 4A** (`src/data/labs.ts:447-499`): ninguna de sus ocho frases.
- **E4 no se identifica con el certificado de V3 y V4** (`CN=updatesvc`): sería fijar que el ISAC lo vio en una campaña
  de espionaje, tocar la tercera IP del certificado (hueco 15 del registro) y rozar el dosier de DEEP WELL (kazuo, «una
  sola organización»). La fila se queda como la escribe la lección.
- **Cluster-A y Cluster-B** siguen separados: el vídeo no habla de clusters (`src/data/s4.ts:722-737`).
- Nada del Lab 3A, del Lab 3B ni del final de la campaña.
- **«6 meses»** sale tal cual en la lección y hereda el hueco 8 del registro (duración de la operación); el vídeo no
  pone fechas.
- No se culpa a nadie: ni a la sala por su primera idea ni a quien hace de abogada del diablo. H3 incluye «insider»
  porque es una hipótesis de la lección, con un icono genérico, nunca alguien de la plantilla.

### V10 · sp2m7 · Cápsula · «Ataques en los logs: spraying, traversal y amplificación DNS»

> **Aprobada por Lidia el 2026-10-04**, tal cual, con las cuatro decisiones de su hoja
> (`docs/reviews/2026-10-01-fichas-tanda2/decisiones.md`) y el cambio en la lección (fecha e IP del spraying, hecho ese
> día). RED MARROW habla con `sapi/Microsoft Laura` y un efecto nuevo, `telefono`, para no sonar como PAPER CRANE (Laura
> con `machine`, V9); la voz **no** fija su género. Rama `video-logs-halden`, que sale de `main` con V9 ya fusionado. Se
> graba con V11 (sp1m6), la primera de la tanda 3, cuya ficha se escribió el 2026-10-05. La versión vigente de escenas y guion será
> `video/logs-halden/storyboard.json` + `narration.json`; qué se quedó fuera, en `video/logs-halden/out/script-notes.md`.
>
> **Guion congelado el 2026-10-04** con el visto bueno de Lidia (y el capítulo II rebautizado «La URL y el atasco»,
> porque la voz ya no habla de tubería). **Tras las revisiones**: 590 palabras, estimado 4:33 (~4:10 grabado). La tabla de escenas de abajo
> es la ficha original; lo que cambió al escribirlo, en `video/logs-halden/out/script-notes.md` (§ Revisiones):
> la MFA como «algo que solo tienes tú», la guardia sin parar el ataque, la nota «sal de la sala y sube cuatro plantas»
> (no «armario»), «codificada» en vez de «en clave», «account lockout» con la puerta del quinto fallo y no con el 0, y
> la voz sin «proveedor de identidad», «SOC» ni «DDoS» (siguen en pantalla).
>
> **Un ajuste que no pide el validador sino el canon:** el registro de la lección fecha el password spraying el 4-9,
> la misma noche del caso de sp4, y lo lanza desde una IP que no es de documentación. El vídeo lo pasa a la noche del 20
> al 21-10 con las mismas cuentas y horas, desde `192.0.2.157`, y propone aparte cambiar en la lección la fecha y la IP,
> a la vez. Motivos y alternativas, en `V10-sp2m7-decisiones.md`.
>
> **Revisada el 2026-10-01** (exactitud y canon, `revision-secplus.md`): MFA con responsable y fecha, el 403 explicado,
> IP de documentación, promesa antes de los 12 s y la guardia de madrugada en s05.

- **Carpeta:** `logs-halden` · perfil `capsula-yt` (190–260 s renderizados; objetivo ~4:00, sin rellenar) ·
  objetivo **2.4** (indicators of malicious activity; confirmado en la cabecera de la lección,
  `src/data/secplus/sp2-part4.ts:5`) · adversario **RED MARROW** (sección sp2, `src/data/secplus/sections.ts:63-68`),
  dos mensajes interceptados, su primera aparición en pantalla · voz `recording/lidia` con
  `"recording": { "tempo": 1.08, "maxPauseMs": 250 }` · voz del adversario: **`sapi/Microsoft Laura` con el efecto
  `telefono`** (decidido el 2026-10-04): voz de llamada en banda estrecha y sin el anillo de `machine`, añadido al motor
  para V10 (`video/engine/scripts/adversary_fx.py`). La voz no cuenta como canon del género · música de V4 y V5
  (`Go On Going - Stayloose.mp3`).
- **Efectos (`sfx`):** los automáticos del motor (mensaje, tarjetas, capítulos) y cuatro momentos: `zero` («check»),
  `served` («error»), `full` («alarm»), `second-lock` («lock»).
- **Duración:** suma de `s` **220 s**; renderizado estimado **unos 240 s (4:00)**, con los márgenes de la tubería y las dos
  voces del adversario. Dentro de 190–260. No se rellena. La suma no predice bien el renderizado (V5 salió a 0,89 veces su
  suma y V4 a 1,22), así que el primer borrador se mide por los dos lados: si se acerca a 190 s, se alargan s02 o s05, las
  de leer registros; si pasa de 255 s, se recorta s05.
- **Inserción:** en `src/data/secplus/sp2-part4.ts`, lección sp2m7, entre el check del password spraying (las 900
  cuentas, bloque de las líneas 121–135) y el párrafo final «Ya sabes leer un log o una gráfica y ponerle nombre al
  ataque…» (línea 136), como bloque `youtube`. Ese párrafo remata el vídeo casi palabra por palabra. Se fija en la suite
  `lesson videos` de `src/data/content.test.ts`. El check de justo antes cuenta otra noche parecida (900 cuentas, sin
  acierto): la voz no enlaza las dos.
- **Enfoque («tres rastros de una noche»):** miércoles 21-10, revisión de la mañana en el SOC. La cola trae tres cosas
  de la noche, y cada una deja una **forma** distinta en su registro: un origen que prueba muchas cuentas, una URL con
  puntos y barras, y un chorro de respuestas DNS que nadie pidió. El vídeo lee cada registro (evidencia), le pone nombre
  (interpretación) y decide qué hacer (regla). Es lo que pide la lección: «el examen describe un síntoma y espera que
  nombres el ataque» (`sp2-part4.ts:22`). RED MARROW firma los dos primeros con consejos de amigo que son mentira; el
  tercero no lo firma nadie, porque en un ataque reflejado quien lo lanza no aparece en tus registros. La caída del
  portal ya la atendió la guardia de madrugada: tras V5 y V5b hay quien mira de noche, y el vídeo no repite «nadie
  mira». No hace falta frase de puente: el vídeo no continúa ningún otro.

**Conceptos (3) y su imagen:**

| # | Concepto | Imagen que se mantiene | Tarjetas |
|---|---|---|---|
| 1 | Password spraying frente a brute force: mira la forma, no el volumen. Un solo origen contra muchas cuentas, un intento en cada una, a ritmo lento, y ningún bloqueo de cuenta (account lockout), porque está hecho para no llegar al umbral. Contra cualquier ataque de contraseña, lo más eficaz es MFA; además, lista de contraseñas prohibidas y bloqueo por origen, no por cuenta | Un bloque de pisos. Un manojo de llaves en una sola puerta, que se bloquea al quinto intento, frente a una sola llave muy corriente probada una vez en cada puerta, sin que ninguna salte. MFA es el segundo cerrojo: la llave gira y la puerta pide además algo que solo tú tienes (dibujado como el móvil o una llave física; nunca la palabra «código») | «Spraying: pocas contraseñas, muchas cuentas, sin lockout» · «Contra ataques de contraseña, lo más eficaz: MFA» |
| 2 | Directory traversal: secuencias `../` (o su versión codificada, `%2e%2e%2f`) en un parámetro de ruta para salir de la carpeta permitida. El código y los bytes de la respuesta dicen si se lo llevó. No es inyección (no hay comillas ni `OR 1=1`). Defensa: resolver la ruta completa (canonicalizar) y comprobar que sigue dentro de la carpeta; nunca filtrar solo el texto | La ventanilla de un archivo. El empleado saca documentos de un solo armario, y la nota del pedido dice «sal del armario, sube cuatro plantas y tráeme la lista de usuarios de la portería». La versión codificada es la misma nota escrita en clave | «Directory traversal: canonicalizar y confinar la ruta» |
| 3 | DDoS reflejado y amplificado (DNS amplification): respuestas DNS grandes que llegan de cientos de servidores legítimos a preguntas que tu servidor nunca hizo. Reflected, porque alguien preguntó con tu dirección falsificada; amplified, porque la pregunta es pequeña y la respuesta enorme. Las dos etiquetas valen a la vez. No es DNS poisoning, que te cambia a dónde vas. Se para antes de tu enlace (filtrado en el proveedor, servicio anti-DDoS) y en origen, cerrando los resolvers abiertos | Pedidos a domicilio que nadie hizo: alguien llama a cientos de restaurantes, pide el menú más grande y da tu dirección. Llamada corta, pedido enorme, y el que llamó nunca aparece en tu puerta. La calle se atasca antes de tu portal | «Respuestas DNS que nunca pediste: reflected y amplified» |

**Escenas:** seis, en tres capítulos (Una llave, muchas puertas · La URL y la tubería, rebautizado «La URL y el atasco» al congelar · Para el examen).

| Escena | Cap. | s | Qué se ve | Qué se aprende · cues |
|---|---|---|---|---|
| s01-hook «Tres rastros de una noche» | I Una llave, muchas puertas | 22 | La cola del SOC, «21-10 · 08:00 · revisión de la mañana», con tres filas en orden de hora, todas a la vez y a media luz, un icono cada una: una llave («03:10 · fallos de inicio de sesión · 1 origen · proveedor de identidad»), una carpeta («04:26 · peticiones con `../` · `hpa-portal-web-01`») y una tubería («05:40 · DNS entrante masivo · `hpa-portal-web-01`»). La primera frase habla de la cola entera («Tres rastros de esta noche en el puerto, y cada ataque deja una forma distinta en su registro»); al acabarla, título «Ataques en los logs» (hacia los 8 s, siempre antes de los 12) y la promesa en tres chips: «la forma · el nombre · qué hacer». Después, las tres filas se encienden juntas en una sola frase y el resto se atenúa | La promesa en los primeros 10 s: tres registros de una noche; al acabar, nombrar cada ataque por la forma que deja y decidir qué hacer · `queue, title, promise, rows` |
| s02-spray «Una llave en todas las puertas» | I | 46 | Se amplía la fila de la llave: el registro del proveedor de identidad («IdP de Halden») con las cinco líneas de la lección (`sp2-part4.ts:65-69`), fechadas `2026-10-21` y con origen `192.0.2.157`; la línea del OK queda atenuada para s03. Dónde mirar, por pasos: la columna `user` (cambia en cada línea), la columna `src` (siempre `192.0.2.157`), la hora (unos 40 s entre intentos). Resumen debajo: «180 cuentas · 1 intento por cuenta · 03:10–05:06 · cuentas bloqueadas: 0», con el 0 a 60 px. Nota pequeña: «este registro no guarda qué contraseña se probó». La imagen: un bloque de pisos; a la izquierda, un manojo de llaves en una sola puerta que se bloquea al quinto intento («umbral: 5 fallos»; contraejemplo, no pasó); a la derecha, una sola llave que prueba cada puerta una vez y ninguna salta. Encima, la matriz cuentas × contraseñas: la fuerza bruta llena una fila, el spraying una columna. Nombres: BRUTE FORCE y PASSWORD SPRAYING; al lado del 0, ACCOUNT LOCKOUT | Mirar la forma, no el volumen: un origen, muchas cuentas, un intento en cada una y ningún bloqueo · `log, users, src, pace, zero, one-door, every-door, matrix, spraying` |
| s03-mfa «Una puerta se abrió» | I | 38 | Se amplía la línea atenuada, `03:12:37 LOGIN OK user=r.haugen src=192.0.2.157`, y aparece la siguiente, nueva: `03:13:15 LOGOUT user=r.haugen · aplicaciones abiertas: 0` (la narradora la lee como dato y no especula por qué se fue). Junto a la línea del OK, «IdP de Halden · pide: contraseña». Mensaje interceptado. La tarjeta de la política junto a `Halden2026!`, con tres casillas en verde (mayúscula, cifras, símbolo) y el sello «cumple»; debajo, «y es de las primeras que prueba cualquiera». Tres acciones, una por frase y cada una se enciende al decirla: «esa cuenta: contraseña nueva y sesiones cerradas» · «bloquear el origen, no las cuentas» · «MFA y lista de contraseñas prohibidas en el proveedor de identidad · Sistemas · 30-11». La imagen vuelve: la misma puerta del bloque con un segundo cerrojo; la llave gira y la puerta pide además algo que solo tú tienes, dibujado como el móvil o una llave física | Nadie tuvo la culpa: la contraseña cumplía las normas, y el spraying apuesta justo por esas. Se bloquea por origen; lo más eficaz es MFA · `ok, logout, rules, not-fault, reset, block-src, mfa, second-lock` · **intercept** |
| s04-traversal «Una nota con indicaciones» | II La URL y la tubería | 42 | Se amplía la fila de la carpeta: el registro de accesos de `hpa-portal-web-01` (portal público de reservas de atraque) con las dos líneas de la lección (`sp2-part4.ts:61-62`), a las `04:26:14` y `04:26:21`, desde `192.0.2.157`. Dónde mirar: primero `file=`; luego cada `../` se enciende a la vez que un escalón en un plano de carpetas que sube hasta la raíz y baja a `etc/passwd`; después, `200` y `1834` ampliados: «se lo llevó». La imagen: la ventanilla del archivo y la nota del pedido. Nombre DIRECTORY TRAVERSAL; al lado, tachado, «inyección: sin comillas ni `OR 1=1`». Mensaje interceptado. Segunda línea: `%2e%2e%2f` se traduce carácter a carácter a `../` («la misma nota, en clave»); junto al `403 0`, la nota «403: el servidor no puede leer `shadow` · no es un filtro», con `shadow` en monoespaciada. En la voz, una frase: «La segunda la frenó el propio sistema: ese archivo solo lo lee el administrador. Ningún filtro la vio». La defensa, en el plano: el empleado sigue la ruta antes de moverse y, si acaba fuera del armario, no va: «resolver la ruta · comprobar que sigue dentro» | Puntos y barras en un parámetro de ruta, también en clave; el código y los bytes dicen si pasó; canonicalizar y confinar, no filtrar el texto · `access-log, param, climb, served, traversal, not-sqli, encoded, no-filter, canon, confine` · **intercept** |
| s05-amp «Pedidos que nadie hizo» | II | 48 | Se amplía la fila de la tubería: NetFlow entrante a `hpa-portal-web-01`, `05:40–06:05`, con filas `UDP · 198.51.100.61:53`, `198.51.100.140:53`, `198.51.100.203:53`, `198.51.100.212:53`… Dónde mirar, por pasos: la columna del puerto de origen (siempre 53), el contador «orígenes distintos: 340», el medidor «enlace de 1 Gb/s · 100 %» y, al lado, «consultas DNS del portal a esos servidores: 0». La imagen: el portal y cientos de repartidores que llegan a la vez con pedidos enormes; en un recuadro, alguien llama a los restaurantes y da tu dirección. Esquema del mecanismo, rotulado como tal (no sale del registro): «pregunta: 60 bytes · respuesta: 3.000 bytes». Nombres: REFLECTED (la dirección falsa) y AMPLIFIED (el pedido enorme), que se juntan en DNS AMPLIFICATION. Tachado: «DNS poisoning: te cambia a dónde vas; esto te llena la tubería». Pregunta para pensar. Respuesta: los 340 son servidores legítimos de terceros (resolvers abiertos); la calle se atasca antes de tu portal; se corta en la avenida: «filtrado en el proveedor · servicio anti-DDoS»; y en origen, «cerrar los resolvers abiertos». Después de la respuesta, para no destriparla, una línea: «guardia · 05:44 · aviso de caída · llamada al proveedor» | Respuestas a preguntas que nunca hiciste: reflejado y amplificado a la vez; se para antes de tu enlace, no en tu cortafuegos · `netflow, port53, sources, full, zero-q, delivery, reflected, amplified, not-poison, upstream, on-call` · **think** |
| s06-recap «Tres reglas» | III Para el examen | 24 | Tres tarjetas de reglas, cada una con su icono (llave, carpeta, tubería); tarjeta final Alertópolis: «Ahora te toca: las preguntas de la lección» (sp2m7, 8 preguntas) | Reflejos · `recap, rule-1, rule-2, rule-3, next, endcard` |

- **Exam cards** (objetivo 2.4), una por escena de s02 a s05:
  - «Spraying: pocas contraseñas, muchas cuentas, sin lockout» (s02) (56)
  - «Contra ataques de contraseña, lo más eficaz: MFA» (s03) (48)
  - «Directory traversal: canonicalizar y confinar la ruta» (s04) (53)
  - «Respuestas DNS que nunca pediste: reflected y amplified» (s05) (55)
- **Think prompt:** «¿Bloqueas esas IP o llamas a tu proveedor?» (s05) (42). Llega después de nombrar el ataque y de su
  tarjeta, con el registro ya leído. Respuesta: al proveedor. Esas IP son servidores legítimos que el atacante usa de
  espejo, mañana serán otras, y tu enlace ya está lleno antes de que el tráfico llegue a tu cortafuegos. Justo después, la
  línea de la guardia enseña que eso es lo que se hizo a las 05:44.
- **Mensajes interceptados** (RED MARROW, `holdMs` ~3800):
  - s03: «Halden2026! Cumple todas tus normas. Así que es segura. Confía en mí.» (69). El error que corrige la
    narradora: que una contraseña que cumple las reglas de complejidad es segura. Las cumple, y justo por eso la eligió:
    es de las más previsibles que las cumplen. Lo arreglan la lista de contraseñas prohibidas y, sobre todo, MFA; más
    reglas de complejidad, no. De paso, el mensaje dice qué contraseña probó, cosa que este registro no guarda.
  - s04: «Borra los puntos y las barras de la URL y listo. Confía en mí.» (62). El error: filtrar el texto literal. Te lo
    recomienda porque ya te lo ha mandado en clave (`%2e%2e%2f`), y un filtro que busca `../` no lo reconoce. Aquí ni
    siquiera había filtro (el portal no tiene nada delante, `src/data/secplus/sp4-part3.ts:57`): la petición del 403 la
    frenó el propio sistema. La defensa es resolver la ruta y comprobar dónde acaba.
- **Cierre:** tres reglas y una sola tarea.
  1. Muchas cuentas, un intento en cada una y ningún bloqueo: spraying. Contra eso, MFA.
  2. Puntos y barras en una ruta, también en clave: traversal. Se resuelve la ruta; no se filtra el texto.
  3. Respuestas que tu servidor nunca pidió: DDoS reflejado y amplificado. Se para antes de tu enlace, en el proveedor.

  Tarea: las preguntas de la lección (sp2m7, 8 preguntas; las q1, q2, q4 y q8 tocan lo que cuenta el vídeo).
- **Se queda fuera** (sigue en la lección):
  - Ataques físicos (brute force físico, RFID cloning, environmental): `sp2-part4.ts:27`.
  - DNS poisoning y hijacking (el envenenamiento solo sale como trampa, en una frase), wireless (evil twin, rogue AP,
    deauthentication) y NTP `monlist`: `:31`; on-path, ARP poisoning, credential replay y malicious code: `:35`. Quiz q3.
  - Los ataques de aplicación salvo traversal: injection (solo como trampa), buffer overflow, replay, privilege
    escalation, CSRF y SSRF: `:54`. Quiz q7.
  - Criptográficos (downgrade, collision, birthday): `:90`. Quiz q5 y q6.
  - La tabla completa de síntoma, indicador y mitigación: `:97-114`.
- **Laboratorios:** ninguno de sp2 lee registros. spl2a clasifica actores, spl2b vectores de ingeniería social y spl2c
  elige mitigaciones tras un movimiento lateral (`src/data/secplus/labs-sp2.ts`), así que no hay solución que destripar.
  Dos precauciones:
  - spl2a tiene un DDoS de un colectivo hacktivista contra el portal de ferris. El vídeo no dice quién lanza su DDoS ni
    usa ese portal, para no dar la clasificación del laboratorio.
  - spl4a (sp4) pregunta qué fuente responde «qué cuenta inició sesión a las 03:12» (`src/data/secplus/labs-sp4.ts:93`).
    El vídeo enseña un registro del proveedor de identidad de otra noche y nunca nombra categorías de fuentes, así que
    no responde esa pregunta.

**Canon nuevo que fija V10** (nada de esto estaba en los datos del curso; lo posterior debe respetarlo):
- **Noche del martes 20 al miércoles 21-10-2026.** Queda después de todo lo fechado de Halden (el caso de septiembre y
  las fechas previstas de V5b del 2 al 16-10) y antes del plazo más largo de V5 (31-10); no toca ninguna.
- **El proveedor de identidad** se rotula como en V6: «proveedor de identidad» o «IdP de Halden». **El 21-10 solo pedía
  contraseña**: por eso acierta el spraying. V6 no enseña segundo factor en él.
- **21-10 · 03:10:02–05:06: password spraying** desde `192.0.2.157` contra el proveedor de identidad. Las cinco líneas son
  las de la lección (mismas cuentas y horas; cambian la fecha y la IP). En total, 180 cuentas, un intento por cuenta,
  unos 40 s entre intentos (180 intentos a ese ritmo acaban hacia las 05:06) y 0 cuentas bloqueadas. El umbral de
  bloqueo del puerto es de 5 fallos. Un solo acierto: `r.haugen` a las 03:12:37, con `Halden2026!`, que cumplía la
  política de contraseñas. La sesión se cierra a las 03:13:15 sin abrir ninguna aplicación, sin explicación. La
  contraseña no sale del registro: la dice el mensaje de RED MARROW.
- **21-10 · 04:26:14 y 04:26:21: directory traversal** desde `192.0.2.157` contra el visor de documentos
  (`/gate/viewdoc`) de `hpa-portal-web-01`, con las dos líneas de la lección. La primera sirve `/etc/passwd` (200, 1834
  bytes). La segunda, codificada, pide `/etc/shadow` y recibe un 403 porque el servidor no puede leer ese archivo (solo lo
  lee el administrador); no hay filtro ni nada delante del portal.
- **21-10 · 05:40–06:05: DDoS reflejado y amplificado por DNS** contra `hpa-portal-web-01`: 340 resolvers abiertos de
  terceros, todo desde el puerto 53 UDP, el enlace de 1 Gb/s del portal al 100 % y 0 consultas del portal a esos
  servidores. El portal no responde en esos 25 minutos y el ataque se para solo. Nadie lo firma: quien lo lanza no sale en
  ningún registro. Los resolvers de ejemplo son `198.51.100.61`, `198.51.100.140`, `198.51.100.203` y `198.51.100.212`,
  todos libres y en otro /24 que el atacante.
- **21-10 · 05:44: la guardia** recibe el aviso de caída del portal y llama al proveedor.
- **21-10 · 08:00: revisión de la mañana** de la analista del SOC (sin nombre, en segunda persona). Lo inmediato, sin
  fecha porque se hace esa misma mañana: contraseña nueva y sesiones cerradas para `r.haugen`; `192.0.2.157` bloqueada en
  el perímetro; el visor resolverá la ruta y la confinará a su carpeta; filtrado anti-DDoS en el proveedor. La mejora de
  fondo, con dueño y fecha: **«MFA y lista de contraseñas prohibidas en el proveedor de identidad · Sistemas · 30-11»**
  (lunes).
- **RED MARROW, primera aparición.** Tutea a la analista, frases cortas, ironía, como SILENT PAGER, pero su registro es
  otro: el del estafador amable, que da consejos de amigo que son mentira y cierra con «Confía en mí». La narradora lo
  presenta con lo que ya anuncia el jefe de sp2 antes del combate: vive de engañar, con correos falsos y memorias USB en
  el aparcamiento. Ningún texto usa un artículo ni un adjetivo que marque su género («Es RED MARROW»). La voz no lo fija
  (decisión de Lidia del 2026-10-04): igual que SILENT PAGER, que es «ella» y suena con Pablo, un vídeo posterior puede
  fijarlo.
- **Cierre de canon** (paso 8 del orden de trabajo), en `docs/superpowers/canon/glass-harbor.md`: la fila 52 sale de la
  cronología del incidente y pasa a una fila del 21-10; la 135 cambia IP y fecha; se cierra el hueco de la 245; y en §2 se
  anota que el 21-10 el proveedor de identidad solo pedía contraseña, con la MFA a cargo de Sistemas para el 30-11.

**No se toca:**
- El caso `IR-2026-0147` (3-9 y 4-9): ni sus fechas y horas, ni sus equipos, ni `svc_tosreport`, ni SILENT PAGER. Nada
  relaciona la noche del 21-10 con él.
- El dosier de RED MARROW (kits contra los operadores de grúas, el proveedor de mantenimiento, «GH compra acceso a través
  de terceros») y el nombre GLASS HARBOR. Nada insinúa que RED MARROW trabaje con otros adversarios ni que venda lo que
  consigue: la narradora no dice por qué se cerró la sesión de `r.haugen` (nada de «la guardó», «para después» ni «para
  venderla»).
- Ninguna IP del vídeo cae en `203.0.113.0/24`, la de SILENT PAGER, ni es `198.51.100.23`, que debe quedar neutra.
- El DDoS no se atribuye a nadie y no es el portal de ferris de spl2a.
- De `hpa-portal-web-01` no se menciona el FINDING #0147 del escaneo del 1-9 (`src/data/secplus/sp4-part3.ts:55`),
  ni el número 0147: el traversal es otro fallo, del visor de documentos.
- Los episodios de las lecciones que se parecen al caso (el `svchost32` de las 02:40 de sp2m6, la administradora que
  descarga manifiestos, el servidor de grúas y su dominio): no se mezclan. Por eso el traversal va a las 04:26 y no pide
  manifiestos.
- El check de las 900 cuentas que va justo antes del vídeo (`sp2-part4.ts:124`) es otra noche: la voz no lo enlaza.
- La fila «Inicios de sesión fallidos en la VPN» de la cola tranquila del SIEM (mañana del 4-9,
  `video/siem/src/data/s08-triage.ts:13`) sigue siendo ruido de fondo: el vídeo no la relaciona con nada.
- La VPN: el vídeo no dice nada de ella (sp4m8 tiene un check sin fecha sobre su «MFA», `src/data/secplus/sp4-part4.ts:452`).
- No se culpa a nadie: ni a `r.haugen` (su contraseña cumplía la política) ni a quien escribió la política. `r.haugen`
  no se desarrolla: ni nombre completo ni área.

**Tanda 3:**
- sp1m6 (Principal) y sp1m7 (Cápsula `openssl s_client -showcerts` con un intermedio ausente), como serie «Confianza».
- sp3m5 802.1X/VPN (Principal).
- s2m4 threads (Principal).
- s2m1 Kill Chain (Principal).
- s3m2 sandbox (Cápsula).
- sp3m4 zonas (Principal).

**Backlog:** filas 18–21 del ranking, todas como cápsulas.

**Tanda 3** (abierta el 2026-10-05; 5 principales y 2 cápsulas, 4 de Security+ y 3 de GCTI). Fichas completas abajo, de
V11 a V17. Las decisiones de cada una, las preguntas para Lidia y lo que se decidió entre fichas, para aprobarlo en una
ronda: `docs/reviews/2026-10-05-fichas-tanda3/decisiones.md`. Pasaron una revisión de exactitud y canon por pareja
(`revision-V11-V12.md`, `revision-V16-V17.md`, `revision-gcti.md`, en la misma carpeta) y la comprobación de límites con
un script.

| Nº | Lección | Formato | Carpeta | Se graba con |
|---|---|---|---|---|
| V11 | sp1m6 · criptografía: quién usa qué clave y por qué TLS es híbrido | Principal | `cripto-halden` | V10 |
| V12 | sp1m7 · PKI en la consola: el eslabón que falta, CRL y OCSP | Cápsula | `pki-halden` | V13 |
| V13 | s2m1 · la Cyber Kill Chain: basta con romper un eslabón | Principal | `kill-chain-eslabon` | V12 |
| V14 | s2m4 · de la foto a la película: activity threads y grupos | Principal | `hilos-pelicula` | V15 |
| V15 | s3m2 · lo que cuenta una muestra: triaje en sandbox | Cápsula | `sandbox-muestra` | V14 |
| V16 | sp3m4 · zonas de seguridad: dónde va cada cosa y qué pasa si falla | Principal | `zonas-halden` | sola |
| V17 | sp3m5 · por dónde se entra: 802.1X, VPN e IPSec | Principal | `fronteras-halden` | sola |

- Dos adversarios se estrenan: NULL CIPHER en V11 y BLIND ARCHITECT en V16. Las dos con la voz de Helena, que no usa ningún
  otro adversario, y efectos nuevos distintos (`cifrado` y `megafonia`, este con `"rate": -2`); el curso ya las escribe en
  femenino. Hay que añadir los dos efectos a `video/engine/scripts/adversary_fx.py` antes de renderizar V11 y V16.
- Fechas nuevas de Halden: V11–V12 del 3 al 12-11, V16 del 16 al 20-11 (con fases desde el 1-12) y V17 del 23 al 27-11.
  No pisan nada de lo publicado ni de V10.

---

### V11 · sp1m6 · Principal · «Criptografía: quién usa qué clave y por qué TLS es híbrido»

> Propuesta del 2026-10-04; guion escrito, revisado y congelado el 2026-10-05 (aprobado por Lidia). Primera parte de la serie «Confianza» (la sigue V12,
> sp1m7). Se graba en la misma sesión que V10 y su guion se escribe justo después de aprobarse. La versión vigente de
> escenas y guion será `video/cripto-halden/storyboard.json` + `narration.json`; qué se quedó fuera, en
> `video/cripto-halden/out/script-notes.md`.
>
> **Producido y publicado**: subido por la API el 2026-10-05 (YouTube `6jyHqrkMOZQ`, privado) y publicado por Lidia;
> 8:30, 10 escenas, 7 tarjetas, 2 preguntas, 3 mensajes de NULL CIPHER (voz `sapi/Microsoft Helena` con el efecto nuevo `cifrado`), voz de
> Lidia, música de V4 y V5. En la lección sp1m6, donde dice «Inserción», con su línea de entrada.
>
> **Revisada el 2026-10-05** (exactitud y canon, `revision-V11-V12.md`): la pintura ya dice su límite (no te dice con quién
> has mezclado, y eso lo pone el sello del servidor: s08, s09 y concepto 5, «sin ningún secreto previo»); las dos preguntas
> para pensar ya no usan nombres sin explicar ni llegan con la respuesta dada (s05 y s08); s06 va en condicional, rotulada
> como ejemplo y con el buzón, sin el portal de V10 de fondo; NULL CIPHER se presenta como «célula de acceso inicial», sin
> puertas ni llaves (son la imagen del spraying de V10, que se graba en la misma sesión); el mensaje de s02 ya no compara
> bits de RSA y AES. De los menores: «la huella de la oferta» en s04, «el sello encaja» en s07, la densidad del capítulo III
> en el plan de recortes, la línea de entrada, los escenarios de spl1c y el orden del curso. La voz de NULL CIPHER la decide
> la coordinación (Helena, `rate` 0, efecto nuevo `cifrado`).
>
> **Revisada otra vez el 2026-10-05, con el guion** (`video/cripto-halden/out/review-accuracy.md` y
> `review-naturalness.md`; detalle en `video/cripto-halden/out/script-notes.md`, «Revisiones»): los títulos de s05 y s08
> ya no contestan sus preguntas para pensar («Cómo se guarda una contraseña», «Pinturas en la carretera»); el mensaje de
> s06 dice el error que corrige la voz (que el hash adjunto prueba de quién es); la tarjeta de s08 usa el término del
> examen, key exchange; s06 se cuenta como hipótesis («imagínate que…»); y la pantalla sigue a la voz en «cuatro piezas»
> (s01), «bases de datos» (s02), «tu privada…» (s03, s07), «12,41» y «siempre igual de larga» (s04), «dos cuentas
> distintas» y «casi igual de rápida» (s05), «del color final sale» (s08), «el dueño de esa clave» (s09) y «el
> destinatario» (cierre).
>
> Rutas relativas a la raíz del repo; `sp/` = `src/data/secplus/`. Las decisiones, con lo descartado, los riesgos y la
> pregunta para Lidia, están en `docs/reviews/2026-10-05-fichas-tanda3/decisiones.md` (apartado V11).

- **Carpeta:** `cripto-halden` · perfil `principal-yt` (380–600 s renderizados; objetivo ~8:30, sin rellenar) ·
  objetivo **1.4** (cryptographic solutions; lo confirma la cabecera de la lección, `sp/sp1-part4.ts:4`) · adversario
  **NULL CIPHER** (sección sp1, jefe FIRST KEY, `sp/sections.ts:43-50`), tres mensajes interceptados, **su primera
  aparición en pantalla** · voz `recording/lidia` con `"recording": { "tempo": 1.08, "maxPauseMs": 250 }` · voz del
  adversario, **nueva y decidida por la coordinación**: `"adversaryVoice": { "voice": "sapi/Microsoft Helena", "rate": 0,
  "fx": "cifrado" }`. Helena es la única voz es-ES instalada que no tenía adversario (Pablo es SILENT PAGER, GLASS VIPER y
  HOLLOW LANTERN; Laura, PAPER CRANE y RED MARROW), y la comparte BLIND ARCHITECT (V16–V17) con otro ritmo y otro efecto
  (`rate` −2 y `megafonia`). `cifrado` es un efecto nuevo, digital y seco (descrito en decisiones, punto 4). **Solo para V11**,
  si `cifrado` no llega antes del render, Helena con `machine`; el efecto con que se publique V11 es ya el de NULL CIPHER
  para siempre, y V12 lo hereda · música `Go On Going - Stayloose.mp3` (la única pista de `video/engine/music/LICENSES.md`,
  la de todos los vídeos desde V4) · en `video.json`, `"lesson": "sp1m6"` y `"adversary": "NULL CIPHER"`.
- **Etiquetas** (`video.json` → `"tags"`): criptografía, cifrado simétrico, cifrado asimétrico, clave pública, clave
  privada, hash, salt, key stretching, firma digital, non-repudiation, Diffie-Hellman, TLS, Security+.
- **Efectos (`sfx`):** los automáticos del motor (mensaje, tarjetas, capítulos) y seis momentos: `slot` («mail», la
  oferta cae en el buzón de la naviera), `anyone` («error», la oferta cerrada con la privada del puerto la abre
  cualquiera), `twins` («error», dos huellas iguales), `both-match` («error», la oferta falsa y su huella encajan),
  `seal-ok` («check») y `same` («ding», los dos lados llegan al mismo color).
- **Duración:** suma de `s` **480 s** (10 escenas); `wordBudget` = `s` × 2,7, unas 1.300 palabras, y el guion se escribe
  al ~95 % de cada presupuesto, como V6. Con la proporción de V6 (520 s de escenas, ~600 s estimados, 557 s renderizados,
  1,07 veces la suma), V11 daría **unos 550 s estimados y unos 510–515 s renderizados (8:30–8:35)** con el ritmo de
  Lidia (91–93 % del estimado en V7, V8 y V9). La suma predice mal (V5 salió a 0,89 veces y V4 a 1,22): el abanico va de
  427 a 586 s, dentro de 380–600 por los dos lados. El primer borrador se mide con `build-timeline --estimate`: si pasa de
  570 s, se recorta primero el capítulo III, el más cargado (las colisiones y MD5/SHA-1 de s04 en media frase y el resto en
  pantalla); después, los dos relojes del estiramiento de s05 en una frase, y luego la nota de la oferta de s09, solo en
  pantalla. Si baja de 420 s, se alargan s09 (leer la línea) y s02. No se rellena.
- **Inserción:** en `sp/sp1-part4.ts`, lección sp1m6, entre la lista de steganography, tokenization, data masking y
  blockchain (`:135-143`) y el párrafo final «Ya sabes qué hace cada primitiva…» (`:144-147`), como bloque `youtube`
  (`{ t: 'video', title, youtube, poster, transcript }`, como V6 en `sp/sp4-part4.ts:468-474`). Lo puede preceder una
  línea, como en V1 y V6: «Antes de pasar a la PKI, júntalo todo en el portal del puerto: quién usa qué clave y por qué una
  conexión usa las dos familias». Va al final porque recorre casi toda la lección y nada de lo que enseña llega antes que
  ella: las dos familias (`:26`), la regla de examen (`:44`), el híbrido (`:63-65`, `:84`), el hash (`:115`), salt,
  key stretching y la firma (`:120-122`). Y acaba con la misma pregunta que el párrafo final (`:146`), que manda a sp1m7,
  donde va V12. Se fija en la suite `lesson videos` de `src/data/content.test.ts` (`:248`).
- **Enfoque («una línea, una oferta»):** martes 3-11. Una naviera se conecta al portal de reservas de atraque del puerto
  (`hpa-portal-web-01`, «portal público de reservas de atraque», `sp/sp4-part3.ts:56`) para recoger su oferta comercial para
  2027. Si miras esa conexión por dentro, una sola línea de `curl` lleva cuatro piezas de tres familias de criptografía. El
  vídeo la congela al principio como promesa («al final la lees entera») y la lee pieza a pieza al final. Entre medias,
  cuatro preguntas sobre la misma oferta, que son los cuatro reflejos que más castiga el examen: ¿quién puede leerla? (la
  pública del destinatario), ¿cómo se guarda la contraseña con la que entra la naviera? (hash con salt y stretching, nunca
  cifrada), ¿es del puerto y llega intacta? (firma, no un hash adjunto) y ¿cómo viaja? (híbrido). NULL CIPHER, «una célula
  de acceso inicial» (el anuncio de su jefe, `sp/sections.ts:47`), firma tres consejos con forma de manual técnico que dejan
  un hueco, y cada uno es un distractor de la propia lección. No ataca nada: solo aconseja. La línea de `curl` enseña además,
  a media luz, que el certificado del portal caduca el 11-11, que es la semilla de V12. **Para quien sigue el curso, V11 es
  el primer vídeo de Halden** (sp1), aunque pase en noviembre: no recuerda el caso de septiembre ni V10, y el sello se
  presenta desde cero.

**Conceptos (5) y su imagen:**

| # | Concepto | Imagen que se mantiene | Tarjetas |
|---|---|---|---|
| 1 | Dos familias. Symmetric: una sola clave compartida cifra y descifra; es rápida y sirve para el volumen (AES), pero hay que hacerle llegar la clave al otro sin que nadie la vea (key distribution). Asymmetric: un par; la pública la tiene cualquiera, la privada no sale de su dueña, y lo que cierra una solo lo abre la otra. Es mucho más lenta (RSA, ECC), así que no cifra gigas: sirve para acordar claves y para firmar (`sp/sp1-part4.ts:26`, q1 `:163`) | La llave de siempre, con una copia para cada lado (y la pregunta de cómo le llega la copia), frente al buzón de la naviera: por la ranura echa cartas cualquiera, y abrirlo solo puede su dueña. En la voz, «llave» es solo la imagen («como la llave de casa»); el término es siempre «clave» | «Symmetric: una clave, rápida; asymmetric: un par, lenta» |
| 2 | Cifrar para alguien: con **su** clave pública, porque solo su privada lo abre (confidentiality). Con tu privada no se esconde nada: lo abre tu pública, que tiene todo el mundo (la nota de examen, `:44`, y el check `:70-79`) | Echar la oferta por la ranura del buzón de la naviera, no por la tuya | «Confidencialidad: cifra con la pública del destinatario» |
| 3 | Hash: una huella de longitud fija, de una sola dirección y sin clave, así que no es cifrado: no se descifra. Sirve para la integridad, porque un cambio mínimo cambia la huella entera. MD5 y SHA-1 tienen colisiones y están retirados (`:115`). Las contraseñas se guardan como huella, nunca cifradas: salt (un valor al azar distinto por cuenta, que hace distintas dos contraseñas iguales y deja inútiles las rainbow tables) y key stretching (sacar la huella miles de veces a propósito: bcrypt, PBKDF2, Argon2). Un hash más largo no basta: sigue siendo rápido (`:120-121`, check `:128-132`, q6 `:238`) | La huella del documento (en la voz, «la huella de la oferta»: identifica el documento, no a quien lo escribió, como la huella del certificado de V4, `video/pivot-infra/narration.json:196`). La sal: un dato al azar distinto en cada cuenta antes de sacar la huella. El estiramiento: sacarla miles de veces seguidas | «Hash: una sola dirección y sin clave; no es cifrado» · «Contraseñas: hash con salt único y key stretching» |
| 4 | Firma digital: la huella del documento, sellada con la clave **privada** de quien firma; cualquiera la comprueba con su pública. Da integridad, autenticidad y non-repudiation. Un hash adjunto solo da integridad: no dice quién escribió el documento (`:122`, q3 `:193`) | El sello de lacre del puerto: el anillo solo lo tiene el puerto; el dibujo del sello lo conoce todo el mundo. Es la imagen que V1 ya dio a DKIM («el sello de lacre de un dominio», `video/capas-halden/narration.json:87`), pero V11 la presenta desde cero | «Firma: tu privada; integridad, autenticidad, no repudio» |
| 5 | TLS es híbrido. Diffie-Hellman (ECDH, con curvas elípticas) deja a dos partes **sin ningún secreto previo** con un secreto común, sin enviarlo nunca; ese secreto es la session key, y con ella AES cifra todo el tráfico. Asimétrica para empezar, simétrica para lo demás (`:63-65`, `:84`, q2 `:169`, `:178`). Diffie-Hellman a solas no dice con quién has acordado la clave: eso lo pone el sello del servidor sobre el saludo, y que ese sello sea del puerto lo dice el certificado (V12) | La mezcla de pinturas: un color común a la vista de todos, un color secreto en cada lado, se cruzan las mezclas y los dos llegan al mismo color; quien mira solo ha visto mezclas, y una mezcla no se separa. Su límite, dicho en voz: la pintura no te dice con quién has mezclado. El color final se convierte en la llave de siempre del concepto 1: la copia que nadie tuvo que llevar | «Diffie-Hellman: secreto común sin transmitirlo» · «TLS híbrido: asimétrica acuerda, AES cifra el tráfico» |

La regla de examen que resuelve «la mitad de las preguntas de asimétrica» (`:44`) sale con sus dos imágenes y se repite en
el cierre: para que solo lo lea ella, su buzón (su pública); para que sepa que eres tú, tu sello (tu privada).

**Escenas:** diez, en cinco capítulos (Dos maneras de cifrar · Solo para sus ojos · La huella · El sello · El saludo).
Como en V6, el cierre vive dentro del último capítulo de contenido, así que el «o sea, que…» del capítulo V va en s09.

| Escena | Cap. | s | Qué se ve | Qué se aprende · cues |
|---|---|---|---|---|
| s01-hook «Una línea, cuatro piezas» | I Dos maneras de cifrar | 42 | Sello «martes 3-11 · Autoridad Portuaria de Halden» y una tira «portal de reservas de atraque» (sin nombre de equipo). Una terminal rotulada «prueba de conexión · desde fuera, como una naviera» ejecuta `curl -v https://reservas.haldenport.example/`; pasan en gris las líneas del saludo (`Client hello`, `Server hello`, `Certificate`, `CERT verify`, `Finished`) y se queda una, ampliada a 48–60 px: `SSL connection using TLSv1.3 / TLS_AES_256_GCM_SHA384 / X25519 / id-ecPublicKey`. Debajo, a media luz y sin leerlas: `issuer: CN=Confianza Global TLS Issuing CA 3`, `expire date: Nov 11 23:59:59 2026 GMT`, `SSL certificate verify ok`. La línea se parte en cuatro fichas, cada una con una interrogación. La primera frase habla de la línea entera («cuatro piezas»); al acabarla, título «Criptografía: quién usa qué clave» (hacia los 7 s, siempre antes de los 12) y la promesa en tres chips: «quién usa qué clave · hash y firma · por qué TLS es híbrido». La línea se encoge a una esquina con la nota «al final, la lees entera» | La promesa en los primeros 10 s: una conexión normal junta varias piezas de criptografía, y al final quien lo ve sabrá leerlas · `terminal, line, title, promise, pieces, later` |
| s02-familias «Una llave para dos, o un buzón» | I | 56 | A la izquierda, una cerradura y una llave con dos copias, una en el puerto y otra en la naviera: «la misma clave cierra y abre» · «rápida: discos, bases de datos, tráfico». Nombre SYMMETRIC · AES. La copia viaja por una carretera con una sombra al lado: «¿cómo le llega la copia sin que nadie la vea?». A la derecha, el buzón de la naviera: por la ranura echan cartas manos distintas («clave pública · la tiene cualquiera») y solo la dueña lo abre con su llave («clave privada · no sale de casa»). Rótulo «lo que cierra una, solo lo abre la otra». Nombre ASYMMETRIC · RSA, ECC. Barra de velocidad: AES «muy rápida» frente a RSA «muchísimo más lenta». Mensaje interceptado, con el rótulo de presentación «NULL CIPHER · célula de acceso inicial» (38); la voz: «Es NULL CIPHER, una célula de acceso inicial. Busca el primer hueco que no cierre». Respuesta: con la pública, es verdad, no hay secreto que repartir; pero la barra de RSA se queda corta ante unos gigas. Dos chips para cerrar: «simétrica: el volumen» · «asimétrica: acordar claves y firmar» | Simétrica, una clave compartida y rápida, con el problema de repartirla; asimétrica, un par, lenta, para acordar claves y firmar · `one-key, copies, fast, road, mailbox, slot, owner, pair, slow, families, roles` · **intercept** |
| s03-naviera «Solo para la naviera» | II Solo para sus ojos | 52 | «Oferta comercial 2027 · para una naviera · confidencial»: precios y bonificaciones que la competencia no debe ver. La pregunta: ¿con qué clave la cierras? Dos claves a la vista, rotuladas «pública de la naviera» y «privada del puerto». Mensaje interceptado. La respuesta por pasos: la oferta cerrada con la privada del puerto se abre con «la pública del puerto», que tiene una multitud de iconos: «la abre cualquiera» (`anyone`). Se rehace: la oferta cae por la ranura del buzón de la naviera («su pública», `slot`) y solo su llave la abre («su privada»). Regla grande: «cifras con SU pública». Nombre CONFIDENTIALITY. Nota pequeña, solo en pantalla: «TLS protege el camino · esto protege el documento, esté donde esté». Al pie, un aviso que vuelve en s07: «tu privada sirve para otra cosa · capítulo IV» | Confidencialidad: se cifra con la clave pública del destinatario; con la privada propia, lo lee cualquiera · `offer, two-keys, wrong, anyone, slot, only-her, rule, confidential, later` · **intercept** |
| s04-huella «Una huella no se descifra» | III La huella | 44 | La oferta entra en una máquina rotulada SHA-256 y sale una ristra corta y siempre igual de larga, `e3a1…9c07` (inventada, abreviada de 64 caracteres; no coincide con ningún hash del registro). La imagen: la huella de la oferta, pegada al documento (en la voz, siempre «la huella de la oferta», nunca la de quien la escribió). Se cambia un precio («12,40» pasa a «12,41») y la huella cambia entera. Un camino de vuelta, tachado: «una sola dirección · sin clave · no se descifra». Nombre HASH, con «no es cifrado» debajo y «integridad: ¿ha cambiado?». Después, dos documentos distintos con la misma huella, rotulados «colisión»: MD5 y SHA-1 con un sello «retirados»; SHA-256 y SHA-3, «hoy» (en la voz, media frase; el resto, en pantalla) | Un hash es una huella de longitud fija, de una sola dirección y sin clave; sirve para la integridad y no cifra; MD5 y SHA-1, retirados por colisiones · `machine, print, change, one-way, hash, collision, retired` |
| s05-contrasenas «Cómo se guarda una contraseña» | III | 58 | La pantalla de acceso a la zona de la naviera en el portal. Rótulo: «el portal no necesita leer tu contraseña: solo comprobarla», así que guarda su huella, no la contraseña cifrada. Antes de la tabla, dos trucos contados en llano y sin nombre, cada uno con su icono: «a cada contraseña, un dato al azar antes de sacar la huella» y «sacar la huella miles de veces seguidas, para que cada intento cueste». Una tabla rotulada «ejemplo · así no»: dos cuentas distintas con la misma contraseña y la misma huella (`7c1d…a4b0` dos veces, `twins`). Pregunta para pensar, con dos botones: «un dato al azar» y «miles de veces». La respuesta: el dato al azar, distinto en cada cuenta y guardado junto a su huella; la misma contraseña da huellas distintas (`2f9e…11c3`, `b80a…6d57`). Un catálogo de «huellas ya calculadas» (rainbow table) se tacha. Nombre SALT. Después, el otro truco, que no arregla las huellas iguales pero encarece cada intento: dos relojes con las palabras de la lección (`:121`): «quien entra: milisegundos, ni lo nota» frente a «quien prueba mil millones: una muralla» (solo en pantalla). Nombre KEY STRETCHING · bcrypt · PBKDF2 · Argon2. Tachado pequeño, solo en pantalla: «SHA-512 a secas: más larga, casi igual de rápida» | Las contraseñas se guardan como huella, nunca cifradas; salt hace distintas dos iguales; key stretching encarece cada intento · `login, compare, tricks, twins, choice, salt, catalog, stretch, clocks, not-longer, wrap` · **think** |
| s06-solo-huella «La huella sola no basta» | IV El sello | 36 | La naviera ya ha abierto la oferta con su llave y se pregunta dos cosas: «¿es del puerto?» y «¿la ha tocado alguien?». Mensaje interceptado. Después, el ejemplo, rotulado «ejemplo · así no · lo que propone NULL CIPHER» (45) y contado como hipótesis («imagínate que…»), sin el portal de fondo: por la ranura del buzón de la naviera echa cartas cualquiera; alguien escribe una oferta falsa, le adjunta su huella bien calculada y la echa por la ranura; la naviera comprueba la huella y encaja: «encaja, y es falsa» (`both-match`). Cerrar para la naviera tampoco dice quién escribió. Regla: «la huella dice que no cambió · no dice quién la hizo» | Un hash adjunto prueba la integridad de lo que llega, no quién lo escribió · `doubts, slot-again, fake, both-match, who` · **intercept** |
| s07-sello «El sello del puerto» | IV | 50 | La imagen: el sello de lacre del puerto. El anillo solo lo tiene el puerto («clave privada»); el dibujo del sello lo conoce todo el mundo («clave pública»). El puerto saca la huella de la oferta y la sella con su anillo. En la naviera, por pasos: vuelve a sacar la huella de lo que ha recibido; comprueba el sello con la pública del puerto: «el sello encaja con la huella que acaba de sacar» · «del puerto · intacta» (`seal-ok`). Variante: un precio cambiado, la huella cambia y el sello ya no encaja. Nombre DIGITAL SIGNATURE y tres chips: INTEGRITY · AUTHENTICATION · NON-REPUDIATION («el puerto no puede negar que la ofreció»). Vuelve el aviso de s03: «tu privada no esconde: firma». La pareja de reglas, con sus dos imágenes: «para que solo lo lea la naviera: su buzón» · «para que sepa que eres tú: tu sello» | La firma es la huella sellada con la privada de quien firma; se comprueba con su pública; da integridad, autenticidad y no repudio · `ring, design, seal, recompute, verify, seal-ok, tampered, signature, three, pair` |
| s08-mezcla «Pinturas en la carretera» | V El saludo | 56 | Vuelve la carretera de s02, con su sombra y su pregunta: «¿cómo le llega la copia de la llave?». La imagen, las pinturas, sin decir todavía qué viaja y qué no: un color común a la vista de todos; el puerto le añade su color secreto y la naviera el suyo; las mezclas se cruzan por la carretera (la sombra las ve); cada lado echa su secreto en la mezcla del otro y los dos llegan al mismo color (`same`). La sombra solo tiene mezclas: «una mezcla no se separa». Pregunta para pensar. Respuesta: «no viaja · cada lado lo calcula». Nombre DIFFIE-HELLMAN, y ECDH, «la misma idea con curvas elípticas». Bajo la sombra, el límite: «la pintura no dice con quién has mezclado» (41); en la voz, «Eso sí, la pintura no te dice con quién has mezclado. Te lo dice el sello, que ahora verás en la línea». Del color final sale la llave para dos de s02: «la copia que nadie tuvo que llevar · session key» | Diffie-Hellman (ECDH) deja a dos partes sin secreto previo con un secreto común, sin enviarlo nunca; ese secreto es la clave de sesión; y no dice con quién has mezclado · `road, common, secrets, swap, same, unmix, choice, dh, with-whom, session-key` · **think** |
| s09-linea «La línea, entera» | V | 50 | Vuelve la línea de s01, grande. Cada ficha se enciende al compás de la voz, con el icono de su imagen: `X25519`, la pintura («acuerdan la clave de sesión · ECDH»); `AES_256_GCM`, la llave para dos («cifra todo el tráfico · simétrica»); `SHA384`, la huella («comprueban que nadie ha tocado el saludo»); `id-ecPublicKey`, el sello («el servidor sella el saludo con su privada · has mezclado con el dueño de esa clave»). Rótulo HYBRID: «asimétrica para empezar · simétrica para todo lo demás». La oferta de s03, un momento: «la oferta, igual: el documento con una clave simétrica · esa clave, por el buzón de la naviera». Al final se encienden las líneas del certificado de s01 (`issuer: CN=Confianza Global TLS Issuing CA 3`) y una pregunta: «¿cómo sabe la naviera que esa clave pública es del puerto?», con «siguiente vídeo» | TLS es híbrido: asimétrica (ECDH y el sello del servidor) para empezar, simétrica (AES) para el tráfico; y la oferta, igual · `line-back, x25519, aes, sha, ec-key, hybrid, offer-too, question` |
| s10-recap «Tres reglas» | V | 36 | Tres tarjetas de reglas, una cada vez, con sus iconos (buzón y sello · huella · pintura y llave). Tarjeta final Alertópolis: «Tu turno: el laboratorio Crypto Toolbox» (spl1c, 12 necesidades, ≥80 %) | Reflejos · `recap, rule-1, rule-2, rule-3, next, endcard` |

- **Exam cards** (objetivo 1.4), una por escena en s02–s05 y s07–s09; ninguna en s01, s06 ni el cierre. Con
  `"examTiming": "sentence-end"`, cada una espera a que acabe su frase y necesita unos 5 s de escena detrás: su cue va antes
  de la última frase de la escena (`families` antes de `roles`, `confidential` antes de `later`, `hash` antes de
  `collision`, `stretch` antes de `wrap`, `three` antes de `pair`, `dh` antes de `with-whom`, `hybrid` antes de
  `offer-too`).
  - «Symmetric: una clave, rápida; asymmetric: un par, lenta» (s02) (55)
  - «Confidencialidad: cifra con la pública del destinatario» (s03) (55)
  - «Hash: una sola dirección y sin clave; no es cifrado» (s04) (51)
  - «Contraseñas: hash con salt único y key stretching» (s05) (49)
  - «Firma: tu privada; integridad, autenticidad, no repudio» (s07) (55)
  - «Key exchange: Diffie-Hellman, secreto común sin enviarlo» (s08) (56)
  - «TLS híbrido: asimétrica acuerda, AES cifra el tráfico» (s09) (53)
- **Think prompts** (`holdMs` 4500):
  - «Dos cuentas, misma huella: ¿qué truco faltó?» (s05) (44), con los botones «un dato al azar» y «miles de veces». Llega
    con los dos trucos ya contados en llano, sin nombre, y con la tabla «así no» a la vista. Respuesta: el dato al azar, que
    la voz nombra entonces SALT; con él, la misma contraseña deja huellas distintas. El otro truco, que se nombra justo
    después (KEY STRETCHING), no lo arregla: hace más lento cada intento, pero dos contraseñas iguales seguirían dando la
    misma huella (la explicación del check, `:132`).
  - «Ese color final, ¿viaja por la carretera o no?» (s08) (46). Llega sobre la imagen, sin que nadie haya dicho antes «no
    se envía» y sin nombrar todavía la clave de sesión. Respuesta: no. Lo que viaja son las mezclas; el color final lo
    calcula cada lado y la sombra solo tiene mezclas (q2, `:178`).
- **Mensajes interceptados** (NULL CIPHER, uno por capítulo en I, II y IV; ninguno en el cierre; `holdMs` ~3800, 4000 los
  de s03 y s06, los más largos):
  - s02: «Cifrar los gigas con RSA. Sin secreto que repartir. Lógico.» (59). El error que corrige la narradora: usar la
    asimétrica para el volumen. La mitad cierta es la del problema que s02 acaba de plantear: con la pública, es verdad, no
    hay secreto que repartir. La conclusión, no: RSA es muchísimo más lenta y nadie cifra gigas con ella (q1, `:163`). Con
    la asimétrica se reparte la clave, no los gigas, y cómo, lo cuenta el capítulo V. La corrección no compara bits entre
    familias, y la voz dice «gigas», nunca «una copia de 2 TB» (`sp/labs.ts:143`).
  - s03: «Cifrar con la privada. Nadie más la tiene, nadie más lo lee. Lógico.» (68). El error: cifrar con la clave privada
    propia para dar confidencialidad, el distractor que la lección señala con nombre (`:44`). La primera mitad es verdad
    (nadie más tiene esa privada), y la conclusión no: lo que cierra tu privada lo abre tu pública, y tu pública la tiene
    todo el mundo (la explicación del check, `:79`). Eso no esconde nada; sirve para otra cosa, que llega en el capítulo IV.
  - s06: «Adjuntar el hash. Si la tocan, se nota. Si no, es del puerto. Lógico.» (69, `holdMs` 4000). El error: creer que
    un hash adjunto prueba de quién es. Prueba que lo que llegó no cambió (para eso sirve, y la voz nunca dice que «no sirve»), pero quien escribe una
    oferta falsa le adjunta su propia huella, y encaja. La huella dice que no cambió, no quién la hizo; para eso, la firma
    (q3, `:193`).
- **Cierre:** tres reglas y una sola tarea.
  1. Para que solo lo lea el destinatario, su buzón: cifras con su clave pública. Para que sepa que eres tú, tu sello: firmas con tu
     privada.
  2. Un hash es una huella: no se descifra. Las contraseñas se guardan así, con sal y despacio.
  3. Asimétrica para acordar la clave y firmar; simétrica para todo lo demás. Eso es TLS.

  Tarea: el laboratorio spl1c «Crypto Toolbox» (`sp/labs.ts:44-54`), que pide justo lo que enseña el vídeo: elegir entre
  Symmetric, Asymmetric, Hashing y Digital signature para doce necesidades. Las 8 preguntas de la lección cubren la mitad
  con temas que el vídeo deja fuera (q4, q5, q7 y q8), así que el laboratorio es la práctica que le corresponde.
- **Se queda fuera** (sigue en la lección, que quien ve el vídeo ya ha leído):
  - Los niveles de cifrado (full-disk, partition/volume, file, database, record/field, transport): `sp/sp1-part4.ts:86-96`;
    check `:98-111`; quiz q4 (`:196-209`). Del transporte solo queda la nota en pantalla de s03.
  - La longitud de clave y ECC frente a RSA (ECC-256 ≈ RSA-3072; AES-128 y AES-256): `:84`; quiz q5 (`:211-224`). ECC
    sale solo como nombre de algoritmo asimétrico (s02) y en la línea de `curl` (s09).
  - Steganography, tokenization, data masking y blockchain: `:135-143`; fila de la tabla `:37`; quiz q7 (`:241-254`) y q8
    (`:256-269`).
  - La tabla de necesidades entera (`:29-39`): el vídeo usa cinco de sus filas, nunca la tabla.
  - Los detalles del saludo de TLS 1.3 (qué hace cada mensaje, el modo GCM, para qué sirve exactamente SHA-384): solo en
    pantalla, sin explicarlos.
- **Laboratorios:** el que toca es **spl1c «Crypto Toolbox»** (`sp/labs.ts:44-54`, datos `:133-203`), que clasifica doce
  necesidades en las cuatro familias. Como spl1c practica la tabla de la lección (`sp/sp1-part4.ts:29-39`), las reglas del
  vídeo contestan casi todo el laboratorio; no es destripar, porque la tabla va antes. **El vídeo enseña las reglas de la
  lección, que contestan el laboratorio, sin usar ninguno de sus escenarios**, que el guion tiene prohibidos tal cual: la
  copia de 2 TB (`sp/labs.ts:143`), el instalador (`:148`), el correo de la directora financiera (`:153`), «a server you
  have never contacted» (`:158`; por eso el concepto 5 dice «sin ningún secreto previo»), los portátiles (`:168`), el
  firmware (`:173`), el log encadenado (`:183`), el contrato del proveedor (`:188`) y el túnel VPN (`:198`). El vídeo no hace
  ningún juego de clasificar ni da una lista de casos con su familia, y manda al laboratorio para practicar. spl1a
  (`:17-32`, controles) y spl1b (`:33-43`, orden de un cambio) no se tocan.

**Canon nuevo que fija V11** (nada de esto estaba en los datos del curso; lo posterior debe respetarlo):
- **2026-11-03 (martes):** el día del vídeo. Una naviera, **sin nombre**, recoge en el portal de reservas su oferta
  comercial para 2027 (precios y bonificaciones; confidencial). No se nombra a nadie nuevo.
- **`reservas.haldenport.example` es el nombre público del portal de reservas de atraque** (`hpa-portal-web-01`,
  `sp/sp4-part3.ts:56`). Es el segundo nombre bajo `haldenport.example` después de `mx.haldenport.example`
  (`video/capas-halden/src/scenes/S02Spoof.tsx:141`), así que V11 sigue a V1 y V6 en la contradicción de dominios del
  registro (§5.2). Ninguna IP del portal sale en pantalla.
- **Su conexión el 3-11:** TLS 1.3, `TLS_AES_256_GCM_SHA384`, `X25519`, clave del servidor de curva elíptica
  (`id-ecPublicKey`) y «SSL certificate verify ok»: ese día el servidor enviaba la cadena completa. El propio servidor
  termina TLS (encaja con «sin WAF delante», `sp/sp4-part3.ts:57`).
- **Su certificado hasta el 11-11:** `CN=reservas.haldenport.example`, emitido por `Confianza Global TLS Issuing CA 3`, la
  CA ficticia de la lección (`sp/sp1-part4.ts:310-327`, con su raíz `Confianza Global Root`, `:301-306`); clave ECC P-256;
  válido del 11-11-2025 al 11-11-2026 a las 23:59:59 GMT (366 días, permitido para un certificado emitido antes del
  15-3-2026). La fecha de caducidad solo sale a media luz en s01: la recoge V12.
- **El portal tiene una zona privada por naviera**, con usuario y contraseña, y guarda esas contraseñas como hash con salt
  por cuenta y key stretching. La tabla «así no» de s05 es un ejemplo, no el portal. Son las cuentas de las navieras, no
  las de la plantilla: el proveedor de identidad del puerto (V6, V10) no sale.
- **La oferta va cifrada para la naviera y firmada por el puerto.** En la práctica, híbrida: el documento con una clave
  simétrica, y esa clave cerrada con la pública de la naviera (s09). No se dice dónde guarda el puerto su clave de firma.
  La oferta falsa de s06 es un ejemplo en condicional, no un hecho.
- **NULL CIPHER, primera aparición.** La narradora presenta a NULL CIPHER con el anuncio de su jefe (`sp/sections.ts:47`): «Es NULL
  CIPHER, una célula de acceso inicial. Busca el primer hueco que no cierre». En todo el vídeo, ni «puerta» ni «llave» para
  NULL CIPHER: son la imagen del spraying de RED MARROW en V10, que se graba en la misma sesión. Su registro, distinto del
  de SILENT PAGER (ironía y burla, tutea) y del de RED MARROW (consejos de amigo, «Confía en mí»): **habla como un manual de
  procedimiento**, en infinitivo y sin persona gramatical, con una razón técnica que suena impecable y lleva a la conclusión
  equivocada, y cierra siempre con «Lógico.». Usa la jerga (RSA, privada, hash) que la narradora traduce a imágenes. Solo
  da consejos: no ataca nada, no tiene IP, dominio ni equipo en pantalla. Voz: `sapi/Microsoft Helena`, `rate` 0, efecto
  `cifrado` (o `machine`, solo si `cifrado` no llega a V11; lo que se publique se queda). **Género:** ningún texto del vídeo
  marca el género («una célula» es texto del curso y concuerda con la palabra «célula»); la voz de Helena fija a NULL CIPHER
  como mujer, que coincide con «NULL CIPHER neutralizada» (`sp/sections.ts:49`). Se apunta así en el registro si Lidia lo confirma (por defecto, sí).
- **Comprobado contra la cronología:** 3-11 martes y 11-11 miércoles (Node). Queda después de todo lo fechado de Halden
  (V6 hasta el 28-10, V10 el 20-21-10, el plazo de V5 del 31-10) y antes de la ventana de V16–V17 (16–27-11) y de la MFA
  del proveedor de identidad (30-11, V10). El plan de red de V16, que se aprueba el 20-11, llevará `hpa-portal-web-01` a la
  DMZ por fases desde el 1-12: no choca, porque V11 no dice dónde vive el portal en la red y solo se conecta a él desde
  fuera.

**No se toca:**
- El caso `IR-2026-0147` (3 y 4-9) ni nada suyo: fechas, equipos, `svc_tosreport`, SILENT PAGER. Tampoco la noche del 20 al
  21-10 de V10: el portal sale como escenario y nada más; ni el traversal, ni el DDoS, ni el FINDING #0147 del escaneo del
  1-9 (`sp/sp4-part3.ts:55`).
- **Lo que pudo leer el traversal del 21-10.** V10 sacó `/etc/passwd` de este mismo equipo. Ningún vídeo dice qué pudo o no
  pudo leer: ni las contraseñas de las navieras, ni la clave del certificado, ni las ofertas. Por eso s06 va en condicional,
  con el buzón y sin el portal de fondo, y nadie cambia nada en el portal.
- **El dosier de NULL CIPHER** (`sp/sections.ts:49`): ningún certificado autofirmado, ninguna raíz instalada «temporalmente»,
  ningún almacén de confianza tocado, ningún lector de badges, la palabra «inventario» no sale y nadie firma «GH».
- **La pista del ASN** (`sp/sections.ts:106`): NULL CIPHER no tiene IP, dominio ni infraestructura en pantalla, y nada
  relaciona a NULL CIPHER con otro adversario ni con GLASS HARBOR (tampoco una imagen compartida: ni puertas ni llaves).
- El anuncio de su jefe habla de «cambios sin aprobar» (`sp/sections.ts:47`): el vídeo no enseña ningún cambio, aprobado o
  no.
- **CHG-2041** (rotación del wildcard interno `*.halden-port.local`, 6-9, `sp/sp1-part3.ts:70-83`): es otro certificado,
  interno y con otro dominio (con guion); V11 no lo menciona.
- La fila «Certificado próximo a caducar» de la cola tranquila del SIEM (4-9, `portal.puerto-halden.example`,
  `video/siem/src/data/s08-triage.ts:15`) sigue de fondo: V11 no la relaciona con el portal ni usa ese dominio.
- El proveedor de identidad de Halden y su MFA (Sistemas, 30-11, V10): las contraseñas de s05 son las de las navieras en
  el portal.
- La imagen del sello sale de V1, pero la voz no recuerda el correo de Lucía ni DMARC: ese correo es del caso de septiembre.
- Los «sistemas de manifiestos» que una naviera conectará en la lección de sp5 (`sp/sp5-part4.ts:27`) y los demás
  manifiestos de las lecciones (`sp/sp2-part4.ts:75`, `sp/sp5-part4.ts:109`, `:351`): la naviera de V11 recoge una oferta,
  no manifiestos.
- Ninguna huella de pantalla coincide con las del registro (`b41f0e7c…c7a2`, `9f2b7c…41d0`, `4e81a0…c92f`) ni con las de
  GCTI (`9f3a…e1`, `4c81…b3`).
- No se culpa a nadie: la tabla de s05 es un ejemplo de lo que no se hace, no un fallo del portal.

**Comprobación de límites** (recontada con Node tras la revisión, `.length` de JavaScript, el mismo cálculo que
`analyzeNarration`):
- 10 escenas en 5 capítulos (máximo 5). Suma de `s`: 480 s; estimado ~550 s y renderizado ~510–515 s, dentro de 380–600.
- 5 conceptos (4–6).
- 7 tarjetas de examen (5–8), una por escena como mucho, ninguna en la última; todas ≤ 58 caracteres (la más larga, 56),
  sin `{}[]|<>` ni flechas, marcas, viñetas o emoji.
- 2 preguntas para pensar (exactamente 2), ≤ 48 caracteres (44 y 46), `holdMs` 4500.
- 3 mensajes interceptados (2–4), uno por capítulo como mucho (capítulos I, II y IV) y ninguno en la escena final;
  ≤ 70 caracteres (59, 68 y 69); `holdMs` 3800–4000, dentro de 2500–4500; `video.json` lleva `"adversary": "NULL CIPHER"`.
- `wordBudget` por escena (`s` × 2,7): s01 113 · s02 151 · s03 140 · s04 119 · s05 157 · s06 97 · s07 135 · s08 151 ·
  s09 135 · s10 97 (total 1.295).
- Sin identificadores en la voz: `reservas.haldenport.example`, `curl`, `X25519`, `id-ecPublicKey`, los hashes y el emisor
  van en pantalla; la voz dice «el portal», «una curva elíptica», «la clave pública del servidor».

---

### V12 · sp1m7 · Cápsula · «PKI en la consola: el eslabón que falta, CRL y OCSP»

> Propuesta del 2026-10-04; aprobada el 2026-10-05 con las opciones recomendadas (Lidia delegó las decisiones). Segunda parte de la serie «Confianza»: sigue a V11
> (sp1m6) con una frase de puente. Se graba en la misma sesión que V13. La versión vigente de escenas y guion será
> `video/pki-halden/storyboard.json` + `narration.json`; qué se quedó fuera, en `video/pki-halden/out/script-notes.md`.
>
> **Revisada el 2026-10-05** (exactitud y canon, `revision-V11-V12.md`): la raíz está «ya en el trust store del cliente»,
> no «de serie» (tarjeta de s03 e imagen del ancla); la revocación, en condicional y solo con los dos motivos de la lección,
> sin decir cómo se filtraría una clave; y el plan de red de V16 se aprueba el 20-11 y va por fases desde el 1-12. De los
> menores: «la raíz no hace falta mandarla», la regla 1 del cierre con el autofirmado, la pregunta para pensar sin rótulos
> que la contesten, los 200 días justos, Infraestructura en vez de Sistemas, «desde ayer por la tarde», «y se pide otro con
> una clave nueva» y la tarjeta final.
>
> Rutas relativas a la raíz del repo; `sp/` = `src/data/secplus/`. Las decisiones, con lo descartado y los riesgos,
> están en `docs/reviews/2026-10-05-fichas-tanda3/decisiones.md` (apartado V12); la voz de NULL CIPHER y la pregunta para Lidia son las de V11.

- **Carpeta:** `pki-halden` · perfil `capsula-yt` (190–260 s renderizados; objetivo ~4:00, sin rellenar) · objetivo
  **1.4** (lo confirma la cabecera de la lección, `sp/sp1-part4.ts:274`) · adversario **NULL CIPHER**
  (`sp/sections.ts:43-50`), dos mensajes interceptados, con la voz con que se publique V11 (`sapi/Microsoft Helena`,
  `rate` 0 y `cifrado`; V12 no tiene reserva propia: si V11 salió con `machine`, V12 también) · voz `recording/lidia` con
  `"recording": { "tempo": 1.08, "maxPauseMs": 250 }` · música `Go On Going - Stayloose.mp3` · en `video.json`,
  `"lesson": "sp1m7"` y `"adversary": "NULL CIPHER"`.
- **Etiquetas** (`video.json` → `"tags"`): PKI, cadena de confianza, chain of trust, certificado intermedio, root CA,
  trust store, openssl s_client, revocación de certificados, CRL, OCSP, OCSP stapling, Security+.
- **Efectos (`sfx`):** los automáticos del motor y cinco momentos: `one-link` («error», la cadena con un solo
  certificado), `middle` («error», alguien en medio enseña su certificado), `ok` («check», `Verify return code: 0`),
  `revoke` («block») y `stapled` («lock», la respuesta grapada).
- **Duración:** suma de `s` **210 s** (6 escenas). Es la estructura de V10 (dos mensajes y una pregunta), que con 220 s de
  escenas estimó 273,5 s y, con el ritmo de Lidia (91–93 % del estimado), sus notas lo proyectan en ~4:10. Con 210 s, V12
  daría **unos 260 s estimados y 235–245 s renderizados (≈ 4:00)**, dentro de 190–260. Si el estimado pasa de 260 s, el
  validador solo avisa (como en V10), pero se recorta igual. La suma predice mal (V5 0,89 veces, V4 1,22), así que el primer
  borrador se mide por los dos lados: si pasa de 255 s, se recorta primero s05 (la privacidad de OCSP, solo en pantalla) y
  luego s04 (las dos URL, sin leerlas en voz); si se acerca a 190 s, se alarga s02, la lectura de la salida. No se
  rellena. s01 es la escena más apretada (65 palabras para el puente, el título, la promesa, la tira de la renovación y el
  mensaje de la naviera): si el título cae después de los 12 s, la tira de la renovación pasa al principio de s02.
- **Inserción:** en `sp/sp1-part4.ts`, lección sp1m7, entre el check de OCSP stapling (`:367-381`) y el párrafo de key
  escrow (`:382-385`), como bloque `youtube`. Lo puede preceder una línea: «Antes de seguir con la gestión de claves, míralo
  en una consola: una cadena a la que le falta un eslabón y cómo se entera un cliente de que un certificado ya no vale».
  Así el vídeo llega después de todo lo que enseña: la cadena (`:297-331`), la nota de examen (`:332-337`), el check del
  emisor desconocido (`:338-352`), self-signed (`:357`), la revocación (`:363-366`) y el check de stapling. Cuenta el
  mismo caso que ese check del emisor desconocido (`:341`), que quien ve el vídeo ya ha contestado: lo repasa en una
  consola, no lo destripa. Se fija en la suite `lesson videos` de `src/data/content.test.ts` (`:248`).
- **Enfoque («el eslabón que falta»):** la semana después de V11. El certificado del portal de reservas caducaba el
  miércoles 11-11 (V11 lo enseña a media luz) y el lunes 9-11 por la tarde se instala el nuevo. El martes 10-11 a primera
  hora, una naviera avisa: desde la tarde anterior, su programa no conecta («unable to get local issuer certificate»). Con
  `openssl s_client -showcerts` se ve por qué: el servidor solo manda su certificado, sin la intermedia, y nadie puede subir
  por la cadena hasta una raíz conocida. Se arregla y se comprueba con el mismo comando. Después, la naviera hace la pregunta
  que abre la otra mitad de la lección: si un día revocáis este certificado, ¿cómo nos enteramos? CRL frente a OCSP, y la
  decisión del puerto, OCSP stapling, comprobada con `openssl s_client -status`. Más de la mitad del vídeo es consola. NULL
  CIPHER vuelve con dos consejos de manual: quitar la verificación y esperar a que caduque. **No se revoca nada ni se filtra
  ninguna clave:** la revocación va en condicional, «si un día…», y sin decir cómo se filtraría. Frase de puente para quien
  no vio V11: «En el vídeo anterior quedó una pregunta: cuando el portal te da su clave pública, ¿cómo sabes que es del
  puerto?».

**Conceptos (2) y su imagen:**

| # | Concepto | Imagen que se mantiene | Tarjetas |
|---|---|---|---|
| 1 | La cadena de confianza. El certificado del servidor (leaf) lo firma una intermedia, y a la intermedia, la raíz. La raíz se firma a sí misma (self-signed) y ya está en el almacén de confianza del cliente (trust store), porque se reparte a los almacenes (`:357`, q3 `:486`); el servidor tiene que mandar su certificado y la intermedia, y la raíz no hace falta mandarla. «Emisor desconocido» quiere decir que falta la intermedia o que el certificado es autofirmado (`sp/sp1-part4.ts:297-331`, nota `:336`, check `:341-350`, q3 `:479-492`) | La cadena del ancla: el ancla (la raíz) ya está a bordo de tu barco, que es tu almacén de confianza; el eslabón del medio es la intermedia y el último es el certificado del portal. Si falta el del medio, el último cuelga de nada. Y un ancla que te tira otro barco no te sujeta: la raíz que vale es la que tu equipo ya tenía, no la que te mandan | «Issuer unknown: falta la intermedia o es self-signed» · «Root CA: self-signed y ya en el trust store del cliente» |
| 2 | La revocación. Un certificado puede dejar de valer antes de caducar (se filtra la clave privada, el dominio cambia de dueño: los dos motivos de la lección, sin decir cómo), y entonces se revoca ya, no se espera, y se pide otro con una clave nueva. CRL: una lista firmada por la CA que el cliente descarga cada cierto tiempo, y que puede ir horas o días por detrás. OCSP: se pregunta a la CA en el momento por ese certificado; respuesta fresca, pero con latencia, carga en la CA y la CA sabe qué visitas. OCSP stapling: el propio servidor trae la respuesta firmada y reciente, grapada al saludo, y el cliente no pregunta a nadie (`:365`, check `:370-379`, q4 `:494-507`) | El hotel que comprueba tu DNI: la lista de documentos robados que llega a recepción una vez al día (si te lo roban esta mañana, no sale hasta mañana); llamar a la policía con cada huésped (al momento, pero con cola, la policía saturada y sabiendo dónde duerme cada cual); y el huésped que trae, junto al DNI, un justificante sellado por la policía esta misma mañana | «CRL: lista periódica; puede ir horas por detrás» · «OCSP: estado al momento; stapling: lo trae el servidor» |

**Escenas:** seis, en tres capítulos (La cadena · ¿Sigue valiendo? · Para el examen).

| Escena | Cap. | s | Qué se ve | Qué se aprende · cues |
|---|---|---|---|---|
| s01-hook «No encuentro al emisor» | I La cadena | 24 | La línea de V11 a media luz y, encima, la pregunta con la que acabó: «¿cómo sabes que esa clave pública es del puerto?» (la frase de puente). Al responder («te lo dice su certificado»), título «PKI: la cadena y la revocación» (hacia los 9 s, siempre antes de los 12) y la promesa en tres chips: «leer la cadena · arreglarla · saber si sigue valiendo». Después, una tira: «lunes 9-11 · por la tarde · certificado nuevo en el portal · el anterior caducaba el 11-11». Y el mensaje de la naviera: «martes 10-11 · 08:15 · desde ayer por la tarde nuestra integración no conecta con vuestro portal: `unable to get local issuer certificate`» | La promesa en los primeros 10 s y el puente con V11 · `bridge, title, promise, renewal, message` |
| s02-cadena «Un solo eslabón» | I | 42 | Terminal, «10-11 · 08:40»: `openssl s_client -connect reservas.haldenport.example:443 -showcerts`. La salida, de OpenSSL 3: `depth=0 CN = reservas.haldenport.example` · `verify error:num=20:unable to get local issuer certificate` · `verify error:num=21:unable to verify the first certificate` · `Certificate chain` con una sola entrada, `0 s:CN = reservas.haldenport.example` · `i:CN = Confianza Global TLS Issuing CA 3` · `a:PKEY: id-ecPublicKey, 256 (bit); sigalg: ecdsa-with-SHA384` · `v:NotBefore: Nov  9 00:00:00 2026 GMT; NotAfter: May 27 23:59:59 2027 GMT`, el bloque del certificado abreviado y, al final, `Verify return code: 21 (unable to verify the first certificate)`. Dónde mirar, por pasos y con el resto atenuado: la lista de la cadena, que solo tiene la entrada `0` (`one-link`); la línea `i:`, quién lo firmó; el error 20, «no encuentro al emisor». La imagen: la cadena del ancla, **sin rótulos todavía**: un ancla, un hueco y el último eslabón, el del portal. Pregunta para pensar, con dos botones: «raíz» e «intermedia». Con la respuesta llegan los rótulos: el ancla, «raíz · Confianza Global Root · ya está en tu equipo»; el hueco, INTERMEDIATE CA («Issuing CA 3 · no ha llegado»). Nombres LEAF, ROOT CA, TRUST STORE y CHAIN OF TRUST | El servidor solo manda su certificado y nadie puede subir hasta una raíz conocida: falta la intermedia (o, en otro caso, el certificado es autofirmado) · `terminal, chain-list, one-link, issuer, error-20, anchor, choice, intermediate, issuer-unknown, names` · **think** |
| s03-arreglo «El eslabón del medio» | I | 42 | «¿Cómo se arregla?». Mensaje interceptado (con «Vuelve NULL CIPHER», sin más presentación). Respuesta: entre la naviera y el portal aparece alguien que enseña su propio certificado; con la verificación quitada, la naviera cifra igual, pero para quien se ha puesto en medio (`middle`): «cifrado, sí · ¿con quién?». Después, la causa, sin culpas: «la CA entrega dos ficheros: el certificado y la cadena · se instaló uno» («de los despistes más comunes»). «09:10 · Infraestructura instala la intermedia» (la tira no recuerda ningún paso de verificación de un cambio). El mismo comando: `depth=2 CN = Confianza Global Root` · `depth=1 CN = Confianza Global TLS Issuing CA 3` · `depth=0 CN = reservas.haldenport.example`, todos `verify return:1`; la lista de la cadena, con `0` y `1`, y `Verify return code: 0 (ok)` (`ok`). Dónde mirar: el servidor manda dos; el tercero, la raíz, lo pone el equipo de la naviera desde su almacén. La raíz ampliada: «Subject = Issuer · se firma a sí misma». La cadena del ancla, completa: «la raíz no hace falta mandarla: ya la tienes» (44). El programa de la naviera conecta | La raíz es autofirmada y ya está en el almacén del cliente; el servidor manda su certificado y la intermedia; quitar la verificación no arregla nada · `fix, mitm, with-whom, two-files, installed, rerun, depths, ok, root, anchor-full, wrap` · **intercept** |
| s04-revocar «¿Sigue valiendo?» | II ¿Sigue valiendo? | 38 | La segunda pregunta de la naviera: «¿y si un día revocáis este certificado, cómo nos enteramos?». Rótulo con los dos motivos de la lección y nada más (`:365`): «un certificado puede dejar de valer antes de su fecha: se filtra la clave privada · el dominio cambia de dueño». Mensaje interceptado. Respuesta: junto al `NotAfter: May 27 … 2027` de s02, «faltan más de seis meses»; mientras tanto, quien tenga la clave puede presentarse como el portal, y los clientes le creerían. Sello REVOKE: «se revoca ya · y se pide otro con una clave nueva» (`revoke`). Después, el propio certificado dice dónde preguntar (`openssl x509 -noout -text`, dos líneas): `CRL Distribution Points: URI:http://crl.confianza.example/issuing3.crl` y `Authority Information Access: OCSP - URI:http://ocsp.confianza.example`, las de la lección (`sp/sp1-part4.ts:325-326`). La imagen: la recepción de un hotel con la lista de documentos robados, que llega una vez al día; un DNI robado esta mañana no sale hasta mañana. Nombre CRL: «lista firmada por la CA · el cliente la descarga cada cierto tiempo» | Una clave comprometida se revoca ya y se sustituye; la CRL es una lista periódica que puede ir horas por detrás · `question, reasons, wait, months, pretend, revoke, where, crl-url, hotel, list, crl` · **intercept** |
| s05-ocsp «Un justificante recién sellado» | II | 42 | El mismo hotel: recepción llama a la policía con cada huésped; respuesta al momento, pero tres chips: «cola (latencia) · policía saturada (carga en la CA) · sabe dónde duerme cada cual (privacidad)». Nombre OCSP. Después, el huésped trae, con el DNI, «un justificante de la policía · sellado · de esta mañana»; recepción solo comprueba el sello. Nombre OCSP STAPLING. La demo: «10-11», `openssl s_client -connect reservas.haldenport.example:443 -status` da `OCSP response: no response sent`. La mejora: «OCSP stapling en el portal · Infraestructura · 12-11». «12-11», el mismo comando: `OCSP Response Status: successful (0x0)` · `Cert Status: good` · `This Update: Nov 12 08:00:00 2026 GMT` · `Next Update: Nov 19 08:00:00 2026 GMT` (`stapled`). Dónde mirar: «good» y las dos fechas; la respuesta la firma la CA y la trae el portal | OCSP pregunta en el momento, con su coste; con stapling, el servidor trae la respuesta firmada y reciente, y el cliente no pregunta a nadie · `call, costs, ocsp, note, stapling, before, improvement, after, good, wrap` |
| s06-recap «Tres reglas» | III Para el examen | 22 | Tres tarjetas de reglas, cada una con su icono (la cadena del ancla · el sello de «revocado» · el justificante). Tarjeta final Alertópolis: «Tu turno: termina la lección y sus preguntas» (44) | Reflejos · `recap, rule-1, rule-2, rule-3, next, endcard` |

- **Exam cards** (objetivo 1.4), una por escena de s02 a s05, cada una con su cue antes de la última frase de la escena
  (`examTiming: sentence-end`):
  - «Issuer unknown: falta la intermedia o es self-signed» (s02) (52). Llega después de la respuesta a la pregunta; la voz
    nombra antes, en media frase, el otro caso de la nota de examen (`:336`): el certificado autofirmado.
  - «Root CA: self-signed y ya en el trust store del cliente» (s03) (55). «Ya en», no «de serie»: la lección dice que la
    confianza en una raíz se establece repartiéndola a los almacenes (`:357`, q3 `:486`), y una raíz interna repartida por
    el puerto (V17, si algún día sale) también cabe.
  - «CRL: lista periódica; puede ir horas por detrás» (s04) (47)
  - «OCSP: estado al momento; stapling: lo trae el servidor» (s05) (54)
- **Think prompt:** «Emisor desconocido: ¿falta raíz o intermedia?» (s02) (45), `holdMs` 4500. Llega con la salida ya
  leída y la cadena del ancla dibujada sin rótulos, para que el dibujo no la conteste. Respuesta: la intermedia. La raíz ya
  está en el equipo de la naviera; lo que no llega es el eslabón del medio, y sin él no se puede subir del certificado del
  portal a la raíz. Los rótulos («ya está en tu equipo», «no ha llegado») salen con la respuesta.
- **Mensajes interceptados** (NULL CIPHER, uno por capítulo en I y II; ninguno en el cierre; `holdMs` ~3800):
  - s03: «Desactivar la verificación del certificado. Sigue cifrado. Lógico.» (66). El error que corrige la narradora:
    tomar el aviso por un estorbo. Sigue cifrado, sí, pero sin comprobar el certificado ya no sabes con quién: cualquiera
    que se ponga en medio enseña el suyo y tú cifras para él. Para eso está el certificado, que une una identidad a una
    clave pública (`sp/sp1-part4.ts:291`). Lo que se arregla es la cadena, no el aviso.
  - s04: «¿Clave filtrada? Esperar a que caduque el certificado. Lógico.» (62). El error: tratar la fecha de caducidad
    como si fuera la revocación. Quedan meses, y mientras tanto quien tenga la clave se hace pasar por el portal; acortar
    la validez no arregla una clave comprometida hoy (la explicación del check, `:379`). Se revoca ya y se pide otro
    certificado con una clave nueva; lo que importa después es cuánto tardan los clientes en enterarse. La voz no pone
    ningún ejemplo de cómo podría filtrarse la clave.
- **Cierre:** tres reglas y una sola tarea.
  1. «Emisor desconocido»: falta la intermedia, o el certificado es autofirmado. El servidor manda la intermedia; la raíz
     ya la tienes.
  2. Clave comprometida: se revoca ya y se cambia. Esperar a que caduque no es una opción.
  3. La CRL llega tarde; OCSP pregunta en el momento; con stapling, la respuesta la trae el servidor.

  Tarea: terminar la lección y sus preguntas. El vídeo va a mitad de sp1m7, antes de key escrow y de las raíces en hardware
  (`:382-441`), y seis de las ocho preguntas (CSR, wildcard, self-signed para un laboratorio, key escrow, TPM y KMS) tratan
  de lo que viene después; las que tocan el vídeo son la q3 y la q4.
- **Se queda fuera** (sigue en la lección):
  - CA y RA, el CSR y que la clave privada nunca viaja en él: `sp/sp1-part4.ts:295`; quiz q1 (`:449-462`).
  - Wildcard y SAN: `:358-359`; quiz q2 (`:464-477`). El certificado del portal es de un solo nombre.
  - Third-party frente a self-signed para un laboratorio: `:356-357`; quiz q5 (`:509-522`). «Autofirmado» sale solo en la
    tarjeta de s02 y la regla 1, como la otra causa del aviso, y en la raíz de s03.
  - Los campos del certificado: `:360`. En pantalla salen `s:`, `i:` y las fechas, sin explicar el resto.
  - Key escrow y key management: `:382-385`; quiz q6 (`:524-537`).
  - Las raíces de confianza en hardware (TPM, HSM, KMS, secure enclave) y la parte «Protect the CA's private keys → HSM» de
    la nota de examen: `:336`, `:386-441`; quiz q7 (`:539-552`) y q8 (`:554-567`); check `:427-441`. «La raíz se guarda
    offline» (q3) tampoco sale: el vídeo no enseña la CA por dentro.
- **Laboratorios:** ninguno de sp1 toca la PKI (`sp/labs.ts:16-55`: spl1a clasifica controles, spl1b ordena un cambio y
  spl1c elige familias criptográficas), así que no hay solución que destripar. Una precaución: la historia tiene tres
  cambios en el portal (el certificado nuevo, la intermedia y el stapling), y el vídeo no enumera los pasos de un cambio
  ni nombra el CAB, la ventana de mantenimiento o la verificación posterior, para no rozar spl1b (`:211-256`) ni CHG-2041
  (`sp/sp1-part3.ts:81`): el despiste no se cuenta como un cambio mal hecho.

**Canon nuevo que fija V12** (nada de esto estaba en los datos del curso; lo posterior debe respetarlo):
- **2026-11-09 (lunes), por la tarde:** Infraestructura (el área de los certificados del puerto: L. Ferrer es el dueño de
  CHG-2041, `sp/sp1-part3.ts:71`; nadie con nombre en pantalla) instala en el portal de reservas
  (`reservas.haldenport.example`, `hpa-portal-web-01`) el certificado nuevo, porque el de V11 caducaba el miércoles 11-11.
  Clave nueva ECC P-256, emisor `Confianza Global TLS Issuing CA 3`, `NotBefore` 9-11-2026 a las 00:00:00 y `NotAfter`
  27-05-2027 a las 23:59:59 GMT: **200 días justos** (de `notBefore` a `notAfter`, los dos incluidos, como cuentan los
  Baseline Requirements), el máximo de un certificado público de TLS emitido desde el 15-3-2026 (CA/Browser Forum); no se
  dice en voz. Se instala solo el certificado, sin el fichero de la cadena. No es culpa de nadie.
- **Desde el lunes 9-11 por la tarde** el programa de la naviera no conecta.
- **2026-11-10 (martes):**
  - **08:15:** la naviera (la de V11, sin nombre) avisa: «desde ayer por la tarde… unable to get local issuer
    certificate».
  - **08:40:** la analista (en segunda persona, sin nombre) lo comprueba con `openssl s_client -showcerts`: un solo
    certificado en la cadena.
  - **09:10:** Infraestructura instala la intermedia; la cadena llega hasta `Confianza Global Root` y la verificación da 0
    (ok).
  - Esa misma mañana, la naviera pregunta cómo se enteraría de una revocación. El certificado lleva las dos URL de la
    lección (`crl.confianza.example/issuing3.crl` y `ocsp.confianza.example`). Ese día, el portal no grapa la respuesta
    OCSP («no response sent»).
- **Mejora con responsable y fecha: «OCSP stapling en el portal · Infraestructura · 12-11».** El jueves 12-11, `-status`
  enseña una respuesta grapada, `Cert Status: good`, válida del 12 al 19-11 (8:00 GMT). **Desde el 12-11, el portal sale a
  Internet hasta `ocsp.confianza.example`** para traer esa respuesta: el plan de red de V16 no debe cortarlo.
- **No se revoca nada ni se filtra ninguna clave.** Toda la revocación va en condicional y sin decir cómo se filtraría.
- **La cadena pública y la interna.** Los nombres públicos bajo `haldenport.example` cuelgan de la CA pública ficticia de la
  lección. La CA interna del puerto, la de `*.halden-port.local` (CHG-2041), queda sin definir: no es Confianza Global
  (una CA pública no firma nombres internos), y su raíz la reparte el puerto a sus equipos.
- **NULL CIPHER**, con el registro que fijó V11 (manual de procedimiento en infinitivo, «Lógico.»), solo da consejos y no
  tiene nada que ver con el despiste de la cadena.
- **Comprobado contra la cronología:** 9-11 lunes, 10-11 martes, 11-11 miércoles, 12-11 jueves, 19-11 jueves y 27-05-2027
  jueves (Node). Las horas de la consola (`GMT`) son las que imprime OpenSSL; en noviembre Halden va una hora por delante
  (CET). Todo cabe en la ventana de V11–V12 (2–13-11) salvo la `Next Update` del 19-11, que es una fecha de validez y no un
  hecho. El 12-11 no choca con nada del registro.

**No se toca:**
- **El dosier de NULL CIPHER** (`sp/sections.ts:49`): ningún certificado autofirmado instalado como raíz, ninguna raíz
  «temporal», nadie añade ni quita nada del almacén de confianza de nadie, la palabra «inventario» no sale y nadie firma
  «GH». La raíz que sale es la de la CA pública ficticia de la lección, y vale porque ya está en el almacén del cliente.
  Por eso NULL CIPHER no propone «añadir la raíz» ni «aceptar el aviso». Y nada de «nadie sabía que caducaba»: la
  renovación llega antes de la caducidad, y lo que falta es el fichero de la cadena.
- **La pista del ASN** (`sp/sections.ts:106`): NULL CIPHER no tiene IP, dominio ni equipo; nada relaciona a NULL CIPHER
  con la avería de la cadena ni con otro adversario. El que se pone en medio en s03 es un dibujo genérico, sin nombre. Para
  NULL CIPHER, ni puertas ni llaves (la imagen del spraying de V10).
- **Cómo se filtraría una clave.** Es el portal del traversal del 21-10 (V10), que sacó `/etc/passwd` de ese equipo. La voz
  no pone ningún ejemplo («si alguien lee el fichero», «si entran en el servidor»): quien vio V10 lo juntaría con esa noche
  y entendería que la clave del portal pudo salir. Ningún vídeo dice qué pudo o no pudo leer el traversal.
- **CHG-2041** (`*.halden-port.local`, rotado el 6-9, `sp/sp1-part3.ts:70-83`): es el wildcard interno, con otro dominio;
  el certificado de V12 es el público del portal y su renovación no es ese cambio. Tampoco se dice que el puerto tenga o
  no un registro de sus certificados.
- La fila «Certificado próximo a caducar» del SIEM (4-9, `portal.puerto-halden.example`,
  `video/siem/src/data/s08-triage.ts:15`) sigue de fondo, sin relación con este certificado.
- El caso `IR-2026-0147`, la noche de V10 (el traversal y el DDoS del portal) y el FINDING #0147 (`sp/sp4-part3.ts:55`).
- El sitio del portal en la red: el plan de V16, aprobado el 20-11, lo llevará a la DMZ por fases desde el 1-12. V12 no
  lo enseña.
- Los navegadores: el vídeo no dice que avisen ni que no avisen. El fallo sale en el programa de la naviera.
- La imagen del pase firmado de V6 (SAML) y su recepción: V12 usa un hotel, no la recepción de un socio.
- Ninguna IP en pantalla.
- No se culpa a nadie: ni a Infraestructura por el fichero que faltó ni a la naviera por su pregunta.

**Comprobación de límites** (recontada con Node tras la revisión, `.length` de JavaScript):
- 6 escenas en 3 capítulos (máximo 3). Suma de `s`: 210 s; estimado ~260 s y renderizado ~235–245 s, dentro de 190–260.
- 2 conceptos (2–3).
- 4 tarjetas de examen (3–5), una por escena de s02 a s05, ninguna en la última; ≤ 58 caracteres (52, 55, 47 y 54), sin
  `{}[]|<>`, flechas, marcas, viñetas ni emoji.
- 1 pregunta para pensar (exactamente 1), 45 caracteres (≤ 48), `holdMs` 4500.
- 2 mensajes interceptados (1–2), uno por capítulo (I y II), ninguno en la escena final; 66 y 62 caracteres (≤ 70);
  `holdMs` ~3800 (2500–4500); `video.json` lleva `"adversary": "NULL CIPHER"`.
- `wordBudget` por escena (`s` × 2,7): s01 65 · s02 113 · s03 113 · s04 103 · s05 113 · s06 59 (total 566).
- Sin identificadores en la voz: el dominio del portal, los comandos, las URL de la CRL y de OCSP, los nombres de la CA y
  los códigos de error van en pantalla; la voz dice «el portal», «la intermedia», «la raíz», «no encuentro al emisor».

---

### V13 · s2m1 · Principal · «La Cyber Kill Chain: basta con romper un eslabón»

> Propuesta del 2026-10-04; aprobada el 2026-10-05 con las opciones recomendadas (Lidia delegó las decisiones). Tanda 3; se graba en la misma sesión que V12 (sp1m7,
> cápsula). La versión vigente de escenas y guion será `video/kill-chain-eslabon/storyboard.json` + `narration.json`;
> qué se quedó fuera, en `video/kill-chain-eslabon/out/script-notes.md`.
>
> **Producido y subido**: por la API el 2026-10-06 (YouTube `WidodMPEs24`, privado hasta que Lidia lo publique); 8:04,
> 10 escenas, 7 tarjetas, 2 preguntas, 3 mensajes de GLASS VIPER (voz `sapi/Microsoft Pablo` con `machine`), voz de
> Lidia, música de V4 y V5. En la lección s2m1, donde dice «Inserción», sin línea de entrada (como V9).
>
> **La penalización del ranking manda en el diseño** (L=1, plan §3, fila 15): el lab2a ya practica qué fase es cada
> evento, así que el vídeo no recita el orden. Da el porqué (por qué van en fila, por qué basta con romper una, por qué
> una fase se deduce, por qué conviene llegar antes) y una sola demo, la reconstrucción de la propia lección. Las
> decisiones, con la alternativa descartada, están en `docs/reviews/2026-10-05-fichas-tanda3/decisiones.md` (apartado V13).
>
> **Revisada el 2026-10-05 (exactitud y canon, `revision-gcti.md`):** sin prometer de más en s02 (romper un eslabón
> que tienes a tu alcance frustra ese intento, no al atacante, que puede volver a empezar); en s07, saltar antes solo
> donde ves antes, y solo para quien actúa sobre la alarma (s2m1q5); «las tres siguientes»; «registros de lo que tienes
> cara a internet» en vez de «registros públicos»; en s04, «leer, comprimir y sacar», nunca «buscar» carpetas; y la
> imagen común del PDB, «la etiqueta del taller», ya asoma en s05 para que V14 y V15 la hereden.

- **Carpeta:** `kill-chain-eslabon` · perfil `principal-yt` (380–600 s renderizados; objetivo ~8 min, sin rellenar) ·
  objetivo GCTI **Intrusion Analysis** (dominio del curso de S2, `src/data/course-gcti.ts:32`, y de las diez preguntas
  de s2m1, `src/data/s2.ts:123-243`); las tarjetas llevan `"objective": "Intrusion Analysis"` e insignia «GCTI» ·
  adversario **GLASS VIPER** (`src/data/course-gcti.ts:36`), tres mensajes interceptados · voz `recording/lidia` con
  `"recording": { "tempo": 1.08, "maxPauseMs": 250 }` · voz del adversario: **ya existe**, la de V3 y V7
  (`"adversaryVoice": { "voice": "sapi/Microsoft Pablo", "rate": 0, "fx": "machine" }`,
  `video/diamond-e7/narration.json:6`, `video/attack-piramide/narration.json:11-15`) · música de V4 a V9
  (`Go On Going - Stayloose.mp3`, la única de `video/engine/music/LICENSES.md`).
- **`video.json`:** `"profile": "principal-yt"`, `"track": "gcti"`, `"adversary": "GLASS VIPER"`, `"lesson": "s2m1"`,
  la música de arriba y `"tags"`: «Cyber Kill Chain», «kill chain», «Lockheed Martin», «análisis de intrusiones»,
  «intrusion analysis», «weaponization», «spearphishing», «threat intelligence», «inteligencia de amenazas», «GCTI».
  Título de YouTube: «La Cyber Kill Chain: basta con romper un eslabón | GIAC GCTI en español».
- **Ritmo:** `"examTiming": "sentence-end"`; preguntas con `think.holdMs` 4500; mensajes con `intercept.holdMs` 3500.
- **Efectos (`sfx`):** los automáticos del motor (mensaje, tarjetas, capítulos) y cinco momentos: `alert` («alarm», la
  ficha del 5 de marzo, como en V3), `break` («block», el eslabón que se rompe), `beacon` («ping2», el mismo sonido que
  V3 dio al beacon), `late` («error», las alarmas que llegan tarde) y `first-cut` («lock», el primer corte posible en
  el equipo).
- **Duración:** suma de `s` **454 s** (10 escenas); `wordBudget` a 2,7 palabras/s: 97, 151, 130, 151, 140, 103, 135,
  124, 113 y 81 (1.225 palabras). Estimado de `build-timeline --estimate` ~9:05 (V9: 458 s de escenas, 9:14 estimado);
  real con la voz de Lidia ~8:15–8:25 (V9 quedó al 91 %, en 8:25). Las dos cifras caben en 380–600. La suma predice mal
  (V5 salió a 0,89 veces la suma y V4 a 1,22), así que el primer borrador se mide por los dos lados: si el estimado pasa
  de ~580 s, se funde s06 en s05 (−20 s) y luego se recorta s09; si baja de ~420 s, se alarga s04, la demo.
- **Inserción:** en `src/data/s2.ts`, lección s2m1, entre el segundo check de la demo («In the EDR chain, the schtasks
  line and the winhlp.exe→443 line…», bloque `:101-115`) y el párrafo de cierre «Cada intrusión analizada produce una
  kill chain documentada…» (`:116-119`), como bloque `youtube`:
  `{ t: 'video', title: 'La Cyber Kill Chain: basta con romper un eslabón', youtube: '<id>', poster: 'videos/kill-chain-eslabon-poster.png', transcript: 'videos/kill-chain-eslabon-transcript.txt' }`.
  Como V9 en s4m3: el orden queda lección, checks, vídeo y laboratorio, porque el vídeo resume la lección entera (las
  fases, la reconstrucción, la frontera entre lo visto y lo deducido, llegar antes y los límites) y acaba mandando al
  Lab 2A. Todo lo que enseña ya lo ha presentado la lección antes de ese punto (tabla `:21-32`, callouts `:37` y `:47`,
  usos `:41`, reconstrucción `:68-85`, frontera `:89`). El párrafo de cierre, que manda a s2m4 y a la matriz de Courses
  of Action, sigue funcionando después. Se fija en la suite `lesson videos` de `src/data/content.test.ts` (`:248-284`),
  junto a los demás.
- **Lo que se lee no se deletrea:** equipo, dominios, IP, ruta, nombre de la tarea y del adjunto van en pantalla; la voz
  dice qué son («una estación de ingeniería de propulsión», «un dominio que imita al de Meridian», «el servidor que lo
  envió de verdad», «un acceso directo disfrazado de PDF»). Ninguna excepción. La voz no nombra VELVET CICADA: dice «el
  atacante» o GLASS VIPER, que presenta en el primer mensaje como el nombre con el que sigues a quien opera dentro y a
  su programa (lo mismo que V3, `video/diamond-e7/narration.json:139`).
- **Enfoque («¿qué le queda por hacer?»):** el vídeo abre con la alerta que ya enseñaron V3 y V7: el 5 de marzo de
  madrugada, una estación de ingeniería de propulsión de Meridian llama a un dominio que nadie conoce
  (`video/diamond-e7/src/scenes/S01Hook.tsx:196-197,277,286`; `video/attack-piramide/narration.json:35`). Antes de
  decidir nada, necesitas saber por dónde va el atacante, porque eso dice qué le falta (es el encargo de la misión 2,
  `src/data/labs.ts:72-73`, y el del jefe de la sección, «reconstruye sus kill chains más rápido de lo que avanzan»,
  `src/data/course-gcti.ts:37-38`). Así que vuelves al principio, al lunes 2 de marzo, con la reconstrucción de la
  lección. La alerta sale **sin el código E7 ni el informe MER-2026-019**, que presenta s2m3: solo fecha, hora, equipo y
  «dominio desconocido», que ya están en pantalla en V3 y V7. GLASS VIPER provoca tres veces con frases que suenan a
  verdad, y la narradora le da la razón en el dato y se la quita en la conclusión, como en V7 y V8. Al final, de vuelta
  al 5 de marzo, la cadena llega hasta C2 y la séptima fase no aparece en lo que tienes (`src/data/s2.ts:113`); el vídeo
  no dice si se llegó a tiempo (V3 enseña E9 dos días después). No hace falta frase de puente: en el orden del curso es
  el primer vídeo de S2. Una frase sitúa a quien no ha visto nada: eres la analista de inteligencia de Meridian, una
  aeroespacial.

**Conceptos (5) y su imagen:**

Una sola imagen para todo el vídeo, con un detalle distinto en cada concepto (como la cocina del yogur en V9): **la
casa y la caja trampa**. Recon: mira la casa desde la acera. Weaponization: en su taller mete un aparato en una caja con
pinta de otra cosa. Delivery: la caja llega a tu puerta. Exploitation: alguien de casa la abre y el aparato se enciende.
Installation: el aparato esconde una copia de la llave en la maceta (la misma imagen de persistencia que V7,
`video/attack-piramide/narration.json:47`). C2: el aparato le avisa cada minuto, «sigo aquí» (V7 lo llamó «llama a
casa», `:95`). Actions on Objectives: entra y se lleva los planos. Y dentro del aparato, a veces, **la etiqueta del
taller** donde lo montó: es la imagen común de la ruta PDB, que heredan V14 (el enlace fuerte) y V15 (cosida en el cuello
de una prenda). Se dibuja con un solo componente, igual en los tres vídeos, con la ruta en monoespaciada; V13 la enseña
sin ningún valor de ruta.

| # | Concepto | Imagen que se mantiene | Tarjetas |
|---|---|---|---|
| 1 | La Kill Chain (Lockheed Martin) cuenta una intrusión como siete fases que el atacante tiene que completar **en orden**: cada una necesita la anterior. De ahí la asimetría: él necesita la cadena entera; al defensor le basta romper un eslabón de los que tiene a su alcance (Weaponization y casi siempre Reconnaissance quedan fuera). Eso frustra **ese intento**, no al atacante: puede volver a empezar, pero desde el principio y habiendo enseñado cómo trabaja (`src/data/s2.ts:18`; s2m1q4, `:162-167`) | Los siete pasos del ladrón. Si nadie abre la caja, no hay llave escondida, ni aviso, ni planos: puede mandar otra, pero **esta** se ha quedado en la puerta | «Kill Chain: al defensor le basta romper un eslabón» |
| 2 | Cada línea de la reconstrucción es prueba de una fase, y lo que decide la fase es qué pasa y dónde: llevar el artefacto hasta la víctima es Delivery (las cabeceras; el remitente que imita a Meridian es oficio de la entrega, no Reconnaissance, s2m1q10); ejecutar código al abrirlo, Exploitation; quedarse, Installation (la tarea programada, s2m1q3); el latido periódico es C2, el canal que permite la misión, no la misión (s2m1q9) | Cada línea enciende su viñeta: la caja en la puerta, la caja abierta, la llave en la maceta, el «sigo aquí» | «Remitente verosímil: Delivery, no Reconnaissance» · «Beacon periódico: C2, no Actions on Objectives» |
| 3 | Lo visto y lo deducido. Weaponization ocurre en el espacio del atacante: no se observa, se infiere del artefacto entregado (un acceso directo disfrazado de PDF dentro de un ZIP; también metadatos, la herramienta con que se montó, rutas de compilación). Reconnaissance casi nunca se ve, salvo en los registros de lo que tienes cara a internet, como tu web (`src/data/s2.ts:37,89`; s2m1q2 y q8) | El taller del ladrón, detrás de una puerta cerrada: no lo ves nunca, pero la caja que dejó cuenta cómo la preparó, y a veces trae por dentro hasta la etiqueta del taller | «Weaponization no se observa: se infiere del artefacto» |
| 4 | Llegar antes. Dónde saltan tus detecciones mide lo tarde que llegas: si todo salta en Actions on Objectives, el atacante ya hizo lo demás sin que lo vieras. Para saltar antes hay que ver antes (registros del correo, del equipo: «earlier-phase visibility is needed», s2m1q5), y detectar no es parar: cada control que **corta** a la izquierda del C2 te ahorra todas las fases siguientes. Y sirve para hablar: «lo paramos en Delivery» (`src/data/s2.ts:41,89,176`). En el propio equipo, lo primero que se puede cortar es Exploitation, porque la entrega pasa en la pasarela de correo, que es un control de red (s2m1q7) | Enterarte cuando ya faltan los planos, frente a que la caja no pase de la puerta. Desde dentro de casa, lo primero es que al abrirla no se encienda nada | «Detectar solo en la última fase es llegar tarde» · «En el equipo, lo primero que cortas: Exploitation» |
| 5 | Los límites. El modelo encaja bien con intrusiones con malware y fases en fila, y peor con un insider, credenciales válidas o ataques a servicios en la nube (SaaS); por eso se completa con ATT&CK y el Diamond Model (`src/data/s2.ts:47`; s2m1q6) | Quien vive en la casa, o tiene una llave de verdad, no necesita caja: la cadena se queda con huecos | «Insider con acceso legítimo: la Kill Chain encaja mal» |

**Escenas:** diez, en cinco capítulos (Siete pasos · Leer las pruebas · Lo que no ves · Llegar antes · Límites y
examen). Como en V6, el resumen final vive dentro del último capítulo.

| Escena | Cap. | s | Qué se ve | Qué se aprende · marcas (`requiredCues`) |
|---|---|---|---|---|
| s01-alerta «Una llamada que nadie esperaba» | I Siete pasos | 36 | El SOC de Meridian, de noche. Una ficha de alerta grande con los datos que ya enseñaron V3 y V7: «05-03-2026 · 02:13 UTC», «ENG-WS-041 · ingeniería de propulsión», «llama a `update-svc-cdn.com`» y, en rosa, «dominio desconocido» (sin «E7» ni número de informe). Debajo, «¿qué le queda por hacer?». La ficha se atenúa y entra el título «La Cyber Kill Chain» con «basta con romper un eslabón» debajo, antes de los 10 s. La promesa en tres chips: «leer cada fase en las pruebas · separar lo que ves de lo que deduces · decidir dónde cortar». Tira de contexto: «Meridian Dynamics · aeroespacial · tú, su analista de inteligencia». Al final, un calendario que retrocede hasta «lunes 02-03» | La promesa en los primeros 10 s: saber en qué fase va una intrusión dice qué le falta al atacante y dónde se puede cortar · `alert, title, promise, back` |
| s02-cadena «Siete pasos, en orden» | I | 56 | La imagen: una casa en una calle y el plan del ladrón en siete viñetas que se dibujan una a una (acera, taller, caja en la puerta, caja abierta, llave en la maceta, «sigo aquí», los planos). Bajo cada viñeta, su nombre en pantalla: Reconnaissance, Weaponization, Delivery, Exploitation, Installation, Command & Control y Actions on Objectives, con «Cyber Kill Chain · Lockheed Martin» en pequeño (la voz no lee la lista: cuenta la historia y dice que los nombres están en pantalla). Las viñetas se enganchan como eslabones: cada una cuelga de la anterior. Mensaje interceptado. Respuesta: la viñeta de la caja abierta se rompe («nadie la abre») y las tres siguientes pasan a gris, con «esta se queda en la puerta»; dos marcadores: «él: necesita las siete, en orden» · «tú: te basta con romper una a tu alcance». Al lado, pequeña, una caja nueva que vuelve a la acera: «si lo intenta otra vez, empieza de cero». La tarjeta, con la cadena ya quieta | Las fases van en orden y cada una necesita la anterior; el atacante las necesita todas y al defensor le basta romper un eslabón a su alcance, que frustra ese intento · `house, seven, names, chain, break, grey, asymmetry` · **mensaje** |
| s03-correo «La caja en la puerta» | II Leer las pruebas | 48 | Las cabeceras de la lección tal cual (`src/data/s2.ts:68-74`), rotuladas «pasarela de correo · 2026-03-02 09:41 UTC». Dónde mirar, por pasos, con lo demás atenuado: `From` con `meridian-careers.com` y la etiqueta «parece de casa»; `Return-Path` y `Received` con `mx1.cdn-sync-status.example`, «quien lo envió de verdad» (la IP de `Received` se queda como en la lección, sin resaltar); el asunto, «Candidatura - Ingeniero de propulsion (CV adjunto)»; la línea del adjunto, atenuada para s05. Sin línea `To:` y sin «RR. HH.» en pantalla. A la derecha se enciende la viñeta de la caja en la puerta y entra el nombre DELIVERY: «llevar el artefacto hasta la víctima». Junto al `From`, una ficha «¿Reconnaissance?» que se tacha: «investigar a Meridian fue antes · usarlo para que el correo entre y se abra es entrega». La tarjeta, con las cabeceras ya atenuadas | Las cabeceras son prueba de Delivery y enseñan la infraestructura real del envío; el remitente que imita a Meridian es oficio de la entrega (s2m1q10, `src/data/s2.ts:243-256`; check `:92-100`) · `headers, from, real-sender, subject, delivery, not-recon` |
| s04-equipo «Dentro del equipo» | II | 56 | La cadena del EDR de la lección (`src/data/s2.ts:76-83`), «host ENG-WS-041 · mismo día», línea a línea; la que explica la voz se amplía, el resto se atenúa, y a la derecha se enciende su viñeta. `09:44:12 explorer.exe` abre `CV_Ingeniero.pdf.lnk` y `09:44:13 powershell.exe -nop -w hidden -enc …`: EXPLOITATION, «se ejecuta código al abrirlo» (la caja abierta). `09:44:19 escribe C:\ProgramData\winhlp.exe` y `09:44:20 schtasks /create /tn WindowsUpdateCheck … /sc onlogon`: INSTALLATION, «quedarse» (la llave en la maceta). `09:45:02 winhlp.exe`, con un conector dibujado (no el carácter de flecha, como V7, `video/attack-piramide/src/scenes/parts/ProcessTree.tsx:40`), hasta `TLS update-svc-cdn.com:443 (beacon 60s)`: COMMAND & CONTROL, «llamar a casa» (el «sigo aquí»). Pregunta para pensar, con la línea del beacon sola. Respuesta en dos columnas: «C2: el canal que permite la misión» y «Actions on Objectives: leer las carpetas de diseño, comprimirlas, sacarlas» (los ejemplos de s2m1q9, `src/data/s2.ts:229-241`; la voz se queda en «leer, comprimir y sacar» y nunca dice «buscar» ni «recorrer» las carpetas, que es el ítem más difícil del Lab 2A, `src/data/labs.ts:263-265`); la línea del beacon cae en la primera. La tarjeta. Cierre del capítulo: las cuatro fases vistas, en fila, cada una con su hora | Abrir el adjunto es Exploitation; la tarea programada, Installation; el latido periódico es C2 y no la misión (check `:101-115`) · `edr, open, exploitation, drop, task, installation, beacon, c2, mission, wrap-ii` · **pregunta** |
| s05-taller «El taller que no ves» | III Lo que no ves | 52 | Mensaje interceptado. La imagen: el taller del ladrón tras una puerta cerrada, fuera de cuadro; delante, la caja que dejó en tu puerta, que se abre por capas. En paralelo se amplía la línea del adjunto: `CV_Ingeniero.zip (contiene: CV_Ingeniero.pdf.lnk)`, rotulada «un acceso directo que se hace pasar por un PDF, dentro de un ZIP», con la nota de la lección «inferida: el LNK dentro del ZIP se construyó en el entorno del actor» (`src/data/s2.ts:85`). De la caja salen tres pistas, en una lista en pantalla (las del callout, `:37`): «cómo está hecho el adjunto · con qué herramienta se montó · rutas de compilación (PDB)»; la tercera lleva el dibujo de **la etiqueta del taller** (el componente común con V14 y V15), en blanco, sin ningún valor de ruta. En voz, media frase: «y a veces, por dentro, hasta la etiqueta del taller donde la montó». Nombre WEAPONIZATION, con una lupa: «no se observa · se deduce» | Weaponization ocurre en el espacio del atacante: no la ves, la deduces del artefacto que te entrega (s2m1q2 y q8, `src/data/s2.ts:132-144,215-227`) · `reply, door, box, lnk, inferred, clues, weaponization` · **mensaje** |
| s06-frontera «Visto, deducido y sin ver» | III | 38 | La fila de las siete fases como mapa de lo que sabes. En cian, con un reloj y su línea de registro: Delivery, Exploitation, Installation y Command & Control, «observadas: hay un registro con hora». Weaponization, discontinua y con la lupa: «inferida». Reconnaissance, en gris, con la viñeta de la acera borrosa: «casi nunca la ves, salvo en los registros de lo que tienes cara a internet, como tu web» (sin nombrar la VPN, que es un ítem del Lab 2A, `src/data/labs.ts:223`). Actions on Objectives, vacía: «sin pruebas todavía». La tarjeta. Cierre del capítulo | La frontera entre lo observado, lo inferido y lo que no ves (`src/data/s2.ts:89`) · `map, observed, dashed, absent, empty, wrap-iii` |
| s07-izquierda «Enterarte tarde» | IV Llegar antes | 50 | Mensaje interceptado. La fila de fases con alarmas. Primero, todas en Actions on Objectives; la viñeta, una caja fuerte vacía: «te enteras cuando ya faltan los planos»; las seis fases anteriores se tiñen de rosa, «ya hechas, sin que lo vieras». Antes de mover nada, un chip: «para saltar antes, hay que ver antes», con «registros del correo · del equipo» debajo, en pequeño. Después, las alarmas se reparten hacia la izquierda, cada una sobre una fuente que mira esa fase; la que salta antes del C2 solo apaga las de su derecha cuando alguien actúa sobre ella (un candado o una mano encima): «cada paso que paras de verdad te ahorra los siguientes». Una alarma que suena sola no apaga nada. Un bocadillo, «lo paramos en Delivery», con «cuatro palabras que lo dicen todo». La tarjeta | Dónde saltan tus detecciones mide lo tarde que llegas; para saltar antes hay que ver antes, y cada paso que se corta antes le quita todos los siguientes (s2m1q5, `src/data/s2.ts:170-183`) · `alarms-right, late, done, see-first, shift, act, saved, language` · **mensaje** |
| s08-cortar «Lo primero que cortas» | IV | 46 | Dos zonas: la pasarela de correo, «en la red · antes del equipo», y la estación de ingeniería. Pregunta para pensar, con Delivery y Exploitation resaltadas. Respuesta (s2m1q7, `src/data/s2.ts:200-213`): la entrega pasa en la pasarela, que es un control de red; en el propio equipo, lo primero es que el acceso directo no pueda lanzar PowerShell. A su derecha, «borrar el programa» y «cortar el beacon», en gris: «también sirven, pero ya ha avanzado más». La tarjeta. Vuelve la ficha del 5 de marzo sobre la fila de fases: el marcador en Command & Control y Actions on Objectives vacía, «en lo que tienes, la séptima no aparece» (`:113`). Cierre del capítulo | En el equipo, el primer eslabón que se puede romper es Exploitation; saber la fase dice qué le falta al atacante · `gateway, host, first-cut, later, today, wrap-iv` · **pregunta** |
| s09-limites «Cuando no hay caja» | V Límites y examen | 42 | Vuelve la casa: alguien que vive en ella, o que tiene una llave de verdad, coge los planos; las viñetas del taller, la caja y la puerta se quedan vacías y la cadena, con huecos. Tres chips (`src/data/s2.ts:47`): «insider con acceso legítimo · credenciales válidas · servicios en la nube (SaaS)». Rótulo: «encaja bien: intrusiones con malware y fases en fila». Dos fichas que la completan: ATT&CK, «el cómo, técnica a técnica», y Diamond Model, «cada paso, en cuatro esquinas». La tarjeta | Los límites del modelo y por qué se completa con ATT&CK y el Diamond Model (s2m1q6, `src/data/s2.ts:185-198`) · `insider, gaps, limits, fits, complements` |
| s10-reglas «Tres reglas» | V | 30 | Tres tarjetas de reglas, una cada vez, cada una con su viñeta en miniatura (la cadena rota, la caja que se abre por capas, la alarma a la izquierda); tarjeta final Alertópolis: «Tu turno: Lab 2A · Kill Chain Mapping» | Reflejos · `recap, rule-1, rule-2, rule-3, lab2a, endcard` |

- **Tarjetas de examen** (dominio Intrusion Analysis), una por escena en s02, s03, s04, s06, s07, s08 y s09 (ninguna
  en s01, en s05 ni en el cierre). Cada una espera al final de su frase y lleva ~5 s de escena detrás:
  - «Kill Chain: al defensor le basta romper un eslabón» (s02, 50)
  - «Remitente verosímil: Delivery, no Reconnaissance» (s03, 48)
  - «Beacon periódico: C2, no Actions on Objectives» (s04, 46; sale después de la respuesta a la pregunta)
  - «Weaponization no se observa: se infiere del artefacto» (s06, 53)
  - «Detectar solo en la última fase es llegar tarde» (s07, 47)
  - «En el equipo, lo primero que cortas: Exploitation» (s08, 49; sale después de la respuesta a la pregunta)
  - «Insider con acceso legítimo: la Kill Chain encaja mal» (s09, 53)
- **Preguntas para pensar** (`holdMs` 4500, cada una una decisión con dos opciones):
  - «Ese beacon, ¿C2 o Actions on Objectives?» (s04, 40). Respuesta: C2. Es el canal que le permite la misión, pero no
    es la misión: Actions on Objectives sería leer las carpetas de diseño, comprimirlas y sacarlas (s2m1q9). Antes de la
    pregunta, la voz ya ha dicho qué es un beacon («el programa llama a casa cada minuto; eso es un beacon»).
  - «En el propio equipo, ¿Delivery o Exploitation?» (s08, 46). Respuesta: Exploitation. La entrega pasa en la
    pasarela de correo, un control de red que va antes del equipo; dentro del equipo, lo primero que se puede impedir
    es que el acceso directo lance PowerShell. Más tarde también se puede cortar, pero ya ha avanzado más (s2m1q7).
- **Mensajes interceptados** (GLASS VIPER, uno en los capítulos I, III y IV; ninguno en el cierre; registro de V3 y V7:
  tutea, dos frases cortas, ironía en la segunda, sin marcar su género):
  - s02 (cap. I): «Tú tienes que acertar siempre. A mí me basta con una vez.» (57). El error que corrige la narradora:
    el tópico de que el defensor tiene que acertar siempre y el atacante una vez. La voz, más o menos así: «Para colarse
    una vez, quizá. Pero para llevarse los planos necesita que le salgan todos los pasos, y en orden. A ti te basta con
    cortar uno de los que tienes a tu alcance. ¿Que lo vuelve a intentar? Claro. Pero empieza de nuevo, y tú ya sabes
    cómo prepara la caja.» Nunca que un eslabón roto acaba con el atacante: frustra ese intento (s2m1q4). En esa
    respuesta la narradora presenta a GLASS VIPER: el nombre con el que sigues a quien opera dentro y a su programa.
  - s05 (cap. III): «Mi taller no lo verás nunca. Esa parte te la pierdes.» (53). El error: que lo que no ves no lo
    puedes saber. Tiene razón en el dato (nadie le vio montar el adjunto) y se equivoca en la conclusión: la caja que
    dejó en tu puerta cuenta cómo la preparó. Eso es inferir Weaponization.
  - s07 (cap. IV): «Tú vigila tus planos, que es lo importante. Lo demás, ni lo mires.» (66). El error: vigilar solo la
    última fase, la del daño. Claro que le conviene: si solo miras el final, te enteras cuando ya ha hecho todo lo
    demás. «Para que salte antes, primero tienes que ver antes: registros del correo, del equipo. Y cada paso que paras
    de verdad te ahorra todos los que venían detrás.»
- **Cierre:** tres reglas y una sola tarea.
  1. Siete pasos y en orden: él los necesita todos; a ti te basta con romper uno de los que tienes a tu alcance, y si
     vuelve a intentarlo, empieza de cero.
  2. Cada prueba, a su fase: el correo es la entrega y el latido es C2, no el objetivo; y lo que no ves, como su
     taller, lo deduces de lo que te deja.
  3. Cuanto más a la izquierda cortes, más pasos le quitas, y para eso hay que ver antes: si todo salta en la última
     fase, llegas tarde.

  Tarea: el Lab 2A (Kill Chain Mapping), doce eventos de esta intrusión que practican justo lo que el vídeo no recita.

**Se queda fuera** (y dónde está):
- La tabla de las siete fases con sus ejemplos (`src/data/s2.ts:21-32`): sale como viñetas de la imagen y como nombres en
  pantalla; la voz no la recorre fila a fila. El orden lo practica el Lab 2A y la pregunta s2m1q1 (`:123-130`).
- La matriz de Courses of Action y el «qué hacer en cada fase» (`:118`, lección s2m2): el vídeo dice dónde cortar, nunca
  con qué acción de la matriz.
- El check del ZIP al principio (`:50-58`) y el de las cabeceras (`:92-100`): el vídeo llega a lo mismo en s03, pero no
  los repite como pregunta.
- De Reconnaissance, solo una frase («casi nunca la ves, salvo en los registros de lo que tienes cara a internet, como
  tu web», que traduce los «logs públicos» de `:37`); el ejemplo de la
  tabla (perfiles de ingenieros en una red profesional, `:24`) sale solo como viñeta.
- «Kill chains comparadas revelan patrones del adversario» (`:118`): es V14.
- La ruta PDB concreta (`src/data/s2.ts:840,874,882`): V13 la nombra como tipo de pista, sin valor; la enseña V14.
- Qué pasó después del 5 de marzo (E9, `src/data/s2.ts:623`): es de V3 y de V14.

**Laboratorios:**
- **Lab 2A** (`src/data/labs.ts:205-278`, clasifica 12 eventos en su fase): es la penalización L. El vídeo solo lee la
  reconstrucción de la lección y nunca enseña ni clasifica los eventos que son solo del laboratorio: el escaneo de
  banners de la VPN, las pruebas del LNK contra antivirus, el canal de respaldo por una API de almacenamiento en la
  nube, la enumeración de recursos compartidos, los RAR en `C:\ProgramData\tmp`, los 650 MB, el beacon de 90 s, los
  «cuatro buzones de RR. HH.» ni «una analista de RR. HH. abre el LNK». Tampoco dice que el atacante «busque» o
  «recorra» carpetas (s04 se queda en «leer, comprimir y sacar»). Por eso el Lab 2A es la tarea del final: practica
  lo que el vídeo no recita.
- **Lab 2B** (`:279-339`, vértices del diamante): el vídeo no reparte nada en vértices; el Diamond Model sale solo como
  nombre en s09.
- **Lab 2C** (`:340-393`, Courses of Action): ninguna acción se rotula como Discover, Detect, Deny, Disrupt, Degrade,
  Deceive ni Destroy. La voz habla de «cortar», «parar» y «que salte una alarma».

**Canon nuevo que fija V13** (lo posterior debe respetarlo):
- **Ningún dato nuevo de la intrusión.** Todo lo que sale en pantalla ya existe: la alerta del 2026-03-05 a las 02:13 UTC
  con `ENG-WS-041` y `update-svc-cdn.com` como «dominio desconocido» (V3, `video/diamond-e7/src/scenes/S01Hook.tsx:196-197,277,286`),
  y la reconstrucción del 2-3 tal cual la escribe la lección (`src/data/s2.ts:68-85`), con la IP de `Received`
  (`203.0.113.27`) a la vista, como en la lección, y sin comentar (registro §5, punto 13).
- **La reconstrucción del 2-3 se hace después de la alerta del 5-3, sin hora**, como en V7 (registro §7, V7). V13 le
  añade las cabeceras del correo, que V7 no enseñó.
- **El 5-3, la cadena reconstruida llega hasta C2 y no hay pruebas de Actions on Objectives** (`src/data/s2.ts:113`):
  cuadra con V3, donde la primera acción sobre el objetivo es E9, el 2026-03-07 (`video/diamond-e7/narration.json:323,329`).
  El vídeo no dice si Meridian llegó a tiempo.
- **Tres mensajes nuevos de GLASS VIPER**, que pasan a ser canon de su voz (los de arriba, en s02, s05 y s07).
- **La imagen del taller** (Weaponization) es de la analogía, no del caso. **La etiqueta del taller = la ruta PDB**,
  imagen común de V13, V14 y V15 (un solo componente; en V13, en blanco). Nunca «la etiqueta» a secas (V7 llamó así al
  disfraz del nombre de la tarea, `video/attack-piramide/narration.json:77`) ni «etiqueta de envío» para las cabeceras
  (es la imagen de V1, `video/capas-halden/narration.json:47`).
- Ninguna persona, fecha, equipo ni IP nuevos.

**No se toca:**
- **El dosier de BROKEN CHAIN** (`src/data/course-gcti.ts:40`): ni que los TTPs se repitan en sus playbooks, ni el PDB en
  tres muestras, ni «VELVET CICADA ya tiene cara técnica». La cadena LNK, PowerShell y loader sale porque es la de la
  lección, de una sola intrusión.
- **Quién abrió el adjunto** (registro §5, punto 5): ni nombre ni puesto, y ni «RR. HH.» en pantalla junto a
  `ENG-WS-041`. La voz dice «llega un correo con un CV para una vacante de ingeniero de propulsión» y «en una estación de
  ingeniería, alguien lo abre», como V7 («se abre el adjunto»).
- **Las horas no se ordenan entre sí:** el correo es de las 09:41 UTC y la cadena del EDR va «sin zona» (registro §2).
  La voz dice «ese mismo día», nunca «tres minutos después».
- **El paso de certutil** (registro §5, punto 19): el vídeo enseña la cadena de s2m1, que no lo tiene, y la voz no dice
  qué proceso escribe `winhlp.exe`.
- **El cambio de binario del 5-3** (`UpdSvc\updsvc.exe`, `9f3a...e1`): es de V7. La ficha del 5-3 de V13 solo lleva
  equipo y dominio; ningún hash en todo el vídeo.
- **El intervalo del beacon** (registro §5, punto 3): 60 s, como la lección y V3; los 90 s del Lab 2A no salen.
- **El código E7 y el informe MER-2026-019:** son de s2m3 y V3.
- **El dominio de Meridian y el dominio del relay** no se discuten más allá de lo que dice la lección (registro §5, puntos
  6 y 13).
- **Nada de lo que pasa después:** ni E9, ni la exfiltración, ni Orbital (V14), ni el Lab 3A, el Lab 3B o el final de la
  campaña.
- No se culpa a nadie de Meridian: ni a quien abrió el adjunto ni al SOC. «Enterarte tarde» de s07 es una lección
  general con la imagen de la casa, no un reproche al caso.
- **No se promete de más:** un eslabón roto frustra ese intento, no acaba con el atacante; y una alarma que salta antes
  no corta nada si nadie actúa.

**Comprobación de límites** (recuentos de caracteres hechos con un script de Node, no a ojo):
- Perfil `principal-yt`: 10 escenas en 5 capítulos (máximo 5); suma 454 s, estimado ~545 s y real ~495–505 s, dentro de
  380–600.
- Conceptos clave: 5 (rango 4–6); como mucho dos tarjetas por concepto (1, 2, 1, 2, 1).
- Tarjetas: 7 (rango 5–8), todas ≤ 58 caracteres (50, 48, 46, 53, 47, 49, 53); como mucho una por escena (s02, s03, s04,
  s06, s07, s08, s09) y ninguna en la última.
- Preguntas para pensar: exactamente 2, ≤ 48 caracteres (40 y 46), `holdMs` 4500.
- Mensajes interceptados: 3 (rango 2–4), uno por capítulo (I, III y IV), ninguno en la escena final, ≤ 70 caracteres (57,
  53 y 66), `holdMs` 3500 (rango 2500–4500).
- Ni flechas, ni marcas de verificación, ni viñetas, ni emoji en tarjetas, preguntas y mensajes (comprobado con la
  expresión `FORBIDDEN_SYMBOLS` de `video/engine/scripts/lib/narration.mjs:23`). La flecha de la línea del beacon de la
  lección se dibuja como conector. Los rótulos nuevos de la revisión, «para saltar antes, hay que ver antes» (36) y
  «registros del correo · del equipo» (33), tampoco llevan símbolos prohibidos. Recontado con un script el 2026-10-05.
- Ningún identificador leído en voz (dominios, IP, equipo, ruta, nombre del adjunto y de la tarea, solo en pantalla).
- `wordBudget` total de 1.225 palabras a 2,7 por segundo; segmentos de 10–26 palabras y frases de ≤ 22.

---

### V14 · s2m4 · Principal · «De la foto a la película: activity threads y grupos»

> Propuesta del 2026-10-04; aprobada el 2026-10-05 con las opciones recomendadas (Lidia delegó las decisiones). Tanda 3; se graba en la misma sesión que V15 (s3m2,
> cápsula). La versión vigente de escenas y guion será `video/hilos-pelicula/storyboard.json` + `narration.json`; qué
> se quedó fuera, en `video/hilos-pelicula/out/script-notes.md`.
>
> **Un ajuste que no pide el validador sino el canon:** la Víctima 1 del walkthrough de la lección (Meridian,
> `src/data/s2.ts:871-877`) entra por otro correo, a otra hora, por otra ruta y saca los datos antes de la alerta del
> 5-3, todo en contra de s2m1, V3 y V7 (registro §5, puntos 4 y 7). El vídeo monta el hilo de Meridian con lo que ya
> está en pantalla y propone aparte cambiar esas líneas de la lección, como hizo V10 con la fecha y la IP del spraying.
> La pantalla está pensada para aguantar un «no»: motivos, texto exacto y plan B en `docs/reviews/2026-10-05-fichas-tanda3/decisiones.md` (apartado V14).
>
> **Revisada el 2026-10-05 (exactitud y canon, `revision-gcti.md`):** dos variantes escritas para s02, s04, s08 y s09
> (plan A con el cambio de la lección; plan B sin él, con E9 exactamente como la ficha de V3); «hipótesis que
> compruebas» en vez de «ya sabes qué escena viene», sin el «exactamente» de la lección; el nombre ACTIVITY-ATTACK GRAPH
> cae con las ramas posibles; la imagen y la frase comunes del PDB («la etiqueta del taller», «no siempre la lleva»);
> «PDB único» en la tarjeta de s04; «de la entrega a la llamada a casa»; «para que una detección dure»; conectores
> dibujados en s03; plan de recorte sin dos tarjetas en una escena; y las notas para el registro.

- **Carpeta:** `hilos-pelicula` · perfil `principal-yt` (380–600 s renderizados; objetivo ~8 min, sin rellenar) ·
  objetivo GCTI **Intrusion Analysis** (dominio del curso de S2, `src/data/course-gcti.ts:32`, y de las diez preguntas
  de s2m4, `src/data/s2.ts:947-1078`); las tarjetas llevan `"objective": "Intrusion Analysis"` e insignia «GCTI» ·
  adversario **GLASS VIPER** (`src/data/course-gcti.ts:36`), tres mensajes interceptados · voz `recording/lidia` con
  `"recording": { "tempo": 1.08, "maxPauseMs": 250 }` · voz del adversario: **ya existe**, la de V3 y V7
  (`"adversaryVoice": { "voice": "sapi/Microsoft Pablo", "rate": 0, "fx": "machine" }`,
  `video/diamond-e7/narration.json:6`) · música de V4 a V9 (`Go On Going - Stayloose.mp3`).
- **`video.json`:** `"profile": "principal-yt"`, `"track": "gcti"`, `"adversary": "GLASS VIPER"`, `"lesson": "s2m4"`,
  la música de arriba y `"tags"`: «activity thread», «activity group», «activity-attack graph», «Diamond Model»,
  «agrupación de intrusiones», «intrusion set», «análisis de intrusiones», «threat intelligence», «inteligencia de
  amenazas», «GCTI». Título de YouTube: «De la foto a la película: activity threads y grupos | GIAC GCTI en español».
- **Ritmo:** `"examTiming": "sentence-end"`; preguntas con `think.holdMs` 4500; mensajes con `intercept.holdMs` 3500.
- **Efectos (`sfx`):** los automáticos del motor y cuatro momentos: `cheap` («glitch», lo que cambia gratis), `match`
  («check», las dos rutas PDB que coinciden), `projected` («alarm», el hueco de Orbital que se ilumina con lo que vino
  después en Meridian; V3 dio «alarm» a E9) y `tonight` («lock», el plan de esa noche).
- **Duración:** suma de `s` **454 s** (10 escenas); `wordBudget` a 2,7 palabras/s: 97, 151, 124, 146, 113, 135, 108, 146,
  124 y 81 (1.225 palabras). Estimado de `build-timeline --estimate` ~9:05 (V9: 458 s de escenas, 9:14 estimado); real
  con la voz de Lidia ~8:15–8:25 (V9 quedó al 91 %). Las dos cifras caben en 380–600. Si el estimado pasa de ~580 s, se
  recorta primero s07 (dentro de su presupuesto) y, si no basta, se funden s05 y s04 y la tarjeta de s05 se cae (quedan
  6, dentro de 5–8; nunca dos tarjetas en una escena); si baja de ~420 s, se alarga s04, la comparación.
- **Inserción:** en `src/data/s2.ts`, lección s2m4, entre el último check («Victim 2's thread shows Delivery → Installation
  → C2 but no staging or exfil yet…», bloque `:923-937`) y el callout «🎖️ Campaña» que manda al Lab 2A y al Lab 2B
  (`:938-943`), como bloque `youtube`:
  `{ t: 'video', title: 'De la foto a la película: activity threads y grupos', youtube: '<id>', poster: 'videos/hilos-pelicula-poster.png', transcript: 'videos/hilos-pelicula-transcript.txt' }`.
  Todo lo que enseña ya lo ha presentado la lección (threads `:824`, groups y activity-attack graphs `:828`, enlaces
  débiles y fuertes `:830-846`, walkthrough `:862-903`, partial thread `:921-937`). Descartado ponerlo antes del
  walkthrough (`:862`): destriparía «Antes de seguir leyendo, intenta decidir» (`:865`). Se fija en la suite `lesson
  videos` de `src/data/content.test.ts` (`:248-284`).
- **Lo que se lee no se deletrea:** dominios, correos, rutas, la ruta PDB y los nombres de los programas van en pantalla;
  la voz dice qué son («un pedido falso a Finanzas», «un programa con nombre de servicio de Windows», «la ruta de la
  carpeta donde se compiló»). Ninguna excepción: la ruta PDB es la pista central, pero se entiende sin leerla, porque lo
  que importa es que coincide letra por letra. La voz no comenta ninguna palabra de esa ruta.
- **La imagen y la frase comunes del PDB** (las mismas en V15, `revision-gcti.md`, «Entre fichas» 1): **la etiqueta del
  taller**, un solo componente idéntico en V13, V14 y V15, con la ruta en monoespaciada; aquí va dentro de la caja. En voz,
  en s04 y palabra por palabra: «Al compilar, a veces se queda escrita dentro la carpeta donde se hizo. Es como la
  etiqueta del taller, por dentro. No siempre la lleva. Pero si otra trae la misma, salen del mismo taller.» Sin verbo
  para cómo va puesta (en V15 va «cosida en el cuello»). En pantalla, «la etiqueta del taller» y, para la regla, «si otra
  trae la misma: mismo taller · enlace fuerte». Nunca «la etiqueta» a secas (es el disfraz de la tarea en V7,
  `video/attack-piramide/narration.json:77`), ni «etiqueta de envío» (V1), ni «no la puede quitar» o «todas la llevan».
- **Enfoque («de la foto a la película»):** V3 acabó con «Un evento es una foto. Un hilo es la película. Y esa película
  la montas en la lección siguiente» (`video/diamond-e7/narration.json:347`; en pantalla, `S10Thread.tsx:305`). V14 la
  monta. Es el lunes 9 de marzo. Meridian tiene ya las fotos de su intrusión: lo que reconstruyó del 2 de marzo (V13 y
  V7), E7 el 5 y E9 el 7. Ese día, Orbital Components, proveedor de Meridian, le pasa sus eventos de esa misma mañana
  (los de la lección, `src/data/s2.ts:879-883`). Dos preguntas: ¿es el mismo atacante? y ¿qué hará después? El vídeo
  monta la película de Meridian, ve la de Orbital a medias, las compara con criterio (lo raro que sale del taller del
  atacante frente a lo que cambia gratis y lo que lleva todo el mundo), las junta en un grupo candidato sin nombre y
  usa lo que pasó en Meridian después de llamar a casa para decirle a Orbital qué buscar esa noche. GLASS VIPER provoca
  tres veces. Una frase sitúa a quien no ha visto nada: un evento es una foto de un momento del ataque (quién, con qué,
  por dónde y contra quién), y Meridian tiene varias de la misma intrusión.

**Conceptos (4) y su imagen:**

Dos imágenes, una por familia de conceptos, las dos heredadas: **la película** de V3 para el hilo y lo que viene después,
y **la caja trampa de V13** para lo que une dos intrusiones (la etiqueta del taller). Descartada la ropa, el acento y la
forma de andar de V7: mide lo que le cuesta cambiar algo, no lo raro que es, y con ella PowerShell («cómo anda») saldría
como el mejor enlace, justo al revés que la lección.

| # | Concepto | Imagen que se mantiene | Tarjetas |
|---|---|---|---|
| 1 | Activity thread: los eventos Diamond de una misma intrusión, ordenados en el tiempo y por fases de la kill chain, cuentan su historia entera. Uno por víctima (`src/data/s2.ts:824`; s2m4q1) | Un evento es una foto; el hilo es la película (V3) | «Activity thread: los eventos de una intrusión, en orden» |
| 2 | Enlaces fuertes y débiles. Dos hilos se comparan por lo que comparten, y cada rasgo pesa por lo raro y caro de cambiar que es: una ruta PDB única es fuerte; PowerShell, Cobalt Strike, el phishing o HTTPS al 443 los usa todo el mundo y no discriminan; lo que el atacante cambia gratis (dominios, señuelos) ni une ni separa (`src/data/s2.ts:834-846,893-897`; s2m4q2, q4, q7 y q10). Para que una detección dure te sirve lo que le cuesta cambiar; para agrupar, además, tiene que ser raro | Dos cajas en dos puertas: envoltorios distintos y aparatos que llaman a números distintos (lo barato), la misma cinta de embalar marrón que todo el mundo (lo débil) y, por dentro, la misma etiqueta del taller (lo fuerte). No siempre la lleva; pero si otra trae la misma, salen del mismo taller | «Enlace fuerte: raro y caro de cambiar, como un PDB único» · «PowerShell o HTTPS 443: enlace débil para agrupar» |
| 3 | Activity group: hilos agrupados por rasgos compartidos y justificados; es el paso previo de lo que fuera se llama «APT-X» o intrusion set, y la etiqueta es analítica. Agrupar no es atribuir (`src/data/s2.ts:828`; check `:859`; s2m4q6 y q8) | Las dos cajas salen del mismo taller; la puerta del taller no tiene placa | «Activity group: hilos unidos por enlaces fuertes» · «Agrupar no es atribuir: el grupo no dice quién es» |
| 4 | Lo que viene. Si una intrusión nueva encaja en un grupo, heredas hipótesis (qué hará, con qué, qué busca). El activity-attack graph superpone lo que el grupo hizo con lo que podría hacer, y un hilo parcial se vuelve plan: se vigilan ya las fases que aún no han llegado. Lo que se hereda son hipótesis que compruebas («testable hypotheses», s2m4q5, `src/data/s2.ts:1011`), no lo que va a pasar; la voz nunca copia el «exactamente» de `:902` (`src/data/s2.ts:828,902,921`; s2m4q3, q5 y q9) | La película de Meridian, entera, sobre la de Orbital, que va por la mitad: ya tienes una buena pista de la escena que viene; no la sabes, la compruebas | «Activity-attack graph: lo observado y lo posible» · «Hilo parcial: vigila las fases que aún no llegan» |

**Escenas:** diez, en cinco capítulos (De la foto a la película · ¿El mismo taller? · Un grupo, no un nombre · Lo que
viene · Para el examen).

| Escena | Cap. | s | Qué se ve | Qué se aprende · marcas (`requiredCues`) |
|---|---|---|---|---|
| s01-fotos «Dos fotos y una pregunta» | I De la foto a la película | 36 | Dos fichas sueltas con el estilo de las de V3 (`video/diamond-e7/src/scenes/S10Thread.tsx:66-88`): «E7 · 2026-03-05 · 02:13 UTC · beacon HTTPS · 60 s · C2» y «E9 · 2026-03-07 · +2 días · misma metodología · Actions on Objectives», bajo «Meridian Dynamics». Entra un tercer montón: «09-03-2026 · Orbital Components · proveedor de Meridian · eventos nuevos». Dos preguntas: «¿el mismo atacante?» y «¿qué hará después?». Título «De la foto a la película», con «activity threads y grupos» debajo, antes de los 10 s. La promesa en tres chips: «montar el hilo de una intrusión · saber si dos son del mismo · adelantarte a lo que viene». Tira de puente con la frase de V3: «un evento es una foto · un hilo es la película» | La promesa en los primeros 10 s y el puente con V3: un evento es la foto de un momento del ataque · `photos, orbital, title, promise, bridge` |
| s02-pelicula «La película de Meridian» | I | 56 | La fila de las siete fases de la kill chain, como en V3 S10. Las fotos de Meridian se colocan una a una por fecha y por fase: «02-03 · Delivery · correo con un CV» (plan B: «correo con un adjunto»), «02-03 · Exploitation · se abre el adjunto», «02-03 · Installation · loader y tarea programada», «02-03 · C2 · primera llamada a casa» (las del 2-3 sin número de evento y sin hora), E7 «05-03 · C2» y E9. Plan A: «07-03 · Actions on Objectives · compresión en una carpeta temporal · salida grande» (sin tamaño ni destino). Plan B: la ficha de V3 al pie de la letra, «E9 · 2026-03-07 · +2 días · misma metodología · Actions on Objectives» (`video/diamond-e7/src/scenes/S10Thread.tsx:80-84`), sin contenido. Una línea las une y las fotos se vuelven fotogramas de una tira de película: ACTIVITY THREAD. Chips: «una intrusión · una víctima · en orden de tiempo y de fase». Debajo, el orden de construcción, a medias: «eventos · hilo». La tarjeta. Cierre del capítulo | El activity thread encadena los eventos de una intrusión a lo largo de las fases y del tiempo · `rail, frames, order, thread, film, wrap-i` |
| s03-orbital «Otra empresa, otra película» | II ¿El mismo taller? | 46 | Las líneas de Orbital de la lección tal cual (`src/data/s2.ts:879-883`), con el rótulo «eventos crudos · Orbital Components · proveedor de Meridian»; el «->» de la lección se dibuja como conector, como en V7 (`video/attack-piramide/src/scenes/parts/ProcessTree.tsx:40`) y V13. Por pasos, con lo demás atenuado: `08:05 email "PO revision" -> finance@orbital.example`, «un pedido falso a Finanzas»; `08:22 attachment runs; drops C:\Users\..\msdtcs.exe`, «se ejecuta el adjunto y deja un programa»; la línea `linker artifact`, atenuada para s04; `08:23 msdtcs.exe beacons -> portal-auth-check.example:443`, «llama a casa». Su propia fila de fases: Delivery, Exploitation, Installation y C2 encendidas; Actions on Objectives vacía, con una interrogación: «hilo parcial». Al final, las dos películas una al lado de la otra y el mensaje interceptado | Un hilo por víctima; el de Orbital es parcial (`src/data/s2.ts:887`) · `orbital-log, lure, runs, calls, partial` · **mensaje** |
| s04-taller «La etiqueta del taller» | II | 54 | Respuesta al mensaje. Una tabla de comparación que se rellena fila a fila, Meridian a la izquierda y Orbital a la derecha. «Señuelo: un CV · un pedido» (solo en el plan A; en el plan B la tabla empieza en el dominio) y «dominio al que llama: `update-svc-cdn.com` · `portal-auth-check.example`» pasan a gris, con «barato de cambiar · ni une ni separa». La imagen de V13: dos cajas en dos puertas, con envoltorios distintos y aparatos que llaman a números distintos. Después, la fila «ruta de compilación (PDB)»: `D:\proj\cicada\loader\Release\ldr.pdb` a los dos lados (Meridian: `winhlp.exe`; Orbital: `msdtcs.exe`), que se iluminan carácter a carácter hasta coincidir enteras, en cian, mientras la voz dice la frase común («Al compilar, a veces se queda escrita dentro…»). Dentro de las dos cajas, el componente común: **la etiqueta del taller**. Rótulo: «si otra trae la misma: mismo taller · enlace fuerte». La tarjeta | Los enlaces se pesan por lo raros y caros de cambiar; lo barato que cambia no rompe nada (`src/data/s2.ts:834,840,894-895`; s2m4q2 y q7) · `reply-ii, lure, cheap, pdb, match, label, strong` |
| s05-debiles «Lo que lleva todo el mundo» | II | 42 | Dos filas más: «canal: HTTPS al 443 · HTTPS al 443», «muy débil: lo hace todo el mundo»; «relación: proveedor de Meridian», «medio: encaja con ir a por su cadena de suministro». Al lado, la lista de la lección de lo que no une, «PowerShell · Cobalt Strike · phishing», con «miles de actores» (`src/data/s2.ts:834,842-843`). La imagen: la cinta de embalar marrón en las dos cajas, «como todas las cajas». Una línea pequeña que enlaza con V7: «para que una detección dure: lo que le cuesta cambiar · para agrupar: además, que sea raro» (lo raro también importa al detectar, por los falsos positivos; lo que separa a V7 de esta lección es cuánto dura la detección). La tarjeta. Pregunta para pensar, con la tabla entera a la vista | Lo que comparte medio mundo no discrimina; detectar y agrupar piden cosas distintas (s2m4q4 y q10) · `https, supplier, weak-list, tape, detect-vs-group, weak` · **pregunta** |
| s06-grupo «Mismo taller, mismo grupo» | III Un grupo, no un nombre | 50 | Respuesta: sí. La tabla se resume en dos marcas, «fuerte: la ruta PDB» y «medio: proveedor»; lo gris se queda gris. Las dos películas entran en un mismo marco: ACTIVITY GROUP, «candidato». El orden de construcción se completa: «eventos · hilos · comparar hilos · grupo» (s2m4q8). Una nota: «lo que fuera se llama "APT-X" o intrusion set» (`src/data/s2.ts:828`). La tarjeta | Un activity group son hilos agrupados por rasgos compartidos y justificados; que falte un enlace barato no rompe el grupo (s2m4q6; check `:904-918`) · `answer, verdict, frame, group, build-order, apt` |
| s07-nombre «Un grupo no es un nombre» | III | 40 | Mensaje interceptado. El marco del grupo lleva una etiqueta en blanco: «sin nombre». La imagen: la puerta del taller, sin placa: «mismo taller · ¿de quién?». Dos columnas: «agrupar: qué intrusiones van juntas» y «atribuir: quién está detrás · pide otras pruebas», con un chip «S4: niveles de atribución». La tarjeta. Cierre del capítulo | Agrupar no es atribuir; la etiqueta del grupo es analítica (check `src/data/s2.ts:859`; s2m4q6) · `reply-iii, blank, plate, two-cols, attribution, wrap-iii` · **mensaje** |
| s08-grafo «La escena que viene» | IV Lo que viene | 54 | Mensaje interceptado. La película de Meridian, entera, se superpone a la de Orbital: las fases de la entrega a la llamada a casa coinciden y se enlazan. El fotograma de E9 se proyecta sobre el hueco de Actions on Objectives de Orbital y se ilumina. Plan A: «lo que vino después en Meridian: compresión en una carpeta temporal · salida grande». Plan B: «lo que vino después en Meridian: Actions on Objectives», sin contenido. Tres hipótesis heredadas, en chips, con un rótulo «a comprobar»: «qué hará después · con qué · qué busca»; la voz: «Ya tienes una buena pista de la escena que viene: no la sabes, la compruebas.» Después, desde el hueco salen dos ramas discontinuas, «otra carpeta · otro destino»: los caminos posibles, y solo entonces cae el nombre ACTIVITY-ATTACK GRAPH, «lo que hizo y lo que podría hacer». La tarjeta | Encajar en un grupo te deja heredar hipótesis que compruebas; el activity-attack graph superpone lo observado y lo posible (`src/data/s2.ts:828,902,921`; s2m4q3 y q5) · `reply-iv, overlay, match-phases, projected, inherit, possible, graph` · **mensaje** |
| s09-noche «Orbital, a medio camino» | IV | 46 | Pregunta para pensar, con la película de Orbital y su hueco. Respuesta: «esperar a que saque los datos para confirmarlo» se tacha, con «cuesta justo lo que quieres proteger»; se marca «buscar ya». El plan que Meridian le pasa a Orbital: «esta noche: buscar compresión de archivos en carpetas temporales · vigilar transferencias salientes grandes», sin fecha y sin ningún resultado. En los dos planes sale del check de la lección («archive staging in temp paths and large outbound transfers», `src/data/s2.ts:929`), no de la ficha de E9. La tarjeta. Cierre del capítulo: la película de Meridian se convierte en una lista de cosas que buscar | Las fases que el grupo hizo en otra víctima y que aquí aún no han llegado son el plan (check `src/data/s2.ts:923-937`; s2m4q9) · `wait, hunt, plan, tonight, wrap-iv` · **pregunta** |
| s10-reglas «Tres reglas» | V Para el examen | 30 | Tres tarjetas de reglas con sus iconos (la tira de película, la etiqueta del taller, el fotograma que se proyecta); tarjeta final Alertópolis: «Tu turno: las preguntas de la lección» (s2m4, 10 preguntas) | Reflejos · `recap, rule-1, rule-2, rule-3, next, endcard` |

**Las dos variantes, según lo que decida Lidia sobre la lección** (todo lo demás es igual en las dos):

| Dónde | Plan A: se cambia la Víctima 1 de la lección (recomendado) | Plan B: la lección se queda como está |
|---|---|---|
| s02, foto de Delivery | «02-03 · Delivery · correo con un CV» | «02-03 · Delivery · correo con un adjunto» |
| s02, ficha de E9 | «07-03 · Actions on Objectives · compresión en una carpeta temporal · salida grande» | La de V3 al pie de la letra: «E9 · 2026-03-07 · +2 días · misma metodología · Actions on Objectives», sin contenido |
| s04, fila del señuelo | «señuelo: un CV · un pedido», en gris | No sale: la comparación empieza en el dominio |
| s08, lo que se proyecta en el hueco de Orbital | «lo que vino después en Meridian: compresión en una carpeta temporal · salida grande» | «lo que vino después en Meridian: Actions on Objectives» |
| s09, el plan | Sale del check de la lección (`src/data/s2.ts:929`), sin fecha | Igual: del check, sin fecha |
| Registro | Lo de «Canon nuevo» y lo que lista `docs/reviews/2026-10-05-fichas-tanda3/decisiones.md` (apartado V14) | Ni contenido de E9 ni la ruta PDB en `4c81...b3` |

En el plan B, la voz de s08 dice «lo que hizo en Meridian después de llamar a casa» sin describirlo, y el contenido
llega en s09 desde la lección («comprimir en carpetas temporales y sacar mucho de golpe»), como lo que hace este grupo,
no como lo que hizo el 7-3.

- **Tarjetas de examen** (dominio Intrusion Analysis), una por escena en s02, s04, s05, s06, s07, s08 y s09 (ninguna en
  s01, en s03 ni en el cierre). Cada una espera al final de su frase y lleva ~5 s de escena detrás:
  - «Activity thread: los eventos de una intrusión, en orden» (s02, 55)
  - «Enlace fuerte: raro y caro de cambiar, como un PDB único» (s04, 56)
  - «PowerShell o HTTPS 443: enlace débil para agrupar» (s05, 49; sale antes de la pregunta)
  - «Activity group: hilos unidos por enlaces fuertes» (s06, 48)
  - «Agrupar no es atribuir: el grupo no dice quién es» (s07, 49)
  - «Activity-attack graph: lo observado y lo posible» (s08, 48)
  - «Hilo parcial: vigila las fases que aún no llegan» (s09, 48; sale después de la respuesta a la pregunta)
- **Preguntas para pensar** (`holdMs` 4500, cada una una decisión con dos opciones):
  - «Dominios distintos, mismo PDB. ¿Los agrupas?» (s05, 44). Respuesta, al abrir s06: sí. La ruta PDB es rara y sale
    del taller del atacante; el dominio lo cambia gratis, y que no coincida no rompe el grupo (check `src/data/s2.ts:904-918`;
    s2m4q7). Junto con el enlace medio del proveedor, basta para un grupo **candidato**.
  - «Orbital va por C2. ¿Esperas o buscas ya?» (s09, 40). Respuesta: buscar ya. Esperar a que saque los datos para
    confirmar el patrón cuesta justo lo que quieres proteger; lo que el grupo hizo en Meridian después de llamar a casa
    es una hipótesis que se comprueba esta noche en Orbital (check `:923-937`). Nunca «exactamente» (`:902`).
- **Mensajes interceptados** (GLASS VIPER, uno en los capítulos II, III y IV; ninguno en el cierre; registro de V3 y V7:
  tutea, dos frases cortas, ironía en la segunda, sin marcar su género):
  - s03 (cap. II): «Otra empresa, otro dominio, otro correo. Eso no es cosa mía.» (60). El error que corrige la narradora
    en s04: creer que si cambian la víctima, el dominio y el señuelo, cambia el atacante. Todo eso lo cambia gratis; lo
    que cuenta es lo que no cambia, y la etiqueta de su taller está en las dos cajas.
  - s07 (cap. III): «Ya me has metido en un grupo. Pues dime quién soy.» (50). El error: creer que agrupar es saber
    quién. Sabes que las dos cajas salen del mismo taller; de quién es el taller, eso es atribuir, y pide otras pruebas.
    Encaja con su mensaje de V3, «Mi nombre no lo sabrás» (`video/diamond-e7/narration.json:142`).
  - s08 (cap. IV): «En Orbital solo llamo a casa. Ahí no va a pasar nada más.» (57). El error: tomar un hilo parcial por
    un final, como si la intrusión se hubiera quedado ahí (el distractor de s2m4q9, «Means the intrusion failed»). En
    Meridian, después de llamar a casa vino lo demás; Orbital va por la mitad de la película. No sabes cómo sigue, pero
    tienes una buena pista que comprobar.
- **Cierre:** tres reglas y una sola tarea.
  1. Un evento es una foto; los de una misma intrusión, en orden y por fases, son su película: el activity thread.
  2. Para juntar dos películas, busca lo raro que sale de su taller, como una ruta PDB única; lo que cambia gratis o lleva
     todo el mundo no une ni separa.
  3. Un grupo no es un nombre, es un plan: lo que hizo en una víctima te da hipótesis que comprobar en la siguiente,
     antes de que pase.

  Tarea: las 10 preguntas de la lección s2m4. Ningún laboratorio de S2 practica hilos ni grupos (el callout que va justo
  después manda al Lab 2A y al Lab 2B, que son de s2m1 y s2m3).

**Se queda fuera** (y dónde está):
- El certificado autofirmado «en 3 C2» como ejemplo de enlace fuerte (`src/data/s2.ts:841`): choca con las tres IP de V4,
  que no son tres C2 (registro §5, punto 10).
- El targeting «mismas 5 empresas de propulsión en 2 semanas» (`:844`) y el check de dos intrusiones con el mismo loader,
  el mismo patrón de registro y targeting aeroespacial (`:847-861`); la idea de que el targeting cuenta como enlace medio
  queda en la fila del proveedor.
- Mimikatz (`:834`) y el «volveremos sobre esto en S4M4»: fusionar o separar clusters y documentar criterios es s4m4
  (`src/data/s4.ts:720-745`).
- La atribución y sus niveles (s4m5): solo una frase y un chip en s07.
- Los nombres y las carpetas de los dos programas (`winhlp.exe` frente a `msdtcs.exe`) no se comparan como rasgo.
- El párrafo del resultado práctico (`src/data/s2.ts:921`) entra resumido en s08; el callout de campaña (`:938-943`) se
  queda en la lección.

**Laboratorios:** ninguno de S2 agrupa intrusiones, así que no hay solución que destripar; tres precauciones.
- **Lab 2A** (`src/data/labs.ts:205-278`): el hilo de Meridian coloca en sus fases los eventos de s2m1 y de V3, no los del
  laboratorio. No salen los RAR en `C:\ProgramData\tmp`, los 650 MB, el canal por una API de almacenamiento en la nube ni
  el beacon de 90 s; E9 no lleva ni tamaño ni destino (y en el plan B, ni contenido).
- **Lab 2B** (`:279-339`): el vídeo no reparte nada en vértices (ni la ruta PDB en Capability, ni el certificado en
  Infrastructure), y no enseña la cuenta VPN de un proveedor ni el webshell (`:329,334`).
- **Lab 2C** (`:340-393`): «buscar» y «vigilar» son verbos de todos los días; ninguna acción se rotula como Discover o
  Detect.
- **Lab 3B** (`:765-843`): la ruta PDB sale en dos programas, como en la lección. La frase común dice «no siempre la
  lleva», que es exacto (la ruta se puede quitar al compilar) y que el laboratorio ya enseña («raro», «solo variante 1»
  junto a esa cadena, `src/data/labs.ts:775`); su solución está en otra cadena. Nunca se nombran las variantes.

**Canon nuevo que fija V14** (lo posterior debe respetarlo):
- **2026-03-09 (lunes), sin hora: el «hoy» de V14.** Orbital Components, proveedor de Meridian, le pasa a Meridian sus
  eventos de esa misma mañana, los de la lección (`src/data/s2.ts:879-883`). No se dice cómo ni quién. Es algo puntual,
  no una fuente fija: el CMF de S3 sigue con su hueco PIR-3, «¿algún proveedor de Meridian ha sido comprometido?» · SIN
  FUENTE (`src/data/s3.ts:64,76`).
- **El hilo de Meridian en pantalla:** cuatro eventos del 02-03 sin número ni hora (Delivery, «correo con un CV» en el
  plan A y «correo con un adjunto» en el B; Exploitation; Installation, «loader y tarea programada»; C2, «primera llamada
  a casa»), E7 (05-03, C2, `02:13 UTC`) y E9 (07-03, Actions on Objectives). Los del 2-3 no reciben número de evento:
  E1–E6 y E8 siguen sin definir.
- **E9 tiene contenido solo en el plan A:** «compresión en una carpeta temporal · salida grande», sin tamaño ni destino
  en pantalla; es lo que la lección pone hoy el 4-3 y el 5-3 (`src/data/s2.ts:876-877`), que el cambio pasa a la
  madrugada del sábado 7-3. En el plan B, E9 es la ficha de V3 tal cual y no gana contenido. Hueco menor para el
  registro: V3 dice que E9 tiene «misma metodología» que E7 («beacon HTTPS, jitter 60s», `src/data/s2.ts:570`), y una
  salida hacia otro destino no es eso; por eso el vídeo deja la salida sin destino.
- **La ruta PDB** `D:\proj\cicada\loader\Release\ldr.pdb` sale igual en `winhlp.exe` (Meridian, 02-03) y en `msdtcs.exe`
  (Orbital, 09-03), como ya dice la lección (`:873-874`, `:881-882`).
  **Solo para el registro, y solo con el cambio propuesto de la lección (nunca en pantalla ni en voz, por el dosier de
  BROKEN CHAIN):** el `winhlp.exe` del 2-3, ya en `C:\ProgramData` como en s2m1 y V7, es el
  `4c81...b3` del árbol de s2m5 (`src/data/s2.ts:1165`), así que pasa a llevar la ruta PDB (V7 lo dejó «con rasgos
  estáticos sin definir», registro §7). Con la muestra `9f3a...e1` de E7, que también la lleva (`src/data/s3.ts:332`), y
  la de Orbital, son tres muestras con la misma ruta: lo que revela el dosier (`src/data/course-gcti.ts:40`). Resuelve el
  punto 11 de §5 y una parte más del punto 1 (el nombre `VC_Loader_v1.dll` del Lab 3B sigue abierto). La «variante 1,
  la del incidente de Meridian» (`src/data/labs.ts:819`) pasa a ser una familia de compilaciones con ruta PDB, `4c81` (2-3)
  y `9f3a` (5-3), no un solo binario: el registro (§7, V7) se reescribe así. `4c81` sigue sin ser la variante 2, que no
  lleva ruta PDB (`src/data/labs.ts:826`). También con el plan A: poner 09:41 (UTC) y 09:44 (EDR) en el mismo bloque da
  por hecho que el EDR de `ENG-WS-041` va en UTC, como las líneas del mismo sensor en V3
  (`video/diamond-e7/src/data/s03-victim.ts:25-45`); el registro §2 lo apunta así.
- **Los señuelos:** en Meridian, un CV para una vacante de ingeniería de propulsión (s2m1, `src/data/s2.ts:73-74`); en
  Orbital, «PO revision», el mismo **señuelo** contra proveedores que usan S4 y S5 (`src/data/s4.ts:1033-1035`,
  `src/data/s5.ts:56-58`), pero no la misma **ola**: aquellas son phishing de credenciales contra portales de
  proveedores, y lo de Orbital es un adjunto que ejecuta código (`src/data/s2.ts:880-881`). Con el cambio propuesto,
  «PO revision» queda solo para proveedores.
- **El veredicto:** un activity group **candidato**, sin nombre: ni VELVET CICADA ni GLASS VIPER. GLASS VIPER sale solo
  como nombre del implante en las fichas de E7 y E9 (como en V3) y como firma de los mensajes.
- **La noche del 9-3:** Meridian le pasa a Orbital qué buscar (compresión de archivos en carpetas temporales,
  transferencias salientes grandes), como hipótesis que se comprueba. Sin resultado en pantalla: el vídeo no dice si se
  encontró algo.
- **La etiqueta del taller = la ruta PDB**, imagen común de V13, V14 y V15, con la frase común en voz (ver arriba).
- **Tres mensajes nuevos de GLASS VIPER**, que pasan a ser canon de su voz (los de arriba, en s03, s07 y s08).
- La caja, el taller y la película son de las analogías, no del caso.
- **Comprobado contra la cronología:** el 9-3 es lunes y el 7-3, sábado (comprobado con Node); nada choca con el
  registro §2, y lo siguiente es el indicador del ISAC del 11-3, que V14 no toca. Ninguna persona nueva.

**No se toca:**
- **El dosier de BROKEN CHAIN** (`src/data/course-gcti.ts:40`): ni «tres muestras», ni que los TTPs se repitan en sus
  playbooks, ni «VELVET CICADA ya tiene cara técnica». Por eso el adjunto de Orbital no se llama LNK ni se dice que
  lanzara PowerShell (la lección solo dice «attachment runs», `src/data/s2.ts:881`), y el grupo no lleva nombre.
- **La palabra que hay dentro de la ruta PDB:** sale tal cual, como en la lección, y la voz no la comenta (de dónde sale
  el nombre del grupo es un hallazgo del Lab 3A, `src/data/labs.ts:688-691`).
- **Cluster-A y Cluster-B («Orbital-2»)** de s4m4 (`src/data/s4.ts:729-745`): el vídeo no habla de clusters ni dice que lo
  que pase después en Orbital sea del mismo grupo.
- **La campaña STIX «PO-REVISION phishing wave»** (`src/data/s4.ts:1033`) y la ola de abril contra los portales de
  proveedores (`src/data/s5.ts:47-58`): no se nombran.
- **El certificado «en 3 C2»** (registro §5, punto 10) y **el tamaño y el destino de la salida de E9** (§5, punto 7: 1,2 GB
  en la lección, 650 MB en el Lab 2A).
- **El vector de entrada por un proveedor** (cuenta VPN del Lab 2B, portales del BLUF de S5; registro §5, punto 4): el
  hilo de Meridian entra por el correo de s2m1.
- **Quién abrió el adjunto en Meridian** (registro §5, punto 5): «se abre el adjunto», sin persona ni puesto.
- **`j.alvarez`, «PO revision» en Meridian y las horas de 09:14 a 09:32:** no salen (con el cambio propuesto desaparecen
  de la lección).
- **El resultado de la búsqueda en Orbital** y cualquier cosa posterior al 9-3.
- No se culpa a nadie: ni a Finanzas de Orbital ni a quien abrió el CV en Meridian.

**Comprobación de límites** (recuentos de caracteres hechos con un script de Node, no a ojo):
- Perfil `principal-yt`: 10 escenas en 5 capítulos (máximo 5); suma 454 s, estimado ~545 s y real ~495–505 s, dentro de
  380–600.
- Conceptos clave: 4 (rango 4–6); como mucho dos tarjetas por concepto (1, 2, 2, 2).
- Tarjetas: 7 (rango 5–8), todas ≤ 58 caracteres (55, 56, 49, 48, 49, 48, 48); como mucho una por escena (s02, s04, s05,
  s06, s07, s08, s09) y ninguna en la última. Si s05 se funde con s04, se cae la de s05 (quedan 6).
- Preguntas para pensar: exactamente 2, ≤ 48 caracteres (44 y 40), `holdMs` 4500.
- Mensajes interceptados: 3 (rango 2–4), uno por capítulo (II, III y IV), ninguno en la escena final, ≤ 70 caracteres (60,
  50 y 57), `holdMs` 3500 (rango 2500–4500).
- Ni flechas, ni marcas de verificación, ni viñetas, ni emoji en tarjetas, preguntas y mensajes (comprobado con la
  expresión `FORBIDDEN_SYMBOLS` de `video/engine/scripts/lib/narration.mjs:23`). El «->» de las líneas de Orbital se
  dibuja como conector, como en V7 y V13. Los rótulos nuevos de pantalla («si otra trae la misma: mismo taller · enlace
  fuerte», 51; «a comprobar», 11) tampoco llevan símbolos prohibidos. Recontado con un script el 2026-10-05.
- Ningún identificador leído en voz (dominios, correo, rutas, ruta PDB y nombres de programa, solo en pantalla).
- `wordBudget` total de 1.225 palabras a 2,7 por segundo; segmentos de 10–26 palabras y frases de ≤ 22.

---

### V15 · s3m2 · Cápsula · «Lo que cuenta una muestra: triaje de malware en sandbox»

> Propuesta del 2026-10-04; aprobada el 2026-10-05 con las opciones recomendadas (Lidia delegó las decisiones). Se graba en la misma sesión que V14 (s2m4). La versión
> vigente de escenas y guion será `video/sandbox-muestra/storyboard.json` + `narration.json`; qué se quedó fuera, en
> `video/sandbox-muestra/out/script-notes.md`. Las decisiones, con la alternativa descartada de cada una, están en
> `docs/reviews/2026-10-05-fichas-tanda3/decisiones.md` (apartado V15).
>
> Revisada el 2026-10-05 (exactitud y canon, `revision-gcti.md`): la tarjeta de s02 dice «subirla puede avisarle», como
> la lección, y en voz «nadie la ha subido ahí»; la ruta del PDB lleva la imagen común con V13 y V14, «la etiqueta del
> taller» (aquí cosida en el cuello de la prenda), con su frase compartida y «no siempre la lleva»; la respuesta al
> segundo mensaje empieza por «bloquearlos sigue valiendo»; la habitación de s04 pasa a ser un teléfono de prestado (la
> «casa» es de V13); el imphash «apunta» a la familia; el pipe sale de la voz y se queda en pantalla («otro número en
> cada ejecución»), con un nuevo orden de recorte; el rótulo del informe dice «extracto»; `ctldl.windowsupdate.com` son
> «certificados de confianza»; el bloque de inserción lleva título; los encabezados de tarjetas y pregunta, en español;
> y se propone `NtMapViewOfSection` para la lección (lo decide Lidia).
>
> **Dos ajustes que no pide el validador sino el canon:**
> - El informe sale en pantalla como **extracto, sin la línea del firmante** (`Signing cert`, `src/data/s3.ts:334`): para
>   el mismo hash, V3 enseña `signed=false` (`video/diamond-e7/src/data/s03-victim.ts:32`; registro §5, punto 2). El
>   rótulo dice «extracto», porque el informe completo está justo encima, en la lección.
> - La lista de hosts sale **sin las anotaciones de la lección** (`→ C2`, `→ NTP legítimo…`, `src/data/s3.ts:340-344`)
>   hasta después de la pregunta para pensar, para que la pregunta no llegue contestada en pantalla. Al anotarse, se
>   rotulan en llano y sin el «jitter 60s» (registro §5, punto 3).

- **Carpeta:** `sandbox-muestra` · perfil `capsula-yt` (190–260 s renderizados; objetivo ~4:00, sin rellenar) · dominio del
  curso **Collection** (S3 · Fuentes de colección, `src/data/course-gcti.ts:51`; todas las preguntas de s3m2 llevan
  `domain: 'Collection'`, `src/data/s3.ts:413`; las tarjetas llevan `"objective": "Collection"` y la insignia dice «GCTI»)
  · adversario **HOLLOW LANTERN** (`src/data/course-gcti.ts:55-57`), dos mensajes interceptados · voz `recording/lidia`
  con `"recording": { "tempo": 1.08, "maxPauseMs": 250 }` · voz del adversario: **ya existe**, la de V4 y V8
  (`"adversaryVoice": { "voice": "sapi/Microsoft Pablo", "rate": 0, "fx": "machine" }`,
  `video/pivot-infra/narration.json:11`, `video/stix-isac/narration.json:11`) · música de V4 a V9
  (`Go On Going - Stayloose.mp3`, la única pista de `video/engine/music/LICENSES.md`).
- **`video.json`:** `"profile": "capsula-yt"`, `"track": "gcti"`, `"adversary": "HOLLOW LANTERN"`, `"lesson": "s3m2"`, la
  música de arriba y `"tags"`: «análisis de malware», «sandbox», «análisis estático», «análisis dinámico», «imphash»,
  «ssdeep», «fuzzy hashing», «inteligencia de amenazas», «threat intelligence», «GCTI». Título de YouTube: «Lo que cuenta
  una muestra: triaje de malware en sandbox | GIAC GCTI en español».
- **Ritmo:** `"examTiming": "sentence-end"`; pregunta con `think.holdMs` 4500; mensajes con `intercept.holdMs` 3500.
- **Léxico nuevo:** `ssdeep` («ese ese dip»), `imphash` («imp jash»), `PDB` («pe de be»), `sandbox` («sánbox»).
- **Lo que se lee no se deletrea:** la voz dice «el programa», «la muestra», «su servidor de siempre», «uno de repuesto»,
  «la tarea», «la carpeta donde se hizo». Van solo en pantalla los dominios, el hash, la ruta del ejecutable, el nombre
  del pipe, el de la tarea, la ruta del PDB, la fecha de compilación y el número del informe. Ninguna excepción. «E7» sí
  se dice: es el nombre del evento y V4 ya lo dice en voz (`video/pivot-infra/narration.json:44`). La voz no nombra
  VELVET CICADA ni GLASS VIPER: dice «el atacante» o «su dueño», como V7.

**Efectos (`sfx`):** los automáticos del motor (mensaje, tarjetas, capítulos) y cuatro momentos: `no-hits` («check»),
`blackout` («error»), `triage` («block», el candado sobre los dos hosts del actor) y `label` («ping2»).

**Duración:** suma de `s` **218 s** (`wordBudget` a 2,7 palabras/s: 54, 103, 81, 130, 157 y 65; unas 590 en total). El
guion se queda en **unas 550 palabras**, por debajo del presupuesto: V8 tenía 559 con un solo mensaje, y V15 lleva dos,
que suman unos 4–5 s cada uno entre la espera y la voz del adversario. Un borrador de comprobación (no es el guion) da
41, 102, 67, 122, 155 y 62 palabras (549). Para llegar ahí, la frase del pipe de s03, que la revisión ponía la primera
en el orden de recorte, ya sale de la voz y se queda en pantalla. Estimado de `build-timeline --estimate`, **unos
250–255 s (~4:10–4:15)**, a partir de V8 (559 palabras, 4:13); con el ritmo de Lidia (V8 grabó al 92 % de su
estimado), **unos 230–235 s (~3:50–3:55)** renderizados. Dentro de 190–260. No se rellena. La suma no predice bien el
renderizado (V5 salió a 0,89 veces su suma y V4 a 1,22), así que el primer borrador se mide por los dos lados. Si el
estimado pasa de 255 s, se recorta en este orden: primero, en s04, la frase del C2 de repuesto (pasa a pantalla); solo
después, en s05, la de la fecha de compilación, porque la regla 3 del cierre la nombra. Si se acerca a 190 s, se alarga
s04, la de leer la lista de hosts.

**Inserción:** en `src/data/s3.ts`, lección s3m2, entre el párrafo del triaje («El triaje empieza separando
infraestructura del actor de ruido del sistema…», bloque `:346-349`, texto en `:348`) y el primer check («Of the five
contacted hosts, which should be actioned as C2…», `:350-364`), como bloque `youtube`:
`{ t: 'video', title: 'Lo que cuenta una muestra: triaje de malware en sandbox', youtube: '<id>', poster: 'videos/sandbox-muestra-poster.png', transcript: 'videos/sandbox-muestra-transcript.txt' }`.
Es el sitio de V3 y V7: justo antes de los cuatro checks que preguntan por los mismos datos (los cinco hosts; imphash y
ssdeep; ssdeep; el PDB). Para entonces la lección ya ha presentado todo lo que enseña el vídeo: estático y dinámico
(`:292`), hashes, imphash, ssdeep y PDB (`:297-301`), la regla de OPSEC (`:316`), el informe (`:327-344`, la fecha
falseable en `:331`) y el triaje con sus pivotes (`:348`). El párrafo de justo antes contesta la pregunta para pensar;
es el mismo caso que V7 y V8, y el vídeo la hace igual sobre la lista sin anotar. Se fija en la suite `lesson videos` de
`src/data/content.test.ts`, junto a los demás (`:270-284`).

**Enfoque («la copia del programa que llamó a casa»):** después de E7 (V3), la analista de Meridian tiene una copia del
programa que el EDR vio en `ENG-WS-041` el 5 de marzo. El vídeo hace el triaje entero en el orden en que se trabaja:
antes de abrirla, no la sube a ningún sitio público (busca el hash); la detona en un sandbox propio; lee las dos mitades
del informe; separa a quién llama ella de lo que Windows hace solo; y mira qué campos la unen a sus parientes. Es lo que
pide la lección: leer el informe «con ojo de triaje» y separar lo del actor del ruido (`src/data/s3.ts:321`). HOLLOW
LANTERN, el equipo de infraestructura del adversario (`src/data/course-gcti.ts:57`), propone dos atajos que le
convienen: que la subas a la vista de todos y que te rindas porque tiene dominios de sobra. Una frase sitúa a quien no
vio V3: el 5 de marzo, ese programa llamó a casa desde un equipo de ingeniería de Meridian. Nada lleva fecha más allá de
esa línea de V3 (ni la búsqueda, ni la detonación, ni ningún bloqueo), como V9.

**Conceptos (3) y su imagen:**

| # | Concepto | Imagen que se mantiene | Tarjetas |
|---|---|---|---|
| 1 | Una muestra dirigida no se sube a un servicio público a la ligera: los atacantes vigilan si sus muestras aparecen, y si la ven pueden saber que los has descubierto y cambiar de infraestructura. Primero se busca el hash, que no sube el fichero; se sube solo si compensa el riesgo de avisarle (`src/data/s3.ts:316`; s3m2q3 y q10, `:551`) | Un coche raro aparcado en tu calle: buscas la matrícula en silencio; no le dejas una nota en el parabrisas, porque mañana puede aparcar en otra calle | «Muestra dirigida: busca el hash; subirla puede avisarle» |
| 2 | El informe tiene dos mitades y no es un veredicto. Estático: lo que se lee sin ejecutarla, lo que lleva escrito. Dinámico: detonarla, o sea, ejecutarla en el sandbox (una máquina aislada, de usar y tirar) y mirar qué hace. El sandbox lo apunta todo, también lo que Windows hace solo: de cinco hosts, dos son del actor y tres son ruido del sistema, y bloquear los cinco deja a toda la flota sin hora ni comprobación de conexión (`:292`, `:321`, `:348`; s3m2q1 y q4) | Un teléfono de prestado donde apuntas cada llamada: salen las del invitado y las que el propio teléfono hace solo (ponerse en hora, comprobar si hay cobertura). Si cortas todos los números, el teléfono se queda hasta sin hora | «Estático: sin ejecutar. Dinámico: detonar y observar» · «Antes de bloquear, separa al actor del ruido» |
| 3 | Lo que lleva escrito te habla de sus parientes. El hash es esta copia exacta (un byte distinto y ya es otro); el imphash, la lista de lo que pide a Windows, apunta a la familia por toolchain (apunta, no demuestra: con tablas de imports pequeñas o binarios empaquetados se repite en ficheros sin relación); el ssdeep mide el parecido y delata una variante recompilada; la ruta del PDB no siempre está, pero si otra muestra trae la misma, es un enlace fuerte al entorno del autor; la fecha de compilación la pone quien compila y vale poco como enlace (`:297-301`, `:329-332`, `:348`; s3m2q2 y q7) | Ropa a medida: el hash es esta prenda exacta (la «ropa» de V7, que se cambia en un minuto); la ropa nueva se delata por las mismas piezas, casi el mismo patrón y, a veces, **la etiqueta del taller** cosida en el cuello, por dentro. Es la imagen común de la ruta del PDB en V13, V14 y V15 | «Variante recompilada: ssdeep. Mismos imports: imphash» |

**Escenas:** seis, en tres capítulos (La muestra · Leer el informe · Para el examen).

| Escena | Cap. | s | Qué se ve | Qué se aprende · cues |
|---|---|---|---|---|
| s01-hook «La copia que llamó a casa» | I La muestra | 20 | Tira a media luz con las líneas del EDR de V3, tal cual y sin el campo `signed` (como V7): «05-03-2026 · 02:11:47Z · ENG-WS-041», `C:\ProgramData\UpdSvc\updsvc.exe`, `sha256=9f3a...e1` y, debajo, la conexión a `update-svc-cdn.com:443`; al lado, «Meridian Dynamics · aeroespacial». De la línea del hash se desprende una ficha, «muestra · SHA-256 `9f3a2c...e1`», que entra en una caja cerrada todavía apagada. Título «Lo que cuenta una muestra» hacia los 7 s (siempre antes de los 12), con «triaje de malware en sandbox» debajo. La promesa en tres chips: «sin avisarle · lo suyo y el ruido · sus parientes» | La promesa en los primeros 10 s y el puente con V3 en una sola frase (el 5 de marzo, ese programa llamó a casa desde un equipo de ingeniería de Meridian) · `edr, sample, title, promise` |
| s02-hash «Antes de abrirla» | I | 38 | La pantalla de un servicio público de análisis, genérico y sin marca («servicio público · decenas de antivirus»), con un botón «Subir muestra» que late. Mensaje interceptado. Respuesta: junto al botón, un ojo con «también puede mirar el atacante» y la cadena «si la ve · puede saber que lo has descubierto · cambia de dominios». La viñeta del coche: una calle con un coche aparcado; a la izquierda, una libreta con la matrícula («la buscas tú, en silencio»); a la derecha, tachada, una nota en el parabrisas («te he visto»). La búsqueda por hash: «buscar · `9f3a2c...e1`», con el chip «no sube el fichero», y el resultado, «sin resultados», a 60 px. Debajo, pequeño y en gris, la otra razón de la lección: «y lo que se sube, otros lo pueden descargar». La tarjeta, con la búsqueda ya quieta. Después, la caja cerrada de s01 se enciende: «sandbox interno de Meridian · máquina aislada, de usar y tirar» | No se sube a la ligera: se busca el hash, que no avisa a nadie, y la muestra se detona en casa. Nombres: hash (explicado antes: un código que sale del fichero y lo identifica) y sandbox. En voz, «nadie la ha subido **ahí**» (que no esté en un servicio no dice nada de los demás) y «la detonas», con su explicación (ejecutarla para ver qué hace), porque la tarjeta de s03 usa ese verbo · `upload, reply, car, lookup, no-hits, own-sandbox` · **intercept** |
| s03-mitades «Dos mitades» | I | 30 | El informe de la lección en extracto, con el rótulo «Informe de sandbox · extracto · GLASS VIPER stage-1 · MER-2026-023» y sin la línea `Signing cert`. Dos bandas: ESTÁTICO arriba (hash, imphash, ssdeep, fecha, PDB, imports) y DINÁMICO abajo (pipe, persistencia, hosts). La de arriba se ilumina y se atenúa enseguida con «la leemos luego». La de abajo, línea a línea: `schtasks /create /tn WindowsUpdateCheck` con «tarea para volver a arrancar»; el pipe `vc_pipe_4f8a1c9e` y, a su lado, en pequeño, el de E7 en V3, `vc_pipe_3a7f09c1`: el prefijo `vc_pipe_` en cian en los dos y los ocho caracteres finales en ámbar, con «mismo formato · otro número en cada ejecución» (solo en pantalla: la voz no lo comenta). Nombres: STATIC ANALYSIS · análisis estático y DYNAMIC ANALYSIS · análisis dinámico. La tarjeta, con las dos bandas ya quietas. Cierre del capítulo: las dos bandas con «lo que lleva escrito» y «lo que hace» | Estático, sin ejecutar; dinámico, detonar y mirar. La tarea, solo como lo que hace al ejecutarse en el sandbox; el pipe, solo en pantalla · `report, static, task, pipe, dynamic, wrap` |
| s04-llamadas «Cinco llamadas» | II Leer el informe | 48 | Se amplía la lista de hosts contactados, **sin** las anotaciones de la lección: cinco filas con su puerto (`update-svc-cdn.com:443`, `ocsp-verify-node.example:443`, `time.windows.com:123`, `ctldl.windowsupdate.com:80`, `www.msftconnecttest.com:80`). Pregunta para pensar, con la lista quieta. Respuesta: la viñeta del teléfono de prestado (un móvil y una libreta de llamadas: dos del invitado y tres que hace el propio teléfono, con un reloj, un escudo y un icono de cobertura). Dónde mirar, por pasos: dos filas se encienden en rosa, `update-svc-cdn.com` («su servidor de siempre · el de E7») y `ocsp-verify-node.example` («de repuesto»); las otras tres en gris, rotuladas en llano: «poner la hora», «certificados de confianza de Windows», «¿hay internet?», y encima «las hace Windows solo, con muestra o sin ella». Contrafactual: un candado sobre las cinco y, en un mapa de los equipos de Meridian, relojes en blanco y la conexión con interrogación: «gol en propia puerta». Se deshace y el candado queda solo sobre las dos rosas, sin fecha. La tarjeta. Después, el repuesto ampliado junto a las dos líneas de conexión de E7 en V3 (las dos a `update-svc-cdn.com`): «en la alerta de E7: no salía · lo ha dado el sandbox» | El sandbox lo apunta todo; el informe no es un veredicto; dos de cinco son del actor y bloquear los cinco es un gol en propia puerta. Además, el dinámico enseña infraestructura que la alerta no había visto · `hosts, phone, two, three, blackout, triage, spare` · **think** |
| s05-etiqueta «Lo que lleva escrito» | II | 58 | Mensaje interceptado, sobre las dos filas rosas de s04, que siguen con su candado. Respuesta: se vuelve a la banda ESTÁTICO. La viñeta de la ropa a medida: una prenda colgada, y cuatro cosas que se encienden al compás de la voz. Primero, la prenda entera en ámbar con `SHA-256 9f3a2c...e1` («esta prenda exacta · un byte y ya es otra»). Luego las piezas (botones, forro) junto a la línea `Imports` (`MapViewOfSection, CreateNamedPipeA, CreateProcessA`, o `NtMapViewOfSection` si Lidia acepta el cambio de la lección; ver decisiones) y `Imphash 1b8d4f2a... · comparte tabla de imports con 3 muestras previas`, con el rótulo «apunta a la familia». Luego el patrón de corte, superpuesto a otro casi igual, con `ssdeep · 94 % · variante de 2026-01`. Nombres IMPHASH y SSDEEP (fuzzy hashing). La tarjeta, con la prenda quieta. Después se da la vuelta al cuello y aparece **la etiqueta del taller** (el componente común a V13, V14 y V15), cosida por dentro: `D:\proj\cicada\loader\Release\ldr.pdb` en monoespaciada, sin resaltar ninguna parte, con «no siempre la lleva» y «si otra trae la misma: mismo taller · enlace fuerte». Nombre PDB PATH. Por último, `Compile time : 2026-02-19` con «la pone quien compila · a veces, falsa» y el chip «enlace débil». Cierre del capítulo: el dominio («se cambia en un rato») frente a la prenda nueva que se parece a la vieja | El hash es exacto y frágil; imphash y ssdeep apuntan a la familia y a la variante recompilada; el PDB, cuando está y se repite, une al autor; la fecha de compilación, poco. La voz dice la frase común de la etiqueta palabra por palabra (ver abajo) · `reply, garment, imports, imphash, ssdeep, label, pdb, date, close` · **intercept** |
| s06-recap «Tres reglas» | III Para el examen | 24 | Tres tarjetas de reglas, cada una con su viñeta en miniatura (el coche, el teléfono, la prenda); tarjeta final Alertópolis: «Tu turno: las preguntas de la lección» (s3m2, 10 preguntas) | Reflejos · `recap, rule-1, rule-2, rule-3, next, endcard` |

- **Tarjetas de examen** (dominio Collection), una por escena de s02 a s05, cada una seguida de al menos una frase (unos
  5 s de escena) antes de cambiar de escena:
  - «Muestra dirigida: busca el hash; subirla puede avisarle» (s02) (55)
  - «Estático: sin ejecutar. Dinámico: detonar y observar» (s03) (52)
  - «Antes de bloquear, separa al actor del ruido» (s04) (44)
  - «Variante recompilada: ssdeep. Mismos imports: imphash» (s05) (53)
- **Pregunta para pensar:** «Llamó a cinco sitios. ¿Bloqueas los cinco?» (s04) (42), con la lista de hosts sin anotar
  delante y `holdMs` 4500. Respuesta: no; dos son suyos, el servidor de siempre y uno de repuesto, y los otros tres los
  hace Windows solo (la hora, sus certificados de confianza y la prueba de conexión). Bloquearlos todos dejaría a todos
  los equipos de Meridian sin hora ni comprobación de conexión: el «autogol clásico» de la lección
  (`src/data/s3.ts:348`; el check de `:350-364`).
- **La frase común de la etiqueta del taller** (s05; la misma, palabra por palabra, que V14 dice en su s04; solo V15
  añade «cosida en el cuello»): «Al compilar, a veces se queda escrita dentro la carpeta donde se hizo. Es como la
  etiqueta del taller, cosida en el cuello, por dentro. No siempre la lleva. Pero si otra trae la misma, salen del mismo
  taller.» Después, el nombre: «Es la ruta del PDB». Nunca «la etiqueta» a secas (en V7 es el disfraz de la tarea,
  `video/attack-piramide/narration.json:77`), ni «no la puede quitar», ni «todas la llevan».
- **Mensajes interceptados** (HOLLOW LANTERN, `holdMs` 3500, uno por capítulo):
  - s02 (capítulo I): «Súbela a un servicio público. Cuantos más ojos, mejor.» (54). El error concreto que la narradora
    corrige: que publicar la muestra sale gratis. Más ojos, sí, y entre ellos pueden estar los suyos: los atacantes
    vigilan si sus muestras aparecen en público, y si la ven pueden saber que los has descubierto y cambiar de
    infraestructura (`src/data/s3.ts:316`; s3m2q3, `:443-452`). Con la ironía en el marco: quien lo propone es justo el
    equipo que cambiaría los dominios. Es la misma trampa que su «¿Por qué no vienes a verme?» de V4
    (`video/pivot-infra/narration.json:378`), ahora con la muestra en vez del servidor.
  - s05 (capítulo II): «Bloquea esos dos, analista. Tengo más esperando su turno.» (57). El error: que, como un dominio
    nuevo le sale barato, bloquear no sirve y cambiar de dominio le convierte en otro. La respuesta empieza por
    «Bloquearlos sigue valiendo: le obligas a gastar otro», porque s04 acaba justo bloqueando esos dos. Después le da la
    razón en el dato («un dominio lo cambia en un rato», como dice la lección: «rotar dominios es barato»,
    `src/data/s2.ts:895`) y se la quita en la conclusión: aunque cambie de dominio, la muestra sigue contándote de dónde
    viene. El imphash y el ssdeep la unen a muestras que ya tenías (`src/data/s3.ts:329-330`), y unos dominios distintos
    no rompen el grupo (la misma fila de `s2.ts:895`). Nunca que la muestra «encuentra» compilaciones futuras ni que te
    lleve a su próximo dominio. «Esperando su turno» encaja con los dominios que nacen en lote y se quedan dormidos de V4
    (`video/pivot-infra/narration.json:308`) sin enseñar ninguno.

  Los dos mantienen su voz de V4 y V8 (tutea, frases cortas, ironía, «analista»; registro §3) y no contradicen sus cuatro
  mensajes publicados. Ninguno marca el género de quien habla.
- **Cierre:** tres reglas y una sola tarea.
  1. Una muestra hecha a medida no se sube a la ligera: primero, su hash.
  2. En el informe, lo que Windows hace solo es ruido: sepáralo antes de bloquear.
  3. Para dar con sus parientes, imphash, ssdeep y la ruta del PDB; la fecha de compilación, no.

  Tarea: las preguntas de la lección (s3m2, 10 preguntas; las q1, q2, q3, q4, q7 y q10 tocan lo que cuenta el vídeo).
  No se manda a ningún laboratorio: ninguno de S3 practica s3m2 (ver «Laboratorios»).

**Se queda fuera** (y dónde está):
- **La firma de la muestra** y «firmado no es benigno»: `Signing cert` (`src/data/s3.ts:334`), el final del párrafo del
  triaje (`:348`) y las preguntas s3m2q6 (`:484-497`) y q9 (`:529-542`). Motivo: V3 enseña `signed=false` para el mismo
  hash (registro §5, punto 2); ver decisiones.
- **La evasión del sandbox** (la muestra que detecta la máquina virtual y no hace nada): s3m2 no la enseña y el plan no
  la pide (`docs/superpowers/plans/2026-09-25-lesson-videos.md:1524`). Solo sale en Security+
  (`src/data/secplus/sp4-part1.ts:134,141`) y en la pregunta de nivelación pl-s3q3
  (`src/data/placement-gcti-s3.ts:83-92`), que el vídeo no contesta.
- **El named pipe en voz:** sale solo en pantalla, en s03. Son dos ejecuciones de la misma compilación, así que no
  demuestran lo que dijo V3, que el patrón sigue ahí al recompilar (`video/diamond-e7/narration.json:97`).
- **Los vértices del diamante** de cada artefacto (el callout `:310`; s3m2q5 y q8, `:468-482`, `:514-527`): ya los contó
  V3 («de la muestra sacas el C2 que lleva escrito dentro», `video/diamond-e7/narration.json:255`).
- **El mutex único** del callout (`:310`): no está en el informe.
- **La segunda razón de OPSEC** (documentos internos al alcance de terceros, `:316`; s3m2q10, `:557`): solo en pantalla,
  en gris, en s02.
- **Qué hacer después con los indicadores** (normalizarlos, darles contexto y convertirlos en detecciones, `:392`): el
  vídeo se queda en «el informe no es un veredicto».
- **El ejemplo genérico de PDB** `C:\Users\kaz\dev\stage2\...` del último check (`:397`): es otro binario (registro §5,
  punto 22).
- **Los 14 dominios** de s3m2q4 (`:458`): bastan los cinco del informe.
- **El intervalo del beacon** (`jitter 60s`, `:340`): las anotaciones de la lista se sustituyen por rótulos en llano
  (registro §5, punto 3).

**Laboratorios:** ninguno de S3 practica s3m2, así que la tarea final son las preguntas de la lección. Los tres rozan algo
del vídeo y ninguno queda destripado:
- **Lab 3A** (Pivot Hunt, `src/data/labs.ts:98-113`; grafo en `:640-742`): el vídeo solo enseña `update-svc-cdn.com`, ya
  legible en V3 y V4 (registro §4), y `ocsp-verify-node.example`, que no está en el grafo. Ni `141.98.6.10`, ni el
  certificado, ni el correo de registro, ni ningún nombre del laboratorio.
- **Lab 3B** (YARA Forge, `src/data/labs.ts:114-124`; datos en `:765-843`; `src/components/labs/YaraLab.tsx`). Es la
  regla más estricta:
  - El vídeo no habla de YARA, ni de reglas, ni de qué cadenas sirven para una regla, ni de cadenas raras o comunes.
  - No enseña `vc_stage2.bin`, los bytes `{ 8B 45 FC 33 45 F8 8B 4D F4 }`, el user-agent, `kernel32.dll` ni
    `POST /api/v2/telemetry`.
  - No nombra `VC_Loader_v1.dll` ni `VC_Loader_v2.dll`, ni dice «variante 1» o «variante 2».
  - El PDB va con la frase común: «a veces se queda escrita», «no siempre la lleva», «si otra trae la misma». Es exacto
    (la ruta se puede quitar al compilar) y no destripa nada: el laboratorio ya imprime «raro» y «(solo variante 1)»
    junto a esa cadena (`src/data/labs.ts:775`; `src/components/labs/YaraLab.tsx:86-90`), y su solución está en otra
    cadena. Nunca «todas sus variantes la llevan», «no la puede quitar» ni que una búsqueda por el PDB encuentre la
    familia entera.
  - La ruta del PDB sale tal como la enseña la lección (`src/data/s3.ts:332`); el laboratorio ya la enseña como `$s1`
    (`labs.ts:771-776`).
  - La variante de enero del ssdeep no se relaciona con ninguna muestra del laboratorio.
  - El vídeo no dice que la muestra del informe sea la variante 1 «del incidente de Meridian» (`labs.ts:819`); eso sigue
    siendo solo para el registro (§7, V7).
- **Lab 3C** (CMF Builder, `src/data/labs.ts:125-135`; datos en `:394-445`): dos de sus casos tienen la respuesta
  «sandbox» (a qué C2 llama la muestra y qué persistencia crea, `:416-423`). El vídeo lo enseña porque lo dice la propia
  lección (`src/data/s3.ts:30`, `:292`, `:303`), pero nunca plantea qué fuente responde a qué pregunta ni dice qué
  responde el EDR (el caso de los 8.000 equipos, `labs.ts:426`). Las líneas de V3 de s01 son historia, no una respuesta.
- **Nivelación:** el vídeo no contesta pl-s3q3 (evasión) ni pl-s3q4 (compartir con el ISAC). pl-s3q12 (qué observable
  dura un año) tampoco: el pipe no se comenta en voz y, en pantalla, compara dos ejecuciones de la misma muestra, no
  recompilaciones.

**Canon nuevo que fija V15** (nada de esto estaba en los datos del curso; lo posterior debe respetarlo):
- **Sin fecha ni hora** (como V9), después de E7: ni la búsqueda del hash, ni la detonación, ni la decisión de bloquear
  llevan fecha. Las únicas horas en pantalla son las de V3 (`02:11:47Z` en s01 y las conexiones de `02:13:02Z` y
  `02:14:01Z` en s04).
- **La muestra del informe MER-2026-023 es la copia del programa que el EDR vio en `ENG-WS-041`** el 5-3
  (`C:\ProgramData\UpdSvc\updsvc.exe`, `9f3a...e1`; `video/diamond-e7/src/data/s03-victim.ts:25-32`). El registro ya
  decía que es la misma muestra (§3); V15 lo enseña en pantalla, con las dos grafías del hash, `9f3a...e1` en la tira
  de V3 y `9f3a2c...e1` en el informe. No se dice quién recogió la copia ni cuándo.
- **La búsqueda del hash** en un servicio público de análisis, sin nombre ni marca: «sin resultados». Meridian no sube
  la muestra. En voz, «nadie la ha subido ahí, lo normal en una hecha a medida»: no dice nada de otros servicios. Es
  compatible con que la familia ya se conozca (los vendors siguen a GLASS VIPER desde el 2025-11-03,
  `src/data/s4.ts:1023-1025`; el imphash la une a tres muestras previas, `src/data/s3.ts:329`): lo que no está en ese
  servicio es esta compilación exacta.
- **La detonación** en el sandbox interno de Meridian, la fila del CMF (`src/data/s3.ts:72`), rotulado «máquina aislada,
  de usar y tirar».
- **El pipe, en dos ejecuciones de la misma muestra:** `vc_pipe_4f8a1c9e` en el sandbox (`src/data/s3.ts:337`) y
  `vc_pipe_3a7f09c1` en E7 (`video/diamond-e7/src/data/s03-victim.ts:36-38`), juntos en pantalla: mismo formato
  `vc_pipe_%08x`, otro número en cada ejecución. Nada sobre recompilaciones.
- **La tarea `WindowsUpdateCheck`** sale solo como lo que la muestra hace en el sandbox. Nada dice que el 5-3 se creara
  en `ENG-WS-041` (V7 tampoco lo dice; registro §5, punto 1).
- **El C2 de repuesto** `ocsp-verify-node.example` no salía en las líneas de la alerta de E7 (V3 solo enseña dos
  conexiones a `update-svc-cdn.com`, `s03-victim.ts:42-45`): «lo ha dado el sandbox». No se dice si la red de Meridian
  llegó a hablar con él.
- **La decisión de triaje:** de los cinco hosts, los dos del actor llevan el candado; los tres de Windows, no. Sin
  fecha, y sin relación con E9 ni con el «last seen» del 2026-03-07 de `update-svc-cdn.com` (V4).
- **Dos mensajes nuevos de HOLLOW LANTERN**, sin fecha: «Súbela a un servicio público. Cuantos más ojos, mejor.» y
  «Bloquea esos dos, analista. Tengo más esperando su turno.» (`video/sandbox-muestra/narration.json`, s02 y s05).
- **Las imágenes:** la «ropa» sigue siendo el hash, como en V7. **La etiqueta del taller es la ruta del PDB**, la misma
  en V13, V14 y V15: un solo componente con la ruta en monoespaciada; en V15, cosida en el cuello de la prenda. Su frase
  en voz es común con V14 («no siempre la lleva» incluido). V15 no usa el «acento» (V3: el patrón del pipe; V7: nombres
  y rutas en disco), ni la llave (V4, V7), ni la carta (V8), ni los vecinos o el bloque de pisos (V4, V8), ni la «casa»
  (V13: Meridian), ni «la etiqueta» a secas (V7).
- Sin personas nuevas.

**No se toca:**
- El dosier de DEEP WELL (`src/data/course-gcti.ts:59`): ni certificados compartidos, ni `kazuo.tanji@`, ni «una sola
  organización».
- El dosier de BROKEN CHAIN (`src/data/course-gcti.ts:40`): ni «el mismo PDB en tres muestras», ni cuántas muestras
  comparten el PDB (registro §5, punto 11). Las «3 muestras previas» del imphash son de la lección (`src/data/s3.ts:329`)
  y no se relacionan con el PDB.
- Los dos loaders de s2m4 con el mismo PDB (`src/data/s2.ts:871-898`): es la demo de V14, que se graba en la misma
  sesión. V15 no enseña ningún acierto del PDB en otra muestra; dice qué significaría.
- `4c81...b3` y el árbol del 2-3 (V7): no salen. La fecha de compilación (2026-02-19) no se compara con ninguna otra
  compilación ni con ninguna fecha del caso (canon de V7, registro §7).
- El «cicada» de la ruta del PDB: ni se resalta ni se comenta. De dónde sale el nombre VELVET CICADA es un hallazgo del
  Lab 3A (`src/data/labs.ts:691`).
- La firma (registro §5, punto 2) y el intervalo del beacon (punto 3): no salen.
- Ningún servicio real: la pantalla de s02 es genérica y no imita la de VirusTotal, aunque la lección lo cite como
  ejemplo (`src/data/s3.ts:316`).
- No se dice qué pasó después del triaje: ni si E9 usó alguno de los dos hosts, ni por qué `update-svc-cdn.com` deja de
  verse el 7-3, ni que el atacante «no se enteró» por no subir la muestra.
- No se culpa a nadie de Meridian.

**Comprobación de límites** (perfil `capsula-yt`; caracteres y palabras contados con un script tras la revisión):
- Duración: suma 218 s; estimado ~250–255 s; renderizado previsto ~230–235 s; ventana 190–260. Sí, con el orden de
  recorte de «Duración» si el estimado pasa de 255 s.
- Capítulos: 3 (máximo 3). Sí.
- Conceptos clave: 3 (2–3). Sí.
- Tarjetas: 4 (3–5), una por escena de s02 a s05, ninguna en s06, todas con `"objective": "Collection"`. Caracteres: 55,
  52, 44 y 53 (máximo 58). Sí.
- Pregunta para pensar: 1, en s04; 42 caracteres (máximo 48); `holdMs` 4500. Sí.
- Mensajes interceptados: 2 (1–2), en los capítulos I (s02) y II (s05), ninguno en la escena final; 54 y 57 caracteres
  (máximo 70); `holdMs` 3500 (2500–4500). Sí.
- `video.json` lleva `"adversary": "HOLLOW LANTERN"`. Sí.
- Sin flechas, marcas de verificación, viñetas ni emoji en la narración, las tarjetas y los mensajes (las flechas de las
  anotaciones de la lección no salen). Sí.
- `wordBudget` por escena: 54, 103, 81, 130, 157 y 65; el borrador de comprobación da 41, 102, 67, 122, 155 y 62
  palabras (549), ninguna frase de más de 19 (máximo 22). Sí.
- Título antes de los 12 s (hacia los 7 s, tras la primera frase de 16 palabras). Sí.

---

### V16 · sp3m4 · Principal · «Zonas de seguridad: dónde va cada cosa y qué pasa si falla»

> Propuesta del 2026-10-04; aprobada el 2026-10-05 con las opciones recomendadas (Lidia delegó las decisiones). La versión vigente de escenas y guion será
> `video/zonas-halden/storyboard.json` + `narration.json`; qué se quedó fuera, en `video/zonas-halden/out/script-notes.md`.
>
> Primer vídeo de la sección sp3 y **primera aparición de BLIND ARCHITECT**. Comparte arco con V17 (sp3m5), que lo
> continúa la semana siguiente con una sola frase de puente; cada uno se entiende sin el otro. Decisiones, riesgos y la
> pregunta de la voz, en `docs/reviews/2026-10-05-fichas-tanda3/decisiones.md` (apartado V16).
>
> **Revisada el 2026-10-05** (exactitud y canon, `revision-V16-V17.md`): la tarjeta de las puertas lleva «cierra» escrito;
> el rótulo de fail-closed ya no dice «no pasa nada»; el plano de antes se acota a cuatro VLAN sin filtro entre ellas, con
> el cortafuegos interno de V1 (`fw-int01`, deducido) para Operaciones, Contratistas y el SSH de Administración; el hueco
> de los 38 GB queda explicado como deducción, aceptada en decisiones; la ventanilla de la DMZ tiene bandeja y alguien
> que mira; el jump server es la puerta de la sala de mandos de la red, no la sala de control; la VLAN «aparta el
> tráfico»; la OT es «crítica, pero frágil»; mensaje de s02 y tarjeta del tap reescritos; «más sensores»; el bloque es
> `t: 'video'`.

- **Carpeta:** `zonas-halden` · perfil `principal-yt` (380–600 s renderizados; objetivo ~8:30, sin rellenar) · objetivo
  **3.2** (cabecera de la lección, `src/data/secplus/sp3-part2.ts:298-299`, y su primera frase, `:316`) · adversario
  **BLIND ARCHITECT** (sección sp3, jefe LOAD BEARING, `src/data/secplus/sections.ts:81-88`), tres mensajes
  interceptados, su primera aparición en pantalla · voz `recording/lidia` con
  `"recording": { "tempo": 1.08, "maxPauseMs": 250 }` · voz del adversario: **voz nueva**,
  `sapi/Microsoft Helena` con `"rate": -2` y un efecto nuevo, `megafonia`. Es la misma voz que NULL CIPHER (V11,
  Helena a `rate` 0 con `cifrado`), así que se distinguen por el efecto y el ritmo, y BLIND ARCHITECT no tiene voz de
  reserva: la reserva `machine` es solo de V11. Qué es cada cosa y la pregunta del género, en decisiones · música
  `Go On Going - Stayloose.mp3` (la única pista de la biblioteca, `video/engine/music/LICENSES.md:13`) · en
  `video.json`, `"lesson": "sp3m4"` y `"adversary": "BLIND ARCHITECT"`.
- **Etiquetas** (`video.json` → `"tags"`): security zones, zonas de seguridad, DMZ, device placement, attack surface,
  jump server, bastion host, fail-open, fail-closed, fail-safe, fail-secure, inline, tap, Security+.
- **Efectos (`sfx`):** los automáticos del motor (mensaje, tarjetas, capítulos) y cuatro momentos: `passes` («error»,
  el paquete cruza la garita vacía), `dmz` («whoosh», el portal se muda), `closes` («lock», fail-closed en gestión) y
  `drop` («block», el equipo en línea descarta el paquete).
- **Duración:** suma de `s` **472 s** (10 escenas); `wordBudget` = `s` × 2,7, unas 1.270 palabras. El estimado del motor
  sale ~1,2 veces la suma cuando el guion llena el presupuesto (V6: 520 s de escenas estimaban ~620 s; V10: 220 s,
  273 s), así que **~565 s estimados**, y con el ritmo de Lidia (85–93 % del estimado en V5b, V6, V7) **unos 480–525 s
  renderizados (8:00–8:45)**. Los dos extremos conocidos de render frente a suma (0,89 en V5, 1,22 en V4) dan 420–576 s:
  dentro de 380–600 por los dos lados. No se rellena. Si el primer borrador estima más de 590 s, se recorta primero
  s08 (a 30 s) y después s03; si queda cerca de 420 s, se alargan s07 (las dos decisiones) y s09.
- **Inserción:** en `src/data/secplus/sp3-part2.ts`, lección sp3m4, entre el último check («A new detection appliance is
  connected to a switch mirror port…», bloque `:464-478`) y el párrafo final «Con las zonas dibujadas, los dispositivos
  colocados y el modo de fallo decidido…» (`:479-482`), como bloque `t: 'video'` con su id de YouTube, su póster y su
  transcripción propios en `public/`, precedido de una línea: «Antes de pasar a
  los cortafuegos, júntalo todo en el puerto: zonas, colocación y qué pasa cuando un control se cae». Nada del vídeo va
  antes que la lección: las zonas, la DMZ y el jump server están en `:318-379`, los modos de fallo y las puertas en
  `:380-405` (la frase de las puertas, `:383`), inline/tap y active/passive en `:406-410` y el jump server otra vez en el
  catálogo (`:414`). El párrafo final ya hace de puente a sp3m5 y a V17. Se fija en la suite `lesson videos` de
  `src/data/content.test.ts` (`:248`), con su línea `toBe('sp3m4')` en el test que ata cada vídeo a su lección
  (`:267-284`), y sin compartir póster ni transcripción con otro vídeo (`:313-326`).
- **Enfoque («el plano de la servilleta»):** lunes 16-11, el puerto rehace el plano de su red y lo dibujas tú, la
  analista («la primera analista de seguridad», `src/data/tracks.ts:149`). Es la misión 3 del curso («rediseña la
  segmentación», `src/data/secplus/labs-sp3.ts:20-22`) y lo que anuncia la lección («ese plano es el que vas a
  rediseñar», `sp3-part2.ts:316`). No hay ataque: hay decisiones de diseño, y en cada una BLIND ARCHITECT propone el
  atajo «sencillo» que deja un camino de más. Lo de hoy, en pantalla: cuatro VLAN con nombre que el router central deja
  hablar entre sí, y Operaciones detrás del cortafuegos interno (el de V1); el portal público dentro de la red de
  oficinas; y la administración entrando en gestión desde cada puesto. Lo que se aprueba el viernes 20-11: seis zonas, el portal en la DMZ,
  una sola puerta para administrar, un modo de fallo decidido para cada control en línea y sensores que solo miran. Sin
  frase de puente: es el primer vídeo de sp3, y quien siga el curso en orden lo verá **antes** que cualquier vídeo de sp4
  aunque Halden lo feche después, así que no remite a ninguno («como ya viste…») ni nombra el caso de septiembre ni la
  noche del 21-10.

**Conceptos (5) y su imagen:**

Las cinco imágenes salen del propio puerto por fuera (vallas, garitas, ventanilla, sala de mandos, barrera, cámara): una
por concepto, todas del mismo mundo, para que la red se vea como el recinto que ya conoce quien trabaja allí.

| # | Concepto | Imagen que se mantiene | Tarjetas |
|---|---|---|---|
| 1 | Zona de seguridad (security zone): sistemas con la misma confianza y la misma política, y en cada frontera un control que decide qué pasa. Una VLAN con nombre que el router deja hablar con todas no es una zona: aparta el tráfico, pero si el router lo pasa todo de una a otra, nadie decide qué cruza. Lo que se gana: lo que cae en una zona se queda en ella. Cada servicio publicado, cada excepción y cada camino de más agrandan la superficie de ataque (attack surface), y las zonas la recortan | El puerto visto desde arriba: áreas con valla y una garita en cada paso. Una valla con la garita vacía y la barrera levantada no separa nada | «Zona: misma confianza y un control en cada frontera» · «Separar en zonas reduce la attack surface» |
| 2 | Colocación y DMZ: lo que Internet tiene que alcanzar va en la DMZ, entre Internet y la red interna, y desde ahí nunca abre conexiones libres hacia dentro, solo las imprescindibles y con regla (`:337`). Un servidor público dentro de la red interna es un atajo: quien lo rompa ya está dentro | La ventanilla de atención a navieras y transportistas, metida en la valla: se atiende desde fuera, no tiene puerta a las oficinas, solo una bandeja para pasar papeles, y detrás hay alguien que mira cada uno. Nadie cruza por ella | «Lo que Internet debe alcanzar, a la DMZ; nunca dentro» |
| 3 | Jump server (jump box, bastion host): un solo servidor endurecido, con MFA y sesión grabada, desde el que se administra todo; la zona de gestión solo le responde a él (`:355`, `:414`). Va en la zona de gestión, no en la DMZ: publicado, el único punto de control sería el único blanco desde Internet (`:377`) | La sala de mandos de la red (no la sala de control de Operaciones, que es otra cosa y otra zona) con una sola puerta: un torno con tarjeta y PIN, y todo queda apuntado y grabado | «Jump server: el único camino para administrar» |
| 4 | Modos de fallo. Todo control en el camino del tráfico se cae algún día. Fail-open deja pasar sin inspeccionar (gana la disponibilidad); fail-closed, o fail-secure, lo para todo (gana la seguridad). Ninguno es «el bueno»: decide lo que sale más caro. Y su primo físico, que el examen mezcla: una puerta fail-safe se abre al irse la luz para que salga la gente; una fail-secure se queda bloqueada para proteger lo que guarda (`:383`) | La barrera de la garita en un corte de luz: se queda arriba (pasan todos sin mirar) o abajo (no pasa nadie). Y la salida de emergencia, que se abre | «Fail-open gana disponibilidad; fail-closed, seguridad» · «Sin luz: fail-safe abre por la gente; fail-secure cierra» |
| 5 | Inline y active frente a tap y passive. Inline: el tráfico atraviesa el equipo; tap o puerto espejo: recibe una copia. Active interviene (corta, bloquea, reescribe); passive mira, registra y avisa. Para bloquear hacen falta las dos cosas, se llame como se llame el aparato. Y el modo de fallo solo se decide en lo que va en línea: un sensor pasivo que se cae no corta nada, te deja a ciegas (`:389`, `:409`) | La cámara de la valla: ve pasar a todos, avisa, y no baja ninguna barrera (la misma cámara con la que V1 explica el IDS, `video/capas-halden/narration.json:215`) | «Bloquear exige inline y active; en un tap, solo alerta» |

**Escenas:** diez, en cinco capítulos (El plano · Vallas con control · Dónde va cada cosa · Cuando un control falla · Ver o
parar). Como en V6, el cierre vive dentro del último capítulo de contenido, así que el mensaje de cierre del capítulo V va
en s09.

| Escena | Cap. | s | Qué se ve | Qué se aprende · cues |
|---|---|---|---|---|
| s01-hook «El plano de la servilleta» | I El plano | 40 | Sello «16-11 · lunes · rediseño de la red». Una servilleta con el plano de hoy, dibujado a mano: Internet, `fw-perimetro-01` y el router central `rt-core`; colgando de él, cuatro cajas de VLAN con su nombre: Oficinas, Administración, Producción y Pruebas; y aparte, Operaciones, detrás de un «cortafuegos interno» (sin «el único»). Entre el router y las cuatro cajas, una etiqueta: «entre estas VLAN: el router no filtra». El portal, atenuado dentro de Oficinas (lo recoge s04). Al acabar la primera frase, título «Zonas de seguridad» (hacia los 7–9 s, siempre antes de los 12) con «security zones · device placement · failure modes» debajo, y la promesa en tres chips: «qué va junto · dónde va cada control · qué pasa si falla». Entra la etiqueta del adversario: «BLIND ARCHITECT · sección 3», con una línea: «vive de los planos con atajos» | La promesa en los primeros 10 s: un plano con nombres no es todavía un plano con zonas · `napkin, title, promise, adversary` |
| s02-garita «Una valla con la garita vacía» | II Vallas con control | 52 | El puerto desde arriba: la calle, la terminal de pasajeros, las oficinas, el muelle y la sala de control de Operaciones (como un área más, no como la puerta de s05), cada área con su valla y una garita en el paso; una acreditación pasa la garita de las oficinas y no la del muelle. Rótulo: «zona: misma confianza dentro · un control en cada paso». Vuelve la servilleta: un paquete sale de Oficinas, cruza `rt-core` sin pararse y llega a Producción, y la valla del dibujo se queda con la garita vacía y la barrera levantada. Mensaje interceptado. Respuesta: «la VLAN aparta el tráfico; nadie decide qué cruza» y «una VLAN sin control no es una zona»; aparece un control en la frontera entre las dos y el mismo paquete se para, salvo que una regla lo deje pasar. Nombre SECURITY ZONE | Una zona es confianza y política compartidas, con un control en cada frontera; sin ese control, una VLAN es una etiqueta · `port, checkpoint, packet, passes, empty-gate, control, zone` · **intercept** |
| s03-alcance «Hasta dónde llega un portátil» | II | 48 | «Si cae un portátil de Oficinas, ¿hasta dónde llega?»: desde un portátil de Oficinas se encienden líneas a Administración, Producción, Pruebas y el portal; Operaciones queda fuera, detrás del cortafuegos interno. El plan nuevo: seis zonas en fila con su confianza, como la tabla de la lección (`sp3-part2.ts:325-363`) pero **sin su contenido**: Internet («ninguna»), DMZ («baja»), interna («media»), OT («crítica, pero frágil», `:348`), gestión («máxima») e invitados («ninguna»), con una garita entre cada dos. El mismo portátil: «alcanza: su zona y lo que una regla permita». Nombre ATTACK SURFACE y tres chips que la agrandan: «cada servicio publicado · cada excepción · cada camino de más». Cierre del capítulo | Las zonas recortan lo que alcanza un equipo caído: eso es reducir la superficie de ataque · `laptop, reach, six, reach-after, surface, wrap` |
| s04-dmz «La ventanilla» | III Dónde va cada cosa | 54 | Se amplía el portal: `hpa-portal-web-01` («portal público de reservas de atraque»), dentro de Oficinas, junto a los puestos de Importación. En `fw-perimetro-01`, su regla, en columnas: «origen: Internet · destino: `hpa-portal-web-01` · tcp/443 · permitir». Mensaje interceptado. Respuesta: una línea punteada de Internet al portal y del portal a los puestos de al lado, «si alguien lo rompe, ya está dentro». La imagen: la ventanilla de atención a navieras y transportistas, metida en la valla, sin puerta a las oficinas: solo una bandeja para pasar papeles, con alguien detrás que mira cada uno. El portal se muda a una caja nueva entre el perímetro y la red interna, con dos reglas: «de Internet a la DMZ: solo 443, al portal» · «de la DMZ a la red interna: solo lo imprescindible, con regla; nada más». Nombre DMZ | Lo que Internet tiene que alcanzar va en la DMZ, y desde ahí no abre caminos libres hacia dentro · `portal, rule-in, inside, counter, dmz, dmz-rules` · **intercept** |
| s05-jump «Una sola puerta» | III | 54 | Hoy: «Administración a gestión · SSH · desde cada puesto» (la regla 5 de V1, un ALLOW que cruza el cortafuegos interno, `video/capas-halden/src/scenes/S05Rules.tsx:24`; sin citar V1 en voz); de varios puestos de Administración, sin nombre, sale una línea cada uno hasta las interfaces de gestión: «un camino por puesto». La imagen: la sala de mandos de la red con una sola puerta, un torno con tarjeta y PIN, y un registro con cámara. El plan: «zona de gestión: solo responde al jump server»; la caja del jump server, «endurecido · MFA · sesión grabada», y todas las líneas convergen en ella. Pregunta para pensar, con dos botones: «DMZ» y «gestión». Respuesta: «gestión»; la DMZ, tachada: «lo alcanzaría cualquiera desde Internet · el único control, convertido en el único blanco». Nombre JUMP SERVER, con «jump box · bastion host» debajo. Cierre del capítulo | Un solo camino endurecido y vigilado para administrar, dentro de la zona de gestión · `today, many-paths, room, jump, converge, answer, bastion, wrap` · **think** |
| s06-barrera «Cuando se va la luz» | IV Cuando un control falla | 48 | «Lo que va en el camino del tráfico acabará fallando», con tres chips: «memoria · firmas corruptas · corriente». La barrera de la garita en un corte de luz, con dos finales: arriba (los camiones pasan y nadie mira) y abajo (cola de camiones, no pasa nadie). Nombres FAIL-OPEN («pasa sin inspeccionar · gana la disponibilidad») y FAIL-CLOSED («no pasa ni un camión · gana la seguridad», con «también: fail-secure» en pequeño). Mensaje interceptado. Respuesta: «¿siempre? Depende de qué sale más caro» | Qué hace un control en línea cuando se cae · `inline, causes, barrier, open, closed, depends` · **intercept** |
| s07-decidir «Dos controles, dos respuestas» | IV | 54 | Dos equipos en línea del plan. Primero, el cortafuegos nuevo delante de la zona de gestión. Pregunta para pensar, con dos botones: «abre» y «cierra». Respuesta: cierra; detrás están los mandos de cada switch y cada cortafuegos, un rato sin administrar sale más barato que dejarlos sin inspección, y el tráfico del puerto no pasa por ahí. Rótulo FAIL-CLOSED. Después, el equipo en línea que va a entrar en la red que mueve las bombas de las esclusas (el ejemplo de la lección, `sp3-part2.ts:391-405`), con la nota de Operaciones: «si se paran las bombas, se puede inundar un muelle»; rótulo «fail-open, o fuera del camino», y debajo «el riesgo se cubre separando y vigilando». Barra final: «ninguno es el bueno: decide lo que cuesta más» | La misma pregunta, dos respuestas, según lo que esté en juego · `mgmt-fw, closes, why, pumps, flood, opens, cost` · **think** |
| s08-puertas «La salida de emergencia» | IV | 38 | La misma pregunta en una puerta: corte de luz en el edificio de oficinas. La salida de emergencia se abre (FAIL-SAFE · «primero, la gente»); la puerta de la sala de servidores se queda bloqueada (FAIL-SECURE · «primero, lo que guarda»). Rótulo con la frase de la lección: «en las personas manda la vida; en los datos, la protección» (`:383`). Cierre del capítulo | El primo físico que el examen mezcla: puertas fail-safe y fail-secure · `power-cut, exit, server-room, life, wrap` |
| s09-camara «La cámara no baja la barrera» | V Ver o parar | 48 | El plan pone más sensores, en taps y puertos espejo (no los estrena: V1 ya tiene uno detrás del cortafuegos el 3-9, `video/capas-halden/narration.json:215`). La imagen: la cámara de la valla, que ve pasar a todos y no baja la barrera. Dos ejes en cruz: «dónde está: inline (el tráfico lo atraviesa) · tap (recibe una copia)» y «qué puede hacer: active (corta, bloquea, reescribe) · passive (mira, registra, avisa)». Un paquete por el tap: alerta, y sigue su camino; el mismo paquete por un equipo inline y active: descartado. Tachado: «un IPS en un puerto espejo no para nada, aunque se llame IPS». El sensor del tap se apaga: «punto ciego · no corta nada»; rótulo «el modo de fallo solo se decide en lo que va en línea». Nombres INLINE / TAP y ACTIVE / PASSIVE. Al final, el sello del plan: «plan de zonas · aprobado en el comité de cambios · 20-11 · Infraestructura (L. Ferrer) · por fases desde el 1-12» | Para bloquear hay que estar en el camino y poder actuar; lo pasivo solo ve, y si falla deja a ciegas, no corta · `sensors, camera, axes, alert-passes, drop, blind, only-inline, approved` |
| s10-recap «Tres reglas» | V | 36 | Tres tarjetas de reglas, una cada vez, con su icono (valla, ventanilla, barrera); tarjeta final Alertópolis: «Tu turno: el laboratorio Zone Defense» (spl3a, 12 sistemas y cuatro zonas) | Reflejos · `recap, rule-1, rule-2, rule-3, next, endcard` |

- **Tarjetas de examen** (objetivo 3.2), una por escena en s02–s06, s08 y s09; ninguna en s01, en s07 (la escena de la
  pregunta, con dos decisiones que comparar) ni en el cierre:
  - «Zona: misma confianza y un control en cada frontera» (s02) (51)
  - «Separar en zonas reduce la attack surface» (s03) (41)
  - «Lo que Internet debe alcanzar, a la DMZ; nunca dentro» (s04) (53)
  - «Jump server: el único camino para administrar» (s05) (45)
  - «Fail-open gana disponibilidad; fail-closed, seguridad» (s06) (53)
  - «Sin luz: fail-safe abre por la gente; fail-secure cierra» (s08) (56). El motivo de la puerta que cierra (lo que
    guarda) va en el rótulo de s08; en la tarjeta no, porque «por el activo» tras una coma se leía como «abre por el
    activo», y «(activo)» se confundiría con el eje active/passive de s09.
  - «Bloquear exige inline y active; en un tap, solo alerta» (s09) (54)
- **Preguntas para pensar** (`holdMs` 4500):
  - «¿El jump server, en la DMZ o en gestión?» (s05) (40). Respuesta: en la zona de gestión. La DMZ tienta porque se
    llega desde cualquier sitio, pero entonces cualquiera de Internet podría llamar a esa puerta: el único punto de
    control se convierte en el único blanco (la explicación del check de la lección, `sp3-part2.ts:377`).
  - «Cae el cortafuegos de gestión. ¿Abre o cierra?» (s07) (46). Respuesta: cierra. Detrás están los mandos de toda la
    red, y un rato sin poder administrar cuesta menos que dejarlos sin inspección; además, el tráfico del puerto no pasa
    por ese cortafuegos, así que la operación no se para. Justo después, el contraejemplo: el equipo de las bombas se
    queda abierto, o fuera del camino, porque ahí lo peligroso es parar (`:394`, `:403`).
- **Mensajes interceptados** (BLIND ARCHITECT, `holdMs` ~3800; uno por capítulo en II, III y IV, ninguno en el V):
  - s02: «¿Cortafuegos entre VLAN? Ya están separadas. Menos es más.» (58). El error que corrige la narradora: creer
    que la VLAN ya basta. La VLAN aparta el tráfico, pero si el router lo pasa todo de una a otra, nadie decide qué
    cruza: es una valla con la garita vacía. Una zona necesita un control en cada frontera (`sp3-part2.ts:321`; el fallo
    típico de la segmentación lógica, «reglas permisivas», `src/data/secplus/sp3-part1.ts:346`).
  - s04: «Deja el portal dentro, con su regla de entrada. Menos es más.» (61). El error: publicar un servidor de Internet
    desde la red interna. La regla de entrada abre el portal a cualquiera, y quien lo rompa aparece al lado de los
    puestos de Importación. En la DMZ, quien lo rompa se queda en la ventanilla (`:321`, `:337`).
  - s06: «Si se cae, que deje pasar: el puerto no se para. Menos es más.» (62). El error: una sola respuesta para todos
    los controles. Dejar pasar es lo correcto donde parar es el peligro (las bombas, s07) y lo peor delante de lo que
    guarda los mandos de la red (gestión, s07); se decide control a control, por lo que cuesta más (`:383`).
- **Cierre:** tres reglas y una sola tarea.
  1. Una zona es una valla con alguien en la garita: la misma confianza dentro y un control en cada paso.
  2. Lo que Internet tiene que alcanzar, a la DMZ; y para administrar, una sola puerta: el jump server.
  3. Cada control en línea decide qué hace al caerse según lo que cueste más; lo que solo mira una copia, ni corta ni para.

  Tarea: el laboratorio spl3a «Zone Defense», la misión 3 («rediseña la segmentación»): doce sistemas, nueve que el
  vídeo no toca y tres que ya da la tabla de la lección.
- **Se queda fuera** (sigue en la lección, que quien ve el vídeo ya ha leído, porque va al final):
  - Forward y reverse proxy (`sp3-part2.ts:414`, tabla `:426-437`; quiz q5): el reverse proxy es además uno de los
    sistemas del laboratorio.
  - El load balancer (`:414`, `:450-455`; quiz q7).
  - El catálogo de sensores (taps, colectores de flujos, agentes de log, `:414`, `:456-461`): solo sale la cámara de s09.
  - Los cuatro atajos de conectividad de la lección (`:321`): el cable de un contratista en una sala de reuniones, el
    punto de acceso que llega al aparcamiento, el módem 4G que dejó un integrador y el túnel de acceso remoto sin MFA.
    Los cuatro rozan canon que no se toca (contratistas neutros y el final de sp5; la MFA del 30-11); el vídeo usa sus
    propios atajos: la VLAN sin control, el portal dentro y la administración directa.
  - Lo que contiene cada zona en la tabla (`:325-363`) y la zona de invitados más allá de su rótulo: es el laboratorio.
  - Las frases de traducción de la nota de examen (`:389`), el IPS inline en modo solo detección (`:409`) y el falso
    positivo que corta tráfico legítimo (`:448`).
- **Laboratorios:** spl3a «Zone Defense» clasifica doce sistemas en DMZ, red interna, OT y gestión
  (`src/data/secplus/labs-sp3.ts:9-23`, ítems `:61-122`), y es la tarea final. El vídeo enseña la regla y **no toca nueve
  de los doce**: el SFTP, el reverse proxy, el servidor de ficheros, la aplicación de RRHH, la impresión, el PLC de la
  grúa del muelle 3, la HMI de las compuertas, la pasarela de sensores y la consola de copias (por eso tampoco sale
  `backup01`). **Coloca tres casi literalmente**, y los tres ya los da la lección, cuya tabla reparte los doce por filas
  (`sp3-part2.ts:335-361`), antes del vídeo:
  - El portal de reservas en la DMZ (s04), frente al ítem de la web pública (`labs-sp3.ts:63-65`): «un servidor
    accesible desde internet va a la DMZ» (`sp3-part2.ts:321`) y «Web pública del puerto» en la fila de la DMZ (`:335`).
  - El jump server en gestión (s05), el ítem `:108-110`: lo responde el check de la lección (`:365-379`).
  - Las interfaces de gestión detrás del jump server (s05), el ítem `:113-116`: fila de gestión de la tabla (`:353-355`).

  spl3b (protección de datos) y spl3c (orden de recuperación) no tienen nada que ver. La frase de la misión «todo cuelga
  del mismo switch» (`labs-sp3.ts:21`) no se repite (ver «No se toca»).

**Canon nuevo que fija V16** (nada de esto estaba en los datos del curso; lo posterior debe respetarlo):
- **2026-11-16 (lunes): empieza el rediseño de la red.** Lo dibuja la analista, en segunda persona y sin nombre: todas las
  vías de entrada de cada zona, como pide la lección (`sp3-part2.ts:321`).
- **La red antes del plan** (en pantalla, nunca en voz): `fw-perimetro-01` en el perímetro (cola tranquila del SIEM,
  `video/siem/src/data/s08-triage.ts:14`); dentro, el router central `rt-core` (`video/siem/src/data/s02-collect.ts:78`).
  **Entre las VLAN de Oficinas, Administración, Producción y Pruebas, el router central no filtra.** Oficinas y
  Administración son **nuevas** como VLAN (Administración ya era un origen de las reglas de V1); Producción sale en el SIEM
  (`video/siem/src/scenes/parts/s10-contain/Topology.tsx:70`) y Pruebas en V5b
  (`video/ir-halden-pruebas/src/data/s03-simulacro.ts:10`). **El cortafuegos interno** (el de V1, «Cortafuegos · Zona
  Operaciones», `video/capas-halden/src/scenes/S05Rules.tsx:88`, y, deducido, el `fw-int01` del SIEM, «Firewall
  interno», `video/siem/src/data/s03-normalize.ts:66-88` y `s06-fatigue.ts:32`) tenía reglas para Operaciones, la salida
  de Contratistas y el SSH de Administración a gestión (`S05Rules.tsx:20-26`). Al registro, deducido: `srv-gis01`
  (`10.20.9.14`) queda detrás de ese cortafuegos. Es la versión de la «red plana» de la lección y del jefe que cabe con lo
  que V1 y el SIEM ya enseñan, y encaja con la q6 de la lección («the public port website, the customs office
  workstations… share one flat VLAN», `sp3-part2.ts:564`): el portal junto a los puestos de Importación, la oficina que
  trata con aduanas (`video/iam-halden/src/data/s03-leaver.ts:7`); lo único que V16 no dibuja son los PLC.
- **El hueco de los 38 GB queda explicado (deducido de V16, aceptado en decisiones):** la regla 3 vivía en el cortafuegos
  interno, y la VLAN de Producción, la de `srv-tc-app03`, cuelga de `rt-core` y sale por `fw-perimetro-01`, que el arreglo
  de V1 no tocó; así que la salida de Producción no pasaba por el cortafuegos de Operaciones. Va al registro como
  deducción; **ningún vídeo lo dice en voz ni lo enseña** (registro, «Por dónde salieron los 38 GB», `glass-harbor.md:281-283`).
- **`hpa-portal-web-01` vivía en la VLAN de Oficinas**, junto a los puestos de Importación, publicado con una regla de
  entrada 443 en `fw-perimetro-01` (**nuevo**; encaja con «internet-facing, sin WAF delante»,
  `src/data/secplus/sp4-part3.ts:57`, y con «la web pública y la ofimática de aduanas» de `sp3-part2.ts:316`). Precisa el
  «nada delante» de V10 (`docs/superpowers/plans/2026-09-25-lesson-videos.md:1477`), cuya voz congelada solo dice
  «Filtro, ninguno» (rama de V10, `video/logs-halden/narration.json:178`): al
  registro, «nada que mire dentro de la petición web (ni WAF ni filtro); delante, solo la regla 443 del cortafuegos del
  perímetro (V16)». Dos notas más, solo para el registro: con el portal en la sede, el «enlace de 1 Gb/s · 100 %» del
  21-10 (`video/logs-halden/src/data/s05-amp.ts:25`) era el del puerto (deducido); y ningún vídeo relaciona el FINDING #0147 ni el
  traversal del 21-10 con el caso de septiembre ni con nada dentro de la red.
- **Administración entraba en las interfaces de gestión por SSH desde cada puesto** (deducido): es la regla 5 de V1, un
  ALLOW que cruza el cortafuegos interno (`S05Rules.tsx:24`); que sea la forma de administrar de todo el puerto es
  lectura de V16. Sin puestos con nombre.
- **2026-11-20 (viernes): el comité de cambios aprueba el plan de zonas.** Lo ejecuta Infraestructura (L. Ferrer, ya en el
  registro, dueño de CHG-2041, `src/data/secplus/sp1-part3.ts:71`), **por fases desde el 2026-12-01 (martes)**. Seis zonas
  como las de la lección (Internet, DMZ, interna, OT, gestión, invitados); el portal a la DMZ; la zona de gestión solo
  alcanzable desde un jump server (endurecido, MFA, sesión grabada); un cortafuegos nuevo delante de gestión, fail-closed;
  el equipo en línea de la red de las bombas de las esclusas, fail-open (aviso de Operaciones: parar las bombas puede
  inundar un muelle, el check de `sp3-part2.ts:394`); más sensores pasivos en taps y puertos espejo (V1 ya tenía uno
  detrás del cortafuegos, `video/capas-halden/narration.json:215`).
- **Por qué el 1-12, fuera de la ventana 16–27-11:** así el jump server con MFA nunca está en marcha antes del 30-11, la MFA
  del proveedor de identidad (V10), y el vídeo no tiene que decir de dónde sale su segundo factor. Ningún hecho del vídeo
  pasa después del 20-11; el 1-12 solo sale en pequeño, en el sello de s09.
- **BLIND ARCHITECT, primera aparición.** Tutea a la analista y habla en frases cortas, como SILENT PAGER y RED MARROW,
  pero su registro es el del arquitecto con prisa: propone atajos de diseño que quitan una pared o ahorran un paso, y
  cierra siempre con «Menos es más.». La narradora presenta a BLIND ARCHITECT con lo que anuncia el jefe de sp3 antes
  del combate (`sections.ts:85`): vive de los planos con atajos y le basta con que falle un pilar. Ningún texto del vídeo
  marca su género («Es BLIND ARCHITECT»). El registro anota, como hizo con RED MARROW, que el dosier ya lo escribe en
  femenino («BLIND ARCHITECT derrotada», `sections.ts:87`) y qué voz lleva; si esa voz cuenta como canon, lo decide Lidia
  (decisiones).
- **Comprobado contra la cronología:** 16-11 lunes, 20-11 viernes y 1-12 martes (Node). Ninguna fecha choca con las del
  registro, V5 (11-9 a 31-10), V5b (2-10 a 16-10), V6 (19-10 a 28-10) ni V10 (20-21-10, MFA 30-11). No hay personas
  nuevas: L. Ferrer ya está en el registro, y la analista no tiene nombre.

**No se toca:**
- El caso `IR-2026-0147` (3-9 y 4-9): ni sus equipos (`OPS-WS-*`, `ADM-WS-*`, `srv-tc-app03`), ni la 01:52, ni los 38 GB.
  El plano de antes explica por dónde salieron (ver «Canon nuevo»), pero eso va al registro como deducción: ninguna
  pantalla junta Producción con la salida ni la voz lo dice. El vídeo no dice que las zonas habrían frenado nada en
  septiembre: en pantalla no hay ningún movimiento lateral fechado, y la VLAN de cuarentena del SIEM no sale.
- La noche del 20 al 21-10 (V10) y el FINDING #0147 del 1-9 (`sp4-part3.ts:55`): del portal solo se dice dónde estaba y a
  dónde va; en voz, «el portal».
- La MFA del proveedor de identidad (Sistemas, 30-11): el jump server lleva MFA como requisito del diseño, sin fecha de
  puesta en marcha anterior al 1-12, y el vídeo no dice nada del IdP.
- El dosier de sp3 (`sections.ts:87`): ningún camino de la wifi de invitados (ni de ninguna otra parte) a los PLC de las
  esclusas; ni «punto único de fallo» en voz ni en pantalla, tampoco en boca de BLIND ARCHITECT; ni «derrotada».
- **Cómo está conectada hoy la OT.** La lección se contradice (sus PLC de las esclusas están air-gapped en
  `sp3-part1.ts:394`, pero cuelgan del mismo switch que la web en `sp3-part2.ts:316` y en la misión,
  `labs-sp3.ts:21`; registro §5, punto 13). El plano de antes no tiene caja de OT, el plan nuevo la dibuja como zona sin
  decir de dónde viene, y el equipo de las bombas va «en la red de las bombas», sin línea hacia ninguna VLAN.
- Contratistas, integradores y proveedores: ninguno en ningún atajo (ver «Se queda fuera»); la caja «Contratistas» de las
  reglas de V1 no sale.
- El terreno de NULL CIPHER (sp1): certificados, claves, badges y cambios sin aprobar. El plan pasa por el comité de
  cambios y se aprueba; BLIND ARCHITECT nunca habla de cifrado.
- No se culpa a nadie de la red de antes: «nadie lo decidió», como los permisos de V6; el plano creció así.

**Comprobación de límites** (perfil `principal-yt`; recuento con Node, `[...texto].length`):
- Duración: suma 472 s; render esperado 480–525 s, extremos 420–576 s: dentro de 380–600.
- Capítulos: 5 (máximo 5). Escenas: 10.
- Conceptos clave: 5 (4–6), cada uno con como mucho dos tarjetas.
- Tarjetas de examen: 7 (5–8), de 41 a 56 caracteres (máximo 58), una por escena como mucho y ninguna en s10.
- Preguntas para pensar: 2 (exactamente 2), de 40 y 46 caracteres (máximo 48), `holdMs` 4500.
- Mensajes interceptados: 3 (2–4), uno por capítulo (II, III y IV) y ninguno en la escena final; de 58, 61 y 62
  caracteres (máximo 70); `holdMs` ~3800 (2500–4500).
- Recontado tras la revisión del 2026-10-05.
- Sin flechas, marcas de verificación, viñetas ni emoji en tarjetas, preguntas ni mensajes (comprobado con un patrón de
  Unicode).
- El título entra antes de los 12 s (s01, tras la primera frase).
- Ningún identificador en voz: `fw-perimetro-01`, `rt-core` y `hpa-portal-web-01` solo en pantalla; la voz dice «el
  cortafuegos del perímetro», «el router central» y «el portal».

---

### V17 · sp3m5 · Principal · «Por dónde se entra: 802.1X, VPN e IPSec»

> Propuesta del 2026-10-04; aprobada el 2026-10-05 con las opciones recomendadas (Lidia delegó las decisiones). La versión vigente de escenas y guion será
> `video/fronteras-halden/storyboard.json` + `narration.json`; qué se quedó fuera, en
> `video/fronteras-halden/out/script-notes.md`.
>
> Continúa V16 (sp3m4) una semana después, con una sola frase de puente: las zonas ya están dibujadas y ahora toca lo que
> llega a ellas desde fuera de la valla. Segunda aparición de BLIND ARCHITECT, con la voz que se decida en V16. Decisiones
> y riesgos, en `docs/reviews/2026-10-05-fichas-tanda3/decisiones.md` (apartado V17).
>
> **Revisada el 2026-10-05** (exactitud y canon, `revision-V16-V17.md`): la frase de puente dice que el puerto «aprobó»
> dividir su red; s04 enseña 802.1X como será desde el 1-12, nunca funcionando antes; el túnel entre la sede y la terminal
> queda como canon nuevo que «encaja» con el SIEM, sin deducir dónde está `srv-tc-app03`; la imagen de 802.1X pasa al
> control de la puerta del recinto (la garita queda para V16); el pasillo cubierto cruza la calle; «VLAN Oficinas» es una
> nota de la analista, no salida de consola; la razón del hotel es la red que solo deja web, nunca el NAT; el bloque es
> `t: 'video'`.

- **Carpeta:** `fronteras-halden` · perfil `principal-yt` (380–600 s renderizados; objetivo ~8:30, sin rellenar) ·
  objetivo **3.2** (cabecera de la lección, `src/data/secplus/sp3-part3.ts:4`, y su primera frase, `:21`) · adversario
  **BLIND ARCHITECT** (`src/data/secplus/sections.ts:81-88`), tres mensajes interceptados · voz `recording/lidia` con
  `"recording": { "tempo": 1.08, "maxPauseMs": 250 }` · voz del adversario: la de V16 (`sapi/Microsoft Helena` con
  `"rate": -2` y `megafonia`; ver las decisiones de V16) · música `Go On Going - Stayloose.mp3`
  (`video/engine/music/LICENSES.md:13`) · en `video.json`, `"lesson": "sp3m5"` y `"adversary": "BLIND ARCHITECT"`.
- **Etiquetas** (`video.json` → `"tags"`): 802.1X, EAP, EAP-TLS, RADIUS, port security, VPN, site-to-site,
  remote access, IPSec, AH, ESP, tunnel mode, transport mode, TLS VPN, full tunnel, split tunnel, Security+.
- **Efectos (`sfx`):** los automáticos del motor y cuatro momentos: `lease` («ding», la toma da IP sin preguntar),
  `reject` («block», Access-Reject), `box` («lock», ESP cierra la caja) e `ipsec-blocked` («error», el hotel corta IPSec).
- **Duración:** suma de `s` **476 s** (10 escenas); `wordBudget` = `s` × 2,7, unas 1.285 palabras. Con la misma cuenta
  que V16: **~570 s estimados** si el guion llena el presupuesto, y **unos 485–530 s renderizados (8:05–8:50)** con el
  ritmo de Lidia; los extremos conocidos (0,89 y 1,22) dan 424–581 s, dentro de 380–600 por los dos lados. No se rellena.
  Si el estimado pasa de 590 s, se recorta primero s06 (AH y ESP caben en 40 s) y después s04; si queda cerca de 424 s,
  se alargan s03 (el intercambio, paso a paso) y s09.
- **Inserción:** en `src/data/secplus/sp3-part3.ts`, lección sp3m5, entre el check del túnel completo («…every website
  visited from a corporate laptop is filtered and logged…», bloque `:205-214`) y la «Nota de examen: cada pista apunta a
  un control concreto» (`:215-220`), como bloque `t: 'video'` con su id de YouTube, su póster y su transcripción propios
  en `public/`, precedido de una línea, como V6: «Antes de la nota de examen,
  recórrelo en el puerto: quién se enchufa, cómo se unen dos sedes y cómo entra quien está fuera». Todo lo que enseña el
  vídeo va antes en la lección: 802.1X y EAP en `:69-120`, las VPN y los túneles en `:121-149`, IPSec y TLS en `:150-153`
  y la tabla en `:154-204`. La nota de examen lo remata, y además recoge lo que el vídeo deja fuera (WAF, UTM, NGFW,
  SD-WAN, SASE). Se fija en la suite `lesson videos` de `src/data/content.test.ts` (`:248`), con su línea
  `toBe('sp3m5')` en el test que ata cada vídeo a su lección (`:267-284`).
- **Enfoque («tres caminos hacia dentro»):** semana del 23 al 27-11. La semana anterior el puerto aprobó su plan de zonas
  (V16), que se ejecuta por fases desde el 1-12; las vallas ya están en el plano, y ahora la analista revisa lo que llega a ellas desde fuera: un cable en una
  toma, otra sede y una persona lejos. Tres escenas de trabajo, ningún incidente: una prueba suya en una toma libre, la
  revisión del túnel que ya une la sede con la terminal de contenedores y la configuración de la VPN de acceso remoto.
  BLIND ARCHITECT propone un atajo de diseño en cada camino. Frase de puente para quien no vio V16: «La semana pasada, el
  puerto aprobó dividir su red en zonas, cada una con su control.» (16 palabras). Nada de lo que se decide en V17 funciona
  antes del 1-12. El vídeo no habla de cómo se inicia sesión en la VPN (ni
  factores ni MFA) ni enseña el nombre de su servidor.

**Conceptos (5) y su imagen:**

| # | Concepto | Imagen que se mantiene | Tarjetas |
|---|---|---|---|
| 1 | 802.1X (port-based network access control): el puerto del switch, o la asociación wifi, se queda cerrado y solo deja pasar la autenticación hasta que el equipo demuestra quién es. Tres papeles: supplicant (el equipo que quiere entrar), authenticator (el switch, que transmite y obedece pero no decide) y authentication server (RADIUS, que decide). Con un sí, el puerto se abre y RADIUS puede asignarle la VLAN de su zona; con un no, sigue cerrado o cae a una VLAN de cuarentena, solo para arreglarse. Lo que viaja es EAP, un marco que lleva el método: EAP-TLS, con certificado en el equipo y en el servidor, es el más fuerte (`sp3-part3.ts:72`, `:78-104`) | El control de la puerta del recinto (la entrada, no una valla entre zonas, que es la garita de V16): el conductor enseña su acreditación; el vigilante no decide, llama a la oficina de acreditaciones, que mira la lista y contesta, y él solo abre o no. Con EAP-TLS, la oficina también enseña la suya | «Supplicant pide, authenticator transmite, RADIUS decide» · «802.1X con certificados en los dos lados: EAP-TLS» |
| 2 | Site-to-site frente a remote access: la site-to-site se monta una vez entre dos pasarelas y cifra sin que los equipos de cada lado instalen nada ni sepan que existe; la remote access la abre una persona desde su portátil, con un cliente (`:124`) | Un pasillo cubierto que cruza la calle (una calle que no es tuya, como Internet) entre dos edificios, y que usa cualquiera sin pensarlo, frente a una lancha que pides tú cada vez y que solo te lleva a ti | «Site-to-site: entre pasarelas; remote access: con cliente» |
| 3 | IPSec por dentro: trabaja en la capa de red y protege paquetes IP enteros. AH da integridad y autenticación del origen, pero no cifra; ESP añade la confidencialidad y es el que se usa. Modo transporte: cifra solo la carga y deja la cabecera original, de equipo a equipo; modo túnel: mete el paquete entero en uno nuevo, de pasarela a pasarela, que es el de una site-to-site (`:152`, tabla `:184-186`) | Un envío. AH es una bolsa transparente con precinto: sabes si la abrieron, pero todos ven qué lleva; ESP, una caja cerrada y precintada. En modo transporte, la carga va tapada y el camión enseña su matrícula; en modo túnel, el camión entero va dentro de un contenedor que solo dice de qué pasarela a qué pasarela | «AH: integridad sin cifrar; ESP añade confidencialidad» · «Modo túnel, entre pasarelas; transporte, entre equipos» |
| 4 | TLS para el acceso remoto: va por el 443 como cualquier web, así que cruza NAT, proxies y redes que cortan todo lo demás; IPSec necesita sus propios protocolos (ESP, e IKE por UDP 500 y 4500) y una red que solo deja salir web, y por un proxy, los bloquea (la razón es esa, no el NAT: ESP cruza un NAT encapsulado en UDP 4500). Por eso las VPN de acceso remoto suelen ir sobre TLS, y la del puerto también (la «VPN SSL» de CHG-2041, `src/data/secplus/sp1-part3.ts:74`) (`sp3-part3.ts:152`, quiz q5, `:295`) | El hotel con una sola puerta abierta, la de la web: TLS sale por ella; IPSec llama a otra, que está cerrada | «Red que solo deja pasar web: VPN sobre TLS» |
| 5 | Full tunnel frente a split tunnel: con el completo, todo el tráfico del portátil entra en el túnel y pasa por el filtrado web, el DLP y los registros del puerto, a cambio de más latencia y más ancho de banda en la sede; con el dividido, solo lo del puerto va por el túnel y el resto sale directo, sin inspección ni registro, y el portátil hace de puente entre una Internet sin vigilar y la red interna (`:124`, `:130-148`) | La aduana del puerto: con túnel completo, todo lo que entra y sale del portátil pasa por ella; con el dividido, solo lo del trabajo, y el portátil se queda con un pie a cada lado de la valla | «Full tunnel: todo el tráfico pasa por tu inspección» |

La imagen del concepto 2 es un pasillo, no un puente, a propósito: la lección dice que el portátil en túnel dividido «hace
de puente» (`:124`), y dos puentes con sentidos distintos en el mismo vídeo se confundirían.

**Escenas:** diez, en cinco capítulos (Por dónde se entra · El enchufe · Otra sede, la misma red · Desde fuera · Para el
examen).

| Escena | Cap. | s | Qué se ve | Qué se aprende · cues |
|---|---|---|---|---|
| s01-hook «Tres caminos hacia dentro» | I Por dónde se entra | 40 | El plano de zonas de V16, pequeño, con el sello «aprobado · 20-11» (frase de puente). Alrededor se encienden tres caminos, cada uno con su icono: una toma de pared, otra sede (la terminal de contenedores) y un portátil en un hotel. Título «Por dónde se entra» (hacia los 8–10 s, siempre antes de los 12) con «802.1X · VPN · IPSec» debajo, y la promesa en tres chips: «quién se enchufa · cómo se unen dos sedes · cómo entra quien está fuera». Vuelve la etiqueta «BLIND ARCHITECT · sección 3» | El puente con V16 en una frase y la promesa en los primeros 10 s · `plan, bridge, title, promise, paths, adversary` |
| s02-toma «Una toma en la sala de formación» | II El enchufe | 46 | «23-11 · lunes · 09:40 · sala de formación, planta de oficinas». Conectas `ptl-pruebas-02` a una toma libre de la pared; una salida de consola: «enlace: arriba» · «DHCP: 10.20.6.140 · 3 s»; aparte, como nota de la analista, «VLAN Oficinas» (el portátil ve su dirección, no su VLAN), y el rótulo «nadie ha preguntado quién es». Mensaje interceptado. Respuesta: la planta con salas de reuniones, visitas y tomas libres, «estar dentro del edificio no dice quién eres»; y el portátil, ya en la VLAN de Oficinas, la que el plan convierte en la zona interna a partir del 1-12 (el plan aún no está en marcha) | El problema que resuelve 802.1X: una toma que abre a cualquiera · `room, plug, lease, nobody, inside` · **intercept** |
| s03-8021x «Tres papeles en la puerta» | II | 56 | Tres carriles, como el diagrama de la lección (`sp3-part3.ts:78-104`): «equipo · supplicant», «switch de acceso · authenticator» y «RADIUS · authentication server». El puerto empieza «cerrado · solo pasa la autenticación (EAPOL)». Paso a paso, al compás de la voz y con lo anterior atenuado: el equipo pide entrar, el switch le pasa la petición a RADIUS, RADIUS la comprueba contra el directorio y contesta. La imagen: el control de la puerta del recinto, el conductor con su acreditación y el vigilante al teléfono con la oficina de acreditaciones. Pregunta para pensar, con dos botones: «el switch» y «RADIUS». Respuesta: RADIUS; el switch transmite y obedece. Nombre 802.1X, con «port-based network access control» debajo | El puerto se queda cerrado hasta demostrar quién eres; tres papeles, y decide el servidor · `lanes, closed, ask, relay, check, decides, gate, dot1x` · **think** |
| s04-eap «Sí, no o cuarentena» | II | 46 | Lo que viaja entre ellos: EAP, «el marco, no el método», con dos fichas: «EAP-TLS · certificado en el equipo y en el servidor · el más fuerte» y «PEAP · EAP-TTLS · credenciales dentro de un túnel TLS». Una etiqueta fija en toda la escena: «con 802.1X · así será desde el 1-12» (hoy no funciona). Dos finales: Access-Accept («puerto abierto · y la VLAN de su zona», con las zonas del plan de V16 dibujadas como plan) y Access-Reject («puerto cerrado · o VLAN de cuarentena, solo para arreglarse»). Un portátil que nadie ha dado de alta, en una toma con 802.1X: reject. La decisión, en una línea: «802.1X en los switches de acceso de la planta de oficinas · Infraestructura · desde el 1-12». Cierre del capítulo | EAP lleva el método, EAP-TLS pide certificados en los dos lados, y qué pasa con un sí o un no · `eap, methods, eaptls, accept, zone-vlan, reject, quarantine, wrap` |
| s05-sedes «Un pasillo y una lancha» | III Otra sede, la misma red | 50 | «25-11 · miércoles · revisión del túnel entre la sede y la terminal». Las dos sedes, la sede y la terminal de contenedores, unidas a través de Internet por un túnel entre sus dos pasarelas (la fila de la tabla de la lección, `sp3-part3.ts:184-186`); los equipos de cada lado: «no instalan nada · no saben que existe». La imagen: el pasillo cubierto que cruza la calle entre dos edificios. Al lado, un portátil con su cliente que abre su propio túnel: la lancha. Nombres SITE-TO-SITE VPN y REMOTE ACCESS VPN | Unir dos sedes se hace una vez, entre pasarelas; una persona lleva su cliente · `two-sites, gateways, transparent, corridor, client, launch, names` |
| s06-ah-esp «Precinto o caja cerrada» | III | 50 | La configuración del túnel, como en una consola: «protocolo: ESP · modo: túnel · extremos: pasarela de la sede, pasarela de la terminal» (sin nombres de equipo). IPSec, rotulado «capa de red · paquetes IP enteros». En el menú de protocolos, dos opciones: AH («integridad y origen · sin cifrar») y ESP («además, confidencialidad · el que se usa»). La imagen: una bolsa transparente con precinto (se nota si la abren; se ve qué lleva) y la misma carga en una caja cerrada y precintada | AH no cifra; ESP sí · `config, layer3, ah, seal, esp, box` |
| s07-modos «El camión dentro del contenedor» | III | 48 | Mensaje interceptado. Respuesta, dos esquemas: modo transporte, la carga cifrada y la cabecera original a la vista («de equipo a equipo»); modo túnel, el paquete entero, cabecera incluida, dentro de uno nuevo que solo dice «pasarela de la sede · pasarela de la terminal» («de pasarela a pasarela»). La imagen: la carga tapada en un camión con la matrícula a la vista, frente al camión entero dentro de un contenedor. Rótulo final: «el túnel se queda en modo túnel». Cierre del capítulo | Transporte, para dos equipos que hablan entre sí; túnel, para unir pasarelas · `transport, plates, tunnel, container, keep, wrap` · **intercept** |
| s08-hotel «Desde un hotel» | IV Desde fuera | 48 | «Acceso remoto del puerto · VPN sobre TLS · 443/tcp», sin nombre de servidor. Un portátil del puerto, de alguien de viaje, en la red de un hotel que solo deja salir web, y por un proxy. Pregunta para pensar, con dos botones: «IPSec» y «TLS». Respuesta: TLS, que sale por el 443 como cualquier página; IPSec, tachado, con lo que necesita en pequeño: «ESP · protocolo 50» e «IKE · UDP 500 y 4500», que una red que solo deja web corta (la voz da esa razón, nunca el NAT). Nombre TLS VPN | En una red que solo deja pasar web, la VPN de acceso remoto va sobre TLS · `remote, hotel, web-only, tls, ipsec-blocked, why` · **think** |
| s09-tunel «Un pie a cada lado» | IV | 56 | La VPN de acceso remoto, hoy: «túnel dividido». Mensaje interceptado. Los dos esquemas de la lección (`sp3-part3.ts:130-148`), uno cada vez: FULL TUNNEL, todo por el túnel y por la sede, «filtrado web · DLP · registros del SOC», con su precio, «más latencia · más ancho de banda en la sede»; SPLIT TUNNEL, solo lo del puerto por el túnel y el resto «directo · sin inspección · sin DLP · sin registro», con el portátil dibujado con un pie a cada lado de la valla: «hace de puente entre Internet sin vigilar y la red interna». La imagen: la aduana del puerto. La decisión: «portátiles del puerto: túnel completo · Sistemas». Al final, el sello: «aprobado · comité de cambios · 27-11 · desde el 1-12, con las fases del plan de zonas». Cierre del capítulo | Túnel completo: todo pasa por tu inspección; el dividido gana rendimiento y deja un puente sin vigilar · `today-split, full, inspect, price, split, bridge, decision, approved, wrap` · **intercept** |
| s10-recap «Tres reglas» | V Para el examen | 36 | Tres tarjetas de reglas, una cada vez, con su icono (puerta del recinto, contenedor, aduana); tarjeta final Alertópolis: «Tu turno: las preguntas de la lección» (sp3m5, 8 preguntas) | Reflejos · `recap, rule-1, rule-2, rule-3, next, endcard` |

- **Tarjetas de examen** (objetivo 3.2), una por escena de s03 a s09; ninguna en s01, s02 ni el cierre:
  - «Supplicant pide, authenticator transmite, RADIUS decide» (s03) (55)
  - «802.1X con certificados en los dos lados: EAP-TLS» (s04) (49)
  - «Site-to-site: entre pasarelas; remote access: con cliente» (s05) (57)
  - «AH: integridad sin cifrar; ESP añade confidencialidad» (s06) (53)
  - «Modo túnel, entre pasarelas; transporte, entre equipos» (s07) (54)
  - «Red que solo deja pasar web: VPN sobre TLS» (s08) (42)
  - «Full tunnel: todo el tráfico pasa por tu inspección» (s09) (51)
- **Preguntas para pensar** (`holdMs` 4500):
  - «¿Quién decide: el switch o el servidor RADIUS?» (s03) (46). Llega con los tres carriles ya dibujados. Respuesta:
    RADIUS. El switch es el authenticator: le pasa la petición al servidor y abre o cierra el puerto según le digan,
    pero no decide nada (`sp3-part3.ts:72`, `:104`; es la trampa de la q2, `:250`).
  - «La red del hotel solo deja web. ¿IPSec o TLS?» (s08) (45). Respuesta: TLS, porque va por el 443 como cualquier página
    y cruza el proxy y el NAT del hotel; IPSec necesita sus propios protocolos, que esa red corta (`:152`, `:295`).
- **Mensajes interceptados** (BLIND ARCHITECT, `holdMs` ~3800; uno por capítulo en II, III y IV, ninguno en el V):
  - s02: «¿Cerrar tomas? Quien llega al enchufe ya es de casa. Menos es más.» (66). El error que corrige la narradora:
    fiarse de quien está dentro del edificio. Hay salas de reuniones, visitas y tomas libres, y una toma no sabe quién se
    enchufa; con 802.1X se queda cerrada hasta que RADIUS dice quién es (`sp3-part3.ts:72`; el check de la sala de
    reuniones, `:109`).
  - s07: «Entre las dos sedes, modo transporte: menos cabeceras. Menos es más.» (68). El error: elegir el modo por lo que
    pesa la cabecera. El modo transporte deja la cabecera original y sirve entre dos equipos que hablan entre sí; entre
    dos pasarelas que protegen todo lo que tienen detrás, el modo túnel mete el paquete entero, con sus direcciones
    internas, en uno nuevo de pasarela a pasarela (`:152`, tabla `:184-186`).
  - s09: «Túnel dividido para todos: va más rápido. Menos es más.» (55). El error: medirlo solo por el rendimiento. Va más
    rápido porque lo que sale directo no pasa por el filtrado, el DLP ni los registros del puerto, y el portátil hace de
    puente entre esa Internet sin vigilar y la red interna (`:124`, `:140-148`; quiz q3, `:256-265`).
- **Cierre:** tres reglas y una sola tarea.
  1. Una toma no se abre hasta que alguien decide quién eres: el switch transmite y RADIUS decide.
  2. Dos sedes se unen una vez, entre pasarelas, con ESP y en modo túnel; una persona, con su cliente, y por TLS si la red
     solo deja web.
  3. Si todo tiene que pasar por tu inspección, túnel completo; el dividido deja el portátil con un pie a cada lado.

  Tarea: las 8 preguntas de la lección sp3m5 (las q2, q3, q5 y q7 tocan lo que cuenta el vídeo; ningún laboratorio de sp3
  practica 802.1X ni las VPN).
- **Se queda fuera** (sigue en la lección):
  - Los tipos de cortafuegos, WAF, UTM, NGFW y el filtrado de capa 4 frente a capa 7 (`sp3-part3.ts:21`, tabla `:24-53`,
    check del WAF `:54-68`; quiz q1, q6 y q8). Dan para su propio vídeo (ver decisiones).
  - SD-WAN y SASE (`:152`, tabla `:193-202`; quiz q4).
  - PEAP y EAP-TTLS, EAPOL, ESP como protocolo 50 e IKE por UDP 500 y 4500: solo en pantalla.
  - El check del visitante en la sala de reuniones el día de una licitación (`:106-120`): el vídeo usa una prueba de la
    analista, no repite el caso.
- **Laboratorios:** ninguno de sp3 toca 802.1X ni las VPN (spl3a zonas, spl3b protección de datos, spl3c orden de
  recuperación; `src/data/secplus/labs-sp3.ts`), así que no hay solución que destripar, y la tarea final son las
  preguntas. Dos precauciones fuera de la sección:
  - spl1c clasifica «Encrypt all bulk traffic inside a site-to-site VPN tunnel» como cifrado simétrico
    (`src/data/secplus/labs.ts:197-200`): el vídeo no dice con qué tipo de clave cifra ESP.
  - spl2a tiene un contratista de mantenimiento de grúas con credenciales de la VPN (`src/data/secplus/labs-sp2.ts:100`):
    quien se conecta desde el hotel es «alguien del puerto de viaje», nunca de mantenimiento ni de un proveedor.

**Canon nuevo que fija V17** (nada de esto estaba en los datos del curso; lo posterior debe respetarlo):
- **2026-11-23 (lunes), 09:40: la prueba de la toma.** La analista conecta `ptl-pruebas-02` (el portátil de pruebas del
  SIEM y del simulacro de V5b, `video/siem/src/data/s04-enrich.ts:77`, `video/ir-halden-pruebas/src/data/s03-simulacro.ts:11`)
  a una toma libre de la **sala de formación de la planta de oficinas** (lugar nuevo) y recibe en 3 s una dirección de
  la VLAN Oficinas, `10.20.6.140` (deducido: la subred de `a.soto`, 10.20.6.52, `video/siem/src/data/s03-normalize.ts:54-60`;
  la `.140` no la usa ningún archivo), sin que nadie le pregunte quién es. Es una prueba suya, no un incidente: nadie más
  se enchufa.
- **Las tomas de la planta de oficinas no pedían 802.1X.** El vídeo no dice dónde está el NAC que V1 enseña (el portátil
  de contratista que acaba en una VLAN de cuarentena, `video/capas-halden/src/scenes/S10Data.tsx:268-281`) ni lo
  contradice: solo que esta toma no preguntaba.
- **2026-11-25 (miércoles): revisión del túnel que ya une la sede con la terminal de contenedores.** Site-to-site entre sus
  dos pasarelas, IPSec con ESP en modo túnel, como la fila de la lección (`sp3-part3.ts:184-186`); se queda como está.
  **Ya existía (sin fecha de creación)**; encaja con el SIEM, que enseña la sede y la terminal dentro de la misma red
  interna (`10.20.0.0/16`, `video/siem/src/data/s07-tuning.ts:40`), y con la q7 de la lección, que no tiene fecha
  (`sp3-part3.ts:316`). Sin nombres de pasarela. Para el registro: la VLAN de Producción, la de `srv-tc-app03`, está en
  la sede (V16); la terminal de contenedores es otra sede, unida por este túnel; qué equipos hay físicamente en la
  terminal no consta. Las «nueve terminales pequeñas» con circuitos dedicados de la q4 (`sp3-part3.ts:271`) son otras.
- **La VPN de acceso remoto del puerto va sobre TLS, por el 443** (la «VPN SSL» de CHG-2041, `sp1-part3.ts:74`), y **hasta
  el plan era de túnel dividido** (nuevo). Nada dice que se escapara nada por él.
- **2026-11-27 (viernes): el comité de cambios aprueba** 802.1X en los switches de acceso de la planta de oficinas
  (Infraestructura) y el túnel completo para los portátiles del puerto (Sistemas), los dos **desde el 2026-12-01**, con
  las fases del plan de zonas de V16. Ninguno toca cómo se inicia sesión en la VPN.
- **BLIND ARCHITECT, segunda aparición**, con el registro y la firma de V16 («Menos es más.»).
- **Comprobado contra la cronología:** 23-11 lunes, 25-11 miércoles, 27-11 viernes y 1-12 martes (Node). Ninguna fecha
  choca con las del registro, V5, V5b, V6, V10 ni V16 (16-11 y 20-11). No hay personas nuevas: «alguien del puerto de
  viaje» no tiene nombre ni área.

**No se toca:**
- **Cómo se entra en la VPN:** ni sus factores (contraseña y pregunta secreta, el check sin fecha de
  `src/data/secplus/sp4-part4.ts:452`), ni MFA, ni el 30-11 (V10). Tampoco el nombre de su servidor
  (`vpn.puerto-halden.example`, `video/siem/src/data/s08-triage.ts:13`): no sale, para no ahondar en el choque de dominios
  públicos (registro §5, punto 2), como hizo V6 con el IdP. La fila «Inicios de sesión fallidos en la VPN» del SIEM sigue
  siendo ruido de fondo.
- El NAC de V1 y su portátil de contratista; ningún contratista, técnico de mantenimiento ni proveedor en ninguna
  escena (dosier de RED MARROW, `sections.ts:68`; final de sp5, `:125`).
- Ningún certificado concreto del puerto ni el estado de su PKI: EAP-TLS sale como concepto. Es el terreno de NULL CIPHER
  (el certificado raíz autofirmado de su dosier, `sections.ts:49`) y de V11–V12. BLIND ARCHITECT no habla de cifrado: su
  mensaje de s07 va del modo, no de AH ni ESP.
- El caso `IR-2026-0147`: el túnel de la sede a la terminal no se relaciona con la 01:52 ni con los 38 GB (cuya salida
  solo explica, como deducción para el registro, el plano de V16); el vídeo no dice por qué ni desde cuándo están unidas
  las dos redes.
- **Ninguna pantalla enseña 802.1X ni el túnel completo funcionando antes del 1-12**: s04 lleva la etiqueta «así será
  desde el 1-12», y la prueba del 23-11 es la única toma real.
- El dosier de sp3 (`sections.ts:87`) y la conexión de la OT (como en V16).
- La noche del 21-10 y el portal (V10): no salen.
- Ningún hecho después del 27-11; el 1-12 solo sale en el sello de s09.

**Comprobación de límites** (perfil `principal-yt`; recuento con Node, `[...texto].length`):
- Duración: suma 476 s; render esperado 485–530 s, extremos 424–581 s: dentro de 380–600.
- Capítulos: 5 (máximo 5). Escenas: 10.
- Conceptos clave: 5 (4–6), cada uno con como mucho dos tarjetas.
- Tarjetas de examen: 7 (5–8), de 42 a 57 caracteres (máximo 58), una por escena como mucho y ninguna en s10.
- Preguntas para pensar: 2 (exactamente 2), de 46 y 45 caracteres (máximo 48), `holdMs` 4500.
- Mensajes interceptados: 3 (2–4), uno por capítulo (II, III y IV) y ninguno en la escena final; de 66, 68 y 55
  caracteres (máximo 70); `holdMs` ~3800 (2500–4500).
- Sin flechas, marcas de verificación, viñetas ni emoji en tarjetas, preguntas ni mensajes (comprobado con un patrón de
  Unicode).
- El título entra antes de los 12 s (s01: la frase de puente tiene 16 palabras, unos 6 s).
- Recontado tras la revisión del 2026-10-05 (las tarjetas, preguntas y mensajes de V17 no cambian).
- Ningún identificador en voz: `ptl-pruebas-02` y `10.20.6.140` solo en pantalla («un portátil de pruebas», «una
  dirección de la red de oficinas»); 802.1X, 443 y UDP no son identificadores para el validador.

---

## 6. Prerrequisitos (bloqueantes, en orden)

- **P0 · Commit del trabajo de vídeo actual.**
  - Nada de `video/` ni de `public/videos/` está en git.
  - Hay 9 archivos modificados sin commit: tipos, BlockRenderer, tests, sp4-part3/4 y package.json.
  - Lo decide la usuaria; yo no hago commit sin que lo pida.
- **P1 · Esperar a la integración de ElevenLabs, que está en curso en otra sesión.**
  - Esa sesión está cambiando `video/siem/scripts/lib/*` y `video/edr/generate-elevenlabs.mjs`.
  - Los briefs son agnósticos respecto a la voz: se usará la que fije ese trabajo, la misma en todos los vídeos.
  - No se toca `scripts/lib` hasta que ese trabajo esté integrado.
- **P2 · Generalizar la tubería SIEM antes de V1**, que es el segundo vídeo sobre ella. Si no, acabaremos con N copias bifurcadas.
  - **HECHO (2026-09-25), salvo la retirada de `video/edr/`, que queda para V1.**
    - Motor en `video/engine/` y un `video.json` por vídeo (en vez de ampliar `storyboard.json`, para no
      alterar el `sourceHash` del SIEM).
    - Todos los scripts aceptan `--video <slug>`.
    - Los perfiles viven en `scripts/lib/profiles.mjs`.
    - Regresión del SIEM comprobada:
      - timeline, transcripción y VTT regenerados byte a byte idénticos;
      - 10 fotogramas renderizados antes y después, idénticos salvo 6 píxeles de la barra de progreso (±2/255).
  - **Retirar `video/edr/`** y sus scripts `video:*` de `package.json` solo cuando el código de ElevenLabs de `video/edr/generate-elevenlabs.mjs` se haya migrado al motor compartido.
  - **Motor compartido y una carpeta por vídeo.** Cada carpeta `video/<slug>/` lleva `storyboard.json`, `narration.json`, `lexicon.json`, `scenes/`, `data/` y `Poster`.
  - **Parametrizar los valores fijos:**
    - `paths.mjs`: nombres de salida `siem-blue-team-*`, `COMPOSITION` y `POSTER_STILL`;
    - `SCENE_IDS` en `validate-timeline.mjs` y la unión `SceneId` en `src/timeline/types.ts`: derivarlos del storyboard;
    - el límite de 5 capítulos;
    - título y descargo del transcript: descargo **por pista**;
    - ventana de duración, reglas de estilo y objetivo de tamaño: un **perfil** `principal`/`capsula` en `storyboard.json`;
    - `DEFAULTS` de `tts.py`.
  - **Reutilizar tal cual:** `ui/*`, `overlay/*`, `theme/*`, `timeline/load.ts`, `scene-props.ts` y `lib/{text,align,captions,remotion,narration,freshness}.mjs`.
- **P3 · Tests.** **HECHO en parte (2026-09-25):** la suite `lesson videos` recorre todos los bloques
  `t:'video'`. La comprobación «sin `.wav`/`.mp3` bajo `public/videos/`» queda para V1, porque hoy falla
  en local por `public/videos/edr/voice/*.wav`, que está ignorado por git.
  - Convertir la suite `SIEM lesson video` (`src/data/content.test.ts:247-284`) en una que recorra **todos** los bloques `t:'video'` de ambas pistas.
  - Añadir una comprobación de que no hay `.wav`/`.mp3` bajo `public/videos/`.
  - Los tests `node:test` de `video/**/scripts/lib` siguen fuera de vitest; se ejecutan a mano.
  - Nota: el VTT del EDR antiguo (ids `01-intro-1`) no pasaría la comprobación `^WEBVTT\n\n1\n`, otro motivo para rehacerlo.
- **P4 · Corrección del canon de VELVET CICADA — HECHO (2026-09-25).** Un vídeo congela el canon, así que esto iba antes de cualquier guion GCTI.

  | Dato | Conflicto | Corrección aplicada |
  |---|---|---|
  | `141.98.6.10` | VPS de `meridian-sso-portal.com` en s1m1 y lab3a; VPS de `update-svc-cdn.com` en E7 (s2m3) | Se mantienen s1m1 y lab3a. En E7 (s2m3), `update-svc-cdn.com` pasa a 185.220.x.x (shared hosting), «Resources» pasa a «hosting, dominio, cert TLS» y el párrafo dice «~14.000 dominios» en vez de «400». En lab2b, el ítem de Infrastructure pasa a «update-svc-cdn.com and the self-signed TLS certificate it presents» |
  | Hash del implante / huella del cert | SHA-256 `9f3a...e1` (E7) frente a SHA1 `9f:3a:c1…` (lab3a): casi idénticos | Se cambió la **huella del cert** en lab3a a `d4:7e:02…`, no el hash del implante. El hash `9f3a...e1` de E7 coincide a propósito con el `9f3a2c...e1` del informe de sandbox de s3m2, porque es la misma muestra |
  | `winhlp.exe` | Loader en s2m1, s2m2 y s2m5; certutil renombrado en s5m3 | Loader = `winhlp.exe`, certutil renombrado = `wcssvc.exe`; corregidos el párrafo de Sigma de s5m3 y la pregunta s5m3q9 |
  | Ruta PDB | 4 variantes (s2m4, s3m2, callout de s3m2, Lab 3B, lab2b) | Canon `D:\proj\cicada\loader\Release\ldr.pdb` en s2m4 (eventos y tabla), el callout de s3m2, lab2b y el string `s1` de Lab 3B. Las muestras del lab referencian el string por id, no por texto, así que el lab sigue funcionando |
  | `cdn-sync-status.example` | Relay, C2, phishing y harvest | Queda como infraestructura de entrega (relay en s2m1, phishing en s3m4/s3m5, harvest en s5m1). En s2m4, el beacon de Victim 1 pasa a `update-svc-cdn.com`. En s3m2, el C2 de respaldo pasa a un dominio propio, `ocsp-verify-node.example` (texto y check) |

  **Se deja sin tocar:**
  - `winhlp.exe SHA-256 4c81...b3` en el árbol de procesos de s2m5, frente al `9f3a...e1` de E7 y s3m2. Se puede leer como una variante recompilada (la propia lección enseña que los hashes rotan). Si V3 o la cápsula de s2m5 muestran ambos, conviene unificarlos.
  - El ejemplo genérico de PDB de stage 2 en la pregunta de s3m2 (`...\kaz\dev\stage2\...`): es otro binario.

  Verificado con `npm test` (133 en verde), `tsc` y la vista previa (Lab 3B muestra el nuevo `$s1`; E7 en s2m3 muestra 185.220.x.x). Ningún id cambia, así que el progreso guardado no se ve afectado.
- **P5 · Canon Sec+.**
  - Fijar el dominio público `haldenport.example`.
  - Anotar sin corregir la mezcla de TLD con los `haldenp0rt.com` de los quizzes de sp2.
  - Verificar la línea temporal V1 → SIEM → sp4m11 (3-9 por la tarde, 01:52, 04:12) contra sp4m10. Contra sp4m6 ya está comprobada.

## 7. Presupuesto del repositorio

- **Hoy:** `public/videos/` ocupa ~44 MB.
- **Tras la tanda 1:** ~+80 MB (3 × ≤25 + 1 × ≤12), menos ~10 MB del EDR retirado. Total ≈ 115 MB.
- **Tras la tanda 2:** ≈ 225 MB.
- GitHub Pages no tiene LFS y todo lo de `public/` se despliega. Si se superan unos 300 MB, conviene replantear el hospedaje de los MP4 antes de la tanda 3. Esto refuerza la disciplina de duración y de crf.

## 8. Flujo de producción por vídeo (recetario)

### Orden de trabajo (desde V5b, 2026-10-01)

Sale de lo que costó V5: tres versiones de la hoja de grabación y dos frases regrabadas porque el canon de los
vídeos publicados vivía solo en sus datos en pantalla; cuatro horas de escenas con tres agentes y Whisper peleando
por la misma CPU; cuatro cortes a mano en la grabación. Los pasos detallados siguen más abajo.

1. **Diseño en una ronda.** Claude pasa la ficha entera (conceptos e imágenes, historia y canon nuevo, escenas,
   producción) con las opciones recomendadas ya elegidas; Lidia dice solo qué cambia.
2. **Guion contra el registro de canon.** Antes de escribir, se lee `docs/superpowers/canon/<campaña>.md`
   (`glass-harbor` en Security+, `velvet-cicada` en GCTI). Con el guion escrito, `canon-check.mjs --video <slug>`
   escribe `out/canon-refs.md`: cada equipo, cuenta, IP, dominio, hash, caso y hora del guion, con las líneas de los
   otros vídeos, lecciones y registro que ya lo usan.
3. **Dos revisiones en paralelo** (exactitud y naturalidad). La de exactitud lee el registro y `out/canon-refs.md`,
   además de la lección y el objetivo.
4. **Congelar el guion.** Con las revisiones aplicadas y `canon-refs.md` leído, `video.json` → `"frozen":
   "AAAA-MM-DD"`. Solo entonces la hoja de grabación sale como «versión definitiva»; antes es un «BORRADOR · no
   grabes todavía» y `script-sheets.mjs` avisa. Lidia recibe una sola hoja.
5. **Escenas mientras se graba.** Las piezas comunes y las escenas se montan sobre la línea de tiempo estimada, que ya
   tiene todas las marcas, mientras Lidia graba; con la voz real basta un repaso de fotogramas. Los trabajos pesados
   (render, `qa-frames`, la transcripción de Whisper, `verify-voice`) hacen cola solos (`lib/heavy-lock.mjs`, un
   candado en la carpeta temporal compartido por todas las copias del repo; `RENDER_LOCK=0` lo salta).
6. **Importar y verificar.** `master_voice.py` → `import-recording.mjs` → `audio.mjs` (línea de tiempo y
   `verify-voice`). Si `verify-voice` marca una frase, primero se mira si hay una toma limpia en la grabación:
   `recut_recording.py --map <wav>@<a>-<b>` enseña dónde están los silencios y `--part` monta las tomas buenas en un
   archivo corto que se importa con `--only`. Solo si no la hay, se regraba esa frase.
7. **Render, YouTube y lección.** `render.mjs --master`; `youtube-meta.mjs` (las etiquetas de tema salen de
   `video.json` → `"tags"`); subida con Lidia (ella arrastra el MP4, que pasa del límite de 10 MB de las herramientas
   del navegador, y la miniatura si el navegador integrado no puede elegir archivos) o, desde el 2026-10-05, por la
   API con `youtube-upload.mjs` (privado; README del motor, «Subida a YouTube por la API»); el bloque `youtube` en la
   lección; `npm test` y `npm run build`.
8. **Cerrar antes de abrir el siguiente.** El canon nuevo del vídeo se apunta en el registro de su campaña, y su PR
   se fusiona antes de empezar el vídeo siguiente, para que cada rama lleve solo lo suyo.

### Pasos detallados

1. **`storyboard.json`:** perfil, capítulos, escenas, `targetSec`, `wordBudget` y `requiredCues`, copiados de este plan.
   En los vídeos `-yt`, antes de escribirlo se recorta el brief a **4–6 conceptos clave** (2–3 en una cápsula) y
   `out/script-notes.md` dice qué se quedó fuera y dónde está en la lección (§1, «Narración hablada»).
2. **`narration.json` + `lexicon.json`:**
   - con marcado `{cue}` y `[display|spoken]`;
   - nuevas entradas de léxico para la pista (p. ej. Diamond, WHOIS, pDNS, DMARC);
   - exam cards y think prompts, que valida `analyzeNarration`.

   **Para los vídeos con perfil `-yt` (YouTube), además:**
   - `video.json` lleva `"profile": "principal-yt"` o `"capsula-yt"`, y también `"adversary"` (obligatorio en
     cuanto un segmento use `intercept`) y `"lesson"` (el id de módulo que enlaza la descripción de YouTube).
   - **Antes de sintetizar la voz:** `node video/engine/scripts/voice-plan.mjs --video <slug>` calcula si el
     guion cabe en el crédito de ElevenLabs (con el 15 % de margen para repetir tomas) y dice qué voz usar;
     se copia esa voz en `narration.json` → `"voice"` a mano. Si toca Chatterbox, `narration.json` debe fijar
     además `"lexicon": "lexicon.chatterbox.json"` (solo siglas: las reescrituras de `lexicon.json`, «jash»,
     «jóuld», son para edge-tts y con Chatterbox se leen peor). `build-timeline.mjs` usa ese mismo léxico —
     por eso se fija en `narration.json` en vez de cambiarlo por su cuenta — y `tts-chatterbox.mjs` avisa si
     no está puesto.
   - **Revisores** (paso 3): el de exactitud comprueba además que ninguna analogía ni chiste falsee el concepto,
     y en paralelo un **revisor de naturalidad** repasa el guion contra las reglas de «Narración hablada» (§1).
   - **Con grabación propia** (`"voice": "recording/<nombre>"`): `narration.json` lleva
     `"recording": { "tempo": 1.08, "maxPauseMs": 250 }` (valores provisionales, §1) y
     `import-recording.mjs` los aplica al cortar los clips.
   - **Después de `render`** (paso 5): `node video/engine/scripts/youtube-meta.mjs --video <slug>` escribe
     `out/youtube.md` (título, descripción con capítulos, etiquetas y la lista de archivos a subir). Publicación:
     - Lidia inicia sesión en YouTube Studio en su Chrome;
     - Claude, con Claude in Chrome, sube el MP4, rellena los datos de `out/youtube.md`, sube los subtítulos y
       la miniatura, y **pide confirmación antes de pulsar «Publicar»**, vídeo a vídeo;
     - nunca se usa ni se pide la contraseña de Lidia.
   - **En la app** (paso 6): en vez de copiar el MP4, se añade o sustituye un bloque
     `{ t: 'video', title, youtube: '<id>', poster, transcript }`, con el póster y la transcripción en
     `public/videos/` y **sin copiar el MP4** (se queda en `video/<slug>/out/`, ignorado por git).
3. **Revisión de exactitud** por un subagente de solo lectura contra la lección y el objetivo oficial, *antes* de sintetizar o grabar la voz; en los vídeos `-yt`, a la vez que la **revisión de naturalidad** (§1).
4. `build-timeline --estimate`, escenas en Remotion (reutilizando `ui/*`) y `qa-frames`. Antes del render final se
   revisan a tamaño móvil (480 px) una escena densa, una pregunta completa y el cierre.
5. Audio con la voz fijada en P1, `render --draft` y después `render`, que comprueba duración, tamaño y sincronía A/V.
6. Copiar el MP4, el póster, el transcript y el VTT a `public/videos/<slug>*` y añadir o sustituir el bloque `t:'video'` en el punto de inserción indicado.
7. `npm test`, `npm run build` y vista previa en el navegador.

## 9. Qué hago al aprobar este plan

Solo esto:
1. Guardar este plan en `docs/superpowers/plans/2026-09-25-lesson-videos.md`, junto a los planes de dominio, **sin commit** salvo que se pida.
2. Parar.

La producción empieza tanda a tanda y con aprobación explícita, porque P0 (commit) y P1 (ElevenLabs) dependen de la usuaria y de otra sesión en curso.

## 10. Verificación

- **Del plan (ahora):** un script de solo lectura sobre este archivo comprueba:
  - todas las exam cards tienen ≤58 caracteres y los think prompts ≤48;
  - hay como máximo 1 exam card por escena y ninguna en la última;
  - la suma de segundos de cada vídeo cae en la ventana de su perfil;
  - ningún texto de narración o de exam card lleva flechas ni emoji.
- **De cada vídeo (al producirlo):**
  - `npm test`, con la suite generalizada de P3;
  - `node --test "video/<slug>/scripts/lib/*.test.mjs"` o los del motor compartido;
  - las comprobaciones de `render.mjs` (duración ±0,2 s, h264 1080p30, AAC, tamaño del perfil, sincronía A/V ±2 frames);
  - `npm run build`;
  - vista previa con `intelforge-dev`: reproducción, subtítulos en español, transcript desplegable, descarga y pantalla completa, en modo claro y oscuro y a ancho de móvil.

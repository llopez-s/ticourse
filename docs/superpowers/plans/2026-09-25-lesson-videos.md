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
- **sp2m7 (Cápsula) «Ataques en los logs»: V10, ficha propuesta el 2026-10-01 (abajo), pendiente de Lidia.** La noche
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

> Propuesta del 2026-10-01, pendiente de la aprobación de Lidia. La versión vigente de escenas y guion será
> `video/logs-halden/storyboard.json` + `narration.json`; qué se quedó fuera, en `video/logs-halden/out/script-notes.md`.
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
  `"recording": { "tempo": 1.08, "maxPauseMs": 250 }` · voz del adversario: **voz nueva del adversario, efecto por
  decidir** (propuesta: `sapi/Microsoft Laura`, ya instalada, con un preset nuevo «teléfono», voz de llamada en banda
  estrecha y sin el anillo de `machine`; hoy `video/engine/scripts/adversary_fx.py` solo tiene `machine`. Si la voz fija
  o no el género de RED MARROW es una pregunta para Lidia, en decisiones) · música de V4 y V5
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

**Escenas:** seis, en tres capítulos (Una llave, muchas puertas · La URL y la tubería · Para el examen).

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
  el aparcamiento. Ningún texto usa un artículo ni un adjetivo que marque su género («Es RED MARROW»); si la voz lo fija,
  lo decide Lidia (pregunta en decisiones) y se apunta aquí.
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
   del navegador, y la miniatura si el navegador integrado no puede elegir archivos); el bloque `youtube` en la
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

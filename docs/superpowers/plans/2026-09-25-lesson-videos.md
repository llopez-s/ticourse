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
| Suma de `targetSec` de las escenas | 270–300 s | 130–165 s | más que Principal, para que quepa la chispa sin recortar contenido (lo acota la duración renderizada) | más que Cápsula, ídem |
| Duración renderizada (`minTotalSec`–`maxTotalSec` de `scripts/lib/profiles.mjs`) | ≈ +20 s por márgenes de la tubería (entradas, colas y transiciones de escena, cierre): 290–320 s. En el SIEM, 305 s de escenas dieron 325 s | ≈ +15–20 s: 150–190 s | **380–500 s** | **190–260 s** |
| Estructura | 5 capítulos, 10–12 escenas | 3 capítulos, 5–6 escenas | 5 capítulos (sin cambios) | 3 capítulos (sin cambios) |
| Exam cards (≤58 car., máx. 1 por escena, ninguna en la última) | 8–11 | 4–6 | 8–11 (sin cambios) | 4–6 (sin cambios) |
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

### Narración con chispa (vídeos nuevos)

Estas reglas rigen los vídeos nuevos (V1 EDR rehecho, V3, V4 y siguientes); los tres vídeos ya publicados
(SIEM, EDR antiguo y forense) no se tocan. Copiadas de
`docs/superpowers/specs/2026-09-26-video-narration-style-design.md` §2.1–§2.3 y §5.2.

#### Reglas

1. **Una idea nueva por frase.** Frases de unas 20 palabras como mucho. Nada de enumeraciones con punto y coma:
   una lista de más de tres elementos se reparte en varias frases o se lleva a la pantalla.
2. **Te habla a ti.** En segunda persona. Al menos una pregunta por escena, contestada enseguida.
3. **Una imagen por concepto clave.** Cada concepto clave lleva una analogía cotidiana o una imagen concreta
   («un pequeño programa que lo reenvía todo»).
4. **Humor en el marco, nunca en el dato.** La ironía, los guiños y los remates van en las frases que presentan
   o comentan. La frase que transmite el dato va limpia y literal. El texto de las tarjetas de examen no se
   adorna.
5. **Remate con respiro.** Después de un chiste o de una revelación, `pauseAfterMs` sube a 600–900 ms.
6. **Emoción variada.** Se usan las etiquetas `<…>` de ElevenLabs (Chatterbox también las usa; ver §5.2) sin
   repetir la misma en dos segmentos seguidos.
7. **La historia manda.** Halden / GLASS HARBOR en Security+ y VELVET CICADA en GCTI. El adversario provoca y la
   analista responde (§4).

#### Ejemplo

Antes (SIEM `s02-02`, 20 palabras):

> Servidores y estaciones envían por agente; firewalls y switches, por syslog; la nube, por API; y los routers
> exportan NetFlow.

Después (unas 55 palabras, los mismos datos):

> ¿Cómo llegan los logs al SIEM? Depende de quién hable. Servidores y estaciones llevan un agente: un pequeño
> programa que lo reenvía todo. Firewalls y switches no suelen admitir agentes, así que hablan syslog. La nube
> contesta por API. ¿Y los routers? Esos no te cuentan qué se dijo, solo quién habló con quién y cuánto: NetFlow.

#### Salvaguardas de rigor

- **El revisor de exactitud** (subagente de solo lectura, antes de sintetizar la voz) comprueba también que
  ninguna analogía ni ningún chiste falsee el concepto. Una analogía que simplifica en exceso se corrige o se
  quita.
- **Validador del motor** (`analyzeNarration`). Frase de más de 22 palabras: el aviso ya existe para todos los
  perfiles. Los perfiles `-yt` activan además, **solo como avisos, no errores** (así los vídeos antiguos no se
  llenan de avisos):
  - dos segmentos seguidos con la misma etiqueta de emoción;
  - escena sin ninguna pregunta;
  - `;` en el texto hablado.

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
  o `src/data/course-gcti.ts`) en cuanto algún segmento use `intercept`; si no, `analyzeNarration` lo rechaza.
- Límites que valida `analyzeNarration`: como mucho 1 mensaje por capítulo (error), ninguno en la escena final
  (error), y el recuento total fuera del rango del perfil (§1) es solo un aviso.
- No tiene voz ni entra en los subtítulos; sí entra en la transcripción, como
  `[Mensaje interceptado · SILENT PAGER] «…»`, porque es contenido.

#### Los nombres en pantalla

En los vídeos nuevos, el póster y la tarjeta final dicen **«Alertópolis»**, nunca «IntelForge Academy» (el
nombre antiguo, que conservan los tres vídeos ya publicados para no romper su regresión byte a byte). Lo
decide el `profile` de `video.json`: `scripts/lib/profiles.mjs` usa `LEGACY_APP_NAME` para `principal`/`capsula`
y `APP_NAME` para `principal-yt`/`capsula-yt`.

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
- **sp4m10 IR (Principal).**
  - Tablero con las 7 fases y sus criterios de salida.
  - Qué se rompe si se erradica antes de contener.
  - Tabletop frente a simulación; RCA frente a threat hunting.
  - Continúa el caso de Halden de V1 y del SIEM.
  - Aporta el porqué que spl4b (order) no da.
- **sp4m8 IAM (Principal).**
  - Diagramas de secuencia navegador–IdP–SP para SAML, OAuth (autoriza, no autentica) y OIDC.
  - Demo de fatiga de push MFA en un móvil simulado.
  - Joiner-mover-leaver y permission creep.
  - Checkout JIT en el vault de PAM.
- **s4m3 ACH (Principal).**
  - La matriz se rellena celda a celda.
  - Las filas sin diagnosticidad se desvanecen; gana la hipótesis menos inconsistente.
  - Sensibilidad retirando E4.
  - Usar el extracto de la lección y no la solución del lab4b.
- **s2m5 ATT&CK + Pyramid (Cápsula).**
  - El árbol de procesos EDR de VELVET CICADA se mapea en directo: procedimiento, técnica T1053.005, táctica.
  - Cada indicador sube por la pirámide.
  - Requiere el canon de `winhlp.exe` (P4).
- **s3m5 STIX (Cápsula).**
  - Decidir si se ingiere un indicador STIX 2.1: `valid_until`, `confidence`, marcado TLP.
  - Grafo indicator, malware, intrusion-set.
  - «STIX describe, TAXII transporta».
- **sp2m7 (Cápsula) «Ataques en los logs».**
  - Password spraying frente a brute force.
  - `../` traversal.
  - Firma de la amplificación DNS en NetFlow.

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

1. **`storyboard.json`:** perfil, capítulos, escenas, `targetSec`, `wordBudget` y `requiredCues`, copiados de este plan.
2. **`narration.json` + `lexicon.json`:**
   - con marcado `{cue}` y `[display|spoken]`;
   - nuevas entradas de léxico para la pista (p. ej. Diamond, WHOIS, pDNS, DMARC);
   - exam cards y think prompts, que valida `analyzeNarration`.

   **Para los vídeos con perfil `-yt` (YouTube), además:**
   - `video.json` lleva `"profile": "principal-yt"` o `"capsula-yt"`, y también `"adversary"` (obligatorio en
     cuanto un segmento use `intercept`) y `"lesson"` (el id de módulo que enlaza la descripción de YouTube).
   - **Antes de sintetizar la voz:** `node video/engine/scripts/voice-plan.mjs --video <slug>` calcula si el
     guion cabe en el crédito de ElevenLabs (con el 15 % de margen para repetir tomas) y dice qué voz usar;
     se copia esa voz en `narration.json` → `"voice"` a mano.
   - **Al hacer la revisión de exactitud** (paso 3): el revisor comprueba además que ninguna analogía ni chiste
     de la narración con chispa falsee el concepto.
   - **Después de `render`** (paso 5): `node video/engine/scripts/youtube-meta.mjs --video <slug>` escribe
     `out/youtube.md` (título, descripción con capítulos, etiquetas y la lista de archivos a subir). Publicación:
     - Lidia inicia sesión en YouTube Studio en su Chrome;
     - Claude, con Claude in Chrome, sube el MP4, rellena los datos de `out/youtube.md`, sube los subtítulos y
       la miniatura, y **pide confirmación antes de pulsar «Publicar»**, vídeo a vídeo;
     - nunca se usa ni se pide la contraseña de Lidia.
   - **En la app** (paso 6): en vez de copiar el MP4, se añade o sustituye un bloque
     `{ t: 'video', title, youtube: '<id>', poster, transcript }`, con el póster y la transcripción en
     `public/videos/` y **sin copiar el MP4** (se queda en `video/<slug>/out/`, ignorado por git).
3. **Revisión de exactitud** por un subagente de solo lectura contra la lección y el objetivo oficial, *antes* de sintetizar la voz.
4. `build-timeline --estimate`, escenas en Remotion (reutilizando `ui/*`) y `qa-frames`.
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

# Revisión de exactitud y canon · V18, V19, V20 y V21 (tanda 4, Security+)

Fecha: 2026-10-08. Revisor de solo lectura. Rutas relativas a la raíz del repo; `sp/` = `src/data/secplus/`, `reg` =
`docs/superpowers/canon/glass-harbor.md`, `F18`…`F21` = `docs/reviews/2026-10-08-fichas-tanda4/ficha-V18.md`…`ficha-V21.md`,
`D1819` = `decisiones-V18-V19.md`, `D2021` = `decisiones-V20-V21.md`. Gravedad: **bloquea** (no se pega ni se escribe guion
hasta arreglarlo) · **arreglar** (se corrige en la ficha o en el guion antes de congelar) · **nota** (a tener presente).

## Veredicto

| Ficha | Veredicto | Por qué en una línea |
|---|---|---|
| V18 · sp4m5 · triaje de vulnerabilidades | **listo con arreglos** | exacta en CVSS/excepciones/revalidación; roce real entre «credentialed» y el banner (`sp/sp4-part3.ts:27`, `:167`) y una cita falsa del anuncio de SILENT PAGER |
| V19 · sp2m4 · SQLi y XSS | **listo con arreglos** | la técnica es correcta y ninguna tarjeta enseña lo contrario; tres de sus cuatro efectos de sonido no existen como cue; «input validation» no puede quedar como mero refuerzo para el examen |
| V20 · sp1m3 · Zero Trust | **listo con arreglos** | roles bien ordenados (engine decide, administrator comunica, PEP aplica); la ficha dice «otro recurso» y es el mismo ERP de la lección; un paso de la revocación atribuye al administrator lo que decide el engine |
| V21 · sp4m2 · WPA3 | **listo con arreglos** | exacta (SAE, forward secrecy, EAP-TLS/PEAP) y la demo es defensiva; «el código del portal» choca con la palabra reservada, «le da la contraseña» exagera lo que dice la lección y el título promete lo que WPA3-Personal no da |

**Ningún hallazgo bloquea.** No hay día de la semana mal puesto, ni choque de fechas con V5/V5b/V6/V10/V11/V12/V16/V17,
ni límite del validador pasado, ni tarjeta que enseñe lo contrario de la lección o del objetivo. Los arreglos de abajo son de
texto de ficha o de guion; ninguna propuesta de cambio de lección toca ids, respuestas ni tests.

## Qué he comprobado (con Node y con las fuentes)

- **Límites del validador** (`video/engine/scripts/lib/narration.mjs:13-23`, `profiles.mjs`), recontados con
  `[...texto].length` y el patrón `FORBIDDEN_SYMBOLS` más `{}[]|<>`:

  | | tarjetas (≤58) | pregunta (≤48) | mensajes (≤70) | símbolos prohibidos |
  |---|---|---|---|---|
  | V18 | 50, 51, 55, 52 | 47 | 46, 52 | ninguno |
  | V19 | 53, 41, 53, 44 | 45 | 57, 60 | ninguno |
  | V20 | 53, 49, 49, 52 | 44 | 69, 68 | ninguno |
  | V21 | 50, 49, 54, 54 | 42 | 52, 52 | ninguno |

  Todos con 6 escenas en 3 capítulos, 4 tarjetas (una por escena de s02 a s05, ninguna en la última), 1 pregunta, 2 mensajes
  (uno en el capítulo I y otro en el II, ninguno en el cierre; V20: s02 en I y s03 en II; V21: s02 en I y s04 en II).
  Suma de `s` = 210 en los cuatro; `wordBudget` 567 (la ficha dice 566 por redondear escena a escena; da igual). Extremos
  0,89 y 1,22: 187–256 s. Precedente real: V12, con la misma suma y estructura, se renderizó en 3:53
  (`docs/superpowers/plans/2026-09-25-lesson-videos.md`, cabecera de V12), es decir 233 s, dentro de 190–260. El riesgo es por
  abajo (si el guion queda corto), y las fichas ya dicen qué escena alargar.
- **Días de la semana** (Node): 1-10 jueves, 2-10 viernes, 5-10 lunes, 8-10 jueves, 3-11 martes, 5-11 jueves, 9-11 lunes,
  12-11 jueves, 13-11 viernes, 16-11 lunes, 20-11 viernes, 23-11 lunes, 25-11 miércoles, 27-11 viernes, 30-11 lunes, 1-12
  martes, 11-12 viernes, 14-12 lunes, 15-12 martes, 16-12 miércoles, 22-12 martes, 1-04-2027 jueves. Todos como dicen las
  fichas. Del 1-10-2026 al 1-04-2027 hay 182 días («seis meses» en voz: bien); 90 días de revisión caen el 30-12 y el 30-03.
- **CVSS v3.1** (fórmula de la especificación aplicada con Node): `AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H` = **9.8** y
  `AV:N/AC:H/PR:N/UI:N/S:U/C:H/I:H/A:H` = **8.1**, como dice F18; el vector del FINDING #0147 de la lección
  (`.../A:N`) = 9.1, también correcto (`sp/sp4-part3.ts:60`). De paso: el mismo 9.8 con `AV:L` (que es lo que el contexto de
  `srv-msg02` equivale a una métrica ambiental «Modified Attack Vector: Local») da 8.4. Útil para el guion: la nota
  ambiental existe, pero la voz no debe decir que CVSS «no puede» incluir contexto, y F18 ya lo prohíbe (`D1819:116-118`).
- **Citas de línea:** todas las de F18, F19, F20 y F21 a `sp/sp4-part3.ts`, `sp/sp2-part2.ts`, `sp/sp1-part2.ts` y
  `sp/sp4-part1.ts` coinciden con el archivo (inserciones, checks, notas de examen, preguntas, recuadro de Halden). Las
  únicas citas falsas están abajo (V18, hallazgo 2).
- **Efectos de sonido:** `block`, `check`, `ding`, `error`, `glitch`, `lock`, `alarm` existen en `video/engine/sfx/`.
- **Voces** (`video/*/narration.json`): SILENT PAGER = `sapi/Microsoft Pablo`, `rate` 0, `machine` (V1, V5, V5b, V6);
  RED MARROW = `Laura` + `telefono` (V10); NULL CIPHER = `Helena` + `cifrado` (V11, V12). Las fichas las citan bien.
- **V17** (rama `video-fronteras-halden`, `git show`): 23, 25 y 27-11, `ptl-pruebas-02`, «un servidor RADIUS» sin nombre,
  802.1X en los switches de oficinas desde el 1-12, sin MFA ni VPN de acceso; léxico `RADIUS`, `EAP`, `EAP-TLS`, `802.1X`, `VLAN`,
  `TLS`. Nada de eso choca con V20 ni con V21.
- **Objetivos SY0-701**: de memoria, 1.2 (control plane: adaptive identity, threat scope reduction, policy-driven access
  control, policy administrator, policy engine; data plane: implicit trust zones, subject/system, PEP), 2.3 (web-based:
  SQLi y XSS), 4.1 (site surveys, heat maps, WPA3, AAA/RADIUS, protocolos criptográficos y de autenticación, seguridad de
  aplicaciones) y 4.3 (CVE, CVSS, exposure factor, environmental variables, risk tolerance; patching, insurance, segmentation,
  compensating controls, exceptions and exemptions; rescanning, audit, verification; reporting). Las cuatro fichas cubren lo
  que dicen cubrir. No he podido abrir el documento oficial (ver «No verificado»).

---

## V18 · sp4m5 · «Triaje de vulnerabilidades: el contexto manda sobre el número» · listo con arreglos

**Exactitud técnica: correcta.** CVSS (severidad en abstracto, nota base) frente a riesgo (exposición, exploit, controles,
impacto): lo dice la lección (`sp/sp4-part3.ts:47`, `:141`, q3 `:206-219`) y el vídeo lo cuenta igual. Seguro = transferencia
de impacto, no mitigación (`:100`, q8 `:281-294`); excepción con dueño de negocio, justificación, controles, caducidad y
revisión (`:100`, q6 `:251-264`); cierre por rescan, verification o audit (`:160-161`, q7 `:266-279`). Ninguna de las cuatro
tarjetas (F18:76-79) enseña lo contrario. La nota de «dique seco» (P3, no «a salvo») y la de que P1 es la ventana de 24 h
y no «el único parche» están bien resueltas (D1819:119-123).

1. **Arreglar · «credentialed» frente al banner** (F18:46-47, F18:71, D1819:129-131; lección `sp/sp4-part3.ts:27`, `:53`,
   `:167`). La lección enseña que el falso positivo por banner es propio del escaneo **sin** credenciales («el escaneo sin
   credenciales dedujo la versión del banner», `:27`) y que las credenciales lo reducen. F18 sella el informe del 1-10 como
   `credentialed` (s01) y hace que el escáner lea `msgq/3.1.4` del banner (s05): quien acaba de leer `:27` verá una
   contradicción. Un escáner con credenciales sí puede traer hallazgos de comprobación remota, pero hay que decirlo.
   Arreglo (solo texto de ficha y guion): en s05 la fila lleva «método: comprobación remota del servicio, sin sesión», la voz
   dice una frase («aunque el escaneo lleve credenciales, esta comprobación lee lo que el servicio anuncia por la red») o se
   quita `credentialed` del sello de s01. Además, **la contradicción ya está en la lección y la ficha no la detecta**:
   `sp/sp4-part3.ts:53` rotula el informe del 1-9 como `credentialed` y `:167` dice que los 180 falsos positivos de ese
   mismo escaneo salen de «un escaneo sin credenciales»; `sp/sp4-part2.ts:413` dice que el escaneo mensual «pasa a ser
   credentialed». Va al apartado de cambios propuestos (puede ir en el PR de V18, solo texto).
2. **Arreglar · cita falsa del anuncio de SILENT PAGER** (F18:91; D1819:144-145). F18 apoya la ironía del primer mensaje en
   «cuenta con que nadie lea la cola» y D1819 lo cita como `sp/sections.ts:104`. Esa frase no existe: `sp/sections.ts:104` dice
   «Las alertas llegan a las 3 a. m. y nadie las lee. SILENT PAGER cuenta con que tu SOC duerma». Es la fórmula de V1
   (`video/capas-halden/narration.json:35`). Arreglo: citar «cuenta con que tu SOC duerma» y que la presentación de SILENT
   PAGER en s03 use esa, no una paráfrasis inventada.
3. **Arreglar (registro y ficha) · «primer vídeo de sp4»** (D1819:143-145). Es falso: sp4m2 (V21) va antes que sp4m5 en el
   curso. V21 se declara con razón «primera aparición de SILENT PAGER en el orden del curso» (F21:8-11, D2021:29-33), y las
   dos fichas no pueden ser lo primero a la vez. En el vídeo no cambia nada (las dos presentan a SILENT PAGER desde cero y
   ninguna dice «otra vez»), pero el registro y la ficha deben decir que V18 es el **segundo** vídeo de SILENT PAGER en el
   orden del curso, tras V21, y el primero de vulnerabilidades.
4. **Nota · «De nada.»** (F18:95-96). Es la coletilla de V5 s08 (`reg:242`) y V18 la repite; V21 la evita a propósito
   (F21:102) y usa «Qué elegante.», que es de la familia de «Qué detalle.» de V1 (`reg:238`). Los mensajes de SILENT PAGER
   no tienen firma fija (a diferencia de «Lógico.» o «Confía en mí»), así que una coletilla repetida empieza a serlo sin
   haberlo decidido. No bloquea; si Lidia prefiere no fijar una firma, quitar «De nada.» y dejar que el mensaje termine en
   «olvídate.» (46 caracteres menos 10 deja holgura).
5. **Nota · términos de examen ausentes.** Ni las tarjetas ni la voz dicen «segmentation» ni «insurance» (F18:70, F18:78):
   en pantalla salen «aislar» y «seguro». El examen usa los términos en inglés; conviene que uno de los rótulos de s04 los
   lleve («aislar · segmentation», «seguro · insurance»).
6. **Nota · el laboratorio comparte premisa, no hallazgos.** `sp/labs-sp4.ts:182`: «escaneo mensual… 8 hallazgos… la
   ventana de esta semana solo da para 4». F18 abre con «escaneo mensual… tres filas rojas… esta semana cabe un parche»
   (F18:46-53). F18:122-134 evita los ocho hallazgos y el juego de elegir, y está bien; pero el vídeo enseña las reglas con
   las que se resuelve spl4c entero. Es la penalización L que el ranking ya aceptó; una línea en el guion («en el laboratorio
   lo aplicas con otros ocho hallazgos») basta.
7. **Nota · «tres filas rojas, un solo parche»** (F18:46-53, F18:67). La tercera fila no tiene parche, así que la capacidad de
   la semana solo compite entre las dos primeras. La escena s04 lo resuelve, pero el gancho de s01 sugiere tres candidatas.
8. **Nota · título del capítulo II** («Sin parche y sin prueba», F18:63). D1819:138-139 dice que no nombra ninguna de las dos
   opciones; «sin prueba» empuja hacia «comprobar», que es la respuesta de la pregunta de s05. Es una tarjeta de capítulo que
   sale antes de s04, no del título de la escena de la pregunta, así que pasa la regla (`plan:207-210`) por poco. Si el
   revisor de naturalidad lo oye como pista, «Lo que no se puede parchear».
9. **Nota · densidad de s04** (44 s, 119 palabras: cuatro opciones que se tachan, mensaje, sello de seguro, mamparos y
   registro de seis campos). Es la escena a recortar la primera si pasa de 255 s, como dice la ficha (F18:34-37), pero conviene
   recortar el registro (cuatro campos en voz, seis en pantalla), no los mamparos.
10. **Nota · imagen del casco.** Es nueva en el canal, pero el barco ya es el lugar de la imagen de V12 (el ancla a bordo,
    `plan` V12, concepto 1). No se pisan, pero en la voz conviene no decir «ancla» ni «a bordo».
11. **Nota · identificadores inventados.** `CVE-2026-40218` y `CVE-2026-38105` no están en el repo; que no coincidan con un CVE
    real no se puede comprobar (D1819:288-289). Dejarlos tal cual, rotulados «datos ficticios».

**Canon:** limpio. Jueves 1-10 y lunes 5-10 no tocan nada (V5b: mesa viernes 2-10 y copia de contactos 5-10 son de
Seguridad y de otro asunto, `reg:75-76`); `srv-msg01`, `srv-msg02` y `cam-nvr-02` no existen en `reg`, `src/` ni `video/`
(mismo patrón `srv-…` en minúsculas, `reg:549-550`); director de operaciones sin nombre, como `sp/sp4-part3.ts:167` y
`reg:129`; el formato de la excepción copia EXC-01 (`video/siem/src/data/s07-tuning.ts:49-58`: «Revisión: cada 90 días»);
«Sistemas» es el área que parchea (`reg:130`). «No se toca»: el portal, el FINDING #0147, `IR-2026-0147`, la OT (ni PLC ni
esclusas), la VPN y la MFA del 30-11, el escáner `vulnscan01`/EXC-02, el dosier de SILENT PAGER: ninguno sale. Los dos
servidores no contradicen la central de 24 de V5b (`reg:153`): la ficha no dice si envían registros y no hace falta. La
contradicción del WAF que la ficha detecta es real (`sp/sp4-part3.ts:57` «sin WAF delante» frente a `:65` «regla de
virtual patching en el WAF») y la propuesta de cambio (D1819:242-246) es correcta, de una línea y no toca ids ni tests
(grep: ningún test lee ese texto).

**Mensajes de SILENT PAGER:** tutean, son cortos y no marcan género; ninguno llama «analista» a la jugadora; ninguno repite
frase de los diez publicados, salvo la coletilla del hallazgo 4. «Mismo 9.8, misma prisa» no tutea, pero el segundo sí;
vale.

---

## V19 · sp2m4 · «SQL injection y XSS: cuando un texto se vuelve orden» · listo con arreglos

**Exactitud técnica: correcta.** Consulta, carga y corrección son las de la lección (`sp/sp2-part2.ts:300-317`); parameterized
queries para SQLi y output encoding para XSS (`:321`, `:352-353`); reflected necesita un clic y suele ir con phishing, stored
salta para todo el que abre la página (`:320`); el script lo ejecuta el navegador, no el servidor. El argumento contra
«cifra la base de datos» es correcto: el cifrado en reposo protege el disco y no cambia la consulta que lanza la propia
aplicación. El script de pantalla (`enviar(...)`) no es una carga que funcione y no hay dirección real. El vídeo no cubre
DOM-based XSS, que tampoco está en la lección ni en el objetivo 2.3. Ninguna tarjeta enseña lo contrario.

1. **Arreglar · tres de los cuatro efectos no son cue** (F19:22-24 frente a F19:70-73). La ficha declara `sfx`:
   `bypass`, `blocked`, `cookie` y `vitrina`, pero la columna de cues solo contiene `vitrina` (s05). s02 tiene `session` y no
   `bypass`; s03 tiene `fails` y no `blocked`; s04 no tiene `cookie`. `sfxMapErrors` (`video/engine/scripts/lib/sfx.mjs:49`)
   rechaza un `sfx` sin cue en el guion («no cue {bypass} in the narration»). Arreglo: renombrar `session`→`bypass` en s02,
   `fails`→`blocked` en s03 y añadir `cookie` a los cues de s04 (o cambiar el `sfx`). F18, F20 y F21 sí cuadran.
2. **Arreglar · «input validation» no es solo «refuerzo»** (F19:63, F19:106-107, D1819:223-224, la pantalla de s03 con los
   «refuerzos de la lección»). La nota de examen de la propia lección dice que, ante una pregunta de la familia injection, **si
   entre las opciones aparece input validation, esa es la respuesta** (`sp/sp2-part2.ts:337`). La ficha la deja en pantalla
   como refuerzo gris. No es falso (la lección también la llama complemento, `:316-317`, `:321`), pero quien lo vea y se
   presente a un examen donde la única opción correcta sea «input validation» queda mal preparado. Arreglo: en la regla 3 del
   cierre o en la pantalla de s05 una línea «en el examen, si solo ves input validation entre las opciones, esa» (o llamar a
   los rótulos «validar la entrada» y «política de contenido» sin «refuerzo»).
3. **Nota · «suele ir con phishing» al lado de RED MARROW.** El dosier de RED MARROW es phishing, USB y proveedores
   (`sp/sections.ts:63-68`). La frase es de la lección (`:320`) y está bien, pero en un vídeo donde sale RED MARROW podría
   leerse como «RED MARROW lanza el enlace». F19:157-160 ya prohíbe insinuarlo; en el guion, que la frase de phishing no
   caiga justo después del mensaje de s05.
4. **Nota · cookie y HttpOnly.** El script lee `document.cookie`; `sp/sp4-part1.ts:378` y la q7 (`:483-496`) enseñan que
   `HttpOnly` lo impide. La voz de F19 («pueden llevarse la cookie de sesión») es correcta en condicional; no decir que el
   robo es inevitable ni que la cookie «siempre» sale.
5. **Nota · «cifrar la base de datos».** Para que «la aplicación ve los datos descifrados» no suene a otra cosa, decir
   «el cifrado en reposo» o «el del disco» en la respuesta de s03 (F19:228-230 lo pide al revisor de exactitud; esta lo
   confirma como correcto con ese acotamiento). Con cifrado a nivel de columna o de aplicación el resultado sería distinto.
6. **Nota · SAST en el pipeline.** `sp/sp4-part2.ts:413` dice que el desarrollo del portal de citas «incorpora SAST en el
   pipeline». Tres fallos de manual en una copia previa a publicar chocan, sobre todo para quien sigue el curso (V19 va antes
   que sp4m4). Adoptar la frase de salida que ya propone D1819:205-209, una línea en s01: «las herramientas ayudan, pero
   nada sustituye a probar la web».
7. **Nota · «Desarrollo» y los tres portales.** La lección escribe una actividad («el desarrollo del portal de citas de
   camiones», `sp/sp4-part2.ts:413`) y V19 la convierte en un área con responsable y fecha (F19:139-141). Es admisible (el
   registro ya admite áreas por función, `reg:130`), pero el registro debe separar tres portales: de reservas
   (`hpa-portal-web-01`, `reg:155`), de declaración de carga (`sp/sp4-part1.ts:384`) y de citas de camiones (V19).
8. **Nota · el personal de la puerta y `srv-accesos01`/`srv-bascula01`.** F18 evita la puerta de camiones para no mezclarla
   con V5b (F18, D1819:78-79); F19 pone a su personal como usuario del listado de citas. No hay choque (nada une el portal de
   citas con esos equipos), pero que el guion no diga qué sistema de la puerta lee el listado.
9. **Nota · RED MARROW.** «Se presenta con una frase, la misma de V10»: la de V10 es «Es RED MARROW, que vive de engañar. Y sí,
   cumple las normas» (`video/logs-halden/narration.json:98`); la segunda mitad es del mensaje de la contraseña. Reutilizar
   solo «que vive de engañar».

**Canon:** jueves 5-11, 10:00 y viernes 13-11 no chocan con V11 (3-11), V12 (9 a 12-11), V16 (16 y 20-11) ni V17 (23 a 27-11).
No sale el portal de reservas, el traversal, `Halden2026!`, `r.haugen` ni las otras cuatro cuentas, ni `192.0.2.157`. El
vídeo cumple la regla de que V10 diga «no es una inyección» (`video/logs-halden/narration.json:162`): V19 se ve antes que V10
y le da el concepto. Voz de RED MARROW (`Laura` + `telefono`) bien citada. Los dos mensajes son consejos de amigo que son
mentira, terminan en «Confía en mí.» y no repiten los de V10 (`reg:247-248`); ninguno marca género ni llama «analista».
Ningún laboratorio de sp2 toca SQLi ni XSS (`sp/labs-sp2.ts`; grep sin resultados en todos los `labs*.ts`). Cambio propuesto
`sp/sp2-part2.ts:337` («un firewall» a «un firewall de red»): correcto (el WAF de sp3 sí frena estos ataques,
`sp/sp3-part3.ts:66`, `:240`; y la q2 ya dice «network firewall»), solo texto del callout.

---

## V20 · sp1m3 · «Zero Trust: quién decide, quién comunica y quién aplica» · listo con arreglos

**Exactitud técnica: correcta y bien ordenada.** Engine decide, administrator comunica (crea y revoca la sesión, emite el
token, ordena al PEP), PEP aplica; engine y administrator forman el PDP, en el control plane; el PEP es el único componente
de control del data plane; threat scope reduction y adaptive identity están en el control plane, y la ficha no dibuja el
primero abajo (F20 y D2021:104-105, de acuerdo con `sp/sp1-part2.ts:76-83`). Zero Trust como «verificar cada petición» y no
como «denegar a todos» (F20:66, regla 1 del cierre). Las cuatro tarjetas (F20:83-86) son exactas; la de threat scope
reduction no la junta con las zonas. Todas las citas de línea de F20 a `sp/sp1-part2.ts` son correctas.

1. **Arreglar · «otro recurso» es falso** (F20:46-47). La ficha dice que el vídeo repasa el ejemplo de la lección «con otra
   cuenta y otro recurso». El recurso es el mismo: el ERP (`sp/sp1-part2.ts:130`: Marta abre el ERP; V20 s01-s05, el ERP).
   Y casi todo lo demás también: ubicación inusual, segundo factor, solo lectura, token de 30 minutos, EDR que avisa a los
   diez minutos y revocación. Corregir la frase («con otra cuenta, y el mismo ERP») y asumir que la cápsula es un repaso casi
   1 a 1 del callout. No es un error de contenido (F20 lo declara como repaso), pero la aportación nueva es fina: la regla
   de V1, el simulador y la imagen del almacén.
2. **Arreglar (menor) · quién decide la revocación** (F20:78, s05; lección `:130`). La ficha escribe «El administrator
   revoca la sesión y el PEP corta» y el aviso del EDR a los diez minutos. La lección también lo dice así, pero con la regla
   de oro del vídeo («si la pregunta dice quién decide, nunca es el PEP» y el administrator comunica, no decide), la secuencia
   completa es: la señal llega al engine, el engine decide cerrar, el administrator revoca, el PEP corta. Añadir «el engine
   ve el aviso y decide» antes de «el administrator revoca». Cuatro palabras; evita que el espectador atribuya la decisión
   al administrator.
3. **Arreglar (menor) · el segundo factor del 03:00 no puede leerse como MFA funcionando el 13-11** (F20:78; D2021:113-114). La
   ficha pone el sello «diseño y simulación» en s01 y s04, no en s05, que es donde el motor «pide un segundo factor» y suena
   `step-up`. Que el sello (o «simulación · sin efectos») siga visible en s05. La nota «el proveedor de identidad lo pedirá
   desde el 30-11» ya está en futuro y es la forma correcta (`reg:83`, `:97`).
4. **Nota · la pregunta repite el check que acaba de salir.** El vídeo va después del check de adaptive identity
   (`sp/sp1-part2.ts:157-171`) y su pregunta es la misma situación (otro país, 03:00). Es coherente con «el vídeo repasa»
   (D2021:85-87), pero aprovecha poco el hueco para pensar. Si Lidia lo prefiere, una pregunta de la revocación («el EDR
   avisa: ¿quién la cierra?») trabajaría lo que la lección solo nombra, sin destripar un check.
5. **Nota · regla 3 del cierre** (F20:104-105): «Nada de eso se compra en una caja: se diseña». La lección (`:155`) dice que
   Zero Trust es una arquitectura y no una caja, y que «un proveedor puede vender un PEP o un PDP». Reescribir como «no es una
   caja que se compra» para no contradecir a la lección.
6. **Nota · s02 («credencial robada», «equipo comprometido»)** (F20:75). Es el supuesto de la lección (`:21`), pero la
   pareja coincide con lo que pasó en septiembre (un portátil comprometido y una credencial de servicio robada). F20 ya
   prohíbe decir «habría frenado» (`reg:337`, notas de V6); en el guion, ningún «como pasó» ni «como en un caso real».
7. **Nota · eco de V17 y de V16** (D2021:75-79). El mozo que consulta a la oficina y no decide tiene la misma forma que el
   vigilante que llama a la oficina de acreditaciones de V17 s03. La ficha lo declara (tres personas para tres verbos, no dos) y
   es la diferencia real; que el revisor de naturalidad lo mire. «El recinto del puerto» y «chaleco de Operaciones: pasa»
   (F20:75) se parecen a la puerta del recinto de V17; mantener el chaleco como lo central y no dibujar una garita.
8. **Nota · mensajes a 69 y 68 caracteres** (límite 70): sin holgura para retocar; cualquier cambio de palabra se recuenta.

**Canon:** viernes 13-11 queda entre V12 (jueves 12-11) y V16 (lunes 16-11); comparte día con la mejora de V19 (13-11, otra
área, otro asunto). D1819:34-38 decía que, si dos fichas de la tanda caían el mismo día, había que decidir cuál se movía;
D2021:26-28 lo decide («sin relación») y es aceptable. La regla de V1 («Operaciones a `erp.local` por 443») es la regla 6
de `video/capas-halden/src/scenes/S05Rules.tsx:25` (la ficha cita bien el número de línea; en el vídeo es la regla 6). El MFA
del 30-11 queda en futuro y el piloto del 11-12 (viernes) es «siguiente paso», nunca cumplido. NULL CIPHER: tercera aparición en
la cronología y primera en el orden del curso, con la fórmula de V11 (`video/cripto-halden/narration.json:88`), infinitivo,
«Lógico.», sin puertas ni llaves, sin dominio ni equipo; la voz `Helena` + `cifrado` es la de V11 y V12. El registro dice hoy
que V11 es el primer vídeo de Halden de sp1 (`reg:31`, `:376`); al cerrar V20 hay que corregirlo, como propone D2021:236-237.
No se toca: `IR-2026-0147` y sus equipos, VPN, zonas y jump server de V16, portal de reservas, proveedores y cuentas con
nombre: ninguno sale. No hay laboratorio de sp1 sobre Zero Trust (`sp/labs.ts`, grep sin resultados).

---

## V21 · sp4m2 · «WPA3: de una clave para todos a una identidad para cada uno» · listo con arreglos

**Exactitud técnica: correcta.** SAE sustituye al handshake de WPA2-PSK, impide el diccionario sin conexión y da forward
secrecy (la tarjeta dice «frena», no «elimina», F21:91-92: bien, porque se puede seguir adivinando contra la red); WPA3
personal sigue siendo una clave compartida; el modo enterprise da identidad por usuario, revocación individual y registros
por persona con 802.1X y RADIUS; EAP-TLS pide certificado en los dos lados y es el más fuerte; PEAP y EAP-TTLS dependen de
que el cliente valide el certificado del servidor (`sp/sp4-part1.ts:308`, q2 y q3 `:408-435`). Ocultar el SSID y alargar la
clave no resuelven la fuga (`:288`, `:290-304`). Forward secrecy bien dicho: solo vale para lo que se grabó con su handshake.
**La demo se presenta en defensivo:** prueba autorizada, punto de acceso de pruebas, clave de prueba, sin herramienta con
nombre, sin lista de palabras, sin línea de comandos y sin tocar HALDEN-OPS (F21:144-147, D2021:152-159). Con las condiciones
del hallazgo 3, no es una receta.

1. **Arreglar · «el código del portal» es una palabra reservada** (F21:75 concepto 3; F21:84 s04). La imagen del carné
   frente al «código del portal que sabe todo el barrio» usa «portal» en el sentido de portal de un edificio. En Halden
   «el portal» ya es el portal de reservas (`reg:155`, V10, V11, V12, V16) y V19 añade el de citas; F19 evita decir «el portal»
   a secas en voz precisamente por eso (F19:213-214). Un espectador oirá «el código del portal» y pensará en la web. Arreglo:
   «el código de la escalera», «de la cancela» o «de la puerta del edificio» (evitando «puerta» si se quiere respetar la regla
   de no mezclar con V16/V17; «el código de la escalera» no choca con nada).
2. **Arreglar · «le da la contraseña a la primera»** (F21:85, s05). La lección dice que un punto de acceso falso «recoge las
   credenciales en el primer intento» (`sp/sp4-part1.ts:308`). Con PEAP/MSCHAPv2 el punto falso captura un desafío y su
   respuesta, no una contraseña en claro. Decir «las credenciales» (o «sus credenciales»), como la lección, y rotular el
   dibujo así.
3. **Arreglar · qué pasa al final de la demo** (F21:144-147; D2021:197-199). La clave de prueba es «corriente a propósito» y
   los contadores llegan a 38.000.000 en 19 s, pero la regla dice que no se enseña ninguna clave encontrada. O la clave
   cae (y entonces el cierre de s03 muestra «clave de prueba: encontrada», que es un dato de prueba) o no cae (y la
   frase «con una clave corriente esto acaba en minutos» se queda sin demostración). Decidirlo en el guion; recomiendo la
   segunda opción, sin resultado en pantalla, y que la voz diga qué pasaría. Además: ni el adaptador ni el modo de captura ni
   la velocidad por segundo de ningún hardware concreto; los contadores se quedan como «claves probadas» e «intentos
   recibidos».
4. **Arreglar · el título promete lo que WPA3-Personal no da** (F21:1, F21:27). «WPA3: de una clave para todos a una
   identidad para cada uno» deja entender que WPA3 da identidad por usuario; solo el modo enterprise la da, y el vídeo mismo
   lo dice («sigue siendo una clave para todos», s03). Título de YouTube y del sello más exacto: «WPA3-Enterprise: de una clave
   para todos a una identidad para cada uno», o «Wifi seguro: de una clave …». Aparte, el título de la escena s05, «Qué
   demuestra la tableta» (F21:85), apunta a «certificado», que es la respuesta de la pregunta («Tabletas con certificado:
   ¿PEAP o EAP-TLS?»). La propia pregunta ya regala la premisa (`sp4m2q3`), pero la regla es que el título de la escena no dé
   la respuesta (`plan:207-210`): cambiarlo por «Dos formas de entrar».
5. **Nota · «precio»** (F21:84, tres chips «servidor RADIUS · directorio · PKI»). V17 aprueba el 27-11 el 802.1X en los switches
   desde el 1-12, que necesita RADIUS (`video-fronteras-halden`, s04, s09). V21 dice «un servidor RADIUS» a secas y no dice si
   existía (D2021:209-210), pero «precio» sugiere una compra nueva. Llamarlos «lo que hace falta».
6. **Nota · imágenes y palabras.** s02 dibuja «una mancha que cruza la valla» (F21:82): la valla es la imagen de V16
   (`reg:32`, `:216`) y aquí es solo literal; no decir «valla y garita» juntas. «Carné de cada uno» (concepto 3) queda cerca del
   «pase» de V6, de la acreditación de V17 y del lector de badges clonado del dosier de NULL CIPHER (`sp/sections.ts:49`): se
   distinguen, pero el guion debe decir «carné», no «badge» ni «pase». Las tabletas «07» y «08» comparten cifras con
   `ADM-WS-07` y `OPS-WS-08` (`reg:141-143`); son rótulos de ejemplo («ejemplo · sin fecha»), sin riesgo.
7. **Nota · dependencia de V17, que no está fusionada.** F21 da por fijados `RADIUS`, `EAP`, `EAP-TLS`, `802.1X` y `VLAN`
   (F21:29-33) y repite una tarjeta de V17 (F21:94-95). Es cierto en la rama (`video-fronteras-halden`, `lexicon.json`), pero
   hasta que V17 se fusione no están en `main`. Orden de PR: V17, luego V21 (el plan ya manda «cerrar antes de abrir el
   siguiente», `plan:3313-3314`).
8. **Nota · «Frena, no elimina».** Mantener «frena» en la voz y en la tarjeta (F21:91-92). Las dos mentiras de SILENT PAGER son
   de la lección y bien elegidas; el segundo mensaje cierra con «Qué elegante.», cercano a «Qué detalle.» de V1 (ver V18,
   hallazgo 4).
9. **Nota · −78 dBm y 38.000.000 en 19 s.** Son cifras inventadas (D2021:277-278): −78 dBm es verosímil para «se oye menos,
   pero se oye»; 38 millones en 19 s (2 millones por segundo) está en el orden de una GPU actual contra WPA2. No se puede
   comprobar más (ver «No verificado»).

**Canon:** lunes 14-12, martes 15-12, miércoles 16-12 y martes 22-12 quedan después de todo lo fechado de Halden hasta
ahora (V17 hasta el 27-11, MFA del 30-11, fases desde el 1-12) y dentro de «este trimestre». Los hechos nuevos son
coherentes con el recuadro de la lección (`sp/sp4-part1.ts:380-385`): −55 dBm en el aparcamiento, HALDEN-OPS en WPA2 con una
clave de 2022 y «dos antenas». La propuesta de dar fecha al recuadro (D2021:224-226) es solo texto. El aparcamiento sale como
sitio de medición, sin coches ni USB (dosier de RED MARROW); no sale la wifi de invitados (dosier de BLIND ARCHITECT), ni
shadow IT (spl2a, `sp/labs-sp2.ts:119-121`), ni operadores, ni contratistas, ni CA con nombre, ni `IR-2026-0147`.
`ptl-pruebas-02` como «tu portátil de pruebas» es canon (`reg:151`, V5b y V17). SILENT PAGER tutea, cierra con ironía, sin IP,
dominio ni equipo; voz `Pablo` + `machine`. Una errata de ficha: D2021:251-252 dice que la voz de SILENT PAGER no coincide
con la de GLASS VIPER (V22); coincide (`sapi/Microsoft Pablo`, `rate` 0, `machine`, `video/diamond-e7/narration.json` y
`video/kill-chain-eslabon/narration.json`), pero es una convención previa entre pistas distintas (HOLLOW LANTERN también
usa Pablo/machine), no un problema nuevo.

---

## Entre las cuatro fichas, y con V22 y V23

- **Fechas:** sin choque. 1-10 y 5-10 (V18), 5-11 y 13-11 (V19), 13-11 y 11-12 (V20), 14, 15, 16 y 22-12 (V21). El 13-11 lo
  comparten V19 y V20 (dos áreas, dos asuntos, sin relación); acepto la salida de D2021:26-28. El 1-10 y el 5-10 de V18
  quedan también libres en `reg` (el 5-10 solo tiene la copia de contactos de Seguridad, `reg:76`). Los plazos de V5 (18-09
  a 31-10) y la MFA del 30-11 no se usan para nada.
- **Orden del curso (afirmaciones incompatibles):** D1819:143-145 («V18 es el primer vídeo de sp4») frente a F21:8-11 y
  D2021:29-33 (V21, la primera aparición de SILENT PAGER en el orden del curso). Es V21. Ver V18, hallazgo 3.
- **Un adversario, una voz:** SILENT PAGER (V18 y V21) = `Pablo` + `machine`; RED MARROW (V19) = `Laura` + `telefono`;
  NULL CIPHER (V20) = `Helena` + `cifrado`. Ninguno tiene dos voces dentro de Sec+. `Pablo` + `machine` también es GLASS
  VIPER (V22, F22:19-23) y HOLLOW LANTERN (V4, V8), y `Laura` sirve a PAPER CRANE con otro efecto (V9, `machine`): es la
  convención de las pistas, no un choque.
- **Imágenes repetidas:** ninguna entre V18 (casco), V19 (formulario, panel de avisos, vitrina), V20 (almacén con chaleco) y
  V21 (foco, candado de combinación, carné). Cercanías: casco/barco con el barco de V12 (V18, hallazgo 10); mozo y oficina
  con el vigilante y la oficina de acreditaciones de V17 (V20, hallazgo 7); carné con acreditación de V17 y pase de V6 (V21,
  hallazgo 6). Fuera de Sec+: la tienda de V22 y el cuadro y las pinturas de V23 (`F23` concepto 1) no chocan con las de aquí;
  «pinturas» sí es el nombre de la imagen de V11 (`reg` y `plan`), conviene que el otro revisor lo mire.
- **Palabras reservadas:** «portal» (V21, arreglar); «valla», «garita», «recinto», «ventanilla» (V16, V17: aparecen sueltas en
  V20 y V21, nota); «puertas y llaves» (V10, spraying): V21 las evita, V20 las evita en los mensajes y deja «la puerta» solo a
  la narradora (D2021 y `F20:143-147`); «hilo» (V22): no aparece en ninguna; «creció así» sale en V16 (`reg:274`), V20 (F20:161)
  y V21 (F21:190): tic de la serie, que el revisor de naturalidad compruebe que no se vuelve fórmula.
- **Mensajes entre fichas:** los cuatro adversarios mantienen su registro; ningún mensaje repite una frase publicada, salvo la
  coletilla «De nada.» de V18 (hallazgo 4) y el patrón «Qué + adjetivo» de V21 y V1. Los de V19 y V20 repiten la firma de
  su adversario («Confía en mí.», «Lógico.») a propósito.
- **Orden de PR y registro:** el plan de esta rama no tiene V17 (la ficha está en `video-fronteras-halden`), así que «pegar
  tras V17» (D1819:251-252) producirá conflicto de fusión en el plan y en el registro (`reg` aún no tiene el canon de V17 ni de
  V12: la tabla de `reg:22-32` no tiene fila de V12 y la última revisión de `reg:4` no la menciona). Recomendado: fusionar V17
  y cerrar V12 en el registro antes de abrir los PR de V18 a V21, y que cada uno añada sus filas en una sección distinta.
- **Cambios de lección y de registro propuestos** (F18/D1819:242-264; D2021:224-243): todos son texto de callouts, bloques de
  código o filas de tablas del registro; ninguno cambia un id, una respuesta ni un `explain`. `src/data/content.test.ts` no
  lee ninguno de esos textos (grep de «virtual patching», «Tres hallazgos», «dos reflejos» solo da los archivos de datos). Las
  líneas `toBe('sp4m5')`, `toBe('sp2m4')`, `toBe('sp1m3')` y `toBe('sp4m2')` se añaden al publicar, como las de V10 a V16
  (`src/data/content.test.ts:267-296`). Añadir a los cambios propuestos uno nuevo: V18, hallazgo 1 (la contradicción
  «credentialed» frente a «sin credenciales» en `sp/sp4-part3.ts:53` y `:167`), solo texto.

## No he podido verificar

- **El documento oficial de CompTIA SY0-701** (1.2, 2.3, 4.1, 4.3): los he contrastado de memoria con las lecciones; no está
  en el repo. En concreto, si «authentication protocols» (EAP, PEAP, EAP-TLS) cae bajo 4.1 o bajo otro epígrafe, y si el
  documento hoy lista CVSS sin versión.
- **Si `CVE-2026-40218` y `CVE-2026-38105` coinciden con CVE reales** de 2026 (no hay red ni lista aquí).
- **El comportamiento real de un escáner con credenciales cuando un servicio anuncia un banner** (V18, hallazgo 1): es plausible
  y la ficha ya lo admite (D1819:310-311), pero no está contrastado con la documentación de ningún escáner.
- **La velocidad de 38.000.000 de claves en 19 s** contra WPA2 y la verosimilitud de −78 dBm para una tableta (D2021:277-278).
- **Las duraciones renderizadas:** solo el precedente de V12 (3:53). La suma y el presupuesto de palabras están contados; lo que
  dure grabado se sabrá con el primer borrador.
- **Los guiones y los sonidos de pronunciación** (`cookie`, `PEP`, `SAE`, `TTLS`, etc.): los confirma Lidia al grabar.
- **La rama de V17 entera:** he leído su ficha, su léxico y los datos de `s01`, `s02`, `s04`, `s05` y `s09`; no las escenas `.tsx`.
- **V22 y V23:** solo las he cruzado en voces, fechas (no tienen) e imágenes; su exactitud la revisa otro.

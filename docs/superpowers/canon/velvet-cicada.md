# Canon de «Operación VELVET CICADA» (GCTI)

Registro único de los datos ficticios de la campaña GCTI: la intrusión contra Meridian Dynamics que continúan
las lecciones, los laboratorios y los vídeos. Estado a 2026-10-16 (vídeos con su canon aquí: V3, V4, V7, V8, V9, V13, V14, V15, V22, V23 y V27). Las citas de
`src/data/s5.ts` van con la numeración de `main` desde que #56 trajo el bloque de V27 (`:583-589`): las que pasan de la `:583`
están siete líneas más abajo que antes.
El 2026-11-27 se añadieron las entradas de AP03, AP04, AP05, AP06, AP07, G02 y G08 (§7), con sus puntos de §5 (28 a 72), sus mensajes en la
tabla de §3 y su relleno en §6. Las citas de esas entradas van con la numeración de `origin/main` de ese día (commit `188d341b`); las de G08, con
la de la rama `video-tlp-comunidades` (commit `785b10e8`), porque su carpeta no está en `main`. Las citas anteriores **no** se han renumerado y
algunas de `src/data` van atrasadas (por ejemplo, la ruta del PDB que §3 cita en `src/data/s5.ts:510` está hoy en otra línea). Las remisiones
nuevas a este mismo archivo van por sección y no por línea, porque el archivo se mueve con cada tanda.
Siguen sin entrada otros vídeos GCTI ya incrustados en lecciones: los de s1m1, s1m4, s4m1, s4m2 y s5m1.


## 1. Cómo se usa

- Léelo entero antes de escribir un guion de VELVET CICADA. Lo que no está aquí no existe todavía: si el guion
  lo necesita, se decide con Lidia y se apunta aquí.
- El revisor de exactitud compara cada guion nuevo con este archivo, dato a dato, y cita la línea que choca.
- Cada vídeo, al producirse, añade su «canon nuevo» (lo que solo sale en pantalla) en §7.
- Si un vídeo publicado muestra en pantalla algo distinto de lo que dice este archivo, manda la pantalla: se
  corrige aquí y se anota en §5.

Notas de lectura: todas las rutas son relativas a la raíz del repositorio. `video/pivot-infra/out/*` está
ignorado por git y solo existe en la copia principal (`D:\LLM projects\TICourse`), no en los worktrees. Lo mismo
vale para el `out/` de cualquier vídeo (`.gitignore:26`, `video/*/out/`): el de V22 (`video/coa-precios/out/*`, con
`script-notes.md` y `youtube-upload.json`) se produjo en el worktree `video-coa-precios`, el de V23
(`video/atribucion-cuadro/out/*`, con los mismos archivos), en el worktree `video-atribucion-cuadro`, y el de V27
(`video/reglas-aeropuerto/out/*`, con `script-notes.md` pero sin `youtube-upload.json`), en el worktree `video-reglas-aeropuerto`.
Las fichas y revisiones de V27 están en `docs/reviews/2026-10-14-fichas-tanda5/` (`ficha-V27.md`, `guion-V27-exactitud.md`,
`guion-V27-naturalidad.md`).
`[V3]` y `[V4]` marcan datos que están en pantalla en un vídeo publicado. Las rutas de Windows se escriben como
se ven en la app (una barra); en los `.ts` van escapadas (`\\`).

## 2. Cronología

«sin zona» = la fuente no dice UTC. No ordenes esas filas contra las UTC como si fueran la misma hora.
Los rangos y las duraciones van como rangos; no tienen fecha exacta.

| Fecha y hora | Evento | Qué pasa | Fuente |
|---|---|---|---|
| 2025-11-03 | — | `first_seen` del intrusion set GLASS VIPER (STIX) | `src/data/s4.ts:1025` |
| nov-2025 → mar-2026 (rango) | — | Ventana de actividad del Cluster-A (Meridian) | `src/data/s4.ts:739` |
| 2025-11-18 | — | Se registra `update-svc-cdn.com` en NameFlow LLC [V4] | `video/pivot-infra/src/scenes/S07Whois.tsx:15-18` |
| 2025 (sin día) | — | Ficha WHOIS histórica del C2 con `kazuo.tanji@protonmail.com` | `src/data/s2.ts:581-582`; `video/pivot-infra/src/scenes/S07Whois.tsx:141` |
| 2026-01 | — | Variante anterior del loader (ssdeep 94 % similar) | `src/data/s3.ts:330` |
| 2026-02-11 | — | pDNS: `update-svc-cdn.com` → `185.220.x.x`, first seen [V4] | `video/pivot-infra/src/scenes/S03Pdns.tsx:63-65` |
| 2026-02-19 | — | Compile time de la muestra (la lección avisa: puede estar falseado) | `src/data/s3.ts:331` |
| 2026-02-27 14:03:11Z | — | Se registra `cdn-sync-status.example` | `src/data/s3.ts:763` |
| 2026-02-27 14:22:08 (sin zona) | — | pDNS first seen de `cdn-sync-status.example` en `203.0.113.27` | `src/data/s3.ts:775` |
| 2026-02-27 | — | `first_seen` de la campaña STIX «PO-REVISION phishing wave» | `src/data/s4.ts:1033-1035` |
| 2026-03-01 09:40:51 → 10:02:13 (sin zona) | — | `cdn-sync-status.example` pasa de `203.0.113.27` a `198.51.100.84` («la primera IP se quemó») | `src/data/s3.ts:775-776,780` |
| 2026-03-02 09:41 UTC | Delivery | Spearphish «Candidatura - Ingeniero de propulsion» a RR. HH.; el walkthrough de s2m4 usa el mismo correo (plan A de V14, `src/data/s2.ts:886`); V13 enseña sus cabeceras tal como las escribe la lección, con `Received: from mx1.cdn-sync-status.example (203.0.113.27) by mail.meridian.example; Mon, 2 Mar 2026 09:41:07 +0000` (`video/kill-chain-eslabon/src/scenes/parts/LessonLog.tsx:74-109`) | `src/data/s2.ts:68-74` |
| 2026-03-02 09:44:12 → 09:45:02 (sin zona, «mismo dia») | Exploitation → C2 | En ENG-WS-041: LNK, PowerShell, `winhlp.exe`, tarea programada, primer beacon; s2m4: 09:44 LNK y `winhlp.exe` con la ruta del PDB, 09:45 beacon (`src/data/s2.ts:887-889`); V13 las enseña línea a línea, sin zona: 09:44:12 `explorer.exe`, 09:44:13 `powershell.exe`, 09:44:19 escribe `C:\ProgramData\winhlp.exe`, 09:44:20 `schtasks` (`WindowsUpdateCheck`), 09:45:02 beacon (`video/kill-chain-eslabon/src/scenes/parts/LessonLog.tsx:121-155`) | `src/data/s2.ts:76-83` |
| 2026-03-05 02:11:47Z | antes de E7 [V3] | PROC_START de `C:\ProgramData\UpdSvc\updsvc.exe`; FILE_HASH `9f3a...e1` | `video/diamond-e7/src/data/s03-victim.ts:25-32` |
| 2026-03-05 02:11:49Z | antes de E7 [V3] | PIPE_CREATE `\\.\pipe\vc_pipe_3a7f09c1` | `video/diamond-e7/src/data/s03-victim.ts:36-38` |
| 2026-03-05 02:13 UTC | **E7** (C2) | Beacon HTTPS a `update-svc-cdn.com`; salta la alerta del SOC; informe MER-2026-019; V13 la dibuja como una alerta del SOC («SOC · Meridian Dynamics · turno de noche», tras «Sin alertas activas…»), con `ENG-WS-041` «ingeniería de propulsión» que «llama a» `update-svc-cdn.com` «dominio desconocido» (`video/kill-chain-eslabon/src/data/alert.ts:9-21`) | `src/data/s2.ts:566,571-573`; `video/diamond-e7/src/scenes/S01Hook.tsx:196-197` |
| 2026-03-05 02:13:02Z y 02:14:01Z | E7 [V3] | Dos NET_CONN a `update-svc-cdn.com:443` | `video/diamond-e7/src/data/s03-victim.ts:42-45` |
| 2026-03-07 (sin hora) | **E9** (AoO) | Mismo implante y metodología, dos días después de E7 [V3]; V14 (plan A) le da el contenido «compresión en una carpeta temporal · salida grande», sin tamaño ni destino en pantalla (`video/hilos-pelicula/src/scenes/parts/FilmRail.tsx:236`) | `src/data/s2.ts:630`; `video/diamond-e7/src/scenes/S10Thread.tsx:80-84` |
| 2026-03-07 00:52 (sin zona) | AoO (s2m4) | Staging en `C:\Windows\Temp\~tmp4421.cab`. Antes la lección lo ponía el 4-3 a las 22:10; V14 (plan A) lo pasa a la madrugada del sábado 7-3, que es lo que E9 ya decía | `src/data/s2.ts:890` |
| 2026-03-07 01:47 (sin zona) | AoO (s2m4) | Salen 1,2 GB hacia `transfer-cdn-eu.example` (antes, 5-3) | `src/data/s2.ts:891` |
| 2026-03-07 | — | pDNS: last seen de `update-svc-cdn.com` en `185.220.x.x` [V4] | `video/pivot-infra/src/scenes/S03Pdns.tsx:66` |
| 2026-03-09 08:05 → 08:23 (sin zona) | Víctima 2 | Orbital Components: «PO revision» a `finance@orbital.example`, `msdtcs.exe`, beacon a `portal-auth-check.example` | `src/data/s2.ts:894-897` |
| 2026-03-09 (lunes), sin hora | V14 | El «hoy» del vídeo: Orbital le pasa a Meridian sus eventos de esa misma mañana (los de la fila anterior; no se dice cómo ni quién), y esa noche Meridian le pasa a Orbital qué buscar (compresión de archivos en carpetas temporales, transferencias salientes grandes) como hipótesis que se comprueba. Sin resultado: el vídeo no dice si se encontró algo | `video/hilos-pelicula/src/data/s01-fotos.ts:10-15`, `video/hilos-pelicula/src/data/s09-noche.ts:19-25` |
| 2026-03-11 | — | El ISAC aeroespacial publica en una colección TAXII el indicador STIX de `cdn-sync-status.example` (válido hasta 2026-06-25); la TIP de Meridian lo recoge (pull) el 2026-07-02 | `src/data/s3.ts:1053`, `:1063-1070` |
| marzo → mayo 2026 (rango) | — | Exfiltración de diseños de propulsión, según el BLUF | `src/data/s5.ts:312`; `src/data/labs.ts:1016` |
| abr-2026 → hoy (rango) | — | Actividad del Cluster-B (Orbital-2) | `src/data/s4.ts:739` |
| 2026-04-18 desde 06:00 UTC | — | 41 correos de phishing de credenciales a la cadena de suministro | `src/data/s5.ts:56-58` |
| 2026-04-18 09:30Z | — | Indicador STIX «credential-harvest domain» (válido hasta 2026-07-18) | `src/data/s5.ts:607-612` |
| 2026-04-18 11:31:55 (sin zona) | — | pDNS last seen de `cdn-sync-status.example` en `198.51.100.84` | `src/data/s3.ts:776` |
| 2026-04-18 11:40 UTC | — | Flash alert MER-FA-2026-014; acciones antes de las 18:00 UTC; siguiente parte a las 17:00 UTC | `src/data/s5.ts:47-48,63,68` |
| 2026-04-18 | — | Fecha de la regla YARA `GLASSVIPER_Loader_MemMap` | `src/data/s5.ts:497,502` |
| 2026-04-25 | — | Próxima revisión del flash alert | `src/data/s5.ts:48` |
| 2026-07-02 (jueves, sin hora) | «hoy» de s3m5 [V8] | La TIP de Meridian consulta por primera vez (pull) la colección TAXII del ISAC aeroespacial y se trae todo lo que había, entre ello el indicador del 11-03, ya caducado; el pDNS de `cdn-sync-status.example` sigue sin nada después del 18-4; búsqueda hacia atrás desde el 27-02, sin resultados en pantalla | `src/data/s3.ts:1076`; `video/stix-isac/src/data/s05-taxii.ts:24`; `video/stix-isac/src/data/s03-caducado.ts:15-16,33-38` |
| «el martes» (sin fecha) | — | `141.98.6.10` sirvió un panel de phishing | `src/data/s1.ts:27,32` |
| «6 meses» (duración) | — | Acceso silencioso, sin cifrado ni extorsión | `src/data/s4.ts:429`; `src/data/labs.ts:883,895,919` |
| reunión de análisis (sin fecha) | Misión 4 [V9] | Pizarra con las cuatro pruebas y «ESPIONAJE»; Key Assumptions Check, matriz ACH y nota provisional al CISO | `src/data/labs.ts:149`; `video/ach-matriz/src/scenes/parts/Whiteboard.tsx:24-36`; `video/ach-matriz/src/data/s09-informe.ts:17-41` |
| «el lunes» (sin fecha) | Misión 5 | El consejo de Meridian lee el informe final | `src/data/labs.ts:187,1144` |

## 3. Datos fijos

### Organizaciones y personas

| Nombre exacto | Qué es | Fuente |
|---|---|---|
| Meridian Dynamics | Víctima. Aeroespacial, 8.000 empleados; programa de propulsión | `src/data/s1.ts:749`; `src/data/labs.ts:57` |
| «8,000 endpoints» | Parque de equipos de Meridian (lab3c) | `src/data/labs.ts:426` |
| `meridian.example` · `mail.meridian.example` | Dominio propio de Meridian y su servidor de correo | `src/data/s2.ts:72,879` |
| ENG-WS-041 | Workstation de ingeniería de propulsión; host de s2m1 y de E7 [V3] | `src/data/s2.ts:76,588-589`; `video/diamond-e7/src/scenes/S01Hook.tsx:227,277` |
| «servidores CAD», «propulsion R&D file server» | Activos que busca el actor | `src/data/s2.ts:546`; `src/data/labs.ts:304` |
| tú, «primera analista CTI» | La protagonista; la ficha el CISO | `src/data/s1.ts:749`; `src/data/tracks.ts:111` |
| el CISO, el consejo (board) | Sin nombre. El CISO pide los PIR; el consejo decide al final. En V23, tarjeta «CISO · responsable de seguridad» (V9 solo ponía «CISO») con «¿Quién está detrás?» y «¿Ponemos un país en el informe?»: pregunta, no decide | `src/data/labs.ts:57,187`; `video/atribucion-cuadro/src/scenes/parts/CisoStrip.tsx:23,25`; `video/ach-matriz/src/data/s01-hook.ts:24-28` |
| «Laura Iglesias - Talent» `l.iglesias@meridian-careers.com` | Remitente falso del spearphish | `src/data/s2.ts:69` |
| analistas de RR. HH. | Reciben el spearphish (cuatro buzones); una abre el LNK | `src/data/labs.ts:238,243,319` |
| Orbital Components (`orbital.example`, `finance@orbital.example`) | Proveedor de Meridian; Víctima 2 | `src/data/s2.ts:886-887` |
| «Orbital-2» | Etiqueta del Cluster-B en s4m4 | `src/data/s4.ts:730` |
| tres proveedores de ingeniería con VPN | Proveedores de Meridian con acceso remoto | `src/data/labs.ts:531` |
| «Bright Meridian Software Kft.» | Firmante desconocido de la muestra del sandbox | `src/data/s3.ts:334` |
| NameFlow LLC (IANA ID 9999) · Privacy Guard Services | Registrador y servicio de privacidad del actor | `src/data/s3.ts:766-767` |
| ISAC aeroespacial (`identity--aero-isac-share-0001`) | Fuente del indicador STIX entrante | `src/data/s3.ts:1053,1064` |
| BigVendorCo | Vendor genérico de la frase sesgada del lab4a | `src/data/labs.ts:486` |

Stellar Dynamics también existe, pero es un hallazgo del Lab 3A: ver §4.

### Equipos

| Nombre | Qué hace | Fuente |
|---|---|---|
| SOC de Meridian («SOC · Meridian Dynamics») | Escala E7 y la intrusión del lab2a. En V27, «el SOC: ¿y qué le damos que dure?» (en voz, «el SOC te pide algo que dure»): pregunta, sin persona, y no decide ni despliega nada | `src/data/s2.ts:573`; `src/data/labs.ts:73`; `video/diamond-e7/src/scenes/S01Hook.tsx:183`; `video/reglas-aeropuerto/src/data/s01-hook.ts:17`; `video/reglas-aeropuerto/narration.json:25` |
| Meridian CTI (`cti@meridian.example`) | Autor del flash alert y de la regla YARA. **La regla Sigma no lleva autor** (solo `references`, al informe interno MER-2026-011), y V27 no se lo pone | `src/data/s5.ts:47,69,500`; `src/data/s5.ts:531-551`; `video/reglas-aeropuerto/src/data/rules.ts:6` |
| IR, IR lead, canal `#ir-hotline` | Respuesta; propone las medidas del lab2c. En V22, «equipo de respuesta», sin persona ni postura: pregunta «¿qué hacemos con esto?» y no propone ni decide nada | `src/data/s5.ts:66`; `src/data/labs.ts:96`; `video/coa-precios/src/data/s01-hook.ts:9-10`; `video/coa-precios/narration.json:25` |
| RR. HH. de Meridian | Destino del spearphish | `src/data/s2.ts:26` |

### Infraestructura

| Dato exacto | Papel | Detalle | Fuente |
|---|---|---|---|
| `update-svc-cdn.com` | C2 del implante (HTTPS 443) | Beacon cada 60 s con jitter. V22 rotula el paso de C2 «llama a casa cada minuto», sin dominio, y enseña el dominio solo en la celda Deny de C2 de la matriz, «sinkhole de `update-svc-cdn.com`» con `[!]` «quema tu visibilidad»: menú de la analista, no algo hecho | `src/data/s2.ts:29,83,577,585`; `src/data/s3.ts:340`; `video/coa-precios/src/data/s01-hook.ts:7`; `video/coa-precios/src/data/matrix.ts:88-95` |
| `185.220.x.x` | IP del C2 | Hosting compartido, ~14.000 dominios de terceros [V3][V4] | `src/data/s2.ts:585,598`; `src/data/labs.ts:736-739`; `video/diamond-e7/src/scenes/S09Quality.tsx:36` |
| pDNS de `update-svc-cdn.com` | Historial | `185.220.x.x`, first seen 2026-02-11, last seen 2026-03-07 [V4] | `video/pivot-infra/src/scenes/S03Pdns.tsx:63-66` |
| WHOIS de `update-svc-cdn.com` | Registro | Creado 2025-11-18, NameFlow LLC; hoy Registrante y Email `REDACTED FOR PRIVACY`; ficha «WHOIS histórico · 2025»: Registrante «no consta», email `kazuo.tanji@protonmail.com` [V4] | `video/pivot-infra/src/scenes/S07Whois.tsx:15-19,141-144` |
| `CN=updatesvc` · `SHA1 d4:7e:02…` | Certificado TLS autofirmado del C2 | Visto en 2 IP más: en total tres, `185.220.x.x`, `141.98.6.10` y una tercera sin revelar [V3][V4] | `src/data/s2.ts:586-587`; `video/pivot-infra/src/scenes/parts/s05-cert/bits.tsx:8-12`; `video/pivot-infra/src/scenes/S05Cert.tsx:57-60` |
| `141.98.6.10` | VPS dedicado, muy pocos inquilinos | `pdns ip`: «3 dominios han resuelto a esta IP» [V4] | `src/data/labs.ts:664-667`; `video/pivot-infra/src/scenes/parts/s05-cert/PdnsConsole.tsx:84-85,123` |
| `meridian-sso-portal.com` | Portal falso de login de Meridian (phishing), en `141.98.6.10` | Nodo de partida del Lab 3A [V4] | `src/data/s1.ts:86`; `src/data/labs.ts:648-651`; `video/pivot-infra/src/scenes/parts/s05-cert/PdnsConsole.tsx:160` |
| `cdn-sync-status.example` · `mx1.cdn-sync-status.example` | Entrega: relay del correo de s2m1, dominio de phishing (s3m4), harvest de credenciales (abril) | Canon de P4. V22 lo enseña solo en la celda Deny de Delivery, «bloquear `cdn-sync-status.example` en el gateway» con `[!]`: menú, sin decir si está bloqueado | `src/data/s2.ts:70-71,89`; `src/data/s3.ts:754`; `src/data/s5.ts:58`; `docs/superpowers/plans/2026-09-25-lesson-videos.md:623`; `video/coa-precios/src/data/matrix.ts:53-59` |
| WHOIS de `cdn-sync-status.example` | Registro | Creación 2026-02-27T14:03:11Z, expira 2027-02-27; NameFlow LLC; `proxy-7f3a21@privacyguard.example`; `NS1.FASTPARK-DNS.EXAMPLE`, `NS2.FASTPARK-DNS.EXAMPLE` | `src/data/s3.ts:760-770` |
| `203.0.113.27` → `198.51.100.84` | IP de `cdn-sync-status.example` | La segunda es hosting compartido (300+ dominios) en s4m4 | `src/data/s3.ts:775-776`; `src/data/s4.ts:738` |
| `meridian-careers.com` | Dominio verosímil del `From` del spearphish | | `src/data/s2.ts:69,89` |
| `ocsp-verify-node.example` | Segundo C2 (fallback) de la muestra | | `src/data/s3.ts:341,348` |
| `transfer-cdn-eu.example` | Destino de la exfiltración de Víctima 1 | | `src/data/s2.ts:884` |
| `portal-auth-check.example` | C2 de Víctima 2 (Orbital) | | `src/data/s2.ts:890` |
| `time.windows.com`, `ctldl.windowsupdate.com`, `www.msftconnecttest.com` | Ruido legítimo de Windows en el sandbox | No son del actor | `src/data/s3.ts:342-344` |
| certificado de CT `f2:8c:37…` | Recién emitido para un dominio que «imita a Meridian»; nombre tapado entero [V4] | | `video/pivot-infra/src/scenes/S06Ct.tsx:437-438,467` |
| cinco dominios hermanos | Lote con el mismo patrón y el mismo día, dormidos, todos tapados [V4] | | `video/pivot-infra/src/scenes/S09Preblock.tsx:35`; `video/pivot-infra/out/script-notes.md:66-67` |

Documentos del caso: informe MER-2026-019 (E7, `src/data/s2.ts:571`), informe de sandbox MER-2026-023
(`src/data/s3.ts:326`), referencia interna MER-2026-011 (`src/data/s5.ts:69,503,536`), flash alert
MER-FA-2026-014 (`src/data/s5.ts:47`), campaña STIX «PO-REVISION phishing wave» (`src/data/s4.ts:1033`).

Ficha completa de E7 (`src/data/s2.ts:572-594`): KC phase Command & Control, Result `success`, Direction
`victim → infrastructure`, Methodology «beacon HTTPS, jitter 60s», Resources «hosting, dominio, cert TLS»
(`src/data/s2.ts:574-578`); en V3 igual, con la dirección dibujada como flecha
(`video/diamond-e7/src/scenes/S06Meta.tsx:27-32`). V23 redibuja el diamante sin ningún dato: Capability, Infrastructure y
Victim como nodos atenuados con barras ilegibles y solo Adversary como tarjeta, con el sello `UNKNOWN`
(`video/atribucion-cuadro/src/scenes/parts/Diamond.tsx:4-7`; `video/atribucion-cuadro/src/scenes/S01Hook.tsx:31-34,102`);
la voz dice «tu diamante del ataque», nunca E7 (`video/atribucion-cuadro/narration.json:25`). Todo lo que Meridian tiene
del primer nivel de atribución (el implante y su C2) queda en un chip sin nombres, «tu caso: el programa y su servidor»: ni
hash, ni dominio, ni certificado (`video/atribucion-cuadro/src/data/s02-niveles.ts:5-6`).

### Capacidades

| Dato exacto | Qué es | Fuente |
|---|---|---|
| implante GLASS VIPER, «stage-1 loader» | La capability de E7 [V3] | `src/data/s2.ts:583`; `video/diamond-e7/src/scenes/S03Victim.tsx:316` |
| SHA-256 `9f3a...e1` = `9f3a2c...e1` | Hash del implante de E7; es la misma muestra del sandbox | `src/data/s2.ts:584`; `src/data/s3.ts:328`; `docs/superpowers/plans/2026-09-25-lesson-videos.md:620` |
| Imphash `1b8d4f2a...` | Comparte tabla de imports con 3 muestras previas | `src/data/s3.ts:329` |
| ssdeep `3072:Ab9..:Xk2` | 94 % similar a la variante de 2026-01 | `src/data/s3.ts:330` |
| PDB `D:\proj\cicada\loader\Release\ldr.pdb` | Ruta canónica (P4) | `src/data/s2.ts:888,896`; `src/data/s3.ts:332`; `src/data/s5.ts:510`; `src/data/labs.ts:294,772` |
| `NtMapViewOfSection`, `CreateNamedPipeA`, `CreateProcessA` | Imports de la muestra; V15 cambió la lección de `MapViewOfSection` a `NtMapViewOfSection` (la regla YARA de S5 sigue encontrándola como subcadena, `src/data/s5.ts:507`) | `src/data/s3.ts:333` |
| named pipe `vc_pipe_%08x` | Formato propio; instancias `vc_pipe_4f8a1c9e` (sandbox) y `vc_pipe_3a7f09c1` (E7) [V3] | `src/data/s2.ts:584`; `src/data/s3.ts:337`; `video/diamond-e7/src/data/s03-victim.ts:38` |
| `schtasks /create /tn WindowsUpdateCheck /tr C:\ProgramData\winhlp.exe /sc onlogon` | Persistencia | `src/data/s2.ts:81-82,1174`; `src/data/s3.ts:338` |
| `winhlp.exe` (`C:\ProgramData\winhlp.exe`) | Loader según las lecciones (canon P4) | `src/data/s2.ts:80,887`; `docs/superpowers/plans/2026-09-25-lesson-videos.md:621` |
| `winhlp.exe   SHA-256 4c81...b3` | Hash del loader en el árbol de s2m5; lleva la ruta del PDB (decidido en V14, **solo para el registro**: nunca en pantalla ni en voz, por el dosier de BROKEN CHAIN, `src/data/course-gcti.ts:40`) | `src/data/s2.ts:1172,1361` |
| `C:\ProgramData\UpdSvc\updsvc.exe`, `signed=false` | Binario del implante en E7 [V3] | `video/diamond-e7/src/data/s03-victim.ts:29,32` |
| `msdtcs.exe` | Loader en Orbital (Víctima 2) | `src/data/s2.ts:895` |
| `wcssvc.exe -decode a.txt payload.bin` | `certutil` renombrado (`OriginalFileName` CertUtil.exe). V27 lo enseña como el segundo «evento de ejemplo» (`Image` `…\wcssvc.exe`), sin equipo, hora ni cuenta, y sin añadirlo a la cadena de s2m1 (§5 punto 19) | `src/data/s2.ts:1182-1183`; `src/data/s5.ts:555`; `video/reglas-aeropuerto/src/data/s04-sigma.ts:28-32` |
| `powershell.exe -nop -w hidden -enc SQBFAFgAKA...` | Ejecución tras abrir el LNK | `src/data/s2.ts:79,1165` |
| `CV_Ingeniero.zip` con `CV_Ingeniero.pdf.lnk` | Artefacto de entrega | `src/data/s2.ts:74`; `src/data/labs.ts:228` |
| mutex único (sin nombre) | Otro artefacto del loader | `src/data/s3.ts:310` |
| `GLASSVIPER_Loader_MemMap` · `$op = { 6A 40 68 00 30 00 00 }` | Regla YARA de la lección. V27 la enseña entera salvo `date` y `reference` (§7) | `src/data/s5.ts:497,509`; `video/reglas-aeropuerto/src/data/rules.ts:13-32` |
| «GLASS VIPER Staging via Renamed Certutil» | Regla Sigma, id `4b8d2f6a-9c31-4e02-b7aa-meridian0042`, sin autor. V27 la enseña entera salvo `id` y `references` (§7) | `src/data/s5.ts:531-532`; `video/reglas-aeropuerto/src/data/rules.ts:34-53` |
| T1059.001 · T1140 · T1053.005 · T1071.001 | Técnicas ATT&CK del árbol de s2m5 | `src/data/s2.ts:1166,1170,1175,1180` |
| canal secundario por API de almacenamiento en la nube | C2 de respaldo del lab2a | `src/data/labs.ts:258` |
| cuenta VPN de proveedor comprometida · webshell en el portal del proveedor | Evidencia del lab2b | `src/data/labs.ts:329,334` |

Los strings y muestras del Lab 3B (`vc_stage2.bin`, `VC_Loader_v1.dll`, `VC_Loader_v2.dll`…) están en §4.

### Actores

| Nombre | Qué es | Fuente |
|---|---|---|
| VELVET CICADA | Núcleo del grupo; intrusion set de espionaje contra el programa de propulsión; adversario de S5. Habla por primera vez en V27 (dos mensajes, abajo); la voz de la narradora no lo nombra en ningún vídeo | `src/data/course-gcti.ts:93-97`; `src/data/s3.ts:1048`; `src/data/s5.ts:312`; `video/reglas-aeropuerto/video.json:8` |
| «VC» | Firma de quien compra el acceso inicial (dossier de S1) | `src/data/course-gcti.ts:21` |
| EMBER FOX | Célula de acceso inicial, spearphishing; adversario de S1 | `src/data/course-gcti.ts:17-19` |
| GLASS VIPER | Operadores de intrusión (S2); también nombre del implante y de un intrusion set STIX (ver §5) | `src/data/course-gcti.ts:36-38`; `src/data/s2.ts:583`; `src/data/s4.ts:1023` |
| HOLLOW LANTERN | Equipo de infraestructura del adversario; adversario de S3 | `src/data/course-gcti.ts:55-57` |
| PAPER CRANE | Célula de engaño: siembra false flags; adversario de S4. Ficha en pantalla: «célula de engaño · siembra pistas falsas» [V9]; V23 repite la misma ficha | `src/data/course-gcti.ts:74-76`; `src/data/labs.ts:149`; `video/ach-matriz/src/data/s03-supuestos.ts:7`; `video/atribucion-cuadro/src/data/s03-techo.ts:4` |
| `kazuo.tanji@protonmail.com` | Email de registro; sería el *operator* si el pivote confirma. El *customer* sigue sin conocerse | `src/data/s2.ts:582,598` |
| horario laboral UTC+8 | Patrón del operador; baja diagnosticidad | `src/data/labs.ts:324,907` |
| `resource_level: organization` · `primary_motivation: organizational-gain` | Perfil STIX de GLASS VIPER | `src/data/s4.ts:1026-1027` |
| Cluster-A (Meridian) frente a Cluster-B (Orbital-2) | Se mantienen separados | `src/data/s4.ts:729-744` |
| Adversary del diamante · `UNKNOWN` | Sin nombre: «no lo sabes» y «escribes UNKNOWN»; operator (teclea) y customer (encarga y se queda el botín) viven los dos ahí [V3]. V23 lo vuelve a dibujar igual, sin datos, y el customer de Meridian no lleva rótulo (§7) | `src/data/s2.ts:564,605`; `video/diamond-e7/narration.json:133,139,165,171`; `video/atribucion-cuadro/src/scenes/parts/Diamond.tsx:4-7`; `video/atribucion-cuadro/src/scenes/S01Hook.tsx:31-34` |

Qué adversario habla en cada vídeo: el de la sección de la lección (`video.json` → `adversary`). V3 usa GLASS
VIPER (`video/diamond-e7/video.json:8`) y V4 HOLLOW LANTERN (`video/pivot-infra/video.json:8`). V9 estrena a PAPER
CRANE (`video/ach-matriz/video.json:8`) con otra voz: `sapi/Microsoft Laura` con el efecto `machine`, en lugar de
Pablo (`video/ach-matriz/narration.json:11-15`). V23 repite PAPER CRANE con esa misma voz
(`video/atribucion-cuadro/video.json:8`; `video/atribucion-cuadro/narration.json:11-15`). V27, el primer vídeo de S5, estrena a VELVET
CICADA (`video/reglas-aeropuerto/video.json:8`) con `sapi/Microsoft Pablo`, `rate` 0 y `machine`
(`video/reglas-aeropuerto/narration.json:11-15`): la misma voz que GLASS VIPER y HOLLOW LANTERN
(`video/diamond-e7/narration.json`, `video/pivot-infra/narration.json`, `adversaryVoice`); lo distingue la firma del mensaje en
pantalla, no el timbre (`video/reglas-aeropuerto/out/script-notes.md:10-11`).
En las entradas del 2026-11-27: AP03, AP04, AP05 y G08 usan HOLLOW LANTERN; AP06, que es de s3m5, usa VELVET CICADA y se sale de la regla (§5
punto 48); AP07 usa PAPER CRANE, pero su `narration.json` configura `sapi/Microsoft Pablo` y no Laura (§5 punto 53); y G02 estrena en este
registro a EMBER FOX (`video/niveles-audiencia/video.json:8`), cuyos mensajes de G01 y G03 siguen sin apuntar.


Mensajes interceptados publicados. Son canon de la voz del adversario; un guion posterior no debe contradecirlos:

| Adversario | Mensaje | Fuente |
|---|---|---|
| GLASS VIPER | «Dibuja tu diamante. Siempre te faltará una esquina: la mía.» | `video/diamond-e7/narration.json:66` |
| GLASS VIPER | «Llámame GLASS VIPER, si te consuela. Mi nombre no lo sabrás.» | `video/diamond-e7/narration.json:142` |
| GLASS VIPER | «Sígueme por la IP. Tengo catorce mil vecinos deseando conocerte.» | `video/diamond-e7/narration.json:282` |
| GLASS VIPER | «Bloquea mi hash. Así ya no me volverás a ver.» | `video/attack-piramide/narration.json` (s04-01) |
| GLASS VIPER | «Tú tienes que acertar siempre. A mí me basta con una vez.» | `video/kill-chain-eslabon/narration.json:96` (s02-07) |
| GLASS VIPER | «Mi taller no lo verás nunca. Esa parte te la pierdes.» | `video/kill-chain-eslabon/narration.json:236` (s05-01) |
| GLASS VIPER | «Tú vigila tus planos, que es lo importante. Lo demás, ni lo mires.» | `video/kill-chain-eslabon/narration.json:318` (s07-01) |
| GLASS VIPER | «Otra empresa, otro dominio, otro correo. Eso no es cosa mía.» | `video/hilos-pelicula/narration.json:143` (s03-06) |
| GLASS VIPER | «Ya me has metido en un grupo. Pues dime quién soy.» | `video/hilos-pelicula/narration.json:319` (s07-01) |
| GLASS VIPER | «En Orbital solo llamo a casa. Ahí no va a pasar nada más.» | `video/hilos-pelicula/narration.json:359` (s08-01) |
| GLASS VIPER | «Ponme todas las alarmas que quieras. Para pararme ya habrá tiempo.» | `video/coa-precios/narration.json:70` (s03-01) |
| GLASS VIPER | «Córtame ya. Me mudo en cinco minutos y vuelves a empezar.» | `video/coa-precios/narration.json:146` (s05-01) |
| HOLLOW LANTERN | «Mis certificados me los firmo yo. Nadie más tiene uno igual.» | `video/pivot-infra/narration.json:189` |
| HOLLOW LANTERN | «Mi WHOIS está tapado. Privacidad, analista. Búscate otro hobby.» | `video/pivot-infra/narration.json:277` |
| HOLLOW LANTERN | «¿Por qué no vienes a verme? Mi servidor te está esperando.» | `video/pivot-infra/narration.json:381` |
| HOLLOW LANTERN | «Ese dominio lo tiré hace meses. Ya no te sirve para nada.» | `video/stix-isac/narration.json:99` (s03-02) |
| HOLLOW LANTERN | «Súbela a un servicio público. Cuantos más ojos, mejor.» | `video/sandbox-muestra/narration.json:41` (s02-01) |
| HOLLOW LANTERN | «Bloquea esos dos, analista. Tengo más esperando su turno.» | `video/sandbox-muestra/narration.json:169` (s05-01) |
| PAPER CRANE | «Fíate de lo que ves, analista. Las pruebas nunca mienten.» | `video/ach-matriz/narration.json:89` (s03-01) |
| PAPER CRANE | «Cuenta las que te dan la razón. La que más sume, gana.» | `video/ach-matriz/narration.json:277` (s07-01) |
| PAPER CRANE | «Si una prueba es falsa, se te cae todo. Empieza de cero.» | `video/ach-matriz/narration.json:329` (s08-01) |
| PAPER CRANE | «Ponle un país al informe, analista. Todo consejo adora un nombre.» | `video/atribucion-cuadro/narration.json:88` (s03-01) |
| PAPER CRANE | «Con la primera pista que encaje ya tienes bastante. ¿Para qué más?» | `video/atribucion-cuadro/narration.json:128` (s04-01) |
| VELVET CICADA | «Una palabra de mi programa y ya me pillas. Qué fácil, analista.» | `video/reglas-aeropuerto/narration.json:82` (s03-01) |
| VELVET CICADA | «A mis herramientas las llamo como quiero. Tu regla no lo verá.» | `video/reglas-aeropuerto/narration.json:134` (s04-01) |
| HOLLOW LANTERN | «Lo dice un proveedor conocido. Ya está confirmado.» | `video/feeds-requisito/narration.json:94` (s03-01) |
| HOLLOW LANTERN | «El piloto ha ido bien. Pon ahora los criterios.» | `video/feeds-requisito/narration.json:252` (s07-01) |
| HOLLOW LANTERN | «Mismo PDB. Ya sabes quién lo escribió.» | `video/muestra-candidatos/narration.json:94` (s03-01) |
| HOLLOW LANTERN | «Si encaja en tu grafo, mételo ya en la campaña.» | `video/muestra-candidatos/narration.json:252` (s07-01) |
| HOLLOW LANTERN | «Pon dos cadenas. Dos siempre es mejor que una.» | `video/yara-condicion/narration.json:95` (s03-01) |
| HOLLOW LANTERN | «Si contiene todas tus cadenas, ya está demostrado.» | `video/yara-condicion/narration.json:253` (s07-01) |
| VELVET CICADA | «Cuantas más coincidencias salgan, mejor es la regla.» | `video/yara-prueba-entrega/narration.json:95` (s03-01) |
| VELVET CICADA | «Manda la regla y escribe cien por cien. Queda mejor.» | `video/yara-prueba-entrega/narration.json:247` (s07-01) |
| PAPER CRANE | «Ocho mil registros. Ocho mil equipos infectados.» | `video/stealers-metricas/narration.json:93` (s03-01) |
| PAPER CRANE | «La que tiene más muestras es tu mayor riesgo.» | `video/stealers-metricas/narration.json:245` (s07-01) |
| EMBER FOX | «Mándale al consejo las IP, tranquilo. Cuantas más, más seria parece.» | `video/niveles-audiencia/narration.json:83` (s03-01) |
| EMBER FOX | «Compra buena inteligencia y no te compliques. Los parches, ya si eso.» | `video/niveles-audiencia/narration.json:181` (s05-01) |
| HOLLOW LANTERN | «Pasa solo los indicadores, analista. Esos no llevan marca.» | `video/tlp-comunidades/narration.json:95` (s03-01) |
| HOLLOW LANTERN | «Llévate lo que te den y no des nada. Nadie lleva la cuenta.» | `video/tlp-comunidades/narration.json:193` (s05-03) |

V3 explica en voz que GLASS VIPER es «un nombre de seguimiento para el implante y quien lo usa»
(`video/diamond-e7/narration.json:139`).

## 4. Lo que no se puede destripar

### Regla escrita en el plan

- **Lab 3A** (`docs/superpowers/plans/2026-09-25-lesson-videos.md:427-430`): nunca se ven
  `velvet-house-trading.com` (fachada comercial, registrada con el email de kazuo; el laboratorio revela que de
  ahí sale el nombre VELVET CICADA, `src/data/labs.ts:688-691`), `stellardyn-vpn.net` (imita el portal VPN de
  Stellar Dynamics, otra aeroespacial, `src/data/labs.ts:696-699`) ni `meridian-hr-portal.com` (segundo phishing
  contra Meridian, aún sin usar, `src/data/labs.ts:704-707`).
  - Tampoco nombres parciales que los delaten: el lookalike de CT y los hermanos del lote van tapados enteros
    (`video/pivot-infra/out/script-notes.md:35-36`).
  - Resto del grafo del laboratorio: `cdn-cache-7.statichost.net` (vecino benigno de `141.98.6.10`,
    `src/data/labs.ts:720-723`), `ns1.cheap-registrar-dns.com` (trampa de ruido, `src/data/labs.ts:680-683`), el
    WHOIS con privacidad de `meridian-hr-portal.com` (callejón sin salida, `src/data/labs.ts:728-731`) y la
    mecánica (presupuesto 12, 4 activos, par 9: `src/data/labs.ts:642-644`). V4 mostró los dos vecinos de
    `141.98.6.10` tapados con la etiqueta «Lab 3A» (`video/pivot-infra/src/scenes/parts/s05-cert/PdnsConsole.tsx:200`).
  - Lo que V4 ya dejó legible, y por tanto se puede usar: `update-svc-cdn.com`, `185.220.x.x`, `CN=updatesvc`,
    `SHA1 d4:7e:02…`, `141.98.6.10`, `meridian-sso-portal.com`, `kazuo.tanji@protonmail.com`
    (`video/pivot-infra/out/script-notes.md:49-51`). La tercera IP del certificado va tapada y **sin** etiqueta de
    Lab 3A (`video/pivot-infra/out/script-notes.md:36-37`).
- **Vídeo de ACH (s4m3)**: se usa el extracto de la lección (`src/data/s4.ts:420-437`), no la solución del lab4b
  (`src/data/labs.ts:862-930`). Regla en `docs/superpowers/plans/2026-09-25-lesson-videos.md:483`.
- **Cápsula de s2m5**: necesita antes el canon de `winhlp.exe`
  (`docs/superpowers/plans/2026-09-25-lesson-videos.md:487`); ver §5, punto 1.

### Se desbloquea al vencer al boss

Cada dossier se lee tras ganar el boss de su sección, así que un vídeo de esa sección no debería contarlo antes:

| Boss (sección) | Lo que revela | Fuente |
|---|---|---|
| FIRST LIGHT (S1) | Plantillas de spearphishing y lista de objetivos aeroespaciales; el comprador firma «VC» | `src/data/course-gcti.ts:21` |
| BROKEN CHAIN (S2) | TTPs LNK → PowerShell → loader propio; el mismo PDB en tres muestras; «VELVET CICADA ya tiene cara técnica» | `src/data/course-gcti.ts:40` |
| DEEP WELL (S3) | Certificados TLS compartidos y el email kazuo.tanji@ llevan a una sola organización detrás de todas las campañas | `src/data/course-gcti.ts:59` |
| HALL OF MIRRORS (S4) | PAPER CRANE plantaba strings en cirílico y horarios falsos; el patrón es espionaje industrial | `src/data/course-gcti.ts:78` |
| LAST WORD (S5) | VELVET CICADA al descubierto; el informe llega al consejo | `src/data/course-gcti.ts:97` |

### Sin regla escrita (preguntar a Lidia antes de usarlo)

- Solución del Lab 3B: strings `vc_stage2.bin`, `{ 8B 45 FC 33 45 F8 8B 4D F4 }` y muestras `VC_Loader_v1.dll`,
  `VC_Loader_v2.dll`, `VendorUpdater.exe`, `ChatHelper.exe` (`src/data/labs.ts:777-842`).
- Final de la campaña: epílogo del Lab 5B (`src/data/labs.ts:1144`).

## 5. Contradicciones y huecos entre fuentes

Solo se listan; no se resuelven aquí. «[V3]»/«[V4]» = ese lado está en pantalla en un vídeo publicado.

1. **Binario y hash del loader en ENG-WS-041.** Las lecciones dicen `C:\ProgramData\winhlp.exe`
   (`src/data/s2.ts:80-83`) con SHA-256 `4c81...b3` en s2m5 (`src/data/s2.ts:1172,1361`); E7 usa `9f3a...e1`
   (`src/data/s2.ts:584`; `src/data/s3.ts:328`); V3 enseña `C:\ProgramData\UpdSvc\updsvc.exe` con `9f3a...e1`
   [V3] (`video/diamond-e7/src/data/s03-victim.ts:29-32`); el Lab 3B llama a la variante de Meridian
   `VC_Loader_v1.dll` (`src/data/labs.ts:816-819`). P4 dejó el `4c81...b3` sin tocar a propósito
   (`docs/superpowers/plans/2026-09-25-lesson-videos.md:626`).
   **Resuelto en parte por V7** (§7): las dos fotos son del mismo equipo, `winhlp.exe` con `4c81...b3` el 2-3 y
   `UpdSvc\updsvc.exe` con `9f3a...e1` el 5-3, y se leen como dos compilaciones del mismo loader (lectura del
   caso, dicha con cautela, no demostrada en pantalla). Siguen abiertos el nombre `VC_Loader_v1.dll` del Lab 3B y
   cuántas muestras comparten PDB (punto 11). Ojo: la muestra del sandbox con `9f3a2c...e1` crea la misma tarea
   `WindowsUpdateCheck` (`src/data/s3.ts:338`), así que entre las dos fotos cambian el hash, el nombre y la carpeta
   del ejecutable, no el nombre de la tarea. **V14** (plan A) añade, solo para el registro: `winhlp.exe` (`4c81...b3`) lleva la ruta del PDB, así que la «variante 1, la de Meridian» del Lab 3B (`src/data/labs.ts:819`) es una familia de compilaciones con ruta del PDB (`4c81...b3` el 2-3 y `9f3a...e1` el 5-3), no un solo binario; `4c81...b3` sigue sin ser la variante 2, que no la lleva (`src/data/labs.ts:826`).
2. **¿Firmada o no?** La muestra del sandbox está firmada por «Bright Meridian Software Kft.»
   (`src/data/s3.ts:334,533`); V3 muestra `signed=false` para el mismo hash [V3]
   (`video/diamond-e7/src/data/s03-victim.ts:32`). El plan dice que es la misma muestra
   (`docs/superpowers/plans/2026-09-25-lesson-videos.md:620`).
3. **Intervalo del beacon.** 60 s en `src/data/s2.ts:83,236,577` y `src/data/s3.ts:340`, y [V3]
   `video/diamond-e7/src/scenes/S06Meta.tsx:31`; 90 s en el lab2a (`src/data/labs.ts:253`). V22 dice «llama a casa
   cada minuto» en pantalla, sin jitter (`video/coa-precios/src/data/s01-hook.ts:7`).
4. **Vector de entrada.** Spearphish del CV a RR. HH. el 2026-03-02 09:41 UTC (`src/data/s2.ts:68-74`) frente a
   correo «PO revision» a `j.alvarez@` ese mismo día a las 09:14, sin zona (`src/data/s2.ts:879`), frente a cuenta
   VPN de proveedor (`src/data/labs.ts:329`) y «supplier portals» en el BLUF (`src/data/s5.ts:312`;
   `src/data/labs.ts:1016`). Las horas de s2m4 no llevan zona horaria (`src/data/s2.ts:886-897`). **Resuelto en parte por V14 (plan A):** la Víctima 1 del walkthrough de s2m4 ya no recibe el «PO revision» a `j.alvarez@` a las 09:14, sino el mismo correo del CV a las 09:41 que s2m1 (`src/data/s2.ts:886`); «PO revision» queda solo para Orbital y para los proveedores de S4 y S5. Siguen abiertos la cuenta VPN de proveedor y los «supplier portals». **Con V23** (cambio de lección del 2026-10-10), el callout «¿Necesitas atribución?» de s4m5 ya no dice que VELVET CICADA «entra por proveedores», sino que «ataca también a sus proveedores» (`src/data/s4.ts:1008`), que no choca con el correo de s2m1 (`docs/reviews/2026-10-08-fichas-tanda4/decisiones-V22-V23.md:246`). V23 no cita esa frase: su nota solo dice cómo trabaja el grupo y qué busca (`video/atribucion-cuadro/src/data/s05-decision.ts:32-33`).
5. **Quién abre el LNK.** Una analista de RR. HH. (`src/data/labs.ts:238,243`; `src/data/s2.ts:26`), pero la
   cadena ocurre en ENG-WS-041, workstation de ingeniería (`src/data/s2.ts:76,589`). V22 solo deja «RR. HH.» en la
   celda del buzón señuelo de la matriz, siempre atenuada y sin voz (`video/coa-precios/src/data/matrix.ts:60-66`); no
   sale ningún equipo ni persona.
6. **Cuál es «el dominio del phishing».** `meridian-sso-portal.com` es «el dominio del phishing inicial»
   (`src/data/labs.ts:648-651`); `cdn-sync-status.example` es «el dominio de phishing de la campaña»
   (`src/data/s3.ts:754`) y el relay del correo de s2m1 (`src/data/s2.ts:70-71,89`).
7. **Exfiltración.** 1,2 GB a `transfer-cdn-eu.example` tras staging en `.cab` (`src/data/s2.ts:883-884`) frente a
   650 MB a un servicio de ficheros tras staging en RAR bajo `C:\ProgramData\tmp` (`src/data/labs.ts:268,273,1037`).
   Además, en s2m4 sale el 2026-03-05 a las 01:47, antes de E7 (C2, `src/data/s2.ts:573`), mientras que E9, el
   evento de Actions on Objectives, es del 2026-03-07 (`src/data/s2.ts:630`; [V3]
   `video/diamond-e7/src/scenes/S10Thread.tsx:81`).
8. **Duración de la operación.** «6 meses de acceso» (`src/data/s4.ts:429`; `src/data/labs.ts:883,919`) y
   exfiltración «between March and May» (`src/data/s5.ts:312`) frente a la actividad del Cluster-A
   «nov-2025 → mar-2026» (`src/data/s4.ts:739`) y la ola de phishing del 2026-04-18 (`src/data/s5.ts:47-58`).
   V9 enseña «6 meses» en pantalla tal cual, sin fechas, así que hereda el hueco [V9]
   (`video/ach-matriz/src/data/matrix.ts:48`; `video/ach-matriz/src/scenes/parts/Whiteboard.tsx:26`).
9. **Qué es GLASS VIPER.** Operadores de intrusión (`src/data/course-gcti.ts:36-40`); implante/loader
   (`src/data/s2.ts:583`; `src/data/s3.ts:62,326`; `src/data/s5.ts:491`); intrusion set STIX y grupo de vendor
   (`src/data/s4.ts:821,1023,1055`). VELVET CICADA también es «intrusion set» (`src/data/s3.ts:1048`;
   `src/data/s5.ts:312`). V3 lo explica como nombre de seguimiento del implante y quien lo usa [V3]
   (`video/diamond-e7/narration.json:139`).
   **Lectura que usa V8** (2026-10-03, decisión de Lidia: no se renombra el intrusion set STIX de S4,
   `src/data/s4.ts:1023`): GLASS VIPER es el loader y el nombre que usan los vendors y el ISAC; VELVET CICADA es el
   intrusion set en el modelo de Meridian, el que «uses» ese loader en su grafo.
   **Sigue abierto tras V23.** La misma lección s4m5 enseña el objeto STIX con `"name": "GLASS VIPER"` como intrusion set,
   la campaña «PO-REVISION phishing wave» `attributed-to` ese set con `"confidence": 75` (`src/data/s4.ts:1020-1045`) y,
   en el callout, llama a VELVET CICADA «el cluster» (`:1008`). Además, el `75` cae en «alto» en la escala de STIX 2.1,
   frente a la «confianza media» con que la prosa describe el ejemplo (`:1050`; señalado sin comprobar contra la
   especificación en `docs/reviews/2026-10-08-fichas-tanda4/decisiones-V22-V23.md:251`). V23 deja fuera el STIX entero
   (campaign frente a intrusion set, `attributed-to`, s4m5q7) y no nombra ni a GLASS VIPER ni a VELVET CICADA, ni en voz
   ni en pantalla: dice «el grupo, el intrusion set» (`video/atribucion-cuadro/narration.json:107`;
   `video/atribucion-cuadro/out/script-notes.md:63-66,86-88`).
10. **«Tres C2» con el mismo certificado** (`src/data/s2.ts:848`; `src/data/labs.ts:314`) frente a las tres IP de
    V4: el C2, el VPS del phishing `141.98.6.10` y una desconocida [V4]
    (`video/pivot-infra/src/scenes/S05Cert.tsx:57-60`).
11. **Muestras con el mismo PDB.** Tres (`src/data/course-gcti.ts:40`) frente a dos loaders
    (`src/data/s2.ts:847,881,889`) frente a solo la variante 1 del Lab 3B (`src/data/labs.ts:775,826`). **Resuelto en parte por V14 (plan A):** son tres compilaciones con la misma ruta, `winhlp.exe` `4c81...b3` (2-3), la muestra `9f3a...e1` de E7 (5-3, `src/data/s3.ts:332`) y `msdtcs.exe` en Orbital (9-3), que es lo que dice el dosier; la lección enseña dos (`src/data/s2.ts:888,896`) y nada en pantalla dice «tres».
12. **Inquilinos de `185.220.x.x`.** «hundreds» en la explicación de un check (`src/data/s2.ts:624`) frente a
    ~14.000 (`src/data/s2.ts:598`; `src/data/labs.ts:739`; [V3] `video/diamond-e7/src/scenes/S09Quality.tsx:36`).
13. **IP del relay.** El correo sale de `mx1.cdn-sync-status.example (203.0.113.27)` el 2026-03-02
    (`src/data/s2.ts:71-72`), pero el pDNS dice que el dominio dejó esa IP el 2026-03-01 (`src/data/s3.ts:775-776,780`).
    Es un subdominio, así que puede no chocar, pero nadie lo explica. V13 enseña la IP en la línea `Received` sin comentarla (`video/kill-chain-eslabon/src/scenes/parts/LessonLog.tsx:95`).
14. **Cadena del email de kazuo.** «tres dominios más» y «seis activos nuevos» en el callout de s3m3
    (`src/data/s3.ts:590`) frente a dos dominios desde el email (`src/data/labs.ts:659-660`) y 4 activos en el
    Lab 3A (`src/data/labs.ts:643`; `src/data/s3.ts:639`).
15. **Tercera IP del certificado.** No está definida en ningún archivo; V3 la dejó para la lección de
    infraestructura (`video/diamond-e7/src/scenes/S09Quality.tsx:22-23`) y V4 la tapó sin etiqueta
    (`video/pivot-infra/out/script-notes.md:64`). El nodo del Lab 3A que usa el certificado lleva a
    `update-svc-cdn.com`, no a una IP (`src/data/labs.ts:676,712-716`).
16. **Nameservers.** Las notas de V4 dicen que el único NS del curso es un nodo del Lab 3A
    (`video/pivot-infra/out/script-notes.md:62-63`), pero s3m4 da `NS1/NS2.FASTPARK-DNS.EXAMPLE`
    (`src/data/s3.ts:769-770`). El patrón «mismos nameservers» de V4 no tiene valores
    (`video/pivot-infra/src/scenes/parts/s07-whois/shared.tsx:13`).
17. **Numeración de informes.** MER-2026-011 se cita el 2026-04-18 (`src/data/s5.ts:69,503`), con número menor que
    el MER-2026-019 de E7 (`src/data/s2.ts:571`) y el MER-2026-023 del sandbox (`src/data/s3.ts:326`).
18. **Opción mala del Lab 5B con otros datos.** «On 14 March … WKS-0211» (`src/data/labs.ts:1011`) frente a
    2 de marzo y ENG-WS-041 (`src/data/s2.ts:68,76`). Es una opción incorrecta por estilo, no por datos.
19. **Paso de `certutil`.** El árbol de s2m5 dice ser el host de s2m1 e incluye `wcssvc.exe`
    (`src/data/s2.ts:1158,1168`); la cadena de s2m1 no lo tiene (`src/data/s2.ts:79-80`). V13 enseña la cadena de s2m1, sin `certutil`, y la voz no dice qué proceso escribe `winhlp.exe`.
20. **TLD mezclados.** Dominios del actor en `.com`/`.net` (`src/data/s2.ts:29`; `src/data/labs.ts:688,696`) y en
    `.example` (`src/data/s2.ts:884,890`; `src/data/s3.ts:341,760`).
21. **Brief frente a pantalla (resuelto por la pantalla).** El brief de V4 proponía un lookalike de CT con nombre
    parcial (`video/pivot-infra/out/scene-brief.md:52-53`); el vídeo lo tapa entero [V4]
    (`video/pivot-infra/src/scenes/S06Ct.tsx:436-437`).
22. **Resto de P4 sin tocar.** El PDB genérico `C:\Users\kaz\dev\stage2\bin\release\st2.pdb` de una pregunta de
    s3m2 es de otro binario (`src/data/s3.ts:397`; `docs/superpowers/plans/2026-09-25-lesson-videos.md:627`).
23. **Ficha de V22 frente a pantalla y voz (resuelto por la pantalla y la voz).** La ficha
    (`docs/reviews/2026-10-08-fichas-tanda4/ficha-V22.md`) pedía: el sinkhole «no mata la llamada de hoy» (`:97`), y la voz
    dice «No corta la llamada en curso, pero las siguientes ya no llegan» (`video/coa-precios/narration.json:159`;
    `video/coa-precios/out/script-notes.md:53-54`); en s04, la celda única «bloquear el dominio del correo en el gateway» y
    «un dominio que no está en la lista» (`:96`, `:172`), y la voz dice «bloquear el dominio del remitente» y «Si llega un
    correo desde otro dominio» (`video/coa-precios/narration.json:119,125`), con un sobre sin ningún texto en pantalla
    (`video/coa-precios/src/scenes/parts/s04-fase/Envelope.tsx:7-11`); «el actor lo sabrá en minutos» **en lugar** de «quema
    el hilo» (`:168-170`), y la celda lleva el texto nuevo de la lección, «quema tu visibilidad», con «el actor lo sabrá en
    minutos» como glosa aparte (`video/coa-precios/src/data/matrix.ts:94`; `video/coa-precios/src/data/s05-caminos.ts:6`); el
    puente con V13 en voz (`:97`), y solo está en pantalla, «los pasos de antes ya no los puedes impedir»
    (`video/coa-precios/src/data/s05-caminos.ts:4`; `video/coa-precios/out/script-notes.md:41-43`); y dejaba a la voz nombrar a
    GLASS VIPER (`:59`), que no nombra ni a GLASS VIPER ni a VELVET CICADA (`video/coa-precios/out/script-notes.md:68`).
    El punto condicional que preveían las decisiones («s2m2 limita el tráfico a la IP del C2»,
    `docs/reviews/2026-10-08-fichas-tanda4/decisiones-V22-V23.md:129-130`) no hace falta: la lección de esta rama ya dice
    «hacia el C2» (`src/data/s2.ts:343`).
24. **La matriz de s2m2 frente a V22.** La lección la presenta como «la matriz CoA de Meridian para la intrusión de VELVET
    CICADA» (`src/data/s2.ts:319`), que puede leerse como lo desplegado; V22 la fija como menú de trabajo de la analista
    (§7). Y el ejemplo de la lección «lo monitorizas 48h» (`src/data/s2.ts:314`) coincide con los «+2 días» de E9 [V3]: si
    un guion dijera que Meridian miró 48 horas, daría a entender que vio salir los datos (punto 7;
    `docs/reviews/2026-10-08-fichas-tanda4/decisiones-V22-V23.md:52-56`). V22 no da ningún intervalo.
25. **Ficha de V23 frente a pantalla y voz (resuelto por la pantalla y la voz).** La ficha
    (`docs/reviews/2026-10-08-fichas-tanda4/ficha-V23.md`) y el storyboard hablan del «diamante del evento E7 (el de V3)»
    (`:88`; `video/atribucion-cuadro/storyboard.json:26`), pero en pantalla el diamante no lleva evento ni ningún dato y la
    voz dice «tu diamante del ataque» (`video/atribucion-cuadro/src/scenes/parts/Diamond.tsx:4-7`;
    `video/atribucion-cuadro/narration.json:25`). La tira del CISO iba a ser «la misma de V9» (`:88`), y añade el rol
    «responsable de seguridad» (`video/atribucion-cuadro/src/scenes/parts/CisoStrip.tsx:23`) que V9 no ponía
    (`video/ach-matriz/src/data/s01-hook.ts:24-28`). El «muro» de s03 (`:90`) no se dibuja: es el mismo cuadro bajo el foco
    (`video/atribucion-cuadro/storyboard.json:60`; `video/atribucion-cuadro/out/script-notes.md:227`). Las respuestas a
    PAPER CRANE cambian de forma: la ficha proponía «Claro que lo propone quien se dedica a sembrar pistas falsas…» y
    «cuánto da una pista fácil» (`:108-112`), y la voz dice «Y PAPER CRANE, más. Vive de sembrar pistas falsas, y las prisas
    le vienen de perlas.» y «cuánto pesa una pista fácil» (`video/atribucion-cuadro/narration.json:85,125`). La nota de s05
    era «de tres líneas» en plural («cómo trabajan», «qué buscan», «para quién trabajan», `:92`), y en pantalla son cuatro, en
    singular y con el grupo como sujeto: «cómo trabaja el grupo:», «qué busca:», «quién teclea:», «para quién trabaja:»
    (`video/atribucion-cuadro/src/data/s05-decision.ts:31-36`; `video/atribucion-cuadro/out/script-notes.md:145`). La banda
    1 dice «qué máquinas y herramientas actuaron», no «qué equipos» (`:89`), porque en la lección «equipo» es del segundo
    nivel (`video/atribucion-cuadro/src/data/levels.ts:30`; `src/data/s4.ts:984`;
    `video/atribucion-cuadro/out/script-notes.md:210`). La columna «a quién le sirve el país» suma «decisiones geopolíticas
    de negocio», que es de la lección (`video/atribucion-cuadro/src/data/s05-decision.ts:13`; `src/data/s4.ts:1008`). Y las
    confianzas de la tabla salen como «alta» y «moderada» (la palabra de V9), donde la lección pone «Alta» y «Media»
    (`video/atribucion-cuadro/src/data/levels.ts:33,43,53-54`; `src/data/s4.ts:991-993`): mismo grado. La del sponsor va con
    «, y solo con fuentes que tu red no tiene»; el «baja con solo telemetría» que la lección añadió con V23 (`:993`) no sale.
26. **¿El pipe dispara solo?** La prosa de s5m3 dice que los artefactos únicos, «PDB, pipe con formato propio, mutex», «pueden disparar solos»
    (`src/data/s5.ts:520`), pero la regla que enseña le pide compañía al pipe: `$pdb or 2 of ($api, $pipe, $op)` (`:515`). V27 lee la regla, no la
    prosa: `$pipe` lleva «molde propio · aquí, de compañía» y solo `$pdb` va «único» y solo (`video/reglas-aeropuerto/src/data/s03-condicion.ts:25`,
    `:27`; en voz, «La única que va sola es una ruta que a veces queda escrita al compilar, la del PDB», `video/reglas-aeropuerto/narration.json:107`).
27. **En qué nivel de la pirámide va cada regla.** La tabla de s5m3 pone la Sigma entera en TTPs (`src/data/s5.ts:565`); el árbol de s2m5 pone la línea
    `wcssvc.exe -decode …` en «TTP - tough» (`src/data/s2.ts:1182-1185`); V7 puso `wcssvc.exe (CertUtil)` en Tools
    (`video/attack-piramide/src/data/s04-piramide.ts:38`). V27 no rotula ningún nivel: sus tres chips dicen solo qué mira cada detección, «el nombre del
    disco», «el nombre original» y «la cadena entera» (`video/reglas-aeropuerto/src/data/s05-aguanta.ts:34`; `docs/reviews/2026-10-14-fichas-tanda5/ficha-V27.md:122-127`).
28. **[AP03] La cadena de citas Faro/Atlas/Eco tiene tres órdenes distintos.** AP03 dibuja Faro «observa» → Atlas «cita» → Eco «reproduce» → «blog»
    (`video/feeds-requisito/src/scenes/S04Caso.tsx:50-52,79`; `video/feeds-requisito/narration.json:131`). La ampliación de s4m2 dibuja otra cosa en
    su diagrama, «Sensor de Faro → informe Faro → feed Eco → blog Z» con Atlas citando el mismo informe por su lado
    (`src/data/practical/analysis-yara.ts:73`), aunque su resolución, justo debajo, dice lo mismo que el vídeo, «Si Eco cita a Atlas y Atlas cita a
    Faro» (`:74`). La tabla de s3m1 dice que Eco «suele citar a Faro/Atlas» (`src/data/practical/collection.ts:27`) y el check de s3m4, que Eco cita
    «la misma observación de Faro» (`:127`). Y la ficha de G09 la resume como «Faro → Eco → Atlas → blog Z»
    (`docs/superpowers/plans/fichas-gcti/G09-falacias-cti.md:106`). En todas Faro es el origen; cambia quién cita a quién. Manda la pantalla de AP03.
29. **[AP03] «Tres publicaciones», pero cuatro nodos.** La voz y la pregunta cuentan tres («una observación que viajó por tres publicaciones», «¿Tres
    publicaciones o tres observaciones?», `video/feeds-requisito/narration.json:131,140`) y la pantalla añade un cuarto, «blog · otra publicación»
    (`video/feeds-requisito/src/scenes/S04Caso.tsx:79`), que la voz no nombra y que no recibe «mismo recorte» ni hora de entrega (`:83-87,94-101`).
30. **[AP03] La línea base pierde un elemento entre s02 y s09.** En s02 son tres, «registros internos», «intercambio sectorial», «feeds actuales»
    (`video/feeds-requisito/src/scenes/S02Caso.tsx:102-104`; `video/feeds-requisito/narration.json:79`); en s09, «Base al piloto» enseña solo
    «registros internos» y «feeds actuales» (`video/feeds-requisito/src/scenes/S09Caso.tsx:68-69`). Sin efecto en el argumento.
31. **[AP03] «Compras Faro» frente a «sujeto a presupuesto y contrato».** En s08 la compra queda condicionada («La contratación sigue dependiendo del
    presupuesto y del contrato», `video/feeds-requisito/narration.json:305`; `video/feeds-requisito/src/scenes/S08Caso.tsx:61`) y la voz dice
    «priorizas» (`narration.json:295`); en el cierre dice «por qué compras Faro para una necesidad y valoras Atlas para otra» (`:383`). El vídeo no
    enseña ninguna contratación: un guion posterior no debería dar por hecho que Meridian tiene Faro contratado.
32. **[AP03] «Ya recibe casi todos los datos de Atlas», y Atlas es una de las tres ofertas.** El vídeo lo afirma como premisa del ejercicio
    (`video/feeds-requisito/narration.json:289`; `video/feeds-requisito/src/scenes/S08Caso.tsx:45`), pero Atlas se presenta como «oferta ficticia» por
    comprar (`video/feeds-requisito/src/scenes/S01Hook.tsx:37`) y en R2 aporta 45 incrementales que no estaban en la base
    (`video/feeds-requisito/src/scenes/S05Caso.tsx:26`). Se lee como «casi todo lo de Atlas *para R1*» (3 de 90), que es lo que dice la tabla; hueco
    heredado de la lección, donde la frase es el enunciado de un check (`src/data/practical/collection.ts:40`).
33. **[AP03] Faro y Eco ya «existen» con fecha en el Lab 5B.** En los casos opcionales del laboratorio, el «Feed Faro» resume un aviso de DLP de Meridian el
    2026-05-06 y el «Feed Eco» lo copia (`src/data/lab-challenges/report.ts:12-13`), y el 2026-05-08 «Faro y Eco» titulan un intento contra el portal
    de proveedores (`:25`). AP03 los presenta como ofertas que Meridian todavía compara, sin fecha (`video/feeds-requisito/src/scenes/S01Hook.tsx:31,37`).
    No choca (un feed puede publicar sobre Meridian sin que Meridian lo compre), pero nadie dice si el piloto es anterior o posterior a mayo de 2026,
    ni si esos casos del laboratorio son canon de la campaña. Además, en esos casos «R1»…«R5» son ids de evidencia, no los requisitos R1/R2 del vídeo.
34. **[AP03] «Intercambio sectorial» en la línea base, sin fecha, frente a V8.** La línea base de Meridian incluye «intercambio sectorial»
    (`video/feeds-requisito/src/scenes/S02Caso.tsx:103`), y el canon fija que la TIP de Meridian consultó por primera vez la colección del ISAC
    aeroespacial el 2026-07-02 (§2, fila del 2026-07-02; `src/data/s3.ts:1067`, `:1091`). Como AP03 no lleva fecha no hay choque, pero
    si alguien fecha el piloto antes del 2-7, esa parte de la base todavía no existiría.
35. **[AP03] La ficha, desfasada (resuelto por la pantalla).** La ficha sigue diciendo «Escenas audiovisuales y grabación pendientes de producción» y «9:05»
    (`docs/superpowers/plans/2026-10-19-videos-ampliaciones/AP03-feeds-requisito/ficha-produccion.md:7,11`); el vídeo está producido y dura 9:06
    (`video/feeds-requisito/src/timeline.json:7`). Su «R1 literal: investigar indicios sectoriales…» (`:53`) tampoco es el literal de la lección («del
    sector aeroespacial», `src/data/practical/collection.ts:9`); la pantalla usa las dos formas (`S02Caso.tsx:41`; `S08Caso.tsx:32`).
36. **[AP04] Cuánto pesa una ruta de PDB compartida.** V14 y V15 dejaron en pantalla la regla «si otro programa trae la misma · mismo taller · enlace
    fuerte» (`video/hilos-pelicula/src/data/s04-taller.ts:14`; `video/sandbox-muestra/src/data/s05-etiqueta.ts:19`) y la lección de s2m4 la
    puntúa «**Fuerte** — mismo entorno de build del actor» (`src/data/s2.ts:908`). AP04, en la misma lección que V15, dice que la ruta «no dice
    quién lo escribió» y «puede copiarse o falsearse» (`video/muestra-candidatos/src/scenes/S03Etiqueta.tsx:50`, `:67`;
    `video/muestra-candidatos/narration.json:91`, `:101`), y su adversario ridiculiza justo esa lectura («Mismo PDB. Ya sabes quién lo
    escribió.», `:94`). No chocan del todo (V14 habla de agrupar, no de saber quién escribe; AP04, de que una ruta sola no basta), pero el
    matiz ya está en la lección base y no en el registro: `src/data/s3.ts:348` añade una «Aclaración del vídeo (02:02)» que llama
    «simplificaciones de la grabación» a «delata una variante recompilada» y «salen del mismo taller»
    (`video/sandbox-muestra/narration.json:194`, `:212`), y el callout de `src/data/s3.ts:310` ya dice «pista entre variantes que exige
    corroboración». La entrada de V15 en §7 no recoge esa aclaración.
    Además, el título en pantalla de s03, «La etiqueta y la firma» (`video/muestra-candidatos/src/timeline.json:12`; lo dibuja
    `video/engine/src/overlay/ChapterRail.tsx:157-161`), usa «la etiqueta» a secas para la ruta del PDB, contra la regla apuntada en §7, V13
    («Nunca «la etiqueta» a secas»).
37. **[AP04] El registro cita una línea de la lección que ya no dice eso.** §2 (fila «2026-01») y §3 («Capacidades», ssdeep) dan «94 % similar a la
    variante de 2026-01» con `src/data/s3.ts:330`; esa línea dice hoy «(puntuación 94 frente a candidato de 2026-01; no probabilidad)»
    (`src/data/s3.ts:330`). El «94% similar a variante de 2026-01» sigue en pantalla en V15
    (`video/sandbox-muestra/src/data/report.ts:40`; resumido como «94 % · variante de 2026-01» en
    `video/sandbox-muestra/src/data/s05-etiqueta.ts:14`). Hay que rehacer las dos filas: la
    cifra es de la lección y de V15; «variante» solo de V15.
38. **[AP04] Dos «94» de ssdeep en la misma lección.** El del informe MER-2026-023 compara la muestra de Meridian con un candidato de 2026-01
    (`src/data/s3.ts:330`); el de AP04 compara la ficha A con la ficha C y se explica por una biblioteca común
    (`video/muestra-candidatos/src/scenes/S04Noventa.tsx:61`, `:64`; `src/data/practical/collection.ts:81`). Misma cifra, pares distintos: un
    guion posterior no debe leer el segundo como dato del caso ni usar a C como «la variante de 2026-01».
39. **[AP04] Relleno «inventado» que se parece al canon.** Tres valores del ejercicio rozan datos fijos: `ldr.pdb`
    (`video/muestra-candidatos/src/scenes/S03Etiqueta.tsx:54`; `video/muestra-candidatos/src/scenes/S05Consultas.tsx:17`) es el nombre de
    fichero del PDB canónico (`src/data/s3.ts:332`); `cicada-demo-v1` (`S05Consultas.tsx:16`) lleva la palabra de la ruta del PDB, que es un
    hallazgo del Lab 3A (V14, «No se toca»); y «Meridian Demo Signing» (`S05Consultas.tsx:18`) pone el nombre de la víctima en un firmante,
    cuando el de la muestra es «Bright Meridian Software Kft.» (`src/data/s3.ts:334`; §5 punto 2). La revisión dio `ldr.pdb` por «componente de
    una consulta ilustrativa» (`docs/reviews/2026-10-19-videos-ampliaciones.md:25`), pero en s03 sale además como la ruta del panel del PDB,
    fuera de la consulta. Nada en pantalla ni en voz une A con las muestras de Meridian; conviene decirlo en §6.
40. **[AP04] «Un informe lo menciona» frente a «no hay informe».** La tabla de la lección dice de E «Un informe menciona el mismo PDB, pero no aporta
    bytes, huella ni procedencia» (`src/data/practical/collection.ts:83`); el check de la misma lección, «Para E no hay informe accesible»
    (`:96`); y el vídeo, «alguien menciona la misma ruta de depuración» y «No tienes acceso a un informe que permita contrastarlo»
    (`video/muestra-candidatos/narration.json:289`; «sin informe accesible que permita contrastarlo»,
    `video/muestra-candidatos/src/scenes/S08Casilla.tsx:84`). El vídeo se queda con la lectura del check; la «huella» de la tabla no sale.
41. **[AP04] A qué lecciones pertenece.** El plan de la tanda lo da para s3m2 y s3m3
    (`docs/superpowers/plans/2026-10-19-videos-ampliaciones/episodios-04-05.mjs:3`; ficha `:3`); `video.json` y el bloque solo dicen s3m2
    (`video/muestra-candidatos/video.json:9`; `src/data/practical/collection.ts:76`), y la ampliación de s3m3 no lo incrusta (`:109-119`).
42. **[AP04] Miniatura frente a montaje.** La miniatura dice «~9 min» (`video/muestra-candidatos/src/Poster.tsx:60`) y el montaje dura 8:42
    (`video/muestra-candidatos/src/timeline.json:7`); sin efecto en el canon.
43. **[AP05] `$marker` en la lección, `$family` en el vídeo.** El fragmento de la lección, su prosa y su pregunta escriben `$marker = "cicada-demo-v1"…` y
    `$marker and ($route or $hex)` (`src/data/practical/analysis-yara.ts:15,17,43`); el vídeo enseña `$family = "cicada-demo-v1" ascii wide nocase` y
    `$family and ($route or $hex)` (`video/yara-condicion/src/scenes/S02Partes.tsx:21`; `video/yara-condicion/src/scenes/S06Condicion.tsx:12,66-72`),
    que es lo que pone la regla del paquete (`public/labs/yara-practice/reference.yar:10,17`). El propio paquete mezcla los dos nombres (`MARKER` y
    `benign-marker.dat`, `public/labs/yara-practice/fixtures.py:8,21`). La voz dice siempre «el marcador», así que no se oye; se ve al comparar la
    pantalla con el bloque de código de la lección. Manda la pantalla (y `reference.yar`): es la lección la que llama distinto a la misma cadena.
44. **[AP05] `MiRegla.yar` frente a `mi-regla.yar`.** El vídeo rotula el fichero descargado `MiRegla.yar` (`video/yara-condicion/src/scenes/S09Escribir.tsx:45`);
    el editor de la lección descarga `mi-regla.yar` (`src/components/YaraPractice.tsx:28,52`), el README del paquete pide ese nombre
    (`public/labs/yara-practice/README.txt:9,15`) y AP06 lo usa en su comando (`video/yara-prueba-entrega/src/scenes/S02Motor.tsx:65`;
    `video/yara-prueba-entrega/src/scenes/S10Cierre.tsx:60`). El nombre de la regla, `MiRegla`, sí coincide en los tres sitios.
    Lo mismo pasa con los controles: en AP05 salen sin extensión (`benign-manual`, `video/yara-condicion/src/scenes/S01Hook.tsx:84`) y en AP06 y el
    paquete, con ella (`benign-manual.dat`, `video/yara-prueba-entrega/src/scenes/parts/data.ts:18-24`; `public/labs/yara-practice/fixtures.py:22-28`);
    el nombre de fichero real es el segundo.
45. **[AP05] C es «held-out», pero el vídeo diseña con C.** La lección manda diseñar «primero con A y B y los controles de training» y probar después «los
    casos held-out», entre ellos C (`src/data/practical/analysis-yara.ts:36,38`; `c-heldout.dat` y `benign-hex.dat` son `held-out` en
    `public/labs/yara-practice/fixtures.py:19,22`); el vídeo compara los bytes de A y C para sacar el comodín y mete a C y a `benign-hex` en la
    tabla de la que sale la condición (`video/yara-condicion/src/scenes/S05Hex.tsx:9-11`; `video/yara-condicion/src/scenes/S06Condicion.tsx:18-23`;
    `video/yara-condicion/narration.json:172,214`). El vídeo no usa las palabras «training» ni «held-out». La revisión de la tanda ya lo vio y lo
    corrigió por el lado de AP06, que presenta la repetición de C como prueba de regresión (`docs/reviews/2026-10-19-videos-ampliaciones.md:11`).
46. **[AP05] Una fecha en pantalla que no es del caso.** La regla de referencia lleva `date = "2026-10-19"` (`video/yara-condicion/src/scenes/S02Partes.tsx:17`;
    `public/labs/yara-practice/reference.yar:6`), el mismo día en que se congeló el guion (`video/yara-condicion/video.json:19`) y posterior a toda
    la cronología de §2, que acaba el 2026-07-02. Es la fecha del material (AP06 la rotula «fecha editorial 2026-10-19»,
    `video/yara-prueba-entrega/src/scenes/S09Ficha.tsx:52`), no un día de la campaña; V27 quitó la fecha de su regla justo para no fecharse
    (entrada de V27). Un guion posterior no debe leerla como «Meridian escribió una regla en octubre».
47. **[AP05] «cicada» en una cadena de práctica.** El marcador sintético `cicada-demo-v1` (`video/yara-condicion/src/scenes/S02Partes.tsx:21`) comparte la
    palabra con la ruta del PDB del caso, `D:\proj\cicada\loader\Release\ldr.pdb` (§3, «Capacidades»), y AP04 lo usa como valor de una consulta de
    ejemplo junto a `"ldr.pdb"` (`video/muestra-candidatos/src/scenes/S05Consultas.tsx:16-17`), aunque el guion gráfico pide que A, B y C sean
    «distintos de los candidatos de AP04» (`video/yara-condicion/storyboard.json:35`). Nada en AP05 dice que ALRTDEMO sea el loader ni una muestra
    de VELVET CICADA, y el sello lo niega (`video/yara-condicion/src/scenes/S01Hook.tsx:61`); queda el parecido, sin explicar. La voz no lo comenta.
48. **[AP06] Adversario que no es el de la sección.** §3 dice que en cada vídeo habla «el de la sección de la lección»
    (§3, «Actores», párrafo «Qué adversario habla en cada vídeo»). s3m5 es de S3, cuyo adversario es HOLLOW LANTERN (`src/data/course-gcti.ts:55`), y así
    lo hacen AP05, en la misma lección (`video/yara-condicion/video.json:8-9`), y los otros dos vídeos de S3 de la tanda
    (`video/feeds-requisito/video.json:8-9`; `video/muestra-candidatos/video.json:8-9`). AP06 pone a VELVET CICADA
    (`video/yara-prueba-entrega/video.json:8-9`). La ficha lo da por hecho («firmado VELVET CICADA», `ficha-produccion.md:83`) y asigna el vídeo
    a dos lecciones, «s3m5, s5m3» (`:3`), lo que explicaría que hable el de S5; pero `video.json` solo dice s3m5. Dos vídeos seguidos de la
    misma lección quedan con dos adversarios distintos.
49. **[AP06] La voz de VELVET CICADA frente a la de V27.** §7 (V27) fija que «tutea, dice "analista"», con ironía
    (§7, V27, punto «VELVET CICADA»). Aquí ninguno de los dos mensajes dice «analista» ni habla en primera persona
    (`video/yara-prueba-entrega/narration.json:95`, `:247`). No se contradicen (siguen siendo atajos de método y no confiesan nada), pero el
    rasgo «dice analista» deja de valer para todos sus mensajes.
50. **[AP05, AP06] «hex: igual» frente al byte que cambia.** En s04 la pantalla dice de C «hex: igual» (`video/yara-prueba-entrega/src/scenes/S04Regresion.tsx:67`);
    en el paquete, C lleva `41 4c 52 54 99 7f` y A `41 4c 52 54 22 7f` (`public/labs/yara-practice/fixtures.py:10`, `:19`), la lección dice
    «C cambia la ruta y un byte» (`src/data/practical/analysis-yara.ts:38`) y AP05 lo enseña marcando esa posición
    (`video/yara-condicion/src/scenes/S05Hex.tsx:9-10`, `:33`). Lo que se conserva es que el patrón con comodín sigue coincidiendo, no los
    bytes. La voz lo dice bien («conserva otros rasgos del objetivo», `video/yara-prueba-entrega/narration.json:132`).
    El propio AP05 usa la misma abreviatura una escena después, «C cambia la ruta pero conserva los bytes»
    (`video/yara-condicion/src/scenes/S06Condicion.tsx:91`), con la voz matizándolo (`video/yara-condicion/narration.json:214`).
51. **[AP06] Quién propone bloquear.** La ampliación de s5m3 dice «Un receptor ve "12/12" y propone desplegar la regla a toda la flota»
    (`src/data/practical/analysis-yara.ts:147`) y la voz, «El receptor… propone bloquear toda la flota»
    (`video/yara-prueba-entrega/narration.json:284`); solo la pantalla lo atribuye al SOC, «Propuesta del SOC (ficticia)»
    (`video/yara-prueba-entrega/src/scenes/S08Bloquear.tsx:43`). En §3 el SOC de Meridian «pregunta, sin persona, y no decide ni despliega
    nada» (§3, «Equipos», fila del SOC): aquí propone, pero rotulado como ficticio y sin el nombre de Meridian. Además,
    «desplegar» (lección) frente a «bloquear» (vídeo).
52. **[AP06] Responsable de la ficha.** La nota de entrega de s5m3 dice «Responsable: equipo didáctico ficticio; revisar ante nuevos fixtures» y
    «Acción: práctica y triaje; no bloqueo automático ni atribución» (`src/data/practical/analysis-yara.ts:146`); la ficha de s09, «dueño
    didáctico del ejercicio», «ante nuevos fixtures o errores» y «práctica o punto de partida»
    (`video/yara-prueba-entrega/src/scenes/S09Ficha.tsx:58-60`). Misma idea con otras palabras; solo importa si alguien quiere que el vídeo y
    el modelo de la lección digan lo mismo letra por letra.
53. **[AP07] La voz de PAPER CRANE cambia de timbre.** V9 lo estrenó con `sapi/Microsoft Laura` y `machine` «en lugar de Pablo», y V23 repitió «esa misma voz»
    (§3, párrafo «Qué adversario habla en cada vídeo»; `video/ach-matriz/narration.json:11-15`; `video/atribucion-cuadro/narration.json:11-15`). AP07 lo
    configura con `sapi/Microsoft Pablo`, `rate` 0, `machine` (`video/stealers-metricas/narration.json:9-13`), la voz de GLASS VIPER, HOLLOW LANTERN y
    VELVET CICADA. Los cuatro hermanos de la tanda llevan el mismo bloque, sea cual sea su adversario (`video/feeds-requisito/narration.json:9-13`,
    `video/muestra-candidatos/narration.json:9-13`, `video/yara-condicion/narration.json:9-13`, `video/yara-prueba-entrega/narration.json:9-13`), así que
    parece un valor por defecto del generador y no una decisión; la ficha solo dice «No hace falta una voz nueva»
    (`docs/superpowers/plans/2026-10-19-videos-ampliaciones/AP07-stealers-metricas/ficha-produccion.md:23`). Con qué voz sonó en el vídeo publicado no se
    puede comprobar desde el repositorio: el audio publicado no está en él.
54. **[AP07] «Ocho mil» coincide con el tamaño de Meridian.** El mensaje dice «Ocho mil equipos infectados» (`video/stealers-metricas/narration.json:93`) y la
    pantalla, «no son 8.000 equipos infectados» (`video/stealers-metricas/src/scenes/S03Caso.tsx:95`); Meridian tiene «8.000 empleados»
    (`src/data/labs.ts:63`) y «8,000 endpoints» (`src/data/labs.ts:432`). Aquí son los 8.000 registros de Bruma en Demo-P
    (`video/stealers-metricas/src/scenes/parts/data.ts:23`), pero un guion posterior podría leerlo como «todo el parque de Meridian infectado». Es una
    coincidencia de la lección (`src/data/practical/analysis-yara.ts:101`), no una contradicción.
55. **[AP07] Una fecha posterior a toda la cronología.** La ventana del dataset es del 1 al 30 de septiembre de 2026
    (`video/stealers-metricas/src/scenes/S05Caso.tsx:72`; `video/stealers-metricas/src/scenes/S01Hook.tsx:55`), y la última fila fechada de §2 es el
    2026-07-02 (§2). La lección la llama «Ventana inventada» (`src/data/practical/analysis-yara.ts:99`) y la
    ficha, «ejercicio didáctico sin fecha de incidente» (ficha `:25`), pero el vídeo pone a «Meridian» haciendo el ejercicio con esos datos
    (`video/stealers-metricas/narration.json:30`): nadie dice si ese ejercicio ocurre después de la campaña, ni si la intrusión ya se conoce entonces.
56. **[AP07] El requisito de Meridian frente a los PIR del caso.** «investigar exposición de sesión en su sector»
    (`video/stealers-metricas/src/scenes/S07Caso.tsx:37`; `src/data/practical/analysis-yara.ts:113`) no aparece en el taller de PIR ni lo pide el CISO
    (`src/data/labs.ts:53-63`). El vídeo no lo llama PIR, pero sí «Requisito de Meridian», y §3 no tiene ninguna fila de requisitos.
57. **[AP07] Ficha y registro: dos lecciones; manifiesto y bloque: una.** La ficha y el índice de la tanda lo asignan a «s4m4, s5m5» (ficha `:3`;
    `docs/superpowers/plans/2026-10-19-videos-ampliaciones/episodios-06-07.mjs:106`), y `video.json` solo a s4m4 (`video/stealers-metricas/video.json:9`).
    El bloque de vídeo está solo en s4m4 (`src/data/practical/analysis-yara.ts:106`); la ampliación de s5m5 lleva un enlace a s4m4 y ningún vídeo
    (`:158-166`), aunque la escena s09 es su contenido.
58. **[AP07] Pantalla frente a voz, dentro del vídeo (sin efecto sobre los datos).** En s07 la voz dice «Tampoco demuestra que todos esos operadores tengan las
    mismas capacidades o que las usaran en cada caso» (`video/stealers-metricas/narration.json:258`) y el rótulo dice otra cosa, «capacidad descrita no es
    material robado» (`video/stealers-metricas/src/scenes/S07Caso.tsx:48`): compatibles, pero no son la misma idea. La voz dice «exposición de sesiones»
    (`narration.json:242`) y la pantalla, «exposición de sesión» (`S07Caso.tsx:37`). La columna de la última semana lleva el subtítulo «subconjunto del
    mes» en s07 (`S07Caso.tsx:28`) y «dispositivos» en s08 (`video/stealers-metricas/src/scenes/S08Caso.tsx:52`). La tabla de unidades de la lección llama
    «Infecciones» a lo que el dataset y el vídeo llaman «Episodios» (`src/data/practical/analysis-yara.ts:93`, `:100`;
    `video/stealers-metricas/src/scenes/S03Caso.tsx:84`).
59. **[G02] Storyboard frente a pantalla en la ficha de EMBER FOX (resuelto por la pantalla).** El storyboard de s03 pide la ficha «EMBER FOX · célula de
    acceso inicial · spearphishing» y, en la misma frase, mantiene «ni «spearphishing»» en la lista de lo que no hay
    (`video/niveles-audiencia/storyboard.json:59`): es un resto de la versión anterior, la que señaló la segunda pasada
    (`docs/reviews/2026-10-23-guiones-gcti/recheck-G01-G03.md:67-70`). En pantalla la ficha lleva «spearphishing»
    (`video/niveles-audiencia/src/data/niveles.ts:103`), igual que G01 y G03 (`video/dato-a-juicio/src/data/canon.ts:24-28`;
    `video/ciclo-pir/src/data/canon.ts:15`) y que la decisión de `docs/superpowers/plans/fichas-gcti/estado.md:31`.
60. **[G02] «toda la semana» frente a «Semanas–meses».** La viñeta del entrenador (operational) dice «estudia al rival toda la semana»
    (`video/niveles-audiencia/src/data/niveles.ts:61`; en voz, `video/niveles-audiencia/narration.json:44`) y la fila operational de la misma escena, que
    es la de la lección, da el horizonte «Semanas–meses» (`video/niveles-audiencia/src/data/niveles.ts:82`; `src/data/s1.ts:380`); la voz lo corrige dos
    frases después («Informes de campaña de semanas o meses», `video/niveles-audiencia/narration.json:56`). Lo señaló la revisión como sugerencia y no
    se aplicó (`docs/reviews/2026-10-23-guiones-gcti/recheck-G01-G03.md:74`). Es un desajuste de la analogía, no un dato del caso.
61. **[G02] «no hay quién lo use» (voz) frente a «nadie lo aplica» (pantalla) y «aporta poco» (lección).** `video/niveles-audiencia/narration.json:200`;
    `video/niveles-audiencia/src/scenes/S05Tejado.tsx:150-151`; `src/data/s1.ts:416`. La voz, con la silueta vacía, da a entender que falta el lector; la
    lección y el rótulo, que falta dónde aplicarlo. También señalado sin aplicar (`docs/reviews/2026-10-23-guiones-gcti/recheck-G01-G03.md:76`). Matiz, no
    hecho.
62. **[G02] El «hoy» de G02 no está situado respecto a G01 y G03.** G01 es «tu primera mañana en Meridian» (`video/dato-a-juicio/narration.json:26`) y G03,
    «Tu primer encargo en Meridian… llega del CISO» (`video/ciclo-pir/narration.json:27`); G02 solo dice «Hoy te llegan dos sobres»
    (`video/niveles-audiencia/narration.json:26`), sin «primer» ni orden. En G01 y G03 el consejo está «nervioso»/«inquieto» por rumores de robo de
    diseños (`video/dato-a-juicio/narration.json:44`; `video/ciclo-pir/narration.json:45`); en G02 pregunta «¿hacia dónde va el sector?» sin mencionar
    rumores (`video/niveles-audiencia/src/data/niveles.ts:27`). No chocan, pero ninguna fuente dice si el día de los sobres es antes o después del
    encargo de los PIR. Con G01 y G03 **no hay choque** en la ficha del adversario (idéntica en los tres), en la voz (Pablo + `machine` en los tres,
    `video/dato-a-juicio/narration.json:11-15`; `video/ciclo-pir/narration.json:11-15`) ni en la IP: G02 no enseña `141.98.6.10`, que solo sale en G01
    (`video/dato-a-juicio/src/data/canon.ts:7`). G03 repite la regla de G02 con otra imagen («Un informe técnico al consejo es llevar el plato a otra
    mesa», `video/ciclo-pir/narration.json:155`): coherente, y el restaurante es de G03, no de G02.
63. **[G02] Lo que `estado.md` pide apuntar de G01–G03, comprobado para ESTE vídeo** (`docs/superpowers/plans/fichas-gcti/estado.md:49`): (1) mensajes de EMBER
    FOX: **sí**, dos (`video/niveles-audiencia/narration.json:83,181`); (2) presentación como «célula de acceso inicial · spearphishing»: **sí, solo en
    pantalla** (`video/niveles-audiencia/src/data/niveles.ts:103`), nunca en voz; (3) «alojó un panel de phishing el martes» sobre `141.98.6.10`: **no
    sale** en G02 (ninguna IP con valor en `video/niveles-audiencia/src` ni en `narration.json`); eso es de G01
    (`video/dato-a-juicio/src/scenes/S02Pasos.tsx:24`; `video/dato-a-juicio/narration.json:78`) y se apunta en su entrada.
64. **[G08] El camerino cambia de color dentro del propio vídeo.** En s02 el camerino con la lista de nombres es `TLP:RED`
    (`video/tlp-comunidades/src/scenes/S02Pulseras.tsx:35-37`; en voz, «La del camerino, con tu nombre en la lista, es la roja»,
    `video/tlp-comunidades/narration.json:50`), y lo ámbar son el personal y los invitados (`:38-43`). En s04, «la foto del camerino» se dibuja con el
    camerino encendido en ámbar y una pulsera ámbar (`video/tlp-comunidades/src/scenes/S04Foto.tsx:114`, `:126`, `:149-153`), porque el informe del
    ejemplo es ámbar. La voz no choca («lleva la misma pulsera», `video/tlp-comunidades/narration.json:154`), pero quien siga la imagen al pie de la
    letra ve una foto del camerino (rojo) con pulsera ámbar. Un vídeo posterior que cite «la foto del camerino» no debe deducir que el informe era RED.
65. **[G08] La ficha «equipo de infraestructura» no es «la de V4, V8 y V15».** El comentario de la escena y el storyboard dicen que la ficha es la de esos
    vídeos (`video/tlp-comunidades/src/scenes/parts/AdversaryTag.tsx:6`; `video/tlp-comunidades/storyboard.json:58`), pero en V4 la etiqueta solo dice
    «HOLLOW LANTERN» (`video/pivot-infra/src/scenes/S01Hook.tsx:409`) y la cadena «equipo de infraestructura» no aparece en `src/` de
    `video/pivot-infra`, `video/stix-isac` ni `video/sandbox-muestra`. Manda la pantalla: desde G08 la ficha de HOLLOW LANTERN lleva esa segunda
    línea, que coincide con la del curso (`src/data/course-gcti.ts:57`).
66. **[G08] Storyboard frente a pantalla en s05 (resuelto por la pantalla).** El storyboard pide el segundo mensaje «con la misma ficha que en s03»
    (`video/tlp-comunidades/storyboard.json:89`); la escena no la dibuja (`video/tlp-comunidades/src/scenes/S05Comunidad.tsx:1-8` no importa
    `AdversaryTag`, que solo se usa en `video/tlp-comunidades/src/scenes/S03Lista.tsx:128`). En s05 el adversario solo sale en la tarjeta del motor.
67. **[G08] «Lo que sacas lleva su marca» frente al anexo saneado de S5.** La regla 2 del vídeo, «Lo que sacas de un informe lleva su marca, aunque sean
    solo los indicadores» (`video/tlp-comunidades/narration.json:218`), habla de quien **recibe** un informe ajeno. En s5m3, Meridian marca su informe
    completo `TLP:AMBER+STRICT` y saca de él un anexo de indicadores para el ISAC con `TLP:AMBER` o `GREEN` (`src/data/s5.ts:642`;
    `src/data/labs.ts:1129-1137`): es **el productor** quien vuelve a marcar su propio derivado (`src/data/s5.ts:727`). No chocan, y el vídeo deja la
    puerta abierta («se lo pides a quien lo produjo», `video/tlp-comunidades/narration.json:172`), pero la tarjeta de la regla 2 no lleva ese matiz
    (`video/tlp-comunidades/src/data/s06-recap.ts:5`): el vídeo de s5m3 que hable del anexo tiene que decir que lo emite el productor.
68. **[G08] Dos ISAC que no hay que mezclar.** El de G08 es «ISAC» a secas, de un ejemplo, y manda un informe ámbar que alguien filtra
    (`video/tlp-comunidades/src/data/s03-lista.ts:7`, `:16`); el de la campaña es el «ISAC aeroespacial», que publicó el indicador del 11-03 con
    `tlp-amber-strict` (`video/stix-isac/src/data/s05-taxii.ts:16,19`; `src/data/s3.ts:1086`). Nada en G08 dice que el ISAC aeroespacial haya abierto
    ninguna investigación ni expulsado a nadie. Y una consecuencia para guiones futuros, por la tabla que G08 deja en pantalla («Solo tu organización
    — sin clientes», `video/tlp-comunidades/src/data/tlp.ts:21`): Meridian no puede pasar tal cual a Orbital el indicador del ISAC aeroespacial.
69. **[G08] El ejemplo, en indicativo en la lección y en condicional en la voz.** La lección cuenta el fumble como algo que pasa («rota toda su
    infraestructura en horas», «pierden su ventana de detección», «queda fuera… durante meses», `src/data/s3.ts:836`); la voz lo suaviza («puede
    cambiar», «pueden perder», «puede quedar fuera», `video/tlp-comunidades/narration.json:124`, `:130`, `:136`), salvo «El ISAC abre una investigación
    por la fuga» (`:136`), y las tres fichas de pantalla van en indicativo (`video/tlp-comunidades/src/data/s03-lista.ts:14-18`). Sin efecto en el
    canon; se apunta por si un guion posterior lo cita.
70. **[AP05, AP06, AP07, G02] El `timeline.json` de `main` es el de la estimación, no el del vídeo publicado.** Les pasa a cuatro de los
    siete vídeos de esta tanda de entradas; AP03 y AP04 sí tienen en `main` la línea de tiempo de la grabación, y la carpeta de G08 no está en `main`
    (§7). En estos cuatro, la duración y los minutos se citan del inventario, de los subtítulos o de la transcripción, no de los fotogramas:
    - **AP05.** Está en modo `estimate`, con `"voice": "none"` y 16013 fotogramas
      (8:53,8; `video/yara-condicion/src/timeline.json:2,7-8`), mientras que el inventario da 541 s (`src/data/security/video-inventory.ts:2368`), los
      subtítulos llegan a `00:08:57.567` (`public/videos/yara-condicion-captions.vtt:600`) y la transcripción publicada abre la última escena en
      `[08:05]` (`public/videos/yara-condicion-transcript.txt:31`), no en el 7:58 que saldría de la estimación (fotograma 14355,
      `video/yara-condicion/src/timeline.json:19`). No afecta a ningún dato de pantalla, pero las citas de duración de este vídeo deben ir al
      inventario o a los subtítulos, no a los fotogramas. El texto de la transcripción sí coincide con `narration.json`.
    - **AP06.** `video/yara-prueba-entrega/src/timeline.json:2,7,8` es la
      estimación (`"mode": "estimate"`, 16103 fotogramas, `"voice": "none"`), 8:57; el registro de vídeos producidos da 532 s
      (`src/data/security/produced-videos.json:2488`) y los subtítulos publicados acaban en 08:47.667
      (`public/videos/yara-prueba-entrega-captions.vtt`, último bloque, 133). Las demás entradas de §7 citan fotogramas de un `timeline.json` real;
      aquí esa cita no vale. A AP05 le pasa lo mismo (`video/yara-condicion/src/timeline.json:2,7`).
    - **AP07.** Está en modo estimación y sin voz, con 16043 fotogramas, 8:55
      (`video/stealers-metricas/src/timeline.json:2,4,7,8`); el inventario da 553 s (`src/data/security/produced-videos.json:2155`) y la transcripción
      publicada pone el capítulo V en 07:27 (`public/videos/stealers-metricas-transcript.txt:28`), donde la estimación lo pone en el fotograma 12856, 7:08
      (`video/stealers-metricas/src/timeline.json:18`). El texto de la voz sí coincide con `narration.json` (transcripción `:5-32`). Cualquier minuto que se
      cite de este vídeo debe salir de la transcripción o de los subtítulos, no del `timeline.json`.
    - **G02.** `video/niveles-audiencia/src/timeline.json:2,7,8` dice
      `"mode": "estimate"`, 7314 fotogramas (4:04 a 30 fps) y `"voice": "none"`, aunque `video/niveles-audiencia/narration.json:2` pide
      `recording/lidia`; el vídeo publicado dura 3:57 (`public/videos/niveles-audiencia-captions.vtt:249`; `src/data/security/video-inventory.ts:1530`,
      237 s). La duración de la entrada de §7 sale de los subtítulos, no de la línea de fotogramas, al revés que en V27. Hueco de fuente, no de contenido:
      los tiempos de cada escena del repo (p. ej. s03 desde el fotograma 2299, 1:17, `video/niveles-audiencia/src/timeline.json:12`) no son los del vídeo
      (s03 empieza en 01:08, `public/videos/niveles-audiencia-transcript.txt:10`).
71. **[AP03, G02] Dos vídeos con «dos sobres».** En AP03 son los dos requisitos de colección cerrados, R1 y R2
    (`video/feeds-requisito/src/scenes/S01Hook.tsx:68,71`), y «el mismo recorte en tres sobres» (`video/feeds-requisito/src/timeline.json:13`); en G02,
    las preguntas del consejo y del SOC y el producto que vuelve a cada uno (`video/niveles-audiencia/narration.json:26,218`). No chocan en datos,
    pero la imagen ya tiene dos sentidos y las dos entradas la dan por ocupada: un guion posterior debe decir cuál usa.
72. **[AP03] A qué lecciones pertenece.** Como AP04 (punto 41): la ficha lo da para «s3m1, s3m4, s4m2»
    (`docs/superpowers/plans/2026-10-19-videos-ampliaciones/AP03-feeds-requisito/ficha-produccion.md:3`), y `video.json` solo dice s3m1
    (`video/feeds-requisito/video.json:9`); ni la ampliación de s3m4 (`src/data/practical/collection.ts:121-136`) ni la de s4m2
    (`src/data/practical/analysis-yara.ts:67-84`) lo incrustan.

## 6. Nombres libres (relleno neutro ya usado)

- Regla de V4 para el relleno: nombres `*.example` genéricos e IP de documentación (RFC 5737), nunca datos del
  actor (`video/pivot-infra/src/scenes/S03Pdns.tsx:11-13`).
- Listín de V4: `academia-baile.example` `192.0.2.18`, `blog-recetas.example` `198.51.100.7`,
  `club-ajedrez.example` `192.0.2.41`, `taller-bicis.example` `198.51.100.63`, `tienda-flores.example`
  `198.51.100.90` y `203.0.113.24`, `vivero-sur.example` `203.0.113.90`
  (`video/pivot-infra/src/scenes/S03Pdns.tsx:22-56`). Sensores «Europa», «América», «Asia»
  (`video/pivot-infra/src/scenes/S03Pdns.tsx:40-44`).
- Generador de vecinos del hosting compartido (`tienda-flores-NN.example`…):
  `video/pivot-infra/src/scenes/S03Pdns.tsx:86-98`.
- Tablón de CT: `tienda.example` `3f:a2:91…`, `correo.example` `b1:6d:40…`, `mapas.example` `e6:12:7d…`,
  `blog.example` `7c:05:e8…`, `radio.example` `91:7f:a3…`, `fotos.example` `58:f3:1b…`, `agenda.example`
  `6a:d0:f9…`, `wiki.example` `a9:44:0e…`, `api.example` `2e:9a:c7…`, `foro.example` `0d:b8:5c…`,
  `cine.example` `c4:2b:66…`; aviso de CA gratuita `9c:41:be…` (`video/pivot-infra/src/scenes/S06Ct.tsx:29-41,61`).
- «muestra B», «muestra C», «muestra D» en el bucle de pivotes de V3 (`video/diamond-e7/src/scenes/S08Pivot.tsx:36`).
- Ojo: `198.51.100.84` y `203.0.113.27` ya son canon (`cdn-sync-status.example`, `src/data/s3.ts:775-776`); no
  se usan como relleno.
- `otro-nombre.exe`: el tercer «evento de ejemplo» de V27, un nombre cualquiera para la tarjeta cambiada
  (`video/reglas-aeropuerto/src/data/s04-sigma.ts:33-37`). Es relleno de la analogía, no un tercer nombre del actor.
- El evento legítimo de V27, `C:\Windows\System32\certutil.exe` con `OriginalFileName` `CertUtil.exe` y el mismo comando que
  `wcssvc.exe` (`video/reglas-aeropuerto/src/data/s04-sigma.ts:23-27`): de ejemplo, sin equipo ni hora; no es un hecho de Meridian.
- **Relleno de AP03 `feeds-requisito`** (§7):
  - **Faro, Atlas y Eco**: los tres feeds inventados de s3m1 y AP03 (`src/data/practical/collection.ts:25-27`;
    `video/feeds-requisito/src/scenes/parts/bits.tsx:12-16`), con sus iconos (radar, globo, capas). Relleno didáctico, pero **ya no libres**: llevan
    cifras fijas (piloto, p95, licencia, triaje) y un papel fijo en la cadena de citas (Faro origen, Atlas cita, Eco reproduce). También salen en la
    ampliación de s4m2 (`src/data/practical/analysis-yara.ts:73-74`) y en el Lab 5B (`src/data/lab-challenges/report.ts:12-13,25`).
  - **«blog»** sin nombre, cuarto eslabón de la cadena (`video/feeds-requisito/src/scenes/S04Caso.tsx:79`); «blog Z» en la lección de s4m2
    (`src/data/practical/analysis-yara.ts:73`).
  - El vídeo no usa dominios `.example`, IP de documentación, hashes, nombres de persona ni de empresa aparte de Meridian.
- **Relleno de AP04 `muestra-candidatos`** (§7):
  - Fichas del ejercicio de AP04, también en la lección (`src/data/practical/collection.ts:78-83`): «Muestra A» y candidatos «B», «C», «D»,
    «E» (`video/muestra-candidatos/src/scenes/S01Hook.tsx:81`, `:101-103`); imports `I1` y cadena `DEMO-CFG-7` (`:89-90`). Ojo: V3 ya usó
    «muestra B», «muestra C», «muestra D» como relleno de su bucle de pivotes (`video/diamond-e7/src/scenes/S08Pivot.tsx:36`); no son las
    mismas ni las de AP05/AP06 («A/B/C de este laboratorio son distintos de los candidatos de AP04»,
    `docs/superpowers/plans/2026-10-19-videos-ampliaciones/README.md:41`).
  - `...\proyecto-demo\ldr.pdb`: la ruta del PDB del ejercicio (`video/muestra-candidatos/src/scenes/S03Etiqueta.tsx:54`), solo de pantalla.
    Comparte nombre de fichero con el PDB canónico; no es la ruta del actor.
  - Valores de sintaxis de las consultas (`video/muestra-candidatos/src/scenes/S05Consultas.tsx:15-18`):
    `imphash:11111111111111111111111111111111`, `content:"cicada-demo-v1"`, `metadata:"ldr.pdb"`, `signature:"Meridian Demo Signing"`.
    `cicada-demo-v1` lo comparte con AP05 `yara-condicion` (`video/yara-condicion/src/scenes/S02Partes.tsx:21`) y con la ampliación de YARA
    (`src/data/practical/analysis-yara.ts:15`). «Meridian Demo Signing» no es un firmante del caso.
  - Solo en la lección, no en el vídeo: `contacted_ip:192.0.2.10`, `similar-to:aaaa…` y `ssdeep:"3072:ABCDEFGH:ABCD"`
    (`src/data/practical/collection.ts:72`). `192.0.2.10` ya es relleno en GLASS HARBOR (`video/siem/src/data/s08-triage.ts:16`).
- **Relleno de AP05 `yara-condicion`** (§7):
  - El formato y la regla: `ALRTDEMO`, `Alertopolis_Demo_Family`, `author = "Alertopolis"`, `version = "1.0"`, `date = "2026-10-19"`
    (`video/yara-condicion/src/scenes/S02Partes.tsx:13-18,20`); la regla del alumno, `MiRegla`, y su fichero `MiRegla.yar`
    (`video/yara-condicion/src/scenes/S01Hook.tsx:34`; `video/yara-condicion/src/scenes/S09Escribir.tsx:29,45`).
  - Las cadenas sintéticas: `cicada-demo-v1` (en B, la misma cadena en mayúsculas, solo como bytes), `route=/collect-demo`, `41 4C 52 54 22 7F` (A), `41 4C 52 54 99 7F` (C) y
    el patrón `41 4C 52 54 ?? 7F` (`video/yara-condicion/src/scenes/S02Partes.tsx:21-23`; `video/yara-condicion/src/scenes/S04Wide.tsx:13-14`;
    `video/yara-condicion/src/scenes/S05Hex.tsx:9-11`). Ojo: `cicada-demo-v1` también sale en AP04
    (`video/muestra-candidatos/src/scenes/S05Consultas.tsx:16`).
  - Los archivos: «Archivo A», «Archivo B», «Archivo C»; `benign-common`, `benign-hex`, `benign-manual`, `boundary-4096`, `large`,
    `future-uncovered` (`video/yara-condicion/src/scenes/S01Hook.tsx:76-77,84`; `video/yara-condicion/src/scenes/S08Limite.tsx:60,65,89`); el texto
    «Manual de laboratorio» (`video/yara-condicion/src/scenes/S07Manual.tsx:66`). «Archivo A/B/C» no son las «muestra B/C/D» de V3.
  - La regla ingenua de s03: `$a = "Mozilla/5.0"`, `$b = "kernel32.dll"`, `2 of them` (`video/yara-condicion/src/scenes/S03Comunes.tsx:32-35`):
    de ejemplo, no una regla de Meridian.
- **Relleno de AP06 `yara-prueba-entrega`** (§7):
  - El paquete de práctica de YARA, ya usado en AP05 y AP06 como relleno de ejercicio, **no** del actor: formato inventado `ALRTDEMO`; ficheros
    `a.dat`, `b-wide.dat`, `c-heldout.dat`, `benign-route.dat`, `benign-marker.dat`, `benign-hex.dat`, `benign-manual.dat`,
    `benign-common.dat`, `empty.dat`, `large.dat`, `future-uncovered.dat`, `boundary-4096.dat`
    (`video/yara-prueba-entrega/src/scenes/parts/data.ts:12-25`; `public/labs/yara-practice/fixtures.py:17-28`); reglas
    `Alertopolis_Demo_Family`, `Alertopolis_Demo_Sample`, `Alertopolis_Demo_Hunt` (en AP06, `Sample`, `Family`, `Hunt`,
    `video/yara-prueba-entrega/src/scenes/S05Reglas.tsx:21-25`, y el nombre entero en `S09Ficha.tsx:51`; `public/labs/yara-practice/reference.yar:2`,
    `:20`, `:29`); «alcance ALRTDEMO v1» (`S05Reglas.tsx:122`).
  - `mi-regla.yar` y `MiRegla`: el fichero y la regla del alumno (`video/yara-prueba-entrega/src/scenes/S01Hook.tsx:79`;
    `video/yara-prueba-entrega/src/scenes/S10Cierre.tsx:60`).
  - «YARA 4.5.4» y «fecha editorial 2026-10-19» (`video/yara-prueba-entrega/src/scenes/S02Motor.tsx:63`;
    `video/yara-prueba-entrega/src/scenes/S09Ficha.tsx:52`, `:54`): versión del motor de la captura y fecha de la regla de ejemplo. No son
    datos del caso; el 2026-10-19 no se usa como fecha de Meridian.
  - Ojo: el marcador del paquete lleva la palabra «cicada» (`cicada-demo-v1`, `public/labs/yara-practice/reference.yar:10`); es del ejercicio
    y no tiene que ver con la ruta del PDB del caso (ver §5).
- **Relleno de AP07 `stealers-metricas`** (§7):
  - **Demo-P**: proveedor inventado, «dos regiones · sin cobertura global», «anuncios seleccionados»
    (`video/stealers-metricas/src/scenes/S01Hook.tsx:58`; `video/stealers-metricas/src/scenes/S05Caso.tsx:69`; `src/data/practical/analysis-yara.ts:99`).
    No es proveedor de Meridian ni el ISAC. Ya tiene cifras asignadas: no reutilizar el nombre con otras.
  - **Bruma, Cobalto y Duna**: familias de infostealer inventadas, con su tabla (`video/stealers-metricas/src/scenes/parts/data.ts:23-25`). No son del
    actor ni variantes del loader. Tampoco son nombres libres para otra cosa: si vuelven a salir, con estas cifras y esta ventana.
  - «Familia A», «Familia B», «Operador 1», «Operador 2» (`video/stealers-metricas/src/scenes/S02Caso.tsx:82-91`): figuras abstractas del esquema.
  - «mes 1», «mes 2» (`video/stealers-metricas/src/scenes/S06Caso.tsx:59-60`): barras sin valor.
  - Sin dominios `.example`, IP de documentación, hashes ni nombres de persona nuevos.
- **Relleno de G02 `niveles-audiencia`** (§7):
  - La hoja «4.000 IP» de G02: un contador y filas grises con un chip «IP» **sin valor** (`video/niveles-audiencia/src/scenes/parts/Sheets.tsx:7-9,38-39,93`).
    No hay ninguna IP, ni de documentación, ni dominio `.example`, ni nombre de ejemplo: el vídeo no gasta relleno. La cifra 4.000 es la del check de
    la lección (`src/data/s1.ts:453`), no un dato de Meridian.
  - Imágenes ocupadas por G02 (por si §6 las quiere listar juntas): los dos sobres; el club de fútbol (jugador / entrenador / directiva); la casa de
    cinco piezas (cimientos y paredes, puerta blindada, vigilante, tejado, y Offense fuera con candado) y «el tejado sin casa». El zorro en facetas
    rosa es el dibujo de EMBER FOX (según `video/niveles-audiencia/src/scenes/parts/Fox.tsx:7`, de G01–G03), no una analogía.
- **Relleno de G08 `tlp-comunidades`** (§7):
  - El caso inventado de G08, todo sin nombre y reutilizable como relleno, nunca como hecho de Meridian: «un analista de otra empresa», «el ISAC de
    su sector» (rótulo «ISAC»), la «lista de correo abierta» de doce siluetas y el suscrito con «alias»
    (`video/tlp-comunidades/narration.json:102-124`; `video/tlp-comunidades/src/data/s03-lista.ts:7-11`). Sin dominios `.example`, sin IP de
    documentación y sin nombres de persona: las filas de indicadores son barras grises (`video/tlp-comunidades/src/scenes/parts/GreyRows.tsx:7-10`).

## 7. Vídeos publicados y su canon nuevo

Aquí se añade un bloque por vídeo cuando se produce: los datos que solo existen en pantalla.
Los identificadores son los de cada tanda: `Vn` (plan de vídeos de lección), `APnn` (prácticas complementarias de las ampliaciones del
2026-10-19) y `Gnn` (tanda GCTI del 2026-10-23, `docs/superpowers/plans/fichas-gcti/estado.md`).

### V3 · `diamond-e7` · s2m3 · YouTube `rwMIu0XBoWQ`

Lección `src/data/s2.ts:601-603`; adversario de los interceptados GLASS VIPER (`video/diamond-e7/video.json:8`).
No tiene notas de guion. Canon nuevo:

- Líneas crudas del EDR (`video/diamond-e7/src/data/s03-victim.ts:20-45`): tenant «Meridian Dynamics · sensor
  EDR»; `2026-03-05T02:11:47Z` PROC_START `image=C:\ProgramData\UpdSvc\updsvc.exe`; FILE_HASH
  `sha256=9f3a...e1  signed=false`; `02:11:49Z` PIPE_CREATE `vc_pipe_3a7f09c1`; `02:13:02Z` y `02:14:01Z`
  NET_CONN `dst=update-svc-cdn.com:443  HTTPS`.
- Alerta: `02:12` → `02:13`, «UTC · 05-03-2026», Host ENG-WS-041, «ingeniería de propulsión»,
  `update-svc-cdn.com` como «dominio desconocido» (`video/diamond-e7/src/scenes/S01Hook.tsx:196-197,225-227,277,286`).
- Ficha E7: Methodology «beacon HTTPS · 60 s · jitter»; Resources «hosting, dominio, cert TLS»
  (`video/diamond-e7/src/scenes/S06Meta.tsx:27-32`).
- Certificado «TLS autofirmado» `CN=updatesvc` (`video/diamond-e7/src/scenes/S04Infra.tsx:139-140`); contador de
  inquilinos hasta 14000; «ORO · solo lo despliega el actor»; «WHOIS histórico: pendiente»
  (`video/diamond-e7/src/scenes/S09Quality.tsx:36,122,149`).
- E9: `2026-03-07`, «+2 días», Actions on Objectives (`video/diamond-e7/src/scenes/S10Thread.tsx:80-84`).
- Ningún registrante ni IP extra en pantalla (`video/diamond-e7/src/data/s04-infra.ts:4`).

### V4 · `pivot-infra` · s3m3 · YouTube `69gfP6duB00`

Lección `src/data/s3.ts:629-631`; adversario HOLLOW LANTERN (`video/pivot-infra/video.json:8`). Notas propias en
`video/pivot-infra/out/script-notes.md:54-68`. Canon nuevo:

- pDNS de `update-svc-cdn.com`: `185.220.x.x`, first seen `2026-02-11`, last seen `2026-03-07`
  (`video/pivot-infra/src/scenes/S03Pdns.tsx:63-66`); en voz, «semanas antes de E7» y «días después»
  (`video/pivot-infra/narration.json:116`).
- WHOIS de `update-svc-cdn.com`: creado `2025-11-18`, `NameFlow LLC`, `REDACTED FOR PRIVACY`; ficha de 2025 con
  `kazuo.tanji@protonmail.com` y Registrante «no consta» (`video/pivot-infra/src/scenes/S07Whois.tsx:15-19,141-144`).
- Certificado `CN=updatesvc`, `SHA1 d4:7e:02…` (misma huella que el Lab 3A, `src/data/labs.ts:672`), en tres IP
  (`video/pivot-infra/src/scenes/parts/s05-cert/bits.tsx:6-13`).
- `pdns ip 141.98.6.10`: «3 dominios han resuelto a esta IP»: `meridian-sso-portal.com` («portal falso de login
  de Meridian») y dos tapados «Lab 3A» (`video/pivot-infra/src/scenes/parts/s05-cert/PdnsConsole.tsx:123,160,200`).
- Ficha de E7 en el gancho: «05-03-2026 · 02:13 UTC», «C2 · beacon HTTPS», IP con sello «RUIDO», «visto en 2 IP
  más» (`video/pivot-infra/src/scenes/S01Hook.tsx:212,238,257,304`).
- CT: certificado `f2:8c:37…` para un dominio tapado que «imita a Meridian»
  (`video/pivot-infra/src/scenes/S06Ct.tsx:437-438,467`).
- Ciclo de vida (genérico, no es el C2): el dominio de ejemplo se activa con «edad 120 días»
  (`video/pivot-infra/src/scenes/S08Lifecycle.tsx:328`); el bloqueo previo encuentra cinco hermanos tapados
  (`video/pivot-infra/src/scenes/S09Preblock.tsx:35`).

### V7 · `attack-piramide` · s2m5 · YouTube `mRNyVVrRujw`

Lección `src/data/s2.ts:1104` (bloque `youtube` entre el párrafo de la escalera de abstracción y el primer check del
árbol); adversario de los interceptados GLASS VIPER (`video/attack-piramide/video.json:8`). Notas propias en
`video/attack-piramide/out/script-notes.md`. Canon nuevo:

- **El árbol de s2m5 se reconstruye después de E7.** Tras la alerta del 2026-03-05 a las 02:13 UTC, Meridian mira
  en el EDR de `ENG-WS-041` cómo empezó todo; el árbol es el de la mañana del 2026-03-02, con la cabecera
  «ENG-WS-041 · 02-03-2026 · 09:44» (sin zona y sin horas línea a línea, por §5 punto 19). La reconstrucción no
  lleva hora. Nadie vio ni bloqueó nada el 2-3, como en V3 (dominio «desconocido» en E7).
- **Dos fotos del mismo equipo.** 2-3: `C:\ProgramData\winhlp.exe` · `SHA-256 4c81...b3`. 5-3, con las líneas de
  V3 sin el pipe ni `signed`: `02:11:47Z` PROC_START `C:\ProgramData\UpdSvc\updsvc.exe`, FILE_HASH `9f3a...e1`,
  `02:13:02Z` NET_CONN `update-svc-cdn.com:443`. En voz, con cautela: «todo apunta a otra compilación del mismo
  programa». No se dice cómo se sustituyó el binario ni cuál se compiló antes (la muestra `9f3a2c...e1` de s3m2
  tiene compile time 2026-02-19, `src/data/s3.ts:331`).
- **Solo para el registro (nunca en pantalla ni en voz):** `9f3a...e1` lleva el PDB (`src/data/s3.ts:332`), así
  que es la variante 1 del Lab 3B, la de Meridian (`src/data/labs.ts:775,819`); `4c81...b3` queda con rasgos
  estáticos sin definir y **no** es la variante 2 (`src/data/labs.ts:826`).
- **Dos pruebas de la analista, sin fecha ni dueño:** una regla por el hash `4c81...b3` sobre la foto del 5-3 da
  «0 coincidencias»; la regla de comportamiento de la lección («PowerShell lanzado por explorer crea una tarea
  programada no inventariada», `src/data/s2.ts:1186`), pasada por toda la cadena del 2-3, salta en la línea de la
  tarea, `09:44:20` (`src/data/s2.ts:81`). No se dice si el SOC las despliega.
- **La imagen de la pirámide** continúa la de V3: la ropa es el hash; el acento, los nombres y las rutas (V3 lo usó
  para el patrón del named pipe, lo que sobrevive a recompilar); cómo anda, los TTPs. El 5-3 «cambió de ropa y
  disimuló el acento»; no se afirma que el 5-3 se comporte igual, porque V3 no enseña ni PowerShell ni la tarea de
  ese día.
- Mensaje interceptado nuevo de GLASS VIPER: «Bloquea mi hash. Así ya no me volverás a ver.»
  (`video/attack-piramide/narration.json`, s04-01).

### V8 · `stix-isac` · s3m5 · YouTube `jNqhrLgGFmY`

Lección `src/data/s3.ts:1110` (bloque `youtube` después del check «TAXII ; STIX» y antes de «YARA en 60 segundos»);
adversario de los interceptados HOLLOW LANTERN (`video/stix-isac/video.json:8`). Notas propias en
`video/stix-isac/out/script-notes.md`. Canon nuevo:

- **El «hoy» de la lección es el 2026-07-02 (jueves), sin hora** (`src/data/s3.ts:1076`): «hoy · 02-07-2026» en el
  calendario y en el marco de la plataforma (`video/stix-isac/src/scenes/parts/TipFrame.tsx:21`). Ese día la
  plataforma de Meridian consulta **por primera vez** la colección TAXII del ISAC aeroespacial, «consulta (pull) ·
  02-07 · primera vez», y «llega todo lo que había» (`video/stix-isac/src/data/s05-taxii.ts:24,27`): por eso un
  indicador de marzo llega en julio. El ISAC ya mandaba avisos antes por otra vía (`src/data/s3.ts:73`; la prueba E4
  de s4m3, `src/data/s4.ts:431-432`); por TAXII, solo desde el 2-7. La colección no tiene nombre en pantalla.
- **El indicador del ISAC** (`video/stix-isac/src/scenes/parts/StixJson.tsx:18-32`): «Indicador STIX 2.1 · ISAC
  aeroespacial», `created` y `modified` `2026-03-11T08:00:00Z`, `valid_from` `2026-03-11T00:00:00Z`, `valid_until`
  `2026-06-25T00:00:00Z`; marca `tlp-amber-strict` (`video/stix-isac/src/data/s05-taxii.ts:16`).
- **La revalidación del 2-7:** el passive DNS de `cdn-sync-status.example` sigue acabando en `198.51.100.84 · last
  seen 2026-04-18 11:31:55`, «nada después» (`video/stix-isac/src/data/s03-caducado.ts:10-16`). El WHOIS no sale. La
  voz solo dice que el dominio **puede** cambiar de manos (el registro no caduca hasta el 2027-02-27,
  `src/data/s3.ts:765`).
- **La búsqueda hacia atrás** va del 27-02 («registro del dominio») al 02-07, con el tramo visto hasta el 18-04 y las
  retenciones del CMF: «EDR · 90 días · desde el 03-04» y «proxy · 30 días · desde el 02-06 · ya no llega»
  (`video/stix-isac/src/data/s03-caducado.ts:33-38`). Sin resultados en pantalla.
- **El grafo de la plataforma de Meridian:** `cdn-sync-status.example` «indicates» `malware · loader GLASS VIPER`;
  `intrusion-set · VELVET CICADA` «uses» ese malware (`video/stix-isac/src/data/s04-grafo.ts:13-19`). Es la lectura de
  §5 punto 9. Solo nombres: ni hash, ni ruta, ni las fechas del registro propio de Meridian.
- **Dos fuentes en el mismo nodo tras la fusión:** «incidente propio · correo del 02-03» e «ISAC aeroespacial ·
  11-03 · confianza 70», con `AMBER+STRICT` y «caducado» (`video/stix-isac/src/data/s04-grafo.ts:31-37`).
- Mensaje interceptado nuevo de HOLLOW LANTERN, sin fecha: «Ese dominio lo tiré hace meses. Ya no te sirve para nada.»
  (`video/stix-isac/narration.json`, s03-02). Encaja con el passive DNS y con V4 s08.
- **No se toca** (sigue fuera): el C2, el certificado y el correo de registro del dosier de DEEP WELL; el intrusion set
  STIX de S4 (`src/data/s4.ts:1020-1028`), la campaña «PO-REVISION phishing wave» y `attributed-to`; el indicador
  propio de Meridian para este dominio (`src/data/s5.ts:603-614`) y la ola de phishing del 18-4.

### V9 · `ach-matriz` · s4m3 · YouTube `Q2-pG0ALFKI`

Lección `src/data/s4.ts:503` (bloque `video` después del cuarto check, «Evidence that is consistent with every
hypothesis in the matrix:», y antes del callout «🎖️ Campaña»); 8:25, publicado el 2026-10-04 en el canal Alertópolis.
Adversario de los interceptados PAPER CRANE, que sale en pantalla por primera vez (`video/ach-matriz/video.json:8`), con
la voz `sapi/Microsoft Laura` y el efecto `machine` (`video/ach-matriz/narration.json:11-15`). Notas propias en
`video/ach-matriz/out/script-notes.md`. Todo va sin fecha ni hora: no se ordena contra §2. Canon nuevo:

- **La reunión de análisis se ve por primera vez** (la de la misión 4, `src/data/labs.ts:149`), sin fecha: «Meridian
  Dynamics · reunión de análisis» en el borde de la pizarra (`video/ach-matriz/src/scenes/parts/Whiteboard.tsx:35`;
  `video/ach-matriz/src/scenes/S01Hook.tsx:83`).
- **La pizarra** (`video/ach-matriz/src/scenes/parts/Whiteboard.tsx:25-33`): cuatro notas, «entrada por
  spearphishing», «6 meses sin cifrar ni extorsionar», «exfiltración selectiva de diseños de propulsión» y
  «certificado TLS compartido con una campaña de espionaje que reportó el ISAC»; junto a cada una, «encaja»; en el
  centro, «ESPIONAJE» en un círculo y «todo encaja» debajo. Es la idea que la sala ya daba por buena, no el fallo de
  nadie. El plan pedía las pruebas de la lección «tal cual»; la pizarra las resume a mano, y las filas exactas salen
  en la matriz.
- **El CISO** (sin nombre): «¿Qué busca el intruso?» y «de eso depende qué se protege primero»
  (`video/ach-matriz/src/data/s01-hook.ts:24-28`).
- **La abogada del diablo:** una compañera del equipo, sin nombre (en voz, `video/ach-matriz/narration.json:62`,
  s02-04), recibe la tarjeta «abogada del diablo · defiende lo contrario» (`video/ach-matriz/src/data/s02-fuera.ts:26`)
  y escribe en la pizarra «¿y si es un rescate?» (`video/ach-matriz/src/scenes/parts/Whiteboard.tsx:34`). Es su
  papel, no lo que cree; no «pierde».
- **La hoja KEY ASSUMPTIONS CHECK** (`video/ach-matriz/src/scenes/parts/AssumptionSheet.tsx:23-29`): «1 · no hay otra
  explicación» y «2 · las pruebas son lo que parecen», cada uno con «¿y si no?»; el segundo, con «lo comprobamos al
  final». Las tres hipótesis llevan iconos genéricos (ojo, candado, bandera; `:32`), nunca a alguien de la plantilla.
- **La matriz** es el extracto de la lección (`src/data/s4.ts:420-437`) con sus valoraciones, E3 contra H3 incluida
  (I): filas y columnas con el texto exacto (`video/ach-matriz/src/data/matrix.ts:38-67`); título «Extracto de matriz
  ACH · VELVET CICADA (ficticio)» (`:71`). Lo que cambia respecto a la lección: la leyenda dice «C = encaja · I =
  choca · N = no dice nada» (`:72`); la columna «Diagnosticidad» solo pone NULA o ALTA, con «strong link» como
  etiqueta aparte en E4 (`:80-81`); y hay una fila inventada, «cuenta de C», 4 · 1 · 1, que se tacha (`:83`, `:122`).
  «Inconsistencias» 0 · 3 · 2 y, «sin E4», 0 · 2 · 1, con «la menos inconsistente» sobre H1 (`:85-88`, `:124-126`).
  Notas: «el ransomware cobra rápido» bajo la I de E2 frente a H2 y, en ámbar, «justo lo que alguien podría plantar»
  junto a E4 (`:90-92`); nadie dice que se plantara.
- **La mesa de la conclusión:** «conclusión: H1» sobre tres patas, E2, E4 y E3; sin E4, «sin E4, sigue en pie»; solo
  con E4 sería un taburete, «baja la confianza» (`video/ach-matriz/src/scenes/parts/Table.tsx:23-30`).
- **La nota al CISO** (`video/ach-matriz/src/data/s09-informe.ts:17-46`), titulada «¿Qué busca el intruso?», con el
  sello «provisional»:
  - «Juicio: H1, la menos inconsistente (extracto de 4 pruebas)»
  - «Confianza: moderada · 4 pruebas de un extracto; aguanta sin E4»
  - «Descartadas: H2 (E2, E3, E4) · H3 (E3, E4)»
  - «Vigilar: E4»

  El encabezado «Para el CISO · Meridian Dynamics» es atrezo (`:37-38`). No es el informe final del caso, el que lee
  el consejo «el lunes» (`src/data/labs.ts:187,1144`).
- **E4 en voz es «un certificado suyo»**, indefinido (`video/ach-matriz/narration.json:210`, s05-06), para no señalar
  el `CN=updatesvc` de V3 y V4. Tras la revisión de exactitud la voz ya no lo llama «la prueba que cambiaría la
  conclusión»: «Aquí el certificado no la cambia, pero lo vigilas igual» (`:388`, s08-09;
  `video/ach-matriz/out/script-notes.md:49-51,55-56`).
- **PAPER CRANE**, ficha en pantalla: «PAPER CRANE · célula de engaño · siembra pistas falsas»
  (`video/ach-matriz/src/data/s03-supuestos.ts:7`), lo mismo que ya dice la sección (`src/data/course-gcti.ts:74-76`).
  Sus tres mensajes, sin fecha, pasan a ser canon de su voz (tutea, frases cortas, ironía; empuja atajos de método,
  nunca una hipótesis, y no confiesa nada):
  - «Fíate de lo que ves, analista. Las pruebas nunca mienten.» (`video/ach-matriz/narration.json:89`, s03-01)
  - «Cuenta las que te dan la razón. La que más sume, gana.» (`video/ach-matriz/narration.json:277`, s07-01)
  - «Si una prueba es falsa, se te cae todo. Empieza de cero.» (`video/ach-matriz/narration.json:329`, s08-01)
- Los sospechosos del yogur (la compañera de piso, el hermano y el perro) son de la analogía, no de Meridian.
- **No se toca** (sigue fuera): el dosier de HALL OF MIRRORS (`src/data/course-gcti.ts:78`): ni strings en cirílico, ni
  horarios falsos, ni «PAPER CRANE las plantó», ni «espionaje industrial sistemático» ni «caso cerrado»; de E4 solo se
  dice que es el tipo de prueba que alguien podría plantar. Del Lab 4B (`src/data/labs.ts:862-930`), sus otras cuatro
  pruebas (loader propio, horario UTC+8, silencio público, exfiltración lenta), sus notas y su mecánica; el horario
  UTC+8; las ocho frases del Lab 4A (`src/data/labs.ts:447-499`). E4 **no** se identifica con el certificado
  `CN=updatesvc` (ni la tercera IP, §5 punto 15, ni el dosier de DEEP WELL). Cluster-A y Cluster-B no salen
  (`src/data/s4.ts:729-744`). Nada del Lab 3A, del Lab 3B ni del final de la campaña.

### V13 · `kill-chain-eslabon` · s2m1 · YouTube `5pGLeaGeT7c`

Lección `src/data/s2.ts:117-122` (bloque `video` entre el segundo check de la demo, «In the EDR chain, the schtasks line and the
winhlp.exe→443 line…», y el párrafo de cierre «Cada intrusión analizada produce una kill chain documentada…»); 8:04, subido a
Alertópolis el 2026-10-06 y público el 2026-10-08. Principal. Adversario de los interceptados GLASS VIPER
(`video/kill-chain-eslabon/video.json:8`), con la voz `sapi/Microsoft Pablo` y el efecto `machine`
(`video/kill-chain-eslabon/narration.json:11-15`). Notas propias en `video/kill-chain-eslabon/out/script-notes.md`. **Ningún dato nuevo de la
intrusión:** todo lo que sale ya estaba en V3, V7 o en la lección. Canon nuevo, solo de pantalla y de voz:

- **La semana, en un calendario:** lunes 02-03, martes 03-03, miércoles 04-03 y jueves 05-03 (`video/kill-chain-eslabon/src/data/s01-alerta.ts`,
  `CALENDAR`), con «Meridian Dynamics · aeroespacial» y «tú, su analista de inteligencia». Luego sale la alerta del 5-3 como en V3 (§2).
- **La reconstrucción del 2-3 se hace después de la alerta, sin hora de reconstrucción**, como en V7. V13 le añade las cabeceras del
  correo, que V7 no enseñó: `From: "Laura Iglesias - Talent" <l.iglesias@meridian-careers.com>` («parece de casa»), `Return-Path:
  <bounce@mx1.cdn-sync-status.example>` y `Received: from mx1.cdn-sync-status.example (203.0.113.27) by mail.meridian.example; Mon, 2 Mar 2026
  09:41:07 +0000` («apuntan a quien lo envió de verdad»), el asunto «Candidatura - Ingeniero de propulsion (CV adjunto)» (sin tilde, como la
  lección) y el adjunto `CV_Ingeniero.zip` que contiene `CV_Ingeniero.pdf.lnk` (`video/kill-chain-eslabon/src/scenes/parts/LessonLog.tsx:74-120`;
  `video/kill-chain-eslabon/src/data/s03-correo.ts:7-9`). La IP va sin resaltar y sin comentar (§5 punto 13).
- **La cadena del EDR** en `ENG-WS-041`, «mismo día», con las líneas de la lección y sus horas, sin zona (§5 punto 19; `LessonLog.tsx:121-152`);
  el beacon sale rotulado solo «beacon · cada 60 s» (`video/kill-chain-eslabon/src/data/s04-equipo.ts:12`) y el nombre COMMAND & CONTROL entra
  con la respuesta. Se reconoce un LNK como «un acceso directo que se hace pasar por un PDF, dentro de un ZIP» (`video/kill-chain-eslabon/src/data/s05-taller.ts:8`).
- **Las siete fases, con la imagen del ladrón y la casa:** «Cyber Kill Chain · Lockheed Martin»; «él necesita las siete, en orden», «te basta con
  romper una a tu alcance» y «si lo intenta otra vez, empieza de nuevo» (`video/kill-chain-eslabon/src/data/s02-cadena.ts`).
  Cada prueba a su fase: el correo es **Delivery**, y que el remitente imite a Meridian no lo hace Reconnaissance («investigar a Meridian fue
  antes; usarlo para que el correo entre y se abra es entrega», `s03-correo.ts:20-24`); **Exploitation** «se ejecuta código al abrirlo»; **Installation**
  «quedarse»; el beacon es C2, no la misión; **Actions on Objectives:** «leer las carpetas de diseño, comprimirlas, sacarlas»
  (`s04-equipo.ts:8-17`).
- **Observado frente a inferido** (`video/kill-chain-eslabon/src/data/s06-frontera.ts`): Weaponization va en discontinua, «no se observa · se deduce»
  del artefacto (`s05-taller.ts:17`; en voz, `video/kill-chain-eslabon/narration.json:267`, `:285`); Reconnaissance «casi nunca la ves; a veces asoma en
  los registros de lo que tienes de cara a internet, como tu web» (`:297`). **El 5-3 la cadena reconstruida llega hasta C2 y «por lo que ves, la séptima
  no aparece»** (`video/kill-chain-eslabon/src/data/s08-cortar.ts:19`): cuadra con V3, donde la primera acción sobre el objetivo es E9 el 7-3; el vídeo
  no dice si Meridian llegó a tiempo.
- **Cortar a la izquierda** (`video/kill-chain-eslabon/src/data/s07-izquierda.ts`, `s08-cortar.ts`): «te enteras cuando ya está con los planos»; «para
  saltar antes, hay que ver antes» con «registros del correo · del equipo»; «lo paramos en Delivery» como idioma común; la entrega se corta en la «pasarela
  de correo», «en la red · antes del equipo», frente a la «estación de ingeniería»; borrar el programa o cortar el beacon «también sirven, pero ya ha
  avanzado más». Un eslabón roto frustra ese intento, no acaba con el atacante.
- **Límites del modelo** (`video/kill-chain-eslabon/src/data/s09-limites.ts`): un insider con acceso legítimo, credenciales válidas y servicios en la
  nube (SaaS); «encaja bien: intrusiones con malware y fases en fila»; se complementa con ATT&CK («el cómo, técnica a técnica») y el Diamond Model («cada
  paso, un diamante de cuatro esquinas»).
- **La etiqueta del taller = la ruta del PDB**, imagen común de V13, V14 y V15, aquí **en blanco** y con media frase en voz: «y a veces, por dentro,
  hasta la etiqueta del taller donde la montó» (`video/kill-chain-eslabon/narration.json:261`; `video/kill-chain-eslabon/src/data/s05-taller.ts:14`). La frase
  entera y la regla del enlace fuerte son de V14 y V15; V13 no enseña la ruta. Nunca «la etiqueta» a secas (V7 llamó así al disfraz del nombre de la tarea)
  ni «etiqueta de envío» (imagen de V1).
- **GLASS VIPER**, tres mensajes nuevos, sin fecha, que pasan a ser canon de su voz (retador, tutea, desmonta con una idea corta; nunca dice quién
  es); ver la tabla de §4:
  - «Tú tienes que acertar siempre. A mí me basta con una vez.» (`video/kill-chain-eslabon/narration.json:96`, s02-07)
  - «Mi taller no lo verás nunca. Esa parte te la pierdes.» (`video/kill-chain-eslabon/narration.json:236`, s05-01)
  - «Tú vigila tus planos, que es lo importante. Lo demás, ni lo mires.» (`video/kill-chain-eslabon/narration.json:318`, s07-01)
- La caja, el taller, la acera, la casa y el ladrón son de las analogías, no del caso. Ninguna persona, fecha, equipo ni IP nuevos.
- **No se toca** (sigue fuera): el dosier de BROKEN CHAIN (`src/data/course-gcti.ts:40`): ni que los TTPs se repitan en sus playbooks, ni el PDB
  en tres muestras, ni «VELVET CICADA ya tiene cara técnica»; quién abrió el adjunto (§5 punto 5: «alguien lo abre», en una estación de ingeniería,
  sin «RR. HH.» junto a `ENG-WS-041`); el orden entre las 09:41 del correo y la cadena sin zona («ese mismo día», nunca «tres minutos después»); el
  cambio de binario del 5-3 (`UpdSvc\updsvc.exe`, `9f3a...e1`, de V7: ningún hash en todo el vídeo); el intervalo del beacon de 90 s del Lab 2A;
  E7, el informe MER-2026-019 y todo lo posterior (E9, la exfiltración, Orbital, los Labs 3A y 3B). No se culpa a nadie: ni a quien abrió el
  adjunto ni al SOC.

### V14 · `hilos-pelicula` · s2m4 · YouTube `pjGQiqy0CdE`

Lección `src/data/s2.ts:952-958` (bloque `video` después del último check, «Victim 2's thread shows Delivery → Exploitation →
Installation → C2 but no staging or exfil yet…», y antes del callout «🎖️ Campaña»); 7:51, subido a Alertópolis el 2026-10-06 y
público el 2026-10-08. Adversario de los interceptados GLASS VIPER (`video/hilos-pelicula/video.json:8`), con la voz
`sapi/Microsoft Pablo` y el efecto `machine` (`video/hilos-pelicula/narration.json:11-15`). Notas propias en
`video/hilos-pelicula/out/script-notes.md`. Va sin hora; el «hoy» es el lunes 9-3 (ver §2). **La lección cambió con él (plan A,
decidido el 2026-10-05):** la Víctima 1 del walkthrough pasa a ser la de s2m1 (el CV de las 09:41, el LNK en `ENG-WS-041`, el
beacon), con staging y salida el 7-3 (`src/data/s2.ts:886-891`); «PO revision» queda solo para Orbital (`:894`). Canon nuevo:

- **El hilo de Meridian en pantalla** (`video/hilos-pelicula/src/scenes/parts/FilmRail.tsx:231-236`): cuatro eventos del 02-03
  sin número, hora, equipo ni archivo (Delivery «correo con un CV», Exploitation «se abre el adjunto», Installation «loader y
  tarea programada», C2 «primera llamada a casa»), E7 («05-03 · C2», con la ficha de V3) y E9 (07-03, Actions on Objectives,
  «compresión en una carpeta temporal · salida grande»). Los del 2-3 no reciben número de evento: E1–E6 y E8 siguen sin
  definir. E9 sale dos veces: en s01 con la ficha de V3 tal cual («misma metodología») y en s02 con el contenido del plan A,
  sin tamaño ni destino. Hueco menor: V3 dice que E9 tiene la metodología de E7 (beacon HTTPS), y una salida de datos no es
  eso (`src/data/s2.ts:577`).
- **El hilo de Orbital** (`video/hilos-pelicula/src/scenes/parts/s03-orbital/OrbitalLog.tsx:36-60`): `2026-03-09 08:05` el
  correo «PO revision» a `finance@orbital.example` («un pedido falso a Finanzas»), `08:22` el adjunto que se ejecuta y deja
  `C:\Users\..\msdtcs.exe` con la ruta del PDB, `08:23` el beacon a `portal-auth-check.example`. El montón de Orbital lleva
  «2026-03-09 · Orbital Components · proveedor de Meridian · eventos nuevos» (`video/hilos-pelicula/src/data/s01-fotos.ts:10-15`).
  Es un hilo parcial (`video/hilos-pelicula/src/data/s03-orbital.ts:15`): sin staging ni salida todavía.
- **La ruta del PDB** `D:\proj\cicada\loader\Release\ldr.pdb` sale igual en `winhlp.exe` y en `msdtcs.exe`
  (`video/hilos-pelicula/src/scenes/parts/CompareTable.tsx:61`, `:82`). Imagen común de V13, V14 y V15: «la etiqueta del
  taller» (`video/hilos-pelicula/src/data/s04-taller.ts:8`), con la misma frase en voz: «Al compilar, a veces la carpeta donde
  se hizo se queda escrita en el programa. Es como la etiqueta del taller, por dentro. No siempre la lleva. Pero si otro
  programa trae la misma, salen del mismo taller.» (s04-06 y s04-07). Se llama «la ruta del PDB» (s04-08). La regla en
  pantalla: «si otro programa trae la misma · mismo taller · enlace fuerte» (`video/hilos-pelicula/src/data/s04-taller.ts:14`).
- **Enlaces débiles y fuertes:** PowerShell, Cobalt Strike y phishing son lo que usan «miles de actores»
  (`video/hilos-pelicula/src/data/s05-debiles.ts:8-11`); lo que cuenta es lo que cuesta cambiar y, para agrupar, además lo raro.
- **Agrupar no es atribuir** (`video/hilos-pelicula/src/data/s07-nombre.ts:7-11`): «agrupar: qué intrusiones van juntas» frente a
  «atribuir: quién está detrás · pide otras pruebas» (remite a «S4: niveles de atribución»). El veredicto es un activity group
  **candidato**, sin nombre: ni VELVET CICADA ni GLASS VIPER; GLASS VIPER sale como nombre del implante en las fichas de E7 y E9 (como en V3) y como firma de los
  mensajes; la narradora lo presenta como «tu mote para el intruso de Meridian y lo que usa» (`video/hilos-pelicula/narration.json:140`).
- **La noche del 9-3 en Orbital** (`video/hilos-pelicula/src/data/s09-noche.ts:19-40`): Meridian le pasa a Orbital «cosas que
  buscar», una por fase (correo con un CV, se abre el adjunto, loader y tarea programada, primera llamada a casa, compresión en
  una carpeta temporal · salida grande), como hipótesis «a comprobar» (`video/hilos-pelicula/src/data/s08-grafo.ts:19-22`); esperar a
  que saque los datos «cuesta justo lo que quieres proteger». Sin resultado.
- **Las tres reglas del cierre** (`video/hilos-pelicula/src/data/s10-reglas.ts:20-43`): «Un evento es una foto, y los de una
  intrusión, en orden y por fases, son su película»; «Lo común no une. Lo barato, si no coincide, no separa» (la ficha decía «ni
  une ni separa»; la sesión principal lo corrigió por exactitud); «Un grupo no es un nombre, es un plan». Remata con
  «Tu turno: las preguntas de la lección» (`:74`, s2m4 · 10 preguntas).
- **GLASS VIPER**, tres mensajes nuevos, sin fecha, que pasan a ser canon de su voz (se cuela con el mote del intruso de Meridian, desmarca
  y tutea; nunca dice quién es):
  - «Otra empresa, otro dominio, otro correo. Eso no es cosa mía.» (`video/hilos-pelicula/narration.json:143`, s03-06)
  - «Ya me has metido en un grupo. Pues dime quién soy.» (`video/hilos-pelicula/narration.json:319`, s07-01)
  - «En Orbital solo llamo a casa. Ahí no va a pasar nada más.» (`video/hilos-pelicula/narration.json:359`, s08-01)
- Las analogías (la caja, el taller y la película) son de la explicación, no del caso.
- **No se toca** (sigue fuera): el dosier de BROKEN CHAIN (`src/data/course-gcti.ts:40`): ni «tres muestras», ni que los TTPs
  se repitan en sus playbooks, ni «VELVET CICADA ya tiene cara técnica»; por eso el adjunto de Orbital no se llama LNK ni se dice
  que lanzara PowerShell. La palabra que hay dentro de la ruta del PDB sale tal cual y la voz no la comenta (el hallazgo es del Lab
  3A, `src/data/labs.ts:688-691`). Cluster-A y Cluster-B (`src/data/s4.ts:729-745`), la campaña STIX «PO-REVISION phishing wave»
  (`src/data/s4.ts:1033`), el certificado «en 3 C2» (§5 punto 10), el tamaño y destino de la salida de E9 (§5 punto 7), el vector
  por un proveedor (cuenta VPN, portales del BLUF), quién abrió el adjunto (§5 punto 5) y todo lo posterior al 9-3 (el indicador
  del ISAC del 11-3 es de V8). Nadie tiene nombre y no se culpa a nadie.

### V15 · `sandbox-muestra` · s3m2 · YouTube `Xbd_x8mOAqc`

Lección `src/data/s3.ts:350-356` (bloque `video` después del párrafo del triaje, «El triaje empieza separando infraestructura del
actor de ruido del sistema…», y antes del primer check, «Of the five contacted hosts…»); 3:35, subido a Alertópolis el 2026-10-06
y público el 2026-10-08. Cápsula. Adversario de los interceptados HOLLOW LANTERN (`video/sandbox-muestra/video.json:8`), con la
voz `sapi/Microsoft Pablo` y el efecto `machine` (`video/sandbox-muestra/narration.json:11-15`). Notas propias en
`video/sandbox-muestra/out/script-notes.md`. Sin fecha ni hora, después de E7 (como V9); las únicas horas en pantalla son las de la
tira de V3. **La lección cambió con él:** `MapViewOfSection` pasa a `NtMapViewOfSection` en los imports de la muestra
(`src/data/s3.ts:333`, ver §3). Canon nuevo:

- **La muestra del informe MER-2026-023 es la copia del programa que el EDR vio en `ENG-WS-041`** el 5-3
  (`C:\ProgramData\UpdSvc\updsvc.exe`, `9f3a...e1`): V15 lo enseña en pantalla con las dos grafías del hash, `9f3a...e1` en la
  tira de V3 y `9f3a2c...e1` en el informe (`video/sandbox-muestra/src/data/e7.ts:24-40`, `video/sandbox-muestra/src/data/report.ts:37-45`). No se
  dice quién recogió la copia ni cuándo.
- **La búsqueda del hash** en un servicio público de análisis (sin nombre ni marca; «decenas de antivirus»): «sin resultados»
  (`video/sandbox-muestra/src/data/s02-hash.ts:26-33`). Meridian no sube el fichero, «porque nadie la ha subido ahí, lo normal en una
  muestra dirigida, hecha a medida» (`video/sandbox-muestra/narration.json:60`); no dice nada de otros servicios. Es compatible con que
  la familia ya se conozca: lo que no está ahí es esta compilación exacta.
- **La detonación** en el «sandbox interno de Meridian», «máquina aislada, de usar y tirar» (`video/sandbox-muestra/src/data/s02-hash.ts:35-38`;
  `video/sandbox-muestra/narration.json:72`), la fila del CMF (`src/data/s3.ts:72`).
- **El informe en pantalla** (`video/sandbox-muestra/src/data/report.ts:15-51`): «Informe de sandbox · extracto · GLASS VIPER stage-1 ·
  MER-2026-023» con las líneas de la lección (SHA-256, imphash «comparte tabla de imports con 3 muestras previas», ssdeep «94% similar
  a variante de 2026-01», compile time `2026-02-19` «plausible; los actores lo falsean a veces», la ruta del PDB, los imports con
  `NtMapViewOfSection`, el pipe y la persistencia).
- **El pipe, en dos ejecuciones de la misma muestra:** `vc_pipe_4f8a1c9e` en el sandbox y `vc_pipe_3a7f09c1` en E7 [V3], juntos en pantalla:
  «mismo formato, otro número en cada ejecución» (`video/sandbox-muestra/src/data/s03-mitades.ts:8`, `video/sandbox-muestra/src/data/e7.ts:43-47`).
  Nada sobre recompilaciones.
- **La tarea `WindowsUpdateCheck`** sale solo como lo que la muestra hace en el sandbox («tarea para volver a arrancar»). Nada dice que el 5-3 se
  creara en `ENG-WS-041` (V7 tampoco; §5 punto 1).
- **Los cinco hosts contactados** (`video/sandbox-muestra/src/data/report.ts:66-72`): del actor, `update-svc-cdn.com:443` («su servidor de siempre ·
  el de E7») y `ocsp-verify-node.example:443` («de repuesto»); de Windows, `time.windows.com:123` («poner la hora»),
  `ctldl.windowsupdate.com:80` («certificados de confianza de Windows») y `www.msftconnecttest.com:80` («¿hay internet?»). El de
  repuesto «no salía en la alerta de E7: lo ha dado el sandbox» (`video/sandbox-muestra/src/data/s04-llamadas.ts:11`): V3 solo enseña dos
  conexiones a `update-svc-cdn.com`, y no se dice si la red de Meridian llegó a hablar con él.
- **La decisión de triaje:** el candado solo en los dos del actor; bloquear los cinco es «gol en propia puerta»: ningún equipo de Meridian se
  pondría en hora ni comprobaría su conexión (`video/sandbox-muestra/narration.json:142-148`). Sin fecha, y sin relación con E9 ni con el «last
  seen» del 7-3 de `update-svc-cdn.com` (V4).
- **Parientes** (`video/sandbox-muestra/src/data/s05-etiqueta.ts`): el hash es «esta prenda exacta · un byte y ya es otra»; imphash y ssdeep
  apuntan a la familia («variante de 2026-01»); la fecha de compilación es un enlace débil («la pone quien compila · a veces, falsa»); y la
  ruta del PDB es **la etiqueta del taller**, la imagen común de V13, V14 y V15, con la misma frase en voz que V14 («Al compilar, a veces la
  carpeta donde se hizo se queda escrita en el programa. Es como la etiqueta del taller…»; aquí, «cosida en el cuello, por dentro»,
  `video/sandbox-muestra/narration.json:206`) y la misma regla en pantalla: «si otro programa trae la misma · mismo taller · enlace fuerte». V15 solo
  dice qué significaría un acierto; no enseña ninguno.
- **HOLLOW LANTERN**, dos mensajes nuevos, sin fecha, que pasan a ser canon de su voz (consejos en imperativo,
  que tutean; nunca dice quién es): «Súbela a un servicio público. Cuantos más ojos, mejor.» (s02-01) y «Bloquea esos dos, analista.
  Tengo más esperando su turno.» (s05-01); ver la tabla de §4.
- Sin personas nuevas.
- **No se toca** (sigue fuera): el dosier de DEEP WELL (`src/data/course-gcti.ts:59`): ni certificados compartidos, ni `kazuo.tanji@`, ni
  «una sola organización»; el de BROKEN CHAIN (`src/data/course-gcti.ts:40`): ni «el mismo PDB en tres muestras» ni cuántas lo comparten
  (§5 punto 11; las «3 muestras previas» del imphash son de la lección y no se relacionan con el PDB); y los dos loaders de s2m4 con el
  mismo PDB (`src/data/s2.ts:886-897`), que son la demo de V14.

### V22 · `coa-precios` · s2m2 · YouTube `ghNoHuq7GIk`

Lección `src/data/s2.ts:389-395` (bloque `video` después del tercer check, «Quarantining a host while its implant is actively
beaconing is:», `:379-388`, como último bloque de la lección y antes del `quiz`, `:397`); 3:45 (6742 fotogramas a 30 fps,
`video/coa-precios/src/timeline.json:7`), subido a Alertópolis el 2026-10-14 como privado y publicado ese mismo día (`video/coa-precios/out/youtube-upload.json:2-4`).
Cápsula (`capsula-yt`). Adversario de los interceptados GLASS VIPER (`video/coa-precios/video.json:8`), con la voz
`sapi/Microsoft Pablo` y el efecto `machine` (`video/coa-precios/narration.json:11-15`). Notas propias en
`video/coa-precios/out/script-notes.md`. **Sin fecha ni hora**, como V9 y V15: es posterior a la reconstrucción de la cadena
(V7 y V13), pero no se ordena contra §2. **La lección cambió con él:** «hacia el C2» en lugar de «hacia la IP del C2», «quema tu
visibilidad» y «pierdes la visibilidad» en lugar de «el hilo», y «con poca firma» y «mucha de su operación» en la lectura de
la matriz (`src/data/s2.ts:314,342-343,352`). Canon nuevo, solo de pantalla y de voz:

- **El punto de partida** (`video/coa-precios/src/data/s01-hook.ts:4-10`): la fila de pasos de la intrusión, pequeña y
  atenuada (Delivery, Exploitation, Installation, Command & Control, Actions on Objectives), con una marca en C2, «llama a casa
  cada minuto» (`video/coa-precios/src/scenes/parts/s01-hook/Chain.tsx:72`), sin ficha de alerta, fecha, hora, equipo ni
  dominio; «Meridian Dynamics · aeroespacial · tú, su analista de inteligencia»; y «equipo de respuesta: ¿qué hacemos con
  esto?». En voz: «En Meridian, una aeroespacial, ya sabes en qué paso va la intrusión. Y el equipo de respuesta te pregunta
  “¿qué hacemos con esto?”» (`video/coa-precios/narration.json:25`). El equipo de respuesta es el rol de §3, sin persona: pregunta
  y no propone ni decide nada.
- **La matriz es el menú de trabajo de la analista, nunca lo que Meridian tiene desplegado** (`video/coa-precios/src/data/matrix.ts:2-3`;
  en voz, «tu matriz», `video/coa-precios/narration.json:77`). Título «Matriz Courses of Action · extracto de trabajo (ficticia)»
  (`video/coa-precios/src/data/matrix.ts:126`; la lección añade «intrusión VELVET CICADA», `src/data/s2.ts:324`, que la pantalla
  no pone). Cinco filas y cinco columnas (Detect, Deny, Disrupt, Degrade, Deceive), las trece celdas de la lección palabra
  por palabra (`video/coa-precios/src/data/matrix.ts:31-116`; `src/data/s2.ts:325-348`), con sus tres `[!]` (Delivery·Deny,
  Installation·Disrupt, C2·Deny) y el recuento 3 · 2 · 2 · 3 · 3 (`:123`); dos tiras, «Reconnaissance · Weaponization · casi
  nunca a tu alcance» y «Discover y Destroy no ocupan celda en este extracto» (`:130-131`). El vídeo no dice si alguna celda
  está puesta, ni si se corta el C2, se mira o se hace otra cosa.
- **Lo que la pantalla cambia respecto a la lección**, aparte del título: «RR. HH.» con espacio (`video/coa-precios/src/data/matrix.ts:4,63`;
  la lección pone «RR.HH.», `src/data/s2.ts:330`); la celda del buzón señuelo, siempre atenuada (`matrix.ts:60-66`); y la glosa
  «el actor lo sabrá en minutos» junto al `[!]` de C2 (`video/coa-precios/src/data/s05-caminos.ts:6`), que resume
  `src/data/s2.ts:352` y no sustituye el texto de la celda («quema tu visibilidad», `matrix.ts:94`). Ninguna acción cambia de celda.
  Los otros dos retoques que la ficha pedía en pantalla («hacia el C2» y quitar «quema el hilo») ya están en la lección.
- **Las celdas que nombra la voz:** Deny de Exploitation, «impide que un adjunto lance PowerShell»; Disrupt de Installation,
  «aísla el ordenador en cuanto aparece la tarea programada» («el ordenador», porque «el equipo» es el de respuesta;
  `video/coa-precios/narration.json:83,89`; `video/coa-precios/out/script-notes.md:58-59`); el sinkhole de C2, «Es hacer que su
  dominio no conteste, el sinkhole. No corta la llamada en curso, pero las siguientes ya no llegan. Por eso es Deny.»
  (`video/coa-precios/narration.json:159`; en pantalla, «no corta la llamada en curso · las siguientes no llegan a ninguna parte ·
  DENY», `video/coa-precios/src/data/s05-caminos.ts:8`). El sinkhole es Deny, no Disrupt.
- **El correo de s04 es hipotético:** «Imagina que la entrega solo tuviera una celda, bloquear el dominio del remitente» y «Si
  llega un correo desde otro dominio, la fase se queda sin defensa» (`video/coa-precios/narration.json:119,125`); en pantalla, un
  sobre con el remitente en blanco, sin ningún texto (`video/coa-precios/src/scenes/parts/s04-fase/Envelope.tsx:7-11`), y «la fase,
  desprotegida» (`video/coa-precios/src/data/s04-fase.ts:4`). Sin nombre, sin fecha y sin relación con ningún dominio del caso (ni
  con `meridian-hr-portal.com` del Lab 3A, `src/data/labs.ts:704-707`). No dice que el gateway de Meridian tenga un solo control.
- **La pregunta y sus dos ramas son una suposición, no el estado de Meridian:** «Supón que todavía no han sacado nada» y «Supón que
  lo importante está a salvo» (`video/coa-precios/src/data/s05-caminos.ts:9-12`); la pregunta «Nada robado y lo crítico a salvo:
  ¿cortas?» (`video/coa-precios/narration.json:174`); la respuesta «No, todavía no. Sigues mirando, con Detect, y le frenas sin
  cortarle, con Degrade. Para él es más una red lenta que un bloqueo.» (`:181`), con «ves su operación, avisas menos · mientras lo
  valioso esté protegido» (`video/coa-precios/src/data/s05-caminos.ts:13`); y «Pero si ya se llevan lo crítico, al revés. Cortas
  ya, y el resto lo averiguas después.» (`video/coa-precios/narration.json:187`), con una alarma **hipotética** sobre la fila de
  Actions on Objectives y «si ya se llevan lo crítico: contener ahora, recoger después»
  (`video/coa-precios/src/scenes/S05Caminos.tsx:43-46`; `video/coa-precios/src/data/s05-caminos.ts:15,18-19`). Esa alarma no es E9
  ni ninguna salida de datos de Meridian.
- **Decide la empresa:** «Y decide la empresa, no el SOC» (`video/coa-precios/narration.json:193`; «la empresa» para que no se oiga
  como la tienda, `video/coa-precios/out/script-notes.md:59-60`); en pantalla, «la decisión final es del negocio, no del SOC · tú pones
  los precios sobre la mesa» (`video/coa-precios/src/data/s05-caminos.ts:17`). No se enseña ninguna decisión
  (`video/coa-precios/src/scenes/S05Caminos.tsx:46`).
- **Ningún intervalo:** la voz no dice «48 horas» ni cuánto se mira (§5 punto 24); «cinco minutos» solo sale en el mensaje de
  GLASS VIPER, que es el ejemplo de la lección (`src/data/s2.ts:314`).
- **El puente con V13**, solo en pantalla: «los pasos de antes ya no los puedes impedir», junto a las filas de encima de C2
  (`video/coa-precios/src/data/s05-caminos.ts:4`; `video/coa-precios/src/scenes/parts/s05-caminos/Glosses.tsx:11-22`).
- **La voz no nombra ni a VELVET CICADA ni a GLASS VIPER** («el atacante», «él»; `video/coa-precios/out/script-notes.md:68`):
  GLASS VIPER solo firma los mensajes.
- **GLASS VIPER**, dos mensajes nuevos, sin fecha, que pasan a ser canon de su voz (tutea, dos frases cortas, cebo; nunca dice
  «analista» ni quién es); ver la tabla de §3. La narradora le da la razón en el dato y se la quita en la conclusión
  (`docs/reviews/2026-10-08-fichas-tanda4/ficha-V22.md:67-68`):
  - «Ponme todas las alarmas que quieras. Para pararme ya habrá tiempo.» (`video/coa-precios/narration.json:70`, s03-01); respuesta:
    «En algo tiene razón, una alarma sola no para a nadie. Eso lo hacen otros dos verbos.» (`:67`)
  - «Córtame ya. Me mudo en cinco minutos y vuelves a empezar.» (`video/coa-precios/narration.json:146`, s05-01); respuesta:
    «Cortarle ahora es lo más contundente, sí. Pero él se muda y tú dejas de verle. Por eso te lo pide.» (`:143`). Cortar sirve
    y tiene un precio; un guion posterior no debe decir que «bloquear no sirve» (V15 dijo que bloquear sigue valiendo, `docs/reviews/2026-10-08-fichas-tanda4/decisiones-V22-V23.md:96-98`).
- **La tienda del barrio** (la cinta, la alarma con su cámara en directo, la persiana, la cerradura, el vigilante, la caja fuerte, el
  sospechoso y su walkie) es de la analogía, no del caso; el póster enseña la tienda, el walkie y las dos opciones (DENY · DETECT + DEGRADE), sin dominio, fecha ni equipo
  (`video/coa-precios/src/PosterArt.tsx:66-70`; `video/coa-precios/src/Poster.tsx:23`). Sin personas, fechas, equipos, hashes ni IP nuevos.
- **No se toca** (sigue fuera; `docs/reviews/2026-10-08-fichas-tanda4/ficha-V22.md:180-195`): el dosier de BROKEN CHAIN
  (`src/data/course-gcti.ts:40`); E9, el 7-3, los «dos días» y el último `last seen` de `update-svc-cdn.com` (§5 punto 7): el vídeo
  no dice cuándo ni si se corta el C2, ni que Meridian viera salir nada, y la séptima fase sigue como en V13; el indicador propio de
  Meridian para `cdn-sync-status.example` (`src/data/s5.ts:603-614`) y la ola de abril: la celda de Delivery no dice si está
  bloqueado; las retenciones del CMF de V8 (ni «90 días de EDR» sale); quién abrió el adjunto (§5 punto 5) y `ENG-WS-041`, que no
  sale; el intervalo del beacon más allá de «cada minuto» (§5 punto 3); el Lab 2C (la matriz trae seis de sus ocho ítems, sin
  clasificarlos ni dar su respuesta) y el Lab 2A; Destroy (ninguna acción ofensiva). No se culpa a nadie: ni al SOC por no cortar
  ni al equipo de respuesta por preguntar.

### V23 · `atribucion-cuadro` · s4m5 · YouTube `Q2Xk9Lczm6U`

Lección `src/data/s4.ts:1113-1119` (bloque `video` después del tercer check, «For a private-sector defender, the MOST
actionable attribution level is usually:», `:1098-1112`, y antes del callout «Nota de examen», `:1120-1125`); 3:49 (6866
fotogramas a 30 fps, `video/atribucion-cuadro/src/timeline.json:4,7`), subido a Alertópolis el 2026-10-14 como privado y publicado ese mismo día
(`video/atribucion-cuadro/out/youtube-upload.json:2-4`). Cápsula (`capsula-yt`, `video/atribucion-cuadro/video.json:6`), guion
congelado el 2026-10-13 (`:24`). Adversario de los interceptados PAPER CRANE (`video/atribucion-cuadro/video.json:8`), con la voz
de V9, `sapi/Microsoft Laura` y el efecto `machine` (`video/atribucion-cuadro/narration.json:11-15`). Notas propias en
`video/atribucion-cuadro/out/script-notes.md`. **Sin fecha ni hora**, como V9 y V15: no se ordena contra §2. **La lección cambió
con él** (commit `e86957e`): la confianza del sponsor en la tabla pasa a «Media para quien dispone de esas fuentes, con lenguaje
estimativo explícito; baja con solo telemetría» (`src/data/s4.ts:993`), y el callout dice «ataca también a sus proveedores» en
lugar de «entra por proveedores» (`:1008`; §5 punto 4). **No atribuye nada al caso:** ni país, ni grupo como culpable, ni
persona, ni grado de confianza para Meridian. Canon nuevo, solo de pantalla y de voz:

- **El punto de partida** (s01): «Meridian Dynamics · aeroespacial» y «tú, su analista de inteligencia»
  (`video/atribucion-cuadro/src/data/s01-hook.ts:4`) sobre el diamante sin datos, con Adversary en `UNKNOWN` (ver §3, «Ficha
  completa de E7»); en voz, «en tu diamante del ataque falta saber quién fue. El CISO quiere un nombre.»
  (`video/atribucion-cuadro/narration.json:25`). **El CISO** (sin nombre, el de V9) sale con la tarjeta «CISO · responsable de
  seguridad» y su pregunta, «¿Quién está detrás?» y «¿Ponemos un país en el informe?»
  (`video/atribucion-cuadro/src/scenes/parts/CisoStrip.tsx:23,25`), en s01 y otra vez en s05, en tira
  (`video/atribucion-cuadro/src/scenes/S05Decision.tsx:80`). Es una pregunta, no una decisión: el vídeo no dice si el informe
  lleva un país.
- **Los tres niveles, tres preguntas sobre un cuadro** (`video/atribucion-cuadro/src/data/levels.ts:26-57`): «¿con qué se
  hizo?», MÁQUINA / INFRAESTRUCTURA, «qué máquinas y herramientas actuaron», «tu telemetría, el malware, el C2», «llega
  cualquier defensor con visibilidad», confianza «alta»; «¿quién lo pintó?», OPERADOR, «quién tecleó», «errores humanos
  (opsec): una cuenta personal desde la infraestructura, un alias reutilizado, hábitos propios años seguidos», «llegan vendors
  con visibilidad global y años de seguimiento», «moderada»; «¿quién lo encargó y lo pagó?», SPONSOR, «por cuenta de quién»,
  «dinero, órdenes, registros legales, años de victimología alineada con intereses», «la victimología sola no llega a quién
  dirige», «llegan gobiernos, o fusión público-privada», «moderada, y solo con fuentes que tu red no tiene». Son las confianzas
  de la tabla para cada tipo de evidencia, nunca un juicio sobre Meridian (`levels.ts:1-5`). Tira: «subir un nivel pide
  evidencia de otro tipo, no más de lo mismo» (`video/atribucion-cuadro/src/data/s02-niveles.ts:20`); en voz, «Con mil
  registros más de tu red, que son tu telemetría, rara vez sabrás quién lo encargó.» (`video/atribucion-cuadro/narration.json:79`).
- **Meridian, solo en el primer nivel:** el chip «tu caso: el programa y su servidor» sobre la banda de la máquina
  (`video/atribucion-cuadro/src/data/s02-niveles.ts:5-6`), y en voz «Ahí está lo que tienes de Meridian»
  (`video/atribucion-cuadro/narration.json:43`). Nada del caso en los niveles de operador y sponsor. El certificado no sale,
  para no acercarlo a la prueba plantable de V9 (`docs/reviews/2026-10-08-fichas-tanda4/ficha-V23.md:156`).
- **El chip del diamante** (`video/atribucion-cuadro/src/data/s02-niveles.ts:8-17`;
  `video/atribucion-cuadro/src/scenes/parts/s02-niveles/DiamondLink.tsx:10-16,56-67`): «Capability + Infrastructure = máquina» y
  «Adversary = operator + customer», con conectores punteados hacia la banda OPERADOR («operator: teclea») y la banda SPONSOR
  («customer: encarga»): correspondencia, no identidad, y el customer de Meridian sin rótulo. En voz, «Te sonará del diamante,
  donde el operator teclea y el customer encarga.» (`video/atribucion-cuadro/narration.json:61`). Es una lectura del vídeo: la
  lección separa operator y customer (`src/data/s2.ts:564`) y define el sponsor como quien «dirigió y se benefició»
  (`src/data/s4.ts:984`), pero no los iguala; la revisión de exactitud la dio por buena
  (`video/atribucion-cuadro/out/script-notes.md:203-206`). Un guion posterior puede usar la correspondencia, no «el customer es
  el sponsor» como identidad.
- **Hasta dónde llega lo que ves** (s03; `video/atribucion-cuadro/src/data/s03-techo.ts:7-40`): la palabra «país» del mensaje,
  unida a la banda SPONSOR, «el tercer nivel»; el foco «tu telemetría» ilumina la primera banda, apenas roza la segunda y deja la
  tercera a oscuras, «no deja rastro en tu red»; lo que haría falta para verla, «fuentes humanas · HUMINT», «comunicaciones
  interceptadas · SIGINT», «financiación y órdenes», «registros legales», que «suelen tenerlas gobiernos, o fusión
  público-privada»; en el borde del foco, «hasta aquí llega la evidencia técnica» y «no es debilidad, es rigor». En voz, «Verlo
  suele pedir fuentes humanas y escuchas, HUMINT y SIGINT, cosa de gobiernos.» y «Por eso te paras en el grupo, el intrusion
  set. No es debilidad, es rigor.» (`video/atribucion-cuadro/narration.json:101,107`). Nunca «imposible»: solo «rara vez basta».
- **La ficha del «informe serio» es genérica** (`video/atribucion-cuadro/src/data/s03-techo.ts:25-37`): «así habla un informe
  serio: se detiene donde acaba su evidencia», «[nombre del conjunto]», «solapamiento a nivel de operador con actividad
  anterior», «confianza moderada» y «país: —» (un guion: dato ausente, no un nombre tapado); debajo, INTRUSION SET, «el grupo,
  tal como se le ve trabajar». Solo en pantalla (`video/atribucion-cuadro/out/script-notes.md:44-46`). No existe ningún informe de
  ningún proveedor sobre Meridian.
- **El binario de s04 es el ejemplo de la lección, no de Meridian** (`video/atribucion-cuadro/src/data/s04-binario.ts:1-11`):
  rótulo «Ejemplo de la lección · no es el caso de Meridian», legible desde el primer fotograma y durante el mensaje; sus dos
  pistas son «textos en otro idioma» y «horas de compilación de una jornada de oficina concreta», sin idioma, alfabeto, lugar,
  huso ni hora. En voz, «Este binario es de ejemplo, no de Meridian. Trae textos en otro idioma, y se compiló en horas de oficina
  de allí.» (`video/atribucion-cuadro/narration.json:135`): «de allí» apunta a un sitio sin nombrarlo. No se relaciona con
  ninguna muestra de Meridian ni con `9f3a...e1`. Pregunta: «Idioma y horario: ¿bastan para un país?»; respuesta, «No.»
  (`:144`, `:151`).
- **La tabla de false flags** es la de la lección (`src/data/s4.ts:1073-1081`;
  `video/atribucion-cuadro/src/data/s04-binario.ts:30-44`), con «objetivos sostenidos durante años, alineados con unos intereses»
  y «sola no llega al sponsor»; junto a ella, FALSE FLAG «pistas dejadas a propósito para culpar a otro», «aisladas pesan muy poco
  · dentro de un conjunto grande y coherente, suman», «caro no es imposible», la «procedencia» del cuadro y la pregunta de V9, «si
  esta pista fuera un señuelo, ¿cambia tu conclusión?» (`s04-binario.ts:47-59`). En voz, el false flag no tiene sujeto:
  «Dejarlas a propósito para culpar a otro es un false flag» (`video/atribucion-cuadro/narration.json:157`).
- **El nombre y la decisión** (s05; `video/atribucion-cuadro/src/data/s05-decision.ts:8-24,39`): «a quién le sirve el país»,
  gobiernos «(respuesta diplomática o legal)», seguros y «decisiones geopolíticas de negocio»; «qué cambia en tu defensa»,
  «detectar, cazar y proteger» «rara vez cambian» con el país (nunca «no cambian»); «¿qué decisión cambia con el nombre?»; la
  cartela «atribuido a…», «lo que afirmas lleva su confianza»; y el cierre, «perseguir el nombre solo compensa si una decisión lo
  pide». En voz, «Un país le sirve a un gobierno, que puede responder.» (`video/atribucion-cuadro/narration.json:186`).
- **La nota de lo que sí va en el informe** (`video/atribucion-cuadro/src/data/s05-decision.ts:31-36`): «cómo trabaja el grupo:
  lo ves en tu red» · «qué busca: la propiedad intelectual de propulsión de Meridian» · «quién teclea: desconocido», con el sello
  `UNKNOWN` del diamante (`video/atribucion-cuadro/src/scenes/parts/s05-decision/Note.tsx:47`) · «para quién trabaja: tu red no
  tiene esa clase de prueba; el juicio se emite con su confianza y diciendo qué falta, no se calla». En voz, «Del grupo escribes
  cómo trabaja y qué busca. Quién teclea no lo sabes, y lo dices. Para quién trabaja, das tu juicio con su confianza y lo que
  falta.» (`video/atribucion-cuadro/narration.json:215`). **Sin nombre de grupo, sin grado de confianza y sin país.** El sponsor
  no se queda en «desconocido» a secas, porque el Lab 5B da por malo omitir el juicio (`src/data/labs.ts:1072-1074`), y tampoco
  se adelanta el «low» que el laboratorio da al juicio de sponsor de su hallazgo 2 (`src/data/labs.ts:1058`). «Qué busca» es lo
  de V3 (el customer quiere los diseños de propulsión, `video/diamond-e7/narration.json:171,231`), no el juicio H1 de V9 ni su
  confianza. «Quién teclea: desconocido» no choca con `kazuo.tanji@` (§3): sería el operator solo «si el pivote confirma», y no
  está confirmado.
- **Ningún país, idioma, huso ni hora en todo el vídeo**: ni en el binario (`video/atribucion-cuadro/src/data/s04-binario.ts:1-4`)
  ni en el cuadro, cuya firma es un garabato y cuya fecha son cuatro guiones
  (`video/atribucion-cuadro/src/scenes/parts/painting/Art.tsx:6-7`), con fichas de procedencia sin años
  (`video/atribucion-cuadro/src/scenes/parts/painting/Extras.tsx:54-57`). El póster enseña «¿Quién fue?», «Atribución: tres
  niveles y pistas falsas» y el cuadro con el foco «tu telemetría» y la esquina firmada en ámbar, sin país, bandera, mapa ni idioma
  (`video/atribucion-cuadro/src/Poster.tsx:48-59`; `video/atribucion-cuadro/src/PosterArt.tsx:12-17`).
- **La voz no dice E7, C2, `UNKNOWN`, VELVET CICADA ni GLASS VIPER** (`video/atribucion-cuadro/out/script-notes.md:86-88`); el
  grupo es «el grupo» o «el intrusion set». PAPER CRANE se nombra una vez (`video/atribucion-cuadro/narration.json:85`).
- **PAPER CRANE**, dos mensajes nuevos, sin fecha, que pasan a ser canon de su voz (tutea, dice «analista», ironía; empuja atajos
  de método, nunca una hipótesis, y no confiesa nada); ver la tabla de §3. Son otros dos errores que los de V9: poner un país
  porque vende y pararse en la primera pista (`docs/reviews/2026-10-08-fichas-tanda4/decisiones-V22-V23.md:166-170`).
  - «Ponle un país al informe, analista. Todo consejo adora un nombre.» (`video/atribucion-cuadro/narration.json:88`, s03-01);
    respuesta: «Y PAPER CRANE, más. Vive de sembrar pistas falsas, y las prisas le vienen de perlas.» (`:85`) y «Pero un país es
    el tercer nivel.» (`:95`).
  - «Con la primera pista que encaje ya tienes bastante. ¿Para qué más?» (`video/atribucion-cuadro/narration.json:128`,
    s04-01); respuesta: «Pues vamos a ver cuánto pesa una pista fácil.» (`:125`); la de verdad llega tras la pregunta.

  La voz dice que PAPER CRANE «vive de sembrar pistas falsas» (su ficha de V9), nunca que sembrara algo en el caso de Meridian
  ni en el binario de ejemplo.
- **La imagen del cuadro** (el lienzo y los pigmentos, la mano y la huella en el barniz, el contrato en su archivo, la firma y la
  fecha de la esquina, la procedencia, la cartela y el foco) es de la analogía, no del caso. El guion evita «escalera»,
  «peldaño», «etiqueta» e «hilo» (`video/atribucion-cuadro/out/script-notes.md:124-125`). Sin personas, fechas, equipos, hashes,
  dominios ni IP nuevos.
- **No se toca** (sigue fuera; `docs/reviews/2026-10-08-fichas-tanda4/ficha-V23.md:171-187`): el dosier de HALL OF MIRRORS
  (`src/data/course-gcti.ts:78`): ni strings en cirílico, ni horarios falsos, ni «PAPER CRANE las plantó», ni «espionaje
  industrial sistemático»; **nada dice cuál de las pistas de Meridian podría estar plantada** (ni el E4 de V9 ni el certificado).
  Los de BROKEN CHAIN y DEEP WELL (`src/data/course-gcti.ts:40,59`): ni el PDB, ni `kazuo.tanji@` como candidato a operador, ni
  «una sola organización». Del Lab 4A, ninguna de sus frases (el informe que decía un país, las horas de compilación en UTC+8, lo
  que atribuyó BigVendorCo; `src/data/labs.ts:461,481,486`); del Lab 4B, sus pruebas (`src/data/labs.ts:862-930`); del Lab 5B,
  ningún juicio de sponsor sobre Meridian. El STIX de s4m5 (campaign, intrusion set, `attributed-to`, `confidence: 75`; §5
  punto 9) y s4m5q7; Cluster-A y Cluster-B (`src/data/s4.ts:729-744`); los casos reales de S5 (`src/data/s5.ts:843,862`) y los
  nombres de países: el check de la lección habla de Rusia y Moscú (`src/data/s4.ts:1086`) y el vídeo no. Tampoco la atribución
  de un gobierno como una fuente más (s4m5q6, `video/atribucion-cuadro/out/script-notes.md:67-68`). No se culpa a nadie: ni al
  CISO por pedir un nombre ni a la sala por querer uno.

### V27 · `reglas-aeropuerto` · s5m3 · YouTube `OHxUu9cjnVA`

Lección `src/data/s5.ts:583-589` (bloque `video` después del primer check, «A YARA rule with condition `any of ($s*)`…», `:568-582`, y
antes del encabezado «STIX/TAXII: el indicador empaquetado», `:590`; llegó a `main` con #56, commit `7596f54`); 3:51 (6945 fotogramas a
30 fps, `video/reglas-aeropuerto/src/timeline.json:4,7`), subido a Alertópolis el 2026-10-16 y ya público: sale en el feed del canal ese mismo día (no hay `youtube-upload.json`
en su `out/`). Cápsula (`capsula-yt`, `video/reglas-aeropuerto/video.json:6`), guion congelado el 2026-10-16 (`:23`). Primer vídeo de S5.
Adversario de los interceptados VELVET CICADA (`video/reglas-aeropuerto/video.json:8`), con la voz `sapi/Microsoft Pablo` y el efecto
`machine` (`video/reglas-aeropuerto/narration.json:11-15`). Notas propias en `video/reglas-aeropuerto/out/script-notes.md`. **Sin fecha ni
hora**, como V9, V15, V22 y V23: es posterior a V7 en lo que cuenta (la regla Sigma habla del `wcssvc.exe` de V7) y no se ordena contra §2.
**La lección no cambió con él**: el commit solo inserta el bloque y su prueba en `src/data/content.test.ts`. Canon nuevo, solo de pantalla y de
voz:

- **El punto de partida** (`video/reglas-aeropuerto/src/data/s01-hook.ts:7-17`): «Meridian Dynamics · aeroespacial · tú, su analista de
  inteligencia»; tres indicadores **sin valor**, «un dominio», «una dirección IP», «un hash», cada uno con su reloj de caducidad; y «el SOC: ¿y
  qué le damos que dure?». En voz: «Un dominio, una dirección, un hash… caducan enseguida. Y el SOC te pide algo que dure.» y «Eres la analista
  de Meridian, una aeroespacial. Ya sabes qué detectar. Toca escribirlo.» (`video/reglas-aeropuerto/narration.json:25`, `:37`). El SOC es el
  equipo de §3: pregunta y no decide. El vídeo no dice que las reglas estén desplegadas, que hayan saltado ni cuándo se escribieron.
- **Las dos reglas, «extracto de la lección · ficticia»** (`video/reglas-aeropuerto/src/data/rules.ts:11`), carácter por carácter salvo cuatro
  líneas que se quitan a propósito (`video/reglas-aeropuerto/src/data/rules.ts:3-6`; `docs/reviews/2026-10-14-fichas-tanda5/ficha-V27.md:231-236`): de la YARA, `date = "2026-04-18"`
  y `reference = "Internal report MER-2026-011"` (`src/data/s5.ts:502-503`); de la Sigma, `id` y `references` (`:532`, `:535-536`). Así el vídeo
  no se fecha, no choca con la numeración de los informes (§5 punto 17) y no enseña el `id` de la lección, que no es un UUID válido. La YARA sigue
  con `author = "Meridian CTI"`, `description` y `tlp = "AMBER"` (`video/reglas-aeropuerto/src/data/rules.ts:17-19`; el TLP sale como texto, sin voz); **la Sigma no tiene autor** y
  la pantalla no se lo pone (§3, «Equipos»). La ruta del PDB va con barras dobles, como se escribe en YARA (`video/reglas-aeropuerto/src/data/rules.ts:25`), y `$api` es
  `MapViewOfSection`, que sigue encontrando el `NtMapViewOfSection` de la muestra (§3, «Capacidades»).
- **El aeropuerto: un objeto, una función** (`video/reglas-aeropuerto/narration.json:43-67`). El escáner de equipaje mira dentro de la maleta
  (YARA, «mira dentro: ficheros y memoria»); la puerta de embarque «apunta quién pasa, con qué tarjeta y qué pasaporte», y Sigma es la lupa que
  **lee** ese registro («lee lo que ocurre: los registros»; `video/reglas-aeropuerto/src/data/s02-miradas.ts:2-8`). **La tarjeta de embarque es el
  nombre del fichero en el disco (`Image`) y el pasaporte, el nombre original que va por dentro (`OriginalFileName`)**: «Y busca que su pasaporte,
  el nombre de dentro, sea certutil» y «Si la tarjeta, el nombre del disco, también dice certutil, el filtro lo descarta» (`video/reglas-aeropuerto/narration.json:141`,
  `:153`). La botella de agua, el paraguas y el libro de la maleta son las cadenas que lleva cualquiera (`video/reglas-aeropuerto/src/data/s02-miradas.ts:17`; en voz, solo «como
  una botella de agua», `video/reglas-aeropuerto/narration.json:95`). El remate, «Hasta el próximo control» (`:265`), cierra la imagen. Es de la analogía, no del caso, y queda
  **ocupada**: un vídeo posterior no usa el escáner, la puerta de embarque, la tarjeta ni el pasaporte para otra cosa (el paraguas de la maleta es
  un objeto corriente; el paraguas plegado con su pegatina «revisado» es la imagen de V24, en Security+). La voz no dice «alarma» (de V22), «cámara», «cargador» ni «loader» (`video/reglas-aeropuerto/out/script-notes.md:53-55`).
- **La condición de la YARA** (s03): tres partes, «El contexto, meta. Las cadenas que busca, strings. Y la condición, condition, que decide»
  (`video/reglas-aeropuerto/narration.json:89`); en pantalla, `$api` «está en miles de programas legítimos», `$pipe` «molde propio · aquí, de compañía» con «el molde, no
  el nombre de cada ejecución», y `$pdb` «único» (`video/reglas-aeropuerto/src/data/s03-condicion.ts:22-28`); una tira «el SOC» que se llena de
  «aviso» (nunca «alarma», `:31`); y la condición en llano, «que sea un ejecutable (empieza por MZ)», «que pese menos de 250 KB» y «o el PDB, que
  es único y va solo, o dos señales de las otras tres» (`:34-38`). En voz, la ruta del PDB «a veces queda escrita al compilar» y «Casi nadie lleva
  esa» (`video/reglas-aeropuerto/narration.json:107`), nunca «la etiqueta del taller» de V13 a V15 ni qué muestra la lleva: **el vídeo no pasa ninguna regla por ninguna
  muestra ni hash de Meridian** (§5 puntos 1 y 11). Ver §5 punto 26 para el pipe.
- **La Sigma, parte a parte, y tres eventos de ejemplo** (s04; `video/reglas-aeropuerto/src/data/s04-sigma.ts:22-58`): «creación de procesos de
  Windows», «pasaporte · el nombre de dentro», «decodificar o descargar», «tarjeta · el uso con su nombre normal no salta», «resta lo que filtra».
  Cada «evento de ejemplo» lleva `Image` con ruta, `OriginalFileName` y `CommandLine` con el programa delante: (1) `C:\Windows\System32\certutil.exe`,
  `CertUtil.exe`, `certutil.exe -decode a.txt payload.bin`, «no avisa», «el filtro lo cubre»; (2) `…\wcssvc.exe`, `CertUtil.exe`,
  `wcssvc.exe -decode a.txt payload.bin`, «avisa»; (3) `…\otro-nombre.exe`, `CertUtil.exe`, `otro-nombre.exe -decode a.txt payload.bin`, que entra
  con la pregunta. Sin equipo, hora ni cuenta, y en voz siempre en condicional: «El de la tarjeta cambiada sí avisaría» (`video/reglas-aeropuerto/narration.json:159`). La
  voz cuenta «dos eventos» y luego «un tercero»: el primero solo se ve.
- **La regla A es solo del vídeo** (`video/reglas-aeropuerto/src/data/s04-sigma.ts:7-10`): una línea, `Image|endswith: '\wcssvc.exe'`, rotulada
  «ejemplo» («Una regla solo mira la tarjeta, y busca ese nombre. La otra es la de la lección», `video/reglas-aeropuerto/narration.json:165`). Pregunta: «Otro nombre de
  fichero: ¿cuál sigue saltando?» (`:174`); respuesta: «La de la lección. La tarjeta la cambia el atacante cuando quiere, y la otra ya no lo ve.
  Pero el pasaporte, el nombre original, va dentro del programa, y renombrar no lo toca.» (`:181`, `:187`); con el tercer evento, la regla A «no lo
  ve» y el filtro «no cuadra» (`video/reglas-aeropuerto/src/data/s04-sigma.ts:56-58`). «Lo cambia el atacante cuando quiere», y no «gratis», para no contradecir a V7, que dijo que
  el nombre y la carpeta «ya le cuestan más» que el hash (`video/reglas-aeropuerto/out/script-notes.md:78-80`). No es una regla de Meridian.
- **Dónde corre y qué rompe cada una** (s05; `video/reglas-aeropuerto/src/data/s05-aguanta.ts:7-43`): YARA corre en «escáner · sandbox · EDR ·
  repositorio de muestras» (en voz, los tres primeros); Sigma «se traduce a la consulta de tu SIEM, y esa corre» («Sigma no corre en el SIEM tal
  cual. Antes se traduce a su consulta», `video/reglas-aeropuerto/narration.json:211`), sin nombres de producto. «qué la rompe»: a la YARA, que «el programa deja de
  conservar esas piezas (otra compilación, otro empaquetado)» (en voz, «vive mientras la maleta lleve esas piezas», `:223`); a la Sigma por nombre
  original, «otra herramienta»; a su filtro, «una copia con su nombre normal, en otra carpeta» (`:229`). Tres chips sin nombre de nivel: «el nombre
  del disco», «el nombre original», «la cadena entera» con «explorer, PowerShell, tarea programada» (§5 punto 27); en voz, «Queda la del árbol de
  procesos, que ya viste» (`:235`), que es la regla de comportamiento de V7. Cierre: «cada una tiene su punto débil», «mide si dispara» (`:241`).
- **Las tarjetas de examen** (dominio Dissemination): «YARA mira contenido; Sigma mira eventos», «Cadena genérica, acompañada. El PDB, que es único,
  solo», «OriginalFileName viene del PE header, no del disco» (la forma de la lección y de V7) y «Sigma no corre en el SIEM tal cual: se convierte»
  (`video/reglas-aeropuerto/narration.json:71`, `:117`, `:191`, `:215`). Tarea: «las preguntas de la lección (s5m3)», «10 preguntas», sin laboratorio
  (`video/reglas-aeropuerto/src/data/s06-recap.ts:51`).
- **La voz no dice** `OriginalFileName`, `wcssvc.exe`, `MapViewOfSection`, nombres de regla, GLASS VIPER ni VELVET CICADA; ningún hash, fecha, hora
  ni equipo (`video/reglas-aeropuerto/out/script-notes.md:53-55`). VELVET CICADA solo firma sus mensajes en pantalla, y en s01 no hay ficha de
  adversario.
- **VELVET CICADA**, dos mensajes, sin fecha, los primeros de su voz (tutea, dice «analista», como su ficha de jefe, `src/data/course-gcti.ts:95`;
  ironía; empuja atajos de método y no confiesa nada ni dice qué es); ver la tabla de §3:
  - «Una palabra de mi programa y ya me pillas. Qué fácil, analista.» (`video/reglas-aeropuerto/narration.json:82`, s03-01); respuesta: «Depende.
    Una palabra corriente salta con todos. Una que solo lleva su programa, esa sí puede ir sola.» (`:79`), que deja las dos ramas de la condición.
  - «A mis herramientas las llamo como quiero. Tu regla no lo verá.» (`video/reglas-aeropuerto/narration.json:134`, s04-01; «herramientas», porque
    lo que ve la Sigma es una herramienta de Windows renombrada, y para que no se lea como el «Llámame GLASS VIPER» de V3); respuesta de apertura,
    «Pues vamos a ver qué ve la regla de Sigma.» (`:131`), y la de verdad tras la pregunta: «¿Que no lo verá? La de la tarjeta, quizá no. Esta,
    sí.» (`:199`). No es la frase de V22 («tiene razón en algo»).
- **No se toca** (sigue fuera; `docs/reviews/2026-10-14-fichas-tanda5/ficha-V27.md:342-360`): ningún hash, ni `4c81...b3` ni `9f3a...e1`, y no se
  dice qué muestra cumple la YARA; `winhlp.exe` y `updsvc.exe`; el dosier de BROKEN CHAIN (`src/data/course-gcti.ts:40`): ni «el mismo PDB en tres
  muestras» ni cuántas lo comparten (la palabra «cicada» de la ruta sale tal cual y la voz no la comenta, como en V14); la solución del Lab 3B (§4);
  el dosier de LAST WORD (`src/data/course-gcti.ts:96-97`); la fecha 2026-04-18, MER-2026-011, el flash alert MER-FA-2026-014 y la ola de abril; el
  C2, el certificado y `kazuo.tanji@`; STIX, TAXII y el indicador de `cdn-sync-status.example` (de V8); el TLP explicado; los niveles de la
  pirámide; el Lab 5B y los casos reales de S5. No se culpa a nadie: ni al SOC por pedir algo que dure ni a quien escribe primero la regla ingenua.

### AP03 · `feeds-requisito` · s3m1 · YouTube `Vh8xJjYALqQ`

Lección `src/data/practical/collection.ts:30` (bloque `video` de la «práctica complementaria» de s3m1, que `withPracticalExpansion` añade al final de
la lección, `src/data/tracks.ts:112`; va después de la tabla de los tres feeds, `:24-28`, y del párrafo que lo presenta, `:29`, y antes de la
«Resolución paso a paso», `:31`; lo fija `src/data/content.test.ts:353-354`); 9:06 (16397 fotogramas a 30 fps,
`video/feeds-requisito/src/timeline.json:4,7`). Principal (`principal-yt`, `video/feeds-requisito/video.json:6`), guion congelado el 2026-10-19
(`:18`), con música de biblioteca (`:19`) y narrado con la grabación de Lidia (`recording/lidia`, `video/feeds-requisito/narration.json:2`). El id es el de la segunda subida: el commit `5750cf21` cambió `vRin6Wc8kcw` por `Vh8xJjYALqQ` en la lección
al rehacer el máster sobre la música de biblioteca. Adversario de los interceptados HOLLOW LANTERN (`video/feeds-requisito/video.json:8`), con la
voz `sapi/Microsoft Pablo`, `rate` 0 y el efecto `machine` (`video/feeds-requisito/narration.json:9-13`), la misma que §3 da para V4. Ficha en
`docs/superpowers/plans/2026-10-19-videos-ampliaciones/AP03-feeds-requisito/ficha-produccion.md`; no tiene `out/script-notes.md` en el repositorio.
**Sin fecha ni hora**: es un «ejercicio didáctico sin fecha de incidente» (`ficha-produccion.md:25`), no menciona ningún evento de la intrusión y no
se ordena contra §2. Lleva el sello permanente «Práctica complementaria · datos ficticios» (`video/engine/src/practica/kit.tsx:8`) y **ninguna
tarjeta de examen** (`video/feeds-requisito/src/timeline.json:4386`, `"exam": []`). La serie AP no usa `src/data/`: todos los datos están en las
escenas. Canon nuevo, solo de pantalla y de voz:

- **El marco: un ejercicio de compra en Meridian, no un hecho de la campaña.** «Meridian · tú, la analista», «empresa aeroespacial»
  (`video/feeds-requisito/src/scenes/S01Hook.tsx:57`); en voz, «Eres la analista de Meridian, una empresa aeroespacial. En este ejercicio comparas
  tres suministros de información» (`video/feeds-requisito/narration.json:31`). Titular «Tres ofertas, ¿cuál compras?» (`S01Hook.tsx:31`) y la
  definición «feed = suministro recurrente», «entrega datos de forma recurrente» (`:59`). No hay CISO, SOC, IR ni ninguna persona; nadie encarga la
  compra ni la aprueba. El vídeo no dice cuándo se hace el piloto ni lo ata a la intrusión.
- **Los tres feeds, inventados** (`video/feeds-requisito/src/scenes/parts/bits.tsx:12-16`): **Faro** (icono de radar), **Atlas** (globo) y **Eco**
  (capas), cada uno como «oferta ficticia» (`S01Hook.tsx:37`), con el aviso «Faro, Atlas y Eco son inventados · sin marcas reales» (`:64`; en voz,
  «Faro, Atlas y Eco son inventados. No estamos recomendando marcas reales», `narration.json:37`). Los nombres vienen de la lección
  (`src/data/practical/collection.ts:25-27`). Son relleno didáctico: no son proveedores de Meridian en la campaña (ver §5 punto 33 para el Lab 5B).
- **Los dos requisitos de Meridian** (de la lección, `src/data/practical/collection.ts:9`; el vídeo los abrevia). **R1**: sobre cerrado «exposición
  de cuentas, con rapidez» (`S01Hook.tsx:68`); tarjeta «Indicios sectoriales de cuentas expuestas», «en menos de 24 h»
  (`video/feeds-requisito/src/scenes/S02Caso.tsx:41-42`); «R1 · cuentas expuestas» (`S05Caso.tsx:136`); «R1 · indicios nuevos antes de 24 h»,
  «cuentas expuestas del sector aeroespacial», «requisito fijo» (`S08Caso.tsx:32,35`). **R2**: sobre «infraestructura en datos históricos»
  (`S01Hook.tsx:71`); tarjeta «Infraestructura, mirando atrás», «retrospectivo · 90 días» (`S02Caso.tsx:50-51`); «R2 · infraestructura histórica»
  (`S05Caso.tsx:147`). La voz nunca dice «R1» ni «R2» salvo en la pregunta en pantalla; dice «la primera pregunta» y «la segunda», «antes de un
  día» y «mirar atrás» (`narration.json:55`). El «de distribución» de la R2 de la lección no sale. «R1» y «R2» quedan **ocupados** como requisitos
  de colección de Meridian en este ejercicio.
- **La matriz y la línea base** (s02): columnas «Req. / Fuente / Dato / Cobertura», con la fuente en blanco («¿Faro, Atlas o Eco?»), datos «cuentas
  expuestas» e «infraestructura», y cobertura «sector», «regiones», «plataformas», «tipos de dato» (`S02Caso.tsx:68-71,75,79,87-89`). «Línea base»:
  «registros internos», «intercambio sectorial», «feeds actuales» (`:101-104`; en voz, `narration.json:79`), **sin nombrar** el ISAC, la TIP ni
  ningún feed concreto. Rótulos: «años de historial» → «llega tarde para una decisión urgente» (`:58-60`), «un catálogo grande no responde a la
  pregunta» (`:95`), «¿qué añade respecto a la base?», «más documentos ≠ más respuestas» (`:109-111`).
- **Fuente frente a afirmación** (s03; genérico, sin ningún feed nombrado, `ficha-produccion.md:59`): «Ficha de la fuente · fiabilidad» con
  «historial», «acceso», «método»; «Ficha de la afirmación · credibilidad» con «evidencia», «coherencia», «corroboración»
  (`video/feeds-requisito/src/scenes/S03Caso.tsx:34-37,41-44`); «fuente con buen historial» + «pista débil», «fuente nueva» + «evidencia
  verificable», «dos juicios, por separado», «reputación ≠ corroboración» (`:51-53,59-61,66,69`); «en el informe»: «periodo observado»,
  «población», «método», «referencias», y «observación propia», «interpretación», «cita» (`:74-77,84-86`); y el dibujo «mundo entero» con «lo que
  ven sus sensores» dentro y «su % no mide el mundo entero» (`:92-95,100`). No se usa la escala de Admiralty ni ninguna nota con letras y números.
- **La cadena de citas** (s04; `video/feeds-requisito/src/scenes/S04Caso.tsx:50-52,64,79`): **Faro «observa» → Atlas «cita» → Eco «reproduce» →
  «blog» («otra publicación»)**; tras la pausa, Faro pasa a «observa · origen». En voz: «Faro publica una observación. Atlas la cita y Eco reproduce
  la cita» (`narration.json:131`). Qué observación es no se dice: no lleva dato, fecha ni víctima. Etiquetas «entrega: primero», «entrega:
  después», «entrega: más tarde» (`S04Caso.tsx:85`); «aportan contexto», «aportan rapidez», «corroboración ×3» tachado (`:108-111`); «1
  observación · de origen» (`:103`); «eco de feeds», «deduplicar entidades y eventos», «procedencia», «tiempos» (`:119-127`); y los dos pares «=
  misma exposición» y «≠ hechos distintos», con barras sin texto (`:134-143`). El «blog» sale sin nombre (en la lección de s4m2 es «blog Z»).
- **La imagen del vídeo: el mismo recorte en tres sobres.** «Es como recibir el mismo recorte en tres sobres. Cambia el sobre, no el hecho
  observado» (`narration.json:147`); en pantalla, tres tarjetas «mismo recorte» con icono de sobre (`S04Caso.tsx:94-98`). Los requisitos también
  llegan como **dos sobres cerrados** con su sello R1/R2 (`S01Hook.tsx:68,71`; `video/feeds-requisito/src/scenes/parts/feeds.tsx:82-96`). Es de la
  analogía, no del caso, y queda **ocupada**: un vídeo posterior no usa el recorte ni los sobres para otra cosa (el sobre sin texto de V22 es un correo, §5 punto 23; G02 usa después «dos sobres» con otro sentido, §5 punto 71). Segunda imagen menor, también ocupada: «No reparte medallas abstractas a proveedores» (`narration.json:323`; «medallas
  abstractas» tachado, `S08Caso.tsx:102`) y «no casarte con ella» (`narration.json:407`).
- **El piloto, cifra a cifra** (todas de la lección, `src/data/practical/collection.ts:23-27`; **ejemplo didáctico, no hechos de Meridian**).
  Cabecera «piloto ficticio · 30 días», «100 revisados por feed» (`video/feeds-requisito/src/scenes/S05Caso.tsx:138,141`; en voz, «Durante el mismo
  mes se revisaron cien elementos de cada feed con criterios compartidos», `narration.json:171`). **R1** (`S05Caso.tsx:19-23`), columnas «Útiles /
  Incrementales / Desconocidos» (`:110-112`): Faro 60 / 40 / 10; Atlas 90 / 3 / 0; Eco 80 / 1 / 5. **R2** (`:24-28`), «Útiles / Incrementales»,
  «mismo piloto · 100 revisados por feed» (`:148`): Faro 10 / 2; Atlas 70 / 45; Eco 50 / 1. La voz solo dice los incrementales de R1 («cuarenta»,
  «tres», «uno», `narration.json:183`) y el 45 de Atlas en R2 (`:195`); los útiles, los desconocidos y los demás valores de R2 solo se ven. Rótulos:
  Atlas, «muchos útiles, casi todos ya estaban disponibles» (`S05Caso.tsx:158`); «ningún ganador para todo», «aportaciones distintas, requisitos
  distintos» (`:163-164`). El póster repite las barras de R1 (60/40, 90/3, 80/1), con «útiles» y «nuevos para Meridian»
  (`video/feeds-requisito/src/Poster.tsx:13,39-40`). El vídeo **no enseña** los porcentajes de «precisión» 60 % / 90 % / 80 % de la lección (`:32`).
- **La tabla de costes** (s06; `video/feeds-requisito/src/scenes/S06Caso.tsx:35-39,52-56`): «p95 de entrega · R1 · límite 24 h»: Faro 8 h, Atlas
  36 h (en ámbar, con «> 24 h», `:62`), Eco 12 h; «Completitud · % de campos»: 95 %, 99 %, 70 %; «Licencia · al mes»: 900 €, 600 €, 200 €; «Triaje
  · horas al mes»: 6 h, 4 h, 18 h (Eco en ámbar); «Integración · inicial»: 8 h, 4 h, 2 h. En voz solo «Faro queda en ocho horas. Atlas, en treinta y
  seis» (`narration.json:213`) y «dieciocho horas al mes… Con Faro son seis» (`:237`); ningún importe en euros se dice. El p95 se explica con una
  tira de 20 casillas, 19 llenas, y «el 95 % llegó dentro de este tiempo» (`S06Caso.tsx:73-82`); no hay p95 de R2 (`:24`). Rótulos: «registro»,
  «dirección», «sin fecha», «sin contexto», «más trabajo del que ahorra» (`:91-95`); «% de campos completos ≠ cuánto del mundo descubrió» (`:99`);
  «licencia + integración + mantenimiento + trabajo del analista = coste total» (`:139-151`); «barato de licencia, caro de revisar» (`:157`).
- **Los criterios de R1, «fijados antes de medir»** (s07; `video/feeds-requisito/src/scenes/S07Caso.tsx:53-57`; de la lección, `collection.ts:35`,
  «umbrales ficticios»): «≥ 20 útiles incrementales», «p95 < 24 h», «campos completos ≥ 90 %», «triaje ≤ 8 h/mes». En voz, solo el veinte: «veinte
  hallazgos útiles incrementales, puntualidad suficiente y campos completos. También un esfuerzo de revisión que el equipo pueda sostener»
  (`narration.json:259`). El orden: «medir en el piloto → criterios después → gana quien prefieras» frente a «acordar criterios → medir → elegir»
  (`S07Caso.tsx:34-38,43-47`). «Controles de calidad»: «qué significa «útil»», «casos dudosos: se adjudican», «muestra comparable», «discrepancias y
  desconocidos» (`:73-77`), y «el feed no es su propia vara de medir» (`:81`). «Viabilidad del piloto»: «errores de integración»,
  «indisponibilidad», «cuotas», «derechos de uso y retención» (`:85-89`). «Aparte · precio y contrato», «una condición separada» (`:65-66`).
- **La decisión, por requisito** (s08): la premisa «Meridian ya recibe casi todos los datos de Atlas y necesita indicios nuevos antes de un día»
  (`narration.json:289`; «ya recibes casi todo de Atlas», `video/feeds-requisito/src/scenes/S08Caso.tsx:45`), que en la lección es el enunciado de
  un check (`collection.ts:40`). **Para R1, Faro**: cumple «incremento», «rapidez», «completitud», «esfuerzo», «sujeto a presupuesto y contrato»
  (`S08Caso.tsx:53-55,61`; en voz, «Faro cumple los umbrales ilustrativos… La contratación sigue dependiendo del presupuesto y del contrato»,
  `narration.json:305`). **Para R2, Atlas** «puede aportar más», «no se cancela: responde a otra pregunta» (`S08Caso.tsx:67-69,73`). **Eco**:
  «licencia barata», y pierde por «añade muy poco», «campos incompletos», «consume más revisión» (`:80,85-92`). El vídeo no dice que Meridian firme,
  pague ni despliegue nada: «priorizas» y «valoras» (ver §5 punto 31 para el «compras Faro» del cierre).
- **La renovación** (s09): línea «mes del piloto» → «renovación futura», «sin fecha fija»
  (`video/feeds-requisito/src/scenes/S09Caso.tsx:57-60`); «Base al piloto» («registros internos», «feeds actuales», `:66-69`) → «Base al renovar»
  con «+ otra fuente, mismos derechos», «el proveedor pierde cobertura», «añade ruido» (`:77-83`); «incremento del feed», «hay que recalcularlo»
  (`:89-95`); «Repite la comparación»: «con la base actual», «calidad», «tiempos», «trabajo del equipo» (`:102-106`); **Renovar** «el incremento
  sigue demostrado», **Ajustar** «aporta menos, o solo a un requisito», **Cancelar** «ya no añade nada nuevo» (`:111-117`; las tres condiciones solo
  están en pantalla); «Integración ya pagada», «coste histórico», «no obliga a seguir pagando» (`:123-126`); «Decisión de renovación, por escrito»:
  «el requisito», «los resultados», «limitaciones de colección», «si hay una sola cadena de citas» (`:133-137`), con Faro → Atlas → Eco y «una sola
  cadena: dilo» (`:143-149`); y «afirmación que no puedes evaluar → sin evaluar», «marcarla como verdadera» tachado (`:155-163`). Todo es hipotético:
  ninguna renovación ocurre.
- **Las dos pausas con pregunta** (no son de examen): «¿Tres publicaciones o tres observaciones?» (`narration.json:140`), opciones «Tres
  confirmaciones independientes» / «Una observación de origen», acierta la segunda (`S04Caso.tsx:90`); y «Para R1, ¿Faro o Atlas?»
  (`narration.json:298`), opciones «Faro» / «Atlas», acierta Faro (`S08Caso.tsx:39`).
- **Las cinco tarjetas «PRÁCTICA COMPLEMENTARIA»** (sin dominio ni insignia de examen): «Evalúa cada fuente contra un requisito concreto»
  (`S02Caso.tsx:115`), «Sigue el origen; republicar no corrobora» (`S04Caso.tsx:146`), «Calidad, puntualidad y coste total importan»
  (`S06Caso.tsx:159`), «La elección depende del incremento útil y del plazo» (`S08Caso.tsx:106`) y «Renueva por valor actual, no por lo que ya
  pagaste» (`S09Caso.tsx:166`).
- **El cierre** (`video/feeds-requisito/src/scenes/S10Cierre.tsx:39-41`): tres reglas, «Requisito primero · la pregunta antes de las ofertas»,
  «Incremento con origen · citar no es confirmar», «Piloto y coste total · criterios antes de mirar quién gana»; «R1 → Faro», «R2 → Atlas»
  (`:47-55`); «renovar», «dejar de pagar» (`:62-63`); «utilidad observable», con «una marca» y «un % aislado» tachados (`:68-70`). Tarea: «Resuelve
  la comparación de feeds de la lección s3m1», «Una fuente por requisito, y qué evidencia cambiaría tu elección» (`:78-80`; en voz, «la lección de
  colección», `narration.json:401`). Créditos: «Alertópolis · material independiente, no afiliado a SANS/GIAC · datos y participantes ficticios»
  (`:89`). Póster: «Tres feeds, dos preguntas», «comprar información que añada valor», «R1 · antes de 24 h», «R2 · 90 días atrás», «~9 min»
  (`video/feeds-requisito/src/Poster.tsx:27-28,49-52,56`).
- **HOLLOW LANTERN**, dos mensajes, sin fecha (tutea, no dice «analista», empuja atajos de método y no confiesa nada, `ficha-produccion.md:25`); ver
  la tabla de §3:
  - «Lo dice un proveedor conocido. Ya está confirmado.» (`video/feeds-requisito/narration.json:94`, s03-01); respuesta: «Conocer al proveedor
    ayuda, pero no confirma cada dato. La fiabilidad de una fuente se apoya en su historial, su acceso y su método.» (`:91`). El mensaje no nombra
    a Faro ni le atribuye ningún fallo.
  - «El piloto ha ido bien. Pon ahora los criterios.» (`video/feeds-requisito/narration.json:252`, s07-01); respuesta: «Si eliges los criterios
    después, puedes hacer que gane quien prefieras. Acuérdalos antes de medir.» (`:249`).
  Entre los mensajes que recoge la tabla de §3, es la primera vez que HOLLOW LANTERN habla de algo que no es su infraestructura o su muestra
  (dominios, certificados, WHOIS, sandbox): aquí opina sobre cómo compra Meridian, sin decir que sepa nada del piloto ni de sus resultados.
- **La voz no dice** GLASS VIPER, VELVET CICADA ni HOLLOW LANTERN (solo firma sus mensajes en pantalla); «R1» ni «R2»; ningún importe en euros,
  ningún porcentaje de completitud, el «90 días» ni el «30 días» (dice «el mismo mes»); «precisión», «Admiralty», «TLP», «ISAC» ni «TIP»; ninguna
  fecha, hora, equipo, cuenta, dominio, IP ni hash.
- **No se toca**: nada de la intrusión (ni E7, ni ENG-WS-041, ni el C2, ni el phishing, ni Orbital); el ISAC aeroespacial y el indicador STIX de V8
  (la línea base dice solo «intercambio sectorial»); la ola de credenciales del 2026-04-18 y `cdn-sync-status.example`, aunque R1 hable de «cuentas
  expuestas»; `kazuo.tanji@` y el dosier de HOLLOW LANTERN (`src/data/course-gcti.ts:59`); los casos del Lab 5B donde salen Faro y Eco
  (`src/data/lab-challenges/report.ts:12-13,25`). No se culpa a ningún proveedor: Eco pierde «para estos criterios», no por barato
  (`narration.json:317`), y Atlas «no se cancela».

### AP04 · `muestra-candidatos` · s3m2 · YouTube `CB-TTDBRF3I`

Lección `src/data/practical/collection.ts:76` (bloque `video` «Del hash a una relación defendible», dentro de la práctica complementaria
«De una muestra a candidatos relacionados», `:59`, que `withPracticalExpansion` añade al final de s3m2, `src/data/tracks.ts:112`; va después
del párrafo «Sin premium o sin datos» y de la frase puente, `:74-75`, y antes del encabezado «Caso resuelto · candidatos fuertes, débiles y
sin datos», `:77`; lo fija `src/data/content.test.ts:355-356`). Es el **segundo vídeo de s3m2**: el primero es V15, en la lección base
(`src/data/s3.ts:350-356`). 8:42 (15663 fotogramas a 30 fps, `video/muestra-candidatos/src/timeline.json:4,7`). Principal (`principal-yt`,
`video/muestra-candidatos/video.json:6`), guion congelado el 2026-10-19 (`:18`), narrado con la grabación de Lidia (`recording/lidia`,
`video/muestra-candidatos/narration.json:2`) y con música de biblioteca (`video/muestra-candidatos/video.json:19`). Adversario de los
interceptados HOLLOW LANTERN (`video/muestra-candidatos/video.json:8`), con la voz `sapi/Microsoft Pablo`, `rate` 0 y el efecto `machine`
(`video/muestra-candidatos/narration.json:9-13`). No hay `out/` en el repositorio (ni `script-notes.md` ni `youtube-upload.json`); la ficha de
producción y la revisión de guiones están en `docs/superpowers/plans/2026-10-19-videos-ampliaciones/AP04-muestra-candidatos/ficha-produccion.md`
y `docs/reviews/2026-10-19-videos-ampliaciones.md`. Dos títulos para lo mismo: el bloque de la lección dice «Del hash a una relación
defendible» (`src/data/practical/collection.ts:76`), y el storyboard y la miniatura, «Del hash a los candidatos: pivotar sin inventar
parentescos» (`video/muestra-candidatos/storyboard.json:2`; `video/muestra-candidatos/src/Poster.tsx:53-56`). **Sin fecha ni hora, y sin
ningún hecho de la campaña**: es un ejercicio con fichas inventadas («ejercicio didáctico sin fecha de incidente», ficha `:25`), así que no se
ordena contra §2 ni va después de ningún evento. Cinco capítulos, diez escenas (`video/muestra-candidatos/src/timeline.json:10-19`), **cero
tarjetas de examen** (`:4264`), cinco tarjetas «PRÁCTICA COMPLEMENTARIA», dos pausas de decisión y dos interceptados (`:4265-4272`). En todas
las escenas, el sello «Práctica complementaria · datos ficticios» (`video/engine/src/practica/kit.tsx:8`). **La lección no cambia por él en lo
que el repositorio deja ver** (el bloque llega con la ampliación práctica). Canon nuevo, solo de pantalla y de voz:

- **El marco: un ejercicio, no el caso** (relleno didáctico, no hechos de Meridian). En pantalla, «fichas inventadas», «Meridian · empresa
  aeroespacial» y «sin descargar ni ejecutar malware» (`video/muestra-candidatos/src/scenes/S01Hook.tsx:70`, `:73`, `:76`); en voz, «Trabajas
  con fichas inventadas en un ejercicio de Meridian, una empresa aeroespacial. No vas a descargar ni ejecutar malware. La muestra inicial se
  llama A.» (`video/muestra-candidatos/narration.json:31`). Meridian solo presta el nombre a la mesa de trabajo: ni SOC, ni CISO, ni analista
  con cargo, ni `ENG-WS-041`, ni informe MER. Título de la escena «El parecido no termina el caso» (`S01Hook.tsx:55`), con «archivo 1»,
  «archivo 2», «se parecen» y «¿misma familia?» (`:59-65`).
- **La muestra A y sus cuatro observaciones** (`video/muestra-candidatos/src/scenes/S01Hook.tsx:81`, `:89-92`): «Muestra A · muestra inicial»;
  «Imports · I1», «Cadena · DEMO-CFG-7», «Ruta PDB · proyecto demo» y «Conducta · envío a laboratorio». Son las de la lección («imports I1,
  cadena poco común DEMO-CFG-7, PDB de un proyecto demo y comportamiento descrito de envío a un endpoint de laboratorio»,
  `src/data/practical/collection.ts:78`). **A no es ninguna muestra de Meridian**: no lleva hash, nombre de fichero, fecha ni equipo, y la
  ficha pide «fichas A/B/C/D/E, distintas de las muestras históricas de GLASS VIPER» (ficha `:48`). En voz no se nombra ninguna observación
  («Lo que tenemos de ella son observaciones que pueden abrir otras búsquedas», `video/muestra-candidatos/narration.json:37`).
- **El recorrido de siete pasos** (`video/muestra-candidatos/src/scenes/S01Hook.tsx:12-20`): Muestra, Observaciones, Hipótesis, Pivotes,
  Candidatos, Corroboración, Conclusión (el flujo de la lección, `src/data/practical/collection.ts:60`); los candidatos B, C, D y E entran
  como «candidato · sin contrastar» (`S01Hook.tsx:101-103`) y el cierre de la promesa son tres píldoras, «qué relación sostienes», «con qué
  confianza», «qué falta por comprobar» (`:138-144`). En voz, «Buscar a partir de una observación es pivotar. Pero lo que recuperas son
  candidatos» (`video/muestra-candidatos/narration.json:43`).
- **Tres huellas, sin un solo valor** (s02; `video/muestra-candidatos/src/scenes/S02Huellas.tsx:55-133`): «Hash criptográfico · huella exacta
  del contenido» («mismos bytes, misma huella», «A con un byte cambiado», «toda la huella cambia», «otro hash, no otra familia»); «Imphash ·
  imports normalizados» («Programa 1 · usa bibliotecas», «Programa 2 · otro programa», «mismo imphash», «no prueba el mismo compilador», «sin
  relación, también coinciden»); «Hashing difuso · ssdeep · busca parecidos» («parecido, no huella exacta», «sin probabilidad de parentesco»,
  «una biblioteca explica parte», «hace falta contexto»). Las huellas son filas de celdas de brillo, «never a real hash»
  (`video/muestra-candidatos/src/scenes/parts/HashBar.tsx:8`): **ningún hash en todo el vídeo**, ni `9f3a...e1` ni `4c81...b3`. La voz
  explica los tres términos («Se llama hash criptográfico», «El imphash resume esas importaciones», «Lo llamamos hashing difuso. Ssdeep es uno
  de esos métodos», `video/muestra-candidatos/narration.json:55`, `:67`, `:79`).
- **La ruta del PDB del ejercicio** (s03; `video/muestra-candidatos/src/scenes/S03Etiqueta.tsx:48-67`): panel «Ruta PDB · Program Database»
  con «no dice quién lo escribió», la ruta `...\proyecto-demo\ldr.pdb` (`:54`, **solo de pantalla**: la lección dice «PDB de un proyecto
  demo» sin ruta), «símbolos de depuración», «pista sobre el proyecto» y «puede copiarse o falsearse». El nombre de fichero `ldr.pdb` es el
  del PDB canónico (§3, «Capacidades»), pero la carpeta es otra y el vídeo no la relaciona con `D:\proj\cicada\loader\Release\ldr.pdb`. En
  voz: «No sabes quién lo escribió solo por esa ruta. Un PDB es un archivo de símbolos de depuración.» y «Algunos binarios conservan una ruta
  que puede dar pistas sobre el proyecto. Esa ruta también puede copiarse o falsearse.» (`video/muestra-candidatos/narration.json:91`,
  `:101`). El título de la escena, «La etiqueta y la firma» (`video/muestra-candidatos/src/timeline.json:12`), recoge la palabra «etiqueta»
  de V13 a V15, pero ni la voz ni la pantalla dicen «taller» ni «enlace fuerte» (ver §5 punto 36).
- **Cadenas, configuración y firma** (s03; `video/muestra-candidatos/src/scenes/S03Etiqueta.tsx:72-135`): «Cadenas y configuración · rasgos
  poco comunes», con dos barras sin cifra, «palabra genérica» (corta) y «estructura poco común» (larga), y «código reutilizado», «señuelos»,
  «¿distingue las explicaciones?»; «Firma de código · certificado y validez», con «huella», «validez», «contexto», «robado», «compartido»,
  «no es el certificado TLS del servidor» (solo pantalla) y «una firma no prueba benignidad»; y el remate «candidato → ✕ familia, campaña o
  actor · no es automático». En voz, «Una firma no demuestra benignidad. Un mismo certificado tampoco demuestra por sí solo una familia,
  campaña o actor.» (`video/muestra-candidatos/narration.json:125`). Sin firmante con nombre en esta escena.
- **El candidato C y el 94** (s04; `video/muestra-candidatos/src/scenes/S04Noventa.tsx:48-117`): «Muestra A · referencia» y «Candidato C»
  unidos por «imphash · I1» y «ssdeep · 94» (`:60-61`), los dos colgando de «Biblioteca común · origen de ambos rasgos» (`:64`); tachado, «94
  % de probabilidad de familia» (`:68`); lo que los separa, `DEMO-CFG-7` «su configuración» frente a «configuración distinta · la de C»
  (`:75-82`). Veredicto: «coincidencia débil», «fuera del conjunto, por ahora», «no es benigno», «explicación alternativa todavía sin
  descartar» (`:105-115`). En voz, «La cifra no dice que exista un noventa y cuatro por ciento de probabilidad de pertenecer a la familia» y
  «si dos señales salen del mismo componente, no tienes dos corroboraciones independientes» (`video/muestra-candidatos/narration.json:147`,
  `:153`). Es la fila C de la lección (`src/data/practical/collection.ts:81`). **Este 94 es de A frente a C**, no el del informe MER-2026-023
  (ver §5 punto 38).
- **Las consultas ilustrativas** (s05; `video/muestra-candidatos/src/scenes/S05Consultas.tsx:14-19`): panel «Búsqueda avanzada» con el aviso
  «ilustrativas · valores inventados · no se ejecutan» (`:56-58`) y cuatro de las ocho líneas de la lección
  (`src/data/practical/collection.ts:72`): `imphash:11111111111111111111111111111111` «¿mismos imports?», `content:"cicada-demo-v1"`
  «¿contiene esta cadena?», `metadata:"ldr.pdb"` «¿aparece esta ruta?» (que pasa a «también otros campos», `:97`) y
  `signature:"Meridian Demo Signing"` «¿qué firma lleva?». Fuera quedan `similar-to:`, `ssdeep:"3072:ABCDEFGH:ABCD"`, la línea del SHA-256 y
  `contacted_ip:192.0.2.10`: **el vídeo no enseña ninguna IP ni ningún dominio**. Arriba, «partir del hash de un informe existente» y «no es
  subir el archivo» (`:44`, `:47`); abajo, «El acceso depende de · el producto · los permisos · los datos disponibles», «Sin esas funciones ·
  fichas del ejercicio · informes públicos con procedencia», «practicar el razonamiento sin pagar», «sin subir datos sensibles»
  (`:112-139`). **La marca solo va en voz**: «En VirusTotal puedes partir del hash de un informe existente. Eso es distinto de subir el
  archivo.» (`video/muestra-candidatos/narration.json:171`); la pantalla no la escribe. Es el único vídeo del repositorio cuya narración o escenas
  nombran el servicio (búsqueda de «VirusTotal» en `video/*/narration.json`, `src/scenes` y `src/data`); V15 lo dejó «sin nombre ni marca». Todos los valores son relleno de sintaxis, no datos del caso: «Los valores son inventados y no las ejecutamos»
  (`:177`).
- **Relaciones con dirección** (s06, fase 1; `video/muestra-candidatos/src/scenes/S06Relaciones.tsx:82-113`): alrededor de «Muestra A · el
  archivo», cuatro flechas rotuladas, «lo ejecutó» (desde «Padre de ejecución · quién lo lanzó»), «contiene» («Dominio incrustado · texto en
  el archivo»), «contactó» («Contacto observado · visto al ejecutarlo») y «soltó» («Archivo soltado · creado por A»); y «un dominio escrito
  en el archivo no prueba contacto», «contacto observado no prueba control del atacante», «servicio compartido», «comprobación legítima».
  Ningún nodo lleva nombre, dominio ni fichero. La voz dice «dirección» donde la pantalla dice «dominio» («Una dirección escrita dentro de
  un archivo no prueba que se contactara», `video/muestra-candidatos/narration.json:213`) y solo desarrolla dos de las cuatro relaciones.
- **El candidato D** (s06, fase 2; `video/muestra-candidatos/src/scenes/S06Relaciones.tsx:125-161`): «Muestra A» y «Candidato D» apuntan a
  «IP de alojamiento · la misma para A y D», **sin valor**; cinco equipos sin nombre y «un servidor, varios clientes»; una barra «intervalo
  amplio» con A y D en los extremos, sin fechas; «esa coincidencia no basta para unirlos»; y tres preguntas, «¿Cuándo resolvió cada
  dominio?», «¿Qué servicio era?», «¿Qué evidencia los vincula?». En voz, «D comparte una dirección de alojamiento con A durante un intervalo
  amplio. El servidor tiene varios clientes.» (`video/muestra-candidatos/narration.json:225`). Es la fila D de la lección
  (`src/data/practical/collection.ts:82`); los «seis meses de diferencia» del check de s3m3 (`:115`) no salen. Nada lo acerca a
  `185.220.x.x` ni a sus ~14.000 inquilinos (§3): es otro servidor, de ejemplo.
- **Dos certificados y dos grafos** (s06, fase 3; `video/muestra-candidatos/src/scenes/S06Relaciones.tsx:171-207`): «Certificado TLS del
  servidor · vincula servidor y dominio» frente a «Certificado de firma de código · vincula archivos firmados», «objetos diferentes»; «De
  cada relación, conserva · dirección · tiempo · fuente» (la voz solo dice dirección y fuente, `video/muestra-candidatos/narration.json:237`);
  y el mismo grafo dos veces, «Todas las líneas iguales» y «Líneas que dicen lo que son», este con «lo ejecutó», «contiene», «contactó»,
  «soltó» y «misma IP». Imagen del vídeo, que queda **ocupada**: el grafo cuyas líneas se dibujan distintas según lo que sostienen (también
  en la miniatura, `video/muestra-candidatos/src/Poster.tsx:12-18`).
- **El candidato B, el que gana peso** (s07; `video/muestra-candidatos/src/scenes/S07Gana.tsx:62-118`): «Candidato B, frente a la muestra A»
  con cinco filas marcadas, «Imports · I1», «Cadena distintiva · DEMO-CFG-7», «Estructura de configuración · misma estructura», «Secuencia de
  carga · concordante», «Comportamiento · concordante»; «Informe de origen 1 · observaciones de B» e «Informe de origen 2 · otra fuente,
  otras observaciones», sin autor ni fecha, con «puedes contrastarlas entre sí»; dos hipótesis con barra sin cifra, «Código compartido · B lo
  sostiene mejor» y «Componente público · sigue siendo posible», y «¿las fuentes son independientes?»; veredicto «Relacionado probable ·
  confianza moderada, dentro de ese alcance»; y la escalera «Código · lo que B sostiene», «Campaña · no demostrado», «Operador · no
  demostrado», con «código, actividad y autoría: niveles distintos». En voz, «No has demostrado que pertenezca a la misma campaña ni que lo
  use el mismo operador. Código, actividad y autoría son niveles diferentes.» (`video/muestra-candidatos/narration.json:277`). Es la fila B
  de la lección (`src/data/practical/collection.ts:80`); la voz no dice «cluster» (dice «conjunto», `:159`) ni H1/H2.
- **El candidato E y la casilla vacía** (s08; `video/muestra-candidatos/src/scenes/S08Casilla.tsx:74-145`): «Candidato E · solo una mención
  de PDB», con «Ruta PDB · mencionada», «Bytes · sin dato», «Procedencia · sin dato»; «sin informe accesible que permita contrastarlo»;
  «CAMPO «RELACIONES» DE E» con dos lecturas, «Sin relaciones» (lista vacía) y «No disponible» («sin acceso al dato»); «describe tu
  limitación de colección»; «No demuestra · ausencia de relaciones · benignidad · pertenencia al conjunto»; E pasa a «pista pendiente ·
  confianza baja» y «pedir la evidencia que falta»; «una búsqueda sin resultados puede deberse a · cobertura · filtros · falta de datos»; «no
  rellenes un hueco inventando un resultado», «registrar la limitación también es avanzar». En voz, «Para E, alguien menciona la misma ruta
  de depuración, pero no aporta bytes ni procedencia del dato. No tienes acceso a un informe que permita contrastarlo.»
  (`video/muestra-candidatos/narration.json:289`). «La misma ruta» es la de A, la del proyecto demo; no se dice cuántas muestras la llevan.
- **La bitácora, sin datos** (s09; `video/muestra-candidatos/src/scenes/S09Bitacora.tsx:60-72`): «Bitácora · ejemplo ficticio» con diez
  campos, Consulta, Filtros, Fecha de consulta, Fecha de observación, Evidencia, Fuente, Juicio, Alternativa, Próxima acción y Confianza,
  **todos con una barra gris en lugar de contenido** (`:14`): ni `Q-01`, ni `E-01`, ni `J-01`, ni el «2026-10-19 10:00 UTC» del registro de la
  lección (`src/data/practical/collection.ts:91`), que quedan solo en el texto. A su lado, «búsquedas fallidas», «funciones no disponibles»
  (`:78-80`); el resultado del caso, «B · Relacionado probable por código», «C · No se incorpora con la evidencia actual», «D · No se
  incorpora con la evidencia actual», «E · Sigue pendiente» (`:87-90`), con «débil no es descartado para siempre»; «Qué cambiaría tu juicio ·
  validar más variantes · contrastar configuración · una observación independiente» (`:102-105`); y dos medidores sin cifra, «cuánto sostienen
  los datos» y «qué tan abiertas siguen las alternativas» (`:110-111`). En voz, «La conclusión del caso mantiene B como relacionado probable
  por código. C y D no se incorporan con la evidencia actual. E sigue pendiente.» (`video/muestra-candidatos/narration.json:341`).
- **Las dos decisiones** (pausa de 131 fotogramas, unos 4,4 s, cada una, `video/muestra-candidatos/src/timeline.json:4266-4267`; el guion pide 4,5 s,
  `video/muestra-candidatos/narration.json:141`, `:299`): «¿Confirmas C o buscas qué lo
  distingue?», con «Confirmar misma familia» y «Buscar evidencia que discrimine» (correcta la segunda;
  `video/muestra-candidatos/narration.json:140`; `video/muestra-candidatos/src/scenes/S04Noventa.tsx:93`); y «¿Sin relaciones o dato no
  disponible?», con «No tiene relaciones» y «No hay dato accesible» (correcta la segunda; `video/muestra-candidatos/narration.json:298`;
  `video/muestra-candidatos/src/scenes/S08Casilla.tsx:110`). Respuestas en voz: «Buscas evidencia que las distinga.» (`:147`) y «Que no está
  disponible. Eso describe tu limitación de colección.» (`:305`).
- **Sin tarjetas de examen** (`video/muestra-candidatos/src/timeline.json:4264`). En su lugar, cinco tarjetas «PRÁCTICA COMPLEMENTARIA»
  (`video/engine/src/practica/bits.tsx:197`): «Hash exacto identifica bytes; similitud genera candidatos»
  (`video/muestra-candidatos/src/scenes/S02Huellas.tsx:134`), «Dos señales dependientes no son dos corroboraciones» (`S04Noventa.tsx:117`),
  «Comprueba función, dirección y tiempo de la relación» (`S06Relaciones.tsx:211`), «No disponible no equivale a inexistente»
  (`S08Casilla.tsx:145`) y «Registra consulta, evidencia, alternativas y confianza» (`S09Bitacora.tsx:114`). Sin dominio de examen.
- **El cierre y la tarea** (s10; `video/muestra-candidatos/src/scenes/S10Cierre.tsx:39-90`): tres reglas, «Un candidato no es atribución ·
  el hash exacto identifica bytes», «Corrobora con alternativas · contexto e independencia», «Documenta los límites · conserva las dudas
  abiertas»; «una puntuación», «una ruta», «una dirección compartida» → «no es una familia confirmada»; «el objetivo no es llenar el grafo»,
  «sostener una relación que resista las alternativas»; la tarea, «PRÁCTICA COMPLEMENTARIA · Resuelve B, C, D y E en la lección s3m2 ·
  decide qué harías con cada ficha y escribe el motivo» (`:71-72`; en voz, «Abre ahora el caso de candidatos de la lección de malware como
  colección», `video/muestra-candidatos/narration.json:389`), sin laboratorio; «una línea en el grafo no lo decide por ti»; y el aviso
  «Alertópolis · material independiente, no afiliado a SANS/GIAC · fichas y datos ficticios» (`:90`).
- **La miniatura** (`video/muestra-candidatos/src/Poster.tsx:13-18`, `:43`, `:53-62`): «Del hash a los candidatos», «pivotar sin inventar
  parentescos», A con cuatro líneas de trazo distinto a B «probable», C «débil», D «débil» y E «pendiente», «Práctica complementaria», «~9
  min» y «Datos ficticios». «Débil» para D solo está aquí: las escenas dicen de D «no basta para unirlos» y «No se incorpora con la evidencia
  actual».
- **La voz no dice** GLASS VIPER, VELVET CICADA ni HOLLOW LANTERN; ningún hash, dominio, IP, fecha, hora, equipo ni persona; ni `I1`, ni
  `DEMO-CFG-7`, ni `ldr.pdb`, ni `cicada-demo-v1`, ni «Meridian Demo Signing» (todo eso solo se ve); ni «cluster», «H1», «H2», «TLSH» ni
  «similar-to». De marcas, solo «VirusTotal» y «Ssdeep» (`video/muestra-candidatos/narration.json:171`, `:79`). HOLLOW LANTERN solo firma sus
  mensajes en pantalla («MENSAJE INTERCEPTADO · HOLLOW LANTERN», `video/engine/src/overlay/InterceptLayer.tsx:96`).
- **HOLLOW LANTERN**, dos mensajes nuevos, sin fecha (afirmaciones cortas que empujan un atajo de método; tutea; no confiesa nada, no dice
  quién es ni habla de su infraestructura; ficha `:25`, «proponen errores de método; no confiesan incidentes»); ver la tabla de §3:
  - «Mismo PDB. Ya sabes quién lo escribió.» (`video/muestra-candidatos/narration.json:94`, s03-01); respuesta de la narradora: «No sabes
    quién lo escribió solo por esa ruta. Un PDB es un archivo de símbolos de depuración.» (`:91`).
  - «Si encaja en tu grafo, mételo ya en la campaña.» (`video/muestra-candidatos/narration.json:252`, s07-01); respuesta: «Encajar en el
    dibujo no basta.» (`:249`), y más abajo, «No has demostrado que pertenezca a la misma campaña ni que lo use el mismo operador» (`:277`).
- Sin personas nuevas, sin organizaciones nuevas y sin productos salvo VirusTotal en voz.
- **No se toca** (sigue fuera): la muestra del informe MER-2026-023 y todo su contenido (`9f3a2c...e1`, `1b8d4f2a...`, `3072:Ab9..:Xk2`, el
  compile time, `D:\proj\cicada\loader\Release\ldr.pdb` entero, los imports, «Bright Meridian Software Kft.», el pipe, la tarea
  `WindowsUpdateCheck` y los cinco hosts; `src/data/s3.ts:326-344`); `winhlp.exe`, `updsvc.exe`, `msdtcs.exe` y `4c81...b3` (§5 puntos 1 y
  2); cuántas muestras comparten PDB (§5 punto 11) y el dosier de BROKEN CHAIN (`src/data/course-gcti.ts:40`); el dosier de DEEP WELL
  (`src/data/course-gcti.ts:59`): ni certificados TLS compartidos, ni `kazuo.tanji@`, ni «una sola organización»; `update-svc-cdn.com`,
  `185.220.x.x`, `141.98.6.10` y el Lab 3A (el storyboard lo pide: «No desvelar el Lab3A ni usar sus respuestas»,
  `video/muestra-candidatos/storyboard.json:207`); E7, E9, Orbital y cualquier fecha de §2. No se culpa a nadie.

### AP05 · `yara-condicion` · s3m5 · YouTube `fl02bWFRSUc`

Lección `src/data/practical/analysis-yara.ts:28-34` (bloque `video` de la «práctica complementaria» que `withPracticalExpansion` añade a s3m5,
`src/data/tracks.ts:112`; va después del párrafo de falsos positivos, falsos negativos y sobreajuste, `:26`, y de su frase de entrada, `:27`, y
antes de la lista de pasos del editor, `:35-41`, y del bloque `yara-practice`, `:42`; lo fija `src/data/content.test.ts:283-285`; llegó con el
commit `c566b4c9`, que solo inserta la frase de entrada, el bloque, su prueba y los archivos de `public/videos/`: **la lección no cambió con él**).
Duración publicada 9:01 (541 s, `src/data/security/video-inventory.ts:2368`; los subtítulos acaban en `00:08:57.567`,
`public/videos/yara-condicion-captions.vtt:600`); el `timeline.json` del repositorio es la **estimación** previa a la voz (16013 fotogramas a
30 fps, `video/yara-condicion/src/timeline.json:2,4,7-8`), ver §5. Principal (`principal-yt`, `video/yara-condicion/video.json:6`), guion
congelado el 2026-10-19 (`:19`). Adversario de los interceptados HOLLOW LANTERN (`video/yara-condicion/video.json:8`), con la voz
`sapi/Microsoft Pablo`, `rate` 0 y el efecto `machine` (`video/yara-condicion/narration.json:9-13`). No tiene `out/script-notes.md` en el
repositorio; su ficha es `docs/superpowers/plans/2026-10-19-videos-ampliaciones/AP05-yara-condicion/ficha-produccion.md`. **Sin fecha ni hora
del caso**: es un «ejercicio didáctico sin fecha de incidente» (ficha `:25`) y no se ordena contra §2; tampoco usa el «hoy» de s3m5 que fijó V8
(2026-07-02). Es el primero de los dos vídeos de la práctica de YARA: AP06 `yara-prueba-entrega` (`:52-58` de la lección) sigue con la misma
regla y el mismo corpus. **Todo lo que enseña es material de práctica («Práctica complementaria · datos ficticios», rótulo fijo,
`video/engine/src/practica/kit.tsx:8`): ningún dato es un hecho de la intrusión de Meridian.** Canon nuevo, solo de pantalla y de voz:

- **El marco: Meridian solo como escenario.** Título «Escribir YARA: qué debe coincidir y qué puede cambiar»
  (`video/yara-condicion/src/scenes/S01Hook.tsx:48`), ficha «Meridian · empresa aeroespacial» (`:52`) y, en voz, «El ejercicio acompaña a
  Meridian, una empresa aeroespacial» (`video/yara-condicion/narration.json:32`). El vídeo **no dice** que Meridian escriba, despliegue ni reciba
  esta regla, ni que los archivos salgan de su red: la analista no aparece, no hay SOC, CISO, equipo, hora ni cuenta. A la derecha, «Corpus
  sintético e inerte · no es malware» (`S01Hook.tsx:61`) y «Corpus ALRTDEMO» (`:69`); en voz, «archivos inertes, sin malware ni cuentas reales»
  (`narration.json:26`) y «un conjunto de archivos de prueba. Lo llamamos corpus» (`:44`).
- **El corpus en pantalla (relleno didáctico, no muestras del caso).** «Lo que queremos reconocer»: «Archivo A», «Archivo B» y «Archivo C»,
  rotulados «variante» (`video/yara-condicion/src/scenes/S01Hook.tsx:73-77`); «Lo que debe quedar fuera»: `benign-common`, `benign-hex` y
  `benign-manual` (`:81-84`). Más adelante salen `boundary-4096` («4096 bytes exactos»), `large` («mayor que 4096») y `future-uncovered`
  («marcador v2: sin cobertura») (`video/yara-condicion/src/scenes/S08Limite.tsx:60,65,89`). Son seis de los nueve controles del paquete
  (`public/labs/yara-practice/fixtures.py:17-28`); no salen `benign-route`, `benign-marker` ni `empty`, ni los nombres de fichero `a.dat`,
  `b-wide.dat`, `c-heldout.dat`, ni la cifra «12». «A, B y C son nombres de la explicación, no de la condición» (`S01Hook.tsx:100`; en voz,
  `narration.json:50`). El formato ALRTDEMO es «inventado: no es PE ni ejecutable» (`video/yara-condicion/src/scenes/S07Manual.tsx:109`).
- **La regla de referencia, tal como está en el paquete** (`video/yara-condicion/src/scenes/S02Partes.tsx:12-27`, panel «reference.yar», `:58`;
  copia de `public/labs/yara-practice/reference.yar:2-13`): `rule Alertopolis_Demo_Family`, `author = "Alertopolis"`, `version = "1.0"`,
  `date = "2026-10-19"`, `scope = "synthetic ALRTDEMO fixtures, not real malware"`; cadenas `$header = "ALRTDEMO" ascii`,
  `$family = "cicada-demo-v1" ascii wide nocase`, `$route = "route=/collect-demo" ascii wide` y `$hex = { 41 4C 52 54 ?? 7F }`. El cuerpo de la
  condición **no** se enseña en esa escena («// la combinación se decide aquí», `:25`; a propósito, `:10-11`). El autor es «Alertopolis», no
  «Meridian CTI» (§3, «Equipos»), y la fecha es la del material, no una fecha del caso (ver §5). Las otras dos reglas del archivo,
  `Alertopolis_Demo_Sample` y `Alertopolis_Demo_Hunt` (`public/labs/yara-practice/reference.yar:20-40`), no salen: quedan para AP06.
- **Las tres partes** (s02): «meta · documenta: autoría, versión, alcance», «strings · define: patrones con identificador», «condition · decide:
  combina patrones y límites» (`video/yara-condicion/src/scenes/S02Partes.tsx:62,69,76`); avisos «nombre de familia en meta ≠ detección»,
  «elegirlos exige evidencia», «la combinación es la promesa» y «si prometes variantes, compruébalas» (`:65,72,79,82`). «La promesa de la regla»
  es la expresión que recorre el vídeo (`video/yara-condicion/narration.json:80`).
- **La regla ingenua es solo del vídeo** (s03; `video/yara-condicion/src/scenes/S03Comunes.tsx:31-35`, panel «regla ingenua», `:65`):
  `$a = "Mozilla/5.0"`, `$b = "kernel32.dll"`, `2 of them`, que «coincide con el control» (`:70`) `benign-common`, cuyas dos cadenas son
  «corrientes en software legítimo» (`:45-55`). No es una regla de Meridian ni del paquete. Debajo, «¿qué aporta cada patrón?», «¿qué control
  podría contenerlo?» (`:77-78`); «Una muestra · puede usar un rasgo muy específico» frente a «Variantes · justifica qué se conserva y qué
  cambia» (`:84,87`); «el objetivo y la evidencia mandan» y «ningún umbral hace fiable una cadena débil» (`:92-93`).
- **A y B, byte a byte** (s04): A es `cicada-demo-v1` en un byte por carácter (`63 69 63 61 64 61 2D 64 65 6D 6F 2D 76 31`) y B es
  la misma cadena en mayúsculas (`43 49 43 41 44 41 2D 44 45 4D 4F 2D 56 31`) con un `00` detrás de cada byte
  (`video/yara-condicion/src/scenes/S04Wide.tsx:12-14`; el texto `CICADA-DEMO-V1` no se rotula, solo está en el comentario de `:12`); «A · texto sencillo», «B · mayúsculas ·
  bytes nulos intercalados», «dentro del objetivo» (`:54,57,60`). Pausa de decisión: «¿B queda fuera o debes cubrir otra forma?»
  (`video/yara-condicion/narration.json:141`), con las opciones «Ignorar su representación» / «Contemplar la variación prevista» y la segunda
  como respuesta (`S04Wide.tsx:64`). Luego la línea `$family = "cicada-demo-v1" ascii wide nocase` (`:38`) con «ascii → A», «wide → B, con su
  byte nulo», «nocase → ignora mayúsculas» (`:72,75,78`) y los avisos «cada ampliación puede incluir más coincidencias» y «wide no es Unicode
  general: cubre una representación concreta» (`:83,86`).
- **El byte que cambia** (s05; `video/yara-condicion/src/scenes/S05Hex.tsx:9-11`): A `41 4C 52 54 22 7F`, C `41 4C 52 54 99 7F`, patrón `$hex`
  `41 4C 52 54 ?? 7F`; «cambia una sola posición», «?? = cualquier valor de ese byte», «el resto permanece fijo», «nota: A? y ?A son comodines de
  medio byte» (`:36,46,49,52`); «más comodines no es mejor: es permitir más contenido» (`:56`). Las mismas tres filas son el póster
  (`video/yara-condicion/src/Poster.tsx:11-13`), con «Práctica complementaria», «~9 min» y «Datos ficticios · corpus inerte» (`:55-58`).
- **La tabla y la condición** (s06; `video/yara-condicion/src/scenes/S06Condicion.tsx:12,18-23`): columnas `$family`, `$route`, `$hex`; A las
  tiene las tres; B, `$family` y `$route`, sin `$hex`; C, `$family` y `$hex`, con la ruta distinta; el control `benign-hex`, solo `$hex`.
  «marcador en las tres · misma ruta en A y B», «C cambia la ruta pero conserva los bytes» (`:88,91`). La condición se construye pieza a pieza
  hasta `$family and ($route or $hex)` (`:66-72`), con «una parte necesaria», «dos alternativas» y «los paréntesis agrupan las alternativas»
  (`:97-98,105`). La «otra agrupación», `($family and $route) or $hex`, lleva «los bytes solos bastan» y «benign-hex coincidiría: un control
  aceptado» (`:111-116,120`). Hipótesis: «Un marcador junto a una evidencia alternativa · la hipótesis, dicha antes del código» (`:125`); «todas
  a la vez: pierdes C», «cualquiera de ellas: aceptas controles» (`:129-130`). Nada se ejecuta: la tabla dice qué **contiene** cada archivo.
- **El manual y los dos requisitos** (s07; `video/yara-condicion/src/scenes/S07Manual.tsx:66-70,82-85`): `benign-manual` empieza por «Manual de
  laboratorio» y después lleva `ALRTDEMO`, `cicada-demo-v1`, `route=/collect-demo` y `41 4C 52 54 22 7F`; A empieza por `ALRTDEMO` en el «offset
  0» (`:52`); «todo copiado, pero no en el offset 0» (`:90`). Requisitos: `$header at 0` y `filesize < 4KB`, «ninguno demuestra malicia»
  (`:96-99`); «una restricción útil aquí puede excluir algo relevante en otro objetivo» (`:104`); «formato inventado: no es PE ni ejecutable»,
  «MZ por sí solo no valida PE» y «pe.is_pe · fuente: documentación de YARA, módulo pe» (`:109,111,116`). En voz, «forman parte del contrato del
  ejercicio» (`video/yara-condicion/narration.json:266`).
- **El límite de tamaño** (s08; `video/yara-condicion/src/scenes/S08Limite.tsx:37-51`): eje con «dentro del límite · menor que 4KB», «fuera del
  límite» y la raya en «4096 bytes»; «Archivo A · pequeño» dentro (`:55`), `boundary-4096` sobre la raya (`:60`) y `large` fuera (`:65`). Pausa:
  «¿Qué pasa con cuatro mil noventa y seis bytes?» (`video/yara-condicion/narration.json:299`), opciones «Cumple el límite estricto» / «Queda
  fuera del límite», respuesta la segunda (`S08Limite.tsx:78`); ««menor» es estricto: forma parte de la regla», «esperado por el alcance
  declarado» (`:70,73`). Tres tarjetas: «Límite declarado · esperado en este corpus», «Falso negativo · si el objetivo se amplía» y
  «future-uncovered · marcador v2: sin cobertura» (`:83,86,89`); la cadena `cicada-demo-v2` del paquete (`public/labs/yara-practice/fixtures.py:27`)
  no sale. Cierre: «otra promesa, otra comprobación», «la regla solo evalúa lo escrito», «antes de ampliar: evidencia, objetivo y pruebas»
  (`:93,96,99`).
- **Escribir no es ejecutar** (s09; `video/yara-condicion/src/scenes/S09Escribir.tsx:29,39`): «Editor de la lección» con `rule MiRegla { // tu
  hipótesis }` (el mismo nombre que el «Editor YARA · MiRegla» de s01, `video/yara-condicion/src/scenes/S01Hook.tsx:34-41,56`), «no compila ni
  ejecuta» (`:42`) y el fichero `MiRegla.yar` «texto descargado» (`:45`; ver §5). «YARA Forge · simulación por etiquetas» (`:49`), «Paquete de la
  práctica · datos inertes · instrucciones · verificador» (`:52`), «un motor real comprueba sintaxis y coincidencias» (`:55`). Tres etapas: «1 ·
  Escribir · editor de la lección», «2 · Compilar · comprueba la sintaxis», «3 · Ejecutar · aplica la regla a los archivos», esta con «aún por
  hacer» (`:60,64,68,71`). **El vídeo no enseña ningún resultado de ejecución, ni versión de motor, ni comando** (a propósito, `:13-16`): eso es
  de AP06. «validar = resultados por archivo + explicación de los errores» (`:81`).
- **Las tarjetas** son cinco «de aprendizaje», sin insignia de examen ni dominio (`"exam": []`, `video/yara-condicion/src/timeline.json:4216`;
  ficha `:27`): «Meta documenta; strings define; condition decide» (`video/yara-condicion/src/scenes/S02Partes.tsx:85`), «ASCII, wide y nocase
  amplían formas concretas» (`video/yara-condicion/src/scenes/S04Wide.tsx:89`), «Exige el marcador y una alternativa justificada»
  (`video/yara-condicion/src/scenes/S06Condicion.tsx:134`), «Un límite también puede excluir variantes deseadas»
  (`video/yara-condicion/src/scenes/S08Limite.tsx:102`) y «Escribir, compilar y ejecutar son comprobaciones distintas»
  (`video/yara-condicion/src/scenes/S09Escribir.tsx:84`).
- **Cierre y tarea** (s10; `video/yara-condicion/src/scenes/S10Cierre.tsx:37-39`): tres reglas, «Alcance antes del código · qué entra en el
  objetivo», «Combina con razones · patrones y combinación justificados», «Mide los límites · cada restricción es cobertura». La condición del
  caso en palabras: «un marcador» + «una evidencia alternativa» «dentro de» «formato ALRTDEMO» y «< 4KB» (`:46-51`); «necesarias: el marcador»,
  «pueden variar: ruta o bytes» (`:56-57`). Tarea, bajo «PRÁCTICA COMPLEMENTARIA»: «Escribe MiRegla en el editor de la lección, antes de abrir
  la solución» (`:65-66`; en voz, «Descárgala para conservarla», `video/yara-condicion/narration.json:396`). Remate: «la condición expresa una
  razón, no una cifra elegida por costumbre» (`:71`). Créditos: «Alertópolis · material independiente, no afiliado a SANS/GIAC · práctica
  complementaria · datos ficticios» (`:75`).
- **No hay analogía ni imagen que quede ocupada.** La ficha habla de «una descripción con rasgos necesarios y alternativas» (ficha `:21`), pero
  en pantalla solo hay editor, filas de bytes, tabla y eje de tamaño. No usa el aeropuerto de V27 ni «la etiqueta del taller» de V13 a V15.
- **La voz no dice** ALRTDEMO, `Alertopolis_Demo_Family`, `MiRegla`, «cicada», ningún identificador (`$family`, `$route`, `$hex`, `$header`),
  los nombres de los controles, «offset», «PE», «MZ», «falso positivo» ni HOLLOW LANTERN, GLASS VIPER o VELVET CICADA. Dice «el marcador», «la
  ruta de demostración», «la secuencia de bytes», «la cabecera», «el manual del ejercicio», «un control», «falsos negativos»
  (`video/yara-condicion/narration.json:208,214,232,250,260,312`); los únicos nombres propios son YARA (`:26`), Meridian (`:32`) y YARA Forge (`:342`), más el término «Unicode» (`:166`), y las
  palabras de YARA `meta`, `strings`, `condition`, `ascii`, `wide`, `nocase` (`:56,68,80,148,154,160`). Ninguna fecha, hora, hash ni equipo.
- **HOLLOW LANTERN**, dos mensajes nuevos, sin fecha (consejos que tutean y empujan un atajo de método, como en V15; no confiesa nada, no dice
  quién es ni habla de infraestructura); ver la tabla de §3:
  - «Pon dos cadenas. Dos siempre es mejor que una.» (`video/yara-condicion/narration.json:95`, s03-01); respuesta: «Dos cadenas corrientes pueden
    aparecer juntas en mucho software legítimo. La cantidad no sustituye la elección.» (`:92`).
  - «Si contiene todas tus cadenas, ya está demostrado.» (`video/yara-condicion/narration.json:253`, s07-01); respuesta: «El manual del ejercicio
    copia todas las cadenas y sigue fuera del objetivo. Necesitamos mirar también dónde están y qué estamos describiendo.» (`:250`).
- **No se toca** (sigue fuera): la regla `GLASSVIPER_Loader_MemMap` de s5m3 y sus cadenas `$pdb`, `$pipe`, `$api`, `$op` (§3, «Capacidades»; V27);
  la ruta `D:\proj\cicada\loader\Release\ldr.pdb`, el pipe `vc_pipe_%08x`, los imports y cualquier hash (`9f3a...e1`, `4c81...b3`; §5 puntos 1 y
  11); «Meridian CTI» como autor; la solución y las muestras del Lab 3B (`vc_stage2.bin`, la cadena hexadecimal, `VC_Loader_v1.dll`,
  `VC_Loader_v2.dll`, `VendorUpdater.exe`, `ChatHelper.exe`; §4), que la ficha deja expresamente «en el texto del curso» (ficha `:107`); STIX,
  TAXII, el indicador del ISAC y el «hoy» de V8, que es la otra mitad de la misma lección; el pipe que dispara o no solo (§5 punto 26); y las
  reglas `Sample` y `Hunt`, los doce resultados, la versión del motor y la ficha de entrega, que son de AP06. No se atribuye nada a nadie:
  coincidir «no decide por sí sola si algo es malicioso» (`video/yara-condicion/narration.json:38`).

### AP06 · `yara-prueba-entrega` · s3m5 · YouTube `2KXShpLy67s`

Lección `src/data/practical/analysis-yara.ts:52-58` (bloque `video` «Tu YARA compila: ahora demuestra qué detecta», dentro de la ampliación
«Escritura y validación de YARA» de s3m5, `:4-8`, que `withPracticalExpansion` añade a la lección, `src/data/tracks.ts:112`; va después de
los dos checks de práctica, `:43-50`, y del párrafo «Cuando tu regla ya compila…», `:51`, y antes de los enlaces «Práctica guiada y entrega
técnica», `:59-64`; llegó a `main` con el commit `c566b4c9`, «embed the two YARA practice videos in s3m5»; prueba en
`src/data/content.test.ts:286`). Es **práctica complementaria**, no lección base. Duración: 532 s (8:52) según el registro de vídeos producidos
(`src/data/security/produced-videos.json:2488`); el `timeline.json` que está en `main` es todavía el de la estimación, no el de la grabación
(`"mode": "estimate"`, `"voice": "none"`, 16103 fotogramas a 30 fps = 8:57, `video/yara-prueba-entrega/src/timeline.json:2,4,7,8`). Principal
(`principal-yt`, `video/yara-prueba-entrega/video.json:6`), guion congelado el 2026-10-19 (`:19`). Adversario de los interceptados VELVET
CICADA (`video/yara-prueba-entrega/video.json:8`), con `sapi/Microsoft Pablo`, `rate` 0 y `machine` (`video/yara-prueba-entrega/narration.json:9-13`):
la misma voz que en V27. Narradora `recording/lidia` (`:2`). Ficha y guion en `docs/superpowers/plans/2026-10-19-videos-ampliaciones/AP06-yara-prueba-entrega/`.
Continúa a AP05 `yara-condicion` (misma lección, bloque en `src/data/practical/analysis-yara.ts:28-34`), que escribe la regla; este la ejecuta
y la entrega. **Sin fecha ni hora del caso**: es un ejercicio con archivos inventados, no un episodio de la intrusión, y no se ordena contra §2
(«ejercicio didáctico sin fecha de incidente», `docs/superpowers/plans/2026-10-19-videos-ampliaciones/AP06-yara-prueba-entrega/ficha-produccion.md:25`).
La única fecha en pantalla es la «fecha editorial» de la regla de ejemplo (abajo). **Casi nada de este vídeo es un hecho de Meridian**: todo
sale del paquete de práctica del curso (`public/labs/yara-practice/`). Sin tarjetas de examen. Canon nuevo, solo de pantalla y de voz:

- **El marco: Meridian como escenario de un ejercicio, no del caso.** En pantalla, «Meridian · laboratorio didáctico» y «ALRTDEMO · archivos
  inertes» (`video/yara-prueba-entrega/src/scenes/S01Hook.tsx:95`, `:98`); en voz, «Estamos en el laboratorio didáctico de Meridian, una
  empresa aeroespacial. Los archivos son inertes.» (`video/yara-prueba-entrega/narration.json:32`). El sello fijo de toda la serie dice
  «Práctica complementaria · datos ficticios» (`video/engine/src/practica/kit.tsx:8`). Título en pantalla: «Tu YARA compila: ahora demuestra
  qué detecta» (`S01Hook.tsx:59`). El vídeo no dice quién montó ese laboratorio, cuándo, ni que la regla tenga que ver con el loader de la
  campaña; no sale ningún equipo, cuenta, hora, dominio ni hash. «No necesitas malware real ni una cuenta de pago» (`narration.json:50`; en
  pantalla, tachados, «malware real» y «cuenta de pago», `S01Hook.tsx:109-110`). Relleno didáctico: no añade nada a §2 ni a §3.
- **El paquete de práctica: doce casos, tal como son en el curso** (`video/yara-prueba-entrega/src/scenes/parts/data.ts:12-25`, que copia
  `public/labs/yara-practice/fixtures.py:17-28`; coinciden nombre a nombre, partición a partición y regla a regla): `a.dat` (training; Sample,
  Family, Hunt), `b-wide.dat` (training; Family, Hunt), `c-heldout.dat` (held-out; Family, Hunt), `benign-route.dat` (training; Hunt),
  `benign-marker.dat` (training; Hunt), `benign-hex.dat` (held-out; Hunt), `benign-manual.dat` (training; nada), `benign-common.dat`
  (training; nada), `empty.dat` (held-out; nada), `large.dat` (held-out; nada), `future-uncovered.dat` (challenge; nada) y `boundary-4096.dat`
  (held-out; nada). En s01 se resumen como «3 variantes en el alcance» A, B, C, «controles parecidos» ruta, marcador, bytes, y «casos que
  revelan límites» tamaño, v2 (`S01Hook.tsx:120-126`); en s04, «training · 6», «held-out · 5», «challenge · 1» con «los nombres no
  garantizan independencia» (`video/yara-prueba-entrega/src/scenes/S04Regresion.tsx:111-119`, `:125`; lo mismo en
  `public/labs/yara-practice/README.txt:39`). «corpus · 12 archivos de prueba» (`video/yara-prueba-entrega/src/scenes/S02Motor.tsx:90`) y
  «12 casos · hash del corpus · alcance ALRTDEMO v1», con el hash como barra sin valor (`video/yara-prueba-entrega/src/scenes/S05Reglas.tsx:116-122`).
  **Ningún hash con valor en todo el vídeo.** Son archivos del ejercicio, no muestras de Meridian.
- **La consola: `verify.py` con YARA 4.5.4, «captura real · extracto»** (`S02Motor.tsx:62-71`, `:97-98`). Tres ejecuciones: (1)
  `python verify.py` → «YARA 4.5.4: 12/12 casos conformes al alcance declarado»; (2) `python verify.py --rule mi-regla.yar --name MiRegla`
  con un error de sintaxis → «ERROR de compilacion/ejecucion:» y «mi-regla.yar(1): syntax error, unexpected <and>»; (3) la misma orden «sin
  anclar la cabecera» → «FAIL benign-manual.dat [training]: ['MiRegla'] | …» y «YARA 4.5.4: 11/12 casos conformes al alcance declarado». El
  formato de las líneas es el de `public/labs/yara-practice/verify.py:25-26`, `:30`, y la versión, la de `public/labs/yara-practice/requirements.txt:1`.
  Las líneas grises que empiezan por `#` («# mi-regla.yar con un error de sintaxis», «# mi-regla.yar sin anclar la cabecera», `S02Motor.tsx:64`,
  `:68`) son rótulos del vídeo, no salida del programa. Tres tarjetas de código de salida: «exit 2 · Error de compilación · la regla no llegó
  a evaluarse», «exit 1 · Discrepancia · se evaluó; no coincide lo esperado», «exit 0 · Conformidad · coincide con lo esperado»
  (`S02Motor.tsx:135-141`; `verify.py:28`, `:31`). «Qué registras»: «Motor · YARA 4.5.4 · el de esta captura», «Regla · versión de
  mi-regla.yar», «Corpus · los 12 archivos de prueba» (`S02Motor.tsx:116-118`). El fichero del alumno se llama `mi-regla.yar` y la regla,
  `MiRegla` (`S01Hook.tsx:79`; `S02Motor.tsx:82`, `:65`), como en la app (`src/components/YaraPractice.tsx:28`, `:55`). La voz no dice ni la versión
  ni ningún nombre de fichero: «El verificador local la compila con YARA real» y «Ese conjunto se llama corpus» (`narration.json:62`).
- **La regla ingenua de s03 es solo del vídeo** (`video/yara-prueba-entrega/src/scenes/S03Errores.tsx:18-26`, `:125`): «regla ingenua: basta
  con cualquier cadena», pasada por siete filas (A, B, C, «control: ruta sola», «control: marcador solo», «control: bytes sueltos», «manual
  con las cadenas»); las siete salen «sí», las tres primeras TP y las cuatro últimas FP, con «4 coincidencias de más, 0 variantes nuevas»
  (`:143`) y «exit 1 · falla si hay discrepancias» (`:147-148`). No es ninguna de las tres reglas del paquete (la `Hunt` de verdad no acepta
  el manual, `data.ts:19`) ni una ejecución capturada: es ejemplo. Cuadro fijo TP / FN / FP / TN con «la regla coincide / no coincide» y
  «debía entrar / no debía entrar» (`S03Errores.tsx:130-139`). En voz solo se nombran tres controles: «una ruta sola, un marcador solo o unos
  bytes coincidentes» (`narration.json:108`).
- **C y la prueba de regresión** (s04): «C», «ruta: cambia», «marcador: igual», «hex: igual», «ya lo usamos al diseñar»
  (`S04Regresion.tsx:58-70`); en voz, «C cambia la ruta pero conserva otros rasgos del objetivo. Ya lo usamos al escribir la condición.»
  (`narration.json:132`), que es el puente con AP05 (`video/yara-condicion/narration.json:214`, `:238`). Dos tarjetas: «Exigir todo ·
  `marcador and ruta` · C no coincide» y «Referencia · `marcador and (ruta or hex)` · C coincide» (`S04Regresion.tsx:80`, `:83`); la
  segunda es la regla de referencia dicha en corto, sin la cabecera ni el tamaño (`public/labs/yara-practice/reference.yar:16-17`). Pregunta
  con pausa: «¿Exigir todo mejora siempre la cobertura?» (`narration.json:141`), opciones «Sí, más condiciones siempre ayuda» / «No, puede
  perder una variante», y gana la segunda (`S04Regresion.tsx:75`). Rótulos: «prueba de regresión · ejemplo conocido», «no demuestra variantes
  nuevas», «sobreajuste: memorizar ejemplos», «generalización: casos nuevos», «públicos y sintéticos: enseñan el método», «no prueban
  cobertura de malware real» (`:88-104`).
- **Tres reglas, tres trabajos** (s05; `S05Reglas.tsx:19-25`, `:46`): filas `Sample` («objetivo: A»; «útil para A; pierde B y C»), `Family`
  («objetivo: A, B y C»; «dentro del contrato sintético; no es una familia real») y `Hunt` («objetivo: candidatos»; «controles que necesitan
  revisión»), contra seis columnas A, B, C, ruta, marcador, hex, bajo «variantes del ejercicio» y «controles» (`:60-61`). Los aciertos salen de
  `data.ts:13-18`: Sample solo A; Family A, B, C; Hunt los seis. En pantalla los nombres van cortos; el nombre entero solo sale una vez,
  `Alertopolis_Demo_Family`, en la ficha de s09. Debajo, «un nombre bonito» tachado frente a «objetivo», «requisitos», «resultados», y luego
  «investigar candidatos» frente a «bloquear automáticamente» y «la acción prevista va en la entrega» (`:99-109`). En voz, «La regla de familia
  del ejercicio cubre A, B y C dentro del contrato sintético. No acredita cobertura de una familia real.» (`narration.json:184`).
- **Doce de doce, con denominador** (s06): arriba, la línea «YARA 4.5.4: 12/12 casos conformes al alcance declarado» con «captura real ·
  extracto» (`video/yara-prueba-entrega/src/scenes/S06Doce.tsx:90-92`); doce fichas con el nombre del fichero y lo que coincide («Sample ·
  Family · Hunt», «Family · Hunt», «Hunt» o «sin coincidencia», `:103`), todas con la marca de conforme. Notas que entran después: en
  `large.dat`, «fuera de 4096 bytes»; en `future-uncovered.dat`, «marcador v2 · ruta nueva» y luego «FN conocido si incluye v2»; en
  `boundary-4096.dat`, «4096 queda fuera» (`:76-83`). «12/12 no son doce infecciones detectadas», «ni sensibilidad perfecta frente a una
  familia real» (`:110`, `:113`); «Contrato v1 · 12 de 12 conformes: afirmación correcta» frente a «Objetivo ampliado v2 · 1 falso negativo
  conocido y límite de tamaño» (`:118`, `:121`); «promesa de producción» tachado y «resultado + alcance = conclusión» (`:124`, `:127`). El
  marcador nuevo no se enseña como texto: la cadena `cicada-demo-v2` del paquete (`public/labs/yara-practice/fixtures.py:27`) no sale.
- **El paquete de entrega** (s07; `video/yara-prueba-entrega/src/scenes/S07Paquete.tsx:40-48`): nueve piezas, «Regla · versión · hash»,
  «Objetivo y origen de patrones», «Motor y versión», «Corpus y hash», «Matriz de resultados», «Alcance, FP y FN conocidos», «Acción y
  revisión humana», «Destinatarios y uso permitido», «Derechos y material de terceros». Y «captura de YARA Forge: simulación por etiquetas»
  con «no sustituye compilar y ejecutar» (`:67`, `:70`); «datos sintéticos: sin secretos» y «siguen los derechos y la protección de
  evidencias» (`:74`, `:77`). YARA Forge es el Lab 3B (`src/data/labs.ts:121-123`): el vídeo solo lo nombra, no enseña nada de él.
- **«Propuesta del SOC (ficticia)»** (s08; `video/yara-prueba-entrega/src/scenes/S08Bloquear.tsx:43`): «bloquear en toda la flota», con la
  etiqueta «12/12» (`:46`). En voz no hay SOC, solo «El receptor ve los doce resultados conformes y propone bloquear toda la flota»
  (`narration.json:284`). Pregunta con pausa: «¿Estos resultados justifican bloquear la flota?» (`:293`), opciones «Sí, pasó todo el paquete»
  / «No, falta validar ese uso real», y gana la segunda (`S08Bloquear.tsx:50`). «Lo que probaste: 12 archivos sintéticos preparados · la
  mecánica y sus resultados» frente a «Lo que propones: archivos y acción de producción · bloquear en toda la flota» (`:55`, `:58`);
  «controles representativos», «cobertura adecuada», «respuesta autorizada», «investigar un candidato: coste bajo», «bloquear la flota:
  coste alto» (`:72-83`); «rechazar la regla» tachado, «delimitar la evidencia», «práctica o punto de partida», «no es prueba suficiente de
  eficacia en toda la organización» (`:89-98`). Es el «caso resuelto» de la ampliación de s5m3 (`src/data/practical/analysis-yara.ts:147`)
  llevado a pantalla y rotulado como ficticio: **no es algo que el SOC de Meridian haya pedido en la campaña**, y nadie bloquea nada.
- **La ficha de entrega** (s09; `video/yara-prueba-entrega/src/scenes/S09Ficha.tsx:51-60`), diez filas: «Regla · Alertopolis_Demo_Family»,
  «Versión · 1.0 · fecha editorial 2026-10-19», «Alcance · ALRTDEMO v1 · datos sintéticos», «Motor · YARA 4.5.4», «Corpus · 12 casos · hash»
  (barra sin valor), «Resultado · 12/12 conformes al alcance», «Límites · variante v2 sin cobertura · tope 4096 bytes», «Acción · práctica o
  punto de partida», «Responsable · dueño didáctico del ejercicio», «Revisión · ante nuevos fixtures o errores». Nombre, versión y fecha son
  los del `meta` de la regla de referencia (`public/labs/yara-practice/reference.yar:2`, `:5-6`). **El 2026-10-19 es la fecha editorial del
  ejercicio (y la de congelado del guion), no una fecha del caso**: no va a §2. No hay fecha de despliegue (`S09Ficha.tsx:39`). A la derecha,
  «puede dejar de cubrir lo que interesa», «coincidir con contenido legítimo», «cómo comunicar errores», «cuándo revisarla», «cambias un
  patrón», «conservas la versión anterior», «repites las pruebas», «cambias el corpus: registra qué y por qué» (`:80-103`); «el hash
  identifica los archivos exactos», «no prueba que sean representativos» (`:108`, `:111`); «evaluar», «repetir», «mantener» y «la ficha
  basta: sin tu conversación» (`:115-121`).
- **Cinco tarjetas de aprendizaje, sin insignia de examen**: «Compilar valida sintaxis; ejecutar contrasta coincidencias»
  (`S02Motor.tsx:144`), «Una regla más restrictiva puede perder variantes» (`S04Regresion.tsx:127`), «Doce resultados esperados no son
  cobertura universal» (`S06Doce.tsx:129`), «La validación tiene que corresponder al uso previsto» (`S08Bloquear.tsx:100`) y «Versión,
  resultados, acción y responsable viajan juntos» (`S09Ficha.tsx:123`). No hay tarjetas de examen ni dominio GCTI en ninguna escena
  (`video/yara-prueba-entrega/src/scenes/S10Cierre.tsx:16-17`; `ficha-produccion.md:27`).
- **Cierre y tarea** (s10; `S10Cierre.tsx:37-39`): tres reglas, «Compilar no es validar · sintaxis, no eficacia», «Mide positivos y negativos
  · sin esconder errores», «Entrega alcance y reproducción · motor, corpus y acción»; «no una cifra grande: una afirmación que otra persona
  puede comprobar» y «si sabes dónde falla, dilo» (`:44`, `:47`). Tarea, bajo «PRÁCTICA COMPLEMENTARIA»: «Ejecuta el verificador sobre
  MiRegla y completa una ficha de entrega», con `python verify.py --rule mi-regla.yar --name MiRegla` (`:54-55`, `:60`), y «el modelo:
  lección de diseminación» (`:63`; en voz, «En la lección de diseminación tienes el modelo», `narration.json:390`): es la «Nota de entrega»
  de la ampliación de s5m3 (`src/data/practical/analysis-yara.ts:146`). Créditos: «Fuentes: YARA (motor Python) · curso: verify.py,
  fixtures.py y reference.yar · lección s5m3» y «Alertópolis · material independiente, no afiliado a SANS/GIAC · práctica complementaria con
  datos ficticios» (`S10Cierre.tsx:68-69`).
- **El póster** (`video/yara-prueba-entrega/src/Poster.tsx:54-56`, `:64-73`): «Tu YARA compila», «¿qué detecta?», «compilar no es validar»,
  doce casillas con «debe coincidir», «debe quedar fuera», «límite conocido», y «Práctica complementaria», «~9 min», «Datos ficticios».
- **La voz no dice** YARA 4.5.4, `verify.py`, `mi-regla.yar`, `MiRegla`, ningún nombre de fichero del corpus (solo «A», «B» y «C»),
  `Alertopolis_Demo_Family`, «exit», TP ni TN, el SOC, HOLLOW LANTERN, GLASS VIPER ni VELVET CICADA; tampoco ninguna fecha, hora, equipo ni
  hash (`narration.json:22-393`). Sí dice «Meridian» una vez (`:32`), «YARA Forge» (`:266`), «hunting» (`:190`) y «la flota» (`:284`).
  VELVET CICADA solo firma sus dos mensajes en pantalla; la transcripción publicada los marca «[Mensaje interceptado · VELVET CICADA]»
  (`public/videos/yara-prueba-entrega-transcript.txt:11`, `:23`).
- **VELVET CICADA**, dos mensajes, sin fecha; empuja atajos de método y no confiesa nada, como en V27, pero aquí no dice «analista», no habla
  de «mi programa» ni de «mis herramientas» y no tiene ironía marcada: el primero es una frase impersonal y el segundo, dos imperativos de
  tú. Ver la tabla de §3:
  - «Cuantas más coincidencias salgan, mejor es la regla.» (`video/yara-prueba-entrega/narration.json:95`, s03-01); respuesta: «Más
    coincidencias pueden significar más errores. Si un archivo queda fuera de tu objetivo y la regla lo acepta, tienes un falso positivo.»
    (`:92`).
  - «Manda la regla y escribe cien por cien. Queda mejor.» (`video/yara-prueba-entrega/narration.json:247`, s07-01); respuesta: «Queda mejor
    hasta que otra persona necesita entender qué probaste. Entrega la regla versionada, el objetivo y la procedencia de sus patrones.»
    (`:244`).
- **No se toca** (sigue fuera): ningún dato de la intrusión. Ni la regla `GLASSVIPER_Loader_MemMap` ni la Sigma de s5m3; ni el PDB, el pipe,
  `MapViewOfSection` ni `$op`; ningún hash (`4c81...b3`, `9f3a...e1`); `winhlp.exe`, `updsvc.exe`, `wcssvc.exe`; ENG-WS-041; el C2, el
  certificado y `kazuo.tanji@`; MER-2026-011 y la fecha 2026-04-18; el contenido del Lab 3B (sus cadenas y sus muestras, §4) y los dosieres.
  Tampoco usa la imagen del aeropuerto de V27. Las cadenas del paquete (`cicada-demo-v1`, `route=/collect-demo`, `41 4C 52 54 ?? 7F`,
  `public/labs/yara-practice/reference.yar:10-12`) **no salen en este vídeo** (sí en AP05), y `build=fixture-A` (`:24`) no sale en ninguno de los
  dos: aquí solo «marcador»,
  «ruta», «hex» y «bytes». No se culpa a nadie: ni al receptor que quiere bloquear ni a quien escribe la regla ingenua.

### AP07 · `stealers-metricas` · s4m4 · YouTube `DBcK-Y0WItM`

Lección `src/data/practical/analysis-yara.ts:106` (bloque `video` «Medir infostealers y decidir relevancia», dentro de la ampliación «Ecosistema y
métricas de infostealers», `:85-131`, que `withPracticalExpansion` añade al final de s4m4, `src/data/tracks.ts:112`; va después de la tabla del dataset,
`:100-104`, y del párrafo «Antes de resolverlo, míralo contado…», `:105`, y antes de «Paso 1: elegir la unidad», `:107`; lo fija
`src/data/content.test.ts:358`). El `timeline.json` del repositorio es una **estimación sin voz** (`"mode": "estimate"`, `"voice": "none"`,
`video/stealers-metricas/src/timeline.json:2,8`): 16043 fotogramas a 30 fps (`:4,7`), 8:55; el vídeo publicado dura 553 s, 9:13, según el inventario
(`src/data/security/produced-videos.json:2155`). Principal (`principal-yt`, `video/stealers-metricas/video.json:6`), guion congelado el 2026-10-19
(`:19`). Adversario de los interceptados PAPER CRANE (`video/stealers-metricas/video.json:8`), aquí con `sapi/Microsoft Pablo`, `rate` 0 y el efecto
`machine` (`video/stealers-metricas/narration.json:9-13`), **no con la `sapi/Microsoft Laura` de V9 y V23** (ver §5). Es «práctica complementaria»:
todas las escenas llevan el sello «Práctica complementaria · datos ficticios» (`video/engine/src/practica/kit.tsx:8`), no hay tarjetas ni preguntas
de examen (`"exam": []`, `video/stealers-metricas/src/timeline.json:4230`) y no existe `out/script-notes.md` en el repositorio; su ficha es
`docs/superpowers/plans/2026-10-19-videos-ampliaciones/AP07-stealers-metricas/ficha-produccion.md`. **Sin fecha ni hora del caso**: es un «ejercicio
didáctico sin fecha de incidente» (ficha `:25`) y no se ordena contra §2. La única fecha que enseña es la ventana del dataset inventado, septiembre de
2026, que **no es un hecho de la campaña** (ver abajo y §5). **No añade ningún hecho al caso de Meridian**: ni equipos, ni cuentas, ni indicadores, ni
incidente, ni resultado. Canon nuevo, solo de pantalla y de voz:

- **El marco: un ejercicio, no el caso** (s01). En pantalla, «Meridian» · «empresa aeroespacial · ejercicio»
  (`video/stealers-metricas/src/scenes/S01Hook.tsx:66`), «Dataset ficticio» · «septiembre de 2026 · UTC» (`:55`), «Proveedor Demo-P» · «dos regiones ·
  sin cobertura global» (`:58`), «Infostealer» · «malware que roba información del dispositivo» (`:63`), «Familias inventadas» con Bruma, Cobalto y
  Duna (`:71-80`), «sus datos de septiembre no son un ranking real» (`:83`) y la franja fija «Demo-P · dos regiones · septiembre de 2026 · UTC · datos
  ficticios» (`:104`). En voz: «Estamos en un ejercicio de Meridian, una empresa aeroespacial.» y «Las familias Bruma, Cobalto y Duna son inventadas.
  Sus datos de septiembre tampoco son un ranking real.» (`video/stealers-metricas/narration.json:30`, `:36`). La voz dice «Meridian», nunca «Meridian
  Dynamics», y no hay analista, CISO, SOC ni ninguna persona. Titular en pantalla, «Una tabla, tres ganadores distintos» (`S01Hook.tsx:50`); el
  título de la escena en la línea de tiempo es «Tres ganadores en una tabla» (`video/stealers-metricas/src/timeline.json:10`).
- **Demo-P, las tres familias y la ventana son relleno didáctico de la lección** (`src/data/practical/analysis-yara.ts:99`: «Ventana inventada: 1–30 de
  septiembre de 2026, UTC. Proveedor Demo-P ve endpoints de dos regiones y anuncios seleccionados; no tiene cobertura global. Las familias Bruma,
  Cobalto y Duna son ficticias.»). No son un proveedor de Meridian, ni malware de VELVET CICADA, ni de PAPER CRANE (la ficha lo pide expresamente: «No
  atribuir a PAPERCRANE las familias ficticias por firmar mensajes», ficha `:53`), ni tienen que ver con el loader GLASS VIPER. Las dos regiones no
  tienen nombre y el «sector objetivo» tampoco (la columna dice «Sector objetivo», `video/stealers-metricas/src/scenes/S04Caso.tsx:35`; en voz, «su
  sector»). En voz, Demo-P es siempre «el proveedor de ejemplo» o «un proveedor» (`narration.json:170`, `:206`): el nombre solo se lee en pantalla.
- **La tabla, cifra a cifra** (`video/stealers-metricas/src/scenes/parts/data.ts:22-26`; el comentario de `:3-6` dice que todo número de pantalla sale
  de ahí). Es la de la lección, cifra a cifra, con la capacidad abreviada (`src/data/practical/analysis-yara.ts:100-104` y, para la última semana y la capacidad, `:108-112`):

  | Familia (ficticia) | Muestras | Episodios | Dispositivos | Registros | Organizaciones | Del sector | Última semana | Capacidad descrita |
  |---|---|---|---|---|---|---|---|---|
  | Bruma (`data.ts:23`) | 1.200 | 130 | 100 | 8.000 | 40 | 4 | 10 | «Robo de contraseñas» |
  | Cobalto (`data.ts:24`) | 300 | 540 | 450 | 3.000 | 60 | 90 | 180 | «Contraseñas y material de sesión» |
  | Duna (`data.ts:25`) | 80 | 260 | 220 | 12.000 | 100 | 22 | 20 | «Archivos y registros de navegador» |

  Los miles salen con punto (`fmtInt`, `video/engine/src/theme/motion.ts:78-82`). «Última semana» son dispositivos observados en la última semana de la
  ventana, **subconjunto** de «Dispositivos», no una cifra que se sume (`data.ts:17-18`; rótulo «subconjunto del mes»,
  `video/stealers-metricas/src/scenes/S07Caso.tsx:28`). Quién gana cada columna lo calcula `leader()` en s04 (`data.ts:35`; `S04Caso.tsx:30-35`); en s01, s08 y el
  póster va fijado a mano o recalculado (`S01Hook.tsx:87-89`; `S08Caso.tsx:51-53`; `Poster.tsx:32-33`), y cuadra en todas las escenas y
  con la lección (`analysis-yara.ts:107`): muestras, Bruma; episodios, dispositivos, sector y última semana, Cobalto; registros y organizaciones, Duna.
  Las organizaciones (40, 60, 100) **no se suman** nunca en pantalla ni en voz: «Una misma organización puede aparecer en más de una fila»
  (`narration.json:158`; `S04Caso.tsx:56`).
- **Los tres ganadores del gancho** (`video/stealers-metricas/src/scenes/S01Hook.tsx:87-89`): «Por muestras · archivos únicos» Bruma «1.200 archivos»;
  «Por dispositivos · equipos observados» Cobalto «450 equipos»; «Por registros · datos robados únicos» Duna «12.000 registros»; debajo, «¿qué estás
  contando?» y «columnas distintas, decisiones distintas» (`:92`, `:97`). El póster repite las tres columnas en barras, con «tres columnas de la misma
  tabla, tres ganadores», el título «El infostealer número uno depende de qué estés contando», «Práctica complementaria», «~9 min» y «Datos ficticios»
  (`video/stealers-metricas/src/Poster.tsx:11-15,51,60-63,66-69`).
- **Familia, operador y lo de alrededor** (s02; `video/stealers-metricas/src/scenes/S02Caso.tsx:82-101`): «Familia A · código y capacidades», «Familia
  B · otros criterios», «Operador 1» y «Operador 2 · usa el malware», «Distribuidor · lo entrega a objetivos», «Campaña · actividad, alcance y periodo»,
  «Broker · comercializa acceso»; tres flechas de familia a operador (`:76-78`) y los rótulos «una familia, varios operadores», «un operador, varias
  familias», «quien anuncia los datos puede no ser quien los obtuvo», «no cabe en una fila: un programa, una persona» (`:109-118`); «etiqueta de
  familia» ≠ «autor del robo» y «vendedor», tachados (`:124-127`), y «autoría y relaciones comerciales necesitan otras evidencias» (`:131`). Son figuras
  abstractas a propósito (A/B, 1/2), sin las familias del dataset (`:43-47`) y **sin ningún actor de la campaña**: ni EMBER FOX como célula de acceso,
  ni «VC» como comprador, ni GLASS VIPER como operadores. Un guion posterior no debe leer este esquema como el organigrama de VELVET CICADA.
- **La ficha de Bruma en seis casillas** (s03; `video/stealers-metricas/src/scenes/S03Caso.tsx:83-88`): Muestras 1.200 «archivos únicos», Episodios 130
  «eventos de infección», Dispositivos 100 «equipos observados», Registros 8.000 «entradas robadas únicas», Organizaciones 40 «identidad validada»,
  Sector 4 «dispositivos del sector»; cabecera «Bruma · septiembre de 2026 · Demo-P · datos ficticios» (`:75-76`). El cociente «8.000 ÷ 100 = 80» con
  «registros por dispositivo · cociente de la tabla» (`:92`) y «no son 8.000 equipos infectados» (`:95`): 8.000 / 100 = 80 cuadra, y es el cociente del
  dataset, no lo que tiene cada equipo (`:56-58`; la lección, `analysis-yara.ts:107`). **El 80 solo está en pantalla**: la voz dice «Bruma tiene ocho
  mil registros y cien dispositivos observados. Un equipo puede producir muchas entradas.» (`narration.json:90`). A la derecha, por turnos: «Un registro
  no es una credencial válida» (`S03Caso.tsx:100`); «1 equipo» → doce archivos, «muchos archivos, un solo equipo» (`:35`, `:42`, `:49`; los doce
  iconos son dibujo, no una cifra); «¿víctima: persona u organización?», «una empresa tiene muchos dispositivos», «varias cuentas, una misma persona»
  (`:107-109`); y «¿Qué cuenta una fila?» (`:113`).
- **Ordenar otra columna** (s04; `video/stealers-metricas/src/scenes/S04Caso.tsx:29-41`): la tabla entera con sus seis columnas y subtítulos, «Muestras
  · hashes», «Episodios · equipo y día», «Dispositivos · observados», «Registros · únicos», «Organizaciones · validadas», «Sector objetivo ·
  dispositivos». Pregunta: «Por dispositivos, ¿Bruma o Cobalto?» (`narration.json:139`; opciones «Bruma» / «Cobalto», `S04Caso.tsx:50`); respuesta en
  voz: «Pasa Cobalto, con cuatrocientos cincuenta dispositivos, frente a los cien de Bruma. Por registros gana Duna. También tiene más organizaciones en
  esta tabla.» (`narration.json:146`). Rótulos: «no hay contradicción: cada columna responde otra pregunta», «una misma organización puede estar en más
  de una fila», «identificar y deduplicar solapamientos», «poblaciones no independientes» (`S04Caso.tsx:53-61`). Los episodios (Cobalto, 540) se
  iluminan sin que la voz los nombre (`:31`).
- **El método del ejercicio** (s05; `video/stealers-metricas/src/scenes/S05Caso.tsx:58-64,69,72`): «Demo-P: no ve todo el mundo · dos regiones y
  anuncios seleccionados»; «1–30 de septiembre · UTC · la ventana de todas las cifras»; y «Unidad → se deduplica por»: Muestras, «hash SHA-256
  distinto»; Episodios, «equipo y día»; Dispositivos, «identificador estable»; Registros, «dispositivo + artefacto + fecha de obtención»;
  Organizaciones, «identidad validada». Es la frase de la lección (`analysis-yara.ts:99`). En voz, solo «por hash», y las organizaciones no se nombran
  (`narration.json:182`, `:194`). Avisos: «Un equipo, dos identificadores», «Dos equipos, un identificador», «Una reventa · no suma otra infección»,
  «decisiones del ejercicio, no reglas universales» (`S05Caso.tsx:90-100`). Tres fechas distintas, **sin ningún valor**: «Obtener los datos»,
  «Publicarlos», «Venderlos», cada una con «su propia fecha», y «Confundir esas fechas · una exposición antigua parece reciente» (`:108-112`).
- **Lo que ve el proveedor** (s06; `video/stealers-metricas/src/scenes/S06Caso.tsx:20-26,96-98`): «el mundo» con dos recuadros «lo que ve Demo-P» (46
  puntos de adorno, `:12`; no son una cifra) y un sesgo por familia: Cobalto, «más clientes del sector donde aparece»; Bruma, «circulan muchos archivos
  reempaquetados»; Duna, «anuncios repetidos por reventas · no deben aumentar los registros únicos». Son hipótesis de sesgo («puede», en voz,
  `narration.json:206`, `:212`), no hechos medidos. «mes 1» y «mes 2» sin valores, con «+ sensores», «+ etiquetas», «la cifra sube sin que crezca la
  amenaza» y «¿mismo método y población?» (`S06Caso.tsx:59-71`). «Prevalencia observada · frecuencia dentro de esa visibilidad y esa definición», «no es
  automáticamente una cuota global», «tampoco es la prioridad de Meridian», «falta conectar los datos con la exposición y las necesidades de la empresa»
  (`:105-114`).
- **El requisito de Meridian, que es del ejercicio** (s07): «Requisito de Meridian · investigar exposición de sesión en su sector»
  (`video/stealers-metricas/src/scenes/S07Caso.tsx:37`; repetido en `video/stealers-metricas/src/scenes/S08Caso.tsx:67`); en voz, «Meridian necesita
  investigar exposición de sesiones en su sector.» (`narration.json:242`). Viene de la lección (`analysis-yara.ts:113`). **No es un PIR de la campaña**
  ni lo pide nadie con nombre: no sale el CISO ni se relaciona con los PIR del Lab 1 (`src/data/labs.ts:53-63`). La tabla de señales, sin ganador
  marcado: «Del sector · dispositivos» 4 / 90 / 22, «Última semana · subconjunto del mes» 10 / 180 / 20 y «Capacidad descrita» (`S07Caso.tsx:27-31`).
  Límites en pantalla: «no prueba que Meridian esté comprometida», «capacidad descrita no es material robado», «la ficha describe lo observado y sus
  límites», «contrastar con exposición interna y otras fuentes» (`:45-54`). Dos contraejemplos, en condicional: «Requisito: recuperar archivos filtrados
  · Duna podría merecer otra prioridad» y «Cambian las aplicaciones de Meridian · cambia la relevancia» (`:58-61`); cierre, «la primera posición no
  sustituye una decisión sobre la organización concreta» (`:64`). **No se dice qué aplicaciones usa Meridian.**
- **La decisión** (s08; `video/stealers-metricas/src/scenes/S08Caso.tsx:49-61`): tabla con «Muestras · hashes» 1.200 / 300 / 80, «Del sector» 4 / 90 /
  22, «Última semana · dispositivos» 10 / 180 / 20 y «Capacidad descrita». Pregunta: «Para Meridian, ¿Bruma o Cobalto primero?» (`narration.json:291`;
  opciones `S08Caso.tsx:75`); respuesta: «Comparas esas señales y priorizas investigar Cobalto en este caso. La confianza es moderada por las
  limitaciones de fuente y método.» (`narration.json:298`). En pantalla, «Primera revisión: Cobalto · para el requisito de Meridian» (`S08Caso.tsx:79`),
  «Confianza moderada · límites de fuente y método» con dos barras de tres (`:20-25`), «no declara una infección propia», «no autoriza medidas
  automáticas» (`:85`, `:88`), «lo que cambiaría la prioridad»: «Fuente independiente», «Evidencia interna nueva», «Corrección de duplicados»
  (`:93-102`), y «un juicio que se revisa, no una etiqueta pegada a la familia» (`:106`). Es la conclusión modelo de la lección
  (`analysis-yara.ts:113`, `:115`). **Es una prioridad de investigación dentro del ejercicio: no hay infección en Meridian, ni hallazgo, ni medida
  tomada**, y esa «confianza moderada» no tiene nada que ver con la de la nota al CISO de V9.
- **Métricas del fenómeno frente a valor del equipo** (s09; `video/stealers-metricas/src/scenes/S09Caso.tsx:66-76`): panel «Métricas de amenaza · qué
  observaste» con «Dispositivos», «Episodios», «Registros», y panel «Valor CTI · qué decisión ayuda a tomar» con «Requisito», «Producto», «Decisión»,
  «Resultado»; entre los dos, una flecha punteada tachada (`:79-84`). Rótulos: «recibir más archivos no demuestra más valor», «recibir menos no prueba
  menos riesgo», «cobertura», «actividad», «colección», «conectar con consumidores y decisiones», «en la entrega: clasificación de amenazas y
  evaluación del programa, por separado», «una coincidencia temporal no es una causa demostrada» (`:87-108`). No da ninguna métrica del equipo de
  Meridian ni dice cómo le va: es el puente a s5m5 (`analysis-yara.ts:129`, `:163`).
- **El cierre** (s10; `video/stealers-metricas/src/scenes/S10Cierre.tsx:39-41`): tres reglas, «Unidad y ventana · qué cuentas y en qué periodo», «Método
  y cobertura · cómo deduplicas y qué observas», «Requisito y límites · para qué decisión sirve». «CONCLUSIÓN MODELO · Demo-P, septiembre de 2026» con
  «sin ranking actual» (`:50-51`): «Bruma lidera por muestras · Cobalto por dispositivos» y «Para esta necesidad de Meridian, investigarías antes
  Cobalto» (`:54-58`), más «afirmaciones compatibles: unidad y propósito claros» (`:63`). Duna no entra en esta conclusión (en la de la lección sí,
  `analysis-yara.ts:115`). Créditos: «Alertópolis · material independiente, no afiliado a SANS/GIAC · datos y familias ficticios» (`:89`).
- **Tarjetas de examen: ninguna.** En su lugar, cinco tarjetas «PRÁCTICA COMPLEMENTARIA» sin dominio (`video/engine/src/practica/bits.tsx:197`), una al
  final de s02, s04, s06, s08 y s09: «Familia, operador y campaña no son equivalentes» (`video/stealers-metricas/src/scenes/S02Caso.tsx:134`), «Muestras,
  dispositivos y registros cambian la clasificación» (`video/stealers-metricas/src/scenes/S04Caso.tsx:65`), «La prevalencia observada depende de
  cobertura y sesgo» (`video/stealers-metricas/src/scenes/S06Caso.tsx:117`), «La relevancia combina capacidad, recencia y exposición»
  (`video/stealers-metricas/src/scenes/S08Caso.tsx:109`) y «Actividad de amenazas no mide por sí sola el valor CTI»
  (`video/stealers-metricas/src/scenes/S09Caso.tsx:111`). Tarea final, bajo «PRÁCTICA COMPLEMENTARIA»: «Ordena el dataset de la lección s4m4 con dos
  métricas y justifica tu primera prioridad» (`S10Cierre.tsx:71-72`), con «una limitación de cobertura» y «una evidencia que te haría cambiar»
  (`:77`, `:80`); en voz, «Abre ahora el dataset de la lección de análisis.» (`narration.json:382`). Remate: «El número uno necesita apellidos»
  (`S10Cierre.tsx:84`; en voz, `narration.json:388`).
- **La voz no dice** Demo-P, 2026, SHA-256, el cociente 80, s4m4, PAPER CRANE, VELVET CICADA, GLASS VIPER ni Meridian Dynamics; tampoco ninguna cifra de
  Cobalto o de Duna salvo los «cuatrocientos cincuenta dispositivos» (`narration.json:146`), ni los 1.200, 130, 40 o 4 de Bruma. Las únicas cifras en
  voz son «ocho mil registros», «cien dispositivos» (`:90`), «cuatrocientos cincuenta» y «los cien de Bruma» (`:146`), y «dos regiones» (`:170`).
  Ningún porcentaje en todo el vídeo, ni en voz ni en pantalla.
- **PAPER CRANE**, dos mensajes nuevos, sin fecha (ver la tabla de §3). Firma en la tarjeta del motor
  (`video/stealers-metricas/src/timeline.json:4236-4237`); en las escenas no hay ficha de adversario (V9 y V23 enseñaban «célula de engaño · siembra
  pistas falsas») y la narradora no lo nombra ni le contesta como a alguien: rebate la frase.
  - «Ocho mil registros. Ocho mil equipos infectados.» (`video/stealers-metricas/narration.json:93`, s03-01); respuesta: «No son la misma unidad. En
    nuestra tabla, Bruma tiene ocho mil registros y cien dispositivos observados.» (`:90`).
  - «La que tiene más muestras es tu mayor riesgo.» (`video/stealers-metricas/narration.json:245`, s07-01); respuesta: «No necesariamente. Meridian
    necesita investigar exposición de sesiones en su sector.» (`:242`).

  Encajan con su ficha de V9 y V23 en lo esencial: empujan un atajo de método (confundir unidades, tomar el volumen por riesgo), nunca una hipótesis, y
  no confiesan nada. El tono es más seco: el segundo tutea («tu mayor riesgo»), pero ninguno dice «analista» ni lleva la ironía de «Todo consejo adora
  un nombre». Los «ocho mil equipos infectados» son la lectura errónea del dataset de Bruma, **no una afirmación sobre el parque de Meridian** (ver §5).
  PAPER CRANE no dice que las familias sean suyas ni que haya robado nada.
- **Imágenes que quedan ocupadas**: la tabla con «tres ganadores» según la columna, el número uno que «necesita apellidos» y el titular «con sus
  bordes» (título de s10, `video/stealers-metricas/src/timeline.json:19`). No hay analogía de objetos como en V23 o V27.
- **No se toca** (sigue fuera; ficha `:25`, `:107`): ningún equipo, cuenta, hash, dominio, IP ni fecha del caso; ni ENG-WS-041, ni el loader, ni
  `kazuo.tanji@`; ninguna familia real de infostealer ni ranking vigente (la lección lo dice, `analysis-yara.ts:129`); cuotas globales, atribución de
  operadores por la familia y estimaciones de población. Del resto de s4m4, nada del clustering: ni Cluster-A y Cluster-B ni «Orbital-2»
  (`src/data/s4.ts:742-758`). De S4, ni el dosier de HALL OF MIRRORS ni nada que PAPER CRANE hubiera plantado. No se dice que Meridian tenga credenciales
  o sesiones expuestas, ni qué aplicaciones usa, ni quién es su proveedor de inteligencia. No se culpa a nadie: ni a dirección por pedir «el número uno»
  (eso es del check de la lección, `analysis-yara.ts:116`, y el vídeo no lo usa) ni al proveedor por ver solo una parte.

### G02 · `niveles-audiencia` · s1m3 · YouTube `FW0X9_djBv4`

Lección `src/data/s1.ts:418-424` (bloque `video` después de la «Nota de examen» de la escala, `:412-417`, y antes del check de threat hunting,
`:425-434`; llegó con el commit `2a280a59`, que solo inserta el bloque, su prueba en `src/data/content.test.ts:359-361`, la entrada del inventario
(`src/data/security/video-inventory.ts`) y los archivos de
`public/videos/`: **la lección no cambió con él**). Dura 3:57 según los subtítulos publicados (última entrada hasta `00:03:56.900`,
`public/videos/niveles-audiencia-captions.vtt:249`; 237 s en `src/data/security/video-inventory.ts:1530`); ojo, el `timeline.json` del repositorio
sigue siendo el del **estimado**, no el de la grabación (`"mode": "estimate"`, `"voice": "none"`, 7314 fotogramas a 30 fps = 4:04,
`video/niveles-audiencia/src/timeline.json:2,4,7,8`; ver §5). Cápsula (`capsula-yt`, `video/niveles-audiencia/video.json:6`), guion congelado el
2026-10-23 (`:25`). Adversario de los interceptados EMBER FOX (`video/niveles-audiencia/video.json:8`), con la voz `sapi/Microsoft Pablo`, `rate` 0
y el efecto `machine` (`video/niveles-audiencia/narration.json:11-15`): la misma que GLASS VIPER, HOLLOW LANTERN y VELVET CICADA; lo distingue la
firma y la ficha en pantalla. Revisiones del guion en `docs/reviews/2026-10-23-guiones-gcti/` (`exactitud-G01-G03.md:61-99`,
`recheck-G01-G03.md:48-83`, `naturalidad-G01-G04.md:99-158`). **Sin fecha ni hora**, como V9, V15, V22, V23 y V27: la voz dice «Hoy te llegan dos
sobres» (`video/niveles-audiencia/narration.json:26`) y el rótulo de contexto no lleva día («no date, no hour, no alert»,
`video/niveles-audiencia/src/data/niveles.ts:13-14`); no se ordena contra §2. **No añade ningún hecho de la intrusión**: ni equipos, ni dominios, ni IP,
ni hashes, ni fechas («nothing here is a dated fact, a domain, an IP or a hash», `video/niveles-audiencia/src/data/niveles.ts:5-6`). Canon nuevo, solo
de pantalla y de voz:

- **El punto de partida: dos sobres sobre la mesa** (s01; `video/niveles-audiencia/src/data/niveles.ts:14,24-42`). Rótulo «Meridian Dynamics ·
  aeroespacial · tú, su analista de inteligencia», el mismo de V22, V23 y V27 (`:14`; `video/niveles-audiencia/src/scenes/parts/Desk.tsx:71-75`),
  sobre una mesa vista desde arriba sin nada legible (`video/niveles-audiencia/src/scenes/parts/Desk.tsx:7-9`). Sobre «consejo»: «¿hacia dónde va el
  sector?» y, debajo en pequeño, «¿dónde invertimos?» (`video/niveles-audiencia/src/data/niveles.ts:26-29`). Sobre «SOC»: «¿qué bloqueamos hoy?»
  (`:35-36`). En voz: «Hoy te llegan dos sobres. En uno, el consejo pregunta hacia dónde va el sector. En el otro, el SOC, qué tiene que bloquear
  ya.» y «Los dos piden inteligencia, pero no la misma.» (`video/niveles-audiencia/narration.json:26`, `:32`). Son el consejo y el SOC de §3: **preguntan,
  sin persona ni nombre, y no deciden ni despliegan nada** («They are questions, not decisions», `video/niveles-audiencia/src/scenes/S01Hook.tsx:35-36`). Es
  lo único que el vídeo cuenta como del día de Meridian. Título en pantalla «Niveles de CTI y la Sliding Scale» / «el producto correcto para la
  persona correcta» y tres chips de promesa, «los tres niveles», «la escala de la seguridad», «por qué no empezar por el tejado»
  (`video/niveles-audiencia/src/data/niveles.ts:44-54`).
- **El sobre** es la imagen del vídeo para «lo que entregas a cada lector»: misma forma y tamaño para los dos lectores, verde esmeralda el del
  consejo y cian el del SOC (`video/niveles-audiencia/src/scenes/parts/Envelope.tsx:6-8`; `video/niveles-audiencia/src/data/niveles.ts:7-10`;
  `video/niveles-audiencia/storyboard.json:27`). Remate en voz: «Y que cada sobre llegue a quien lo abre.» (`video/niveles-audiencia/narration.json:230`).
  Es de la analogía, no del caso, y queda **ocupada**: «cruzar los sobres» = darle a cada lector el producto del otro.
- **El club de fútbol: tres lectores, tres plazos** (s02; analogía, queda **ocupada**). Rótulo «la inteligencia es para alguien»
  (`video/niveles-audiencia/src/data/niveles.ts:56`) y tres viñetas abstractas, sin escudos, equipos, jugadores reales ni marcas
  (`video/niveles-audiencia/src/scenes/parts/Football.tsx:6-9`): «El jugador · necesita la jugada de ahora» = tactical (un campo visto desde arriba con
  un pase y un reloj, `:19`), «El entrenador · estudia al rival toda la semana» = operational (la pizarra con la misma jugada del rival repetida y
  una lupa, `:64`), «La directiva · decide en qué invertir los próximos años» = strategic (plano de cantera y plantilla con un calendario de
  temporadas, `:89`) (`video/niveles-audiencia/src/data/niveles.ts:59-63`). En voz: «La inteligencia no es para todos, es para alguien. Como en un
  club de fútbol.» (`video/niveles-audiencia/narration.json:38`, `:44`). Se eligió el fútbol para no pisar el pronóstico del tiempo de G05
  (`docs/reviews/2026-10-23-guiones-gcti/exactitud-G01-G03.md:78-80`; `docs/superpowers/plans/fichas-gcti/estado.md:22,27`). Un vídeo posterior no usa
  jugador, entrenador ni directiva para otra cosa.
- **La tabla de niveles es la de la lección, literal** (`video/niveles-audiencia/src/data/niveles.ts:65-93` frente a `src/data/s1.ts:366-388`): Tactical ·
  «SOC, detección, IR» · «¿Qué bloqueo/detecto hoy?» · «IOCs, reglas (YARA/Sigma/Snort), feeds» · «Horas–días»; Operational · «Threat hunters, IR
  leads, CTI peers» · «¿Cómo opera este grupo? ¿Qué campañas hay activas?» · «Informes de campaña, análisis de TTPs, mapeos ATT&CK» ·
  «Semanas–meses»; Strategic · «CISO, dirección, board» · «¿Dónde invertimos? ¿Qué riesgo aceptamos?» · «Assessments, tendencias, panorama de
  amenazas» · «Meses–años». Solo tres niveles; los productos son nombres de categoría, sin ningún indicador con valor. Remate «el nivel lo marca
  quién lee, qué decide y para cuándo» (`video/niveles-audiencia/src/data/niveles.ts:95`; en voz, `video/niveles-audiencia/narration.json:68`). La voz
  nombra «el CISO y el consejo, que deciden dónde invertir» como lectores del nivel, en general (`:62`): no es una decisión de Meridian.
- **El cruce de sobres es un ejemplo hipotético, no un hecho** (s03). Toda la escena lleva el rótulo «Ejemplo hipotético · no ha pasado en Meridian»
  (`video/niveles-audiencia/src/data/niveles.ts:100`; `video/niveles-audiencia/src/scenes/S03Error.tsx:255-258`) y la voz lo plantea como «Imagina que
  cruzas los sobres» (`video/niveles-audiencia/narration.json:80`). Al consejo le llega una hoja «4.000 IP» (contador que sube hasta 4000,
  `video/niveles-audiencia/src/scenes/parts/Sheets.tsx:38-39,60`; `video/niveles-audiencia/src/data/niveles.ts:109`) con filas grises que solo llevan un
  chip «IP», **sin ningún valor** (`video/niveles-audiencia/src/scenes/parts/Sheets.tsx:7-9,93`), y sus dos preguntas, «¿dónde invertimos?» y «¿qué
  riesgo aceptamos?», sin respuesta (`video/niveles-audiencia/src/data/niveles.ts:106`). Al SOC, una hoja «evaluación de tendencias del sector» con una
  gráfica sin cifras (`video/niveles-audiencia/src/scenes/parts/Sheets.tsx:104,111-114`), «¿qué bloqueamos hoy?» y una celda «reglas» vacía
  (`:173`). Dos sellos «sin respuesta» (`:215`), el rótulo «EL ERROR CLÁSICO» / «darle a cada uno lo del otro» y la regla «producto correcto ·
  audiencia correcta» con «mira quién lo va a leer» (`video/niveles-audiencia/src/data/niveles.ts:110-113`). En voz: «Al consejo le llega una lista de
  cuatro mil direcciones IP. Con eso no puede decidir dónde invertir ni qué riesgo aceptar.», «Y al SOC, un análisis de tendencias del sector. Muy
  interesante, pero ni una regla ni un indicador para hoy.» y «hay una regla que no se negocia, producto correcto para audiencia correcta»
  (`video/niveles-audiencia/narration.json:90`, `:96`, `:108`). Las «4.000 IP» y las tendencias del sector salen de un check de la lección
  (`src/data/s1.ts:452-453`); el «error clásico» de la lección habla de «listas de IOCs» al board y «geopolítica» al SOC (`:395`). **Nadie en Meridian
  mandó 4.000 IP al consejo**: un guion posterior no lo cuenta como algo que pasó.
- **La casa: la Sliding Scale en cinco piezas** (s04; analogía, queda **ocupada**; la casa y el tejado vienen de la propia lección, «no empezar la
  casa por el tejado», `src/data/s1.ts:416`). Cabecera «Sliding Scale of Cyber Security» / «ordena las inversiones de seguridad»
  (`video/niveles-audiencia/src/data/niveles.ts:119`; «inversiones», no «defensas», por
  `docs/reviews/2026-10-23-guiones-gcti/exactitud-G01-G03.md:68-71`). Cimientos y paredes = Architecture; la puerta blindada = Passive Defense; el
  vigilante que hace la ronda con su farol = Active Defense; el tejado = Intelligence; y, fuera de la casa, oscuro y con candado, Offense
  (`video/niveles-audiencia/src/scenes/parts/House.tsx:5-10`). Chips de cada parada, con las palabras de la lección
  (`video/niveles-audiencia/src/data/niveles.ts:124-160`): «sistemas defendibles · segmentación · hardening · parcheo»; «protección sin operador en el
  bucle · firewalls, filtrado» (sin «EDR/AV», que la lección sí pone en `src/data/s1.ts:406`: se guarda para la pregunta); «analistas en el bucle ·
  monitorización · threat hunting · respuesta a incidentes»; «consumir y producir conocimiento del adversario para informar al resto», con el ejemplo
  «informes de actor» (`:162`); «acciones legales de respuesta contra el adversario · terreno casi exclusivo de estados». Flecha de la barra: «base
  con mejor retorno a la izquierda · lo de la derecha rinde si lo anterior existe» (`:121`). En voz, `video/niveles-audiencia/narration.json:120-156`
  («la puerta blindada, que protege sin que nadie la maneje… como un cortafuegos», `:132`; «el vigilante que hace la ronda, una persona al mando»,
  `:138`; «Encima va el tejado, Intelligence», `:150`; «Y fuera de la casa queda Offense», `:156`).
- **La pregunta de clasificar** (s04): tarjeta «EDR que bloquea malware conocido sin que nadie intervenga» (`video/niveles-audiencia/src/data/niveles.ts:165`),
  pausa «EDR que bloquea solo: ¿qué categoría?» (`video/niveles-audiencia/narration.json:165`) y respuesta «Passive Defense, porque protege sin que
  intervenga nadie.» (`:172`), con «firewalls, EDR/AV, filtrado» y la pregunta de método «¿hay una persona al mando?»
  (`video/niveles-audiencia/src/data/niveles.ts:167-168`). Es la s1m3q4 de la lección (`src/data/s1.ts:506-510`). Ejemplo didáctico: **no dice que
  Meridian tenga un EDR ni cuál** (el «sensor EDR» de Meridian es de V3, §7).
- **El tejado sin casa y a quién sirve la inteligencia** (s05). Sobre la barra, «Intelligence multiplica el valor de las demás, no las sustituye», con
  tres arcos «×» y las dos mitades «base, mejor retorno» y «solo rinde si la base existe» (`video/niveles-audiencia/src/data/niveles.ts:172-175`;
  `video/niveles-audiencia/src/scenes/S05Tejado.tsx:192-196`). Luego la casa se hunde y solo queda el tejado en el aire con un «informe de
  inteligencia» encima, una silueta vacía al lado y el rótulo «sin base defendible, nadie lo aplica»
  (`video/niveles-audiencia/src/scenes/S05Tejado.tsx:150-151,242-244,251`); en voz, «Sin una base defendible, tu informe es un tejado sin casa. Llega
  y no hay quién lo use. Es empezar por el tejado.» (`video/niveles-audiencia/narration.json:200`). Con la casa entera, cinco flechas del tejado a la
  lista «La inteligencia habilita a otros equipos» de la lección (`src/data/s1.ts:435-444`), traducida: SOC, IR, «Gestión de vulnerabilidades», Red
  team, Dirección (`video/niveles-audiencia/src/data/niveles.ts:179-185`); la voz dice solo tres, «sirve al SOC, a la respuesta y a la dirección»
  (`video/niveles-audiencia/narration.json:206`). Todo esto es regla general: **el vídeo no dice que Meridian tenga o no tenga una base defendible**.
- **Los sobres vuelven con lo suyo, preparados y no entregados** (final de s05): el del consejo, «evaluación de tendencias del sector»; el del SOC,
  «indicadores y reglas de detección» (`video/niveles-audiencia/src/data/niveles.ts:31,39`;
  `video/niveles-audiencia/src/scenes/parts/EnvelopeCards.tsx:26`), abiertos, con una marca de hecho y el rótulo «lo que preparas para cada lector»
  (`video/niveles-audiencia/src/scenes/S05Tejado.tsx:179,184`; «Prepared, not delivered: unsealed, nobody decides anything», `:45-46`). En voz, «Y los
  dos sobres llevan lo suyo.» (`video/niveles-audiencia/narration.json:206`). Sin contenido: ni qué tendencias, ni qué indicadores, ni qué reglas; nadie
  recibe, lee ni decide nada en pantalla.
- **EMBER FOX**, primera vez con ficha en un vídeo de esta entrada (G01 y G03, de la misma sección, aún sin entrada aquí). Ficha en pantalla mientras
  dura cada mensaje: una cabeza de zorro en facetas rosa y «EMBER FOX · célula de acceso inicial · spearphishing»
  (`video/niveles-audiencia/src/data/niveles.ts:103`; `video/niveles-audiencia/src/scenes/parts/Fox.tsx:6-9,64-68`): repite las palabras de la sección
  (`src/data/course-gcti.ts:17-19`) y no dice qué hizo la célula, «no templates, no target list, no «VC»». Rosa es el color del adversario en este
  vídeo (`video/niveles-audiencia/src/data/niveles.ts:10`). La voz lo nombra una vez, sin presentarlo, al contestarle (`video/niveles-audiencia/narration.json:80`).
  Dos mensajes, sin fecha; tutea, no dice «analista» (es el tic de PAPER CRANE, `docs/superpowers/plans/fichas-gcti/estado.md:21`), habla como un
  vendedor suave y empuja atajos de método: no confiesa nada, no dice qué es ni qué hizo. Ver la tabla de §3:
  - «Mándale al consejo las IP, tranquilo. Cuantas más, más seria parece.» (`video/niveles-audiencia/narration.json:83`, s03-01); respuesta:
    «Seria, sí, EMBER FOX. Útil, ya es otra cosa. Imagina que cruzas los sobres.» (`:80`). «las IP» son genéricas: ni un valor, ni una lista del caso.
  - «Compra buena inteligencia y no te compliques. Los parches, ya si eso.» (`video/niveles-audiencia/narration.json:181`, s05-01); respuesta: «Qué
    buen atajo, saltarte los parches. Pero ¿quién va a usar esa inteligencia?» (`:178`).
- **Las tarjetas de examen** (dominio Requirements, las cuatro): «Tactical: SOC. Operational: hunters. Strategic: dirección», «Producto correcto para
  la audiencia correcta», «Active Defense: hunting y monitorización» e «Intelligence multiplica lo demás, no lo sustituye»
  (`video/niveles-audiencia/narration.json:70-75`, `:110-115`, `:140-145`, `:190-195`). Cierre, «Tres reglas» (s06): «El nivel lo marca quién lee»
  («tactical para hoy», «operational para entender al grupo», «strategic para invertir»); «Producto correcto, audiencia correcta» («indicadores al
  consejo o tendencias al SOC: el error clásico»); «Primero la base, luego Intelligence» («multiplica, no sustituye»)
  (`video/niveles-audiencia/src/scenes/S06Recap.tsx:41-46,54-59,67-71`; en voz, `video/niveles-audiencia/narration.json:212-224`). Tarea: «Tu turno:
  las preguntas de la lección», «s1m3 · 6 preguntas», sin laboratorio (`video/niveles-audiencia/src/data/niveles.ts:191-192`; son s1m3q1–q6,
  `src/data/s1.ts:462-537`). Tarjeta final «Niveles de CTI / y la Sliding Scale», «GIAC GCTI · Requirements» (`:194-200`).
- **La voz no dice** ninguna fecha, hora, equipo, dominio, IP con valor ni hash; no nombra a VELVET CICADA, a GLASS VIPER ni «VC»; dice «Meridian»
  cero veces (el nombre solo está en el rótulo, `video/niveles-audiencia/src/data/niveles.ts:14`, y en «no ha pasado en Meridian», `:100`); no dice
  «technical» como cuarto nivel, ni «spearphishing», ni «zorro» (el zorro solo se dibuja). Los nombres ingleses de los niveles y de las cinco
  categorías sí se dicen.
- **No se toca** (se deduce del propio vídeo: `video/niveles-audiencia/src/data/niveles.ts:5-6`; `video/niveles-audiencia/src/scenes/parts/Fox.tsx:8-9`;
  `docs/reviews/2026-10-23-guiones-gcti/recheck-G01-G03.md:63`): el dosier de FIRST LIGHT (`src/data/course-gcti.ts:20-21`: plantillas, lista de
  objetivos, «VC»); la IP `141.98.6.10` y «sirvió un panel de phishing el martes» de s1m1 (`src/data/s1.ts:27,32`), que **no salen en este vídeo** ni
  en voz ni en pantalla; el correo del 2-3, ENG-WS-041, E7 y todo §2; los rumores de robo de diseños y el encargo de los PIR (de G01 y G03); el
  CISO como persona. No se culpa a nadie: ni al consejo ni al SOC por preguntar, ni a quien prepara el envío.

### G08 · `tlp-comunidades` · s3m4 · YouTube `mHSJuJ_reKE`

Lección `src/data/s3.ts:842-848` (bloque `video` después del párrafo «Las **comunidades de compartición** multiplican tu colección…», `:838-841`, y
antes de «Al consumir informes de vendors…», `:849-852`; llegó a `main` con #108, commit `2a280a59`, que también fija la lección en
`src/data/content.test.ts:362-364`). **La carpeta del vídeo no está en `main`:** todas las rutas `video/tlp-comunidades/…` de esta entrada son de la
rama `video-tlp-comunidades` (commit `785b10e8`, «G08 scenes, shared parts and poster, built on the estimate timeline»), sin mergear, y los números
de línea son los de ese commit. Duración publicada: 225 s, 3:45 (`src/data/security/video-inventory.ts:2131`, comprobada contra los subtítulos,
`:2132`; el último acaba en `00:03:44.367`); **no hay fotogramas de la grabación**, porque el `timeline.json` de la rama está en modo `estimate`
(7713 fotogramas a 30 fps, 257 s; `video/tlp-comunidades/src/timeline.json:2,4,7`) y no vale como duración real. Cápsula (`capsula-yt`,
`video/tlp-comunidades/video.json:6`), guion congelado el 2026-10-25 (`:10`), con la grabación de Lidia (`"voice": "recording/lidia"`,
`video/tlp-comunidades/narration.json:2`). Adversario de los interceptados HOLLOW LANTERN (`video/tlp-comunidades/video.json:8`), con la voz
`sapi/Microsoft Pablo` y el efecto `machine` (`video/tlp-comunidades/narration.json:10-14`), la misma de V4, V8 y V15. No tiene notas de guion en la
copia leída (el `out/` no va en git). **Sin fecha ni hora, y sin caso de Meridian:** el rótulo de apertura es «Ejemplo · sin fecha»
(`video/tlp-comunidades/src/data/s01-hook.ts:3`) y el único caso que cuenta es inventado y de otra empresa; no se ordena contra §2 y no añade
ningún hecho a la campaña. **La lección no cambió con él**: el commit solo inserta el bloque, su prueba, la entrada del inventario
(`src/data/security/video-inventory.ts`) y los tres archivos de `public/videos/`.
Canon nuevo, solo de pantalla y de voz:

- **La imagen: un festival con pulseras** (analogía del vídeo, no del caso; queda **ocupada**). Un festival visto desde arriba, sin texto, en tres
  zonas con sus vallas, de fuera adentro: la calle, el recinto y el camerino (`video/tlp-comunidades/src/scenes/parts/Venue.tsx:48-51`); una pulsera
  ámbar se cierra en una muñeca (`video/tlp-comunidades/src/scenes/S01Hook.tsx:95`) con la lectura «no dice lo valioso que hay dentro» (tachada) y
  «dice a quién se le deja pasar» (`video/tlp-comunidades/src/data/s01-hook.ts:8`). En voz: «En un festival, la pulsera no dice lo valioso que hay
  dentro. Dice a quién se le deja pasar.» y «Los informes de inteligencia llevan una pulsera igual. Se llama TLP.»
  (`video/tlp-comunidades/narration.json:26`, `:32`). Título «TLP: con quién puedes compartir un informe», con «la pulsera de color de la
  inteligencia» (`video/tlp-comunidades/src/data/s01-hook.ts:5`), y la promesa en tres chips, «las cinco marcas», «lo que hereda lo que sacas»,
  «compartir es cosa de dos» (`:11-15`). Del lado de la inteligencia, **la hoja de informe sin texto legible con una cinta ámbar en la esquina**
  (`video/tlp-comunidades/src/scenes/parts/ReportSheet.tsx:9-13`; `video/tlp-comunidades/src/data/tlp.ts:29-30`), que acompaña todo el vídeo: no
  lleva número, autor, fecha ni «TLP:AMBER» escrito. Un vídeo posterior no usa la pulsera, las zonas del festival, el camerino con su lista de
  nombres, la credencial del personal, el cartel de la calle, la foto del camerino, los cromos ni el álbum para otra cosa.
- **Las cinco marcas, en el orden de la voz** (de la más cerrada a la más abierta; rótulo «de la más cerrada a la más abierta»,
  `video/tlp-comunidades/src/data/s02-pulseras.ts:3`). La tabla en pantalla lleva las cabeceras «Marca» y «Quién puede recibirlo» (`:11`) y el
  texto de la lección palabra por palabra (`video/tlp-comunidades/src/data/tlp.ts:19-25`; `src/data/s3.ts:816-825`), pero **con AMBER+STRICT antes de
  AMBER** (la lección pone AMBER primero, `:820-821`):
  - `TLP:RED`, «Solo los participantes nombrados — ojos concretos, no organizaciones»; es **el camerino con una lista de nombres**
    (`video/tlp-comunidades/src/scenes/S02Pulseras.tsx:35-37`), con el chip «y nadie más contigo» (`video/tlp-comunidades/src/data/s02-pulseras.ts:6`).
    En voz: «La del camerino, con tu nombre en la lista, es la roja. Solo entran las personas nombradas, no sus empresas, y no puedes llevar a nadie
    contigo.» (`video/tlp-comunidades/narration.json:50`).
  - `TLP:AMBER+STRICT`, «Solo tu organización — sin clientes»; **la credencial del personal de la casa**, ámbar con borde grueso
    (`video/tlp-comunidades/src/scenes/S02Pulseras.tsx:38-40`; `video/tlp-comunidades/src/data/tlp.ts:21`), con el chip «incorporada a TLP 2.0»
    (`video/tlp-comunidades/src/data/s02-pulseras.ts:7`). En voz: «Es la ámbar estricta, la que entró en el estándar con el TLP dos. Solo tu
    organización, ni siquiera sus clientes.» (`video/tlp-comunidades/narration.json:56`).
  - `TLP:AMBER`, «Tu organización y sus clientes con necesidad de saber»; la misma credencial **más la de un invitado**
    (`video/tlp-comunidades/src/scenes/S02Pulseras.tsx:41-43`). En voz: «Si además pasan los invitados que necesiten saberlo, es la ámbar.»
    (`video/tlp-comunidades/narration.json:62`). Los «invitados» son los clientes con necesidad de saber.
  - `TLP:GREEN`, «La comunidad — peers y organizaciones del sector, no público»; **todo el recinto, con la valla exterior cerrada**
    (`video/tlp-comunidades/src/scenes/S02Pulseras.tsx:44-46`). En voz: «O sea, la comunidad, tus colegas y el sector, pero no la calle.»
    (`video/tlp-comunidades/narration.json:68`).
  - `TLP:CLEAR`, «Sin restricción — publicable»; **el cartel en la calle** (`video/tlp-comunidades/src/scenes/S02Pulseras.tsx:47-48`), con el chip
    «antes: WHITE» (`video/tlp-comunidades/src/data/s02-pulseras.ts:8`). En voz: «Es la clear. En el TLP dos sustituyó a la blanca.»
    (`video/tlp-comunidades/narration.json:74`).
  - Cierre: «no son una escala de gravedad» · «dicen a quién puedes pasarle el informe» (`video/tlp-comunidades/src/data/s02-pulseras.ts:13`;
    en voz, `video/tlp-comunidades/narration.json:80`). Los colores son de marca, no de gravedad: el rojo de `TLP:RED` es el rosa que en el resto de
    los vídeos significa «atacante» (`video/tlp-comunidades/src/data/tlp.ts:5-6`). Solo cinco marcas: WHITE sale únicamente en ese chip.
- **El caso inventado de s03 NO es de Meridian** (ejemplo didáctico: es el «fumble» de la lección, `src/data/s3.ts:833-837`, contado en condicional).
  Rótulo fijo durante toda la escena: **«Ejemplo hipotético · no ha pasado en Meridian»** (`video/tlp-comunidades/src/data/s03-lista.ts:3`;
  `video/tlp-comunidades/src/scenes/S03Lista.tsx:96-116`); es la única vez que el vídeo escribe «Meridian», y la voz no lo dice nunca. En voz:
  «Veamos qué pasa con un caso inventado.» y «Un analista de otra empresa recibe un informe ámbar del ISAC de su sector. El informe cuenta una
  campaña en curso, con servidores de mando y control todavía activos.» (`video/tlp-comunidades/narration.json:92`, `:102`). En pantalla:
  - el remitente, **«ISAC» a secas** (`video/tlp-comunidades/src/data/s03-lista.ts:7`): no es el «ISAC aeroespacial» de V8 y s3m5
    (`video/stix-isac/src/data/s05-taxii.ts:19`), y el informe es ámbar, no el `tlp-amber-strict` de aquel indicador (`:16`);
  - un panel de **cuatro filas grises ilegibles con un punto verde** cada una y «campaña en curso · servidores activos»
    (`video/tlp-comunidades/src/data/s03-lista.ts:8`; `video/tlp-comunidades/src/scenes/S03Lista.tsx:23,167`): ningún dominio, IP ni hash, ni
    siquiera su forma (`video/tlp-comunidades/src/scenes/parts/GreyRows.tsx:7-10`);
  - la «lista de correo abierta», doce siluetas sin rostro, y el botón «reenviar solo los indicadores»
    (`video/tlp-comunidades/src/data/s03-lista.ts:9-10`; `video/tlp-comunidades/src/scenes/S03Lista.tsx:258`); pregunta para pensar: «Informe
    ámbar: ¿reenvías solo los indicadores?» (`video/tlp-comunidades/narration.json:111`), y la respuesta, «No. Mira lo que puede pasar si lo hace.»
    (`:118`);
  - entre las siluetas, una con máscara y el rótulo **«alias»**, en violeta, que lee las filas; las filas cambian de tono con el chip «horas»
    (`video/tlp-comunidades/src/data/s03-lista.ts:11-12`; `video/tlp-comunidades/src/scenes/S03Lista.tsx:263-274`, `:171-193`). En voz: «El atacante
    lee fuentes abiertas, eso que llaman OSINT, y está en esa lista con un alias. En pocas horas puede cambiar toda su infraestructura.»
    (`video/tlp-comunidades/narration.json:124`). Es «el atacante» del ejemplo, sin nombre: **no es HOLLOW LANTERN** ni nadie de la campaña;
  - tres fichas de consecuencia: «víctimas sin avisar · ventana de detección perdida», «el ISAC abre una investigación» y «fuera de los intercambios
    sensibles · meses» (`video/tlp-comunidades/src/data/s03-lista.ts:14-18`; en voz, `video/tlp-comunidades/narration.json:130`, `:136`);
  - y el remate «ir rápido ≠ proteger más» (`video/tlp-comunidades/src/data/s03-lista.ts:20`; `video/tlp-comunidades/src/scenes/S03Lista.tsx:319-325`;
    en voz, «Y todo por ir rápido. Compartir más deprisa no siempre protege más.», `video/tlp-comunidades/narration.json:142`).
  Sin fecha, hora, empresa, sector ni persona con nombre. Un guion posterior no lo cita como algo que le pasó a Meridian, a Orbital ni al ISAC
  aeroespacial.
- **La foto del camerino: lo que sacas hereda la marca** (analogía, ocupada). «Sacar solo los indicadores es como hacer una foto dentro del
  camerino. La foto sigue siendo del camerino, y lleva la misma pulsera.» (`video/tlp-comunidades/narration.json:154`). En pantalla, de la hoja sale
  una tira de cinco filas grises con el rótulo «IOC» y, al heredar, la palabra «ámbar» y la cinta del informe en cada fila
  (`video/tlp-comunidades/src/data/s04-foto.ts:3-4`; `video/tlp-comunidades/src/scenes/S04Foto.tsx:93-110`); al lado, el camerino, el visor de la
  cámara y una foto tipo polaroid con la misma pulsera (`video/tlp-comunidades/src/scenes/S04Foto.tsx:124-156`). «IOC» solo se lee: la voz dice
  siempre «los indicadores».
- **La marca la pone quien produjo el informe** (regla de la lección, `src/data/s3.ts:836`). Una silueta sin rostro con «quién produjo el informe» y
  una balanza nivelada entre «quién puede saberlo» y «sin coste para su operación» (`video/tlp-comunidades/src/data/s04-foto.ts:5-6`;
  `video/tlp-comunidades/src/scenes/S04Foto.tsx:167-207`). En voz: «Y esa pulsera no la eliges tú. La pone quien hizo el informe, porque es el único
  que sabe quién puede enterarse sin arriesgar su operación.» (`video/tlp-comunidades/narration.json:166`). Y la salida: «lee la pulsera antes de
  reenviar» · «¿más lejos? pídeselo a quien lo produjo» (`video/tlp-comunidades/src/data/s04-foto.ts:7`; en voz, `video/tlp-comunidades/narration.json:172`).
  El productor no tiene nombre: no es Meridian CTI ni el ISAC.
- **Las comunidades, sin nombres** (`video/tlp-comunidades/src/data/s05-comunidad.ts:3-7`): «ISACs de cada sector», «CERT nacionales» y «grupos de
  confianza entre colegas», y debajo, solo en pantalla, «entre todos ven más que tú solo» (`:9`). En voz: «Son los ISAC de cada sector, los CERT
  nacionales y los grupos de confianza entre colegas.» (`video/tlp-comunidades/narration.json:178`). De la lista de la lección
  (`src/data/s3.ts:840`) se quedan fuera los ISAO, los CSIRT, los «programas de intercambio con peers» y los sectores de ejemplo (aviación,
  finanzas, energía). Ninguna organización, ningún país y nada de lo que Meridian aporta o recibe.
- **El cambio de cromos** (analogía, ocupada). «Funcionan como un cambio de cromos. Cada uno pone los suyos, y así se completa el álbum.»
  (`video/tlp-comunidades/narration.json:184`): un álbum de ocho huecos y dos manos que se pasan cromos sin texto
  (`video/tlp-comunidades/src/scenes/S05Comunidad.tsx:138-148`; `video/tlp-comunidades/src/scenes/parts/Album.tsx:7-9`, `:77-80`). Tras el mensaje,
  una mano solo coge (`video/tlp-comunidades/src/scenes/S05Comunidad.tsx:59-61`); después, el álbum de quien solo coge se queda con seis huecos de
  ocho, una puerta tachada con «fuera de la comunidad» y un cromo con la pulsera ámbar arrancada, «quien rompe una marca», que acaba en la misma
  puerta (`video/tlp-comunidades/src/data/s05-comunidad.ts:10-11`; `video/tlp-comunidades/src/scenes/S05Comunidad.tsx:181-207`). En voz: «La regla
  de oro es la reciprocidad. Quien solo recibe y nunca aporta se queda sin cromos. Y quien se salta una marca, también.»
  (`video/tlp-comunidades/narration.json:200`).
- **Tres reglas y la tarea** (`video/tlp-comunidades/src/data/s06-recap.ts:3-7`): «la marca dice a quién se lo pasas · no es una escala de
  gravedad», «lo que sacas lleva su marca · aunque sean solo los indicadores» y «dar y cuidar lo que te dan · las comunidades viven de eso»; en
  voz, `video/tlp-comunidades/narration.json:212`, `:218`, `:224`. Tarea: «Tu turno: las preguntas de la lección»
  (`video/tlp-comunidades/src/data/s06-recap.ts:9`) y, en voz, «Te quedan las diez preguntas de la lección. Y que cada informe llegue solo a quien
  toca.» (`video/tlp-comunidades/narration.json:230`); son las diez de s3m4 (`src/data/s3.ts:886-1030`). Sin laboratorio. Tarjeta final con
  «GIAC GCTI · Collection» y el descargo (`video/tlp-comunidades/src/data/s06-recap.ts:15-16`).
- **Las tarjetas de examen** (cuatro, dominio Collection, insignia «GCTI», `video/tlp-comunidades/video.json:12`): «TLP: a quién redistribuyes, no la
  sensibilidad técnica» (s02-07), «Compartir más rápido no siempre protege más» (s03-08), «Los indicadores extraídos heredan la marca» (s04-01) y
  «Quien solo consume acaba fuera de la comunidad» (s05-04) (`video/tlp-comunidades/narration.json:84`, `:146`, `:158`, `:204`). Las cuatro son
  frases de la lección (`src/data/s3.ts:830`, `:836`, `:840`).
- **HOLLOW LANTERN**, dos mensajes nuevos, sin fecha. Mismo tono que en V15: consejos en imperativo que tutean, «analista» en el primero, un atajo
  de método que le conviene a él; no habla de su infraestructura, no confiesa nada y no dice quién es. Ver la tabla de §3:
  - «Pasa solo los indicadores, analista. Esos no llevan marca.» (`video/tlp-comunidades/narration.json:95`, s03-01); respuesta: «Claro, HOLLOW
    LANTERN, y a cualquier atacante le vendría de maravilla. Veamos qué pasa con un caso inventado.» (`:92`). La respuesta de fondo llega en s04:
    lo que sacas hereda la marca.
  - «Llévate lo que te den y no des nada. Nadie lleva la cuenta.» (`video/tlp-comunidades/narration.json:193`, s05-03); respuesta: «Qué listo,
    HOLLOW LANTERN, llevarte sin dar. Pero eso se nota.» (`:190`), y después la regla de la reciprocidad (`:200`).
  - **Ficha en pantalla, solo en s03:** «HOLLOW LANTERN» con una segunda línea, **«equipo de infraestructura»**
    (`video/tlp-comunidades/src/data/s03-lista.ts:5`; `video/tlp-comunidades/src/scenes/parts/AdversaryTag.tsx:26-27`;
    `video/tlp-comunidades/src/scenes/S03Lista.tsx:125-130`), que se aparta con la respuesta. Esa segunda línea no está en el `src/` de ningún
    otro vídeo de `main` (viene de la ficha del jefe, `src/data/course-gcti.ts:57`); ver §5 punto 65. En s05 solo sale la tarjeta del motor, «MENSAJE INTERCEPTADO · HOLLOW
    LANTERN».
  - **La narradora lo nombra en voz, dos veces** («jólou lántern», `video/tlp-comunidades/narration.json:92`, `:190`): en V4, V8 y V15 su nombre
    solo estaba en pantalla.
- **La voz no dice** Meridian, VELVET CICADA, GLASS VIPER ni Orbital; ningún host, dominio, IP, hash, fecha ni hora; «ISAC aeroespacial»; ningún
  número de informe; `TLP:RED` y los demás códigos tal como se escriben (dice «la roja», «la ámbar estricta», «la ámbar», «la verde» y «la
  clear»); «WHITE» (dice «la blanca»); «IOC»; «need to know»; ISAO ni CSIRT. Sí dice TLP, «TLP dos», ISAC, CERT, OSINT y «mando y control».
  Pronunciación de la grabación: TLP «te ele pe», ISAC «áisac», CERT «cert» (`video/tlp-comunidades/lexicon.json:2-4`), OSINT «ósint» y clear
  «clír» (`video/tlp-comunidades/narration.json:124`, `:74`).
- **No se toca** (sigue fuera): la otra mitad de s3m4, es decir, el WHOIS y el passive DNS de `cdn-sync-status.example`
  (`src/data/s3.ts:767-783`), la colección pasiva frente a la activa, el OPSEC y los informes de vendors; el ISAC aeroespacial, su colección TAXII
  y el indicador con `tlp-amber-strict` (de V8; `src/data/s3.ts:1086`); el `tlp = "AMBER"` de la regla YARA (de V27) y el `TLP:AMBER` del flash
  alert MER-FA-2026-014 (`src/data/s5.ts:47`); el «TLP aplicado» de s5m3 (`src/data/s5.ts:642`) y las marcas del Lab 5B
  (`src/data/labs.ts:1107-1149`); cualquier informe `MER-…` (§5 punto 17); Stellar Dynamics y lo que «merece compartirse vía ISAC» del Lab 3A (§4;
  `src/data/labs.ts:707`); el dosier de DEEP WELL (`src/data/course-gcti.ts:59`); y lo que Meridian comparte con Orbital (V14). No se culpa a
  nadie: el analista del ejemplo «quiere proteger a todos cuanto antes» (`video/tlp-comunidades/narration.json:108`).

### Plantilla para el siguiente

`### <Vn | APnn | Gnn> · <slug> · <lección> · YouTube <id>`: lección `ruta:línea`; adversario (`video/<slug>/video.json:línea`);
canon nuevo, un punto por dato con su `ruta:línea`; y en §5, lo que choque.

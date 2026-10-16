# Canon de «Operación VELVET CICADA» (GCTI)

Registro único de los datos ficticios de la campaña GCTI: la intrusión contra Meridian Dynamics que continúan
las lecciones, los laboratorios y los vídeos. Estado a 2026-10-16 (vídeos con su canon aquí: V3, V4, V7, V8, V9, V13, V14, V15, V22, V23 y V27). Las citas de
`src/data/s5.ts` van con la numeración de `main` desde que #56 trajo el bloque de V27 (`:583-589`): las que pasan de la `:583`
están siete líneas más abajo que antes.

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

## 7. Vídeos publicados y su canon nuevo

Aquí se añade un bloque por vídeo cuando se produce: los datos que solo existen en pantalla.

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

### V4 · `pivot-infra` · s3m3 · YouTube `8pet46MOGmk`

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

### V7 · `attack-piramide` · s2m5 · YouTube `XCOAc7tlPTE`

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

### V8 · `stix-isac` · s3m5 · YouTube `KO4REQeaKgM`

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

### V13 · `kill-chain-eslabon` · s2m1 · YouTube `WidodMPEs24`

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

### V15 · `sandbox-muestra` · s3m2 · YouTube `z9OLiWCphso`

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

### Plantilla para el siguiente

`### Vn · <slug> · <lección> · YouTube <id>`: lección `ruta:línea`; adversario (`video/<slug>/video.json:línea`);
canon nuevo, un punto por dato con su `ruta:línea`; y en §5, lo que choque.

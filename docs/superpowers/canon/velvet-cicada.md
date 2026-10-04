# Canon de «Operación VELVET CICADA» (GCTI)

Registro único de los datos ficticios de la campaña GCTI: la intrusión contra Meridian Dynamics que continúan
las lecciones, los laboratorios y los vídeos. Estado a 2026-10-04 (vídeos publicados: V3, V4, V7, V8 y V9).

## 1. Cómo se usa

- Léelo entero antes de escribir un guion de VELVET CICADA. Lo que no está aquí no existe todavía: si el guion
  lo necesita, se decide con Lidia y se apunta aquí.
- El revisor de exactitud compara cada guion nuevo con este archivo, dato a dato, y cita la línea que choca.
- Cada vídeo, al producirse, añade su «canon nuevo» (lo que solo sale en pantalla) en §7.
- Si un vídeo publicado muestra en pantalla algo distinto de lo que dice este archivo, manda la pantalla: se
  corrige aquí y se anota en §5.

Notas de lectura: todas las rutas son relativas a la raíz del repositorio. `video/pivot-infra/out/*` está
ignorado por git y solo existe en la copia principal (`D:\LLM projects\TICourse`), no en los worktrees.
`[V3]` y `[V4]` marcan datos que están en pantalla en un vídeo publicado. Las rutas de Windows se escriben como
se ven en la app (una barra); en los `.ts` van escapadas (`\\`).

## 2. Cronología

«sin zona» = la fuente no dice UTC. No ordenes esas filas contra las UTC como si fueran la misma hora.
Los rangos y las duraciones van como rangos; no tienen fecha exacta.

| Fecha y hora | Evento | Qué pasa | Fuente |
|---|---|---|---|
| 2025-11-03 | — | `first_seen` del intrusion set GLASS VIPER (STIX) | `src/data/s4.ts:1018` |
| nov-2025 → mar-2026 (rango) | — | Ventana de actividad del Cluster-A (Meridian) | `src/data/s4.ts:732` |
| 2025-11-18 | — | Se registra `update-svc-cdn.com` en NameFlow LLC [V4] | `video/pivot-infra/src/scenes/S07Whois.tsx:15-18` |
| 2025 (sin día) | — | Ficha WHOIS histórica del C2 con `kazuo.tanji@protonmail.com` | `src/data/s2.ts:574-575`; `video/pivot-infra/src/scenes/S07Whois.tsx:141` |
| 2026-01 | — | Variante anterior del loader (ssdeep 94 % similar) | `src/data/s3.ts:330` |
| 2026-02-11 | — | pDNS: `update-svc-cdn.com` → `185.220.x.x`, first seen [V4] | `video/pivot-infra/src/scenes/S03Pdns.tsx:63-65` |
| 2026-02-19 | — | Compile time de la muestra (la lección avisa: puede estar falseado) | `src/data/s3.ts:331` |
| 2026-02-27 14:03:11Z | — | Se registra `cdn-sync-status.example` | `src/data/s3.ts:763` |
| 2026-02-27 14:22:08 (sin zona) | — | pDNS first seen de `cdn-sync-status.example` en `203.0.113.27` | `src/data/s3.ts:775` |
| 2026-02-27 | — | `first_seen` de la campaña STIX «PO-REVISION phishing wave» | `src/data/s4.ts:1026-1028` |
| 2026-03-01 09:40:51 → 10:02:13 (sin zona) | — | `cdn-sync-status.example` pasa de `203.0.113.27` a `198.51.100.84` («la primera IP se quemó») | `src/data/s3.ts:775-776,780` |
| 2026-03-02 09:14 → 09:32 (sin zona) | Víctima 1 (s2m4) | Correo «PO revision» a `j.alvarez@meridian.example`; cae `winhlp.exe`; beacon | `src/data/s2.ts:872-875` |
| 2026-03-02 09:41 UTC | Delivery | Spearphish «Candidatura - Ingeniero de propulsion» a RR. HH. | `src/data/s2.ts:68-74` |
| 2026-03-02 09:44:12 → 09:45:02 (sin zona, «mismo dia») | Exploitation → C2 | En ENG-WS-041: LNK, PowerShell, `winhlp.exe`, tarea programada, primer beacon | `src/data/s2.ts:76-83` |
| 2026-03-04 22:10 (sin zona) | AoO (s2m4) | Staging en `C:\Windows\Temp\~tmp4421.cab` | `src/data/s2.ts:876` |
| 2026-03-05 01:47 (sin zona) | AoO (s2m4) | Salen 1,2 GB hacia `transfer-cdn-eu.example` | `src/data/s2.ts:877` |
| 2026-03-05 02:11:47Z | antes de E7 [V3] | PROC_START de `C:\ProgramData\UpdSvc\updsvc.exe`; FILE_HASH `9f3a...e1` | `video/diamond-e7/src/data/s03-victim.ts:25-32` |
| 2026-03-05 02:11:49Z | antes de E7 [V3] | PIPE_CREATE `\\.\pipe\vc_pipe_3a7f09c1` | `video/diamond-e7/src/data/s03-victim.ts:36-38` |
| 2026-03-05 02:13 UTC | **E7** (C2) | Beacon HTTPS a `update-svc-cdn.com`; salta la alerta del SOC; informe MER-2026-019 | `src/data/s2.ts:559,564-566`; `video/diamond-e7/src/scenes/S01Hook.tsx:196-197` |
| 2026-03-05 02:13:02Z y 02:14:01Z | E7 [V3] | Dos NET_CONN a `update-svc-cdn.com:443` | `video/diamond-e7/src/data/s03-victim.ts:42-45` |
| 2026-03-07 (sin hora) | **E9** (AoO) | Mismo implante y metodología, dos días después de E7 [V3] | `src/data/s2.ts:623`; `video/diamond-e7/src/scenes/S10Thread.tsx:80-84` |
| 2026-03-07 | — | pDNS: last seen de `update-svc-cdn.com` en `185.220.x.x` [V4] | `video/pivot-infra/src/scenes/S03Pdns.tsx:66` |
| 2026-03-09 08:05 → 08:23 (sin zona) | Víctima 2 | Orbital Components: «PO revision» a `finance@orbital.example`, `msdtcs.exe`, beacon a `portal-auth-check.example` | `src/data/s2.ts:879-883` |
| 2026-03-11 | — | El ISAC aeroespacial publica en una colección TAXII el indicador STIX de `cdn-sync-status.example` (válido hasta 2026-06-25); la TIP de Meridian lo recoge (pull) el 2026-07-02 | `src/data/s3.ts:1053`, `:1063-1070` |
| marzo → mayo 2026 (rango) | — | Exfiltración de diseños de propulsión, según el BLUF | `src/data/s5.ts:312`; `src/data/labs.ts:1016` |
| abr-2026 → hoy (rango) | — | Actividad del Cluster-B (Orbital-2) | `src/data/s4.ts:732` |
| 2026-04-18 desde 06:00 UTC | — | 41 correos de phishing de credenciales a la cadena de suministro | `src/data/s5.ts:56-58` |
| 2026-04-18 09:30Z | — | Indicador STIX «credential-harvest domain» (válido hasta 2026-07-18) | `src/data/s5.ts:600-605` |
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
| `meridian.example` · `mail.meridian.example` | Dominio propio de Meridian y su servidor de correo | `src/data/s2.ts:72,872` |
| ENG-WS-041 | Workstation de ingeniería de propulsión; host de s2m1 y de E7 [V3] | `src/data/s2.ts:76,581-582`; `video/diamond-e7/src/scenes/S01Hook.tsx:227,277` |
| «servidores CAD», «propulsion R&D file server» | Activos que busca el actor | `src/data/s2.ts:539`; `src/data/labs.ts:304` |
| tú, «primera analista CTI» | La protagonista; la ficha el CISO | `src/data/s1.ts:749`; `src/data/tracks.ts:111` |
| el CISO, el consejo (board) | Sin nombre. El CISO pide los PIR; el consejo decide al final | `src/data/labs.ts:57,187` |
| «Laura Iglesias - Talent» `l.iglesias@meridian-careers.com` | Remitente falso del spearphish | `src/data/s2.ts:69` |
| `j.alvarez@meridian.example` | Empleada de Meridian que recibe el «PO revision» | `src/data/s2.ts:872` |
| analistas de RR. HH. | Reciben el spearphish (cuatro buzones); una abre el LNK | `src/data/labs.ts:238,243,319` |
| Orbital Components (`orbital.example`, `finance@orbital.example`) | Proveedor de Meridian; Víctima 2 | `src/data/s2.ts:879-880` |
| «Orbital-2» | Etiqueta del Cluster-B en s4m4 | `src/data/s4.ts:723` |
| tres proveedores de ingeniería con VPN | Proveedores de Meridian con acceso remoto | `src/data/labs.ts:531` |
| «Bright Meridian Software Kft.» | Firmante desconocido de la muestra del sandbox | `src/data/s3.ts:334` |
| NameFlow LLC (IANA ID 9999) · Privacy Guard Services | Registrador y servicio de privacidad del actor | `src/data/s3.ts:766-767` |
| ISAC aeroespacial (`identity--aero-isac-share-0001`) | Fuente del indicador STIX entrante | `src/data/s3.ts:1053,1064` |
| BigVendorCo | Vendor genérico de la frase sesgada del lab4a | `src/data/labs.ts:486` |

Stellar Dynamics también existe, pero es un hallazgo del Lab 3A: ver §4.

### Equipos

| Nombre | Qué hace | Fuente |
|---|---|---|
| SOC de Meridian («SOC · Meridian Dynamics») | Escala E7 y la intrusión del lab2a | `src/data/s2.ts:559`; `src/data/labs.ts:73`; `video/diamond-e7/src/scenes/S01Hook.tsx:183` |
| Meridian CTI (`cti@meridian.example`) | Autor de flash alert, YARA y Sigma | `src/data/s5.ts:47,69,500` |
| IR, IR lead, canal `#ir-hotline` | Respuesta; propone las medidas del lab2c | `src/data/s5.ts:66`; `src/data/labs.ts:96` |
| RR. HH. de Meridian | Destino del spearphish | `src/data/s2.ts:26` |

### Infraestructura

| Dato exacto | Papel | Detalle | Fuente |
|---|---|---|---|
| `update-svc-cdn.com` | C2 del implante (HTTPS 443) | Beacon cada 60 s con jitter | `src/data/s2.ts:29,83,570,578`; `src/data/s3.ts:340` |
| `185.220.x.x` | IP del C2 | Hosting compartido, ~14.000 dominios de terceros [V3][V4] | `src/data/s2.ts:578,591`; `src/data/labs.ts:736-739`; `video/diamond-e7/src/scenes/S09Quality.tsx:36` |
| pDNS de `update-svc-cdn.com` | Historial | `185.220.x.x`, first seen 2026-02-11, last seen 2026-03-07 [V4] | `video/pivot-infra/src/scenes/S03Pdns.tsx:63-66` |
| WHOIS de `update-svc-cdn.com` | Registro | Creado 2025-11-18, NameFlow LLC; hoy Registrante y Email `REDACTED FOR PRIVACY`; ficha «WHOIS histórico · 2025»: Registrante «no consta», email `kazuo.tanji@protonmail.com` [V4] | `video/pivot-infra/src/scenes/S07Whois.tsx:15-19,141-144` |
| `CN=updatesvc` · `SHA1 d4:7e:02…` | Certificado TLS autofirmado del C2 | Visto en 2 IP más: en total tres, `185.220.x.x`, `141.98.6.10` y una tercera sin revelar [V3][V4] | `src/data/s2.ts:579-580`; `video/pivot-infra/src/scenes/parts/s05-cert/bits.tsx:8-12`; `video/pivot-infra/src/scenes/S05Cert.tsx:57-60` |
| `141.98.6.10` | VPS dedicado, muy pocos inquilinos | `pdns ip`: «3 dominios han resuelto a esta IP» [V4] | `src/data/labs.ts:664-667`; `video/pivot-infra/src/scenes/parts/s05-cert/PdnsConsole.tsx:84-85,123` |
| `meridian-sso-portal.com` | Portal falso de login de Meridian (phishing), en `141.98.6.10` | Nodo de partida del Lab 3A [V4] | `src/data/s1.ts:86`; `src/data/labs.ts:648-651`; `video/pivot-infra/src/scenes/parts/s05-cert/PdnsConsole.tsx:160` |
| `cdn-sync-status.example` · `mx1.cdn-sync-status.example` | Entrega: relay del correo de s2m1, dominio de phishing (s3m4), harvest de credenciales (abril) | Canon de P4 | `src/data/s2.ts:70-71,89`; `src/data/s3.ts:754`; `src/data/s5.ts:58`; `docs/superpowers/plans/2026-09-25-lesson-videos.md:623` |
| WHOIS de `cdn-sync-status.example` | Registro | Creación 2026-02-27T14:03:11Z, expira 2027-02-27; NameFlow LLC; `proxy-7f3a21@privacyguard.example`; `NS1.FASTPARK-DNS.EXAMPLE`, `NS2.FASTPARK-DNS.EXAMPLE` | `src/data/s3.ts:760-770` |
| `203.0.113.27` → `198.51.100.84` | IP de `cdn-sync-status.example` | La segunda es hosting compartido (300+ dominios) en s4m4 | `src/data/s3.ts:775-776`; `src/data/s4.ts:731` |
| `meridian-careers.com` | Dominio verosímil del `From` del spearphish | | `src/data/s2.ts:69,89` |
| `ocsp-verify-node.example` | Segundo C2 (fallback) de la muestra | | `src/data/s3.ts:341,348` |
| `transfer-cdn-eu.example` | Destino de la exfiltración de Víctima 1 | | `src/data/s2.ts:877` |
| `portal-auth-check.example` | C2 de Víctima 2 (Orbital) | | `src/data/s2.ts:883` |
| `time.windows.com`, `ctldl.windowsupdate.com`, `www.msftconnecttest.com` | Ruido legítimo de Windows en el sandbox | No son del actor | `src/data/s3.ts:342-344` |
| certificado de CT `f2:8c:37…` | Recién emitido para un dominio que «imita a Meridian»; nombre tapado entero [V4] | | `video/pivot-infra/src/scenes/S06Ct.tsx:437-438,467` |
| cinco dominios hermanos | Lote con el mismo patrón y el mismo día, dormidos, todos tapados [V4] | | `video/pivot-infra/src/scenes/S09Preblock.tsx:35`; `video/pivot-infra/out/script-notes.md:66-67` |

Documentos del caso: informe MER-2026-019 (E7, `src/data/s2.ts:564`), informe de sandbox MER-2026-023
(`src/data/s3.ts:326`), referencia interna MER-2026-011 (`src/data/s5.ts:69,503,536`), flash alert
MER-FA-2026-014 (`src/data/s5.ts:47`), campaña STIX «PO-REVISION phishing wave» (`src/data/s4.ts:1026`).

Ficha completa de E7 (`src/data/s2.ts:565-587`): KC phase Command & Control, Result `success`, Direction
`victim → infrastructure`, Methodology «beacon HTTPS, jitter 60s», Resources «hosting, dominio, cert TLS»
(`src/data/s2.ts:567-571`); en V3 igual, con la dirección dibujada como flecha
(`video/diamond-e7/src/scenes/S06Meta.tsx:27-32`).

### Capacidades

| Dato exacto | Qué es | Fuente |
|---|---|---|
| implante GLASS VIPER, «stage-1 loader» | La capability de E7 [V3] | `src/data/s2.ts:576`; `video/diamond-e7/src/scenes/S03Victim.tsx:316` |
| SHA-256 `9f3a...e1` = `9f3a2c...e1` | Hash del implante de E7; es la misma muestra del sandbox | `src/data/s2.ts:577`; `src/data/s3.ts:328`; `docs/superpowers/plans/2026-09-25-lesson-videos.md:620` |
| Imphash `1b8d4f2a...` | Comparte tabla de imports con 3 muestras previas | `src/data/s3.ts:329` |
| ssdeep `3072:Ab9..:Xk2` | 94 % similar a la variante de 2026-01 | `src/data/s3.ts:330` |
| PDB `D:\proj\cicada\loader\Release\ldr.pdb` | Ruta canónica (P4) | `src/data/s2.ts:874,882`; `src/data/s3.ts:332`; `src/data/s5.ts:510`; `src/data/labs.ts:294,772` |
| `MapViewOfSection`, `CreateNamedPipeA`, `CreateProcessA` | Imports de la muestra | `src/data/s3.ts:333` |
| named pipe `vc_pipe_%08x` | Formato propio; instancias `vc_pipe_4f8a1c9e` (sandbox) y `vc_pipe_3a7f09c1` (E7) [V3] | `src/data/s2.ts:577`; `src/data/s3.ts:337`; `video/diamond-e7/src/data/s03-victim.ts:38` |
| `schtasks /create /tn WindowsUpdateCheck /tr C:\ProgramData\winhlp.exe /sc onlogon` | Persistencia | `src/data/s2.ts:81-82,1167`; `src/data/s3.ts:338` |
| `winhlp.exe` (`C:\ProgramData\winhlp.exe`) | Loader según las lecciones (canon P4) | `src/data/s2.ts:80,873`; `docs/superpowers/plans/2026-09-25-lesson-videos.md:621` |
| `winhlp.exe   SHA-256 4c81...b3` | Hash del loader en el árbol de s2m5 | `src/data/s2.ts:1165,1354` |
| `C:\ProgramData\UpdSvc\updsvc.exe`, `signed=false` | Binario del implante en E7 [V3] | `video/diamond-e7/src/data/s03-victim.ts:29,32` |
| `msdtcs.exe` | Loader en Orbital (Víctima 2) | `src/data/s2.ts:881` |
| `wcssvc.exe -decode a.txt payload.bin` | `certutil` renombrado (`OriginalFileName` CertUtil.exe) | `src/data/s2.ts:1161-1162`; `src/data/s5.ts:555` |
| `powershell.exe -nop -w hidden -enc SQBFAFgAKA...` | Ejecución tras abrir el LNK | `src/data/s2.ts:79,1158` |
| `CV_Ingeniero.zip` con `CV_Ingeniero.pdf.lnk` | Artefacto de entrega | `src/data/s2.ts:74`; `src/data/labs.ts:228` |
| mutex único (sin nombre) | Otro artefacto del loader | `src/data/s3.ts:310` |
| `GLASSVIPER_Loader_MemMap` · `$op = { 6A 40 68 00 30 00 00 }` | Regla YARA de la lección | `src/data/s5.ts:497,509` |
| «GLASS VIPER Staging via Renamed Certutil» | Regla Sigma, id `4b8d2f6a-9c31-4e02-b7aa-meridian0042` | `src/data/s5.ts:531-532` |
| T1059.001 · T1140 · T1053.005 · T1071.001 | Técnicas ATT&CK del árbol de s2m5 | `src/data/s2.ts:1159,1163,1168,1173` |
| canal secundario por API de almacenamiento en la nube | C2 de respaldo del lab2a | `src/data/labs.ts:258` |
| cuenta VPN de proveedor comprometida · webshell en el portal del proveedor | Evidencia del lab2b | `src/data/labs.ts:329,334` |

Los strings y muestras del Lab 3B (`vc_stage2.bin`, `VC_Loader_v1.dll`, `VC_Loader_v2.dll`…) están en §4.

### Actores

| Nombre | Qué es | Fuente |
|---|---|---|
| VELVET CICADA | Núcleo del grupo; intrusion set de espionaje contra el programa de propulsión; adversario de S5 | `src/data/course-gcti.ts:93-97`; `src/data/s3.ts:1048`; `src/data/s5.ts:312` |
| «VC» | Firma de quien compra el acceso inicial (dossier de S1) | `src/data/course-gcti.ts:21` |
| EMBER FOX | Célula de acceso inicial, spearphishing; adversario de S1 | `src/data/course-gcti.ts:17-19` |
| GLASS VIPER | Operadores de intrusión (S2); también nombre del implante y de un intrusion set STIX (ver §5) | `src/data/course-gcti.ts:36-38`; `src/data/s2.ts:576`; `src/data/s4.ts:1016` |
| HOLLOW LANTERN | Equipo de infraestructura del adversario; adversario de S3 | `src/data/course-gcti.ts:55-57` |
| PAPER CRANE | Célula de engaño: siembra false flags; adversario de S4. Ficha en pantalla: «célula de engaño · siembra pistas falsas» [V9] | `src/data/course-gcti.ts:74-76`; `src/data/labs.ts:149`; `video/ach-matriz/src/data/s03-supuestos.ts:7` |
| `kazuo.tanji@protonmail.com` | Email de registro; sería el *operator* si el pivote confirma. El *customer* sigue sin conocerse | `src/data/s2.ts:575,591` |
| horario laboral UTC+8 | Patrón del operador; baja diagnosticidad | `src/data/labs.ts:324,907` |
| `resource_level: organization` · `primary_motivation: organizational-gain` | Perfil STIX de GLASS VIPER | `src/data/s4.ts:1019-1020` |
| Cluster-A (Meridian) frente a Cluster-B (Orbital-2) | Se mantienen separados | `src/data/s4.ts:722-737` |

Qué adversario habla en cada vídeo: el de la sección de la lección (`video.json` → `adversary`). V3 usa GLASS
VIPER (`video/diamond-e7/video.json:8`) y V4 HOLLOW LANTERN (`video/pivot-infra/video.json:8`). V9 estrena a PAPER
CRANE (`video/ach-matriz/video.json:8`) con otra voz: `sapi/Microsoft Laura` con el efecto `machine`, en lugar de
Pablo (`video/ach-matriz/narration.json:11-15`).

Mensajes interceptados publicados. Son canon de la voz del adversario; un guion posterior no debe contradecirlos:

| Adversario | Mensaje | Fuente |
|---|---|---|
| GLASS VIPER | «Dibuja tu diamante. Siempre te faltará una esquina: la mía.» | `video/diamond-e7/narration.json:66` |
| GLASS VIPER | «Llámame GLASS VIPER, si te consuela. Mi nombre no lo sabrás.» | `video/diamond-e7/narration.json:142` |
| GLASS VIPER | «Sígueme por la IP. Tengo catorce mil vecinos deseando conocerte.» | `video/diamond-e7/narration.json:282` |
| GLASS VIPER | «Bloquea mi hash. Así ya no me volverás a ver.» | `video/attack-piramide/narration.json` (s04-01) |
| HOLLOW LANTERN | «Mis certificados me los firmo yo. Nadie más tiene uno igual.» | `video/pivot-infra/narration.json:189` |
| HOLLOW LANTERN | «Mi WHOIS está tapado. Privacidad, analista. Búscate otro hobby.» | `video/pivot-infra/narration.json:277` |
| HOLLOW LANTERN | «¿Por qué no vienes a verme? Mi servidor te está esperando.» | `video/pivot-infra/narration.json:381` |
| HOLLOW LANTERN | «Ese dominio lo tiré hace meses. Ya no te sirve para nada.» | `video/stix-isac/narration.json:99` (s03-02) |
| PAPER CRANE | «Fíate de lo que ves, analista. Las pruebas nunca mienten.» | `video/ach-matriz/narration.json:89` (s03-01) |
| PAPER CRANE | «Cuenta las que te dan la razón. La que más sume, gana.» | `video/ach-matriz/narration.json:277` (s07-01) |
| PAPER CRANE | «Si una prueba es falsa, se te cae todo. Empieza de cero.» | `video/ach-matriz/narration.json:329` (s08-01) |

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
   (`src/data/s2.ts:80-83`) con SHA-256 `4c81...b3` en s2m5 (`src/data/s2.ts:1165,1354`); E7 usa `9f3a...e1`
   (`src/data/s2.ts:577`; `src/data/s3.ts:328`); V3 enseña `C:\ProgramData\UpdSvc\updsvc.exe` con `9f3a...e1`
   [V3] (`video/diamond-e7/src/data/s03-victim.ts:29-32`); el Lab 3B llama a la variante de Meridian
   `VC_Loader_v1.dll` (`src/data/labs.ts:816-819`). P4 dejó el `4c81...b3` sin tocar a propósito
   (`docs/superpowers/plans/2026-09-25-lesson-videos.md:626`).
   **Resuelto en parte por V7** (§7): las dos fotos son del mismo equipo, `winhlp.exe` con `4c81...b3` el 2-3 y
   `UpdSvc\updsvc.exe` con `9f3a...e1` el 5-3, y se leen como dos compilaciones del mismo loader (lectura del
   caso, dicha con cautela, no demostrada en pantalla). Siguen abiertos el nombre `VC_Loader_v1.dll` del Lab 3B y
   cuántas muestras comparten PDB (punto 11). Ojo: la muestra del sandbox con `9f3a2c...e1` crea la misma tarea
   `WindowsUpdateCheck` (`src/data/s3.ts:338`), así que entre las dos fotos cambian el hash, el nombre y la carpeta
   del ejecutable, no el nombre de la tarea.
2. **¿Firmada o no?** La muestra del sandbox está firmada por «Bright Meridian Software Kft.»
   (`src/data/s3.ts:334,533`); V3 muestra `signed=false` para el mismo hash [V3]
   (`video/diamond-e7/src/data/s03-victim.ts:32`). El plan dice que es la misma muestra
   (`docs/superpowers/plans/2026-09-25-lesson-videos.md:620`).
3. **Intervalo del beacon.** 60 s en `src/data/s2.ts:83,236,570` y `src/data/s3.ts:340`, y [V3]
   `video/diamond-e7/src/scenes/S06Meta.tsx:31`; 90 s en el lab2a (`src/data/labs.ts:253`).
4. **Vector de entrada.** Spearphish del CV a RR. HH. el 2026-03-02 09:41 UTC (`src/data/s2.ts:68-74`) frente a
   correo «PO revision» a `j.alvarez@` ese mismo día a las 09:14, sin zona (`src/data/s2.ts:872`), frente a cuenta
   VPN de proveedor (`src/data/labs.ts:329`) y «supplier portals» en el BLUF (`src/data/s5.ts:312`;
   `src/data/labs.ts:1016`). Las horas de s2m4 no llevan zona horaria (`src/data/s2.ts:872-883`).
5. **Quién abre el LNK.** Una analista de RR. HH. (`src/data/labs.ts:238,243`; `src/data/s2.ts:26`), pero la
   cadena ocurre en ENG-WS-041, workstation de ingeniería (`src/data/s2.ts:76,582`).
6. **Cuál es «el dominio del phishing».** `meridian-sso-portal.com` es «el dominio del phishing inicial»
   (`src/data/labs.ts:648-651`); `cdn-sync-status.example` es «el dominio de phishing de la campaña»
   (`src/data/s3.ts:754`) y el relay del correo de s2m1 (`src/data/s2.ts:70-71,89`).
7. **Exfiltración.** 1,2 GB a `transfer-cdn-eu.example` tras staging en `.cab` (`src/data/s2.ts:876-877`) frente a
   650 MB a un servicio de ficheros tras staging en RAR bajo `C:\ProgramData\tmp` (`src/data/labs.ts:268,273,1037`).
   Además, en s2m4 sale el 2026-03-05 a las 01:47, antes de E7 (C2, `src/data/s2.ts:566`), mientras que E9, el
   evento de Actions on Objectives, es del 2026-03-07 (`src/data/s2.ts:623`; [V3]
   `video/diamond-e7/src/scenes/S10Thread.tsx:81`).
8. **Duración de la operación.** «6 meses de acceso» (`src/data/s4.ts:429`; `src/data/labs.ts:883,919`) y
   exfiltración «between March and May» (`src/data/s5.ts:312`) frente a la actividad del Cluster-A
   «nov-2025 → mar-2026» (`src/data/s4.ts:732`) y la ola de phishing del 2026-04-18 (`src/data/s5.ts:47-58`).
   V9 enseña «6 meses» en pantalla tal cual, sin fechas, así que hereda el hueco [V9]
   (`video/ach-matriz/src/data/matrix.ts:48`; `video/ach-matriz/src/scenes/parts/Whiteboard.tsx:26`).
9. **Qué es GLASS VIPER.** Operadores de intrusión (`src/data/course-gcti.ts:36-40`); implante/loader
   (`src/data/s2.ts:576`; `src/data/s3.ts:62,326`; `src/data/s5.ts:491`); intrusion set STIX y grupo de vendor
   (`src/data/s4.ts:814,1016,1048`). VELVET CICADA también es «intrusion set» (`src/data/s3.ts:1048`;
   `src/data/s5.ts:312`). V3 lo explica como nombre de seguimiento del implante y quien lo usa [V3]
   (`video/diamond-e7/narration.json:139`).
   **Lectura que usa V8** (2026-10-03, decisión de Lidia: no se renombra el intrusion set STIX de S4,
   `src/data/s4.ts:1016`): GLASS VIPER es el loader y el nombre que usan los vendors y el ISAC; VELVET CICADA es el
   intrusion set en el modelo de Meridian, el que «uses» ese loader en su grafo.
10. **«Tres C2» con el mismo certificado** (`src/data/s2.ts:841`; `src/data/labs.ts:314`) frente a las tres IP de
    V4: el C2, el VPS del phishing `141.98.6.10` y una desconocida [V4]
    (`video/pivot-infra/src/scenes/S05Cert.tsx:57-60`).
11. **Muestras con el mismo PDB.** Tres (`src/data/course-gcti.ts:40`) frente a dos loaders
    (`src/data/s2.ts:840,874,882`) frente a solo la variante 1 del Lab 3B (`src/data/labs.ts:775,826`).
12. **Inquilinos de `185.220.x.x`.** «hundreds» en la explicación de un check (`src/data/s2.ts:617`) frente a
    ~14.000 (`src/data/s2.ts:591`; `src/data/labs.ts:739`; [V3] `video/diamond-e7/src/scenes/S09Quality.tsx:36`).
13. **IP del relay.** El correo sale de `mx1.cdn-sync-status.example (203.0.113.27)` el 2026-03-02
    (`src/data/s2.ts:71-72`), pero el pDNS dice que el dominio dejó esa IP el 2026-03-01 (`src/data/s3.ts:775-776,780`).
    Es un subdominio, así que puede no chocar, pero nadie lo explica.
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
    el MER-2026-019 de E7 (`src/data/s2.ts:564`) y el MER-2026-023 del sandbox (`src/data/s3.ts:326`).
18. **Opción mala del Lab 5B con otros datos.** «On 14 March … WKS-0211» (`src/data/labs.ts:1011`) frente a
    2 de marzo y ENG-WS-041 (`src/data/s2.ts:68,76`). Es una opción incorrecta por estilo, no por datos.
19. **Paso de `certutil`.** El árbol de s2m5 dice ser el host de s2m1 e incluye `wcssvc.exe`
    (`src/data/s2.ts:1151,1161`); la cadena de s2m1 no lo tiene (`src/data/s2.ts:79-80`).
20. **TLD mezclados.** Dominios del actor en `.com`/`.net` (`src/data/s2.ts:29`; `src/data/labs.ts:688,696`) y en
    `.example` (`src/data/s2.ts:877,883`; `src/data/s3.ts:341,760`).
21. **Brief frente a pantalla (resuelto por la pantalla).** El brief de V4 proponía un lookalike de CT con nombre
    parcial (`video/pivot-infra/out/scene-brief.md:52-53`); el vídeo lo tapa entero [V4]
    (`video/pivot-infra/src/scenes/S06Ct.tsx:436-437`).
22. **Resto de P4 sin tocar.** El PDB genérico `C:\Users\kaz\dev\stage2\bin\release\st2.pdb` de una pregunta de
    s3m2 es de otro binario (`src/data/s3.ts:397`; `docs/superpowers/plans/2026-09-25-lesson-videos.md:627`).

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

## 7. Vídeos publicados y su canon nuevo

Aquí se añade un bloque por vídeo cuando se produce: los datos que solo existen en pantalla.

### V3 · `diamond-e7` · s2m3 · YouTube `rwMIu0XBoWQ`

Lección `src/data/s2.ts:594-596`; adversario de los interceptados GLASS VIPER (`video/diamond-e7/video.json:8`).
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

Lección `src/data/s2.ts:1097` (bloque `youtube` entre el párrafo de la escalera de abstracción y el primer check del
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
  programada no inventariada», `src/data/s2.ts:1179`), pasada por toda la cadena del 2-3, salta en la línea de la
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
  STIX de S4 (`src/data/s4.ts:1013-1021`), la campaña «PO-REVISION phishing wave» y `attributed-to`; el indicador
  propio de Meridian para este dominio (`src/data/s5.ts:596-607`) y la ola de phishing del 18-4.

### V9 · `ach-matriz` · s4m3 · YouTube `TjVViiBTeds`

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
  (`src/data/s4.ts:722-737`). Nada del Lab 3A, del Lab 3B ni del final de la campaña.

### Plantilla para el siguiente

`### Vn · <slug> · <lección> · YouTube <id>`: lección `ruta:línea`; adversario (`video/<slug>/video.json:línea`);
canon nuevo, un punto por dato con su `ruta:línea`; y en §5, lo que choque.

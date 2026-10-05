# Canon · Operación GLASS HARBOR (Autoridad Portuaria de Halden)

Registro de los hechos fijos del incidente de Halden que cuentan los vídeos de Security+ y sus lecciones.
Última revisión: 2026-10-04 (SIEM, V1, V2, V5, V5b, V6 y las lecciones `sp1`–`sp5`; el spraying de sp2m7 pasa al 21-10).

## 1. Cómo se usa

- Léelo entero antes de escribir un guion de Halden. Quien revisa la exactitud contrasta el guion nuevo con este archivo.
- Cada vídeo que se produzca añade aquí su «canon nuevo» (horas, equipos, cuentas, IP) al cerrarse, con su `ruta:línea`.
- Si este archivo y la pantalla de un vídeo publicado no coinciden, **manda la pantalla**: se corrige aquí y se anota en §5.
- Lo que solo está en planes o notas no es canon hasta que salga en pantalla o en voz (lista aparte en §5).

**Rutas** (relativas a la raíz del repo): `siem/` = `video/siem/` · `v1/` = `video/capas-halden/` ·
`v2/` = `video/forense-adquisicion/` · `v5/` = `video/ir-halden/` · `v5b/` = `video/ir-halden-pruebas/` · `v6/` = `video/iam-halden/` · `eng/` = `video/engine/` · `sp/` = `src/data/secplus/` ·
`plan` = `docs/superpowers/plans/2026-09-25-lesson-videos.md` · `notas-v1` = `D:\LLM projects\TICourse\video\capas-halden\out\script-notes.md`
(fuera de git, checkout principal) · `notas-v5` = `v5/out/script-notes.md` (fuera de git) · `notas-v5b` = `v5b/out/script-notes.md` (fuera de git) · `notas-v6` = `v6/out/script-notes.md` (fuera de git). «(deducido)» = cálculo propio, no lo dice ninguna fuente.

**Vídeos de Halden**

| Vídeo | Lección | Dónde está | Qué parte del caso cuenta |
|---|---|---|---|
| SIEM «SIEM en acción» | sp4m6 | MP4, `sp/sp4-part3.ts:450-457` | la madrugada del 4-9: 01:52 y los 38 GB, triaje y cuarentena |
| V1 «Defensa en capas» | sp4m7 | YouTube `GfjE0lP2H0s`, `sp/sp4-part4.ts:173-178` | la tarde del 3-9: correo, capas, caza, aislamiento |
| V2 «Adquisición forense» | sp4m11 | MP4, `sp/sp4-part6.ts:93-100` | de las 04:12 del 4-9 al análisis del 5-9 (11:20): incautación, imagen, custodia |
| V5 «Respuesta a incidentes» | sp4m10 | YouTube `S_nVqWYkKXM`, `sp/sp4-part5.ts:353-359` | 4-9 a mediodía y la reunión del 11-9 |
| V5b «Antes del próximo incidente» | sp4m10 | YouTube `vlJ9FRtSIlM`, `sp/sp4-part5.ts:406-412` | octubre: la mesa del 2-10, el simulacro del 8-10 y la caza del 13-10 |
| V6 «Identidad y acceso» | sp4m8 | YouTube `It1DrWKbFe4`, `sp/sp4-part4.ts:464-475` | octubre: la revisión de accesos del 19-10, la jubilación del 23-10, la bóveda del 27-10 y el préstamo del 28-10 |

## 2. Cronología del incidente

Horas en CEST. 2026-09-03 es jueves y 2026-09-11 viernes (deducido, calendario).

| Fecha y hora | Qué pasa | Quién / qué equipo | Fuente |
|---|---|---|---|
| ≈ 20-8 (deducido: «dos semanas» antes del triaje) | Ajuste del SIEM: 6.000 avisos/día pasan a 400; exclusión EXC-01 | SOC; aprueba R. Salas | `siem/narration.json:197`, `siem/src/data/s07-tuning.ts:53-58`, `sp/sp4-part3.ts:448` |
| 2026-09-01 · 23:00 | Copia nocturna de `srv-tc-app03` (la más antigua de las tres) | `srv-tc-app03` | `v5/src/data/s07-recovery.ts:23` |
| ≈ 2026-09-01 (deducido: «hace dos días») | Se registra `cdn-halden-sync.example` | atacante | `v1/narration.json:145` |
| 2026-09-02 · 23:00 | Copia de `srv-tc-app03` que luego se restaura | `srv-tc-app03` | `v5/src/data/s07-recovery.ts:24`, `v5/narration.json:294` |
| 2026-09-03 · tarde (sin hora) | Llega a Lucía «Turnos de atraque — actualización muelle 3», De `haldenport.example`; SPF y DKIM pasan con `hdn-mailer.example`, DMARC falla y la política es `p=none` | Lucía · Operaciones · sala de control del muelle 3 | `v1/src/scenes/S01Hook.tsx:75`, `v1/src/scenes/S02Spoof.tsx:92-95`, `:141-155`, `v1/src/scenes/S03Dmarc.tsx:316` |
| 3-9 · tarde, antes de 16:04 | Abre `turnos_muelle3.docm` y habilita la macro; PowerShell pide `cdn-halden-sync.example` y el filtro DNS no lo resuelve; el malware sale a la IP fija `203.0.113.77:443` por la regla 3 | `OPS-WS-14` | `v1/narration.json:133`, `:145-163`, `:191`, `v1/src/scenes/S04Dns.tsx:9-10` |
| 3-9 · 16:04 | El EDR ve `WINWORD.EXE` → `cmd.exe` → `powershell.exe -enc` y la conexión 443 | `OPS-WS-14`, Lucía | `v1/src/data/s07-edr.ts:11-24` |
| 3-9 · entre 16:04 y 16:11 (sin hora) | Caza en los equipos con agente (hash, dominio, patrón): 2 aciertos más | `OPS-WS-08`, `ADM-WS-02` | `v1/src/data/s08-scope.ts:8-10`, `:17-21`, `v1/narration.json:297-303` |
| 3-9 · antes de 16:11 (sin hora) | Ya ha salido la credencial de una cuenta de servicio; nadie lo sabe | (sin equipo en pantalla) | `v1/narration.json:361` |
| 3-9 · 16:09 | Se declara `IR-2026-0147`, gravedad ALTA, notificado | SOC | `v5/src/data/s02-board.ts:21-24`, `v5/src/scenes/parts/Board.tsx:62` |
| 3-9 · 16:11 | El EDR aísla el portátil sin apagarlo; motivo «Proceso sospechoso + conexión C2 (EDR)»; responsable «Analista de turno · SOC» | `OPS-WS-14` | `v1/src/data/s09-isolate.ts:11-15`, `v5/src/data/s03-scope.ts:20` |
| 3-9 · 16:15 | El EDR aísla `OPS-WS-08`, encendido; se marca Contención | `OPS-WS-08` | `v5/src/data/s03-scope.ts:21`, `v5/src/scenes/parts/Board.tsx:62` |
| 3-9 · desde 16:15 | `ADM-WS-02` sigue sin aislar: «responsable sin localizar», «nadie de guardia podía autorizarlo» | `ADM-WS-02` | `v5/src/data/s04-key.ts:9-12` |
| 3-9 · sin hora | Se retira la regla 3 (`ALLOW any any tcp/443`) y se añade un deny final con log | cortafuegos | `v1/src/scenes/S05Rules.tsx:22`, `v1/narration.json:209` |
| 3-9 · 21:14 | Sesión remota de `ADM-WS-02` a `ADM-WS-07` (10.20.4.17), que no tiene agente EDR | `ADM-WS-02` → `ADM-WS-07` | `v5/src/data/s04-key.ts:40-51` |
| 3-9 · 23:00 | Copia de `srv-tc-app03` (después se descarta) | `srv-tc-app03` | `v5/src/data/s07-recovery.ts:25`, `:41` |
| 4-9 · 01:52 | Logon 4624 (y 4672) de `svc_tosreport` desde `ADM-WS-07` en `srv-tc-app03` | `ADM-WS-07` → `srv-tc-app03` | `siem/src/data/s09-pivot.ts:32-42`, `v5/src/data/s04-key.ts:55-66` |
| 4-9 · 01:58 | Tarea programada «cada jueves · 23:30» en el servidor y otra igual en la estación | `srv-tc-app03`, `ADM-WS-07` | `v5/src/data/s06-eradicate.ts:10-14`, `:33` |
| 4-9 · 02:00–04:30 | Salen 38 GB a `203.0.113.47:443` (≈ 4,2 MB/s) y la salida termina sola; salta la alarma y nadie la mira | `srv-tc-app03` | `siem/src/data/s08-triage.ts:28-38`, `v5/src/data/s04-key.ts:69-79`, `v5/src/data/s05-order.ts:68` |
| 4-9 · madrugada, antes de 04:12 (sin hora) | Operaciones pide reinstalar el portátil; Asesoría jurídica emite el legal hold; se para la rotación de 30 días de los logs del caso; la regla es volcar la memoria antes de apagar (sin hora ni responsable) | portátil de operaciones | `v2/narration.json:9-33`, `:63`, `v2/src/scenes/S01Hold.tsx:168-169`, `:188`, `:227` |
| 4-9 · 04:12 | Incautación del SSD `HPA-EV-003` en la sala de control, muelle 3; precinto 0091 | M. Aalto; testigo J. Rekola | `sp/sp4-part6.ts:56-62`, `v2/src/data/canon.ts:40`, `v1/src/scenes/S09Isolate.tsx:57` |
| 4-9 · 05:40 | Entrega al laboratorio; `lsblk` del disco | M. Aalto → R. Sandoval | `sp/sp4-part6.ts:63`, `v2/src/scenes/S03Image.tsx:155` |
| 4-9 · 05:41 / 05:44 | SHA-256 del original; empieza `ewfacquire` | R. Sandoval | `sp/sp4-part6.ts:68`, `v2/src/scenes/S03Image.tsx:157-159` |
| 4-9 · 07:58 / 08:02 | `ewfverify` de la imagen: MATCH; nuevo hash del original: MATCH | R. Sandoval | `sp/sp4-part6.ts:69-70`, `v2/src/scenes/S03Image.tsx:163-165` |
| 4-9 · 09:55 | A la caja fuerte del SOC, precinto 0114 | R. Sandoval | `sp/sp4-part6.ts:64` |
| 4-9 · mañana (≈ 10:00, sin hora en pantalla) | Triaje en el SIEM: la analista se asigna la alerta, revisa desde 01:30, descarta «¿copia legítima?», encuentra la 01:52 | la analista (SOC) | `siem/narration.json:197-243`, `siem/src/data/s09-pivot.ts:18`, `:62` |
| 4-9 · mañana, tras el triaje | Cuarentena de `srv-tc-app03` en VLAN restringida, encendido, con «sesión aún abierta» y PCAP grabando; el SOAR la propone y la analista la aprueba; se rota la credencial de `svc_tosreport`; «CASO 0412 · informe de cierre» | `srv-tc-app03` | `siem/src/scenes/parts/s10-contain/Topology.tsx:153`, `:178`, `:217`, `:381`, `siem/src/scenes/parts/s10-contain/Playbook.tsx:53-68`, `siem/src/scenes/parts/s10-contain/Closure.tsx:36-40`, `:99` |
| 4-9 · 10:30 | Se cierra todo de golpe: `ADM-WS-02` y `ADM-WS-07` aisladas, `srv-tc-app03` en cuarentena, contraseña de `svc_tosreport` cambiada; Contención marcada otra vez | SOC | `v5/src/data/s05-order.ts:55-65`, `v5/src/scenes/parts/Board.tsx:62` |
| 4-9 · 12:00 | Sala de crisis de V5 (el «ahora» de V5) | equipo de respuesta | `v5/src/data/s01-hook.ts:94`, `v5/narration.json:56` |
| sin fecha | Erradicación: fuera el programa y las dos tareas; «permiso de macros de Operaciones · retirado»; «regla 3 · confirmada»; búsqueda en todos los equipos, `ADM-WS-07` «ya con agente»: limpia | toda la flota | `v5/src/data/s06-eradicate.ts:31-37`, `:53-58`, `:73`, `v5/narration.json:260` |
| sin fecha | Recuperación de `srv-tc-app03`: memoria y disco ya capturados; se restaura la copia del 2-9; «hash coincide», «Operaciones: manifiestos OK»; vigilancia reforzada 30 días | `srv-tc-app03` | `v5/src/data/s07-recovery.ts:11-14`, `:22-26`, `:51-57` |
| 2026-09-05 · 11:20 | La caja fuerte entrega el SSD para el análisis «sobre la COPIA» | R. Sandoval | `sp/sp4-part6.ts:65`, `v2/src/data/canon.ts:43` |
| 2026-09-10 · 23:30 (deducido) | Primer jueves en que habría arrancado la tarea, ya borrada («Nos vemos el jueves») | — | `v5/src/data/s06-eradicate.ts:13`, `v5/narration.json:229` |
| 2026-09-11 | Reunión de cierre «una semana después»: dos hilos de «¿por qué?» y 6 mejoras | equipo de respuesta | `v5/src/data/s08-rca.ts:22-27`, `v5/src/data/s09-plan.ts:25-32` |
| 18-09 → 31-10 | Plazos de las mejoras (ver §3, casos) | Seguridad, Sistemas, Correo, SOC | `v5/src/data/s09-plan.ts:26-31` |
| 2026-10-02 (viernes) · 09:30 | La mesa (tabletop) en la sala de crisis: seis áreas; caso «03:00 · se cae el correo corporativo · ¿a quién llamas?»; «a la suplente de Seguridad», pero su número solo está en la lista de contactos del plan, dentro del correo | Seguridad, Sistemas, Operaciones, Comunicación, Dirección, Asesoría jurídica | `v5b/src/data/s02-mesa.ts:14-26`, `v5b/narration.json:68-80` |
| 2026-10-05 | Copia de la lista de contactos fuera de banda (papel en la sala y móvil de guardia); la del correo sigue | Seguridad | `v5b/src/data/s02-mesa.ts:35`, `v5b/narration.json:86` («tres días después») |
| 2026-10-08 (jueves) · 22:00–22:11 | El simulacro: la guardia finge un ataque en `ptl-pruebas-02` (VLAN de pruebas) y llama a la suplente; ella pulsa «Aislar equipo» y la consola del EDR responde «Acción no permitida · tu rol no incluye aislar equipos»; lo aísla la analista de guardia «por orden de la suplente»; 11 min | la suplente de Seguridad, la analista de guardia | `v5b/src/data/s03-simulacro.ts:8-35`, `:43-44` |
| 2026-10-09 | Permiso de aislar en la cuenta de la suplente | Seguridad | `v5b/src/data/s03-simulacro.ts:48` |
| 2026-10-13 (martes) | La caza: hipótesis «si vuelve, se moverá como la otra vez: de madrugada, con una cuenta de servicio»; logons de cuentas de servicio de 00:00 a 06:00, desde cualquier equipo, en los 30 días de la central (13-09 a 13-10); «alertas para esta hipótesis: 0» y la regla del SOC del 25-09 con «0 disparos». Resultado: solo tareas conocidas, «sin explicar: 0»; `srv-bascula01` y `srv-accesos01` nunca conectados a la central | SOC (la jugadora, en segunda persona) | `v5b/src/data/s04-caza.ts:43`, `:55-71`, `:85-87`, `v5b/src/data/s05-huecos.ts:17-20`, `:46-99` |
| 2026-10-15 / 2026-10-16 | Regla «cuenta de servicio fuera de su horario, desde cualquier equipo» (SOC, 15-10); conectar `srv-bascula01` y `srv-accesos01` a la central (Sistemas, 16-10) | SOC, Sistemas | `v5b/src/data/s05-huecos.ts:111-119` |
| 2026-10-19 (lunes) | «19-10 · revisión trimestral de accesos» (la de cada trimestre, nunca «la primera»): `c.navarro`, de Comunicación (antes Atención a navieras · 2021 y Facturación · 2023), tiene 11 permisos, 4 de su puesto; su responsable confirma los 4 y se retiran los otros 7, entre ellos «facturas a navieras · emitir» («nadie lo decidió») | `c.navarro`, responsable de Comunicación | `v6/src/data/s02-creep.ts:8-10`, `v6/narration.json` (s02) |
| 2026-10-23 (viernes) · fin de turno | Se jubila `o.virta`, de Importación («la oficina que trata con aduanas»): cuenta «deshabilitada · 23-10 · fin de turno»; buzón, archivos y registros se conservan hasta que lo permita la política de retención. Sin conflicto ni sospecha. Con la cuenta deshabilitada, el IdP no le firma pases para la plataforma aduanera del socio («sin pase: acceso denegado», en condicional: nadie intenta entrar) | `o.virta` | `v6/src/data/s03-leaver.ts:7-16`, `v6/src/data/s04-saml.ts:27-31` |
| sin fecha (como la lección) | El personal del puerto entra en la plataforma aduanera del socio con su cuenta del puerto por SAML: pase «válido: 5 min», «firma: IdP de Halden»; el carril del IdP pide **solo contraseña** | personal del puerto, IdP de Halden | `v6/src/scenes/parts/PassCard.tsx:21-22`, `v6/src/data/s04-saml.ts:11` |
| sin fecha (como la lección) | La app «Planificador de atraques» de un proveedor externo lee el calendario de atraques por OAuth: «alcance: calendario.leer · caduca: 60 min», emitido por el IdP de Halden | proveedor externo | `v6/src/data/s05-oauth.ts:9`, `:41-42` |
| 2026-10-27 (martes) | La mejora de V5 «cuentas de servicio en gestor de contraseñas con rotación · Sistemas · 31-10», «27-10 · hecho»: `svc_tosreport`, `svc_edi` y el resto entran en la «bóveda de Sistemas», que ya guardaba los administradores del dominio («ya estaban»); «¿quién la sabe?: nadie»; rotación «cada 24 h y cada vez que una persona la devuelve». A `svc_tosreport` se le retiran los privilegios especiales (`4672`): «retirados · solo sacaba informes» (deducción de V6) | Sistemas | `v6/src/data/s09-vault.ts:23`, `:37-50`, `v6/src/scenes/parts/LogonCard.tsx:32` |
| 2026-10-28 (miércoles) · 22:00–23:00 | Préstamo just-in-time: «L. Ferrer · Infraestructura» pide «administrador del dominio · motivo: cambio aprobado · ventana: 28-10 · 22:00–23:00»; «aprueba: R. Salas · jefe de sistemas»; credencial válida hasta las 23:00, sesión grabada, cuenta de administración separada de la diaria; a las 23:00 «privilegio retirado · contraseña rotada»; una «copia · 23:05» «ya no sirve» | L. Ferrer, R. Salas | `v6/src/data/s10-jit.ts:14-32` |
| 2026-10-21 (miércoles) · 03:10–03:12 | (Lección sp2m7; V10 en preparación) password spraying desde 192.0.2.157 contra el proveedor de identidad; `LOGIN OK user=r.haugen` a las 03:12:37. Hasta el 2026-10-04 la lección lo fechaba el 4-9, desde 185.22.9.41 | proveedor de identidad | `sp/sp2-part4.ts:65-69` |

Hechos fechados de las lecciones que caen esa semana (fondo, no son el incidente):

| Fecha | Qué | Fuente |
|---|---|---|
| 2026-08-30 / 2026-09-02 | CHG-2041 (certificado `*.halden-port.local`) probado en staging / aprobado en el CAB | `sp/sp1-part3.ts:70-76` |
| 2026-09-01 | Escaneo mensual, 412 activos, FINDING #0147 en `hpa-portal-web-01` | `sp/sp4-part3.ts:53-56` |
| 2026-09-03 | Comité de riesgos: R-014, ransomware en el servidor de planificación de grúas del muelle norte | `sp/sp5-part2.ts:113-114` |
| 2026-09-06 · 02:00–04:00 | Ventana de mantenimiento de CHG-2041 | `sp/sp1-part3.ts:77` |

## 3. Personas, equipos, cuentas, dominios y casos

### Personas

| Nombre | Papel | Dónde aparece |
|---|---|---|
| Lucía | Operaciones, sala de control del muelle 3; sin apellido; abre el adjunto | `v1/src/data/s07-edr.ts:12-13`, `v1/src/scenes/S02Spoof.tsx:92`, `v5/src/data/s01-hook.ts:6`, `sp/sp4-part4.ts:105`, `:170` |
| la analista | SOC, sin nombre, en femenino; triaje y aprobación en el SIEM, orden de volatilidad en V2 | `siem/narration.json:203`, `siem/src/scenes/parts/s10-contain/Playbook.tsx:60`, `v2/narration.json:39` |
| «Analista de turno · SOC» | responsable del aislamiento de 16:11 | `v1/src/data/s09-isolate.ts:15` |
| la jugadora | «la primera analista de seguridad» del puerto | `src/data/tracks.ts:149`, `sp/labs.ts:30` |
| responsable de `ADM-WS-02` | sin nombre; «sin localizar» el 3-9 | `v5/src/data/s04-key.ts:11` |
| M. Aalto | SOC, credencial 2211; incauta el SSD | `sp/sp4-part6.ts:57`, `v2/src/data/canon.ts:24-25` |
| J. Rekola | Asesoría jurídica; testigo | `sp/sp4-part6.ts:57`, `v2/src/data/canon.ts:26-27` |
| R. Sandoval | laboratorio forense | `sp/sp4-part6.ts:63`, `v2/src/data/canon.ts:28`, `v2/narration.json:69` |
| R. Salas | jefe de sistemas; aprobó la exclusión EXC-01; aprueba el préstamo just-in-time del 28-10 | `siem/src/data/s07-tuning.ts:58`, `v6/src/data/s10-jit.ts:20` |
| L. Ferrer | Infraestructura; dueño de CHG-2041; pide el préstamo just-in-time del 28-10 (en voz, «alguien de Infraestructura») | `sp/sp1-part3.ts:71`, `v6/src/data/s10-jit.ts:14` |
| `c.navarro` | Comunicación (antes Atención a navieras y Facturación); en voz, «una compañera de Comunicación»; sus permisos acumulados no son culpa de nadie | `v6/src/data/s02-creep.ts:10` |
| `o.virta` | Importación, «la oficina que trata con aduanas»; usaba la plataforma aduanera del socio; se jubila el 23-10; en voz, «un compañero de Importación» | `v6/src/data/s03-leaver.ts:7` |
| CISO · director de operaciones | cargos sin nombre | `sp/labs-sp4.ts:21`, `sp/sp4-part3.ts:167` |
| Seguridad, Sistemas, Correo, SOC | áreas con mejoras asignadas | `v5/src/data/s09-plan.ts:26-31` |
| la suplente de Seguridad | sin nombre, en femenino; la mejora del 30-09; en la mesa «aislar es cosa mía»; en el simulacro su cuenta no puede aislar (el fallo es del permiso, no de ella) | `v5b/src/data/s02-mesa.ts:26`, `v5b/src/data/s03-simulacro.ts:31-35` |
| la analista de guardia | SOC, sin nombre; aísla `ptl-pruebas-02` por orden de la suplente | `v5b/src/data/s03-simulacro.ts:26` |
| las seis áreas de la mesa | Seguridad, Sistemas, Operaciones, Comunicación, Dirección, Asesoría jurídica | `v5b/src/data/s02-mesa.ts:15` |

### Equipos y servidores

| Nombre | Qué es | En el caso | Fuente |
|---|---|---|---|
| `OPS-WS-14` | portátil de Lucía, «Operaciones · muelle 3» | infectado; aislado 16:11 encendido; incautado 04:12 | `v1/src/data/s07-edr.ts:11-13`, `v1/src/data/s09-isolate.ts:11-14`, `v5/src/data/s03-scope.ts:20` |
| `OPS-WS-08` | Operaciones | acierto de la caza; aislado 16:15 | `v1/src/data/s08-scope.ts:9`, `v5/src/data/s03-scope.ts:21` |
| `ADM-WS-02` | estación de administración, «donde viven las llaves» | acierto de la caza; abierta hasta las 10:30 del 4-9 | `v1/src/data/s08-scope.ts:10`, `v5/src/data/s03-scope.ts:22`, `v5/src/data/s05-order.ts:60` |
| `ADM-WS-07` | estación de administración, 10.20.4.17, «sin agente EDR» | 21:14, 01:52, 01:58; aislada 10:30; luego «ya con agente» | `siem/src/data/s09-pivot.ts:37-39`, `v5/src/data/s04-key.ts:49-51`, `v5/src/data/s06-eradicate.ts:18`, `:73` |
| `srv-tc-app03` | «servidor de la terminal de contenedores», 10.20.8.31 | logon 01:52, salida de 38 GB, cuarentena, restaurado | `siem/src/data/s08-triage.ts:23-25`, `siem/src/scenes/parts/s10-contain/Topology.tsx:303-304`, `v5/src/data/s05-order.ts:10` |
| cortafuegos (7 reglas) | reglas 1–7 con `dns-int.local`, `mail-gw.local`, `gestion.local`, `erp.local`; regla 7 `DENY Operaciones → Internet` | la regla 3 la tapaba | `v1/src/scenes/S05Rules.tsx:20-26` |
| `mx.haldenport.example` | pasarela de correo que firma `Authentication-Results` | — | `v1/src/scenes/S02Spoof.tsx:141` |
| VLAN producción / «VLAN cuarentena (restringida)» | redes del servidor en el SIEM | — | `siem/src/scenes/parts/s10-contain/Topology.tsx:70`, `:153` |
| WB-04 · caja fuerte SOC | bloqueador de escritura · custodia | — | `sp/sp4-part6.ts:58`, `:64` |
| `ptl-pruebas-02` | portátil de pruebas (SIEM); en V5b, el equipo del simulacro, en la «VLAN de pruebas» | aislado a las 22:11 del 8-10 | `siem/src/data/s04-enrich.ts:77`, `v5b/src/data/s03-simulacro.ts:10-11` |
| `srv-bascula01` · `srv-accesos01` | báscula de camiones · control de accesos de la puerta de camiones | «0 registros · nunca conectados» a la central (13-10); se conectan el 16-10. No tienen nada que ver con la salida de los 38 GB ni con la atacante, y no se dice quién los instaló | `v5b/src/data/s05-huecos.ts:69`, `:80`, `:88`, `:111-113` |
| la central (24 servidores) | 22 con registros y 2 nunca conectados el 13-10; con nombre en pantalla solo los que ya envían registros en el SIEM | — | `v5b/src/data/s05-huecos.ts:46-48` |

### Cuentas

| Cuenta | Qué es | Fuente |
|---|---|---|
| `svc_tosreport` | cuenta de servicio; línea base «informes, lunes a viernes 08-18 h»; su único punto fuera de horario es «hoy, 01:52»; credencial rotada / contraseña cambiada el 4-9 | `siem/src/data/s09-pivot.ts:36`, `:60`, `siem/src/scenes/parts/s09-pivot/UbaHeatmap.tsx:277`, `siem/src/scenes/parts/s10-contain/Closure.tsx:36-40`, `v5/src/data/s05-order.ts:63` |
| (ninguna más) | En el alcance del 3-9 no hay ninguna cuenta: aún no se sabía lo de la credencial | `v5/src/data/s03-scope.ts:6` (comentario), `v5/narration.json:110` |
| `svc_tosreport` (desde el 27-10) | en la bóveda de Sistemas, rota cada 24 h y al devolverse; sin privilegios especiales («retirados · solo sacaba informes») | `v6/src/data/s09-vault.ts:37-42`, `v6/src/scenes/parts/LogonCard.tsx:32` |
| `svc_edi` (desde el 27-10) | en la bóveda de Sistemas, sin más relación con el caso (no se liga al aviso de ejemplo del SIEM) | `v6/src/data/s09-vault.ts:37` |

### Dominios, IP y hashes

| Valor en pantalla | Qué es | Fuente |
|---|---|---|
| `haldenport.example` | dominio público del puerto en V1 | `v1/src/scenes/S02Spoof.tsx:94`, `v1/src/scenes/S11Limits.tsx:137` |
| `v=DMARC1; p=none; rua=mailto:dmarc@haldenport.example` | DMARC del puerto el 3-9 | `v1/src/scenes/S03Dmarc.tsx:300`, `:315-319` |
| `v=spf1 ip4:203.0.113.10 -all` | SPF del puerto | `v1/src/scenes/S03Dmarc.tsx:78` |
| `hdn-mailer.example` (DKIM `s=selector1`) | dominio con el que el atacante pasa SPF y DKIM | `v1/src/scenes/S02Spoof.tsx:143`, `:148`, `v1/src/scenes/S03Dmarc.tsx:97` |
| `cdn-halden-sync.example` | C2, registrado hace dos días; bloqueado por el filtro DNS | `v1/src/scenes/S04Dns.tsx:9`, `v1/src/data/s08-scope.ts:19`, `v5/src/data/s06-eradicate.ts:55` |
| `haldenp0rt.example` | ejemplo de dominio parecido | `v1/src/scenes/S11Limits.tsx:149` |
| `vpn.puerto-halden.example`, `portal.puerto-halden.example` | dominios del puerto en el SIEM | `siem/src/data/s08-triage.ts:13`, `:15` |
| `*.halden-port.local` | dominio interno | `sp/sp1-part3.ts:70` |
| `haldenp0rt.com`, `haldenp0rt-mail.com`, `ha1denport.com` | dominios trampa de las lecciones de sp2 | `sp/labs-sp2.ts:186`, `sp/sp2-part2.ts:129`, `:227` |
| `203.0.113.77:443` | IP fija de respaldo del malware del portátil | `v1/src/data/s07-edr.ts:28-31`, `v1/src/scenes/S04Dns.tsx:10` |
| `203.0.113.47:443` | destino de los 38 GB; «bloquear su servidor» | `siem/src/data/s08-triage.ts:29`, `siem/src/data/s09-pivot.ts:44`, `v5/src/data/s04-key.ts:76`, `:113` |
| 10.20.4.17 · 10.20.8.31 · 10.20.0.0/16 | `ADM-WS-07` · `srv-tc-app03` · red interna | `siem/src/data/s09-pivot.ts:39`, `siem/src/data/s08-triage.ts:24`, `siem/src/data/s07-tuning.ts:40` |
| 192.0.2.157 | origen del password spraying del 21-10 (lección; antes 185.22.9.41, que no es de documentación) | `sp/sp2-part4.ts:65` |
| `b41f0e7c…c7a2` | hash del documento (caza de V1 y de V5) | `v1/src/data/s08-scope.ts:18`, `v5/src/data/s06-eradicate.ts:54` |
| `…\Temp\turnos_muelle3.docm` · firma «Microsoft Windows (válida)» | adjunto y contexto del EDR | `v1/src/data/s07-edr.ts:16-17`, `v1/src/scenes/S02Spoof.tsx:121` |
| `-enc JAB3AGMAPQBOAGUAdwAtA…` | PowerShell codificado | `v1/src/data/s07-edr.ts:24` |
| `9f2b7c…41d0` | SHA-256 del SSD y de `HPA-EV-003.E01` | `sp/sp4-part6.ts:68-70`, `v2/src/data/canon.ts:16` |
| `4e81a0…c92f` | hash de la copia rota de V2 s04 (contrafactual, no es del caso) | `v2/src/data/canon.ts:18` |

### Casos y evidencias

| Id | Qué es | Fuente |
|---|---|---|
| `IR-2026-0147` | el caso; «CASO IR-2026-0147» en la pizarra de V5 | `sp/sp4-part6.ts:53`, `v2/src/data/canon.ts:6`, `v5/src/scenes/parts/Board.tsx:59`, `v5/src/Poster.tsx:85` |
| «CASO 0412» | id de la franja de caso en SIEM (S08–S10) y V1 (S08–S09): ver §5 | `eng/src/ui/CaseStrip.tsx:52`, `siem/src/scenes/parts/s10-contain/Closure.tsx:99` |
| `HPA-EV-003` | «SSD 512 GB, portatil de operaciones, S/N 8FQ2ZT3, terminal de contenedores» | `sp/sp4-part6.ts:54-55`, `v2/src/data/canon.ts:7-11` |
| `HPA-EV-003.E01` | imagen, 12 fragmentos, 476 GiB | `sp/sp4-part6.ts:59`, `v2/src/data/canon.ts:13-15` |
| precintos 0091 · 0114 | incautación · caja fuerte | `sp/sp4-part6.ts:62`, `:64`, `v2/src/data/canon.ts:19-20` |
| legal hold | «Orden de conservación»; «Logs del caso · rotación a 30 días» detenida | `v2/src/scenes/S01Hold.tsx:188-189`, `:227` |
| pizarra de 7 columnas | fases con su condición de cierre; horas escritas solo 16:09, 16:15 y 10:30 | `v5/src/scenes/parts/Board.tsx:36-42`, `:62` |
| hilo 1 del RCA | «Lucía abrió un adjunto» → macro → excepción de Operaciones → «de hace dos años, no caducaba nunca» | `v5/src/data/s08-rca.ts:47-52` |
| hilo 2 del RCA | «siguió dentro horas» → «dos equipos de tres» → nadie de guardia podía aislar `ADM-WS-02` → «el plan no tenía suplentes» | `v5/src/data/s09-plan.ts:6-11` |
| mejoras | suplentes (Seguridad, 30-09) · excepciones caducan (Sistemas, 18-09) · gestor de contraseñas con rotación (Sistemas, 31-10; hecha el 27-10, V6) · DMARC en reject (Correo, 25-09) · alerta de logon de cuentas de servicio desde estaciones (SOC, 25-09) · agente en todas las estaciones de administración (Sistemas, 15-10) | `v5/src/data/s09-plan.ts:26-31` |
| mejoras de V5b | lista de contactos fuera de banda (Seguridad, 05-10) · permiso de aislar en la cuenta de la suplente (Seguridad, 09-10) · regla «cuenta de servicio fuera de su horario, desde cualquier equipo» (SOC, 15-10) · conectar `srv-bascula01` y `srv-accesos01` a la central (Sistemas, 16-10) | `v5b/src/data/s02-mesa.ts:35`, `v5b/src/data/s03-simulacro.ts:48`, `v5b/src/data/s05-huecos.ts:111-119` |

## 4. Adversarios por sección

| Sección | Jefe | Adversario | Qué hace (flavor) | Qué revela su dosier | Fuente |
|---|---|---|---|---|---|
| sp1 | FIRST KEY | NULL CIPHER | célula de acceso inicial: badges clonados, cambios sin aprobar, certificados caducados | lector de badges clonado; certificado autofirmado instalado como raíz hace tres años; nota «el puerto sigue sin inventario», firmada GH | `sp/sections.ts:44-49` |
| sp2 | OPEN WOUND | RED MARROW | phishing, USB en el aparcamiento, proveedor comprometido | kits contra los operadores de grúas; malware por un proveedor de mantenimiento; «GH compra acceso a través de terceros» | `sp/sections.ts:63-68` |
| sp3 | LOAD BEARING | BLIND ARCHITECT | red plana, OT en la VLAN de oficinas, backups sin probar | PLC de las esclusas alcanzables desde la wifi de invitados; «GH busca un punto único de fallo» | `sp/sections.ts:82-87` |
| sp4 | NIGHT WATCH | SILENT PAGER (ella) | «Las alertas llegan a las 3 a. m. y nadie las lee» | movimiento lateral con cuentas de servicio sin rotar; logs sin centralizar; IP del mismo ASN que NULL CIPHER; «GH es una sola operación» | `sp/sections.ts:101-106` |
| sp5 | FINAL AUDIT | PAPER GOVERNOR | políticas sin dueño, riesgos sin registro, proveedor sin contrato | GLASS HARBOR era un contratista con acceso perpetuo y sin due diligence; el puerto vuelve a operar | `sp/sections.ts:120-125` |

La campaña promete «descubrir quién está detrás de GLASS HARBOR» (`src/data/tracks.ts:147-149`). Los vídeos de sp4 solo
ponen en pantalla a SILENT PAGER (`v1/video.json:8`, `v5/video.json:8`), que tutea a la analista:

| Vídeo | Mensaje interceptado | Fuente |
|---|---|---|
| V1 s03 | «Tu DMARC solo mira, como tu turno de noche. Y yo, dentro.» | `v1/narration.json:101-104` |
| V1 s06 | «Tu sensor me vio pasar. Qué detalle. Ni se levantó de la silla.» | `v1/narration.json:229-232` |
| V1 s09 | «Apágalo. Un reinicio y aquí no ha pasado nada.» | `v1/narration.json:329-332` |
| V5 s05 | «Formatea el servidor ya. Rápido, limpio y sin rastro de mí.» | `v5/narration.json:188-191` |
| V5 s06 | «¿Borraste mi programa? Estupendo. Nos vemos el jueves.» | `v5/narration.json:228-229` |
| V5 s08 | «Despide a Lucía y caso cerrado. De nada.» | `v5/narration.json:320-321` |
| V5b s04 | «Sin alarma no hay nada que buscar. Duerme tranquila.» | `v5b/narration.json:137` |
| V6 s05 | «Dale tu contraseña a esa app del calendario. Va más rápido.» | `v6/narration.json:214` |
| V6 s07 | «¿Contraseña y pregunta secreta? Dos factores. Con eso vas sobrada.» | `v6/narration.json:296` |
| V6 s10 | «Admin fijo y listo. Pedir permiso cada vez es un rollo.» | `v6/narration.json:448` |

**Lo que no se puede destripar** en un vídeo de lección:

- La IP del mismo ASN que NULL CIPHER (`sp/sections.ts:106`).
- «GH es una sola operación», ni que los cinco adversarios trabajan juntos; tampoco la firma «GH» de los dosieres (`sp/sections.ts:49`, `:68`, `:87`, `:106`).
- Quién es GLASS HARBOR (un contratista con acceso perpetuo) ni el final «el puerto vuelve a operar» (`sp/sections.ts:125`).
  Los contratistas de fondo siguen neutros: el portátil de contratista del NAC (`v1/src/scenes/S10Data.tsx:275`), la cuenta
  `ext.soporte` (`siem/src/data/s05-correlate.ts:11`) y el servidor de 2019 de un contratista (`sp/sp4-part2.ts:146`).
- Tampoco se culpa a nadie: ni a Lucía ni al turno de noche (`plan:564-565`, `v5/src/data/s09-plan.ts:5`, comentario).

## 5. Contradicciones y huecos

### Contradicciones entre fuentes (no resueltas)

1. **Número de caso.** La franja de caso dice «CASO 0412» (`eng/src/ui/CaseStrip.tsx:52`, usada en `siem/src/scenes/S08Triage.tsx:58`,
   `siem/src/scenes/S09Pivot.tsx:68`, `siem/src/scenes/S10Contain.tsx:43`, `v1/src/scenes/S08Scope.tsx:37` y `v1/src/scenes/S09Isolate.tsx:52`;
   más `siem/src/scenes/parts/s10-contain/Closure.tsx:99`). Un comentario del SIEM confirma que es este caso, el de `srv-tc-app03` y `svc_tosreport`
   (`siem/src/data/s04-enrich.ts:13-14`). La lección, V2 y V5 dicen `IR-2026-0147` (`sp/sp4-part6.ts:53`, `v2/src/data/canon.ts:6`,
   `v5/src/scenes/parts/Board.tsx:59`). En V1 el 0412 sale entre 16:04 y 16:11 del 3-9, justo cuando V5 declara el IR-2026-0147 (16:09).
2. **Dominio público.** V1 `haldenport.example` (`v1/src/scenes/S02Spoof.tsx:94`); SIEM `puerto-halden.example` (`siem/src/data/s08-triage.ts:13`, `:15`);
   sp2 da a entender `haldenport.com` («the port authority's real domain», `sp/sp2-part2.ts:227`; `sp/labs-sp2.ts:186`, `sp/sp2-part2.ts:129`).
   El plan pidió anotarlo sin corregir (`plan:631-632`). V6 sigue a V1: su web parecida es `haldenp0rt.example` (`v6/src/data/s08-fatigue.ts:33`),
   lo que da a entender que el IdP vive bajo `haldenport.example`, aunque el host real del IdP y del socio no sale nunca.
3. **Hora de la sala de crisis.** `plan:508` dice «4-9 a las 10:00»; V5 enseña 12:00 (`v5/src/data/s01-hook.ts:94`) y el propio plan lo repite en `:548`.
   `notas-v5:37` también habla de las 10:00.
4. **Cierre de la contención.** `notas-v5:31-33`: «todo se cierra a las 04:30… (antes se decía 03:05)»; la pantalla dice 10:30 (`v5/src/scenes/parts/Board.tsx:62`,
   `v5/src/data/s05-order.ts:55`, `:65`). La corrección de `notas-v5:79-85` lo supera, pero la línea vieja sigue ahí.
5. **Creación de la tarea.** `notas-v5:42`: «la copia del 3-9 lleva dentro la tarea programada (creada a las 21:20)»; la pantalla dice «creada a las 01:58,
   en la sesión de la 01:52» (`v5/src/data/s06-eradicate.ts:12`).
6. **Quién vio la alarma.** El laboratorio spl4a: «Tres de la madrugada: el SOC del puerto detecta actividad rara» (`sp/labs-sp4.ts:21`); V5: «nadie la miró
   hasta esta mañana» (`v5/narration.json:156`, `v5/src/data/s04-key.ts:78`), igual que el flavor de sp4 (`sp/sections.ts:104`).
7. **Logs centralizados.** El dosier de sp4 habla de «logs que nadie centralizaba» (`sp/sections.ts:106`); el vídeo del SIEM parte de que todo converge
   en la copia central y así encuentra la 01:52 (`siem/narration.json:60`, `:72`, `:237`).
8. **RCA de la lección frente a V5.** La lección empieza en «la analista abrió un adjunto» y pasa por el gateway de correo (`sp/sp4-part5.ts:383`); V5 empieza
   en «Lucía abrió un adjunto» (Operaciones) y no nombra el gateway (`v5/src/data/s08-rca.ts:47-52`).
9. **Día de la semana.** CHG-2041: «Sábado 2026-09-06» (`sp/sp1-part3.ts:77`); el 6-9-2026 es domingo (calendario).
10. **Terminal de V1.** El panel dice `lucia@ops:~$ dig TXT _dmarc.haldenport.example` y el prompt marca `[05:41]` (`v1/src/scenes/S03Dmarc.tsx:130`, `:309`):
    no encaja con «3-9 por la tarde», y 05:41 es la hora del hash de V2 (`v2/src/scenes/S03Image.tsx:157`).
11. **Mapa UBA del SIEM.** La fórmula de fin de semana (`siem/src/data/s09-pivot.ts:69`) hace que «hoy» (`:60`) sea jueves; la 01:52 es del viernes 4-9
    (`v5/src/data/s01-hook.ts:19` + calendario). Solo se nota contando celdas.
12. **«Toda la noche».** V5: «aislado toda la noche» (`v5/src/data/s01-hook.ts:7`, `v5/narration.json:32`); el portátil se incauta a las 04:12
    (`sp/sp4-part6.ts:56`, `v1/narration.json:355`). Matiz más que choque.
13. **Esclusas (sp3, fondo).** Los PLC de las esclusas están «air-gapped» (`sp/sp3-part1.ts:394`), pero la misión 3 dice que todo cuelga del mismo switch,
    «hasta los PLC de las esclusas» (`sp/labs-sp3.ts:21`), y el dosier los hace alcanzables desde la wifi de invitados (`sp/sections.ts:87`).

### Notas de V5b

- **«el atacante» en la voz.** En el puente de V5b la narradora dice «En septiembre, el atacante estuvo horas dentro» (`v5b/narration.json:40`): lo
  grabó así y Lidia decidió dejarlo. El resto de la serie dice «la atacante» (SILENT PAGER, ella), y el propio V5b sigue con «De ella, ni rastro».
  Un guion nuevo vuelve a «la atacante».
- **«11 min» no es una hora.** El simulacro dura 11 minutos (22:00 a 22:11); la pantalla escribe «11 min», nunca «11:00».
- **La ventana de la caza** (13-09 a 13-10) deja fuera la noche del 4-9 a propósito; un vídeo posterior no debe decir que la caza vio la 01:52.
- **Los dos servidores sin registros** no explican la salida de los 38 GB (que sigue siendo un hueco, abajo) ni sugieren que la atacante esté en
  ellos. En las lecciones las básculas van asociadas a un proveedor (`sp/sp1-part3.ts:127`): V5b no dice quién instaló estos.
- **El 8-10 es jueves**, la noche de la tarea programada ya borrada (V5 s06): casualidad, el vídeo no lo dice.

### Notas de V6

- **El IdP de Halden no enseña segundo factor** en ningún momento de V6: el carril del IdP de s04 solo pide contraseña, y el segundo
  factor sale como norma («ese inicio de sesión debe llevar segundo factor») y en una demo hipotética de «tu móvil», «simulación · sin
  fecha», reloj 00:04 (`v6/src/data/s08-fatigue.ts:9`). La ficha de V10 fija la MFA del proveedor de identidad para el 30-11; V6 no se adelanta.
- **La bóveda le pone un límite, no lo habría evitado.** La contraseña robada de septiembre sirvió «hasta que alguien se diera cuenta»
  (10:30 del 4-9); con la bóveda, «24 h como mucho, aunque nadie se dé cuenta». Ningún vídeo debe decir que la bóveda o el segundo
  factor habrían parado la 01:52.
- **Rotación al devolver.** La bóveda rota la contraseña cuando una persona la devuelve, no cuando la saca (`v6/src/data/s09-vault.ts:40`),
  como dice sp4m8q7.
- **Los privilegios especiales de `svc_tosreport`** (el `4672` de la 01:52) se retiran el 27-10 porque «solo sacaba informes»: deducción
  de V6 a partir de la pantalla del SIEM; no culpa a quien se los dio.
- **Géneros fijados por la voz:** `c.navarro` es «una compañera»; `o.virta`, «un compañero».
- **«Al atacante» en la voz.** La respuesta de s10-01 dice «Al atacante le vendría de perlas» (`v6/narration.json`, s10-01): lo grabó así y
  Lidia decidió dejarlo, como el «el atacante» de V5b. SILENT PAGER sigue siendo «ella» y un guion nuevo vuelve a «la atacante».

### Huecos (ninguna fuente lo dice)

- **Por dónde salieron los 38 GB.** V1 retira la regla 3 el 3-9, sin hora (`v1/narration.json:209`); con la tabla corregida (`v1/src/scenes/S05Rules.tsx:20-26`)
  nada deja salir a `srv-tc-app03` por el 443, y aun así salen a las 02:00 (`siem/src/data/s08-triage.ts:28-31`). V5 solo «confirma» la regla (`v5/src/data/s06-eradicate.ts:36`).
- **Dos IP del atacante.** `203.0.113.77` (C2 del portátil, V1) y `203.0.113.47` (salida, SIEM y V5): nadie dice si son la misma infraestructura.
- **De dónde salió la credencial de `svc_tosreport`.** V1: «antes de aislarlo» (antes de 16:11, `v1/narration.json:361`). V5 dibuja la llave saliendo de `ADM-WS-02`
  (`v5/narration.json:162`, `v5/src/Poster.tsx:91`). Ninguna pantalla da equipo ni hora.
- **Cómo llegó el documento a `OPS-WS-08` y `ADM-WS-02`** (¿más destinatarios del correo? ¿movimiento?): V1 solo da los aciertos (`v1/src/data/s08-scope.ts:9-10`).
- **La copia del 3-9 23:00** es anterior al primer compromiso confirmado del servidor (01:52 del 4-9, `siem/src/data/s09-pivot.ts:33`). V5 la descarta porque
  la atacante ya estaba «dentro del puerto» (`v5/src/data/s07-recovery.ts:35-36`, `v5/narration.json:282`), no del servidor. Un guion nuevo no debe decir que
  esa copia contenía la tarea o el programa.
- **La fecha de la 01:52 en el SIEM.** El SIEM no fecha la noche, ni en pantalla ni en voz; el 4-9 sale de V5 (`v5/src/data/s01-hook.ts:19`) y de V1, que la pone
  después del 3-9 por la tarde (`v1/narration.json:439`). Tampoco da la hora de la alerta ni la del triaje: la «mañana» sale de `TODAY_NOW_H = 10`
  (`siem/src/data/s09-pivot.ts:62`), que no se ve como hora.
- **La 01:52 en V1.** En S08 y S09 la franja la pinta como `--:--` (`reveal: 0` en `v1/src/scenes/S08Scope.tsx:40` y `v1/src/scenes/S09Isolate.tsx:56`; `eng/src/ui/CaseStrip.tsx:88`).
  La única 01:52 en pantalla de V1 es `v1/src/scenes/S12Recap.tsx:179`; lo demás es voz.
- **El portátil incautado.** Que `HPA-EV-003` es el SSD de `OPS-WS-14` solo lo dice el plan (`plan:355`) y V1 por la hora; ninguna pantalla junta los dos nombres.
  La ficha lo sitúa en la «terminal de contenedores» y lo incauta en la «sala de control, muelle 3» (`sp/sp4-part6.ts:55-56`): no consta si el muelle 3
  está en la terminal.
- **La sesión abierta** de `srv-tc-app03` por la mañana (`siem/src/scenes/parts/s10-contain/Topology.tsx:381`; V5 «las que siguen abiertas», `v5/src/data/s04-key.ts:112`):
  no se dice de quién es ni desde dónde, aunque la salida acabó a las 04:30.
- **La tarea de las 01:58 no está en el pivote del SIEM** (01:30–04:30 en ese servidor, `siem/src/data/s09-pivot.ts:13-21`); V5 la descubre después.
- **Cierre del SIEM.** «CASO 0412 · informe de cierre» el 4-9 (`siem/src/scenes/parts/s10-contain/Closure.tsx:99`) frente a un caso que V5 lleva hasta el 11-9.
- (Resuelto el 2026-10-04.) **Password spraying del 4-9** frente a la pregunta del logon de las 03:12 (`sp/labs-sp4.ts:93`): Lidia aprobó
  pasar el spraying de la lección a la noche del 20 al 21-10, desde `192.0.2.157` (`sp/sp2-part4.ts:65-69`), como pide la ficha de V10.
  Ya no cae en la noche del caso; la pregunta de spl4a sigue siendo del 4-9 y no tiene que ver con él.
- **Viñetas de V1 dentro del día del caso.** FIM: `firewall-rules.conf` cambia «hoy · 14:32» (base «ayer · 22:00», `v1/src/scenes/S10Data.tsx:205-214`): si «hoy»
  es el 3-9, es un cambio sin explicar antes del correo. UBA: «03:00 · fuera de la línea base» (`:342`, `v1/narration.json:391`) sin cuenta: no puede ser
  `svc_tosreport`, cuyo único punto fuera de horario es la 01:52 (`siem/src/data/s09-pivot.ts:60`).
- **Memoria.** V2 dice que la del portátil se vuelca antes de apagar, sin hora ni responsable (`v2/narration.json:63`); la del servidor está «ya capturada», sin hora
  (`v5/src/data/s07-recovery.ts:11-14`).
- **Fechas de erradicación y recuperación:** ninguna. La pizarra solo escribe 16:09, 16:15 y 10:30 (`v5/src/scenes/parts/Board.tsx:62`).
- **`OPS-WS-08`:** V1 no la aísla en pantalla; las 16:15 son solo de V5 (`v5/src/data/s03-scope.ts:21`).
- **Mismo número, otra cosa.** El escaneo del 1-9 tiene un «FINDING #0147» (`sp/sp4-part3.ts:55`), igual que el caso `IR-2026-0147` (`sp/sp4-part6.ts:53`).
  No están relacionados; un guion no debe juntarlos.
- **Episodios de las lecciones que se parecen al caso y no lo son:** a las 02:40, el SIEM ve `svchost32` en el servidor de aplicaciones y el de facturación
  deja de enviar logs (`sp/sp2-part3.ts:441`); una administradora descarga de noche todo el archivo de manifiestos desde otro país (`sp/sp5-part4.ts:356`);
  un servidor de control de grúas lleva catorce meses hablando con un dominio desconocido (`sp/sp2-part1.ts:147`).

### Solo en planes o notas (en ninguna pantalla ni voz)

- A las 21:14 la atacante no usa `svc_tosreport` «(el mapa UBA no lo permite)» (`plan:541-543`).
- El destino de `ADM-WS-02` no se narra en V1 a propósito, para que el logon de la 01:52 siga siendo posible (`notas-v1:56-58`).
- Lucía es «la misma usuaria del vídeo EDR antiguo», ya retirado (`plan:282`).
- El 3-9 es jueves; el guion de V1 no nombra el día (`notas-v1:74`).
- (Superado.) El esbozo de V5b en la tanda 2 del plan decía «simulacro de mesa» y que la caza partía del dosier de SILENT PAGER. V5b,
  ya publicado, separa la mesa del simulacro y saca la hipótesis de lo que enseñó el incidente (la 01:52), no del dosier del jefe de sp4.

## 6. Nombres libres

Nombres de fondo ya usados, neutros (no tocan el caso). Mejor reutilizarlos que inventar otros.

| Nombre | Qué es | Dónde sale |
|---|---|---|
| `FIN-WS-05` · `LOG-WS-11` · `SALES-WS-03` | Finanzas · Logística · Comercial; limpios en las dos cazas | `v1/src/data/s08-scope.ts:11-13`, `v5/src/data/s06-eradicate.ts:67` |
| `dc-01` · `fw-01` · `rt-core` | controlador de dominio · firewall · router | `siem/src/data/s02-collect.ts:74-78` |
| `fw-int01` · `srv-gis01` · 10.20.9.14 | firewall interno · servidor SSH · destino interno | `siem/src/data/s03-normalize.ts:75-79`, `:97` |
| `a.soto` (10.20.6.52) | usuaria legítima; su ejemplo del 14/03 usa `SRV-TC-APP03` | `siem/src/data/s03-normalize.ts:54-60` |
| `srv-tc-app01` · `svc_edi` · 198.51.100.23 | otro servidor de la terminal, su cuenta y un destino | `siem/src/data/s04-enrich.ts:15-17` |
| `ptl-pruebas-02` | portátil de pruebas; V5b lo usa para el simulacro (ya no es solo relleno) | `siem/src/data/s04-enrich.ts:77`, `v5b/src/data/s03-simulacro.ts:11` |
| `rdp01` · `srv-fich02` | escritorio remoto · servidor de ficheros | `siem/src/data/s05-correlate.ts:12`, `:26` |
| `backup01` · `vulnscan01` · `lb-web02` | copias · escáner · balanceador | `siem/src/data/s06-fatigue.ts:23-25` |
| 10.20.6.23 · 10.20.3.54 · 10.20.9.12 | hosts de la cola de avisos | `siem/src/data/s06-fatigue.ts:30-33` |
| R-112 · R-087 · R-203 · EXC-01…03 | reglas ruidosas del SIEM y sus exclusiones | `siem/src/data/s06-fatigue.ts:45-47`, `siem/src/data/s07-tuning.ts:53-69` |
| `fw-perimetro-01` · 192.0.2.10 · `ws-ops-12` | cola tranquila del SIEM | `siem/src/data/s08-triage.ts:14-17` |
| `hpa-portal-web-01` | portal público de reservas de atraque | `sp/sp4-part3.ts:56` |
| HALDEN-OPS | wifi WPA2 de la terminal | `sp/sp4-part1.ts:384` |
| muelle norte | servidor de planificación de grúas (R-014) | `sp/sp5-part2.ts:114` |

Dos formas de nombrar estaciones conviven: `OPS-WS-14` / `ADM-WS-02` (V1 y V5) y `ws-ops-12` (`siem/src/data/s08-triage.ts:17`). Los servidores van
en minúsculas (`srv-…`). Un vídeo nuevo elige una a propósito; V1 y V5 usan `ÁREA-WS-nn`.

# Canon · Operación GLASS HARBOR (Autoridad Portuaria de Halden)

Registro de los hechos fijos del incidente de Halden que cuentan los vídeos de Security+ y sus lecciones.
Última revisión: 2026-10-10 (SIEM, V1, V2, V5, V5b, V6, V10, V11, V12, V16, V17, V19 y las lecciones `sp1`–`sp5`; el lunes 16-11 y el viernes 20-11 de V16 entran en la cronología, y la red del puerto, antes y después del plan de zonas, en §3; del lunes 9-11 al jueves 12-11 de V12 entran en la cronología, con el certificado nuevo del portal, la cadena y las direcciones de revocación en §3; el lunes 23-11, el miércoles 25-11 y el viernes 27-11 de V17 entran también, con la toma de la sala de formación, el túnel de la sede a la terminal y la VPN de acceso remoto en §3; el jueves 5-11 y el viernes 13-11 de V19 entran también (el 13-11, como plazo), con la copia de pruebas de la web de citas de camiones, el área «Desarrollo» y los tres portales del registro en §3).

## 1. Cómo se usa

- Léelo entero antes de escribir un guion de Halden. Quien revisa la exactitud contrasta el guion nuevo con este archivo.
- Cada vídeo que se produzca añade aquí su «canon nuevo» (horas, equipos, cuentas, IP) al cerrarse, con su `ruta:línea`.
- Si este archivo y la pantalla de un vídeo publicado no coinciden, **manda la pantalla**: se corrige aquí y se anota en §5.
- Lo que solo está en planes o notas no es canon hasta que salga en pantalla o en voz (lista aparte en §5).

**Rutas** (relativas a la raíz del repo): `siem/` = `video/siem/` · `v1/` = `video/capas-halden/` ·
`v2/` = `video/forense-adquisicion/` · `v5/` = `video/ir-halden/` · `v5b/` = `video/ir-halden-pruebas/` · `v6/` = `video/iam-halden/` · `v10/` = `video/logs-halden/` · `v11/` = `video/cripto-halden/` · `v12/` = `video/pki-halden/` · `v16/` = `video/zonas-halden/` · `v17/` = `video/fronteras-halden/` · `v19/` = `video/inyeccion-halden/` · `eng/` = `video/engine/` · `sp/` = `src/data/secplus/` ·
`plan` = `docs/superpowers/plans/2026-09-25-lesson-videos.md` · `notas-v1` = `D:\LLM projects\TICourse\video\capas-halden\out\script-notes.md`
(fuera de git, checkout principal) · `notas-v5` = `v5/out/script-notes.md` (fuera de git) · `notas-v5b` = `v5b/out/script-notes.md` (fuera de git) · `notas-v6` = `v6/out/script-notes.md` (fuera de git) ·
`notas-v10` = `v10/out/script-notes.md` (fuera de git) · `notas-v11` = `v11/out/script-notes.md` (fuera de git) · `notas-v16` = `v16/out/script-notes.md` (fuera de git) · `notas-v17` = `v17/out/script-notes.md` (fuera de git) · `notas-v19` = `v19/out/script-notes.md` (fuera de git) ·
`dec3` = `docs/reviews/2026-10-05-fichas-tanda3/decisiones.md`. «(deducido)» = cálculo propio, no lo dice ninguna fuente.

**Vídeos de Halden**

| Vídeo | Lección | Dónde está | Qué parte del caso cuenta |
|---|---|---|---|
| SIEM «SIEM en acción» | sp4m6 | MP4, `sp/sp4-part3.ts:450-457` | la madrugada del 4-9: 01:52 y los 38 GB, triaje y cuarentena |
| V1 «Defensa en capas» | sp4m7 | YouTube `GfjE0lP2H0s`, `sp/sp4-part4.ts:173-178` | la tarde del 3-9: correo, capas, caza, aislamiento |
| V2 «Adquisición forense» | sp4m11 | MP4, `sp/sp4-part6.ts:93-100` | de las 04:12 del 4-9 al análisis del 5-9 (11:20): incautación, imagen, custodia |
| V5 «Respuesta a incidentes» | sp4m10 | YouTube `S_nVqWYkKXM`, `sp/sp4-part5.ts:353-359` | 4-9 a mediodía y la reunión del 11-9 |
| V5b «Antes del próximo incidente» | sp4m10 | YouTube `vlJ9FRtSIlM`, `sp/sp4-part5.ts:406-412` | octubre: la mesa del 2-10, el simulacro del 8-10 y la caza del 13-10 |
| V6 «Identidad y acceso» | sp4m8 | YouTube `It1DrWKbFe4`, `sp/sp4-part4.ts:464-475` | octubre: la revisión de accesos del 19-10, la jubilación del 23-10, la bóveda del 27-10 y el préstamo del 28-10 |
| V10 «Ataques en los logs» | sp2m7 | YouTube `uHHv-1hTYTE`, `sp/sp2-part4.ts:136-142` | la noche del 20 al 21-10 y la revisión de las 08:00: spraying contra el proveedor de identidad, traversal y amplificación DNS contra el portal; primera aparición de RED MARROW |
| V11 «Criptografía» | sp1m6 | YouTube `6jyHqrkMOZQ`, `sp/sp1-part4.ts:144-154` | el martes 3-11: una naviera se conecta al portal de reservas y recoge su oferta para 2027; primera aparición de NULL CIPHER. Para quien sigue el curso es el primer vídeo de Halden (sp1), aunque pase en noviembre |
| V12 «PKI: la cadena y la revocación» | sp1m7 | YouTube `zEhyYU7Vuwc`, `sp/sp1-part4.ts:393-403` | del lunes 9-11 al jueves 12-11: el portal estrena certificado, una naviera no conecta porque falta la intermedia, se arregla el martes 10-11 y el jueves 12-11 se activa OCSP stapling; vuelve NULL CIPHER. Cápsula, continúa V11 («El vídeo anterior acabó con una duda»). Sin ataque: nada se revoca ni se filtra |
| V16 «Zonas de seguridad» | sp3m4 | YouTube `PcNk_XCJmOM`, `sp/sp3-part2.ts:479-489` | el lunes 16-11 rediseñas el plano de red; el viernes 20-11 el comité lo aprueba. Sin ataque: decisiones de diseño. Primera aparición de BLIND ARCHITECT. Es el primer vídeo de sp3 y el primer vídeo de red en el orden del curso (se ve antes que cualquiera de sp4, aunque pase después de V6, V10 y V11): no remite al caso de septiembre ni a la noche del 21-10 |
| V17 «Por dónde se entra» | sp3m5 | YouTube `R4bvB3FTrrE`, `sp/sp3-part3.ts:215-226` | del lunes 23-11 al viernes 27-11: una prueba suya en una toma libre, la revisión del túnel que ya une la sede con la terminal de contenedores y la VPN de acceso remoto de alguien de viaje; el viernes el comité aprueba 802.1X y el túnel completo, desde el 1-12. Sin ataque: decisiones de diseño. Segunda aparición de BLIND ARCHITECT. Sigue a V16 (la semana anterior el puerto aprobó su plan de zonas); el plan todavía no funciona |
| V19 «SQL injection y XSS: cuando un texto se vuelve orden» | sp2m4 | YouTube `kEMyULl7v5A`, `sp/sp2-part2.ts:333-343` | el jueves 5-11 a las 10:00, antes de publicar: el equipo de desarrollo te enseña la copia de pruebas de la web donde los camiones pedirán cita y pruebas sus tres cajas de texto (login, buscador de citas y observaciones); el viernes 13-11 es el plazo de Desarrollo para corregirlas. Sin ataque: una revisión con datos ficticios, y nada se explota fuera de ella. Segunda aparición de RED MARROW en el calendario del caso (la primera es V10, del 20 al 21-10); como sp2m4 va antes que sp2m7 en el curso, quien sigue las lecciones en orden ve a RED MARROW aquí primero, y por eso se presenta con una sola frase, sin «otra vez». No es el portal de reservas de V10, V11 y V12 |

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
| 2026-10-21 (miércoles; la noche del martes 20) · 03:10:02–05:06 | Password spraying desde `192.0.2.157` contra el proveedor de identidad: en el registro del «IdP de Halden» el usuario cambia en cada línea y el origen no, unos 40 s entre intentos; «180 cuentas · 1 intento por cuenta · 03:10–05:06 · cuentas bloqueadas: 0». Las cinco líneas en pantalla son las de la lección (hasta el 2026-10-04, fechadas el 4-9 y desde 185.22.9.41). «umbral: 5 fallos» sale en la puerta de contraejemplo, la que sí se bloquearía | IdP de Halden | `v10/src/data/s02-spray.ts:19-30`, `:36-59`, `sp/sp2-part4.ts:65-69` |
| 21-10 · 03:12:37 / 03:13:15 | Un solo acierto, `LOGIN OK user=r.haugen`; a las 03:13:15, `LOGOUT`, «aplicaciones abiertas: 0», sin explicación («sale enseguida, sin entrar en ninguna aplicación»). Junto al OK, «IdP de Halden · pide: contraseña»: **el 21-10 el proveedor de identidad solo pedía contraseña**, y por eso acierta. La contraseña, `Halden2026!`, cumplía la política («cumple»); el registro no la guarda: la dice RED MARROW | `r.haugen`, IdP de Halden | `v10/src/data/s03-mfa.ts:9-22`, `v10/src/data/s02-spray.ts:52`, `v10/narration.json:92`, `:100-103` |
| 21-10 · 04:26:14 y 04:26:21 | Directory traversal desde `192.0.2.157` contra el visor de documentos (`/gate/viewdoc`) del portal (en voz, «alguien pide un documento al portal»): `file=../../../../etc/passwd` → `200 1834`, «se lo llevó» (en voz, «la lista de usuarios»); la misma petición, codificada (`%2e%2e%2f…etc%2fshadow`) → `403 0`, «el servidor no puede leer `shadow` · no es un filtro»; en voz, «Filtro, ninguno» | `hpa-portal-web-01` | `v10/src/data/s04-traversal.ts:8-14`, `:26-63`, `:94`, `v10/narration.json:138`, `:150`, `:178` |
| 21-10 · 05:40–06:05 | Amplificación DNS (DDoS reflejado y amplificado) contra el portal: NetFlow entrante, todo UDP desde el puerto 53, «orígenes distintos: 340» («resolvers abiertos de terceros»; legibles solo `198.51.100.61`, `.140`, `.203` y `.212`), «enlace de 1 Gb/s · 100 %» y «consultas DNS del portal a esos servidores: 0». Nadie lo firma | `hpa-portal-web-01` | `v10/src/data/s05-amp.ts:8-27`, `:60` |
| 21-10 · 05:44 | «guardia · 05:44 · aviso de caída · llamada al proveedor» (en voz, «a los cuatro minutos»); no se dice que la llamada parase el ataque | quien estaba de guardia | `v10/src/data/s05-amp.ts:65`, `v10/narration.json:254` |
| 21-10 · 08:00 | «21-10 · 08:00 · revisión de la mañana»: la cola de alertas trae los tres rastros: «03:10 · fallos de inicio de sesión · 1 origen · proveedor de identidad», «04:26 · peticiones con `../`» y «05:40 · DNS entrante masivo», las dos últimas en `hpa-portal-web-01`. Acciones: «esa cuenta: contraseña nueva y sesiones cerradas» · «bloquear el origen, no las cuentas» · «MFA y lista de contraseñas prohibidas en el proveedor de identidad · Sistemas · 30-11». Lo del portal sale como defensa y respuesta, sin fecha ni dueño: «resolver la ruta · comprobar que sigue dentro»; «filtrado en el proveedor · servicio anti-DDoS» y «en origen: cerrar los resolvers abiertos» | la jugadora, en segunda persona («tu cola de alertas»); Sistemas | `v10/src/scenes/parts/TrailRow.tsx:73-77`, `:106`, `v10/narration.json:26`, `v10/src/data/s03-mfa.ts:28-32`, `v10/src/data/s04-traversal.ts:97`, `v10/src/data/s05-amp.ts:58-62` |
| 2026-10-23 (viernes) · fin de turno | Se jubila `o.virta`, de Importación («la oficina que trata con aduanas»): cuenta «deshabilitada · 23-10 · fin de turno»; buzón, archivos y registros se conservan hasta que lo permita la política de retención. Sin conflicto ni sospecha. Con la cuenta deshabilitada, el IdP no le firma pases para la plataforma aduanera del socio («sin pase: acceso denegado», en condicional: nadie intenta entrar) | `o.virta` | `v6/src/data/s03-leaver.ts:7-16`, `v6/src/data/s04-saml.ts:27-31` |
| sin fecha (como la lección) | El personal del puerto entra en la plataforma aduanera del socio con su cuenta del puerto por SAML: pase «válido: 5 min», «firma: IdP de Halden»; el carril del IdP pide **solo contraseña** | personal del puerto, IdP de Halden | `v6/src/scenes/parts/PassCard.tsx:21-22`, `v6/src/data/s04-saml.ts:11` |
| sin fecha (como la lección) | La app «Planificador de atraques» de un proveedor externo lee el calendario de atraques por OAuth: «alcance: calendario.leer · caduca: 60 min», emitido por el IdP de Halden | proveedor externo | `v6/src/data/s05-oauth.ts:9`, `:41-42` |
| 2026-10-27 (martes) | La mejora de V5 «cuentas de servicio en gestor de contraseñas con rotación · Sistemas · 31-10», «27-10 · hecho»: `svc_tosreport`, `svc_edi` y el resto entran en la «bóveda de Sistemas», que ya guardaba los administradores del dominio («ya estaban»); «¿quién la sabe?: nadie»; rotación «cada 24 h y cada vez que una persona la devuelve». A `svc_tosreport` se le retiran los privilegios especiales (`4672`): «retirados · solo sacaba informes» (deducción de V6) | Sistemas | `v6/src/data/s09-vault.ts:23`, `:37-50`, `v6/src/scenes/parts/LogonCard.tsx:32` |
| 2026-10-28 (miércoles) · 22:00–23:00 | Préstamo just-in-time: «L. Ferrer · Infraestructura» pide «administrador del dominio · motivo: cambio aprobado · ventana: 28-10 · 22:00–23:00»; «aprueba: R. Salas · jefe de sistemas»; credencial válida hasta las 23:00, sesión grabada, cuenta de administración separada de la diaria; a las 23:00 «privilegio retirado · contraseña rotada»; una «copia · 23:05» «ya no sirve» | L. Ferrer, R. Salas | `v6/src/data/s10-jit.ts:14-32` |
| 2026-11-03 (martes), sin hora | Una naviera, sin nombre, se conecta «desde fuera» al portal de reservas de atraque: `curl -v https://reservas.haldenport.example/` → `SSL connection using TLSv1.3 / TLS_AES_256_GCM_SHA384 / X25519 / id-ecPublicKey`, emisor `CN=Confianza Global TLS Issuing CA 3`, «SSL certificate verify ok». Entra con su contraseña en la «zona de navieras» y recoge la «Oferta comercial 2027 · para una naviera» (confidencial), cifrada para ella y firmada por el puerto | una naviera, el portal de reservas | `v11/src/data/s01-hook.ts:11-27`, `v11/src/scenes/parts/TlsLine.tsx:61-65`, `v11/src/data/s05-contrasenas.ts:12-15`, `v11/src/scenes/parts/Fingerprint.tsx:298-305`, `v11/narration.json:28`, `:144`, `:344`, `:444` |
| 2026-11-05 (jueves) · 10:00 | «05-11 · jueves · 10:00 · revisión antes de publicar», bajo «Citas de camiones · entorno de pruebas · datos ficticios»: antes de publicarla, el equipo de desarrollo enseña a la jugadora la copia de pruebas de la web donde los camiones pedirán cita, y ella prueba sus tres cajas de texto. Es una revisión, no un incidente, y nada se explota fuera de ella. Tres fallos, uno por caja: el login se arma pegando el texto en la consulta (SQL injection: una comilla, `OR 1=1` y `--` abren sesión sin contraseña), el buscador de citas devuelve la matrícula tal cual (XSS reflejado) y las observaciones para el personal de la puerta se guardan y se muestran sin codificar (XSS almacenado). La cookie solo «podría» llevársela el script; el listado del día lo «abrirá» el personal de la puerta y el navegador de cada persona lo «ejecutaría» (futuro y condicional: nadie lo abrió). La fecha, el día y la hora solo salen en el sello; la voz no fecha nada | la jugadora, en segunda persona; el equipo de desarrollo | `v19/src/data/s01-hook.ts:9`, `:11`, `v19/narration.json:26`, `:44`, `:62`, `:132`, `:148`, `:166`, `:172`, `:178` |
| 2026-11-09 (lunes), por la tarde | El portal de reservas estrena certificado (el de V11 caducaba el miércoles 11-11): `CN = reservas.haldenport.example`, emisor `Confianza Global TLS Issuing CA 3`, `id-ecPublicKey` de 256 bits, `ecdsa-with-SHA384`, `NotBefore: Nov  9 00:00:00 2026 GMT`, `NotAfter: May 27 23:59:59 2027 GMT`. Se instaló solo el certificado, no el fichero de la cadena («La CA entrega dos ficheros, y el lunes solo se instaló uno»). Quién lo instaló no sale (deducido: Infraestructura, como el martes). Desde esa tarde el programa de la naviera no conecta | el portal de reservas; Infraestructura (deducido) | `v12/src/data/s01-hook.ts:36-41`, `v12/src/data/s02-cadena.ts:38-41`, `v12/narration.json:39`, `:107` |
| 2026-11-10 (martes) · 08:15 | Una naviera, sin nombre, avisa: «Desde ayer por la tarde nuestra integración no conecta con vuestro portal: unable to get local issuer certificate». Sin dirección de remitente | una naviera | `v12/src/data/s01-hook.ts:44-49`, `v12/narration.json:39` |
| 2026-11-10 (martes) · 08:40 | La analista, en segunda persona y sin nombre, lo comprueba desde una terminal: `openssl s_client -connect reservas.haldenport.example:443 -showcerts` devuelve un solo certificado en la cadena (el del portal) y `Verify return code: 21 (unable to verify the first certificate)`. Falta la intermedia; la raíz ya está en el equipo del cliente | la jugadora | `v12/src/data/s02-cadena.ts:11`, `:26`, `:47`, `:58-59`, `v12/narration.json:45` |
| 2026-11-10 (martes) · 09:10 | «Infraestructura instala la intermedia»: la cadena llega hasta `Confianza Global Root` (tres niveles, `Verify return code: 0 (ok)`) y la naviera conecta. La intermedia: `CN = Confianza Global TLS Issuing CA 3`, emitida por la raíz, 384 bits, `RSA-SHA256`, del 14-3-2023 al 13-3-2033. Es el despiste más común, sin culpables: «se arregla la cadena, no el aviso» | Infraestructura (el único responsable en pantalla) | `v12/src/data/s03-arreglo.ts:18`, `:21`, `:23`, `:26-44`, `:56` |
| 2026-11-10 (martes), sin hora | Esa misma mañana la naviera pregunta quién le avisaría si el certificado dejara de valer antes de tiempo. El certificado lleva las dos direcciones de revocación de la lección: `http://crl.confianza.example/issuing3.crl` y `http://ocsp.confianza.example`. Ese día el portal no grapa ninguna respuesta (`OCSP response: no response sent`). Nada se revoca: todo en condicional («si se filtrara la clave») | la naviera; el portal | `v12/src/data/s04-revocar.ts:11-15`, `:35`, `:45-52`, `v12/src/data/s05-ocsp.ts:35`, `:38-41` |
| 2026-11-11 (miércoles) · 23:59:59 GMT | Caduca el certificado del portal: «expire date: Nov 11 23:59:59 2026 GMT», solo a media luz en el `curl` de s01, sin leer ni resaltar (lo recoge V12: «el anterior caducaba el 11-11», porque el 9-11 ya se había cambiado) | `reservas.haldenport.example` | `v11/src/data/s01-hook.ts:26-27`, `v12/src/data/s01-hook.ts:40` |
| 2026-11-12 (jueves) · mañana | La mejora «OCSP stapling en el portal · Infraestructura · 12-11» ya está puesta: `openssl s_client -connect reservas.haldenport.example:443 -status` enseña una respuesta grapada (`OCSP Response Status: successful (0x0)`, `Cert Status: good`, `This Update: Nov 12 08:00:00 2026 GMT`, `Next Update: Nov 12 20:00:00 2026 GMT`: «sellada esta mañana», «caduca esta noche», «el portal pide otra antes»). Las horas de la consola son GMT. Desde ese día el portal sale a Internet hasta `ocsp.confianza.example` para traer la respuesta (deducido) | Infraestructura | `v12/src/data/s05-ocsp.ts:6`, `:33`, `:35`, `:44-53`, `v12/narration.json:207` |
| 2026-11-13 (viernes), sin hora | Plazo: «consultas parametrizadas y codificación de salida · en el portal de citas · Desarrollo · 13-11». En pantalla solo sale «13-11» (el viernes es deducido, calendario); en voz, «Desarrollo corrige las tres cajas para el trece de noviembre». Es un plan con dueño y fecha, **no un hecho cumplido** (igual que el 30-11 de V10): ningún vídeo enseña corregidas las tres cajas ni dice si se corrigieron a tiempo. Ningún hecho de V19 pasa después | Desarrollo | `v19/src/data/s05-vitrina.ts:30-35`, `v19/narration.json:224` |
| 2026-11-16 (lunes), sin hora | «16-11 · lunes · rediseño de la red»: el puerto rehace el plano de su red «y esta vez lo dibujas tú». El plano de antes cabe en una servilleta (§3: `fw-perimetro-01`, `rt-core`, las cuatro VLAN, el cortafuegos interno y `hpa-portal-web-01`). No hay ataque: cada escena es una decisión de diseño. La fecha solo sale en el sello; la voz no fecha nada | la jugadora, en segunda persona | `v16/src/data/s01-hook.ts:11`, `v16/narration.json:26`, `:38`, `notas-v16:34` |
| 2026-11-20 (viernes), sin hora | «plan de zonas · aprobado en el comité de cambios · 20-11 · lo ejecuta Infraestructura (L. Ferrer) · por fases desde el 1-12», solo en el sello de s09; en voz, «Y con esto, plan aprobado», sin fecha. Lo que aprueba, en §3 («plan de zonas»). Ningún hecho del vídeo pasa después | el comité de cambios; Infraestructura (L. Ferrer) | `v16/src/data/s09-camara.ts:64`, `v16/narration.json:448` |
| 2026-11-23 (lunes) · 09:40 | La prueba de la toma: en la sala de formación de la planta de oficinas, la analista conecta `ptl-pruebas-02` a una toma libre y en 3 s recibe `10.20.6.140`, una dirección de la VLAN de Oficinas, sin que nadie le pregunte quién es. Es una prueba suya, no un incidente: nadie más se enchufa. La fecha y la hora solo salen en el sello; la voz dice «Es lunes» | la jugadora, en segunda persona | `v17/src/data/s02-toma.ts:12`, `:15`, `:18`, `v17/narration.json:56`, `:62` |
| 2026-11-25 (miércoles), sin hora | «revisión del túnel entre la sede y la terminal»: el túnel site-to-site que ya existe entre las dos pasarelas, IPSec con ESP en modo túnel, se revisa y se queda como está (s07: «el túnel se queda en modo túnel»). Se repasa en voz («El miércoles revisas el túnel que ya une la sede con la terminal de contenedores») | la jugadora; las pasarelas de la sede y de la terminal, sin nombre | `v17/src/data/s05-sedes.ts:12`, `v17/src/data/s07-modos.ts:27`, `v17/narration.json:208` |
| 2026-11-27 (viernes), sin hora | El comité de cambios aprueba dos cosas, las dos desde el 1-12 y con las fases del plan de zonas: 802.1X en los switches de acceso de la planta de oficinas (Infraestructura) y el túnel completo para los portátiles del puerto (Sistemas). La fecha, solo en el sello de s09; en voz, «el viernes el comité de cambios lo aprueba, junto con 802.1X». La VPN de acceso remoto era hasta entonces de túnel dividido («hoy: túnel dividido»). Ninguna de las dos cosas se enseña en marcha | el comité de cambios; Infraestructura; Sistemas | `v17/src/data/s04-eap.ts:40`, `v17/src/data/s09-tunel.ts:13`, `:41`, `:44`, `v17/narration.json:420`, `:472` |
| 2026-11-30 (lunes) | Plazo de la mejora de V10 «MFA y lista de contraseñas prohibidas en el proveedor de identidad · Sistemas · 30-11»; ningún vídeo la enseña cumplida todavía | Sistemas | `v10/src/data/s03-mfa.ts:31` |
| 2026-12-01 (martes) | Empieza el plan de zonas «por fases desde el 1-12» (solo en el sello, sin nada de lo que se hace ese día); V17 añade que ese día entran 802.1X en los switches de acceso de la planta de oficinas (Infraestructura) y el túnel completo de los portátiles del puerto (Sistemas), también solo en los sellos («así será desde el 1-12»; «desde el 1-12, con las fases del plan de zonas»). Hasta entonces la toma del 23-11 no pregunta y la VPN de acceso remoto sigue dividida. Antes no funciona nada del plan: la MFA del jump server es un requisito del diseño, en futuro («pedirá un segundo factor»; «MFA» en la caja del plan), así que nunca va por delante de la del proveedor de identidad (30-11) | Infraestructura | `v16/src/data/s09-camara.ts:64`, `v16/narration.json:226`, `v16/src/data/s05-jump.ts:22`, `v17/src/data/s04-eap.ts:21`, `v17/src/data/s09-tunel.ts:44` |

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
| la jugadora | «la primera analista de seguridad» del puerto; V5b y V10 le hablan en segunda persona (en V10, «tu cola de alertas», sin género en la voz); V11 la pone del lado del puerto («para que sepa que eres tú, tu sello»); V16 le encarga el plano nuevo («esta vez lo dibujas tú»), también en segunda persona y sin género en la voz, y la manda al laboratorio («Tu turno»); V17 la pone a probar una toma («Quieres comprobar una cosa. Conectas un portátil de pruebas…»), también en segunda persona y sin género en la voz, y le da el miércoles el túnel y el viernes la aprobación del comité; V12 (9 al 12-11) le habla igual («Conéctate al portal desde una terminal, y mira qué certificados te manda») y la pone a comprobar la cadena el 10-11 a las 08:40; V19 (5-11) le habla igual («El equipo de desarrollo te enseña…», «Hoy pruebas las tres cajas donde la gente escribe», «Termina tú la lección y sus preguntas») y la pone a revisar la copia de pruebas de la web de citas, sin género en la voz | `src/data/tracks.ts:149`, `sp/labs.ts:30`, `v10/narration.json:26`, `v11/narration.json:344`, `v16/narration.json:26`, `:472`, `v17/narration.json:62`, `:208`, `:472`, `v12/narration.json:45`, `v19/narration.json:26`, `:50`, `:248` |
| una naviera | cliente del puerto, sin nombre en pantalla ni en voz; el 3-11 entra en la zona de navieras del portal y recoge su oferta para 2027 | `v11/narration.json:28`, `v11/src/data/s03-naviera.ts:9`, `v11/src/scenes/parts/Fingerprint.tsx:305` |
| «alguien del puerto de viaje» | quien se conecta a la VPN de acceso remoto desde la red de un hotel (V17, s08); sin nombre, sin área, sin género, y nunca un contratista, un técnico de mantenimiento ni un proveedor | `v17/src/data/s08-hotel.ts:17`, `v17/narration.json:368` |
| responsable de `ADM-WS-02` | sin nombre; «sin localizar» el 3-9 | `v5/src/data/s04-key.ts:11` |
| M. Aalto | SOC, credencial 2211; incauta el SSD | `sp/sp4-part6.ts:57`, `v2/src/data/canon.ts:24-25` |
| J. Rekola | Asesoría jurídica; testigo | `sp/sp4-part6.ts:57`, `v2/src/data/canon.ts:26-27` |
| R. Sandoval | laboratorio forense | `sp/sp4-part6.ts:63`, `v2/src/data/canon.ts:28`, `v2/narration.json:69` |
| R. Salas | jefe de sistemas; aprobó la exclusión EXC-01; aprueba el préstamo just-in-time del 28-10 | `siem/src/data/s07-tuning.ts:58`, `v6/src/data/s10-jit.ts:20` |
| L. Ferrer | Infraestructura; dueño de CHG-2041; pide el préstamo just-in-time del 28-10 (en voz, «alguien de Infraestructura»); ejecuta el plan de zonas aprobado el 20-11, por fases desde el 1-12 (V16, solo en el sello de s09; nada en voz) | `sp/sp1-part3.ts:71`, `v6/src/data/s10-jit.ts:14`, `v16/src/data/s09-camara.ts:64` |
| el comité de cambios | aprueba el plan de zonas el 20-11 (solo en el sello de s09); sin nombres. Es el CAB que aprobó CHG-2041 el 2-9 (deducido) | `v16/src/data/s09-camara.ts:64`, `sp/sp1-part3.ts:71` |
| `c.navarro` | Comunicación (antes Atención a navieras y Facturación); en voz, «una compañera de Comunicación»; sus permisos acumulados no son culpa de nadie | `v6/src/data/s02-creep.ts:10` |
| `o.virta` | Importación, «la oficina que trata con aduanas»; usaba la plataforma aduanera del socio; se jubila el 23-10; en voz, «un compañero de Importación» | `v6/src/data/s03-leaver.ts:7` |
| CISO · director de operaciones | cargos sin nombre | `sp/labs-sp4.ts:21`, `sp/sp4-part3.ts:167` |
| Seguridad, Sistemas, Correo, SOC | áreas con mejoras asignadas (Sistemas también la MFA del proveedor de identidad, 30-11, V10) | `v5/src/data/s09-plan.ts:26-31`, `v10/src/data/s03-mfa.ts:31` |
| Infraestructura | el área de los certificados del puerto en V12 (L. Ferrer, de Infraestructura, es el dueño de CHG-2041, `sp/sp1-part3.ts:71`; nadie con nombre en pantalla): instala la intermedia el 10-11 a las 09:10 y activa OCSP stapling el 12-11; también el certificado nuevo del 9-11 (deducido) | `v12/src/data/s03-arreglo.ts:23`, `v12/src/data/s05-ocsp.ts:33` |
| Desarrollo · «el equipo de desarrollo» | el área de la web donde los camiones pedirán cita (V19). En voz, «El equipo de desarrollo te enseña…» (5-11) y «Desarrollo corrige las tres cajas para el trece de noviembre» (13-11); en pantalla, «Desarrollo» como responsable de la mejora del 13-11. Área nueva en pantalla, sin nombres de persona ni jefe. En la lección es «el desarrollo del portal de citas de camiones», que incorpora SAST en su pipeline (`sp/sp4-part2.ts:413`); V19 no dice nada de ese pipeline. No se le culpa de los tres fallos: son lo que una revisión previa está para encontrar | `v19/narration.json:26`, `:224`, `v19/src/data/s05-vitrina.ts:33`, `sp/sp4-part2.ts:413` |
| el personal de la puerta | quien usa el listado de citas del día de la puerta de camiones («observaciones para el personal de la puerta», «Listado del día · puerta»); sin nombres (siluetas) y en futuro y condicional: «abrirá el listado cada día», «ejecutaría el script». Nadie lo abrió. No se dice qué sistema de la puerta lee el listado (`srv-accesos01` y `srv-bascula01` no salen) | `v19/narration.json:172`, `v19/src/data/s04-vuelve.ts:40`, `:45-46` |
| la suplente de Seguridad | sin nombre, en femenino; la mejora del 30-09; en la mesa «aislar es cosa mía»; en el simulacro su cuenta no puede aislar (el fallo es del permiso, no de ella) | `v5b/src/data/s02-mesa.ts:26`, `v5b/src/data/s03-simulacro.ts:31-35` |
| la analista de guardia | SOC, sin nombre; aísla `ptl-pruebas-02` por orden de la suplente | `v5b/src/data/s03-simulacro.ts:26` |
| las seis áreas de la mesa | Seguridad, Sistemas, Operaciones, Comunicación, Dirección, Asesoría jurídica | `v5b/src/data/s02-mesa.ts:15` |
| quien estaba de guardia (21-10) | sin nombre ni género («Quien estaba de guardia»); recibe el aviso de caída del portal a las 05:44 y llama al proveedor de Internet. No es por fuerza la analista de guardia de V5b, que es de otra noche | `v10/src/data/s05-amp.ts:65`, `v10/narration.json:238`, `:254` |

### Equipos y servidores

| Nombre | Qué es | En el caso | Fuente |
|---|---|---|---|
| `OPS-WS-14` | portátil de Lucía, «Operaciones · muelle 3» | infectado; aislado 16:11 encendido; incautado 04:12 | `v1/src/data/s07-edr.ts:11-13`, `v1/src/data/s09-isolate.ts:11-14`, `v5/src/data/s03-scope.ts:20` |
| `OPS-WS-08` | Operaciones | acierto de la caza; aislado 16:15 | `v1/src/data/s08-scope.ts:9`, `v5/src/data/s03-scope.ts:21` |
| `ADM-WS-02` | estación de administración, «donde viven las llaves» | acierto de la caza; abierta hasta las 10:30 del 4-9 | `v1/src/data/s08-scope.ts:10`, `v5/src/data/s03-scope.ts:22`, `v5/src/data/s05-order.ts:60` |
| `ADM-WS-07` | estación de administración, 10.20.4.17, «sin agente EDR» | 21:14, 01:52, 01:58; aislada 10:30; luego «ya con agente» | `siem/src/data/s09-pivot.ts:37-39`, `v5/src/data/s04-key.ts:49-51`, `v5/src/data/s06-eradicate.ts:18`, `:73` |
| `srv-tc-app03` | «servidor de la terminal de contenedores», 10.20.8.31 | logon 01:52, salida de 38 GB, cuarentena, restaurado | `siem/src/data/s08-triage.ts:23-25`, `siem/src/scenes/parts/s10-contain/Topology.tsx:303-304`, `v5/src/data/s05-order.ts:10` |
| cortafuegos (7 reglas) · «Zona Operaciones» · el «cortafuegos interno» de V16 (deducido) | V1: panel «Cortafuegos · Zona Operaciones», reglas 1–7 con `dns-int.local`, `mail-gw.local`, `gestion.local`, `erp.local`; regla 4 `DENY Contratistas → Internet`, regla 5 `ALLOW Administración → gestion.local tcp/22`, regla 7 `DENY Operaciones → Internet`. V16 dibuja en la servilleta un «cortafuegos interno» entre `rt-core` y Operaciones, sin nombre de equipo y sin «el único»; en voz no sale. Deducido (ficha de V16): es este mismo, el de V1, y también el `fw-int01` del SIEM («Firewall interno»), con `srv-gis01` (10.20.9.14) detrás; y la regla 5 es el «Administración a gestión · SSH · desde cada puesto» de V16 («un camino por puesto») | la regla 3 la tapaba. En V16 (16-11), el portátil de Oficinas de s03 no pasa del «cortafuegos interno»: Operaciones queda fuera de su alcance | `v1/src/scenes/S05Rules.tsx:20-26`, `:88`, `v16/src/scenes/parts/Napkin.tsx:36-37`, `v16/src/data/s03-alcance.ts:23`, `v16/src/data/s05-jump.ts:10-13`, `siem/src/data/s03-normalize.ts:68-79`, `:97` |
| `fw-perimetro-01` | cortafuegos del perímetro (en voz, «el cortafuegos del perímetro»); en el SIEM, «Cambio de regla aprobado» en la cola tranquila del 4-9 | en el plano de antes (16-11), entre Internet y `rt-core`, con la regla de entrada del portal: «origen: Internet · destino: hpa-portal-web-01 · tcp/443 · permitir». Por él sale a Internet lo que cuelga de `rt-core` (deducido de V16; §5, «Por dónde salieron los 38 GB») | `siem/src/data/s08-triage.ts:14`, `v16/src/scenes/parts/Napkin.tsx:34`, `:332-335`, `v16/src/data/s04-dmz.ts:12`, `v16/narration.json:162` |
| `rt-core` | router central (en voz, «el router central» y luego «el router»); en el SIEM, «flujo registrado» | de él cuelgan las cuatro VLAN del plano de antes, sin filtro entre ellas: «el router central las deja hablar entre sí sin preguntar» | `siem/src/data/s02-collect.ts:78`, `v16/src/scenes/parts/Napkin.tsx:35`, `:43`, `v16/narration.json:44` |
| `mx.haldenport.example` | pasarela de correo que firma `Authentication-Results` | — | `v1/src/scenes/S02Spoof.tsx:141` |
| VLAN producción / «VLAN cuarentena (restringida)» · las cuatro VLAN de V16 | redes del servidor en el SIEM. En V16, Producción es una de las cuatro VLAN con nombre del plano de antes, con Oficinas y Administración (las dos, nuevas como VLAN) y Pruebas (la de `ptl-pruebas-02`, V5b): cuelgan de `rt-core`, «comparten cables pero van apartadas», y «entre estas VLAN: el router no filtra». La de cuarentena no sale en V16 | 16-11: un paquete de Oficinas «cruza el router sin pararse y llega a Producción» (ejemplo de s02) y un portátil de Oficinas alcanza el portal y las otras tres (s03). Producción solo sale como destino de ese paquete, nunca con salida hacia fuera | `siem/src/scenes/parts/s10-contain/Topology.tsx:70`, `:153`, `v16/src/scenes/parts/Napkin.tsx:38-43`, `v16/narration.json:38`, `:68`, `:120`, `v16/src/data/s03-alcance.ts:17-22` |
| WB-04 · caja fuerte SOC | bloqueador de escritura · custodia | — | `sp/sp4-part6.ts:58`, `:64` |
| `ptl-pruebas-02` | portátil de pruebas (SIEM); en V5b, el equipo del simulacro, en la «VLAN de pruebas» | aislado a las 22:11 del 8-10; el 23-11 (V17) lo enchufa la analista a una toma libre de la sala de formación de la planta de oficinas y recibe `10.20.6.140` en 3 s (§2) | `siem/src/data/s04-enrich.ts:77`, `v5b/src/data/s03-simulacro.ts:10-11`, `v17/src/data/s02-toma.ts:15`, `:18` |
| sala de formación de la planta de oficinas | lugar nuevo de V17: una sala con una toma de red libre donde el 23-11 la analista prueba `ptl-pruebas-02`. La planta tiene salas de reuniones, visitas que entran y salen y tomas libres por todas partes; el portátil cae en la VLAN de Oficinas, «la que el plan convertirá en zona interna» (V16: Oficinas, hoy). Esa toma no pedía 802.1X; el vídeo no dice dónde está el NAC de V1 ni lo contradice, y no generaliza a las tomas del puerto | solo el 23-11; las tomas de la planta de oficinas llevan 802.1X desde el 1-12, aprobado el 27-11 | `v17/src/data/s02-toma.ts:12`, `:27-31`, `:37-38`, `v17/narration.json:56`, `:74` |
| el túnel de la sede a la terminal de contenedores · «pasarela de la sede» · «pasarela de la terminal» | site-to-site que ya existía antes del 25-11, sin fecha de creación: IPSec con ESP en modo túnel, de pasarela a pasarela, «se monta una vez» y los equipos de cada lado no instalan nada. Sin nombres de pasarela, sin IP, sin decir qué guarda cada sitio, desde cuándo ni por qué están unidos. Encaja con el SIEM (la sede y la terminal en la misma red interna, `10.20.0.0/16`, `siem/src/data/s07-tuning.ts:40`); la terminal de contenedores es otra sede, distinta de la VLAN de Producción (V16) | revisado el 25-11 y «se queda en modo túnel» | `v17/src/data/s05-sedes.ts:12`, `v17/src/data/s07-modos.ts:20-27`, `v17/narration.json:208`, `:214`, `:220`, `sp/sp3-part3.ts:184-186` |
| «Acceso remoto del puerto» (la VPN de acceso remoto) | la VPN para quien está fuera, «la lancha»: va sobre TLS por 443/tcp (la «VPN SSL» de CHG-2041, `sp/sp1-part3.ts:74`) y, hasta el plan, **de túnel dividido** («hoy: túnel dividido»; nuevo). Sin nombre de servidor (`vpn.puerto-halden.example` no sale), sin cómo se inicia sesión ni factores. El 27-11 el comité aprueba el túnel completo para los portátiles del puerto (Sistemas), desde el 1-12. Nada dice que se escapara nada por el túnel dividido | sobre TLS: solo en s08, tras la pregunta; túnel completo: desde el 1-12 | `v17/src/data/s08-hotel.ts:12-14`, `v17/src/data/s09-tunel.ts:8-14`, `:41`, `:44`, `v17/narration.json:362`, `:420` |
| `srv-bascula01` · `srv-accesos01` | báscula de camiones · control de accesos de la puerta de camiones | «0 registros · nunca conectados» a la central (13-10); se conectan el 16-10. No tienen nada que ver con la salida de los 38 GB ni con la atacante, y no se dice quién los instaló | `v5b/src/data/s05-huecos.ts:69`, `:80`, `:88`, `:111-113` |
| la central (24 servidores) | 22 con registros y 2 nunca conectados el 13-10; con nombre en pantalla solo los que ya envían registros en el SIEM | — | `v5b/src/data/s05-huecos.ts:46-48` |
| «IdP de Halden» · «proveedor de identidad» | el proveedor de identidad del puerto; nunca con nombre de host | V6: firma los pases SAML y los tokens OAuth. V10: su «registro de inicios de sesión» guarda el spraying del 21-10 y no la contraseña probada; ese día «pide: contraseña» y nada más; MFA y lista de contraseñas prohibidas, Sistemas, 30-11 | `v6/src/scenes/parts/PassCard.tsx:21-22`, `v6/src/data/s04-saml.ts:11`, `v10/src/data/s02-spray.ts:19-22`, `:52`, `v10/src/data/s03-mfa.ts:13`, `:31` |
| `hpa-portal-web-01` | «portal público de reservas de atraque», «sin WAF delante» (1-9); visor de documentos `/gate/viewdoc`; enlace de 1 Gb/s. En V11 (sin el nombre del equipo, deducido por la descripción): `reservas.haldenport.example`, TLS 1.3 con certificado de `Confianza Global TLS Issuing CA 3` que caduca el 11-11, y una «zona de navieras» con usuario y contraseña, de la que guarda «su huella», no «la contraseña cifrada». En V16, nombre y descripción juntos en pantalla: hasta el plan vivía en la VLAN de Oficinas, junto a los «puestos de Importación» (sin nombre; Importación es «la oficina que trata con aduanas», V6), publicado por la regla 443 de `fw-perimetro-01`; en voz, «el portal de reservas, que vive en Oficinas». Deducido (ficha de V16): delante no había nada que mirase dentro de la petición web (ni WAF ni filtro), solo esa regla 443; y, con el portal dentro de la red del puerto, el «enlace de 1 Gb/s» del 21-10 era el del puerto | traversal de las 04:26 y amplificación DNS de 05:40 a 06:05 del 21-10; «Filtro, ninguno». El 3-11, la conexión de la naviera (V11). El 20-11, el plan de zonas lo muda a la DMZ: «de Internet a la DMZ: solo 443, al portal» · «de la DMZ a la red interna: solo lo imprescindible, con regla; nada más» (V16) | `sp/sp4-part3.ts:56-57`, `v10/src/data/s04-traversal.ts:10-11`, `v10/src/data/s05-amp.ts:10`, `:25`, `v10/narration.json:178`, `v11/src/data/s01-hook.ts:12`, `v11/src/data/s05-contrasenas.ts:12-25`, `v16/src/scenes/parts/Napkin.tsx:44-46`, `v16/src/data/s04-dmz.ts:10-12`, `:22-25`, `v16/narration.json:156` |
| la copia de pruebas de la web de citas de camiones · «Citas de camiones» · «Acceso al portal» | la web donde los camiones pedirán cita (V19; la lección la llama «el portal de citas de camiones»), aún sin publicar, vista en su copia de pruebas: «entorno de pruebas · datos ficticios». Sin dominio, sin IP y sin lugar en la red: la dirección sale solo como ruta, `/buscar?matricula=`, y no se dice dónde vivirá ni cuándo se publica. Tres cajas donde la gente escribe: el login («usuario o contraseña incorrectos» y, con la consulta trucada, «Sesión abierta · sin contraseña»), el buscador de citas (matrícula) y las observaciones para el personal de la puerta. **El registro tiene ya tres portales distintos:** el de reservas de atraque (`hpa-portal-web-01`, V10, V11, V12 y V16), el de declaración de carga de una lección de sp4 (`sp/sp4-part1.ts:384`, donde un test encuentra el campo «número de contenedor» validado solo en el navegador y la cookie sin `HttpOnly`; ningún vídeo lo ha mostrado) y este, el de citas de camiones. En voz solo «la web donde los camiones pedirán cita»: «portal» únicamente sale en pantalla. V19 no lo une al de reservas | solo el 5-11 (la revisión) y el 13-11 (el plazo de la mejora) | `v19/src/data/s01-hook.ts:11`, `v19/src/data/echo.ts:9-10`, `v19/src/scenes/parts/Login.tsx:65-66`, `:73`, `:98`, `:101`, `v19/src/scenes/parts/WebWindow.tsx:9`, `v19/narration.json:26`, `sp/sp4-part2.ts:413`, `sp/sp4-part1.ts:384` |
| el proveedor de Internet | sin nombre; en voz, «tu proveedor de Internet» | la guardia lo llama a las 05:44; «filtrado en el proveedor · servicio anti-DDoS» | `v10/narration.json:238`, `v10/src/data/s05-amp.ts:59`, `:65` |

### Cuentas

| Cuenta | Qué es | Fuente |
|---|---|---|
| `svc_tosreport` | cuenta de servicio; línea base «informes, lunes a viernes 08-18 h»; su único punto fuera de horario es «hoy, 01:52»; credencial rotada / contraseña cambiada el 4-9 | `siem/src/data/s09-pivot.ts:36`, `:60`, `siem/src/scenes/parts/s09-pivot/UbaHeatmap.tsx:277`, `siem/src/scenes/parts/s10-contain/Closure.tsx:36-40`, `v5/src/data/s05-order.ts:63` |
| (ninguna más) | En el alcance del 3-9 no hay ninguna cuenta: aún no se sabía lo de la credencial | `v5/src/data/s03-scope.ts:6` (comentario), `v5/narration.json:110` |
| `svc_tosreport` (desde el 27-10) | en la bóveda de Sistemas, rota cada 24 h y al devolverse; sin privilegios especiales («retirados · solo sacaba informes») | `v6/src/data/s09-vault.ts:37-42`, `v6/src/scenes/parts/LogonCard.tsx:32` |
| `svc_edi` (desde el 27-10) | en la bóveda de Sistemas, sin más relación con el caso (no se liga al aviso de ejemplo del SIEM) | `v6/src/data/s09-vault.ts:37` |
| `r.haugen` | cuenta del puerto en el proveedor de identidad; la única que acierta el spraying del 21-10 (03:12:37) y sale a las 03:13:15 sin abrir ninguna aplicación; contraseña nueva y sesiones cerradas esa mañana. En voz, «una cuenta»: sin nombre completo, área ni género. Su contraseña cumplía la política, «y no es culpa de nadie» | `v10/src/data/s03-mfa.ts:9-10`, `:29`, `v10/narration.json:92`, `:108` |
| `a.berg` · `j.solheim` · `m.lund` · `k.nyborg` | las cuatro cuentas que fallan en las líneas legibles del spraying (las de la lección); las otras 175 no tienen nombre (deducido: 180 menos cinco) | `v10/src/data/s02-spray.ts:25-28`, `sp/sp2-part4.ts:65-68` |
| cuentas de las navieras en el portal | «zona de navieras» de `reservas.haldenport.example`, usuario y contraseña; no son de la plantilla ni pasan por el IdP de Halden. La tabla de s05 (dos cuentas con la misma huella y después con sal) es un «ejemplo · así no», sin nombres de usuario y con las contraseñas tapadas | `v11/src/data/s05-contrasenas.ts:2-8`, `:12-18` |
| `demo.citas` · `demo.puerta` · `demo.transporte` · `demo.revision` | cuentas de prueba de la copia de la web de citas (V19). `demo.citas` es el usuario del intento normal, con una contraseña equivocada que son solo ocho puntos; las cuatro son las filas que devuelve la consulta trucada («todas las filas», `id` 1 a 4). Ficticias: no son del puerto ni del proveedor de identidad (nada de `r.haugen` ni de las cuatro del spraying) y ninguna contraseña real, tampoco `Halden2026!`, sale en pantalla | `v19/src/data/s02-sqli.ts:10`, `:28-31` |

### Dominios, IP y hashes

| Valor en pantalla | Qué es | Fuente |
|---|---|---|
| `haldenport.example` | dominio público del puerto en V1 | `v1/src/scenes/S02Spoof.tsx:94`, `v1/src/scenes/S11Limits.tsx:137` |
| `v=DMARC1; p=none; rua=mailto:dmarc@haldenport.example` | DMARC del puerto el 3-9 | `v1/src/scenes/S03Dmarc.tsx:300`, `:315-319` |
| `v=spf1 ip4:203.0.113.10 -all` | SPF del puerto | `v1/src/scenes/S03Dmarc.tsx:78` |
| `hdn-mailer.example` (DKIM `s=selector1`) | dominio con el que el atacante pasa SPF y DKIM | `v1/src/scenes/S02Spoof.tsx:143`, `:148`, `v1/src/scenes/S03Dmarc.tsx:97` |
| `cdn-halden-sync.example` | C2, registrado hace dos días; bloqueado por el filtro DNS | `v1/src/scenes/S04Dns.tsx:9`, `v1/src/data/s08-scope.ts:19`, `v5/src/data/s06-eradicate.ts:55` |
| `haldenp0rt.example` | ejemplo de dominio parecido | `v1/src/scenes/S11Limits.tsx:149` |
| `reservas.haldenport.example` | nombre público del portal de reservas de atraque (V11); el segundo bajo `haldenport.example`, tras `mx.haldenport.example` | `v11/src/scenes/parts/TlsLine.tsx:61`, `v11/src/data/s01-hook.ts:16`, `v11/src/data/s05-contrasenas.ts:13` |
| certificado del portal desde el 9-11 | `CN = reservas.haldenport.example`, emitido por `Confianza Global TLS Issuing CA 3`, ECC de 256 bits con `ecdsa-with-SHA384`, `NotBefore: Nov  9 00:00:00 2026 GMT`, `NotAfter: May 27 23:59:59 2027 GMT`; el PEM de pantalla es inventado y truncado. Sustituye al de V11 (que caducaba el 11-11) | `v12/src/data/s02-cadena.ts:38-41`, `:43` |
| `Confianza Global Root` → `Confianza Global TLS Issuing CA 3` | la cadena de la CA pública ficticia de la lección. La intermedia: 384 bits, `RSA-SHA256`, del 14-3-2023 al 13-3-2033; la raíz se firma a sí misma (`Subject = Issuer`), «ya está en tu equipo» y el servidor no la manda. En V12 no se añade ni se quita ninguna raíz de ningún almacén | `v12/src/data/s03-arreglo.ts:38-41`, `:49-53`, `:55`, `v12/src/data/s02-cadena.ts:58` |
| `http://crl.confianza.example/issuing3.crl` · `http://ocsp.confianza.example` | las dos direcciones de revocación del certificado (las de la lección, `sp/sp1-part4.ts:325-326`); la CRL es una «lista firmada por la CA» que el cliente descarga cada cierto tiempo y OCSP es «preguntar a la CA al momento». Desde el 12-11 el portal sale a Internet hasta la segunda (deducido) | `v12/src/data/s04-revocar.ts:49`, `:51`, `v12/src/data/s05-ocsp.ts:12` |
| `SSL connection using TLSv1.3 / TLS_AES_256_GCM_SHA384 / X25519 / id-ecPublicKey` | la línea de `curl` de la conexión del 3-11, la «línea» de V11; su emisor, `CN=Confianza Global TLS Issuing CA 3`, es la CA intermedia ficticia de la lección (raíz `Confianza Global Root`) | `v11/src/scenes/parts/TlsLine.tsx:65`, `v11/src/data/s01-hook.ts:27`, `sp/sp1-part4.ts:312-326` |
| `vpn.puerto-halden.example`, `portal.puerto-halden.example` | dominios del puerto en el SIEM | `siem/src/data/s08-triage.ts:13`, `:15` |
| `10.20.6.140` | la dirección que recibe `ptl-pruebas-02` el 23-11 a las 09:40, en la VLAN de Oficinas. Deducido: la subred de `a.soto` (`10.20.6.52`, `siem/src/data/s03-normalize.ts:54-60`); ningún otro archivo usa la `.140` | `v17/src/data/s02-toma.ts:18` |
| `*.halden-port.local` | dominio interno | `sp/sp1-part3.ts:70` |
| `haldenp0rt.com`, `haldenp0rt-mail.com`, `ha1denport.com` | dominios trampa de las lecciones de sp2 | `sp/labs-sp2.ts:186`, `sp/sp2-part2.ts:129`, `:227` |
| `203.0.113.77:443` | IP fija de respaldo del malware del portátil | `v1/src/data/s07-edr.ts:28-31`, `v1/src/scenes/S04Dns.tsx:10` |
| `203.0.113.47:443` | destino de los 38 GB; «bloquear su servidor» | `siem/src/data/s08-triage.ts:29`, `siem/src/data/s09-pivot.ts:44`, `v5/src/data/s04-key.ts:76`, `:113` |
| 10.20.4.17 · 10.20.8.31 · 10.20.0.0/16 | `ADM-WS-07` · `srv-tc-app03` · red interna | `siem/src/data/s09-pivot.ts:39`, `siem/src/data/s08-triage.ts:24`, `siem/src/data/s07-tuning.ts:40` |
| 192.0.2.157 | origen del password spraying y del traversal del 21-10, los dos rastros que firma RED MARROW (en la lección, antes 185.22.9.41, que no es de documentación) | `v10/src/data/s02-spray.ts:25-29`, `v10/src/data/s04-traversal.ts:13`, `sp/sp2-part4.ts:65-69` |
| 198.51.100.61 · .140 · .203 · .212 | los cuatro resolvers abiertos legibles de los 340 de la amplificación DNS del 21-10 (UDP, puerto 53); servidores legítimos de terceros, no del atacante | `v10/src/data/s05-amp.ts:16-21`, `:60` |
| `GET /gate/viewdoc?file=../../../../etc/passwd  200  1834` · `GET /gate/viewdoc?file=%2e%2e%2f%2e%2e%2f%2e%2e%2fetc%2fshadow  403  0` | las dos peticiones del traversal (las de la lección, con la hora y el origen que añade V10 y sin el `HTTP/1.1`) | `v10/src/data/s04-traversal.ts:23-60`, `sp/sp2-part4.ts:61-62` |
| `' OR 1=1 --` | la carga de la SQL injection del login de la copia de pruebas (V19): una comilla, `OR 1=1` y `--`. Solo en pantalla; la voz dice «una comilla», «una condición que siempre se cumple» y «dos guiones». Es la de la lección, con su consulta `SELECT * FROM users WHERE name = '<input>' AND pass = '<input>'`; no toca el portal de reservas ni ningún dato real | `v19/src/data/query.ts:8`, `:11-15`, `v19/narration.json:50`, `:56`, `sp/sp2-part2.ts:301`, `:304` |
| `<script>enviar(document.cookie)</script>` · `&lt;script&gt;enviar(document.cookie)&lt;/script&gt;` | el script de ejemplo del buscador y de las observaciones, y el mismo texto ya codificado (s05). Solo en pantalla; `enviar(...)` no existe, no hay host, dominio ni dirección, y «sitio externo» es un rótulo genérico. `document.cookie` es la cookie de sesión que el script «podría» llevarse (condicional): nada sale de ningún sitio | `v19/src/data/echo.ts:5`, `:7`, `v19/src/data/s04-vuelve.ts:21-22`, `v19/narration.json:148` |
| `/buscar?matricula=` | la ruta de búsqueda de la copia de pruebas, sin dominio ni esquema: la barra de la ventana lleva solo una ruta o el nombre de la página | `v19/src/data/echo.ts:10`, `v19/src/scenes/parts/WebWindow.tsx:9` |
| `4821 KLM` · `1932 TRP` · `7740 DFN` · `0516 PXL` | matrículas inventadas del listado del día de la puerta (V19); `4821 KLM` es la matrícula con la que se prueba el buscador y la de la cita que se guarda con el script. Ninguna es de un caso | `v19/src/data/echo.ts:13`, `v19/src/data/s04-vuelve.ts:50-55` |
| `Halden2026!` | contraseña de `r.haugen` el 21-10; cumple la política (mayúscula, cifras, símbolo); solo la enseñan la tarjeta de la política y el mensaje de RED MARROW. En la lección es además el ejemplo de spraying y la contraseña del check de las 900 cuentas | `v10/src/data/s03-mfa.ts:16-22`, `v10/narration.json:101`, `sp/sp2-part4.ts:94`, `:124` |
| `b41f0e7c…c7a2` | hash del documento (caza de V1 y de V5) | `v1/src/data/s08-scope.ts:18`, `v5/src/data/s06-eradicate.ts:54` |
| `…\Temp\turnos_muelle3.docm` · firma «Microsoft Windows (válida)» | adjunto y contexto del EDR | `v1/src/data/s07-edr.ts:16-17`, `v1/src/scenes/S02Spoof.tsx:121` |
| `-enc JAB3AGMAPQBOAGUAdwAtA…` | PowerShell codificado | `v1/src/data/s07-edr.ts:24` |
| `9f2b7c…41d0` | SHA-256 del SSD y de `HPA-EV-003.E01` | `sp/sp4-part6.ts:68-70`, `v2/src/data/canon.ts:16` |
| `4e81a0…c92f` | hash de la copia rota de V2 s04 (contrafactual, no es del caso) | `v2/src/data/canon.ts:18` |
| `e3a1…9c07` · `58bd…f26e` · `a46f…0d3b` · `c2f7…8e15` · `7c1d…a4b0` · `2f9e…11c3` · `b80a…6d57` · `71c4…d2e8` | huellas inventadas y abreviadas de V11: la de la oferta y la del céntimo cambiado, la colisión de ejemplo (s04), la del inicio de sesión, la tabla «así no» y las dos con sal (s05) y la de la oferta falsa hipotética (s06). Ninguna es del caso | `v11/src/data/s04-huella.ts:11-13`, `:28`, `v11/src/data/s05-contrasenas.ts:22`, `:37-39`, `v11/src/data/s06-solo-huella.ts:28` |

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
| mejora de V10 | «MFA y lista de contraseñas prohibidas en el proveedor de identidad · Sistemas · 30-11» (la única con dueño y fecha; lo demás de esa mañana va sin fecha) | `v10/src/data/s03-mfa.ts:31` |
| mejora de V19 | «consultas parametrizadas y codificación de salida · en el portal de citas · Desarrollo · 13-11» (la única con dueño y fecha; la voz dice «Desarrollo corrige las tres cajas para el trece de noviembre»). Es un **plazo, no un hecho cumplido**, como el 30-11 de V10: ningún vídeo posterior la da por hecha sin enseñarla | `v19/src/data/s05-vitrina.ts:30-35`, `v19/narration.json:224` |
| los tres fallos de la revisión del 5-11 (V19) | uno por caja de texto de la copia de pruebas: SQL injection en el login (la consulta se arma pegando el texto), XSS reflejado en el buscador de citas (la página repite la matrícula tal cual) y XSS almacenado en las observaciones (se guardan y se muestran sin codificar). Son los tres de la copia y de nadie más; nada se explotó fuera de la revisión, y ninguno es el FINDING #0147 del portal de reservas (otro hecho, otro equipo) | `v19/narration.json:44`, `:62`, `:132`, `:166`, `:178` |
| «Oferta comercial 2027 · para una naviera» | la oferta del 3-11, «confidencial»: «atraque, por metro» 12,40 · «practicaje» 8,75 · «bonificación» 6 % («los precios del año que viene»). En s04 un céntimo pasa de 12,40 a 12,41 solo para enseñar la huella; la «oferta falsa» de s06 (9,90 · 8,75 · 15 %) es un ejemplo en condicional | `v11/src/scenes/parts/Fingerprint.tsx:298-305`, `v11/src/data/s03-naviera.ts:4`, `v11/narration.json:116`, `v11/src/data/s04-huella.ts:14`, `v11/src/data/s06-solo-huella.ts:19-26` |
| plan de zonas (V16) | «plan de zonas · aprobado en el comité de cambios · 20-11 · lo ejecuta Infraestructura (L. Ferrer) · por fases desde el 1-12». Seis zonas, cada una con su confianza y sin contenido (los sistemas los coloca el laboratorio): Internet «ninguna» · DMZ «baja» · interna «media» · OT «crítica, pero frágil» · gestión «máxima» · invitados «ninguna», con una garita entre cada dos; con ellas, el portátil de s03 «alcanza: su zona y lo que una regla permita». El portal, a la DMZ, con sus dos reglas. Los mandos de cada switch y cada cortafuegos, en la zona de gestión, que «solo responde al jump server» (caja «endurecido · MFA · sesión grabada»; en voz, «jump box o bastion host», «el único camino para administrar»). Dos controles en línea: un «cortafuegos de gestión» nuevo delante de esa zona, FAIL-CLOSED («lo único que se para es administrar», porque el tráfico del puerto no pasa por él), y el equipo «en la red de las bombas de las esclusas», FAIL-OPEN «o fuera del camino», por el aviso de Operaciones («si se paran las bombas, se puede inundar un muelle»), con «el riesgo se cubre separando y vigilando»; esa red va aparte, del color de la OT, sin nombre ni línea a ninguna zona o VLAN. Y «más sensores», que «reciben una copia del tráfico», en un tap y en un puerto espejo. Todo se dibuja como plano, nunca en marcha | `v16/src/scenes/parts/ZoneRow.tsx:37-53`, `:63`, `v16/src/data/s04-dmz.ts:22-25`, `v16/src/data/s05-jump.ts:22-28`, `v16/src/data/s07-decidir.ts:9-23`, `v16/src/data/s09-camara.ts:8-15`, `:64`, `v16/narration.json:254`, `:346`, `:352` |

## 4. Adversarios por sección

| Sección | Jefe | Adversario | Qué hace (flavor) | Qué revela su dosier | Fuente |
|---|---|---|---|---|---|
| sp1 | FIRST KEY | NULL CIPHER (ella, por la voz, desde V11) | célula de acceso inicial: badges clonados, cambios sin aprobar, certificados caducados | lector de badges clonado; certificado autofirmado instalado como raíz hace tres años; nota «el puerto sigue sin inventario», firmada GH | `sp/sections.ts:44-49` |
| sp2 | OPEN WOUND | RED MARROW (sin género fijado) | phishing, USB en el aparcamiento, proveedor comprometido | kits contra los operadores de grúas; malware por un proveedor de mantenimiento; «GH compra acceso a través de terceros» | `sp/sections.ts:63-68` |
| sp3 | LOAD BEARING | BLIND ARCHITECT (ella, por la voz, desde V16) | red plana, OT en la VLAN de oficinas, backups sin probar | PLC de las esclusas alcanzables desde la wifi de invitados; «GH busca un punto único de fallo» | `sp/sections.ts:82-87` |
| sp4 | NIGHT WATCH | SILENT PAGER (ella) | «Las alertas llegan a las 3 a. m. y nadie las lee» | movimiento lateral con cuentas de servicio sin rotar; logs sin centralizar; IP del mismo ASN que NULL CIPHER; «GH es una sola operación» | `sp/sections.ts:101-106` |
| sp5 | FINAL AUDIT | PAPER GOVERNOR | políticas sin dueño, riesgos sin registro, proveedor sin contrato | GLASS HARBOR era un contratista con acceso perpetuo y sin due diligence; el puerto vuelve a operar | `sp/sections.ts:120-125` |

La campaña promete «descubrir quién está detrás de GLASS HARBOR» (`src/data/tracks.ts:147-149`). En pantalla han salido cuatro:
SILENT PAGER en los vídeos de sp4 (`v1/video.json:8`, `v5/video.json:8`), RED MARROW en V10, la cápsula de sp2m7, su primera
aparición (`v10/video.json:8`; vuelve en V19, la cápsula de sp2m4, `v19/video.json:8`), NULL CIPHER en V11, la principal de sp1m6, también su primera aparición (`v11/video.json:8`; vuelve en V12, la cápsula de sp1m7, `v12/video.json:8`), y
BLIND ARCHITECT en V16, la principal de sp3m4, igualmente su primera aparición (`v16/video.json:8`), y otra vez en V17, la principal de sp3m5, su segunda aparición (`v17/video.json:8`).
SILENT PAGER y RED MARROW tutean a la analista; NULL CIPHER habla en infinitivo, sin persona (§5, «Notas de V11»); BLIND ARCHITECT
propone atajos de diseño, la tutea una sola vez y firma siempre «Menos es más.» (§5, «Notas de V16»):

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
| V10 s03 (RED MARROW) | «Halden2026! Cumple todas tus normas. Así que es segura. Confía en mí.» | `v10/narration.json:100-103` |
| V10 s04 (RED MARROW) | «Borra los puntos y las barras de la URL y listo. Confía en mí.» | `v10/narration.json:170-173` |
| V11 s02 (NULL CIPHER) | «Cifrar los gigas con RSA. Sin secreto que repartir. Lógico.» | `v11/narration.json:91` |
| V11 s03 (NULL CIPHER) | «Cifrar con la privada. Nadie más la tiene, nadie más lo lee. Lógico.» | `v11/narration.json:131` |
| V11 s06 (NULL CIPHER) | «Adjuntar el hash. Si la tocan, se nota. Si no, es del puerto. Lógico.» | `v11/narration.json:283` |
| V12 s03 (NULL CIPHER) | «Desactivar la verificación del certificado. Sigue cifrado. Lógico.» | `v12/narration.json:100` |
| V12 s04 (NULL CIPHER) | «¿Clave filtrada? Esperar a que caduque el certificado. Lógico.» | `v12/narration.json:152` |
| V16 s02 (BLIND ARCHITECT) | «¿Cortafuegos entre VLAN? Ya están separadas. Menos es más.» | `v16/narration.json:83` |
| V16 s04 (BLIND ARCHITECT) | «Deja el portal dentro, con su regla de entrada. Menos es más.» | `v16/narration.json:171` |
| V16 s06 (BLIND ARCHITECT) | «Si se cae, que deje pasar: el puerto no se para. Menos es más.» | `v16/narration.json:305` |
| V17 s02 (BLIND ARCHITECT) | «¿Cerrar tomas? Quien llega al enchufe ya es de casa. Menos es más.» | `v17/narration.json:77` |
| V17 s07 (BLIND ARCHITECT) | «Entre las dos sedes, modo transporte: menos cabeceras. Menos es más.» | `v17/narration.json:313` |
| V17 s09 (BLIND ARCHITECT) | «Túnel dividido para todos: va más rápido. Menos es más.» | `v17/narration.json:429` |
| V19 s03 (RED MARROW) | «Cifra la base de datos y no se llevan nada. Confía en mí.» | `v19/narration.json:95` |
| V19 s05 (RED MARROW) | «Si corre en el navegador, el fallo no es tuyo. Confía en mí.» | `v19/narration.json:199` |

**Lo que no se puede destripar** en un vídeo de lección:

- La IP del mismo ASN que NULL CIPHER (`sp/sections.ts:106`).
- «GH es una sola operación», ni que los cinco adversarios trabajan juntos; tampoco la firma «GH» de los dosieres (`sp/sections.ts:49`, `:68`, `:87`, `:106`).
- El dosier de RED MARROW: los kits contra los operadores de grúas, el malware que llega por un proveedor de mantenimiento y
  «GH compra acceso a través de terceros» (`sp/sections.ts:68`). V10 no insinúa que venda lo que consigue ni que trabaje con otros adversarios.
  V19 tampoco: ni grúas, ni proveedor de mantenimiento, ni «GH»; la narradora presenta a RED MARROW solo como «Es RED MARROW, que vive de engañar» (`v19/narration.json:92`) y sus dos consejos van a la analista, no a un operador ni a un proveedor.
- El dosier de NULL CIPHER: el lector de badges clonado, el certificado autofirmado instalado como raíz «temporalmente» y la nota
  «el puerto sigue sin inventario» (`sp/sections.ts:49`). V11 no enseña ningún autofirmado, ninguna raíz instalada ni ningún
  almacén de confianza tocado, no dice «inventario» y no le da a NULL CIPHER IP, dominio ni equipo.
- El dosier de BLIND ARCHITECT: que su plan dependía de que los PLC de las esclusas fueran alcanzables desde la wifi de invitados,
  que «segmentación y backups probados le cerraron el paso», «GH busca un punto único de fallo» y el «derrotada» (`sp/sections.ts:87`).
  V16 no dibuja ningún PLC ni ninguna wifi, ni una línea de una VLAN (ni de «invitados», que solo es un rótulo de la fila de zonas)
  a la OT o a la red de las bombas; no dice «punto único de fallo» (el «pilar» sale una vez, en la voz de la narradora, del anuncio
  del jefe, `sp/sections.ts:85`); no toca las copias, y no dice que el plan la derrote.
  V17 tampoco: sin wifi de invitados, sin PLC, sin «punto único de fallo» y sin «pilar»; la narradora la presenta como «BLIND ARCHITECT, que vive de los planos con atajos» (`v17/narration.json:50`).
- Quién es GLASS HARBOR (un contratista con acceso perpetuo) ni el final «el puerto vuelve a operar» (`sp/sections.ts:125`).
  Los contratistas de fondo siguen neutros: el portátil de contratista del NAC (`v1/src/scenes/S10Data.tsx:275`), la cuenta
  `ext.soporte` (`siem/src/data/s05-correlate.ts:11`) y el servidor de 2019 de un contratista (`sp/sp4-part2.ts:146`).
- Tampoco se culpa a nadie: ni a Lucía ni al turno de noche (`plan:564-565`, `v5/src/data/s09-plan.ts:5`, comentario), ni a quien montó
  la red de antes: «Nadie lo decidió, la red creció así» (`v16/narration.json:44`).

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
   V11 también sigue a V1: el portal de reservas es `reservas.haldenport.example` (`v11/src/scenes/parts/TlsLine.tsx:61`).
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
13. **Esclusas (sp3, fondo).** (Resuelta en parte el 2026-10-06, en la rama de V16: decisión 5 de la tanda 3, `dec3:29-32`, commit `83cd183`.)
    La lección sp3m2 decía que los PLC de las esclusas estaban «air-gapped» (`sp/sp3-part1.ts:394`), pero la misión 3 dice que todo cuelga del mismo
    switch, «hasta los PLC de las esclusas» (`sp/labs-sp3.ts:21`), sp3m4 lo repite (`sp/sp3-part2.ts:316`) y el dosier los hace alcanzables desde la
    wifi de invitados (`sp/sections.ts:87`). Ahora `sp/sp3-part1.ts:394` dice que lo air-gapped son «los sistemas de control de las grúas», como el
    check de esa misma lección (`:288`), y ninguna fuente aísla ya las esclusas. Queda el roce que apuntan las decisiones (`dec3:776-779`): un servidor
    de control de grúas lleva catorce meses hablando con un dominio de fuera (`sp/sp2-part1.ts:147`) y las tabletas de las grúas van en la wifi
    HALDEN-OPS (`sp/sp4-part1.ts:384`); se leen como sistemas de apoyo de las grúas, no su control. Más leve: la misión 3 habla de «pasearse de una
    impresora a una grúa» (`sp/labs-sp3.ts:21`) y el laboratorio coloca en una zona «The PLC that drives the container crane on quay 3»
    (`sp/labs-sp3.ts:93`). V16 no dibuja cómo está conectada la OT («Notas de V16»).

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
  fecha», reloj 00:04 (`v6/src/data/s08-fatigue.ts:9`). V10 fija la MFA del proveedor de identidad para el 30-11 (`v10/src/data/s03-mfa.ts:31`); V6 no se adelanta.
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

### Notas de V10

- **El 21-10 el proveedor de identidad solo pedía contraseña** («IdP de Halden · pide: contraseña», `v10/src/data/s03-mfa.ts:13`), y por eso
  acierta el spraying. La MFA, con la lista de contraseñas prohibidas, es una mejora con dueño y fecha, «Sistemas · 30-11», que solo sale en
  pantalla; la voz dice «Es la MFA» (`v10/narration.json:120`, `notas-v10:16-17`). Cuadra con V6, que tampoco le enseña segundo factor.
  Un vídeo fechado antes del 30-11 no le pone MFA al IdP, y uno posterior no la da por hecha sin enseñarla.
- **El registro de RED MARROW.** Tutea a la analista con frases cortas e ironía, como SILENT PAGER, pero es el estafador amable: da consejos
  de amigo que son mentira y cierra los dos mensajes con «Confía en mí» (`v10/narration.json:101`, `:171`). La narradora lo presenta como
  «RED MARROW, que vive de engañar» (`:98`); lo de «con correos falsos y memorias USB» se cayó por duración (`notas-v10:29-30`). Ningún texto
  le pone artículo ni adjetivo con género, y la voz (`sapi/Microsoft Laura` con el efecto `telefono`, `v10/narration.json:11-15`) no lo fija:
  decisión de Lidia del 2026-10-04 (`plan:1505-1510`). Un vídeo posterior puede fijarlo, igual que SILENT PAGER es «ella» y suena con Pablo.
- **Las 05:40 y las 05:44 son casualidad.** Coinciden con la entrega al laboratorio y el arranque de `ewfacquire` de V2 (4-9, §2): otra noche
  y otro hecho (`notas-v10:57-58`). Lo mismo con las 03:12: la voz no dice la hora del acierto para no recordar la pregunta de spl4a y de
  sp4m11 (`sp/labs-sp4.ts:93`, `sp/sp4-part6.ts:125`), que es del 4-9 y no tiene nada que ver con `r.haugen`.
- **La guardia no paró el ataque.** Llamó al proveedor a las 05:44; el NetFlow sigue hasta las 06:05 y la voz no dice que acabara por la
  llamada: «lo que no pediste no se para en tu portal» (`v10/narration.json:254`, `notas-v10:35-37`).
- **Ni «SOC» ni «la analista» salen en V10**, que habla en segunda persona; «proveedor de identidad» y «DDoS» están en pantalla, no en la
  voz (`notas-v10:62`).
- **Parecidos que no son el mismo hecho.** El check de las 900 cuentas, justo antes del vídeo en la lección (`sp/sp2-part4.ts:124`), es otra
  noche, con la misma `Halden2026!` y sin acierto; la voz no los enlaza. `192.0.2.10` (escaneo bloqueado de la cola tranquila del SIEM, 4-9,
  `siem/src/data/s08-triage.ts:16`) comparte /24 con `192.0.2.157`, y `198.51.100.23` (`siem/src/data/s04-enrich.ts:16`) con los resolvers:
  son rangos de documentación y no hay relación. Ninguna IP de V10 cae en `203.0.113.0/24`, la de SILENT PAGER.
- **Lo que V10 calla a propósito** (no son huecos que rellenar): por qué se cerró la sesión de `r.haugen` (nada de «la guardó» ni «para
  venderla»); qué se hizo con el `/etc/passwd` del portal; quién lanzó la amplificación DNS, que nadie firma (y no es el DDoS del portal de
  ferris de spl2a, `plan:1473-1474`); cualquier relación con el caso `IR-2026-0147`, SILENT PAGER o `svc_tosreport`; el FINDING #0147 del
  escaneo del 1-9 en el mismo portal (`sp/sp4-part3.ts:55`), que es otro fallo; la VPN; y el nombre completo, el área o el género de `r.haugen`.

### Notas de V11

- **El 3-11 no tiene hora.** Es martes (calendario) y queda después de todo lo fechado de Halden (V6 hasta el 28-10, el plazo de V5
  del 31-10) y antes de la MFA del proveedor de identidad (30-11, V10). Para quien sigue el curso es el primer vídeo de Halden (sp1):
  no recuerda el caso de septiembre ni la noche de V10.
- **El portal de V11 es el de V10, sin nada de V10.** La tira «portal de reservas de atraque» (`v11/src/data/s01-hook.ts:12`) es la
  descripción de `hpa-portal-web-01` (`sp/sp4-part3.ts:56`), pero el nombre del equipo no sale en V11. Ningún vídeo dice qué pudo leer
  el traversal del 21-10: ni las contraseñas de las navieras, ni la clave del certificado, ni las ofertas. Por eso la oferta falsa de
  s06 es una hipótesis con el buzón («ejemplo · así no · lo que propone NULL CIPHER», «Imagínate que…»,
  `v11/src/data/s06-solo-huella.ts:17`, `v11/narration.json:290`), y nadie cambia nada en el portal.
- **«autenticación no requerida» no choca con la zona de navieras.** El FINDING #0147 del 1-9 (`sp/sp4-part3.ts:57`) habla de
  explotar el fallo sin credenciales (`PR:N` en el vector CVSS, `:60`), no de que el portal no tenga inicio de sesión.
- **El registro de NULL CIPHER.** Habla como un manual de procedimiento: infinitivo y ninguna persona gramatical, una razón técnica
  que suena bien y lleva a la conclusión equivocada, y siempre «Lógico.» al final (§4). No tutea, a diferencia de SILENT PAGER y RED
  MARROW. Solo da consejos: no ataca nada y no tiene IP, dominio ni equipo en pantalla. La narradora la presenta con el anuncio del
  jefe de sp1 (`sp/sections.ts:47`): «Aquí aparece NULL CIPHER, una célula de acceso inicial. Busca el primer hueco que no cierre»
  (`v11/narration.json:88`); en pantalla, «NULL CIPHER · célula de acceso inicial» (`v11/src/data/s02-familias.ts:31`). Ni puertas
  ni llaves para NULL CIPHER: son la imagen del spraying de RED MARROW en V10.
- **Género.** Ningún texto de V11 lo marca («una célula» concuerda con la palabra). La voz, `sapi/Microsoft Helena` con el efecto
  `cifrado` (`v11/narration.json:11-15`), la fija como mujer, igual que «NULL CIPHER neutralizada» en el curso (`sp/sections.ts:49`).
  Lo decidió la ronda de la tanda 3, que Lidia delegó el 2026-10-05 (`docs/reviews/2026-10-05-fichas-tanda3/decisiones.md:11`,
  `:197-200`). Helena es también la voz de BLIND ARCHITECT (V16), con otro ritmo y otro efecto; V12 hereda la voz de V11.
- **La oferta va cifrada para la naviera y firmada por el puerto**, y en la práctica es híbrida: el documento con una clave simétrica,
  y esa clave por el buzón de la naviera (`v11/narration.json:444`). No se dice dónde guarda el puerto su clave de firma.
- **Lo que V11 calla a propósito** (no son huecos que rellenar): la IP del portal (el `curl` deja fuera la línea «Connected to…»,
  `v11/src/data/s01-hook.ts:4`); el nombre de la naviera; dónde vive el portal en la red; cualquier relación con `IR-2026-0147`,
  SILENT PAGER, RED MARROW o la noche del 21-10; el FINDING #0147; el dosier de NULL CIPHER (§4); y cualquier cambio en el portal,
  aprobado o no, aunque el anuncio de su jefe hable de «cambios sin aprobar» (`sp/sections.ts:47`).

### Notas de V12

- **Del 9 al 12-11, solo en pantalla.** Lunes, martes y jueves (calendario), después de V11 (3-11) y antes de V16 (16-11) y de la MFA del proveedor de
  identidad (30-11, V10). La voz dice «El lunes», «El martes» y «el jueves» (`v12/narration.json:39`, `:207`); los días y las horas de Halden salen en las tiras
  (`v12/src/data/s01-hook.ts:37`, `:46`, `v12/src/data/s03-arreglo.ts:23`). Continúa V11: el mismo portal y, como allí, una naviera sin nombre.
- **Las horas de las consolas son GMT y no se reetiquetan.** El `NotBefore` del 9-11 a las 00:00 GMT, la respuesta grapada de las 08:00 a las 20:00 GMT: Halden va una
  hora por delante, pero ninguna pantalla lo convierte (`v12/src/data/s05-ocsp.ts:6`). Las horas de Halden (08:15, 08:40, 09:10) van en las tiras y en el título de la consola
  (`v12/src/data/s02-cadena.ts:25`).
- **`Next Update` es el 12-11 a las 20:00 GMT, no el 19-11.** La ficha del plan decía que la respuesta valía del 12 al 19-11; la pantalla la caduca esa misma noche («caduca
  esta noche», `v12/src/data/s05-ocsp.ts:6`, `:49`, `:53`). En el registro vale la pantalla.
- **Nada se revoca ni se filtra ninguna clave.** Toda la revocación va en condicional («si se filtrara la clave», `v12/src/data/s04-revocar.ts:5`, `:35`) y la voz no pone
  ningún ejemplo de cómo saldría. Es el portal del traversal del 21-10 (V10), cuyo alcance ningún vídeo dice: quien lo vio lo juntaría con esa noche. Un guion posterior no dice
  que la clave del portal se filtrara ni que no.
- **Sin culpables.** «Infraestructura» es el único responsable en pantalla y nadie tiene nombre; el despiste es «de los más comunes» (`v12/src/data/s03-arreglo.ts:6`, `:21`).
  No es «nadie sabía que caducaba»: la renovación llega antes de la caducidad, y lo que falta es el fichero de la cadena.
- **El registro de NULL CIPHER, segunda aparición.** El de V11 (§4): infinitivo, sin persona, una razón técnica que suena bien y «Lógico.» al final. Aparece con la tarjeta «Vuelve NULL CIPHER»
  (`v12/src/data/s03-arreglo.ts:14`) y «tiene una solución de manual» (`v12/narration.json:91`). Solo da consejos: no tiene IP, dominio ni equipo, ningún certificado autofirmado, ninguna
  raíz «temporal» ni nada que ver con el despiste de la cadena; quien se pone en medio en s03 es un dibujo genérico y sin nombre (`v12/src/data/s03-arreglo.ts:16`).
- **La CA es la pública ficticia de la lección** (Confianza Global). La CA interna de `*.halden-port.local` (CHG-2041, `sp/sp1-part3.ts:70-83`) no sale y sigue sin definir.
- **Lo que V12 calla a propósito** (no son huecos que rellenar): qué pudo leer el traversal del 21-10; el dosier de NULL CIPHER (`sp/sections.ts:49`); CHG-2041; contratistas y
  proveedores; el caso `IR-2026-0147`; y cualquier nombre de persona.

### Notas de V16

- **El 16-11 y el 20-11, solo en pantalla.** Lunes y viernes (calendario), después de V11 (3-11) y antes de la MFA del proveedor
  de identidad (30-11, V10); la voz no fecha nada, como V11 (`notas-v16:34`). Ningún hecho del vídeo pasa después del 20-11, y el
  1-12 solo sale en el sello. Para quien sigue el curso es el primer vídeo de sp3 y lo ve antes que cualquiera de sp4: no dice «como
  ya viste» y explica entera la cámara del tap, aunque V1 la use (`v1/narration.json:215`).
- **El plan es un plano.** El 16-11 no funciona nada nuevo: el jump server y su segundo factor van en futuro («será», «pedirá»,
  «irán», `v16/narration.json:226-232`), el equipo de las bombas «se va a instalar» (`:352`), «Con el plan, el mismo portátil…»
  (`:132`), y la pantalla lo dibuja con la etiqueta «plan», nunca en la servilleta (`v16/src/scenes/parts/ZoneRow.tsx:93`). Un vídeo
  fechado antes del 1-12 no enseña en marcha ninguna zona nueva, ni la DMZ, ni el jump server, ni su MFA.
- **«Tienen nombre, pero no son zonas»** habla de las cuatro VLAN, no de toda la red (`v16/narration.json:44`): el cortafuegos
  interno de Operaciones ya es una frontera (en V1, «Cortafuegos · Zona Operaciones»), y V16 ni lo nombra en voz ni lo llama «el
  único» (s03-02 dice «A casi todo», `:120`). Un guion no dice que el puerto no tuviera ninguna zona. Y «Nadie lo decidió»: la red
  de antes creció así, sin culpable (§4).
- **La garita vacía no es un modo de fallo.** En s02 nadie puso nunca un control («en la garita nunca ha habido nadie, y la barrera
  está levantada», `v16/narration.json:74`); la barrera que se queda arriba por avería es la de s06, «en un apagón», con vigilante y corriente antes
  del corte (`:284-290`; `v16/src/data/s06-barrera.ts:3`, comentario). Un guion no llama fail-open a la garita vacía ni dice que una VLAN «no
  separa nada»: «la VLAN aparta el tráfico» (`v16/narration.json:80`); lo que no hace es decidir qué cruza. Y el fail-closed de gestión solo para la
  administración («Lo único que se para es administrar», `:346`), nunca «no pasa nada».
- **El registro de BLIND ARCHITECT.** Habla como un arquitecto con prisa: cada mensaje es un atajo de diseño que quita una pared o un paso (la
  VLAN como zona, el portal dentro, dejar pasar siempre), en frases cortas, y siempre «Menos es más.» al final, como el «Confía en
  mí» de RED MARROW y el «Lógico.» de NULL CIPHER. La tutea una sola vez («Deja el portal dentro…», `v16/narration.json:171`); los otros dos mensajes
  van sin persona, aunque la ficha dijera que la tutea (`plan:2976`). La narradora la presenta una vez, con el anuncio del jefe de sp3
  (`sp/sections.ts:85`): «Es BLIND ARCHITECT, que vive de los planos con atajos, y le basta con que falle un pilar» (`v16/narration.json:50`); en
  pantalla, sin retrato, «BLIND ARCHITECT · sección 3» con «vive de los planos con atajos» (`v16/src/data/s01-hook.ts:26`). «Pilar»
  solo sale ahí. El remate recoge su firma: «Y cuando alguien te diga que menos es más, cuenta las garitas» (`v16/narration.json:472`). Solo da
  consejos: no ataca nada, no tiene IP, dominio ni equipo, y nunca habla de cifrado, claves ni certificados (el terreno de NULL CIPHER).
- **Género.** Ningún texto de V16 lo marca («Es BLIND ARCHITECT»; «le basta» y «le viene» no lo marcan, y «separadas», en el
  mensaje de s02, va con las VLAN). La voz, `sapi/Microsoft Helena` a `rate` −2 con el efecto `megafonia`, un aviso por los altavoces
  de una nave vacía (`v16/narration.json:11-15`), la fija como mujer, igual que «BLIND ARCHITECT derrotada» en el curso
  (`sp/sections.ts:87`): decisión 1 de la tanda 3 (`dec3:17-22`). Es la voz de NULL CIPHER con otro ritmo y otro efecto (V11: `rate` 0,
  `cifrado`), y no tiene voz de reserva.
- **Cada imagen en su sitio.** El puerto desde arriba de s02 (la calle, la terminal de pasajeros, las oficinas, el muelle y la sala de
  control de Operaciones, cada área con su valla y su garita) ilustra las zonas; la ventanilla «de navieras y transportistas» de s04 es
  la DMZ, y solo se parece al departamento de V6 («Atención a navieras»); la sala de mandos de la red con una sola puerta de s05 es el
  jump server, y no es la sala de control de Operaciones (en V1, la del muelle 3); las puertas de s08 están en el edificio de oficinas
  (`v16/src/data/s02-garita.ts:13-21`, `v16/src/data/s04-dmz.ts:16-20`, `v16/src/data/s05-jump.ts:15-20`, `v16/src/data/s08-puertas.ts:9`).
- **La OT, sin conexión.** Ni la servilleta ni el plan dibujan cómo está conectada hoy la OT: la servilleta no tiene caja de OT ni
  PLC, el plan la pinta como zona sin decir de dónde viene, y el equipo de s07 va «en la red de las bombas de las esclusas», sin
  línea hacia ninguna VLAN (`v16/src/data/s07-decidir.ts:18`). La voz no dice OT ni PLC. Es un silencio, no un dato: el anuncio del
  jefe pone la OT en la VLAN de oficinas (`sp/sections.ts:85`) y la lección, los PLC de las esclusas en el mismo conmutador
  (`sp/sp3-part2.ts:316`). Un guion posterior puede enseñarlo, pero no como algo que fijara V16, y no como zona en marcha antes del
  1-12 (punto 13).
- **Nada corta la salida del portal a Internet.** Las reglas de la DMZ acotan lo que entra desde Internet y lo que pasa a la red
  interna (`v16/src/data/s04-dmz.ts:22-25`); la salida del propio portal hacia Internet no se toca (la ronda de la tanda 3 lo pidió
  por el OCSP de V12, `dec3:59-60`).
- **Lo que V16 calla a propósito** (no son huecos que rellenar): el caso `IR-2026-0147` y sus equipos (ni `ADM-WS-*` ni
  `srv-tc-app03`), y que las zonas habrían frenado algo en septiembre; la VLAN de cuarentena del SIEM; la noche del 21-10 y el
  FINDING #0147 (del portal solo dice dónde estaba y adónde va, y «quien lo rompa» es una hipótesis sin pasado, `v16/narration.json:168`, `:208`);
  contratistas, integradores y proveedores (la caja «Contratistas» de V1 no sale); el proveedor de identidad y su MFA del 30-11;
  `fw-int01`, `srv-gis01` y `reservas.haldenport.example`; los sistemas del laboratorio Zone Defense (las zonas van sin contenido);
  y cualquier nombre de puesto o de persona, salvo L. Ferrer en el sello.

### Notas de V17

- **Del 23 al 27-11, solo en pantalla.** Lunes, miércoles y viernes (calendario), la semana siguiente a V16 (16 y 20-11) y antes de la MFA del
  proveedor de identidad (30-11, V10). Las fechas salen en los sellos (`v17/src/data/s02-toma.ts:12`, `v17/src/data/s05-sedes.ts:12`,
  `v17/src/data/s09-tunel.ts:44`); la voz solo dice «Es lunes», «El miércoles» y «el viernes». Ningún hecho del vídeo pasa después del 27-11 y el 1-12
  solo sale en sellos y en la regla de s04 (`v17/src/data/s04-eap.ts:21`).
- **Nada de lo que se aprueba funciona antes del 1-12.** 802.1X sale con la etiqueta fija «con 802.1X · así será desde el 1-12», y el túnel completo con
  el sello «aprobado»; la única toma real es la del 23-11, que no preguntaba (`v17/src/data/s04-eap.ts:21`, `v17/src/data/s09-tunel.ts:44`). Un guion
  fechado antes del 1-12 no enseña 802.1X ni el túnel completo funcionando, ni la MFA de la VPN.
- **Que esta toma no preguntara no es el NAC de V1.** V17 no dice dónde está el NAC que V1 enseña (el portátil de contratista que acaba en una VLAN de
  cuarentena, `v1/src/scenes/S10Data.tsx:268-281`) ni lo contradice: solo que esa toma no pedía nada. Un guion no dice que el puerto «no tenía NAC» ni
  que "todas" sus tomas estuvieran abiertas (`v17/src/data/s02-toma.ts:7-8`). La VLAN de cuarentena de s04 es la del switch (su destino si 802.1X rechaza), no una
  de las zonas de V16 (`v17/src/data/s04-eap.ts:7-9`, `:36`).
- **Qué enseña de EAP.** Como concepto y sin certificado concreto: «EAP-TLS» es el método más fuerte, con certificado en el equipo y en el servidor
  (`v17/narration.json:166`); ningún certificado del puerto ni el estado de su PKI (terreno de NULL CIPHER y de V11–V12).
- **El túnel ya existía.** El 25-11 se revisa, no se construye; el vídeo no dice desde cuándo ni por qué las dos redes están unidas, y no lo relaciona con
  el caso `IR-2026-0147` ni con los 38 GB (`v17/src/data/s05-sedes.ts:3-8`). Las «nueve terminales pequeñas» con circuitos dedicados de la q4 de la
  lección son otras.
- **Quien se conecta desde el hotel es «alguien del puerto de viaje».** Ni contratista, ni mantenimiento de grúas (el de spl2a, `sp/labs-sp2.ts:100`), ni
  proveedor; el hotel solo deja salir web, y por un proxy (`v17/src/data/s08-hotel.ts:17-19`). «VPN sobre TLS · 443/tcp» se une a la etiqueta solo tras
  la pregunta de IPSec o TLS (`v17/src/data/s08-hotel.ts:3-4`, `:13-14`).
- **El registro de BLIND ARCHITECT, segunda aparición.** Mismos tics que en V16: un atajo de diseño por camino (no cerrar las tomas, el modo transporte
  entre sedes, el túnel dividido para todos), en frases cortas y con «Menos es más.» al final; el de s02 empieza con una pregunta. No la tutea
  en ningún mensaje (en V16 lo hacía una vez). Sigue sin ataque, sin IP, sin dominio y sin cifrado (`v17/narration.json:77`,
  `:313`, `:429`).
- **Lo que V17 calla a propósito** (no son huecos que rellenar): cómo se inicia sesión en la VPN (factores, MFA y el 30-11; el servidor
  `vpn.puerto-halden.example`); el NAC de V1 y su contratista; cualquier contratista, técnico o proveedor en una escena; el certificado raíz
  autofirmado del dosier de NULL CIPHER; el caso `IR-2026-0147`; la noche del 21-10 y el portal; WAF, UTM, NGFW, SD-WAN y SASE (los remata la nota de examen de la
  lección, `sp/sp3-part3.ts:227-232`).

### Notas de V19

- **El 5-11 y el 13-11.** Jueves y viernes (Node). El 5-11 queda entre V11 (3-11) y V12 (9 al 12-11), y el 13-11 entre V12 y V16 (16-11): ningún hecho
  de otro vídeo cae en esos días. El jueves, las 10:00, solo en el sello (`v19/src/data/s01-hook.ts:9`); la voz no dice «jueves» ni «cinco de noviembre»
  (`v19/narration.json:26`). El 13-11 sí sale en pantalla («13-11», `v19/src/data/s05-vitrina.ts:34`) y en voz («para el trece de noviembre»,
  `v19/narration.json:224`), sin día de la semana: el viernes es deducido. Las «10:00» ya tenían historia en este registro (el triaje del 4-9 por la
  mañana, §2): otro día y otro asunto, sin relación.
- **Es una copia de pruebas y no el portal de reservas.** El traversal de V10, la «zona de navieras» de V11 y el certificado de V12 son del portal de
  reservas (`hpa-portal-web-01`); V19 no lo enseña, no lo nombra y no lo compara («como la del portal»), y no retoma que el traversal «no es una inyección» (`v10/narration.json:162`).
  Qué pudo leer el traversal del 21-10 sigue sin decirse (§5, «Notas de V10»): V19 no pone ningún ejemplo que lo sugiera, ni contraseñas de navieras ni
  ficheros del sistema. Quien sigue el curso en orden ve V19 antes que V10 y no tiene por qué relacionarlos; un guion posterior no junta las dos webs.
- **«Portal» solo en pantalla.** La voz dice «la web donde los camiones pedirán cita» (`v19/narration.json:26`) y nunca «el portal» ni «la web de
  citas»; «portal» sale en la ventana «Acceso al portal» (`v19/src/scenes/parts/Login.tsx:101`) y en la línea del 13-11 (`v19/src/data/s05-vitrina.ts:32`).
  (Superado: `notas-v19` y la ficha decían que la voz diría «la web de citas»; la versión final no lo dice.) Las tres webs del registro, en §3.
- **Nada se ejecutó fuera de la revisión.** El script es de prueba. La cookie solo «podría» irse (`v19/narration.json:148`, `v19/src/data/s04-vuelve.ts:21`),
  siempre en condicional: la voz no dice que se robe ni que salga «siempre». El listado del día lo «abrirá» el personal de la puerta y su navegador lo
  «ejecutaría» (`v19/narration.json:172`): nadie lo abrió. Nada de eso es el caso de septiembre ni la noche del 21-10.
- **El consejo de RED MARROW sobre el cifrado es una mentira con matiz.** La voz corrige el error, no el cifrado: «el cifrado en reposo protege el disco
  si se lo llevan», pero «la consulta trucada sale de la propia aplicación, que ve los datos descifrados» (`v19/narration.json:102`,
  `v19/src/data/s03-casilla.ts:14-15`, `:18`). No dice «cifrar no sirve»: con cifrado de columna o de aplicación el resultado sería otro. Un guion
  posterior tampoco lo dice a secas.
- **La línea del examen.** En voz, «input validation, o su versión específica» (`v19/narration.json:212`, `:242`); en pantalla, «input validation
  (validar la entrada), o su versión específica (parameterized queries, output encoding), es la respuesta» (`v19/src/data/s05-vitrina.ts:27`). Es la
  redacción de la nota de examen de la lección, hoy en `sp/sp2-part2.ts:348` (la ficha y los comentarios del vídeo la citan como `:337`, antes de
  insertar el vídeo en `:333-343`). El vídeo no dice «si entre las opciones ves» ni «si solo ves», y que gane la versión específica cuando salen las
  dos es una inferencia de la q2 que no se dice. La nota de la lección dice «un firewall de red»: la revisión de exactitud proponía ese cambio y quedó
  aplicado en `04cee01`.
- **El registro de RED MARROW, segunda aparición.** El mismo tono de V10: consejos de amigo que son mentira, frases cortas y «Confía en mí.»
  (`v19/narration.json:95`, `:199`), con la misma voz y el mismo efecto (`sapi/Microsoft Laura` y `telefono`, `v19/narration.json:11-15`, como
  `v10/narration.json:11-15`). Se presenta con una frase, «que vive de engañar» (`v19/narration.json:92`), sin «y sí, cumple las normas» (eso es de V10),
  sin «otra vez» ni «vuelve»; en s05, «RED MARROW sigue con sus ideas» (`v19/narration.json:190`), dentro del mismo vídeo. Tutea («Cifra», «Confía en mí», `:95`;
  «tuyo», «Confía en mí», `:199`), no lleva artículo ni adjetivo con género y la voz no lo fija (decisión de Lidia del 2026-10-04, «Notas de V10»). En el calendario del
  caso es su segunda aparición (V10, 20 al 21-10; V19, 5-11). Sus dos mentiras son nuevas: ni `Halden2026!` ni «borra los puntos y las barras». Solo da
  consejos: no lanza los fallos ni el script, y no tiene IP, dominio ni equipo.
- **«Suele llegar por phishing» no es de RED MARROW.** Es la frase de la lección (`v19/narration.json:160`) y va en s04; el mensaje de RED MARROW
  de s05 llega después, con el tablón de por medio, y la voz no los relaciona.
- **Lo que V19 calla a propósito** (no son huecos que rellenar): el portal de reservas y todo lo de V10, V11 y V12; el caso `IR-2026-0147`, `svc_tosreport`,
  SILENT PAGER y el FINDING #0147; el dosier de RED MARROW (kits contra los operadores de grúas, el proveedor de mantenimiento y «GH compra acceso a
  través de terceros», `sp/sections.ts:68`: las víctimas del vídeo son quien prueba y el personal de la puerta); WAF y cortafuegos de red (la voz solo
  dice que cifrar la base no arregla la causa; el WAF que frena estos ataques mientras se corrige el código es de otra lección, `sp/sp3-part3.ts:66`,
  `:230`); `HttpOnly` y las cookies seguras (`sp/sp4-part1.ts:378`, `:495`); el XSS basado en DOM (la lección tampoco lo trata) y las demás inyecciones
  (command injection solo sale en la nota de examen); la política de contenido (CSP), que es solo un rótulo gris en pantalla
  (`v19/src/data/s05-vitrina.ts:24`); el SAST del pipeline de la lección de sp4 (`sp/sp4-part2.ts:413`); qué sistema de la puerta lee el listado; el
  dominio, la IP y el lugar en la red de la copia; ninguna cuenta del puerto; y el género de RED MARROW.

### Huecos (ninguna fuente lo dice)

- **Por dónde salieron los 38 GB.** V1 retira la regla 3 el 3-9, sin hora (`v1/narration.json:209`); con la tabla corregida (`v1/src/scenes/S05Rules.tsx:20-26`)
  nada deja salir a `srv-tc-app03` por el 443, y aun así salen a las 02:00 (`siem/src/data/s08-triage.ts:28-31`). V5 solo «confirma» la regla (`v5/src/data/s06-eradicate.ts:36`).
  (deducido de V16, aceptado en la decisión 6 de la tanda 3, `dec3:691-698`) La regla 3 vivía en el cortafuegos interno, el de «Zona Operaciones»
  (`v1/src/scenes/S05Rules.tsx:22`, `:88`); la VLAN de Producción, donde el SIEM tiene `srv-tc-app03` (`siem/src/scenes/parts/s10-contain/Topology.tsx:70`, `:303`),
  cuelga de `rt-core` y sale por `fw-perimetro-01` (`v16/src/scenes/parts/Napkin.tsx:34-43`), que el arreglo de V1 no tocó: la salida de Producción no
  pasaba por el cortafuegos de Operaciones. **Ningún vídeo lo dice en voz ni lo enseña**: V16 no junta Producción con la salida de septiembre
  (Producción solo es el destino del paquete de ejemplo de s02) ni dibuja `srv-tc-app03`. Es una deducción para el registro, no canon.
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
  Ya no cae en la noche del caso; la pregunta de spl4a sigue siendo del 4-9 y no tiene que ver con él. V10, publicado el 2026-10-05, lo enseña así (§2, 21-10).
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
- V10: «el portal no responde en esos 25 minutos y el ataque se para solo» (`plan:1496`). En pantalla solo están la ventana 05:40–06:05 y el
  «aviso de caída» de la guardia.
- V10: lo que se hace esa misma mañana además de las tres acciones de s03, es decir, `192.0.2.157` bloqueada en el perímetro, el visor que
  resolverá y confinará la ruta y el filtrado anti-DDoS en el proveedor (`plan:1500-1503`, `notas-v10:36-37`). En pantalla son una acción
  general («bloquear el origen, no las cuentas»), una defensa y una respuesta, sin fecha.
- V10: «el umbral de bloqueo del puerto es de 5 fallos» (`plan:1486-1487`). La pantalla pone «umbral: 5 fallos» en la puerta de contraejemplo
  de la imagen, no en el registro.
- V11: el certificado del portal es `CN=reservas.haldenport.example`, con clave ECC P-256 y válido desde el 11-11-2025; y el propio
  servidor termina TLS (`plan:1749-1755`). En pantalla solo salen el emisor, «verify ok» y la caducidad, esta a media luz.
- V11: el portal guarda las contraseñas de las navieras con salt por cuenta y key stretching (`plan:1756-1758`). En pantalla, «el portal
  guarda su huella», no la contraseña cifrada (`v11/src/data/s05-contrasenas.ts:22-25`); la sal y el estiramiento se enseñan, pero no
  se dicen del portal.
- V16: los sensores nuevos se suman al que V1 ya tenía detrás del cortafuegos el 3-9 (`plan:2971-2972`, `v1/narration.json:215`). En
  pantalla y en voz, solo «más sensores» (`v16/src/data/s09-camara.ts:9`, `v16/narration.json:406`), sin decir cuántos había ni dónde.
- V16: por qué las fases empiezan el 1-12 y no dentro de la semana del 16 al 20-11 (`plan:2973-2975`): para que el jump server con MFA
  nunca funcione antes del 30-11 y el vídeo no tenga que decir de dónde sale su segundo factor. En pantalla, solo «por fases desde el 1-12».
- (Superado: V17 está publicado y su canon, en §2, §3 y «Notas de V17».) V16: lo continúa V17 (sp3m5, aún en ficha) la semana siguiente, del 23 al 27-11, con el plan todavía sin poner en marcha
  (`plan:2786-2787`, `dec3:54-58`). Nada de V17 es canon hasta que se publique.
- V12: la clave del certificado nuevo es ECC P-256 y su validez son 200 días justos (9-11 a 27-5-2027, los dos incluidos), el máximo de un certificado público de TLS desde
  el 15-3-2026 (`plan:1949-1952`). En pantalla solo salen «id-ecPublicKey, 256 (bit)» y las dos fechas; los 200 días no se dicen.
- V12: `Next Update` del 19-11 (`plan:1964-1965`). Superado: la pantalla pone el 12-11 a las 20:00 GMT (ver «Notas de V12»).
- V19: la ficha pedía en s01 «las herramientas ayudan, pero nada sustituye a probar la web» y que el vídeo no hablara del pipeline que la lección de sp4 le da a este portal (`plan:3653`, `sp/sp4-part2.ts:413`). La frase se cayó del guion por duración (`notas-v19`, s01-03): ni en pantalla ni en voz hay nada de herramientas ni de pipeline.

## 6. Nombres libres

Nombres de fondo ya usados, neutros (no tocan el caso). Mejor reutilizarlos que inventar otros.

| Nombre | Qué es | Dónde sale |
|---|---|---|
| `FIN-WS-05` · `LOG-WS-11` · `SALES-WS-03` | Finanzas · Logística · Comercial; limpios en las dos cazas | `v1/src/data/s08-scope.ts:11-13`, `v5/src/data/s06-eradicate.ts:67` |
| `dc-01` · `fw-01` · `rt-core` | controlador de dominio · firewall · router; V16 hace de `rt-core` el router central del plano de antes, del que cuelgan las cuatro VLAN (ya no es solo relleno, ver §3) | `siem/src/data/s02-collect.ts:74-78`, `v16/src/scenes/parts/Napkin.tsx:35` |
| `fw-int01` · `srv-gis01` · 10.20.9.14 | firewall interno · servidor SSH · destino interno. Deducido (ficha de V16): `fw-int01` es el cortafuegos interno de V1 («Zona Operaciones») y de V16, y `srv-gis01` (10.20.9.14) queda detrás; ningún vídeo los junta y V16 no los nombra | `siem/src/data/s03-normalize.ts:75-79`, `:97` |
| `a.soto` (10.20.6.52) | usuaria legítima; su ejemplo del 14/03 usa `SRV-TC-APP03` | `siem/src/data/s03-normalize.ts:54-60` |
| `10.20.6.140` | dirección que recibe `ptl-pruebas-02` el 23-11 en la VLAN de Oficinas (V17); ya no es relleno, ver §3 | `v17/src/data/s02-toma.ts:18` |
| `srv-tc-app01` · `svc_edi` · 198.51.100.23 | otro servidor de la terminal, su cuenta y un destino | `siem/src/data/s04-enrich.ts:15-17` |
| `ptl-pruebas-02` | portátil de pruebas; V5b lo usa para el simulacro (ya no es solo relleno); V17 lo enchufa a una toma libre el 23-11 (ya no es solo relleno, ver §3) | `siem/src/data/s04-enrich.ts:77`, `v5b/src/data/s03-simulacro.ts:11`, `v17/src/data/s02-toma.ts:15` |
| `rdp01` · `srv-fich02` | escritorio remoto · servidor de ficheros | `siem/src/data/s05-correlate.ts:12`, `:26` |
| `backup01` · `vulnscan01` · `lb-web02` | copias · escáner · balanceador | `siem/src/data/s06-fatigue.ts:23-25` |
| 10.20.6.23 · 10.20.3.54 · 10.20.9.12 | hosts de la cola de avisos | `siem/src/data/s06-fatigue.ts:30-33` |
| R-112 · R-087 · R-203 · EXC-01…03 | reglas ruidosas del SIEM y sus exclusiones | `siem/src/data/s06-fatigue.ts:45-47`, `siem/src/data/s07-tuning.ts:53-69` |
| `fw-perimetro-01` · 192.0.2.10 · `ws-ops-12` | cola tranquila del SIEM; V16 hace de `fw-perimetro-01` el cortafuegos del perímetro, con la regla de entrada 443 del portal (ya no es solo relleno, ver §3); 192.0.2.10 y `ws-ops-12` siguen siendo relleno | `siem/src/data/s08-triage.ts:14-17`, `v16/src/scenes/parts/Napkin.tsx:34`, `:332-335` |
| `hpa-portal-web-01` | portal público de reservas de atraque; V10 lo usa para el traversal y la amplificación DNS del 21-10, V11 se conecta a él desde fuera como `reservas.haldenport.example`, y V16 lo enseña en la VLAN de Oficinas y lo muda a la DMZ (ya no es solo relleno, ver §3) | `sp/sp4-part3.ts:56`, `v10/src/data/s04-traversal.ts:10-11`, `v11/src/scenes/parts/TlsLine.tsx:61`, `v16/src/scenes/parts/Napkin.tsx:44` |
| la calle · la terminal de pasajeros · las oficinas · el muelle · la sala de control (Operaciones) | las áreas del puerto vistas desde arriba en V16, cada una con su valla y una garita en el paso: la imagen de las zonas, sin sistemas dentro. La sala de control es la de Operaciones (en V1, la del muelle 3); la terminal de pasajeros ya salía en sp2 (evil twin) | `v16/src/data/s02-garita.ts:13-21`, `sp/sp2-part1.ts:315` |
| la ventanilla de navieras y transportistas · el edificio de oficinas (salida de emergencia, sala de servidores) | imágenes de V16: la DMZ (s04) y las puertas fail-safe y fail-secure (s08); sin equipos, personas ni fechas | `v16/src/data/s04-dmz.ts:16-20`, `v16/src/data/s08-puertas.ts:9-11` |
| HALDEN-OPS | wifi WPA2 de la terminal | `sp/sp4-part1.ts:384` |
| muelle norte | servidor de planificación de grúas (R-014) | `sp/sp5-part2.ts:114` |
| `demo.citas` · `demo.puerta` · `demo.transporte` · `demo.revision` · `4821 KLM` · `1932 TRP` · `7740 DFN` · `0516 PXL` | cuentas de prueba y matrículas inventadas de V19 (la copia de la web de citas); neutras, no tocan el caso | `v19/src/data/s02-sqli.ts:28-31`, `v19/src/data/s04-vuelve.ts:50-55` |

Dos formas de nombrar estaciones conviven: `OPS-WS-14` / `ADM-WS-02` (V1 y V5) y `ws-ops-12` (`siem/src/data/s08-triage.ts:17`). Los servidores van
en minúsculas (`srv-…`). Un vídeo nuevo elige una a propósito; V1 y V5 usan `ÁREA-WS-nn`.

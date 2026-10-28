# Vídeos de fundamentos · propuesta conjunta (F1–F4)

> **Estado: propuesta, 2026-10-28.** Guiones completos, sin congelar, sin escenas ni voz. Escritos sobre `origin/main`
> (`48510e35`, «add video-led learning path and independent mock exams»), que es donde viven las doce lecciones de
> fundamentos (`src/data/security/foundations.ts`) y sus cuatro prácticas (`src/data/security/practicals.ts:128-132`).
> El `main` local del checkout principal está muy por detrás (`262fe9fb`) y no las tiene.
>
> Rutas relativas a la raíz del repo. `reg` = `docs/superpowers/canon/glass-harbor.md` · `plan` =
> `docs/superpowers/plans/2026-09-25-lesson-videos.md` · `fund` = `src/data/security/foundations.ts` · `prac` =
> `src/data/security/practicals.ts`.

Cada vídeo tiene su archivo, con las seis partes pedidas (A ficha, B guion por escenas, C locución, D actividades,
E producción y accesibilidad, F revisión):

| Archivo | Vídeo |
|---|---|
| [F1-viaje-conexion.md](F1-viaje-conexion.md) | «Cómo viaja una conexión» |
| [F2-abrir-web.md](F2-abrir-web.md) | «Qué sucede al abrir una web» |
| [F3-quien-puede.md](F3-quien-puede.md) | «Quién puede hacer qué» |
| [F4-reconstruir.md](F4-reconstruir.md) | «Cómo reconstruir lo ocurrido» |

## 1. Orden recomendado

| Orden | Vídeo | Va detrás de | Por qué en este punto |
|---|---|---|---|
| 1 | **F1 · Cómo viaja una conexión** | f08 (cierra el bloque f05–f08) | Necesita IP, subred, gateway, NAT, puertos y TCP/UDP ya leídos; los junta en un solo recorrido. Da el vocabulario (dirección, puerto, etiqueta) que usan los otros tres. |
| 2 | **F2 · Qué sucede al abrir una web** | f10 | Sigue en la misma oficina y con el mismo portátil de F1: añade DHCP, DNS, TLS y HTTP sobre lo que F1 ya montó. |
| 3 | **F3 · Quién puede hacer qué** | f11 | Une f03 (permisos) con f11 (autenticación y autorización), y f04 (procesos) para las cuentas de servicio. |
| 4 | **F4 · Cómo reconstruir lo ocurrido** | f12 | Lee registros que mezclan todo lo anterior: direcciones y puertos (F1), una conexión por el 443 (F2), una cuenta y un proceso (F3). |

Es el mismo orden que las lecciones (f08 → f10 → f11 → f12) y que las prácticas de fundamentos (`prac:129-132`), así
que el recorrido de las semanas 1–4 no cambia: lección, vídeo, práctica. Cada vídeo se entiende solo; el orden solo
ahorra repeticiones.

## 2. Correspondencia con las lecciones y las prácticas

| Lección (`fund`) | F1 | F2 | F3 | F4 | Qué toma el vídeo |
|---|---|---|---|---|---|
| f01 Hardware y virtualización | | | | | — (ningún vídeo; ver §5) |
| f02 Sistemas operativos y servicios | | | ◐ | | servicio que funciona sin ventana, con su cuenta |
| f03 Archivos y permisos | | | ● | | leer, escribir, ejecutar; grupos; mínimo privilegio; reglas aditivas y denegación implícita |
| f04 Terminal, procesos y evidencia | | | ◐ | ◐ | proceso con PID y cuenta (F3); conexión que pertenece a un proceso (F4) |
| f05 TCP/IP y comunicaciones | ● | ◐ | | ◐ | etiqueta origen/destino con puertos; TCP frente a UDP; el 443 no prueba el contenido |
| f06 Direcciones y subredes | ● | | | | IPv4, prefijo /24, misma red o no, direcciones privadas |
| f07 Routing, gateway y NAT | ● | | | | gateway, rutas de ida y vuelta, NAT con su tabla, NAT ≠ cortafuegos |
| f08 Puertos y protocolos | ● | | | | regla con origen, destino, protocolo, puerto y acción; primera coincidencia y denegación implícita |
| f09 DNS y DHCP | | ● | | | concesión y sus datos, resolutor, registro A, TTL |
| f10 HTTP, TLS y certificados | | ● | | | petición HTTP, TLS, qué comprueba el certificado y qué no permite concluir |
| f11 Usuarios, grupos y autenticación | | | ● | | identidad, autenticación frente a autorización (MFA y sesiones se quedan en la lección) |
| f12 Logs, formatos y cronologías | | | | ● | campos, JSON/CSV, campo ausente, UTC, cronología, deny/allow |
| **Práctica** (`/security/study?view=practice&foundation=1`) | «Mapa de red» `foundation-network` | «Diagnóstico de conectividad» `foundation-connectivity` | «Permisos de una carpeta» `foundation-permissions` | «Cronología y límites» `foundation-timeline` | una por vídeo, 1:1 (`prac:129-132`) |

● = el vídeo lo trabaja entero · ◐ = lo usa como apoyo.

## 3. Conocimientos previos y resultados esperados

| Vídeo | Antes de verlo | Al terminar, quien lo ve sabe… |
|---|---|---|
| F1 | f05–f08 leídas. Nada más: no hace falta calcular subredes. | decir si dos equipos /24 comparten red; nombrar el siguiente salto hacia otra red y por qué hace falta ruta de vuelta; leer la etiqueta de una conexión (dirección y puerto de origen y destino) y el protocolo; explicar qué cambia NAT y qué registro hace falta para atribuir una conexión; distinguir traducir de filtrar. |
| F2 | f09–f10 leídas; F1 visto (o f05–f08). | ordenar DHCP, DNS, TCP, TLS y HTTP en una visita; decir qué entrega una concesión; explicar el TTL; decir qué no se repite en una segunda visita; enumerar las cuatro comprobaciones de un certificado; decir dos cosas que un certificado válido no garantiza. |
| F3 | f03 y f11 leídas (f02 y f04 ayudan). | separar autenticación de autorización ante un error; asignar leer, escribir o nada a cada grupo y a una cuenta de servicio según su tarea; justificar el mínimo privilegio; explicar que un proceso puede lo que puede su cuenta; leer una línea de permisos de Linux y decir en qué se diferencia de una ACL de Windows. |
| F4 | f12 leída; F1 y F3 vistos (o f04, f05, f11). | localizar en un registro cuándo, dónde, quién, qué y resultado; normalizar horas a UTC y conservar la original; construir una cronología correlacionando por campos; clasificar frases en observación, hipótesis o conclusión; explicar por qué un bloqueo no descarta otra vía y un permitido no prueba una fuga. |

## 4. Recursos existentes reutilizables (comprobados en el repositorio)

| Recurso | Dónde | Para qué |
|---|---|---|
| El puerto y su portal de reservas, `reservas.haldenport.example` | `reg:396` (V11) | destino de F1 y F2 |
| «una naviera», cliente del puerto, sin nombre | `reg:200` | quien viaja en F1 y F2, desde fuera del puerto |
| El certificado del portal: `CN = reservas.haldenport.example`, emisor `Confianza Global TLS Issuing CA 3`, raíz `Confianza Global Root`, `NotBefore: Nov 9 2026`, `NotAfter: May 27 2027`; OCSP stapling desde el 12-11 | `video/pki-halden/src/data/s02-cadena.ts:38-41`, `s03-arreglo.ts:26-39`, `video/pki-halden/narration.json:201`; `reg:397-399` | el certificado que se comprueba en F2 |
| La cadena de confianza dibujada, el sello de la CA | `video/pki-halden/src/scenes/parts/AnchorChain.tsx`, `CaSeal.tsx` | F2, s07 |
| La línea TLS de la naviera (`TLSv1.3 / TLS_AES_256_GCM_SHA384 / X25519 / id-ecPublicKey`) | `video/cripto-halden/src/scenes/parts/TlsLine.tsx`; `reg:400` | F2, s06 |
| `haldenp0rt.example`, «ejemplo de dominio parecido» | `reg:395` (V1) | F2, s10 |
| La tarjeta de regla de cortafuegos (cuatro campos en una fila) | `video/zero-trust-halden/src/scenes/parts/RuleCard.tsx` | F1, s10 (copiar el componente y cambiar los datos: los suyos son el ERP de V20) |
| La normalización de horas del SIEM («las 10:14 de Halden se guardan como las 09:14 UTC», 14/03) y su tabla de tres dialectos | `video/siem/narration.json:90`, `video/siem/src/data/s03-normalize.ts:1-80` | F4, s02–s05; fija que Halden va a UTC+1 en invierno |
| La tabla de registros con columnas recuadrables | `video/logs-halden/src/scenes/parts/IdpLog.tsx`, `TrailRow.tsx` | F4, s03–s07 |
| Diagrama de carriles (una columna por parte) | `video/iam-halden/src/scenes/parts/Lanes.tsx` | F2, s02 y s06 (DHCP y saludo TLS) |
| Nombres libres del canon: `srv-fich02` (servidor de ficheros), `SALES-WS-03` (Comercial) | `reg:4494`, `reg:4487` | F3 y F4 |
| La red interna del puerto, `10.20.0.0/16`; la VLAN de Oficinas en `10.20.6.x` | `reg:414`, `reg:4491` | F4 (solo la dirección del equipo de Comercial) |
| Motor: iconos, tema, sellos, tarjetas de examen, pausas para pensar | `video/engine/src/ui`, `theme`, `overlay` | los cuatro |
| Música de biblioteca `Go On Going - Stayloose.mp3` | `video.json` → `"music"` (como V18, V28) | los cuatro |

No se reutiliza ningún hecho del incidente GLASS HARBOR. Ver §6.

## 5. Qué aporta cada grabación

Las lecciones ya explican cada pieza por separado y en texto. Lo que el texto no enseña bien es **el orden y el
cambio**: qué pasa primero, qué cambia por el camino, qué se repite y qué no. Eso es lo que justifica un vídeo, y por
eso cada uno sigue **un solo caso que se mueve**.

- **F1** convierte cuatro lecciones (f05–f08) en un único viaje de ida y vuelta. La etiqueta del paquete se ve cambiar
  en el router (NAT) y la regla se ve decidir al lado; eso deshace el error más frecuente del bloque, «NAT protege».
  Es también el fundamento del que más dependen los vídeos del recorrido: f05 es prerrequisito de 10 vídeos SY0-701
  y f08 de 9 (recuento de `PREREQUISITES` y `PRODUCED_PREREQUISITES` en `src/data/security/video-learning*.ts`).
- **F2** es el único sitio del curso donde se ve una visita web completa con su orden real, y donde se contesta qué
  **no** se repite en la segunda visita (el error que el encargo pide evitar). f10 es prerrequisito de 10 vídeos.
- **F3** junta dos lecciones que el alumno lee separadas (f03 es la tercera; f11, la undécima) en un caso con persona,
  grupo, proceso y cuenta de servicio. f11 es el fundamento con más vídeos detrás (15) y f03 tiene 12.
- **F4** enseña un procedimiento (leer, normalizar, ordenar, separar) que en texto se queda en enunciado. Ver cómo
  cambia el orden al normalizar es el «momento» del vídeo. f12 es prerrequisito de 8 vídeos, entre ellos los de
  logs, SIEM y respuesta a incidentes.

**Fuera de este lote.** f01 (hardware y virtualización) y f02 (sistemas operativos y servicios) no tienen vídeo
propio: f02 entra de lado en F3; f01 no entra. Si hiciera falta un quinto, sería «Dónde corre de verdad un servicio»
(f01 + f02: host, VM, servicio, puerto y petición real). No se propone ahora.

## 6. Decisiones tomadas (supuestos documentados)

**Formato.**
- Perfil **`principal-yt`** para los cuatro: 380–600 s renderizados, 5 capítulos, 5–8 tarjetas de examen, **2 pausas
  para pensar** (los «momentos de pausa» del encargo), sin mensajes interceptados (no hay adversario). Es el único
  perfil existente que da dos pausas de decisión sin cuatro preguntas de examen (`caso-principal-yt` exige 4–5).
- **Duración.** El encargo pide 8–12 min; el motor tiene un techo de 600 s (10:00) en todos los perfiles largos
  (`video/engine/scripts/lib/profiles.mjs`). Los guiones calculan **8:19 (F4), 8:53 (F3), 9:14 (F2) y 9:44 (F1)
  renderizados** (el cálculo, escena a escena, va en la parte E.2 de cada archivo). Pasar de 10 min exigiría un perfil nuevo; no compensa: el plan dice que el techo «no es
  un objetivo» y que nunca se rellena.
- **Ritmo de cálculo:** 2,7 palabras/s (`plan` §1), + 2 s de aire por escena, + 5 s por pausa para pensar, + ~20 s de
  márgenes de la tubería. Grabación a tempo 1, sin acelerar (decisión de Lidia del 24-10), así que la duración real
  puede quedar ±10 % del cálculo; se mide con `build-timeline --estimate` antes de congelar.
- **Tarjetas de examen.** Los fundamentos no son objetivos SY0-701, pero el motor exige uno en cada tarjeta
  (`examObjectiveError`). Cada tarjeta lleva el objetivo **donde ese concepto se examina después** (F1: 3.2 y 4.5;
  F2: 1.4, 2.2, 3.2 y 4.5; F3: 1.2 y 4.6; F4: 4.8 y 4.9). Es una decisión editorial a confirmar por Lidia; si prefiere
  otra etiqueta, `video.json` → `"examBadge"` admite un texto propio (como «SY0-801 · borrador»).
- **Narración hablada** (`plan` §1): segunda persona, conectores hablados, primero la idea y luego el nombre, cada
  concepto clave dicho dos veces, ningún identificador leído en voz alta (IP, dominios, equipos, cuentas van solo en
  pantalla), una imagen por concepto. 4–6 conceptos clave por vídeo; lo que no cabe queda dicho en cada ficha.
- **Integración en la app.** `FoundationLesson` (`fund:3`) no tiene campo de vídeo y `SecurityFoundationPage` no pinta
  bloques. Propuesta: un `videoId?` opcional en f08, f10, f11 y f12, con el reproductor entre «Ejemplo resuelto» y
  «Error que conviene evitar», y las actividades de la parte D en el mismo formato que `SCENES` de
  `src/data/security/video-learning.ts` (pregunta ES/EN, cuatro opciones, respuesta, explicación, opciones EN). No está
  hecho: es un cambio de código aparte.

**Canon.**
- **Estos son los primeros vídeos de Halden que ve el alumno** (semanas 1–4, antes que cualquier lección SY0-701). Por
  eso no tocan el incidente: nada de SILENT PAGER, RED MARROW ni de las fechas de GLASS HARBOR. El puerto se presenta
  en una frase.
- **F1 y F2 pasan fuera del puerto**, en la oficina de «una naviera» (`reg:200`) que usa el portal de reservas, como
  la naviera de V11. Así no se dibuja la red interna del puerto, que ya es canon (las cuatro VLAN de V16, el plan de
  zonas) y cambia según la fecha. Sello: «Imagina · caso de entrenamiento · sin fecha · la oficina no es del puerto».
- **F3 y F4 pasan dentro del puerto**, como «caso de entrenamiento · sin fecha · no ha pasado», con áreas y sin
  personas con nombre (la convención de V28–V51), y con dos nombres libres del canon (`srv-fich02`, `SALES-WS-03`).
- **Valores nuevos**, ninguno presente en `reg` (comprobado con búsqueda el 2026-10-28). Se registrarían en el canon
  como «previstos» si se aprueban:

  | Valor | Qué es | Vídeo | Por qué este |
  |---|---|---|---|
  | `192.168.20.10/24` · `.80` · `192.168.30.10/24` | portátil, impresora y servidor de ficheros de la naviera | F1, F2 | son los números del ejemplo resuelto de f06 (`fund:28`): el vídeo dibuja el ejemplo de la lección |
  | `192.168.20.1` / `192.168.30.1` | gateway de la naviera (las dos patas del router) | F1, F2 | primera dirección de cada /24 |
  | `192.168.20.2` | resolutor DNS de la oficina de la naviera | F2 | separa el papel de resolutor del de router |
  | `198.51.100.7` | dirección pública (NAT) de la naviera | F1, F2 | fuera de `203.0.113.0/24` (SILENT PAGER) y de `192.0.2.157` (RED MARROW); `198.51.100.x` solo tiene resolvers abiertos (`.61`, `.140`, `.203`, `.212`) y `.23` |
  | `192.0.2.44` | dirección pública del portal de reservas | F1, F2 | el registro no da ninguna; rótulo «ejemplo de entrenamiento» |
  | puertos `51422` → `61002` | puerto efímero del portátil y el que pone NAT | F1 | los de los ejemplos de f05 (`fund:24`) y f07 (`fund:32`) |
  | taller de grúas, carpetas «Partes de avería» e «Informes», grupos Mantenimiento, Personal del taller, Operaciones y Jefatura del taller, cuenta `svc_resumen` (proceso `resumen.exe`, PID 4120), la copia en Linux de la cuenta `mant` | caso de permisos | F3 | `svc_` como las cuentas de servicio del canon; no reutiliza `svc_tosreport` (es del incidente) |
  | `l.prado` (Comercial), `10.20.6.37`, `syncbox.exe` PID 6120, `subidas.compartir.example`, `198.51.100.90`; la línea del cortafuegos con `start` y `end` | caso de la cronología | F4 | rotulado «imagina»; `10.20.6.x` es Oficinas; `start`/`end` porque los cortafuegos suelen registrar al cerrar la sesión |

**Evaluación.** Las actividades de los vídeos (pausas y las dos posteriores de cada uno) **no copian** la evaluación
de salida de fundamentos (`fund:55-80`), las cuatro prácticas (`prac:129-132`) ni los simulacros
(`src/data/security/exam-seeds*.ts`, `exam-multiple.ts`). Se evitaron a propósito sus escenarios: vecinos
10.3.8/10.3.9, 172.20 privado, cien equipos tras una IP y registro NAT, SSH desde una estación, «funciona por IP y no
por nombre», certificado de otro nombre, intermedia que falta, clave filtrada, 403 al modificar una factura, 14:00+02:00
→ 12:00Z, «allow y 200 bytes» y «el gateway deniega y no hay más registros». Los vídeos enseñan esas ideas (son las
de la lección), pero las preguntas usan contextos y cifras distintos. Las respuestas correctas quedan repartidas A–D
dos veces cada una entre las ocho actividades posteriores.

## 7. Qué está comprobado y qué es propuesta

- **Comprobado en el repositorio** (con su ruta en cada archivo): el contenido de las lecciones y prácticas, los
  perfiles y límites del motor, las reglas de narración, los hechos de canon que se reutilizan (portal, certificado,
  naviera, dominio parecido, UTC+1 de Halden en invierno, nombres libres), la ausencia de choques de los valores
  nuevos y el recuento de prerrequisitos.
- **Propuesta:** todo lo demás (casos, valores nuevos, imágenes, guiones, actividades, mapeo de tarjetas, integración).
- **No comprobado:** que los componentes citados se puedan reutilizar sin cambios (solo se leyó su cabecera); las
  duraciones (son cálculos); los nombres de los permisos en el Windows en español; las fuentes primarias que la
  revisión no abrió (cada parte F.2 dice cuáles sí).

## 8. Revisiones hechas (2026-10-28)

Dos revisores de solo lectura, en paralelo, como pide el recetario (`plan` §1, «Revisores y validador»):

- **Exactitud**, contra las lecciones, el canon, los simulacros y fuentes primarias. Abrió RFC 2131, RFC 8446,
  RFC 9525, RFC 3339, las dos páginas de Microsoft sobre DACL y `path_resolution(7)`, y recalculó todas las horas y
  plazos. Encontró seis errores, ya corregidos: la línea del cortafuegos de F4 (con duración y bytes es un registro de
  cierre: ahora lleva `start` y `end`); «misma sesión» y «programa de sincronización» en la cronología de F4 (eran
  inferencias); la ACL de F3, que no dejaba ni abrir la carpeta (se añade «Personal del taller · Lectura»); el orden
  NAT/filtrado de F1 s10 (se filtra antes de traducir); la analogía de la clave privada en F2; y el TTL de 5 min y la
  conexión «reutilizada» de F2 (ahora TTL de una hora y sesión TLS retomada). También ajustó tarjetas, distractores y
  notas de simplificación.
- **Naturalidad y didáctica**, contra las doce reglas de la narración hablada. Cambios principales: «puerto» deja de
  usarse para el puerto de Halden cuando ya significa puerto de red (F1); cada término se explica antes de nombrarse
  (bits, cortafuegos, TLS, HTTP, proxy, EDR, JSON); la primera pausa de F4 ya no se adivina (la zona se explica antes);
  la segunda de F3 es una decisión entre dos permisos concretos; las horas de F4 se dicen como en pantalla («las nueve
  cincuenta y ocho»); cada capítulo cierra con su «o sea, que…»; y se quitan dobles sentidos entre vídeos («ruta»,
  «equipo», «dirección», «cifrar»). El mensaje de voz pasa a «recado en el contestador» (un audio de mensajería sí
  muestra si se ha escuchado).

Las dos revisiones confirman que ningún valor nuevo choca con el canon y que las ocho actividades posteriores no
copian la evaluación de salida, las prácticas ni los simulacros (las respuestas quedan A, B, C y D dos veces cada una).

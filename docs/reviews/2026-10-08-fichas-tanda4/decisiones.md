# Fichas de la tanda 4: decisiones para aprobar en una ronda

Fecha: 8 de octubre de 2026. Seis cápsulas, las del backlog del ranking (filas 18 a 20 del plan de vídeos, §3). Las
fichas completas están en esta carpeta (`ficha-V18.md` a `ficha-V23.md`), listas para pegarse en §5 del plan tras V17.
Las decisiones de cada una, con la alternativa descartada y sus riesgos, están en `decisiones-V18-V19.md`,
`decisiones-V20-V21.md` y `decisiones-V22-V23.md`. Aquí va solo lo que une a las seis.

Todas pasaron una revisión de exactitud y canon por campaña (`revision-secplus.md`, `revision-gcti.md`) y la
comprobación de límites del validador, recontada con Node (tarjetas, preguntas, mensajes, escenas y duración). Las
revisiones no encontraron ningún fallo que bloqueara salvo uno en V22 (la imagen de la tienda usaba el mismo gesto para
dos verbos, justo el par que el vídeo quiere desenredar), y ya está arreglado. Basta con decir qué cambia; lo que no se
diga, queda como está.

## Qué entra y por qué

| Nº | Lección | Tema | Carpeta | Historia | Adversario y voz |
|---|---|---|---|---|---|
| V18 | sp4m5 | Triaje CVSS por contexto | `cvss-halden` | informe del escaneo del jueves 1-10, rescan el 5-10 | SILENT PAGER · Pablo + `machine` |
| V19 | sp2m4 | SQLi y XSS | `inyeccion-halden` | revisión previa a publicar, jueves 5-11 | RED MARROW · Laura + `telefono` |
| V20 | sp1m3 | Zero Trust | `zero-trust-halden` | diseño y simulación, viernes 13-11 | NULL CIPHER · Helena + `cifrado` |
| V21 | sp4m2 | WPA3-Enterprise | `wifi-halden` | auditoría del lunes 14-12, antenas el 15 y 16 | SILENT PAGER · Pablo + `machine` |
| V22 | s2m2 | Courses of Action | `coa-precios` | sin fecha, el menú de la analista | GLASS VIPER · Pablo + `machine` |
| V23 | s4m5 | Atribución | `atribucion-cuadro` | sin fecha, secuela de V3 | PAPER CRANE · Laura + `machine` (como V9) |

- **Seis de las diez lecciones que quedaban.** Entran las filas 18, 19 y 20 enteras (CVSS, SQLi/XSS, Zero Trust, WPA3,
  atribución y CoA). Quedan para una tanda 5 las cuatro de la fila 21 (ALE, YARA/Sigma, DR, RTO/RPO).
  Alternativa descartada: cambiar WPA3 por YARA/Sigma para equilibrar pistas (4 de Security+ y 2 de GCTI). Se queda el
  orden del ranking; si prefieres 3 y 3, el cambio es V21 por s5m3.
- **Todas son cápsulas** (el backlog lo era), perfil `capsula-yt`, 6 escenas, 3 capítulos, 4 tarjetas, 1 pregunta para
  pensar y 2 mensajes interceptados. Suman 210 s de escenas (V22 y V23, 218 s).
- **Ninguna voz es nueva.** Los efectos `machine`, `telefono` y `cifrado` ya están en `adversary_fx.py`, y las voces
  son las de los adversarios que ya hablan en vídeos anteriores. No hay trabajo de motor antes de producir.

## Lo que hay que saber antes de aprobar

1. **V21 es el primer vídeo de SILENT PAGER en el orden del curso**, no V5; V18 pasa a ser el segundo. Lo dicen las
   fichas y el registro lo anotará.
2. **V20 se vende como diseño y simulación, no como piloto.** Ocurre el 13-11 y el sello «diseño y simulación · sin
   efectos» está visible en toda la escena donde suena el segundo factor, porque la MFA de Halden no llega hasta el
   30-11. Si prefieres un piloto en marcha en diciembre, cambian fecha, sellos y tiempos verbales (detalle en
   `decisiones-V20-V21.md`). **Decidido el 2026-10-08: diseño** (Lidia delegó la decisión: encaja con lo que pregunta el examen, los roles y los dos planos, y no obliga a enseñar una MFA que Halden no tiene).
3. **V19 usa una copia de pruebas del portal de citas de camiones**, no el portal de reservas: V10 sacó `/etc/passwd`
   de ese y V11 enseña a las navieras entrando ahí.
4. **V22 y V23 no llevan fecha** para no chocar con E9 ni con el dosier de HALL OF MIRRORS. V23 no atribuye nada del
   caso: el binario de ejemplo va rotulado «no es el caso de Meridian».
5. **Defensivo siempre.** La demo de V21 termina sin ninguna clave encontrada, sin herramienta con nombre y sin tiempos;
   la de V19 solo enseña la entrada maliciosa, nunca un objetivo real.
6. **Cuatro vídeos se tocan entre sí en el calendario** sin pisarse: V19 y V20 comparten el 13-11 (áreas distintas) y
   V21 va después de V17 (23 a 27-11).

## Cambios a las lecciones y al registro (solo propuestos)

Todos son texto de callouts, tablas y bloques; ninguno toca ids, opciones ni respuestas, y ningún test fija esos
textos. Cada uno va en la rama de su vídeo, como hizo V10 con sp2m7.

- **Security+:** `sp4-part3.ts` (WAF condicional, líneas 65 y 167 que se contradicen con el escaneo con credenciales),
  `sp2-part2.ts:337` («un firewall de red»), `sp4-part1.ts:380-385` (dar fecha al recuadro de HALDEN-OPS).
- **GCTI:** `s2.ts:314, 342, 343, 352` (la IP del C2 es alojamiento compartido, «con poca firma», «pierdes el hilo»),
  `s4.ts:993, 1008, 1045-1050` (banda de sponsor, «entra por proveedores», el `75` frente a «confianza media»).
- **Registro:** el canon nuevo de cada vídeo, V11 deja de ser «el primer vídeo de Halden» en sp1 (lo es V20), y las
  referencias a `s4.ts` están siete líneas desfasadas.

## Orden de producción y grabación

- **Grabación por parejas de cápsulas** (ya no hay principales): V18 con V19, V20 con V21 y V22 con V23. Cada pareja
  comparte campaña, y las dos de GCTI se graban en el orden del curso.
- **Antes de abrir los PR de V18 a V21:** fusionar V17 (`video-fronteras-halden`) y cerrar V12 en el registro de canon.
  V12 no tiene fila allí, y pegar las fichas tras V17 antes de eso genera un conflicto de fusión.
- **V22 y V23 no dependen de nada sin fusionar** y pueden empezar primero. Los registros de V14 y V15 aún no están en
  este árbol; las fichas citan sus fichas aprobadas, no sus guiones finales.
- Cada vídeo sigue el recetario de §8: guion contra el registro de canon, `canon-check.mjs`, dos revisiones (exactitud y
  naturalidad), guion congelado, una sola hoja de grabación.

## Lo que no se pudo comprobar

- Los objetivos oficiales de CompTIA SY0-701 y GCTI, la definición de cada verbo en el artículo de Lockheed Martin y
  en FOR578, y la escala de confianza de STIX 2.1: todo de memoria. El revisor de exactitud de cada guion debe
  contrastarlo.
- Los CVE, versiones y equipos de V18 son inventados (no aparecen en `src/`, `video/` ni `docs/`), y las cifras de V21
  (−78 dBm, 38 millones de claves) son verosímiles, no medidas. Los vectores CVSS 9.8 y 8.1 sí salen de la fórmula 3.1.
- Las duraciones reales: solo están contadas la suma de segundos y las palabras, extrapoladas de V12, V7, V8 y V15.
- Las escenas `.tsx` de V17 y los guiones finales de V14 y V15.
- La pronunciación de SQL, XSS, PEP, PDP, SAE y PEAP se decide al grabar.

## Estado

Lidia delegó las decisiones el 2026-10-08 («tú gestionas el diseño del curso para ayudar a aprobar el examen»): se toman
las opciones recomendadas, incluidos los cambios de lección, que van en la rama de cada vídeo. Las fichas se pegan en el
plan (§5, tras V17) en este mismo PR. Cuando V17 esté fusionada, empieza el guion de la primera pareja.

# Tanda 5 (V24–V27) · decisiones para aprobar en una ronda

Fecha: 14 de octubre de 2026. Las cuatro fichas están pegadas en el plan de vídeos
(`docs/superpowers/plans/2026-09-25-lesson-videos.md`, §5, después de V23) y sueltas en esta carpeta (`ficha-V24..V27.md`).
Con ellas termina el backlog del ranking (fila 21). Cada ficha ya trae las opciones recomendadas elegidas: basta con decir
qué cambia; lo que no se diga, queda como está. Nada está en `main` ni se ha publicado.

## Qué se comprobó

- Cada ficha pasó una revisión de solo lectura de exactitud y canon (`revision-secplus.md` para V24–V26, `revision-gcti.md`
  para V27) y se corrigió con ella (apartados «Cambios de la revisión» y «Hallazgos no aplicados» de cada ficha).
- Límites del perfil `capsula-yt` recontados con Node: 4 tarjetas por vídeo, una pregunta, dos mensajes, 6 escenas, suma de
  210 s (V24–V26) y 218 s (V27). Ninguna cifra ni día de la semana estaba mal.
- **No** se ha hecho `build-timeline --estimate` (aún no hay guion) ni la prueba de oído de la voz de PAPER GOVERNOR.

## Los cuatro vídeos

| # | Lección | Tema | Carpeta | Adversario | Insertar |
|---|---|---|---|---|---|
| V24 | sp3m7 | Recuperación ante desastres: sitios, pruebas y cuándo una copia es una copia | `recuperacion-halden` | BLIND ARCHITECT (voz de V16/V17) | tras el 3.er check |
| V25 | sp5m3 | ALE: de un evento al año, con las cifras de R-014 de la lección | `ale-halden` | PAPER GOVERNOR (primera aparición) | tras el último check |
| V26 | sp5m4 | RTO, RPO, MTTR y MTBF: lo que se promete y lo que se mide | `bia-halden` | PAPER GOVERNOR («vuelve») | tras el último check |
| V27 | s5m3 | YARA y Sigma: del indicador a la regla (GCTI) | `reglas-aeropuerto` | VELVET CICADA (primera voz propia) | tras el 1.er check |

Todas son sin fecha (V24, V25, V26), como V9 y V15, salvo lo que fije cada ficha; el canon nuevo de cada una está en su
apartado «Canon nuevo».

## Lo que solo decides tú

1. **Voz de PAPER GOVERNOR (V25 y V26 a la vez).** Recomendada: Laura + `megafonia`, `rate` −1 (femenina, como «desenmascarada»
   en el dosier; pareja nueva, sin efecto nuevo). Alternativa preparada: Pablo + `cifrado`. Pide una prueba de oído de 20 s
   (`revision-secplus.md`, «Voz de PAPER GOVERNOR») antes de congelar.
2. **Coletilla «Queda en acta.»** en los cuatro mensajes de V25 y V26. Recomendada: sí.
3. **V26 empieza con «Y vuelve PAPER GOVERNOR…»** porque V25 va justo antes. Si prefieres que V26 no dependa de V25, hay que
   presentarla de nuevo con otra frase del jefe de sección.
4. **Pronunciaciones** (al grabar): `GOVERNOR` «gávernor», `ARO` «a erre o», `SLE` «ese ele e», `ALE` «a ele e», `BIA` «bía»
   (V26), y de V27 YARA, Sigma y certutil.
5. **V24:** conservar o no el dato de que el segundo centro de datos está a 40 km (recomendado: no; la lección y el
   laboratorio no están de acuerdo sobre su tipo).
6. **V26:** la frase opcional del ARO en s05 (solo si el borrador queda por debajo de 255 s) y mantener la pregunta «Dos días de
   espera: ¿basta una copia al día?» frente a la del MTTR.
7. **V27:** (a) inserción tras el primer check y antes de STIX/TAXII (recomendada; no existe hueco «tras todos los checks y
   antes de la nota» porque la nota va antes de dos checks); (b) que VELVET CICADA hable ya, con Pablo + `machine`
   (recomendado), o seguir con GLASS VIPER; (c) la pregunta «¿cuál sigue saltando?» o la del decodificador propio.

## Riesgos que quedan

- V27 solapa con V7 (misma pirámide y `wcssvc.exe`); se redujo a una frase en s04 y tres chips en s05, y el vídeo se sostiene en
  «cómo se escribe la regla y qué la rompe». Si al escribir el guion sigue pareciendo un segundo V7, mejor dejarla en backlog.
- El laboratorio `spl5c` usa las mismas cifras de R-014 con otro activo (contradicción menor ya anotada para el registro).
- V24 pisa a V5b en tabletop y simulation (una frase, sin su caso) y a V5 en la restauración de `srv-tc-app03` (tratado, sin
  inventar tiempos).

## Siguiente paso

Con tu ok, un vídeo cada vez, siguiendo §8 del plan: guion contra el registro de canon, dos revisiones (exactitud y
naturalidad), congelar, hoja de grabación para ti. Orden propuesto: V25 → V26 (comparten adversaria y canon), luego V24 y V27.

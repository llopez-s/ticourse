# Segunda pasada · V39 `auditoria-halden` (sp5m7, `caso-principal-yt`)

Solo lectura. Texto revisado: `video/auditoria-halden/narration.json` y `storyboard.json` tal como están hoy (58 segmentos). Contrastado con el informe
`auditoria-halden.md`, la sección «Revisión 2026-10-23» de `out/script-notes.md`, la lección `src/data/secplus/sp5-part4.ts` (sp5m7) y el registro
`docs/superpowers/canon/glass-harbor.md`.

**Comprobaciones mecánicas (hechas con Node y con el propio motor):**
- `build-timeline.mjs --video auditoria-halden --check --estimate` pasa: 58 segmentos, 1.225 palabras, **558,8 s** (umbral de la ficha: 560 s; margen 1,2 s, es decir unas 3 palabras). Solo los 5 avisos esperados (lectura de pregunta de 45 a 62 palabras). Ninguna frase de más de 22 palabras, ningún aviso de narración hablada.
- Cues: en las 13 escenas, los `requiredCues` del storyboard están todos en la voz y no sobra ninguno. `revealAt`/`trapAt` de las 5 preguntas, los 10 sonidos de `sfx` y los `exam.at` de las 8 tarjetas apuntan a un cue que existe. Nada huérfano.
- Ids: ningún duplicado. `s11-01…04` contiguas. En s03 faltan `s03-03` (fusionado en `s03-02`): el hueco existe, el motor lo admite (pasa `--check`) y nada fuera de `narration.json` lo cita, salvo `out/script-notes.md` (ver N-6).
- `canon-check`: 0 / 0 / 0, `out/canon-refs.md` sin cambios.

---

## (a) Hallazgos previos

| Id | Sev. | Estado | Comprobación sobre el texto actual |
|---|---|---|---|
| A-1 | CORREGIR | **resuelto** | `s08-01` y `scenario` son literalmente los del informe («una a una» fuera; «sin objetivo» y «sin trabajar con su SOC»). Offensive cae por «sin objetivo», Integrated por «nadie trabaja con su SOC», Physical por no haber barreras. Una sola respuesta defendible. |
| A-2 | CORREGIR | **resuelto en la voz** | `s12-02` («Pero el equipo no ha escaneado nada») y `s12-03` («el equipo no ha llamado a la puerta») ya no contradicen «ya lo recogió». **Pero** el `goal` de s12 sigue diciendo «nadie ha llamado a la puerta»: ver N-1. |
| A-3 | CORREGIR | **resuelto** | `s07-03` define el red por el objetivo y lo sitúa «en el plan del puerto»; `s11-02` («seguiría vacío») y `s11-03` («podría escanear», «tendría líneas») están en condicional. No queda ningún presente que suene a hecho cumplido. |
| A-4 | CORREGIR | **resuelto** | Las cuatro opciones de la pregunta 2 son informes; `answer` 1 y `trap` 2 intactos; D («Internal audit report») sigue siendo distractor real (falta independencia). Voz, `trapWhy` y `why` cuadran. |
| A-5 | OPCIONAL | parcial (aceptado) | Aplicados: tarjeta de s05-07, `trapWhy` y `s06-02`. No aplicado `s13-04` («un pentest, que aguantas»): es la frase que fija la ficha. Sin objeción. |
| A-6 | OPCIONAL | resuelto | `s02-04` y `s02-05` con el texto del informe. |
| A-7 | OPCIONAL | resuelto | Cubierto por `s07-03`; «sin avisar» solo en `s07-06` (en voz) y en el rótulo del red en pantalla (lección `:122`, correcto). |
| A-8 | OPCIONAL | parcial (aceptado) | Plataforma de cursos y alumno aplicados en voz, `scenario`, título de escena y `goal`; «lo que tendría un cliente» en `s09-03`. La opción D *Integrated* se queda: A, B y C bastan. Pregunta 4 con una sola respuesta. |
| B-1 | CORREGIR | **resuelto** (con un resto menor, N-3) | `s03-06` y `s04-03` con el texto del informe; el «organismo de control» ahora tiene antecedente en voz y «la» de «Industria no la llama nadie» ya no es ambiguo. |
| B-2 | CORREGIR | **resuelto** | `s07-01` sin la lista de cinco; `s11-01/02` con tres elementos y sin «registros públicos» en voz (queda en pantalla), así que «registro» solo designa el del SOC. |
| B-3 | CORREGIR | **resuelto** | `s03-07` y `s13-02` con «lo que pesa»; `s13-03` sin «cuentas». «Cuenta» queda solo como sustantivo de usuario en `s09-03` y `s10-01`, a tres escenas de distancia del verbo de `s09-01`. |
| B-4 | OPCIONAL | resuelto | `s03-02` fusionado y «no le cuenta a Sistemas» desaparecido. |
| B-5 / B-6 | OPCIONAL | parcial (aceptado) | `s03-01` y `s05-05` aplicados; el resto se dejó por presupuesto de 560 s. |

No hay ningún BLOQUEANTE ni CORREGIR previo sin resolver, salvo la parte de `goal` de A-2 (N-1).

---

## (b) Hallazgos nuevos

### N-1 · CORREGIR · `storyboard.json`, escena `s12-p5`, `goal` · el `goal` reintroduce el «nadie» que A-2 quitó de la voz

El `goal` termina: «En la resolución vuelve el registro vacío de s11 en una línea (`log-back`): «el registro no miente: **nadie ha llamado a la puerta**»». La voz
(`s12-03`) dice ahora «el equipo no ha llamado a la puerta», justo porque «nadie» era falso (el tercero que alimenta el buscador sí escaneó). Quien dibuje la
línea desde el `goal` pondrá el texto antiguo en pantalla, contradiciendo la voz y el `why` de la propia pregunta.

**Sustituto exacto** (solo ese tramo del `goal`): «…(`log-back`): «el registro no miente: el equipo no ha llamado a la puerta»…».

### N-2 · OPCIONAL · dos puntos como conector en cinco segmentos (`s04-03`, `s05-01`, `s06-01`, `s10-01`, `s12-03`)

El validador solo avisa a partir de dos por segmento o de un tercio de los segmentos (aquí 5 de 58), pero la regla 3 del plan prefiere conectores hablados. Cambios
sin coste de palabras (salvo `s05-01`, +1):
- `s04-03`: «`<warm> {lift-back}Como en el ascensor, es Industria abriendo un expediente, no el organismo que contrata la comunidad.`»
- `s05-01`: «`<curious> {board-asks}La auditoría de una firma independiente ya está encargada. Pero el consejo pregunta qué pasa si alguien intenta entrar.`»
- `s12-03`: «`<warm> {log-back}El registro no miente. El equipo no ha llamado a la puerta.`»
- `s06-01`: «…`su último penetration test. En dos semanas, nadie consiguió entrar.`…» y `s10-01`: «…`una cuenta de alumno normal. Ni planos, ni código fuente, ni accesos de administración.`…» (solo el signo).

### N-3 · OPCIONAL · `s03-06` · «La hoja de los vecinos» sigue sin decir qué es

B-1 pedía que la voz dijera qué hace cada revisión; el organismo y Industria ya lo dicen, la hoja no. Con la pantalla se ve; sin ella no. Sustituto (+1 palabra,
≈ +0,4 s, queda en ~559,2 s): «`<warm> {lift}Piensa en el ascensor de una comunidad. La hoja que rellenan los vecinos pesa poco. El organismo de control que contratan, más. Y a Industria no la llama nadie, y multa.`»

### N-4 · OPCIONAL · `s06-02` · «porque piden cumplir un estándar»

El cliente no pide «cumplir»: pide que se le demuestre que cumple. Sustituto sin cambiar el recuento: «`<firm> {ok-2}La independent third-party audit, porque piden demostrar cumplimiento. {trap-2}El pentest limpio tienta, pero no dice que cumplas cada control.`»

### N-5 · OPCIONAL · `s11-01` y `s11-03` · «la ventana» aparece por primera vez con artículo y sin antecedente en voz

`s07-01` solo dice «cuándo»; «la ventana» se define dos frases después, en `s11-03` («la ventana pactada»). Para que el oyente la reciba ya con su sentido, sin palabras
de más: `s11-01`: «`<curious> {before}Mira las dos semanas del plan. Antes de la ventana pactada, el equipo de pruebas solo miraría lo público.`» y `s11-03`: «`<steady> {window}Dentro de la ventana ya podría escanear y preguntar versiones. {active}Eso es active reconnaissance. {log-lines}Y entonces el registro sí tendría líneas.`» (la pregunta 5 sigue diciendo «ventana pactada»).

### N-6 · OPCIONAL · higiene antes de congelar

- Ids de s03: `s03-01, 02, 04, 05, 06, 07`. Renumerar a `03…06` ahora no cuesta nada; después de grabar, los clips de Lidia llevan el id y habría un hueco permanente en las hojas de grabación. Los `cues` y la `scene` no cambian.
- `out/script-notes.md`: el punto 9 («nadie ha escaneado nada»), el punto 10 (corte pendiente de `s03-03`) y la línea «registro del SOC vacío» de «Qué se dice» describen el borrador; la sección «Revisión» ya los corrige, pero conviene marcarlos como superados.

### N-7 · OPCIONAL · título de escena `s08-p3` «Un ejercicio en el banco»

«Banco de pruebas» es un lugar fijo de V33 en el registro (§4, fila del «banco de pruebas»). La voz dice «Un banco lanza…», que no se confunde, pero el rótulo
en pantalla, sin contexto, sí podría leerse como el banco de pruebas del puerto. Sustituto: «Un ejercicio bancario» (mismo hueco, sin dar la respuesta).

### Lo que NO es un hallazgo (comprobado)

- Preguntas 1 a 5: cada una tiene una sola respuesta defendible y sus pantallas (`scenario`, `why`, `trapWhy`, `goal`) cuadran con la voz, salvo la línea de N-1. Escenarios que se entienden de oído: ninguno depende de leer las opciones.
- Frases rotas por los recortes: ninguna. `s07-02` («Hay cuatro modos. El primero es el physical.») queda corta, pero íntegra; si hubiera hueco de presupuesto, la ficha prevé volver a darle una frase, y no es necesario.
- Listas leídas: las de tres elementos (`s09-04`, `s11-02`) son el máximo; ninguna lista mayor. Siglas deletreadas: ninguna (SOC va en léxico).
- Exactitud técnica frente a la lección y al 5.5: passive/active por quién toca al objetivo (los buscadores de dispositivos expuestos están en `sp5-part4.ts:155`), audit committee que no audita, regulatory examination, known/partially/unknown, rules of engagement, purple «técnica a técnica». Nada impreciso nuevo.

## Canon

Sin choque con `glass-harbor.md`. Búsquedas hechas por los términos nuevos: «autoridad marítima», «Industria», «revisión anual», «ventana pactada», «sala de escape», «cursos en línea»,
«compañía eléctrica» no aparecen en el registro; «consejo» solo como «consejos» de SILENT PAGER; «alumno» solo en la imagen del aula de V32. «Puente» aparece como el puente
levadizo de V30 (PLC), pero el puente nuevo de V39 va rotulado «imagen · no es del puerto» y no remite a él. PAPER GOVERNOR: la forma del acta («Se acuerda: … Queda en acta.»), la voz
y el «Y vuelve PAPER GOVERNOR, que vive en los huecos de tu gobernanza» coinciden literalmente con V26 (`bia-halden`); V25 es `ale-halden`. Ningún otro vídeo de la tanda la trae. El canon nuevo por apuntar al cerrar es el que enumera A-9 del informe (más la plataforma de cursos y los cinco escenarios).

## (c) Veredicto

**Congelar tras corregir N-1** (una línea del `goal` de s12; no toca la voz ni el presupuesto de 558,8 s). N-2 a N-7 son opcionales; si se aplican N-3 y N-5 el estimado queda en ~559,2 s.

| Severidad | Nuevos |
|---|---|
| BLOQUEANTE | 0 |
| CORREGIR | 1 (N-1) |
| OPCIONAL | 6 (N-2 a N-7) |

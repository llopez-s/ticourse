# V40 · documentos-halden · notas del guion

Ficha: `docs/superpowers/plans/fichas-tanda8/V40-sp5m1.md` (aprobada el 2026-10-17). Guion escrito sin congelar (`video.json` sin `frozen`).
Lección: sp5m1 (`src/data/secplus/sp5-part1.ts`), objetivo 5.1. Perfil `caso-yt`, voz `recording/lidia`, tempo 1,08 y pausas de 250 ms.

## Cifras

| | Ficha | Guion |
|---|---|---|
| Escenas / capítulos | 8 / 3 | 8 / 3 |
| Suma de `targetSec` | 266 s | 266 s |
| Segmentos | – | 35 |
| Palabras (por espacios, con marcas fuera) | 719 de presupuesto en la ficha; 654 con (`s` − 8) × 2,7 en las tres de pregunta | **703** |
| Estimación del motor (2,5 palabras/s) | ≤ 330 s | **322,8 s (5:22)** |
| Lectura de Lidia (≈ 0,89 de la estimación, medida en V28) | ~272–277 s (4:32–4:37) | **~287 s (4:47)**, dentro de 240–330 |
| Tarjetas de examen | 5 | 5 (s02, s03, s05, s06, s07), ninguna en s01, s04 ni s08 |
| Preguntas | 3 | 3 (claves C, A, D; trampas D, C, B) |
| Think prompts / mensajes interceptados | 0 / 0 | 0 / 0 |

Palabras por escena frente al presupuesto: s01 48/54 · s02 120/108 · s03 76/81 · s04 109/103 · s05 97/86 · s06 103/92 · s07 85/76 · s08 65/54.
Se pasa en seis escenas, como los vídeos publicados de la misma ficha de formato (V45: 727/655, V47: 724/665); el total (703/654) queda un 7 % por
encima y la estimación, bajo el techo de 330 s. Salió ~12 s más largo que el objetivo de la ficha (4:35), por la lectura en voz de las resoluciones.
Si el revisor o Lidia lo quieren más corto, el orden de recorte de la ficha sigue valiendo: la frase del playbook de s04-03 (queda el chip), el
cartel viejo de s06-05 (queda el del puerto) y la segunda vuelta de los carteles de s02-06/07.

## Validador (`build-timeline.mjs --video documentos-halden --estimate --check`)

0 errores. Quedan **3 avisos**, los tres de «segmento de más de 26 palabras» en el segmento que plantea cada pregunta (s03-01 33 palabras, s05-01
53, s07-01 40). Se dejan: la voz lee el escenario y la pregunta de una vez (el panel de la pregunta entra con ese segmento y la cuenta atrás se
cuenta desde su audio), y s05-01 lleva además la glosa de «mejor». Los vídeos publicados (nube-halden, ot-halden) tienen los mismos tres avisos.
Todos los segmentos que no son de pregunta están por debajo de 26 palabras y ninguna frase pasa de 22.

`canon-check.mjs`: **0 tokens**, 0 con historia y 0 nuevos (no hay equipos, IP, dominios, cuentas, ficheros, personas ni fechas). Lectura a mano
del registro (§1, §2, §3 «Personas», §6 «Nombres libres» y notas de V28 y V45, que son los vecinos de formato):
- No hay fecha, hora ni año. «Enero» y «marzo» solo salen en la pregunta 3, que es de fuera del puerto.
- Las áreas son las del registro, sin personas: la dirección (V28), Seguridad (V5b, V20, V45) y Sistemas (V5, V18, V28, V30, V32, V45).
- La plataforma de intercambio no tiene nombre ni producto y no es el portal de reservas de V11 ni la plataforma aduanera del socio de V6.
- Ninguna imagen ocupada: la piscina, sus carteles, la hoja del socorrista, la crema y la piscina pequeña no están en §6. Las «hojas» no chocan
  con nada de voz; ver el aviso 1 de abajo para las dibujadas.

## Decisiones de redacción

- **Dos preguntas, tres reglas.** El hilo es «¿obliga? ¿qué responde?»: s01 las promete, s02 y s04 las usan, y el cierre las repite con
  «qué, cuánto o cómo». La voz dice «dueño» y nunca «owner» (V41 es el vídeo del data owner).
- **Solo en pantalla, nunca en voz:** AES-256, «SY0-701», «5.1», «AUP», «112» y «7 días» en cifra. La voz dice «cifrado fuerte», «siete días»,
  «menores de diez años» y «factor cincuenta». «TLS 1.3» se lee en la pregunta 1 (`TLS [1.3|uno punto tres]`, con `TLS` en el léxico como
  «te ele ese»), que es el dato que tienta.
- **Las opciones A–D no se leen.** Tras la revelación la voz nombra la correcta y la trampa, como en los vídeos publicados.
- **Glosa de «mejor» (s05-01).** La pantalla lleva la línea de V28, «MEJOR: la que encaja con este caso, aunque otra suene bien»; la voz dice
  «Ojo con ese «mejor». Pide la que encaja con este caso, aunque otra suene bien», una variante corta de la de V28 (revisión cruzada de la
  tanda, G-4: no repetir entera la frase en vídeos seguidos). Sin «gana …» en la voz. En s07 «mejor» solo se resalta.
- **Escenarios en voz y en pantalla con otras palabras** (como en V28): la voz de la pregunta 2 dice «el centro de operaciones de un hospital»
  y el panel «todo el SOC»; la de la 1, «un equipo de desarrollo tiene un documento de buenas prácticas» y el panel «Una guía del equipo de
  desarrollo». Dicen lo mismo. En la pregunta 2 la voz no enumera los tres pasos (bloquear, cerrar sesiones, avisar): no caben en el presupuesto.
- **Cues propios.** Los de la ficha que son del motor (`options`, `pause`) no están en `requiredCues`: no son marcas de la voz. Añadidos por
  necesidad: `pool-both` (s02: la frase que junta los dos carteles y ancla la tarjeta, para que la tarjeta llegue al final y no a mitad de la
  piscina), `sunscreen` (s03), `lifeguard` (s05) y `sign-back` (s07) para las tres líneas de vuelta de la piscina y sus tarjetas, y `wrong-label`
  y `owners` como en la tabla de la ficha. Las tarjetas de s03, s05 y s07 llegan después de la trampa.
- **Efectos:** solo `ok-N` (check) y `trap-N` (block) para N = 1, 2, 3, más los automáticos del motor.

## Lo que se quedó fuera (sigue en la lección)

Como en la ficha: la lista de políticas del objetivo (AUP, information security, business continuity, disaster recovery, incident response, SDLC,
change management: `sp5-part1.ts:44-48`); onboarding y offboarding (`:64-68`); quién aprueba la policy más allá de «la aprueba la dirección»
(check `:49-63`); la carpeta de veintiún archivos y la continuidad de 2019 del callout (`:125-130`); el change management como procedure (`:67`),
que era el alargue si el vídeo se quedaba corto (no hizo falta). Tampoco hay PAPER GOVERNOR, adversario, mensajes interceptados ni nada del
caso de septiembre.

## Desviaciones de la ficha y dudas para el revisor

1. **Título de YouTube.** La ficha da «Policy, standard, procedure y guideline | CompTIA Security+ en español» (70), pero `paths.mjs` rechaza
   `youtubeTitle` con «|» o de más de 80 caracteres (`/^[^|\n]{5,80}$/`). Queda «Policy, standard, procedure y guideline» (39), como los demás
   vídeos de la serie (sin sufijo de pista). Si se quiere el sufijo, otro separador: ver `youtube-meta.mjs` al subir. También conviene decidir si
   «CompTIA» va en el título; los de V28, V45 y V47 no lo llevan (el descargo «no afiliado a CompTIA» va en la transcripción y la descripción que genera el motor).
   La revisión cruzada de la tanda 8 da otros títulos de YouTube de 85 y 89 caracteres (V41, V42): también pasarán de 80.
2. **Sin `music` en `video.json`**: la ficha dice «a elegir al montar» y distinta de las demás; `render.mjs --master` se para sin ella (plan §8 paso 7).
3. **Sin `lexicon` en `narration.json` ni `lexicon.chatterbox.json`**: el léxico es `lexicon.json` y solo lleva `TLS`. Las palabras inglesas
   (policy, standard, procedure, guideline, playbook, monitoring and revision) no están en el léxico a propósito: ningún vídeo publicado
   reescribe ese tipo de palabras y la primera toma de Lidia fija la pronunciación (`verify-voice` compara con lo que ella diga). Si el paso
   de voz pide el archivo de Chatterbox, es una copia de `lexicon.json`.
4. **«Una guía de desarrollo» (título de s03).** Se mantiene el de la ficha, pero «guía» es casi la traducción de «guideline» y la voz dice
   «buenas prácticas»: el título, el panel («Una guía del equipo de desarrollo») y «recomendamos» ya orientan la respuesta antes de que
   decida la definición. Es lo que la ficha aprobó (la respuesta debe seguir siendo la guideline por «nadie lo ha hecho obligatorio»), pero
   un título neutro («Un documento de desarrollo») lo haría más limpio. Lo decide el revisor de exactitud.
5. **Etiqueta «acceptable use policy».** Está en `tags` por la ficha, pero el guion no la nombra en ningún sitio (la ficha la dejaba como
   «la que firma cada persona» en la resolución de la pregunta 2; no cabía y la AUP está fuera del vídeo). Quien suba el vídeo puede quitar la etiqueta.
6. **Condición de la ficha (duda de exactitud 1).** La pregunta 1 solo es correcta si el PR del vídeo añade «mandatory» a la explicación del check
   `sp5-part1.ts:41` («the moment a mandatory document names…») y a la flashcard `fcp501` (`sp5-cards.ts:6`, «a mandatory exact number or setting is a
   standard»). No he tocado la lección ni las tarjetas.
7. **Escenas.** El storyboard dice «cuatro hojas boca abajo» (s01); en el registro, V35 ya usa «seis tarjetas de actor boca abajo que se vuelven y se
   juntan de dos en dos» (§6). No choca (otro objeto, otro vídeo), pero quien dibuje s01 debería distinguirlas (hojas de papel con rótulo, no tarjetas).
8. **Revisión de naturalidad (pendiente).** Puntos a mirar: «Eso es una policy» / «Eso es un standard» / «Eso es un procedure» / «Eso es una guideline»
   abren cuatro resoluciones seguidas (es el patrón de los cuatro nombres, pero se puede variar una); y s06-04 introduce «monitoring and revision»
   con «El examen lo llama…» tras revisar la ley (la revisión va en s06-02 y el monitoring, en s06-04).

## Revisión 2026-10-23

Informe: `docs/reviews/2026-10-23-guiones-tanda8/documentos-halden.md`. Sin `frozen` (lo pone Lidia). No se ha tocado la lección, las flashcards, el canon ni el motor.

**Aplicados (texto sustituto del informe, cues e ids de segmento intactos)**
- **A-1 (bloqueante).** s03-02 («un standard, además de concreto, obliga. Y este no.»), tarjeta de s03-03 («Concreto no basta: un standard también obliga») y `trapWhy` de la pregunta 1 («Es concreto, pero un standard también tiene que obligar»). Ya no se enseña «obligar = standard».
- **A-2.** s03-01 vuelve a decir «de una empresa» (voz y panel «Un documento del equipo de desarrollo de una empresa…», 148 car.); rótulo «pregunta tipo examen · ejemplo · no es del puerto» en s03, s05 y s07 (storyboard).
- **A-3.** Título de s03 «Un documento de desarrollo»; fuera «guía» y «de buenas prácticas»; se mantienen «recomendamos» y «nadie lo ha hecho obligatorio».
- **A-5.** Pregunta 2 y s04-05 con «cómo actuar» en vez de «qué hacer» (panel 150 car.).
- **A-6.** s04-03 y chip `playbook` con el ejemplo ransomware (la cuenta comprometida queda para la pregunta 2).
- **A-7.** s06-03 («porque no nombra tecnología») y pantalla «igual · porque no nombra tecnología». Decisión sobre el `goal`: se ilumina solo el standard.
- **A-8.** s06-01 y s06-02 como regla («Cada uno de los cuatro papeles necesita un dueño»; «se revisa al menos una vez al año»). Cubre también A-12 (queda como práctica, no como texto del examen).
- **B-1.** «¿a qué pregunta contesta?» en s01-02, chip `promise` y cierre s08-04 («¿contesta al qué, al cuánto o al cómo?»).
- **B-2, B-3.** s06-05 (piscina pequeña / cartel colgado) y s06-04 («Eso, en el examen, es monitoring and revision…»); tarjeta de s06 «Cada papel: un dueño y un ciclo de revisión».

**Opcionales aplicados (sin coste de palabras):** A-11 (s02-01 «quiere ordenar cómo manda documentos»), A-13 (hojas boca arriba con «POLÍTICA» en el encabezado, sin darse la vuelta), A-14 (sello «propuesta · sin fecha» también en s02 y s04; «proveedores» fuera del `goal` de s02), B-4 (s04-02, s04-04, s05-03, s07-03), B-5 (s05-01 completa: «Otra más», «equipo de seguridad de un hospital», glosa propia de «mejor»; el panel sigue con «todo el SOC»).

**Opcionales no aplicados:** A-9 y A-10 (+1 y +2 palabras), B-6 (+5), B-7 (+2), B-8 (+8): el guion ya va 11 s por encima de la suma de `targetSec` y no hay margen a gusto; cualquiera puede entrar después si Lidia lo quiere.

**Choques entre hallazgos:** A-8 y A-12 coinciden (se resuelve con la redacción de A-8). A-5 y B-5 se solapan en s05-01: se usó el texto completo de B-5, que ya incluye A-5. Ninguna decisión de exactitud contra naturalidad hizo falta.

**Dudas del autor, decididas por el informe:** (1) título de YouTube se mantiene (39 car.); (2) sin `music` en `video.json`: la música de la serie es la misma de la biblioteca, que `master_mix.py --bed-style music` pone sin declararla; (3) léxico solo con `TLS`; (4) título de s03 neutro (A-3); (5) etiqueta `acceptable use policy` quitada de `tags`; (6) condición de la lección, ver abajo; (7) hojas boca arriba (A-13); (8) naturalidad resuelta con B-3 y B-4.

**Validación tras los cambios:** `build-timeline --check --estimate`: 0 errores; 714 palabras (motor) y 327,2 s estimados (rango 240–330); 3 avisos esperados (s03-01 33, s05-01 54, s07-01 40 palabras, segmentos de pregunta). `canon-check`: 0 tokens. Longitudes: escenarios 148/150/138 (≤160), `trapWhy` ≤77, tarjetas ≤45.

**Pendiente fuera del guion (no hecho; va en el mismo PR del vídeo, A-4):**
- `src/data/secplus/sp5-part1.ts:41`: añadir «mandatory» y «Naming a version does not turn a recommendation into a standard…».
- `src/data/secplus/sp5-cards.ts:6` (fcp501): «…in a mandatory document is a standard; anything phrased as a suggestion is a guideline, however specific.»
- `sp5-part1.ts:103` (nota de examen): «Dos trampas frecuentes» pasa a «Tres», con la de «lo concreto no basta».
- A-15 (registro al publicar): corregir la cita de V36 (`sp5-part1.ts:312` es de sp5m2); anotar V40 en §1, §3, §4, §5, §6; las citas posteriores a `:130` de `sp5-part1.ts` bajan 11 líneas al insertar el bloque del vídeo.

## Comparación con la rama (2026-10-23)

Se comparó el guion congelado de `main` con la versión de `origin/video-documentos-halden` (2026-10-17). `main` es mejor en lo que importa (el `trapWhy` bloqueante A-1, el mapeo de la piscina, «monitoring and revision», «obliga igual»); de la rama se toman solo los dos detalles de sustancia que `main` había dejado fuera por presupuesto. `"frozen"` sigue en `2026-10-23`; ids, cues, claves, trampas y número de líneas no cambian.

**Aplicados (2, los recomendados).**
- `s02-02`, el porqué en la hoja: «Dice que la información sale solo por canales aprobados, para protegerla.» (+2 palabras; cue `sheet-1` intacto). La hoja de la policy en el storyboard (`goal` de s02) pasa a «…según su clasificación, para protegerla». Era el A-10 del informe de exactitud.
- `s02-05`, «exactamente»: «Eso es un standard. Dice cuánto, exactamente, y también obliga.» (+1 palabra; cue `standard` intacto). Era el A-9; la tarjeta de s02 se queda como estaba.

**No aplicados.** La promesa de `s01-02` que nombra las tres respuestas («¿dice qué, cuánto o cómo?», opcional, +1 palabra y cambio del chip `promise`): el informe B-1 ya aprobó la redacción actual y es de gusto. Tampoco «caduca con la tecnología» en `s02-05` (+5, dejaría el guion sobre 330 s y `s06-03` ya lo enseña), la acceptable use policy en voz ni «se revisan el standard y el procedure» en `s06-03` (la rama invierte la causa).

**Duración final.** `build-timeline --video documentos-halden --check --estimate`: 0 errores, 3 avisos esperados, **718 palabras, 328,8 s (5:28)** estimados (antes 715 y 327,6 s), bajo el techo de 330 s del perfil `caso-yt`. Con la razón ~0,89, unos 293 s. `canon-check`: 0 coincidencias.

**Registro de canon:** fila del guion de V40 (§1) y fila de la policy (§3, «Casos»), «Notas de V40» (pantalla y voz, revisiones: A-9 y A-10 pasan de «no aplicados» a aplicados; cifras 718 palabras y 328,8 s) y la entrada de «Solo en planes o notas» que listaba A-9 y A-10 como opcionales sin aplicar. Citas `v40/narration.json:40` y `:58`; ninguna se desplaza.

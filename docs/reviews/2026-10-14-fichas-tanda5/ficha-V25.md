### V25 · sp5m3 · Cápsula · «Riesgo en euros: de un evento al año»

> Propuesta del 2026-10-14 (tanda 5), con las opciones recomendadas ya elegidas; falta que Lidia diga qué cambia. La versión
> vigente de escenas y guion será `video/ale-halden/storyboard.json` + `narration.json`; qué se quedó fuera, en
> `video/ale-halden/out/script-notes.md`. Las decisiones, con la alternativa descartada de cada una, van al final de esta
> ficha (apartado «Decisiones»); la ronda de la tanda las reúne en su archivo de decisiones. **Revisada el 2026-10-14** con
> `revision-secplus.md` y `reconciliacion.md`: los cambios, en «Cambios de la revisión» (al final); lo que decide Lidia, en
> «Preguntas para Lidia» (justo antes).
>
> **Orden del curso.** Es la primera aparición de PAPER GOVERNOR en un vídeo, en el calendario y en el orden del curso
> (sp5m3 va antes que sp5m4, que será V26). Se presenta desde cero, sin «otra vez»; es V26 la que dice «Y vuelve PAPER
> GOVERNOR…» (`reconciliacion.md`, «Compartido entre V25 y V26», 3). Quien siga el curso llega con todo
> Halden de sp1 a sp4 ya visto, pero el vídeo no remite a ninguno: no nombra el caso de septiembre ni ningún vídeo.
>
> **Esta ficha es de la tanda 5 y se escribe a la vez que V24 (sp3m7, DR), V26 (sp5m4, RTO/RPO) y V27 (s5m3, YARA/Sigma).**
> Dónde acaba V25 y qué deja a V26, en «Dónde acaba V25 y qué es de V26» (más abajo).
>
> Rutas relativas a la raíz del repo; `sp/` = `src/data/secplus/`, `registro` = `docs/superpowers/canon/glass-harbor.md`.

- **Carpeta:** `ale-halden` · perfil `capsula-yt` (190–260 s renderizados; objetivo ~4:00, sin rellenar) · objetivo **5.2**
  (cabecera de la lección, `sp/sp5-part2.ts:4-5`, y objetivos `:12-18`) · adversario **PAPER GOVERNOR** (sección sp5,
  `sp/sections.ts:119-125`), dos mensajes interceptados · voz `recording/lidia` con
  `"recording": { "tempo": 1.08, "maxPauseMs": 250 }` · voz del adversario **nueva, con piezas que ya existen** (el motor
  no tiene voz de PAPER GOVERNOR: `video/*/narration.json` → `adversaryVoice` solo la tiene en los otros cuatro): propuesta
  de la reconciliación `"adversaryVoice": { "voice": "sapi/Microsoft Laura", "rate": -1, "fx": "megafonia" }`; reserva,
  `sapi/Microsoft Pablo` con `cifrado` (la propuesta anterior de esta ficha), `rate` 0. Sin efectos nuevos: Laura es la voz
  de RED MARROW (con `telefono`) y de PAPER CRANE (con `machine`) y `megafonia` la textura de BLIND ARCHITECT (con
  Helena, `rate` −2); esta pareja no la usa nadie, y `rate` −1 («lee un acta») la separa de BLIND ARCHITECT (razones y riesgo
  en «Decisiones», 2; **decide Lidia**, tras la prueba de oído) · música `Go On Going - Stayloose.mp3` ·
  `"examTiming": "sentence-end"`; pregunta con `think.holdMs` 4500; mensajes con `intercept.holdMs` 3800.
- **`video.json`:** `"profile": "capsula-yt"`, `"track": "secplus"`, `"adversary": "PAPER GOVERNOR"`, `"lesson": "sp5m3"`, la música de
  arriba y `"tags"`: SLE, ALE, ARO, single loss expectancy, annualized loss expectancy, annualized rate of occurrence,
  exposure factor, asset value, quantitative risk analysis, análisis cuantitativo del riesgo, gestión de riesgos, risk
  management, Security+, SY0-701. Título de YouTube: «SLE, ARO y ALE: cuánto cuesta un riesgo al año | CompTIA Security+ en
  español». Título del bloque de la lección: «Riesgo en euros: de un evento al año».
- **Efectos (`sfx`):** los automáticos del motor (mensaje, tarjetas, capítulos) y cuatro momentos: `sle` («ding», sale el
  coste de un evento), `ale` («ding», sale el coste al año), `fits` («check», el control cuesta menos que la ALE) y `over`
  («block», la barra de 90.000 € pasa la línea de la ALE).
- **Léxico nuevo** (lo confirma Lidia al grabar; **decide Lidia**, opción recomendada: la de abajo, igual que en V26): se
  leen **por letras** `SLE` («ese ele e»), `ALE` («a ele e»), `ARO` («a erre o»), `EF` («e efe») y `AV` («a uve»), porque
  «ale» y «aro» ya son palabras en español y un oyente las leería como «¡ale!» y «el aro». `GOVERNOR` («gávernor»; `PAPER`
  ya está fijado, «péiper», en `video/ach-matriz/lexicon.json`). `GOVERNOR` y `ARO` se leen **igual en V25 y V26**
  (V26 tenía «góvernor» y «aro»; la reconciliación los iguala a «gávernor» y «a erre o»).
  `exposure factor`, `asset value` y `annualized rate of occurrence` se dicen en inglés, siempre después de la idea en
  llano. `EDR` («e de erre») ya está fijado (V20).
- **Lo que se lee no se deletrea:** `R-014`, las cifras en la tabla y las fórmulas van en pantalla; la voz dice «el riesgo del
  servidor de planificación», «el paquete de copias y EDR», «la reconstrucción con alta disponibilidad» y las cifras en
  palabras («cuatrocientos mil euros», «el veinticinco por ciento», «cero coma cinco»). `SLE = AV × EF` y `ALE = SLE × ARO` se
  dicen «el SLE es el valor por el EF». Ninguna excepción. La voz no dice «muelle» a secas ni «muelle norte» (el «muelle 3»
  de V1 y V5 es otra sala; «muelle norte» solo en pantalla, como en la lección) ni «gestionado»: dice «el servidor de
  planificación de grúas» y «copias y EDR».
- **Duración:** suma de `s` **210 s** (6 escenas; `wordBudget` a 2,7 palabras/s: 54, 108, 124, 124, 97 y 59, unas 566). Es la
  estructura de V12, V18 y V20 (dos mensajes, una pregunta, dos escenas con cuenta en pantalla), que con 210 s estimaron unos
  260 s y renderizaron unos 235–250 s (≈ 4:00): dentro de 190–260. Los extremos conocidos (0,89 y 1,22 veces la suma) dan
  187–256 s. La suma predice mal el renderizado, así que el primer borrador se mide por los dos lados: si el estimado pasa de
  255 s, se recorta en este orden: primero, en s05, la segunda palanca (el EF a 0,10; queda solo el ARO); después, en s04, la
  frase que compara 90.000 con 100.000 (queda el mensaje y su respuesta corta). Si se acerca a 190 s, se alarga s03 (el
  calendario de diez años, que es la imagen que más cuenta) o se añade el diagnóstico «200.000» que sigue en «Se queda
  fuera». No se rellena.
- **Inserción** (cambiada en la revisión, H7): en `sp/sp5-part2.ts`, lección sp5m3, **después del último check de la lección**
  (el del ALE de 120.000 €, `:164-178`) y antes del párrafo que salta a sp5m4 (`:179-182`), como bloque
  `{ t: 'video', title: 'Riesgo en euros: de un evento al año', youtube: '<id>', poster: 'videos/ale-halden-poster.png', transcript: 'videos/ale-halden-transcript.txt' }`,
  precedido de una línea: «Antes de pasar a la siguiente lección, míralo en el puerto: lo que cuesta un evento, lo que cuesta
  al año y cuándo un control sale a cuenta». Es la pauta del repo (último check, vídeo, párrafo: V5b, V10, V11, V16, V20, V24
  y V26) y la que aplican V24 y V26. **La primera propuesta lo ponía entre el check del SLE (`:143-157`) y la nota de examen
  (`:158-163`), con un check detrás** (`:164-178`), que el vídeo contestaba de antemano: s04 enseña justo su trampa,
  comparar el control con lo que cuesta un evento. Ya no hay excepción: **todo lo que enseña el vídeo va antes en la
  lección**, incluido el cálculo hacia atrás (la nota, `:162`, «Dos»), los cuatro términos y las dos fórmulas (`:105-108`),
  el ejemplo de R-014 entero (`:109-142`), los tres checks anteriores (`:38-52`, `:89-103`, `:143-157`), el del ALE
  (`:164-178`) y la tabla de cualitativo frente a cuantitativo (`:58-88`). El párrafo que sigue (`:179-182`) abre con «un
  cálculo no es una decisión» (`:181`): s05 **no** lo dice con esas palabras ni en voz ni en el sello (ver s05). Se fija en la
  suite `lesson videos` de `src/data/content.test.ts` (`:248`; las líneas de cada vídeo acaban en `:317` con V19) con su
  línea `toBe('sp5m3')`; la suite no mira la posición del bloque. **Numeración:** el bloque ocupa **11 líneas** (el párrafo
  de enlace, 4, y el bloque de vídeo, 7). Las citas de sp5m4 de V26 son las del archivo **sin** este vídeo; al fusionar
  las dos ramas hay que sumarles 11 (`:301` en adelante pasa a `:312`). Las citas de esta ficha también son del archivo
  sin el vídeo (las posteriores a `:178`, q1 a q8 incluidas, se desplazan igual).
- **Enfoque («una casilla roja y un número»):** sin fecha, el comité de riesgos tiene delante el riesgo R-014 en la matriz
  de riesgo (no «mapa de calor», que es el del site survey de V21), en la casilla roja, y alguien pregunta «¿cuánto?». La
  jugadora, en segunda persona, le pone número: lo que cuesta
  un evento, lo que cuesta al año y si el control que se estudia sale a cuenta. **Es un análisis, no un incidente: nada se ha
  cifrado, nada se ha comprado ni se ha decidido.** Registro de análisis, como el «diseño y simulación» de V20: «si un
  ransomware cifrara el servidor», «el control que se estudia». PAPER GOVERNOR llega con dos acuerdos de acta (atajos de despacho), uno por
  capítulo. Sin frase de puente: el vídeo no continúa ningún otro y se entiende solo. Termina en el número y su comparación
  con el coste anual del control; qué se hace con él es de la lección siguiente (sp5m4, V26).
- **Dónde acaba V25 y qué es de V26.** V25 es dueño de **la aritmética** (AV, EF, SLE, ARO, ALE), de **«la ALE es lo que se
  compara con el coste anual del control»** y del cálculo hacia atrás. Acaba con R-014 en **50.000 € al año** y el control de
  20.000 € «sale a cuenta en los números», que es el número con que empieza sp5m4 (`sp/sp5-part2.ts:316`, «terminó con un
  número: 50.000 €… R-014»). **V26 no recalcula** el SLE ni la ALE: arranca de ese número y lo que viene es suyo: el risk
  register, el risk owner, los KRIs y el threshold, apetito frente a tolerancia, mitigate/transfer/accept/avoid (con
  exception y exemption), el reporting y el BIA con RTO, RPO, MTTR y MTBF. V25 **no dice** ninguna de esas palabras ni
  «seguro», ni «dueño del riesgo», ni de dónde sale el ARO más allá de «la frecuencia que se espera». **DR (V24, sp3m7) y
  YARA/Sigma (V27) no se tocan:** las copias solo salen como el nombre de un control en una línea de coste («Backup
  inmutable + EDR gestionado»); no se explica qué es una copia inmutable ni se prueba una restauración.

**Conceptos (3) y su imagen:**

La imagen es un móvil, de la vida cotidiana y a la escala de 1 a 1.000 de las cifras del puerto: 400 € el móvil, 100 € la
pantalla, 50 € al año de golpes esperados, 20 € de funda que se amortiza en un año (se dice así **una sola vez**; no se
repite «al año» en las dos fundas, que no es como se compra una funda). No es del puerto ni de nadie con nombre. No usa ninguna de
las imágenes ocupadas del registro (casco, chaleco, almacén, foco, candado, carné, valla ni garita; §6) ni toca el aparcamiento
(de V21): el móvil se cae en la mano, no se deja en ningún sitio.

| # | Concepto | Imagen que se mantiene | Tarjetas |
|---|---|---|---|
| 1 | Un evento no se lo lleva todo. El **asset value (AV)** es lo que vale el activo para el negocio (servidor, licencias y datos operativos: `sp/sp5-part2.ts:117`, `:107`); el **exposure factor (EF)** es el **porcentaje** de ese valor que se pierde en **un** evento (0,25: la cuarta parte); y el **SLE = AV × EF** es lo que cuesta **uno** (`:107`, `:122`, nota `:162` «Uno» y «Cuatro», q2 `:195-204`, q8 `:280-294`) | El móvil de 400 €: una caída no te lo destroza entero, se lleva la pantalla, que son 100 €. Perder el valor entero solo pasa con un EF de 1 | «SLE = AV × EF: lo que cuesta un solo evento» |
| 2 | Del evento al año. El **annualized rate of occurrence (ARO)** es una **frecuencia**, no un trozo del valor: 0,5 es una vez cada dos años, nunca «dos veces al año»; y **ALE = SLE × ARO** va después del SLE, en ese orden (`:107`, `:123`, `:138-141`, nota `:162`, q1 `:185-194`, q3 `:205-219`). Hacia atrás, dada la ALE y el ARO, se divide para llegar al SLE (nota `:162`) | La misma caída: una cada dos años. En diez años, cinco golpes esperados; repartidos como caigan, no en fila. Con un golpe de 100 € cada dos años, son 50 € por año en los que no se nota ninguno | «ALE = SLE × ARO: lo que se espera perder al año» · «EF es un porcentaje del valor; ARO, veces al año» |
| 3 | La ALE decide, y es una estimación. Se compara con el **coste anual** del control, porque los dos son anuales (`:107`, `:125-130`, `:132-136`, nota `:162` «Tres», check `:164-178`, q4 `:220-234`); si no sale a cuenta, hace falta otro argumento (obligación legal, seguridad de las personas, o que cubra además otros riesgos, `:107`). Y la cuenta vale lo que valen sus estimaciones: su valor está en obligar a escribir cuánto vale cada cosa y cada cuánto se cree que pasa (`:107`; falsa precisión, `:56`, `:80`) | La funda reforzada de 20 €, que se amortiza en un año, frente a los 50 € de golpes que espera evitarte: sale a cuenta. Una de 90 €, no, aunque «cueste menos que el móvil»: 90 frente a 50, y la cuenta es la que decide, no el precio a ojo. Y si te caes menos de lo que creías, la funda deja de compensar | «El control sale a cuenta si cuesta menos que la ALE» |

**Escenas:** seis, en tres capítulos (Del adjetivo al euro · Del evento al año · Para el examen).

| Escena | Cap. | s | Qué se ve | Qué se aprende · cues |
|---|---|---|---|---|
| s01-hook «Una casilla roja» | I Del adjetivo al euro | 20 | Sello «comité de riesgos · R-014 · datos ficticios», **sin fecha**. Una matriz de riesgo de tres por tres (no «mapa de calor») con una casilla roja rotulada «R-014 · ALTO». Al lado, la pregunta del comité, sin respuesta: «¿cuánto?». La primera frase habla del comité, no del cálculo («El comité de riesgos tiene una casilla roja, y con una casilla roja no se decide cuánto gastar»); al acabarla, título «El riesgo, en euros al año» (hacia los 8 s, siempre antes de los 12) y la promesa en tres chips: «lo que cuesta un evento · lo que cuesta al año · si el control sale a cuenta». Después la casilla roja se atenúa | La promesa en los primeros 10 s: un «alto» no se compara con el precio de nada (nota `:162` «Cinco»); al acabar sabrás poner el euro y compararlo · `heat, ask, title, promise` |
| s02-evento «Un golpe no se lo lleva todo» | I | 40 | La línea de R-014 rotulada «si un ransomware cifrara el servidor de planificación de grúas del muelle norte» (la de la lección, `sp/sp5-part2.ts:114`), «análisis · sin efectos». El bloque «AV · 400.000 €» con la nota «servidor + licencias + datos operativos». Entra la etiqueta «PAPER GOVERNOR · sección 5» con «vive en los huecos de tu gobernanza» (`sp/sections.ts:123`), presentada desde cero. Mensaje interceptado, en acta: «Se acuerda: el valor del servidor es la pérdida. Queda en acta.». Respuesta de la narradora: poner el valor entero como pérdida es un EF de 1, la pérdida total. El bloque pierde su cuarta parte: «EF · 0,25 · el 25 % del valor, en un solo evento». Resultado, en la línea de debajo: «SLE = AV × EF = 400.000 × 0,25 = 100.000 €», con el rótulo «lo que cuesta UN evento» (`sle`). El móvil de 400 € en miniatura, con la pantalla rota | Un evento no se lo lleva todo; el SLE es lo que cuesta uno; el EF es un porcentaje · `asset, adversary, ef, bite, sle, phone` · **intercept** |
| s03-año «Cuántas veces al año» | II Del evento al año | 46 | El SLE de 100.000 € baja a una línea de diez cuadrados, uno por año. «ARO · 0,5» y, debajo, «una vez cada dos años»; se marcan cinco años de diez, en posiciones desiguales y con el rótulo «esperados, no fijos». Debajo, «ALE = SLE × ARO = 100.000 × 0,5 = 50.000 € al año» (`ale`). Dos tarjetas pequeñas, lado a lado, que no se cruzan: «EF · 0,25 · un trozo del valor» y «ARO · 0,5 · veces al año». Pregunta para pensar, con dos botones: «12.000» y «108.000», sobre «otro riesgo · ejemplo · no es R-014» y «ALE 36.000 · ARO 3». Respuesta: 12.000, porque la ALE es el SLE por el ARO y, hacia atrás, se divide; los 108.000 salen de multiplicar | El ARO es una frecuencia; la ALE es el SLE por el ARO; hacia atrás se divide · `sle-in, years, aro, ale, factors, think, back` · **think** |
| s04-control «Lo que cuesta el control» | II | 46 | Dos barras anuales sobre la misma escala: «ALE de R-014 · 50.000 € / año» y, debajo, «Backup inmutable + EDR gestionado · 20.000 € / año» (la de la lección, `:126-127`), con «ALE que elimina (estimación)». Entre las dos, «50.000 − 20.000 = 30.000 € al año» (`:128`) y el veredicto «en los números, sale a cuenta» (`fits`), con el sello «recomendación al comité · no contratado». Después, una segunda barra de «Reconstrucción en alta disponibilidad · 90.000 € / año» (`:133`) que se pasa de la línea de la ALE (`over`). Mensaje interceptado, en acta: «Se acuerda: el control cuesta menos que un incidente. Queda en acta.». Respuesta de la narradora: el coste del control se compara con la ALE de 50.000, no con los 100.000 de un incidente; una cosa es un golpe y otra, un año (con ese atajo hasta los 90.000 «pasarían»). «Solo con estos números, no sale» y la nota pequeña «o hace falta otro argumento: una obligación legal, la seguridad de las personas, o que cubra además otros riesgos». El móvil con la funda de 20 € y la de 90 € (la de 20 se dice «se amortiza en un año»; la de 90, sin repetir «al año») | La ALE se compara con el coste anual; una opción más cara que la ALE necesita otra razón · `bars, control, net, fits, alt, over, intercept, annual` · **intercept** |
| s05-aguanta «¿Y si nos equivocamos?» | II | 36 | La misma cuenta, ahora con dos palancas que se mueven: «ARO 0,5, ahora 0,2» y la ALE cae a «20.000 €», **igual que el control**: el rótulo «aquí empata». Por debajo, el control cuesta más de lo que evita. Segunda palanca, «EF 0,25, ahora 0,10»: otra vez 20.000 €. Los dos ejes con su lectura: «0,2 · una vez cada cinco años» y «0,10 · el 10 % del valor». Rótulo: «la cuenta vale lo que valen sus estimaciones». Sello final: «R-014 · 50.000 € al año · una estimación para comparar». **Ya no cita «un cálculo no es una decisión»** (`:181`): con la inserción tras el último check, esa frase abre el párrafo que viene justo después del vídeo y no se adelanta ni en voz ni en pantalla (H7) | La ALE es una estimación; el EF y el ARO son cosas distintas aunque los dos se escriban 0,x; hasta dónde aguanta la cuenta · `lever, aro, empate, ef, below, estimate, stamp` |
| s06-recap «Tres reglas» | III Para el examen | 22 | Tres tarjetas de reglas, cada una con su icono (el móvil con la pantalla rota · el calendario de diez años · las dos barras anuales); tarjeta final Alertópolis con **una sola tarea**: «Tu turno: Risk Math» (spl5c). Sin «las preguntas de la lección» en la tarjeta ni en la voz (H8) | Reflejos · `recap, rule-1, rule-2, rule-3, next, endcard` |

- **Tarjetas de examen** (objetivo 5.2), una por escena de s02 a s05, cada una con su cue antes de la última frase de la
  escena (`examTiming: sentence-end`):
  - «SLE = AV × EF: lo que cuesta un solo evento» (s02) (43)
  - «ALE = SLE × ARO: lo que se espera perder al año» (s03) (47)
  - «El control sale a cuenta si cuesta menos que la ALE» (s04) (51)
  - «EF es un porcentaje del valor; ARO, veces al año» (s05) (48). Es la nota de examen «Uno» (`sp/sp5-part2.ts:162`) y la
    confusión que más puntos cuesta; sale en s05 y no en s03 porque s05 es donde los dos números 0,x se mueven por
    separado, y en s03 solo se ponen lado a lado.
- **Pregunta para pensar** (`holdMs` 4500): «ALE de 36.000 y ARO de 3: ¿cuánto es el SLE?» (s03) (44). Con dos botones
  («12.000» y «108.000»), llega con las dos cifras en pantalla y sin nada que la conteste. Respuesta: 12.000, porque
  ALE = SLE × ARO y, hacia atrás, SLE = ALE ÷ ARO (36.000 ÷ 3 = 12.000); los 108.000 son multiplicar. **No es una pregunta de
  la lección**: el check `:164-178` pide la ALE a partir del SLE y el ARO, y q1 y q4 también van hacia delante; el cálculo
  hacia atrás solo está en la nota (`:162`), sin ejercicio. Y **no usa cifras de R-014** a propósito: con las de R-014 se
  contestaría de memoria (los 100.000 acaban de salir en pantalla). El título de la escena («Cuántas veces al año») no da
  la respuesta. Las cifras son un ejemplo sin activo ni dueño: no son de Halden.
- **Mensajes interceptados** (PAPER GOVERNOR, `holdMs` 3800; uno en I y otro en II, ninguno en el cierre; sin cifras ni siglas,
  para que la voz de SAPI no tenga que leerlas, como el «9,8» de V18). **Registro de acta impersonal, sin tuteo**, de la
  forma «Se acuerda: … Queda en acta.», el mismo en los cuatro mensajes de V25 y V26 (reconciliación, «Compartido», 2):
  - s02: «Se acuerda: el valor del servidor es la pérdida. Queda en acta.» (63). El error concreto que corrige la narradora:
    tomar el valor del activo como la pérdida de un evento (error 1 de `:139`, q2). Solo valdría con un EF de 1.
  - s04: «Se acuerda: el control cuesta menos que un incidente. Queda en acta.» (68). El error: comparar el coste anual del
    control con lo que cuesta **un** evento (el SLE) en vez de con la ALE, que es anual. Con ese atajo hasta el control de
    90.000 € «pasa» (90.000 < 100.000) y no debería (nota `:162` «Tres», check `:164-178`).
  Ninguno tutea ni da órdenes: son lo que el acta registra, como los mensajes sin persona de NULL CIPHER y BLIND ARCHITECT,
  y no el imperativo de SILENT PAGER y RED MARROW. Ninguno llama «analista» a la jugadora (el anuncio del jefe de sp5
  sí la llama «analista», `sp/sections.ts:123`, pero es del jefe, no de ella; es el tic de HOLLOW LANTERN en GCTI y no se
  hereda). **«Queda en acta.» es una coletilla propuesta**, como el «Lógico.» de NULL CIPHER, el «Confía en mí.» de RED MARROW
  y el «Menos es más.» de BLIND ARCHITECT; **decide Lidia** (ver «Preguntas para Lidia» y «Decisiones», 3), y V26 la hereda.
  El primer mensaje es la frase de la prueba de oído (sin cifras ni siglas, 63 caracteres).
- **Cierre:** tres reglas y una sola tarea.
  1. Un evento no se lo lleva todo: el SLE es el valor del activo por el EF, y el EF es un porcentaje.
  2. Al año, se multiplica por el ARO, y el ARO es cuántas veces al año: 0,5 es una vez cada dos años. Hacia atrás, se divide.
  3. Se compara la ALE con lo que cuesta el control **al año**. Si no sale, hace falta otro argumento, y la cuenta vale lo que
     valen sus estimaciones.

  **Tarea (una sola, H8):** el laboratorio Risk Math (spl5c), que pone un riesgo del puerto y ocho afirmaciones
  (`sp/labs-sp5.ts:36-45`, datos `:203-251`). La tarjeta final y la voz del cierre solo nombran esa. Las preguntas de la
  lección (8) siguen en el texto de la lección y el vídeo no las propone: tocan el vídeo cinco, q1 (ALE), q2 (SLE), q3 (ARO),
  q4 (decisión) y q8 (EF); q5, q6 y q7 son de cualitativo, cadencias y controles ya existentes, y el vídeo no las trata.
- **Se queda fuera** (sigue en la lección, que quien ve el vídeo ya ha leído o leerá justo después):
  - Identificación del riesgo (activos, amenazas, vulnerabilidades y controles existentes) y las magnitudes probability,
    likelihood e impact (`sp/sp5-part2.ts:24-28`, q7 `:265-279`). El vídeo parte de un riesgo ya identificado.
  - Las cuatro cadencias, ad hoc, recurring, one-time y continuous (`:29-37`, check `:38-52`, q6 `:250-264`).
  - La tabla completa de cualitativo frente a cuantitativo y la falsa precisión como concepto con nombre (`:53-88`, check
    `:89-103`, q5 `:235-249`); solo sale la idea de que «alto» no se compara con el precio de nada, en s01, y la frase de la
    estimación en s05.
  - El diagnóstico «200.000»: tres errores distintos (tomar el valor como SLE y multiplicar por 0,5; dividir el SLE por el
    ARO; leer 0,5 como dos veces al año) dan la misma cifra, 200.000 €. Es la lista de errores de la lección (`:138-141`)
    puesta en una línea. Candidato a entrar en s03 si el primer borrador queda corto; **si entra, destripa del todo dos
    afirmaciones de spl5c** (`sp/labs-sp5.ts:234-243`).
  - El nombre «risk register» y todo lo de la lección siguiente (ver «Dónde acaba V25»).
  - Cuánto reduce un control real (parte de la ALE, no toda): la lección habla de «la ALE que elimina» (`:127`) y no desarrolla
    el control que solo quita una parte. **A verificar con el material oficial; no entra en tarjetas ni en la voz.**
- **Laboratorios:** el único relacionado es **spl5c, «Risk Math»** (`sp/labs-sp5.ts:36-45`, datos `:203-251`), de tipo `select`:
  ocho afirmaciones, cuatro correctas. Comparte con la lección las cifras de R-014 (400.000 €, EF 0,25, ARO 0,5, control de
  20.000 €) pero con **otro activo**: el laboratorio habla del «sistema de gestión de la terminal de contenedores»
  (`:207`) y la lección, del «servidor de planificación de grúas del muelle norte» (`sp/sp5-part2.ts:114`); el vídeo usa
  el de la lección (ver «Contradicción nueva»). Al ya ejercitar la misma decisión (penalización L), el vídeo no juega a
  elegir cuatro de ocho, y aporta lo que el laboratorio no tiene: la cadena paso a paso con una imagen, el calendario de
  diez años que enseña por qué 0,5 no es dos veces al año, el cálculo hacia atrás (que el laboratorio no pide) y hasta dónde
  aguanta la cuenta. Tres precauciones:
  - **El vídeo repasa lo que la lección y el laboratorio comparten, y no lo oculta (H17).** Dice los números de R-014
    (100.000 y 50.000) y que 20.000 < 50.000, que son los de la lección (`:122-130`) y las tres primeras afirmaciones de
    spl5c (`:210-223`), y nombra como errores los de dos incorrectas («el SLE es 400.000», s02, y «ARO 0,5 = dos veces al
    año», s03 y s05). Por eso la tarea del cierre queda como repaso de lo que se acaba de ver, y se asume (penalización L): el
    laboratorio aporta ahí lo que el vídeo no, elegir cuatro de ocho sin guía. No trata la cuarta afirmación (seguro,
    transfer, `:225-228`) ni la del CVSS (`:245-247`, es de la lección sp4m5).
  - **No sale «seguro»**: la cuarta afirmación del laboratorio es transfer, y es de sp5m4 (V26).
  - **El ejemplo de la pregunta para pensar (36.000 y 3) no es ninguno de los de la lección ni del laboratorio**: ni
    el del check (30.000 y 4, `:167`), ni q1 (40.000 y 3, `:189`), ni q4 (600.000, 0,5 y 75.000, `:224`).

**Canon nuevo que fija V25** (nada de esto estaba en los datos del curso; lo posterior debe respetarlo):
- **El comité de riesgos mira R-014 con la cuenta de la lección, sin fecha en pantalla ni en voz.** La lección la fecha el
  03-09-2026 (`sp/sp5-part2.ts:113`; registro §2, tabla «fondo», `registro:135`): V25 **no repite esa fecha** (ver «Decisiones», 1).
  El vídeo solo fija que los números de R-014 (AV 400.000 €, EF 0,25, ARO 0,5, SLE 100.000 €, ALE 50.000 €, control de 20.000 €
  al año y la alternativa de 90.000 €) son **un análisis que se presenta al comité, sin decisión tomada**: nada se ha
  contratado ni puesto en marcha, y el vídeo lo dice con «recomendación al comité · no contratado».
- **Canon deducido** (cálculo propio, no lo dice ninguna fuente; el registro lo anota como «(deducido)»): la ALE de R-014
  iguala el coste del control con un ARO de 0,2 (una vez cada cinco años) o con un EF de 0,10; con ARO 0,5, en diez años se
  esperan cinco eventos, 500.000 €, frente a 200.000 € de control (no sale en pantalla); el control de 90.000 € cuesta
  40.000 € al año más de lo que evita (tampoco sale). Ninguna es una cifra de Halden: son aritmética de los datos de la lección.
- **PAPER GOVERNOR**, primera aparición. Voz propuesta (reconciliación): Laura con `megafonia`, `rate` −1; reserva, Pablo con
  `cifrado`, `rate` 0; decide Lidia tras la prueba de oído. Dos acuerdos, uno por capítulo, en **registro de acta
  impersonal**: «Se acuerda: … Queda en acta.» (coletilla propuesta; V26 la hereda y dice «vuelve»). Presentación de la
  narradora **desde cero** con la frase del anuncio del jefe de sp5 («vive en los huecos de tu gobernanza»,
  `sp/sections.ts:123`) y, en pantalla, «PAPER GOVERNOR · sección 5». Sin IP, dominio ni equipo; no ataca nada.
- **La valoración cualitativa «ALTO» de R-014** (la casilla roja de s01): la lección no da ninguna valoración cualitativa de R-014
  (`:113-141` solo trae la cuantitativa); es un rótulo nuevo, solo en pantalla y sin voz. Si no se quiere, basta la casilla roja.
- **El ejemplo de la pregunta para pensar** («ALE 36.000 · ARO 3»): rotulado «otro riesgo · ejemplo · no es R-014»; no es
  de nadie ni del registro.
- **Comprobado contra la cronología:** nada de V25 se fecha. El 3-9-2026 es jueves (Node), el día de la tarde de V1; por eso
  no sale. Nada choca con ningún hecho fechado de §2. **La lección sí lo fecha** (`:113`, «03-09-2026 · comité de riesgos
  del puerto»; `registro:135`) y quien ve el vídeo acaba de leerlo (H18): el vídeo no lo dice y la voz no lo vincula con
  V1; **la voz no dice «hoy», «ese día» ni «aquel día»**.

**Contradicción nueva (para el registro, §5):** el laboratorio spl5c y la lección usan **las mismas cuatro cifras** (400.000 €, EF
0,25, ARO 0,5, control de 20.000 €) para dos activos distintos: «sistema de gestión de la terminal de contenedores»
(`sp/labs-sp5.ts:207`) y «servidor de planificación de grúas del muelle norte» (`sp/sp5-part2.ts:114`). El primero se lee fácil
como `srv-tc-app03` («servidor de la terminal de contenedores», `registro:178`). V25 no los junta ni arregla: usa el de la
lección y calla el del laboratorio. Cambio propuesto, fuera de esta ficha: que el laboratorio hable del mismo servidor que la
lección (o de otro activo con otras cifras).

**No se toca:**
- **La fecha del 3-9 y el caso.** La tarde de ese jueves es la de `OPS-WS-14`, Lucía y el correo (V1; `registro:50-52`):
  V25 no fecha el comité, no dice «aquel día» ni «esa mañana», y **nunca** sugiere que el comité «lo vio venir» ni que R-014
  guarde relación con septiembre. Tampoco `IR-2026-0147`, `srv-tc-app03`, `svc_tosreport`, los 38 GB ni el 4-9. Lo de
  septiembre fue una salida de datos, otra cosa: el vídeo no lo compara con R-014 y la voz no dice «como pasó», «habría
  frenado» ni si hubo o no ransomware.
- **El servidor de R-014 es de planificación, no de control, y no se dibuja conectado a nada.** Ni OT, ni PLC, ni esclusas, ni
  el servidor de control de grúas que habla con un dominio desconocido (`sp/sp2-part1.ts:147`; `registro:846`, `:800`), ni la
  red de las bombas de V16, ni zonas ni VLAN ni equipo. Se dice «servidor de planificación», no «sistema de control».
- **La vulnerabilidad del riesgo.** La lección escribe «aprovechando una VPN sin MFA» (`:27`): V25 **no la usa**. V17 no dice cómo se
  inicia sesión en la VPN y la MFA del proveedor de identidad es del 30-11 (V10); el vídeo solo dice «un ransomware cifra el
  servidor», que es la línea del ejemplo (`:114`).
- **El dosier de PAPER GOVERNOR** (`sp/sections.ts:125`): ni «contratista con acceso perpetuo» ni «sin due diligence» ni «el
  puerto vuelve a operar». Tampoco «GH». De su anuncio (`:123`) solo sale «vive en los huecos de tu gobernanza»; «riesgos sin
  registro» queda para V26 y «un proveedor sin contrato» no sale. La narradora no dice quién es GLASS HARBOR.
- **La voz de los otros cuatro:** ninguna textura nueva. Laura con `megafonia` no es la de RED MARROW (Laura con `telefono`),
  ni la de PAPER CRANE (Laura con `machine`), ni la de BLIND ARCHITECT (Helena con `megafonia`, `rate` −2); si en la prueba
  de oído se confunde con alguna, ver la reserva (Pablo con `cifrado`, que tampoco es la de SILENT PAGER ni la de NULL CIPHER).
- **Seguro, transfer, mitigate, accept, avoid, risk register, risk owner, KRI, appetite, tolerance, RTO, RPO, MTTR, MTBF, BIA.**
  Todo es de V26. «Control» sí; «mitigar» no se dice, porque en el examen es una estrategia con nombre. El puerto no tiene ni
  deja de tener seguro (`registro:614`).
- **Los equipos y los hechos de otros vídeos:** el ERP (V20), el portal de reservas y su noche (V10–V12, V16), `srv-msg01`,
  `srv-msg02` y `cam-nvr-02` (V18), HALDEN-OPS y las tabletas (V21), el túnel y la VPN (V17), el proveedor de identidad y la
  MFA del 30-11 (V10). R-014 sale como identificador **solo en pantalla**.
- **La imagen del móvil no es el «móvil de guardia»** de V5b (`registro:86`) ni «tu móvil» del segundo factor hipotético de V6
  (`registro:428-430`): aquí el móvil solo se cae. Sin segundo factor, sin guardia, sin llamadas.
- **«El control que se estudia» no es la mejora de V5** («gestor de contraseñas con rotación» ni «agente en todas las estaciones
  de administración», `registro:276`) ni dice nada de si el puerto tiene o no copias o EDR gestionado: es la línea de coste de
  la lección (`:126`) y nada más. **«Gestionado» solo en pantalla** (H20): la voz dice «copias y EDR» y nunca «gestionado por
  un proveedor» (un EDR gestionado es un servicio de tercero, territorio del dosier de PAPER GOVERNOR y de sp5m5); y V1 y V5
  ya tienen un EDR (el que aísla `OPS-WS-14` a las 16:11, `registro:56`) y copias (V5 restaura la del 2-9, `registro:76`):
  el vídeo no dice si el puerto las tiene.
- No se culpa a nadie: ni a quien puso el valor del servidor ni a quien estimó la frecuencia. La cuenta es «una estimación
  sobre estimaciones» (`:107`), no un reproche.
- Ninguna IP, dominio, cuenta ni equipo con nombre en pantalla (R-014 y el «muelle norte» son identificadores de la lección).

**Comprobación de límites** (perfil `capsula-yt`; recuento con Node, `[...texto].length`, por `check-v25-fix.mjs`, que lee
esta ficha; tras la revisión de 2026-10-14):
- Duración: suma 210 s; render esperado 235–250 s, dentro de 190–260. Los extremos conocidos (0,89 y 1,22 veces la suma)
  dan 187–256 s: el alto cabe; el bajo queda 3 s por debajo del mínimo, pero V12, V18 y V20, con la misma estructura,
  estimaron por encima de su suma (unos 260 s con 210), así que se espera lo contrario. Si el primer borrador se acerca a 190,
  se alarga s03.
- 6 escenas en 3 capítulos (máximo 3). 3 conceptos (2–3), cada uno con como mucho dos tarjetas (1, 2 y 1).
- 4 tarjetas de examen (3–5), una por escena de s02 a s05, ninguna en la última; de 43 a 51 caracteres (máximo 58), sin
  `{}[]|<>`, flechas, marcas, viñetas ni emoji (`×` y `;` no están en la lista de símbolos prohibidos).
- 1 pregunta para pensar (exactamente 1), 44 caracteres (máximo 48), `holdMs` 4500.
- 2 mensajes interceptados (1–2), uno por capítulo (I y II), ninguno en la escena final; de 63 y 68 caracteres (máximo 70),
  sin cifras ni siglas ni `{}[]|<>`, flechas, marcas ni emoji (`:` y `.` no están en la lista); `holdMs` 3800 (2500–4500);
  `video.json` lleva `"adversary": "PAPER GOVERNOR"`. Ninguno comparte segmento con la pregunta. Con `rate` −1 la voz
  dura algo más: se mide al voicear y, si un mensaje no cabe en 3800, `holdMs` sube (máximo 4500).
- Cues de `sfx`: `sle` («ding»), `ale` («ding»), `fits` («check») y `over` («block»), cada uno en su escena; los tres sonidos
  existen en `video/engine/sfx/sfx.json` (`ding`, `check`, `block`); sin cue repetido ni inexistente.
- Cierre: una sola tarea (Risk Math, spl5c); 3 reglas.
- Inserción: tras el último check de la lección (`:164-178`), 11 líneas de bloque + párrafo de enlace.
- `wordBudget` por escena (`s` × 2,7): s01 54 · s02 108 · s03 124 · s04 124 · s05 97 · s06 59 (total 566).
- Título antes de los 12 s: la primera frase de s01 («El comité de riesgos tiene una casilla roja, y con una casilla roja no
  se decide cuánto gastar») tiene 18 palabras, unos 7 s a 2,7 palabras/s; el título entra hacia los 8 s. Si cae después de los
  12 s, se quita «y con una casilla roja no se decide cuánto gastar».
- Sin identificadores en la voz: `R-014` solo en pantalla; sin hosts, IP ni cuentas.

**Notas para el guion:**
- **s02.** La narradora presenta a PAPER GOVERNOR con una sola frase y su etiqueta (el anuncio del jefe de sp5, `sp/sections.ts:123`,
  sin el resto del texto). La corrección del mensaje es «eso sería un EF de uno: perderlo todo».
- **s03, el ARO.** El calendario enseña un valor esperado, no un horario: «una vez cada dos años» no quiere decir «el año que
  viene no pasa». Cinco marcas en diez años, en posiciones desiguales, y «esperados, no fijos».
- **s04, «sale a cuenta».** Es una recomendación en los números, no una compra: «recomendación al comité · no contratado». El
  vídeo no dice que el comité lo apruebe ni que el puerto lo contrate (el registro llama «plan» a lo que aún no funciona).
- **s05, el empate.** Con la ALE igual al coste, el control «cuesta lo mismo que lo que evita»: no se dice ni «justificado» ni «no
  justificado» en el empate, porque la lección no lo dice (`:107`: «menos que» y «más que»). La lectura por debajo de 0,2 sí:
  «cuesta más de lo que evita». Es aritmética de la lección, **no un punto de examen**: sin tarjeta.
- **Palabras que no se dicen:** «mitigar», «transferir», «aceptar», «seguro», «dueño del riesgo», «registro de riesgos» (V26);
  «ransomware» sí, pero siempre en condicional («si cifrara»). Y, por la revisión: «hoy», «ese día» y «aquel día» (H18);
  «muelle» a secas y «gestionado» (H32, H20); «mapa de calor» (H19; es «la matriz de riesgo»); «un cálculo no es una
  decisión» (H7, ni en voz ni en pantalla); y «otra vez» y «vuelve» referidos a PAPER GOVERNOR (es su primera aparición).

**Decisiones** (con la alternativa descartada):
1. **Números de la lección, sin fecha en pantalla.** Los números salen de R-014 (`:116-136`), que son los que enlaza sp5m4 en su
   primera línea (`:316`, 50.000 €) y los únicos con canon existente: ninguna cifra nueva de Halden. La fecha de la lección
   (03-09-2026, `:113`) es la del jueves del correo de Lucía; V25 no la pone. Descartado **caso nuevo** (otro activo y otras
   cifras, p. ej. otro riesgo del comité): serían cuatro cifras y un activo de canon nuevo, con riesgo de chocar con el registro
   de riesgos que escribe V26 y con el hilo «50.000 €» con que empieza sp5m4; y la penalización L del ranking no se paga por
   usar el mismo ejemplo (el laboratorio juega a elegir, el vídeo no). Descartado también **fechar el vídeo el 3-9 con una frase
   de «sin relación con la tarde»**: la frase misma ya los junta. Descartado **volver a fechar R-014** más tarde: contradice
   la cabecera de la lección. Lo que el caso nuevo habría dado y el vídeo da igual es la variación: la pregunta para pensar y
   la sensibilidad usan cifras o palancas que ni la lección ni el laboratorio traen.
2. **Voz de PAPER GOVERNOR: Laura con `megafonia`, `rate` −1 (reserva: Pablo con `cifrado`, `rate` 0).** Cambiada en la
   reconciliación; la ficha original proponía Pablo con `cifrado`. Razón: el dosier dice «desenmascarada»
   (`sp/sections.ts:125`) y la regla de la tanda 3 es que la voz fija el género (Helena para NULL CIPHER y BLIND ARCHITECT);
   es una pareja que no usa nadie y no pide efecto nuevo (las cuatro texturas están ocupadas y no se admiten nuevas, así
   que la nueva comparte una pieza). Comparte la voz base con RED MARROW (`telefono`) y PAPER CRANE (`machine`) y el efecto
   con BLIND ARCHITECT (Helena, `rate` −2); `rate` −1 («lee un acta») la separa de BLIND ARCHITECT. Descartado **Pablo
   con `cifrado`** como primaria (suena a hombre y, sin `machine`, nada enmascara el tono; queda de reserva: es la más
   lejana de las cinco existentes en voz, textura y espacio), **Laura con `cifrado`** (más cerca de NULL CIPHER por la
   textura, y Laura ya es de dos adversarios), **Helena con `telefono`** (Helena ya es de dos adversarios, y `telefono` y
   `megafonia` son las dos bandas recortadas que la revisión de V16 y V17 ya vio parecidas) y **Pablo con `telefono` o
   `megafonia`**. **Riesgo:** que suene a RED MARROW o a BLIND ARCHITECT; el dosier de sp5 es el que junta a GLASS HARBOR en
   una sola operación (`registro:346`), y dos adversarios que suenan igual lo sugieren sin destriparlo. Es una decisión
   de Lidia (ver «Preguntas para Lidia»). **Prueba de oído antes de congelar** (`revision-secplus.md`, «Voz»): el primer
   mensaje, «Se acuerda: el valor del servidor es la pérdida. Queda en acta.», con las parejas candidatas y las tres anclas
   (NULL CIPHER, BLIND ARCHITECT y RED MARROW), una detrás de otra, también en contexto y con la compresión de YouTube.
3. **Coletilla «Queda en acta.».** Propuesta (y, en la reconciliación, ya puesta en los cuatro mensajes): cada adversario con
   voz propia tiene una (NULL CIPHER, RED MARROW, BLIND ARCHITECT) y el registro de PAPER GOVERNOR es el del acta. Descartado
   **sin coletilla**, como SILENT PAGER, cuyo registro se cuidó de no tener firma sin decidirla (`registro:616`): V18
   explica que una coletilla es decisión de Lidia, y aquí es la primera aparición. Si Lidia no la quiere, los dos mensajes
   acaban en el punto anterior («Se acuerda: …») y el resto no cambia. Con coma o sin coma delante, se prueba en la prueba
   de oído.
4. **El móvil, no un barco ni un almacén.** Imagen cotidiana a escala 1 a 1.000 de las cifras; no usa ninguna de las
   ocupadas. Descartados un coche aparcado (V21 deja el aparcamiento «sin coches», `registro:774`), una temporal (el mar de V18) y
   un contrato de mantenimiento (ningún proveedor ni técnico de mantenimiento con nombre, `registro:364`).
5. **El cálculo hacia atrás como pregunta, con cifras ajenas.** La lección solo lo dice en la nota (`:162`) y no tiene ejercicio.
   Descartada la pregunta «¿qué es el EF?» o «¿cuánto es el ARO?» (q3 y q8 las contestan) y descartada la misma pregunta con las
   cifras de R-014 (se contesta de memoria).
6. **El vídeo después del último check de la lección, no antes de la nota de examen.** (Cambiada en la revisión, H7.) El brief
   pedía «después de los checks y antes de la nota», pero en esta lección hay un check detrás de la nota (`:164-178`) que
   el vídeo contestaría de antemano: enseña la misma cadena y la trampa del check. Descartado **antes de la nota** (la
   primera propuesta: «es lo que la nota resume») por esa razón, y porque V24 y V26 aplican el criterio contrario; descartado
   **tras la nota y antes del check**, que lo deja igual de contestado. El vídeo va entre el check del ALE y el párrafo que
   salta a sp5m4, con la línea de enlace «Antes de pasar a la siguiente lección, míralo en el puerto: …».

**Riesgos de solape con V26 y los demás** (para quien revise la tanda):
- **V26 (sp5m4, RTO/RPO), el principal.** (a) R-014 y 50.000 € salen en los dos; V26 empieza ahí (`:316`) y no debe recalcular. (b) La
  tabla de V26 (`:349-377`) dice que mitigar es la respuesta equivocada cuando «el coste del control supera con creces la ALE»
  (`:356`): es la regla de V25 s04; V26 la nombra como criterio de elección, V25 la enseña como cuenta. (c) PAPER GOVERNOR:
  los dos vídeos usan **la misma voz, el mismo registro de acta y la misma coletilla** (reconciliación): V25 presenta
  desde cero y V26 dice «Y vuelve PAPER GOVERNOR…» (V25 va justo antes en el curso, H4); `GOVERNOR` («gávernor») y `ARO`
  («a erre o») se leen igual en los dos. Si V26 se viera antes que V25, su «vuelve» no tendría a qué volver, pero la
  presentación completa de V26 sigue en pantalla y se entiende sola. (d) «Backup inmutable» aparece aquí como etiqueta de coste y
  en la tabla de V26 como ejemplo de mitigación (`:355`, «copias inmutables» en «el sistema de asignación de atraques»):
  son activos distintos; V25 no los junta.
- **V24 (sp3m7, DR).** Ninguno salvo la palabra «copias» en la etiqueta del control. V25 no dice RTO ni «restaurar».
- **V27 (s5m3, YARA/Sigma).** Ninguno: otra pista.

**Preguntas para Lidia** (decide Lidia; la opción recomendada va primero):
1. **Voz de PAPER GOVERNOR.** Recomendada: Laura con `megafonia`, `rate` −1 (femenina, como el dosier; pareja nueva sin efecto
   nuevo). Alternativa: Pablo con `cifrado`, `rate` 0 (la más lejana en voz, textura y espacio, pero suena a hombre). Se
   decide tras la prueba de oído de `revision-secplus.md` («Voz»), con el primer mensaje y las tres anclas, y vale para
   V25 y V26.
2. **Coletilla «Queda en acta.».** Recomendada: sí, en los cuatro mensajes de V25 y V26 (como «Lógico.», «Confía en mí.» y
   «Menos es más.»). Alternativa: sin coletilla, y los mensajes acaban en «Se acuerda: …».
3. **Pronunciaciones** al grabar. Recomendadas: `GOVERNOR` «gávernor»; `ARO` «a erre o»; `SLE` «ese ele e»; `ALE`
   «a ele e»; `EF` «e efe»; `AV` «a uve»; y V26 las usa igual. Alternativa para `ARO`: «aro» (la de V26 antes de la
   reconciliación), que un oyente confunde con «el aro».

**Hallazgos no aplicados:**
- **H17, segunda opción** (cambiar las cifras de s03 y s04 por unas propias y dejar R-014 solo en el hook): no se aplica. Rompería
  el hilo «50.000 €» con que empieza sp5m4 (`sp/sp5-part2.ts:316`) y reabriría el caso nuevo que la decisión 1 descartó. Se
  aplica la primera opción (decirlo con claridad en la ficha, precaución de «Laboratorios»).
- **H3** no pide nada a esta ficha: sus cuatro cues (`sle`, `ale`, `fits`, `over`) ya son cues de su escena y los tres
  sonidos existen en `sfx.json`.
- **H4, «V26 dice vuelve»:** es de la ficha de V26; aquí solo se deja constancia (no se toca ese archivo).

**Cambios de la revisión** (2026-10-14; `revision-secplus.md` y `reconciliacion.md`):
- **H2** · Voz de PAPER GOVERNOR a Laura con `megafonia`, `rate` −1, con Pablo con `cifrado` de reserva; registro de acta
  impersonal («Se acuerda: … Queda en acta.»); pronunciaciones `GOVERNOR` y `ARO` iguales a las de V26. Los dos mensajes
  reescritos: «Se acuerda: el valor del servidor es la pérdida. Queda en acta.» (63) y «Se acuerda: el control cuesta menos
  que un incidente. Queda en acta.» (68), cada uno con el error concreto que corrige la narradora. Decisiones 2 y 3,
  canon nuevo, «No se toca» y enfoque coherentes; lo que decide Lidia, en «Preguntas para Lidia».
- **H4** · Presentación desde cero (sin «otra vez»), V26 dice «vuelve»; reflejado en cabecera, canon nuevo, escena s02 y
  riesgos de solape (c). `vuelve`/`otra vez` quedan en las palabras que no se dicen.
- **H7** · El vídeo pasa a ir después del último check (`:164-178`) y antes del párrafo que salta a sp5m4 (`:179-182`), con
  la línea «Antes de pasar a la siguiente lección, míralo en el puerto: …»; desaparece la excepción del cálculo hacia atrás;
  decisión 6 reescrita; el sello final de s05 ya no cita «un cálculo no es una decisión» (`:181`).
- **H8** · El cierre y la tarjeta final de s06 dan una sola tarea (Risk Math, spl5c); las preguntas de la lección quedan en
  el texto de la lección.
- **H17** · La precaución «el vídeo no trae ninguna afirmación del laboratorio» se sustituye por el reconocimiento de que
  repasa lo que lección y laboratorio comparten (el cierre queda como repaso, asumido).
- **H18** · Añadido que la lección fecha el comité el 3-9, que el vídeo no lo dice ni lo vincula con V1, y «hoy», «ese día»
  y «aquel día» fuera de la voz.
- **H19** · «Funda que se amortiza en un año», dicho una vez, sin repetir «al año» en las dos fundas; «matriz de riesgo»
  en lugar de «mapa de calor» (eco con el site survey de V21).
- **H20** · «Gestionado» solo en pantalla; la voz dice «copias y EDR».
- **H31** · Numeración: el bloque más el párrafo de enlace ocupan 11 líneas (4 + 7); las citas de la ficha y las de V26 son
  del archivo sin el vídeo.
- **H32** · La voz no dice «muelle» a secas; «el servidor de planificación de grúas».
- **Comprobación de límites** recontada con `check-v25-fix.mjs` (mensajes 63 y 68; tarjetas 43, 47, 51 y 48; pregunta 44;
  `wordBudget` 566; suma 210 s); sin otro cambio de cifras.

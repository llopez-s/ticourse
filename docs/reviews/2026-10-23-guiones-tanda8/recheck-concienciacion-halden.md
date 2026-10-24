# Segunda pasada · V44 `concienciacion-halden` (sp5m8, `caso-yt`)

Revisor de solo lectura, 2026-10-23. Texto revisado: `video/concienciacion-halden/narration.json` y `storyboard.json` tal como están tras la revisión y el recorte (se borraron s04-05 y s05-03 y los cues de la farola). Contrastado con el informe `concienciacion-halden.md`, la sección «Revisión 2026-10-23» de `out/script-notes.md`, la lección `src/data/secplus/sp5-part4.ts` (`:326-335`, `:368-392`, `:418-440`) y el registro de canon.

Comprobaciones mecánicas: `build-timeline.mjs --video concienciacion-halden --check --estimate` da 0 errores, 722 palabras, 326,8 s estimados (~291 s con la lectura de Lidia a 0,89), sin aviso de ventana y solo avisos de «N words» en segmentos de pregunta/resolución. Todos los `requiredCues` de las 8 escenas aparecen en la voz (ninguno huérfano) y no hay cues de voz sin declarar. No queda «farola», «streetlight» ni «ayuntamiento» en `narration.json` ni en `storyboard.json`. Los 27 segmentos no repiten emoción en dos seguidos. Los cues de sfx (`ok-N`/`trap-N`) siguen en s03-02, s05-02 y s07-02.

## (a) Hallazgos previos

| Id | Estado | Comprobación en el texto actual |
|---|---|---|
| A-1 (Q1 risky/unintentional) | **resuelto** | Escenario «la política que prohíbe… acepta la advertencia»; voz de s03-01 igual («La política no la permite, y él acepta la advertencia»); s03-02 da el criterio («sabía que no estaba permitida y la instaló igual… se clasifica lo que decidió»); `why`/`trapWhy` y tarjeta con «advertencia». Solo B es defendible; D sigue siendo trampa real. Esta es la pregunta que se pidió mirar con el plan B: queda una sola respuesta. |
| A-2 (intención no cubre unexpected) | **resuelto** | s08-01: «si lo sabía, es risky, y si no encaja, se investiga». Se mantienen tarjeta y frase final, como admitía el informe. |
| A-3 (Q2, «reconocen el señuelo» en pantalla) | **resuelto** | `scenario` lleva «porque reconocen el señuelo». Solo C defendible (B castiga, D mide otra cosa). |
| A-4 (Sistemas) | **resuelto** | Voz «no aprobar accesos que no han pedido ellos»; goal «no aprobar peticiones de acceso que no has pedido tú»; sin MFA. |
| A-5 (subir el report rate) | **resuelto** | s04-03 abre con «El que hay que subir es el segundo, porque es el que te avisa de un ataque real». |
| B-1 («aviso» / «la primera») | **resuelto** | «casos» en s02 y el goal; «el primero/segundo/tercero»; «advertencia» en s03. «Avisos/avisar» quedan solo con el sentido de reportar (s01-01, s04, s08). |
| B-2 (phishing simulado sin explicar) | **resuelto** | s04-01 lo explica en una cláusula («correos falsos que manda él mismo, con permiso por escrito»); «Nada cruel, a propósito». Queda un `:` (ver N-4). |
| B-3 (circuito telegráfico) | **resuelto** | s04-04 sin «triaje» («Alguien lo revisa»); la parte de la farola (s04-05) se ha borrado entera, así que no queda fragmento colgado. El triaje y "quitarlo de los demás buzones" quedan en pantalla. |
| B-4 (cinco audiencias en cadena) | **resuelto en lo esencial** | s06-03 dice solo Finanzas y Sistemas, con verbo. El s06-04 que las reemplaza queda abrupto: ver N-2. |
| B-5 (camarero) | **resuelto** | s07-03 «el inglés del instituto… negociar un contrato»; s07-02 con «por otro canal». |
| A-6, A-7 (escenario), A-8, B-7 (s05-02, s07-01), B-8 | aplicados | Comprobado en el texto. |
| A-7 (opción C de Q3), B-6, B-7 (resto), B-9 | no aplicados, por decisión declarada | Ninguno es error; sin cambios. |

## (b) Hallazgos nuevos

No hay afirmaciones técnicas falsas nuevas, ninguna pregunta ha perdido su respuesta única, ningún cue está huérfano y el recorte de la farola no ha dejado referencias colgando (ni en voz ni en pantalla: la tercera regla de s08 ya usa «el botón de avisar»). Lo que sigue son cuatro retoques de redacción y tres opcionales.

**N-1 · CORREGIR · s02-05 (voz) y rótulo `not-actor` del goal de s02 · «es un comportamiento» sin sujeto**
Al acortar A-6, la frase quedó «Lo que separa a los tres es la intención, no el daño. Y ojo, es un comportamiento, no un tipo de insider.» El «es» no tiene sujeto claro (¿la intención? ¿el tercero?) y está en singular tras hablar de tres. Es una frase rota por el recorte, aunque se entiende a medias. Sustituto, que además cierra la opción «Insider threat» de Q1:
- s02-05: «<firm> {intent}Lo que separa a los tres es la intención, no el daño. {not-actor}Y ojo, son comportamientos, no tipos de insider.»
- storyboard s02, rótulo `not-actor`: «son comportamientos, no tipos de insider».
(Dos palabras menos.)

**N-2 · CORREGIR · s06-04 · frase abrupta y poco clara de oído**
«{topics}Dirección, quien trabaja fuera y quien llega nuevo tienen lo suyo, en pantalla.» Empieza con un nombre propio sin conector tras s06-03 («…accesos que no han pedido ellos»), y se oye como un resto de lista, no como una frase. Sustituto (+3 palabras, <1 s):
- «<casual> {topics}Y lo mismo Dirección, quien trabaja fuera y quien llega nuevo. Cada uno tiene lo suyo, en pantalla.»
El estimado sube a ~328 s: sigue dentro de 330, pero con este margen no hay sitio para más palabras.

**N-3 · OPCIONAL · s07-01 · «Siguen cayendo» sin sujeto**
«Los resultados mejoran en todas las áreas, menos en Finanzas. Siguen cayendo en facturas falsas…» De oído, «siguen cayendo» puede entenderse como que los resultados caen. Es el escenario de Q3, que se tiene que entender solo con la voz. Sustituto (+1 palabra): «Los resultados mejoran en todas las áreas, menos en Finanzas. Allí siguen cayendo en facturas falsas que piden cambiar la cuenta bancaria.»

**N-4 · OPCIONAL · s04-01 · conector de redacción escrita introducido por el recorte**
«…campaña de phishing simulado: correos falsos que manda él mismo, con permiso por escrito.» El `:` es de texto escrito y el validador no lo avisa. Sustituto: «…campaña de phishing simulado, o sea, correos falsos que manda él mismo, con permiso por escrito.» (+2 palabras). Lo mismo, si se quiere limpiar, en s01-01 («Su idea:» → «Parte de una idea. La gente no es el eslabón más débil, sino la mayor red de avisos.»). Hay 5 `:` en 27 segmentos (s01-01, s04-01, s04-04, s06-02, s08-01), bajo el tercio.

**N-5 · OPCIONAL · s03-01 · glosa de «mejor» sin sujeto**
«Ojo con ese «mejor». No busca una que valga, sino la que más sirve en este caso.» Quién «busca» no está dicho. Sustituto, misma longitud: «Ojo con ese «mejor». Pide la que más sirve en este caso, no cualquiera que valga.»

**N-6 · OPCIONAL · storyboard · dos frases de pantalla que ya no cuadran con la voz**
- Goal de s03: «…«los dos sabían que no se podía» (la voz dice una versión)». Tras el recorte la voz de s03-03 ya no la dice (queda «O sea, igual que quien reenvía documentos a su correo personal»; el resto, en la cara y en la tarjeta). Cambiar el paréntesis por «(la voz no lo dice; lo dicen la pantalla y la tarjeta)».
- Goal de s08, cue `phrase`: la pantalla lleva «…en su riesgo, todo el año»; la voz acaba en «…en su riesgo» (decisión declarada en las notas). Poner «todo el año» también en la voz o quitarlo de la pantalla; la regla 3 ya lo dice.

**N-7 · OPCIONAL · s06-04 · tiempo para leer los ocho temas**
Los ocho temas salen en pantalla sin voz, con el cue al principio de un segmento de unos 5 s y `pauseAfterMs` 500; justo después entra el panel de la pregunta 3. Si el motor no los mantiene, subir `pauseAfterMs` a 1500 (cuesta ~1 s).

### Canon

Nada nuevo choca con `glass-harbor.md`. Búsquedas sin resultados para comedor, farola, camarero, instituto y awareness. «Extensión» solo como la extensión de fichero de V33 (`:1714`); «botón» y «pizarra» solo en V5 (tablero de fases) y un botón sin relación; «nóminas» solo el pendrive «Nóminas 2027» de V36 (`:264`), que no tiene que ver con la cuenta de Compras de s02 ni con el señuelo cruel de s04 (pantalla). La web falsa de V34 (`:256`) es un ataque; la «aplicación del comedor» de V44 es un señuelo de campaña propuesta, sin remitente ni dirección. La farola desaparece: V45 y V48 pueden usarla (ya lo anota `script-notes.md`). La distractora «Formación de concienciación una vez al año» de V34 y el mensaje de V44 (formar cada grupo en su riesgo, todo el año) no se contradicen.

## (c) Veredicto

**Congelar tras corregir N-1 y N-2** (dos líneas de voz; N-1 toca también un rótulo del storyboard). N-3 a N-7 son opcionales.

Recuento: **0 bloqueantes · 2 CORREGIR (N-1, N-2) · 5 OPCIONAL (N-3 a N-7)**. Hallazgos previos: 10 de 10 CORREGIR resueltos (B-4 con la salvedad de N-2).

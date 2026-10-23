# Notas del guion · V39 `auditoria-halden` (sp5m7, `caso-principal-yt`)

Borrador sin congelar (`video.json` no lleva `frozen`). Fuente: `docs/superpowers/plans/fichas-tanda8/V39-sp5m7.md` (con las
correcciones de `_revision.md`: A-1, A-8, B-3, C-1 a C-3, C-6, C-7, D-1, D-5, D-7, G-2).

## Cifras

- 13 escenas, 5 capítulos, suma de `targetSec` 480 s. 59 segmentos, 1.227 palabras (todo lo que se lee, preguntas incluidas).
- `build-timeline --estimate` (2,5 palabras/s): **559,9 s (9:20)**, justo bajo el umbral de 560 s de la ficha. Con la razón medida
  en la lectura real de Lidia (~0,87–0,89 del estimado) y el hueco del acta con voz (+5–6 s), el vídeo debería quedar en
  **~490–505 s (8:10–8:25)**: dentro de 420–600 s y en el ~8:20 de la ficha. Margen unos 90 s hacia arriba y 70 hacia abajo.
- Título (`title`) a los 9,0 s del estimado (~8 s en la lectura real); promesa a los 15,3 s.
- 5 preguntas (4–5), 8 tarjetas de examen (5–8), 1 mensaje interceptado (0–2), 0 think prompts. Ninguna tarjeta en s01, s04, s09,
  s11 ni s13; las de pregunta entran después del fotograma de la trampa (s06 249,5 s frente a 243,2; s08 346,2 frente a 337,3; s10
  436,9 frente a 430,6; s12 509,5 frente a 505,5).
- Palabras por escena (voz / `wordBudget`): s01 51/54 · s02 94/97 · s03 138/108 · s04 82/81 · s05 112/119 (el acta resta unas 103 de
  voz neta: 9 palabras por encima) · s06 98/86 · s07 129/124 · s08 86/86 · s09 118/108 · s10 81/81 · s11 80/97 · s12 83/76 · s13 77/70.
- Avisos que quedan (5, todos «10–26 palabras por segmento» en el segmento que lee la pregunta: 47, 62, 44, 44 y 48 palabras). Es
  inherente al formato (el escenario y la pregunta se leen de seguido, y s06 además lleva la glosa de «mejor»); los ejemplos
  publicados, V34 y V33, dan el mismo aviso. Ningún aviso de narración hablada (dos puntos, `;`, identificadores, «¿Y …?»).
- `canon-check`: 0 coincidencias, 0 nuevas (`out/canon-refs.md`). No hay equipos, cuentas, IP, dominios, fechas ni horas.

## Dónde me aparto de la ficha, y por qué

1. **s01.** La ficha quiere en la primera frase el puerto, la firma ante la autoridad marítima, la revisión anual y la pregunta del
   consejo. Eso son ~30 palabras y deja el título pasada la marca de 12 s. Lo reparto: frase 1 = la dirección va a firmar ante la
   autoridad marítima (cue `three` a media frase); frase 2 (arranca el título) = «antes de la revisión anual, el consejo quiere saber si
   cumplen y si aguantan». Mismo contenido, título a los 9 s.
2. **Título de s08:** «Un ejercicio en el banco» en vez de «Un ejercicio sin avisar». Tras el arreglo A-1 el escenario ya no dice «sin
   avisar» (es justo un rasgo del red team, la trampa), y el título que se ve toda la escena tentaba hacia ella. Sigue sin dar la respuesta.
3. **`youtubeTitle`:** «Auditorías, attestation y penetration testing» (45). El motor rechaza `|` en ese campo y añade solo
   « | Security+ SY0-701 en español» (`paths.mjs`, `youtube-meta.mjs:36`), así que el sufijo «| CompTIA Security+ en español» de la
   ficha no se puede poner tal cual (77 caracteres con el sufijo del motor).
4. **`music` ausente** (la ficha: se elige al montar; otra que `Go On Going - Stayloose.mp3`).
5. **Pregunta 2 (s06).** Con la glosa de «mejor» (15 palabras, la de V28) y las 47 de lectura, la resolución cabe en ~36 palabras
   frente a las 40 de la ficha, y la escena sale en 98 palabras frente a 86. Lo acepto porque el total está bajo 560 s; si hubiera que
   recortar, la glosa no se toca (la ficha la fija).
6. **Cues.** `intercept-reply` en lugar de `intercept`/`answer` (como V34), `adversary` añadido (la etiqueta «PAPER GOVERNOR · sección
   5»), `best` solo en s06, y un cue de vuelta de imagen en cada resolución: `lift-back`, `bridge-back`, `blue-back`, `escape-back`,
   `log-back`. Quito `options` y `pause` (los pone el componente de pregunta).
7. **Lecturas de las preguntas.** Cada una lleva una entradilla corta («Te toca», «La última») y pequeños retoques orales sobre el texto
   de la ficha: 45, 47, 44, 44 y 46 palabras (la ficha: 45, 46, 42, 43 y 46). Dos añaden precisión, no contenido: «centro de operaciones
   de seguridad» (s08) y «código fuente» (s10, que también evita el «código» de la imagen de V21).
8. **Léxico.** Solo `PAPER`, `GOVERNOR` y `SOC` (el motor no avisa de ningún término inglés más). Los términos que Lidia dice en inglés
   (attestation, acknowledgement, self-assessment, internal audit, audit committee, independent third-party audit, regulatory
   examination, penetration test, rules of engagement, physical, offensive, defensive, integrated, red/blue/purple team, known /
   partially known / unknown environment, passive / active reconnaissance) quedan para la primera toma y para `verify-voice`.
   `lexicon.chatterbox.json` es una copia idéntica (los ejemplos llevan los dos y `narration.json` apunta a ese).
9. **Port scanning** (solo en pantalla) se deja caer en la voz de s12 como «nadie ha escaneado nada», sin decir el término.
10. **Corte pendiente de decisión** (no aplicado): si Lidia o el revisor de naturalidad quieren un vídeo más corto, el orden de la ficha
    sigue valiendo: la frase del audit committee de s03 (`s03-03`, 8 palabras), la frase del physical de s07 (`s07-02`) y la segunda
    vuelta del registro vacío de s11. s03 (138 palabras, +19 s sobre su objetivo) es la escena más cargada; el recorte natural es ahí.

## Qué se dice y qué no

- **Voz:** el puerto y su problema (firma ante la autoridad marítima, consejo, «revisión anual»), los seis conceptos con su imagen
  (dos montones de firmas; el ascensor de la comunidad solo como contraste de peso, la hoja frente a Industria; el puente; la sala de
  escape; el registro del SOC vacío y con líneas) y las cinco preguntas. Cada concepto se dice dos veces con palabras distintas
  (s02 y s13; s03 y s04; s05 y s06; s09 y s10; s11 y s12).
- **Solo en pantalla:** «management attestation» (chip de s02), white / grey / black box, WHOIS, banner grabbing, port scanning,
  «SY0-701 · 5.5», las cuatro opciones de cada pregunta, las cinco casillas de las rules of engagement.
- **El ascensor** se limita a la hoja de los vecinos y a Industria con su expediente; el administrador y el organismo que contratan
  los vecinos van en la imagen. No se dicen escalera, portal, portero, casero, llave, código (de acceso), alquiler, hotel, caja fuerte,
  escalón, peldaño ni chaleco. «Código fuente» sí aparece, como material que se entrega al equipo de pruebas.
- **Todo es plan:** «va a firmar», «dirá», «lo firmará», «consultaría», «podría escanear». Nada se ejecuta, no hay hallazgos, ningún
  red team entra en nada y no se compara con el caso de septiembre. La auditoría independiente solo está «encargada».
- **Mensaje de PAPER GOVERNOR (s05):** «Se acuerda: si pasamos la auditoría, no entra nadie. Queda en acta.» (67 caracteres,
  `holdMs` 3500, quinta acta en pantalla; voz Laura `megafonia` `rate` −1 como V25/V26). La presenta «Y vuelve PAPER GOVERNOR, que vive
  en los huecos de tu gobernanza» (frase exacta de V26) y la narradora contesta con la idea, sin reproche. Sin contratistas, proveedores
  ni dosier.
- **Se queda fuera:** right-to-audit clause (V42), la naviera que pide la atestación, el camino wifi-terminal, la sala de control, el
  estibador y el chaleco, las técnicas concretas (tailgating, clonado de tarjetas, transferencia de zona), el párrafo de la
  concienciación (V44) y los colores como reflejo suelto.

## Dudas de exactitud para el revisor

1. **Pregunta 3 (defensive frente a offensive).** Tras A-1, el escenario no tiene «sin avisar» ni equipo atacante; la trampa se
   sostiene en que no hay objetivo que perseguir. Un lector estricto puede objetar que «técnicas de ataque reproducidas» es también
   un assumed breach; en la lección el blue team es lo que se mide al SOC (`sp/sp5-part4.ts:109`, tabla `:125-129`).
2. **Pregunta 5.** El buscador de aparatos expuestos como fuente pasiva lo dice la lección (`:155`); algún material lo llama OSINT.
   Passive sigue siendo la única de las cuatro que encaja. «Port scanning» es una técnica, no un tipo de actividad: sobra como opción
   para quien lea con rigor, y cumple su papel de segunda trampa.
3. **s02 (attestation).** «Dirá que los controles del programa han funcionado durante los últimos doce meses» es la forma de la
   management attestation de la lección (`:27`), en futuro porque la dirección aún no firma. El PDF de SY0-701 dice solo «Attestation».
4. **s03.** «El audit committee no audita, protege a quien audita» y «la regulatory examination la hace la autoridad marítima»
   siguen la lección (`:47`, tabla `:77-82`). La imagen de Industria depende del contexto español (D-7): el organismo de control lo
   contrata la comunidad, y Industria abre expediente y multa.
5. **s11.** La voz condiciona el reconocimiento («consultaría», «podría escanear») porque es el plan; en pantalla va «ventana
   pactada · se reconoce». Que el registro del SOC esté vacío es consecuencia de no tocar, no un resultado del puerto.

## Revisión 2026-10-23

Informe: `docs/reviews/2026-10-23-guiones-tanda8/auditoria-halden.md` (0 BLOQUEANTE, 7 CORREGIR, 7 OPCIONAL). Las cifras de arriba son las del borrador;
las de después de la revisión: **58 segmentos, 1.225 palabras, 558,8 s estimados (9:18)** con `build-timeline --check --estimate`, bajo el umbral de 560 s
(margen de 1,2 s: con la razón real de Lidia, ~0,89, unos 500 s). `canon-check`: 0 / 0 / 0, `canon-refs.md` vacío. Avisos: solo los cinco esperados
(«10–26 palabras» en `s04-01`, `s06-01`, `s08-01`, `s10-01`, `s12-01`).

**Aplicados (texto del informe, ajustado donde se dice):**
- A-1: voz y `scenario` de la pregunta 3 (quita «una a una», añade «sin objetivo» y «sin trabajar con su SOC»). `q`, opciones, `why` y `trapWhy` intactos.
- A-2: `s12-02` y `s12-03` («el equipo no ha escaneado nada» / «no ha llamado a la puerta»).
- A-3: `s07-03`, `s11` en condicional («seguiría vacío», «tendría líneas», «podría escanear»). Cubre también A-7 (el red team se define por el objetivo; «sin avisar» solo en `s07-06`).
- A-4: opciones de la pregunta 2 (todas informes: «Independent third-party audit report», «Internal audit report» en D). `answer` 1 y `trap` 2 sin cambios.
- A-5 (parcial): `trapWhy` de la pregunta 2 («Que nadie entrara no dice que cumpla cada control del estándar»), `s06-02` («no dice que cumplas cada control») y tarjeta de `s05-07` («Auditoría: ¿cumples? Pentest: ¿aguantas?»).
- A-6: `s02-04` y `s02-05` (la dirección responde de que es cierto; «ninguna de las dos prueba que funcione»).
- A-8 (parte plausible): pregunta 4 con una plataforma de cursos y una cuenta de alumno (voz `s10-01`/`s10-02`, `scenario`, título de escena «Una cuenta de alumno», `goal` del fondo), y `s09-03` «lo que tendría un cliente» (también en el `goal`, texto en pantalla).
- B-1: `s03-06` y `s04-03` (el `goal` de s04 lleva ahora «Industria abriendo un expediente»).
- B-2: `s07-01` (sin lista de cinco) y `s11-01` («registros públicos» sale de la voz; queda en pantalla).
- B-3: `s03-07`, `s13-02` («lo que pesa es quién mira / comprueba») y `s13-03` («cuánto sabe quien prueba»); `goal` de s03 y s13 al día.
- B-4: fusión de `s03-02` y `s03-03` (se borra `s03-03`, hueco de id; el validador lo admite).
- B-5 (solo `s03-01`: «Eso se llama self-assessment»; cero palabras). B-6: `s05-05` partido en dos frases.

**No aplicados:**
- A-5 en `s13-04` («un pentest, si aguantas»): la ficha fija la frase de cierre y el informe la deja; se queda «que aguantas». Duda residual: lo repite la voz y el `goal`.
- A-8, opción D «Black box» de la pregunta 4: es sinónimo de unknown, solo se sustituiría una opción floja por otra; se queda *Integrated (purple team)*.
- B-5 restante (`s09-02`, `s09-03` «Ese sobre es…»), B-6 `s01-02`, `s05-06`, `s09-06`: cuestan palabras (+2 a +4 cada una) y el presupuesto de 560 s no las admite.

**Recortes por pasar de 560 s** (tras las correcciones el estimado era 570 s; orden de la ficha y del informe):
1. `s07-02`: la frase del physical se queda en el rótulo: «Hay cuatro modos. El primero es el physical.» (en B-6 se había propuesto otra frase, que ya no hace falta).
2. `s11`: el registro vacío se dice en una sola frase corta («Y el registro del SOC seguiría vacío»), sin la causa, que ya la da la regla de `s11-04`. Se pliega en el segmento de passive para no dejar un segmento de 7 palabras. `s11-01` se parte en dos (`s11-01` y `s11-02`) para no pasar de 26 palabras (el informe lo dejaba en 32); las ids de s11 quedan 01–04 (la antigua `s11-02` se plegó en la nueva `s11-02`, la antigua `s11-03` es ahora `s11-03` y la `s11-04` se queda).
3. `s02-02` sin «Una persona, una norma» (queda en pantalla y en `s13-01`); `s02-03` sin «con fecha, alcance y periodo» (el alcance y el periodo siguen en la frase siguiente; la fecha, en pantalla); `s10-02` sin «y nada más».
- Choque entre hallazgos: B-2 pedía conservar «buscadores de aparatos expuestos» en la voz (lo necesita la pregunta 5) y A-3 pedía el condicional; se aplican las dos. No hubo otro choque.

**Dudas del autor (decisiones del informe):** 1) pregunta 3 se conserva con el escenario reforzado (A-1). 2) pregunta 5 se conserva, «Port scanning» como segunda trampa (A-2). 3) management attestation se conserva (A-6). 4) audit committee y regulatory examination siguen la lección (A-9). 5) el condicional es lo correcto (A-3).

**Pendiente, sin hacer (fuera de este encargo):** ningún cambio de lección ni de flashcards. Canon nuevo por apuntar al cerrar (A-9): la firma de la management attestation ante la autoridad marítima antes de la revisión anual; la independent third-party audit «ya encargada»; el audit committee; el plan de pentest (rules of engagement, primero purple y después red team sin avisar, objetivo «un fichero marcado en un servidor de pruebas», «aplicación nueva known / lo que se ve desde fuera unknown», dos semanas de reconocimiento); las tres imágenes (ascensor, puente, sala de escape); la quinta acta de PAPER GOVERNOR; los cinco escenarios.

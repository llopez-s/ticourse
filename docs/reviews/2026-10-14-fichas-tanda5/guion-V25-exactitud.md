# V25 · «Riesgo en euros: de un evento al año» (sp5m3) — revisión de exactitud del guion

Revisión de solo lectura, 2026-10-14. Fuentes revisadas: `video/ale-halden/narration.json`, `storyboard.json`, `video.json`,
`src/timeline.json` (estimado, 233,4 s) y `public/videos/ale-halden-transcript.txt`; contra la lección
`src/data/secplus/sp5-part2.ts:8-200`, el laboratorio `labs-sp5.ts` (spl5c), la ficha
(`docs/superpowers/plans/2026-09-25-lesson-videos.md` desde `### V25` y `ficha-V25.md`, que son el mismo texto salvo una línea en blanco final), el registro
`docs/superpowers/canon/glass-harbor.md` y `out/canon-refs.md`. Lo no contrastado con fuente oficial va marcado «(de memoria)».

## Qué se comprobó y sale limpio

- **Aritmética** (recalculada con Node): 400.000 × 0,25 = 100.000; 100.000 × 0,5 = 50.000; 50.000 − 20.000 = 30.000;
  100.000 × 0,2 = 20.000; 400.000 × 0,10 × 0,5 = 20.000; 36.000 ÷ 3 = 12.000; 36.000 × 3 = 108.000; 90.000 > 50.000 y
  90.000 < 100.000 (por eso el atajo del mensaje de s04 «hace pasar» al control de 90.000); 10 × 0,5 = 5 golpes esperados;
  ARO 0,2 = una vez cada cinco años. Todas coinciden con la lección (`sp5-part2.ts:107`, `:116-141`) y con el laboratorio.
- **Validador del motor** (`analyzeNarration` con el perfil `capsula-yt`, ejecutado desde el repo sin tocar nada): 0 errores,
  0 avisos. Tarjetas 43/47/51/48 caracteres (máx. 58), pregunta 44 (máx. 48), mensajes 63 y 68 (máx. 70), `holdSec` 5,
  `think.holdMs` 4500 (≥ 4000), `intercept.holdMs` 3800 (2500–4500), 4 tarjetas (3–5), 2 mensajes uno por capítulo, 1
  pregunta, 3 capítulos, ninguna tarjeta ni mensaje en s06, emociones sin repetir en segmentos contiguos, frases ≤ 22
  palabras, ningún identificador deletreado. Palabras por escena por debajo de `wordBudget` (46/54, 93/108, 116/124,
  111/124, 87/97, 51/59). Estimado 233 s dentro de 190–260 (con la lectura de Lidia a ~88–93 % del estimado, unos 205–215 s).
- **Cues**: los 37 `requiredCues` aparecen una vez y en orden. `sfx`: `sle` (fr. 1471, s02-04), `ale` (2497, s03-03), `fits`
  (4009, s04-03) y `over` (4675, s04-06) existen y cada uno está en su escena.
- **Palabras que la ficha prohíbe**: ninguna en voz, mensajes, tarjetas ni pregunta (búsqueda automática de hoy, ese/aquel día,
  muelle, gestionado, mapa de calor, mitig-, transfer-, acept-, seguro, dueño, registro, «un cálculo no es una decisión»,
  R-014, fechas, VPN/MFA, septiembre, Halden, puerto). «ransomware» solo en condicional («cifrara»). «otra vez» aparece en
  s05-04 y se refiere a los 20.000, no a PAPER GOVERNOR: permitido. PAPER GOVERNOR se presenta desde cero (s02-02), sin
  «vuelve». No sale el dosier, GLASS HARBOR ni la vulnerabilidad de la VPN. «copias y EDR» sin «gestionado» ni «inmutable».
- **Canon**: ninguna contradicción. R-014 y el servidor de planificación de grúas del muelle norte son los de la lección y del
  registro (`glass-harbor.md:135`, `:929`); la voz no dice «muelle», ni fecha, ni R-014; V25 no pisa nada de V1/V5/V18/V21
  (`:800` lo deja a propósito sin tocar). `out/canon-refs.md` sale con 0 y 0 entradas, y es lo esperado: `canon-refs.mjs` solo busca
  identificadores (hosts, IP, correos, cuentas, casos) y horas `HH:MM` (`CANON_PATTERNS`, `:11-22`) en el texto mostrado de `narration.json` (según su cabecera,
  también en `src/data` y escenas, que aún no existen), y V25 no dice ninguno (R-014 y las cifras no son «tokens»). Es decir, la herramienta no cotejó
  nada; el cotejo es el manual de arriba. R-014, las cifras y el «muelle norte» solo existen en el storyboard y en la lección.
- **Objetivo 5.2** (de memoria): SLE, ALE, ARO, exposure factor, impact, probability y likelihood están bajo «risk analysis»
  de 5.2; «asset value» no figura con ese nombre en la lista oficial (de memoria) pero la lección lo usa (`:107`) y es la
  forma habitual de decir AV. La tarjeta «El control sale a cuenta si cuesta menos que la ALE» es la regla de la lección (`:107`)
  y de la nota (`:162`, «Tres»).

## Hallazgos

### Bloquea (arreglar antes de congelar la hoja de grabación)

**B1 · `s04-03` (`narration.json:134-139`) — la analogía de la funda falsea la comparación anual y no dice lo que la ficha manda.**
Voz: «En los números, sale a cuenta, como una funda de veinte euros contra cincuenta de golpes.» Una funda se compra una vez y los
«cincuenta de golpes» no llevan unidad de tiempo: el oyente compara 20 € de un gasto único con 50 € de golpes sin año, justo
cuando s04-02 acaba de decir «los dos son anuales». Es correcta como comparación anual **solo** si la funda se amortiza en un
año, y eso es lo que la ficha (H19, «El móvil»; fila 3 de conceptos; fila s04) manda decir **una vez**: «se amortiza en un año».
Ese texto no está en ningún segmento (búsqueda de «amortiz»: 0). Con la escala 1 a 1.000 (móvil 400, pantalla 100, golpes 50 al
año, funda 20) la analogía es buena; falta la unidad.
Reemplazo con la frase que manda la ficha: «En los números, sale a cuenta, como una funda de veinte euros que se amortiza en
un año, contra cincuenta de golpes.» (22 palabras: en el límite del validador; si avisa, quitar «En los números,», que ya
va en pantalla). Alternativa más corta: «Sale a cuenta: como una funda de veinte euros que en un año te ahorra cincuenta de
golpes.» La funda de 90 € va solo en pantalla, sin «al año» repetido, como dice la ficha.

### Corregir

**C1 · `s05-04` (`:192-203`) — la segunda palanca no dice que el ARO vuelve a 0,5.**
Voz: «Lo mismo con el EF: es un porcentaje del valor, mientras que el ARO son veces al año. Al diez por ciento, otra vez veinte
mil.» Tras s05-02 el último ARO dicho es 0,2; con ARO 0,2 y EF 0,10 la ALE sería 8.000 (400.000 × 0,10 × 0,2), no 20.000. Quien
sigue la cuenta de oído llega a otra cifra. Además `{ef}` está al principio de una frase de ~7 s: la palanca se mueve ~5 s antes
de que la voz diga «diez por ciento». Y «Lo mismo con el EF:» queda colgando antes de una definición.
Reemplazo: «{ef}Ahora, con el ARO de vuelta en [0,5|cero coma cinco], baja el EF al diez por ciento: otra vez veinte mil. Es un
porcentaje del valor; el ARO, veces al año.» Conviene que `at: "ef"` siga en la primera frase (la tarjeta sale justo después
de «veinte mil» y la segunda frase la repite mientras está en pantalla). Si prefieren una frase: «{ef}Con el ARO en [0,5|cero coma cinco], baja el EF, que es un porcentaje del valor, al diez por
ciento: veinte mil, igual.» Palabras: +3.

**C2 · `s04-04` (`:140-145`) — falta «reconstrucción» y el nombre del coste queda ambiguo.**
Voz: «Pero la alta disponibilidad cuesta noventa mil euros al año.» La línea de la lección es «Reconstrucción en alta
disponibilidad · 90.000 EUR / año» (`sp5-part2.ts:133`) y la ficha dice «la reconstrucción con alta disponibilidad»
(«Lo que se lee no se deletrea»). «La alta disponibilidad» a secas no cuesta 90.000: lo que cuesta es reconstruir en alta
disponibilidad, y el control comparado en s04-01 era un paquete concreto. Reemplazo: «Pero reconstruirlo en alta disponibilidad
cuesta noventa mil euros al año.» Además, `<sarcastic>` (registro «vivo», `moods.mjs`) hace que la lectura se ría de una
alternativa que la lección trata como contraejemplo serio: mejor `<focused>`.

**C3 · `s04-06` (`:156-161`) — el cue `over` va después del mensaje, y la ficha y el storyboard lo ponen antes.**
La ficha (fila s04: «`bars, control, net, fits, alt, over, intercept, annual`») y el storyboard (`storyboard.json:75`:
«una segunda barra… (`alt`) que se pasa de la línea (`over`)… Mensaje interceptado… Respuesta…») ponen la barra de 90.000
pasando la línea **antes** del mensaje. En el guion, `{alt}` está en s04-04 (fr. 4209) y `{over}` en s04-06 (fr. 4675), 15,5 s
después y tras el mensaje y su respuesta: durante ese rato la barra de 90.000 está dibujada en la misma escala y ya pasa la
línea de 50.000, así que el `block` suena sobre algo que ya se ve. Dos salidas (elegir una):
(a) **dejar el guion y corregir el storyboard/ficha**: la barra entra bajo la línea o con la línea tapada hasta `over`, y
el orden pasa a `alt, intercept, over, annual`; y entonces el mensaje «el control cuesta menos que un incidente» se pronuncia
con la barra de 90.000 visible y el sonido cae con «noventa mil pasa de cincuenta mil», que es lo más didáctico; o
(b) **mover `{over}` a s04-04**: «Pero reconstruirlo en alta disponibilidad cuesta {over}noventa mil euros al año, y se pasa de
la línea.» y quitarlo de s04-06 (queda «Se compara con la ALE, y noventa mil pasa de cincuenta mil», sin marca; hay que
retirarlo de `requiredCues` de s04 y de `sfx`, o dejarlo en s04-04). Recomiendo (a): el `block` cae sobre «noventa mil pasa de cincuenta mil», mejor que sobre una barra ya dibujada, y es lo
que ya está escrito para grabar. Es más una sincronización de la prosa de ficha y storyboard que un fallo del guion.

**C4 · `storyboard.json:75` (s04) — el móvil con las dos fundas no tiene cue ni sitio.**
El objetivo acaba con «El móvil con la funda de 20 € y la de 90 €» después de `annual`, pero la voz dice «funda de veinte
euros» en s04-03 (`fits`), antes de la barra de 90.000 y mucho antes de `annual`. Fijar en el storyboard: la funda de 20 € entra
con la frase de la funda (`fits`), la de 90 € con `alt` (muda), y ambas se atenúan en `annual`. Sin `phone` en s04 no hay cue
que lo ordene: que cuelguen de `fits` y `alt`.

### Nota (no bloquea; decidir al grabar)

**N1 · `s02-03` (`:48-57`) — «Valdría si lo perdieras entero» queda colgado y no dice «EF de uno».**
Detrás del mensaje («el valor del servidor es la pérdida»), «Valdría…» sin sujeto suena a error de lectura, y la ficha (nota
s02, «la corrección del mensaje es “eso sería un EF de uno: perderlo todo”») no está en voz. «un EF de uno» no se puede decir
antes de definir el EF; lo correcto es el sujeto. Reemplazo: «Eso solo valdría si lo perdieras entero, y un evento casi nunca
se lo lleva todo. {ef}Se pierde un porcentaje, el exposure factor, el EF. {bite}Aquí, [0,25|cero coma veinticinco], la cuarta
parte.» «Casi nunca se lo lleva todo» no contradice la lección: es la nota «Cuatro» (`:162`: «casi nunca el valor del activo,
salvo que el EF sea del 100 %»). «La cuarta parte» une la voz con «el 25 %» que sale en `bite`; hoy la voz no dice «por ciento»
ni «cuarta parte» y «cero coma veinticinco» solo no suena a porcentaje.

**N2 · `s02-04`, `s03-03`, `s04-02` — la marca cae al empezar la frase y el `ding`/la cifra salen 3–4 s antes de la voz.**
`{sle}` (fr. 1471) abre «Multiplicas el valor por el EF y te sale el SLE: cien mil euros» y la cifra se dice ~4 s después;
igual `{ale}` (2497) y `{net}` (3821). Es la convención de los otros vídeos (marca al inicio de la idea, p. ej. `{tie}` en
cvss-halden), así que no es un fallo si la ecuación se va construyendo. Si se quiere que el `ding` marque la cifra: «te sale
el SLE: {sle}[100.000 €|cien mil euros]» y «te da la ALE: {ale}[50.000 €|cincuenta mil euros] al año». La tarjeta
`at: "sle"`/`"ale"` seguiría saliendo al final de la misma frase.

**N3 · `s04-05` (`:146-155`) — la respuesta al mensaje corrige el error exacto, pero no pone la cifra del atajo.**
Mensaje: «el control cuesta menos que un incidente» (compara el coste anual con el SLE). Respuesta: «Menos que un incidente, sí,
pero un incidente es un golpe y el control se paga cada año. Se compara con la ALE, y noventa mil pasa de cincuenta mil.» Es
correcta: concede lo verdadero (90.000 < 100.000), separa golpe de año y vuelve a la ALE. Falta que la voz diga cuánto es un
incidente: depende de que el oyente recuerde los cien mil de s03-01. Reemplazo opcional: «Menos que los cien mil de un
incidente, sí, pero un incidente es un golpe y el control se paga cada año.» (+4 palabras, s04 queda en 115/124).

**N4 · `s05-02`/`s05-03` (`:180-191`) — «Empata» y «por debajo de eso».**
«Empata» no afirma «justificado» ni «no justificado»: cumple la ficha y la lección (`:107`: «menos que» / «más que»).
«Y por debajo de eso» es ambiguo (¿los veinte mil, o los cinco años?). Reemplazo: «Y con una ALE por debajo de veinte mil,
el control cuesta más de lo que evita.» (en términos de ARO sería «más raro que una vez cada cinco años»; la frase de ALE
evita mezclar las dos cosas).

**N5 · `s06-03` (`:222-227`) — la regla 3 no trae lo que la ficha le pide.**
La ficha («Cierre», regla 3) dice: «Se compara la ALE con lo que cuesta el control **al año**. Si no sale, hace falta otro
argumento, y la cuenta vale lo que valen sus estimaciones.» La voz solo dice la primera parte; s06 está en 51/59 palabras, caben
ocho. Reemplazo: «{rule-3}Y la ALE se compara con lo que cuesta el control al año. Si no sale, hace falta otra razón.» (+6).

**N6 · Título de la escena s02 («Un golpe no se lo lleva todo») destripa el mensaje.**
El mensaje de PAPER GOVERNOR («el valor del servidor es la pérdida») es el error; su corrección es literalmente el título, que
el espectador ya ha leído cuando entra el mensaje. Los otros títulos no revelan nada (s03 «Cuántas veces al año» no da 12.000;
s04 «Lo que cuesta el control» no da la ALE; s05 «¿Y si nos equivocamos?» tampoco). Reemplazo: «Cuánto cuesta un evento» (en
`storyboard.json:38` y en la ficha). No bloquea porque la ficha lo eligió así, pero es lo único de pantalla que adelanta una
respuesta.

**N7 · Pregunta para pensar (`s03-05`/`s03-06`).** No se contesta antes de tiempo: en pantalla solo están las cifras ajenas
(36.000 y 3), los botones y `ALE = SLE × ARO` (la fórmula que se pide invertir, ya enseñada en la tarjeta). La respuesta (`back`,
fr. 3322) sale después del `holdMs` de 4500 (3183 + 131). «Y al revés» da la pista de la dirección, no de la operación. Aviso:
en pantalla la ecuación `ALE = … = 50.000 €` de la escena sigue visible bajo la pregunta; conviene que el panel de la pregunta
la tape o la atenúe para que no se lea 100.000 × 0,5 como plantilla (el storyboard no lo dice).

**N8 · `s01` — el título cae a los 11,8 s del estimado (`timeline.json`, cue `title` fr. 353).**
La ficha lo quería hacia los 8 s («al acabar la primera frase»); en el guion, `ask` mete antes otra frase de 7 palabras, así
que `{title}` queda al principio de s01-02. Con la lectura real (~90 % del estimado) bajará a ~10,6 s, pero en estimado el
margen sobre el límite de 12 s es de 0,2 s. Si al medir con la grabación pasa de 12 s, aplicar el recorte que ya prevé la
ficha: quitar «y con una casilla roja no se decide cuánto gastar» de s01-01.

**N9 · Siglas (contradice la ficha; decide Lidia).** La voz nunca dice «single loss expectancy» ni «annualized loss expectancy», solo
«SLE» y «ALE». La ficha («Léxico nuevo») fija en inglés solo exposure factor, asset value y annualized rate of occurrence, así
que el guion cumple. Lo anoto porque el examen pide las dos expansiones y la voz no las da; si Lidia quiere reabrirlo, caben
donde ya está la fórmula («te sale el single loss expectancy, el SLE» / «te da la annualized loss expectancy, la ALE»: +8
palabras, s02 a 97/108 y s03 a 120/124). Sin cambio si no se reabre.

**N10 · Léxico.** `lexicon.chatterbox.json` cubre PAPER, GOVERNOR, SLE, ALE, ARO, EF y EDR; no cubre «Risk Math» (s06-04),
que la narradora lee en inglés; los otros vídeos dicen «Crypto Toolbox» y «Zone Defense» sin lexicón. Sin acción salvo
avisarle al grabar.

## Veredicto

**Aprobado con cambios.** El guion es exacto en todas las cifras y fórmulas, no dice nada de lo que la ficha prohíbe, no
contradice la lección ni el canon, pasa el validador del perfil sin avisos y sus cues y sonidos caen en su sitio. Hay **un**
fallo de contenido que arreglar antes de grabar (B1, la funda sin unidad de tiempo: el que más daña, porque deshace lo que
s04-02 acaba de decir) y cuatro correcciones de peso (C1: el ARO que no vuelve a 0,5; C2: «la alta disponibilidad»; C3: el
orden de `over`; C4: la funda sin cue en el storyboard). El resto son notas de naturalidad y margen.

# V41 · roles-halden · notas del guion (sp5m2, `caso-yt`)

Guion escrito el 2026-10-23 contra `docs/superpowers/plans/fichas-tanda8/V41-sp5m2.md`. No lleva `frozen`: lo pone quien lo revise.

## Cifras

`build-timeline --estimate`: **323,9 s (5:24)** de estimación, dentro de 240-330 s, pero cerca del techo. La estimación va por encima de la lectura de Lidia
(~0,89 en V28), así que el render real debería quedar hacia **4:45-4:55** (la ficha esperaba ~4:36). Si la grabación pasa de 325 s, se recorta en el orden de la ficha:
en s06 el club (quedan los tres rótulos), en s02 el álbum, en s04 la frase del sofá. Cualquiera de los tres ahorra 5-8 s.

| Escena | s | palabras / `wordBudget` | estimado |
|---|---|---|---|
| s01-hook | 20 | 45 / 54 | 20,9 |
| s02-casa | 40 | 107 / 108 | 45,8 |
| s03-p1 | 38 | 88 / 81 | 42,8 |
| s04-ley | 40 | 123 / 108 | 52,2 |
| s05-p2 | 40 | 92 / 86 | 44,4 |
| s06-arriba | 36 | 107 / 97 | 45,6 |
| s07-p3 | 36 | 75 / 76 | 37,6 |
| s08-cierre | 20 | 74 / 54 | 34,6 |
| **Total** | 270 | **711** / 664 (la ficha suma 729 sin restar la cuenta atrás) | 323,9 |

Total de palabras al nivel de los casos ya publicados (V45 nube-halden 727, V47 ot-halden 724). Las escenas que más se pasan son s04 (+15 palabras), s06 (+10) y s08 (+20, que arrastra la cola de la
tarjeta final, como en los vídeos publicados con 65-75 palabras).

5 tarjetas de examen (s02, s03, s04, s05, s07; ninguna en s01, s06 ni s08; las de pregunta, tras la trampa), 3 preguntas, 0 pensar, 0 interceptados, 3 capítulos, 32 segmentos.
`canon-check`: 0 identificadores, 0 con historia, 0 nuevos (no hay equipos, IP, dominios, cuentas, ficheros ni personas con nombre).

## Avisos que quedan (3, de diseño)

`s03-01` (44 palabras), `s05-01` (54) y `s07-01` (33) pasan de las 26 por segmento: son los segmentos de pregunta, que la voz lee de una vez (escenario + pregunta + en s05 la glosa de «mejor»);
los vídeos publicados con el mismo formato llevan el mismo aviso. Se partieron las frases de más de 22 palabras (queda ninguna).

## Desviaciones de la ficha

1. **El owner es «la persona responsable de la oficina de la terminal de pasajeros», no «la jefa de la terminal de pasajeros».** El registro de canon (`reg:194`, V32 `activos-halden`)
   ya fija ese puesto como owner de los datos de pasajeros («una persona, no un área», sin personas con nombre **ni género**). La ficha cita V35 (`reg:1133`) pero no V32. Se usa el cargo
   de V32, sin «ella» ni artículo femenino, y la voz dice «la persona responsable…». Así V41 no inventa un segundo jefe de la terminal. El revisor de canon debe mirarlo.
2. **Cues propios.** La ficha lista `options` y `pause` como cues; no se usan (el panel de pregunta los pinta solo, como en V28 y V45). Se añaden cues de resolución que la ficha describe sin nombre:
   `album-back` (s03), `planes` (s05, donde se ve el administrador cayendo en el plano de dentro y entra su tarjeta) y `club-back` (s07). Todas las tarjetas de pregunta cuelgan de un tercer segmento
   con `pauseAfterMs` 1000, como `postit-back` en V45.
3. **«por mensaje» fuera de la voz y de la pantalla de s04.** La ficha dice que la empresa «manda los avisos de embarque por mensaje» y también que V41 no dice «mensajes» (vecina del grupo de la familia de V34).
   La voz dice «manda a los pasajeros los avisos de embarque» y el storyboard no pide el canal.
4. **Título de YouTube.** `youtubeTitle` es «Data owner, custodian, steward, controller y processor»: el validador (`paths.mjs`) prohíbe `|` y el motor añade «| Security+ SY0-701 en español»
   (86 caracteres en total). La ficha proponía el sufijo «CompTIA Security+ en español». Título del bloque de la lección y de la tarjeta final: «Quién decide, quién aplica y quién responde» (43).
5. **Sin `music`.** La ficha pide otra pista que la de V28 y las demás de la tanda, a elegir al montar.
6. **Léxico vacío (`{}`)**, en `lexicon.json` y `lexicon.chatterbox.json` (como V28): no hay siglas, y las palabras inglesas (owner, custodian, steward, controller, processor, board, committee,
   government entity, centralized, decentralized) las fija la primera toma de Lidia. `build-timeline` no avisa de ninguna.
7. **Voz de la glosa de «MEJOR»** («Fíjate en ese "mejor". Pide la que encaja con este caso, aunque otra suene bien»): variante de la de V28 (rev8, G-4), que cabe en el presupuesto de s05.

## Decisiones de redacción

- **Idea, nombre, imagen.** Cada rol sale tras su situación («Eso es el data owner»); las tres imágenes cierran su escena (álbum, mudanza, club) y vuelven en una línea tras cada pregunta,
  salvo la mudanza (sin pregunta propia: la pregunta 2 se resuelve con «dentro de la casa», no con la mudanza).
- **Sin «proveedor», «contrato», «grupo», «mensajes», «familia», «dueño», «almacén», «plano de control» ni «data subject»** en la voz. «Asume el riesgo» (definición del owner) va solo en pantalla; la voz dice «riesgos» una vez, en lo que revisa el comité (s06).
- **Los conectores de cada capítulo** cierran con «O sea, que…» en s03 y s05; el capítulo III lo cierra la resolución de s07 con el club.
- **Pregunta 1 sin calificador** (el «MEJOR» de las preguntas 2 y 3 se escribe en mayúsculas en pantalla y en minúsculas en la voz). Letras: correctas D, B, A; trampas B, D, C.
- **Voz y pantalla con otras palabras** (el motor lo permite): la voz lee cada escenario con frases algo más sueltas que el texto de pantalla (en la pregunta 1, «Una cadena de clínicas tiene que decidir…» frente a «Unas clínicas deciden…»; en la 3, en dos frases).
- **Exactitud respecto a la lección.** Board: `sp5-part1.ts:269` (responsabilidad última, supervisa); committee: «el consejo sigue respondiendo» (`:269`); government entity: «nombra miembros, impone
  requisitos…» (`:269`), con «puede exigir un plan de protección aprobado» tal como lo dice la lección; owner (`:293`, `:345`); processor «por cuenta y siguiendo las instrucciones del controller» (`:293`);
  custodian «restaura, parchea y vigila» (`:293`); steward «calidad, definición y uso» (`:293`).

## Lo que se quedó fuera (sigue en la lección)

Los factores externos (regulatory, legal, industry, local, national, global; `:362-387`, q7); la pregunta centralized/decentralized (solo un chip y una frase); la data subject (V43); las terminales en
cuatro países y Rotterdam; la jefa de operaciones y los datos de atraques (`:302`, check `:326-340`); el trío «permisos, cifrado y copias» como regla (lo cubre la nota de la lección); «medios»
del controller («finalidad y medios») y «cuánto se guarda» (solo en pantalla); el nivel de clasificación del dato.

## Dudas de exactitud y canon para el revisor

1. **Processor como tercero** (pregunta 2): el 5.1 solo nombra los roles; la lección (`:293`, `:345`) usa ejemplos de fuera y «proveedor externo», sin decir «externo» en la definición. La voz dice
   «es otra organización» en la resolución (`s05-02`); si se corrige `:293` («otra organización que trata…»), cuadra.
2. **Government entity**: el 5.1 no la define; se apoya en `:269` y `fcp505`.
3. **Steward y clasificación** (pregunta 1): algunos materiales dan al steward la aplicación de la clasificación; la pregunta pide quién **decide**.
4. **V32 y V41 juntos.** V32 (`reg:251`) pone las «listas de embarque» en un disco de red sin copias ni parches («para Sistemas no existe»); V41 dice que Sistemas cifra y hace las copias de «la lista de
   pasajeros del ferry». Es otro dato (una lista del puerto frente a unas hojas de la oficina) y V41 no habla de discos, pero el revisor de canon debe confirmar que no se lee como la misma lista.
5. **Nuevo canon que fija V41** (a apuntar en el registro al cerrar): la lista de pasajeros del ferry; Atención al Pasajero (área que pide ver la lista); la oficina de planificación como steward;
   una empresa sin nombre que manda los avisos de embarque; el comité de seguridad de la información y el consejo, sin personas ni día; las tres imágenes ocupadas (álbum, mudanza, club). Todo «propuesta · sin fecha».

## Revisión 2026-10-23

Informe: `docs/reviews/2026-10-23-guiones-tanda8/roles-halden.md` (0 bloqueantes, 9 CORREGIR, 9 OPCIONALES). Tras aplicar: **712 palabras, 324,3 s estimados** (techo 330), 0 errores, 3 avisos de «N words» (s03-01 42, s05-01 57, s07-01 34: los segmentos de pregunta, esperados). `canon-check`: 0 identificadores. Sigue sin `frozen`.

**Aplicados (CORREGIR):** A-1 y B-3 (s05-01 voz y escenario en pantalla: «vigila los accesos a la base de afiliados», tres frases cortas); A-2 (`trapWhy` de s03-01 «no decide su clasificación»; tarjeta de s03-03 «Decidir la clasificación es del owner»); A-3 (s06-04: «centralized es igual en todas partes, pero más lento. Decentralized, rápido y local, pero desigual»); A-4 (s07-01 voz y escenario: la autoridad fija los requisitos «del plan de seguridad de la universidad»); B-1 (cue nuevo `steward-name` en s02-04, añadido a `requiredCues` de s02-casa, y la tarjeta de s02-04 apunta a él; s03-03 y s07-03 en una sola oración); B-2 (s02-05 «fotos»/«aparece»); B-4 (s04-02/s04-03); B-5 (s06-03).

**Aplicados (OPCIONALES, sin coste de palabras o plainly correctos):** A-2 opcional (s03-01 «se clasifican como confidenciales» en voz y pantalla; título de escena «Qué nivel de clasificación»); A-5 y B-7 (s01-02 «Quién decide. Es lo que el examen suele preguntar.»; `goal` de s01 al día); A-9 (s04 pantalla «cómo se trata» en vez de «cuánto se guarda»); B-6 (s02-02 «clasificó la lista y responde de ella»); B-9 (s06-01 «responde en última instancia»). Los `goal` de s02, s03 y s04 se actualizaron para que pantalla y voz cuadren («fotos», «aparece», `steward-name`).

**No aplicados:** A-6 (apuntes de canon: es trabajo del registro, no de este paso); A-6.6 («avisos de embarque» → «avisos del ferry»: duda, se deja a decisión de Lidia al grabar; el cue no cambia); A-7 (rótulo «· no es del puerto»: decisión de la ficha, coherente con V28-V32; se decide al congelar); A-8 («la tía» → «la prima»: no contradice V34, se acepta); B-8 (recap de la responsabilidad: +8 palabras, el cierre ya pasa del presupuesto; si hay margen en la grabación se añade).

**Cargo del owner:** se mantiene «la persona responsable de la oficina de la terminal de pasajeros» (el revisor confirma que la ficha se equivocaba con «la jefa de la terminal»).

**Dudas del autor (decisión del revisor):** 1 processor como tercero: se queda; 2 government entity: se queda; 3 steward: la pregunta se queda, el texto pasa de «no clasifica» a «no decide la clasificación»; 4 V32 y V41: no hay contradicción; 5 canon nuevo: correcto y completo (lista de apuntes en A-6 del informe).

**Pendiente fuera de este vídeo (no hecho):** (a) registro de canon al cerrar V41: fila nueva (lista de pasajeros del ferry, Atención al Pasajero, oficina de planificación como steward, empresa sin nombre processor, consejo y autoridad marítima nacional, imágenes álbum/mudanza/club en §6), ampliar la fila de V32 (`reg:194`) con el reuso del cargo, anotar el comité de seguridad de la información como distinto del de riesgos (V25) y del de cambios (V16/V17), y que la autoridad marítima es la misma que en V39; (b) corregir la cita de la ficha V41 (no existe «jefa de la terminal de pasajeros»); (c) lección `sp5-part1.ts:293`: opcional, «otra organización que trata…» en la definición del processor. Ningún cambio de lección es necesario para el vídeo.

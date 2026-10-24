# Segunda pasada · V48 `datos-halden` (sp3m6, `caso-yt`)

Revisor de solo lectura, 2026-10-23. Texto revisado: `video/datos-halden/narration.json` y `storyboard.json` tras la sección «Revisión 2026-10-23» de `out/script-notes.md`.
Contrastado con `src/data/secplus/sp3-part3.ts` (`:440-520`), `sp3-cards.ts` (`fcp325`, `:97`) y, por búsqueda de los términos nuevos, `docs/superpowers/canon/glass-harbor.md`.

Comprobaciones mecánicas sobre el texto actual: 8 escenas, todos los `requiredCues` están en la voz y no sobra ninguno (incluido `least` en s02); cada `exam.at` y cada `revealAt`/`trapAt` existen;
726 palabras habladas (las notas dicen 726); ninguna frase suelta de más de 22; ningún `:` ni `;` en la voz; ninguna emoción repetida en dos segmentos seguidos. Los avisos «10-26 palabras» son los esperados: tres preguntas (41 · 67 · 37), `s04-01` (36) y `s06-05` (32).

## (a) Hallazgos previos

| Id | Sev. previa | Estado | Comentario |
|---|---|---|---|
| A-1 | CORREGIR | **resuelto** | s02-06: «…cada jefa ve solo a su equipo. {least}Esto último es el least privilege.» El `goal` pone el rótulo solo en la tercera medida y `least` está en `requiredCues`. |
| A-2 | CORREGIR | **resuelto** | s06-05 en la versión corta que el propio informe daba como alternativa. «Región de la Unión Europea» y «fuera de ella» fijan el sentido geográfico; la pantalla dice «fuera de la UE». «Atarlo» queda con antecedente algo flojo, pero casa con s08-03 y se entiende por «Son las geographic restrictions». Es coherente con la lección (`:472`: la sede está en la Unión Europea). |
| A-3 | CORREGIR | **resuelto** | s04-03: la vault es la tabla; la tokenization es cambiar el DNI por un código. |
| A-4 | CORREGIR (PR) | **no resuelto, pendiente fuera del guion** | Comprobado hoy: `fcp325` (última frase) y el glosario `sp3-cards.ts:97` siguen juntando geolocation y geographic restrictions. Condición del PR antes de publicar el bloque en la lección. |
| A-5 | OPCIONAL | **parcial** | Aplicado el `why` («Solo la hace ilegible a simple vista…»); la voz de s05-02 sigue diciendo «solo cuesta leerla». Ver N-1. |
| A-6 | OPCIONAL | resuelto | Base64 se queda; la glosa «una codificación, sin clave» está en el `goal` de s05; la voz no lo dice. |
| A-7 | OPCIONAL | resuelto | s04-05: «Estorba, pero por sí sola no protege.» Ver N-3 para el texto de pantalla del cierre. |
| A-8a/b, A-9a/b | OPCIONAL | no aplicados, aceptable | Sin presupuesto. A-8a (cierre: «lo protege el least privilege») queda más corto que la pantalla; no es falso. |
| A-10 | OPCIONAL | pendiente de canon | `grep` de «DNI», «Unión Europea», «jefa de turno», «trastero», «hucha», «Base64», «tokeniz», «masking» en el registro: 0 resultados. Hay que anotarlos al cerrar el vídeo (no chocan). |
| B-1 | CORREGIR | **resuelto** | «Te toca.» / «Otra más.» / «La última.» |
| B-2 | CORREGIR | **resuelto** | s04-01 introduce el DNI de forma oída; s06-01 dice «el sistema de fichajes». |
| B-3 | OPCIONAL | no aplicado | Ver N-2: el texto del informe resta una palabra, no suma. |
| B-4, B-6, B-7, B-8, B-10 | OPCIONAL | no aplicados, aceptable | Suman palabras con 0,1 s de margen. |
| B-5 | CORREGIR | **resuelto** | «en vez de cifrarla» y «Se cifra de todas formas.» Contrasta bien con la obfuscation. |
| B-9 | OPCIONAL | resuelto | s07-03 y su `goal` coinciden. |

## Revisión de lo nuevo

- **Preguntas.** Cada una sigue teniendo una sola respuesta defendible. La voz y el panel coinciden en los tres escenarios. El «MEJOR» de s05 se glosa con otras palabras. Letras clave B·A·C y trampas C·D·B intactas.
- **Pantalla frente a voz.** Los `goal` de s02, s04, s06 y s07 describen lo que dice la voz corregida. El `token` de s04-02 rotula TOKENIZATION unos segundos antes de que la voz diga la palabra (en s04-03). Es la opción que el informe ya aceptó, y no choca.
- **Frases rotas por los recortes.** Ninguna. Los sujetos están: «lleva», «la tiene» (la vault), «ella» (la región), «cifrarla» (la exportación).
- **Registro.** Sin colones, sin listas largas leídas, sin conectores escritos. La sigla DNI se lee como letra con el léxico «de ene i»: es un uso normal y el informe previo lo aprobó. UE se dice «Unión Europea» y las demás siglas van solo en pantalla.
- **Canon.** Nada nuevo choca. «Unión Europea» no aparece en el registro, pero la lección (`:472`) pone la sede de Halden en ella. No hay país, ni «jefa de turno», ni «trastero» ocupados. Hay que anotar como canon nuevo, además de la ficha: DNI del personal, la región de la UE del supuesto y «nadie entra desde fuera».
- **Los dos avisos de longitud (s04-01 y s06-05).** Aceptar. s04-01 son tres frases de 7, 6 y 22 palabras. s06-05, de 14, 7 y 4, más el cierre de 7. No hay frase larga ni duda de naturalidad; V45 y V47 llevan avisos iguales. Partirlos sin coste daría uno de 13 + 22 y otro de 14 + 18, pero hay que renumerar ids y no aporta nada oído.
- **Duración.** 329,9 s del estimate frente a 330. La lectura real de Lidia (~0,87) queda en unos 287 s. No añadir palabras: los textos de N-1 y N-2 compensan.

## (b) Hallazgos nuevos

**N-1 · OPCIONAL · s05-02 y s03-02 · la voz de la resolución 2 contradice el escenario; paquete de coste cero.**
El escenario dice que cualquiera la devuelve a texto «en un segundo», y la voz resuelve «porque solo cuesta leerla». El `why` ya dice otra cosa («ilegible a simple vista»). Sustituto (+1 palabra), compensado en s03-02 (−1):

> `s05-02`: `<confident> {ok-2}Es obfuscation, porque solo la hace ilegible. {trap-2}Parece cifrada, pero sin clave no hay cifrado.`
> `s03-02`: `<firm> {ok-1}Es data at rest, porque están guardados, aunque el disco viaje. {trap-1}In transit tienta por el trayecto, pero es cruzar una red.`

(s03-02 además arregla el «aunque viaje» sin sujeto de B-6. Neto 0 palabras.)

**N-2 · OPCIONAL · s02-01 · la hucha entra de forma opaca (B-3 del informe, que no suma palabras).**
Texto del informe, 22 palabras frente a 23 (−1), que devuelve algo de margen:

> `<engaging> {three}Un fichaje pasa por tres sitios, {piggybank}como tu dinero. {rest}Guardado en la hucha, es data at rest, y se protege cifrando el almacenamiento.`

**N-3 · OPCIONAL · `storyboard.json` s08 `goal` · pantalla más tajante que la voz.**
El texto de la regla 2 dice «obfuscation estorba, pero no protege». La voz de s04-05 ya matiza. Sustituir en el `goal` por: «obfuscation estorba, pero por sí sola no protege».

## (c) Veredicto

**Listo para congelar.** 0 BLOQUEANTE, 0 CORREGIR, 3 OPCIONALES (N-1 a N-3), todos de coste neto cero o negativo.
Pendientes que no impiden congelar el guion: A-4 (`fcp325` y glosario `:97`, condición del PR de la lección), A-10 (anotar el canon nuevo), `music` en `video.json` y la pronunciación de «DNI» en la primera toma. Tras cualquier cambio, repasar `build-timeline --check --estimate`.

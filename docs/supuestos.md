# Supuestos prácticos: guía para escribirlos

Un supuesto es un caso con un **expediente** de documentos y entre 4 y 6 **fases** encadenadas. Cada fase
tiene tareas de varios tipos. Se hace en dos modos: **práctica** (sin reloj, corrección al entregar cada fase,
pistas a cambio de puntos) y **simulacro** (reloj, sin pistas ni corrección hasta el final). La nota es sobre 10
y se aprueba con 5. Lo que corrige la app y lo que se autoevalúa la persona se separan: la nota automática no
cuenta las tareas redactadas.

El primer caso es `op1s1` («La oficina comarcal nueva», pista Redes y ENS, canon en
`docs/superpowers/canon/arcedo.md`). Sirve de modelo. El diseño está en
`docs/superpowers/specs/2026-11-26-supuestos-practicos-design.md`. La parte técnica está en
`src/lib/supuesto*.ts` (tipos, validación estructural, corrección, flujo, reloj, informe) y
`src/components/supuestos/`.

## Dónde vive cada cosa

| Qué | Dónde |
|---|---|
| Datos del caso (un archivo por caso) | `src/data/opo/supuestos/opNsM.ts`, export por defecto `Supuesto` |
| Metadatos (título, resumen, minutos, versión) | `src/data/opo/supuestos/meta.ts`, escritos a mano |
| Carga bajo demanda | `LOADERS` en `src/data/supuestos/index.ts` (un `import()` por id) |
| Registro por pista | `TRACKS.opo.supuestos` en `src/data/tracks.ts` (sale de `meta.ts`) |
| Cuaderno de la persona | `localStorage`, clave `alertopolis-labs-v1:supuesto/<id>/<modo>/v<version>` |
| Notas y XP práctico | store: `supuestos[id][modo]` (mejor nota) y `practical['<id>:<modo>']` |

El cuaderno no entra en la instantánea que se sincroniza. Subir `version` empieza a todo el mundo de cero en
ese caso, así que solo hay que hacerlo cuando una respuesta antigua ya no tiene sentido.

## Tipos de tarea

Todas las tareas llevan `id`, `prompt`, `points`, `explain`, `refs`, `topic` (id de la lección, para el
resumen «por tema») y, si se quiere, `hint: { text, cost }` con `cost` entre 0 y los puntos de la tarea.
Los ids de fases, tareas y documentos comparten un único espacio de nombres y no se pueden repetir.

| `kind` | Qué contesta la persona | Forma de la respuesta correcta | Puntuación |
|---|---|---|---|
| `choice` | una opción | `answer: 'b'` (id de opción) | todo o nada |
| `multi` | varias opciones | `answer: ['a','b','c']` | aciertos menos fallos, nunca por debajo de 0 |
| `numeric` | un número (coma o punto) | `answer: 27`, `tolerance` y `unit` opcionales | todo o nada |
| `table` | un desplegable por celda | `rows[].answer`: `{ campoId: 'opción' }`; la respuesta guardada usa la clave `"rowId.fieldId"` | proporcional a las celdas correctas |
| `order` | ordenar con subir/bajar | `answer: ['o1','o2',…]`; **`items` se escriben barajados**, no en el orden correcto | proporcional a las posiciones correctas |
| `match` | emparejar | `answer: { izquierdaId: 'derechaId' }` | proporcional a los pares correctos |
| `cite` | marcar documentos del expediente | `answerSets: [['d-enca','d-acta'], ['d-tabla','d-acta']]` (cualquiera de los conjuntos vale) | todo o nada; marcar un documento que no está en ningún conjunto da 0 |
| `written` | texto libre | `model` (respuesta modelo) y `rubric` | la persona marca criterios en la autoevaluación; `rubric` debe sumar exactamente `points` |

Notas de redacción:

- Una opción falsa debe ser una que alguien con el error típico elegiría, y la `explain` debe cubrir tanto
  por qué la correcta lo es como por qué cae la tentadora.
- En `table`, cada valor de `answer` tiene que estar entre las `options` de su campo. La prueba estructural lo
  comprueba.
- En `cite`, los documentos citables son los visibles en esa fase. Un conjunto no puede exigir un documento que
  todavía no se ha desbloqueado.
- Un `cite` con un solo documento es débil; es mejor pedir dos o más que se apoyen entre sí.
- La respuesta modelo de `written` va comentada, y cada criterio de la rúbrica debe poder comprobarse leyendo
  la respuesta modelo.

## Arrastre y ramas

- **`carry`** (en una fase) es un resumen de lo decidido que se muestra al abrir la fase siguiente, para que
  quien se equivocó pueda seguir con la situación correcta. No debe dar respuestas de fases posteriores:
  ni direcciones, ni distancias, ni valores que luego se pidan.
- **`variants`**: cada variante tiene una condición sobre una tarea de una fase **anterior**
  (`{ task, is: 'correct' | 'wrong' }` o `{ task, chose: 'optionId' }`) y reemplaza el contexto de la fase. La
  primera que se cumple gana. Límites:
  - como máximo **una** variante por fase aplicada, la elegida por la primera condición que se cumple;
  - **deben converger**: cada rama tiene que llevar a la misma situación final, de modo que las tareas
    siguientes valgan igual para todas. Una variante solo cambia la frase de entrada y cómo se llegó hasta aquí;
  - `unlocks` (opcional) hace visibles documentos extra en esa rama. El documento conserva su propio
    `unlockedBy`: si además lo desbloquea una fase entregada, se verá igual en las demás ramas.
- **`unlockedBy`** en un documento lo muestra cuando se entrega esa fase. Los documentos sin `unlockedBy` se
  ven desde el principio y **no pueden contener respuestas de la fase 1**.

## Referencias a las lecciones

Cada tarea lleva en `refs` al menos un enlace `{ label, href: '/learn/<moduleId>' }` a la lección donde se
aprende lo que pide, más la norma o la RFC cuando exista. La prueba estructural comprueba que la lección
existe. Los `refs` de las tareas falladas son lo que aparece en «Para repasar», y `topic` agrupa la nota por
lección. Si una tarea se apoya en una RFC, la RFC va también en `sources` del caso.

## Reglas de exactitud

- Todo dato técnico sale de **fuentes primarias**: RFC, estándares IEEE/ITU, texto oficial de la norma. Nada de
  memoria ni de apuntes de terceros.
- Lo que es **valor de un fabricante** (distancias administrativas por defecto, comportamientos propios) se dice
  y se rotula como tal («valores por defecto de Cisco») en el contexto, en el inventario y en cada enunciado
  que lo use. No se presenta como parte del estándar.
- El caso respeta el **canon** de la pista (`docs/superpowers/canon/arcedo.md`): direccionamiento, sedes,
  equipos, fechas. Si el caso descubre una contradicción entre lecciones, no la resuelve por su cuenta: se
  anota en la sección de contradicciones del canon.
- Que ninguna respuesta se pueda deducir de un documento visible antes de su fase; un borrador con fallos
  (como la configuración del instalador de `op1s1`) es mejor que uno con las respuestas puestas.
- **Nunca** se escribe «como en el examen», «tipo examen» ni nada que sugiera parecido con una prueba real:
  el material es independiente y no oficial, y no se sabe qué saldrá.
- Redacción en español natural y sin anglicismos de oficina; los términos técnicos en inglés solo cuando son
  el nombre del protocolo o del comando.

## Lista de revisión

1. Escribir el caso y sus pruebas, y ejecutar `npm test` y `npm run build`.
2. **Revisor de exactitud** (alguien que no lo escribió): recalcula todo lo numérico, comprueba cada dato
   técnico con su fuente primaria, busca respuestas filtradas en documentos o en `carry`, y confirma que
   cada distractor es falso de verdad y que la correcta lo es sin depender de supuestos no escritos.
3. Aplicar lo que encuentre, comprobar que **no cambia ninguna respuesta de la clave** (o, si cambia, decirlo)
   y volver a pasar la revisión **solo sobre las correcciones**: una corrección es código nuevo y puede
   introducir un error nuevo.
4. Pasar la prueba de navegador (abajo) con el caso nuevo.
5. Revisión final de la rama completa por una persona que no haya intervenido.

## Cómo registrar un supuesto nuevo

1. Crear `src/data/opo/supuestos/opNsM.ts` con la forma `Supuesto` (`id`, `track`, `sectionIds`, `version: 1`,
   `title`, `brief`, `minutes`, `prerequisites`, `dossier`, `phases`, `sources`; `integrator: true` solo para
   el que mezcla todos los temas, que paga el doble de XP práctico).
2. Añadir su entrada en `src/data/opo/supuestos/meta.ts`, idéntica a `metaOf(caso)`: la prueba
   `supuestos.test.ts` compara las dos.
3. Añadir `opNsM: () => import('../opo/supuestos/opNsM')` en `LOADERS`, en
   `src/data/supuestos/index.ts`.
4. Tests: la prueba general (`supuestos.test.ts`) ya recorre todo caso registrado con `validateSupuesto`
   (ids únicos, respuestas dentro de sus opciones, lecciones existentes, variantes hacia fases anteriores,
   rúbricas que suman). En `src/data/opo/opo.test.ts` hay un bloque con la forma esperada de un caso (fases,
   tareas, puntos, `carry`, `cite` y `unlockedBy`); si el caso trae un cálculo (como el VLSM de `op1s1`),
   añade una prueba que lo recalcule en vez de fiarse de lo escrito.
5. Probar a mano o con la prueba de navegador, y registrar la nota en el informe de revisión.

## Prueba de navegador

`node scripts/test-lab-browser.mjs` (Playwright y Chrome disponibles; ver `docs/laboratories.md`) juega
`op1s1` entera. En práctica contesta todo bien con la clave del propio caso y marca todos los criterios de la
tarea redactada, y espera nota 10,0 y 60 de XP práctico. En simulacro arranca, contesta, recarga y comprueba
que la respuesta y el reloj siguen donde estaban; luego reescribe `startedAt` en el cuaderno
(`alertopolis-labs-v1:supuesto/op1s1/exam/v1`, dentro de `current.draft.run`), recarga y espera la pantalla de
autoevaluación. Para otro caso, cambia el id y las rutas del bloque «Supuesto práctico op1s1».

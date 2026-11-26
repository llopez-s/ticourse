# Supuestos prácticos: motor propio

> Diseño del 2026-11-26. Lidia eligió «supuestos con su propio motor» frente a un supuesto hecho con
> bloques de lección o a solo test, pidió ambición («no me importa el coste») y aprobó el boceto de
> expediente + fases + dos modos. Complementa `2026-11-26-pista-opo-temario-design.md`.

## Intención

La pista `opo` prepara una prueba **teórico-práctica**. Sabemos que existe esa parte práctica, pero no
su formato exacto (test sobre un caso o desarrollo escrito). Un supuesto debe entrenar las dos cosas:
leer un caso largo con documentos, decidir con datos exactos y justificar por escrito. Hoy la app solo
tiene preguntas sueltas, laboratorios de una mecánica y retos de evidencias, y ninguno de ellos encadena
decisiones sobre un mismo caso ni simula condiciones de examen.

## Objetivos

- Un motor genérico de supuestos (sirve para cualquier pista, aunque arranca con `opo`), con contenido
  como datos, igual que lecciones y labs.
- Un supuesto = **expediente** de documentos + **4–6 fases encadenadas** con tareas de varios tipos.
- Dos modos: **práctica** (corrección por fase, pistas, explicación con referencia) y **simulacro**
  (cronómetro, sin corrección hasta el final, nota sobre 10).
- Nota que separa lo que corrige la app de lo que se autoevalúa la persona.
- Informe final descargable e imprimible.
- Dos supuestos por bloque de la pista `opo` y un **supuesto integrador** que mezcla todos los temas.

## No objetivos

- Corregir texto libre automáticamente: no hay backend ni modelo en el navegador. La respuesta escrita
  se compara con una solución comentada y una rúbrica.
- Sustituir labs, jefes o simulacro tipo test: los supuestos son una actividad más.
- Vídeos de supuestos.

## Antiobjetivos

- Errores en cascada que hagan inútil el resto del supuesto: una fase mal resuelta no debe dejar sin
  sentido las siguientes (ver «Arrastre»).
- Normativa o cifras inventadas: cada tarea cita su fuente (artículo, anexo, RFC, guía CCN-STIC) y el
  contenido de ENS sale del texto primario.
- Perder el trabajo al recargar o cerrar la pestaña, sobre todo en un simulacro de 90 minutos.
- Nombrar la convocatoria real en el repositorio o en la web.

## Enfoques considerados

1. Solo test con preguntas de aplicación dentro de cada lección. Sin coste, pero nunca entrena un caso largo.
2. Una lección «Supuesto práctico» por bloque hecha con bloques existentes (caso, checks, respuesta
   modelo). Barata, pero sin simulacro, sin expediente consultable ni nota.
3. **Motor propio (elegido por Lidia).** Más trabajo, pero es el único que entrena condiciones de examen
   y encadenamiento real. Se apoya en lo que ya existe: `lib/labWorkspace.ts` (cuadernos versionados en
   `localStorage`), las piezas del reto práctico (`labChallenge.ts`: evidencias, rúbrica, campos de
   redacción) y `BlockRenderer` para el contenido de los documentos.

## Modelo de datos (`src/lib/supuesto.ts` + `src/data/<pista>/supuestos/*.ts`)

```ts
interface Supuesto {
  id: string;                 // global: 'op6s1', 'op6s2', integrador 'opsint'
  track: TrackId;
  sectionIds: string[];       // 1 para los de bloque; varios para el integrador
  version: number;            // entra en la identidad del cuaderno
  title: string; brief: string;
  minutes: number;            // límite del simulacro
  prerequisites: string[];    // moduleIds a repasar
  dossier: DossierDoc[];
  phases: Phase[];
  sources: { label: string; href?: string }[];
}
interface DossierDoc {
  id: string; title: string;
  kind: 'memo' | 'email' | 'table' | 'diagram' | 'config' | 'log' | 'norma' | 'acta';
  body?: Block[];             // reutiliza los bloques de lección
  diagram?: NetDiagram;       // nodos con coordenadas, enlaces y etiquetas → SVG
  unlockedBy?: string;        // id de fase: aparece al entregarla; sin valor = desde el inicio
}
interface Phase {
  id: string; title: string;
  context: string;            // markdown-lite
  variants?: { when: Condition; context: string; unlocks?: string[] }[]; // ramas por respuestas previas
  carry?: string;             // premisa correcta que se anuncia al empezar la fase siguiente
  tasks: Task[];
}
type Condition = { task: string; is: 'correct' | 'wrong' } | { task: string; chose: string };
```

Tareas (todas con `id`, `points`, `explain`, `refs` y `hint?` con coste en puntos):

| Tipo | Qué hace la persona | Corrección |
|---|---|---|
| `choice` | elige una opción | automática |
| `multi` | marca varias | automática, puntos parciales por aciertos menos fallos, mínimo 0 |
| `numeric` | escribe un número (con unidad y tolerancia opcional) | automática |
| `table` | rellena una tabla de desplegables (p. ej. nivel de cada dimensión C/I/D/A/T, o qué medida aplica) | automática por celda |
| `order` | ordena pasos | automática, parcial por posiciones correctas |
| `match` | empareja dos listas | automática por pareja |
| `cite` | elige qué documentos del expediente justifican algo | automática (conjuntos válidos, como `evidenceSets`) |
| `written` | redacta (límite orientativo de palabras) | autoevaluada: solución comentada + rúbrica de criterios con puntos |

**Arrastre.** Al entregar una fase, la siguiente arranca con su `carry` («La responsable de seguridad
revisa la categorización y la fija en MEDIA»), de modo que las fases posteriores se corrigen sobre la
premisa correcta. Es lo habitual en un tribunal (no se penaliza dos veces el mismo error).

**Ramas.** `variants` permite que el contexto o los documentos que se abren cambien según una respuesta
anterior. Se usan con moderación (como mucho una rama por supuesto) y siempre convergen: la corrección
no depende de la rama.

## Modos

- **Práctica.** Al entregar cada fase se muestran la corrección, la explicación y las referencias. Las
  pistas restan sus puntos. Se puede reintentar el supuesto; se guardan el primer y el último intento.
- **Simulacro.** Cronómetro con el `minutes` del supuesto. Sin pistas ni corrección hasta el final. Las
  fases se entregan en orden y no se puede volver atrás (el arrastre lo exige). Al agotarse el tiempo se
  entrega lo que haya. La hora de inicio se guarda, así que recargar no para el reloj.
- Al terminar, en los dos modos: autoevaluación de las tareas `written` con la rúbrica junto a la
  solución, y después la nota.

## Nota e informe

- Nota sobre 10 = (puntos automáticos + autoevaluados − pistas) / puntos máximos × 10. Se muestran
  también la nota «solo automática» y el desglose por fase y por tema (`sectionIds` o un `topic` por tarea
  en el integrador). Aprobado a partir de 5.
- Informe: página imprimible (CSS de impresión) y descarga en Markdown con respuestas, solución,
  nota y lecciones que conviene repasar (las `refs` que enlazan a `/learn/...` de las tareas falladas).

## Persistencia

- Trabajo en curso e historial: `labWorkspace` con identidad `supuesto/<id>/<modo>/v<version>`
  (prefijo `alertopolis-labs-v1:`, ya borrado por «Resetear progreso»). Cambiar `version` empieza un
  cuaderno nuevo sin romper los antiguos.
- Resultado que cuenta como progreso: ver «XP y progreso».

## XP y progreso

**Decidido por Lidia (2026-11-26): se crea ya el XP práctico**, una moneda separada del XP teórico
(la idea anotada el 2026-10-26 para los labs nuevos). Los supuestos son lo primero que la gana; más
adelante podrán darla los labs nuevos.

- Store (persist **v4**; `migrateProgress` añade los campos vacíos a datos v3):
  - `practical: Record<string, number>`: premios de XP práctico por clave (`<supuestoId>:<modo>`). El
    total que se muestra es la suma. *Decisión mía:* guardar premios y no un contador hace que
    `mergeProgress` siga siendo conmutativo e idempotente (unión de claves, máximo por clave), sin
    contar dos veces lo ganado en dos dispositivos.
  - `supuestos: Record<string, { practice?: Best; exam?: Best }>` con
    `Best = { grade: number; auto: number; at: string; version: number }`. Se fusiona por el máximo de
    `grade` en cada modo (monótono).
- Premio: la **primera vez que se aprueba** (nota ≥ 5) un supuesto en cada modo. *Decisión mía:*
  60 XP práctico en práctica y 120 en simulacro; el integrador, el doble. No da XP teórico ni cuenta
  para la racha de lecciones, pero sí como actividad del día.
- Panel y perfil muestran el XP práctico junto al teórico. *Decisión mía:* sin rangos propios por
  ahora; un logro nuevo, «Primer supuesto aprobado en simulacro».
- «Resetear progreso» borra también estos campos. La sincronización los lleva como el resto del perfil
  (tests nuevos en `sync.test.ts` para la fusión).

## Interfaz

- Ruta `/supuesto/:id` (página y datos cargados en diferido, como los retos). Dos columnas en escritorio
  (expediente | fase); en móvil, pestañas «Expediente» / «Fase» con aviso de documentos nuevos.
- Visor de documentos: lista con iconos por tipo y marca de «nuevo»; tablas, configuraciones y registros
  con `BlockRenderer`; esquemas de red con un componente SVG propio (`NetDiagram`) accesible (lista
  alternativa de nodos y enlaces).
- `SectionPage`: los supuestos del bloque, junto a los labs, con la mejor nota. Página `/supuestos` de la
  pista con todos, el integrador incluido (que se desbloquea cuando existan al menos tres bloques con
  supuestos). Una tarjeta en el panel de la pista `opo`.
  *Decisión mía:* el integrador aparece cuando su contenido se publica (fijo en el código), sin
  bloqueo por persona.
- *Decisión mía:* se guardan por separado la mejor nota de **simulacro** y la de **práctica**. Las
  tarjetas muestran primero la de simulacro, que es la comparable con un examen; la de práctica va al lado.
  Aprobar no desbloquea nada.
- Accesible con teclado y lector de pantalla, como los labs actuales.

## Calidad

- Test de integridad de los datos: ids únicos en toda la app; cada tarea con respuesta válida; `cite`
  y `unlockedBy` apuntan a documentos y fases existentes; `variants` solo miran tareas de fases
  anteriores; la suma de puntos de cada rúbrica cuadra con `points`; `refs` a `/learn/` existen.
- Tests unitarios de corrección de cada tipo de tarea, del arrastre, de la nota y del reloj del simulacro.
- `scripts/test-lab-browser.mjs` (Playwright) amplía su recorrido a un supuesto en los dos modos.
- Revisor de exactitud de solo lectura para el contenido, contra la fuente primaria.

## Entregas

1. **Motor + supuesto piloto de redes** (`op1s1`, sobre el bloque `op1`, que ya existe: plan de
   direccionamiento, VLAN y encaminamiento de una oficina nueva del Consorcio). PR propio. *Decisión mía:*
   el piloto va sobre `op1` porque sus lecciones ya existen (las `refs` y `prerequisites` se pueden
   comprobar) y sus datos son de estándares (RFC, IEEE), sin depender de leer normativa. Así el motor no
   espera al bloque de ENS.
2. Contenido de cada bloque con sus dos supuestos, en el PR de ese bloque; `op6` (ENS) es el siguiente,
   con `op6s1` y `op6s2` escritos desde el RD 311/2022. El segundo supuesto de `op1` (`op1s2`) va con él.
3. Integrador cuando haya tres bloques con supuestos.

## Para quien lo construya

- Decide la maquetación concreta, los nombres de componentes y la forma exacta de `NetDiagram`.
- Reutiliza `useLabState`/`LabWorkspaceProvider` en lugar de crear otro sistema de guardado.
- Lenguaje de la interfaz en español natural, como el resto de la pista.

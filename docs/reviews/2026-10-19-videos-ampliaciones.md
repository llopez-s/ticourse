# Revisión de los guiones AP01–AP07

Fecha: 19-10-2026. Alcance: siete guiones completos para las doce lecciones de las ampliaciones prácticas. [Índice de grabación y producción](../superpowers/plans/2026-10-19-videos-ampliaciones/README.md).

## Revisiones de lectura

Se realizaron dos revisiones en paralelo y de solo lectura, conforme al orden de producción de la serie: `revision_exactitud_guiones` y `revision_naturalidad_guiones`. Ambos revisores releen después las zonas corregidas y confirman que no quedan impedimentos de su ámbito para preparar esta versión de grabación. Esta revisión editorial no representa una aprobación de la usuaria de una grabación, un montaje o una publicación.

**Exactitud:** contraste con las lecciones ampliadas, el paquete YARA, las referencias oficiales de Microsoft/VirusTotal/YARA y los registros de las campañas. Sin hallazgos P0/P1. Se corrigieron:

- **P2, AP06 s04:** C ya se utiliza para construir la regla en AP05. El guion ahora presenta su repetición como prueba de regresión, y exige casos nuevos que no influyan en el diseño para evaluar generalización. El nombre `held-out` de un grupo público de archivos no garantiza esa independencia.
- **P3, AP07 s06:** las reventas aumentan anuncios recibidos, pero sus repeticiones no deben aumentar los registros únicos de la tabla. La narración conserva el criterio de deduplicación de la lección.

**Naturalidad:** lectura contra las reglas de narración hablada y la prueba del café. Se aplicaron definiciones previas a las decisiones, explicaciones de token, bearer, huella, importaciones, corpus e infostealer; presentación temprana de Ana en AP02; lenguaje más claro para conservación de registros, valor incremental, revisión de alertas y entrega. AP05 ya no narra la acotación «No tienes que leer los números en voz alta». AP07 reserva la elección entre Bruma y Cobalto hasta después de la segunda pausa. Se mantienen los siete cierres con tres reglas y una actividad.

## Continuidad y canon

Antes de escribir se consultaron los registros `glass-harbor.md` y `velvet-cicada.md`. Después de las correcciones se regeneraron y leyeron los siete `video/<slug>/out/canon-refs.md`.

| Vídeo | Coincidencias del comprobador | Interpretación de la lectura |
|---|---|---|
| tokens-correo | `Mail.Read`, señalado como nuevo | Nombre técnico de un permiso delegado en el ejercicio ampliado; no añade un hecho al incidente de Halden. |
| stealer-sesiones | Ninguna | Ejercicio de respuesta, sin cuentas, equipos o fechas nuevas del incidente. |
| feeds-requisito | Ninguna | Faro/Atlas/Eco y las cifras se contrastan manualmente con la lección. Son proveedores inventados. |
| muestra-candidatos | `ldr.pdb`, ya utilizado | Componente de una consulta ilustrativa; no identifica a A/B/C/D/E con las muestras históricas. |
| yara-condicion | `kernel32.dll`, ya utilizado | Cadena común en un control sintético, sin valor identificador de familia. |
| yara-prueba-entrega | `reference.yar`, señalado como nuevo | Archivo del laboratorio ampliado; no es un artefacto del incidente publicado. |
| stealers-metricas | Ninguna | Bruma/Cobalto/Duna, ventana y cifras se contrastan manualmente con el dataset ficticio. |

El comprobador reconoce determinados identificadores; no sustituye la revisión de tablas, nombres y relaciones. Los ejercicios mantienen Halden/Meridian como escenarios de formación, sin introducir hechos fechados en el canon publicado. Los mensajes del adversario representan errores de método y no confiesan incidentes ni atribuyen las familias ficticias.

## Validación técnica del material escrito

- Generador: `node scripts/prepare-practical-video-scripts.mjs --check`. Comprueba que las hojas y los cuatro JSON por episodio corresponden a las fuentes editoriales. El [reporte estructural](../superpowers/plans/2026-10-19-videos-ampliaciones/validacion-estructural.json) contiene cero errores y cero avisos.
- Por episodio: `canon-check.mjs --video <slug>` y `build-timeline.mjs --video <slug> --estimate`, con salidas locales en `out/timeline-estimate.json` y `out/transcript-estimate.txt`. Los siete construyen una línea de tiempo sin avisos de narración o cues. Se eliminó una marca duplicada al inicio: cada episodio tiene 30 cues distintos.
- Cada guion contiene cinco capítulos, diez escenas, cinco tarjetas complementarias, dos pausas de 4,5 segundos y dos mensajes interceptados. Cero metadatos `exam`/`question`. Las respuestas siguen a las pausas; las tarjetas se anclan después de la explicación.
- Se comprueban los enlaces locales del índice y las fichas, la congelación de los manifiestos y las pruebas existentes de exportación de guiones, texto, canon y construcción temporal.
- En Voice Studio, el exportador general coloca separadores de 400 ms entre segmentos. El generador de esta tanda sustituye el separador posterior a cada decisión por 4.500 ms, preservando sus dos pausas completas también en esa hoja.

Resultado de las comprobaciones de entrega: **68 pruebas existentes pasan, cero fallos** (`script-sheets`, `text`, `canon-refs` y `build-timeline`). El recorrido de los 23 Markdown valida **58 enlaces locales sin roturas** y confirma siete manifiestos congelados, 70 escenas, 35 tarjetas, 14 decisiones y 14 mensajes. `git diff --check` termina con código 0; los avisos de conversión LF/CRLF pertenecen a la configuración de Git y no son errores de guion.

| ID | Palabras de narradora | Segmentos | Estimación del motor | Presupuesto de montaje |
|---|---:|---:|---:|---:|
| AP01 | 1067 | 59 | 477,8 s | 505 s |
| AP02 | 1150 | 59 | 511,0 s | 538 s |
| AP03 | 1170 | 62 | 519,9 s | 545 s |
| AP04 | 1144 | 60 | 508,9 s | 534 s |
| AP05 | 1143 | 61 | 508,8 s | 535 s |
| AP06 | 1152 | 59 | 511,8 s | 538 s |
| AP07 | 1147 | 59 | 509,8 s | 536 s |

La estimación estándar cubre voz y pausas. El presupuesto añade cinco segundos por tarjeta complementaria y un pequeño redondeo por escena. Sus tarjetas son instrucciones para las futuras escenas; el motor no las dibuja automáticamente como tarjetas de examen. Los identificadores de composición quedan reservados hasta implementar las composiciones.

## Estado de entrega

Siete hojas de grabación definitivas, siete versiones Voice Studio, siete fichas de producción y sus fuentes editables. Los manifiestos quedan congelados el 19-10-2026 después de aplicar las revisiones y leer el canon. La tarea prepara guiones: la captura de demostraciones, grabación, montaje, revisión visual y publicación forman la siguiente fase de producción.

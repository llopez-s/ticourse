# AP04 · Del hash a los candidatos: pivotar sin inventar parentescos

**Lecciones:** s3m2, s3m3 · **Track:** gcti · **Formato:** principal narrativo con práctica complementaria.

**Promesa:** Construir y documentar una relación defendible entre muestras, sin convertir una coincidencia en atribución.

**Estado:** guion revisado y congelado el 2026-10-19. Escenas audiovisuales y grabación pendientes de producción.

**Público:** estudiante que empieza esta ampliación. Cada episodio presenta su escenario y se entiende por separado.

**Duración orientativa de montaje:** 8:54 (1144 palabras de narradora). Se estima a 2,5 palabras/s con pausas, intercepciones y cinco segundos de lectura por tarjeta. La estimación estándar del motor incluye la voz y las pausas; los 25 segundos de tarjetas complementarias se reservan aquí y se implementan al montar las escenas. La toma real fija la duración. Presupuesto de escena a 2,7 palabras/s, como la serie.

**Conceptos:**

- Identidad exacta y similitud
- Observaciones e hipótesis
- Pivotes de archivo e infraestructura
- Corroboración e independencia
- Conclusión, confianza y límites

**Imagen conductora:** Una pista abre una línea de investigación; no es una sentencia sobre quién la dejó.

**Interpretación:** recording/lidia, conversación directa en segunda persona. Pausas normales 300 ms y de cierre 600 ms. Dos decisiones de 4,5 s. Los mensajes de HOLLOW LANTERN no se leen con la voz de la narradora. No hace falta una voz nueva.

**Continuidad:** ejercicio didáctico sin fecha de incidente. Mantener los nombres de las campañas, sin insertar víctimas, equipos, cuentas, indicadores o resultados nuevos en sus casos publicados. Los mensajes del adversario proponen errores de método; no confiesan incidentes.

**Tratamiento del contenido:** rótulo permanente «Práctica complementaria · datos ficticios». Los fundamentos se explican desde cero; los detalles profesionales no se presentan como objetivos oficiales. Cinco tarjetas de aprendizaje propias y cero tarjetas/preguntas de examen. No usar el panel EXAMEN del motor para estas tarjetas.

## Escaleta

| Escena | Cap. | Objetivo temporal | Título | Tarjeta |
|---|---|---|---|---|
| s01-hook | 1 | 45 s | El parecido no termina el caso | — |
| s02-caso | 1 | 53 s | Los mismos bytes o rasgos parecidos | Hash exacto identifica bytes; similitud genera candidatos |
| s03-caso | 2 | 56 s | La etiqueta y la firma | — |
| s04-caso | 2 | 56 s | Qué significa ese noventa y cuatro | Dos señales dependientes no son dos corroboraciones |
| s05-caso | 3 | 54 s | La consulta conserva su pregunta | — |
| s06-caso | 3 | 55 s | Una línea no cuenta cómo ocurrió | Comprueba función, dirección y tiempo de la relación |
| s07-caso | 4 | 53 s | El candidato que sí gana peso | — |
| s08-caso | 4 | 58 s | La casilla vacía | No disponible no equivale a inexistente |
| s09-caso | 5 | 53 s | Que otra persona pueda seguirte | Registra consulta, evidencia, alternativas y confianza |
| s10-cierre | 5 | 51 s | La investigación que puedes explicar | — |

## Indicaciones visuales

### s01-hook · El parecido no termina el caso

Mesa didáctica de Meridian. Fichas A/B/C/D/E, distintas de las muestras históricas de GLASS VIPER. Sin hashes ni fechas del canon publicado. Flujo completo muestra/observaciones/hipótesis/pivotes/candidatos/corroboración/conclusión. Título y promesa tempranos.


### s02-caso · Los mismos bytes o rasgos parecidos

Hash criptográfico exacto frente a imphash y ssdeep. Animar cambio de un byte → hash distinto, sin deducir familia distinta. «Imphash = imports normalizados»; biblioteca compartida genera coincidencia débil.

**Tarjeta complementaria:** «Hash exacto identifica bytes; similitud genera candidatos». Entra al terminar la explicación del último párrafo, sin solaparse con lectura de evidencia. Sin insignia de examen.

### s03-caso · La etiqueta y la firma

PDB explicado como Program Database/ruta de símbolos. Firma de código con huella/validación/contexto, separada de TLS. Strings/config distintivas. Compartir un rasgo no cambia automáticamente estado de candidato a familia.


### s04-caso · Qué significa ese noventa y cuatro

C comparte imphash I1 y score ssdeep94. Mostrar biblioteca común, configuración distinta. Dos opciones antes de pausa; después mantener C en candidato débil, sin clasificar como benigno.

**Decisión:** ¿Confirmas C o buscas qué lo distingue? Opciones: Confirmar misma familia / Buscar evidencia que discrimine. Tras 4,5 s: Buscar evidencia que discrimine. La voz resuelve y explica las alternativas después de la pausa.

**Tarjeta complementaria:** «Dos señales dependientes no son dos corroboraciones». Entra al terminar la explicación del último párrafo, sin solaparse con lectura de evidencia. Sin insignia de examen.

### s05-caso · La consulta conserva su pregunta

Consultas ilustrativas oficiales de VT en pantalla: imphash:11111111111111111111111111111111; content:"cicada-demo-v1"; metadata:"ldr.pdb"; signature:"Meridian Demo Signing". Valores ficticios, sin ejecución. Buscar hash exacto no sube archivo. Mostrar disponibilidad dependiente de producto/permisos.


### s06-caso · Una línea no cuenta cómo ocurrió

Relaciones: dominio incrustado / contacto observado / archivo soltado / padre de ejecución. Conservar dirección, tiempo y fuente. D comparte IP de alojamiento; resolver ventana temporal y multiinquilino. TLS de servidor separado del certificado de código.

**Tarjeta complementaria:** «Comprueba función, dirección y tiempo de la relación». Entra al terminar la explicación del último párrafo, sin solaparse con lectura de evidencia. Sin insignia de examen.

### s07-caso · El candidato que sí gana peso

B: I1, cadena DEMO-CFG-7, configuración y conducta concordantes, dos orígenes de informes distintos. Hipótesis código compartido frente a componente público. Confianza moderada, no atribución a operador.


### s08-caso · La casilla vacía

E solo tiene una mención de PDB sin bytes ni procedencia. Campo de relación «no disponible», distinto de «sin relaciones». Pregunta y luego pista pendiente/confianza baja. No intentar eludir acceso premium.

**Decisión:** ¿Sin relaciones o dato no disponible? Opciones: No tiene relaciones / No hay dato accesible. Tras 4,5 s: No hay dato accesible. La voz resuelve y explica las alternativas después de la pausa.

**Tarjeta complementaria:** «No disponible no equivale a inexistente». Entra al terminar la explicación del último párrafo, sin solaparse con lectura de evidencia. Sin insignia de examen.

### s09-caso · Que otra persona pueda seguirte

Bitácora consulta/filtros/fecha consulta/fecha observación/fuente/evidencia/juicio/confianza/alternativa/próxima acción. Ejemplo sin nuevos timestamps del canon. Resultado B probable; C y D no incorporados; E pendiente.

**Tarjeta complementaria:** «Registra consulta, evidencia, alternativas y confianza». Entra al terminar la explicación del último párrafo, sin solaparse con lectura de evidencia. Sin insignia de examen.

### s10-cierre · La investigación que puedes explicar

Tres reglas: candidato no atribución / corroborar con alternativas / documentar límites. Acción única: resolver B/C/D/E en s3m2. Aviso no afiliado SANS/GIAC. No desvelar el Lab3A ni usar sus respuestas.


## Alcance y fuentes

**Se queda en el texto del curso:** Detonación, descargas, uso de API o cuentas premium; métodos internos de cálculo de hashes difusos; ingeniería inversa; familia o actor reales.

- VirusTotal: búsqueda por hash
- VirusTotal: modificadores
- VirusTotal: similitud
- VirusTotal: relaciones
- Curso: s3m2, candidatos B/C/D/E
- Curso: s3m3, contexto temporal

Las URLs y la matriz de cobertura están en el índice de la tanda. Mantener la fecha y las limitaciones al convertir capturas en material audiovisual.

**Fuentes de producción:** [storyboard](../../../../../video/muestra-candidatos/storyboard.json), [narración segmentada](../../../../../video/muestra-candidatos/narration.json) y [léxico](../../../../../video/muestra-candidatos/lexicon.json).

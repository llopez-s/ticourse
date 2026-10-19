# AP05 · Escribir YARA: qué debe coincidir y qué puede cambiar

**Lecciones:** s3m5 · **Track:** gcti · **Formato:** principal narrativo con práctica complementaria.

**Promesa:** Escribir una condición de detección y justificar sus patrones con un corpus inerte.

**Estado:** guion revisado y congelado el 2026-10-19. Escenas audiovisuales y grabación pendientes de producción.

**Público:** estudiante que empieza esta ampliación. Cada episodio presenta su escenario y se entiende por separado.

**Duración orientativa de montaje:** 8:55 (1143 palabras de narradora). Se estima a 2,5 palabras/s con pausas, intercepciones y cinco segundos de lectura por tarjeta. La estimación estándar del motor incluye la voz y las pausas; los 25 segundos de tarjetas complementarias se reservan aquí y se implementan al montar las escenas. La toma real fija la duración. Presupuesto de escena a 2,7 palabras/s, como la serie.

**Conceptos:**

- Hipótesis y alcance de una regla
- Meta, strings y condition
- ASCII, wide y nocase
- Hex, comodines y agrupaciones
- Restricciones y validación de la hipótesis

**Imagen conductora:** Una descripción con rasgos necesarios y alternativas; los rasgos se contrastan, no se votan por cantidad.

**Interpretación:** recording/lidia, conversación directa en segunda persona. Pausas normales 300 ms y de cierre 600 ms. Dos decisiones de 4,5 s. Los mensajes de HOLLOW LANTERN no se leen con la voz de la narradora. No hace falta una voz nueva.

**Continuidad:** ejercicio didáctico sin fecha de incidente. Mantener los nombres de las campañas, sin insertar víctimas, equipos, cuentas, indicadores o resultados nuevos en sus casos publicados. Los mensajes del adversario proponen errores de método; no confiesan incidentes.

**Tratamiento del contenido:** rótulo permanente «Práctica complementaria · datos ficticios». Los fundamentos se explican desde cero; los detalles profesionales no se presentan como objetivos oficiales. Cinco tarjetas de aprendizaje propias y cero tarjetas/preguntas de examen. No usar el panel EXAMEN del motor para estas tarjetas.

## Escaleta

| Escena | Cap. | Objetivo temporal | Título | Tarjeta |
|---|---|---|---|---|
| s01-hook | 1 | 45 s | Una regla con una promesa concreta | — |
| s02-caso | 1 | 52 s | Tres partes con trabajos distintos | Meta documenta; strings define; condition decide |
| s03-caso | 2 | 51 s | Dos palabras corrientes no hacen una familia | — |
| s04-caso | 2 | 58 s | El mismo texto, otros bytes | ASCII, wide y nocase amplían formas concretas |
| s05-caso | 3 | 50 s | El byte que cambia | — |
| s06-caso | 3 | 58 s | La ruta cambia, el marcador permanece | Exige el marcador y una alternativa justificada |
| s07-caso | 4 | 55 s | El manual que copia los patrones | — |
| s08-caso | 4 | 59 s | Lo que dejas fuera también es una decisión | Un límite también puede excluir variantes deseadas |
| s09-caso | 5 | 54 s | Escribir no es ejecutar | Escribir, compilar y ejecutar son comprobaciones distintas |
| s10-cierre | 5 | 53 s | Tu hipótesis, escrita | — |

## Indicaciones visuales

### s01-hook · Una regla con una promesa concreta

Mesa de Meridian con editor YARA y corpus ALRTDEMO. Sello «Corpus sintético e inerte · no es malware». A/B/C como archivos de práctica, distintos de los candidatos de AP04. Título y promesa antes de 12 s.


### s02-caso · Tres partes con trabajos distintos

Referencia real del laboratorio sin otras reglas todavía. Resaltar meta/strings/condition por turnos. No mostrar condiciones resueltas del lab guiado. Autoría, versión, fecha y alcance en meta, no como factores de match.

**Tarjeta complementaria:** «Meta documenta; strings define; condition decide». Entra al terminar la explicación del último párrafo, sin solaparse con lectura de evidencia. Sin insignia de examen.

### s03-caso · Dos palabras corrientes no hacen una familia

Control benign-common con Mozilla/5.0 y kernel32.dll. Condición ingenua «2 of them» coincide con ambas cadenas comunes. No marcar corpus como malware real. Contrastar con patrón distintivo y estructura.


### s04-caso · El mismo texto, otros bytes

A texto de un byte; B cadena CICADA-DEMO-V1 en UTF-16LE con 00 intercalados y ruta wide. Mostrar ascii wide nocase en código. Dos opciones para la pausa. Tras resolver, advertir que wide no implementa Unicode general.

**Decisión:** ¿B queda fuera o debes cubrir otra forma? Opciones: Ignorar su representación / Contemplar la variación prevista. Tras 4,5 s: Contemplar la variación prevista. La voz resuelve y explica las alternativas después de la pausa.

**Tarjeta complementaria:** «ASCII, wide y nocase amplían formas concretas». Entra al terminar la explicación del último párrafo, sin solaparse con lectura de evidencia. Sin insignia de examen.

### s05-caso · El byte que cambia

Comparar hex de A:41 4C 52 54 22 7F y C:41 4C 52 54 99 7F. Highlight solo el quinto byte. Patrón final41 4C 52 54 ?? 7F. Mostrar A? como nota de medio byte, sin ampliar a firmas reales.


### s06-caso · La ruta cambia, el marcador permanece

A/B marcador+ruta; C marcador+hex con ruta cambiada. Construir $family and ($route or $hex). Comparar brevemente ($family and $route) or $hex con control benign-hex. Identificadores y operadores se leen visualmente, sin narrar código carácter a carácter.

**Tarjeta complementaria:** «Exige el marcador y una alternativa justificada». Entra al terminar la explicación del último párrafo, sin solaparse con lectura de evidencia. Sin insignia de examen.

### s07-caso · El manual que copia los patrones

benign-manual contiene todos los patrones pero ALRTDEMO no está en offset0. Cabecera inventada al inicio + filesize<4KB. Aviso no es PE, no ejecutable; MZ por sí solo no valida PE. Módulo pe.is_pe queda como nota visual con fuente.


### s08-caso · Lo que dejas fuera también es una decisión

Archivo de4096bytes y archivo mayor fuera de filesize<4KB. Pregunta dos opciones. Después diferenciar límite declarado de FN si objetivo ampliado. No ocultar future-uncovered v2.

**Decisión:** ¿Qué pasa con cuatro mil noventa y seis bytes? Opciones: Cumple el límite estricto / Queda fuera del límite. Tras 4,5 s: Queda fuera del límite. La voz resuelve y explica las alternativas después de la pausa.

**Tarjeta complementaria:** «Un límite también puede excluir variantes deseadas». Entra al terminar la explicación del último párrafo, sin solaparse con lectura de evidencia. Sin insignia de examen.

### s09-caso · Escribir no es ejecutar

Editor del curso con aviso no compila/ejecuta. ZIP inerte y regla descargada. Tres etapas escribir / compilar / ejecutar, con la última futura y no falsos resultados terminales. Forge rotulado simulación por etiquetas.

**Tarjeta complementaria:** «Escribir, compilar y ejecutar son comprobaciones distintas». Entra al terminar la explicación del último párrafo, sin solaparse con lectura de evidencia. Sin insignia de examen.

### s10-cierre · Tu hipótesis, escrita

Tres reglas: alcance antes del código / combinar con razones / medir límites. Acción única: escribir MiRegla sin copiar todavía la solución. No incluir resultado de ejecución nuevo; aviso de complementario y no afiliación.


## Alcance y fuentes

**Se queda en el texto del curso:** Regex avanzadas, módulos adicionales, escaneo de procesos, detección de malware real y la solución del Lab3B. Las pruebas completas y la entrega van a AP06.

- YARA: sintaxis
- YARA: módulo PE
- Curso: corpus ALRTDEMO y reference.yar

Las URLs y la matriz de cobertura están en el índice de la tanda. Mantener la fecha y las limitaciones al convertir capturas en material audiovisual.

**Fuentes de producción:** [storyboard](../../../../../video/yara-condicion/storyboard.json), [narración segmentada](../../../../../video/yara-condicion/narration.json) y [léxico](../../../../../video/yara-condicion/lexicon.json).

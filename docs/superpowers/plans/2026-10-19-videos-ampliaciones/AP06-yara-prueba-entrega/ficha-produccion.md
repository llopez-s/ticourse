# AP06 · Tu YARA compila: ahora demuestra qué detecta

**Lecciones:** s3m5, s5m3 · **Track:** gcti · **Formato:** principal narrativo con práctica complementaria.

**Promesa:** Validar una regla con un motor real y entregarla con resultados reproducibles y límites.

**Estado:** guion revisado y congelado el 2026-10-19. Escenas audiovisuales y grabación pendientes de producción.

**Público:** estudiante que empieza esta ampliación. Cada episodio presenta su escenario y se entiende por separado.

**Duración orientativa de montaje:** 8:58 (1152 palabras de narradora). Se estima a 2,5 palabras/s con pausas, intercepciones y cinco segundos de lectura por tarjeta. La estimación estándar del motor incluye la voz y las pausas; los 25 segundos de tarjetas complementarias se reservan aquí y se implementan al montar las escenas. La toma real fija la duración. Presupuesto de escena a 2,7 palabras/s, como la serie.

**Conceptos:**

- Compilación y ejecución reales
- Falsos positivos y negativos
- Regresión, generalización y sobreajuste
- Regla de muestra, familia y hunting
- Entrega técnica y mantenimiento

**Imagen conductora:** Un examen corregido contra su enunciado: acertar el conjunto de respuestas no prueba saber cualquier tema.

**Interpretación:** recording/lidia, conversación directa en segunda persona. Pausas normales 300 ms y de cierre 600 ms. Dos decisiones de 4,5 s. Los mensajes de VELVET CICADA no se leen con la voz de la narradora. No hace falta una voz nueva.

**Continuidad:** ejercicio didáctico sin fecha de incidente. Mantener los nombres de las campañas, sin insertar víctimas, equipos, cuentas, indicadores o resultados nuevos en sus casos publicados. Los mensajes del adversario proponen errores de método; no confiesan incidentes.

**Tratamiento del contenido:** rótulo permanente «Práctica complementaria · datos ficticios». Los fundamentos se explican desde cero; los detalles profesionales no se presentan como objetivos oficiales. Cinco tarjetas de aprendizaje propias y cero tarjetas/preguntas de examen. No usar el panel EXAMEN del motor para estas tarjetas.

## Escaleta

| Escena | Cap. | Objetivo temporal | Título | Tarjeta |
|---|---|---|---|---|
| s01-hook | 1 | 43 s | La sintaxis está bien | — |
| s02-caso | 1 | 57 s | El motor y el archivo importan | Compilar valida sintaxis; ejecutar contrasta coincidencias |
| s03-caso | 2 | 56 s | Acertar algo y detectar de más | — |
| s04-caso | 2 | 56 s | Volver al ejemplo conocido | Una regla más restrictiva puede perder variantes |
| s05-caso | 3 | 53 s | Tres reglas, tres trabajos | — |
| s06-caso | 3 | 57 s | Doce de doce, con denominador | Doce resultados esperados no son cobertura universal |
| s07-caso | 4 | 55 s | Mandar la regla no basta | — |
| s08-caso | 4 | 59 s | El receptor quiere bloquear | La validación tiene que corresponder al uso previsto |
| s09-caso | 5 | 55 s | Una entrega que puede mantenerse | Versión, resultados, acción y responsable viajan juntos |
| s10-cierre | 5 | 47 s | De la regla al producto | — |

## Indicaciones visuales

### s01-hook · La sintaxis está bien

Meridian, práctica inerte ALRTDEMO. Terminal rotulada motor real solo cuando se capture una ejecución real. Estado de la regla: sintaxis aceptada, resultados pendientes. Título y promesa tempranos.


### s02-caso · El motor y el archivo importan

Captura real del comando documentado para regla del alumno y para reference.yar. Registrar YARA4.5.4 si es el motor capturado, sin fijar esa versión para siempre. Error sintaxis exit2 / discrepancia exit1 / conformidad exit0. No simular terminal como ejecución real.

**Tarjeta complementaria:** «Compilar valida sintaxis; ejecutar contrasta coincidencias». Entra al terminar la explicación del último párrafo, sin solaparse con lectura de evidencia. Sin insignia de examen.

### s03-caso · Acertar algo y detectar de más

Matriz por archivo A/B/C/control ruta/control hex/manual. Etiquetas objetivo y match separadas. Regla ingenua amplia detecta controles. Mantener términos TP/FP/FN/TN en pantalla definidos, sin recitar lista de cuatro.


### s04-caso · Volver al ejemplo conocido

C ya se usó al diseñar en AP05: cambia ruta, conserva marcador y hex. Exigir todo falla C; la referencia alternativa lo cubre. Tras la pausa, distinguir regresión de caso conocido y evaluación con casos nuevos. El paquete agrupa training6 / held-out5 / challenge1, pero todos son públicos y sus nombres no garantizan independencia del diseño.

**Decisión:** ¿Exigir todo mejora siempre la cobertura? Opciones: Sí, más condiciones siempre ayuda / No, puede perder una variante. Tras 4,5 s: No, puede perder una variante. La voz resuelve y explica las alternativas después de la pausa.

**Tarjeta complementaria:** «Una regla más restrictiva puede perder variantes». Entra al terminar la explicación del último párrafo, sin solaparse con lectura de evidencia. Sin insignia de examen.

### s05-caso · Tres reglas, tres trabajos

Referencia Sample→A; Family→A/B/C; Hunt→A/B/C+benign-route/marker/hex. Casos y hash de corpus al pie. No describir Hunt con0FP. Diferenciar objetivos de sus etiquetas de evaluación.


### s06-caso · Doce de doce, con denominador

Salida real12/12 conforme al alcance; mostrar que incluye no-matches. future-uncovered v2 queda sin match; límite4096bytes. Contrato v1 separado de objetivo ampliado v2. No usar100% malware real.

**Tarjeta complementaria:** «Doce resultados esperados no son cobertura universal». Entra al terminar la explicación del último párrafo, sin solaparse con lectura de evidencia. Sin insignia de examen.

### s07-caso · Mandar la regla no basta

Paquete de entrega: regla/version/hash, motor, corpus/hash, matriz, alcance/FP-FN, acción, responsable/revisión/derechos. Mensaje como atajo de método firmadoVELVET CICADA; no confesión ni adelanto de dossier.


### s08-caso · El receptor quiere bloquear

Propuesta ficticia del SOC: desplegar a toda la flota por12/12. Pregunta laboratorio/producción. Resolver con validación representativa y acción autorizada sin exigir implementación en esta tanda.

**Decisión:** ¿Estos resultados justifican bloquear la flota? Opciones: Sí, pasó todo el paquete / No, falta validar ese uso real. Tras 4,5 s: No, falta validar ese uso real. La voz resuelve y explica las alternativas después de la pausa.

**Tarjeta complementaria:** «La validación tiene que corresponder al uso previsto». Entra al terminar la explicación del último párrafo, sin solaparse con lectura de evidencia. Sin insignia de examen.

### s09-caso · Una entrega que puede mantenerse

Ficha de entrega con versión1.0, fecha editorial, alcanceALRTDEMOv1; dueño didáctico; revisión ante nuevos fixtures. No inventar fecha de despliegue. Mostrar reejecución tras cambio y revisión de errores.

**Tarjeta complementaria:** «Versión, resultados, acción y responsable viajan juntos». Entra al terminar la explicación del último párrafo, sin solaparse con lectura de evidencia. Sin insignia de examen.

### s10-cierre · De la regla al producto

Tres reglas: compilar no es validar / medir positivos y negativos / entregar alcance y reproducción. Acción única: ejecutar verificador sobre MiRegla y completar una ficha de entrega. Aviso complementario y fuentes.


## Alcance y fuentes

**Se queda en el texto del curso:** Instalación detallada de Python, problemas de sistema operativo, validación de producción con malware real y el flujo de Sigma de V27.

- YARA: motor Python
- Curso: verify.py y fixtures.py
- Curso: reference.yar
- Curso: s5m3, entrega técnica

Las URLs y la matriz de cobertura están en el índice de la tanda. Mantener la fecha y las limitaciones al convertir capturas en material audiovisual.

**Fuentes de producción:** [storyboard](../../../../../video/yara-prueba-entrega/storyboard.json), [narración segmentada](../../../../../video/yara-prueba-entrega/narration.json) y [léxico](../../../../../video/yara-prueba-entrega/lexicon.json).

# AP02 · Cambiar la contraseña no cierra todo: responder a un infostealer

**Lecciones:** sp2m6, sp4m10 · **Track:** secplus · **Formato:** principal narrativo con práctica complementaria.

**Promesa:** Separar lo que pudo robarse, lo que se usó y las acciones que realmente cortan el acceso.

**Estado:** guion revisado y congelado el 2026-10-19. Escenas audiovisuales y grabación pendientes de producción.

**Público:** estudiante que empieza esta ampliación. Cada episodio presenta su escenario y se entiende por separado.

**Duración orientativa de montaje:** 8:58 (1150 palabras de narradora). Se estima a 2,5 palabras/s con pausas, intercepciones y cinco segundos de lectura por tarjeta. La estimación estándar del motor incluye la voz y las pausas; los 25 segundos de tarjetas complementarias se reservan aquí y se implementan al montar las escenas. La toma real fija la duración. Presupuesto de escena a 2,7 palabras/s, como la serie.

**Conceptos:**

- Capacidad, exposición y uso
- Artefactos de autenticación distintos
- Contención de dispositivo e identidad
- Revocación y sesiones de aplicación
- Verificación del alcance y recuperación

**Imagen conductora:** Cerrar dos frentes del mismo incidente; la analogía del pase de AP01 solo reaparece para diferenciar permisos.

**Interpretación:** recording/lidia, conversación directa en segunda persona. Pausas normales 300 ms y de cierre 600 ms. Dos decisiones de 4,5 s. Los mensajes de SILENT PAGER no se leen con la voz de la narradora. No hace falta una voz nueva.

**Continuidad:** ejercicio didáctico sin fecha de incidente. Mantener los nombres de las campañas, sin insertar víctimas, equipos, cuentas, indicadores o resultados nuevos en sus casos publicados. Los mensajes del adversario proponen errores de método; no confiesan incidentes.

**Tratamiento del contenido:** rótulo permanente «Práctica complementaria · datos ficticios». Los fundamentos se explican desde cero; los detalles profesionales no se presentan como objetivos oficiales. Cinco tarjetas de aprendizaje propias y cero tarjetas/preguntas de examen. No usar el panel EXAMEN del motor para estas tarjetas.

## Escaleta

| Escena | Cap. | Objetivo temporal | Título | Tarjeta |
|---|---|---|---|---|
| s01-hook | 1 | 41 s | La casilla verde | — |
| s02-caso | 1 | 54 s | Tres afirmaciones distintas | Capacidad, exposición y uso requieren evidencia distinta |
| s03-caso | 2 | 53 s | No todas las credenciales abren igual | — |
| s04-caso | 2 | 57 s | El equipo continúa comprometido | Contener el equipo y proteger la identidad son dos tareas |
| s05-caso | 3 | 54 s | Ampliar el alcance con preguntas | — |
| s06-caso | 3 | 57 s | Elegir la revocación que corresponde | La acción depende del artefacto y del servicio emisor |
| s07-caso | 4 | 57 s | El botón no es el resultado | — |
| s08-caso | 4 | 60 s | ¿Qué te permite avanzar? | Verifica los efectos; documenta los límites |
| s09-caso | 5 | 57 s | Volver al caso de Ana | Recuperación y cierre se apoyan en evidencia del caso |
| s10-cierre | 5 | 48 s | Cerrar los dos frentes | — |

## Indicaciones visuales

### s01-hook · La casilla verde

Ejercicio independiente en Halden. Alerta ficticia de infostealer y casilla «contraseña cambiada». La ficha del equipo continúa abierta. Sin fechas, equipos ni cuentas del incidente publicado. Título y promesa antes de 12 s.


### s02-caso · Tres afirmaciones distintas

Tres columnas: puede robar / hay evidencia de extracción / hay evidencia de uso. Mover evidencias ficticias sin rellenar automáticamente las siguientes columnas. Mostrar ausencia de datos como desconocido.

**Tarjeta complementaria:** «Capacidad, exposición y uso requieren evidencia distinta». Entra al terminar la explicación del último párrafo, sin solaparse con lectura de evidencia. Sin insignia de examen.

### s03-caso · No todas las credenciales abren igual

Contraseña, cookie, access token y refresh token en filas distintas. Recurso, vigencia y controles como campos pendientes. No mostrar bytes ni secretos. El mensaje empuja una única acción insuficiente.


### s04-caso · El equipo continúa comprometido

Equipo afectado y dispositivo confiable separados. Dos opciones de decisión: cambiar secretos desde el afectado / contener y usar entorno confiable. Mostrar aislamiento autorizado, preservación y coordinación, sin instrucciones de extracción.

**Decisión:** ¿Cambias secretos desde el equipo afectado? Opciones: Sí, es más rápido / No, usar un entorno confiable. Tras 4,5 s: No, usar un entorno confiable. La voz resuelve y explica las alternativas después de la pausa.

**Tarjeta complementaria:** «Contener el equipo y proteger la identidad son dos tareas». Entra al terminar la explicación del último párrafo, sin solaparse con lectura de evidencia. Sin insignia de examen.

### s05-caso · Ampliar el alcance con preguntas

Línea temporal didáctica sin horas inventadas: posible extracción / detección / contención / accesos posteriores. Lista visual de fuentes: endpoint, identidad, aplicaciones, auditoría de correo. Un hueco de retención se marca como límite.


### s06-caso · Elegir la revocación que corresponde

Matriz escenario/acción/verificación de sp4m10. Contraseña → rotación; sesión web → servicio emisor; refresh → revocación de renovación; access → controles del recurso. Consentimiento y credenciales de aplicación en fila aparte.

**Tarjeta complementaria:** «La acción depende del artefacto y del servicio emisor». Entra al terminar la explicación del último párrafo, sin solaparse con lectura de evidencia. Sin insignia de examen.

### s07-caso · El botón no es el resultado

Panel conceptual Microsoft, sin interfaz real ni botones ejecutables. Revocación solicitada / efectos por verificar. Nombre revokeSignInSessions solo en pantalla. CAE con rótulo «recursos, clientes y eventos compatibles». Sin cronómetro universal de una hora.


### s08-caso · ¿Qué te permite avanzar?

Dos evidencias: correo de confirmación del cambio / conjunto de controles y revisión comprobados. No presentar el segundo como garantía absoluta de ausencia. Pausa y después evidencia + límites + vigilancia.

**Decisión:** ¿Cambio confirmado o controles verificados? Opciones: Correo de confirmación / Controles y actividad revisados. Tras 4,5 s: Controles y actividad revisados. La voz resuelve y explica las alternativas después de la pausa.

**Tarjeta complementaria:** «Verifica los efectos; documenta los límites». Entra al terminar la explicación del último párrafo, sin solaparse con lectura de evidencia. Sin insignia de examen.

### s09-caso · Volver al caso de Ana

Ana y Resumen del turno identificados como datos del ejercicio, sin elevarlos a incidente de GLASS HARBOR. Revisiones de equipo, identidad, Graph y sesión de aplicación separadas. Informe de conclusión breve.

**Tarjeta complementaria:** «Recuperación y cierre se apoyan en evidencia del caso». Entra al terminar la explicación del último párrafo, sin solaparse con lectura de evidencia. Sin insignia de examen.

### s10-cierre · Cerrar los dos frentes

Tres reglas: distinguir evidencia / contener dispositivo e identidad / verificar efectos. Acción única: checkpoint complementario de sp4m10. Descargo independiente de CompTIA. Créditos de fuentes al final, sin narrar URLs.


## Alcance y fuentes

**Se queda en el texto del curso:** Extracción o reutilización de credenciales, comandos administrativos, operación de tenants reales, análisis de muestras y decisiones legales de notificación.

- Microsoft: refresh tokens
- Microsoft: revocar acceso de emergencia
- Microsoft Graph: revokeSignInSessions
- Microsoft: evaluación continua del acceso

Las URLs y la matriz de cobertura están en el índice de la tanda. Mantener la fecha y las limitaciones al convertir capturas en material audiovisual.

**Fuentes de producción:** [storyboard](../../../../../video/stealer-sesiones/storyboard.json), [narración segmentada](../../../../../video/stealer-sesiones/narration.json) y [léxico](../../../../../video/stealer-sesiones/lexicon.json).

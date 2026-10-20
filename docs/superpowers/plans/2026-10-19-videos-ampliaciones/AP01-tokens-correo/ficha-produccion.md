# AP01 · La sesión sigue abierta: identidad, permisos y tokens

**Lecciones:** sp4m8 · **Track:** secplus · **Formato:** principal narrativo con práctica complementaria.

**Promesa:** Seguir el acceso al correo y distinguir qué permite cada credencial.

**Estado:** guion revisado y congelado el 2026-10-19. Escenas audiovisuales y grabación pendientes de producción.

**Público:** estudiante que empieza esta ampliación. Cada episodio presenta su escenario y se entiende por separado.

**Duración orientativa de montaje:** 8:25 (1067 palabras de narradora). Se estima a 2,5 palabras/s con pausas, intercepciones y cinco segundos de lectura por tarjeta. La estimación estándar del motor incluye la voz y las pausas; los 25 segundos de tarjetas complementarias se reservan aquí y se implementan al montar las escenas. La toma real fija la duración. Presupuesto de escena a 2,7 palabras/s, como la serie.

**Conceptos:**

- Autenticación y autorización
- Participantes de OAuth
- Access, refresh e ID token
- Audiencia, permisos y vigencia
- MFA y robo posterior de sesión

**Imagen conductora:** Un pase limitado para una sala y una autorización para pedir otro; nunca una llave maestra.

**Interpretación:** recording/lidia, conversación directa en segunda persona. Pausas normales 300 ms y de cierre 600 ms. Dos decisiones de 4,5 s. Los mensajes de SILENT PAGER no se leen con la voz de la narradora. No hace falta una voz nueva.

**Continuidad:** ejercicio didáctico sin fecha de incidente. Mantener los nombres de las campañas, sin insertar víctimas, equipos, cuentas, indicadores o resultados nuevos en sus casos publicados. Los mensajes del adversario proponen errores de método; no confiesan incidentes.

**Tratamiento del contenido:** rótulo permanente «Práctica complementaria · datos ficticios». Los fundamentos se explican desde cero; los detalles profesionales no se presentan como objetivos oficiales. Cinco tarjetas de aprendizaje propias y cero tarjetas/preguntas de examen. No usar el panel EXAMEN del motor para estas tarjetas.

## Escaleta

| Escena | Cap. | Objetivo temporal | Título | Tarjeta |
|---|---|---|---|---|
| s01-hook | 1 | 39 s | La contraseña no cuenta toda la historia | — |
| s02-caso | 1 | 52 s | Entrar y tener permiso | Autenticar identifica; autorizar limita acciones |
| s03-caso | 2 | 49 s | Cuatro participantes en la misma pantalla | — |
| s04-caso | 2 | 56 s | ¿Qué presentarías al correo? | Acceso a la API; renovación ante el emisor |
| s05-caso | 3 | 50 s | Tres credenciales que se parecen desde fuera | — |
| s06-caso | 3 | 53 s | Un permiso con bordes | Destinatario, permisos y vigencia acotan el acceso |
| s07-caso | 4 | 50 s | Después de la comprobación | — |
| s08-caso | 4 | 57 s | ¿Qué demuestra la alerta? | Exposición no demuestra uso ni acceso permanente |
| s09-caso | 5 | 54 s | Explicarlo sin prometer de más | El permiso concedido no prueba qué ocurrió después |
| s10-cierre | 5 | 45 s | Tres comprobaciones y una decisión | — |

## Indicaciones visuales

### s01-hook · La contraseña no cuenta toda la historia

Sello permanente «Práctica complementaria · datos ficticios». Halden, ejercicio de formación sin fecha de incidente. Ana abre Resumen del turno. Dos preguntas separadas: quién eres / qué permite la aplicación. Título antes de 12 s. No mostrar credenciales ni un JWT de ejemplo.


### s02-caso · Entrar y tener permiso

Ana se identifica ante el servicio de identidad. Un pase de lectura abre una sala concreta; la sala de administración queda cerrada. Definiciones en orden. La analogía termina aquí: el servicio aplica controles técnicos, no un vigilante humano.

**Tarjeta complementaria:** «Autenticar identifica; autorizar limita acciones». Entra al terminar la explicación del último párrafo, sin solaparse con lectura de evidencia. Sin insignia de examen.

### s03-caso · Cuatro participantes en la misma pantalla

Cuatro columnas persistentes: Ana / Resumen del turno / Entra ID / Microsoft Graph. Animar solicitud, autenticación y concesión. Mostrar Mail.Read solo en pantalla. No presentar consentimiento y autenticación como una sola acción.


### s04-caso · ¿Qué presentarías al correo?

Mantener cuatro columnas. Pregunta con dos opciones «Access token» / «Refresh token», sin color de respuesta antes de terminar la pausa. Después iluminar aplicación → Graph para acceso y aplicación → Entra ID para renovación.

**Decisión:** Para leer correo, ¿acceso o renovación? Opciones: Token de acceso / Token de renovación. Tras 4,5 s: Token de acceso. La voz resuelve y explica las alternativas después de la pausa.

**Tarjeta complementaria:** «Acceso a la API; renovación ante el emisor». Entra al terminar la explicación del último párrafo, sin solaparse con lectura de evidencia. Sin insignia de examen.

### s05-caso · Tres credenciales que se parecen desde fuera

Tabla separada: contraseña / cookie de sesión / ID token. Identificar emisor y destinatario de cada uno. Resaltar «no toda cookie autentica» y «ID token dirigido al cliente». No usar material real ni secuencias con aspecto de token utilizable.


### s06-caso · Un permiso con bordes

Ficha conceptual sin datos de token: emisor=Entra ID; destinatario=Graph; permiso delegado=Mail.Read; vigencia=según emisión y política. El botón enviar permanece deshabilitado. Un reloj representa caducidad sin fijarla en una hora universal.

**Tarjeta complementaria:** «Destinatario, permisos y vigencia acotan el acceso». Entra al terminar la explicación del último párrafo, sin solaparse con lectura de evidencia. Sin insignia de examen.

### s07-caso · Después de la comprobación

MFA al inicio; después, emisión y uso del token. Separar robo hipotético posterior de prueba de uso. Contrato de lectura del buzón visible. Mensaje firmado por SILENT PAGER como atajo de método, no como confesión del caso de septiembre.


### s08-caso · ¿Qué demuestra la alerta?

Alerta sintética: «posible exposición de un access token de Graph con lectura delegada». Pregunta «¿Acceso a todo o alcance por comprobar?». Tras la pausa, abrir solo la zona de lectura y dejar interrogación en uso/renovación.

**Decisión:** ¿Acceso a todo o alcance por comprobar? Opciones: Acceso a todo / Alcance por comprobar. Tras 4,5 s: Alcance por comprobar. La voz resuelve y explica las alternativas después de la pausa.

**Tarjeta complementaria:** «Exposición no demuestra uso ni acceso permanente». Entra al terminar la explicación del último párrafo, sin solaparse con lectura de evidencia. Sin insignia de examen.

### s09-caso · Explicarlo sin prometer de más

Reconstruir el flujo completo con cuatro participantes y dos destinos distintos para acceso/renovación. Mostrar una conclusión modelo con evidencia, alcance y pendiente. Borde complementario siempre visible.

**Tarjeta complementaria:** «El permiso concedido no prueba qué ocurrió después». Entra al terminar la explicación del último párrafo, sin solaparse con lectura de evidencia. Sin insignia de examen.

### s10-cierre · Tres comprobaciones y una decisión

Tres reglas sin tarjeta nueva: identificar artefacto / acotar permiso / buscar evidencia de uso. Acción única: checkpoint complementario de sp4m8. Créditos y descargo de CompTIA; no reproducir badges de examen.


## Alcance y fuentes

**Se queda en el texto del curso:** Flujos OAuth de implementación, formato interno de tokens, permisos de aplicación sin usuario y configuración real del tenant. El ejercicio de respuesta continúa en AP02.

- Microsoft Graph: autenticación y autorización
- Microsoft: access tokens
- Microsoft: refresh tokens
- Microsoft: ID tokens
- Microsoft: scopes OIDC
- Microsoft Graph: listar mensajes

Las URLs y la matriz de cobertura están en el índice de la tanda. Mantener la fecha y las limitaciones al convertir capturas en material audiovisual.

**Fuentes de producción:** [storyboard](../../../../../video/tokens-correo/storyboard.json), [narración segmentada](../../../../../video/tokens-correo/narration.json) y [léxico](../../../../../video/tokens-correo/lexicon.json).

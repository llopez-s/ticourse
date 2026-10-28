# Security+ con vídeos: recorrido autónomo

Implementación local del 28-10-2026. Referencia: SY0-701, objetivos públicos,
documento 7.0. Es material original e independiente, sin afiliación a CompTIA.
La implementación no acredita una tasa de aprobados ni sustituye la validación
externa de los resultados de alumnos.

## Acceso y recorrido

Selecciona Security+ y abre **Recorrido con vídeos**, o usa
`#/security/study`. También está disponible desde el panel y desde Examen.

El itinerario propone 24 semanas de 5,5 horas: tres sesiones de 90 minutos y
10 minutos de repaso durante seis días. Suma 132 horas orientativas, incluidos
vídeos, actividades, ejercicios, correcciones y repaso. No supone que 132 horas
garanticen aprobar. Se puede acceder libremente a todas las etapas.

| Semanas | Etapa | Idioma de trabajo |
|---|---|---|
| 1–4 | Doce fundamentos informáticos y cuatro prácticas | Español |
| 5–11 | Conceptos, amenazas y arquitectura | Enseñanza española y práctica bilingüe |
| 12–18 | Operaciones y gobernanza | Quizzes en inglés, explicaciones y ayuda española |
| 19–21 | Seis familias de práctica, dos casos por familia | Selección español/inglés |
| 22–24 | Tres simulacros independientes y repaso dirigido | Inglés y corrección posterior española |

El examen de salida de fundamentos contiene 24 situaciones distintas de la
lectura. Su objetivo recomendado es 80%. Marcar una lectura como estudiada
registra progreso; esa marca no equivale a superar fundamentos.

## Vídeos como unidad de aprendizaje

El inventario inicial de 21 vídeos Security+ se amplió al conciliar los otros
worktrees del proyecto: ahora hay **45 vídeos Security+ integrados**, incluidos
documentos, roles, proveedores y preparación final. Se conservan los 16 GCTI
integrados de main actual. El catálogo total reúne 75 piezas. AP01 y AP02 se incorporan como
ampliación de identidades y respuesta; AP03–AP07 quedan documentados como
material profesional terminado con prerrequisitos, fuera del recorrido inicial.
Las siete piezas de ampliación de otra versión conservan sus lecciones y se
identifican como complementarias, fuera de las evaluaciones SY0-701. No se cambia el contenido ni el progreso de GCTI.

El total localizado de Security+ es **52 piezas: 45 integradas y siete
complementarias**. No deben confundirse esas cifras con publicación verificada:
50 tienen un enlace de YouTube registrado y dos —SIEM y adquisición forense—
se sirven como MP4 locales. Los registros de subida privada tampoco certifican
la visibilidad actual. Los 52 conservan sus enlaces en las lecciones actuales. El catálogo conserva las siete ampliaciones: mapa
701→801, riesgos de IA, IA en operaciones, nuevos vectores, secretos en código,
arquitectura y datos, y operaciones y gobierno.

Cada uno de los 45 vídeos del recorrido SY0-701 incluye prerrequisitos, objetivos,
pregunta guía, capítulos y dos actividades posteriores: comprensión y
aplicación en otro contexto. La alternativa por transcripción permite resolver
las mismas actividades. El tiempo de reproducción no concede dominio ni XP.

`scripts/build-security-inventory.mjs` extrae los capítulos de los montajes con
audio y comprueba su duración contra los VTT distribuidos. El inventario
generado conserva la fuente de verificación. Los enlaces de repaso usan el
capítulo pertinente. Los MP4 locales aceptan posicionamiento; YouTube mantiene
la carga tras un clic y recibe el inicio del capítulo seleccionado.

`src/data/security/produced-videos.json` conserva el inventario recuperado,
hash del montaje, referencia del audio, capítulos y hashes de los recursos
finales. El generador verifica estos archivos sin depender de rutas externas.
Los recursos se copiaron sin modificar los otros worktrees ni mezclar sus
lecciones. Los bloques nuevos, cuando faltan, se añaden al final de cada lección para
mantener los índices anteriores. Los 52 vídeos de main ya estaban enlazados y
se conservan sus ubicaciones. El vídeo de preparación final enseña estrategias del
curso y no se asigna artificialmente a un objetivo técnico oficial.

| Serie | Función en esta entrega | Conocimientos previos |
|---|---|---|
| AP01 · Tokens y correo | Ampliación integrada en sp4m8 | HTTP/TLS, autenticación y sesiones |
| AP02 · Stealer y sesiones | Ampliación integrada en sp4m10 | Procesos, identidad y cronologías |
| AP03 · Feeds por requisito | Profesional, terminado | Requisitos CTI y evaluación de fuentes |
| AP04 · Muestra y candidatos | Profesional, terminado | Hashes, pivotes y límites de atribución |
| AP05 · Condición YARA | Profesional, terminado | Sintaxis YARA y corpus de prueba |
| AP06 · Prueba y entrega YARA | Profesional, terminado | AP05, positivos y negativos del corpus |
| AP07 · Métricas de stealers | Profesional, terminado | Sesiones, sesgo de fuentes y análisis CTI |

Las transcripciones y aclaraciones técnicas previas, incluido IAM/sandbox,
se conservan. No se han sustituido audios por textos revisados que no coincidan
con lo grabado.

## Contenido y práctica

- Mapa de los 28 objetivos con agrupaciones de sus apartados, lecciones,
  ejemplos existentes, casos autónomos y evaluación.
- Un caso de aplicación por objetivo, integrado en las lecciones y accesible
  desde el mapa.
- Las 308 preguntas de entrenamiento mantienen sus IDs y claves de respuesta.
  Se revisan opciones, se reducen pistas de longitud y se añaden explicación
  comparativa, objetivo y enlaces de repaso. Al menos el 70% se clasifica como
  aplicación; la clasificación editorial distingue escenarios de preguntas
  de definición/comparación y no acredita
  dificultad psicométrica.
- Doce prácticas de seis familias: firewall, identidad, logs, vulnerabilidades,
  wifi/hardening y respuesta/recuperación. Son simulaciones sintéticas de
  decisiones, no ejecución de herramientas contra sistemas reales.
- Las prácticas conservan respuestas, primer resultado, correcciones y
  reflexión personal. El texto libre no se califica automáticamente.

## Simulacros y criterios internos

Cada forma A/B/C tiene 90 elementos en 90 minutos: 74 de respuesta única,
12 de selección múltiple y cuatro PBQs. Cada una contiene 11/20/16/25/18
elementos por dominio. Las familias PBQ son A: 1–4; B: 1,2,5,6; C: 3–6.
Es una composición pedagógica propia: CompTIA no publica una distribución
exacta fija de estos tipos de pregunta.

Las formas tienen IDs y situaciones distintos del entrenamiento. No se
indexan en la búsqueda del temario. Al estar incluidas en una web estática,
no son confidenciales ni supervisadas. La separación sirve para autoevaluación
pedagógica, no como garantía contra inspección del código o manipulación local.

La selección múltiple exige el conjunto completo. Cada PBQ puntúa de 0 a 100
según sus criterios, admite las equivalencias documentadas y vale un elemento
normalizado. Los elementos vacíos puntúan cero. Se muestran resultados
globales, por dominio y de práctica; los porcentajes internos no se convierten
en puntos del examen oficial.

La recomendación interna exige fundamentos y dos formas nuevas sin ayudas,
separadas al menos siete días y realizadas dentro de los últimos 30. Ambas
necesitan 85% global, 80% por dominio, 80% práctico y ningún fallo crítico.
Estos umbrales son provisionales y necesitan contraste con alumnos reales.

El reloj persiste y sigue transcurriendo al cerrar. Se puede revisar y marcar
antes de entregar. Abrir material del curso, declarar ayuda o realizar formas
concurrentes registra asistencia. La ayuda externa no observable se declara
por el alumno. Repetir una forma conserva su exposición previa; agotar las tres
formas muestra que ya no queda una primera evaluación disponible.

## Datos y compatibilidad

El cuaderno nuevo usa `alertopolis-security-learning-v1` y un esquema propio,
separado de `intelforge-v1`, XP, convalidaciones y sincronización general.
Se guarda en este navegador/dispositivo. No se envían resultados automáticamente.

Mi cuaderno permite exportar/importar JSON. Se conservan respuestas y exposición;
los intentos importados se identifican como práctica y no activan preparación.
Las copias de un mismo intento no reemplazan el original local. Los fallos de
escritura muestran aviso y permiten continuar en memoria y exportar.

El historial anterior se conserva como práctica. La evaluación nueva no toma
mejores quizzes, bosses o lecciones completadas como evidencia de simulacro.
GCTI conserva contenido, preguntas y reglas de progreso. Los índices de los
bloques originales y sus enlaces de búsqueda se mantienen.

## Verificación técnica

```powershell
npm test
npm run build
node scripts/build-security-inventory.mjs --check
node scripts/test-security-browser.mjs
```

La última orden requiere Playwright y Chrome. `PLAYWRIGHT_MODULE_PATH` permite
usar una instalación externa, sin añadir dependencias al curso. El script sirve
el build de producción en 5175, usa un perfil aislado, bloquea servicios externos
y cierra servidor y navegador al terminar. Guarda capturas en
`node_modules/.cache/security-browser/`.

Las pruebas automáticas comprueban integridad, cuotas, exposición, corrección,
importación, plazos y conservación del estado anterior. No sustituyen la revisión
editorial ni constituyen un piloto educativo. El protocolo está en
[security-learning-pilot.md](security-learning-pilot.md).

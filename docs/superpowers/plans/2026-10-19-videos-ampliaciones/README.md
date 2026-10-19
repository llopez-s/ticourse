# Guiones de las ampliaciones prácticas · AP01–AP07

Siete guiones completos para enseñar las [ampliaciones del temario](../../../practical-curriculum.md), preparados con el patrón narrativo de Alertópolis. Cubren las doce lecciones ampliadas. La numeración AP identifica esta tanda complementaria y permite conservar las reservas V29–V38 de la serie existente.

**Estado editorial: revisados y congelados el 19-10-2026.** La congelación identifica la versión de texto para preparar la grabación; las escenas audiovisuales, el audio y la publicación corresponden a la siguiente fase. Las dos revisiones y su resolución constan en el [informe de revisión](../../../reviews/2026-10-19-videos-ampliaciones.md).

## Guiones para grabar

La columna **Grabación** contiene la hoja que lee Lidia: narración completa, indicaciones de interpretación y pausas. La **Ficha visual** detalla qué enseñar en cada escena, tarjetas, decisiones, respuesta y fuentes. El formato **Voice Studio** separa las voces y marca los silencios para quien utilice ese flujo.

| ID | Tema y grabación | Lecciones | Montaje orientativo | Ficha visual | Voice Studio |
|---|---|---|---|---|---|
| AP01 | [Identidad, permisos y tokens](AP01-tokens-correo/guion-grabacion.md) | sp4m8 | 8:25 | [Ficha](AP01-tokens-correo/ficha-produccion.md) | [Guion](AP01-tokens-correo/guion-voice-studio.md) |
| AP02 | [Infostealers: contener dispositivo e identidad](AP02-stealer-sesiones/guion-grabacion.md) | sp2m6 · sp4m10 | 8:58 | [Ficha](AP02-stealer-sesiones/ficha-produccion.md) | [Guion](AP02-stealer-sesiones/guion-voice-studio.md) |
| AP03 | [Evaluar feeds por requisito y valor nuevo](AP03-feeds-requisito/guion-grabacion.md) | s3m1 · s3m4 · s4m2 | 9:05 | [Ficha](AP03-feeds-requisito/ficha-produccion.md) | [Guion](AP03-feeds-requisito/guion-voice-studio.md) |
| AP04 | [Del hash a una relación defendible](AP04-muestra-candidatos/guion-grabacion.md) | s3m2 · s3m3 | 8:54 | [Ficha](AP04-muestra-candidatos/ficha-produccion.md) | [Guion](AP04-muestra-candidatos/guion-voice-studio.md) |
| AP05 | [Escribir y justificar una regla YARA](AP05-yara-condicion/guion-grabacion.md) | s3m5 | 8:55 | [Ficha](AP05-yara-condicion/ficha-produccion.md) | [Guion](AP05-yara-condicion/guion-voice-studio.md) |
| AP06 | [Validar YARA y entregar una detección](AP06-yara-prueba-entrega/guion-grabacion.md) | s3m5 · s5m3 | 8:58 | [Ficha](AP06-yara-prueba-entrega/ficha-produccion.md) | [Guion](AP06-yara-prueba-entrega/guion-voice-studio.md) |
| AP07 | [Medir infostealers y decidir relevancia](AP07-stealers-metricas/guion-grabacion.md) | s4m4 · s5m5 | 8:56 | [Ficha](AP07-stealers-metricas/ficha-produccion.md) | [Guion](AP07-stealers-metricas/guion-voice-studio.md) |

El conjunto ronda los **62 minutos de montaje** y contiene 7.973 palabras de narradora. Las duraciones son presupuestos: 2,5 palabras por segundo, pausas, intercepciones y cinco segundos de lectura para cada tarjeta. La estimación estándar del motor cubre voz y pausas, y queda entre 7:58 y 8:40. Los 25 segundos de tarjetas por episodio se reservan en las fichas y se incorporarán al montar las escenas. La grabación real fijará los tiempos definitivos.

## Patrón compartido

- Una narradora, segunda persona y tono de conversación. Cada episodio presenta su organización y su problema.
- Cinco conceptos principales, cinco capítulos y diez escenas. La promesa aparece al inicio.
- Dos mensajes interceptados, con respuesta de la narradora y firma del adversario de la pista.
- Dos decisiones con una pausa de 4,5 segundos. La solución aparece después de la pausa.
- Cinco tarjetas rotuladas **PRÁCTICA COMPLEMENTARIA**, después de explicar el concepto. Sus entradas quedan ancladas al último segmento de la escena en `learningCard.afterSegment`.
- Cierre con tres reglas y una actividad concreta en la lección.
- Datos ficticios identificados y descargo de la pista: sin afiliación a CompTIA o SANS/GIAC.

Se conserva el perfil temporal y narrativo `principal-yt`. Las tarjetas propias de esta tanda están descritas en `storyboard.json` y cada escena las dibuja (`LearningCard`, con velo sobre la escena y sin insignia de examen). Su lectura se mantiene en la pausa que sigue al último segmento de la escena: `pauseAfterMs` pasa de 600 a 5.600 ms en esas cinco escenas (el validador del motor admite ahora hasta 6.000 ms), de modo que el timeline reserva los 5 s sin tocar el texto que lee Lidia. Los JSON contienen cero campos `exam`/`question`, de modo que estas ampliaciones no reciben insignias ni preguntas de examen.

## Casos y orden recomendado

**AP01 → AP02:** Ana, Resumen del turno, Entra ID y Graph permiten seguir primero el acceso y después la respuesta a una exposición. AP02 vuelve a presentar a Ana para que también pueda verse por separado.

**AP03 → AP04:** Faro, Atlas y Eco se comparan según dos requisitos; después las fichas A/B/C/D/E permiten practicar pivotes, alternativas y confianza. Cada conjunto conserva los valores de la lección.

**AP05 → AP06:** conviene grabarlos en ese orden. El primero construye la condición del formato inerte ALRTDEMO; el segundo compila, ejecuta, interpreta los doce resultados esperados y prepara la entrega. C ya influye en el diseño: volver a probarlo es una comprobación de regresión. Para evaluar generalización se necesitan casos nuevos que no hayan influido en la regla. A/B/C de este laboratorio son distintos de los candidatos de AP04.

**AP07:** Bruma, Cobalto y Duna muestran por qué muestras, dispositivos, registros y relevancia producen conclusiones distintas. Sus cifras son sintéticas y pertenecen a la ventana del ejercicio.

Todos los escenarios son ejercicios de formación. Utilizan Halden o Meridian sin incorporar víctimas, equipos, cuentas o hechos fechados a los incidentes publicados de [GLASS HARBOR](../../canon/glass-harbor.md) y [VELVET CICADA](../../canon/velvet-cicada.md). Las firmas del adversario expresan atajos de razonamiento, sin atribuirle las familias inventadas ni convertir sus mensajes en confesiones.

## Fuentes y materiales que deben verse

La [matriz del temario y sus fuentes primarias](../../../practical-curriculum.md#fuentes-primarias-consultadas) contiene la relación completa. Contraste técnico: 19-10-2026.

- **AP01–AP02:** [participantes y autorización en Graph](https://learn.microsoft.com/en-us/graph/auth/auth-concepts), [access tokens](https://learn.microsoft.com/en-us/entra/identity-platform/access-tokens), [refresh tokens](https://learn.microsoft.com/en-us/entra/identity-platform/refresh-tokens), [ID tokens](https://learn.microsoft.com/en-us/entra/identity-platform/id-tokens), [revocación y sesiones de aplicaciones](https://learn.microsoft.com/en-us/entra/identity/users/users-revoke-access), [revokeSignInSessions](https://learn.microsoft.com/en-us/graph/api/user-revokesigninsessions) y [límites de CAE](https://learn.microsoft.com/en-us/entra/identity/conditional-access/concept-continuous-access-evaluation).
- **AP03:** tablas y criterios de [collection.ts](../../../../src/data/practical/collection.ts). Son proveedores inventados; la procedencia y el requisito forman parte del ejercicio.
- **AP04:** [modificadores de VirusTotal](https://docs.virustotal.com/docs/file-search-modifiers), [similitud](https://docs.virustotal.com/docs/file-similarity-search) y [relaciones](https://docs.virustotal.com/reference/files-relationships). Las consultas se muestran como ejemplos de sintaxis; las fichas permiten resolver el caso sin cuenta premium ni ejecución de malware.
- **AP05–AP06:** [sintaxis oficial de YARA](https://yara.readthedocs.io/en/stable/writingrules.html), [motor Python](https://yara.readthedocs.io/en/stable/yarapython.html), [reglas de referencia](../../../../public/labs/yara-practice/reference.yar) y [verificador real](../../../../public/labs/yara-practice/verify.py). El editor permite escribir; YARA Forge es una simulación por etiquetas. Una captura de terminal se rotulará como ejecución real únicamente cuando corresponda a una ejecución capturada.
- **AP07:** dataset de [analysis-yara.ts](../../../../src/data/practical/analysis-yara.ts) y distinción entre métricas de amenaza y valor del equipo en s5m5. No utiliza rankings actuales de familias reales.

## Archivos de producción y mantenimiento

Cada episodio tiene `video.json`, `narration.json`, `storyboard.json` y `lexicon.json` bajo `video/<slug>/`. La voz prevista es `recording/lidia`, con el mismo tratamiento provisional de la serie: tempo 1,08 y pausas internas máximas de 250 ms al importar. Los identificadores de composición están reservados; las composiciones Remotion se crearán durante la producción audiovisual.

Las fuentes editoriales son [episodios 01–03](episodios-01-03.mjs), [04–05](episodios-04-05.mjs) y [06–07](episodios-06-07.mjs). Para cambiar narración o indicaciones visuales se editan esas fuentes y se regeneran las hojas, evitando que una copia de grabación diverja del JSON:

```powershell
node scripts/prepare-practical-video-scripts.mjs
node scripts/prepare-practical-video-scripts.mjs --check
node video/engine/scripts/canon-check.mjs --video tokens-correo
node video/engine/scripts/build-timeline.mjs --video tokens-correo --estimate --out video/tokens-correo/out/timeline-estimate.json --transcript video/tokens-correo/out/transcript-estimate.txt
```

Una modificación sustancial exige repetir las revisiones antes de grabar y actualizar la fecha de congelación. `--freeze=AAAA-MM-DD` fija esa fecha después de aplicar las revisiones y leer los informes de canon, según el [orden de producción de la serie](../2026-09-25-lesson-videos.md#8-flujo-de-producción-por-vídeo-recetario).

La [validación estructural](validacion-estructural.json) resume palabras, segmentos, tiempos, errores y avisos. Los informes detallados de canon y las estimaciones temporales se regeneran en `video/<slug>/out/`. El informe de revisión conserva la interpretación humana de sus coincidencias.

## Estado de producción de las escenas

| ID | Composición | Escenas | Póster |
|---|---|---|---|
| AP01 | `PracticaAP01` | 10 escenas dibujadas y revisadas con fotogramas sobre el timeline estimado | `PracticaAP01Poster` |
| AP02–AP07 | reservadas | pendientes | pendientes |

Los fotogramas se revisan con `node video/engine/scripts/qa-frames.mjs --video <slug> --extra <frames>`. Falta, por episodio: grabación de Lidia, `import-recording`, `audio.mjs`, render y masterización.

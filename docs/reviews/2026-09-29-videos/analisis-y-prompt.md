# Mejoras sencillas para los próximos vídeos de Alertópolis

Fecha: 29 de septiembre de 2026.

La prioridad es facilitar que el espectador sepa qué va a aprender, dónde mirar y cuándo pensar. La identidad visual, la historia del caso, los diagramas y los subtítulos ya dan una base consistente; los cambios con mayor utilidad son de guion, jerarquía visual y tiempos.

## Material revisado y alcance

Se revisaron guiones, storyboards, timelines y componentes. Para los dos últimos vídeos terminados se extrajeron seis fotogramas de cada MP4; para el trabajo más reciente se revisaron seis imágenes de QA existentes.

| Vídeo | Material | Datos del timeline |
| --- | --- | --- |
| Defensa en capas, `capas-halden` | MP4 local con voz de Lidia y efectos; guion y timeline en modo audio | 9:08; 10 tarjetas de examen; 2 preguntas; 3 mensajes del adversario |
| Diamond Model, `diamond-e7` | MP4 final localizado en el worktree `video-diamond-e7`; guion y timeline en modo audio | 7:54; 9 tarjetas de examen; 2 preguntas; 3 mensajes del adversario |
| Pivotes de infraestructura, `pivot-infra` | Guion, storyboard y capturas de QA del borrador | 8:13 estimados; 7 tarjetas; 2 preguntas; 3 mensajes. El timeline revisado sigue en modo `estimate`; la duración no es la de un MP4 final |

La revisión visual es por muestras. Se midió también la sonoridad de ambos MP4 con el filtro `loudnorm` de FFmpeg. No se ha realizado una escucha completa ni se dispone de métricas de retención, clics o comprensión de YouTube. Las propuestas son hipótesis editoriales que conviene comprobar en el siguiente vídeo; no permiten afirmar por sí mismas que aumentarán la retención.

## Hallazgos y mejoras, por prioridad

### 1. Dar tiempo real para responder

Las preguntas permanecen aproximadamente 2,17–2,27 segundos en el timeline. La entrada y salida de la tarjeta consumen otros 22 fotogramas: a 30 fps quedan alrededor de 1,43–1,53 segundos con la tarjeta plenamente asentada. Es poco para leer «SPF y DKIM pasan. ¿Qué falló entonces?» y pensar la respuesta.

**Cambio propuesto:** mantener dos preguntas por vídeo principal, con 3–4 segundos efectivos para pensar después de terminar de plantearlas. Mostrar después la respuesta y una razón breve. Una pregunta corta con dos opciones reduce el esfuerzo de lectura. Durante ese momento, dar prioridad a la pregunta y al dato necesario para resolverla.

**Implementación:** `think.holdMs` en `narration.json`, teniendo en cuenta las animaciones de `ThinkPrompt.tsx`. El validador actual de `scripts/lib/narration.mjs` limita este campo a 1800–2500 ms: ampliar ese límite y su prueba es un pequeño cambio necesario para admitir pausas más largas. Introducir directamente 4000 ms sin adaptar la validación produciría un error.

### 2. Ampliar el dato que importa y mostrarlo por pasos

En las muestras de «Diamond Model» a 01:55 y 03:35 conviven registros, vértices, etiquetas y subtítulos; en «Defensa en capas» a 01:04 y 05:40 aparecen varias líneas de correo, autenticación o procesos. El concepto general se distingue, pero los detalles relevantes se leen con dificultad al reducir el vídeo. En «Pivotes», la escena de certificados y el resumen también reúnen muchos elementos.

**Cambio propuesto:** cuando se explica una línea del log, un dominio o una conexión, ampliar ese elemento y atenuar el resto. Revelar primero la evidencia, después su interpretación y por último la regla que debe recordarse. Mantener el diagrama completo como referencia, pero evitar exigir que se lea entero a la vez.

**Implementación:** reutilizar paneles, resaltados y animaciones existentes. Como punto de partida, usar 48–60 px a 1080p para texto imprescindible, sujeto a la comprobación real a 480 px de ancho. El texto ambiental puede seguir siendo pequeño si entenderlo no es necesario. Revisar subtítulos, tarjetas y datos juntos; el tamaño de fuente por sí solo no garantiza la legibilidad.

### 3. Presentar antes la utilidad del vídeo

La escena inicial dura unos 35 segundos en «Defensa en capas» y 44 en «Diamond Model». El cue del título principal aparece a 00:22 y 00:38 respectivamente. Ambos empiezan con un caso, lo cual funciona, pero se puede expresar antes la habilidad que aprenderá el espectador. «Pivotes» abre con «¿Te acuerdas de E7…?», que presupone haber visto el vídeo anterior.

**Cambio propuesto:** en los primeros 8–12 segundos, presentar el problema y una promesa concreta. Introducir el nombre del tema pronto y explicar en una frase el contexto indispensable del episodio anterior.

Ejemplo para Diamond Model: «Esta alerta te dice que algo pasa, pero te faltan piezas. Vamos a organizarla en cuatro preguntas y decidir por dónde investigar».

Ejemplo para Pivotes: «Esta IP lleva a catorce mil dominios. Vamos a elegir una pista que reduzca el ruido, usando un certificado que ya apareció en una alerta anterior».

### 4. Consolidar la narración hablada que ya empieza a aplicarse

Los guiones de «Defensa en capas» y «Diamond Model» tienen dos puntos en 33 de 59 y 32 de 50 segmentos respectivamente. Esto es un indicador de escritura esquemática, no una prueba de cómo suena la grabación. El guion de «Pivotes» ya tiene cero segmentos con ese signo como parte del texto, evita leer identificadores y explica sus analogías con más continuidad.

**Cambio propuesto:** conservar ese avance. Explicar primero la idea en lenguaje cotidiano y después nombrar el término técnico. Evitar listas recitadas, preguntas de fórmula y datos que solo aportan contexto administrativo. Los dominios, hashes y equipos deben ir en pantalla; la voz puede decir «este dominio», «la misma huella» o «el equipo de ingeniería».

No hace falta acelerar toda la grabación. Ajustar pausas innecesarias y escuchar una escena representativa antes de fijar el tempo; el proyecto ya dispone de controles para ello. Conservar aire ante una evidencia nueva o una decisión.

### 5. Reducir la competencia entre tarjetas y explicación

Los vídeos terminados incluyen 9–10 tarjetas de examen. «Pivotes» baja a 7 y ya entra en el rango de 5–8 del perfil actual `principal-yt`. Los mensajes del adversario aportan continuidad narrativa; su duración en pantalla incluye también la respuesta de la narradora, por lo que no equivale a tiempo muerto.

**Cambio propuesto:** mantener 5–8 tarjetas en un principal, una regla por tarjeta, y colocarlas cuando ya se haya entendido el ejemplo. Evitar que una tarjeta nueva compita con el momento de leer un log o comparar dos valores. Los mensajes del adversario deben introducir un error concreto que la explicación corrige; acortar los que solo repiten la historia. Cerrar con tres decisiones prácticas y una única acción siguiente.

### 6. Mantener un volumen consistente entre episodios

En los archivos locales analizados, «Defensa en capas» mide −24,22 LUFS integrados y −3,03 dBTP; «Diamond Model» mide −14,07 LUFS y −0,84 dBTP. La diferencia de sonoridad integrada es de unos 10 LU. Son mediciones de los MP4 locales: no describen necesariamente el nivel que aplica YouTube durante la reproducción.

**Cambio propuesto:** usar en todos los próximos vídeos el mismo objetivo de masterización, alrededor de −14 LUFS y pico verdadero máximo de −1 dBTP, y volver a medir el archivo después de codificarlo. El pequeño exceso de pico del Diamond local muestra por qué conviene comprobar el MP4 entregable, además de la mezcla previa. Mantener la voz clara por encima de la música y los efectos.

**Implementación:** aprovechar `video/engine/scripts/master_mix.py`, que ya existe. No requiere cambiar de voz ni contratar otro servicio. Esta medición no permite evaluar por sí sola timbre, dicción o si un efecto distrae: eso exige una escucha.

## Prompt reutilizable

```text
Prepara el próximo vídeo de Alertópolis sobre [TEMA], para la lección [LECCIÓN] y con formato [PRINCIPAL O CÁPSULA].

Usa el motor Remotion y los componentes actuales. Conserva la identidad visual, el caso narrativo, el canon del curso y la precisión técnica. Prioriza mejoras pequeñas de guion, composición y tiempos que podamos implementar en la producción habitual.

1. Abre con un problema concreto y explica en los primeros 8–12 segundos qué sabrá hacer el espectador al terminar. Presenta pronto el tema. Si continúas otro episodio, resume en una frase la evidencia necesaria para que también se entienda por separado.

2. Limita el contenido a 4–6 conceptos principales, o 2–3 en una cápsula. Para cada uno, sigue esta secuencia: idea sencilla, ejemplo visible, término técnico y decisión práctica. Deja el detalle secundario en la lección escrita.

3. Escribe como si lo explicaras a una persona. Usa frases naturales, conectores hablados y una analogía cuando aclare el concepto. Evita listas recitadas y preguntas repetitivas. Los dominios, IP, hashes y nombres de equipos van en pantalla; la voz señala su función y lo que importa de ellos.

4. En cada momento debe estar claro dónde mirar. Amplía la fila, valor o conexión que se está explicando y atenúa el contexto. Revela evidencia, interpretación y conclusión por pasos, sincronizados con la voz. Comprueba a 480 px de ancho que se lea lo imprescindible sin pausar; usa como referencia 48–60 px a 1080p para las etiquetas clave.

5. Mantén las preguntas previstas por el formato: dos en un principal y una en una cápsula. Plantea una decisión breve y deja 3–4 segundos efectivos para pensar, después de terminar de formularla y descontando la animación. Luego muestra la respuesta y su motivo. Si el motor limita esa pausa, adapta la validación y su prueba para admitirla.

6. Usa las tarjetas de examen del perfil actual: 5–8 en un principal y 3–5 en una cápsula, con una regla breve por tarjeta. Muéstralas después de comprender el ejemplo. Evita acumular texto nuevo, una tarjeta y un log que haya que leer al mismo tiempo. Usa al adversario para mostrar un error concreto y corregirlo; recorta las intervenciones que no aporten una idea.

7. Ajusta el ritmo escuchando una escena representativa. Recorta pausas innecesarias, pero conserva tiempo para comprender las evidencias. Mantén la voz por encima de música y efectos. Usa la masterización existente para mantener un nivel uniforme entre episodios, alrededor de −14 LUFS y con pico verdadero máximo de −1 dBTP; comprueba el MP4 después de codificarlo. Cierra con tres reglas prácticas y una sola acción siguiente: una pregunta, un laboratorio o la siguiente lección.

Entrega el guion y el storyboard, indicando qué aparece en pantalla, qué se resalta y qué tiempos requieren atención. Antes del render final, revisa una escena densa a tamaño móvil, una pregunta completa y el cierre. Comprueba que los cambios son compatibles con el motor, que los subtítulos están sincronizados y que las analogías no simplifican el contenido hasta hacerlo incorrecto.
```

## Muestras visuales

- [Defensa en capas: seis fotogramas del MP4](capas-halden-muestra.jpg).
- [Diamond Model: seis fotogramas del MP4 final](diamond-e7-muestra.jpg).
- [Pivotes: seis capturas de QA del borrador](pivot-infra-muestra.jpg). Algunas capturas corresponden a transiciones o a texto en proceso de aparecer; no se consideran fallos del resultado final.

## Fuentes locales

- `video/{capas-halden,diamond-e7,pivot-infra}/{narration.json,storyboard.json,src/timeline.json}`.
- `video/engine/src/overlay/{ThinkPrompt.tsx,Captions.tsx,ExamCueLayer.tsx,InterceptLayer.tsx}`.
- `video/engine/scripts/{build-timeline.mjs,lib/narration.mjs,lib/profiles.mjs}`.
- `video/engine/scripts/master_mix.py`; medición de ambos MP4 con `ffmpeg -af loudnorm=I=-14:TP=-1:LRA=11:print_format=json -f null -`, tomando `input_i` e `input_tp` del informe.
- MP4 de capas: `video/capas-halden/out/capas-halden-lidia-efectos.mp4`.
- MP4 de Diamond: `.claude/worktrees/video-diamond-e7/video/diamond-e7/out/diamond-e7.mp4`.
- Capturas de Pivotes: `video/pivot-infra/out/qa/`.

Este documento propone cambios para próximos vídeos. No modifica guiones, audio, timelines ni el motor de los vídeos actuales.

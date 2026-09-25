# EDR en acción

Vídeo educativo generado con JavaScript/React y Remotion. La historia, la voz y los subtítulos proceden de `script.json`; `timeline.json` contiene los tiempos medidos de los WAV. El MP4 se inserta en la lección Security+ `sp4m7`.

## Regenerar

1. Edita `script.json` si cambia el guion. Mantén los identificadores de escena (`intro`, `telemetry`, `alert`, `triage`, `scope`, `contain`, `close`).
2. En Windows con PowerShell 7 y la voz española **Microsoft Laura**, ejecuta `npm run video:audio`. Actualiza los WAV, la línea de tiempo, la transcripción y los subtítulos WebVTT.
3. Ejecuta `npm run video:render`. Comprueba los tipos y genera `public/videos/edr-blue-team.mp4` y el póster. Los WAV ya incluidos permiten volver a renderizar sin sintetizar la voz.

### Sustituir la narración

Coloca un clip MP3 o WAV por segmento en `video/edr/elevenlabs-clips/`, con el nombre exacto del ID del guion (por ejemplo, `01-intro.mp3`). También puedes usar otra carpeta con `npm run video:audio:import -- --input="RUTA"`. El importador exige los 16 clips, los convierte a WAV y vuelve a medir los tiempos de escenas, transcripción y WebVTT. Después ejecuta `npm run video:render`.

El importador añade por defecto 0,4 s de silencio entre clips. Si los clips proceden de una locución continua y ya conservan sus pausas naturales, usa `npm run video:audio:import -- --pause=0`.

Si el proveedor entrega marcas temporales por carácter, guarda junto a cada clip un archivo como `01-intro.alignment.json`. Se admite el objeto de alineación de ElevenLabs, con `characters`, `character_start_times_seconds` y `character_end_times_seconds`, directamente o bajo la clave `alignment`. El texto reconstruido debe coincidir con `script.json`; si no hay marcas, los tiempos de cada frase de subtítulos se estiman por longitud. Comprueba el resultado escuchando el video antes de publicarlo.

Los clips importados se guardan en una carpeta con versión bajo `public/videos/edr/voice/natural/`; los WAV originales de Laura permanecen intactos. `npm run video:audio` vuelve a activar Laura si hace falta. Nunca pongas claves de API en el repositorio.

### Flujo con ElevenLabs

El generador usa una voz elegida en ElevenLabs y guarda una locución continua, sus 16 cortes y la alineación por carácter. Necesita `ELEVENLABS_API_KEY` en el entorno o en el archivo local ignorado `.env.local`. Los comandos de generación consumen créditos de la cuenta.

1. Consulta las voces españolas disponibles con `npm run video:audio:elevenlabs -- --voices`, o todas con `--voices-all`. `--usage` muestra los créditos restantes. También puedes explorar la biblioteca con `--library` y añadir una voz pública con `--add=PUBLIC_OWNER_ID:VOICE_ID`.
2. Escucha una muestra breve con `npm run video:audio:elevenlabs -- --sample --voice=VOICE_ID`.
3. Cuando te convenza la voz, genera la locución completa con `npm run video:audio:elevenlabs -- --voice=VOICE_ID`. Se reutilizan las generaciones existentes con la misma voz y guion; `--overwrite` fuerza una nueva generación y consume créditos otra vez.
4. Importa los cortes conservando sus pausas naturales con `npm run video:audio:import -- --pause=0`.
5. Ejecuta `npm run video:render` y escucha el MP4 completo antes de publicar.

El modo `--segments` genera cada frase por separado si la locución continua no da buen resultado. Deja los clips en `video/edr/elevenlabs-segmented/`; impórtalos con `npm run video:audio:import -- --input=video/edr/elevenlabs-segmented`. La locución continua deja los cortes en `video/edr/elevenlabs-clips/`. El MP4 y los WAV utilizados para reproducirlo están bajo `public/videos/`.

En el plan gratuito, ElevenLabs permite usar voces prediseñadas por API, pero bloquea las voces de la biblioteca y Voice Design por API. Para esas voces hay que usar un plan que habilite la API o generar el MP3 desde la interfaz web e importarlo. El generador ofrece `--design` y `--create=N` para diseñar y guardar una voz propia cuando la cuenta tenga acceso a Voice Design por API. La clave permanece solo en el entorno o `.env.local` y no debe incorporarse al código.

El [plan gratuito de ElevenLabs](https://help.elevenlabs.io/hc/en-us/articles/13313564601361-Can-I-publish-the-content-I-generate-on-the-platform) exige uso no comercial y atribución a `elevenlabs.io` o `11.ai` en el título al publicar. Para un curso comercial, genera el audio durante una suscripción con licencia comercial; contratarla después no cambia los derechos del audio generado antes.

En Windows, cierra la lección si el video está abierto antes de volver a renderizar: el reproductor puede mantener bloqueado el MP4 anterior.

El resultado es 1280 × 720, 30 fps, H.264/AAC. Los subtítulos están integrados en la imagen para que también aparezcan en el MP4 descargado. La lección muestra además el WebVTT como texto adaptable debajo del reproductor para facilitar la lectura en móvil. Remotion instalará su navegador y codificador si no están disponibles localmente.

## Criterios editoriales

El caso de Puerto de Halden es ficticio. Una alerta requiere triaje; las coincidencias en otros equipos requieren contexto; el aislamiento se decide según la evidencia y el procedimiento. La visibilidad del EDR depende de los equipos incorporados y de sensores sanos.

Fuentes de referencia: [Microsoft Learn, EDR](https://learn.microsoft.com/en-us/defender-endpoint/overview-endpoint-detection-response) y [revisión de alertas](https://learn.microsoft.com/en-us/defender-endpoint/review-alerts).

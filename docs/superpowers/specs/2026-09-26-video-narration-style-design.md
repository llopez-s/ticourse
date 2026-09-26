# Vídeos de lección: narración con chispa, voz con emoción y publicación en YouTube

**Fecha:** 2026-09-26 · **Estado:** aprobado por Lidia (2026-09-26). El alcance se limita a los vídeos nuevos.

## 1. Objetivo y alcance

Los vídeos actuales son rigurosos, pero densos: cada frase mete dos o tres datos nuevos y suena a texto escrito
leído en voz alta. La voz de edge-tts (Elvira) suena bien, pero es monótona. La app está gamificada: aprender
tiene que ser divertido.

Este diseño cambia **cómo se hacen los vídeos nuevos** (V1 EDR rehecho, V3, V4 y siguientes):

1. una guía de narración «con chispa» que no sacrifica el rigor;
2. vídeos más largos para que quepa esa chispa sin recortar contenido;
3. mensajes interceptados del adversario de la sección, en pantalla;
4. una voz con emoción: ElevenLabs si hay crédito y, si no, Chatterbox en local;
5. publicación en un canal público de YouTube, en lugar de guardar el MP4 en el repo;
6. la app y el canal pasan a llamarse **Alertópolis** (§6.6).

**Fuera de alcance:**
- **Los tres vídeos publicados** (SIEM, EDR y forense): ni rehacerlos, ni subirlos al canal, ni volver a
  renderizarlos. Se quedan como están en la app. Lidia los retomará más adelante; ver §6.4.
- **Migrar su alojamiento.** Ya están en el historial de git, así que moverlos no reduciría el repo.
- **Shorts verticales.** Son la palanca de crecimiento más clara para el canal, pero merecen su propio diseño.
- **Monetización.** No es compatible con el plan gratis de ElevenLabs; ver §5.3.

## 2. Guía de narración

Estas reglas pasan a la sección «Estilo común» del plan de vídeos
(`docs/superpowers/plans/2026-09-25-lesson-videos.md` §1) y al README del motor, para que las hereden todos los
vídeos.

### 2.1 Reglas

1. **Una idea nueva por frase.** Frases de unas 20 palabras como mucho. Nada de enumeraciones con punto y coma:
   una lista de más de tres elementos se reparte en varias frases o se lleva a la pantalla.
2. **Te habla a ti.** En segunda persona. Al menos una pregunta por escena, contestada enseguida.
3. **Una imagen por concepto clave.** Cada concepto clave lleva una analogía cotidiana o una imagen concreta
   («un pequeño programa que lo reenvía todo»).
4. **Humor en el marco, nunca en el dato.** La ironía, los guiños y los remates van en las frases que presentan
   o comentan. La frase que transmite el dato va limpia y literal. El texto de las tarjetas de examen no se
   adorna.
5. **Remate con respiro.** Después de un chiste o de una revelación, `pauseAfterMs` sube a 600–900 ms.
6. **Emoción variada.** Se usan las etiquetas `<…>` de ElevenLabs (Chatterbox también las usa; ver §5.2) sin
   repetir la misma en dos segmentos seguidos.
7. **La historia manda.** Halden / GLASS HARBOR en Security+ y VELVET CICADA en GCTI. El adversario provoca y la
   analista responde (§4).

### 2.2 Ejemplo

Antes (SIEM `s02-02`, 20 palabras):

> Servidores y estaciones envían por agente; firewalls y switches, por syslog; la nube, por API; y los routers
> exportan NetFlow.

Después (unas 55 palabras, los mismos datos):

> ¿Cómo llegan los logs al SIEM? Depende de quién hable. Servidores y estaciones llevan un agente: un pequeño
> programa que lo reenvía todo. Firewalls y switches no suelen admitir agentes, así que hablan syslog. La nube
> contesta por API. ¿Y los routers? Esos no te cuentan qué se dijo, solo quién habló con quién y cuánto: NetFlow.

### 2.3 Salvaguardas de rigor

- **El revisor de exactitud** (subagente de solo lectura, antes de sintetizar la voz) comprueba también que
  ninguna analogía ni ningún chiste falsee el concepto. Una analogía que simplifica en exceso se corrige o se
  quita.
- **Validador del motor** (`analyzeNarration`). Frase de más de 22 palabras: el aviso ya existe para todos los
  perfiles. Los perfiles `-yt` activan además, **solo como avisos, no errores** (así los vídeos antiguos no se
  llenan de avisos):
  - dos segmentos seguidos con la misma etiqueta de emoción;
  - escena sin ninguna pregunta;
  - `;` en el texto hablado.

## 3. Duración y perfiles

La velocidad de habla no cambia (~2,4 palabras/s en `wordBudget`). Lo que crece es `targetSec`, para que cada
idea tenga sitio.

Los perfiles `principal` y `capsula` **no se tocan**: los usan el SIEM y el forense, y cambiarlos rompería su
regresión (el SIEM dura 325 s). Se añaden dos perfiles nuevos en `scripts/lib/profiles.mjs`, `principal-yt` y
`capsula-yt`. Ese perfil implica también el destino YouTube. Los vídeos nuevos usan estos:

| | `principal` → `principal-yt` | `capsula` → `capsula-yt` |
|---|---|---|
| Duración renderizada (`minTotalSec`–`maxTotalSec`) | 280–340 s → **380–500 s** | 140–200 s → **190–260 s** |
| Tarjetas de examen | 8–11 (sin cambios) | 4–6 (sin cambios) |
| Pausas para pensar | 2 (sin cambios) | 1 (sin cambios) |
| Mensajes interceptados (§4) | **2–4, máx. 1 por capítulo** | **1–2** |
| Tamaño del MP4 | ya no hay objetivo de repo: se sube a YouTube (§6) | igual |
| crf | 23 → **18** (YouTube vuelve a codificar; subir más calidad) | 27 → **18** |

Los MP4 de los vídeos de YouTube **no se copian a `public/videos/` ni se commitean**. Se quedan en
`video/<slug>/out/`, que está ignorado por git. Se pueden volver a renderizar cuando haga falta, porque los clips
de voz y el timeline sí están versionados.

`render.mjs` mantiene sus comprobaciones de duración, códec y sincronía A/V. En los perfiles `-yt`, la de tamaño
pasa a ser solo un aviso.

## 4. Mensaje interceptado del adversario

Es un nuevo tipo de aviso en pantalla. **No tiene voz.** Un mensaje del adversario de la sección aparece como
interceptado, se escribe letra a letra y, a continuación, la narradora le responde con la explicación.

### 4.1 Datos

- **`video.json`**: `"adversary": "SILENT PAGER"`. Es el adversario de la sección del vídeo:
  `src/data/secplus/sections.ts` en Security+ y `src/data/course-gcti.ts` en GCTI. Solo es obligatorio si
  algún segmento usa `intercept`.
- **Segmento de `narration.json`**: `"intercept": { "text": "Borro el log del servidor y aquí no ha pasado nada.", "holdMs": 3500 }`.
  - `text`: 70 caracteres como máximo, sin flechas ni emoji ni los símbolos prohibidos de las tarjetas de
    examen. No se locuta.
  - `holdMs`: entre 2500 y 4500. Es un silencio **antes** del audio del segmento, para que dé tiempo a leer el
    mensaje. La tarjeta sigue visible hasta que termina el segmento.

### 4.2 Validación (`analyzeNarration`)

- **Errores:**
  - más de 1 mensaje por capítulo;
  - un mensaje en la escena final;
  - `text` o `holdMs` fuera de rango;
  - hay `intercept` pero `video.json` no tiene `adversary`.
- **Aviso:** el recuento del vídeo queda fuera del rango del perfil (§3).

### 4.3 Timeline y render

- **`build-timeline.mjs`**:
  - añade `leadFrames` al segmento: el audio empieza después del silencio;
  - genera la lista `intercept[]` con `from`, `durationInFrames`, `text` y `adversary`, igual que ya hace con
    `think[]`;
  - la clave `intercept` **solo se escribe cuando hay alguno**. Así el `timeline.json` del SIEM y el del forense
    siguen siendo byte a byte idénticos, y `validate-timeline` la trata como opcional.
  - Los subtítulos no incluyen el mensaje, porque no es voz. La transcripción sí lo incluye, como
    `[Mensaje interceptado · SILENT PAGER] …`, porque es contenido.
- **Nuevo overlay `src/overlay/InterceptLayer.tsx`**:
  - una tarjeta tipo terminal, con acento rojo, el nombre del adversario y el efecto de escritura;
  - la posición no pisa los subtítulos ni la tarjeta de examen;
  - se añade a `OverlayGallery` para la QA.

## 5. Voz

### 5.1 Regla de elección (por vídeo, al producirlo)

1. Se calculan los caracteres hablados del guion, que `tts-elevenlabs.mjs` ya cuenta.
2. Se consulta `getSubscription()` (`video/engine/scripts/lib/elevenlabs.mjs`).
3. Si el crédito restante es al menos los caracteres del guion × 1,15 (margen para repetir tomas): **ElevenLabs
   v3 con Sarah** (`EXAVITQu4vr4xnSDxMaL`, la voz del SIEM) y las etiquetas `<…>` como indicaciones.
4. Si no: **Chatterbox `es-es/default`**, en local.
5. Un vídeo nunca mezcla motores.

Un principal de 7 min son unos 6.500 caracteres. Con el plan gratis (10.000 al mes) sale, como mucho, uno al mes
con ElevenLabs. La fecha de renovación la da `getSubscription()`; la última consulta indicó el 2026-10-25.

### 5.2 Chatterbox con emoción

Hoy Chatterbox recibe el texto sin etiquetas y aplica un único `exaggeration` a todo el vídeo, por eso sale
plano. El cambio:

- **La etiqueta de cada segmento se traduce en `exaggeration` y `cfg_weight`**, mediante una tabla en el motor:

  | Registro | Etiquetas | `exaggeration` | `cfg_weight` |
  |---|---|---|---|
  | Sereno | `calm`, `serious`, `steady`, `grave`, `focused`, `firm`, `concerned`, `warning`, `ominous`, `tired`, `sighs` | 0.40 | 0.50 |
  | Neutro | sin etiqueta, `clear`, `thoughtful` | 0.50 | 0.50 |
  | Cálido | `curious`, `intrigued`, `confident`, `warm`, `warmly`, `satisfied`, `relieved`, `reassuring`, `casual`, `engaging` | 0.60 | 0.45 |
  | Vivo | `enthusiastic`, `cheerful`, `mischievously`, `sarcastic`, `urgent`, `suspicious`, `emphatic`, `tense` | 0.75 | 0.35 |

  **Qué etiqueta decide:** la primera dirección del segmento y, dentro de ella («serious, warning»), la primera
  palabra que esté en la tabla.

  Si una etiqueta no está en la tabla, se aplica el registro neutro y se avisa.
- **Cambio en el worker (`chatterbox_worker.py`).** Hoy lee `exaggeration` y `cfgWeight` una sola vez para toda
  la ejecución. Pasa a leerlos **por job**, con los del spec como valor por defecto.
  - No hace falta volver a preparar los condicionales. `ChatterboxMultilingualTTS.generate()` (chatterbox-tts
    0.1.7, `mtl_tts.py`) ya rehace `conds.t3.emotion_adv` cuando `exaggeration` cambia entre llamadas;
    comprobado en el código instalado el 2026-09-26.
- **Apagado:** `narration.json` → `"chatterbox": { "moods": false }` vuelve a un único `exaggeration`/`cfg_weight`
  para todo el vídeo.
- **La caché por segmento incluye esos dos valores**, así que cambiar la emoción de un segmento vuelve a
  sintetizar solo ese segmento.
- **Antes del primer vídeo con Chatterbox se hace una audición:** el párrafo de §2.2 en los cuatro registros.
  Lidia la escucha y aprueba la tabla, o se ajustan los valores.

**Trabajo previo que se adopta.** En el árbol hay trabajo de Chatterbox del 2026-09-25 sin commit:
`tts-chatterbox.mjs`, el worker de Python, sus tests y cambios en `narration.mjs`, `audio.mjs` y el README.
No hay ninguna sesión trabajando en él. Se revisa, se pasan sus tests y se commitea en la rama de este trabajo,
antes de añadirle la tabla de emociones.

### 5.3 Licencias

- **ElevenLabs, plan gratis:** uso no comercial y con atribución. Lleva «Voz: ElevenLabs» en los créditos del
  vídeo y en la descripción de YouTube. **El canal no se monetiza** mientras haya audio del plan gratis.
- **Chatterbox:** licencia MIT. El audio lleva la marca de agua inaudible Perth. El crédito es opcional; se pone
  por transparencia.
- **edge-tts (Elvira):** usa sin clave el servicio de lectura en voz alta de Edge. Sus condiciones no dejan
  claro que se pueda publicar ese audio: zona gris. Ya no se usa en vídeos nuevos. Afecta al vídeo forense
  publicado (§6.4).

## 6. YouTube

### 6.1 Canal

- **Canal público «Alertópolis»**, handle `@Alertopolis`. Es el mismo nombre que pasa a llevar la app (§6.6).
  El nombre del canal no depende del de la cuenta de Google de Lidia.
- **Comprobación del nombre (2026-09-26):**
  - la web no muestra ningún uso;
  - el handle `@Alertopolis` estaba libre;
  - TMview no tiene ninguna marca, verificado con una búsqueda de control entre consultas.

  Los descartes y sus motivos están en la conversación de esa fecha: IntelForge, Modo Analista, Vigía Azul,
  Ciberkata, Sherlog y otros. No es un dictamen legal; si el canal crece, conviene registrar la marca en la
  OEPM, clase 41.
- **Cuenta verificada por teléfono**, para poder subir miniaturas personalizadas.
- **Una lista de reproducción por pista** (Security+ SY0-701 y GCTI), ordenada por dominio.

### 6.2 Metadatos generados: `scripts/youtube-meta.mjs --video <slug>`

Escribe `video/<slug>/out/youtube.md`, listo para copiar, con:

- **Título** (≤100 caracteres). Primero el término que se busca, después el examen:
  `SIEM explicado: del ruido a la evidencia | Security+ SY0-701 en español`.
- **Descripción:**
  - un gancho de dos líneas;
  - capítulos generados del timeline (`00:00 …`; YouTube exige que el primero sea 00:00, al menos 3 capítulos
    y de 10 s o más);
  - un enlace a la lección en la app (`https://llopez-s.github.io/ticourse/`);
  - los créditos de voz;
  - el descargo de la pista («no afiliado a CompTIA», «no afiliado a SANS/GIAC»);
  - 3 hashtags.
- **Etiquetas**, sacadas de los objetivos de examen y del léxico.
- **Archivos para subir:**
  - el MP4 (`out/<output>.mp4`);
  - los subtítulos en español: el VTT que ya genera `build-timeline`;
  - la miniatura: el póster PNG, que ya sale a 1920×1080. El script comprueba que pese menos de 2 MB.

### 6.3 Publicación

- **Lidia inicia sesión en YouTube Studio en su Chrome.** Claude nunca recibe ni escribe la contraseña.
- **Claude, con Claude in Chrome:**
  - sube el MP4 y rellena título, descripción, etiquetas, lista, subtítulos y miniatura;
  - marca «No es contenido para niños»;
  - **se detiene antes de «Publicar» y pide confirmación en el chat, vídeo a vídeo.**
- **Se descarta la API de YouTube**: los vídeos subidos desde un proyecto de API sin auditar quedan bloqueados
  como privados.

### 6.4 Los tres vídeos ya publicados: fuera de alcance por ahora

Por decisión de Lidia, este trabajo solo toca los vídeos nuevos. Los tres publicados siguen en la app como están,
reproduciéndose desde GitHub. Notas para cuando se retomen:
- **Forense:** la voz es Elvira, zona gris para publicarla en YouTube (§5.3).
- **Nombre antiguo:** los tres llevan «IntelForge Academy» en el póster y en la tarjeta final.
- **SIEM y EDR:** la voz de ElevenLabs del plan gratis exige el crédito en la descripción.

### 6.5 Bloque de vídeo en la app

- **Tipo `Block`**: se añade la variante
  `{ t: 'video'; title; youtube: string; poster; transcript }`, con `youtube` = ID de 11 caracteres. La variante
  MP4 actual no cambia.
- **`VideoBlock`**:
  - con `youtube`, muestra el póster con un botón de reproducir (fachada) y **solo al pulsar** carga
    `https://www.youtube-nocookie.com/embed/<id>?autoplay=1&rel=0&cc_load_policy=1&cc_lang_pref=es&hl=es`:
    hasta ese clic no se envía nada a Google;
  - debajo, «Ver en YouTube» y la transcripción desplegable, como ahora. Sin enlace de descarga.
- **El póster y la transcripción siguen en `public/videos/`**, porque pesan poco.
- **Tests de `content.test.ts`:**
  - el ID cumple `^[A-Za-z0-9_-]{11}$`;
  - el póster y la transcripción existen;
  - ningún ID ni recurso se repite;
  - las comprobaciones de los bloques MP4 no cambian.
- **Búsqueda (`src/lib/courseSearch.ts`):** indexa solo `block.title`, así que funciona igual con las dos
  variantes.

### 6.6 La app pasa a llamarse Alertópolis

- **Textos visibles:**
  - `<title>` de `index.html`;
  - la cabecera de `src/components/Layout.tsx`, que hoy pone «INTELFORGE» en dos sitios;
  - el índice de `src/pages/GlossaryPage.tsx`;
  - `README.md`.
- **Aviso de los vídeos (`TRACK_NOTICES` en `profiles.mjs`):**
  - los perfiles antiguos (`principal`, `capsula`) conservan «IntelForge Academy», para que la regresión del
    SIEM siga siendo byte a byte idéntica y coincida con lo que ya está dentro de esos MP4;
  - los perfiles `-yt` usan «Alertópolis».
- **Lo que NO cambia:**
  - las claves de guardado `intelforge-v1` (`src/lib/store.ts`) e `intelforge-sync` (`src/lib/syncStore.ts`):
    cambiarlas borraría el progreso guardado y el código de sincronización;
  - el repo `llopez-s/ticourse` y su URL de Pages;
  - el Worker `ticourse-sync`;
  - los planes y especificaciones anteriores, que son históricos.
- **Test (vitest):** el `<title>` y la cabecera dicen «Alertópolis», y las claves de guardado siguen siendo las
  mismas.

## 7. Rama y commits

- Trabajo en una rama nueva desde `origin/main`, `video-narration-style`.
- Primero se commitea el trabajo de Chatterbox adoptado (§5.2) y después cada pieza de este diseño.
- **No se hace push sin el visto bueno de Lidia**, porque un push a `main` es un despliegue.

## 8. Verificación

- `node --test "video/engine/scripts/lib/*.test.mjs"`:
  - validación de `intercept`;
  - los nuevos avisos de estilo;
  - el mapeo de emociones de Chatterbox;
  - los capítulos y el título de `youtube-meta`;
  - `leadFrames` en el timeline.
- `python -m unittest discover -s video/engine/scripts -p "test_*.py"` (worker de Chatterbox).
- `npm test` (vitest, incluidos los bloques `youtube`), `tsc` y `npm run build`.
- **Regresión del SIEM:** timeline, transcripción y VTT byte a byte idénticos. Ningún vídeo publicado usa
  `intercept`, así que no deben cambiar.
- **QA visual:** `OverlayGallery` renderizada con `qa-frames` (tarjeta de intercepción junto a subtítulos y
  tarjeta de examen).
- **Vista previa** (`intelforge-dev`), con un bloque `youtube` temporal, no commiteado, que apunte a un vídeo
  público cualquiera:
  - la fachada no carga nada de YouTube antes del clic (se comprueba en las peticiones de red);
  - reproduce al pulsar;
  - modo claro, oscuro y ancho de móvil.
- **Audición de Chatterbox** (§5.2), aprobada por Lidia antes del primer vídeo que la use.

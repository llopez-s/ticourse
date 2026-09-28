# Vídeos de lección: narración hablada, menos conceptos y ritmo más vivo

**Fecha:** 2026-09-28 · **Estado:** aprobado por Lidia (2026-09-28). Sustituye la guía de narración de
`2026-09-26-video-narration-style-design.md` §2 («narración con chispa»). El resto de ese diseño (perfiles `-yt`,
mensajes interceptados, voz, YouTube) sigue vigente.

## 1. Problema

Con la guía «con chispa», capas-halden (V1) y diamond-e7 (V3) siguen sonando a texto escrito leído en voz alta.
Lidia leyó el guion tal cual (todas las frases coinciden ≥ 0,80 con la grabación), así que el problema está en
la escritura, no en la lectura:

1. **Acotaciones leídas:** «Sala de control del muelle 3.», «Madrugada del 5 de marzo en Meridian Dynamics.»
2. **El dos puntos como conector:** 32 de 59 segmentos en capas-halden y 31 de 50 en diamond-e7.
3. **La cuota de «una pregunta por escena» se volvió una fórmula:** siete preguntas «¿Y …?» en capas-halden y
   seis en diamond-e7.
4. **Conceptos usados antes de explicarlos:** en capas-halden s02, SPF y DKIM «aprueban» y DMARC «suspende» por
   «alineación» una escena antes de que se definan.
5. **Dominios, equipos y hashes deletreados:** las cinco frases que el informe de importación marcó «revisar»
   son las de «hache de ene mailer punto example», «a de eme uve doble ese cero dos», «ese ene eme pe uve dos
   ce». Cuestan de decir y no se entienden de oído.
6. **Densidad:** s10 de capas-halden mete cuatro controles en ~50 s; el vídeo dura 10:07, por encima del
   máximo del perfil (8:20).
7. **Sin repetición ni señales:** lo escrito evita repetir; lo hablado lo necesita para que se entienda.

Además, el ritmo es lento: ~2,3 palabras/s de media en la grabación de capas-halden, con ~100 s de silencio
(pausas entre segmentos, dentro de las frases, al principio y al final de cada clip).

**Alcance:** solo los vídeos nuevos (V4 y siguientes). **No se rehace ningún vídeo publicado** (decisión de
Lidia, 2026-09-28). Sus guiones sirven de ejemplo de «antes».

**Decisiones de Lidia (2026-09-28):**
- una sola narradora que habla como una persona (no dos voces, no improvisación desde una escaleta);
- menos conceptos, mejor contados, en vez de vídeos más largos;
- ningún paso extra para ella (ni toma libre previa ni repaso en voz alta): el trabajo lo hacen las reglas,
  el validador y un revisor automático;
- más rápido.

## 2. Reglas de «narración hablada»

Viven en **una sola copia**: el plan de vídeos, `docs/superpowers/plans/2026-09-25-lesson-videos.md` §1
(«Narración hablada»). El README del motor y este diseño remiten a ella.

1. **Habla, no acotes.** Cada frase tiene a alguien haciendo algo. «Sala de control del muelle 3.» pasa a
   «Estamos en el muelle tres.»
2. **Conectores hablados, no dos puntos.** «porque», «o sea», «así que», «pues», «fíjate», «es que». Como mucho
   un «:» por segmento, y en no más de un tercio de los segmentos.
3. **Primero la idea, luego el nombre.** Se explica con palabras llanas y después se nombra: «…si no es el
   mismo, suspenso. Eso es la alineación.» Ningún término se usa en la historia antes de explicarlo.
4. **Repite lo importante.** Cada concepto clave se dice dos veces, con palabras distintas. Cada capítulo
   anuncia lo que viene y cierra con un «o sea, que…».
5. **Lo que se lee no se deletrea.** Dominios, equipos, IP, hashes, correos y nombres de fichero van en
   pantalla; la voz dice qué son («el dominio del atacante», «una estación de administración»). Una excepción
   por vídeo como mucho, si el nombre es la pista central, justificada en `out/script-notes.md`.
6. **Una analogía por concepto, y se mantiene.** Nada de amontonar imágenes (lista de invitados, sello de
   lacre, portero, cámara y barco en seis minutos).
7. **Preguntas de verdad, sin cuota.** Las que se haría quien lo ve, con formas distintas. Nunca la fórmula
   «¿Y X? Pues Y» encadenada.
8. **Frases cortas, unidas como se habla.** Sigue valiendo «una idea nueva por frase» y el aviso de más de 22
   palabras, pero sin quitar los conectores: la frase corta no tiene que sonar a telegrama.
9. **La prueba del café.** ¿Se lo dirías así a una amiga tomando algo? Si no, se reescribe.

Se mantienen de la guía anterior: humor en el marco y nunca en el dato (el texto de las tarjetas de examen no
se adorna), respiro tras un remate, emociones variadas (para ElevenLabs y Chatterbox) y la historia de la
sección, con el adversario que provoca y la narradora que responde.

### 2.1 Ejemplo (capas-halden s02)

Antes:

> Sala de control del muelle 3. Lucía, de Operaciones, recibe por correo los turnos de atraque. Remite
> haldenport.example: de casa. ¿Seguro que es de casa? Abres las cabeceras: la etiqueta de envío que casi nadie
> mira. SPF da el aprobado. DKIM, también. Pero lo que validan es hdn-mailer.example, el dominio del atacante.
> […] Falló la alineación. DMARC compara el From que ve Lucía, haldenport.example, con el dominio validado. No
> coinciden: suspenso.

Después (mismos cues, misma pausa para pensar, misma tarjeta de examen):

> Estamos en el muelle tres. A Lucía, de Operaciones, le llega un correo con los turnos de atraque. Y viene de
> casa, del dominio del puerto.
> Bueno, eso parece. Pero antes de fiarte, mira las cabeceras. Son como la etiqueta de envío de un paquete, y
> casi nadie las mira.
> Hay dos comprobaciones en verde. SPF dice que el servidor tenía permiso para enviarlo. Y DKIM, que la firma es
> buena.
> Todo en orden, ¿no? Pues mira de quién es ese permiso. Y esa firma. Del dominio del atacante, no del puerto.
> Lo que falla es que no cuadran. DMARC compara el remitente que ve Lucía con el dominio que han comprobado SPF y
> DKIM. Si no es el mismo, suspenso.
> Eso es la alineación. O sea, que el correo trae dos aprobados y un suspenso… y aun así está en su bandeja.
> ¿Cómo ha entrado?

Lidia lo aprobó como «más natural». Cuesta ~30 % más palabras habladas contar lo mismo: de ahí §3.

## 3. Menos conceptos, mejor contados

- **Presupuesto del brief:** un principal explica **4–6 conceptos clave**; una cápsula, **2–3**. Cada concepto
  clave recibe explicación llana, nombre, su analogía, su momento en la historia y, como mucho, dos tarjetas de
  examen. Lo que no cabe se queda en el texto de la lección de la app; `out/script-notes.md` lista qué se quedó
  fuera y dónde está en la lección. Si una lección tiene demasiado, se parte en dos vídeos.
- **Tarjetas de examen** (`examCards` de `scripts/lib/profiles.mjs`): `principal-yt` 8–11 → **5–8**;
  `capsula-yt` 4–6 → **3–5**. Los perfiles antiguos no cambian.
- **Duración:** los rangos de `principal-yt` (380–500 s) y `capsula-yt` (190–260 s) no cambian por ahora. Si el
  primer vídeo con estas reglas queda por debajo del mínimo sin relleno, se baja el mínimo (en el mismo commit y
  con el motivo), nunca se rellena el guion.
- **Presupuesto de palabras:** `wordBudget` = `targetSec` × **2,7** palabras/s en los perfiles `-yt` (antes
  2,4), por el ritmo de §5.

## 4. Validador (`analyzeNarration`, perfiles con `chispa: true`)

Solo **avisos**, nunca errores: la naturalidad no se consigue a base de reglas automáticas, pero los tics sí se
detectan.

- **Se quita** «escena sin pregunta»: la cuota creaba la fórmula «¿Y …?».
- **Se añaden:**
  - más de un «:» usado como conector en un segmento (no cuenta una hora como 04:12);
  - «:» en más de un tercio de los segmentos del vídeo;
  - un identificador leído en voz alta (`IDENTIFIER_PATTERNS`: dominio, IPv4 —también 185.220.x.x—, nombre
    de equipo tipo ADM-WS-02, hash, correo, nombre de fichero o pipe). No saltan con 443, SNMPv3, p=none,
    SY0-701, 4.5 ni X.509;
  - más de 3 preguntas que empiezan con la misma palabra («¿y», «¿qué»…).
- **Se mantienen:** «;» en la voz y la misma emoción en dos segmentos seguidos.
- **Tests** (`chispa.test.mjs`): la muestra de §2.1 pasa sin ningún aviso de estilo; los guiones de capas-halden
  y diamond-e7 disparan todos los nuevos.

## 5. Ritmo

- **Pausas en el guion:** `pauseAfterMs` normal 250–400 ms; respiro tras un remate o una revelación 500–700 ms
  (antes 600–900).
- **Grabación propia:** `narration.json` admite `"recording": { "tempo": 1.08, "maxPauseMs": 250 }`.
  `import-recording.mjs` acorta a `maxPauseMs` cada pausa dentro de una frase (ya existía como `--max-pause`) y
  acelera cada clip con `atempo`, que conserva el tono; los tiempos de palabra se escalan con `scaleTimings`,
  el mismo cálculo que el tempo de Chatterbox. Los flags `--tempo` y `--max-pause` mandan sobre
  `narration.json`. **Sin la clave, tempo 1 y sin límite de pausas**: capas-halden y diamond-e7 se reimportan
  byte a byte igual. Rango válido del tempo: 0,8–1,25.
- **Valor para los vídeos nuevos:** tempo **1,08** y `maxPauseMs` 250, **provisional** hasta que Lidia escuche
  la audición (escena s02 de capas-halden: tal cual 46 s, pausas cortas 42 s, pausas cortas + 1,08× 39 s, pausas
  cortas + 1,15× 37 s) y elija.
- **Al grabar:** leer a ritmo de conversación, sin la pausa de lectura entre frases; el corte ya deja aire.
- **TTS:** Chatterbox ya tiene `tempo`; ElevenLabs no se toca en este diseño.

## 6. Revisor de naturalidad

Un subagente de solo lectura, **en paralelo con el revisor de exactitud** y antes de grabar o sintetizar.
Comprueba las nueve reglas de §2 y el presupuesto de §3, y devuelve los segmentos que hay que reescribir con una
propuesta para cada uno. No añade trabajo a Lidia. El revisor de exactitud sigue comprobando además que ninguna
analogía ni chiste falsee el concepto.

## 7. Documentación

- Plan §1: «Narración con chispa» pasa a «Narración hablada», única copia de las reglas; tabla de formatos con
  las nuevas tarjetas; recetario §8 con el revisor de naturalidad y el tempo.
- `video/engine/README.md`: perfiles, avisos de estilo y el tempo de la grabación propia.
- `2026-09-26-video-narration-style-design.md` §2: nota de que la sustituye este diseño.
- `CLAUDE.md`: párrafo de vídeos.

## 8. Verificación

- `node --test "video/engine/scripts/lib/*.test.mjs"`: los avisos nuevos (muestra limpia, guiones antiguos con
  avisos), `recordingSettings`, `clipArgs` con tempo (y byte a byte igual con tempo 1) y `withTempo`.
- `npm test` y `npm run build`.
- El primer vídeo con estas reglas (V4, pivot-infra) pasa `build-timeline --estimate` sin avisos de estilo
  hablado y los dos revisores.

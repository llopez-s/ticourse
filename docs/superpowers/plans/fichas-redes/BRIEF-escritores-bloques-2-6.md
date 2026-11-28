# Brief común para escribir un guion de vídeo de la pista «Redes y ENS» (bloques op2–op6)

Repositorio: la copia de trabajo `C:/Users/lidie/AppData/Local/Temp/alertopolis-voz/opo-guiones` (rama
`video-opo-guiones`, desde origin/main). Trabaja SOLO ahí. Node: en Git Bash ejecuta antes `eval "$(fnm env)"`.
Ojo: los comandos con comillas invertidas fallan en el Bash de este entorno; escribe ficheros con Write/Edit.

## Qué entregas (solo estos ficheros, nada más)

1. `video/<slug>/video.json`, `video/<slug>/narration.json`, `video/<slug>/storyboard.json`,
   `video/<slug>/lexicon.json` (copia las entradas ya conocidas de `video/vlan-arcedo/lexicon.json` y
   `video/subredes-arcedo/lexicon.json` que uses; NO inventes pronunciaciones nuevas).
2. La ficha `docs/superpowers/plans/fichas-redes/<Rnn>-<lección>.md`, con la forma de `R03-op1m3.md`.
3. NO edites `docs/superpowers/canon/arcedo.md` ni ningún otro fichero compartido: los datos nuevos del Consorcio que
   pongas en pantalla los listas en la ficha, en un apartado «Para el registro §8», y las contradicciones o huecos
   que veas, en «Para el registro §9». El coordinador los fusiona.
4. NO hagas commit. NO toques `src/`, ni otros vídeos.

## Qué leer primero (en este orden)

- `docs/superpowers/specs/2026-11-28-redes-videos-bloques-2-6-design.md` (tu fila de la tabla y las reglas §3).
- `docs/superpowers/specs/2026-11-24-redes-videos-casos-test-design.md` (reglas de la pista, §4).
- Plantillas reales: `video/vlan-arcedo/` (cápsula, congelada y grabada por Lidia: es el modelo de tono) y su ficha
  `R03-op1m3.md`, en especial «Revisiones aplicadas» y «Segunda revisión»: ahí están los errores que no hay que
  repetir. Para un principal, mira además `video/subredes-arcedo/` o `video/rutas-arcedo/` y sus fichas R02/R04.
- Las reglas de «Narración hablada» del plan `docs/superpowers/plans/2026-09-25-lesson-videos.md` §1 (busca
  «Narración hablada»), y en `video/engine/README.md` el apartado «Pregunta de examen» (campos de `question`).
- Tu lección `src/data/opo/<opNmM>.ts` ENTERA (bloques, checks y `quiz`), el agregador del bloque `src/data/opo/opN.ts`,
  los supuestos del bloque `src/data/opo/supuestos/opNs*.ts`, los labs `src/data/opo/labs-opN.ts`.
- El registro del caso `docs/superpowers/canon/arcedo.md`: §1 (reglas), §2–§6 si tocas la red, y la sección de tu
  bloque (§7b op6, §7c op3, §7d op4, §7e op2) y §9.
- El dosier de fuentes de tu bloque `docs/superpowers/sources/2026-11-2*-opN-fuentes.md` y el diseño del bloque en
  `docs/superpowers/specs/2026-11-2*-opo-opN-*-design.md`.

## Reglas que más se rompen

- **Hechos**: solo de la lección y del dosier. Nada de memoria. En op6 (ENS, RGPD/LOPDGDD, eIDAS), artículos, anexos,
  plazos y cifras tal como los da la lección; cita `path:línea` en la ficha para cada concepto. Si una frase dice algo
  que la lección no trae, no la escribas.
- **Preguntas nuevas**: 3 (cápsula) o 4–5 (principal). Ninguna copia ni parafrasea un `check` o una pregunta del
  `quiz` de la lección, ni una decisión de los supuestos del bloque. En la ficha di, para cada una, de qué ítem de la
  lección se distingue. Cuatro opciones de forma parecida, una correcta, una trampa (`trap`) que tiente de verdad, y
  que ninguna otra opción sea defendible. Pregunta llana, sin mayúsculas tipo «MEJOR». Todo en español.
- **Cálculos**: cualquier número que se calcule (minutos de caída, disponibilidad, MSS, T1/T2, tiempos de detección…)
  compruébalo con un script (`node -e` o Python) y pon el resultado en la ficha.
- **Voz**: narración hablada, 2,7 palabras/s; frases cortas, ideas antes del nombre, conectores hablados (nada de
  «dos puntos»). Direcciones IP, máscaras, nombres de host, FQDN y números largos solo en pantalla; la voz dice qué
  son. Siglas: se dicen como se pronuncian habitualmente en español; si dudas, pregunta abierta en la ficha.
- **Formato del motor**: `"profile"` `caso-yt` (240–330 s, 3 preguntas, 3–5 tarjetas `exam`, máx. 3 capítulos) o
  `caso-principal-yt` (420–600 s, 4–5 preguntas, 5–8 tarjetas, máx. 5 capítulos). `"track": "opo"`,
  `"lesson": "<opNmM>"`, SIN `"frozen"`, `"music": "Go On Going - Stayloose.mp3"`, `"credits"` como vlan-arcedo,
  `youtubeTitle` sin el sufijo (lo pone el motor) y 10–16 `tags`. `narration.json`: `"voice": "recording/lidia"`,
  `"examTiming": "sentence-end"`, `sfx` con `check`/`block` por pregunta y 3–6 efectos de momentos del caso (mira
  qué sonidos existen en `vlan-arcedo` y en `video/engine/README.md`). `objective` de preguntas y tarjetas: la
  plaquita de tu fila («Infraestructuras», «Servicios de red», «Balanceo» o «ENS y normativa»).
  `question.tag`: «pregunta tipo test · ejemplo».
- **Escena de gancho**: sello «Consorcio Provincial de Arcedo · caso de ejemplo · datos ficticios», título antes de
  los 12 s, promesa en tres chips que la voz también dice. Cierre que resume y manda a las preguntas de la lección.
- **Variedad**: no copies literalmente «Prueba tú», «Esta es de otra red», «Y cerramos con esta», «Te cuento…» ni
  «Quédate con tres cosas» de vlan-arcedo: inventa tus propias entradas y cierres.

## Lo aprendido con op2 (léelo)

- **Léxico**: puedes copiar una pronunciación que ya exista en CUALQUIER `video/*/lexicon.json` del repo (p. ej. VPN
  «uve pe ene» de fronteras-halden, MPLS de wan-wifi-arcedo); dilo en la ficha. Las que no existan, pregunta abierta.
- **Fabricantes y organismos en la voz** (Cisco, Microsoft, NIST…): mejor solo en pantalla; si la voz tiene que
  nombrarlo, pregunta abierta en la ficha.
- **La fila del diseño puede traer más temas de los que caben**: en cápsula, 2–3 conceptos; mete lo demás dentro de
  otro concepto o déjalo fuera y dilo en «Se queda fuera».
- **Preguntas que no se contestan leyendo el enunciado**: si la respuesta sale de copiar palabras del supuesto, cámbiala.
- Ve otros guiones del bloque ya escritos en `video/*-arcedo/` para no repetir imágenes ni entradas.
- op6 (ENS y normativa): cita en la ficha el artículo/anexo y `path:línea` de la lección para cada afirmación de la
  voz y de las tarjetas. Nada de plazos, cuantías ni porcentajes que no estén en la lección o en el dosier op6.

## Validar antes de terminar

```bash
eval "$(fnm env)"; cd C:/Users/lidie/AppData/Local/Temp/alertopolis-voz/opo-guiones
node video/engine/scripts/build-timeline.mjs --video <slug> --estimate
node video/engine/scripts/canon-check.mjs --video <slug>
```

La estimación tiene que caer dentro de la ventana del perfil; apunta a ~335 s o menos en cápsula (la lectura real de
Lidia es el 86–92 % de la estimación) y a ≤ 600 s en principal. Corrige todos los errores del validador; los avisos,
o se corrigen o se explican en la ficha. Después borra lo que generó la estimación y no es tuyo para entregar:
`video/<slug>/src/`, `video/<slug>/out/`, `public/videos/<slug>-*`.

## Informe final (breve)

Slug, perfil, estimación, nº de preguntas y tarjetas, lista de ficheros escritos, y preguntas abiertas para Lidia.

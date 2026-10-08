### V22 · s2m2 · Cápsula · «Courses of Action: ¿cortas o miras?»

> Propuesta del 2026-10-08, con las opciones recomendadas ya elegidas; pendiente de que Lidia diga qué cambia. Tanda 4;
> rama prevista `video-coa-precios`, desde `main`. La versión vigente de escenas y guion será
> `video/coa-precios/storyboard.json` + `narration.json`; qué se quedó fuera, en `video/coa-precios/out/script-notes.md`.
> Las decisiones, con la alternativa descartada de cada una, están en
> `docs/reviews/2026-10-08-fichas-tanda4/decisiones-V22-V23.md` (apartado V22).
>
> **La penalización del ranking manda en el diseño** (L=1, plan §3, fila 20): el Lab 2C ya clasifica ocho medidas en su
> acción, y sus ocho ítems son casi las filas de la tabla de la lección (`src/data/labs.ts:352-392`;
> `src/data/s2.ts:285-294`). El vídeo no recita los siete verbos ni clasifica nada. Cuenta lo que el laboratorio no
> practica: por qué se confunden los dos pares del examen, cómo se lee la matriz (por filas) y lo que cuesta cada
> acción visible, con una sola decisión que tomar. Continúa V13, que dejó dicho «dónde cortar» sin nombrar ninguna
> acción de la matriz.

- **Carpeta:** `coa-precios` · perfil `capsula-yt` (190–260 s renderizados; objetivo ~4:00, sin rellenar) · objetivo GCTI
  **Intrusion Analysis** (dominio del curso de S2, `src/data/course-gcti.ts:32`, y de las diez preguntas de s2m2,
  `src/data/s2.ts:390-520`); las tarjetas llevan `"objective": "Intrusion Analysis"` e insignia «GCTI» · adversario
  **GLASS VIPER** (`src/data/course-gcti.ts:36`), dos mensajes interceptados · voz `recording/lidia` con
  `"recording": { "tempo": 1.08, "maxPauseMs": 250 }` · voz del adversario: **ya existe**, la de V3, V7 y V13
  (`"adversaryVoice": { "voice": "sapi/Microsoft Pablo", "rate": 0, "fx": "machine" }`, `video/diamond-e7/narration.json:6`,
  `video/kill-chain-eslabon/narration.json`) · música de V4 a V9 (`Go On Going - Stayloose.mp3`). No hace falta voz ni
  efecto nuevos.
- **`video.json`:** `"profile": "capsula-yt"`, `"track": "gcti"`, `"adversary": "GLASS VIPER"`, `"lesson": "s2m2"`, la
  música de arriba y `"tags"`: «Courses of Action», «matriz de cursos de acción», «Cyber Kill Chain», «análisis de
  intrusiones», «intrusion analysis», «intelligence gain loss», «respuesta a incidentes», «threat intelligence»,
  «inteligencia de amenazas», «GCTI». Título de YouTube: «Courses of Action: ¿cortas o miras? | GIAC GCTI en español».
- **Ritmo:** `"examTiming": "sentence-end"`; pregunta con `think.holdMs` 4500; mensajes con `intercept.holdMs` 3500. En s05 el
  mensaje abre la escena y la pregunta llega unos segmentos después (el validador no deja los dos en el mismo segmento; V9, s08).
- **Efectos (`sfx`):** los automáticos del motor (mensaje, tarjetas, capítulos) y tres momentos con sonidos de la
  biblioteca que ya usan otros vídeos: `alarm` («alarm», la alarma de Detect), `deny` («block», la persiana que se echa) y
  `visible` («error», la celda marcada que gasta visibilidad).
- **Léxico nuevo** (formas propuestas; se confirman en la audición de Lidia, porque el léxico de verificación acepta lo
  que ella diga): `Discover` («discóver»), `Detect` («ditéct»), `Deny` («dinái»), `Disrupt` («disrópt»), `Degrade`
  («digréid»), `sinkhole` («sinkjol»). `Deceive` y `Destroy` solo salen en pantalla.
- **Duración:** suma de `s` **218 s** (como V7, V8 y V15); `wordBudget` a 2,7 palabras/s: 49, 103, 124, 92, 157 y 65 (590
  palabras). El guion se queda en **unas 550**, por debajo del presupuesto, porque lleva dos mensajes (unos 4–5 s cada
  uno entre la espera y la voz del adversario) y una pregunta de 4,5 s. Estimado de `build-timeline --estimate` ~4:10–4:15;
  con el ritmo de Lidia (V8 grabó al 92 %, V15 se espera al 93 %), **~3:50–3:55** renderizados. Dentro de 190–260. No se
  rellena. La suma predice mal (V5 salió a 0,89 veces y V4 a 1,22), así que el primer borrador se mide por los dos lados.
  Si el estimado pasa de ~255 s, se recorta en este orden: primero, en s04, la frase del ejemplo que falla (pasa a la
  pantalla); después, en s02, el ejemplo de Detect (se queda solo en pantalla); después, la frase de puente con V13 de s05; la rama de
  «si ya se llevan lo crítico» de s05 no se recorta nunca, porque es s2m2q8. Si baja de ~195 s, se alarga s03, leyendo
  la fila de Installation.
- **Inserción:** en `src/data/s2.ts`, lección s2m2, **después del tercer check** («Quarantining a host while its implant
  is actively beaconing…», `:379-388`), como último bloque de la lección y justo antes del `quiz` (`:390`), como bloque
  `youtube`:
  `{ t: 'video', title: 'Courses of Action: ¿cortas o miras?', youtube: '<id>', poster: 'videos/coa-precios-poster.png', transcript: 'videos/coa-precios-transcript.txt' }`.
  Como V9 en s4m3 y V13 en s2m1: el orden queda lección, checks, vídeo y laboratorio, porque el vídeo resume la lección
  entera (los verbos, la matriz y el precio) y acaba mandando al Lab 2C. Descartado ponerlo antes de los checks, como V3,
  V7 y V15: el primer check es literalmente la pregunta del sinkhole (`:355-367`) y la pregunta del vídeo la
  contestaría. Todo lo que enseña ya lo ha presentado la lección antes de ese punto (tabla `:285-294`, nota de examen
  `:297-301`, resiliencia `:303-305`, intelligence gain/loss `:306-315`, matriz `:316-353`). Se fija en la suite
  `lesson videos` de `src/data/content.test.ts` (`:267-296`), junto a los demás.
- **Lo que se lee no se deletrea:** los dominios (`update-svc-cdn.com`, `cdn-sync-status.example`), los nombres de
  regla y de política y los nombres de los verbos en pantalla van escritos; la voz dice «el servidor del atacante»,
  «el dominio del correo», «la regla que avisa». Los **nombres de los siete verbos se dicen en voz** (son términos de
  examen) pero solo los que el vídeo usa (Discover, Detect, Deny, Disrupt, Degrade). Ninguna otra excepción. La voz no
  nombra VELVET CICADA: dice «el atacante» o GLASS VIPER, nombre de seguimiento del implante y de quien lo usa, como en V3.
  La voz dice «tu visibilidad» y nunca «el hilo» (en la lección «quema el hilo», `:342`; «hilo» es el activity thread de
  V3 y V14).
- **Enfoque («cortar o mirar»):** el equipo de respuesta de Meridian (el IR, rol que ya existe en la lección,
  `src/data/s5.ts:66`; sin persona) le pregunta a la analista qué se puede hacer, ahora que se sabe en qué paso va la
  intrusión (el final de V13). La analista monta la matriz de la lección, la de Meridian para esta intrusión (extracto
  de trabajo), y la lee como un menú con precios. Primero los dos pares de verbos que más se confunden, cada uno con
  una imagen; después la matriz entera por filas, con su lección de resiliencia; y al final la decisión que de verdad
  cuesta: el C2 está a la vista y hay dos caminos, cortarlo o seguir mirando. GLASS VIPER provoca dos veces y la
  narradora le da la razón en el dato y se la quita en la conclusión. **El vídeo no dice qué decide Meridian, ni cuándo.**
  Una frase sitúa a quien no ha visto nada: eres la analista de inteligencia de Meridian, una aeroespacial, con una
  intrusión delante.

**Conceptos (3) y su imagen:**

Una sola imagen para todo el vídeo, con un detalle distinto en cada concepto: **la tienda del barrio** y sus medidas. **Regla
de la imagen (revisión del 2026-10-08): un gesto, un verbo, y cada objeto tiene una sola función.** Discover es la cinta
grabada de ayer (el archivo); Detect, la alarma y la cámara en directo (concepto 1); Deny, la persiana que se echa antes de
que entre alguien; Disrupt, sacar a alguien en plena faena (concepto 1). La puerta con cerradura, alarma, cámara en directo y
vigilante en vez de solo cerradura (concepto 2). Para el C2 (concepto 3) no se reutiliza ningún gesto de los anteriores: el
sospechoso habla por un walkie con su jefe; el sinkhole es que el walkie no conteste a nadie (Deny: ninguna llamada futura
llega a ninguna parte), y Detect más Degrade es dejarle hablar por una línea ruidosa y escuchar. Nunca «echar» ni «la
persiana» para el C2. No es la casa ni el ladrón de V13, ni la cocina de V9, ni el coche de V15.

| # | Concepto | Imagen que se mantiene | Tarjetas |
|---|---|---|---|
| 1 | Los dos pares que se confunden (nota de examen, `src/data/s2.ts:297-301`). **Discover** mira hacia atrás: busca en lo que ya guardas. **Detect** mira hacia delante: una alerta que salta cuando vuelva a ocurrir (la celda de Installation: alerta de `schtasks /create` fuera del inventario aprobado). **Deny** impide que la acción funcione (política que no deja a `explorer` crear procesos PowerShell); **Disrupt** corta lo que ya está en marcha (aislar el host en cuanto se crea la tarea). Una alarma sola no para a nadie (V13 ya lo decía en su s07; s2m2q1, q5 y q9, checks 2 y 3) | La tienda: la cinta grabada de ayer, que se rebobina (Discover), y la alarma con la cámara en directo (Detect); la persiana echada antes de que entre alguien (Deny) y sacar a alguien en plena faena (Disrupt) | «Discover mira atrás; Detect avisa hacia delante» · «Deny: no llega a funcionar; Disrupt: lo cortas en curso» |
| 2 | La matriz se lee por filas. Fases en filas (las cinco que normalmente tienes a tu alcance: faltan Reconnaissance y Weaponization), acciones en columnas, una acción concreta en cada celda, no una categoría. **Una fase con una sola celda poblada es un punto único de fallo**: si ese control falla o se esquiva, la fase queda sin oposición; con dos o tres celdas complementarias, pasivas y activas, la fase sobrevive al fallo de una (si una falla, otra avisa o atrapa; `src/data/s2.ts:303-305,352`; s2m2q6 y q7). Discover y Destroy no ocupan celda en este extracto | La puerta de la tienda con cerradura, alarma, cámara en directo y vigilante; con solo la cerradura, si falla, la puerta queda abierta | «Una sola celda por fase es un punto único de fallo» |
| 3 | **Intelligence gain/loss**: cada acción visible (`[!]`) le enseña al atacante lo que sabes y puede hacerle rotar su infraestructura, y tú pierdes visibilidad futura. El sinkhole del C2 es Deny: no mata la llamada de hoy, hace que las siguientes no lleguen a ninguna parte. Es lo más contundente y lo más caro; Detect más Degrade deja ver su operación con menos ruido (se parece más a una red lenta que a un bloqueo). Mirar vale mientras lo valioso esté protegido; **si ya se llevan lo crítico, al revés: contener ahora, recoger después** (s2m2q4 y q8). La decisión final no es del SOC, es una decisión de riesgo del negocio, informada por tu análisis (`:306-315,352`) | El sospechoso habla por un walkie con su jefe. Si haces que el walkie no conteste a nadie, mañana cambia de walkie y tú vuelves a empezar a ciegas; si lo dejas hablar por una línea ruidosa con la caja fuerte cerrada, te enteras de con quién habla y qué busca; si ya está vaciando la caja, se le corta el walkie y se asegura la tienda | «Intelligence gain/loss: lo visible avisa al atacante» |

**Escenas:** seis, en tres capítulos (Los verbos · Las celdas y su precio · Para el examen).

| Escena | Cap. | s | Qué se ve | Qué se aprende · cues |
|---|---|---|---|---|
| s01-hook «Qué hacemos con esto» | I Los verbos | 18 | La fila de pasos de la intrusión, en pequeño y atenuada (Delivery, Exploitation, Installation, Command & Control, Actions on Objectives), con una marca en C2: «llama a casa cada minuto» (sin ficha de alerta, sin fecha ni hora). Tira de contexto: «Meridian Dynamics · aeroespacial · tú, su analista de inteligencia» y, debajo, «equipo de respuesta: ¿qué hacemos con esto?». Título «Courses of Action» con «la matriz de decisiones» debajo, antes de los 8 s. La promesa en tres chips: «los verbos que se confunden · una matriz con huecos · cuánto cuesta cada acción» | La promesa en los primeros 10 s y el puente con V13 en una frase (ya sabes en qué paso va; ahora, qué haces y a qué precio) · `chain, ask, title, promise` |
| s02-atras «Atrás y adelante» | I | 38 | La tienda del barrio en alzado: una cinta grabada, una alarma con su cámara en directo y una persiana. La cinta de ayer se rebobina y se rotula DISCOVER, «mirar hacia atrás lo que ya pasó» (sin ejemplo ni hash). La alarma y la cámara en directo, desde ahora: DETECT, «avisar cuando vuelva a ocurrir», con un solo ejemplo, la celda de la matriz «alerta: schtasks /create fuera del inventario aprobado». Una línea de tiempo con un «hoy» en medio y dos conectores dibujados, uno hacia atrás y otro hacia delante. La tarjeta, con la línea ya quieta | Discover mira lo que ya pasó; Detect, lo que pase desde ahora · `shop, discover, tape, detect, alarm, live, example-s, pair` |
| s03-impedir «Impedir o cortar» | I | 46 | Mensaje interceptado. Respuesta: la alarma de s02 suena y la persiana sigue arriba (una alarma sola no para nada). Entra la matriz de la lección con su título «Matriz Courses of Action · extracto de trabajo (ficticia)»: cinco filas y las acciones que usa como columnas, que se encienden al nombrarse; sin Reconnaissance ni Weaponization, con «casi nunca a tu alcance». Se resaltan dos celdas: **Deny** de Exploitation, «política ASR: explorer no puede crear procesos PowerShell», con la persiana echada antes de que entre; y **Disrupt** de Installation, «aislamiento automático del host al crearse la tarea», con alguien sacado a la calle en plena faena. Rótulos: DENY «no llega a funcionar» y DISRUPT «lo cortas en curso». La tarjeta. Cierre del capítulo con el «o sea, que…»: «Discover y Detect miran · Deny y Disrupt paran» | Una alarma avisa, no para; Deny no deja que funcione y Disrupt corta lo que ya está en marcha · `reply-alarm, matrix, not-recon, deny, shutter, disrupt, inside, pair-ii, wrap-i` · **intercept** |
| s04-fase «Fase por fase» | II Las celdas y su precio | 34 | La matriz entera, con el recuento de celdas de cada fila (Delivery 3, Exploitation 2, Installation 2, C2 3, Actions on Objectives 3) y la nota «cada fila es una fase». Ejemplo de qué pasa con una sola celda: la fila de Delivery se queda con solo «bloquear el dominio del correo en el gateway»; llega un dominio que no está en la lista, el control falla y la fila queda en blanco: «la fase, desprotegida». Después vuelve a poblarse con las otras dos celdas de su fila (Detect y Deceive, esta atenuada), «si una falla, otra avisa o atrapa» (el correo habrá entrado, pero la fase no está sola). La tarjeta | Una fase con una celda es un punto único de fallo; con varias celdas complementarias, la fase sobrevive al fallo de una · `rows, counts, single, fails, unopposed, back, many` |
| s05-caminos «Dos caminos para el C2» | II | 58 | Mensaje interceptado. Respuesta: se amplía la fila de C2 con la leyenda «[!] = acción visible para el actor»: Detect, «anomalía: beacon TLS periódico hacia un dominio joven»; Deny, «sinkhole de `update-svc-cdn.com`», con [!] y «el actor lo sabrá en minutos»; Degrade, «throttling del egress hacia el C2». En voz, una frase entre la aparición de la celda y la pregunta: «el sinkhole no mata la llamada de hoy, hace que las siguientes no lleguen a ninguna parte: eso es Deny». La viñeta del walkie: que no conteste a nadie, o dejarle hablar por una línea ruidosa con la caja fuerte cerrada. Una frase de puente con V13: «ya no estás a tiempo de impedir los pasos de antes; lo que decides es qué haces con el que queda». Chips: «Supón que todavía no han sacado nada» y «Supón que lo importante está a salvo». Pregunta para pensar, con las dos opciones señaladas (la celda Deny del sinkhole y el par Detect más Degrade) y sin ninguna etiqueta de coste. Respuesta: se marca Detect más Degrade, «ves su operación, avisas menos», con «mientras lo valioso esté protegido». Sobre la fila de Actions on Objectives se enciende una alarma y la elegida pasa a ser la celda Deny del sinkhole (la fila de C2 sigue ampliada, para que nadie busque un Deny en Actions on Objectives): «si ya se llevan lo crítico: contener ahora, recoger después». Rótulo: «la decisión final es del negocio, no del SOC · tú pones los precios sobre la mesa». La tarjeta. Cierre del capítulo | Cada acción visible gasta visibilidad; mirar vale mientras lo valioso esté a salvo y se corta ya si se están llevando lo crítico; decide el negocio · `reply-move, row-c2, visible, sinkhole-deny, walkie, supose, answer, watch, flip, business, wrap-ii` · **intercept** · **think** |
| s06-recap «Tres reglas» | III Para el examen | 24 | Tres tarjetas de reglas, cada una con su viñeta en miniatura (la cinta y la alarma, la fila con una sola celda, el walkie); tarjeta final Alertópolis: «Tu turno: Lab 2C · Courses of Action» | Reflejos · `recap, rule-1, rule-2, rule-3, lab2c, endcard` |

- **Tarjetas de examen** (dominio Intrusion Analysis), una por escena de s02 a s05, ninguna en s01 ni en el cierre. Cada una
  espera al final de su frase y lleva ~5 s de escena detrás (la de s03 y la de s05 llevan detrás el «o sea, que…» que
  cierra su capítulo):
  - «Discover mira atrás; Detect avisa hacia delante» (s02) (47)
  - «Deny: no llega a funcionar; Disrupt: lo cortas en curso» (s03) (55)
  - «Una sola celda por fase es un punto único de fallo» (s04) (50)
  - «Intelligence gain/loss: lo visible avisa al atacante» (s05) (52; sale después de la respuesta a la pregunta)
- **Pregunta para pensar:** «Nada robado y lo crítico a salvo: ¿cortas?» (s05) (42; `holdMs` 4500). Las dos condiciones de la
  lección («mientras proteges los activos», `src/data/s2.ts:309`; s2m2q8) van dentro de la propia pregunta, y se dicen en voz
  como una suposición («supón que todavía no han sacado nada y que lo importante está a salvo»), no como el estado de
  Meridian. Respuesta: no cortes; sigue mirando, con Detect y Degrade, porque cada celda visible gasta visibilidad; y si
  empiezan a salir los datos críticos, se corta ya (s2m2q4 y q8).
  Quien decide es el negocio. El título de la escena («Dos caminos para el C2») no da la respuesta.
- **Mensajes interceptados** (GLASS VIPER, uno en los capítulos I y II; ninguno en el cierre; registro de V3, V7 y V13:
  tutea, dos frases cortas, ironía en la segunda, sin marcar su género y sin decir «analista», que es de HOLLOW LANTERN y
  PAPER CRANE):
  - s03 (cap. I): «Ponme todas las alarmas que quieras. Para pararme ya habrá tiempo.» (66; sin la fórmula «Tú + imperativo» de V13). El error que corrige la narradora: creer que
    detectar ya es defender. La voz, más o menos así: «Tiene razón en una cosa: una alarma avisa. Pero una alarma sola no
    para a nadie. Para parar hay dos verbos…» y entra la matriz. Distinto del tercer mensaje de V13 («Tú vigila tus
    planos»): aquel era dónde mirar; este es qué haces cuando suena.
  - s05 (cap. II): «Córtame ya. Me mudo en cinco minutos y vuelves a empezar.» (57). El error: que cortar ya es siempre lo
    correcto. La voz: «Cortarlo ya es lo más contundente, sí. Y a él le viene bien: si lo cortas hoy, se muda, y tú pierdes
    lo que aún podías ver. Te lo pide para que gastes tu visibilidad.» (es un cebo, como el «Bloquea mi hash» de V7 y el «Bloquea esos dos» de V15: la respuesta lo dice, y no pasa de ahí) Nunca «bloquear no sirve» (V15: «Bloquearlos sigue valiendo»): cortar sirve y tiene un
    precio, y si ya se llevan lo crítico se corta. No repite el argumento de V7 (lo que le cuesta cambiar a él): aquí es
    lo que cuesta a quien corta. «Cinco minutos» es el ejemplo de la lección (`src/data/s2.ts:314`).
- **Cierre:** tres reglas y una sola tarea.
  1. Discover mira atrás y Detect mira hacia delante; Deny no deja que funcione y Disrupt corta lo que ya está en marcha. Una
     alarma sola no para nada.
  2. Una fase con una sola celda es un punto único de fallo: varias medidas por fase, pasivas y activas.
  3. Cada acción visible tiene un precio: ponlo sobre la mesa. Y si ya se están llevando lo crítico, corta primero y mira
     después.

  Tarea: el Lab 2C (ocho medidas por clasificar), que practica la clasificación, que el vídeo no hace.

**Se queda fuera** (y dónde está):
- La tabla completa de siete verbos con sus definiciones y ejemplos (`src/data/s2.ts:285-294`): no sale en
  pantalla (solo la imagen de la cinta y la alarma y un ejemplo de Detect), y la voz nombra solo los verbos que usa.
- **Deceive, Degrade y Destroy como definiciones** (s2m2q2, q3, q5 y q10): Deceive y Degrade salen en celdas de la matriz,
  sin definir; la voz dice la idea de Degrade antes de su nombre («frenar sin cortar», en s05, junto a «una red lenta»);
  **Destroy no sale** (el límite legal de q3 se queda en la lección). Discover y Destroy no ocupan celda
  en este extracto, y la pantalla lo dice en una tira.
- Las preguntas q1, q2, q3, q5, q9 y q10 (clasificar una medida): las practican el Lab 2C y el quiz.
- El ejemplo de la lección de «48 h» y «su horario de operación» (`:314`): la voz dice «un tiempo»; el horario de
  operación es terreno del Lab 4A y 4B.
- Cómo se priorizan las celdas de otra intrusión o quién las paga.
- La búsqueda de seis meses en DNS del segundo check (`:370-378`): el canon no da la retención del DNS interno de
  Meridian (V8), y la ficha no la fija.

**Laboratorios:**
- **Lab 2C** (`src/data/labs.ts:88-97,340-393`, clasifica 8 medidas en su acción): es la penalización L. **El vídeo enseña la
  matriz de la lección, que ya contiene seis de los ocho ítems** (el sinkhole como Deny, `labs.ts:368`; el aislamiento del
  host como Disrupt, `:373`; las celdas de limitar la salida y de planos señuelo, `:378,383`; y, si salen en pantalla, las
  otras dos), **sin añadir ninguno ni practicarlos**: no los lee como lista ni los clasifica. Solo se escapan el ítem 2 (DNS
  histórico) y el 8 (incautación legal). Para quitar peso, s02 no usa ejemplos del laboratorio (ni el hash en 90 días de EDR
  ni la regla Sigma del LNK) y el ejemplo de Detect es una celda que no es ítem. Lo que el vídeo da de más (el porqué de los
  pares, la lectura por filas, el precio) no lo practica el laboratorio. Por eso el Lab 2C es la tarea del final.
- **Lab 2A** (`:61-75`) y **Lab 2B** (`:77-86`): ni un evento del 2A (RAR, 650 MB, escaneo de la VPN, canal por la
  nube…), ni vértices del 2B.
- **Lab 3A, 3B y el final de la campaña:** nada.

**Canon nuevo que fija V22** (nada de esto estaba en los datos del curso; lo posterior debe respetarlo):
- **Sin fecha ni hora**, como V9 y V15. Es posterior a la reconstrucción de la cadena (V7 y V13) y no se ordena contra la
  cronología del registro. Ningún intervalo («48 horas»), ningún resultado y ninguna decisión: **la matriz de la lección es
  el menú de trabajo de la analista, no lo que Meridian tiene desplegado**, y el vídeo no dice si se corta el C2, se mira
  o se hace otra cosa.
- **El equipo de respuesta** (IR, sin persona) pregunta qué se puede hacer. Es el rol que la lección ya nombra
  (`src/data/s5.ts:66`; `src/data/s2.ts:421-434`); no se le da nombre ni postura (en la pregunta q4 el IR lead propone
  mirar, y aquí no propone nada).
- **La matriz de la lección con tres retoques en pantalla:** «hacia el C2» en lugar de «hacia la IP del C2» (la IP de
  `update-svc-cdn.com` es un alojamiento compartido con ~14.000 dominios de terceros, `src/data/s2.ts:585` y V3/V4), sin
  «quema el hilo» (se lee «el actor lo sabrá en minutos») y con la celda del buzón señuelo atenuada. Nada de esto cambia
  ninguna acción ni su celda. Si Lidia acepta los cambios de lección de las decisiones, la pantalla y el texto coinciden.
- **El «dominio que no está en la lista» de s04 es hipotético**: sin nombre, sin fecha y sin relación con ningún dominio del
  caso (el Lab 3A guarda un segundo dominio de phishing aún sin usar, `src/data/labs.ts:704-707`). No es un hecho de Meridian.
- **Dos mensajes nuevos de GLASS VIPER**, sin fecha, que pasan a ser canon de su voz: «Ponme todas las alarmas que quieras. Para
  pararme ya habrá tiempo.» y «Córtame ya. Me mudo en cinco minutos y vuelves a empezar.»
- **La imagen de la tienda** (cámara, alarma, persiana, vigilante, caja fuerte) es de la analogía, no del caso.
- Ninguna persona, fecha, equipo, hash ni IP nuevos. Sale `update-svc-cdn.com` (del C2, como en V3, V4 y la lección) y
  `cdn-sync-status.example` (del correo, como en V13 y la lección) solo como texto de las celdas de la matriz.

**No se toca:**
- **El dosier de BROKEN CHAIN** (`src/data/course-gcti.ts:40`): ni el PDB en ninguna forma, ni cuántas muestras hay, ni
  «VELVET CICADA ya tiene cara técnica».
- **E9 y el 7 de marzo**, ni «dos días» ni el último `last seen` de `update-svc-cdn.com` (V3, V4): el vídeo no dice
  cuándo ni si se corta el C2, ni que Meridian viera salir nada (registro §5, punto 7). La séptima fase queda como en
  V13: en el vídeo no hay ninguna prueba de ella.
- **El indicador propio de Meridian para `cdn-sync-status.example`** (V8; `src/data/s5.ts:596-607`) y cualquier cosa de la
  ola de abril: la celda de Delivery es un menú; no se dice que se haya bloqueado ni que no.
- **Las retenciones del CMF** (EDR 90 días, proxy 30; V8): solo sale «90 días de EDR», la cifra de la tabla de la lección,
  y sin ningún resultado.
- **Quién abrió el adjunto** (registro §5, punto 5): «RR. HH.» solo asoma en la celda del buzón señuelo, atenuada, y nunca
  junto a `ENG-WS-041`; ni equipo ni persona en ningún sitio. Ni el intervalo del beacon más allá de «cada minuto» (punto 3).
- **El Lab 2C**: sin clasificar ninguna medida del laboratorio ni mostrar su respuesta; **el Lab 2A**: ni un evento suyo.
- Ninguna acción ofensiva (Destroy): no se recomienda nada que un defensor privado no pueda hacer (s2m2q3).
- No se culpa a nadie: ni al SOC por no cortar ya ni al equipo de respuesta por preguntar. Mirar durante un tiempo es una
  decisión de riesgo, no un descuido.

**Comprobación de límites** (recuentos hechos con un script de Node, `check-limits.mjs`, no a ojo; perfil `capsula-yt`):
- Duración: suma 218 s (seis escenas: 18, 38, 46, 34, 58 y 24); estimado ~250 s; renderizado previsto ~230–235 s; ventana
  190–260. Sí.
- Capítulos: 3 (máximo 3). Sí.
- Conceptos clave: 3 (2–3), con como mucho dos tarjetas por concepto (2, 1 y 1). Sí.
- Tarjetas: 4 (3–5), una por escena de s02 a s05 y ninguna en s01 ni en s06, todas con `"objective": "Intrusion
  Analysis"`. Caracteres: 47, 55, 50 y 52 (máximo 58). Sí.
- Pregunta para pensar: 1, en s05; 42 caracteres (máximo 48); `holdMs` 4500 (mínimo 4000). Sí.
- Mensajes interceptados: 2 (1–2), en s03 (cap. I) y s05 (cap. II), uno por capítulo, ninguno en la escena final; 66 y
  57 caracteres (máximo 70); `holdMs` 3500 (2500–4500). Sí.
- `video.json` lleva `"adversary": "GLASS VIPER"`. Sí.
- Sin flechas, marcas de verificación, viñetas ni emoji (`FORBIDDEN_SYMBOLS` de
  `video/engine/scripts/lib/narration.mjs:23`) en tarjetas, pregunta, mensajes, rótulos nuevos y frases de voz de muestra;
  las flechas de tiempo de s02 se dibujan como conectores. Sí.
- Ningún identificador leído en voz (dominios, nombres de regla y de política solo en pantalla). Sí.
- `wordBudget` por escena: 49, 103, 124, 92, 157 y 65 (590 palabras); frases de voz de muestra de ≤ 22 palabras. El
  título de la escena de la pregunta no la destripa. Sí.

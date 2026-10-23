# Revisión de guion · V41 `roles-halden` (sp5m2, perfil `caso-yt`)

Revisado el 2026-10-23, solo lectura. Fuentes: ficha `docs/superpowers/plans/fichas-tanda8/V41-sp5m2.md`; `video/roles-halden/` (`storyboard.json`, `narration.json`, `video.json`, `lexicon*.json`, `out/script-notes.md`, `out/canon-refs.md`); lección `src/data/secplus/sp5-part1.ts:249-500` (sp5m2, con su quiz), `sp5-cards.ts` (`fcp505`-`fcp508` y glosario), `sp3-part3.ts` (niveles de clasificación), `placement-sp5.ts` (`pl-sp5q2`); plan del dominio 5; plan de vídeos §1 «Narración hablada»; `fichas-tanda8/_revision.md`; los `narration.json` de V28, V32, V35, V39, V40, V43, V44, V45; el motor (`build-timeline.mjs`, `narration.mjs`) para el momento de las tarjetas.

**Límites de esta revisión** (para que no se lean como más de lo que son):

- **Registro de canon** (`docs/superpowers/canon/glass-harbor.md`, 3024 líneas, ~720 KB). No lo leí entero en una sola pasada, porque no cabe. Leí línea a línea: §1 (cómo se usa y tabla de vídeos, líneas 1-56), la cronología (57-156), «Personas» de §3 (158-200), las «Notas de V32» (1618-1672), el arranque de la contradicción 17 (687-697) y todo §6 «Nombres libres» (2903-3024, que es donde viven las imágenes ocupadas). Para el resto (equipos, cuentas, dominios, casos, §4, el resto de §5) busqué en todo el archivo estos términos: ferry, pasajeros, embarque, Atención al Pasajero, planificación, jefa, autoridad marítima, plan de protección, comité (de seguridad / de riesgos), consejo, dirección, mudanza, sofá, álbum, abuela, club, ayuntamiento, V41, sp5m2, roles-halden. No hay entrada de V41 en el registro (aún no se ha apuntado).
- **PDF oficial de SY0-701.** No hay ningún PDF en el repositorio. Contrasté con el 5.1 tal como lo recogen la lección, el plan del dominio 5 y las tarjetas, y con lo que recuerdo del texto del objetivo («Roles and responsibilities for systems and data: Owners, Controllers, Processors, Custodians/stewards»; «Types of governance structures: Boards, Committees, Government entities, Centralized/decentralized»). Las dudas 1-3 se deciden con esa reserva.
- Los números de línea del registro que cita la ficha (`reg:1133`, etc.) están **desfasados**: el registro ha crecido. `reg:194` sí es hoy la fila de V32. No es un fallo del guion.

---

## A. Exactitud y canon

### Resumen de la pasada

El guion es sólido y está bien contenido: tres conceptos, tres preguntas con una respuesta defendible cada una, cero identificadores, cero personas con nombre, tres imágenes que no están ocupadas en el registro ni en ningún guion de las tandas 6-9. Las definiciones de la voz coinciden con la lección (owner clasifica y aprueba accesos; custodian restaura, parchea y vigila; steward, calidad y significado; controller decide para qué; processor trata con instrucciones y pasa a controller si decide por su cuenta; board, committee, government entity según `sp5-part1.ts:269`). No hay cifras ni nombres inventados fuera de lo que la lección da. Hay cuatro correcciones de precisión (A-1 a A-4) y ningún bloqueante.

### Atención extra · el cargo del owner (V32 frente a «la jefa de la terminal»)

**Confirmado: el autor acierta al usar el cargo de V32, y la ficha se equivocaba.**

- `reg:194` (fila de V32) y `reg:251` fijan el owner de los datos de pasajeros como un **cargo**, «responsable de la oficina de la terminal de pasajeros», «una persona, no un área», **sin nombre ni género**. Las «Notas de V32» (`reg:1635-1636`) lo dicen otra vez («El owner es un cargo»). En el vídeo publicado está en voz («Una persona, no un área, porque lo que es de todos no es de nadie», `video/activos-halden/narration.json:119`) y en pantalla (`activos-halden/src/data/s04-dueno.ts:12`, `OWNER_VALUE`). Lo que guarda ese owner es precisamente «listas de embarque · nombres de pasajeros» (`s04-dueno.ts:23`): el mismo tipo de dato que V41.
- **«La jefa de la terminal de pasajeros» no existe en ningún sitio del canon.** Búsqueda en todo el registro y en los `narration.json` de V32 y V35: cero resultados para «jefa de la terminal». V35 (`reg:258`, `reg:2922`) solo da la terminal de pasajeros como **lugar** (sus pantallas de salidas), sin puesto ni persona; `reg:1133` (que cita la ficha) ya no apunta a nada de eso. La única «jefa» de la lección es la «jefa de operaciones de terminal», owner de los datos de atraques y manifiestos (`sp5-part1.ts:293`, `:302`), que es otro puesto y otro dato; y la única «jefa» de Halden en vídeo es «la jefa del servicio» de la pregunta 2 de V32, un ejemplo de fuera del puerto.
- Usar «jefa de la terminal» habría creado un **segundo cargo** para los mismos datos de pasajeros (jefa de la terminal frente a responsable de la oficina de la terminal), **con género**, contra la regla del registro de no dar género a los puestos de Halden. El autor lo evita. La voz («La persona responsable de la oficina de la terminal de pasajeros») y el storyboard («el puesto responsable…») cumplen.
- **Qué hay que hacer:** nada en el guion (salvo la mejora de fraseo de B-6). En el registro, al cerrar V41, que la fila de V32 (`reg:194`) diga que V41 reutiliza ese cargo como owner de la lista de pasajeros del ferry, y que la ficha corrija su cita.

### A-0. Decisión de las «dudas para el revisor» (`out/script-notes.md`)

| Duda | Decisión |
|---|---|
| **1. Processor como tercero** (pregunta 2) | **Se queda; la voz es correcta.** Procesar *por cuenta del controller* es otra organización (o un tercero contratado): los empleados que aplican controles actúan bajo la autoridad del controller y no son «processors» en el sentido de la ley de privacidad, y el material de preparación habla de un processor «contratado» por el controller. Lo que dice la voz («es otra organización, y él es de la casa», `s05-02`) es exacto. La lección no lo dice en la definición (`:293`), solo en los ejemplos (SaaS, correo, analítica) y en la nota (`:345`, «proveedor externo»); proponer «otra organización que trata…» en `:293` es buena idea, pero **no condiciona el vídeo**. Riesgo residual: algún material del examen define el processor como «grupo o individuo» sin decir «externo»; por eso la pregunta lleva «MEJOR» y la trampa es tentadora a propósito. Con A-1 (que el administrador no se lea como alguien que revisa *datos*), la respuesta única se sostiene. |
| **2. Government entity** | **Se queda.** El 5.1 solo la nombra; la definición («nombra miembros, impone requisitos, inspecciona, autoriza o retira licencias», `:269`; «impose governance from outside through law and regulation», `fcp505`) es la de la lección y es la lectura habitual. La pregunta 3 no depende de nada más (con A-4 para el referente). |
| **3. Steward y clasificación** | **La pregunta se queda (pregunta quién *decide*, y es el owner), pero se afloja el texto que dice que el steward «no clasifica»** (A-2). Parte del material de preparación da al steward el etiquetado y los metadatos (aplicar las etiquetas que fija el owner); decir «el steward no clasifica» puede chocar con eso, mientras que «no decide la clasificación» es verdad en todas las fuentes. Además el 5.1 junta «custodians/stewards» en un solo punto, así que conviene que ninguna explicación convierta la frontera custodian/steward en lo que se evalúa. |
| **4. V32 y V41 juntos** | **No hay contradicción; no hace falta cambiar nada en el guion.** V32 es un disco de red de una oficina, fuera del radar de Sistemas («para Sistemas no existe»); V41 es la lista oficial de pasajeros del ferry, de la que Sistemas da el permiso, cifra y copia. V41 nunca dice dónde vive la lista ni habla de discos. Incluso es coherente con V32: lo que V32 muestra que falta (cifrado, quién accede, copias) es lo que V41 enseña que hace el custodian. Lo único que se lee: «listas de embarque» (V32) y «avisos de embarque» (V41) comparten palabra. Recomendación en A-6 (anotar en el registro; opcional cambiar «embarque»). |
| **5. Canon nuevo** | **Correcto y completo; ver A-6** para la lista exacta que hay que apuntar y las distinciones que conviene escribir. |

### A-1 · CORREGIR · La pregunta 2 se puede leer como «revisa los *registros* de afiliados» (datos), no «revisa los logs»

**Dónde.** `s05-01` (voz) y `question.scenario` de `s05-01` (pantalla): «…revisa los registros de la base de afiliados».

**Qué está mal.** «Registros» es ambiguo en español: logs (lo que el custodian vigila, como pide la lección: «restaura, parchea y vigila») o registros de datos (los asientos de los afiliados). En la segunda lectura, un administrador que «revisa los registros de afiliados» está cuidando la exactitud de los datos, que es terreno del steward; y que «trata datos» da más fuerza al processor. En voz es peor: «la base de afiliados» se oye como «base» a secas. La respuesta única (custodian) debe salir del escenario, no de adivinar. Además, la frase tiene 22 palabras y tres acciones en lista (B-3).

**Corrección.**

- Pantalla (`scenario`, 147 caracteres, límite 160): «Un administrador de sistemas de una mutua restaura copias, aplica parches y vigila los accesos a la base de afiliados, según decide la responsable.»
- Voz (`s05-01`): «<engaging> {q2}Otra. En una mutua de salud hay un administrador de sistemas. Restaura copias, aplica parches y vigila los accesos a la base de datos de afiliados. Lo hace según lo que decide la responsable del área. ¿Qué rol describe mejor su trabajo? {best}Fíjate en ese «mejor». Pide la que encaja con este caso, aunque otra suene bien.» (57 palabras frente a 54; la frase más larga baja de 22 a 15.)
- «Vigila» está en la definición de la lección (`:293`), así que no se inventa nada. `why` y `trapWhy` no cambian. Anotar el cambio en el `goal` de `s05-p2` si lo repite.

### A-2 · CORREGIR · «El steward no clasifica» es más fuerte de lo que dicen todas las fuentes

**Dónde.** `question.trapWhy` de `s03-01` («…pero no lo clasifica»), y la tarjeta de examen de `s03-03` («Clasificar es del owner, no del steward»).

**Qué está mal.** La pregunta es correcta (el owner decide la clasificación: `:293`, nota `:345`, `fcp506`). Pero «el steward no clasifica» es una afirmación sobre lo que *hace* el steward, y parte del material de preparación le da el etiquetado de los datos con los metadatos que corresponden. Quien lo haya estudiado así verá en la tarjeta una contradicción con su libro. Lo que sí es cierto en todas las fuentes es que el steward **no decide** la clasificación.

**Corrección.**

- `trapWhy` (86 caracteres, límite 90): «El steward cuida la calidad y el significado del dato, pero no decide su clasificación»
- Tarjeta de `s03-03` (37 caracteres): «Decidir la clasificación es del owner»
- La voz de `s03-02` («porque clasificar es decidir sobre el dato… Pero conocerlo no es decidir») y el `why` correcto se quedan: en su contexto dicen lo mismo que la lección.
- (OPCIONAL, mismo hallazgo) El escenario dice que se pasa «de uso interno a confidencial»; «uso interno» no es ninguno de los niveles del curso (`sp3-part3.ts:366`: public, private, sensitive, confidential, restricted, critical), y la lección define Confidential como «uso interno limitado a un grupo concreto» (`sp3-part3.ts:413`), así que «de uso interno a confidencial» se puede leer como un paso que no existe. Si se cambia: pantalla «Unas clínicas deciden si sus datos de citas se clasifican como «confidenciales». Quien define cada campo y corrige errores los conoce mejor que nadie.» (154 caracteres) y voz «…tiene que decidir si los datos de sus citas se clasifican como confidenciales.» (el título de escena «Uso interno o confidencial» puede quedarse o pasar a «Qué nivel de clasificación»).

### A-3 · CORREGIR · `s06-04`: «repartir las decisiones» describe solo uno de los dos modelos, y la voz da el precio de ninguno

**Dónde.** `s06-04`: «Y repartir las decisiones puede ser centralized, igual en todas partes, o decentralized, rápido y local.»

**Qué está mal.** (1) «Repartir las decisiones» es descentralizar; con «puede ser centralized» la frase se contradice. (2) La lección, `fcp505` y el check de la propia lección piden el **trade-off** («consistencia contra velocidad»); la voz solo cuenta la virtud de cada modelo y el chip de pantalla («más lento», «desigual») lleva el precio. Para quien solo escucha, queda «centralized = igual en todas partes» sin su coste. La ficha pide «sin voz larga», así que hay que decirlo en una línea y no más largo que ahora.

**Corrección.** `s06-04`: «<casual> {central-chip}Y además, centralized es igual en todas partes, pero más lento. Decentralized, rápido y local, pero desigual.» (17 palabras frente a 16; el chip de pantalla no cambia.)

### A-4 · CORREGIR · La pregunta 3 tiene un «le … su» ambiguo

**Dónde.** `s07-01` (voz: «Además, le fija los requisitos de su plan de seguridad») y `question.scenario` (pantalla: «…y le fija los requisitos de su plan de seguridad»).

**Qué está mal.** Hay tres sujetos posibles (la autoridad, los consejeros, la universidad). «Su plan de seguridad» puede ser el de la autoridad o el de la universidad; «le» puede ser la universidad o los consejeros. No cambia la respuesta (government entity), pero la revisión previa de la tanda (`_revision.md`, A-3) pedía justo un solo sujeto claro, y el escenario es lo que la trampa «Board» explota.

**Corrección.**

- Pantalla (142 caracteres): «Una autoridad pública nombra a dos de los consejeros de una universidad pública y fija los requisitos del plan de seguridad de la universidad.»
- Voz: «<curious> {q3}La última. Una autoridad pública nombra a dos de los consejeros de una universidad pública. Además, fija los requisitos del plan de seguridad de la universidad. ¿Qué describe mejor el papel de esa autoridad?»

### A-5 · OPCIONAL · «lo que el examen casi siempre pregunta»

**Dónde.** `s01-02`. Es una afirmación sobre la frecuencia de las preguntas que ni CompTIA ni la lección respaldan (la lección dice que es el bloque «que más puntos regala»). Inofensiva, pero es la única cifra implícita del vídeo. Ver la reescritura en B-7.

### A-6 · OPCIONAL · Apuntes de canon para cuando se cierre el vídeo

No hay contradicción con ningún dato fechado, equipo, cuenta, persona o imagen del registro ni de los vídeos publicados. Los apuntes que conviene hacer (todos «propuesta · sin fecha», como pide la ficha):

1. **Fila nueva**: lista de pasajeros del ferry; Atención al Pasajero (área nueva, sin personas; no es «Atención a navieras» de V6); la oficina de planificación como steward (sale de la lección: «responsable de datos maestros de la oficina de planificación portuaria», `sp5-part1.ts:322`; no es el «servidor de planificación de grúas» de R-014); una empresa sin nombre que manda los avisos a los pasajeros (processor; sin acceso, sin contrato); el consejo y la autoridad marítima nacional; las tres imágenes (álbum, mudanza, club) a §6, rotuladas «imagen · no es del puerto».
2. **El owner**: ampliar la fila de V32 (`reg:194`) con que V41 usa ese mismo cargo (ver «Atención extra»).
3. **El comité de seguridad de la información** (callout de la lección, `:371`) es un tercer comité del puerto, distinto del **comité de riesgos** (V25, `reg:189`) y del **comité de cambios** (V16, V17). Anotarlo así, porque en voz «revisa riesgos y recomienda al consejo» (`s06-02`) se parece a lo que hace el de riesgos. No es contradicción: V41 va antes que V25 en el orden del curso.
4. **La autoridad marítima nacional** también la usa V39 (`auditoria-halden`, regulatory examination: «el alcance lo fija la ley y puede acabar en sanción»). V41 solo dice que puede exigir un plan de protección aprobado antes de dejar operar (frase de la lección). Son compatibles; anotar que es la misma autoridad y que ninguno la nombra.
5. **Sello de s01.** Dice «propuesta · sin fecha» (decisión de la revisión previa, C-8). Es válido, pero V41 cuenta como hechos (no como proyectos) quién clasificó la lista y qué hace Sistemas; V32 ya tiene ese owner funcionando. Mientras nadie lo lea como «el puerto propone nombrar a un owner», no hay problema.
6. **Opcional**: «avisos de embarque» (s04) comparte «embarque» con las «listas de embarque» del disco de V32. Para cortar el puente léxico, «avisos de salida» o «avisos del ferry» valen igual y no tocan el cue (`storyboard.json` s04 y `narration.json` `s04-02`).

### A-7 · OPCIONAL · Rótulo de las preguntas

Las tres pasan **fuera del puerto** (clínicas, mutua, universidad). Los vídeos posteriores a V32 que hacen lo mismo (V35-V38, V45-V47) rotulan «pregunta tipo examen · ejemplo · no es del puerto»; V41 (como V28-V32) rotula solo «pregunta tipo examen · ejemplo». Decisión de la ficha, coherente con su pareja de tanda. Si se quiere uniformar con el estado más reciente del registro, añadir «· no es del puerto» en los `goal` de s03, s05 y s07.

### A-8 · OPCIONAL · «La tía» ya es un personaje de V34

El registro (§6) tiene «el grupo de la familia · quien fabrica el bulo · **la tía que lo reenvía**» como imagen de V34 (misinformation). La ficha ya evita «grupo», «mensajes» y «familia», pero «la tía» del álbum (que apunta quién sale en cada foto) es la misma figura familiar. No contradice nada (V34 está en sp2, V41 en sp5), pero quien vio V34 oye «la tía» y piensa en la que reenvía bulos. Cambiar «la tía» por «la prima» (o «el tío») en voz y rótulos de s02, s03 y s08, o aceptarlo.

### A-9 · OPCIONAL · Dos matices de pantalla que no están en la lección

- s04: el controller «decide qué se recoge, para qué y **cuánto se guarda**». La lección dice «finalidad y medios» (`:293`); «cuánto se guarda» es cierto y habitual, pero no lo da la lección. Mejor «qué se recoge, para qué y cómo se trata» (solo en pantalla).
- s01: el sello nombra «lista de pasajeros» y la voz «lista de pasajeros del ferry»; ya coinciden. Sin cambio.

### Lo revisado sin hallazgo

- **Pregunta 1 (owner/steward)**: una respuesta (D). Los tres distractores se apagan: custodian aplica; processor es un papel de la ley de privacidad; steward es la trampa elegida. No es copia de `pl-sp5q2` (allí decide la calidad y gana el steward; aquí decide la clasificación y es la trampa) ni de q1 de la lección.
- **Pregunta 2 (custodian/processor)**: una respuesta (B) con A-1. El trío «copias, parches, vigila» sale de la tabla de la lección, no del trío «permisos, cifrado, copias» de q4/nota. «Es otra organización» es correcto (A-0, duda 1).
- **Pregunta 3 (government entity/board)**: una respuesta (A) con A-4. Distractores de naturaleza distinta (órgano, órgano, forma de gobierno), sin pistas gramaticales; las longitudes de las opciones no delatan la correcta.
- **Letras y trampas**: respuestas D, B, A; trampas B, D, C (índices 3/1, 1/3, 0/2): coinciden con la ficha.
- **Límites del motor**: escenarios 154/147/142 (≤160), preguntas 39/35/46, opciones 5-24, `why` ≤75, `trapWhy` ≤86 (≤90), tarjetas 33-46 caracteres, cinco tarjetas, ninguna en s01/s06/s08, las de pregunta tras la trampa.
- **Palabras vetadas por la ficha** (proveedor, contrato, grupo, mensajes, familia, dueño, almacén, data subject, plano de control): ninguna en la voz. «Riesgos» aparece una vez (s06-02), como prevé la ficha.
- **Imágenes**: el álbum, la mudanza y el club del barrio no están ocupadas en §6 ni en ningún guion de `video/*`. El club y el ayuntamiento no chocan con el campo de fútbol de V46 ni con la farola de V44 (otro papel del ayuntamiento; la revisión previa C-2/C-5 ya lo arregló al dejar «da la licencia del local»).
- **Duración**: 711 palabras, estimación 323,9 s, techo 330. Las correcciones de abajo suman +3 palabras (+8 con el opcional B-8); la lectura real de Lidia (~0,89 de la estimación) deja ~288-295 s. Sin riesgo.

---

## B. Naturalidad

### Resumen de la pasada

Suena a persona: frases cortas, conectores hablados («porque», «o sea», «ojo»), idea antes del nombre en cada rol, cero siglas deletreadas, cero dos puntos de conector, cero identificadores, emociones sin repetir en segmentos seguidos, imágenes que se mantienen. Las frases de más de 20 palabras son una (22, en s05-01). El problema principal no es de estilo sino de **momento**: tres tarjetas entran a mitad de su segmento (B-1). El resto son ambigüedades de oído.

### B-1 · CORREGIR · Tres tarjetas de examen salen antes de que acabe la frase que las justifica

**Dónde.** `s02-04`, `s03-03`, `s07-03`.

**Qué está mal.** Con `"examTiming": "sentence-end"` la tarjeta espera a que termine *la oración que contiene su cue* (`build-timeline.mjs`, `sentenceEndFrame`: busca desde el cue el primer punto, y si el cue está al principio del segmento, es el de la primera oración). En V45 y V28 el cue está en la última oración del segmento o el segmento es una sola oración. Aquí no:

- `s02-04`: el cue `steward` está al principio; la tarjeta «El owner decide; el custodian lo aplica» entra al acabar «…sin nombres repetidos.», **antes de «Es el data steward.»** (la ficha pide que entre al acabar la frase del steward).
- `s03-03`: la tarjeta entra tras «O sea, como la tía del álbum.», **antes del remate** («Sabe quién sale en cada foto, y aun así decide la abuela.»).
- `s07-03`: la tarjeta entra tras «Como el ayuntamiento del club.», **antes del remate** («Puede tener a alguien en la junta…»).

Es lo contrario de «primero el ejemplo, después la regla». `s04-05` y `s05-03` están bien.

**Corrección.**

- `s02-04`: añadir un cue propio en la última oración y apuntar la tarjeta a él: texto «<thoughtful> {steward}La oficina de planificación cuida que la lista esté bien, con un solo formato de fecha y sin nombres repetidos. {steward-name}Es el data steward.» y `"exam": { …, "at": "steward-name" }`.
- `s03-03`: una sola oración (y de paso es el cierre «o sea, que…» del capítulo, regla 4): «<warm> {album-back}O sea, que la tía sabe quién aparece en cada foto, y aun así decide la abuela.» («aparece», no «sale»; ver B-2).
- `s07-03`: una sola oración: «<warm> {club-back}Como el ayuntamiento del club, que puede tener a alguien en la junta y aun así sigue siendo el ayuntamiento.»

(Las notas dicen que s03 cierra con «O sea, que…»: hoy dice «O sea, como…». Con la corrección ya es cierto.)

### B-2 · CORREGIR · `s02-05`: «salen / sale» con dos sentidos, «el álbum» sin presentar y «copias» ambiguas

**Dónde.** `s02-05`: «Como en el álbum de la abuela. Ella decide qué copias salen, el nieto las escanea y la tía anota detrás quién sale.»

**Qué está mal.** «Salen» (las copias abandonan la casa) y «sale» (quién aparece en la foto) en la misma frase se oyen como una repetición torpe y se confunden. «Copias» se mezcla con «las copias» de Sistemas del párrafo anterior (el nieto las escanea… ¿las copias o las fotos?). «El álbum de la abuela» suena a algo ya conocido, y es la primera vez que aparece.

**Corrección.** `s02-05`: «<warm> {album}Piensa en el álbum de fotos de la abuela. Ella decide qué fotos salen de casa. El nieto las escanea, y la tía apunta detrás quién aparece.» (27 palabras frente a 23; la frase más larga, 11.) Mismo cambio de «sale» por «aparece» en `s03-03` (B-1).

### B-3 · CORREGIR · `s05-01`: un escenario de pregunta que se oye como lista

**Dónde.** `s05-01`, 22 palabras con tres acciones encadenadas («restaura copias, aplica parches y revisa los registros de la base de afiliados»), después de «En una mutua de salud, un administrador de sistemas…» (sujeto largo antes del verbo).

**Corrección.** Ya incluida en A-1 (se parte en tres frases cortas: quién es, qué hace, de quién depende).

### B-4 · CORREGIR · `s04-02`/`s04-03`: «solo con lo que el puerto le dice» es ambiguo

**Dónde.** «Ahora, una empresa manda a los pasajeros los avisos de embarque, solo con lo que el puerto le dice. Trata los datos por encargo y con sus instrucciones.»

**Qué está mal.** «Solo con lo que el puerto le dice» se puede oír como «con los datos que le pasa el puerto» o como «lo que el puerto le indica que haga», y ese es justo el matiz que define al processor (instrucciones, no datos). La frase siguiente repite la idea con «con sus instrucciones» pero «sus» sin referente claro, y son dos frases cortas que se podrían decir de una vez.

**Corrección.** `s04-02`: «<curious> {processor}Ahora, una empresa manda a los pasajeros los avisos de embarque.» `s04-03`: «<clear> Trata esos datos por encargo del puerto, siguiendo sus instrucciones. Es el data processor.» (25 palabras frente a 32 para las dos; coincide con el chip de pantalla «por encargo del puerto, con sus instrucciones».)

### B-5 · CORREGIR · `s06-03`: «Fuera de esa línea» no se entiende sin verlo

**Dónde.** «Fuera de esa línea, la autoridad marítima nacional puede exigir un plan de protección aprobado.»

**Qué está mal.** «Esa línea» es la cadena consejo → comité dibujada en pantalla; sin imagen no remite a nada (regla 1: habla, no acotes).

**Corrección.** `s06-03`: «<firm> {regulator}Y luego está la autoridad marítima nacional, que puede exigir un plan de protección aprobado. Es una government entity, y gobierna desde fuera.»

### B-6 · OPCIONAL · `s02-02`: sujeto largo, «responsable… responde», «clasificó» sin presentar

«La persona responsable de la oficina de la terminal de pasajeros la clasificó y responde de ella» pone 11 palabras de sujeto antes del verbo, repite «responsable/responde» y «la» queda lejos de «la lista» (dos segmentos atrás). Mejora mínima, manteniendo el cargo de V32: «<clear> {owner}La persona responsable de la oficina de la terminal de pasajeros clasificó la lista y responde de ella. Eso es el data owner, un rol de negocio.» (+1 palabra.) Que «clasificar» no se explique hasta s03 es aceptable: el escenario de la pregunta 1 lo explica con «uso interno / confidencial».

### B-7 · OPCIONAL · `s01-02`: la frase del título

«Quién decide, que es lo que el examen casi siempre pregunta.» es una subordinada colgando del título. Más hablado y sin la frecuencia (A-5): «<confident> {title}Quién decide. Es lo que el examen suele preguntar. {promise}Lo vemos a tres alturas. Dentro de la casa, con la ley y arriba.» El cue `title` sigue en el mismo sitio (antes de los 12 s).

### B-8 · OPCIONAL · `s08-02`: el recap no repite la responsabilidad

La regla 2 de pantalla lleva «la responsabilidad no se va con el trabajo» y es el contenido de la tarjeta 3; la voz del cierre la omite (solo se dice una vez, en `s04-05`). La regla 4 del plan pide decir lo importante dos veces. «<clear> {rule-2}Con la ley, el controller decide para qué y el processor trata con sus instrucciones. La responsabilidad no se va con el trabajo.» (+8 palabras, ~3 s; el cierre ya pasa de presupuesto, así que solo si el guion tiene margen. Estimación del validador tras todas las correcciones: ~328 s con B-8 (~325 s sin él), frente a 323,9 s hoy y un techo de 330; en el render real, con la lectura de Lidia a ~0,89, unos 290-295 s. Si se quiere margen, se compensa quitando «Ojo,» de `s04-05` o el «Y además,» de A-3.)

### B-9 · OPCIONAL · `s06-01`: «responde de todo»

«Aprueba lo más importante y responde de todo» es una exageración de charla; la lección dice «responsabilidad última». «…aprueba lo más importante y responde en última instancia.» (el recap de s08 ya dice «el consejo responde»).

### Lo revisado sin hallazgo

- Reglas 2, 3, 6, 7, 9, 10, 12 del plan: conectores hablados («porque», «o sea», «ojo», «fíjate»); idea y luego nombre en cada rol; una imagen por concepto que vuelve tras la pregunta; ninguna cadena «¿Y X? Pues Y» (dos «¿Y …?» en 32 segmentos, por debajo de `OPENER_MAX`); humor solo en el marco (el sofá); emociones sin repetir seguidas; pausas 250-500 ms y 1000 ms antes de las tarjetas.
- «Tienta» es la fórmula de la casa (V28, V45). La glosa de «mejor» es la de V28 sin «más», correcta.
- No hay siglas deletreadas, dominios, equipos ni nombres: «SY0-701» y «5.1» solo en pantalla.
- Los cuatro avisos de longitud (segmentos de pregunta de 44, 54 y 33 palabras) son los de los demás vídeos con el mismo formato.

---

## Veredicto

**Congelar tras corregir A-1, A-2, A-3, A-4 y B-1 a B-5.** Cero bloqueantes. Las correcciones son ediciones de texto de una o dos frases, sin tocar la estructura de escenas, los cues obligatorios (se añade solo `steward-name`) ni la duración. Los OPCIONALES (A-5 a A-9, B-6 a B-9) se pueden decidir con Lidia al grabar.

Recuento por severidad:

| Severidad | Cuántos | Ids |
|---|---|---|
| BLOQUEANTE | 0 | |
| CORREGIR | 9 | A-1, A-2, A-3, A-4, B-1, B-2, B-3 (cubierto por A-1), B-4, B-5 |
| OPCIONAL | 9 | A-5, A-6, A-7, A-8, A-9, B-6, B-7, B-8, B-9 |

(B-3 se arregla con el mismo texto que A-1: en la práctica son ocho ediciones.)

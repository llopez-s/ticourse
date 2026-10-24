# Revisión de exactitud · G01 `dato-a-juicio`, G02 `niveles-audiencia`, G03 `ciclo-pir` (23-10-2026)

Revisor de solo lectura. Contrastado: `narration.json` (voz, tarjetas de examen, pausas para pensar, mensajes interceptados), `storyboard.json` (cada `goal`), `out/script-notes.md`, `out/canon-refs.md` y `lexicon*.json` de los tres vídeos, contra `src/data/s1.ts` (lecciones s1m1–s1m5), `src/data/labs.ts` (Lab 1A `:584-613`, Lab 1B `:519-566`), `src/data/course-gcti.ts:10-25`, el registro `docs/superpowers/canon/velvet-cicada.md` (§3, §4, §5, §7), la ficha `docs/superpowers/plans/fichas-gcti/README.md` y las reglas de `docs/superpowers/plans/2026-09-25-lesson-videos.md` §1 y §8.

Comprobaciones mecánicas (hechas con un script sobre los tres `narration.json`): todas las tarjetas de examen tienen ≤58 caracteres (la más larga, G01 s10-03, tiene justo 58; G02 s02-06, 57), todos los mensajes interceptados ≤70 (máx. 66), todas las pausas para pensar ≤48 (G03 s03-02, justo 48); como mucho una tarjeta por escena, ninguna en la última; como mucho un mensaje por capítulo; las 7 + 4 + 7 tarjetas llevan «Requirements» y todas tratan contenido de la lección de ese dominio. Ninguna frase pasa de 22 palabras. Búsqueda de fugas (`VC`, plantillas, lista de objetivos, cirílico, horarios falsos, HALL OF MIRRORS, kazuo, velvet-house, Stellar, Orbital, GLASS VIPER, E7, ENG-WS, winhlp, updsvc…) en los seis JSON de guion/storyboard: solo aparecen dentro de negaciones («no hay ni plantillas, ni lista de objetivos…»).

**Veredicto: ningún BLOQUEANTE.** Ninguna tarjeta de examen enseña algo falso, no se filtra nada del dosier de FIRST LIGHT ni de dosieres posteriores y no se da ninguna respuesta del Lab 1B. Hay 13 puntos «A CORREGIR» (los más serios: G03 s08-01, G03 s07, G01 s07/s11, G02 s04-01) y una colisión de analogía con G05 que obliga a que uno de los dos ceda.

Referencias de lección (todas `src/data/s1.ts`): definición de intelligence `:18`; tabla dato/información/inteligencia `:22-39`; nota de examen `:45`; Kent `:54`, cita `:57-60`; amenaza `:195-204`; ejemplos `:205-210`; malware = capability `:213`; riesgo `:218`; tabla de riesgo `:221-227`; nota de examen s1m2 `:233`; check ransomware `:238`; ventaja del defensor `:248`, puente a Kill Chain `:253`; s1m2q6 `:329-337`; tabla de niveles `:359-382`; error clásico `:388`; Sliding Scale `:393`; nota de examen s1m3 `:409`; seis fases `:546-551`; primera/última ignoradas `:556`; fallos por fase `:562`; palabras clave `:568`; F3EAD `:588`, engranaje `:592`; PIR `:715`, criterios `:718-724`, tabla `:731-738`, CMF `:743`, encargo `:749`, standing/ad hoc `:768`, nota de examen s1m5 `:774`.

---

## G01 · `dato-a-juicio` (s1m1 + s1m2)

### BLOQUEANTE
Ninguno.

### A CORREGIR

**G01-A1 · s02-04 (y storyboard s02 `intel`, glosa en español de la frase de `s1.ts:37`).**
- Dice: «Creemos que el atacante probablemente volverá a usar este proveedor, y recomendamos vigilar los registros nuevos en su red».
- Problema: la frase en inglés dice «monitoring new *registrations* on that ASN». En el mismo vídeo «registro» ya significa log («una línea del registro del proxy», s01-02), así que quien escucha entiende «vigilar logs nuevos». «En su red» no deja claro de quién (¿del atacante? ¿de la empresa?), y se pierde que el ASN es el del proveedor de alojamiento. Además «creemos» no es «we assess»: en estimación analítica «valorar/juzgar» es el verbo del juicio y «creer» suena a opinión, justo lo que la lección contrapone (`s1.ts:45`, «we assess»).
- Evidencia: `s1.ts:37` y `:45`; el propio `script-notes` (d) y (e)5 ya duda de «en su red» como glosa de «on that ASN».
- Propuesta: «Valoramos que el atacante probablemente volverá a usar este proveedor de alojamiento, y recomendamos vigilar los dominios nuevos que se registren en su red». Si se quiere conservar la frase corta: «…y recomendamos vigilar los registros de dominios nuevos en esa red». Pantalla: mantener «we assess / likely / recommend» tal cual.

**G01-A2 · s07-02, s11-02 y storyboard s07 (`tool`) y s11 (`rule-2`).**
- Dice: s07-02 «un malware es una capacidad y nada más»; s11-02 «el malware es solo la capacidad, no el adversario»; rule-2 «el triángulo con la pieza del malware marcada como solo la capacidad».
- Problema: en s05-03 el vídeo define la capacidad como «herramientas, infraestructura y la habilidad». Decir luego que el malware *es* la capacidad (y «solo» la capacidad) la reduce a un fichero y hace que el triángulo parezca «intención + malware + oportunidad». Un candidato puede acabar contestando «capability = malware». La lección dice «el malware es una *capability*, una herramienta» (`s1.ts:213`) y define capability como «herramientas, exploits, infraestructura y habilidad operativa» (`:201`): el malware es *una parte* de la capability.
- Propuesta s07-02: «Pero un malware es solo una herramienta, una parte de la capacidad. La amenaza es el adversario, la persona que la maneja con una intención». s11-02: «Y el malware es una parte de la capacidad, no el adversario». rule-2: marcar la herramienta como «una pieza de la capacidad». La tarjeta («El malware es capability; la threat es el adversario») es literal de s1m2q2 y puede quedarse tal cual.

**G01-A3 · s06-04, s06-05, s06-06 (y `others`).**
- Dice: s06-04 «Con las otras piezas pasa igual» y enseña solo dos parejas: capacidad sin oportunidad y intención sin capacidad.
- Problema: «las otras piezas» promete cubrir las tres ausencias. Falta la tercera: capacidad + oportunidad pero *sin intención*, que es exactamente s1m2q6 (`s1.ts:329-337`, «falta la intención») y que `script-notes` (a) reconoce que «el vídeo nunca enseña». El vídeo termina invitando a «resolver las doce preguntas» (s11-04), y una de ellas la contradice por omisión: el espectador que solo recuerde el vídeo tenderá a pensar que lo que falta es siempre opportunity o capability.
- Propuesta (añadir, o sustituir s06-05 por dos frases cortas): «Y si tienen herramientas y acceso, pero tus datos no les sirven a sus objetivos, hay capacidad y oportunidad sin intención». Presupuesto: ~20 palabras; se compensa quitando «Eso sí,» de s06-06 o acortando s06-04. Pantalla: añadir el tercer esquema «capability + opportunity sin intent» en `others`.

### SUGERENCIA

- **G01-S1 · s01-01 «primera mañana» frente a G03.** En G03 s01-01 el CISO pide «nuestros primeros PIRs», que la lección llama «tu primer encargo» (`s1.ts:749`). Dos «primeros» pedidos del CISO no cuadran. No contradice el canon (§2 no ubica nada de S1; `script-notes` (c)1 lo reconoce). Propuesta: G01 «Estás en tus primeros días en Meridian, una aeroespacial…» y dejar «primer encargo» solo a G03.
- **G01-S2 · s02-05, tarjeta «Intelligence = juicio orientado a una decisión».** Es la fila de la tabla (`s1.ts:36`), pero la definición del bloque (`:18`) y s1m1q1 dicen «información analizada que reduce la incertidumbre del decisor sobre un requirement». El vídeo nunca dice «reduce la incertidumbre» ni «información analizada». No es falso, pero un candidato que solo tenga la tarjeta ve media definición. Propuesta (49 car.): «Intelligence: info analizada que ayuda a decidir».
- **G01-S3 · s02-06 el «truco».** «Si la frase trae… un “probablemente”… es inteligencia» es el truco de la lección (`s1.ts:45`), pero dicho a secas permite pensar que un hecho con «probablemente» suelto basta. Propuesta: «Si la frase trae un juicio analítico, con su “probablemente” o una recomendación…».
- **G01-S4 · s05-06 «una amenaza real es la suma de las tres».** «Suma» invita a leer aditivo (dos de tres, dos tercios de amenaza). Propuesta: «Una amenaza real es la combinación de las tres». La tarjeta («Threat = intent + capability + opportunity») es literal de la lección y se queda. También: «en el examen las verás como intent, capability y opportunity» se apoya en `s1.ts:233`, que solo dice que la fórmula «cae directamente en preguntas»; es cierto que el examen está en inglés, pero la nota de examen no dice eso: mejor «en el examen están en inglés».
- **G01-S5 · s03-02 y storyboard s03 (`kent`).** La voz mantiene la cautela de la lección («al que se considera el padre…»), pero la ficha en pantalla dice «Sherman Kent · padre del análisis de inteligencia moderno», sin «considerado», y puede parecer que la cita inglesa es de Kent. Propuesta: ficha «Sherman Kent · considerado el padre del análisis de inteligencia» y, bajo la cita, «Paráfrasis de la escuela de Kent» siempre visible (`s1.ts:59`).
- **G01-S6 · s07-03 caña y pescador.** La imagen no falsea (herramienta frente a quien la usa), pero «lo que importa es el pescador» deja la caña (capability) como algo secundario. s08-03 lo repara («bloquear ficheros sigue valiendo»). Propuesta: «la caña sola no pesca: hace falta quien decide dónde, cuándo y con qué cebo».
- **G01-S7 · s07-04, posición de la tarjeta.** La tarjeta «El malware es capability; la threat es el adversario» sale al final de la oración de `human` («…no solo los ficheros»), pero resume s07-02. Con `examTiming: sentence-end` aparece mientras suena «Esos comportamientos son los TTPs…». Propuesta: mover el cue de la tarjeta a s07-02 (`tool`) o cambiar la tarjeta por «CTI estudia actores y TTPs, no solo ficheros».
- **G01-S8 · s10-03 y su tarjeta.** El «romper un eslabón» es del puente a la Kill Chain (`s1.ts:253`); la ventaja del defensor en sí es «muchos pasos en terreno que controlas y puedes instrumentar» (`:248`, s1m2q5). La tarjeta («cada paso es una ocasión de detectar») está bien, pero está pegada a la frase de «romper un eslabón». Propuesta: invertir el orden: primero «cada paso puede dejar rastro y tú controlas el terreno», nombre y tarjeta; luego «y te basta con romper un eslabón».
- **G01-S9 · s11-04 «las doce preguntas».** Tres de las seis de s1m1 (q4 y q6, de Collection, y q5, proceso/producto/profesión) tratan lo que el vídeo deja fuera (`script-notes` (a)). Propuesta: «Ahora toca resolver las doce preguntas. Las de los INTs y las tres caras de la inteligencia las tienes en la lección».
- **G01-S10 · s02-01 y la IP.** Canon `:117` ata `141.98.6.10` a `meridian-sso-portal.com`, el portal de phishing contra Meridian, y la ficha de EMBER FOX dice «bombardea con spearphishing»: quien una ambas cosas lee «la IP es de EMBER FOX». El vídeo no lo afirma y el mensaje es un consejo, no una confesión (coincide con `script-notes` (e)4). Aceptable; si Lidia quiere cortar la inferencia, decir en s02-01 que EMBER FOX «se cuela con un atajo, no con datos» y no mirar la IP a la vez que el mensaje.
- **G01-S11 · imagen «escalera»/«peldaños».** Storyboard s02 y rule-1 dibujan la progresión dato → información → inteligencia como peldaños; V23 evita «escalera» y «peldaño» en su guion (canon `:963-964`) y otros vídeos tienen escenas `escalera`. La voz de G01 no los dice, así que solo es visual. Sugerencia: «tres escalones» sin la palabra en voz, o un embudo, para no reciclar la imagen.
- **G01-S12 · s03-01, género.** «Si no estás segura» es el único mensaje de los 9 que marca género. Encaja con «primera analista» (lección), pero G02 y G03 no lo hacen. Alternativa neutra: «Si dudas, no digas nada. Espera a tener pruebas».
- **G01-S13 · s03-05 capitán sin GPS.** No falsea (navegación por estima: estimar con lo que tienes y corregir). Matiz menor: el capitán estima *dónde está* y el analista juzga *qué hará* el atacante, así que la imagen vale para «estimar con incertidumbre» pero no para «probabilidad». No se usa para eso. Sin cambio.

### Canon nuevo de G01 (`script-notes` (c)), juzgado
1. «Primera mañana» y la IP en el registro del proxy: inocuo (la IP y el «martes» son de la lección, `s1.ts:27,32,83`; canon `:68`), con el matiz G01-S1.
2. Tres mensajes de EMBER FOX: consejos de método, sin hechos nuevos ni confesión; coherentes con el tono de los mensajes ya publicados (canon `:199-225`).
3. Ficha «célula de acceso inicial»: del sabor de la sección (`course-gcti.ts:17-19`), visible antes del boss.
4. Caso genérico del ransomware en instalación aislada: es el check de s1m2 (`s1.ts:238`), rotulado «no es Meridian». Inocuo (V9 usa ransomware como hipótesis H2, canon `:579`, sin relación).
5. Analogías (fuego, caña/pescador, capitán): libres en los vídeos publicados (comprobado con búsqueda en todas las `narration.json`; solo `dato-a-juicio` las usa).

---

## G02 · `niveles-audiencia` (s1m3)

### BLOQUEANTE
Ninguno.

### A CORREGIR

**G02-A1 · s04-01, capítulo 2, chip `promise` de s01-02 y rótulo del capítulo («La escala de las defensas»).**
- Dice: «la Sliding Scale of Cyber Security, que ordena las defensas en cinco categorías»; chip «la escala de las defensas».
- Problema: la lección dice que ordena «las *inversiones de seguridad* en cinco categorías» (`s1.ts:393`). Offense («acciones legales de respuesta contra el adversario») no es una defensa, y decir «ordena las defensas» hace que el espectador piense que Intelligence y Offense son tipos de defensa. Un candidato que memorice «escala de defensas» puede dudar con la categoría Offense.
- Propuesta: «…la Sliding Scale of Cyber Security, que ordena las inversiones de seguridad en cinco categorías». Capítulo: «La escala de la seguridad»; chip: «la escala de la seguridad».

**G02-A2 · s03-01 (mensaje) y s03-02.**
- Dice: mensaje «Mándale al consejo las direcciones…»; s03-02 «Al consejo le llega una lista de cuatro mil direcciones. No puede bloquear nada ni decidir dónde invertir con ella».
- Problema (1): «direcciones» sin «IP» es ambiguo (postales, correo); la lección dice «a list of 4,000 malicious IPs» (`s1.ts:439`). El espectador solo ve «IP» en los chips de pantalla, no en la voz ni en el mensaje. Problema (2): «no puede bloquear nada» sitúa mal el fallo: el consejo no bloquea; lo que no puede es decidir hacia dónde va el sector ni dónde invertir. Dicho así parece que el consejo necesitaba bloquear, justo lo contrario de la distinción entre niveles.
- Propuesta: mensaje «Mándale al consejo las IP. Cuantas más, más seria parece.» (59 car.). s03-02: «Al consejo le llega una lista de cuatro mil direcciones IP. No le dice hacia dónde va el sector ni dónde invertir».

**G02-A3 · colisión de analogía con G05 (`video/producto-bluf/narration.json:343,383,395`).**
- G02 s02-01/02 usa el tiempo (parte de hoy, previsión, clima) como imagen de los tres niveles; G05, de la misma tanda, usa «el pronóstico del tiempo… 70 % de lluvia» para probabilidad frente a confianza. `script-notes` de G02 comprobó solo los vídeos *publicados*; el de G01 evitó el tiempo precisamente porque lo ocupa G05 (`dato-a-juicio/out/script-notes.md` (c)5). Dos conceptos distintos con la misma imagen en la misma pista y a pocos vídeos de distancia: el espectador mezclará «previsión» (operational, semanas) con «probabilidad de lluvia».
- Propuesta: que ceda G02 (G05 es más difícil de cambiar, porque la analogía de la lluvia es la estructura de su explicación). Tres tiempos sin meteorología: «la alarma de esta mañana, la agenda del mes, el plan del año» (tactical, operational, strategic). Las escenas `today/week/climate` se rehacen con un despertador, un calendario mensual y una hoja de ruta anual. Hay que volver a pasar el emparejamiento de la grabación (`lexicon`, sin cambios).

**G02-A4 · ficha de EMBER FOX distinta de la de G01 y G03 (storyboard s03 y s05).**
- G02 pone «EMBER FOX · célula de acceso inicial · spearphishing»; G01 s02 y G03 s02 ponen «EMBER FOX · célula de acceso inicial». Ambas son lícitas (el sabor de la sección es visible antes del boss, `course-gcti.ts:17-19`, y no se dan plantillas ni objetivos), pero la misma ficha tiene que ser idéntica. Propuesta: «EMBER FOX · célula de acceso inicial» en los tres (es la ficha que G01, que la estrena, ya fija). Esta es la forma más segura frente a §4.

### SUGERENCIA

- **G02-S1 · s02-04 «la previsión» y horizonte.** Una previsión del tiempo «de la semana» son días, no «semanas o meses» (`script-notes` (d)5 lo admite). Si se mantuviera la analogía: «la previsión de las próximas semanas». Queda resuelto por G02-A3.
- **G02-S2 · s04-05 «Encima, Intelligence» frente a la linterna.** Storyboard s04: Intelligence es una linterna «que ilumina la casa sin ser parte de ella»; la voz dice «Encima», y en s05-03 la inteligencia es el tejado («empezar la casa por el tejado»). Tres imágenes para una pieza. Propuesta: Intelligence es el tejado (la imagen de la propia lección, `s1.ts:409`) y Offense queda como «el arma de la azotea, con candado»; «Encima» pasa a «Luego, el tejado: Intelligence, conocer al adversario…».
- **G02-S3 · s04-05 «acciones legales contra el adversario».** La lección dice «acciones legales *de respuesta* contra el adversario» (`s1.ts:402`). La voz suprime «de respuesta»; «contra el adversario» a secas puede sonar a ataque. Propuesta: «acciones legales de respuesta contra el adversario, casi siempre cosa de estados».
- **G02-S4 · s04-07, segunda mitad.** «Si un analista lo usara para cazar, ya sería Active Defense» no está en la lección. Es defendible (la actividad, no la herramienta, define la categoría), pero s1m3q4 pregunta por el EDR que bloquea sin analista y el candidato puede acabar pensando que «EDR» cambia de categoría según quién lo toque. Reformular para que se mueva la actividad: «Lo que decide la categoría es si hay una persona en el bucle: si el analista usa la telemetría para cazar, esa actividad es Active Defense», o cortarla (queda la primera mitad).
- **G02-S5 · s05-01, la réplica a EMBER FOX.** El mensaje empuja dos atajos («compra inteligencia», «los parches, ya si eso») y la réplica solo contesta el primero; el error de saltarse la base se corrige después en s05-03. Propuesta: «Qué buen atajo, saltarte los parches. Pero ¿quién va a usar esa inteligencia?».
- **G02-S6 · regla 1.** s02-06/`lens` dice «el nivel lo marca quién lee y qué tiene que decidir» y s06-01/`rule-1` dice «quién lee y cuándo decide». La lección: la audiencia define nivel, producto *y horizonte* (`s1.ts:355`). Unificar: «El nivel lo marca quién lee y qué tiene que decidir, y para cuándo».
- **G02-S7 · s03-05 «la primera regla».** La lección: «regla nº 1 *de la diseminación*» (`s1.ts:388`). Propuesta: «la regla número uno de la diseminación es producto correcto para audiencia correcta».
- **G02-S8 · s05-05 «tus dos sobres de hoy salen bien».** Suena a entrega con éxito; el storyboard (`back`) dice que es lo que prepara, no lo entregado. Propuesta: «Y tus dos sobres de hoy ya tienen su contenido: reglas para el SOC, tendencias para el consejo».
- **G02-S9 · notas desactualizadas.** `out/script-notes.md` (decisión 1) dice que la voz provisional es `Microsoft Helena`; `narration.json` fija `Pablo` + `machine`, como G01 y G03. Corregir las notas.
- **G02-S10 · cobertura de la nota de examen.** La nota de la lección (`s1.ts:409`) clasifica además «parchear = Architecture» e «informes de actor = Intelligence»; en G02 solo salen en pantalla. La escena s04 ya tiene su tarjeta (s04-04), así que no cabe otra ahí; si se quiere reforzar, decir una vez en voz «parchear es Architecture» en s04-02 (ya lo dice: «segmentación y parcheo») y «un informe de actor es Intelligence» en s04-05.

### Canon nuevo de G02 (`script-notes` (c)), juzgado
Dos peticiones (consejo/SOC) como preguntas sin decisión: coherente con canon `:85,102` (el SOC y el CISO preguntan, no deciden). Cruce de sobres: prueba mental rotulada «Ejemplo hipotético · no ha pasado en Meridian». «4.000 direcciones» y «tendencias del sector»: de los checks de la lección (`s1.ts:439,438`). Todo inocuo. Los dos mensajes son atajos de método sin hechos nuevos (ver tabla de mensajes).

---

## G03 · `ciclo-pir` (s1m4 + s1m5)

### BLOQUEANTE
Ninguno.

### A CORREGIR

**G03-A1 · s08-01 «Hay preguntas que no caducan».**
- Dice: «Hay preguntas que no caducan. “¿Qué actores apuntan a nuestro sector?” se hace siempre, y se revisa cada cierto tiempo. Son los standing requirements».
- Problema: s06-05 acaba de decir «lleva fecha, porque las prioridades caducan» (criterio «acotado en el tiempo», `s1.ts:724`), y s1m5q1 incluye como distractor falso «PIRs never expire» (`s1.ts:786`). Un standing requirement no caduca *al responderse* (a diferencia del ad hoc), pero sí se revisa y puede cambiar de prioridad, porque la lección dice «se revisan periódicamente» (`:768`). «No caducan» a secas choca con s06-05 y con el distractor.
- Propuesta: «Hay preguntas que no se responden una vez y se acabó. “¿Qué actores apuntan a nuestro sector?” se hace siempre, y se revisa cada cierto tiempo. Son los standing requirements». La tarjeta («Standing: permanente. Ad hoc: nace de un evento») es literal de la lección y se queda.

**G03-A2 · s07-02 a s07-04 y storyboard s07: la candidata B frente a la regla «y también».**
- Dice: B «Which ransomware affiliates exploit internet-facing VPN appliances like ours, and which initial-access behaviors should our SOC alert on?» (`s1.ts:737`) se declara «bien formada… trata un solo asunto… acaba en algo que vigilar». Antes (s07-01) la narradora dijo: «Dos asuntos distintos pegados con un “y también” son dos requirements, no uno».
- Problema: en pantalla, B lleva un «and which…» de dos cláusulas, y el criterio de la lección es «una sola pregunta por requirement — nada de “y también…”» (`s1.ts:719`). El espectador que lee B puede concluir que la regla no se cumple o que da igual. `script-notes` (e)4 pide que el revisor confirme que «no suena a contradicción». No es contradicción *si se dice*, pero hoy solo lo cubre una cola de seis palabras.
- Propuesta s07-04: «La segunda. La primera es un tema, no una pregunta, y nadie cambia nada por oírla. La segunda tiene dos mitades, pero es un solo asunto: cómo entran esos grupos y qué debería hacer saltar la alarma. Eso no es un “y también”: la segunda mitad es lo que harás con la respuesta». Pantalla: resaltar la coma de B como «misma pregunta, su consecuencia de detección». Mantener el cierre de s07-05 (bien formada ≠ prioritaria), que es la protección correcta frente al Lab 1B.

**G03-A3 · s05-03 «Find, Fix y Finish… o sea, contener el incidente».**
- Dice: «Los tres primeros, Find, Fix y Finish, son la operación. Localizar, fijar y neutralizar, o sea, contener el incidente».
- Problema: la lección solo equipara Finish con contener (`s1.ts:588`: «tras contener un incidente (*finish*)»). Find y Fix son localizar y fijar al adversario, no contener. Dicho así, un candidato puede responder «Fix = containment».
- Propuesta: «Los tres primeros, Find, Fix y Finish, son la operación: localizar al adversario, fijarlo y neutralizarlo, hasta contener el incidente».

**G03-A4 · EMBER FOX nombrado o no en voz y ficha.** Ver sección «Consistencia» (C1, C2).

### SUGERENCIA

- **G03-S1 · s08-01/s08-02, imagen carta fija / banquete.** La carta es lo que *ofrece* el restaurante y el banquete es un *encargo* del cliente: lado de oferta frente a lado de demanda. Un standing requirement es un encargo permanente. Propuesta: «el pedido fijo de cada semana» frente a «el encargo de un banquete». Pantalla: la carta fija pasa a un pedido que se repite.
- **G03-S2 · s10-03 «el ciclo… gira más rápido con F3EAD».** F3EAD no es el ciclo de seis fases acelerado; es un bucle táctico complementario (`s1.ts:592`, «acelera el bucle táctico entre operaciones e inteligencia»). Propuesta: «y en un incidente entra F3EAD, un bucle más rápido».
- **G03-S3 · s09-01 «En el examen suele aparecer…».** La lección dice «Clasifica actividades por fase» (`s1.ts:568`), no que «suela aparecer». Es una afirmación sobre el examen real que el vídeo no puede sostener (la app es independiente y no afiliada). Propuesta: «Una pregunta típica da una actividad y te pide la fase». Añadir tras s09-02: «Pero lo que manda es lo que se hace con el dato, no la palabra suelta».
- **G03-S4 · s03-02, pausa para pensar.** `think.q` dice «¿Planning o Collection?»; el storyboard (s03) dice «¿Qué fase falta?». Igualar, y dejar las dos opciones solo si Lidia prefiere elegir entre dos.
- **G03-S5 · Lab 1A.** El hilo de seis estaciones en orden (s02, storyboard) y la lista de s02-02 son, de hecho, la respuesta del Lab 1A «Lifecycle Assembly» (`labs.ts:584-613`: exactamente esas seis fases y esa glosa). He juzgado esto *aceptable*: es la lista ordenada de la propia lección (`s1.ts:543-552`) y s1m4q1 la enseña; el vídeo no nombra el laboratorio. Lo anoto para que quede por escrito, no en silencio. Si Lidia quiere proteger el laboratorio, la alternativa es presentar las seis fases como estaciones desordenadas y ordenarlas con la voz, pero eso es decisión de producto, no de exactitud. El cierre solo remite al Lab 1B.
- **G03-S6 · s02-04, Planning.** «Ahí defines con quien decide qué necesita saber» omite «planificar la colección» (`s1.ts:546`). s03-03 lo recupera («las fuentes que planificaste»). Propuesta: «…y planificas cómo vas a recoger lo que haga falta».
- **G03-S7 · s06-01 «toca escribirla bien».** El Lab 1B es de *elegir* cuatro de ocho (`labs.ts:45-56`, `:521`), no de redactar. s10-04 lo dice bien («donde los eliges tú»). Propuesta: «toca elegirla bien» o «toca reconocer una bien formada».
- **G03-S8 · s02-02, «se cocina».** Choca de lejos con la cocina de V9 (`ach-matriz/narration.json:244,284`, GCTI, también publicado), como ya sugiere `script-notes` (e)3. Propuesta: «se prepara en el fogón» o «se guisa».
- **G03-S9 · s05-01 «Pasa mucho…».** Dato de frecuencia sin apoyo en la lección. Propuesta: «Pasa fácil cuando…».
- **G03-S10 · s03-05 Processing frente a Planning.** La lección trata el «terabytes crudos imposibles de analizar» como fallo de *Processing* (`s1.ts:562`) y la falta de dirección como fallo de *Planning*. El vídeo los encadena en una causa («si no sabes qué buscas, aquí te ahogas»). Es razonable y no falsea, pero no es lo que dice la lección. Mantener, sin cambio.
- **G03-S11 · cierre.** G01 y G02 despiden con «tu turno: las preguntas de la lección»; G03 solo con el Lab 1B. Añadir «y las doce preguntas de las dos lecciones» (s1m4 y s1m5) para que sea simétrico.

### Canon nuevo de G03 (`script-notes` (c)), juzgado
Doce feeds (cifra de s1m4q4, `s1.ts:659`, sin nombres): suposición «Imagina que…», inocua. Comanda «mesa cuatro, pescado sin gluten, antes de las diez» y estaciones del restaurante: analogía. «Fuente A / fuente B»: relleno. «Un informe técnico al consejo»: de `s1.ts:562`, rotulado como imagen. Los cuatro mensajes: atajos de método (ver tabla). Sin Lab 1B (ver abajo).

---

## Lab 1B y spoilers del §4 (los tres vídeos)

- **Lab 1B no se resuelve.** Ninguna de las ocho opciones de `labs.ts:524-565` aparece, ni parafraseada («tres proveedores con VPN», «ransomware no es la amenaza prioritaria»). La candidata B de G03 s07 viene de la tabla de la lección (`s1.ts:737`), no del laboratorio, y s07-05 («bien formada no es lo mismo que prioritaria; eso lo valida quien decide») es la salvaguarda correcta. Matiz: B habla de VPN; la segunda opción buena del laboratorio, de «proveedores con acceso VPN». No son lo mismo, pero el rótulo «Ejemplo de la lección · no es el caso de Meridian» debe verse todo el tiempo.
- **Lab 1A**: ver G03-S5.
- **FIRST LIGHT (§4, `course-gcti.ts:21`):** ni «VC», ni plantillas, ni lista de objetivos aeroespaciales, ni que alguien compre acceso. En G01, la frase de la lección «a quien sí la tiene en su lista» (`s1.ts:218`) se cambió por «a quien sí va a por ella» (s09-05): correcto. EMBER FOX solo habla con consejos de método.
- **Dosieres posteriores (BROKEN CHAIN, DEEP WELL, HALL OF MIRRORS, LAST WORD):** sin rastro. No hay hosts, hashes, E7, GLASS VIPER, VELVET CICADA (como actor), ni «UTC+8».
- **`canon-check`/`canon-refs`:** G01 solo registra `141.98.6.10` (ya con historia: canon `:68,:115-117`, V4, `s1.ts:27,32,83`, `labs.ts:406,664`) y no repite ningún dato de otra manera: «el martes», sin fecha, ni hora ni equipo. G02 y G03: cero tokens.

## Mensajes interceptados de EMBER FOX (item 6)

| Segmento | Mensaje | Juicio |
|---|---|---|
| G01 s02-01 | «Es solo una IP. Bloquéala y a otra cosa, analista.» | Atajo de método. No confiesa. |
| G01 s03-01 | «Si no estás segura, no digas nada. Espera a tener pruebas.» | Atajo. Género: G01-S12. |
| G01 s07-01 | «Quita el programa y se acabó la amenaza. Persigue el fichero.» | Atajo. La lección lo desmonta (`s1.ts:213`). |
| G02 s03-01 | «Mándale al consejo las direcciones. Cuantas más, más seria parece.» | Atajo; ambiguo («direcciones», G02-A2). |
| G02 s05-01 | «Compra buena inteligencia, analista. Los parches, ya si eso.» | Atajo. Corrección parcial en la réplica (G02-S5). |
| G03 s02-01 | «Tú recoge de todo, que ya encontrarás la pregunta.» | Atajo. Desmontado en s03. |
| G03 s04-04 | «Si nadie se queja, es que el informe ha gustado.» | Atajo. |
| G03 s05-01 | «Cerrado el incidente, a otra cosa. Mirar atrás es perder tiempo.» | Atajo. |
| G03 s07-01 | «Mete todas tus dudas en una sola pregunta. Así preguntas menos.» | Atajo. |

Ninguno confiesa, nombra un objetivo, un destinatario, un correo ni un comprador, ni contradice los mensajes ya publicados (canon `:199-225`). La frase «a otra cosa» se repite en G01 s02-01 y G03 s05-01: tic de personaje, útil y coherente.

## Consistencia entre los tres vídeos (item 7)

- **C1 · EMBER FOX nombrado en voz.** G01 (s02-01 «Se cuela EMBER FOX con un atajo», s03-01 «Otra vez EMBER FOX», s07-01 «EMBER FOX vuelve…») y G03 (s02-01 «Se cuela EMBER FOX, una célula de acceso inicial…») lo nombran; G02 nunca, por regla de sus notas (`script-notes` decisión 2). Elegir una: lo más razonable es que G02 también lo nombre una vez («se cuela EMBER FOX» en s03-01), porque es una cápsula que puede verse sola y el espectador no tiene otra forma de saber quién habla. A CORREGIR por consistencia.
- **C2 · Ficha en pantalla.** G02-A4. Misma ficha en los tres.
- **C3 · Voz.** Los tres `narration.json` fijan `sapi/Microsoft Pablo`, `rate` 0, `machine`: coherente entre sí y con GLASS VIPER, HOLLOW LANTERN y VELVET CICADA (canon `:187-195`). Lo distingue la firma en pantalla. Las notas de G02 dicen otra cosa (G02-S9).
- **C4 · Tono.** G01: seco y sardónico; G02: seco; G03 (notas): «vendedor amable». «Analista» sale en 1 de 3 mensajes de G01, 2 de 2 de G02 y 0 de 4 de G03. Recomendación: que EMBER FOX diga «analista» en aproximadamente la mitad de sus mensajes y mantenga el imperativo corto (como PAPER CRANE y VELVET CICADA), y que G03 no se salga hacia lo «amable».
- **C5 · Léxico.** `FOX`: «foks» en G01, «fox» en G03. Unificar a «foks» (los tres léxicos: `EMBER` «émber» ya coincide). G02 no nombra el adversario en voz.
- **C6 · Analogías.** Fuego, caña/pescador y capitán (G01), restaurante (G03), sobres, casa y tiempo (G02) no se repiten entre sí. Colisiones: tiempo de G02 con G05 (G02-A3), cocina de G03 con V9 (G03-S8), «escalera/peldaños» de G01 con V23 (G01-S11). «Casa» de G02: V13 usa casa y ladrón para la Kill Chain; aquí no hay ladrón ni llaves, y `script-notes` lo ha comprobado.
- **C7 · Líneas repetidas.** G01 s01-04 y G03 s01-04 son casi idénticas («corren rumores de robo de diseños, y el consejo está nervioso»). Es la frase de la lección (`s1.ts:749`), pero quien vea los dos seguidos la oirá dos veces. Variar una (p. ej. en G03: «Y no es un trámite, porque el sector anda inquieto y el consejo también»).
- **C8 · Continuidad de «primera».** G01 «primera mañana» frente a G03 «el CISO te pide… primeros PIRs»: G01-S1.
- **C9 · Pregunta de cierre.** G01 «las doce preguntas», G02 «las seis», G03 solo Lab 1B: G03-S11.
- **C10 · Orden de visionado.** G02 y G03 se entienden solos (G03 `script-notes` (e)6); G02 asume G01 (el consejo y el SOC «salen sin presentarlos»). Aceptable.

## Lo que está bien

- Las definiciones de dato, información e inteligencia, la tabla, la frase en inglés y el truco de examen (G01 s02) son literales de `s1.ts:22-45`; Kent con la cautela de «se considera» (s03-02) y el «juicio calibrado con confianza explícita» (`s1.ts:54`).
- La distinción entre lenguaje estimativo («probablemente») y confianza («cuánto te fías») se mantiene separada (G01 s04-03), y la escala de grados se deja para la sección 5 (bien).
- La amenaza como intent + capability + opportunity, la tabla de riesgo con CTI en el factor threat, la ventaja del defensor y el puente a la Kill Chain (G01 s05, s09, s10): exactos. El triángulo del fuego es química correcta y no se asigna cada lado a un componente (s05-05).
- El caso de la instalación aislada (G01 s06) es el check de la lección, con la solución «opportunity» y el «hoy no es nunca».
- Los tres niveles, sus audiencias, preguntas y horizontes (G02 s02), el error clásico, el orden de la Sliding Scale, la clasificación de actividades y «multiplica, no sustituye» (G02 s03-s05) coinciden literalmente con `s1.ts:359-409`. No existe un nivel «technical» (se ha vigilado, `storyboard` s02).
- Las seis fases con sus nombres, los fallos típicos por fase, las palabras clave del examen, F3 = operaciones y EAD = inteligencia, y el engranaje de los dos ciclos (G03 s02-s05, s09) coinciden con `s1.ts:540-593`.
- Los criterios de un PIR, quién valida la prioridad, standing frente a ad hoc, y la colección dirigida por requirements (G03 s06, s08) coinciden con `s1.ts:715-774`.
- Las 18 tarjetas de examen dicen algo verdadero según la lección y cumplen formato.
- Ningún mensaje de EMBER FOX contradice nada ni da hechos nuevos; el canon nuevo es relleno neutro (sin fecha, persona, equipo, hash, dominio ni IP).
- Los títulos de escena no destripan las preguntas para pensar.
- La estimación de duración de los tres cabe en su perfil (G01 539 s, G02 250 s, G03 506 s).

## Resumen (cinco líneas)

1. Ningún BLOQUEANTE: sin fugas de FIRST LIGHT ni de dosieres posteriores, sin respuestas del Lab 1B (el orden del Lab 1A coincide con la lista de la lección: decisión anotada), y ninguna de las 18 tarjetas de examen enseña algo falso.
2. G01 (3 A CORREGIR): traducción de la frase de inteligencia («registros nuevos», «en su red», «creemos»), «el malware es solo la capacidad» frente a la definición de capacidad, y falta la ausencia de *intent* (s1m2q6) tras «con las otras piezas pasa igual».
3. G02 (4): «ordena las defensas» (la lección dice inversiones; Offense no es defensa), el error del consejo que «no puede bloquear» y «direcciones» ambiguas, la analogía del tiempo choca con G05, y la ficha de EMBER FOX difiere (spearphishing).
4. G03 (3 propios + consistencia): «hay preguntas que no caducan» choca con s06-05 y con el distractor «PIRs never expire», la candidata B tiene dos cláusulas frente a la regla «y también», y «Find, Fix y Finish = contener» (solo Finish contiene).
5. Cruzado: fijar si la voz nombra a EMBER FOX (G02 no), una sola ficha, unificar el léxico `FOX`, y ajustar «primera mañana» (G01) frente a «primer encargo» (G03).

# Fichas de la tanda 4, GCTI: V22 y V23 · decisiones para aprobar en una ronda

Fecha: 8 de octubre de 2026. Las fichas completas, listas para pegar en el plan de vídeos
(`docs/superpowers/plans/2026-09-25-lesson-videos.md`, §5, después de V17), están en esta carpeta: `ficha-V22.md` y
`ficha-V23.md`. Aquí van las decisiones que cada ficha ya toma, con la alternativa descartada, los riesgos para quien escriba
el guion y para el revisor de exactitud, los cambios de lección y de registro que se proponen (solo propuestos; ninguno está
aplicado) y lo poco que solo puede decidir Lidia. Basta con decir qué cambia; lo que no se diga, queda como está. Rutas
relativas a la raíz del repo.

**Qué se comprobó y qué no.** Los límites del perfil `capsula-yt` (tarjetas, pregunta, mensajes, escenas, capítulos, suma de
segundos y símbolos prohibidos) se recontaron con un script de Node que lee las mismas reglas que
`video/engine/scripts/lib/profiles.mjs` y `narration.mjs`; el resultado, en el apartado «Comprobación de límites» de cada
ficha. **No** se ha pasado la revisión de exactitud y canon por un subagente independiente (es el paso siguiente, antes de
escribir ningún guion), ni `build-timeline --estimate` (todavía no hay guion). Los segundos de cada escena son propuestas
calibradas con V7, V8 y V15 (218 s las tres). Las definiciones de los verbos de V22 son las de la lección: no se han
contrastado con el material oficial ni con el artículo de Lockheed Martin. La revisión (de memoria, tampoco contrastada) corrige
mi sospecha: en el artículo, Degrade es frenar (colas, tarpit), como en la lección; lo que cambia es Deceive (un DNS redirect), así
que un lector que venga del original pondría el sinkhole en Deceive. El vídeo sigue la lección y el Lab 2C, donde es Deny.

## Lo que se ha decidido

1. **Las dos son cápsulas de 218 s, sin fecha ni resultado**, como V9 y V15. Fechar V22 (el C2 a la vista, «48 horas») o V23
   (una atribución) obligaría a explicar E9, el último `last seen` del C2 y la exfiltración del punto 7 de §5 (V22), o a
   adelantar el informe final y el dosier de HALL OF MIRRORS (V23).
2. **V22 = s2m2** «Courses of Action: ¿cortas o miras?» (carpeta `coa-precios`, GLASS VIPER) y **V23 = s4m5** «Atribución:
   ¿quién fue? Los tres niveles y las pistas falsas» (carpeta `atribucion-cuadro`, PAPER CRANE). Numeración por el orden del
   curso, como se pidió.
3. **Ninguna voz ni efecto nuevos.** GLASS VIPER habla con la de V3, V7 y V13 (Pablo con `machine`) y PAPER CRANE con la de V9
   (Laura con `machine`).
4. **Cada una cuenta el porqué y una demo, no el orden.** V22 tiene la penalización del ranking (Lab 2C, que ya clasifica
   ocho medidas); V23 no tiene laboratorio, pero la lección es una tabla y tres ideas, y el vídeo las pone a trabajar.
5. **Una imagen por vídeo, nueva en GCTI:** la tienda del barrio (V22) y atribuir un cuadro (V23).
6. **Tres cambios de lección que se proponen** (todo texto, sin ids ni respuestas) y uno opcional; ver «Cambios propuestos».
7. **Ninguna pregunta bloquea.** Hay dos recomendaciones al final para que Lidia diga solo qué cambia.

## V22 · s2m2 · «Courses of Action: ¿cortas o miras?» · decisiones para aprobar en una ronda

La ficha completa está en `ficha-V22.md`. La matriz que sale en pantalla es la de la lección (`src/data/s2.ts:316-349`).

1. **Tres conceptos: los dos pares que se confunden, leer la matriz por filas y el precio de cada acción visible.**
   Descartado recorrer los siete verbos con su definición y su ejemplo (la tabla de `:285-294`): es lo que ya hacen la
   lección y el Lab 2C, cuyos ocho ítems son casi las filas de esa tabla (`src/data/labs.ts:352-392`), y la nota de examen
   de la lección dice que lo que confunde son los pares, no los siete (`:297-301`). Tampoco se clasifica ninguna medida
   en pantalla.
2. **La decisión que cuesta: cortar el C2 o seguir mirando, con la premisa dicha como suposición.** «Nada robado y lo crítico a salvo:
   ¿cortas?» (revisión del 2026-10-08: la primera versión, «Aún no sacan nada», dejaba fuera la condición «mientras proteges los
   activos» de `:309` y se leía como regla) se contesta con la lección: no cortar, seguir mirando con Detect y Degrade mientras lo valioso esté
   protegido; si ya se llevan lo crítico, contener ahora y recoger después (s2m2q4 y q8), y decide el negocio (`:352`).
   Descartado preguntar «¿Deny o Disrupt?» sobre el equipo que ya llama a casa, que es el check 3 de la lección
   (`:379-388`) y el ítem 5 del Lab 2C. Descartado también preguntar «¿qué celda avisa más al actor?», que es el check 1
   y no es una decisión.
3. **Sin fecha, sin resultado y sin «48 horas».** El ejemplo de la lección («lo monitorizas 48 h», `:314`) coincide con el
   «+2 días» de E9 en V3 y el pDNS de `update-svc-cdn.com` acaba el 7-3 en V4; si el vídeo dijera que Meridian miró 48 horas,
   daría a entender que Meridian vio salir los datos (registro §5, punto 7). La voz dice «un tiempo»; el vídeo no dice si se
   corta, y la matriz es el menú de trabajo de la analista, no lo desplegado por Meridian. Descartado fechar la reunión
   entre la alerta del 5-3 y E9.
4. **Una imagen para todo: la tienda del barrio, con la regla «un gesto, un verbo».** La cinta grabada de ayer (Discover) y la
   alarma con la cámara en directo (Detect), la persiana que se echa antes de entrar (Deny) y sacar a alguien en plena faena
   (Disrupt), la puerta con varias medidas (resiliencia) y, para el C2, un walkie: el sinkhole es que no conteste a nadie (Deny) y
   Detect más Degrade, dejarle hablar por una línea ruidosa (precio). La primera versión usaba «echar al sospechoso» para el
   sinkhole y para Disrupt, y la cámara para Discover y para Detect: enseñaba sinkhole igual a Disrupt (revisión, bloquea).
   Descartado reutilizar «echar» o la persiana para el C2.
   Descartada la casa y el ladrón de V13 (misma sección, pero V13 ya la usa para las siete fases), la carretera con radar,
   barrera y badén (que encaja con los verbos pero repite el coche de V15), la cocina de V9 y la fontanería (no hay
   intelligence gain/loss en un grifo).
5. **El vídeo va al final de la lección, después de los tres checks.** Lección, checks, vídeo y Lab 2C, como V9 y V13.
   Descartado antes de los checks (V3, V7, V15): el check 1 es la pregunta del sinkhole y la pregunta del vídeo la
   contestaría.
6. **Dos mensajes de GLASS VIPER, sin «analista» (que es de HOLLOW LANTERN y PAPER CRANE):** «Ponme todas las alarmas que
   quieras. Para pararme ya habrá tiempo.» (error: detectar es defender; sin la fórmula «Tú + imperativo» de V13) y «Córtame ya. Me mudo en cinco minutos y vuelves a empezar.» (error:
   cortar ya es siempre lo correcto; la respuesta dice que es un cebo para que gastes tu visibilidad, porque ya son tres vídeos en los que el adversario pide que bloquees). Descartado un tercero sobre «un solo filtro bueno» (se cuenta en la escena de
   resiliencia, sin mensaje, porque el perfil admite uno por capítulo y solo hay dos capítulos con escenas) y descartado
   cualquier mensaje de HOLLOW LANTERN (no es su sección). No repiten el argumento de V7 («Bloquea mi hash»: lo que le cuesta
   cambiar a él); este es lo que cuesta a quien corta.
7. **La matriz sale con tres retoques en pantalla** («hacia el C2» en vez de «hacia la IP del C2»; «el actor lo sabrá en
   minutos» en vez de «quema el hilo»; la celda del buzón señuelo atenuada). Descartado copiarla literal: ver los dos primeros
   riesgos y los cambios propuestos. Discover y Destroy no ocupan celda en el extracto y la pantalla lo dice, en vez de
   inventar una celda.
8. **Cierra en el Lab 2C**, porque el vídeo no hace lo que el laboratorio pide.

### Riesgos

- **El Lab 2C queda mostrado en gran parte, y la ficha ya no dice lo contrario.** La primera versión afirmaba que el vídeo no
  enseñaba la etiqueta de ninguno de los ocho ítems; es falso (la matriz de la lección trae seis, y los ejemplos de s02 eran los
  ítems 1 y 3). Ahora: s02 sin ejemplos del laboratorio, el ejemplo de Detect es una celda que no es ítem, y la ficha dice que el
  vídeo enseña la matriz, que ya contiene seis de los ocho, sin añadir ninguno ni practicarlos. Ni `script-notes.md` ni el guion
  deben repetir la afirmación vieja.
- **El sinkhole es Deny aunque el C2 ya llame.** Una frase en voz lo resuelve: «no mata la llamada de hoy, hace que las siguientes
  no lleguen a ninguna parte». «Matar la conexión activa» es Disrupt (`s2.ts:290`). La tarjeta de s03 pasó a «Deny: no llega a
  funcionar; Disrupt: lo cortas en curso» por lo mismo.
- **Eco con V13.** V13 cierra con «cuanto más a la izquierda cortes, más pasos le quitas» y V22 dice «mira un tiempo»: una frase de
  puente en s05 («ya no estás a tiempo de impedir los pasos de antes; lo que decides es qué haces con el que queda»).
- **«Detect más Degrade» no es invisible.** La lección dice «contención parcial *sin firma*» (`:352`) y «el actor ve una red
  lenta»; throttling se puede notar. La voz dice «se parece más a una red lenta que a un bloqueo» y el rótulo, «avisas
  menos», nunca «sin que se entere».
- **«Bloquear no sirve» está prohibido.** V15 ya dijo «Bloquearlos sigue valiendo: le obligas a gastar otro». V22 dice que
  cortar sirve y cuesta, y que si ya se llevan lo crítico se corta ya. Quien revise debe tachar cualquier frase que lea
  «cortar es un error».
- **Degrade se dice con la idea primero** (regla 3 de «Narración hablada»): la voz dice «frenar sin cortar» antes del nombre, y
  el nombre solo sale en la celda de la matriz, sin definirlo (s2m2q5 es Degrade).
- **El «dominio que no está en la lista» de s04 es hipotético**: sin nombre, sin fecha y sin relación con el segundo dominio
  de phishing del Lab 3A (`src/data/labs.ts:704-707`, aún sin usar). No debe leerse como un hecho del caso.
- **Sinkhole es Deny**, no Disrupt (`:342`; el Lab 2C pone el bloqueo del dominio en Deny). Disrupt es el aislamiento
  del host en Installation. La voz no mezcla los dos.
- **«Hilo».** La voz nunca dice «quema el hilo» ni «pierdes el hilo» (así lo dice la lección, `:314,342`): «hilo» es el
  activity thread de V3 y V14. Dice «tu visibilidad».
- **La IP del C2 es alojamiento compartido** (~14.000 dominios de terceros, `src/data/s2.ts:585,598`; «RUIDO» en V3 y V4).
  Limitar el tráfico hacia esa IP, como pone la matriz (`:343`), le cae a terceros; la voz y la pantalla dicen «hacia el C2».
- **La matriz no es lo que Meridian tiene.** «Extracto de trabajo» (`:324`). La voz habla de «la matriz que puedes montar»
  y nunca de «lo que Meridian ya hace». Esto vale sobre todo para el sinkhole y el bloqueo del dominio del correo
  (`cdn-sync-status.example`): el indicador propio de Meridian para ese dominio es de V8 y de S5, y el vídeo no dice que
  esté o no esté bloqueado.
- **RR. HH. en la celda del buzón señuelo** (`:330`): sale atenuada, sin voz y nunca junto a `ENG-WS-041` (registro §5,
  punto 5; V13 la dejó fuera por lo mismo).
- **La premisa de la pregunta** («todavía no han sacado nada») no puede leerse como el estado del 5-3: V13 acaba diciendo
  que la séptima fase no aparece «en lo que tienes», y V22 es posterior a esa reconstrucción pero no tiene fecha. La voz dice
  «supón».
- **Límite legal.** Destroy no sale; nada del vídeo recomienda acciones que un defensor privado no pueda hacer (s2m2q3).
- **Definiciones del curso.** El revisor de exactitud debe contrastar con el objetivo oficial, no con el artículo original de
  Lockheed Martin (donde, según la revisión, Degrade es frenar y Deceive un DNS redirect): en este curso, Degrade es «reducir la eficacia o
  velocidad del adversario» (`:291`) y el sinkhole es Deny.
- **Duración con dos mensajes.** Cada uno suma 4–5 s; el orden de recorte está en la ficha.

### Lo que recibe el registro de canon al aprobarse

- En §7, un bloque de V22 con su «Canon nuevo»: sin fecha; el equipo de respuesta pregunta; la matriz de la lección como menú
  de trabajo de la analista, con los tres retoques; los dos mensajes de GLASS VIPER; la imagen de la tienda.
- En §3, la tabla de mensajes interceptados publicados: los dos nuevos.
- En §5, nada nuevo si se aceptan los cambios de lección; si no, un punto: «s2m2 limita el tráfico a la IP del C2 (`s2.ts:343`),
  que es alojamiento compartido (`s2.ts:585`)».

## V23 · s4m5 · «Atribución: ¿quién fue? Los tres niveles y las pistas falsas» · decisiones para aprobar en una ronda

La ficha completa está en `ficha-V23.md`. Es la secuela de V3 («UNKNOWN con un plan vale más que un nombre inventado»), y
cierra la promesa de V9 sobre las pruebas plantables.

1. **Tres conceptos: los niveles con su tipo de evidencia, lo barato y lo caro de falsificar, y qué decisión cambia con el
   nombre.** Descartado un cuarto concepto, **campaign frente a intrusion set y el modelo STIX con `attributed-to`** (la mitad
   del texto de la lección tras la escalera, `src/data/s4.ts:1010-1051`; el check de `:1052-1066`; s4m5q7 y el objeto STIX de q10). Para
   enseñarlo habría que enseñar el JSON con el `intrusion-set` llamado «GLASS VIPER» y la campaña «PO-REVISION phishing wave»,
   que choca con la lectura de V8 (punto 9 de §5: GLASS VIPER es el loader y el nombre de vendors e ISAC, VELVET CICADA el
   intrusion set de Meridian; ya decidido el 2026-10-03, no se renombra), que V8 y V14 dejaron fuera la campaña y que el
   `confidence: 75` del ejemplo se ve «alto» en la escala de STIX frente a la «confianza media» con que la lección lo
   describe. Se queda en la lección y en la pregunta q7, que el cierre señala. **Es el coste más grande del diseño**: dos ítems del quiz
   (q7 y el check del STIX) no los toca el vídeo, y q10 solo en la idea (la atribución viaja con su confianza, que dice s05); el
   objeto STIX queda fuera. Una segunda cápsula solo tiene sentido si se resuelve el
   punto 9.
2. **La historia es el diamante de E7 y la pregunta del CISO, sin atribuir nada.** El CISO (el de V9) quiere un nombre; la
   analista no contesta con un nombre sino con «¿hasta dónde llega lo que tengo?». Meridian queda en el primer nivel (el
   programa y su servidor, ya legibles en V3 y V4; el certificado queda fuera del chip para no acercarlo a la prueba plantable de V9); quién teclea sigue siendo «desconocido», como Adversary en V3, y para quién trabajan se dice como lo pide la lección (tu red no
   tiene esa clase de prueba; el juicio se emite con su confianza y diciendo qué falta, no se calla), no como un «desconocido» a secas, porque el
   Lab 5B da por mala la opción de no emitir el juicio (`src/data/labs.ts:1071-1074`). Descartado situar pruebas de Meridian en el nivel de operador o de sponsor: el único
   candidato es el correo de registro (`kazuo.tanji@`), que es del dosier de DEEP WELL y del Lab 3A y que el registro dice que
   solo sería el operator «si el pivote confirma» (`src/data/s2.ts:598`). Descartado también inventar un informe de un
   proveedor sobre Meridian: el «informe serio» de s03 es una ficha genérica con el nombre entre corchetes.
3. **La pista falsa se demuestra sobre un binario de ejemplo «que no es el de Meridian».** Idioma y horario, como el segundo
   check de la lección, pero sin país. Descartado usar la muestra `9f3a...e1` o cualquier prueba del caso (dosier de HALL OF
   MIRRORS: «strings en cirílico y horarios falsos»), y descartados los nombres reales de la lección y del Lab 4A (Moscú,
   Rusia, China, UTC+8). Para que el ejemplo no parezca un adelanto del dosier, el rótulo lo dice y ningún mensaje de PAPER
   CRANE habla de lo que sembró.
4. **Una imagen: atribuir un cuadro.** Los niveles son tres preguntas (¿con qué se hizo, quién lo pintó, quién lo encargó?),
   lo barato de falsificar es la firma y la fecha de la esquina, lo caro es la procedencia año tras año y la cartela del museo
   es la afirmación con su confianza. En el arte «atribuido a» es literalmente una afirmación con grados. Descartadas la
   escalera y el peldaño (son de V7 y la lección los usa como encabezado: aquí «niveles» y «bandas»), la casa y el ladrón
   (V13), la carta anónima (V8 usa la carta) y la ropa y el acento (V7).
5. **Dos mensajes de PAPER CRANE:** «Ponle un país al informe, analista. Todo consejo adora un nombre.» (error: poner un
   país porque vende) y «Con la primera pista que encaje ya tienes bastante. ¿Para qué más?» (error: pararse en la primera
   pista). Empujan atajos de método, no una hipótesis, y no confiesan nada. Descartado «Un idioma en el binario ya lo dice
   todo», que era más pegado a la escena pero, dicho por PAPER CRANE, adelanta el dosier («cirílico»); y descartado «Las
   pistas fáciles son las más sinceras», demasiado cercano a «Fíate de lo que ves» de V9.
6. **La pregunta es la de las pistas baratas:** «Idioma y horario: ¿bastan para un país?» (39 caracteres), un sí o no con las dos pistas del binario a la vista y
   respuesta «no». Descartada la forma «¿prueba o pista?», que es una elección de palabra y dejaba la puerta a salir con «no es
   evidencia» (la lección la llama evidencia de peso muy bajo y da por mala la opción «irrelevante en todos los casos»).
   Descartado preguntar «¿operador o sponsor?» sobre un ejemplo (lo contesta el cuadro de la escena anterior) y descartado
   preguntar por el STIX.
7. **Va después del último check y antes de la nota de examen** (como V6 en sp4m8). Descartado antes de los checks (V3, V7):
   contestaría los checks 2 y 3.
8. **Cierra con las diez preguntas de la lección**, no con un laboratorio: ninguno de S4 practica la atribución.

### Riesgos

- **«Techo» no es «imposible».** La lección dice que el operador lo alcanzan vendors con visibilidad global y años de
  seguimiento, y el sponsor, gobiernos o fusión público-privada (`:988-1003`). La voz no dice que un defensor privado no
  pueda llegar a operador.
- **Operator = nivel operador y customer = nivel sponsor** es una lectura mía (V3 y `src/data/s2.ts:557` los separan, y
  dicen que la distinción «importa para atribución (S4M5)»). La pantalla dice «Adversary = operator + customer» y marca los
  niveles 2 y 3; la lección no iguala customer con sponsor. El revisor de exactitud debe confirmarlo o pedir que el chip
  diga solo «Adversary guarda al operator y al customer».
- **Confianza: moderada o inferior salvo lo que dice la lección.** La tabla da «Alta / Media / Media con lenguaje estimativo»
  (`:991-993`), y esa es la única que sale, como confianza «realista» del tipo de evidencia, nunca de un juicio de Meridian. El
  Lab 5B pide «low confidence» para un juicio de sponsor con solo victimología, horario e infraestructura
  (`src/data/labs.ts:1056-1076`): el vídeo no lo valora ni lo adelanta, y dice «moderada, y solo con fuentes que tu red no tiene» (una sola palabra para el nivel, la de V9; «lenguaje estimativo» es otro eje y no se rotula como grado). En pantalla, la nota de s05 no deja el
  sponsor en «desconocido»: «tu red no tiene esa clase de prueba; el juicio se emite con su confianza y diciendo qué falta, no se calla» (el Lab 5B
  califica de erróneo omitir el juicio; «si se dice» sonaba a opcional). No lleva el «baja» del laboratorio.
- **El check 3 de la lección habla de «activity-group level»** (`:1099-1112`), que no es ninguno de los tres niveles de la
  tabla. El vídeo no lo llama cuarto nivel: dice que lo más útil para defender es el grupo, cómo trabaja y qué busca.
- **Barato no es irrelevante.** La respuesta de la pregunta no puede ser «idioma y horario no valen nada»: la lección acepta
  que sumen dentro de un cuerpo grande y coherente (el check de `:1084-1097`, la opción «irrelevant in all cases» es la mala).
- **La victimología sostenida cuenta, y sola no basta.** La tabla la lista entre lo que desbloquea el sponsor (`:993`) y s4m5q5 la
  llama evidencia valiosa; es cara de falsificar y de peso medio-alto (no «alto», que es solo el tradecraft multianual con errores
  de opsec). El salto a «quién dirige» sigue necesitando otro tipo de evidencia (`:996-999`): no se vende como prueba de país
  por sí sola. Está en la banda de sponsor.
- **Caro no es imposible.** La regla 2 del cierre decía que lo caro «no» se falsifica; ahora dice que cuesta mucho más. V9 enseña
  que hasta lo más fuerte puede plantarse (`video/ach-matriz/narration.json`, s08-03).
- **El operador también se desbloquea con hábitos propios sostenidos** (`:992`; s4m5q8): entra en la banda del operador sin tocar
  la regla de que la pincelada no es lo caro de falsificar.
- **La pregunta de V23 sigue siendo un sí o no** («¿bastan para un país?»); el revisor propone «Un país o un grupo: ¿qué escribes?»
  (34), que sería una elección real y contesta al check 3. No se aplica porque no era obligatorio y el sí o no ya no depende de una
  palabra; queda como alternativa si el guion la ve demasiado contestada tras s03.
- **«Detectar, cazar y proteger» rara vez cambian con el país**, no «no cambian» (`s4.ts:1008,1110`).
- **s04 junta a PAPER CRANE con el binario de ejemplo**, que es lo que el dosier de HALL OF MIRRORS revela como hecho: el binario
  sale rotulado antes de que hable el mensaje y la voz no dice que PAPER CRANE las siembre mientras las pistas están a la vista.
- **La analogía no debe decir que el estilo no se copia.** Un falsificador copia el estilo; lo caro de falsificar en el cuadro
  es la procedencia documentada. La «mano» del operador es de los descuidos humanos (una huella en el barniz), no de la
  pincelada. El revisor de exactitud debe mirar esas dos frases.
- **Palabras reservadas.** «Escalera» y «peldaño» (V7), «etiqueta» a secas (V7: el disfraz de la tarea; V13 a V15: la etiqueta
  del taller) y «hilo» (V3 y V14). La cartela del museo se llama «la cartela».
- **Ningún país real, ningún caso real.** Ni Rusia, Moscú, China, UTC+8, ni APT1, Sony o DNC (S5). La pared de HALL OF MIRRORS
  y los ocho enunciados del Lab 4A (`src/data/labs.ts:447-501`) mandan.
- **«Entra por proveedores»** del callout de la lección (`src/data/s4.ts:1008`) choca con el vector de V13 y con el registro
  (§5, punto 4); el vídeo no lo cita.
- **La nota de s05 («qué buscan: la propiedad intelectual de propulsión de Meridian»)** sale del eje socio-político de V3
  (`video/diamond-e7/narration.json`, s07-02) y de la pizarra de V9; no es un juicio de espionaje (la hipótesis H1 de V9 sigue
  siendo provisional, con confianza moderada, y esa palabra no sale aquí).
- **Duración con dos mensajes y una pregunta de 4,5 s.** El orden de recorte está en la ficha.

### Lo que recibe el registro de canon al aprobarse

- En §7, un bloque de V23 con su «Canon nuevo»: sin fecha; el CISO pregunta por el país; Meridian en el primer nivel, con
  Adversary y customer en UNKNOWN; los dos mensajes de PAPER CRANE; el binario de ejemplo, la ficha del informe serio y la
  imagen del cuadro son de la analogía.
- En §3, la tabla de mensajes interceptados publicados: los dos nuevos.
- En §5, un punto nuevo: «s4m5 describe a GLASS VIPER como intrusion set (`s4.ts:1023`) y, en el callout de `:1008`, a
  VELVET CICADA como cluster que "entra por proveedores"». V23 no los toca.
- De paso: las referencias a `src/data/s4.ts` del registro siguen desfasadas en +7 líneas desde V9 (tabla en
  `docs/reviews/2026-10-05-fichas-tanda3/revision-gcti.md`, «Entre fichas», punto 6): por ejemplo, `"name": "GLASS VIPER"` está
  en `:1023`, no en `:1016`, y `first_seen` en `:1025`. El registro de este árbol todavía las trae sin corregir.

## Cambios propuestos a las lecciones (solo propuestos; todo es texto, sin ids ni respuestas)

| # | Dónde | Dice hoy | Propuesta | Por qué | Recomendación |
|---|---|---|---|---|---|
| 1 | `src/data/s2.ts:343` (matriz de s2m2, C2 Degrade) | «throttling del egress hacia la IP del C2» | «hacia el C2» | La IP es alojamiento compartido con ~14.000 dominios de terceros (`:585,598`; V3 y V4 la llaman «RUIDO»): limitarla perjudica a terceros y choca con la lección s2m3 | Sí, en la rama de V22 |
| 2 | `src/data/s2.ts:352` | «contención parcial *sin firma*» y «tú ves su operación completa» | «contención parcial con poca firma» y «tú ves mucha de su operación» | El throttling se puede notar, y «completa» promete más de lo que sostiene el check 1 (`:366`: «preserving the collection channel»); el resto de la frase («el actor ve una red lenta») sigue valiendo | Sí, en la rama de V22 |
| 3 | `src/data/s2.ts:342` y `:314` | «quema el hilo» y «pierdes el hilo» | «quema tu visibilidad» y «pierdes la visibilidad» | «Hilo» es el activity thread de s2m4 (V3 y V14); el vídeo ya lo evita | Opcional; sí, de paso con 1 y 2 |
| 4 | `src/data/s4.ts:1008` | «entra por proveedores» | «ataca también a sus proveedores» | Lo que choca no es «proveedores» (lo respaldan Orbital, la ola de abril y la cuenta VPN del Lab 2B) sino «entra por», frente al vector de s2m1 (correo con un CV) y V13 (registro §5, punto 4); la frase propuesta vale | Sí, en la rama de V23 |
| 5 | `src/data/s4.ts:993` (tabla, sponsor) | «Media, siempre con lenguaje estimativo explícito» | «Media para quien dispone de esas fuentes, con lenguaje estimativo explícito; baja con solo telemetría» | Concilia la tabla con el Lab 5B (`labs.ts:1056-1076`), que da «low» a un juicio de sponsor con solo victimología, horario e infraestructura | Sí, en la rama de V23; si Lidia prefiere no adelantar el laboratorio, el vídeo no cambia |
| 6 | `src/data/s4.ts:1099-1112` (check 3) | «Activity-group level» | Sin cambio | No es un nivel de la tabla de tres, pero el texto de la lección lo explica (el sector privado se detiene en el intrusion set) | No; el vídeo lo cuenta sin llamarlo nivel |
| 7 | `src/data/s4.ts:1023` (`"name": "GLASS VIPER"`) | — | Ya decidido el 2026-10-03: no se renombra | V23 no depende | No tocar |
| 8 | Tras la matriz de s2m2 (`:349`) | — | Una frase: «Discover y Destroy no ocupan celda aquí…» | La pantalla ya lo dice | No |
| 9 | `src/data/s4.ts:1045` (`"confidence": 75`) frente a `:1050` («confianza media») | Prosa «media», JSON `75` | Si algún día se toca el JSON (punto 9 de §5), poner `50` o decir «alta» | En la escala None/Low/Med/High de STIX 2.1, 70–100 es «alto»; el vídeo no enseña ese JSON | Informativo: no depende el vídeo |

## Entre fichas

1. **Las dos sin fecha.** V13 y V14 sí llevan fechas (el 2-3 y el 5-3; el lunes 9-3); V15, como V9, no. V22 y V23 son
   reflexiones de método sobre una intrusión que ya está contada, y fecharlas solo añade riesgo (E9, el 7-3, el informe del
   lunes, el dosier). La única referencia temporal es el diamante del evento E7 en V23, que es la de V3 (sin fecha en voz).
2. **Imágenes que no se repiten.** GCTI ya tiene la casa y la caja con el taller (V13 a V15), la ropa, el acento y la forma de
   andar (V7), la llave (V4 y V7), la carta y el sobre (V8), el listín y los vecinos (V4 y V8), el yogur, la mesa y el bolsillo
   (V9), la foto y la película (V3 y V14), el coche (V15), el teléfono de prestado y la prenda (V15), el diamante (V3) y la
   escalera (V7). Las nuevas son la tienda y el cuadro: ninguna aparece en otro vídeo.
3. **Los cuatro mensajes nuevos no repiten ningún error ya corregido.** GLASS VIPER, publicado o aprobado: «Dibuja tu diamante…»,
   «Llámame GLASS VIPER…», «Sígueme por la IP…», «Bloquea mi hash…», «Tú tienes que acertar siempre…», «Mi taller no lo verás
   nunca…», «Tú vigila tus planos…», y los de V14 («Otra empresa, otro dominio…», «Ya me has metido en un grupo…», «En Orbital
   solo llamo a casa…»). Los nuevos son otros dos errores: detectar es defender, y cortar ya es siempre lo correcto. PAPER CRANE:
   los tres de V9 eran fiarse de todo, contar lo que encaja y tirarlo todo ante una prueba falsa; los dos nuevos son ponerle un país
   al informe y pararse en la primera pista.
4. **Dependencias.** V22 depende de V13 (ya fusionado) y V23 de V3 y V9 (fusionados). Ninguna cita el guion de V14 ni de V15 (no
   están en este árbol): se cita solo su ficha aprobada, y V14 queda solo como remisión («S4: niveles de atribución») que V23
   cumple. Pueden producirse en cualquier orden entre sí.
5. **Producción.** Dos cápsulas, con voces que ya existen y sin trabajo de motor previo. Si Lidia quiere el reparto de siempre, un
   principal de la tanda por cápsula en cada sesión.
6. **V22 y V13.** Comparten la fila de pasos de la intrusión: la voz de V22 no repite la imagen de la casa de V13, y V22 es
   el sitio donde por fin se nombran los verbos que V13 evitó a propósito (su ficha: «ninguna acción se rotula como Discover,
   Detect…»).

## Preguntas para Lidia

Ninguna bloquea. Dos recomendaciones, para que digas solo qué cambia:

- **¿Aplicamos los cambios de lección 1, 2 y 3 (s2m2) en la rama de V22 y los 4 y 5 (s4m5) en la de V23?** **Recomendado: sí.**
  Son frases sueltas, sin ids, opciones ni respuestas, y quitan dos choques que un lector atento vería (la IP compartida y
  «entra por proveedores»). El 5 es el único que adelanta algo del Lab 5B; si prefieres no hacerlo, se omite y el vídeo no cambia.
- **¿Hace falta una segunda cápsula de s4m5 sobre campaign frente a intrusion set y el modelo STIX?** **Recomendado: no por ahora.**
  Pide resolver antes el punto 9 de §5 (el nombre del intrusion set de S4); mientras tanto, q7 queda en las diez preguntas
  de la lección, y el cierre de V23 las señala.

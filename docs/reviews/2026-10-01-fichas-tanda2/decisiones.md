# Fichas de la tanda 2: decisiones para aprobar en una ronda

Fecha: 1 de octubre de 2026. Las fichas completas están en el plan de vídeos
(`docs/superpowers/plans/2026-09-25-lesson-videos.md`, §5, de V6 a V10). Aquí van solo las decisiones que cada ficha ya
toma, con la alternativa descartada, y los riesgos que debe mirar quien escriba el guion. Todas pasaron una revisión de
exactitud y canon (una por campaña) y la comprobación de límites del validador (tarjetas, preguntas, mensajes, escenas y
duración).

Basta con decir qué cambia; lo que no se diga, queda como está.

## V6 · sp4m8 · Decisiones para aprobar en una ronda

1. **Historia: «la contraseña buena no basta».** Arranca en la 01:52 del 4-9 (una cuenta robada entra con su contraseña
   de verdad) y acaba cerrando la mejora de V5: las cuentas de servicio entran en la bóveda el 27-10. Descartado: un
   ataque nuevo de avisos push en Halden en octubre, porque abriría un segundo incidente que el registro no tiene y
   rozaría el password spraying del 21-10 (V10). La demo de push es hipotética, en «tu móvil», y el IdP de Halden no
   enseña segundo factor en todo el vídeo, porque según V10 no lo tiene hasta el 30-11.
2. **Cinco conceptos:** ciclo de vida (cambios y bajas), SAML, OAuth, MFA y PAM. Se quedan en la lección los cinco modelos
   de control de acceso y las normas de contraseñas. Descartado meter los modelos: son una lista de «quién decide» que ya
   cubren la tabla, la tarjeta y dos preguntas, y el vídeo habría pasado de 6 conceptos.
3. **Dos personas nuevas y una bóveda que crece, no que se estrena.** `c.navarro`, que ha cambiado tres veces de puesto
   (revisión del 19-10), y `o.virta`, de Importación, que se jubila el 23-10. Es de Importación y no práctico porque
   los prácticos «solo entran a un sistema» y el remate de s04 le cierra la plataforma aduanera, que él sí usaba; así se
   ve que deshabilitar en casa corta fuera. Descartado usar a Lucía (ya carga con el correo
   y con «Despide a Lucía») o a `a.soto` (su ejemplo toca `srv-tc-app03`), y descartado un despido o un contratista,
   que rozaría el final de sp5. La revisión es «la trimestral» y la bóveda ya guardaba las cuentas de administrador,
   porque dos preguntas de la lección ya lo cuentan así.
4. **Dónde va:** al final de la lección, entre el check de MFA y la nota de examen, con una frase de entrada como V1.
   Descartado ponerlo tras la federación, a mitad: el vídeo recorre cuatro de las cinco partes y sirve de repaso. Ningún
   laboratorio de la sección toca identidades, así que no hay solución que esconder y la tarea final son las 8 preguntas.

### Riesgos

- **Privilegios especiales de `svc_tosreport`.** Que se los quiten el 27-10 «porque para informes no hacían falta» es una
  deducción nueva a partir del `4672` que el SIEM ya enseña. Si Lidia prefiere no afirmarlo, se quita esa frase de s09 y
  el `4672` no sale.
- **Preguntas de la lección en presente.** sp4m8q1 (revisión trimestral), q7 (bóveda con préstamos para administradores)
  y q8 (entrar en la plataforma aduanera del socio) ya describen Halden así. El guion no debe decir «la primera
  revisión» ni «se estrena la bóveda».
- **Las imágenes de SAML y OAuth simplifican.** El pase lo lleva el navegador y el permiso de OAuth no lo escribe la
  usuaria: lo emite su casa cuando ella dice que sí. El revisor de exactitud debe mirar que el guion no diga que la app
  recibe la nota de su mano.
- **Fuera de la lista del objetivo.** OpenID Connect no está en el listado del 4.6 de SY0-701 (sí LDAP, OAuth y SAML) y
  la fatiga de push tampoco, aunque las dos estén en la lección: OIDC sale sin tarjeta; la fatiga tiene una porque la
  pregunta sp4m8q5 la exige.
- **No prometer de más.** Ni el segundo factor ni la bóveda habrían parado la 01:52 (cuenta de servicio, contraseña usada
  unas diez horas después del robo). El guion dice que la bóveda «le pone un límite» (24 h como mucho, aunque nadie se
  dé cuenta), nunca «lo habría evitado».
- **Dominio público.** La web falsa de s08 es `haldenp0rt.example`, la de V1, y el host real del IdP no sale nunca. Con
  eso V6 sigue a V1 (`haldenport.example`) en la contradicción de dominios: el registro lo anotará en §5.2.
- **Segundo factor en el IdP.** No he hecho el opcional de decir en s08 que el que llega al puerto será la llave: ataría
  V6 a la mejora del 30-11 de V10, y si V6 sale antes, quien lo vea no sabrá de dónde viene.

## V7 · s2m5 · decisiones para aprobar

> Revisadas el 2026-10-01 con los arreglos de la revisión de exactitud (`revision-gcti.md`, V7 y «Entre fichas» 1).

1. **Los dos hashes del loader salen juntos, como otro binario en el mismo equipo que habla con el mismo dominio**
   (el `4c81...b3` del árbol el 2 de marzo y el `9f3a...e1` que enseñó V3 el 5 de marzo). Solo el hash es «la ropa»;
   el nombre y la carpeta, que también cambian, son el «acento», y la voz dice con cautela que todo apunta a otra
   compilación del mismo programa. Descartado esconder el hash, porque la pirámide se quedaría sin su ejemplo de la
   base y la pregunta s2m5q9 lo cita, y descartado unificarlo en la lección, porque habría que tocar esa pregunta y
   seguiría chocando el nombre `updsvc.exe` que V3 ya tiene en pantalla.
2. **La historia son dos fotos del mismo equipo, contadas después de E7**: tras la alerta, Meridian reconstruye cómo
   empezó todo. Descartado contar el 2 de marzo como si alguien lo hubiera visto en directo, porque en V3 el dominio
   era desconocido en E7, y descartado usar las víctimas de s2m4, porque su forma de entrada choca con la de s2m1.
3. **Dos conceptos, cada uno con su imagen**: la escalera de ATT&CK con la llave escondida en la maceta, y la
   pirámide con reconocer a alguien por la ropa, el acento o la forma de andar (el «acento» ya salió en V3).
   Descartado un tercero con el heatmap y con «que no salga en su ficha no quiere decir que no lo haga»: se quedan en
   la lección y en sus preguntas, que son la tarea del final.
4. **Ningún laboratorio de S2 practica ATT&CK ni la pirámide, pero lab2a y lab2c tienen piezas parecidas**, así que
   el vídeo habla solo con palabras de ATT&CK (Persistence, no «Installation») y no dice en qué Course of Action
   caería la búsqueda del hash o la regla. Va en la lección justo antes de los checks del árbol, como hizo V3.
   Descartado ponerlo detrás de la tabla de la pirámide, porque enseñaría el árbol antes de que la lección lo
   presente.

### Riesgos

- **Canon del hash: V7 lo resuelve solo en parte** (propuesta, sin tocar la lección). Deja claros el nombre, la ruta y
  el hash, pero siguen abiertos el nombre `VC_Loader_v1.dll` del Lab 3B (§5, punto 1) y cuántas muestras comparten
  PDB (§5, punto 11). «Dos compilaciones» se apunta en el registro como la lectura del caso, no como algo que el vídeo
  demuestre. El guion nunca dice «recompiló entre el 2 y el 5»: la muestra `9f3a2c...e1` de s3m2 tiene fecha de
  compilación del 19 de febrero.
- **Nota para el registro, nunca en pantalla ni en voz.** Loader e implante son el mismo objeto (`src/data/s2.ts:576`;
  V3 lo dice en voz). `9f3a...e1` lleva el PDB, así que es la variante 1 del Lab 3B, la de Meridian; `4c81...b3` queda
  con rasgos estáticos sin definir y no es la variante 2, que no es de Meridian.
- **s05 es la escena más cargada** (dos fotos, cero coincidencias, tres tonos, el remate del mensaje, la pregunta con
  4,5 s de silencio y la regla recorriendo la cadena): por eso lleva 52 s y s04 baja a 40. Si al escribir el guion no
  cabe, se recorta aquí primero.
- **La forma del árbol.** En la lección, `schtasks` cuelga de `winhlp.exe`, no de PowerShell. Resuelto así: la
  animación recorre la cadena entera, de `explorer.exe` a `schtasks.exe`, antes de saltar en `09:44:20`, y la voz dice
  «en la cadena que arranca ese PowerShell». El revisor de naturalidad debe comprobar que suene hablado.
- **El paso de certutil no está en la cadena de s2m1** (registro §5, punto 19): por eso el árbol no lleva horas línea
  a línea, solo la cabecera `09:44`; la única hora citada es la de la tarea, `09:44:20`, que sí está en s2m1.
- **Sub-techniques.** En pantalla salen como tales (`T1053` con `.005`, `T1059` con `.001`, `T1071` con `.001`;
  `T1140` no tiene), y la voz dice «técnica», como la lección.

## V8 · s3m5 · decisiones para aprobar

1. **Historia: el caso de la lección, tal cual.** El aviso del ISAC para `cdn-sync-status.example`, creado el 11-3 y
   caducado el 25-6, llega el 2-7, y la respuesta es «este aviso no va al bloqueo: se busca hacia atrás, y ya». Descarto
   inventar un aviso vigente: habría que dejar los datos de la lección y se perdería su trampa de examen principal.
2. **Tres conceptos, y YARA fuera.** Leer el aviso (fecha, fuente, confianza y marca), guardarlo con su contexto (el
   grafo, con los duplicados dentro) y «STIX describe, TAXII transporta». Descarto meter YARA o dar a los duplicados
   un concepto propio: una cápsula aguanta tres, y YARA ya tiene el Lab 3B. Tampoco pregunto qué fuente responde a qué,
   que es el Lab 3C.
3. **El grupo del grafo es VELVET CICADA, el de la lección** (el ejemplo de `s3.ts:1048`), con el loader GLASS VIPER
   como malware y la relación en el sentido correcto: el grupo usa el loader. Descarto el GLASS VIPER de S4
   (`s4.ts:1016`): vive en otra sección y contradiría el texto que va justo al lado del vídeo.
4. **Canon nuevo, el mínimo.** El 2-7 la plataforma de Meridian consulta por primera vez la colección del ISAC (así se
   explica que un aviso de marzo llegue en julio), y ese día el historial de DNS sigue sin ver el dominio desde el
   18-4. Descarto no explicar el salto de cuatro meses, porque quien lea la fecha de creación se lo preguntará. Y la
   búsqueda hacia atrás no enseña resultados: serían el phishing del 18-4, que es de S5.

### Propuesta opcional (la decide Lidia): el nombre del intrusion set

Es el punto 9 de §5 del registro, que V8 vuelve concreto. En `src/data/s4.ts:1016`, el intrusion set pasaría a
`"name": "VELVET CICADA"` con `"aliases": ["GLASS VIPER"]` (propiedad válida en STIX 2.1), y el enunciado de
`src/data/s4.ts:1048` diría «you track as VELVET CICADA». Así el indicador de S5, que apunta a ese conjunto
(`s5.ts:615`), lo hace a uno que se llama igual que en V8. Es solo texto: no cambia ningún id ni rompe ningún test. Si
no se hace, hay que dejar escrita en ese punto 9 la lectura que usa V8: GLASS VIPER es el loader y el nombre que usan
los vendors y el ISAC; VELVET CICADA es el intrusion set en el modelo de Meridian.

### Cambios a la lección que recomienda la revisión (en el PR del vídeo)

Los tres son solo texto: no cambian ids, ni opciones, ni respuestas.
- **«used-by» pasa a «uses»** en `s3.ts:1048` y en la explicación de s3m5q10 (`s3.ts:1294`): STIX 2.1 no tiene ese
  tipo de relación; se dice que el intrusion set «uses» el malware, que es como lo dibuja el vídeo.
- **«empuja» pasa a «recoge»** en `s3.ts:1053` («el ISAC publica este objeto en una colección TAXII y tu plataforma lo
  recoge») y en la fila del 2026-03-11 del registro (`velvet-cicada.md:50`). La lección se contradice: después dice
  que hubo pull (`:1076`) y el check pregunta por «polled a collection» (`:1096`).
- **Se añade `"modified": "2026-03-11T08:00:00Z"`** debajo de `created` (`s3.ts:1063`), y el vídeo lo enseña igual.
  El motivo es que STIX 2.1 lo exige en este tipo de objeto y se puede preguntar en el examen, no que así el JSON
  quede válido: los identificadores del curso no son UUID de verdad y eso se deja como está.

### Lo que recibe el registro de canon al aprobarse

- En la cronología: **hoy = 2026-07-02 (jueves)**, el «hoy» de s3m5.
- El ISAC ya mandaba avisos a Meridian antes (fuente del CMF, `s3.ts:73`), pero **por TAXII solo desde el 2-7**, con
  la primera consulta de V8.
- La fila del 2026-03-11 con «publica / recoge» en vez de «empuja».
- La decisión sobre el punto 9 de §5 (arriba).

### Riesgos

- **Meridian ya tiene su propio aviso para este dominio** (`s5.ts:600-606`: del 18-4, confianza 80), vigente hasta el
  18-7, o sea, todavía en vigor el 2-7. La voz habla siempre de «este aviso» y nunca dice que el dominio no se bloquee;
  el revisor debe vigilar que el guion tampoco lo haga.
- **Retención:** el proxy guarda 30 días y el EDR 90 (`s3.ts:68-69`). La búsqueda hacia atrás del 2-7 ya no alcanza
  el proxy del 18-4; la voz dice «hasta donde llegue lo que guardas» y nunca que todo siga en tus registros.
- **El dominio no caduca hasta el 2027-02-27** (`s3.ts:765`): la voz dice «a quien lo herede» y «puede cambiar de
  manos», nunca que ya sea de otro.
- **Los channels de TAXII** que cita s3m5q6 no están definidos en TAXII 2.1; el vídeo no los enseña.

## V9 · s4m3 · «ACH: gana la hipótesis que no puedes tumbar» · decisiones para aprobar

1. **La historia: la sala ya cree que es espionaje, y el vídeo no la contradice: le da un porqué y una prueba que
   vigilar.** Descartado: que la sala crea otra cosa (un rescate) y la matriz la saque del error, porque con seis meses
   sin cobrar nada sería un equipo poco creíble y dejaría en mal lugar a la plantilla.
2. **Solo la matriz de la lección, con sus cuatro pruebas, y el phishing como ejemplo de prueba que no separa nada.**
   Descartado: una matriz inventada (rompe la regla escrita del plan) o el horario UTC+8, que es la pista estrella del
   Lab 4B y roza los «horarios falsos» del dosier del jefe.
3. **PAPER CRANE, en su primera aparición, empuja atajos de método y nunca una hipótesis:** fiarse de todo, contar lo
   que encaja y tirarlo todo si una prueba falla. Descartado: que señale el certificado (E4), porque daría a entender
   que lo plantó ella, y eso no lo dice nadie.
4. **Cuatro ideas:** técnicas estructuradas (supuestos clave y abogado del diablo), ACH, diagnosticidad y sensibilidad
   con el informe. What-If y la lluvia de ideas estructurada solo salen en pantalla. Descartado: dar su hueco a las cinco
   técnicas, porque no caben bien contadas en ocho minutos.

### Riesgos

- **H1 y el dosier.** La matriz de la lección ya da como menos inconsistente el espionaje, y el dosier de HALL OF MIRRORS
  también acaba en espionaje. El vídeo lo enseña porque está en la lección, pero siempre como provisional (cuatro
  pruebas de un extracto, con confianza moderada). El revisor debe vigilar que el guion no diga «caso cerrado»,
  «sistemático» ni que las alternativas «se desmoronan».
- **E4 no es el certificado de V3 y V4.** Sería un buen puente, pero fijaría que el ISAC vio `CN=updatesvc` en una
  campaña de espionaje, tocaría la tercera IP del certificado (hueco 15 del registro) y rozaría el dosier de DEEP WELL.
- **La voz de PAPER CRANE.** El motor solo tiene un efecto, `machine`, el de los otros tres adversarios. Un efecto
  propio (por ejemplo, un eco de sala de espejos) es trabajo de motor antes de producir; si no llega, habría que usar
  `machine` con otra voz.
- **Exactitud.** La celda E3 contra H3 es I en la lección y N en el Lab 4B; el vídeo sigue la lección y la agrupa con E4
  sin razonarla aparte. Además, en este extracto contar las C también da H1: el guion lo dice y usa el perro del yogur
  para enseñar dónde las dos cuentas no coinciden.
- **«6 meses»** sale tal cual en la lección y hereda el hueco 8 del registro (cuánto duró la operación); el vídeo no pone
  fechas.

## V10 · sp2m7 · decisiones para aprobar en una ronda

> **Respuesta de Lidia (2026-10-04):** las cuatro, tal cual; la voz no fija el género de RED MARROW; voz `Microsoft
> Laura` con un efecto nuevo de llamada telefónica (`telefono`), porque Laura con `machine` ya es PAPER CRANE (V9); y sí
> al cambio de fecha e IP en la lección, hecho ese mismo día.

1. **La noche del spraying (la decisión de canon que tocaba).** El vídeo lo cuenta la noche del 20 al 21-10, con las
   mismas cuentas y horas de la lección; cambian la fecha y la IP. Descartado dejarlo el 4-9 sin relacionarlo con el
   caso: dos adversarios distintos que entran con éxito la misma noche invitan a pensar que trabajan juntos, y la
   cuenta `r.haugen` quedaría abierta en un caso que V5 da por contenido. Descartado también agosto (antes del caso):
   el dosier de RED MARROW dice que «GH compra acceso a través de terceros», y una cuenta robada días antes del caso
   sugeriría que se la vendió a SILENT PAGER.
2. **Tres conceptos, no dos.** Spraying (con MFA), traversal y amplificación DNS, los tres del esbozo: los dos patrones
   del bloque de código de la lección más la otra distinción que la nota de examen dice que «cae una y otra vez».
   Descartado quedarse en los dos del bloque de código: se caía justo la amplificación, que tiene su check y su
   pregunta en el quiz.
3. **Cómo habla RED MARROW, y qué firma.** Tutea, frases cortas e ironía, como SILENT PAGER, pero es un estafador amable:
   da consejos de amigo que son mentira y cierra con «Confía en mí». Firma el spraying y el traversal, con un error
   concreto en cada mensaje (una contraseña que cumple las normas es segura; basta con borrar los puntos y las barras);
   el DDoS no lo firma nadie, porque en un ataque reflejado quien lo lanza no sale en tus registros. Descartado copiar
   la provocación de SILENT PAGER: se confundirían, y el error de ausencia («sin alarma no hay nada que buscar») ya lo
   usa V5b.
4. **La MFA, con dueño y fecha.** Lo de esa misma mañana va sin fecha (contraseña nueva, sesiones cerradas, bloqueo del
   origen); la mejora de fondo lleva responsable y plazo: «MFA y lista de contraseñas prohibidas en el proveedor de
   identidad · Sistemas · 30-11». Descartado dejarla como propuesta sin dueño: V5 enseña en pantalla que una mejora sin
   responsable ni fecha no existe. El 30-11 cae después del arco de V6, que ya no enseña segundo factor en ese sistema.

**Pregunta para Lidia: ¿la voz fija el género de RED MARROW?** Ningún texto lo marca. Propongo la voz `Microsoft Laura`
(ya instalada) con un efecto de llamada telefónica, que habría que añadir al motor; con ella, RED MARROW se oye como
mujer. Dos salidas:
- **La voz no cuenta como canon** (recomendada): igual que SILENT PAGER, que es «ella» y suena con la voz de Pablo. El
  texto sigue sin marcar el género y un vídeo posterior puede fijarlo.
- **La voz lo fija:** RED MARROW pasa a ser «ella» y se apunta en el canon nuevo. Si lo prefieres «él», la voz sería
  Pablo con otro efecto, aunque se parecería más a SILENT PAGER.

**Propuesta aparte (la lección no se toca desde la ficha): fecha e IP, a la vez.** En `src/data/secplus/sp2-part4.ts:65-69`,
`2026-09-04` pasa a `2026-10-21` y `185.22.9.41` a `192.0.2.157`, en las cinco líneas; las dos del traversal (`:61-62`) no
llevan ni IP ni hora y se quedan igual. Si la lección no cambia, lección y vídeo enseñarían el mismo spraying, segundo a
segundo, en dos noches distintas. Por qué esa IP:
- `185.22.9.41` no es de documentación y puede ser de alguien real; en un vídeo público saldría como atacante.
- En `203.0.113.x` están las dos IP de SILENT PAGER: una de RED MARROW ahí sugeriría la misma infraestructura, que es
  justo «GH es una sola operación».
- En `198.51.100.x` está `198.51.100.23`, el destino sin explicar de otro servidor en el SIEM, que debe quedar neutro.
- En `192.0.2.x` lo único de Halden es un escaneo bloqueado que nadie atribuye. La `.157` no la usa ningún archivo. Los
  cuatro resolvers del DDoS van a `198.51.100.x` (`.61`, `.140`, `.203`, `.212`, libres) para no compartir red con el
  atacante.

### Riesgos

- `hpa-portal-web-01` recibe el traversal y el DDoS, y el 1-9 tenía un fallo crítico distinto (FINDING #0147 de
  sp4m5). Que el revisor compruebe que el guion no los junta.
- Exactitud: NetFlow no ve el tamaño de cada respuesta ni la pregunta pequeña (esa nunca pasa por la red del puerto).
  Por eso «60 bytes frente a 3.000» va como esquema del mecanismo, no como dato del registro.
- `r.haugen`, `Halden2026!` y las IP van solo en pantalla o en la voz del adversario: el validador toma `r.haugen` por
  un dominio si la narradora lo lee.
- La sesión de `r.haugen` se cierra en 38 s sin abrir nada. Si el guion especula por qué, roza «GH compra acceso a
  través de terceros»: se da como dato y ya.
- El 21-10 queda después de las fechas previstas de V5b (del 2 al 16-10, sin publicar). Si V5b las moviera más allá
  del 20-10, hay que revisarlo.
- Duración: la suma de escenas no predice bien el renderizado. El primer borrador se mide por los dos lados: cerca de
  190 s, se alargan s02 o s05; por encima de 255 s, se recorta s05.

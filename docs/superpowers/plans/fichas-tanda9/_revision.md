# Revisión cruzada de la tanda 9 (V45–V48, dominio 3)

> Revisión de solo lectura del 2026-10-17, sobre el commit `f1eb7ff` de la rama `video-fichas-tanda9`, antes de que Lidia apruebe las
> fichas. Se han leído enteras las cuatro fichas, el diseño (entero; §4.3, §4.4, §9.3 y §9.4 con lupa), la revisión de la tanda 8, las
> lecciones sp3m1 y sp3m2 (`sp/sp3-part1.ts`), sp3m3 (`sp/sp3-part2.ts:1-295`) y sp3m6 (`sp/sp3-part3.ts:356-633`) con sus checks y su
> quiz, `placement-sp3.ts`, `sp3-cards.ts`, `labs-sp3.ts`; del registro, §1, §2, §4 (dosieres), §5 (contradicciones 13 y 17), «Lo que no
> salió» y §6; las narraciones de V16, V17 y V24 (barrido de palabras e imágenes) y de V28 (`:143`), y las fichas V30, V34, V37, V38 (tanda
> 6–7), V39, V41 y V43 (tanda 8) en lo que dejan dicho para sp3.
> Rutas: `sp/` = `src/data/secplus/`, `reg` = `docs/superpowers/canon/glass-harbor.md`, `fichas/` = `docs/superpowers/plans/fichas-tanda9/`,
> `f7/` = `docs/superpowers/plans/fichas-tanda7/`.
>
> **Un dato previo:** son **12 preguntas** (tres por cápsula). Las citas de lección de esta revisión son del archivo sin vídeos, como las de
> las fichas.
>
> Cada hallazgo: `fichero:línea` · regla que rompe · gravedad · arreglo.

## Resumen

- **Alta (0).** Ninguna pregunta tiene dos respuestas defendibles según SY0-701 y la lección. Las cinco dudas que traían los autores
  (V46 P2, V48 P2, V48 P1, V45 P2, V47 P1) se sostienen; solo V47 P1 necesita reescribirse, y no por exactitud sino porque la trampa no
  tienta.
- **Media (8):** V47 P1 da la clave en el escenario y su trampa muere sola (A-1); la imagen de la bici de V45 enseña al revés el rasgo que
  ilustra (D-2); V46 hace de **nóminas** una aplicación propia en una VM, y el registro y la lección dicen que la nómina la calcula un SaaS
  (D-1); V46 dice «single point of failure» en voz y pantalla, que V45, V47 y los vídeos publicados de sp3 evitan por el dosier de BLIND
  ARCHITECT (C-4); las sucursales de V45 resuelven con «devolver la llamada al número de la lista», que es la out-of-band verification de
  V34 (C-3); las opciones de V45 son frases enteras en inglés, contra el diseño §3 y §4.3 y contra V46 y V47 (C-1); la clave es la **B** en
  1 de 12 (C-2); V45 rechaza la escalera IaaS→PaaS→SaaS que V38 le dejó, y nadie la cubre (C-5).
- **Baja:** el `why` de V45 P3 confunde autenticar con autorizar (A-2); roces con callouts y notas de examen (B-1 a B-3); tres imágenes de
  «un molde, muchas copias» seguidas en el curso (C-6); la línea de «MEJOR» y su glosa (C-7, G-1); la pantalla del pasillo de V48 (D-3);
  citas (4), naturalidad y coherencia menor.
- **Correcciones de lección propuestas:** las tres son válidas (V45 `sp3-part1.ts:93`, V47 `sp3-part2.ts:53`, V48 `fcp325` y glosario
  `:97`); solo la de V48 es condición por §9.3 en sentido estricto (la flashcard contradice a CompTIA). Ver §A, «Correcciones de lección».
- **F (recuentos):** limpio. Los 96 textos de pantalla de las preguntas (escenario, pregunta, 48 opciones, `why`, `trapWhy`), las 20 tarjetas, palabras leídas, `wordBudget`, duraciones y títulos coinciden
  con lo que dicen las fichas. Dos detalles de redacción (F-1, F-2).

---

## A. Exactitud (12 preguntas)

Contra la lista oficial de objetivos SY0-701 (3.1: cloud, IaC, serverless, microservices, air-gapped, on-premises, centralized vs.
decentralized, containerization, virtualization, IoT, ICS/SCADA, RTOS, embedded, high availability y las doce consideraciones; 3.3: data
types, classifications, «General data considerations» —data states, data sovereignty, geolocation— y «Methods to secure data» —geographic
restrictions, encryption, hashing, masking, tokenization, obfuscation, segmentation, permission restrictions—) y después contra la lección.

| Vídeo | P | Clave / trampa | Veredicto |
|---|---|---|---|
| V45 | 1 | Revoke and replace the key / Purge the key from the history | Una sola. Bien; «MEJOR» justificado (limpiar el historial ayuda, no basta) |
| V45 | 2 | The provider's function logs / An EDR agent on the function's OS | Una sola. La duda 4 se resuelve bien con «on the function's OS» (ver abajo) |
| V45 | 3 | Service-to-service authentication / Stricter perimeter firewall rules | Una sola; el `why` mezcla autenticar y autorizar (A-2); roza el callout (B-1) |
| V46 | 1 | Rehacer la imagen y desplegarla / Actualizar la biblioteca en cada contenedor | Una sola. Bien (`sp/sp3-part1.ts:331`) |
| V46 | 2 | El kernel del host / Las imágenes, con el kernel corregido | Una sola. La trampa «falsa a propósito» es legítima (ver abajo) |
| V46 | 3 | Centralizar la gestión / Llevar los servidores a la nube | Una sola; es la nota de examen hecha pregunta (B-2) |
| V47 | 1 | Duplicar la alimentación y el cable / Guardar otro controlador en el almacén | Una sola, pero la clave se lee del escenario y la trampa no tienta (A-1) |
| V47 | 2 | Responsiveness / Availability | Una sola. Bien; el «siempre» de cebo funciona |
| V47 | 3 | Inability to patch / Patch availability | Una sola. Bien |
| V48 | 1 | Data at rest / Data in transit | Una sola con «desconectado» en pantalla (ver abajo) |
| V48 | 2 | Obfuscation / Encryption | Una sola. Base64 como obfuscation se sostiene (ver abajo) |
| V48 | 3 | Geolocation / Geographic restrictions | Una sola, y es justo la separación del 3.3; depende de corregir `fcp325` |

**Las cinco notas de los autores, puestas a prueba:**
- **V46 P2, la trampa que afirma algo falso** (`fichas/V46-sp3m2.md:150`, duda 2 `:334-340`). Se queda. Una opción incorrecta construida
  sobre la idea errónea que se quiere detectar («la imagen trae su kernel») es exactamente un distractor de examen; todas las opciones
  incorrectas afirman algo falso, y esta lleva su `trapWhy` en pantalla, que lo desmiente. La alternativa de la ficha («Las imágenes base de
  los contenedores») no afirma nada falso, pero deja la clave como la única opción con «kernel», la palabra central del escenario, y eso es
  una pista peor que el error. Además, «imágenes reconstruidas ayer» hace tentadora la C de verdad (ayer, antes del aviso). No cambiar.
- **V48 P2, Base64 como obfuscation** (`fichas/V48-sp3m6.md:149-153`, duda 2 `:366-370`). Se sostiene. Base64 es una codificación, y
  los materiales de preparación la ponen de ejemplo de obfuscation («hace el dato difícil de interpretar sin garantía criptográfica»,
  `sp/sp3-part3.ts:497`). De las cuatro opciones solo esa encaja: sin clave no es encryption (`:493`), se deshace y no es hashing (`:494`),
  no hay sustituto ni vault y no es tokenization (`:496`). La tokenization es, en el 1.4, una forma de obfuscation, pero aquí no hay
  sustituto, así que no abre otra respuesta. Un matiz: «Cualquiera la deshace sin clave» en pantalla le quita fuerza a la trampa, pero sin
  esa frase la encryption «débil» podría defenderse. Dejarlo así.
- **V48 P1, un soporte que viaja, at rest** (`fichas/V48-sp3m6.md:115-119`, duda 1 `:362-365`). Se sostiene. CompTIA define in transit
  como el dato que se transmite por una red, y at rest como el que está en un soporte de almacenamiento; la lección pone USB, móvil y backup
  en at rest (`sp/sp3-part3.ts:452`), `fcp324` dice «crossing a network» (`sp/sp3-cards.ts:39`) y spl3b llama a las cintas enviadas «datos
  en reposo viajando» (`sp/labs-sp3.ts:141`). Algún material ajeno habla de «media in transit» para envíos por mensajería, y por eso
  «El disco va desconectado todo el camino» tiene que quedarse en pantalla (está).
- **V45 P2, registros del proveedor frente a EDR** (`fichas/V45-sp3m1.md:171-175`, duda 4 `:398-402`). Se sostiene. «On the function's
  OS» cierra la lectura de las extensiones de EDR que se cargan con la función: el sistema operativo es del proveedor (`sp/sp3-part1.ts:59`,
  `:113`). Las otras tres son imposibles, así que «sin calificador» es correcto.
- **V47 P1, alta disponibilidad frente a un repuesto** (`fichas/V47-sp3m3.md:122-126`). Exacta (`sp/sp3-part2.ts:73`), pero ver A-1.

**A-1.** `fichas/V47-sp3m3.md:122` (escenario), `:124` (opciones), `:131` (trampa) · regla 4 (la trampa tienta de verdad) · **media**. El
escenario nombra las dos piezas sin duplicar («una sola alimentación y un solo cable de red») y la clave es «Duplicar la alimentación y el
cable de red»: se responde leyendo. La trampa (el repuesto en el almacén) muere sola, porque el propio `trapWhy` lo admite: «si lo que
falla es la alimentación, el repuesto no arregla nada» (`:134`). Además, la imagen del vídeo (dos camiones de guardia frente a uno en la
nave) enfrenta **duplicado en marcha frente a repuesto parado**, y la pregunta enfrenta otra cosa. La salida que propone la ficha
(`:139-141`) sigue nombrando «un enchufe y un cable». **Arreglo:** que el escenario deje la elección entre redundancia en marcha y
repuesto, que es lo que enseña la tarjeta «HA se diseña»:
- `scenario`: «La ventilación de un túnel depende de un solo controlador. Si se avería, el túnel se cierra hasta que llega otro y lo
  cambian.» (126)
- `q` sin cambios. `options`: A) Guardar otro controlador igual en el almacén (44, trampa) · B) Contratar un seguro que cubra la parada (39)
  · C) Cifrar lo que viaja por su cable (32) · D) Un segundo controlador funcionando a la vez (43, clave). La clave no es la más larga.
- `why` (D): «Si uno falla, el otro ya está trabajando: el túnel no llega a pararse» (69). `trapWhy` (A) sin cambios (62).
- Voz: «Primera pregunta. La ventilación de un túnel de carretera depende de un solo controlador. Si se avería, el túnel se cierra hasta
  que llega otro y lo cambian. ¿Qué cambio es el mejor para que no se pare?» (38 palabras, dos menos que ahora). «MEJOR» sigue justificado:
  el repuesto acorta la parada, pero no la evita. Ninguna pieza del banco tiene la high availability de clave; el ejemplo de resilience de
  la tabla (`sp/sp3-part2.ts:118`) no es banco y la pregunta no pide el nombre.

**A-2.** `fichas/V45-sp3m1.md:210` (`why`), duda 3 `:395-397` · regla 4 (exactitud de la explicación) · baja. El atacante está **dentro**
de reseñas: si pagos solo comprueba quién llama, sabrá que llama reseñas y se las dará igual. Lo que corta el salto es que, sabiendo quién
es, no le deje pedir tarjetas (autenticar y luego autorizar). «Si pagos comprueba quién le llama, reseñas no puede pedirle las tarjetas»
salta ese paso. La clave sigue siendo la única defendible entre las cuatro (es el término de la lección, `sp/sp3-part1.ts:135`, y ninguna
opción dice least privilege). **Arreglo:** `why` «Pagos comprueba quién le llama, y reseñas no está entre los que pueden pedir tarjetas»
(85 ≤ 90).

**Correcciones de lección que traen las fichas** (diseño §9.3):
- **V45, `sp/sp3-part1.ts:93`** (`fichas/V45-sp3m1.md:379-385`). **Válida.** La lección no contradice a CompTIA: le falta el paso (qué se
  hace con una credencial ya subida), y la ficha lo pide por su regla de «todo lo que enseña el vídeo va antes en la lección», no por §9.3.
  Que sea condición del PR es razonable. Un matiz: el texto propuesto («borrar la línea, o incluso el historial, no lo arregla…») enuncia
  justo la trampa de la pregunta 1 cincuenta líneas antes del vídeo, el problema de `rev8` B-4. Mejor sin nombrar el historial: «Una
  credencial que llega a subirse se da por comprometida: se revoca y se sustituye, aunque luego se borre.» La opcional de `fcp302`
  (`sp/sp3-cards.ts:7`) es correcta.
- **V47, `sp/sp3-part2.ts:53`** (`fichas/V47-sp3m3.md:362-368`). **Válida, por coherencia** (no es una contradicción con CompTIA: un
  fabricante desaparecido deja sin parches y, si solo él firma, deja además sin poder parchear, que es lo que dice q7, `:279-293`). La
  nota mete al fabricante desaparecido dentro de inability to patch, y el callout (`:176`) y la tabla (`:150-159`) lo ponen en patch
  availability; la tarjeta de s06 depende de esa separación. El texto propuesto mantiene q7 verdadera. Más corto: «—**inability to
  patch**, porque el parche invalida la certificación o porque no hay ventana de parada; si el fabricante ya no publica parches, eso es
  **patch availability**, y la respuesta es la misma—».
- **V48, `fcp325` (`sp/sp3-cards.ts:40`) y glosario `:97`** (`fichas/V48-sp3m6.md:341-351`). **Válida y condición por §9.3.** El 3.3
  pone geolocation en «General data considerations» y geographic restrictions en «Methods to secure data»; la flashcard y el glosario
  llaman a las dos «the controls that keep the data… inside the permitted territory», y la lección las separa (`sp/sp3-part3.ts:472`
  frente a `:500`). Los dos textos propuestos son correctos.
- **Lo que nadie propone y conviene saber:** la lección sp3m3 da los dos controladores con su alimentación como high availability en el
  texto (`sp/sp3-part2.ts:73`) y como resilience en la tabla (`:118`). No contradice a CompTIA (son conceptos solapados), y con el arreglo
  de A-1 ninguna pregunta depende de ello. No es condición.

## B. Banco (quiz, checks, colocación, flashcards y labs)

Se leyeron todos los ítems: los 21 del quiz de las tres lecciones de 3.1 y los 8 de sp3m6, sus 12 checks, las 12 de `placement-sp3.ts`,
`fcp301`–`fcp312` y `fcp323`–`fcp326` con su glosario, y los ítems de spl3a y spl3b. No hay copias ni paráfrasis. Son espejos aceptables
(otra clave o la trampa invertida): V45 P1 frente al check `sp/sp3-part1.ts:95-109`; V45 P2 frente a `pl-sp3q2` (`sp/placement-sp3.ts:51-65`);
V46 P2 frente al check `:375-389`; V46 P3 frente a q7 (`:492-506`, el paso anterior de q7); V47 P3 frente a q7 (`sp/sp3-part2.ts:279-293`) y
el check `:55-69`; V48 P3 frente a q7 de sp3m6 (`sp/sp3-part3.ts:600-614`). Ninguna es una flashcard con opciones. Los que rozan:

**B-1.** `fichas/V45-sp3m1.md:207` · regla 5 (espíritu, `rev8` B-4) · baja. El tercer hallazgo del callout que va justo antes del vídeo
es «un servicio interno que acepta peticiones de cualquier otro servicio sin autenticación» y su lección, «en microservicios el tráfico
este-oeste también se autentica» (`sp/sp3-part1.ts:143`); la lista dice «no basta con vigilar el perímetro» (`:135`), que es la pareja
clave/trampa. La pregunta añade ataque, daño y otra organización, y la ficha lo declara (`:232-235`). Se salva; si se quiere separar más,
quitar del escenario «sin preguntar quién las pide» (pasa a «…y, desde ahí, el servicio de pagos le da las tarjetas», 148), con lo que hay
que razonar el control en vez de leerlo. Va con A-2.

**B-2.** `fichas/V46-sp3m2.md:180-186`, tarjeta `:219` · regla 5 (espíritu) · baja. La nota de examen dice «Si el enunciado se queja de
políticas distintas en cada sede, la respuesta es **centralizar la gestión**» y avisa de no confundir el eje de dónde con el de quién
(`sp/sp3-part1.ts:373`): la pregunta 3 es esa regla con su trampa, y la tarjeta de s07 («Políticas distintas en cada sede: centraliza») la
copia. Es una regla, no un ejemplo resuelto, y practicarla es el sentido de la nota; se acepta. Si se toca, que la tarjeta diga lo que
añade el vídeo: «Mudarse a la nube no cambia quién decide» (39).

**B-3.** `fichas/V47-sp3m3.md:160`, `:192` · regla 5 (espíritu) · baja. Las preguntas 2 y 3 son las dos claves del callout «Cómo se leen
estas doce» (`sp/sp3-part2.ts:176`: «Reacciona en milisegundos → responsiveness (no availability)»; «El fabricante ya no publica… →
patch availability; y además no podemos aplicarlas nunca → inability»). Se aceptan: el callout da pistas sin escenario, y la 2 cruza
dos de sus pistas («siempre» y «milisegundos») a propósito.

**B-4.** `fichas/V45-sp3m1.md:196` · exactitud de la ficha · baja. «Ninguno de los tres usa el agente como opción» es falso: q5 lleva
«Antivirus agents must be installed on each function instance» (`sp/sp3-part1.ts:218`). No cambia el veredicto (en q5 es una opción
muerta frente al rol IAM, y la pregunta 2 pide otra cosa), pero la frase de la ficha debe decirlo: «q5 lo tiene de distractor muerto; aquí
es la trampa, con otro escenario y otra pregunta».

## C. Coherencia entre las cuatro

**C-1.** `fichas/V45-sp3m1.md:135`, `:173`, `:209`, decisión 8 `:364` · diseño §3 («preguntas enteras en inglés», no) y §4.3 · **media**.
V45 pone las acciones como frases enteras en inglés («Purge the key from the history», «An EDR agent on the function's OS», «More replicas of
the reviews service»). V46 (`:101`) y V47 P1 (`:108`) las ponen en español, como V30, V40 y V44 publicados o aprobados; los términos sueltos
van en inglés en las cuatro. El precedente que cita V45 es V38 (`f7/V38-sp2m5.md:357`), que lo hizo así, pero la decisión de Lidia del
diseño es «en español, con las palabras clave en inglés». **Arreglo** (el criterio lo decide quien coordina; lo recomendado es el del diseño):
- P1: A) Borrar la clave del historial (29) · B) Hacer privado el repositorio (28) · C) Anular la clave y crear otra (28) · D) Activar la
  detección de *drift* (29).
- P2: A) Una imagen del disco del *host* (29) · B) Los registros que da el proveedor (33) · C) Una captura de tráfico en el *host* (33) · D)
  Un agente EDR en el sistema de la función (41).
- P3: A) *Service-to-service authentication* (33) · B) Más réplicas del servicio de reseñas (36) · C) Reglas más estrictas en el *firewall*
  perimetral (46) · D) Un balanceador delante de pagos (31).
Ninguna clave queda como la más larga.

**C-2.** Letras en las cuatro fichas (`fichas/V45-sp3m1.md:409-411`, `V46-sp3m2.md:319`, `V47-sp3m3.md:377`, `V48-sp3m6.md:384`) · regla 4
(`rev8` C-3) · **media**. Claves en orden del curso: C B A · D A C · C D A · D A C → **A 4 · B 1 · C 4 · D 3**; la B es correcta una sola vez
(V45 P2). Trampas: A D C · B C A · A B D · C D A → A 4 · B 2 · C 3 · D 3. Además V46 y V48 repiten la misma serie de claves (D, A, C), y
V45 P1 y V47 P1 la misma pareja (clave C, trampa A). Sin rachas de tres. **Arreglo**, con cuatro cambios de orden que no tocan textos:
V46 P2, A↔B (clave **B**: «El kernel del host»); V47 P1, la versión de A-1 (clave **D**); V48 P1, opciones A *Data in use* · B *Data at
rest* · C *Data in transit* · D *Data sovereignty* (clave **B**, trampa C); V48 P3, A *Segmentation* · B *Geographic restrictions* · C
*Geolocation* · D *Data sovereignty* (trampa **B**). Queda: claves C B A · D B C · D D A · B A C = **3 · 3 · 3 · 3**; trampas A D C · B C A ·
A B D · C D B = **3 · 3 · 3 · 3**; ninguna letra tres veces seguida. Cada ficha corrige su «Comprobación de límites».

**C-3.** `fichas/V45-sp3m1.md:102`, `:113`, `:114` · regla 8 (imágenes iguales para conceptos distintos, `rev8` C-2) · **media**. La
segunda mitad de las sucursales («si una manda dinero a cualquiera que llame diciendo “soy la de la plaza”… devuelve la llamada al número
de la lista») es la **out-of-band verification** de V34: «confirmar por un canal que ya tenías (el número de la agenda)», con «la tarjeta del
banco, girada, con el número del dorso resaltado» (`f7/V34-sp2m3.md:97`, `:111`). V45 la usa para la service-to-service authentication, y
la ficha solo se separa de V34 en que «las sucursales no tienen tarjetas» (`:314`): el mecanismo (dinero, una llamada que suplanta, la
devolución al número conocido) es el mismo, y en V34 es el control contra el BEC. **Arreglo:** quedarse con la primera mitad (si roban una
sucursal, las demás no pierden nada: blast radius) y contar la autenticación entre piezas sin imagen, con el esquema del puerto de s06;
la vuelta de s07 pasa a «la sucursal no tenía que entregar nada sin saber quién lo pedía». Es la alternativa 2 de la ficha a medias, y
ahorra unos 4 s.

**C-4.** `fichas/V46-sp3m2.md:28` (tags), `:33` (léxico), `:85`, `:96` · coherencia con V45 (`:49-50`) y V47 (`:284-285`) y con V16, V17,
V24 y V30 (`reg:415`, `:417`, `:423`, `:426`) · **media**. V45 y V47 prohíben «punto único de fallo» y «single point of failure» por el
dosier de BLIND ARCHITECT («GH busca un punto único de fallo», `reg:332`, `:413`), y ningún vídeo publicado de sp3 lo dice. V46, que va
antes que V16 en el curso, lo pone en la cuadrícula de s06 («single point of failure y objetivo»), en el léxico y en las etiquetas de
YouTube. **Arreglo:** s06, «CENTRALIZED: una consola · la misma política · una sola vista · si cae la consola, todas a ciegas · y es un
objetivo» (el chip nuevo mide 52); fuera del léxico y de los tags. El concepto sigue en la lección (`sp/sp3-part1.ts:322`, `:373`, q7).

**C-5.** `fichas/V45-sp3m1.md:13-19`, `:260-264`, decisión 1 `:345-347` · reparto con V38 y diseño §8 · **media**. V38 dejó para el vídeo de
sp3m1 «el centro, que sí se mueve: la escalera IaaS → PaaS → SaaS → serverless y quién parchea el sistema operativo invitado… la
responsibility matrix… “la nube” frente a “en la nube”… la trampa de lo ofrecido frente a lo activado» (`f7/V38-sp2m5.md:23-26`). V45 cita
ese reparto (`:13`) pero solo recoge lo que V38 deja libre (`:28-30`) y descarta el resto por estar ya cinco veces en el banco; y V46 cree
que «la nube, sus modelos y la shared responsibility» son de V45 (`fichas/V46-sp3m2.md:290`). Resultado: la escalera, la confusión más
preguntada del 3.1, no tiene vídeo en el curso, y el diseño §8 pide elegir «los que más preguntas tienen en el banco». La razón de V45 (no
hay pregunta nueva que no parafrasee q1, q2, el check o `pl-sp3q2`) es buena para no **preguntarla**, no para no **enseñarla**.
**Arreglo:** en s04, antes de la bici, una frase y tres chips sin pregunta: «En IaaS el sistema invitado es tuyo; en PaaS, en SaaS y en
serverless lo parchea el proveedor» (unos 6 s, cabe: V45 queda a 37–40 s del mínimo); y en la cabecera de V45, decir que recoge la
escalera de V38 solo como frase. Si Lidia prefiere no tocar V45, apuntarlo en `reg` §5 y en V38 al publicar.

**C-6.** `fichas/V45-sp3m1.md:100`, `:109`; `fichas/V46-sp3m2.md:83`; `reg:1438` · regla 8 · baja. Tres imágenes con la forma «un molde,
muchas copias» en tres vídeos del curso: la foto de la central de V30 (baseline), el patrón de costura de V45 (lo que viaja en las
copias) y el molde con la muesca de V46 (se arregla el molde). V45 ya le quitó el defecto al patrón, pero su tarjeta y sus chips («la
plantilla repite lo bueno y lo malo», «un error, en todas partes a la vez») dicen lo mismo que el molde de V46, en lecciones seguidas.
**Arreglo:** que V45 cambie la imagen por una sin copias, que es lo que enseña su pregunta: «un pósit en la nevera de la oficina con la
clave de la alarma: lo quitas a la hora, pero quien pasó ya la sabe, así que cambias la clave» (la pizarra está ocupada por V5 y V44). El
error copiado se queda contado con la plantilla del puerto, sin imagen, como ya hace.

**C-7.** `fichas/V46-sp3m2.md:93`, `fichas/V47-sp3m3.md:100`, `fichas/V48-sp3m6.md:97` frente a `fichas/V45-sp3m1.md:110` · coherencia ·
baja. Solo V45 dice que la línea «MEJOR: la que encaja con este caso, aunque otra suene bien» **la dibuja la escena**; las otras tres
escriben «debajo, la línea de V28», que es justo la línea que en V28 y V29 no salió en pantalla porque el panel no la pinta
(`reg:1358-1359`, `:1372-1373`). **Arreglo:** en las tres, «debajo, dibujada por la escena (el panel no la pinta), la línea de V28».

**C-8.** `fichas/V45-sp3m1.md:66-67`, `fichas/V46-sp3m2.md:54`, `fichas/V47-sp3m3.md:57`, `fichas/V48-sp3m6.md:54` · regla 8 · baja. Las
cuatro líneas de entrada de la lección tienen la misma forma («Antes de …, ponte a prueba: …, con tres preguntas como las del examen»), dos
empiezan por «Antes de pasar…» y la de V45 mide 32 palabras. Leídas una tras otra en el dominio 3, suenan a plantilla. **Arreglo:**
variar: V45 «Tres preguntas como las del examen sobre la plantilla, la función y las piezas, antes de bajar a la red»; V46 se queda; V47
«Pon a prueba lo que no se para con tres preguntas de examen»; V48 «Antes de la recuperación, tres preguntas: dónde está el dato y qué lo
protege».

**C-9.** Repeticiones que no molestan pero conviene saber: «una empresa» es el sujeto de seis de los doce escenarios (V45 P1 y P2, V46 P2 y
P3, V48 P2 y P3); dos escenarios de comercio en línea (V45 P3, V46 P1, declarado); tres bancos en imágenes de la serie (las sucursales de
V45, la transferencia de la hucha de V48, la tarjeta de V34); el «camión de repuesto en la nave» de V47 queda cerca del teatro hot/warm/cold
de V24 (sp3m7), que viene después, y la tarjeta «HA se diseña» no lo confunde con un hot site. Baja; si se toca algo, cambiar «una empresa»
por un sujeto concreto en dos o tres (un estudio de arquitectura, una cadena de gimnasios, una distribuidora).

**Sin adversario en las cuatro**, con razones coherentes con el orden del curso (V45, V46 y V47 van antes de V16; V48 evitaría una cuarta
aparición tras V24). Coherente.

## D. Canon

No hay choques con fechas, sistemas con nombre, el caso de septiembre ni los dosieres de RED MARROW o BLIND ARCHITECT. Ninguna ficha
fecha nada. En el puerto solo hay propuestas y decisiones; ninguna grúa se para en V47, nadie sube una clave en V45, nada se despliega con el
fallo en V46 y ningún dato sale en V48. Las doce preguntas van fuera del puerto, con el rótulo «pregunta tipo examen · ejemplo» dibujado por
la escena (contradicción 17, `reg:501-523`), y el único ataque con éxito (V45 P3) no tiene lugar. Matices:

**D-1.** `fichas/V46-sp3m2.md:91`, `:94`, `:248-249`, pregunta para Lidia 3 `:325` · regla 1 · **media**. «Nóminas» es una de las dos
aplicaciones de oficina que viven en máquinas virtuales del centro de datos y «se queda en su VM». El registro lo dice expreso: «la nómina la
calcula un SaaS en sp5» (`reg:222`), y la lección lo repite (`sp/sp5-part3.ts:22`, `:147`, `:368`); V48 lo apunta en «No se toca»
(`fichas/V48-sp3m6.md:267`). Tampoco vale la alternativa de la ficha, «la aplicación de Facturación»: sp3m1 tiene «el SaaS de facturación»
(`sp/sp3-part1.ts:89`). **Arreglo:** «los expedientes de la plantilla», la aplicación antigua de RR. HH. que ya existe (`reg:222`), que se
queda en su VM sin decir nada de su segundo factor ni de sus tres ordenadores. Si se prefiere no tocar canon de V28, una nueva sin dueño
previo: «la aplicación de expedientes disciplinarios de RR. HH.».

**D-2.** `fichas/V45-sp3m1.md:101`, `:111`, `:112` · regla 4 (exactitud de la imagen, `rev8` D-7) · **media**. «No le puedes poner tu GPS:
el recorrido te lo da la aplicación del servicio»: en una bici pública cualquiera lleva su móvil con GPS, así que la imagen falla justo en el
rasgo que ilustra (no puedes poner tu propio instrumento en algo que no es tuyo). **Arreglo:** «No le puedes atornillar tu localizador: el
recorrido te lo da la aplicación del servicio», con «tu localizador» tachado en s04 y en la vuelta de s05 («el recorrido te lo da la
aplicación del servicio, no tu localizador»).

**D-3.** `fichas/V48-sp3m6.md:94` frente a `:255-256` · regla 1 · baja. s02 dice que la pantalla da al pasillo «y cualquiera que pasa la
lee», en presente; el canon de la ficha dice «Es una exposición sin daño: nadie lee nada». **Arreglo:** «cualquiera que pasara podría
leerla».

**D-4.** `fichas/V45-sp3m1.md:299-300` · baja. «El sistema de asignación de atraques de sp5m4 (`reg:219`)»: esa fila es el seguimiento de
llegadas y salidas de V26, que solo dice que no es el de atraques. **Arreglo:** citar `reg:1066` (Notas de V26) o `sp/sp5-part2.ts:422`.

**D-5.** `fichas/V47-sp3m3.md:98` · baja, sin arreglo obligatorio. La grúa de s01 lleva «un contenedor colgado del gancho», y V46, una
lección antes, aclara que sus contenedores son de software. No choca (son vídeos distintos y el de V47 es el del muelle); se apunta para que
quien monte V46 no use ese dibujo.

**D-6.** `fichas/V47-sp3m3.md:235` · regla 8 · baja. La regla 1 del cierre, «En lo que mueve cosas físicas, primero que no se pare…», está a
una palabra de la frase de V30, «Lo que mueve cosas físicas es la OT» (`video/baseline-halden/narration.json` s06-03). V47 va antes en el
curso y lo declara (`:307`); está bien, pero que el guion no la diga dos veces.

## E. Citas

Se comprobaron unas 150 citas `ruta:línea` y `reg:NNN`: todas las de lección, quiz, checks, colocación, flashcards, glosario y labs de las
cuatro fichas; las de `reg` de §1, §2, §4, §5 y §6; `profiles.mjs:76-91` (el perfil empieza en `:77`, con el comentario en `:76`: bien),
`narration.mjs:23-28`, `ExamQuestionLayer.tsx:280`, `content.test.ts:248` y `:297-302`, la línea 143 de la narración de V28, los
segmentos citados de V16 (s07-05, s07-06), V17 (s07-05), V30 (s06-03, s06-04) y V11 (s04-04, s05-02, s10-02, s10-03), la línea 137 de la
narración de V38 y las de las fichas V30, V31, V34, V37, V38 y V39. Están bien salvo estas:

| Ficha | Cita | Qué hay | Debe ser |
|---|---|---|---|
| `V46-sp3m2.md:279` | `reg:1415` (zona de gestión y jump server de V16) | la fila de la ventanilla de navieras y el edificio de oficinas | `reg:307` o `reg:645-648` |
| `V45-sp3m1.md:300` | `reg:219` (asignación de atraques de sp5m4) | el seguimiento de llegadas y salidas de V26 | `reg:1066` o `sp/sp5-part2.ts:422` |
| `V45-sp3m1.md:196` | q5 «no usa el agente» | q5 lo lleva de distractor (`sp/sp3-part1.ts:218`) | ver B-4 |
| `V45-sp3m1.md:13` | `f7/V38-sp2m5.md:15-34` como «V38 se queda con los dos extremos» | dice eso y además que el centro es de sp3m1 (`:23-26`) | ver C-5 |

Menores, sin cambio de sentido: `V46-sp3m2.md:272` acota las imágenes ocupadas en `reg:1415-1450` (la tabla empieza en `:1395`); V47 cita
`reg:676-679` para la inundación de las esclusas (son «Notas de V16», «La OT, sin conexión»; la frase de la inundación es
`video/zonas-halden/narration.json` s07-05, que también cita).

## F. Recuentos (Node, `[...texto].length` y palabras por espacios)

Todo cuadra con lo que dicen las fichas:
- `scenario`, `q`, las 48 opciones, `why` y `trapWhy` de las 12 preguntas: el número de cada fila coincide con el real, y todos están dentro
  de los límites del motor (`narration.mjs:23-26`): escenario máx. **157** (V45 P3; límite 160), `q` máx. 56, opción máx. 53, `why`/`trapWhy`
  máx. **83** (V45 P2; límite 90). Las 20 tarjetas, de 34 a 47; el motor admite 58 (`EXAM_TEXT_MAX`, `narration.mjs:13`): el «máximo 48» de
  las fichas es un límite propio, más estricto, no del motor.
- Palabras leídas de escenario y pregunta: V45 41 · 34 · 48 (con «Primera pregunta», «Segunda» y «La última»); V46 37 · 36 · 34; V47 40 · 33 ·
  37; V48 39 · 46 · 35. Glosas de «MEJOR»: 20 (V45), 18 (V48). Resoluciones de V45: 25, 23 + 17, 24 + 7.
- Sumas de escenas: 270 · 272 · 270 · 270. `wordBudget` (`s` × 2,7): 730 · 735 · 729 · 729, y los de las escenas de pregunta, (`s` − 8) × 2,7
  (plan §1, «Regla de redacción»), coinciden: 92/76/81 · 86/81/76 · 92/81/76 · 76/86/76. El hueco de resolución de cada pregunta cuadra
  (el más justo, V45 P2: 40 de 42).
- Duraciones: razón 1,024 → 276,5 s (V45, V47, V48) y 278,5 s (V46); por tipo de escena, 280,1 · 282,5 · 280,1 · 280,5. Márgenes a 240 y 330
  bien calculados.
- Títulos de bloque 47 · 34 · 32 · 35; de YouTube 63 · 73 · 85 · 87; línea de «MEJOR» 58; frases del cierre 21 palabras (V45) y 105 caracteres
  (V47).
- 0 think prompts y 0 mensajes interceptados; ninguna pregunta en s01 ni en la última; ninguna tarjeta en s01 ni en el cierre, y como mucho
  una por escena.
- Textos propuestos en esta revisión, contados igual: A-1 escenario 126, opciones 44 · 39 · 32 · 43, `why` 69, voz 38 palabras; A-2 `why` 85;
  B-1 escenario 148; C-1 opciones 29 · 28 · 28 · 29 / 29 · 33 · 33 · 41 / 33 · 36 · 46 · 31; C-4 chip 52; B-2 tarjeta 39.

**F-1.** `fichas/V47-sp3m3.md:53` · baja. «La resolución cabe en unas 52 (con la línea del «MEJOR», unas 15)» se lee como «15 palabras de
resolución». Las cuentas dicen otra cosa: 92 − 40 = 52, y con una glosa de unas 15 palabras quedan unas 37. **Arreglo:** «unas 52 (unas 37
tras la glosa de «MEJOR», de unas 15)».

**F-2.** `fichas/V45-sp3m1.md:53` frente a `V47-sp3m3.md:46` y `V48-sp3m6.md:42` · baja. La misma suma de 270 s da «unos 277 s» en V45 y
«unos 276 s» en V47 y V48 (276,48). Unificar en 276.

## G. Naturalidad

**G-1.** `fichas/V45-sp3m1.md:110`, `fichas/V46-sp3m2.md:93`, `fichas/V48-sp3m6.md:97` (y V47 `:100`, sin texto) · `rev8` G-4 · baja. La glosa
de «MEJOR» sigue siendo la de V28 («Fíjate en ese “mejor”. Pide la que más encaja con este caso, aunque otra suene bien»,
`video/controles-halden/narration.json:143`): V46 la dice tal cual; V45 repite «pide la que más encaja con este caso»; V48 abre con «Fíjate en
ese MEJOR:» y lleva dos puntos en la voz. **Arreglo**, una por vídeo:
- V45: «Ojo con ese “mejor”: aquí más de una ayuda, así que quédate con la que resuelve este caso» (18 palabras).
- V46: «Ese “mejor” avisa de que hay más de una que ayuda, pero solo una arregla lo que cuenta el caso» (20).
- V47: «Con un “mejor” delante, no busques la única que sirve, sino la que más sirve aquí» (16).
- V48: «Con un “mejor” delante, alguna otra sonará bien, pero vale la que describe lo que se ha hecho» (18).

**G-2.** `fichas/V45-sp3m1.md:213-214`, `fichas/V48-sp3m6.md:142-143` · plan §1, regla 8 · baja. Dos frases leídas pasan de 25 palabras:
«Un atacante entra por un fallo de las reseñas, y desde ahí le pide las tarjetas al servicio de pagos, que se las da sin preguntar quién
las pide» (28) y «Antes de mandar por correo su lista de clientes a una gestoría, una empresa la convierte a un formato que no se lee a simple
vista» (26). **Arreglo:** «Un atacante entra por un fallo de las reseñas. Y desde ahí le pide las tarjetas al servicio de pagos, que se
las da sin preguntar quién las pide» (48 palabras en total, igual); «Una empresa va a mandar por correo su lista de clientes a una gestoría.
Antes, la convierte a un formato que no se lee a simple vista» (47 en total, una más; la resolución cabe con la glosa de G-1).

**G-3.** `fichas/V45-sp3m1.md:141`, `:179`, `:215` · plan §1, regla 7 (fórmulas) · baja. Las tres resoluciones de V45 usan la misma
fórmula, «X tienta, pero…» («Limpiar el historial tienta, pero…», «El agente tienta, pero…», «El perímetro tienta, pero…»). **Arreglo:**
variar dos: «Limpiar el historial parece rematarlo, pero quien la copió ya la tiene»; «¿Y su agente? No tiene dónde ponerlo» (o sin
pregunta: «Y un agente no tendría dónde ponerlo»).

**G-4.** `fichas/V46-sp3m2.md:38`, `:96`, `:224-225` · plan §1, reglas 2, 7 y 8 · baja. En la voz: «aquí, contenedor es de software: nada
que ver con los del muelle» (dos puntos donde basta una coma: «aquí, un contenedor es de software, nada que ver con los del muelle»); «¿Y
por qué no a la nube?» es la fórmula «¿Y …?» que el validador avisa («¿Por qué no llevarlas a la nube?»); y la regla 2 del cierre son 37
palabras con dos puntos («Aísla más el air gap, luego la máquina virtual y al final el contenedor, que comparte el kernel del host. Eso se
arregla en el host, y lo que no es de la misma confianza no lo comparte»).

**G-5.** Español natural en las cuatro, sin jerga de trabajo en inglés en la voz; los términos en inglés son los del examen y se explican
antes de nombrarse. «App» en el escenario de V45 P3 es español corriente. Ningún «Gana …» ni «PRIMERO» en la voz de ninguna ficha.

## Qué se ha aplicado (2026-10-17, tras la revisión)

Un agente por ficha aplicó los hallazgos de la suya; quien coordina resolvió los cruces. Recuentos rehechos con Node en las cuatro.

- **A-1 + C-2 (V47 P1):** escenario nuevo («un solo controlador; si se avería, el túnel se cierra hasta cambiarlo»); clave **D** «Un segundo
  controlador funcionando a la vez», trampa A, el repuesto en el almacén.
- **A-2 (V45 P3):** `why` «Pagos comprueba quién le llama, y reseñas no está entre los que pueden pedir tarjetas» (85).
- **B-1, B-4 (V45):** «sin preguntar quién las pide» sale de la pantalla y de la voz; la ficha ya reconoce que q5 usa el agente como
  distractor (`sp/sp3-part1.ts:218`).
- **C-1 (V45):** opciones en español con el término del examen en inglés; la D de P2 es «Un agente EDR en el sistema operativo de la
  función», para no reabrir la duda de las extensiones EDR.
- **C-2:** letras finales, en orden del curso. Claves C B A · D B C · D D A · B A C = **A 3 · B 3 · C 3 · D 3**; trampas A D C · B C A ·
  A B D · C D B = **3 · 3 · 3 · 3**; sin ninguna letra tres veces seguida.
- **C-3, C-6, D-2 (V45):** las sucursales solo enseñan blast radius (sin la llamada de vuelta de V34); el patrón de costura pasa a ser el
  pósit en la nevera, así que el molde de V46 queda como la única imagen de «un molde, muchas copias» en sp3; la bici pública dice «No le
  puedes atornillar tu localizador».
- **C-4, D-1 (V46):** sin «single point of failure» en voz, pantalla, léxico ni etiquetas (el chip de CENTRALIZED dice «si cae la consola,
  todas a ciegas · y es un objetivo»); «nóminas» pasa a «los expedientes de la plantilla», la aplicación antigua de RR. HH. de V28
  (`reg:222`), que se queda en su VM.
- **C-5 (V45):** una frase sin pregunta en s04 («En IaaS, el sistema operativo invitado es tuyo. En PaaS, en SaaS y en serverless, lo
  parchea el proveedor»), con lo que se cubre lo que V38 dejó a sp3m1. s06 baja de 38 a 34 s: V45 suma 266 s (~272 s renderizados).
- **C-7:** las cuatro dicen que la línea de «MEJOR» la dibuja la escena (`reg:1358-1359`).
- **C-8:** líneas de entrada distintas en V45, V47 y V48; V46 se queda.
- **C-9:** «una empresa» desaparece de los escenarios. Sujetos finales: V45 una agencia de viajes y una aseguradora; V46 un periódico y una
  inmobiliaria; V48 una distribuidora y una editorial. (Al aplicar, V46 y V48 eligieron a la vez «una editorial», y V45 y V46 «una agencia
  de viajes»; quien coordina cambió los dos de V46.)
- **D-3 (V48):** la pantalla del pasillo «cualquiera que pasara podría leerla», seguida de la decisión. «Desconectado» sigue en la pantalla
  de P1.
- **D-5, D-6, E:** las citas corregidas (`reg:307`, `reg:1395-1452`, `reg:1066` + `sp/sp5-part2.ts:422`, `reg:676-681`) y las notas de
  solape entre V46 y V47.
- **F:** cifras de duración iguales en toda cada ficha (V45 ~272 s, V46 ~279 s, V47 ~276 s, V48 ~276 s); las tarjetas aclaran que 48 es un
  límite propio y el motor admite 58 (`narration.mjs:13`).
- **G-1 a G-5:** glosa propia de «MEJOR» en cada vídeo; frases de más de 25 palabras partidas; sin dos puntos ni «¿Y …?» en la voz; una sola
  «X tienta, pero» en V45.
- **Correcciones de lección (condición del PR de cada vídeo):** V45 `sp/sp3-part1.ts:93` («Una credencial que llega a subirse se da por
  comprometida: se revoca y se sustituye, aunque luego se borre»; opcional `fcp302`); V47 `sp/sp3-part2.ts:53` con la redacción corta;
  V48 `fcp325` y el glosario `:97`, que separan geolocation de geographic restrictions.

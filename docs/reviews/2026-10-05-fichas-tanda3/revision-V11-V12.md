# Revisión de exactitud y canon · V11 (sp1m6) y V12 (sp1m7)

> Las citas `fichas/Vnn-…-ficha.md:NN` y `fichas/Vnn-…-decisiones.md:NN` remiten a los borradores que se revisaron,
> antes de aplicar esta revisión. Las fichas corregidas están en el plan de vídeos (§5) y sus decisiones en `decisiones.md`.

Revisión de solo lectura del 2026-10-05. Fuentes: `brief-fichas-tanda3.md` y `brief-revision-tanda3.md` (el encargo), las
dos fichas con sus decisiones (`fichas/V11-sp1m6-*.md`, `fichas/V12-sp1m7-*.md`), las de V16 y V17 en lo que comparten,
la lección `sp/sp1-part4.ts` con sus checks y su quiz, los laboratorios de sp1 (`sp/labs.ts:16-257`), `sp/sections.ts`,
CHG-2041 (`sp/sp1-part3.ts:70-83`), el registro `docs/superpowers/canon/glass-harbor.md`, la ficha de V10 en el plan y su
carpeta congelada, y los datos en pantalla de V1, SIEM, V4 y V6.

Rutas relativas a la raíz del repo: `sp/` = `src/data/secplus/` · `v1/` = `video/capas-halden/` · `siem/` = `video/siem/` ·
`v6/` = `video/iam-halden/` · `v10/` = `D:/LLM projects/TICourse/.claude/worktrees/video-logs-halden/video/logs-halden/`
(rama de V10, congelada el 4-10) · `plan` = `docs/superpowers/plans/2026-09-25-lesson-videos.md` · `registro` =
`docs/superpowers/canon/glass-harbor.md` · `fichas/` y `revisiones/` = las carpetas del scratchpad. Las líneas de las
fichas son las de los archivos de hoy.

**Recuento con Node** (`scratchpad/rev-v11v12-count.mjs`): todo cuadra con lo que dicen las fichas. V11: tarjetas 55, 55,
51, 49, 55, 46 y 53; preguntas 44 y 43; mensajes 52, 68 y 63; suma 474 s. V12: tarjetas 52, 49, 47 y 54; pregunta 45;
mensajes 66 y 62; suma 210 s. Presupuestos de palabras iguales a los de las fichas y ningún símbolo prohibido. Fechas: 3-11
martes, 9-11 lunes, 10-11 martes, 11-11 miércoles, 12-11 jueves, 19-11 jueves, 27-05-2027 jueves y 11-11-2025 martes.
Validez: el certificado de V11 dura 366 días (emitido antes del 15-3-2026, tope de 398) y el de V12, 200 justos (V12,
punto 6).

Gravedad: **bloquea** (hay que resolverlo antes de aprobar) · **conviene** (error de exactitud o de canon con arreglo
barato) · **menor** (pulido).

**No hay ningún bloqueante.** Nada contradice algo publicado, ninguna fecha choca, ningún laboratorio ni dosier queda
destripado y los límites se cumplen. **V11 necesita cambios**, todos de texto y ninguno de estructura: lo que las pinturas
y la huella dejan sin decir, sus dos preguntas para pensar y la presentación de NULL CIPHER. **V12 está lista con cambios
menores.**

---

## V11 · sp1m6 · «Criptografía: quién usa qué clave y por qué TLS es híbrido»

Lo esencial es exacto contra la lección: quién cifra y quién firma con qué clave (`sp/sp1-part4.ts:44`, check `:70-79`),
qué es y qué no es un hash (`:115`), sal y estiramiento (`:120-121`, check `:128-132`, q6 `:238`), la firma (`:122`, q3
`:193`) y Diffie-Hellman con el híbrido (`:63-65`, `:84`, q2 `:178`). Las cuatro piezas de la línea de `curl` están bien
leídas: `X25519` es ECDH (acuerda la clave), `AES_256_GCM` cifra el tráfico, `SHA384` sirve para comprobar el saludo y
derivar claves, no para proteger cada paquete (la ficha lo sabe, decisiones `:58-61`), y `id-ecPublicKey` es el tipo de
clave con que el servidor firma el saludo, que es justo el «sello». Lo que falla está en lo que dos imágenes dejan sin
decir y en las dos preguntas para pensar.

1. **Conviene** · s08 (ficha `:78`), concepto 5 (`:61`). Las pinturas están bien elegidas y no dan a entender que
   Diffie-Hellman cifre nada: el color final se convierte en la llave de AES (s08 y s09). Pero callan su límite: **la
   pintura no dice con quién has mezclado**. La sombra de la carretera solo mira. Si en vez de mirar se pone en medio y
   mezcla con cada lado por separado, cada uno acaba con un color común… con ella. DH a solas protege de quien escucha,
   no de quien suplanta. Para eso el servidor sella el saludo (`id-ecPublicKey`, s09), y para eso hace falta el
   certificado (la pregunta final, `:146`). Además, el concepto 5 dice «dos partes que no se conocen», que es justo el
   caso sin autenticar. q2 habla de no tener un secreto previo y de no transmitirlo (`:169`, `:178`), no de desconocidos.
   Arreglo:
   - s08, después de «una mezcla no se separa», una frase de voz: «Eso sí: la pintura no te dice con quién has mezclado.
     Eso lo pone el sello, y lo vas a ver en la línea». En pantalla, bajo la sombra: «la pintura no dice con quién has
     mezclado» (41).
   - s09, al encender `id-ecPublicKey`: «y el servidor sella el saludo, para que sepas con quién has mezclado». El remate
     («¿cómo sabe la naviera que esa clave pública es del puerto?») queda igual y gana sentido.
   - Concepto 5: «deja a dos partes **sin ningún secreto previo** con un secreto común…». La tarjeta se queda.
   - Riesgos de las decisiones: «DH no autentica: sin el sello del servidor, alguien en medio mezcla con cada lado».

   Así V11 rima con V12 s03, «cifrado, sí · ¿con quién?» (`fichas/V12-sp1m7-ficha.md:59`), y el puente sale solo.

2. **Conviene** · s05, pregunta «Dos cuentas, mismo hash: ¿salt o stretching?» (ficha `:75`, `:95`). Las marcas van
   `twins, choice, salt, catalog, stretch…`: la pregunta pide elegir entre dos nombres que el vídeo todavía no ha explicado,
   y la regla 3 dice que «ningún término se usa en la historia antes de explicarlo» (`plan:60`). Quien llega de la lección
   ya los conoce y acaba de contestar ese mismo check (`:128`), así que tampoco es una decisión: es recordar.
   Arreglo: contar antes las dos ideas en llano y sin nombre («Para guardar contraseñas hay dos trucos: añadir a cada una
   un dato al azar antes de sacar la huella, o sacarla miles de veces seguidas para que cada intento cueste»). Después, la
   tabla «así no» y la pregunta **«Dos cuentas, misma huella: ¿qué truco faltó?»** (44), con los botones «un dato al azar»
   y «miles de veces». La respuesta nombra SALT y, a continuación, KEY STRETCHING. La explicación de la respuesta (ficha
   `:95-97`) se queda.

3. **Conviene** · s08, pregunta «La clave de sesión, ¿viaja por la red o no?» (ficha `:78`, `:98`). La escena la contesta
   antes de hacerla: la marca `no-send` («no se envía; se fabrica a los dos lados») va al principio y la pregunta llega
   tras «una mezcla no se separa». Además nombra la clave de sesión, que la escena solo presenta al final (`session-key`).
   Arreglo: s08 abre con la carretera y la pregunta de s02 («¿cómo le llega la copia?»), pasa a las pinturas sin decir
   «no se envía» y pregunta sobre la imagen: **«Ese color final, ¿viaja por la carretera o no?»** (46). Respuesta: no;
   cada lado lo calcula y la sombra solo tiene mezclas. Después, DIFFIE-HELLMAN, el límite del punto 1 y la llave para dos
   con SESSION KEY. Mismo `holdMs`.

4. **Conviene** · s06 (ficha `:76`). «En el portal, la oferta con su hash al lado; alguien cambia la oferta y cambia
   también el hash». Tal como está dibujado, alguien con permiso de escritura en el portal de reservas cambia un documento
   del puerto. Es el mismo equipo al que V10 le sacó `/etc/passwd` por el visor de documentos el 21-10
   (`v10/src/data/s04-traversal.ts:26-41`; canon de V10, `plan:1474-1477`): quien haya visto V10 entenderá que el portal
   sigue comprometido. Y el canon nuevo de V11 dice que la oferta va firmada (ficha `:159`), así que la escena enseña algo
   que el puerto no hace.
   Arreglo:
   - Primero el mensaje y luego el ejemplo, rotulado **«ejemplo · así no · lo que propone NULL CIPHER»** (45), como se
     arregló el reloj de V6 (`docs/reviews/2026-10-01-fichas-tanda2/revision-secplus.md:49-53`).
   - En condicional y sin portal de fondo: «si alguien pudiera cambiar la oferta, cambiaría también la huella de al lado».
     Mejor aún, con la imagen que ya existe: por la ranura del buzón echa cartas cualquiera, también una oferta falsa con
     su huella bien calculada. Cifrar para la naviera no dice quién escribió. Así s06 une los conceptos 2 y 4 sin tocar el
     portal.
   - Una precaución para el guion: la regla de la pizarra («la huella dice que no cambió · no dice quién la hizo») es la de
     q3 (`:193`) y la del laboratorio: el instalador «not altered in transit» se resuelve con Hashing
     (`sp/labs.ts:148-150`) y el correo de la directora financiera con Digital signature (`:153-155`). La voz nunca dice
     «un hash no sirve» ni «no garantiza nada»: sirve para la integridad; lo que no da es el autor.

5. **Conviene** · Presentación de NULL CIPHER: el rótulo «NULL CIPHER · acceso inicial · prueba cada puerta» (ficha
   `:72`), la voz «Lo suyo es el acceso inicial: prueba cada puerta del puerto» (`:162`) y «cada consejo deja una abierta»
   (decisiones `:29-30`). V10, que se graba en la misma sesión, usa esa imagen para el spraying de RED MARROW: «Son una
   llave en muchas puertas» (`v10/narration.json:38`), «una llave corriente prueba cada puerta una vez» (`:68`) y «Una
   llave en muchas puertas» (`:260`). Oídos seguidos, NULL CIPHER suena a quien hizo el spraying del 21-10, y unir a dos
   adversarios roza «GH es una sola operación» (`sp/sections.ts:106`, registro `:210-211`). Encima, en V11 la llave es la
   clave simétrica.
   Arreglo: presentarlo con otra parte de su anuncio (`sp/sections.ts:47`). Rótulo **«NULL CIPHER · célula de acceso
   inicial»** (38); voz: «Es NULL CIPHER, una célula de acceso inicial. Busca el primer hueco que no cierre». Ni «puerta»
   ni «llave» para NULL CIPHER en todo el vídeo, tampoco en «deja una puerta abierta». «Una célula» es texto del curso y,
   de paso, resuelve la concordancia de «neutralizada» (`:49`) sin fijar el género de nadie («Entre fichas», 3).

6. **Conviene** · Mensaje de s02, «Cifrarlo todo con RSA. Más bits, más seguro. Lógico.» (ficha `:102-106`). La mitad
   cierta que elige enfrenta los bits de RSA con los de AES, y la corrección la deja en pie a propósito (decisiones
   `:62-63`). Quien lo vea puede salir pensando que RSA-4096 protege más que AES-256 porque tiene más bits, que es otro
   error: los bits de dos familias no se comparan. Arreglo, uno de dos:
   - Cambiar la mitad cierta por la del problema que s02 acaba de plantear, el reparto de la copia: **«Cifrar los gigas
     con RSA. Sin secreto que repartir. Lógico.»** (59). Es verdad que con la pública no hay secreto que repartir, y la
     conclusión es falsa: RSA es muchísimo más lenta (q1, `:163`). Además adelanta el capítulo V: con la asimétrica se
     reparte la clave, no los gigas. Es la que recomiendo.
   - O mantener el mensaje y que la narradora conteste primero con la lección: «Más bits, sí, y más coste» (`:84`), y luego
     la velocidad.

   En los dos casos, «gigas», nunca «la copia de 2 TB» (`sp/labs.ts:143`).

7. **Menor** · La imagen del hash (concepto 3, s04). Una huella dactilar dice *quién* estuvo, y s06 enseña lo contrario:
   que la huella no dice quién hizo el documento. Desde s04, la voz dice «la huella de la oferta» (del documento, no de
   quien lo escribió), como V4 usó la huella de un certificado, «un código que lo identifica»
   (`video/pivot-infra/narration.json:196`). La tarjeta de s04 se queda: «una sola dirección» es la propiedad de examen.

8. **Menor** · s07 (ficha `:77`), «las dos huellas coinciden». Es el modelo de la lección (descifrar la firma con la
   pública y comparar, `:50-56`, `:122`), que solo vale para RSA; la línea de s09 es de curva elíptica, donde la
   comprobación da sí o no. En pantalla, «el sello encaja con la huella que acaba de sacar» sirve para los dos. En la voz,
   como dice la ficha, «sella», nunca «cifra la huella».

9. **Menor** · Densidad del concepto 3 (s04 y s05, 98 s): hash, una dirección, no es cifrado, integridad, colisiones, MD5
   y SHA-1, contraseñas, sal, rainbow tables, estiramiento, tres algoritmos y SHA-512. Es el que más carga. Las colisiones
   y MD5/SHA-1, en media frase y el resto en pantalla («SHA-512 a secas» ya va solo en pantalla). Si el primer borrador
   pasa de 570 s, se recorta aquí antes que los relojes de s05.

10. **Menor** · Línea de entrada de la inserción (ficha `:36-37`): «…por qué una conexión mezcla dos cifrados». En TLS 1.3
    la parte asimétrica no cifra: acuerda la clave (ECDH) y firma el saludo. Arreglo: «…y por qué una conexión usa las dos
    familias».

11. **Menor** · Laboratorios (ficha `:133-141`, decisiones `:68-69`). «Coincide en tres» se queda corto: el vídeo enseña
    las reglas que contestan casi todo spl1c, porque spl1c practica la tabla de la lección (`:29-39`). No es destripar,
    porque la tabla va antes, pero el guion tiene que saber qué escenarios literales no puede usar: la copia de 2 TB
    (`sp/labs.ts:143`), el instalador (`:148`), el correo de la directora financiera (`:153`), «a server you have never
    contacted» (`:158`, otro motivo para el «sin ningún secreto previo» del punto 1), los portátiles (`:168`), el firmware
    (`:173`), el log encadenado (`:183`), el contrato (`:188`) y el túnel (`:198`). Arreglo: «enseña las reglas de la
    lección, que contestan el laboratorio, sin usar ninguno de sus escenarios», con esta lista.

12. **Menor** · Orden del curso. V11 es el primer vídeo de Halden que ve quien sigue el curso (sp1), aunque pasa en
    noviembre. Nada de «otra vez», ni del caso de septiembre, ni de V10; y el sello se presenta desde cero, sin recordar
    a DKIM (la ficha ya lo dice para la voz, `:190`). Añadirlo a Riesgos.

**Preguntas del encargo sin hallazgo.** Cinco conceptos en unos 8:30, con una imagen cada uno: sí. Forman un sistema que
vuelve en s09 y en el cierre: la llave con copias (simétrica), el buzón (cifrar para alguien), la huella (hash), el sello
(firma) y las pinturas (DH). El concepto 1 usa dos imágenes porque compara dos familias, y las dos regresan (el buzón en
s03 y s07; la llave y la carretera en s08). La clave privada de cada parte tiene su objeto (la llave del buzón de la
naviera, el anillo del puerto), así que no se cruzan. El híbrido cierra el círculo: s02 dice que la asimétrica no cifra
gigas, s03 cierra la oferta con la pública de la naviera y s09 lo precisa (la oferta con una clave simétrica y esa clave
por el buzón), como la ficha avisa en sus riesgos (decisiones `:51-54`). El papel del certificado se deja para V12, y lo
que se ve en s01 (emisor, caducidad, `SSL certificate verify ok`) es coherente con V12. La promesa llega hacia los 7 s,
ningún identificador va en voz y los tres mensajes traen un error real de la lección. La música es la única pista con
licencia (`video/engine/music/LICENSES.md`). La inserción, al final de sp1m6, no enseña nada antes que la lección, y el
bloque `youtube` sigue el patrón de V6 (`sp/sp4-part4.ts:468-474`), que es lo que pide la suite `lesson videos`
(`src/data/content.test.ts:264-285`: id válido, póster y transcripción de más de 200 caracteres en `public/videos/`, ningún
archivo compartido y una línea `moduleOf` por vídeo). El canon nuevo (ficha `:143-172`) no choca con el registro.

---

## V12 · sp1m7 · «PKI en la consola: el eslabón que falta, CRL y OCSP»

Exacta contra la lección: la cadena (`:297-331`), la nota de examen (`:336`), el check del emisor desconocido
(`:341-350`), la revocación (`:365`), el check de stapling (`:370-379`), q3 y q4. Las salidas de OpenSSL 3 son verosímiles
(las líneas `a:` y `v:`, los errores 20 y 21, `Verify return code: 21`, `OCSP response: no response sent` y
`Cert Status: good`), y `sigalg: ecdsa-with-SHA384` encaja con la intermedia P-384 de la lección (`:314`). La corrección
del primer mensaje (cifrado, sí, pero sin saber con quién) es exacta y no promete más que `:291`.

1. **Conviene** · Tarjeta de s03, «Root CA: self-signed y de serie en el trust store» (ficha `:68`). «De serie» solo vale
   para las raíces públicas. La lección dice que la confianza en una raíz se establece «distribuyéndolos al trust store»
   (`:357`), y q3, «distributed in trust stores» (`:486`). Si V17 necesita una raíz interna del puerto repartida a sus
   equipos (EAP-TLS, la VPN), esta tarjeta la contradiría. Arreglo: **«Root CA: self-signed y ya en el trust store del
   cliente»** (55). Lo mismo en la imagen del concepto 1 (ficha `:50`): «la raíz que vale es la que tu equipo ya tenía, no
   la que te mandan».

2. **Conviene** · La revocación en condicional (s04, su mensaje y el canon de `:120`). Es el portal del traversal del
   21-10 (V10): si la voz pone un ejemplo de cómo se filtra una clave («si alguien lee el fichero», «si entran en el
   servidor»), quien vio V10 lo junta con aquella noche y entiende que la clave del portal pudo salir. Arreglo: los dos
   motivos de la lección y nada más, «se filtra la clave privada · el dominio cambia de dueño» (`:365`), sin decir cómo.
   Añadirlo a «No se toca».

3. **Menor** · Rótulo de s03, «la raíz no viaja: ya la tienes» (ficha `:59`). Contradice el riesgo de la propia ficha:
   un servidor puede mandarla y no pasa nada (decisiones `:48-49`). Arreglo: **«la raíz no hace falta mandarla: ya la
   tienes»** (44).

4. **Menor** · Regla 1 del cierre, «"Emisor desconocido": falta la intermedia» (ficha `:84`). Se deja el otro caso de la
   nota de examen (`:336`), el autofirmado, que sí sale en la tarjeta de s02. Arreglo: «"Emisor desconocido": falta la
   intermedia, o el certificado es autofirmado. El servidor manda la intermedia; la raíz ya la tienes».

5. **Menor** · Pregunta para pensar (s02, ficha `:58`, `:71-73`). Antes de la pregunta, la cadena del ancla ya rotula la
   raíz «ya está en tu equipo» y enseña el hueco en el medio: el dibujo la contesta. Arreglo: el ancla y el hueco sin
   rótulos hasta la respuesta; «ya está en tu equipo» llega con ella.

6. **Menor** · Canon, «menos de 200 días» (ficha `:107-108`, decisiones `:38-39`). Del 9-11-2026 a las 00:00:00 al
   27-05-2027 a las 23:59:59 van 200 días justos, contando como los Baseline Requirements (de `notBefore` a `notAfter`,
   ambos incluidos). Está permitido, pero la frase es falsa. Arreglo: «200 días, el máximo…», o `NotAfter: May 26 23:59:59
   2027 GMT` (199). Si cambia, cambia la línea `v:` de s02; «faltan más de seis meses» sigue valiendo.

7. **Menor** · «Sistemas» instala el certificado, la intermedia y el stapling (ficha `:59`, `:61`, `:105-118`). En las
   lecciones, los certificados del puerto son de Infraestructura: L. Ferrer es el dueño de CHG-2041 (`sp/sp1-part3.ts:71`),
   y V16 le da también el plan de zonas. Arreglo: «Infraestructura», o la tira sin área («09:10 · instalada la
   intermedia»). Y que la tira no recuerde el paso de verificación de CHG-2041 (`openssl s_client` contra cada endpoint,
   `:81`): el despiste no se cuenta como un cambio mal hecho.

8. **Menor** · El mensaje de la naviera dice «desde esta mañana» (ficha `:57`), pero el certificado se instaló el lunes
   por la tarde (`:105`). Si su programa conecta a cualquier hora, fallaría desde el lunes. Arreglo: «la sincronización de
   las 07:00 no conecta», o «desde ayer por la tarde».

9. **Menor** · La corrección del mensaje de s04 (ficha `:79-82`). «Se revoca ya» es exacto (`:379`), pero es solo la mitad:
   con la clave filtrada hay que pedir otro certificado con una clave nueva. Basta media frase: «se revoca ya, y se pide
   otro con una clave nueva».

10. **Menor** · Tarjeta final, «Tu turno: las preguntas de la lección» (ficha `:62`, `:88`). El vídeo va a mitad de la
    lección, antes de `:382-441`, y seis de las ocho preguntas tratan de lo que viene después (CSR, wildcard, key escrow,
    TPM, KMS). Arreglo: **«Tu turno: termina la lección y sus preguntas»** (44).

11. **Menor** · «No se toca», el portal en la red: «el borrador de V16 lo mueve a la DMZ a partir del 16-11» (ficha
    `:141`). El 16-11 solo empieza el dibujo; se aprueba el 20-11 y se ejecuta por fases desde el 1-12. Coincide con
    `revisiones/revision-V16-V17.md:252-254`. Arreglo: «el plan de V16, aprobado el 20-11, lo llevará a la DMZ por fases
    desde el 1-12».

**Preguntas del encargo sin hallazgo.** Los dos conceptos son exactos. El ancla dice lo que debe: la raíz vale porque ya
está a bordo, no porque te la manden. El hotel cubre los tres costes de OCSP de `:365` y la grapa del stapling (el
justificante lo sella la policía, no el huésped). Los navegadores quedan bien esquivados (decisiones `:44-47`), y OCSP
sigue a la lección y no a su estado real de hoy (decisiones `:50-52`). Ningún laboratorio de sp1 toca la PKI
(`sp/labs.ts:17-54`), y el vídeo no enumera los pasos de un cambio (spl1b). La inserción llega después de todo lo que
enseña (`:297-381`), y su bloque `youtube` cumple la suite `lesson videos` igual que el de V11. Límites y duración,
correctos: con 210 s, el estimado ronda el techo del validador, como dice la
ficha (`:20-27`).

---

## Entre fichas

1. **Fechas: sin hallazgo.** Todos los días de la semana son correctos (arriba). V11 cae el 3-11 y V12 del 9 al 12-11;
   el 19-11 y el 27-05-2027 son fechas de validez, no hechos. No hay colisión con V6 (19–28-10), V10 (20–21-10), el plazo
   de V5 (31-10), la MFA del proveedor de identidad (lunes 30-11), V16 (16-11 y 20-11) ni V17 (23, 25 y 27-11, y 1-12). El
   orden se sostiene: V11 < V12 < V16, y nada de V11–V12 pasa después del 13-11.

2. **El portal: `reservas.haldenport.example` = `hpa-portal-web-01`.**
   - **Con V10, compatible.** «Nada delante» (`sp/sp4-part3.ts:57`, `plan:1477`) cuadra con que el propio servidor
     termine TLS y mande la cadena (canon de V11, ficha `:150-151`) y con que V12 instale ahí la intermedia y el stapling.
     La revisión de V16–V17 precisa «nada delante» como «nada que mire dentro de la petición web; delante, solo la regla
     443 del perímetro» (`revisiones/revision-V16-V17.md:255-259`), y V11 lo respeta (s01 entra «desde fuera» por el 443).
     El «autenticación no requerida» del FINDING #0147 (`sp/sp4-part3.ts:57`) es la del fallo (CVSS `PR:N`, `:60`), no un
     portal sin acceso: la zona privada de cada naviera (ficha V11 `:156-158`) no choca.
   - **Con V16, compatible.** Moverlo a la DMZ desde el 1-12 no cambia ni su nombre ni su certificado, y V11–V12 no dicen
     dónde vive. Una condición para V16: desde el 12-11 el portal grapa OCSP, así que sale a Internet hasta
     `ocsp.confianza.example`. Las reglas de la DMZ de V16 s04 (`fichas/V16-sp3m4-ficha.md:72`) no lo prohíben; no deben
     añadir «de la DMZ a Internet: nada», ni un proxy que termine TLS delante sin decir dónde queda el certificado.
   - **Con el dominio público y las trampas, compatible.** Sigue a V1 (`v1/src/scenes/S02Spoof.tsx:94`, `:141`) y a V6
     (registro `:228-229`), bajo el dominio de verdad, y no se parece a ninguna trampa (`haldenp0rt.example`,
     `v1/src/scenes/S11Limits.tsx:149`; las de sp2, registro `:155`). `portal.puerto-halden.example`
     (`siem/src/data/s08-triage.ts:15`) sigue en la contradicción §5.2. Si alguien lo junta con este portal, cuadra: del
     4-9 al 11-11 van 68 días, dentro de un aviso de 90. El registro anota en §5.2 que V11–V12 siguen a V1.
   - **Lo que nadie debe decir.** V10 sacó `/etc/passwd` de este equipo. El almacén de contraseñas de las navieras (canon
     de V11, ficha `:156-158`), la clave privada del certificado y las ofertas son justo lo que se preguntará quien vio
     V10. Ninguno de los dos vídeos dice qué pudo o no pudo leer el traversal: por eso s06 de V11 y la revocación de V12 se
     quedan en condicional (V11, punto 4; V12, punto 2). Va en «No se toca» de las dos fichas y en el registro.

3. **La voz: Helena para NULL CIPHER (V11–V12) y para BLIND ARCHITECT (V16–V17).** Para NULL CIPHER, bien: es la única
   voz libre, y V11 se graba con V10, así que los dos adversarios que se estrenan esa sesión suenan distintos (Helena
   frente a Laura con `telefono`, `v10/narration.json:11-15`). Compartirla con BLIND ARCHITECT es inevitable (tres voces
   para cinco adversarios) y aceptable, pero solo si no se confunden. Dos adversarios que suenan igual sugieren que GH es
   una sola operación (`sp/sections.ts:106`), el mismo argumento que usa V11 contra `machine` (decisiones `:36-38`).
   Coincido con la revisión de V16–V17 (`revisiones/revision-V16-V17.md:222-247`) y añado lo que toca a V11–V12:
   - **Efectos en ejes distintos.** `cifrado`, digital y seco: bajar a ~11 kHz sin filtro, ~6 bits y una puerta, sin sala
     ni banda (decisiones de V11 `:38-42`). `megafonia`, acústico y húmedo: banda de bocina de 250 a 5000 Hz y
     reverberación de hormigón (decisiones de V16 `:84-87`). La prueba de cada efecto debe fijarlo: nada de reverberación
     en `cifrado` ni de crujido digital en `megafonia`.
   - **Ritmo distinto,** sin trabajo de motor (`"rate"` en `adversaryVoice`): la otra revisión propone −2 para BLIND
     ARCHITECT y 0 para NULL CIPHER. Vale.
   - **Una sola voz por adversario, para siempre.** El efecto con que se publique V11 es el de NULL CIPHER: V12 no lo
     cambia. Las dos fichas tienen la misma reserva, Helena con `machine` (ficha V11 `:17`; ficha V16 `:15-16`), y si las
     dos la usan suenan idénticas. Recomiendo programar `cifrado` antes del render de V11 (una docena de líneas y su
     prueba, decisiones `:41-42`). Si no llega, V11 y V12 salen con `machine`, y BLIND ARCHITECT ya no puede usarla.
   - **Género, una sola pregunta para Lidia.** Las dos fichas recomiendan cosas distintas: V11, «la voz no cuenta como
     canon» (decisiones `:84-85`); V16, apuntarlo como «ella» (decisiones de V16 `:84-89`). El curso deja una salida para
     cada uno. «NULL CIPHER neutralizada» concuerda con «una célula» (`sp/sections.ts:47-49`): NULL CIPHER es una célula,
     y eso no fija el género de nadie. «BLIND ARCHITECT derrotada» (`:87`) no tiene un nombre detrás: es «ella», como
     SILENT PAGER (`:104-106`). Propuesta: NULL CIPHER, «una célula» (la narradora puede decirlo, V11 punto 5); BLIND
     ARCHITECT, «ella» en el registro; y en los dos vídeos, ningún texto marca el género. Lidia contesta una vez para los
     dos.

4. **La CA de `*.halden-port.local` y V17.** V11–V12 fijan solo la cadena pública:
   - Los nombres públicos bajo `haldenport.example` cuelgan de la CA pública ficticia de la lección: `Confianza Global
     Root`, luego `Confianza Global TLS Issuing CA 3` (`:301-327`), hojas ECC P-256 y las URL de CRL y OCSP de la lección.
   - El certificado público del portal: el viejo, del 11-11-2025 al 11-11-2026; el nuevo, del 9-11-2026 al 27-05-2027 (o
     26-05, V12 punto 6), con el tope de 200 días de los certificados públicos. El 3-11 mandaba la cadena completa; desde
     el lunes 9-11 por la tarde hasta el martes 10-11 a las 09:10, solo la hoja; desde el 12-11 grapa OCSP.
   - **De la CA interna no fijan nada, y V17 tiene que respetar esto:**
     - `*.halden-port.local` (CHG-2041, `sp/sp1-part3.ts:70-83`), que cubre la «VPN SSL» que V17 toma como su VPN sobre
       TLS (ficha de V17 `:48`, `:134`), no puede venir de Confianza Global ni de ninguna CA pública, porque no firman
       nombres internos. Es de una CA privada del puerto, sin definir.
     - Su raíz llega a los equipos del puerto porque el puerto la reparte (`:357`), nunca «temporalmente» ni aceptando un
       autofirmado a mano (el dosier, `sp/sections.ts:49`).
     - Sus certificados no tienen el tope de 200 días (CHG-2041 rota cada año, `cert-2025-09` y `cert-2026-09`, `:79`,
       `:83`): no contradice nada de V12, siempre que la tarjeta de V12 diga «ya en el trust store del cliente» y no «de
       serie» (V12 punto 1).
     - V17 deja la VPN sin nombre y sin certificado en pantalla (ficha de V17 `:146`, `:152-153`). Si algún día sale uno:
       de la CA interna, con nombre `.local`, y nunca `vpn.puerto-halden.example` (`siem/src/data/s08-triage.ts:13`), que
       es otro dominio de la contradicción §5.2. EAP-TLS sigue como concepto.
   - Al registro: «CA interna del puerto: sin definir; no es Confianza Global; su raíz la reparte el puerto».

5. **`203.0.113.0/24` no es «de SILENT PAGER».** La ficha de V11 tiene razón. V1 publica el SPF del propio puerto,
   `haldenport.example. TXT "v=spf1 ip4:203.0.113.10 -all"` (`v1/src/scenes/S03Dmarc.tsx:78`), y el registro ya lo anota
   como «SPF del puerto» (`:149`). En ese /24, la `.10` es del puerto, la `.47` es el destino de los 38 GB y la `.77`, el
   C2 del portátil (registro `:156-157`). La frase viene de la revisión de la tanda 2 (`revision-secplus.md:104`), de la
   ficha de V10 (`plan:1505`) y del encargo (`brief-fichas-tanda3.md:109`). Lo que debe decir el registro, en §3 tras la
   tabla de IP:
   > `203.0.113.0/24` está mezclado: `.10` es del puerto (su SPF, V1) y `.47` y `.77`, de la atacante (SIEM, V1, V5). No se
   > usa para nada nuevo de Halden, ni del puerto ni de un adversario: una IP de la atacante junto al correo del puerto ya
   > es casualidad suficiente, y otra de cualquier adversario rozaría la pista del ASN (`sp/sections.ts:106`). NULL CIPHER
   > no recibe nunca IP, dominio ni equipo en pantalla.

   (`.24`, `.27` y `.90` son de GCTI, la otra campaña.) V11 y V12 no enseñan ninguna IP: no cambian.

6. **«Inventario»: sin contradicción.** El dosier dice «el puerto sigue sin inventario» (`sp/sections.ts:49`) y CHG-2041,
   «Actualizar inventario de certificados» (`sp/sp1-part3.ts:82`). Lo más probable es que la nota del dosier remita a la
   misión de spl1a, «No hay inventario de controles» (`sp/labs.ts:30`), no a los certificados; y el 1-9 el puerto ya
   escanea 412 activos (`sp/sp4-part3.ts:53`). Ninguna ficha usa la palabra (V11 `:178-179`; V12 `:136-137`), ninguna
   dice si el puerto tiene o no un registro de certificados, y la historia de V12 encaja con las dos lecturas: la
   renovación llega antes de caducar, y lo que falta es el fichero de la cadena, no el certificado. Que siga así: nada de
   «nadie sabía que caducaba» en la voz de V12.

**Para el registro, al cerrar V11 y V12** (además del canon nuevo de cada ficha, con los arreglos de arriba):
- `reservas.haldenport.example` = `hpa-portal-web-01`; cadena pública de Confianza Global; las fechas de los dos
  certificados y del stapling; §5.2: V11–V12 siguen a V1.
- La nota del /24 (punto 5) y la de la CA interna (punto 4).
- Ningún vídeo dice qué pudo leer el traversal del 21-10 en el portal (punto 2).
- NULL CIPHER: «una célula», manual de procedimiento en infinitivo con «Lógico.», voz Helena con el efecto con que salga
  V11 y su `rate`; sin IP, dominio ni equipo.

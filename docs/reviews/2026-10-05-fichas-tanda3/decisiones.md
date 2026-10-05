# Fichas de la tanda 3: decisiones para aprobar en una ronda

Fecha: 5 de octubre de 2026. Las fichas completas están en el plan de vídeos
(`docs/superpowers/plans/2026-09-25-lesson-videos.md`, §5, de V11 a V17). Aquí van las decisiones que cada ficha ya toma,
con la alternativa descartada, y los riesgos que debe mirar quien escriba el guion. Todas pasaron una revisión de
exactitud y canon (`revision-V11-V12.md`, `revision-V16-V17.md` y `revision-gcti.md`, en esta carpeta) y la comprobación
de límites del validador (tarjetas, preguntas, mensajes, escenas y duración), contada con un script. Las revisiones solo
encontraron un fallo que bloqueaba (una tarjeta de V16 que, tal como estaba escrita, abría la puerta fail-secure), y ya
está arreglado en la ficha.

Basta con decir qué cambia; lo que no se diga, queda como está.

## Lo que necesito que me contestes

1. **Voz y género de los dos adversarios nuevos de Security+.** NULL CIPHER (sp1, V11–V12) y BLIND ARCHITECT (sp3,
   V16–V17) llevarían la voz de Helena, la única voz instalada que no usa ningún adversario: NULL CIPHER a ritmo normal y
   con un efecto nuevo, `cifrado` (de reserva, `machine`), y BLIND ARCHITECT más pausada y con otro efecto nuevo,
   `megafonia` (un aviso por los altavoces de una nave vacía). Con esa voz las dos se oyen como mujeres, y el curso ya las
   escribe en femenino («NULL CIPHER neutralizada», `src/data/secplus/sections.ts:49`; «BLIND ARCHITECT derrotada», `:87`).
   El texto de los vídeos sigue sin marcarlo. **Por defecto: sí, y el registro lo apunta como canon.** Si prefieres que no
   cuente, como con RED MARROW, no cambia nada del guion.
2. **V14: ¿cambiamos la Víctima 1 del walkthrough de s2m4?** Choca con s2m1, con V7 y con el E9 de V3 (detalle y texto
   exacto en las decisiones de V14). **Recomendado: sí**, en la rama de V14. Si no, el vídeo va por el plan B, con la ficha
   de E9 copiada palabra por palabra de V3.
3. **V15: ¿corregimos el import del informe de sandbox?** `MapViewOfSection` (`src/data/s3.ts:333`) no lo exporta
   Windows; el real es `NtMapViewOfSection`. **Recomendado: sí**, en la rama de V15. La regla YARA de S5 sigue funcionando.
4. **V15: ¿añadimos la evasión del sandbox a s3m2?** **Recomendado: no por ahora**; V15 no la necesita.
5. **V16, opcional: la OT de sp3m2.** «Los PLC de las esclusas están air-gapped» (`src/data/secplus/sp3-part1.ts:394`)
   choca con sp3m4, con su pregunta q6 y con el dosier de BLIND ARCHITECT, que las ponen en red. Propuesta: que diga «los
   sistemas de control de las grúas», como su propio check (`:288`). V16 no depende de ello.

## Orden de producción y grabación

| Nº | Lección | Formato | Carpeta | Se graba con | Estado |
|---|---|---|---|---|---|
| V10 | sp2m7 | Cápsula | `logs-halden` | V11 | guion congelado el 4-10; escenas y póster montados el 5-10 sobre la línea de tiempo estimada |
| V11 | sp1m6 | Principal | `cripto-halden` | V10 | guion revisado y congelado el 5-10 (aprobado por Lidia) |
| V12 | sp1m7 | Cápsula | `pki-halden` | V13 | ficha |
| V13 | s2m1 | Principal | `kill-chain-eslabon` | V12 | ficha |
| V14 | s2m4 | Principal | `hilos-pelicula` | V15 | ficha |
| V15 | s3m2 | Cápsula | `sandbox-muestra` | V14 | ficha |
| V16 | sp3m4 | Principal | `zonas-halden` | sola | ficha |
| V17 | sp3m5 | Principal | `fronteras-halden` | sola | ficha |

- Un principal y una cápsula por sesión, como en la tanda 2. V11 va con V10 porque es el principal más listo y abre la
  serie «Confianza» (V11 cuenta las claves; V12, la cadena de certificados en la consola).
- GCTI va en el orden del curso (s2m1, s2m4, s3m2), así cada vídeo puede remitir al anterior.
- V16 y V17 van al final: necesitan el efecto `megafonia`, y V17 hereda el rediseño de red que V16 aprueba el 20-11.

## Lo que se decidió entre fichas

- **Fechas de Halden sin choques.** V11–V12 del 3 al 12-11 (el portal de reservas y su certificado); V16 del 16 al 20-11
  (rediseño de zonas, aprobado el 20-11, por fases desde el 1-12); V17 del 23 al 27-11 (prueba de la toma de red con
  `ptl-pruebas-02`, túnel completo aprobado el 27-11). Nada pisa V6 (19–28-10), V10 (20–21-10), el plazo de V5 (31-10) ni
  la MFA del proveedor de identidad (30-11); ninguna mejora de V16–V17 empieza antes del 1-12, así que el segundo factor
  del servidor de salto no se adelanta al del proveedor.
- **El portal de reservas.** `reservas.haldenport.example` es `hpa-portal-web-01`: V10 lo deja sin nada delante el 21-10,
  V11–V12 le cambian el certificado en noviembre y V16 lo pasa a la DMZ. V16 no debe cortar su salida hacia OCSP.
- **Los certificados son de Infraestructura** (L. Ferrer, dueño de CHG-2041, `src/data/secplus/sp1-part3.ts:71`), no de
  Sistemas. V11–V12 solo fijan la cadena pública; la CA interna sigue sin definir y V17 no enseña ningún certificado.
- **Una sola imagen para la ruta PDB** en V13, V14 y V15: «la etiqueta del taller», con la misma frase en la voz («no
  siempre la lleva»). V14 y V15 se graban juntos.
- **Ningún título de escena destripa su pregunta.** El título se ve arriba durante toda la escena, y la tarjeta de la
  pregunta no lo tapa (lo encontró la revisión del guion de V11; regla nueva en el plan, §1). Cambian cuatro títulos:
  V14 s09 «Esta noche, en Orbital» pasa a «Orbital, a medio camino»; V15 s04 «Cinco llamadas, dos suyas», a «Cinco
  llamadas»; V16 s05 «Una sola puerta a la sala de mandos», a «Una sola puerta» (la sala de mandos es la zona de
  gestión, la respuesta); y V17 s03 «El vigilante no decide», a «Tres papeles en la puerta».
- **Imágenes que no se repiten en la misma sesión.** NULL CIPHER deja de «probar cada puerta» (es la imagen del spraying
  de V10, que se graba el mismo día): pasa a «célula de acceso inicial».
- **Para el registro de canon** (se apunta al cerrar cada vídeo, paso 8): `203.0.113.0/24` es mixto en Halden (la `.10`
  es el SPF del propio puerto en V1, `video/capas-halden/src/scenes/S03Dmarc.tsx:78`); y en VELVET CICADA las referencias
  a `src/data/s4.ts` del registro van 7 líneas por detrás desde `e4d3a79` (la tabla está en `revision-gcti.md`).

## V11 · sp1m6 · «Criptografía: quién usa qué clave y por qué TLS es híbrido» · decisiones para aprobar en una ronda

La ficha completa está en el plan de vídeos (§5, V11). Aquí van solo las decisiones que ya toma, con la alternativa descartada,
los riesgos para quien escriba el guion y lo que solo puede decidir Lidia. Basta con decir qué cambia; lo que no se diga,
queda como está. Rutas relativas a la raíz del repo; `sp/` = `src/data/secplus/`.

> **Revisada el 2026-10-05** (exactitud y canon, `revision-V11-V12.md`): aplicados los seis «conviene» (el límite de la
> pintura, las dos preguntas para pensar, s06 en condicional y con el buzón, NULL CIPHER sin puertas ni llaves, el mensaje
> de s02 sin bits) y los seis menores. La voz de NULL CIPHER la ha decidido la coordinación (punto 4) y queda una sola
> pregunta para Lidia.

1. **Historia: «una línea, una oferta».** Martes 3-11: una naviera, sin nombre, recoge en el portal de reservas
   (`hpa-portal-web-01`) su oferta comercial para 2027. La línea de `curl` de esa conexión
   (`TLSv1.3 / TLS_AES_256_GCM_SHA384 / X25519 / id-ecPublicKey`) es la promesa del principio y el examen del final: lleva
   las tres familias del vídeo. Entre medias, cuatro preguntas sobre la misma oferta: quién puede leerla, cómo se guarda la
   contraseña de la naviera, si es del puerto y cómo viaja. Descartado:
   - un recorrido por la criptografía del puerto (copias nocturnas, discos de los portátiles, VPN), porque casi cada
     escena sería un ítem del laboratorio spl1c (`sp/labs.ts:143`, `:168`, `:198`) y el vídeo se quedaría sin hilo;
   - un ataque de NULL CIPHER, porque abriría un incidente que el registro no tiene y obligaría a darle IP o dominio, que
     roza la pista del ASN del dosier de sp4 (`sp/sections.ts:106`);
   - usar DKIM y el correo de V1 como ejemplo de firma: enseñaría la firma con el phishing del caso de septiembre
     (IR-2026-0147), que no se toca. De V1 solo se hereda la imagen del sello de lacre, presentada desde cero.
2. **Cinco conceptos:** las dos familias, cifrar con la pública del destinatario, el hash (con las contraseñas), la firma y
   el híbrido con Diffie-Hellman. Son los que más castiga el examen según la lección y su quiz: la regla que «resuelve la
   mitad de las preguntas» (`sp/sp1-part4.ts:44`) y q1, q2, q3 y q6, más dos checks (`:70`, `:128`). Se quedan en la
   lección los niveles de cifrado (`:86-96`, q4), la longitud de clave y ECC frente a RSA (`:84`, q5) y steganography,
   tokenization, masking y blockchain (`:135-143`, q7 y q8). Descartado meter los niveles como sexto concepto: es una lista
   de «dónde cifrar» que la lección ya sirve bien, y el vídeo pasaría de 9 minutos; solo queda una nota en pantalla
   («TLS protege el camino; esto, el documento»). Descartado también dejar fuera las contraseñas: son la mejor manera de
   enseñar que un hash no es cifrado, y salt frente a stretching es una trampa de examen con check y pregunta propios. Las
   pinturas de Diffie-Hellman dicen también su límite (no te dicen con quién has mezclado; eso lo pone el sello del
   servidor), porque Diffie-Hellman a solas protege de quien escucha, no de quien se pone en medio.
3. **NULL CIPHER habla como un manual de procedimiento al revés.** Infinitivos y ninguna persona gramatical («Cifrar con
   la privada…»), una razón técnica que suena impecable, la conclusión equivocada y el cierre «Lógico.». Cada mensaje es un
   distractor de la propia lección: RSA para el volumen (q1, `:163`), cifrar con la privada propia (`:44`, `:79`) y el hash
   adjunto en vez de la firma (q3, `:193`). Se presenta con otra parte del anuncio de su jefe (`sp/sections.ts:47`): «una
   célula de acceso inicial» que «busca el primer hueco que no cierre». Descartado:
   - «prueba cada puerta» y cualquier puerta o llave para NULL CIPHER: es la imagen del spraying de RED MARROW en V10
     («una llave en muchas puertas»), que se graba en la misma sesión, y oídas seguidas unirían a dos adversarios, que roza
     «GH es una sola operación»;
   - copiar a SILENT PAGER (ironía y burla, «Duerme tranquila») o a RED MARROW (consejos de amigo, «Confía en mí»): se
     confundirían, y RED MARROW se estrena en V10;
   - un mensaje que enfrente los bits de RSA con los de AES («Más bits, más seguro»): invitaba a creer que RSA-4096
     protege más que AES-256. El de s02 parte ahora del problema que la escena acaba de plantear: «Cifrar los gigas con
     RSA. Sin secreto que repartir. Lógico.»;
   - un cuarto mensaje con «SHA-512 de una pasada, más largo, más seguro» (q6): el capítulo III ya tiene la pregunta de la
     sal, y la trampa del hash más largo cabe en un tachado de pantalla.
4. **La voz de NULL CIPHER (decidida por la coordinación para los dos adversarios nuevos de Security+):**
   `sapi/Microsoft Helena`, `rate` 0, con un efecto nuevo, `cifrado`. Helena es la única voz es-ES instalada que no tenía
   adversario, y la comparte BLIND ARCHITECT (V16–V17) con `rate` −2 y `megafonia`, una megafonía de puerto con
   reverberación de sala. Para que no se confundan, `cifrado` va por otro eje: **digital y seco**. La voz de Helena, sin
   cambiarle el tono, pasada por una transmisión digital pobre: se baja la frecuencia de muestreo a unos 11 kHz sin filtrar
   antes y la resolución a unos 6 bits, que dan el crujido y el brillo metálico de una señal digital mala, y una puerta de
   ruido corta las colas entre palabras. Sin sala ni reverberación (eso es `megafonia`), sin banda de bocina ni de teléfono
   (`telefono`) y sin el anillo de `machine`; la prueba del efecto lo fija. Es un preset de una docena de líneas en
   `video/engine/scripts/adversary_fx.py`, con su prueba, como `telefono` en la rama de V10, y conviene programarlo antes del
   render de V11. **Solo para V11**, si no llega a tiempo, Helena con `machine`; lo que se publique con V11 es la voz de NULL
   CIPHER para siempre (V12 la hereda) y, en ese caso, BLIND ARCHITECT ya no puede usar `machine`. Descartado: Pablo (SILENT
   PAGER) o Laura (RED MARROW y PAPER CRANE).
5. **Dónde va y qué se hace después.** Al final de sp1m6, antes del párrafo que pregunta cómo sabes que una clave pública
   es de quien dice (`:144-147`): el vídeo termina con esa pregunta y el párrafo manda a sp1m7, donde va V12. La tarea final
   es el laboratorio spl1c «Crypto Toolbox» (`sp/labs.ts:44-54`), que pide justo lo que enseña el vídeo. Descartado: las 8
   preguntas de la lección, porque la mitad (q4, q5, q7 y q8) tratan de lo que el vídeo deja fuera.

### Riesgos

- **Diffie-Hellman no autentica.** Sin el sello del servidor, alguien en medio mezcla con cada lado por separado y cada uno
  acaba con un color común… con quien se ha puesto en medio. s08 lo dice en una frase («la pintura no te dice con quién has
  mezclado») y s09 lo cierra con el sello; así V11 rima con V12 s03 («cifrado, sí · ¿con quién?»). El concepto dice «sin
  ningún secreto previo», como q2 (`:169`), nunca «dos partes que no se conocen».
- **Las preguntas para pensar no se contestan antes de hacerse.** s05 cuenta los dos trucos en llano y sin nombre antes de
  la tabla, pregunta por el truco y nombra SALT y KEY STRETCHING en la respuesta. s08 no dice «no se envía» ni nombra la
  clave de sesión antes de preguntar si el color final viaja.
- **El hash sirve.** La regla de s06 («la huella dice que no cambió · no dice quién la hizo») es la de q3 (`:193`) y la del
  laboratorio (el instalador se resuelve con Hashing, `sp/labs.ts:148-150`; el correo de la directora financiera, con la
  firma, `:153-155`). La voz nunca dice «un hash no sirve» ni «no garantiza nada»: sirve para la integridad; lo que no da es
  el autor.
- **s06 no pasa en el portal.** La oferta falsa es un ejemplo en condicional, rotulado «ejemplo · así no · lo que propone
  NULL CIPHER», con el buzón: nadie cambia nada en el portal. V10 sacó `/etc/passwd` de ese equipo el 21-10, y quien lo vio
  entendería que el portal sigue comprometido. Ningún vídeo dice qué pudo o no pudo leer el traversal.
- **El híbrido tiene que cerrar el círculo.** s02 dice que la asimétrica no cifra gigas, y s03 cierra la oferta con la
  pública de la naviera. La lección simplifica así (`:58-61`), y en la práctica es híbrido: el documento va con una clave
  simétrica y esa clave, con la pública de la naviera. s09 lo dice en una frase; el revisor debe comprobar que no se cae al
  recortar.
- **Firmar no es cifrar.** La voz dice «el puerto sella la huella con su privada», nunca «la cifra»: la firma de curva
  elíptica no es cifrado. La única excepción es la corrección de s03, que sigue la explicación del check de la lección
  (`:79`: lo que cierra tu privada lo abre tu pública). En pantalla, s07 dice «el sello encaja con la huella que acaba de
  sacar», que vale para RSA y para curva elíptica (el «las dos huellas coinciden» de la lección, `:50-56`, solo vale para
  RSA). Y codificar no es cifrar (la nota de V10).
- **TLS 1.3 en una línea.** SHA-384 no es lo que protege cada paquete (eso lo hace el modo GCM de AES): se usa para
  derivar claves y comprobar el saludo. La voz dice «comprueban que nadie ha tocado el saludo», nunca «comprueba el
  tráfico». `X25519` es ECDH con curvas elípticas: en la voz, «curvas elípticas» o «ECDH», nunca el nombre. `curl` 8 con
  OpenSSL 3 imprime la línea tal cual; alguna versión la escribe `x25519` en minúsculas: se elige una forma y se mantiene.
- **Bits entre familias.** Ni el mensaje de s02 ni su corrección comparan los bits de RSA con los de AES: la corrección se
  queda en la velocidad (q1). La comparación de ECC con RSA (`:84`) se queda en la lección.
- **El portal solo es el escenario.** Ni el traversal ni el DDoS de V10, ni el FINDING #0147. Las contraseñas de s05 son
  las de las navieras en el portal, no las del proveedor de identidad, cuya MFA llega el 30-11 (V10).
- **Orden del curso.** Quien sigue el curso ve V11 antes que ningún otro vídeo de Halden (sp1), aunque pase en noviembre.
  Nada de «otra vez», ni del caso de septiembre, ni de V10; el sello y el portal se presentan desde cero.
- **La caducidad del 11-11 que enseña s01 ata V12.** Si V12 cambia de historia, la pantalla de s01 tiene que cambiar con
  ella. Por eso las dos fichas van juntas.
- **El laboratorio spl1c.** Las reglas del vídeo contestan casi todo spl1c, porque practica la tabla de la lección
  (`:29-39`), que va antes del vídeo. El guion no usa ninguno de sus escenarios tal cual (la copia de 2 TB, el instalador,
  el correo de la directora financiera, «a server you have never contacted», los portátiles, el firmware, el log
  encadenado, el contrato y el túnel: lista con líneas en la ficha) ni hace un juego de clasificar.
- **Densidad del capítulo III** (98 s con hash, colisiones, MD5/SHA-1, contraseñas, sal, rainbow tables, estiramiento y
  tres algoritmos). Las colisiones y MD5/SHA-1 van en media frase y el resto en pantalla; si el borrador pasa de 570 s, se
  recorta aquí antes que los relojes de s05.
- **Las huellas de pantalla son inventadas** y no coinciden con ninguna del registro; las abreviadas llevan «…», que el
  validador no lee en voz. En la voz, «la huella de la oferta», nunca la de una persona.
- **«Llave» ya significa otras cosas en el canal.** En V10, «una llave corriente prueba cada puerta» es una contraseña; en
  V5 y V6, «las llaves maestras» y «el armario de llaves» son credenciales con privilegio (y la revisión de GCTI ya avisó
  de esa deriva en V4, V7 y V9). En V11 la clave criptográfica es siempre «clave» en la voz; «llave» solo vive dentro de la
  imagen física y se dice como imagen («como la llave de casa, con una copia para cada uno»), nunca como el término. Y para
  NULL CIPHER, ni puertas ni llaves.
- **Género de NULL CIPHER en el texto.** Ningún texto lo marca: los mensajes van en infinitivo y la narradora dice «Es
  NULL CIPHER, una célula de acceso inicial». «Una célula» es texto del curso (`sp/sections.ts:47`) y concuerda con
  «neutralizada» (`:49`); fuera de esa frase, el guion no usa pronombres para NULL CIPHER.

### Pregunta para Lidia

- **¿Te parece bien que la voz de Helena fije como mujeres a NULL CIPHER y a BLIND ARCHITECT?** El curso ya las escribe en
  femenino («NULL CIPHER neutralizada», `sp/sections.ts:49`; «BLIND ARCHITECT derrotada», `:87`), así que la respuesta por
  defecto es **sí**: coincide con el texto del curso, los vídeos siguen sin marcarlo en el texto y el registro lo apunta.
  Si prefieres que no cuente como canon, como decidiste con RED MARROW, basta con decirlo: no cambia nada del guion.

## V12 · sp1m7 · «PKI en la consola: el eslabón que falta, CRL y OCSP» · decisiones para aprobar en una ronda

La ficha completa está en el plan de vídeos (§5, V12). Basta con decir qué cambia; lo que no se diga, queda como está. Rutas
relativas a la raíz del repo; `sp/` = `src/data/secplus/`.

> **Revisada el 2026-10-05** (exactitud y canon, `revision-V11-V12.md`): aplicados los dos «conviene» (la raíz «ya en el
> trust store del cliente»; la revocación en condicional, sin decir cómo se filtraría la clave), la fecha del plan de V16 y
> los diez menores. Ningún hallazgo rechazado.

1. **Historia: la renovación del certificado del portal, sin la intermedia.** V11 deja a media luz que el certificado del
   portal de reservas caduca el 11-11; el lunes 9-11 por la tarde se instala el nuevo, solo el certificado, y el martes
   10-11 a primera hora una naviera avisa de que su programa no conecta desde la tarde anterior. Se diagnostica con
   `openssl s_client -showcerts`, se arregla y se comprueba con el mismo comando. Después, la naviera pregunta cómo se
   enteraría de una revocación, y el puerto activa OCSP stapling (Infraestructura, 12-11). Es el caso del check de la
   lección (`sp/sp1-part4.ts:341`) contado en una consola real, y toca el anuncio del jefe de sp1 («certificados
   caducados», `sp/sections.ts:47`) sin tocar su dosier. Descartado:
   - **Una filtración de verdad** (por ejemplo, la clave privada enviada con la solicitud a la CA, que daría un buen
     mensaje de NULL CIPHER con la mitad cierta: la solicitud se firma con la privada, `:295`). Metería un tercer concepto
     (el CSR) y un incidente con alguien que se equivocó, y la cápsula pasaría de 260 s. Además, en el portal del traversal
     de V10, cualquier forma de contar cómo salió una clave haría pensar en esa noche. La revocación va en condicional y
     sin decir cómo se filtraría.
   - **CHG-2041**, el ejemplo de la lección del wildcard interno (`sp/sp1-part3.ts:70-83`): ya se hizo el 6-9, es de otro
     dominio y una CA pública no firma `.local`, así que la historia de la intermedia pública no le encaja.
   - **La fila «Certificado próximo a caducar» del SIEM** (4-9, `video/siem/src/data/s08-triage.ts:15`): obligaría a usar
     `portal.puerto-halden.example` y tomar partido en contra de V1 y V6 en la contradicción de dominios (registro §5.2).
2. **Dos conceptos, con una consola cada uno.** La cadena (con la raíz ya en el almacén del cliente) y la revocación (CRL,
   OCSP y stapling). Se quedan en la lección el CSR y la RA, wildcard y SAN, key escrow y las raíces en hardware (TPM, HSM,
   KMS, secure enclave). Descartado un tercero sobre el CSR o sobre el HSM: los dos tienen su pregunta, pero la cápsula ya
   lleva dos demos de consola y cuatro tarjetas. Por eso la tarea final es terminar la lección y sus preguntas, no
   contestarlas ya: seis de las ocho tratan de lo que viene después del vídeo.
3. **Dos mensajes de NULL CIPHER, con el registro de V11:** «Desactivar la verificación del certificado. Sigue cifrado.
   Lógico.» y «¿Clave filtrada? Esperar a que caduque el certificado. Lógico.». Los dos tienen la mitad cierta (sigue
   cifrado; el certificado caduca) y dejan un hueco. Ni puertas ni llaves para NULL CIPHER, como en V11. Descartado:
   - «Añadir la raíz al servidor» o «que acepten el aviso»: suenan al dosier (un certificado autofirmado instalado como raíz
     «temporalmente», `sp/sections.ts:49`);
   - «Mandar la clave privada con la solicitud»: necesitaría el CSR como concepto.
4. **Dos imágenes nuevas, una por concepto.** La cadena del ancla: la raíz es el ancla, que ya llevas a bordo (en inglés,
   *trust anchor*, aunque la voz no lo dice: la lección habla de *root of trust* y *trust store*); la que vale es la que tu
   equipo ya tenía, no la que te mandan. Y el hotel que comprueba tu DNI: la lista de robados que llega una vez al día
   (CRL), la llamada a la policía con cada huésped (OCSP) y el justificante sellado de esta mañana que trae el propio
   huésped (stapling). Descartado:
   - la garita y los pases de la puerta de camiones, que se confundirían con el pase firmado de V6 (SAML) y el armario de
     llaves de la garita (PAM);
   - la tarjeta y el cajero, que ya son la MFA de V6.
5. **Datos de consola de verdad, con la CA de la lección.** `Confianza Global Root` y `Confianza Global TLS Issuing CA 3`,
   y sus URL de CRL y OCSP (`sp/sp1-part4.ts:301-327`), en la salida de OpenSSL 3 (`s:`, `i:`, `a:`, `v:`, los errores 20
   y 21, `Verify return code`, `OCSP response: no response sent`, `Cert Status: good`). El certificado nuevo dura 200 días
   justos (del 9-11-2026 a las 00:00:00 al 27-05-2027 a las 23:59:59, contados como los Baseline Requirements), el máximo
   que admite un certificado público emitido después del 15-3-2026. Descartado copiar la validez de un año del ejemplo de la
   lección (`:323`): ese se emitió en enero de 2026, antes del cambio.

### Riesgos

- **Los navegadores suelen completar la cadena solos** (descargan la intermedia o la tienen guardada), y por eso en la vida
  real este fallo sale en programas, no en el navegador. El vídeo lo enseña en el programa de la naviera y no dice nada de
  los navegadores. El check de la lección habla de un aviso en el navegador (`:341`): no se contradice, pero el guion no
  debe decir que «todos los navegadores avisan».
- **«La raíz no hace falta mandarla».** Un servidor puede mandarla, y no pasa nada: el cliente no se fía de ella por eso,
  sino porque ya la tiene. La voz y la pantalla dicen «no hace falta mandarla», nunca «nunca se manda» ni «no viaja».
- **«Ya en el trust store», no «de serie».** Vale para las raíces públicas y para una raíz interna que el puerto reparta a
  sus equipos (la de `*.halden-port.local`, que sigue sin definir y que V17 podría necesitar).
- **OCSP en la vida real.** El CA/Browser Forum hizo OCSP opcional para las CA públicas (las CRL siguen siendo
  obligatorias) y alguna grande ya lo ha dejado (Let's Encrypt, en 2025). El vídeo sigue a la lección y al examen (`:365`,
  `:370-379`) con la CA ficticia de la lección, que sí lo tiene. No se dice que OCSP vaya a desaparecer ni que todas las
  CA lo usen.
- **La corrección del primer mensaje** (alguien en medio con su propio certificado) no está tal cual en la lección; se
  apoya en lo que dice de la PKI, que une una identidad a una clave pública (`:291`). El revisor debe comprobar que no
  promete más: sin verificar, el tráfico sigue cifrado, pero no sabes con quién. Rima con el límite de las pinturas de V11
  («la pintura no te dice con quién has mezclado»).
- **La pregunta para pensar no se contesta sola.** El ancla y el hueco salen sin rótulos hasta la respuesta.
- **El formato de OpenSSL 3** (las líneas `a:` y `v:` de la cadena, los dos errores 20 y 21 con `depth=0`, la doble
  separación en `Nov  9`) se copia de una salida real al montar la escena, no de memoria.
- **Horas:** la tira usa la hora de Halden (CET, 08:15, 08:40, 09:10) y la consola imprime GMT. La voz no lee ninguna hora
  de consola.
- **Nada en condicional se convierte en hecho.** El guion no dice que se revocara el certificado ni que se filtrara una
  clave, ni pone un ejemplo de cómo podría filtrarse; NULL CIPHER pregunta «¿Clave filtrada?» y la narradora contesta con
  «si un día…», los dos motivos de la lección (`:365`) y «se revoca ya, y se pide otro con una clave nueva».
- **Infraestructura, no Sistemas.** Los certificados del puerto son de Infraestructura en las lecciones (L. Ferrer, dueño
  de CHG-2041, `sp/sp1-part3.ts:71`); nadie sale con nombre, y el despiste no se cuenta como un cambio mal hecho.
- **El portal sale a Internet para grapar OCSP** desde el 12-11. Las reglas de la DMZ de V16 no deben decir «de la DMZ a
  Internet: nada» ni poner delante un proxy que termine TLS sin decir dónde queda el certificado.
- **V11 y V12 van juntas.** La caducidad del 11-11 sale en la pantalla de V11; si cambia la historia de V12, cambia esa
  pantalla.
- **El ancla no es la raíz de nadie del puerto.** La raíz es la de una CA pública y la naviera ya la tiene; el guion no
  enseña a nadie instalando raíces ni aceptando un autofirmado (dosier de sp1).

### Preguntas para Lidia

Ninguna propia: la voz de NULL CIPHER (Helena, `rate` 0, `cifrado`) la decidió la coordinación, y la única pregunta, si
está bien que Helena la fije como mujer, va en V11. V12 hereda la respuesta y la voz con que se publique V11.

## V13 · s2m1 · «La Cyber Kill Chain: basta con romper un eslabón» · decisiones para aprobar

Basta con decir qué cambia; lo que no se diga, queda como está. La ficha completa está en el plan de vídeos (§5, V13).

> Revisadas el 2026-10-05 con la revisión de exactitud y canon (`revision-gcti.md`, V13 y «Entre fichas» 1): aplicados
> sus dos «conviene» (s02 sin prometer de más; s07, saltar antes solo donde ves antes) y sus cuatro «menor» (las tres
> siguientes, «cara a internet», «leer, comprimir y sacar» y la etiqueta del taller en s05). Ningún desacuerdo.

1. **Historia: «¿qué le queda por hacer?».** Abre con la alerta del 5 de marzo que ya enseñaron V3 y V7 (fecha, hora,
   equipo y «dominio desconocido», sin el código E7 ni el informe, que presenta s2m3) y vuelve al lunes 2 de marzo con la
   reconstrucción de la propia lección. Al final regresa al 5-3: la cadena va por C2 y la séptima fase no aparece en lo
   que tienes (`src/data/s2.ts:113`), sin decir si se llegó a tiempo. Descartado: contar el 2-3 en directo, como si alguien
   lo viera pasar, porque V7 fija que la reconstrucción es posterior a la alerta y V3 presenta el dominio como
   desconocido el 5-3. Descartado también empezar en frío con la teoría: sin la alerta no hay nada en juego, y saber en
   qué fase va es justo lo que pide la misión 2 (`src/data/labs.ts:72-73`).
2. **El porqué y una demo, no el orden (penalización L).** Cinco conceptos: la asimetría (él necesita las siete, a ti te
   basta romper una a tu alcance), leer cada prueba en su fase con las dos trampas de examen que más caen (el remitente que imita a la casa
   es Delivery; el beacon es C2, no el objetivo), lo visto frente a lo deducido (Weaponization), llegar antes (y en el
   equipo, lo primero que cortas es Exploitation) y los límites. Descartado recorrer la tabla de las siete fases con sus
   ejemplos, que es lo que ya hacen la lección y el Lab 2A; y descartado clasificar eventos como los del laboratorio, que
   destriparía sus ítems más difíciles.
3. **Una sola imagen, la casa y la caja trampa.** Siete viñetas del plan de un ladrón, y cada concepto usa un detalle: la
   cadena que se rompe si nadie abre la caja, el taller que no ves, enterarte cuando ya faltan los planos, quien ya tiene
   llave y no necesita caja. Installation es la llave en la maceta, el mismo sentido que le dio V7. Dentro del aparato
   asoma, en blanco, **la etiqueta del taller**: la imagen común de la ruta PDB, un solo componente que heredan V14 (el
   enlace fuerte, dentro de la caja) y V15 (cosida en el cuello de una prenda), con la misma frase en voz en los dos; V13
   solo dice «y a veces, por dentro, hasta la etiqueta del taller donde la montó». Descartado el caballo de Troya («troyano» es
   un tipo de malware y confunde) y descartada una cadena de eslabones sin más, que es el nombre del modelo y no una
   imagen de todos los días.
4. **Dónde va: al final de la lección, después de los dos checks de la demo y antes del párrafo de cierre.** Como V9, el
   vídeo resume la lección entera y manda al Lab 2A. Descartado ponerlo antes de los checks, como V3 y V7: aquí el vídeo
   va más allá de la demo (llegar antes, límites) y, colocado ahí, contestaría los dos checks justo antes de que se
   hagan.
5. **«RR. HH.» no sale en pantalla.** La lección dice que el correo lo recibió RR. HH. y que la cadena corre en una
   estación de ingeniería (registro §5, punto 5). El vídeo enseña el asunto («Candidatura - Ingeniero de propulsion») y
   la estación, y la voz dice que alguien lo abre en una estación de ingeniería, como V7 («se abre el adjunto»).
   Descartado fijar ahora que RR. HH. reenvió el CV al equipo de propulsión: es una lectura natural, pero contradice el
   ítem del Lab 2A «An HR analyst opens the LNK» (`src/data/labs.ts:243`) y V13 no la necesita.

### Riesgos

- **Horas sin zona.** El correo es de las 09:41 UTC y la cadena del EDR va «sin zona»; el registro prohíbe ordenarlas como
  si fueran la misma hora (registro §2). El guion dice «ese mismo día», nunca «tres minutos después».
- **El paso de certutil** (registro §5, punto 19): la cadena de s2m1 no lo tiene y V7 sí lo enseñó en el árbol de s2m5. El
  guion no dice qué proceso escribe `winhlp.exe` («aparece un programa nuevo en una carpeta de sistema»).
- **«La séptima no aparece»** se apoya en el check de la lección (`src/data/s2.ts:113`, «No objective action has been
  observed yet») y cuadra con V3 (E9 el 7-3). Choca con las líneas actuales de s2m4, que sacan 1,2 GB el 5-3 a las 01:47
  (`src/data/s2.ts:876-877`, registro §5, punto 7). V13 lo esquiva diciendo «en lo que tienes»; el arreglo de esas
  líneas es una propuesta de V14 (su apartado V14, más abajo), y V13 no depende de ella.
- **No prometer de más (pasa a bloquea si el guion lo dice).** «Te basta con romper un eslabón» es la idea del modelo
  (s2m1q4), y la tarjeta se queda así, pero en voz y en pantalla es **uno de los que tienes a tu alcance** (Weaponization
  y casi siempre Reconnaissance no lo están), y romperlo frustra **ese intento**, no al atacante: puede mandar otra caja,
  aunque empieza de cero y ya has visto cómo la prepara. El guion no dice que Meridian lo rompiera. Y «llegar antes» es
  una regla general, no un reproche al SOC del caso.
- **Detectar no es parar, y solo se detecta antes donde hay ojos.** s07 dice «para saltar antes, hay que ver antes»
  (registros del correo, del equipo; s2m1q5, `src/data/s2.ts:176`) y la alarma solo apaga las fases siguientes cuando
  alguien actúa sobre ella; la lección habla de un control que corta (`:89`), no de una alarma que nadie atiende.
- **Palabras con trampa.** «Registros públicos» se entiende como el registro civil: el guion dice «los registros de lo que
  tienes cara a internet, como tu web», sin nombrar la VPN (ítem del Lab 2A, `src/data/labs.ts:223`). Y en s04, Actions
  on Objectives es «leer, comprimir y sacar», nunca «buscar» ni «recorrer» carpetas (otro ítem del Lab 2A, `:263-265`).
- **La etiqueta del taller**, siempre con «del taller»: «la etiqueta» a secas es el disfraz de la tarea en V7
  (`video/attack-piramide/narration.json:77`), y la «etiqueta de envío» es la imagen de las cabeceras en V1
  (`video/capas-halden/narration.json:47`), que aquí no se usa.
- **Las dos trampas, bien dichas.** El remitente que imita a Meridian es Delivery porque es oficio de la entrega:
  investigar fue antes, usarlo para que el correo entre es entregar (s2m1q10). Y la pasarela de correo es un control de
  red, antes del equipo: el guion no la pone «en el equipo» (s2m1q7). El revisor de exactitud debe mirar las dos frases.
- **La imagen no debe falsear Exploitation.** La caja hace daño solo cuando alguien la abre: el aparato «se enciende al
  abrirla». Si el guion sugiere que el correo hace algo por llegar, mezcla Delivery y Exploitation, justo lo que examina
  el primer check (`src/data/s2.ts:50-58`).
- **Sin nombres de Courses of Action.** «Detectar» se usa como verbo de todos los días; ninguna acción se etiqueta como
  Detect, Deny o Disrupt, porque eso es el Lab 2C y la lección siguiente.
- **La IP de `Received`** (`203.0.113.27`) sale como en la lección, sin resaltar: el passive DNS dice que el dominio dejó
  esa IP el 1-3 (registro §5, punto 13). La voz dice «el servidor que lo envió de verdad», nunca «el dominio estaba en
  esa IP».
- **La flecha de la lección** en la línea del beacon se dibuja como conector (como V7); no se teclea el carácter.
- **Duración.** Con 454 s de escenas debería salir en ~8:15–8:25, pero la suma predice mal: si el estimado pasa de ~580 s,
  se funde s06 en s05; si baja de ~420 s, se alarga s04.

### Preguntas para Lidia

Ninguna. No hay adversario nuevo (GLASS VIPER habla con la voz de V3 y V7), ni cambios en la lección, ni fechas o
personas nuevas.

## V14 · s2m4 · «De la foto a la película: activity threads y grupos» · decisiones para aprobar

Basta con decir qué cambia; lo que no se diga, queda como está. La ficha completa está en el plan de vídeos (§5, V14).

> Revisadas el 2026-10-05 con la revisión de exactitud y canon (`revision-gcti.md`, V14 y «Entre fichas» 1, 2 y 5):
> aplicados el «bloquea» (plan B con E9 tal cual la ficha de V3), los «conviene» (la propuesta de la lección, que la
> revisión da por buena con dos pruebas más; hipótesis que compruebas) y los ocho «menor». Ningún desacuerdo.

1. **La Víctima 1 de la lección se monta con lo que ya está en pantalla, y la lección se corrige aparte.** El walkthrough
   de s2m4 (`src/data/s2.ts:871-877`) hace entrar a Meridian por un correo «PO revision» a `j.alvarez@` a las 09:14,
   deja `winhlp.exe` en `C:\Users\..`, llama a casa a las 09:32 y saca 1,2 GB el 5-3 a las 01:47, antes de la alerta. Eso
   choca con s2m1 (el CV de las 09:41 UTC y la cadena de `ENG-WS-041`, `:68-85`), con V7 (`C:\ProgramData\winhlp.exe` en
   pantalla, `video/attack-piramide/src/data/s05-otra-ropa.ts:19`) y con V3, que pone la primera acción sobre el objetivo
   en E9, el 7-3 (`video/diamond-e7/narration.json:323,329`; registro §5, puntos 4 y 7). Dos pruebas más: V8 tiene en
   pantalla una sola entrada, «incidente propio · correo del 02-03», colgada del relay del correo del CV
   (`video/stix-isac/src/data/s04-grafo.ts:32`), y la ficha de V7 ya descartó estas víctimas por lo mismo
   (`docs/superpowers/plans/2026-09-25-lesson-videos.md:1016-1017`). El vídeo monta el hilo de Meridian
   con s2m1, V3 y V7, y propone cambiar esas líneas de la lección (texto abajo), como hizo V10 con el spraying. Hay un
   motivo más para que el «PO revision» se quede solo en Orbital: es el señuelo contra proveedores que repiten S4
   (`src/data/s4.ts:1033`) y S5 (`src/data/s5.ts:57`). Descartado:
   - **usar la lección tal cual**, porque contradiría a dos vídeos publicados en ruta, fechas y orden de fases;
   - **leerlo como dos intrusiones paralelas en Meridian** (una por Compras a las 09:14 y otra por el CV a las 09:41):
     s2m1 habla de una intrusión, V7 dice «Así entró el atacante en un equipo de Meridian»
     (`video/attack-piramide/narration.json:23`) y V3 junta E7 y E9 en un solo hilo; además duplicaría el incidente y su
     exfiltración;
   - **dejar fuera a Meridian**, porque V3 prometió que «esa película la montas en la lección siguiente»
     (`video/diamond-e7/narration.json:347`).
2. **Dos variantes escritas, para que la pantalla aguante un «no».** El hilo de Meridian sale como fichas de fecha y fase
   (sin horas, sin destinatario, sin rutas) y la ruta PDB de Meridian se enseña con el nombre del programa y sin carpeta.
   Lo que depende del cambio está en la tabla «Las dos variantes» de la ficha: con el plan A, E9 lleva un contenido
   genérico («compresión en una carpeta temporal · salida grande», sin el tamaño ni el destino que chocan entre la
   lección y el Lab 2A), el Delivery dice «correo con un CV» y s04 tiene la fila de los señuelos; con el plan B, **E9 es
   la ficha de V3 al pie de la letra** («E9 · 2026-03-07 · +2 días · misma metodología · Actions on Objectives»), sin
   contenido, porque la lección de justo encima pone el staging el 4-3 y la salida el 5-3 y se leerían dos salidas de
   datos; el Delivery dice «correo con un adjunto»; s04 empieza en el dominio, y en s08 se proyecta solo «Actions on
   Objectives». En los dos, el plan de s09 sale del check de la lección (`src/data/s2.ts:929`), sin fecha.
3. **Dos imágenes heredadas.** La película de V3 para el hilo y para lo que viene después; la caja trampa de V13 para lo
   que une dos intrusiones: envoltorios y números de teléfono distintos (lo barato), la misma cinta de embalar que todo el
   mundo (lo débil) y, por dentro, la misma **etiqueta del taller** (la ruta PDB, lo fuerte). La etiqueta es la imagen
   común de V13, V14 y V15: un solo componente y una sola frase en voz, palabra por palabra en s04 de V14 y s05 de V15
   («Al compilar, a veces se queda escrita dentro la carpeta donde se hizo. Es como la etiqueta del taller, por dentro.
   No siempre la lleva. Pero si otra trae la misma, salen del mismo taller.»). Descartada la ropa, el acento y la forma de
   andar de V7: mide lo que le cuesta cambiar algo, no lo raro que es, y con ella PowerShell («cómo anda») saldría como
   el mejor enlace, al revés que la lección. Y lo que viene se cuenta como **hipótesis que compruebas** («ya tienes una
   buena pista de la escena que viene: no la sabes, la compruebas»), no como «ya sabes qué escena viene».
4. **El grupo se queda sin nombre: «activity group candidato».** El segundo mensaje de GLASS VIPER («Pues dime quién soy»)
   da pie a «agrupar no es atribuir», y encaja con su «Mi nombre no lo sabrás» de V3. GLASS VIPER sale solo como nombre del
   implante en las fichas de E7 y E9 y como firma de los mensajes. Descartado llamar al grupo VELVET CICADA, que es lo que
   revela el dosier de BROKEN CHAIN («ya tiene cara técnica»), o GLASS VIPER, que el registro reserva para el loader y el
   nombre de los vendors (§5, punto 9).
5. **Dónde va y qué se manda hacer.** Después del último check y antes del callout de campaña; la tarea son las 10
   preguntas de la lección. Descartado ponerlo antes del walkthrough, que destriparía «intenta decidir antes de seguir
   leyendo» (`src/data/s2.ts:865`), y descartado mandar al Lab 2A o al 2B, que no practican hilos ni grupos.

### Propuesta aparte (la lección no se toca desde la ficha): la Víctima 1 del walkthrough

Solo texto: no cambia ningún id, ni opciones, ni respuestas, y `src/data/content.test.ts` no fija texto de s2m4. Iría en
el PR de V14.

- **`src/data/s2.ts:871-877`**, el bloque de la Víctima 1. Hoy:
  ```
  [Victim 1 — Meridian Dynamics]
  2026-03-02 09:14  email "PO revision" -> j.alvarez@meridian.example
  2026-03-02 09:31  attachment runs; drops C:\Users\..\winhlp.exe
                    linker artifact: D:\proj\cicada\loader\Release\ldr.pdb
  2026-03-02 09:32  winhlp.exe beacons -> update-svc-cdn.com:443
  2026-03-04 22:10  archive staged: C:\Windows\Temp\~tmp4421.cab
  2026-03-05 01:47  1.2 GB out -> transfer-cdn-eu.example
  ```
  Propuesta (en el `.ts`, con las barras escapadas como ahora):
  ```
  [Victim 1 — Meridian Dynamics]
  2026-03-02 09:41  email "Candidatura - Ingeniero de propulsion" (CV_Ingeniero.zip)
  2026-03-02 09:44  LNK runs on ENG-WS-041; drops C:\ProgramData\winhlp.exe
                    linker artifact: D:\proj\cicada\loader\Release\ldr.pdb
  2026-03-02 09:45  winhlp.exe beacons -> update-svc-cdn.com:443
  2026-03-07 00:52  archive staged: C:\Windows\Temp\~tmp4421.cab
  2026-03-07 01:47  1.2 GB out -> transfer-cdn-eu.example
  ```
  Las tres primeras líneas son las de s2m1 (`:68-83`), sin destinatario (registro §5, punto 5) y sin zona, como el resto
  del bloque. El staging y la salida pasan al 7-3, el día de E9 (s2m3, `:623`; V3), y conservan archivo, tamaño y
  destino.
- **`:893`**, la fila del señuelo. Hoy: «Mismo lure «PO revision» en ambas · Tema de targeting · **Medio** — sugiere el
  mismo tasking, no lo prueba». Propuesta: `['Señuelos distintos: un CV en Meridian, un «PO revision» en Orbital',
  'Señuelo a medida', '**Neutro** — se adapta a cada víctima y cambiarlo es barato; que no coincida no rompe el grupo']`.
  Hace pareja con la fila de los dominios (`:895`).
- **`:902`**, el veredicto: «un enlace fuerte (el PDB) reforzado por dos medios coherentes» pasa a «un enlace fuerte (el
  PDB) reforzado por uno medio y coherente (Orbital es proveedor de Meridian)». El resto del párrafo no cambia.
- **Opcional, `:887`:** añadir Exploitation a los dos hilos («Delivery (phish) → Exploitation (el adjunto se ejecuta) →
  Installation…»), que es como los enseñan V13 y V14. Hoy la lección se lo salta.
- **No hace falta tocar** el check `:850` ni la pregunta s2m4q7 (`:1034-1046`): son casos hipotéticos («share a phishing
  lure theme»), no el walkthrough.

**Si la respuesta es no (plan B):** s02 dice «correo con un adjunto» en vez de «correo con un CV», y E9 es la ficha de V3
tal cual, sin contenido; en s04 desaparece la fila de los señuelos (la comparación empieza en el dominio); en s08 se
proyecta «lo que vino después en Meridian: Actions on Objectives», y lo que se busca llega en s09 desde el check de la
lección. El resto del vídeo no cambia. El precio: justo encima del vídeo, la
lección seguiría contando otra entrada en Meridian (otro correo, otra persona, otra hora, otra carpeta) y una salida de
datos antes de la alerta, distintas de V13, V7 y V3; y el registro no podría decir que el `winhlp.exe` del 2-3 lleva la
ruta PDB, porque el de la lección estaría en otra carpeta.

### Lo que recibe el registro de canon al aprobarse (paso 8)

- **§2:** fuera la fila «2026-03-02 09:14 → 09:32 · Víctima 1 (s2m4)» (es la misma entrada que la de las 09:41); el
  staging y la salida pasan del 4-3 y el 5-3 a la madrugada del sábado 7-3 (00:52 y 01:47), junto a E9; las horas del EDR
  de `ENG-WS-041` pasan a UTC (el bloque nuevo pone 09:41 y 09:44 juntos, y las líneas del mismo sensor en V3 llevan `Z`,
  `video/diamond-e7/src/data/s03-victim.ts:25-45`), lo que cierra la advertencia «sin zona» de las filas 39-40; nueva
  fila «2026-03-09 (lunes), sin hora · «hoy» de V14: Orbital pasa sus eventos a Meridian», puntual y no como fuente fija
  (el PIR-3 del CMF sigue SIN FUENTE, `src/data/s3.ts:64,76`).
- **«PO revision»:** el mismo señuelo, no la misma ola. La campaña de S4 y el aviso de S5 son phishing de credenciales
  contra portales de proveedores (`src/data/s4.ts:1033-1035`, `src/data/s5.ts:56-58`); lo de Orbital es un adjunto que
  ejecuta código (`src/data/s2.ts:880-881`).
- **§3:** `j.alvarez@meridian.example` sale de la tabla de personas.
- **§5, punto 4:** resuelta la parte de s2m4; siguen abiertas la cuenta VPN del Lab 2B y los portales del BLUF de S5.
  **Punto 7:** resuelta la fecha; sigue abierto el tamaño (1,2 GB frente a 650 MB del Lab 2A). **Punto 11:** tres
  muestras con la misma ruta PDB (`winhlp.exe` `4c81...b3` del 2-3, `updsvc.exe` `9f3a...e1` del 5-3 y `msdtcs.exe` de
  Orbital), solo para el registro. **Punto 1:** `4c81...b3` lleva la ruta PDB; sigue abierto el nombre
  `VC_Loader_v1.dll` del Lab 3B. **§7, V7:** «la variante 1 del Lab 3B» se reescribe como una familia, las compilaciones
  con ruta PDB `4c81` (2-3) y `9f3a` (5-3), no un solo binario. **Hueco menor nuevo:** V3 da a E9 «misma metodología»
  que E7 (beacon HTTPS), y una salida hacia `transfer-cdn-eu.example` va a otro destino; el vídeo la deja sin destino.
- **§7:** el bloque de V14 con su canon nuevo, sus tres mensajes y la etiqueta del taller como imagen común del PDB.
- Con el plan B no se apunta nada de esto, salvo el «hoy» del 9-3, los mensajes y la imagen.

### Riesgos

- **Detectar no es agrupar.** V7 enseñó que lo más duradero para detectar es el comportamiento; la lección dice que «las
  dos usan PowerShell» es un enlace débil (`src/data/s2.ts:834`). El guion tiene que decir en una frase por qué no se
  contradicen: para que una detección **dure** sirve lo que le cuesta cambiar (lo raro también importa al detectar, por
  los falsos positivos); para agrupar, además, tiene que ser raro. El revisor de exactitud debe mirar esa frase.
- **La ruta PDB no es imposible de cambiar, y tiene que ser única.** La lección la da como rara y cara de cambiar
  (`:834,840`), y la tarjeta dice «PDB único» (s2m4q2, `:968`), porque una ruta genérica no une nada. La voz usa la frase
  común («No siempre la lleva. Pero si otra trae la misma, salen del mismo taller»), nunca «no puede quitarla» ni «todas
  la llevan», ni «la etiqueta» a secas (V7) ni «etiqueta de envío» (V1).
- **Nada de «exactamente».** La lección dice que el activity-attack graph «te dice **exactamente** qué buscar» (`:902`);
  la voz no lo copia: lo que se hereda son hipótesis que compruebas (s2m4q5, `:1011`). El nombre ACTIVITY-ATTACK GRAPH
  cae con las ramas de lo posible, no sobre la superposición, que es heredar hipótesis del grupo.
- **Las fases que coinciden** en s08 son de la entrega a la llamada a casa (Delivery a C2), no «las cuatro primeras».
- **Orbital no es la cadena de Meridian.** La lección dice solo «attachment runs» (`:881`): ni LNK ni PowerShell, que sería
  el «TTPs consistentes» del dosier. En cambio, el vídeo sí lo pone en Exploitation, porque ejecutar el adjunto es eso
  (V13); la lección se salta esa fase en `:887`.
- **Horas de Orbital sin zona** (`:880-883`): la voz dice «esa misma mañana», sin horas.
- **Quién busca en Orbital.** Meridian le pasa a Orbital qué buscar; el guion no dice que Meridian entre en los equipos de
  Orbital, ni enseña ningún resultado.
- **«Candidato», no «confirmado».** El guion no dice «es el mismo grupo», sino «van al mismo grupo candidato»; y no habla de
  clusters, porque en s4m4 el Cluster-B de Orbital («Orbital-2») se mantiene separado (`src/data/s4.ts:729-745`).
- **La palabra de la ruta PDB:** la voz no la comenta.
- **V14 se apoya en V13 (el taller) y en V3 (la película)**, pero tiene que entenderse sola: la frase común de la ruta
  PDB va entera, aunque quien vio V13 ya conozca el taller.
- **Duración.** Con 454 s de escenas debería salir en ~8:15–8:25. Si el estimado pasa de ~580 s, se recorta primero s07;
  si hay que fundir s05 con s04, la tarjeta de s05 se cae (quedan 6), porque no caben dos tarjetas en una escena.

### Preguntas para Lidia

- **¿Cambiamos la Víctima 1 del walkthrough de s2m4?** (texto exacto arriba). Recomendado: sí, en el PR de V14, con la
  fila del señuelo y el veredicto; el añadido de Exploitation en `:887`, si te parece. Si no, el vídeo sigue con el plan
  B de arriba.

## V15 · s3m2 · «Lo que cuenta una muestra: triaje de malware en sandbox» · decisiones para aprobar en una ronda

> Revisadas el 2026-10-05 con la revisión de exactitud y canon (`revision-gcti.md`, V15 y «Entre fichas»). Se aplicaron
> todos sus puntos, también los «menores»; el del import `MapViewOfSection` es un cambio de lección y queda como
> pregunta para Lidia.

1. **Tres conceptos, en el orden en que trabaja la analista:** no subir la muestra a la ligera (se busca el hash), leer
   las dos mitades del informe separando lo suyo del ruido, y los campos que la unen a sus parientes. Descartado quedarse
   en dos sin OPSEC: es uno de los tres objetivos de la lección (`src/data/s3.ts:287`), lo preguntan s3m2q3 y q10, y es
   el atajo que mejor le pega a HOLLOW LANTERN, el equipo que cambiaría los dominios si se entera. La tarjeta dice
   «subirla puede avisarle», con el «puede» de la lección (`:316`) y el equilibrio de s3m2q10 (`:551`). Descartado
   también partir los campos en dos escenas para dar una quinta tarjeta al PDB frente a la fecha de compilación: la
   cápsula pasaría a siete escenas y a rozar el techo de duración; esa regla va en el cierre y en s3m2q7.
2. **«Lo que puede engañarte» es lo que engaña a quien lee el informe, no al sandbox.** El encargo pedía la evasión
   «hasta donde la enseñe la lección», y s3m2 no la enseña: solo sale en Security+ (`src/data/secplus/sp4-part1.ts:134,141`)
   y en la pregunta de nivelación pl-s3q3 (`src/data/placement-gcti-s3.ts:83-92`); el plan tampoco la pide
   (`docs/superpowers/plans/2026-09-25-lesson-videos.md:1524`). Lo que la lección sí enseña, y el vídeo cuenta, es el
   ruido del sistema entre los hosts (`:348`, s3m2q4) y la fecha de compilación que se puede falsear (`:331`, s3m2q7).
   Descartado meter la evasión: sería un cuarto concepto sin apoyo en el texto que va justo al lado del vídeo, y
   contestaría pl-s3q3.
3. **El informe sale como extracto, sin la línea del firmante, y lo dice el rótulo.** La lección firma la muestra con
   «Bright Meridian Software Kft.» (`src/data/s3.ts:334`) y V3 enseña `signed=false` para el mismo hash
   (`video/diamond-e7/src/data/s03-victim.ts:32`; registro §5, punto 2). Descartado enseñarla con una explicación («el
   EDR pone false porque el firmante no es de confianza»): congelaría en un vídeo una lectura que el registro no ha
   decidido y añadiría otro concepto. «Firmado no es benigno» se queda en la lección (`:348`, s3m2q6 y q9).
4. **La historia es la copia del programa de E7, sin fechas nuevas.** La tira de V3 se convierte en la muestra del
   informe (el registro ya dice que es la misma, §3), y ni la búsqueda, ni la detonación, ni la decisión de bloquear
   llevan fecha, como en V9. Lo nuevo es lo mínimo: «sin resultados» al buscar el hash en un servicio (en voz, «nadie
   la ha subido ahí»), el sandbox interno del CMF, el pipe de E7 junto al del sandbox (solo en pantalla) y el C2 de
   repuesto, que no salía en la alerta de E7. Descartado fechar la detonación (por ejemplo, el 6-3): obligaría a
   explicar si E9 (7-3) usó alguno de los dos hosts y por qué `update-svc-cdn.com` deja de verse el 7-3 en V4.
   **Imágenes:** la «ropa» es el hash, como en V7, y la ruta del PDB es **la etiqueta del taller**, la imagen común de
   V13, V14 y V15 (aquí cosida en el cuello de la prenda), con su frase en voz compartida con V14, «no siempre la lleva»
   incluido. La habitación de s04 pasa a ser un teléfono de prestado, porque la «casa» es la imagen de V13 (Meridian).
   Descartados el «acento» (ya significa dos cosas, en V3 y V7), la llave (V4 y V7), la carta (V8), los vecinos (V4 y
   V8) y «la etiqueta» a secas (V7).
5. **Dos mensajes de HOLLOW LANTERN y la pregunta sobre los cinco hosts.** «Súbela a un servicio público. Cuantos más
   ojos, mejor.» es la misma trampa que su «¿Por qué no vienes a verme?» de V4, ahora con la muestra; «Bloquea esos dos,
   analista. Tengo más esperando su turno.» tira de los dominios dormidos de V4. La respuesta al segundo empieza por
   «Bloquearlos sigue valiendo: le obligas a gastar otro» (s04 acaba justo bloqueándolos) y sigue con lo que sostiene
   la lección: aunque cambie de dominio, la muestra sigue contándote de dónde viene (imphash y ssdeep la unen a
   muestras que ya tenías; unos dominios distintos no rompen el grupo, `src/data/s2.ts:895`), nunca que te lleve a sus
   compilaciones futuras. Los dos con su voz de V4 y V8 (Pablo con `machine`). Descartado un mensaje del tipo «cambio
   un byte y no me encuentras»: es el terreno de GLASS VIPER, que ya lo dijo en V7 («Bloquea mi hash»). La pregunta va
   en la lista de hosts, sin las anotaciones de la lección, porque es la decisión que el vídeo enseña con la lista
   delante; descartado preguntar «¿PDB o fecha de compilación?», que es memoria y no lectura. El vídeo entra en la
   lección justo antes de los cuatro checks (`src/data/s3.ts:349-350`), como V3 y V7; descartado ponerlo entre el
   informe y el párrafo del triaje (`:345-346`), donde la pregunta sería más «limpia» pero el vídeo daría la conclusión
   antes que la lección.

### Riesgos

- **Lab 3B, frase a frase.** El PDB va con la frase común («a veces se queda escrita», «no siempre la lleva», «si otra
  trae la misma»). Es exacto y no destripa nada: el laboratorio ya imprime «raro» y «(solo variante 1)» junto a esa
  cadena (`src/data/labs.ts:775`; `src/components/labs/YaraLab.tsx:86-90`). El revisor de exactitud debe tachar
  cualquier «todas sus variantes la llevan», «no la puede quitar» o «buscando el PDB encuentras la familia». Nada de
  YARA, de cadenas raras o comunes, de `VC_Loader_v*` ni de «variante 1/2».
- **La etiqueta del taller, idéntica en V13, V14 y V15.** Un solo componente en pantalla, con la ruta en monoespaciada;
  la frase de V15 es la de V14 palabra por palabra más «cosida en el cuello». Si al escribir el guion de V14 cambia la
  frase, cambia también aquí. V15 no enseña ningún acierto del PDB en otra muestra: esa demo es de V14
  (`src/data/s2.ts:871-898`).
- **Dos grafías del hash.** La tira de V3 dice `9f3a...e1` y el informe de la lección `9f3a2c...e1`. El registro (§3) los
  da por iguales; que el revisor no lo marque como choque, y que nadie «unifique» la tira de V3, que es canon en
  pantalla.
- **La fecha de compilación** (19-2) no se compara con nada, y `4c81...b3` no sale: V7 dejó escrito que no se dice cuál
  de las dos compilaciones es anterior (registro §7).
- **`WindowsUpdateCheck`** se dice siempre como lo que hace la muestra en el sandbox, nunca «el 5 de marzo creó…».
- **El pipe, solo en pantalla.** Son dos ejecuciones de la misma compilación: no prueban que el patrón sobreviva a
  recompilar, como dijo V3 (`video/diamond-e7/narration.json:97`). El rótulo dice «otro número en cada ejecución» y la
  voz no lo comenta (era la primera frase del orden de recorte, y sin ella el guion queda en unas 550 palabras).
- **El C2 de repuesto:** la voz dice que no salía «en E7», o sea, en las líneas de la alerta. Nada sobre si la red de
  Meridian llegó a hablar con él.
- **El imphash «apunta» a la familia, no la demuestra:** con tablas de imports pequeñas o binarios empaquetados se repite
  en ficheros que no tienen nada que ver.
- **La pregunta ya está contestada en el párrafo de encima** (`src/data/s3.ts:348`). Pasa igual en V7 y V8, y el vídeo
  la hace sobre la lista sin anotar; si Lidia la quiere «limpia», la alternativa es la del punto 5. Y aunque no se haya
  leído el párrafo, los nombres de los tres hosts de Windows ya dan una pista: está bien, es lo que se aprende a mirar,
  pero el guion no la presenta como una incógnita difícil.
- **«Detonar»**, el verbo de la tarjeta de s03 y de la lección (`src/data/s3.ts:292`), lo dice antes la voz, en s02
  («la detonas en casa»), y s03 lo explica («detonar y mirar qué hace»).
- **Duración con dos mensajes.** Cada uno suma unos 4–5 s. Con más de ~555 palabras, el estimado pasa de 255 s. Orden de
  recorte: primero la frase del C2 de repuesto (s04); solo al final la de la fecha de compilación (s05), porque la regla
  3 del cierre la nombra.
- **La pantalla del servicio público** es genérica: no puede parecerse a la de VirusTotal, aunque la lección lo nombre.

### Lo que recibe el registro de canon al aprobarse

- En §7, un bloque de V15 con su «Canon nuevo»: búsqueda sin resultados en un servicio, sandbox interno, el pipe en dos
  ejecuciones (solo en pantalla), el C2 de repuesto fuera de la alerta de E7, los dos mensajes y las imágenes (ropa =
  hash; la etiqueta del taller = ruta del PDB, común con V13 y V14).
- En §5, punto 2: que V15 enseña el informe sin la línea del firmante, así que la contradicción sigue abierta y nadie la
  ha puesto en pantalla.
- En la cronología, nada: V15 no fecha nada.
- De paso: las referencias a `src/data/s4.ts` del registro están desfasadas en +7 líneas desde V9 (tabla completa en
  `revision-gcti.md`, «Entre fichas», punto 6); por ejemplo, el intrusion set STIX está en `:1023-1025`, no en
  `:1016` y `:1018`.

### Preguntas para Lidia

- **¿Quieres que s3m2 cuente la evasión del sandbox?** (una muestra que nota que está en una máquina de análisis y no
  hace nada; lo estático la lee igual). Hoy no está en la lección y la pregunta de nivelación pl-s3q3 sí la pregunta.
  **Recomendado: no por ahora**, y V15 sigue sin ella. Si dices que sí, primero va una frase a la lección (después del
  párrafo de `:292`) y el vídeo puede añadir una línea en s03 sin cambiar escenas ni tarjetas.
- **¿Corregimos el import del informe?** `MapViewOfSection` (`src/data/s3.ts:333`) no es una función que exporte
  Windows en modo usuario; las reales son `NtMapViewOfSection` (ntdll) o `MapViewOfFile` (kernel32). **Recomendado:
  sí**, en el PR de V15, pasar a `NtMapViewOfSection, CreateNamedPipeA, CreateProcessA`, y el vídeo lo enseña igual. Es
  solo texto, y la regla YARA de S5 (`$api = "MapViewOfSection"`, `src/data/s5.ts:507`) sigue funcionando, porque la
  cadena está dentro de `NtMapViewOfSection`. Si prefieres no tocar la lección, el vídeo copia la línea tal cual.

## V16 · sp3m4 · «Zonas de seguridad: dónde va cada cosa y qué pasa si falla» · decisiones para aprobar en una ronda

1. **Historia: «el plano de la servilleta».** El lunes 16-11 el puerto rehace el plano de su red y lo dibujas tú; el
   viernes 20-11 el comité de cambios lo aprueba. No hay ataque: cada escena es una decisión de diseño y BLIND ARCHITECT
   propone el atajo. Es la misión 3 del curso («rediseña la segmentación», `src/data/secplus/labs-sp3.ts:20-22`) y lo que
   anuncia la propia lección (`sp3-part2.ts:316`). Comparte arco con V17, que lo continúa con una frase. Descartado:
   - Contarlo como respuesta al caso de septiembre («con zonas, la atacante no habría saltado de equipo en equipo»):
     tocaría `IR-2026-0147`, que no se toca, y prometería algo que ninguna fuente dice (no consta cómo llegó el documento
     a los otros dos equipos; la salida de los 38 GB solo queda explicada como deducción para el registro, decisión 6).
   - Partir de la noche del portal (V10, 21-10): también es canon cerrado, y el vídeo se vería como su secuela.
2. **Cómo era la red antes: cuatro VLAN con nombre (Oficinas, Administración, Producción y Pruebas) que el router central
   deja hablar entre sí; Operaciones detrás del cortafuegos interno; el portal público dentro de Oficinas.** Es la «red
   plana» de la lección y del jefe (`sections.ts:85`) contada de forma que encaje con lo que V1 y el SIEM ya enseñan: el
   cortafuegos interno de V1 («Cortafuegos · Zona Operaciones», con reglas también para Contratistas y para el SSH de
   Administración, `S05Rules.tsx:20-26`, `:88`) es, deducido, el `fw-int01` del SIEM (`s03-normalize.ts:66-88`); y están
   también la VLAN de producción, `fw-perimetro-01` y `rt-core`. No dice que Operaciones sea lo único filtrado, solo que
   entre esas cuatro VLAN nadie decide, que es lo que necesita el concepto. Encaja además con la q6 de la lección (la web
   pública y los puestos de aduanas en una misma VLAN, `sp3-part2.ts:564`): solo sobran los PLC. Descartado: la frase
   literal de la lección, «la web pública, la ofimática de aduanas y los PLC de las esclusas cuelgan hoy del mismo
   conmutador» (`sp3-part2.ts:316`, igual en la misión, `labs-sp3.ts:21`):
   - contradice las pantallas de V1 y del SIEM, que ya enseñan cortafuegos y VLAN;
   - choca con sp3m2, donde los PLC de las esclusas están air-gapped (`sp3-part1.ts:394`; registro §5, punto 13);
   - y dibujar los PLC alcanzables es medio dosier del jefe (`sections.ts:87`).

   Por eso el vídeo no dibuja cómo está conectada hoy la OT: el plano de antes no tiene caja de OT y el plan nuevo la
   pinta como zona.
3. **Cinco conceptos:** zonas (con la superficie de ataque), la DMZ, el jump server, los modos de fallo (con las puertas
   fail-safe y fail-secure) e inline/tap con active/passive. Inline y passive tienen su escena aunque V1 ya lo cuente con
   el IDS, porque quien siga el curso en orden ve V16 antes que V1, y la nota de examen de la lección lo llama «la trampa
   más repetida del 3.2» (`sp3-part2.ts:389`); además lo preguntan q3, q4 y q8. Se quedan en la lección los proxies, el
   balanceador y el catálogo de sensores. Descartado:
   - El reverse proxy como sexto concepto: es uno de los doce sistemas del laboratorio y el vídeo pasaría de seis.
   - Los cuatro atajos de conectividad de la lección (`:321`): el cable de un contratista, el punto de acceso que llega
     al aparcamiento, el módem 4G de un integrador y el túnel sin MFA. Tres rozan a los contratistas y el final de sp5
     («un contratista con acceso perpetuo»), y el cuarto, la MFA del 30-11.
4. **BLIND ARCHITECT: el arquitecto con prisa.** Tres mensajes, uno por capítulo, cada uno un atajo de diseño con un
   error concreto (la VLAN como zona, el portal dentro, dejar pasar siempre), y una firma fija, como el «Confía en mí» de
   RED MARROW: **«Menos es más.»**, el lema del arquitecto minimalista, que aquí suena a quitar paredes. Descartado:
   - Copiar la provocación de SILENT PAGER (la noche, el SOC que duerme) o el amigo que da consejos de RED MARROW.
   - «Un punto único de fallo» o «un pilar» en su boca: el pilar es del anuncio del jefe y la narradora lo usa una vez
     para presentar a BLIND ARCHITECT; el punto único de fallo es del dosier, que no se destripa.
   - Cualquier atajo de cifrado, claves o certificados: es el terreno de NULL CIPHER (sp1), que otra ficha diseña ahora.
5. **Dónde va y qué viene después.** Al final de la lección, entre el último check (el del puerto espejo, `:464-478`) y el
   párrafo que salta a sp3m5 (`:479-482`), con una línea de entrada; y la tarea final es el laboratorio Zone Defense, la
   misma misión que cuenta el vídeo. El vídeo enseña la regla y el laboratorio la practica con doce sistemas: nueve que
   el vídeo no toca y tres (el portal como web pública, el jump server y las interfaces de gestión) que ya da la tabla de
   la lección. Descartado:
   - Ponerlo tras la tabla de zonas, a mitad de lección: enseñaría los modos de fallo y el inline antes que la lección.
   - Las preguntas de la lección como tarea: el vídeo ya toca seis de las ocho, y el laboratorio es la práctica que falta.
6. **El plano de antes explica el hueco de los 38 GB, y se acepta** (lo pide la revisión, punto 4). La regla 3 de V1 vivía
   en el cortafuegos interno, y la VLAN de Producción (la de `srv-tc-app03`) cuelga de `rt-core` y sale por
   `fw-perimetro-01`, que el arreglo de V1 no tocó: quien junte las dos pantallas ve por dónde salieron. No contradice nada
   publicado y es una explicación sensata. Va al registro como «(deducido de V16) la salida de Producción no pasaba por el
   cortafuegos de Operaciones», y **ningún vídeo lo dice en voz ni lo enseña**. Descartado: dejar el hueco abierto, que no
   se puede con un rótulo: el plano necesita `fw-perimetro-01` entre Internet y `rt-core` para la regla 443 del portal (s04)
   y para el alcance de s03, así que habría que rehacer V16 entero. Si Lidia prefiere guardar el hueco para otro vídeo, es
   ese cambio, no uno pequeño.

### Riesgos

- **Dónde estaba el portal es canon nuevo.** Quien vea V10 puede pensar que el traversal del 21-10 leyó un archivo de un
  servidor de la red interna. Es una deducción suya, no algo que diga el vídeo: el guion no nombra la noche del 21-10 ni
  el FINDING #0147, y en voz es «el portal», como en V10.
- **El plano de antes, solo con nombres ya en pantalla** (`fw-perimetro-01`, `rt-core`, Producción, Pruebas, el
  cortafuegos interno de Operaciones) más Oficinas y Administración. Nada de `ADM-WS-*` ni `srv-tc-app03`, ni la caja
  «Contratistas» de V1, ni la VLAN de cuarentena del SIEM. La demo de s03 enciende líneas a cajas, sin contar sistemas. El
  cortafuegos interno se dibuja sin «el único»: V1 y el SIEM (`fw-int01`) enseñan que filtra más que a Operaciones.
- **La regla 5 de V1 es una lectura nuestra.** «Administración entra en gestión por SSH desde cada puesto» sale de un
  ALLOW que cruza el cortafuegos interno (`S05Rules.tsx:24`, `:88`); el registro la apunta como deducida. En pantalla, la
  etiqueta de s01 dice «entre estas VLAN: el router no filtra» y s05 «desde cada puesto», no «directo», para que no
  parezcan contradecir esa regla.
- **El hueco de los 38 GB.** Queda explicado en el registro (decisión 6), pero el guion no puede decirlo ni insinuarlo, y
  ninguna escena junta Producción con la salida de septiembre.
- **Las imágenes, cada una en su sitio.** La ventanilla de la DMZ tiene bandeja y alguien que mira (no está aislada: eso
  sería el air gap de sp3m2). El jump server es la puerta de la sala de mandos de la red, nunca «la sala de control», que
  en Halden es la de Operaciones, la del muelle 3 (la OT es otra zona); las puertas de s08, en el edificio de oficinas.
- **La OT, sin conexión dibujada.** Ninguna línea de una VLAN a la OT, y el equipo de las bombas va «en la red de las
  bombas». La voz no dice que la OT sea plana ni que esté aislada.
- **Exactitud de la VLAN.** Una VLAN aparta el tráfico sobre la misma red física (no separa cables, `sp3-part1.ts:283`);
  lo que no hace es decidir qué cruza de una a otra. El guion dice «sin un control entre ellas, no es una zona», nunca
  «una VLAN no separa nada».
- **La tarjeta de las puertas.** «Fail-safe abre por la gente; fail-secure, por el activo» se leía «fail-secure abre por
  el activo» (la coma sobreentiende el verbo). Pasa a «Sin luz: fail-safe abre por la gente; fail-secure cierra»; el
  motivo, en el rótulo de s08. El guion tampoco puede elidir el verbo así.
- **Dos barreras que no se pueden confundir.** En s02 la garita está vacía porque nadie la puso (no hay control); en s06 la
  barrera se queda arriba porque se fue la luz (un modo de fallo). El revisor de exactitud tiene que comprobar que el
  guion no llame «fail-open» a la garita vacía.
- **Fail-closed en gestión.** «La operación no se para» es cierto porque el tráfico del puerto no pasa por ese
  cortafuegos; lo que se para es la administración. El guion no puede decir «no pasa nada», ni el rótulo de s06 (por eso
  dice «no pasa ni un camión»).
- **«Fail-secure» tiene dos usos en la lección:** sinónimo de fail-closed (`:383`) y la puerta que se bloquea. En pantalla
  van separados (s06, «también: fail-secure» en pequeño; s08, la puerta).
- **«Menos es más.» tres veces.** Es la firma, como «Confía en mí»; el revisor de naturalidad debe vigilar que las
  respuestas de la narradora no repitan también una fórmula.
- **La MFA del jump server.** Sale como requisito del diseño; nada en marcha antes del 1-12. Si se adelanta la fecha de
  las fases, hay que mirar el 30-11.
- **El orden del curso.** Quien vea V16 no ha visto todavía ningún vídeo de sp4: nada de «como ya viste», y la cámara de
  s09 se explica entera aunque V1 la use.
- **Duración.** Diez escenas y 472 s de suma; si el estimado pasa de 590 s, se recorta s08 y luego s03.

### Pregunta para Lidia: la voz de BLIND ARCHITECT, y con ella su género

El texto del vídeo no marca el género («Es BLIND ARCHITECT»), pero **los datos del curso ya lo hacen**: el dosier del jefe
dice «BLIND ARCHITECT derrotada» (`src/data/secplus/sections.ts:87`), como el de sp4 hace «ella» a SILENT PAGER. Las voces
instaladas son Helena, Laura y Pablo; Pablo lo usan SILENT PAGER, GLASS VIPER y HOLLOW LANTERN (`machine`), y Laura,
PAPER CRANE (`machine`) y RED MARROW (`telefono`). Helena no la usa nadie y encaja con «derrotada».

- **Recomendada: `sapi/Microsoft Helena` con un efecto nuevo, `megafonia`.** Sonaría como un aviso por los altavoces de
  una nave vacía: banda de altavoz de bocina (unos 250–5000 Hz, con un realce hacia 2 kHz), una reverberación corta de
  hormigón (cola de ~1 s y un eco temprano a ~90 ms), sin cambio de tono, determinista como `telefono`. Es un efecto de
  ~15 líneas en `video/engine/scripts/adversary_fx.py` más su prueba. Por qué un tercer efecto: con tres voces y dos
  efectos, los adversarios de Security+ se quedan sin combinaciones distintas en cuanto NULL CIPHER (que se diseña ahora
  en paralelo) elija la suya. Con esta voz, BLIND ARCHITECT se oye como mujer; el registro anota que el dosier ya lo
  escribe en femenino y qué voz lleva, y el texto de los vídeos sigue sin marcarlo. Lo que queda para ti es si la voz
  cuenta como canon.
- **Descartado: Helena con `machine`.** Es la voz de reserva de NULL CIPHER en V11 (Helena con `cifrado`, o con
  `machine` si ese efecto no llega a tiempo). Si BLIND ARCHITECT la usara también, los dos adversarios de Security+ que se
  estrenan en esta tanda sonarían iguales. Por eso `megafonia` lleva además `"rate": -2`, más pausado que NULL CIPHER, y
  el efecto trabaja otro eje: el espacio (altavoz y nave) frente al de NULL CIPHER, que es la señal (ver la ficha de V11).
- Si lo prefieres «él», sería Pablo con un efecto nuevo, y contradiría el «derrotada» del dosier (habría que cambiarlo en
  `sections.ts:87`).

**Coordinado con V11 (2026-10-05):** NULL CIPHER también usa Helena (`rate` 0, efecto `cifrado`), porque el curso escribe
a las dos en femenino («NULL CIPHER neutralizada», `sections.ts:49`). La pregunta del género es una sola para las dos, y
está en V11.

### Propuesta aparte (opcional; la lección no se toca desde la ficha): la OT de sp3m2

Para cerrar el punto 13 del registro con una palabra: en `src/data/secplus/sp3-part1.ts:394`, «Los **PLC de las esclusas**
están **air-gapped**» pasaría a «Los **sistemas de control de las grúas** están **air-gapped**», que es lo que ya dice el
check de esa misma lección (`:288`). Así las esclusas quedan como las cuentan sp3m4 (`sp3-part2.ts:316`), su check de las
bombas (`:394`), la q6 (`:564`), el anuncio del jefe y su dosier: en red. Es solo texto, no cambia ningún id ni ningún
test. V16 no depende de ello: tal como está, el vídeo no dibuja cómo está conectada la OT.

Hereda otro roce, que el registro debe apuntar aunque se haga el cambio: la red aislada pasaría a ser la de las grúas, y
la lección ya tiene un servidor de control de grúas que lleva catorce meses hablando con un dominio de fuera
(`sp2-part1.ts:147`) y tabletas de las grúas en la wifi (`sp4-part1.ts:384`). Sigue siendo la opción más barata: esos
dos pueden leerse como sistemas de apoyo de las grúas, no su control.

## V17 · sp3m5 · «Por dónde se entra: 802.1X, VPN e IPSec» · decisiones para aprobar en una ronda

1. **Historia: sigue a V16 una semana después, con una frase de puente.** Las zonas ya están en el plano; V17 revisa lo que
   llega a ellas desde fuera de la valla: un cable, otra sede y una persona lejos (23–27-11). Es el mismo salto que da la
   lección al acabar sp3m4 («queda elegir qué tecnología pones en cada frontera… 802.1X… VPN», `sp3-part2.ts:481`), así que
   los dos vídeos se leen como un arco sin depender el uno del otro. Descartado: una historia aparte, que pediría otro
   motivo para revisar la red y repetiría el «por qué ahora» de V16.
2. **Cinco conceptos:** 802.1X (con EAP), site-to-site frente a remote access, IPSec por dentro (AH y ESP, transporte y
   túnel), TLS para el acceso remoto y túnel completo frente a dividido. Son los de la fila del ranking («802.1X, VPN,
   IPSec AH/ESP») más las dos decisiones que la nota de examen da como pistas fijas (el hotel y «todo debe pasar por
   nuestra inspección», `sp3-part3.ts:219`). Se quedan en la lección los cortafuegos (WAF, UTM, NGFW, capa 4 frente a
   capa 7) y SD-WAN con SASE. Descartado: meter el WAF delante del portal, que sería la secuela natural de la DMZ de V16 y
   tiene su check y su pregunta, porque el vídeo pasaría a seis conceptos y los cortafuegos seguirían a medias. **Queda
   como candidata para el backlog:** una cápsula «¿Qué control encaja?» con la tabla de cortafuegos de la lección
   (`:24-53`) y el portal ya en la DMZ.
3. **Tres escenas de trabajo, sin incidentes, con piezas que ya existen:**
   - La toma: una prueba de la propia analista con `ptl-pruebas-02`, no un visitante ni un contratista. Descartado el
     visitante el día de una licitación, que es el check de la lección (`:109`), y cualquier portátil de contratista, que
     es el del NAC de V1 y debe seguir neutro.
   - El túnel entre la sede y la terminal de contenedores ya existe y se revisa: es canon nuevo que encaja con el SIEM,
     donde todo cae en la misma red interna, y con la q7, que no tiene fecha. No se deduce de ninguna pantalla dónde
     está cada servidor. Descartado montar una sede nueva, que inventaría un sitio cuando la pareja de la lección está justo al lado del
     vídeo (`:124`, `:184-186`).
   - La VPN de acceso remoto va sobre TLS, como dice CHG-2041 («VPN SSL», `sp1-part3.ts:74`), y era de túnel dividido.
     Descartada la técnica de mantenimiento en un hotel de la lección (`:124`): sería un proveedor con credenciales de
     la VPN, que es el contratista de spl2a (`labs-sp2.ts:100`) y roza el dosier de RED MARROW («su malware llegaba por
     un proveedor de mantenimiento», `sections.ts:68`). En el hotel está «alguien del puerto de viaje».
4. **BLIND ARCHITECT, tres atajos de diseño:** dejar las tomas abiertas (quien está dentro es de casa), unir las sedes en
   modo transporte (menos cabeceras) y túnel dividido para todos (va más rápido); siempre con «Menos es más.». Descartado:
   un mensaje sobre AH («ya va protegido, ¿para qué cifrar?»), porque eso es un atajo de cifrado y es el terreno de NULL
   CIPHER; AH y ESP se explican sin mensaje.
5. **Dónde va y qué se hace después:** antes de la nota de examen, con una línea de entrada, como V6 en sp4m8; la nota lo
   remata y además cubre lo que el vídeo deja fuera. La tarea final son las 8 preguntas, porque ningún laboratorio de sp3
   toca 802.1X ni las VPN. Descartado: al final de la lección, detrás del párrafo que salta a sp3m6, donde el vídeo
   llegaría después de la nota que lo resume.

### Riesgos

- **El NAC de V1.** V1 enseña un NAC que manda el portátil de un contratista a una VLAN de cuarentena
  (`video/capas-halden/src/scenes/S10Data.tsx:268-281`). El guion no puede decir que el puerto no tuviera control de acceso
  a la red: solo que **esta toma** no preguntaba. Y la VLAN de cuarentena de s04 es la idea de la lección, sin contratista.
- **El túnel ya existía.** Nada de «hoy unimos la sede y la terminal»: se revisa. La q7 de la lección pide que las dos
  redes funcionen como una sola (`sp3-part3.ts:316`), sin fecha, y el SIEM enseña todo dentro de `10.20.0.0/16`: no es
  una contradicción, es lo que se ve con un túnel ya hecho. Pero ninguna pantalla pone `srv-tc-app03` en la terminal (su
  rótulo, «terminal de contenedores», puede ser a quién sirve), y V16 cuelga Producción del router de la sede: el guion
  no dice dónde está ningún servidor, ni desde cuándo ni por qué están unidas las dos redes, ni se acerca al caso de
  septiembre.
- **802.1X y el túnel completo, desde el 1-12.** s04 lleva fija la etiqueta «con 802.1X · así será desde el 1-12», y el
  reject es «en una toma con 802.1X», no en la de la prueba. El guion habla de ellos en futuro o como regla, nunca como
  algo que ya funciona el 23-11.
- **La VPN, sin entrada ni nombre.** Ni factores, ni MFA, ni el 30-11, ni `vpn.puerto-halden.example`. «Hasta el plan era
  de túnel dividido» es canon nuevo: el guion no puede insinuar que por ahí se escapara nada.
- **Exactitud de IPSec.** AH es «integridad y autenticación del origen», nunca «firma» ni «cifra a medias»; ESP también da
  integridad, así que la tarjeta dice «añade confidencialidad», no «solo cifra». ESP como protocolo 50 es correcto,
  aunque la lección no da el número (la q5 dice «its own IP protocol numbers», `sp3-part3.ts:295`): solo en pantalla. IKE
  por UDP 500 y 4500 sí está en la q5. **NAT:** la razón del hotel es la red que solo deja salir web, y por un proxy
  (`:286`, `:295`), nunca «IPSec no cruza un NAT», que es falso (ESP lo cruza encapsulado en UDP 4500); que AH no
  sobreviva a un NAT no está en la lección y no se cuenta. El modo transporte es «de equipo a equipo»: el
  guion no debe decir que esté prohibido entre sedes, sino que entre dos pasarelas que protegen lo que tienen detrás hace
  falta el modo túnel, que lleva dentro el paquete entero.
- **TLS y SSL.** En pantalla y en voz, «TLS»; el ticket CHG-2041 dice «VPN SSL» porque es el nombre de siempre. Si el guion
  lo menciona, lo aclara en media frase.
- **Las imágenes.** El pasillo (site-to-site) y «un pie a cada lado» (túnel dividido) no pueden cruzarse: la lección llama
  «puente» al portátil del túnel dividido, y por eso el concepto 2 no usa un puente. El pasillo cruza la calle, porque la
  VPN existe para atravesar una red que no es tuya. La imagen de 802.1X es el control de la puerta del recinto, la
  entrada, y no la garita de V16: allí la garita es el control entre zonas (s02) y la barrera que se cae sin luz (s06),
  y 802.1X está en la entrada, no entre zonas.
- **La IP de la prueba** (`10.20.6.140`) es deducida: la subred de `a.soto` en el SIEM. Solo en pantalla, como salida de
  la consola; «VLAN Oficinas» va aparte, como nota de la analista, porque un portátil no ve su VLAN.
- **«Menos es más.»** otra vez tres veces: mismo aviso que en V16, y en s07 («…menos cabeceras. Menos es más.») el
  revisor de naturalidad debe mirar que no suene a eco.
- **La frase de puente** dice «aprobó dividir», no «dividió»: el plan va por fases desde el 1-12. Tiene 16 palabras, para
  que el título entre antes de los 12 s.
- **Duración.** 476 s de suma; si el estimado pasa de 590 s, se recorta s06 y luego s04.

### Pregunta para Lidia

Ninguna nueva: la voz de BLIND ARCHITECT se decide en V16 y V17 la hereda.


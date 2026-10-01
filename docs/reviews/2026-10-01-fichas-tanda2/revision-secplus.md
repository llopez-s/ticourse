# Revisión de exactitud y canon · V6 (sp4m8) y V10 (sp2m7)

> Revisión de la primera versión de las fichas. Sus arreglos ya están aplicados en el plan; se guarda por las citas
> (ruta:línea) que necesitará el revisor de exactitud del guion.

Revisión de solo lectura del 2026-10-01. Fuentes: `brief-comun.md`, `docs/superpowers/canon/glass-harbor.md` (el
«registro»), las fichas V5 y V5b del plan, las dos fichas con sus decisiones, las lecciones `sp4-part4.ts` y
`sp2-part4.ts`, los laboratorios de sp2 y sp4, `sections.ts` y los datos en pantalla de SIEM, V1 y V5. Rutas relativas a
la raíz del repo (`sp/` = `src/data/secplus/`, `siem/` = `video/siem/`, `v1/` = `video/capas-halden/`,
`v5/` = `video/ir-halden/`). Los límites numéricos no se repiten (ya los comprobó el script), salvo una cosa rara en V10.

Gravedad: **bloquea** (hay que resolverlo antes de aprobar) · **conviene** (error de exactitud o de canon con arreglo
barato) · **menor** (pulido).

**Hay un solo bloqueante, y es entre fichas: el segundo factor en el proveedor de identidad de Halden** (ver «Entre
fichas», punto 1). Afecta a V6 s04 y a V10 s03 y a su canon nuevo.

---

## V6 · sp4m8 · «Identidad y acceso: quién entra y hasta dónde»

1. **Bloquea** · s04, concepto 2, «Se queda fuera», «No se toca» y decisión 1. El IdP de Halden pide segundo factor en
   una escena que termina el 23-10, y V10 lo enseña el 21-10 aceptando solo la contraseña. Análisis y arreglo en
   «Entre fichas», punto 1. Aquí cede V6.

2. **Conviene** · s09, barra de comparación («septiembre: sirvió hasta que se cambió a mano · 4-9 · 10:30» frente a
   «ahora: hasta la siguiente rotación»). La credencial salió antes de las 16:11 del 3-9 (`v1/narration.json:361`,
   registro línea 41) y se cambió a las 10:30 del 4-9 (`v5/src/data/s05-order.ts:55-65`, registro línea 61), así que
   aguantó unas 18 h. Con rotación cada 24 h, «hasta la siguiente rotación» puede durar hasta 24 h. Comparadas así, la
   bóveda no acorta nada, y quien haga la cuenta lo verá. La diferencia real es otra: en septiembre la contraseña cambió
   porque alguien descubrió el incidente, y sin eso habría seguido valiendo meses. Con la bóveda, dura 24 h como mucho,
   se entere alguien o no.
   Arreglo: «septiembre: hasta que alguien se diera cuenta» (45) frente a «ahora: 24 h como mucho, aunque nadie se dé
   cuenta» (49), con «4-9 · 10:30» en pequeño bajo la primera. En «Canon nuevo» y en Riesgos, «la bóveda acorta esa
   ventana» pasa a «la bóveda le pone un límite».

3. **Menor** · s08, tarjeta «MFA fatigue: llave FIDO2, no códigos por SMS» y pregunta «¿Códigos SMS o llave FIDO2?».
   La comparación es la de sp4m8q5 (`sp/sp4-part4.ts:535-544`), así que la pregunta es buena y la respuesta de la ficha
   («el SMS solo cambia la técnica») es exacta. El problema es la tarjeta sola: da a entender que el SMS falla *contra
   la fatiga*, y no es así. Con SMS no llegan avisos que aprobar. Lo que trae es SIM swapping y phishing (`:447`,
   `:544`).
   Arreglo: «MFA fatigue: llave FIDO2; el SMS solo cambia el ataque» (54).

4. **Menor** · s08, «la web parecida (`haldenp0rt.example`): la llave no se enciende». Una llave FIDO2 suele parpadear ante
   cualquier petición del navegador. Lo que no hace es firmar para un origen que no es el suyo («vinculada al origen del
   sitio», `sp/sp4-part4.ts:447`).
   Arreglo: «la llave no firma» (y en la voz, «no firma para esa web»).

5. **Menor** · s10, reloj de 24 h «administrador del dominio · fijo» antes del mensaje. sp4m8q7 (`sp/sp4-part4.ts:565`)
   y la propia s09 («administradores del dominio · ya estaban» en la bóveda) dicen que en Halden los administradores del
   dominio ya se prestan por ventana. Si el reloj abre la escena como si fuera el estado del puerto, contradice las dos
   cosas.
   Arreglo: primero el mensaje de SILENT PAGER y después el reloj, rotulado «lo que propone» o «sin JIT».

6. **Menor** · s03 y s04, `o.virta`. Es práctico, y la lección presenta a los prácticos como gente que «solo entra a un
   sistema» (`sp/sp4-part4.ts:332`). Aun así, el remate de s04 le da acceso a la plataforma aduanera del socio.
   Arreglo (una de dos): darle un puesto que use aduanas, por ejemplo «Importación» (el *import desk* de
   `sp/labs-sp2.ts:146`), o dejarlo como práctico y que el remate diga solo «el IdP ya no firma pases para esa cuenta»,
   sin enseñar la plataforma aduanera.

7. **Menor** · s08, `haldenp0rt.example`. Encaja con V1, que pone «Tu dominio `haldenport.example`» y «Dominio parecido
   `haldenp0rt.example`» (`v1/src/scenes/S11Limits.tsx:137`, `:149`), y no añade un cuarto dominio público. Pero si la
   llave «solo firma para la web de verdad» y la trampa es `haldenp0rt`, se entiende que el IdP vive bajo
   `haldenport.example` (el de V1) y no bajo `puerto-halden.example` (el del SIEM, `siem/src/data/s08-triage.ts:13`,
   `:15`). Es tomar partido en el registro §5.2 (líneas 197-199).
   Arreglo: mantenerlo, no enseñar nunca el host real del IdP (la ficha ya lo evita) y anotar en §5.2 que V6 sigue a V1.

Preguntas del encargo sin hallazgo: días de la semana (19-10 lunes, 23-10 viernes, 27-10 martes, 28-10 miércoles);
`c.navarro` y `o.virta` no existen en el repo; R. Salas encaja (en el SIEM aprobó una exclusión estrecha, documentada y
con revisión, `siem/src/data/s07-tuning.ts:53-58`) y L. Ferrer es dueño de cambios de Infraestructura
(`sp/sp1-part3.ts:71`). La deducción del 4672 (`siem/src/data/s09-pivot.ts:40-41`) se sostiene, y además cuadra con que
en esa misma sesión se creara la tarea programada de las 01:58 (registro línea 50), que exige privilegio. JML, SAML,
OAuth/OIDC, LDAP, tipos de factor y PAM son exactos contra `sp/sp4-part4.ts:340`, `:360` y `:447`. Los laboratorios de
sp4 no se solapan con la ficha. Los mensajes de SILENT PAGER encajan con su voz publicada y cada uno trae su error.

---

## V10 · sp2m7 · «Ataques en los logs: spraying, traversal y amplificación DNS»

1. **Bloquea** · s03 y «Canon nuevo» (revisión de la mañana). Hay dos problemas. El primero: el sistema en el que entra
   `r.haugen` («proveedor de identidad») choca con el IdP de V6, que pide segundo factor. El segundo: la MFA se queda en
   «propuesta» sin responsable ni fecha. Análisis y arreglo en «Entre fichas», punto 1.

2. **Conviene** · mensaje de s03, corrección de la narradora: «Lo arreglan la lista de contraseñas prohibidas y, sobre
   todo, MFA; una política más larga, no». La nota de examen de sp2m7 dice «MFA, no una política de contraseñas más
   larga» (`sp/sp2-part4.ts:119`), pero en el sentido de cuál es la medida *más eficaz*. sp4m8 enseña que la longitud
   pesa más que la complejidad (`sp/sp4-part4.ts:447`; respuesta de q6, `:552`). Dicho en el vídeo, «más larga, no»
   contradice sp4m8. Lo que falla en s03 es la complejidad: son las tres casillas verdes junto a `Halden2026!`.
   Arreglo: «…y, sobre todo, MFA; más reglas de complejidad, no».

3. **Conviene** · s04, el `403 0` de la segunda línea (`sp/sp2-part4.ts:62`). En pantalla, la petición con `../` en texto
   se sirve (200, 1834) y la que va en clave se rechaza. El mensaje y su corrección dicen justo lo contrario: que la
   versión en clave se cuela por un filtro de texto. Si nadie explica el 403, la pantalla parece desmentir a la narradora,
   como si hubiera un filtro que para la clave. Además, el portal no tiene nada delante («sin WAF delante»,
   `sp/sp4-part3.ts:57`).
   Arreglo: junto al `403 0`, la nota «403: el servidor no puede leer shadow · no es un filtro» (55), con `shadow` en
   monoespaciada. En la voz, una frase: «La segunda la frenó el propio sistema: ese archivo solo lo lee el
   administrador. Ningún filtro la vio».

4. **Conviene** · canon nuevo y s02–s04, IP `185.22.9.41`. No es una IP de documentación (RFC 5737) y es espacio público
   asignable. En un vídeo publicado quedaría como atacante, y las decisiones ya lo ven. Propuesta: **`192.0.2.157`**, en la
   lección y en el vídeo. No se usa en ningún archivo del repo; las documentales ocupadas son `192.0.2.10/.18/.41`,
   `198.51.100.7/.23/.63/.84/.90` y `203.0.113.10/.24/.27/.47/.77/.90`. Por qué ese /24:
   - `203.0.113.0/24` no: tiene las dos IP de SILENT PAGER (registro líneas 132-133). Una IP de RED MARROW ahí tocaría
     el hueco «misma infraestructura» (línea 226) y la pista del ASN (`sp/sections.ts:106`), es decir, «GH es una sola
     operación».
   - `198.51.100.0/24` tampoco: tiene `198.51.100.23`, el destino externo sin explicar de `srv-tc-app01`/`svc_edi`
     (`siem/src/data/s04-enrich.ts:15-17`, «país sin relación con el puerto»), y el registro lo quiere neutro.
   - En `192.0.2.0/24`, lo único de Halden es `192.0.2.10`, un escaneo bloqueado en la cola tranquila
     (`siem/src/data/s08-triage.ts:16`): ruido de Internet que nadie atribuye. `.18` y `.41` son de GCTI
     (`video/pivot-infra/src/scenes/S03Pdns.tsx:23-25`).

   Además, para que «nadie lo firma» se sostenga, los cuatro resolvers de s05 no deben compartir /24 con el atacante.
   Arreglo: `198.51.100.61`, `198.51.100.140`, `198.51.100.203` y `198.51.100.212`, todas libres.

5. **Conviene** · s01, la promesa. La escena enciende tres filas, una por frase, y solo después llegan el título y los
   chips. Con una frase de entrada y tres filas a 2,7 palabras/s, el título cae hacia los 14-16 s, fuera de los 8-12 s del
   brief (`brief-comun.md:50`).
   Arreglo: primero una frase sobre la cola entera («Tres rastros de esta noche…»), el título y los tres chips. Las filas
   se encienden después, o las tres se leen en una sola frase.

6. **Menor** · Duración. La suma de `targetSec` no predice el renderizado, y el error no va siempre hacia el mismo
   lado. V5 sumaba 562 s y se renderizó en 14968 fotogramas, 499 s (`v5/src/timeline.json:7`): 0,89 veces la suma. V4
   (`video/pivot-infra/`) sumaba 400 s y salió de 8:08, 488 s: 1,22 veces. Con 220 s y un suelo de 190, una cápsula
   puede acabar por debajo. La contingencia de las decisiones («si pasa de 255 s, se recorta s05») solo mira el techo.
   Arreglo: medir el primer borrador por los dos lados y, si se acerca a 190, alargar s02 o s05, que son las escenas de
   leer registros.

7. **Menor** · Inserción, justo después del check de las 900 cuentas (`sp/sp2-part4.ts:124`). Ese check cuenta una
   noche casi igual: proveedor de identidad, una IP, `Halden2026!`, ningún bloqueo. Pero son 900 cuentas, sin acierto, y
   da a entender que el registro muestra la contraseña. El vídeo enseña 180 cuentas y un acierto, y dice que «el registro
   no guarda qué contraseña se probó».
   Arreglo: que la voz no enlace las dos noches, y la nota de s02 pasa a «este registro no guarda qué contraseña se
   probó».

8. **Menor** · Canon, quién miró de noche. Tras V5 (suplentes, `v5/src/data/s09-plan.ts:26`) y V5b (turno de guardia
   del SOC y simulacro del 8-10, plan `:629-636`), un portal caído 25 minutos al amanecer y un acierto de spraying que
   esperan a la revisión de las 08:00 repiten el flavor de SILENT PAGER («las alertas llegan a las 3 a. m. y nadie las
   lee», `sp/sections.ts:104`), que es justo lo que arreglaron V5 y V5b.
   Arreglo: en s05, después de la respuesta a la pregunta para pensar (para no destriparla), una línea en pantalla:
   «guardia · 05:44 · aviso de caída · llamada al proveedor».

9. **Menor** · s03, `LOGOUT user=r.haugen · aplicaciones abiertas: 0`. Validar una credencial y marcharse es lo que hace
   quien la quiere vender, y el dosier de RED MARROW dice «GH compra acceso a través de terceros» (`sp/sections.ts:68`),
   que está en la lista de lo que no se destripa.
   Arreglo: la línea puede quedarse, pero la narradora no especula por qué se fue. Nada de «la guardó», «para después» ni
   «para venderla».

10. **Menor** · Voz del adversario. La ficha dice que el género de RED MARROW no se fija, pero `Microsoft Laura` con un
    filtro de teléfono se oye como mujer, así que la voz lo fija en la práctica. SILENT PAGER, que es «ella», usa Pablo
    con `machine`: en este motor la voz no tiene por qué coincidir con el personaje.
    Arreglo: que Lidia decida si la voz fija el género y lo apunte en el canon nuevo.

**Cambios a la lección que propone V10** (`sp/sp2-part4.ts:65-69`):
- **Fecha `2026-09-04` por `2026-10-21`: la recomiendo.** Separa el spraying del caso de sp4 sin tocar nada publicado:
  el registro lo da como «no está en ningún vídeo» (línea 52). No rompe nada:
  - `src/data/content.test.ts` no fija texto de sp2m7, solo la lista de módulos (`:83`).
  - Ningún otro archivo de `src/` cita `185.22.9.41` ni `r.haugen`.
  - La pregunta de spl4a (`sp/labs-sp4.ts:93`), la tabla de sp4m11 (`sp/sp4-part6.ts:125`) y sp4m11q6 (`:271`) hablan de
    un logon interactivo a las 03:12 «con fallos previos», que es otro patrón (fallos sobre la misma cuenta) y no llevan
    fecha. Con el cambio quedan del todo separados del spraying.

  Hay que tocar el registro: la línea 52 sale de la cronología del incidente (a una fila de octubre o a «Hechos fechados
  de las lecciones»), la 135 (IP y fecha) y la 245 (el hueco se cierra). `dist/` lo regenera el despliegue.
- **IP `185.22.9.41` por `192.0.2.157`: la recomiendo, a la vez y en las cinco líneas.** Las dos del traversal
  (`:61-62`) no llevan IP ni hora, así que no cambian. Las horas y la IP que V10 da al traversal son canon nuevo del
  vídeo; la lección puede seguir sin ellas.

Preguntas del encargo sin hallazgo: 20-10 es martes y 21-10 miércoles. Encaja con V5 (mejoras con plazo hasta el 31-10)
y con V5b (13-10, 15-10, 16-10), como se detalla abajo. Los laboratorios quedan bien esquivados: spl2a
(DDoS hacktivista del portal de ferris, `sp/labs-sp2.ts:90-92`) y spl4a (`sp/labs-sp4.ts:93`). Spraying frente a brute
force y lockout, traversal y canonicalización, reflejado más amplificado y lo que ve NetFlow (esquema 60/3.000 bytes
rotulado como mecanismo) son exactos contra `sp/sp2-part4.ts:31`, `:54`, `:94` y `:119`. RED MARROW sale con el flavor
de `sp/sections.ts:66`, cada mensaje trae su error y nada lo relaciona con otros adversarios. La pregunta para pensar es
una decisión de verdad y el cierre tiene tres reglas y una acción.

---

## Entre fichas

1. **Bloquea · El segundo factor en el proveedor de identidad.**
   - **A qué sistema entra `r.haugen`.** V10 fija el «proveedor de identidad» (s01, s02 y canon nuevo). La lección no lo
     dice: el bloque de código habla de «log de autenticación» (`sp/sp2-part4.ts:64`). «Identity provider» viene del
     check de las 900 cuentas (`:124`).
   - **Qué dice la lección sp4m8 sobre MFA en Halden.** No afirma segundo factor en el IdP: «por eso debe llevar MFA» es
     una norma (`sp/sp4-part4.ts:360`). Lo único sobre Halden es el check de la VPN (`:452`): contraseña y pregunta
     secreta, sin fecha, que es un solo factor.
   - **Qué dice V6.** En s04, «contraseña y segundo factor solo en el carril del IdP», y el concepto 2 dice «ese inicio
     de sesión lleva segundo factor». La escena termina con la cuenta de `o.virta` deshabilitada, del viernes 23-10. O
     sea: el IdP de Halden pide segundo factor dos días después de que V10 lo enseñe solo con contraseña y con la MFA
     como propuesta sin fecha.
   - **La revisión de accesos del 19-10 no choca.** Es attestation de permisos (`:340`, q1 en `:480`), no
     autenticación, y `r.haugen` no sale en ella.
   - **Cede V6.** Todo el concepto 1 de V10 depende de que esa entrada pidiera solo la contraseña: el spraying acierta y
     lo más eficaz es MFA (`sp/sp2-part4.ts:119`). En V6, el segundo factor del carril del IdP es un detalle que no enseña
     nada que no enseñen s07 y s08.
   - **Arreglo en V6:**
     - s04: el carril del IdP enseña solo «contraseña», con el candado «no sale de casa».
     - Concepto 2 y «Se queda fuera»: «…y por eso ese inicio de sesión *debe* llevar segundo factor», como
       `sp/sp4-part4.ts:360`.
     - La regla 2 del cierre ya es una norma y se queda.
     - En «No se toca» y en la decisión 1, «el password spraying del 4-9» pasa a «el del 21-10 (V10)». La precaución de
       no poner relojes a las 03:xx sigue valiendo.
   - **Arreglo en V10:**
     - La MFA deja de ser una propuesta sin dueño. V5 enseña en pantalla que «una mejora sin responsable ni fecha · no
       existe» (`v5/src/data/s09-plan.ts:39-40`). Propuesta: «MFA y lista de contraseñas prohibidas en el proveedor de
       identidad · Sistemas · 30-11» (lunes). La fecha cae después del 28-10 para no meterse en el arco de V6. Lo
       inmediato (contraseña nueva, sesiones cerradas, bloqueo del origen) puede ir sin fecha, porque se hace esa misma
       mañana.
     - El sistema se rotula igual que en V6 («proveedor de identidad», «IdP de Halden»), para que el registro recoja un
       solo sistema.
   - **Opcional:** V6 s08 podría decir que el segundo factor que llegará al puerto es la llave. La demo hipotética se
     convertiría en una decisión de Halden, pero no hace falta.
   - **Descartado:** mover el spraying de V10 a la VPN. Un LOGIN OK solo con contraseña chocaría con el check de `:452`
     (contraseña y pregunta secreta), salvo que ese check se fechara después del 21-10. Y acercaría el spraying a la fila
     «Inicios de sesión fallidos en la VPN» de la mañana del 4-9 (`siem/src/data/s08-triage.ts:13`), justo lo que V10
     quiere separar.
   - **Registro:** anotar en §2 que el 21-10 el proveedor de identidad solo pedía contraseña, con la MFA a cargo de
     Sistemas y fecha 30-11, y que V6 no enseña segundo factor en él.

2. **Menor · La imagen de MFA de V10 frente a lo que enseña V6.** V10 dibuja el segundo cerrojo como «la puerta pide
   además un código del móvil» (concepto 1 y s03). Quien vea después V6 aprende que los códigos por SMS son lo débil y la
   llave lo fuerte (`sp/sp4-part4.ts:447`).
   Arreglo en V10: «la puerta pide además algo que solo tú tienes», dibujado como el móvil o una llave, sin la palabra
   «código».

3. **Sin hallazgo · Encaje de la nueva fecha de V10 con V5 y V5b.** El 21-10 cae después de lo último de V5b (16-10) y
   antes del plazo más largo de V5 (31-10), y no toca ninguna de sus fechas. La caza del 13-10 mira del 13-09 al 13-10,
   así que su «sin rastro» sigue en pie. La regla del 15-10 vigila cuentas de servicio y `r.haugen` es una cuenta de
   persona, así que es normal que no saltara. Lo único que queda por coser es la guardia (V10, hallazgo 8).

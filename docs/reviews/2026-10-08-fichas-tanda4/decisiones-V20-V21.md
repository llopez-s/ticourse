# Fichas V20 y V21 (tanda 4): decisiones para aprobar en una ronda

Fecha: 8 de octubre de 2026. Las fichas completas, listas para pegar en el plan de vídeos (§5), están en esta carpeta:
`ficha-V20.md` (sp1m3, Zero Trust) y `ficha-V21.md` (sp4m2, WPA3). Aquí van las decisiones que cada ficha ya toma, con la
alternativa descartada, los riesgos para quien escriba el guion y para el revisor, los cambios que se proponen (solo
propuestos) y lo que no he podido comprobar. Basta con decir qué cambia; lo que no se diga, queda como está. Rutas relativas
a la raíz del repo; `sp/` = `src/data/secplus/`, `v1/` = `video/capas-halden/`, `reg` = `docs/superpowers/canon/glass-harbor.md`.

Los límites del perfil (tarjetas, pregunta, mensajes, escenas, capítulos, suma de segundos, presupuesto de palabras) los ha
contado un script de Node que lee las propias fichas y toma las constantes del motor (`narration.mjs`, `profiles.mjs`);
no están supuestos. Los días de la semana de cada fecha nueva, también con Node.

| Nº | Lección | Formato | Carpeta | Adversaria y voz | Fechas nuevas de Halden | Suma de `s` |
|---|---|---|---|---|---|---|
| V20 | sp1m3 · Zero Trust | Cápsula | `zero-trust-halden` | NULL CIPHER, Helena `rate` 0 con `cifrado` (la de V11 y V12) | viernes 13-11 (simulación); mejora el viernes 11-12 | 210 s |
| V21 | sp4m2 · WPA3 | Cápsula | `wifi-halden` | SILENT PAGER, Pablo con `machine` (la de V1, V5, V5b y V6) | lunes 14-12, martes 15-12, miércoles 16-12 y martes 22-12 | 210 s |

Las dos son `capsula-yt`, no llevan efecto de voz nuevo, y se graban juntas en una sola sesión (unos 8 minutos de voz): la
de NULL CIPHER y la de SILENT PAGER suenan distinto, y ninguna necesita trabajo de motor.

## Lo que se ha decidido entre las dos

- **Fechas.** V20 cae el viernes **13-11**, entre el último hecho de V12 (jueves 12-11) y el lunes 16-11 de V16. V21 cae del
  **14 al 22-12**, después de todo lo fechado de Halden (V16 y V17 del 16 al 27-11, la MFA del 30-11 y el 1-12 de las fases
  del plan de zonas). Las he cruzado con las fichas de la tanda 4 que ya están escritas: V18 (jueves 1-10, y el rescan del
  5-10) y V19 (jueves 5-11, con una mejora de Desarrollo el **viernes 13-11**) no pisan ninguna. El 13-11 es también la fecha
  de la mejora de V19, de otra área y de otro asunto: dos hechos el mismo día, sin relación. Si se prefiere un día libre,
  V20 puede pasar al miércoles 18-11 sin cambiar nada más, pero cae dentro de la semana en que V16 dibuja el plano.
- **Orden del curso.** sp1m3 va antes que sp1m6 y sp1m7, y sp4m2 antes que el SIEM y V1. Quien sigue el curso en orden ve
  **V20 como lo primero de Halden en sp1** (antes que V11) y **V21 como lo primero de SILENT PAGER** (antes que V1, el SIEM y
  V5): las dos fichas presentan el puerto y a su adversaria desde cero, con la fórmula de V11 y de V1, y no remiten a
  ningún vídeo ni al caso de septiembre. El registro dice hoy que V11 es «el primer vídeo de Halden» para sp1 (`reg` §1, notas
  de V11); al cerrar V20 hay que corregirlo (ver «Cambios propuestos»).
- **Imágenes sin choques.** Ninguna de las dos usa la valla, la garita, la ventanilla, la puerta del recinto, la aduana, el
  hotel, la sala de mandos, las llaves y las puertas (V10, V12, V16, V17) ni el pase y la tarjeta (V6). V20 es un almacén del
  puerto con tres personas; V21, un foco, un candado de combinación y el carné de cada uno.
- **Nada de lo que fijan es incidente.** V20 es un diseño y una simulación; V21, una auditoría con una prueba de laboratorio.
  Ninguno dice que Zero Trust, el segundo factor, el EDR ni WPA3 habrían frenado nada de septiembre (`reg` §5, notas de V6).

## V20 · sp1m3 · «Zero Trust: quién decide, quién comunica y quién aplica» · decisiones

1. **Registro y fecha: diseño y simulación el 13-11, no un piloto en marcha en diciembre.** Seguridad ha escrito una
   política por petición para el ERP y la analista la prueba en un simulador: nada funciona y el ERP no se toca, como el
   «plan» de V16. Todo lo que el motor hace va en condicional («decidiría», «pediría»). Descartado:
   - **Diciembre, con un punto de aplicación en marcha delante del ERP.** El adaptive identity de verdad necesita un
     segundo factor, y el registro deja la MFA del proveedor de identidad (30-11, V10) para un vídeo posterior que la
     enseñe («uno posterior no la da por hecha sin enseñarla», `reg` §5, notas de V10). Habría que fechar esa MFA como
     cumplida, inventar qué pieza del plan de zonas se enciende primero y dar nombre de equipo al PEP y al PDP: tres
     hechos nuevos que no hacen falta para enseñar la lección.
   - **«Simulación · sin fecha»**, como la MFA fatigue de V6. Es la reserva si Lidia prefiere no fijar nada: se quitan el
     sello del 13-11 y el del 11-12, y el resto de la ficha vale igual. Pierde un ancla de historia.
   - **Antes del 30-11 con un segundo factor «real»**: choca con V10 (el proveedor de identidad solo pide contraseña).
     La ficha lo resuelve con la nota «lo pedirá desde el 30-11», en futuro, y con la mejora fechada el 11-12 *después* de la MFA.
2. **El «antes» es la regla de V1 (Operaciones a `erp.local` por 443)**, que decide por el origen y no mira quién eres, cómo
   está tu equipo ni cuándo. Es un hecho que ya está en pantalla (`v1/src/scenes/S05Rules.tsx:25`) y es justo el ejemplo de
   «policy-driven access control frente a topología de red» de la lección. Descartado:
   - **La VPN** como perímetro (la tabla de la lección dice «firewall, VPN»): es el terreno de V17 y su «cómo se entra en la
     VPN» no se toca.
   - **El plano plano de V16** (cuatro VLAN que el router no filtra): el 13-11 todavía no se ha dibujado, y acoplaría V20 a
     deducciones de V16.
   - **El castillo con foso de la lección**: tono distinto de todo lo demás y choca de imagen con la valla de V16.
3. **Una cuenta de prueba con perfil Operaciones, no «Marta» ni «alguien de Finanzas».** Marta es la persona del ejemplo de
   la lección, y Finanzas es un área nueva con un portátil sin nombre; la regla de V1 ya da Operaciones al ERP. La cuenta de
   prueba no es de nadie, así que no hay persona, género ni área que fijar. Descartado: `FIN-WS-05` (es una estación fija
   de Finanzas, limpia en las dos cazas) y las cuentas con nombre del registro.
4. **Tres conceptos**: dentro no es de fiar, los tres verbos con los dos planos, y adaptive identity con threat scope
   reduction. Son lo que la lección subraya («memoriza el trío», `sp/sp1-part2.ts:136`) y lo que castigan q1 a q5. Se quedan
   en la lección la tabla completa del perímetro frente a Zero Trust, policy-driven access control como concepto propio,
   NIST SP 800-207 y la micro-segmentación; implicit trust zones y subject/system salen como rótulos. Descartado un cuarto
   concepto (las zonas): se confundiría con las seis de V16 y la cápsula pasaría de 260 s.
5. **La imagen: un almacén del puerto con tres personas y un papel.** La oficina de pedidos decide, el encargado de turno
   escribe la orden de salida y la anula, y el mozo entrega lo que dice la orden: tres personas para los tres verbos de la
   nota de examen. El chaleco amarillo cubre el primer concepto y la orden de salida, el tercero. Descartado:
   - **El vigilante que llama a la oficina de acreditaciones**: es la imagen de 802.1X en V17 (`s03-08`), el mismo patrón
     con otro título. La ficha explica la diferencia y no la reutiliza.
   - **La valla y la garita** (V16), **la ventanilla** (el archivo de V10 y la DMZ de V16), **el camión y el contenedor**
     (V17 s07) y **la puerta de camiones** (descartada ya en V12).
   - **El pase y la tarjeta de embarque**: el pase firmado es el SAML de V6, y el token del administrator se confundiría con él.
   - **La torre de control con un remolcador**: encaja en dos planos, pero no en tres verbos (decide, comunica, aplica).
6. **Los dos mensajes de NULL CIPHER son errores de la propia lección**, en su registro de V11 (infinitivo, «Lógico.»):
   «Confiar en todo equipo de la red interna…» (la premisa del perímetro) y «Dejar que decida el punto de aplicación…» (la
   trampa «which component makes the decision», `sp/sp1-part2.ts:136`, q5). Sin puertas ni llaves, como manda la regla de
   V11. Descartado: «pedir siempre el máximo de pruebas» (adaptive identity no es autenticación más fuerte a secas, pero el
   mensaje daría la respuesta a la pregunta para pensar) y cualquier mensaje con badges o certificados (su dosier).
7. **La pregunta para pensar es la de la revocación** («El EDR avisa: ¿quién revoca la sesión?», botones «PEP» y
   «administrator»; respuesta: el administrator, con el engine que decide cerrar y el PEP que corta). Se cambió tras la
   revisión: la primera versión era la de adaptive identity (otro país, 03:00: ¿denegar o pedir más?), que repetía el check
   que sale justo antes en la lección (`sp/sp1-part2.ts:157-171`). Esta trabaja lo que la lección solo nombra y la trampa de q3
   (el PEP es el que «corta»). Descartado «¿quién decide: el PEP o el engine?»: esa forma ya la usa V17 (`s03-05`) y el mensaje de
   s03 ya toca el error.
8. **Las cuatro tarjetas** van en s02 a s05; la de threat scope reduction es la última porque es el principio que más cae
   (q4) y adaptive identity se ve y se nombra en la escena (el check de la lección ya la preguntó). La tarjeta de s04 sitúa PDP y PEP en sus planos y no repite
   «único componente de control» para no dejar la frase colgando.
9. **Dónde va: después del check de adaptive identity y antes del puente a la seguridad física**, con la tarea de las 6
   preguntas. Descartado ponerlo antes de los checks (contestaría el de adaptive identity) o después del puente (llegaría
   cuando la lección ya habla de otra cosa).

### Riesgos de V20

- **«Zero Trust» no es «no confiar en nadie».** Es no dar confianza por el origen: se verifica en cada petición. La regla 1
  del cierre lo dice («verificar no es negar»). El revisor debe buscar frases que lo lean como «denegar a todos».
- **Quién decide.** El PEP **consulta y aplica**; nunca decide. Y el administrator no decide: comunica, crea y revoca la
  sesión. La voz no debe llamar al mozo «el que decide si pasas» ni decir que el PEP «ve y por eso manda». Mismo cuidado con
  PDP: son dos piezas, engine y administrator.
- **«Implicit trust zone» suena a lo que Zero Trust quita.** La narradora dice «zona pequeña y explícita»; el rótulo en
  inglés va aparte. Es una estructura del data plane, no el principio que reduce daño (q4).
- **Threat scope reduction está en el control plane** (tabla de la lección, `:72-85`): la pantalla no lo dibuja abajo. Lo
  que se dibuja abajo es su efecto, la zona mínima.
- **Adaptive identity no es «más fuerte».** Puede endurecerse o relajarse (`:155`): hay una frase para eso, y la escena no presenta «denegar» como un error.
- **Quién revoca.** Secuencia exacta: la señal del EDR llega al engine, el engine decide cerrar, el administrator revoca la
  sesión y el PEP corta. La voz dice las tres cosas, para que nadie atribuya la decisión al administrator.
- **Es casi un repaso 1 a 1 del ejemplo de la lección** (`:126-131`, mismo ERP): la ficha lo dice y no lo disimula. Lo que
  aporta de más: la regla de V1 como «antes», un simulador que enseña cada decisión con sus campos, los tres verbos como
  tres personas con un papel que caduca, y la revocación paso a paso. El revisor debe comprobar que no se vende como más.
- **El sello «diseño y simulación» se queda visible en s05**, donde suena el segundo factor; la MFA real es del 30-11.
- **«Zero Trust no es una caja que se compra»**, no «nada se compra»: la lección (`:155`) dice que un proveedor puede
  vender un PEP o un PDP, y que la política y las señales las diseña quien lo usa.
- **El mozo y la oficina se parecen al vigilante y la oficina de V17.** Para separarlas: todo va por el sistema de
  pedidos, sin teléfono ni llamadas; la orden sale impresa con su caducidad; y son tres personas, no dos. No hay garita ni
  «recinto» en pantalla (el chaleco es el centro de s02). Que el revisor de naturalidad lo mire.
- **«Credencial robada» y «equipo comprometido»** son el supuesto de la lección, pero se parecen a septiembre: nada de «como
  pasó». «Creció así» sale ya en V16 y en V21: tic de la serie, que no se vuelva fórmula.
- **La regla de V1 no es «el único control del ERP».** El ERP tendrá su propio inicio de sesión. El vídeo dice que *esa
  regla* decide por origen, no que el ERP no se proteja de otra forma ni que alguien lo hiciera mal. Y «Operaciones» no es
  Lucía: la cuenta de prueba no tiene nombre.
- **La simulación no puede leerse como un piloto.** Sellos «diseño y simulación» y «sin efectos» visibles en s01 y s04. El
  único hecho futuro con fecha es el piloto del 11-12, y se enseña como siguiente paso, nunca cumplido.
- **La MFA del 30-11, en futuro.** Ninguna pantalla pide un segundo factor de verdad; el vídeo dice que el proveedor de
  identidad «lo pedirá». Nada de «ya está en marcha» ni de enseñar la MFA de V6.
- **«EDR activo» como señal del equipo.** No debe insinuar que alguna estación del caso no lo tuviera (`ADM-WS-07` salía
  «sin agente EDR»). Solo se pide «activo» como condición de la política.
- **El caso de septiembre no sale** y el vídeo no dice «habría frenado»: el aviso del EDR a los 10 minutos es un evento de
  prueba, sin equipo.
- **NULL CIPHER.** Sin puertas ni llaves, sin tuteo, con «Lógico.», sin IP, dominio ni equipo; la narradora la presenta con
  «una célula de acceso inicial» y «busca el primer hueco que no cierre», sin pronombre. Es su tercera aparición en la
  cronología pero la primera en el orden del curso: se presenta como la primera.
- **Léxico.** `PEP`, `PDP`, `ERP` y `NIST` son nuevos y Lidia los confirma al grabar; `policy engine` y `policy
  administrator` se dicen en inglés después de la idea en llano (regla 3 de la narración hablada).
- **Duración.** s03 es la escena que más cuenta; si el borrador se pasa, se recorta s04 (la política, solo en pantalla).
  Con 210 s de suma, el extremo bajo conocido (0,89) dejaría 187 s, 3 por debajo del mínimo; V10 y V12 hicieron lo
  contrario, así que se espera ~235–250 s. Se mide por los dos lados.
- **q6 (subject/system)** solo se apoya en un rótulo de s04. Si el guion lo quita, la tarea del cierre pasa a «las
  preguntas q1 a q5».

## V21 · sp4m2 · «WPA3-Enterprise: de una clave para todos a una identidad para cada uno» · decisiones

1. **Eje: la clave compartida de HALDEN-OPS, en tres movimientos.** La señal que se escapa (colocación y potencia), lo que
   se llevaría quien la escucha (el apretón de manos de WPA2, el ataque sin conexión, SAE y forward secrecy) y la identidad
   por usuario (enterprise, EAP-TLS frente a PEAP). Son las tres cosas que la nota de examen de 4.1 pide para lo
   inalámbrico y las tres de q1, q2 y q3; la historia sale del propio recuadro de Halden de la lección. Se quedan fuera MDM,
   BYOD y los métodos de conexión (poco movimiento) y la seguridad de aplicaciones (vecindario de V19). Descartado:
   - **Dejar la fuga solo como arranque** (dos conceptos, más aire): pierde el primer reflejo de la nota de examen
     («señal que llega al aparcamiento»), el que más se ve y el único con un mapa que se mueve.
   - **Un cuarto concepto (MDM y containerization)**: la cápsula pasaría de 260 s y volvería a haber una lista.
2. **Fechas: auditoría el 14-12, antenas el 15 y el 16, y la mejora fechada el 22-12.** La lección habla de «la auditoría de
   este trimestre» sin fecha, y V21 es el vídeo que se la da. Queda **después** de V17 (la lección sp3m5 va antes que
   sp4m2 en el curso: primero el cable, luego el aire) y de todo lo fechado, sin tocar el 30-11 ni el 1-12. Descartado:
   - **La auditoría a principios de noviembre y la decisión en diciembre** (la otra forma de no adelantarse a V17): son dos
     fechas en dos meses para una cápsula y el 802.1X inalámbrico quedaría decidido antes que el cableado de V17.
   - **Un vídeo sin fecha**: el recuadro de la lección ya tiene demasiadas cosas «en presente» y sin dueño.
   - **El 29-12 como fecha de la mejora**: es la semana de Navidad; si el 22-12 resulta demasiado justo, cambia solo el sello.

   La revisión de V16 y V17 (`revision-V16-V17.md`, «Entre fichas», punto 4) dejó dicho de este mismo recuadro (`sp/sp4-part1.ts:384`)
   que HALDEN-OPS pasa a WPA3-Enterprise con RADIUS y EAP-TLS, que eso «encaja» con el 802.1X cableado de V17 mientras V17 no
   diga que el puerto no tuviera RADIUS, y «que siga así». V21 lo respeta: dice «un servidor RADIUS» a secas, no dice desde
   cuándo existe, y fecha el recuadro en diciembre, después de V17 y de sus fases del 1-12; no contradice esa nota.
3. **Una prueba autorizada de la analista, en un punto de acceso de pruebas, nunca contra HALDEN-OPS.** La analista mide la
   señal real desde el aparcamiento (una lista de redes que oye) y repite en el laboratorio lo que haría quien escucha, con
   la configuración de HALDEN-OPS, una clave de prueba corriente y contadores inventados. Descartado:
   - **Atacar la red de verdad y enseñar la clave**: sería un hallazgo grave (cualquiera la habría podido sacar desde 2022) y
     obligaría a un incidente que el registro no tiene.
   - **Un auditor externo que lo hace**: los contratistas y los terceros siguen neutros (dosieres de RED MARROW y PAPER
     GOVERNOR).
   - **Nombrar la herramienta o enseñar la lista de palabras**: la pantalla solo lleva contadores. No es una receta.
4. **Los dos mensajes de SILENT PAGER son los dos errores clásicos de la lección**: ocultar el SSID (check de la cobertura,
   `sp/sp4-part1.ts:290-304`) y «una clave larga» (la solución que parece suficiente y no da identidad). Sin «Duerme
   tranquila» (es de V5b) ni «De nada» (V5 y V18); el segundo cierra con «Qué elegante.» y el primero, sin coletilla. No
   ataca nada y no dice dónde está.
   Descartado: un mensaje sobre PEAP (lo trata la pregunta para pensar) y otro sobre «WPA3 ya es seguro».
5. **La pregunta para pensar es la q3 de la lección** (tabletas con certificado: ¿PEAP o EAP-TLS?), con los dos carriles
   solo con su título para que el dibujo no la conteste. Descartado «¿WPA3 personal o enterprise?»: lo contesta la historia
   (una clave de todos no da identidad) y sale en el mensaje de s04.
6. **Tres imágenes, una por concepto, de fuera de la familia de las llaves y las puertas**: un foco (la fuga; ocultar el nombre
   es tapar la etiqueta del foco), un candado de combinación (el ataque sin conexión es llevarte el candado a casa; SAE es
   el candado atornillado a la taquilla) y el carné frente al código de la escalera (la identidad; no «portal», que en Halden es el de reservas). Descartado: las llaves y
   las puertas (el spraying de V10, el armario de llaves de V6, las «llaves» criptográficas), la garita y la puerta del
   recinto (V16 y V17, donde 802.1X ya tiene su imagen) y el pase (V6).
7. **La tarjeta de EAP repite la idea de V17** («802.1X con certificados en los dos lados: EAP-TLS») y añade lo que V17
   deja solo en pantalla: la condición de PEAP. Es el mismo contenido del examen dicho desde el aire. En el curso, sp3m5
   (V17) va antes que sp4m2, así que quien sigue el orden ya habrá visto la tarjeta de V17; quien no, la ve entera aquí.
   Los dos vídeos se entienden solos y ninguno remite al otro.
8. **Dónde va: antes del encabezado «Movilidad»** y, por tanto, **antes del recuadro de Halden de la lección** (`:380-385`). El
   vídeo cuenta los dos primeros hallazgos con fecha y detalle; el recuadro los repite después en presente. No hay
   contradicción, pero el lector que sigue el orden verá primero el vídeo. Se propone aparte dar fecha al recuadro.
9. **La tarea es terminar la lección y sus preguntas**, no contestarlas ya: el vídeo va a mitad de sp4m2 y cuatro de las siete
   preguntas (CYOD, MDM, validación de entrada y cookies) tratan de lo que viene después (la misma justificación que V12).

### Riesgos de V21

- **SAE «frena» el ataque sin conexión, no lo «elimina» ni vuelve a la red «inatacable».** Se puede seguir adivinando contra
  la red, uno a uno y a la vista. La tarjeta dice «frena». Y WPA3 personal sigue siendo una clave compartida: s03 lo rotula
  («sigue siendo una clave para todos») para enlazar con s04.
- **Forward secrecy, bien dicho.** Con WPA2, quien grabó el tráfico *y* averigua la clave después puede abrir lo que grabó;
  con SAE, no. La voz dice «lo que grabaste», no «todo el tráfico de la red». Si s03 no cabe, pasa a una frase y un rótulo
  (nunca se quita la tarjeta de SAE).
- **El puerto no se cambia a WPA3 personal**, sino a enterprise. El vídeo explica SAE porque es contenido del examen (q2) y
  porque quita a la clave compartida su peor ataque, no porque sea la decisión del puerto. El guion lo dice en una frase.
- **Ocultar el SSID no es un control**, pero tampoco se dice que «no sirva de nada»: se descubre en cuanto una tableta legítima
  se conecta, que es justo lo que espera quien escucha. La corrección es la de la lección, sin adornos.
- **Los −55 y los −78 dBm.** El primero es de la lección; el segundo, inventado. «Se oye menos, pero se oye»: −78 dBm queda
  floja para una tableta, pero no es cero, y el vídeo no dice que quede «seguro». Es la razón de pasar al cifrado.
- **La prueba no se puede leer como un ataque ni como una receta.** Punto de acceso de pruebas, clave de prueba, ninguna
  herramienta con nombre, ninguna lista de palabras y ninguna clave encontrada en pantalla (ni de HALDEN-OPS ni de nadie).
  Rótulo fijo «prueba autorizada».
- **«Nada indica que alguien la capturara.»** El vídeo no lo dice, ni afirma ni niega nada sobre el pasado de HALDEN-OPS:
  una cosa es que se pueda y otra que haya pasado. Sin culpables: la clave y la cobertura «crecieron así».
- **El aparcamiento sale en el anuncio de RED MARROW** («USB en el aparcamiento», `sp/sections.ts:63-68`): el aparcamiento de visitantes sale solo
  como el sitio donde se mide la señal. Nadie aparca allí, ningún coche, ningún USB. Y las tabletas son «las tabletas de las
  grúas» de la lección: ni «operadores» (kits de RED MARROW) ni qué hacen ni a qué red llegan (BLIND ARCHITECT, OT).
- **La wifi de invitados no sale.** El aparcamiento de visitantes no es una red de invitados; HALDEN-OPS no es la wifi de
  invitados del dosier de BLIND ARCHITECT (`sp/sections.ts:87`) y no se dibuja ninguna línea hacia PLC, esclusas o zonas.
- **«Ya tienen certificado»** es el presente de la lección: no se dice quién se lo emitió, ni cuándo, ni con qué CA, y ninguna
  raíz se instala en nadie (dosier de NULL CIPHER). La CA interna sigue sin definir.
- **No se dice si el puerto tenía RADIUS antes del 22-12.** Un servidor RADIUS a secas: V17 pone 802.1X en los switches de la
  planta de oficinas desde el 1-12, y V21 no lo relaciona ni lo contradice.
- **PEAP y TTLS, sin dramatizar.** No son «inseguros»: son más débiles que EAP-TLS y dependen de que el cliente valide el
  certificado del servidor (la lección, `:308`). El punto de acceso falso es una hipótesis rotulada, no un incidente, y no
  copia el evil twin de la terminal de pasajeros de sp2 (`sp/sp2-part1.ts:315`, q).
- **El survey no encuentra aparatos sin registrar.** spl2a tiene un jefe de operaciones con un router wifi sin registrar
  hallado «durante un wireless survey» (`sp/labs-sp2.ts:119-121`): la voz no habla de shadow IT.
- **El ejemplo de la tableta perdida es hipotético** y está rotulado «ejemplo · sin fecha»; nada se ha revocado.
- **Léxico.** `WPA3`, `SAE`, `PEAP`, `TTLS`, `PSK`, `PKI` y `AAA` son nuevos (Lidia los confirma al grabar); `EAP`, `EAP-TLS`,
  `RADIUS`, `TLS` y `802.1X` ya están fijados por V17.
- **Densidad de s03.** 50 s para el apretón de manos, el ataque sin conexión, SAE y forward secrecy: es la escena crítica;
  la ficha dice qué se recorta primero.

## Cambios propuestos a la lección y a los registros (solo propuestos; no se ha tocado nada)

1. **Dar fecha al recuadro de Halden de sp4m2** (`sp/sp4-part1.ts:380-385`), en la rama de V21, como hizo V10 con el spraying:
   «Tres hallazgos de la auditoría del 14-12» y, donde dice «pasa a WPA3-Enterprise», «pasa (22-12) a WPA3-Enterprise…». Solo
   texto; no cambia ningún id ni respuesta. Si no se hace, no pasa nada: la ficha no lo necesita.
2. **Una discrepancia que ya existía y que V21 deja intacta**: el recuadro habla del «portal de declaración de carga» y el
   resto de Halden del «portal de reservas» (`hpa-portal-web-01`); V19 saca un tercero, el portal de citas de camiones. Si
   se junta, que sea en la rama de V19.
3. **Registro de canon (`reg`), al cerrar cada vídeo (paso 8 del orden de trabajo):**
   - §2: filas del 13-11 (V20), 11-12 (la mejora de V20), 14-12, 15-12, 16-12 y 22-12 (V21); §3: la política del ERP de V20 y
     el punto de acceso de pruebas de V21; la política de las tres peticiones; HALDEN-OPS pasa de «sin más» a «WPA2 con una
     clave compartida desde 2022, −55 dBm en el aparcamiento de visitantes, −78 tras bajar dos antenas, WPA3-Enterprise
     previsto el 22-12» (§6 ya la lista como «wifi WPA2 de la terminal»).
   - §4: los dos mensajes de NULL CIPHER (V20) y los dos de SILENT PAGER (V21).
   - §1 y notas de V11: «el primer vídeo de Halden» para sp1 pasa a ser V20 en el orden del curso; V21 es la primera
     aparición de SILENT PAGER en el orden del curso.
   - §5: la MFA del 30-11 sigue sin enseñarse cumplida (V20 la deja en futuro); ningún vídeo dice si el puerto tenía RADIUS
     antes del 22-12; las tabletas «ya tienen certificado» (lección) sin CA ni emisión.
4. **Plan de vídeos:** pegar las dos fichas en §5, anotar V20 y V21 como tanda 4 en la fila 20 del ranking (§3) y añadirlas a la
   tabla de «se graba con»; y añadir al léxico de V20 y V21 las siglas nuevas.
5. **Lección sp1m3:** nada. La inserción es una línea y un bloque.

## Entre fichas (lo que he cruzado con V18, V19, V22 y V23)

- **Fechas:** sin choques (arriba). V19 y V20 comparten el 13-11 con asuntos distintos.
- **SILENT PAGER** sale en V18 y V21: V18 no usa «Duerme tranquila» (es de V5b) y cierra con «De nada» (es de V5); V21 cierra solo el
  segundo con «Qué elegante.». Conviene que el revisor de naturalidad de la sesión compruebe que los cuatro
  mensajes de las dos cápsulas no suenan a la misma fórmula.
- **El ERP y `erp.local`:** nadie más los usa en la tanda 4. **Aparcamiento, tabletas y HALDEN-OPS:** nadie más.
- **Voz:** NULL CIPHER (V20) con Helena y `cifrado`; SILENT PAGER (V21) con Pablo y `machine`; ninguna coincide con RED MARROW
  (V19, Laura y `telefono`). La voz de SILENT PAGER **sí coincide** con la de GLASS VIPER (V22) y la de HOLLOW LANTERN (Pablo y
  `machine`): es una convención previa entre pistas distintas, no un choque nuevo. Los efectos ya existen.
- **Grabación:** V20 y V21 en una sola sesión; V18 y V19 en otra.

## Preguntas para Lidia

Ninguna imprescindible: ella delega y las fichas ya llevan la opción recomendada. La única decisión con consecuencias de
canon es esta, y la recomendación es la de la ficha:

- **¿V20 como diseño y simulación el 13-11, o como piloto en marcha en diciembre?** Recomiendo **el diseño** (ficha tal
  cual): no obliga a decidir si la MFA del 30-11 se cumplió, ni qué parte del plan de zonas funciona primero, ni dar nombre a
  ningún equipo. Si prefiere el piloto, la ficha cambia en seis cosas: la fecha, los sellos, el tiempo verbal, la MFA
  mostrada cumplida, el nombre del punto de aplicación y la mejora del 11-12 (que pasaría a ser otra).

## Lo que no he podido comprobar

- **El objetivo oficial de CompTIA** (1.2 y 4.1): no he abierto el documento oficial; me apoyo en la cabecera de cada
  lección y en lo que recuerdo de los objetivos. El 1.2 lista Zero Trust con el control plane (adaptive identity, threat
  scope reduction, policy-driven access control, policy administrator y policy engine) y el data plane (implicit trust
  zones, subject/system y policy enforcement point); el 4.1 lista las consideraciones de instalación inalámbrica (site
  surveys y heat maps) y los ajustes de seguridad inalámbrica (WPA3, AAA/RADIUS y protocolos criptográficos y de
  autenticación). Los ejes de las dos fichas coinciden con eso, pero de memoria: quien revise la exactitud debe
  contrastarlo con el documento.
- **Los datos de pantalla de V17**: los he leído en la rama sin fusionar (`video-fronteras-halden`: la ficha del plan, el
  `narration.json` final y su léxico); no he leído sus escenas `.tsx`. La ficha de V21 no depende de nada de V17 más allá de
  «un servidor RADIUS» y de la tarjeta de EAP-TLS.
- **Las cifras inventadas** (−78 dBm, 38.000.000 de claves probadas, la tableta 07) y que un número así sea verosímil para un
  ataque sin conexión con una tarjeta gráfica corriente: es un orden de magnitud razonable, no una medida.
- **La longitud real del guion:** la suma de segundos y el presupuesto de palabras están contados; cuánto dura grabado, solo
  se sabrá con el primer borrador.
- **Las fichas de la tanda 4 ajenas** (V18, V19, V22 y V23) las he leído por encima, solo para cruzar fechas, voces, equipos
  y fórmulas de los mensajes; no las he revisado.

## Tras la revisión (`revision-secplus.md`, apartados V20, V21 y «Entre fichas»)

**Aplicado en V20:** «otro recurso» corregido («el mismo ERP») y declarado como casi repaso uno a uno, con lo que aporta de más;
en la revocación, el engine ve el aviso y decide, el administrator revoca y el PEP corta; el sello «diseño y simulación»
sigue visible en s05; la regla 3 del cierre pasa a «no es una caja que se compra»; el mozo y la oficina van por el sistema
de pedidos, sin teléfono ni llamadas, y s02 ya no dice «recinto»; la pregunta para pensar pasa a la revocación (hallazgo 4 de
la revisión, que proponía exactamente esa); nota de septiembre añadida.

**Aplicado en V21:** «el código de la escalera» en lugar de «del portal»; «recoge sus credenciales» en lugar de «le da la
contraseña»; la demo termina sin resultado en pantalla, sin tiempos ni velocidades y sin adaptador ni modo de captura; título
de YouTube y de la ficha «WPA3-Enterprise: …»; título de s05 «Dos formas de entrar»; los chips pasan de «el precio» a «lo que
hace falta»; fuera «valla» y «recinto» (la tarjeta de s02 dice «perímetro», como la lección); «carné», nunca «badge» ni «pase»;
la errata de la voz de SILENT PAGER y GLASS VIPER corregida.

**No cambiado, con motivo:**
- **El título de s01 de V21 sigue siendo «WPA3»** (el título que sale en pantalla). Es el nombre del tema y promete lo que el
  vídeo cuenta; lo que prometía de más era el título de YouTube, que ya dice «WPA3-Enterprise».
- **«Qué elegante.»** se queda: no repite «Qué detalle.» (V1) y es otra frase; el revisor de naturalidad compara los cuatro
  mensajes de SILENT PAGER (V1, V18 y V21) si quiere.
- **Los mensajes de V20 (69 y 68 caracteres)** no se tocan.
- **«Dependencia de V17 sin fusionar»:** de acuerdo; orden de PR recomendado: V17, luego V21, y que V20 no depende de ella.

# Guion para grabar · Tu YARA compila: ahora demuestra qué detecta

**Versión definitiva** · guion congelado el 2026-10-19.

Lee de corrido y en orden, **a ritmo de conversación**: como si se lo contaras a una amiga, no como quien lee.
Entre frase y frase deja un respiro corto; los silencios se recortan solos y el vídeo se acelera un poco (×1,08) al montarlo.
Si algo sale mal, **calla un segundo y repite la oración que falló desde su principio** (no hace falta la frase entera) y sigue: el importador se queda con la última toma de cada oración.
No hagas pausas largas dentro de una frase: si necesitas respirar, termina antes la oración.
Al acabar la última frase, deja dos segundos de silencio antes de parar la grabación.
Guárdala como `video/engine/voices/yara-prueba-entrega lidia.wav`.
Lo que va entre paréntesis en cursiva es solo cómo pronunciar; la *dirección* de cada frase es orientativa.
Los mensajes interceptados y las preguntas para pensar salen en pantalla: **no se leen**. Los dominios, IP y correos tampoco: están en pantalla.

## 1. La prueba pendiente

### La sintaxis está bien

**s01-01** · *con curiosidad* — Tu regla compila. Ahora vas a comprobar qué detecta, qué se le escapa y qué debes entregar para que otra persona pueda evaluarla.

**s01-02** · *cercana* — Estamos en el laboratorio didáctico de Meridian, una empresa aeroespacial. Los archivos son inertes. Una regla YARA expresa patrones y condiciones.

**s01-03** · *concentrada* — Que el motor acepte su sintaxis no significa que cumpla el objetivo de detección.

**s01-04** · *tranquila* — Usamos el mismo paquete de práctica que la lección. Incluye tres variantes dentro del alcance, controles parecidos y casos que revelan límites.

**s01-05** · *segura* — No necesitas malware real ni una cuenta de pago. Lo que necesitas es comparar resultados esperados con resultados observados. **(pausa larga)**

### El motor y el archivo importan

**s02-01** · *pensativa* — Primero descargas la regla que has escrito. El editor del navegador no la ejecuta.

**s02-02** · *animada* — El verificador local la compila con YARA real y la aplica al conjunto de archivos de prueba. Ese conjunto se llama corpus. El paquete explica cómo preparar el entorno.

**s02-03** · *firme* — Registra qué motor y qué versión utilizaste. Conserva también la versión de la regla y los archivos de prueba.

**s02-04** · *tranquilizadora* — Si cambias la regla o el corpus, has cambiado la prueba. La evidencia anterior no cubre automáticamente el cambio.

**s02-05** · *con curiosidad* — Un error de compilación no es una ausencia de coincidencia. La regla no llegó a evaluarse como esperabas. Una discrepancia significa otra cosa.

**s02-06** · *cercana* — El motor produjo un resultado que no coincide con la expectativa del caso. Esa diferencia debe quedar visible. **(pausa larga)**

## 2. Errores que importan

### Acertar algo y detectar de más

> *(En pantalla, no se lee: mensaje de VELVET CICADA — «Cuantas más coincidencias salgan, mejor es la regla.». Tú contestas:)*

**s03-01** · *concentrada* — Más coincidencias pueden significar más errores. Si un archivo queda fuera de tu objetivo y la regla lo acepta, tienes un falso positivo.

**s03-02** · *tranquila* — Si uno que debería entrar no coincide, tienes un falso negativo. Las etiquetas dependen del objetivo declarado.

**s03-03** · *segura* — En el paquete hay controles con una ruta sola, un marcador solo o unos bytes coincidentes. Una condición demasiado permisiva puede aceptarlos.

**s03-04** · *pensativa* — Si los aceptas por accidente, no has descubierto más variantes. Has ampliado la regla más de lo que justificaban tus datos.

**s03-05** · *animada* — Por eso revisas cada archivo, incluidos los negativos. Una pantalla llena de aciertos parciales no basta. Necesitas saber qué se esperaba, qué ocurrió y por qué.

**s03-06** · *firme* — El verificador compara resultados completos y devuelve un fallo cuando hay discrepancias. **(pausa larga)**

### Volver al ejemplo conocido

**s04-01** · *tranquilizadora* — C cambia la ruta pero conserva otros rasgos del objetivo. Ya lo usamos al escribir la condición.

**s04-02** · *con curiosidad* — Si ahora exiges todas las cadenas, ¿mejora siempre la regla o puedes perder una variante que querías detectar?

> *(En pantalla: «¿Exigir todo mejora siempre la cobertura?». Deja cuatro segundos y medio de silencio; no leas las opciones.)*

**s04-03** · *cercana* — Puedes perderla. Volver a probar C comprueba un ejemplo conocido. Es una prueba de regresión: ayuda a descubrir si un cambio rompe algo que antes funcionaba.

**s04-04** · *concentrada* — No demuestra que la regla detecte variantes nuevas.

**s04-05** · *tranquila* — Ajustar hasta memorizar ejemplos se llama sobreajuste. Para evaluar generalización, reserva casos nuevos que no hayan influido en el diseño.

**s04-06** · *segura* — Aquí los archivos son públicos y sintéticos. Sus resultados enseñan el método, sin demostrar cobertura de malware real. **(pausa larga)**

## 3. Cambiar el alcance

### Tres reglas, tres trabajos

**s05-01** · *pensativa* — El paquete incluye una regla estrecha para una muestra, otra para el conjunto de variantes y otra para buscar candidatos.

**s05-02** · *animada* — La primera exige un rasgo concreto del archivo A. Es útil para ese alcance, pero pierde B y C.

**s05-03** · *firme* — La regla de familia del ejercicio cubre A, B y C dentro del contrato sintético. No acredita cobertura de una familia real.

**s05-04** · *tranquilizadora* — La regla de hunting es más amplia. Recupera también controles que comparten un rasgo y necesitan revisión.

**s05-05** · *con curiosidad* — La diferencia no se decide por un nombre bonito en la regla. Se decide por el objetivo, los requisitos y los resultados.

**s05-06** · *cercana* — Una regla amplia puede ser útil para investigar candidatos y ser inadecuada para bloquear automáticamente. La acción prevista forma parte de la entrega. **(pausa larga)**

### Doce de doce, con denominador

**s06-01** · *concentrada* — La referencia obtiene los doce resultados previstos del paquete. Eso incluye archivos que deben coincidir y archivos que no deben hacerlo.

**s06-02** · *tranquila* — No significa que detecte doce infecciones. Tampoco significa que tenga una sensibilidad perfecta frente a una familia real.

**s06-03** · *segura* — La variante futura del ejercicio cambia el marcador y la ruta. La referencia no la cubre.

**s06-04** · *pensativa* — Si tu objetivo incluye esa versión, tienes un falso negativo conocido. Los archivos fuera del tamaño pactado también muestran un límite cuando amplías el objetivo.

**s06-05** · *animada* — Conserva esos resultados al informar. Decir que todo salió conforme a un contrato pequeño es correcto. Convertirlo en una promesa de producción no lo es.

**s06-06** · *firme* — Tu conclusión debe llevar el alcance con el que interpretaste cada coincidencia y cada ausencia. **(pausa larga)**

## 4. Preparar la entrega

### Mandar la regla no basta

> *(En pantalla, no se lee: mensaje de VELVET CICADA — «Manda la regla y escribe cien por cien. Queda mejor.». Tú contestas:)*

**s07-01** · *tranquilizadora* — Queda mejor hasta que otra persona necesita entender qué probaste. Entrega la regla versionada, el objetivo y la procedencia de sus patrones.

**s07-02** · *con curiosidad* — Añade el motor, el corpus y la matriz de resultados. El receptor debe poder reproducir lo que afirmas.

**s07-03** · *cercana* — Explica las limitaciones y los errores conocidos. Di si una coincidencia necesita revisión humana o alguna acción específica.

**s07-04** · *concentrada* — Una captura de YARA Forge solo demuestra la simulación por etiquetas. No sustituye una compilación y una ejecución reales de tu archivo.

**s07-05** · *tranquila* — Revisa también quién puede recibir la evidencia y qué uso está permitido. Los datos sintéticos de este ejercicio no contienen secretos.

**s07-06** · *segura* — Eso no permite olvidar los derechos y la protección de evidencias cuando entregas reglas apoyadas en material de terceros. **(pausa larga)**

### El receptor quiere bloquear

**s08-01** · *pensativa* — El receptor ve los doce resultados conformes y propone bloquear toda la flota.

**s08-02** · *animada* — ¿El paquete sintético justifica ese uso, o necesitas una validación que corresponda a los archivos y a la acción de producción?

> *(En pantalla: «¿Estos resultados justifican bloquear la flota?». Deja cuatro segundos y medio de silencio; no leas las opciones.)*

**s08-03** · *firme* — Necesitas validar ese uso. El ejercicio demuestra la mecánica y los resultados de unos archivos preparados.

**s08-04** · *tranquilizadora* — Antes de una acción real necesitas controles representativos, cobertura adecuada y una respuesta autorizada. El coste de una coincidencia equivocada también cambia con la acción.

**s08-05** · *con curiosidad* — No estás rechazando la regla por haber nacido en un laboratorio. Estás delimitando qué evidencia existe. Puedes entregarla como práctica o punto de partida.

**s08-06** · *cercana* — No puedes presentar el resultado sintético como prueba suficiente de eficacia en toda la organización. **(pausa larga)**

## 5. Una conclusión reproducible

### Una entrega que puede mantenerse

**s09-01** · *concentrada* — Añade un responsable y un criterio de revisión. La regla puede dejar de cubrir lo que interesa o empezar a coincidir con contenido legítimo nuevo.

**s09-02** · *tranquila* — Quien recibe la entrega necesita saber cómo comunicar esos errores y cuándo revisarla.

**s09-03** · *segura* — Si cambias un patrón, conserva la versión anterior y repite las pruebas. Si cambias el corpus, registra qué se añadió y por qué.

**s09-04** · *pensativa* — Los hashes ayudan a identificar los archivos exactos usados. No prueban por sí solos que el conjunto sea representativo.

**s09-05** · *animada* — Así entregas una detección que otra persona puede evaluar, repetir y mantener. El paquete permite reproducir resultados y discutir límites.

**s09-06** · *firme* — Quien lo recibe no debería necesitar toda tu conversación para entender qué puede hacer con la regla. **(pausa larga)**

### De la regla al producto

**s10-01** · *tranquilizadora* — Tres reglas de cierre. Compilar valida sintaxis, no eficacia. Revisar positivos y negativos evita esconder errores.

**s10-02** · *con curiosidad* — Y una entrega técnica necesita alcance, reproducción y acción prevista, además del archivo de la regla.

**s10-03** · *cercana* — El resultado útil no es una cifra grande. Es una afirmación concreta que otra persona puede comprobar. Si sabes dónde falla, dilo.

**s10-04** · *concentrada* — Esa información ayuda a decidir cómo usarla y qué evidencia recoger después.

**s10-05** · *tranquila* — Ejecuta ahora el verificador sobre tu regla descargada y prepara su ficha de entrega. Incluye los casos que no cubre.

**s10-06** · *segura* — En la lección de diseminación tienes el modelo. Tu trabajo termina cuando la siguiente persona puede evaluar la detección sin adivinar tus supuestos. **(pausa larga)**

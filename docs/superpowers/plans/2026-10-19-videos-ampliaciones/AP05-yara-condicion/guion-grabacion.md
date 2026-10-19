# Guion para grabar · Escribir YARA: qué debe coincidir y qué puede cambiar

**Versión definitiva** · guion congelado el 2026-10-19.

Lee de corrido y en orden, **a ritmo de conversación**: como si se lo contaras a una amiga, no como quien lee.
Entre frase y frase deja un respiro corto; los silencios se recortan solos y el vídeo se acelera un poco (×1,08) al montarlo.
Si algo sale mal, **calla un segundo y repite la oración que falló desde su principio** (no hace falta la frase entera) y sigue: el importador se queda con la última toma de cada oración.
No hagas pausas largas dentro de una frase: si necesitas respirar, termina antes la oración.
Al acabar la última frase, deja dos segundos de silencio antes de parar la grabación.
Guárdala como `video/engine/voices/yara-condicion lidia.wav`.
Lo que va entre paréntesis en cursiva es solo cómo pronunciar; la *dirección* de cada frase es orientativa.
Los mensajes interceptados y las preguntas para pensar salen en pantalla: **no se leen**. Los dominios, IP y correos tampoco: están en pantalla.

## 1. Antes del código

### Una regla con una promesa concreta

**s01-01** · *con curiosidad* — Vas a escribir una regla YARA y explicar por qué exige esas coincidencias. Empezamos con archivos inertes, sin malware ni cuentas reales.

**s01-02** · *cercana* — El ejercicio acompaña a Meridian, una empresa aeroespacial. Aquí una regla expresa una hipótesis sobre el contenido de un archivo.

**s01-03** · *concentrada* — No decide por sí sola si algo es malicioso. Detecta los patrones y condiciones que tú hayas definido.

**s01-04** · *tranquila* — Trabajamos con un conjunto de archivos de prueba. Lo llamamos corpus. Queremos reconocer tres variantes de un formato de demostración y rechazar controles parecidos.

**s01-05** · *segura* — Los archivos se llaman A, B y C en la explicación. Sus nombres no forman parte de la condición. **(pausa larga)**

### Tres partes con trabajos distintos

**s02-01** · *pensativa* — La regla tiene tres partes habituales. El contexto se escribe en meta. Documenta autoría, versión y alcance. No hace que el archivo coincida.

**s02-02** · *animada* — Poner el nombre de una familia ahí no demuestra que la detectes.

**s02-03** · *firme* — Los patrones se declaran en strings. Cada uno recibe un identificador para poder usarlo después. Pueden ser cadenas textuales o secuencias de bytes, entre otras formas.

**s02-04** · *tranquilizadora* — Elegirlos necesita evidencia sobre lo que quieres reconocer.

**s02-05** · *con curiosidad* — La decisión se expresa en condition. Ahí combinas los patrones y los límites que correspondan. Esa combinación es la promesa de la regla.

**s02-06** · *cercana* — Si dices que cubre variantes, deberás comprobar variantes. Que el texto parezca razonable todavía no lo demuestra. **(pausa larga)**

## 2. Patrones que se pueden justificar

### Dos palabras corrientes no hacen una familia

> *(En pantalla, no se lee: mensaje de HOLLOW LANTERN — «Pon dos cadenas. Dos siempre es mejor que una.». Tú contestas:)*

**s03-01** · *concentrada* — Dos cadenas corrientes pueden aparecer juntas en mucho software legítimo. La cantidad no sustituye la elección.

**s03-02** · *tranquila* — Primero necesitas explicar qué aporta cada patrón y qué controles podrían contenerlo sin pertenecer a tu objetivo.

**s03-03** · *segura* — En nuestro corpus hay un archivo con dos nombres comunes. No queremos que coincida. Si solo cuentas cuántas cadenas aparecen, puedes detectar ese control.

**s03-04** · *pensativa* — El problema no se arregla eligiendo un número por costumbre.

**s03-05** · *animada* — Una regla estrecha para una muestra puede usar un rasgo muy específico. Una que busca variantes necesita justificar qué se conserva y qué puede cambiar.

**s03-06** · *firme* — El objetivo y la evidencia mandan. Ningún umbral convierte por sí solo cadenas débiles en una identificación fiable. **(pausa larga)**

### El mismo texto, otros bytes

**s04-01** · *tranquilizadora* — A conserva el marcador en texto sencillo. B lo lleva en mayúsculas y con bytes nulos intercalados. Sigue dentro del objetivo.

**s04-02** · *con curiosidad* — ¿Lo dejarías fuera o necesitas expresar esa variación en el patrón?

> *(En pantalla: «¿B queda fuera o debes cubrir otra forma?». Deja cuatro segundos y medio de silencio; no leas las opciones.)*

**s04-03** · *cercana* — Necesitas contemplarla. Una cadena textual busca sus bytes y distingue mayúsculas por defecto. El modificador ascii busca la representación sencilla.

**s04-04** · *concentrada* — Wide busca los caracteres con un byte nulo intercalado. Usar ambos contempla las dos formas de este ejemplo.

**s04-05** · *tranquila* — Nocase permite ignorar las diferencias de mayúsculas y minúsculas del patrón. Aquí ayuda con B. Pero cada ampliación puede incluir más coincidencias.

**s04-06** · *segura* — Y wide no interpreta todo Unicode. Estás cubriendo una representación concreta, no cualquier manera posible de escribir el texto. **(pausa larga)**

## 3. Combinar las evidencias

### El byte que cambia

**s05-01** · *pensativa* — Ahora compara la secuencia de bytes de A y C. Hay una posición que cambia.

**s05-02** · *animada* — Una cadena hexadecimal permite describir bytes concretos y dejar una variación donde la evidencia la justifica. Fíjate en la posición que cambia en pantalla.

**s05-03** · *firme* — En el patrón de pantalla, el comodín de dos interrogaciones acepta cualquier valor para ese byte. El resto permanece fijo. También existen comodines para medio byte.

**s05-04** · *tranquilizadora* — Pero poner más comodines no es mejorar automáticamente la regla. Es permitir más contenido.

**s05-05** · *con curiosidad* — En este ejercicio sabemos por qué dejamos variar esa posición. Con datos reales necesitarías una razón equivalente.

**s05-06** · *cercana* — Si el patrón queda demasiado amplio, controles ajenos pueden compartirlo. La condición tendrá que combinarlo con otras evidencias del objetivo. **(pausa larga)**

### La ruta cambia, el marcador permanece

**s06-01** · *concentrada* — Las tres variantes conservan el marcador. Dos tienen la misma ruta de demostración.

**s06-02** · *tranquila* — C cambia esa ruta, pero conserva la secuencia de bytes con la variación que acabas de contemplar.

**s06-03** · *segura* — Eso sugiere una condición con una parte necesaria y dos alternativas.

**s06-04** · *pensativa* — Exiges el marcador y, además, la ruta o el patrón de bytes. Los paréntesis agrupan las alternativas.

**s06-05** · *animada* — Si los colocas de otra manera, podrías permitir que los bytes solos bastaran. Y tenemos un control que contiene solo esos bytes.

**s06-06** · *firme* — Esta es la hipótesis, dicha antes del código. Un marcador junto a una evidencia alternativa. No todas las cadenas a la vez, porque perderías C.

**s06-07** · *tranquilizadora* — Tampoco cualquiera de ellas, porque aceptarías controles. La combinación se justifica por el objetivo y los ejemplos. **(pausa larga)**

## 4. Los bordes del objetivo

### El manual que copia los patrones

> *(En pantalla, no se lee: mensaje de HOLLOW LANTERN — «Si contiene todas tus cadenas, ya está demostrado.». Tú contestas:)*

**s07-01** · *con curiosidad* — El manual del ejercicio copia todas las cadenas y sigue fuera del objetivo. Necesitamos mirar también dónde están y qué estamos describiendo.

**s07-02** · *cercana* — En este formato inventado, la cabecera debe estar al principio. En el manual no lo está.

**s07-03** · *concentrada* — Añadimos ese requisito y un tamaño menor de cuatro kilobytes, porque forman parte del contrato del ejercicio. Ninguno demuestra malicia. Solo acotan el contenido que buscamos.

**s07-04** · *tranquila* — Una restricción útil para este objetivo puede excluir algo relevante para otro.

**s07-05** · *segura* — Esto no es una validación de ejecutables reales. La cabecera es inventada y los datos son inertes.

**s07-06** · *pensativa* — Si el objetivo fueran ejecutables, justificarías una comprobación del formato. Ver solo las letras iniciales de un supuesto ejecutable no basta para validar toda su estructura. **(pausa larga)**

### Lo que dejas fuera también es una decisión

**s08-01** · *animada* — La condición pide un tamaño menor de cuatro kilobytes. El siguiente archivo mide exactamente cuatro mil noventa y seis bytes.

**s08-02** · *firme* — ¿Cumple ese límite estricto o queda fuera? La palabra menor también forma parte de la regla.

> *(En pantalla: «¿Qué pasa con cuatro mil noventa y seis bytes?». Deja cuatro segundos y medio de silencio; no leas las opciones.)*

**s08-03** · *tranquilizadora* — Queda fuera. En este corpus es lo esperado por el alcance declarado.

**s08-04** · *con curiosidad* — Pero si mañana te piden cubrir variantes más grandes, habrás encontrado una limitación que puede producir falsos negativos.

**s08-05** · *cercana* — No puedes mantener la misma promesa sin volver a comprobarla.

**s08-06** · *concentrada* — Lo mismo ocurre si cambia el marcador. La regla no adivina que una versión nueva conserva la intención del programa. Solo evalúa las condiciones escritas.

**s08-07** · *tranquila* — Necesitas revisar evidencia, objetivo y pruebas antes de ampliar lo que afirmas que detecta. **(pausa larga)**

## 5. Escribir y comprobar

### Escribir no es ejecutar

**s09-01** · *segura* — Ahora puedes escribir la regla en el editor de la lección. El navegador permite preparar y descargar texto. No lo compila ni lo ejecuta.

**s09-02** · *pensativa* — YARA Forge es otra actividad. Simula resultados mediante etiquetas preparadas para su pequeño ejercicio.

**s09-03** · *animada* — Para comprobar sintaxis y coincidencias necesitas un motor real. El paquete de la práctica incluye datos inertes, instrucciones y un verificador.

**s09-04** · *firme* — Compilar comprueba la sintaxis para ese motor. Ejecutar aplica la regla a los archivos. Son comprobaciones distintas.

**s09-05** · *tranquilizadora* — Aunque compile, todavía puede fallar en lo que quieres detectar. Puede coincidir con controles o perder variantes.

**s09-06** · *con curiosidad* — La validación exige resultados por archivo y una explicación de esos errores. Es lo que haremos al contrastar la regla completa. **(pausa larga)**

### Tu hipótesis, escrita

**s10-01** · *cercana* — Tres reglas antes de escribir. Define qué entra en el objetivo. Justifica los patrones y su combinación.

**s10-02** · *concentrada* — Y trata cada restricción como una decisión de cobertura que tendrás que comprobar. No como una garantía automática de calidad.

**s10-03** · *tranquila* — En este caso, la condición exige un marcador y una evidencia alternativa, dentro de un formato y un tamaño pactados.

**s10-04** · *segura* — Eso explica por qué algunas cadenas son necesarias y otras pueden variar. La explicación tiene que sobrevivir a la lectura del código.

**s10-05** · *pensativa* — Abre ahora el editor de la lección y escribe tu versión antes de desplegar la solución. Descárgala para conservarla.

**s10-06** · *animada* — Si no puedes explicar por qué un control debería quedar fuera, vuelve al objetivo. La condición debe expresar una razón, no una cifra elegida por costumbre. **(pausa larga)**

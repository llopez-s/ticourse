# Guion para grabar · El infostealer número uno depende de qué estés contando

**Versión definitiva** · guion congelado el 2026-10-19.

Lee de corrido y en orden, **a ritmo de conversación**: como si se lo contaras a una amiga, no como quien lee.
Entre frase y frase deja un respiro corto; los silencios se recortan solos y el vídeo se acelera un poco (×1,08) al montarlo.
Si algo sale mal, **calla un segundo y repite la oración que falló desde su principio** (no hace falta la frase entera) y sigue: el importador se queda con la última toma de cada oración.
No hagas pausas largas dentro de una frase: si necesitas respirar, termina antes la oración.
Al acabar la última frase, deja dos segundos de silencio antes de parar la grabación.
Guárdala como `video/engine/voices/stealers-metricas lidia.wav`.
Lo que va entre paréntesis en cursiva es solo cómo pronunciar; la *dirección* de cada frase es orientativa.
Los mensajes interceptados y las preguntas para pensar salen en pantalla: **no se leen**. Los dominios, IP y correos tampoco: están en pantalla.

## 1. El titular

### Tres ganadores en una tabla

**s01-01** · *con curiosidad* — Una tabla tiene tres ganadores distintos. Vas a ver cómo pasa y cuál de sus métricas ayuda a decidir una prioridad para tu organización.

**s01-02** · *cercana* — Comparas programas pensados para robar información del dispositivo. Ese tipo de malware se llama infostealer. Estamos en un ejercicio de Meridian, una empresa aeroespacial.

**s01-03** · *concentrada* — Las familias Bruma, Cobalto y Duna son inventadas. Sus datos de septiembre tampoco son un ranking real.

**s01-04** · *tranquila* — Una familia destaca por archivos distintos. Otra por dispositivos observados. La tercera por registros robados. Antes de preguntar cuál es la primera, pregunta qué estás contando.

**s01-05** · *segura* — Esas columnas describen cosas diferentes y pueden conducir a decisiones diferentes. **(pausa larga)**

### El programa y quien lo usa

**s02-01** · *pensativa* — Una familia de malware agrupa código o capacidades según unos criterios. Un operador usa ese malware. Un distribuidor lo entrega a objetivos.

**s02-02** · *animada* — Una campaña agrupa actividad con alcance y periodo. Un broker comercializa acceso. No son nombres para la misma cosa.

**s02-03** · *firme* — La misma familia puede estar en manos de varios operadores. Un operador puede usar más de una familia.

**s02-04** · *tranquilizadora* — Y quien anuncia unos datos puede no ser quien los obtuvo. El ecosistema no encaja en una fila con un programa y una persona.

**s02-05** · *con curiosidad* — Por eso una etiqueta de familia no atribuye automáticamente al autor del robo ni al vendedor.

**s02-06** · *cercana* — Identificar el código ayuda, pero la autoría y las relaciones comerciales necesitan otras evidencias. Conserva ese límite cuando compares actividad y cuando escribas conclusiones. **(pausa larga)**

## 2. Qué cuenta cada columna

### Miles de registros no son miles de equipos

> *(En pantalla, no se lee: mensaje de PAPER CRANE — «Ocho mil registros. Ocho mil equipos infectados.». Tú contestas:)*

**s03-01** · *concentrada* — No son la misma unidad. En nuestra tabla, Bruma tiene ocho mil registros y cien dispositivos observados. Un equipo puede producir muchas entradas.

**s03-02** · *tranquila* — Un paquete de datos robados tampoco equivale automáticamente a una credencial válida.

**s03-03** · *segura* — Una muestra es un archivo contado con el criterio que declares, por ejemplo su hash. Un episodio de infección es otro tipo de evento.

**s03-04** · *pensativa* — El mismo dispositivo puede tener varios. Cambiar el empaquetado puede generar muchos archivos sin sumar equipos afectados.

**s03-05** · *animada* — También debes definir víctima. ¿Hablas de una persona o de una organización? Una empresa puede tener muchos dispositivos. Varias cuentas pueden corresponder a alguien.

**s03-06** · *firme* — Si no dices qué cuenta una fila, el titular puede parecer exacto y estar comparando unidades incompatibles. **(pausa larga)**

### Ordenar otra columna

**s04-01** · *tranquilizadora* — Bruma lidera por muestras. Ahora cambia la columna a dispositivos observados. ¿Sigue primera o pasa delante Cobalto? Mira la unidad antes de elegir.

**s04-02** · *con curiosidad* — No necesitas convertir una cifra en otra para ordenar esa columna.

> *(En pantalla: «Por dispositivos, ¿Bruma o Cobalto?». Deja cuatro segundos y medio de silencio; no leas las opciones.)*

**s04-03** · *cercana* — Pasa Cobalto, con cuatrocientos cincuenta dispositivos, frente a los cien de Bruma. Por registros gana Duna. También tiene más organizaciones en esta tabla.

**s04-04** · *concentrada* — No hay una contradicción. Cada clasificación responde a una pregunta distinta.

**s04-05** · *tranquila* — Y no sumes organizaciones de varias familias como si fueran grupos separados. Una misma organización puede aparecer en más de una fila.

**s04-06** · *segura* — Para calcular un total necesitas identificar y deduplicar esos solapamientos. La tabla no convierte automáticamente las poblaciones en independientes. **(pausa larga)**

## 3. Qué puede observar la fuente

### Una cifra necesita su método

**s05-01** · *pensativa* — El proveedor de ejemplo ve dos regiones y una selección de anuncios. No observa todo el mundo. Las cifras describen esa cobertura.

**s05-02** · *animada* — Para compararlas, necesitas la ventana temporal y la forma en que se han eliminado duplicados.

**s05-03** · *firme* — Aquí los archivos se separan por hash. Los episodios se agrupan por equipo y día. Los dispositivos usan un identificador estable.

**s05-04** · *tranquilizadora* — Son decisiones del ejercicio, no reglas universales. Identificadores que cambian pueden dividir un mismo equipo o unir varios por error.

**s05-05** · *con curiosidad* — Los registros repetidos se deduplican según dispositivo, artefacto y fecha de obtención. Una reventa no suma otra infección.

**s05-06** · *cercana* — Y obtener los datos, publicarlos y venderlos son momentos distintos. Confundir esas fechas puede hacer parecer reciente una exposición antigua. **(pausa larga)**

### Lo que ve el proveedor

**s06-01** · *concentrada* — Un proveedor puede observar más Cobalto porque tiene más clientes del sector donde aparece. Puede recibir más Bruma porque circulan muchos archivos reempaquetados.

**s06-02** · *tranquila* — También puede recibir anuncios repetidos de Duna por reventas. Esos anuncios no deben aumentar los registros únicos de la tabla.

**s06-03** · *segura* — Si añade sensores o cambia etiquetas entre meses, sus cifras pueden subir sin que haya crecido la amenaza.

**s06-04** · *pensativa* — Antes de comparar, revisa si el método y la población siguen siendo comparables.

**s06-05** · *animada* — Llamamos prevalencia observada a la frecuencia dentro de esa visibilidad y esa definición. No es automáticamente una cuota global. Tampoco es la prioridad de Meridian.

**s06-06** · *firme* — Para esa decisión todavía falta conectar los datos con la exposición y las necesidades de la empresa. **(pausa larga)**

## 4. Qué importa a Meridian

### La pregunta de Meridian

> *(En pantalla, no se lee: mensaje de PAPER CRANE — «La que tiene más muestras es tu mayor riesgo.». Tú contestas:)*

**s07-01** · *tranquilizadora* — No necesariamente. Meridian necesita investigar exposición de sesiones en su sector. Mira ahora los dispositivos del sector, la actividad reciente y las capacidades descritas.

**s07-02** · *con curiosidad* — No todas las columnas responden igual a esa necesidad. Compara esas señales antes de elegir una familia.

**s07-03** · *cercana* — Nada de eso prueba que Meridian esté comprometida. Tampoco demuestra que todos esos operadores tengan las mismas capacidades o que las usaran en cada caso.

**s07-04** · *concentrada* — Las fichas describen lo observado y sus límites. Después debes contrastarlo con exposición interna y otras fuentes.

**s07-05** · *tranquila* — Si el requisito fuera recuperar archivos filtrados, Duna podría merecer otra prioridad. Si cambiaran las aplicaciones que usa Meridian, también cambiaría la relevancia.

**s07-06** · *segura* — La primera posición de una tabla no sustituye una decisión sobre la organización concreta. **(pausa larga)**

### Qué investigar primero

**s08-01** · *pensativa* — Bruma lidera por archivos. Cobalto destaca en otras señales que acabas de comparar.

**s08-02** · *animada* — Si solo puedes empezar una revisión, ¿cuál investigarías primero para el requisito de Meridian? Elige con los datos de sector, actividad reciente y capacidad delante.

> *(En pantalla: «Para Meridian, ¿Bruma o Cobalto primero?». Deja cuatro segundos y medio de silencio; no leas las opciones.)*

**s08-03** · *firme* — Comparas esas señales y priorizas investigar Cobalto en este caso. La confianza es moderada por las limitaciones de fuente y método.

**s08-04** · *tranquilizadora* — Priorizar investigación no significa declarar una infección propia. Tampoco autoriza medidas automáticas sobre personas o sistemas.

**s08-05** · *con curiosidad* — Escribe qué podría cambiar la prioridad. Una fuente independiente, nueva evidencia interna o una corrección de duplicados. Si llega esa información, revisas el juicio.

**s08-06** · *cercana* — La clasificación no es una etiqueta permanente que se queda pegada a la familia. **(pausa larga)**

## 5. La conclusión útil

### El equipo no vale más por recibir más muestras

**s09-01** · *concentrada* — Estas cifras describen el fenómeno que observa la fuente. Las métricas del equipo de inteligencia responden a otra pregunta.

**s09-02** · *tranquila* — Si sus productos ayudan a resolver requisitos, orientar decisiones y mejorar resultados. No son intercambiables.

**s09-03** · *segura* — Recibir más archivos no demuestra que el equipo aporte más valor. Recibir menos tampoco prueba que haya reducido el riesgo.

**s09-04** · *pensativa* — Puede haber cambios de cobertura, de actividad o de colección. Necesitas conectar el trabajo con sus consumidores y sus decisiones.

**s09-05** · *animada* — En la entrega, separa la clasificación de amenazas de la evaluación del programa. Explica qué observaste y qué decisión ayuda a tomar.

**s09-06** · *firme* — Si no sabes qué parte del resultado depende del equipo, no conviertas una coincidencia temporal en una causa demostrada. **(pausa larga)**

### Un titular con sus bordes

**s10-01** · *tranquilizadora* — Tres reglas para que el titular no te engañe. Di qué cuentas y en qué periodo.

**s10-02** · *con curiosidad* — Explica cómo se deduplica y qué parte del mundo observa la fuente. Después relaciona los datos con el requisito de la organización.

**s10-03** · *cercana* — Puedes decir que Bruma lidera por muestras y Cobalto por dispositivos en este dataset. También que investigarías antes Cobalto para esta necesidad de Meridian.

**s10-04** · *concentrada* — Son afirmaciones compatibles porque sus unidades y sus propósitos están claros.

**s10-05** · *tranquila* — Abre ahora el dataset de la lección de análisis. Ordénalo con dos métricas y justifica tu primera prioridad de investigación.

**s10-06** · *segura* — Añade una limitación de cobertura y una evidencia que te haría cambiar. El número uno necesita apellidos antes de convertirse en una decisión. **(pausa larga)**

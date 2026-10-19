# Guion para grabar · Del hash a los candidatos: pivotar sin inventar parentescos

**Versión definitiva** · guion congelado el 2026-10-19.

Lee de corrido y en orden, **a ritmo de conversación**: como si se lo contaras a una amiga, no como quien lee.
Entre frase y frase deja un respiro corto; los silencios se recortan solos y el vídeo se acelera un poco (×1,08) al montarlo.
Si algo sale mal, **calla un segundo y repite la oración que falló desde su principio** (no hace falta la frase entera) y sigue: el importador se queda con la última toma de cada oración.
No hagas pausas largas dentro de una frase: si necesitas respirar, termina antes la oración.
Al acabar la última frase, deja dos segundos de silencio antes de parar la grabación.
Guárdala como `video/engine/voices/muestra-candidatos lidia.wav`.
Lo que va entre paréntesis en cursiva es solo cómo pronunciar; la *dirección* de cada frase es orientativa.
Los mensajes interceptados y las preguntas para pensar salen en pantalla: **no se leen**. Los dominios, IP y correos tampoco: están en pantalla.

## 1. Una muestra, varias preguntas

### El parecido no termina el caso

**s01-01** · *con curiosidad* — Dos archivos se parecen. ¿Son de la misma familia? Vas a seguir una muestra hasta una conclusión que puedas defender, sin saltarte las dudas.

**s01-02** · *cercana* — Trabajas con fichas inventadas en un ejercicio de Meridian, una empresa aeroespacial. No vas a descargar ni ejecutar malware. La muestra inicial se llama A.

**s01-03** · *concentrada* — Lo que tenemos de ella son observaciones que pueden abrir otras búsquedas.

**s01-04** · *tranquila* — Buscar a partir de una observación es pivotar. Pero lo que recuperas son candidatos. Después necesitas contrastarlos.

**s01-05** · *segura* — El recorrido no termina cuando el buscador devuelve una lista. Termina cuando puedes explicar qué relación sostienes, con qué confianza y qué falta por comprobar. **(pausa larga)**

### Los mismos bytes o rasgos parecidos

**s02-01** · *pensativa* — Puedes calcular una huella del contenido de un archivo. Se llama hash criptográfico y ayuda a reconocer los mismos bytes.

**s02-02** · *animada* — Cambiar el contenido puede cambiar completamente esa huella. Otro hash no significa automáticamente otra familia.

**s02-03** · *firme* — Algunos ejecutables toman funciones de otras bibliotecas. El imphash resume esas importaciones y ayuda a encontrar archivos que las comparten.

**s02-04** · *tranquilizadora* — No demuestra que se usara el mismo compilador. Programas no relacionados también pueden coincidir en ellas.

**s02-05** · *con curiosidad* — Otros métodos buscan parecidos en lugar de una huella exacta. Lo llamamos hashing difuso. Ssdeep es uno de esos métodos.

**s02-06** · *cercana* — Prioriza semejanzas, sin asignar una probabilidad de parentesco. Una biblioteca común puede explicar parte del parecido. Necesitas contexto para concluir. **(pausa larga)**

## 2. Buscar parecidos

### La etiqueta y la firma

> *(En pantalla, no se lee: mensaje de HOLLOW LANTERN — «Mismo PDB. Ya sabes quién lo escribió.». Tú contestas:)*

**s03-01** · *concentrada* — No sabes quién lo escribió solo por esa ruta. Un PDB es un archivo de símbolos de depuración.

**s03-02** · *tranquila* — Algunos binarios conservan una ruta que puede dar pistas sobre el proyecto. Esa ruta también puede copiarse o falsearse.

**s03-03** · *segura* — Las cadenas distintivas y la configuración aportan otras pistas. Una estructura poco común puede ser más útil que una palabra genérica.

**s03-04** · *pensativa* — Aun así, considera código reutilizado y señuelos. Pregunta si el rasgo distingue de verdad las explicaciones que estás comparando.

**s03-05** · *animada* — Con las firmas de código ocurre algo parecido. Comprueba el certificado y la validez de la firma. El material puede ser robado o compartido entre productos.

**s03-06** · *firme* — Una firma no demuestra benignidad. Un mismo certificado tampoco demuestra por sí solo una familia, campaña o actor. **(pausa larga)**

### Qué significa ese noventa y cuatro

**s04-01** · *tranquilizadora* — El candidato C comparte imports y tiene una puntuación alta de similitud. La ficha explica que ambos rasgos vienen de una biblioteca común.

**s04-02** · *con curiosidad* — ¿Confirmas la familia o buscas evidencia que distinga esa explicación de un parentesco real?

> *(En pantalla: «¿Confirmas C o buscas qué lo distingue?». Deja cuatro segundos y medio de silencio; no leas las opciones.)*

**s04-03** · *cercana* — Buscas evidencia que las distinga. La cifra no dice que exista un noventa y cuatro por ciento de probabilidad de pertenecer a la familia.

**s04-04** · *concentrada* — Y si dos señales salen del mismo componente, no tienes dos corroboraciones independientes.

**s04-05** · *tranquila* — C queda como una coincidencia débil. No lo incorporas al conjunto por ahora. Tampoco lo declaras benigno. Has aprendido algo más limitado.

**s04-06** · *segura* — Ese parecido concreto tiene una explicación alternativa que todavía no has descartado. **(pausa larga)**

## 3. Leer las relaciones

### La consulta conserva su pregunta

**s05-01** · *pensativa* — En VirusTotal puedes partir del hash de un informe existente. Eso es distinto de subir el archivo.

**s05-02** · *animada* — Las búsquedas avanzadas permiten usar imports, contenido o metadatos como claves. Aquí ves consultas ilustrativas. Los valores son inventados y no las ejecutamos.

**s05-03** · *firme* — Cada consulta debe responder una pregunta. Buscar una cadena concreta puede recuperar candidatos que la contienen.

**s05-04** · *tranquilizadora* — Buscar metadatos puede encontrar una ruta de depuración, pero también otros campos. Abre el resultado y comprueba qué coincidió antes de sacar conclusiones.

**s05-05** · *con curiosidad* — El acceso a contenido, relaciones y búsquedas depende del producto, los permisos y los datos disponibles.

**s05-06** · *cercana* — Si no tienes esas funciones, usa las fichas del ejercicio o informes públicos con procedencia.

**s05-07** · *concentrada* — No necesitas pagar para practicar el razonamiento ni subir datos sensibles para completar la lección. **(pausa larga)**

### Una línea no cuenta cómo ocurrió

**s06-01** · *tranquila* — Las relaciones también tienen significado. Una dirección escrita dentro de un archivo no prueba que se contactara.

**s06-02** · *segura* — Un contacto observado no demuestra que ese servidor lo controle el atacante. Puede ser un servicio compartido o una comprobación legítima.

**s06-03** · *pensativa* — D comparte una dirección de alojamiento con A durante un intervalo amplio. El servidor tiene varios clientes. Esa coincidencia no basta para unirlos.

**s06-04** · *animada* — Antes revisas cuándo resolvió cada dominio, qué servicio era y qué evidencia vincula realmente las actividades.

**s06-05** · *firme* — Distingue también los certificados del servidor de los certificados de firma de código. Vinculan objetos diferentes. Mantén la dirección y la fuente de cada relación.

**s06-06** · *tranquilizadora* — Si dibujas todas las líneas iguales, el grafo parece más concluyente de lo que es. **(pausa larga)**

## 4. Decidir con alternativas

### El candidato que sí gana peso

> *(En pantalla, no se lee: mensaje de HOLLOW LANTERN — «Si encaja en tu grafo, mételo ya en la campaña.». Tú contestas:)*

**s07-01** · *con curiosidad* — Encajar en el dibujo no basta. B comparte una cadena distintiva y la estructura de configuración. Además presenta una secuencia de carga y un comportamiento concordantes.

**s07-02** · *cercana* — Dos informes de origen distinto aportan observaciones que puedes contrastar.

**s07-03** · *concentrada* — B sostiene mejor la hipótesis de código relacionado. Aun así, revisa si las fuentes son independientes y si un componente reutilizado explicaría las coincidencias.

**s07-04** · *tranquila* — Puedes mantenerlo como relacionado probable con confianza moderada, dentro de ese alcance.

**s07-05** · *segura* — No has demostrado que pertenezca a la misma campaña ni que lo use el mismo operador. Código, actividad y autoría son niveles diferentes.

**s07-06** · *pensativa* — Tu conclusión debe nombrar el nivel que la evidencia permite, en lugar de subir todos los escalones de una vez. **(pausa larga)**

### La casilla vacía

**s08-01** · *animada* — Para E, alguien menciona la misma ruta de depuración, pero no aporta bytes ni procedencia del dato. No tienes acceso a un informe que permita contrastarlo.

**s08-02** · *firme* — ¿Escribes que no tiene relaciones o que el dato no está disponible?

> *(En pantalla: «¿Sin relaciones o dato no disponible?». Deja cuatro segundos y medio de silencio; no leas las opciones.)*

**s08-03** · *tranquilizadora* — Que no está disponible. Eso describe tu limitación de colección. No demuestra ausencia de relaciones, benignidad ni pertenencia al conjunto.

**s08-04** · *con curiosidad* — Conservas E como una pista pendiente, con confianza baja, y pides la evidencia que falta.

**s08-05** · *cercana* — Una búsqueda sin resultados merece el mismo cuidado. Puede depender de la cobertura, los filtros o la falta de datos.

**s08-06** · *concentrada* — No rellenes un hueco inventando un resultado. Registrar una limitación también es avanzar, porque deja claro qué necesitas para decidir. **(pausa larga)**

## 5. Dejar el razonamiento

### Que otra persona pueda seguirte

**s09-01** · *tranquila* — Deja una bitácora que otra analista pueda seguir. Qué consultaste, con qué filtros y cuándo. Qué fecha corresponde a la observación.

**s09-02** · *segura* — Qué evidencia conservaste y cuál es su origen. Incluye las búsquedas fallidas y las funciones que no estaban disponibles.

**s09-03** · *pensativa* — La conclusión del caso mantiene B como relacionado probable por código. C y D no se incorporan con la evidencia actual. E sigue pendiente.

**s09-04** · *animada* — Esa decisión no mezcla un candidato débil con uno descartado para siempre.

**s09-05** · *firme* — Escribe también qué cambiaría tu juicio. Validar más variantes, contrastar configuración o conseguir una observación independiente. La confianza no es una decoración del informe.

**s09-06** · *tranquilizadora* — Resume cuánto sostienen los datos y qué tan abiertas siguen las alternativas. **(pausa larga)**

### La investigación que puedes explicar

**s10-01** · *con curiosidad* — Tres reglas. El hash exacto identifica bytes y los pivotes generan candidatos. Las coincidencias necesitan contexto e independencia.

**s10-02** · *cercana* — Y tu conclusión debe conservar las dudas que los datos todavía no resuelven.

**s10-03** · *concentrada* — No has perdido rigor por decir que algo falta. Lo pierdes si conviertes una puntuación, una ruta o una dirección compartida en una familia confirmada.

**s10-04** · *tranquila* — El objetivo no es llenar el grafo. Es sostener una relación que resista las alternativas.

**s10-05** · *segura* — Abre ahora el caso de candidatos de la lección de malware como colección. Decide qué harías con cada ficha y escribe el motivo.

**s10-06** · *pensativa* — Si tu conclusión llega hasta un actor, revisa qué evidencia te permitió llegar tan lejos. Una línea en el grafo no lo decide por ti. **(pausa larga)**

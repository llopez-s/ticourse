# Pista «Redes y ENS» · Bloque `op6`: ENS y normativa

> Diseño del 2026-11-26. Sigue a `2026-11-26-pista-opo-temario-design.md` (un bloque por tema; `op6` es el
> primero del orden de trabajo). Lidia eligió el nivel de detalle **B** (cifras, nombres **y** artículos y
> anexos) y el reparto **A** (siete lecciones). El repositorio sigue siendo genérico: no se nombra ninguna
> convocatoria.

## Intención

`op6` cubre el tema 9 del temario de referencia («Esquema Nacional de Seguridad, protección de datos y buenas
prácticas de gobierno de la seguridad») y el hueco del tema 8 que Security+ no toca: la firma y la
identificación electrónicas en su vertiente española y europea. La prueba es teórico-práctica, así que el
bloque tiene que servir para las dos cosas: un test que puede preguntar qué dice un artículo o un anexo
concreto, y casos prácticos en los que hay que aplicar la norma a un sistema.

El enunciado del tema 9 es una sola línea, sin apartados. El reparto en siete lecciones es, por tanto, la
decisión de cobertura, no una copia del temario. El temario se queda fuera del repositorio a propósito.

## Objetivos

- Siete lecciones (`op6m1`–`op6m7`) con unas 8 preguntas cada una (≈56), *checkpoints* en línea y bloques
  `links` hacia Security+ donde ya se enseña lo mismo.
- Preguntas de tres tipos, mezcladas en cada lección: cifra o nombre exacto (categorías, plazos, roles, códigos
  de medida), **artículo o anexo** («¿qué regula el artículo X?», «¿en qué anexo está…?») y aplicación a un
  caso corto del Consorcio.
- Tres laboratorios, unas 40 tarjetas y unas 55 entradas de glosario (con `ca` solo si TERMCAT o la Viquipèdia
  lo confirman).
- Dos supuestos con el motor ya publicado (`op6s1`, `op6s2`).
- Jefe final de sección (`boss`) y su fragmento de dossier, como en `op1`.
- El cambio de motor previsto en el diseño de la pista (seis dominios, pesos iguales).

## No objetivos

- Repetir Security+: gestión de riesgos, auditorías genéricas, controles técnicos, criptografía y PKI se
  enlazan (`sp5m*`, `sp1m4`…), no se reescriben.
- Vídeos del bloque, prueba de nivel y logros de la pista (proyectos aparte).
- Normativa catalana o de cualquier comunidad concreta más allá de nombrar las autoridades autonómicas de
  protección de datos como ejemplos.

## Antiobjetivos (lo que lo haría fracasar aunque funcione)

- **Un solo artículo, plazo o código de medida escrito de memoria.** Todo sale del texto consolidado del BOE o
  del DOUE (y de las guías CCN-STIC para lo que desarrollan), con la fecha de la versión consolidada anotada.
  Un número de artículo equivocado en una pregunta de nivel B es peor que no preguntarlo.
- Presentar normas derogadas o sustituidas como vigentes (RD 3/2010, eIDAS sin la reforma de 2024, NIS en vez
  de NIS2 sin decirlo).
- Nombrar la convocatoria, decir que alguien se presenta o escribir «como en el examen» / «tipo examen».
- Preguntas en inglés o anglicismos de oficina.

## Restricciones

- Todo en español, siglas en su forma habitual (ENS, RGPD, LOPDGDD, DPD, EIPD, CCN-CERT, eIDAS).
- Escenario del Consorcio Provincial de Arcedo con el canon de `docs/superpowers/canon/arcedo.md`. Lo nuevo que
  el bloque fije (quién ocupa cada rol del ENS, la categoría de la sede electrónica, la autoridad de control)
  se añade al canon.
- `npm test` y `npm run build` en verde; revisor de exactitud de solo lectura que coteje **cada artículo y cada
  cifra** con la fuente, y una segunda pasada solo sobre sus correcciones.
- Ids: sección `op6`, lecciones `op6m1`…`op6m7`, preguntas `op6m1q1`…, tarjetas `fco601`…, labs
  `opl6a`/`opl6b`/`opl6c`, supuestos `op6s1`/`op6s2`.

## Enfoques considerados (elegido: A)

- **A. Siete lecciones, una por pieza de la norma (elegido).** El ENS en cuatro lecciones (marco, categorías,
  medidas, conformidad e incidentes), protección de datos, gobierno y firma una cada una. Ninguna lección se
  sobrecarga con el nivel B. Es la opción más cara.
- B. Seis lecciones, categorización y medidas juntas. La de medidas, con más de 70 códigos y sus artículos,
  quedaría demasiado larga.
- C. Las cinco previstas en el diseño general (ENS en dos lecciones). Con el nivel B, cada lección del ENS
  doblaría en longitud a las de `op1`.

## Lecciones

| Id | Título de trabajo | Contenido mínimo | Fuente principal |
|---|---|---|---|
| `op6m1` | El ENS: marco, principios y roles | objeto y ámbito (incluido el sector privado que presta servicios o provee soluciones al sector público), estructura del RD (capítulos y anexos), principios básicos, requisitos mínimos, política de seguridad, roles y separación de funciones (responsable de la información, del servicio, de la seguridad, del sistema) | RD 311/2022 |
| `op6m2` | Categorizar un sistema | dimensiones (C, I, T, A, D), niveles BAJO/MEDIO/ALTO, regla de la categoría del sistema, quién valora y quién aprueba, declaración de aplicabilidad, perfiles de cumplimiento específicos | RD 311/2022 anexo I; CCN-STIC 803 |
| `op6m3` | Las medidas del anexo II | marco organizativo (`org`), operacional (`op.*`) y medidas de protección (`mp.*`); cómo se seleccionan por categoría y dimensión, refuerzos, medidas compensatorias y complementarias; los códigos que más se usan | RD 311/2022 anexo II; CCN-STIC 804 |
| `op6m4` | Conformidad, auditoría e incidentes | declaración y certificación de conformidad, auditoría ordinaria y extraordinaria (periodicidad, anexo III), informe del estado de la seguridad, respuesta y notificación de incidentes al CCN-CERT, relación con la normativa NIS/NIS2 **en el estado que tenga en el BOE en la fecha de redacción** | RD 311/2022 anexo III y artículos de incidentes; RD 43/2021; RDL 12/2018; Directiva (UE) 2022/2555; CCN-STIC 808, 817, 824 |
| `op6m5` | Protección de datos en la administración | principios, bases jurídicas (misión de interés público y obligación legal), derechos, responsable y encargado, registro de actividades, DPD obligatorio en las administraciones, EIPD, brechas (72 horas a la autoridad, comunicación a los afectados), régimen sancionador de las administraciones, relación ENS–LOPDGDD, AEPD y autoridades autonómicas | RGPD (UE 2016/679); LO 3/2018 |
| `op6m6` | Gobierno de la seguridad | SGSI y estructura de ISO/IEC 27001:2022, temas y número de controles de 27002:2022 (solo lo público), política y normativa interna, comité de seguridad, métricas, mejora continua; relación ENS–ISO 27001; serie CCN-STIC 800 como mapa | ISO (resúmenes públicos); RD 311/2022; índice CCN-STIC |
| `op6m7` | Firma e identificación electrónicas | eIDAS consolidado tras el Reglamento (UE) 2024/1183 (cartera europea de identidad digital), firma simple, avanzada y cualificada, sello electrónico, sello de tiempo, certificados cualificados, servicios y prestadores cualificados, listas de confianza; formatos de firma (CAdES, XAdES, PAdES, ASiC) y política de firma, solo a nivel de qué es cada uno y cuándo se usa; Ley 6/2020; identificación y firma de interesados y de la administración en las Leyes 39/2015 y 40/2015 (sede electrónica, sello de órgano, CSV); Cl@ve como ejemplo | Reglamento (UE) 910/2014 consolidado; Ley 6/2020; Ley 39/2015; Ley 40/2015; RD 203/2021 |

Cada lección sigue la forma de `op1` (bloques `Block[]`, *checkpoints*, `callout` de tipo `exam` para lo que
se suele confundir) y termina con un resumen de artículos clave en una tabla («artículo · qué regula»), que es
lo que hace estudiable el nivel B.

## Laboratorios

| Id | Motor | Qué se practica |
|---|---|---|
| `opl6a` | `classify` | categorizar: 12 situaciones del Consorcio (sistema y valoración de sus dimensiones) → categoría BÁSICA / MEDIA / ALTA |
| `opl6b` | `classify` | a quién se avisa: 12 situaciones de incidente → CCN-CERT / autoridad de control / personas afectadas / no hay obligación de notificar, con el artículo y el plazo en la explicación de cada una. **Decisión mía:** no es un lab de ordenar porque las notificaciones del ENS y del RGPD corren en paralelo, cada una con su plazo; la norma no fija un orden entre ellas y una clave de orden no se podría defender |
| `opl6c` | `classify` | cada medida del anexo II en su marco (organizativo, operacional, de protección) o cada artículo en su norma; se elige el que mejor quede con 12 elementos |

Qué motor usa cada uno puede cambiar en el plan si otro de los ocho encaja mejor; el número de labs actualiza
`labChallenge.test.ts`.

## Supuestos

- **`op6s1` «La sede electrónica del Consorcio»** (`sectionIds: ['op6']`). Expediente: descripción del sistema,
  valoraciones del responsable de la información y del servicio, un borrador de declaración de aplicabilidad con
  errores, un extracto del informe de auditoría. Fases: categorizar (dimensiones → categoría), seleccionar y
  corregir medidas, decidir el sello electrónico y el certificado de la sede, responder a hallazgos de auditoría
  (plazos, plan de acción), redactar la nota al comité de seguridad.
- **`op6s2` «El cifrado del registro de entrada»** (`sectionIds: ['op6']`). Ransomware con exfiltración de
  datos personales del registro. Fases: valorar el incidente (nivel de peligrosidad e impacto según la guía del
  CCN), qué se notifica, a quién y en qué plazo (CCN-CERT, autoridad de control, personas afectadas), quién
  decide cada paso según los roles, contención y continuidad, y redactar la comunicación a los afectados.

**Decisiones mías para los dos casos:** ninguna tarea `order` mezcla las notificaciones (se pregunta con
`table`: destinatario, plazo, artículo). Un plazo que no esté en el RD, el RGPD o una guía CCN-STIC concreta
(por ejemplo, el del plan de acción tras una auditoría) no se pregunta como norma: o se cita la guía que lo
fija, o se convierte en un procedimiento propio del Consorcio, anotado en el canon y rotulado así en el caso.

Ambos siguen `docs/supuestos.md`: `refs` a las lecciones y al artículo concreto, nada filtrado antes de su fase,
`variants` solo si convergen.

## Cambios en el motor (con este bloque)

- `types.ts`: el dominio `'Servicios de red y balanceo'` se divide en `'Servicios de red'` y
  `'Balanceo y alta disponibilidad'` (ninguna pregunta lo usa todavía).
- `sections.ts`: `OP_DOMAINS` con seis dominios en el orden del temario, `OP_DOMAIN_WEIGHTS` a 1/6 cada uno y la
  sección `op6` registrada en `OP_SECTIONS`.
- `tracks.ts`: módulos de `op6` en `TRACKS.opo.modules`, labs, tarjetas y glosario esparcidos como en `op1`.
- Vídeo: `OPO_BLOCKS` en `video/engine/scripts/lib/profiles.mjs` pasa a `['Redes', 'Infraestructuras',
  'Servicios de red', 'Balanceo', 'Identidad', 'ENS y normativa']` (con su test y el README del motor).
- Pruebas que fijan totales: `opo.test.ts` (completitud de `op6`), `practical.test.ts`, `labChallenge.test.ts`,
  `acronyms.test.ts` (siglas nuevas en el glosario), `supuestos.test.ts`.
- `CLAUDE.md` y `README.md`: totales de la pista y el bloque nuevo.

## Lo que decide quien lo construya

- El reparto exacto de preguntas por tipo dentro de cada lección y qué artículos se preguntan (los que tengan
  una regla clara y comprobable, no los de mero trámite).
- Qué medidas del anexo II entran en el lab y en las preguntas, siempre con su código tal como aparece en el
  BOE.
- El texto del jefe final, con el tono de `op1`. **Decisión mía:** el fragmento de dossier de `op6` es
  autónomo. Se apoya en el Consorcio y en lo que ya fija `op1`, nunca en `op2`–`op5`, que aún no existen, así
  que no habrá que reescribirlo cuando lleguen.
- **Organismos reales.** La regla del canon «nada de marcas ni organismos reales» se aplica a las entidades del
  escenario (proveedores, equipos, empresas). Los organismos que nombra la ley (CCN, CCN-CERT, AEPD,
  autoridades autonómicas, Cl@ve como sistema de la AGE) se nombran tal cual. Esta aclaración se añade a la
  tabla de reglas del canon.
- **Antes de escribir `op6m4` y `op6m7`**, comprobar en el BOE: si existe ya ley española que transponga NIS2
  (si no, se explica como directiva pendiente de transposición con la fecha de consulta) y qué preceptos de las
  Leyes 39/2015 y 40/2015 y del RD 203/2021 siguen vigentes en la redacción consolidada.
- Para ISO/IEC 27001/27002, que son normas de pago, usar solo lo que ISO publica abiertamente (resumen,
  estructura, número de controles por tema) y decirlo en la lección.

## Fuentes (todas en su versión consolidada; anotar la fecha de consulta)

- Real Decreto 311/2022, Esquema Nacional de Seguridad (BOE-A-2022-7191).
- Reglamento (UE) 2016/679 (RGPD) y Ley Orgánica 3/2018 (BOE-A-2018-16673).
- Reglamento (UE) 910/2014 (eIDAS) consolidado con el Reglamento (UE) 2024/1183; Ley 6/2020 (BOE-A-2020-14046).
- Ley 39/2015 (BOE-A-2015-10565), Ley 40/2015 (BOE-A-2015-10566), Real Decreto 203/2021 (BOE-A-2021-5032).
- Real Decreto-ley 12/2018 y Real Decreto 43/2021 (seguridad de las redes y sistemas de información);
  Directiva (UE) 2022/2555 (NIS2) y su transposición si la hay.
- Guías CCN-STIC 803, 804, 808, 817, 824 y el índice de la serie 800 (ccn-cert.cni.es).

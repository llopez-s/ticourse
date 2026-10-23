# Tanda GCTI · G01–G07 · ficha de diseño (borrador, 22-10-2026)

Cubre las **11 lecciones de GCTI que todavía no tienen vídeo ni guion**. Las otras 16 ya están cubiertas:

- **Con vídeo propio (11):** s2m1, s2m2, s2m3, s2m4, s2m5, s3m2, s3m3, s3m5, s4m3, s4m5 y s5m3 (V3, V4, V7, V8, V9, V13–V15, V22, V23, V27).
- **Con guion AP congelado (5):** s3m1, s3m4, s4m2 (AP03), s4m4 y s5m5 (AP07). AP04, AP05 y AP06 repasan además s3m2, s3m3, s3m5 y s5m3.

Las once que faltan: **s1m1, s1m2, s1m3, s1m4, s1m5, s4m1, s5m1, s5m2, s5m4, s6m1 y s6m2.**

Comprobado contra `origin/main` (la copia local de `main` va 172 commits por detrás).

## Cómo se ha decidido

- **Formato: el de GCTI que ya existe** (`principal-yt` y `capsula-yt`, voz `recording/lidia`, tarjetas de examen con insignia «GCTI» y el dominio del curso, mensajes interceptados). No hace falta motor nuevo. El diseño de «caso y examen» (`caso-yt`) dejó GCTI fuera a propósito («irá en un diseño aparte», spec del 16-10, §2), así que no lo uso.
- **Se agrupan las lecciones** como hizo la tanda AP (12 lecciones en 7 guiones): una lección de taxonomía sola da una cápsula floja; dos que se apoyan una en otra dan un vídeo con historia. 11 lecciones pasan a **7 vídeos**.
- **Numeración propia `G01–G07`**, como `AP01–AP07`, para no pisar la numeración V de Security+ (que ya va por la V51 y sigue creciendo).
- El plan (§3) había **descartado** ocho de estas lecciones por ser «taxonomías o listas» (s1m1–s1m4, s4m1, s5m2, s6m1, s6m2). Lo mismo se dijo de varias de Security+ y luego se hicieron todas; aquí sigo ese criterio. Cada ficha dice qué pone la historia en lugar de la lista.
- Orden = orden del curso, para que cada vídeo pueda remitir al anterior.

## Los siete

| ID | Slug propuesto | Lecciones | Perfil | Duración | Adversario (intercepts) | Dominio de las tarjetas |
|---|---|---|---|---|---|---|
| G01 | `dato-a-juicio` | s1m1 + s1m2 | principal-yt | 6–8 min | EMBER FOX | Requirements |
| G02 | `niveles-audiencia` | s1m3 | capsula-yt | 3:30–4:20 | EMBER FOX | Requirements |
| G03 | `ciclo-pir` | s1m4 + s1m5 | principal-yt | 7–9 min | EMBER FOX | Requirements |
| G04 | `sesgos-analista` | s4m1 | capsula-yt | 3:30–4:20 | PAPER CRANE | Analysis |
| G05 | `producto-bluf` | s5m1 + s5m2 | principal-yt | 7–9 min | VELVET CICADA | Dissemination |
| G06 | `casos-espejo` | s5m4 | principal-yt | 7–9 min | VELVET CICADA | Dissemination |
| G07 | `examen-indice` | s6m1 + s6m2 | principal-yt | 6–8 min | VELVET CICADA | ver G07 |

Todos llevan `"track": "gcti"`, `"music": "Go On Going - Stayloose.mp3"` y el descargo «no afiliado a SANS/GIAC».

## Fichas

### G01 · `dato-a-juicio` · «Un dato no es inteligencia (y un malware no es una amenaza)»

- **Historia.** Tu primer día en Meridian (`src/data/s1.ts:749`): primera analista CTI, rumores de robo de diseños en el sector, consejo nervioso. El CISO te pasa una IP de un log y te pregunta qué sabemos. La IP es `141.98.6.10`, que la propia lección ya usa («el martes sirvió un panel de phishing», `s1.ts:27,32`).
- **Conceptos (5).**
  1. Data → information → intelligence: lo que cambia es el juicio orientado a una decisión.
  2. Kent: se trabaja con incertidumbre irreducible; el juicio dice cuánto de seguro estás.
  3. Threat = intent + capability + opportunity, y buscar qué componente falta.
  4. El malware es capacidad, no la amenaza: la amenaza es quien lo opera.
  5. Risk = threat × vulnerability × consequence: CTI alimenta el factor «threat»; y la ventaja del defensor como enlace a la Kill Chain.
- **Se queda fuera:** proceso/producto/profesión y los INTs (aparecen en una frase; el lab los cubre).
- **Canon.** Nada de los dossiers: ni «VC» ni los destinatarios del spearphishing (eso es lo que revela FIRST LIGHT al vencer al jefe de S1). EMBER FOX solo como voz que provoca con atajos («es solo una IP»).

### G02 · `niveles-audiencia` · «El producto correcto para la persona correcta»

- **Historia.** Dos peticiones el mismo día: el consejo pregunta por tendencias y el SOC por qué bloquear hoy. Se le da a cada uno lo que no era suyo («el error clásico» de la lección) y se ve qué pasa.
- **Conceptos (3).** Tactical / operational / strategic con producto y audiencia; la Sliding Scale (Architecture → Passive → Active → Intelligence → Offense) para clasificar actividades; por qué no se empieza «la casa por el tejado».
- **Canon.** Sin hechos nuevos de la campaña. El SOC y el consejo ya existen sin nombre; se mantienen sin nombre.

### G03 · `ciclo-pir` · «Antes de recoger nada: la pregunta»

- **Historia.** El CISO: «Proponme nuestros primeros PIRs» (`s1.ts` bloque de VELVET CICADA, y es el encargo del Lab 1B). Se recorre el ciclo con ese encargo: dónde falla cada fase cuando nadie definió la pregunta.
- **Conceptos (5).** Las seis fases y su fallo típico; la fase más ignorada es la primera, la segunda más ignorada es el feedback; F3EAD como bucle táctico junto a IR; qué hace bueno a un PIR (una pregunta, específica, ligada a una decisión, priorizada por quien la consume); standing contra ad hoc.
- **Canon.** **No se resuelve el Lab 1B**: el vídeo enseña a reconocer un PIR bien formado con ejemplos de la lección, no con la respuesta del laboratorio.

### G04 · `sesgos-analista` · «El instrumento de medida eres tú»

- **Historia.** La jugadora, convencida de «quién fue» tras ver un patrón horario. Cada dato nuevo se dobla para encajar. Se muestran confirmation, anchoring, availability y la falsa certeza de «un actor sofisticado nunca reutilizaría infraestructura».
- **Conceptos (3–4).** Heurísticas útiles en la vida y traicioneras en el análisis (Heuer); confirmation, anchoring y availability con su frase-señal; por qué ACH obliga a refutar (remite a V9).
- **Canon, y es delicado.** El dossier de HALL OF MIRRORS (strings en cirílico y horarios falsos, `course-gcti.ts:78`) se desbloquea al vencer el boss de S4. **Este vídeo no puede usar «horarios falsos» ni cirílico.** El ejemplo del horario sale de la lección en genérico (UTC+8), sin ninguna pista falsa sobre Meridian.

### G05 · `producto-bluf` · «Escribir para quien decide»

- **Historia.** El 18-4, la ola de phishing a la cadena de suministro (canon ya publicado: 41 correos desde las 06:00 UTC; flash alert MER-FA-2026-014 a las 11:40 UTC; `s5.ts:47-68`). Un mismo hallazgo, tres lectores (SOC, CISO, consejo).
- **Conceptos (5–6).** Audiencia antes que texto; puntualidad contra completitud (flash a las 2 h, informe después); anatomía del flash alert (BLUF, qué no sabemos, acciones con plazo, próximo parte); BLUF; bandas ICD 203; probabilidad ≠ confianza.
- **Canon.** El flash alert es de Meridian CTI y ya está en el registro (§2). Este vídeo **no añade** destinatarios ni acciones nuevas.

### G06 · `casos-espejo` · «Cinco casos y lo que enseñó cada uno»

- **Historia.** El CISO pregunta «¿esto ya ha pasado antes?». Cada caso es un espejo de algo que ya hiciste: MOONLIGHT MAZE (espionaje estatal temprano, persistencia), APT1 (atribución pública con evidencia: llegar a sponsor-level), Sony/Lazarus (destructivo + atribución por gobierno), DNC 2016 (dos intrusion sets en la misma red: no se fusionan), Cloud Hopper/APT10 (proveedores de servicios gestionados como puente).
- **Conceptos (5), uno por caso.** Siempre «qué enseñó» y «qué concepto del curso ilustra», no fechas.
- **Riesgo.** Son hechos reales: el revisor de exactitud tiene que contrastar cada afirmación con la lección y con fuentes públicas, y el guion usa «según el informe de…» y «se atribuyó públicamente a…», nunca el juicio propio. Sin nombres de personas.
- **Canon.** Se puede decir que VELVET CICADA repite estos patrones (frase de la propia lección). No se cuenta el final de la campaña ni el epílogo del Lab 5B.

### G07 · `examen-indice` · «Tu índice vale 60 segundos»

- **Historia.** La noche antes del examen, tú, tu índice impreso y un montón de micronotas. Sin caso de Meridian.
- **Conceptos (4–5).** Open-book significa que no hay tiempo para buscar todo; método de la pregunta (escenario, pregunta, calificador, descartar dos, decidir entre dos); una buena micronota responde sin abrir el libro («ACH → gana la menos inconsistente»); construir el índice mientras estudias; el índice rescata hechos, no juicios.
- **Cuidado con los datos del examen** (75 preguntas, proctored, open-book): la lección dice «verifica siempre en giac.org». El guion lo dice igual, con «según el temario de la app» y sin cifras de aprobado ni de tiempo como si fueran oficiales. Descargo de no afiliación reforzado.
- **Decisiones abiertas de motor/estilo.** (a) `s6` no tiene boss ni adversario; propongo **VELVET CICADA** como voz de los mensajes (el perfil exige 2 mensajes), con atajos de examen («llévate el libro entero») y sin revelar nada nuevo. (b) Las tarjetas de examen GCTI exigen uno de los cinco dominios; en este vídeo cada tarjeta llevaría el dominio del hecho que ejemplifica.

## Qué haré al aprobarse

Por vídeo, con el orden del plan (§8): leer el registro de canon, escribir `video.json`, `storyboard.json`, `narration.json` y `lexicon.json`, pasar `canon-check.mjs` y `build-timeline.mjs --estimate`, lanzar las dos revisiones (exactitud y naturalidad) y **solo entonces** congelar y sacar la hoja de grabación. Un agente de contenido por vídeo, un revisor de exactitud y uno de naturalidad por lote. Nada se fusiona ni se sube sin que lo pidas.

## Cosas que me gustaría que decidieras

1. ¿Te encajan **siete vídeos** (agrupando) o prefieres **once** (uno por lección)?
2. ¿Hago los siete o empiezo por los que más peso tienen para el examen (G01, G03, G05)?
3. G06 usa casos reales: ¿lo mantenemos con ese cuidado o lo dejamos para el final?

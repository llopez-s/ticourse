# Segunda pasada · V41 `roles-halden` (sp5m2, `caso-yt`)

Revisado el 2026-10-23, solo lectura, sobre `video/roles-halden/narration.json` y `storyboard.json` ya corregidos (712 palabras). Contrasté con el informe `roles-halden.md`, con «Revisión 2026-10-23» de `out/script-notes.md`, con la lección (`sp5-part1.ts`, ya citada en el informe) y con `docs/superpowers/canon/glass-harbor.md` (búsquedas por los términos nuevos: ferry, lista de pasajeros, oficina de la terminal, oficina de planificación, Atención al Pasajero, comité de seguridad de la información, autoridad marítima, plan de protección, ayuntamiento, club, álbum, mudanza, sofá, avisos, V41).

No ejecuté `build-timeline` (escribe `src/timeline.json`); las 712 palabras las conté yo y coinciden con las notas. No pude comprobar los 324,3 s estimados. Los límites del motor sí los medí sobre el JSON: escenarios 150/147/142 (≤160), preguntas 39/35/46, opciones 5-24, `why` ≤75, `trapWhy` 86/75/72, tarjetas 33-46 caracteres. Todo dentro.

## (a) Hallazgos previos

| Id | Sev. previa | Estado | Comprobación en el texto actual |
|---|---|---|---|
| A-1 | CORREGIR | resuelto | `s05-01`: tres frases cortas, «vigila los accesos a la base de datos de afiliados»; pantalla igual de clara («vigila los accesos a la base de afiliados»). Ya no se lee como revisar datos. |
| A-2 | CORREGIR | resuelto | `trapWhy` de s03-01 «…pero no decide su clasificación»; tarjeta de s03-03 «Decidir la clasificación es del owner». También aplicado el opcional («se clasifican como confidenciales»). |
| A-3 | CORREGIR | resuelto (ver N-1) | `s06-04` ya da el precio de cada modelo, tal como se propuso. |
| A-4 | CORREGIR | resuelto | Voz y pantalla de s07-01: un solo sujeto, «el plan de seguridad de la universidad». |
| B-1 | CORREGIR | resuelto | `steward-name` está en la voz de s02-04, en `requiredCues` de s02-casa, en la tarjeta (`at`) y en el `goal`. s03-03 y s07-03 son una sola oración, y la tarjeta entra tras el remate. |
| B-2 | CORREGIR | resuelto | `s02-05`: «fotos», «aparece», «Piensa en el álbum…». |
| B-3 | CORREGIR | resuelto | Cubierto por A-1. |
| B-4 | CORREGIR | resuelto (ver N-2) | s04-02 y s04-03 como se propuso. |
| B-5 | CORREGIR | resuelto | `s06-03` sin «esa línea». |
| A-5, B-7, A-9, B-6, B-9 | OPCIONAL | aplicados | Comprobados en voz y en `goal`. |
| A-6, A-7, A-8, B-8 | OPCIONAL | no aplicados | Decisión razonada en las notas; sigue siendo válida. A-6 es trabajo del registro. |

Cargo del owner: `s02-02` y el `goal` usan «la persona responsable de la oficina de la terminal de pasajeros», igual que V32 (`reg:194`). Sin género, sin segundo jefe.

## Revisión de errores nuevos

- **Cues:** los 33 cues obligatorios de los ocho `requiredCues` están en la voz. El único añadido, `steward-name`, está bien puesto. No hay cues huérfanos.
- **Frases rotas por los recortes:** ninguna. Todas las frases tienen sujeto y verbo.
- **Una respuesta defendible por pregunta:** sí en las tres. La pantalla de cada `goal` cuadra con la voz.
- **Conectores de redacción escrita, listas leídas, siglas deletreadas:** ninguno. Las listas del recap (s08) son de tres elementos y siguen el formato de los vídeos publicados.
- **Emociones:** ningún segmento repite la de su vecino.
- **Exactitud técnica:** nada falso. «Externalizar no externaliza la responsabilidad», processor que pasa a controller si decide para sus fines, board / committee / government entity y centralized / decentralized coinciden con la lección y con el 5.1.
- **Canon:** no choca con nada. Los términos nuevos (ferry, lista de pasajeros del ferry, Atención al Pasajero, oficina de planificación, comité de seguridad de la información, autoridad marítima, plan de protección, ayuntamiento, club, álbum, mudanza, sofá) no aparecen en el registro, así que son nuevos y no ocupan nada. «Sistemas», «oficina de la terminal de pasajeros» y su responsable coinciden con V32. «Avisos» solo aparece en otros contextos (V45, siem) sin relación. Sigue valiendo lo dicho en A-6 del informe sobre qué apuntar al cerrar.

## (b) Hallazgos nuevos

Cero BLOQUEANTE y cero CORREGIR. Cinco OPCIONALES, todos de oído o de claridad, y ninguno condiciona congelar.

### N-1 · OPCIONAL · `s06-04` se queda sin sujeto

La corrección de A-3 dice «Y además, centralized es igual en todas partes, pero más lento». Sin ver el chip, no se oye de qué es «centralized» (de la gobernanza). Sustituto (+4 palabras):

`<casual> {central-chip}Y además, se puede gobernar de forma centralized, igual en todas partes pero más lento, o decentralized, rápido y local pero desigual.`

### N-2 · OPCIONAL · `s04-03` «esos datos»

Tras «una empresa manda a los pasajeros los avisos de embarque», «esos datos» se puede oír como los avisos, no como los datos de la lista. Sustituto (misma longitud):

`<clear> Trata los datos de los pasajeros por encargo del puerto, siguiendo sus instrucciones. Es el data processor.`

### N-3 · OPCIONAL · `s03-01` «los conoce»

En la voz, «los» queda pegado a «los errores» («corrige los errores, y los conoce mejor que nadie»), y en la pantalla a «errores» o «campos». Sustitutos:

- Voz: `…Hay una persona que define cada campo y corrige los errores, y conoce esos datos mejor que nadie. ¿Qué rol debe decidir la clasificación?`
- Pantalla (157 caracteres, límite 160): `Unas clínicas deciden si sus datos de citas se clasifican como «confidenciales». Quien define cada campo y corrige errores conoce esos datos mejor que nadie.`

### N-4 · OPCIONAL · `s02-02` no responde con palabras a «¿quién decide?»

s02-01 pregunta quién decide si se la enseñan, y el owner se presenta como quien «clasificó la lista y responde de ella». «Decide quién la ve» solo está en el rótulo de pantalla. V32 sí lo dice en voz («decide quién lo usa»). Sustituto (+4 palabras, ~1,5 s; la estimación quedaría hacia 326 s, bajo el techo de 330):

`<clear> {owner}La persona responsable de la oficina de la terminal de pasajeros clasificó la lista, decide quién la ve y responde de ella. Eso es el data owner, un rol de negocio.`

Si no se quiere gastar margen, se puede dejar: la tarjeta de s02-04 y la regla 1 de s08 lo cubren.

### N-5 · OPCIONAL · `s05-01` pantalla, «la responsable» sin más

La voz dice «la responsable del área» y la pantalla solo «la responsable». Sustituto (156 caracteres, límite 160):

`Un administrador de sistemas de una mutua restaura copias, aplica parches y vigila los accesos a la base de afiliados, según decide la responsable del área.`

### Nota de mantenimiento (sin gravedad)

La tabla de cifras al principio de `out/script-notes.md` (323,9 s, 711 palabras, s08 con 74 palabras) es anterior a la revisión; la sección «Revisión 2026-10-23» ya da las cifras nuevas (712, 324,3 s). Si se aplica algún opcional, rehacer `--estimate`.

## (c) Veredicto

**Listo para congelar.** Los 9 CORREGIR del informe están resueltos, no hay errores nuevos de contenido y el canon sigue limpio. Los 5 OPCIONALES (N-1 a N-5) se pueden aplicar o dejar a Lidia al grabar; N-1, N-2 y N-3 son los más útiles de oído.

| Severidad | Cuántos | Ids |
|---|---|---|
| BLOQUEANTE | 0 | |
| CORREGIR | 0 | |
| OPCIONAL | 5 | N-1, N-2, N-3, N-4, N-5 |

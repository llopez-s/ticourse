# Pista «Redes y ENS»: estructura completa por temas

> Diseño corto del 2026-11-26. Lidia pidió completar los bloques pendientes de la pista `opo`
> y aprobó el enfoque A («un bloque por tema»). El CCNA se tratará después, como bloque extra
> con su propio diseño. El repositorio sigue siendo genérico: aquí no se nombra ninguna convocatoria.

## Intención

La pista prepara un temario de técnico/a TIC de la administración (perfil de comunicaciones y
ciberseguridad) con prueba teórico-práctica. Hoy solo existe `op1`. El temario de referencia tiene
nueve temas: el 1 lo cubre `op1`; el 6, el 7 y el 8 los cubre la pista Security+ (vulnerabilidades y
pentest; SIEM, SOC y forense; criptografía y PKI). Faltan los temas 2, 3, 4, 5 y 9, y un hueco del 8:
la firma electrónica en su vertiente española y europea.

## Objetivos

- Un bloque por cada tema pendiente, con el mismo nivel y la misma receta que `op1`
  (`docs/superpowers/plans/2026-11-24-redes-ens-bloque1.md`).
- Que cada tema tenga su bloque, su jefe y su parte del simulacro, para repasar por tema.
- Cubrir la firma electrónica (eIDAS, certificados cualificados, formatos, sellado de tiempo).

## No objetivos

- Repetir lo que ya enseña Security+ (temas 6–8): se enlaza con bloques `links`.
- El CCNA (bloque extra posterior, con diseño propio).
- Vídeos de los bloques nuevos (otro proyecto, cuando haya lecciones).

## Antiobjetivos

- Normativa escrita de memoria: ENS, RGPD/LOPDGDD y eIDAS salen del texto del BOE, el DOUE y las
  guías CCN-STIC, y el revisor los contrasta con la fuente.
- Nombrar la convocatoria o que alguien se presenta a ella, en el código, los commits o la web.

## Enfoques considerados

- **A. Un bloque por tema (elegido).** Cinco bloques nuevos que siguen la numeración del temario;
  la firma electrónica va como lección del bloque de ENS y normativa, porque es derecho
  administrativo más que criptografía. Un bloque más que el plan original, pero ningún tema queda
  diluido.
- B. Los cuatro bloques previstos, con servicios y balanceo juntos (6–7 lecciones). Más barato,
  pero el tema de balanceo, que tiene cinco apartados propios, quedaría corto y desequilibrado.
- C. Como A, con la firma electrónica en un bloque propio. Solo compensa si ese tema pesara mucho.

## Estructura

| Sección | Tema | Dominio (`Domain`) | Contenido |
|---|---|---|---|
| `op1` | 1 | `Redes de comunicaciones` | publicado |
| `op2` | 2 | `Infraestructuras de comunicaciones` | redes corporativas, VPN (IPsec, TLS), SD-WAN, acceso remoto, conexión entre centros |
| `op3` | 3 | `Servicios de red` | DNS, DHCP, NTP y otros servicios de conectividad (proxy, relés, IPAM) |
| `op4` | 4 | `Balanceo y alta disponibilidad` | balanceo L4 y L7, persistencia de sesión, comprobaciones de salud (*health checks*), descarga de TLS, publicación de aplicaciones, redundancia activo-activo y activo-pasivo |
| `op5` | 5 | `Identidad corporativa` | directorios corporativos (LDAP, Active Directory, Entra ID), MFA, modelos de control de acceso, acceso condicional |
| `op6` | 9 | `ENS y normativa` | ENS (RD 311/2022), protección de datos (RGPD, LOPDGDD), gobierno de la seguridad, firma electrónica (eIDAS) |

**Decisión mía: los ids siguen el orden del temario**, de modo que el panel muestra los bloques en el
mismo orden que el examen. Esto sustituye la numeración provisional del plan del bloque 1
(op2 = ENS…), que nunca llegó al código.

**Orden de trabajo** (prioridad de Lidia): `op6` ENS → `op3` servicios → `op4` balanceo →
`op2` infraestructuras → `op5` identidad. Cada bloque tiene su plan, su revisión de exactitud y su PR.
Un bloque se registra en `OP_SECTIONS` solo cuando tiene contenido.

## Cambios en el motor (con el primer bloque)

- `types.ts`: el dominio `'Servicios de red y balanceo'` se divide en `'Servicios de red'` y
  `'Balanceo y alta disponibilidad'`. Ninguna pregunta usa todavía el dominio antiguo.
- `sections.ts`: seis dominios. **Decisión mía: pesos iguales (1/6)** en el simulacro, porque no hay
  pesos oficiales y cada tema del temario vale lo mismo que los demás. `sampleExam` ya salta los
  dominios vacíos.
- Motor de vídeo: `OPO_BLOCKS` en `video/engine/scripts/lib/profiles.mjs` (y su test y el README)
  añade «Balanceo».

## Pendiente para el diseño de cada bloque

- **Supuestos prácticos.** La prueba es teórico-práctica. En el diseño de `op6` se decide si cada
  bloque añade supuestos prácticos (un caso del Consorcio de Arcedo con preguntas encadenadas) y en
  qué formato, mejor con lo que digan las bases sobre la parte práctica.
- El temario exacto de cada lección, sus labs y sus tarjetas, en el plan de cada bloque.

## Para quien lo construya

Igual que en `op1`: escenario del Consorcio Provincial de Arcedo, todo en español con las siglas en su
forma habitual, nivel de técnico superior con cifras exactas, glosario con `ca` solo cuando esté
confirmado en TERMCAT, `npm test` y `npm run build` en verde, y un revisor de exactitud de solo lectura.

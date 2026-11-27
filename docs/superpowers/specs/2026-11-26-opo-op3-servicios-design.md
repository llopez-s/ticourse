# Pista «Redes y ENS» · Bloque `op3`: Servicios de red (diseño corto)

> 2026-11-26. Aprobado por Lidia tal como se propuso en la conversación. Sigue la receta de `op6`
> (`2026-11-26-opo-op6-ens-design.md`) a la escala de `op1`. El repositorio sigue siendo genérico.

## Intención

Cubrir el tema 3 del temario de referencia («servicios de red: DNS, DHCP, NTP […] y servicios de conectividad»).
El balanceo de carga va en `op4` (tema 4, con bloque propio). Lo que ya enseña Security+ (DNSSEC como control,
ataques a DNS) y `op1` (APIPA, NDP, SLAAC de pasada) se enlaza en vez de repetirse.

## Enfoque (elegido)

Cinco lecciones a escala de `op1`, con dos supuestos y la misma forma de trabajo que `op6`. Descartado: meter el
balanceo aquí (duplicaría `op4`) y dedicar más lecciones a DNS (su seguridad ya está en Security+).

## Contenido

| Id | Lección | Mínimo |
|---|---|---|
| `op3m1` | DNS: cómo funciona | jerarquía y delegación, resolución recursiva e iterativa, caché y TTL, tipos de registro (A, AAAA, CNAME, MX, NS, SOA, PTR, TXT, SRV, CAA), zonas primarias y secundarias, transferencias AXFR/IXFR, puertos y transporte (UDP/TCP 53, EDNS) |
| `op3m2` | DNS en la organización | DNS interno frente a externo (split-horizon), reenviadores, DNS de Active Directory y registros SRV, DDNS, DNSSEC (qué firma y qué no), DoT y DoH, ataques habituales (envenenamiento de caché, amplificación, túneles) enlazando Security+ |
| `op3m3` | DHCP | DORA y sus mensajes, puertos 67/68, concesión y renovación (T1/T2), opciones habituales, ámbitos y reservas, agente relay (giaddr, opción 82), conmutación por error y reparto, DHCPv6 frente a SLAAC (flags M y O), DHCP snooping |
| `op3m4` | NTP y la hora | por qué importa (Kerberos, registros, certificados, ENS), estratos, NTPv4 (UDP 123, desfase y retardo), jerarquía en una organización, NTS, PTP (IEEE 1588) solo a nivel de qué es |
| `op3m5` | Servicios de conectividad | proxy directo e inverso, proxy transparente, PAC y WPAD, relés y reenvío, IPAM (qué gestiona y por qué), control de acceso a la red (802.1X/NAC) enlazando Security+ |

Cada lección: forma de `op1` (≥ 4 objetivos, ≥ 4 checks, ≥ 2 tablas, 8 preguntas de 4 opciones, correcta en ≥ 3
posiciones, dominio `Servicios de red`). Cifras exactas (puertos, tipos de mensaje, campos, códigos) con su RFC.

- Labs (2–3): por ejemplo ordenar DORA con un relay de por medio y clasificar registros DNS por su función.
- Tarjetas (~30) y glosario (~50, `ca` solo confirmado en TERMCAT o la Viquipèdia).
- Supuestos: `op3s1` de diseño (DNS y DHCP para una sede nueva del Consorcio: zonas, ámbitos, relay, conmutación
  por error, hora) y `op3s2` de avería (hora desfasada que rompe Kerberos y los registros, y resolución interna caída).
- Jefe de sección con el tono de `op1`; fragmento de dossier autónomo.

## Reglas

- Fuentes primarias: RFC (1034, 1035, 2181, 2136, 4033–4035, 6891, 7858, 8484, 2131, 2132, 3046, 9915 (DHCPv6), 4862,
  5905, 8915…), estándares IEEE para 802.1X y PTP (solo lo público). Lo que dependa de un fabricante (Windows
  Server, ISC, Cisco: p. ej. la tolerancia de 5 minutos de Kerberos en Active Directory) se rotula como valor
  del fabricante. Nada de memoria: dossier de fuentes primero, como en `op6`.
- Escenario del Consorcio con el canon `docs/superpowers/canon/arcedo.md` (direccionamiento de §3, organización
  de §7b); los hechos nuevos se añaden al canon.
- Todo en español; nunca «como en el examen»; ninguna convocatoria.
- Sección `op3` (`num: 3`) en `OP_SECTIONS` entre `op1` y `op6`. Ids `op3m1…`, `fco301…`, `opl3a…`, `op3s1/op3s2`.
- Subagentes en paralelo (un archivo cada uno), revisión de exactitud por pieza y re-revisión de correcciones,
  revisión final de rama, PR sin merge hasta que Lidia lo pida.

# Pista «Redes y ENS» · Bloque `op4`: Balanceo y alta disponibilidad (diseño corto)

> 2026-11-27. El alcance ya estaba aprobado (fila `op4` del diseño de la pista y orden de trabajo de Lidia);
> el reparto en lecciones es decisión mía y se puede cambiar. Sigue la receta de `op3`
> (`2026-11-26-opo-op3-servicios-design.md`). El repositorio sigue siendo genérico.

## Intención

Cubrir el tema 4 del temario de referencia: «balanceo de carga y alta disponibilidad: balanceo L4 y L7,
persistencia de sesión, *health checks*, descarga de SSL/TLS y publicación de aplicaciones». Son cinco
apartados más el título; cada uno tiene su sitio en una lección.

Lo que ya enseñan otras piezas se enlaza y no se repite: VRRP y HSRP (`op1m4`), LACP (`op1m3`), la
conmutación por error de DHCP (`op3m3`), el proxy inverso como tipo de intermediario (`op3m5`), la
resiliencia de Security+ (sp3, «Resiliencia y recuperación»; RTO/RPO, sitios, copias) y las medidas
`op.cont` del ENS (`op6m3`).

## Enfoque (elegido)

Cinco lecciones a escala de `op1`/`op3`, con dos supuestos. Descartado: una lección propia de redundancia
de red (ya está en `op1`) y una de balanceo global (GSLB, *anycast*), que el Consorcio no puede usar con un
solo operador y una sola dirección pública: va como recuadro «otra red» dentro de `op4m5`.

## Contenido

| Id | Lección | Apartado | Mínimo |
|---|---|---|---|
| `op4m1` | Alta disponibilidad: conceptos y cálculo | título | disponibilidad y «nueves» (minutos de parada al año), MTBF y MTTR, componentes en serie y en paralelo, punto único de fallo, N+1 y 2N, activo-activo y activo-pasivo, clúster, latido, quórum y *split-brain*, conmutación y vuelta (*failover*/*failback*); enlaces a `op1`, `op3m3`, Security+ y `op.cont` |
| `op4m2` | Balanceo en capa 4 | L4 | qué hace un balanceador, IP virtual (VIP), grupo (*pool*) y miembros, algoritmos (*round robin*, ponderado, menos conexiones, *hash* de origen), modos de reenvío (NAT de destino, SNAT/proxy completo, retorno directo DSR), qué ve el servidor como origen, límites de L4 |
| `op4m3` | Balanceo en capa 7 y persistencia de sesión | L7 + persistencia | proxy inverso que entiende HTTP, reparto por `Host` y por ruta, cabeceras `Forwarded`/`X-Forwarded-For`, protocolo PROXY (rotulado como especificación de un fabricante), persistencia por IP de origen, por *cookie* (insertada o de la aplicación) y por identificador TLS, sus fallos (NAT masivo, *cookie* perdida), sesión compartida frente a persistencia |
| `op4m4` | Comprobaciones de salud | *health checks* | activas y pasivas, de L3/L4/L7 (ICMP, conexión TCP, petición HTTP con código y contenido esperados), intervalo y umbrales de subida y bajada (valores de fabricante rotulados), drenaje de conexiones, qué pasa cuando todos caen, comprobaciones que mienten (TCP abierto con la aplicación rota), BFD a nivel de qué es |
| `op4m5` | Descarga de TLS y publicación de aplicaciones | TLS + publicación | terminación, recifrado y paso directo (*passthrough*), SNI y ALPN, certificados en el balanceador, TLS mutuo, qué se pierde y qué se gana (inspección, WAF, *cookies*), publicar varias aplicaciones tras una sola dirección pública con un proxy inverso en la DMZ, WAF y ENS enlazando Security+ y `op6`; GSLB, DNS *round robin* y *anycast* como «otra red» |

Cada lección: forma de `op1` (≥ 4 objetivos, ≥ 4 checks, ≥ 2 tablas, 8 preguntas de 4 opciones, correcta en ≥ 3
posiciones, dominio `Balanceo y alta disponibilidad`).

- Labs (3): `opl4a` clasificar funciones según si las puede hacer un balanceador de L4 o hace falta L7;
  `opl4b` ordenar la secuencia de una comprobación de salud que saca un miembro del grupo y lo vuelve a meter;
  `opl4c` clasificar requisitos por el método de persistencia o el modo de TLS que piden.
- Tarjetas (~30) y glosario (~50, `ca` solo confirmado en la Viquipèdia o TERMCAT).
- Supuestos: `op4s1` de diseño (publicar la sede electrónica en alta disponibilidad detrás de la única dirección
  pública: pareja de balanceadores, VIP, persistencia, comprobaciones, TLS, cálculo de disponibilidad) y `op4s2` de
  avería (sesiones que se pierden tras un cambio, un miembro con errores 500 que la comprobación TCP no ve y una
  pareja activo-pasivo con *split-brain*). Cada uno con su `op4sN.calc.test.ts` si lleva cifras.
- Jefe de sección con el tono de `op1`/`op3`; fragmento de dossier autónomo.

## Escenario (canon)

- La sede electrónica está en el CPD y la gestiona el Servicio de Informática (§7b). Hoy `www` y `correo`
  resuelven a `203.0.113.10` y el encaminador reenvía cada puerto (§7c). Hecho nuevo de `op4`: una pareja de
  balanceadores (ADC) en el CPD publica en el puerto 443 de esa dirección `www` y una `sede.arcedo.example`
  nueva, distinguiéndolas por SNI y `Host`. Direcciones dentro de `10.20.72.0/21` sin chocar con las de §7c.
- Un operador, una dirección pública, sin CPD de respaldo: GSLB, segundo operador, segunda dirección pública o
  activo-activo entre dos centros, siempre rotulados «supuesto» u «otra red».
- Los hechos nuevos se añaden al canon en un §7d.

## Reglas

- Fuentes primarias en un dossier antes de escribir: RFC (HTTP 9110/9112/9113, `Forwarded` 7239, *cookies* 6265,
  TLS 1.3 8446, SNI 6066, ALPN 7301, VRRP vigente, ECMP 2991/2992, *anycast* 4786, BFD 5880, NAT 3022, DNS 1794),
  con su estado tomado de rfc-editor. Casi todo el balanceo **no** está normalizado: algoritmos, valores de las
  comprobaciones, tiempos de persistencia y el protocolo PROXY salen de documentación oficial de fabricantes
  (HAProxy, NGINX, F5, Microsoft…) con URL y rotulados **«valor del fabricante»**. Las cifras de disponibilidad
  (nueves, MTBF/MTTR) con su fuente o como aritmética comprobada.
- Todo en español; nunca «como en el examen»; ninguna convocatoria.
- Sección `op4` (`num: 4`) en `OP_SECTIONS` entre `op3` y `op6`. Ids `op4m1…`, `fco401…`, `opl4a…`, `op4s1/op4s2`.
- Subagentes en paralelo (un archivo cada uno), revisión de exactitud por pieza, pasada de coherencia con el canon
  entre piezas, revisión final de rama, PR sin merge hasta que Lidia lo pida.

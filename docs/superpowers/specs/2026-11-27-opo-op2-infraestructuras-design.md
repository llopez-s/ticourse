# Pista «Redes y ENS» · Bloque `op2`: Infraestructuras de comunicaciones (diseño corto)

> 2026-11-27. Alcance aprobado (fila `op2` del diseño de la pista y orden de trabajo de Lidia); el reparto en
> lecciones es decisión mía. Sigue la receta de `op4` (`2026-11-27-opo-op4-balanceo-design.md`). Repositorio genérico.

## Intención

Cubrir el tema 2 del temario de referencia: «infraestructuras de comunicaciones: redes corporativas, VPN, SD-WAN,
acceso remoto y conectividad entre centros». Cinco apartados, una lección cada uno.

Lo que ya enseñan otras piezas se enlaza: las cuatro formas de unir sedes, la etiqueta MPLS y la fibra oscura
(`op1m5`), VLAN y STP (`op1m3`), OSPF, BGP y VRRP (`op1m4`), la visión de seguridad de VPN, IPsec, TLS, SD-WAN y SASE
(Security+, sp3m5), 802.1X (`op3m5`), la alta disponibilidad (`op4m1`) y las medidas del ENS (`op6m3`). Aquí se va al
nivel de ingeniería de red: cómo se construye, qué negocian los protocolos y cómo se diseña y se diagnostica.

## Contenido

| Id | Lección | Mínimo |
|---|---|---|
| `op2m1` | Redes corporativas: diseño | modelo jerárquico (acceso, distribución, núcleo; núcleo colapsado), campus y CPD (hoja-espina, Clos), redundancia y dominios de fallo, segmentación (VLAN, VRF), red de gestión fuera de banda, dimensionado y sobresuscripción |
| `op2m2` | VPN IPsec | arquitectura (RFC 4301): SA, SPI, SPD/SAD; AH y ESP, modos túnel y transporte; IKEv2 (RFC 7296): IKE_SA_INIT, IKE_AUTH, CREATE_CHILD_SA, puertos UDP 500 y 4500, NAT-T (RFC 3948), PFS, reclave; algoritmos recomendados (RFC 8221, 8247); VPN por política frente a por ruta (VTI), GRE sobre IPsec; MTU y MSS |
| `op2m3` | Acceso remoto | VPN de cliente (IPsec y TLS/DTLS, RFC 9147), túnel completo frente a dividido, autenticación y MFA (ENS `op.acc.6` R8 y R9), postura del equipo, confianza cero y ZTNA (NIST SP 800-207), escritorio remoto, pasarela y bastión; WireGuard solo con su documentación oficial |
| `op2m4` | SD-WAN | qué resuelve frente a la WAN clásica, superposición (*overlay*) y subyacente (*underlay*), controlador y orquestador, selección de camino por aplicación y medidas (pérdida, retardo, *jitter*), aprovisionamiento sin intervención, MEF 70 si es público; SASE y SSE como términos de analista/fabricante |
| `op2m5` | Conectividad entre centros | VPN de capa 3 MPLS en detalle (RFC 4364: VRF, RD, RT, PE-CE), VPN de capa 2 (VPLS RFC 4761/4762, EVPN RFC 7432), interconexión de CPD, doble acceso y respaldo, y la Red SARA de las administraciones públicas (fuente: PAe y BOE) |

Forma de cada lección: la de `op4` (≥ 4 objetivos, ≥ 4 checks, ≥ 2 tablas, 8 preguntas de 4 opciones, correcta en ≥ 3
posiciones, dominio `Infraestructuras de comunicaciones`).

- Labs (3): `opl2a` ordenar el establecimiento de IKEv2 hasta el primer paquete ESP (con NAT-T); `opl2b` clasificar
  requisitos de unión de sedes por la tecnología que piden; `opl2c` clasificar decisiones de acceso remoto (túnel
  completo o dividido, ZTNA, escritorio remoto…).
- Tarjetas (~30) y glosario (~50; `ca` solo confirmado en la Viquipèdia).
- Supuestos: `op2s1` de diseño (acceso remoto del personal del Consorcio: teletrabajo con VPN de cliente, MFA, túnel
  dividido o completo, ENS) y `op2s2` de avería (el túnel IPsec de respaldo de una oficina que no levanta cuando cae el
  MPLS: NAT-T, propuestas que no casan, MTU). Cada uno con su `op2sN.calc.test.ts` si lleva cifras.
- Jefe de sección con el tono de los otros bloques.

## Escenario (canon)

WAN principal MPLS de capa 3 con respaldo IPsec por Internet en cada oficina (§6). Hechos nuevos en §7e, fijados
antes de escribir. Un solo operador para Internet en la sede y una dirección pública (`203.0.113.10`); otra cosa,
«supuesto» u «otra red».

## Reglas

- Dossier de fuentes primarias antes de escribir: RFC con su estado de rfc-editor (4301, 4302, 4303, 7296, 3948, 8221,
  8247, 9147, 2784, 4364, 4761, 4762, 7432, 7938…), NIST SP 800-207 y SP 800-77r1, MEF si es público, WireGuard
  (wireguard.com), PAe/BOE para la Red SARA, documentación oficial de fabricantes rotulada «valor del fabricante».
- Todo en español; nunca «como en el examen»; ninguna convocatoria. «Recifrado» sin guion.
- Sección `op2` (`num: 2`) entre `op1` y `op3`. Ids `op2m1…`, `fco201…`, `opl2a…`, `op2s1/op2s2`.
- Subagentes en paralelo, revisión de exactitud por pieza, pasada de coherencia con el canon, PR sin merge hasta que
  Lidia lo pida.

# Canon · Consorcio Provincial de Arcedo (pista «Redes y ENS»)

Registro de los hechos fijos del escenario que usan las lecciones del bloque 1 (`op1`, Redes de comunicaciones); los de los bloques 6 (§7b), 3 (§7c, Servicios de red) y 4 (§7d, Balanceo y alta disponibilidad) se añadieron después.
Los guiones de vídeo se escriben contra este registro: lo que salga en pantalla tiene que coincidir con la lección.

Última revisión: 2026-11-25, sobre la rama `video-redes-guiones` (commit `1f76b337`). Fuentes leídas enteras:
`src/data/opo/op1-m1.ts` … `op1-m5.ts`, `src/data/opo/labs-op1.ts`, `src/data/opo/sections.ts`,
`docs/superpowers/plans/2026-11-24-redes-ens-bloque1.md`, y de `src/data/opo/op1-cards.ts` solo las entradas con
direcciones o sedes del escenario. Las citas van como `ruta:línea`; si una lección cambia, la numeración se mueve
y hay que repasarlas.

Cómo se usa: si un guion necesita algo que no está aquí, no se inventa; se mira la lección y, si tampoco está,
se apunta en §9 como hueco. Las tablas separan el **hecho del Consorcio** (la lección se lo atribuye: un callout
de ejemplo, una pregunta que empieza por «En el Consorcio…») del **dato de ejercicio** (una dirección o un equipo
que solo sale en un cálculo o en una pregunta genérica dentro de `10.20.0.0/16`: vale para repetir ese ejercicio
en pantalla, no para dar por hecho que esa red existe). No hay cronología ni personas con nombre (§7).

## 1. Reglas del escenario

| Regla | Fuente |
|---|---|
| Organización ficticia: sede central, tres oficinas comarcales y CPD propio | `docs/superpowers/plans/2026-11-24-redes-ens-bloque1.md:34`, `docs/superpowers/plans/2026-11-24-redes-ens-bloque1.md:35` |
| Redes de ejemplo dentro de `10.20.0.0/16` | `docs/superpowers/plans/2026-11-24-redes-ens-bloque1.md:35` |
| IP públicas solo de documentación: `192.0.2.0/24`, `198.51.100.0/24`, `203.0.113.0/24`; IPv6 `2001:db8::/32` | `docs/superpowers/plans/2026-11-24-redes-ens-bloque1.md:35`, `docs/superpowers/plans/2026-11-24-redes-ens-bloque1.md:36` |
| Nada de marcas ni organismos reales | `docs/superpowers/plans/2026-11-24-redes-ens-bloque1.md:36` |
| Excepción de op6: «Nada de marcas ni organismos reales» se aplica a las entidades del escenario (proveedores, equipos, empresas). Los organismos que nombra la ley (CCN, CCN-CERT, AEPD, INCIBE-CERT, autoridades autonómicas de protección de datos, Cl@ve como sistema de la AGE) se nombran tal cual | `docs/superpowers/specs/2026-11-26-opo-op6-ens-design.md:140` |
| Solo hechos de estándares (RFC, IEEE 802). Si un dato depende del fabricante, se dice. Nada inventado ni «aproximado» | `docs/superpowers/plans/2026-11-24-redes-ens-bloque1.md:37`, `docs/superpowers/plans/2026-11-24-redes-ens-bloque1.md:38` |
| Todo en español; protocolos y siglas en su forma habitual; «conmutador (switch)» y «encaminador (router)» la primera vez | `docs/superpowers/plans/2026-11-24-redes-ens-bloque1.md:28`, `docs/superpowers/plans/2026-11-24-redes-ens-bloque1.md:31` |

Datos que las lecciones marcan como dependientes del fabricante (en pantalla hay que marcarlos igual):

| Dato | Cómo lo marca la lección | Fuente |
|---|---|---|
| Distancias administrativas 0, 1, 20, 110, 120, 200, 255 | «valores por defecto de Cisco», no están en ningún estándar | `src/data/opo/op1-m4.ts:81`, `src/data/opo/op1-m4.ts:85` |
| Distancia 110 de OSPF y 130 de la estática flotante | «en equipos Cisco» | `src/data/opo/op1-m4.ts:115` |
| Coste de OSPF = 100 Mb/s entre el ancho de banda | por defecto en equipos Cisco; el estándar no fija la fórmula | `src/data/opo/op1-m4.ts:124` |
| SVI | nombre de Cisco que se ha generalizado | `src/data/opo/op1-m3.ts:153` |
| VLAN nativa y VLAN de voz | nombre y función de los fabricantes, no del IEEE | `src/data/opo/op1-m3.ts:133` |
| HSRP | propietario de Cisco | `src/data/opo/op1-m4.ts:179` |
| Tabla MAC y configuración de puertos | «salida ilustrativa, sin sintaxis de fabricante»; «cada fabricante usa sus propias órdenes» | `src/data/opo/op1-m3.ts:31`, `src/data/opo/op1-m3.ts:158` |
| Tabla de rutas del encaminador central | «sintético» | `src/data/opo/op1-m4.ts:31` |

Patrón observado, no regla escrita: todas las MAC de equipos de las lecciones empiezan por `00:00:5e:00:53`.

## 2. Sedes

| Sede | Qué fija la lección | Fuente |
|---|---|---|
| Sede central | Una sola; 200 puestos numerados en `10.20.10.0/24`; al menos dos plantas, con un conmutador por planta | `src/data/opo/op1-m1.ts:21`, `src/data/opo/op1-m2.ts:300`, `src/data/opo/op1-m3.ts:295` |
| CPD | Propio. «La sede central, con su CPD»: las cuatro sedes de la WAN son la central y las tres oficinas | `src/data/opo/op1-m1.ts:21`, `src/data/opo/op1-m5.ts:119` |
| Oficinas comarcales | Tres, sin nombre. La primera tiene 100 puestos, 50 teléfonos IP y 20 impresoras y equipos de gestión | `src/data/opo/op1-m1.ts:21`, `src/data/opo/op1-m2.ts:94` |
| Oficina del laboratorio `opl1a` | «Una de las oficinas comarcales» que se muda de edificio; usa el bloque `10.20.8.0/24` | `src/data/opo/labs-op1.ts:21`, `src/data/opo/labs-op1.ts:17` |
| Centro de formación de Valdecierzo | Red `10.20.40.0/22`; unido a la sede por fibra y por un enlace de respaldo | `src/data/opo/op1-m4.ts:115` |
| CPD de respaldo / segundo centro | Solo hipótesis: «si el Consorcio montara un CPD de respaldo en la misma ciudad»; «un segundo centro situado a pocos kilómetros» | `src/data/opo/op1-m5.ts:119`, `src/data/opo/op1-m5.ts:124` |

## 3. Direccionamiento

### Hechos del Consorcio

| Red | Uso | Detalle | Fuente |
|---|---|---|---|
| `10.20.0.0/16` | Toda la red interna | — | `src/data/opo/op1-m1.ts:21`, `src/data/opo/op1-m2.ts:21` |
| `10.20.10.0/24` | Sede · VLAN 10 Usuarios | Puerta de enlace `10.20.10.1` | `src/data/opo/op1-m3.ts:190`, `src/data/opo/op1-m3.ts:174` |
| `10.20.20.0/24` | Sede · VLAN 20 Servidores | Puerta de enlace `10.20.20.1` | `src/data/opo/op1-m3.ts:190`, `src/data/opo/op1-m3.ts:176` |
| `10.20.30.0/24` | Sede · VLAN 30 Voz | Sin puerta de enlace escrita | `src/data/opo/op1-m3.ts:190` |
| `10.20.99.0/24` | Sede · VLAN 99 Gestión | Sin puerta de enlace escrita | `src/data/opo/op1-m3.ts:190` |
| `10.20.72.0/21` | CPD | Sale del servidor `10.20.77.200/21`: red `10.20.72.0`, difusión `10.20.79.255` | `src/data/opo/op1-m2.ts:246`, `src/data/opo/op1-m2.ts:250` |
| `10.20.8.0/24` … `10.20.11.0/24` | Oficinas comarcales: una por oficina y una de reserva | La sede las anuncia hacia el núcleo como `10.20.8.0/22` | `src/data/opo/op1-m2.ts:94` |
| `10.20.40.0/22` | Centro de formación de Valdecierzo | De `10.20.40.0` a `10.20.43.255` | `src/data/opo/op1-m4.ts:115`, `src/data/opo/op1-m4.ts:53` |
| `10.20.255.0/31` | Enlace punto a punto entre dos encaminadores del Consorcio | Extremos `10.20.255.0` y `10.20.255.1` (RFC 3021) | `src/data/opo/op1-m2.ts:330`, `src/data/opo/op1-m2.ts:335` |

Plan VLSM de la primera oficina comarcal (`10.20.8.0/24`), igual en la lección y en el laboratorio:

| Subred | Máscara | Para qué | Equipos | Difusión | Fuente |
|---|---|---|---|---|---|
| `10.20.8.0/25` | 255.255.255.128 | 100 puestos de trabajo | `.1` – `.126` | `.127` | `src/data/opo/op1-m2.ts:94`, `src/data/opo/labs-op1.ts:45` |
| `10.20.8.128/26` | 255.255.255.192 | 50 teléfonos IP | `.129` – `.190` | `.191` | `src/data/opo/op1-m2.ts:94`, `src/data/opo/labs-op1.ts:46` |
| `10.20.8.192/27` | 255.255.255.224 | 20 impresoras y equipos de gestión | `.193` – `.222` | `.223` | `src/data/opo/op1-m2.ts:94`, `src/data/opo/labs-op1.ts:47` |
| `10.20.8.224/30` | 255.255.255.252 | Enlace punto a punto con la sede central | `.225` y `.226` | `.227` | `src/data/opo/op1-m2.ts:94`, `src/data/opo/labs-op1.ts:48` |
| `10.20.8.228` – `10.20.8.255` | — | Libre para crecer | — | — | `src/data/opo/op1-m2.ts:94` |

### Direcciones públicas e IPv6

| Dato | Uso | Fuente |
|---|---|---|
| `203.0.113.10` | La única dirección pública que da el operador; los 200 puestos de la sede salen con PAT | `src/data/opo/op1-m2.ts:300` |
| `203.0.113.1` | Siguiente salto de la ruta por defecto del encaminador central, por `wan0` | `src/data/opo/op1-m4.ts:33` |
| `10.20.20.10` → `203.0.113.20` | Ejemplo de NAT estático para publicar un servidor (va con «por ejemplo», sin nombrar al Consorcio) | `src/data/opo/op1-m2.ts:160` |
| `192.0.2.0/24`, `198.51.100.0/24` | Permitidas por las reglas; ninguna lección usa una dirección concreta | `src/data/opo/op1-m2.ts:142` |
| IPv6 | El Consorcio no tiene ningún prefijo asignado. Ejemplos sueltos: `2001:db8::1` y la link-local `fe80::200:5eff:fe00:532a`, que sale de la MAC `00:00:5e:00:53:2a` | `src/data/opo/op1-m2.ts:180`, `src/data/opo/op1-m2.ts:213` |

### Datos de ejercicio (dentro de `10.20.0.0/16`, sin uso asignado)

| Dato | Dónde aparece | Fuente |
|---|---|---|
| `10.20.37.150/20` → red `10.20.32.0`, difusión `10.20.47.255` | Cálculo paso a paso y tarjeta `fco108` | `src/data/opo/op1-m2.ts:61`, `src/data/opo/op1-cards.ts:15` |
| `10.20.8.141/26` → red `10.20.8.128`, difusión `10.20.8.191` | Cálculo paso a paso (cae en la subred de teléfonos de la oficina) | `src/data/opo/op1-m2.ts:73` |
| `10.20.16.0/24` en subredes /27; equipo `10.20.16.100` | Pregunta de cálculo | `src/data/opo/op1-m2.ts:265` |
| `10.20.16.0/24` … `10.20.23.0/24` → `10.20.16.0/21` | «El Consorcio quiere anunciar» esas ocho redes con una ruta; no dice de qué son | `src/data/opo/op1-m2.ts:290` |
| `10.20.12.0/24`, `10.20.12.128/25`, `10.20.12.192/26` | Tabla del encaminador central, para el prefijo más largo | `src/data/opo/op1-m4.ts:35`, `src/data/opo/op1-m4.ts:36`, `src/data/opo/op1-m4.ts:37` |
| `10.20.40.0/24` por RIP frente a `10.20.40.0/22` por OSPF | Pregunta sobre prefijo más largo, sin nombrar al Consorcio | `src/data/opo/op1-m4.ts:99` |
| `10.21.0.5` | Destino fuera de la red, que sale por la ruta por defecto | `src/data/opo/op1-m4.ts:60` |

## 4. Equipos, interfaces y direcciones

### Hechos del Consorcio

| Equipo | Dirección o dato | Fuente |
|---|---|---|
| Puesto de la sede central | `10.20.10.25/24`; abre la aplicación de expedientes; puerto de origen 51514 | `src/data/opo/op1-m1.ts:76`, `src/data/opo/op1-m1.ts:143` |
| Servidor de la aplicación de expedientes (CPD) | `10.20.72.10`, puerto 443 | `src/data/opo/op1-m1.ts:76`, `src/data/opo/op1-m1.ts:143` |
| Servidor del CPD | `10.20.77.200/21` | `src/data/opo/op1-m2.ts:246` |
| Puerta de enlace de la VLAN 10 | `10.20.10.1`, MAC `00:00:5e:00:53:01` («el encaminador responde con su MAC») | `src/data/opo/op1-m1.ts:76` |
| PC-1 | `10.20.10.21/24`, puerto de acceso de la VLAN 10, conmutador de la planta 1 | `src/data/opo/op1-m3.ts:295` |
| PC-2 | `10.20.10.37/24`, puerto de acceso de la VLAN 10, conmutador de la planta 2 | `src/data/opo/op1-m3.ts:295` |
| Conmutadores de planta (sede) | De capa 2 | `src/data/opo/op1-m3.ts:190` |
| Conmutadores de distribución (sede) | Dos, de capa 3, con una SVI por VLAN; uno con prioridad 4096 para ser el puente raíz | `src/data/opo/op1-m3.ts:190` |
| Conmutadores del CPD | Dos unidos por cuatro enlaces de 10 Gbit/s agrupados con LACP | `src/data/opo/op1-m3.ts:342` |
| Encaminador central | Interfaces `wan0`, `core0`, `core1`, `core2`, `core3` y `lan3` | `src/data/opo/op1-m4.ts:26`, `src/data/opo/op1-m4.ts:33` |

Equipos de la oficina comarcal del laboratorio `opl1a`:

| Equipo | Dirección | Subred | Fuente |
|---|---|---|---|
| Portátil de la secretaría | `10.20.8.1` | /25 | `src/data/opo/labs-op1.ts:87` |
| Puesto de registro de entrada | `10.20.8.77` | /25 | `src/data/opo/labs-op1.ts:52` |
| Puesto de la oficina técnica | `10.20.8.126` | /25 | `src/data/opo/labs-op1.ts:72` |
| Teléfono IP de la centralita | `10.20.8.129` | /26 | `src/data/opo/labs-op1.ts:57` |
| Teléfono IP del mostrador de atención | `10.20.8.150` | /26 | `src/data/opo/labs-op1.ts:102` |
| Teléfono IP de la sala de juntas | `10.20.8.190` | /26 | `src/data/opo/labs-op1.ts:82` |
| Cámara IP del aparcamiento | `10.20.8.193` | /27 | `src/data/opo/labs-op1.ts:77` |
| Punto de acceso de la sala de plenos | `10.20.8.200` | /27 | `src/data/opo/labs-op1.ts:62` |
| Pantalla informativa del vestíbulo | `10.20.8.210` | /27 | `src/data/opo/labs-op1.ts:107` |
| Impresora de la primera planta | `10.20.8.222` | /27 | `src/data/opo/labs-op1.ts:97` |
| Interfaz del encaminador de salida | `10.20.8.225` | /30 | `src/data/opo/labs-op1.ts:67` |
| Interfaz del encaminador de la sede central | `10.20.8.226` | /30 | `src/data/opo/labs-op1.ts:92` |

### Datos de ejercicio

| Dato | Detalle | Fuente |
|---|---|---|
| Equipo A y equipo B (`opl1b`) | A: VLAN 10, `10.20.10.25/24`. B: VLAN 20, `10.20.20.40/24`. Mismo conmutador de acceso, troncal a un conmutador de capa 3 con las SVI `10.20.10.1` y `10.20.20.1` | `src/data/opo/labs-op1.ts:122` |
| Conmutador de acceso | `P3`: acceso VLAN 10, voz VLAN 30, puerto de borde. `P24`: troncal hacia distribución | `src/data/opo/op1-m3.ts:160`, `src/data/opo/op1-m3.ts:165` |
| Tabla MAC de ese conmutador | VLAN 10: `…:0a` en P3, `…:0b` en P4, `…:1f` en P24. VLAN 20: `…:2c` en P24. VLAN 30: `…:7d` en P3. VLAN 99: `…:01` estática en P24 | `src/data/opo/op1-m3.ts:34`, `src/data/opo/op1-m3.ts:39` |
| Subinterfaces del encaminador (opción B) | `G0.10` con `10.20.10.1/24` y `G0.20` con `10.20.20.1/24` | `src/data/opo/op1-m3.ts:179`, `src/data/opo/op1-m3.ts:182` |
| Mismos PC en VLAN distintas | `10.20.10.21/24` en VLAN 10 y `10.20.10.37/24` en VLAN 20, en el mismo conmutador (no nombra al Consorcio) | `src/data/opo/op1-m3.ts:138` |
| SW-A, SW-B, SW-C | 32768 y `…:0c`; 32768 y `…:03`; 4096 y `…:9f` | `src/data/opo/op1-m3.ts:265` |
| R1 a R4 | Prioridad 1, 1, 0 y 5; Router ID `10.20.255.1`, `.9`, `.200` y `.3` | `src/data/opo/op1-m4.ts:258` |

## 5. VLAN y conmutación

| VLAN | Nombre | Subred | Nota | Fuente |
|---|---|---|---|---|
| 10 | Usuarios | `10.20.10.0/24` | Puerta de enlace `10.20.10.1` | `src/data/opo/op1-m3.ts:190`, `src/data/opo/op1-m3.ts:174` |
| 20 | Servidores | `10.20.20.0/24` | Puerta de enlace `10.20.20.1` | `src/data/opo/op1-m3.ts:190`, `src/data/opo/op1-m3.ts:176` |
| 30 | Voz | `10.20.30.0/24` | VLAN de voz del puerto P3 | `src/data/opo/op1-m3.ts:190`, `src/data/opo/op1-m3.ts:168` |
| 40 | Impresoras | — | Dada de alta en dos plantas; falta en las VLAN permitidas del troncal | `src/data/opo/op1-m3.ts:190` |
| 99 | Gestión | `10.20.99.0/24` | — | `src/data/opo/op1-m3.ts:190` |
| 999 | Nativa de los troncales | — | Sin ningún puerto de acceso | `src/data/opo/op1-m3.ts:190`, `src/data/opo/op1-m3.ts:163` |

- Troncal del conmutador de acceso: VLAN permitidas 10, 20, 30 y 99; nativa 999 (`src/data/opo/op1-m3.ts:162`).
- En la pregunta de las dos plantas, el troncal solo permite 20, 30 y 99, con nativa 999 en los dos extremos: esa es la avería (`src/data/opo/op1-m3.ts:295`).
- La sede pasa de 4 a 30 VLAN y «hoy» las comunica un encaminador con subinterfaces por un único troncal de 1 Gbit/s, saturado (`src/data/opo/op1-m3.ts:311`).

## 6. Encaminamiento, WAN y WLAN

Tabla de rutas del encaminador central (`src/data/opo/op1-m4.ts:33` a `:38`):

| Destino | Siguiente salto | Interfaz | Origen | [dist./métrica] |
|---|---|---|---|---|
| `0.0.0.0/0` | `203.0.113.1` | `wan0` | estática | [1/0] |
| `10.20.0.0/16` | `10.20.255.2` | `core0` | ospf | [110/20] |
| `10.20.12.0/24` | `10.20.255.6` | `core1` | ospf | [110/30] |
| `10.20.12.128/25` | `10.20.255.10` | `core2` | ospf | [110/40] |
| `10.20.12.192/26` | (directa) | `lan3` | conectada | [0/0] |
| `10.20.40.0/22` | `10.20.255.14` | `core3` | ospf | [110/25] |

| Tema | Hecho | Fuente |
|---|---|---|
| OSPF | Protocolo interior. La sede aprende `10.20.40.0/22` de Valdecierzo por OSPF a través de la fibra | `src/data/opo/op1-m4.ts:115` |
| Ruta estática flotante | Hacia `10.20.40.0/22` por el enlace de respaldo, con distancia 130 (valor de Cisco) | `src/data/opo/op1-m4.ts:115` |
| Áreas de OSPF | Solo un deseo: tres áreas (sede central, oficinas comarcales y CPD), con una de ellas como área 0. Sin números de área | `src/data/opo/op1-m4.ts:144` |
| BGP | eBGP «el Consorcio con su operador»; iBGP entre dos encaminadores de borde del Consorcio | `src/data/opo/op1-m4.ts:159` |
| Operadores | En las preguntas: sistema autónomo propio y dos operadores, A y B; salida preferida por A con LOCAL_PREF más alto. Sin número de AS ni bloque público | `src/data/opo/op1-m4.ts:164`, `src/data/opo/op1-m4.ts:273` |
| VRRP / HSRP | Ningún dato del Consorcio; el ejercicio usa los encaminadores A (120) y B (100) | `src/data/opo/op1-m4.ts:302` |
| WAN principal | VPN de capa 3 sobre MPLS: un acceso por sede (central y tres oficinas), todas con todas, clase de servicio para la voz | `src/data/opo/op1-m5.ts:119` |
| WAN de respaldo | Cada oficina, un acceso a Internet barato con un túnel IPsec hacia la sede; solo si cae el principal | `src/data/opo/op1-m5.ts:119` |
| Líneas dedicadas | Descartadas: harían falta seis circuitos para la malla completa | `src/data/opo/op1-m5.ts:119` |
| Recorrido MPLS | Oficina (`10.20.8.0/24`) → sede (`10.20.10.0/24`): CE-oficina, PE1, P, PE2, CE-sede; etiquetas `[304][72]`, cambio 304 → 511; la 72 indica la VRF | `src/data/opo/op1-m5.ts:74`, `src/data/opo/op1-m5.ts:80`, `src/data/opo/op1-m5.ts:82` |
| Fibra oscura con DWDM | Solo para la réplica con un CPD de respaldo que no existe | `src/data/opo/op1-m5.ts:119` |
| WLAN | Lo único fijo es un punto de acceso en la oficina comarcal, `10.20.8.200` | `src/data/opo/labs-op1.ts:62` |
| WLAN, ejercicios | Tres AP en los canales 1, 4 y 8 que pasan a 1-6-11; pasillo con cuatro AP en 1-6-11-1; teléfonos wifi «en la sede» que se quedan pegados al AP de origen; AP de 22 W con conmutadores 802.3af | `src/data/opo/op1-m5.ts:158`, `src/data/opo/op1-m5.ts:264`, `src/data/opo/op1-m5.ts:279`, `src/data/opo/op1-m5.ts:308` |

## 7. Personas y jefe de sección

- Nadie tiene nombre. Aparece «una técnica» que da de alta la VLAN 40 (`src/data/opo/op1-m3.ts:190`) y «la administradora» que escribe las rutas estáticas (`src/data/opo/op1-m4.ts:88`).
- Jefe de `op1`: nombre en clave PLANO EN BLANCO, adversario LA RED HEREDADA: subredes que se pisan, un troncal que deja pasar todas las VLAN y una ruta estática que apunta a un equipo retirado (`src/data/opo/sections.ts:52`, `src/data/opo/sections.ts:53`, `src/data/opo/sections.ts:55`).
- Al cerrar: plan sin solapes, cada VLAN con su puerta de enlace, la ruta huérfana eliminada y la nota «no apagar, nadie sabe qué cuelga de aquí» (`src/data/opo/sections.ts:57`).

## 7b. Organización de la seguridad y normativa (bloque op6)

Hechos que fija el bloque 6, «ENS y normativa» (`op6m1`–`op6m7`, `opl6a`–`opl6c`, supuestos `op6s1` y `op6s2`). Solo los
hechos del Consorcio; los artículos y plazos de la norma no se copian aquí. Revisión de 2026-11-26, sobre la rama `op6-ens`.
Los roles los fijó el controlador y los repiten las lecciones y los dos supuestos; en cada fila van las fuentes principales.

### Roles y órganos

| Rol o figura | Quién lo ocupa en el Consorcio | Fuente |
|---|---|---|
| Comité de Seguridad de la Información | Presidido por la Gerencia | `src/data/opo/op6-m1.ts:141`, `src/data/opo/op6-m3.ts:54`, `src/data/opo/supuestos/op6s2.ts:126` |
| Responsable de la información | La Gerencia | `src/data/opo/op6-m1.ts:137`, `src/data/opo/supuestos/op6s2.ts:121` |
| Responsable del servicio (sede electrónica y registro electrónico) | La Secretaría General | `src/data/opo/op6-m1.ts:138`, `src/data/opo/supuestos/op6s2.ts:122` |
| Responsable de la seguridad | La Unidad de Seguridad de la Información, que depende de la Gerencia y no del Servicio de Informática (por el art. 13.3 no puede haber dependencia jerárquica con el responsable del sistema). Determina la categoría y firma la Declaración de Aplicabilidad | `src/data/opo/op6-m1.ts:139`, `src/data/opo/op6-m1.ts:148`, `src/data/opo/op6-m2.ts:166`, `src/data/opo/supuestos/op6s2.ts:123` |
| Responsable del sistema | La jefatura del Servicio de Informática y Comunicaciones | `src/data/opo/op6-m1.ts:140`, `src/data/opo/supuestos/op6s2.ts:124` |
| Delegado de protección de datos (DPD) | Designado por el Consorcio; es una persona distinta del responsable de la seguridad | `src/data/opo/op6-m1.ts:148`, `src/data/opo/supuestos/op6s2.ts:125` |
| Autoridad de control de protección de datos | La AEPD, porque la comunidad autónoma del Consorcio no tiene autoridad de protección de datos propia | `src/data/opo/op6-m5.ts:190`, `src/data/opo/labs-op6.ts:59` |
| Operador de servicios esenciales | El Consorcio **no** lo es: notifica al CCN por el art. 33.2 del RD 311/2022 y la ITS de Notificación, no por el RD 43/2021 | `src/data/opo/op6-m4.ts:219`, `src/data/opo/op6-m4.ts:344` |
| Quién firma las comunicaciones a la AEPD y a los afectados | La Gerencia, en nombre del Consorcio y con el asesoramiento del DPD (procedimiento propio del Consorcio, no la norma) | `src/data/opo/supuestos/op6s2.ts:138` |
| Aprobación de la política y de la normativa de seguridad | «El órgano competente del Consorcio» y «la dirección del Consorcio», sin decir cuál (ver §9, punto 22) | `src/data/opo/op6-m6.ts:131`, `src/data/opo/op6-m6.ts:132` |

### Sistemas y categorías

| Sistema | Categoría y niveles | Fuente |
|---|---|---|
| Gestión de nóminas (en el CPD de la sede central) | **MEDIA**. Niveles del sistema: C MEDIO, I MEDIO, T BAJO, A MEDIO, D BAJO. Se acredita por certificación (auditoría), no por autoevaluación | `src/data/opo/op6-m2.ts:124`, `src/data/opo/op6-m2.ts:339`, `src/data/opo/op6-m4.ts:52` |
| Web informativa (noticias, horarios de las oficinas, cursos de Valdecierzo) | **BÁSICA**. Sin nivel en C; I, A y D en BAJO. Se acredita por autoevaluación | `src/data/opo/op6-m2.ts:158`, `src/data/opo/op6-m3.ts:158` |
| Gestión de expedientes (de contratación y tablón interno de avisos) | **MEDIA**. C MEDIO, I MEDIO, D BAJO (el laboratorio ya no lo contradice: §9, punto 16, resuelto) | `src/data/opo/op6-m2.ts:324` |
| Sede electrónica (en el CPD de la sede central; la gestiona técnicamente el Servicio de Informática y Comunicaciones) | **MEDIA**. C, I, A y D en MEDIO; T en BAJO. La Gerencia propone ALTA por su visibilidad; la Unidad de Seguridad la determina MEDIA, porque ninguna dimensión llega a ALTO. Declaración de Aplicabilidad firmada por la Unidad de Seguridad | `src/data/opo/supuestos/op6s1.ts:18`, `src/data/opo/supuestos/op6s1.ts:96`, `src/data/opo/supuestos/op6s1.ts:109`, `src/data/opo/supuestos/op6s1.ts:125`, `src/data/opo/supuestos/op6s1.ts:337`, `src/data/opo/supuestos/op6s1.ts:526` |
| Registro electrónico de entrada | **MEDIA**, con D en MEDIO y T en BAJO | `src/data/opo/supuestos/op6s2.ts:101`, `src/data/opo/supuestos/op6s1.ts:125`, `src/data/opo/op6-m3.ts:350` |

Servicios de la sede electrónica: acceso al registro electrónico de entrada, que es un sistema propio (con justificante automático de cada presentación), notificaciones por comparecencia, tablón electrónico de anuncios y comprobación de copias con CSV (`src/data/opo/supuestos/op6s1.ts:83`, `src/data/opo/op6-m7.ts:164`). Valoraciones del supuesto: acceso al registro electrónico C BAJO, I BAJO, T BAJO, A MEDIO, D MEDIO; notificaciones, todo BAJO; solicitudes presentadas C MEDIO, I MEDIO, T BAJO, A BAJO; anuncios del tablón I MEDIO, T BAJO, A BAJO (`src/data/opo/supuestos/op6s1.ts:109`, `src/data/opo/supuestos/op6s1.ts:110`, `src/data/opo/supuestos/op6s1.ts:125`, `src/data/opo/supuestos/op6s1.ts:126`).

### Auditoría y empresas contratadas

| Hecho | Fuente |
|---|---|
| El registro electrónico de entrada superó su auditoría ordinaria «hace ocho meses» (op6m4); ahora se integra con una plataforma nueva (modificación sustancial) | `src/data/opo/op6-m4.ts:299` |
| Primera auditoría para la certificación de la sede electrónica: dictamen FAVORABLE CON NO CONFORMIDADES. Tres no conformidades menores (op.cont.1: sin análisis de impacto; mp.info.6: copias sin pruebas de recuperación; org.1: la política no recoge la estructura del comité) y una observación (mp.info.4: sellos de tiempo en el tablón). Plan de acciones correctivas ante la entidad certificadora en un mes como máximo | `src/data/opo/supuestos/op6s1.ts:190`, `src/data/opo/supuestos/op6s1.ts:195`, `src/data/opo/supuestos/op6s1.ts:196`, `src/data/opo/supuestos/op6s1.ts:197`, `src/data/opo/supuestos/op6s1.ts:198`, `src/data/opo/supuestos/op6s1.ts:450` |
| Una empresa privada mantiene, por contrato, la infraestructura de las oficinas comarcales; su incidente lo notifica a INCIBE-CERT, que lo traslada al CCN-CERT (art. 33.7) | `src/data/opo/op6-m4.ts:359`, `src/data/opo/op6-m4.ts:368` |
| Otras empresas contratadas, sin nombre: mantenimiento de la plataforma del registro electrónico, gestión de las nóminas, gestión de la plataforma de formación, vigilancia de la red | `src/data/opo/op6-m1.ts:258`, `src/data/opo/op6-m5.ts:343`, `src/data/opo/labs-op6.ts:166`, `src/data/opo/op6-m6.ts:54` |
| Un portátil con una copia del registro de entrada desaparece de una oficina comarcal (caso del DPD: disco cifrado) | `src/data/opo/op6-m5.ts:130` |
| Copias del registro (REG-APP y REG-DOC): la diaria, a las 22:00, en la cabina del CPD conectada a la red; la semanal, los domingos a las 22:00, en un soporte desconectado en el centro de formación de Valdecierzo. Las pruebas de recuperación de estas copias empezaron después de que la auditoría de la sede electrónica (`op6s1`) echara en falta las de la sede; la última, hace tres meses, salió bien | `src/data/opo/supuestos/op6s2.ts:186`, `src/data/opo/supuestos/op6s2.ts:187` |

### Incidente de ransomware en el registro de entrada (`op6s2`, un lunes sin fecha)

| Hora | Hecho | Fuente |
|---|---|---|
| Jueves anterior | Correo de suplantación con el que, según el análisis preliminar, se obtuvo la contraseña de `adm-reg` | `src/data/opo/supuestos/op6s2.ts:205` |
| 01:58 | Sesión de la VPN de administración, usuario `adm-reg`, desde `198.51.100.77` | `src/data/opo/supuestos/op6s2.ts:82` |
| 02:12 – 04:41 | `10.20.72.31` (REG-DOC) envía 14,2 GB a `198.51.100.77:443` | `src/data/opo/supuestos/op6s2.ts:84`, `src/data/opo/supuestos/op6s2.ts:85` |
| 05:03 | Los ficheros de la copia diaria del CPD aparecen cifrados | `src/data/opo/supuestos/op6s2.ts:186` |
| 05:10 | REG-APP (`10.20.72.30`) deja de responder; a esa hora no hay nadie de guardia | `src/data/opo/supuestos/op6s2.ts:64` |
| 07:55 | La oficina de registro avisa de que la aplicación no abre | `src/data/opo/supuestos/op6s2.ts:65` |
| 08:10 | Un técnico confirma el cifrado de REG-APP y REG-DOC y el mensaje de rescate | `src/data/opo/supuestos/op6s2.ts:66` |
| 08:15 | El CPD tiene 46 servidores; 2 afectados | `src/data/opo/supuestos/op6s2.ts:67` |
| 09:30 / 10:00 / 10:15 | La Unidad valora el incidente / se reúne el Comité / el Servicio de Informática entrega el informe de copias | `src/data/opo/supuestos/op6s2.ts:219`, `src/data/opo/supuestos/op6s2.ts:367`, `src/data/opo/supuestos/op6s2.ts:420` |
| 14:30 | El registro vuelve a dar servicio, en dos servidores nuevos y con la copia del domingo de Valdecierzo | `src/data/opo/supuestos/op6s2.ts:204` |
| 18:00 | Informe de cierre: unas 18.400 personas y unas 900 solicitudes de ayudas con informe de discapacidad; no consta que se hayan publicado los datos | `src/data/opo/supuestos/op6s2.ts:207` |

La interrupción cuenta desde las 05:10 (el registro atiende a todas horas): 9 h 20 min hasta las 14:30, con el 100 % de los usuarios, nivel MUY ALTO por interrupción (`src/data/opo/supuestos/op6s2.ts:512`). Los nombres y direcciones del incidente (`REG-APP`, `REG-DOC`, `adm-reg`, `198.51.100.77`) son datos del supuesto: ver §9, punto 18.

### Jefe de sección

- Jefe de `op6`: nombre en clave PAPEL MOJADO, adversario EL CUMPLIMIENTO DE FACHADA: política firmada, declaración de aplicabilidad e informe de auditoría en una carpeta, pero nadie sabe quién valoró los sistemas y el registro de incidentes lleva meses vacío (`src/data/opo/sections.ts:88`, `src/data/opo/sections.ts:90`).
- Al cerrar: cada sistema con sus dimensiones valoradas por quien debe, su categoría determinada por la Unidad de Seguridad de la Información y su declaración de aplicabilidad firmada; en el archivo del comité, un acta antigua con una línea subrayada: «revisar la red de las oficinas comarcales antes de la próxima auditoría» (`src/data/opo/sections.ts:92`).

## 7c. Servicios de red (bloque op3)

Hechos que fija el bloque 3, «Servicios de red» (`op3m1`–`op3m5`, `opl3a`–`opl3c`, supuestos `op3s1` y `op3s2`). Solo los
hechos del Consorcio; los puertos, códigos y valores de los estándares no se copian aquí. Revisión de 2026-11-26, sobre la
rama del bloque `op3`. Los valores que son del fabricante (Windows Server, Cisco) siguen rotulados así en las lecciones.

### DNS y dominios

| Hecho | Fuente |
|---|---|
| Dominio público `arcedo.example`, con la zona autoritativa en el proveedor de DNS externo; los servidores son `ns1.proveedor-dns.example` y `ns2.proveedor-dns.example` | `src/data/opo/op3-m1.ts:31`, `src/data/opo/op3-m1.ts:35`, `src/data/opo/op3-m1.ts:36`, `src/data/opo/op3-m1.ts:40` |
| SOA con primario `ns1.proveedor-dns.example`, responsable `hostmaster.arcedo.example`, SERIAL `2026112601`, MINIMUM 900 s | `src/data/opo/op3-m1.ts:156`, `src/data/opo/op3-m1.ts:167`, `src/data/opo/op3-m1.ts:168`, `src/data/opo/op3-m1.ts:172` |
| MX `10 correo.arcedo.example.`; CAA `0 issue "ca.example"` y `0 iodef "mailto:seguridad@arcedo.example"`; TTL 3600 | `src/data/opo/op3-m1.ts:175`, `src/data/opo/op3-m1.ts:176`, `src/data/opo/op3-m1.ts:177` |
| `www` y `correo` resuelven a `203.0.113.10`, la única dirección pública; el encaminador reenvía cada puerto al servidor que toca. `portal` es un CNAME de `www` | `src/data/opo/op3-m1.ts:178`, `src/data/opo/op3-m1.ts:179`, `src/data/opo/op3-m1.ts:180`, `src/data/opo/op3-m1.ts:184`, `src/data/opo/supuestos/op3s2.ts:17` |
| El PTR de `203.0.113.10` lo publica el operador, dueño del bloque | `src/data/opo/op3-m1.ts:148` |
| `encuestas.arcedo.example` es un CNAME hacia `arcedo.encuestas-proveedor.example`, nombre que asigna el proveedor externo que aloja el servicio de encuestas | `src/data/opo/labs-op3.ts:166` |
| Dominio de Active Directory `ad.arcedo.example`, subdominio del público; lo sirven solo DC1 y DC2 y no se publica fuera | `src/data/opo/op3-m2.ts:37`, `src/data/opo/op3-m2.ts:54`, `src/data/opo/supuestos/op3s1.ts:22` |
| DC1 `10.20.72.11` (`dc1.ad.arcedo.example`) y DC2 `10.20.72.12` (`dc2.ad.arcedo.example`), en el CPD, con DNS interno; lo que no es suyo lo reenvían a los resolutores del operador | `src/data/opo/op3-m2.ts:38`, `src/data/opo/op3-m2.ts:41`, `src/data/opo/op3-m2.ts:78`, `src/data/opo/op3-m2.ts:79` |
| Resolutores del operador `198.51.100.53` y `198.51.100.54`; no conocen `ad.arcedo.example` | `src/data/opo/supuestos/op3s1.ts:20`, `src/data/opo/supuestos/op3s1.ts:112`, `src/data/opo/supuestos/op3s2.ts:104` |
| El cortafuegos solo deja salir DNS desde DC1 y DC2 | `src/data/opo/op3-m2.ts:196` |

### DHCP

| Hecho | Fuente |
|---|---|
| DHCP1 `10.20.72.21` y DHCP2 `10.20.72.22` (CPD), Windows Server, en conmutación por error; con los valores por defecto de Microsoft, en equilibrio de carga 50:50 | `src/data/opo/op3-m3.ts:22`, `src/data/opo/op3-m3.ts:212`, `src/data/opo/supuestos/op3s1.ts:28` |
| Hacen de agente relay las SVI de los conmutadores de distribución de la sede y los encaminadores de cada oficina comarcal, con dos destinos (DHCP1 y DHCP2) | `src/data/opo/op3-m3.ts:22`, `src/data/opo/op3-m3.ts:160`, `src/data/opo/op3-m3.ts:161`, `src/data/opo/op3-m3.ts:212` |
| Ámbito de la VLAN 10: `10.20.10.100`–`10.20.10.250` (151 direcciones), puerta `10.20.10.1`, DNS `10.20.72.11` y `10.20.72.12`, concesión de 8 horas (decisión del Consorcio); el equipo de videoconferencia de la sala de reuniones tiene una reserva en `10.20.10.200` | `src/data/opo/op3-m3.ts:129`, `src/data/opo/labs-op3.ts:194` |

### Hora (NTP)

| Hecho | Fuente |
|---|---|
| NTP1 `10.20.72.41` y NTP2 `10.20.72.42` (CPD); se sincronizan con servidores públicos de referencia, de estrato 1; ellos anuncian estrato 2 | `src/data/opo/op3-m4.ts:140`, `src/data/opo/supuestos/op3s1.ts:23`, `src/data/opo/supuestos/op3s2.ts:23`, `src/data/opo/supuestos/op3s2.ts:24` |
| Emulador de PDC: DC1, en la lección y en los dos supuestos; toma la hora de NTP1 y NTP2 (fuente externa fiable que pide Microsoft) | `src/data/opo/op3-m4.ts:141`, `src/data/opo/supuestos/op3s1.ts:24`, `src/data/opo/supuestos/op3s1.ts:131`, `src/data/opo/supuestos/op3s2.ts:20` |
| Miembros del dominio (DC2, puestos y servidores, **incluidos DHCP1 y DHCP2**): por la jerarquía de hora de Windows (valor del fabricante). DC2 la toma de DC1; los puestos, de un controlador del dominio, y en `op3s2`, con DC2 sin sincronizar, de DC1 | `src/data/opo/op3-m4.ts:142`, `src/data/opo/supuestos/op3s1.ts:131`, `src/data/opo/supuestos/op3s2.ts:21`, `src/data/opo/supuestos/op3s2.ts:110` |
| Equipos fuera del dominio (conmutadores, cortafuegos, encaminadores de las oficinas, impresoras, servidores que no son del dominio): directamente a NTP1 y NTP2. La opción 42 de DHCP sirve para anunciárselos a los que toman su configuración por DHCP | `src/data/opo/op3-m4.ts:143`, `src/data/opo/op3-m4.ts:150`, `src/data/opo/op3-m3.ts:349`, `src/data/opo/op3-m4.ts:322`, `src/data/opo/supuestos/op3s1.ts:131` |
| Solo NTP1 y NTP2 hablan con el exterior por NTP | `src/data/opo/op3-m4.ts:150`, `src/data/opo/op3-m4.ts:164` |
| Estratos del supuesto `op3s2`: NTP1 y NTP2 en 2, DC1 en 3 y DC2, ya corregido, en 4 | `src/data/opo/supuestos/op3s2.ts:23`, `src/data/opo/supuestos/op3s2.ts:24` |

### Proxy, 802.1X y servicios de conectividad

| Hecho | Fuente |
|---|---|
| Proxy web corporativo `10.20.72.50`, puerto 8080 (decisión del Consorcio); toda la navegación sale por él | `src/data/opo/op3-m5.ts:21`, `src/data/opo/op3-m5.ts:28`, `src/data/opo/op3-m5.ts:41` |
| Los navegadores reciben la URL concreta de un archivo PAC (`proxy.pac`), publicado en un servidor interno que controla el Servicio de Informática y Comunicaciones; DIRECT para nombres sin dominio, `.ad.arcedo.example` y `10.20.*`, el resto a `PROXY 10.20.72.50:8080` | `src/data/opo/op3-m5.ts:125`, `src/data/opo/op3-m5.ts:136`, `src/data/opo/op3-m5.ts:150` |
| Sin WPAD: ni por DNS ni por DHCP (opción 252) | `src/data/opo/op3-m5.ts:149`, `src/data/opo/op3-m5.ts:150`, `src/data/opo/op3-m5.ts:155` |
| El cortafuegos de salida solo admite tráfico web desde el proxy; un navegador que no encuentra el PAC no sabe que debe ir por él y se queda sin salida | `src/data/opo/labs-op3.ts:239` |
| Servidor RADIUS `10.20.72.60` (CPD); 802.1X en los puestos de la VLAN 10, con asignación de VLAN en el `Access-Accept` (ejemplo: VLAN 10) | `src/data/opo/op3-m5.ts:209`, `src/data/opo/op3-m5.ts:211`, `src/data/opo/op3-m5.ts:221`, `src/data/opo/op3-m5.ts:224` |

### Edificio anexo (`op3s1`)

| Hecho | Fuente |
|---|---|
| La sede central estrena un edificio anexo, unido por fibra a los dos conmutadores de distribución de la sede, DIST1 y DIST2 | `src/data/opo/supuestos/op3s1.ts:13`, `src/data/opo/supuestos/op3s1.ts:83` |
| VLAN 50 «Usuarios del anexo», red `10.20.50.0/23`; VRRP solo en esta VLAN: puerta virtual `10.20.50.1`, SVI de DIST1 `10.20.50.2` y de DIST2 `10.20.50.3`; las 20 primeras direcciones quedan fuera del reparto | `src/data/opo/supuestos/op3s1.ts:15`, `src/data/opo/supuestos/op3s1.ts:17`, `src/data/opo/supuestos/op3s1.ts:18`, `src/data/opo/supuestos/op3s1.ts:88`, `src/data/opo/supuestos/op3s1.ts:126` |
| Servidor de impresión `IMP-ANX`, `10.20.50.10`, con el alias «impresion» | `src/data/opo/supuestos/op3s1.ts:19`, `src/data/opo/supuestos/op3s1.ts:90`, `src/data/opo/supuestos/op3s1.ts:387` |
| Zonas inversas internas `50.20.10.in-addr.arpa` y `51.20.10.in-addr.arpa`, en DC1 y DC2 | `src/data/opo/supuestos/op3s1.ts:21`, `src/data/opo/supuestos/op3s1.ts:342` |

### Oficina del supuesto `op3s2`

| Hecho | Fuente |
|---|---|
| Oficina comarcal en `10.20.9.0/24`: puerta `10.20.9.1`, intervalo `10.20.9.20`–`10.20.9.120`, concesión de 8 horas (la `10.20.8.0/24` ya es la de `opl1a`) | `src/data/opo/supuestos/op3s2.ts:13`, `src/data/opo/supuestos/op3s2.ts:14`, `src/data/opo/supuestos/op3s2.ts:15`, `src/data/opo/supuestos/op3s2.ts:314`, `src/data/opo/supuestos/op3s2.ts:316` |
| Puestos que usan los textos: `10.20.9.57` y `10.20.9.64` (oficina), `10.20.10.137` y `10.20.10.212` (VLAN 10, supuesto), `10.20.10.157` y `10.20.10.143` (VLAN 10, lecciones): datos de ejercicio dentro de los ámbitos | `src/data/opo/supuestos/op3s2.ts:79`, `src/data/opo/supuestos/op3s2.ts:80`, `src/data/opo/supuestos/op3s2.ts:209`, `src/data/opo/op3-m5.ts:43`, `src/data/opo/op3-m5.ts:188` |

### Jefe de sección

- Jefe de `op3`: nombre en clave NOMBRE EQUIVOCADO, adversario EL RELOJ QUE ADELANTA: nadie puede iniciar sesión, los puestos nuevos no reciben dirección y los registros cuentan una historia imposible (`src/data/opo/sections.ts:68`, `src/data/opo/sections.ts:69`, `src/data/opo/sections.ts:71`).
- Al cerrar: cada nombre resuelve donde debe, cada ámbito reparte su puerta y su DNS y todos los relojes coinciden; en el registro del proxy queda una línea: un equipo de la red de gestión pidiendo, de madrugada, un archivo de configuración que el Consorcio ya no publica (`src/data/opo/sections.ts:73`).

## 7d. Balanceo y alta disponibilidad (bloque op4)

Hechos que fija el bloque 4, «Balanceo y alta disponibilidad» (`op4m1`–`op4m5`, `opl4a`–`opl4c`, supuestos `op4s1` y
`op4s2`, jefe de sección). Revisión de 2026-11-27, sobre la rama `opo-op4-balanceo` (sin commit propio: los números de
línea son los del árbol de trabajo de ese día). El controlador fijó la publicación antes de escribir; los dos supuestos
añadieron hechos nuevos, que van aquí con su cita. Solo se citan líneas visibles (lecciones, documentos del expediente,
contextos, `carry`, opciones y explicaciones), no los comentarios de cabecera de los archivos. Lo que es del fabricante
(protocolo de alta disponibilidad de la pareja, valores de las comprobaciones, estados de drenaje) va rotulado como tal,
igual que en las piezas. Lo que aún no encaja está en §9, puntos 31 a 48. Ojo: la tabla de grupos recoge los 2 s, 3 y 2
del grupo `sede` tal como los fija `op4s2`, aunque la lección `op4m4` los da aún por no decididos (punto 31, abierto).

### Publicación y balanceadores

| Hecho | Fuente |
|---|---|
| Pareja de balanceadores (ADC, *Application Delivery Controller*) en el CPD: ADC1 `10.20.72.71` y ADC2 `10.20.72.72`, **activo-pasivo**, con el protocolo de alta disponibilidad de su fabricante y un enlace de latido directo entre los dos; comparten la VIP interna `10.20.72.70`, que tiene el activo | `src/data/opo/op4-m1.ts:221`, `src/data/opo/op4-m2.ts:32`, `src/data/opo/op4-m4.ts:220`, `src/data/opo/op4-m5.ts:22`, `src/data/opo/op4-cards.ts:60`, `src/data/opo/supuestos/op4s1.ts:114`, `src/data/opo/supuestos/op4s2.ts:115`, `src/data/opo/supuestos/op4s2.ts:125` |
| ADC1 es el activo en condiciones normales (prioridad mayor); ADC2, el pasivo. La configuración se hace en ADC1 y el propio ADC la copia a ADC2 | `src/data/opo/supuestos/op4s2.ts:116`, `src/data/opo/supuestos/op4s2.ts:117`, `src/data/opo/supuestos/op4s2.ts:127` |
| MAC de las interfaces de datos: ADC1 `00:00:5e:00:53:71`, ADC2 `00:00:5e:00:53:72` (siguen el patrón de §1 y no chocan con ninguna otra MAC del canon). Cada ADC anuncia la VIP con la MAC de su propia interfaz, no con una MAC virtual: comportamiento del protocolo de su fabricante, según la configuración del Consorcio | `src/data/opo/supuestos/op4s2.ts:116`, `src/data/opo/supuestos/op4s2.ts:117`, `src/data/opo/supuestos/op4s2.ts:125` |
| Enlace de latido: un único cable directo entre ADC1 y ADC2, sin conmutador por medio, que pasa por el **panel de parcheo P3, puerto 22, del bastidor B** del CPD. El protocolo de la pareja da por caído al otro tras **3 s** sin latido (valor del protocolo del fabricante, configurado así por el Consorcio) | `src/data/opo/supuestos/op4s2.ts:126`, `src/data/opo/supuestos/op4s2.ts:326` |
| El encaminador reenvía el puerto 443 de `203.0.113.10` a la VIP `10.20.72.70:443`; el correo sigue con su propio reenvío de puertos (§7c, punto 25). WEB1, WEB2, SEDE1 y SEDE2 no tienen reenvío propio: el ADC es lo único que se ve desde Internet | `src/data/opo/op4-m2.ts:32`, `src/data/opo/op4-m5.ts:166`, `src/data/opo/op4-cards.ts:41`, `src/data/opo/supuestos/op4s2.ts:114` |
| No hay DMZ fijada: la pareja de ADC está en el CPD, con su VIP en `10.20.72.0/21` | `src/data/opo/op4-m5.ts:166` |
| Detrás del 443 hay dos nombres: `www.arcedo.example` (web informativa, BÁSICA) y `sede.arcedo.example` (sede electrónica, MEDIA). Los dos resuelven a `203.0.113.10` (ver §9, punto 35); el ADC elige el certificado por SNI y el grupo por `Host` | `src/data/opo/op4-m3.ts:55`, `src/data/opo/op4-m5.ts:22`, `src/data/opo/op4-m5.ts:103`, `src/data/opo/op4-cards.ts:41`, `src/data/opo/supuestos/op4s2.ts:115` |
| Certificados públicos de `www` y `sede` instalados en la pareja de ADC, emitidos por `ca.example` (el del registro CAA de §7c) | `src/data/opo/op4-m5.ts:91`, `src/data/opo/op4-m5.ts:103`, `src/data/opo/supuestos/op4s2.ts:210` |
| Sin redundancia alrededor: un solo operador, una sola dirección pública y un solo CPD, sin CPD de respaldo; las dos parejas (ADC y servidores) comparten sala, línea, edificio y suministro | `src/data/opo/op4-m1.ts:231`, `src/data/opo/supuestos/op4s1.ts:100` |

### Grupos detrás de la VIP `10.20.72.70`

| Grupo | Miembros | TLS | Persistencia y reparto | Comprobación | Fuente |
|---|---|---|---|---|---|
| `www` | WEB1 `10.20.72.81` y WEB2 `10.20.72.82`, puerto 80 | **Terminado** en el ADC (descarga); los servidores reciben HTTP en el 80 | Sin persistencia; **menos conexiones** | HTTP a `/` que espera exactamente `200` | `src/data/opo/op4-m2.ts:32`, `src/data/opo/op4-m3.ts:235`, `src/data/opo/op4-m4.ts:220`, `src/data/opo/op4-m5.ts:29`, `src/data/opo/supuestos/op4s2.ts:118` |
| `sede` | SEDE1 `10.20.72.91` y SEDE2 `10.20.72.92`, puerto 443, peso 1 cada uno | Terminado en el ADC y **recifrado** hacia los servidores: decisión del Consorcio (el ENS no lo prescribe), porque la sede tiene C MEDIO y `mp.com.2` se exige por C | *Cookie* que inserta el ADC, `SEDE_SRV`, de sesión, `Secure` y `HttpOnly`, valores `s1` y `s2`, porque la aplicación guarda la sesión en la memoria de cada servidor (su propia *cookie* es `SESION_APP`). Algoritmo del perfil `perfil-sede`: **round robin** con pesos iguales | `GET /salud` por TLS que espera exactamente `200` (`/salud` responde `{"estado":"ok"}` cuando va bien); intervalo **2 s**, **3** fallos para salir y **2** aciertos para volver, valores que el Servicio copió de los valores por defecto de HAProxy 3.4 (valor del fabricante; el ADC del Consorcio no es HAProxy) | `src/data/opo/op4-m3.ts:235`, `src/data/opo/op4-m4.ts:220`, `src/data/opo/op4-m5.ts:30`, `src/data/opo/op4-m5.ts:172`, `src/data/opo/supuestos/op4s2.ts:119`, `src/data/opo/supuestos/op4s2.ts:178`, `src/data/opo/supuestos/op4s2.ts:189`, `src/data/opo/supuestos/op4s2.ts:211`–`217`, `src/data/opo/supuestos/op4s2.ts:252`–`256`, `src/data/opo/supuestos/op4s2.ts:290` |
| `registro` (lo crea `op4s1`) | REG1 `10.20.72.101` y REG2 `10.20.72.102`, puerto 443; el tramo `10.20.72.100`–`10.20.72.119` queda para nodos del registro | Terminado en el ADC y recifrado hacia los nodos por el 443 (decisión del Consorcio, con el mismo criterio que la sede) | Activo-activo; *cookie* insertada por el ADC, con nombre propio distinto de `SEDE_SRV` (sin fijar), `Secure` y `HttpOnly` | `GET /salud` por TLS que espera `200`; intervalo **5 s**, **3** fallos, **2** aciertos (decisión del Consorcio) | `src/data/opo/supuestos/op4s1.ts:117`, `src/data/opo/supuestos/op4s1.ts:213`–`218`, `src/data/opo/supuestos/op4s1.ts:345`, `src/data/opo/supuestos/op4s1.ts:415`, `src/data/opo/supuestos/op4s1.ts:480` |

- Las dos comprobaciones de `www` y `sede` son de capa 7 y piden un código exacto, no «cualquier 2xx o 3xx». La lección
  `op4m4` dice todavía que los intervalos y los umbrales «no están decididos» (`src/data/opo/op4-m4.ts:220`): ver §9, punto 31.
- Los servidores solo creen la dirección del ciudadano que les añade el ADC (`Forwarded` o `X-Forwarded-For`), porque la
  conexión viene de `10.20.72.71` o `10.20.72.72` (`src/data/opo/op4-m3.ts:107`, `src/data/opo/supuestos/op4s1.ts:480`).
- No consta que la sede pida certificado de cliente (`src/data/opo/op4-m5.ts:146`).
- Si cae un miembro con persistencia, lo normal es que el ADC mande la petición al otro, que no tiene la sesión; el
  comportamiento exacto depende del fabricante (`src/data/opo/op4-m3.ts:206`). Si el ADC1 cae, es razonable esperar que la
  *cookie* insertada siga valiendo en ADC2, porque tiene la misma configuración (deducción rotulada, `src/data/opo/op4-m3.ts:210`).

### El registro electrónico en alta disponibilidad (`op4s1`)

| Hecho | Fuente |
|---|---|
| Lo encarga la jefatura del Servicio de Informática y Comunicaciones después del cifrado «del lunes» (`op6s2`), a petición de la Secretaría General y la Gerencia. El Consorcio ya ha comprado REG1 y REG2 | `src/data/opo/supuestos/op4s1.ts:88`, `src/data/opo/supuestos/op4s1.ts:91` |
| Hoy el registro depende de una sola máquina de aplicación, REG-APP `10.20.72.30`, que se retira cuando entren REG1 y REG2; REG-DOC `10.20.72.31` (base de datos y anexos) sigue siendo un solo servidor y su alta disponibilidad queda para un proyecto aparte (ver §9, punto 32) | `src/data/opo/supuestos/op4s1.ts:91`, `src/data/opo/supuestos/op4s1.ts:118`, `src/data/opo/supuestos/op4s1.ts:119` |
| Dos públicos: el personal (oficina de registro de la sede y las tres oficinas comarcales, por la WAN) y la ciudadanía (desde la sede electrónica). Muchos escritos llegan de ayuntamientos que salen a Internet con una sola dirección pública cada uno | `src/data/opo/supuestos/op4s1.ts:96`, `src/data/opo/supuestos/op4s1.ts:97` |
| El personal entra por una VIP nueva, `10.20.72.73:443`, con el nombre `registro.ad.arcedo.example` en la zona interna de DC1 y DC2 (quién emite su certificado: §9, punto 44) | `src/data/opo/supuestos/op4s1.ts:116`, `src/data/opo/supuestos/op4s1.ts:413` |
| La ciudadanía entra por `https://sede.arcedo.example/registro/`: una regla por ruta del ADC manda esa ruta al grupo `registro` (no hay segunda dirección pública) | `src/data/opo/supuestos/op4s1.ts:415`, `src/data/opo/supuestos/op4s1.ts:423` |
| Ficha de la aplicación: la sesión vive en la memoria del nodo que la abrió y caduca tras 20 minutos sin actividad (sin sesión compartida); REG-DOC asigna cada número de asiento y el nodo no guarda datos propios; hasta 300 sesiones simultáneas por nodo; cada nodo firma el justificante con el certificado del **sello electrónico del Consorcio**, instalado en el propio nodo; la aplicación anota en cada asiento la dirección IP desde la que se presentó; atiende por HTTPS en el 443 y expone `/salud` | `src/data/opo/supuestos/op4s1.ts:135`–`141` |
| Pico: hasta **260 sesiones** a la vez el último día de plazo de la línea de ayudas; los parches se aplican cada mes | `src/data/opo/supuestos/op4s1.ts:98`, `src/data/opo/supuestos/op4s1.ts:99` |
| El `/salud` que dejó el equipo de desarrollo responde siempre 200 con «OK», sin consultar nada; el bueno debe comprobar la aplicación, REG-DOC y el certificado del sello | `src/data/opo/supuestos/op4s1.ts:205`–`207`, `src/data/opo/supuestos/op4s1.ts:543` |
| Procedimiento de parcheo: los martes desde las 07:00, un nodo cada vez; drenaje de 30 minutos como máximo y después mantenimiento aunque quede alguien. Estados con los nombres de HAProxy 3.4 (`ready`, `drain`, `maint`), y el ADC del Consorcio se comporta como él (valor del fabricante) | `src/data/opo/supuestos/op4s1.ts:230` |
| Primer parcheo: REG1 drena de 07:00 a 07:30 y pasa a `maint` con 2 sesiones; vuelve a las 07:51 (recibe sesiones a las 07:51:10). REG2 pasa a `maint` a las 08:00 sin drenar, con 23 sesiones, y vuelve a las 08:22. En total, 25 personas vuelven a identificarse | `src/data/opo/supuestos/op4s1.ts:236`–`246`, `src/data/opo/supuestos/op4s1.ts:670` |
| Las disponibilidades de los componentes del expediente (línea y encaminador 99,9 %, cada ADC 99,95 %, cada nodo 99,5 %, REG-DOC 99,95 %) son supuestas para el ejercicio, no medidas del Consorcio (ver §9, punto 42) | `src/data/opo/supuestos/op4s1.ts:151`–`161` |

### La avería del último día de plazo (`op4s2`, un miércoles y un jueves sin fecha)

El plazo de unas ayudas cierra el jueves a las 23:59, el día de más tráfico del año en la sede (`src/data/opo/supuestos/op4s2.ts:87`).

| Cuándo | Hecho | Fuente |
|---|---|---|
| Lunes 10:05 | Prueba de archivo de la sede: `SEDE_SRV=s2` en la primera respuesta y todo el trámite en SEDE2 | `src/data/opo/supuestos/op4s2.ts:184`–`193` |
| Martes 11:00 | Actualización de firmas del cortafuegos de la sede, sin incidencias | `src/data/opo/supuestos/op4s2.ts:232` |
| Miércoles 18:40 | Al servicio virtual `sede` se le aplica una copia de `perfil-www` (sin persistencia, menos conexiones) «para unificar las cabeceras de seguridad»; solo se comprueba la portada | `src/data/opo/supuestos/op4s2.ts:211`–`214`, `src/data/opo/supuestos/op4s2.ts:233` |
| Miércoles 20:52 y 22:15 | Primeras quejas de formularios que vuelven a la identificación | `src/data/opo/supuestos/op4s2.ts:92`, `src/data/opo/supuestos/op4s2.ts:93` |
| Jueves 02:05 – 02:25 | Una empresa de mantenimiento del CPD, por contrato, cambia los latiguillos del panel P3, puertos 17 a 24, en el bastidor B; su parte dice «Ninguna» incidencia. Sus trabajos no pasan por el registro de cambios y nadie del Servicio sabía que se hacían esa noche | `src/data/opo/supuestos/op4s2.ts:237`, `src/data/opo/supuestos/op4s2.ts:370`–`373` |
| Jueves 02:13:18 – 02:17:29 | Los dos ADC dejan de oírse; a las 02:13:21 ADC2 se declara activo y anuncia la VIP con su MAC mientras ADC1 sigue activo; el encaminador central cambia 8 veces la MAC de `10.20.72.70`; a las 02:17:29 vuelve el latido y ADC2 pasa a pasivo por prioridad. **248 s** con dos activos y conexiones cortadas; ninguno se reinició. La causa (el cable del latido en P3) es la hipótesis más probable, **no confirmada** | `src/data/opo/supuestos/op4s2.ts:327`–`339`, `src/data/opo/supuestos/op4s2.ts:352`–`360`, `src/data/opo/supuestos/op4s2.ts:613`, `src/data/opo/supuestos/op4s2.ts:644` |
| Jueves 02:18 | Aviso de la empresa de vigilancia de la red (§7b) sobre el cambio de MAC | `src/data/opo/supuestos/op4s2.ts:95` |
| Jueves 07:40 | Prueba del técnico de guardia desde una línea móvil: sin `SEDE_SRV`, la segunda petición va a SEDE2 y responde «sesión no encontrada» | `src/data/opo/supuestos/op4s2.ts:174`–`182` |
| Jueves 07:58:12 – 07:58:16 | SEDE2 responde 500 a `/salud` («almacén temporal de sesiones lleno») y sale del grupo tras 3 fallos | `src/data/opo/supuestos/op4s2.ts:269`–`271`, `src/data/opo/supuestos/op4s2.ts:295` |
| Jueves 08:18:40 – 08:18:44 | La guardia cambia la comprobación por una conexión TCP al 443 («SEDE2 responde al *ping*») y SEDE2 vuelve al reparto con la aplicación rota | `src/data/opo/supuestos/op4s2.ts:234`, `src/data/opo/supuestos/op4s2.ts:272`–`274` |
| Jueves 10:00 – 10:15 | SEDE1 1840 peticiones sin errores (180 ms, 31 conexiones de media); SEDE2 2760, todas 500 (4 ms, 2 conexiones): el 60 % de las peticiones acaba en error | `src/data/opo/supuestos/op4s2.ts:310`–`314`, `src/data/opo/supuestos/op4s2.ts:528` |
| Jueves 10:40 – 12:30 | Corrección en orden: comprobación `/salud`, *cookie* `SEDE_SRV` y round robin, reparación de SEDE2; segundo camino de latido y desempate, después del plazo. A las 12:30 todo funciona | `src/data/opo/supuestos/op4s2.ts:682`, `src/data/opo/supuestos/op4s2.ts:690`–`696`, `src/data/opo/supuestos/op4s2.ts:741` |

Datos del supuesto, no del Consorcio: las direcciones de los ciudadanos (`192.0.2.41`, `.77`, `.130`, `.200`), el
ayuntamiento de `198.51.100.120` y el portátil de pruebas de `198.51.100.140` (todas de documentación), `SESION_APP` y la
cabecera de diagnóstico `X-Servidor` (`src/data/opo/supuestos/op4s2.ts:92`–`97`, `src/data/opo/supuestos/op4s2.ts:173`–`178`).

### Jefe de sección

- Jefe de `op4`: nombre en clave SESIÓN PERDIDA, adversario EL NODO QUE MIENTE: el último día de unas ayudas, formularios que vuelven a la casilla de salida, errores a medias y un balanceador que jura que los dos servidores están sanos (`src/data/opo/sections.ts:87`, `src/data/opo/sections.ts:88`, `src/data/opo/sections.ts:90`). Es la misma historia que `op4s2`.
- Al cerrar: cada sesión vuelve a su servidor, la comprobación pregunta lo que importa y solo un balanceador responde por la VIP; en el registro de ADC2 queda una línea sin explicar: «durante cuatro minutos, de madrugada», los dos se creyeron el activo (`src/data/opo/sections.ts:92`). Encaja con los 248 s de `op4s2` (4 min 8 s) y con la causa sin confirmar.

## 7e. Infraestructuras de comunicaciones (bloque op2)

Hechos que fija el bloque 2, «Infraestructuras de comunicaciones» (`op2m1`–`op2m5`, `opl2a`–`opl2c`, supuestos `op2s1`
y `op2s2`). Los fija el controlador antes de escribir (2026-11-27); las piezas los repiten y no inventan otros sin
rotularlos. Parten de §6 (WAN principal MPLS de capa 3 y respaldo IPsec por Internet en cada oficina).

| Hecho | Fuente |
|---|---|
| El encaminador central de la sede termina los túneles IPsec de respaldo en `203.0.113.10` (IKEv2 por UDP 500 y 4500); el reenvío del 443 a la VIP de los ADC (§7d) no cambia | por fijar |
| Cada oficina comarcal tiene su encaminador propio, del Consorcio, con dos salidas: el acceso MPLS del operador (principal) y un acceso a Internet de otro proveedor, solo para el túnel de respaldo | por fijar |
| Direcciones públicas de los accesos de respaldo de las oficinas: `198.51.100.31`, `198.51.100.32` y `198.51.100.33` (una por oficina, en el orden en que aparezcan; sin nombres de oficina) | por fijar |
| Oficinas que ya tienen red fija en el canon: `10.20.8.0/24` (`opl1a`) y `10.20.9.0/24` (`op3s2`); usar esas en los ejemplos | por fijar |
| La VPN de administración de `op6s2` existe y termina en la sede; no se dice en qué equipo | §7b |
| Red de gestión: VLAN 99 de la sede (§5); no hay red de gestión fuera de banda fijada | §5 |
| El Consorcio no tiene SD-WAN ni CPD de respaldo: SD-WAN, VPLS, EVPN o interconexión de CPD van como «otra red» o «supuesto» | §1, §9.14 |

## 8. Datos que añaden los guiones de vídeo (borradores sin congelar, 2026-11-25)

Lo que cada guion pone en pantalla o en una pregunta y ninguna lección fija. Comprobado contra los JSON de cada
carpeta; la fuente es una escena de `storyboard.json` (`s04-arp`) o un segmento de `narration.json` (`s04-01`).
El estado sale del rótulo que lleva la escena: sin rótulo de ejemplo, el vídeo lo da como **hecho del Consorcio**;
con «ejemplo», «supuesto», «montaje de ejemplo» o «diseño de ejemplo», es **supuesto o ejemplo rotulado**; con
«otra red», **otra red, no el Consorcio**. No se listan los hechos de estándares (RFC, puertos de protocolo,
tamaños de cabecera), las imágenes rotuladas «imagen · no es el Consorcio» (la sala de mesas de 2,2 m, el coro,
el maletero…) ni lo que la lección ya trae, como el segundo CPD «a pocos kilómetros», que sigue siendo hipótesis.

### `video/trama-arcedo` (op1m1)

| Dato | Qué es | Estado en el vídeo | Fuente |
|---|---|---|---|
| `00:00:5e:00:53:19` | MAC del puesto `10.20.10.25`, destino de la respuesta ARP | Hecho del Consorcio en el vídeo | `video/trama-arcedo/storyboard.json` `s04-arp` |
| `10.20.72.10` dentro de «CPD · `10.20.72.0/21` · otra subred» | La lección saca el /21 de otro servidor (`10.20.77.200/21`); el vídeo mete en él al de expedientes | Hecho del Consorcio en el vídeo | `video/trama-arcedo/storyboard.json` `s04-arp` |
| «Red interna, sin traducción de direcciones (NAT)» | Entre el puesto de la sede y el servidor del CPD no hay NAT | Hecho del Consorcio en el vídeo | `video/trama-arcedo/storyboard.json` `s04-arp`; `video/trama-arcedo/narration.json` `s05-01` |

### `video/subredes-arcedo` (op1m2)

| Dato | Qué es | Estado en el vídeo | Fuente |
|---|---|---|---|
| `10.20.8.141/26` | Pasa de dato de ejercicio a «un teléfono IP de la oficina»; vuelve a verse dentro de `10.20.8.128/26` | Hecho del Consorcio en el vídeo | `video/subredes-arcedo/storyboard.json` `s02-prefijo`, `s05-vlsm` |
| `10.20.9.203/28` | Equipo de «otra oficina comarcal» (pregunta 1). Opciones `10.20.9.206` (correcta), `10.20.9.207`, `10.20.9.208` y `10.20.9.254` | Supuesto o ejemplo rotulado («pregunta tipo test · ejemplo») | `video/subredes-arcedo/narration.json` `s04-01`; `video/subredes-arcedo/storyboard.json` `s04-p1` |
| `10.20.9.0/26` y `10.20.9.64/27` | Subredes ya asignadas en «otra oficina», a la que le falta una para 15 equipos de gestión (pregunta 2). Opciones `10.20.9.96/27` (correcta), `10.20.9.96/28`, `10.20.9.64/27` y `10.20.9.128/25` | Supuesto o ejemplo rotulado («pregunta tipo test · ejemplo») | `video/subredes-arcedo/narration.json` `s06-01`; `video/subredes-arcedo/storyboard.json` `s06-p2` |
| `10.20.10.26`, puerto de origen 51514 | Segundo puesto de la sede, con el mismo puerto de origen que `10.20.10.25` | Hecho del Consorcio en el vídeo | `video/subredes-arcedo/storyboard.json` `s08-pat` |
| `198.51.100.80:443` | Destino en Internet de los dos puestos | Hecho del Consorcio en el vídeo (sin rótulo propio) | `video/subredes-arcedo/storyboard.json` `s08-pat` |
| `203.0.113.10:40001` y `203.0.113.10:40002` | Puertos traducidos por PAT para `10.20.10.25:51514` y `10.20.10.26:51514` | Supuesto o ejemplo rotulado (tabla «ejemplo») | `video/subredes-arcedo/storyboard.json` `s08-pat` |
| Dos puestos de la sede abren a la vez la misma web con el mismo puerto de origen | Supuesto de la pregunta 3, sin direcciones | Supuesto o ejemplo rotulado («pregunta tipo test · ejemplo») | `video/subredes-arcedo/narration.json` `s09-01` |

### `video/vlan-arcedo` (op1m3)

| Dato | Qué es | Estado en el vídeo | Fuente |
|---|---|---|---|
| 60 equipos en un solo conmutador y una sola VLAN | «Una planta» de la pregunta 1; no dice de qué sede | Supuesto o ejemplo rotulado («pregunta tipo test · ejemplo») | `video/vlan-arcedo/narration.json` `s03-01` |
| Troncal con nativa 10 en el extremo A y 20 en el B; un equipo de la VLAN 10 conectado en A | Pregunta 2 | Otra red, no el Consorcio | `video/vlan-arcedo/narration.json` `s05-01`; `video/vlan-arcedo/storyboard.json` `s05-p2` |
| Puesto de la VLAN de Usuarios con la dirección puesta a mano y la puerta de enlace en blanco | Pregunta 3, sin dirección concreta | Supuesto o ejemplo rotulado («pregunta tipo test · ejemplo») | `video/vlan-arcedo/narration.json` `s07-01` |

### `video/rutas-arcedo` (op1m4)

| Dato | Qué es | Estado en el vídeo | Fuente |
|---|---|---|---|
| «Otro encaminador» con solo `10.20.8.0/22` por `core1` y `10.20.72.0/21` por `core2`, sin ruta por defecto; destino `10.20.7.200` | Pregunta 1. Los prefijos son los de las oficinas y el CPD, en un equipo que la lección no tiene | Supuesto o ejemplo rotulado («ejemplo · otro encaminador») | `video/rutas-arcedo/narration.json` `s03-01`; `video/rutas-arcedo/storyboard.json` `s03-p1` |
| Segundo camino de OSPF a `10.20.40.0/22` con coste 60 | Se compara con el de coste 25 de la lección | Supuesto o ejemplo rotulado («coste 60 · ejemplo») | `video/rutas-arcedo/storyboard.json` `s04-fuentes` |
| Rutas de OSPF con costes 40 y 90, una de RIP a 3 saltos y una estática | Las cuatro parejas de la pregunta 2, sin direcciones | Supuesto o ejemplo rotulado («ejemplo · otro encaminador») | `video/rutas-arcedo/narration.json` `s05-01`; `video/rutas-arcedo/storyboard.json` `s05-p2` |
| Distancia 50 en la estática de respaldo hacia `10.20.40.0/22`, con los dos enlaces en servicio | Pregunta 3; la de la lección es 130 | Supuesto o ejemplo rotulado («supuesto, no es la configuración del Consorcio») | `video/rutas-arcedo/narration.json` `s07-01`; `video/rutas-arcedo/storyboard.json` `s07-p3` |
| Cinco encaminadores y tres áreas sin nombre; la del centro es el área 0 | Dibujo de OSPF; en la lección las áreas son solo un deseo | Supuesto o ejemplo rotulado («áreas · diseño de ejemplo») | `video/rutas-arcedo/storyboard.json` `s08-ospf` |
| Sesión de BGP entre el Consorcio y su operador | La voz lo dice en condicional («el que usaría») | Supuesto o ejemplo rotulado («el Consorcio y su operador · supuesto») | `video/rutas-arcedo/storyboard.json` `s09-bgp`; `video/rutas-arcedo/narration.json` `s09-02` |
| AS 64500, AS 64501 y AS 64502 | Lista de sistemas autónomos de un anuncio de BGP. El Consorcio sigue sin número de AS | Supuesto o ejemplo rotulado («números de AS de documentación») | `video/rutas-arcedo/storyboard.json` `s09-bgp` |
| Empresa con OSPF en cuatro áreas, una de ellas el área 0 | Pregunta 4 | Otra red, no el Consorcio | `video/rutas-arcedo/narration.json` `s10-01`; `video/rutas-arcedo/storyboard.json` `s10-p4` |
| VRRP en Servidores (`10.20.20.0/24`): IP virtual `10.20.20.1`, MAC virtual `00-00-5E-00-01-14`, VRID 20, direcciones propias `10.20.20.2` y `10.20.20.3` | En la lección `10.20.20.1` es la puerta de enlace de la VLAN 20, sin VRRP; el montaje la convierte en virtual | Supuesto o ejemplo rotulado («montaje de ejemplo · no es la configuración actual del Consorcio») | `video/rutas-arcedo/storyboard.json` `s11-vrrp` |
| A activo con prioridad 120 y B de respaldo con 100 | Los valores del ejercicio de la lección (`src/data/opo/op1-m4.ts:302`), puestos ahora en la subred de Servidores | Supuesto o ejemplo rotulado (mismo montaje) | `video/rutas-arcedo/storyboard.json` `s11-vrrp` |
| Subred con dos encaminadores de fabricantes distintos | Pregunta 5; el enunciado no dice de quién es la red | Otra red, no el Consorcio (lo dice solo el rótulo de la escena) | `video/rutas-arcedo/narration.json` `s12-01`; `video/rutas-arcedo/storyboard.json` `s12-p5` |

### `video/wan-wifi-arcedo` (op1m5)

| Dato | Qué es | Estado en el vídeo | Fuente |
|---|---|---|---|
| Wifi en las cuatro sedes, con varios puntos de acceso en una planta | La lección solo fija un punto de acceso, el de la oficina (`10.20.8.200`) | Hecho del Consorcio en el vídeo | `video/wan-wifi-arcedo/narration.json` `s01-01`; `video/wan-wifi-arcedo/storyboard.json` `s01-hook` |
| Una oficina comarcal pierde el acceso MPLS y trabaja por el túnel de respaldo, con llamadas a la sede | Pregunta 1. La lección solo dice que el respaldo se usa si cae el principal | Supuesto o ejemplo rotulado («pregunta tipo test · ejemplo») | `video/wan-wifi-arcedo/narration.json` `s03-01`; `video/wan-wifi-arcedo/storyboard.json` `s03-p1` |
| Dos AP vecinos de 2,4 GHz en el canal 1; uno pasa al canal 3 | Pregunta 2 | Otra red, no el Consorcio | `video/wan-wifi-arcedo/narration.json` `s05-01`; `video/wan-wifi-arcedo/storyboard.json` `s05-p2` |
| Controlador de WLAN en la sede que gestiona los AP con CAPWAP; hay que cambiar el canal a doce | Pregunta 3. El Consorcio no tiene controlador fijado (§9, punto 13) | Supuesto o ejemplo rotulado («ejemplo · supuesto»; la voz dice «Supón que…») | `video/wan-wifi-arcedo/narration.json` `s07-01`; `video/wan-wifi-arcedo/storyboard.json` `s07-p3` |

Todos estos datos son provisionales hasta que se congele cada guion. Al congelarlo, los que queden como hecho del
Consorcio pasan a las tablas de §2 a §6, con su cita, y se borran de aquí.

## 9. Contradicciones y huecos

### Contradicciones entre fuentes (no resueltas)

1. **Enlace de la oficina comarcal con la sede.** Es un /30 punto a punto dentro del bloque de la oficina, con la interfaz de la sede en `10.20.8.226` (`src/data/opo/op1-m2.ts:94`, `src/data/opo/labs-op1.ts:92`); es fibra con OSPF y una estática de respaldo (`src/data/opo/op1-m4.ts:243`); y es una VPN de capa 3 sobre MPLS con un túnel IPsec de respaldo (`src/data/opo/op1-m5.ts:119`). Un guion tiene que elegir una y decirlo.
   - En los borradores de vídeo (§8): `subredes-arcedo` sigue el /30 de la lección de direccionamiento (`video/subredes-arcedo/storyboard.json` `s05-vlsm`, con la etiqueta «plan de la lección de direccionamiento»), y `wan-wifi-arcedo`, el MPLS con respaldo IPsec de la lección de WAN (`video/wan-wifi-arcedo/storyboard.json` `s02-wan`, «diseño de la lección de WAN»). En `10.20.9.0/24` ya solo pone direcciones un borrador, `subredes-arcedo` (preguntas 1 y 2: `video/subredes-arcedo/narration.json` `s04-01` y `s06-01`); `rutas-arcedo` usaba antes `10.20.9.77` y ahora pregunta por `10.20.7.200` (`video/rutas-arcedo/narration.json` `s03-01`).
2. **Quién encamina entre las VLAN de la sede.** Dos conmutadores de distribución de capa 3 con SVI (`src/data/opo/op1-m3.ts:190`); «hoy», un encaminador con subinterfaces por un troncal de 1 Gbit/s (`src/data/opo/op1-m3.ts:311`); y «el encaminador» que responde por `10.20.10.1` (`src/data/opo/op1-m1.ts:76`).
3. **Salida a Internet.** Un operador, una sola dirección pública y una ruta por defecto estática (`src/data/opo/op1-m2.ts:300`, `src/data/opo/op1-m4.ts:33`) frente a sistema autónomo propio, bloque público propio y dos operadores con BGP (`src/data/opo/op1-m4.ts:164`, `src/data/opo/op1-m4.ts:273`). Además, el ejemplo de NAT estático publica un servidor como `203.0.113.20` (`src/data/opo/op1-m2.ts:160`), una segunda dirección pública.
4. **Dónde están los servidores.** En la VLAN 20 de la sede, `10.20.20.0/24` (`src/data/opo/op1-m3.ts:190`), y en el CPD, `10.20.72.10` y `10.20.77.200/21` (`src/data/opo/op1-m1.ts:76`, `src/data/opo/op1-m2.ts:246`), cuando el CPD está en la propia sede (`src/data/opo/op1-m5.ts:119`). Ninguna lección dice cómo se reparten.
5. **Valdecierzo no está en la lista de sedes.** El centro de formación (`src/data/opo/op1-m4.ts:115`) no cuenta entre la sede y las tres oficinas (`src/data/opo/op1-m1.ts:21`, `src/data/opo/op1-m5.ts:119`), y la pregunta que repite su caso habla de «una oficina comarcal» (`src/data/opo/op1-m4.ts:243`).
6. **`10.20.10.0/24` tiene dos dueños.** Es una de las cuatro redes reservadas para las oficinas comarcales, de `10.20.8.0/24` a `10.20.11.0/24`, una por oficina y una de reserva (`src/data/opo/op1-m2.ts:94`), y a la vez la VLAN 10 Usuarios de la sede central (`src/data/opo/op1-m3.ts:190`; también en el recorrido MPLS, `src/data/opo/op1-m5.ts:74`). Ninguna fuente dice qué red es la de reserva.
   - El supuesto `op1s1` usa `10.20.11.0/24` para el edificio nuevo de una oficina, sin llamarlo «de reserva», para no pisar ninguna de las dos (`src/data/opo/supuestos/op1s1.ts`).

### Huecos y ambigüedades

7. **Enlaces entre encaminadores.** Uno se numera `10.20.255.0/31` (`src/data/opo/op1-m2.ts:330`); los siguientes saltos del encaminador central son `10.20.255.2`, `.6`, `.10` y `.14`, de cuatro en cuatro y sin máscara (`src/data/opo/op1-m4.ts:34`). No se dice qué prefijo usan esos enlaces. Además, `10.20.255.1`, `.3`, `.9` y `.200` son Router ID en un ejercicio (`src/data/opo/op1-m4.ts:258`).
8. **La MAC `00:00:5e:00:53:01`** es la de la puerta de enlace de la VLAN 10 (`src/data/opo/op1-m1.ts:76`) y también una entrada estática de la VLAN 99 en P24 (`src/data/opo/op1-m3.ts:39`). Puede ser el mismo equipo, pero no se dice.
9. **La VLAN 40 Impresoras no tiene subred** (`src/data/opo/op1-m3.ts:190`), y `10.20.40.0/22`, que tentaría por el número, es Valdecierzo (`src/data/opo/op1-m4.ts:115`).
10. **Puertas de enlace de la oficina sin fijar.** En el laboratorio, `10.20.8.1`, `.129` y `.193` son equipos finales (`src/data/opo/labs-op1.ts:87`, `src/data/opo/labs-op1.ts:57`, `src/data/opo/labs-op1.ts:77`). Tampoco hay números de VLAN para las oficinas: la lección solo dice que cada subred del plan se convierte en una VLAN (`src/data/opo/op1-m2.ts:238`).
11. **`10.20.10.25` se repite:** es el puesto de la sede (`src/data/opo/op1-m1.ts:76`) y el equipo A del laboratorio (`src/data/opo/labs-op1.ts:122`). Ninguna fuente dice si es el mismo.
12. **Redes sin dueño.** `10.20.12.x` (`src/data/opo/op1-m4.ts:35`) y `10.20.16.0/24` a `10.20.23.0/24` (`src/data/opo/op1-m2.ts:290`) aparecen en tablas y preguntas sin decir qué son.
13. **Nunca se fija:** un prefijo IPv6 del Consorcio, direcciones de `192.0.2.0/24` o `198.51.100.0/24` (salvo `198.51.100.77`, dato del supuesto `op6s2`, punto 18, y los resolutores del operador `198.51.100.53` y `198.51.100.54`, hecho de `op3`, §7c), un número de AS, números de área de OSPF, puertas de enlace de las VLAN 30 y 99, un controlador de WLAN, un SSID, canales de los AP del Consorcio, conmutadores PoE concretos ni nombres de las oficinas comarcales.
14. **Solo hipótesis:** el CPD de respaldo (`src/data/opo/op1-m5.ts:119`, `src/data/opo/op1-m5.ts:124`) y las tres áreas de OSPF (`src/data/opo/op1-m4.ts:144`). No se pueden enseñar como algo que ya existe.

### Bloque op6 (ENS y normativa)

15. **Cuatro sistemas «en ALTA» que el resto del bloque no conoce.** El laboratorio `opl6a` da doce sistemas «del Consorcio» y cuatro salen ALTA: expedientes de contratación, telefonía IP de las oficinas, contabilidad y tesorería, y gestión de personal (`src/data/opo/labs-op6.ts:84`, `src/data/opo/labs-op6.ts:94`, `src/data/opo/labs-op6.ts:104`, `src/data/opo/labs-op6.ts:114`). Ninguna otra pieza fija esos sistemas ni su categoría, y `op6m3` habla de «un sistema hipotético con alguna dimensión en ALTO» (`src/data/opo/op6-m3.ts:158`), lo que sugiere que el Consorcio no tiene ninguno. Hueco: los doce de `opl6a` son sistemas de ejemplo, no canónicos, salvo nóminas y web informativa (ver punto 16); un guion no debe presentarlos como el inventario del Consorcio.
   - **Resuelto (2026-11-26).** «Expedientes de contratación» sale del laboratorio y lo sustituye el «portafirmas electrónico de resoluciones» (I ALTO, ALTA), que no es ninguno de los sistemas canónicos (`src/data/opo/labs-op6.ts:84`). El `brief` de `opl6a` dice ahora que, salvo nóminas y la web informativa, las valoraciones son supuestas para el ejercicio (`src/data/opo/labs-op6.ts:17`). Telefonía IP, contabilidad y personal siguen en ALTA como sistemas de ejercicio, no del inventario del Consorcio.
16. **Expedientes: MEDIA o ALTA.** `op6m2` categoriza el sistema de expedientes como MEDIA, con la integridad en MEDIO (`src/data/opo/op6-m2.ts:324`); `opl6a` pone a «gestión de expedientes de contratación» con la integridad en ALTO y categoría ALTA (`src/data/opo/labs-op6.ts:84`, `src/data/opo/labs-op6.ts:85`). Tampoco coinciden en nóminas: la lección da la trazabilidad en BAJO (`src/data/opo/op6-m2.ts:124`) y el laboratorio en MEDIO (`src/data/opo/labs-op6.ts:79`); la categoría, MEDIA, es la misma. En la web informativa sí coinciden: BÁSICA y T BAJO (`src/data/opo/op6-m2.ts:158`, `src/data/opo/labs-op6.ts:74`).
   - **Resuelto (2026-11-26).** El laboratorio ya no tiene un sistema de expedientes (punto 15), y nóminas lleva T en BAJO, como la lección; la categoría sigue siendo MEDIA (`src/data/opo/labs-op6.ts:79`).
17. **El registro electrónico, ¿sistema aparte o servicio de la sede?** `op6s1` lo valora como un servicio de la sede electrónica, dentro de un sistema MEDIA que se audita por primera vez para la certificación (`src/data/opo/supuestos/op6s1.ts:125`, `src/data/opo/supuestos/op6s1.ts:190`). `op6s2`, `op6m3` y `op6m4` lo tratan como un sistema propio, de categoría MEDIA, y `op6m4` dice que superó su auditoría ordinaria hace ocho meses (`src/data/opo/supuestos/op6s2.ts:101`, `src/data/opo/op6-m3.ts:350`, `src/data/opo/op6-m4.ts:299`). Además, `op6m1` habla de la Declaración de Aplicabilidad «del registro electrónico» (`src/data/opo/op6-m1.ts:148`). Los niveles del registro no se contradicen: D MEDIO (`src/data/opo/supuestos/op6s1.ts:125`, `src/data/opo/supuestos/op6s2.ts:101`) y T BAJO (`src/data/opo/supuestos/op6s1.ts:125`, `src/data/opo/op6-m3.ts:350`). Tampoco encajan las copias: la auditoría de la sede anota copias sin pruebas de recuperación (`src/data/opo/supuestos/op6s1.ts:196`), y el informe de `op6s2` dice que la última prueba de las copias del registro salió bien hace tres meses (`src/data/opo/supuestos/op6s2.ts:187`).
   - **Resuelto (2026-11-26).** El registro electrónico de entrada es un sistema propio (MEDIA) y la sede da acceso a él: `op6s1` lo dice en el memorando y valora el servicio «Acceso al registro electrónico» (`src/data/opo/supuestos/op6s1.ts:88`, `src/data/opo/supuestos/op6s1.ts:125`). La auditoría de hace ocho meses de `op6m4` es la del registro y la de `op6s1` es la primera de la sede; ninguna frase las une. Copias: `op6s2` dice ahora que las pruebas de recuperación de las copias del registro empezaron después de que la auditoría de la sede echara en falta las suyas, y que la última, hace tres meses, salió bien (`src/data/opo/supuestos/op6s2.ts:187`). Eso pone el supuesto `op6s1` más de tres meses antes que `op6s2`.
18. **Servidores del registro en la VLAN 20, «en el CPD».** `op6s2` pone REG-APP y REG-DOC en `10.20.20.30` y `10.20.20.31`, dentro de la VLAN 20 Servidores de la sede (§5), y a la vez «en el CPD de la sede» (`src/data/opo/supuestos/op6s2.ts:102`), cuando el canon sitúa el CPD en `10.20.72.0/21` (§3). Es el punto 4 con un ejemplo más. También hay que tratar como datos del supuesto, no del Consorcio, a `198.51.100.77` (dirección de documentación permitida), `adm-reg` y los 46 servidores del CPD.
   - **Resuelto (2026-11-26).** REG-APP y REG-DOC pasan a `10.20.72.30` y `10.20.72.31`, dentro del CPD `10.20.72.0/21` y sin chocar con `10.20.72.10` ni `10.20.77.200`, en la ficha, el registro del cortafuegos y la explicación de f1t3 (`src/data/opo/supuestos/op6s2.ts:83`–`86`, `src/data/opo/supuestos/op6s2.ts:102`, `src/data/opo/supuestos/op6s2.ts:268`). La ficha sigue siendo la única pieza que une dirección y servidor, así que los `cite` de f1t3 y f4t2 no cambian. `198.51.100.77`, `adm-reg` y los 46 servidores siguen siendo datos del supuesto.
19. **Valdecierzo sí cuenta como sede del Consorcio, solo aquí.** `op6m1` lo incluye en la lista de sedes junto a la central, el CPD y las tres oficinas (`src/data/opo/op6-m1.ts:23`); `op1` no (punto 5). No se resuelve. `op6s2` le da además un uso nuevo, el soporte desconectado de las copias semanales (`src/data/opo/supuestos/op6s2.ts:187`).
   - **Resuelto (2026-11-26).** `op6m1` describe ahora una sede central con su CPD y tres oficinas comarcales, y aparte un centro de formación en Valdecierzo «que no es una sede ni una oficina» (`src/data/opo/op6-m1.ts:23`). El uso de Valdecierzo para las copias semanales de `op6s2` se mantiene.
20. **Cronología.** El canon dice que no hay cronología (§7); `op6s2` fija un lunes con horas minuto a minuto y un jueves anterior (`src/data/opo/supuestos/op6s2.ts:64`, `src/data/opo/supuestos/op6s2.ts:205`), y `op6m4` una auditoría «hace ocho meses» (`src/data/opo/op6-m4.ts:299`), sin ninguna fecha.
21. **La red de las oficinas comarcales.** El acta del jefe de `op6` manda revisar «la red de las oficinas comarcales antes de la próxima auditoría» (`src/data/opo/sections.ts:92`), y `op6m4` pone esa infraestructura en manos de una empresa contratada (`src/data/opo/op6-m4.ts:359`); en `op1` la red de las oficinas es la «heredada» del jefe PLANO EN BLANCO (§7). Ninguna pieza dice si el acta apunta a ese problema.
22. **Huecos del bloque.** Nunca se fija: qué órgano aprueba la política de seguridad (`src/data/opo/op6-m6.ts:131`, `src/data/opo/op6-m6.ts:132`); cuántas personas emplea el Consorcio (`src/data/opo/op6-m5.ts:98`); quién es el DPD ni si es de plantilla o por contrato (`src/data/opo/op6-m5.ts:150`); el nombre de ninguna empresa contratada ni si son una o varias (§7b); el nombre de la comunidad autónoma.

### Bloque op3 (servicios de red)

23. **«El resto de equipos se sincroniza con NTP1/NTP2»: resuelto en parte.** La frase simplificada (resumen del controlador de op3: «el resto de equipos se sincroniza con ellos») es cierta solo para los equipos fuera del dominio (`src/data/opo/op3-m4.ts:143`); los miembros del dominio, incluidos DHCP1, DHCP2 y DC2, siguen la jerarquía de Windows (`src/data/opo/op3-m4.ts:142`, `src/data/opo/supuestos/op3s1.ts:131`). Corregido: la lección de hora dice ahora que todo lo demás se sincroniza con ellos «directamente o a través de la jerarquía del dominio» (`src/data/opo/op3-m4.ts:134`), y las dos preguntas de la opción 42 hablan de las impresoras y demás equipos que no son del dominio y toman su configuración por DHCP (`src/data/opo/op3-m3.ts:349`, `src/data/opo/op3-m4.ts:322`), como el recuadro de la lección (`src/data/opo/op3-m4.ts:150`). De qué equipo toman la hora los puestos de la sede: `op3s2` dice que de un controlador del dominio y, con DC2 sin sincronizar, de DC1, rotulado como comportamiento de Windows (`src/data/opo/supuestos/op3s2.ts:110`). Sigue abierto para otras piezas: un guion debe separar «fuera del dominio, directo a NTP1/NTP2» de «miembros del dominio, por la jerarquía de Windows».
24. **Emulador de PDC: DC1 o DC2. Resuelto.** La lección lo dejaba abierto, «DC1 o DC2»; ahora fija DC1 (`src/data/opo/op3-m4.ts:141`), como los dos supuestos (`src/data/opo/supuestos/op3s1.ts:24`, `src/data/opo/supuestos/op3s2.ts:20`), y nombra a DC2 entre los miembros del dominio (`src/data/opo/op3-m4.ts:142`). DC1 es el canónico.
25. **Una sola dirección pública frente a tres usos.** `203.0.113.10` hace de dirección de salida de los 200 puestos (PAT, `src/data/opo/op1-m2.ts:300`) y ahora además sirve `www` y `correo` con reenvío de puertos (`src/data/opo/op3-m1.ts:178`, `src/data/opo/op3-m1.ts:184`), mientras que `op1m2` publica un servidor como `203.0.113.20` (`src/data/opo/op1-m2.ts:160`, punto 3). Dónde está el servidor de correo tras el reenvío no se dice: ninguna pieza le da dirección interna.
26. **VRRP solo en la VLAN 50.** `op3s1` pone VRRP únicamente en la VLAN 50 del anexo, con `10.20.50.1` virtual, como decisión del escenario («solo en esta VLAN», `src/data/opo/supuestos/op3s1.ts:16`, `src/data/opo/supuestos/op3s1.ts:17`). El borrador de vídeo `rutas-arcedo` monta VRRP en Servidores (`10.20.20.0/24`) con `10.20.20.1` como IP virtual (§8, `video/rutas-arcedo/storyboard.json` `s11-vrrp`), rotulado como montaje de ejemplo: no coinciden y el vídeo no debe presentarse como la configuración del Consorcio. La nota de §6 («VRRP / HSRP: ningún dato del Consorcio») queda matizada solo para la VLAN 50, y en un supuesto.
27. **La reserva `10.20.10.200` de la VLAN 10. Resuelto.** Era de una impresora de la planta 2, que chocaba con la VLAN 40 Impresoras de §5 (punto 9). Ahora es del equipo de videoconferencia de la sala de reuniones, un equipo de usuarios dentro del ámbito de la VLAN 10 (`src/data/opo/op3-m3.ts:129`).
28. **El reloj atrasado o adelantado de los dos supuestos.** En `op3s1`, DHCP2 va 250 s por detrás con su reloj local (`src/data/opo/supuestos/op3s1.ts:520`); en `op3s2`, DC2 va 400 s adelantado (`src/data/opo/supuestos/op3s2.ts:8`–`10`). Son dos averías de dos supuestos distintos, no la misma, y no hay una cronología común entre ambos (punto 20). Un guion tiene que elegir uno.
29. **Fecha y direcciones de ejercicio.** El SERIAL `2026112601` (`src/data/opo/op3-m1.ts:168`) es una fecha, y §7 dice que el escenario no tiene cronología (punto 20). Las direcciones de equipo `10.20.10.137`, `.143`, `.157` y `.212` y `10.20.9.57` y `.64` son datos de ejercicio dentro de los ámbitos, no equipos con nombre del Consorcio.
30. **`10.20.9.0/24` tiene dos repartos.** `op3s2` fija la oficina comarcal en `10.20.9.0/24`, con puerta `10.20.9.1` e intervalo `10.20.9.20`–`10.20.9.120` (`src/data/opo/supuestos/op3s2.ts:13`, `src/data/opo/supuestos/op3s2.ts:14`, `src/data/opo/supuestos/op3s2.ts:15`). El borrador de vídeo `subredes-arcedo` (rama no fusionada `video-redes-guiones`) reparte esa misma red en `10.20.9.0/26` y `10.20.9.64/27` en «otra oficina comarcal», como ejemplo rotulado (§8, `video/subredes-arcedo/narration.json` `s06-01`), y usa `10.20.9.203/28` en la pregunta 1. Los dos usos no caben a la vez (el intervalo hasta `.120` cruza el `/27` de `.64` a `.95` y llega a la zona de `.96`). Se resuelve con el rótulo del vídeo («otra oficina»), pero el punto 1 sigue siendo válido: ninguna fuente dice qué oficina usa cuál.

### Bloque op4 (balanceo y alta disponibilidad)

Abiertos a 2026-11-27. Donde hay un arreglo propuesto, va como propuesta: ninguno está aplicado todavía.

31. **Intervalos y umbrales de las comprobaciones: «no decididos» frente a tres cifras.** `op4m4` dice que los intervalos y los umbrales de los grupos `www` y `sede` «no están decididos en este escenario» (`src/data/opo/op4-m4.ts:220`). Pero `op4s2` fija el grupo `sede` en 2 s, 3 fallos y 2 aciertos, copiados de los valores por defecto de HAProxy 3.4 (`src/data/opo/supuestos/op4s2.ts:252`–`256`), y su registro sigue ese ritmo (`src/data/opo/supuestos/op4s2.ts:269`–`274`); `op4s1` fija el grupo `registro` en 5 s, 3 y 2 (`src/data/opo/supuestos/op4s1.ts:215`–`218`); y el laboratorio `opl4a` usa para el grupo `sede` los valores por defecto de HAProxy 3.4 como supuesto (`src/data/opo/labs-op4.ts:53`). `op4s2` y `opl4a` dan los mismos números y `op4s1` habla de otro grupo, así que solo choca la lección. Propuesta: en `op4m4:220`, cambiar «Los intervalos y los umbrales no están decididos en este escenario: dependen del fabricante del ADC.» por «Los intervalos y los umbrales los pone el Consorcio en su ADC: en el grupo `sede`, 2 s, 3 fallos para salir y 2 aciertos para volver, copiados de los valores por defecto de HAProxy 3.4 (valor del fabricante); los de `www` no se fijan.»
   - **Resuelto (2026-11-27).** `op4m4` dice ahora que el Consorcio fija en el grupo `sede` 2 s, 3 fallos y 2 aciertos (copiados de HAProxy 3.4, valor del fabricante) y que los de `www` no se fijan; `op4s2` y `opl4b` coinciden; `op4s1` fija otros (5 s / 3 / 2) para el grupo `registro`.
32. **REG-APP y REG-DOC después del ataque.** `op6s2` dice que el registro volvió «en los dos servidores nuevos» y que REG-APP y REG-DOC (`10.20.72.30` y `10.20.72.31`) «siguen aislados» como evidencia (`src/data/opo/supuestos/op6s2.ts:204`, `src/data/opo/supuestos/op6s2.ts:206`). `op4s1` llama REG-APP, en `10.20.72.30`, al servidor de aplicación «actual», y deja REG-DOC en `10.20.72.31` como la base de datos en servicio (`src/data/opo/supuestos/op4s1.ts:91`, `src/data/opo/supuestos/op4s1.ts:118`, `src/data/opo/supuestos/op4s1.ts:119`). No se dice si los servidores nuevos heredaron nombre y dirección, y no pueden estar en la red con la misma dirección que los aislados. Propuesta: en `op4s1:118`, «Servidor de aplicación con el que volvió el registro tras el cifrado: uno de los dos servidores nuevos, que conserva el nombre y la dirección del anterior (el cifrado sigue aislado, fuera de la red). Se retira cuando entren REG1 y REG2.», y lo mismo para REG-DOC en `op4s1:119`.
   - **Resuelto (2026-11-27).** La ficha de `op4s1` dice que REG-APP y REG-DOC son los dos servidores nuevos con los que volvió el registro, con el nombre y la dirección de los anteriores, y que los cifrados siguen aislados.
33. **Orden de `op6s2`, `op4s1` y `op4s2`.** `op4s1` va después de `op6s2`: habla del cifrado «del lunes» (`src/data/opo/supuestos/op4s1.ts:91`). `op4s2` no tiene grupo `registro`, ni VIP `10.20.72.73`, ni regla `/registro/` en el servicio virtual `sede` (`src/data/opo/supuestos/op4s2.ts:114`–`127`, `src/data/opo/supuestos/op4s2.ts:207`–`218`), así que, si comparte línea temporal con `op4s1`, tiene que ser anterior a que se publique el grupo `registro`. Ninguna pieza fija si `op4s2` va antes o después de `op6s2`, ni si las ayudas de los dos supuestos de op4 son la misma línea. Hasta que se fije, un guion trata los tres como episodios sin orden común (punto 20).
34. **¿Dónde se presentan las ayudas: en la sede o en el registro?** En `op4s2` el formulario de ayudas lo sirven SEDE1 y SEDE2 (`/ayudas/solicitud`, botón «Presentar», `src/data/opo/supuestos/op4s2.ts:97`, `src/data/opo/supuestos/op4s2.ts:176`). En `op4s1` el pico del último día de plazo de «la línea de ayudas» cae en el registro electrónico (`src/data/opo/supuestos/op4s1.ts:98`), y en `op6s2` las solicitudes de ayudas están en los asientos del registro (`src/data/opo/supuestos/op6s2.ts:207`). Puede que la sede recoja el formulario y lo entregue al registro, pero ninguna pieza lo dice.
35. **`sede.arcedo.example` no aparece en la zona pública (hueco, no contradicción).** El bloque op4 da por hecho que `sede.arcedo.example` resuelve a `203.0.113.10` (`src/data/opo/op4-m3.ts:55`, `src/data/opo/op4-cards.ts:41`). El fichero de zona de `op3m1` va rotulado como «extracto» (`src/data/opo/op3-m1.ts:166`) y solo trae `www`, `correo` y `portal` (`src/data/opo/op3-m1.ts:178`–`180`), así que no lo contradice, pero tampoco lo recoge; y su comentario dice que el encaminador «reenvía cada puerto al servidor que toca» (`src/data/opo/op3-m1.ts:184`–`185`), cuando el 443 ya va a la VIP del ADC y no a un servidor. Ninguna prueba fija esa lista de registros. Propuesta opcional: añadir `sede.arcedo.example.   3600 IN A     203.0.113.10` al extracto de `op3m1` y cambiar el comentario por «www, sede y correo comparten la única dirección pública: el encaminador reenvía el 443 a la VIP de los balanceadores y el puerto del correo a su servidor.»
   - **Resuelto (2026-11-27).** `op3m1` publica ahora `sede.arcedo.example. 3600 IN A 203.0.113.10` y su comentario dice que el encaminador reenvía el 443 a la VIP de los balanceadores y el puerto del correo a su servidor.
36. **El encaminador central y el CPD.** En `op4s2` el «encaminador central» reenvía el 443 de `203.0.113.10` y tiene una entrada ARP para `10.20.72.70` (`src/data/opo/supuestos/op4s2.ts:114`, `src/data/opo/supuestos/op4s2.ts:352`), lo que le da una interfaz en el CPD `10.20.72.0/21`; la tabla de rutas del encaminador central de `op1m4` no tiene ninguna red conectada en el CPD y llega a `10.20.0.0/16` por OSPF (`src/data/opo/op1-m4.ts:33`–`38`, §6). `op4s1` lo llama «encaminador de salida» (`src/data/opo/supuestos/op4s1.ts:157`). No se dice si es el mismo equipo ni por qué interfaz llega a la VIP.
37. **«P3» con dos significados.** En `op1m3` P3 es un puerto del conmutador de acceso (§4, `src/data/opo/op1-m3.ts:34`, `src/data/opo/op1-m3.ts:44`); en `op4s2`, el panel de parcheo P3 del bastidor B del CPD (`src/data/opo/supuestos/op4s2.ts:126`). No chocan, pero un guion que use los dos tiene que decir de cuál habla.
38. **`option persist`, sin fuente.** `op4s1` (f2t4) y `opl4a` atribuyen a «HAProxy sin `option persist`» que una petición con *cookie* hacia un miembro caído acabe en el otro (`src/data/opo/supuestos/op4s1.ts:403`, `src/data/opo/labs-op4.ts:73`). El dossier de op4 no recoge `option persist` (`docs/superpowers/sources/2026-11-27-op4-fuentes.md`, §9.3), y la lección lo deja en «lo normal es…» con «el comportamiento exacto depende del fabricante» (`src/data/opo/op4-m3.ts:206`). Propuesta: en los dos sitios, sustituir esa frase por «Lo normal es que el ADC mande esas peticiones al otro miembro; el comportamiento exacto depende del fabricante.» En el laboratorio hay que cambiar a la vez la prueba que fija el texto actual (`src/data/opo/op4-labs.test.ts:77`).
   - **Resuelto (2026-11-27).** `op4s1` (f2t4) y `opl4b` dicen ahora «lo normal es que… el comportamiento exacto depende del fabricante», como `op4m3`; la prueba de `op4-labs.test.ts` ya no fija `option persist`.
39. **Atributos de la *cookie* de la sede: recomendación o hecho.** `op4m3` dice que `Secure` y `HttpOnly` son una recomendación que «no es un dato del canon» (`src/data/opo/op4-m3.ts:235`), pero `op4s2` fija `SEDE_SRV` como *cookie* de sesión con `Secure` y `HttpOnly` (`src/data/opo/supuestos/op4s2.ts:189`, `src/data/opo/supuestos/op4s2.ts:212`–`213`). Propuesta: en `op4m3:235`, cambiar «Como recomendación (no es un dato del canon), conviene que la *cookie* lleve» por «La *cookie* lleva».
   - **Resuelto (2026-11-27).** `op4m3` dice ahora que la *cookie* lleva `Secure` y `HttpOnly`, como fija `op4s2` para `SEDE_SRV`.
40. **Tres mañanas en que SEDE2 suspende `/salud`.** El laboratorio `opl4a` (una mañana sin día: falla a las 10:15:00 y se arregla hacia las 10:31; `src/data/opo/labs-op4.ts:53`, `src/data/opo/labs-op4.ts:58`, `src/data/opo/labs-op4.ts:78`), `op4s2` (jueves: falla a las 07:58:12 y a las 10:15 sigue roto y dentro del grupo; `src/data/opo/supuestos/op4s2.ts:269`, `src/data/opo/supuestos/op4s2.ts:310`–`311`) y el jefe de sección (`src/data/opo/sections.ts:90`). El laboratorio va rotulado como supuesto y no es la misma avería que la de `op4s2`: un guion tiene que elegir una.
41. **Drenaje: hasta que terminen o 30 minutos.** `op4m4` dice que para actualizar SEDE1 se drena y solo se pasa a mantenimiento cuando sus usuarios han terminado (`src/data/opo/op4-m4.ts:220`); el procedimiento de `op4s1` para el grupo `registro` corta el drenaje a los 30 minutos «aunque quede alguien» (`src/data/opo/supuestos/op4s1.ts:230`). Son grupos distintos y no se contradicen, pero no hay un procedimiento único del Consorcio: el de 30 minutos solo vale para `registro`.
42. **Disponibilidades de ejercicio distintas.** `op4m1` calcula con cada ADC al 99,9 % y cada SEDE al 99 % (`src/data/opo/op4-m1.ts:121`, `src/data/opo/op4-m1.ts:125`, `src/data/opo/op4-m1.ts:126`); `op4s1`, con cada ADC al 99,95 % y cada nodo del registro al 99,5 % (`src/data/opo/supuestos/op4s1.ts:151`–`161`). Las dos van rotuladas como supuestas: no son datos del Consorcio y no hay que reconciliarlas.
43. **Nivel de confidencialidad del registro.** `op4m5` justifica el recifrado de la sede porque tiene C MEDIO (`src/data/opo/op4-m5.ts:172`). `op4s1` recifra el registro «con el mismo criterio», por la categoría MEDIA y los datos personales (`src/data/opo/supuestos/op4s1.ts:478`), pero el canon no fija la C del registro: §7b solo da su D en MEDIO y su T en BAJO, y `op6s1` da C MEDIO a las solicitudes que presentan los interesados (`src/data/opo/supuestos/op6s1.ts:109`). Propuesta: en `op4s1:478`, después de «informes de discapacidad», añadir «; esas solicitudes tienen la confidencialidad en nivel MEDIO».
   - **Resuelto (2026-11-27).** `op4s1` dice ahora que las solicitudes del registro tienen la confidencialidad en nivel MEDIO (como valora `op6s1`), así que el recifrado sigue el mismo criterio que la sede.
44. **Datos de la publicación que nadie fija.** El algoritmo del grupo `registro`; el nombre de su *cookie* (solo se sabe que no es `SEDE_SRV`); quién emite el certificado de `registro.ad.arcedo.example` (solo lo dice un comentario de cabecera de `op4s1`, no el expediente); qué dirección de origen usa el ADC hacia los servidores (las piezas dicen `10.20.72.71` o `10.20.72.72`, `src/data/opo/op4-m3.ts:107`, sin dirección flotante); el fabricante del ADC y el nombre de su protocolo de alta disponibilidad (`op4s2` solo dice que no es HAProxy, `src/data/opo/supuestos/op4s2.ts:256`); y los intervalos y umbrales de `www`.
45. **Una empresa contratada más.** `op4s2` añade una empresa de mantenimiento del CPD, por contrato y sin nombre, cuyos trabajos no pasan por el registro de cambios (`src/data/opo/supuestos/op4s2.ts:237`, `src/data/opo/supuestos/op4s2.ts:373`). No está entre las de §7b (punto 22) y sigue sin saberse si alguna es la misma.
46. **El ADC no usa VRRP.** La pareja anuncia la VIP con la MAC propia de cada ADC (`src/data/opo/supuestos/op4s2.ts:125`), no con una MAC virtual `00-00-5E-00-01-{VRID}` como VRRP (§6, punto 26). Es coherente con «el protocolo de alta disponibilidad de su fabricante», pero un guion no debe dibujar la pareja como un grupo VRRP.
47. **Cronología y personas.** `op4s2` fija una semana de lunes a jueves con horas al segundo, sin fecha (punto 20), y personas sin nombre, «el técnico de guardia» y «la guardia» (`src/data/opo/supuestos/op4s2.ts:99`, `src/data/opo/supuestos/op4s2.ts:234`); `op4s1`, un martes de parcheo con «el técnico de guardia» (`src/data/opo/supuestos/op4s1.ts:245`). Nadie tiene nombre, como pide §7. La guardia es compatible con `op6s2`, donde a las 05:10 no había nadie de guardia (`src/data/opo/supuestos/op6s2.ts:64`): en op4 la guardia aparece de mañana (martes de 07:00 a 08:22, jueves a las 07:40, 08:18 y 09:30), y ninguna pieza dice que cubra la madrugada.
48. **Direcciones de documentación en el bloque op4.** §3 y el punto 13 decían que ninguna lección usa direcciones concretas de `192.0.2.0/24` ni de `198.51.100.0/24`. Ahora las usan, como datos de ejercicio y sin dueño en el Consorcio: `192.0.2.43` (ciudadano de ejemplo, `src/data/opo/op4-m3.ts:61`, `src/data/opo/op4-m5.ts:181`), `198.51.100.200` (dirección inventada por un cliente en `X-Forwarded-For`, `src/data/opo/op4-m3.ts:112`) y, en `op4s2`, `192.0.2.41`, `.77`, `.130`, `.200`, `198.51.100.120` (un ayuntamiento) y `198.51.100.140` (el portátil de pruebas en una línea móvil) (`src/data/opo/supuestos/op4s2.ts:92`–`97`, `src/data/opo/supuestos/op4s2.ts:174`). Ninguna choca con `198.51.100.53`, `.54` ni `.77` (§7b, §7c).

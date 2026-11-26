# Canon · Consorcio Provincial de Arcedo (pista «Redes y ENS»)

Registro de los hechos fijos del escenario que usan las lecciones del bloque 1 (`op1`, Redes de comunicaciones).
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

- Jefe de `op6`: nombre en clave PAPEL MOJADO, adversario EL CUMPLIMIENTO DE FACHADA: política firmada, declaración de aplicabilidad e informe de auditoría en una carpeta, pero nadie sabe quién valoró los sistemas y el registro de incidentes lleva meses vacío (`src/data/opo/sections.ts:69`, `src/data/opo/sections.ts:71`).
- Al cerrar: cada sistema con sus dimensiones valoradas por quien debe, su categoría determinada por la Unidad de Seguridad de la Información y su declaración de aplicabilidad firmada; en el archivo del comité, un acta antigua con una línea subrayada: «revisar la red de las oficinas comarcales antes de la próxima auditoría» (`src/data/opo/sections.ts:73`).

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
13. **Nunca se fija:** un prefijo IPv6 del Consorcio, direcciones de `192.0.2.0/24` o `198.51.100.0/24`, un número de AS, números de área de OSPF, puertas de enlace de las VLAN 30 y 99, un controlador de WLAN, un SSID, canales de los AP del Consorcio, conmutadores PoE concretos ni nombres de las oficinas comarcales.
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
21. **La red de las oficinas comarcales.** El acta del jefe de `op6` manda revisar «la red de las oficinas comarcales antes de la próxima auditoría» (`src/data/opo/sections.ts:73`), y `op6m4` pone esa infraestructura en manos de una empresa contratada (`src/data/opo/op6-m4.ts:359`); en `op1` la red de las oficinas es la «heredada» del jefe PLANO EN BLANCO (§7). Ninguna pieza dice si el acta apunta a ese problema.
22. **Huecos del bloque.** Nunca se fija: qué órgano aprueba la política de seguridad (`src/data/opo/op6-m6.ts:131`, `src/data/opo/op6-m6.ts:132`); cuántas personas emplea el Consorcio (`src/data/opo/op6-m5.ts:98`); quién es el DPD ni si es de plantilla o por contrato (`src/data/opo/op6-m5.ts:150`); el nombre de ninguna empresa contratada ni si son una o varias (§7b); el nombre de la comunidad autónoma.

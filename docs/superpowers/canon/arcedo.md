# Canon · Consorcio Provincial de Arcedo (pista «Redes y ENS»)

Registro de los hechos fijos del escenario que usan las lecciones del bloque 1 (`op1`, Redes de comunicaciones).
Los guiones de vídeo se escriben contra este registro: lo que salga en pantalla tiene que coincidir con la lección.

Última revisión: 2026-11-25, sobre la rama `video-redes-guiones` (commit `1f76b337`). Fuentes leídas enteras:
`src/data/opo/op1-m1.ts` … `op1-m5.ts`, `src/data/opo/labs-op1.ts`, `src/data/opo/sections.ts`,
`docs/superpowers/plans/2026-11-24-redes-ens-bloque1.md`, y de `src/data/opo/op1-cards.ts` solo las entradas con
direcciones o sedes del escenario. Las citas van como `ruta:línea`; si una lección cambia, la numeración se mueve
y hay que repasarlas.

## 1. Cómo se usa

- Cada dato lleva su fuente. Si un guion necesita algo que no está aquí, no se inventa: se mira la lección y,
  si tampoco está, se apunta en §9 como hueco y se decide antes de congelar el guion.
- Las tablas separan dos cosas. **Hecho del Consorcio**: la lección lo atribuye al Consorcio (un callout de
  ejemplo, una pregunta que empieza por «En el Consorcio…»). **Dato de ejercicio**: una dirección o un equipo que
  solo aparece en un cálculo o en una pregunta genérica dentro de `10.20.0.0/16`; sirve para repetir el mismo
  ejercicio en pantalla, no para dar por hecho que esa red existe en el Consorcio.
- El escenario no tiene cronología, ni adversario con mensajes, ni personas con nombre (§8).

## 2. Reglas del escenario

| Regla | Fuente |
|---|---|
| Organización ficticia: sede central, tres oficinas comarcales y CPD propio | `docs/superpowers/plans/2026-11-24-redes-ens-bloque1.md:34` |
| Redes de ejemplo dentro de `10.20.0.0/16` | `docs/superpowers/plans/2026-11-24-redes-ens-bloque1.md:35` |
| IP públicas solo de documentación: `192.0.2.0/24`, `198.51.100.0/24`, `203.0.113.0/24`; IPv6 `2001:db8::/32` | `docs/superpowers/plans/2026-11-24-redes-ens-bloque1.md:35` |
| Nada de marcas ni organismos reales | `docs/superpowers/plans/2026-11-24-redes-ens-bloque1.md:36` |
| Solo hechos de estándares (RFC, IEEE 802). Si un dato depende del fabricante, se dice. Nada inventado ni «aproximado» | `docs/superpowers/plans/2026-11-24-redes-ens-bloque1.md:37` |
| Todo en español; protocolos y siglas en su forma habitual; «conmutador (switch)» y «encaminador (router)» la primera vez | `docs/superpowers/plans/2026-11-24-redes-ens-bloque1.md:27` |

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

Patrón observado, no regla escrita: todas las MAC de las lecciones empiezan por `00:00:5e:00:53`.

## 3. Sedes

| Sede | Qué fija la lección | Fuente |
|---|---|---|
| Sede central | Una sola; 200 puestos numerados en `10.20.10.0/24`; al menos dos plantas, con un conmutador por planta | `src/data/opo/op1-m1.ts:21`, `src/data/opo/op1-m2.ts:300`, `src/data/opo/op1-m3.ts:295` |
| CPD | Propio. «La sede central, con su CPD»: las cuatro sedes de la WAN son la central y las tres oficinas | `src/data/opo/op1-m1.ts:21`, `src/data/opo/op1-m5.ts:119` |
| Oficinas comarcales | Tres, sin nombre. La primera tiene 100 puestos, 50 teléfonos IP y 20 impresoras y equipos de gestión | `src/data/opo/op1-m1.ts:21`, `src/data/opo/op1-m2.ts:94` |
| Oficina del laboratorio `opl1a` | «Una de las oficinas comarcales» que se muda de edificio; usa el bloque `10.20.8.0/24` | `src/data/opo/labs-op1.ts:21`, `src/data/opo/labs-op1.ts:17` |
| Centro de formación de Valdecierzo | Red `10.20.40.0/22`; unido a la sede por fibra y por un enlace de respaldo | `src/data/opo/op1-m4.ts:115` |
| CPD de respaldo / segundo centro | Solo hipótesis: «si el Consorcio montara un CPD de respaldo en la misma ciudad»; «un segundo centro situado a pocos kilómetros» | `src/data/opo/op1-m5.ts:119`, `src/data/opo/op1-m5.ts:124` |

## 4. Direccionamiento

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

Las máscaras de la tabla son las de `src/data/opo/op1-m2.ts:37` a `:42`.

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

## 5. Equipos, interfaces y direcciones

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

## 6. VLAN y conmutación

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

## 7. Encaminamiento, WAN y WLAN

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

## 8. Personas y jefe de sección

- Nadie tiene nombre. Aparece «una técnica» que da de alta la VLAN 40 (`src/data/opo/op1-m3.ts:190`) y «la administradora» que escribe las rutas estáticas (`src/data/opo/op1-m4.ts:88`).
- Jefe de `op1`: nombre en clave PLANO EN BLANCO, adversario LA RED HEREDADA: subredes que se pisan, un troncal que deja pasar todas las VLAN y una ruta estática que apunta a un equipo retirado (`src/data/opo/sections.ts:52`, `src/data/opo/sections.ts:55`).
- Al cerrar: plan sin solapes, cada VLAN con su puerta de enlace, la ruta huérfana eliminada y la nota «no apagar, nadie sabe qué cuelga de aquí» (`src/data/opo/sections.ts:57`).

## 9. Contradicciones y huecos

### Contradicciones entre fuentes (no resueltas)

1. **Enlace de la oficina comarcal con la sede.** Es un /30 punto a punto dentro del bloque de la oficina, con la interfaz de la sede en `10.20.8.226` (`src/data/opo/op1-m2.ts:94`, `src/data/opo/labs-op1.ts:92`); es fibra con OSPF y una estática de respaldo (`src/data/opo/op1-m4.ts:243`); y es una VPN de capa 3 sobre MPLS con un túnel IPsec de respaldo (`src/data/opo/op1-m5.ts:119`). Un guion tiene que elegir una y decirlo.
2. **Quién encamina entre las VLAN de la sede.** Dos conmutadores de distribución de capa 3 con SVI (`src/data/opo/op1-m3.ts:190`); «hoy», un encaminador con subinterfaces por un troncal de 1 Gbit/s (`src/data/opo/op1-m3.ts:311`); y «el encaminador» que responde por `10.20.10.1` (`src/data/opo/op1-m1.ts:76`).
3. **Salida a Internet.** Un operador, una sola dirección pública y una ruta por defecto estática (`src/data/opo/op1-m2.ts:300`, `src/data/opo/op1-m4.ts:33`) frente a sistema autónomo propio, bloque público propio y dos operadores con BGP (`src/data/opo/op1-m4.ts:164`, `src/data/opo/op1-m4.ts:273`).
4. **Dónde están los servidores.** En la VLAN 20 de la sede, `10.20.20.0/24` (`src/data/opo/op1-m3.ts:190`), y en el CPD, `10.20.72.10` y `10.20.77.200/21` (`src/data/opo/op1-m1.ts:76`, `src/data/opo/op1-m2.ts:246`), cuando el CPD está en la propia sede (`src/data/opo/op1-m5.ts:119`). Ninguna lección dice cómo se reparten.
5. **Valdecierzo no está en la lista de sedes.** El centro de formación (`src/data/opo/op1-m4.ts:115`) no cuenta entre la sede y las tres oficinas (`src/data/opo/op1-m1.ts:21`, `src/data/opo/op1-m5.ts:119`), y la pregunta que repite su caso habla de «una oficina comarcal» (`src/data/opo/op1-m4.ts:243`).
6. **Enlaces entre encaminadores.** Uno se numera `10.20.255.0/31` (`src/data/opo/op1-m2.ts:330`); los siguientes saltos del encaminador central son `10.20.255.2`, `.6`, `.10` y `.14`, sin máscara (`src/data/opo/op1-m4.ts:34`), y encajan con bloques /30, no /31. Además, `10.20.255.1`, `.3` y `.9` son Router ID en un ejercicio (`src/data/opo/op1-m4.ts:258`).

### Huecos y ambigüedades

7. **La MAC `00:00:5e:00:53:01`** es la de la puerta de enlace de la VLAN 10 (`src/data/opo/op1-m1.ts:76`) y también una entrada estática de la VLAN 99 en P24 (`src/data/opo/op1-m3.ts:39`). Puede ser el mismo equipo, pero no se dice.
8. **La VLAN 40 Impresoras no tiene subred** (`src/data/opo/op1-m3.ts:190`), y `10.20.40.0/22`, que tentaría por el número, es Valdecierzo (`src/data/opo/op1-m4.ts:115`).
9. **Puertas de enlace de la oficina sin fijar.** En el laboratorio, `10.20.8.1`, `.129` y `.193` son equipos finales (`src/data/opo/labs-op1.ts:87`, `src/data/opo/labs-op1.ts:57`, `src/data/opo/labs-op1.ts:77`). Tampoco hay números de VLAN para las oficinas: la lección solo dice que cada subred del plan se convierte en una VLAN (`src/data/opo/op1-m2.ts:238`).
10. **`10.20.10.25` se repite:** es el puesto de la sede (`src/data/opo/op1-m1.ts:76`) y el equipo A del laboratorio (`src/data/opo/labs-op1.ts:122`). Es compatible; conviene tratarlo como el mismo puesto.
11. **Redes sin dueño.** `10.20.12.x` (`src/data/opo/op1-m4.ts:35`) y `10.20.16.0/24` a `10.20.23.0/24` (`src/data/opo/op1-m2.ts:290`) aparecen en tablas y preguntas sin decir qué son.
12. **Nunca se fija:** un prefijo IPv6 del Consorcio, direcciones de `192.0.2.0/24` o `198.51.100.0/24`, un número de AS, números de área de OSPF, puertas de enlace de las VLAN 30 y 99, un controlador de WLAN, un SSID, canales de los AP del Consorcio, conmutadores PoE concretos ni nombres de las oficinas comarcales.
13. **Solo hipótesis:** el CPD de respaldo (`src/data/opo/op1-m5.ts:119`, `src/data/opo/op1-m5.ts:124`) y las tres áreas de OSPF (`src/data/opo/op1-m4.ts:144`). No se pueden enseñar como algo que ya existe.

import type { Supuesto } from '../../../lib/supuesto';

// ---------------------------------------------------------------------------
// op4s1 — «El registro, sin una sola caída» (bloque 4, Balanceo y alta
// disponibilidad; diseño)
//
// Fuente única de cifras y valores: docs/superpowers/sources/2026-11-27-op4-fuentes.md
// (§3 cookies, §4 TLS, §9 HAProxy 3.4, §12 AWS ELB, §13 Microsoft, §14
// disponibilidad, §15 ENS vía op6). Canon: docs/superpowers/canon/arcedo.md §3,
// §7b (incidente de op6s2), §7c y §7d.
//
// Decisiones de escenario (hechos nuevos, a registrar en el canon):
// - Tras el incidente de op6s2, el registro electrónico de entrada pasa a dos
//   nodos de aplicación: REG1 10.20.72.101 y REG2 10.20.72.102, puerto 443. El
//   tramo 10.20.72.100–10.20.72.119 queda reservado para nodos de aplicación del
//   registro. REG-APP 10.20.72.30 se retira cuando entran REG1 y REG2.
// - REG-DOC 10.20.72.31 (base de datos y anexos) sigue siendo un solo servidor;
//   su alta disponibilidad queda para un proyecto aparte.
// - Ficha de la aplicación (dato del escenario): la sesión vive en la memoria del
//   nodo que la abrió y caduca tras 20 min sin actividad; no hay sesión
//   compartida; REG-DOC asigna el número de asiento; cada nodo aguanta 300
//   sesiones simultáneas; cada nodo firma el justificante con el certificado del
//   sello electrónico, instalado en el propio nodo; la aplicación anota en cada
//   asiento la dirección IP desde la que se presentó; expone /salud.
// - Pico: hasta 260 sesiones a la vez (último día de plazo de la línea de ayudas).
// - Grupo «registro» en la pareja ADC1/ADC2: activo-activo, persistencia por
//   cookie insertada por el ADC (nombre propio, Secure y HttpOnly), TLS terminado
//   en el ADC y recifrado hacia los nodos (decisión del Consorcio).
// - VIP interna nueva 10.20.72.73:443, nombre registro.ad.arcedo.example (registro
//   A en la zona interna de DC1 y DC2), para la oficina de registro de la sede y
//   las oficinas comarcales por la WAN. Quién emite su certificado no se fija.
// - Ciudadanía: por https://sede.arcedo.example/registro/ — regla por ruta del ADC
//   que manda esa ruta al grupo «registro» (no hay segunda dirección pública).
// - Comprobación del grupo (decisión del Consorcio): GET /salud por TLS, espera
//   200, intervalo 5 s, 3 fallos para salir, 2 aciertos para volver.
// - Parcheo: los martes desde las 07:00, un nodo cada vez, drenaje de 30 min como
//   máximo antes de pasar a mantenimiento.
// - Disponibilidades de los componentes: supuestas para el ejercicio, no medidas.
// ---------------------------------------------------------------------------

const L1 = { label: 'Lección: Alta disponibilidad: conceptos y cálculo', href: '/learn/op4m1' };
const L2 = { label: 'Lección: Balanceo en capa 4', href: '/learn/op4m2' };
const L3 = { label: 'Lección: Balanceo en capa 7 y persistencia de sesión', href: '/learn/op4m3' };
const L4 = { label: 'Lección: Comprobaciones de salud', href: '/learn/op4m4' };
const L5 = { label: 'Lección: Descarga de TLS y publicación de aplicaciones', href: '/learn/op4m5' };
const L6 = { label: 'Lección: Medidas de seguridad del ENS', href: '/learn/op6m3' };

const RFC9110 = { label: 'RFC 9110: semántica de HTTP (503, §15.6.4)', href: 'https://www.rfc-editor.org/rfc/rfc9110' };
const RFC6265 = { label: 'RFC 6265: cookies (Secure §4.1.2.5, HttpOnly §4.1.2.6)', href: 'https://www.rfc-editor.org/rfc/rfc6265' };
const RFC7239 = { label: 'RFC 7239: cabecera Forwarded', href: 'https://www.rfc-editor.org/rfc/rfc7239' };
const RFC9846 = { label: 'RFC 9846: TLS 1.3 (reanudación, §2.2)', href: 'https://www.rfc-editor.org/rfc/rfc9846' };
const AWS_AVAIL = {
  label: 'AWS Well-Architected, pilar de fiabilidad: disponibilidad (fórmulas; documentación del fabricante)',
  href: 'https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/availability.html',
};
const MS_CLUSTER = {
  label: 'Microsoft Learn: clúster de conmutación por error (activo-activo y activo-pasivo; valor del fabricante)',
  href: 'https://learn.microsoft.com/en-us/windows-server/failover-clustering/failover-clustering-overview',
};
const HAPROXY_CONF = {
  label: 'HAProxy 3.4: manual de configuración (comprobaciones y cookies; valores del fabricante)',
  href: 'https://docs.haproxy.org/3.4/configuration.html',
};
const HAPROXY_MGMT = {
  label: 'HAProxy 3.4: guía de gestión (estados ready, drain y maint; valor del fabricante)',
  href: 'https://docs.haproxy.org/3.4/management.html',
};
const AWS_HC = {
  label: 'AWS ELB: comprobaciones de salud del ALB (valores del fabricante)',
  href: 'https://docs.aws.amazon.com/elasticloadbalancing/latest/application/target-group-health-checks.html',
};

const op4s1: Supuesto = {
  id: 'op4s1',
  track: 'opo',
  sectionIds: ['op4'],
  version: 1,
  title: 'El registro, sin una sola caída',
  brief: 'Tras el ataque que lo dejó 9 h 20 min parado, publica el registro electrónico de entrada en alta disponibilidad detrás de la pareja de balanceadores: calcula cuánto podrá pararse, decide cómo trabajan sus dos nodos, cómo se publica, la persistencia, el TLS y la comprobación de salud, y revisa el primer parcheo.',
  minutes: 60,
  prerequisites: ['op4m1', 'op4m2', 'op4m3', 'op4m4', 'op4m5'],
  dossier: [
    {
      id: 'd-memo',
      title: 'Memorando de la jefatura del Servicio: el registro en alta disponibilidad',
      kind: 'memo',
      body: [
        { t: 'p', md: '**De:** jefatura del Servicio de Informática y Comunicaciones · **Para:** equipo de sistemas y redes · **Asunto:** el registro electrónico de entrada, en dos nodos' },
        {
          t: 'p',
          md: 'Después del cifrado del lunes, el registro electrónico de entrada estuvo sin servicio **de las 05:10 a las 14:30**, y eso que atiende a todas horas. Volvió en dos servidores nuevos, pero sigue dependiendo de una sola máquina de aplicación, REG-APP. La Secretaría General, responsable del servicio, y la Gerencia quieren que la avería de un servidor no vuelva a dejar el registro parado. Hemos comprado dos servidores para la aplicación, **REG1** y **REG2**, y la idea es publicarlos detrás de la pareja de balanceadores ADC1 y ADC2. Antes de configurar nada necesito vuestro diseño, con estos datos:',
        },
        {
          t: 'list',
          items: [
            'Lo usan dos públicos. El **personal**: la oficina de registro de la sede y las tres oficinas comarcales, que llegan por la WAN. La **ciudadanía**: entra desde la sede electrónica, `sede.arcedo.example`, como hasta ahora.',
            'Muchos escritos llegan de **ayuntamientos**, cuyas redes salen a Internet con una sola dirección pública cada una: desde un mismo ayuntamiento pueden presentar varias personas a la vez.',
            'El último día de plazo de la línea de ayudas, el registro llega a tener **hasta 260 sesiones a la vez**.',
            'Los parches del sistema se aplican **cada mes**. Hay que poder aplicarlos sin cortar el servicio y sin echar de golpe a quien está a mitad de un trámite.',
            'Seguimos con **un solo operador**, una sola dirección pública (`203.0.113.10`) y **sin CPD de respaldo**. Lo que dependa de tener otra cosa, ponedlo como supuesto, no como propuesta.',
          ],
        },
      ],
    },
    {
      id: 'd-inventario',
      title: 'Inventario de equipos que intervienen',
      kind: 'table',
      body: [
        {
          t: 'table',
          headers: ['Equipo', 'Dirección', 'Qué hace'],
          rows: [
            ['ADC1 y ADC2', '`10.20.72.71` y `10.20.72.72` (CPD)', 'Pareja de balanceadores en activo-pasivo, con el protocolo de alta disponibilidad de su fabricante y un enlace de latido directo entre los dos.'],
            ['VIP de publicación', '`10.20.72.70:443`', 'Destino del puerto 443 de `203.0.113.10`. Por ella entran `www.arcedo.example` y `sede.arcedo.example`, que el ADC distingue por SNI y por `Host`.'],
            ['VIP nueva', '`10.20.72.73` (libre)', 'Reservada en la pareja de ADC para el registro. Es una dirección privada del CPD.'],
            ['REG1 y REG2', '`10.20.72.101` y `10.20.72.102` (CPD)', 'Nodos nuevos de la aplicación del registro, aún sin publicar. El tramo `10.20.72.100`–`10.20.72.119` queda para nodos del registro.'],
            ['REG-APP', '`10.20.72.30` (CPD)', 'Servidor de aplicación con el que volvió el registro tras el cifrado: uno de los dos servidores nuevos, que conserva el nombre y la dirección del anterior (el cifrado sigue aislado, fuera de la red). Se retira cuando entren REG1 y REG2.'],
            ['REG-DOC', '`10.20.72.31` (CPD)', 'Base de datos y documentos anexos del registro: el otro de los dos servidores nuevos, con el nombre y la dirección del anterior (el cifrado sigue aislado). Un solo servidor: su alta disponibilidad queda para un proyecto aparte.'],
            ['SEDE1 y SEDE2', '`10.20.72.91` y `10.20.72.92` (CPD)', 'Servidores de la sede electrónica, en el grupo `sede` del ADC.'],
            ['DC1 y DC2', '`10.20.72.11` y `10.20.72.12` (CPD)', 'Controladores de dominio con el DNS interno de `ad.arcedo.example`.'],
          ],
        },
      ],
    },
    {
      id: 'd-ficha',
      title: 'Ficha técnica de la aplicación del registro (versión instalada en REG1 y REG2)',
      kind: 'table',
      body: [
        {
          t: 'table',
          headers: ['Aspecto', 'Qué dice la ficha'],
          rows: [
            ['Sesión de usuario', 'Se guarda **en la memoria del nodo** que la abrió. Caduca tras **20 minutos sin actividad**. Esta versión no admite guardar las sesiones fuera del nodo.'],
            ['Datos del registro', 'Los asientos, sus números y los anexos se guardan en la base de datos de REG-DOC, que asigna cada número de asiento. Fuera de la sesión, el nodo no guarda ningún dato propio.'],
            ['Capacidad', 'Hasta **300 sesiones simultáneas** por nodo.'],
            ['Justificante', 'Cada nodo firma el justificante de cada presentación con el certificado del sello electrónico del Consorcio, instalado en el propio nodo.'],
            ['Dirección del presentador', 'La aplicación anota en cada asiento la dirección IP desde la que se presentó el escrito.'],
            ['Conexiones', 'Atiende por HTTPS en el puerto 443.'],
            ['Punto de salud', 'Expone `/salud`. Lo que comprueba lo programa el equipo de desarrollo del Consorcio.'],
          ],
        },
      ],
    },
    {
      id: 'd-cifras',
      title: 'Disponibilidades de los componentes (supuestas para el ejercicio)',
      kind: 'table',
      body: [
        { t: 'p', md: 'No son medidas del Consorcio: son cifras supuestas para comparar diseños. Cada fila es la disponibilidad de **un** equipo.' },
        {
          t: 'table',
          headers: ['Componente', 'Cuántos hay', 'Disponibilidad de cada uno'],
          rows: [
            ['Línea del operador', '1', '99,9 %'],
            ['Encaminador de salida', '1', '99,9 %'],
            ['ADC (ADC1 y ADC2)', '2', '99,95 %'],
            ['Nodo de aplicación (REG1 y REG2)', '2', '99,5 %'],
            ['REG-DOC', '1', '99,95 %'],
            ['REG-APP (diseño actual)', '1', '99,5 %'],
          ],
        },
      ],
    },
    {
      id: 'd-esquema',
      title: 'Esquema del diseño propuesto',
      kind: 'diagram',
      diagram: {
        width: 720,
        height: 420,
        zones: [
          { label: 'CPD (10.20.72.0/21)', x: 200, y: 16, w: 504, h: 388 },
        ],
        nodes: [
          { id: 'inet', label: 'Internet', kind: 'cloud', x: 80, y: 60, sub: 'ciudadanía y ayuntamientos' },
          { id: 'rtr', label: 'Encaminador', kind: 'router', x: 80, y: 190, sub: '203.0.113.10' },
          { id: 'wan', label: 'Personal', kind: 'pc', x: 80, y: 330, sub: 'oficina de registro y WAN' },
          { id: 'adc', label: 'ADC1 · ADC2', kind: 'server', x: 320, y: 190, sub: 'VIP .70 y .73' },
          { id: 'sede', label: 'SEDE1 · SEDE2', kind: 'server', x: 560, y: 70, sub: 'grupo sede' },
          { id: 'reg', label: 'REG1 · REG2', kind: 'server', x: 560, y: 210, sub: 'grupo registro' },
          { id: 'doc', label: 'REG-DOC', kind: 'server', x: 560, y: 340, sub: 'base de datos y anexos' },
        ],
        links: [
          { from: 'inet', to: 'rtr', label: 'una línea' },
          { from: 'rtr', to: 'adc', label: '443 → .70' },
          { from: 'wan', to: 'adc', label: '→ .73' },
          { from: 'adc', to: 'sede' },
          { from: 'adc', to: 'reg' },
          { from: 'reg', to: 'doc' },
        ],
      },
    },
    {
      id: 'd-salud',
      title: 'El /salud que ha dejado el equipo de desarrollo y la comprobación prevista en el ADC',
      kind: 'config',
      unlockedBy: 'f4',
      body: [
        {
          t: 'code',
          lang: 'text',
          title: 'Punto de salud de la aplicación · versión actual (pseudocódigo)',
          text: `cuando llega GET /salud:
    responder 200 con el texto "OK"
# no consulta nada más: «así es rápido y nunca da falsas alarmas»`,
        },
        {
          t: 'code',
          lang: 'text',
          title: 'Comprobación prevista para el grupo registro (decisión del Consorcio; sintaxis ilustrativa, sin órdenes de fabricante)',
          text: `grupo                 registro (REG1 10.20.72.101:443, REG2 10.20.72.102:443)
petición              GET /salud, por TLS
respuesta esperada    200
intervalo             5 s
fallos para salir     3
aciertos para volver  2`,
        },
      ],
    },
    {
      id: 'd-parcheo',
      title: 'Registro del ADC durante el primer parcheo del grupo registro',
      kind: 'log',
      unlockedBy: 'f5',
      body: [
        {
          t: 'p',
          md: 'Procedimiento del Consorcio: los martes desde las 07:00, un nodo cada vez; el drenaje dura **como máximo 30 minutos** y después el nodo pasa a mantenimiento aunque quede alguien. Los nombres de estado son los de HAProxy 3.4, y el ADC del Consorcio se comporta como él (valor del fabricante): en `drain` el nodo no recibe sesiones nuevas pero sigue atendiendo a quien la persistencia ata a él y se sigue comprobando; en `maint` no recibe tráfico ni comprobaciones.',
        },
        {
          t: 'code',
          lang: 'text',
          title: 'Grupo registro · martes (salida ilustrativa, sin sintaxis de fabricante)',
          text: `hora      nodo   cambio            sesiones REG1   sesiones REG2
07:00:00  REG1   ready -> drain    14              19
07:10:00  REG1   (drain)           6               27
07:20:00  REG1   (drain)           2               31
07:30:00  REG1   drain -> maint    2               33
07:31     REG1   parches y reinicio
07:51:00  REG1   maint -> ready    0               35
07:51:10  REG1   /salud 200, 200: vuelve a recibir sesiones nuevas
08:00:00  REG2   ready -> maint    12              23
          # el técnico de guardia: «el otro nodo ya está bien, así acabamos antes»
08:22:00  REG2   maint -> ready    37              0`,
        },
      ],
    },
  ],
  phases: [
    // -----------------------------------------------------------------------
    {
      id: 'f1',
      title: 'Cuánto podrá pararse',
      context:
        'Antes de configurar nada, la jefatura quiere saber cuánto ganará el registro. Usa las disponibilidades supuestas del expediente, un año de **365 días (525 600 minutos)** y la hipótesis de que las piezas fallan de forma independiente. Basta con que quede vivo uno de los dos ADC y uno de los dos nodos. Para el personal, la cadena es: pareja de ADC, pareja de nodos y REG-DOC. La ciudadanía tiene además delante la línea del operador y el encaminador. No redondees los resultados intermedios.',
      carry:
        'Con las cifras supuestas, los dos nodos en paralelo dan un 99,9975 %, y la cadena del personal (ADC, nodos y REG-DOC), un 99,947 %: unos 276 minutos de parada al año (4 h 36 min). De ellos, 262,8 los pone REG-DOC, que no está doblado. La ciudadanía, con la línea y el encaminador delante, se queda en unos 1326 minutos al año. Todo eso supone fallos independientes, y un ataque como el del lunes no lo es.',
      tasks: [
        {
          id: 'f1t1',
          kind: 'numeric',
          topic: 'op4m1',
          prompt: '¿Qué disponibilidad tiene la pareja de nodos REG1 y REG2 en paralelo? Escríbela en %, con cuatro decimales (por ejemplo, 99,1234).',
          answer: 99.9975,
          tolerance: 0.0001,
          unit: '%',
          points: 4,
          hint: { text: 'En paralelo se multiplican las indisponibilidades: 1 − (1 − A) × (1 − A).', cost: 1 },
          explain:
            'En paralelo el grupo solo cae si caen los dos, así que se multiplican las indisponibilidades: 1 − 0,005 × 0,005 = 1 − 0,000025 = 0,999975, es decir, 99,9975 %. Tienta multiplicar las disponibilidades, 0,995 × 0,995 = 0,990025 (99,0025 %), que es el cálculo en serie: daría menos que un solo nodo, como si hicieran falta los dos a la vez.',
          refs: [L1, AWS_AVAIL],
        },
        {
          id: 'f1t2',
          kind: 'numeric',
          topic: 'op4m1',
          prompt: '¿Qué disponibilidad tiene el registro para el **personal** (pareja de ADC, pareja de nodos y REG-DOC)? Escríbela en %, con tres decimales.',
          answer: 99.947,
          tolerance: 0.001,
          unit: '%',
          points: 5,
          explain:
            'Pareja de ADC: 1 − 0,0005 × 0,0005 = 0,99999975. Pareja de nodos: 0,999975. REG-DOC, solo: 0,9995. Las tres piezas están en serie, así que se multiplican: 0,99999975 × 0,999975 × 0,9995 = 0,99947476…, un 99,947 %. Tienta dejar fuera a REG-DOC porque no es «del balanceo», pero sin él no se registra nada: está en la cadena aunque no esté detrás del ADC. Sin REG-DOC saldría un 99,997 %, una ilusión.',
          refs: [L1, AWS_AVAIL],
        },
        {
          id: 'f1t3',
          kind: 'numeric',
          topic: 'op4m1',
          prompt: 'Con esa disponibilidad y un año de 365 días, ¿cuántos minutos de parada al año le corresponden al personal? Redondea al minuto.',
          answer: 276,
          tolerance: 3,
          unit: 'minutos',
          points: 4,
          explain:
            'Parada = (1 − A) × 525 600 = 0,00052524 × 525 600 ≈ 276,06 minutos, unas 4 h 36 min al año. Si partes del 99,947 % ya redondeado salen unos 279 minutos, y también vale. Con el diseño actual (REG-APP solo y REG-DOC, sin balanceador), 0,995 × 0,9995 = 0,9945025, es decir, unos 2889 minutos al año (48 h 9 min): el diseño nuevo divide la parada esperada por más de diez. Tienta usar 43 200 minutos, que son un mes de 30 días, no un año.',
          refs: [L1, AWS_AVAIL],
        },
        {
          id: 'f1t4',
          kind: 'choice',
          topic: 'op4m1',
          prompt: 'De esos minutos de parada del personal, ¿qué pieza pone la mayor parte?',
          options: [
            { id: 'a', text: 'La pareja de ADC, porque es activo-pasivo y solo trabaja uno' },
            { id: 'b', text: 'La pareja de nodos, porque es la de menor disponibilidad unitaria (99,5 %)' },
            { id: 'c', text: 'REG-DOC: es un punto único de fallo y él solo pone unos 262,8 de los 276 minutos' },
            { id: 'd', text: 'Las tres por igual, porque están en serie' },
          ],
          answer: 'c',
          points: 3,
          explain:
            'Cada pieza aporta, más o menos, su indisponibilidad por los minutos del año. REG-DOC: 0,0005 × 525 600 = 262,8 minutos. La pareja de nodos: 0,000025 × 525 600 ≈ 13,1 minutos. La pareja de ADC: 0,00000025 × 525 600 ≈ 0,13 minutos. Tienta la pareja de nodos porque cada nodo es la pieza menos fiable, pero doblada aporta poco. Que una pareja sea activo-pasivo no cambia su cálculo: basta con que quede uno vivo.',
          refs: [L1, AWS_AVAIL],
        },
        {
          id: 'f1t5',
          kind: 'multi',
          topic: 'op4m1',
          prompt: 'Marca **todas** las afirmaciones ciertas sobre estas cifras.',
          options: [
            { id: 'a', text: 'Para la ciudadanía la cifra es peor, unos 1326 minutos al año, porque la línea del operador y el encaminador están en serie y sin doblar' },
            { id: 'b', text: 'Una sola interrupción como la del lunes, de 9 h 20 min, gasta ella sola más del doble de la parada anual calculada para el personal' },
            { id: 'c', text: 'El cálculo en paralelo también cubre un ataque que cifre a la vez REG1 y REG2' },
            { id: 'd', text: 'El ENS exige un 99,9 % de disponibilidad a los sistemas con la dimensión D en nivel MEDIO' },
            { id: 'e', text: 'Con un tercer nodo, REG3, la parada anual del personal bajaría de una hora' },
          ],
          answer: ['a', 'b'],
          points: 4,
          explain:
            'Para la ciudadanía hay que multiplicar además por 0,999 × 0,999 = 0,998001: queda en un 99,748 %, unos 1326 minutos al año (22 h 6 min). De 05:10 a 14:30 van 560 minutos, más que 2 × 276 = 552. El cálculo en paralelo supone fallos independientes. Un programa de secuestro que cifra los dos nodos, o REG-DOC, los tumba a la vez: contra eso protegen las copias y la continuidad, no la redundancia. El ENS no fija porcentajes ni «nueves». Con D en MEDIO pide el análisis de impacto (op.cont.1), sin cifra. Y un tercer nodo apenas mueve el total, porque REG-DOC pone él solo 262,8 minutos.',
          refs: [L1, L6, AWS_AVAIL],
        },
      ],
    },
    // -----------------------------------------------------------------------
    {
      id: 'f2',
      title: 'Cómo trabajan los dos nodos',
      context:
        'Ahora, cómo trabajan REG1 y REG2 detrás del ADC. Lee la ficha de la aplicación y vuelve sobre los requisitos del memorando: el pico, el parcheo mensual y los dos públicos.',
      carry:
        'REG1 y REG2 trabajan en activo-activo: REG-DOC asigna los números de asiento y cada nodo, solo, aguanta el pico (260 de sus 300 sesiones). Como la sesión vive en la memoria del nodo que la abrió, el ADC tiene que mandar a cada persona siempre al mismo nodo mientras dure su trámite.',
      tasks: [
        {
          id: 'f2t1',
          kind: 'choice',
          topic: 'op4m1',
          prompt: '¿Cómo deben trabajar REG1 y REG2?',
          options: [
            { id: 'a', text: 'Activo-activo, con persistencia: los dos atienden a la vez y el ADC manda a cada persona siempre al mismo nodo mientras dure su sesión' },
            { id: 'b', text: 'Activo-pasivo: REG2 espera y solo entra si cae REG1, y así no hace falta persistencia' },
            { id: 'c', text: 'Activo-activo sin persistencia, repartiendo cada petición por turnos' },
            { id: 'd', text: 'Activo-pasivo con un testigo de quórum, para evitar el cerebro dividido entre los nodos' },
          ],
          answer: 'a',
          points: 5,
          hint: { text: 'Piensa en el parcheo mensual: ¿qué pasa con las sesiones del nodo que hay que parchear en cada opción?', cost: 1 },
          explain:
            'Los dos nodos pueden trabajar a la vez porque no guardan datos propios: el número de asiento lo da REG-DOC. Como la sesión está en la memoria de cada nodo, hace falta que el ADC lleve a cada persona siempre al mismo. El activo-pasivo tienta porque se ahorra la persistencia, pero choca con el memorando. Para parchear el nodo activo hay que pasar a todo el mundo al pasivo, y como la sesión está en memoria, todos la pierden de golpe. En activo-activo, el otro nodo sigue atendiendo mientras se prepara el parcheo de uno; cómo se retira un nodo sin cortar a nadie se ve más adelante. Repartir por turnos rompe las sesiones en cada petición. El quórum evita que dos nodos usen a la vez un recurso que solo admite uno, y aquí no hay ninguno: la base de datos ya ordena los asientos.',
          refs: [L1, L3, MS_CLUSTER],
        },
        {
          id: 'f2t2',
          kind: 'cite',
          topic: 'op4m1',
          prompt: 'Señala los documentos que, juntos, prueban que cualquiera de los dos nodos puede con el pico él solo.',
          answerSets: [['d-memo', 'd-ficha']],
          points: 4,
          explain:
            'El memorando da el pico, hasta 260 sesiones a la vez, y la ficha da la capacidad de cada nodo, 300 sesiones simultáneas. Hacen falta los dos: uno sin el otro no compara nada. Es lo que permite usar la fórmula en paralelo de la fase anterior, en la que basta un nodo vivo. El inventario tienta porque lista a REG1 y REG2, pero no dice cuánto aguanta cada uno.',
          refs: [L1],
        },
        {
          id: 'f2t3',
          kind: 'numeric',
          topic: 'op4m1',
          prompt: 'En pleno pico, REG2 se queda solo con las 260 sesiones. ¿Qué porcentaje de su capacidad está usando? Redondea al entero.',
          answer: 87,
          tolerance: 1,
          unit: '%',
          points: 3,
          explain:
            '260 / 300 = 0,8667, un 86,7 %: aguanta, pero sin mucho margen. Con los dos nodos trabajando, cada uno lleva unas 130 sesiones, un 43,3 %. Tienta responder 43, la carga de cada nodo con los dos vivos, que no es lo que se pregunta.',
          refs: [L1],
        },
        {
          id: 'f2t4',
          kind: 'choice',
          topic: 'op4m3',
          prompt: 'A media mañana REG1 se avería. ¿Qué les pasa a las personas que tenían la sesión abierta en él?',
          options: [
            { id: 'a', text: 'Cuando el ADC lo saca del reparto, sus peticiones van a REG2, que no tiene su sesión: vuelven a identificarse. Lo ya presentado, con su justificante, sigue en REG-DOC' },
            { id: 'b', text: 'REG2 continúa sus trámites, porque el ADC le pasa la sesión que tenía REG1' },
            { id: 'c', text: 'El ADC las retiene hasta que REG1 vuelve, para que no pierdan la sesión' },
            { id: 'd', text: 'Pierden también los escritos que ya habían presentado, porque estaban en REG1' },
          ],
          answer: 'a',
          points: 2,
          explain:
            'La sesión vivía en la memoria de REG1 y se va con él. Lo normal es que el ADC mande esas peticiones al otro nodo; el comportamiento exacto depende del fabricante. El ADC solo decide a qué nodo va cada petición: no guarda ni traslada sesiones. Lo que ya se presentó está en REG-DOC, porque el nodo no guarda datos propios. Evitar esa pérdida exigiría sesión compartida, y esta versión de la aplicación no la tiene.',
          refs: [L3, L1],
        },
      ],
    },
    // -----------------------------------------------------------------------
    {
      id: 'f3',
      title: 'Publicación y persistencia',
      context:
        'Toca publicar el grupo `registro` (REG1 y REG2) en la pareja de ADC y decidir cómo reconoce el ADC a cada persona. El personal entrará por la VIP nueva `10.20.72.73`, con el nombre `registro.ad.arcedo.example`, que DC1 y DC2 añadirán a la zona interna. Queda la ciudadanía, y queda la persistencia, que vale para los dos públicos.',
      carry:
        'La ciudadanía llega por `https://sede.arcedo.example/registro/`. El ADC, que ya termina el TLS de la sede para leer el `Host`, manda esa ruta al grupo `registro`, y el personal entra por `10.20.72.73`. La persistencia es una cookie que inserta el ADC, con un nombre propio (distinto del de la cookie del grupo `sede`) y los atributos Secure y HttpOnly. Para escribirla y leerla, el ADC tiene que ver la petición descifrada.',
      tasks: [
        {
          id: 'f3t1',
          kind: 'choice',
          topic: 'op4m3',
          prompt: '¿Cómo llega la ciudadanía al grupo `registro` con lo que tiene el Consorcio?',
          options: [
            { id: 'a', text: 'Con una regla del ADC que manda la ruta `/registro/` de `sede.arcedo.example` al grupo `registro`' },
            { id: 'b', text: 'Con un nombre nuevo, `registro.arcedo.example`, en una segunda dirección pública' },
            { id: 'c', text: 'Reenviando el puerto 443 de `203.0.113.10` directamente a REG1' },
            { id: 'd', text: 'Dando a la ciudadanía la VIP `10.20.72.73`' },
          ],
          answer: 'a',
          points: 4,
          explain:
            'El ADC ya recibe el 443 de la única dirección pública y lee la petición de la sede, así que puede repartir también por ruta: es reparto en capa 7. La segunda dirección pública no existe; el memorando manda tratarla como supuesto. El 443 de `203.0.113.10` ya va a la VIP `10.20.72.70`, y mandarlo a REG1 dejaría sin publicar la web y la sede y sin balanceo el registro. `10.20.72.73` es una dirección privada del CPD: desde Internet no se llega a ella.',
          refs: [L3, L5],
        },
        {
          id: 'f3t2',
          kind: 'choice',
          topic: 'op4m3',
          prompt: '¿Qué persistencia debe usar el grupo `registro`?',
          options: [
            { id: 'a', text: 'Por dirección IP de origen, que no obliga a leer HTTP' },
            { id: 'b', text: 'Por cookie insertada por el ADC, que reconoce a cada navegador' },
            { id: 'c', text: 'Por identificador de sesión TLS, leído en el saludo sin descifrar' },
            { id: 'd', text: 'Ninguna: la aplicación ya pone su propia cookie de sesión, y con eso basta' },
          ],
          answer: 'b',
          points: 6,
          hint: { text: 'Vuelve a leer en el memorando desde dónde presentan los ayuntamientos.', cost: 2 },
          explain:
            'Cada ayuntamiento sale a Internet con una sola dirección: por IP de origen, todo el ayuntamiento caería en el mismo nodo, y un móvil que cambia de red a mitad del trámite cambiaría de nodo. La cookie distingue navegador a navegador. El identificador de sesión TLS depende de campos de TLS 1.2: en TLS 1.3 los «session IDs» y «session tickets» quedan obsoletos (RFC 9846 §2.2). La cookie de la aplicación solo identifica la sesión ante el nodo que la creó. Si el ADC no hace nada con ella, reparte las peticiones sin mirarla y la siguiente puede ir al otro nodo, que no la conoce. Aprovecharla requiere configurar el ADC para eso (por ejemplo, `prefix` en HAProxy, valor del fabricante).',
          refs: [L3, RFC9846, HAPROXY_CONF],
        },
        {
          id: 'f3t3',
          kind: 'multi',
          topic: 'op4m3',
          prompt: 'Sobre la cookie de persistencia del grupo `registro`, marca **todas** las afirmaciones ciertas.',
          options: [
            { id: 'a', text: 'Solo dice a qué nodo ir: la sesión sigue en la memoria de ese nodo' },
            { id: 'b', text: 'Conviene marcarla Secure y HttpOnly (RFC 6265 §4.1.2.5 y §4.1.2.6)' },
            { id: 'c', text: 'Para escribirla y leerla en HTTPS, el ADC tiene que ver la petición HTTP descifrada' },
            { id: 'd', text: 'SameSite es uno de los atributos que define la RFC 6265' },
            { id: 'e', text: 'Si REG1 cae, la cookie permite que REG2 continúe la sesión' },
            { id: 'f', text: 'Obliga a cambiar el nombre de la cookie de sesión de la aplicación' },
          ],
          answer: ['a', 'b', 'c'],
          points: 6,
          explain:
            'La cookie insertada lleva el identificador del nodo, no los datos de la sesión: si el nodo cae, la sesión se va con él. Secure la limita a canales seguros y HttpOnly la oculta a los scripts del navegador. Las dos van bien, porque solo viaja por HTTPS y ningún script la necesita. Viaja en las cabeceras `Set-Cookie` y `Cookie`, cifradas dentro del TLS: el ADC tiene que descifrar. SameSite aparece en documentación de fabricantes, pero su texto normativo está en el borrador 6265bis, no en la RFC 6265. Y la cookie insertada es del ADC: convive con la de la aplicación sin tocarla.',
          refs: [L3, RFC6265, HAPROXY_CONF],
        },
      ],
    },
    // -----------------------------------------------------------------------
    {
      id: 'f4',
      title: 'El TLS del registro',
      context:
        'Queda decidir qué viaja cifrado entre el ADC y los nodos, y cómo sabe la aplicación desde qué dirección se presentó cada escrito. Recuerda lo que fija el bloque del ENS: el registro es un sistema de categoría **MEDIA**, y cada asiento lleva nombre, DNI, domicilio y anexos, entre ellos informes de discapacidad; esas solicitudes tienen la confidencialidad en nivel MEDIO. El Consorcio ya decidió para la sede, también MEDIA, que los datos personales no viajen sin cifrar por ningún tramo, ni siquiera dentro del CPD, y quiere el mismo criterio aquí.',
      carry:
        'Recifrado: el ADC termina el TLS del cliente y abre otra sesión TLS hacia REG1 y REG2 por el 443. Es una decisión del Consorcio, con el mismo criterio que en la sede, porque el ENS no prescribe el modo. Los nodos ven llegar las conexiones desde el ADC y leen la dirección del presentador en `Forwarded` (`for=`), que solo creen si la conexión viene de ADC1 o ADC2.',
      tasks: [
        {
          id: 'f4t1',
          kind: 'choice',
          topic: 'op4m5',
          prompt: '¿Qué modo de TLS debe usar el grupo `registro`?',
          options: [
            { id: 'a', text: 'Descarga: el TLS termina en el ADC y REG1 y REG2 reciben HTTP sin cifrar por el puerto 80' },
            { id: 'b', text: 'Recifrado: el TLS termina en el ADC, que abre otra sesión TLS hacia REG1 y REG2 por el 443' },
            { id: 'c', text: 'Paso directo: el TLS del cliente llega intacto hasta REG1 o REG2' },
            { id: 'd', text: 'Descarga hacia los nodos, y cifrar solo la conexión de los nodos con REG-DOC' },
          ],
          answer: 'b',
          points: 5,
          explain:
            'El paso directo queda fuera por lo ya decidido: sin descifrar, el ADC no ve la ruta `/registro/` ni puede usar la cookie. Entre descarga y recifrado, la descarga dejaría los datos de cada asiento en claro dentro del CPD, entre el ADC y los nodos. El Consorcio decide cifrar también ese tramo, como hizo con la sede: los dos son MEDIA y los asientos llevan datos personales. La cuarta opción cifra el tramo equivocado: lo que el ciudadano envía viajaría en claro hasta el nodo.',
          refs: [L5, RFC9846],
        },
        {
          id: 'f4t2',
          kind: 'multi',
          topic: 'op4m5',
          prompt: 'Sobre esa decisión, marca **todas** las afirmaciones ciertas.',
          options: [
            { id: 'a', text: 'La tabla de medidas del ENS no dice «recifra»: es una decisión del Consorcio, coherente con la que tomó para la sede' },
            { id: 'b', text: '`mp.com.2` Protección de la confidencialidad se exige según la dimensión C del sistema' },
            { id: 'c', text: 'El ENS obliga a recifrar en todos los sistemas de categoría MEDIA' },
            { id: 'd', text: 'Con recifrado, el ADC sigue viendo en claro las peticiones, porque las descifra para leerlas' },
            { id: 'e', text: 'Con recifrado, la clave privada del certificado que ve la ciudadanía solo está en REG1 y REG2' },
          ],
          answer: ['a', 'b', 'd'],
          points: 5,
          explain:
            'La tabla de medidas asigna `mp.com.2` por la dimensión C, pero no dice dónde termina el TLS ni si se vuelve a cifrar: recifrar es la forma que el Consorcio elige para responder. El ENS no obliga a ningún modo concreto. En el recifrado hay dos sesiones TLS, y entre una y otra el ADC tiene la petición en claro: por eso puede leer la ruta y la cookie. La clave del certificado público está en el ADC, que es quien lo presenta. Los nodos tienen la suya para la sesión interna.',
          refs: [L5, L6],
        },
        {
          id: 'f4t3',
          kind: 'choice',
          topic: 'op4m3',
          prompt: 'La aplicación anota en cada asiento la dirección desde la que se presentó. Con el recifrado, ¿qué dirección ve REG1 y qué hay que hacer?',
          options: [
            { id: 'a', text: 'Ve la del ADC. El ADC le añade la del cliente en `Forwarded` (`for=`) o en `X-Forwarded-For`, y la aplicación solo la cree si la conexión viene de ADC1 o ADC2' },
            { id: 'b', text: 'Ve la del ciudadano, porque el recifrado conserva la dirección de origen' },
            { id: 'c', text: 'Ve la del ADC. Hay que activar el protocolo PROXY, que define la RFC 7239' },
            { id: 'd', text: 'Ve la del ADC. La aplicación debe anotar el primer elemento de `X-Forwarded-For`, que es siempre el cliente original' },
          ],
          answer: 'a',
          points: 4,
          explain:
            'En el recifrado la conexión hacia REG1 la abre el ADC, así que el origen es el ADC. La cabecera estándar para devolver la dirección es `Forwarded`, con `for` (RFC 7239). Como cualquiera del camino, incluido el cliente, puede escribirla (§8.1), la aplicación solo debe creerla en conexiones que vienen del ADC. El protocolo PROXY es una especificación de HAProxy, no de la RFC 7239, y hace falta cuando el balanceador no habla HTTP. Aquí sí lo habla. El primer elemento de `X-Forwarded-For` lo puede inventar el cliente: vale el que añade el propio ADC, el último.',
          refs: [L3, RFC7239, HAPROXY_CONF],
        },
      ],
    },
    // -----------------------------------------------------------------------
    {
      id: 'f5',
      title: 'Una comprobación de salud que no mienta',
      context:
        'Antes de abrir el grupo hay que decidir cómo sabe el ADC que un nodo puede atender. En el expediente tienes el `/salud` que ha dejado el equipo de desarrollo y la comprobación prevista, que es una decisión del Consorcio. Los valores de fabricante se dicen como tales.',
      carry:
        'El `/salud` nuevo responde 200 solo si la aplicación del nodo atiende, el nodo lee y escribe en REG-DOC y el certificado del sello está disponible y vigente. Es barato y no pide iniciar sesión. Con la configuración del Consorcio, un nodo que deja de atender sale del reparto, como mucho, a los 15 s contando solo intervalos, y vuelve tras 10 s de respuestas buenas. Si cae REG-DOC suspenden los dos nodos: el registro no puede trabajar sin él, y lo que vea quien llegue depende del fabricante del ADC.',
      tasks: [
        {
          id: 'f5t1',
          kind: 'multi',
          topic: 'op4m4',
          prompt: 'Marca **todo** lo que debe comprobar `/salud` antes de responder 200.',
          options: [
            { id: 'a', text: 'Que la aplicación del propio nodo está cargada y atiende peticiones' },
            { id: 'b', text: 'Que el nodo puede leer y escribir en la base de datos y los anexos de REG-DOC' },
            { id: 'c', text: 'Que el certificado del sello con el que el nodo firma los justificantes está disponible y vigente' },
            { id: 'd', text: 'Que el otro nodo del grupo también responde' },
            { id: 'e', text: 'Que quien llama ha iniciado sesión en la aplicación' },
            { id: 'f', text: 'Que la línea del operador está levantada' },
          ],
          answer: ['a', 'b', 'c'],
          points: 6,
          explain:
            'Un punto de salud con sentido responde 200 solo si el nodo puede atender de verdad una petición normal. Aquí eso es tener la aplicación cargada, llegar a REG-DOC, donde se guardan los asientos, y poder firmar el justificante, como dice la ficha. Cada nodo responde por sí mismo: si comprobara al otro, la caída de uno sacaría a los dos. La comprobación no debe exigir iniciar sesión, y conviene que sea barata, porque se llama cada pocos segundos. La línea del operador no es algo que distinga a un nodo de otro, y el personal interno ni siquiera la usa.',
          refs: [L4],
        },
        {
          id: 'f5t2',
          kind: 'numeric',
          topic: 'op4m4',
          prompt: 'Con la comprobación prevista, un nodo empieza a rechazar las conexiones justo después de una comprobación buena. Contando solo intervalos, en el peor caso, ¿cuántos segundos tarda en salir del reparto?',
          answer: 15,
          unit: 's',
          points: 3,
          explain:
            'Hacen falta 3 fallos seguidos con comprobaciones cada 5 s: el primero llega a los 5 s, el segundo a los 10 y el tercero a los 15. Peor caso: fallos × intervalo = 3 × 5 = 15 s. Si el nodo dejara de contestar en vez de rechazar, cada comprobación agotaría antes su tiempo de espera y la cuenta podría alargarse. Con los valores por defecto de HAProxy 3.4 (inter 2 s, fall 3; valor del fabricante) serían 6 s, y con los del ALB de AWS (30 s y 2 fallos), 60 s. Tienta multiplicar por los 2 aciertos, que son el umbral para volver.',
          refs: [L4, HAPROXY_CONF, AWS_HC],
        },
        {
          id: 'f5t3',
          kind: 'numeric',
          topic: 'op4m4',
          prompt: 'Y cuando el nodo se recupera, contando solo intervalos, ¿cuántos segundos tarda como máximo en volver al reparto?',
          answer: 10,
          unit: 's',
          points: 2,
          explain:
            'Para volver hacen falta 2 aciertos seguidos: 2 × 5 = 10 s. Con los valores por defecto de HAProxy 3.4 (rise 2, inter 2 s; valor del fabricante) serían 4 s, y con los del ALB de AWS (5 aciertos cada 30 s), 150 s. Tienta usar los 3 fallos, que son el umbral para salir.',
          refs: [L4, HAPROXY_CONF, AWS_HC],
        },
        {
          id: 'f5t4',
          kind: 'choice',
          topic: 'op4m4',
          prompt: 'Con el `/salud` nuevo, una noche se cae REG-DOC. ¿Qué pasa con el grupo `registro`?',
          options: [
            { id: 'a', text: 'Los dos nodos suspenden a la vez y el grupo se queda vacío. Lo que ve quien llega depende del fabricante del ADC: HAProxy responde 503 y el ALB de AWS reparte entre todos («fail open»). Sin REG-DOC no se puede registrar de todos modos' },
            { id: 'b', text: 'Solo suspende el nodo que estaba usando REG-DOC en ese momento' },
            { id: 'c', text: 'El ADC pasa a mandar las peticiones a REG-APP, `10.20.72.30`' },
            { id: 'd', text: 'Cualquier balanceador responde 503, porque así lo manda la RFC 9110 cuando no quedan servidores' },
          ],
          answer: 'a',
          points: 4,
          explain:
            'REG-DOC es común a los dos nodos. Si `/salud` lo comprueba, su caída hace suspender a los dos a la vez y el grupo se vacía. Aquí es lo correcto, porque sin REG-DOC no se puede registrar nada, aunque conviene saberlo. Los fabricantes no coinciden en qué hacen entonces: HAProxy, sin servidores de reserva, responde 503, y el ALB de AWS «falla abierto» y reparte entre todos (valores del fabricante). La RFC 9110 define el 503, pero no obliga a nadie a usarlo. REG-APP no está en el grupo y se retira.',
          refs: [L4, RFC9110, HAPROXY_CONF, AWS_HC],
        },
        {
          id: 'f5t5',
          kind: 'cite',
          topic: 'op4m4',
          prompt: 'Señala los documentos que, juntos, prueban que el `/salud` actual puede responder 200 desde un nodo que no puede registrar nada.',
          answerSets: [['d-salud', 'd-ficha'], ['d-salud', 'd-ficha', 'd-inventario']],
          points: 3,
          explain:
            'El `/salud` actual responde 200 con un texto fijo, sin consultar nada. La ficha dice qué necesita un nodo para registrar: REG-DOC, que asigna los números y guarda los anexos, y el certificado del sello para firmar el justificante. Con los dos queda probado que la comprobación no mira nada de lo que puede fallar. El inventario puede acompañarlos, porque sitúa REG-DOC, pero solo no prueba nada. El esquema tienta porque dibuja la flecha hacia REG-DOC, pero no dice qué comprueba `/salud`.',
          refs: [L4],
        },
      ],
    },
    // -----------------------------------------------------------------------
    {
      id: 'f6',
      title: 'El primer parcheo',
      context:
        'Primer martes de parcheo del grupo `registro`. En el expediente tienes el procedimiento del Consorcio y lo que registró el ADC. Los estados `ready`, `drain` y `maint` son los de HAProxy 3.4 (valor del fabricante); el procedimiento dice cómo se comporta el ADC del Consorcio en cada uno.',
      tasks: [
        {
          id: 'f6t1',
          kind: 'choice',
          topic: 'op4m4',
          prompt: 'A las 07:05, una ciudadana con la cookie que apunta a REG1 envía el siguiente paso de su solicitud. ¿Qué pasa?',
          options: [
            { id: 'a', text: 'La petición va a REG1, que en `drain` sigue atendiendo a quien la persistencia ata a él: sigue con su trámite mientras no se cumpla el límite del drenaje' },
            { id: 'b', text: 'La petición va a REG2, que continúa el trámite con la misma sesión' },
            { id: 'c', text: 'Recibe un 503 hasta que REG1 vuelve a `ready`' },
            { id: 'd', text: 'El ADC le cambia la cookie para que apunte a REG2 y conserva su sesión' },
          ],
          answer: 'a',
          points: 4,
          explain:
            'Para eso sirve el drenaje: el nodo deja de recibir sesiones nuevas, pero quien ya trabajaba con él sigue llegando a él. Es lo que hace HAProxy en `drain` (valor del fabricante), y el procedimiento dice que el ADC del Consorcio se comporta igual. Si no termina antes de las 07:30, la cortará el paso a `maint`. REG2 no tiene su sesión, que está en la memoria de REG1, y cambiarle la cookie no la traslada: tendría que identificarse otra vez. Un 503 no tiene sentido mientras REG2 atiende.',
          refs: [L4, HAPROXY_MGMT],
        },
        {
          id: 'f6t2',
          kind: 'multi',
          topic: 'op4m4',
          prompt: 'Con el registro del ADC delante, marca **todas** las afirmaciones ciertas.',
          options: [
            { id: 'a', text: 'A las 07:30, las 2 personas que seguían en REG1 tuvieron que volver a identificarse en REG2' },
            { id: 'b', text: 'Lo que esas personas ya habían presentado, con su justificante, no se perdió: está en REG-DOC' },
            { id: 'c', text: 'A las 08:00, pasar REG2 directamente a `maint` cortó de golpe a las 23 personas que tenía; con un drenaje, la mayoría habría podido terminar' },
            { id: 'd', text: 'Al entrar REG1 en `drain` a las 07:00 se cortaron sus 14 sesiones' },
            { id: 'e', text: 'Mientras REG1 estuvo en `maint`, el ADC lo siguió comprobando cada 5 s' },
            { id: 'f', text: 'Si REG1 se hubiera quedado en `drain` sin límite, se habría vaciado seguro en 20 minutos' },
          ],
          answer: ['a', 'b', 'c'],
          points: 5,
          explain:
            'El límite de 30 minutos llegó con 2 sesiones en REG1. Al pasar a `maint` se cortaron, y esas personas acabaron en REG2 sin su sesión. Los asientos ya presentados están en REG-DOC. Con REG2 el técnico se saltó el drenaje: sus 23 sesiones se cortaron de golpe. Entrar en `drain` no corta a nadie, solo deja de recibir sesiones nuevas. En `maint` el ADC no comprueba el nodo (comportamiento de HAProxy 3.4, valor del fabricante, que el procedimiento atribuye también al ADC). Y los 20 minutos de la ficha son sin actividad: quien sigue trabajando mantiene su sesión, así que el drenaje puede no acabar nunca, y por eso el procedimiento le pone límite.',
          refs: [L4, HAPROXY_MGMT],
        },
        {
          id: 'f6t3',
          kind: 'numeric',
          topic: 'op4m4',
          prompt: 'Según el registro del ADC, ¿cuántas personas, en total, tuvieron que volver a identificarse por el parcheo de esa mañana?',
          answer: 25,
          unit: 'personas',
          points: 3,
          explain:
            'Dos al pasar REG1 a `maint` a las 07:30, tras agotar los 30 minutos de drenaje, y 23 al pasar REG2 directamente a `maint` a las 08:00: 2 + 23 = 25. Con un drenaje también en REG2, la cuenta habría quedado en las pocas personas que siguieran allí al cumplirse el límite. Tienta sumar las 14 sesiones que tenía REG1 a las 07:00, pero el drenaje las dejó terminar casi todas.',
          refs: [L4],
        },
        {
          id: 'f6t4',
          kind: 'written',
          topic: 'op4m1',
          prompt: 'La Secretaría General, responsable del servicio, pide una nota de **120 a 180 palabras**: qué cambia para la ciudadanía y para el personal, qué pasa si cae un servidor y cómo se parchea a partir de ahora. Escríbela y compárala con el modelo.',
          words: 180,
          model:
            'El registro ya no depende de un solo servidor de aplicación. Ahora son dos, trabajan a la vez y cualquiera de ellos puede con el día de más trabajo. La ciudadanía sigue entrando por la sede electrónica. El personal tendrá una dirección interna nueva, que se le comunicará antes del cambio.\n\n' +
            'Si un servidor se avería, el sistema lo detecta en segundos y deja de enviarle gente. Quien estaba trabajando en él tendrá que volver a identificarse, pero no pierde nada de lo ya presentado, que queda guardado con su justificante.\n\n' +
            'Los parches se aplican un servidor cada vez, los martes a primera hora. Antes de pararlo se deja que termine quien lo está usando, durante media hora como máximo. Si alguien sigue después, tendrá que identificarse de nuevo. Mientras dura cada parcheo solo trabaja un servidor.\n\n' +
            'Quedan límites: la base de datos sigue en un solo servidor, hay una sola línea y un solo centro de datos, y nada de esto sustituye a las copias de seguridad.',
          rubric: [
            { id: 'r1', text: 'Explica que hay dos servidores trabajando a la vez y que cualquiera puede con todo el trabajo, y por dónde entra cada público (la ciudadanía, por la sede; el personal, por una dirección interna nueva)', points: 2 },
            { id: 'r2', text: 'Cuenta qué pasa si cae uno (detección en segundos, volver a identificarse) y que lo ya presentado no se pierde', points: 1 },
            { id: 'r3', text: 'Describe el parcheo: un servidor cada vez, se deja terminar a quien lo usa con un límite, y durante ese rato no hay redundancia', points: 1 },
            { id: 'r4', text: 'Señala los límites que quedan (base de datos en un solo servidor, una línea, un centro de datos) y que esto no sustituye a las copias', points: 1 },
            { id: 'r5', text: 'Está escrita para la Secretaría General: entre 120 y 180 palabras, sin configuración ni siglas sin explicar', points: 1 },
          ],
          points: 6,
          explain:
            'Una buena nota cuenta lo que nota la gente: que hay dos servidores, qué pasa si cae uno, cómo se parchea y qué queda sin resolver. Sobran las direcciones, los estados del balanceador y los porcentajes. Tienta presentar la alta disponibilidad como la respuesta al ataque del lunes, y no lo es: un cifrado que alcance los dos servidores o la base de datos solo se arregla con las copias.',
          refs: [L1, L4],
        },
      ],
    },
  ],
  sources: [L1, L2, L3, L4, L5, L6, RFC9110, RFC6265, RFC7239, RFC9846, AWS_AVAIL, MS_CLUSTER, HAPROXY_CONF, HAPROXY_MGMT, AWS_HC],
};

export default op4s1;

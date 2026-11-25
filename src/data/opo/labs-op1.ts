import type { ClassifyData, LabMeta, OrderData } from '../labs';

// ---------------------------------------------------------------------------
// Redes y ENS · Bloque 1 (Redes de comunicaciones) — Consorcio Provincial de Arcedo
// ---------------------------------------------------------------------------

export const OP1_LABS: LabMeta[] = [
  {
    id: 'opl1a',
    sectionId: 'op1',
    title: 'Cada equipo en su subred',
    icon: '🧮',
    minutes: 12,
    xp: 100,
    kind: 'classify',
    brief:
      'El bloque 10.20.8.0/24 del Consorcio está repartido con VLSM en cuatro subredes contiguas: un /25, un /26, un /27 y un /30. Asigna 12 direcciones de equipo a la subred que les corresponde. Necesitas ≥80 %.',
    mission: {
      n: 1,
      briefing:
        'Una de las oficinas comarcales se muda de edificio y el Consorcio Provincial de Arcedo aprovecha para ordenar su direccionamiento. El inventario viejo es una hoja de cálculo con doce direcciones sueltas y ninguna máscara apuntada. Antes de configurar un solo puerto, calcula a qué subred pertenece cada equipo: una dirección mal colocada y ese equipo se queda sin puerta de enlace.',
    },
  },
  {
    id: 'opl1b',
    sectionId: 'op1',
    title: 'De la VLAN 10 a la VLAN 20',
    icon: '🔀',
    minutes: 8,
    xp: 75,
    kind: 'order',
    brief:
      'Ordena los 8 pasos que sigue un paquete entre dos equipos de VLAN distintas a través de un conmutador (switch) de capa 3, fijándote en qué direcciones MAC e IP lleva la trama en cada tramo.',
  },
];

// ---------------------------------------------------------------------------
// Classify labs
// ---------------------------------------------------------------------------

export const OP1_CLASSIFY_DATA: Record<string, ClassifyData> = {
  opl1a: {
    passPct: 80,
    categories: [
      { id: 'n25', label: '10.20.8.0/25' },
      { id: 'n26', label: '10.20.8.128/26' },
      { id: 'n27', label: '10.20.8.192/27' },
      { id: 'n30', label: '10.20.8.224/30' },
    ],
    items: [
      {
        text: 'Puesto de registro de entrada · 10.20.8.77',
        answer: 'n25',
        why: 'Un /25 deja 7 bits de equipo: bloques de 128 direcciones. 10.20.8.0/25 va de la .0 (red) a la .127 (difusión), con equipos de 10.20.8.1 a 10.20.8.126. La .77 cae dentro.',
      },
      {
        text: 'Teléfono IP de la centralita · 10.20.8.129',
        answer: 'n26',
        why: 'Un /26 son bloques de 64: 10.20.8.128/26 va de la .128 (red) a la .191 (difusión), con equipos de 10.20.8.129 a 10.20.8.190. La .129 es la primera dirección utilizable.',
      },
      {
        text: 'Punto de acceso de la sala de plenos · 10.20.8.200',
        answer: 'n27',
        why: 'Un /27 son bloques de 32: 10.20.8.192/27 va de la .192 (red) a la .223 (difusión), con equipos de 10.20.8.193 a 10.20.8.222. La .200 cae dentro.',
      },
      {
        text: 'Interfaz del encaminador (router) de salida · 10.20.8.225',
        answer: 'n30',
        why: 'Un /30 son bloques de 4: 10.20.8.224/30 va de la .224 (red) a la .227 (difusión) y solo tiene dos direcciones de equipo, 10.20.8.225 y 10.20.8.226. La .225 es la primera.',
      },
      {
        text: 'Puesto de la oficina técnica · 10.20.8.126',
        answer: 'n25',
        why: '10.20.8.0/25 abarca de la .0 a la .127; los equipos van de 10.20.8.1 a 10.20.8.126. La .126 es la última utilizable: la .127 ya es la difusión y la .128 es la red siguiente.',
      },
      {
        text: 'Cámara IP del aparcamiento · 10.20.8.193',
        answer: 'n27',
        why: '10.20.8.192/27 abarca de la .192 a la .223; los equipos van de 10.20.8.193 a 10.20.8.222. La .193 es la primera utilizable, justo después de la dirección de red.',
      },
      {
        text: 'Teléfono IP de la sala de juntas · 10.20.8.190',
        answer: 'n26',
        why: '10.20.8.128/26 abarca de la .128 a la .191; los equipos van de 10.20.8.129 a 10.20.8.190. La .190 es la última utilizable: la .191 es la difusión y el /27 no empieza hasta la .192.',
      },
      {
        text: 'Portátil de la secretaría · 10.20.8.1',
        answer: 'n25',
        why: '10.20.8.0/25 abarca de la .0 a la .127; los equipos van de 10.20.8.1 a 10.20.8.126. La .1 es la primera dirección utilizable del bloque.',
      },
      {
        text: 'Interfaz del encaminador del operador en el enlace de la oficina · 10.20.8.226',
        answer: 'n30',
        why: '10.20.8.224/30 abarca de la .224 a la .227; sus dos únicos equipos son 10.20.8.225 y 10.20.8.226. La .226 es la última utilizable: la .227 es la difusión.',
      },
      {
        text: 'Impresora de la primera planta · 10.20.8.222',
        answer: 'n27',
        why: '10.20.8.192/27 abarca de la .192 a la .223; los equipos van de 10.20.8.193 a 10.20.8.222. La .222 es la última utilizable; el /30 empieza en la .224 y no la alcanza.',
      },
      {
        text: 'Teléfono IP del mostrador de atención · 10.20.8.150',
        answer: 'n26',
        why: '10.20.8.128/26 abarca de la .128 a la .191; los equipos van de 10.20.8.129 a 10.20.8.190. La .150 cae dentro: supera la .127 del /25 y no llega a la .192 del /27.',
      },
      {
        text: 'Pantalla informativa del vestíbulo · 10.20.8.210',
        answer: 'n27',
        why: '10.20.8.192/27 abarca de la .192 a la .223; los equipos van de 10.20.8.193 a 10.20.8.222. La .210 cae dentro: está por encima de la .191 del /26 y por debajo de la .224 del /30.',
      },
    ],
  },
};

// ---------------------------------------------------------------------------
// Order labs
// ---------------------------------------------------------------------------

export const OP1_ORDER_DATA: Record<string, OrderData> = {
  opl1b: {
    prompt:
      'El equipo A (VLAN 10, 10.20.10.25/24) envía un paquete al equipo B (VLAN 20, 10.20.20.40/24). Los dos cuelgan de puertos de acceso del mismo conmutador de acceso, unido por un enlace troncal (trunk) 802.1Q a un conmutador de capa 3 con las SVI 10.20.10.1 y 10.20.20.1. Las tablas ARP están vacías. Toca los pasos en el orden en que ocurren.',
    steps: [
      {
        text: 'A comprueba que B no está en su red',
        detail:
          'A aplica su máscara /24 al destino: 10.20.20.40 no pertenece a 10.20.10.0/24, así que no puede entregarlo directamente y tiene que pasar por su puerta de enlace, 10.20.10.1. Todavía no hay ninguna trama en el cable.',
      },
      {
        text: 'A resuelve por ARP la MAC de su puerta de enlace',
        detail:
          'A envía una petición ARP preguntando por 10.20.10.1 (no por la IP de B): MAC de origen la de A, MAC de destino la de difusión ff:ff:ff:ff:ff:ff. Se inunda solo por la VLAN 10 y la SVI de esa VLAN responde con su MAC en una trama dirigida a A.',
      },
      {
        text: 'A envía la trama a la MAC de la puerta de enlace',
        detail:
          'Trama sin etiqueta por el puerto de acceso: MAC de origen A, MAC de destino la SVI de la VLAN 10. Dentro, el paquete IP lleva origen 10.20.10.25 y destino 10.20.20.40: la IP de destino es la de B, pero la MAC de destino es la de la puerta de enlace.',
      },
      {
        text: 'El conmutador de acceso la etiqueta con la VLAN 10 y la saca por el troncal',
        detail:
          'El conmutador de acceso asocia la trama a la VLAN 10 por el puerto de entrada, consulta su tabla MAC y la reenvía por el enlace troncal añadiendo la etiqueta 802.1Q con VID 10. Las MAC (A → SVI de la VLAN 10) y las IP (10.20.10.25 → 10.20.20.40) no cambian.',
      },
      {
        text: 'El conmutador de capa 3 recibe la trama y consulta su tabla de rutas',
        detail:
          'La MAC de destino es la suya, así que retira la cabecera Ethernet y la etiqueta y examina el paquete IP: el destino 10.20.20.40 coincide con 10.20.20.0/24, red conectada directamente a la SVI de la VLAN 20. En este punto solo quedan las direcciones IP, intactas.',
      },
      {
        text: 'El conmutador de capa 3 resuelve por ARP la MAC de B',
        detail:
          'Para entregar en la VLAN 20 necesita la MAC de 10.20.20.40. Envía una petición ARP con MAC de origen la de la SVI de la VLAN 20 y destino difusión, que se propaga solo por la VLAN 20; B responde con su MAC.',
      },
      {
        text: 'El conmutador de capa 3 construye una trama nueva y la envía por el troncal con la VLAN 20',
        detail:
          'Resta 1 al TTL y encapsula el mismo paquete en otra trama: MAC de origen la SVI de la VLAN 20, MAC de destino B, etiqueta 802.1Q con VID 20. Las IP siguen siendo 10.20.10.25 → 10.20.20.40: cambian las MAC en cada salto, no las IP.',
      },
      {
        text: 'El conmutador de acceso quita la etiqueta y entrega la trama a B',
        detail:
          'El conmutador de acceso busca la MAC de B en la tabla de la VLAN 20, retira la etiqueta y saca la trama por el puerto de acceso de B. B recibe MAC de origen la SVI de la VLAN 20 (no la de A) e IP de origen 10.20.10.25.',
      },
    ],
  },
};

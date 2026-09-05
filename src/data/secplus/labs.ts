import type { ClassifyData, LabMeta, OrderData, SelectData } from '../labs';
import { SP2_CLASSIFY_DATA, SP2_LABS, SP2_SELECT_DATA } from './labs-sp2';
import { SP3_CLASSIFY_DATA, SP3_LABS, SP3_ORDER_DATA } from './labs-sp3';
import {
  SP4_CLASSIFY_DATA,
  SP4_LABS,
  SP4_ORDER_DATA,
  SP4_SELECT_DATA,
} from './labs-sp4';
import { SP5_CLASSIFY_DATA, SP5_LABS, SP5_SELECT_DATA } from './labs-sp5';

// ---------------------------------------------------------------------------
// Security+ (SY0-701) lab registry + data — Halden Port Authority scenario
// ---------------------------------------------------------------------------

const SP1_LABS: LabMeta[] = [
  {
    id: 'spl1a',
    sectionId: 'sp1',
    title: 'Control Matrix',
    icon: '🧱',
    minutes: 10,
    xp: 100,
    kind: 'classify',
    brief:
      'Clasifica 12 controles de la Autoridad Portuaria en su categoría: Technical, Managerial, Operational o Physical. Necesitas ≥80%.',
    mission: {
      n: 1,
      briefing:
        'La Autoridad Portuaria de Halden te ficha como su primera analista de seguridad. No hay inventario de controles: hay cosas «que se hacen» y nadie sabe por qué. Tu primera tarea es poner orden: clasifica lo que existe para ver qué falta.',
    },
  },
  {
    id: 'spl1b',
    sectionId: 'sp1',
    title: 'Change Flow',
    icon: '🔁',
    minutes: 8,
    xp: 75,
    kind: 'order',
    brief:
      'Ordena los 8 pasos de una solicitud de cambio, desde la petición hasta la documentación final.',
  },
  {
    id: 'spl1c',
    sectionId: 'sp1',
    title: 'Crypto Toolbox',
    icon: '🔐',
    minutes: 10,
    xp: 100,
    kind: 'classify',
    brief:
      'Para cada necesidad, elige la primitiva criptográfica correcta: Symmetric, Asymmetric, Hashing o Digital signature. Necesitas ≥80%.',
  },
];

// ---------------------------------------------------------------------------
// Classify labs
// ---------------------------------------------------------------------------

const SP1_CLASSIFY: Record<string, ClassifyData> = {
  spl1a: {
    passPct: 80,
    categories: [
      { id: 'technical', label: 'Technical' },
      { id: 'managerial', label: 'Managerial' },
      { id: 'operational', label: 'Operational' },
      { id: 'physical', label: 'Physical' },
    ],
    items: [
      {
        text: 'The perimeter firewall has an ACL that blocks inbound RDP to the crane-control VLAN',
        answer: 'technical',
        why: 'Una ACL la aplica un sistema (el firewall) sin intervención humana en cada decisión: control Technical.',
      },
      {
        text: 'Management commissions an annual risk assessment of port operations',
        answer: 'managerial',
        why: 'Evaluar riesgos es planificación y gobierno: define prioridades, no ejecuta nada. Control Managerial.',
      },
      {
        text: 'Night guards record each patrol round of the container yard in a log',
        answer: 'operational',
        why: 'Lo ejecutan personas en su día a día siguiendo un procedimiento: control Operational.',
      },
      {
        text: 'Steel bollards stop vehicles from ramming the main gate',
        answer: 'physical',
        why: 'Una barrera tangible que impide el acceso físico: control Physical.',
      },
      {
        text: 'All analyst laptops have full-disk encryption enforced by policy in the MDM',
        answer: 'technical',
        why: 'Aunque la manda una política, quien protege el dato es el cifrado que aplica el sistema: Technical.',
      },
      {
        text: 'The board publishes an acceptable-use policy that every employee must sign',
        answer: 'managerial',
        why: 'Una política es un documento de gobierno que fija reglas; no las aplica por sí misma. Control Managerial.',
      },
      {
        text: 'The ops team runs and checks the nightly backup job every morning',
        answer: 'operational',
        why: 'La ejecución y verificación diaria la hace un equipo humano: Operational. (El software de backup sería Technical.)',
      },
      {
        text: 'Server-room doors only open with an authorized RFID badge',
        answer: 'physical',
        why: 'El lector controla el acceso a un espacio físico: Physical. En SY0-701 las puertas con badge cuentan como control físico.',
      },
      {
        text: 'The CISO designs a yearly security awareness program with topics and goals',
        answer: 'managerial',
        why: 'Diseñar el programa (alcance, objetivos, calendario) es gestión. Impartir la sesión sería Operational.',
      },
      {
        text: 'IDS sensors inspect traffic on the terminal network and raise alerts',
        answer: 'technical',
        why: 'Un sensor que analiza tráfico y alerta es tecnología en ejecución: control Technical.',
      },
      {
        text: 'Reception staff escort every visitor while inside the operations building',
        answer: 'operational',
        why: 'Un procedimiento realizado por personas cada vez que llega una visita: Operational.',
      },
      {
        text: 'A chain-link fence with barbed wire surrounds the fuel depot',
        answer: 'physical',
        why: 'La valla es una barrera física tangible: control Physical.',
      },
    ],
  },
  spl1c: {
    passPct: 80,
    categories: [
      { id: 'symmetric', label: 'Symmetric' },
      { id: 'asymmetric', label: 'Asymmetric' },
      { id: 'hashing', label: 'Hashing' },
      { id: 'signature', label: 'Digital signature' },
    ],
    items: [
      {
        text: 'Encrypt a 2 TB backup archive at rest as fast as possible',
        answer: 'symmetric',
        why: 'Grandes volúmenes de datos en reposo se cifran con clave simétrica (AES): rápida y eficiente para bulk data.',
      },
      {
        text: 'Verify that a downloaded installer was not altered in transit',
        answer: 'hashing',
        why: 'Comparar el digest (SHA-256) publicado con el del fichero recibido comprueba integridad: Hashing.',
      },
      {
        text: 'Prove an email really came from the CFO and was not modified',
        answer: 'signature',
        why: 'Autenticidad + integridad + no repudio a la vez = firma digital (hash cifrado con la clave privada del CFO).',
      },
      {
        text: 'Agree on a session key with a server you have never contacted before',
        answer: 'asymmetric',
        why: 'Sin secreto previo compartido, el intercambio de claves se resuelve con criptografía asimétrica (Diffie-Hellman / RSA).',
      },
      {
        text: 'Store user passwords in the authentication database',
        answer: 'hashing',
        why: 'Las contraseñas se guardan como hash (con salt) — nunca cifradas — porque no hace falta recuperarlas, solo compararlas.',
      },
      {
        text: 'Full-disk encryption on every field laptop',
        answer: 'symmetric',
        why: 'El cifrado de disco completo usa una clave simétrica: el volumen es grande y hay que leerlo y escribirlo a alta velocidad.',
      },
      {
        text: 'Sign firmware images so devices only boot trusted code',
        answer: 'signature',
        why: 'El dispositivo verifica con la clave pública del fabricante que el firmware es auténtico e íntegro: firma digital.',
      },
      {
        text: 'Key exchange during a TLS handshake',
        answer: 'asymmetric',
        why: 'El handshake usa asimétrica (ECDHE/RSA) para acordar la clave; el tráfico posterior ya va con simétrica.',
      },
      {
        text: 'Detect tampering in a log file by chaining each entry to the digest of the previous one',
        answer: 'hashing',
        why: 'Encadenar digests hace que alterar una entrada rompa todos los hashes siguientes: integridad por Hashing.',
      },
      {
        text: 'Ensure a supplier cannot later deny having accepted a contract',
        answer: 'signature',
        why: 'El no repudio solo lo da la firma digital: únicamente el titular de la clave privada pudo firmar.',
      },
      {
        text: "Encrypt a message using the recipient's public key",
        answer: 'asymmetric',
        why: 'Cifrar con la clave pública para que solo la privada descifre es el uso clásico de criptografía asimétrica.',
      },
      {
        text: 'Encrypt all bulk traffic inside a site-to-site VPN tunnel',
        answer: 'symmetric',
        why: 'El tráfico del túnel (IPsec ESP) se cifra con claves simétricas por rendimiento; la asimétrica solo se usó al negociarlas.',
      },
    ],
  },
};

// ---------------------------------------------------------------------------
// Order labs
// ---------------------------------------------------------------------------

const SP1_ORDER: Record<string, OrderData> = {
  spl1b: {
    prompt:
      'Toca los pasos de una solicitud de cambio en el orden correcto, desde la petición inicial hasta la documentación final.',
    steps: [
      {
        text: 'Request submitted',
        detail:
          'Alguien formaliza qué quiere cambiar y por qué; sin ticket no hay trazabilidad, así que es siempre el primer paso.',
      },
      {
        text: 'Impact analysis',
        detail:
          'Se evalúa qué sistemas, usuarios y dependencias afecta el cambio; hay que saberlo antes de que nadie lo apruebe.',
      },
      {
        text: 'Test in staging + backout plan ready',
        detail:
          'Se prueba en un entorno equivalente y se deja lista la vuelta atrás; nada llega al CAB sin test results y backout plan.',
      },
      {
        text: 'CAB approval',
        detail:
          'El Change Advisory Board decide con el análisis, los test results y el backout plan en la mano; aprobar sin ellos sería firmar a ciegas.',
      },
      {
        text: 'Maintenance window scheduled',
        detail:
          'Con el cambio aprobado se fija la ventana de menor impacto y se avisa a los afectados.',
      },
      {
        text: 'Implement',
        detail:
          'Se ejecuta el cambio en producción dentro de la ventana, siguiendo el plan probado.',
      },
      {
        text: 'Verify (service/app restart, monitoring)',
        detail:
          'Se reinician servicios si hace falta y se vigila que todo funcione; si no, se activa el backout plan.',
      },
      {
        text: 'Document (diagrams, policies, version control)',
        detail:
          'Se actualizan diagramas, políticas y control de versiones para que el entorno documentado coincida con el real; cierra el ciclo.',
      },
    ],
  },
};

export const SP_LABS: LabMeta[] = [
  ...SP1_LABS,
  ...SP2_LABS,
  ...SP3_LABS,
  ...SP4_LABS,
  ...SP5_LABS,
];
export const SP_CLASSIFY_DATA: Record<string, ClassifyData> = {
  ...SP1_CLASSIFY,
  ...SP2_CLASSIFY_DATA,
  ...SP3_CLASSIFY_DATA,
  ...SP4_CLASSIFY_DATA,
  ...SP5_CLASSIFY_DATA,
};
export const SP_ORDER_DATA: Record<string, OrderData> = {
  ...SP1_ORDER,
  ...SP3_ORDER_DATA,
  ...SP4_ORDER_DATA,
};
export const SP_SELECT_DATA: Record<string, SelectData> = {
  ...SP2_SELECT_DATA,
  ...SP4_SELECT_DATA,
  ...SP5_SELECT_DATA,
};

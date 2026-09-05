import type { ClassifyData, LabMeta, OrderData } from '../labs';

// ---------------------------------------------------------------------------
// Security+ (SY0-701) Domain 3 labs — Halden Port Authority scenario
// ---------------------------------------------------------------------------

export const SP3_LABS: LabMeta[] = [
  {
    id: 'spl3a',
    sectionId: 'sp3',
    title: 'Zone Defense',
    icon: '🗺️',
    minutes: 10,
    xp: 100,
    kind: 'classify',
    brief:
      'Coloca 12 sistemas de la Autoridad Portuaria en su zona de red correcta: DMZ, red interna, red OT/ICS o red de gestión. Necesitas ≥80%.',
    mission: {
      n: 3,
      briefing:
        'El plano de red del puerto cabe en una servilleta: todo cuelga del mismo switch, desde la web pública hasta los PLC de las esclusas. Antes de que alguien vuelva a pasearse de una impresora a una grúa, rediseña la segmentación: cada sistema, en su zona.',
    },
  },
  {
    id: 'spl3b',
    sectionId: 'sp3',
    title: 'Data Guard',
    icon: '🗄️',
    minutes: 10,
    xp: 100,
    kind: 'classify',
    brief:
      'Para cada situación, elige el método de protección de datos correcto: Encryption, Masking, Tokenization o Permission restrictions. Necesitas ≥80%.',
  },
  {
    id: 'spl3c',
    sectionId: 'sp3',
    title: 'Continuity Ladder',
    icon: '🪜',
    minutes: 8,
    xp: 75,
    kind: 'order',
    brief:
      'Ordena los 8 pasos de una activación de plan de recuperación, desde la detección de la caída hasta la revisión posterior.',
  },
];

// ---------------------------------------------------------------------------
// Classify labs
// ---------------------------------------------------------------------------

export const SP3_CLASSIFY_DATA: Record<string, ClassifyData> = {
  spl3a: {
    passPct: 80,
    categories: [
      { id: 'dmz', label: 'DMZ / perimeter' },
      { id: 'internal', label: 'Internal network' },
      { id: 'ot', label: 'OT / ICS segment' },
      { id: 'mgmt', label: 'Management network' },
    ],
    items: [
      {
        text: 'The public port website that publishes berth schedules to anyone on the Internet',
        answer: 'dmz',
        why: 'Un servicio que cualquiera desde Internet debe alcanzar va en la DMZ: se expone el servicio, nunca la red interna.',
      },
      {
        text: 'The SFTP server where shipping lines upload cargo manifests from outside the network',
        answer: 'dmz',
        why: 'Recibe conexiones entrantes de terceros externos, así que vive en la DMZ; desde ahí los ficheros pasan a la red interna, nunca al revés.',
      },
      {
        text: 'The reverse proxy that terminates TLS and forwards requests to the manifest application',
        answer: 'dmz',
        why: 'El reverse proxy es la única cara visible: se coloca en la DMZ para que el servidor de aplicación real quede oculto en la red interna.',
      },
      {
        text: 'The staff file server holding contracts and internal procedures',
        answer: 'internal',
        why: 'Solo lo usan empleados desde dentro y no publica nada a Internet: sistema de negocio, red interna.',
      },
      {
        text: 'The HR application used by port employees from their desks',
        answer: 'internal',
        why: 'Aplicación de negocio con datos de personal y sin acceso externo: su sitio es la red interna, no la DMZ.',
      },
      {
        text: 'The office print server on the administrative floor',
        answer: 'internal',
        why: 'Servicio ofimático de uso exclusivamente interno; nada de Internet debe llegar a él, pero tampoco pinta en la zona OT.',
      },
      {
        text: 'The PLC that drives the container crane on quay 3',
        answer: 'ot',
        why: 'Los PLC controlan procesos físicos y no se parchean como un PC: van en un segmento OT aislado, inalcanzable desde la LAN de oficina.',
      },
      {
        text: 'The SCADA HMI workstation that operates the lock gates',
        answer: 'ot',
        why: 'La HMI habla directamente con el proceso industrial; se queda dentro del segmento OT, junto a lo que controla y separada del tráfico corporativo.',
      },
      {
        text: 'The dockside sensor gateway that collects tide and mooring telemetry',
        answer: 'ot',
        why: 'Es un dispositivo embebido del proceso industrial: pertenece a la red OT, y sus datos se publican hacia dentro a través de un punto de paso controlado.',
      },
      {
        text: 'The jump server administrators must connect through before touching any device',
        answer: 'mgmt',
        why: 'El jump server es la puerta única de administración: vive en la red de gestión, que es el único origen permitido hacia los interfaces de gestión.',
      },
      {
        text: 'The management interfaces of the core switches and routers',
        answer: 'mgmt',
        why: 'Los planos de gestión nunca se exponen a la red de usuarios: se aíslan en la red de gestión y solo se alcanzan vía jump server.',
      },
      {
        text: 'The backup appliance console where restore jobs are launched',
        answer: 'mgmt',
        why: 'Una consola que puede restaurar (o borrar) todo es un interfaz de administración: red de gestión, fuera del alcance de un puesto de oficina comprometido.',
      },
    ],
  },
  spl3b: {
    passPct: 80,
    categories: [
      { id: 'encryption', label: 'Encryption' },
      { id: 'masking', label: 'Masking' },
      { id: 'tokenization', label: 'Tokenization' },
      { id: 'permissions', label: 'Permission restrictions' },
    ],
    items: [
      {
        text: 'Field laptops that leave the building carry survey data on their disks',
        answer: 'encryption',
        why: 'El soporte puede perderse o robarse: el cifrado hace que el dato sea ilegible sin la clave aunque el disco acabe en otras manos.',
      },
      {
        text: 'Backup tapes are shipped to an offsite vault every week',
        answer: 'encryption',
        why: 'Datos en reposo viajando fuera del control del puerto; si la caja se extravía, solo el cifrado evita la brecha.',
      },
      {
        text: 'Manifest files are sent to a shipping line across the public Internet',
        answer: 'encryption',
        why: 'Datos en tránsito que alguien podría interceptar: se protegen cifrando el canal (TLS/IPSec), no ocultando dígitos.',
      },
      {
        text: 'Support agents confirming a payment must see only the last four digits of the card',
        answer: 'masking',
        why: 'El agente necesita ver *algo* para verificar: el masking oculta parte del valor en pantalla y deja el resto legible.',
      },
      {
        text: "The billing screen displays a customer's national ID as ***-**-4821",
        answer: 'masking',
        why: 'Se muestra el registro completo pero con caracteres sustituidos en la vista: eso es masking, y el valor real sigue en la base de datos.',
      },
      {
        text: 'The helpdesk ticket view shows the reporter phone number as +47 ** ** 12 34',
        answer: 'masking',
        why: 'Ocultar dígitos solo para la presentación, sin cambiar el dato almacenado ni quién puede consultarlo: masking.',
      },
      {
        text: 'The recurring-billing system must charge saved cards monthly without the application ever storing the real PAN',
        answer: 'tokenization',
        why: 'La tokenización sustituye el número por un token que solo el vault sabe traducir: el PAN real nunca llega a almacenarse en el sistema.',
      },
      {
        text: 'Analysts need to join records across systems by seafarer ID while the real passport numbers stay in a separate vault',
        answer: 'tokenization',
        why: 'El token conserva el formato y permite cruzar registros, pero no se puede revertir sin el vault: sustitución, no cifrado ni ocultación visual.',
      },
      {
        text: 'A mobile wallet replaces the card number with a surrogate value that is useless if the phone is stolen',
        answer: 'tokenization',
        why: 'El sustituto no tiene valor fuera del mapeo del vault: aunque lo capturen, no hay dato real que descifrar.',
      },
      {
        text: 'Only the payroll team may open the salary share; nobody else should even list the files',
        answer: 'permissions',
        why: 'Aquí el problema es *quién* abre el dato, no cómo se ve: se resuelve con permisos y ACL que limitan el acceso desde el principio.',
      },
      {
        text: 'The incident report folder must be readable only by the CISO and the legal counsel',
        answer: 'permissions',
        why: 'El contenido debe verse íntegro, pero solo por dos personas: restricción de permisos sobre el recurso.',
      },
      {
        text: "A contractor's account must lose access to the design drawings the day the contract ends",
        answer: 'permissions',
        why: 'Revocar el acceso es una decisión de autorización: se quita el permiso, no se cifra ni se enmascara nada para el resto.',
      },
    ],
  },
};

// ---------------------------------------------------------------------------
// Order labs
// ---------------------------------------------------------------------------

export const SP3_ORDER_DATA: Record<string, OrderData> = {
  spl3c: {
    prompt:
      'La sala de servidores principal del puerto se ha quedado sin refrigeración y los sistemas caen. Toca los pasos de la activación del plan de recuperación en el orden correcto, desde la detección hasta la revisión posterior.',
    steps: [
      {
        text: 'Detect and confirm the outage',
        detail:
          'La monitorización alerta y alguien verifica que la caída es real y no un falso positivo; declarar un desastre por una alerta sin confirmar sería carísimo.',
      },
      {
        text: 'Declare the disaster and activate the plan',
        detail:
          'La persona con autoridad para declararlo (definida en el plan) da la orden formal; sin declaración nadie está autorizado a mover producción.',
      },
      {
        text: 'Notify stakeholders and staff roles',
        detail:
          'Se avisa a dirección, negocio y a cada rol del plan según el árbol de llamadas, para que el equipo esté en posición antes de tocar nada.',
      },
      {
        text: 'Fail over to the warm site',
        detail:
          'Se levanta el sitio alternativo, que ya tiene hardware y red listos; es el primer paso técnico porque hace falta un destino antes de restaurar datos.',
      },
      {
        text: 'Restore the latest verified backup',
        detail:
          'Sobre esa plataforma se restaura la copia buena más reciente, respetando el RPO acordado; sin sitio operativo no hay dónde restaurar.',
      },
      {
        text: 'Verify data integrity and service function',
        detail:
          'Se comprueba que los datos están completos y que las aplicaciones responden; una restauración sin verificar no cuenta como recuperación.',
      },
      {
        text: 'Redirect users to the DR site',
        detail:
          'Solo cuando el servicio está validado se mueven DNS, VPN y usuarios al sitio de DR; redirigir antes expondría a todos a un entorno a medias.',
      },
      {
        text: 'Fail back and run the post-incident review',
        detail:
          'Con el sitio principal reparado se vuelve de forma controlada y se hace la revisión: qué tardó, si se cumplieron RTO/RPO y qué corregir en el plan.',
      },
    ],
  },
};

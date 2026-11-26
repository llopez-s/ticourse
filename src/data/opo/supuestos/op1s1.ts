import type { Supuesto } from '../../../lib/supuesto';

// Esqueleto válido y mínimo; el caso completo llega con la Task 10.
const op1s1: Supuesto = {
  id: 'op1s1',
  track: 'opo',
  sectionIds: ['op1'],
  version: 1,
  title: 'La oficina comarcal nueva',
  brief: 'Diseña y documenta la red de una oficina comarcal nueva: direccionamiento, VLAN, enrutado y una memoria final.',
  minutes: 60,
  prerequisites: ['op1m1', 'op1m2', 'op1m3', 'op1m4', 'op1m5'],
  dossier: [
    {
      id: 'd-encargo',
      title: 'Encargo de la dirección',
      kind: 'memo',
      body: [
        { t: 'p', md: 'La Diputación abre una oficina comarcal con **40 puestos** de trabajo y necesita su red en tres semanas.' },
      ],
    },
    {
      id: 'd-acta',
      title: 'Acta de la reunión técnica',
      kind: 'acta',
      unlockedBy: 'f2',
      body: [
        { t: 'p', md: 'Se acuerda separar en VLAN distintas los puestos de trabajo y los servidores de la oficina.' },
      ],
    },
  ],
  phases: [
    {
      id: 'f1',
      title: 'Direccionamiento',
      context: 'Te dan la red 10.20.0.0/24 para toda la oficina.',
      tasks: [
        {
          id: 'f1t1',
          kind: 'numeric',
          prompt: '¿Cuántas direcciones de host útiles tiene una red /26?',
          answer: 62,
          points: 2,
          explain: 'Una /26 deja 6 bits de host: 2^6 − 2 = 62 direcciones útiles.',
          refs: [{ label: 'Direccionamiento IP', href: '/learn/op1m2' }],
        },
      ],
    },
    {
      id: 'f2',
      title: 'Segmentación',
      context: 'Hay que separar puestos y servidores sin comprar un router por cada zona.',
      tasks: [
        {
          id: 'f2t1',
          kind: 'choice',
          prompt: '¿Qué mecanismo separa dos redes lógicas en un mismo conmutador?',
          options: [
            { id: 'a', text: 'VLAN' },
            { id: 'b', text: 'NAT' },
            { id: 'c', text: 'DHCP' },
          ],
          answer: 'a',
          points: 2,
          explain: 'Una VLAN crea dominios de difusión separados dentro del mismo conmutador.',
          refs: [{ label: 'Conmutación y VLAN', href: '/learn/op1m3' }],
        },
      ],
    },
    {
      id: 'f3',
      title: 'Enrutado',
      context: 'Las VLAN deben poder hablar entre sí, bajo control.',
      tasks: [
        {
          id: 'f3t1',
          kind: 'cite',
          prompt: 'Señala el documento que justifica separar puestos y servidores.',
          answerSets: [['d-acta']],
          points: 2,
          explain: 'El acta de la reunión técnica recoge el acuerdo de segmentar.',
          refs: [],
        },
      ],
    },
    {
      id: 'f4',
      title: 'Memoria final',
      context: 'Cierra el trabajo con una memoria breve para la dirección.',
      tasks: [
        {
          id: 'f4t1',
          kind: 'written',
          prompt: 'Resume en pocas líneas el diseño de red y por qué segmentas.',
          words: 80,
          points: 4,
          model: 'Se divide la red en una VLAN de puestos y otra de servidores, enrutadas entre sí con reglas de filtrado. Así se limita el alcance de una incidencia y se simplifica la gestión.',
          rubric: [
            { id: 'r1', text: 'Describe la separación en VLAN', points: 2 },
            { id: 'r2', text: 'Justifica la segmentación', points: 2 },
          ],
          explain: 'Una buena memoria nombra el diseño y su motivo.',
          refs: [],
        },
      ],
    },
  ],
  sources: [{ label: 'RFC 1918: direccionamiento privado', href: 'https://www.rfc-editor.org/rfc/rfc1918' }],
};

export default op1s1;

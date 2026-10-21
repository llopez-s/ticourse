import type { Module } from '../../lib/types';

/** Provisional scaffold; replaced by the real lesson (see the sp7 plan). */
export const SP7M6: Module = {
  id: 'sp7m6',
  sectionId: 'sp7',
  title: 'Arquitectura y datos',
  minutes: 25,
  objectives: ['Lección en preparación: complemento opcional del SY0-801'],
  blocks: [
    {
      t: 'callout',
      kind: 'warn',
      title: 'Fuera del SY0-701 · novedad del SY0-801',
      md: 'Esta lección es material complementario y opcional sobre el SY0-801. No forma parte del SY0-701 y todavía está en preparación.',
    },
    {
      t: 'links',
      title: 'Complementa',
      items: [{ label: 'El examen Security+: formato y estrategia', href: '/learn/sp6m1' }],
    },
  ],
  quiz: [],
};

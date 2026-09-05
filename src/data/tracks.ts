import type {
  Domain,
  Flashcard,
  GlossaryEntry,
  Module,
  SectionMeta,
  TrackId,
} from '../lib/types';
import { RANKS, type Rank } from '../lib/xp';
import { GCTI_LABS, type LabMeta } from './labs';
import { FLASHCARDS as GCTI_FLASHCARDS } from './flashcards';
import { GLOSSARY as GCTI_GLOSSARY } from './glossary';
import { GCTI_SECTIONS } from './course-gcti';
import { S1_MODULES } from './s1';
import { S2_MODULES } from './s2';
import { S3_MODULES } from './s3';
import { S4_MODULES } from './s4';
import { S5_MODULES } from './s5';
import { S6_MODULES } from './s6';
import {
  SP_DOMAIN_WEIGHTS,
  SP_DOMAINS,
  SP_RANKS,
  SP_SECTIONS,
} from './secplus/sections';
import { SP1_MODULES } from './secplus/sp1';
import { SP2_MODULES } from './secplus/sp2';
import { SP3_MODULES } from './secplus/sp3';
import { SP4_MODULES } from './secplus/sp4';
import { SP5_MODULES } from './secplus/sp5';
import { SP6_MODULES } from './secplus/sp6';
import { SP_FLASHCARDS } from './secplus/flashcards';
import { SP_GLOSSARY } from './secplus/glossary';
import { SP_LABS } from './secplus/labs';

export type { TrackId };

/** Everything a study track owns. Pages read the active track from the store. */
export interface TrackMeta {
  id: TrackId;
  name: string;
  brand: string;
  icon: string;
  tagline: string;
  disclaimer: string;
  domains: Domain[];
  domainWeights: Record<string, number>;
  sections: SectionMeta[];
  modules: Module[];
  flashcards: Flashcard[];
  glossary: GlossaryEntry[];
  labs: LabMeta[];
  ranks: Rank[];
  exam: {
    name: string;
    realFormat: string;
    passPct: number;
    sprint: { n: number; minutes: number };
    full: { n: number; minutes: number };
  };
  campaign: { title: string; intro: string };
}

const GCTI_DOMAINS: Domain[] = [
  'Requirements',
  'Intrusion Analysis',
  'Collection',
  'Analysis',
  'Dissemination',
];

export const TRACKS: Record<TrackId, TrackMeta> = {
  gcti: {
    id: 'gcti',
    name: 'CTI · GCTI',
    brand: 'CTI Academy',
    icon: '◆',
    tagline:
      'Preparación FOR578 · GCTI — teoría, labs y examen en un solo sitio.',
    disclaimer:
      'Material de estudio no oficial creado para preparar los temas de FOR578/GCTI. No afiliado a SANS ni GIAC.',
    domains: GCTI_DOMAINS,
    domainWeights: Object.fromEntries(GCTI_DOMAINS.map((d) => [d, 0.2])),
    sections: GCTI_SECTIONS,
    modules: [
      ...S1_MODULES,
      ...S2_MODULES,
      ...S3_MODULES,
      ...S4_MODULES,
      ...S5_MODULES,
      ...S6_MODULES,
    ],
    flashcards: GCTI_FLASHCARDS,
    glossary: GCTI_GLOSSARY,
    labs: GCTI_LABS,
    ranks: RANKS,
    exam: {
      name: 'Simulacro GCTI',
      realFormat:
        'Preguntas muestreadas de los 5 dominios del curso, cronometradas y sin feedback inmediato — como el examen real (75 preguntas, 2 h, open-book).',
      passPct: 75,
      sprint: { n: 25, minutes: 30 },
      full: { n: 50, minutes: 60 },
    },
    campaign: {
      title: 'Operación VELVET CICADA',
      intro:
        'Eres la primera analista CTI de Meridian Dynamics. Completa las 5 misiones (labs) y derrota a los 5 bosses para desenmascarar al grupo.',
    },
  },
  secplus: {
    id: 'secplus',
    name: 'Security+',
    brand: 'Security+ Forge',
    icon: '🛡️',
    tagline:
      'Preparación CompTIA Security+ (SY0-701) — los 5 dominios, labs y simulacros.',
    disclaimer:
      'Material de estudio no oficial e independiente para preparar los objetivos públicos del SY0-701. No afiliado a CompTIA. CompTIA y Security+ son marcas de CompTIA, Inc.',
    domains: SP_DOMAINS,
    domainWeights: SP_DOMAIN_WEIGHTS,
    sections: SP_SECTIONS,
    modules: [
      ...SP1_MODULES,
      ...SP2_MODULES,
      ...SP3_MODULES,
      ...SP4_MODULES,
      ...SP5_MODULES,
      ...SP6_MODULES,
    ],
    flashcards: SP_FLASHCARDS,
    glossary: SP_GLOSSARY,
    labs: SP_LABS,
    ranks: SP_RANKS,
    exam: {
      name: 'Simulacro Security+',
      realFormat:
        'Preguntas muestreadas con los pesos oficiales por dominio, cronometradas y sin feedback hasta el final — como el examen real (hasta 90 preguntas, 90 min, corte 750/900, closed-book).',
      passPct: 83,
      sprint: { n: 30, minutes: 30 },
      full: { n: 90, minutes: 90 },
    },
    campaign: {
      title: 'Operación GLASS HARBOR',
      intro:
        'Eres la primera analista de seguridad de la Autoridad Portuaria de Halden. Completa las 5 misiones (labs) y derrota a los 5 bosses para descubrir quién está detrás de GLASS HARBOR.',
    },
  },
};

export const TRACK_IDS: TrackId[] = ['gcti', 'secplus'];

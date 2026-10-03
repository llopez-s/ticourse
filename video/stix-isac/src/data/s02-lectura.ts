/**
 * s02-lectura «Lo que trae el aviso» — on-screen strings. The JSON itself and
 * the neighbours' note live in the shared parts (`scenes/parts/StixJson.tsx`,
 * `scenes/parts/NeighbourNote.tsx`). Each lens repeats the field the voice is
 * on at a readable size, with its plain reading.
 */

export const LENS = {
  type: { key: 'type', value: 'indicator' },
  spec: { key: 'spec_version', term: 'STIX', value: '2.1' },
  pattern: { key: 'pattern', value: 'cdn-sync-status.example' },
  source: { key: 'created_by_ref', value: 'identity--aero-isac-share-0001', label: 'quién lo dice: el ISAC' },
  confidence: { key: 'confidence', value: '70', label: '70 sobre 100' },
  tlp: { key: 'object_marking_refs', valueLead: 'marking-definition--', valueTlp: 'tlp-amber-strict', label: 'solo dentro de Meridian' },
} as const;

/** The calendar next to valid_until: 25-06 (expiry) to 02-07 (today). */
export const CALENDAR = {
  until: { key: 'valid_until', date: '2026-06-25' },
  today: 'hoy · 02-07-2026',
  days: [25, 26, 27, 28, 29, 30, 1, 2],
  months: { jun: 'jun', jul: 'jul' },
} as const;

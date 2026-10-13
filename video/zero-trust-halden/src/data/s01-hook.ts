/**
 * s01-hook «Basta con estar en Operaciones» — on-screen strings (canon: out/scene-brief.md «Canon»).
 *
 * The firewall rule's own strings live with its drawing (`RULE` in scenes/parts/RuleCard.tsx). This file
 * holds what the scene adds around it: Friday's stamp, what the rule does not look at, the title, the
 * promise and NULL CIPHER's tag (a label: no portrait, no gender mark, and never a door, key or badge).
 * No bridge sentence and no reference to any other video; the only date is 13-11, the only identifier
 * `erp.local` (on the rule card).
 */
import type { IconName } from '../../../engine/src/ui';

/** «13-11 · viernes · acceso al ERP · diseño y simulación». */
export const STAMP = { day: '13-11', weekday: 'viernes', what: 'acceso al ERP', mode: 'diseño y simulación' } as const;

/** What today's rule does not look at: dim until `blind`, amber from then on. */
export const BLIND: { head: string; items: { text: string; icon: IconName }[] } = {
  head: 'no mira',
  items: [
    { text: 'quién eres', icon: 'user' },
    { text: 'cómo está tu portátil', icon: 'laptop' },
    { text: 'desde dónde y cuándo', icon: 'globe' },
  ],
};

export const TITLE = 'Zero Trust';

/**
 * The promise (s01-02 «Verás cómo se verifica cada petición, quién decide, quién comunica, quién aplica y
 * cómo se adapta»): three chips, each made of the pieces that light as the voice says their word.
 * Joined with spaces they read «verificar cada petición» · «quién decide, quién comunica y quién aplica» ·
 * «adaptarse y acotar».
 */
export const PROMISE: { icon: IconName; parts: { text: string; word: string }[] }[] = [
  { icon: 'search', parts: [{ text: 'verificar cada petición', word: 'verifica' }] },
  {
    icon: 'users',
    parts: [
      { text: 'quién decide,', word: 'decide' },
      { text: 'quién comunica', word: 'comunica' },
      { text: 'y quién aplica', word: 'aplica' },
    ],
  },
  { icon: 'target', parts: [{ text: 'adaptarse y acotar', word: 'adapta' }] },
];

/** «NULL CIPHER · sección 1» with «célula de acceso inicial» under it (rose; a label only). */
export const ADVERSARY = { name: 'NULL CIPHER', section: 'sección 1', line: 'célula de acceso inicial' } as const;

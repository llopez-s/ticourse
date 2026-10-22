/** s06-precio «Toda la avenida en una central» — on-screen strings (canon: out/scene-brief.md). */
import type { IconName } from '../../../engine/src/ui';
import type { ToolIcon } from '../scenes/parts/Tools';

/** The one box the whole flow goes through (no product name). */
export const PLATFORM = 'plataforma de orquestación';

/** Its three steps, and what each one becomes when the platform falls (lit on the voice's word, `word`). */
export const STEPS: { on: string; off: string; icon: IconName; word: string }[] = [
  { on: 'abre el caso', off: 'no se abre el caso', icon: 'archive', word: 'abre' },
  { on: 'avisa a la guardia', off: 'no se avisa a nadie', icon: 'bell', word: 'avisa' },
  { on: 'corta las sesiones', off: 'no se corta nada', icon: 'power', word: 'corta' },
];

/** The platform's account and the tools it reaches (icons only: EDR, identity provider, SOC queue, mail). */
export const ACCOUNT = 'cuenta de la plataforma';
export const TOUCHES: ToolIcon[] = ['shield', 'user', 'archive', 'mail'];

export const SPOF = 'Single point of failure';
export const PRIVILEGED = 'objetivo privilegiado';

/** The two cards. */
export const COMPLEX_CAPTION = '40 semáforos · bien llevada';
export const COMPLEXITY = 'Complexity';
export const DEBT_TAG = ['lo programó alguien que', 'ya no trabaja aquí', 'sin planos · sin dueño'] as const;
export const DEBT = 'Technical debt';

export const SUPPORT = 'Ongoing supportability';
export const WHO = '¿quién lo va a mantener?';

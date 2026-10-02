/**
 * s02-escalera «Porqué, cómo y cómo exactamente» — on-screen strings (fictional
 * canon of lesson s2m5, `src/data/s2.ts:1153-1176`). The voice never reads the
 * command; it is on screen when she says «esta rama» / «su comando».
 */

/** The schtasks branch, split so the task name can be highlighted on its own. */
export const TASK_CMD = {
  before: 'schtasks.exe /create /tn ',
  name: 'WindowsUpdateCheck',
  after: ' /sc onlogon',
} as const;

export const TASK_CMD_TEXT = `${TASK_CMD.before}${TASK_CMD.name}${TASK_CMD.after}`;

/** Plain reading under the zoomed branch. */
export const PLAIN_LINE = 'que el programa vuelva a arrancar en cada inicio de sesión';

export const RUNG_TEXT = {
  tactic: { content: 'Persistence', gloss: 'el porqué: poder volver' },
  technique: {
    id: 'T1053',
    name: 'Scheduled Task/Job',
    sub: 'sub-technique .005 Scheduled Task',
    gloss: 'el cómo · lo usan muchos',
  },
  procedure: { gloss: 'así lo hace este' },
} as const;

/** The disguise: the task name and the key's tag are the same trick. */
export const DISGUISE_LABEL = { lead: 'el disfraz, ', tail: 'también procedure' } as const;
export const TAG_TEXT = 'revisión del gas';

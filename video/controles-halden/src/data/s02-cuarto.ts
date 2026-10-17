/** s02-cuarto «La puerta del cuarto de comunicaciones» — on-screen strings (canon: out/scene-brief.md). */

/** The morning, no date. */
export const WHEN = 'Una mañana · sin fecha';
/** Said by the voice: nothing is missing (no intruder is drawn). */
export const NOTHING_MISSING = 'no falta nada';
/** Under the door while it stands open. */
export const DOOR_OPEN = 'puerta abierta';

/** Room labels on the schematic floor plan (no equipment names). */
export const ROOMS = { boss: 'dirección', comms: 'cuarto de comunicaciones' } as const;

/**
 * The four controls on that door, in narration order. `cue` = when the statement lands; `seg` + `word` = where
 * the category term is spoken (the tag's top box fills on it); `gloss` = the rule in plain words under the tag on
 * `four`. The statements are the goal's verbatim strings.
 */
export const CONTROLS = [
  {
    cue: 'decide',
    seg: 's02-02',
    word: 'managerial',
    category: 'Managerial',
    statement: 'la dirección decide quién puede entrar',
    gloss: 'decidir',
  },
  {
    cue: 'do',
    seg: 's02-03',
    word: 'operational',
    category: 'Operational',
    statement: 'el técnico de guardia acompaña a quien entre sin permiso propio',
    gloss: 'hacer',
  },
  {
    cue: 'touch',
    seg: 's02-04',
    word: 'physical',
    category: 'Physical',
    statement: 'la puerta se cierra sola y lleva cerradura',
    gloss: 'algo que se toca',
  },
  {
    cue: 'system',
    seg: 's02-05',
    word: 'technical',
    category: 'Technical',
    statement: 'los equipos de dentro solo aceptan cambios con una cuenta de Sistemas',
    gloss: 'un sistema solo',
  },
] as const;

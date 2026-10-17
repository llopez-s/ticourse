/** On-screen strings of s04-camara «La cámara del depósito» (Spanish, exam terms in English as spoken). */

export const DEPOT = {
  title: 'depósito de contenedores vacíos',
  sub: 'una cámara bien a la vista, en la entrada',
} as const;

export const NIGHT = { when: 'de noche', what: 'quien se acerca la ve y se da la vuelta', type: 'Deterrent' } as const;
export const MORNING = { when: 'a la mañana siguiente', what: 'la grabación cuenta qué pasó', type: 'Detective' } as const;

/** The lock's tag, completed on `both`. */
export const LOCK_TAG = { top: 'Physical', bottom: 'Preventive' } as const;

/** The rule on `scenario`: lead + the highlighted word + the rest. */
export const RULE = { lead: 'el ', key: 'tipo', rest: ' es lo que hace el control en ese escenario' } as const;

/** The line between deterring and preventing (`line`). */
export const LINE_LEFT = { verb: 'disuadir', term: 'Deterrent', text: 'la cámara depende de que la persona decida parar' } as const;
export const LINE_RIGHT = { verb: 'impedir', term: 'Preventive', text: 'la cerradura la para aunque insista' } as const;

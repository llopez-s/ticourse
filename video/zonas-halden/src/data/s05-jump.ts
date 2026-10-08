/**
 * s05-jump «Una sola puerta» — on-screen strings (canon: out/scene-brief.md, «Canon»).
 * Anti-spoiler: no names on the workstations (no ADM-WS-*), no identity provider, nothing that
 * says MFA is already live (it is a requirement of the plan), no line from any VLAN to the OT.
 * Before `answer` nothing says where the jump server goes.
 */

export const S05 = {
  /** Today's rule (rule 5 of V1, not cited in the voice). */
  today: 'Administración a gestión · SSH · desde cada puesto',
  admin: 'Administración',
  interfaces: 'interfaces de gestión',
  manyPaths: 'un camino por puesto',
  /** «La sala de mandos de la red» (s05-02) — NOT Operations' «sala de control». */
  room: {
    title: 'la sala de mandos de la red',
    door: 'una sola puerta',
    turnstile: 'tarjeta y PIN',
    recorded: 'todo queda grabado',
  },
  /** The jump server box: «endurecido · MFA · sesión grabada». */
  box: ['endurecido', 'MFA', 'sesión grabada'],
  choices: { dmz: 'DMZ', gestion: 'gestión' },
  answer: {
    zone: 'zona de gestión: solo responde al jump server',
    dmzNo: ['lo alcanzaría cualquiera desde Internet', 'el único control, convertido en el único blanco'],
  },
  term: { name: 'JUMP SERVER', sub: 'jump box · bastion host' },
  wrap: ['lo público, a la ventanilla', 'y los mandos, tras una sola puerta'],
} as const;

/**
 * s04-dmz «La ventanilla» — on-screen strings (canon: out/scene-brief.md, «Canon»).
 * Hosts are screen-only (the voice says «el portal», «el cortafuegos del perímetro»).
 * Anti-spoiler: no names on the workstations, nothing of the September case, nothing that
 * cuts the portal's own outbound traffic to Internet.
 */

export const S04 = {
  /** The portal (the napkin's NAPKIN_TEXT.portalHost / portalWhat, the description on two lines). */
  portal: { host: 'hpa-portal-web-01', what: ['portal público', 'de reservas de atraque'] },
  /** Header of the inbound rule on the perimeter firewall. */
  rule: { host: 'fw-perimetro-01', what: 'regla de entrada' },
  /** s04-03, after the dotted line reaches the workstations. */
  inside: 'si alguien lo rompe, ya está dentro',
  /** «La ventanilla» (s04-04, s04-05). */
  counter: {
    title: 'la ventanilla',
    sub: 'de navieras y transportistas',
    traits: ['sin puerta a las oficinas', 'solo una bandeja', 'alguien mira cada papel'],
  },
  /** The DMZ's two rules (s04-07), as the voice says them. */
  dmzRules: [
    { lead: 'de Internet a la DMZ:', rest: 'solo 443, al portal' },
    { lead: 'de la DMZ a la red interna:', rest: 'solo lo imprescindible, con regla; nada más' },
  ],
  /** Chip on the inbound path of the plan. */
  port: '443',
  /** s04-08. */
  contained: { lead: 'quien rompa el portal', rest: 'se queda en la ventanilla' },
} as const;

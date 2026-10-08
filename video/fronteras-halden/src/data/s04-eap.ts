import { ROLE_LANES_TEXT } from '../scenes/parts/RoleLanes';

/**
 * s04-eap «Sí, no o cuarentena» — on-screen strings (canon: out/scene-brief.md, «Canon»).
 * Nothing here runs on 23-11: the whole scene is the rule from 1-12 (the fixed label says so).
 * Anti-spoiler: EAP-TLS only as a concept (no certificate of the port, no PKI), no NAC, no
 * contractors, no names on the laptops. A reject carries no VLAN: the device FALLS into the
 * quarantine VLAN from the switch port (its configured fallback); RADIUS sends nothing.
 */

const split = (s: string) => {
  const i = s.indexOf(' · ');
  return [s.slice(0, i), s.slice(i + 3)] as const;
};

const [acceptHead, acceptRest] = split(ROLE_LANES_TEXT.accept.caption);
const [rejectHead, rejectRest] = split(ROLE_LANES_TEXT.reject.caption);

export const S04 = {
  /** Fixed for the whole scene: «con 802.1X · así será desde el 1-12». */
  rule: { lead: 'con 802.1X', rest: 'así será desde el 1-12' },
  /** EAP «el marco, no el método». */
  eap: { term: ROLE_LANES_TEXT.eap, sub: 'el marco, no el método' },
  /** The two method cards; each canon string split at « · » (term / what / badge). */
  cards: {
    tls: { term: 'EAP-TLS', what: 'certificado en el equipo y en el servidor', badge: 'el más fuerte' },
    peap: { term: 'PEAP · EAP-TTLS', what: 'credenciales dentro de un túnel TLS' },
  },
  /** The two endings (RoleLanes' canon strings, split at « · » so they can come in with the voice). */
  accept: { title: ROLE_LANES_TEXT.accept.title, head: acceptHead, rest: acceptRest },
  reject: { title: ROLE_LANES_TEXT.reject.title, head: rejectHead, rest: rejectRest },
  radius: ROLE_LANES_TEXT.radius.name,
  /** Rides RADIUS's yes into the port («su VLAN»). */
  vlan: 'VLAN',
  /** The box the rejected laptop falls into (a substring of the reject caption; not one of V16's zones). */
  quarantine: 'VLAN de cuarentena',
  /** The laptop nobody has registered (storyboard goal: «un portátil que nadie ha dado de alta»). */
  unregistered: 'sin dar de alta',
  /** s04-06, one line: «802.1X en los switches de acceso de la planta de oficinas · Infraestructura · desde el 1-12». */
  decision: { what: '802.1X en los switches de acceso de la planta de oficinas', owner: 'Infraestructura', when: 'desde el 1-12' },
} as const;

/**
 * s03-8021x «Tres papeles en la puerta» — on-screen strings (canon: out/scene-brief.md «Canon»).
 *
 * The lanes and the entrance gate print their own labels (ROLE_LANES_TEXT, ENTRANCE_GATE_TEXT); this file holds
 * what the scene adds: the think prompt's two buttons (identical until `decides`), the answer, the exam names of
 * the three roles, and the name 802.1X.
 */
import { ROLE_LANES_TEXT } from '../scenes/parts/RoleLanes';

/** The two options of «¿Quién decide: el switch o el servidor RADIUS?». */
export const CHOICES = { switch: 'el switch', radius: 'RADIUS' } as const;

/** On `decides` («El switch transmite y obedece»): lead in white, the rest in cyan. */
export const ANSWER = { lead: 'el switch ', rest: 'transmite y obedece' } as const;

/** The three roles' exam names (the lanes' own terms), each lit on its word in s03-07; the gate's tags reuse them. */
export const ROLES = [
  { lane: 'device', term: ROLE_LANES_TEXT.device.term, word: 'supplicant' },
  { lane: 'switch', term: ROLE_LANES_TEXT.switch.term, word: 'authenticator' },
  { lane: 'radius', term: ROLE_LANES_TEXT.radius.term, word: 'authentication' },
] as const;

/** «802.1X» with «port-based network access control» under it. */
export const TERM = { name: '802.1X', sub: 'port-based network access control' } as const;

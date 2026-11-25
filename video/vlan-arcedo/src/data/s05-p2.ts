/** s05-p2 «Dos nativas distintas» — question 2 is ANOTHER network, not the Consorcio. */
import type { VlanId } from './vlans';

/** The two ends of the trunk and the native VLAN each one has configured. */
export const ENDS: readonly { label: string; native: VlanId }[] = [
  { label: 'A · nativa 10', native: 10 },
  { label: 'B · nativa 20', native: 20 },
];

/** The device that sends the frame: VLAN 10, hanging from A. */
export const SENDER_VLAN: VlanId = 10;

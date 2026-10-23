/**
 * The flash alert of the lesson (src/data/s5.ts, module s5m1), character for character, except the last line:
 * the lesson's « | Ref: MER-2026-011» is dropped, as V27 did with that reference (canon §5 point 17).
 */
export const FLASH_LINES = [
  'MERIDIAN CTI — FLASH ALERT MER-FA-2026-014        TLP:AMBER',
  'Issued: 2026-04-18 11:40 UTC | Next review: 2026-04-25',
  '',
  'BLUF: We assess with moderate confidence that GLASS VIPER',
  'is running an active credential-phishing wave against',
  'Meridian supplier portals. Block the indicators in annex A',
  'and force MFA re-enrollment for supplier accounts TODAY.',
  '',
  'WHAT WE KNOW',
  '- 41 phishing emails to supply-chain staff since 06:00 UTC',
  '- Lure: "urgent PO revision", spoofed supplier domain',
  '- Live credential harvesting on cdn-sync-status.example',
  '',
  'WHAT WE DO NOT KNOW YET',
  '- Whether any credentials were submitted (under review)',
  '',
  'ACTIONS REQUESTED (by 18:00 UTC)',
  '1. Block domain + URL set (annex A) at proxy and gateway',
  '2. Force password reset + MFA re-enroll: portal users',
  '3. Report clicks to IR via #ir-hotline',
  '',
  'NEXT UPDATE: 2026-04-18 17:00 UTC or on material change',
  'Contact: cti@meridian.example',
] as const;

export type BlockId = 'head' | 'bluf' | 'know' | 'unknown' | 'actions' | 'next' | 'contact';

/** First and last line index of each block of the sheet. */
export const BLOCKS: Record<BlockId, [number, number]> = {
  head: [0, 1],
  bluf: [3, 6],
  know: [8, 11],
  unknown: [13, 14],
  actions: [16, 19],
  next: [21, 21],
  contact: [22, 22],
};

/** The phrase of the BLUF the voice calls «confianza moderada». */
export const BLUF_CONFIDENCE = 'moderate confidence';

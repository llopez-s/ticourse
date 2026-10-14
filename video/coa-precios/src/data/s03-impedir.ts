/** On-screen strings of s03-impedir (the storyboard's, exactly). */
export const S03 = {
  /** The reply to GLASS VIPER, beside the ringing alarm. */
  alone: ['una alarma sola', 'no para nada'],
  deny: { name: 'DENY', sub: 'no llega a funcionar' },
  disrupt: { name: 'DISRUPT', sub: 'lo cortas en curso' },
  /** Chapter close: «Discover y Detect miran · Deny y Disrupt paran». */
  wrap: [
    { a: 'Discover', b: 'Detect', verb: 'miran', tone: 'cyan' },
    { a: 'Deny', b: 'Disrupt', verb: 'paran', tone: 'emerald' },
  ],
} as const;

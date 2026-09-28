/**
 * Values filed under each vertex of the E7 diamond, shared by s04-infra,
 * s05-adversary and s06-meta so the diamond reads the same in every scene.
 * Fictional canon (VELVET CICADA): never add registrant names or other IPs.
 */
export const E7_VALUES = {
  vic: 'ENG-WS-041',
  cap: 'GLASS VIPER',
  domain: 'update-svc-cdn.com',
  ip: '185.220.x.x',
} as const;

/** Card width that fits `update-svc-cdn.com` on one line (26px mono ≈ 281px + padding). */
export const WIDE_CARD = 340;

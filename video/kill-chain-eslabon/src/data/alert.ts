/**
 * The 5-3 alert card (shared part `scenes/parts/AlertCard.tsx`) — on-screen strings, canon (out/scene-brief.md
 * «Canon»): the alert V3 and V7 already showed, «sin nada más». Sources: V3 `video/diamond-e7/src/scenes/S01Hook.tsx`
 * (panel, «turno de noche», host «ENG-WS-041» + «ingeniería de propulsión», domain «update-svc-cdn.com» + «dominio
 * desconocido»), V7 `video/attack-piramide/src/data/s01-hook.ts:24-27` (the «05-03-2026 · 02:13 UTC» format).
 * No «E7», no report number, no hash, no severity badge, no «EDR», no «HTTPS», no beacon strip: the voice defines
 * «beacon» only in s04. The link label is «llama a».
 */
export const ALERT = {
  soc: 'SOC · Meridian Dynamics',
  shift: 'turno de noche',
  /** The quiet console before the alert lands (V3's own line). */
  quiet: 'Sin alertas activas…',
  when: '05-03-2026 · 02:13 UTC',
  host: 'ENG-WS-041',
  hostSub: 'ingeniería de propulsión',
  link: 'llama a',
  domain: 'update-svc-cdn.com',
  domainSub: 'dominio desconocido',
  /** The frame of the whole video (s01, and again in s08 `wrap-iv`). */
  question: '¿qué le queda por hacer?',
} as const;

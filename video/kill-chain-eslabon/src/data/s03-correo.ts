/**
 * s03-correo «La caja en la puerta» — on-screen strings (canon: out/scene-brief.md «Canon»). The header lines
 * themselves live in `scenes/parts/LessonLog.tsx` (shared with s05/s06). No `To:` line, no «RR. HH.», no `[fase]`.
 */

/** Label of the amber `From` domain (`from`). */
export const FROM_LABEL = 'parece de casa';
/** Label of the rose Return-Path / Received domain (`real-sender`); the IP stays as in the lesson, untouched. */
export const REAL_SENDER_LABEL = ['apuntan a quien', 'lo envió de verdad'] as const;

/** Gloss under the DELIVERY entrance (`delivery`; the name itself comes from KillChain's PHASES). */
export const DELIVERY_GLOSS = ['llevar el artefacto', 'hasta la víctima'] as const;

/** The chip next to `From` that the voice raises (s03-05) and strikes (`not-recon`). */
export const RECON_CHIP = '¿Reconnaissance?';
/**
 * Why it is not Reconnaissance (`not-recon`): «investigar a Meridian fue antes · usarlo para que el correo entre y se
 * abra es entrega». `tail` is drawn in the phase-name colour.
 */
export const RECON_WHY = {
  before: 'investigar a Meridian fue antes',
  use: 'usarlo para que el correo entre y se abra ',
  tail: 'es entrega',
} as const;

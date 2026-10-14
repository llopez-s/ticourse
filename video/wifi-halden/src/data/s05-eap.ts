/** s05-eap «Dos formas de entrar»: on-screen strings, exactly as the storyboard gives them. */

/** The exam name that sets the way in, and its two groups. */
export const EAP = 'EAP';
export const LANES = {
  peap: ['PEAP', 'TTLS'],
  tls: 'EAP-TLS',
} as const;

/** The two buttons under the think prompt. */
export const OPTIONS = { peap: 'PEAP', tls: 'EAP-TLS' } as const;

/** The PEAP · TTLS group. */
export const PEAP = {
  inside: 'usuario y contraseña dentro de un túnel TLS',
  cert: 'certificado solo en el servidor',
  /** The big warning, wrapped in two lines. */
  warning: ['el cliente tiene que validar', 'el certificado del servidor'],
  weaker: 'más débil que EAP-TLS',
} as const;

/** The fake access point: a hypothesis, outside the terminal, with the same network name. */
export const FAKE = {
  tag: 'hipótesis',
  network: 'HALDEN-OPS',
  takes: 'credenciales',
  place: 'terminal',
} as const;

/** The EAP-TLS group. */
export const TLS = {
  both: 'certificado en la tableta y en el servidor',
  mutual: 'autenticación mutua',
  nothing: 'no hay contraseña que robar',
} as const;

/** The word on the server box. */
export const SERVER = 'RADIUS';

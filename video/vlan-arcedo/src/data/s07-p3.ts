/**
 * s07-p3 «Sin puerta de enlace» — the network sheet of the still background. Field NAMES only: the Canon forbids any
 * host address, so the filled fields show a neutral bar and the gateway field is an empty box.
 */
export const SHEET = {
  title: 'ficha de red',
  mode: 'a mano',
  fields: [
    { name: 'dirección IP', filled: true },
    { name: 'máscara', filled: true },
    { name: 'puerta de enlace', filled: false },
  ],
} as const;

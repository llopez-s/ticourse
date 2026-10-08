/**
 * s08-hotel «Desde un hotel» — on-screen strings (canon: out/scene-brief.md).
 * Anti-spoiler: «VPN sobre TLS · 443/tcp» joins the remote-access label ONLY at `tls`, after the
 * question; nothing says «443», «TLS» or «https» before it, and the two think buttons are identical.
 * Never «NAT». No VPN server name, nothing about how people log in. The traveller is «alguien del
 * puerto de viaje»: no area, no name.
 * Not canon: the building's sign «hotel», the «proxy» booth label, «Internet» (as in Sites) and the
 * «443» on the web door (shown with the label, at «443»).
 */

export const S08 = {
  remote: 'Acceso remoto del puerto',
  /** Added to `remote` at `tls`, in two steps: «VPN sobre TLS» on TLS, « · 443/tcp» on «443». */
  overTls: { lead: 'VPN sobre TLS', port: '443/tcp' },
  sep: ' · ',
  hotel: 'hotel',
  traveller: 'alguien del puerto de viaje',
  webOnly: 'solo deja salir web, y por un proxy',
  proxy: 'proxy',
  internet: 'Internet',
  webPort: '443',
  /** The think prompt's two buttons, in this order. */
  choices: { ipsec: 'IPSec', tls: 'TLS' },
  ipsec: { term: 'IPSec', needs: ['ESP · protocolo 50', 'IKE · UDP 500 y 4500'] as const },
  term: 'TLS VPN',
} as const;

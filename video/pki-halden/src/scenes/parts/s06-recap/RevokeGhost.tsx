import { Stamp, clamp01 } from '../../../../../engine/src/ui';
import { CERT_CARD, GhostCert } from '../s04-revocar/Cert';

/**
 * Rule 2's icon: s04's own drawing, scaled down — the ghost copy of the certificate (`GhostCert`, the
 * s04 builder's part, reused read-only) with the REVOKE stamp centred on it exactly as s04 lands it
 * (the engine `Stamp`, rose, −9°, 72 px at the ghost's full 760 px width). A rectangular rose ink stamp,
 * never the CA's wax seal, and never on the real certificate. `at` is the frame the stamp lands
 * (Sequence-relative); not positioned.
 */
export function RevokeGhost({ width, frame, at, show = 1 }: { width: number; frame: number; at: number; show?: number }) {
  const k = width / CERT_CARD.w;
  const h = Math.round(CERT_CARD.h * k);
  return (
    <div style={{ position: 'relative', width, height: h, opacity: clamp01(show) }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: CERT_CARD.w, height: CERT_CARD.h, transform: `scale(${k})`, transformOrigin: '0 0' }}>
        <GhostCert />
        <div style={{ position: 'absolute', left: CERT_CARD.w / 2, top: CERT_CARD.h / 2, transform: 'translate(-50%, -50%)' }}>
          <Stamp frame={frame} at={at} accent="rose" rotate={-9} size={72}>
            REVOKE
          </Stamp>
        </div>
      </div>
    </div>
  );
}

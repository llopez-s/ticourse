import { C, FONT, alpha } from '../../../../../engine/src/theme/tokens';
import { clamp01, mix } from '../../../../../engine/src/ui';
import { KEY_LABEL, NAVES } from '../../../data/s04-key';
import { Nave, NaveKey, naveAnchors, naveSize } from '../Nave';
import { Padlock } from '../s03-scope/Hosts';

/**
 * s04-key's analogy: three port warehouses. The two Operaciones hosts are
 * padlocked (cyan); ADM-WS-02 — where the master keys live — is left open,
 * and one key (the service account) flies out of it. At «a todo» the third
 * door closes and locks too, and the key gets its own padlock (the account
 * contained). Coordinates are group-local (the scene positions and scales
 * the group); all states are 0–1 weights from the scene.
 */

export const NAVE_W = 360;
export const NAVE_X = [40, 440, 840] as const;
/** Where the flown key lands (group-local, ring at the top) and how tall it is there. */
export const KEY_LAND = { x: 1470, y: 70, size: 136 } as const;
export const HARBOR_H = naveSize(NAVE_W).height + 96;

export interface HarborState {
  /** 0–1 per nave: appears. */
  show: readonly number[];
  /** 0–1 per nave: padlock. */
  lock: readonly number[];
  /** 0–1: ADM-WS-02's door slides open. */
  open: number;
  /** 0–1: amber glow on the open nave (the key rack). */
  keysGlow: number;
  /** 0–1: the master key leaves the rack. */
  keyTaken: number;
  /** 0–1: the key's flight to KEY_LAND. */
  fly: number;
  /** 0–1: the key label («svc_tosreport · cuenta de servicio»). */
  keyLabel: number;
  /** 0–1: the key gets a padlock. */
  keyLock: number;
  /** 0–1: labels under the naves (fade them before shrinking the group). */
  labels: number;
}

export function Harbor({ s, frame }: { s: HarborState; frame: number }) {
  const size = naveSize(NAVE_W);
  const adm = NAVE_X[2];
  const anchor = naveAnchors(NAVE_W).key;
  const f = clamp01(s.fly);
  const start = { x: adm + anchor.x, y: anchor.y };
  const kx = mix(start.x, KEY_LAND.x, f);
  const ky = mix(start.y, KEY_LAND.y, f) - 90 * Math.sin(Math.PI * f);
  const kSize = mix(38 * (NAVE_W / 400), KEY_LAND.size, f);
  const showKey = s.keyTaken > 0.6 && f > 0;
  return (
    <div style={{ position: 'relative', width: 1728, height: HARBOR_H, fontFamily: FONT.sans }}>
      {NAVES.map((n, i) => (
        <div key={n.host} style={{ position: 'absolute', left: NAVE_X[i], top: 0 }}>
          <Nave
            width={NAVE_W}
            show={s.show[i]}
            lock={s.lock[i]}
            open={n.keys ? s.open : 0}
            contents={n.keys ? 'keys' : 'none'}
            keyTaken={n.keys ? s.keyTaken : 0}
            glow={n.keys ? s.keysGlow : s.lock[i] * 0.5}
            glowTone={n.keys ? 'amber' : 'cyan'}
            frame={frame}
          />
          {s.labels > 0.001 ? (
            <div
              style={{
                position: 'absolute',
                left: NAVE_W / 2,
                top: size.labelTop,
                transform: 'translateX(-50%)',
                textAlign: 'center',
                whiteSpace: 'nowrap',
                opacity: clamp01(s.labels) * clamp01(s.show[i]),
              }}
            >
              <div style={{ fontFamily: FONT.mono, fontSize: 38, fontWeight: 800, color: n.keys ? '#fcd34d' : C.textStrong, lineHeight: 1.15 }}>{n.host}</div>
              <div style={{ fontSize: 30, fontWeight: 650, color: n.keys ? C.amber : C.muted, lineHeight: 1.25 }}>{n.sub}</div>
            </div>
          ) : null}
        </div>
      ))}

      {showKey ? (
        <div style={{ position: 'absolute', left: kx, top: ky, transform: 'translate(-50%, -15%)' }}>
          <NaveKey size={kSize} glow={1} />
          {s.keyLock > 0.001 ? (
            <div style={{ position: 'absolute', left: kSize * 0.38, top: kSize * 0.4 }}>
              <Padlock size={kSize * 0.42} drop={s.keyLock} />
            </div>
          ) : null}
        </div>
      ) : null}

      {s.keyLabel > 0.001 ? (
        <div
          style={{
            position: 'absolute',
            left: KEY_LAND.x,
            top: KEY_LAND.y + KEY_LAND.size + 10,
            whiteSpace: 'nowrap',
            textAlign: 'center',
            opacity: clamp01(s.keyLabel) * clamp01(s.labels),
            transform: `translate(-50%, ${(1 - clamp01(s.keyLabel)) * 12}px)`,
          }}
        >
          <div style={{ fontFamily: FONT.mono, fontSize: 44, fontWeight: 800, color: '#fcd34d', lineHeight: 1.15, textShadow: `0 0 18px ${alpha(C.amber, 0.35)}` }}>{KEY_LABEL.account}</div>
          <div style={{ fontSize: 32, fontWeight: 650, color: C.text, lineHeight: 1.3 }}>{KEY_LABEL.role}</div>
        </div>
      ) : null}
    </div>
  );
}

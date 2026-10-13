import type { ReactNode } from 'react';
import { C, FONT, alpha } from '../../../../../engine/src/theme/tokens';
import { EXAM_TEXT, G, S03 } from '../../../data/s03-apreton';

const NET = 'HALDEN-OPS';

/** One part of the label; the network's name goes in mono. */
function Part({ text, lit }: { text: string; lit: number }) {
  const i = text.indexOf(NET);
  const body: ReactNode =
    i < 0 ? (
      text
    ) : (
      <>
        {text.slice(0, i)}
        <span style={{ fontFamily: FONT.mono, fontWeight: 700, fontSize: '0.94em', color: C.cyanSoft }}>{NET}</span>
        {text.slice(i + NET.length)}
      </>
    );
  return <span style={{ color: C.textStrong, opacity: 0.5 + 0.5 * lit }}>{body}</span>;
}

const Dot = () => <span style={{ color: C.faint, margin: '0 10px' }}>·</span>;

/**
 * The fixed lab label, top-left for the whole scene: «prueba autorizada · punto de acceso de pruebas ·
 * misma configuración que HALDEN-OPS · clave de prueba, corriente a propósito», and the protocol under
 * test beside it. While the voice reads it (`big` = 1) it is drawn 1.4× (≥ 36 px); then it steps back
 * to a strip. `lit[i]` brightens each part on its word. The protocol chip says «WPA2-PSK» in the first
 * half and «WPA3 personal», then «· SAE», in the second (`wpa3`, `sae` 0–1).
 */
export function LabStrip({ lit, big, wpa3, sae, protoLit }: { lit: readonly number[]; big: number; wpa3: number; sae: number; protoLit: number }) {
  const s = 1 + (G.strip.big - 1) * big;
  const f = G.strip.font;
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        display: 'flex',
        alignItems: 'stretch',
        gap: 16,
        transform: `scale(${s})`,
        transformOrigin: '0 0',
        fontFamily: FONT.sans,
        whiteSpace: 'nowrap',
      }}
    >
      <div
        style={{
          height: G.strip.h,
          boxSizing: 'border-box',
          padding: '5px 18px 0 16px',
          borderLeft: `5px solid ${C.cyan}`,
          borderRadius: 10,
          background: alpha(C.ink850, 0.92),
          boxShadow: `inset 0 0 0 2px ${alpha(C.cyan, 0.22)}`,
          fontSize: f,
          fontWeight: 680,
          lineHeight: `${Math.round(f * 1.24)}px`,
        }}
      >
        <div>
          <span style={{ color: C.cyanSoft, fontWeight: 800 }}>
            <Part text={S03.strip[0]} lit={lit[0]} />
          </span>
          <Dot />
          <Part text={S03.strip[1]} lit={lit[1]} />
        </div>
        <div>
          <Part text={S03.strip[2]} lit={lit[2]} />
          <Dot />
          <Part text={S03.strip[3]} lit={lit[3]} />
        </div>
      </div>
      {/* the protocol under test: an exam name, violet */}
      <div
        style={{
          position: 'relative',
          height: G.strip.h,
          boxSizing: 'border-box',
          display: 'flex',
          alignItems: 'center',
          padding: '0 20px',
          borderRadius: 14,
          border: `2px solid ${alpha(C.violet, 0.4 + 0.4 * protoLit)}`,
          background: alpha('#1a1033', 0.9),
          boxShadow: protoLit > 0.02 ? `0 0 ${Math.round(26 * protoLit)}px ${alpha(C.violet, 0.3 * protoLit)}` : undefined,
          fontSize: 32,
          fontWeight: 850,
          letterSpacing: 0.6,
          color: EXAM_TEXT,
          opacity: 0.6 + 0.4 * Math.max(protoLit, wpa3),
        }}
      >
        {wpa3 < 0.5 ? (
          <span style={{ opacity: 1 - 2 * wpa3 }}>{S03.protoWpa2}</span>
        ) : (
          <span style={{ opacity: 2 * wpa3 - 1 }}>
            {S03.protoWpa3}
            {sae > 0.001 ? (
              <span style={{ opacity: sae }}>
                <span style={{ color: alpha(EXAM_TEXT, 0.6), margin: '0 10px' }}>·</span>
                {S03.protoSae}
              </span>
            ) : null}
          </span>
        )}
      </div>
    </div>
  );
}

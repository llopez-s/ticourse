import { C, FONT, TYPE, alpha } from '../../../theme/tokens';
import { EASE, progress } from '../../../theme/motion';
import { Chip, Icon, Panel } from '../../../ui';
import { LOCAL_LOG } from '../../../data/s02-collect';
import { CARD, L } from './layout';
import { type S02Timing } from './timing';

/**
 * Closing beat, left half: the domain controller's own log slides out of the
 * Sistemas card, the intruder erases it and a rose label is left behind.
 */
export function LocalLog({ frame, T }: { frame: number; T: S02Timing }) {
  const show = progress(frame, T.wipeIn, 14);
  if (show <= 0) return null;
  const intruder = progress(frame, T.wipe - 14, 10);
  const erase = progress(frame, T.wipe, 24, EASE.inOut);
  const gone = progress(frame, T.wipe + 20, 12);
  const box = CARD.app;
  return (
    <div
      style={{
        position: 'absolute',
        left: L.srcX,
        top: box.y,
        width: L.srcW,
        height: box.h,
        opacity: show,
        transform: `translateY(${(1 - show) * -22}px)`,
      }}
    >
      <Panel accent="rose" glow={0.35 * erase} style={{ width: '100%', height: '100%' }}>
        <div style={{ position: 'absolute', left: 22, right: 18, top: 12, height: 48, display: 'flex', alignItems: 'center', gap: 14, whiteSpace: 'nowrap' }}>
          <Icon name="file" size={32} color={C.muted} />
          <span style={{ fontFamily: FONT.sans, fontSize: TYPE.label, fontWeight: 750, color: C.textStrong }}>registro local</span>
          <span style={{ fontFamily: FONT.mono, fontSize: TYPE.small, fontWeight: 650, color: C.cyanSoft }}>dc-01</span>
          <span style={{ fontFamily: FONT.sans, fontSize: TYPE.small, fontWeight: 550, color: C.muted }}>controlador de dominio</span>
        </div>
        {/* Log lines, erased left to right */}
        <div
          style={{
            position: 'absolute',
            left: 22,
            right: 22,
            top: 66,
            height: 70,
            clipPath: `inset(0 0 0 ${erase * 100}%)`,
          }}
        >
          {LOCAL_LOG.map((line, i) => (
            <div
              key={line.id}
              style={{ position: 'absolute', left: 0, top: i * 35, height: 34, display: 'flex', alignItems: 'center', gap: 18, whiteSpace: 'nowrap' }}
            >
              <span style={{ fontFamily: FONT.mono, fontSize: TYPE.small, fontWeight: 600, color: C.text }}>{line.time}</span>
              <span style={{ fontFamily: FONT.mono, fontSize: TYPE.small, fontWeight: 700, color: C.cyanSoft }}>{line.id}</span>
              <span style={{ fontFamily: FONT.sans, fontSize: TYPE.small, color: C.muted }}>{line.what}</span>
            </div>
          ))}
        </div>
        {erase > 0 && erase < 1 ? (
          <div
            style={{
              position: 'absolute',
              top: 62,
              height: 76,
              left: 22 + erase * (L.srcW - 44),
              width: 4,
              marginLeft: -2,
              background: C.rose,
              boxShadow: `0 0 18px ${alpha(C.rose, 0.8)}`,
            }}
          />
        ) : null}
        <div
          style={{
            position: 'absolute',
            left: 22,
            right: 22,
            top: 66,
            height: 70,
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            opacity: gone,
            transform: `translateY(${(1 - gone) * 8}px)`,
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              display: 'grid',
              placeItems: 'center',
              background: alpha(C.rose, 0.14),
              border: `2px solid ${alpha(C.rose, 0.7)}`,
            }}
          >
            <Icon name="x" size={28} color={C.rose} strokeWidth={2.6} />
          </div>
          <span style={{ fontFamily: FONT.sans, fontSize: TYPE.label, fontWeight: 750, color: C.roseSoft }}>registro local borrado</span>
        </div>
      </Panel>
      {/* The intruder, arriving from the open middle of the stage */}
      <div
        style={{
          position: 'absolute',
          left: L.srcW + 22,
          top: 36,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          opacity: intruder,
          transform: `translate(${(1 - intruder) * 24}px, -50%)`,
        }}
      >
        <Icon name="arrowRight" size={30} color={C.rose} strokeWidth={2.4} style={{ transform: 'rotate(180deg)' }} />
        <Chip accent="rose" icon="user" size={TYPE.label}>
          intruso
        </Chip>
      </div>
    </div>
  );
}

/**
 * Closing beat, middle: an emerald verdict pointing at the central copy.
 */
export function Survives({ frame, T }: { frame: number; T: S02Timing }) {
  const p = progress(frame, T.wipe + 48, 14);
  if (p <= 0) return null;
  const x = L.srcW + 36;
  const width = L.colX - x - 26;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: L.storeY + 58,
        width,
        opacity: p,
        transform: `translateX(${(1 - p) * -16}px)`,
      }}
    >
      <Panel accent="emerald" glow={0.5} style={{ width: '100%' }} bodyStyle={{ padding: '18px 22px', display: 'flex', gap: 16, alignItems: 'flex-start' }}>
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: 14,
            display: 'grid',
            placeItems: 'center',
            background: alpha(C.emerald, 0.14),
            border: `2px solid ${alpha(C.emerald, 0.6)}`,
            flexShrink: 0,
            marginTop: 4,
          }}
        >
          <Icon name="shield" size={30} color={C.emerald} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ fontFamily: FONT.sans, fontSize: 36, fontWeight: 800, color: C.emerald, lineHeight: 1.1 }}>
            la evidencia
            <br />
            sobrevive
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, whiteSpace: 'nowrap', marginTop: 6 }}>
            <span style={{ fontFamily: FONT.sans, fontSize: TYPE.small, fontWeight: 600, color: C.text }}>en la copia central</span>
            <Icon name="arrowRight" size={28} color={C.emerald} />
          </div>
        </div>
      </Panel>
    </div>
  );
}

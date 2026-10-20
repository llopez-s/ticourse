import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { Icon } from '../../../../../engine/src/ui';
import { CAUSE, NICK } from '../../../data/s02-pantallas';
import { TAG_PATH } from '../Graffiti';

/** Screen 1 after the change: the slogan against the cruise ships and a link to a statement. */
export function CauseMessage() {
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 34px', gap: 18, fontFamily: FONT.sans }}>
      <div style={{ lineHeight: 1.15, whiteSpace: 'nowrap' }}>
        <div style={{ fontSize: 42, fontWeight: 900, color: C.roseSoft }}>{CAUSE.lines[0]}</div>
        <div style={{ fontSize: 36, fontWeight: 800, color: C.textStrong }}>{CAUSE.lines[1]}</div>
      </div>
      <div
        style={{
          alignSelf: 'flex-start',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 12,
          height: 50,
          padding: '0 22px 0 16px',
          borderRadius: RADIUS.pill,
          border: `2px solid ${alpha(C.amber, 0.7)}`,
          background: alpha(C.amber, 0.1),
          fontSize: 30,
          fontWeight: 750,
          color: '#fde68a',
          whiteSpace: 'nowrap',
        }}
      >
        <Icon name="link" size={28} color={C.amber} />
        {CAUSE.link}
      </div>
    </div>
  );
}

/** Screen 2 after the change: a mote (an unreadable tag, never letters) and greetings to the forum. */
export function NickMessage() {
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18, fontFamily: FONT.sans }}>
      <svg width={420} height={110} viewBox="-10 -10 320 120" style={{ overflow: 'visible' }}>
        <path d={TAG_PATH} fill="none" stroke={C.roseSoft} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" style={{ filter: `drop-shadow(0 0 10px ${alpha(C.rose, 0.6)})` }} />
      </svg>
      <div style={{ fontSize: 38, fontWeight: 850, color: C.textStrong, whiteSpace: 'nowrap' }}>{NICK}</div>
    </div>
  );
}

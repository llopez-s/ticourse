import { C, FONT, alpha } from '../../../../engine/src/theme/tokens';
import { pulse } from '../../../../engine/src/theme/motion';
import { Icon } from '../../../../engine/src/ui';
import { RUN } from '../../data/s04-vuelve';
import { PageBody } from './Page';
import { CookieIcon, Person } from './Signs';
import { WebWindow } from './WebWindow';

/** Design size of the diagram (the scene scales it down when REFLECTED takes the right side). */
export const RUN_SIZE = { w: 1500, h: 440 } as const;

const WIN = { x: 360, y: 0, w: 540, h: 330 } as const;
const ROAD_Y = 252;
const EXT = { x: 1170, y: 147, w: 330, h: 210 } as const;
const COOKIE = { x0: 440, x1: 1250, size: 84 } as const;

/**
 * s04's picture: the server only returned text; the browser of the person who followed the link runs it
 * (`bolt`), and from that browser the session cookie «podría» leave for an outside site (`cookie` 0–1 along the
 * dashed road, drawn dashed and with the word «podría»: it is a possibility, not an event). `send` (0–1) carries the
 * page's text from the server to the browser; `person` shows who followed the link. Frames come from the scene as 0–1
 * weights; `frame` only drives the gentle pulse of the running script.
 */
export function RunDiagram({
  show,
  send,
  bolt,
  cookie,
  maybe,
  person,
  frame,
  fps = 30,
}: {
  show: number;
  send: number;
  bolt: number;
  cookie: number;
  maybe: number;
  person: number;
  frame: number;
  fps?: number;
}) {
  const hot = bolt * (0.75 + 0.25 * pulse(frame, fps, 0.8));
  const cookieX = COOKIE.x0 + (COOKIE.x1 - COOKIE.x0) * cookie;
  return (
    <div style={{ position: 'relative', width: RUN_SIZE.w, height: RUN_SIZE.h, opacity: show, fontFamily: FONT.sans }}>
      {/* the server */}
      <div style={{ position: 'absolute', left: 0, top: 70, width: 150, textAlign: 'center' }}>
        <Icon name="server" size={130} color={C.sky} strokeWidth={1.4} />
        <div style={{ marginTop: 6, fontSize: 36, fontWeight: 800, color: C.textStrong }}>{RUN.server}</div>
      </div>
      {/* the text it returns */}
      <div style={{ position: 'absolute', left: 170, top: 62, width: 170, textAlign: 'center', opacity: Math.min(1, send * 3) }}>
        <div style={{ fontSize: 36, fontWeight: 800, color: C.cyan }}>{RUN.text}</div>
        <div style={{ marginTop: 16, height: 4, background: `repeating-linear-gradient(90deg, ${alpha(C.cyan, 0.7)} 0 12px, transparent 12px 22px)` }} />
        <div style={{ position: 'absolute', left: 8 + send * 108, top: 56, width: 44, height: 52, borderRadius: 10, display: 'grid', placeItems: 'center', background: alpha(C.cyan, 0.2), border: `3px solid ${C.cyan}` }}>
          <Icon name="file" size={30} color={C.cyan} />
        </div>
      </div>

      {/* the browser of whoever followed the link */}
      <div style={{ position: 'absolute', left: WIN.x, top: WIN.y }}>
        <WebWindow width={WIN.w} height={WIN.h} title="Resultados de búsqueda" glow={0.9 * hot} accent="rose">
          <PageBody encoded={0} vitrina={0} lock={0} pad={30} />
          <div
            style={{
              position: 'absolute',
              left: 30,
              top: 96,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 12,
              height: 62,
              padding: '0 22px 0 16px',
              borderRadius: 14,
              background: alpha(C.rose, 0.12 + 0.18 * hot),
              border: `3px solid ${alpha(C.rose, 0.35 + 0.65 * hot)}`,
              boxShadow: hot > 0.02 ? `0 0 ${Math.round(30 * hot)}px ${alpha(C.rose, 0.45 * hot)}` : undefined,
              fontFamily: FONT.mono,
              fontSize: 34,
              fontWeight: 700,
              color: C.textStrong,
              opacity: 0.25 + 0.75 * bolt,
            }}
          >
            <Icon name="bolt" size={36} color={C.rose} strokeWidth={2.2} />
            {RUN.script}
          </div>
        </WebWindow>
      </div>
      <div style={{ position: 'absolute', left: WIN.x, top: WIN.h + 14, width: WIN.w, textAlign: 'center', fontSize: 38, fontWeight: 800, lineHeight: 1.18, color: C.textStrong }}>
        {RUN.browser[0]}
        <br />
        {RUN.browser[1]}
      </div>
      <div style={{ position: 'absolute', left: 262, top: 232, opacity: person }}>
        <Person size={96} tone={C.sky} />
      </div>

      {/* the road out, and the outside site: only a possibility */}
      <div style={{ position: 'absolute', left: 900, top: ROAD_Y - 2, width: EXT.x - 900, height: 4, background: `repeating-linear-gradient(90deg, ${alpha(C.rose, 0.7)} 0 12px, transparent 12px 22px)`, opacity: maybe }} />
      <div style={{ position: 'absolute', left: 900, top: ROAD_Y - 66, width: EXT.x - 900, textAlign: 'center', fontSize: 40, fontWeight: 850, fontStyle: 'italic', color: C.amber, opacity: maybe }}>{RUN.maybe}</div>
      <div
        style={{
          position: 'absolute',
          left: EXT.x,
          top: EXT.y,
          width: EXT.w,
          height: EXT.h,
          boxSizing: 'border-box',
          borderRadius: 22,
          border: `4px dashed ${alpha(C.rose, 0.75)}`,
          background: alpha(C.rose, 0.07),
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-end',
          paddingBottom: 20,
          gap: 8,
          opacity: maybe,
        }}
      >
        <Icon name="globe" size={72} color={C.roseSoft} strokeWidth={1.6} />
        <div style={{ fontSize: 38, fontWeight: 800, color: C.textStrong }}>{RUN.external}</div>
      </div>
      {/* the cookie */}
      <div style={{ position: 'absolute', left: cookieX - COOKIE.size / 2, top: ROAD_Y - COOKIE.size / 2, opacity: Math.min(1, 0.0 + bolt * 1.2) }}>
        <CookieIcon size={COOKIE.size} glow={0.8 * cookie} dashed={cookie > 0.02} />
      </div>
    </div>
  );
}

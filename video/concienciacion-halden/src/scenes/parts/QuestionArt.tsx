import type { CSSProperties, ReactNode } from 'react';
import { C, alpha } from '../../../../engine/src/theme/tokens';
import { Icon } from '../../../../engine/src/ui';

/**
 * Still, textless backgrounds of the three question scenes, drawn at full stage size (1728×660). The engine's panel
 * darkens them from the question segment on, so they are only a place: no name, no readable text, nothing of the port.
 * `react` 0–1 lets a resolution cue nudge one detail (a glow), never move anything.
 */
const W = 1728;
const H = 660;
const WIN = { x: 270, y: 48, w: 1188, h: 564 } as const;

function WindowFrame({ children, tone = C.sky }: { children?: ReactNode; tone?: string }) {
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: W, height: H }}>
      <div style={{ position: 'absolute', left: WIN.x, top: WIN.y, width: WIN.w, height: WIN.h, borderRadius: 22, background: C.ink900, border: `3px solid ${alpha(tone, 0.4)}`, overflow: 'hidden' }}>
        <div style={{ height: 52, background: C.ink850, borderBottom: `2px solid ${alpha(tone, 0.25)}`, display: 'flex', alignItems: 'center', gap: 10, padding: '0 20px' }}>
          {[C.rose, C.amber, C.emerald].map((c) => (
            <div key={c} style={{ width: 14, height: 14, borderRadius: 7, background: alpha(c, 0.55) }} />
          ))}
        </div>
        {children}
      </div>
    </div>
  );
}

const bar = (w: number, o = 0.22): CSSProperties => ({ width: w, height: 10, borderRadius: 5, background: alpha(C.muted, o) });

/** s03: a generic browser window — an address bar, an extension tile in the toolbar, a dialog with a warning, a page of sheets. */
export function BrowserArt({ react = 0, up = 0 }: { react?: number; up?: number }) {
  return (
    <WindowFrame>
      <div style={{ height: 64, display: 'flex', alignItems: 'center', gap: 16, padding: '0 22px', borderBottom: `2px solid ${alpha(C.sky, 0.18)}` }}>
        {[0, 1].map((k) => (
          <div key={k} style={{ width: 30, height: 30, borderRadius: 15, border: `3px solid ${alpha(C.muted, 0.4)}` }} />
        ))}
        <div style={{ flex: 1, height: 36, borderRadius: 18, background: alpha(C.muted, 0.12), border: `2px solid ${alpha(C.muted, 0.25)}` }} />
        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: 10,
            background: alpha(C.amber, 0.18 + 0.3 * react),
            border: `3px solid ${alpha(C.amber, 0.65 + 0.3 * react)}`,
            boxShadow: react > 0.02 ? `0 0 ${Math.round(26 * react)}px ${alpha(C.amber, 0.6 * react)}` : undefined,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon name="split" size={26} color={C.amber} />
        </div>
      </div>
      {/* the page: two stacked sheets of bars */}
      <div style={{ position: 'absolute', left: 56, top: 150, display: 'flex', gap: 40 }}>
        {[0, 1].map((k) => (
          <div key={k} style={{ width: 320, height: 380, borderRadius: 14, background: C.ink850, border: `2px solid ${alpha(C.cyan, 0.3)}`, padding: 28, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div style={{ ...bar(160, 0.45), height: 14 }} />
            {[0, 1, 2, 3, 4, 5, 6].map((r) => (
              <div key={r} style={bar(r % 3 === 2 ? 170 : 250)} />
            ))}
          </div>
        ))}
      </div>
      {/* the warning dialog */}
      <div style={{ position: 'absolute', left: 640, top: 190, width: 440, height: 250, borderRadius: 20, background: C.ink800, border: `3px solid ${alpha(C.amber, 0.7)}`, boxShadow: `0 20px 60px ${alpha('#000000', 0.5)}`, padding: 26, boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Icon name="alert" size={46} color={C.amber} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ ...bar(250, 0.5), height: 14 }} />
            <div style={bar(200)} />
          </div>
        </div>
        <div style={{ marginTop: 26, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={bar(360)} />
          <div style={bar(300)} />
        </div>
        <div style={{ position: 'absolute', right: 26, bottom: 24, display: 'flex', gap: 16 }}>
          <div style={{ width: 100, height: 40, borderRadius: 10, border: `2px solid ${alpha(C.muted, 0.4)}` }} />
          <div style={{ width: 100, height: 40, borderRadius: 10, background: alpha(C.amber, 0.25), border: `2px solid ${alpha(C.amber, 0.8)}` }} />
        </div>
      </div>
      {/* a sheet leaving the window to the right */}
      <div style={{ position: 'absolute', left: 1040 + up * 90, top: 470, opacity: up, transform: `scale(${0.8 + 0.2 * up})` }}>
        <Icon name="file" size={56} color={C.cyan} />
      </div>
    </WindowFrame>
  );
}

/** s05: a generic mailbox — folders, a list of messages as bars, a reading pane, and an EMPTY dashed slot in the toolbar. */
export function MailboxArt({ react = 0 }: { react?: number }) {
  return (
    <WindowFrame>
      <div style={{ height: 64, display: 'flex', alignItems: 'center', gap: 16, padding: '0 22px', borderBottom: `2px solid ${alpha(C.sky, 0.18)}` }}>
        {[0, 1, 2].map((k) => (
          <div key={k} style={{ width: 40, height: 40, borderRadius: 10, border: `3px solid ${alpha(C.muted, 0.35)}` }} />
        ))}
        {/* the empty slot where a button could be */}
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 11,
            border: `3px ${react > 0.5 ? 'solid' : 'dashed'} ${react > 0.02 ? alpha(C.cyan, 0.5 + 0.5 * react) : alpha(C.muted, 0.5)}`,
            background: alpha(C.cyan, 0.2 * react),
            boxShadow: react > 0.02 ? `0 0 ${Math.round(26 * react)}px ${alpha(C.cyan, 0.5 * react)}` : undefined,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {react > 0.02 ? <Icon name="bell" size={26} color={C.cyan} /> : null}
        </div>
      </div>
      <div style={{ position: 'absolute', left: 0, top: 116, width: 190, bottom: 0, borderRight: `2px solid ${alpha(C.sky, 0.18)}`, padding: '26px 24px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 22 }}>
        {[120, 90, 110, 80].map((w, k) => (
          <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Icon name="mail" size={24} color={alpha(C.muted, 0.5)} />
            <div style={bar(w)} />
          </div>
        ))}
      </div>
      <div style={{ position: 'absolute', left: 190, top: 116, width: 470, bottom: 0, borderRight: `2px solid ${alpha(C.sky, 0.18)}`, padding: '18px 22px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {[0, 1, 2, 3, 4, 5, 6].map((k) => (
          <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 14, height: 56, padding: '0 14px', borderRadius: 12, background: k === 2 ? alpha(C.sky, 0.1) : 'transparent', border: k === 2 ? `2px solid ${alpha(C.sky, 0.35)}` : '2px solid transparent' }}>
            <div style={{ width: 14, height: 14, borderRadius: 7, background: alpha(k < 3 ? C.cyan : C.muted, 0.5) }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ ...bar(k % 2 ? 200 : 260, 0.4), height: 12 }} />
              <div style={bar(k % 2 ? 300 : 230, 0.2)} />
            </div>
          </div>
        ))}
      </div>
      <div style={{ position: 'absolute', left: 660, top: 116, right: 0, bottom: 0, padding: '34px 44px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ ...bar(300, 0.5), height: 16 }} />
        <div style={bar(220)} />
        <div style={{ height: 14 }} />
        {[420, 400, 430, 300, 410, 260].map((w, k) => (
          <div key={k} style={bar(w)} />
        ))}
      </div>
    </WindowFrame>
  );
}

/** s07: a desk seen from above with three generic invoices (a header bar, rows of bars, a total box) and a pen. */
export function DeskArt({ react = 0 }: { react?: number }) {
  const sheet = (x: number, y: number, rot: number, k: number) => (
    <div
      key={k}
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: 360,
        height: 470,
        borderRadius: 14,
        background: C.ink850,
        border: `2px solid ${alpha(C.sky, 0.35)}`,
        transform: `rotate(${rot}deg)`,
        padding: 30,
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        gap: 18,
        boxShadow: `0 16px 40px ${alpha('#000000', 0.4)}`,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ ...bar(120, 0.5), height: 16 }} />
        <Icon name="file" size={30} color={alpha(C.sky, 0.6)} />
      </div>
      <div style={{ height: 6 }} />
      {[0, 1, 2, 3, 4].map((r) => (
        <div key={r} style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div style={bar(r % 2 ? 150 : 190)} />
          <div style={bar(60)} />
        </div>
      ))}
      <div style={{ marginTop: 'auto', alignSelf: 'flex-end', width: 130, height: 44, borderRadius: 10, border: `3px solid ${alpha(C.amber, 0.4 + 0.5 * react)}`, background: alpha(C.amber, 0.08 + 0.15 * react) }} />
    </div>
  );
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: W, height: H }}>
      <div style={{ position: 'absolute', left: 60, top: 40, width: W - 120, height: H - 80, borderRadius: 30, background: alpha(C.ink850, 0.8), border: `2px solid ${alpha(C.ink500, 0.5)}` }} />
      {sheet(350, 70, -6, 0)}
      {sheet(690, 62, 1, 1)}
      {sheet(1030, 78, 7, 2)}
      <div style={{ position: 'absolute', left: 1480, top: 140, width: 14, height: 360, borderRadius: 7, background: alpha(C.muted, 0.4), transform: 'rotate(14deg)' }} />
    </div>
  );
}

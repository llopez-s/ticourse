import type { CSSProperties, ReactNode } from 'react';
import { C, FONT, alpha } from '../../../../engine/src/theme/tokens';
import { Icon } from '../../../../engine/src/ui';
import { clamp01 } from '../../../../engine/src/ui';
import { SCRIPT, SCRIPT_ENCODED } from '../../data/echo';

/**
 * The glass case of s05 (the display case, «vitrina»): a frame with a sheen and a plinth around whatever is in it.
 * `w` (0–1) draws the glass in and sweeps the sheen once; `lock` (0–1) shows the small lock. It exists from `w` > 0
 * only: nothing about it is on screen before its cue.
 */
export function Vitrina({ w, lock = 0, children, pad = 22, style }: { w: number; lock?: number; children: ReactNode; pad?: number; style?: CSSProperties }) {
  const k = clamp01(w);
  return (
    <div style={{ position: 'relative', display: 'inline-block', padding: pad, ...style }}>
      <div style={{ opacity: 1 - 0.25 * k }}>{children}</div>
      {k > 0.01 ? (
        <>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: 18,
              border: `4px solid ${alpha('#e2e8f0', 0.75 * k)}`,
              background: `linear-gradient(180deg, ${alpha('#e2e8f0', 0.1 * k)} 0%, ${alpha('#94a3b8', 0.06 * k)} 100%)`,
              boxShadow: `0 0 ${Math.round(30 * k)}px ${alpha(C.cyan, 0.22 * k)}, inset 0 0 40px ${alpha('#ffffff', 0.05 * k)}`,
              overflow: 'hidden',
              transform: `scale(${1.06 - 0.06 * k})`,
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: -20,
                bottom: -20,
                width: 90,
                left: `${-20 + 140 * k}%`,
                background: `linear-gradient(100deg, transparent 0%, ${alpha('#ffffff', 0.22)} 50%, transparent 100%)`,
                transform: 'skewX(-18deg)',
              }}
            />
          </div>
          {/* plinth */}
          <div style={{ position: 'absolute', left: -14, right: -14, bottom: -18, height: 16, borderRadius: 6, background: alpha('#94a3b8', 0.5 * k), border: `2px solid ${alpha('#e2e8f0', 0.5 * k)}` }} />
          {lock > 0.01 ? (
            <div style={{ position: 'absolute', right: -22, top: -22, width: 56, height: 56, borderRadius: 28, display: 'grid', placeItems: 'center', background: C.ink900, border: `3px solid ${C.emerald}`, opacity: lock, transform: `scale(${0.7 + 0.3 * lock})` }}>
              <Icon name="lock" size={30} color={C.emerald} strokeWidth={2.4} />
            </div>
          ) : null}
        </>
      ) : null}
    </div>
  );
}

/**
 * The search results page of the test copy: «Resultados para:» and, once encoded, the text itself on view (cyan mono).
 * Before it is encoded the browser would run the text, so the page shows nothing after the colon.
 * Body-local layout for a WebWindow of any width.
 */
export function PageBody({ encoded, vitrina, lock, pad = 34, caption, captionW = 0 }: { encoded: number; vitrina: number; lock: number; pad?: number; caption?: string; captionW?: number }) {
  return (
    <div style={{ position: 'absolute', left: pad, top: 24, right: pad, fontFamily: FONT.sans }}>
      <div style={{ fontSize: 44, fontWeight: 800, color: C.textStrong, lineHeight: 1.1, whiteSpace: 'nowrap' }}>Resultados para:</div>
      {encoded > 0.01 ? (
        <div style={{ marginTop: 22, opacity: encoded, transform: `translateY(${(1 - encoded) * 10}px)` }}>
          <Vitrina w={vitrina} lock={lock} pad={20}>
            <span style={{ fontFamily: FONT.mono, fontSize: 32, fontWeight: 650, color: C.cyan, whiteSpace: 'pre' }}>{SCRIPT}</span>
          </Vitrina>
        </div>
      ) : null}
      {caption ? (
        <div style={{ marginTop: 40, fontSize: 38, fontWeight: 800, color: C.emerald, opacity: captionW, transform: `translateY(${(1 - captionW) * 8}px)`, whiteSpace: 'nowrap' }}>{caption}</div>
      ) : null}
    </div>
  );
}

/**
 * The page's source («código de la página»): `<p>Resultados para:`, the text exactly as typed (cyan: it is the
 * person's, untouched) and `</p>`. Encoded, the line carries `&lt;`/`&gt;` where the angle brackets were (emerald:
 * what the server changed). `lit` (0–1) lights the text line.
 */
export function SourceView({ width, encoded = 0, lit = 0, style }: { width: number; encoded?: number; lit?: number; style?: CSSProperties }) {
  const e = clamp01(encoded);
  const line: CSSProperties = { height: 46, display: 'flex', alignItems: 'center', whiteSpace: 'pre' };
  const entity = (t: string) => (
    <span style={{ color: C.emerald, background: alpha(C.emerald, 0.14), borderRadius: 4 }}>{t}</span>
  );
  return (
    <div
      style={{
        width,
        borderRadius: 18,
        overflow: 'hidden',
        background: C.ink950,
        border: `2px solid ${lit > 0 ? alpha(e > 0.5 ? C.emerald : C.cyan, 0.35 + 0.5 * lit) : C.ink700}`,
        boxShadow: lit > 0.02 ? `0 0 ${Math.round(34 * lit)}px ${alpha(e > 0.5 ? C.emerald : C.cyan, 0.25 * lit)}` : undefined,
        fontFamily: FONT.mono,
        fontSize: 32,
        color: C.textStrong,
        ...style,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, height: 54, padding: '0 22px', background: alpha(C.ink800, 0.95), borderBottom: `2px solid ${C.ink700}`, fontFamily: FONT.sans, fontSize: 30, fontWeight: 650, color: C.muted }}>
        <Icon name="terminal" size={28} color={C.muted} />
        código de la página
      </div>
      <div style={{ padding: '14px 22px 18px' }}>
        <div style={line}>{'<p>Resultados para:'}</div>
        <div style={{ ...line, paddingLeft: 38 }}>
          {e < 0.5 ? (
            <span style={{ color: C.cyan }}>{SCRIPT}</span>
          ) : (
            <span style={{ color: C.cyan }}>
              {entity('&lt;')}
              {'script'}
              {entity('&gt;')}
              {'enviar(document.cookie)'}
              {entity('&lt;')}
              {'/script'}
              {entity('&gt;')}
            </span>
          )}
        </div>
        <div style={line}>{'</p>'}</div>
      </div>
    </div>
  );
}

export { SCRIPT_ENCODED };

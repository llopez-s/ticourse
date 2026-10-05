import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { Icon, Redacted, clamp01 } from '../../../../../engine/src/ui';
import { FLOW, FLOW_ROWS } from '../../../data/s05-amp';

export const FLOW_W = 900;
export const FLOW_H = 556;

const HEAD_H = 72;
const SUB_H = 62;
const COLS_H = 42;
const ROW_H = 58;
const TEX_H = 34;
const PAD_X = 30;
const SIZE = 36;
const CH = 0.6 * SIZE;
/** Column x: proto, separator, IP (right-aligned in a 14-character box), `:53`. */
const X_PROTO = PAD_X;
const X_IP = PAD_X + 6 * CH;
const IP_W = 14 * CH;
const X_PORT = X_IP + IP_W;
const PORT_W = 3 * CH;
const ROWS_Y = HEAD_H + SUB_H + COLS_H;
const TEX_ROWS = 3;

/**
 * NetFlow inbound to `hpa-portal-web-01`, 05:40–06:05. Four readable rows (the canon resolvers, all
 * `UDP · …:53`), then texture rows with the address drawn as a bar (no digits) and «…». `rows` (0–1)
 * staggers the rows in, `time` lights the window, `host` the portal, `port` the source-port column.
 */
export function NetFlowPanel({ open, rows, time, host, port }: { open: number; rows: number; time: number; host: number; port: number }) {
  const total = FLOW_ROWS.length + TEX_ROWS;
  const rowIn = (i: number) => clamp01(rows * (total + 2) - i);
  const bandH = FLOW_ROWS.length * ROW_H + TEX_ROWS * TEX_H + 8;
  return (
    <div
      style={{
        position: 'relative',
        width: FLOW_W,
        height: FLOW_H,
        boxSizing: 'border-box',
        borderRadius: RADIUS.lg,
        border: `2px solid ${alpha(C.cyan, 0.3)}`,
        background: `linear-gradient(180deg, ${C.ink850} 0%, ${C.ink900} 100%)`,
        boxShadow: `0 26px 60px ${alpha('#000000', 0.4)}`,
        overflow: 'hidden',
        fontFamily: FONT.sans,
        opacity: open,
        transform: `translateY(${(1 - open) * 18}px)`,
      }}
    >
      {/* Title bar */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          height: HEAD_H,
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          padding: `0 ${PAD_X}px`,
          background: alpha(C.ink800, 0.95),
          borderBottom: `2px solid ${C.ink700}`,
          whiteSpace: 'nowrap',
        }}
      >
        <Icon name="network" size={36} color={C.cyan} />
        <span style={{ fontSize: 30, fontWeight: 650, color: C.muted }}>{FLOW.title}</span>
        <span
          style={{
            fontFamily: FONT.mono,
            fontSize: 32,
            fontWeight: 800,
            color: C.cyanSoft,
            padding: '0 8px',
            borderRadius: 8,
            background: alpha(C.cyan, 0.16 * host),
            boxShadow: host > 0 ? `0 0 0 2px ${alpha(C.cyan, 0.8 * host)}` : undefined,
          }}
        >
          {FLOW.host}
        </span>
      </div>

      {/* The window */}
      <div style={{ position: 'absolute', left: PAD_X, top: HEAD_H + 12, height: SUB_H - 18, display: 'flex', alignItems: 'center', gap: 14 }}>
        <Icon name="clock" size={32} color={time > 0.5 ? C.amber : C.muted} />
        <span
          style={{
            fontFamily: FONT.mono,
            fontSize: 34,
            fontWeight: 800,
            color: time > 0.5 ? '#fde68a' : C.text,
            padding: '2px 12px',
            borderRadius: 10,
            background: alpha(C.amber, 0.16 * time),
            boxShadow: time > 0 ? `0 0 0 2px ${alpha(C.amber, 0.85 * time)}` : `0 0 0 2px ${C.ink700}`,
          }}
        >
          {FLOW.window}
        </span>
      </div>

      {/* Column headers */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: HEAD_H + SUB_H, height: COLS_H, borderTop: `2px solid ${C.ink700}`, borderBottom: `2px solid ${C.ink700}`, fontSize: 24, fontWeight: 700, color: C.faint, letterSpacing: 1 }}>
        <span style={{ position: 'absolute', left: X_PROTO, top: 6 }}>{FLOW.cols.proto}</span>
        <span style={{ position: 'absolute', left: X_IP + IP_W / 2 - 40, top: 6 }}>{FLOW.cols.src}</span>
        <span style={{ position: 'absolute', left: X_PORT + 2, top: 6, color: port > 0.5 ? C.roseSoft : C.faint }}>{FLOW.cols.port}</span>
      </div>

      {/* The source-port column, lit */}
      {port > 0 ? (
        <div
          style={{
            position: 'absolute',
            left: X_PORT - 8,
            top: ROWS_Y + 4,
            width: PORT_W + 16,
            height: bandH,
            borderRadius: 12,
            background: alpha(C.rose, 0.14 * port),
            boxShadow: `0 0 0 2px ${alpha(C.rose, 0.8 * port)}, 0 0 24px ${alpha(C.rose, 0.25 * port)}`,
          }}
        />
      ) : null}

      {/* Readable rows */}
      {FLOW_ROWS.map((r, i) => {
        const p = rowIn(i);
        if (p <= 0) return null;
        const y = ROWS_Y + 4 + i * ROW_H;
        return (
          <div key={r.ip} style={{ position: 'absolute', left: 0, top: y, height: ROW_H, width: FLOW_W, fontFamily: FONT.mono, fontSize: SIZE, fontWeight: 600, whiteSpace: 'pre', opacity: p, transform: `translateX(${(1 - p) * 14}px)` }}>
            <span style={{ position: 'absolute', left: X_PROTO, top: 8, color: C.muted }}>{r.proto}</span>
            <span style={{ position: 'absolute', left: X_PROTO + 3 * CH, top: 8, color: C.faint }}>{' · '}</span>
            <span style={{ position: 'absolute', left: X_IP, top: 8, width: IP_W, textAlign: 'right', color: C.roseSoft }}>{r.ip}</span>
            <span style={{ position: 'absolute', left: X_PORT, top: 8, color: port > 0.5 ? '#fecdd3' : C.text, fontWeight: port > 0.5 ? 800 : 600 }}>{`:${r.port}`}</span>
          </div>
        );
      })}

      {/* Texture rows: the address is a bar, never digits */}
      {Array.from({ length: TEX_ROWS }, (_, k) => {
        const p = rowIn(FLOW_ROWS.length + k);
        if (p <= 0) return null;
        const y = ROWS_Y + 4 + FLOW_ROWS.length * ROW_H + k * TEX_H;
        const barW = [196, 238, 214][k];
        return (
          <div key={k} style={{ position: 'absolute', left: 0, top: y, height: TEX_H, width: FLOW_W, fontFamily: FONT.mono, fontSize: 26, whiteSpace: 'pre', opacity: p * (0.5 - 0.1 * k), filter: 'blur(1.2px)' }}>
            <span style={{ position: 'absolute', left: X_PROTO, top: 4, color: C.faint }}>UDP</span>
            <span style={{ position: 'absolute', left: X_IP + IP_W - barW, top: 10 }}>
              <Redacted width={barW} height={20} tone="rose" strength={0.45} />
            </span>
            <span style={{ position: 'absolute', left: X_PORT, top: 4, color: C.faint }}>:53</span>
          </div>
        );
      })}
      {rowIn(total) > 0 ? (
        <div style={{ position: 'absolute', left: X_IP + IP_W / 2 - 30, top: ROWS_Y + 4 + FLOW_ROWS.length * ROW_H + TEX_ROWS * TEX_H, fontSize: 40, fontWeight: 800, color: C.faint, opacity: rowIn(total) * 0.7, letterSpacing: 4 }}>
          ...
        </div>
      ) : null}
    </div>
  );
}

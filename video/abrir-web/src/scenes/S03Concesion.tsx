import type { ReactNode } from 'react';
import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../engine/src/theme/motion';
import { Icon, dimStyle, type IconName } from '../../../engine/src/ui';
import { Stage } from './kit';
import { BookImage } from './parts/Images';
import { NET } from './parts/data';
import { Ribbon, ribbonLit } from './parts/Ribbon';
import { ImaginaSeal } from './parts/Seal';

const CARD = { left: 560, top: 96, w: 1168, h: 252 } as const;
const TRACK = { x: 34, w: CARD.w - 68, y: 132, h: 46 } as const;
const MINI = { top: 372, w: 372, h: 226, gap: 26 } as const;

const chip = (text: string, accent: string, show: number): ReactNode => (
  <span
    style={{
      opacity: show,
      transform: `translateY(${(1 - show) * 10}px)`,
      padding: '4px 20px',
      borderRadius: RADIUS.pill,
      border: `2px solid ${alpha(accent, 0.65)}`,
      background: alpha(accent, 0.1),
      fontFamily: FONT.sans,
      fontSize: 32,
      fontWeight: 700,
      color: accent === C.emerald ? '#6ee7b7' : C.cyanSoft,
      whiteSpace: 'nowrap',
    }}
  >
    {text}
  </span>
);

/** One of the three closing mini-scenes: «concesión OK» (drawn tick) over a little chain that is cut or whole. */
function MiniCase({ show, nodes, cutAt, ok, text, tone }: { show: number; nodes: IconName[]; cutAt: number | null; ok: boolean; text: string; tone: string }) {
  if (show <= 0) return null;
  const nodeSize = 66;
  const step = (MINI.w - 2 * 34 - nodeSize) / (nodes.length - 1);
  return (
    <div
      style={{
        width: MINI.w,
        height: MINI.h,
        boxSizing: 'border-box',
        borderRadius: RADIUS.lg,
        border: `3px solid ${alpha(tone, 0.6)}`,
        background: `linear-gradient(180deg, ${C.ink850} 0%, ${C.ink900} 100%)`,
        padding: '18px 24px',
        fontFamily: FONT.sans,
        opacity: show,
        transform: `translateY(${(1 - show) * 22}px)`,
        boxShadow: `0 20px 44px ${alpha('#000000', 0.38)}`,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ width: 40, height: 40, borderRadius: '50%', background: alpha(C.emerald, 0.18), border: `2px solid ${C.emerald}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="check" size={26} color={C.emerald} strokeWidth={3.2} />
        </span>
        <span style={{ fontSize: 32, fontWeight: 800, color: C.textStrong }}>concesión OK</span>
      </div>
      <div style={{ position: 'relative', height: 90, marginTop: 14 }}>
        <svg width={MINI.w - 48} height={90} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
          {nodes.slice(0, -1).map((_, i) => {
            const x1 = 10 + nodeSize + i * step - 4;
            const x2 = 10 + (i + 1) * step + 4;
            const cut = cutAt === i;
            return (
              <g key={i}>
                <line x1={x1} y1={45} x2={x2} y2={45} stroke={cut ? alpha(C.rose, 0.8) : alpha(C.emerald, 0.8)} strokeWidth={4} strokeDasharray={cut ? '6 8' : undefined} strokeLinecap="round" />
                {cut ? (
                  <g stroke={C.rose} strokeWidth={6} strokeLinecap="round">
                    <path d={`M ${(x1 + x2) / 2 - 12} 33 L ${(x1 + x2) / 2 + 12} 57 M ${(x1 + x2) / 2 + 12} 33 L ${(x1 + x2) / 2 - 12} 57`} />
                  </g>
                ) : null}
              </g>
            );
          })}
        </svg>
        {nodes.map((n, i) => (
          <div key={i} style={{ position: 'absolute', left: 10 + i * step, top: 45 - nodeSize / 2 }}>
            <Icon name={n} size={nodeSize} color={ok || (cutAt !== null && i <= cutAt) ? C.cyan : C.muted} strokeWidth={1.5} />
          </div>
        ))}
      </div>
      <div style={{ marginTop: 6, fontSize: 32, fontWeight: 800, color: tone === C.emerald ? '#6ee7b7' : '#fcd34d' }}>{text}</div>
    </div>
  );
}

/**
 * s03-concesion «Con fecha de devolución».
 *   book      the library book with its slip «devolver antes de…» (labelled «imagen · no es del puerto»);
 *             the voice never says «préstamo» (V6's word for just-in-time access).
 *   lease     the lease card: «concesión · 8 h» and a time bar from 8:58 to 16:58 that runs fast to the middle.
 *   renew     the mark «12:58 · renueva»; the bar fills again (emerald, «renovada», same address). The renewal's
 *             DHCPACK is a whole new lease from that moment, so the end labels become 12:58 → 20:58.
 *   wrap      the card goes still; «al conectarte» / «al renovar» label the two moments DHCP works.
 *   no-dns / no-exit / each   three mini-scenes: a perfect lease and a piece that fails each in its own way.
 */
export function S03Concesion(props: SceneProps) {
  const frame = useCurrentFrame();
  const book = props.cue('book');
  const lease = props.cue('lease');
  const renew = props.cue('renew');
  const wrap = props.cue('wrap');
  const noDns = props.cue('no-dns');
  const noExit = props.cue('no-exit');
  const each = props.cue('each');

  const bookIn = progress(frame, book - 4, 20);
  const slipIn = progress(frame, book + 14, 18);
  const cardIn = progress(frame, lease - 18, 18);

  // The bar: cyan fill 0 → 0.5 (fast), then a fresh emerald run 0 → 0.5 after the renewal.
  const run1 = progress(frame, lease + 34, 62, EASE.inOut);
  const sweepBack = progress(frame, renew + 14, 12, EASE.inOut);
  const run2 = progress(frame, renew + 34, 46, EASE.inOut);
  const renewed = frame >= renew + 26;
  const fill = frame < renew + 14 ? 0.5 * run1 : frame < renew + 34 ? 0.5 * (1 - sweepBack) : 0.5 * run2;
  const mark = progress(frame, renew - 6, 14);
  const newLease = sweepBack;
  const renewedLabel = progress(frame, renew + 64, 12);
  const sameAddr = progress(frame, renew + 76, 14);
  const wrapIn = progress(frame, wrap, 14);

  const late = progress(frame, noDns - 20, 20, EASE.inOut);
  const mini = [progress(frame, noDns, 18), progress(frame, noExit, 18), progress(frame, each, 18)];

  const cardTop = CARD.top;
  return (
    <Stage>
      <Ribbon lit={ribbonLit(frame, {}, ['DHCP'])} />

      <div style={{ position: 'absolute', left: 20, top: 104, ...dimStyle(0.6 * late) }}>
        <BookImage width={420} show={bookIn} slip={slipIn} />
      </div>

      {/* the lease card */}
      <div
        style={{
          position: 'absolute',
          left: CARD.left,
          top: cardTop,
          width: CARD.w,
          height: CARD.h,
          boxSizing: 'border-box',
          borderRadius: RADIUS.lg,
          border: `3px solid ${alpha(C.cyan, 0.5)}`,
          background: `linear-gradient(180deg, ${C.ink850} 0%, ${C.ink900} 100%)`,
          boxShadow: `0 24px 60px ${alpha('#000000', 0.4)}`,
          opacity: cardIn,
          transform: `translateY(${(1 - cardIn) * 18}px)`,
          fontFamily: FONT.sans,
        }}
      >
        <div style={{ position: 'absolute', left: 34, top: 14, display: 'flex', alignItems: 'center', gap: 16 }}>
          <Icon name="clock" size={44} color={C.cyan} />
          <span style={{ fontSize: 44, fontWeight: 850, color: C.textStrong }}>
            concesión · <span style={{ color: C.cyanSoft }}>{NET.leaseHours} h</span>
          </span>
        </div>
        {/* times above the track */}
        {/* after the renewal the DHCPACK gives a whole new lease from that moment: 12:58 → 20:58 */}
        <div style={{ position: 'absolute', left: TRACK.x, top: 82, fontFamily: FONT.mono, fontSize: 38, fontWeight: 700, color: C.text, opacity: 1 - newLease }}>{NET.leaseFrom}</div>
        <div style={{ position: 'absolute', right: TRACK.x, top: 82, fontFamily: FONT.mono, fontSize: 38, fontWeight: 700, color: C.text, opacity: 1 - newLease }}>{NET.leaseTo}</div>
        {newLease > 0.01 ? (
          <>
            <div style={{ position: 'absolute', left: TRACK.x, top: 82, fontFamily: FONT.mono, fontSize: 38, fontWeight: 700, color: '#6ee7b7', opacity: newLease }}>{NET.renewAt}</div>
            <div style={{ position: 'absolute', right: TRACK.x, top: 82, fontFamily: FONT.mono, fontSize: 38, fontWeight: 700, color: '#6ee7b7', opacity: newLease }}>{NET.renewedTo}</div>
          </>
        ) : null}
        <div
          style={{
            position: 'absolute',
            left: TRACK.x + TRACK.w / 2,
            top: 82,
            transform: `translateX(-50%) translateY(${(1 - mark) * 8}px)`,
            opacity: mark * (1 - newLease),
            fontFamily: FONT.mono,
            fontSize: 38,
            fontWeight: 700,
            color: '#fcd34d',
            whiteSpace: 'nowrap',
          }}
        >
          {NET.renewAt} · renueva
        </div>
        {/* the track */}
        <div style={{ position: 'absolute', left: TRACK.x, top: TRACK.y, width: TRACK.w, height: TRACK.h, borderRadius: TRACK.h / 2, background: C.ink950, border: `3px solid ${C.ink600}`, overflow: 'hidden', boxSizing: 'border-box' }}>
          <div
            style={{
              width: `${fill * 100}%`,
              height: '100%',
              background: renewed ? alpha(C.emerald, 0.85) : alpha(C.cyan, 0.85),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              paddingRight: 18,
              fontSize: 28,
              fontWeight: 800,
              color: C.ink950,
              whiteSpace: 'nowrap',
            }}
          >
            {renewedLabel > 0 && fill >= 0.49 ? <span style={{ opacity: renewedLabel }}>renovada</span> : null}
          </div>
        </div>
        {/* the middle tick */}
        <div style={{ position: 'absolute', left: TRACK.x + TRACK.w / 2 - 2, top: TRACK.y - 8, width: 4, height: TRACK.h + 16, background: alpha('#fcd34d', mark), borderRadius: 2 }} />
        {/* below the track */}
        <div style={{ position: 'absolute', left: TRACK.x, top: TRACK.y + TRACK.h + 14 }}>{chip('al conectarte', C.cyan, wrapIn)}</div>
        <div style={{ position: 'absolute', left: TRACK.x + TRACK.w / 2, top: TRACK.y + TRACK.h + 14, transform: 'translateX(-50%)' }}>{chip('al renovar', C.cyan, wrapIn)}</div>
        <div style={{ position: 'absolute', left: TRACK.x + TRACK.w / 2 + 170, top: TRACK.y + TRACK.h + 14 }}>{chip('misma dirección', C.emerald, sameAddr)}</div>
      </div>

      {/* the three mini-scenes */}
      <div style={{ position: 'absolute', left: CARD.left, top: MINI.top, display: 'flex', gap: MINI.gap }}>
        <MiniCase show={mini[0]} nodes={['laptop', 'search']} cutAt={0} ok={false} text="resolutor no contesta" tone={C.amber} />
        <MiniCase show={mini[1]} nodes={['laptop', 'router', 'cloud']} cutAt={1} ok={false} text="gateway sin salida" tone={C.amber} />
        <MiniCase show={mini[2]} nodes={['laptop', 'router', 'cloud']} cutAt={null} ok text="todo bien" tone={C.emerald} />
      </div>

      <ImaginaSeal />
    </Stage>
  );
}

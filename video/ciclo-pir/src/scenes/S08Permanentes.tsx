import type { ReactNode } from 'react';
import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { Icon } from '../../../engine/src/ui';
import { S08_ADHOC, S08_CALLBACK, S08_STANDING, S08_TABLE } from '../data/s08-permanentes';
import { FeedChips } from './parts/Feeds';
import { Tag } from './parts/StationLine';
import { Stage, wordFrame } from './kit';

const S = 's08-permanentes';
const W = STAGE.width;

// The table of the Collection Management Framework.
const TBL = { x: 0, y: 118, w: 1040, head: 64, row: 88, pir: 220, q: 520 } as const;
const FEEDS = { x: 1130, y: TBL.y + TBL.head, cols: 3, w: 190, h: 72, gap: 16 } as const;
const USED = [0, 3, 6] as const;

/**
 * s08-permanentes «El pedido fijo y el banquete». On `standing` the weekly order of the restaurant: «¿Qué actores
 * apuntan a nuestro sector?» under the label «standing requirement», with a clock sweeping («se revisa cada
 * cierto tiempo»). On `adhoc` the banquet: «una fusión · un incidente · una tecnología nueva», a countdown ring
 * that runs out and switches off when the order is answered, «ad hoc requirement · expira al responderse». On
 * `collection` both step aside and a PIR splits into smaller collection questions, each tied to a generic
 * source («fuente A», «fuente B», «fuente C»); on `framework` the table gets its name, «Collection Management
 * Framework», and under it, small, «lo construirás en la sección tres». On `callback` the twelve feeds return,
 * dimmed: three are tied to a source, the other nine go out under «sobra», and a fourth question without a
 * source gets a gap, «hay que conseguirlas». No provider, no real feed.
 */
export function S08Permanentes(props: SceneProps) {
  const frame = useCurrentFrame();
  const standingAt = props.cue('standing');
  const adhocAt = props.cue('adhoc');
  const collectionAt = props.cue('collection');
  const frameworkAt = props.cue('framework');
  const callbackAt = props.cue('callback');
  const at = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);
  const p = (start: number, dur = 14) => progress(frame, start, dur);

  // ---- The two orders.
  const stIn = p(standingAt - 4, 18);
  const stClockAt = at('s08-02', 'revisa') - 8;
  const stClock = p(stClockAt, 14);
  const stTagAt = at('s08-02', 'standing') - 6;
  const stTag = p(stTagAt, 14);
  const adIn = p(adhocAt - 4, 18);
  const itemAt = S08_ADHOC.items.map((it) => (it.word ? at('s08-03', it.word) - 6 : at('s08-03', 'incidente') + 8));
  const ringAt = at('s08-03', 'banquete') - 4;
  const endAt = at('s08-03', 'acaban') + 6;
  const ring = progress(frame, ringAt, Math.max(40, endAt - ringAt), EASE.linear);
  const adTag = p(at('s08-03', 'ad') - 6, 14);
  const ordersOut = 1 - progress(frame, collectionAt - 6, 16, EASE.inOut);

  // ---- The split.
  const tblIn = p(collectionAt - 2, 16);
  const rowAt = [at('s08-04', 'descompone') - 4, at('s08-04', 'descompone') + 12, at('s08-04', 'descompone') + 28];
  const srcAt = [at('s08-04', 'fuente') - 4, at('s08-04', 'fuente') + 10, at('s08-04', 'fuente') + 24];
  const frame2 = p(frameworkAt - 2, 18);
  const later = enter(frame, at('s08-05', 'construirás') - 6, { distance: 10, duration: 16 });

  // ---- The callback.
  const feedsIn = p(callbackAt - 2, 16);
  const out = progress(frame, at('s08-06', 'sobra') - 4, 16, EASE.inOut);
  const row4At = at('s08-06', 'fuentes') - 4;
  const row4 = p(row4At, 16);
  const flashAt = at('s08-06', 'doce') - 4;
  const flash = progress(frame, flashAt, 10) * (1 - progress(frame, flashAt + 30, 20));

  const rowY = (i: number) => TBL.y + TBL.head + i * TBL.row;

  return (
    <Stage>
      {/* ---- The two orders */}
      {ordersOut > 0.01 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: ordersOut }}>
          {/* Standing: the weekly order */}
          <div style={{ position: 'absolute', left: 0, top: 120, width: 840, height: 440, opacity: stIn, transform: `translateY(${(1 - stIn) * 20}px)` }}>
            <OrderCard tone={C.cyan}>
              <div style={{ display: 'flex', gap: 30, alignItems: 'center', height: '100%' }}>
                <div style={{ flex: 1, fontFamily: FONT.sans, fontSize: 50, fontWeight: 850, lineHeight: 1.16, letterSpacing: -0.8, color: C.textStrong }}>{S08_STANDING.question}</div>
                <div style={{ width: 200, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, opacity: stClock }}>
                  <SweepClock frame={frame} start={stClockAt} size={140} color={C.cyan} />
                  <div style={{ fontFamily: FONT.sans, fontSize: 32, fontWeight: 700, lineHeight: 1.15, textAlign: 'center', color: C.cyanSoft }}>{S08_STANDING.clock}</div>
                </div>
              </div>
            </OrderCard>
            <div style={{ position: 'absolute', left: 0, bottom: -64, opacity: stTag, transform: `translateY(${(1 - stTag) * 10}px)` }}>
              <Tag tone="cyan" size={36}>
                {S08_STANDING.label}
              </Tag>
            </div>
          </div>

          {/* Ad hoc: the banquet */}
          <div style={{ position: 'absolute', left: 888, top: 120, width: 840, height: 440, opacity: adIn, transform: `translateY(${(1 - adIn) * 20}px)` }}>
            <OrderCard tone={C.amber}>
              <div style={{ display: 'flex', gap: 30, alignItems: 'center', height: '100%' }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 22 }}>
                  {S08_ADHOC.items.map((it, i) => {
                    const e = enter(frame, itemAt[i], { distance: 16, duration: 14 });
                    return (
                      <div key={it.text} style={{ display: 'flex', alignItems: 'center', gap: 18, fontFamily: FONT.sans, fontSize: 42, fontWeight: 800, color: C.textStrong, whiteSpace: 'nowrap', ...e, opacity: e.opacity * (1 - 0.5 * progress(frame, endAt + 6, 14)) }}>
                        <Icon name={it.icon} size={46} color={C.amber} strokeWidth={2.2} />
                        {it.text}
                      </div>
                    );
                  })}
                </div>
                <Countdown ring={ring} size={170} />
              </div>
            </OrderCard>
            <div style={{ position: 'absolute', left: 0, bottom: -64, opacity: adTag, transform: `translateY(${(1 - adTag) * 10}px)` }}>
              <Tag tone="amber" size={36}>
                {S08_ADHOC.label}
              </Tag>
            </div>
          </div>
        </div>
      ) : null}

      {/* ---- The Collection Management Framework */}
      {tblIn > 0.01 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: tblIn }}>
          {/* its name and the promise of what is next */}
          <div style={{ position: 'absolute', left: TBL.x, top: 0, width: TBL.w, fontFamily: FONT.sans, opacity: frame2, transform: `translateY(${(1 - frame2) * 12}px)` }}>
            <div style={{ fontSize: 48, fontWeight: 850, letterSpacing: -0.8, color: C.cyan, whiteSpace: 'nowrap' }}>{S08_TABLE.title}</div>
            <div style={{ marginTop: 4, fontSize: 30, fontWeight: 650, color: C.muted, whiteSpace: 'nowrap', opacity: later.opacity }}>{S08_TABLE.later}</div>
          </div>

          {/* the table */}
          <div style={{ position: 'absolute', left: TBL.x, top: TBL.y, width: TBL.w, height: TBL.head + 4 * TBL.row, boxSizing: 'border-box', borderRadius: RADIUS.lg, border: `${frame2 > 0.5 ? 3 : 2}px solid ${alpha(C.cyan, 0.4 + 0.45 * frame2)}`, background: alpha(C.ink900, 0.9), boxShadow: frame2 > 0.02 ? `0 0 ${Math.round(34 * frame2)}px ${alpha(C.cyan, 0.2 * frame2)}` : undefined }} />
          <div style={{ position: 'absolute', left: TBL.x, top: TBL.y, width: TBL.w, height: TBL.head, display: 'flex', alignItems: 'center', fontFamily: FONT.sans, fontSize: 30, fontWeight: 800, letterSpacing: 1, color: C.muted, opacity: frame2 }}>
            <div style={{ width: TBL.pir, textAlign: 'center' }}>{S08_TABLE.heads[0]}</div>
            <div style={{ width: TBL.q, paddingLeft: 24 }}>{S08_TABLE.heads[1]}</div>
            <div style={{ paddingLeft: 24 }}>{S08_TABLE.heads[2]}</div>
          </div>

          {/* the PIR cell */}
          <div style={{ position: 'absolute', left: TBL.x + 14, top: TBL.y + TBL.head + 8, width: TBL.pir - 28, height: 3 * TBL.row - 16 + row4 * TBL.row, display: 'grid', placeItems: 'center', borderRadius: RADIUS.md, border: `3px solid ${alpha(C.cyan, 0.8)}`, background: alpha(C.cyan, 0.12), fontFamily: FONT.sans, fontSize: 60, fontWeight: 900, color: C.cyan, letterSpacing: 2 }}>PIR</div>

          {S08_TABLE.rows.map((r, i) => {
            const isGap = r.src === null;
            const rIn = isGap ? row4 : p(rowAt[i], 16);
            const sIn = isGap ? row4 : p(srcAt[i], 16);
            if (rIn <= 0.01) return null;
            return (
              <div key={r.q} style={{ position: 'absolute', left: TBL.x + TBL.pir, top: rowY(i), width: TBL.w - TBL.pir, height: TBL.row, display: 'flex', alignItems: 'center', opacity: rIn, transform: `translateX(${(1 - rIn) * 30}px)`, borderTop: `2px solid ${alpha(C.ink600, 0.7)}` }}>
                <div style={{ width: TBL.q, paddingLeft: 24, fontFamily: FONT.sans, fontSize: 36, fontWeight: 700, color: C.text, whiteSpace: 'nowrap' }}>{r.q}</div>
                <div style={{ position: 'relative', opacity: sIn }}>
                  {isGap ? (
                    <div style={{ width: 250, height: 56, boxSizing: 'border-box', borderRadius: RADIUS.md, border: `3px dashed ${alpha(C.amber, 0.95)}`, background: alpha(C.amber, 0.1), display: 'grid', placeItems: 'center', fontSize: 40, fontWeight: 900, color: C.amber, lineHeight: 1 }}>?</div>
                  ) : (
                    <span style={{ display: 'inline-block', padding: '5px 24px 7px', borderRadius: RADIUS.pill, border: `2px solid ${alpha(C.sky, 0.8)}`, background: alpha(C.sky, 0.12), fontFamily: FONT.sans, fontSize: 34, fontWeight: 750, color: '#bae6fd', whiteSpace: 'nowrap' }}>{r.src}</span>
                  )}
                </div>
              </div>
            );
          })}
          {row4 > 0.01 ? (
            <div style={{ position: 'absolute', left: TBL.x + TBL.pir + TBL.q + 24, top: rowY(3) + TBL.row + 14, fontFamily: FONT.sans, fontSize: 38, fontWeight: 850, color: C.amber, whiteSpace: 'nowrap', opacity: row4 }}>{S08_CALLBACK.get}</div>
          ) : null}

          {/* the twelve feeds are back, dimmed; the unused ones go out */}
          {feedsIn > 0.01 ? (
            <>
              <div style={{ position: 'absolute', left: FEEDS.x, top: FEEDS.y }}>
                <FeedChips cols={FEEDS.cols} chipW={FEEDS.w} chipH={FEEDS.h} gap={FEEDS.gap} used={USED} out={out} show={feedsIn * (0.55 + 0.45 * Math.max(out, flash))} />
              </div>
              <svg width={W} height={STAGE.height} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} aria-hidden>
                {USED.map((feed, i) => {
                  const y = rowY(i) + TBL.row / 2;
                  const fy = FEEDS.y + Math.floor(feed / FEEDS.cols) * (FEEDS.h + FEEDS.gap) + FEEDS.h / 2;
                  const on = progress(frame, at('s08-06', 'sobra') - 8 + i * 8, 16);
                  return <path key={i} d={`M ${TBL.w + 6} ${y} C ${TBL.w + 50} ${y}, ${FEEDS.x - 50} ${fy}, ${FEEDS.x - 6} ${fy}`} fill="none" stroke={C.cyan} strokeWidth={4} strokeLinecap="round" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - on} />;
                })}
              </svg>
              <div style={{ position: 'absolute', left: FEEDS.x, top: FEEDS.y + 4 * (FEEDS.h + FEEDS.gap) + 6, width: 3 * FEEDS.w + 2 * FEEDS.gap, textAlign: 'center', fontFamily: FONT.sans, fontSize: 44, fontWeight: 900, color: C.amber, opacity: out, transform: `translateY(${(1 - out) * 10}px)` }}>{S08_CALLBACK.spare}</div>
            </>
          ) : null}
        </div>
      ) : null}
    </Stage>
  );
}

/** A big card for one kind of order. */
function OrderCard({ tone, children }: { tone: string; children: ReactNode }) {
  return (
    <div style={{ position: 'absolute', inset: 0, boxSizing: 'border-box', padding: '0 40px', borderRadius: RADIUS.lg, border: `3px solid ${alpha(tone, 0.7)}`, background: `linear-gradient(180deg, ${alpha(tone, 0.08)} 0%, ${alpha(C.ink900, 0.97)} 65%)`, boxShadow: `0 24px 60px ${alpha('#000000', 0.45)}` }}>{children}</div>
  );
}

/** A clock whose hand sweeps round and round from frame `start` (one turn every 3 s). */
function SweepClock({ frame, start, size, color }: { frame: number; start: number; size: number; color: string }) {
  const a = (Math.max(0, frame - start) / 90) * 2 * Math.PI - Math.PI / 2;
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden>
      <circle cx={32} cy={32} r={27} stroke={color} strokeWidth={3.4} />
      <path d={`M 32 32 L ${32 + 19 * Math.cos(a)} ${32 + 19 * Math.sin(a)}`} stroke={color} strokeWidth={3.4} strokeLinecap="round" />
      <path d="M 32 9 V 14 M 55 32 H 50 M 32 55 V 50 M 9 32 H 14" stroke={color} strokeWidth={3.4} strokeLinecap="round" />
    </svg>
  );
}

/** The countdown of an ad hoc order: a ring that runs down and, once answered, switches off with a tick. */
function Countdown({ ring, size }: { ring: number; size: number }) {
  const r = size / 2 - 10;
  const len = 2 * Math.PI * r;
  const done = ring >= 0.999;
  const color = done ? C.muted : C.amber;
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }} aria-hidden>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={alpha(C.ink600, 0.9)} strokeWidth={10} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={alpha(color, done ? 0.5 : 1)} strokeWidth={10} strokeLinecap="round" strokeDasharray={len} strokeDashoffset={len * ring} />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}>
        {done ? <Icon name="check" size={size * 0.46} color={C.emerald} strokeWidth={3} /> : <Icon name="clock" size={size * 0.4} color={C.amber} strokeWidth={2.2} />}
      </div>
    </div>
  );
}

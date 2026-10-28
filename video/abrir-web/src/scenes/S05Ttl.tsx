import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../engine/src/theme/motion';
import { Icon, windowWeight, type IconName } from '../../../engine/src/ui';
import { Stage } from './kit';
import { PORTAL } from './parts/data';
import { Ribbon, ribbonLit } from './parts/Ribbon';
import { ImaginaSeal } from './parts/Seal';

const REC = { left: 214, top: 98, w: 1300, h: 156 } as const;
const COLS = [
  { label: 'nombre', w: 600 },
  { label: 'tipo', w: 130 },
  { label: 'dirección', w: 290 },
  { label: 'TTL', w: 220 },
] as const;

const hms = (s: number) => {
  const t = Math.max(0, Math.round(s));
  return `${Math.floor(t / 3600)}:${String(Math.floor((t % 3600) / 60)).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`;
};

function Holder({ x, icon, title, show, count, frac, expired, hasCopy }: { x: number; icon: IconName; title: string; show: number; count: number; frac: number; expired: number; hasCopy: number }) {
  if (show <= 0) return null;
  const tone = expired > 0.5 ? C.amber : C.cyan;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: 316,
        width: 520,
        height: 232,
        boxSizing: 'border-box',
        borderRadius: RADIUS.lg,
        border: `3px solid ${alpha(tone, 0.55)}`,
        background: `linear-gradient(180deg, ${C.ink850} 0%, ${C.ink900} 100%)`,
        boxShadow: `0 20px 50px ${alpha('#000000', 0.4)}`,
        padding: '16px 26px',
        opacity: show,
        transform: `translateY(${(1 - show) * 20}px)`,
        fontFamily: FONT.sans,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <Icon name={icon} size={44} color={C.sky} />
        <span style={{ fontSize: 36, fontWeight: 800, color: C.textStrong }}>{title}</span>
        <span style={{ marginLeft: 'auto', opacity: hasCopy, fontFamily: FONT.mono, fontSize: 30, fontWeight: 700, color: '#6ee7b7', padding: '2px 14px', borderRadius: 10, border: `2px solid ${alpha(C.emerald, 0.7)}` }}>
          {PORTAL.ip}
        </span>
      </div>
      <div style={{ marginTop: 6, fontSize: 28, fontWeight: 700, color: expired > 0.5 ? '#fcd34d' : C.muted }}>
        {expired > 0.5 ? 'lo olvida' : 'contesta de memoria'}
      </div>
      <div style={{ marginTop: 0, fontFamily: FONT.mono, fontSize: 82, fontWeight: 800, color: expired > 0.5 ? '#fcd34d' : C.textStrong, letterSpacing: -2 }}>{hms(count)}</div>
      <div style={{ marginTop: 8, height: 14, borderRadius: 7, background: C.ink950, border: `2px solid ${C.ink600}`, overflow: 'hidden', boxSizing: 'border-box' }}>
        <div style={{ width: `${frac * 100}%`, height: '100%', background: alpha(tone, 0.85) }} />
      </div>
    </div>
  );
}

/**
 * s05-ttl «Una respuesta que caduca».
 *   record     the answer as a card: name · A · address · TTL 3600 (the address is on screen only);
 *   ttl        the TTL is highlighted («una hora»); the small chip «AAAA = IPv6 · MX = correo»;
 *   cache-ttl  two hour-long countdowns, one beside the resolver and one beside the laptop, both holding the answer;
 *   expire     both reach zero (ping2): they forget it and the card fades;
 *   wrap       the DNS box of the ribbon lights («DNS traduce nombres a direcciones…»); the exam card 4.5 enters
 *              in the top band (engine).
 */
export function S05Ttl(props: SceneProps) {
  const frame = useCurrentFrame();
  const record = props.cue('record');
  const ttl = props.cue('ttl');
  const cacheTtl = props.cue('cache-ttl');
  const expire = props.cue('expire');
  const wrap = props.cue('wrap');

  const recIn = progress(frame, record - 6, 20);
  const ttlGlow = windowWeight(frame, ttl, cacheTtl, { ramp: 12 });
  const ttlStay = progress(frame, ttl, 14);
  const chipIn = progress(frame, ttl + 40, 16);
  const holdersIn = progress(frame, cacheTtl - 6, 22);
  const run = progress(frame, cacheTtl + 26, expire - cacheTtl - 26, EASE.linear);
  const count = PORTAL.ttl * (1 - run);
  const expired = progress(frame, expire, 12);
  const fade = progress(frame, expire + 6, 24, EASE.inOut);
  const wrapIn = progress(frame, wrap, 16);

  const values = [PORTAL.host, 'A', PORTAL.ip, '3600'];
  let x = 0;
  const cols = COLS.map((c) => {
    const left = x;
    x += c.w;
    return { ...c, left };
  });

  return (
    <Stage>
      <Ribbon lit={ribbonLit(frame, { DNS: wrap }, ['DHCP'])} />

      {/* the record */}
      <div
        style={{
          position: 'absolute',
          left: REC.left,
          top: REC.top,
          width: REC.w,
          height: REC.h,
          boxSizing: 'border-box',
          borderRadius: RADIUS.lg,
          border: `3px solid ${alpha(C.sky, 0.6)}`,
          background: `linear-gradient(180deg, ${C.ink850} 0%, ${C.ink900} 100%)`,
          boxShadow: `0 24px 60px ${alpha('#000000', 0.4)}`,
          opacity: recIn * (1 - 0.7 * fade),
          transform: `translateY(${(1 - recIn) * 18}px)`,
          fontFamily: FONT.sans,
          padding: '14px 30px',
        }}
      >
        {cols.map((c, i) => {
          const isTtl = i === 3;
          return (
            <div key={c.label} style={{ position: 'absolute', left: 30 + c.left, top: 14, width: c.w - 20 }}>
              <div style={{ fontSize: 28, fontWeight: 650, color: C.muted }}>{c.label}</div>
              <div
                style={{
                  marginTop: 6,
                  fontFamily: FONT.mono,
                  fontSize: i === 0 ? 33 : 44,
                  fontWeight: 700,
                  color: isTtl ? '#fcd34d' : C.textStrong,
                  whiteSpace: 'nowrap',
                  display: 'inline-block',
                  padding: isTtl ? '0 14px' : 0,
                  borderRadius: 10,
                  border: isTtl ? `3px solid ${alpha(C.amber, 0.3 + 0.6 * ttlStay)}` : undefined,
                  background: isTtl ? alpha(C.amber, 0.12 * ttlStay + 0.1 * ttlGlow) : undefined,
                  boxShadow: isTtl && ttlGlow > 0 ? `0 0 ${Math.round(26 * ttlGlow)}px ${alpha(C.amber, 0.45 * ttlGlow)}` : undefined,
                }}
              >
                {values[i]}
              </div>
              {isTtl ? (
                <div style={{ fontSize: 28, fontWeight: 700, color: '#fcd34d', marginTop: 6, opacity: ttlStay }}>una hora</div>
              ) : null}
            </div>
          );
        })}
        <div style={{ position: 'absolute', left: 30, bottom: 12, fontSize: 26, fontWeight: 650, color: C.muted }}>registro de tipo A · dirección IPv4</div>
      </div>

      {chipIn > 0 ? (
        <div style={{ position: 'absolute', left: REC.left + 4, top: REC.top + REC.h + 10, opacity: chipIn * (1 - fade), transform: `translateY(${(1 - chipIn) * 8}px)` }}>
          <span
            style={{
              display: 'inline-block',
              padding: '2px 18px',
              borderRadius: RADIUS.pill,
              border: `2px solid ${alpha(C.muted, 0.5)}`,
              background: alpha(C.ink950, 0.7),
              fontFamily: FONT.sans,
              fontSize: 28,
              fontWeight: 650,
              color: C.muted,
            }}
          >
            AAAA = IPv6 · MX = correo
          </span>
        </div>
      ) : null}

      {/* the two holders with their hour-long countdowns */}
      <Holder x={300} icon="search" title="resolutor" show={holdersIn} count={count} frac={1 - run} expired={expired} hasCopy={1 - fade} />
      <Holder x={908} icon="laptop" title="portátil" show={holdersIn} count={count} frac={1 - run} expired={expired} hasCopy={1 - fade} />

      {/* after the hour, the question is asked again; the rule of the scene */}
      {wrapIn > 0 ? (
        <div style={{ position: 'absolute', left: 0, top: 558, width: 1728, display: 'flex', justifyContent: 'center', opacity: wrapIn, transform: `translateY(${(1 - wrapIn) * 10}px)` }}>
          <span style={{ fontFamily: FONT.sans, fontSize: 36, fontWeight: 750, color: C.text, display: 'inline-flex', alignItems: 'center', gap: 14 }}>
            <Icon name="check" size={38} color={C.emerald} strokeWidth={3} />
            no hay una consulta nueva en cada clic
          </span>
        </div>
      ) : null}

      <ImaginaSeal />
    </Stage>
  );
}

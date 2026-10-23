import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { Icon } from '../../../engine/src/ui';
import { S03_COLLECTION, S03_CONVERT, S03_IMAGINE, S03_NO_ORDER, S03_PILE, S03_STAMP, S03_VERBS } from '../data/s03-pedido';
import { FeedPanel } from './parts/Feeds';
import { StationLine, stationX, type StationState } from './parts/StationLine';
import { Ticket } from './parts/Ticket';
import { Stage, wordFrame } from './kit';

const S = 's03-pedido';
const W = STAGE.width;

const PANEL = { x: 0, y: 200, w: 300, rowH: 34 } as const;
const TICKET = { x: 360, y: 202, w: 120, h: 140 } as const;
const LINE = { x: 360, y: 352, w: W - 360, tile: 112, label: 28 } as const;

/** A deterministic 0–1 value (renders must repeat). */
const hash = (i: number, k: number) => {
  const v = Math.sin(i * 91.7 + k * 17.3) * 43758.5453;
  return v - Math.floor(v);
};

/**
 * s03-pedido «El almacén se llena». The line of s02 is here with its names; on `nobody` the comanda is blank, a
 * question mark on it, «Imagina que nadie la escribe» (a supposition, never a fact of Meridian), and on «doce»
 * the panel of twelve feeds, «feed 1» to «feed 12» and nothing else, starts to stream and Collection lights. The
 * think prompt («Doce feeds sin pregunta. ¿Qué fase falta?») gets the top of the stage to itself: everything
 * here sits under y 200. On `hoard` the first station goes dark under «sin comanda · sin dirección», Collection
 * turns amber and overflows (cubes fly out of it) under «Collection · datos crudos de fuentes planificadas», and
 * the stamp «data hoarding» (screen only) lands. On `process` the third station lights with the lesson's verbs
 * — parsear · decodificar · traducir · normalizar · detonar muestras — and «convertir lo crudo en analizable».
 * On `pile` a storage bar fills with «terabytes crudos» and the stamp «sin analizar» closes it.
 */
export function S03Pedido(props: SceneProps) {
  const frame = useCurrentFrame();
  const nobodyAt = props.cue('nobody');
  const hoardAt = props.cue('hoard');
  const processAt = props.cue('process');
  const pileAt = props.cue('pile');
  const at = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);
  const p = (start: number, dur = 14) => progress(frame, start, dur);

  // ---- The blank comanda.
  const ticketIn = p(nobodyAt - 4, 18);
  const imagineIn = enter(frame, at('s03-01', 'Imagina') - 4, { distance: 14, duration: 16 });
  const imagineOut = 1 - progress(frame, hoardAt - 6, 12, EASE.inOut);

  // ---- The feeds.
  const feedsAt = at('s03-01', 'doce') - 4;
  const hoard = p(hoardAt, 14);
  const pileFill = progress(frame, pileAt + 4, 70, EASE.inOut);
  const strain = Math.max(0.5 * hoard, pileFill);

  // ---- The stations.
  const proc = p(processAt - 4, 16);
  const states: StationState[] = [0, 1, 2, 3, 4, 5].map((i) => {
    const base: StationState = { show: 1, name: 1 };
    if (i === 0) return { ...base, off: hoard };
    if (i === 1) {
      const fed = p(feedsAt, 16);
      return { ...base, lit: fed * (1 - 0.5 * proc), tone: hoard > 0.5 ? 'amber' : 'cyan', dim: 0.5 * proc };
    }
    if (i === 2) return { ...base, lit: proc, scale: 1 + 0.1 * proc };
    return { ...base, dim: 0.3 * hoard };
  });

  // ---- Collection spills over.
  const cx = LINE.x + stationX(LINE.w, 1);
  const spillT = (frame - hoardAt) / 30;

  // ---- The verbs of Processing.
  const convertAt = at('s03-04', 'analizar') - 8;
  const verbAt = S03_VERBS.map((v, i) => (v.word ? at('s03-04', v.word) - 6 : convertAt + i * 6));
  const verbsOut = 1 - progress(frame, pileAt - 6, 12, EASE.inOut);

  // ---- The pile.
  const barIn = enter(frame, pileAt - 2, { distance: 14, duration: 16 });
  const BAR = { x: 840, y: 226, w: 780, h: 62 } as const;
  const stampIn = p(pileAt + 56, 10);

  const chip = (text: string, i: number) => {
    const e = enter(frame, verbAt[i], { distance: 14, duration: 14 });
    return (
      <span
        key={text}
        style={{
          display: 'inline-block',
          padding: '6px 22px 8px',
          borderRadius: RADIUS.pill,
          border: `2px solid ${alpha(C.cyan, 0.75)}`,
          background: alpha(C.cyan, 0.12),
          fontFamily: FONT.sans,
          fontSize: 32,
          fontWeight: 750,
          color: C.cyanSoft,
          whiteSpace: 'nowrap',
          ...e,
        }}
      >
        {text}
      </span>
    );
  };

  return (
    <Stage>
      {/* The twelve feeds */}
      <div style={{ position: 'absolute', left: PANEL.x, top: PANEL.y }}>
        <FeedPanel width={PANEL.w} rowH={PANEL.rowH} frame={frame} at={feedsAt} step={6} tone={strain > 0.5 ? C.amber : C.cyan} strain={strain} show={p(feedsAt - 6, 10)} />
      </div>

      {/* The blank comanda and what it stands for */}
      <div style={{ position: 'absolute', left: TICKET.x, top: TICKET.y }}>
        <Ticket width={TICKET.w} height={TICKET.h} title={null} show={ticketIn} question={ticketIn} dim={0.3 * hoard}>
          <span />
        </Ticket>
      </div>
      {frame >= at('s03-01', 'Imagina') - 6 && imagineOut > 0.01 ? (
        <div style={{ position: 'absolute', left: TICKET.x + TICKET.w + 34, top: TICKET.y + 36, fontFamily: FONT.sans, fontSize: 44, fontWeight: 850, color: C.textStrong, whiteSpace: 'nowrap', opacity: imagineIn.opacity * imagineOut, transform: imagineIn.transform }}>
          {S03_IMAGINE}
        </div>
      ) : null}

      {/* The line */}
      <StationLine width={LINE.w} tile={LINE.tile} labelSize={LINE.label} states={states} style={{ position: 'absolute', left: LINE.x, top: LINE.y }} />

      {/* Cubes flying out of Collection */}
      {hoard > 0.01 ? (
        <svg width={W} height={STAGE.height} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} aria-hidden>
          {Array.from({ length: 12 }, (_, i) => {
            const t = (((spillT * 0.55 + hash(i, 1)) % 1) + 1) % 1;
            const side = i % 2 === 0 ? 1 : -1;
            const x = cx + side * (10 + 70 * t * (0.4 + hash(i, 2)));
            const y = LINE.y - 8 - 92 * Math.sin(Math.PI * t) * (0.55 + 0.45 * hash(i, 3));
            const s = 12 + 8 * hash(i, 4);
            return <rect key={i} x={x - s / 2} y={y - s / 2} width={s} height={s} rx={3} fill={i % 3 === 0 ? C.amber : C.cyan} opacity={Math.sin(Math.PI * t) * hoard * (1 - 0.8 * proc)} transform={`rotate(${t * 200 * side} ${x} ${y})`} />;
          })}
        </svg>
      ) : null}

      {/* Under the first station: no comanda, no direction */}
      {hoard > 0.01 ? (
        <div style={{ position: 'absolute', left: LINE.x, top: LINE.y + 188 + 18, width: LINE.w / 6 + 30, fontFamily: FONT.sans, fontSize: 32, fontWeight: 800, lineHeight: 1.15, color: C.amber, textAlign: 'center', opacity: hoard, transform: `translateY(${(1 - hoard) * 10}px)` }}>
          {S03_NO_ORDER.map((l) => (
            <div key={l}>{l}</div>
          ))}
        </div>
      ) : null}

      {/* Under Collection: raw data from planned sources */}
      {hoard > 0.01 ? (
        <div style={{ position: 'absolute', left: LINE.x + LINE.w / 6 + 76, top: LINE.y + 188 + 18, fontFamily: FONT.sans, fontSize: 32, fontWeight: 750, lineHeight: 1.15, color: C.cyanSoft, whiteSpace: 'nowrap', opacity: hoard, transform: `translateY(${(1 - hoard) * 10}px)` }}>
          {S03_COLLECTION.map((l, i) => (
            <div key={l}>{i === 0 ? <><span style={{ color: C.amber, fontWeight: 850 }}>Collection</span>{l.slice('Collection'.length)}</> : l}</div>
          ))}
        </div>
      ) : null}

      {/* The stamp, screen only */}
      {hoard > 0.05 && proc < 0.5 ? (
        <div style={{ position: 'absolute', left: 820, top: 224, opacity: hoard * (1 - proc), transform: `rotate(-5deg) scale(${1 + (1 - hoard) * 0.3})` }}>
          <span style={{ display: 'inline-block', padding: '6px 28px 10px', borderRadius: RADIUS.sm, border: `5px solid ${alpha(C.amber, 0.9)}`, color: C.amber, fontFamily: FONT.mono, fontSize: 54, fontWeight: 800, letterSpacing: 4, whiteSpace: 'nowrap' }}>{S03_STAMP}</span>
        </div>
      ) : null}

      {/* The verbs of Processing */}
      {frame >= verbAt[0] - 4 && verbsOut > 0.01 ? (
        <div style={{ position: 'absolute', left: 560, top: 212, width: 1168, opacity: verbsOut }}>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', width: 640 }}>
            {S03_VERBS.map((v, i) => chip(v.text, i))}
          </div>
          <div style={{ position: 'absolute', left: 680, top: 4, fontFamily: FONT.sans, fontSize: 38, fontWeight: 800, lineHeight: 1.15, color: C.textStrong, whiteSpace: 'nowrap', ...enter(frame, convertAt, { distance: 12, duration: 14 }) }}>
            {S03_CONVERT.map((l) => (
              <div key={l}>{l}</div>
            ))}
          </div>
        </div>
      ) : null}

      {/* The pile: storage filling with raw terabytes */}
      {frame >= pileAt - 4 ? (
        <div style={{ position: 'absolute', left: BAR.x - 100, top: BAR.y, display: 'flex', alignItems: 'center', gap: 22, ...barIn }}>
          <Icon name="database" size={64} color={pileFill > 0.7 ? C.amber : C.cyan} strokeWidth={2} />
          <div style={{ position: 'relative', width: BAR.w, height: BAR.h, borderRadius: 16, border: `3px solid ${alpha(pileFill > 0.7 ? C.amber : C.cyan, 0.7)}`, background: alpha(C.ink900, 0.95), overflow: 'hidden' }}>
            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${pileFill * 100}%`, background: `repeating-linear-gradient(135deg, ${alpha(pileFill > 0.7 ? C.amber : C.cyan, 0.55)} 0 14px, ${alpha(pileFill > 0.7 ? C.amber : C.cyan, 0.32)} 14px 28px)` }} />
            <div style={{ position: 'absolute', left: 22, top: 0, bottom: 0, display: 'flex', alignItems: 'center', fontFamily: FONT.sans, fontSize: 34, fontWeight: 850, color: C.textStrong, whiteSpace: 'nowrap', textShadow: `0 2px 8px ${alpha('#000000', 0.8)}` }}>{S03_PILE.fill}</div>
          </div>
          <div style={{ position: 'absolute', left: 64 + 22, top: -30, fontFamily: FONT.sans, fontSize: 26, fontWeight: 700, color: C.muted, whiteSpace: 'nowrap' }}>{S03_PILE.storage}</div>
        </div>
      ) : null}
      {stampIn > 0.02 ? (
        <div style={{ position: 'absolute', left: 1330, top: 190, opacity: stampIn, transform: `rotate(-4deg) scale(${1 + (1 - stampIn) * 0.3})` }}>
          <span style={{ display: 'inline-block', padding: '4px 26px 8px', borderRadius: RADIUS.sm, border: `5px solid ${alpha(C.rose, 0.9)}`, color: C.roseSoft, fontFamily: FONT.mono, fontSize: 46, fontWeight: 800, letterSpacing: 3, whiteSpace: 'nowrap' }}>{S03_PILE.stamp}</span>
        </div>
      ) : null}
    </Stage>
  );
}

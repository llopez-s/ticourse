import { useCurrentFrame } from 'remotion';
import type { CSSProperties, ReactNode } from 'react';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { dimStyle, mix } from '../../../engine/src/ui';
import { EMBER, IP } from '../data/canon';
import { CisoStrip } from './parts/CisoStrip';
import { FoxGlyph } from './parts/Glyphs';
import { IpChip, RUNGS, RungCard } from './parts/Stairs';
import { Stage, wordFrame } from './kit';

const S = 's02-pasos';
const W = STAGE.width;

// The three rungs, rising to the right. Outer size of each card, stage-local.
const CARD = [
  { x: 0, y: 400, w: 470, h: 250 },
  { x: 529, y: 194, w: 500, h: 366 },
  { x: 1088, y: 6, w: 640, h: 466 },
] as const;
const IP_ROW = 70; // y of the IP chip inside a card, from its top
const IP_X = 26;

const PHISH = 'alojó un panel de phishing el martes';
const INFO_GLOSS = 'datos correlacionados que responden a una pregunta de hechos';
const ENGLISH = [
  { t: 'We assess', mark: 0 },
  { t: ' the actor will ' },
  { t: 'likely', mark: 1 },
  { t: ' reuse this hosting provider; ' },
  { t: 'recommend', mark: 2 },
  { t: ' monitoring new registrations on that ASN' },
] as const;
const GLOSS = 'valoramos que el atacante probablemente volverá a usar este proveedor de alojamiento y recomendamos vigilar los dominios nuevos que se registren en esa red';

/**
 * s02-pasos «Dato, información, inteligencia». The section's adversary opens it: EMBER FOX's message is typed by the
 * engine in the top band, and under it only a sober card, «EMBER FOX · célula de acceso inicial · spearphishing» (no
 * targets, no dossier). The IP is NOT on screen while the message plays. When the voice answers («qué sabemos de
 * ella») the card steps out and the CISO's question parks top left. Then three rungs rise to the right, one per step
 * of the voice, with the same IP climbing them: `data` (a raw fact), `info` (the IP joined to «alojó un panel de
 * phishing el martes»), `intel` (the lesson's English judgment, whose «We assess», «likely» and «recommend» light on
 * «valoramos», «probablemente» and «recomendamos»; the Spanish gloss small beneath). On `decision` everything goes out
 * but one sign: «lo que cambia: alguien analiza y juzga…», with the exam trick small under it on «truco».
 */
export function S02Pasos(props: SceneProps) {
  const frame = useCurrentFrame();
  const data = props.cue('data');
  const info = props.cue('info');
  const intel = props.cue('intel');
  const decision = props.cue('decision');

  // ---- Beat frames from the voice.
  const cisoWord = wordFrame(S, 's02-02', 'CISO') - 6;
  const askAt = wordFrame(S, 's02-02', 'sabemos') - 6;
  const ipWord = wordFrame(S, 's02-03', 'IP') - 6;
  const logAt = wordFrame(S, 's02-03', 'registro') - 4;
  const rawAt = wordFrame(S, 's02-03', 'crudo') - 6;
  const phishAt = wordFrame(S, 's02-04', 'alojó') - 8;
  const glossInfoAt = wordFrame(S, 's02-04', 'información') - 8;
  const assessAt = wordFrame(S, 's02-05', 'valoramos') - 6;
  const likelyAt = wordFrame(S, 's02-05', 'probablemente') - 6;
  const recommendAt = wordFrame(S, 's02-06', 'recomendamos') - 6;
  const trickAt = wordFrame(S, 's02-08', 'truco') - 8;

  // ---- Which rung holds the light.
  const focusData = progress(frame, data, 12) * (1 - progress(frame, info - 4, 12));
  const focusInfo = progress(frame, info, 12) * (1 - progress(frame, intel - 4, 12));
  const focusIntel = progress(frame, intel, 12) * (1 - progress(frame, decision - 4, 12));
  const dimData = progress(frame, info, 14) * 0.7;
  const dimInfo = progress(frame, intel, 14) * 0.7;
  const goOut = progress(frame, decision - 6, 18, EASE.inOut);

  // ---- The ficha (under the adversary's message), then the CISO's question.
  const fichaIn = enter(frame, 4, { distance: 22, duration: 20 });
  const fichaOut = progress(frame, cisoWord - 2, 14, EASE.inOut);
  const cisoIn = progress(frame, cisoWord, 16);

  // ---- The IP climbing: a ghost chip travels between rungs.
  const chipAt = (i: number) => ({ x: CARD[i].x + IP_X, y: CARD[i].y + IP_ROW });
  const travel = (from: number, to: number, at: number) => {
    const t = progress(frame, at, 22, EASE.inOut);
    const a = chipAt(from);
    const b = chipAt(to);
    return { t, x: mix(a.x, b.x, t), y: mix(a.y, b.y, t) - 46 * Math.sin(Math.PI * t) };
  };
  const g1 = travel(0, 1, info);
  const g2 = travel(1, 2, intel);

  return (
    <Stage>
      {/* The adversary's card, low: the top band belongs to the intercepted message */}
      {fichaOut < 1 ? (
        <div style={{ position: 'absolute', left: (W - 940) / 2, top: 262, width: 940, ...fichaIn, opacity: fichaIn.opacity * (1 - fichaOut), fontFamily: FONT.sans }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 34,
              padding: '26px 40px',
              borderRadius: RADIUS.lg,
              border: `2px solid ${alpha(C.rose, 0.6)}`,
              background: `linear-gradient(90deg, ${alpha(C.rose, 0.12)} 0%, ${alpha(C.ink900, 0.96)} 70%)`,
              boxShadow: `0 24px 60px ${alpha('#000000', 0.4)}`,
            }}
          >
            <FoxGlyph size={128} />
            <div style={{ whiteSpace: 'nowrap' }}>
              <div style={{ fontSize: 70, fontWeight: 900, letterSpacing: 2, lineHeight: 1.05, color: '#fecdd3' }}>{EMBER.name}</div>
              <div style={{ marginTop: 10, fontSize: 38, fontWeight: 650, color: C.text }}>
                {EMBER.role} <span style={{ color: C.faint }}>·</span> <span style={{ color: C.roseSoft }}>{EMBER.craft}</span>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* The CISO's question, parked top left */}
      {cisoIn > 0 ? (
        <div style={{ position: 'absolute', left: 0, top: 40, opacity: 1 - goOut, transform: `translateY(${(1 - cisoIn) * 20}px)`, ...dimStyle(0.45 * progress(frame, data, 16), cisoIn) }}>
          <CisoStrip width={470} question={['¿qué sabemos', 'de esto?']} questionShow={[1, progress(frame, askAt, 14)]} questionSize={46} show={1} />
        </div>
      ) : null}

      {/* The staircase behind the cards */}
      {frame >= data - 12 ? (
        <svg width={W} height={STAGE.height} style={{ position: 'absolute', left: 0, top: 0, opacity: 0.5 * (1 - 0.92 * goOut) }}>
          <path
            d={`M0 664H500V574H1060V484H${W}`}
            fill="none"
            stroke={C.ink600}
            strokeWidth={6}
            strokeLinejoin="round"
            strokeDasharray={2600}
            strokeDashoffset={2600 * (1 - progress(frame, data - 12, 60, EASE.inOut))}
          />
        </svg>
      ) : null}

      {/* DATA */}
      {frame >= data - 6 ? (
        <Rung i={0} show={progress(frame, data - 4, 16)} focus={focusData} dim={Math.max(dimData, goOut)} out={goOut}>
          <Line at={logAt} frame={frame} top={IP_ROW + 66} size={34} color={C.textStrong} weight={750}>
            una IP en un log
          </Line>
          <Line at={rawAt} frame={frame} top={IP_ROW + 66 + 48} size={30} color={C.muted} weight={600}>
            hecho crudo, sin contexto
          </Line>
        </Rung>
      ) : null}

      {/* INFORMATION */}
      {frame >= info - 6 ? (
        <Rung i={1} show={progress(frame, info - 4, 16)} focus={focusInfo} dim={Math.max(dimInfo, goOut)} out={goOut}>
          <Line at={phishAt} frame={frame} top={IP_ROW + 66} size={34} color={C.textStrong} weight={750} wrap>
            {PHISH}
          </Line>
          <Line at={glossInfoAt} frame={frame} top={IP_ROW + 66 + 92} size={28} color={C.muted} weight={600} wrap>
            {INFO_GLOSS}
          </Line>
        </Rung>
      ) : null}

      {/* INTELLIGENCE */}
      {frame >= intel - 6 ? (
        <Rung i={2} show={progress(frame, intel - 4, 16)} focus={focusIntel} dim={goOut} out={goOut}>
          <Line at={intel + 8} frame={frame} top={IP_ROW + 64} size={30} color={C.text} weight={650} wrap mono={false}>
            {ENGLISH.map((p, k) => {
              const at = [assessAt, likelyAt, recommendAt];
              const on = 'mark' in p ? progress(frame, at[p.mark], 10) : 0;
              return 'mark' in p ? (
                <span
                  key={k}
                  style={{
                    padding: '1px 8px',
                    margin: '0 -2px',
                    borderRadius: 10,
                    fontWeight: 850,
                    color: on > 0.5 ? '#ecfdf5' : C.text,
                    background: alpha(C.emerald, 0.55 * on),
                    boxShadow: on > 0.05 ? `0 0 ${Math.round(24 * on)}px ${alpha(C.emerald, 0.55 * on)}` : undefined,
                  }}
                >
                  {p.t}
                </span>
              ) : (
                <span key={k}>{p.t}</span>
              );
            })}
          </Line>
          <Line at={intel + 36} frame={frame} top={IP_ROW + 64 + 176} size={26} color={C.muted} weight={550} wrap>
            {GLOSS}
          </Line>
        </Rung>
      ) : null}

      {/* The IP: pinned in each rung it has reached, climbing between them */}
      {frame >= ipWord ? (
        <>
          <Pin pos={chipAt(0)} show={progress(frame, ipWord, 12)} dim={Math.max(g1.t * 0.65, goOut)} />
          {g1.t > 0 && g1.t < 1 ? <Pin pos={{ x: g1.x, y: g1.y }} show={1} /> : null}
          {g1.t >= 1 ? <Pin pos={chipAt(1)} show={1} dim={Math.max(g2.t * 0.65, goOut)} /> : null}
          {g2.t > 0 && g2.t < 1 ? <Pin pos={{ x: g2.x, y: g2.y }} show={1} /> : null}
          {g2.t >= 1 ? <Pin pos={chipAt(2)} show={1} dim={goOut} /> : null}
        </>
      ) : null}

      {/* The one sign that stays, and the exam trick under it */}
      {progress(frame, decision - 4, 16) > 0 ? <ChangeSign frame={frame} at={decision} trickAt={trickAt} /> : null}
    </Stage>
  );
}

/** One rung's card at its place on the staircase. */
function Rung({ i, show, focus, dim, out, children }: { i: 0 | 1 | 2; show: number; focus: number; dim: number; out: number; children: ReactNode }) {
  const c = CARD[i];
  return (
    <div style={{ position: 'absolute', left: c.x, top: c.y, opacity: 1 - 0.93 * out }}>
      <RungCard rung={RUNGS[i]} w={c.w} h={c.h} focus={focus} dim={dim} show={show}>
        <div style={{ position: 'relative' }}>{children}</div>
      </RungCard>
    </div>
  );
}

/** A line of a rung's body: absolute within the card body, fades in at `at`. */
function Line({ at, frame, top, size, color, weight, wrap = false, mono = false, children }: { at: number; frame: number; top: number; size: number; color: string; weight: number; wrap?: boolean; mono?: boolean; children: ReactNode }) {
  const e = enter(frame, at, { distance: 10, duration: 14 });
  const style: CSSProperties = {
    position: 'absolute',
    left: 0,
    top: top - 56,
    right: 0,
    fontSize: size,
    fontWeight: weight,
    lineHeight: 1.3,
    color,
    whiteSpace: wrap ? 'normal' : 'nowrap',
    fontFamily: mono ? FONT.mono : FONT.sans,
    ...e,
  };
  return <div style={style}>{children}</div>;
}

/** The IP chip at stage position `pos` (the chip's top-left). */
function Pin({ pos, show, dim = 0 }: { pos: { x: number; y: number }; show: number; dim?: number }) {
  return (
    <div style={{ position: 'absolute', left: pos.x, top: pos.y, opacity: show, transform: `scale(${0.9 + 0.1 * show})`, transformOrigin: '0 50%' }}>
      <IpChip ip={IP} dim={dim} />
    </div>
  );
}

function ChangeSign({ frame, at, trickAt }: { frame: number; at: number; trickAt: number }) {
  const p = progress(frame, at - 2, 18);
  const trick = progress(frame, trickAt, 16);
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: W, height: STAGE.height, fontFamily: FONT.sans, opacity: p }}>
      <div
        style={{
          position: 'absolute',
          left: (W - 1280) / 2,
          top: 130,
          width: 1280,
          boxSizing: 'border-box',
          padding: '34px 56px 38px',
          borderRadius: 32,
          border: `3px solid ${alpha(C.emerald, 0.7)}`,
          background: `linear-gradient(180deg, ${alpha(C.emerald, 0.12)} 0%, ${alpha(C.ink900, 0.96)} 70%)`,
          boxShadow: `0 0 50px ${alpha(C.emerald, 0.2)}, 0 30px 70px ${alpha('#000000', 0.45)}`,
          textAlign: 'center',
          transform: `translateY(${(1 - p) * 22}px)`,
        }}
      >
        <div style={{ fontSize: 58, fontWeight: 850, letterSpacing: -1, lineHeight: 1.18, color: C.textStrong }}>
          <span style={{ color: C.muted, fontWeight: 700 }}>lo que cambia:</span> alguien <span style={{ color: C.emerald }}>analiza y juzga</span>
          <br />
          qué significan los datos, <span style={{ color: C.emerald }}>para decidir</span>
        </div>
      </div>
      {trick > 0 ? (
        <div style={{ position: 'absolute', left: (W - 1280) / 2, top: 398, width: 1280, opacity: trick, transform: `translateY(${(1 - trick) * 16}px)` }}>
          <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: 4, color: C.faint, textAlign: 'center', marginBottom: 14 }}>EL TRUCO DE EXAMEN</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <TrickRow q="¿juicio analítico, «probablemente» o recomendación?" a="inteligencia" tone={C.emerald} />
            <TrickRow q="¿hecho suelto?" a="dato o información" tone={C.cyan} />
          </div>
        </div>
      ) : null}
    </div>
  );
}

function TrickRow({ q, a, tone }: { q: string; a: string; tone: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 20, padding: '10px 28px', borderRadius: RADIUS.md, background: alpha(C.ink800, 0.7), border: `2px solid ${C.ink700}`, whiteSpace: 'nowrap' }}>
      <span style={{ fontSize: 32, fontWeight: 650, color: C.text, flex: 1 }}>{q}</span>
      <span style={{ fontSize: 34, fontWeight: 850, color: tone, padding: '2px 22px', borderRadius: 999, border: `2px solid ${alpha(tone, 0.7)}`, background: alpha(tone, 0.12) }}>{a}</span>
    </div>
  );
}

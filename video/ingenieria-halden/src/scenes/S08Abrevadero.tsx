import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { PersonArt, PondArt } from './parts/Images';
import { CaseStamp, Pill, TermName } from './parts/Labels';
import { ImageTag } from './parts/Tags';
import { FakeWeb, WaveWeb } from './parts/Web';
import { Stage, wordFrame } from './kit';

const S = 's08-abrevadero';
const PILL_X = 860;
const ROW_Y = [214, 344];
const POND_W = 1100;
const POND_X = (1728 - POND_W) / 2;
const POND_Y = 0;

/** An address drawn as a scheme: grey bars around one glyph («o» or «0»), no domain. */
function AddressPill({ glyph, tone, ring }: { glyph: string; tone: string; ring: number }) {
  const bar = (w: number) => <span style={{ display: 'inline-block', width: w, height: 16, borderRadius: 8, background: alpha(C.text, 0.4) }} />;
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, height: 86, padding: '0 30px', borderRadius: 999, background: C.ink900, border: `3px solid ${alpha(tone, 0.6)}`, fontFamily: FONT.mono }}>
      {bar(120)}
      {bar(36)}
      <span
        style={{
          display: 'inline-grid',
          placeItems: 'center',
          width: 76,
          height: 76,
          borderRadius: 14,
          fontSize: 74,
          lineHeight: 1,
          fontWeight: 800,
          color: tone,
          border: `3px solid ${alpha(tone, 0.9 * ring)}`,
          background: alpha(tone, 0.12 * ring),
          boxShadow: ring > 0.02 ? `0 0 24px ${alpha(tone, 0.35 * ring)}` : undefined,
        }}
      >
        {glyph}
      </span>
      {bar(90)}
      <span style={{ fontSize: 40, fontWeight: 800, color: C.muted }}>.</span>
      {bar(54)}
    </div>
  );
}

/**
 * s08-abrevadero «Dónde te esperan». `address`: the web of s07, small, and its address as a scheme with no domain —
 * «la dirección del puerto» and under it «la misma, con una o cambiada por un cero»; `letter` rings the «o» and the
 * «0». `typo`: TYPOSQUATTING «espera a quien teclea deprisa o lee rápido». `real-site` («supuesto · imagina»): the
 * wave-forecast web, real, with nothing fake, that half the port reads every morning; `waves` slips malicious code
 * into it. `wait`: WATERING HOLE. `pond`: the watering hole («imagen · no es del puerto») — the fake puddle beside it
 * (typosquatting) and the usual one poisoned (watering hole); the predator does not chase, it waits.
 */
export function S08Abrevadero(props: SceneProps) {
  const frame = useCurrentFrame();
  const addrAt = props.cue('address') - 6;
  const sameAt = wordFrame(S, 's08-01', 'parece') - 6;
  const letterAt = props.cue('letter') - 4;
  const typoAt = props.cue('typo') - 4;
  const realAt = props.cue('real-site') - 6;
  const wavesAt = props.cue('waves') - 4;
  const codeAt = wordFrame(S, 's08-03', 'código') - 6;
  const morningAt = wordFrame(S, 's08-03', 'mañana') - 10;
  const realWordAt = wordFrame(S, 's08-04', 'verdad') - 8;
  const waitAt = props.cue('wait') - 4;
  const pondAt = props.cue('pond') - 6;
  const fakeAt = wordFrame(S, 's08-05', 'falso') - 8;
  const poisonAt = wordFrame(S, 's08-05', 'envenenan') - 6;

  const p1 = progress(frame, addrAt, 14) * (1 - progress(frame, realAt - 14, 14, EASE.inOut));
  const row0 = progress(frame, addrAt + 6, 14);
  const row1 = progress(frame, Math.max(addrAt + 20, sameAt), 14);
  const ring = progress(frame, letterAt, 12);
  const typo = enter(frame, typoAt, { distance: 16, duration: 16 });
  const p2 = progress(frame, realAt, 16) * (1 - progress(frame, pondAt - 14, 14, EASE.inOut));
  const poison = progress(frame, Math.max(wavesAt, codeAt), 18);
  const visitors = progress(frame, morningAt, 16);
  const realChip = progress(frame, realAt + 10, 14);
  const wait = enter(frame, waitAt, { distance: 16, duration: 16 });
  const pond = progress(frame, pondAt, 18);

  return (
    <Stage>
      {/* phase 1: the address, as a scheme */}
      {p1 > 0.001 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: p1, fontFamily: FONT.sans, whiteSpace: 'nowrap' }}>
          <div style={{ position: 'absolute', left: 0, top: 0, transformOrigin: '0 0', transform: 'scale(0.42)' }}>
            <FakeWeb width={860} rim={C.rose} />
          </div>
          <div style={{ position: 'absolute', left: 0, top: ROW_Y[0] + 22, fontSize: 40, fontWeight: 800, color: C.cyanSoft, opacity: row0 }}>la dirección del puerto</div>
          <div style={{ position: 'absolute', left: PILL_X, top: ROW_Y[0], opacity: row0 }}>
            <AddressPill glyph="o" tone={C.cyan} ring={ring} />
          </div>
          <div style={{ position: 'absolute', left: 0, top: ROW_Y[1] + 22, fontSize: 40, fontWeight: 800, color: C.roseSoft, opacity: row1 }}>la misma, con una o cambiada por un cero</div>
          <div style={{ position: 'absolute', left: PILL_X, top: ROW_Y[1], opacity: row1 }}>
            <AddressPill glyph="0" tone={C.rose} ring={ring} />
          </div>
          {frame >= typoAt - 2 ? (
            <div style={{ position: 'absolute', left: 0, top: 480, ...typo }}>
              <TermName term="TYPOSQUATTING" gloss="espera a quien teclea deprisa o lee rápido" size={54} />
            </div>
          ) : null}
        </div>
      ) : null}

      {/* phase 2: the real wave-forecast web, poisoned */}
      {p2 > 0.001 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: p2 }}>
          <div style={{ position: 'absolute', left: 0, top: 0 }}>
            <CaseStamp what="Supuesto" kind="imagina" tone={C.amber} icon="eye" />
          </div>
          <div style={{ position: 'absolute', left: 0, top: 96 }}>
            <WaveWeb width={820} poison={poison} />
          </div>
          <div style={{ position: 'absolute', left: 880, top: 110, display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'flex-start' }}>
            <div style={{ opacity: realChip }}>
              <Pill text="la de verdad · nada falso" tone={C.sky} icon="globe" size={34} on={progress(frame, realWordAt, 12)} />
            </div>
            <div style={{ opacity: poison }}>
              <Pill text="código malicioso" tone={C.rose} icon="alert" size={34} />
            </div>
          </div>
          {visitors > 0.001 ? (
            <div style={{ position: 'absolute', left: 880, top: 270, display: 'flex', gap: 18, opacity: visitors }}>
              {[0, 1, 2, 3].map((i) => (
                <div key={i} style={{ opacity: progress(frame, morningAt + i * 6, 12) }}>
                  <PersonArt size={78} tone={C.cyan} />
                </div>
              ))}
            </div>
          ) : null}
          {frame >= waitAt - 2 ? (
            <div style={{ position: 'absolute', left: 880, top: 400, ...wait }}>
              <TermName term="WATERING HOLE" gloss="envenenan el sitio de siempre" size={56} />
            </div>
          ) : null}
        </div>
      ) : null}

      {/* phase 3: the watering hole */}
      {pond > 0.001 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: pond, fontFamily: FONT.sans, whiteSpace: 'nowrap' }}>
          <div style={{ position: 'absolute', left: POND_X, top: POND_Y }}>
            <PondArt width={POND_W} fake={progress(frame, fakeAt, 14)} poison={progress(frame, poisonAt, 30)} eyes={progress(frame, pondAt + 24, 16)} />
          </div>
          {[
            { lines: ['charco falso', 'typosquatting'], cx: POND_X + (200 / 900) * POND_W, at: fakeAt, tone: C.roseSoft },
            { lines: ['el de siempre, envenenado', 'watering hole'], cx: POND_X + (630 / 900) * POND_W, at: poisonAt, tone: C.roseSoft },
          ].map((l) => (
            <div key={l.lines[0]} style={{ position: 'absolute', left: l.cx, top: 478, transform: 'translateX(-50%)', textAlign: 'center', opacity: progress(frame, l.at, 14) }}>
              <div style={{ fontSize: 36, fontWeight: 800, color: C.text }}>{l.lines[0]}</div>
              <div style={{ fontSize: 36, fontWeight: 850, color: '#c4b5fd' }}>{l.lines[1]}</div>
            </div>
          ))}
          <div style={{ position: 'absolute', left: 0, top: 0 }}>
            <ImageTag />
          </div>
        </div>
      ) : null}
    </Stage>
  );
}

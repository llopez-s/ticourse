import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { Icon } from '../../../engine/src/ui';
import { APPS_WITH_LIBRARY, LIBRARY, PANELS, STAMP, WHO } from '../data/s04-aplicacion';
import { CaseStamp, Pill, TermChip } from './parts/Bits';
import { CasaTile, type CasaKind } from './parts/Casa';
import { ImageTag } from './parts/Tags';
import { Stage, wordFrame } from './kit';

const S = 's04-aplicacion';
const W = STAGE.width;

const GAP = 24;
const PANEL_W = (W - 2 * GAP) / 3;
const PANEL_Y = 80;
const PANEL_H = 432;
const PAD = 24;
const INNER_W = PANEL_W - 2 * PAD;
const AREA_Y = 108;
const FIND_Y = 232;
const TERM_Y = 368;
const HOUSE_Y = 528;
const HOUSE_W = 150;
const HOUSE_KIND: CasaKind[] = ['planos', 'grifo', 'lista'];
const panelX = (i: number) => i * (PANEL_W + GAP);

/**
 * s04-aplicacion «Una aplicación por dentro y en marcha». «Caso de ejemplo · sin fecha»: Desarrollo prepares one of the
 * port's own applications (no name). Three panels light in turn, the others dimmed. `code`: «El código · antes de
 * desplegar» — lines of code read without running; on «contraseña» the hard-coded password lights, then «cifrado
 * obsoleto», and a third warning is struck out as noise; SAST lands on its word (`sast`). `running`: «La aplicación en
 * marcha · desde fuera, sin el código» — requests go in and responses come back; «la sesión no caduca» on its word, then
 * «inicio de sesión sin límite de intentos»; DAST on its word (`dast`). `parts`: «La lista de componentes · SBOM» — a
 * third-party library gets a newly announced flaw and, on «cuáles la llevan», the applications that carry it light up;
 * package monitoring on its word (`sbom`). On `house` every panel is back to full and la casa in miniature lands under
 * each (labelled «imagen · no es del puerto»): the plans, the taps, the materials list.
 */
export function S04Aplicacion(props: SceneProps) {
  const frame = useCurrentFrame();
  const panelAt = [props.cue('code'), props.cue('running'), props.cue('parts')];
  const houseAt = props.cue('house');
  const termAt = PANELS.map((p) => wordFrame(S, p.termSeg, p.termWord) - 6);
  const houseWordAt = [wordFrame(S, 's04-06', 'planos') - 6, wordFrame(S, 's04-06', 'grifos') - 6, wordFrame(S, 's04-06', 'hecha') + 4];
  const flawAt = wordFrame(S, 's04-04', 'pieza') - 6;
  const appsAt = wordFrame(S, 's04-04', 'cuáles') - 6;
  const sbomAt = wordFrame(S, 's04-05', 'SBOM') - 6;
  const reqAt = wordFrame(S, 's04-03', 'peticiones') - 6;

  // Focus: the panel the voice is on, the rest at half; on `house` everything back to full.
  const all = progress(frame, houseAt - 6, 16, EASE.inOut);
  const focusOf = (i: number) => {
    const on = progress(frame, panelAt[i] - 6, 14);
    const next = panelAt[i + 1];
    const past = next !== undefined ? progress(frame, next - 6, 14, EASE.inOut) : 0;
    return on * (1 - past);
  };
  const dimOf = (i: number) => (1 - all) * (1 - focusOf(i)) * 0.6;
  const startedOf = (i: number) => Math.max(progress(frame, panelAt[i] - 6, 14), all);

  // Findings: each on its word, or a beat after the one before.
  const findAt = PANELS.map((p, i) => {
    const out: number[] = [];
    p.findings.forEach((f, k) => {
      out.push(f.seg && f.word ? wordFrame(S, f.seg, f.word) - 6 : (out[k - 1] ?? panelAt[i]) + 20);
    });
    return out;
  });

  const stampIn = enter(frame, -6, { distance: 14, duration: 16 });

  return (
    <Stage>
      <div style={{ position: 'absolute', left: 0, top: 0, display: 'flex', gap: 18, alignItems: 'center', ...stampIn }}>
        <CaseStamp what={STAMP.what} kind={STAMP.kind} size={30} />
        <Pill text={WHO} tone={C.cyan} icon="users" size={30} />
      </div>
      {frame >= houseAt - 4 ? (
        <div style={{ position: 'absolute', right: 0, top: 10, ...enter(frame, houseAt, { distance: 10 }) }}>
          <ImageTag />
        </div>
      ) : null}

      {PANELS.map((p, i) => {
        const d = dimOf(i);
        const started = startedOf(i);
        const focus = Math.max(focusOf(i), all * 0.4);
        const tone = i === 2 ? C.rose : C.amber;
        return (
          <div
            key={p.head}
            style={{
              position: 'absolute',
              left: panelX(i),
              top: PANEL_Y,
              width: PANEL_W,
              height: PANEL_H,
              boxSizing: 'border-box',
              padding: `18px ${PAD}px`,
              borderRadius: RADIUS.lg,
              border: `3px solid ${alpha(C.cyan, 0.2 + 0.55 * focus)}`,
              background: `linear-gradient(180deg, ${C.ink850} 0%, ${C.ink900} 100%)`,
              boxShadow: focus > 0.05 ? `0 0 ${Math.round(30 * focus)}px ${alpha(C.cyan, 0.16)}` : undefined,
              fontFamily: FONT.sans,
              opacity: 0.45 + 0.55 * Math.max(started, 1 - d),
              filter: d > 0.01 ? `saturate(${1 - 0.5 * d}) brightness(${1 - 0.5 * d})` : undefined,
            }}
          >
            <div style={{ fontSize: 40, fontWeight: 850, color: C.textStrong, whiteSpace: 'nowrap' }}>{p.head}</div>
            <div style={{ marginTop: 2, fontSize: 30, fontWeight: 700, color: i === 2 ? C.violet : C.muted, whiteSpace: 'nowrap', opacity: i === 2 ? progress(frame, sbomAt, 12) * 0.6 + 0.4 : 1 }}>{p.sub}</div>

            {/* the panel's picture */}
            <div style={{ position: 'absolute', left: PAD, top: AREA_Y, width: INNER_W, height: FIND_Y - AREA_Y - 12 }}>
              {i === 0 ? <CodeArea frame={frame} at={panelAt[0]} hotAt={findAt[0][0]} /> : null}
              {i === 1 ? <RequestArea frame={frame} at={reqAt} /> : null}
              {i === 2 ? <LibraryArea frame={frame} at={panelAt[2]} flawAt={flawAt} /> : null}
            </div>

            {/* findings (panels 1 and 2) or the applications that carry the library (panel 3) */}
            <div style={{ position: 'absolute', left: PAD, top: FIND_Y, width: INNER_W }}>
              {p.findings.map((f, k) => {
                const at = findAt[i][k];
                if (frame < at - 2) return null;
                const e = enter(frame, at, { distance: 12, axis: 'x' });
                const strike = f.noise ? progress(frame, at + 14, 12) : 0;
                return (
                  <div key={f.text} style={{ marginBottom: 8, display: 'flex', alignItems: 'flex-start', gap: 10, ...e }}>
                    <Icon name={f.noise ? 'x' : 'alert'} size={30} color={f.noise ? C.faint : tone} style={{ flexShrink: 0, marginTop: 3 }} />
                    <span
                      style={{
                        position: 'relative',
                        fontSize: 30,
                        fontWeight: 750,
                        lineHeight: 1.18,
                        color: f.noise ? C.muted : C.textStrong,
                      }}
                    >
                      {f.text}
                      {f.noise ? <span style={{ position: 'absolute', left: -4, top: '52%', height: 3, width: `calc(${strike * 100}% + 8px)`, background: C.muted }} /> : null}
                    </span>
                  </div>
                );
              })}
              {i === 2 ? <AppsRow frame={frame} at={panelAt[2] + 30} litAt={appsAt} /> : null}
            </div>

            {/* the English name, on its word */}
            {frame >= termAt[i] - 2 ? (
              <div style={{ position: 'absolute', left: PAD, top: TERM_Y, ...enter(frame, termAt[i], { distance: 12 }) }}>
                <TermChip text={p.term} size={30} on={progress(frame, termAt[i], 12) * (1 - 0.4 * all)} />
              </div>
            ) : null}
          </div>
        );
      })}

      {/* la casa, under each panel */}
      {PANELS.map((p, i) => {
        const at = Math.min(houseWordAt[i], houseAt + 10 + i * 14);
        if (frame < at - 4) return null;
        const e = enter(frame, at, { distance: 14 });
        return (
          <div key={p.house} style={{ position: 'absolute', left: panelX(i) + 6, top: HOUSE_Y, display: 'flex', alignItems: 'center', gap: 16, ...e }}>
            <CasaTile kind={HOUSE_KIND[i]} width={HOUSE_W} glow={progress(frame, houseWordAt[i], 12)} />
            <span style={{ fontFamily: FONT.sans, fontSize: 32, fontWeight: 800, color: C.text, whiteSpace: 'nowrap' }}>{p.house}</span>
          </div>
        );
      })}
    </Stage>
  );
}

/** Lines of code read without running them; one line (the password) lights amber on its word. */
function CodeArea({ frame, at, hotAt }: { frame: number; at: number; hotAt: number }) {
  const lines = [
    [0, 140, 90],
    [1, 220],
    [1, 120, 130],
    [2, 180],
    [1, 160, 60],
    [0, 60],
  ];
  const hot = progress(frame, hotAt, 12);
  const scan = progress(frame, at + 6, 60, EASE.inOut);
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: 12, background: C.ink950, border: `2px solid ${C.ink700}`, overflow: 'hidden' }}>
      {lines.map(([indent, a, b], k) => {
        const isHot = k === 2;
        return (
          <div key={k} style={{ position: 'absolute', left: 18 + indent * 28, top: 12 + k * 17, display: 'flex', gap: 10, height: 10 }}>
            <div style={{ width: a, height: 10, borderRadius: 5, background: isHot ? alpha(C.amber, 0.35 + 0.6 * hot) : alpha(C.cyan, 0.35) }} />
            {b ? <div style={{ width: b, height: 10, borderRadius: 5, background: isHot ? alpha(C.amber, 0.25 + 0.6 * hot) : alpha(C.text, 0.22) }} /> : null}
          </div>
        );
      })}
      {/* the reader passing down the code, never running it */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 6 + scan * 94, height: 3, background: alpha(C.cyan, 0.6 * (1 - progress(frame, at + 70, 10))) }} />
    </div>
  );
}

/** A probe sends requests to the running application and reads its responses: no code in sight. */
function RequestArea({ frame, at }: { frame: number; at: number }) {
  const on = progress(frame, at - 10, 12);
  const t = Math.max(0, frame - at);
  const packets = [0, 1, 2].map((k) => ((t + k * 24) % 72) / 72);
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', opacity: 0.4 + 0.6 * on }}>
      <div style={{ position: 'absolute', left: 0, top: 10, width: 92, height: 92, borderRadius: 20, border: `3px solid ${alpha(C.cyan, 0.7)}`, background: alpha(C.cyan, 0.08), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon name="search" size={54} color={C.cyan} />
      </div>
      <div style={{ position: 'absolute', right: 0, top: 0, width: 150, height: 112, borderRadius: 14, border: `3px solid ${alpha(C.sky, 0.7)}`, background: C.ink850, overflow: 'hidden' }}>
        <div style={{ height: 22, borderBottom: `2px solid ${C.ink700}`, display: 'flex', gap: 6, alignItems: 'center', paddingLeft: 10 }}>
          {[0, 1, 2].map((k) => (
            <div key={k} style={{ width: 8, height: 8, borderRadius: 4, background: alpha(C.muted, 0.6) }} />
          ))}
        </div>
        <div style={{ margin: '12px 12px 0', height: 12, width: 80, borderRadius: 6, background: alpha(C.sky, 0.5) }} />
        <div style={{ margin: '10px 12px 0', height: 10, width: 110, borderRadius: 5, background: alpha(C.text, 0.22) }} />
        <div style={{ margin: '8px 12px 0', height: 10, width: 90, borderRadius: 5, background: alpha(C.text, 0.18) }} />
        {/* the play mark: it is running */}
        <div style={{ position: 'absolute', right: 8, bottom: 8 }}>
          <Icon name="play" size={24} color={C.emerald} />
        </div>
      </div>
      <svg width={INNER_W} height={112} style={{ position: 'absolute', left: 0, top: 0 }}>
        <line x1={104} y1={38} x2={INNER_W - 160} y2={38} stroke={alpha(C.cyan, 0.45)} strokeWidth={3} />
        <line x1={104} y1={76} x2={INNER_W - 160} y2={76} stroke={alpha(C.sky, 0.45)} strokeWidth={3} />
        {/* arrowheads drawn as paths */}
        <path d={`M ${INNER_W - 172} 30 L ${INNER_W - 158} 38 L ${INNER_W - 172} 46 Z`} fill={alpha(C.cyan, 0.7)} />
        <path d={`M 116 68 L 102 76 L 116 84 Z`} fill={alpha(C.sky, 0.7)} />
        {on > 0.5
          ? packets.map((p, k) => (
              <g key={k}>
                <circle cx={104 + p * (INNER_W - 264)} cy={38} r={6} fill={C.cyan} />
                <circle cx={INNER_W - 160 - p * (INNER_W - 264)} cy={76} r={6} fill={C.sky} />
              </g>
            ))
          : null}
      </svg>
    </div>
  );
}

/** A third-party library block; on its word a newly announced flaw lands on it (rose). */
function LibraryArea({ frame, at, flawAt }: { frame: number; at: number; flawAt: number }) {
  const on = progress(frame, at - 6, 14);
  const flaw = progress(frame, flawAt, 12);
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', opacity: 0.4 + 0.6 * on, fontFamily: FONT.sans }}>
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 6,
          display: 'inline-flex',
          alignItems: 'center',
          gap: 12,
          padding: '12px 20px',
          borderRadius: 14,
          border: `3px solid ${alpha(flaw > 0.02 ? C.rose : C.muted, 0.5 + 0.4 * flaw)}`,
          background: alpha(flaw > 0.02 ? C.rose : C.muted, 0.08 + 0.08 * flaw),
          fontSize: 30,
          fontWeight: 750,
          color: C.textStrong,
          whiteSpace: 'nowrap',
        }}
      >
        <Icon name="layers" size={34} color={flaw > 0.02 ? C.rose : C.muted} />
        {LIBRARY.name}
      </div>
      {frame >= flawAt - 2 ? (
        <div style={{ position: 'absolute', left: 0, top: 80, display: 'flex', alignItems: 'center', gap: 10, fontSize: 30, fontWeight: 800, color: C.roseSoft, whiteSpace: 'nowrap', ...enter(frame, flawAt, { distance: 10 }) }}>
          <Icon name="alert" size={30} color={C.rose} />
          {LIBRARY.flaw}
        </div>
      ) : null}
    </div>
  );
}

/** The port's applications in a row; the ones that carry the library light rose on «cuáles la llevan». */
function AppsRow({ frame, at, litAt }: { frame: number; at: number; litAt: number }) {
  const lit = progress(frame, litAt, 14);
  const n = APPS_WITH_LIBRARY.length;
  const size = 82;
  const gap = (INNER_W - n * size) / (n - 1);
  return (
    <div style={{ position: 'relative', width: INNER_W, height: 120, fontFamily: FONT.sans }}>
      {APPS_WITH_LIBRARY.map((has, k) => {
        const e = progress(frame, at + k * 5, 12);
        const l = has ? lit : 0;
        return (
          <div
            key={k}
            style={{
              position: 'absolute',
              left: k * (size + gap),
              top: 0,
              width: size,
              height: size,
              borderRadius: 16,
              border: `3px solid ${alpha(l > 0.02 ? C.rose : C.sky, 0.45 + 0.5 * Math.max(l, 0.1))}`,
              background: alpha(l > 0.02 ? C.rose : C.sky, 0.06 + 0.14 * l),
              boxShadow: l > 0.02 ? `0 0 ${Math.round(18 * l)}px ${alpha(C.rose, 0.35 * l)}` : undefined,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: e * (1 - 0.45 * lit * (has ? 0 : 1)),
            }}
          >
            <Icon name="app" size={46} color={l > 0.02 ? C.roseSoft : C.sky} />
          </div>
        );
      })}
      <div style={{ position: 'absolute', left: 0, top: size + 6, fontSize: 26, fontWeight: 650, color: C.muted, whiteSpace: 'nowrap', opacity: progress(frame, at, 12) }}>{LIBRARY.apps}</div>
    </div>
  );
}


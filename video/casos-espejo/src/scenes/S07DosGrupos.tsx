import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../engine/src/theme/motion';
import { Icon, type IconName } from '../../../engine/src/ui';
import { Card, Choices, Disc, Pop } from './parts/bits';
import { COAT_COLORS, CoatRack } from './parts/CoatRack';
import { Stage, segment, wordFrame } from './kit';

const S = 's07-dos-grupos';
const W = STAGE.width;

const SETS: readonly {
  label: string;
  sub?: string;
  color: string;
  x: number;
  icons: readonly { icon: IconName; text: string }[];
}[] = [
  { label: 'conjunto 1', sub: 'vinculado a Rusia', color: C.rose, x: 100, icons: [{ icon: 'gear', text: 'herramientas' }, { icon: 'network', text: 'infraestructura' }, { icon: 'brain', text: 'tradecraft' }] },
  { label: 'conjunto 2', color: C.amber, x: 888, icons: [{ icon: 'terminal', text: 'herramientas' }, { icon: 'cloud', text: 'infraestructura' }, { icon: 'eye', text: 'tradecraft' }] },
];

/**
 * s07-dos-grupos «Lo que apareció en la misma red». The box «red de la víctima · Democratic National
 * Committee, comité nacional del Partido Demócrata de EE. UU.» (no logos) on `dnc-case`. «conjunto 1»
 * («vinculado a Rusia») comes in with its tools, infrastructure and tradecraft as three icons; on `second`
 * «conjunto 2» enters with different icons; on `two-sets` a dotted line between them is struck out,
 * «sin coordinación aparente», and a grey strip says later public reports tied them to different services
 * (GRU y SVR). As the question comes («¿Los juntas?») everything steps down so the think prompt keeps the
 * top 176 px, and two boxes «juntar» / «separar» wait unmarked. On `dnc-answer` «separar» is ticked and each
 * set keeps its own colour. On `garage` the box leaves and the coat rack takes the stage: two different
 * coats on the same rack, «misma víctima: enlace débil · sin enlace fuerte no se agrupa (S4M4)».
 */
export function S07DosGrupos(props: SceneProps) {
  const frame = useCurrentFrame();
  const dnc = props.cue('dnc-case');
  const second = props.cue('second');
  const twoSets = props.cue('two-sets');
  const answer = props.cue('dnc-answer');
  const garage = props.cue('garage');

  const firstAt = Math.max(dnc + 24, wordFrame(S, 's07-02', 'grupo') - 8);
  const stripAt = segment(props, 's07-04').from;
  const askAt = segment(props, 's07-05').from;
  const shift = progress(frame, askAt - 8, 20, EASE.inOut) * 76;
  const sep = progress(frame, answer, 18, EASE.inOut);
  const leave = progress(frame, garage - 6, 16, EASE.inOut);
  const strike = progress(frame, twoSets, 18);
  const coat = [progress(frame, garage, 22, EASE.out), progress(frame, garage + 12, 22, EASE.out)] as const;

  return (
    <Stage>
      <div style={{ position: 'absolute', left: 0, top: 0, width: W, height: STAGE.height, transform: `translateY(${shift}px)`, opacity: 1 - leave, display: leave >= 1 ? 'none' : 'block' }}>
        {/* The victim's network */}
        <Pop at={dnc} frame={frame} x={60} y={8} w={1608} h={340} distance={26}>
          <div style={{ width: '100%', height: '100%', boxSizing: 'border-box', borderRadius: 28, border: `4px dashed ${alpha(C.cyan, 0.6)}`, background: alpha(C.cyan, 0.04), padding: '16px 34px', fontFamily: FONT.sans }}>
            <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: 4, color: C.cyanSoft, textTransform: 'uppercase' }}>red de la víctima</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 26 }}>
              <span style={{ fontSize: 54, fontWeight: 900, letterSpacing: -1, color: C.textStrong }}>Democratic National Committee</span>
            </div>
            <div style={{ fontSize: 30, fontWeight: 650, color: C.muted }}>comité nacional del Partido Demócrata de EE. UU.</div>
          </div>
        </Pop>

        {/* The two intrusion sets */}
        {SETS.map((s, i) => {
          const at = i === 0 ? firstAt : second;
          const win = i === 0 ? 1 : 1;
          return (
            <Pop key={s.label} at={at} frame={frame} x={s.x} y={178} w={640} h={156} distance={30} axis="x" style={{ opacity: win }}>
              <div style={{ width: '100%', height: '100%', boxSizing: 'border-box', borderRadius: 20, border: `3px solid ${alpha(s.color, 0.6 + 0.4 * sep)}`, background: `linear-gradient(180deg, ${alpha(s.color, 0.14 + 0.08 * sep)} 0%, ${alpha(C.ink900, 0.96)} 100%), ${C.ink900}`, boxShadow: sep > 0 ? `0 0 ${Math.round(30 * sep)}px ${alpha(s.color, 0.4 * sep)}` : undefined, padding: '10px 20px', fontFamily: FONT.sans }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 18 }}>
                  <span style={{ fontSize: 38, fontWeight: 900, color: s.color }}>{s.label}</span>
                  {s.sub ? <span style={{ fontSize: 28, fontWeight: 700, color: C.text }}>{s.sub}</span> : null}
                </div>
                <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between' }}>
                  {s.icons.map((ic, k) => {
                    const e = progress(frame, at + 8 + k * 7, 12);
                    return (
                      <div key={ic.text} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, width: 190, opacity: e, transform: `scale(${0.85 + 0.15 * e})` }}>
                        <Disc icon={ic.icon} size={66} tone={s.color} />
                        <span style={{ fontSize: 27, fontWeight: 700, color: C.text, whiteSpace: 'nowrap' }}>{ic.text}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Pop>
          );
        })}

        {/* Dotted link, struck out */}
        {strike > 0 ? (
          <div style={{ position: 'absolute', left: 744, top: 252, width: 140, height: 6, opacity: strike }}>
            <div style={{ height: 6, background: `repeating-linear-gradient(90deg, ${alpha(C.muted, 0.8)} 0 12px, transparent 12px 24px)` }} />
            <div style={{ position: 'absolute', left: 58, top: -26, width: 6, height: 58, background: C.rose, transform: 'rotate(40deg)', borderRadius: 3 }} />
          </div>
        ) : null}
        <Pop at={twoSets + 8} frame={frame} x={0} y={356} w={W} distance={10}>
          <div style={{ textAlign: 'center', fontFamily: FONT.sans, fontSize: 32, fontWeight: 750, color: C.muted }}>sin coordinación aparente</div>
        </Pop>

        {/* Grey strip */}
        <Pop at={stripAt} frame={frame} x={60} y={402} w={1608} h={72} distance={18}>
          <div style={{ width: '100%', height: '100%', boxSizing: 'border-box', borderRadius: RADIUS.md, background: alpha(C.muted, 0.14), border: `2px solid ${alpha(C.muted, 0.4)}`, display: 'flex', alignItems: 'center', gap: 18, padding: '0 26px', fontFamily: FONT.sans, fontSize: 32, fontWeight: 650, color: C.text, whiteSpace: 'nowrap' }}>
            <Icon name="file" size={40} color={C.muted} strokeWidth={2} />
            informes públicos posteriores los asociaron a servicios distintos <b style={{ color: C.textStrong }}>(GRU y SVR)</b>
          </div>
        </Pop>

        {/* The question */}
        <div style={{ position: 'absolute', left: 308, top: 492, width: 1112, height: 90 }}>
          {frame >= askAt ? <Choices frame={frame} at={askAt + 4} markAt={answer} options={['juntar', 'separar']} chosen={1} width={1112} height={90} /> : null}
        </div>
      </div>

      {/* The coat rack */}
      {leave > 0 ? (
        <>
          <Pop at={garage} frame={frame} x={60} y={70} distance={20}>
            <CoatRack show={coat} glow={0.5} scale={1.05} />
          </Pop>
          {COAT_COLORS.map((c, i) => (
            <Pop key={c} at={garage + 16 + i * 8} frame={frame} x={i === 0 ? 100 : 328} y={540} distance={10}>
              <span style={{ fontFamily: FONT.sans, fontSize: 32, fontWeight: 850, color: c, whiteSpace: 'nowrap' }}>conjunto {i + 1}</span>
            </Pop>
          ))}
          <Pop at={garage + 6} frame={frame} x={760} y={120} w={W - 760} distance={24}>
            <div style={{ fontFamily: FONT.sans }}>
              <div style={{ fontSize: 66, fontWeight: 900, letterSpacing: -1.5, lineHeight: 1.04, color: C.textStrong }}>
                misma víctima: <span style={{ color: C.amber }}>enlace débil</span>
              </div>
              <div style={{ marginTop: 26, fontSize: 48, fontWeight: 800, lineHeight: 1.1, color: C.text }}>
                sin enlace fuerte no se agrupa <span style={{ color: C.sky, fontWeight: 700 }}>(S4M4)</span>
              </div>
            </div>
          </Pop>
        </>
      ) : null}
    </Stage>
  );
}

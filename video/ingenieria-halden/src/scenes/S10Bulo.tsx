import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { PersonArt } from './parts/Images';
import { Caption, CaseStamp, Pill, TermName } from './parts/Labels';
import { Bubble, ChatWindow } from './parts/Messages';
import { CASE_TAG, ImageTag } from './parts/Tags';
import { Stage, wordFrame } from './kit';

const S = 's10-bulo';
const W = STAGE.width;
const CHAT_W = 640;
const CHAT_X = (W - CHAT_W) / 2;
const PORT_W = 1060;

/** The bulo's own tag inside its bubble. */
function BuloTag() {
  return (
    <span style={{ display: 'inline-block', marginTop: 10, padding: '2px 14px', borderRadius: 999, border: `2px solid ${alpha(C.rose, 0.8)}`, background: alpha(C.rose, 0.12), fontFamily: FONT.sans, fontSize: 30, fontWeight: 800, color: C.roseSoft }}>
      bulo
    </span>
  );
}

/** A person and the two lines under it. */
function Who({ tone, lines, size = 150 }: { tone: string; lines: string[]; size?: number }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, fontFamily: FONT.sans, whiteSpace: 'nowrap', textAlign: 'center' }}>
      <PersonArt size={size} tone={tone} />
      {lines.map((l, i) => (
        <div key={l} style={{ fontSize: 36, fontWeight: i === 0 ? 850 : 700, color: i === 0 ? tone : C.text, lineHeight: 1.15 }}>
          {l}
        </div>
      ))}
    </div>
  );
}

/**
 * s10-bulo «Quien lo inventa y quien lo reenvía». Until `family`, the fourth promise of s01, «si sabe que miente».
 * `family` («imagen · no es del puerto»): the family group's chat; `maker`: someone makes the bulo knowing it is a lie
 * (rose, its bubble tagged «bulo»); `forward`: the aunt forwards it, convinced (amber, «Reenviado»). `port` («caso de
 * ejemplo · sin fecha»): in a port team's group someone forwards in good faith «hoy no funciona el fichaje y no cuenta
 * la hora», «salió de un aviso viejo, mal leído». `intent`: «el mismo bulo · dos nombres · manda la intención»; `names`:
 * «lo reenvía creyéndoselo» MISINFORMATION and «lo inventó sabiendo que es falso» DISINFORMATION.
 */
export function S10Bulo(props: SceneProps) {
  const frame = useCurrentFrame();
  const familyAt = props.cue('family') - 6;
  const makerAt = props.cue('maker') - 4;
  const forwardAt = props.cue('forward') - 4;
  const portAt = props.cue('port') - 6;
  const fichajeAt = wordFrame(S, 's10-03', 'fichaje') - 10;
  const intentAt = props.cue('intent') - 4;
  const misAt = Math.max(props.cue('names') - 4, wordFrame(S, 's10-04', 'misinformation') - 8);
  const disAt = wordFrame(S, 's10-04', 'disinformation') - 8;

  const promise = progress(frame, -6, 14) * (1 - progress(frame, familyAt - 12, 12, EASE.inOut));
  const fam = progress(frame, familyAt, 16) * (1 - progress(frame, portAt - 14, 14, EASE.inOut));
  const maker = progress(frame, makerAt, 14);
  const forward = progress(frame, forwardAt, 14);
  const port = progress(frame, portAt, 16) * (1 - progress(frame, intentAt - 14, 14, EASE.inOut));
  const fichaje = progress(frame, fichajeAt, 14);
  const oldNote = progress(frame, fichajeAt + 50, 14);
  const intent = enter(frame, intentAt, { distance: 16, duration: 16 });
  const cols = progress(frame, intentAt + 8, 16);
  const mis = enter(frame, misAt, { distance: 16, duration: 14 });
  const dis = enter(frame, disAt, { distance: 16, duration: 14 });

  return (
    <Stage>
      {/* the fourth promise */}
      {promise > 0.001 ? (
        <div style={{ position: 'absolute', left: 0, top: 290, width: W, display: 'flex', justifyContent: 'center', opacity: promise }}>
          <Pill text="si sabe que miente" icon="eye" tone={C.cyan} size={52} height={86} />
        </div>
      ) : null}

      {/* the family group */}
      {fam > 0.001 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: fam }}>
          <div style={{ position: 'absolute', left: 0, top: 0 }}>
            <ImageTag />
          </div>
          <div style={{ position: 'absolute', left: CHAT_X, top: 70 }}>
            <ChatWindow title="grupo de la familia" width={CHAT_W} tone={C.cyan}>
              <Bubble tone={C.rose} bars={[400, 320, 360]} opacity={maker}>
                <BuloTag />
              </Bubble>
              <Bubble tone={C.amber} forwarded bars={[380, 300]} opacity={forward} style={{ alignSelf: 'flex-end', borderRadius: '22px 6px 22px 22px' }}>
                <BuloTag />
              </Bubble>
            </ChatWindow>
          </div>
          <div style={{ position: 'absolute', left: 30, top: 130, opacity: maker, transform: `translateX(${(1 - maker) * -20}px)` }}>
            <Who tone={C.rose} lines={['lo fabrica', 'sabiendo que es mentira']} />
          </div>
          <div style={{ position: 'absolute', right: 30, top: 130, opacity: forward, transform: `translateX(${(1 - forward) * 20}px)` }}>
            <Who tone={C.amber} lines={['tu tía lo reenvía', 'convencida']} />
          </div>
        </div>
      ) : null}

      {/* the port's group */}
      {port > 0.001 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: port, fontFamily: FONT.sans }}>
          <div style={{ position: 'absolute', left: 0, top: 0 }}>
            <CaseStamp what={CASE_TAG} tone={C.cyan} />
          </div>
          <div style={{ position: 'absolute', left: (W - PORT_W) / 2, top: 100 }}>
            <ChatWindow title="grupo de un equipo del puerto" width={PORT_W} tone={C.cyan}>
              <Bubble tone={C.cyan} bars={[420, 300]} />
              <Bubble tone={C.amber} forwarded opacity={fichaje}>
                <div style={{ marginTop: 8, fontSize: 40, fontWeight: 800, color: C.textStrong, whiteSpace: 'nowrap' }}>hoy no funciona el fichaje y no cuenta la hora</div>
              </Bubble>
            </ChatWindow>
          </div>
          <div style={{ position: 'absolute', left: 0, top: 500, width: W, display: 'flex', justifyContent: 'center', opacity: oldNote }}>
            <Caption text="salió de un aviso viejo, mal leído" icon="file" tone={C.amber} size={38} />
          </div>
        </div>
      ) : null}

      {/* the intention decides the name */}
      {frame >= intentAt - 2 ? (
        <div style={{ position: 'absolute', left: 0, top: 10, width: W, display: 'flex', justifyContent: 'center', ...intent }}>
          <Caption text="el mismo bulo · dos nombres · manda la intención" tone={C.violet} size={42} />
        </div>
      ) : null}
      {cols > 0.001 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: cols }}>
          {[
            { tone: C.amber, line: 'lo reenvía creyéndoselo', term: 'MISINFORMATION', e: mis, cx: 440 },
            { tone: C.rose, line: 'lo inventó sabiendo que es falso', term: 'DISINFORMATION', e: dis, cx: 1288 },
          ].map((c) => (
            <div key={c.term} style={{ position: 'absolute', left: c.cx, top: 130, transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
              <PersonArt size={140} tone={c.tone} />
              <div style={{ fontFamily: FONT.sans, fontSize: 40, fontWeight: 800, color: C.text, whiteSpace: 'nowrap' }}>{c.line}</div>
              <div style={{ opacity: c.e.opacity, transform: c.e.transform }}>
                <TermName term={c.term} size={58} />
              </div>
            </div>
          ))}
          <div style={{ position: 'absolute', left: W / 2 - 2, top: 140, width: 4, height: 440, borderRadius: 2, background: alpha(C.muted, 0.3) }} />
          <div style={{ position: 'absolute', left: W / 2, top: 180, transform: 'translateX(-50%)', padding: '6px 18px', borderRadius: RADIUS.pill, background: C.ink900, border: `2px solid ${alpha(C.rose, 0.7)}`, fontFamily: FONT.sans, fontSize: 32, fontWeight: 800, color: C.roseSoft }}>
            bulo
          </div>
        </div>
      ) : null}
    </Stage>
  );
}

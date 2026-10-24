import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { Icon } from '../../../engine/src/ui';
import { ALBUM_TITLE, POSTS, REQUEST } from '../data/s02-casa';
import { STAMP } from '../data/s01-hook';
import { Arrow } from './parts/Arrow';
import { CaseStamp } from './parts/Labels';
import { RoleCard } from './parts/RoleCard';
import { ListStrip } from './parts/Sheet';
import { Triptych } from './parts/Triptych';
import { AlbumCustodian, AlbumOwner, AlbumSteward } from './parts/Vignettes';
import { Stage, wordFrame } from './kit';

const S = 's02-casa';
const TOP = { y: 74, h: 80 } as const;
const ATT = { x: 0, w: 470 } as const;
const LIST = { x: 780, w: 660 } as const;
const LIST_CX = LIST.x + LIST.w / 2;
const CARD = { w: 560, h: 440, y: 206, xs: [0, 584, 1168] } as const;
const BUS_Y = 180;
const TONES = [C.cyan, C.sky, C.emerald] as const;

/**
 * s02-casa «Quién decide y quién aplica». The proposal stamp and the passenger list, faint, from the first frame. On
 * «Atención al Pasajero» its card comes in and on `request` an arrow asks for the list; «¿quién decide?» puts a question
 * mark on the line that will feed three cards, which wait as dashed outlines. On `owner`, `custodian` and `steward` each
 * card comes in on its own line of the list, its chips lit on the voice's words (aprueba accesos · clasifica · asume el
 * riesgo · rol de negocio / permiso · cifra · copias · aplica / formato de fecha · nombres · significado), the previous
 * card stepping back. The exam card lands on `steward-name`. On `album` the diagram folds away for the grandmother's
 * album («imagen · no es del puerto»): the grandmother, the grandson and the aunt, each lit on their word.
 */
export function S02Casa(props: SceneProps) {
  const frame = useCurrentFrame();
  const w = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);
  const requestAt = props.cue('request');
  const attAt = w('s02-01', 'Atención') - 6;
  const questionAt = w('s02-01', 'decide') - 4;
  const cardAt = [props.cue('owner'), props.cue('custodian'), props.cue('steward')];
  const stewardNameAt = props.cue('steward-name');
  const albumAt = props.cue('album');
  const out = progress(frame, albumAt - 16, 14, EASE.inOut);

  const reqArrow = progress(frame, requestAt - 4, 18);
  const qOn = progress(frame, questionAt, 10) * (1 - progress(frame, cardAt[0] - 4, 10));
  const listGlow = 0.2 + 0.8 * progress(frame, requestAt, 14);
  const dimOf = (i: number) => (i < 2 ? 0.55 * progress(frame, cardAt[i + 1] - 4, 12) * (1 - progress(frame, stewardNameAt, 14)) : 0);

  return (
    <Stage>
      {out < 1 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: 1 - out, fontFamily: FONT.sans }}>
          <div style={{ position: 'absolute', left: 0, top: 0, ...enter(frame, -6, { distance: 16, duration: 16 }) }}>
            <CaseStamp what={STAMP.what} kind={STAMP.kind} />
          </div>

          {/* Atención al Pasajero asks for the list */}
          {frame >= attAt - 2 ? (
            <div
              style={{
                position: 'absolute',
                left: ATT.x,
                top: TOP.y,
                width: ATT.w,
                height: TOP.h,
                boxSizing: 'border-box',
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                padding: '0 24px',
                borderRadius: 22,
                background: C.ink850,
                border: `3px solid ${alpha(C.sky, 0.7)}`,
                whiteSpace: 'nowrap',
                ...enter(frame, attAt, { distance: 14 }),
              }}
            >
              <Icon name="users" size={46} color={C.sky} strokeWidth={2.2} />
              <span style={{ fontSize: 34, fontWeight: 800, color: C.textStrong }}>{REQUEST.who}</span>
            </div>
          ) : null}
          {reqArrow > 0.01 ? (
            <div style={{ position: 'absolute', left: ATT.x + ATT.w + 20, top: TOP.y - 4, width: LIST.x - ATT.x - ATT.w - 40, textAlign: 'center', fontSize: 30, fontWeight: 700, color: C.muted, whiteSpace: 'nowrap', opacity: reqArrow }}>
              {REQUEST.what}
            </div>
          ) : null}
          <div style={{ position: 'absolute', left: LIST.x, top: TOP.y, opacity: 0.3 + 0.7 * enter(frame, -4, { duration: 14 }).opacity }}>
            <ListStrip width={LIST.w} height={TOP.h} glow={listGlow} />
          </div>

          {/* The line that will feed the three cards, with the question mark on it */}
          <svg width={1728} height={660} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
            <Arrow
              points={[
                [ATT.x + ATT.w + 8, TOP.y + TOP.h / 2 + 12],
                [LIST.x - 8, TOP.y + TOP.h / 2 + 12],
              ]}
              draw={reqArrow}
              color={C.sky}
              width={4}
            />
            {CARD.xs.map((x, i) => {
              const cx = x + CARD.w / 2;
              const pts: [number, number][] = [
                [LIST_CX, TOP.y + TOP.h],
                [LIST_CX, BUS_Y],
                [cx, BUS_Y],
                [cx, CARD.y],
              ];
              const lit = progress(frame, cardAt[i] - 6, 16);
              return (
                <g key={i}>
                  <Arrow points={pts} draw={progress(frame, requestAt + 20, 24)} color={alpha(C.muted, 0.35)} width={3} dashed />
                  <Arrow points={pts} draw={lit} color={TONES[i]} width={5} opacity={1 - 0.5 * progress(frame, stewardNameAt, 14) * (i < 2 ? 1 : 0)} />
                </g>
              );
            })}
          </svg>
          {qOn > 0.01 ? (
            <div
              style={{
                position: 'absolute',
                left: LIST_CX - 32,
                top: BUS_Y - 32,
                width: 64,
                height: 64,
                borderRadius: 32,
                display: 'grid',
                placeItems: 'center',
                background: C.ink900,
                border: `4px solid ${alpha(C.amber, 0.9)}`,
                boxShadow: `0 0 ${Math.round(26 * qOn)}px ${alpha(C.amber, 0.35)}`,
                fontSize: 44,
                fontWeight: 900,
                color: C.amber,
                opacity: qOn,
                transform: `scale(${0.7 + 0.3 * qOn})`,
              }}
            >
              ?
            </div>
          ) : null}

          {POSTS.map((p, i) => (
            <RoleCard
              key={p.id}
              frame={frame}
              x={CARD.xs[i]}
              y={CARD.y}
              width={CARD.w}
              height={CARD.h}
              at={cardAt[i]}
              termAt={w(p.seg, p.termWord) - 6}
              tone={TONES[i]}
              icon={p.icon}
              who={p.who}
              whoSize={32}
              term={p.term}
              chips={p.chips.map((c) => ({ text: c.text, at: w(p.seg, c.word) - 6 }))}
              skeleton={progress(frame, requestAt + 20, 16)}
              dim={dimOf(i)}
              glow={progress(frame, cardAt[i] + 6, 12) * (1 - dimOf(i))}
              chipSize={30}
            />
          ))}
        </div>
      ) : null}

      {frame >= albumAt - 8 ? (
        <Triptych
          frame={frame}
          startAt={albumAt}
          title={ALBUM_TITLE}
          panels={[
            { name: 'la abuela', term: 'owner', tone: C.cyan, art: (t) => <AlbumOwner t={t} />, caption: ['decide qué fotos', 'salen de casa'], at: w('s02-05', 'decide') - 8 },
            { name: 'el nieto', term: 'custodian', tone: C.sky, art: (t) => <AlbumCustodian t={t} />, caption: ['las escanea, las guarda', 'y les pone contraseña'], at: w('s02-05', 'escanea') - 8 },
            { name: 'la tía', term: 'steward', tone: C.emerald, art: (t) => <AlbumSteward t={t} />, caption: ['apunta detrás quién', 'aparece y en qué año'], at: w('s02-05', 'apunta') - 8 },
          ]}
        />
      ) : null}
    </Stage>
  );
}

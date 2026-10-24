import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { STAMP } from '../data/s01-hook';
import { BOARD, CENTRAL, CLUB_TITLE, COMMITTEE, REGULATOR } from '../data/s06-arriba';
import { Arrow } from './parts/Arrow';
import { CaseStamp, Pill } from './parts/Labels';
import { RoleCard } from './parts/RoleCard';
import { Triptych } from './parts/Triptych';
import { ClubBoard, ClubCommittee, ClubTownHall } from './parts/Vignettes';
import { Stage, wordFrame } from './kit';

const S = 's06-arriba';
const PORT = { x: 0, y: 78, w: 1060, h: 434 } as const;
const BOARD_BOX = { x: 24, y: 106, w: 1012, h: 150 } as const;
const COMMITTEE_BOX = { x: 24, y: 326, w: 1012, h: 160 } as const;
const REG = { x: 1100, y: 106, w: 628, h: 330 } as const;
const CHIP_Y = 548;

/**
 * s06-arriba «Quién decide arriba». The port is a dashed outline; on `board` the board's card comes in at the top
 * (aprueba · responde · supervisa), on `committee` the committee's under it with an arrow up for «recomienda», a dashed
 * one down for the work it is handed and the reminder «la delegación es de trabajo, no de responsabilidad» between the
 * two (a shield stays on the board). On `regulator` the national maritime authority's card comes in OUTSIDE the outline,
 * with an arrow into it and «gobierna desde fuera». On `central-chip` two chips say centralized and decentralized, no
 * long voice. On `club` the diagram folds away for the neighbourhood club («imagen · no es del puerto»): the board, the
 * party committee and the town hall, each lit on its word.
 */
export function S06Arriba(props: SceneProps) {
  const frame = useCurrentFrame();
  const w = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);
  const boardAt = props.cue('board');
  const committeeAt = props.cue('committee');
  const regulatorAt = props.cue('regulator');
  const centralAt = props.cue('central-chip');
  const clubAt = props.cue('club');
  const out = progress(frame, clubAt - 16, 14, EASE.inOut);
  const portIn = progress(frame, -6, 18);
  const upAt = w('s06-02', 'recomienda') - 8;
  const downAt = w('s06-02', 'delega') - 8;
  const fenceAt = w('s06-03', 'fuera') - 6;
  const shield = progress(frame, downAt + 10, 14);
  const boardDim = 0.45 * progress(frame, committeeAt - 4, 12) * (1 - progress(frame, regulatorAt, 14));
  const comDim = 0.45 * progress(frame, regulatorAt - 4, 12) * (1 - progress(frame, centralAt, 14));
  const centralOn = CENTRAL.map((c) => progress(frame, w('s06-04', c.word) - 6, 10));

  return (
    <Stage>
      {out < 1 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: 1 - out, fontFamily: FONT.sans }}>
          <div style={{ position: 'absolute', left: 0, top: 0, ...enter(frame, -6, { distance: 16, duration: 16 }) }}>
            <CaseStamp what={STAMP.what} kind={STAMP.kind} />
          </div>

          {/* The port: a dashed outline with a tab */}
          <div style={{ position: 'absolute', left: PORT.x, top: PORT.y, width: PORT.w, height: PORT.h, boxSizing: 'border-box', borderRadius: 30, border: `3px dashed ${alpha(C.cyan, 0.45)}`, opacity: 0.35 + 0.65 * portIn }} />
          <div style={{ position: 'absolute', left: 34, top: PORT.y - 20, padding: '0 14px', background: C.ink950, fontSize: 30, fontWeight: 800, color: C.cyanSoft, whiteSpace: 'nowrap', opacity: 0.35 + 0.65 * portIn }}>el puerto</div>

          <RoleCard
            frame={frame}
            x={BOARD_BOX.x}
            y={BOARD_BOX.y}
            width={BOARD_BOX.w}
            height={BOARD_BOX.h}
            at={boardAt}
            termAt={w('s06-01', 'board') - 6}
            tone={C.cyan}
            icon="users"
            who={BOARD.who}
            term={BOARD.term}
            chips={BOARD.chips.map((c) => ({ text: c.text, at: w(c.seg, c.word) - 6 }))}
            skeleton={portIn}
            dim={boardDim}
            glow={progress(frame, boardAt + 6, 12) * (1 - boardDim)}
            layout="row"
            chipSize={30}
          />
          <RoleCard
            frame={frame}
            x={COMMITTEE_BOX.x}
            y={COMMITTEE_BOX.y}
            width={COMMITTEE_BOX.w}
            height={COMMITTEE_BOX.h}
            at={committeeAt}
            termAt={w('s06-02', 'committee') - 6}
            tone={C.sky}
            icon="layers"
            who={COMMITTEE.who}
            term={COMMITTEE.term}
            chips={COMMITTEE.chips.map((c) => ({ text: c.text, at: w(c.seg, c.word) + (c.word === 'riesgos' ? 12 : 0) - 6 }))}
            skeleton={portIn}
            dim={comDim}
            glow={progress(frame, committeeAt + 6, 12) * (1 - comDim)}
            layout="row"
            chipSize={30}
          />

          {/* recommends up, hands work down, the responsibility stays */}
          <svg width={1728} height={660} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
            <Arrow
              points={[
                [100, COMMITTEE_BOX.y - 6],
                [100, BOARD_BOX.y + BOARD_BOX.h + 6],
              ]}
              draw={progress(frame, upAt, 18)}
              color={C.cyan}
              width={5}
            />
            <Arrow
              points={[
                [960, BOARD_BOX.y + BOARD_BOX.h + 6],
                [960, COMMITTEE_BOX.y - 6],
              ]}
              draw={progress(frame, downAt, 18)}
              color={C.sky}
              width={5}
              dashed
            />
            <Arrow
              points={[
                [REG.x - 8, 250],
                [PORT.x + PORT.w + 10, 250],
              ]}
              draw={progress(frame, regulatorAt + 20, 18)}
              color={C.sky}
              width={5}
              dashed
            />
          </svg>
          {frame >= downAt - 4 ? (
            <div style={{ position: 'absolute', left: 150, top: BOARD_BOX.y + BOARD_BOX.h + 14, width: 760, display: 'flex', justifyContent: 'center', ...enter(frame, downAt, { distance: 10 }) }}>
              <Pill text={COMMITTEE.delegation} tone={C.emerald} icon="shield" size={28} height={56} on={shield} />
            </div>
          ) : null}

          <RoleCard
            frame={frame}
            x={REG.x}
            y={REG.y}
            width={REG.w}
            height={REG.h}
            at={regulatorAt}
            termAt={w('s06-03', 'entity') - 6}
            tone={C.amber}
            icon="globe"
            who={REGULATOR.who}
            term={REGULATOR.term}
            chips={[{ text: REGULATOR.chip, at: w('s06-03', 'exigir') - 6, wrap: true }]}
            glow={progress(frame, regulatorAt + 6, 12)}
            termSize={38}
            chipSize={28}
          />
          {frame >= fenceAt - 4 ? (
            <div style={{ position: 'absolute', left: REG.x, top: REG.y + REG.h + 22, width: REG.w, textAlign: 'center', fontSize: 38, fontWeight: 850, color: C.amber, whiteSpace: 'nowrap', ...enter(frame, fenceAt, { distance: 12 }) }}>{REGULATOR.outside}</div>
          ) : null}

          {CENTRAL.map((c, i) => {
            if (frame < centralAt - 4 - 0 && centralOn[i] <= 0.01) return null;
            return (
              <div key={c.text} style={{ position: 'absolute', left: i === 0 ? 0 : 870, top: CHIP_Y, opacity: centralOn[i], transform: `translateY(${(1 - centralOn[i]) * 12}px)` }}>
                <Pill text={c.text} tone={i === 0 ? C.sky : C.amber} icon={c.icon} size={32} height={66} on={centralOn[i]} />
              </div>
            );
          })}
        </div>
      ) : null}

      {frame >= clubAt - 8 ? (
        <Triptych
          frame={frame}
          startAt={clubAt}
          title={CLUB_TITLE}
          panels={[
            { name: 'la junta', term: 'board', tone: C.cyan, art: (t) => <ClubBoard t={t} />, caption: ['aprueba', 'las cuentas'], at: w('s06-05', 'junta') - 8 },
            { name: 'la comisión de fiestas', term: 'committee', tone: C.sky, art: (t) => <ClubCommittee t={t} />, caption: ['prepara la fiesta', 'y propone a la junta'], at: w('s06-05', 'comisión') - 8 },
            { name: 'el ayuntamiento', term: 'government entity', tone: C.amber, art: (t) => <ClubTownHall t={t} />, caption: ['da la licencia del local', 'y fija sus normas'], at: w('s06-05', 'ayuntamiento') - 8 },
          ]}
        />
      ) : null}
    </Stage>
  );
}

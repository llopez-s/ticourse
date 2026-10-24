import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT } from '../../../engine/src/theme/tokens';
import { enter, progress } from '../../../engine/src/theme/motion';
import { CONTRACT, FINES, LICENSE, REPORTING, REPUTATION, SANCTIONS, SUPPOSE_TAG } from '../data/canon';
import { Salon } from './parts/Images';
import { ImageTag, Pill, SoftTag } from './parts/Labels';
import { COL_W, COL_X, ConsequenceCard, WhoHeader } from './parts/s04-cuesta/Bits';
import { Stage, wordFrame } from './kit';

const S = 's04-cuesta';
const HEAD_Y = 66;
const CARD_Y = 116;

/**
 * s04-cuesta «Lo que cuesta no cumplir». «Imagina que no se hiciera» with its tag «supuesto · sin efectos» from the
 * first frame: nothing here happens to the port. On `authority` the four «who imposes it» headers come in over three
 * columns (2 + 2 + 1 labels); then each consequence lands on its cue: FINES «dinero» · SANCTIONS «te prohíbe o te limita
 * algo» (col 1), LOSS OF LICENSE with the lesson's port example and CONTRACTUAL IMPACTS (col 2), REPUTATIONAL DAMAGE (col
 * 3). On `salon` the hair salon comes in, small, tagged «imagen · no es del puerto», and its badge pins itself on the
 * three consequences the voice runs through (multa · prohíbe · reseñas). On `reporting` the chip with internal and
 * external reporting comes in along the bottom.
 */
export function S04Cuesta(props: SceneProps) {
  const frame = useCurrentFrame();
  const w = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);
  const suppose = props.cue('suppose');
  const authority = props.cue('authority');
  const at = {
    fines: props.cue('fines'),
    sanctions: props.cue('sanctions'),
    license: props.cue('license'),
    contract: props.cue('contract'),
    reputation: props.cue('reputation'),
  };
  const salonAt = props.cue('salon');
  const reportingAt = props.cue('reporting');
  const multaAt = w('s04-07', 'multa') - 6;
  const prohibeAt = w('s04-07', 'prohíbe') - 6;
  const resenasAt = w('s04-07', 'reseñas') - 6;

  const headIn = enter(frame, Math.max(-6, suppose - 6), { distance: 14, duration: 16 });
  const tagIn = enter(frame, Math.max(4, suppose), { distance: 10, duration: 14 });
  const whoShow = [0, 1, 2, 3].map((i) => progress(frame, authority - 2 + i * 6, 14));

  // A card is bright from its cue until the next lands; once all are in, they rest at a middle level, and the salon pulses them.
  const order = [at.fines, at.sanctions, at.license, at.contract, at.reputation];
  const lit = order.map((t, i) => {
    const next = order[i + 1] ?? salonAt;
    return Math.max(progress(frame, t, 12) * (1 - 0.6 * progress(frame, next - 2, 12)), 0.3 * progress(frame, t, 12));
  });
  const pulse = (t: number) => progress(frame, t, 10) * (1 - progress(frame, t + 50, 24));
  const salonOn = [pulse(multaAt), pulse(prohibeAt), pulse(resenasAt)];
  const salonIn = progress(frame, salonAt - 4, 16);
  const repIn = progress(frame, reportingAt - 2, 16);

  const cardIn = (t: number) => enter(frame, t - 4, { distance: 16, duration: 16 });

  return (
    <Stage>
      {/* The hypothesis, before anything else */}
      <div style={{ position: 'absolute', left: 0, top: 0, display: 'flex', alignItems: 'center', gap: 30, ...headIn }}>
        <div style={{ fontFamily: FONT.sans, fontSize: 54, fontWeight: 900, letterSpacing: -1.5, color: C.textStrong, whiteSpace: 'nowrap' }}>Imagina que no se hiciera</div>
        <div style={{ ...tagIn }}>
          <SoftTag text={SUPPOSE_TAG} size={30} />
        </div>
      </div>

      {/* Column 1: a authority */}
      <div style={{ position: 'absolute', left: COL_X[0], top: HEAD_Y }}>
        <WhoHeader icon="flag" text="Una autoridad" show={whoShow[0]} />
      </div>
      {frame >= at.fines - 4 ? (
        <div style={{ position: 'absolute', left: COL_X[0], top: CARD_Y, ...cardIn(at.fines) }}>
          <ConsequenceCard c={FINES} height={120} on={lit[0]} salon={salonOn[0]} />
        </div>
      ) : null}
      {frame >= at.sanctions - 4 ? (
        <div style={{ position: 'absolute', left: COL_X[0], top: CARD_Y + 132, ...cardIn(at.sanctions) }}>
          <ConsequenceCard c={SANCTIONS} height={196} on={lit[1]} salon={salonOn[1]} />
        </div>
      ) : null}

      {/* Column 2: the one who gave the licence, and the other side of the contract */}
      <div style={{ position: 'absolute', left: COL_X[1], top: HEAD_Y }}>
        <WhoHeader icon="key" text="Quien te habilitó" show={whoShow[1]} />
      </div>
      {frame >= at.license - 4 ? (
        <div style={{ position: 'absolute', left: COL_X[1], top: CARD_Y, ...cardIn(at.license) }}>
          <ConsequenceCard c={LICENSE} height={192} on={lit[2]} />
        </div>
      ) : null}
      <div style={{ position: 'absolute', left: COL_X[1], top: CARD_Y + 204, opacity: whoShow[2], transform: `translateY(${(1 - whoShow[2]) * 10}px)` }}>
        <WhoHeader icon="link" text="La otra parte del contrato" show={1} />
      </div>
      {frame >= at.contract - 4 ? (
        <div style={{ position: 'absolute', left: COL_X[1], top: CARD_Y + 256, ...cardIn(at.contract) }}>
          <ConsequenceCard c={CONTRACT} height={196} on={lit[3]} />
        </div>
      ) : null}

      {/* Column 3: nobody formally, everybody in practice */}
      <div style={{ position: 'absolute', left: COL_X[2], top: HEAD_Y }}>
        <WhoHeader icon="users" text="Nadie formalmente" show={whoShow[3]} />
      </div>
      {frame >= at.reputation - 4 ? (
        <div style={{ position: 'absolute', left: COL_X[2], top: CARD_Y, ...cardIn(at.reputation) }}>
          <ConsequenceCard c={REPUTATION} height={120} on={lit[4]} salon={salonOn[2]} />
        </div>
      ) : null}

      {/* The hair salon, in miniature, with its tag under it */}
      {salonIn > 0.01 ? (
        <div style={{ position: 'absolute', left: COL_X[2], top: CARD_Y + 150, width: COL_W, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 14, opacity: salonIn, transform: `translateY(${(1 - salonIn) * 14}px)` }}>
          <Salon width={216} glow={0.4 * salonIn} />
          <ImageTag size={26} />
        </div>
      ) : null}

      {/* Reporting, along the bottom */}
      {repIn > 0.01 ? (
        <div style={{ position: 'absolute', left: 0, top: 590, width: 1728, display: 'flex', alignItems: 'center', gap: 18, opacity: repIn, transform: `translateY(${(1 - repIn) * 12}px)` }}>
          <Pill text={REPORTING[0]} tone={C.sky} icon="users" size={30} height={58} />
          <Pill text={REPORTING[1]} tone={C.sky} icon="mail" size={30} height={58} />
        </div>
      ) : null}
    </Stage>
  );
}

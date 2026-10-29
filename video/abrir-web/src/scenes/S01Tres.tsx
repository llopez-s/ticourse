import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, TYPE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { Icon, mix, windowWeight } from '../../../engine/src/ui';
import { Stage, wordFrame } from './kit';
import { BrowserWindow, PortalPage } from './parts/Browser';
import { CLOCK, PIECES, PORTAL } from './parts/data';
import { OfficePlan, PLAN_W } from './parts/OfficePlan';
import { Ribbon } from './parts/Ribbon';
import { Stopwatch } from './parts/Stopwatch';
import { WallClock } from './parts/WallClock';

const S = 's01-tres';

/**
 * s01-tres «Tres segundos». No seal (it starts in s02).
 *   page      the browser (neutral indicator, no padlock): the portal's address is typed and the page appears; a
 *             stopwatch stops at «3 s».
 *   title     browser and stopwatch dock in the corner; title + the (still unlit) ribbon.
 *   promise   the five boxes are pointed at one by one (still off) + «segunda visita · ¿qué no se repite?».
 *   rewind    «Todo empieza un poco antes»: the stopwatch rewinds only to 0, labelled «justo antes de pulsar Intro»
 *             (the three seconds start when Enter is pressed; booting takes far longer, so it never rewinds to the
 *             power-up); on «lunes» the wall clock reads 8:58 · lunes; the ribbon goes up to its place for the rest
 *             of the video.
 *   office    F1's office plan; the laptop powers up.
 */
export function S01Tres(props: SceneProps) {
  const frame = useCurrentFrame();
  const w = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);

  const page = props.cue('page');
  const title = props.cue('title');
  const promise = props.cue('promise');
  const rewind = props.cue('rewind');
  const office = props.cue('office');

  // ---- Typing and the stopwatch.
  const typeFrom = w('s01-01', 'escribes');
  const typeTo = w('s01-01', 'puerto') + 14;
  const pageAt = Math.max(page, w('s01-01', 'página'));
  const typed = PORTAL.host.slice(0, Math.ceil(PORTAL.host.length * progress(frame, typeFrom, typeTo - typeFrom, EASE.linear)));
  const running = 3 * progress(frame, typeFrom, pageAt - typeFrom, EASE.linear);
  const rewound = 1 - progress(frame, rewind + 10, 54, EASE.inOut);
  const seconds = frame < rewind ? running : 3 * rewound;

  // ---- Browser: big, then docked in the corner, then gone.
  const dock = progress(frame, title, 26, EASE.inOut);
  const browserScale = mix(0.86, 0.4, dock);
  const browserLeft = mix(100, 1290, dock);
  const browserTop = mix(80, 404, dock);
  const browserIn = progress(frame, 0, 22);
  const browserOut = progress(frame, rewind - 6, 16);
  const pageShow = progress(frame, pageAt, 14);

  // ---- Stopwatch position: centre-right, then the corner next to the browser, then back for the rewind.
  const toC = progress(frame, rewind - 4, 24, EASE.inOut);
  const swScale = mix(mix(1, 0.55, dock), 1, toC);
  const swLeft = mix(mix(1060, 1090, dock), 760, toC);
  const swTop = mix(mix(170, 424, dock), 190, toC);
  const swIn = progress(frame, 6, 18);
  const swOut = progress(frame, office - 14, 14);

  // ---- Title, ribbon and promise.
  const titleIn = enter(frame, title, { distance: 26, duration: 20 });
  const titleOut = 1 - progress(frame, rewind - 12, 14, EASE.inOut);
  const ribbonShow = progress(frame, title + 16, 16);
  const ribbonUp = progress(frame, rewind - 4, 26, EASE.inOut);
  const ribbonTop = mix(196, 0, ribbonUp);
  const pointStart = promise + 14;
  const point = Object.fromEntries(PIECES.map((p, i) => [p, windowWeight(frame, pointStart + i * 40, pointStart + i * 40 + 40, { ramp: 8, lead: 0 })]));
  const againAt = w('s01-02', 'repite') - 20;
  const again = progress(frame, againAt, 16);
  const chip1 = progress(frame, w('s01-03', 'comprueba') - 8, 14);
  const chip2 = progress(frame, w('s01-03', 'asegurar') - 20, 14);
  const textOut = titleOut;

  // ---- Wall clock and office.
  const clockAt = Math.max(rewind + 4, w('s01-04', 'lunes') - 8);
  const clockIn = progress(frame, clockAt, 18);
  const planShow = {
    office: progress(frame, office, 16),
    router: progress(frame, office + 10, 16),
    cloud: progress(frame, office + 20, 16),
    portal: progress(frame, office + 30, 16),
  };
  const power = progress(frame, office + 36, 18);

  return (
    <Stage>
      {/* browser */}
      {browserIn > 0 && browserOut < 1 ? (
        <div style={{ position: 'absolute', left: browserLeft, top: browserTop, opacity: browserIn * (1 - browserOut), transform: `translateY(${(1 - browserIn) * 20}px)` }}>
          <BrowserWindow scale={browserScale} url={typed} caret={frame < pageAt && frame >= typeFrom - 6} loading={progress(frame, typeFrom, pageAt - typeFrom, EASE.inOut) * (1 - pageShow)} glow={dock < 0.5 ? 0.25 : 0}>
            <PortalPage show={pageShow} />
          </BrowserWindow>
        </div>
      ) : null}

      {/* stopwatch */}
      {swIn > 0 && swOut < 1 ? (
        <div style={{ position: 'absolute', left: swLeft, top: swTop, opacity: swIn * (1 - swOut), transform: `scale(${swScale})`, transformOrigin: 'top left' }}>
          <Stopwatch
            seconds={seconds}
            rewind={progress(frame, rewind + 8, 10) * (1 - progress(frame, rewind + 66, 10))}
            caption="justo antes de pulsar Intro"
            captionShow={progress(frame, rewind + 50, 14)}
          />
        </div>
      ) : null}

      {/* title */}
      {frame >= title - 2 && textOut > 0 ? (
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 30,
            width: 1728,
            textAlign: 'center',
            fontFamily: FONT.sans,
            fontSize: 96,
            fontWeight: 850,
            letterSpacing: -2,
            color: C.textStrong,
            opacity: titleIn.opacity * textOut,
            transform: titleIn.transform,
          }}
        >
          Qué sucede al <span style={{ color: C.cyan }}>abrir una web</span>
        </div>
      ) : null}

      {/* the ribbon */}
      <Ribbon show={ribbonShow} point={point} style={{ top: ribbonTop }} />

      {/* promise */}
      {again > 0 && textOut > 0 ? (
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 296,
            width: 1728,
            display: 'flex',
            justifyContent: 'center',
            opacity: again * textOut,
            transform: `translateY(${(1 - again) * 12}px)`,
          }}
        >
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 14,
              padding: '6px 26px',
              borderRadius: RADIUS.pill,
              border: `2px solid ${alpha(C.muted, 0.55)}`,
              background: alpha(C.ink850, 0.9),
              fontFamily: FONT.sans,
              fontSize: TYPE.label,
              fontWeight: 700,
              color: C.text,
            }}
          >
            <Icon name="clock" size={34} color={C.cyanSoft} />
            segunda visita · ¿qué no se repite?
          </span>
        </div>
      ) : null}
      {(chip1 > 0 || chip2 > 0) && textOut > 0 ? (
        <div style={{ position: 'absolute', left: 60, top: 392, display: 'flex', gap: 24, opacity: textOut }}>
          <span
            style={{
              opacity: chip1,
              transform: `translateY(${(1 - chip1) * 12}px)`,
              padding: '6px 24px',
              borderRadius: RADIUS.pill,
              border: `2px solid ${alpha(C.emerald, 0.6)}`,
              background: alpha(C.emerald, 0.1),
              fontFamily: FONT.sans,
              fontSize: TYPE.label,
              fontWeight: 700,
              color: '#6ee7b7',
              whiteSpace: 'nowrap',
            }}
          >
            qué comprueba un certificado
          </span>
          <span
            style={{
              opacity: chip2,
              transform: `translateY(${(1 - chip2) * 12}px)`,
              padding: '6px 24px',
              borderRadius: RADIUS.pill,
              border: `2px solid ${alpha(C.amber, 0.6)}`,
              background: alpha(C.amber, 0.1),
              fontFamily: FONT.sans,
              fontSize: TYPE.label,
              fontWeight: 700,
              color: '#fcd34d',
              whiteSpace: 'nowrap',
            }}
          >
            qué no te puede asegurar
          </span>
        </div>
      ) : null}

      {/* wall clock + office */}
      {clockIn > 0 ? (
        <div style={{ position: 'absolute', left: 70, top: 130, opacity: clockIn, transform: `translateY(${(1 - clockIn) * 16}px)` }}>
          <WallClock minutes={CLOCK.boot} label={CLOCK.lunes} size={250} glow={windowWeight(frame, clockAt + 16, office, { ramp: 14 })} />
        </div>
      ) : null}
      {planShow.office > 0 ? (
        <div style={{ position: 'absolute', left: 1728 - PLAN_W - 20, top: 116 }}>
          <OfficePlan show={planShow} power={power} />
        </div>
      ) : null}
    </Stage>
  );
}

import type { ReactNode } from 'react';
import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../engine/src/theme/motion';
import { Icon, Redacted, mix } from '../../../engine/src/ui';
import { Stage } from './kit';
import { Answers } from './parts/Answers';
import { Pill } from './parts/Bits';
import { BrowserWindow, PortalPage, SiteIndicator } from './parts/Browser';
import { CertCard, type CertRow } from './parts/CertCard';
import { COPY_CERT, LOOKALIKE, PORTAL } from './parts/data';
import { DniCard } from './parts/Dni';
import { ImageTag } from './parts/Images';
import { Ribbon, ribbonLit } from './parts/Ribbon';
import { ImaginaSeal } from './parts/Seal';
import { thinkWindow } from './parts/think';

const S = 's10-correo';
const BROWSER = { left: 530, top: 190, scale: 0.7 };
const MONO = FONT.mono;

/** The look-alike domain with the zero wrapped in a span; amber (and heavier) once `amber` > 0.5. */
function lookUrl(amber: number, big?: number): ReactNode {
  const [a, b] = LOOKALIKE.host.split('0');
  return (
    <>
      {a}
      <span style={{ color: amber > 0.5 ? C.amber : undefined, fontWeight: amber > 0.5 ? 800 : undefined, fontSize: big }}>0</span>
      {b}
    </>
  );
}

/**
 * s10-correo «Un correo con enlace».
 *   mail       a mail with a link;  lookalike  the browser opens the copied portal at haldenp0rt.example (label under
 *              the mail: «ejemplo · no existe en el caso»);   valid  the indicator, the SAME neutral one as the real
 *              portal's (side by side); then the think prompt (ribbon hidden, answers in a column);
 *   not-enough the address bar grows (a big copy of it) next to the real domain; zero  the 0 turns amber;
 *   easy       the copy's certificate: the same card as s07, four drawn ticks in green, and the amber «pero ¿de quién?»;
 *   dni        the DNI of s07 for a moment (authentic is not the same as honest).
 */
export function S10Correo(props: SceneProps) {
  const frame = useCurrentFrame();
  const lookalike = props.cue('lookalike');
  const valid = props.cue('valid');
  const notEnough = props.cue('not-enough');
  const zero = props.cue('zero');
  const easy = props.cue('easy');
  const dni = props.cue('dni');
  const think = thinkWindow(S);

  const mailIn = progress(frame, 2, 14);
  const link = progress(frame, lookalike - 6, 14);
  const lookIn = progress(frame, lookalike, 18);
  const pageIn = progress(frame, lookalike + 10, 14);
  const validIn = progress(frame, valid, 14);
  const hide = progress(frame, think.from - 14, 10) * (1 - progress(frame, think.to + 4, 10));
  const answerIn: [number, number] = [progress(frame, think.from + 10, 14), progress(frame, think.from + 18, 14)];
  const reveal = progress(frame, notEnough + 4, 18);
  const answerOut = progress(frame, notEnough + 40, 14);

  const zoomIn = progress(frame, notEnough, 18);
  const zoomOut = progress(frame, easy - 10, 14);
  const zoom = zoomIn * (1 - zoomOut);
  const amber = progress(frame, zero, 12);
  const easyP = progress(frame, easy - 10, 24, EASE.inOut);
  const dniIn = progress(frame, dni, 16);

  // ---- The copy's certificate: the same four rows as s07, every tick green.
  const rowAt = [easy + 6, easy + 20, easy + 34, easy + 48];
  const rows: CertRow[] = [
    { lines: [<span key="a" style={{ fontFamily: MONO, fontSize: 30, fontWeight: 500 }}>{lookUrl(amber)}</span>], show: progress(frame, rowAt[0], 12), tick: progress(frame, rowAt[0] + 8, 16, EASE.inOut) },
    { lines: [COPY_CERT.sign], show: progress(frame, rowAt[1], 12), tick: progress(frame, rowAt[1] + 8, 16, EASE.inOut) },
    { lines: [COPY_CERT.dates], show: progress(frame, rowAt[2], 12), tick: progress(frame, rowAt[2] + 8, 16, EASE.inOut) },
    { lines: [COPY_CERT.revoc], show: progress(frame, rowAt[3], 12), tick: progress(frame, rowAt[3] + 8, 16, EASE.inOut) },
  ];
  const butWho = progress(frame, rowAt[3] + 26, 16);

  const browserScale = mix(BROWSER.scale, 0.4, easyP);
  const browserLeft = mix(BROWSER.left, 20, easyP);
  const browserTop = mix(BROWSER.top, 200, easyP);

  return (
    <Stage>
      <Ribbon lit={ribbonLit(frame, {}, ['DHCP', 'DNS', 'TCP', 'TLS', 'HTTP'])} show={1 - hide} />

      {/* the mail */}
      <div style={{ position: 'absolute', left: 0, top: 190, width: 500, opacity: mailIn * (1 - easyP) * (1 - 0.65 * zoom), transform: `translateY(${(1 - mailIn) * 14}px)` }}>
        <div style={{ borderRadius: RADIUS.lg, border: `3px solid ${C.ink600}`, background: alpha(C.ink900, 0.97), overflow: 'hidden', fontFamily: FONT.sans }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '12px 22px', background: alpha(C.sky, 0.12), borderBottom: `2px solid ${C.ink700}` }}>
            <Icon name="mail" size={40} color={C.sky} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Redacted width={190} height={16} tone="muted" strength={0.6} />
              <Redacted width={260} height={14} tone="muted" strength={0.4} />
            </div>
          </div>
          <div style={{ padding: '18px 22px 20px' }}>
            <div style={{ fontSize: 32, fontWeight: 700, color: C.text }}>Confirma tu reserva:</div>
            <div
              style={{
                marginTop: 12,
                display: 'inline-block',
                padding: '6px 14px',
                borderRadius: RADIUS.sm,
                background: alpha(C.cyan, 0.08 + 0.12 * link),
                border: `2px solid ${alpha(C.cyan, 0.3 + 0.6 * link)}`,
                fontFamily: MONO,
                fontSize: 29,
                fontWeight: 500,
                color: C.cyanSoft,
                textDecoration: 'underline',
                whiteSpace: 'nowrap',
              }}
            >
              {lookUrl(amber * (1 - easyP))}
            </div>
            <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Redacted width={420} height={14} tone="muted" strength={0.35} />
              <Redacted width={330} height={14} tone="muted" strength={0.3} />
            </div>
          </div>
        </div>
        <div style={{ marginTop: 22, opacity: lookIn }}>
          <Pill size={28} tone="#fcd34d" border={alpha(C.amber, 0.7)}>
            {LOOKALIKE.note}
          </Pill>
        </div>
      </div>

      {/* the browser: the copied portal */}
      {lookIn > 0.01 ? (
        <div style={{ position: 'absolute', left: browserLeft, top: browserTop, opacity: lookIn * (1 - 0.7 * zoom), transform: `translateX(${(1 - lookIn) * 30 * (1 - easyP)}px)` }}>
          <BrowserWindow scale={browserScale} url={lookUrl(amber)} loading={progress(frame, lookalike, 24) * (1 - progress(frame, lookalike + 28, 8))} urlZoom={zoomIn * (1 - zoomOut)} glow={0.15}>
            <PortalPage show={pageIn} />
          </BrowserWindow>
        </div>
      ) : null}

      {/* valid: the indicator is the same as the real portal's */}
      {validIn > 0.01 ? (
        <div style={{ position: 'absolute', left: 1262, top: 200, width: 440, opacity: validIn * (1 - zoomOut) * (1 - 0.6 * zoom), fontFamily: FONT.sans }}>
          {[
            { label: 'portal del puerto', host: PORTAL.host },
            { label: 'esta web', host: LOOKALIKE.host },
          ].map((r, i) => (
            <div key={r.label} style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 18, transform: `translateX(${(1 - validIn) * 20 * (i + 1)}px)` }}>
              <SiteIndicator size={64} />
              <span style={{ fontSize: 34, fontWeight: 750, color: C.textStrong }}>{r.label}</span>
            </div>
          ))}
          <div style={{ marginTop: 6, fontSize: 32, fontWeight: 700, color: '#6ee7b7' }}>el mismo indicador</div>
        </div>
      ) : null}

      {/* think answers (a column, because the browser takes the width) */}
      {frame >= think.from && answerOut < 1 ? (
        <div style={{ position: 'absolute', left: 1280, top: 436, opacity: 1 - answerOut }}>
          <Answers labels={['Sí', 'No basta']} show={answerIn} reveal={reveal} vertical />
        </div>
      ) : null}

      {/* not-enough: the address bar grows, next to the real domain */}
      {zoom > 0.01 ? (
        <div style={{ position: 'absolute', left: 250, top: 205, width: 1000, opacity: zoom, transform: `translateY(${(1 - zoomIn) * -14}px) scale(${0.96 + 0.04 * zoomIn})`, fontFamily: FONT.sans }}>
          <div style={{ padding: '22px 30px 24px', borderRadius: RADIUS.lg, border: `3px solid ${alpha(C.amber, 0.25 + 0.55 * amber)}`, background: alpha(C.ink950, 0.97), boxShadow: `0 30px 70px ${alpha('#000000', 0.5)}` }}>
            <BigUrl indicator color={C.textStrong}>
              {lookUrl(amber, 66)}
            </BigUrl>
            <div style={{ marginTop: 6, fontSize: 28, fontWeight: 700, color: amber > 0.5 ? '#fcd34d' : C.muted }}>{amber > 0.5 ? 'un cero, no una o' : 'esta web'}</div>
            <div style={{ height: 3, background: C.ink700, margin: '16px 0 18px' }} />
            <BigUrl color={C.muted}>
              {'haldenp'}
              <span style={{ color: C.cyanSoft, fontWeight: 800 }}>o</span>
              {'rt.example'}
            </BigUrl>
            <div style={{ marginTop: 6, fontSize: 28, fontWeight: 700, color: C.muted }}>el dominio del puerto</div>
          </div>
        </div>
      ) : null}

      {/* easy: the copy's certificate and «pero ¿de quién?» */}
      {easyP > 0.01 ? (
        <>
          <div style={{ position: 'absolute', left: 460, top: 100, opacity: easyP * (1 - 0.35 * dniIn), transform: `translateX(${(1 - easyP) * 40}px)` }}>
            <CertCard cn={lookUrl(amber)} rows={rows} width={710} />
          </div>
          <div style={{ position: 'absolute', left: 1210, top: 120, width: 500, opacity: butWho, transform: `translateY(${(1 - butWho) * 16}px)`, fontFamily: FONT.sans }}>
            <div style={{ fontSize: 66, fontWeight: 850, lineHeight: 1.05, letterSpacing: -1, color: C.amber, textShadow: `0 0 ${Math.round(24 * butWho)}px ${alpha(C.amber, 0.35)}` }}>
              <div>pero</div>
              <div>¿de quién?</div>
            </div>
          </div>
        </>
      ) : null}

      {/* dni: authentic is not honest */}
      {dniIn > 0.01 ? (
        <div style={{ position: 'absolute', left: 1230, top: 270, width: 480, opacity: dniIn, transform: `translateY(${(1 - dniIn) * 14}px)`, fontFamily: FONT.sans }}>
          <ImageTag />
          <div style={{ marginTop: 12 }}>
            <DniCard width={300} glow={0.5 * dniIn} />
          </div>
          <div style={{ marginTop: 20, display: 'flex', gap: 14 }}>
            <Pill size={32} tone="#6ee7b7" border={alpha(C.emerald, 0.8)}>
              auténtico
            </Pill>
            <Pill size={32} tone="#fcd34d" border={alpha(C.amber, 0.8)} show={progress(frame, dni + 24, 12)}>
              ¿honrado?
            </Pill>
          </div>
        </div>
      ) : null}

      <ImaginaSeal />
    </Stage>
  );
}

/** A big address field: the neutral indicator (optional) and the domain in mono. */
function BigUrl({ children, indicator = false, color }: { children: ReactNode; indicator?: boolean; color: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
      {indicator ? <SiteIndicator size={64} /> : <span style={{ width: 96, flexShrink: 0 }} />}
      <span style={{ fontFamily: MONO, fontSize: 62, fontWeight: 500, color, whiteSpace: 'nowrap' }}>{children}</span>
    </div>
  );
}

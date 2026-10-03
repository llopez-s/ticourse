import type { ReactNode } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress, pulse } from '../../../engine/src/theme/motion';
import { Icon, clamp01, dimStyle, mix, windowWeight } from '../../../engine/src/ui';
import { DIES, HOME, LANES, REDIRECT, SSO, TERMS, TRUST } from '../data/s04-saml';
import { PortBadge } from './parts/Badge';
import { LaneArrow, LaneBox, Lanes, laneX, stepWeights } from './parts/Lanes';
import { PassCard, passHeight } from './parts/PassCard';
import { Stage, wordFrame } from './kit';

const S = 's04-saml';
const W = 1728;
const H = 660;
const X = [laneX(0, W), laneX(1, W), laneX(2, W)] as const;

// Rows of the sequence (stage-local y).
const TRUST_Y = 146;
const R1_Y = 192;
const R2_Y = 300;
const R3_TOP = 330;
const R4_Y = 482;
const R5_Y = 590;
const BIG_PASS = { w: 470, top: 296 };
const MINI_W = 120;
const MINI_H = passHeight(MINI_W, true);
const REST_X = X[1] - 92; // where the pass rests at the partner

/**
 * s04-saml «Un pase firmado por tu casa». Three lanes — navegador ·
 * plataforma aduanera (the partner, sky) · IdP de Halden (cyan) — and the
 * steps light in turn while the earlier ones dim. open: the browser opens the
 * partner. redirect: «no te conozco: que responda tu casa», a dashed arrow to
 * the IdP. home: the password is typed only in the IdP lane («contraseña»,
 * never a second factor) with the lock «no sale de casa». assertion: the IdP
 * issues the signed pass. verify: the browser carries it to the partner, who
 * checks it against the dashed «confianza acordada antes» and opens.
 * federation: ASERCIÓN SAML and FEDERATION. sso: one entry at home lights
 * several webs at once, with the rule «este inicio de sesión debe llevar
 * segundo factor». dies (sfx block, on the cue): o.virta's disabled badge,
 * the IdP «no firma pases para esta cuenta», and — conditional, no attempt
 * drawn — «sin pase: acceso denegado» in the partner lane.
 */
export function S04Saml(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const w = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);

  const open = props.cue('open');
  const redirect = props.cue('redirect');
  const home = props.cue('home');
  const assertion = props.cue('assertion');
  const verify = props.cue('verify');
  const federation = props.cue('federation');
  const sso = props.cue('sso');
  const dies = props.cue('dies');

  // ---- Phase A: the sequence.
  const phaseAOut = progress(frame, sso - 10, 16, EASE.inOut);
  const steps = stepWeights(frame, [open, redirect, home, assertion, verify], { ramp: 12 });
  const stepDim = (i: number) => 0.75 * steps[i].dim;

  const openDraw = progress(frame, open + 6, 22, EASE.inOut);
  const bubbleIn = progress(frame, redirect, 14);
  const redirectDraw = progress(frame, w('s04-02', 'manda') - 4, 20, EASE.inOut);
  const homeIn = progress(frame, home - 4, 14);
  const dots = Math.max(0, Math.min(8, Math.floor((frame - home - 4) / 3)));
  const lockIn = progress(frame, w('s04-02', 'sale') - 6, 12);

  // The pass: big at the IdP, then a small pass carried by the browser to the partner.
  const passIn = progress(frame, assertion - 2, 16);
  const rowsAt = [w('s04-03', 'quién') - 4, w('s04-03', 'web') - 4, w('s04-03', 'cinco') - 4, w('s04-03', 'firma') - 2];
  const signAt = w('s04-03', 'firma') + 2;
  const shrinkAt = verify - 2;
  const shrink = progress(frame, shrinkAt, 14, EASE.inOut);
  const llevaAt = Math.max(shrinkAt + 24, w('s04-04', 'lleva') + 6);
  const socioAt = Math.max(llevaAt + 20, w('s04-04', 'socio') + 10);
  const t1 = progress(frame, shrinkAt + 12, llevaAt - (shrinkAt + 12), EASE.inOut);
  const t2 = progress(frame, llevaAt, 10, EASE.inOut);
  const t3 = progress(frame, llevaAt + 10, socioAt - (llevaAt + 10), EASE.inOut);
  const passX = t2 <= 0 ? mix(X[2], X[0], t1) : mix(X[0], REST_X, t3);
  const passY = mix(R4_Y, R5_Y, t2);
  const reconoce = w('s04-04', 'reconoce') - 4;
  const trustDraw = progress(frame, reconoce, 18, EASE.inOut);
  const sealCheck = windowWeight(frame, reconoce, w('s04-04', 'abre'), { ramp: 8 });
  const opened = progress(frame, w('s04-04', 'abre') - 4, 12);
  const assertTerm = progress(frame, w('s04-05', 'aserción') - 6, 14);
  const fedTerm = progress(frame, w('s04-05', 'federation') - 6, 14);
  const fedGlow = windowWeight(frame, w('s04-05', 'confianza') - 4, sso - 10, { ramp: 10 });

  // Lane halos follow the step.
  const g = (from: number, to: number) => windowWeight(frame, from, to, { ramp: 10 });
  const glow = [
    Math.max(g(open, open + 30), g(llevaAt - 20, llevaAt + 10)),
    Math.max(g(open + 14, redirect + 10), g(reconoce, federation)),
    Math.max(g(redirect + 10, verify)),
  ];

  // ---- Phase B: SSO.
  const ssoIn = progress(frame, sso - 4, 16) * (1 - progress(frame, dies - 12, 14, EASE.inOut));
  const websLit = progress(frame, w('s04-06', 'webs') - 6, 10);
  const ruleIn = progress(frame, w('s04-06', 'debe') - 8, 14);

  // ---- Phase C: the leaver's account.
  const diesIn = progress(frame, dies - 14, 14);
  const crossed = progress(frame, dies, 10, EASE.out);
  const refuseIn = progress(frame, dies, 10);
  const deniedAt = Math.max(dies + 8, w('s04-07', 'fuera') - 6);
  const deniedIn = progress(frame, deniedAt, 14);

  const headOpacity = 1 - 0.75 * ssoIn;
  const beat = 0.8 + 0.2 * pulse(frame, fps, 0.6);

  return (
    <Stage>
      <Lanes lanes={LANES} width={W} height={H} at={-24} glow={frame < sso ? glow : [0, 0, 0]} headOpacity={headOpacity} frame={frame}>
        {/* ================= Phase A: the sequence ================= */}
        {phaseAOut < 1 ? (
          <div style={{ position: 'absolute', inset: 0, opacity: 1 - phaseAOut }}>
            {/* open */}
            <LaneArrow x1={X[0] + 10} x2={X[1] - 12} y={R1_Y} draw={openDraw} color={C.sky} dim={stepDim(0)} />
            {openDraw > 0 ? (
              <div style={{ position: 'absolute', left: X[0] - 26, top: R1_Y - 26, ...dimStyle(stepDim(0), openDraw) }}>
                <Icon name="cursor" size={44} color={C.textStrong} strokeWidth={1.2} />
              </div>
            ) : null}

            {/* redirect: the partner's bubble, then the dashed arrow home */}
            {bubbleIn > 0 ? (
              <div
                style={{
                  position: 'absolute',
                  left: X[1] + 10,
                  top: R2_Y - 64,
                  width: X[2] - X[1] - 20,
                  display: 'flex',
                  justifyContent: 'center',
                  ...dimStyle(stepDim(1), bubbleIn),
                  transform: `translateY(${(1 - bubbleIn) * 10}px)`,
                }}
              >
                <span
                  style={{
                    padding: '6px 18px',
                    borderRadius: RADIUS.md,
                    border: `2px solid ${alpha(C.sky, 0.7)}`,
                    background: alpha(C.ink850, 0.96),
                    fontFamily: FONT.sans,
                    fontSize: 32,
                    fontWeight: 750,
                    color: '#bae6fd',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {REDIRECT}
                </span>
              </div>
            ) : null}
            <LaneArrow x1={X[1] + 10} x2={X[2] - 12} y={R2_Y} draw={redirectDraw} color={C.sky} dashed dim={stepDim(1)} />

            {/* home: the password, only at the IdP */}
            <LaneBox x={X[2]} y={R3_TOP} width={460} show={homeIn * (1 - passIn * (1 - shrink))} dim={stepDim(2)} color={C.cyan} glow={windowWeight(frame, home, assertion, { ramp: 10 })}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <span style={{ fontSize: 32, fontWeight: 700, color: C.muted, whiteSpace: 'nowrap' }}>{HOME.field}</span>
                <div style={{ flex: 1, height: 46, borderRadius: 10, border: `2px solid ${alpha(C.cyan, 0.5)}`, background: C.ink950, display: 'flex', alignItems: 'center', gap: 9, padding: '0 14px' }}>
                  {Array.from({ length: dots }, (_, i) => (
                    <span key={i} style={{ width: 13, height: 13, borderRadius: '50%', background: C.textStrong }} />
                  ))}
                </div>
              </div>
              <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 12, opacity: lockIn, whiteSpace: 'nowrap' }}>
                <Icon name="lock" size={36} color={C.cyan} strokeWidth={2.2} />
                <span style={{ fontSize: 32, fontWeight: 800, color: C.cyanSoft }}>{HOME.lock}</span>
              </div>
            </LaneBox>

            {/* assertion: the big signed pass at the IdP */}
            {passIn > 0 && shrink < 1 ? (
              <div
                style={{
                  position: 'absolute',
                  left: X[2] - BIG_PASS.w / 2,
                  top: BIG_PASS.top,
                  opacity: passIn * (1 - shrink),
                  transform: `translateY(${(1 - passIn) * 16 + shrink * (R4_Y - BIG_PASS.top - passHeight(BIG_PASS.w) / 2)}px) scale(${1 - 0.7 * shrink})`,
                  transformOrigin: 'center center',
                }}
              >
                <PassCard width={BIG_PASS.w} rowsAt={rowsAt} signAt={signAt} glow={progress(frame, signAt, 8) * (1 - progress(frame, signAt + 10, 20))} frame={frame} />
              </div>
            ) : null}

            {/* verify: carried by the browser to the partner */}
            <LaneArrow x1={X[2] - 10} x2={X[0] + 12} y={R4_Y} draw={t1} color={C.cyan} dim={0.4 * phaseAOut} />
            <LaneArrow x1={X[0] + 10} x2={X[1] - 12} y={R5_Y} draw={t3} color={C.cyan} />
            {shrink > 0 ? (
              <div style={{ position: 'absolute', left: passX - MINI_W / 2, top: passY - MINI_H / 2, opacity: shrink, zIndex: 2 }}>
                <PassCard width={MINI_W} mini glow={Math.max(sealCheck, fedGlow * 0.6) * beat} frame={frame} />
              </div>
            ) : null}

            {/* the trust agreed beforehand (partner – IdP) */}
            {trustDraw > 0 ? (
              <>
                <svg width={W} height={40} style={{ position: 'absolute', left: 0, top: TRUST_Y - 20, overflow: 'visible' }}>
                  <line
                    x1={X[1]}
                    y1={20}
                    x2={X[1] + (X[2] - X[1]) * trustDraw}
                    y2={20}
                    stroke={fedGlow > 0 ? C.violet : C.cyan}
                    strokeWidth={4}
                    strokeDasharray="12 10"
                    opacity={0.85}
                  />
                  <circle cx={X[1]} cy={20} r={8} fill={C.sky} opacity={trustDraw} />
                  <circle cx={X[2]} cy={20} r={8} fill={C.cyan} opacity={progress(frame, reconoce + 14, 6)} />
                </svg>
                <div style={{ position: 'absolute', left: X[1], top: TRUST_Y - 22, width: X[2] - X[1], display: 'flex', justifyContent: 'center', opacity: progress(frame, reconoce + 8, 12) }}>
                  <span
                    style={{
                      padding: '2px 16px',
                      borderRadius: RADIUS.pill,
                      background: C.ink950,
                      border: `2px solid ${alpha(C.cyan, 0.5)}`,
                      fontFamily: FONT.sans,
                      fontSize: 30,
                      fontWeight: 750,
                      color: C.cyanSoft,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {TRUST}
                  </span>
                </div>
              </>
            ) : null}

            {/* the partner opens */}
            {opened > 0 ? (
              <div
                style={{
                  position: 'absolute',
                  left: X[1] + 32,
                  top: R5_Y - 36,
                  width: 72,
                  height: 72,
                  borderRadius: '50%',
                  border: `4px solid ${C.emerald}`,
                  background: alpha(C.emeraldDeep, 0.6),
                  display: 'grid',
                  placeItems: 'center',
                  opacity: opened,
                  transform: `scale(${1.3 - 0.3 * opened})`,
                  boxShadow: `0 0 ${Math.round(24 * opened)}px ${alpha(C.emerald, 0.45)}`,
                }}
              >
                <Icon name="unlock" size={40} color={C.emerald} strokeWidth={2.4} />
              </div>
            ) : null}

            {/* federation: the two names */}
            {assertTerm > 0 ? (
              <div style={{ position: 'absolute', left: X[0], top: R5_Y - 82, width: REST_X - MINI_W / 2 - X[0] - 10, display: 'flex', justifyContent: 'center', ...enter(frame, w('s04-05', 'aserción') - 6, { distance: 10 }) }}>
                <TermChip>{TERMS.assertion}</TermChip>
              </div>
            ) : null}
            {fedTerm > 0 ? (
              <div style={{ position: 'absolute', left: X[1], top: TRUST_Y + 28, width: X[2] - X[1], display: 'flex', justifyContent: 'center', ...enter(frame, w('s04-05', 'federation') - 6, { distance: 10 }) }}>
                <TermChip>{TERMS.federation}</TermChip>
              </div>
            ) : null}
          </div>
        ) : null}

        {/* ================= Phase B: SSO ================= */}
        {ssoIn > 0 ? <SsoView frame={frame} show={ssoIn} websLit={websLit} ruleIn={ruleIn} ssoAt={sso} lineAt={w('s04-06', 'muchas') - 6} beat={beat} /> : null}

        {/* ================= Phase C: the leaver ================= */}
        {diesIn > 0 ? (
          <div style={{ position: 'absolute', inset: 0, opacity: diesIn }}>
            <div style={{ position: 'absolute', left: X[0] - 270, top: 280 }}>
              <PortBadge name={DIES.name} dept={DIES.dept} doors={Array.from({ length: 5 }, () => ({ label: '', tone: 'cyan' as const }))} width={540} scale={0.74} disabledAt={-1000} frame={frame} />
            </div>
            <div style={{ position: 'absolute', left: X[2] - 85, top: 230 }}>
              <PassCard width={170} mini crossed={crossed} frame={frame} />
            </div>
            <LaneBox x={X[2]} y={400} width={470} show={refuseIn} color={C.cyan}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 34, fontWeight: 800, color: C.textStrong, lineHeight: 1.15 }}>
                <Icon name="x" size={40} color={C.cyan} strokeWidth={2.6} />
                <span>{DIES.idp}</span>
              </div>
            </LaneBox>
            <LaneBox x={X[1]} y={350} width={470} show={deniedIn} color={C.rose}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 36, fontWeight: 850, color: C.roseSoft, whiteSpace: 'nowrap' }}>
                <Icon name="lock" size={40} color={C.rose} strokeWidth={2.4} />
                <span>{DIES.sp}</span>
              </div>
            </LaneBox>
          </div>
        ) : null}
      </Lanes>
    </Stage>
  );
}

function TermChip({ children }: { children: ReactNode }) {
  return (
    <span
      style={{
        padding: '6px 20px',
        borderRadius: RADIUS.pill,
        border: `2px solid ${alpha(C.violet, 0.85)}`,
        background: alpha(C.violetDeep, 0.85),
        fontFamily: FONT.sans,
        fontSize: 34,
        fontWeight: 850,
        letterSpacing: 1.5,
        color: '#c4b5fd',
        whiteSpace: 'nowrap',
        boxShadow: `0 0 22px ${alpha(C.violet, 0.3)}`,
      }}
    >
      {children}
    </span>
  );
}

/** SSO: one entry at home («contraseña» only) lights several webs at once; the rule as a rule card. */
function SsoView({
  frame,
  show,
  websLit,
  ruleIn,
  ssoAt,
  lineAt,
  beat,
}: {
  frame: number;
  show: number;
  websLit: number;
  ruleIn: number;
  ssoAt: number;
  lineAt: number;
  beat: number;
}) {
  const loginIn = progress(frame, ssoAt + 2, 14);
  const LOGIN = { x: 90, y: 300, w: 480, h: 132 };
  const TILE = { w: 560, h: 82 };
  const tiles = [0, 1, 2, 3].map((i) => ({ x: 1090, y: 262 + i * 98 }));
  const from = { x: LOGIN.x + LOGIN.w, y: LOGIN.y + LOGIN.h / 2 };
  const termIn = progress(frame, ssoAt + 8, 16);
  const lineIn = progress(frame, lineAt, 14);
  const draw = progress(frame, ssoAt + 14, 20, EASE.inOut);
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: show, fontFamily: FONT.sans }}>
      {/* Title: SSO and its line */}
      <div style={{ position: 'absolute', left: 0, top: 118, width: W, textAlign: 'center', ...enter(frame, ssoAt + 8, { distance: 14 }), opacity: termIn }}>
        <div style={{ fontSize: 72, fontWeight: 900, letterSpacing: 4, color: '#c4b5fd', lineHeight: 1, textShadow: `0 0 30px ${alpha(C.violet, 0.45)}` }}>{TERMS.sso}</div>
        <div style={{ marginTop: 10, fontSize: 40, fontWeight: 750, color: C.textStrong, opacity: lineIn, whiteSpace: 'nowrap' }}>{SSO.line}</div>
      </div>

      {/* Connectors */}
      <svg width={W} height={H} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        {tiles.map((t, i) => {
          const to = { x: t.x - 10, y: t.y + TILE.h / 2 };
          const mx = (from.x + to.x) / 2;
          const d = `M ${from.x} ${from.y} C ${mx} ${from.y}, ${mx} ${to.y}, ${to.x} ${to.y}`;
          return (
            <g key={i}>
              <path d={d} fill="none" stroke={alpha(C.cyan, 0.25)} strokeWidth={4} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - draw} />
              {websLit > 0 ? <path d={d} fill="none" stroke={C.cyan} strokeWidth={4} opacity={websLit * beat} /> : null}
            </g>
          );
        })}
      </svg>

      {/* The one entry at home */}
      <div
        style={{
          position: 'absolute',
          left: LOGIN.x,
          top: LOGIN.y,
          width: LOGIN.w,
          height: LOGIN.h,
          boxSizing: 'border-box',
          borderRadius: RADIUS.lg,
          border: `2px solid ${alpha(C.cyan, 0.5 + 0.4 * websLit)}`,
          background: `linear-gradient(180deg, ${C.ink800} 0%, ${C.ink900} 100%)`,
          boxShadow: websLit > 0 ? `0 0 ${Math.round(30 * websLit)}px ${alpha(C.cyan, 0.35 * websLit)}` : undefined,
          display: 'flex',
          alignItems: 'center',
          gap: 18,
          padding: '0 24px',
          opacity: loginIn,
        }}
      >
        <Icon name="shield" size={56} color={C.cyan} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 32, fontWeight: 700, color: C.muted }}>{HOME.field}</div>
          <div style={{ marginTop: 8, height: 40, borderRadius: 10, border: `2px solid ${alpha(C.cyan, 0.5)}`, background: C.ink950, display: 'flex', alignItems: 'center', gap: 9, padding: '0 14px' }}>
            {Array.from({ length: 8 }, (_, i) => (
              <span key={i} style={{ width: 12, height: 12, borderRadius: '50%', background: C.textStrong }} />
            ))}
          </div>
        </div>
      </div>

      {/* The webs */}
      {tiles.map((t, i) => {
        const p = progress(frame, ssoAt + 6 + i * 3, 14);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: t.x,
              top: t.y,
              width: TILE.w,
              height: TILE.h,
              boxSizing: 'border-box',
              borderRadius: RADIUS.md,
              border: `2px solid ${alpha(C.sky, 0.4 + 0.5 * websLit)}`,
              background: `linear-gradient(90deg, ${alpha(C.sky, 0.06 + 0.14 * websLit)} 0%, ${C.ink900} 100%), ${C.ink900}`,
              boxShadow: websLit > 0 ? `0 0 ${Math.round(26 * websLit * beat)}px ${alpha(C.sky, 0.35 * websLit)}` : undefined,
              opacity: p,
              overflow: 'hidden',
            }}
          >
            <div style={{ height: '100%', display: 'flex', alignItems: 'center', gap: 16, padding: '0 20px', whiteSpace: 'nowrap' }}>
              <div style={{ display: 'flex', gap: 6 }}>
                {[0, 1, 2].map((k) => (
                  <span key={k} style={{ width: 10, height: 10, borderRadius: '50%', background: alpha(C.muted, 0.6) }} />
                ))}
              </div>
              <Icon name="globe" size={42} color={C.sky} />
              {i === 0 ? <span style={{ fontSize: 32, fontWeight: 750, color: '#bae6fd' }}>{SSO.web}</span> : <span style={{ width: 150, height: 12, borderRadius: 6, background: alpha(C.sky, 0.3) }} />}
              <span style={{ flex: 1 }} />
              <Icon name={websLit > 0.5 ? 'unlock' : 'lock'} size={40} color={websLit > 0.5 ? C.emerald : C.faint} />
            </div>
          </div>
        );
      })}

      {/* The rule (a norm, not the state of Halden's IdP) */}
      {ruleIn > 0 ? (
        <div
          style={{
            position: 'absolute',
            left: LOGIN.x - 10,
            top: LOGIN.y + LOGIN.h + 40,
            width: LOGIN.w + 300,
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            padding: '14px 22px',
            boxSizing: 'border-box',
            borderRadius: RADIUS.md,
            border: `2px dashed ${alpha(C.amber, 0.75)}`,
            background: alpha(C.amberDeep, 0.25),
            opacity: clamp01(ruleIn),
            transform: `translateY(${(1 - ruleIn) * 12}px)`,
          }}
        >
          <Icon name="flag" size={40} color={C.amber} />
          <span style={{ fontSize: 34, fontWeight: 800, color: '#fcd34d', lineHeight: 1.15 }}>{SSO.rule}</span>
        </div>
      ) : null}
    </div>
  );
}

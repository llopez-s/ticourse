import type { ReactNode } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress, pulse } from '../../../engine/src/theme/motion';
import { Cursor, Icon, dimStyle, mix, windowWeight } from '../../../engine/src/ui';
import { APP, CALENDAR, CONSENT, CROSSED, DESK, LANES, OAUTH, OUT_OF_SCOPE, READ, REVOKE, TOKEN } from '../data/s05-oauth';
import { LaneArrow, LaneBox, Lanes, laneX } from './parts/Lanes';
import { DniCard, Keyring, Voucher, voucherHeight } from './parts/Voucher';
import { Stage, segment, wordFrame } from './kit';

const S = 's05-oauth';
const W = 1728;
const H = 660;
const X = [laneX(0, W), laneX(1, W), laneX(2, W)] as const;

// Phase 1 (below the intercept band, y >= 250).
const APP_CARD = { x: 60, y: 250, w: 700, h: 390 };
const PW_FIELD = { x: APP_CARD.x + 32, y: APP_CARD.y + 290, w: APP_CARD.w - 64, h: 66 };
const CAL_TILE = { x: 1010, y: 300, w: 540, h: 290 };
const PANEL = { x: 880, y: 256, w: 800 };

// Phase 2 rows (lane-local = stage-local).
const C1_Y = 160;
const CONSENT_TOP = 188;
const TOKEN_Y = 420;
const READ_Y = 486;
const MAIL_Y = 604;
const TOKEN_W = 520;
const VOUCHER_W = 700;

/**
 * s05-oauth «Un vale para recoger un paquete». app: «Planificador de
 * atraques · proveedor externo» asks for «usuario y contraseña del puerto» to
 * read the berth calendar (everything sits below the intercepted message's
 * band). crossed (sfx error, on the cue): the password field is struck and
 * the cost appears — «con tu contraseña: correo · archivos · todo», «y solo
 * se corta cambiándola». consent: the same three-lane style as s04 (app ·
 * IdP de Halden · calendario de atraques): the app sends you home, the
 * consent screen, «Permitir» pressed. token: the IdP (not the user) hands
 * the app «permiso, no contraseña»; scope: «alcance: calendario.leer · caduca:
 * 60 min», the calendar «leído», «correo · fuera de alcance». revoke (sfx
 * block, on the cue): «retirar permiso», the permit struck, «contraseña ·
 * intacta». authz: OAUTH «autoriza y delega · no autentica». note: the
 * concierge hands the neighbour a voucher for today's parcel — not the DNI,
 * not the keys.
 */
export function S05Oauth(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const w = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);
  const beat = 0.8 + 0.2 * pulse(frame, fps, 0.6);

  const app = props.cue('app');
  const crossed = props.cue('crossed');
  const consent = props.cue('consent');
  const token = props.cue('token');
  const scope = props.cue('scope');
  const revoke = props.cue('revoke');
  const authz = props.cue('authz');
  const note = props.cue('note');
  const seg5 = segment(props, 's05-05');

  // ---- Phase 1: the app asks for the password.
  const p1Out = progress(frame, consent - 12, 16, EASE.inOut);
  const appIn = progress(frame, Math.min(app - 8, -10), 16);
  const wantDraw = progress(frame, w('s05-01', 'leer') - 4, 22, EASE.inOut);
  const pwDots = Math.max(0, Math.min(8, Math.floor((frame - (w('s05-01', 'contraseña') - 2)) / 3)));
  const strike = progress(frame, crossed, 8, EASE.out);
  const calOut = progress(frame, crossed, 12, EASE.inOut);
  const leadIn = progress(frame, w('s05-02', 'contraseña') - 6, 12);
  const itemAt = CROSSED.items.map((it) => w('s05-02', it.word) - 6);
  const tailIn = progress(frame, w('s05-02', 'solo') - 6, 12);

  // ---- Phase 2: the OAuth flow in lanes.
  const lanesIn = consent - 8;
  const lanesOut = progress(frame, note - 10, 16, EASE.inOut);
  const lanesDim = 0.85 * progress(frame, authz - 4, 14, EASE.inOut);
  const sendDraw = progress(frame, w('s05-03', 'manda') - 4, 20, EASE.inOut);
  const consentIn = progress(frame, w('s05-03', 'pregunta') - 8, 14);
  const allowAt = w('s05-03', 'sí') - 2;
  const allowP = progress(frame, allowAt, 6);
  const consentDim = 0.6 * progress(frame, token, 14, EASE.inOut);
  const consentOut = progress(frame, seg5.from - 8, 14, EASE.inOut);
  const tokenDraw = progress(frame, token + 4, 22, EASE.inOut);
  const tokenX = mix(X[1] - 10, X[0], tokenDraw);
  const tokenTitleIn = progress(frame, w('s05-04', 'permiso') - 8, 12);
  const scopeRows = progress(frame, scope - 4, 16, EASE.inOut);
  const expiresIn = progress(frame, w('s05-04', 'caduca') - 6, 12);
  const readAt = w('s05-04', 'calendario') - 6;
  const readDraw = progress(frame, readAt, 18, EASE.inOut);
  const readDone = progress(frame, readAt + 16, 10);
  const mailAt = w('s05-05', 'correo') - 6;
  const mailDraw = progress(frame, mailAt, 14, EASE.inOut);
  const mailBlocked = progress(frame, mailAt + 12, 8);
  const revokePanelIn = progress(frame, revoke - 16, 12);
  const revokeHit = progress(frame, revoke, 8, EASE.out);
  const intactIn = progress(frame, w('s05-05', 'contraseña') - 6, 12);
  const arrowsDim = 0.75 * revokeHit;
  const calTileIn = progress(frame, consent + 10, 16);

  // ---- OAUTH banner, then the voucher.
  const bannerIn = progress(frame, w('s05-06', 'oauth') - 6, 14);
  const bannerToTop = progress(frame, note - 10, 22, EASE.inOut);
  // The desk is there as soon as the note starts (no empty stage between the lanes and the image).
  const deskIn = progress(frame, Math.min(note - 4, w('s05-07', 'conserjería') - 8), 14);
  const neighbourIn = progress(frame, w('s05-07', 'vecina') - 8, 14);
  const valeAt = w('s05-07', 'vale') - 8;
  const valeIn = progress(frame, valeAt, 14);
  const valeSlide = progress(frame, valeAt + 4, 24, EASE.inOut);
  const altIn = progress(frame, valeAt + 16, 14);
  const altCross = progress(frame, w('s05-07', 'no') - 4, 14, EASE.inOut);

  return (
    <Stage>
      {/* ================= Phase 1 ================= */}
      {p1Out < 1 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: 1 - p1Out, fontFamily: FONT.sans }}>
          {/* The app's login card */}
          <div
            style={{
              position: 'absolute',
              left: APP_CARD.x,
              top: APP_CARD.y,
              width: APP_CARD.w,
              height: APP_CARD.h,
              boxSizing: 'border-box',
              borderRadius: RADIUS.lg,
              border: `2px solid ${alpha(C.sky, 0.6)}`,
              background: `linear-gradient(180deg, ${C.ink850} 0%, ${C.ink900} 100%)`,
              boxShadow: `0 26px 60px ${alpha('#000000', 0.42)}`,
              overflow: 'hidden',
              opacity: appIn,
              transform: `translateY(${(1 - appIn) * 18}px)`,
            }}
          >
            <div style={{ height: 96, display: 'flex', alignItems: 'center', gap: 18, padding: '0 28px', background: alpha('#075985', 0.4), borderBottom: `2px solid ${alpha(C.sky, 0.35)}` }}>
              <Icon name="app" size={52} color={C.sky} />
              <div style={{ whiteSpace: 'nowrap' }}>
                <div style={{ fontSize: 40, fontWeight: 850, color: C.textStrong, lineHeight: 1.1 }}>{APP.name}</div>
                <div style={{ fontSize: 30, fontWeight: 650, color: '#7dd3fc', lineHeight: 1.2 }}>{APP.vendor}</div>
              </div>
            </div>
            <div style={{ position: 'absolute', left: 32, top: 118, fontSize: 36, fontWeight: 750, color: C.text, whiteSpace: 'nowrap' }}>{APP.form}</div>
            {/* user field */}
            <Field x={32} y={192} w={APP_CARD.w - 64} h={66} icon="user">
              <span style={{ width: 210, height: 14, borderRadius: 6, background: alpha(C.text, 0.35) }} />
            </Field>
          </div>
          {/* password field (outside the card's clip so the strike can overhang) */}
          <div style={{ position: 'absolute', left: PW_FIELD.x, top: PW_FIELD.y, opacity: appIn }}>
            <Field x={0} y={0} w={PW_FIELD.w} h={PW_FIELD.h} icon="lock" tone={strike > 0 ? C.rose : C.sky}>
              {Array.from({ length: pwDots }, (_, i) => (
                <span key={i} style={{ width: 14, height: 14, borderRadius: '50%', background: C.textStrong }} />
              ))}
            </Field>
            {strike > 0 ? (
              <svg width={PW_FIELD.w + 40} height={PW_FIELD.h + 30} style={{ position: 'absolute', left: -20, top: -15, overflow: 'visible' }}>
                <line x1={0} y1={PW_FIELD.h + 22} x2={(PW_FIELD.w + 40) * strike} y2={PW_FIELD.h + 22 - (PW_FIELD.h + 14) * strike} stroke={C.rose} strokeWidth={8} strokeLinecap="round" />
              </svg>
            ) : null}
          </div>

          {/* What the app wants: the berth calendar */}
          {calOut < 1 ? (
            <>
              <svg width={W} height={H} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: 1 - calOut }}>
                <line
                  x1={APP_CARD.x + APP_CARD.w + 14}
                  y1={CAL_TILE.y + CAL_TILE.h / 2}
                  x2={APP_CARD.x + APP_CARD.w + 14 + (CAL_TILE.x - APP_CARD.x - APP_CARD.w - 34) * wantDraw}
                  y2={CAL_TILE.y + CAL_TILE.h / 2}
                  stroke={C.sky}
                  strokeWidth={4}
                  strokeDasharray="12 10"
                />
                {wantDraw > 0.9 ? (
                  <polygon
                    points={`${CAL_TILE.x - 14},${CAL_TILE.y + CAL_TILE.h / 2} ${CAL_TILE.x - 32},${CAL_TILE.y + CAL_TILE.h / 2 - 11} ${CAL_TILE.x - 32},${CAL_TILE.y + CAL_TILE.h / 2 + 11}`}
                    fill={C.sky}
                  />
                ) : null}
              </svg>
              <div style={{ position: 'absolute', left: CAL_TILE.x, top: CAL_TILE.y, opacity: progress(frame, w('s05-01', 'calendario') - 8, 14) * (1 - calOut) }}>
                <CalendarTile w={CAL_TILE.w} h={CAL_TILE.h} />
              </div>
            </>
          ) : null}

          {/* The cost of the shortcut */}
          {leadIn > 0 ? (
            <div style={{ position: 'absolute', left: PANEL.x, top: PANEL.y, width: PANEL.w }}>
              <div style={{ fontSize: 44, fontWeight: 850, color: C.roseSoft, whiteSpace: 'nowrap', ...enter(frame, w('s05-02', 'contraseña') - 6, { distance: 12 }) }}>{CROSSED.lead}</div>
              <div style={{ marginTop: 26, display: 'flex', alignItems: 'center', gap: 14 }}>
                {CROSSED.items.map((it, i) => {
                  const p = progress(frame, itemAt[i], 12);
                  return (
                    <div key={it.label} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      {i > 0 ? <span style={{ fontSize: 44, color: C.faint, opacity: p }}>·</span> : null}
                      <div
                        style={{
                          width: 210,
                          height: 170,
                          boxSizing: 'border-box',
                          borderRadius: RADIUS.md,
                          border: `2px solid ${alpha(C.rose, 0.7)}`,
                          background: alpha(C.roseDeep, 0.4),
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 12,
                          opacity: p,
                          transform: `scale(${0.9 + 0.1 * p})`,
                        }}
                      >
                        <Icon name={it.icon} size={60} color={C.roseSoft} />
                        <span style={{ fontSize: 38, fontWeight: 800, color: C.textStrong }}>{it.label}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div style={{ marginTop: 30, fontSize: 42, fontWeight: 800, color: C.roseSoft, whiteSpace: 'nowrap', opacity: tailIn, transform: `translateY(${(1 - tailIn) * 10}px)` }}>{CROSSED.tail}</div>
            </div>
          ) : null}
        </div>
      ) : null}

      {/* ================= Phase 2: OAuth in lanes ================= */}
      {frame >= lanesIn - 2 && lanesOut < 1 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: 1 - lanesOut, ...dimStyle(lanesDim, 1 - lanesOut) }}>
          <Lanes lanes={LANES} width={W} height={H} at={lanesIn} frame={frame}>
            {/* The app sends you home */}
            <LaneArrow x1={X[0] + 10} x2={X[1] - 12} y={C1_Y} draw={sendDraw} color={C.sky} dashed dim={0.6 * consentDim} />

            {/* Consent screen at the IdP */}
            {consentOut < 1 ? (
              <LaneBox x={X[1]} y={CONSENT_TOP} width={520} show={consentIn * (1 - consentOut)} dim={consentDim} color={C.cyan} glow={windowWeight(frame, consentIn > 0 ? w('s05-03', 'pregunta') : 1e9, token, { ramp: 10 })}>
                <div style={{ fontSize: 32, fontWeight: 850, color: C.textStrong, whiteSpace: 'nowrap' }}>{CONSENT.head}</div>
                <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 10, fontSize: 31, fontWeight: 700, color: C.cyanSoft, whiteSpace: 'nowrap' }}>
                  <Icon name="check" size={32} color={C.cyan} strokeWidth={2.6} />
                  {CONSENT.scope}
                </div>
                <div style={{ marginTop: 18, display: 'flex', gap: 16 }}>
                  <Btn solid={allowP} tone={C.cyan}>{CONSENT.allow}</Btn>
                  <Btn solid={0} tone={C.muted} dim={allowP}>{CONSENT.deny}</Btn>
                </div>
              </LaneBox>
            ) : null}
            {consentIn > 0 && consentOut < 1 ? (
              <Cursor
                frame={frame}
                path={[
                  { x: X[1] + 120, y: CONSENT_TOP + 330, at: allowAt - 26 },
                  { x: X[1] - 150, y: CONSENT_TOP + 160, at: allowAt, click: true },
                ]}
              />
            ) : null}

            {/* The calendar (the resource) */}
            <div style={{ position: 'absolute', left: X[2] - 230, top: READ_Y - 112, opacity: calTileIn }}>
              <CalendarTile w={460} h={184} read={readDone} readLabel={READ} compact />
            </div>

            {/* token: the IdP hands the app a permit */}
            <LaneArrow x1={X[1] - 10} x2={X[0] + 12} y={TOKEN_Y} draw={tokenDraw} color={C.cyan} dim={arrowsDim} />
            {tokenDraw > 0 ? (
              <div style={{ position: 'absolute', left: tokenX - TOKEN_W / 2, top: TOKEN_Y - 30, width: TOKEN_W, zIndex: 2 }}>
                <TokenCard titleIn={Math.max(tokenTitleIn, 0.001)} rows={scopeRows} expiresIn={expiresIn} revoked={revokeHit} beat={beat} />
              </div>
            ) : null}

            {/* scope: the calendar is read, the mail is out of scope */}
            <LaneArrow x1={X[0] + TOKEN_W / 2 + 12} x2={X[2] - 242} y={READ_Y} draw={readDraw} color={C.emerald} dim={arrowsDim} />
            <LaneArrow x1={X[0] + 10} x2={X[2] - 300} y={MAIL_Y} draw={mailDraw * 0.86} color={C.rose} blocked={mailBlocked} dim={arrowsDim * 0.5} />
            {mailDraw > 0 ? (
              <div style={{ position: 'absolute', left: X[2] - 258, top: MAIL_Y - 30, display: 'flex', alignItems: 'center', gap: 12, whiteSpace: 'nowrap', fontFamily: FONT.sans, ...enter(frame, mailAt + 6, { distance: 10, axis: 'x' }) }}>
                <Icon name="mail" size={40} color={C.rose} />
                <span style={{ fontSize: 34, fontWeight: 850, color: C.roseSoft }}>{OUT_OF_SCOPE}</span>
              </div>
            ) : null}

            {/* revoke: at home, without touching the password */}
            {revokePanelIn > 0 ? (
              <div style={{ position: 'absolute', left: X[1] - 230, top: CONSENT_TOP + 6, width: 460, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22, opacity: revokePanelIn, fontFamily: FONT.sans }}>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 14,
                    height: 84,
                    padding: '0 34px',
                    boxSizing: 'border-box',
                    borderRadius: RADIUS.lg,
                    border: `3px solid ${revokeHit > 0 ? C.cyan : alpha(C.cyan, 0.6)}`,
                    background: revokeHit > 0 ? alpha(C.cyan, 0.22 * revokeHit) : C.ink850,
                    boxShadow: revokeHit > 0 ? `0 0 ${Math.round(30 * revokeHit * beat)}px ${alpha(C.cyan, 0.4 * revokeHit)}` : `0 16px 34px ${alpha('#000000', 0.4)}`,
                    fontSize: 40,
                    fontWeight: 850,
                    color: revokeHit > 0.5 ? C.cyanSoft : C.textStrong,
                    whiteSpace: 'nowrap',
                    transform: `scale(${1 - 0.05 * revokeHit * (1 - progress(frame, revoke + 6, 8))})`,
                  }}
                >
                  <Icon name="x" size={40} color={C.cyan} strokeWidth={2.6} />
                  {REVOKE.button}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, whiteSpace: 'nowrap', opacity: intactIn, transform: `translateY(${(1 - intactIn) * 10}px)` }}>
                  <Icon name="lock" size={40} color={C.emerald} strokeWidth={2.4} />
                  <span style={{ fontSize: 40, fontWeight: 850, color: '#6ee7b7' }}>{REVOKE.intact}</span>
                </div>
              </div>
            ) : null}
            {revokePanelIn > 0 ? (
              <Cursor
                frame={frame}
                path={[
                  { x: X[1] + 160, y: CONSENT_TOP + 200, at: revoke - 22 },
                  { x: X[1] + 60, y: CONSENT_TOP + 56, at: revoke, click: true },
                ]}
              />
            ) : null}
          </Lanes>
        </div>
      ) : null}

      {/* ================= OAUTH: banner, then header ================= */}
      {bannerIn > 0 ? (
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: mix(210, 0, bannerToTop),
            width: W,
            display: 'flex',
            justifyContent: 'center',
            opacity: bannerIn,
            transform: `scale(${mix(1, 0.72, bannerToTop)})`,
            transformOrigin: 'center top',
            fontFamily: FONT.sans,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 30,
              padding: '26px 50px',
              borderRadius: RADIUS.lg,
              border: `2px solid ${alpha(C.violet, 0.8)}`,
              background: alpha(C.ink950, 0.98),
              boxShadow: `0 0 40px ${alpha(C.violet, 0.3)}, 0 26px 60px ${alpha('#000000', 0.5)}`,
              whiteSpace: 'nowrap',
              ...enter(frame, w('s05-06', 'oauth') - 6, { distance: 14 }),
            }}
          >
            <span style={{ fontSize: 84, fontWeight: 900, letterSpacing: 4, color: '#c4b5fd', lineHeight: 1 }}>{OAUTH.term}</span>
            <span style={{ width: 3, height: 72, background: alpha(C.violet, 0.6) }} />
            <span style={{ fontSize: 46, fontWeight: 800, color: C.textStrong }}>{OAUTH.line}</span>
          </div>
        </div>
      ) : null}

      {/* ================= The voucher ================= */}
      {deskIn > 0 ? (
        <div style={{ position: 'absolute', inset: 0, fontFamily: FONT.sans }}>
          {/* Concierge desk */}
          <div style={{ position: 'absolute', left: 60, top: 200, width: 440, opacity: deskIn, transform: `translateY(${(1 - deskIn) * 16}px)` }}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <span style={{ padding: '8px 26px', borderRadius: RADIUS.sm, border: `2px solid ${alpha(C.cyan, 0.7)}`, background: alpha(C.cyanDeep, 0.35), fontSize: 42, fontWeight: 850, color: C.cyanSoft, whiteSpace: 'nowrap' }}>{DESK}</span>
            </div>
            <svg width={440} height={300} viewBox="0 0 440 300" style={{ display: 'block', marginTop: 24 }}>
              <rect x={20} y={60} width={400} height={26} rx={6} fill={C.ink600} stroke={alpha(C.cyan, 0.5)} strokeWidth={2} />
              <rect x={40} y={86} width={360} height={200} rx={10} fill={C.ink800} stroke={alpha(C.cyan, 0.4)} strokeWidth={2} />
              <rect x={70} y={120} width={300} height={8} rx={4} fill={alpha(C.cyan, 0.25)} />
              <rect x={70} y={150} width={300} height={8} rx={4} fill={alpha(C.cyan, 0.15)} />
              {/* bell */}
              <path d="M300 56 a24 24 0 0 1 48 0 Z" fill={alpha(C.cyan, 0.3)} stroke={C.cyan} strokeWidth={3} />
              <rect x={294} y={52} width={60} height={8} rx={3} fill={C.cyan} />
              <circle cx={324} cy={28} r={5} fill={C.cyan} />
            </svg>
          </div>

          {/* Neighbour */}
          <div style={{ position: 'absolute', left: 1468, top: 250, width: 240, display: 'flex', justifyContent: 'center', opacity: neighbourIn, transform: `translateY(${(1 - neighbourIn) * 16}px)` }}>
            <div style={{ width: 200, height: 200, borderRadius: '50%', border: `4px solid ${alpha(C.sky, 0.7)}`, background: alpha(C.sky, 0.08), display: 'grid', placeItems: 'center' }}>
              <Icon name="user" size={120} color={C.sky} />
            </div>
          </div>

          {/* The voucher, from the desk towards the neighbour */}
          {valeIn > 0 ? (
            <div style={{ position: 'absolute', left: mix(360, 730, valeSlide), top: mix(330, 262, valeSlide), opacity: valeIn, transform: `rotate(${mix(-6, -2, valeSlide)}deg)` }}>
              <Voucher width={VOUCHER_W} glow={0.6 * valeIn * beat} />
            </div>
          ) : null}

          {/* Not the DNI, not the keys */}
          {altIn > 0 ? (
            <div style={{ position: 'absolute', left: 820, top: 262 + voucherHeight(VOUCHER_W) + 44, display: 'flex', gap: 80, alignItems: 'flex-end', opacity: altIn }}>
              <DniCard width={190} crossed={altCross} />
              <Keyring width={170} crossed={altCross} />
            </div>
          ) : null}
        </div>
      ) : null}
    </Stage>
  );
}

/** An input field with a leading icon. */
function Field({ x, y, w, h, icon, tone = C.sky, children }: { x: number; y: number; w: number; h: number; icon: 'user' | 'lock'; tone?: string; children?: ReactNode }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: w,
        height: h,
        boxSizing: 'border-box',
        borderRadius: 12,
        border: `2px solid ${alpha(tone, 0.6)}`,
        background: C.ink950,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '0 18px',
      }}
    >
      <Icon name={icon} size={36} color={tone} />
      {children}
    </div>
  );
}

/** Consent buttons. */
function Btn({ children, solid, tone, dim = 0 }: { children: ReactNode; solid: number; tone: string; dim?: number }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        height: 58,
        padding: '0 26px',
        boxSizing: 'border-box',
        borderRadius: RADIUS.md,
        border: `3px solid ${alpha(tone, 0.8)}`,
        background: solid > 0 ? alpha(tone, 0.85 * solid) : 'transparent',
        color: solid > 0.5 ? C.ink950 : C.text,
        fontSize: 32,
        fontWeight: 850,
        whiteSpace: 'nowrap',
        opacity: 1 - 0.5 * dim,
        boxShadow: solid > 0 ? `0 0 ${Math.round(20 * solid)}px ${alpha(tone, 0.45 * solid)}` : undefined,
      }}
    >
      {children}
    </span>
  );
}

/** The berth calendar: a title and a small month grid; `read` turns it emerald with a «leído» chip. */
function CalendarTile({ w, h, read = 0, readLabel, compact = false }: { w: number; h: number; read?: number; readLabel?: string; compact?: boolean }) {
  const tone = read > 0.5 ? C.emerald : C.cyan;
  const cols = 7;
  const rows = compact ? 2 : 3;
  const gridTop = compact ? 18 : 84;
  const cell = { w: (w - 48 - (cols - 1) * 8) / cols, h: compact ? 36 : 42 };
  return (
    <div
      style={{
        position: 'relative',
        width: w,
        height: h,
        boxSizing: 'border-box',
        borderRadius: RADIUS.lg,
        border: `2px solid ${alpha(tone, 0.6 + 0.3 * read)}`,
        background: `linear-gradient(180deg, ${C.ink850} 0%, ${C.ink900} 100%)`,
        boxShadow: read > 0 ? `0 0 ${Math.round(30 * read)}px ${alpha(C.emerald, 0.35 * read)}` : `0 20px 44px ${alpha('#000000', 0.4)}`,
        fontFamily: FONT.sans,
        overflow: 'hidden',
      }}
    >
      {!compact ? (
        <div style={{ position: 'absolute', left: 24, top: 18, display: 'flex', alignItems: 'center', gap: 14, whiteSpace: 'nowrap' }}>
          <Icon name="clock" size={40} color={tone} />
          <span style={{ fontSize: 38, fontWeight: 850, color: C.textStrong }}>{CALENDAR}</span>
        </div>
      ) : null}
      {Array.from({ length: rows * cols }, (_, i) => {
        const r = Math.floor(i / cols);
        const c = i % cols;
        const busy = (i * 7 + 3) % 5 === 0;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: 24 + c * (cell.w + 8),
              top: gridTop + r * (cell.h + 8),
              width: cell.w,
              height: cell.h,
              borderRadius: 6,
              background: busy ? alpha(tone, 0.45) : alpha(C.ink600, 0.6),
            }}
          />
        );
      })}
      {read > 0 && readLabel ? (
        <div style={{ position: 'absolute', right: 18, bottom: 14, display: 'flex', alignItems: 'center', gap: 10, padding: '4px 16px', borderRadius: RADIUS.pill, background: alpha(C.emeraldDeep, 0.9), border: `2px solid ${C.emerald}`, opacity: read, whiteSpace: 'nowrap' }}>
          <Icon name="check" size={32} color={C.emerald} strokeWidth={2.8} />
          <span style={{ fontSize: 34, fontWeight: 850, color: '#6ee7b7' }}>{readLabel}</span>
        </div>
      ) : null}
    </div>
  );
}

/** The permit the IdP gives the app: a chip that grows into a card with its scope and expiry. */
function TokenCard({ titleIn, rows, expiresIn, revoked, beat }: { titleIn: number; rows: number; expiresIn: number; revoked: number; beat: number }) {
  const h = 62 + 100 * rows;
  return (
    <div
      style={{
        position: 'relative',
        width: TOKEN_W,
        height: h,
        boxSizing: 'border-box',
        borderRadius: RADIUS.md,
        border: `3px solid ${alpha(C.cyan, 0.85)}`,
        background: `linear-gradient(180deg, ${alpha(C.cyanDeep, 0.5)} 0%, ${C.ink900} 100%)`,
        boxShadow: `0 0 ${Math.round(24 * beat * (1 - revoked))}px ${alpha(C.cyan, 0.35 * (1 - revoked))}, 0 18px 40px ${alpha('#000000', 0.45)}`,
        fontFamily: FONT.sans,
        overflow: 'hidden',
        filter: revoked > 0 ? `grayscale(${0.85 * revoked})` : undefined,
      }}
    >
      <div style={{ height: 56, display: 'flex', alignItems: 'center', gap: 12, padding: '0 18px', whiteSpace: 'nowrap', opacity: titleIn }}>
        <Icon name="key" size={36} color={C.cyan} />
        <span style={{ fontSize: 32, fontWeight: 850, color: C.textStrong }}>{TOKEN.title}</span>
      </div>
      {rows > 0 ? (
        <div style={{ padding: '4px 22px', opacity: rows }}>
          <div style={{ fontSize: 32, fontWeight: 700, color: C.muted, whiteSpace: 'nowrap' }}>
            alcance: <span style={{ fontFamily: FONT.mono, fontWeight: 800, color: C.cyanSoft }}>{TOKEN.scope.replace('alcance: ', '')}</span>
          </div>
          <div style={{ marginTop: 6, fontSize: 32, fontWeight: 700, color: C.muted, whiteSpace: 'nowrap', opacity: expiresIn }}>
            caduca: <span style={{ fontWeight: 850, color: C.textStrong }}>{TOKEN.expires.replace('caduca: ', '')}</span>
          </div>
        </div>
      ) : null}
      {revoked > 0 ? (
        <svg width={TOKEN_W} height={h} style={{ position: 'absolute', left: 0, top: 0 }}>
          <line x1={16} y1={h - 12} x2={16 + (TOKEN_W - 32) * revoked} y2={h - 12 - (h - 24) * revoked} stroke={C.rose} strokeWidth={8} strokeLinecap="round" />
        </svg>
      ) : null}
    </div>
  );
}

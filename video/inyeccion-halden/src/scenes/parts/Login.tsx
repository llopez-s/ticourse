import type { ReactNode } from 'react';
import { C, FONT, alpha } from '../../../../engine/src/theme/tokens';
import { pulse } from '../../../../engine/src/theme/motion';
import { Icon } from '../../../../engine/src/ui';
import { WebWindow } from './WebWindow';

/** The login window (s02, s03): 540 × 530, body 470. */
export const LOGIN = { w: 540, h: 552, bodyH: 492, pad: 30 } as const;
/** Where the «usuario» input sits inside the window's body (for connectors). */
export const LOGIN_USER_FIELD = { x: LOGIN.pad, y: 116, w: LOGIN.w - 2 * LOGIN.pad - 4, h: 66 } as const;

const FIELD_H = 66;

function Field({
  label,
  glow,
  children,
  top,
}: {
  label: string;
  glow: number;
  children: ReactNode;
  top: number;
}) {
  return (
    <div style={{ position: 'absolute', left: LOGIN.pad, top, width: LOGIN.w - 2 * LOGIN.pad - 4 }}>
      <div style={{ fontFamily: FONT.sans, fontSize: 32, fontWeight: 650, color: C.muted, marginBottom: 8, lineHeight: '32px' }}>{label}</div>
      <div
        style={{
          height: FIELD_H,
          boxSizing: 'border-box',
          padding: '0 18px',
          display: 'flex',
          alignItems: 'center',
          borderRadius: 14,
          background: C.ink950,
          border: `3px solid ${glow > 0 ? alpha(C.cyan, 0.4 + 0.6 * glow) : C.ink600}`,
          boxShadow: glow > 0 ? `0 0 ${Math.round(26 * glow)}px ${alpha(C.cyan, 0.4 * glow)}` : undefined,
          fontFamily: FONT.mono,
          fontSize: 32,
          fontWeight: 600,
          color: C.cyan,
          whiteSpace: 'pre',
          overflow: 'hidden',
        }}
      >
        {children}
      </div>
    </div>
  );
}

/**
 * The test copy's login screen. `user` is the visible text of the user field (cyan: the person's text), `dots` the
 * password characters typed; `caret` 'user' | 'pass' | null blinks a cursor. `error` (0–1) shows «usuario o contraseña
 * incorrectos» (rose); `session` (0–1) replaces it with the open session (rose: the lock failed). `glow` lights the
 * two fields.
 */
export function LoginScreen({
  user,
  dots,
  caret = null,
  error = 0,
  session = 0,
  sessionText = 'Sesión abierta',
  sessionSub = 'sin contraseña',
  glowUser = 0,
  glowPass = 0,
  frame,
  fps = 30,
  glow = 0,
  dim = 0,
  errorText = 'usuario o contraseña incorrectos',
  style,
}: {
  user: string;
  dots: number;
  caret?: 'user' | 'pass' | null;
  error?: number;
  session?: number;
  sessionText?: string;
  sessionSub?: string;
  glowUser?: number;
  glowPass?: number;
  frame: number;
  fps?: number;
  glow?: number;
  dim?: number;
  errorText?: string;
  style?: React.CSSProperties;
}) {
  const blink = pulse(frame, fps, 1) > 0.35;
  const cursor = (
    <span style={{ display: 'inline-block', width: 3, height: 34, marginLeft: 2, background: C.cyan, opacity: blink ? 1 : 0 }} />
  );
  const sessionColor = C.rose;
  return (
    <WebWindow width={LOGIN.w} height={LOGIN.h} title="Citas de camiones" glow={glow} dim={dim} accent={session > 0.5 ? 'rose' : 'cyan'} style={style}>
      <div style={{ position: 'absolute', left: LOGIN.pad, top: 22, display: 'flex', alignItems: 'center', gap: 12 }}>
        <Icon name="lock" size={34} color={C.muted} />
        <span style={{ fontFamily: FONT.sans, fontSize: 36, fontWeight: 800, color: C.textStrong }}>Acceso al portal</span>
      </div>
      <Field label="usuario" glow={glowUser} top={LOGIN_USER_FIELD.y - 40}>
        {user}
        {caret === 'user' ? cursor : null}
      </Field>
      <Field label="contraseña" glow={glowPass} top={LOGIN_USER_FIELD.y + FIELD_H + 18}>
        <span style={{ color: C.text, letterSpacing: 4 }}>{'•'.repeat(dots)}</span>
        {caret === 'pass' ? cursor : null}
      </Field>
      <div
        style={{
          position: 'absolute',
          left: LOGIN.pad,
          top: 326,
          width: LOGIN.w - 2 * LOGIN.pad - 4,
          height: 60,
          borderRadius: 14,
          display: 'grid',
          placeItems: 'center',
          background: alpha(C.cyan, 0.16),
          border: `2px solid ${alpha(C.cyan, 0.6)}`,
          fontFamily: FONT.sans,
          fontSize: 32,
          fontWeight: 800,
          color: C.cyanSoft,
        }}
      >
        Entrar
      </div>
      {/* the page's answer */}
      <div style={{ position: 'absolute', left: LOGIN.pad, top: 404, width: LOGIN.w - 2 * LOGIN.pad - 4, height: 80 }}>
        {error > 0.01 && session < 0.5 ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, opacity: error, transform: `translateY(${(1 - error) * 8}px)` }}>
            <Icon name="x" size={34} color={C.rose} strokeWidth={2.6} />
            <span style={{ fontFamily: FONT.sans, fontSize: 32, fontWeight: 750, color: C.roseSoft, lineHeight: 1.1 }}>{errorText}</span>
          </div>
        ) : null}
        {session > 0.01 ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              height: 80,
              padding: '0 16px',
              boxSizing: 'border-box',
              borderRadius: 14,
              background: alpha(sessionColor, 0.16),
              border: `2px solid ${alpha(sessionColor, 0.8)}`,
              opacity: session,
              transform: `scale(${0.94 + 0.06 * session})`,
              transformOrigin: '0 50%',
            }}
          >
            <Icon name="unlock" size={40} color={C.roseSoft} strokeWidth={2.2} />
            <div style={{ lineHeight: 1.12 }}>
              <div style={{ fontFamily: FONT.sans, fontSize: 34, fontWeight: 850, color: C.textStrong, whiteSpace: 'nowrap' }}>{sessionText}</div>
              <div style={{ fontFamily: FONT.sans, fontSize: 32, fontWeight: 750, color: C.roseSoft, whiteSpace: 'nowrap' }}>{sessionSub}</div>
            </div>
          </div>
        ) : null}
      </div>
    </WebWindow>
  );
}


// ---------------------------------------------------------------------------------------------------------------
// s01 / s05: the three small screens.

export interface MiniScreenDef {
  kind: 'login' | 'search' | 'notes';
  /** The box's name under the screen. */
  name: string;
  /** Address-bar text. */
  title: string;
}

/** Design size of one mini screen (the row is 3 of them). */
export const MINI = { w: 520, h: 300 } as const;

function MiniBody({ kind, lit }: { kind: MiniScreenDef['kind']; lit: number }) {
  const box = (top: number, h: number, text: string, extra?: ReactNode, glow = lit) => (
    <div
      style={{
        position: 'absolute',
        left: 26,
        top,
        width: MINI.w - 52 - 4,
        height: h,
        boxSizing: 'border-box',
        borderRadius: 12,
        padding: '0 16px',
        display: 'flex',
        alignItems: h > 80 ? 'flex-start' : 'center',
        paddingTop: h > 80 ? 12 : 0,
        background: C.ink950,
        border: `3px solid ${alpha(C.cyan, 0.3 + 0.7 * glow)}`,
        boxShadow: glow > 0.02 ? `0 0 ${Math.round(30 * glow)}px ${alpha(C.cyan, 0.45 * glow)}` : undefined,
        fontFamily: FONT.sans,
        fontSize: 32,
        fontWeight: 600,
        color: C.faint,
        whiteSpace: 'nowrap',
      }}
    >
      {text}
      {extra}
    </div>
  );
  const label = (top: number, text: string) => (
    <div style={{ position: 'absolute', left: 28, top, fontFamily: FONT.sans, fontSize: 32, fontWeight: 650, color: C.muted, lineHeight: 1, whiteSpace: 'nowrap' }}>{text}</div>
  );
  if (kind === 'login')
    return (
      <>
        {label(14, 'usuario')}
        {box(54, 58, '')}
        {label(130, 'contraseña')}
        {box(168, 58, '')}
      </>
    );
  if (kind === 'search')
    return (
      <>
        {label(16, 'buscar cita')}
        {box(52, 58, 'matrícula')}
        <div
          style={{
            position: 'absolute',
            left: 26,
            top: 134,
            width: 200,
            height: 54,
            borderRadius: 12,
            display: 'grid',
            placeItems: 'center',
            background: alpha(C.cyan, 0.12),
            border: `2px solid ${alpha(C.cyan, 0.45)}`,
            fontFamily: FONT.sans,
            fontSize: 30,
            fontWeight: 750,
            color: C.cyanSoft,
          }}
        >
          Buscar
        </div>
      </>
    );
  return (
    <>
      {label(16, 'observaciones')}
      {box(52, 128, '')}
    </>
  );
}

/**
 * One of the three screens of the test copy: a small browser window whose input box can light (`lit`, 0–1) and the
 * whole screen can sit in half light (`dim`). The name under it is the box the voice names.
 */
export function MiniScreen({ def, lit, dim, glow = 0 }: { def: MiniScreenDef; lit: number; dim: number; glow?: number }) {
  return (
    <WebWindow width={MINI.w} height={MINI.h} title={def.title} urlSize={26} dim={dim} glow={glow}>
      <MiniBody kind={def.kind} lit={lit} />
    </WebWindow>
  );
}

/**
 * The three screens in a row with a numbered name under each (design width 1728, three MINI screens and two gaps).
 * `show[i]` fades screen i in, `lit[i]` lights its box, `dim` (0–1) is the half light all three sit in before they
 * light.
 */
export function ThreeScreens({
  screens,
  show,
  lit,
  dim,
  scale = 1,
}: {
  screens: readonly MiniScreenDef[];
  show: readonly number[];
  lit: readonly number[];
  dim: number;
  scale?: number;
}) {
  const gap = (1728 - 3 * MINI.w) / 2;
  return (
    <div style={{ position: 'relative', width: 1728, height: MINI.h + 90, transform: scale === 1 ? undefined : `scale(${scale})`, transformOrigin: '0 0' }}>
      {screens.map((s, i) => (
        <div key={s.kind} style={{ position: 'absolute', left: i * (MINI.w + gap), top: 0, opacity: show[i], transform: `translateY(${(1 - show[i]) * 18}px)` }}>
          <MiniScreen def={s} lit={lit[i]} dim={dim * (1 - lit[i])} glow={0.6 * lit[i]} />
          <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 14 }}>
            <span
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                display: 'grid',
                placeItems: 'center',
                fontFamily: FONT.sans,
                fontSize: 30,
                fontWeight: 850,
                background: lit[i] > 0.5 ? C.cyan : alpha(C.cyan, 0.16),
                color: lit[i] > 0.5 ? C.ink950 : C.cyanSoft,
                border: `2px solid ${alpha(C.cyan, 0.7)}`,
              }}
            >
              {i + 1}
            </span>
            <span style={{ fontFamily: FONT.sans, fontSize: 40, fontWeight: 800, color: C.textStrong, opacity: 0.55 + 0.45 * lit[i], whiteSpace: 'nowrap' }}>{s.name}</span>
          </div>
        </div>
      ))}
    </div>
  );
}


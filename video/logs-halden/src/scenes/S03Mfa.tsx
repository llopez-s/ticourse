import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT } from '../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../engine/src/theme/motion';
import { Icon, mix } from '../../../engine/src/ui';
import { IDP_LINES, OK_INDEX } from '../data/s02-spray';
import { POLICY, SECOND_LOCK } from '../data/s03-mfa';
import { IdpLog, idpColumn, idpRowTop, idpLogWidth } from './parts/IdpLog';
import { TermTag } from './parts/s02-spray/Marks';
import { Actions } from './parts/s03-mfa/Actions';
import { DOOR_MFA, DOOR_MFA_TAG, DoorMfa } from './parts/s03-mfa/DoorMfa';
import { LOG_ZOOM, LogZoom, OkRow } from './parts/s03-mfa/LogZoom';
import { POLICY_CARD_H, PolicyCard } from './parts/s03-mfa/PolicyCard';
import { TrailStrip, overlayWindows } from './parts/TrailRow';
import { Stage, segment, wordFrame } from './kit';

const S = 's03-mfa';
const W = 1728;

// ---- Phase 1: the same IdP log, now as texture (26 px), and the OK line enlarged under it.
const LOG_SIZE = 26;
const LOG_PITCH = 40;
const LOG_W = idpLogWidth(LOG_SIZE);
const LOG = { x: 60, y: 104 } as const;
const ZOOM1 = { x: 60, y: 420, s: 1 } as const;
/** Where the OK row starts growing: on top of the log's OK row, at the log's text size. */
const OK_START = {
  x: LOG.x + idpColumn('time', LOG_SIZE).x - (LOG_ZOOM.padX + 3) * (LOG_SIZE / LOG_ZOOM.size),
  y: LOG.y + idpRowTop(OK_INDEX, LOG_PITCH) + (LOG_PITCH - LOG_ZOOM.rowH * (LOG_SIZE / LOG_ZOOM.size)) / 2,
  s: LOG_SIZE / LOG_ZOOM.size,
} as const;

// ---- Phase 2 (intercepted message at the top): everything sits below stage-local y 250.
const ZOOM2 = { x: 0, y: 262, s: 0.6 } as const;
// ---- Phase 4+: the zoomed lines go up; the actions take the left column under them.
const ZOOM3 = { x: 0, y: 112, s: 0.6 } as const;
const LEFT_W = 960;
const ACTIONS_Y = 262;
const RIGHT = { x: 996, w: W - 996 } as const;
const CARD_Y = 262;

/**
 * s03-mfa «Una puerta se abrió». The dimmed OK line of s02 grows out of the
 * IdP's log — `03:12:37 LOGIN OK user=r.haugen src=192.0.2.157` — with «IdP de
 * Halden · pide: contraseña» next to it; then the new LOGOUT line, read as a
 * fact («aplicaciones abiertas: 0»). RED MARROW's message types out at the
 * top (the strip folds aside); under it the policy card: `Halden2026!`, three
 * green boxes and «cumple», then «y es de las primeras que prueba
 * cualquiera». The three actions light one per sentence. The image comes
 * back: the same door with a second lock — the ordinary key turns, the door
 * asks for something only you have (phone or hardware key): MFA, «segundo
 * cerrojo», and the ordinary key no longer opens.
 */
export function S03Mfa(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const okAt = props.cue('ok');
  const logoutAt = props.cue('logout');
  const resetAt = props.cue('reset');
  const blockSrcAt = props.cue('block-src');
  const mfaAt = props.cue('mfa');
  const secondLockAt = props.cue('second-lock');
  const s01 = segment(props, 's03-01');
  const s02 = segment(props, 's03-02');
  const s05 = segment(props, 's03-05');
  // The intercepted message: from the end of s03-01 (its silent lead) to the end of s03-02.
  const msgFrom = s01.to;
  const msgTo = s02.to;

  // ---- Phase 1 ---------------------------------------------------------------
  const grow = progress(frame, okAt - 2, 20, EASE.inOut);
  const chipIn = progress(frame, wordFrame(S, 's03-01', 'acierta') - 4, 14);
  const logoutIn = progress(frame, logoutAt - 2, 16);
  const zeroGlow = progress(frame, wordFrame(S, 's03-01', 'aplicación') - 2, 12) * (1 - progress(frame, msgFrom - 20, 16));
  const logOut = progress(frame, msgFrom - 28, 16, EASE.inOut);
  const rows = IDP_LINES.map((_, i) =>
    i === OK_INDEX ? { dim: 1, mark: progress(frame, okAt - 4, 10) * (1 - grow * 0.4), markTone: C.rose } : { dim: 0.55 * progress(frame, okAt - 4, 14) },
  );

  // ---- Zoomed lines: phase 1 → under the message → up, over the actions -------------
  const z2 = progress(frame, msgFrom - 26, 22, EASE.inOut);
  // Stays beside the policy card until the actions need the left column.
  const z3 = progress(frame, Math.max(msgTo, resetAt - 22), 20, EASE.inOut);
  const zoom = {
    x: mix(mix(ZOOM1.x, ZOOM2.x, z2), ZOOM3.x, z3),
    y: mix(mix(ZOOM1.y, ZOOM2.y, z2), ZOOM3.y, z3),
    s: mix(ZOOM1.s, ZOOM2.s, z2),
  };
  const okPos = { x: mix(OK_START.x, zoom.x, grow), y: mix(OK_START.y, zoom.y, grow), s: mix(OK_START.s, zoom.s, grow) };

  // ---- Phase 2–3: the policy card ---------------------------------------------------
  const wComplies = wordFrame(S, 's03-02', 'cumple');
  const cardIn = progress(frame, wComplies - 8, 14);
  const checks = [0, 1, 2].reduce((n, i) => n + progress(frame, wComplies + 2 + i * 6, 8), 0);
  const stampAt = wordFrame(S, 's03-02', 'normas');
  const firstIn = progress(frame, wordFrame(S, 's03-03', 'primeras') - 6, 14);
  const cardOut = progress(frame, s05.from - 10, 14, EASE.inOut);

  // ---- Phase 5: the door with the second lock -----------------------------------------
  const doorIn = progress(frame, s05.from - 2, 18);
  const turn = progress(frame, wordFrame(S, 's03-05', 'contraseña') - 2, 14, EASE.inOut);
  const ask = progress(frame, wordFrame(S, 's03-05', 'algo') - 4, 14);
  const hold = progress(frame, secondLockAt - 1, 10);
  const denied = progress(frame, wordFrame(S, 's03-06', 'abre') - 4, 10);

  return (
    <Stage>
      {/* The key row stays as the title strip; it folds aside while RED MARROW's message is up */}
      <TrailStrip kind="key" frame={frame} away={overlayWindows(S)} />

      {/* ---------------- Phase 1: the log, the OK line grows out of it ---------------- */}
      {logOut < 1 ? (
        <div style={{ position: 'absolute', left: LOG.x, top: LOG.y, opacity: 1 - logOut, transform: `translateY(${-16 * logOut}px)` }}>
          <IdpLog lines={IDP_LINES} size={LOG_SIZE} pitch={LOG_PITCH} width={LOG_W} rows={rows} chromeDim={0.3 * grow} />
        </div>
      ) : null}

      {/* Chip + LOGOUT (the OK row is drawn on its own, below, while it grows) */}
      <div style={{ position: 'absolute', left: zoom.x, top: zoom.y, transform: `scale(${zoom.s})`, transformOrigin: '0 0' }}>
        <LogZoom showOk={false} chip={chipIn} logout={logoutIn} logoutGlow={0.6 * logoutIn * (1 - z2)} zeroGlow={zeroGlow} />
      </div>
      {grow > 0.001 ? (
        <div style={{ position: 'absolute', left: okPos.x, top: okPos.y, transform: `scale(${okPos.s})`, transformOrigin: '0 0', opacity: Math.min(1, grow * 2) }}>
          <OkRow glow={1 - 0.5 * logoutIn - 0.3 * z2} />
        </div>
      ) : null}

      {/* ---------------- Phase 2–4: the policy card ---------------- */}
      {cardIn > 0.001 && cardOut < 1 ? (
        <div style={{ position: 'absolute', left: RIGHT.x, top: CARD_Y, opacity: 1 - cardOut }}>
          <PolicyCard width={RIGHT.w} frame={frame} show={cardIn} checks={checks} stampAt={stampAt} />
          {firstIn > 0.001 ? (
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: POLICY_CARD_H + 20,
                width: RIGHT.w,
                display: 'flex',
                justifyContent: 'center',
                opacity: firstIn,
                transform: `translateY(${(1 - firstIn) * 10}px)`,
              }}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontFamily: FONT.sans, fontSize: 32, fontWeight: 780, color: '#fde68a', whiteSpace: 'nowrap' }}>
                <Icon name="alert" size={32} color={C.amber} />
                {POLICY.firstTried}
              </span>
            </div>
          ) : null}
        </div>
      ) : null}

      {/* ---------------- Phase 4: the three actions ---------------- */}
      <div style={{ position: 'absolute', left: 0, top: ACTIONS_Y }}>
        <Actions width={LEFT_W} frame={frame} at={[resetAt, blockSrcAt, mfaAt]} />
      </div>

      {/* ---------------- Phase 5: the same door, with a second lock ---------------- */}
      {doorIn > 0.001 ? (
        <div style={{ position: 'absolute', left: RIGHT.x, top: 104, width: DOOR_MFA.w, height: DOOR_MFA.h }}>
          <DoorMfa show={doorIn} turn={turn} ask={ask} hold={hold} denied={denied} />
          <div style={{ position: 'absolute', left: DOOR_MFA_TAG.x, top: DOOR_MFA_TAG.y, width: DOOR_MFA_TAG.w, display: 'flex', justifyContent: 'center' }}>
            <TermTag frame={frame} fps={fps} at={mfaAt - 2} term={SECOND_LOCK.term} sub={SECOND_LOCK.label} subAt={secondLockAt} size={48} subSize={34} align="center" />
          </div>
        </div>
      ) : null}

    </Stage>
  );
}

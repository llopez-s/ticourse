import type { ReactNode } from 'react';
import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { Cursor, Icon, clamp01, mix } from '../../../engine/src/ui';
import { Stage, wordFrame } from './kit';
import { STAMP_PARTS, FOLDER_NAME, PARTES } from './parts/data';
import { FolderAcl } from './parts/FolderAcl';
import { CaseStamp, Pill } from './parts/Labels';
import { Yard } from './parts/Yard';

const S = 's01-hook';

/** The exact strings of the brief. */
const TITLE = ['Quién puede', 'hacer qué'];
const CHIPS = ['¿quién eres?', '¿qué puedes hacer?'];
const PROMISE = [
  { text: 'leer un permiso', icon: 'eye' },
  { text: 'decidir lo justo', icon: 'check' },
  { text: 'arreglar sin dar de más', icon: 'gear' },
] as const;

/** The little "computer" window: stage-local geometry at full size, and where it ends up small on the left. */
const WIN = { x: 314, y: 56, w: 1100, h: 520, bar: 64 } as const;
const WIN_SMALL = { x: 0, y: 214, scale: 0.6 } as const;
const TEXT_X = 760;

function WindowFrame({ title, children, badge }: { title: string; children: ReactNode; badge?: number }) {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        borderRadius: RADIUS.lg,
        background: `linear-gradient(180deg, ${C.ink850} 0%, ${C.ink900} 100%)`,
        border: `3px solid ${C.ink600}`,
        boxShadow: `0 30px 70px ${alpha('#000000', 0.45)}`,
        overflow: 'hidden',
        fontFamily: FONT.sans,
      }}
    >
      <div style={{ height: WIN.bar, display: 'flex', alignItems: 'center', gap: 12, padding: '0 22px', background: alpha(C.ink800, 0.95), borderBottom: `2px solid ${C.ink700}` }}>
        {[C.rose, C.amber, C.emerald].map((c) => (
          <span key={c} style={{ width: 18, height: 18, borderRadius: 9, background: alpha(c, 0.55) }} />
        ))}
        <span style={{ flex: 1, textAlign: 'center', fontSize: 30, fontWeight: 700, color: C.muted, whiteSpace: 'nowrap' }}>{title}</span>
        <span style={{ width: 280, display: 'flex', justifyContent: 'flex-end', opacity: clamp01(badge ?? 0) }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 26, fontWeight: 750, color: '#6ee7b7', whiteSpace: 'nowrap' }}>
            <Icon name="check" size={28} color={C.emerald} strokeWidth={3} />
            Sesión iniciada
          </span>
        </span>
      </div>
      <div style={{ position: 'absolute', left: 0, top: WIN.bar, right: 0, bottom: 0 }}>{children}</div>
    </div>
  );
}

function Field({ label, dots, filled }: { label: string; dots?: number; filled?: boolean }) {
  return (
    <div style={{ width: 560 }}>
      <div style={{ fontSize: 30, fontWeight: 700, color: C.muted, marginBottom: 8 }}>{label}</div>
      <div style={{ height: 64, borderRadius: 14, border: `3px solid ${C.ink600}`, background: alpha(C.ink950, 0.6), display: 'flex', alignItems: 'center', padding: '0 20px', gap: 10 }}>
        {filled ? <span style={{ width: 200, height: 14, borderRadius: 7, background: alpha(C.muted, 0.45) }} /> : null}
        {Array.from({ length: dots ?? 0 }, (_, i) => (
          <span key={i} style={{ width: 16, height: 16, borderRadius: 8, background: C.text }} />
        ))}
      </div>
    </div>
  );
}

function Bars({ widths, tone = C.muted }: { widths: number[]; tone?: string }) {
  return (
    <div style={{ display: 'grid', gap: 22 }}>
      {widths.map((w, i) => (
        <span key={i} style={{ display: 'block', width: w, height: 18, borderRadius: 9, background: alpha(tone, 0.32) }} />
      ))}
    </div>
  );
}

/**
 * s01-hook «Acceso denegado». A small login screen that accepts (`login`: «Sesión iniciada», no name, no gender), the
 * explorer opens «Partes de avería» (`open`), a new report and the «Guardar» button (`save`), and the notice «Acceso
 * denegado» (`denied`) shakes once while the cursor stays still on it. On `title` (before 12 s) the window glides left
 * and «Quién puede hacer qué» lands, with the two questions as chips. On `stamp` the case stamp enters; `yard` raises the
 * crane yard in silhouette; `folder` brings the thread (the folder and its list); `promise` the three chips.
 */
export function S01Hook(props: SceneProps) {
  const frame = useCurrentFrame();
  const loginAt = props.cue('login');
  const openAt = props.cue('open');
  const saveAt = props.cue('save');
  const deniedAt = props.cue('denied');
  const titleAt = Math.min(props.cue('title') - 6, 12 * 30 - 22);
  const stampAt = props.cue('stamp');
  const yardAt = props.cue('yard');
  const folderAt = props.cue('folder');
  const promiseAt = props.cue('promise');
  const chip1 = Math.max(props.cue('chips'), wordFrame(S, 's01-02', 'quién'), titleAt + 22);
  const chip2 = Math.max(chip1 + 20, wordFrame(S, 's01-02', 'que', 1));
  const promiseAts = [
    promiseAt,
    Math.max(promiseAt + 20, wordFrame(S, 's01-05', 'decidir')),
    Math.max(promiseAt + 40, wordFrame(S, 's01-05', 'arregla')),
  ];

  // --- the window: login -> explorer -> report + «Guardar» -> notice, then it glides to the left and fades on `stamp`
  const glide = progress(frame, titleAt - 16, 30, EASE.inOut);
  const winFade = 1 - progress(frame, stampAt - 6, 18);
  const inLogin = frame < loginAt + 8;
  const loginSwap = progress(frame, loginAt, 10);
  const successSwap = progress(frame, openAt - 6, 10); // the success screen leaves as the explorer arrives
  const explorerIn = progress(frame, openAt - 2, 12);
  const docIn = progress(frame, saveAt - 4, 12);
  const clickAt = Math.max(openAt + 10, Math.min(saveAt + 22, deniedAt - 10));
  const typed = Math.floor(progress(frame, 6, Math.max(10, loginAt - 14)) * 9);
  const shakeF = frame - deniedAt;
  // one wobble (a single oscillation over 12 frames), nothing that flashes
  const shake = shakeF >= 0 && shakeF < 12 ? Math.sin((shakeF / 12) * Math.PI * 2) * 18 * (1 - shakeF / 12) : 0;
  const deniedIn = progress(frame, deniedAt - 2, 8, EASE.out);
  const winTitle = frame < openAt ? 'Inicio de sesión' : frame < saveAt - 4 ? FOLDER_NAME : `${FOLDER_NAME} · parte nuevo`;

  // --- title and chips
  const titleIn = enter(frame, titleAt, { distance: 22, duration: 18 });
  const titleFade = 1 - 0.65 * progress(frame, stampAt, 18) - 0.35 * progress(frame, yardAt - 6, 18);

  // --- the thread appears row by row on `folder`
  const listShow = progress(frame, folderAt - 2, 14);
  const rowShow = (i: number) => progress(frame, folderAt + 4 + i * 7, 12);
  const yardRise = progress(frame, yardAt - 4, 30, EASE.out);
  const yardDim = 0.55 * progress(frame, folderAt - 4, 24);
  const labelAt = progress(frame, yardAt + 14, 14) * (1 - progress(frame, folderAt - 6, 14));

  return (
    <Stage>
      {/* the stamp arrives with «Imagina…» and stays in every following scene */}
      {frame >= stampAt - 6 ? (
        <div style={{ position: 'absolute', left: 0, top: 0, ...enter(frame, stampAt, { distance: 16, duration: 16 }) }}>
          <CaseStamp parts={STAMP_PARTS} />
        </div>
      ) : null}

      {/* the crane yard, in silhouette, low in the stage and under the folder */}
      {frame >= yardAt - 6 ? (
        <div style={{ position: 'absolute', left: 0, top: 660 - 300 + 10 }}>
          <Yard rise={yardRise} dim={yardDim} label="taller de grúas" labelAt={labelAt} />
        </div>
      ) : null}

      {/* the window */}
      {winFade > 0.01 ? (
        <div
          style={{
            position: 'absolute',
            left: mix(WIN.x, WIN_SMALL.x, glide),
            top: mix(WIN.y, WIN_SMALL.y, glide),
            width: WIN.w,
            height: WIN.h,
            transformOrigin: '0 0',
            transform: `scale(${mix(1, WIN_SMALL.scale, glide)})`,
            opacity: winFade,
          }}
        >
          <WindowFrame title={winTitle} badge={progress(frame, loginAt + 6, 10)}>
            {/* login form, then the success screen */}
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 22, opacity: 1 - loginSwap }}>
              <Field label="cuenta" filled />
              <Field label="contraseña" dots={Math.min(9, typed)} />
              <div style={{ width: 560, display: 'flex', justifyContent: 'flex-end' }}>
                <span style={{ padding: '10px 40px', borderRadius: 14, background: inLogin && frame > loginAt - 8 ? alpha(C.cyan, 0.55) : alpha(C.cyan, 0.2), border: `3px solid ${C.cyan}`, fontSize: 34, fontWeight: 800, color: C.textStrong }}>Entrar</span>
              </div>
            </div>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, opacity: loginSwap * (1 - successSwap), transform: `scale(${0.9 + 0.1 * loginSwap})` }}>
              <div style={{ width: 150, height: 150, borderRadius: 75, display: 'grid', placeItems: 'center', background: alpha(C.emerald, 0.16), border: `5px solid ${C.emerald}`, boxShadow: `0 0 50px ${alpha(C.emerald, 0.4)}` }}>
                <Icon name="check" size={96} color={C.emerald} strokeWidth={3} />
              </div>
              <div style={{ fontSize: 68, fontWeight: 850, letterSpacing: -1, color: C.textStrong }}>Sesión iniciada</div>
            </div>

            {/* the explorer */}
            <div style={{ position: 'absolute', inset: 0, padding: '34px 48px', opacity: explorerIn * (1 - docIn) }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                <svg width={80} height={64} viewBox="0 0 96 76" aria-hidden>
                  <path d="M6 16 a8 8 0 0 1 8 -8 h22 l10 10 h38 a8 8 0 0 1 8 8 v40 a8 8 0 0 1 -8 8 h-70 a8 8 0 0 1 -8 -8 Z" fill={alpha(C.cyan, 0.16)} stroke={C.cyan} strokeWidth={4} strokeLinejoin="round" />
                </svg>
                <span style={{ fontSize: 54, fontWeight: 850, letterSpacing: -1, color: C.textStrong }}>{FOLDER_NAME}</span>
              </div>
              <div style={{ display: 'grid', gap: 18, marginTop: 34 }}>
                {[420, 330, 380].map((w, i) => (
                  <div key={w} style={{ display: 'flex', alignItems: 'center', gap: 20, height: 62, padding: '0 20px', borderRadius: 14, background: alpha(C.ink800, 0.7), opacity: progress(frame, openAt + 6 + i * 6, 10) }}>
                    <Icon name="file" size={38} color={C.muted} />
                    <span style={{ width: w, height: 18, borderRadius: 9, background: alpha(C.muted, 0.38) }} />
                  </div>
                ))}
              </div>
            </div>

            {/* the new report and «Guardar» */}
            <div style={{ position: 'absolute', inset: 0, padding: '34px 48px', opacity: docIn }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
                <Icon name="file" size={56} color={C.cyan} />
                <span style={{ fontSize: 54, fontWeight: 850, letterSpacing: -1, color: C.textStrong }}>Parte nuevo</span>
              </div>
              <div style={{ marginTop: 34 }}>
                <Bars widths={[800, 700, 760, 420]} />
              </div>
              <div
                style={{
                  position: 'absolute',
                  left: 800,
                  top: 346,
                  width: 220,
                  height: 70,
                  boxSizing: 'border-box',
                  display: 'grid',
                  placeItems: 'center',
                  borderRadius: 16,
                  background: alpha(C.cyan, frame >= clickAt ? 0.6 : 0.24),
                  border: `3px solid ${C.cyan}`,
                  boxShadow: `0 0 ${Math.round(30 * progress(frame, saveAt, 14))}px ${alpha(C.cyan, 0.4)}`,
                  fontSize: 38,
                  fontWeight: 850,
                  color: C.textStrong,
                }}
              >
                Guardar
              </div>
            </div>

            {/* the notice: it shakes once and the cursor stays still on it */}
            {frame >= deniedAt - 2 ? (
              <div
                style={{
                  position: 'absolute',
                  left: 300 + shake,
                  top: 232,
                  width: 760,
                  height: 190,
                  boxSizing: 'border-box',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 28,
                  padding: '0 36px',
                  borderRadius: RADIUS.lg,
                  background: alpha(C.ink950, 0.96),
                  border: `5px solid ${C.rose}`,
                  boxShadow: `0 0 60px ${alpha(C.rose, 0.4)}, 0 30px 60px ${alpha('#000000', 0.5)}`,
                  opacity: deniedIn,
                  transform: `scale(${0.92 + 0.08 * deniedIn})`,
                }}
              >
                <div style={{ width: 96, height: 96, borderRadius: 48, flexShrink: 0, display: 'grid', placeItems: 'center', background: alpha(C.rose, 0.2), border: `4px solid ${C.rose}` }}>
                  <Icon name="x" size={60} color={C.rose} strokeWidth={3.4} />
                </div>
                <span style={{ fontSize: 62, fontWeight: 900, letterSpacing: -1.5, color: C.textStrong, whiteSpace: 'nowrap' }}>Acceso denegado</span>
              </div>
            ) : null}

            <Cursor
              frame={frame}
              appearAt={openAt}
              path={[
                { x: 420, y: 120, at: openAt + 4 },
                { x: 940, y: 372, at: clickAt, click: true },
              ]}
            />
          </WindowFrame>
        </div>
      ) : null}

      {/* the title and the two questions */}
      {frame >= titleAt - 2 && titleFade > 0.01 ? (
        <div style={{ position: 'absolute', left: TEXT_X, top: 96, opacity: titleFade }}>
          <div
            style={{
              fontFamily: FONT.sans,
              fontSize: 112,
              fontWeight: 900,
              letterSpacing: -3,
              lineHeight: 1.04,
              color: C.textStrong,
              whiteSpace: 'nowrap',
              textShadow: `0 0 30px ${alpha(C.cyan, 0.2)}`,
              ...titleIn,
            }}
          >
            <div>{TITLE[0]}</div>
            <div style={{ color: C.cyan }}>{TITLE[1]}</div>
          </div>
          <div style={{ display: 'grid', gap: 20, marginTop: 36, justifyItems: 'start' }}>
            {CHIPS.map((c, i) => {
              const at = i === 0 ? chip1 : chip2;
              if (frame < at - 2) return null;
              return (
                <div key={c} style={enter(frame, at, { distance: 16 })}>
                  <Pill text={c} tone={C.cyan} on={0.9} size={52} height={86} />
                </div>
              );
            })}
          </div>
        </div>
      ) : null}

      {/* the thread: the folder and its list, in the same place in every scene */}
      {frame >= folderAt - 4 ? (
        <div style={{ position: 'absolute', left: 0, top: 84 }}>
          <FolderAcl
            entries={PARTES}
            show={listShow}
            fx={{
              staff: { show: rowShow(0) },
              maint: { show: rowShow(1) },
              ops: { show: rowShow(2) },
              svc: { show: rowShow(3) },
            }}
            rest={{ show: rowShow(4) }}
          />
        </div>
      ) : null}

      {/* the promise */}
      {PROMISE.map((p, i) => {
        const at = promiseAts[i];
        if (frame < at - 2) return null;
        const on = progress(frame, at, 10);
        return (
          <div key={p.text} style={{ position: 'absolute', left: 900, top: 100 + i * 108, ...enter(frame, at, { distance: 18 }) }}>
            <Pill text={p.text} tone={C.cyan} icon={p.icon} on={0.45 + 0.55 * on} size={46} height={88} />
          </div>
        );
      })}
    </Stage>
  );
}

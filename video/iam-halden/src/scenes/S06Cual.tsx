import type { ReactNode } from 'react';
import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { Icon, clamp01, dimStyle, mix } from '../../../engine/src/ui';
import { MIXED_WORDS, ROWS, SUM, type RowId } from '../data/s06-cual';
import { PassCard } from './parts/PassCard';
import { Voucher } from './parts/Voucher';
import { Stage, wordFrame } from './kit';

const S = 's06-cual';
const W = 1728;

// Row geometry (stage-local).
const ROW_Y: Record<RowId, number> = { saml: 24, oauth: 168, oidc: 312, ldap: 470 };
const ROW_H = 116;
const ICON_W = 180;
const PHRASE = { x: 200, w: 900 };
const ARROW = { x0: 1112, x1: 1206 };
const NAME_X = 1214;
const NAME_W = W - NAME_X;
// Where the exam's three names sit, jumbled, before they are matched (s06-01 «el examen mezcla…»).
const MIXED: Partial<Record<RowId, { x: number; y: number; rot: number }>> = {
  saml: { x: 1290, y: 150, rot: -5 },
  oauth: { x: 1420, y: 280, rot: 4 },
  ldap: { x: 1300, y: 400, rot: -3 },
};
// …and where they sit first, in the middle of the empty stage, until the first scenario arrives.
const OPENING: Partial<Record<RowId, { x: number; y: number }>> = {
  saml: { x: 640, y: 190 },
  oauth: { x: 820, y: 300 },
  ldap: { x: 660, y: 410 },
};
const SUM_Y = 476;

/**
 * s06-cual «¿Quién eres o qué puede hacer?». The exam's names show up
 * jumbled on the right (SAML, OAUTH, LDAP); then each scenario falls into its
 * row and hooks onto its name, with the icon of its image: «entrar en la web
 * del socio con tu cuenta» (the pass) > SAML; «una app lee tu calendario sin
 * tu contraseña» (the voucher) > OAUTH; «Iniciar sesión con…» (the voucher
 * with an identity card on top) > OPENID CONNECT; below, the directory behind
 * the IdP, «consultar el directorio de casa» > LDAP, which then dims. sum:
 * the chapter's closing row — «SAML: quién eres, para entrar» · «OAuth: qué
 * puede hacer una app por ti» · «OIDC: OAuth más quién eres».
 */
export function S06Cual(props: SceneProps) {
  const frame = useCurrentFrame();
  const w = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);

  const samlQ = props.cue('saml-q');
  const sum = props.cue('sum');

  const at = Object.fromEntries(
    ROWS.map((r) => [
      r.id,
      {
        phrase: Math.max(r.id === 'saml' ? samlQ : props.cue(r.id === 'oauth' ? 'oauth-q' : r.id === 'oidc' ? 'oidc' : 'ldap'), w(r.seg, r.phraseWord) - 8),
        name: w(r.seg, r.nameWord, r.nameNth ?? 0) - 6,
        icon: w(r.seg, r.iconWord) - 8,
      },
    ]),
  ) as Record<RowId, { phrase: number; name: number; icon: number }>;
  const mixedAt = Object.fromEntries(Object.entries(MIXED_WORDS).map(([id, word]) => [id, w('s06-01', word as string) - 6])) as Partial<Record<RowId, number>>;

  // Rows dim once the next one arrives; all step back for the closing row; LDAP dims and leaves.
  const order: RowId[] = ['saml', 'oauth', 'oidc', 'ldap'];
  const sumIn = progress(frame, sum - 6, 16, EASE.inOut);
  const rowDim = (id: RowId) => {
    const i = order.indexOf(id);
    const next = order[i + 1];
    const later = next ? progress(frame, at[next].phrase, 14, EASE.inOut) * 0.45 : 0;
    return Math.max(later, 0.35 * sumIn);
  };
  const ldapOut = progress(frame, sum - 8, 14, EASE.inOut);
  const ldapDim = progress(frame, w('s06-04', 'ldap') + 24, 20, EASE.inOut) * 0.5;

  return (
    <Stage>
      {ROWS.map((r) => {
        const t = at[r.id];
        const fall = progress(frame, t.phrase, 18, EASE.out);
        const snap = progress(frame, t.name, 18, EASE.inOut);
        const iconIn = progress(frame, t.icon, 14);
        const isLdap = r.id === 'ldap';
        const d = isLdap ? Math.max(ldapDim, 0) : rowDim(r.id);
        const rowOpacity = isLdap ? 1 - ldapOut : 1;
        const y = ROW_Y[r.id];
        const mixed = MIXED[r.id];
        // The jumbled names are already there (faint) as the scene opens, and light up as the voice names them.
        const mixedIn = mixed && mixedAt[r.id] !== undefined ? 0.45 * progress(frame, -10, 12) + 0.55 * progress(frame, mixedAt[r.id] as number, 12) : 0;
        // The name: jumbled on the right first (if the voice named it in s06-01), then slides into its row.
        const nameShow = Math.max(mixedIn, snap);
        const opening = OPENING[r.id];
        const toCluster = progress(frame, at.saml.phrase - 12, 22, EASE.inOut);
        const mx = mixed && opening ? mix(opening.x, mixed.x, toCluster) : 0;
        const my = mixed && opening ? mix(opening.y, mixed.y, toCluster) : 0;
        const nx = mixed ? mix(mx, NAME_X, snap) : NAME_X;
        const ny = mixed ? mix(my, y + (ROW_H - 76) / 2, snap) : y + (ROW_H - 76) / 2 - (1 - snap) * 30;
        const rot = mixed ? mix(mixed.rot, 0, snap) : 0;
        if (fall <= 0 && nameShow <= 0) return null;
        return (
          <div key={r.id} style={{ position: 'absolute', inset: 0, opacity: rowOpacity }}>
            <div style={{ position: 'absolute', inset: 0, ...dimStyle(d) }}>
              {/* Icon of the image */}
              {iconIn > 0 ? (
                <div style={{ position: 'absolute', left: 0, top: y, width: ICON_W, height: ROW_H, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: iconIn, transform: `scale(${0.85 + 0.15 * iconIn})` }}>
                  <RowIcon id={r.id} />
                </div>
              ) : null}

              {/* The scenario */}
              {fall > 0 ? (
                <div
                  style={{
                    position: 'absolute',
                    left: PHRASE.x,
                    top: y,
                    width: PHRASE.w,
                    height: ROW_H,
                    display: 'flex',
                    alignItems: 'center',
                    opacity: fall,
                    transform: `translateY(${(1 - fall) * -60}px)`,
                  }}
                >
                  {r.id === 'oidc' ? <SignInButton text={r.phrase} /> : <PhraseCard text={r.phrase} small={isLdap} />}
                </div>
              ) : null}

              {/* Hook */}
              {snap > 0 ? (
                <svg width={ARROW.x1 - ARROW.x0 + 20} height={40} style={{ position: 'absolute', left: ARROW.x0, top: y + ROW_H / 2 - 20, overflow: 'visible' }}>
                  <line x1={0} y1={20} x2={(ARROW.x1 - ARROW.x0 - 14) * snap} y2={20} stroke={C.violet} strokeWidth={5} strokeLinecap="round" />
                  {snap > 0.8 ? <polygon points={`${ARROW.x1 - ARROW.x0},20 ${ARROW.x1 - ARROW.x0 - 18},8 ${ARROW.x1 - ARROW.x0 - 18},32`} fill={C.violet} /> : null}
                </svg>
              ) : null}
            </div>

            {/* The name (dims with its row once matched) */}
            {nameShow > 0 ? (
              <div style={{ position: 'absolute', left: nx, top: ny, width: NAME_W, opacity: nameShow, transform: `rotate(${rot}deg)`, transformOrigin: 'left center', ...(snap > 0.5 ? dimStyle(d, nameShow) : {}) }}>
                <NameChip text={r.name} lit={snap} />
              </div>
            ) : null}
          </div>
        );
      })}

      {/* Closing row */}
      {sumIn > 0 ? (
        <div style={{ position: 'absolute', left: 0, top: SUM_Y, width: W, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {SUM.map((s, i) => {
            const p = progress(frame, w('s06-05', s.word) - 6, 14);
            return (
              <div key={s.lead} style={{ display: 'flex', alignItems: 'center' }}>
                {i > 0 ? <span style={{ fontFamily: FONT.sans, fontSize: 44, color: C.faint, margin: '0 6px', opacity: p }}>·</span> : null}
                <div
                  style={{
                    width: 540,
                    height: 160,
                    boxSizing: 'border-box',
                    padding: '0 28px',
                    borderRadius: RADIUS.lg,
                    border: `2px solid ${alpha(C.violet, 0.4 + 0.4 * p)}`,
                    background: `linear-gradient(180deg, ${alpha(C.violetDeep, 0.6)} 0%, ${C.ink900} 100%)`,
                    boxShadow: `0 20px 44px ${alpha('#000000', 0.4)}`,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    fontFamily: FONT.sans,
                    ...enter(frame, w('s06-05', s.word) - 6, { distance: 18 }),
                  }}
                >
                  <div style={{ fontSize: 40, fontWeight: 900, color: '#c4b5fd', letterSpacing: 0.5, lineHeight: 1.1 }}>{s.lead}</div>
                  <div style={{ marginTop: 6, fontSize: 36, fontWeight: 750, color: C.textStrong, lineHeight: 1.15 }}>{s.text}</div>
                </div>
              </div>
            );
          })}
        </div>
      ) : null}
    </Stage>
  );
}

function PhraseCard({ text, small = false }: { text: string; small?: boolean }) {
  return (
    <div
      style={{
        maxWidth: PHRASE.w,
        padding: small ? '14px 26px' : '18px 30px',
        boxSizing: 'border-box',
        borderRadius: RADIUS.lg,
        border: `2px solid ${C.ink600}`,
        background: `linear-gradient(180deg, ${C.ink850} 0%, ${C.ink900} 100%)`,
        boxShadow: `0 18px 40px ${alpha('#000000', 0.38)}`,
        fontFamily: FONT.sans,
        fontSize: small ? 38 : 40,
        fontWeight: 750,
        color: C.textStrong,
        whiteSpace: 'nowrap',
      }}
    >
      {text}
    </div>
  );
}

/** «Iniciar sesión con…» as a generic sign-in button (no brand). */
function SignInButton({ text }: { text: string }) {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 20,
        height: 92,
        padding: '0 40px 0 22px',
        boxSizing: 'border-box',
        borderRadius: RADIUS.pill,
        border: `3px solid ${alpha(C.text, 0.8)}`,
        background: C.textStrong,
        boxShadow: `0 18px 40px ${alpha('#000000', 0.45)}`,
        fontFamily: FONT.sans,
        fontSize: 46,
        fontWeight: 800,
        color: C.ink950,
        whiteSpace: 'nowrap',
      }}
    >
      <div style={{ width: 58, height: 58, borderRadius: '50%', background: C.ink800, display: 'grid', placeItems: 'center' }}>
        <Icon name="user" size={38} color={C.textStrong} />
      </div>
      {text}
    </div>
  );
}

function NameChip({ text, lit }: { text: string; lit: number }) {
  const k = clamp01(lit);
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        height: 76,
        padding: '0 28px',
        boxSizing: 'border-box',
        borderRadius: RADIUS.md,
        border: `3px solid ${alpha(C.violet, 0.5 + 0.45 * k)}`,
        background: alpha(C.violetDeep, 0.5 + 0.4 * k),
        boxShadow: k > 0 ? `0 0 ${Math.round(26 * k)}px ${alpha(C.violet, 0.4 * k)}` : undefined,
        fontFamily: FONT.sans,
        fontSize: 48,
        fontWeight: 900,
        letterSpacing: 2,
        color: '#c4b5fd',
        whiteSpace: 'nowrap',
      }}
    >
      {text}
    </span>
  );
}

function RowIcon({ id }: { id: RowId }): ReactNode {
  if (id === 'saml') return <PassCard width={132} mini />;
  if (id === 'oauth') return <Voucher width={160} mini />;
  if (id === 'oidc') return <Voucher width={150} mini idCard={1} style={{ marginTop: 26 }} />;
  return (
    <div style={{ width: 96, height: 96, borderRadius: RADIUS.md, border: `3px solid ${alpha(C.cyan, 0.6)}`, background: alpha(C.cyan, 0.08), display: 'grid', placeItems: 'center' }}>
      <Icon name="database" size={60} color={C.cyan} />
    </div>
  );
}

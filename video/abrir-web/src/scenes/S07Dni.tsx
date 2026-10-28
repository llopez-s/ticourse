import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../engine/src/theme/motion';
import { mix, windowWeight } from '../../../engine/src/ui';
import { Stage } from './kit';
import { DrawnTick, Pill } from './parts/Bits';
import { AnchorChain, anchorChainPoints } from './parts/AnchorChain';
import { CaSeal } from './parts/CaSeal';
import { CertCard, type CertRow } from './parts/CertCard';
import { CERT, CHECKS, DNI_MIRROR } from './parts/data';
import { DniCard, dniSize } from './parts/Dni';
import { Face } from './parts/Face';
import { ImageTag } from './parts/Images';
import { Ribbon, ribbonLit } from './parts/Ribbon';
import { ImaginaSeal } from './parts/Seal';

const DNI_MAIN = { left: 20, top: 150, width: 400 };
const DNI_FINAL = { left: 60, top: 172, width: 480 };
const CARD = { left: 460, top: 100, width: 710 };
const CHAIN = { left: 1255, top: 130, height: 360 };
const MONO = { fontFamily: FONT.mono, fontSize: 30, fontWeight: 500 } as const;

/**
 * s07-dni «El DNI del servidor». The DNI (left) is the server's certificate; the card (right) holds the four checks of
 * the browser, each drawn on its cue (the engine's «check» sound falls on name, signer, dates, revoc) and mirrored
 * on the DNI by a small tag.
 *   question  DNI + the card with its four labelled, still empty rows;
 *   name / signer / dates / revoc  rows fill and tick;   chain / root  the chain of trust (complete and solid) with
 *   the CA's seal and the trust-store box;   photo / face  the card steps back; the DNI's photo = public key, a
 *   drawn face = private key;   copy-dni  a photocopy has the photo but no face;   wrap  the four ticks, still.
 */
export function S07Dni(props: SceneProps) {
  const frame = useCurrentFrame();
  const cue = props.cue;
  const name = cue('name');
  const signer = cue('signer');
  const chain = cue('chain');
  const root = cue('root');
  const dates = cue('dates');
  const revoc = cue('revoc');
  const photo = cue('photo');
  const face = cue('face');
  const copyDni = cue('copy-dni');
  const wrap = cue('wrap');

  // ---- The four rows.
  const rowStart = [name, signer, dates, revoc];
  const rowEnd = [signer, dates, revoc, photo];
  const show = rowStart.map((a) => progress(frame, a - 2, 14));
  const tick = rowStart.map((a) => progress(frame, a + 6, 16, EASE.inOut));
  const focus = rowStart.map((a, i) => windowWeight(frame, a, rowEnd[i], { ramp: 12, lead: 2 }) * (1 - progress(frame, photo - 6, 14)));
  const rootLine = progress(frame, root - 2, 14);

  const rows: CertRow[] = [
    { lines: [<span key="a" style={MONO}>{CERT.cn}</span>], show: show[0], tick: tick[0], focus: focus[0] },
    {
      lines: [
        <span key="a" style={{ fontSize: 31 }}>{CERT.issuer}</span>,
        <span key="b" style={{ fontSize: 29, color: C.text, opacity: rootLine }}>{CERT.root} · en tu equipo</span>,
      ],
      show: show[1],
      tick: tick[1],
      focus: focus[1],
    },
    { lines: [`${CERT.from} a ${CERT.to}`], show: show[2], tick: tick[2], focus: focus[2] },
    { lines: ['respuesta de la CA, grapada'], show: show[3], tick: tick[3], focus: focus[3] },
  ];

  // ---- The chain and the CA's seal.
  const chainIn = progress(frame, chain - 2, 20);
  const trustBox = progress(frame, root - 2, 16);
  const sealIn = progress(frame, signer + 4, 16);
  const pts = anchorChainPoints(CHAIN.height);

  // ---- The final panel (photo and face), then the four ticks.
  const fin = progress(frame, photo - 6, 20, EASE.inOut);
  const mainOut = 1 - fin;
  const wrapIn = progress(frame, wrap - 2, 18);
  const panelDim = 1 - progress(frame, wrap - 6, 12);
  const dniLeft = mix(DNI_MAIN.left, DNI_FINAL.left, fin);
  const dniTop = mix(DNI_MAIN.top, DNI_FINAL.top, fin);
  const dniW = mix(DNI_MAIN.width, DNI_FINAL.width, fin);
  const u = dniW / 100;
  const photoRing = progress(frame, photo, 12);
  const faceIn = progress(frame, face, 16);
  const copyIn = progress(frame, copyDni, 16);
  const copyFail = progress(frame, copyDni + 22, 12);

  // ---- Mirror tags under the DNI.
  const mirror = tick;

  return (
    <Stage>
      <Ribbon lit={ribbonLit(frame, {}, ['DHCP', 'DNS', 'TCP', 'TLS'])} />

      {/* the DNI (left, then centre-left in the final panel) */}
      <div style={{ position: 'absolute', left: dniLeft, top: dniTop - 48, opacity: panelDim }}>
        <ImageTag />
      </div>
      <div style={{ position: 'absolute', left: dniLeft, top: dniTop, opacity: panelDim }}>
        <DniCard width={dniW} glow={0.25 + 0.5 * photoRing * (1 - copyIn)} />
        {/* the photo = public key */}
        {photoRing > 0.01 ? (
          <div
            style={{
              position: 'absolute',
              left: 6 * u - 8 + 1.6 * u,
              top: 18 * u - 8 + 1.6 * u,
              width: 26 * u + 16,
              height: 32 * u + 16,
              borderRadius: 16,
              border: `4px solid ${alpha(C.sky, 0.95)}`,
              boxShadow: `0 0 26px ${alpha(C.sky, 0.55)}`,
              opacity: photoRing,
              transform: `scale(${1.2 - 0.2 * photoRing})`,
            }}
          />
        ) : null}
      </div>

      {/* mirror tags: each check lands on the DNI */}
      <div style={{ position: 'absolute', left: DNI_MAIN.left, top: DNI_MAIN.top + dniSize(DNI_MAIN.width).h + 26, width: DNI_MAIN.width, opacity: mainOut }}>
        {DNI_MIRROR.map((t, i) => (
          <div
            key={t}
            style={{
              height: 38,
              marginBottom: 7,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '0 14px',
              borderRadius: RADIUS.md,
              border: `2px solid ${mirror[i] > 0.5 ? alpha(C.emerald, 0.8) : C.ink600}`,
              background: mirror[i] > 0.5 ? alpha(C.emerald, 0.1) : alpha(C.ink850, 0.7),
              fontFamily: FONT.sans,
              fontSize: 27,
              fontWeight: 700,
              color: mirror[i] > 0.5 ? C.textStrong : C.faint,
              whiteSpace: 'nowrap',
            }}
          >
            <DrawnTick size={28} draw={mirror[i]} ring={false} />
            {t}
          </div>
        ))}
      </div>

      {/* the certificate card */}
      <div style={{ position: 'absolute', left: CARD.left, top: CARD.top, opacity: mainOut }}>
        <CertCard cn={CERT.cn} rows={rows} width={CARD.width} />
      </div>

      {/* CA's seal and the chain of trust */}
      <div style={{ position: 'absolute', left: 1180, top: CHAIN.top + pts.middle.y - 42, opacity: mainOut }}>
        <CaSeal size={84} press={sealIn} verdict="ok" check={progress(frame, signer + 14, 12)} />
      </div>
      {chainIn > 0 ? (
        <div style={{ position: 'absolute', left: CHAIN.left, top: CHAIN.top, opacity: mainOut }}>
          <AnchorChain height={CHAIN.height} show={chainIn} />
          {/* trust-store box around the anchor and the deck */}
          <div
            style={{
              position: 'absolute',
              left: pts.deck.left - 26,
              top: -14,
              width: pts.deck.right - pts.deck.left + 52,
              height: pts.deck.bottom + 24,
              borderRadius: 22,
              border: `4px dashed ${alpha(C.emerald, 0.9)}`,
              background: alpha(C.emerald, 0.06),
              opacity: trustBox,
              boxShadow: `0 0 ${Math.round(26 * trustBox)}px ${alpha(C.emerald, 0.3)}`,
            }}
          />
          <div style={{ position: 'absolute', left: pts.deck.right + 46, top: 0, width: 200, opacity: trustBox, fontFamily: FONT.sans, fontSize: 30, fontWeight: 750, lineHeight: 1.15, color: '#6ee7b7' }}>
            almacén de confianza de tu equipo
          </div>
          <Tag x={pts.middle.right + 26} y={pts.middle.y} show={progress(frame, chain + 14, 12)}>
            CA intermedia
          </Tag>
          <Tag x={pts.leaf.right + 26} y={pts.leaf.y} show={progress(frame, chain + 20, 12)}>
            portal
          </Tag>
        </div>
      ) : null}

      {/* final panel: photo = public key, face = private key, the photocopy has no face */}
      {fin > 0.01 ? (
        <div style={{ position: 'absolute', left: 0, top: 0, width: 1728, height: 660, opacity: fin * panelDim, fontFamily: FONT.sans }}>
          <div style={{ position: 'absolute', left: 60, top: 500, opacity: photoRing }}>
            <Pill tone="#bae6fd" border={alpha(C.sky, 0.8)} icon="key" size={34}>
              foto = clave pública
            </Pill>
            <div style={{ marginTop: 8, marginLeft: 8, fontSize: 28, fontWeight: 650, color: C.muted }}>va dentro del certificado</div>
          </div>

          <div style={{ position: 'absolute', left: 620, top: 192, opacity: faceIn, transform: `translateY(${(1 - faceIn) * 14}px)` }}>
            <Face size={240} glow={0.5 * faceIn} />
          </div>
          <div style={{ position: 'absolute', left: 620, top: 500, opacity: faceIn }}>
            <Pill tone={C.cyanSoft} border={alpha(C.cyan, 0.8)} icon="key" size={34}>
              cara = clave privada
            </Pill>
            <div style={{ marginTop: 8, marginLeft: 8, fontSize: 28, fontWeight: 650, color: C.muted }}>solo la tiene el servidor</div>
          </div>

          {/* the photocopy: photo yes, face no */}
          <div style={{ position: 'absolute', left: 1100, top: 192, opacity: copyIn, transform: `translateY(${(1 - copyIn) * 14}px)` }}>
            <DniCard width={340} dim={0.1} style={{ filter: 'grayscale(1)' }} />
            <div style={{ marginTop: 8, fontSize: 28, fontWeight: 700, color: C.muted, textAlign: 'center' }}>fotocopia</div>
          </div>
          <div
            style={{
              position: 'absolute',
              left: 1480,
              top: 192,
              width: 220,
              height: 220,
              borderRadius: '50%',
              border: `4px dashed ${C.ink500}`,
              opacity: copyIn,
              display: 'grid',
              placeItems: 'center',
            }}
          >
            <svg width={120} height={120} viewBox="0 0 120 120" style={{ opacity: copyFail }}>
              <path d="M 24 24 L 96 96 M 96 24 L 24 96" stroke={C.rose} strokeWidth={10} strokeLinecap="round" />
            </svg>
          </div>
          <div style={{ position: 'absolute', left: 1100, top: 500, opacity: copyIn }}>
            <Pill tone={C.text} border={C.ink500} size={34}>
              el DNI se fotocopia, la cara no
            </Pill>
          </div>
        </div>
      ) : null}

      {/* wrap: the four ticks, quiet */}
      {wrapIn > 0.01 ? (
        <div style={{ position: 'absolute', left: 0, top: 200, width: 1728, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 44, opacity: wrapIn, fontFamily: FONT.sans }}>
          <div style={{ display: 'flex', gap: 28 }}>
            {CHECKS.map((c, i) => (
              <div
                key={c}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  padding: '14px 28px 14px 20px',
                  borderRadius: RADIUS.pill,
                  border: `3px solid ${alpha(C.emerald, 0.75)}`,
                  background: alpha(C.emerald, 0.1),
                  fontSize: 40,
                  fontWeight: 800,
                  color: C.textStrong,
                  whiteSpace: 'nowrap',
                  opacity: progress(frame, wrap + i * 3, 12),
                }}
              >
                <DrawnTick size={52} draw={1} />
                {c}
              </div>
            ))}
          </div>
          <div style={{ fontSize: 42, fontWeight: 750, color: C.text, whiteSpace: 'nowrap' }}>el navegador comprueba quién es el servidor</div>
        </div>
      ) : null}

      <ImaginaSeal />
    </Stage>
  );
}

function Tag({ x, y, show, children }: { x: number; y: number; show: number; children: string }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y - 22,
        height: 44,
        display: 'flex',
        alignItems: 'center',
        padding: '0 16px',
        borderRadius: RADIUS.pill,
        border: `2px solid ${C.ink500}`,
        background: alpha(C.ink950, 0.92),
        fontFamily: FONT.sans,
        fontSize: 28,
        fontWeight: 700,
        color: C.text,
        whiteSpace: 'nowrap',
        opacity: show,
        transform: `translateX(${(1 - show) * -10}px)`,
      }}
    >
      {children}
    </div>
  );
}

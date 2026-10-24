import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../engine/src/theme/motion';
import { Icon, type IconName } from '../../../engine/src/ui';
import { ContractPage } from './parts/Art';
import { ImageTag, Pill } from './parts/Labels';
import { NurseryHouse } from './parts/Nursery';
import { Stage, wordFrame } from './kit';

const S = 's04-antes';

const RAIL_Y = 424;
const NODE_X = 864;
const RIGHT_X = 958;
const COL_W = 770;

/** Due diligence's five labels (the voice says the first three; certifications and references are on screen only). */
const DD = [
  { text: 'finanzas', word: 'finanzas' },
  { text: 'dueños', word: 'dueño' },
  { text: 'historial de brechas', word: 'brechas' },
  { text: 'certificaciones', word: 'diligence' },
  { text: 'referencias', word: 'diligence' },
] as const;

/** What goes into the contract while it can (lit on the voice's words). */
const TERMS = [
  { icon: 'eye', text: 'right-to-audit', word: 'auditar' },
  { icon: 'bell', text: 'avisar de un incidente en 24 h', word: 'avisen' },
  { icon: 'eyeOff', text: 'borrar los datos al terminar', word: 'borren' },
] as const satisfies readonly { icon: IconName; text: string; word: string }[];

/** Vendor monitoring's four routines. */
const ROUTINES = [
  { icon: 'file', text: 'cuestionarios periódicos', word: 'repiten', lag: 0 },
  { icon: 'shield', text: 'informe independiente nuevo', word: 'repiten', lag: 22 },
  { icon: 'chart', text: 'métricas del servicio (SLA)', word: 'mide', lag: 0 },
  { icon: 'eye', text: 'noticias, dueños y subcontratas', word: 'vigilan', lag: 0 },
] as const satisfies readonly { icon: IconName; text: string; word: string; lag: number }[];

/** A zone heading («antes de firmar» / «después de firmar»): dim until the voice reaches it. */
function Heading({ text, tone, on, show }: { text: string; tone: string; on: number; show: number }) {
  return (
    <div style={{ opacity: show * (0.4 + 0.6 * on), fontFamily: FONT.sans, fontSize: 40, fontWeight: 900, letterSpacing: 0.5, color: tone, whiteSpace: 'nowrap', textTransform: 'uppercase' }}>{text}</div>
  );
}

/**
 * s04-antes «Antes de firmar y después». On `timeline` the rail draws across the stage and the contract in the middle is
 * signed (the pen signs it): the signature splits the story in two, with «antes de firmar» / «después de firmar» waiting
 * dim. `before`: the left heading lights, DUE DILIGENCE comes in with its five labels, each lit on the voice's word.
 * `contract-terms`: the box of what goes into the contract while it can (right-to-audit, a 24 h notice of an incident,
 * deleting the data), each lit on its word. `conflict`: CONFLICT OF INTEREST with the rule — whoever evaluates and has a
 * relative in a candidate declares it and steps aside. `after`: the right heading lights and VENDOR MONITORING comes in;
 * on `monitoring` its four routines and «reevaluar al renovar». `nursery-2`: the nursery's visit before signing up and
 * its look of every day, tagged as an image.
 */
export function S04Antes(props: SceneProps) {
  const frame = useCurrentFrame();
  const timelineAt = props.cue('timeline');
  const beforeAt = props.cue('before');
  const termsAt = props.cue('contract-terms');
  const conflictAt = props.cue('conflict');
  const afterAt = props.cue('after');
  const monitoringAt = props.cue('monitoring');
  const nurseryAt = props.cue('nursery-2');

  const diligenceAt = wordFrame(S, 's04-01', 'diligence');
  const ddAt = DD.map((d) => wordFrame(S, 's04-01', d.word) - 6);
  const termAt = TERMS.map((t) => wordFrame(S, 's04-02', t.word) - 6);
  const declaraAt = wordFrame(S, 's04-03', 'declara') - 6;
  const rutinaAt = ROUTINES.map((r) => wordFrame(S, 's04-04', r.word) - 6 + r.lag);
  const renovarAt = wordFrame(S, 's04-04', 'subcontratas') + 4;
  const visitaAt = wordFrame(S, 's04-05', 'visitas') - 6;
  const miraAt = wordFrame(S, 's04-05', 'miras') - 6;

  const rail = progress(frame, timelineAt, 44, EASE.inOut);
  const nodeIn = progress(frame, timelineAt + 8, 16);
  const sign = progress(frame, timelineAt + 30, 46, EASE.inOut);
  const headIn = progress(frame, timelineAt + 40, 16);
  const beforeOn = progress(frame, beforeAt - 4, 12);
  const afterOn = progress(frame, afterAt - 4, 12);
  const leftDim = 1 - 0.38 * progress(frame, afterAt - 6, 16);

  const ddTerm = progress(frame, diligenceAt - 6, 12);
  const termsIn = progress(frame, termsAt - 4, 16);
  const conflictIn = progress(frame, conflictAt - 4, 16);
  const declara = progress(frame, declaraAt, 12);
  const monIn = progress(frame, afterAt - 2, 14);
  const renovar = progress(frame, renovarAt, 14);
  const nurseryIn = progress(frame, nurseryAt - 2, 16);

  return (
    <Stage>
      {/* the rail: before in cyan, after in emerald, the signed contract in the middle */}
      <div style={{ position: 'absolute', left: 0, top: RAIL_Y - 4, width: (NODE_X - 56) * rail, height: 8, borderRadius: 4, background: alpha(C.cyan, 0.7), boxShadow: `0 0 14px ${alpha(C.cyan, 0.35)}` }} />
      <div style={{ position: 'absolute', left: NODE_X + 56, top: RAIL_Y - 4, width: (1728 - NODE_X - 56 - 22) * rail, height: 8, borderRadius: 4, background: alpha(C.emerald, 0.7), boxShadow: `0 0 14px ${alpha(C.emerald, 0.35)}` }} />
      {rail > 0.97 ? (
        <svg width={30} height={30} viewBox="0 0 30 30" style={{ position: 'absolute', left: 1728 - 30, top: RAIL_Y - 15 }}>
          <path d="M 4 3 L 26 15 L 4 27 Z" fill={alpha(C.emerald, 0.8)} />
        </svg>
      ) : null}
      <div style={{ position: 'absolute', left: NODE_X - 56, top: RAIL_Y - 71, opacity: nodeIn, transform: `scale(${0.88 + 0.12 * nodeIn})`, transformOrigin: '50% 50%' }}>
        <ContractPage width={112} rows={3} sign={sign} />
      </div>
      <div style={{ position: 'absolute', left: NODE_X - 100, top: RAIL_Y + 78, width: 200, textAlign: 'center', fontFamily: FONT.sans, fontSize: 34, fontWeight: 800, color: C.text, opacity: nodeIn }}>la firma</div>

      {/* left: before signing */}
      <div style={{ position: 'absolute', left: 0, top: 0, width: COL_W, height: RAIL_Y - 20, opacity: leftDim }}>
        <div style={{ position: 'absolute', left: 0, top: 0, display: 'flex', alignItems: 'center', gap: 22, height: 60 }}>
          <Heading text="antes de firmar" tone={C.cyanSoft} on={beforeOn} show={headIn} />
          {ddTerm > 0.01 ? <Pill text="due diligence" tone={C.cyan} icon="search" size={36} height={56} on={ddTerm} weight={850} style={{ opacity: ddTerm }} /> : null}
        </div>
        {[DD.slice(0, 3), DD.slice(3)].map((row, ri) => (
          <div key={ri} style={{ position: 'absolute', left: 0, top: 74 + ri * 60, display: 'flex', gap: 14 }}>
            {row.map((d, k) => {
              const i = ri === 0 ? k : 3 + k;
              const lit = progress(frame, ddAt[i], 10);
              const show = progress(frame, beforeAt - 2 + i * 3, 12);
              return (
                <div key={d.text} style={{ opacity: show }}>
                  <Pill text={d.text} tone={C.cyan} on={0.12 + 0.88 * lit} size={31} height={52} style={{ padding: '0 22px' }} />
                </div>
              );
            })}
          </div>
        ))}
        {/* what goes into the contract while it can */}
        {termsIn > 0.01 ? (
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 194,
              width: 740,
              height: 166,
              boxSizing: 'border-box',
              padding: '10px 26px',
              borderRadius: RADIUS.lg,
              border: `3px solid ${alpha(C.cyan, 0.55)}`,
              background: alpha(C.cyan, 0.06),
              fontFamily: FONT.sans,
              opacity: termsIn,
              transform: `translateY(${(1 - termsIn) * 16}px)`,
            }}
          >
            <div style={{ fontSize: 28, fontWeight: 700, color: C.muted, lineHeight: 1.3 }}>en el contrato, mientras se puede</div>
            {TERMS.map((t, i) => {
              const lit = progress(frame, termAt[i], 10);
              return (
                <div key={t.text} style={{ display: 'flex', alignItems: 'center', gap: 16, height: 40, opacity: 0.5 + 0.5 * lit }}>
                  <Icon name={t.icon} size={32} color={C.cyan} strokeWidth={2} />
                  <span style={{ fontSize: 32, fontWeight: 750, color: C.textStrong, whiteSpace: 'nowrap' }}>{t.text}</span>
                </div>
              );
            })}
          </div>
        ) : null}
        {/* conflict of interest */}
        {conflictIn > 0.01 ? (
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: RAIL_Y + 46,
              width: 760,
              height: 186,
              boxSizing: 'border-box',
              padding: '10px 26px',
              borderRadius: RADIUS.lg,
              border: `3px solid ${alpha(C.amber, 0.65)}`,
              background: alpha(C.amber, 0.07),
              fontFamily: FONT.sans,
              opacity: conflictIn,
              transform: `translateY(${(1 - conflictIn) * 16}px)`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <Icon name="users" size={38} color={C.amber} strokeWidth={2} />
              <span style={{ fontSize: 36, fontWeight: 900, letterSpacing: 0.5, color: C.amber }}>CONFLICT OF INTEREST</span>
            </div>
            <div style={{ marginTop: 8, fontSize: 31, fontWeight: 650, color: C.text, lineHeight: 1.22 }}>
              <div>quien evalúa tiene a un familiar</div>
              <div>en una candidata</div>
            </div>
            <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 12, fontSize: 34, fontWeight: 850, color: '#6ee7b7', opacity: 0.4 + 0.6 * declara }}>
              <Icon name="check" size={34} color={C.emerald} strokeWidth={3} />
              lo declara y se aparta
            </div>
          </div>
        ) : null}
      </div>

      {/* right: after signing */}
      <div style={{ position: 'absolute', left: RIGHT_X, top: 0, width: COL_W, height: RAIL_Y - 20 }}>
        <div style={{ position: 'absolute', left: 0, top: 0, display: 'flex', alignItems: 'center', gap: 22, height: 60 }}>
          <Heading text="después de firmar" tone="#6ee7b7" on={afterOn} show={headIn} />
        </div>
        {monIn > 0.01 ? (
          <div style={{ position: 'absolute', left: 0, top: 66, opacity: monIn, transform: `translateY(${(1 - monIn) * 12}px)` }}>
            <Pill text="vendor monitoring" tone={C.emerald} icon="radar" size={36} height={58} weight={850} on={monIn} />
          </div>
        ) : null}
        {renovar > 0.01 ? (
          <div style={{ position: 'absolute', left: 0, top: 358, opacity: renovar, transform: `translateY(${(1 - renovar) * 10}px)` }}>
            <Pill text="reevaluar al renovar" tone={C.emerald} icon="clock" size={28} height={46} on={0.5 + 0.5 * renovar} />
          </div>
        ) : null}
        {ROUTINES.map((r, i) => {
          const lit = progress(frame, rutinaAt[i], 10);
          const show = progress(frame, monitoringAt - 2 + i * 4, 14);
          if (show <= 0.01) return null;
          const col = i % 2;
          const row = Math.floor(i / 2);
          return (
            <div
              key={r.text}
              style={{
                position: 'absolute',
                left: col * 394,
                top: 130 + row * 114,
                width: 376,
                height: 104,
                boxSizing: 'border-box',
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: '0 18px',
                borderRadius: 20,
                border: `2px solid ${alpha(C.emerald, 0.35 + 0.55 * lit)}`,
                background: alpha(C.emerald, 0.05 + 0.1 * lit),
                boxShadow: lit > 0.1 ? `0 0 ${Math.round(22 * lit)}px ${alpha(C.emerald, 0.25 * lit)}` : undefined,
                fontFamily: FONT.sans,
                opacity: show,
                transform: `translateY(${(1 - show) * 14}px)`,
              }}
            >
              <Icon name={r.icon} size={40} color={C.emerald} strokeWidth={2} />
              <span style={{ fontSize: 29, fontWeight: 750, color: C.textStrong, lineHeight: 1.14 }}>{r.text}</span>
            </div>
          );
        })}
      </div>

      {/* the nursery in small: the visit before signing up, the look of every day */}
      {nurseryIn > 0.01 ? (
        <div style={{ position: 'absolute', left: RIGHT_X, top: RAIL_Y + 46, width: COL_W, height: 186, opacity: nurseryIn, transform: `translateY(${(1 - nurseryIn) * 16}px)`, fontFamily: FONT.sans }}>
          {[
            { x: 0, house: <NurseryHouse width={136} door={progress(frame, visitaAt, 14)} />, a: 'antes', b: 'la visita', at: visitaAt },
            { x: 396, house: <NurseryHouse width={136} eye={progress(frame, miraAt, 14)} />, a: 'después', b: 'la mirada de cada día', at: miraAt },
          ].map((c) => {
            const lit = progress(frame, c.at, 10);
            return (
              <div key={c.a} style={{ position: 'absolute', left: c.x, top: 0, width: 372, height: 138, display: 'flex', alignItems: 'center', gap: 16, opacity: 0.5 + 0.5 * lit }}>
                {c.house}
                <div style={{ whiteSpace: 'nowrap' }}>
                  <div style={{ fontSize: 28, fontWeight: 700, color: C.muted }}>{c.a}</div>
                  <div style={{ fontSize: 32, fontWeight: 800, color: C.textStrong, lineHeight: 1.12, maxWidth: 220, whiteSpace: 'normal' }}>{c.b}</div>
                </div>
              </div>
            );
          })}
          <div style={{ position: 'absolute', left: 0, top: 146 }}>
            <ImageTag size={26} />
          </div>
        </div>
      ) : null}
    </Stage>
  );
}

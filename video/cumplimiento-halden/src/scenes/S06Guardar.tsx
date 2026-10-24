import type { ReactNode } from 'react';
import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, alpha } from '../../../engine/src/theme/tokens';
import { enter, progress } from '../../../engine/src/theme/motion';
import { Icon } from '../../../engine/src/ui';
import { CLAIMANT_DATA, PLACES, STAMP_SHORT } from '../data/canon';
import { Drawer } from './parts/Images';
import { CaseStamp, Caption, ImageTag, TermPill } from './parts/Labels';
import { DataCard, PLACE_H, PLACE_W, PlaceCard, Person, StackBlock } from './parts/s06-guardar/Bits';
import { Stage, wordFrame } from './kit';

const S = 's06-guardar';
const LEFT_W = 400;
const MID_X = 480;
const RIGHT_X = 1180;
const RIGHT_W = 548;
const PLACE_Y = [86, 244, 402] as const;
const DATA_Y = 262;

/**
 * s06-guardar «Qué tienes y cuánto lo guardas». The compact proposal stamp stays top-left. On `three-places` the claimant's
 * data (nombre · teléfono · documento) lights row by row and lands in three places, each on its word: el sistema · su
 * copia de seguridad · el registro de avisos que se mandan a quien reclama. On `inventory` a bracket ties the three to
 * DATA INVENTORY («no proteges lo que no sabes que tienes»). On `retention` that block folds up and the rule opens: a
 * bar «mientras el objeto está en la oficina + unos meses más», «ni menos que la ley, ni más que el para qué»; on
 * `backups` the «se borra» badge reaches the three places, the copy ringed. On `subject` the person appears, tagged DATA
 * SUBJECT, and on `rtbf-chip` the card of the right to be forgotten opens with its three lines (a law or a legal hold stops
 * it). On `drawer` the filing cabinet of home comes in, tagged «imagen · no es del puerto».
 */
export function S06Guardar(props: SceneProps) {
  const frame = useCurrentFrame();
  const w = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);
  const threeAt = props.cue('three-places');
  const inventoryAt = props.cue('inventory');
  const retentionAt = props.cue('retention');
  const backupsAt = props.cue('backups');
  const subjectAt = props.cue('subject');
  const rtbfAt = props.cue('rtbf-chip');
  const drawerAt = props.cue('drawer');

  const rowAt = CLAIMANT_DATA.map((d) => Math.max(threeAt - 2, w('s06-01', d) - 8));
  const placeAt = PLACES.map((p, i) => Math.max(rowAt[2] + 6 + i * 4, w('s06-01', p.word) - 10));
  const oficinaAt = w('s06-03', 'oficina') - 10;
  const mesesAt = w('s06-03', 'meses') - 10;
  const copiaAt = w('s06-03', 'copia') - 8;
  const leyAt = w('s06-05', 'ley') - 8;
  const holdAt = w('s06-05', 'hold') - 8;
  const tampocoAt = w('s06-05', 'tampoco') - 8;
  const recibosAt = drawerAt;

  const stampIn = enter(frame, -6, { distance: 12, duration: 14 });
  const dataIn = progress(frame, threeAt - 6, 16);
  const rows = CLAIMANT_DATA.map((text, i) => ({ text, on: progress(frame, rowAt[i], 10) * (1 - 0.4 * progress(frame, placeAt[0], 12)) + 0.1 }));
  const dataGlow = progress(frame, threeAt, 12) * (1 - 0.5 * progress(frame, inventoryAt, 16)) + 0.7 * progress(frame, subjectAt, 14) * (1 - progress(frame, subjectAt + 90, 24));

  // The place cards
  const placeIn = placeAt.map((t) => progress(frame, t - 4, 14));
  const placeOn = placeAt.map((t, i) => Math.max(progress(frame, t, 10) * (1 - 0.6 * progress(frame, (placeAt[i + 1] ?? inventoryAt) - 2, 12)), 0.55 * progress(frame, inventoryAt, 14) * (1 - progress(frame, retentionAt, 14))));
  const erase = [0, 1, 2].map((i) => progress(frame, backupsAt + i * 8, 12));
  const copyRing = progress(frame, copiaAt, 12) * (1 - progress(frame, copiaAt + 70, 24));

  // The right-hand stack
  const aShow = progress(frame, inventoryAt - 4, 14);
  const aOpen = progress(frame, inventoryAt, 16) * (1 - progress(frame, retentionAt - 8, 14));
  const bShow = progress(frame, retentionAt - 4, 14);
  const bOpen = progress(frame, retentionAt, 16) * (1 - progress(frame, subjectAt - 8, 14));
  const cShow = progress(frame, rtbfAt - 6, 14);
  const cOpen = progress(frame, rtbfAt, 16);
  const bracket = progress(frame, inventoryAt - 4, 22);

  const personIn = progress(frame, subjectAt - 4, 16);
  const drawerIn = progress(frame, drawerAt - 4, 16);
  const bar1 = progress(frame, oficinaAt, 18);
  const bar2 = progress(frame, mesesAt, 18);
  const barEnd = progress(frame, backupsAt, 12);

  const dataRight = LEFT_W + 4;
  const cy = DATA_Y + 92;

  return (
    <Stage>
      <div style={{ position: 'absolute', left: 0, top: 0, ...stampIn }}>
        <CaseStamp parts={STAMP_SHORT} size={26} height={46} />
      </div>

      {/* The person the data belongs to */}
      {personIn > 0.01 ? (
        <div style={{ position: 'absolute', left: 0, top: 62, width: LEFT_W, display: 'flex', alignItems: 'center', gap: 22, opacity: personIn, transform: `translateY(${(1 - personIn) * 12}px)` }}>
          <Person width={96} glow={0.6 * personIn} />
          <TermPill text="DATA SUBJECT" size={32} on={0.5 + 0.5 * personIn} />
        </div>
      ) : null}

      {/* The claimant's data */}
      <div style={{ position: 'absolute', left: 0, top: DATA_Y, ...enter(frame, threeAt - 6, { distance: 16 }) }}>
        <DataCard rows={rows} on={Math.max(0.2, dataIn)} glow={dataGlow} />
      </div>
      {personIn > 0.01 ? (
        <svg width={LEFT_W} height={200} style={{ position: 'absolute', left: 0, top: 150, overflow: 'visible' }}>
          <path d="M60 28 V104" stroke={alpha(C.sky, 0.7 * personIn)} strokeWidth={4} strokeDasharray="4 10" strokeLinecap="round" />
        </svg>
      ) : null}

      {/* Three places, with the arrows from the data */}
      <svg width={1728} height={660} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none' }}>
        {PLACE_Y.map((y, i) => {
          const p = progress(frame, placeAt[i] - 6, 16);
          if (p < 0.01) return null;
          const y1 = y + PLACE_H / 2;
          const x1 = dataRight + 8;
          const x2 = MID_X - 8;
          const d = `M${x1} ${cy} C${x1 + 40} ${cy} ${x2 - 40} ${y1} ${x2} ${y1}`;
          return (
            <g key={i}>
              <path d={d} stroke={alpha(C.cyan, 0.7)} strokeWidth={4} fill="none" strokeLinecap="round" strokeDasharray="600" strokeDashoffset={600 * (1 - p)} />
              <path d={`M${x2 - 14} ${y1 - 10} L${x2} ${y1} L${x2 - 14} ${y1 + 10}`} stroke={alpha(C.cyan, 0.8 * p)} strokeWidth={4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </g>
          );
        })}
        {/* The bracket that ties the three places to DATA INVENTORY */}
        {bracket > 0.01 ? (
          <g opacity={bracket * (1 - 0.6 * progress(frame, retentionAt, 14))}>
            <path d={`M${MID_X + PLACE_W + 14} ${PLACE_Y[0]} H${MID_X + PLACE_W + 34} V${PLACE_Y[2] + PLACE_H} H${MID_X + PLACE_W + 14}`} stroke={alpha(C.violet, 0.85)} strokeWidth={5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <path d={`M${MID_X + PLACE_W + 34} ${(PLACE_Y[0] + PLACE_Y[2] + PLACE_H) / 2} C${RIGHT_X - 30} ${(PLACE_Y[0] + PLACE_Y[2] + PLACE_H) / 2} ${RIGHT_X - 40} 30 ${RIGHT_X - 6} 30`} stroke={alpha(C.violet, 0.85)} strokeWidth={5} fill="none" strokeLinecap="round" />
          </g>
        ) : null}
      </svg>
      {PLACES.map((p, i) => (
        <div key={p.title} style={{ position: 'absolute', left: MID_X, top: PLACE_Y[i], opacity: placeIn[i], transform: `translateY(${(1 - placeIn[i]) * 14}px)` }}>
          <PlaceCard icon={p.icon} title={p.title} sub={'sub' in p ? p.sub : undefined} on={placeOn[i]} erase={erase[i]} ring={i === 1 ? copyRing : 0} />
        </div>
      ))}

      {/* The right-hand stack: inventory, retention, right to be forgotten */}
      <div style={{ position: 'absolute', left: RIGHT_X, top: 0, width: RIGHT_W, display: 'flex', flexDirection: 'column', gap: 18 }}>
        <StackBlock term="DATA INVENTORY" open={aOpen} show={aShow} detailH={84}>
          <div style={{ fontFamily: FONT.sans, fontSize: 34, fontWeight: 800, lineHeight: 1.2, color: C.textStrong }}>no proteges lo que no sabes que tienes</div>
        </StackBlock>
        <StackBlock term="RETENTION" open={bOpen} show={bShow} detailH={196}>
          <div style={{ position: 'relative', height: 44, width: RIGHT_W }}>
            <div style={{ position: 'absolute', left: 0, top: 0, width: 292 * bar1, height: 40, borderRadius: '20px 6px 6px 20px', background: alpha(C.cyan, 0.8) }} />
            <div style={{ position: 'absolute', left: 296, top: 0, width: 190 * bar2, height: 40, borderRadius: '6px 20px 20px 6px', background: alpha(C.sky, 0.55) }} />
            <div style={{ position: 'absolute', left: 496, top: -4, opacity: barEnd, transform: `scale(${0.7 + 0.3 * barEnd})` }}>
              <div style={{ width: 48, height: 48, borderRadius: 24, display: 'grid', placeItems: 'center', background: alpha(C.amber, 0.14), border: `3px solid ${alpha(C.amber, 0.85)}` }}>
                <Icon name="x" size={28} color={C.amber} strokeWidth={2.6} />
              </div>
            </div>
          </div>
          <div style={{ position: 'relative', height: 34, fontFamily: FONT.sans, fontSize: 26, fontWeight: 700, color: C.text, whiteSpace: 'nowrap' }}>
            <span style={{ position: 'absolute', left: 0, opacity: bar1 }}>el objeto en la oficina</span>
            <span style={{ position: 'absolute', left: 300, opacity: bar2 }}>unos meses más</span>
          </div>
          <div style={{ marginTop: 12, fontFamily: FONT.sans, fontSize: 32, fontWeight: 800, lineHeight: 1.2, color: C.textStrong }}>
            ni menos que la ley, <span style={{ color: C.cyanSoft }}>ni más que el para qué</span>
          </div>
        </StackBlock>
        <StackBlock term="RIGHT TO BE FORGOTTEN" open={cOpen} show={cShow} detailH={272}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, fontFamily: FONT.sans, fontSize: 30, fontWeight: 700, lineHeight: 1.2, color: C.textStrong }}>
            <Line icon="user" tone={C.cyan} on={progress(frame, rtbfAt + 6, 10)}>
              puede pedir que se borren sus datos
            </Line>
            <Line icon="lock" tone={C.amber} on={progress(frame, leyAt, 10)}>
              no es absoluto: una ley o un <span style={{ color: '#c4b5fd', fontWeight: 850, opacity: 0.55 + 0.45 * progress(frame, holdAt, 10) }}>legal hold</span> lo paran
            </Line>
            <Line icon="check" tone={C.emerald} on={progress(frame, tampocoAt + 14, 10)}>
              se borra lo demás y se le explica
            </Line>
          </div>
        </StackBlock>
      </div>

      {/* The filing cabinet at home */}
      {drawerIn > 0.01 ? (
        <div style={{ position: 'absolute', left: 0, top: 462, width: LEFT_W + 60, opacity: drawerIn, transform: `translateY(${(1 - drawerIn) * 14}px)` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
            <Drawer width={92} glow={0.4 * drawerIn} />
            <Caption size={32} color={C.textStrong} style={{ whiteSpace: 'normal', width: 320, opacity: 0.4 + 0.6 * progress(frame, recibosAt + 6, 12) }}>
              primero, saber qué hay dentro
            </Caption>
          </div>
          <div style={{ marginTop: 14 }}>
            <ImageTag size={26} />
          </div>
        </div>
      ) : null}
    </Stage>
  );
}

/** One line of the right-to-be-forgotten card: a round icon and its text; `on` 0–1 lights it. */
function Line({ icon, tone, on, children }: { icon: 'user' | 'lock' | 'check'; tone: string; on: number; children: ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, opacity: 0.3 + 0.7 * on }}>
      <div style={{ width: 44, height: 44, borderRadius: 22, display: 'grid', placeItems: 'center', flexShrink: 0, background: alpha(tone, 0.14), border: `3px solid ${alpha(tone, 0.4 + 0.5 * on)}` }}>
        <Icon name={icon} size={26} color={tone} strokeWidth={2.2} />
      </div>
      <div style={{ paddingTop: 2 }}>{children}</div>
    </div>
  );
}


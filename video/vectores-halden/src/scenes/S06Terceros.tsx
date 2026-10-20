import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { Icon, mix } from '../../../engine/src/ui';
import { ENTRIES, UPDATES } from '../data/map';
import { IF, MAKER, NOT_INSIDER, NO_CLICK, SIGNED, SUPPLY, THIRD_PARTIES } from '../data/s06-terceros';
import { Cloakroom } from './parts/Cloakroom';
import { EntryMap, MAP, MAP_BOX } from './parts/EntryMap';
import { CaseTag, ExamChip, ImageTag, Pill, StrikeTag, TermPill } from './parts/Labels';
import { FACTORY, FACTORY_DOOR, Factory, UpdatePackage } from './parts/s06-terceros/Factory';
import { Stage, wordFrame } from './kit';

const S = 's06-terceros';

// ---- Phase A: the map on the left, the maker on the right.
const MS = 0.6;
const MX = 0;
const MY = 60;
/** The updates box's right edge in stage coordinates (where the maker's line arrives). */
const UPD = { x: MX + (MAP_BOX[UPDATES].x + 470) * MS, y: MY + (MAP_BOX[UPDATES].y + 36) * MS };
const AREA = { x: 1090, y: 70, w: 630, h: 370 } as const;
const FAC_W = 300;
const FAC = { x: AREA.x + 230, y: AREA.y + 40 } as const;
const FK = FAC_W / FACTORY.w;
const DOOR = { x: FAC.x + FACTORY_DOOR.x * FK, y: FAC.y + FACTORY_DOOR.y * FK };
const PKG = 76;
// ---- Phase B: the term, the three third parties, the two crossings-out.
const CARD_W = 548;
const CARD_GAP = (1728 - 3 * CARD_W) / 2;
const CARDS_TOP = 136;
const CARD_H = 170;
// ---- Phase C: the cloakroom.
const CLOAK_W = 860;

/**
 * s06-terceros «Lo que llega firmado». «Caso de ejemplo · sin fecha». The map comes back small on the left with its last
 * line lit (the visitors' program's updates) and the rest stepped back; on `maker` the maker's building (no name) joins
 * that line from the right: «las manda su fabricante · nadie de recepción hace nada». On `if` the maker's side is framed
 * dashed amber, «si pasara · no ha pasado», and a dashed rose silhouette slips in; on `signed` a dashed package leaves
 * the maker with a green seal and runs along the usual line — «llegaría firmada, por el camino de siempre» — nothing
 * says it ever happened. On `three` the map gives way to «Supply chain · un tercero de confianza con acceso» and the
 * three third parties with their chips (MSP · vendor · supplier); on `not-insider` «insider» is struck through, «no es
 * insider: es un actor, no un camino»; on `no-click` the click cursor too, «aquí nadie hace clic». On `cloakroom` the
 * station's cloakroom takes the stage («imagen · no es del puerto»): yours outlined in cyan from the start; the pickpocket
 * fools the attendant on «engañar» and takes every backpack — yours too — on «lleva».
 */
export function S06Terceros(props: SceneProps) {
  const frame = useCurrentFrame();
  const lastAt = props.cue('last-line');
  const makerAt = props.cue('maker');
  const ifAt = props.cue('if');
  const signedAt = props.cue('signed');
  const threeAt = props.cue('three');
  const insiderAt = props.cue('not-insider');
  const clickAt = props.cue('no-click');
  const cloakAt = props.cue('cloakroom');
  const supplyWord = wordFrame(S, 's06-03', 'supply') - 6;
  const foolAt = wordFrame(S, 's06-05', 'engañar') - 6;
  const takeAt = wordFrame(S, 's06-05', 'lleva') - 6;

  // ---- phase A
  const aOut = progress(frame, threeAt - 12, 16, EASE.inOut);
  const lit = ENTRIES.map((_, i) => (i === UPDATES ? progress(frame, lastAt, 14) : 0));
  const dim = ENTRIES.map((_, i) => (i === UPDATES ? 0 : progress(frame, lastAt, 14)));
  const makerIn = progress(frame, makerAt - 4, 16);
  const makerLine = progress(frame, makerAt + 2, 18);
  const makerNote = progress(frame, wordFrame(S, 's06-01', 'recepción') - 6, 12);
  const ifIn = progress(frame, ifAt - 2, 14);
  const ghost = progress(frame, ifAt + 10, 24);
  const pkgOut = progress(frame, signedAt - 6, 50, EASE.inOut);
  const seal = progress(frame, wordFrame(S, 's06-02', 'firmada') - 4, 10);
  const pkgOn = progress(frame, ifAt + 40, 12);
  const signedNote = progress(frame, signedAt + 4, 12);
  const px = mix(DOOR.x - PKG / 2, UPD.x - PKG / 2 + 10, pkgOut);
  const py = mix(DOOR.y - PKG, UPD.y - PKG / 2, pkgOut) - Math.sin(Math.PI * pkgOut) * 50;

  // ---- phase B
  const bOut = progress(frame, cloakAt - 10, 16, EASE.inOut);
  const termIn = progress(frame, Math.min(threeAt + 30, supplyWord), 14);
  const cardIn = THIRD_PARTIES.map((_, i) => progress(frame, threeAt + 4 + i * 10, 14));
  const insIn = progress(frame, insiderAt - 2, 12);
  const insStrike = progress(frame, insiderAt + 10, 14);
  const clickIn = progress(frame, clickAt - 4, 12);
  const clickStrike = progress(frame, clickAt + 8, 12);

  // ---- phase C
  const cloakIn = progress(frame, cloakAt - 4, 18);

  return (
    <Stage>
      <div style={{ position: 'absolute', inset: 0, fontFamily: FONT.sans }}>
        <div style={{ position: 'absolute', left: 0, top: 0, opacity: 1 - aOut }}>
          <div style={enter(frame, -6, { distance: 12, duration: 14 })}>
            <CaseTag />
          </div>
        </div>

        {/* ---------- phase A: the map and the maker ---------- */}
        {aOut < 0.99 ? (
          <div style={{ position: 'absolute', inset: 0, opacity: 1 - aOut }}>
            <div style={{ position: 'absolute', left: MX, top: MY, transform: `scale(${MS})`, transformOrigin: '0 0' }}>
              <EntryMap frame={frame} line={[1, 1, 1, 1, 1]} label={[1, 1, 1, 1, 1]} chip={[1, 1, 1, 1, 1]} lit={lit} dim={dim} />
            </div>
            {makerNote > 0.01 ? (
              <div style={{ position: 'absolute', left: MX, top: MY + MAP.h * MS + 26, width: MAP.w * MS, display: 'flex', justifyContent: 'center', ...enter(frame, wordFrame(S, 's06-01', 'recepción') - 6, { distance: 10, duration: 12 }) }}>
                <Pill text={MAKER} icon="layers" tone={C.cyan} size={32} height={56} on={makerNote * (1 - 0.6 * ifIn)} />
              </div>
            ) : null}

            {/* the maker, and its line into the updates box */}
            <svg width={1728} height={660} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
              {makerLine > 0.01 ? (
                <line x1={UPD.x + 4} y1={UPD.y} x2={mix(UPD.x + 4, DOOR.x, makerLine)} y2={mix(UPD.y, DOOR.y - 10, makerLine)} stroke={C.cyan} strokeWidth={5} strokeLinecap="round" />
              ) : null}
            </svg>
            {makerIn > 0.01 ? (
              <div style={{ position: 'absolute', left: FAC.x, top: FAC.y, opacity: makerIn, transform: `translateX(${(1 - makerIn) * 24}px)` }}>
                <Factory width={FAC_W} lit={makerIn * (1 - 0.4 * ifIn)} ghost={ghost} />
              </div>
            ) : null}

            {/* «si pasara · no ha pasado»: the maker's side, framed dashed */}
            {ifIn > 0.01 ? (
              <>
                <div
                  style={{
                    position: 'absolute',
                    left: AREA.x,
                    top: AREA.y,
                    width: AREA.w,
                    height: AREA.h,
                    boxSizing: 'border-box',
                    borderRadius: RADIUS.lg,
                    border: `3px dashed ${alpha(C.amber, 0.8)}`,
                    background: alpha(C.amber, 0.04),
                    opacity: ifIn,
                  }}
                />
                <div style={{ position: 'absolute', left: AREA.x + 24, top: AREA.y - 24, opacity: ifIn }}>
                  <Pill text={IF} icon="alert" tone={C.amber} size={32} height={50} on={0.8} style={{ background: C.ink900 }} />
                </div>
              </>
            ) : null}
            {pkgOn > 0.01 ? (
              <div style={{ position: 'absolute', left: px, top: py, opacity: pkgOn * (1 - 0.3 * progress(frame, signedAt + 60, 20)) }}>
                <UpdatePackage size={PKG} signed={seal} />
              </div>
            ) : null}
            {signedNote > 0.01 ? (
              <div style={{ position: 'absolute', left: AREA.x, top: AREA.y + AREA.h - 76, width: AREA.w, display: 'flex', justifyContent: 'center', ...enter(frame, signedAt + 4, { distance: 10, duration: 12 }) }}>
                <Pill text={SIGNED} icon="check" tone={C.emerald} size={32} height={54} on={signedNote} />
              </div>
            ) : null}
          </div>
        ) : null}

        {/* ---------- phase B: supply chain, its three third parties, the two crossings-out ---------- */}
        {frame >= threeAt - 6 && bOut < 0.99 ? (
          <div style={{ position: 'absolute', inset: 0, opacity: 1 - bOut }}>
            <div style={{ position: 'absolute', left: 0, top: 30, width: 1728, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 22, opacity: termIn, transform: `translateY(${(1 - termIn) * 12}px)` }}>
              <TermPill text={SUPPLY.term} size={42} on={termIn} />
              <span style={{ fontSize: 38, fontWeight: 800, color: C.cyanSoft, whiteSpace: 'nowrap' }}>{SUPPLY.plain}</span>
            </div>
            {THIRD_PARTIES.map((t, i) => (
              <div
                key={t.chip}
                style={{
                  position: 'absolute',
                  left: i * (CARD_W + CARD_GAP),
                  top: CARDS_TOP,
                  width: CARD_W,
                  height: CARD_H,
                  boxSizing: 'border-box',
                  padding: '20px 26px',
                  borderRadius: RADIUS.lg,
                  border: `3px solid ${alpha(C.sky, 0.55)}`,
                  background: alpha(C.ink850, 0.95),
                  opacity: cardIn[i] * (1 - 0.35 * insIn),
                  transform: `translateY(${(1 - cardIn[i]) * 16}px)`,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <Icon name={t.icon} size={44} color={C.sky} />
                  <ExamChip text={t.chip} size={34} />
                </div>
                <div style={{ marginTop: 16 }}>
                  {t.sub.map((l) => (
                    <div key={l} style={{ fontSize: 34, fontWeight: 700, lineHeight: 1.2, color: C.textStrong, whiteSpace: 'nowrap' }}>
                      {l}
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {insIn > 0.01 ? (
              <div style={{ position: 'absolute', left: 0, top: 404, width: 1728, display: 'flex', justifyContent: 'center', transform: `translateY(${(1 - insIn) * 12}px)` }}>
                <StrikeTag word={NOT_INSIDER.word} text={NOT_INSIDER.text} show={insIn} strike={insStrike} size={36} />
              </div>
            ) : null}
            {clickIn > 0.01 ? (
              <div style={{ position: 'absolute', left: 0, top: 510, width: 1728, display: 'flex', justifyContent: 'center', transform: `translateY(${(1 - clickIn) * 12}px)` }}>
                <StrikeTag icon="cursor" text={NO_CLICK.text} show={clickIn} strike={clickStrike} size={36} />
              </div>
            ) : null}
          </div>
        ) : null}

        {/* ---------- phase C: the station's cloakroom ---------- */}
        {cloakIn > 0.01 ? (
          <div style={{ position: 'absolute', left: (1728 - CLOAK_W) / 2, top: 52, opacity: cloakIn, transform: `scale(${0.96 + 0.04 * cloakIn})`, transformOrigin: '50% 0' }}>
            <Cloakroom width={CLOAK_W} fooled={progress(frame, foolAt, 16)} taken={progress(frame, takeAt, 60, EASE.inOut)} yours={progress(frame, cloakAt + 14, 14)} />
            <div style={{ marginTop: 14, display: 'flex', justifyContent: 'center' }}>
              <ImageTag />
            </div>
          </div>
        ) : null}
      </div>
    </Stage>
  );
}

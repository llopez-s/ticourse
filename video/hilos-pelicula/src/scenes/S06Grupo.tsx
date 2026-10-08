import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { mix, windowWeight } from '../../../engine/src/ui';
import { ANSWER, APT_NOTE } from '../data/s06-grupo';
import { BUILD_STEPS, BuildOrder, buildOrderLayout } from './parts/BuildOrder';
import { CompareTable, TABLE_AT_REST } from './parts/CompareTable';
import { GROUP_RECT, GroupedFilms } from './parts/s06-grupo/GroupedFilms';
import { Stage, wordFrame } from './kit';

const S = 's06-grupo';
const W = 1728;

/** While the group is alone on the stage it sits centred; with the build order above it, it drops to GROUP_RECT. */
const GROUP_Y_ALONE = Math.round((660 - GROUP_RECT.h) / 2);
const BUILD = { size: 34, gap: 66, y: 30 } as const;
const BUILD_W = buildOrderLayout(BUILD_STEPS, BUILD.size, BUILD.gap).width;
const NOTE_Y = 136;

/**
 * s06-grupo «Mismo taller, mismo grupo». Opens (after the chapter wipe) on s05's whole table, where s05 left it
 * (TABLE_AT_REST). `answer`: «Sí, los agrupas» over it; the PDB row lights on «ruta», the domain row on «dominio»
 * (grey, it stays grey). `verdict`: the table becomes its summary — «fuerte: la ruta del PDB», «medio: proveedor»,
 * everything else grey — each row lit as it is named. `frame`: the table goes; the two films slide in side by side
 * (Meridian's whole, Orbital's partial) and the group frame draws round them on «marco». `group`: the link joins them
 * on «unes», its two marks on «enlaces», ACTIVITY GROUP on «activity» and the «candidato» pill after it (lit again on
 * «candidato», s06-04). `build-order`: the group drops to GROUP_RECT and the complete build order comes in above it,
 * one pill per spoken step. `apt`: the note «lo que fuera se llama “APT-X” o intrusion set», each name lit on the
 * voice. Last frame = s07's first: the group at GROUP_RECT (s07 hangs its blank tag on it).
 */
export function S06Grupo(props: SceneProps) {
  const frame = useCurrentFrame();
  const answerAt = props.cue('answer');
  const verdictAt = props.cue('verdict');
  const frameAt = props.cue('frame');
  const groupAt = props.cue('group');
  const buildAt = props.cue('build-order');
  const aptAt = props.cue('apt');

  const w = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);
  const rutaAt = w('s06-01', 'ruta');
  const dominioAt = w('s06-01', 'dominio');
  const marcasAt = w('s06-02', 'marcas');
  const fuerteAt = w('s06-02', 'fuerte');
  const proveedorAt = w('s06-02', 'proveedor');
  const restoAt = w('s06-02', 'resto');
  const peliculasAt = w('s06-03', 'películas');
  const marcoAt = w('s06-03', 'marco');
  const unesAt = w('s06-03', 'unes');
  const enlacesAt = w('s06-03', 'enlaces');
  const activityAt = w('s06-03', 'activity');
  const candidatoAt = w('s06-04', 'candidato');
  const steps = [w('s06-05', 'eventos'), w('s06-05', 'hilo'), w('s06-05', 'comparas'), w('s06-05', 'grupo')];
  const aptWordAt = w('s06-06', 'APT');
  const setAt = w('s06-06', 'intrusion');

  // ---- Phase 1: s05's table, the answer, the summary -------------------------------------------------------------
  const tableOut = progress(frame, frameAt + 2, 20, EASE.inOut);
  const answer = enter(frame, answerAt + 2, { distance: 16 });
  const answerOut = 1 - progress(frame, frameAt, 14);
  const focusPdb = Math.max(windowWeight(frame, rutaAt, dominioAt), windowWeight(frame, fuerteAt, proveedorAt));
  const focusDomain = windowWeight(frame, dominioAt, verdictAt);
  const focusSupplier = windowWeight(frame, proveedorAt, restoAt);
  const summary = progress(frame, marcasAt - 6, 30, EASE.inOut);

  // ---- Phase 2–3: the films, the frame, the link, the name ---------------------------------------------------------
  const films = progress(frame, peliculasAt - 6, 26);
  const draw = progress(frame, marcoAt - 22, 40, EASE.inOut);
  const link = progress(frame, Math.max(groupAt, unesAt - 6), 24);
  const marks = progress(frame, enlacesAt - 2, 16);
  const name = progress(frame, activityAt - 6, 18);
  const candidate = progress(frame, activityAt + 16, 16);
  const candidateFocus = windowWeight(frame, candidatoAt - 4, buildAt, { ramp: 12 });

  // ---- Phase 4–5: the group drops, the build order and the note come in above it --------------------------------
  const drop = progress(frame, buildAt - 2, 24, EASE.inOut);
  const groupY = mix(GROUP_Y_ALONE, GROUP_RECT.y, drop);
  const buildShow = [progress(frame, buildAt + 6, 16), ...steps.slice(1).map((at) => progress(frame, at - 4, 16))];
  const buildLit = steps.map((at) => progress(frame, at - 2, 14));
  const groupHot = windowWeight(frame, steps[3] - 2, aptAt, { ramp: 12 });
  const note = enter(frame, aptAt + 6, { distance: 14 });
  const aptHot = progress(frame, aptWordAt - 4, 12);
  const setHot = progress(frame, setAt - 4, 12);

  return (
    <Stage>
      {/* Phase 1: the table, as s05 left it */}
      {tableOut < 1 ? (
        <div
          style={{
            position: 'absolute',
            left: TABLE_AT_REST.x,
            top: TABLE_AT_REST.y,
            opacity: 1 - tableOut,
            transform: `translateY(${tableOut * 24}px) scale(${1 - 0.03 * tableOut})`,
            transformOrigin: 'center top',
          }}
        >
          <CompareTable width={TABLE_AT_REST.width} summary={summary} focus={{ pdb: focusPdb, domain: focusDomain, supplier: focusSupplier }} />
        </div>
      ) : null}

      {/* «Sí, los agrupas» */}
      {answer.opacity > 0.01 && answerOut > 0.01 ? (
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 46,
            width: W,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'baseline',
            gap: 22,
            fontFamily: FONT.sans,
            fontWeight: 850,
            letterSpacing: -1.5,
            whiteSpace: 'nowrap',
            opacity: answer.opacity * answerOut,
            transform: answer.transform,
          }}
        >
          <span style={{ fontSize: 84, color: C.cyan, textShadow: `0 0 30px ${alpha(C.cyan, 0.35)}` }}>{ANSWER.yes}</span>
          <span style={{ fontSize: 62, color: C.textStrong }}>{ANSWER.rest}</span>
        </div>
      ) : null}

      {/* Phase 2–5: the group */}
      {films > 0.001 || draw > 0.001 ? (
        <div style={{ position: 'absolute', left: GROUP_RECT.x, top: groupY }}>
          <GroupedFilms
            width={GROUP_RECT.w}
            height={GROUP_RECT.h}
            films={films}
            draw={draw}
            link={link}
            marks={marks}
            name={name}
            candidate={candidate}
            candidateFocus={candidateFocus}
            glow={groupHot * 0.8}
          />
        </div>
      ) : null}

      {/* The build order, complete (s2m4q8) */}
      {buildShow[0] > 0.001 ? (
        <div style={{ position: 'absolute', left: (W - BUILD_W) / 2, top: BUILD.y }}>
          <BuildOrder size={BUILD.size} gap={BUILD.gap} steps={BUILD_STEPS.map((label, i) => ({ label, show: buildShow[i], lit: buildLit[i] }))} />
        </div>
      ) : null}

      {/* «lo que fuera se llama “APT-X” o intrusion set» */}
      {note.opacity > 0.01 ? (
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: NOTE_Y,
            width: W,
            textAlign: 'center',
            fontFamily: FONT.sans,
            fontSize: 42,
            fontWeight: 650,
            color: C.text,
            whiteSpace: 'nowrap',
            ...note,
          }}
        >
          {APT_NOTE.lead}
          <Hot on={aptHot}>{APT_NOTE.apt}</Hot>
          {APT_NOTE.mid}
          <Hot on={setHot}>{APT_NOTE.set}</Hot>
        </div>
      ) : null}
    </Stage>
  );
}

/** A name in the note that lifts (violet, the exam's colour) when the voice says it. */
function Hot({ on, children }: { on: number; children: string }) {
  return (
    <span
      style={{
        fontWeight: on > 0.5 ? 800 : 700,
        color: on > 0.05 ? '#c4b5fd' : C.textStrong,
        textShadow: on > 0.05 ? `0 0 ${Math.round(18 * on)}px ${alpha(C.violet, 0.45 * on)}` : undefined,
      }}
    >
      {children}
    </span>
  );
}

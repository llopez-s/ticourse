import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import QuizEngine from '../components/QuizEngine';
import { PageTitle, Panel } from '../components/Bits';
import { useSyncTrack, useTrack } from '../components/Layout';
import { modulesOf, placementBlockById, placementBlocks, sectionById } from '../data/course';
import { useStore } from '../lib/store';
import { PLACEMENT_PASS_PCT, isDone, sectionExempt, sectionExemptScore } from '../lib/placement';
import type { PlacementBlock } from '../lib/types';

const CARD =
  'flex flex-wrap items-center gap-3 rounded-xl border border-ink-700 bg-ink-900 px-4 py-3 transition-colors hover:border-ink-500 hover:bg-ink-850';
const CTA =
  'rounded-lg border border-ink-600 px-3 py-1.5 text-xs font-semibold text-slate-300';

function BlockCard({ block }: { block: PlacementBlock }) {
  // Derived OUTSIDE the selectors on purpose — see the note in ProfilePage:
  // a selector that builds a new array or object returns a fresh reference on
  // every call and makes zustand v5's snapshot look perpetually changed.
  const placement = useStore((s) => s.placement);
  const lessons = useStore((s) => s.lessons);
  const exempt = useStore((s) => s.exempt);
  const grantExemption = useStore((s) => s.grantExemption);

  const ids = useMemo(
    () => modulesOf(block.sectionId).map((m) => m.id),
    [block.sectionId],
  );
  const attempts = placement.filter((p) => p.blockId === block.id);
  const last = attempts.length ? attempts[attempts.length - 1] : null;
  // A pass stays spendable even if a later retake went worse, so the offer to
  // convalidate is driven by the best pass on record, not by the last attempt.
  const bestPass = attempts.reduce<number | null>(
    (acc, p) => (p.passed && (acc === null || p.pct > acc) ? p.pct : acc),
    null,
  );
  const isExempt = sectionExempt({ exempt }, ids);
  const score = sectionExemptScore({ exempt }, ids);
  const nothingToExempt = ids.every((id) => isDone({ lessons, exempt }, id));

  const info = (
    <>
      <div className="min-w-0 flex-1">
        <div className="text-sm font-semibold text-slate-100">{block.title}</div>
        <div className="text-xs text-slate-500">{block.blurb}</div>
      </div>
    </>
  );

  // The only state that acts instead of navigating: a pass already earned and
  // theory still left to skip. Everything else opens (or re-opens) the block.
  if (!isExempt && bestPass !== null && !nothingToExempt) {
    return (
      <div className={CARD}>
        {info}
        <span className="text-xs font-bold text-emerald-300">
          Superado · {bestPass}%
        </span>
        {/* This is the one card that acts rather than navigates, so it also
            needs the way back in: someone who passed at 83% and held off on
            convalidating can still retake the block for a better score. */}
        <Link to={`/placement/${block.id}`} className={`${CTA} hover:border-ink-400 hover:text-slate-100`}>
          Repetir bloque
        </Link>
        <button
          onClick={() => grantExemption(block.id)}
          className="rounded-lg bg-cyan-500 px-3 py-1.5 text-xs font-bold text-ink-950 hover:bg-cyan-400"
        >
          ⏩ Convalidar sección
        </button>
      </div>
    );
  }

  const state = isExempt
    ? {
        label: `Convalidada · ${score}%`,
        tone: 'text-cyan-300',
        cta: 'Repetir bloque',
      }
    : bestPass !== null
      ? {
          label: `Superado · ${bestPass}%`,
          tone: 'text-emerald-300',
          cta: 'Repetir bloque',
        }
      : last
        ? {
            label: `No superado · ${last.pct}%`,
            tone: 'text-amber-300',
            cta: 'Reintentar',
          }
        : { label: 'Sin hacer', tone: 'text-slate-500', cta: 'Empezar' };

  return (
    <Link to={`/placement/${block.id}`} className={CARD}>
      {info}
      <span className={`text-xs font-bold ${state.tone}`}>{state.label}</span>
      <span className={CTA}>{state.cta}</span>
    </Link>
  );
}

function BlockList() {
  const track = useTrack();
  const blocks = placementBlocks(track.id);

  return (
    <div>
      <PageTitle
        kicker="Prueba de nivel"
        title="🎯 ¿Qué te puedes saltar?"
        sub="Un bloque por dominio. Supéralo y convalidas la teoría de esa sección."
      />
      <Panel className="mb-5 text-sm leading-relaxed text-slate-300">
        Cada bloque son 12 preguntas sin apuesta de confianza y sin XP por acierto: esto
        mide, no puntúa. A partir del {PLACEMENT_PASS_PCT}% puedes convalidar las lecciones
        de esa sección — los labs y el boss siguen esperándote.
      </Panel>
      {blocks.length === 0 ? (
        <Panel>
          <div className="text-sm font-bold text-slate-100">🚧 Todavía no hay prueba de nivel para este track</div>
          <p className="mt-1 text-xs text-slate-400">
            Cambia de track o sigue con el temario; llegará en una próxima actualización.
          </p>
        </Panel>
      ) : (
        <div className="space-y-2">
          {blocks.map((b) => (
            <BlockCard key={b.id} block={b} />
          ))}
        </div>
      )}
    </div>
  );
}

function BlockRun({ block }: { block: PlacementBlock }) {
  const navigate = useNavigate();
  const finishPlacement = useStore((s) => s.finishPlacement);
  const grantExemption = useStore((s) => s.grantExemption);
  const lessons = useStore((s) => s.lessons);
  const exempt = useStore((s) => s.exempt);
  const [attempt, setAttempt] = useState(0);
  const [granted, setGranted] = useState(false);
  // A deep link into another track's block switches the active track, exactly
  // as SectionPage and ModulePage do — otherwise the chrome lies about where
  // the learner is.
  useSyncTrack(block.sectionId);

  const section = sectionById(block.sectionId);
  const ids = modulesOf(block.sectionId).map((m) => m.id);
  const nothingToExempt = ids.every((id) => isDone({ lessons, exempt }, id));
  const alreadyExempt = sectionExempt({ exempt }, ids);

  return (
    <div>
      <PageTitle
        kicker="Prueba de nivel"
        title={block.title}
        sub={`${block.questions.length} preguntas · sin tiempo límite · ≥${PLACEMENT_PASS_PCT}% para convalidar`}
      />
      <QuizEngine
        key={attempt}
        questions={block.questions}
        mode="placement"
        onFinish={(r) => finishPlacement(block.id, r.correct, r.total)}
        onRetry={() => {
          setAttempt((n) => n + 1);
          setGranted(false);
        }}
        resultExtra={(r) => {
          if (!r.pct || r.pct < PLACEMENT_PASS_PCT) {
            return (
              <Panel className="mb-4 text-sm text-slate-300">
                Por debajo del {PLACEMENT_PASS_PCT}%. Estudia la sección con calma: la
                revisión de abajo te dice exactamente dónde están los huecos.
              </Panel>
            );
          }
          if (granted || alreadyExempt) {
            return (
              <Panel className="mb-4 text-sm text-cyan-200">
                ✅ {section?.title} convalidada. Puedes anularlo cuando quieras desde la
                sección o desde tu perfil.
              </Panel>
            );
          }
          if (nothingToExempt) {
            return (
              <Panel className="mb-4 text-sm text-slate-300">
                Ya has estudiado esta sección entera, así que no hay nada que convalidar.
                Buen resultado igualmente.
              </Panel>
            );
          }
          return (
            <Panel className="mb-4">
              <div className="text-sm text-slate-200">
                Puedes dar por vista la teoría de {section?.title}. Los labs y el boss no se
                tocan.
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    grantExemption(block.id);
                    setGranted(true);
                  }}
                  className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-bold text-ink-950 hover:bg-cyan-400"
                >
                  ⏩ Convalidar {section?.short ?? 'la sección'}
                </button>
                <button
                  onClick={() => navigate('/placement')}
                  className="rounded-lg border border-ink-600 px-4 py-2 text-sm font-semibold text-slate-300 hover:bg-ink-800"
                >
                  Prefiero estudiarla igualmente
                </button>
              </div>
            </Panel>
          );
        }}
      />
    </div>
  );
}

export default function PlacementPage() {
  const { blockId } = useParams();
  const block = blockId ? placementBlockById(blockId) : undefined;
  if (blockId && !block) {
    return <p className="text-slate-400">Bloque de nivel no encontrado.</p>;
  }
  return block ? <BlockRun block={block} /> : <BlockList />;
}

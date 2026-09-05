import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import QuizEngine from '../components/QuizEngine';
import { PageTitle, Panel } from '../components/Bits';
import { useTrack } from '../components/Layout';
import { modulesOf, placementBlockById, placementBlocks, sectionById } from '../data/course';
import { useStore } from '../lib/store';
import { PLACEMENT_PASS_PCT, sectionExempt, sectionExemptScore } from '../lib/placement';
import type { PlacementBlock } from '../lib/types';

/** Latest attempt at a block, or null. */
function useLastAttempt(blockId: string) {
  return useStore((s) => {
    const hits = s.placement.filter((p) => p.blockId === blockId);
    return hits.length ? hits[hits.length - 1] : null;
  });
}

function BlockCard({ block }: { block: PlacementBlock }) {
  const last = useLastAttempt(block.id);
  const exempt = useStore((s) => sectionExempt(s, modulesOf(block.sectionId).map((m) => m.id)));
  const score = useStore((s) => sectionExemptScore(s, modulesOf(block.sectionId).map((m) => m.id)));

  const state = exempt
    ? { label: `Convalidada · ${score}%`, tone: 'text-cyan-300', cta: 'Ver detalle' }
    : last?.passed
      ? { label: `Superado · ${last.pct}%`, tone: 'text-emerald-300', cta: 'Convalidar sección' }
      : last
        ? { label: `No superado · ${last.pct}%`, tone: 'text-amber-300', cta: 'Reintentar' }
        : { label: 'Sin hacer', tone: 'text-slate-500', cta: 'Empezar' };

  return (
    <Link
      to={`/placement/${block.id}`}
      className="flex flex-wrap items-center gap-3 rounded-xl border border-ink-700 bg-ink-900 px-4 py-3 transition-colors hover:border-ink-500 hover:bg-ink-850"
    >
      <div className="min-w-0 flex-1">
        <div className="text-sm font-semibold text-slate-100">{block.title}</div>
        <div className="text-xs text-slate-500">{block.blurb}</div>
      </div>
      <span className={`text-xs font-bold ${state.tone}`}>{state.label}</span>
      <span className="rounded-lg border border-ink-600 px-3 py-1.5 text-xs font-semibold text-slate-300">
        {state.cta}
      </span>
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
  const [attempt, setAttempt] = useState(0);
  const [granted, setGranted] = useState(false);

  const section = sectionById(block.sectionId);
  const ids = modulesOf(block.sectionId).map((m) => m.id);
  const nothingToExempt = ids.every((id) => lessons[id]);

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
        onRetry={() => setAttempt((n) => n + 1)}
        resultExtra={(r) => {
          if (!r.pct || r.pct < PLACEMENT_PASS_PCT) {
            return (
              <Panel className="mb-4 text-sm text-slate-300">
                Por debajo del {PLACEMENT_PASS_PCT}%. Estudia la sección con calma: la
                revisión de abajo te dice exactamente dónde están los huecos.
              </Panel>
            );
          }
          if (granted) {
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

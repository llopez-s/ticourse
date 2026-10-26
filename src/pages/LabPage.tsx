import { lazy, Suspense } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import {
  CLASSIFY_DATA,
  LABS,
  ORDER_DATA,
  SELECT_DATA,
} from '../data/labs';
import { moduleById, sectionById, trackOf } from '../data/course';
import { TRACKS } from '../data/tracks';
import { useStore } from '../lib/store';
import { useSyncTrack } from '../components/Layout';
import ClassifyLab from '../components/labs/ClassifyLab';
import SelectLab from '../components/labs/SelectLab';
import OrderLab from '../components/labs/OrderLab';
import PivotLab from '../components/labs/PivotLab';
import YaraLab from '../components/labs/YaraLab';
import AchLab from '../components/labs/AchLab';
import CalibrationLab from '../components/labs/CalibrationLab';
import ReportLab from '../components/labs/ReportLab';
import { labButton, LabResultSummary, LabWorkbookBar, LabWorkspaceProvider } from '../components/labs/LabWorkspace';

const LabChallengePanel = lazy(() => import('../components/labs/LabChallengePanel'));

export default function LabPage() {
  const { labId } = useParams();
  const [search, setSearch] = useSearchParams();
  const meta = LABS.find((l) => l.id === labId);
  const completed = useStore((s) => !!s.labs[labId ?? '']);
  const completeLab = useStore((s) => s.completeLab);
  useSyncTrack(meta?.sectionId);

  if (!meta) return <p className="text-slate-400">Lab no encontrado.</p>;

  const section = sectionById(meta.sectionId);
  const campaign = TRACKS[trackOf(meta.sectionId)].campaign;
  const onComplete = () => completeLab(meta.id, meta.xp);
  const challenge = search.get('mode') === 'challenge' && !!meta.challengeId;
  const reviewLinks = (meta.prerequisites ?? []).flatMap((id) => {
    const module = moduleById(id);
    return module ? [{ id, title: module.title }] : [];
  });

  const body = (() => {
    switch (meta.kind) {
      case 'classify':
        return (
          <ClassifyLab data={CLASSIFY_DATA[meta.id]} onComplete={onComplete} />
        );
      case 'select':
        return <SelectLab data={SELECT_DATA[meta.id]} onComplete={onComplete} />;
      case 'order':
        return <OrderLab data={ORDER_DATA[meta.id]} onComplete={onComplete} />;
      case 'pivot':
        return <PivotLab onComplete={onComplete} />;
      case 'yara':
        return <YaraLab onComplete={onComplete} />;
      case 'ach':
        return <AchLab onComplete={onComplete} />;
      case 'calibration':
        return <CalibrationLab onComplete={onComplete} />;
      case 'report':
        return <ReportLab onComplete={onComplete} />;
    }
  })();

  return (
    <div>
      <div className="mb-6">
        <Link
          to={`/section/${meta.sectionId}`}
          className="font-mono text-xs uppercase tracking-[0.2em] text-cyan-400 hover:text-cyan-300"
        >
          ← S{section?.num} · {section?.short}
        </Link>
        <h1 className="mt-1 text-2xl font-bold text-slate-50">
          {meta.icon} {meta.title}
        </h1>
        <div className="mt-1 text-xs text-slate-500">
          🧪 Práctica guiada · {meta.minutes} min · +{meta.xp} XP
          {completed && (
            <span className="ml-2 font-semibold text-emerald-400">
              ✓ ya completado (puedes repetirlo por práctica)
            </span>
          )}
        </div>
      </div>

      {meta.mission && (
        <div className="mb-5 rounded-xl border border-emerald-500/40 bg-emerald-950/20 p-4">
          <div className="mb-1 font-mono text-[10px] uppercase tracking-[0.25em] text-emerald-400">
            🎖️ {campaign.title} — Misión {meta.mission.n}/5
          </div>
          <p className="text-sm leading-relaxed text-slate-300">
            {meta.mission.briefing}
          </p>
        </div>
      )}

      <p className="mb-5 text-sm leading-relaxed text-slate-400">{meta.brief}</p>

      <section aria-label="Objetivos y preparación" className="mb-6 grid gap-5 rounded-xl border border-ink-700 bg-ink-900 p-5 md:grid-cols-2">
        <div><h2 className="text-sm font-semibold text-slate-100">Qué vas a practicar</h2>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm leading-relaxed text-slate-300">{meta.objectives?.map((objective) => <li key={objective}>{objective}</li>)}</ul>
          <p className="mt-3 text-xs leading-relaxed text-cyan-200"><strong>Para terminar la práctica guiada:</strong> {meta.outcome}</p>
        </div>
        <div><h2 className="text-sm font-semibold text-slate-100">Antes de empezar</h2>
          <ul className="mt-2 space-y-2 text-sm">{reviewLinks.map((link) => <li key={link.id}><Link className="text-cyan-300 underline underline-offset-4" to={`/learn/${link.id}`}>{link.title}</Link></li>)}</ul>
          {meta.id === 'lab3b' && <Link className="mt-3 inline-block text-sm text-cyan-300 underline" to="/learn/s3m5">Abrir editor libre y corpus YARA con motor real fuera del navegador</Link>}
        </div>
      </section>

      {meta.challengeId && <div role="group" aria-label="Modalidad de práctica" className="mb-5 flex flex-wrap gap-2">
        {[false, true].map((isChallenge) => <button key={String(isChallenge)} aria-pressed={challenge === isChallenge}
          className={`${labButton} ${challenge === isChallenge ? 'border-cyan-400 bg-cyan-950/40 text-cyan-200' : ''}`}
          onClick={() => setSearch((previous) => { const next = new URLSearchParams(previous); if (isChallenge) next.set('mode', 'challenge'); else next.delete('mode'); return next; })}>
          {isChallenge ? 'Reto práctico · opcional' : 'Práctica guiada'}
        </button>)}
      </div>}

      {challenge && meta.challengeId ? <Suspense fallback={<p role="status" className="text-slate-400">Abriendo dossier…</p>}>
        <LabChallengePanel labId={meta.id} challengeId={meta.challengeId} reviewLinks={reviewLinks} />
      </Suspense> : <LabWorkspaceProvider key={`${meta.id}/guided/v1`} identity={`${meta.id}/guided/v1`}>
        <LabWorkbookBar />
        {body}
        <LabResultSummary reviewLinks={reviewLinks} />
      </LabWorkspaceProvider>}
    </div>
  );
}

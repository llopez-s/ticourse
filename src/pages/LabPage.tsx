import { Link, useParams } from 'react-router-dom';
import {
  CLASSIFY_DATA,
  LABS,
  ORDER_DATA,
  SELECT_DATA,
} from '../data/labs';
import { sectionById, trackOf } from '../data/course';
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

export default function LabPage() {
  const { labId } = useParams();
  const meta = LABS.find((l) => l.id === labId);
  const completed = useStore((s) => !!s.labs[labId ?? '']);
  const completeLab = useStore((s) => s.completeLab);
  useSyncTrack(meta?.sectionId);

  if (!meta) return <p className="text-slate-400">Lab no encontrado.</p>;

  const section = sectionById(meta.sectionId);
  const campaign = TRACKS[trackOf(meta.sectionId)].campaign;
  const onComplete = () => completeLab(meta.id, meta.xp);

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
          🧪 Lab · {meta.minutes} min · +{meta.xp} XP
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

      {body}
    </div>
  );
}

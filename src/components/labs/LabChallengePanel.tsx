import { useSearchParams } from 'react-router-dom';
import { CHALLENGE_CASES } from '../../data/lab-challenges';
import ChallengeLab from './ChallengeLab';
import { labButton, LabResultSummary, LabWorkbookBar, LabWorkspaceProvider } from './LabWorkspace';

export default function LabChallengePanel({ labId, challengeId, reviewLinks }: {
  labId: string; challengeId: keyof typeof CHALLENGE_CASES; reviewLinks: { id: string; title: string }[];
}) {
  const [search, setSearch] = useSearchParams();
  const cases = CHALLENGE_CASES[challengeId];
  const selected = cases.find((c) => c.id === search.get('case')) ?? cases[0];
  const identity = `${labId}/challenge/${selected.id}/v1`;
  return <div>
    <div className="mb-4 flex flex-wrap gap-2" role="group" aria-label="Elegir caso práctico">
      {cases.map((item) => <button key={item.id} className={`${labButton} ${selected.id === item.id ? 'border-cyan-400 text-cyan-200' : ''}`}
        aria-pressed={selected.id === item.id} onClick={() => setSearch((previous) => {
          const next = new URLSearchParams(previous); next.set('case', item.id); return next;
        })}>Caso {item.id.endsWith('-a') ? 'A' : 'B'}</button>)}
    </div>
    <LabWorkspaceProvider key={identity} identity={identity}>
      <LabWorkbookBar />
      <ChallengeLab data={selected} />
      <LabResultSummary reviewLinks={reviewLinks} />
    </LabWorkspaceProvider>
  </div>;
}

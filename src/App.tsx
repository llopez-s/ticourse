import { lazy, Suspense, useEffect } from 'react';
import { HashRouter, Route, Routes, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import Toasts from './components/Toasts';
import Dashboard from './pages/Dashboard';
import SectionPage from './pages/SectionPage';
import ModulePage from './pages/ModulePage';
import QuizPage from './pages/QuizPage';
import LabPage from './pages/LabPage';
import BossPage from './pages/BossPage';
import ExamPage from './pages/ExamPage';
import PlacementPage from './pages/PlacementPage';
import CardsPage from './pages/CardsPage';
import GlossaryPage from './pages/GlossaryPage';
import AchievementsPage from './pages/AchievementsPage';
import ProfilePage from './pages/ProfilePage';
import SearchPage from './pages/SearchPage';
import { useSync } from './lib/useSync';
import SecurityLearningHelpObserver from './components/SecurityLearningHelpObserver';
const SecurityStudyPage = lazy(() => import('./pages/SecurityStudyPage'));
const SecurityFoundationPage = lazy(() => import('./pages/SecurityFoundationPage'));
const SecurityPracticePage = lazy(() => import('./pages/SecurityPracticePage'));
const SecurityAssessmentPage = lazy(() => import('./pages/SecurityAssessmentPage'));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  useSync();
  return (
    <HashRouter>
      <ScrollToTop />
      <SecurityLearningHelpObserver />
      <Layout>
        <Suspense fallback={<p role="status" className="p-6 text-cyan-200">Cargando recorrido…</p>}>
        <Routes>
          <Route path="/security/study" element={<SecurityStudyPage />} />
          <Route path="/security/foundation/:id" element={<SecurityFoundationPage />} />
          <Route path="/security/practice/:id" element={<SecurityPracticePage />} />
          <Route path="/security/assessment/:id" element={<SecurityAssessmentPage />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/section/:id" element={<SectionPage />} />
          <Route path="/learn/:moduleId" element={<ModulePage />} />
          <Route path="/quiz/:moduleId" element={<QuizPage />} />
          <Route path="/lab/:labId" element={<LabPage />} />
          <Route path="/boss/:sectionId" element={<BossPage />} />
          <Route path="/exam" element={<ExamPage />} />
          <Route path="/placement" element={<PlacementPage />} />
          <Route path="/placement/:blockId" element={<PlacementPage />} />
          <Route path="/cards" element={<CardsPage />} />
          <Route path="/glossary" element={<GlossaryPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/achievements" element={<AchievementsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="*" element={<Dashboard />} />
        </Routes>
        </Suspense>
      </Layout>
      <Toasts />
    </HashRouter>
  );
}

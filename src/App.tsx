import { useEffect } from 'react';
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
import CardsPage from './pages/CardsPage';
import GlossaryPage from './pages/GlossaryPage';
import AchievementsPage from './pages/AchievementsPage';
import ProfilePage from './pages/ProfilePage';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <HashRouter>
      <ScrollToTop />
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/section/:id" element={<SectionPage />} />
          <Route path="/learn/:moduleId" element={<ModulePage />} />
          <Route path="/quiz/:moduleId" element={<QuizPage />} />
          <Route path="/lab/:labId" element={<LabPage />} />
          <Route path="/boss/:sectionId" element={<BossPage />} />
          <Route path="/exam" element={<ExamPage />} />
          <Route path="/cards" element={<CardsPage />} />
          <Route path="/glossary" element={<GlossaryPage />} />
          <Route path="/achievements" element={<AchievementsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="*" element={<Dashboard />} />
        </Routes>
      </Layout>
      <Toasts />
    </HashRouter>
  );
}

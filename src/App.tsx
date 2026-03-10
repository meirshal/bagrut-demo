import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { ConfigProvider } from '@/contexts/ConfigContext';
import { useRiskEvaluation } from '@/hooks/useRiskEvaluation';
import { SchoolDashboard } from '@/pages/SchoolDashboard';
import { ClassGradeGrid } from '@/pages/ClassGradeGrid';
import { StudentDetail } from '@/pages/StudentDetail';
import { RankingView } from '@/pages/RankingView';
import { ChallengingStudents } from '@/pages/ChallengingStudents';
import { WhatIfProjections } from '@/pages/WhatIfProjections';
import { Settings } from '@/pages/Settings';

/** Inner component that lives inside ConfigProvider so hooks can access config. */
function AppRoutes() {
  useRiskEvaluation();

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<SchoolDashboard />} />
          <Route path="/class/:classId" element={<ClassGradeGrid />} />
          <Route path="/students" element={<SchoolDashboard />} />
          <Route path="/student/:studentId" element={<StudentDetail />} />
          <Route path="/ranking" element={<RankingView />} />
          <Route path="/at-risk" element={<ChallengingStudents />} />
          <Route path="/analytics" element={<WhatIfProjections />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

function App() {
  return (
    <ConfigProvider>
      <AppRoutes />
    </ConfigProvider>
  );
}

export default App;

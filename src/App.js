import React, { useState } from 'react';
import Sidebar from "./components/Sidebar";
import Dashboard from './pages/Dashboard';
import ProjectInput from './pages/ProjectInput';
import AnalyticsResults from './pages/AnalyticsResults';
import KPIDashboard from './pages/KPIDashboard';
import ProjectDrilldown from './pages/ProjectDrilldown';
import QuickSightPage from './pages/QuickSightPage';

import './App.css';

const App = () => {
  const [currentPage, setCurrentPage] = useState('overview');

  const renderPage = () => {
    switch(currentPage) {
      case 'overview':
        return <Dashboard />;
      case 'project-input':
        return <ProjectInput />;
      case 'analytics':
        return <AnalyticsResults />;
      case 'quicksight':
        return <QuickSightPage />;
      case 'kpi':
        return <KPIDashboard />;
      case 'drilldown':
        return <ProjectDrilldown />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-r from-[#E1A485] to-[#e1d285]">
      <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />
      <main className="flex-1 p-8">
        {renderPage()}
      </main>
    </div>
  );
};

export default App;
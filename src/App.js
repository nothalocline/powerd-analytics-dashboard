import React, { useState } from 'react';
import Sidebar from "./components/Sidebar";
import Dashboard from './pages/Dashboard';
import ProjectInput from './pages/ProjectInput';
import AnalyticsResults from './pages/AnalyticsResults';

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
      case 'kpi':
        return <div className="p-8"><h1 className="text-2xl font-bold">KPI Benchmarking - Coming Soon</h1></div>;
      case 'drilldown':
        return <div className="p-8"><h1 className="text-2xl font-bold">Project Drilldown - Coming Soon</h1></div>;
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
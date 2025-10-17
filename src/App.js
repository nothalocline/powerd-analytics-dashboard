import React from 'react'
import Sidebar from "./components/Sidebar";
import Dashboard from './pages/Dashboard';

import './App.css'

const App = () => {
  return (
     <div className="flex bg-[#e1a485] min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8">
        <Dashboard />
      </main>
    </div>
  )
}

export default App
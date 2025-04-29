import React, { useState } from 'react';
import Header from './Header';
import { Outlet } from 'react-router-dom';
import Sidebar from './sideBar';

const GameLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex flex-col h-screen">
      <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm h-14">
        <Header />
      </div>
      
      <div className="flex flex-1 pt-14 overflow-hidden">
        {/* Sidebar com estado controlado aqui */}
        <div className={`fixed left-0 top-14 h-[calc(100vh-3.5rem)] z-40 overflow-y-auto transition-all duration-300 ${
          isSidebarOpen ? 'w-64' : 'w-20'
        }`}>
          <Sidebar 
            isSidebarOpen={isSidebarOpen} 
            setIsSidebarOpen={setIsSidebarOpen} 
          />
        </div>
        
        {/* Conteúdo principal com margem dinâmica */}
        <main className={`flex-1 p-6 overflow-auto transition-all duration-300 ${
          isSidebarOpen ? 'ml-64' : 'ml-20'
        }`}>
          <Outlet context={{ isSidebarOpen }} />
        </main>
      </div>
    </div>
  );
};

export default GameLayout;
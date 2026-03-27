import React, { useState } from 'react';
import EquipmentManagement from './components/EquipmentManagement';
import Dashboard from './components/Dashboard';
import Reports from './components/Reports';
import Settings from './components/Settings';
import './App.css';

function App() {
  const [activePage, setActivePage] = useState('dashboard');

  const renderPage = () => {
    switch(activePage) {
      case 'dashboard':
        return <Dashboard />;
      case 'equipment':
        return <EquipmentManagement />;
      case 'reports':
        return <Reports />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <img src="/images/hospital-logo.png" alt="Nepalgunj Neuro Hospital" className="logo-img" />
          <h2>Nepalgunj Neuro</h2>
          <p>Equipment Management</p>
        </div>
        
        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activePage === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActivePage('dashboard')}
          >
            <span className="nav-icon">📊</span>
            <span className="nav-text">Dashboard</span>
          </button>
          
          <button 
            className={`nav-item ${activePage === 'equipment' ? 'active' : ''}`}
            onClick={() => setActivePage('equipment')}
          >
            <span className="nav-icon">🏥</span>
            <span className="nav-text">Equipment</span>
          </button>
          
          <button 
            className={`nav-item ${activePage === 'reports' ? 'active' : ''}`}
            onClick={() => setActivePage('reports')}
          >
            <span className="nav-icon">📋</span>
            <span className="nav-text">Reports</span>
          </button>
          
          <button 
            className={`nav-item ${activePage === 'settings' ? 'active' : ''}`}
            onClick={() => setActivePage('settings')}
          >
            <span className="nav-icon">⚙️</span>
            <span className="nav-text">Settings</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="main-header">
          <div className="header-left">
            <h1>Equipment Management System</h1>
            <p>Nepalgunj Neuro Hospital</p>
          </div>
          <div className="header-right">
            <span className="user-name">Admin</span>
            <img src="/frontend/public/images/hospital-logo.jpg" alt="Admin" className="user-avatar" />
          </div>
        </header>
        
        <div className="content-area">
          {renderPage()}
        </div>
      </main>
    </div>
  );
}

export default App;
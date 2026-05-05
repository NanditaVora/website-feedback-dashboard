import React, { useState, useEffect } from 'react';
import Landing from './components/Landing';
import Dashboard from './components/Dashboard';
import data from './data.json';
import { BarChart3, Sun, Moon } from 'lucide-react';

function App() {
  const [view, setView] = useState('landing');
  const [selectedProgramId, setSelectedProgramId] = useState(data[0]?.id || null);
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }, [isDarkMode]);

  const navigateToProgram = (id) => {
    if (id) setSelectedProgramId(id);
    setView('dashboard');
  };

  return (
    <div>
      <nav className="glass" style={{ margin: '1rem 2rem', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }} onClick={() => setView('landing')}>
          <div style={{ background: 'var(--accent-color)', padding: '0.5rem', borderRadius: '8px' }}>
            <BarChart3 size={24} color="white" />
          </div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: '700' }} className="text-gradient">
            Product Page Insights
          </h1>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)} 
            style={{ 
              background: 'rgba(255,255,255,0.05)', 
              border: '1px solid var(--glass-border)', 
              color: 'var(--text-primary)', 
              padding: '0.5rem', 
              borderRadius: '50%', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease'
            }}
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          {view === 'landing' ? (
            <button className="btn btn-primary" onClick={() => setView('dashboard')}>
              Go to Dashboard
            </button>
          ) : (
            <button className="btn btn-secondary" onClick={() => setView('landing')}>
              Back to Home
            </button>
          )}
        </div>
      </nav>

      <main>
        {view === 'landing' ? (
          <Landing navigateToProgram={navigateToProgram} data={data} />
        ) : (
          <Dashboard data={data} selectedProgramId={selectedProgramId} setSelectedProgramId={setSelectedProgramId} />
        )}
      </main>
    </div>
  );
}

export default App;

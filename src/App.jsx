import React, { useState } from 'react';
import Landing from './components/Landing';
import Dashboard from './components/Dashboard';
import data from './data.json';
import { BarChart3 } from 'lucide-react';

function App() {
  const [view, setView] = useState('landing');
  const [selectedProgramId, setSelectedProgramId] = useState(data[0]?.id || null);

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
            FSE Feedback
          </h1>
        </div>
        <div>
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

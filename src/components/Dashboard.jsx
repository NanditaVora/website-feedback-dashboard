import React from 'react';
import { ExternalLink, List, AlertCircle } from 'lucide-react';

const Dashboard = ({ data, selectedProgramId, setSelectedProgramId }) => {
  const selectedProgram = data.find(p => p.id === selectedProgramId);

  return (
    <div className="container animate-fade-in" style={{ padding: '2rem' }}>
      <div className="dashboard-grid">
        {/* Sidebar */}
        <div className="glass-panel" style={{ height: 'fit-content' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
            Programs
          </h2>
          <div>
            {data.map((program) => (
              <div 
                key={program.id}
                className={`nav-item ${selectedProgramId === program.id ? 'active' : ''}`}
                onClick={() => setSelectedProgramId(program.id)}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <span style={{ fontWeight: '500', fontSize: '0.95rem', lineHeight: '1.2' }}>{program.name || program.filename}</span>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <span className="badge">{program.issues.length} Issues</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        {selectedProgram && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div className="glass-panel">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem' }}>{selectedProgram.name}</h1>
                  {selectedProgram.url && (
                    <a href={selectedProgram.url} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-color)', textDecoration: 'none' }}>
                      View Course <ExternalLink size={16} />
                    </a>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div className="glass-panel" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '0.75rem', borderRadius: '50%' }}>
                      <AlertCircle size={24} color="var(--danger)" />
                    </div>
                    <div>
                      <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>{selectedProgram.issues.length}</div>
                      <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Total Issues</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th style={{ width: '15%' }}>Section</th>
                    <th style={{ width: '25%' }}>Content</th>
                    <th style={{ width: '30%' }}>Gap / Issue</th>
                    <th style={{ width: '30%' }}>Suggested Fix</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedProgram.issues.map((issue, idx) => (
                    <tr key={idx}>
                      <td>
                        <div style={{ fontWeight: '500', marginBottom: '0.25rem' }}>{issue['Section Heading']}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{issue['Sub-Section Heading']}</div>
                      </td>
                      <td>{issue['Content']}</td>
                      <td>
                        {issue['Gap / Issue'] ? (
                           <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                             <AlertCircle size={16} color="var(--warning)" style={{ flexShrink: 0, marginTop: '2px' }} />
                             <span>{issue['Gap / Issue']}</span>
                           </div>
                        ) : '-'}
                      </td>
                      <td>{issue['Fix Suggested'] || '-'}</td>
                    </tr>
                  ))}
                  {selectedProgram.issues.length === 0 && (
                    <tr>
                      <td colSpan="4" style={{ textAlign: 'center', padding: '3rem' }}>
                        No issues found for this program.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

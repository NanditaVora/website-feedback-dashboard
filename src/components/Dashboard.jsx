import React, { useState } from 'react';
import { ExternalLink, List, AlertCircle, Search } from 'lucide-react';

const Dashboard = ({ data, selectedProgramId, setSelectedProgramId }) => {
  const selectedProgram = data.find(p => p.id === selectedProgramId);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredIssues = selectedProgram ? selectedProgram.issues.filter(issue => {
    const searchLower = searchTerm.toLowerCase();
    return (
      (issue['Content'] || '').toLowerCase().includes(searchLower) ||
      (issue['Gap / Issue'] || '').toLowerCase().includes(searchLower) ||
      (issue['Section Heading'] || '').toLowerCase().includes(searchLower) ||
      (issue['Sub-Section Heading'] || '').toLowerCase().includes(searchLower) ||
      (issue['Fix Suggested'] || '').toLowerCase().includes(searchLower)
    );
  }) : [];

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
              <button
                key={program.id}
                className={`nav-item ${selectedProgramId === program.id ? 'active' : ''}`}
                onClick={() => { setSelectedProgramId(program.id); setSearchTerm(''); }}
                style={{ width: '100%', background: 'none', border: 'none', textAlign: 'left', font: 'inherit', cursor: 'pointer' }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <span style={{ fontWeight: '500', fontSize: '0.95rem', lineHeight: '1.2' }}>{program.name || program.filename}</span>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <span className="badge">{program.issues.length} Issues</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        {!selectedProgram && (
          <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '200px' }}>
            <p style={{ color: 'var(--text-secondary)' }}>Select a program from the sidebar to view its issues.</p>
          </div>
        )}
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

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Feedback Details</h2>
                <div style={{ position: 'relative', width: '300px' }}>
                  <Search size={18} color="var(--text-secondary)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input 
                    type="text" 
                    placeholder="Search issues, sections, content..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ 
                      width: '100%', 
                      padding: '0.75rem 1rem 0.75rem 2.5rem', 
                      borderRadius: '8px', 
                      background: 'var(--glass-bg)', 
                      border: '1px solid var(--glass-border)', 
                      color: 'var(--text-primary)',
                      fontFamily: 'inherit',
                      outline: 'none'
                    }}
                  />
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
                    {filteredIssues.map((issue, idx) => (
                      <tr key={`${issue['Section Heading']}-${issue['Sub-Section Heading']}-${idx}`}>
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
                    {filteredIssues.length === 0 && (
                      <tr>
                        <td colSpan="4" style={{ textAlign: 'center', padding: '3rem' }}>
                          <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>No matching issues found.</p>
                          {searchTerm && (
                            <button className="btn btn-secondary" onClick={() => setSearchTerm('')} style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}>
                              Clear Search
                            </button>
                          )}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

import React, { useState } from 'react';
import { ExternalLink, List, AlertCircle, Search, Download, X, ChevronLeft, Menu } from 'lucide-react';

const Dashboard = ({ data, selectedProgramId, setSelectedProgramId }) => {
  const selectedProgram = data.find(p => p.id === selectedProgramId);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const getTagColor = (section) => {
    const sec = (section || '').toLowerCase();
    if (sec.includes('hero')) return 'tag-rose';
    if (sec.includes('overview') || sec.includes('landing')) return 'tag-green';
    if (sec.includes('tools') || sec.includes('tech')) return 'tag-teal';
    if (sec.includes('learning') || sec.includes('outcome')) return 'tag-amber';
    if (sec.includes('curriculum')) return 'tag-purple';
    if (sec.includes('module')) return 'tag-violet';
    if (sec.includes('lesson')) return 'tag-fuchsia';
    if (sec.includes('project')) return 'tag-pink';
    if (sec.includes('assignment')) return 'tag-blue';
    if (sec.includes('capstone')) return 'tag-red';
    if (sec.includes('quiz')) return 'tag-orange';
    if (sec.includes('assessment')) return 'tag-indigo';
    if (sec.includes('video')) return 'tag-emerald';
    if (sec.includes('material')) return 'tag-cyan';
    if (sec.includes('intro')) return 'tag-cyan';
    return 'tag-default';
  };

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

  const exportToCSV = () => {
    if (!filteredIssues.length) return;
    const headers = Object.keys(filteredIssues[0]).join(',');
    const rows = filteredIssues.map(issue => 
      Object.values(issue).map(val => `"${String(val).replace(/"/g, '""')}"`).join(',')
    ).join('\n');
    const csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent(headers + "\n" + rows);
    const link = document.createElement("a");
    link.setAttribute("href", csvContent);
    link.setAttribute("download", `${selectedProgram.name.replace(/[^a-zA-Z0-9]/g, '_')}_issues.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '2rem', position: 'relative' }}>
      <div className="dashboard-layout">
        {/* Sidebar */}
        <div className={`sidebar-container ${isSidebarOpen ? '' : 'collapsed'}`} style={{ 
          width: isSidebarOpen ? '280px' : '0px', 
          opacity: isSidebarOpen ? 1 : 0,
          marginRight: isSidebarOpen ? '2rem' : '0px'
        }}>
          <div className="glass-panel" style={{ height: 'fit-content' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Programs</h2>
            </div>
            <div>
            {data.map((program) => (
              <button
                key={program.id}
                className={`nav-item ${selectedProgramId === program.id ? 'active' : ''}`}
                onClick={() => { setSelectedProgramId(program.id); setSearchTerm(''); setSelectedIssue(null); }}
              >
                <span style={{ lineHeight: '1.2', flex: 1, paddingRight: '0.5rem' }}>{program.name || program.filename}</span>
                <span className="badge" style={{ flexShrink: 0, marginTop: '2px' }}>{program.issues.length}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
        <div className="main-container">
        {!selectedProgram && (
          <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '200px', position: 'relative' }}>
            {!isSidebarOpen && (
              <button onClick={() => setIsSidebarOpen(true)} className="btn btn-secondary" style={{ position: 'absolute', top: '1rem', left: '1rem', padding: '0.5rem' }}>
                <Menu size={20} />
              </button>
            )}
            <p style={{ color: 'var(--text-secondary)' }}>Select a program from the sidebar to view its issues.</p>
          </div>
        )}
        {selectedProgram && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div className="glass-panel">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '2rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', flex: 1, minWidth: 0 }}>
                  <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="btn btn-secondary" style={{ padding: '0.5rem', marginTop: '0.25rem', flexShrink: 0 }} title="Toggle Sidebar">
                    {isSidebarOpen ? <ChevronLeft size={20} /> : <Menu size={20} />}
                  </button>
                  <div style={{ minWidth: 0 }}>
                    <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem', wordBreak: 'break-word' }}>{selectedProgram.name}</h1>
                  {selectedProgram.url && (
                    <a href={selectedProgram.url} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-color)', textDecoration: 'none' }}>
                      View Course <ExternalLink size={16} />
                    </a>
                  )}
                  </div>
                </div>
                <div className="glass-panel" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem', flexShrink: 0, alignSelf: 'flex-start' }}>
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

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Feedback Details</h2>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
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
                  <button className="btn btn-secondary" onClick={exportToCSV} disabled={!filteredIssues.length} style={{ padding: '0.75rem' }} title="Export as CSV">
                    <Download size={20} />
                  </button>
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
                      <tr 
                        key={`${issue['Section Heading']}-${issue['Sub-Section Heading']}-${idx}`}
                        onClick={() => setSelectedIssue(issue)}
                        style={{ cursor: 'pointer' }}
                        className="clickable-row"
                      >
                        <td>
                          <div style={{ marginBottom: '0.5rem' }}>
                            <span className={`section-tag ${getTagColor(issue['Section Heading'])}`}>
                              {issue['Section Heading'] || 'General'}
                            </span>
                          </div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '500' }}>{issue['Sub-Section Heading']}</div>
                        </td>
                        <td className="text-preview">{issue['Content'] ? (issue['Content'].length > 50 ? issue['Content'].substring(0, 50) + '...' : issue['Content']) : '-'}</td>
                        <td className="text-preview">
                          {issue['Gap / Issue'] ? (
                             <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                               <AlertCircle size={16} color="var(--warning)" style={{ flexShrink: 0, marginTop: '2px' }} />
                               <span>{issue['Gap / Issue'].length > 50 ? issue['Gap / Issue'].substring(0, 50) + '...' : issue['Gap / Issue']}</span>
                             </div>
                          ) : '-'}
                        </td>
                        <td className="text-preview">{issue['Fix Suggested'] ? (issue['Fix Suggested'].length > 50 ? issue['Fix Suggested'].substring(0, 50) + '...' : issue['Fix Suggested']) : '-'}</td>
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

      {/* Slide-out Panel */}
      {selectedIssue && (
        <>
          <div 
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 40, backdropFilter: 'blur(4px)' }} 
            onClick={() => setSelectedIssue(null)}
          />
          <div 
            className="glass"
            style={{ 
              position: 'fixed', top: 0, right: 0, bottom: 0, width: '100%', maxWidth: '500px', 
              zIndex: 50, borderRight: 'none', borderRadius: '16px 0 0 16px',
              padding: '2rem', overflowY: 'auto',
              boxShadow: '-10px 0 30px rgba(0,0,0,0.5)',
              transform: 'translateX(0)', transition: 'transform 0.3s ease-in-out'
            }}
          >
            <button 
              style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
              onClick={() => setSelectedIssue(null)}
            >
              <X size={24} />
            </button>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem', paddingRight: '2rem' }}>Issue Details</h2>
            
            <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Section</h4>
                <p style={{ fontSize: '1.1rem', fontWeight: '500' }}>{selectedIssue['Section Heading']}</p>
                <p style={{ color: 'var(--text-secondary)' }}>{selectedIssue['Sub-Section Heading']}</p>
              </div>

              {selectedIssue['Content'] && (
                <div className="glass-panel" style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)' }}>
                  <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Content</h4>
                  <p style={{ whiteSpace: 'pre-wrap' }}>{selectedIssue['Content']}</p>
                </div>
              )}

              {selectedIssue['Gap / Issue'] && (
                <div className="glass-panel" style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.05)', borderColor: 'rgba(239, 68, 68, 0.2)' }}>
                  <h4 style={{ color: 'var(--danger)', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <AlertCircle size={14} /> Gap / Issue
                  </h4>
                  <p style={{ whiteSpace: 'pre-wrap' }}>{selectedIssue['Gap / Issue']}</p>
                </div>
              )}

              {selectedIssue['Fix Suggested'] && (
                <div className="glass-panel" style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.05)', borderColor: 'rgba(16, 185, 129, 0.2)' }}>
                  <h4 style={{ color: 'var(--success)', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Suggested Fix</h4>
                  <p style={{ whiteSpace: 'pre-wrap' }}>{selectedIssue['Fix Suggested']}</p>
                </div>
              )}
              
              {selectedIssue['Remarks'] && selectedIssue['Remarks'] !== 'nan' && (
                <div className="glass-panel" style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)' }}>
                  <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Remarks</h4>
                  <p style={{ whiteSpace: 'pre-wrap' }}>{selectedIssue['Remarks']}</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;

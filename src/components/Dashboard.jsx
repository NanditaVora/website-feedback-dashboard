import React, { useState, useEffect, useRef } from 'react';
import { ExternalLink, AlertCircle, Search, Download, X, ChevronLeft, Menu } from 'lucide-react';

const Dashboard = ({ data, selectedProgramId, setSelectedProgramId }) => {
  const selectedProgram = data.find(p => p.id === selectedProgramId);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [panelTop, setPanelTop] = useState(0);
  const panelRef = useRef(null);

  useEffect(() => {
    if (selectedIssue && panelRef.current) {
      panelRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [selectedIssue]);

  const handleIssueClick = (issue, e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    // Use the viewport-relative top position
    // We want the card to stay near the row but within viewport bounds
    const cardHeight = 400; // Estimated
    let top = rect.top - 100; // Offset for better visibility
    
    const minTop = 20;
    const maxTop = window.innerHeight - 450;
    
    setPanelTop(Math.max(minTop, Math.min(top, maxTop)));
    setSelectedIssue(issue);
  };

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
                        onClick={(e) => handleIssueClick(issue, e)}
                        style={{ cursor: 'pointer' }}
                        className={`clickable-row ${selectedIssue === issue ? 'active-row' : ''}`}
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
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        </div>
      </div>

      {/* Floating Side Card */}
      {selectedIssue && (
        <>
          <div 
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.2)', zIndex: 40 }} 
            onClick={() => setSelectedIssue(null)}
          />
          <div 
            className="animate-fade-in"
            style={{ 
              position: 'fixed', 
              top: `${panelTop}px`, 
              right: '2rem', 
              width: '100%', 
              maxWidth: '500px', 
              zIndex: 50, 
              pointerEvents: 'auto'
            }}
          >
            <div 
              ref={panelRef}
              className="glass"
              style={{ 
                borderRadius: '20px',
                padding: '2rem', 
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                background: 'rgba(15, 23, 42, 0.98)',
                maxHeight: '80vh',
                overflowY: 'auto'
              }}
            >
              <button 
                style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'rgba(255,255,255,0.05)', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '0.4rem', borderRadius: '50%', display: 'flex' }}
                onClick={() => setSelectedIssue(null)}
              >
                <X size={20} />
              </button>
              
              <div style={{ marginBottom: '1.5rem' }}>
                <span className={`section-tag ${getTagColor(selectedIssue['Section Heading'])}`} style={{ marginBottom: '0.5rem' }}>
                  {selectedIssue['Section Heading']}
                </span>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginTop: '0.5rem', color: '#ffffff' }}>Issue Details</h2>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>Sub-Section</h4>
                  <p style={{ fontSize: '1.1rem', fontWeight: '500', color: '#f1f5f9' }}>{selectedIssue['Sub-Section Heading']}</p>
                </div>

                {selectedIssue['Content'] && (
                  <div className="glass-panel" style={{ padding: '1.25rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>Content Reference</h4>
                    <p style={{ whiteSpace: 'pre-wrap', fontSize: '0.95rem', lineHeight: '1.6', color: '#cbd5e1' }}>{selectedIssue['Content']}</p>
                  </div>
                )}

                {selectedIssue['Gap / Issue'] && (
                  <div className="glass-panel" style={{ padding: '1.25rem', background: 'rgba(239, 68, 68, 0.05)', borderColor: 'rgba(239, 68, 68, 0.2)' }}>
                    <h4 style={{ color: 'var(--danger)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <AlertCircle size={14} /> Gap / Issue
                    </h4>
                    <p style={{ whiteSpace: 'pre-wrap', fontSize: '0.95rem', lineHeight: '1.6', color: '#fca5a5' }}>{selectedIssue['Gap / Issue']}</p>
                  </div>
                )}

                {selectedIssue['Fix Suggested'] && (
                  <div className="glass-panel" style={{ padding: '1.25rem', background: 'rgba(16, 185, 129, 0.05)', borderColor: 'rgba(16, 185, 129, 0.2)' }}>
                    <h4 style={{ color: 'var(--success)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>Suggested Fix</h4>
                    <p style={{ whiteSpace: 'pre-wrap', fontSize: '0.95rem', lineHeight: '1.6', color: '#6ee7b7' }}>{selectedIssue['Fix Suggested']}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;

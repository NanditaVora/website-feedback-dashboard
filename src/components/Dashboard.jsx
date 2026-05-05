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
    // We want the card to center its arrow on the row
    const cardHeight = 400; // Expected height
    let top = rect.top - 50; 
    
    // Bounds checking
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
                    {filteredIssues.map((issue, idx) => {
                      const isSelected = selectedIssue === issue;
                      const issueKey = `${issue['Section Heading']}-${issue['Sub-Section Heading']}-${idx}`;
                      
                      return (
                        <React.Fragment key={issueKey}>
                          <tr 
                            onClick={(e) => setSelectedIssue(isSelected ? null : issue)}
                            style={{ cursor: 'pointer' }}
                            className={`clickable-row ${isSelected ? 'active-row' : ''}`}
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
                          {isSelected && (
                            <tr style={{ background: 'rgba(30, 41, 59, 0.4)' }}>
                              <td colSpan="4" style={{ padding: '0' }}>
                                <div className="animate-fade-in" style={{ padding: '2rem', borderTop: '1px solid rgba(56, 189, 248, 0.2)' }}>
                                  <div className="glass-panel" style={{ background: 'rgba(30, 41, 59, 0.6)', border: '1px solid rgba(255,255,255,0.1)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                      <h3 style={{ fontSize: '1.25rem', fontWeight: '700' }}>Full Feedback Details</h3>
                                      <button className="btn btn-secondary" style={{ padding: '0.4rem' }} onClick={() => setSelectedIssue(null)}>
                                        <X size={18} />
                                      </button>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                                      {issue['Content'] && (
                                        <div className="glass-panel" style={{ background: 'rgba(255,255,255,0.02)' }}>
                                          <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Content Reference</h4>
                                          <p style={{ whiteSpace: 'pre-wrap', fontSize: '0.95rem', lineHeight: '1.6' }}>{issue['Content']}</p>
                                        </div>
                                      )}
                                      {issue['Gap / Issue'] && (
                                        <div className="glass-panel" style={{ background: 'rgba(239, 68, 68, 0.05)', borderColor: 'rgba(239, 68, 68, 0.2)' }}>
                                          <h4 style={{ color: 'var(--danger)', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Gap / Issue</h4>
                                          <p style={{ whiteSpace: 'pre-wrap', fontSize: '0.95rem', lineHeight: '1.6' }}>{issue['Gap / Issue']}</p>
                                        </div>
                                      )}
                                      {issue['Fix Suggested'] && (
                                        <div className="glass-panel" style={{ background: 'rgba(16, 185, 129, 0.05)', borderColor: 'rgba(16, 185, 129, 0.2)' }}>
                                          <h4 style={{ color: 'var(--success)', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Suggested Fix</h4>
                                          <p style={{ whiteSpace: 'pre-wrap', fontSize: '0.95rem', lineHeight: '1.6' }}>{issue['Fix Suggested']}</p>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        </div>
      </div>

      {/* Details Box (Aligned with Row) */}
    </div>
  );
};

export default Dashboard;

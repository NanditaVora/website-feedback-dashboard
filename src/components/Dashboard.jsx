import React, { useState, useEffect, useRef } from 'react';
import { ExternalLink, AlertCircle, Search, Download, X, ChevronLeft, Menu, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

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
    const cardHeight = 450; 
    let top = rect.top - 100;
    const minTop = 20;
    const maxTop = window.innerHeight - cardHeight - 20;
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

  const getStatusBadge = (status) => {
    const s = (status || '').toLowerCase();
    if (s.includes('cannot')) {
      return <span className="status-badge status-cannot"><X size={12} /> Cannot Fix</span>;
    }
    if (s.includes('fixed')) {
      return <span className="status-badge status-completed"><CheckCircle size={12} /> Fixed</span>;
    }
    if (s.includes('wip') || s.includes('progress')) {
      return <span className="status-badge status-progress"><Clock size={12} /> WIP</span>;
    }
    return <span className="status-badge status-open"><AlertTriangle size={12} /> Open</span>;
  };

  const isFixed = (issue) => {
    const s = (issue['Status'] || '').toLowerCase();
    // Only 'fixed' counts as green/completed for the stats
    return s.includes('fixed');
  };

  const getProgStats = (program) => {
    if (!program || !program.issues) return { total: 0, fixed: 0, open: 0, cannot: 0 };
    const issues = program.issues || [];
    const total = issues.length;
    const fixed = issues.filter(isFixed).length;
    const cannot = issues.filter(i => String(i['Status'] || '').toLowerCase().includes('cannot')).length;
    return { total, fixed, cannot, open: total - fixed - cannot };
  };

  const globalStats = data.reduce((acc, p) => {
    const s = getProgStats(p);
    acc.total += s.total;
    acc.fixed += s.fixed;
    acc.open += s.open;
    acc.cannot += s.cannot;
    return acc;
  }, { total: 0, fixed: 0, open: 0, cannot: 0 });

  const filteredIssues = (selectedProgram && selectedProgram.issues) ? selectedProgram.issues.filter(issue => {
    const searchLower = searchTerm.toLowerCase();
    return (
      String(issue['Content'] || '').toLowerCase().includes(searchLower) ||
      String(issue['Gap / Issue'] || '').toLowerCase().includes(searchLower) ||
      String(issue['Section Heading'] || '').toLowerCase().includes(searchLower) ||
      String(issue['Sub-Section Heading'] || '').toLowerCase().includes(searchLower) ||
      String(issue['Fix Suggested'] || '').toLowerCase().includes(searchLower) ||
      String(issue['Status'] || '').toLowerCase().includes(searchLower) ||
      String(issue['Remarks'] || '').toLowerCase().includes(searchLower)
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
    <div className="container" style={{ padding: '2rem' }}>
      <div className="dashboard-layout animate-fade-in">
        {/* Sidebar */}
        <div className={`sidebar-container ${isSidebarOpen ? '' : 'collapsed'}`} style={{ 
          width: isSidebarOpen ? '280px' : '0px', 
          opacity: isSidebarOpen ? 1 : 0,
          marginRight: isSidebarOpen ? '2rem' : '0px'
        }}>
          <div className="glass-panel" style={{ height: 'fit-content' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Programs</h2>
            </div>

            {/* Combined Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.4rem', marginBottom: '1.25rem', padding: '0.6rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)' }}>{globalStats.total}</div>
                <div style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>All</div>
              </div>
              <div style={{ textAlign: 'center', borderLeft: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--danger)' }}>{globalStats.open}</div>
                <div style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Open</div>
              </div>
              <div style={{ textAlign: 'center', borderLeft: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--success)' }}>{globalStats.fixed}</div>
                <div style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Fix</div>
              </div>
              <div style={{ textAlign: 'center', borderLeft: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#f59e0b' }}>{globalStats.cannot}</div>
                <div style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Skip</div>
              </div>
            </div>

            <div>
            {data.map((program) => {
              const ps = getProgStats(program);
              return (
              <button
                key={program.id}
                className={`nav-item ${selectedProgramId === program.id ? 'active' : ''}`}
                onClick={() => { setSelectedProgramId(program.id); setSearchTerm(''); setSelectedIssue(null); }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ lineHeight: '1.2', paddingRight: '0.5rem', marginBottom: '0.35rem' }}>{program.name || program.filename}</div>
                  <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <span className="stat-pill stat-pill-open">{ps.open} open</span>
                    <span className="stat-pill stat-pill-fixed">{ps.fixed} fixed</span>
                    {ps.cannot > 0 && <span className="stat-pill stat-pill-cannot" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', border: '1px solid rgba(245, 158, 11, 0.3)' }}>{ps.cannot} skip</span>}
                  </div>
                </div>
                <span className="badge" style={{ flexShrink: 0, marginTop: '2px' }}>{ps.total}</span>
              </button>
              );
            })}
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
                    <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem', wordBreak: 'break-word' }}>
                      {selectedProgram ? selectedProgram.name : 'Loading...'}
                    </h1>
                    <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                      {selectedProgram?.url && (
                        <a href={selectedProgram.url} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-color)', textDecoration: 'none', fontWeight: '500' }}>
                          View Product Page <ExternalLink size={16} />
                        </a>
                      )}
                      {selectedProgram?.sheet_url && (
                        <a href={selectedProgram.sheet_url} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--success)', textDecoration: 'none', fontWeight: '500' }}>
                          Edit Feedback Sheet <FileSpreadsheet size={16} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
                {/* Program-level stat pills */}
                {selectedProgram && (() => {
                  const ps = getProgStats(selectedProgram);
                  return (
                    <div style={{ display: 'flex', gap: '0.75rem', flexShrink: 0, alignSelf: 'flex-start', flexWrap: 'wrap' }}>
                      <div className="glass-panel" style={{ padding: '0.75rem 1.25rem', textAlign: 'center', minWidth: '80px' }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>{ps.total}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Total</div>
                      </div>
                      <div className="glass-panel" style={{ padding: '0.75rem 1.25rem', textAlign: 'center', minWidth: '80px', background: 'rgba(239,68,68,0.07)', borderColor: 'rgba(239,68,68,0.2)' }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--danger)' }}>{ps.open}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Open</div>
                      </div>
                      <div className="glass-panel" style={{ padding: '0.75rem 1.25rem', textAlign: 'center', minWidth: '80px', background: 'rgba(16,185,129,0.07)', borderColor: 'rgba(16,185,129,0.2)' }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--success)' }}>{ps.fixed}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Fixed</div>
                      </div>
                      <div className="glass-panel" style={{ padding: '0.75rem 1.25rem', textAlign: 'center', minWidth: '80px', background: 'rgba(245, 158, 11, 0.07)', borderColor: 'rgba(245, 158, 11, 0.2)' }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#f59e0b' }}>{ps.cannot}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Skip</div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Product Page Feedback</h2>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div style={{ position: 'relative', width: '300px' }}>
                    <Search size={18} color="var(--text-secondary)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input 
                      type="text" 
                      placeholder="Search issues, status, remarks..." 
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
                      <th style={{ width: '12%' }}>Status</th>
                      <th style={{ width: '15%' }}>Section</th>
                      <th style={{ width: '23%' }}>Content</th>
                      <th style={{ width: '25%' }}>Gap / Issue</th>
                      <th style={{ width: '25%' }}>Suggested Fix</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredIssues.map((issue, idx) => {
                      const isCompleted = (issue['Status'] || '').toLowerCase().includes('complete') || (issue['Status'] || '').toLowerCase().includes('fixed');
                      return (
                        <tr 
                          key={`${issue['Section Heading']}-${issue['Sub-Section Heading']}-${idx}`}
                          onClick={(e) => handleIssueClick(issue, e)}
                          style={{ cursor: 'pointer' }}
                          className={`clickable-row ${selectedIssue === issue ? 'active-row' : ''} ${isCompleted ? 'row-completed' : ''}`}
                        >
                          <td>{getStatusBadge(issue['Status'])}</td>
                          <td>
                            <div style={{ marginBottom: '0.5rem' }}>
                              <span className={`section-tag ${getTagColor(issue['Section Heading'])}`}>
                                {issue['Section Heading'] || 'General'}
                              </span>
                            </div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '500' }}>{issue['Sub-Section Heading']}</div>
                          </td>
                          <td className="text-preview">{issue['Content'] ? (issue['Content'].length > 40 ? issue['Content'].substring(0, 40) + '...' : issue['Content']) : '-'}</td>
                          <td className="text-preview">
                            {issue['Gap / Issue'] ? (
                               <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                                 <AlertCircle size={14} color="var(--warning)" style={{ flexShrink: 0, marginTop: '2px' }} />
                                 <span>{issue['Gap / Issue'].length > 40 ? issue['Gap / Issue'].substring(0, 40) + '...' : issue['Gap / Issue']}</span>
                               </div>
                            ) : '-'}
                          </td>
                          <td className="text-preview">{issue['Fix Suggested'] ? (issue['Fix Suggested'].length > 40 ? issue['Fix Suggested'].substring(0, 40) + '...' : issue['Fix Suggested']) : '-'}</td>
                        </tr>
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

      {/* Floating Side Card */}
      {selectedIssue && (() => {
        const MARGIN = 16; // px gap from top and bottom of viewport
        const viewportHeight = window.innerHeight;
        // Clamp top so card never starts below bottom of viewport
        const clampedTop = Math.min(panelTop, viewportHeight - 200);
        // Max height = from clamped top to bottom of viewport minus margin
        const dynamicMaxHeight = viewportHeight - clampedTop - MARGIN;

        return (
        <div 
          style={{ 
            position: 'fixed', 
            top: `${clampedTop}px`, 
            right: '2rem', 
            width: '100%', 
            maxWidth: '500px', 
            zIndex: 1000, 
            pointerEvents: 'auto'
          }}
        >
          <div 
            ref={panelRef}
            className="glass animate-fade-in"
            style={{ 
              borderRadius: '20px',
              padding: '2rem', 
              maxHeight: `${dynamicMaxHeight}px`,
              overflowY: 'auto'
            }}
          >
            <button 
              style={{ 
                position: 'absolute', 
                top: '1.25rem', 
                right: '1.25rem', 
                background: 'var(--panel-bg)', 
                border: 'none', 
                color: 'var(--text-secondary)', 
                cursor: 'pointer', 
                padding: '0.4rem', 
                borderRadius: '50%', 
                display: 'flex' 
              }}
              onClick={() => setSelectedIssue(null)}
            >
              <X size={20} />
            </button>
            
            <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span className={`section-tag ${getTagColor(selectedIssue['Section Heading'])}`} style={{ marginBottom: '0.5rem' }}>
                  {selectedIssue['Section Heading']}
                </span>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginTop: '0.5rem', color: 'var(--text-primary)' }}>Issue Details</h2>
              </div>
              <div style={{ marginTop: '0.5rem' }}>
                {getStatusBadge(selectedIssue['Status'])}
              </div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>Sub-Section</h4>
                <p style={{ fontSize: '1.1rem', fontWeight: '600', color: 'var(--text-primary)' }}>{selectedIssue['Sub-Section Heading']}</p>
              </div>

              {selectedIssue['Content'] && (
                <div className="glass-panel" style={{ padding: '1rem' }}>
                  <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Content Reference</h4>
                  <p style={{ whiteSpace: 'pre-wrap', fontSize: '0.9rem', lineHeight: '1.6', color: 'var(--text-primary)' }}>{selectedIssue['Content']}</p>
                </div>
              )}

              {selectedIssue['Gap / Issue'] && (
                <div className="glass-panel" style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.08)', borderColor: 'rgba(239, 68, 68, 0.3)' }}>
                  <h4 style={{ color: 'var(--danger)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <AlertCircle size={14} /> Gap / Issue
                  </h4>
                  <p style={{ whiteSpace: 'pre-wrap', fontSize: '0.9rem', lineHeight: '1.6', color: 'var(--text-primary)', fontWeight: '500' }}>{selectedIssue['Gap / Issue']}</p>
                </div>
              )}

              {selectedIssue['Fix Suggested'] && (
                <div className="glass-panel" style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.08)', borderColor: 'rgba(16, 185, 129, 0.3)' }}>
                  <h4 style={{ color: 'var(--success)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Suggested Fix</h4>
                  <p style={{ whiteSpace: 'pre-wrap', fontSize: '0.9rem', lineHeight: '1.6', color: 'var(--text-primary)', fontWeight: '500' }}>{selectedIssue['Fix Suggested']}</p>
                </div>
              )}

              <div className="glass-panel" style={{ padding: '1rem', background: 'rgba(56, 189, 248, 0.08)', borderColor: 'rgba(56, 189, 248, 0.3)' }}>
                <h4 style={{ color: 'var(--accent-color)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Developer Remarks</h4>
                <p style={{ whiteSpace: 'pre-wrap', fontSize: '0.9rem', lineHeight: '1.6', color: 'var(--text-primary)' }}>
                  {selectedIssue['Remarks'] && selectedIssue['Remarks'] !== 'nan' && selectedIssue['Remarks'].trim() !== ''
                    ? selectedIssue['Remarks'] 
                    : "No remarks."}
                </p>
              </div>
            </div>
          </div>
        </div>
        );
      })()}

      {/* Backdrop */}
      {selectedIssue && (
        <div 
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.2)', zIndex: 999 }} 
          onClick={() => setSelectedIssue(null)}
        />
      )}
    </div>
  );
};

export default Dashboard;

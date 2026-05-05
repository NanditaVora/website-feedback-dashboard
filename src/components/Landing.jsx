import React from 'react';
import { ArrowRight, Activity, FileSpreadsheet, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';

const Landing = ({ navigateToProgram, data }) => {
  const totalPrograms = data.length;
  const totalIssues = data.reduce((acc, curr) => acc + curr.issues.length, 0);

  // Prepare chart data
  const chartData = data.map(program => ({
    name: program.name.length > 30 ? program.name.substring(0, 30) + '...' : program.name,
    issues: program.issues.length,
    id: program.id
  })).sort((a, b) => b.issues - a.issues);

  // Prepare Pie Chart data
  const sectionCounts = {};
  data.forEach(program => {
    program.issues.forEach(issue => {
      const section = issue['Section Heading'] || 'Other';
      sectionCounts[section] = (sectionCounts[section] || 0) + 1;
    });
  });
  const pieData = Object.entries(sectionCounts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  // Modern vibrant colors for the bars and pie slices
  const colors = ['#38bdf8', '#818cf8', '#c084fc', '#f472b6', '#fb7185', '#fbbf24', '#34d399', '#2dd4bf', '#a3e635'];

  return (
    <div className="container animate-fade-in" style={{ padding: '2rem 2rem 4rem 2rem' }}>
      <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 3rem auto' }}>
        <h1 style={{ fontSize: '3.5rem', fontWeight: '800', marginBottom: '1.5rem', lineHeight: '1.1' }}>
          Website <span className="text-gradient">Feedback</span> Analysis
        </h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          Comprehensive overview of identified gaps, issues, and suggested fixes across our educational programs.
        </p>
        <button className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '1rem 2rem' }} onClick={() => navigateToProgram(null)}>
          Explore Dashboard <ArrowRight size={20} />
        </button>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
        <div className="glass-panel animate-fade-in delay-100" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <div style={{ background: 'rgba(99, 102, 241, 0.1)', padding: '1rem', borderRadius: '50%', marginBottom: '1rem' }}>
            <FileSpreadsheet size={32} color="var(--accent-color)" />
          </div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.5rem' }}>{totalPrograms} Programs</h3>
          <p style={{ color: 'var(--text-secondary)' }}>Analyzed and aggregated from raw data sources.</p>
        </div>
        
        <div className="glass-panel animate-fade-in delay-200" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '1rem', borderRadius: '50%', marginBottom: '1rem' }}>
            <AlertTriangle size={32} color="var(--danger)" />
          </div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.5rem' }}>{totalIssues} Issues Found</h3>
          <p style={{ color: 'var(--text-secondary)' }}>Detailed feedback requiring review and fixes.</p>
        </div>

        <div className="glass-panel animate-fade-in delay-400" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '1rem', borderRadius: '50%', marginBottom: '1rem' }}>
            <Activity size={32} color="var(--success)" />
          </div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.5rem' }}>Interactive UI</h3>
          <p style={{ color: 'var(--text-secondary)' }}>Easily navigate through gaps and proposed fixes.</p>
        </div>
      </div>

      {/* Interactive Graphical Dashboard */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '2rem' }}>
        <div className="glass-panel animate-fade-in delay-300" style={{ padding: '2rem' }}>
          <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: '700' }}>Issues per Program</h2>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Click a bar to view details</span>
          </div>
          <div style={{ width: '100%', height: '400px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                <XAxis type="number" stroke="var(--text-secondary)" tick={{ fill: 'var(--text-secondary)' }} />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  width={200} 
                  stroke="var(--text-secondary)" 
                  tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} 
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 17, 26, 0.9)', 
                    border: '1px solid var(--glass-border)',
                    borderRadius: '8px',
                    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
                  }}
                  itemStyle={{ color: 'var(--text-primary)' }}
                />
                <Bar 
                  dataKey="issues" 
                  name="Total Issues"
                  radius={[0, 4, 4, 0]}
                  onClick={(data) => {
                    if (data && data.id) navigateToProgram(data.id);
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel animate-fade-in delay-400" style={{ padding: '2rem' }}>
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: '700' }}>Issues by Section</h2>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Distribution across all courses</span>
          </div>
          <div style={{ width: '100%', height: '400px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={140}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 17, 26, 0.9)', 
                    border: '1px solid var(--glass-border)',
                    borderRadius: '8px',
                    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
                  }}
                  itemStyle={{ color: 'var(--text-primary)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;

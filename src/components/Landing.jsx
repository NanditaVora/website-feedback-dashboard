import React from 'react';
import { ArrowRight, Activity, FileSpreadsheet, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts';

const Landing = ({ navigateToProgram, data }) => {
  const totalPrograms = data.length;
  const totalIssues = data.reduce((acc, curr) => acc + curr.issues.length, 0);

  const isFixed = (issue) => {
    const s = (issue['Status'] || '').toLowerCase();
    return s.includes('complete') || s.includes('done') || s.includes('fixed');
  };

  const totalFixed = data.reduce((acc, p) => acc + p.issues.filter(isFixed).length, 0);
  const totalOpen = totalIssues - totalFixed;

  // Colors for programs and sections
  const colors = ['#38bdf8', '#818cf8', '#c084fc', '#f472b6', '#fb7185', '#fbbf24', '#34d399', '#2dd4bf', '#a3e635'];

  // Bar chart: unique color per program for Open, green for Fixed
  const chartData = data.map((program, index) => {
    const fixed = program.issues.filter(isFixed).length;
    const open = program.issues.length - fixed;
    return {
      name: program.name.length > 25 ? program.name.substring(0, 25) + '…' : program.name,
      open,
      fixed,
      id: program.id,
      color: colors[index % colors.length]
    };
  }).sort((a, b) => (b.open + b.fixed) - (a.open + a.fixed));

  // Pie chart: issues by section with unique colors per section
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


  return (
    <div className="container animate-fade-in" style={{ padding: '2rem 2rem 4rem 2rem' }}>
      <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 3rem auto' }}>
        <h1 style={{ fontSize: '3.5rem', fontWeight: '800', marginBottom: '1.5rem', lineHeight: '1.1' }}>
          Product Page <span className="text-gradient">Insights</span>
        </h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          Comprehensive overview of identified gaps, issues, and suggested fixes across our educational programs.
        </p>
        <button className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '1rem 2rem' }} onClick={() => navigateToProgram(null)}>
          Explore Dashboard <ArrowRight size={20} />
        </button>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <div className="glass-panel animate-fade-in delay-100" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <div style={{ background: 'rgba(99, 102, 241, 0.1)', padding: '1rem', borderRadius: '50%', marginBottom: '1rem' }}>
            <FileSpreadsheet size={32} color="var(--accent-color)" />
          </div>
          <h3 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.25rem' }}>{totalPrograms}</h3>
          <p style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>Programs</p>
        </div>
        
        <div className="glass-panel animate-fade-in delay-200" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <div style={{ background: 'rgba(148, 163, 184, 0.1)', padding: '1rem', borderRadius: '50%', marginBottom: '1rem' }}>
            <Activity size={32} color="var(--text-secondary)" />
          </div>
          <h3 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.25rem' }}>{totalIssues}</h3>
          <p style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>Total Issues</p>
        </div>

        <div className="glass-panel animate-fade-in delay-300" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', background: 'rgba(239,68,68,0.05)', borderColor: 'rgba(239,68,68,0.2)' }}>
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '1rem', borderRadius: '50%', marginBottom: '1rem' }}>
            <AlertTriangle size={32} color="var(--danger)" />
          </div>
          <h3 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.25rem', color: 'var(--danger)' }}>{totalOpen}</h3>
          <p style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>Open</p>
        </div>

        <div className="glass-panel animate-fade-in delay-400" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', background: 'rgba(16,185,129,0.05)', borderColor: 'rgba(16,185,129,0.2)' }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '1rem', borderRadius: '50%', marginBottom: '1rem' }}>
            <Activity size={32} color="var(--success)" />
          </div>
          <h3 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.25rem', color: 'var(--success)' }}>{totalFixed}</h3>
          <p style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>Fixed</p>
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
                <XAxis type="number" stroke="var(--text-secondary)" tick={{ fill: 'var(--text-secondary)' }} allowDecimals={false} />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  width={200} 
                  stroke="var(--text-secondary)" 
                  tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} 
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ backgroundColor: 'rgba(15,17,26,0.95)', border: '1px solid var(--glass-border)', borderRadius: '8px' }}
                  itemStyle={{ color: 'var(--text-primary)' }}
                />
                <Legend wrapperStyle={{ color: 'var(--text-secondary)', fontSize: '0.85rem', paddingTop: '0.5rem' }} />
                {/* Open bar: unique program color via Cell */}
                <Bar dataKey="open" name="Open" stackId="a" radius={[0, 0, 0, 0]}
                  onClick={(d) => { if (d && d.id) navigateToProgram(d.id); }}
                  style={{ cursor: 'pointer' }}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`open-${index}`} fill={entry.color} />
                  ))}
                </Bar>
                {/* Fixed bar: consistent green */}
                <Bar dataKey="fixed" name="Fixed" stackId="a" fill="#34d399" radius={[0, 4, 4, 0]}
                  onClick={(d) => { if (d && d.id) navigateToProgram(d.id); }}
                  style={{ cursor: 'pointer' }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel animate-fade-in delay-400" style={{ padding: '2rem' }}>
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: '700' }}>Issues by Section</h2>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Distribution across all programs</span>
          </div>
          <div style={{ width: '100%', height: '370px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="45%"
                  innerRadius={70}
                  outerRadius={120}
                  paddingAngle={4}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(15,17,26,0.95)', border: '1px solid var(--glass-border)', borderRadius: '8px' }}
                  itemStyle={{ color: 'var(--text-primary)' }}
                  formatter={(value, name) => [`${value} issues`, name]}
                />
                <Legend wrapperStyle={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
